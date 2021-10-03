import { DemoModel } from "sdfz-demo-parser";
import { BelongsToGetAssociationMixin, BelongsToSetAssociationMixin, HasManyAddAssociationMixin, HasManyAddAssociationsMixin, HasManyCountAssociationsMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, HasManyHasAssociationsMixin, HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, HasManySetAssociationsMixin, Model } from "sequelize";

import { AllyTeamCreationAttributes, AllyTeamInstance } from "./ally-team";
import { SpringMapCreationAttributes, SpringMapInstance } from "./spring-map";
import { SpectatorCreationAttributes, SpectatorInstance } from "./spectator";

export interface Demo {
    id: string;
    fileName: string;
    engineVersion: string;
    gameVersion: string;
    startTime: Date;
    durationMs: number;
    fullDurationMs: number;
    hostSettings: { [key: string]: string };
    gameSettings: { [key: string]: string };
    mapSettings: { [key: string]: string };
    gameEndedNormally: boolean;
    chatlog: DemoModel.ChatMessage[];
    hasBots?: boolean;
    preset?: "duel" | "team" | "ffa";
    reported?: boolean;
}

export interface DemoCreationAttributes extends Demo { }

export interface DemoInstance extends Model<Demo, DemoCreationAttributes>, Demo {
    mapId: number;

    getMap: BelongsToGetAssociationMixin<SpringMapInstance>;
    setMap: BelongsToSetAssociationMixin<SpringMapInstance, SpringMapInstance["id"]>;
    createMap: (map: SpringMapCreationAttributes) => Promise<SpringMapInstance>;

    getAllyTeams: HasManyGetAssociationsMixin<AllyTeamInstance>;
    setAllyTeams: HasManySetAssociationsMixin<AllyTeamInstance, AllyTeamInstance["id"]>;
    addAllyTeams: HasManyAddAssociationsMixin<AllyTeamInstance, AllyTeamInstance["id"]>;
    addAllyTeam: HasManyAddAssociationMixin<AllyTeamInstance, AllyTeamInstance["id"]>;
    createAllyTeam: (allyTeam: AllyTeamCreationAttributes) => Promise<AllyTeamInstance>;
    removeAllyTeam: HasManyRemoveAssociationMixin<AllyTeamInstance, AllyTeamInstance["id"]>;
    removeAllyTeams: HasManyRemoveAssociationsMixin<AllyTeamInstance, AllyTeamInstance["id"]>;
    hasAllyTeam: HasManyHasAssociationMixin<AllyTeamInstance, AllyTeamInstance["id"]>;
    hasAllyTeams: HasManyHasAssociationsMixin<AllyTeamInstance, AllyTeamInstance["id"]>;
    countAllyTeams: HasManyCountAssociationsMixin;

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