export function calcGST(price: number) {
  const gst  = Math.round(price * 0.18)
  const cgst = Math.round(gst / 2)
  const sgst = gst - cgst
  return { gst, cgst, sgst, total: price + gst }
}

export function formatINR(n: number): string {
  return '₹' + n.toLocaleString('en-IN')
}

export function genRef(): string {
  return 'NNC-2026-' + String(Math.floor(10000 + Math.random() * 90000))
}

export function toIndianWords(n: number): string {
  const ones = ['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine',
    'Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen']
  const tens = ['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety']
  if (n === 0) return 'Zero'
  if (n < 20) return ones[n]
  if (n < 100) return tens[Math.floor(n/10)] + (n%10 ? ' '+ones[n%10] : '')
  if (n < 1000) return ones[Math.floor(n/100)] + ' Hundred' + (n%100 ? ' '+toIndianWords(n%100) : '')
  if (n < 100000) return toIndianWords(Math.floor(n/1000)) + ' Thousand' + (n%1000 ? ' '+toIndianWords(n%1000) : '')
  if (n < 10000000) return toIndianWords(Math.floor(n/100000)) + ' Lakh' + (n%100000 ? ' '+toIndianWords(n%100000) : '')
  return toIndianWords(Math.floor(n/10000000)) + ' Crore' + (n%10000000 ? ' '+toIndianWords(n%10000000) : '')
}

export const INDUSTRIES = [
  { id: 'hospitality', label: 'Hospitality', icon: '🏨', slug: '/hospitality' },
  { id: 'healthcare',  label: 'Healthcare',  icon: '🏥', slug: '/healthcare'  },
  { id: 'realestate',  label: 'Real Estate', icon: '🏢', slug: '/realestate'  },
  { id: 'education',   label: 'Education',   icon: '🎓', slug: '/education'   },
  { id: 'events',      label: 'Events',      icon: '🎪', slug: '/events'      },
] as const
