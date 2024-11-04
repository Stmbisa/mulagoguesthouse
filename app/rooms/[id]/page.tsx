import { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { rooms } from '@/data'
import BookingForm from '@/components/BookingForm'
import ShareButtons from '@/components/ui/share-buttons'

interface RoomPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: RoomPageProps): Promise<Metadata> {
  const room = rooms.find(r => r.id === params.id)
  if (!room) return { title: 'Room Not Found' }

  return {
    title: `${room.name} - Mulago Hospital Guest House`,
    description: room.fullDescription,
    openGraph: {
      title: `${room.name} - Mulago Hospital Guest Houseest House`,
      description: room.fullDescription,
      images: [{ url: room.image }],
    },
  }
}

export async function generateStaticParams() {
  return rooms.map((room) => ({
    id: room.id,
  }))
}

export default function RoomPage({ params }: RoomPageProps) {
  const room = rooms.find(r => r.id === params.id)
  if (!room) notFound()

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">{room.name}</h1>
            <ShareButtons
              url={`${process.env.NEXT_PUBLIC_BASE_URL}/rooms/${room.id}`}
              title={`${room.name} - Mulago Hospital Guest House`}
              description={room.fullDescription}
            />
          </div>
          <p className="text-muted-foreground">{room.fullDescription}</p>

          <div className="aspect-video relative rounded-lg overflow-hidden">
            <Image
              src={room.image}
              alt={room.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {room.images.slice(1).map((image, index) => (
              <div key={index} className="aspect-video relative rounded-lg overflow-hidden">
                <Image
                  src={image}
                  alt={`${room.name} view ${index + 2}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          <div className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-2">Amenities</h2>
            <ul className="grid grid-cols-2 gap-2">
              {room.amenities.map((amenity, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <span>•</span>
                  <span>{amenity}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="sticky top-24">
          <div className="border rounded-lg p-6">
            <div className="mb-4">
              <p className="text-2xl font-bold">${room.price}</p>
              <p className="text-muted-foreground">per night</p>
            </div>
            <BookingForm
              type="room"
              itemId={room.id}
              itemName={room.name}
            />
          </div>
        </div>
      </div>
    </div>
  )
}