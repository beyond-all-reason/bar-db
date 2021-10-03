import * as fs from "fs";
import { delay } from "jaz-ts-utils";
import * as path from "path";
import axios, { AxiosResponse } from "axios";

import { Database } from "./database";

export interface FileProcessorConfig {
    db: Database;
    dir: string;
    fileExt: string[];
    verbose?: boolean;
    filePollMs?: number;
    objectStorage?: {
        authUrl: string;
        containerUrl: string;
        username: string;
        password: string;
    };
    storeFile?: "internal" | "external" | "both";
}

const defaultFileProcessorConfig: Partial<FileProcessorConfig> = {
    verbose: false,
    filePollMs: 5000,
    storeFile: "internal"
};

export abstract class FileProcessor {
    protected config: FileProcessorConfig;
    protected authToken: string = "123";

    constructor(config: FileProcessorConfig) {
        this.config = Object.assign({}, defaultFileProcessorConfig, config);
    }

    public async init() {
        await fs.promises.mkdir(`${this.config.dir}/processed`, { recursive: true });
        await fs.promises.mkdir(`${this.config.dir}/unprocessed`, { recursive: true });
        await fs.promises.mkdir(`${this.config.dir}/errored`, { recursive: true });
    }

    public async processFiles() {
        const fileName = await this.getUnprocessedFile();

        if (fileName) {
            const unprocessedPath = path.join(this.config.dir, "unprocessed", fileName);
            const processedPath = path.join(this.config.dir, "processed", fileName);
            const erroredPath = path.join(this.config.dir, "errored", fileName);

            try {
                console.log(`Processing file: ${fileName}`);
                console.time("process file");
                const outPath = await this.processFile(unprocessedPath);

                if (this.config.storeFile === "internal" || this.config.storeFile === "both") {
                    console.log("storing file internally");
                    if (outPath && outPath !== "delete") {
                        await fs.promises.rename(unprocessedPath, path.join(outPath, fileName));
                    } else if (outPath === "delete") {
                        console.log(`Deleting file: ${fileName}.`);
                        await fs.promises.unlink(unprocessedPath);
                    } else {
                        await fs.promises.rename(unprocessedPath, processedPath);
                    }
                }

                if (this.config.objectStorage && (this.config.storeFile === "external" || this.config.storeFile === "both")) {
                    try {
                        console.log("storing file externally");
                        const response = await this.uploadFileToObjectStorage(unprocessedPath);

                        if (response && response.status === 201 || response.status === 200) {
                            console.log(`${fileName} uploaded to object storage`);
                            await fs.promises.unlink(unprocessedPath);
                        }
                    } catch (err) {
                        console.log("Error uploading to object storage");
                        console.log(err);
                        throw err;
                    }
                }

                console.timeEnd("process file");
            } catch (err) {
                console.log(`Failed to process file: ${fileName}.`);
                console.error(err);

                await fs.promises.rename(unprocessedPath, erroredPath);
            }
        } else {
            await delay(this.config.filePollMs!);
        }

        this.processFiles();
    }

    protected async processFile(filePath: string) : Promise<string | void> {
        return;
    }

    protected async getUnprocessedFile() : Promise<string | undefined> {
        const unprocessedPath = path.join(this.config.dir, "unprocessed");
        const files = await fs.promises.readdir(unprocessedPath);
        return files.find(file => this.config.fileExt.includes(path.extname(file)));
    }

    protected async uploadFileToObjectStorage(filePath: string, prefix: string = "/") : Promise<AxiosResponse<any>> {
        try {
            const fileName = path.basename(filePath);

            const response = await axios({
                method: "put",
                url: `${this.config.objectStorage?.containerUrl}${prefix}/${fileName}`,
                headers: {
                    "X-Auth-Token": this.authToken
                },
                data: fs.createReadStream(filePath),
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
            });

            return response;
        } catch (err: any) {
            if (err?.response?.status === 401) {
                console.log("Fetching new auth token for object storage");
                await this.fetchNewAuthToken();
                return await this.uploadFileToObjectStorage(filePath, prefix);
            }

            throw err;
        }
    }

    protected async fetchNewAuthToken() : Promise<void> {
        const response = await axios({
            method: "post",
            url: `${this.config.objectStorage?.authUrl}/v3/auth/tokens`,
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
                                name: this.config.objectStorage?.username,
                                domain: {
                                    name: "Default"
                                },
                                password: this.config.objectStorage?.password
                            }
                        }
                    }
                }
            }
        });
    
        if (response.status === 201 || response.status === 200) {
            this.authToken = response.headers["x-subject-token"];
        } else {
            console.error(response);
            throw new Error("Unable to get auth token");
        }
    }
}