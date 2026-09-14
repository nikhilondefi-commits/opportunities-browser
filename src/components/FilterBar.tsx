import {
  CATEGORIES,
  OPPORTUNITY_TYPES,
  STATUSES,
} from '../lib/database.types'
import { categoryLabel, labelize } from '../lib/format'
import type { OpportunityFilters } from '../lib/opportunities'

type Props = {
  filters: OpportunityFilters
  onChange: (next: OpportunityFilters) => void
  onClear: () => void
  open: boolean
  onToggle: () => void
}

const selectClass =
  'w-full rounded-lg border border-line bg-surface-2 px-3 py-2 text-sm text-ink'

const labelClass = 'mb-1 block text-xs font-medium uppercase tracking-wide text-muted'

export function FilterBar({ filters, onChange, onClear, open, onToggle }: Props) {
  const activeCount = [
    filters.category,
    filters.status,
    filters.opportunityType,
    filters.deadlineFrom,
    filters.deadlineTo,
    filters.search,
  ].filter(Boolean).length

  function patch(partial: Partial<OpportunityFilters>) {
    onChange({ ...filters, ...partial })
  }

  return (
    <section className="border-b border-line bg-surface/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">Search title or organization</span>
            <input
              id="search"
              name="search"
              type="search"
              value={filters.search}
              onChange={(event) => patch({ search: event.target.value })}
              placeholder="Search title or org"
              className="w-full rounded-lg border border-line bg-surface-2 py-2.5 pr-3 pl-10 text-sm text-ink placeholder:text-muted"
            />
            <svg
              className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3-3" />
            </svg>
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggle}
              className="inline-flex items-center justify-center rounded-lg border border-line bg-surface-2 px-3 py-2 text-sm font-medium text-ink sm:hidden"
              aria-expanded={open}
              aria-controls="opportunity-filters"
            >
              Filters{activeCount ? ` (${activeCount})` : ''}
            </button>
            <button
              type="button"
              onClick={onClear}
              disabled={activeCount === 0}
              className="rounded-lg border border-line px-3 py-2 text-sm text-muted disabled:opacity-40"
            >
              Clear
            </button>
          </div>
        </div>

        <div
          id="opportunity-filters"
          className={`${open ? 'grid' : 'hidden'} grid-cols-1 gap-3 sm:grid sm:grid-cols-2 lg:grid-cols-5`}
        >
          <label>
            <span className={labelClass}>Category</span>
            <select
              id="category"
              name="category"
              className={selectClass}
              value={filters.category}
              onChange={(event) => patch({ category: event.target.value })}
            >
              <option value="">All</option>
              {CATEGORIES.map((value) => (
                <option key={value} value={value}>
                  {categoryLabel(value)}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className={labelClass}>Status</span>
            <select
              id="status"
              name="status"
              className={selectClass}
              value={filters.status}
              onChange={(event) => patch({ status: event.target.value })}
            >
              <option value="">All</option>
              {STATUSES.map((value) => (
                <option key={value} value={value}>
                  {labelize(value)}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className={labelClass}>Type</span>
            <select
              id="opportunity_type"
              name="opportunity_type"
              className={selectClass}
              value={filters.opportunityType}
              onChange={(event) => patch({ opportunityType: event.target.value })}
            >
              <option value="">All</option>
              {OPPORTUNITY_TYPES.map((value) => (
                <option key={value} value={value}>
                  {labelize(value)}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className={labelClass}>Deadline from</span>
            <input
              id="deadline_from"
              name="deadline_from"
              type="date"
              className={selectClass}
              value={filters.deadlineFrom}
              onChange={(event) => patch({ deadlineFrom: event.target.value })}
            />
          </label>
          <label>
            <span className={labelClass}>Deadline to</span>
            <input
              id="deadline_to"
              name="deadline_to"
              type="date"
              className={selectClass}
              value={filters.deadlineTo}
              onChange={(event) => patch({ deadlineTo: event.target.value })}
            />
          </label>
        </div>
      </div>
    </section>
  )
}
