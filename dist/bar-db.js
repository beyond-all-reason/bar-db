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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BARDB = void 0;
const fs = __importStar(require("fs"));
const util_1 = require("util");
const bar_db_config_1 = require("./bar-db-config");
const database_1 = require("./database");
const memory_store_1 = require("./memory-store");
const balance_change_processor_1 = require("./processors/balance-change-processor");
const map_processor_1 = require("./processors/map-processor");
const demo_processor_1 = require("./processors/demo-processor");
class BARDB {
    constructor(config) {
        this.config = Object.assign({}, bar_db_config_1.defaultBARDBConfig, config);
        if (!fs.existsSync("logs")) {
            fs.mkdirSync("logs");
        }
        const writeStream = fs.createWriteStream("logs/error.log", { flags: "w" });
        //this.config.errorLoggingFunction = (err) => writeStream.write(err);
        global.console.error = (message) => {
            writeStream.write((0, util_1.format)(message) + "\n");
        };
        this.db = new database_1.Database(this.config.db);
        this.mapProcessor = new map_processor_1.MapProcessor({
            db: this.db,
            dir: this.config.mapsDir,
            fileExt: [".sd7", ".sdz"],
            verbose: this.config.verbose,
            objectStorage: this.config.objectStorage,
            storeFile: this.config.storeMaps || "internal"
        });
        this.mapProcessor.onMapProcessed.add(() => {
            var _a;
            (_a = this.memoryStore) === null || _a === void 0 ? void 0 : _a.saveMapsToMemory();
        });
        this.demoProcessor = new demo_processor_1.DemoProcessor({
            db: this.db,
            dir: this.config.demosDir,
            fileExt: [".sdfz"],
            verbose: this.config.verbose,
            objectStorage: this.config.objectStorage,
            storeFile: this.config.storeDemos || "internal"
        });
        this.demoProcessor.onDemoProcessed.add(() => {
            var _a;
            (_a = this.memoryStore) === null || _a === void 0 ? void 0 : _a.saveUsersToMemory();
        });
        this.balanceChangeProcessor = new balance_change_processor_1.BalanceChangeProcessor({ ...this.config.balanceChanges }, this.db);
        if (this.config.db.initMemoryStore) {
            this.memoryStore = new memory_store_1.MemoryStore(this.db);
        }
    }
    async init() {
        await this.db.init();
        await this.mapProcessor.init();
        await this.demoProcessor.init();
        await this.balanceChangeProcessor.init();
        if (this.memoryStore) {
            await this.memoryStore.init();
        }
        console.log("Polling for maps...");
        this.mapProcessor.processFiles();
        console.log("Polling for demos...");
        this.demoProcessor.processFiles();
        this.balanceChangeProcessor.processBalanceChanges();
    }
}
exports.BARDB = BARDB;
//# sourceMappingURL=bar-db.js.map