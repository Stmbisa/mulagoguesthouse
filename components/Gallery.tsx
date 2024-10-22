'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import Image from 'next/image'

// Sample image data (replace with your actual images)
const images = {
  rooms: [
    { src: '/room.jpeg', alt: 'Deluxe Room' },
    { src: '/room-deluxe.jpeg', alt: 'Standard Room' },
    { src: '/conference1.jpeg', alt: 'Suite' },
  ],
  services: [
    { src: '/services-bar.jpeg', alt: 'Bar' },
    { src: '/services-gym.jpeg', alt: 'Gym' },
    { src: '/amenity-restaurant.jpeg', alt: 'Restaurant' },
    { src: '/services-salon.jpeg', alt: 'Salon' },
    { src: '/services-parking.jpeg', alt: 'Parking' },
    { src: '/services-pool.jpeg', alt: 'Pool' },
  ],
  views: [
    { src: '/view1.jpeg', alt: 'Mulago Guest House View 1' },
    { src: '/view2.jpeg', alt: 'Mulago Guest House View 2' },
    { src: '/view3.jpeg', alt: 'Mulago Guest House View 3' },
  ],
}

const allImages = [...images.rooms, ...images.services, ...images.views]

export default function Gallery() {
  const [activeTab, setActiveTab] = useState('all')

  const getImages = () => {
    switch (activeTab) {
      case 'rooms':
        return images.rooms
      case 'services':
        return images.services
      case 'views':
        return images.views
      default:
        return allImages
    }
  }

  return (
    <section id="gallery" className="py-20 bg-background">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10 text-green-500">Our Gallery</h2>
        <Tabs defaultValue="all" onValueChange={(value) => setActiveTab(value)}>
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="rooms">Rooms</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="views">Views</TabsTrigger>
          </TabsList>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {getImages().map((image, index) => (
                <motion.div
                  key={image.src}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="relative aspect-square overflow-hidden rounded-lg shadow-lg"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-300 hover:scale-110"
                  />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </div>
    </section>
  )
}
