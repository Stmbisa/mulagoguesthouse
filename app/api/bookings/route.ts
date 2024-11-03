import { NextResponse } from 'next/server'
import twilio from 'twilio'
import nodemailer from 'nodemailer'
import { BookingDetails } from '@/types'
import { rooms } from '@/data'
import { services } from '@/data'

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

const emailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

export async function POST(request: Request) {
  try {
    const booking: BookingDetails = await request.json()
    const item = booking.type === 'room'
      ? rooms.find(r => r.id === booking.itemId)
      : services.find(s => s.id === booking.itemId)

    if (!item) {
      return NextResponse.json(
        { error: 'Invalid item ID' },
        { status: 400 }
      )
    }

    // Create detailed message
    const whatsappMessage = `
New Booking at Mulago Guest House!

Type: ${booking.type.toUpperCase()}
Item: ${item.name}
Price: ${typeof item.price === 'number' ? `$${item.price}` : item.price}

Customer Details:
- Name: ${booking.customerName}
- Email: ${booking.email}
- Phone: ${booking.phone}
${booking.type === 'room' ? `
- Check-in: ${booking.checkIn}
- Check-out: ${booking.checkOut}
- Guests: ${booking.numberOfGuests}` : ''}
${booking.specialRequests ? `
Special Requests: ${booking.specialRequests}` : ''}

Please contact the customer to confirm the booking.
    `.trim()

    // Send WhatsApp notifications
    const whatsappNumbers = process.env.NOTIFICATION_WHATSAPP_NUMBERS?.split(',') || []
    await Promise.all(
      whatsappNumbers.map(number =>
        twilioClient.messages.create({
          body: whatsappMessage,
          from: process.env.TWILIO_WHATSAPP_FROM,
          to: number.trim()
        })
      )
    )

    // Send email notifications
    const emailAddresses = process.env.NOTIFICATION_EMAIL_ADDRESSES?.split(',') || []
    const emailMessage = createEmailMessage(booking)

    await Promise.all(
      emailAddresses.map(email =>
        emailTransporter.sendMail({
          from: process.env.SMTP_USER,
          to: email.trim(),
          subject: `New Booking: ${booking.type === 'room' ? 'Room' : 'Service'} Booking`,
          text: emailMessage,
          html: createEmailHTML(booking),
        })
      )
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Booking error:', error)
    return NextResponse.json(
      { error: 'Failed to process booking' },
      { status: 500 }
    )
  }
}

function createWhatsAppMessage(booking: BookingDetails): string {
    return `
  New ${booking.type} Booking!

  Customer: ${booking.customerName}
  Email: ${booking.email}
  Phone: ${booking.phone}
  ${booking.type === 'room' ? `
  Check-in: ${booking.checkIn}
  Check-out: ${booking.checkOut}
  Guests: ${booking.numberOfGuests}` : ''}
  ${booking.specialRequests ? `
  Special Requests: ${booking.specialRequests}` : ''}
  `
  }

function createEmailMessage(booking: BookingDetails): string {
  return createWhatsAppMessage(booking)
}

function createEmailHTML(booking: BookingDetails): string {
  // Create a formatted HTML version of the email
  return `
    <h2>New ${booking.type} Booking</h2>
    <p><strong>Customer:</strong> ${booking.customerName}</p>
    <p><strong>Email:</strong> ${booking.email}</p>
    <p><strong>Phone:</strong> ${booking.phone}</p>
    ${booking.type === 'room' ? `
    <p><strong>Check-in:</strong> ${booking.checkIn}</p>
    <p><strong>Check-out:</strong> ${booking.checkOut}</p>
    <p><strong>Guests:</strong> ${booking.numberOfGuests}</p>
    ` : ''}
    ${booking.specialRequests ? `
    <p><strong>Special Requests:</strong> ${booking.specialRequests}</p>
    ` : ''}
  `
}