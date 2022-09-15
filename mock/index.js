const http = require('http');

const getBookList = require('./getBookList');
const register = require('./register');

const api = {
    getBookList,
    register
}

const server = http.createServer((req, res) => {
	res.setHeader('Content-Type', 'text/html;charset=utf-8');
    res.end(JSON.stringify(api[req.url.slice(1)]));
});

server.listen(3000);
