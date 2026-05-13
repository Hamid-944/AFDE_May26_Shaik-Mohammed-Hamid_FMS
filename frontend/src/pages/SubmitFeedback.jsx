import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import confetti from 'canvas-confetti'
import { feedbackApi } from '../services/api'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Input, Textarea } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { StarRatingInput } from '../components/ui/StarRating'
import { RATING_LABELS } from '../lib/utils'
import { MessageSquarePlus, CheckCircle2, Sparkles } from 'lucide-react'

const schema = z.object({
  participant_name: z.string().min(2, 'Name must be at least 2 characters').max(255),
  program_name: z.string().min(2, 'Program name must be at least 2 characters').max(255),
  rating: z.number().min(1, 'Please select a rating').max(5),
  comments: z.string().max(2000, 'Max 2000 characters').optional().or(z.literal('')),
})

function fireConfetti() {
  const end = Date.now() + 1200
  const colors = ['#3b63f7', '#22c55e', '#f97316', '#a855f7', '#eab308']
  const frame = () => {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors,
    })
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors,
    })
    if (Date.now() < end) requestAnimationFrame(frame)
  }
  frame()
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
}

const RATING_DESCRIPTIONS = {
  1: { label: 'Poor', emoji: '😔', color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' },
  2: { label: 'Fair', emoji: '😐', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800' },
  3: { label: 'Good', emoji: '🙂', color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' },
  4: { label: 'Very Good', emoji: '😊', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' },
  5: { label: 'Excellent', emoji: '🤩', color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' },
}

export function SubmitFeedback() {
  const navigate = useNavigate()
  const qc = useQueryClient()

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { participant_name: '', program_name: '', rating: 0, comments: '' },
  })

  const rating = watch('rating')
  const ratingMeta = RATING_DESCRIPTIONS[rating]

  const mutation = useMutation({
    mutationFn: feedbackApi.create,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['feedback'] })
      qc.invalidateQueries({ queryKey: ['stats'] })
      fireConfetti()
      toast.success('Feedback submitted! 🎉', {
        description: `Thank you, ${data.participant_name}! Your feedback has been recorded.`,
        duration: 4000,
      })
      setTimeout(() => navigate(`/feedback/${data.feedback_id}`), 800)
    },
    onError: (err) => toast.error('Submission failed', { description: err.message }),
  })

  const onSubmit = (data) => {
    mutation.mutate({ ...data, comments: data.comments || null })
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-2xl mx-auto space-y-6"
    >
      {/* Page header */}
      <motion.div variants={item} className="text-center">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center mx-auto shadow-lg shadow-brand-500/30 mb-4">
          <MessageSquarePlus size={24} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Share Your Feedback</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400 text-base">
          Your experience matters. Help us improve.
        </p>
      </motion.div>

      <motion.div variants={item}>
        <Card className="overflow-hidden">
          {/* Top gradient strip */}
          <div className="h-1 w-full bg-gradient-to-r from-brand-500 via-violet-500 to-pink-500" />

          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles size={18} className="text-brand-500" />
              Your Feedback
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Participant Name *"
                  placeholder="e.g. John Smith"
                  error={errors.participant_name?.message}
                  {...register('participant_name')}
                />
                <Input
                  label="Training / Event / Product *"
                  placeholder="e.g. React Fundamentals"
                  error={errors.program_name?.message}
                  {...register('program_name')}
                />
              </div>

              {/* Star rating */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Rating *
                </label>
                <Controller
                  name="rating"
                  control={control}
                  render={({ field }) => (
                    <StarRatingInput value={field.value} onChange={field.onChange} />
                  )}
                />

                {/* Rating feedback pill */}
                <AnimatePresence mode="wait">
                  {rating > 0 && ratingMeta && (
                    <motion.div
                      key={rating}
                      initial={{ opacity: 0, scale: 0.9, y: -6 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold ${ratingMeta.bg}`}
                    >
                      <span className="text-xl">{ratingMeta.emoji}</span>
                      <span className={ratingMeta.color}>{rating}/5 — {ratingMeta.label}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {errors.rating && (
                  <p className="text-xs text-red-500">{errors.rating.message}</p>
                )}
              </div>

              <Textarea
                label="Comments"
                placeholder="Share your thoughts, suggestions, or experience..."
                error={errors.comments?.message}
                rows={5}
                {...register('comments')}
              />

              <div className="flex items-center gap-3 pt-2">
                <Button
                  type="submit"
                  loading={mutation.isPending}
                  size="lg"
                  className="flex-1 bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800"
                >
                  <CheckCircle2 size={17} />
                  {mutation.isPending ? 'Submitting...' : 'Submit Feedback'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  onClick={() => reset()}
                  disabled={mutation.isPending}
                >
                  Reset
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Trust indicators */}
      <motion.div variants={item} className="flex items-center justify-center gap-6 text-xs text-slate-400 dark:text-slate-600">
        <span className="flex items-center gap-1.5">
          <CheckCircle2 size={13} className="text-green-500" /> Secure & Private
        </span>
        <span className="flex items-center gap-1.5">
          <CheckCircle2 size={13} className="text-green-500" /> Instant Submission
        </span>
        <span className="flex items-center gap-1.5">
          <CheckCircle2 size={13} className="text-green-500" /> No Login Required
        </span>
      </motion.div>
    </motion.div>
  )
}
