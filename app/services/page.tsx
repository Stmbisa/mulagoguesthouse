import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { services } from '@/data'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Our Services - Mulago Guest House',
  description: 'Explore our range of services and amenities',
}

export default function ServicesPage() {
  return (
    <div className="container mx-auto py-20 px-4">
      <h1 className="text-3xl font-bold text-center mb-10">Our Services</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service.id} className="bg-card rounded-lg shadow-lg overflow-hidden">
            <div className="relative h-48">
              <Image
                src={service.image}
                alt={service.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{service.name}</h2>
              <p className="text-muted-foreground mb-4">{service.description}</p>
              <p className="text-lg font-bold mb-4">{service.price}</p>
              <Link href={`/services/${service.id}`}>
                <Button
                  className={`w-full ${
                    service.action === 'Book Now'
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                >
                  {service.action}
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}