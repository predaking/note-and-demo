import { 
    MatchType, RoomType, UserName, MatchStatus 
} from "../../interface";

class Match implements MatchType {
    pool: Map<UserName, MatchStatus>;
    rooms: RoomType[];

    constructor () {
        this.pool = new Map();
        this.rooms = [];
    }
}

export default Match;