import type { FastifyReply, FastifyRequest } from "fastify";
import { updateProductBodySchema, type CreateProductInput, type UpdateProductInput } from "../schema/product.schema.js";
import { createProductService, deleteProductService, findAllProduct, findProductById, findProductsByOwnerId, updateProductService } from "../service/product.service.js";
import { findUserById } from "../service/user.service.js";

type Params = { id: number };


export async function createProductHandler(
    request: FastifyRequest<{Body:CreateProductInput}>, 
    reply: FastifyReply
) {
    const body = request.body;
    try {
        const user = await findUserById(Number(body.ownerId));

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


export async function updateProductHandler(
  request: FastifyRequest<{ Params: Params; Body: UpdateProductInput }>,
  reply: FastifyReply
) {
  const productId = Number(request.params.id);

  // Prefer auth-derived user id, adjust to your auth payload shape
  const ownerId = Number((request.user as any).id);

  try {
    const product = await findProductById(productId);
    if (!product) return reply.code(404).send({ message: "Product not found!" });

    if (Number(product.owner.id) !== ownerId) {
      return reply.code(403).send({ message: "User is not authorized to update product." });
    }

    // Validate body if you aren't relying on Fastify schema validation
    const body = updateProductBodySchema.parse(request.body);

    // PATCH: only include keys that were sent
    const data: any = {};
    if ("title" in body) data.title = body.title;       // includes null if allowed
    if ("content" in body) data.content = body.content; // includes null if allowed
    if ("price" in body) data.price = body.price;       // includes null if allowed

    // Optional: reject empty patch
    if (Object.keys(data).length === 0) {
      return reply.code(400).send({ message: "No fields provided to update." });
    }

    const updated = await updateProductService(productId, data);
    return reply.code(200).send(updated);
  } catch (error) {
    console.log(error);
    return reply.code(500).send({ message: "Internal server error" });
  }
}

export async function deleteProductHandler(
  request: FastifyRequest<{ Params: Params }>,
  reply: FastifyReply
) {
  const productId = Number(request.params.id);

  // Prefer auth-derived user id, adjust to your auth payload shape
  const ownerId = Number((request.user as any).id);

  try {
    const product = await findProductById(productId);
    if (!product) return reply.code(404).send({ message: "Product not found!" });

    if (Number(product.owner.id) !== ownerId) {
      return reply.code(403).send({ message: "User is not authorized to delete product." });
    }

    const deleteProd = await deleteProductService(productId);
    return reply.code(200).send({
        message: "Product deleted"
    });
  } catch (error) {
    console.log(error);
    return reply.code(500).send({ message: "Internal server error" });
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
