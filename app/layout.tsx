/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Metadata } from "next";
import dynamic from 'next/dynamic'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Inter } from "next/font/google";
import Header from '@/components/Header'
import Footer from '@/components/Footer'
const ThemeToggle = dynamic(() => import('@/components/ThemeToggle'), { ssr: false })
// import MainLayout from "@/components/layout/MainLayout";

const inter = Inter({ subsets: ["latin"] });

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  metadataBase: new URL('https://mulagohospitalguesthouse.com'),
  title: 'Mulago Hospital Guest House',
  description: 'Mulago Hospital Guest House is a luxurious serene and comfortable place for your stay.',
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
            <ThemeToggle />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
