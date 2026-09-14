const dateFormatter = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
})

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
})

export function formatDate(value: string | null): string {
  if (!value) return '—'
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return value
  return dateFormatter.format(date)
}

export function formatSeenAt(value: string | null): string {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return dateTimeFormatter.format(date)
}

export function deadlineMeta(deadline: string | null): {
  label: string
  tone: 'ok' | 'soon' | 'overdue' | 'none'
} {
  if (!deadline) {
    return { label: 'No deadline', tone: 'none' }
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(`${deadline}T00:00:00`)
  if (Number.isNaN(due.getTime())) {
    return { label: deadline, tone: 'none' }
  }

  const diffDays = Math.round((due.getTime() - today.getTime()) / 86_400_000)
  const formatted = dateFormatter.format(due)

  if (diffDays < 0) {
    return { label: `${formatted} · overdue`, tone: 'overdue' }
  }
  if (diffDays === 0) {
    return { label: `${formatted} · today`, tone: 'soon' }
  }
  if (diffDays <= 14) {
    return { label: `${formatted} · ${diffDays}d left`, tone: 'soon' }
  }
  return { label: formatted, tone: 'ok' }
}

export function labelize(value: string): string {
  return value
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export function categoryLabel(value: string): string {
  switch (value) {
    case 'ai':
      return 'AI'
    case 'web3':
      return 'Web3'
    case 'ai_web3':
      return 'AI + Web3'
    case 'dev':
      return 'Dev'
    default:
      return labelize(value)
  }
}
