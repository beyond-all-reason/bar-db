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

    getAuthor: BelongsToGetAssociationMixin<BalanceChangeAuthorInstance>;
    setAuthor: BelongsToSetAssociationMixin<BalanceChangeAuthorInstance, MapInstance["id"]>;
    createAuthor: (author: BalanceChangeAuthorCreationAttributes) => Promise<BalanceChangeAuthorInstance>;

    getChanges: HasManyGetAssociationsMixin<BalanceChangeUnitDefInstance>;
    setChanges: HasManySetAssociationsMixin<BalanceChangeUnitDefInstance, BalanceChangeUnitDefInstance["id"]>;
    addChange: HasManyAddAssociationsMixin<BalanceChangeUnitDefInstance, BalanceChangeUnitDefInstance["id"]>;
    addChanges: HasManyAddAssociationMixin<BalanceChangeUnitDefInstance, BalanceChangeUnitDefInstance["id"]>;
    createChange: (unitDef: BalanceChangeUnitDefCreationAttributes) => Promise<BalanceChangeUnitDefInstance>;
    removeChange: HasManyRemoveAssociationMixin<BalanceChangeUnitDefInstance, BalanceChangeUnitDefInstance["id"]>;
    removeChanges: HasManyRemoveAssociationsMixin<BalanceChangeUnitDefInstance, BalanceChangeUnitDefInstance["id"]>;
    hasChange: HasManyHasAssociationMixin<BalanceChangeUnitDefInstance, BalanceChangeUnitDefInstance["id"]>;
    hasChanges: HasManyHasAssociationsMixin<BalanceChangeUnitDefInstance, BalanceChangeUnitDefInstance["id"]>;
    countChanges: HasManyCountAssociationsMixin;
}