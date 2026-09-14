import { categoryLabel, deadlineMeta, labelize } from '../lib/format'
import type { OpportunityView } from '../lib/opportunities'

type Props = {
  opportunity: OpportunityView
  onOpen: (opportunity: OpportunityView) => void
}

const badgeClass: Record<string, string> = {
  open: 'bg-emerald-500/15 text-emerald-300',
  upcoming: 'bg-sky-500/15 text-sky-300',
  closing_soon: 'bg-amber-500/15 text-amber-300',
  closed: 'bg-rose-500/15 text-rose-300',
  unknown: 'bg-zinc-500/20 text-zinc-300',
}

const deadlineClass: Record<string, string> = {
  ok: 'text-muted',
  soon: 'text-amber-300',
  overdue: 'text-rose-300',
  none: 'text-muted',
}

export function OpportunityCard({ opportunity, onOpen }: Props) {
  const deadline = deadlineMeta(opportunity.deadline)

  return (
    <button
      type="button"
      onClick={() => onOpen(opportunity)}
      className="flex w-full flex-col rounded-2xl border border-line bg-surface p-4 text-left transition hover:border-accent/40 hover:bg-surface-2"
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full px-2 py-0.5 text-[11px] font-medium tracking-wide uppercase ${badgeClass[opportunity.status] ?? badgeClass.unknown}`}
        >
          {labelize(opportunity.status)}
        </span>
        <span className="rounded-full bg-teal-500/15 px-2 py-0.5 text-[11px] font-medium text-teal-200">
          {categoryLabel(opportunity.category)}
        </span>
        <span className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] font-medium text-muted">
          {labelize(opportunity.opportunity_type)}
        </span>
      </div>
      <h2 className="text-base leading-snug font-semibold text-ink">
        {opportunity.title}
      </h2>
      <p className="mt-1 text-sm text-muted">{opportunity.org || 'Unknown org'}</p>
      {opportunity.reward ? (
        <p className="mt-2 line-clamp-1 text-sm text-accent">{opportunity.reward}</p>
      ) : null}
      <div className="mt-4 flex items-center justify-between gap-3 text-xs">
        <span className={deadlineClass[deadline.tone]}>{deadline.label}</span>
        {opportunity.location ? (
          <span className="text-muted">{labelize(opportunity.location)}</span>
        ) : null}
      </div>
    </button>
  )
}
