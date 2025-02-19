import { FastifyRequest } from 'fastify';
import { UserName } from '../../interface';

class WebSocketManager {
    private static instance: WebSocketManager;
    private clients: Map<UserName, WebSocket>;

    private constructor() {
        this.clients = new Map();
    }

    public static getInstance(): WebSocketManager {
        if (!WebSocketManager.instance) {
            WebSocketManager.instance = new WebSocketManager();
        }
        return WebSocketManager.instance;
    }

    public addClient(name: UserName, ws: WebSocket): void {
        this.clients.set(name, ws);
    }

    public removeClient(name: UserName): void {
        this.clients.delete(name);
    }

    public getClient(name: UserName): WebSocket | undefined {
        return this.clients.get(name);
    }

    public broadcast(names: UserName[], data: any): void {
        for (const name of names) {
            const client = this.clients.get(name);
            if (client) {
                client.send(JSON.stringify(data));
            }
        }
    }

    public validateConnection(req: FastifyRequest): { isValid: boolean; user?: { name: string } } {
        const { loginUser: user } = req?.session || {};
        
        if (!user || !user.name) {
            return { isValid: false };
        }

        return { isValid: true, user };
    }
}

export default WebSocketManager;