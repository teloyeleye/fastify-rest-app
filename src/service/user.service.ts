import type { OnboardUserInput } from "../schema/user.schema.js";
import { hashPassword } from "../utils/hash.js";
import prisma from "../utils/prisma.js";

export async function onboardUserService(input: OnboardUserInput) {
    const {password, ...rest} = input;
    const {hash,salt}= hashPassword(password);

    const user = await prisma.user.create({
        data: {...rest, password:hash, salt,}
    })

    return user;
}

export async function findUserByEmail(email:string) {
    return prisma.user.findUnique({
        where: {
            email
        }
    })
}

export async function findUserById(id:number) {
    return prisma.user.findFirst({
        where: {
            id
        }
    })
}

export async function findUsers() {
    return prisma.user.findMany({
        select: {
            id:true,
            email:true,
            name:true,
        }
    });
}