import { memo, useMemo } from "react";
import { RECENT_ALERTS } from "@/data/basinDashboard";
import { getStatusDot, getStatusClasses } from "@/utils/dashboardHelpers";
import { Bell, Clock, ArrowUpRight, ShieldCheck } from "lucide-react";

const RecentAlerts = memo(({ filterBasin }) => {
  const filteredAlerts = useMemo(() => {
    return RECENT_ALERTS.filter((a) => !filterBasin || a.basin === filterBasin);
  }, [filterBasin]);

  return (
    <div className="w-full max-w-full bg-white rounded-2xl shadow-sm shadow-slate-200/40 border border-slate-100/90 overflow-hidden flex flex-col h-full min-h-[340px]">
      {/* Premium Analytics Header Strip */}
      <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/30 shrink-0 select-none">
        <span className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Bell className="w-4 h-4 text-blue-500 stroke-[2.2]" />
          Recent Operations Logs
        </span>
        <button
          type="button"
          className="text-xs text-blue-600 font-bold hover:text-blue-800 flex items-center gap-0.5 transition-colors focus:outline-none cursor-pointer"
        >
          View Live Feed
          <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>
      </div>

      {/* Main Timeline Workspace Viewport */}
      <div className="flex-1 overflow-y-auto px-4 py-3 scrollbar-thin">
        {filteredAlerts.length > 0 ? (
          <div className="relative border-l-2 border-slate-100 ml-2.5 pl-5 space-y-4 py-1.5">
            {filteredAlerts.map((a, i) => (
              <div
                key={i}
                className="relative group flex flex-col gap-1.5 p-3 rounded-xl bg-slate-50/50 hover:bg-white border border-transparent hover:border-slate-100 hover:shadow-sm transition-all duration-200"
              >
                {/* Timeline Connector Bullet Anchor */}
                <div
                  className={`absolute -left-[26px] top-4.5 w-2.5 h-2.5 rounded-full ring-4 ring-white shadow-sm transition-transform group-hover:scale-110 duration-150 ${getStatusDot(a.status)}`}
                />

                {/* Gauge Station Title Header */}
                <div className="text-xs font-black text-slate-900 truncate tracking-tight pr-2">
                  {a.gauge}
                </div>

                {/* Telemetry Status Row */}
                <div className="flex items-center justify-between gap-4 mt-0.5">
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border shadow-xs tracking-wide truncate ${getStatusClasses(
                      a.status,
                    )}`}
                  >
                    {a.level}
                  </span>

                  <span className="text-[11px] text-slate-400 font-mono font-bold tracking-wide flex items-center gap-1 shrink-0 select-none">
                    <Clock className="w-3 h-3 text-slate-400 stroke-[2.2]" />
                    {a.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 select-none">
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 mb-2">
              <ShieldCheck className="w-6 h-6 stroke-[1.8]" />
            </div>
            <p className="text-xs font-bold text-slate-900 tracking-tight">
              No Active Discharges
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5 font-medium max-w-[180px]">
              All sensor telemetry reporting within baseline limits.
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

RecentAlerts.displayName = "RecentAlerts";
export default RecentAlerts;
