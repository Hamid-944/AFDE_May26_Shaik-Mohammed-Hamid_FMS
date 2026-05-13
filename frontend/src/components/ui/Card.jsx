import { cn } from '../../lib/utils'

export function Card({ children, className, hover = false }) {
  return (
    <div
      className={cn(
        'bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 shadow-sm',
        hover && 'transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className }) {
  return <div className={cn('px-6 pt-6 pb-4', className)}>{children}</div>
}

export function CardContent({ children, className }) {
  return <div className={cn('px-6 pb-6', className)}>{children}</div>
}

export function CardTitle({ children, className }) {
  return <h3 className={cn('text-lg font-semibold text-slate-900 dark:text-white', className)}>{children}</h3>
}
