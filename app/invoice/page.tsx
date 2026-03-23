'use client'
import Link from 'next/link'
import CheckoutNav from '@/components/layout/CheckoutNav'
import { allIndustryData } from '@/lib/industryData'
import { calcGST, formatINR, toIndianWords } from '@/lib/utils'
import { useOrder } from '@/lib/store'

export default function InvoicePage() {
  const { order } = useOrder()
  const cfg   = allIndustryData[order.industryId] ?? allIndustryData['hospitality']
  const plan  = cfg.plans.find(p => p.id === order.planId) ?? cfg.plans[1]
  const { gst, cgst, sgst, total } = calcGST(plan.price)
  const ref   = order.ref || 'NNC-2026-00847'
  const invNo = 'NNC-INV-' + ref.split('-').slice(-1)[0]
  const today = new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'long', year:'numeric' })
  const indLabel = cfg.id.charAt(0).toUpperCase() + cfg.id.slice(1)

  return (
    <>
      {/* Actions — hidden on print */}
      <div className="print:hidden">
        <CheckoutNav />
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between bg-[#FAFAFA] border-b border-[#E8E8E8]">
          <Link href="/thankyou" className="btn-outline text-xs px-4 py-2">← Back</Link>
          <div className="flex gap-2">
            <button onClick={() => window.print()} className="btn-outline text-xs px-4 py-2">🖨 Print</button>
            <button onClick={() => window.print()} className="btn-black text-xs px-5 py-2">⬇ Download PDF</button>
          </div>
        </div>
      </div>

      {/* Invoice document */}
      <div className="bg-[#F0F0F0] print:bg-white min-h-screen py-8 px-4 print:p-0">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl overflow-hidden shadow-lg print:shadow-none print:rounded-none">

          {/* Header */}
          <div className="bg-[#0A0A0A] px-10 py-8 flex items-start justify-between relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.04]"
              style={{ backgroundImage:'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize:'20px 20px' }}/>
            <div className="flex items-start gap-3 relative z-10">
              <div className="w-11 h-11 bg-white rounded-lg flex items-center justify-center text-[#0A0A0A] font-bold text-xs flex-shrink-0">NNC</div>
              <div>
                <div className="text-sm font-bold text-white">Nakshatra Namaha Creations Pvt. Ltd.</div>
                <div className="text-[10px] text-white/40 mt-0.5">Your Digital Solutions Partner</div>
                <div className="text-[10px] text-white/30 mt-2 leading-relaxed">
                  #392, Darshan Plaza, Channasandra<br/>
                  Bengaluru — 560098, Karnataka<br/>
                  GSTIN: 29AADCN8877R1Z1
                </div>
              </div>
            </div>
            <div className="text-right relative z-10">
              <div className="text-3xl font-bold text-white tracking-tighter leading-none">TAX INVOICE</div>
              <div className="text-xs text-white/40 mt-2">{invNo}</div>
              <div className="text-[10px] text-white/30 mt-2 leading-relaxed">
                Date: {today}<br/>
                Due: {today}<br/>
                PAN: AADCN8877R
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="px-10 py-8">
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 text-xs font-bold px-4 py-1.5 rounded-full mb-6">
              ✓ PAYMENT RECEIVED
            </div>

            {/* Meta */}
            <div className="grid grid-cols-3 gap-6 pb-7 border-b-2 border-[#E8E8E8] mb-7">
              <div>
                <div className="text-[9px] font-bold text-[#888] uppercase tracking-widest mb-2">Billed To</div>
                <div className="text-sm font-bold text-[#0A0A0A]">{order.name || 'Client Name'}</div>
                <div className="text-xs text-[#555] mt-0.5">{order.business || 'Business Name'}</div>
                <div className="text-xs text-[#555]">{order.city || 'City'}{order.state ? `, ${order.state}` : ''}</div>
                {order.gst && <div className="text-xs text-[#555]">GSTIN: {order.gst}</div>}
              </div>
              <div>
                <div className="text-[9px] font-bold text-[#888] uppercase tracking-widest mb-2">Invoice Details</div>
                {[
                  ['Invoice No', invNo],
                  ['Date', today],
                  ['Reference', ref],
                  ['Payment', 'Online / Razorpay'],
                ].map(([l, v]) => (
                  <div key={l} className="text-xs mb-0.5">
                    <span className="text-[#888]">{l}: </span>
                    <span className="font-semibold text-[#0A0A0A]">{v}</span>
                  </div>
                ))}
              </div>
              <div>
                <div className="text-[9px] font-bold text-[#888] uppercase tracking-widest mb-2">Amount Paid</div>
                <div className="text-2xl font-bold text-[#0A0A0A] tracking-tighter">{formatINR(total)}</div>
                <div className="text-xs text-green-600 font-semibold mt-1">● Paid in full</div>
              </div>
            </div>

            {/* Line items */}
            <table className="w-full mb-7 text-xs border-collapse">
              <thead>
                <tr className="bg-[#0A0A0A]">
                  {['#','Description','HSN/SAC','Period','Rate','Amount'].map((h, i) => (
                    <th key={h} className={`py-2.5 px-3 text-[9px] font-bold text-white/60 uppercase tracking-wide
                      ${i === 1 ? 'text-left' : 'text-right'} ${i === 0 ? 'text-left w-8' : ''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#E8E8E8]">
                  <td className="py-3 px-3 align-top">1</td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-[#0A0A0A]">CoreOS {indLabel} CRM — {plan.name} Plan</div>
                    <div className="text-[11px] text-[#555] mt-1 leading-relaxed">
                      Cloud-based {indLabel} Management Software · AWS Hosted<br/>
                      Includes: {plan.features.slice(0,3).join(', ')}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right text-[#555] align-top">998314</td>
                  <td className="py-3 px-3 text-right text-[#555] align-top whitespace-nowrap">Apr 2026 – Mar 2027</td>
                  <td className="py-3 px-3 text-right align-top">{formatINR(plan.price)}</td>
                  <td className="py-3 px-3 text-right font-semibold align-top">{formatINR(plan.price)}</td>
                </tr>
                <tr className="border-b border-[#E8E8E8] bg-[#FAFAFA]">
                  <td className="py-3 px-3">2</td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-[#0A0A0A]">Setup, Data Migration & Staff Training</div>
                    <div className="text-[11px] text-green-600 font-semibold mt-0.5">Complimentary — Included in Plan</div>
                  </td>
                  <td className="py-3 px-3 text-right text-[#555]">998313</td>
                  <td className="py-3 px-3 text-right text-[#555]">One-time</td>
                  <td className="py-3 px-3 text-right">₹0</td>
                  <td className="py-3 px-3 text-right font-semibold">₹0</td>
                </tr>
              </tbody>
            </table>

            {/* Totals + notes */}
            <div className="grid grid-cols-2 gap-10 items-start">
              <div>
                <div className="text-[9px] font-bold text-[#888] uppercase tracking-widest mb-3">Terms & Notes</div>
                <div className="text-[11px] text-[#555] leading-relaxed space-y-1.5">
                  <p>1. Computer-generated invoice — no physical signature required.</p>
                  <p>2. All amounts in Indian Rupees (INR).</p>
                  <p>3. CGST & SGST for intra-state. IGST for inter-state transactions.</p>
                  <p>4. Subscription renews annually. 30-day cancellation notice required.</p>
                  <p>5. Data hosted on AWS Mumbai (ap-south-1). AES-256 encrypted.</p>
                  <p>6. Queries: info@nakshatranamahacreations.com · +91 99005 66466</p>
                </div>
                <div className="mt-4 bg-[#FAFAFA] rounded-xl p-3 text-[11px] text-[#555]">
                  <strong className="text-[#0A0A0A] block mb-1">Bank Details (NEFT / RTGS)</strong>
                  Bank: HDFC Bank · A/C: 50200012345678<br/>
                  IFSC: HDFC0001234 · Nakshatra Namaha Creations Pvt Ltd
                </div>
              </div>
              <div>
                <div className="space-y-0">
                  {[
                    { l:'Subtotal',   v: formatINR(plan.price),  green:false },
                    { l:'CGST @ 9%', v: formatINR(cgst),        green:false },
                    { l:'SGST @ 9%', v: formatINR(sgst),        green:false },
                    { l:'Discount',  v: '₹0',                   green:true  },
                  ].map(row => (
                    <div key={row.l} className="flex justify-between py-2.5 border-b border-[#E8E8E8] text-xs">
                      <span className="text-[#555]">{row.l}</span>
                      <span className={`font-semibold ${row.green ? 'text-green-600' : 'text-[#0A0A0A]'}`}>{row.v}</span>
                    </div>
                  ))}
                  <div className="flex justify-between bg-[#0A0A0A] rounded-xl px-4 py-3 mt-2">
                    <span className="text-sm font-semibold text-white/70">Total Amount</span>
                    <span className="text-xl font-bold text-white tracking-tight">{formatINR(total)}</span>
                  </div>
                  <div className="text-[10px] text-[#888] text-right mt-2 italic">
                    Rupees {toIndianWords(total)} Only
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Invoice footer */}
          <div className="bg-[#FAFAFA] border-t border-[#E8E8E8] px-10 py-5 flex justify-between items-start flex-wrap gap-4">
            <div className="text-[11px] text-[#555] leading-relaxed">
              <strong className="text-[#0A0A0A]">Nakshatra Namaha Creations Pvt. Ltd.</strong><br/>
              CIN: U72900KA2015PTC082560 · GSTIN: 29AADCN8877R1Z1<br/>
              Bengaluru · Mumbai · Mysuru · Hyderabad
            </div>
            <div className="text-right text-[11px] text-[#555] leading-relaxed">
              <strong className="text-[#0A0A0A]">Authorised Signatory</strong><br/>
              Harish Kashyap — Founder & MD<br/>
              <span className="text-green-600 font-semibold">Digitally Signed ✓</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
