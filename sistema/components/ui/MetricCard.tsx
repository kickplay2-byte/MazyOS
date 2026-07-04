import Link from 'next/link'

interface MetricCardProps {
  label: string
  value: string | number
  sub?: string
  href?: string
  valueColor?: string
  alert?: boolean
}

export default function MetricCard({ label, value, sub, href, valueColor, alert }: MetricCardProps) {
  const inner = (
    <div
      className={`bg-white border rounded p-4 transition-colors ${
        href ? 'hover:border-[#DFA568] group cursor-pointer' : ''
      } ${alert ? 'border-red-200 bg-red-50/30' : 'border-gray-200'}`}
    >
      <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">{label}</div>
      <div
        className={`text-2xl font-semibold ${href ? 'group-hover:text-[#DFA568] transition-colors' : ''}`}
        style={{ color: valueColor ?? '#1F2346' }}
      >
        {value}
      </div>
      {sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
    </div>
  )

  if (href) return <Link href={href}>{inner}</Link>
  return inner
}
