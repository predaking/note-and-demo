import { PlayerType, MatchStatus } from '../interface';

class Player implements PlayerType {
    id: number;
    name: string;
    status: MatchStatus;

    constructor (id: number, name: string, status: MatchStatus) {
        this.id = id;
        this.name = name;
        this.status = status;
    }
}

export default Player;