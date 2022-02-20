import { DemoModel } from "sdfz-demo-parser";
import { BelongsToGetAssociationMixin, BelongsToSetAssociationMixin, DataTypes, HasManyAddAssociationMixin, HasManyAddAssociationsMixin, HasManyCountAssociationsMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, HasManyHasAssociationsMixin, HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, HasManySetAssociationsMixin, Model, ModelAttributes, ModelOptions } from "sequelize";

import { AllyTeam } from "./ally-team";
import { Spectator } from "./spectator";
import { SpringMap } from "./spring-map";

export namespace Demo {
    export interface Schema {
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
        spadsSettings?: { [key: string]: string };
        gameEndedNormally: boolean;
        chatlog: DemoModel.ChatMessage[];
        hasBots?: boolean;
        preset?: string;
        reported?: boolean;
        awards?: {
            econDestroyed: Award[];
            fightingUnitsDestroyed: Award[];
            resourceEfficiency: Award[];
            mostResourcesProduced: Award;
            mostDamageTaken: Award;
            sleep: Award;
            cow: Omit<Award, "value">;
        }
    }

    export interface Award {
        teamId: number;
        value: number;
    }

    export interface CreationAttributes extends Schema { }

    export interface Instance extends Model<Schema, CreationAttributes>, Schema {
        mapId: number;

        getMap: BelongsToGetAssociationMixin<SpringMap.Instance>;
        setMap: BelongsToSetAssociationMixin<SpringMap.Instance, SpringMap.Instance["id"]>;
        createMap: (map: SpringMap.CreationAttributes) => Promise<SpringMap.Instance>;

        getAllyTeams: HasManyGetAssociationsMixin<AllyTeam.Instance>;
        setAllyTeams: HasManySetAssociationsMixin<AllyTeam.Instance, AllyTeam.Instance["id"]>;
        addAllyTeams: HasManyAddAssociationsMixin<AllyTeam.Instance, AllyTeam.Instance["id"]>;
        addAllyTeam: HasManyAddAssociationMixin<AllyTeam.Instance, AllyTeam.Instance["id"]>;
        createAllyTeam: (allyTeam: AllyTeam.CreationAttributes) => Promise<AllyTeam.Instance>;
        removeAllyTeam: HasManyRemoveAssociationMixin<AllyTeam.Instance, AllyTeam.Instance["id"]>;
        removeAllyTeams: HasManyRemoveAssociationsMixin<AllyTeam.Instance, AllyTeam.Instance["id"]>;
        hasAllyTeam: HasManyHasAssociationMixin<AllyTeam.Instance, AllyTeam.Instance["id"]>;
        hasAllyTeams: HasManyHasAssociationsMixin<AllyTeam.Instance, AllyTeam.Instance["id"]>;
        countAllyTeams: HasManyCountAssociationsMixin;

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

    export const sequelizeDefinition: ModelAttributes<Demo.Instance, Demo.Schema> = {
        id: { type: DataTypes.STRING, primaryKey: true },
        fileName: { type: DataTypes.STRING, allowNull: false },
        engineVersion: { type: DataTypes.STRING, allowNull: false },
        gameVersion: { type: DataTypes.STRING, allowNull: false },
        startTime: { type: DataTypes.DATE, allowNull: false },
        durationMs: { type: DataTypes.INTEGER, allowNull: false },
        fullDurationMs: { type: DataTypes.INTEGER, allowNull: false },
        hostSettings: { type: DataTypes.JSON, allowNull: false },
        gameSettings: { type: DataTypes.JSON, allowNull: false },
        mapSettings: { type: DataTypes.JSON, allowNull: false },
        spadsSettings: { type: DataTypes.JSON, allowNull: true },
        gameEndedNormally: { type: DataTypes.BOOLEAN, defaultValue: true, allowNull: false },
        chatlog: { type: DataTypes.JSON, defaultValue: [], allowNull: true },
        hasBots: { type: DataTypes.BOOLEAN, allowNull: true },
        preset: { type: DataTypes.STRING, allowNull: true },
        reported: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: true },
        awards: { type: DataTypes.JSON, allowNull: true },
    };

    export const sequelizeOptions: ModelOptions = {
    };
}