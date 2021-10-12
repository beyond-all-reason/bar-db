import { BelongsToGetAssociationMixin, BelongsToSetAssociationMixin, DataTypes, HasManyAddAssociationMixin, HasManyAddAssociationsMixin, HasManyCountAssociationsMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, HasManyHasAssociationsMixin, HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, HasManySetAssociationsMixin, Model, ModelAttributes, ModelOptions, Optional } from "sequelize";

import { BalanceChangeAuthor } from "./balance-change-author";
import { BalanceChangeUnitDef } from "./balance-change-unit-def";

export namespace BalanceChange {
    export interface Schema {
        id: number;
        sha: string;
        url: string;
        date: Date;
        message: string;
    }

    export interface CreationAttributes extends Optional<Schema, "id"> { }

    export interface Instance extends Model<Schema, CreationAttributes>, Schema {
        balanceChangeAuthorId: number;

        getAuthor: BelongsToGetAssociationMixin<BalanceChangeAuthor.Instance>;
        setAuthor: BelongsToSetAssociationMixin<BalanceChangeAuthor.Instance, BalanceChangeAuthor.Instance["id"]>;
        createAuthor: (author: BalanceChangeAuthor.CreationAttributes) => Promise<BalanceChangeAuthor.Instance>;

        getChanges: HasManyGetAssociationsMixin<BalanceChangeUnitDef.Instance>;
        setChanges: HasManySetAssociationsMixin<BalanceChangeUnitDef.Instance, BalanceChangeUnitDef.Instance["id"]>;
        addChange: HasManyAddAssociationsMixin<BalanceChangeUnitDef.Instance, BalanceChangeUnitDef.Instance["id"]>;
        addChanges: HasManyAddAssociationMixin<BalanceChangeUnitDef.Instance, BalanceChangeUnitDef.Instance["id"]>;
        createChange: (unitDef: BalanceChangeUnitDef.CreationAttributes) => Promise<BalanceChangeUnitDef.Instance>;
        removeChange: HasManyRemoveAssociationMixin<BalanceChangeUnitDef.Instance, BalanceChangeUnitDef.Instance["id"]>;
        removeChanges: HasManyRemoveAssociationsMixin<BalanceChangeUnitDef.Instance, BalanceChangeUnitDef.Instance["id"]>;
        hasChange: HasManyHasAssociationMixin<BalanceChangeUnitDef.Instance, BalanceChangeUnitDef.Instance["id"]>;
        hasChanges: HasManyHasAssociationsMixin<BalanceChangeUnitDef.Instance, BalanceChangeUnitDef.Instance["id"]>;
        countChanges: HasManyCountAssociationsMixin;
    }

    export const sequelizeDefinition: ModelAttributes<BalanceChange.Instance, BalanceChange.Schema> = {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        sha: { type: DataTypes.STRING, unique: true },
        url: { type: DataTypes.STRING },
        date: { type: DataTypes.DATE },
        message: { type: DataTypes.TEXT },
    };

    export const sequelizeOptions: ModelOptions = {
        indexes: [{ unique: true, fields: ["sha"] }]
    };
}