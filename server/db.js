const execute = async (ft, sql) => {
    let client;
    try {
        const client = await ft.mysql.getConnection();
        const [rows] = await client.query(sql);
        client.release();
        return rows[0];
    } catch (error) {
        client && client.release();
        throw error;
    }
}

module.exports = {
    execute
}