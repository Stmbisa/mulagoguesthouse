'use client'

import { Suspense } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

function ContactSuccessContent() {
    return (
        <div className="max-w-md mx-auto text-center space-y-6">
            <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
            <h1 className="text-3xl font-bold">Message Sent Successfully!</h1>
            <p className="text-muted-foreground">
                Thank you for contacting Mulago Hospital Guest House.
                We will get back to you as soon as possible.
            </p>
            <div className="space-y-4">
                <Link href="/">
                    <Button className="w-full">Return to Home</Button>
                </Link>
            </div>
        </div>
    )
}

export default function ContactSuccessPage() {
    return (
        <div className="container mx-auto py-20 px-4">
            <Suspense fallback={
                <div className="max-w-md mx-auto text-center space-y-6">
                    <div className="animate-pulse">
                        <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto"/>
                        <div className="h-8 bg-gray-200 rounded mt-6 mx-auto max-w-[200px]"/>
                        <div className="h-20 bg-gray-200 rounded mt-6"/>
                        <div className="h-10 bg-gray-200 rounded mt-6"/>
                    </div>
                </div>
            }>
                <ContactSuccessContent />
            </Suspense>
        </div>
    )
}