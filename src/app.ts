import Fastify, { type FastifyReply, type FastifyRequest } from "fastify";
import "dotenv/config";
import userRoutes from "./routes/user.route.js";
import productRoutes from "./routes/product.route.js";
import { userSchema } from "./schema/user.schema.js";
import fastifyJwt from "@fastify/jwt";
import { productSchema } from "./schema/product.schema.js";
import  { fastifySwaggerUi } from "@fastify/swagger-ui";
import fastifySwagger from "@fastify/swagger";

import pkg from "../package.json" with { type: "json" };

const { version,description,name } = pkg;


export const server = Fastify();
const PORT = Number(process.env.PORT) || 4400;

declare module "fastify" {
    export interface FastifyInstance {
        authenticate: any
    }
}

server.register(fastifyJwt, {
    secret: process.env.JWT_SECRET as string,
});

server.decorate("authenticate",
    async (request:FastifyRequest, reply:FastifyReply) => {
       try {
        await request.jwtVerify();
       } catch (error) {
        return reply.send(error)
       } 
    }
);

server.get("/healthcheck",async function () {
    return {status: "OK"}
})

async function main() {
    for (const schema of [...userSchema, ...productSchema]) {
        server.addSchema(schema);
    }

    server.register(fastifySwagger, {
    openapi: {
        info: {
        title: name,
        description,
        version,
        },
    },
});

 server.register(fastifySwaggerUi, {
  routePrefix: "/docs",
  staticCSP:true,
});

    server.register(userRoutes, {prefix: "api/users"});

    server.register(productRoutes, {prefix: "api/products"});

    try {
        await server.listen({
            port:PORT, 
            host:"0.0.0.0"
        })
        console.log(`Server ready at ${PORT}`)
    } catch (error) {
        console.error(error);
        process.exit(1)
    }
}

main();