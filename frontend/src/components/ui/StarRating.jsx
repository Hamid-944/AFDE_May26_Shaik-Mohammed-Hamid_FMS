import { Star } from 'lucide-react'
import { cn } from '../../lib/utils'

export function StarRating({ value, max = 5, size = 16, className }) {
  return (
    <span className={cn('inline-flex gap-0.5', className)}>
      {Array.from({ length: max }, (_, i) => (
        <Star
          key={i}
          size={size}
          className={cn(
            'transition-colors',
            i < value
              ? 'fill-amber-400 text-amber-400'
              : 'fill-none text-slate-300 dark:text-slate-600'
          )}
        />
      ))}
    </span>
  )
}

export function StarRatingInput({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="group transition-transform hover:scale-110 focus:outline-none"
        >
          <Star
            size={28}
            className={cn(
              'transition-all duration-150',
              star <= value
                ? 'fill-amber-400 text-amber-400'
                : 'fill-none text-slate-300 dark:text-slate-600 group-hover:text-amber-300'
            )}
          />
        </button>
      ))}
    </div>
  )
}
