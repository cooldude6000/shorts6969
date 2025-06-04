import { Queue } from 'bullmq'
import { Redis } from 'ioredis'
import { Worker } from 'bullmq'
import { processes } from '@/app/actions/processes'
import { prisma } from '@/app/lib/db'

const connection = new Redis("rediss://default:AY6yAAIjcDFjOGI0YWE1MjFmMTg0NjhiYmMxYjVkZGU4ZDVmZDk2OHAxMA@endless-ghost-36530.upstash.io:6379", {
    maxRetriesPerRequest: null,
})

connection.on('connect', () => {
    console.log('Redis connect sucefullly')
})

connection.on('error', (err) => {
    console.log('Redis connect error:', err)
})

const worker = new Worker('video-processing', async (job) => {
    const { videoId } = job.data

    console.log(`processing video ${videoId}`)

    try {
        await processes(videoId)
        console.log(`sucesfuly processed video ${videoId}`)
    } catch (error) {
        console.error(`error while provessing the video with ${videoId}`)

        await prisma.video.update({
            where: {
                videoId: videoId
            },
            data: {
                processing: false,
                failed: true
            }
        })
        throw error
    }
}, {
    connection,
    concurrency: 2
})

worker.on('completed', (job) => {
    console.log(`${job?.id} completed `)
})

worker.on('failed', (job, err) => {
    console.log(`${job?.id} failed `, err.message)
})

worker.on('error', (err) => {
    console.log('worker error :', err)
})

console.log('worker started, waiting for jobs bruh')
console.log('connected to redis ')