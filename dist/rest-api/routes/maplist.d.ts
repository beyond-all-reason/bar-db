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
    duel: string[];
    team: {
        [key: number]: any;
        4?: string[];
        6?: string[];
        8?: string[];
        10?: string[];
        12?: string[];
        14?: string[];
        16?: string[];
    };
    ffa: {
        [key: number]: any;
        3?: string[];
        4?: string[];
        5?: string[];
        6?: string[];
        7?: string[];
        8?: string[];
        9?: string[];
        10?: string[];
        11?: string[];
        12?: string[];
        13?: string[];
        14?: string[];
        15?: string[];
        16?: string[];
    };
    teamffa: {
        [key: number]: any;
        6?: string[];
        9?: string[];
        12?: string[];
        16?: string[];
    };
    misc: string[];
}
export interface ExpectedMapType {
    [key: string]: any;
    fileName: string;
    name: string;
    width: number;
    height: number;
    duel: 1 | "nil";
    team: 1 | "nil";
    ffa: 1 | "nil";
    certified: 1 | "nil";
    inPool: 1;
    teamCount: number | null;
    playerCount: number | null;
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
