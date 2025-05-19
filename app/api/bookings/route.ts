import { NextResponse } from 'next/server'
import twilio from 'twilio'
import nodemailer from 'nodemailer'
import { BookingDetails } from '@/types'
import { rooms } from '@/data'
import { services } from '@/data'

interface BookableItem {
  id: string | number;
  name: string;
  price: string | number; // Or a more specific type if price structure is complex
}


// Add tracking interface
interface BookingLog {
  timestamp: string
  bookingType: string
  itemName: string
  customerEmail: string
  status: 'success' | 'failed'
  error?: string
}

// Helper function to create Brevo transporter
// This ensures configuration is consistent and easy to manage
function createBrevoTransporter() {
  // Check if necessary mail env vars are present for Brevo
  if (!process.env.MAIL_SERVER || !process.env.MAIL_USERNAME || !process.env.MAIL_PASSWORD || !process.env.MAIL_FROM) {
      console.warn("Brevo SMTP configuration is incomplete. Email sending will be skipped.");
      return null;
  }
  return nodemailer.createTransport({
    host: process.env.MAIL_SERVER,
    port: parseInt(process.env.MAIL_PORT || '587'), // Default to 587 for Brevo
    secure: false, // For Brevo with port 587, secure is false (STARTTLS)

    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD, 
    },
  });
}


async function logBooking(log: BookingLog) {
  console.log('Booking Log:', JSON.stringify(log, null, 2))

  const adminEmails = (process.env.ADMIN_EMAIL_RECIPIENTS || '').split(',')
    .map(email => email.trim())
    .filter(email => email)
    .map(recipient => recipient.startsWith('email:') ? recipient.substring(6) : recipient);


  if (adminEmails.length > 0) {
    const emailTransporter = createBrevoTransporter();
    if (!emailTransporter) {
        console.error('Failed to create transporter for booking log email due to missing configuration.');
        return;
    }
    try {
      await emailTransporter.sendMail({
        from: process.env.MAIL_FROM, // Must be a validated sender in Brevo
        to: adminEmails,
        subject: `Booking Log ${log.status.toUpperCase()}: ${log.itemName}`,
        text: `
          Booking Log:
          - Timestamp: ${log.timestamp}
          - Type: ${log.bookingType}
          - Item: ${log.itemName}
          - Customer: ${log.customerEmail}
          - Status: ${log.status}
          ${log.error ? `- Error: ${log.error}` : ''}
        `.trim(),
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
        `.trim(),
      })
      console.log('Booking log email sent successfully to admin(s).')
    } catch (error) {
      console.error('Failed to send booking log email:', error)
    }
  }
}

export async function POST(request: Request) {
  let twilioClientInstance;
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_WHATSAPP_FROM) {
    twilioClientInstance = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
  } else {
    console.warn("Twilio credentials not fully configured. WhatsApp notifications will be skipped.");
  }

  // Create Brevo transporter instance for booking notifications
  const emailTransporterInstance = createBrevoTransporter();

  let bookingDetailsForLog: Partial<BookingDetails> = {};

  try {
    const booking: BookingDetails = await request.json();
    bookingDetailsForLog = booking; // Store for potential use in catch block

    const item: BookableItem | undefined = booking.type === 'room'
      ? rooms.find(r => r.id === booking.itemId)
      : services.find(s => s.id === booking.itemId);

    if (!item) {
      await logBooking({
        timestamp: new Date().toISOString(),
        bookingType: booking.type,
        itemName: 'Unknown',
        customerEmail: booking.email,
        status: 'failed',
        error: 'Invalid item ID'
      });
      return NextResponse.json(
        { error: 'Invalid item ID' },
        { status: 400 }
      );
    }

    // --- WhatsApp Notification ---
    const whatsappMessage = `
        New Booking at Mulago Hospital Guest House!

        Type: ${booking.type.toUpperCase()}
        Item: ${item.name}
        Price: ${typeof item.price === 'number' ? `$${item.price}` : item.price}

        Customer Details:
        - Name: ${booking.customerName}
        - Email: ${booking.email}
        - Phone: ${booking.phone}
        ${booking.type === 'room' && booking.checkIn && booking.checkOut ? `
        - Check-in: ${booking.checkIn}
        - Check-out: ${booking.checkOut}
        - Guests: ${booking.numberOfGuests}` : ''}
        ${booking.specialRequests ? `
        Special Requests: ${booking.specialRequests}` : ''}

        Please contact the customer to confirm the booking.
        PS: *THIS IS AN AUTOMATED MESSAGE. COPY THE CONTACT DETAILS AND SEND PERSONALIZED MESSAGES TO THE CUSTOMER* .
    `.trim();

    const whatsappNumbers = (process.env.NOTIFICATION_WHATSAPP_NUMBERS || '').split(',')
      .map(number => number.trim())
      .filter(number => number);

    if (whatsappNumbers.length > 0 && twilioClientInstance) {
      await Promise.allSettled(
        whatsappNumbers.map(async number => {
          try {
            const formattedNumber = number.startsWith('whatsapp:') ? number : `whatsapp:${number}`;
            const message = await twilioClientInstance.messages.create({
              body: whatsappMessage,
              from: process.env.TWILIO_WHATSAPP_FROM!,
              to: formattedNumber
            });
            console.log(`WhatsApp sent to ${formattedNumber}:`, message.sid);
          } catch (error: any) {
            console.error(`Failed to send WhatsApp to ${number}:`, {
              message: error.message,
              code: error.code,
              status: error.status,
              moreInfo: error.moreInfo,
            });
          }
        })
      );
    } else if (whatsappNumbers.length > 0) {
        console.warn("WhatsApp numbers configured, but Twilio client could not be initialized due to missing credentials.");
    }

    // --- Email Notification via Brevo ---
    const emailRecipients = (process.env.NOTIFICATION_EMAIL_RECIPIENTS || '').split(',')
     .map(email => email.trim())
     .filter(email => email)
     .map(recipient => recipient.startsWith('email:') ? recipient.substring(6) : recipient);


    if (emailRecipients.length > 0 && emailTransporterInstance) {
      console.log('Attempting to send booking notification email to:', emailRecipients);
      await Promise.allSettled(
        emailRecipients.map(recipientEmail =>
          emailTransporterInstance.sendMail({
            from: process.env.MAIL_FROM!, // Must be a validated sender in Brevo
            to: recipientEmail,
            subject: `New Booking: ${item.name} - Mulago Hospital Guest House`,
            text: createEmailTextMessage(booking, item),
            html: createEmailHtmlMessage(booking, item),
          }).then(() => {
            console.log(`Booking notification email sent successfully to ${recipientEmail}`);
          }).catch(error => {
            console.error(`Failed to send booking notification email to ${recipientEmail}:`, error);
          })
        )
      );
    } else if (emailRecipients.length > 0) {
        console.warn("Email recipients configured for notifications, but Brevo mail transporter could not be initialized due to missing credentials.");
    } else {
        console.log("No email recipients configured for booking notifications, or transporter not initialized.");
    }

    await logBooking({
      timestamp: new Date().toISOString(),
      bookingType: booking.type,
      itemName: item.name,
      customerEmail: booking.email,
      status: 'success'
    });

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('General Booking Error:', error);
    await logBooking({
      timestamp: new Date().toISOString(),
      bookingType: bookingDetailsForLog.type || 'unknown',
      itemName: 'unknown', // Could try to get item name if booking and item were parsed
      customerEmail: bookingDetailsForLog.email || 'unknown',
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error processing booking'
    });

    return NextResponse.json(
      { error: 'Failed to process booking' },
      { status: 500 }
    );
  }
}

// --- Email Content Helper Functions ---
function createEmailTextMessage(booking: BookingDetails, item: BookableItem): string {
  return `
New ${booking.type.toUpperCase()} Booking at Mulago Hospital Guest House!

Item: ${item.name}
Price: ${typeof item.price === 'number' ? `$${item.price}` : item.price}

Customer Details:
- Name: ${booking.customerName}
- Email: ${booking.email}
- Phone: ${booking.phone}
${booking.type === 'room' && booking.checkIn && booking.checkOut ? `
- Check-in: ${booking.checkIn}
- Check-out: ${booking.checkOut}
- Guests: ${booking.numberOfGuests}` : ''}
${booking.specialRequests ? `
Special Requests: ${booking.specialRequests}` : ''}

Please contact the customer to confirm the booking.
  `.trim();
}

function createEmailHtmlMessage(booking: BookingDetails, item: BookableItem): string {
  return `
    <h2>New ${booking.type.toUpperCase()} Booking - Mulago Hospital Guest House</h2>
    <p>A new booking has been received:</p>
    <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%;">
        <tr><td style="width: 30%;"><strong>Booking Type:</strong></td><td>${booking.type.toUpperCase()}</td></tr>
        <tr><td><strong>Item:</strong></td><td>${item.name}</td></tr>
        <tr><td><strong>Price:</strong></td><td>${typeof item.price === 'number' ? `$${item.price}` : item.price}</td></tr>
    </table>
    <h3>Customer Details:</h3>
    <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%;">
      <tr><td style="width: 30%;"><strong>Name:</strong></td><td>${booking.customerName}</td></tr>
      <tr><td><strong>Email:</strong></td><td>${booking.email}</td></tr>
      <tr><td><strong>Phone:</strong></td><td>${booking.phone}</td></tr>
      ${booking.type === 'room' && booking.checkIn && booking.checkOut ? `
      <tr><td><strong>Check-in:</strong></td><td>${booking.checkIn}</td></tr>
      <tr><td><strong>Check-out:</strong></td><td>${booking.checkOut}</td></tr>
      <tr><td><strong>Guests:</strong></td><td>${booking.numberOfGuests}</td></tr>
      ` : ''}
      ${booking.specialRequests ? `
      <tr><td><strong>Special Requests:</strong></td><td>${booking.specialRequests.replace(/\n/g, '<br>')}</td></tr>
      ` : ''}
    </table>
    <p><em>Please contact the customer to confirm the booking as soon as possible.</em></p>
  `.trim();
}