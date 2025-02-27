import Redis from '../redis';
import Player from './player';
import Room from './room';
import { RoomType, PlayerType, MatchStatus } from '../../interface';
import WebSocketManager from './websocket-manager';

const wsManager = WebSocketManager.getInstance();

const { redisClient } = Redis;

class GameManager {
    private playerPool: Map<number, { status: MatchStatus; name: string }>;
    private rooms: RoomType[];

    constructor() {
        this.playerPool = new Map();
        this.rooms = [];
        this.initializeFromRedis();
    }

    getPlayerPool(): Map<number, { status: MatchStatus; name: string }> {
        return this.playerPool;
    }

    getRooms(): RoomType[] {
        return this.rooms;
    }

    private async initializeFromRedis() {
        try {
            const matchData = await redisClient.hGet('battles', 'data');
            if (!matchData) {
                return;
            }

            const parsedData = JSON.parse(matchData);
            if (Object.keys(parsedData).length) {
                this.playerPool = new Map(parsedData.pool);
                this.rooms = parsedData.rooms;
            }
        } catch (err) {
            console.error('Redis initialization error:', err);
        }
    }

    private async saveToRedis() {
        try {
            const playerPoolArray = Array.from(this.playerPool.entries());
            await redisClient.hSet('threeKingdomsDebate', 'battles', JSON.stringify({
                pool: playerPoolArray,
                rooms: this.rooms
            }));
        } catch (err) {
            console.error('Save to Redis error:', err);
        }
    }

    private createRoom(players: PlayerType[]): Room {
        const randomId = crypto.randomUUID().slice(0, 8);
        const roomId = `room_${randomId}`;
        const room = new Room(roomId, players, MatchStatus.MATCHED);
        this.rooms.push(room);
        return room;
    }

    public async matchPlayer(player: PlayerType): Promise<PlayerType[]> {
        try {
            const currentPlayerData = this.playerPool.get(player.id);
            const currentStatus = currentPlayerData?.status;
            
            if (currentStatus === MatchStatus.WAITING) {
                const waitingPlayer = Array.from(this.playerPool.entries())
                    .find(([id, data]) => 
                        id !== player.id && data.status === MatchStatus.WAITING);

                if (waitingPlayer) {
                    const [matchedPlayerId, matchedPlayerData] = waitingPlayer;
                    
                    this.playerPool.set(matchedPlayerId, { ...matchedPlayerData, status: MatchStatus.MATCHED });
                    this.playerPool.set(player.id, { name: player.name, status: MatchStatus.MATCHED });

                    const matchedPlayer = new Player(matchedPlayerId, matchedPlayerData.name, MatchStatus.MATCHED);
                    matchedPlayer.name = matchedPlayerData.name;
                    this.createRoom([matchedPlayer, player]);
                    
                    // wsManager.broadcast([player.id,matchedPlayerId], {
                    //     type: MatchStatus.MATCHED
                    // });

                    await this.saveToRedis();
                    return [matchedPlayer, player]
                }
            }
        } catch (err) {
            console.error('Match player error:', err);
            throw err;
        }
    }

    public addPlayer(player: PlayerType): void {
        this.playerPool.set(player.id, { status: MatchStatus.WAITING, name: player.name });
    }
}

export default GameManager;