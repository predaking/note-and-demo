const express = require("express");
const mysql = require('mysql');
const cors = require('cors');
const https = require('https');
const http = require('http');
const Ws = require('ws');
const fs = require('fs');
const path = require('path');
const session = require('express-session');
const redis = require('redis');
const RedisStore = require('connect-redis').default;
const socket = require('../socket/server');

const { result } = require('./enums');
const password = require('../password');

const identityKey = 'skey';

const app = express();
const port = 3000;

const sqlOptions = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password,
    database: 'predaking'
}

const connect = mysql.createConnection(sqlOptions);

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

const sessionParser = session({
    name: identityKey,
    secret: 'predaking',
    resave: false,
    store: new RedisStore({
        client: redisClient,
    }),
    saveUninitialized: false,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        secure: false,
    },
});

app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(sessionParser);

connect.connect((err) => {
    if (err) {
        console.log('error: ', err);
    } else {
        console.log('mysql connected');
    }
});

const _options = {
    key: fs.readFileSync(path.resolve(__dirname, '../predaking.key')),
    cert: fs.readFileSync(path.resolve(__dirname, '../predaking.crt'))
};

const server = http.createServer(_options, app);
const wss = new Ws.Server({ clientTracking: true, noServer: true });

server.on('upgrade', (req, socket, head) => {
    sessionParser(req, {}, () => {
        if (!req.session.loginUser) {
            socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
            socket.destroy();
            return;
        }
        wss.handleUpgrade(req, socket, head, (ws) => {
            wss.emit('connection', ws, req);
        });
    });
});

socket.init(wss);

const execute = (sql) => {
    return new Promise((resolve, reject) => {
        connect.query(sql, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

/**
 * @description: 注册
 */
app.post('/register', async (req, res) => {
    const { name, password } = req.body;
    const findUser = `select * from user where name = '${name}'`;
    const user = await execute(findUser);
    if (user.length > 0) {
        res.json({
            ...result,
            code: 1,
            msg: '该用户已注册'
        });
        return;
    }
    const insertUser = `insert into user (name, password, avatar, count) values ('${name}', '${password}', '', 0)`;
    await execute(insertUser);
    res.json({
        ...result,
        msg: '注册成功'
    });
});

/**
 * @description: 登录
 */
app.post('/login', async (req, res) => {
    const { name, password } = req.body;
    const findUser = `select * from user where name = '${name}' and password = '${password}'`;
    const user = await execute(findUser);
    if (user.length === 0) {
        res.json({
            ...result,
            code: 1,
            msg: '用户名或密码错误'
        });
        return;
    }
    req.session.regenerate((err) => {
        if (err) {
            res.json({
                ...result,
                code: 1,
                msg: '登录失败'
            });
            return;
        }
        req.session.loginUser = user[0];
        res.json({
            ...result,
            msg: '登录成功'
        });
    });
});

app.get('/isLogin', (req, res) => {
    console.log('session: ', req.session);
    if (req.session.loginUser) {
        res.json({
            ...result,
            data: req.session.loginUser
        });
    } else {
        res.json({
            ...result,
            code: 1,
            msg: '未登录'
        });
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            res.json({
                ...result,
                code: 1,
                msg: '退出登录失败'
            });
            return;
        }
        res.json({
            ...result,
            msg: '退出登录成功'
        });
    });
});

server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});


