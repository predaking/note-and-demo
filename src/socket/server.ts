import { FastifyRequest } from 'fastify';
import { MatchStatus } from '@/interface';
import Player from '@/server/classes/player';
import WebSocketManager from '@/server/classes/websocket-manager';
import MatchManager from '@/server/classes/match-manager';

const wsManager = WebSocketManager.getInstance();

const matchManager = new MatchManager();

export const init = async (connection: WebSocket, req: FastifyRequest): Promise<void> => {
    try {
        const validation = wsManager.validateConnection(req);
    
        if (!validation.isValid || !validation.user) {
            console.error('Invalid connection attempt');
            return;
        }
        const { id } = validation.user;
        wsManager.addClient(id, connection);

        const _pool = matchManager.getPlayerPool();
        const userInfo = _pool.get(id);

        if (!userInfo) {
            throw new Error('用户池中不存在该用户');
        }
    
        if (userInfo?.status === MatchStatus.MATCHED) {
            console.log('Player is already in a match');
            return;
        }

        const player = new Player(id, userInfo.name, MatchStatus.WAITING);

        matchManager.addPlayer(player);
        await matchManager.matchPlayer(player);
    } catch (err) {
        console.error('Connection initialization error:', err);
    }
};