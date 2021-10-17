import { HasManyAddAssociationMixin, HasManyAddAssociationsMixin, HasManyCountAssociationsMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, HasManyHasAssociationsMixin, HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, HasManySetAssociationsMixin, Model, ModelAttributes, ModelOptions, Optional } from "sequelize";
import { DeepPartial } from "jaz-ts-utils";
import { MapInfo } from "spring-map-parser";
import { Demo } from "./demo";
export declare namespace SpringMap {
    interface Schema {
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
    interface CreationAttributes extends Optional<Schema, "id"> {
    }
    interface Instance extends Model<Schema, CreationAttributes>, Schema {
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
    const sequelizeDefinition: ModelAttributes<SpringMap.Instance, SpringMap.Schema>;
    const sequelizeOptions: ModelOptions;
}
