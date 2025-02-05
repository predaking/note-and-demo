import fastify, { 
    FastifyRequest, 
    FastifyReply,
    FastifyError
} from 'fastify';
import fs from 'fs';
import path from 'path';
import password from '../password';
import { execute } from './db';
import { result } from './enums';
import { init } from '../socket/server';
import Redis from './redis';

const { RedisStore, redisClient } = Redis;

const _init = async () => {
    const ft = fastify({ 
        logger: true,
        https: {
            key: fs.readFileSync(path.resolve(__dirname, '../predaking.key')),
            cert: fs.readFileSync(path.resolve(__dirname, '../predaking.crt')),
        },
        // http2: true
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
    
    ft.post('/login', async (req: FastifyRequest, reply: FastifyReply) => {
        const { name, password } = req.body as { name: string, password: string };
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
    
    ft.get('/isLogin', (req: FastifyRequest, _: FastifyReply) => {
        if (req.session.loginUser) {
            return { ...result, code: 0, msg: '已登录' };
        } else {
            return { ...result, code: 1, msg: '未登录' };
        }
    });
    
    ft.get('/ws', { websocket: true } as any, (connection, req: FastifyRequest | any) => {
        // console.log('connected');
        init(connection, req);
    });
    
    ft.setErrorHandler((error: FastifyError, req: FastifyRequest, reply: FastifyReply) => {
        ft.log.error(error);
        reply.send({ code: 1, msg: '服务器错误' });
    });
    
    ft.listen({
        port: 3000
    }, (err: Error | null, address: string) => {
        if (err) {
            ft.log.error('err: ' + err);
            process.exit(1);
        }
        ft.log.info(`server listening on ${address}`);
    });
};

_init();

