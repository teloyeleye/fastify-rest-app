import { buildJsonSchemas } from "fastify-zod";
import { z } from "zod";

const userCoreSchema = z.object({
  email: z.preprocess(
    (v) => (v == null ? "" : v),
    z.string().min(1, "Email is required").email("Enter a valid email")),
  name: z.string(),
});

const loginSchema = z.object({
  email: z.preprocess(
    (v) => (v == null ? "" : v),
    z.string().min(1, "Email is required").email("Enter a valid email")),
  password: z.preprocess(
    (v) => (v == null ? "" : v),
    z.string().min(1, "Password is required")
  ),
});

const loginResponseSchema = z.object({
  accessToken: z.string()
});

export const onboardUserSchema = userCoreSchema.extend({
  password: z.preprocess(
    (v) => (v == null ? "" : v),
    z.string().min(1, "Password is required")
  ),
});

 const onboardUserResponseSchema = userCoreSchema.extend({
    id: z.number(),
});


export type OnboardUserInput = z.infer<typeof onboardUserSchema>;
export type LoginUserInput = z.infer<typeof loginSchema>;

export const { schemas: userSchema, $ref } = buildJsonSchemas({
  onboardUserSchema,
  onboardUserResponseSchema,
  loginSchema,
  loginResponseSchema
});
