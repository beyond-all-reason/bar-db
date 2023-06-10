import axios from "axios";
import * as crypto from "crypto";
import * as fs from "fs";
import { delay } from "jaz-ts-utils";
import { Op } from "sequelize";
import { pipeline, Readable } from "stream";
import * as util from "util";

import { Database } from "~/database";

const pipelinePromise = util.promisify(pipeline);

export interface MapsMetadataMapPollerConfig {
    db: Database;
    pollUrl: string;
    pollIntervalMs: number;
    processorDir: string;
    verbose?: boolean;
}

// As defined in maps-metadata repo.
interface LiveMapEntry {
    downloadURL: string;
    fileName: string;
    md5: string;
    springName: string;
}

async function downloadFile(url: string, destination: string): Promise<void> {
    const res = await axios.get(url, { responseType: "stream" });
    const resStream = res.data as Readable;
    await pipelinePromise(resStream, fs.createWriteStream(destination));
}

async function verifyFileMd5(filePath: string, expected: string): Promise<void> {
    const input = fs.createReadStream(filePath);
    const hash = crypto.createHash("md5");
    await pipelinePromise(input, hash);
    if (hash.digest("hex") !== expected) {
        throw new Error(`MD5 mismatch for file ${filePath}`);
    }
}

export class MapsMetadataMapPoller {
    private pollIntervalMs: number;
    private pollUrl: string;
    private db: Database;
    private processorDir: string;
    private verbose: boolean;

    constructor(opts: MapsMetadataMapPollerConfig) {
        this.db = opts.db;
        this.pollIntervalMs = opts.pollIntervalMs;
        this.pollUrl = opts.pollUrl;
        this.processorDir = opts.processorDir;
        this.verbose = !!opts.verbose;
    }

    public async startPolling(): Promise<never> {
        while (true) {
            try {
                await this.poll();
            } catch (err) {
                console.log("Error polling new maps");
                console.log(err);
            }
            await delay(this.pollIntervalMs);
        }
    }

    private async poll(): Promise<void> {
        const liveMaps = (await axios.get<[LiveMapEntry]>(this.pollUrl, { responseType: "json", timeout: 5000 })).data;

        // Fetch spring names of maps that have been parsed successfully.
        const parsedMaps = await this.db.schema.map.findAll({
            attributes: ["scriptName"],
            where: { scriptName: { [Op.in]: liveMaps.map(m => m.springName) } }
        });
        const parsedMapSpringNames = new Set(parsedMaps.map(m => m.scriptName));

        // Fetch file names of maps that have failed to parse.
        const erroredMapsFileNames = new Set(await fs.promises.readdir(`${this.processorDir}/errored`));

        // Fetch file names that are already downloaded but not yet processed.
        const unprocessedMapsFileNames = new Set(await fs.promises.readdir(`${this.processorDir}/unprocessed`));

        // Download missing maps.
        const missingMaps = liveMaps.filter(m =>
            !parsedMapSpringNames.has(m.springName) &&
            !erroredMapsFileNames.has(m.fileName) &&
            !unprocessedMapsFileNames.has(m.fileName));
        if (this.verbose) {
            console.log(`Found ${missingMaps.length} missing maps: ${missingMaps.map(m => m.springName).join(", ")}`);
        }
        let error = null;
        for (const map of missingMaps) {
            const mapFilePath = `${this.processorDir}/unprocessed/${map.fileName}`;
            const tmpMapFilePath = `${mapFilePath}.tmp`;
            try {
                await downloadFile(map.downloadURL, tmpMapFilePath);
                await verifyFileMd5(tmpMapFilePath, map.md5);
                await fs.promises.rename(tmpMapFilePath, mapFilePath);
                if (this.verbose) {
                    console.log(`Downloaded ${map.springName}: ${map.fileName}`);
                }
            } catch (err) {
                // Catch and log errors, but continue downloading other maps.
                console.error(`Error downloading ${map.springName}: ${map.fileName}`);
                console.error(err);
                error = err;
            } finally {
                await fs.promises.rm(tmpMapFilePath, { force: true });
            }
        }
        // Throw the last error if any.
        if (error) {
            throw error;
        }
    }
}
