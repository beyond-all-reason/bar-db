import { ObjectChanges } from "bar-balance-changes";
import { DataTypes, Model, ModelAttributes, ModelOptions, Optional } from "sequelize";

export namespace BalanceChangeUnitDef {
    export interface Schema {
        id: number;
        unitDefId: string;
        scav: boolean;
        changes: ObjectChanges;
    }
    
    export interface CreationAttributes extends Optional<Schema, "id"> { }
    
    export interface Instance extends Model<Schema, CreationAttributes>, Schema {
    }

    export const sequelizeDefinition: ModelAttributes<BalanceChangeUnitDef.Instance, BalanceChangeUnitDef.Schema> = {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        unitDefId: { type: DataTypes.STRING },
        scav: { type: DataTypes.BOOLEAN },
        changes: { type: DataTypes.JSON },
    };

    export const sequelizeOptions: ModelOptions = {
        indexes: [{ fields: ["unitDefId"] }]
    };
}