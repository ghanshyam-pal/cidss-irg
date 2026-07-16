import { memo } from "react";

const SidebarIcons = memo(({ name }) => {
  const icons = {
    dashboard: (
      <>
        <path d="M12 12l4.2-4.2M12 20a8 8 0 10-8-8" />
        <path d="M4 12a8 8 0 018-8" strokeDasharray="2 3" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3.2" />
        <path d="M12 3v3.6M12 17.4V21M21 12h-3.6M6.6 12H3M18.4 5.6l-2.5 2.5M8.1 15.9l-2.5 2.5M18.4 18.4l-2.5-2.5M8.1 8.1L5.6 5.6" />
      </>
    ),
    history: (
      <>
        <path d="M3 18c3-5 5 5 8 0s5-5 8 0" />
        <path d="M3 9c3-5 5 5 8 0s5-5 8 0" opacity="0.4" />
      </>
    ),
    layers: (
      <>
        <path d="M3 17l9-4 9 4-9 4-9-4z" />
        <path d="M3 11l9-4 9 4" opacity="0.55" />
      </>
    ),
    trending: (
      <>
        <path d="M3 17l5-5 4 4 8-9" />
        <path d="M15 7h5v5" />
      </>
    ),
    bell: (
      <path d="M18 16v-5a6 6 0 00-4.5-5.8V4a1.5 1.5 0 00-3 0v1.2A6 6 0 006 11v5l-2 2.5h16L18 16zM10 20.5a2 2 0 004 0" />
    ),
    map: (
      <>
        <path d="M12 21s-6.5-6.1-6.5-11A6.5 6.5 0 1118.5 10c0 4.9-6.5 11-6.5 11z" />
        <circle cx="12" cy="10" r="2.2" />
      </>
    ),
    activity: <path d="M2 12h4l2-6 3 12 3-9 2 3h6" />,
    terminal: (
      <path d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    ),
    users: (
      <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    ),
    cloud: (
      <>
        <path d="M6.5 17a4 4 0 01.5-8 5 5 0 019.6-1.5A4.5 4.5 0 0118 17H6.5z" />
        <path d="M8 20l1-2M12 20l1-2M16 20l1-2" opacity="0.6" />
      </>
    ),
    cpu: (
      <path d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 5h10a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2z" />
    ),
    file: (
      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    ),
  };
  return (
    <svg
      className="w-5 h-5 transition-transform group-hover:scale-105"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {icons[name] || <path d="M4 6h16M4 12h16M4 18h16" />}
    </svg>
  );
});

export default SidebarIcons;
