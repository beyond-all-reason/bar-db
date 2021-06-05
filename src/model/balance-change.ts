import { Optional, Model, BelongsToGetAssociationMixin, BelongsToSetAssociationMixin, HasManyAddAssociationMixin, HasManyAddAssociationsMixin, HasManyCountAssociationsMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, HasManyHasAssociationsMixin, HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, HasManySetAssociationsMixin } from "sequelize/types";
import { MapInstance } from "..";
import { BalanceChangeAuthorCreationAttributes, BalanceChangeAuthorInstance } from "./balance-change-author";
import { BalanceChangeUnitDef, BalanceChangeUnitDefCreationAttributes, BalanceChangeUnitDefInstance } from "./balance-change-unit-def";

export interface BalanceChange {
    balanceChangeId: number;
    sha: string;
    url: string;
    date: Date;
    message: string;
}

export interface BalanceChangeCreationAttributes extends Optional<BalanceChange, "balanceChangeId"> { }

export interface BalanceChangeInstance extends Model<BalanceChange, BalanceChangeCreationAttributes>, BalanceChange {
    balanceChangeAuthorId: number;

    getBalanceChangeAuthor: BelongsToGetAssociationMixin<BalanceChangeAuthorInstance>;
    setBalanceChangeAuthor: BelongsToSetAssociationMixin<BalanceChangeAuthorInstance, BalanceChangeAuthorInstance["balanceChangeAuthorId"]>;
    createBalanceChangeAuthor: (author: BalanceChangeAuthorCreationAttributes) => Promise<BalanceChangeAuthorInstance>;

    getBalanceChangeUnitDefs: HasManyGetAssociationsMixin<BalanceChangeUnitDefInstance>;
    setBalanceChangeUnitDefs: HasManySetAssociationsMixin<BalanceChangeUnitDefInstance, BalanceChangeUnitDefInstance["balanceChangeUnitDefId"]>;
    addBalanceChangeUnitDef: HasManyAddAssociationsMixin<BalanceChangeUnitDefInstance, BalanceChangeUnitDefInstance["balanceChangeUnitDefId"]>;
    addBalanceChangeUnitDefs: HasManyAddAssociationMixin<BalanceChangeUnitDefInstance, BalanceChangeUnitDefInstance["balanceChangeUnitDefId"]>;
    createBalanceChangeUnitDef: (unitDef: BalanceChangeUnitDefCreationAttributes) => Promise<BalanceChangeUnitDefInstance>;
    removeBalanceChangeUnitDef: HasManyRemoveAssociationMixin<BalanceChangeUnitDefInstance, BalanceChangeUnitDefInstance["balanceChangeUnitDefId"]>;
    removeBalanceChangeUnitDefs: HasManyRemoveAssociationsMixin<BalanceChangeUnitDefInstance, BalanceChangeUnitDefInstance["balanceChangeUnitDefId"]>;
    hasBalanceChangeUnitDef: HasManyHasAssociationMixin<BalanceChangeUnitDefInstance, BalanceChangeUnitDefInstance["balanceChangeUnitDefId"]>;
    hasBalanceChangeUnitDefs: HasManyHasAssociationsMixin<BalanceChangeUnitDefInstance, BalanceChangeUnitDefInstance["balanceChangeUnitDefId"]>;
    countBalanceChangeUnitDefs: HasManyCountAssociationsMixin;
}