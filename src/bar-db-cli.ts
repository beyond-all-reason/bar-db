#!/usr/bin/env node
import yargs from "yargs";
import { BARDB } from "./bar-db";
import { defaultDatabaseConfig } from "./database";

const args = yargs(process.argv.slice(2))
    .option("verbose", { alias: "v", type: "boolean", description: "Run with verbose logging", default: defaultDatabaseConfig.verbose })
    .option("pghost", { type: "string", description: "Host address of PostgreSQL database", default: "localhost" })
    .option("pgport", { type: "number", description: "Port of PostgreSQL database", default: 5432 })
    .option("pgusername", { type: "string", description: "Run with verbose logging", default: "postgres" })
    .option("pgpassword", { type: "string", description: "Run with verbose logging", default: "test" })
    .option("diagram", { type: "boolean", description: "Create an SVG diagram of the database schema", default: defaultDatabaseConfig.createSchemaDiagram })
    .option("logsql", { type: "boolean", description: "Log all executed SQL", default: defaultDatabaseConfig.logSQL })
    .option("alter", { type: "boolean", description: "Alter DB Schema", default: defaultDatabaseConfig.alterDbSchema })
    .argv;

const barDb = new BARDB({
    dbHost: args.pghost,
    dbPort: args.pgport,
    dbUsername: args.pgusername,
    dbPassword: args.pgpassword,
    verbose: args.verbose,
    createSchemaDiagram: args.diagram,
    logSQL: args.logsql,
    alterDbSchema: args.alter
});

barDb.init();