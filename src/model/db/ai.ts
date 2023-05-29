import { BelongsToGetAssociationMixin, BelongsToSetAssociationMixin, DataTypes, Model, ModelAttributes, ModelOptions, Optional } from "sequelize";

import { AllyTeam } from "./ally-team";

export namespace AI {
    export interface Schema {
        id: number;
        aiId: number;
        shortName: string;
        name: string;
        host: boolean;
        handicap: number;
        faction: string;
        rgbColor: { r: number, g: number, b: number };
        startPos?: { x: number, y: number, z: number };
    }
    
    export interface CreationAttributes extends Optional<Schema, "id"> { }
    
    export interface Instance extends Model<Schema, CreationAttributes>, Schema {
        allyTeamId: number;
    
        getAllyTeam: BelongsToGetAssociationMixin<AllyTeam.Instance>;
        setAllyTeam: BelongsToSetAssociationMixin<AllyTeam.Instance, AllyTeam.Instance["id"]>;
        createAllyTeam: (allyTeam: AllyTeam.CreationAttributes) => Promise<AllyTeam.Instance>;
    }

    export const sequelizeDefinition: ModelAttributes<AI.Instance, AI.Schema> = {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        aiId: { type: DataTypes.INTEGER },
        shortName: { type: DataTypes.STRING },
        name: { type: DataTypes.STRING },
        host: { type: DataTypes.BOOLEAN },
        startPos: { type: DataTypes.JSON, allowNull: true },
        handicap: { type: DataTypes.INTEGER },
        faction: { type: DataTypes.STRING },
        rgbColor: { type: DataTypes.JSON }
    };

    export const sequelizeOptions: ModelOptions = {
        indexes: [
            { fields: ["allyTeamId"] },
        ]
    };
}