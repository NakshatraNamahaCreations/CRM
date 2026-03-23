'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const STEPS = [
  { label:'Plan',     href:'/order-summary' },
  { label:'Details',  href:'/checkout'      },
  { label:'Confirm',  href:'/thankyou'      },
  { label:'Invoice',  href:'/invoice'       },
]

export default function CheckoutNav() {
  const path = usePathname() ?? ''
  const current = STEPS.findIndex(s => path.startsWith(s.href)) + 1

  return (
    <nav className="bg-white border-b border-[#E8E8E8] sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <img src="/nnclogo.png" alt="CoreOS CRM Logo" className="h-8 w-auto object-contain" />
        </Link>

        <div className="hidden sm:flex items-center gap-1">
          {STEPS.map((step, i) => {
            const n = i + 1
            const done   = n < current
            const active = n === current
            return (
              <div key={step.href} className="flex items-center">
                <div className={`flex items-center gap-2 px-3 text-xs font-semibold
                  ${done ? 'text-green-600' : active ? 'text-[#0A0A0A]' : 'text-[#888]'}`}>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold
                    ${done   ? 'bg-green-600 border-green-600 text-white'
                    : active ? 'bg-[#0A0A0A] border-[#0A0A0A] text-white'
                    :          'border-[#E8E8E8] text-[#888]'}`}>
                    {done ? '✓' : n}
                  </div>
                  {step.label}
                </div>
                {i < STEPS.length - 1 && <div className="w-8 h-px bg-[#E8E8E8] mx-1" />}
              </div>
            )
          })}
        </div>

        <div className="text-xs text-[#888] flex items-center gap-1">🔒 Secured by Razorpay</div>
      </div>
    </nav>
  )
}
