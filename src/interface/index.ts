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
    id: number;
    name: string;
    status: MatchStatus;
}

export interface MatchType {
    pool: Map<UserName, MatchStatus>;
    rooms: RoomType[];
}

export enum CountryEnums {
    '魏' = 0,
    '蜀' = 1,
    '吴' = 2,
    '群' = 3,
}

export enum CountryColorEnums {
    'blue' = 0,
    'green' = 1,
    'red' = 2,
    'yellow' = 3,
}

export enum SkillTypeEnums {
    '普通' = 0,
    '锁定技' = 1,
    '裁定技' = 2,
}

export enum QualityColorEnums {
    'purple' = 0,
    'yellow' = 1,
    'red' = 2,
}

export type CardLevel = 1 | 2 | 3 | 4 | 5;
export type SkillLevel = 1 | 2;
export type SkillDots = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type Quality = 0 | 1 | 2;

export interface SkillType {
    id: number;
    name: string;
    desc: string;
    types: SkillTypeEnums[];
    level: SkillLevel;
}

export interface CardType {
    id: number;
    name: string;
    image: string;
    countryId: CountryEnums;
    countryName: keyof typeof CountryEnums;
    countryColor: CountryColorEnums;
    skills: SkillType[];
    top: SkillDots;
    bottom: SkillDots;
    left: SkillDots;
    right: SkillDots;
    quality: Quality;
    qualityColor: keyof typeof QualityColorEnums;
    level: CardLevel;
}

