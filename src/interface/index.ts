export type UserName = string;

export interface ResultType {
    code: number;
    data: any;
    msg: string;
};

export interface WSMessageType<T = any> {
    type: GameMainWsEventType;
    subType?: RoomEventType | BattleEventType | MatchStatus | ErrorEventType;
    path?: string;
    message?: string;
    timestamp: number;
    data?: T;
}

export enum GameMainWsEventType {
    REQUEST = 'request',
    ERROR = 'error',
    MATCH = 'match',
    ROOM = 'room',
    BATTLE = 'battle'
}

export enum RoomEventType {
    DISSOLVED = 0,
    CREATED = 1
}

export enum BattleEventType {
    END = 0,
    START = 1
}

export enum MatchStatus {
    WAITING = 0,
    MATCHED = 1,
    PLAYING = 2
};

export enum ErrorEventType {
    TIMEOUT = 0,
    OFFLINE = 1,
    UNKNOWN = 2,
}

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

export enum CountryEnum {
    '魏' = 0,
    '蜀' = 1,
    '吴' = 2,
    '群' = 3,
}

export enum CountryColorEnum {
    '0x2468a2' = 0,
    '0x00ae9d' = 1,
    '0xef4136' = 2,
    '0xfcaf17' = 3,
}

export enum QualityColorEnum {
    'purple' = 0,
    'yellow' = 1,
    'red' = 2,
}

export type CardLevel = 1 | 2 | 3 | 4 | 5;
export type SkillDots = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type Quality = 0 | 1 | 2;

export interface SkillType {
    id: number;
    name: string;
    desc: string;
    isLock: boolean;
    isJudge: boolean;
}

export interface CardType {
    id: number;
    name: string;
    image: string;
    countryId: CountryEnum;
    countryName: keyof typeof CountryEnum;
    countryColor: CountryColorEnum;
    skills: SkillType[];
    top: SkillDots;
    bottom: SkillDots;
    left: SkillDots;
    right: SkillDots;
    quality: Quality;
    qualityColor: keyof typeof QualityColorEnum;
    level: CardLevel;
}

export interface RoleType {
    country: CountryEnum;
    countryName: keyof typeof CountryEnum;
    role: PlayerType;
    cards: CardType[];
}

export interface BattleCardType extends CardType {
    owner: 0 | 1;
}

export interface BattleType {
    roomId: string;
    grid: { [key: number]: BattleCardType };
    roles: RoleType[];
    current: 0 | 1;
}

