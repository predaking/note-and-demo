import { FastifyRequest } from 'fastify';
import { PlayerType, WSMessageType } from '@/interface';

class WebSocketManager {
    private static instance: WebSocketManager;
    private clients: Map<number, WebSocket>;

    constructor() {
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

    public broadcast(ids: number[], data: WSMessageType): void {
        for (const id of ids) {
            const client = this.getClient(id);
            if (client) {
                client.send(JSON.stringify(data));
            }
        }
    }

    public isClientConnected(id: number): boolean {
        const client = this.clients.get(id);
        return client?.readyState === WebSocket.OPEN;
    }

    public validateConnection(connection: WebSocket, req: FastifyRequest): PlayerType | null {
        const { loginUser: user } = req?.session || {};
        
        if (!user || !user.id) {
            user.id && this.removeClient(user.id);
            return null;
        }

        // 添加连接状态监听
        connection.onclose = () => {
            console.log(`WebSocket connection closed for user ${user.id}`);
            this.removeClient(user.id);
        };

        connection.onerror = (error) => {
            console.error(`WebSocket error for user ${user.id}:`, error);
            this.removeClient(user.id);
        };

        this.addClient(user.id, connection);
        return user;
    }
}

export default WebSocketManager;