const execute = async (ft, sql, params = []) => {
    let client;
    try {
        const client = await ft.mysql.getConnection();
        const [rows] = await client.query(sql, params);
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