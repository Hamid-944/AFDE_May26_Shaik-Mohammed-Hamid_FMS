import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { motion } from 'framer-motion'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const d = new Date(label)
  const formatted = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  return (
    <div className="bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-3 shadow-xl text-sm">
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{formatted}</p>
      <p className="font-bold text-brand-600 dark:text-brand-400 text-base">
        {payload[0].value} {payload[0].value === 1 ? 'submission' : 'submissions'}
      </p>
    </div>
  )
}

function formatXAxis(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function AreaFeedbackChart({ data }) {
  const tickInterval = Math.floor(data.length / 6)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="feedbackGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b63f7" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b63f7" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={formatXAxis}
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
            interval={tickInterval}
          />
          <YAxis
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#3b63f7"
            strokeWidth={2.5}
            fill="url(#feedbackGrad)"
            dot={false}
            activeDot={{ r: 5, fill: '#3b63f7', stroke: 'white', strokeWidth: 2 }}
            animationDuration={1200}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
