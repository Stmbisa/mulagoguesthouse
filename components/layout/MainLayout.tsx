'use client'


import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ThemeToggle from '@/components/ThemeToggle'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow">
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle />
        </div>
        {children}
      </div>
      <Footer />
    </div>
  )
}