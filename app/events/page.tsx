import type { Metadata } from 'next'
import IndustryPage from '@/components/sections/IndustryPage'
import { eventsData } from '@/lib/industryData'

export const metadata: Metadata = {
  title: eventsData.metaTitle,
  description: eventsData.metaDesc,
}

export default function EventsPage() {
  return <IndustryPage cfg={eventsData} />
}
