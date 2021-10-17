"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaderboardService = void 0;
const jaz_ts_utils_1 = require("jaz-ts-utils");
const sldbts_1 = require("sldbts");
const defaultLeaderboardServiceConfig = {
    pollInterval: 60000,
    verbose: false
};
class LeaderboardService {
    constructor(config) {
        this.leaderboards = [];
        this.stuff = "stuff";
        this.config = Object.assign({}, defaultLeaderboardServiceConfig, config);
        this.sldbClient = new sldbts_1.SLDBClient({
            host: config.host,
            port: config.port,
            username: config.username,
            password: config.password
        });
    }
    init() {
        this.updateLeaderboards();
    }
    async updateLeaderboards() {
        while (true) {
            this.leaderboards = await this.sldbClient.getLeaderboards("BYAR", this.config.leaderboards);
            await jaz_ts_utils_1.delay(this.config.pollInterval);
        }
    }
}
exports.LeaderboardService = LeaderboardService;
//# sourceMappingURL=leaderboard-service.js.map