import { currentUser } from "@clerk/nextjs/server"
import { prisma } from "../lib/db"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { SignOutButton } from "@clerk/nextjs"
import { VideoCard } from "../components/videoCard"

const Dashboard = async () => {
    const user = await currentUser()

    if (!user) {
        return null
    }

    const videos = await prisma.video.findMany({
        where: {
            userId: user.id
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Your Videos</h1>

                <div className="flex items-center gap-2">
                    <Link href="/new">
                        <Button className="bg-gradient-to-br hover:opacity-80 text-white rounded-full from-[#3352CC] to-[#1C2D70] font-medium mx-2 cursor-pointer">
                            <Plus className="h-2 w-2" />
                            Create new
                        </Button>
                    </Link>

                    <SignOutButton>
                        <Button className='bg-black border border-gray-400 text-white  rounded-full mx-2 hover:bg-gray-900 transitioncolors duration-150  cursor-pointer'>
                            Sign Out
                        </Button>
                    </SignOutButton>
                </div>
            </div>

            {
                videos.length === 0 ? (
                    <div className="text-center py-16 bg-gray-800 rounded-lg">
                        <p className="text-xl mb-4">You havent created any videos yet</p>
                        <Link href='/new'>
                            <Button className='bg-gradient-to-br hover:opacity-80 text-white rounded-full from-[#3352CC] to-[#1C2D70] font-medium mx-2 cursor-pointer'>
                                Create your first video
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-3 gap-6">
                        {videos.map((video) => (
                            <VideoCard key={video.videoId} video={video} />
                        ))}
                    </div>
                )
            }

        </div>
    )
}

export default Dashboard