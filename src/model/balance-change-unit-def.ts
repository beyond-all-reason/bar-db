import { ObjectChanges } from "bar-balance-changes";
import { Optional, Model } from "sequelize/types";

export interface BalanceChangeUnitDef {
    id: number;
    unitDefId: string;
    changes: ObjectChanges;
}

export interface BalanceChangeUnitDefCreationAttributes extends Optional<BalanceChangeUnitDef, "id"> { }

export interface BalanceChangeUnitDefInstance extends Model<BalanceChangeUnitDef, BalanceChangeUnitDefCreationAttributes>, BalanceChangeUnitDef {
}