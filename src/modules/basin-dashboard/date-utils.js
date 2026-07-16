// date-utils.js — dynamic date/time helpers. Nothing here is hardcoded;
// every value is derived from a `Date` passed in at call time so the
// dashboard always reflects the real current date, not a fixed demo date.

export function formatWeekdayDate(d) {
  // e.g. "Mon, 13 Jul 2026"
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })
}

export function formatShortDate(d) {
  // e.g. "13 Jul"
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
}

export function formatFullDate(d) {
  // e.g. "13 Jul 2026"
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function formatClock(d) {
  // e.g. "14:45"
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })
}

export function formatDateTime(d) {
  // e.g. "13 Jul 2026 · 14:45 LKT"
  return `${formatFullDate(d)} · ${formatClock(d)} LKT`
}

export function relativeTime(from, now = new Date()) {
  const diffMs = Math.max(0, now - from)
  const mins = Math.round(diffMs / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? 's' : ''} ago`
  const days = Math.round(hrs / 24)
  return `${days} day${days > 1 ? 's' : ''} ago`
}

export function addDays(date, n) {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d
}

export function addMinutes(date, n) {
  return new Date(date.getTime() + n * 60000)
}