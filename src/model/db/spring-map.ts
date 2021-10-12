import { DataTypes, HasManyAddAssociationMixin, HasManyAddAssociationsMixin, HasManyCountAssociationsMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, HasManyHasAssociationsMixin, HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, HasManySetAssociationsMixin, Model, ModelAttributes, ModelOptions, Optional } from "sequelize";
import { DeepPartial } from "jaz-ts-utils";
import { MapInfo } from "spring-map-parser";

import { Demo } from "./demo";

export namespace SpringMap {
    export interface Schema {
        id: number;
        scriptName: string;
        fileName?: string;
        fileNameWithExt?: string;
        description?: string | null;
        mapHardness?: number;
        gravity?: number;
        tidalStrength?: number;
        maxMetal?: number;
        extractorRadius?: number;
        minWind?: number;
        maxWind?: number;
        startPositions?: Array<{
            x: number;
            z: number;
        }> | null;
        width?: number;
        height?: number;
        minDepth?: number;
        maxDepth?: number;
        name?: string;
        shortname?: string;
        author?: string;
        version?: string;
        mapfile?: string;
        modtype?: number;
        notDeformable?: boolean;
        voidWater?: boolean;
        voidGround?: boolean;
        autoShowMetal?: boolean;
        mapInfo?: DeepPartial<MapInfo>;
    }
    
    export interface CreationAttributes extends Optional<Schema, "id"> { }
    
    export interface Instance extends Model<Schema, CreationAttributes>, Schema {
        getDemos: HasManyGetAssociationsMixin<Demo.Instance>;
        setDemos: HasManySetAssociationsMixin<Demo.Instance, Demo.Instance["id"]>;
        addDemos: HasManyAddAssociationsMixin<Demo.Instance, Demo.Instance["id"]>;
        addDemo: HasManyAddAssociationMixin<Demo.Instance, Demo.Instance["id"]>;
        createDemo: (demo: Demo.CreationAttributes) => Promise<Demo.Instance>;
        removeDemo: HasManyRemoveAssociationMixin<Demo.Instance, Demo.Instance["id"]>;
        removeDemos: HasManyRemoveAssociationsMixin<Demo.Instance, Demo.Instance["id"]>;
        hasDemo: HasManyHasAssociationMixin<Demo.Instance, Demo.Instance["id"]>;
        hasDemos: HasManyHasAssociationsMixin<Demo.Instance, Demo.Instance["id"]>;
        countDemos: HasManyCountAssociationsMixin;
    }

    export const sequelizeDefinition: ModelAttributes<SpringMap.Instance, SpringMap.Schema> = {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        scriptName: { type: DataTypes.STRING, allowNull: false },
        fileName: { type: DataTypes.STRING },
        fileNameWithExt: { type: DataTypes.STRING },
        description: { type: DataTypes.TEXT },
        mapHardness: { type: DataTypes.FLOAT },
        gravity: { type: DataTypes.FLOAT },
        tidalStrength: { type: DataTypes.FLOAT },
        maxMetal: { type: DataTypes.FLOAT },
        extractorRadius: { type: DataTypes.FLOAT },
        minWind: { type: DataTypes.FLOAT },
        maxWind: { type: DataTypes.FLOAT },
        startPositions: { type: DataTypes.JSON },
        width: { type: DataTypes.INTEGER },
        height: { type: DataTypes.INTEGER },
        minDepth: { type: DataTypes.FLOAT },
        maxDepth: { type: DataTypes.FLOAT },
        name: { type: DataTypes.STRING },
        shortname: { type: DataTypes.STRING },
        author: { type: DataTypes.STRING },
        version: { type: DataTypes.STRING },
        mapfile: { type: DataTypes.STRING },
        modtype: { type: DataTypes.INTEGER },
        notDeformable: { type: DataTypes.BOOLEAN },
        voidWater: { type: DataTypes.BOOLEAN },
        voidGround: { type: DataTypes.BOOLEAN },
        autoShowMetal: { type: DataTypes.BOOLEAN },
        mapInfo: { type: DataTypes.JSON }
    };

    export const sequelizeOptions: ModelOptions = {
        indexes: [
            {
                unique: true,
                fields: ["scriptName"]
            }
        ]
    };
}