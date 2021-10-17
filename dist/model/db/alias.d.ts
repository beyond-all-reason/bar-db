import { BelongsToGetAssociationMixin, BelongsToSetAssociationMixin, Model, ModelAttributes, ModelOptions, Optional } from "sequelize";
import { User } from "./user";
export declare namespace Alias {
    interface Schema {
        id: number;
        alias: string;
    }
    interface CreationAttributes extends Optional<Schema, "id"> {
    }
    interface Instance extends Model<Schema, CreationAttributes>, Schema {
        userId: number;
        getUser: BelongsToGetAssociationMixin<User.Instance>;
        setUser: BelongsToSetAssociationMixin<User.Instance, User.Instance["id"]>;
        createUser: (user: User.CreationAttributes) => Promise<User.Instance>;
    }
    const sequelizeDefinition: ModelAttributes<Alias.Instance, Alias.Schema>;
    const sequelizeOptions: ModelOptions;
}
