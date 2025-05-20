import { 
    FastifyInstance,
    FastifyRequest, 
    FastifyReply,
    FastifyError
} from 'fastify';
import fs from 'fs';
import path from 'path';
import { execute } from './db';
import { result } from './enum';
import { init } from './socket/server';
import Redis from './redis';
import { GameMainWsEventType } from './interface';
import Fastify from './classes/fastify';
import dotenv from 'dotenv';

const envFile = process.env.NODE_ENV === 'production' 
    ? '.env.production' 
    : '.env.development';

const _path = path.resolve(__dirname, `../../${envFile}`);

dotenv.config({
    path: _path
});

const { 
    DB_PASSWORD, 
    DB_USER, 
    DB_HOST, 
    DB_DATABASE, 
    DB_PORT,
    LOCAL_PORT,
} = process.env || {};

const { RedisStore, redisClient } = Redis;

const ft: FastifyInstance = Fastify.getInstance();

const _init = async () => {    
    await ft.register(require('@fastify/multipart'), {
        limits: {
            fileSize: 10 * 1024 * 1024 // 限制文件大小为10MB
        }
    });
    
    await ft.register(require('@fastify/websocket'), {
        options: {
            maxPayload: 1048576,
        }
    });

    // ft.register(require('@fastify/static'), {
    //     root: path.resolve(__dirname, '../../docs/'),
    //     prefix: '/docs/',
    //     list: true,
    //     redirect: true,
    //     wildcard: true,
    //     index: false
    // });

    ft.register(require('@fastify/cors'), {
        origin: `https://localhost:${LOCAL_PORT || 8080}`,
        credentials: true
    });
    
    ft.register(require('@fastify/cookie'));
    
    ft.register(require('@fastify/session'), {
        // secret: fs.readFileSync(path.resolve(__dirname, '../secret-key')),
        secret: 'THIS_IS_MY_SECRET_KEY_DONT_REMOVE_IT_DONT_SHARE_IT',
        cookie: {
            secure: true,
            sameSite: true,
            maxAge: 24 * 60 * 60 * 1000
        },
        store: new RedisStore({
            client: redisClient
        })
    });
    
    // 添加 try-catch 来捕获 MySQL 连接错误
    try {
        console.log('debug: ', DB_HOST, DB_USER, DB_PORT);
        await ft.register(require('@fastify/mysql'), {
            promise: true,
            connectionString: `mysql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`
        });
        ft.log.info('MySQL connected successfully.'); // 添加成功连接日志
    } catch (error) {
        ft.log.error('Failed to connect to MySQL:', error); // 记录详细错误
        // 连接失败时可以选择退出进程，或者根据需要处理
        // process.exit(1); 
    }

    ft.addHook('onRequest', async (req: FastifyRequest, reply: FastifyReply) => {
        const whiteList = [
            '/isLogin',
            '/login',
            '/register',
            '/login/salt',
            '/health',
            '/sse'
        ];

        if (whiteList.includes(req.url) || req.url.startsWith('/docs')) {
            return;
        }

        // 检查token是否存在于cookie中
        const token = req.cookies.token;
        if (!token) {
            return reply.code(401).send({ code: 1, msg: '未授权' });
        }

        // 从Redis中获取用户ID和token   
        const storedToken = await redisClient.get(`auth_token:${token}`);
        if (!storedToken || token !== storedToken) {
            return reply.code(401).send({ code: 1, msg: '未授权' });
        }
    });

    ft.post('/login/salt', async (req: FastifyRequest, reply: FastifyReply) => {
        const { name } = req.body as { name: string };
        const findUser = `select * from user where name = ?`;
        try {
            const [user] = await execute(findUser, [name]);
            console.log('user: ', user);
            if (!user) {
                return { ...result, code: 1, msg: '用户不存在' };
            }
            return { ...result, code: 0, data: { salt: user.salt } };
        } catch (error) {
            ft.log.error(error);
            return { ...result, code: 1, msg: '获取salt失败' };
        }
    });

    ft.post('/login', async (req: FastifyRequest, reply: FastifyReply) => {
        const { name, password } = req.body as { name: string, password: string };
        const findUser = `select * from user where name = ?`;
        try {
            const [user] = await execute(findUser, [name]);
            if (!user) {
                return { ...result, code: 1, msg: '用户名或密码错误' };
            }
            
            if (password !== user.password) {
                return { ...result, code: 1, msg: '用户名或密码错误' };
            }
            
            const crypto = require('crypto');
            // 生成新的token
            const token = crypto.randomBytes(32).toString('hex');
            await redisClient.set(`auth_token:${token}`, token, { EX: 24 * 60 * 60 }); // 24小时过期
            
            req.session.loginUser = user;
            delete user.password;
            delete user.salt;
            delete user.ip;
            
            reply.header('Set-Cookie', `token=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=86400`);
            reply.send({ code: 0, msg: '登录成功', data: { ...user, token } });
        } catch (error) {
            ft.log.error(error);
            console.log('err: ', error);
            return { ...result, code: 1, msg: '登录失败' };
        }
    });

    ft.post('/register', async (req: FastifyRequest, reply: FastifyReply) => {
        const { name, password, salt } = req.body as { name: string, password: string, salt: string };
        const findUser = `select * from user where name =?`;
        
        // 获取用户IP地址
        const clientIp = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        console.log('ip: ', clientIp);
        
        try {
            // 检查IP注册次数和最后注册时间
            const checkIpInfo = `SELECT COUNT(*) as count, MAX(last_register_time) as last_time FROM user WHERE ip = ?`;
            const ipInfo = await execute(checkIpInfo, [clientIp]);
            
            if (ipInfo && ipInfo.count >= 2) {
                return {...result, code: 1, msg: '该IP已达到最大注册次数限制' };
            }
            
            // 检查是否在60秒内重复注册
            if (ipInfo && ipInfo.last_register_time) {
                const lastRegisterTime = new Date(ipInfo.last_register_time).getTime();
                const now = Date.now();
                if (now - lastRegisterTime < 60000) { // 60秒内不允许重复注册
                    return {...result, code: 1, msg: '操作过于频繁，请稍后再试' };
                }
            }
            
            const [user] = await execute(findUser, [name]);
            if (user) {
                return {...result, code: 1, msg: '用户名已存在' };
            }

            const crypto = require('crypto');
            const id = crypto.randomBytes(16).toString('hex');
            // 使用客户端传来的salt和密码
            const insertUser = `insert into user (id, name, password, salt, ip, last_register_time) values (?, ?, ?, ?, ?, NOW())`;
            await execute(insertUser, [id, name, password, salt, clientIp]);
            req.session.loginUser = { name, salt, ip: clientIp, password };
            return {...result, code: 0, msg: '注册成功并自动登录', data: { name }};
        } catch (error) {
            ft.log.error(error);
            console.log('error: ', error);
            return {...result, code: 1, msg: '注册失败' };
        }
    });
    
    ft.get('/health', async (req: FastifyRequest, reply: FastifyReply) => {
        try {
            // 检查Redis连接状态
            const redisStatus = redisClient.isReady ? 'connected' : 'disconnected';
            
            // 检查MySQL连接状态
            let mysqlStatus = 'unknown';
            try {
                await execute('SELECT 1');
                mysqlStatus = 'connected';
            } catch (error) {
                mysqlStatus = 'disconnected';
            }
            
            // 获取服务器运行时间（毫秒）
            const uptime = process.uptime() * 1000;
            
            return {
                ...result,
                code: 0,
                msg: 'healthy',
                data: {
                    status: 'running',
                    uptime,
                    redis: redisStatus,
                    mysql: mysqlStatus,
                    timestamp: new Date().toISOString()
                }
            };
        } catch (error) {
            ft.log.error(error);
            return reply.code(500).send({
                ...result,
                code: 1,
                msg: 'unhealthy',
                data: {
                    status: 'error',
                    error: error
                }
            });
        }
    });
    
    ft.get('/isLogin', (req: FastifyRequest, _: FastifyReply) => {
        if (req.session.loginUser) {
            return { ...result, code: 0, msg: '已登录' };
        } else {
            return { ...result, code: 1, msg: '未登录' };
        }
    });

    ft.post('/upload', async (req: FastifyRequest, reply: FastifyReply) => {
        try {
            const data = await req.file();
            if (!data) {
                return reply.code(400).send({ code: 1, msg: '没有接收到文件' });
            }
            
            const fileBuffer = await data.toBuffer();
            const fileName = data.filename;
            const uploadDir = path.join(__dirname, '../../uploads');
            
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            
            const filePath = path.join(uploadDir, fileName);
            fs.writeFileSync(filePath, fileBuffer);
            
            reply.send({ code: 0, msg: '文件上传成功', data: { fileName } });
        } catch (error) {
            ft.log.error(error);
            reply.code(500).send({ code: 1, msg: '文件上传失败' });
        }
    });

    ft.get('/sse', (req, reply) => {
        reply.raw.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*'
        });

        // 发送初始连接成功消息
        // reply.raw.write(`id: ${Date.now()}\n`);
        // reply.raw.write(`event: connected\n`);
        // reply.raw.write(`data: 连接已建立\n\n`);

        // 定期发送数据
        const intervalId = setInterval(() => {
            const now = new Date().toISOString();
            reply.raw.write(JSON.stringify({
                id: Date.now(),
                event: 'message',
                data: now
            }));
        }, 1000);

        // 处理客户端断开连接
        req.raw.on('close', () => {
            clearInterval(intervalId);
            ft.log.info('SSE 客户端断开连接');
        });
    })
    
    // @ts-ignore
    ft.get('/threeKingdomsDebate', { websocket: true }, (connection: any, req: FastifyRequest) => {
        console.log('connected');
        connection.on('message', (data: string) => {
            const _data = JSON.parse(data);

            switch (_data.type) {
                case GameMainWsEventType.REQUEST:
                    if (_data.path === '/matching') {
                        init(connection as any, req);
                    }
                    break;
                default:
                    break;
            }
        });
    });
    
    ft.setErrorHandler((error: FastifyError, req: FastifyRequest, reply: FastifyReply) => {
        ft.log.error(error);
        reply.send({ code: 1, msg: '服务器错误' });
    });
    
    ft.listen({
        port: 3000,
        host: '0.0.0.0'
    }, (err: Error | null, address: string) => {
        if (err) {
            ft.log.error('err: ' + err);
            process.exit(1);
        }
        ft.log.info(`server listening on ${address}`);
    });
};

_init();

