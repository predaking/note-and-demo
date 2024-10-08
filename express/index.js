const express = require("express");
const mysql = require('mysql');
const cors = require('cors');
const session = require('express-session');
const FileStore = require('session-file-store')(session);

const { result } = require('./enums');
const password = require('./password');

const identityKey = 'skey';

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true
}));
app.use(session({
    name: identityKey,
    secret: 'predaking',
    store: new FileStore(),
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000
    },
}));

const connect = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password,
    database: 'predaking'
});

connect.connect((err) => {
    if (err) {
        console.log('error: ', err);
    } else {
        console.log('mysql connected');
    }
});

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

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});





