const Ws = require('ws');

const init = () => {
    const wss = new Ws.Server({ port: 8888 });
    wss.on('connection', function connection (ws) {
        console.log('客户端： ', ws);
        ws.on('message', function receive (msg) {
            console.log('received: %s', msg);
            ws.send('...');
            const timer = setTimeout(() => {
                ws.send('response: ' + msg);
                clearTimeout(timer);
            }, 2000);
        });
    })
}

init();