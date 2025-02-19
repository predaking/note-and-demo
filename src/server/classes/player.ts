import { PlayerType, MatchStatus } from '../../interface';

class Player implements PlayerType {
    name: string;
    status: MatchStatus;

    constructor (name: string, status: MatchStatus) {
        this.name = name;
        this.status = status;
    }
}

export default Player;