import { Room, Service } from '@/types'

export const services: Service[] = [
  {
    id: 'gym-001',
    name: 'Gym',
    image: '/amenity-gym.jpeg',
    description: 'State-of-the-art fitness center',
    fullDescription: 'Our modern gym features the latest equipment, personal trainers, and 24/7 access for guests.',
    price: 'From $5/day',
    features: ['Modern Equipment', 'Personal Trainers', '24/7 Access', 'Towel Service'],
    action: 'Book Now'
  },
  {
    id: 'conference-001',
    name: 'Conference Room',
    image: '/conference1.jpeg',
    description: 'Modern conference facilities',
    fullDescription: 'Professional conference rooms equipped with modern technology for successful business meetings.',
    price: 'From $70/day',
    features: ['HD Projector', 'Sound System', 'High-speed WiFi', 'Catering Available'],
    action: 'Book Now'
  },
  {
    id: 'restaurant-001',
    name: 'Restaurant',
    image: '/amenity-restaurant.jpeg',
    description: 'Exquisite dining experiences',
    fullDescription: 'Experience culinary excellence with our diverse menu of local and international cuisine.',
    price: 'Varies',
    features: ['Local Cuisine', 'International Menu', 'Private Dining', 'Outdoor Seating'],
    action: 'Learn More'
  },
  {
    id: 'outdoor-shelter-001',
    name: 'Outdoor Shelter',
    image: '/conference-shelter.jpeg',
    description: 'Beautiful outdoor event space',
    fullDescription: 'Experience the beauty of nature with our outdoor event space.',
    price: 'From $50/day',
    features: ['Outdoor Seating', 'Private Dining', 'Event Planning', 'Catering Available'],
    action: 'Book Now'
  }
]

export const rooms: Room[] = [
  {
    id: 'deluxe-001',
    name: 'Deluxe Suite',
    image: '/room.jpeg',
    description: 'Spacious suite with city view',
    fullDescription: 'Experience luxury in our spacious deluxe suite featuring panoramic city views and premium amenities.',
    price: 45,
    capacity: 2,
    amenities: ['King Size Bed', 'City View', 'Mini Bar', 'Free Wi-Fi'],
    images: ['/room.jpeg', '/room-detail-1.jpg', '/room-detail-2.jpg']
  },
  {
    id: 'standard-001',
    name: 'Standard Room',
    image: '/room-deluxe.jpeg',
    description: 'Comfortable room for a pleasant stay',
    fullDescription: 'Our standard rooms offer comfort and convenience with all essential amenities.',
    price: 35,
    capacity: 2,
    amenities: ['Queen Size Bed', 'Work Desk', 'Private Bathroom', 'Free Wi-Fi'],
    images: ['/room-deluxe.jpeg', '/room-standard-1.jpg', '/room-standard-2.jpg']
  },
  {
    id: 'conference-001',
    name: 'Conference',
    image: '/conference1.jpeg',
    description: 'Modern conference facilities',
    fullDescription: 'Professional conference rooms equipped with modern technology for successful business meetings.',
    price: 70,
    capacity: 70,
    amenities: ['HD Projector', 'Sound System', 'High-speed WiFi', 'Catering Available'],
    images: ['/conference1.jpeg', '/conference-detail-1.jpg', '/conference-detail-2.jpg']
  },
]