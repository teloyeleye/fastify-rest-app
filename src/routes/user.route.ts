import type { FastifyInstance } from "fastify";
import { getUsersHandler, loginHandler, onboardUserHandler } from "../controller/user.controller.js";
import { $ref } from "../schema/user.schema.js";


async function userRoutes(server:FastifyInstance) {
    server.post("/onboard", {
        schema: {
            body:$ref("onboardUserSchema"),
            response: {
                201: $ref("onboardUserResponseSchema")
            }
        }
    }, 
    onboardUserHandler
)

server.post("/login", 
    {schema: {
        body:$ref("loginSchema"),
        response: {
            200: $ref("loginResponseSchema")
        }
    }}, 
    loginHandler)

server.get("/",
    {
        preHandler: [server.authenticate] // use this to guard auth each api
    },
    getUsersHandler)
}

export default userRoutes;