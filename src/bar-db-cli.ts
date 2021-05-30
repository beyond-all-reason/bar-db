#!/usr/bin/env node
import yargs from "yargs";
import { BARDB, BARDBConfig } from "./bar-db";
import * as fs from "fs";

const args = yargs.option("config", { type: "string", description: "Path to config.json file", demandOption: true }).demandOption("config");
const config = JSON.parse(fs.readFileSync(args.argv.config, { encoding: "utf-8" })) as BARDBConfig;

const barDb = new BARDB(config);

barDb.init();