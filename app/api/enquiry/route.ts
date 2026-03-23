import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, biz, phone, email, city, type, msg } = body

    // Create reusable transporter object using the default SMTP transport
    // In production, configure these securely via .env
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER || "info@nakshatranamahacreations.com",
        pass: process.env.SMTP_PASS || "HarryYInfo@21032026!@#",
      },
    })

    const htmlContent = `
      <h2>New CRM Enquiry</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Business Name:</strong> ${biz}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>City & State:</strong> ${city}</p>
      <p><strong>Enquiry Type:</strong> ${type}</p>
      <p><strong>Message:</strong></p>
      <p>${msg || 'No message provided.'}</p>
    `

    // Send mail
    const info = await transporter.sendMail({
      from: `"CRM Website" <${process.env.SMTP_USER}>`,
      to: 'info@nakshatranamahacreations.com',
      subject: `New Enquiry from ${name} - ${biz}`,
      html: htmlContent,
    })

    console.log('Message sent: %s', info.messageId)

    return NextResponse.json({ success: true, messageId: info.messageId }, { status: 200 })
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
