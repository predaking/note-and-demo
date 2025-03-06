import Fastify from "./classes/fastify";
import util from "@/util";

const { underscoreToCamelCase } = util;

export const execute = async (sql: string, params: any = []) => {
    let client: any;
    try {
        const ft = Fastify.getInstance();
        const client = await ft.mysql.getConnection();
        const [rows] = await client.query(sql, params);
        client.release();
        const res = Array.isArray(rows) ? rows.map((row: any) => underscoreToCamelCase(row)) : underscoreToCamelCase(rows);
        return res;
    } catch (error) {
        client && client.release();
        throw error;
    }
}