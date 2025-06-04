import { prisma } from "@/app/lib/db"
import { NextResponse } from "next/server"

export async function GET(
    request: Request,
    { params }: { params: Promise<{ videoId: string }> }
) {
    try {
        const { videoId } = await params
        const video = await prisma.video.findUnique({
            where: {
                videoId: videoId
            },
            select: {
                videoUrl: true
            }
        })

        if (!video?.videoUrl) {
            return NextResponse.json({ error: 'Video not found' }, { status: 400 })
        }

        const response = await fetch(video.videoUrl)

        if (!response.ok) {
            throw new Error('Failed to fecth the video')
        }

        const arrayBuffer = await response.arrayBuffer()

        return new NextResponse(arrayBuffer, {
            headers: {
                'Content-type': 'video/mp4',
                'Content-Disposition': `attachment; filename="video-${videoId}.mp4`,
                'Content-Length': arrayBuffer.byteLength.toString()
            }
        })
    } catch (error) {
        console.log('download error:', error)
        return NextResponse.json({ error: 'Donwlaod failed' }, { status: 500 })
    }
}