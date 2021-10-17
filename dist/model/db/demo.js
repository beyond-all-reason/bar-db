"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Demo = void 0;
const sequelize_1 = require("sequelize");
var Demo;
(function (Demo) {
    Demo.sequelizeDefinition = {
        id: { type: sequelize_1.DataTypes.STRING, primaryKey: true },
        fileName: { type: sequelize_1.DataTypes.STRING, unique: true, allowNull: false },
        engineVersion: { type: sequelize_1.DataTypes.STRING, allowNull: false },
        gameVersion: { type: sequelize_1.DataTypes.STRING, allowNull: false },
        startTime: { type: sequelize_1.DataTypes.DATE, allowNull: false },
        durationMs: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
        fullDurationMs: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
        hostSettings: { type: sequelize_1.DataTypes.JSON, allowNull: false },
        gameSettings: { type: sequelize_1.DataTypes.JSON, allowNull: false },
        mapSettings: { type: sequelize_1.DataTypes.JSON, allowNull: false },
        gameEndedNormally: { type: sequelize_1.DataTypes.BOOLEAN, defaultValue: true, allowNull: false },
        chatlog: { type: sequelize_1.DataTypes.JSON, defaultValue: [], allowNull: true },
        hasBots: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: true },
        preset: { type: sequelize_1.DataTypes.STRING, allowNull: true },
        reported: { type: sequelize_1.DataTypes.BOOLEAN, defaultValue: false, allowNull: true }
    };
    Demo.sequelizeOptions = {};
})(Demo = exports.Demo || (exports.Demo = {}));
//# sourceMappingURL=demo.js.map