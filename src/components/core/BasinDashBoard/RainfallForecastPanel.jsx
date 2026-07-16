import { useState, useMemo, useCallback, memo } from "react";
import Card from "@/components/common/Card";
import { FORECAST_7DAY, RAINFALL_FORECAST_BASIN } from "@/data/basinDashboard";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  CloudRain,
  Calendar,
  Layers,
  Activity,
  Sun,
  Cloud,
  CloudRainWind,
  CloudLightning,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  HelpCircle,
} from "lucide-react";

const RainfallForecastPanel = memo(() => {
  const [forecastTab, setForecastTab] = useState("daily");
  const [selBasin, setSelBasin] = useState("Kalu");
  const [showInfoPopover, setShowInfoPopover] = useState(false);

  // High-end dynamic configurations mapped strictly via clean visual borders
  const getIntensityConfig = useCallback((intensity, rainfall) => {
    const key = String(intensity).toUpperCase();
    if (key.includes("HEAVY") || key.includes("SEVERE") || rainfall > 64) {
      return {
        color: "#ef4444",
        borderStyle: "border-l-4 border-l-rose-500 border-slate-150",
        badge: "bg-rose-50 text-rose-700 border-rose-200/60",
        icon: CloudLightning,
        impactSummary:
          "Critical saturation reached. Surface runoff models projecting flash overflows.",
      };
    }
    if (key.includes("MODERATE") || rainfall > 44) {
      return {
        color: "#3b82f6",
        borderStyle: "border-l-4 border-l-blue-500 border-slate-150",
        badge: "bg-blue-50 text-blue-700 border-blue-200/60",
        icon: CloudRainWind,
        impactSummary:
          "Steady infiltration active. Medium stage sub-basins entering alert bands.",
      };
    }
    if (key.includes("LIGHT") || key.includes("ALERT") || rainfall > 15) {
      return {
        color: "#f59e0b",
        borderStyle: "border-l-4 border-l-amber-500 border-slate-150",
        badge: "bg-amber-50 text-amber-700 border-amber-200/60",
        icon: Cloud,
        impactSummary:
          "Nominal absorption. Standard catchment drainage capacity operating cleanly.",
      };
    }
    return {
      color: "#10b981",
      borderStyle: "border-l-4 border-l-emerald-500 border-slate-150",
      badge: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
      icon: Sun,
      impactSummary:
        "Baseline storage status. Direct evaporation model holding at zero delta.",
    };
  }, []);

  const totalForecastRainfall = useMemo(() => {
    return RAINFALL_FORECAST_BASIN.reduce((s, d) => s + (d[selBasin] || 0), 0);
  }, [selBasin]);

  const activeBasinTrend = useMemo(() => {
    if (RAINFALL_FORECAST_BASIN.length < 2) return { text: "Stable Baseline" };
    const latestIdx = RAINFALL_FORECAST_BASIN.length - 1;
    const current = RAINFALL_FORECAST_BASIN[latestIdx][selBasin] || 0;
    const previous = RAINFALL_FORECAST_BASIN[latestIdx - 1][selBasin] || 0;
    const delta = current - previous;

    if (delta > 5)
      return {
        text: `Rising Trend (+${Math.abs(delta)}mm)`,
        icon: TrendingUp,
        color: "text-rose-600 bg-rose-50/50 border-rose-100",
      };
    if (delta < -5)
      return {
        text: `Receding Trend (-${Math.abs(delta)}mm)`,
        icon: TrendingDown,
        color: "text-emerald-600 bg-emerald-50/50 border-emerald-100",
      };
    return {
      text: "Consistent Velocity",
      icon: Activity,
      color: "text-slate-500 bg-slate-50 border-slate-100",
    };
  }, [selBasin]);

  const basinsConfig = useMemo(
    () => [
      { id: "Kalu", color: "#3b82f6" },
      { id: "Kelani", color: "#8b5cf6" },
      { id: "Mahaweli", color: "#06b6d4" },
      { id: "Nilwala", color: "#f59e0b" },
      { id: "Walawe", color: "#10b981" },
    ],
    [],
  );

  return (
    <Card className="w-full max-w-full overflow-hidden rounded-2xl border border-slate-100/80 shadow-sm shadow-slate-200/40 bg-white">
      {/* Segmented Control Header Panel */}
      <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 sm:items-center justify-between bg-slate-50/30">
        <span className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2 select-none">
          <CloudRain className="w-4 h-4 text-blue-500 stroke-[2.2]" />
          Rainfall Projections Center
        </span>

        <div className="flex bg-slate-100 border border-slate-200/40 rounded-xl p-1 gap-0.5 self-end sm:self-auto">
          {[
            ["daily", "7-Day Projections", Calendar],
            ["basin", "By Catchment Matrix", Layers],
          ].map(([k, l, Icon]) => (
            <button
              key={k}
              type="button"
              onClick={() => setForecastTab(k)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1.5 transition-all duration-200 ${
                forecastTab === k
                  ? "bg-slate-900 text-white shadow-sm font-extrabold"
                  : "bg-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-200/40"
              }`}
            >
              <Icon className="w-3.5 h-3.5 stroke-[2.5]" />
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Main Structural Space */}
      <div className="px-3 py-5 w-full max-w-full overflow-hidden">
        {forecastTab === "daily" ? (
          <div className="space-y-6">
            {/* Restyled Clean, Non-Noisy 7-Day Card Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-7 gap-3 w-full">
              {FORECAST_7DAY.map((d) => {
                const config = getIntensityConfig(d.intensity, d.rainfall);
                const StatusIcon = config.icon;

                return (
                  <div
                    key={d.date}
                    className={`flex flex-col items-center justify-between p-4 rounded-xl bg-slate-50/65 hover:bg-white border text-center transition-all duration-200 hover:shadow-md hover:shadow-slate-200/30 hover:scale-[1.01] group ${config.borderStyle}`}
                    title={config.impactSummary}
                  >
                    <span className="text-xs text-slate-400 font-bold tracking-wider uppercase font-mono">
                      {d.date}
                    </span>

                    <div className="my-3 flex items-center justify-center p-2 rounded-xl bg-white shadow-sm border border-slate-150 relative group-hover:scale-110 transition-transform duration-200">
                      <StatusIcon
                        className="w-5 h-5 stroke-[2.2]"
                        style={{ color: config.color }}
                      />
                    </div>

                    <div className="flex items-baseline gap-0.5 justify-center">
                      <span className="text-lg font-black tracking-tight text-slate-950">
                        {d.rainfall}
                      </span>
                      <span className="text-xs text-slate-400 font-bold">
                        mm
                      </span>
                    </div>

                    <span
                      className={`text-[11px] mt-2.5 font-bold rounded-md px-2 py-0.5 tracking-wide inline-block border ${config.badge}`}
                    >
                      {d.intensity}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Continuous Area Trend Area Model — Ideal for Operators */}
            <div className="w-full max-w-full overflow-hidden pt-2">
              <ResponsiveContainer width="100%" height={130}>
                <AreaChart
                  data={FORECAST_7DAY}
                  margin={{ top: 5, right: 0, left: -24, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="rainAreaGrad"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f1f5f9"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12, fill: "#94a3b8", fontWeight: 500 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#94a3b8", fontMono: true }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      fontSize: 12,
                      borderRadius: 12,
                      border: "1px solid #e2e8f0",
                    }}
                    formatter={(v) => [`${v} mm`, "Accumulation Amount"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="rainfall"
                    stroke="#3b82f6"
                    strokeWidth={2.5}
                    fill="url(#rainAreaGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Decoupled Dropdown Selector Bar Layout */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                  Select Monitoring Target:
                </span>
                <select
                  value={selBasin}
                  onChange={(e) => setSelBasin(e.target.value)}
                  className="text-xs font-bold bg-white border border-slate-200/80 rounded-xl px-3 py-1.5 text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-900/10 shadow-sm transition-all hover:border-slate-300"
                >
                  {basinsConfig.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.id} Catchment Channels
                    </option>
                  ))}
                </select>
              </div>

              {(() => {
                const TrendIcon = activeBasinTrend.icon;
                return (
                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border text-xs font-bold shadow-sm shrink-0 ${activeBasinTrend.color}`}
                  >
                    {TrendIcon && (
                      <TrendIcon className="w-3.5 h-3.5 stroke-[2.5]" />
                    )}
                    <span>{activeBasinTrend.text}</span>
                  </div>
                );
              })()}
            </div>
            {/* Matrix Graphic Context Map */}
            <div className="w-full max-w-full overflow-hidden">
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart
                  data={RAINFALL_FORECAST_BASIN}
                  margin={{ top: 10, right: 0, left: -24, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f1f5f9"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 12, fill: "#94a3b8", fontWeight: 500 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#94a3b8", fontMono: true }}
                    unit=" mm"
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      fontSize: 12,
                      borderRadius: 12,
                      border: "1px solid #e2e8f0",
                    }}
                  />
                  <Legend
                    verticalAlign="top"
                    height={36}
                    iconType="circle"
                    wrapperStyle={{ fontSize: 12, fontWeight: 600 }}
                  />
                  {basinsConfig.map((b) => (
                    <Area
                      key={b.id}
                      type="monotone"
                      dataKey={b.id}
                      stroke={b.color}
                      strokeWidth={selBasin === b.id ? 3 : 1}
                      fill="transparent"
                      strokeOpacity={selBasin === b.id ? 1.0 : 0.2}
                      name={b.id}
                    />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            </div>
            {/* Operational DSS Footer Panel featuring the Interactive Explanation Popover */}
            <div className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-600 font-medium tracking-wide flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-inner relative max-w-full overflow-hidden">
              {/* DSS Risk Section — Now dynamically expands to use available center space */}
              <div className="flex-1 min-w-0 flex items-center gap-2 font-bold text-slate-700">
                <AlertTriangle className="w-4 h-4 text-amber-500 stroke-[2.2] shrink-0" />
                <span className="truncate block w-full">
                  DSS Risk:{" "}
                  <span
                    className="text-slate-500 font-medium normal-case"
                    title={
                      getIntensityConfig(
                        FORECAST_7DAY[0].intensity,
                        RAINFALL_FORECAST_BASIN[
                          RAINFALL_FORECAST_BASIN.length - 1
                        ][selBasin],
                      ).impactSummary
                    }
                  >
                    {
                      getIntensityConfig(
                        FORECAST_7DAY[0].intensity,
                        RAINFALL_FORECAST_BASIN[
                          RAINFALL_FORECAST_BASIN.length - 1
                        ][selBasin],
                      ).impactSummary
                    }
                  </span>
                </span>
              </div>

              {/* Control Actions & Matrix Metadata — Locks cleanly to the right edge */}
              <div className="flex items-center gap-4 shrink-0 justify-between md:justify-end w-full md:w-auto border-t md:border-t-0 border-slate-200/60 pt-2 md:pt-0">
                <button
                  type="button"
                  onClick={() => setShowInfoPopover((p) => !p)}
                  className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 transition-colors font-bold cursor-pointer focus:outline-none whitespace-nowrap"
                >
                  <HelpCircle className="w-3.5 h-3.5 stroke-[2.2]" />
                  What does this mean?
                </button>

                <span className="font-semibold text-slate-400 whitespace-nowrap">
                  7-Day Total:{" "}
                  <span className="font-black text-slate-950 font-mono">
                    {totalForecastRainfall} mm
                  </span>
                </span>
              </div>

              {/* Luminous Responsive Overlay Context Popover */}
              {showInfoPopover && (
                <>
                  {/* Click Shield Overlay for Small Touch Viewports */}
                  <div
                    className="fixed inset-0 z-40 md:hidden bg-slate-950/10 backdrop-blur-xs"
                    onClick={() => setShowInfoPopover(false)}
                  />

                  <div className="fixed bottom-4 left-4 right-4 md:absolute md:bottom-12 md:right-4 md:left-auto z-50 bg-white/98 backdrop-blur-md border border-slate-200 p-4 rounded-xl shadow-xl shadow-slate-950/10 max-w-sm text-xs space-y-2 text-slate-600 leading-relaxed animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <div className="font-bold text-slate-900 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        ℹ️ Decision Matrix Context
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowInfoPopover(false)}
                        className="md:hidden text-slate-400 hover:text-slate-600 font-bold p-1 text-sm"
                      >
                        ✕
                      </button>
                    </div>
                    <p className="normal-case">
                      This computation models total precipitation against
                      catchment saturation levels.
                      <strong className="text-slate-900 font-bold">
                        {" "}
                        Runoff alerts
                      </strong>{" "}
                      indicate that natural soil absorption thresholds are near
                      capacity, redirecting new precipitation volume into
                      streamflow channels.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
});

RainfallForecastPanel.displayName = "RainfallForecastPanel";
export default RainfallForecastPanel;
