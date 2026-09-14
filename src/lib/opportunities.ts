import type { Opportunity } from './database.types'

export type OpportunityView = Omit<Opportunity, 'raw' | 'unique_key'>
import { getSupabase } from './supabase'

export type OpportunityFilters = {
  category: string
  status: string
  opportunityType: string
  deadlineFrom: string
  deadlineTo: string
  search: string
}

export const emptyFilters: OpportunityFilters = {
  category: '',
  status: '',
  opportunityType: '',
  deadlineFrom: '',
  deadlineTo: '',
  search: '',
}

export const PAGE_SIZE = 40

function sanitizeSearch(raw: string): string {
  return raw
    .trim()
    .replaceAll('\\', '\\\\')
    .replaceAll('%', '\\%')
    .replaceAll('_', '\\_')
    .replaceAll(',', ' ')
    .replaceAll('(', ' ')
    .replaceAll(')', ' ')
}

export async function fetchOpportunities(
  filters: OpportunityFilters,
  page: number,
  signal?: AbortSignal,
): Promise<{ rows: OpportunityView[]; count: number }> {
  const from = page * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let query = getSupabase()
    .from('opportunities')
    .select(
      'id, title, org, category, opportunity_type, url, source_url, source, description, reward, location, eligibility, start_date, end_date, deadline, status, first_seen_at, last_seen_at, updated_at',
      { count: 'exact' },
    )
    .order('deadline', { ascending: true, nullsFirst: false })
    .order('last_seen_at', { ascending: false })
    .range(from, to)
    .abortSignal(signal ?? new AbortController().signal)

  if (filters.category) {
    query = query.eq('category', filters.category)
  }
  if (filters.status) {
    query = query.eq('status', filters.status)
  }
  if (filters.opportunityType) {
    query = query.eq('opportunity_type', filters.opportunityType)
  }
  if (filters.deadlineFrom) {
    query = query.gte('deadline', filters.deadlineFrom)
  }
  if (filters.deadlineTo) {
    query = query.lte('deadline', filters.deadlineTo)
  }

  const search = sanitizeSearch(filters.search)
  if (search) {
    query = query.or(`title.ilike.%${search}%,org.ilike.%${search}%`)
  }

  const { data, error, count } = await query

  if (error) {
    throw error
  }

  return {
    rows: data ?? [],
    count: count ?? 0,
  }
}
