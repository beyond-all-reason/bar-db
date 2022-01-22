import { promises as fs } from "fs";
import pg from "pg";
import { ModelCtor, Sequelize } from "sequelize";
const sequelizeErd = require("sequelize-erd");

import { BARDBConfig, defaultBARDBConfig } from "~/bar-db-config";
import { DBSchema } from "~/model/db";

export class Database {
    public sequelize!: Sequelize;
    public schema!: {
        demo: ModelCtor<DBSchema.Demo.Instance>;
        user: ModelCtor<DBSchema.User.Instance>;
        map: ModelCtor<DBSchema.SpringMap.Instance>;
        player: ModelCtor<DBSchema.Player.Instance>;
        spectator: ModelCtor<DBSchema.Spectator.Instance>;
        ai: ModelCtor<DBSchema.AI.Instance>;
        allyTeam: ModelCtor<DBSchema.AllyTeam.Instance>;
        alias: ModelCtor<DBSchema.Alias.Instance>;
        balanceChange: ModelCtor<DBSchema.BalanceChange.Instance>;
        balanceChangeAuthor: ModelCtor<DBSchema.BalanceChangeAuthor.Instance>;
        balanceChangeUnitDef: ModelCtor<DBSchema.BalanceChangeUnitDef.Instance>;
    };
    public config: BARDBConfig["db"];

    constructor(config: BARDBConfig["db"]) {
        this.config = Object.assign({}, defaultBARDBConfig.db, config);
    }

    public async init() {
        await this.initDatabase();
        await this.initSchema();
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
            console.log("Unable to connect to the database:", error);
            throw error;
        }

        console.timeEnd("db init");
    }

    protected async initSchema() {
        console.time("schema init");

        this.schema = {
            map: this.sequelize.define<DBSchema.SpringMap.Instance>("Map", DBSchema.SpringMap.sequelizeDefinition, DBSchema.SpringMap.sequelizeOptions),
            demo: this.sequelize.define<DBSchema.Demo.Instance>("Demo", DBSchema.Demo.sequelizeDefinition, DBSchema.Demo.sequelizeOptions),
            allyTeam: this.sequelize.define<DBSchema.AllyTeam.Instance>("AllyTeam", DBSchema.AllyTeam.sequelizeDefinition, DBSchema.AllyTeam.sequelizeOptions),
            player: this.sequelize.define<DBSchema.Player.Instance>("Player", DBSchema.Player.sequelizeDefinition, DBSchema.Player.sequelizeOptions),
            spectator: this.sequelize.define<DBSchema.Spectator.Instance>("Spectator", DBSchema.Spectator.sequelizeDefinition, DBSchema.Spectator.sequelizeOptions),
            ai: this.sequelize.define<DBSchema.AI.Instance>("AI", DBSchema.AI.sequelizeDefinition, DBSchema.AI.sequelizeOptions),
            user: this.sequelize.define<DBSchema.User.Instance>("User", DBSchema.User.sequelizeDefinition, DBSchema.User.sequelizeOptions),
            alias: this.sequelize.define<DBSchema.Alias.Instance>("Alias", DBSchema.Alias.sequelizeDefinition, DBSchema.Alias.sequelizeOptions),
            balanceChangeAuthor: this.sequelize.define<DBSchema.BalanceChangeAuthor.Instance>("BalanceChangeAuthor", DBSchema.BalanceChangeAuthor.sequelizeDefinition, DBSchema.BalanceChangeAuthor.sequelizeOptions),
            balanceChange: this.sequelize.define<DBSchema.BalanceChange.Instance>("BalanceChange", DBSchema.BalanceChange.sequelizeDefinition, DBSchema.BalanceChange.sequelizeOptions),
            balanceChangeUnitDef: this.sequelize.define<DBSchema.BalanceChangeUnitDef.Instance>("BalanceChangeUnitDef", DBSchema.BalanceChangeUnitDef.sequelizeDefinition, DBSchema.BalanceChangeUnitDef.sequelizeOptions),
        };

        this.schema.map.hasMany(this.schema.demo, { foreignKey: "mapId" });
        this.schema.demo.belongsTo(this.schema.map, { foreignKey: "mapId" });

        this.schema.demo.hasMany(this.schema.allyTeam, { foreignKey: "demoId", onDelete: "CASCADE" });
        this.schema.allyTeam.belongsTo(this.schema.demo, { foreignKey: "demoId" });

        this.schema.demo.hasMany(this.schema.spectator, { foreignKey: "demoId", onDelete: "CASCADE" });
        this.schema.spectator.belongsTo(this.schema.demo, { foreignKey: "demoId" });

        this.schema.allyTeam.hasMany(this.schema.player, { foreignKey: "allyTeamId", onDelete: "CASCADE" });
        this.schema.player.belongsTo(this.schema.allyTeam, { foreignKey: "allyTeamId" });

        this.schema.allyTeam.hasMany(this.schema.ai, { foreignKey: "allyTeamId", onDelete: "CASCADE" });
        this.schema.ai.belongsTo(this.schema.allyTeam, { foreignKey: "allyTeamId" });

        this.schema.user.hasMany(this.schema.player, { foreignKey: "userId", onDelete: "CASCADE" });
        this.schema.player.belongsTo(this.schema.user, { foreignKey: "userId" });

        this.schema.user.hasMany(this.schema.alias, { foreignKey: "userId", onDelete: "CASCADE" });
        this.schema.alias.belongsTo(this.schema.user, { foreignKey: "userId" });

        this.schema.user.hasMany(this.schema.spectator, { foreignKey: "userId", onDelete: "CASCADE" });
        this.schema.spectator.belongsTo(this.schema.user, { foreignKey: "userId" });

        this.schema.balanceChangeAuthor.hasMany(this.schema.balanceChange, { foreignKey: "balanceChangeAuthorId", onDelete: "CASCADE" });
        this.schema.balanceChange.belongsTo(this.schema.balanceChangeAuthor, { foreignKey: "balanceChangeAuthorId", as: "author" });

        this.schema.balanceChange.hasMany(this.schema.balanceChangeUnitDef, { foreignKey: "balanceChangeId", onDelete: "CASCADE", as: "changes" });
        this.schema.balanceChangeUnitDef.belongsTo(this.schema.balanceChange, { foreignKey: "balanceChangeId" });

        if (this.config.syncModel) {
            await this.schema.map.sync({ alter: this.config.alterDbSchema });
            await this.schema.user.sync({ alter: this.config.alterDbSchema });
            await this.schema.demo.sync({ alter: this.config.alterDbSchema });
            await this.schema.allyTeam.sync({ alter: this.config.alterDbSchema });
            await this.schema.player.sync({ alter: this.config.alterDbSchema });
            await this.schema.spectator.sync({ alter: this.config.alterDbSchema });
            await this.schema.ai.sync({ alter: this.config.alterDbSchema });
            await this.schema.alias.sync({ alter: this.config.alterDbSchema });
            await this.schema.balanceChangeAuthor.sync({ alter: this.config.alterDbSchema });
            await this.schema.balanceChange.sync({ alter: this.config.alterDbSchema });
            await this.schema.balanceChangeUnitDef.sync({ alter: this.config.alterDbSchema });
        }

        if (this.config.createSchemaDiagram) {
            const svg = await sequelizeErd({ source: this.sequelize });
            await fs.writeFile("db-schema.svg", svg);
        }

        console.timeEnd("schema init");
    }
}