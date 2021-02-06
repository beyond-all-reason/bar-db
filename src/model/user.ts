import { HasManyAddAssociationMixin, HasManyAddAssociationsMixin, HasManyCountAssociationsMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, HasManyHasAssociationsMixin, HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, HasManySetAssociationsMixin, Model } from "sequelize";

import { AliasCreationAttributes, AliasInstance } from "./alias";
import { PlayerCreationAttributes, PlayerInstance } from "./player";
import { SpectatorCreationAttributes, SpectatorInstance } from "./spectator";

export interface User {
    id: number;
    username: string;
    countryCode: string;
    rank: number;
    skillUncertainty?: number;
    skill?: string;
}

export interface UserCreationAttributes extends User { }

export interface UserInstance extends Model<User, UserCreationAttributes>, User {
    getPlayers: HasManyGetAssociationsMixin<PlayerInstance>;
    setPlayers: HasManySetAssociationsMixin<PlayerInstance, PlayerInstance["id"]>;
    addPlayers: HasManyAddAssociationsMixin<PlayerInstance, PlayerInstance["id"]>;
    addPlayer: HasManyAddAssociationMixin<PlayerInstance, PlayerInstance["id"]>;
    createPlayer: (player: PlayerCreationAttributes) => Promise<PlayerInstance>;
    removePlayer: HasManyRemoveAssociationMixin<PlayerInstance, PlayerInstance["id"]>;
    removePlayers: HasManyRemoveAssociationsMixin<PlayerInstance, PlayerInstance["id"]>;
    hasPlayer: HasManyHasAssociationMixin<PlayerInstance, PlayerInstance["id"]>;
    hasPlayers: HasManyHasAssociationsMixin<PlayerInstance, PlayerInstance["id"]>;
    countPlayers: HasManyCountAssociationsMixin;

    getAliases: HasManyGetAssociationsMixin<AliasInstance>;
    setAliases: HasManySetAssociationsMixin<AliasInstance, AliasInstance["id"]>;
    addAliases: HasManyAddAssociationsMixin<AliasInstance, AliasInstance["id"]>;
    addAlias: HasManyAddAssociationMixin<AliasInstance, AliasInstance["id"]>;
    createAlias: (alias: AliasCreationAttributes) => Promise<AliasInstance>;
    removeAlias: HasManyRemoveAssociationMixin<AliasInstance, AliasInstance["id"]>;
    removeAliases: HasManyRemoveAssociationsMixin<AliasInstance, AliasInstance["id"]>;
    hasAlias: HasManyHasAssociationMixin<AliasInstance, AliasInstance["id"]>;
    hasAliases: HasManyHasAssociationsMixin<AliasInstance, AliasInstance["id"]>;
    countAliases: HasManyCountAssociationsMixin;

    getSpectators: HasManyGetAssociationsMixin<SpectatorInstance>;
    setSpectators: HasManySetAssociationsMixin<SpectatorInstance, SpectatorInstance["id"]>;
    addSpectators: HasManyAddAssociationsMixin<SpectatorInstance, SpectatorInstance["id"]>;
    addSpectator: HasManyAddAssociationMixin<SpectatorInstance, SpectatorInstance["id"]>;
    createSpectator: (spectator: SpectatorCreationAttributes) => Promise<SpectatorInstance>;
    removeSpectator: HasManyRemoveAssociationMixin<SpectatorInstance, SpectatorInstance["id"]>;
    removeSpectators: HasManyRemoveAssociationsMixin<SpectatorInstance, SpectatorInstance["id"]>;
    hasSpectator: HasManyHasAssociationMixin<SpectatorInstance, SpectatorInstance["id"]>;
    hasSpectators: HasManyHasAssociationsMixin<SpectatorInstance, SpectatorInstance["id"]>;
    countSpectators: HasManyCountAssociationsMixin;
}