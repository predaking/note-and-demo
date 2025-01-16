const redisClient = require('../redis');
const { matchStatus } = require('../server/enums');
const Match = require('./classes/Match');
const Player = require('./classes/Player');

let matches = null;

(async () => {
    const _matches = await redisClient.hget('match');
    if (!_matches) {
        matches = new Match();
        return;
    }
    matches = Match.fromJSON(res);
})();

console.log('matches: ', matches);

const playerPool = matches.pool || new Set();
const rooms = matches.rooms || {};

/**
 * @description 广播
 * @param {*} players 
 * @param {*} data 
 */
const broadcast = (players, data) => {
    for (const player of players) {
        console.log('player: ', player);
        player.ws.send(JSON.stringify(data));
    }
};

/**
 * @description 匹配玩家
 * @param {*} player 
 */
const matchPlayer = (player) => {
    return new Promise((resolve, reject) => {
        const _name = player.user.name;
        const playerList = Array.from(playerPool);
        const hasPlayer = playerList.find(player => player.user.name === _name);
        // console.log('playerPool: ', playerPool);
        if (hasPlayer) {
            reject('已在匹配池中');
            return;
        }
    
        if (playerPool.size === 0) {
            playerPool.add(player);
        } else {
            const players = Array.from(playerPool);
            const waitingPlayer = players.pop();
            playerPool.delete(waitingPlayer);
            const _players = [player, waitingPlayer];
            const room = createRoom(_players);
            broadcast(_players, {
                ...room,
                type: 'matched'
            });
            resolve(room);
        }
    });
};

/**
 * @description 创建房间
 * @param {*} players 
 * @returns 
 */
const createRoom = (players) => {
    const roomId = `房间${Date.now()}`;
    const room = {
        players: players.map(player => player.user),
        status: 0,
        roomId
    };
    rooms[roomId] = room;
    return room;
};

const init = async (connection, req) => {
    const {
        loginUser: user,
    } = req?.session || {};

    const ws = connection;

    console.log('req.session: ', req.session);

    const _player = new Player(user, matchStatus.WAITING);
    const _user = pool.get(user)
    const isMatching = pool.get(user).status === matchStatus.;
}

module.exports = {
    init
}

/**
 * user
 * 
 * id name password count 
 * 
 * card
 * 
 * name country quality skill left top right bottom userName
 * 
 * skill 
 * 
 * id name 
 */