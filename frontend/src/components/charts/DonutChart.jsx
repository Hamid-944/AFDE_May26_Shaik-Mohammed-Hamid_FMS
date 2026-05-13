import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { motion } from 'framer-motion'

const COLORS = ['#ef4444', '#f97316', '#eab308', '#3b82f6', '#22c55e']

const RADIAN = Math.PI / 180
function CustomLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }) {
  if (percent < 0.05) return null
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const { name, value } = payload[0]
  return (
    <div className="bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-2 shadow-lg text-sm">
      <p className="font-semibold text-slate-800 dark:text-white">{name}</p>
      <p className="text-slate-500 dark:text-slate-400">{value} responses</p>
    </div>
  )
}

export function DonutChart({ distribution, total }) {
  const data = Object.entries(distribution).map(([name, value]) => ({ name, value }))
  const order = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent']
  const sorted = order.map((name) => ({ name, value: distribution[name] ?? 0 })).filter((d) => d.value > 0)

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={sorted}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={95}
            paddingAngle={3}
            dataKey="value"
            labelLine={false}
            label={CustomLabel}
            animationBegin={0}
            animationDuration={900}
          >
            {sorted.map((entry, i) => (
              <Cell
                key={entry.name}
                fill={COLORS[order.indexOf(entry.name)]}
                stroke="none"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span className="text-xs text-slate-600 dark:text-slate-400">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
      {/* Center label overlay */}
      <div className="relative -mt-[228px] flex items-center justify-center h-[228px] pointer-events-none">
        <div className="text-center mb-16">
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{total}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Total</p>
        </div>
      </div>
    </motion.div>
  )
}
