import { promises as fs } from "fs";
import { Signal } from "jaz-ts-utils";
import Jimp from "jimp";
import { MapParser, SpringMap, StartPos } from "spring-map-parser";

import { Database } from "~/database";
import { DBSchema } from "~/model/db";
import { FileProcessor, FileProcessorConfig } from "~/processors/file-processor";

export class MapProcessor extends FileProcessor {
    public onMapProcessed: Signal<DBSchema.SpringMap.Instance> = new Signal();

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
        } else {
            storedMap = await this.db.schema.map.create(newMap);
        }

        this.onMapProcessed.dispatch(storedMap);

        return destDir;
    }

    protected async uploadFileToObjectStorage(filePath: string, prefix: string = "/") {
        return super.uploadFileToObjectStorage(filePath, "/maps");
    }
}

export function mapDataToMapSchema(mapData: SpringMap) : Omit<DBSchema.SpringMap.Schema, "id"> {
    return {
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
        startPositions: (mapData.mapInfo?.teams?.map(obj => obj!.startPos) ?? mapData.smd?.startPositions) as Array<StartPos>,
        width: mapData.smf!.mapWidthUnits * 2,
        height: mapData.smf!.mapHeightUnits * 2,
        minDepth: mapData.minHeight,
        maxDepth: mapData.maxHeight,
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
}