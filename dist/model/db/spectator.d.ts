import { BelongsToGetAssociationMixin, BelongsToSetAssociationMixin, Model, ModelAttributes, ModelOptions, Optional } from "sequelize";
import { User } from "./user";
export declare namespace Spectator {
    interface Schema {
        id: number;
        playerId: number;
        name: string;
        countryCode: string;
        rank: number;
        skill: string;
        skillUncertainty?: number;
    }
    interface CreationAttributes extends Optional<Schema, "id"> {
    }
    interface Instance extends Model<Schema, CreationAttributes>, Schema {
        demoId: string;
        userId: number;
        getUser: BelongsToGetAssociationMixin<User.Instance>;
        setUser: BelongsToSetAssociationMixin<User.Instance, User.Instance["id"]>;
        createUser: (user: User.CreationAttributes) => Promise<User.Instance>;
    }
    const sequelizeDefinition: ModelAttributes<Spectator.Instance, Spectator.Schema>;
    const sequelizeOptions: ModelOptions;
}
