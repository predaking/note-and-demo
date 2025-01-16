import { FastifyRequest } from "fastify";

declare module 'fastify' {
    interface FastifyRequest {
        session: {
            loginUser?: User;
        },
        body: any;
    }
}