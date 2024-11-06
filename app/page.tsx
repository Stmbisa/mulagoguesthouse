'use client'

import dynamic from 'next/dynamic'
import ContactForm from '@/components/ContactForm'

const Hero = dynamic(() => import('@/components/Hero'), {
  loading: () => <div>Loading...</div>,
  ssr: false
})

const Services = dynamic(() => import('@/components/Services'), {
  loading: () => <div>Loading...</div>,
  ssr: false
})

const Rooms = dynamic(() => import('@/components/Rooms'), {
  loading: () => <div>Loading...</div>,
  ssr: false
})

const Gallery = dynamic(() => import('@/components/Gallery'), {
  loading: () => <div>Loading...</div>,
  ssr: false
})

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <Rooms />
      <Gallery />
      <div className="bg-gradient-to-b from-background via-green-50/50 to-background dark:via-green-950/50">
        <ContactForm />
      </div>
    </>
  )
}
