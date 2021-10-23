import * as path from "path";
import fastify, { FastifyInstance } from "fastify";
import fastifyRatelimit from "fastify-rate-limit";
import fastifyAutoload from "fastify-autoload";
import fastifyStatic from "fastify-static";
import fastifySensible from "fastify-sensible";
import fastifyCors from "fastify-cors";
import Redis from "ioredis";
const { JsonSchemaManager } = require('@alt3/sequelize-to-json-schemas');

import { BARDBConfig } from "~/bar-db-config";
import { Database } from "~/database";
import { SLDBService } from "~/rest-api/sldb-service";
import { LobbyService } from "~/rest-api/lobby-service";

export interface PluginOptions {
    config: BARDBConfig;
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

        this.fastify.register(fastifyCors);

        this.fastify.register(fastifySensible);

        // this.fastify.register(fastifyRatelimit, {
        //     redis: this.redis,
        //     allowList: [
        //         "127.0.0.1",
        //         "0.0.0.0",
        //         "localhost",
        //         "bar-rts.com"
        //     ]
        // });

        this.fastify.register(fastifyAutoload, {
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

        this.fastify.register(fastifyStatic, {
            root: path.resolve(path.join(this.config.mapsDir, "processed")),
            prefix: "/maps/"
        });

        try {
            const address = await this.fastify.listen(this.config.apiPort);

            console.log(`Server is now listening on ${address}`);
        } catch (err) {
            console.error(err);
            process.exit(1);
        }
    }
}