import { currentUser } from "@clerk/nextjs/server"
import { prisma } from "./db"

const checkUser = async () => {
    const user = await currentUser()
    if (user) {
        const userId = user.id
        const email = user.primaryEmailAddress?.emailAddress
        const exsistingUser = await prisma.user.findUnique({
            where: {
                userId: userId
            }
        })
        if (!exsistingUser) {
            await prisma.user.create({
                data: {
                    userId: userId,
                    email: email ?? ''
                }
            })
        }
        return user.id
    }
    else if (!user) {
        return null
    }

}

export default checkUser