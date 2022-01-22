"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
const fs_1 = require("fs");
const pg_1 = __importDefault(require("pg"));
const sequelize_1 = require("sequelize");
const sequelizeErd = require("sequelize-erd");
const bar_db_config_1 = require("./bar-db-config");
const db_1 = require("./model/db");
class Database {
    constructor(config) {
        this.config = Object.assign({}, bar_db_config_1.defaultBARDBConfig.db, config);
    }
    async init() {
        await this.initDatabase();
        await this.initSchema();
    }
    async initDatabase() {
        console.time("db init");
        const pgClient = new pg_1.default.Client({
            host: this.config.host,
            port: this.config.port,
            user: this.config.username,
            password: this.config.password,
            connectionTimeoutMillis: 3000,
        });
        try {
            await pgClient.connect();
        }
        catch (err) {
            console.log("Couldn't connect to postgres db");
            console.log(err);
        }
        const dbExistsQuery = await pgClient.query("SELECT datname FROM pg_catalog.pg_database WHERE lower(datname) = 'bar';");
        const dbExists = dbExistsQuery.rowCount > 0;
        if (!dbExists) {
            await pgClient.query("CREATE DATABASE bar");
            console.log("bar database created.");
            this.config.alterDbSchema = true;
        }
        await pgClient.end();
        this.sequelize = new sequelize_1.Sequelize({
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
        }
        catch (error) {
            console.log("Unable to connect to the database:", error);
            throw error;
        }
        console.timeEnd("db init");
    }
    async initSchema() {
        console.time("schema init");
        this.schema = {
            map: this.sequelize.define("Map", db_1.DBSchema.SpringMap.sequelizeDefinition, db_1.DBSchema.SpringMap.sequelizeOptions),
            demo: this.sequelize.define("Demo", db_1.DBSchema.Demo.sequelizeDefinition, db_1.DBSchema.Demo.sequelizeOptions),
            allyTeam: this.sequelize.define("AllyTeam", db_1.DBSchema.AllyTeam.sequelizeDefinition, db_1.DBSchema.AllyTeam.sequelizeOptions),
            player: this.sequelize.define("Player", db_1.DBSchema.Player.sequelizeDefinition, db_1.DBSchema.Player.sequelizeOptions),
            spectator: this.sequelize.define("Spectator", db_1.DBSchema.Spectator.sequelizeDefinition, db_1.DBSchema.Spectator.sequelizeOptions),
            ai: this.sequelize.define("AI", db_1.DBSchema.AI.sequelizeDefinition, db_1.DBSchema.AI.sequelizeOptions),
            user: this.sequelize.define("User", db_1.DBSchema.User.sequelizeDefinition, db_1.DBSchema.User.sequelizeOptions),
            alias: this.sequelize.define("Alias", db_1.DBSchema.Alias.sequelizeDefinition, db_1.DBSchema.Alias.sequelizeOptions),
            balanceChangeAuthor: this.sequelize.define("BalanceChangeAuthor", db_1.DBSchema.BalanceChangeAuthor.sequelizeDefinition, db_1.DBSchema.BalanceChangeAuthor.sequelizeOptions),
            balanceChange: this.sequelize.define("BalanceChange", db_1.DBSchema.BalanceChange.sequelizeDefinition, db_1.DBSchema.BalanceChange.sequelizeOptions),
            balanceChangeUnitDef: this.sequelize.define("BalanceChangeUnitDef", db_1.DBSchema.BalanceChangeUnitDef.sequelizeDefinition, db_1.DBSchema.BalanceChangeUnitDef.sequelizeOptions),
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
            await fs_1.promises.writeFile("db-schema.svg", svg);
        }
        console.timeEnd("schema init");
    }
}
exports.Database = Database;
//# sourceMappingURL=database.js.map