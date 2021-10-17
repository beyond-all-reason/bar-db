"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Alias = void 0;
const sequelize_1 = require("sequelize");
var Alias;
(function (Alias) {
    Alias.sequelizeDefinition = {
        id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        alias: { type: sequelize_1.DataTypes.STRING }
    };
    Alias.sequelizeOptions = {};
})(Alias = exports.Alias || (exports.Alias = {}));
//# sourceMappingURL=alias.js.map