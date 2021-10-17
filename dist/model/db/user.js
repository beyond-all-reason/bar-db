"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = require("sequelize");
var User;
(function (User) {
    User.sequelizeDefinition = {
        id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true },
        username: { type: sequelize_1.DataTypes.STRING },
        countryCode: { type: sequelize_1.DataTypes.STRING },
        rank: { type: sequelize_1.DataTypes.INTEGER },
        skill: { type: sequelize_1.DataTypes.STRING },
        trueSkill: { type: sequelize_1.DataTypes.FLOAT, allowNull: true },
        skillUncertainty: { type: sequelize_1.DataTypes.FLOAT },
    };
    User.sequelizeOptions = {
        indexes: [
            {
                fields: ["username"]
            }
        ]
    };
})(User = exports.User || (exports.User = {}));
//# sourceMappingURL=user.js.map