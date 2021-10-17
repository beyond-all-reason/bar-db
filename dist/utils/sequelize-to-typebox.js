"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typebox_1 = require("@sinclair/typebox");
const sequelize_1 = require("sequelize");
// export function sequelizeDefinitionToTypeboxDefinition<T extends Model<any, any>, C extends any>(sequelizeDef: ModelAttributes<T, C>) : TObject<{}> {
//     const typeboxDef = cloneDeep(sequelizeDef);
//     for (const key in typeboxDef) {
//         typeboxDef[key] = sequelizeAttributeToTypeboxAttribute(sequelizeAttribute);
//     }
//     return Type.Object({
//     });
// }
function sequelizeAttributeToTypeboxAttribute(sequelizeAttribute) {
    const isOptional = sequelizeAttribute.allowNull === true;
    const type = sequelizeDatatypeToTypeboxType(sequelizeAttribute.type);
    if (isOptional) {
        return typebox_1.Type.Optional(type);
    }
    else {
        return type;
    }
}
const typeMap = {
    [sequelize_1.DataTypes.BIGINT.key]: typebox_1.Type.Number(),
    [sequelize_1.DataTypes.BOOLEAN.key]: typebox_1.Type.Boolean(),
    [sequelize_1.DataTypes.CHAR.key]: typebox_1.Type.String(),
    [sequelize_1.DataTypes.DATE.key]: typebox_1.Type.String({ format: "date" }),
    [sequelize_1.DataTypes.DECIMAL.key]: typebox_1.Type.Number(),
    [sequelize_1.DataTypes.DOUBLE.key]: typebox_1.Type.Number(),
    [sequelize_1.DataTypes.FLOAT.key]: typebox_1.Type.Number(),
    [sequelize_1.DataTypes.INTEGER.key]: typebox_1.Type.Number(),
    [sequelize_1.DataTypes.JSON.key]: typebox_1.Type.Object({}),
    [sequelize_1.DataTypes.NUMBER.key]: typebox_1.Type.Number(),
    [sequelize_1.DataTypes.STRING.key]: typebox_1.Type.String(),
    [sequelize_1.DataTypes.TEXT.key]: typebox_1.Type.String(),
};
function sequelizeDatatypeToTypeboxType(sequelizeType) {
    if (typeof sequelizeType === "string") {
        return typebox_1.Type.Any();
    }
    if (typeMap[sequelizeType.key]) {
        return typeMap[sequelizeType.key];
    }
    if (sequelizeTypeIsArray(sequelizeType)) {
        const test = sequelizeDatatypeToTypeboxType(sequelizeType.options.type);
        return typebox_1.Type.Array(test);
    }
    return typebox_1.Type.Any();
}
function sequelizeTypeIsArray(sequelizeType) {
    return sequelizeType.key === "ARRAY";
}
//# sourceMappingURL=sequelize-to-typebox.js.map