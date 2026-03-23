import type { Metadata } from 'next'
import IndustryPage from '@/components/sections/IndustryPage'
import { healthcareData } from '@/lib/industryData'

export const metadata: Metadata = {
  title: healthcareData.metaTitle,
  description: healthcareData.metaDesc,
}

export default function HealthcarePage() {
  return <IndustryPage cfg={healthcareData} />
}
