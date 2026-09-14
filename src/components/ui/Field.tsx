import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'

const base =
  'w-full rounded-lg border border-line bg-paper px-3 py-2 text-[14px] text-ink placeholder:text-ink/35 outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15'

export function Label({ children }: { children: ReactNode }) {
  return <label className="mb-1.5 block text-[12px] font-medium uppercase tracking-wide text-ink/45">{children}</label>
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  const { className = '', ...rest } = props
  return <input className={`${base} ${className}`} {...rest} />
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className = '', ...rest } = props
  return <textarea className={`${base} resize-none ${className}`} {...rest} />
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  const { className = '', children, ...rest } = props
  return (
    <select className={`${base} appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="%230b0c0c" stroke-opacity="0.4" stroke-width="1.5"><path d="M6 8l4 4 4-4"/></svg>')] bg-[length:16px] bg-[right_10px_center] bg-no-repeat pr-9 ${className}`} {...rest}>
      {children}
    </select>
  )
}

export function FormRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <Label>{label}</Label>
      {children}
    </div>
  )
}
