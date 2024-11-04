'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import dynamic from 'next/dynamic'
import ContactForm from '@/components/ContactForm'

// Dynamically import components with ssr option set to false
const Hero = dynamic(() => import('@/components/Hero'), { ssr: false })
const Services = dynamic(() => import('@/components/Services'), { ssr: false })
const Rooms = dynamic(() => import('@/components/Rooms'), { ssr: false })
const Gallery = dynamic(() => import('@/components/Gallery'), { ssr: false })
const ThemeToggle = dynamic(() => import('@/components/ThemeToggle'), { ssr: false })

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Services />
        <Rooms />
        <Gallery />
        <div className="bg-gradient-to-b from-background via-green-50/50 to-background dark:via-green-950/50">
          <ContactForm />
        </div>
      </main>
      <Footer />
      <ThemeToggle />
    </div>
  )
}
