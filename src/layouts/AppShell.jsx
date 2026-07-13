import { useState, useEffect, useMemo } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { MODULES } from '@/config'
import { useStore } from '@/store'
import styles from './AppShell.module.css'

// Icon set redrawn around the subject: gauges, water, terrain — not a
// generic dashboard kit. Same call signature as before, drop-in swap.
const SidebarIcons = ({ name }) => {
  const icons = {
    // Basin dashboard — a gauge dial with a needle
    dashboard: <><path d="M12 12l4.2-4.2M12 20a8 8 0 10-8-8" /><path d="M4 12a8 8 0 018-8" strokeDasharray="2 3" /></>,
    // Gauge management — a stopcock / valve wheel
    settings: <><circle cx="12" cy="12" r="3.2" /><path d="M12 3v3.6M12 17.4V21M21 12h-3.6M6.6 12H3M18.4 5.6l-2.5 2.5M8.1 15.9l-2.5 2.5M18.4 18.4l-2.5-2.5M8.1 8.1L5.6 5.6" /></>,
    // Historical data — a river-stage timeline
    history: <><path d="M3 18c3-5 5 5 8 0s5-5 8 0" /><path d="M3 9c3-5 5 5 8 0s5-5 8 0" opacity="0.4" /></>,
    // Impact forecast — layered terrain contours
    layers: <><path d="M3 17l9-4 9 4-9 4-9-4z" /><path d="M3 11l9-4 9 4" opacity="0.55" /></>,
    // Forecast & discharge — an upward hydrograph
    trending: <><path d="M3 17l5-5 4 4 8-9" /><path d="M15 7h5v5" /></>,
    bell: <path d="M18 16v-5a6 6 0 00-4.5-5.8V4a1.5 1.5 0 00-3 0v1.2A6 6 0 006 11v5l-2 2.5h16L18 16zM10 20.5a2 2 0 004 0" />,
    // Flood map — a topographic pin
    map: <><path d="M12 21s-6.5-6.1-6.5-11A6.5 6.5 0 1118.5 10c0 4.9-6.5 11-6.5 11z" /><circle cx="12" cy="10" r="2.2" /></>,
    // Reservoir anomaly — a pulse across a waterline
    activity: <path d="M2 12h4l2-6 3 12 3-9 2 3h6" />,
    terminal: <path d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />,
    users: <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />,
    // Hydromet — rain falling from a cloud
    cloud: <><path d="M6.5 17a4 4 0 01.5-8 5 5 0 019.6-1.5A4.5 4.5 0 0118 17H6.5z" /><path d="M8 20l1-2M12 20l1-2M16 20l1-2" opacity="0.6" /></>,
    cpu: <path d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 5h10a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2z" />,
    file: <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  }
  return (
    <svg className={styles.iconSvg} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      {icons[name] || <path d="M4 6h16M4 12h16M4 18h16" />}
    </svg>
  )
}

// Faint contour-line texture etched into the sidebar background
const ContourTexture = () => (
  <svg className={styles.contourLayer} viewBox="0 0 264 800" preserveAspectRatio="none" aria-hidden="true">
    <path d="M-20,70 Q66,20 140,70 T300,70" stroke="currentColor" strokeWidth="1" fill="none" />
    <path d="M-20,130 Q76,80 150,130 T310,130" stroke="currentColor" strokeWidth="1" fill="none" />
    <path d="M-20,560 Q66,610 140,560 T300,560" stroke="currentColor" strokeWidth="1" fill="none" />
    <path d="M-20,620 Q76,670 150,620 T310,620" stroke="currentColor" strokeWidth="1" fill="none" />
  </svg>
)

export default function AppShell() {
  const { i18n } = useTranslation()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()
  const user = useStore((s) => s.user)
  const logout = useStore((s) => s.logout)

  const findActiveParentId = (mods, pathname) => {
    for (const mod of mods) {
      if (mod.children?.some((c) => pathname.startsWith(c.path))) return mod.id
    }
    return null
  }

  const [expanded, setExpanded] = useState(() => {
    const initial = findActiveParentId(MODULES, location.pathname)
    return initial ? { [initial]: true } : {}
  })

  useEffect(() => {
    const activeParent = findActiveParentId(MODULES, location.pathname)
    if (activeParent) {
      setExpanded((prev) => ({ ...prev, [activeParent]: true }))
    }
  }, [location.pathname])

  const toggleExpanded = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng)
    localStorage.setItem('cidss_lang', lng)
  }

  const currentModule = useMemo(() => {
    for (const mod of MODULES) {
      if (mod.children) {
        const child = mod.children.find((c) => location.pathname.startsWith(c.path))
        if (child) return { ...child, parentLabel: mod.label }
      } else if (mod.path && location.pathname.startsWith(mod.path)) {
        return mod
      }
    }
    return null
  }, [location.pathname])

  const pageTitle = currentModule?.label || 'Irrigation Control System'
  const pageParentLabel = currentModule?.parentLabel
  const initials = (user?.name || 'Op').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className={`${styles.shell} ${sidebarOpen ? styles.open : styles.collapsed}`}>

      {/* ── Sidebar ── */}
      <aside className={styles.sidebar}>
        <ContourTexture />

        {/* Brand */}
        <div className={styles.brand}>
          <div className={styles.logoWrap}>
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} width="19" height="19" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2C12 2 5 11 5 15a7 7 0 0014 0c0-4-7-13-7-13z" />
            </svg>
          </div>
          {sidebarOpen && (
            <div className={styles.brandText}>
              <span className={styles.brandTitle}>CIDSS Terminal</span>
              <span className={styles.brandSub}>Sri Lanka Irrigation</span>
            </div>
          )}
        </div>

        {/* Live telemetry — an animated flow line, not a static dot */}
        {sidebarOpen && (
          <div className={styles.liveIndicator}>
            <svg className={styles.liveWave} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
              <path className={styles.liveWavePath} d="M2 12c3-6 5 6 8 0s5-6 8 0 5-6 4 0" />
            </svg>
            <span className={styles.liveText}>47 stations online</span>
          </div>
        )}

        {/* Navigation */}
        <nav className={styles.nav}>
          {MODULES.map((mod) => {
            const hasChildren = Array.isArray(mod.children) && mod.children.length > 0
            const isExpanded = !!expanded[mod.id]
            const isParentActive = hasChildren && mod.children.some((c) => location.pathname.startsWith(c.path))

            if (!hasChildren) {
              return (
                <NavLink
                  key={mod.id}
                  to={mod.path}
                  className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
                  title={!sidebarOpen ? mod.label : undefined}
                >
                  <span className={styles.navIcon}><SidebarIcons name={mod.icon} /></span>
                  {sidebarOpen && <span className={styles.navLabel}>{mod.label}</span>}
                </NavLink>
              )
            }

            return (
              <div key={mod.id} className={styles.navParentBlock}>
                <button
                  type="button"
                  className={`${styles.navItem} ${styles.navParent} ${isParentActive ? styles.active : ''}`}
                  onClick={() => {
                    if (!sidebarOpen) setSidebarOpen(true)
                    toggleExpanded(mod.id)
                  }}
                  title={!sidebarOpen ? mod.label : undefined}
                >
                  <span className={styles.navIcon}><SidebarIcons name={mod.icon} /></span>
                  {sidebarOpen && <span className={styles.navLabel}>{mod.label}</span>}
                  {sidebarOpen && (
                    <span className={`${styles.navChevron} ${isExpanded ? styles.chevronOpen : ''}`}>
                      <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  )}
                </button>

                {sidebarOpen && (
                  <div
                    className={styles.navChildren}
                    style={{ maxHeight: isExpanded ? `${mod.children.length * 38 + 8}px` : '0px' }}
                  >
                    {mod.children.map((child) => (
                      <NavLink
                        key={child.id}
                        to={child.path}
                        className={({ isActive }) => `${styles.navChildItem} ${isActive ? styles.activeChild : ''}`}
                      >
                        <span className={styles.navChildLabel}>{child.label}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        {/* Footer — hexagonal survey-marker avatar */}
        <div className={styles.userSection}>
          <div className={styles.userAvatar}>{initials}</div>
          {sidebarOpen && (
            <div className={styles.userInfo}>
              <div className={styles.userNameSide}>{user?.name || 'Operator'}</div>
              <div className={styles.userRole}>Hydrologist Desk</div>
            </div>
          )}
          <button
            className={styles.sidebarToggle}
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label={sidebarOpen ? 'Collapse' : 'Expand'}
          >
            {sidebarOpen ? '❮' : '❯'}
          </button>
        </div>
      </aside>

      {/* ── Content ── */}
      <div className={styles.main}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.pageTitle}>
              {pageParentLabel && (
                <>
                  <span className={styles.pageTitleParent}>{pageParentLabel}</span>
                  <span className={styles.pageTitleSep}>/</span>
                </>
              )}
              {pageTitle}
            </h1>
          </div>

          <div className={styles.headerActions}>
            <div className={styles.langSwitch}>
              {['en', 'si', 'ta'].map((lng) => (
                <button
                  key={lng}
                  className={`${styles.langBtn} ${i18n.language === lng ? styles.activeLang : ''}`}
                  onClick={() => changeLanguage(lng)}
                >
                  {lng.toUpperCase()}
                </button>
              ))}
            </div>
            <div className={styles.headerDivider} />
            <div className={styles.userMenuHeader} onClick={logout} title="Sign Out Systems">
              <div className={styles.headerAvatar}>{initials}</div>
            </div>
          </div>
        </header>

        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}