import { promises as fs } from "fs";
import Jimp from "jimp";
import { SpringMap } from "model/spring-map";
import { MapParser, StartPos } from "spring-map-parser";
import * as path from "path";

import { Database } from "./database";
import { FileProcessor, FileProcessorConfig } from "./file-processor";

export class MapProcessor extends FileProcessor {
    protected mapParser: MapParser;
    protected db: Database;

    constructor(config: FileProcessorConfig) {
        super(config);

        this.mapParser = new MapParser({ mipmapSize: 16 });
        this.db = config.db;
    }

    protected async processFile(filePath: string) {
        const mapData = await this.mapParser.parseMap(filePath);

        const destDir = `${this.config.dir}/processed/${mapData.fileName}`;
        await fs.mkdir(destDir, { recursive: true });

        await mapData.heightMap.writeAsync(`${destDir}/height.png`);
        await mapData.metalMap.writeAsync(`${destDir}/metal.png`);
        await mapData.typeMap.writeAsync(`${destDir}/type.png`);

        if (mapData.textureMap) {
            await mapData.textureMap!.clone().quality(80).writeAsync(`${destDir}/texture-hq.jpg`);
            await mapData.textureMap!.clone().writeAsync(`${destDir}/texture-hq.png`);
            await mapData.textureMap!.clone().resize(1000, Jimp.AUTO).quality(90).writeAsync(`${destDir}/texture-mq.jpg`);
            await mapData.textureMap!.clone().resize(500, Jimp.AUTO).quality(80).writeAsync(`${destDir}/texture-lq.jpg`);
            await mapData.textureMap!.clone().cover(250, 250).quality(80).writeAsync(`${destDir}/texture-thumb.jpg`);
        }

        if (mapData.specularMap) {
            await mapData.specularMap.clone().writeAsync(`${destDir}/specular.png`);
        }

        const startPositions = (mapData.mapInfo?.teams?.map(obj => obj!.startPos) ?? mapData.smd?.startPositions) as Array<StartPos>;

        const newMap: Omit<SpringMap, "id"> = {
            fileName: mapData.fileName,
            fileNameWithExt: mapData.fileNameWithExt,
            scriptName: mapData.scriptName.trim(),
            description: mapData.mapInfo?.description || mapData.smd?.description || null,
            mapHardness: mapData.mapInfo?.maphardness ?? mapData.smd?.mapHardness,
            gravity: mapData.mapInfo?.gravity ?? mapData.smd?.gravity,
            tidalStrength: mapData.mapInfo?.tidalStrength ?? mapData.smd?.tidalStrength,
            maxMetal: mapData.mapInfo?.maxMetal ?? mapData.smd?.maxMetal,
            extractorRadius: mapData.mapInfo?.extractorRadius ?? mapData.smd?.extractorRadius,
            minWind: mapData.mapInfo?.atmosphere?.minWind ?? mapData.smd?.minWind,
            maxWind: mapData.mapInfo?.atmosphere?.maxWind ?? mapData.smd?.maxWind,
            startPositions,
            width: mapData.smf!.mapWidthUnits * 2,
            height: mapData.smf!.mapHeightUnits * 2,
            minDepth: mapData.mapInfo?.minDepth,
            maxDepth: mapData.mapInfo?.maxDepth,
            name: mapData.mapInfo?.name,
            shortname: mapData.mapInfo?.shortname,
            author: mapData.mapInfo?.author,
            version: mapData.mapInfo?.version,
            mapfile: mapData.mapInfo?.mapfile,
            modtype: mapData.mapInfo?.modtype,
            notDeformable: mapData.mapInfo?.notDeformable,
            voidWater: mapData.mapInfo?.voidWater,
            voidGround: mapData.mapInfo?.voidGround,
            autoShowMetal: mapData.mapInfo?.autoShowMetal,
            mapInfo: mapData.mapInfo
        };

        if (newMap.minWind === NaN) {
            newMap.minWind = 5;
        }
        if (newMap.maxWind === NaN) {
            newMap.maxWind = 25;
        }

        const storedMap = await this.db.schema.map.findOne({ where: { scriptName: mapData.scriptName.trim() } });

        if (storedMap) {
            if (this.config.verbose) {
                console.log("Map already processed. Updating...");
            }

            await storedMap.update(newMap);
        } else {
            await this.db.schema.map.create(newMap);

            await this.db.saveMapsToMemory();
        }

        return destDir;
    }

    protected async uploadFileToObjectStorage(filePath: string, prefix: string = "/") {
        return super.uploadFileToObjectStorage(filePath, "/maps");
    }
}