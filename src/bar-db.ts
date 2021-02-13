import { Database, DatabaseConfig } from "./database";
import { DemoProcessor } from "./demo-processor";
import { MapProcessor } from "./map-processor";

export interface BARDBConfig extends DatabaseConfig {
    apiPort?: number;
}

export class BARDB {
    protected config: BARDBConfig;
    protected db: Database;
    protected mapProcessor: MapProcessor;
    protected demoProcessor: DemoProcessor;

    constructor(config: BARDBConfig) {
        this.config = config;

        this.db = new Database({
            dbHost: this.config.dbHost,
            dbPort: this.config.dbPort,
            dbUsername: this.config.dbUsername,
            dbPassword: this.config.dbPassword,
            verbose: this.config.verbose,
            createSchemaDiagram: this.config.createSchemaDiagram
        });

        this.mapProcessor = new MapProcessor({ db: this.db, dir: "maps", fileExt: [".sd7", ".sdz"], verbose: this.config.verbose });
        this.demoProcessor = new DemoProcessor({ db: this.db, dir: "demos", fileExt: [".sdfz"], verbose: this.config.verbose });
    }

    public async init() {
        await this.db.init();
        await this.mapProcessor.init();
        await this.demoProcessor.init();

        console.log("Scanning for maps...");
        this.mapProcessor.processFiles();

        console.log("Scanning for demos...");
        this.demoProcessor.processFiles();
    }
}