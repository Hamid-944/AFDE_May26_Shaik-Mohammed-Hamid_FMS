import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { feedbackApi } from '../services/api'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { StarRating } from '../components/ui/StarRating'
import { RatingBadge } from '../components/ui/Badge'
import { SkeletonStatCards } from '../components/ui/Skeleton'
import { EmptyState } from '../components/ui/EmptyState'
import { Button } from '../components/ui/Button'
import { useAnimatedCounter } from '../hooks/useAnimatedCounter'
import { formatDate } from '../lib/utils'
import { DonutChart } from '../components/charts/DonutChart'
import { GaugeChart } from '../components/charts/GaugeChart'
import { AreaFeedbackChart } from '../components/charts/AreaFeedbackChart'
import { TopProgramsChart } from '../components/charts/TopProgramsChart'
import { RadialRatingChart } from '../components/charts/RadialRatingChart'
import { CircularProgress } from '../components/charts/CircularProgress'
import {
  MessageSquare, Star, TrendingUp, ArrowRight, MessageSquarePlus, Sparkles, Zap, Calendar,
} from 'lucide-react'

const RATING_BAR_COLORS = ['#ef4444', '#f97316', '#eab308', '#3b82f6', '#22c55e']

const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
}

function StatCard({ icon: Icon, label, value, sub, gradient }) {
  const isFloat = typeof value === 'number' && !Number.isInteger(value)
  const animated = useAnimatedCounter(typeof value === 'number' ? value : 0, 1400, isFloat ? 1 : 0)
  const display = typeof value === 'number' ? animated : value

  return (
    <motion.div variants={item}>
      <Card className="relative overflow-hidden group hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
        <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 group-hover:opacity-20 transition-opacity blur-xl ${gradient}`} />
        <CardContent className="pt-6 flex items-start gap-4 relative z-10">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${gradient} shadow-lg`}>
            <Icon size={20} className="text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mt-0.5 tabular-nums">{display}</p>
            {sub && <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{sub}</p>}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function ChartSkeleton({ height = 220 }) {
  return (
    <div className="animate-pulse flex flex-col gap-3 py-2">
      <div className="flex gap-2 items-end justify-center" style={{ height }}>
        {[60, 90, 40, 120, 80, 100, 55, 75, 95, 45].map((h, i) => (
          <div key={i} className="flex-1 bg-slate-200 dark:bg-zinc-700 rounded-t-lg" style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  )
}

export function Dashboard() {
  const statsQuery = useQuery({ queryKey: ['stats'], queryFn: feedbackApi.getStats })
  const analyticsQuery = useQuery({ queryKey: ['analytics'], queryFn: feedbackApi.getAnalytics })
  const recentQuery = useQuery({
    queryKey: ['feedback', 'recent'],
    queryFn: () => feedbackApi.getAll({ limit: 5 }),
  })

  const stats = statsQuery.data
  const analytics = analyticsQuery.data
  const recentItems = recentQuery.data?.items ?? []
  const totalFeedback = stats?.total_feedback ?? 0

  const thisWeek = analytics?.feedback_by_date
    ?.slice(-7)
    .reduce((sum, d) => sum + d.count, 0) ?? 0

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">

      {/* ── Hero Banner ── */}
      <motion.div
        variants={item}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-indigo-800 p-8 text-white"
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div animate={{ x: [0, 20, 0], y: [0, -15, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
          <motion.div animate={{ x: [0, -15, 0], y: [0, 20, 0] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute -bottom-16 -left-8 w-48 h-48 rounded-full bg-brand-400/20 blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Sparkles size={16} />
              </div>
              <span className="text-white/80 text-sm font-medium">FeedbackHub Analytics</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Welcome back! 👋</h1>
            <p className="mt-2 text-white/70 text-base max-w-md">
              {totalFeedback > 0
                ? `${totalFeedback} feedback record${totalFeedback > 1 ? 's' : ''} collected · ${thisWeek} this week`
                : 'Start collecting feedback from your participants today.'}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link to="/submit">
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-brand-700 font-semibold text-sm shadow-lg shadow-black/20 hover:bg-brand-50 transition-colors">
                <MessageSquarePlus size={16} /> Submit Feedback
              </motion.button>
            </Link>
            <Link to="/feedback">
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/15 backdrop-blur-sm text-white font-semibold text-sm border border-white/25 hover:bg-white/25 transition-colors">
                <Zap size={16} /> View All
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* ── Stat Cards ── */}
      {statsQuery.isLoading ? <SkeletonStatCards /> : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={MessageSquare} label="Total Feedback" value={stats?.total_feedback ?? 0} sub="All time" gradient="bg-gradient-to-br from-brand-500 to-brand-700" />
          <StatCard icon={Star} label="Average Rating" value={stats?.average_rating ?? 0} sub="Out of 5.0" gradient="bg-gradient-to-br from-amber-400 to-orange-500" />
          <StatCard icon={TrendingUp} label="Top Category" value={Object.entries(stats?.rating_distribution ?? {}).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—'} sub="Most common" gradient="bg-gradient-to-br from-emerald-500 to-teal-600" />
          <StatCard icon={Calendar} label="This Week" value={thisWeek} sub="Last 7 days" gradient="bg-gradient-to-br from-violet-500 to-purple-700" />
        </div>
      )}

      {/* ── Area Chart — Feedback Over Time ── */}
      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <CardTitle>Feedback Over Time</CardTitle>
              <span className="text-xs text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-zinc-800 px-2.5 py-1 rounded-full">Last 30 days</span>
            </div>
          </CardHeader>
          <CardContent>
            {analyticsQuery.isLoading ? <ChartSkeleton height={200} /> :
              analytics?.feedback_by_date?.every(d => d.count === 0) ? (
                <p className="text-sm text-slate-400 text-center py-10">No submissions in the last 30 days</p>
              ) : (
                <AreaFeedbackChart data={analytics?.feedback_by_date ?? []} />
              )}
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Row: Donut | Gauge | Circular Progress ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div variants={item}>
          <Card className="h-full">
            <CardHeader><CardTitle>Rating Breakdown</CardTitle></CardHeader>
            <CardContent>
              {statsQuery.isLoading ? <ChartSkeleton height={200} /> :
                Object.keys(stats?.rating_distribution ?? {}).length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-8">No data yet</p>
                ) : (
                  <DonutChart distribution={stats?.rating_distribution ?? {}} total={totalFeedback} />
                )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="h-full">
            <CardHeader><CardTitle>Satisfaction Gauge</CardTitle></CardHeader>
            <CardContent className="flex items-center justify-center pt-2 pb-6">
              {statsQuery.isLoading ? <ChartSkeleton height={180} /> : (
                <GaugeChart value={stats?.average_rating ?? 0} />
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="h-full">
            <CardHeader><CardTitle>Average Score</CardTitle></CardHeader>
            <CardContent className="flex items-center justify-center pt-2 pb-6">
              {statsQuery.isLoading ? <ChartSkeleton height={180} /> : (
                <CircularProgress value={stats?.average_rating ?? 0} size={160} />
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ── Row: Radial Bar | Top Programs ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <motion.div variants={item} className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader><CardTitle>Radial Rating View</CardTitle></CardHeader>
            <CardContent>
              {statsQuery.isLoading ? <ChartSkeleton /> :
                Object.keys(stats?.rating_distribution ?? {}).length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-8">No data yet</p>
                ) : (
                  <RadialRatingChart distribution={stats?.rating_distribution ?? {}} />
                )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item} className="lg:col-span-3">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Top Programs</CardTitle>
                <span className="text-xs text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-zinc-800 px-2.5 py-1 rounded-full">by responses</span>
              </div>
            </CardHeader>
            <CardContent>
              {analyticsQuery.isLoading ? <ChartSkeleton /> : (
                <TopProgramsChart data={analytics?.top_programs ?? []} />
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ── Recent Feedback ── */}
      <motion.div variants={item}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Recent Feedback</CardTitle>
            <Link to="/feedback" className="text-sm text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 font-medium">
              View all <ArrowRight size={14} />
            </Link>
          </CardHeader>
          <CardContent>
            {recentQuery.isLoading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="p-3.5 rounded-xl border border-slate-100 dark:border-zinc-800 space-y-2 animate-pulse">
                    <div className="flex justify-between">
                      <div className="space-y-1.5">
                        <div className="h-3.5 w-28 bg-slate-200 dark:bg-zinc-700 rounded" />
                        <div className="h-3 w-40 bg-slate-100 dark:bg-zinc-800 rounded" />
                      </div>
                      <div className="h-5 w-20 bg-slate-100 dark:bg-zinc-800 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentItems.length === 0 ? (
              <EmptyState type="empty" title="No feedback yet" description="Submit the first feedback." action={{ to: '/submit', label: 'Submit Now' }} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {recentItems.map((fb, idx) => (
                  <motion.div key={fb.feedback_id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.06 }}>
                    <Link to={`/feedback/${fb.feedback_id}`}
                      className="group flex items-start gap-3 p-3.5 rounded-xl border border-slate-100 dark:border-zinc-800 hover:border-brand-200 dark:hover:border-brand-800 hover:bg-brand-50/40 dark:hover:bg-brand-950/30 transition-all duration-200 block"
                    >
                      <div className="w-1 self-stretch rounded-full shrink-0" style={{ backgroundColor: RATING_BAR_COLORS[fb.rating - 1] }} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1 mb-1">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white truncate group-hover:text-brand-700 dark:group-hover:text-brand-400 transition-colors">
                            {fb.participant_name}
                          </p>
                          <RatingBadge rating={fb.rating} className="shrink-0" />
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{fb.program_name}</p>
                        {fb.comments && <p className="text-xs text-slate-400 mt-1 line-clamp-1">{fb.comments}</p>}
                        <div className="flex items-center justify-between mt-2">
                          <StarRating value={fb.rating} size={11} />
                          <span className="text-xs text-slate-400 dark:text-slate-600">{formatDate(fb.submitted_at)}</span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

    </motion.div>
  )
}
