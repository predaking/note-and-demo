const fs = require('fs');
const path = require('path');
const ft = require('fastify')({ 
    logger: true,
    http2: true,
    https: {
        key: fs.readFileSync(path.resolve(__dirname, '../predaking.key')),
        cert: fs.readFileSync(path.resolve(__dirname, '../predaking.crt'))
    }
});

const { execute } = require('./db');
const password = require('../password');
const { result } = require('./enums');

ft.register(require('@fastify/mysql'), {
    promise: true,
    connectionString: `mysql://root:${password}@localhost/predaking`
});

ft.post('/login', async (req, reply) => {
    const { name, password } = req.body;
    const findUser = `select * from user where name = '${name}' and password = '${password}'`;
    try {
        const user = await execute(ft, findUser);
        if (!user) {
            return { code: 1, msg: '用户名或密码错误' };
        }
        reply.send({ code: 0, msg: '登录成功' });
    } catch (error) {
        ft.log.error(error);
        return { code: 1, msg: '登录失败' };
    }
});

ft.post('/test', async (_, reply) => {
    const client = await ft.mysql.getConnection();
    const [rows] = await client.query('select * from user');
    client.release();
    reply.send({ ...result, data: rows });
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
