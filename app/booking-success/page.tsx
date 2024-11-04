'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

// Create a separate component for the content that uses useSearchParams
function BookingSuccessContent() {
    const searchParams = useSearchParams()
    const type = searchParams.get('type')
    const name = searchParams.get('name')

    return (
        <div className="max-w-md mx-auto text-center space-y-6">
            <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
            <h1 className="text-3xl font-bold">Booking Confirmed!</h1>
            <p className="text-muted-foreground">
                Thank you for booking {type === 'room' ? 'a room' : 'our'} {name} at Mulago Hospital Guest House.
                We will contact you shortly to confirm your booking details.
            </p>
            <div className="space-y-4">
                <Link href="/">
                    <Button className="w-full">Return to Home</Button>
                </Link>
            </div>
        </div>
    )
}

// Main page component with Suspense
export default function BookingSuccessPage() {
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
                <BookingSuccessContent />
            </Suspense>
        </div>
    )
}