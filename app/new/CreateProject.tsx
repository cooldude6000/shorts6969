"use client"

import { Button } from '@/components/ui/button'
import { SignInButton, SignUpButton } from '@clerk/nextjs'
import Link from 'next/link'
import React, { useState } from 'react'
import { Cover } from "@/components/ui/cover";
import { ShineBorder } from '@/components/magicui/shine-border';
import { PlaceholdersAndVanishInput } from '@/components/ui/placeholders-and-vanish-input';
import TooltipCredits from '../components/creditsButton'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'
import { createVideo } from '../actions/create'

const CreateProject = ({ user, credits }: { user: string | null; credits: number }) => {
    const router = useRouter()
    const placeholders = [
        "What's the first rule of Fight Club?",
        "Who is Tyler Durden?",
        "Where is Andrew Laeddis Hiding?",
        "Write a Javascript method to reverse a string",
        "How to assemble your own PC?",
    ];
    const [prompt, setPrompt] = useState("")
    const [showLoginDialog, setShowLoginDialog] = useState(false)
    const [showCreditsDialog, setShowCreditsDialog] = useState(false)
    return (
        <div className='w-screen h-screen flex flex-col'>
            {
                !user &&
                <div className='flex justify-end gap-1 mr-7 mt-5'>
                    <SignInButton>
                        <Button className='bg-black border border-gray-400 text-white  rounded-full mx-2 hover:bg-gray-900 transitioncolors duration-150  cursor-pointer'>
                            Sign In
                        </Button>
                    </SignInButton>
                    <SignUpButton>
                        <Button className='bg-gradient-to-br hover:opacity-80 text-white rounded-full from-[#3352CC] to-[#1C2D70] font-medium cursor-pointer'>
                            Sign up
                        </Button>
                    </SignUpButton>
                </div>
            }
            {user &&
                <div className='flex justify-end mr-7 mt-5'>
                    <TooltipCredits credits={credits} />
                    <Link href={"/dashboard"}>
                        <Button className='bg-gradient-to-br hover:opacity-80 text-white rounded-full from-[#3352CC] to-[#1C2D70] font-medium mx-2 cursor-pointer'>
                            Dashboard
                        </Button>
                    </Link>
                </div>
            }

            <h1 className="text-4xl md:text-4xl lg:text-6xl font-semibold max-w-7xl mx-auto text-center mt-6 relative z-20 py-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white">
                Generate realistic short
                <div className='h-6'></div>
                <Cover>warp speed</Cover>
            </h1>

            <div className='flex justify-center mt-auto mb-[400px]'>
                <div className='relative rounded-3xl w-[500px] overflow-hidden'>
                    <ShineBorder
                        className='z-10'
                        shineColor={["#3352CC", "#3352CC", "#3352CC", "#3352CC"]}

                    />
                    <PlaceholdersAndVanishInput
                        placeholders={placeholders}
                        onChange={(e) => setPrompt(e.target.value)}
                        onSubmit={(e) => {
                            e.preventDefault()
                            if (!user) {
                                return setTimeout(() => setShowLoginDialog(true), 1000)
                            }
                            if (credits < 1) {
                                return setTimeout(() => setShowCreditsDialog(true), 700)
                            }
                            createVideo(prompt)
                        }}
                    />
                </div>

                <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
                    <DialogContent className='sm-max-w-[425px]'>
                        <DialogHeader>
                            <DialogTitle>Hello There!</DialogTitle>
                            <DialogDescription>Please sing in to create videos</DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <SignInButton>
                                <Button className='bg-black border border-gray-400 text-white  rounded-full mx-2 hover:bg-gray-900 transitioncolors duration-150  cursor-pointer'>
                                    Sign In
                                </Button>
                            </SignInButton>
                            <SignUpButton>
                                <Button className='bg-gradient-to-br hover:opacity-80 text-white rounded-full from-[#3352CC] to-[#1C2D70] font-medium cursor-pointer'>
                                    Sign up
                                </Button>
                            </SignUpButton>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Dialog open={showCreditsDialog} onOpenChange={setShowCreditsDialog}>
                    <DialogContent className='sm:max-w-[425px]'>
                        <DialogHeader>
                            <DialogTitle>
                                <div className='text-red-500'>Out of credits</div>
                            </DialogTitle>
                            <DialogDescription>
                                Please add some credits to create videos
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button
                                className='bg-gradient-to-br hover:opacity-80 text-white rounded-full from-[#3352CC] to-[#1C2D70] font-medium cursor-pointer'

                                onClick={() => {
                                    router.push('/pricing')
                                    setShowCreditsDialog(false)
                                }}
                            >
                                Go to pricing
                            </Button>
                            <Button
                                variant="outline"
                                className='rounded-full cursor-pointer'
                                onClick={() => setShowCreditsDialog(false)}
                            >
                                Close
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>


            </div>


        </div>
    )
}

export default CreateProject
