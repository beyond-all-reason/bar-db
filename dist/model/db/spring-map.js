"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpringMap = void 0;
const sequelize_1 = require("sequelize");
var SpringMap;
(function (SpringMap) {
    SpringMap.sequelizeDefinition = {
        id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        scriptName: { type: sequelize_1.DataTypes.STRING, allowNull: false },
        fileName: { type: sequelize_1.DataTypes.STRING },
        fileNameWithExt: { type: sequelize_1.DataTypes.STRING },
        description: { type: sequelize_1.DataTypes.TEXT },
        mapHardness: { type: sequelize_1.DataTypes.FLOAT },
        gravity: { type: sequelize_1.DataTypes.FLOAT },
        tidalStrength: { type: sequelize_1.DataTypes.FLOAT },
        maxMetal: { type: sequelize_1.DataTypes.FLOAT },
        extractorRadius: { type: sequelize_1.DataTypes.FLOAT },
        minWind: { type: sequelize_1.DataTypes.FLOAT },
        maxWind: { type: sequelize_1.DataTypes.FLOAT },
        startPositions: { type: sequelize_1.DataTypes.JSON },
        width: { type: sequelize_1.DataTypes.INTEGER },
        height: { type: sequelize_1.DataTypes.INTEGER },
        minDepth: { type: sequelize_1.DataTypes.FLOAT },
        maxDepth: { type: sequelize_1.DataTypes.FLOAT },
        name: { type: sequelize_1.DataTypes.STRING },
        shortname: { type: sequelize_1.DataTypes.STRING },
        author: { type: sequelize_1.DataTypes.STRING },
        version: { type: sequelize_1.DataTypes.STRING },
        mapfile: { type: sequelize_1.DataTypes.STRING },
        modtype: { type: sequelize_1.DataTypes.INTEGER },
        notDeformable: { type: sequelize_1.DataTypes.BOOLEAN },
        voidWater: { type: sequelize_1.DataTypes.BOOLEAN },
        voidGround: { type: sequelize_1.DataTypes.BOOLEAN },
        autoShowMetal: { type: sequelize_1.DataTypes.BOOLEAN },
        mapInfo: { type: sequelize_1.DataTypes.JSON }
    };
    SpringMap.sequelizeOptions = {
        indexes: [
            {
                unique: true,
                fields: ["scriptName"]
            }
        ]
    };
})(SpringMap = exports.SpringMap || (exports.SpringMap = {}));
//# sourceMappingURL=spring-map.js.map