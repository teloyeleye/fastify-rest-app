import { buildJsonSchemas } from "fastify-zod";
import z from "zod";


const productCoreSchema = z.object({
  title: z.preprocess(
      (v) => (v == null ? "" : v),
      z.string().min(1, "Title is required")
  ),
  content: z.preprocess(
    (v) => (v == null || v === "" ? null : v),
    z.string().min(1).nullable()
  ), // nullable
  price:  z.coerce.number().min(1, "Price is required"),
  ownerId:  z.number().min(1, "Owner ID is required"),
});


export const updateProductParamsSchema = z.object({
  id: z.coerce.number().min(1),
});

export const updateProductBodySchema = z
  .object({
    title: z.string().min(1).optional(),
    content: z.string().min(1).optional(),
    price: z.coerce.number().min(1).optional(),
  })
  .strict();



const createProductSchema = productCoreSchema;

 const productResponseSchema = productCoreSchema.extend({
    id: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

 const allProductResponseSchema = z.array(productResponseSchema);

 export type CreateProductInput = z.infer<typeof createProductSchema>;
 export type UpdateProductInput = z.infer<typeof updateProductBodySchema>;

export const { schemas: productSchema, $ref } = buildJsonSchemas({
  createProductSchema,
  productResponseSchema,
  allProductResponseSchema,
  // add these:
  updateProductParamsSchema,
  updateProductBodySchema,
}, { $id: "productSchema" });