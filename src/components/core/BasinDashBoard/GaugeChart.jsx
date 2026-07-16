import { memo, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { GAUGE_DATA, GAUGE_SERIES } from "@/data/basinDashboard";
import AlertBadge from "@/components/ui/AlertBadge";
import { Gauge, Activity, ArrowUpRight, ShieldAlert } from "lucide-react";

const GaugeChart = memo(({ selGauge, setSelGauge }) => {
  const { series, gauge } = useMemo(() => {
    return {
      series: GAUGE_SERIES[selGauge] || GAUGE_SERIES["G01"],
      gauge: GAUGE_DATA.find((g) => g.id === selGauge),
    };
  }, [selGauge]);

  // Dynamic calculations for immediate operational context
  const { peakObserved, peakForecast } = useMemo(() => {
    if (!series || !series.length) return { peakObserved: 0, peakForecast: 0 };
    return {
      peakObserved: Math.max(...series.map((d) => d.observed || 0)),
      peakForecast: Math.max(...series.map((d) => d.forecast || 0)),
    };
  }, [series]);

  return (
    <div className="w-full max-w-full overflow-hidden bg-white rounded-2xl border border-slate-100/90 shadow-sm shadow-slate-200/30 transition-all duration-300 hover:shadow-md">
      {/* Premium Multi-Tiered Header Section */}
      <div className="px-5 py-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/30 select-none">
        <div className="min-w-0 flex items-start gap-3">
          <div className="p-2 bg-blue-50 border border-blue-150 rounded-xl shrink-0 text-blue-600 hidden sm:block">
            <Gauge className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-black text-slate-900 tracking-tight truncate">
              Telemetry Hydrograph — {gauge?.name?.split(" – ")[0]}
            </h3>
            <p className="text-[11px] text-slate-400 font-semibold tracking-wide flex items-center gap-1.5 mt-0.5">
              <Activity className="w-3 h-3 text-slate-400" />
              Observed Real-time vs. Predictive Simulation Model (48h Log)
            </p>
          </div>
        </div>

        {/* Operational Control Badges Matrix */}
        <div className="flex flex-wrap items-center gap-2.5 self-end md:self-auto shrink-0 w-full sm:w-auto justify-end">
          <AlertBadge status={gauge?.status} small />

          <select
            value={selGauge}
            onChange={(e) => setSelGauge(e.target.value)}
            className="text-xs font-bold bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-900/10 shadow-sm transition-all hover:border-slate-300 w-full sm:w-auto"
          >
            {GAUGE_DATA.filter(
              (g) => g.type === "river" && GAUGE_SERIES[g.id],
            ).map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Embedded Real-time Sensor Metric Strips */}
      <div className="px-5 pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 select-none">
        <div className="p-3 bg-slate-50/60 border border-slate-100 rounded-xl flex flex-col">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
            Current stage
          </span>
          <span className="text-lg font-black font-mono text-slate-900 mt-0.5">
            {gauge?.level?.toFixed(2)}m
          </span>
        </div>
        <div className="p-3 bg-slate-50/60 border border-slate-100 rounded-xl flex flex-col">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
            Warning threshold
          </span>
          <span className="text-lg font-black font-mono text-amber-600 mt-0.5">
            {gauge?.threshold?.toFixed(2)}m
          </span>
        </div>
        <div className="p-3 bg-slate-50/60 border border-slate-100 rounded-xl flex flex-col">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
            Peak Observed
          </span>
          <span className="text-lg font-black font-mono text-blue-600 mt-0.5">
            {peakObserved.toFixed(2)}m
          </span>
        </div>
        <div className="p-3 bg-slate-50/60 border border-slate-100 rounded-xl flex flex-col">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
            Peak Forecast Projection
          </span>
          <span className="text-lg font-black font-mono text-purple-600 mt-0.5">
            {peakForecast.toFixed(2)}m
          </span>
        </div>
      </div>

      {/* Chart Workspace Container */}
      <div className="px-4 pb-5 pt-4 sm:px-5 w-full max-w-full overflow-hidden">
        <div className="w-full h-[230px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={series}
              margin={{ top: 12, right: 10, left: -30, bottom: 0 }}
            >
              <defs>
                <linearGradient id="obsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="foreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.08} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f1f5f9"
                vertical={false}
              />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 500 }}
                interval={4}
                tickMargin={8}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#94a3b8", fontMono: true }}
                unit="m"
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ stroke: "#e2e8f0", strokeWidth: 1.5 }}
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 12,
                  border: "1px solid #e2e8f0",
                  backgroundColor: "#ffffff",
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)",
                  padding: "10px 14px",
                }}
                formatter={(v, n) => [
                  <span className="font-mono font-bold text-slate-900">
                    {v} m
                  </span>,
                  n === "observed" ? (
                    <span className="text-blue-600 font-semibold">
                      Observed Reading
                    </span>
                  ) : (
                    <span className="text-purple-600 font-semibold">
                      Predictive Trend
                    </span>
                  ),
                ]}
              />

              {/* Critical Level Threshold Marker Band */}
              <ReferenceLine
                y={gauge?.threshold}
                stroke="#ef4444"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                  value: `CRITICAL LEVEL: ${gauge?.threshold}m`,
                  position: "insideBottomRight",
                  fontSize: 10,
                  fill: "#dc2626",
                  fontWeight: 800,
                  backgroundColor: "#ffffff",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                  letterSpacing: "0.05em",
                  dy: -6,
                }}
              />

              {/* Dynamic Sensor Line Area Mapping */}
              <Area
                type="monotone"
                dataKey="observed"
                stroke="#3b82f6"
                strokeWidth={2.5}
                fill="url(#obsGrad)"
                dot={{
                  r: 3,
                  strokeWidth: 2,
                  fill: "#ffffff",
                  stroke: "#3b82f6",
                }}
                activeDot={{
                  r: 5,
                  fill: "#3b82f6",
                  stroke: "#ffffff",
                  strokeWidth: 2,
                }}
                name="observed"
              />
              <Area
                type="monotone"
                dataKey="forecast"
                stroke="#a855f7"
                strokeWidth={2}
                strokeDasharray="4 4"
                fill="url(#foreGrad)"
                dot={false}
                name="forecast"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Critical Spillway Context Notice Strip */}
      {gauge?.level > gauge?.threshold && (
        <div className="px-5 py-3 bg-rose-50 border-t border-rose-100 flex items-center gap-2 text-xs text-rose-800 font-bold select-none animate-in fade-in duration-300">
          <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0 stroke-[2.2]" />
          <span>
            Hydrologist Alert Scope: River channel gauge output has breached the
            absolute structural threshold limits.
          </span>
        </div>
      )}
    </div>
  );
});

GaugeChart.displayName = "GaugeChart";
export default GaugeChart;
