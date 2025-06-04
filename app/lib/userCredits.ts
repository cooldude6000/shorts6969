import { currentUser } from "@clerk/nextjs/server"
import { prisma } from "./db"

export const userCredits = async () => {
    const user = await currentUser()
    const userId = user?.id
    if (!userId) {
        return 0
    }

    const data = await prisma.user.findUnique({
        where: {
            userId: userId
        }
    })

    if (!data) {
        return 0
    }

    return data.credits
}