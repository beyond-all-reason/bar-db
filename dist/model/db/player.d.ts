import { BelongsToGetAssociationMixin, BelongsToSetAssociationMixin, Model, ModelAttributes, ModelOptions, Optional } from "sequelize";
import { AllyTeam } from "./ally-team";
import { User } from "./user";
export declare namespace Player {
    interface Schema {
        id: number;
        playerId: number;
        name: string;
        teamId: number;
        handicap: number;
        faction: string;
        countryCode: string;
        rgbColor: {
            r: number;
            g: number;
            b: number;
        };
        rank: number;
        skill: string;
        trueSkill?: number;
        skillUncertainty?: number;
        startPos?: {
            x: number;
            y: number;
            z: number;
        };
    }
    interface CreationAttributes extends Optional<Schema, "id"> {
    }
    interface Instance extends Model<Schema, CreationAttributes>, Schema {
        allyTeamId: number;
        userId: number;
        getAllyTeam: BelongsToGetAssociationMixin<AllyTeam.Instance>;
        setAllyTeam: BelongsToSetAssociationMixin<AllyTeam.Instance, AllyTeam.Instance["id"]>;
        createAllyTeam: (allyTeam: AllyTeam.CreationAttributes) => Promise<AllyTeam.Instance>;
        getUser: BelongsToGetAssociationMixin<User.Instance>;
        setUser: BelongsToSetAssociationMixin<User.Instance, User.Instance["id"]>;
        createUser: (user: User.CreationAttributes) => Promise<User.Instance>;
    }
    const sequelizeDefinition: ModelAttributes<Player.Instance, Player.Schema>;
    const sequelizeOptions: ModelOptions;
}
