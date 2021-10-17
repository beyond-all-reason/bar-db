"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BalanceChangeAuthor = void 0;
const sequelize_1 = require("sequelize");
var BalanceChangeAuthor;
(function (BalanceChangeAuthor) {
    BalanceChangeAuthor.sequelizeDefinition = {
        id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: sequelize_1.DataTypes.STRING },
        img: { type: sequelize_1.DataTypes.STRING },
        url: { type: sequelize_1.DataTypes.STRING },
    };
    BalanceChangeAuthor.sequelizeOptions = {};
})(BalanceChangeAuthor = exports.BalanceChangeAuthor || (exports.BalanceChangeAuthor = {}));
//# sourceMappingURL=balance-change-author.js.map