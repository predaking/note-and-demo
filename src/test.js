const http = require('http');

const template = `
    <!DOCTYPE html>
    <html>
        <head>
            <title>react-webpack-demo</title>
            <meta charset="utf-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=Edge" />
            <meta name="viewport" content="width=device-width,initial-scale=1" />
            <meta http-equiv="content-type" content="text/html;charset=utf-8"/>
        </head>

        <body>
            <div id="app">
                <a ping="https://www.baidu.com">本链接</a>
            </div>
        </body>
    </html>
`;

const server = http.createServer((req, res) => {
    res.setHeader("Content-Type", "text/html;charset=utf-8");
    res.end(template);
});

server.listen('8888');
