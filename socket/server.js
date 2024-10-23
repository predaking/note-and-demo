const clients = new Set();

const broadcast = (user) => {
    for (const client of clients) {
        console.log('client: ', client);
        client.ws.send(`${user.name}已加入`);
    }
};

const init = (wss) => {
    wss.on('connection', function connection (ws, req) {
        const user = req?.session?.loginUser;
        clients.add({ ws, user });
        broadcast(user);
        ws.on('message', function receive () {

        });
    });
}

module.exports = {
    init
}

/**
 * user
 * 
 * id name password count 
 * 
 * card
 * 
 * name country quality skill left top right bottom userName
 * 
 * skill 
 * 
 * id name 
 */