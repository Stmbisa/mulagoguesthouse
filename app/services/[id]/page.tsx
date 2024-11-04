import { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { services } from '@/data'
import BookingForm from '@/components/BookingForm'
import ShareButtons from '@/components/ui/share-buttons'

interface ServicePageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const service = services.find(s => s.id === params.id)
  if (!service) return { title: 'Service Not Found' }

  return {
    title: `${service.name} - Mulago Hospital Guest House`,
    description: service.fullDescription,
    openGraph: {
      title: `${service.name} - Mulago Hospital Guest House`,
      description: service.fullDescription,
      images: [{ url: service.image }],
    },
  }
}

export async function generateStaticParams() {
  return services.map((service) => ({
    id: service.id,
  }))
}

export default function ServicePage({ params }: ServicePageProps) {
  const service = services.find(s => s.id === params.id)
  if (!service) notFound()

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">{service.name}</h1>
            <ShareButtons
              url={`${process.env.NEXT_PUBLIC_BASE_URL}/services/${service.id}`}
              title={`${service.name} - Mulago Hospital Guest House`}
              description={service.fullDescription}
            />
          </div>
          <p className="text-muted-foreground">{service.fullDescription}</p>

          <div className="aspect-video relative rounded-lg overflow-hidden">
            <Image
              src={service.image}
              alt={service.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-2">Features</h2>
            <ul className="grid grid-cols-2 gap-2">
              {service.features.map((feature, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <span>•</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="sticky top-24">
          <div className="border rounded-lg p-6">
            <div className="mb-4">
              <p className="text-2xl font-bold">{service.price}</p>
            </div>
            <BookingForm
              type="service"
              itemId={service.id}
              itemName={service.name}
            />
          </div>
        </div>
      </div>
    </div>
  )
}