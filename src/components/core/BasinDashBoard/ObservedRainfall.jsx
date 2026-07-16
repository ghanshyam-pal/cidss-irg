import { memo, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { RAINFALL_DATA } from "@/data/basinDashboard";
import { BarChart3, Activity } from "lucide-react";

const ObservedRainfall = memo(() => {
  // Compute aggregate system insights for immediate operator value
  const totalSystemObserved = useMemo(() => {
    return RAINFALL_DATA.reduce((acc, curr) => {
      return acc + (curr.Kalu || 0) + (curr.Kelani || 0) + (curr.Nilwala || 0);
    }, 0);
  }, []);

  return (
    <div className="w-full max-w-full overflow-hidden bg-white rounded-2xl border border-slate-100/90 shadow-sm shadow-slate-200/30 transition-all duration-300 hover:shadow-md flex flex-col">
      {/* Premium Analytics Header Strip */}
      <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/30 flex flex-col sm:flex-row gap-2 sm:items-center justify-between shrink-0 select-none">
        <div className="min-w-0">
          <h3 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-500 stroke-[2.2]" />
            Observed Catchment Accumulation
          </h3>
          <p className="text-[11px] text-slate-400 font-semibold tracking-wide flex items-center gap-1.5 mt-0.5">
            <Activity className="w-3 h-3 text-slate-400" />
            Empirical LKT Telemetered Rainfall Totals (7-Day Log Matrix)
          </p>
        </div>
      </div>

      {/* Embedded Real-time Telemetry Context Strips */}
      <div className="px-5 pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 select-none shrink-0">
        <div className="p-3 bg-slate-50/60 border border-slate-100 rounded-xl flex flex-col">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
            Kalu Peak Max
          </span>
          <span className="text-base font-black font-mono text-blue-600 mt-0.5">
            {Math.max(...RAINFALL_DATA.map((d) => d.Kalu || 0))}mm
          </span>
        </div>
        <div className="p-3 bg-slate-50/60 border border-slate-100 rounded-xl flex flex-col">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
            Kelani Peak Max
          </span>
          <span className="text-base font-black font-mono text-purple-600 mt-0.5">
            {Math.max(...RAINFALL_DATA.map((d) => d.Kelani || 0))}mm
          </span>
        </div>
        <div className="p-3 bg-slate-50/60 border border-slate-100 rounded-xl flex flex-col sm:col-span-1 col-span-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
            Total Measured Runoff
          </span>
          <span className="text-base font-black font-mono text-slate-900 mt-0.5">
            {totalSystemObserved}mm
          </span>
        </div>
      </div>

      {/* Hardened Chart Workspace Container */}
      <div className="flex-1 px-4 pt-4 pb-3 sm:px-5 w-full max-w-full overflow-hidden flex flex-col justify-end">
        <div className="w-full h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={RAINFALL_DATA}
              margin={{ top: 5, right: 4, left: -32, bottom: 0 }}
              barCategoryGap="20%"
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f1f5f9"
                vertical={false}
              />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                tickMargin={8}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#94a3b8", fontMono: true }}
                unit="mm"
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: "rgba(241, 245, 249, 0.4)" }}
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 12,
                  border: "1px solid #e2e8f0",
                  backgroundColor: "#ffffff",
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)",
                  padding: "10px 14px",
                }}
              />
              <Legend
                verticalAlign="top"
                height={32}
                iconType="circle"
                wrapperStyle={{
                  fontSize: 11,
                  fontWeight: 600,
                  paddingBottom: "12px",
                }}
              />
              <Bar
                dataKey="Kalu"
                fill="#3b82f6"
                radius={[3, 3, 0, 0]}
                name="Kalu Catchment"
              />
              <Bar
                dataKey="Kelani"
                fill="#8b5cf6"
                radius={[3, 3, 0, 0]}
                name="Kelani Catchment"
              />
              <Bar
                dataKey="Nilwala"
                fill="#f59e0b"
                radius={[3, 3, 0, 0]}
                name="Nilwala Catchment"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
});

ObservedRainfall.displayName = "ObservedRainfall";
export default ObservedRainfall;
