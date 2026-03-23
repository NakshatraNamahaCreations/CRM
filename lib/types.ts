// ── Industry types ──────────────────────────────────────
export type IndustryId = 'hospitality' | 'healthcare' | 'realestate' | 'education' | 'events'

export interface Industry {
  id: IndustryId
  label: string
  icon: string
  slug: string
  tagline: string
  color: string
}

// ── Plan types ───────────────────────────────────────────
export interface Plan {
  id:          string
  name:        string
  price:       number
  users:       string
  rooms?:      string
  period:      string
  popular:     boolean
  description: string
  features:    string[]
  notIncluded: string[]
  support:     string
  response:    string
  mobile:      string
}

// ── Comparison table ─────────────────────────────────────
export interface ComparisonSection {
  category: string
  rows: ComparisonRow[]
}

export interface ComparisonRow {
  icon:    string
  feature: string
  starter: string
  growth:  string
  enterprise: string
}

// ── Order state ──────────────────────────────────────────
export interface OrderState {
  industryId: IndustryId
  planId:     string
  name:       string
  business:   string
  phone:      string
  email:      string
  city:       string
  state:      string
  size:       string
  gst:        string
  payMethod:  string
  ref:        string
}

// ── Industry page config ─────────────────────────────────
export interface ProblemCard {
  icon:  string
  title: string
  body:  string
}

export interface FeatureItem {
  id:      string
  icon:    string
  title:   string
  desc:    string
  bullets: string[]
}

export interface ProcessStep {
  title: string
  text:  string
}

export interface Testimonial {
  text:     string
  initials: string
  name:     string
  role:     string
}

export interface FAQ {
  q: string
  a: string
}

export interface WinCard {
  industry:  string
  hotel:     string
  location:  string
  result:    string
  metrics:   { n: string; l: string }[]
  time:      string
}

export interface IndustryPageConfig {
  id:            IndustryId
  metaTitle:     string
  metaDesc:      string
  h1:            string[]
  h1Sub:         string
  heroSub:       string
  heroBadge:     string
  urgencyText:   string
  proofText:     string
  plans:         Plan[]
  problems:      ProblemCard[]
  features:      FeatureItem[]
  processSteps:  ProcessStep[]
  comparison:    ComparisonSection[]
  testimonials:  Testimonial[]
  faqs:          FAQ[]
  wins:          WinCard[]
  finalH2:       string
  finalP:        string
  sizeLabel:     string
}
