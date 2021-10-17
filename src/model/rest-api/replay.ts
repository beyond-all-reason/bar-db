import { Static, TObject, TProperties, Type } from "@sinclair/typebox";
import { coerceObject } from "~/utils/coerce-object";

export const replayParamsSchema = Type.Object({
    replayId: Type.String()
});

export type ReplayParamsType = Static<typeof replayParamsSchema>;