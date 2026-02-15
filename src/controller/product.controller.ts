import type { FastifyReply, FastifyRequest } from "fastify";
import type { CreateProductInput } from "../schema/product.schema.js";
import { createProductService, findAllProduct, findProductById, findProductsByOwnerId } from "../service/product.service.js";
import { findUserById } from "../service/user.service.js";

export async function createProductHandler(
    request: FastifyRequest<{Body:CreateProductInput}>, 
    reply: FastifyReply
) {
    const body = request.body;
    try {
        const user = await findUserById(body.ownerId);

        if (!user) {
            return reply.code(401).send({
                message: "User not found!"
            })
        }

        const product = await createProductService(body);
        return reply.code(201).send(product)
    } catch (error) {
        console.log(error);
        return reply.code(500).send(error)
    }
}

export async function getAllProductHandler() {
    const products = await findAllProduct();
    return products;
}

export async function getProductByIdHandler(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const { id } = request.params;
  const product = await findProductById(Number(id));
  if (!product) {
    return reply.code(404).send({
                message: "Product not found!"
            })
  }
  return product;
}

export async function getProductByOwnerIdHandler(
  request: FastifyRequest<{ Params: { ownerId: string } }>,
  reply: FastifyReply
) {
  const { ownerId } = request.params;

  try {
    const user = await findUserById(Number(ownerId));

        if (!user) {
            return reply.code(401).send({
                message: "User not found!"
            })
        }

    const products = await findProductsByOwnerId(Number(ownerId));
    if (!products) {
        return reply.code(404).send({
                    message: "Products not found!"
                })
    }
    return products;
  } catch (error) {
    console.log(error);
    return reply.code(500).send(error)
  }
  
}
