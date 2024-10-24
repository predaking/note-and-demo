const playerPool = new Set();
const rooms = {};

/**
 * @description 广播
 * @param {*} players 
 * @param {*} data 
 */
const broadcast = (players, data) => {
    for (const player of players) {
        player.ws.send(JSON.stringify(data));
    }
};

/**
 * @description 匹配玩家
 * @param {*} player 
 */
const matchPlayer = (player) => {
    const _name = player.user.name;
    const playerList = Array.from(playerPool);
    const hasPlayer = playerList.find(player => player.user.name === _name);

    if (playerPool.size === 0 && !hasPlayer) {
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
        // playerPool.clear();
    }
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

const init = (wss) => {
    wss.on('connection', function connection (ws, req) {
        const user = req?.session?.loginUser;
        matchPlayer({ ws, user });
        ws.on('message', function receive () {

        });
    });
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