import { prisma } from "@/app/lib/db"
import { fail } from "assert"
import { NextResponse } from "next/server"

export async function GET(
    request: Request,
    { params }: {
        params: { videoId: string }
    }
) {
    try {
        const video = await prisma.video.findUnique({
            where: {
                videoId: params.videoId
            },
            select: {
                processing: true,
                failed: true,
                videoUrl: true
            }
        })

        if (!video) {
            return NextResponse.json({ error: 'video not found' }, { status: 404 })
        }

        return NextResponse.json({
            completed: !video.processing && !!video.videoUrl && !video.failed,
            failed: video.failed,
            processing: video.processing
        })

    } catch (error) {
        return NextResponse.json({ error: 'Internal error' }, { status: 500 })
    }
}