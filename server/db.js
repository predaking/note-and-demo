const execute = (ft, sql) => {
    return new Promise((resolve, reject) => {
        ft.mysql.getConnection((err, client) => {
            console.log('debug: ', err, client);
            if (err) {
                return reject(err);
            }
    
            client.query(sql, (err, result) => {
                console.log('debug: ', sql, err, result);
                client.release();
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    })
}

module.exports = {
    execute
}