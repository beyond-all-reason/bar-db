import { Optional, Model, HasManyAddAssociationMixin, HasManyAddAssociationsMixin, HasManyCountAssociationsMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, HasManyHasAssociationsMixin, HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, HasManySetAssociationsMixin } from "sequelize/types";
import { BalanceChangeCreationAttributes, BalanceChangeInstance, DemoCreationAttributes } from "..";

export interface BalanceChangeAuthor {
    id: number;
    name: string;
    img: string;
    url: string;
}

export interface BalanceChangeAuthorCreationAttributes extends Optional<BalanceChangeAuthor, "id"> { }

export interface BalanceChangeAuthorInstance extends Model<BalanceChangeAuthor, BalanceChangeAuthorCreationAttributes>, BalanceChangeAuthor {
    getBalanceChanges: HasManyGetAssociationsMixin<BalanceChangeInstance>;
    setBalanceChanges: HasManySetAssociationsMixin<BalanceChangeInstance, BalanceChangeInstance["id"]>;
    addBalanceChanges: HasManyAddAssociationsMixin<BalanceChangeInstance, BalanceChangeInstance["id"]>;
    addBalanceChange: HasManyAddAssociationMixin<BalanceChangeInstance, BalanceChangeInstance["id"]>;
    createBalanceChange: (change: BalanceChangeCreationAttributes) => Promise<BalanceChangeInstance>;
    removeBalanceChange: HasManyRemoveAssociationMixin<BalanceChangeInstance, BalanceChangeInstance["id"]>;
    removeBalanceChanges: HasManyRemoveAssociationsMixin<BalanceChangeInstance, BalanceChangeInstance["id"]>;
    hasBalanceChange: HasManyHasAssociationMixin<BalanceChangeInstance, BalanceChangeInstance["id"]>;
    hasBalanceChanges: HasManyHasAssociationsMixin<BalanceChangeInstance, BalanceChangeInstance["id"]>;
    countBalanceChanges: HasManyCountAssociationsMixin;
}