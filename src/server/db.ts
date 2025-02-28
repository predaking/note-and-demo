import Fastify from "./classes/fastify";

export const execute = async (sql: string, params: any = []) => {
    let client: any;
    try {
        const ft = Fastify.getInstance();
        const client = await ft.mysql.getConnection();
        const [rows] = await client.query(sql, params);
        client.release();
        return rows[0];
    } catch (error) {
        client && client.release();
        throw error;
    }
}