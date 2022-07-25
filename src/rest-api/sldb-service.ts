import { delay } from "jaz-ts-utils";
import { SLDBClient, SLDBModel } from "sldbts";

import { BARDBConfig } from "~/bar-db-config";

export class SLDBService {
    public leaderboards: SLDBModel.LeaderboardResult[] = [];

    protected config: BARDBConfig["sldb"];
    protected sldbClient: SLDBClient;

    constructor(config: BARDBConfig["sldb"]) {
        this.config = config;

        this.sldbClient = new SLDBClient({
            host: config.host,
            port: config.port,
            username: config.username,
            password: config.password
        });
    }

    public async init() {
        this.updateLeaderboards();
    }

    protected async updateLeaderboards() {
        while (true) {
            try {
                this.leaderboards = await this.sldbClient.getLeaderboards("BYAR", this.config.leaderboards as SLDBModel.GameType[]);
            } catch (err) {
                console.log(err);
            }

            await delay(this.config.pollIntervalMs);
        }
    }
}
