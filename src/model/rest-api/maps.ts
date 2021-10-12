import { Static, Type } from '@sinclair/typebox';

import { paginateReply } from "~/model/rest-api/paginate-reply";

export const mapsReplyDef = paginateReply(Type.Object({
    id: Type.Integer(),
    scriptName: Type.String(),
    fileName: Type.Optional(Type.String()),
    description: Type.Optional(Type.Union([Type.String(), Type.Null()])),
    mapHardness: Type.Optional(Type.Number()),
    gravity: Type.Optional(Type.Number()),
    tidalStrength: Type.Optional(Type.Number()),
    maxMetal: Type.Optional(Type.Number()),
    extractorRadius: Type.Optional(Type.Number()),
    minWind: Type.Optional(Type.Number()),
    maxWind: Type.Optional(Type.Number()),
    startPositions: Type.Optional(Type.Union([Type.Array(Type.Object({
        x: Type.Number(),
        z: Type.Number()
    })), Type.Null()])),
    width: Type.Optional(Type.Number()),
    height: Type.Optional(Type.Number()),
    minDepth: Type.Optional(Type.Number()),
    maxDepth: Type.Optional(Type.Number()),
    name: Type.Optional(Type.String()),
    shortname: Type.Optional(Type.String()),
    author: Type.Optional(Type.String()),
    version: Type.Optional(Type.String()),
    mapfile: Type.Optional(Type.String()),
    modtype: Type.Optional(Type.Number()),
    notDeformable: Type.Optional(Type.Boolean()),
    voidWater: Type.Optional(Type.Boolean()),
    voidGround: Type.Optional(Type.Boolean()),
    autoShowMetal: Type.Optional(Type.Boolean()),
    mapInfo: Type.Optional(Type.Object({}))
}));

export type MapsReply = Static<typeof mapsReplyDef>;