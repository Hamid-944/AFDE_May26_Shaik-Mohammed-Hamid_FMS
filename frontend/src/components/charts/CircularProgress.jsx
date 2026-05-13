import { motion } from 'framer-motion'
import { useAnimatedCounter } from '../../hooks/useAnimatedCounter'

const RATING_COLORS = ['#ef4444', '#f97316', '#eab308', '#3b82f6', '#22c55e']
const RATING_LABELS = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent']

export function CircularProgress({ value = 0, max = 5, size = 160 }) {
  const animated = useAnimatedCounter(value, 1200, 1)
  const pct = animated / max

  const stroke = 12
  const r = (size - stroke) / 2
  const circumference = 2 * Math.PI * r
  const filled = pct * circumference
  const gap = circumference - filled

  const colorIndex = Math.min(Math.round(value) - 1, 4)
  const color = value > 0 ? RATING_COLORS[colorIndex] : '#e2e8f0'
  const label = value > 0 ? RATING_LABELS[Math.round(value)] : 'No data'

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={stroke}
            className="dark:stroke-zinc-700"
          />
          {/* Filled arc */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${filled} ${gap}`}
            initial={{ strokeDasharray: `0 ${circumference}` }}
            animate={{ strokeDasharray: `${filled} ${gap}` }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            style={{ filter: `drop-shadow(0 0 6px ${color}60)` }}
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center rotate-0">
          <span className="text-3xl font-bold text-slate-900 dark:text-white tabular-nums">
            {animated.toFixed(1)}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">/ {max}.0</span>
        </div>
      </div>
      <p className="text-sm font-semibold" style={{ color }}>
        {label}
      </p>
      {/* Mini star row */}
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <svg key={s} width={14} height={14} viewBox="0 0 24 24">
            <path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              fill={s <= Math.round(value) ? '#f59e0b' : '#e2e8f0'}
            />
          </svg>
        ))}
      </div>
    </div>
  )
}
