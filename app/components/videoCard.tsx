"use client"

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AlertDialogDescription } from "@/components/ui/alert-dialog"
import { DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Copy, Download, MoreVertical, Trash2 } from "lucide-react"
import Link from "next/link"
import { useVideoActions } from "../hooks/useVideoActions"


export const VideoCard = ({ video }: { video: any }) => {
    const { handleDownload, handleCopyLink, handleDelete, isDeleting } = useVideoActions({
        videoId: video.videoId,
        videoUrl: video.videoUrl
    })
    return (
        <div className="border border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 relative">
            <Link href={`/videos/${video.videoId}`} className="block">
                <div className="aspect-video bg-gray-800 relative">
                    {video.thumbnail ? (
                        <img
                            src={video.thumbnail}
                            alt={"video thumbnail"}
                            className="object-cover w-full h-full"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <span className="text-gray-400">
                                No preview available
                            </span>
                        </div>
                    )}
                </div>
                <div className="p-4">
                    <h3 className="font-medium truncate">
                        {video.prompt || "Untitled Video"}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                        {new Date(video.createdAt).toLocaleString()}
                    </p>
                </div>
            </Link>

            <div className="absolute bottom-2 right-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 bg-black/50 hover:bg-black/70 text-white cursor-pointer"
                            onClick={(e) => e.preventDefault()}
                        >
                            <MoreVertical className="h-4 w-4 " />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48" align="end">
                        <DropdownMenuItem onClick={handleDownload} className="cursor-pointer">
                            <Download className="mr-2 h-4 w-4" />
                            <span>Download</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer">
                            <Copy className="mr-2 h-4 w-4" />
                            <span>Copy Link</span>
                        </DropdownMenuItem>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                    onSelect={(e) => e.preventDefault()}
                                    className="text-red-400 hover:bg-red-950 focus:bg-red-950 hover:text-red-400 focus:text-red-400 cursor-pointer"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    <span>Delete</span>
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete your
                                        video and remove your video from our servers.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter >
                                    <AlertDialogCancel className="rounded-full cursor-pointer">Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDelete}
                                        disabled={isDeleting}
                                        className="bg-gradient-to-br from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white rounded-full cursor-pointer"
                                    >
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}
