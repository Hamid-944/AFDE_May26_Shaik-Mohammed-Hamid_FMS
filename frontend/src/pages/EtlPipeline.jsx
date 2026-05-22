import { useState, useRef, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload, Play, Download, FileSpreadsheet, CheckCircle2,
  XCircle, Clock, AlertCircle, RefreshCw, ChevronDown, ChevronUp,
  Database, Filter, Trash2, Layers, TrendingUp, FileText,
} from 'lucide-react'
import { toast } from 'sonner'
import { etlApi } from '../services/api'
import { cn } from '../lib/utils'

const STATUS_CONFIG = {
  success: { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10', label: 'Success' },
  failed: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10', label: 'Failed' },
  running: { icon: RefreshCw, color: 'text-brand-500', bg: 'bg-brand-500/10', label: 'Running' },
}

function StatCard({ icon: Icon, label, value, color, sublabel, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-2xl bg-white/70 dark:bg-zinc-800/70 backdrop-blur-md border border-white/60 dark:border-zinc-700/60 p-5 shadow-sm"
    >
      <div className={cn('absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 blur-2xl -translate-y-6 translate-x-6', color)} />
      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3', `${color} bg-current/10`)}>
        <Icon size={18} className={cn('text-white', color.replace('bg-', 'text-'))} />
      </div>
      <p className="text-2xl font-bold text-slate-800 dark:text-white tabular-nums">{value ?? '—'}</p>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
      {sublabel && <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{sublabel}</p>}
    </motion.div>
  )
}

function DropZone({ onFile, disabled }) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef(null)

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) onFile(file)
  }, [onFile])

  const handleDragOver = (e) => { e.preventDefault(); setDragging(true) }
  const handleDragLeave = () => setDragging(false)

  return (
    <motion.div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => !disabled && inputRef.current?.click()}
      animate={{ scale: dragging ? 1.01 : 1 }}
      transition={{ duration: 0.15 }}
      className={cn(
        'relative group cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-200 p-10 flex flex-col items-center justify-center gap-4 text-center select-none',
        dragging
          ? 'border-brand-500 bg-brand-50/60 dark:bg-brand-900/20'
          : 'border-slate-200 dark:border-zinc-700 hover:border-brand-400 hover:bg-brand-50/30 dark:hover:bg-brand-900/10',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".csv,.xlsx,.xls"
        className="hidden"
        disabled={disabled}
        onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
      />
      <div className={cn(
        'w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-200',
        dragging ? 'bg-brand-100 dark:bg-brand-900/40' : 'bg-slate-100 dark:bg-zinc-700 group-hover:bg-brand-100 dark:group-hover:bg-brand-900/30'
      )}>
        <Upload size={28} className={cn('transition-colors', dragging ? 'text-brand-600' : 'text-slate-400 group-hover:text-brand-500')} />
      </div>
      <div>
        <p className="font-semibold text-slate-700 dark:text-slate-200 text-base">
          {dragging ? 'Drop to upload' : 'Drag & drop your file here'}
        </p>
        <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
          or <span className="text-brand-600 font-medium">browse</span> to choose — CSV or Excel (.csv, .xlsx, .xls)
        </p>
      </div>
    </motion.div>
  )
}

function PipelineStep({ icon: Icon, label, active, done, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center gap-2"
    >
      <div className={cn(
        'w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300',
        done ? 'bg-emerald-500 shadow-lg shadow-emerald-500/30'
          : active ? 'bg-brand-500 shadow-lg shadow-brand-500/30 animate-pulse'
          : 'bg-slate-100 dark:bg-zinc-800'
      )}>
        <Icon size={20} className={done || active ? 'text-white' : 'text-slate-400 dark:text-slate-500'} />
      </div>
      <span className={cn(
        'text-xs font-medium',
        done ? 'text-emerald-600 dark:text-emerald-400'
          : active ? 'text-brand-600 dark:text-brand-400'
          : 'text-slate-400 dark:text-slate-500'
      )}>{label}</span>
    </motion.div>
  )
}

function RunRow({ run }) {
  const [expanded, setExpanded] = useState(false)
  const cfg = STATUS_CONFIG[run.status] || STATUS_CONFIG.running
  const StatusIcon = cfg.icon

  return (
    <>
      <tr
        onClick={() => setExpanded(e => !e)}
        className="cursor-pointer hover:bg-slate-50/80 dark:hover:bg-zinc-800/60 transition-colors"
      >
        <td className="px-4 py-3 text-sm font-mono text-slate-500 dark:text-slate-400">#{run.run_id}</td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <FileSpreadsheet size={14} className="text-slate-400 shrink-0" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate max-w-[180px]">{run.filename}</span>
          </div>
        </td>
        <td className="px-4 py-3">
          <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold', cfg.bg, cfg.color)}>
            <StatusIcon size={11} className={run.status === 'running' ? 'animate-spin' : ''} />
            {cfg.label}
          </span>
        </td>
        <td className="px-4 py-3 text-sm tabular-nums text-slate-600 dark:text-slate-300">{run.total_records ?? 0}</td>
        <td className="px-4 py-3 text-sm tabular-nums text-emerald-600 dark:text-emerald-400 font-medium">{run.loaded_records ?? 0}</td>
        <td className="px-4 py-3 text-sm tabular-nums text-amber-600 dark:text-amber-400">{run.duplicate_records ?? 0}</td>
        <td className="px-4 py-3 text-sm tabular-nums text-red-500">{run.invalid_records ?? 0}</td>
        <td className="px-4 py-3 text-xs text-slate-400 dark:text-slate-500 font-mono">
          {run.started_at ? new Date(run.started_at).toLocaleString() : '—'}
        </td>
        <td className="px-4 py-3 text-slate-400">
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </td>
      </tr>
      <AnimatePresence>
        {expanded && (
          <tr>
            <td colSpan={9} className="px-0 py-0">
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.22 }}
                className="overflow-hidden"
              >
                <div className="px-8 py-4 bg-slate-50/60 dark:bg-zinc-900/40 border-t border-slate-100 dark:border-zinc-800">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-3">
                    {[
                      { label: 'Valid Records', val: run.valid_records, color: 'text-blue-600' },
                      { label: 'Cleaned / Standardised', val: run.cleaned_records, color: 'text-purple-600' },
                      { label: 'Completed At', val: run.completed_at ? new Date(run.completed_at).toLocaleString() : '—', color: 'text-slate-500' },
                      { label: 'Error', val: run.error_message || 'None', color: run.error_message ? 'text-red-500' : 'text-emerald-600' },
                    ].map(({ label, val, color }) => (
                      <div key={label}>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">{label}</p>
                        <p className={cn('text-sm font-semibold break-all', color)}>{val}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </td>
          </tr>
        )}
      </AnimatePresence>
    </>
  )
}

export function EtlPipeline() {
  const qc = useQueryClient()
  const [uploadedFile, setUploadedFile] = useState(null) // { name, path }
  const [stage, setStage] = useState('idle') // idle | uploading | running | done

  const { data: report } = useQuery({
    queryKey: ['etl-report'],
    queryFn: etlApi.getReport,
    refetchInterval: stage === 'running' ? 2000 : false,
  })

  const { data: runs = [], isLoading: runsLoading } = useQuery({
    queryKey: ['etl-runs'],
    queryFn: etlApi.getRuns,
    refetchInterval: stage === 'running' ? 2000 : false,
  })

  const uploadMut = useMutation({
    mutationFn: etlApi.upload,
    onSuccess: (data) => {
      setUploadedFile({ name: data.filename, path: data.file_path })
      setStage('uploaded')
      toast.success(`"${data.filename}" uploaded (${(data.size_bytes / 1024).toFixed(1)} KB)`)
    },
    onError: (err) => {
      toast.error(err.message)
      setStage('idle')
    },
  })

  const runMut = useMutation({
    mutationFn: (path) => etlApi.run(path),
    onMutate: () => setStage('running'),
    onSuccess: (data) => {
      setStage('done')
      setUploadedFile(null)
      qc.invalidateQueries({ queryKey: ['etl-report'] })
      qc.invalidateQueries({ queryKey: ['etl-runs'] })
      qc.invalidateQueries({ queryKey: ['feedback'] })
      qc.invalidateQueries({ queryKey: ['stats'] })
      toast.success(
        `Pipeline complete — ${data.loaded_records} records loaded, ${data.duplicate_records} duplicates skipped`,
        { duration: 6000 }
      )
    },
    onError: (err) => {
      setStage('done')
      qc.invalidateQueries({ queryKey: ['etl-runs'] })
      toast.error(`Pipeline failed: ${err.message}`, { duration: 8000 })
    },
  })

  const handleFile = (file) => {
    setStage('uploading')
    uploadMut.mutate(file)
  }

  const handleRun = () => {
    if (!uploadedFile?.path) return
    runMut.mutate(uploadedFile.path)
  }

  const handleDownload = async () => {
    try {
      const blob = await etlApi.downloadReport()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'feedback_export.csv'
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Download started')
    } catch {
      toast.error('Download failed')
    }
  }

  const handleReset = () => {
    setUploadedFile(null)
    setStage('idle')
  }

  const pipelineSteps = [
    { icon: Upload, label: 'Upload', done: ['uploaded', 'running', 'done'].includes(stage), active: stage === 'uploading' },
    { icon: Filter, label: 'Extract', done: ['running', 'done'].includes(stage), active: stage === 'running' },
    { icon: Layers, label: 'Transform', done: stage === 'done', active: stage === 'running' },
    { icon: Database, label: 'Load', done: stage === 'done', active: stage === 'running' },
  ]

  return (
    <div className="space-y-8">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-brand-600 flex items-center justify-center shadow-md shadow-violet-500/30">
              <Layers size={18} className="text-white" />
            </span>
            ETL Pipeline
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Import, clean, and load bulk feedback data from CSV or Excel files
          </p>
        </div>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20 transition-all text-sm font-medium border border-emerald-500/20"
        >
          <Download size={15} />
          Export All Feedback
        </button>
      </motion.div>

      {/* Aggregate Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { icon: TrendingUp, label: 'Total Runs', value: report?.total_runs, color: 'bg-brand-500', delay: 0 },
          { icon: FileText, label: 'Records Processed', value: report?.total_records_processed, color: 'bg-violet-500', delay: 0.05 },
          { icon: Database, label: 'Loaded', value: report?.total_loaded, color: 'bg-emerald-500', delay: 0.1 },
          { icon: Trash2, label: 'Duplicates', value: report?.total_duplicates, color: 'bg-amber-500', delay: 0.15 },
          { icon: XCircle, label: 'Invalid', value: report?.total_invalid, color: 'bg-red-500', delay: 0.2 },
          { icon: CheckCircle2, label: 'Avg Valid Rate', value: report ? `${report.avg_valid_rate}%` : undefined, color: 'bg-teal-500', delay: 0.25 },
        ].map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      {/* Upload + Run Panel */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="rounded-2xl bg-white/70 dark:bg-zinc-800/70 backdrop-blur-md border border-white/60 dark:border-zinc-700/60 p-6 shadow-sm"
      >
        <h2 className="text-base font-semibold text-slate-800 dark:text-white mb-5">Run Pipeline</h2>

        {/* Pipeline steps indicator */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-8">
          {pipelineSteps.map((step, i) => (
            <div key={step.label} className="flex items-center gap-2 sm:gap-4">
              <PipelineStep {...step} delay={i * 0.07} />
              {i < pipelineSteps.length - 1 && (
                <div className={cn(
                  'h-0.5 w-8 sm:w-16 rounded-full transition-all duration-500',
                  step.done ? 'bg-emerald-400' : 'bg-slate-200 dark:bg-zinc-700'
                )} />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {stage === 'idle' || stage === 'uploading' ? (
            <motion.div key="dropzone" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <DropZone onFile={handleFile} disabled={stage === 'uploading'} />
              {stage === 'uploading' && (
                <p className="text-center text-sm text-brand-600 dark:text-brand-400 mt-3 flex items-center justify-center gap-2">
                  <RefreshCw size={14} className="animate-spin" />
                  Uploading file…
                </p>
              )}
            </motion.div>
          ) : stage === 'uploaded' ? (
            <motion.div
              key="ready"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col sm:flex-row items-center gap-4 p-5 rounded-xl border-2 border-brand-200 dark:border-brand-800 bg-brand-50/60 dark:bg-brand-900/20"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center shrink-0">
                <FileSpreadsheet size={24} className="text-brand-600 dark:text-brand-400" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <p className="font-semibold text-slate-800 dark:text-white">{uploadedFile?.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Ready to process through the ETL pipeline</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="px-3 py-2 rounded-xl text-sm text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-700 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRun}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white text-sm font-semibold shadow-md shadow-brand-500/30 transition-all"
                >
                  <Play size={15} />
                  Run Pipeline
                </button>
              </div>
            </motion.div>
          ) : stage === 'running' ? (
            <motion.div
              key="running"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-4 py-8"
            >
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-brand-100 dark:border-brand-900/40" />
                <div className="absolute inset-0 rounded-full border-4 border-brand-500 border-t-transparent animate-spin" />
                <div className="absolute inset-3 rounded-full bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center">
                  <Database size={16} className="text-brand-600" />
                </div>
              </div>
              <div className="text-center">
                <p className="font-semibold text-slate-800 dark:text-white">Pipeline Running</p>
                <p className="text-sm text-slate-400 mt-1">Extracting → Transforming → Loading data…</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-4 py-8"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <CheckCircle2 size={32} className="text-emerald-500" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-slate-800 dark:text-white">Pipeline Complete</p>
                <p className="text-sm text-slate-400 mt-1">Check the run history below for details</p>
              </div>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 hover:bg-brand-500/20 text-sm font-medium transition-all"
              >
                <Upload size={15} />
                Upload Another File
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Run History Table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="rounded-2xl bg-white/70 dark:bg-zinc-800/70 backdrop-blur-md border border-white/60 dark:border-zinc-700/60 shadow-sm overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-zinc-700/60">
          <h2 className="text-base font-semibold text-slate-800 dark:text-white flex items-center gap-2">
            <Clock size={16} className="text-slate-400" />
            Run History
            {runs.length > 0 && (
              <span className="ml-1 px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-zinc-700 text-xs font-medium text-slate-500 dark:text-slate-400">
                {runs.length}
              </span>
            )}
          </h2>
          <button
            onClick={() => qc.invalidateQueries({ queryKey: ['etl-runs'] })}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-zinc-700 transition-all"
            title="Refresh"
          >
            <RefreshCw size={14} />
          </button>
        </div>

        {runsLoading ? (
          <div className="p-8 flex flex-col gap-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 rounded-xl bg-slate-100 dark:bg-zinc-700 animate-pulse" />
            ))}
          </div>
        ) : runs.length === 0 ? (
          <div className="py-16 flex flex-col items-center gap-3 text-slate-400">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-zinc-700 flex items-center justify-center">
              <Database size={24} className="text-slate-300 dark:text-zinc-500" />
            </div>
            <p className="font-medium text-slate-500 dark:text-slate-400">No pipeline runs yet</p>
            <p className="text-sm">Upload a file and run the pipeline to see history here</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 dark:border-zinc-700/60">
                  {['Run', 'Filename', 'Status', 'Total', 'Loaded', 'Duplicates', 'Invalid', 'Started', ''].map((h) => (
                    <th key={h} className="px-4 py-3 text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-zinc-800">
                <AnimatePresence initial={false}>
                  {runs.map((run) => (
                    <RunRow key={run.run_id} run={run} />
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  )
}
