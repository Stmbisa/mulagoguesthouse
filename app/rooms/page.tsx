import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { rooms } from '@/data'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Our Rooms - Mulago Hospital Guest House',
  description: 'Browse our comfortable and luxurious rooms',
}

export default function RoomsPage() {
  return (
    <div className="container mx-auto py-20 px-4">
      <h1 className="text-3xl font-bold text-center mb-10">Our Rooms</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div key={room.id} className="bg-card rounded-lg shadow-lg overflow-hidden">
            <div className="relative h-48">
              <Image
                src={room.image}
                alt={room.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{room.name}</h2>
              <p className="text-muted-foreground mb-4">{room.description}</p>
              <p className="text-lg font-bold mb-4">${room.price} per night</p>
              <Link href={`/rooms/${room.id}`}>
                <Button className="w-full bg-green-500 hover:bg-green-600">
                  View Details & Book
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}