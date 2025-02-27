import { FastifyRequest } from 'fastify';
import { MatchStatus } from '@/interface';
import Player from '@/server/classes/player';
import WebSocketManager from '@/server/classes/websocket-manager';
import GameManager from '@/server/classes/game-manager';

const wsManager = WebSocketManager.getInstance();

const gameManager = new GameManager();

export const init = async (connection: WebSocket, req: FastifyRequest): Promise<void> => {
    try {
        const validation = wsManager.validateConnection(req);
    
        if (!validation.isValid || !validation.user) {
            console.error('Invalid connection attempt');
            return;
        }
        const { id, name } = validation.user;
        wsManager.addClient(id, connection);

        const _pool = gameManager.getPlayerPool();
        const userInfo = _pool.get(id);
    
        if (userInfo && userInfo.status === MatchStatus.MATCHED) {
            console.log('Player is already in a match');
            return;
        }

        const player = new Player(id, name, MatchStatus.WAITING);
        gameManager.addPlayer(player);
        await gameManager.matchPlayer(player);
    } catch (err) {
        console.error('Connection initialization error:', err);
    }
};