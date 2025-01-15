const { matchStatus } = require('./enums');

const MAX = 2;

class Room {
    constructor (id: string, players: Player[], status: number = matchStatus.WAITING) {
        this.id = id;
        this.players = players;
        this.status = status;
        this.max = MAX;
    }

    addPlayer (player: Player) {
        if (this.players.length >= this.max) {
            return false;
        }
        this.players.push(player);
        if (this.players.length === this.max) {
            this.status = matchStatus.MATCHED;
        }
        return true;
    }

    removePlayer (player: Player) {
        this.players = this.players.filter(p => p.name !== player.name);
    }
}

module.exports = Room;    