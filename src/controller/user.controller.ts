import type { FastifyReply, FastifyRequest } from "fastify";
import type { LoginUserInput, OnboardUserInput } from "../schema/user.schema.js";
import { findUserByEmail, findUsers, onboardUserService } from "../service/user.service.js";
import { verifyPassword } from "../utils/hash.js";
import { server } from "../app.js";

export async function onboardUserHandler(
    request: FastifyRequest<{Body:OnboardUserInput}>, 
    reply: FastifyReply
) {
    const body = request.body;

    try {
        const user = await onboardUserService(body);
        return reply.code(201).send(user)
    } catch (error) {
        console.log(error);
        return reply.code(500).send(error)
    }
}

export async function loginHandler(
    request: FastifyRequest<{Body:LoginUserInput}>, 
    reply: FastifyReply) {
    const body = request.body;

    // find by user email
    const user = await findUserByEmail(body.email);

    if (!user) {
        return reply.code(401).send({
            message: "Invalid email or password"
        })
    }

    // verify password
    const correctPassword = verifyPassword({
        password:body.password,
        salt:user.salt,
        hash:user.password
    })

    if (correctPassword) {
        const {password,salt,...rest}=user;
        return {accessToken: server.jwt.sign(rest,
            {expiresIn: "2h"})}
    }

    return reply.code(401).send({
        message: "Invalid email or password"
    })
}

export async function getUsersHandler() {
    const users = await findUsers();

    return users;
}

 