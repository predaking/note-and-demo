import { FastifyRequest } from 'fastify';
import { MatchStatus  } from '@/interface';
import Player from '@/server/classes/player';
import WebSocketManager from '@/server/classes/websocket-manager';
import MatchManager from '@/server/classes/match-manager';

const wsManager = WebSocketManager.getInstance();

const matchManager = new MatchManager();

export const init = async (connection: WebSocket, req: FastifyRequest): Promise<void> => {
    const validation = wsManager.validateConnection(req);
    
    if (!validation.isValid || !validation.user) {
        console.error('Invalid connection attempt');
        return;
    }

    const { name } = validation.user;
    const player = new Player(name, MatchStatus.WAITING);

    try {
        wsManager.addClient(name, connection);
        matchManager.addPlayer(name);
        await matchManager.matchPlayer(player);
    } catch (err) {
        console.error('Connection initialization error:', err);
    }
};