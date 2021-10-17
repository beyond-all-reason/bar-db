import { Static } from '@sinclair/typebox';
export declare enum ReplayPreset {
    FFA = "ffa",
    Team = "team",
    Duel = "duel"
}
export declare const replaysQuerySchema: import("@sinclair/typebox").TIntersect<[import("@sinclair/typebox").TObject<{
    page: import("@sinclair/typebox").TNumber;
    limit: import("@sinclair/typebox").TNumber;
}>, import("@sinclair/typebox").TObject<{
    preset: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TEnum<import("@sinclair/typebox").TEnumKey<ReplayPreset>[]>>>;
    endedNormally: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
    hasBots: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
    tsRange: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TTuple<[import("@sinclair/typebox").TNumber, import("@sinclair/typebox").TNumber]>>;
    reported: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
    players: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
    maps: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
    date: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TTuple<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TString]>, import("@sinclair/typebox").TTuple<[import("@sinclair/typebox").TString]>]>>;
    durationRangeMins: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TTuple<[import("@sinclair/typebox").TNumber, import("@sinclair/typebox").TNumber]>>;
}>]>;
export declare type ReplaysQueryType = Static<typeof replaysQuerySchema>;
