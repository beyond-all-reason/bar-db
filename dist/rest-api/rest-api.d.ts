import { FastifyInstance } from "fastify";
import { BARDBConfig } from "~/bar-db-config";
import { Database } from "~/database";
export declare class RestAPI {
    protected config: BARDBConfig;
    protected db: Database;
    protected server: FastifyInstance;
    constructor(config: BARDBConfig);
    init(): Promise<void>;
}
