'use client'

import React, { useState, useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'

export default function Hero() {
  const [scrollPosition, setScrollPosition] = useState(0)
  const controls = useAnimation()

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY
      setScrollPosition(position)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const calculateHeight = (baseHeight: number, maxScroll = 500) => {
    const growFactor = Math.min(scrollPosition / maxScroll, 1)
    return baseHeight * (1 - growFactor)
  }

  return (
    <section className="relative h-screen flex items-center justify-center text-center overflow-hidden">
      <Image
        src="/view1.jpeg"
        alt="Mulago Guest House night view"
        fill
        style={{ objectFit: 'cover' }}
        quality={100}
        priority
      />
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-blue-900 to-green-900 opacity-80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ duration: 1 }}
      ></motion.div>

      {/* Animated stars/particles */}
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: Math.random(),
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
      ))}

      {/* Floating moon */}
      <motion.div
        className="absolute right-16 rounded-full bg-yellow-100 w-24 h-24"
        style={{
          top: `${20 + scrollPosition * 0.05}px`,
        }}
      />

      {/* Animated City */}
      <svg
        className="absolute bottom-0 w-full"
        viewBox="0 0 1000 400"
        preserveAspectRatio="none"
      >
        {/* Background buildings */}
        {[...Array(11)].map((_, i) => (
          <rect
            key={`building-${i}`}
            x={i * 90}
            y={calculateHeight(400 - (i % 3) * 20)}
            width="80"
            height={400 - (i % 3) * 20}
            className={`fill-green-${700 + (i % 2) * 100}`}
          />
        ))}

        {/* Windows */}
        {[...Array(11)].map((_, buildingIndex) => (
          [...Array(8)].map((_, windowRow) => (
            [...Array(4)].map((_, windowCol) => (
              <rect
                key={`${buildingIndex}-${windowRow}-${windowCol}`}
                x={10 + buildingIndex * 90 + windowCol * 12}
                y={calculateHeight(390 - windowRow * 40)}
                width="8"
                height="8"
                className="fill-yellow-300 opacity-75"
              />
            ))
          ))
        ))}

        {/* Ground */}
        <rect x="0" y="399" width="1000" height="1" className="fill-green-900" />
      </svg>

      <div className="relative z-10 space-y-4">
        <motion.h1
          className="text-4xl md:text-6xl font-bold text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Welcome to Mulago Guest House
        </motion.h1>
        <motion.p
          className="text-xl text-white/80"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Experience comfort and hospitality in the heart of Kampala
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Link href="#services">
            <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white text-lg px-8 py-3">
              Explore Our Services
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white text-center animate-bounce">
        <p className="text-sm">Scroll to explore</p>
        <div className="mt-2 w-6 h-6 border-2 border-white rounded-full mx-auto">
          <div className="w-1 h-3 bg-white mx-auto mt-1 rounded-full" />
        </div>
      </div>
    </section>
  )
}
