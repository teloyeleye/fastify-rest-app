import type { FastifyInstance } from "fastify";
import { $ref } from "../schema/product.schema.js";
import { createProductHandler, getAllProductHandler, getProductByIdHandler, getProductByOwnerIdHandler } from "../controller/product.controller.js";


async function productRoutes(server:FastifyInstance) {
        server.post("/create", {
            preHandler: [server.authenticate],
            schema: {
                body:$ref("createProductSchema"),
                response: {
                    201: $ref("productResponseSchema")
                }
            }
        }, 
        createProductHandler
    )

    server.get("/",
        {},
        getAllProductHandler)

    server.get("/:id",
        {
            preHandler: [server.authenticate]
        },
        getProductByIdHandler)

    server.get("/owner/:ownerId",
        {
            preHandler: [server.authenticate],
            schema: {
                response: {
                    201: $ref("allProductResponseSchema")
                }
            }
        },
        getProductByOwnerIdHandler)

}

export default productRoutes;