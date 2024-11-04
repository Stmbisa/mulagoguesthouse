import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_SERVER,
  port: parseInt(process.env.MAIL_PORT || '587'),
  secure: process.env.MAIL_PORT === '465',
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
})

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json()

    const emailRecipients = (process.env.NOTIFICATION_EMAIL_RECIPIENTS || '').split(',')
      .map(email => email.trim())
      .filter(email => email)

    if (emailRecipients.length === 0) {
      return NextResponse.json(
        { error: 'No recipients configured' },
        { status: 500 }
      )
    }

    await Promise.all(
      emailRecipients.map(recipient =>
        transporter.sendMail({
          from: process.env.MAIL_FROM,
          to: recipient,
          subject: `Contact Form: ${subject}`,
          text: `
Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
          `,
          html: `
<h2>New Contact Form Submission</h2>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Subject:</strong> ${subject}</p>
<p><strong>Message:</strong></p>
<p>${message.replace(/\n/g, '<br>')}</p>
          `,
        })
      )
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
