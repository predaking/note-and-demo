const playerPool = new Set();
const rooms = {};

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

const init = (wss) => {
    wss.on('connection', async function connection (ws, req) {
        ws.on('message', function receive () {

        });

        const {
            loginUser: user,
            room
        } = req?.session || {};

        console.log('user: ', req.session);

        if (room) {
            ws.send(JSON.stringify({
                ...room,
                type: 'matched'
            }));
            return;
        }

        try {
            const _room = await matchPlayer({ ws, user });
            req.session.room = _room;
            req.session.save();
        } catch (error) {
            console.log('error: ', error);
        }
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