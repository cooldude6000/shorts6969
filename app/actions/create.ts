'use server'

import { currentUser } from "@clerk/nextjs/server"
import { randomUUID } from "crypto"
import { prisma } from "../lib/db"
import { decreaseCredits } from "../lib/decreaseCredits"
import { videoQueue } from "../lib/queue"
import { redirect } from "next/navigation"


export const createVideo = async (prompt: string) => {
    const videoId = randomUUID()
    const user = await currentUser()
    const userId = user?.id

    if (!userId) {
        return null
    }

    await prisma.video.create({
        data: {
            videoId,
            userId,
            prompt,
            processing: true
        }
    })

    await decreaseCredits(userId)


    await videoQueue.add('generate-video', { videoId })
    console.log('job added to queue succesffuly')

    return { videoId }

}

