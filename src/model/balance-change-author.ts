import { Optional, Model, HasManyAddAssociationMixin, HasManyAddAssociationsMixin, HasManyCountAssociationsMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, HasManyHasAssociationsMixin, HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, HasManySetAssociationsMixin } from "sequelize/types";
import { BalanceChangeCreationAttributes, BalanceChangeInstance, DemoCreationAttributes } from "..";

export interface BalanceChangeAuthor {
    balanceChangeAuthorId: number;
    name: string;
    img: string;
    url: string;
}

export interface BalanceChangeAuthorCreationAttributes extends Optional<BalanceChangeAuthor, "balanceChangeAuthorId"> { }

export interface BalanceChangeAuthorInstance extends Model<BalanceChangeAuthor, BalanceChangeAuthorCreationAttributes>, BalanceChangeAuthor {
    getBalanceChanges: HasManyGetAssociationsMixin<BalanceChangeInstance>;
    setBalanceChanges: HasManySetAssociationsMixin<BalanceChangeInstance, BalanceChangeInstance["balanceChangeAuthorId"]>;
    addBalanceChanges: HasManyAddAssociationsMixin<BalanceChangeInstance, BalanceChangeInstance["balanceChangeAuthorId"]>;
    addBalanceChange: HasManyAddAssociationMixin<BalanceChangeInstance, BalanceChangeInstance["balanceChangeAuthorId"]>;
    createBalanceChange: (change: BalanceChangeCreationAttributes) => Promise<BalanceChangeInstance>;
    removeBalanceChange: HasManyRemoveAssociationMixin<BalanceChangeInstance, BalanceChangeInstance["balanceChangeAuthorId"]>;
    removeBalanceChanges: HasManyRemoveAssociationsMixin<BalanceChangeInstance, BalanceChangeInstance["balanceChangeAuthorId"]>;
    hasBalanceChange: HasManyHasAssociationMixin<BalanceChangeInstance, BalanceChangeInstance["balanceChangeAuthorId"]>;
    hasBalanceChanges: HasManyHasAssociationsMixin<BalanceChangeInstance, BalanceChangeInstance["balanceChangeAuthorId"]>;
    countBalanceChanges: HasManyCountAssociationsMixin;
}