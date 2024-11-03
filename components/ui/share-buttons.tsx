'use client'

import { Button } from '@/components/ui/button'
import { Share2, Facebook, Twitter, Send } from 'lucide-react'
import { useState } from 'react'

interface ShareButtonsProps {
  url: string
  title: string
  description: string
}

export default function ShareButtons({ url, title, description }: ShareButtonsProps) {
  const [isOpen, setIsOpen] = useState(false)

  const shareData = {
    title,
    text: description,
    url,
  }

  const handleShare = async (platform?: string) => {
    try {
      if (platform) {
        let shareUrl = ''
        switch (platform) {
          case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
            break
          case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
            break
          case 'whatsapp':
            shareUrl = `https://wa.me/?text=${encodeURIComponent(`${title}\n\n${description}\n\n${url}`)}`
            break
        }
        window.open(shareUrl, '_blank')
      } else if (navigator.share) {
        await navigator.share(shareData)
      }
    } catch (error) {
      console.error('Error sharing:', error)
    }
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2"
      >
        <Share2 size={16} />
        Share
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 p-2 bg-background border rounded-lg shadow-lg z-10 flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleShare('facebook')}
            className="gap-2"
          >
            <Facebook size={16} />
            Facebook
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleShare('twitter')}
            className="gap-2"
          >
            <Twitter size={16} />
            Twitter
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleShare('whatsapp')}
            className="gap-2"
          >
            <Send size={16} />
            WhatsApp
          </Button>

          {typeof navigator.share === 'function' && (
            <Button
                variant="ghost"
                size="sm"
                onClick={() => handleShare()}
                className="gap-2"
            >
                <Share2 size={16} />
                More
            </Button>
            )}
        </div>
      )}
    </div>
  )
}