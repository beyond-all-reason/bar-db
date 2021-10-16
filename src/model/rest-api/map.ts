import { Static, Type } from "@sinclair/typebox";

export const mapParamsSchema = Type.Object({
    mapId: Type.Integer()
});

export type MapParamsType = Static<typeof mapParamsSchema>;