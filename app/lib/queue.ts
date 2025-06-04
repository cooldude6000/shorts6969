import { Queue } from 'bullmq'
import { Redis } from 'ioredis'

const connection = new Redis("redis://default:AY6yAAIjcDFjOGI0YWE1MjFmMTg0NjhiYmMxYjVkZGU4ZDVmZDk2OHAxMA@endless-ghost-36530.upstash.io:6379", {
    maxRetriesPerRequest: null,
})

connection.on('connect', () => {
    console.log('Redis connect sucefullly')
})

connection.on('error', (err) => {
    console.log('Redis connect error:', err)
})

connection.on('ready', () => {
    console.log('Redis ready')
})

export const videoQueue = new Queue('video-processing', {
    connection,
    defaultJobOptions: {
        removeOnComplete: 10,
        removeOnFail: 5,
    }
})


