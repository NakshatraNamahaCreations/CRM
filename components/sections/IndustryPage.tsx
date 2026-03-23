'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MapPin } from 'lucide-react'
import type { IndustryPageConfig } from '@/lib/types'
import { calcGST, formatINR } from '@/lib/utils'
import { useOrder } from '@/lib/store'
import Navbar  from '@/components/layout/Navbar'
import Footer  from '@/components/layout/Footer'

interface Props { cfg: IndustryPageConfig }

// ── Comparison cell helper ─────────────────────────────────
function Cell({ v, hi }: { v: string; hi?: boolean }) {
  const base = `py-3 px-3 text-center align-middle border-l border-[#E8E8E8] ${hi ? 'bg-black/[0.018]' : ''}`
  if (v === '✓') return <td className={base}><span className="inline-flex w-5 h-5 bg-[#0A0A0A] text-white rounded-full items-center justify-center text-[10px] font-bold">✓</span></td>
  if (v === '—') return <td className={base}><span className="text-[#DDD] text-lg">—</span></td>
  return <td className={base}><span className="inline-block text-[11px] font-bold text-[#0A0A0A] bg-[#F5F5F5] border border-[#E8E8E8] px-2.5 py-0.5 rounded-full whitespace-nowrap">{v}</span></td>
}

export default function IndustryPage({ cfg }: Props) {
  const router = useRouter()
  const { setOrder } = useOrder()
  const [activePlan, setActivePlan] = useState(cfg.plans[1])
  const [openFeat, setOpenFeat]   = useState(0)
  const [openFaq,  setOpenFaq]    = useState<number|null>(0)
  const [sticky,   setSticky]     = useState(false)
  const [enqSent,  setEnqSent]    = useState(false)
  const [sendingEnq, setSendingEnq] = useState(false)
  const [enqData,  setEnqData]    = useState({ name:'',biz:'',phone:'',email:'',city:'',type:'',size:'',msg:'' })
  const [processing, setProcessing] = useState(false)
  const [formData, setFormData]   = useState({ name:'',biz:'',phone:'',email:'',city:'',state:'',gst:'' })

  const growthPlan = cfg.plans[1]
  const { gst, total } = calcGST(activePlan.price)

  useEffect(() => {
    const fn = () => setSticky(window.scrollY > 600)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  function handlePay() {
    if (!formData.name || !formData.phone || !formData.email || !formData.biz) {
      alert('Please fill in Name, Hotel Name, Phone, and Email.')
      return
    }
    setProcessing(true)
    setOrder({
      industryId: cfg.id,
      planId: activePlan.id,
      name: formData.name,
      business: formData.biz,
      phone: formData.phone,
      email: formData.email,
      city: formData.city,
      state: formData.state,
      gst: formData.gst,
      ref: 'NNC-2026-' + String(Math.floor(10000 + Math.random() * 90000)),
    })
    setTimeout(() => {
      setProcessing(false)
      router.push('/thankyou')
    }, 1800)
  }

  async function submitEnquiry() {
    if (!enqData.name || !enqData.phone || !enqData.email || !enqData.type) {
      alert('Please fill Name, Phone, Email, and Enquiry Type.')
      return
    }
    setSendingEnq(true)
    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enqData)
      })
      if (!res.ok) throw new Error('Failed to send enquiry')
      setEnqSent(true)
    } catch (error) {
      alert('Failed to send the enquiry. Please try again.')
    } finally {
      setSendingEnq(false)
    }
  }

  const pf = (v: string) => formData[v as keyof typeof formData]
  const sf = (k: string, v: string) => setFormData(p => ({...p, [k]: v}))

  return (
    <>
      <Navbar />

      {/* Urgency */}
      <div className="bg-[#0A0A0A] text-center px-4 py-2.5 mt-16 flex items-center justify-center gap-3 flex-wrap">
        <span className="text-xs text-white/70 flex items-center gap-1.5"><MapPin size={14} className="text-[#888]" /> {cfg.urgencyText}</span>
        <span className="bg-white/10 border border-white/20 text-white text-[10px] font-bold px-3 py-1 rounded-full">Free Setup Consultation</span>
        <span className="text-xs text-white/50 hidden sm:inline">Go live in 7 days · AWS cloud hosted · Full training included</span>
      </div>

      <main>
        {/* ══ HERO ══ */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#F5F5F5] rounded-full px-3.5 py-1.5 text-[11px] font-bold text-[#555] mb-5 uppercase tracking-wide">
                <span className="w-1.5 h-1.5 bg-[#16A34A] rounded-full animate-pulse" />{cfg.heroBadge}
              </div>
              {/* H1 */}
              <h1 className="text-5xl font-bold tracking-[-2px] leading-[1.06] text-[#0A0A0A] mb-2">
                {cfg.h1.map((line, i) => (
                  <React.Fragment key={i}>{i > 0 && <br/>}{line}</React.Fragment>
                ))}
              </h1>
              <p className="text-base italic text-[#888] font-light mb-5">{cfg.h1Sub}</p>

              {/* Recent wins ticker */}
              <div className="bg-[#F5F5F5] border border-[#E8E8E8] rounded-xl p-4 mb-6">
                <div className="text-[10px] font-bold text-[#888] uppercase tracking-wider mb-3">🟢 Recently went live on CoreOS CRM</div>
                {cfg.wins.slice(0,3).map(w => (
                  <div key={w.hotel} className="flex items-start gap-2 mb-2 text-xs text-[#0A0A0A]">
                    <span className="w-2 h-2 bg-[#16A34A] rounded-full flex-shrink-0 mt-1" />
                    <span><strong>{w.hotel}</strong> — {w.result.slice(0, 65)}...</span>
                  </div>
                ))}
              </div>

              <p className="text-sm text-[#555] leading-relaxed mb-7 max-w-md font-light">{cfg.heroSub}</p>

              {/* Decision block */}
              <div className="bg-[#0A0A0A] rounded-2xl p-6 mb-5">
                <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3">Choose Your Plan & Start Today</div>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {cfg.plans.map(p => (
                    <button key={p.id} onClick={() => setActivePlan(p)}
                      className={`border rounded-xl p-3 text-center cursor-pointer transition-all
                        ${activePlan.id === p.id ? 'border-white bg-white/10' : 'border-white/12 hover:border-white/40'}`}>
                      <div className={`text-[10px] font-bold uppercase tracking-wide mb-1 ${activePlan.id === p.id ? 'text-white/70' : 'text-white/40'}`}>
                        {p.popular ? `${p.name} ★` : p.name}
                      </div>
                      <div className={`text-xl font-bold tracking-tight ${activePlan.id === p.id ? 'text-white' : 'text-white/50'}`}>
                        {formatINR(p.price)}
                      </div>
                      <div className={`text-[10px] mt-0.5 ${activePlan.id === p.id ? 'text-white/40' : 'text-white/25'}`}>
                        {p.users} · {p.rooms || p.period}
                      </div>
                    </button>
                  ))}
                </div>
                <button onClick={() => document.getElementById('get-started')?.scrollIntoView({behavior:'smooth'})}
                  className="flex items-center justify-center gap-2 w-full bg-white text-[#0A0A0A] font-bold text-sm rounded-lg py-3.5 hover:opacity-90 transition-opacity">
                  → Get Started — Pay Securely via Razorpay
                </button>
                <div className="text-[11px] text-white/25 text-center mt-2.5">+18% GST · Cancel anytime · 30-day setup guarantee</div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex">
                  {['RN','PS','AK','MR','SK'].map((av, i) => (
                    <div key={av} className="w-8 h-8 rounded-full bg-[#F5F5F5] border-2 border-white flex items-center justify-center text-[10px] font-bold text-[#555]"
                      style={{marginLeft: i > 0 ? '-8px' : '0'}}>{av}</div>
                  ))}
                </div>
                <div className="text-xs text-[#555]">{cfg.proofText}</div>
              </div>
            </div>

            {/* Mini dashboard mockup */}
            <div className="relative">
              <div className="bg-white border border-[#E8E8E8] rounded-2xl overflow-hidden shadow-xl">
                <div className="bg-[#FAFAFA] border-b border-[#E8E8E8] px-4 py-3 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#FF5F57]"/><span className="w-3 h-3 rounded-full bg-[#FFBD2E]"/><span className="w-3 h-3 rounded-full bg-[#28C840]"/>
                  </div>
                  <span className="text-xs text-[#888] ml-2 font-medium">CoreOS {cfg.id.charAt(0).toUpperCase()+cfg.id.slice(1)} CRM — Live</span>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {cfg.wins[0].metrics.map(m => (
                      <div key={m.l} className="border border-[#E8E8E8] rounded-lg p-3">
                        <div className="text-xl font-bold text-[#0A0A0A] tracking-tight">{m.n}</div>
                        <div className="text-[9px] text-[#888] uppercase tracking-wide mt-0.5">{m.l}</div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-[#0A0A0A] rounded-lg p-3">
                    <div className="text-[10px] font-bold text-white/60 mb-2">Recent Activity</div>
                    {cfg.wins.slice(0,3).map(w => (
                      <div key={w.hotel} className="flex items-center gap-2 mb-1.5">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full flex-shrink-0"/>
                        <span className="text-[11px] text-white/70 truncate">{w.hotel} — went live {w.time} ago</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Floating badge */}
              <div className="absolute -top-3 -right-4 hidden lg:block bg-white border border-[#E8E8E8] rounded-xl px-3.5 py-2.5 shadow-lg">
                <div className="text-[9px] text-[#888] uppercase tracking-wide mb-0.5">Go-Live Guarantee</div>
                <div className="text-base font-bold text-[#0A0A0A] tracking-tight">7 Working Days</div>
                <div className="text-[10px] text-[#16A34A] font-semibold mt-0.5">Or full refund ✓</div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust bar */}
        <div className="border-t border-b border-[#E8E8E8] bg-[#F5F5F5] py-4 px-6">
          <div className="max-w-6xl mx-auto flex items-center justify-center gap-8 flex-wrap">
            {[['🏆','565+ Projects'],['☁️','AWS Hosted'],['🔒','AES-256 Encrypted'],['📱','WhatsApp Automation'],['🧾','GST Compliant'],['⚡','7-Day Go-Live']].map(([icon,t]) => (
              <div key={t} className="flex items-center gap-2 text-xs font-semibold text-[#555]"><span>{icon}</span>{t}</div>
            ))}
          </div>
        </div>

        {/* Numbers */}
        <div className="bg-[#0A0A0A] px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4">
            {[['200+','Clients on CoreOS'],['565+','Projects Delivered'],['10+','Years in Business'],['4.9★','Google Rating']].map(([n,l]) => (
              <div key={l} className="py-10 text-center border-r border-white/[0.08] last:border-0">
                <div className="text-4xl font-bold text-white tracking-tighter">{n}</div>
                <div className="text-[11px] text-white/35 mt-2 uppercase tracking-wider">{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ══ RECENT WINS ══ */}
        <section className="py-20 px-6 bg-[#FAFAFA]" id="wins">
          <div className="max-w-6xl mx-auto">
            <div className="section-tag">RECENT SUCCESS STORIES</div>
            {/* H2 */}
            <h2 className="section-title">Real Results from Real {cfg.id === 'hospitality' ? 'Hotels' : cfg.id === 'healthcare' ? 'Clinics' : cfg.id === 'realestate' ? 'Builders' : cfg.id === 'education' ? 'Institutes' : 'Event Companies'}.<br/><em className="font-light italic">In the First 30 Days.</em></h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-12">
              {cfg.wins.map(w => (
                <div key={w.hotel} className="bg-white border border-[#E8E8E8] rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#0A0A0A]" />
                  <div className="inline-flex items-center gap-1.5 bg-[#F5F5F5] border border-[#E8E8E8] rounded-full px-2.5 py-1 text-[10px] font-bold text-[#555] mb-3 uppercase tracking-wide">{w.industry}</div>
                  {/* H3 */}
                  <h3 className="text-lg font-bold text-[#0A0A0A] mb-1 tracking-tight">{w.hotel}</h3>
                  <div className="text-xs text-[#888] mb-3">{w.location}</div>
                  <p className="text-xs text-[#555] leading-relaxed mb-4">{w.result}</p>
                  <div className="flex gap-3 flex-wrap">
                    {w.metrics.map(m => (
                      <div key={m.l} className="bg-[#F5F5F5] rounded-lg px-3 py-2 text-center">
                        <div className="text-base font-bold text-[#0A0A0A] tracking-tight">{m.n}</div>
                        <div className="text-[9px] text-[#888] uppercase tracking-wide mt-0.5">{m.l}</div>
                      </div>
                    ))}
                  </div>
                  <div className="text-[11px] text-[#16A34A] font-semibold mt-3">✓ Went live in {w.time}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ PROBLEMS ══ */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="section-tag">THE PROBLEM</div>
            {/* H2 */}
            <h2 className="section-title">Manual Processes Are<br/><em className="font-light italic">Costing You Lakhs Every Month.</em></h2>
            <p className="section-sub mt-2 mb-12">If any of these sound familiar, you are leaving serious money on the table.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#E8E8E8] border border-[#E8E8E8] rounded-2xl overflow-hidden">
              {cfg.problems.map(p => (
                <div key={p.title} className="bg-white p-8 group hover:bg-[#0A0A0A] transition-colors cursor-default">
                  <span className="text-2xl mb-4 block group-hover:[filter:invert(1)] transition-all">{p.icon}</span>
                  {/* H4 */}
                  <h4 className="font-bold text-[#0A0A0A] group-hover:text-white mb-2 tracking-tight transition-colors">{p.title}</h4>
                  <p className="text-xs text-[#555] group-hover:text-white/50 leading-relaxed transition-colors">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ FEATURES ══ */}
        <section className="py-20 px-6 bg-[#FAFAFA]" id="features">
          <div className="max-w-6xl mx-auto">
            <div className="section-tag">WHAT YOU GET</div>
            {/* H2 */}
            <h2 className="section-title">Every Module You<br/><em className="font-light italic">Actually Need.</em></h2>
            <p className="section-sub mt-2">Purpose-built for {cfg.id} operations. Not a generic CRM with labels slapped on.</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mt-12">
              <div>
                {cfg.features.map((f, i) => (
                  <div key={f.id} className="border-b border-[#E8E8E8] first:border-t cursor-pointer" onClick={() => setOpenFeat(i)}>
                    <div className="flex items-center justify-between py-5 gap-3">
                      <div className={`text-sm font-semibold transition-colors ${openFeat === i ? 'text-[#0A0A0A]' : 'text-[#555] hover:text-[#0A0A0A]'}`}>
                        {f.icon} {f.title}
                      </div>
                      <span className={`text-lg font-light flex-shrink-0 transition-all ${openFeat === i ? 'text-[#0A0A0A] rotate-45' : 'text-[#E8E8E8]'}`}>+</span>
                    </div>
                    {openFeat === i && (
                      <div className="pb-5">
                        <p className="text-xs text-[#555] leading-relaxed mb-3">{f.desc}</p>
                        <ul className="space-y-2">
                          {f.bullets.map(b => (
                            <li key={b} className="flex items-start gap-2 text-xs text-[#555]">
                              <span className="text-[#0A0A0A] font-bold flex-shrink-0 mt-0.5">→</span>{b}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {/* Feature preview */}
              <div className="sticky top-20 bg-[#FAFAFA] border border-[#E8E8E8] rounded-2xl overflow-hidden">
                <div className="bg-[#0A0A0A] px-4 py-3 flex items-center justify-between">
                  <span className="text-xs font-semibold text-white/60">{cfg.features[openFeat]?.title}</span>
                  <span className="text-[10px] text-white/30 flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-green-400 rounded-full"/>LIVE</span>
                </div>
                <div className="p-5 bg-white min-h-[280px]">
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {cfg.wins[0].metrics.map(m => (
                      <div key={m.l} className="border border-[#E8E8E8] rounded-lg p-2.5 text-center">
                        <div className="text-lg font-bold">{m.n}</div>
                        <div className="text-[9px] text-[#888] uppercase mt-0.5">{m.l}</div>
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-[#888] font-semibold uppercase tracking-wide mb-2">Key Benefits</div>
                  {cfg.features[openFeat]?.bullets.map(b => (
                    <div key={b} className="flex items-start gap-2 mb-2 text-xs text-[#555]">
                      <div className="w-4 h-4 bg-[#0A0A0A] rounded-full flex items-center justify-center text-white text-[8px] flex-shrink-0 mt-0.5">✓</div>
                      {b}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══ PROCESS ══ */}
        <section className="py-20 px-6 bg-[#0A0A0A]" id="how-it-works">
          <div className="max-w-6xl mx-auto">
            <div className="section-tag text-white/35">THE PROCESS</div>
            {/* H2 */}
            <h2 className="text-4xl font-bold tracking-tight text-white mb-3">
              Live in <em className="font-light italic text-white/50">7 Working Days.</em>
            </h2>
            <p className="text-sm text-white/45 max-w-md leading-relaxed mb-14">NNC handles setup, config, data migration, and training. You just show up on day 7 and run your business.</p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
              <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-white/10" />
              {cfg.processSteps.map((s, i) => (
                <div key={s.title} className="text-center relative z-10">
                  <div className="w-16 h-16 bg-white/[0.06] border border-white/15 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold text-white">
                    0{i+1}
                  </div>
                  {/* H4 */}
                  <h4 className="text-white text-sm font-bold mb-2 text-center">{s.title}</h4>
                  <p className="text-xs text-white/45 leading-relaxed">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ PRICING ══ */}
        <section className="py-20 px-6 bg-[#FAFAFA]" id="pricing">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap items-end justify-between gap-5 mb-12">
              <div>
                <div className="section-tag">PRICING PLANS</div>
                {/* H2 */}
                <h2 className="section-title">Simple Yearly Pricing.<br/><em className="font-light italic">All-Inclusive. No Hidden Charges.</em></h2>
                <p className="section-sub mt-2">Hosting, setup, migration, training, support — all included. Prices exclude 18% GST.</p>
              </div>
              <a href="https://wa.me/919900566466" className="btn-black text-xs px-4 py-2.5 self-start">💬 Custom Quote</a>
            </div>

            {/* Plan cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
              {cfg.plans.map(plan => {
                const { total: planTotal, gst: planGst } = calcGST(plan.price)
                return (
                  <div key={plan.id} className={`rounded-2xl overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl bg-white
                    ${plan.popular ? 'border-2 border-[#0A0A0A]' : 'border border-[#E8E8E8]'}`}>
                    {plan.popular && <div className="bg-[#0A0A0A] text-white text-[10px] font-bold text-center py-2 tracking-widest uppercase">MOST POPULAR</div>}
                    <div className="p-6">
                      <div className="text-[11px] font-bold text-[#888] uppercase tracking-wider mb-2">{plan.name}</div>
                      <div className="flex items-start gap-0.5 mb-1">
                        <span className="text-base font-semibold mt-2">₹</span>
                        <span className="text-4xl font-bold text-[#0A0A0A] tracking-tighter">{plan.price.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-[#F5F5F5] text-[#555] text-[10px] font-bold px-2 py-0.5 rounded-full">Per Year</span>
                        <span className="text-xs text-[#888]">Billed annually</span>
                      </div>
                      <p className="text-xs text-[#555] leading-relaxed mb-4">{plan.description}</p>
                      <div className="border-t border-[#E8E8E8] pt-4 mb-4">
                        <div className="text-[10px] font-bold text-[#888] uppercase tracking-wide mb-3">
                          {plan.popular ? 'Everything in Starter, plus' : plan.id === 'enterprise' ? 'Everything in Growth, plus' : 'Included'}
                        </div>
                        {plan.features.slice(0, 7).map(f => (
                          <div key={f} className="flex items-start gap-2 mb-2">
                            <div className="w-4 h-4 bg-[#0A0A0A] rounded-full flex items-center justify-center text-white text-[8px] flex-shrink-0 mt-0.5">✓</div>
                            <span className="text-xs text-[#0A0A0A]">{f}</span>
                          </div>
                        ))}
                        {plan.notIncluded.slice(0,2).map(f => (
                          <div key={f} className="flex items-start gap-2 mb-2">
                            <div className="w-4 h-4 border-2 border-[#E8E8E8] rounded-full flex-shrink-0 mt-0.5" />
                            <span className="text-xs text-[#888]">{f}</span>
                          </div>
                        ))}
                      </div>
                      <button onClick={() => { setActivePlan(plan); document.getElementById('get-started')?.scrollIntoView({behavior:'smooth'}); }}
                        className={`w-full py-3 rounded-xl text-sm font-bold transition-all
                          ${plan.popular ? 'bg-[#0A0A0A] text-white hover:opacity-85' : 'bg-white text-[#0A0A0A] border-2 border-[#E8E8E8] hover:border-[#0A0A0A]'}`}>
                        Get {plan.name} →
                      </button>
                      <div className="text-[11px] text-[#888] text-center mt-2">
                        + GST ₹{planGst.toLocaleString('en-IN')} = ₹{planTotal.toLocaleString('en-IN')}/yr
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Comparison table */}
            <h3 className="text-xl font-bold text-center mb-6">Full Feature Comparison — All 3 Plans</h3>
            <div className="border border-[#E8E8E8] rounded-2xl overflow-hidden overflow-x-auto">
              <table className="w-full min-w-[700px] border-collapse font-sans">
                <colgroup><col style={{width:'42%'}}/><col style={{width:'19%'}}/><col style={{width:'19%'}}/><col style={{width:'20%'}}/></colgroup>
                <thead>
                  <tr className="bg-[#0A0A0A]">
                    <th className="py-5 px-6 text-xs font-semibold text-white/30 text-left">Feature</th>
                    {cfg.plans.map((p, i) => (
                      <th key={p.id} className={`py-5 px-4 border-l border-white/10 ${p.popular ? 'bg-white/7' : ''} relative`}>
                        {p.popular && <div className="absolute top-0 left-0 right-0 h-0.5 bg-white"/>}
                        <div className="text-center">
                          {p.popular && <div className="inline-block bg-white/15 rounded-full px-2 py-0.5 text-[9px] font-bold text-white uppercase tracking-wide mb-1">Most Popular</div>}
                          <div className="text-[10px] font-bold text-white/50 uppercase tracking-wide mb-1">{p.name}</div>
                          <div className="text-xl font-bold text-white tracking-tight">{formatINR(p.price)}</div>
                          <div className="text-[10px] text-white/30 mt-0.5">per year + GST</div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cfg.comparison.map(section => (
                    <React.Fragment key={section.category}>
                      <tr className="bg-[#F5F5F5] border-t-2 border-[#E8E8E8]">
                        <td colSpan={4} className="py-2.5 px-6 text-[10px] font-bold text-[#888] uppercase tracking-widest">{section.category}</td>
                      </tr>
                      {section.rows.map(row => (
                        <tr key={row.feature} className="border-t border-[#E8E8E8] hover:bg-[#F7F9FF] transition-colors">
                          <td className="py-3 px-6 text-xs text-[#1A1A1A] font-medium flex items-center gap-2.5">
                            <span className="text-sm w-5">{row.icon}</span>{row.feature}
                          </td>
                          <Cell v={row.starter}/>
                          <Cell v={row.growth} hi/>
                          <Cell v={row.enterprise}/>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                  {/* CTA row */}
                  <tr className="bg-[#FAFAFA] border-t-2 border-[#E8E8E8]">
                    <td className="py-5 px-6 text-xs text-[#888]">All prices exclude 18% GST · Yearly · AWS hosted</td>
                    {cfg.plans.map(p => {
                      const { total: t } = calcGST(p.price)
                      return (
                        <td key={p.id} className={`py-4 px-3 border-l border-[#E8E8E8] ${p.popular ? 'bg-white' : ''}`}>
                          <div className="text-sm font-bold text-[#0A0A0A] text-center mb-2">{formatINR(p.price)}/yr</div>
                          <button onClick={() => { setActivePlan(p); document.getElementById('get-started')?.scrollIntoView({behavior:'smooth'}); }}
                            className={`w-full py-2.5 rounded-lg text-xs font-bold transition-all
                              ${p.popular ? 'bg-[#0A0A0A] text-white hover:opacity-85' : 'bg-white text-[#0A0A0A] border border-[#E8E8E8] hover:border-[#0A0A0A]'}`}>
                            Get {p.name}
                          </button>
                        </td>
                      )
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ══ TESTIMONIALS ══ */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="section-tag">CLIENT STORIES</div>
            {/* H2 */}
            <h2 className="section-title">Trusted by Businesses<br/><em className="font-light italic">Across India.</em></h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-12">
              {cfg.testimonials.map(t => (
                <div key={t.name} className="bg-white border border-[#E8E8E8] rounded-2xl p-7 flex flex-col">
                  <div className="text-[#F59E0B] text-sm tracking-widest mb-4">★★★★★</div>
                  <p className="text-sm text-[#1A1A1A] leading-relaxed italic font-light flex-1 mb-5">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-[#0A0A0A] rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{t.initials}</div>
                    <div>
                      <div className="text-xs font-bold text-[#0A0A0A]">{t.name}</div>
                      <div className="text-[11px] text-[#888] mt-0.5">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Rating strip */}
            <div className="mt-10 bg-[#0A0A0A] rounded-2xl grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
              {[['4.9★','Google Rating'],['565+','Projects Delivered'],['10+','Years in Business'],['200+','Active Clients']].map(([n,l]) => (
                <div key={l} className="py-8 text-center">
                  <div className="text-3xl font-bold text-white tracking-tighter">{n}</div>
                  <div className="text-[11px] text-white/35 mt-2 uppercase tracking-wider">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ PAYMENT ══ */}
        <section className="py-20 px-6 bg-[#FAFAFA]" id="get-started">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <div className="section-tag">GET STARTED TODAY</div>
              {/* H2 */}
              <h2 className="section-title">Secure Your Slot.<br/><em className="font-light italic">Pay in 2 Minutes.</em></h2>
              <p className="section-sub mt-2 mb-8">Complete payment online via Razorpay. Our team WhatsApps you within 2 hours to confirm your onboarding date.</p>
              {[
                {n:'1',t:'Instant confirmation', d:'Payment receipt + onboarding confirmation sent to WhatsApp & email immediately.'},
                {n:'2',t:'Discovery call within 24 hours', d:'NNC team schedules your setup call and documents your exact requirements.'},
                {n:'3',t:'Live in 7 working days', d:'Full setup, data migration, WhatsApp integration, and staff training — guaranteed.'},
                {n:'4',t:'30-day post-launch support', d:'Dedicated WhatsApp support. Issues resolved within 4 hours.'},
              ].map(s => (
                <div key={s.n} className="flex items-start gap-3 py-4 border-b border-[#E8E8E8] last:border-0">
                  <div className="w-7 h-7 bg-[#0A0A0A] rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{s.n}</div>
                  <div>
                    {/* H4 */}
                    <h4 className="text-sm font-bold text-[#0A0A0A] mb-1">{s.t}</h4>
                    <p className="text-xs text-[#555] leading-relaxed">{s.d}</p>
                  </div>
                </div>
              ))}
              <div className="mt-6 bg-white border border-[#E8E8E8] rounded-xl p-5">
                <h4 className="text-sm font-bold mb-2">🛡 Our Delivery Guarantee</h4>
                <p className="text-xs text-[#555] leading-relaxed">If we do not deliver within the promised 7-day timeline, you get a <strong>full refund — no questions asked.</strong></p>
              </div>
            </div>

            <div className="bg-white border border-[#E8E8E8] rounded-2xl p-8">
              <div className="text-lg font-bold text-[#0A0A0A] mb-1 tracking-tight">Start Your Subscription</div>
              <div className="text-xs text-[#888] mb-5">Fill in your details and pay securely via Razorpay</div>

              {/* Selected plan box */}
              <div className="bg-[#FAFAFA] border border-[#E8E8E8] rounded-xl p-4 mb-5 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-[#0A0A0A]">{activePlan.name} Plan</div>
                  <div className="text-[11px] text-[#888] mt-0.5">Yearly subscription · AWS hosted by NNC</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-[#0A0A0A] tracking-tight">{formatINR(activePlan.price)}</div>
                  <div className="text-[10px] text-[#888]">+GST ₹{gst.toLocaleString('en-IN')} = ₹{total.toLocaleString('en-IN')}/yr</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div><label className="form-label">Your Name *</label><input className="form-input" placeholder="Full name" value={pf('name')} onChange={e=>sf('name',e.target.value)}/></div>
                <div><label className="form-label">{cfg.id==='hospitality'?'Hotel Name':'Business Name'} *</label><input className="form-input" placeholder="Business name" value={pf('biz')} onChange={e=>sf('biz',e.target.value)}/></div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div><label className="form-label">Phone *</label><input className="form-input" type="tel" placeholder="+91 XXXXX XXXXX" value={pf('phone')} onChange={e=>sf('phone',e.target.value)}/></div>
                <div><label className="form-label">Email *</label><input className="form-input" type="email" placeholder="you@business.com" value={pf('email')} onChange={e=>sf('email',e.target.value)}/></div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div><label className="form-label">City</label><input className="form-input" placeholder="Bengaluru" value={pf('city')} onChange={e=>sf('city',e.target.value)}/></div>
                <div>
                  <label className="form-label">{cfg.sizeLabel}</label>
                  <select className="form-input cursor-pointer" value={pf('size')}>
                    <option>Select...</option>
                    <option>Small (up to 30)</option>
                    <option>Medium (30–100)</option>
                    <option>Large (100+)</option>
                  </select>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Select Plan *</label>
                <select className="form-input cursor-pointer" value={activePlan.id}
                  onChange={e => setActivePlan(cfg.plans.find(p=>p.id===e.target.value) ?? cfg.plans[1])}>
                  {cfg.plans.map(p => (
                    <option key={p.id} value={p.id}>{p.name} — ₹{p.price.toLocaleString('en-IN')}/year + GST</option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">GST Number (optional)</label>
                <input className="form-input" placeholder="29XXXXX0000X1ZX" value={pf('gst')} onChange={e=>sf('gst',e.target.value)}/>
              </div>

              <button onClick={handlePay} disabled={processing}
                className="btn-black w-full py-4 text-sm mt-2">
                {processing ? '⏳ Processing...' : `🔒 Pay ${formatINR(total)} Securely via Razorpay`}
              </button>
              <div className="text-[11px] text-[#888] text-center mt-2.5">🔒 256-bit SSL · Powered by Razorpay</div>
              <div className="flex flex-wrap gap-1.5 justify-center mt-3">
                {['UPI','Credit Card','Debit Card','Net Banking','EMI','Paytm'].map(m => (
                  <span key={m} className="bg-[#F5F5F5] border border-[#E8E8E8] rounded px-2 py-0.5 text-[10px] font-semibold text-[#888]">{m}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══ ENQUIRY ══ */}
        <section className="py-20 px-6 bg-[#0A0A0A]" id="enquiry">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              {/* H2 */}
              <h2 className="text-4xl font-bold tracking-tight text-white mb-3">Have Questions?<br/><em className="font-light italic text-white/50">Let's Talk.</em></h2>
              <p className="text-sm text-white/50 leading-relaxed mb-8 font-light">Not ready to pay? No problem. Send us your questions, tell us about your business, and we will get back within 4 hours with a personalised recommendation.</p>
              {[
                {icon:'💬', t:'Free Consultation Call', d:'30-minute call with our team. No sales pressure. Honest advice on whether CoreOS CRM is the right fit.'},
                {icon:'🎯', t:'Custom Demo for Your Business', d:'We set up a demo environment with your data so you see exactly what the CRM looks like for your operation.'},
                {icon:'💡', t:'Custom Requirement Discussion', d:'Have a specific feature in mind? Tell us. We have built 565+ custom projects and love solving unique problems.'},
                {icon:'⚡', t:'4-Hour Response Guarantee', d:'All enquiries responded to within 4 hours on working days. WhatsApp enquiries answered even faster.'},
              ].map(f => (
                <div key={f.t} className="flex items-start gap-3 py-4 border-b border-white/[0.06] last:border-0">
                  <div className="w-9 h-9 bg-white/[0.06] rounded-lg flex items-center justify-center text-base flex-shrink-0">{f.icon}</div>
                  <div>
                    {/* H4 */}
                    <h4 className="text-white text-sm font-bold mb-1">{f.t}</h4>
                    <p className="text-xs text-white/40 leading-relaxed">{f.d}</p>
                  </div>
                </div>
              ))}
              <div className="mt-6 flex flex-col gap-3">
                <a href="https://wa.me/919900566466" className="btn-white text-sm self-start">💬 WhatsApp: +91 99005 66466</a>
                <a href="tel:+919900566466" className="text-sm text-white/50 hover:text-white transition-colors">📞 +91 99005 66466</a>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8">
              <div className="text-lg font-bold text-[#0A0A0A] mb-1">Send Us an Enquiry</div>
              <div className="text-xs text-[#888] mb-6">We respond within 4 hours · Mon–Sat, 9 AM – 7 PM</div>
              {enqSent ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
                  <div className="text-3xl mb-3">✅</div>
                  <h3 className="text-base font-bold text-green-800 mb-2">Enquiry Received!</h3>
                  <p className="text-sm text-green-700">Our team will WhatsApp you within 4 hours.<br/>
                    For faster response: <a href="https://wa.me/919900566466" className="font-bold">+91 99005 66466</a></p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div><label className="form-label">Name *</label><input className="form-input" placeholder="Full name" value={enqData.name} onChange={e=>setEnqData(p=>({...p,name:e.target.value}))}/></div>
                    <div><label className="form-label">Business Name *</label><input className="form-input" placeholder="Business name" value={enqData.biz} onChange={e=>setEnqData(p=>({...p,biz:e.target.value}))}/></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div><label className="form-label">Phone *</label><input className="form-input" type="tel" placeholder="+91 XXXXX XXXXX" value={enqData.phone} onChange={e=>setEnqData(p=>({...p,phone:e.target.value}))}/></div>
                    <div><label className="form-label">Email *</label><input className="form-input" type="email" placeholder="you@business.com" value={enqData.email} onChange={e=>setEnqData(p=>({...p,email:e.target.value}))}/></div>
                  </div>
                  <div className="mb-3"><label className="form-label">City & State *</label><input className="form-input" placeholder="Bengaluru, Karnataka" value={enqData.city} onChange={e=>setEnqData(p=>({...p,city:e.target.value}))}/></div>
                  <div className="mb-3">
                    <label className="form-label">Enquiry Type *</label>
                    <select className="form-input cursor-pointer" value={enqData.type} onChange={e=>setEnqData(p=>({...p,type:e.target.value}))}>
                      <option value="">Select enquiry type</option>
                      <option>I want to buy CoreOS CRM</option>
                      <option>I want a free consultation call</option>
                      <option>I want a custom demo</option>
                      <option>I have a custom feature requirement</option>
                      <option>I want to know more about pricing</option>
                      <option>I need support for existing CRM</option>
                      <option>Something else</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="form-label">Your Message</label>
                    <textarea className="form-input min-h-[80px] resize-y" placeholder={`Tell us about your ${cfg.id} business and specific questions about CoreOS CRM...`} value={enqData.msg} onChange={e=>setEnqData(p=>({...p,msg:e.target.value}))}/>
                  </div>
                  <button onClick={submitEnquiry} disabled={sendingEnq} className={`btn-black w-full py-4 text-sm ${sendingEnq ? 'opacity-70 pointer-events-none' : ''}`}>
                    {sendingEnq ? '⏳ Sending...' : "→ Send Enquiry — We'll Respond in 4 Hours"}
                  </button>
                  <div className="text-[11px] text-[#888] text-center mt-2.5">We do not share your data with anyone.</div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* ══ FAQ ══ */}
        <section className="py-20 px-6 bg-white" id="faq">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-16 items-start">
            <div className="lg:col-span-2">
              <div className="section-tag">FAQ</div>
              {/* H2 */}
              <h2 className="text-3xl font-bold tracking-tight mb-4">Questions?<br/>We Have<br/><em className="font-light italic">Answers.</em></h2>
              <p className="text-sm text-[#555] leading-relaxed mb-5">Can not find what you are looking for? Our team is on WhatsApp 9 AM – 7 PM, Mon–Sat.</p>
              <button onClick={() => document.getElementById('enquiry')?.scrollIntoView({behavior:'smooth'})} className="btn-black text-sm mb-4">Send an Enquiry →</button>
              <div className="flex flex-col gap-2 mt-2">
                <a href="tel:+919900566466" className="text-xs text-[#555] hover:text-[#0A0A0A] transition-colors">📞 +91 99005 66466</a>
                <a href="https://wa.me/919900566466" className="text-xs text-[#555] hover:text-[#0A0A0A] transition-colors">💬 WhatsApp Us</a>
                <a href="mailto:info@nakshatranamahacreations.com" className="text-xs text-[#555] hover:text-[#0A0A0A] transition-colors">✉ info@nakshatranamahacreations.com</a>
              </div>
            </div>
            <div className="lg:col-span-3">
              {cfg.faqs.map((faq, i) => (
                <div key={i} className="border-b border-[#E8E8E8] first:border-t">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between py-5 text-left gap-3 bg-transparent border-none cursor-pointer">
                    <span className="text-sm font-semibold text-[#0A0A0A] tracking-tight">{faq.q}</span>
                    <span className={`text-xl font-light flex-shrink-0 transition-all ${openFaq === i ? 'text-[#0A0A0A] rotate-45' : 'text-[#E8E8E8]'}`}>+</span>
                  </button>
                  {openFaq === i && (
                    <div className="pb-5 text-xs text-[#555] leading-relaxed">{faq.a}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ FINAL CTA ══ */}
        <section className="py-20 px-6 bg-[#0A0A0A] text-center">
          <div className="max-w-2xl mx-auto">
            {/* H2 */}
            <h2 className="text-5xl font-bold text-white tracking-tighter leading-tight mb-4">{cfg.finalH2}</h2>
            <p className="text-sm text-white/45 leading-relaxed mb-10 font-light">{cfg.finalP}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button onClick={() => document.getElementById('get-started')?.scrollIntoView({behavior:'smooth'})}
                className="btn-white text-sm px-8 py-4">
                → Get Started — From {formatINR(cfg.plans[0].price)}/year
              </button>
              <a href="https://wa.me/919900566466" className="btn-ghost text-sm px-8 py-4">💬 WhatsApp Us First</a>
            </div>
            <div className="mt-5 text-xs text-white/20">+18% GST · AWS hosted · 7-day go-live guarantee · Full refund if we miss deadline</div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Sticky bar */}
      <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-[#E8E8E8] px-6 py-3 flex items-center justify-between z-50 shadow-lg transition-transform duration-300 ${sticky ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-[#0A0A0A] rounded flex items-center justify-center text-white text-[10px] font-bold">NNC</div>
          <div className="text-xs text-[#555] hidden sm:block"><strong className="text-[#0A0A0A]">CoreOS {cfg.id.charAt(0).toUpperCase()+cfg.id.slice(1)} CRM</strong> — From {formatINR(cfg.plans[0].price)}/year · AWS Hosted</div>
        </div>
        <div className="flex gap-2">
          <a href="https://wa.me/919900566466" className="btn-outline text-xs px-3 py-2">💬 WhatsApp</a>
          <button onClick={() => document.getElementById('get-started')?.scrollIntoView({behavior:'smooth'})} className="btn-black text-xs px-4 py-2">Get Started →</button>
        </div>
      </div>
    </>
  )
}
