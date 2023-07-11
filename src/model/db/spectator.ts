import { BelongsToGetAssociationMixin, BelongsToSetAssociationMixin, DataTypes, Model, ModelAttributes, ModelOptions, Optional } from "sequelize";

import { User } from "./user";

export namespace Spectator {
    export interface Schema {
        id: number;
        playerId: number;
        name: string;
        countryCode: string;
        rank: number | null;
        skill: string;
        skillUncertainty?: number;
    }

    export interface CreationAttributes extends Optional<Schema, "id"> { }

    export interface Instance extends Model<Schema, CreationAttributes>, Schema {
        demoId: string;
        userId: number;

        getUser: BelongsToGetAssociationMixin<User.Instance>;
        setUser: BelongsToSetAssociationMixin<User.Instance, User.Instance["id"]>;
        createUser: (user: User.CreationAttributes) => Promise<User.Instance>;
    }

    export const sequelizeDefinition: ModelAttributes<Spectator.Instance, Spectator.Schema> = {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        playerId: { type: DataTypes.INTEGER },
        name: { type: DataTypes.STRING },
        countryCode: { type: DataTypes.STRING },
        rank: { type: DataTypes.INTEGER, allowNull: true },
        skillUncertainty: { type: DataTypes.INTEGER },
        skill: { type: DataTypes.STRING }
    };

    export const sequelizeOptions: ModelOptions = {
        indexes: [
            { fields: ["demoId"] },
        ]
    };
}