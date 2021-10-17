import { ObjectChanges } from "bar-balance-changes";
import { Model, ModelAttributes, ModelOptions, Optional } from "sequelize";
export declare namespace BalanceChangeUnitDef {
    interface Schema {
        id: number;
        unitDefId: string;
        scav: boolean;
        changes: ObjectChanges;
    }
    interface CreationAttributes extends Optional<Schema, "id"> {
    }
    interface Instance extends Model<Schema, CreationAttributes>, Schema {
    }
    const sequelizeDefinition: ModelAttributes<BalanceChangeUnitDef.Instance, BalanceChangeUnitDef.Schema>;
    const sequelizeOptions: ModelOptions;
}
