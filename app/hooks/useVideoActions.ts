"use client"

import { useState } from "react"
import { toast } from "sonner"
import { deleteVideo } from "../lib/deleteVideo"
import { useRouter } from "next/navigation"

interface UseVideoActionsProps {
    videoId: string
    videoUrl: string | null
    onDeleteSuccess?: () => void
}

export const useVideoActions = ({ videoId, videoUrl, onDeleteSuccess }: UseVideoActionsProps) => {
    const router = useRouter()
    const [copied, setCopied] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDownload = () => {
        if (!videoUrl) {
            toast.error("Download failed", {
                description: "Video file not available"
            })
            return
        }

        try {
            const loadingToast = toast.loading("Preparing download...", {
                description: "please wait while we prepare your video"
            })
            const a = document.createElement('a')
            a.href = `/api/download/${videoId}`
            a.download = `video-${videoId}.mp4`
            a.style.display = 'none'
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)

            setTimeout(() => {
                toast.dismiss(loadingToast)
                toast.success("Download started", {
                    description: "video saved to your device"
                })
            }, 4000)

        } catch (error) {
            console.error('download error:', error)
            toast.error('Download failed', {
                description: "unable to download video.please try again bitch"
            })
        }
    }

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(`${window.location.origin}/videos/${videoId}`)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)

            toast.success("Link copied", {
                description: "Video Link has been copied to your clipboard"
            })

        } catch (error) {
            toast.error("Copy failed", {
                description: "Unable to copy link to clipboard"
            })
        }
    }
    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            const result = await deleteVideo(videoId)
            if (!result) {
                return null
            }
            if (result.success) {
                toast.error("Video deleted", {
                    description: "Your video has been deleted succesfully"
                })
                if (onDeleteSuccess) {
                    onDeleteSuccess()
                } else {
                    router.refresh()
                }
            } else {
                toast.error("error occured", {
                    description: result.error || "unable to delete the fucking video. please try again"
                })

            }
        } catch (error) {
            toast.error("Error occured", {
                description: "unable to delete the fucking video. please try again"
            })
        } finally {
            setIsDeleting(false)
        }
    }

    return {
        handleDownload,
        handleCopyLink,
        handleDelete,
        isDeleting,
        copied
    }
}

