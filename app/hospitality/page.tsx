import type { Metadata } from 'next'
import IndustryPage from '@/components/sections/IndustryPage'
import { hospitalityData } from '@/lib/industryData'

export const metadata: Metadata = {
  title: hospitalityData.metaTitle,
  description: hospitalityData.metaDesc,
}

export default function HospitalityPage() {
  return <IndustryPage cfg={hospitalityData} />
}
