import { TObject, Type } from "@sinclair/typebox";
import { DataTypes, Model, ModelAttributeColumnOptions, ModelAttributes } from "sequelize";
import { cloneDeep } from "sequelize/types/lib/utils";

// export function sequelizeDefinitionToTypeboxDefinition<T extends Model<any, any>, C extends any>(sequelizeDef: ModelAttributes<T, C>) : TObject<{}> {
//     const typeboxDef = cloneDeep(sequelizeDef);

//     for (const key in typeboxDef) {
//         typeboxDef[key] = sequelizeAttributeToTypeboxAttribute(sequelizeAttribute);
//     }

//     return Type.Object({

//     });
// }

function sequelizeAttributeToTypeboxAttribute(sequelizeAttribute: ModelAttributeColumnOptions) {
    const isOptional = sequelizeAttribute.allowNull === true;
    const type = sequelizeDatatypeToTypeboxType(sequelizeAttribute.type);

    if (isOptional) {
        return Type.Optional(type);
    } else {
        return type;
    }
}

const typeMap = {
    [DataTypes.BIGINT.key]: Type.Number(),
    [DataTypes.BOOLEAN.key]: Type.Boolean(),
    [DataTypes.CHAR.key]: Type.String(),
    [DataTypes.DATE.key]: Type.String({ format: "date" }),
    [DataTypes.DECIMAL.key]: Type.Number(),
    [DataTypes.DOUBLE.key]: Type.Number(),
    [DataTypes.FLOAT.key]: Type.Number(),
    [DataTypes.INTEGER.key]: Type.Number(),
    [DataTypes.JSON.key]: Type.Object({}),
    [DataTypes.NUMBER.key]: Type.Number(),
    [DataTypes.STRING.key]: Type.String(),
    [DataTypes.TEXT.key]: Type.String(),
}

function sequelizeDatatypeToTypeboxType(sequelizeType: DataTypes.DataType) {
    if (typeof sequelizeType === "string") {
        return Type.Any();
    }

    if (typeMap[sequelizeType.key]) {
        return typeMap[sequelizeType.key];
    }
    
    if (sequelizeTypeIsArray(sequelizeType)) {
        const test = sequelizeDatatypeToTypeboxType(sequelizeType.options.type) as any;
        return Type.Array(test);
    }

    return Type.Any();
}

function sequelizeTypeIsArray(sequelizeType: any) : sequelizeType is DataTypes.ArrayDataType<any> {
    return sequelizeType.key === "ARRAY";
}