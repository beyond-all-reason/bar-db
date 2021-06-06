import * as fs from "fs";
import { Optionals } from "jaz-ts-utils";
import { format } from "util";

import { BalanceChangeProcessor, BalanceChangeProcessorConfig } from "./balance-change-processor";
import { Database, DatabaseConfig } from "./database";
import { DemoProcessor } from "./demo-processor";
import { MapProcessor } from "./map-processor";

export interface BARDBConfig {
    db: DatabaseConfig;
    balanceChanges: BalanceChangeProcessorConfig;
    verbose?: boolean;
    errorLoggingFunction?: (err: string) => void;
}

const defaultBARDBConfig: Optionals<BARDBConfig> = {
    verbose: true,
    errorLoggingFunction: console.error
};

export class BARDB {
    protected config: BARDBConfig;
    protected db: Database;
    protected mapProcessor: MapProcessor;
    protected demoProcessor: DemoProcessor;
    protected balanceChangeProcessor: BalanceChangeProcessor;

    constructor(config: BARDBConfig) {
        this.config = Object.assign({}, defaultBARDBConfig, config);

        if (!fs.existsSync("logs")) {
            fs.mkdirSync("logs");
        }
        const writeStream = fs.createWriteStream("logs/error.log", { flags: "w" });
        //this.config.errorLoggingFunction = (err) => writeStream.write(err);

        global.console.error = (message?: any) => {
            writeStream.write(format(message) + "\n");
        };

        this.db = new Database(this.config.db);

        this.mapProcessor = new MapProcessor({
            db: this.db,
            dir: "maps",
            fileExt: [".sd7", ".sdz"],
            verbose: this.config.verbose
        });

        this.demoProcessor = new DemoProcessor({
            db: this.db,
            dir: "demos",
            fileExt: [".sdfz"],
            verbose: this.config.verbose
        });

        this.balanceChangeProcessor = new BalanceChangeProcessor({ ...this.config.balanceChanges, errorLoggingFunction: this.config.errorLoggingFunction }, this.db);
    }

    public async init() {
        await this.db.init();
        await this.mapProcessor.init();
        await this.demoProcessor.init();
        await this.balanceChangeProcessor.init();

        console.log("Scanning for maps...");
        this.mapProcessor.processFiles();

        console.log("Scanning for demos...");
        this.demoProcessor.processFiles();

        this.balanceChangeProcessor.processBalanceChanges();
    }
}