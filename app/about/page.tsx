import { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'About Us - Mulago Guest House',
  description: 'Learn about Mulago Guest House, our history, mission, and commitment to exceptional hospitality.',
}

export default function AboutPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">About Mulago Guest House</h1>

        <div className="aspect-video relative rounded-lg overflow-hidden mb-8">
          <Image
            src="/about-hero.jpg"
            alt="Mulago Guest House"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="prose prose-green max-w-none">
          <h2>Our Story</h2>
          <p>
            Located in the heart of Kampala, Mulago Guest House has been providing exceptional
            hospitality services since [year]. Our commitment to excellence and attention to
            detail has made us a preferred choice for both business and leisure travelers.
          </p>

          <h2>Our Mission</h2>
          <p>
            We strive to provide our guests with a comfortable and memorable stay by offering
            modern amenities, professional service, and a welcoming atmosphere that feels like
            a home away from home.
          </p>

          <h2>Location & Accessibility</h2>
          <p>
            Strategically located near Mulago Hospital, our guest house offers easy access to
            key locations in Kampala. Whether you're here for business, medical visits, or
            leisure, you'll find our location convenient for your needs.
          </p>

          <h2>Our Facilities</h2>
          <ul>
            <li>Modern, well-appointed rooms</li>
            <li>State-of-the-art conference facilities</li>
            <li>Fully equipped gym</li>
            <li>Restaurant serving local and international cuisine</li>
            <li>Secure parking</li>
            <li>Beautiful outdoor event space</li>
          </ul>
        </div>
      </div>
    </div>
  )
}