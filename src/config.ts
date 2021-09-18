export type Config = {
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
    mapsDir: string;
    demosDir: string;
    verbose: boolean;
    objectStorage?: {
        authUrl: string;
        containerUrl: string;
        username: string;
        password: string;
    };
};

export const defaultConfig: Config = {
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
    mapsDir: "/var/www/maps",
    demosDir: "/var/www/demos",
    verbose: true
};