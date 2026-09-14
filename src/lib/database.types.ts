export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      opportunities: {
        Row: {
          category: string
          deadline: string | null
          description: string | null
          eligibility: string | null
          end_date: string | null
          first_seen_at: string
          id: string
          last_seen_at: string
          location: string | null
          opportunity_type: string
          org: string | null
          raw: Json | null
          reward: string | null
          source: string | null
          source_url: string | null
          start_date: string | null
          status: string
          title: string
          unique_key: string
          updated_at: string
          url: string
        }
        Insert: {
          category: string
          deadline?: string | null
          description?: string | null
          eligibility?: string | null
          end_date?: string | null
          first_seen_at?: string
          id?: string
          last_seen_at?: string
          location?: string | null
          opportunity_type: string
          org?: string | null
          raw?: Json | null
          reward?: string | null
          source?: string | null
          source_url?: string | null
          start_date?: string | null
          status?: string
          title: string
          unique_key: string
          updated_at?: string
          url: string
        }
        Update: {
          category?: string
          deadline?: string | null
          description?: string | null
          eligibility?: string | null
          end_date?: string | null
          first_seen_at?: string
          id?: string
          last_seen_at?: string
          location?: string | null
          opportunity_type?: string
          org?: string | null
          raw?: Json | null
          reward?: string | null
          source?: string | null
          source_url?: string | null
          start_date?: string | null
          status?: string
          title?: string
          unique_key?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

export type Opportunity = Database['public']['Tables']['opportunities']['Row']

export const CATEGORIES = ['ai', 'web3', 'ai_web3', 'dev', 'other'] as const
export const STATUSES = [
  'open',
  'upcoming',
  'closing_soon',
  'closed',
  'unknown',
] as const
export const OPPORTUNITY_TYPES = [
  'grant',
  'bounty',
  'hackathon',
  'fellowship',
  'accelerator',
  'job_contract',
  'contest',
  'other',
] as const

export type Category = (typeof CATEGORIES)[number]
export type Status = (typeof STATUSES)[number]
export type OpportunityType = (typeof OPPORTUNITY_TYPES)[number]
