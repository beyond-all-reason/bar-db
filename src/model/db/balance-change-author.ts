import { DataTypes, HasManyAddAssociationMixin, HasManyAddAssociationsMixin, HasManyCountAssociationsMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, HasManyHasAssociationsMixin, HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, HasManySetAssociationsMixin, Model, ModelAttributes, ModelOptions, Optional } from "sequelize";

import { BalanceChange } from "./balance-change";

export namespace BalanceChangeAuthor {
    export interface Schema {
        id: number;
        name: string;
        img: string;
        url: string;
    }
    
    export interface CreationAttributes extends Optional<Schema, "id"> { }
    
    export interface Instance extends Model<Schema, CreationAttributes>, Schema {
        getBalanceChanges: HasManyGetAssociationsMixin<BalanceChange.Instance>;
        setBalanceChanges: HasManySetAssociationsMixin<BalanceChange.Instance, BalanceChange.Instance["id"]>;
        addBalanceChanges: HasManyAddAssociationsMixin<BalanceChange.Instance, BalanceChange.Instance["id"]>;
        addBalanceChange: HasManyAddAssociationMixin<BalanceChange.Instance, BalanceChange.Instance["id"]>;
        createBalanceChange: (change: BalanceChange.CreationAttributes) => Promise<BalanceChange.Instance>;
        removeBalanceChange: HasManyRemoveAssociationMixin<BalanceChange.Instance, BalanceChange.Instance["id"]>;
        removeBalanceChanges: HasManyRemoveAssociationsMixin<BalanceChange.Instance, BalanceChange.Instance["id"]>;
        hasBalanceChange: HasManyHasAssociationMixin<BalanceChange.Instance, BalanceChange.Instance["id"]>;
        hasBalanceChanges: HasManyHasAssociationsMixin<BalanceChange.Instance, BalanceChange.Instance["id"]>;
        countBalanceChanges: HasManyCountAssociationsMixin;
    }

    export const sequelizeDefinition: ModelAttributes<BalanceChangeAuthor.Instance, BalanceChangeAuthor.Schema> = {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING },
        img: { type: DataTypes.STRING },
        url: { type: DataTypes.STRING },
    };

    export const sequelizeOptions: ModelOptions = {
    };
}