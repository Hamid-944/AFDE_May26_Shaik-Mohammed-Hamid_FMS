import { useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { feedbackApi } from '../services/api'
import { Card, CardContent } from '../components/ui/Card'
import { StarRating } from '../components/ui/StarRating'
import { RatingBadge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Input, Select } from '../components/ui/Input'
import { EmptyState } from '../components/ui/EmptyState'
import { SkeletonTable } from '../components/ui/Skeleton'
import { formatDate } from '../lib/utils'
import {
  Search, SlidersHorizontal, Trash2, Eye, ChevronLeft, ChevronRight, X, ArrowRight,
} from 'lucide-react'
import { useDebounce } from '../hooks/useDebounce'

const RATING_BAR_COLORS = ['#ef4444', '#f97316', '#eab308', '#3b82f6', '#22c55e']
const PAGE_SIZE = 10

function ConfirmDialog({ name, onConfirm, onCancel, loading }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="relative z-10 w-full max-w-sm bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-6 shadow-2xl"
      >
        <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
          <Trash2 size={22} className="text-red-500" />
        </div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white text-center mb-1">Delete Feedback?</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-6">
          Permanently delete feedback from <strong className="text-slate-700 dark:text-slate-300">{name}</strong>?
        </p>
        <div className="flex gap-3">
          <Button variant="danger" size="md" className="flex-1" loading={loading} onClick={onConfirm}>
            Yes, Delete
          </Button>
          <Button variant="secondary" size="md" className="flex-1" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function FeedbackList() {
  const qc = useQueryClient()
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState('')
  const [rating, setRating] = useState('')
  const [program, setProgram] = useState('')
  const [page, setPage] = useState(0)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const debouncedKeyword = useDebounce(keyword, 350)
  const debouncedProgram = useDebounce(program, 350)

  const params = {
    skip: page * PAGE_SIZE,
    limit: PAGE_SIZE,
    ...(debouncedKeyword && { keyword: debouncedKeyword }),
    ...(rating && { rating: Number(rating) }),
    ...(debouncedProgram && { program_name: debouncedProgram }),
  }

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['feedback', params],
    queryFn: () => feedbackApi.getAll(params),
    placeholderData: (prev) => prev,
  })

  const deleteMutation = useMutation({
    mutationFn: feedbackApi.remove,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['feedback'] })
      qc.invalidateQueries({ queryKey: ['stats'] })
      toast.success('Feedback deleted')
      setDeleteTarget(null)
    },
    onError: (err) => toast.error('Delete failed', { description: err.message }),
  })

  const clearFilters = useCallback(() => {
    setKeyword('')
    setRating('')
    setProgram('')
    setPage(0)
  }, [])

  const items = data?.items ?? []
  const total = data?.total ?? 0
  const totalPages = Math.ceil(total / PAGE_SIZE)
  const hasFilters = keyword || rating || program

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">All Feedback</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            <AnimatePresence mode="wait">
              <motion.span
                key={total}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-block"
              >
                {total} record{total !== 1 ? 's' : ''} found
              </motion.span>
            </AnimatePresence>
          </p>
        </div>
        <Link to="/submit">
          <Button size="md" className="gap-2">
            <span className="text-lg leading-none">+</span> Submit New
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-5">
          <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
            <SlidersHorizontal size={15} className="text-brand-500" />
            Filters
            <AnimatePresence>
              {hasFilters && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={clearFilters}
                  className="ml-auto text-xs text-red-500 hover:text-red-600 flex items-center gap-1 font-medium"
                >
                  <X size={12} /> Clear all
                </motion.button>
              )}
            </AnimatePresence>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                placeholder="Search name, program, comments..."
                value={keyword}
                onChange={(e) => { setKeyword(e.target.value); setPage(0) }}
              />
            </div>
            <Select value={rating} onChange={(e) => { setRating(e.target.value); setPage(0) }}>
              <option value="">All Ratings</option>
              <option value="5">⭐⭐⭐⭐⭐ Excellent (5)</option>
              <option value="4">⭐⭐⭐⭐ Very Good (4)</option>
              <option value="3">⭐⭐⭐ Good (3)</option>
              <option value="2">⭐⭐ Fair (2)</option>
              <option value="1">⭐ Poor (1)</option>
            </Select>
            <Input
              placeholder="Filter by program..."
              value={program}
              onChange={(e) => { setProgram(e.target.value); setPage(0) }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Table / List */}
      {isLoading ? (
        <SkeletonTable />
      ) : items.length === 0 ? (
        <EmptyState
          type={hasFilters ? 'search' : 'empty'}
          title={hasFilters ? 'No results found' : 'No feedback yet'}
          description={hasFilters ? 'Try adjusting your filters.' : 'Be the first to submit feedback!'}
          action={!hasFilters ? { to: '/submit', label: 'Submit Feedback' } : undefined}
        />
      ) : (
        <div className={`transition-opacity duration-150 ${isFetching ? 'opacity-60 pointer-events-none' : 'opacity-100'}`}>
          {/* Desktop table */}
          <div className="hidden md:block bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-zinc-800 bg-slate-50/60 dark:bg-zinc-800/40">
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Participant</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Program</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Rating</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Submitted</th>
                  <th className="text-right px-6 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {items.map((fb, idx) => (
                    <motion.tr
                      key={fb.feedback_id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: idx * 0.03 }}
                      className="group border-b border-slate-50 dark:border-zinc-800/60 hover:bg-brand-50/40 dark:hover:bg-brand-950/20 transition-colors duration-150 cursor-pointer"
                      onClick={() => navigate(`/feedback/${fb.feedback_id}`)}
                    >
                      {/* Color accent on hover */}
                      <td className="px-6 py-4 relative">
                        <div
                          className="absolute left-0 top-0 bottom-0 w-0.5 opacity-0 group-hover:opacity-100 transition-opacity rounded-r"
                          style={{ backgroundColor: RATING_BAR_COLORS[fb.rating - 1] }}
                        />
                        <span className="font-semibold text-slate-900 dark:text-white group-hover:text-brand-700 dark:group-hover:text-brand-400 transition-colors">
                          {fb.participant_name}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400 max-w-[200px]">
                        <span className="truncate block">{fb.program_name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <StarRating value={fb.rating} size={13} />
                          <RatingBadge rating={fb.rating} />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs">{formatDate(fb.submitted_at)}</td>
                      <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/feedback/${fb.feedback_id}`)}
                            className="text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20"
                          >
                            <Eye size={14} /> View
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                            onClick={() => setDeleteTarget(fb)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {items.map((fb, idx) => (
              <motion.div
                key={fb.feedback_id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                onClick={() => navigate(`/feedback/${fb.feedback_id}`)}
                className="group bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-4 hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-1 self-stretch rounded-full shrink-0"
                    style={{ backgroundColor: RATING_BAR_COLORS[fb.rating - 1] }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white text-sm">{fb.participant_name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{fb.program_name}</p>
                      </div>
                      <RatingBadge rating={fb.rating} />
                    </div>
                    <StarRating value={fb.rating} size={13} />
                    {fb.comments && <p className="text-xs text-slate-500 line-clamp-2 mt-1.5">{fb.comments}</p>}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-slate-400">{formatDate(fb.submitted_at)}</span>
                      <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/feedback/${fb.feedback_id}`)}>
                          <Eye size={14} />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-500" onClick={() => setDeleteTarget(fb)}>
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-between flex-wrap gap-3"
        >
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Page <strong>{page + 1}</strong> of <strong>{totalPages}</strong> · {total} total records
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
              <ChevronLeft size={15} /> Prev
            </Button>
            {[...Array(Math.min(totalPages, 5))].map((_, i) => (
              <Button
                key={i}
                variant={page === i ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setPage(i)}
                className="w-9 px-0"
              >
                {i + 1}
              </Button>
            ))}
            <Button variant="outline" size="sm" disabled={page + 1 >= totalPages} onClick={() => setPage((p) => p + 1)}>
              Next <ChevronRight size={15} />
            </Button>
          </div>
        </motion.div>
      )}

      {/* Delete confirm dialog */}
      <AnimatePresence>
        {deleteTarget && (
          <ConfirmDialog
            name={deleteTarget.participant_name}
            loading={deleteMutation.isPending}
            onConfirm={() => deleteMutation.mutate(deleteTarget.feedback_id)}
            onCancel={() => setDeleteTarget(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
