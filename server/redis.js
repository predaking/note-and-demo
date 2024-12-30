const redis = require('redis');
const RedisStore = require('connect-redis').default;

const redisClient = redis.createClient({
    url: 'redis://localhost:6379'
});

redisClient.on('error', (err) => {
    console.log('redis error: ', err);
});

redisClient.on('connect', () => {
    console.log('redis connected');
});

redisClient.connect();

module.exports = {
    redisClient,
    RedisStore
}