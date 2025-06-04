import { prisma } from "./db"

export const decreaseCredits = async (userId: string) => {
    await prisma.user.update({
        where: {
            userId: userId
        },
        data: {
            credits: {
                decrement: 1
            }
        }
    })
}