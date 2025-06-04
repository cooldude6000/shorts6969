'use client'

import { Button } from "@/components/ui/button"
import { features } from "process"

const PricingPage = () => {

    const handleSubscription = async (priceId: string) => {
        const res = await fetch('api/stripe/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ priceId })
        })
        const data = await res.json()
        if (data.url) {
            window.location.href = data.url
        }

    }

    const plans = [
        {
            name: "Starter",
            price: "$1",
            features: ["1 Video"],
            priceId: 'price_1RVYbjPM25qIcCJylPrLwuB3'
        },
        {
            name: "Pro",
            price: "$20",
            features: ["25 videos"],
            popular: true,
            priceId: 'price_1RVYbjPM25qIcCJyLxMbyXVt'
        },
        {
            name: "Enterprise",
            price: "$99",
            features: ["150 videos"],
            priceId: 'price_1RVYbjPM25qIcCJykbf1ZISV'
        }

    ]
    return (
        <div className="min-h-screen py-12 px-4">
            <div className="max-w-6xl mx-auto text-center">
                <h2 className="text-4xl font-bold text-gray-300 mb-4">
                    Simple, transparent pricing
                </h2>
                <p className="text-xl text-grat-600 mb-12">
                    Choose the plan that's right for your dog
                </p>
                <div className="grid grid-cols-3 gap-8">
                    {plans.map((plan) => (
                        <div key={plan.name} className={`bg-white rounded-lg p-6 relative ${plan.popular ? 'ring-2 ring-blue-500' : ''}`}>
                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-br text-white from-[#3352CC] to-[#1C2D70] px-4 py-1 rounded-full text-sm font-medium">
                                    Most Popular
                                </div>
                            )}
                            <h3 className="text-2xl font-bold text-gray-900">
                                {plan.name}
                            </h3>

                            <div className="my-4">
                                <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                                <span className="text-gray-500">/one-time</span>
                            </div>

                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center">
                                        <span className="text-blue-500 mr-3">
                                            ✔
                                        </span>
                                        <span className="text-gray-700">
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                            <Button
                                onClick={() => handleSubscription(plan.priceId)}
                                className={`w-full ${plan.popular ? 'bg-gradient-to-br hover:opacity-80 text-white rounded-full from-[#3352CC] to-[#1C2D70] font-medium cursor-pointer' : 'bg-gray-800 hover:bg-gray-900 text-white cursor-pointer'}`}
                            >
                                {plan.popular ? 'Sign up' : 'GetStarted'}
                            </Button>

                        </div>
                    ))}
                </div>

            </div>
        </div>
    )
}

export default PricingPage
