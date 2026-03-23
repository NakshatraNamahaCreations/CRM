import type { Metadata } from 'next'
import './globals.css'
import { OrderProvider } from '@/lib/store'

export const metadata: Metadata = {
  title: 'CoreOS CRM — Industry-Specific CRM Software for Indian Businesses | NNC',
  description: 'Complete CRM solutions for Hospitality, Healthcare, Real Estate, Education and Events. AWS hosted, WhatsApp automation, GST billing. Built by NNC Bengaluru.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <OrderProvider>{children}</OrderProvider>
      </body>
    </html>
  )
}
