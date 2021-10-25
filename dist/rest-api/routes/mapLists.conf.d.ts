import { FastifyPluginCallback } from "fastify";
import { PluginOptions } from "./..";
import { GoogleSpreadsheet } from "google-spreadsheet";
declare const plugin: FastifyPluginCallback<PluginOptions>;
export interface MapListsGeneratorConfig {
    googleSheetsId: string;
    googleSheetsAPIKey: string;
}
export interface MapPools {
    [key: string]: any;
    certified: string[];
    uncertified: string[];
    small: string[];
    medium: string[];
    large: string[];
    extraLarge: string[];
    misc: string[];
}
export interface ExpectedMapType {
    [key: string]: any;
    fileName: string;
    name: string;
    width: number;
    height: number;
    certified: 1 | "nil";
    inPool: 1;
}
export declare class MapListsGenerator {
    protected config: MapListsGeneratorConfig;
    protected doc: GoogleSpreadsheet;
    constructor(config: MapListsGeneratorConfig);
    generate(): Promise<{
        mapPools: MapPools;
        mapListsStr: string;
    }>;
    protected getMapListsConf(mapPools: MapPools): string;
}
export default plugin;
