export interface Service {
  id: string;
  name: string;
  image: string;
  description: string;
  fullDescription: string;
  price: string;
  features: string[];
  action: 'Book Now' | 'Learn More';
}

export interface Room {
  id: string;
  name: string;
  image: string;
  description: string;
  fullDescription: string;
  price: number;
  capacity: number;
  amenities: string[];
  images: string[];
}

export interface BookingDetails {
  type: 'room' | 'service';
  itemId: string;
  customerName: string;
  email: string;
  phone: string;
  checkIn?: string;
  checkOut?: string;
  numberOfGuests?: number;
  specialRequests?: string;
}