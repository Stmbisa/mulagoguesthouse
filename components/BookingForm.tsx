'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { BookingDetails } from '@/types'
import { toast } from 'sonner'

interface BookingFormProps {
  type: 'room' | 'service'
  itemId: string
  itemName: string
}

export default function BookingForm({ type, itemId, itemName }: BookingFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const bookingDetails: BookingDetails = {
      type,
      itemId,
      customerName: formData.get('customerName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      specialRequests: formData.get('specialRequests') as string,
    }

    if (type === 'room') {
      bookingDetails.checkIn = formData.get('checkIn') as string
      bookingDetails.checkOut = formData.get('checkOut') as string
      bookingDetails.numberOfGuests = parseInt(formData.get('numberOfGuests') as string)
    }

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingDetails),
      })

      if (!response.ok) throw new Error('Booking failed')

      toast.success('Booking submitted successfully! We will contact you shortly.')
      e.currentTarget.reset()
    } catch (error) {
      toast.error('Failed to submit booking. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-semibold">Book {itemName}</h3>

      <Input
        name="customerName"
        placeholder="Your Name"
        required
      />

      <Input
        name="email"
        type="email"
        placeholder="Email Address"
        required
      />

      <Input
        name="phone"
        type="tel"
        placeholder="Phone Number"
        required
      />

      {type === 'room' && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <Input
              name="checkIn"
              type="date"
              required
            />
            <Input
              name="checkOut"
              type="date"
              required
            />
          </div>

          <Input
            name="numberOfGuests"
            type="number"
            min="1"
            placeholder="Number of Guests"
            required
          />
        </>
      )}

      <Textarea
        name="specialRequests"
        placeholder="Special Requests (optional)"
        rows={3}
      />

      <Button
        type="submit"
        className="w-full bg-green-500 hover:bg-green-600"
        disabled={isLoading}
      >
        {isLoading ? 'Submitting...' : 'Submit Booking'}
      </Button>
    </form>
  )
}