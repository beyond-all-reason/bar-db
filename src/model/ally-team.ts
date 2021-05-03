import { BelongsToGetAssociationMixin, BelongsToSetAssociationMixin, HasManyAddAssociationMixin, HasManyAddAssociationsMixin, HasManyCountAssociationsMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, HasManyHasAssociationsMixin, HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, HasManySetAssociationsMixin, Model, Optional } from "sequelize";

import { AICreationAttributes, AIInstance } from "./ai";
import { DemoCreationAttributes, DemoInstance } from "./demo";
import { PlayerCreationAttributes, PlayerInstance } from "./player";

export interface AllyTeam {
    id: number;
    allyTeamId: number;
    startBox: {
        top: number;
        bottom: number;
        left: number;
        right: number;
    };
    winningTeam: boolean;
}

export interface AllyTeamCreationAttributes extends Optional<AllyTeam, "id"> { }

export interface AllyTeamInstance extends Model<AllyTeam, AllyTeamCreationAttributes>, AllyTeam {
    demoId: string;

    getDemo: BelongsToGetAssociationMixin<DemoInstance>;
    setDemo: BelongsToSetAssociationMixin<DemoInstance, DemoInstance["id"]>;
    createDemo: (demo: DemoCreationAttributes) => Promise<DemoInstance>;

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

    getAIs: HasManyGetAssociationsMixin<AIInstance>;
    setAIs: HasManySetAssociationsMixin<AIInstance, AIInstance["id"]>;
    addAIs: HasManyAddAssociationsMixin<AIInstance, AIInstance["id"]>;
    addAI: HasManyAddAssociationMixin<AIInstance, AIInstance["id"]>;
    createAI: (ai: AICreationAttributes) => Promise<AIInstance>;
    removeAI: HasManyRemoveAssociationMixin<AIInstance, AIInstance["id"]>;
    removeAIs: HasManyRemoveAssociationsMixin<AIInstance, AIInstance["id"]>;
    hasAI: HasManyHasAssociationMixin<AIInstance, AIInstance["id"]>;
    hasAIs: HasManyHasAssociationsMixin<AIInstance, AIInstance["id"]>;
    countAIs: HasManyCountAssociationsMixin;
}