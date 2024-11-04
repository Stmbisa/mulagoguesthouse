'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'

const services = [
  { name: 'Gym', image: '/amenity-gym.jpeg', description: 'State-of-the-art fitness center', action: 'Book Now', id: 'gym-001' },
  { name: 'Parking', image: '/parking.jpeg', description: 'Secure and convenient parking', action: 'Learn More', id: 'parking-001' },
  { name: 'Conference', image: '/conference1.jpeg', description: 'Modern conference facilities', action: 'Book Now', id: 'conference-001' },
  { name: 'Restaurant', image: '/amenity-restaurant.jpeg', description: 'Exquisite dining experiences', action: 'Learn More', id: 'restaurant-001' },
  { name: 'Outdoor Shelter', image: '/conference-shelter.jpeg', description: 'Beautiful outdoor event space', action: 'Book Now', id: 'outdoor-shelter-001' },
]

export default function Services() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % services.length)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + services.length) % services.length)
  }, [])

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000) // Auto-slide every 5 seconds
    return () => clearInterval(interval)
  }, [nextSlide])

  return (
    <section id="services" className="py-20 bg-muted">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">Our Services</h2>
        <div className="relative h-[500px] md:h-[600px] overflow-hidden">
          <AnimatePresence initial={false} custom={currentIndex}>
            <motion.div
              key={currentIndex}
              custom={currentIndex}
              variants={{
                enter: (direction) => ({ x: direction > 0 ? 1000 : -1000, opacity: 0 }),
                center: { x: 0, opacity: 1 },
                exit: (direction) => ({ x: direction < 0 ? 1000 : -1000, opacity: 0 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="bg-card rounded-lg shadow-lg overflow-hidden max-w-2xl w-full">
                <div className="relative h-64 md:h-80">
                  <Image
                    src={services[currentIndex].image}
                    alt={services[currentIndex].name}
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                    fill
                  />
                  <div className="absolute inset-0 bg-black/30"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-semibold mb-2">{services[currentIndex].name}</h3>
                  <p className="text-muted-foreground mb-4">{services[currentIndex].description}</p>
                  <Link href={`/services/${services[currentIndex].id}`}>
                    <Button
                      className={`text-lg px-6 py-2 ${
                        services[currentIndex].action === 'Book Now'
                          ? 'bg-green-500 hover:bg-green-600 text-white'
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                    >
                      {services[currentIndex].action}
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
          >
            <ChevronLeft />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </section>
  )
}
