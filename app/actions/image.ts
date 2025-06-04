import { prisma } from "../lib/db"
import Replicate from "replicate"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { randomUUID } from "crypto";

interface ReplicateOutput {
    url: () => URL;
}

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN
})

const s3Client = new S3Client({
    region: process.env.AWS_REGION || '',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    }
})

const bucketName = process.env.S3_BUCKET_NAME

const processImage = async (img: string) => {
    try {
        const input = {
            prompt: img,
            resolution: "None",
            style_type: "Realistic",
            aspect_ratio: "9:16",
            magic_prompt_option: "On",
        }
        const output = await replicate.run("ideogram-ai/ideogram-v3-turbo", { input }) as ReplicateOutput;
        const image = output.url()
        const imageUrl = image.href
        const response = await fetch(imageUrl)
        const arrayBuffer = await response.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        const fileName = `${randomUUID()}.png`

        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: fileName,
            Body: buffer,
            ContentType: "image/png",
        })

        await s3Client.send(command)
        const s3Url = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`
        return s3Url
    }
    catch (error) {
        console.error('error while generating image from replicate', error)
        throw error
    }
}

export const generateImages = async (videoId: string) => {
    try {
        const video = await prisma.video.findUnique({
            where: {
                videoId: videoId
            }
        })
        if (!video) {
            return null
        }

        const imagePromises = video.imagePrompts.map(img => processImage(img))

        const imageLinks = await Promise.all(imagePromises)

        console.log(imageLinks)

        // const imageLinks = [
        //     'https://shorts699.s3.eu-north-1.amazonaws.com/e8b6b1a2-ce75-4b2c-8c10-2f05c49e5782.png',
        //     'https://shorts699.s3.eu-north-1.amazonaws.com/298d6f3b-db2a-410f-95ad-290cd3390ce3.png',
        //     'https://shorts699.s3.eu-north-1.amazonaws.com/2fc71ade-0dd2-4496-ac6d-404b4f72bc4a.png',
        //     'https://shorts699.s3.eu-north-1.amazonaws.com/2b72fedc-4884-4bcf-b02c-30a5457e88e5.png',
        //     'https://shorts699.s3.eu-north-1.amazonaws.com/ede07e29-dbd4-40ee-83d6-910a6153ae15.png',
        //     'https://shorts699.s3.eu-north-1.amazonaws.com/635dbdf6-147b-42db-90cd-5f9586411082.png',
        //     'https://shorts699.s3.eu-north-1.amazonaws.com/4fbb42f2-917f-4cae-8409-70091b43e272.png'
        // ]

        await prisma.video.update({
            where: {
                videoId: videoId
            },
            data: {
                imageLinks: imageLinks,
                thumbnail: imageLinks[0]
            }
        })

    }
    catch (error) {
        console.error('error while generating image:', error)
        throw error
    }
}