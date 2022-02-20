"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BalanceChange = void 0;
const sequelize_1 = require("sequelize");
var BalanceChange;
(function (BalanceChange) {
    BalanceChange.sequelizeDefinition = {
        id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        sha: { type: sequelize_1.DataTypes.STRING },
        url: { type: sequelize_1.DataTypes.STRING },
        date: { type: sequelize_1.DataTypes.DATE },
        message: { type: sequelize_1.DataTypes.TEXT },
    };
})(BalanceChange = exports.BalanceChange || (exports.BalanceChange = {}));
//# sourceMappingURL=balance-change.js.map