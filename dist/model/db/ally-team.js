"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllyTeam = void 0;
const sequelize_1 = require("sequelize");
var AllyTeam;
(function (AllyTeam) {
    AllyTeam.sequelizeDefinition = {
        id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        allyTeamId: { type: sequelize_1.DataTypes.INTEGER },
        startBox: { type: sequelize_1.DataTypes.JSON },
        winningTeam: { type: sequelize_1.DataTypes.BOOLEAN }
    };
    AllyTeam.sequelizeOptions = {};
})(AllyTeam = exports.AllyTeam || (exports.AllyTeam = {}));
//# sourceMappingURL=ally-team.js.map