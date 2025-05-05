import { FastifyRequest } from 'fastify';
import { 
    MatchStatus, 
    PlayerType,
    GameMainWsEventType,
    RoomEventType,
    BattleEventType,
    ErrorEventType
} from '../interface';
import Player from '../classes/player';
import WebSocketManager from '../classes/websocket-manager';
import GameManager from '../classes/game-manager';

const wsManager = WebSocketManager.getInstance();

const gameManager = new GameManager();

let user: PlayerType | null = null;

export const init = async (connection: WebSocket, req: FastifyRequest): Promise<void> => {
    try {
        user = wsManager.validateConnection(connection, req);
    
        if (!user) {
            throw new Error('用户未登录');
        }

        const { id, name } = user;

        const _pool = gameManager.getPlayerPool();
        const userInfo = _pool.get(id);

        console.log('userInfo', userInfo);
    
        if (userInfo && userInfo.status === MatchStatus.MATCHED) {
            const rooms = gameManager.getRooms();
            const battles = gameManager.getBattles();

            const room = rooms.find(room => room.players.some(player => player.id === id))!;
            const battle = battles.get(room.id);
            wsManager.broadcast([id], {
                type: GameMainWsEventType.MATCH,
                subType: MatchStatus.PLAYING,
                message: '用户已在游戏中',
                timestamp: Date.now(),
                data: {
                    room,
                    battle
                }
            });
            return;
        }

        const player = new Player(id, name, MatchStatus.WAITING);
        const matchedPlayers = await gameManager.matchPlayer(player);

        wsManager.broadcast([player.id], {
            type: GameMainWsEventType.MATCH,
            subType: MatchStatus.MATCHED,
            message: '匹配成功',
            timestamp: Date.now(),
            data: {
                matchedPlayers
            }
        });
        const room = await gameManager.createRoom(matchedPlayers);
        wsManager.broadcast(room.players.map(player => player.id), {
            type: GameMainWsEventType.ROOM,
            subType: RoomEventType.CREATED,
            message: '房间创建成功',
            timestamp: Date.now(),
            data: {
                room
            }
        });
        const battle = await gameManager.initBattleData(room);
        wsManager.broadcast(room.players.map(player => player.id), {
            type: GameMainWsEventType.BATTLE,
            subType: BattleEventType.START,
            message: '游戏开始',
            timestamp: Date.now(),
            data: {
                battle
            }
        });
    } catch (err: any) {
        console.error('Connection initialization error:', err);
        if (user && user.id) {
            wsManager.broadcast([user.id], {
                type: GameMainWsEventType.ERROR,
                subType: ErrorEventType.UNKNOWN,
                message: err.message || '未知错误',
                timestamp: Date.now(),
            });
        }
    }
};