"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
const sequelize_1 = require("sequelize");
var Player;
(function (Player) {
    Player.sequelizeDefinition = {
        id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        playerId: { type: sequelize_1.DataTypes.INTEGER },
        name: { type: sequelize_1.DataTypes.STRING },
        teamId: { type: sequelize_1.DataTypes.INTEGER },
        handicap: { type: sequelize_1.DataTypes.INTEGER },
        faction: { type: sequelize_1.DataTypes.STRING },
        countryCode: { type: sequelize_1.DataTypes.STRING },
        rgbColor: { type: sequelize_1.DataTypes.JSON },
        rank: { type: sequelize_1.DataTypes.INTEGER },
        skillUncertainty: { type: sequelize_1.DataTypes.INTEGER, allowNull: true },
        skill: { type: sequelize_1.DataTypes.STRING },
        trueSkill: { type: sequelize_1.DataTypes.FLOAT, allowNull: true },
        startPos: { type: sequelize_1.DataTypes.JSON, allowNull: true }
    };
    Player.sequelizeOptions = {};
})(Player = exports.Player || (exports.Player = {}));
//# sourceMappingURL=player.js.map