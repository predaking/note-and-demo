type UserName = string;
type MatchStatus = number;

interface User {
    id: string;
    name: string;
    password: string;
}
interface Room {
    id: string;
    players: Player[];
    status: number;
    max: number;
}

interface Player {
    name: string;
    status: number;
}

interface Match {
    pool: Map<UserName, MatchStatus>;
    rooms: Room[];
}

module.exports = {
    Room,
    Player,
    Match
}