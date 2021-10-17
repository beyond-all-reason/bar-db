"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultBARDBConfig = void 0;
;
exports.defaultBARDBConfig = {
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
    maplists: {
        googleSheetsId: "1rn4kIIc9Nnyv_ZiBxXvNXdhUSnh15aLrLsQXmtUBJt8",
        googleSheetsAPIKey: "123454"
    },
    mapsDir: "/var/www/maps",
    demosDir: "/var/www/demos",
    storeDemos: "internal",
    storeMaps: "internal",
    apiPort: 3001,
    verbose: true
};
//# sourceMappingURL=bar-db-config.js.map