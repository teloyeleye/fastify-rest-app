import type { Prisma } from "../generated/prisma/client.js";
import type { CreateProductInput } from "../schema/product.schema.js";
import prisma from "../utils/prisma.js";


export async function createProductService(input: CreateProductInput) {
    const product = await prisma.product.create({
        data: input
    })
    return product;
}

export async function updateProductService(productId: number, data: Prisma.ProductUpdateInput) {
  return prisma.product.update({
    where: { id: productId },
    data,
  });
}

export async function deleteProductService(productId: number) {
  return prisma.product.delete({
    where: { id: productId },
  });
}


export async function findAllProduct() {
    return prisma.product.findMany({
        select: {
            id:true,
            title:true,
            content:true,
            price:true,
            createdAt:true,
            updatedAt:true,
            owner: {
                select: {
                    id:true,
                    name: true,
                    email:true
                }
            }
        }
    });
}


export async function findProductById(id:number) {
    return prisma.product.findUnique({
        where: {
            id
        },
        select: {
            id:true,
            title:true,
            content:true,
            price:true,
            createdAt:true,
            updatedAt:true,
            owner: {
                select: {
                    id:true,
                    name: true,
                    email:true
                }
            }
        }
    });
}

export async function findProductsByOwnerId(ownerId:number) {
    return prisma.product.findMany({
        where: {
            owner: {
                id: ownerId
            }
        },
        select: {
            id:true,
            title:true,
            content:true,
            price:true,
            createdAt:true,
            updatedAt:true,
            owner: {
                select: {
                    id:true,
                    name: true,
                    email:true
                }
            }
        }
    });
}