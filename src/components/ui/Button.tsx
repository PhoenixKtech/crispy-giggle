import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'gold'
type Size = 'sm' | 'md'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  icon?: ReactNode
  children?: ReactNode
}

const variants: Record<Variant, string> = {
  primary: 'bg-emerald-500 text-white hover:bg-emerald-600 active:bg-emerald-700 shadow-sm',
  secondary: 'bg-paper text-ink border border-line hover:border-ink/30 hover:bg-paper-soft',
  ghost: 'text-ink/70 hover:bg-ink/5 hover:text-ink',
  danger: 'bg-white text-red-600 border border-red-200 hover:bg-red-50',
  gold: 'bg-gold-500 text-ink hover:bg-gold-600 shadow-sm',
}

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-[13px] gap-1.5',
  md: 'h-10 px-4 text-[14px] gap-2',
}

export function Button({
  variant = 'secondary',
  size = 'md',
  icon,
  children,
  className = '',
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-xl font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-40 ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {icon}
      {children}
    </button>
  )
}
