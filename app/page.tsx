'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import dynamic from 'next/dynamic'

// Dynamically import components with ssr option set to false
const Hero = dynamic(() => import('@/components/Hero'), { ssr: false })
const Services = dynamic(() => import('@/components/Services'), { ssr: false })
const Rooms = dynamic(() => import('@/components/Rooms'), { ssr: false })
const Gallery = dynamic(() => import('@/components/Gallery'), { ssr: false })
const ThemeToggle = dynamic(() => import('@/components/ThemeToggle'), { ssr: false })

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <Services />
        <Rooms />
        <Gallery />
      </main>
      <Footer />
      <ThemeToggle />
    </div>
  )
}
