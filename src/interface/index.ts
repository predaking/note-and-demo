export type UserName = string;

export interface ResultType {
    code: number;
    data: any;
    msg: string;
};

export enum MatchStatus {
    WAITING = 0,
    MATCHED = 1,
    PLAYING = 2
};

export interface UserType {
    id: string;
    name: string;
    password: string;
    avatar: string;
}
export interface RoomType {
    id: string;
    players: PlayerType[];
    status: MatchStatus;
    max: number;
}

export interface PlayerType {
    name: string;
    status: MatchStatus;
}

export interface MatchType {
    pool: Map<UserName, MatchStatus>;
    rooms: RoomType[];
}

