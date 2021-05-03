import { promises as fs } from "fs";
import { MapParser } from "spring-map-parser";

import { Database } from "./database";
import { FileProcessor, FileProcessorConfig } from "./file-processor";

export class MapProcessor extends FileProcessor {
    protected mapParser: MapParser;
    protected db: Database;

    constructor(config: FileProcessorConfig) {
        super(config);

        this.mapParser = new MapParser({ mipmapSize: 8 });
        this.db = config.db;
    }

    protected async processFile(filePath: string) {
        const mapData = await this.mapParser.parseMap(filePath);

        const destDir = `${this.config.dir}/processed/${mapData.fileName}`;
        await fs.mkdir(destDir, { recursive: true });

        await mapData.heightMap.writeAsync(`${destDir}/height.png`);
        await mapData.metalMap.writeAsync(`${destDir}/metal.png`);
        await mapData.typeMap.writeAsync(`${destDir}/type.png`);
        await mapData.textureMap!.writeAsync(`${destDir}/texture-hq.png`);
        // await mapData.textureMap!.resize({ width: 765, height: 300, fit: "outside" }).jpeg({ quality: 90 }).writeAsync(`${destDir}/texture-mq.jpg`); // TODO
        // await mapData.textureMap!.resize({ width: 684, height: 100, fit: "outside" }).jpeg({ quality: 80 }).writeAsync(`${destDir}/texture-lq.jpg`);
        // await mapData.textureMap!.resize({ width: 250, height: 250, fit: "cover" }).jpeg({ quality: 80 }).writeAsync(`${destDir}/texture-thumb.jpg`);

        const newMap = {
            fileName: mapData.fileName,
            scriptName: mapData.scriptName.trim(),
            description: mapData.info.description,
            mapHardness: mapData.info.mapHardness,
            gravity: mapData.info.gravity,
            tidalStrength: mapData.info.tidalStrength,
            maxMetal: mapData.info.maxMetal,
            extractorRadius: mapData.info.extractorRadius,
            minWind: mapData.info.minWind,
            maxWind: mapData.info.maxWind,
            startPositions: mapData.info.startPositions,
            width: mapData.meta.mapWidthUnits * 2,
            height: mapData.meta.mapHeightUnits * 2,
            minDepth: mapData.meta.minDepth,
            maxDepth: mapData.meta.maxDepth,
            name: mapData.info.name,
            shortname: mapData.info.shortname,
            author: mapData.info.author,
            version: mapData.info.version,
            mapfile: mapData.info.mapfile,
            modtype: mapData.info.modtype,
            notDeformable: mapData.info.notDeformable,
            voidWater: mapData.info.voidWater,
            voidGround: mapData.info.voidGround,
            autoShowMetal: mapData.info.autoShowMetal,
        };

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
}