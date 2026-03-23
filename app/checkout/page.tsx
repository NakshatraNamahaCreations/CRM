'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import CheckoutNav from '@/components/layout/CheckoutNav'
import Footer from '@/components/layout/Footer'
import { allIndustryData } from '@/lib/industryData'
import { calcGST, formatINR, genRef } from '@/lib/utils'
import { useOrder } from '@/lib/store'
import type { Plan } from '@/lib/types'

type PayMethod = 'card' | 'upi' | 'nb' | 'wallet'

const BANKS   = ['SBI','HDFC','ICICI','Axis','Kotak','PNB','BOB','Other']
const WALLETS = ['Paytm Wallet','Amazon Pay','Mobikwik','Airtel Money']

export default function CheckoutPage() {
  const router = useRouter()
  const { order, setOrder } = useOrder()

  const cfg  = allIndustryData[order.industryId] ?? allIndustryData['hospitality']
  const [plan, setPlan] = useState<Plan>(cfg.plans.find(p => p.id === order.planId) ?? cfg.plans[1])

  const [payMethod, setPayMethod] = useState<PayMethod>('card')
  const [processing, setProcessing] = useState(false)
  const [selectedBank, setSelectedBank] = useState('')
  const [errors, setErrors] = useState<Record<string,string>>({})
  const [form, setForm] = useState({
    name:  order.name,
    biz:   order.business,
    phone: order.phone,
    email: order.email,
    city:  order.city,
    state: order.state,
    size:  order.size,
    gst:   order.gst,
  })

  const sf = (k: string, v: string) => setForm(p => ({...p, [k]: v}))
  const { gst, cgst, sgst, total } = calcGST(plan.price)

  function validate() {
    const e: Record<string,string> = {}
    if (!form.name.trim())  e.name  = 'Please enter your name'
    if (!form.biz.trim())   e.biz   = 'Please enter your business name'
    if (!/^[\+\d\s]{10,14}$/.test(form.phone)) e.phone = 'Please enter a valid phone number'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Please enter a valid email'
    if (!form.city.trim())  e.city  = 'Please enter your city'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handlePay() {
    if (!validate()) { window.scrollTo({ top: 180, behavior: 'smooth' }); return }
    setProcessing(true)
    setOrder({
      name: form.name, business: form.biz, phone: form.phone,
      email: form.email, city: form.city, state: form.state,
      size: form.size, gst: form.gst, planId: plan.id,
      ref: genRef(),
    })
    setTimeout(() => { router.push('/thankyou') }, 1800)
  }

  function Field({ k, label, placeholder, type='text', half=false }: {
    k: keyof typeof form; label: string; placeholder: string; type?: string; half?: boolean
  }) {
    return (
      <div>
        <label className="form-label">{label} *</label>
        <input type={type} placeholder={placeholder} value={form[k]}
          onChange={e => sf(k, e.target.value)}
          className={`form-input ${errors[k] ? 'border-red-500' : ''}`}/>
        {errors[k] && <p className="text-xs text-red-500 mt-1">{errors[k]}</p>}
      </div>
    )
  }

  return (
    <>
      <CheckoutNav />
      <main className="min-h-screen bg-[#FAFAFA]">
        <div className="max-w-5xl mx-auto px-6 py-10">

          <Link href="/order-summary" className="btn-outline text-xs px-4 py-2 mb-6 inline-flex">← Back to Plans</Link>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">

            {/* ── LEFT ── */}
            <div className="space-y-5">

              {/* Contact details */}
              <div className="bg-white border border-[#E8E8E8] rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-[#E8E8E8] flex items-center justify-between">
                  <div className="text-sm font-bold text-[#0A0A0A]">Your Details</div>
                  <div className="text-xs font-semibold text-[#888] bg-[#F5F5F5] px-3 py-1 rounded-full">Step 2 of 4</div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field k="name"  label="Full Name"         placeholder="Your full name"/>
                    <Field k="biz"   label="Business Name"     placeholder="Your business name"/>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field k="phone" label="Phone Number"      placeholder="+91 XXXXX XXXXX" type="tel"/>
                    <Field k="email" label="Email Address"     placeholder="you@business.com" type="email"/>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field k="city"  label="City"              placeholder="Bengaluru"/>
                    <div>
                      <label className="form-label">State</label>
                      <select className="form-input" value={form.state} onChange={e => sf('state', e.target.value)}>
                        <option value="">Select state</option>
                        {['Karnataka','Maharashtra','Tamil Nadu','Telangana','Kerala','Delhi','Gujarat','Rajasthan','Other'].map(s => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Business Size</label>
                      <select className="form-input" value={form.size} onChange={e => sf('size', e.target.value)}>
                        {['Small (up to 30)','Medium (30–100)','Large (100+)'].map(o => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="form-label">GST Number (optional)</label>
                      <input className="form-input" placeholder="29XXXXX0000X1ZX" value={form.gst} onChange={e => sf('gst', e.target.value)}/>
                    </div>
                  </div>
                </div>
              </div>

              {/* Plan selector */}
              <div className="bg-white border border-[#E8E8E8] rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-[#E8E8E8]">
                  <div className="text-sm font-bold text-[#0A0A0A]">Selected Plan</div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-3 gap-3">
                    {cfg.plans.map(p => (
                      <button key={p.id} onClick={() => { setPlan(p); setOrder({ planId: p.id }) }}
                        className={`border rounded-xl p-3 text-center cursor-pointer transition-all relative
                          ${plan.id === p.id ? 'border-[#0A0A0A] bg-[#0A0A0A]' : 'border-[#E8E8E8] bg-white hover:border-[#888]'}`}>
                        {p.popular && (
                          <div className={`absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] font-bold px-2 py-0.5 rounded-full
                            ${plan.id === p.id ? 'bg-white text-[#0A0A0A]' : 'bg-[#0A0A0A] text-white'}`}>★ Popular</div>
                        )}
                        <div className={`text-[10px] font-bold uppercase tracking-wide mb-1 ${plan.id === p.id ? 'text-white/60' : 'text-[#888]'}`}>{p.name}</div>
                        <div className={`text-lg font-bold tracking-tight ${plan.id === p.id ? 'text-white' : 'text-[#0A0A0A]'}`}>{formatINR(p.price)}</div>
                        <div className={`text-[10px] mt-0.5 ${plan.id === p.id ? 'text-white/40' : 'text-[#888]'}`}>/ year</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Payment method */}
              <div className="bg-white border border-[#E8E8E8] rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-[#E8E8E8] flex items-center justify-between">
                  <div className="text-sm font-bold text-[#0A0A0A]">Payment Method</div>
                  <div className="text-xs font-semibold text-[#888] bg-[#F5F5F5] px-3 py-1 rounded-full">Step 3 of 4</div>
                </div>
                <div className="p-6">
                  {/* Tabs */}
                  <div className="grid grid-cols-4 gap-2 mb-6">
                    {([
                      { id:'card',   icon:'💳', label:'Card'        },
                      { id:'upi',    icon:'📱', label:'UPI'         },
                      { id:'nb',     icon:'🏦', label:'Net Banking' },
                      { id:'wallet', icon:'👛', label:'Wallet'      },
                    ] as const).map(m => (
                      <button key={m.id} onClick={() => setPayMethod(m.id)}
                        className={`border rounded-xl py-3 text-center cursor-pointer transition-all
                          ${payMethod === m.id
                            ? 'border-[#0A0A0A] bg-[#0A0A0A] text-white'
                            : 'border-[#E8E8E8] text-[#555] hover:border-[#888] hover:text-[#0A0A0A]'}`}>
                        <div className="text-lg mb-0.5">{m.icon}</div>
                        <div className="text-[10px] font-semibold">{m.label}</div>
                      </button>
                    ))}
                  </div>

                  {/* Card */}
                  {payMethod === 'card' && (
                    <div className="space-y-4">
                      <div><label className="form-label">Card Number</label><input className="form-input" placeholder="1234  5678  9012  3456" maxLength={19}/></div>
                      <div className="grid grid-cols-2 gap-4">
                        <div><label className="form-label">Expiry Date</label><input className="form-input" placeholder="MM / YY" maxLength={7}/></div>
                        <div><label className="form-label">CVV</label><input className="form-input" placeholder="•••" maxLength={4} type="password"/></div>
                      </div>
                      <div><label className="form-label">Name on Card</label><input className="form-input" placeholder="As printed on card"/></div>
                    </div>
                  )}

                  {/* UPI */}
                  {payMethod === 'upi' && (
                    <div>
                      <label className="form-label">UPI ID</label>
                      <input className="form-input mb-3" placeholder="yourname@paytm / @gpay / @ybl"/>
                      <div className="flex gap-2 flex-wrap">
                        {['📱 PhonePe','G Pay','Paytm','BHIM'].map(w => (
                          <button key={w} className="border border-[#E8E8E8] rounded-lg px-3 py-2 text-xs font-semibold text-[#555] hover:border-[#0A0A0A] hover:text-[#0A0A0A] transition-all">{w}</button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Net Banking */}
                  {payMethod === 'nb' && (
                    <div className="grid grid-cols-4 gap-2">
                      {BANKS.map(b => (
                        <button key={b} onClick={() => setSelectedBank(b === selectedBank ? '' : b)}
                          className={`border rounded-lg py-2.5 text-xs font-semibold transition-all
                            ${selectedBank === b ? 'border-[#0A0A0A] bg-[#0A0A0A] text-white' : 'border-[#E8E8E8] text-[#555] hover:border-[#0A0A0A]'}`}>
                          {b}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Wallet */}
                  {payMethod === 'wallet' && (
                    <div className="flex gap-2 flex-wrap">
                      {WALLETS.map(w => (
                        <button key={w} className="border border-[#E8E8E8] rounded-lg px-3 py-2 text-xs font-semibold text-[#555] hover:border-[#0A0A0A] hover:text-[#0A0A0A] transition-all">{w}</button>
                      ))}
                    </div>
                  )}

                  {/* Pay button */}
                  <button onClick={handlePay} disabled={processing}
                    className="btn-black w-full py-4 text-sm mt-6">
                    {processing ? '⏳ Processing payment...' : `🔒 Pay ${formatINR(total)} Securely via Razorpay`}
                  </button>
                  <div className="text-center text-xs text-[#888] mt-2.5 flex items-center justify-center gap-1.5">
                    🔒 256-bit SSL · Powered by Razorpay
                  </div>
                  <div className="flex flex-wrap gap-1.5 justify-center mt-3">
                    {['Visa','Mastercard','RuPay','UPI','Net Banking','EMI'].map(b => (
                      <span key={b} className="bg-[#F5F5F5] border border-[#E8E8E8] rounded px-2 py-0.5 text-[10px] font-semibold text-[#888]">{b}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── RIGHT: ORDER SUMMARY ── */}
            <div className="sticky top-20">
              <div className="bg-white border border-[#E8E8E8] rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-[#E8E8E8]">
                  <div className="text-sm font-bold text-[#0A0A0A]">Order Summary</div>
                </div>
                <div className="p-5">
                  <div className="bg-[#FAFAFA] border border-[#E8E8E8] rounded-xl p-4 mb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-sm font-bold text-[#0A0A0A]">{plan.name} Plan</div>
                        <div className="text-[11px] text-[#888] mt-0.5">
                          CoreOS {cfg.id.charAt(0).toUpperCase()+cfg.id.slice(1)} CRM · Yearly
                        </div>
                      </div>
                      <Link href="/order-summary" className="text-xs text-[#888] underline">Change</Link>
                    </div>
                  </div>

                  <div className="mb-4 space-y-2">
                    {plan.features.slice(0, 6).map(f => (
                      <div key={f} className="flex items-start gap-2 text-xs text-[#0A0A0A]">
                        <div className="w-4 h-4 bg-[#0A0A0A] rounded-full flex items-center justify-center text-white text-[8px] font-bold flex-shrink-0 mt-0.5">✓</div>
                        {f}
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-[#E8E8E8] pt-4 space-y-2">
                    {[
                      ['Plan price', formatINR(plan.price)],
                      ['GST (18%)',  formatINR(gst)],
                      ['Setup fee',  'FREE'],
                      ['Data migration', 'FREE'],
                    ].map(([l, v]) => (
                      <div key={l} className="flex justify-between text-xs text-[#555]">
                        <span>{l}</span>
                        <span className={`font-semibold ${v === 'FREE' ? 'text-green-600' : 'text-[#0A0A0A]'}`}>{v}</span>
                      </div>
                    ))}
                    <div className="flex justify-between pt-2 border-t border-[#E8E8E8]">
                      <span className="text-sm font-bold text-[#0A0A0A]">Total Due Today</span>
                      <span className="text-lg font-bold text-[#0A0A0A] tracking-tight">{formatINR(total)}</span>
                    </div>
                    <div className="text-[10px] text-[#888] text-right">Renews annually · Cancel anytime</div>
                  </div>
                </div>

                <div className="border-t border-[#E8E8E8] p-5 space-y-3">
                  {[
                    { icon:'🛡', text:'30-day delivery guarantee. Full refund if we don\'t deliver on time.' },
                    { icon:'☁️', text:'Hosted on NNC\'s AWS infrastructure. Your data stays in India.' },
                    { icon:'📞', text:'Questions? WhatsApp +91 99005 66466 anytime.' },
                  ].map(t => (
                    <div key={t.text} className="flex items-start gap-2.5 text-xs text-[#555] bg-[#FAFAFA] rounded-lg p-2.5">
                      <span className="text-sm flex-shrink-0">{t.icon}</span>{t.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
