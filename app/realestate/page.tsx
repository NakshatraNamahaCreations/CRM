import type { Metadata } from 'next'
import IndustryPage from '@/components/sections/IndustryPage'
import { realestateData } from '@/lib/industryData'

export const metadata: Metadata = {
  title: realestateData.metaTitle,
  description: realestateData.metaDesc,
}

export default function RealEstatePage() {
  return <IndustryPage cfg={realestateData} />
}
