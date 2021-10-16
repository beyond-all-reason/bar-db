import * as path from "path";
import fastify, { FastifyInstance } from "fastify";
import fastifyRatelimit from "fastify-rate-limit";
import fastifyAutoload from "fastify-autoload";
import fastifyStatic from "fastify-static";
import fastifySensible from "fastify-sensible";
import Redis from "ioredis";
const { JsonSchemaManager } = require('@alt3/sequelize-to-json-schemas');

import { BARDBConfig } from "~/bar-db-config";
import { Database } from "~/database";
import { SLDBService } from "~/rest-api/sldb-service";
import { LobbyService } from "~/rest-api/lobby-service";

export interface PluginOptions {
    db: Database;
    redis: Redis.Redis;
    schemaManager: any;
    sldbService: SLDBService,
    lobbyService: LobbyService
}

export class RestAPI {
    protected config: BARDBConfig;
    protected db: Database;
    protected redis: Redis.Redis; 
    protected fastify!: FastifyInstance;
    protected schemaManager: any;
    protected sldbService: SLDBService;
    protected lobbyService: LobbyService;

    constructor(config: BARDBConfig) {
        this.config = config;

        this.config.db.syncModel = false;
        this.config.db.createSchemaDiagram = false;
        this.config.db.initMemoryStore = false;

        this.db = new Database(config.db);

        this.redis = new Redis();

        this.schemaManager = new JsonSchemaManager();

        this.sldbService = new SLDBService(config.sldb);

        this.lobbyService = new LobbyService(config.lobby, this.redis);
    }

    public async init() {
        await this.db.init();
        await this.sldbService.init();
        await this.lobbyService.init();

        this.fastify = await fastify({
            ignoreTrailingSlash: true,
            logger: false,
            ajv: {
                customOptions: {
                    coerceTypes: "array"
                }
            }
        });

        // https://github.com/fastify/fastify-http-proxy
        // https://github.com/fastify/fastify-caching

        this.fastify.register(fastifyRatelimit, {
            max: 100,
            timeWindow: '1 minute'
        });

        this.fastify.register(fastifyAutoload, {
            dir: path.join(__dirname, "rest-api/routes"),
            options: {
                db: this.db,
                redis: this.redis,
                schemaManager: this.schemaManager,
                sldbService: this.sldbService,
                lobbyService: this.lobbyService
            }
        });

        this.fastify.register(fastifyStatic, {
            root: path.join(__dirname, "../maps/processed"),
            prefix: "/maps/"
        });

        this.fastify.register(fastifySensible);

        try {
            const address = await this.fastify.listen(this.config.apiPort);

            console.log(`Server is now listening on ${address}`);
        } catch (err) {
            console.error(err);
            process.exit(1);
        }
    }
}