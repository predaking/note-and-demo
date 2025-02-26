import { FastifyRequest } from 'fastify';
import { PlayerType } from '../../interface';

class WebSocketManager {
    private static instance: WebSocketManager;
    private clients: Map<number, WebSocket>;

    private constructor() {
        this.clients = new Map();
    }

    public static getInstance(): WebSocketManager {
        if (!WebSocketManager.instance) {
            WebSocketManager.instance = new WebSocketManager();
        }
        return WebSocketManager.instance;
    }

    public addClient(id: number, ws: WebSocket): void {
        this.clients.set(id, ws);
    }

    public removeClient(id: number): void {
        this.clients.delete(id);
    }

    public getClient(id: number): WebSocket | undefined {
        return this.clients.get(id);
    }

    public broadcast(ids: number[], data: any): void {
        for (const id of ids) {
            const client = this.clients.get(id);
            if (client) {
                client.send(JSON.stringify(data));
            }
        }
    }

    public validateConnection(req: FastifyRequest): { isValid: boolean; user?: PlayerType } {
        const { loginUser: user } = req?.session || {};
        
        if (!user || !user.id) {
            return { isValid: false };
        }

        return { isValid: true, user };
    }
}

export default WebSocketManager;