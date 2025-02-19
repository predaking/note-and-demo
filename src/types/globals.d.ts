import { FastifyRequest as OriginalFastifyRequest } from "fastify";

declare module 'fastify' {
    interface FastifyRequest extends OriginalFastifyRequest {
        session: {
            loginUser?: User;
        },
        body: any;
    }
}

declare module '*.scss' {
    const content: { [className: string]: string };
    export default content;
};