import { 
    FastifyRequest as OriginalFastifyRequest,
    FastifyInstance as OriginalFastifyInstance,
} from "fastify";

declare module 'fastify' {
    interface FastifyRequest extends OriginalFastifyRequest {
        session: {
            loginUser?: User;
        },
        body: any;
        file?: any;
        cookies?: any;
    }

    interface FastifyInstance extends OriginalFastifyInstance {
        mysql?: any;
    }
}