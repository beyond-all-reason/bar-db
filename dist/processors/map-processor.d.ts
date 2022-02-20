import { Signal } from "jaz-ts-utils";
import { MapParser, SpringMap } from "spring-map-parser";
import { Database } from "../database";
import { DBSchema } from "../model/db";
import { FileProcessor, FileProcessorConfig } from "./file-processor";
export declare class MapProcessor extends FileProcessor {
    onMapProcessed: Signal<DBSchema.SpringMap.Instance>;
    protected mapParser: MapParser;
    protected db: Database;
    constructor(config: FileProcessorConfig);
    protected processFile(filePath: string): Promise<string>;
    protected uploadFileToObjectStorage(filePath: string, prefix?: string): Promise<import("axios").AxiosResponse<any>>;
}
export declare function mapDataToMapSchema(mapData: SpringMap): Omit<DBSchema.SpringMap.Schema, "id">;
