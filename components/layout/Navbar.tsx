'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, Hotel, HeartPulse, Building, GraduationCap, Ticket } from 'lucide-react'
import { INDUSTRIES } from '@/lib/utils'

const getIcon = (id: string, size = 16) => {
  switch(id) {
    case 'hospitality': return <Hotel size={size} />
    case 'healthcare': return <HeartPulse size={size} />
    case 'realestate': return <Building size={size} />
    case 'education': return <GraduationCap size={size} />
    case 'events': return <Ticket size={size} />
    default: return null
  }
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/97 backdrop-blur-xl border-b border-[#E8E8E8]">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <img src="/nnclogo.png" alt="CoreOS CRM Logo" className="h-10 w-auto object-contain" />
        </Link>

        {/* Industry tabs — desktop */}
        <div className="hidden md:flex items-center gap-1">
          {INDUSTRIES.map(ind => (
            <Link key={ind.id} href={`/${ind.id}`}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm border border-transparent
                ${pathname?.startsWith(`/${ind.id}`)
                  ? 'bg-white border-[#E8E8E8] shadow-md text-[#0A0A0A]'
                  : 'text-[#555] hover:bg-[#F5F5F5] hover:text-[#0A0A0A]'}`}>
              <span className="p-1 bg-[#F9F9F9] rounded-md shadow-sm border border-[#E8E8E8]">
                {getIcon(ind.id, 16)}
              </span>
              {ind.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <a href="tel:+919900566466" className="text-xs font-semibold text-[#0A0A0A]">📞 +91 99005 66466</a>
          <Link href="/order-summary" className="btn-black text-xs px-4 py-2">Get Started →</Link>
        </div>

        <button className="md:hidden p-2 text-[#0A0A0A]" onClick={() => setOpen(!open)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-[#E8E8E8] px-6 py-4 flex flex-col gap-3">
          {INDUSTRIES.map(ind => (
            <Link key={ind.id} href={`/${ind.id}`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 p-3 rounded-lg text-sm font-medium text-[#555] bg-[#F9F9F9] border border-[#E8E8E8]">
              <div className="p-1.5 bg-white rounded-md shadow-sm border border-[#E8E8E8]">
                {getIcon(ind.id, 18)}
              </div>
              {ind.label} CRM
            </Link>
          ))}
          <div className="border-t border-[#E8E8E8] pt-3 mt-1">
            <Link href="/order-summary" className="btn-black w-full text-sm py-3 flex justify-center" onClick={() => setOpen(false)}>
              Get Started →
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
