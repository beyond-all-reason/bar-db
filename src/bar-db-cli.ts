#!/usr/bin/env node
import yargs from "yargs";

const args = yargs(process.argv.slice(2))
    .option("verbose", { alias: "v", type: "boolean", description: "Run with verbose logging", default: true })
    .option("pghost", { type: "string", description: "Host address of PostgreSQL database", default: "localhost" })
    .option("pgport", { type: "number", description: "Port of PostgreSQL database", default: 5432 })
    .option("pgusername", { type: "string", description: "Run with verbose logging", default: "postgres" })
    .option("pgpassword", { type: "string", description: "Run with verbose logging", default: "test" })
    .option("diagram", { type: "boolean", description: "Create an SVG diagram of the database schema", default: false })
    .argv;

import { DataProcessor } from "./data-processor";

const dataProcessor = new DataProcessor({
    host: args.pghost,
    port: args.pgport,
    username: args.pgusername,
    password: args.pgpassword,
    verbose: args.verbose,
    createSchemaDiagram: args.diagram
});

dataProcessor.init();