"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AI = void 0;
const sequelize_1 = require("sequelize");
var AI;
(function (AI) {
    AI.sequelizeDefinition = {
        id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        aiId: { type: sequelize_1.DataTypes.INTEGER },
        shortName: { type: sequelize_1.DataTypes.STRING },
        name: { type: sequelize_1.DataTypes.STRING },
        host: { type: sequelize_1.DataTypes.BOOLEAN },
        startPos: { type: sequelize_1.DataTypes.JSON, allowNull: true },
        handicap: { type: sequelize_1.DataTypes.INTEGER },
        faction: { type: sequelize_1.DataTypes.STRING },
        rgbColor: { type: sequelize_1.DataTypes.JSON }
    };
    AI.sequelizeOptions = {};
})(AI = exports.AI || (exports.AI = {}));
//# sourceMappingURL=ai.js.map