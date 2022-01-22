import { AxiosResponse } from "axios";
import { BARDBConfig } from "../bar-db-config";
import { Database } from "../database";
export interface FileProcessorConfig {
    bardbConfig: BARDBConfig;
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
export declare abstract class FileProcessor {
    protected config: FileProcessorConfig;
    protected authToken: string;
    constructor(config: FileProcessorConfig);
    init(): Promise<void>;
    processFiles(): Promise<void>;
    protected processFile(filePath: string): Promise<string | void>;
    protected getUnprocessedFile(): Promise<string | undefined>;
    protected uploadFileToObjectStorage(filePath: string, prefix?: string): Promise<AxiosResponse<any>>;
    protected fetchNewAuthToken(): Promise<void>;
}
