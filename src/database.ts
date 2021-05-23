import { promises as fs } from "fs";
import Redis from "ioredis";
import { Optionals } from "jaz-ts-utils";
import pg from "pg";
import { DataTypes, ModelCtor, Sequelize } from "sequelize";

import { AIInstance } from "./model/ai";
import { AliasInstance } from "./model/alias";
import { AllyTeamInstance } from "./model/ally-team";
import { DemoInstance } from "./model/demo";
import { MapInstance } from "./model/map";
import { PlayerInstance } from "./model/player";
import { SpectatorInstance } from "./model/spectator";
import { UserInstance } from "./model/user";

const sequelizeErd = require("sequelize-erd");

export interface DatabaseConfig {
    dbHost: string;
    dbPort: number;
    dbUsername: string;
    dbPassword: string;
    verbose?: boolean;
    logSQL?: boolean;
    createSchemaDiagram?: boolean;
    syncModel?: boolean;
    initMemoryStore?: boolean;
    alterDbSchema?: boolean;
}

export const defaultDatabaseConfig: Required<Optionals<DatabaseConfig>> = {
    verbose: true,
    createSchemaDiagram: false,
    syncModel: true,
    logSQL: false,
    initMemoryStore: true,
    alterDbSchema: false
};

export interface DatabaseSchema {
    demo: ModelCtor<DemoInstance>;
    user: ModelCtor<UserInstance>;
    map: ModelCtor<MapInstance>;
    player: ModelCtor<PlayerInstance>;
    spectator: ModelCtor<SpectatorInstance>;
    ai: ModelCtor<AIInstance>;
    allyTeam: ModelCtor<AllyTeamInstance>;
    alias: ModelCtor<AliasInstance>;
}

export class Database {
    public sequelize!: Sequelize;
    public schema!: DatabaseSchema;
    public memoryStore!: Redis.Redis;

    protected config: DatabaseConfig;

    constructor(config: DatabaseConfig) {
        this.config = Object.assign({}, defaultDatabaseConfig, config);
    }

    public async init() {
        await this.initDatabase();
        await this.initSchema();
        await this.initMemoryStore();
    }

    public async saveUsersToMemory() {
        console.time("save users to memory");

        const users = await this.schema.user.findAll({
            raw: true,
            attributes: ["id", "username", "countryCode"]
        });

        await this.memoryStore.set("users", JSON.stringify(users));

        console.timeEnd("save users to memory");
    }

    public async saveMapsToMemory() {
        console.time("save maps to memory");

        const maps = await this.schema.map.findAll({
            raw: true,
            attributes: ["id", "scriptName"]
        });

        await this.memoryStore.set("maps", JSON.stringify(maps));

        console.timeEnd("save maps to memory");
    }

    public async getUsersFromMemory() {
        const users = await this.memoryStore.get("users");
        return users;
    }

    public async getMapsFromMemory() {
        const maps = await this.memoryStore.get("maps");
        return maps;
    }

    protected async initDatabase() {
        console.time("db init");

        const pgClient = new pg.Client({ host: this.config.dbHost, port: this.config.dbPort, user: this.config.dbUsername, password: this.config.dbPassword });
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
            host: this.config.dbHost,
            port: this.config.dbPort,
            username: this.config.dbUsername,
            password: this.config.dbPassword,
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

        const mapModel = this.sequelize.define<MapInstance>("Map", {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            scriptName: { type: DataTypes.STRING, allowNull: false },
            fileName: { type: DataTypes.STRING },
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
            minDepth: { type: DataTypes.INTEGER },
            maxDepth: { type: DataTypes.INTEGER },
            name: { type: DataTypes.STRING },
            shortname: { type: DataTypes.STRING },
            author: { type: DataTypes.STRING },
            version: { type: DataTypes.STRING },
            mapfile: { type: DataTypes.STRING },
            modtype: { type: DataTypes.INTEGER },
            notDeformable: { type: DataTypes.BOOLEAN },
            voidWater: { type: DataTypes.BOOLEAN },
            voidGround: { type: DataTypes.BOOLEAN },
            autoShowMetal: { type: DataTypes.BOOLEAN }
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
            indexes: [
                {
                    unique: true,
                    fields: ["username"],
                }
            ]
        });

        const aliasModel = this.sequelize.define<AliasInstance>("Alias", {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            alias: { type: DataTypes.STRING }
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

        if (this.config.syncModel) {
            await mapModel.sync({ alter: this.config.alterDbSchema });
            await userModel.sync({ alter: this.config.alterDbSchema });
            await demoModel.sync({ alter: this.config.alterDbSchema });
            await allyTeamModel.sync({ alter: this.config.alterDbSchema });
            await playerModel.sync({ alter: this.config.alterDbSchema });
            await spectatorModel.sync({ alter: this.config.alterDbSchema });
            await aiModel.sync({ alter: this.config.alterDbSchema });
            await aliasModel.sync({ alter: this.config.alterDbSchema });
        }

        this.schema = {
            map: mapModel,
            user: userModel,
            demo: demoModel,
            allyTeam: allyTeamModel,
            player: playerModel,
            spectator: spectatorModel,
            ai: aiModel,
            alias: aliasModel
        };

        if (this.config.createSchemaDiagram) {
            const svg = await sequelizeErd({ source: this.sequelize });
            await fs.writeFile("db-schema.svg", svg);
        }

        console.timeEnd("schema init");
    }

    protected async initMemoryStore() {
        this.memoryStore = new Redis();

        if (this.config.initMemoryStore) {
            await this.saveUsersToMemory();

            await this.saveMapsToMemory();
        }
    }
}