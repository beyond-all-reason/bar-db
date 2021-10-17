import { HasManyAddAssociationMixin, HasManyAddAssociationsMixin, HasManyCountAssociationsMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, HasManyHasAssociationsMixin, HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, HasManySetAssociationsMixin, Model, ModelAttributes, ModelOptions, Optional } from "sequelize";
import { BalanceChange } from "./balance-change";
export declare namespace BalanceChangeAuthor {
    interface Schema {
        id: number;
        name: string;
        img: string;
        url: string;
    }
    interface CreationAttributes extends Optional<Schema, "id"> {
    }
    interface Instance extends Model<Schema, CreationAttributes>, Schema {
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
    const sequelizeDefinition: ModelAttributes<BalanceChangeAuthor.Instance, BalanceChangeAuthor.Schema>;
    const sequelizeOptions: ModelOptions;
}
