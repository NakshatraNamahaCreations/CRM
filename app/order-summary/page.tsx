'use client'
import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import CheckoutNav from '@/components/layout/CheckoutNav'
import Footer from '@/components/layout/Footer'
import { allIndustryData } from '@/lib/industryData'
import { calcGST, formatINR, INDUSTRIES } from '@/lib/utils'
import { useOrder } from '@/lib/store'
import type { IndustryPageConfig, Plan } from '@/lib/types'

const NEXT_STEPS = [
  { title: 'Instant payment confirmation',       text: 'Receipt sent to your WhatsApp & email within 2 minutes of payment.' },
  { title: 'Discovery call within 24 hours',     text: 'NNC team schedules your setup call and documents your exact requirements.' },
  { title: 'Setup & data migration (3–5 days)',  text: 'We configure CoreOS CRM on AWS, migrate your existing data, and set up WhatsApp templates.' },
  { title: 'Go live + staff training',           text: '2-hour training session. Full support for 30–90 days post-launch depending on your plan.' },
]

function OrderSummaryContent() {
  const router      = useRouter()
  const params      = useSearchParams()
  const { order, setOrder } = useOrder()

  const [industryId, setIndustryId] = useState(order.industryId || 'hospitality')
  const [cfg, setCfg]   = useState<IndustryPageConfig>(allIndustryData[industryId])
  const [plan, setPlan] = useState<Plan>(cfg.plans[1])

  useEffect(() => {
    const ind = params.get('industry') || order.industryId || 'hospitality'
    const pl  = params.get('plan')     || order.planId     || 'growth'
    const newCfg = allIndustryData[ind] ?? allIndustryData['hospitality']
    const newPlan = newCfg.plans.find(p => p.id === pl) ?? newCfg.plans[1]
    setIndustryId(ind as any)
    setCfg(newCfg)
    setPlan(newPlan)
    setOrder({ industryId: ind as any, planId: newPlan.id })
  }, [params])

  function handleContinue() {
    setOrder({ industryId: industryId as any, planId: plan.id })
    router.push('/checkout')
  }

  const { total, gst } = calcGST(plan.price)

  return (
    <>
      <CheckoutNav />
      <main className="min-h-screen bg-[#FAFAFA]">
        <div className="max-w-5xl mx-auto px-6 py-12">

          {/* Header */}
          <div className="text-center max-w-xl mx-auto mb-10">
            <div className="text-[10px] font-bold text-[#888] uppercase tracking-widest mb-3">STEP 1 OF 4 — SELECT YOUR PLAN</div>
            <h1 className="text-4xl font-bold tracking-tight text-[#0A0A0A] mb-3">Choose the right plan<br/>for your business</h1>
            <p className="text-sm text-[#555] leading-relaxed">All plans include AWS hosting, setup, data migration, staff training, and WhatsApp automation. Billed yearly.</p>
          </div>

          {/* Industry selector */}
          <div className="mb-8">
            <div className="text-[10px] font-bold text-[#888] uppercase tracking-widest mb-3 text-center">Select Industry</div>
            <div className="flex flex-wrap gap-2 justify-center">
              {INDUSTRIES.map(ind => (
                <button key={ind.id}
                  onClick={() => {
                    const newCfg = allIndustryData[ind.id]
                    setIndustryId(ind.id)
                    setCfg(newCfg)
                    setPlan(newCfg.plans[1])
                    setOrder({ industryId: ind.id as any })
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border transition-all
                    ${industryId === ind.id
                      ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]'
                      : 'bg-white text-[#555] border-[#E8E8E8] hover:border-[#0A0A0A]'}`}>
                  {ind.icon} {ind.label}
                </button>
              ))}
            </div>
          </div>

          {/* Plan cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            {cfg.plans.map(p => {
              const sel = plan.id === p.id
              return (
                <div key={p.id} onClick={() => { setPlan(p); setOrder({ planId: p.id }) }}
                  className={`rounded-2xl overflow-hidden cursor-pointer transition-all hover:-translate-y-1
                    ${sel ? 'border-2 border-[#0A0A0A] shadow-xl' : 'border border-[#E8E8E8] bg-white hover:shadow-lg'}`}>
                  <div className={`px-5 py-5 ${sel ? 'bg-[#0A0A0A]' : 'bg-[#FAFAFA] border-b border-[#E8E8E8]'}`}>
                    {p.popular && (
                      <div className={`inline-block rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wide mb-2
                        ${sel ? 'bg-white/15 text-white' : 'bg-[#0A0A0A] text-white'}`}>Most Popular</div>
                    )}
                    <div className={`text-xs font-bold uppercase tracking-widest mb-1 ${sel ? 'text-white/50' : 'text-[#888]'}`}>{p.name}</div>
                    <div className={`text-3xl font-bold tracking-tighter ${sel ? 'text-white' : 'text-[#0A0A0A]'}`}>{formatINR(p.price)}</div>
                    <div className={`text-xs mt-1 ${sel ? 'text-white/35' : 'text-[#888]'}`}>per year + 18% GST</div>
                    {p.rooms && <div className={`text-[11px] mt-1 ${sel ? 'text-white/30' : 'text-[#888]'}`}>{p.users} · {p.rooms}</div>}
                  </div>
                  <div className="bg-white px-5 py-4">
                    {p.features.slice(0, 6).map(f => (
                      <div key={f} className="flex items-start gap-2 mb-2">
                        <div className="w-4 h-4 bg-[#0A0A0A] rounded-full flex items-center justify-center text-white text-[8px] font-bold flex-shrink-0 mt-0.5">✓</div>
                        <span className="text-xs text-[#0A0A0A] leading-snug">{f}</span>
                      </div>
                    ))}
                    {p.notIncluded.slice(0, 2).map(f => (
                      <div key={f} className="flex items-start gap-2 mb-2">
                        <div className="w-4 h-4 border-2 border-[#E8E8E8] rounded-full flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-[#888]">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {/* What happens next */}
          <div className="bg-white border border-[#E8E8E8] rounded-2xl max-w-2xl mx-auto mb-10 overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E8E8E8]">
              <div className="text-sm font-bold text-[#0A0A0A]">What happens after you pay?</div>
            </div>
            {NEXT_STEPS.map((s, i) => (
              <div key={i} className="flex gap-4 px-6 py-5 border-b border-[#E8E8E8] last:border-0">
                <div className="w-8 h-8 bg-[#0A0A0A] rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{i+1}</div>
                <div>
                  <div className="text-sm font-bold text-[#0A0A0A] mb-1">{s.title}</div>
                  <div className="text-xs text-[#555] leading-relaxed">{s.text}</div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <button onClick={handleContinue}
              className="btn-black text-sm px-10 py-4 mx-auto">
              Continue to Checkout →
            </button>
            <div className="text-xs text-[#888] mt-3">
              Selected: <strong className="text-[#0A0A0A]">{cfg.id.charAt(0).toUpperCase()+cfg.id.slice(1)} · {plan.name} — {formatINR(plan.price)}/yr</strong>
              <span className="text-[#888]"> · +GST ₹{gst.toLocaleString('en-IN')} = ₹{total.toLocaleString('en-IN')}/yr</span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default function OrderSummaryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-sm text-[#888]">Loading plans...</div>
      </div>
    }>
      <OrderSummaryContent />
    </Suspense>
  )
}
