import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList,
} from 'recharts'
import { motion } from 'framer-motion'

const GRADIENT_COLORS = [
  ['#6366f1', '#3b63f7'],
  ['#8b5cf6', '#6366f1'],
  ['#06b6d4', '#3b63f7'],
  ['#10b981', '#06b6d4'],
  ['#f59e0b', '#ef4444'],
  ['#f97316', '#f59e0b'],
]

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-3 shadow-xl text-sm max-w-[200px]">
      <p className="font-semibold text-slate-800 dark:text-white text-xs mb-1 break-words">{d.program_name}</p>
      <p className="text-slate-500 dark:text-slate-400">{d.count} responses</p>
      <p className="text-amber-500 font-medium">⭐ {d.avg_rating} avg rating</p>
    </div>
  )
}

export function TopProgramsChart({ data }) {
  if (!data?.length) {
    return <p className="text-sm text-slate-400 text-center py-8">No program data yet</p>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ResponsiveContainer width="100%" height={Math.max(data.length * 52, 180)}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 48, left: 8, bottom: 4 }}
        >
          <defs>
            {GRADIENT_COLORS.map(([start, end], i) => (
              <linearGradient key={i} id={`bar-grad-${i}`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={start} />
                <stop offset="100%" stopColor={end} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.4} horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} allowDecimals={false} />
          <YAxis
            dataKey="program_name"
            type="category"
            tick={{ fontSize: 11, fill: '#64748b' }}
            tickLine={false}
            axisLine={false}
            width={110}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59,99,247,0.05)' }} />
          <Bar dataKey="count" radius={[0, 8, 8, 0]} animationDuration={1000}>
            {data.map((_, i) => (
              <Cell key={i} fill={`url(#bar-grad-${i % GRADIENT_COLORS.length})`} />
            ))}
            <LabelList
              dataKey="count"
              position="right"
              style={{ fontSize: 11, fontWeight: 600, fill: '#64748b' }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
