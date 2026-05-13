import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { feedbackApi } from '../services/api'
import { Card } from '../components/ui/Card'
import { StarRating } from '../components/ui/StarRating'
import { RatingBadge } from '../components/ui/Badge'
import { EmptyState } from '../components/ui/EmptyState'
import { Select } from '../components/ui/Input'
import { formatDate } from '../lib/utils'
import { Search as SearchIcon, ArrowRight, SlidersHorizontal } from 'lucide-react'
import { useDebounce } from '../hooks/useDebounce'

const RATING_BAR_COLORS = ['#ef4444', '#f97316', '#eab308', '#3b82f6', '#22c55e']

function ResultCardSkeleton() {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-4 space-y-3 animate-pulse">
      <div className="flex justify-between">
        <div className="space-y-2">
          <div className="h-4 w-32 bg-slate-200 dark:bg-zinc-700 rounded" />
          <div className="h-3 w-48 bg-slate-100 dark:bg-zinc-800 rounded" />
        </div>
        <div className="h-5 w-20 bg-slate-100 dark:bg-zinc-800 rounded-full" />
      </div>
      <div className="h-3 w-full bg-slate-100 dark:bg-zinc-800 rounded" />
      <div className="h-3 w-3/4 bg-slate-100 dark:bg-zinc-800 rounded" />
    </div>
  )
}

export function Search() {
  const [keyword, setKeyword] = useState('')
  const [rating, setRating] = useState('')
  const [program, setProgram] = useState('')

  const debouncedKeyword = useDebounce(keyword, 350)
  const debouncedProgram = useDebounce(program, 350)

  const hasQuery = debouncedKeyword || rating || debouncedProgram

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['search', debouncedKeyword, rating, debouncedProgram],
    queryFn: () =>
      feedbackApi.search({
        ...(debouncedKeyword && { keyword: debouncedKeyword }),
        ...(rating && { rating: Number(rating) }),
        ...(debouncedProgram && { program_name: debouncedProgram }),
        limit: 50,
      }),
    enabled: !!hasQuery,
  })

  const items = data?.items ?? []
  const total = data?.total ?? 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-3xl mx-auto"
    >
      {/* Header */}
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center mx-auto shadow-lg shadow-violet-500/30 mb-4">
          <SearchIcon size={24} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Search Feedback</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Find feedback by name, program, or keywords
        </p>
      </div>

      {/* Search inputs */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 shadow-sm p-5 space-y-3">
        <div className="relative">
          <SearchIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            autoFocus
            className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white text-base placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
            placeholder="Search by name, program, or comments..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          {isFetching && hasQuery && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          )}
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <SlidersHorizontal size={13} className="text-brand-500" /> Advanced filters
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select value={rating} onChange={(e) => setRating(e.target.value)}>
            <option value="">All Ratings</option>
            <option value="5">⭐⭐⭐⭐⭐ Excellent (5)</option>
            <option value="4">⭐⭐⭐⭐ Very Good (4)</option>
            <option value="3">⭐⭐⭐ Good (3)</option>
            <option value="2">⭐⭐ Fair (2)</option>
            <option value="1">⭐ Poor (1)</option>
          </Select>
          <input
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
            placeholder="Filter by program name..."
            value={program}
            onChange={(e) => setProgram(e.target.value)}
          />
        </div>
      </div>

      {/* Results */}
      {!hasQuery ? (
        <EmptyState type="start" />
      ) : isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <ResultCardSkeleton key={i} />)}
        </div>
      ) : items.length === 0 ? (
        <EmptyState type="search" />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              <strong className="text-slate-900 dark:text-white">{total}</strong> result{total !== 1 ? 's' : ''} found
            </p>
          </div>

          <AnimatePresence mode="popLayout">
            {items.map((fb, idx) => (
              <motion.div
                key={fb.feedback_id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: idx * 0.04 }}
              >
                <Link to={`/feedback/${fb.feedback_id}`}>
                  <div className="group bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-4 hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-md transition-all duration-200 cursor-pointer">
                    <div className="flex items-start gap-3">
                      {/* Rating bar */}
                      <div
                        className="w-1 self-stretch rounded-full shrink-0"
                        style={{ backgroundColor: RATING_BAR_COLORS[fb.rating - 1] }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900 dark:text-white text-sm group-hover:text-brand-700 dark:group-hover:text-brand-400 transition-colors">
                              {fb.participant_name}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{fb.program_name}</p>
                          </div>
                          <div className="flex flex-col items-end gap-1.5 shrink-0">
                            <RatingBadge rating={fb.rating} />
                            <StarRating value={fb.rating} size={12} />
                          </div>
                        </div>
                        {fb.comments && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-2">
                            {fb.comments}
                          </p>
                        )}
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-slate-400 dark:text-slate-600">{formatDate(fb.submitted_at)}</p>
                          <ArrowRight
                            size={14}
                            className="text-slate-300 dark:text-slate-700 group-hover:text-brand-500 group-hover:translate-x-0.5 transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  )
}
