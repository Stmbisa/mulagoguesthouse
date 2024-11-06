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
// Add tracking interface
interface BookingLog {
  timestamp: string
  bookingType: string
  itemName: string
  customerEmail: string
  status: 'success' | 'failed'
  error?: string
}

// Initialize transporter
const emailTransporter = nodemailer.createTransport({
  host: process.env.MAIL_SERVER,
  port: parseInt(process.env.MAIL_PORT || '587'),
  secure: process.env.MAIL_PORT === '465',
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
})

// Modify the logBooking function to create transporter when needed
async function logBooking(log: BookingLog) {
  console.log(JSON.stringify(log, null, 2))

  const adminEmails = (process.env.ADMIN_EMAIL_RECIPIENTS || '').split(',')
    .map(email => email.trim())
    .filter(email => email)

    if (adminEmails.length > 0) {
      try {
        await emailTransporter.sendMail({
          from: process.env.MAIL_FROM,
          to: adminEmails,
          subject: `Booking ${log.status.toUpperCase()}: ${log.itemName}`,
          text: `
            Booking Log:
            - Timestamp: ${log.timestamp}
            - Type: ${log.bookingType}
            - Item: ${log.itemName}
            - Customer: ${log.customerEmail}
            - Status: ${log.status}
            ${log.error ? `- Error: ${log.error}` : ''}
                    `,
                    html: `
            <h2>Booking Log</h2>
            <ul>
              <li><strong>Timestamp:</strong> ${log.timestamp}</li>
              <li><strong>Type:</strong> ${log.bookingType}</li>
              <li><strong>Item:</strong> ${log.itemName}</li>
              <li><strong>Customer:</strong> ${log.customerEmail}</li>
              <li><strong>Status:</strong> ${log.status}</li>
              ${log.error ? `<li><strong>Error:</strong> ${log.error}</li>` : ''}
            </ul>
          `,
        })
      } catch (error) {
        console.error('Failed to send booking log:', error)
      }
    }
  }

export async function POST(request: Request) {
  try {
    const booking: BookingDetails = await request.json()
    const item = booking.type === 'room'
      ? rooms.find(r => r.id === booking.itemId)
      : services.find(s => s.id === booking.itemId)

    if (!item) {
      await logBooking({
        timestamp: new Date().toISOString(),
        bookingType: booking.type,
        itemName: 'Unknown',
        customerEmail: booking.email,
        status: 'failed',
        error: 'Invalid item ID'
      })
      return NextResponse.json(
        { error: 'Invalid item ID' },
        { status: 400 }
      )
    }

    // Create detailed message
    const whatsappMessage = `
        New Booking at Mulago Hospital Guest House!

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
    const whatsappNumbers = (process.env.NOTIFICATION_WHATSAPP_NUMBERS || '').split(',')
      .map(number => number.trim())
      .filter(number => number)

      if (whatsappNumbers.length > 0) {
        await Promise.allSettled(
          whatsappNumbers.map(async number => {
            try {
              const formattedNumber = number.startsWith('whatsapp:') ? number : `whatsapp:${number}`;
              const message = await twilioClient.messages.create({
                body: whatsappMessage,
                from: process.env.TWILIO_WHATSAPP_FROM,
                to: formattedNumber
              });
              console.log(`WhatsApp sent to ${formattedNumber}:`, message.sid);
            } catch (error: any) {
              console.error(`Failed to send WhatsApp to ${number}:`, {
                error: error.message,
                code: error.code,
                status: error.status
              });
            }
          })
        );
      }

     // Send email notifications
     const emailRecipients = (process.env.NOTIFICATION_EMAIL_RECIPIENTS || '').split(',')
     .map(email => email.replace('email:', '').trim())
     .filter(email => email)

   if (emailRecipients.length > 0) {
     await Promise.allSettled(
       emailRecipients.map(email =>
         emailTransporter.sendMail({
           from: process.env.MAIL_FROM,
           to: email,
           subject: `New Booking: ${item.name} - Mulago Hospital Guest House`,
           text: createEmailMessage(booking),
           html: createEmailHTML(booking),
         }).catch(error => {
           console.error(`Failed to send email to ${email}:`, error)
         })
       )
     )
   }

   await logBooking({
     timestamp: new Date().toISOString(),
     bookingType: booking.type,
     itemName: item.name,
     customerEmail: booking.email,
     status: 'success'
   })

   return NextResponse.json({ success: true })
 } catch (error) {
   await logBooking({
     timestamp: new Date().toISOString(),
     bookingType: 'unknown',
     itemName: 'unknown',
     customerEmail: 'unknown',
     status: 'failed',
     error: error instanceof Error ? error.message : 'Unknown error'
   })

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