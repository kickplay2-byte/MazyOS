import Link from 'next/link'

interface AdvisorInsightCardProps {
  label: string
  value: string | number
  href: string
  alert?: boolean
}

export default function AdvisorInsightCard({ label, value, href, alert }: AdvisorInsightCardProps) {
  return (
    <Link
      href={href}
      className={`bg-white border rounded p-4 hover:border-[#DFA568] transition-colors group block ${
        alert ? 'border-red-200 bg-red-50/40' : 'border-gray-200'
      }`}
    >
      <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">{label}</div>
      <div
        className="text-2xl font-semibold group-hover:text-[#DFA568] transition-colors"
        style={{ color: alert ? '#c2410c' : '#1F2346' }}
      >
        {value}
      </div>
    </Link>
  )
}
