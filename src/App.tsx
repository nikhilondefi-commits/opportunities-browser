import { useCallback, useEffect, useMemo, useState } from 'react'
import { DetailDrawer } from './components/DetailDrawer'
import { FilterBar } from './components/FilterBar'
import { OpportunityCard } from './components/OpportunityCard'
import {
  emptyFilters,
  fetchOpportunities,
  PAGE_SIZE,
  type OpportunityFilters,
  type OpportunityView,
} from './lib/opportunities'
import { isSupabaseConfigured } from './lib/supabase'

function useDebounced<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delay)
    return () => window.clearTimeout(id)
  }, [value, delay])
  return debounced
}

export default function App() {
  const [filters, setFilters] = useState<OpportunityFilters>(emptyFilters)
  const [filtersOpen, setFiltersOpen] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 640px)').matches,
  )
  const [page, setPage] = useState(0)
  const [rows, setRows] = useState<OpportunityView[]>([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<OpportunityView | null>(null)

  const debouncedSearch = useDebounced(filters.search, 300)
  const queryFilters = useMemo(
    () => ({ ...filters, search: debouncedSearch }),
    [filters, debouncedSearch],
  )

  const load = useCallback(
    async (nextPage: number, append: boolean, signal: AbortSignal) => {
      if (append) {
        setLoadingMore(true)
      } else {
        setLoading(true)
      }
      setError(null)
      try {
        const result = await fetchOpportunities(queryFilters, nextPage, signal)
        if (signal.aborted) return
        setCount(result.count)
        setRows((current) => (append ? [...current, ...result.rows] : result.rows))
        setPage(nextPage)
      } catch (caught) {
        if (signal.aborted) return
        const message =
          caught instanceof Error ? caught.message : 'Failed to load opportunities'
        setError(message)
        if (!append) {
          setRows([])
          setCount(0)
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false)
          setLoadingMore(false)
        }
      }
    },
    [queryFilters],
  )

  useEffect(() => {
    if (!isSupabaseConfigured) return
    const controller = new AbortController()
    void load(0, false, controller.signal)
    return () => controller.abort()
  }, [load])

  function handleFiltersChange(next: OpportunityFilters) {
    setFilters(next)
    setPage(0)
  }

  const hasMore = rows.length < count

  return (
    <div className="min-h-dvh bg-bg text-ink">
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-5 sm:px-6">
          <p className="text-xs font-medium tracking-[0.2em] text-accent uppercase">
            Read-only feed
          </p>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Opportunities Browser
          </h1>
          <p className="text-sm text-muted">
            AI and Web3 grants, bounties, hackathons, and related openings.
          </p>
        </div>
      </header>

      {!isSupabaseConfigured ? (
        <main className="mx-auto max-w-xl px-4 py-16 text-center">
          <h2 className="text-lg font-semibold">Supabase is not configured</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Copy <code className="text-accent">.env.example</code> to{' '}
            <code className="text-accent">.env</code> and set{' '}
            <code className="text-accent">VITE_SUPABASE_URL</code> plus{' '}
            <code className="text-accent">VITE_SUPABASE_ANON_KEY</code>. Use the
            publishable/anon key only — never the service_role key.
          </p>
        </main>
      ) : (
        <>
          <FilterBar
            filters={filters}
            onChange={handleFiltersChange}
            onClear={() => handleFiltersChange(emptyFilters)}
            open={filtersOpen}
            onToggle={() => setFiltersOpen((value) => !value)}
          />
          <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
            <div className="mb-4 flex items-center justify-between text-sm text-muted">
              <p>
                {loading && rows.length === 0
                  ? 'Loading…'
                  : `${count.toLocaleString()} ${count === 1 ? 'opportunity' : 'opportunities'}`}
              </p>
            </div>

            {error ? (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {error}
              </div>
            ) : null}

            {loading && rows.length === 0 ? (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-40 animate-pulse rounded-2xl border border-line bg-surface"
                  />
                ))}
              </div>
            ) : null}

            {!loading && rows.length === 0 && !error ? (
              <p className="rounded-2xl border border-dashed border-line px-4 py-16 text-center text-sm text-muted">
                No opportunities match these filters.
              </p>
            ) : null}

            {rows.length > 0 ? (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {rows.map((opportunity) => (
                  <OpportunityCard
                    key={opportunity.id}
                    opportunity={opportunity}
                    onOpen={setSelected}
                  />
                ))}
              </div>
            ) : null}

            {hasMore ? (
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  disabled={loadingMore}
                  onClick={() => {
                    const controller = new AbortController()
                    void load(page + 1, true, controller.signal)
                  }}
                  className="rounded-xl border border-line bg-surface px-4 py-2 text-sm font-medium text-ink disabled:opacity-50"
                >
                  {loadingMore
                    ? 'Loading…'
                    : `Load more (${PAGE_SIZE} per page)`}
                </button>
              </div>
            ) : null}
          </main>
        </>
      )}

      <DetailDrawer opportunity={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
