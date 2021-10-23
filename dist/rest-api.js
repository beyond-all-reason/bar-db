"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestAPI = void 0;
const path = __importStar(require("path"));
const fastify_1 = __importDefault(require("fastify"));
const fastify_rate_limit_1 = __importDefault(require("fastify-rate-limit"));
const fastify_autoload_1 = __importDefault(require("fastify-autoload"));
const fastify_static_1 = __importDefault(require("fastify-static"));
const fastify_sensible_1 = __importDefault(require("fastify-sensible"));
const fastify_cors_1 = __importDefault(require("fastify-cors"));
const ioredis_1 = __importDefault(require("ioredis"));
const { JsonSchemaManager } = require('@alt3/sequelize-to-json-schemas');
const database_1 = require("./database");
const sldb_service_1 = require("./rest-api/sldb-service");
const lobby_service_1 = require("./rest-api/lobby-service");
class RestAPI {
    constructor(config) {
        this.config = config;
        this.config.db.syncModel = false;
        this.config.db.createSchemaDiagram = false;
        this.config.db.initMemoryStore = false;
        this.db = new database_1.Database(config.db);
        this.redis = new ioredis_1.default();
        this.schemaManager = new JsonSchemaManager();
        this.sldbService = new sldb_service_1.SLDBService(config.sldb);
        this.lobbyService = new lobby_service_1.LobbyService(config.lobby, this.redis);
    }
    async init() {
        await this.db.init();
        await this.sldbService.init();
        await this.lobbyService.init();
        this.fastify = await (0, fastify_1.default)({
            ignoreTrailingSlash: true,
            logger: false,
            ajv: {
                customOptions: {
                    coerceTypes: "array"
                }
            }
        });
        this.fastify.register(fastify_cors_1.default);
        this.fastify.register(fastify_sensible_1.default);
        this.fastify.register(fastify_rate_limit_1.default, {
            redis: this.redis,
            allowList: [
                "127.0.0.1",
                "0.0.0.0",
                "localhost",
                "bar-rts.com"
            ]
        });
        this.fastify.register(fastify_autoload_1.default, {
            dir: path.join(__dirname, "rest-api/routes"),
            options: {
                config: this.config,
                db: this.db,
                redis: this.redis,
                schemaManager: this.schemaManager,
                sldbService: this.sldbService,
                lobbyService: this.lobbyService
            }
        });
        this.fastify.register(fastify_static_1.default, {
            root: path.join(__dirname, "../maps/processed"),
            prefix: "/maps/"
        });
        try {
            const address = await this.fastify.listen(this.config.apiPort);
            console.log(`Server is now listening on ${address}`);
        }
        catch (err) {
            console.error(err);
            process.exit(1);
        }
    }
}
exports.RestAPI = RestAPI;
//# sourceMappingURL=rest-api.js.map