import { useState, useEffect, useMemo, memo } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MODULES } from "@/config";
import { useStore } from "@/store";
import { findActiveParentId } from "@/utils/sidebarHelpers";
import ContourTexture from "@/components/core/Sidebar/ContourTexture";
import SidebarIcons from "@/components/core/Sidebar/SidebarIcons";

export default function AppShell() {
  const { i18n } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const user = useStore((s) => s.user);
  const logout = useStore((s) => s.logout);

  const [expanded, setExpanded] = useState(() => {
    const initial = findActiveParentId(MODULES, location.pathname);
    return initial ? { [initial]: true } : {};
  });

  useEffect(() => {
    const activeParent = findActiveParentId(MODULES, location.pathname);
    if (activeParent) {
      setExpanded((prev) => ({ ...prev, [activeParent]: true }));
    }
  }, [location.pathname]);

  const toggleExpanded = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("cidss_lang", lng);
  };

  const currentModule = useMemo(() => {
    for (const mod of MODULES) {
      if (mod.children) {
        const child = mod.children.find((c) =>
          location.pathname.startsWith(c.path),
        );
        if (child) return { ...child, parentLabel: mod.label };
      } else if (mod.path && location.pathname.startsWith(mod.path)) {
        return mod;
      }
    }
    return null;
  }, [location.pathname]);

  const pageTitle = currentModule?.label || "Irrigation Control System";
  const pageParentLabel = currentModule?.parentLabel;

  const initials = useMemo(() => {
    return (user?.name || "Op")
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [user?.name]);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50/70 font-sans text-slate-800 antialiased">
      {/* Dynamic Keyframes for the Pulse Wave */}
      <style>{`
        @keyframes waveMove {
          0% { stroke-dashoffset: 24; }
          100% { stroke-dashoffset: 0; }
        }
      `}</style>

      {/* ── Sidebar Container ── */}
      <aside
        className={`relative flex flex-col bg-slate-900 border-r border-slate-800/60 transition-all duration-300 ease-in-out z-20 shrink-0 shadow-xl shadow-slate-950/20 ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
      >
        <ContourTexture />

        {/* Brand Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-800/50 h-16 relative z-10 bg-slate-950/20">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md shadow-blue-500/20 shrink-0 transition-transform duration-300 hover:scale-105">
            <svg
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              className="w-4 h-4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2C12 2 5 11 5 15a7 7 0 0014 0c0-4-7-13-7-13z" />
            </svg>
          </div>
          {sidebarOpen && (
            <div className="flex flex-col min-w-0 leading-none">
              <span className="text-sm font-bold text-slate-100 tracking-tight truncate">
                CIDSS Terminal
              </span>
              <span className="text-[11px] font-medium text-slate-400 mt-0.5 truncate">
                Sri Lanka Irrigation
              </span>
            </div>
          )}
        </div>

        {/* Telemetry Status Line */}
        {sidebarOpen && (
          <div className="flex items-center gap-2.5 mx-4 mt-4 px-3 py-2 rounded-xl bg-slate-950/40 border border-slate-800/40 text-xs text-emerald-400/90 relative z-10 font-semibold backdrop-blur-sm shadow-inner">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              className="shrink-0"
            >
              <path
                style={{
                  strokeDasharray: "6, 6",
                  animation: "waveMove 2s linear infinite",
                }}
                d="M2 12c3-6 5 6 8 0s5-6 8 0 5-6 4 0"
              />
            </svg>
            <span className="tracking-wide">47 stations online</span>
          </div>
        )}

        {/* Navigation Core */}
        <nav className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1 relative z-10 scrollbar-none">
          {MODULES.map((mod) => {
            const hasChildren =
              Array.isArray(mod.children) && mod.children.length > 0;
            const isExpanded = !!expanded[mod.id];
            const isParentActive =
              hasChildren &&
              mod.children.some((c) => location.pathname.startsWith(c.path));

            if (!hasChildren) {
              return (
                <NavLink
                  key={mod.id}
                  to={mod.path}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 border ${
                      isActive
                        ? "bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-600/20"
                        : "bg-transparent border-transparent text-slate-400 hover:bg-slate-800/40 hover:text-slate-100"
                    }`
                  }
                  title={!sidebarOpen ? mod.label : undefined}
                >
                  <SidebarIcons name={mod.icon} />
                  {sidebarOpen && (
                    <span className="truncate tracking-wide">{mod.label}</span>
                  )}
                </NavLink>
              );
            }

            return (
              <div key={mod.id} className="flex flex-col space-y-0.5">
                <button
                  type="button"
                  className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold border w-full text-left transition-all duration-200 cursor-pointer ${
                    isParentActive
                      ? "bg-slate-800/60 border-slate-800 text-slate-100"
                      : "bg-transparent border-transparent text-slate-400 hover:bg-slate-800/40 hover:text-slate-100"
                  }`}
                  onClick={() => {
                    if (!sidebarOpen) setSidebarOpen(true);
                    toggleExpanded(mod.id);
                  }}
                  title={!sidebarOpen ? mod.label : undefined}
                >
                  <SidebarIcons name={mod.icon} />
                  {sidebarOpen && (
                    <span className="flex-1 truncate tracking-wide">
                      {mod.label}
                    </span>
                  )}
                  {sidebarOpen && (
                    <svg
                      width="12"
                      height="12"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      className={`transition-transform duration-200 text-slate-500 group-hover:text-slate-300 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  )}
                </button>

                {/* Submenu Dropdown Container */}
                {sidebarOpen && (
                  <div
                    className="overflow-hidden transition-all duration-300 ease-in-out pl-9 relative before:absolute before:left-4 before:top-0 before:bottom-2 before:w-px before:bg-slate-800/60"
                    style={{
                      maxHeight: isExpanded
                        ? `${mod.children.length * 34 + 6}px`
                        : "0px",
                      paddingTop: isExpanded ? "4px" : "0px",
                      paddingBottom: isExpanded ? "4px" : "0px",
                    }}
                  >
                    {mod.children.map((child) => (
                      <NavLink
                        key={child.id}
                        to={child.path}
                        className={({ isActive }) =>
                          `flex items-center h-8 px-3 rounded-lg text-xs font-bold transition-all duration-150 ${
                            isActive
                              ? "text-blue-400 bg-blue-500/10 font-extrabold"
                              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/20"
                          }`
                        }
                      >
                        <span className="truncate tracking-wide">
                          {child.label}
                        </span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer Metadata & Toggle Control */}
        <div className="p-3 border-t border-slate-800/60 bg-slate-950/30 relative z-10 flex items-center justify-between h-16 backdrop-blur-sm">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex items-center justify-center w-8.5 h-8.5 rounded-xl bg-slate-800/80 border border-slate-700/50 font-mono text-xs font-bold text-slate-200 shadow-sm shrink-0">
              {initials}
            </div>
            {sidebarOpen && (
              <div className="flex flex-col min-w-0 leading-tight">
                <span className="text-xs font-bold text-slate-200 truncate">
                  {user?.name || "Operator"}
                </span>
                <span className="text-[11px] font-medium text-slate-500 truncate">
                  Hydrologist Desk
                </span>
              </div>
            )}
          </div>
          <button
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700/40 text-[10px] text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarOpen ? "❮" : "❯"}
          </button>
        </div>
      </aside>

      {/* ── Main System Frame ── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Dynamic Top Navigation Header */}
        <header className="flex items-center justify-between px-6 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm shadow-slate-200/30 h-16 shrink-0 z-10">
          <div className="flex items-center min-w-0">
            <h1 className="text-sm md:text-base font-bold text-slate-900 tracking-tight flex items-center gap-1.5 truncate">
              {pageParentLabel && (
                <>
                  <span className="text-slate-400 font-medium">
                    {pageParentLabel}
                  </span>
                  <span className="text-slate-300 font-light text-xs">/</span>
                </>
              )}
              <span className="text-slate-800">{pageTitle}</span>
            </h1>
          </div>

          {/* Action Systems & Localization Toolbar */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="flex p-0.5 bg-slate-100/70 border border-slate-200/40 rounded-xl shadow-inner">
              {["en", "si", "ta"].map((lng) => (
                <button
                  key={lng}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all duration-150 cursor-pointer ${
                    i18n.language === lng
                      ? "bg-white text-blue-600 shadow-sm font-extrabold"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                  onClick={() => changeLanguage(lng)}
                >
                  {lng.toUpperCase()}
                </button>
              ))}
            </div>
            <div className="w-px h-5 bg-slate-200" />
            <button
              className="flex items-center justify-center w-9 h-9 rounded-xl bg-slate-50 border border-slate-200/60 shadow-sm hover:shadow-md hover:bg-slate-100/50 transition-all duration-200 cursor-pointer group"
              onClick={logout}
              title="Sign Out Systems"
            >
              <div className="w-6.5 h-6.5 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center text-xs font-mono font-bold group-hover:bg-blue-600 group-hover:text-white transition-all duration-200">
                {initials}
              </div>
            </button>
          </div>
        </header>

        {/* ── Sub-Frame Main Content Context ── */}
        <main className="flex-1 overflow-y-auto bg-slate-50/40">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
