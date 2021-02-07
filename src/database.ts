import { promises as fs } from "fs";
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
    createSchemaDiagram?: boolean;
}

const defaultDatabaseConfig: Required<Optionals<DatabaseConfig>> = {
    verbose: false,
    createSchemaDiagram: false
};

export interface DatabaseSchema {
    demo: ModelCtor<DemoInstance>;
    map: ModelCtor<MapInstance>;
    user: ModelCtor<UserInstance>;
    player: ModelCtor<PlayerInstance>;
    spectator: ModelCtor<SpectatorInstance>;
    ai: ModelCtor<AIInstance>;
    allyTeam: ModelCtor<AllyTeamInstance>;
    alias: ModelCtor<AliasInstance>;
}

export class Database {
    public sequelize!: Sequelize;
    public schema!: DatabaseSchema;

    protected config: DatabaseConfig;

    constructor(config: DatabaseConfig) {
        this.config = Object.assign({}, defaultDatabaseConfig, config);
    }

    public async init() {
        await this.initDatabase();
        await this.initSequelize();
        await this.initSchema();
    }

    protected async initDatabase() {
        const pgClient = new pg.Client({ host: this.config.dbHost, port: this.config.dbPort, user: this.config.dbUsername, password: this.config.dbPassword });
        await pgClient.connect();
        const dbExistsQuery = await pgClient.query("SELECT datname FROM pg_catalog.pg_database WHERE lower(datname) = 'bar';");
        const dbExists = dbExistsQuery.rowCount > 0;
        if (!dbExists) {
            await pgClient.query("CREATE DATABASE bar");
            console.log("bar database created.");
        }
        await pgClient.end();
    }

    protected async initSequelize() {
        this.sequelize = new Sequelize({
            //logging: console.log,
            logging: false,
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
    }

    protected async initSchema() {
        const mapModel = this.sequelize.define<MapInstance>("Map", {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            scriptName: { type: DataTypes.STRING, allowNull: false },
            fileName: { type: DataTypes.STRING },
            description: { type: DataTypes.STRING },
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
            autoShowMetal: { type: DataTypes.BOOLEAN },
        });

        const demoModel = this.sequelize.define<DemoInstance>("Demo", {
            id: { type: DataTypes.STRING, primaryKey: true },
            fileName: { type: DataTypes.STRING, unique: true },
            engineVersion: { type: DataTypes.STRING },
            gameVersion: { type: DataTypes.STRING },
            startTime: { type: DataTypes.DATE },
            durationMs: { type: DataTypes.INTEGER },
            fullDurationMs: { type: DataTypes.INTEGER },
            hostSettings: { type: DataTypes.JSON },
            gameSettings: { type: DataTypes.JSON },
            mapSettings: { type: DataTypes.JSON },
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
            skillUncertainty: { type: DataTypes.FLOAT },
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

        await mapModel.sync({ alter: true });
        await userModel.sync({ alter: true });
        await demoModel.sync({ alter: true });
        await allyTeamModel.sync({ alter: true });
        await playerModel.sync({ alter: true });
        await spectatorModel.sync({ alter: true });
        await aiModel.sync({ alter: true });
        await aliasModel.sync({ alter: true });

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

        console.log("Demo schema created");
    }
}