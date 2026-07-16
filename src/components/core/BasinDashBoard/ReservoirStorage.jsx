import { memo } from "react";
import { RESERVOIR_DATA } from "@/data/basinDashboard";
import {
  getReservoirColorClass,
  getReservoirTextClass,
} from "@/utils/dashboardHelpers";
import { Database, Activity } from "lucide-react";

const ReservoirStorage = memo(() => {
  return (
    <div className="w-full max-w-full overflow-hidden bg-white rounded-2xl border border-slate-100/90 shadow-sm shadow-slate-200/30 transition-all duration-300 hover:shadow-md flex flex-col">
      {/* Premium Analytical Header Section */}
      <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/30 flex justify-between items-center shrink-0 select-none">
        <div className="min-w-0">
          <h3 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Database className="w-4 h-4 text-blue-500 stroke-[2.2]" />
            Reservoir Storage Volumetrics
          </h3>
          <p className="text-[11px] text-slate-400 font-semibold tracking-wide flex items-center gap-1.5 mt-0.5">
            <Activity className="w-3 h-3 text-slate-400" />
            Live Capacity Yields & Saturation Levels
          </p>
        </div>
      </div>

      {/* Main Structural Metrics Feed */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3.5 scrollbar-none">
        {RESERVOIR_DATA.map((r) => {
          // Fallback safely if absolute volume data fields are missing in matrix source
          const capacityText =
            r.currentVolume && r.maxVolume
              ? `${r.currentVolume} / ${r.maxVolume} MCM`
              : "Telemetry Active";

          return (
            <div key={r.name} className="space-y-1.5 group">
              {/* Telemetry Labels Strip */}
              <div className="flex justify-between items-baseline gap-2 select-none">
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-slate-800 tracking-tight group-hover:text-slate-950 transition-colors truncate">
                    {r.name}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold font-mono tracking-wide">
                    {capacityText}
                  </span>
                </div>

                <span
                  className={`text-xs font-black font-mono tracking-tight shrink-0 px-2 py-0.5 rounded-md bg-slate-50 border border-slate-100/80 shadow-xs ${getReservoirTextClass(r.pct)}`}
                >
                  {r.pct}%
                </span>
              </div>

              {/* Layout-Hardened Progress Bar Track */}
              <div className="h-2.5 w-full bg-slate-100/70 border border-slate-200/40 rounded-full overflow-hidden flex p-[1px] relative">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${getReservoirColorClass(r.pct)}`}
                  style={{ width: `${Math.min(r.pct, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

ReservoirStorage.displayName = "ReservoirStorage";
export default ReservoirStorage;
