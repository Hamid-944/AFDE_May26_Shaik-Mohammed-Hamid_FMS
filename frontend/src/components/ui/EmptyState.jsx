import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button } from './Button'

function NoFeedbackIllustration() {
  return (
    <svg width="160" height="140" viewBox="0 0 160 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="20" width="120" height="90" rx="14" className="fill-slate-100 dark:fill-zinc-800" />
      <rect x="36" y="38" width="88" height="8" rx="4" className="fill-slate-200 dark:fill-zinc-700" />
      <rect x="36" y="54" width="60" height="6" rx="3" className="fill-slate-200 dark:fill-zinc-700" />
      <rect x="36" y="68" width="72" height="6" rx="3" className="fill-slate-200 dark:fill-zinc-700" />
      <rect x="36" y="82" width="44" height="6" rx="3" className="fill-slate-200 dark:fill-zinc-700" />
      <circle cx="118" cy="106" r="22" className="fill-brand-100 dark:fill-brand-900/30" />
      <path d="M118 97v9M118 110v2" stroke="#3b63f7" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

function NoResultsIllustration() {
  return (
    <svg width="160" height="140" viewBox="0 0 160 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="72" cy="64" r="36" className="fill-slate-100 dark:fill-zinc-800" />
      <circle cx="72" cy="64" r="26" className="fill-slate-200 dark:fill-zinc-700" />
      <line x1="98" y1="88" x2="122" y2="114" stroke="#94a3b8" strokeWidth="8" strokeLinecap="round" />
      <path d="M63 56l18 16M81 56L63 72" stroke="#3b63f7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SearchIllustration() {
  return (
    <svg width="160" height="140" viewBox="0 0 160 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="24" y="50" width="112" height="44" rx="22" className="fill-slate-100 dark:fill-zinc-800" />
      <circle cx="57" cy="72" r="12" className="fill-slate-200 dark:fill-zinc-700" />
      <rect x="76" y="67" width="44" height="6" rx="3" className="fill-slate-200 dark:fill-zinc-700" />
      <rect x="76" y="77" width="28" height="4" rx="2" className="fill-slate-200 dark:fill-zinc-700" />
      <circle cx="57" cy="72" r="6" className="fill-brand-400" />
    </svg>
  )
}

const variants = {
  container: { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } },
}

export function EmptyState({
  type = 'empty',
  title,
  description,
  action,
}) {
  const config = {
    empty: {
      illustration: <NoFeedbackIllustration />,
      defaultTitle: 'No feedback yet',
      defaultDesc: 'Be the first to share your experience.',
    },
    search: {
      illustration: <NoResultsIllustration />,
      defaultTitle: 'No results found',
      defaultDesc: 'Try adjusting your search or filter.',
    },
    start: {
      illustration: <SearchIllustration />,
      defaultTitle: 'Start searching',
      defaultDesc: 'Type a keyword to find feedback.',
    },
  }

  const { illustration, defaultTitle, defaultDesc } = config[type] ?? config.empty

  return (
    <motion.div
      variants={variants.container}
      initial="hidden"
      animate="show"
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        {illustration}
      </motion.div>
      <h3 className="mt-4 text-base font-semibold text-slate-700 dark:text-slate-300">
        {title ?? defaultTitle}
      </h3>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-xs">
        {description ?? defaultDesc}
      </p>
      {action && (
        <div className="mt-6">
          <Button as={Link} to={action.to} size="md">
            {action.label}
          </Button>
        </div>
      )}
    </motion.div>
  )
}
