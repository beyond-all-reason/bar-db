"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SLDBService = void 0;
const jaz_ts_utils_1 = require("jaz-ts-utils");
const sldbts_1 = require("sldbts");
class SLDBService {
    constructor(config) {
        this.leaderboards = [];
        this.config = config;
        this.sldbClient = new sldbts_1.SLDBClient({
            host: config.host,
            port: config.port,
            username: config.username,
            password: config.password
        });
    }
    async init() {
        this.updateLeaderboards();
    }
    async updateLeaderboards() {
        while (true) {
            try {
                this.leaderboards = await this.sldbClient.getLeaderboards("BYAR", this.config.leaderboards);
            }
            catch (err) {
                console.log(err);
            }
            await jaz_ts_utils_1.delay(this.config.pollIntervalMs);
        }
    }
}
exports.SLDBService = SLDBService;
//# sourceMappingURL=sldb-service.js.map