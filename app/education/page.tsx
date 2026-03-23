import type { Metadata } from 'next'
import IndustryPage from '@/components/sections/IndustryPage'
import { educationData } from '@/lib/industryData'

export const metadata: Metadata = {
  title: educationData.metaTitle,
  description: educationData.metaDesc,
}

export default function EducationPage() {
  return <IndustryPage cfg={educationData} />
}
