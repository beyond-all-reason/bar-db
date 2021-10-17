"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryStore = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
class MemoryStore {
    constructor(db) {
        this.db = db;
        this.redis = new ioredis_1.default();
    }
    async init() {
        await this.saveUsersToMemory();
        await this.saveMapsToMemory();
    }
    async get(key) {
        return await this.redis.get(key);
    }
    async saveUsersToMemory() {
        console.time("save users to memory");
        const results = await this.db.schema.user.findAll({
            raw: true,
            attributes: ["id", "username", "countryCode"]
        });
        await this.redis.set("users", JSON.stringify(results));
        console.timeEnd("save users to memory");
    }
    async saveMapsToMemory() {
        console.time("save maps to memory");
        const results = await this.db.schema.map.findAll({
            raw: true,
            attributes: ["id", "scriptName", "fileName"]
        });
        await this.redis.set("maps", JSON.stringify(results));
        console.timeEnd("save maps to memory");
    }
}
exports.MemoryStore = MemoryStore;
//# sourceMappingURL=memory-store.js.map