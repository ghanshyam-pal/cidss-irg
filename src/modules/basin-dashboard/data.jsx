// data.js — Merged Dashboard Data
// All demo dates/times are generated relative to "now" (see buildDynamicData /
// withLiveTimestamps below) instead of being hardcoded, so the dashboard
// always looks current no matter when it's opened.

import { addDays, addMinutes, formatShortDate, formatFullDate, formatDateTime, formatClock, relativeTime } from './date-utils'

// ─── Stat Cards ────────────────────────────────────────────────────────────
export const STAT_CARDS = [
  { label: 'Active Gauges',    value: '47',   unit: 'of 52',    color: '#2563eb', bg: '#eff6ff', icon: '📡', trend: '+2',  up: true },
  { label: 'Avg River Level',  value: '3.24', unit: 'm',        color: '#0891b2', bg: '#ecfeff', icon: '🌊', trend: '+0.12', up: true },
  { label: 'Total Rainfall',   value: '118',  unit: 'mm/24h',   color: '#7c3aed', bg: '#f5f3ff', icon: '🌧️', trend: '+34', up: true },
  { label: 'Reservoir > 80%',  value: '6',    unit: 'of 23',    color: '#d97706', bg: '#fffbeb', icon: '💧', trend: '0',   up: false },
  { label: 'Active Alerts',    value: '7',    unit: 'stations', color: '#dc2626', bg: '#fef2f2', icon: '🔔', trend: '+3',  up: true },
  { label: 'Forecast Horizon', value: '48',   unit: 'hours',    color: '#059669', bg: '#ecfdf5', icon: '📈', trend: '',    up: false },
]

// ─── Alert status config ─────────────────────────────────────────────────────
export const ALERT_STATUS = {
  NORMAL:      { label: 'Normal',      color: '#16a34a', bg: '#dcfce7', dot: '#22c55e' },
  ALERT:       { label: 'Alert',       color: '#ca8a04', bg: '#fef9c3', dot: '#eab308' },
  MINOR_FLOOD: { label: 'Minor Flood', color: '#ea580c', bg: '#ffedd5', dot: '#f97316' },
  MAJOR_FLOOD: { label: 'Major Flood', color: '#dc2626', bg: '#fee2e2', dot: '#ef4444' },
  CRITICAL:    { label: 'Critical',    color: '#7f1d1d', bg: '#fecaca', dot: '#991b1b' },
}

// ─── Gauges ───────────────────────────────────────────────────────────────
export const GAUGE_DATA = [
  { id: 'G01', name: 'Kalu Ganga – Millakanda',    basin: 'Kalu',       subbasin: 'Upper Kalu',    type: 'river',  lat: 6.533, lng: 80.133, level: 4.82, threshold: 4.5,  status: 'MAJOR_FLOOD', trend: '↑', rain24h: 88,  prevRain24h: 71 },
  { id: 'G02', name: 'Kelani River – Hanwella',     basin: 'Kelani',     subbasin: 'Lower Kelani',  type: 'river',  lat: 6.902, lng: 80.082, level: 3.21, threshold: 3.8,  status: 'ALERT',       trend: '↑', rain24h: 45,  prevRain24h: 40 },
  { id: 'G03', name: 'Mahaweli – Manampitiya',      basin: 'Mahaweli',   subbasin: 'Middle Mahaweli',type:'river',  lat: 7.888, lng: 81.098, level: 2.10, threshold: 4.2,  status: 'NORMAL',      trend: '→', rain24h: 12,  prevRain24h: 14 },
  { id: 'G04', name: 'Gin Ganga – Baddegama',       basin: 'Gin',        subbasin: 'Lower Gin',     type: 'river',  lat: 6.183, lng: 80.183, level: 1.95, threshold: 3.5,  status: 'NORMAL',      trend: '↓', rain24h: 20,  prevRain24h: 26 },
  { id: 'G05', name: 'Nilwala – Pitabeddara',       basin: 'Nilwala',    subbasin: 'Upper Nilwala', type: 'river',  lat: 5.983, lng: 80.533, level: 3.78, threshold: 3.5,  status: 'MINOR_FLOOD', trend: '↑', rain24h: 62,  prevRain24h: 48 },
  { id: 'G06', name: 'Attanagalu – Horombawa',      basin: 'Attanagalu', subbasin: 'Lower Attanagalu',type:'river', lat: 7.133, lng: 80.016, level: 2.45, threshold: 3.0,  status: 'NORMAL',      trend: '→', rain24h: 18,  prevRain24h: 18 },
  { id: 'G07', name: 'Deduru Oya – Dambulla',       basin: 'Deduru',     subbasin: 'Upper Deduru',  type: 'river',  lat: 7.866, lng: 80.649, level: 0.88, threshold: 2.8,  status: 'NORMAL',      trend: '↓', rain24h: 5,   prevRain24h: 9  },
  { id: 'G08', name: 'Walawe – Embilipitiya',       basin: 'Walawe',     subbasin: 'Upper Walawe',  type: 'river',  lat: 6.333, lng: 80.850, level: 5.10, threshold: 4.5,  status: 'MAJOR_FLOOD', trend: '↑', rain24h: 95,  prevRain24h: 77 },
  { id: 'R01', name: 'Kotmale Rain Gauge',           basin: 'Mahaweli',   subbasin: 'Upper Mahaweli',type: 'rain',   lat: 6.998, lng: 80.633, level: null, threshold: null, status: 'NORMAL',      trend: '→', rain24h: 38,  prevRain24h: 35 },
  { id: 'R02', name: 'Ratnapura Rain Gauge',         basin: 'Kalu',       subbasin: 'Upper Kalu',    type: 'rain',   lat: 6.683, lng: 80.400, level: null, threshold: null, status: 'ALERT',       trend: '↑', rain24h: 110, prevRain24h: 82 },
  { id: 'RS01',name: 'Kotmale Reservoir',            basin: 'Mahaweli',   subbasin: 'Upper Mahaweli',type: 'reservoir',lat:6.998,lng:80.633,  level: 3.21,  threshold: 3.8,   status: 'ALERT',       trend: '↑', rain24h: null, prevRain24h: null},
  { id: 'RS02',name: 'Victoria Reservoir',           basin: 'Mahaweli',   subbasin: 'Middle Mahaweli',type:'reservoir',lat:7.216,lng:80.783, level: 2.10,  threshold: 4.2,   status: 'NORMAL',      trend: '→', rain24h: null, prevRain24h: null},
]

/** Attach a "last updated" timestamp to every gauge, relative to `baseNow`.
 *  Used for the map hover tooltip / popup so it shows a real date + time
 *  instead of nothing. */
export function withLiveTimestamps(gauges, baseNow = new Date()) {
  return gauges.map((g, i) => {
    const minsAgo = (i % 5) * 3 + 2
    const lastUpdated = addMinutes(baseNow, -minsAgo)
    return { ...g, lastUpdated, lastUpdatedLabel: formatDateTime(lastUpdated) }
  })
}

// ─── Gauge timeseries (48h) ──────────────────────────────────────────────────
const HOURS = Array.from({ length: 25 }, (_, i) => `${String(i * 2).padStart(2, '0')}:00`)
const makeLevel = (base, noise, seedOffset = 0) =>
  HOURS.map((h, i) => ({
    time: h,
    observed: +(base + Math.sin(i * 0.4 + seedOffset) * noise + (Math.random() - 0.5) * 0.2).toFixed(2),
    forecast:  +(base + Math.sin(i * 0.4 + seedOffset) * noise * 1.1 + 0.15 + (Math.random() - 0.5) * 0.1).toFixed(2),
  }))

export const GAUGE_SERIES = {
  G01: makeLevel(4.2, 0.7),
  G02: makeLevel(2.9, 0.5),
  G05: makeLevel(3.4, 0.5),
  G08: makeLevel(4.7, 0.6),
}

/** Re-roll the last couple of points of a series to simulate a live feed.
 *  Passing a changing `tick` value is what makes the river-level chart
 *  animate on its own (recharts animates whenever the data it's fed changes). */
export function withLiveJitter(series, tick = 0) {
  if (!series || series.length === 0) return series
  return series.map((pt, i) => {
    if (i < series.length - 3) return pt
    const wobble = Math.sin(tick * 0.6 + i) * 0.08
    return {
      ...pt,
      observed: +(pt.observed + wobble).toFixed(2),
      forecast: +(pt.forecast + wobble * 0.8).toFixed(2),
    }
  })
}

// ─── Map layers config ────────────────────────────────────────────────────────
export const HYDRO_LAYERS = [
  { id: 'basins',    label: 'River Basins',       color: '#3b82f6', default: true  },
  { id: 'subbasins', label: 'Sub-basins',          color: '#06b6d4', default: false },
  { id: 'rivers',    label: 'River Network',       color: '#1d4ed8', default: true  },
  { id: 'gauges',    label: 'River Gauges',        color: '#ef4444', default: true  },
  { id: 'reservoirs',label: 'Reservoirs',          color: '#8b5cf6', default: true  },
  { id: 'flood',     label: 'Flood Extent',        color: '#f97316', default: true  },
  { id: 'gnDiv',     label: 'GN Divisions',        color: '#64748b', default: false },
]

// rainGauge stays a permanent marker layer; rainfall/temp/humidity are the
// three parameters that auto-cycle every 3s while in Meteo mode.
export const METEO_LAYERS = [
  { id: 'rainGauge', label: 'Rain Gauges',         color: '#06b6d4', default: true  },
  { id: 'rainfall',  label: 'Rainfall (IDW)',       color: '#7c3aed', default: true,  unit: 'mm' },
  { id: 'temp',      label: 'Temperature',          color: '#f59e0b', default: false, unit: '°C' },
  { id: 'humidity',  label: 'Humidity',             color: '#10b981', default: false, unit: '%'  },
  { id: 'radar',     label: 'Weather Radar',        color: '#0891b2', default: false },
  { id: 'wind',      label: 'Wind Field',           color: '#64748b', default: false, unit: 'km/h' },
  { id: 'cyclone',   label: 'Cyclone Track',        color: '#ef4444', default: false },
]

// Parameters that auto-cycle on the Meteo map every 3 seconds
export const METEO_CYCLE_PARAMS = ['rainfall', 'temp', 'humidity']

// ─── Basin + subbasin definitions for search ──────────────────────────────────
export const BASINS = [
  { id: 'kalu',       name: 'Kalu Ganga Basin',        area: 2727, gauges: 8,  reservoirs: 2 },
  { id: 'kelani',     name: 'Kelani River Basin',       area: 2292, gauges: 12, reservoirs: 4 },
  { id: 'mahaweli',   name: 'Mahaweli Basin',           area: 10448,gauges: 15, reservoirs: 6 },
  { id: 'nilwala',    name: 'Nilwala River Basin',      area: 969,  gauges: 6,  reservoirs: 1 },
  { id: 'walawe',     name: 'Walawe River Basin',       area: 2448, gauges: 8,  reservoirs: 3 },
  { id: 'attanagalu', name: 'Attanagalu Oya Basin',     area: 722,  gauges: 5,  reservoirs: 1 },
  { id: 'deduru',     name: 'Deduru Oya Basin',         area: 2609, gauges: 6,  reservoirs: 2 },
  { id: 'gin',        name: 'Gin Ganga Basin',          area: 932,  gauges: 4,  reservoirs: 1 },
]

// ─── Sri Lanka capital fallback for the header (used when no user location
// is supplied — Colombo is the commercial capital) ──────────────────────────
export const CAPITAL_LOCATION = {
  name: 'Colombo, Sri Lanka',
  temp: 31, high: 33, low: 26, humidity: 74,
  condition: 'Partly Cloudy', icon: '⛅',
}

// ─── Dynamic data: forecasts, observed rainfall, reservoirs, alerts ─────────
// Everything with a date/time is generated here relative to `baseNow`
// instead of being a fixed string, per the "no static dates" requirement.
export function buildDynamicData(baseNow = new Date()) {
  // 7-day forward rainfall forecast (today + next 6 days)
  const FORECAST_7DAY = [
    { rainfall: 28, level: 3.1, intensity: 'Normal',       icon: '🌤' },
    { rainfall: 45, level: 3.4, intensity: 'Heavy',        icon: '🌧' },
    { rainfall: 82, level: 4.2, intensity: 'Very Heavy',   icon: '⛈' },
    { rainfall: 60, level: 4.8, intensity: 'Very Heavy',   icon: '🌧' },
    { rainfall: 35, level: 4.1, intensity: 'Moderate',     icon: '🌦' },
    { rainfall: 20, level: 3.5, intensity: 'Light',        icon: '🌤' },
    { rainfall: 15, level: 3.0, intensity: 'Light',        icon: '☀' },
  ].map((d, i) => {
    const raw = addDays(baseNow, i)
    return { ...d, date: formatShortDate(raw), fullDate: formatFullDate(raw), raw }
  })

  // Observed rainfall — past 7 days (ending today), dated rather than day-named
  const RAINFALL_DATA = [
    { Kalu: 42, Kelani: 28, Mahaweli: 10, Nilwala: 35 },
    { Kalu: 18, Kelani: 55, Mahaweli: 5,  Nilwala: 22 },
    { Kalu: 65, Kelani: 40, Mahaweli: 18, Nilwala: 48 },
    { Kalu: 30, Kelani: 12, Mahaweli: 8,  Nilwala: 30 },
    { Kalu: 88, Kelani: 70, Mahaweli: 22, Nilwala: 75 },
    { Kalu: 55, Kelani: 45, Mahaweli: 14, Nilwala: 60 },
    { Kalu: 72, Kelani: 38, Mahaweli: 30, Nilwala: 55 },
  ].map((d, i, arr) => {
    const raw = addDays(baseNow, i - (arr.length - 1))
    return { ...d, date: formatShortDate(raw), fullDate: formatFullDate(raw), raw }
  })

  // 7-day rainfall forecast by basin
  const RAINFALL_FORECAST_BASIN = [
    { Kalu: 30, Kelani: 22, Mahaweli: 10, Nilwala: 28, Walawe: 18 },
    { Kalu: 55, Kelani: 42, Mahaweli: 18, Nilwala: 48, Walawe: 35 },
    { Kalu: 90, Kelani: 68, Mahaweli: 25, Nilwala: 80, Walawe: 72 },
    { Kalu: 72, Kelani: 55, Mahaweli: 20, Nilwala: 65, Walawe: 60 },
    { Kalu: 42, Kelani: 30, Mahaweli: 14, Nilwala: 38, Walawe: 30 },
    { Kalu: 25, Kelani: 18, Mahaweli: 8,  Nilwala: 22, Walawe: 15 },
    { Kalu: 18, Kelani: 12, Mahaweli: 5,  Nilwala: 15, Walawe: 10 },
  ].map((d, i) => {
    const raw = addDays(baseNow, i)
    return { ...d, date: formatShortDate(raw), fullDate: formatFullDate(raw), raw }
  })

  // Reservoir storage with a live "last updated" timestamp
  const RESERVOIR_DATA = [
    { name: 'Kotmale',     capacity: 174, current: 158, pct: 91, minsAgo: 4  },
    { name: 'Victoria',    capacity: 722, current: 589, pct: 82, minsAgo: 9  },
    { name: 'Randenigala', capacity: 552, current: 408, pct: 74, minsAgo: 12 },
    { name: 'Udawalawe',   capacity: 268, current: 162, pct: 60, minsAgo: 6  },
    { name: 'Kalu Ganga',  capacity: 49,  current: 46,  pct: 94, minsAgo: 3  },
    { name: 'Rantambe',    capacity: 49,  current: 28,  pct: 57, minsAgo: 15 },
  ].map(r => {
    const updatedAt = addMinutes(baseNow, -r.minsAgo)
    return { ...r, updatedAt, updatedLabel: formatDateTime(updatedAt) }
  })

  // Recent alert log, dated/timed rather than a bare "HH:MM"
  const RECENT_ALERTS = [
    { gauge: 'Kalu Ganga – Millakanda', level: 'Major Flood', value: '4.82 m', basin: 'Kalu',    color: '#dc2626', bg: '#fee2e2', minsAgo: 8   },
    { gauge: 'Walawe – Embilipitiya',   level: 'Major Flood', value: '5.10 m', basin: 'Walawe',  color: '#dc2626', bg: '#fee2e2', minsAgo: 42  },
    { gauge: 'Nilwala – Pitabeddara',   level: 'Minor Flood', value: '3.78 m', basin: 'Nilwala', color: '#ea580c', bg: '#ffedd5', minsAgo: 85  },
    { gauge: 'Kelani – Hanwella',        level: 'Alert',       value: '3.21 m', basin: 'Kelani',  color: '#ca8a04', bg: '#fef9c3', minsAgo: 140 },
    { gauge: 'Kalu Ganga – Millakanda', level: 'Alert',       value: '4.42 m', basin: 'Kalu',    color: '#ca8a04', bg: '#fef9c3', minsAgo: 199 },
  ].map(a => {
    const timestamp = addMinutes(baseNow, -a.minsAgo)
    return { ...a, timestamp, dateTimeLabel: formatDateTime(timestamp), relative: relativeTime(timestamp, baseNow) }
  })

  // Active alert cards — value/prevValue drive the ▲/▼ trend indicator
  const ACTIVE_ALERTS = [
    {
      id: 'AL001', type: 'Rainfall Alert', severity: 'Warning',
      title: 'Extremely heavy rainfall', loc: 'Kalu Basin · Ratnapura',
      color: '#ef4444', bg: '#fef2f2', border: '#fecaca',
      stations: ['G01', 'R02'], basin: 'Kalu', minsAgo: 15,
      value: 92, prevValue: 68, unit: 'mm',
    },
    {
      id: 'AL002', type: 'Water Level Alert', severity: 'Danger',
      title: 'Severe flood at Millakanda', loc: 'Kalu Ganga · Station G01',
      color: '#f59e0b', bg: '#fffbeb', border: '#fde68a',
      stations: ['G01'], basin: 'Kalu', minsAgo: 60,
      value: 4.82, prevValue: 4.42, unit: 'm',
    },
    {
      id: 'AL003', type: 'Major Flood Alert', severity: 'Critical',
      title: 'Major flood — Walawe basin', loc: 'Walawe · Embilipitiya',
      color: '#dc2626', bg: '#fef2f2', border: '#fecaca',
      stations: ['G08'], basin: 'Walawe', minsAgo: 120,
      value: 5.10, prevValue: 4.95, unit: 'm',
    },
    {
      id: 'AL004', type: 'Minor Flood Alert', severity: 'Warning',
      title: 'Rising levels at Pitabeddara', loc: 'Nilwala · Pitabeddara',
      color: '#f97316', bg: '#fff7ed', border: '#fed7aa',
      stations: ['G05'], basin: 'Nilwala', minsAgo: 180,
      value: 3.78, prevValue: 3.55, unit: 'm',
    },
    {
      id: 'AL005', type: 'Reservoir Alert', severity: 'Watch',
      title: 'Kotmale nearing 95% capacity', loc: 'Kotmale Reservoir',
      color: '#ca8a04', bg: '#fef9c3', border: '#fde68a',
      stations: ['RS01'], basin: 'Mahaweli', minsAgo: 240,
      value: 91, prevValue: 87, unit: '%',
    },
    {
      id: 'AL006', type: 'Water Discharge Alert', severity: 'Watch',
      title: 'Rising discharge — Walawe Barrage', loc: 'Barrage · Walawe River',
      color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0',
      stations: ['G08'], basin: 'Walawe', minsAgo: 1440,
      value: 118, prevValue: 96, unit: 'm³/s',
    },
  ].map(a => {
    const timestamp = addMinutes(baseNow, -a.minsAgo)
    return {
      ...a,
      timestamp,
      time: relativeTime(timestamp, baseNow),
      clock: `${formatClock(timestamp)} LKT`,
      date: formatFullDate(timestamp),
      up: a.value >= a.prevValue,
      delta: +(a.value - a.prevValue).toFixed(2),
    }
  })

  return { FORECAST_7DAY, RAINFALL_DATA, RAINFALL_FORECAST_BASIN, RESERVOIR_DATA, RECENT_ALERTS, ACTIVE_ALERTS }
}