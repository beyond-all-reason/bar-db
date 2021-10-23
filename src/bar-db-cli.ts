#!/usr/bin/env node

import * as fs from "fs";
import yargs from "yargs";

import { BARDB } from "~/bar-db";
import { BARDBConfig } from "~/bar-db-config";

(async () => {
    const args = yargs.option("config", { type: "string", description: "Path to config.json file", demandOption: true }).demandOption("config");
    const argv = await args.argv
    const config = JSON.parse(fs.readFileSync(argv.config, { encoding: "utf-8" })) as BARDBConfig;
    
    const barDb = new BARDB(config);
    barDb.init();
})();
