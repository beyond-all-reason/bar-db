import Redis from "ioredis";
import { Database } from "~/database";
export declare class MemoryStore {
    protected db: Database;
    protected redis: Redis.Redis;
    constructor(db: Database);
    init(): Promise<void>;
    get(key: string): Promise<string | null>;
    saveUsersToMemory(): Promise<void>;
    saveMapsToMemory(): Promise<void>;
}
