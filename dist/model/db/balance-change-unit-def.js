"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BalanceChangeUnitDef = void 0;
const sequelize_1 = require("sequelize");
var BalanceChangeUnitDef;
(function (BalanceChangeUnitDef) {
    BalanceChangeUnitDef.sequelizeDefinition = {
        id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        unitDefId: { type: sequelize_1.DataTypes.STRING },
        scav: { type: sequelize_1.DataTypes.BOOLEAN },
        changes: { type: sequelize_1.DataTypes.JSON },
    };
    BalanceChangeUnitDef.sequelizeOptions = {
        indexes: [{ fields: ["unitDefId"] }]
    };
})(BalanceChangeUnitDef = exports.BalanceChangeUnitDef || (exports.BalanceChangeUnitDef = {}));
//# sourceMappingURL=balance-change-unit-def.js.map