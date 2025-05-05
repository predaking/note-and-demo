import fastify, { FastifyInstance } from "fastify";
import fs from "fs";
import path from "path";

class Fastify {
    private static instance: FastifyInstance;

    public static getInstance(): FastifyInstance {
        if (!Fastify.instance) {
            Fastify.instance = fastify({ 
                logger: true,
                https: {
                    key: fs.readFileSync(path.resolve(__dirname, '../../predaking.key')),
                    cert: fs.readFileSync(path.resolve(__dirname, '../../predaking.crt')),
                },
                // http2: true
            });;
        }
        return Fastify.instance;
    }
}

export default Fastify;