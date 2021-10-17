"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapProcessor = void 0;
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
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14;
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
        const startPositions = ((_c = (_b = (_a = mapData.mapInfo) === null || _a === void 0 ? void 0 : _a.teams) === null || _b === void 0 ? void 0 : _b.map(obj => obj.startPos)) !== null && _c !== void 0 ? _c : (_d = mapData.smd) === null || _d === void 0 ? void 0 : _d.startPositions);
        const newMap = {
            fileName: mapData.fileName,
            fileNameWithExt: mapData.fileNameWithExt,
            scriptName: mapData.scriptName.trim(),
            description: ((_e = mapData.mapInfo) === null || _e === void 0 ? void 0 : _e.description) || ((_f = mapData.smd) === null || _f === void 0 ? void 0 : _f.description) || null,
            mapHardness: (_h = (_g = mapData.mapInfo) === null || _g === void 0 ? void 0 : _g.maphardness) !== null && _h !== void 0 ? _h : (_j = mapData.smd) === null || _j === void 0 ? void 0 : _j.mapHardness,
            gravity: (_l = (_k = mapData.mapInfo) === null || _k === void 0 ? void 0 : _k.gravity) !== null && _l !== void 0 ? _l : (_m = mapData.smd) === null || _m === void 0 ? void 0 : _m.gravity,
            tidalStrength: (_p = (_o = mapData.mapInfo) === null || _o === void 0 ? void 0 : _o.tidalStrength) !== null && _p !== void 0 ? _p : (_q = mapData.smd) === null || _q === void 0 ? void 0 : _q.tidalStrength,
            maxMetal: (_s = (_r = mapData.mapInfo) === null || _r === void 0 ? void 0 : _r.maxMetal) !== null && _s !== void 0 ? _s : (_t = mapData.smd) === null || _t === void 0 ? void 0 : _t.maxMetal,
            extractorRadius: (_v = (_u = mapData.mapInfo) === null || _u === void 0 ? void 0 : _u.extractorRadius) !== null && _v !== void 0 ? _v : (_w = mapData.smd) === null || _w === void 0 ? void 0 : _w.extractorRadius,
            minWind: (_z = (_y = (_x = mapData.mapInfo) === null || _x === void 0 ? void 0 : _x.atmosphere) === null || _y === void 0 ? void 0 : _y.minWind) !== null && _z !== void 0 ? _z : (_0 = mapData.smd) === null || _0 === void 0 ? void 0 : _0.minWind,
            maxWind: (_3 = (_2 = (_1 = mapData.mapInfo) === null || _1 === void 0 ? void 0 : _1.atmosphere) === null || _2 === void 0 ? void 0 : _2.maxWind) !== null && _3 !== void 0 ? _3 : (_4 = mapData.smd) === null || _4 === void 0 ? void 0 : _4.maxWind,
            startPositions,
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
//# sourceMappingURL=map-processor.js.map