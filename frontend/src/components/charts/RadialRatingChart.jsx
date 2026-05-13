import {
  RadialBarChart, RadialBar, Legend, ResponsiveContainer, Tooltip,
} from 'recharts'
import { motion } from 'framer-motion'

const RATING_COLORS = {
  'Excellent': '#22c55e',
  'Very Good': '#3b82f6',
  'Good':      '#eab308',
  'Fair':      '#f97316',
  'Poor':      '#ef4444',
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-2 shadow-lg text-sm">
      <p className="font-semibold" style={{ color: d.fill }}>{d.name}</p>
      <p className="text-slate-500 dark:text-slate-400">{d.value} responses</p>
    </div>
  )
}

export function RadialRatingChart({ distribution }) {
  const order = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent']
  const data = order
    .map((name) => ({ name, value: distribution[name] ?? 0, fill: RATING_COLORS[name] }))
    .filter((d) => d.value > 0)
    .reverse()

  if (!data.length) {
    return <p className="text-sm text-slate-400 text-center py-8">No data yet</p>
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ResponsiveContainer width="100%" height={240}>
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="20%"
          outerRadius="90%"
          data={data}
          startAngle={180}
          endAngle={0}
          barSize={14}
        >
          <RadialBar
            background={{ fill: '#f1f5f9' }}
            dataKey="value"
            cornerRadius={8}
            animationDuration={1000}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconSize={8}
            iconType="circle"
            layout="vertical"
            verticalAlign="middle"
            align="right"
            formatter={(value) => (
              <span className="text-xs text-slate-600 dark:text-slate-400">{value}</span>
            )}
          />
        </RadialBarChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
