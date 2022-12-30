import Redis from "ioredis";

import { Database } from "~/database";

export class MemoryStore {
    protected db: Database;
    protected redis: Redis;

    constructor(db: Database) {
        this.db = db;
        this.redis = new Redis({
            host: "127.0.0.1",
            port: 6379,
            retryStrategy: (times) => {
                throw "Could not connect to Redis";
            }
        });
    }

    public async init() {
        await this.saveUsersToMemory();
        await this.saveMapsToMemory();
    }

    public async get(key: string) {
        return await this.redis.get(key);
    }

    public async saveUsersToMemory() {
        console.time("save users to memory");

        const results = await this.db.schema.user.findAll({
            raw: true,
            attributes: ["id", "username", "countryCode"]
        });

        await this.redis.set("users", JSON.stringify(results));

        console.timeEnd("save users to memory");
    }

    public async saveMapsToMemory() {
        console.time("save maps to memory");

        const results = await this.db.schema.map.findAll({
            raw: true,
            attributes: ["id", "scriptName", "fileName"]
        });

        await this.redis.set("maps", JSON.stringify(results));

        console.timeEnd("save maps to memory");
    }
}