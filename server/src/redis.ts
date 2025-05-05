import { createClient } from 'redis';
import RedisStore from 'connect-redis';

interface RedisClient extends ReturnType<typeof createClient> {
    fromJSON: (json: string) => any;
    toJSON: (data: any) => string;
}

// 使用环境变量或默认为localhost
const REDIS_HOST = process.env.REDIS_HOST || 'localhost';

const redisClient = createClient({
    url: `redis://${REDIS_HOST}:6379`
});

redisClient.on('error', (err: Error) => {
    console.log('redis error: ', err);
});

redisClient.on('connect', () => {
    console.log('redis connected');
});

redisClient.connect();

export default {
    RedisStore,
    redisClient
}
