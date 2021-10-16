import { FastifyPluginCallback } from "fastify";
import { PluginOptions } from "~/rest-api";
import { GoogleSpreadsheet } from "google-spreadsheet";

const plugin: FastifyPluginCallback<PluginOptions> = async function(app, { db, redis }) {
    app.route({
        method: "GET",
        url: "/mapLists.conf",
        handler: async (request, reply) => {
            const mapListsGenerator = new MapListsGenerator({
                googleSheetsId: "1rn4kIIc9Nnyv_ZiBxXvNXdhUSnh15aLrLsQXmtUBJt8",
                googleSheetsAPIKey: "AIzaSyDkSWYX9nggs_cstsk7qArHek6F7yZqdo8"
            });

            //reply.type("application/conf");
            reply.header("Content-Disposition", "inline; filename=mapLists.conf");

            const mapLists = await mapListsGenerator.generate();

            return mapLists.mapListsStr;
        },
    });
};

export interface MapListsGeneratorConfig {
    googleSheetsId: string;
    googleSheetsAPIKey: string;
}

export interface MapPools {
    [key: string]: any;
    certified: string[];
    uncertified: string[];
    small: string[];
    medium: string[];
    large: string[];
    extraLarge: string[];
    duel: string[];
    team: {
        [key: number]: any;
        4?: string[];
        6?: string[];
        8?: string[];
        10?: string[];
        12?: string[];
        14?: string[];
        16?: string[];
    };
    ffa: {
        [key: number]: any;
        3?: string[];
        4?: string[];
        5?: string[];
        6?: string[];
        7?: string[];
        8?: string[];
        9?: string[];
        10?: string[];
        11?: string[];
        12?: string[];
        13?: string[];
        14?: string[];
        15?: string[];
        16?: string[];
    }
    teamffa: {
        [key: number]: any;
        6?: string[];
        9?: string[];
        12?: string[];
        16?: string[];
    };
    misc: string[];
}

export interface ExpectedMapType {
    [key: string]: any;
    fileName: string;
    name: string;
    width: number;
    height: number;
    duel: 1 | "nil";
    team: 1 | "nil";
    ffa: 1 | "nil";
    certified: 1 | "nil";
    inPool: 1;
    teamCount: number | null;
    playerCount: number | null;
}

export class MapListsGenerator {
    protected config: MapListsGeneratorConfig;
    protected doc: GoogleSpreadsheet;

    constructor(config: MapListsGeneratorConfig) {
        this.config = config;

        this.doc = new GoogleSpreadsheet(this.config.googleSheetsId);
    }

    public async generate(): Promise<{ mapPools: MapPools, mapListsStr: string; }> {
        this.doc.useApiKey(this.config.googleSheetsAPIKey);
        await this.doc.loadInfo();
        const sheet = this.doc.sheetsByIndex[0];
        await sheet.loadCells();

        const rawHeadingColIndexes: { [key: string]: number } = {};
        for (let x = 2; x < sheet.columnCount; x++) {
            const cellVal = sheet.getCell(2, x).value;
            if (cellVal) {
                rawHeadingColIndexes[cellVal.toString()] = x;
            }
        }
        const headingColIndex = {
            fileName: 2,
            name: 3,
            width: rawHeadingColIndexes["sizeX"],
            height: rawHeadingColIndexes["sizeY"],
            duel: rawHeadingColIndexes["1v1"],
            team: rawHeadingColIndexes["Teams"],
            ffa: rawHeadingColIndexes["FFA"],
            certified: rawHeadingColIndexes["Certified?"],
            inPool: rawHeadingColIndexes["Is in pool"],
            playerCount: rawHeadingColIndexes["Player Count"],
            teamCount: rawHeadingColIndexes["Team Count"],
        }

        const mapPools: MapPools = {
            certified: [],
            uncertified: [],
            small: [],
            medium: [],
            large: [],
            extraLarge: [],
            duel: [],
            team: {},
            ffa: {},
            teamffa: {},
            misc: []
        };

        for (let y = 3; y < sheet.rowCount; y++) {
            const map: ExpectedMapType = {} as any;
            Object.entries(headingColIndex).forEach(([key, dataIndex]) => {
                map[key] = sheet.getCell(y, dataIndex).value;
            });

            if (map.inPool != 1 || map.width == null || map.height == null || map.playerCount == null || map.teamCount == null) {
                if (map.name != null) {
                    mapPools.misc.push(map.name);
                }
                continue;
            }

            if (map.certified == 1) {
                mapPools.certified.push(map.name);
            } else {
                mapPools.uncertified.push(map.name);
            }

            const totalSize = map.width + map.height;
            if (totalSize <= 24) {
                mapPools.small.push(map.name);
            } else if (totalSize <= 40) {
                mapPools.medium.push(map.name);
            } else if (totalSize <= 56) {
                mapPools.large.push(map.name);
            } else {
                mapPools.extraLarge.push(map.name);
            }

            let addedToPresetPool = false;

            if (map.duel == 1) {
                mapPools.duel.push(map.name);
                addedToPresetPool = true;
            }

            if (map.team == 1 && map.teamCount == 2 && map.teamCount % 2 === 0) {
                if (mapPools.team[map.playerCount] === undefined) {
                    mapPools.team[map.playerCount] = [];
                }
                mapPools.team[map.playerCount].push(map.name);
                addedToPresetPool = true;
            }

            if (map.ffa == 1) {
                if (mapPools.ffa[map.playerCount] === undefined) {
                    mapPools.ffa[map.playerCount] = [];
                }
                mapPools.ffa[map.playerCount].push(map.name);
                addedToPresetPool = true;
            }

            if (map.ffa == 1 && map.team == 1) {
                if (mapPools.teamffa[map.playerCount] === undefined) {
                    mapPools.teamffa[map.playerCount] = [];
                }
                mapPools.teamffa[map.playerCount].push(map.name);
                addedToPresetPool = true;
            }

            if (!addedToPresetPool) {
                mapPools.misc.push(map.name);
            }
        }
        return {
            mapPools: mapPools,
            mapListsStr: this.getMapListsConf(mapPools)
        };
    }

    protected getMapListsConf(mapPools: MapPools) : string {
        const header = `# This file was automatically generated by bar-maplists-generator using data from https://docs.google.com/spreadsheets/d/1rn4kIIc9Nnyv_ZiBxXvNXdhUSnh15aLrLsQXmtUBJt8/edit#gid=0
[all]
.*
`;

        let pools = "";
        Object.entries(mapPools).forEach(([key, val]) => {
            if (Array.isArray(val) && val.length) {
                pools += `\n[${key}]\n`;
                val.forEach(map => {
                    pools += `${map}\n`;
                });
            } else {
                Object.entries(val).forEach(([playerCount, val2]) => {
                    if (Array.isArray(val2) && val2.length) {
                        let betterKey = key;
                        pools += `\n[${key}${playerCount}]\n`;
                        val2.forEach(map => {
                            pools += `${map}\n`;
                        });
                    }
                });
            }
        });

        return `${header}${pools}`;
    }
}

export default plugin;