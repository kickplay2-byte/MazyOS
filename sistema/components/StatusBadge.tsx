type Color = 'green' | 'yellow' | 'red' | 'gray' | 'blue' | 'orange'

const colorMap: Record<Color, string> = {
  green: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  yellow: 'bg-amber-50 text-amber-700 border border-amber-200',
  red: 'bg-red-50 text-red-700 border border-red-200',
  gray: 'bg-gray-100 text-gray-500 border border-gray-200',
  blue: 'bg-blue-50 text-blue-700 border border-blue-200',
  orange: 'bg-orange-50 text-orange-700 border border-orange-200',
}

function getColor(status: string): Color {
  const s = status.toLowerCase()
  if (s.includes('em dia') || s.includes('concluíd') || s.includes('realizada')) return 'green'
  if (s.includes('pendente') || s.includes('aguardando')) return 'yellow'
  if (s.includes('inadimplente') || s.includes('atrasada')) return 'red'
  if (s.includes('inativ') || s.includes('arquivad') || s.includes('encerrad')) return 'gray'
  if (s.includes('recurso')) return 'orange'
  if (s.includes('andamento') || s.includes('aberta') || s.includes('suspenso')) return 'blue'
  return 'gray'
}

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colorMap[getColor(status)]}`}>
      {status}
    </span>
  )
}
