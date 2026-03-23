'use client'
import Link from 'next/link'
import CheckoutNav from '@/components/layout/CheckoutNav'
import Footer from '@/components/layout/Footer'
import { allIndustryData } from '@/lib/industryData'
import { calcGST, formatINR } from '@/lib/utils'
import { useOrder } from '@/lib/store'

const TIMELINE = [
  { title:'Payment confirmed',         text:'Receipt sent to your WhatsApp & email',       time:'✓ Done — just now',    done:true  },
  { title:'NNC team calls you',        text:'We call within 24 hours to schedule your discovery session', time:'⏱ Within 24 hours', done:false },
  { title:'Setup & configuration',     text:'CoreOS CRM configured on AWS with your data', time:'⏱ Days 2–5',           done:false },
  { title:'Data migration',            text:'Existing records, data & templates migrated',  time:'⏱ Days 4–6',           done:false },
  { title:'Go live + staff training',  text:'2-hour training. Live on CoreOS CRM day 7',   time:'⏱ Day 7',              done:false },
]

export default function ThankYouPage() {
  const { order } = useOrder()
  const cfg  = allIndustryData[order.industryId] ?? allIndustryData['hospitality']
  const plan = cfg.plans.find(p => p.id === order.planId) ?? cfg.plans[1]
  const { total } = calcGST(plan.price)
  const ref  = order.ref || 'NNC-2026-00847'
  const indLabel = cfg.id.charAt(0).toUpperCase() + cfg.id.slice(1)

  return (
    <>
      <CheckoutNav />
      <main className="min-h-screen bg-white">

        {/* Hero */}
        <div className="bg-[#0A0A0A] relative overflow-hidden py-20 px-6 text-center">
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{ backgroundImage:'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize:'24px 24px' }}/>
          <div className="relative z-10">
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-2xl font-bold">✓</div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tighter mb-3">
              Payment <em className="font-light italic">Confirmed.</em>
            </h1>
            <p className="text-sm text-white/50 max-w-md mx-auto leading-relaxed font-light mb-8">
              Welcome to the CoreOS CRM family. Your {indLabel.toLowerCase()} business is about to get a serious upgrade.
            </p>

            {/* Reference strip */}
            <div className="inline-flex items-center gap-5 bg-white/[0.08] border border-white/15 rounded-xl px-6 py-3.5 flex-wrap justify-center">
              {[
                { label:'Booking Reference', value: ref },
                { label:'Industry',          value: indLabel },
                { label:'Plan',              value: plan.name },
                { label:'Amount Paid',       value: formatINR(total) },
              ].map((item, i) => (
                <div key={item.label} className="flex items-center gap-5">
                  {i > 0 && <div className="w-px h-8 bg-white/10"/>}
                  <div>
                    <div className="text-[9px] text-white/40 uppercase tracking-widest mb-0.5">{item.label}</div>
                    <div className="text-sm font-bold text-white">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="max-w-4xl mx-auto px-6 py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Timeline */}
            <div className="bg-white border border-[#E8E8E8] rounded-2xl p-6">
              <h2 className="text-sm font-bold text-[#0A0A0A] mb-6">What happens next</h2>
              {TIMELINE.map((item, i) => (
                <div key={i} className="flex gap-4 pb-5 relative">
                  {i < TIMELINE.length - 1 && (
                    <div className="absolute left-4 top-8 bottom-0 w-px bg-[#E8E8E8]"/>
                  )}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 relative z-10
                    ${item.done ? 'bg-[#0A0A0A] text-white' : 'bg-white border-2 border-[#E8E8E8] text-[#888]'}`}>
                    {item.done ? '✓' : i + 1}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#0A0A0A] mb-0.5">{item.title}</div>
                    <div className="text-[11px] text-[#555] leading-relaxed">{item.text}</div>
                    <div className={`text-[10px] font-semibold mt-1 ${item.done ? 'text-green-600' : 'text-[#888]'}`}>{item.time}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right column */}
            <div className="flex flex-col gap-5">

              {/* Contact */}
              <div className="bg-white border border-[#E8E8E8] rounded-2xl p-6">
                <h2 className="text-sm font-bold text-[#0A0A0A] mb-4">Your dedicated contact</h2>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-[#0A0A0A] rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">HK</div>
                  <div>
                    <div className="text-sm font-bold text-[#0A0A0A]">Harish Kashyap</div>
                    <div className="text-xs text-[#888]">Founder & MD — Nakshatra Namaha Creations</div>
                  </div>
                </div>
                <div className="flex gap-2 mb-3">
                  <a href="https://wa.me/919900566466"
                    className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white text-xs font-bold py-2.5 rounded-lg hover:opacity-90 transition-opacity">
                    💬 WhatsApp
                  </a>
                  <a href="tel:+919900566466"
                    className="flex-1 flex items-center justify-center gap-2 bg-[#F5F5F5] border border-[#E8E8E8] text-[#0A0A0A] text-xs font-bold py-2.5 rounded-lg hover:border-[#0A0A0A] transition-all">
                    📞 Call Us
                  </a>
                </div>
                <div className="text-[10px] text-[#888] text-center">Available Mon–Sat, 9 AM – 7 PM IST</div>
              </div>

              {/* Invoice */}
              <div className="bg-white border border-[#E8E8E8] rounded-2xl p-6">
                <h2 className="text-sm font-bold text-[#0A0A0A] mb-4">Your receipt</h2>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-xs font-bold text-[#0A0A0A]">{plan.name} Plan — CoreOS {indLabel} CRM</div>
                    <div className="text-[10px] text-[#888] mt-1">Ref: {ref}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-[#0A0A0A] tracking-tight">{formatINR(total)}</div>
                    <div className="text-[10px] text-green-600 font-bold mt-0.5">PAID ✓</div>
                  </div>
                </div>
                <Link href="/invoice"
                  className="btn-black w-full text-xs py-3">
                  📄 View & Download GST Invoice
                </Link>
              </div>

              {/* While you wait */}
              <div className="bg-white border border-[#E8E8E8] rounded-2xl p-6">
                <h2 className="text-sm font-bold text-[#0A0A0A] mb-3">While you wait</h2>
                {[
                  `📋 List your current ${indLabel.toLowerCase()} details — we will ask on the discovery call`,
                  '📊 Export any existing data from Excel / Google Sheets',
                  '📱 Save +91 99005 66466 on WhatsApp — our team will message you first',
                ].map(item => (
                  <div key={item} className="flex items-start gap-2 text-xs text-[#0A0A0A] bg-[#FAFAFA] rounded-lg p-2.5 mb-2 last:mb-0">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link href={`/${order.industryId}`} className="text-xs text-[#888] hover:text-[#0A0A0A] transition-colors">
              ← Back to {indLabel} CRM page
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
