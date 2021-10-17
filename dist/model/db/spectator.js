"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Spectator = void 0;
const sequelize_1 = require("sequelize");
var Spectator;
(function (Spectator) {
    Spectator.sequelizeDefinition = {
        id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        playerId: { type: sequelize_1.DataTypes.INTEGER },
        name: { type: sequelize_1.DataTypes.STRING },
        countryCode: { type: sequelize_1.DataTypes.STRING },
        rank: { type: sequelize_1.DataTypes.INTEGER },
        skillUncertainty: { type: sequelize_1.DataTypes.INTEGER },
        skill: { type: sequelize_1.DataTypes.STRING }
    };
    Spectator.sequelizeOptions = {};
})(Spectator = exports.Spectator || (exports.Spectator = {}));
//# sourceMappingURL=spectator.js.map