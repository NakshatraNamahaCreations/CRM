import Link from 'next/link'
import { INDUSTRIES } from '@/lib/utils'

export default function Footer() {
  return (
    <footer className="bg-[#050505] relative overflow-hidden">
      {/* World map dot pattern */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04]"
        style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Brand bar */}
        <div className="text-center py-14 border-b border-white/[0.07]">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src="/nnclogo.png" alt="NNC Logo" className="h-11 w-auto object-contain" />
            <div className="text-left">
              <div className="text-base font-bold text-white">Nakshatra Namaha Creations Pvt. Ltd.</div>
              <div className="text-[10px] text-white/30 mt-0.5">Your Digital Solutions Partner</div>
            </div>
          </div>
          <p className="text-sm text-white/35 max-w-md mx-auto leading-relaxed font-light">
            Building world-class CRM systems, mobile apps, and digital solutions for businesses across India and beyond.
          </p>
          <div className="flex items-center justify-center gap-5 mt-5 flex-wrap">
            {['Bengaluru','Mumbai','Mysuru','Hyderabad'].map((city, i) => (
              <div key={city} className="flex items-center gap-3">
                {i > 0 && <div className="w-px h-3 bg-white/10" />}
                <span className="text-xs text-white/30">📍 {city}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 py-12 border-b border-white/[0.06]">
          <div className="md:col-span-1">
            <p className="text-xs text-white/30 leading-[1.85] mb-5 max-w-xs">
              Custom software, mobile apps, CRM systems, animation, corporate videos, and digital marketing for Indian businesses.
              <br/><br/>
              <span className="text-white/50 font-semibold">10+ years · 565+ projects · 35+ experts</span>
            </p>
            <div className="flex flex-col gap-2">
              {[
                { icon:'📞', t:'+91 99005 66466', h:'tel:+919900566466' },
                { icon:'✉', t:'info@nakshatranamahacreations.com', h:'mailto:info@nakshatranamahacreations.com' },
                { icon:'🌐', t:'nakshatranamahacreations.com', h:'https://nakshatranamahacreations.com' },
              ].map(c => (
                <a key={c.h} href={c.h} className="flex items-center gap-2 text-xs text-white/40 hover:text-white transition-colors">
                  <span className="w-6 h-6 bg-white/[0.06] rounded-full flex items-center justify-center text-[10px] flex-shrink-0">{c.icon}</span>
                  {c.t}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-bold text-white/25 uppercase tracking-[1.8px] mb-4">CRM Products</h4>
            {INDUSTRIES.map(ind => (
              <Link key={ind.id} href={`/${ind.id}`}
                className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors mb-2.5">
                {ind.icon} {ind.label} CRM
              </Link>
            ))}
            <Link href="/events" className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors mb-2.5">
              ⚖️ Legal CRM
            </Link>
          </div>

          <div>
            <h4 className="text-[10px] font-bold text-white/25 uppercase tracking-[1.8px] mb-4">Company</h4>
            {['About NNC','Portfolio','Case Studies','Careers','Blog'].map(l => (
              <a key={l} href="#" className="block text-xs text-white/40 hover:text-white transition-colors mb-2.5">{l}</a>
            ))}
          </div>

          <div>
            <h4 className="text-[10px] font-bold text-white/25 uppercase tracking-[1.8px] mb-4">Offices</h4>
            <div className="space-y-3">
              <div>
                <div className="text-xs font-semibold text-white/60 mb-1">Bengaluru (HQ)</div>
                <div className="text-[11px] text-white/30 leading-relaxed">#392, Darshan Plaza<br/>Channasandra — 560098</div>
              </div>
              <div>
                <div className="text-xs font-semibold text-white/60 mb-1">Mysuru</div>
                <div className="text-[11px] text-white/30 leading-relaxed">Suswani Towers, JP Nagar<br/>2nd Stage — 570008</div>
              </div>
              <div>
                <div className="text-xs font-semibold text-white/60 mb-1">Mumbai & Hyderabad</div>
                <div className="text-[11px] text-white/30 leading-relaxed">Branch offices</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center py-5 gap-3">
          <div className="text-[11px] text-white/20 text-center md:text-left">
            © 2026 Nakshatra Namaha Creations Pvt. Ltd. · CIN: U72900KA2015PTC082560 · GST: 29AADCN8877R1Z1
          </div>
          <div className="flex gap-4">
            {['Privacy Policy','Terms','Refund Policy'].map(l => (
              <a key={l} href="#" className="text-[11px] text-white/20 hover:text-white/50 transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
