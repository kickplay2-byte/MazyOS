'use client'

interface AdvisorPromptCardProps {
  label: string
  onClick: () => void
  disabled?: boolean
}

export default function AdvisorPromptCard({ label, onClick, disabled }: AdvisorPromptCardProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-3 py-1.5 rounded border border-gray-200 text-sm text-gray-600 bg-white hover:border-[#DFA568] hover:text-[#DFA568] transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-left"
    >
      {label}
    </button>
  )
}
