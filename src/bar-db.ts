import * as fs from "fs";
import { format } from "util";

import { BARDBConfig, defaultBARDBConfig } from "~/bar-db-config";
import { Database } from "~/database";
import { MemoryStore } from "~/memory-store";
import { BalanceChangeProcessor } from "~/processors/balance-change-processor";
import { DemoProcessor } from "~/processors/demo-processor";
import { MapsMetadataMapPoller } from "~/processors/map-poller";
import { MapProcessor } from "~/processors/map-processor";

export class BARDB {
    protected config: BARDBConfig;
    protected db: Database;
    protected mapProcessor: MapProcessor;
    protected demoProcessor: DemoProcessor;
    protected balanceChangeProcessor?: BalanceChangeProcessor;
    protected memoryStore?: MemoryStore;
    protected mapPoller?: MapsMetadataMapPoller;

    constructor(config: Partial<BARDBConfig>) {
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
            dir: this.config.mapsDir,
            fileExt: [".sd7", ".sdz"],
            verbose: this.config.verbose,
            objectStorage: this.config.objectStorage,
            storeFile: this.config.storeMaps || "internal"
        });

        this.mapProcessor.onMapProcessed.add(() => {
            this.memoryStore?.saveMapsToMemory();
        });

        if (this.config.pollMapsFromMapsMetadata) {
            this.mapPoller = new MapsMetadataMapPoller({
                db: this.db,
                pollUrl: this.config.mapsMetadataPoller.url,
                pollIntervalMs: this.config.mapsMetadataPoller.pollIntervalMs,
                processorDir: this.config.mapsDir,
                verbose: this.config.verbose,
                healthCheckUrl: this.config.mapsMetadataPoller.healthCheckUrl,
            });
        }

        this.demoProcessor = new DemoProcessor({
            db: this.db,
            dir: this.config.demosDir,
            fileExt: [".sdfz"],
            verbose: this.config.verbose,
            objectStorage: this.config.objectStorage,
            storeFile: this.config.storeDemos || "internal",
            sldbConfig: this.config.sldb
        });

        this.demoProcessor.onDemoProcessed.add(() => {
            this.memoryStore?.saveUsersToMemory();
        });

        if (this.config.processBalanceChanges) {
            this.balanceChangeProcessor = new BalanceChangeProcessor({ ...this.config.balanceChanges }, this.db);
        }

        if (this.config.db.initMemoryStore) {
            this.memoryStore = new MemoryStore(this.db, this.config.redis);
        }
    }

    public async init() {
        await this.db.init();
        await this.mapProcessor.init();
        await this.demoProcessor.init();

        if (this.balanceChangeProcessor) {
            await this.balanceChangeProcessor.init();
        }

        if (this.memoryStore) {
            await this.memoryStore.init();
        }

        console.log("Polling for maps...");
        this.mapProcessor.processFiles();

        console.log("Polling for demos...");
        this.demoProcessor.processFiles();

        if (this.mapPoller) {
            console.log("Polling for maps from maps metadata...");
            this.mapPoller.startPolling();
        }

        if (this.config.processBalanceChanges) {
            this.balanceChangeProcessor?.processBalanceChanges();
        }
    }
}