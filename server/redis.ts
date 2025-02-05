import { createClient } from 'redis';
import RedisStore from 'connect-redis';

const redisClient: any = createClient({
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
