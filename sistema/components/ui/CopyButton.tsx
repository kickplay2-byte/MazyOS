'use client'

import { useState } from 'react'

interface CopyButtonProps {
  text: string
  className?: string
}

export default function CopyButton({ text, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)
      } else {
        // fallback for non-HTTPS or older browsers
        const ta = document.createElement('textarea')
        ta.value = text
        ta.style.position = 'fixed'
        ta.style.opacity = '0'
        document.body.appendChild(ta)
        ta.focus()
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
      }
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // silently ignore copy failure
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={className ?? 'text-xs text-gray-400 hover:text-[#1F2346] transition-colors px-3 py-1 border border-gray-200 rounded'}
    >
      {copied ? '✓ Copiado' : 'Copiar texto'}
    </button>
  )
}
