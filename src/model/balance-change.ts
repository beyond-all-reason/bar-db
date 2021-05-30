import { Optional, Model, BelongsToGetAssociationMixin, BelongsToSetAssociationMixin, HasManyAddAssociationMixin, HasManyAddAssociationsMixin, HasManyCountAssociationsMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, HasManyHasAssociationsMixin, HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, HasManySetAssociationsMixin } from "sequelize/types";
import { MapInstance } from "..";
import { BalanceChangeAuthorCreationAttributes, BalanceChangeAuthorInstance } from "./balance-change-author";
import { BalanceChangeUnitDef, BalanceChangeUnitDefCreationAttributes, BalanceChangeUnitDefInstance } from "./balance-change-unit-def";

export interface BalanceChange {
    id: number;
    sha: string;
    url: string;
    date: Date;
    message: string;
}

export interface BalanceChangeCreationAttributes extends Optional<BalanceChange, "id"> { }

export interface BalanceChangeInstance extends Model<BalanceChange, BalanceChangeCreationAttributes>, BalanceChange {
    balanceChangeAuthorId: number;

    getBalanceChangeAuthor: BelongsToGetAssociationMixin<BalanceChangeAuthorInstance>;
    setBalanceChangeAuthor: BelongsToSetAssociationMixin<BalanceChangeAuthorInstance, MapInstance["id"]>;
    createBalanceChangeAuthor: (author: BalanceChangeAuthorCreationAttributes) => Promise<BalanceChangeAuthorInstance>;

    getBalanceChangeUnitDefs: HasManyGetAssociationsMixin<BalanceChangeUnitDefInstance>;
    setBalanceChangeUnitDefs: HasManySetAssociationsMixin<BalanceChangeUnitDefInstance, BalanceChangeUnitDefInstance["id"]>;
    addBalanceChangeUnitDef: HasManyAddAssociationsMixin<BalanceChangeUnitDefInstance, BalanceChangeUnitDefInstance["id"]>;
    addBalanceChangeUnitDefs: HasManyAddAssociationMixin<BalanceChangeUnitDefInstance, BalanceChangeUnitDefInstance["id"]>;
    createBalanceChangeUnitDef: (unitDef: BalanceChangeUnitDefCreationAttributes) => Promise<BalanceChangeUnitDefInstance>;
    removeBalanceChangeUnitDef: HasManyRemoveAssociationMixin<BalanceChangeUnitDefInstance, BalanceChangeUnitDefInstance["id"]>;
    removeBalanceChangeUnitDefs: HasManyRemoveAssociationsMixin<BalanceChangeUnitDefInstance, BalanceChangeUnitDefInstance["id"]>;
    hasBalanceChangeUnitDef: HasManyHasAssociationMixin<BalanceChangeUnitDefInstance, BalanceChangeUnitDefInstance["id"]>;
    hasBalanceChangeUnitDefs: HasManyHasAssociationsMixin<BalanceChangeUnitDefInstance, BalanceChangeUnitDefInstance["id"]>;
    countBalanceChangeUnitDefs: HasManyCountAssociationsMixin;
}