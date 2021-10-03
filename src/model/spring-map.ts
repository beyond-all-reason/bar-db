import { DeepPartial } from "jaz-ts-utils";
import { HasManyAddAssociationMixin, HasManyAddAssociationsMixin, HasManyCountAssociationsMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, HasManyHasAssociationsMixin, HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, HasManySetAssociationsMixin, Model, Optional } from "sequelize";
import { MapInfo } from "spring-map-parser";

import { DemoCreationAttributes, DemoInstance } from "./demo";

export interface SpringMap {
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
    }>;
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

export interface SpringMapCreationAttributes extends Optional<SpringMap, "id"> { }

export interface SpringMapInstance extends Model<SpringMap, SpringMapCreationAttributes>, SpringMap {
    getDemos: HasManyGetAssociationsMixin<DemoInstance>;
    setDemos: HasManySetAssociationsMixin<DemoInstance, DemoInstance["id"]>;
    addDemos: HasManyAddAssociationsMixin<DemoInstance, DemoInstance["id"]>;
    addDemo: HasManyAddAssociationMixin<DemoInstance, DemoInstance["id"]>;
    createDemo: (demo: DemoCreationAttributes) => Promise<DemoInstance>;
    removeDemo: HasManyRemoveAssociationMixin<DemoInstance, DemoInstance["id"]>;
    removeDemos: HasManyRemoveAssociationsMixin<DemoInstance, DemoInstance["id"]>;
    hasDemo: HasManyHasAssociationMixin<DemoInstance, DemoInstance["id"]>;
    hasDemos: HasManyHasAssociationsMixin<DemoInstance, DemoInstance["id"]>;
    countDemos: HasManyCountAssociationsMixin;
}