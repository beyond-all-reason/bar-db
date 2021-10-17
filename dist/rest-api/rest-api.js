"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestAPI = void 0;
const fastify_1 = __importDefault(require("fastify"));
const database_1 = require("~/database");
class RestAPI {
    constructor(config) {
        this.config = config;
        this.config.db.syncModel = false;
        this.config.db.createSchemaDiagram = false;
        this.config.db.initMemoryStore = false;
        this.db = new database_1.Database(config.db);
    }
    async init() {
        await this.db.init();
        this.server = await fastify_1.default({
            logger: true,
            ignoreTrailingSlash: true,
        });
        this.server.get("/test", async () => {
            return { hello: "world" };
        });
        this.server.listen(this.config.apiPort, (err, address) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }
            console.log(`Server listening on ${address}`);
        });
    }
}
exports.RestAPI = RestAPI;
//# sourceMappingURL=rest-api.js.map