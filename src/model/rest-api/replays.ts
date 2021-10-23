import { Static, Type } from '@sinclair/typebox';
import { paginateQuerySchema } from './pagination';

export enum ReplayPreset {
    FFA = 'ffa',
    Team = 'team',
    Duel = 'duel',
}

export const replaysQuerySchema = paginateQuerySchema(Type.Object({
    preset: Type.Optional(Type.Array(Type.Enum(ReplayPreset))),
    endedNormally: Type.Optional(Type.Boolean()),
    hasBots: Type.Optional(Type.Boolean()),
    tsRange: Type.Optional(
        Type.Tuple([
            Type.Number(),
            Type.Number()
        ])
    ),
    reported: Type.Optional(Type.Boolean()),
    players: Type.Optional(Type.Array(Type.String())),
    maps: Type.Optional(Type.Array(Type.String())),
    date: Type.Optional(
        Type.Union([
            Type.Tuple([
                Type.String({ format: "date" }),
                Type.String({ format: "date" })
            ]),
            Type.Tuple([
                Type.String({ format: "date" })
            ])
        ])
    ),
    durationRangeMins: Type.Optional(
        Type.Tuple([
            Type.Number(),
            Type.Number()
        ])
    ),
}));

export type ReplaysQueryType = Static<typeof replaysQuerySchema>;