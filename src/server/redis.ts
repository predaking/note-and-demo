import { createClient } from 'redis';
import RedisStore from 'connect-redis';

interface RedisClient extends ReturnType<typeof createClient> {
    fromJSON: (json: string) => any;
    toJSON: (data: any) => string;
}

const redisClient = createClient({
    url: 'redis://localhost:6379'
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
