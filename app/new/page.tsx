import React from 'react'
import checkUser from '../lib/checkUser'
import CreateProject from './CreateProject'
import { userCredits } from '../lib/userCredits'

const NewPage = async () => {
    const user = await checkUser()
    const credits = await userCredits()

    return <CreateProject user={user ?? null} credits={credits} />

}

export default NewPage
