import { DataTypes, HasManyAddAssociationMixin, HasManyAddAssociationsMixin, HasManyCountAssociationsMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, HasManyHasAssociationsMixin, HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, HasManySetAssociationsMixin, Model, ModelAttributes, ModelOptions } from "sequelize";

import { Alias } from "./alias";
import { Player } from "./player";
import { Spectator } from "./spectator";

export namespace User {
    export interface Schema {
        id: number;
        username: string;
        countryCode: string;
        rank: number;
        skillUncertainty?: number;
        skill?: string;
        trueSkill?: number;
        privacyMode?: boolean;
        trueSkillMu?: number;
        trueSkillSigma?: number;
    }
    
    export interface CreationAttributes extends Schema { }
    
    export interface Instance extends Model<Schema, CreationAttributes>, Schema {
        getPlayers: HasManyGetAssociationsMixin<Player.Instance>;
        setPlayers: HasManySetAssociationsMixin<Player.Instance, Player.Instance["id"]>;
        addPlayers: HasManyAddAssociationsMixin<Player.Instance, Player.Instance["id"]>;
        addPlayer: HasManyAddAssociationMixin<Player.Instance, Player.Instance["id"]>;
        createPlayer: (player: Player.CreationAttributes) => Promise<Player.Instance>;
        removePlayer: HasManyRemoveAssociationMixin<Player.Instance, Player.Instance["id"]>;
        removePlayers: HasManyRemoveAssociationsMixin<Player.Instance, Player.Instance["id"]>;
        hasPlayer: HasManyHasAssociationMixin<Player.Instance, Player.Instance["id"]>;
        hasPlayers: HasManyHasAssociationsMixin<Player.Instance, Player.Instance["id"]>;
        countPlayers: HasManyCountAssociationsMixin;
    
        getAliases: HasManyGetAssociationsMixin<Alias.Instance>;
        setAliases: HasManySetAssociationsMixin<Alias.Instance, Alias.Instance["id"]>;
        addAliases: HasManyAddAssociationsMixin<Alias.Instance, Alias.Instance["id"]>;
        addAlias: HasManyAddAssociationMixin<Alias.Instance, Alias.Instance["id"]>;
        createAlias: (alias: Alias.CreationAttributes) => Promise<Alias.Instance>;
        removeAlias: HasManyRemoveAssociationMixin<Alias.Instance, Alias.Instance["id"]>;
        removeAliases: HasManyRemoveAssociationsMixin<Alias.Instance, Alias.Instance["id"]>;
        hasAlias: HasManyHasAssociationMixin<Alias.Instance, Alias.Instance["id"]>;
        hasAliases: HasManyHasAssociationsMixin<Alias.Instance, Alias.Instance["id"]>;
        countAliases: HasManyCountAssociationsMixin;
    
        getSpectators: HasManyGetAssociationsMixin<Spectator.Instance>;
        setSpectators: HasManySetAssociationsMixin<Spectator.Instance, Spectator.Instance["id"]>;
        addSpectators: HasManyAddAssociationsMixin<Spectator.Instance, Spectator.Instance["id"]>;
        addSpectator: HasManyAddAssociationMixin<Spectator.Instance, Spectator.Instance["id"]>;
        createSpectator: (spectator: Spectator.CreationAttributes) => Promise<Spectator.Instance>;
        removeSpectator: HasManyRemoveAssociationMixin<Spectator.Instance, Spectator.Instance["id"]>;
        removeSpectators: HasManyRemoveAssociationsMixin<Spectator.Instance, Spectator.Instance["id"]>;
        hasSpectator: HasManyHasAssociationMixin<Spectator.Instance, Spectator.Instance["id"]>;
        hasSpectators: HasManyHasAssociationsMixin<Spectator.Instance, Spectator.Instance["id"]>;
        countSpectators: HasManyCountAssociationsMixin;
    }

    export const sequelizeDefinition: ModelAttributes<User.Instance, User.Schema> = {
        id: { type: DataTypes.INTEGER, primaryKey: true },
        username: { type: DataTypes.STRING },
        countryCode: { type: DataTypes.STRING },
        rank: { type: DataTypes.INTEGER },
        skill: { type: DataTypes.STRING },
        trueSkill: { type: DataTypes.FLOAT, allowNull: true },
        skillUncertainty: { type: DataTypes.FLOAT },
        privacyMode: { type: DataTypes.BOOLEAN, allowNull: true },
        trueSkillMu: { type: DataTypes.FLOAT, allowNull: true },
        trueSkillSigma: { type: DataTypes.FLOAT, allowNull: true },
    };

    export const sequelizeOptions: ModelOptions = {
        indexes: [
            {
                fields: ["username"]
            }
        ]
    };
}