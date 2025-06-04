import { randomUUID } from "crypto";
import { prisma } from "../lib/db"
import { ElevenLabsClient } from "elevenlabs";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"

const client = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KE });

const s3Client = new S3Client({
    region: process.env.AWS_REGION || '',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    }
})

const bucketName = process.env.S3_BUCKET_NAME


export const generateAudio = async (videoId: string) => {
    try {
        const video = await prisma.video.findUnique({
            where: { videoId: videoId }
        })
        if (!video || !video.content) {
            return undefined
        }

        console.log('in audio now')

        const audioStream = await client.textToSpeech.convertAsStream("JBFqnCBsd6RMkjVDRZzb",
            {
                text: video.content,
                model_id: "eleven_multilingual_v2",
                output_format: "mp3_44100_128",
            }
        )

        const chunks: Buffer[] = []
        for await (const chunk of audioStream) {
            chunks.push(chunk)
        }

        const audioBuffer = Buffer.concat(chunks)
        const fileName = `${randomUUID()}.mp3`

        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: fileName,
            Body: audioBuffer,
            ContentType: "audio/mpeg"
        })

        await s3Client.send(command)

        const s3Url = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`
        console.log(s3Url)

        // const s3Url = 'https://shorts699.s3.eu-north-1.amazonaws.com/3b06934a-8472-4809-bb5e-0605416ca622.mp3'

        await prisma.video.update({
            where: {
                videoId: videoId
            },
            data: {
                audio: s3Url
            }
        })

    }
    catch (error) {
        console.error('error while generating audio', error)
        throw error
    }
}
