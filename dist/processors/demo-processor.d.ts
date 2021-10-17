import { Signal } from "jaz-ts-utils";
import { Database } from "../database";
import { DBSchema } from "../model/db";
import { FileProcessor as FileProcessor, FileProcessorConfig } from "./file-processor";
export declare class DemoProcessor extends FileProcessor {
    onDemoProcessed: Signal<DBSchema.Demo.Instance>;
    protected db: Database;
    constructor(config: FileProcessorConfig);
    protected processFile(filePath: string): Promise<"delete" | undefined>;
    protected uploadFileToObjectStorage(filePath: string, prefix?: string): Promise<import("axios").AxiosResponse<any>>;
}
