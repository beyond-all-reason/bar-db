import { Static, Type } from "@sinclair/typebox";

export const replayParamsSchema = Type.Object({
    replayId: Type.String()
});

export type ReplayParamsType = Static<typeof replayParamsSchema>;