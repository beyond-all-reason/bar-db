"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapDataToMapSchema = exports.MapProcessor = void 0;
const fs_1 = require("fs");
const jaz_ts_utils_1 = require("jaz-ts-utils");
const jimp_1 = __importDefault(require("jimp"));
const spring_map_parser_1 = require("spring-map-parser");
const file_processor_1 = require("./file-processor");
class MapProcessor extends file_processor_1.FileProcessor {
    constructor(config) {
        super(config);
        this.onMapProcessed = new jaz_ts_utils_1.Signal();
        this.mapParser = new spring_map_parser_1.MapParser({ mipmapSize: 16 });
        this.db = config.db;
    }
    async processFile(filePath) {
        const mapData = await this.mapParser.parseMap(filePath);
        const destDir = `${this.config.dir}/processed/${mapData.fileName}`;
        await fs_1.promises.mkdir(destDir, { recursive: true });
        await mapData.heightMap.writeAsync(`${destDir}/height.png`);
        await mapData.metalMap.writeAsync(`${destDir}/metal.png`);
        await mapData.typeMap.writeAsync(`${destDir}/type.png`);
        if (mapData.textureMap) {
            await mapData.textureMap.clone().quality(80).writeAsync(`${destDir}/texture-hq.jpg`);
            await mapData.textureMap.clone().writeAsync(`${destDir}/texture-hq.png`);
            await mapData.textureMap.clone().resize(1000, jimp_1.default.AUTO).quality(90).writeAsync(`${destDir}/texture-mq.jpg`);
            await mapData.textureMap.clone().resize(500, jimp_1.default.AUTO).quality(80).writeAsync(`${destDir}/texture-lq.jpg`);
            await mapData.textureMap.clone().cover(250, 250).quality(80).writeAsync(`${destDir}/texture-thumb.jpg`);
        }
        if (mapData.specularMap) {
            await mapData.specularMap.clone().writeAsync(`${destDir}/specular.png`);
        }
        const newMap = mapDataToMapSchema(mapData);
        if (newMap.minWind === NaN) {
            newMap.minWind = 5;
        }
        if (newMap.maxWind === NaN) {
            newMap.maxWind = 25;
        }
        let storedMap = await this.db.schema.map.findOne({ where: { scriptName: mapData.scriptName.trim() } });
        if (storedMap) {
            if (this.config.verbose) {
                console.log("Map already processed. Updating...");
            }
            storedMap = await storedMap.update(newMap);
        }
        else {
            storedMap = await this.db.schema.map.create(newMap);
        }
        this.onMapProcessed.dispatch(storedMap);
        return destDir;
    }
    async uploadFileToObjectStorage(filePath, prefix = "/") {
        return super.uploadFileToObjectStorage(filePath, "/maps");
    }
}
exports.MapProcessor = MapProcessor;
function mapDataToMapSchema(mapData) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14;
    return {
        fileName: mapData.fileName,
        fileNameWithExt: mapData.fileNameWithExt,
        scriptName: mapData.scriptName.trim(),
        description: ((_a = mapData.mapInfo) === null || _a === void 0 ? void 0 : _a.description) || ((_b = mapData.smd) === null || _b === void 0 ? void 0 : _b.description) || null,
        mapHardness: (_d = (_c = mapData.mapInfo) === null || _c === void 0 ? void 0 : _c.maphardness) !== null && _d !== void 0 ? _d : (_e = mapData.smd) === null || _e === void 0 ? void 0 : _e.mapHardness,
        gravity: (_g = (_f = mapData.mapInfo) === null || _f === void 0 ? void 0 : _f.gravity) !== null && _g !== void 0 ? _g : (_h = mapData.smd) === null || _h === void 0 ? void 0 : _h.gravity,
        tidalStrength: (_k = (_j = mapData.mapInfo) === null || _j === void 0 ? void 0 : _j.tidalStrength) !== null && _k !== void 0 ? _k : (_l = mapData.smd) === null || _l === void 0 ? void 0 : _l.tidalStrength,
        maxMetal: (_o = (_m = mapData.mapInfo) === null || _m === void 0 ? void 0 : _m.maxMetal) !== null && _o !== void 0 ? _o : (_p = mapData.smd) === null || _p === void 0 ? void 0 : _p.maxMetal,
        extractorRadius: (_r = (_q = mapData.mapInfo) === null || _q === void 0 ? void 0 : _q.extractorRadius) !== null && _r !== void 0 ? _r : (_s = mapData.smd) === null || _s === void 0 ? void 0 : _s.extractorRadius,
        minWind: (_v = (_u = (_t = mapData.mapInfo) === null || _t === void 0 ? void 0 : _t.atmosphere) === null || _u === void 0 ? void 0 : _u.minWind) !== null && _v !== void 0 ? _v : (_w = mapData.smd) === null || _w === void 0 ? void 0 : _w.minWind,
        maxWind: (_z = (_y = (_x = mapData.mapInfo) === null || _x === void 0 ? void 0 : _x.atmosphere) === null || _y === void 0 ? void 0 : _y.maxWind) !== null && _z !== void 0 ? _z : (_0 = mapData.smd) === null || _0 === void 0 ? void 0 : _0.maxWind,
        startPositions: ((_3 = (_2 = (_1 = mapData.mapInfo) === null || _1 === void 0 ? void 0 : _1.teams) === null || _2 === void 0 ? void 0 : _2.map(obj => obj.startPos)) !== null && _3 !== void 0 ? _3 : (_4 = mapData.smd) === null || _4 === void 0 ? void 0 : _4.startPositions),
        width: mapData.smf.mapWidthUnits * 2,
        height: mapData.smf.mapHeightUnits * 2,
        minDepth: mapData.minHeight,
        maxDepth: mapData.maxHeight,
        name: (_5 = mapData.mapInfo) === null || _5 === void 0 ? void 0 : _5.name,
        shortname: (_6 = mapData.mapInfo) === null || _6 === void 0 ? void 0 : _6.shortname,
        author: (_7 = mapData.mapInfo) === null || _7 === void 0 ? void 0 : _7.author,
        version: (_8 = mapData.mapInfo) === null || _8 === void 0 ? void 0 : _8.version,
        mapfile: (_9 = mapData.mapInfo) === null || _9 === void 0 ? void 0 : _9.mapfile,
        modtype: (_10 = mapData.mapInfo) === null || _10 === void 0 ? void 0 : _10.modtype,
        notDeformable: (_11 = mapData.mapInfo) === null || _11 === void 0 ? void 0 : _11.notDeformable,
        voidWater: (_12 = mapData.mapInfo) === null || _12 === void 0 ? void 0 : _12.voidWater,
        voidGround: (_13 = mapData.mapInfo) === null || _13 === void 0 ? void 0 : _13.voidGround,
        autoShowMetal: (_14 = mapData.mapInfo) === null || _14 === void 0 ? void 0 : _14.autoShowMetal,
        mapInfo: mapData.mapInfo
    };
}
exports.mapDataToMapSchema = mapDataToMapSchema;
//# sourceMappingURL=map-processor.js.map