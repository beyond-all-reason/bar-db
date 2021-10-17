import { SpringLobbyProtocolClientConfig } from "sluts";
export interface BARDBConfig {
    db: {
        host: string;
        port: number;
        username: string;
        password: string;
        createSchemaDiagram: boolean;
        logSQL: boolean;
        alterDbSchema: boolean;
        syncModel: boolean;
        initMemoryStore: boolean;
    };
    balanceChanges: {
        owner: string;
        repo: string;
        auth: string;
        pollIntervalMs: number;
    };
    sldb: {
        host: string;
        port: number;
        username: string;
        password: string;
        leaderboards: string[];
        pollIntervalMs: number;
        verbose: boolean;
    };
    lobby: SpringLobbyProtocolClientConfig;
    maplists: {
        googleSheetsId: string;
        googleSheetsAPIKey: string;
    };
    mapsDir: string;
    demosDir: string;
    objectStorage?: {
        authUrl: string;
        containerUrl: string;
        username: string;
        password: string;
    };
    storeDemos?: "internal" | "external" | "both";
    storeMaps?: "internal" | "external" | "both";
    apiPort: number;
    verbose: boolean;
}
export declare const defaultBARDBConfig: BARDBConfig;
