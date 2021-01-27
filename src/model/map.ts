import { HasManyAddAssociationMixin, HasManyAddAssociationsMixin, HasManyCountAssociationsMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, HasManyHasAssociationsMixin, HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, HasManySetAssociationsMixin, Model, Optional } from "sequelize";

import { DemoCreationAttributes, DemoInstance } from "./demo";

export interface Map {
    id: number;
    scriptName: string;
    fileName?: string;
    description?: string;
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
}

export interface MapCreationAttributes extends Optional<Map, "id"> { }

export interface MapInstance extends Model<Map, MapCreationAttributes>, Map {
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