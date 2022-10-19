export type Leaderboards = Record<string, Rating[]>;

export type Rating = {
    age: number;
    colour: string;
    icon: string;
    name: string;
    rating: number;
};