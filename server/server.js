const http = require('http');

const {
	find
} = require('./service/testService');

const {
	ClientRequest
} = http;

const server = http.createServer((req, res) => {
	find()
		.then(data => {
			res.setHeader('Content-Type', 'text/html;charset=utf-8');
			res.setHeader('Access-Control-Allow-Origin', '*');
			
			const responseData = {
				code: res.statusCode,
				msg: http.STATUS_CODES[res.statusCode],
				data
			};

			res.end(JSON.stringify(responseData));
		})
		.catch(err => console.log('error: ', err));
});

// server.requestTimeout = 1000; 可以手动设置超时时间
server.listen(9090);
