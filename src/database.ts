import { promises as fs } from "fs";
import Redis from "ioredis";
import pg from "pg";
import { DataTypes, ModelCtor, Sequelize } from "sequelize";
import { BARDBConfig, defaultBARDBConfig } from "./config";

import { AIInstance } from "model/ai";
import { AliasInstance } from "model/alias";
import { AllyTeamInstance } from "model/ally-team";
import { BalanceChangeInstance } from "model/balance-change";
import { BalanceChangeAuthorInstance } from "model/balance-change-author";
import { BalanceChangeUnitDefInstance } from "model/balance-change-unit-def";
import { DemoInstance } from "model/demo";
import { SpringMapInstance } from "model/spring-map";
import { PlayerInstance } from "model/player";
import { SpectatorInstance } from "model/spectator";
import { UserInstance } from "model/user";

const sequelizeErd = require("sequelize-erd");

export interface DatabaseSchema {
    demo: ModelCtor<DemoInstance>;
    user: ModelCtor<UserInstance>;
    map: ModelCtor<SpringMapInstance>;
    player: ModelCtor<PlayerInstance>;
    spectator: ModelCtor<SpectatorInstance>;
    ai: ModelCtor<AIInstance>;
    allyTeam: ModelCtor<AllyTeamInstance>;
    alias: ModelCtor<AliasInstance>;
    balanceChange: ModelCtor<BalanceChangeInstance>;
    balanceChangeAuthor: ModelCtor<BalanceChangeAuthorInstance>;
    balanceChangeUnitDef: ModelCtor<BalanceChangeUnitDefInstance>;
}

export class Database {
    public sequelize!: Sequelize;
    public schema!: DatabaseSchema;
    public memoryStore!: Redis.Redis;
    public config: BARDBConfig["db"];

    constructor(config: BARDBConfig["db"]) {
        this.config = Object.assign({}, defaultBARDBConfig.db, config);
    }

    public async init() {
        await this.initDatabase();
        await this.initSchema();
        await this.initCacheStore();
    }

    protected async initDatabase() {
        console.time("db init");

        const pgClient = new pg.Client({ host: this.config.host, port: this.config.port, user: this.config.username, password: this.config.password });
        await pgClient.connect();
        const dbExistsQuery = await pgClient.query("SELECT datname FROM pg_catalog.pg_database WHERE lower(datname) = 'bar';");
        const dbExists = dbExistsQuery.rowCount > 0;
        if (!dbExists) {
            await pgClient.query("CREATE DATABASE bar");
            console.log("bar database created.");
            this.config.alterDbSchema = true;
        }
        await pgClient.end();

        this.sequelize = new Sequelize({
            logging: this.config.logSQL ? console.log : false,
            dialect: "postgres",
            host: this.config.host,
            port: this.config.port,
            username: this.config.username,
            password: this.config.password,
            database: "bar"
        });

        try {
            await this.sequelize.authenticate();
            console.log("Connection has been established successfully.");
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }

        console.timeEnd("db init");
    }

    protected async initSchema() {
        console.time("schema init");

        const mapModel = this.sequelize.define<SpringMapInstance>("Map", {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            scriptName: { type: DataTypes.STRING, allowNull: false },
            fileName: { type: DataTypes.STRING },
            fileNameWithExt: { type: DataTypes.STRING },
            description: { type: DataTypes.TEXT },
            mapHardness: { type: DataTypes.FLOAT },
            gravity: { type: DataTypes.FLOAT },
            tidalStrength: { type: DataTypes.FLOAT },
            maxMetal: { type: DataTypes.FLOAT },
            extractorRadius: { type: DataTypes.FLOAT },
            minWind: { type: DataTypes.FLOAT },
            maxWind: { type: DataTypes.FLOAT },
            startPositions: { type: DataTypes.JSON },
            width: { type: DataTypes.INTEGER },
            height: { type: DataTypes.INTEGER },
            minDepth: { type: DataTypes.FLOAT },
            maxDepth: { type: DataTypes.FLOAT },
            name: { type: DataTypes.STRING },
            shortname: { type: DataTypes.STRING },
            author: { type: DataTypes.STRING },
            version: { type: DataTypes.STRING },
            mapfile: { type: DataTypes.STRING },
            modtype: { type: DataTypes.INTEGER },
            notDeformable: { type: DataTypes.BOOLEAN },
            voidWater: { type: DataTypes.BOOLEAN },
            voidGround: { type: DataTypes.BOOLEAN },
            autoShowMetal: { type: DataTypes.BOOLEAN },
            mapInfo: { type: DataTypes.JSON }
        }, {
            indexes: [
                {
                    unique: true,
                    fields: ["scriptName"]
                }
            ]
        });

        const demoModel = this.sequelize.define<DemoInstance>("Demo", {
            id: { type: DataTypes.STRING, primaryKey: true },
            fileName: { type: DataTypes.STRING, unique: true, allowNull: false },
            engineVersion: { type: DataTypes.STRING, allowNull: false },
            gameVersion: { type: DataTypes.STRING, allowNull: false },
            startTime: { type: DataTypes.DATE, allowNull: false },
            durationMs: { type: DataTypes.INTEGER, allowNull: false },
            fullDurationMs: { type: DataTypes.INTEGER, allowNull: false },
            hostSettings: { type: DataTypes.JSON, allowNull: false },
            gameSettings: { type: DataTypes.JSON, allowNull: false },
            mapSettings: { type: DataTypes.JSON, allowNull: false },
            gameEndedNormally: { type: DataTypes.BOOLEAN, defaultValue: true, allowNull: false },
            chatlog: { type: DataTypes.JSON, defaultValue: [], allowNull: true },
            hasBots: { type: DataTypes.BOOLEAN, allowNull: true },
            preset: { type: DataTypes.STRING, allowNull: true },
            reported: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: true }
        });

        const allyTeamModel = this.sequelize.define<AllyTeamInstance>("AllyTeam", {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            allyTeamId: { type: DataTypes.INTEGER },
            startBox: { type: DataTypes.JSON },
            winningTeam: { type: DataTypes.BOOLEAN }
        });

        const playerModel = this.sequelize.define<PlayerInstance>("Player", {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            playerId: { type: DataTypes.INTEGER },
            name: { type: DataTypes.STRING },
            teamId: { type: DataTypes.INTEGER },
            handicap: { type: DataTypes.INTEGER },
            faction: { type: DataTypes.STRING },
            countryCode: { type: DataTypes.STRING },
            rgbColor: { type: DataTypes.JSON },
            rank: { type: DataTypes.INTEGER },
            skillUncertainty: { type: DataTypes.INTEGER, allowNull: true },
            skill: { type: DataTypes.STRING },
            trueSkill: { type: DataTypes.FLOAT, allowNull: true },
            startPos: { type: DataTypes.JSON, allowNull: true }
        });

        const spectatorModel = this.sequelize.define<SpectatorInstance>("Spectator", {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            playerId: { type: DataTypes.INTEGER },
            name: { type: DataTypes.STRING },
            countryCode: { type: DataTypes.STRING },
            rank: { type: DataTypes.INTEGER },
            skillUncertainty: { type: DataTypes.INTEGER },
            skill: { type: DataTypes.STRING }
        });

        const aiModel = this.sequelize.define<AIInstance>("AI", {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            aiId: { type: DataTypes.INTEGER },
            shortName: { type: DataTypes.STRING },
            name: { type: DataTypes.STRING },
            host: { type: DataTypes.BOOLEAN },
            startPos: { type: DataTypes.JSON, allowNull: true },
            handicap: { type: DataTypes.INTEGER },
            faction: { type: DataTypes.STRING },
            rgbColor: { type: DataTypes.JSON }
        });

        const userModel = this.sequelize.define<UserInstance>("User", {
            id: { type: DataTypes.INTEGER, primaryKey: true },
            username: { type: DataTypes.STRING },
            countryCode: { type: DataTypes.STRING },
            rank: { type: DataTypes.INTEGER },
            skill: { type: DataTypes.STRING },
            trueSkill: { type: DataTypes.FLOAT, allowNull: true },
            skillUncertainty: { type: DataTypes.FLOAT },
        }, {
            indexes: [{ fields: ["username"] }]
        });

        const aliasModel = this.sequelize.define<AliasInstance>("Alias", {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            alias: { type: DataTypes.STRING }
        });

        const balanceChangeAuthorModel = this.sequelize.define<BalanceChangeAuthorInstance>("BalanceChangeAuthor", {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            name: { type: DataTypes.STRING },
            img: { type: DataTypes.STRING },
            url: { type: DataTypes.STRING },
        });

        const balanceChangeModel = this.sequelize.define<BalanceChangeInstance>("BalanceChange", {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            sha: { type: DataTypes.STRING, unique: true },
            url: { type: DataTypes.STRING },
            date: { type: DataTypes.DATE },
            message: { type: DataTypes.TEXT },
        }, {
            indexes: [{ unique: true, fields: ["sha"] }]
        });

        const balanceChangeUnitDefModel = this.sequelize.define<BalanceChangeUnitDefInstance>("BalanceChangeUnitDef", {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            unitDefId: { type: DataTypes.STRING },
            scav: { type: DataTypes.BOOLEAN },
            changes: { type: DataTypes.JSON },
        }, {
            indexes: [{ fields: ["unitDefId"] }]
        });

        mapModel.hasMany(demoModel, { foreignKey: "mapId" });
        demoModel.belongsTo(mapModel, { foreignKey: "mapId" });

        demoModel.hasMany(allyTeamModel, { foreignKey: "demoId", onDelete: "CASCADE" });
        allyTeamModel.belongsTo(demoModel, { foreignKey: "demoId" });

        demoModel.hasMany(spectatorModel, { foreignKey: "demoId", onDelete: "CASCADE" });
        spectatorModel.belongsTo(demoModel, { foreignKey: "demoId" });

        allyTeamModel.hasMany(playerModel, { foreignKey: "allyTeamId", onDelete: "CASCADE" });
        playerModel.belongsTo(allyTeamModel, { foreignKey: "allyTeamId" });

        allyTeamModel.hasMany(aiModel, { foreignKey: "allyTeamId", onDelete: "CASCADE" });
        aiModel.belongsTo(allyTeamModel, { foreignKey: "allyTeamId" });

        userModel.hasMany(playerModel, { foreignKey: "userId", onDelete: "CASCADE" });
        playerModel.belongsTo(userModel, { foreignKey: "userId" });

        userModel.hasMany(aliasModel, { foreignKey: "userId", onDelete: "CASCADE" });
        aliasModel.belongsTo(userModel, { foreignKey: "userId" });

        userModel.hasMany(spectatorModel, { foreignKey: "userId", onDelete: "CASCADE" });
        spectatorModel.belongsTo(userModel, { foreignKey: "userId" });

        balanceChangeAuthorModel.hasMany(balanceChangeModel, { foreignKey: "balanceChangeAuthorId", onDelete: "CASCADE" });
        balanceChangeModel.belongsTo(balanceChangeAuthorModel, { foreignKey: "balanceChangeAuthorId", as: "author" });

        balanceChangeModel.hasMany(balanceChangeUnitDefModel, { foreignKey: "balanceChangeId", onDelete: "CASCADE", as: "changes" });
        balanceChangeUnitDefModel.belongsTo(balanceChangeModel, { foreignKey: "balanceChangeId" });

        if (this.config.syncModel) {
            await mapModel.sync({ alter: this.config.alterDbSchema });
            await userModel.sync({ alter: this.config.alterDbSchema });
            await demoModel.sync({ alter: this.config.alterDbSchema });
            await allyTeamModel.sync({ alter: this.config.alterDbSchema });
            await playerModel.sync({ alter: this.config.alterDbSchema });
            await spectatorModel.sync({ alter: this.config.alterDbSchema });
            await aiModel.sync({ alter: this.config.alterDbSchema });
            await aliasModel.sync({ alter: this.config.alterDbSchema });
            await balanceChangeAuthorModel.sync({ alter: this.config.alterDbSchema });
            await balanceChangeModel.sync({ alter: this.config.alterDbSchema });
            await balanceChangeUnitDefModel.sync({ alter: this.config.alterDbSchema });
        }

        this.schema = {
            map: mapModel,
            user: userModel,
            demo: demoModel,
            allyTeam: allyTeamModel,
            player: playerModel,
            spectator: spectatorModel,
            ai: aiModel,
            alias: aliasModel,
            balanceChange: balanceChangeModel,
            balanceChangeAuthor: balanceChangeAuthorModel,
            balanceChangeUnitDef: balanceChangeUnitDefModel,
        };

        if (this.config.createSchemaDiagram) {
            const svg = await sequelizeErd({ source: this.sequelize });
            await fs.writeFile("db-schema.svg", svg);
        }

        console.timeEnd("schema init");
    }

    protected async initCacheStore() {
        this.memoryStore = new Redis();

        if (this.config.initMemoryStore) {
            await this.saveUsersToMemory();
            await this.saveMapsToMemory();
        }
    }

    public async saveUsersToMemory() {
        console.time("save users to memory");

        const results = await this.schema.user.findAll({
            raw: true,
            attributes: ["id", "username", "countryCode"]
        });

        await this.memoryStore.set("users", JSON.stringify(results));

        console.timeEnd("save users to memory");
    }

    public async saveMapsToMemory() {
        console.time("save maps to memory");

        const results = await this.schema.map.findAll({
            raw: true,
            attributes: ["id", "scriptName", "fileName"]
        });

        await this.memoryStore.set("maps", JSON.stringify(results));

        console.timeEnd("save maps to memory");
    }

    public async getUsersFromMemory() {
        const results = await this.memoryStore.get("users");
        return results;
    }

    public async getMapsFromMemory() {
        const results = await this.memoryStore.get("maps");
        return results;
    }

    public async getBalanceChangesFromMemory() {
        const results = await this.memoryStore.get("balanceChanges");
        return results;
    }
}