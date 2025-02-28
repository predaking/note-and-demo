import { FastifyRequest } from 'fastify';
import { MatchStatus, PlayerType, UserType } from '@/interface';
import Player from '@/server/classes/player';
import WebSocketManager from '@/server/classes/websocket-manager';
import GameManager from '@/server/classes/game-manager';

const wsManager = WebSocketManager.getInstance();

const gameManager = new GameManager();

export const init = async (connection: WebSocket, req: FastifyRequest): Promise<void> => {
    try {
        gameManager.initBattleData();
        const user: PlayerType | null = wsManager.validateConnection(connection, req);
    
        if (!user) {
            throw new Error('用户未登录');
        }

        const { id, name } = user;

        const _pool = gameManager.getPlayerPool();
        const userInfo = _pool.get(id);
    
        if (userInfo && userInfo.status === MatchStatus.MATCHED) {
            console.log('Player is already in a match');
            return;
        }

        // const player = new Player(id, name, MatchStatus.WAITING);
        // const matchedPlayers = await gameManager.matchPlayer(player);
        // const room = await gameManager.createRoom(matchedPlayers);
    } catch (err: any) {
        console.error('Connection initialization error:', err);
        // wsManager.broadcast([user.id], {
        //     type: GameMainWsEventType.ERROR,
        //     subType: ErrorEventType.UNKNOWN,
        //     message: err.message || '未知错误',
        //     timestamp: Date.now(),
        // });
    }
};