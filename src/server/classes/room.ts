import { MatchStatus, PlayerType, RoomType } from "../../interface";

const MAX = 2;

class Room implements RoomType {
    id: string;
    players: PlayerType[];
    status: MatchStatus;
    max: number;

    constructor (id: string, players: PlayerType[], status: MatchStatus = MatchStatus.WAITING) {
        this.id = id;
        this.players = players;
        this.status = status;
        this.max = MAX;
    }

    addPlayer (player: PlayerType) {
        if (this.players.length >= this.max) {
            return false;
        }
        this.players.push(player);
        if (this.players.length === this.max) {
            this.status = MatchStatus.MATCHED;
        }
        return true;
    }

    removePlayer (player: PlayerType) {
        this.players = this.players.filter(p => p.name !== player.name);
    }
}

export default Room;    