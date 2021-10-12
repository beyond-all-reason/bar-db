import { BelongsToGetAssociationMixin, BelongsToSetAssociationMixin, DataTypes, Model, ModelAttributes, ModelOptions, Optional } from "sequelize";

import { AllyTeam } from "./ally-team";
import { User } from "./user";

export namespace Player {
    export interface Schema {
        id: number;
        playerId: number;
        name: string;
        teamId: number;
        handicap: number;
        faction: string;
        countryCode: string;
        rgbColor: { r: number, g: number, b: number };
        rank: number;
        skill: string;
        trueSkill?: number;
        skillUncertainty?: number;
        startPos?: { x: number, y: number, z: number };
    }
    
    export interface CreationAttributes extends Optional<Schema, "id"> { }
    
    export interface Instance extends Model<Schema, CreationAttributes>, Schema {
        allyTeamId: number;
        userId: number;
    
        getAllyTeam: BelongsToGetAssociationMixin<AllyTeam.Instance>;
        setAllyTeam: BelongsToSetAssociationMixin<AllyTeam.Instance, AllyTeam.Instance["id"]>;
        createAllyTeam: (allyTeam: AllyTeam.CreationAttributes) => Promise<AllyTeam.Instance>;
    
        getUser: BelongsToGetAssociationMixin<User.Instance>;
        setUser: BelongsToSetAssociationMixin<User.Instance, User.Instance["id"]>;
        createUser: (user: User.CreationAttributes) => Promise<User.Instance>;
    }

    export const sequelizeDefinition: ModelAttributes<Player.Instance, Player.Schema> = {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        playerId: { type: DataTypes.INTEGER },
        name: { type: DataTypes.STRING },
        teamId: { type: DataTypes.INTEGER },
        handicap: { type: DataTypes.INTEGER },
        faction: { type: DataTypes.STRING },
        countryCode: { type: DataTypes.STRING },
        rgbColor: { type: DataTypes.JSON },
        rank: { type: DataTypes.INTEGER },
        skillUncertainty: { type: DataTypes.INTEGER, allowNull: true },
        skill: { type: DataTypes.STRING },
        trueSkill: { type: DataTypes.FLOAT, allowNull: true },
        startPos: { type: DataTypes.JSON, allowNull: true }
    };

    export const sequelizeOptions: ModelOptions = {
    };
}