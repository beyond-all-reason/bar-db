import { ObjectChanges } from "bar-balance-changes";
import { Model, Optional } from "sequelize/types";

export interface BalanceChangeUnitDef {
    id: number;
    unitDefId: string;
    scav: boolean;
    changes: ObjectChanges;
}

export interface BalanceChangeUnitDefCreationAttributes extends Optional<BalanceChangeUnitDef, "id"> { }

export interface BalanceChangeUnitDefInstance extends Model<BalanceChangeUnitDef, BalanceChangeUnitDefCreationAttributes>, BalanceChangeUnitDef {
}