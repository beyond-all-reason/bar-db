import { Signal } from "jaz-ts-utils";
import { SLDBClient, SLDBModel } from "sldbts";
import { Database } from "../database";
import { DBSchema } from "../model/db";
import { FileProcessor as FileProcessor, FileProcessorConfig } from "./file-processor";
export declare class DemoProcessor extends FileProcessor {
    onDemoProcessed: Signal<DBSchema.Demo.Instance>;
    protected db: Database;
    protected sldbClient: SLDBClient;
    constructor(config: FileProcessorConfig);
    protected processFile(filePath: string): Promise<"delete" | undefined>;
    protected getSLDBMatchData(matchId: string): Promise<SLDBModel.MatchResult>;
    protected uploadFileToObjectStorage(filePath: string, prefix?: string): Promise<import("axios").AxiosResponse<any>>;
}
