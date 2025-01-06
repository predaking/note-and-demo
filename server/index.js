const fs = require('fs');
const path = require('path');
const { execute } = require('./db');
const password = require('../password');
const { result } = require('./enums');
const { RedisStore, redisClient } = require('./redis');

const init = async () => {
    const ft = require('fastify')({ 
        logger: true,
        https: {
            key: fs.readFileSync(path.resolve(__dirname, '../predaking.key')),
            cert: fs.readFileSync(path.resolve(__dirname, '../predaking.crt')),
        }
    });
    
    await ft.register(require('@fastify/websocket'), {
        options: {
            maxPayload: 1048576,
        }
    });
    
    ft.register(require('@fastify/cors'), {
        origin: 'https://localhost:5173',
        credentials: true
    });
    
    ft.register(require('@fastify/cookie'));
    
    ft.register(require('@fastify/session'), {
        // secret: fs.readFileSync(path.resolve(__dirname, '../secret-key')),
        secret: 'THIS_IS_MY_SECRET_KEY_DONT_REMOVE_IT_DONT_SHARE_IT',
        cookie: {
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        },
        store: new RedisStore({
            client: redisClient
        })
    });
    
    ft.register(require('@fastify/mysql'), {
        promise: true,
        connectionString: `mysql://root:${password}@localhost/predaking`
    });
    
    ft.post('/login', async (req, reply) => {
        const { name, password } = req.body;
        const findUser = `select * from user where name = ? and password = ?`;
        try {
            const user = await execute(ft, findUser, [name, password]);
            if (!user) {
                return { ...result, code: 1, msg: '用户名或密码错误' };
            }
            req.session.loginUser = user;
            reply.send({ ...result, code: 0, msg: '登录成功' });
        } catch (error) {
            ft.log.error(error);
            return { ...result, code: 1, msg: '登录失败' };
        }
    });
    
    ft.get('/isLogin', (req, _) => {
        if (req.session.loginUser) {
            return { ...result, code: 0, msg: '已登录' };
        } else {
            return { ...result, code: 1, msg: '未登录' };
        }
    });
    
    ft.get('/ws', { websocket: true }, (connection, req) => {
        connection.send('hello');
        connection.onmessage = (message) => {
            console.log('received: ' + message.data);
        }
    });
    
    ft.setErrorHandler((error, req, reply) => {
        ft.log.error(error);
        reply.send({ code: 1, msg: '服务器错误' });
    });
    
    ft.listen({
        port: 3000
    }, (err, address) => {
        if (err) {
            ft.log.error('err: ' + err);
            process.exit(1);
        }
        ft.log.info(`server listening on ${address}`);
    });
};

init();

