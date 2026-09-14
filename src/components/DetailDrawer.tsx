import { useEffect } from 'react'
import {
  categoryLabel,
  deadlineMeta,
  formatDate,
  formatSeenAt,
  labelize,
} from '../lib/format'
import type { OpportunityView } from '../lib/opportunities'

type Props = {
  opportunity: OpportunityView | null
  onClose: () => void
}

function Detail({ label, value }: { label: string; value: string | null }) {
  if (!value) return null
  return (
    <div>
      <dt className="text-xs font-medium tracking-wide text-muted uppercase">{label}</dt>
      <dd className="mt-1 text-sm whitespace-pre-wrap text-ink">{value}</dd>
    </div>
  )
}

export function DetailDrawer({ opportunity, onClose }: Props) {
  useEffect(() => {
    if (!opportunity) return
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [opportunity, onClose])

  if (!opportunity) return null

  const deadline = deadlineMeta(opportunity.deadline)

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-black/60"
        aria-label="Close details"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="opportunity-title"
        className="relative flex h-full w-full max-w-xl flex-col border-l border-line bg-bg shadow-2xl"
      >
        <header className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
          <div>
            <p className="text-xs tracking-wide text-muted uppercase">
              {categoryLabel(opportunity.category)} · {labelize(opportunity.opportunity_type)}
            </p>
            <h2 id="opportunity-title" className="mt-1 text-lg font-semibold text-ink">
              {opportunity.title}
            </h2>
            <p className="mt-1 text-sm text-muted">{opportunity.org || 'Unknown org'}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-line px-2.5 py-1 text-sm text-muted"
          >
            Close
          </button>
        </header>

        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-white/10 px-2 py-1">{labelize(opportunity.status)}</span>
            <span className="rounded-full bg-white/10 px-2 py-1">{deadline.label}</span>
            {opportunity.location ? (
              <span className="rounded-full bg-white/10 px-2 py-1">
                {labelize(opportunity.location)}
              </span>
            ) : null}
          </div>

          {opportunity.reward ? (
            <p className="rounded-xl border border-accent/20 bg-accent-dim/40 px-3 py-2 text-sm text-accent">
              {opportunity.reward}
            </p>
          ) : null}

          {opportunity.description ? (
            <p className="text-sm leading-relaxed text-ink/90">{opportunity.description}</p>
          ) : (
            <p className="text-sm text-muted">No description provided.</p>
          )}

          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Detail label="Eligibility" value={opportunity.eligibility} />
            <Detail
              label="Start"
              value={opportunity.start_date ? formatDate(opportunity.start_date) : null}
            />
            <Detail
              label="End"
              value={opportunity.end_date ? formatDate(opportunity.end_date) : null}
            />
            <Detail
              label="Deadline"
              value={opportunity.deadline ? formatDate(opportunity.deadline) : null}
            />
            <Detail label="Source" value={opportunity.source} />
            <Detail label="First seen" value={formatSeenAt(opportunity.first_seen_at)} />
            <Detail label="Last seen" value={formatSeenAt(opportunity.last_seen_at)} />
          </dl>

          {opportunity.source_url ? (
            <a
              href={opportunity.source_url}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-block text-sm text-accent underline-offset-2 hover:underline"
            >
              Source page
            </a>
          ) : null}
        </div>

        <footer className="border-t border-line p-4">
          <a
            href={opportunity.url}
            target="_blank"
            rel="noreferrer noopener"
            className="flex w-full items-center justify-center rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-bg"
          >
            Apply
          </a>
        </footer>
      </aside>
    </div>
  )
}
