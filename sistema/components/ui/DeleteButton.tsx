'use client'

interface DeleteButtonProps {
  confirmMessage?: string
  className?: string
  children: React.ReactNode
}

export default function DeleteButton({ confirmMessage, className, children }: DeleteButtonProps) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(e) => {
        if (!confirm(confirmMessage ?? 'Confirmar exclusão?')) e.preventDefault()
      }}
    >
      {children}
    </button>
  )
}
