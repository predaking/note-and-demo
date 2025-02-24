import { FastifyRequest as OriginalFastifyRequest } from "fastify";

declare module 'fastify' {
    interface FastifyRequest extends OriginalFastifyRequest {
        session: {
            loginUser?: User;
        },
        body: any;
        file: any;
    }
}