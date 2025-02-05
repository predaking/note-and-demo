import { FastifyRequest } from 'fastify';
import Redis from '../server/redis';
import { MatchStatus, PlayerType, UserName } from '../server/interface';
import Match from '../server/classes/match';
import Player from '../server/classes/player';
import Room from '../server/classes/room';

const { redisClient } = Redis;

let matches: any = {};
let clients: any = {};

(async () => {
    const _matches = await redisClient.hGet('matches');
    console.log('_matches: ', _matches);
    if (!_matches) {
        matches = new Match();
        return;
    }
    matches = redisClient.fromJSON(_matches);
})();

console.log('matches: ', matches);

const playerPool = matches.pool || new Map();
const rooms = matches.rooms || [];

const saveData = async () => {
    await redisClient.hSet('matches', matches);
}

/**
 * @description 广播
 * @param {*} names 
 * @param {*} data 
 */
const broadcast = (names: UserName[], data: any) => {
    for (const name of names) {
        clients[name].send(JSON.stringify(data));
    }
};

/**
 * @description 匹配玩家
 * @param {*} player 
 */
const matchPlayer = (player: PlayerType) => {
    return new Promise((resolve, reject) => {
        const _status = playerPool.get(player.name).status;
        if (_status === MatchStatus.WAITING) {
            const [_name, _status] = playerPool
                .entries()
                .find((_player: [UserName, MatchStatus]) => 
                    _player[0] !== player.name 
                        && _player[1] === MatchStatus.WAITING);

            if (_name) {
                playerPool.delete(_name);
                playerPool.set(_name, MatchStatus.MATCHED);
                broadcast([player.name, _name], {
                    type: MatchStatus.MATCHED
                });
                createRoom([new Player(_name, MatchStatus.MATCHED), player]);
                saveData();
            }
        }
        // resolve(JSON.stringify({
        //     type: _status
        // }))
    });
};

/**
 * @description 创建房间
 * @param {*} players 
 * @returns 
 */
const createRoom = (players: PlayerType[]) => {
    const roomId = `房间${Date.now()}`;
    const room = new Room(roomId, players, MatchStatus.MATCHED);
    rooms.push(room);
    return room;
};

export const init = async (connection: WebSocket | any, req: FastifyRequest) => {
    const {
        loginUser: user,
    } = req?.session || {};

    const ws = connection;

    console.log('req.session: ', req.session);

    const _player = new Player(user, MatchStatus.WAITING);
    clients[user.name] = ws;

    try {
        await matchPlayer(_player);
    } catch (err) {
        console.log('err: ', err);
    }
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