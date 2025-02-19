import Redis from '../redis';
import Match from './match';
import Player from './player';
import Room from './room';
import { RoomType, PlayerType, UserName, MatchStatus } from '../../interface';
import WebSocketManager from './websocket-manager';

const wsManager = WebSocketManager.getInstance();

const { redisClient } = Redis;

class MatchManager {
    private matches: Match;
    private playerPool: Map<UserName, MatchStatus>;
    private rooms: RoomType[];

    constructor() {
        this.matches = new Match();
        this.playerPool = this.matches.pool;
        this.rooms = this.matches.rooms;
        this.initializeFromRedis();
    }

    private async initializeFromRedis() {
        try {
            const matchData = await redisClient.hGet('matches', 'data');
            if (!matchData) {
                return;
            }

            const parsedData = JSON.parse(matchData);
            if (Object.keys(parsedData).length) {
                this.matches.pool = new Map(parsedData.pool);
                this.matches.rooms = parsedData.rooms;
                this.playerPool = this.matches.pool;
                this.rooms = this.matches.rooms;
            }
        } catch (err) {
            console.error('Redis initialization error:', err);
        }
    }

    private async saveToRedis() {
        try {
            const playerPoolArray = Array.from(this.playerPool.entries());
            await redisClient.hSet('battles', 'matches', JSON.stringify({
                pool: playerPoolArray,
                rooms: this.rooms
            }));
        } catch (err) {
            console.error('Save to Redis error:', err);
        }
    }

    private createRoom(players: PlayerType[]): Room {
        const roomId = `room_${Date.now()}`;
        const room = new Room(roomId, players, MatchStatus.MATCHED);
        this.rooms.push(room);
        return room;
    }

    public async matchPlayer(player: PlayerType): Promise<string> {
        try {
            const currentStatus = this.playerPool.get(player.name);
            
            if (currentStatus === MatchStatus.WAITING) {
                const waitingPlayer = Array.from(this.playerPool.entries())
                    .find(([name, status]) => 
                        name !== player.name && status === MatchStatus.WAITING);

                if (waitingPlayer) {
                    const [matchedPlayerName] = waitingPlayer;
                    
                    // Update player status
                    this.playerPool.set(matchedPlayerName, MatchStatus.MATCHED);
                    this.playerPool.set(player.name, MatchStatus.MATCHED);

                    // Create room and notify players
                    const matchedPlayer = new Player(matchedPlayerName, MatchStatus.MATCHED);
                    this.createRoom([matchedPlayer, player]);
                    
                    wsManager.broadcast([player.name, matchedPlayerName], {
                        type: MatchStatus.MATCHED
                    });

                    await this.saveToRedis();
                }
            }

            return JSON.stringify({ type: currentStatus });
        } catch (err) {
            console.error('Match player error:', err);
            throw err;
        }
    }

    public addPlayer(name: UserName): void {
        this.playerPool.set(name, MatchStatus.WAITING);
    }
}

export default MatchManager;