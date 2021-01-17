import { Database, DatabaseConfig } from "./database";
import { DemoProcessor } from "./demo-processor";
import { MapProcessor } from "./map-processor";

export interface DataProcessorConfig extends DatabaseConfig {

}

export class DataProcessor {
    protected config: DataProcessorConfig;
    protected db: Database;
    protected mapProcessor: MapProcessor;
    protected demoProcessor: DemoProcessor;

    constructor(config: DataProcessorConfig) {
        this.config = config;

        this.db = new Database({
            host: this.config.host,
            port: this.config.port,
            username: this.config.username,
            password: this.config.password,
            verbose: this.config.verbose,
            createSchemaDiagram: this.config.createSchemaDiagram
        });
    
        this.mapProcessor = new MapProcessor({ db: this.db, dir: "maps", fileExt: ".sd7", verbose: this.config.verbose });
        this.demoProcessor = new DemoProcessor({ db: this.db, dir: "demos", fileExt: ".sdfz", verbose: this.config.verbose });
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