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
        owner: string,
        repo: string,
        auth: string,
        pollIntervalMs: number
    };
    sldb: {
        host: string,
        port: number,
        username: string,
        password: string,
        leaderboards: string[],
        pollIntervalMs: number,
        verbose: boolean
    };
    lobby: SpringLobbyProtocolClientConfig;
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
};

export const defaultBARDBConfig: BARDBConfig = {
    db: {
        host: "localhost",
        port: 5432,
        username: "postgres",
        password: "postgres",
        createSchemaDiagram: false,
        logSQL: false,
        alterDbSchema: false,
        syncModel: true,
        initMemoryStore: true,
    },
    balanceChanges: {
        owner: "beyond-all-reason",
        repo: "beyond-all-reason",
        auth: "1234",
        pollIntervalMs: 1800000
    },
    sldb: {
        host: "112.213.34.51",
        port: 8300,
        username: "xmlrpcUsername",
        password: "xmlrpcPassword",
        leaderboards: ["Duel", "Team", "FFA"],
        pollIntervalMs: 60000,
        verbose: false
    },
    lobby: {
        host: "bar.teifion.co.uk",
        port: 8200,
        password: "BARDBBOT",
        username: "1234545678",
        lobbySignature: "BARDB"
    },
    mapsDir: "/var/www/maps",
    demosDir: "/var/www/demos",
    storeDemos: "internal",
    storeMaps: "internal",
    apiPort: 3001,
    verbose: true
};