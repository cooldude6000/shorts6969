import { prisma } from "../lib/db"
import { getRenderProgress, renderMediaOnLambda } from "@remotion/lambda/client"

export const renderVideo = async (videoId: string) => {
    try {
        const data = await prisma.video.findUnique({
            where: {
                videoId: videoId
            }
        })

        if (!data) {
            return undefined
        }

        const { bucketName, renderId } = await renderMediaOnLambda({
            region: 'eu-north-1',
            functionName: 'remotion-render-4-0-311-mem2048mb-disk2048mb-120sec',
            composition: 'MyVideo',
            serveUrl: 'https://remotionlambda-eunorth1-s689byx4j6.s3.eu-north-1.amazonaws.com/sites/shorts69/index.html',
            codec: 'h264',
            inputProps: {
                imageLinks: data.imageLinks,
                audio: data.audio,
                captions: data.captions,
                durationInFrames: data.duration
            },
            framesPerLambda: 400

        })

        while (true) {
            const progress = await getRenderProgress({
                region: 'eu-north-1',
                functionName: 'remotion-render-4-0-311-mem2048mb-disk2048mb-120sec',
                renderId,
                bucketName,
            })
            if (progress.fatalErrorEncountered) {
                console.log('redner failed:', progress.errors)
            }

            if (progress.done) {
                const videoUrl = progress.outputFile ||
                    `https://${bucketName}.s3.eu-north-1.amazonaws.com/${renderId}/out.mp4`

                console.log(videoUrl)

                await prisma.video.update({
                    where: {
                        videoId: videoId
                    },
                    data: {
                        videoUrl: videoUrl,
                        processing: false
                    }
                })

                return videoUrl
            }

            const framesRendered = progress.framesRendered || 0
            const percent = Math.floor(progress.overallProgress * 100)

            console.log(`progress is ${percent} , frames rendered is ${framesRendered}`)
        }
    }
    catch (error) {
        console.error('error while generating video in remotion', error)
        throw error
    }
}