import { memo, useMemo } from "react";
import { GAUGE_DATA, ALERT_STATUS, GAUGE_SERIES } from "@/data/basinDashboard";
import { getStatusClasses } from "@/utils/dashboardHelpers";
// Native shadcn table primitives implementation
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Waves, ArrowUpRight } from "lucide-react";

const RiverWatchTable = memo(({ filterBasin, selGauge, setSelGauge }) => {
  const tableData = useMemo(() => {
    return GAUGE_DATA.filter((g) => g.type === "river")
      .filter((g) => !filterBasin || g.basin === filterBasin)
      .slice(0, 6);
  }, [filterBasin]);

  const majorFloodCount = useMemo(() => {
    return GAUGE_DATA.filter((g) => g.status === "MAJOR_FLOOD").length;
  }, []);

  return (
    <div className="w-full max-w-full overflow-hidden bg-white rounded-2xl border border-slate-100/80 shadow-sm shadow-slate-200/40 flex flex-col">
      {/* Premium Analytical Header Strip */}
      <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/30 flex justify-between items-center shrink-0 select-none">
        <span className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Waves className="w-4 h-4 text-blue-500 stroke-[2.2]" />
          Water Level & Discharge Matrix
        </span>
        <button
          type="button"
          className="text-xs text-blue-600 font-bold hover:text-blue-800 flex items-center gap-0.5 transition-colors focus:outline-none cursor-pointer"
        >
          View All Channels
          <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>
      </div>

      {/* Responsive Horizontal Scrollproof Container */}
      <div className="w-full overflow-x-auto scrollbar-thin [-webkit-overflow-scrolling:touch]">
        <Table className="w-full whitespace-nowrap text-xs">
          <TableHeader>
            <TableRow className="bg-slate-50 border-b border-slate-200/60 pointer-events-none select-none">
              {[
                "Station Target",
                "Current Level",
                "Warning Threshold",
                "Danger Threshold",
                "Upstream Spill",
                "Downstream Spill",
                "Operational Status",
              ].map((h) => (
                <TableHead
                  key={h}
                  className="px-4 h-10 text-slate-500 font-bold uppercase tracking-wider text-[10px] first:pl-5 last:pr-5"
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.map((g) => {
              const upSpill = (g.level * 1.05).toFixed(2);
              const downSpill = (g.level * 0.92).toFixed(2);
              const isSelected = selGauge === g.id;

              return (
                <TableRow
                  key={g.id}
                  onClick={() => GAUGE_SERIES[g.id] && setSelGauge(g.id)}
                  className={`cursor-pointer transition-colors border-b border-slate-100 hover:bg-slate-50/80 ${
                    isSelected
                      ? "bg-blue-50/40 hover:bg-blue-50/60 font-medium ring-1 ring-blue-100/30"
                      : ""
                  }`}
                >
                  {/* Station Identity Cell */}
                  <TableCell className="px-4 py-3.5 font-bold text-slate-900 max-w-[150px] truncate pl-5">
                    {g.name.split(" – ")[0]}
                  </TableCell>

                  {/* Real-time Level Core Value */}
                  <TableCell
                    className={`px-4 py-3.5 font-black font-mono text-xs ${
                      g.level > g.threshold ? "text-rose-600" : "text-slate-950"
                    }`}
                  >
                    {g.level.toFixed(2)}m
                  </TableCell>

                  {/* Warning Metrics */}
                  <TableCell className="px-4 py-3.5 text-slate-400 font-mono font-bold">
                    {g.threshold.toFixed(1)}m
                  </TableCell>

                  {/* Danger Metrics */}
                  <TableCell className="px-4 py-3.5 text-slate-400 font-mono font-bold">
                    {(g.threshold * 1.2).toFixed(1)}m
                  </TableCell>

                  {/* Upstream Spill Yields */}
                  <TableCell className="px-4 py-3.5 text-slate-600 font-mono font-semibold">
                    {upSpill}{" "}
                    <span className="text-[10px] text-slate-400 font-sans font-bold uppercase">
                      m³/s
                    </span>
                  </TableCell>

                  {/* Downstream Spill Yields */}
                  <TableCell className="px-4 py-3.5 text-slate-600 font-mono font-semibold">
                    {downSpill}{" "}
                    <span className="text-[10px] text-slate-400 font-sans font-bold uppercase">
                      m³/s
                    </span>
                  </TableCell>

                  {/* High Fidelity Dynamic Status Pill Tag */}
                  <TableCell className="px-4 py-3.5 pr-5">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-lg border shadow-xs tracking-wide inline-block ${getStatusClasses(
                        g.status,
                      )}`}
                    >
                      {ALERT_STATUS[g.status]?.label || "Normal State"}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Actionable DSS Warning Aggregate Footer */}
      {majorFloodCount > 0 && (
        <div className="px-5 py-3 bg-rose-50 border-t border-rose-100 text-xs text-rose-700 font-bold flex items-center gap-2 shrink-0 select-none shadow-inner">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shrink-0" />
          System Hazard Warning: {majorFloodCount} active reporting monitoring
          node stations operating at Major Flood levels. Immediate runoff
          response action required.
        </div>
      )}
    </div>
  );
});

RiverWatchTable.displayName = "RiverWatchTable";
export default RiverWatchTable;
