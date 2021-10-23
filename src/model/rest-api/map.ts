import { Static, Type } from "@sinclair/typebox";

export const mapParamsSchema = Type.Object({
    mapFileName: Type.String()
});

export type MapParamsType = Static<typeof mapParamsSchema>;