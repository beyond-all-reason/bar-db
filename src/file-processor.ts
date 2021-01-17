import { promises as fs } from "fs";
import { delay } from "jaz-ts-utils";
import * as path from "path";
import { Database } from "./database";

export interface FileProcessorConfig {
    db: Database;
    dir: string;
    fileExt: string;
    verbose?: boolean;
    filePollMs?: number;
}

const defaultFileProcessorConfig: Partial<FileProcessorConfig> = {
    verbose: false,
    filePollMs: 5000
}

export abstract class FileProcessor {
    protected config: FileProcessorConfig;

    constructor(config: FileProcessorConfig) {
        this.config = Object.assign({}, defaultFileProcessorConfig, config);
    }

    public async init() {
        await fs.mkdir(`${this.config.dir}/processed`, { recursive: true });
        await fs.mkdir(`${this.config.dir}/unprocessed`, { recursive: true });
        await fs.mkdir(`${this.config.dir}/errored`, { recursive: true });
    }

    public async processFiles() {
        const fileName = await this.getUnprocessedFile();

        if (fileName) {
            const unprocessedDemoPath = path.join(this.config.dir, "unprocessed", fileName);
            const processedDemoPath = path.join(this.config.dir, "processed", fileName);
            const erroredDemoPath = path.join(this.config.dir, "errored", fileName);

            try {
                console.log(`Processing file: ${fileName}`);
                const outPath = await this.processFile(unprocessedDemoPath);
                if (outPath) {
                    await fs.rename(unprocessedDemoPath, path.join(outPath, fileName));
                } else {
                    await fs.rename(unprocessedDemoPath, processedDemoPath);
                }
            } catch (err) {
                console.log(`Failed to process file: ${fileName}.`);
                console.error(err);

                await fs.rename(unprocessedDemoPath, erroredDemoPath);
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
        const files = await fs.readdir(unprocessedPath);
        return files.find(file => path.extname(file) === this.config.fileExt);
    }
}