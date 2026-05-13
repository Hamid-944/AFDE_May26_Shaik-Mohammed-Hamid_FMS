import { cn } from '../../lib/utils'

function Bone({ className }) {
  return (
    <div
      className={cn(
        'rounded-xl bg-slate-200 dark:bg-zinc-800 animate-pulse',
        className
      )}
    />
  )
}

export function SkeletonStatCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {[0, 1, 2].map((i) => (
        <div key={i} className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-6 flex items-start gap-4">
          <Bone className="w-11 h-11 shrink-0" />
          <div className="flex-1 space-y-2">
            <Bone className="h-3 w-20" />
            <Bone className="h-7 w-16" />
            <Bone className="h-2.5 w-28" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function SkeletonTable() {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 overflow-hidden">
      <div className="border-b border-slate-100 dark:border-zinc-800 px-6 py-3.5 flex gap-6">
        {[140, 160, 100, 120, 80].map((w, i) => (
          <Bone key={i} className="h-3" style={{ width: w }} />
        ))}
      </div>
      {[...Array(6)].map((_, i) => (
        <div key={i} className="px-6 py-4 border-b border-slate-50 dark:border-zinc-800/50 flex items-center gap-6">
          <Bone className="h-4 w-32" />
          <Bone className="h-4 w-40" />
          <Bone className="h-6 w-20 rounded-full" />
          <Bone className="h-3 w-28" />
          <Bone className="h-8 w-16 ml-auto" />
        </div>
      ))}
    </div>
  )
}

export function SkeletonCards() {
  return (
    <div className="space-y-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-4 space-y-3">
          <div className="flex justify-between">
            <div className="space-y-2">
              <Bone className="h-4 w-32" />
              <Bone className="h-3 w-48" />
            </div>
            <Bone className="h-6 w-20 rounded-full" />
          </div>
          <Bone className="h-3 w-full" />
          <Bone className="h-3 w-3/4" />
        </div>
      ))}
    </div>
  )
}

export function SkeletonDetail() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Bone className="h-4 w-36" />
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-6 space-y-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <Bone className="h-6 w-48" />
            <Bone className="h-4 w-64" />
            <Bone className="h-5 w-32 mt-3" />
          </div>
          <div className="flex gap-2">
            <Bone className="h-9 w-20" />
            <Bone className="h-9 w-20" />
          </div>
        </div>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex gap-4 py-4 border-b border-slate-100 dark:border-zinc-800">
            <Bone className="w-8 h-8 shrink-0" />
            <div className="flex-1 space-y-2">
              <Bone className="h-3 w-20" />
              <Bone className="h-4 w-full" />
              <Bone className="h-4 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
