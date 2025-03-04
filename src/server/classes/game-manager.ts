import Redis from '../redis';
import Player from './player';
import Room from './room';
import WebSocketManager from './websocket-manager';
import { 
    RoomType, 
    PlayerType, 
    MatchStatus, 
    ErrorEventType, 
    GameMainWsEventType, 
    RoomEventType, 
    BattleType,
    CountryEnum,
    CardType,
    RoleType
} from '@/interface';
import util from '@/util';
import { execute } from '../db';

const { fisherYatesShuffle, getKeyValuesFromEnum } = util;
const wsManager = WebSocketManager.getInstance();

const { redisClient } = Redis;

class GameManager {
    private playerPool: Map<number, { status: MatchStatus; name: string }>;
    private rooms: RoomType[];
    private battle: BattleType;

    constructor() {
        this.playerPool = new Map();
        this.rooms = [];
        this.battle = {
            roomId: '',
            grid: [],
            roles: [],
            current: 0
        };
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
                this.battle = parsedData.battle;
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
                rooms: this.rooms,
                battle: this.battle
            }));
        } catch (err) {
            console.error('Save to Redis error:', err);
        }
    }

    public async createRoom(players: PlayerType[]): Promise<RoomType> {
        try {
            const crypto = require('crypto');
            const roomId = crypto.randomBytes(8).toString('hex');
            const room = new Room(roomId, players, MatchStatus.MATCHED);
            this.rooms.push(room);
            await this.saveToRedis();
            wsManager.broadcast(players.map(player => player.id), {
                type: GameMainWsEventType.ROOM,
                subType: RoomEventType.CREATED,
                message: '房间创建成功',
                timestamp: Date.now(),
                data: {
                    room,
                }
            });
            return room;
        } catch (err: any) {
            console.error('Create room error:', err);
            throw new Error(err);
        }
    }

    public async matchPlayer(player: PlayerType): Promise<PlayerType[]> {
        try {
            this.addPlayer(player);
            const timeoutDuration = 60000; // 60秒超时
            const startTime = Date.now();

            while (Date.now() - startTime < timeoutDuration) {
                const currentPlayerData = this.playerPool.get(player.id);
                const currentStatus = currentPlayerData?.status;

                // 检查玩家是否仍然在线
                if (!wsManager.isClientConnected(player.id)) {
                    throw new Error(ErrorEventType.OFFLINE.toString());
                }
                
                if (currentStatus === MatchStatus.WAITING) {
                    const waitingPlayer = Array.from(this.playerPool.entries())
                        .find(([id, data]) => 
                            id !== player.id && 
                            data.status === MatchStatus.WAITING &&
                            wsManager.isClientConnected(id));

                    if (waitingPlayer) {
                        const [matchedPlayerId, matchedPlayerData] = waitingPlayer;
                        
                        this.playerPool.set(matchedPlayerId, { ...matchedPlayerData, status: MatchStatus.MATCHED });
                        this.playerPool.set(player.id, { name: player.name, status: MatchStatus.MATCHED });

                        const matchedPlayer = new Player(matchedPlayerId, matchedPlayerData.name, MatchStatus.MATCHED);
                        matchedPlayer.name = matchedPlayerData.name;

                        await this.saveToRedis();

                        const players = [matchedPlayer, player];

                        wsManager.broadcast([player.id, matchedPlayerId], {
                            type: GameMainWsEventType.MATCH,
                            subType: MatchStatus.MATCHED,
                            message: '匹配成功',
                            timestamp: Date.now(),
                            data: {
                                players,
                            }
                        });
                        return players;
                    }
                }

                // 等待一段时间后继续尝试匹配
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            throw new Error(ErrorEventType.TIMEOUT.toString());
        } catch (err: any) {
            const subType = +err.message;
            switch (subType) {
                case ErrorEventType.TIMEOUT:
                    wsManager.broadcast([player.id], {
                        type: GameMainWsEventType.ERROR,
                        subType,
                        message: '匹配超时',
                        timestamp: Date.now(),
                    });
                    break;
                case ErrorEventType.OFFLINE:
                    wsManager.broadcast([player.id], {
                        type: GameMainWsEventType.ERROR,
                        subType,
                        message: '用户离线',
                        timestamp: Date.now(),
                    });
                    break;
                default:
                    throw new Error(err);
            }
            return [];
        }
    }

    public addPlayer(player: PlayerType): void {
        this.playerPool.set(player.id, { status: MatchStatus.WAITING, name: player.name });
    }

    public async initCardsOfPlayer(countryId: number): Promise<CardType[]>  {
        const sql = `select * from card where country_id = ? ORDER BY RAND() limit 5`;
        const result: CardType[] = await execute(sql, [countryId]);
        return result;
    }

    public async initBattleData(room?: RoomType): Promise<BattleType> {
        // 随机生成两个国家
        const [idList] = getKeyValuesFromEnum(CountryEnum);
        const countryIds = fisherYatesShuffle(idList.map(id => +id)).slice(0, 2);
        console.log('ids: ', countryIds);

        const rolesPromises = countryIds.map(async (id, index) => {
            const cards = await this.initCardsOfPlayer(id);
            return {
                country: id,
                countryName: CountryEnum[id],
                role: room?.players[index],
                cards
            } as RoleType;
        });

        const roles = await Promise.all(rolesPromises);

        this.battle = {
            roomId: room?.id || '',
            grid: {},
            roles,
            current: Math.random() > 0.5 ? 0: 1
        }

        console.log('battle: ', this.battle);

        return this.battle;
    }
}

export default GameManager;