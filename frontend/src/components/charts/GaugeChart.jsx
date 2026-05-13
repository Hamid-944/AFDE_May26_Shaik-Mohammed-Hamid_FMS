import { motion } from 'framer-motion'
import { useAnimatedCounter } from '../../hooks/useAnimatedCounter'

const COLORS = ['#ef4444', '#f97316', '#eab308', '#3b82f6', '#22c55e']

function polarToXY(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  }
}

function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polarToXY(cx, cy, r, startAngle)
  const end = polarToXY(cx, cy, r, endAngle)
  const largeArc = endAngle - startAngle > 180 ? 1 : 0
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`
}

const SEGMENTS = [
  { label: 'Poor',      color: '#ef4444', from: -135, to: -81 },
  { label: 'Fair',      color: '#f97316', from: -81,  to: -27 },
  { label: 'Good',      color: '#eab308', from: -27,  to:  27 },
  { label: 'Very Good', color: '#3b82f6', from:  27,  to:  81 },
  { label: 'Excellent', color: '#22c55e', from:  81,  to: 135 },
]

export function GaugeChart({ value = 0, max = 5 }) {
  const animated = useAnimatedCounter(value, 1200, 1)
  const pct = Math.min(animated / max, 1)
  const needleAngle = -135 + pct * 270

  const cx = 110, cy = 110, r = 80

  const needle = polarToXY(cx, cy, r - 16, needleAngle)
  const needleBase1 = polarToXY(cx, cy, 10, needleAngle + 90)
  const needleBase2 = polarToXY(cx, cy, 10, needleAngle - 90)

  const activeColor = COLORS[Math.round(Math.min(value - 1, 4))] ?? '#3b63f7'

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 220 150" className="w-full max-w-[220px]">
        {/* Track segments */}
        {SEGMENTS.map((seg) => (
          <path
            key={seg.label}
            d={describeArc(cx, cy, r, seg.from, seg.to)}
            fill="none"
            stroke={seg.color}
            strokeWidth={14}
            strokeLinecap="round"
            opacity={0.18}
          />
        ))}

        {/* Filled arc */}
        <motion.path
          d={describeArc(cx, cy, r, -135, needleAngle)}
          fill="none"
          stroke={activeColor}
          strokeWidth={14}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />

        {/* Needle */}
        <motion.polygon
          points={`${needle.x},${needle.y} ${needleBase1.x},${needleBase1.y} ${needleBase2.x},${needleBase2.y}`}
          fill={activeColor}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        />

        {/* Hub */}
        <circle cx={cx} cy={cy} r={9} fill="white" stroke={activeColor} strokeWidth={2.5} />

        {/* Min / Max labels */}
        <text x={26} y={130} fontSize={11} fill="#94a3b8" textAnchor="middle">1</text>
        <text x={194} y={130} fontSize={11} fill="#94a3b8" textAnchor="middle">5</text>

        {/* Value */}
        <text x={cx} y={cy + 34} fontSize={26} fontWeight={700} fill="currentColor" textAnchor="middle" className="fill-slate-900 dark:fill-white">
          {animated.toFixed(1)}
        </text>
        <text x={cx} y={cy + 50} fontSize={10} fill="#94a3b8" textAnchor="middle">out of 5</text>
      </svg>

      {/* Active label */}
      <p className="text-sm font-semibold mt-1" style={{ color: activeColor }}>
        {value === 0 ? 'No data' : value >= 4.5 ? 'Excellent' : value >= 3.5 ? 'Very Good' : value >= 2.5 ? 'Good' : value >= 1.5 ? 'Fair' : 'Poor'}
      </p>
    </div>
  )
}
