import { ModelCtor, Sequelize } from "sequelize";
import { BARDBConfig } from "./bar-db-config";
import { DBSchema } from "./model/db";
export declare class Database {
    sequelize: Sequelize;
    schema: {
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
    config: BARDBConfig["db"];
    constructor(config: BARDBConfig["db"]);
    init(): Promise<void>;
    protected initDatabase(): Promise<void>;
    protected initSchema(): Promise<void>;
}
