
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

module.exports = {
    Room,
    Player
}