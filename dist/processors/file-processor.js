"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileProcessor = void 0;
const fs = __importStar(require("fs"));
const jaz_ts_utils_1 = require("jaz-ts-utils");
const path = __importStar(require("path"));
const axios_1 = __importDefault(require("axios"));
const defaultFileProcessorConfig = {
    verbose: false,
    filePollMs: 5000,
    storeFile: "internal"
};
class FileProcessor {
    constructor(config) {
        this.authToken = "123";
        this.config = Object.assign({}, defaultFileProcessorConfig, config);
    }
    async init() {
        await fs.promises.mkdir(`${this.config.dir}/processed`, { recursive: true });
        await fs.promises.mkdir(`${this.config.dir}/unprocessed`, { recursive: true });
        await fs.promises.mkdir(`${this.config.dir}/errored`, { recursive: true });
    }
    async processFiles() {
        const fileName = await this.getUnprocessedFile();
        if (fileName) {
            const unprocessedPath = path.join(this.config.dir, "unprocessed", fileName);
            const processedPath = path.join(this.config.dir, "processed", fileName);
            const erroredPath = path.join(this.config.dir, "errored", fileName);
            console.log(`processing file: ${fileName}`);
            console.time("process file");
            try {
                const outPath = await this.processFile(unprocessedPath);
                if (this.config.objectStorage && (this.config.storeFile === "external" || this.config.storeFile === "both")) {
                    try {
                        console.log("storing file externally");
                        const response = await this.uploadFileToObjectStorage(unprocessedPath);
                        if (response && response.status === 201 || response.status === 200) {
                            console.log(`${fileName} uploaded to object storage`);
                        }
                    }
                    catch (err) {
                        console.log("error uploading to object storage");
                        console.log(err);
                        await fs.promises.copyFile(unprocessedPath, erroredPath);
                    }
                }
                if (this.config.storeFile === "internal" || this.config.storeFile === "both") {
                    console.log("storing file internally");
                    if (outPath && outPath !== "delete") {
                        await fs.promises.copyFile(unprocessedPath, path.join(outPath, fileName));
                    }
                    else if (outPath === "delete") {
                    }
                    else {
                        await fs.promises.copyFile(unprocessedPath, processedPath);
                    }
                }
                console.timeEnd("process file");
                console.log(`deleting file: ${unprocessedPath}`);
                await fs.promises.unlink(unprocessedPath);
            }
            catch (err) {
                console.log("error processing file, moving to errored");
                console.log(err);
                await fs.promises.rename(unprocessedPath, erroredPath);
            }
        }
        else {
            await jaz_ts_utils_1.delay(this.config.filePollMs);
        }
        this.processFiles();
    }
    async processFile(filePath) {
        return;
    }
    async getUnprocessedFile() {
        const unprocessedPath = path.join(this.config.dir, "unprocessed");
        const files = await fs.promises.readdir(unprocessedPath);
        return files.find(file => this.config.fileExt.includes(path.extname(file)));
    }
    async uploadFileToObjectStorage(filePath, prefix = "/") {
        var _a, _b;
        try {
            const fileName = path.basename(filePath);
            const response = await axios_1.default({
                method: "put",
                url: `${(_a = this.config.objectStorage) === null || _a === void 0 ? void 0 : _a.containerUrl}${prefix}/${fileName}`,
                headers: {
                    "X-Auth-Token": this.authToken
                },
                data: fs.createReadStream(filePath),
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
            });
            return response;
        }
        catch (err) {
            if (((_b = err === null || err === void 0 ? void 0 : err.response) === null || _b === void 0 ? void 0 : _b.status) === 401) {
                console.log("Fetching new auth token for object storage");
                await this.fetchNewAuthToken();
                return await this.uploadFileToObjectStorage(filePath, prefix);
            }
            throw err;
        }
    }
    async fetchNewAuthToken() {
        var _a, _b, _c;
        const response = await axios_1.default({
            method: "post",
            url: `${(_a = this.config.objectStorage) === null || _a === void 0 ? void 0 : _a.authUrl}/v3/auth/tokens`,
            headers: {
                "Content-Type": "application/json"
            },
            data: {
                auth: {
                    identity: {
                        methods: [
                            "password"
                        ],
                        password: {
                            user: {
                                name: (_b = this.config.objectStorage) === null || _b === void 0 ? void 0 : _b.username,
                                domain: {
                                    name: "Default"
                                },
                                password: (_c = this.config.objectStorage) === null || _c === void 0 ? void 0 : _c.password
                            }
                        }
                    }
                }
            }
        });
        if (response.status === 201 || response.status === 200) {
            this.authToken = response.headers["x-subject-token"];
        }
        else {
            console.error(response);
            throw new Error("Unable to get auth token");
        }
    }
}
exports.FileProcessor = FileProcessor;
//# sourceMappingURL=file-processor.js.map