import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { feedbackApi } from '../services/api'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { StarRating, StarRatingInput } from '../components/ui/StarRating'
import { RatingBadge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Input, Textarea } from '../components/ui/Input'
import { SkeletonDetail } from '../components/ui/Skeleton'
import { formatDate, RATING_LABELS } from '../lib/utils'
import {
  ArrowLeft, Pencil, Trash2, X, CheckCircle2, User, BookOpen, Calendar, MessageSquare,
} from 'lucide-react'

const RATING_BAR_COLORS_LOCAL = ['#ef4444', '#f97316', '#eab308', '#3b82f6', '#22c55e']

const editSchema = z.object({
  participant_name: z.string().min(2).max(255).optional(),
  program_name: z.string().min(2).max(255).optional(),
  rating: z.number().min(1).max(5).optional(),
  comments: z.string().max(2000).optional().or(z.literal('')),
})

function InfoRow({ icon: Icon, label, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-start gap-4 py-4 border-b border-slate-100 dark:border-zinc-800 last:border-0"
    >
      <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 mt-0.5">
        <Icon size={15} className="text-slate-500 dark:text-slate-400" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1">{label}</p>
        <div className="text-sm text-slate-900 dark:text-white">{children}</div>
      </div>
    </motion.div>
  )
}

const RATING_DESCRIPTIONS = {
  1: { emoji: '😔', bg: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' },
  2: { emoji: '😐', bg: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800' },
  3: { emoji: '🙂', bg: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' },
  4: { emoji: '😊', bg: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' },
  5: { emoji: '🤩', bg: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' },
}

export function FeedbackDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [editing, setEditing] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const { data: fb, isLoading, error } = useQuery({
    queryKey: ['feedback', id],
    queryFn: () => feedbackApi.getById(id),
  })

  const { register, handleSubmit, control, watch, reset, formState: { errors } } = useForm({
    resolver: zodResolver(editSchema),
  })

  const editRating = watch('rating')

  const updateMutation = useMutation({
    mutationFn: (payload) => feedbackApi.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['feedback', id] })
      qc.invalidateQueries({ queryKey: ['feedback'] })
      qc.invalidateQueries({ queryKey: ['stats'] })
      toast.success('Feedback updated!')
      setEditing(false)
    },
    onError: (err) => toast.error('Update failed', { description: err.message }),
  })

  const deleteMutation = useMutation({
    mutationFn: () => feedbackApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['feedback'] })
      qc.invalidateQueries({ queryKey: ['stats'] })
      toast.success('Feedback deleted')
      navigate('/feedback')
    },
    onError: (err) => toast.error('Delete failed', { description: err.message }),
  })

  const startEdit = () => {
    reset({
      participant_name: fb.participant_name,
      program_name: fb.program_name,
      rating: fb.rating,
      comments: fb.comments ?? '',
    })
    setEditing(true)
  }

  if (isLoading) return <SkeletonDetail />

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 mb-4">{error.message}</p>
        <Button variant="secondary" onClick={() => navigate('/feedback')}>
          <ArrowLeft size={15} /> Back to List
        </Button>
      </div>
    )
  }

  const ratingMeta = RATING_DESCRIPTIONS[fb.rating]

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto space-y-6"
    >
      {/* Back */}
      <Link
        to="/feedback"
        className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors font-medium group"
      >
        <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
        Back to All Feedback
      </Link>

      {/* Main card */}
      <Card className="overflow-hidden">
        {/* Rating color strip */}
        <div
          className="h-1.5 w-full"
          style={{
            background: `linear-gradient(to right, ${RATING_BAR_COLORS_LOCAL[fb.rating - 1]}, ${RATING_BAR_COLORS_LOCAL[Math.min(fb.rating, 4)]})`,
          }}
        />

        <CardHeader className="flex flex-row items-start justify-between gap-4 flex-wrap">
          <div className="min-w-0">
            <CardTitle className="text-xl">{fb.participant_name}</CardTitle>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 truncate">{fb.program_name}</p>
            <div className="flex items-center gap-3 mt-3 flex-wrap">
              <StarRating value={fb.rating} size={20} />
              <RatingBadge rating={fb.rating} />
              {ratingMeta && (
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border text-sm font-medium ${ratingMeta.bg}`}>
                  <span>{ratingMeta.emoji}</span>
                  <span className="text-slate-700 dark:text-slate-300">{RATING_LABELS[fb.rating]}</span>
                </span>
              )}
            </div>
          </div>
          {!editing && (
            <div className="flex items-center gap-2 shrink-0">
              <Button variant="outline" size="sm" onClick={startEdit}>
                <Pencil size={13} /> Edit
              </Button>
              <Button variant="danger" size="sm" onClick={() => setConfirmDelete(true)}>
                <Trash2 size={13} /> Delete
              </Button>
            </div>
          )}
        </CardHeader>

        <CardContent>
          <AnimatePresence mode="wait">
            {editing ? (
              <motion.form
                key="edit"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                onSubmit={handleSubmit((data) => {
                  const payload = Object.fromEntries(
                    Object.entries(data).filter(([, v]) => v !== '' && v !== undefined)
                  )
                  updateMutation.mutate(payload)
                })}
                className="space-y-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Participant Name" error={errors.participant_name?.message} {...register('participant_name')} />
                  <Input label="Program Name" error={errors.program_name?.message} {...register('program_name')} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Rating</label>
                  <Controller
                    name="rating"
                    control={control}
                    render={({ field }) => (
                      <StarRatingInput value={field.value} onChange={field.onChange} />
                    )}
                  />
                  {editRating > 0 && (
                    <p className="text-sm font-medium text-brand-600 dark:text-brand-400">
                      {editRating}/5 — {RATING_LABELS[editRating]}
                    </p>
                  )}
                </div>
                <Textarea label="Comments" error={errors.comments?.message} rows={5} {...register('comments')} />
                <div className="flex gap-3 pt-2">
                  <Button type="submit" loading={updateMutation.isPending} size="md" className="flex-1">
                    <CheckCircle2 size={15} /> Save Changes
                  </Button>
                  <Button type="button" variant="secondary" size="md" onClick={() => setEditing(false)}>
                    <X size={15} /> Cancel
                  </Button>
                </div>
              </motion.form>
            ) : (
              <motion.div key="view" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <InfoRow icon={User} label="Participant">
                  <span className="font-medium">{fb.participant_name}</span>
                </InfoRow>
                <InfoRow icon={BookOpen} label="Program / Event">
                  <span className="font-medium">{fb.program_name}</span>
                </InfoRow>
                <InfoRow icon={MessageSquare} label="Comments">
                  {fb.comments ? (
                    <p className="leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                      {fb.comments}
                    </p>
                  ) : (
                    <span className="text-slate-400 italic text-sm">No comments provided</span>
                  )}
                </InfoRow>
                <InfoRow icon={Calendar} label="Submitted At">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">
                    {formatDate(fb.submitted_at)}
                  </span>
                </InfoRow>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Delete confirm */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setConfirmDelete(false)}
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
                Permanently delete feedback from <strong className="text-slate-700 dark:text-slate-300">{fb.participant_name}</strong>?
              </p>
              <div className="flex gap-3">
                <Button variant="danger" size="md" className="flex-1" loading={deleteMutation.isPending} onClick={() => deleteMutation.mutate()}>
                  Yes, Delete
                </Button>
                <Button variant="secondary" size="md" className="flex-1" onClick={() => setConfirmDelete(false)}>
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
