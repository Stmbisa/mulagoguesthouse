import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between py-4">
        <Link href="/">
          <div className="flex items-center space-x-2">
            <Image src="/logo.png" alt="Mulago Guest House Logo" width={40} height={40} />
            <span className="text-2xl font-bold text-green-500 hidden sm:inline">Mulago Guest House</span>
          </div>
        </Link>
        <nav className="hidden md:block">
          <ul className="flex space-x-4">
            <li><Link href="#services" className="text-green-500 hover:text-green-600">Services</Link></li>
            <li><Link href="#rooms" className="text-green-500 hover:text-green-600">Rooms</Link></li>
            <li><Link href="#contact" className="text-green-500 hover:text-green-600">Contact</Link></li>
          </ul>
        </nav>
        <div className="flex items-center space-x-4">
          <Button className="bg-green-500 hover:bg-green-600 text-white">Book Now</Button>
          <button className="md:hidden" onClick={toggleMenu}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <nav className="bg-background py-4">
            <ul className="flex flex-col items-center space-y-4">
              <li><Link href="#services" className="text-green-500 hover:text-green-600">Services</Link></li>
              <li><Link href="#rooms" className="text-green-500 hover:text-green-600">Rooms</Link></li>
              <li><Link href="#contact" className="text-green-500 hover:text-green-600">Contact</Link></li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  )
}