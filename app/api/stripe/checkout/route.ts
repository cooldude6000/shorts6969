import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-05-28.basil'
})

export async function POST(req: Request) {
    const user = await currentUser()
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { priceId } = await req.json()

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{ price: priceId, quantity: 1 }],
        mode: 'payment',
        success_url: 'https://shorts6969.vercel.app/success',
        cancel_url: 'https://shorts6969.vercel.app/cancel',
        metadata: {
            userId: user.id,
            priceId: priceId
        }
    })

    return NextResponse.json({ url: session.url })
}
