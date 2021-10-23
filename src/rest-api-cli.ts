#!/usr/bin/env node

import * as fs from "fs";
import yargs from "yargs";

import { BARDBConfig } from "~/bar-db-config";
import { RestAPI } from "~/rest-api";

(async () => {
    const args = yargs.option("config", { type: "string", description: "Path to config.json file", demandOption: true }).demandOption("config");
    const argv = await args.argv;
    const config = JSON.parse(fs.readFileSync(argv.config, { encoding: "utf-8" })) as BARDBConfig;

    const restAPI = new RestAPI(config);
    restAPI.init();
})();
