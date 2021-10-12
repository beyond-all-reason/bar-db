import { BelongsToGetAssociationMixin, BelongsToSetAssociationMixin, DataTypes, Model, ModelAttributes, ModelOptions, Optional } from "sequelize";

import { User } from "./user";

export namespace Alias {
    export interface Schema {
        id: number;
        alias: string;
    }

    export interface CreationAttributes extends Optional<Schema, "id"> { }

    export interface Instance extends Model<Schema, CreationAttributes>, Schema {
        userId: number;

        getUser: BelongsToGetAssociationMixin<User.Instance>;
        setUser: BelongsToSetAssociationMixin<User.Instance, User.Instance["id"]>;
        createUser: (user: User.CreationAttributes) => Promise<User.Instance>;
    }

    export const sequelizeDefinition: ModelAttributes<Alias.Instance, Alias.Schema> = {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        alias: { type: DataTypes.STRING }
    };

    export const sequelizeOptions: ModelOptions = {
    };
}