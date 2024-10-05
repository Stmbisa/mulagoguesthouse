import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative h-[70vh] md:h-screen flex items-center justify-center text-center">
      <Image
        src="/hero-background.jpg"
        alt="Mulago Guest House"
        fill
        style={{ objectFit: 'cover' }}
        quality={100}
        priority
      />
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="relative z-10 space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold text-white">Welcome to Mulago Guest House</h1>
        <p className="text-xl text-white/80">Experience comfort and hospitality in the heart of Kampala</p>
        <Link href="#services">
          <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white text-lg px-8 py-3">Explore Our Services</Button>
        </Link>
      </div>
    </section>
  )
}