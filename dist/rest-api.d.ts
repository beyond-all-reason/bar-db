import { FastifyInstance } from "fastify";
import Redis from "ioredis";
import { BARDBConfig } from "./bar-db-config";
import { Database } from "./database";
import { LobbyService } from "./rest-api/lobby-service";
import { SLDBService } from "./rest-api/sldb-service";
export interface PluginOptions {
    config: BARDBConfig;
    db: Database;
    redis: Redis.Redis;
    schemaManager: any;
    sldbService: SLDBService;
    lobbyService: LobbyService;
}
export declare class RestAPI {
    protected config: BARDBConfig;
    protected db: Database;
    protected redis: Redis.Redis;
    protected fastify: FastifyInstance;
    protected schemaManager: any;
    protected sldbService: SLDBService;
    protected lobbyService: LobbyService;
    constructor(config: BARDBConfig);
    init(): Promise<void>;
}
