#!/usr/bin/env node
import yargs from "yargs";

const args = yargs(process.argv.slice(2))
    .option("verbose", { alias: "v", type: "boolean", description: "Run with verbose logging", default: true })
    .option("pghost", { type: "string", description: "Host address of PostgreSQL database", default: "localhost" })
    .option("pgport", { type: "number", description: "Port of PostgreSQL database", default: 5432 })
    .option("pgusername", { type: "string", description: "Run with verbose logging", default: "postgres" })
    .option("pgpassword", { type: "string", description: "Run with verbose logging", default: "test" })
    .option("diagram", { type: "boolean", description: "Create an SVG diagram of the database schema", default: false })
    .option("apiport", { type: "number", description: "Port API server should serve on", default: 3005 })
    .argv;

import { BARDB } from "./bar-db";

const barDb = new BARDB({
    dbHost: args.pghost,
    dbPort: args.pgport,
    dbUsername: args.pgusername,
    dbPassword: args.pgpassword,
    verbose: args.verbose,
    createSchemaDiagram: args.diagram,
    apiPort: args.apiport
});

barDb.init();