import { memo } from "react";
import SearchBox from "@/components/common/SearchBox";
import {
  CloudSun,
  Calendar,
  Search,
  Layers,
  Filter,
  Compass,
  ChevronDown,
} from "lucide-react";

const TopNavigation = memo(({ filterBasin, setFilterBasin, onSearch }) => {
  const basins = [null, "Kalu", "Kelani", "Mahaweli", "Nilwala", "Walawe"];

  return (
    <div className="w-full max-w-full overflow-hidden flex flex-col xl:flex-row items-center justify-between gap-4 px-6 py-4 bg-white border-b border-slate-100 shadow-sm shadow-slate-200/20 z-50 relative">
      {/* Telemetry Snapshot Segment — Clean Minimal Typography */}
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 shrink-0 w-full xl:w-auto text-left select-none">
        {/* Main Temperature Module */}
        <div className="flex items-baseline gap-1.5 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl">
          <span className="text-2xl font-black text-slate-950 tracking-tighter font-mono leading-none">
            31°C
          </span>
          <span className="text-[10px] font-black text-slate-400 tracking-wide uppercase leading-none">
            LKT
          </span>
        </div>

        {/* Dynamic Context Descriptor Strings */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3.5 text-xs font-bold text-slate-500">
          <span className="flex items-center gap-1.5 text-slate-700 bg-blue-50/40 border border-blue-100/40 px-2.5 py-1 rounded-xl">
            <CloudSun className="w-4 h-4 text-blue-500 stroke-[2.2]" />
            Partly Cloudy
          </span>
          <span className="whitespace-nowrap font-mono text-slate-400 font-bold bg-slate-50 border border-slate-100 px-2 py-1 rounded-lg">
            H:33° L:26°
          </span>
          <span className="whitespace-nowrap font-semibold tracking-wide text-slate-500 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400 stroke-[2.2]" />
            Thu, 16 Jul 2026
          </span>
        </div>
      </div>

      {/* Modern Operational Search Engine Integration */}
      <div className="shrink-0 max-w-xs w-full px-1 sm:px-0 z-20 relative flex items-center">
        <div className="absolute left-3.5 pointer-events-none z-30 text-slate-400">
          <Search className="w-3.5 h-3.5 stroke-[2.5]" />
        </div>
        <div className="w-full pl-1">
          <SearchBox onSelect={onSearch} />
        </div>
      </div>

      {/* Basin Category Matrix Selector — Space-Optimized Dropdown Center */}
      <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-1.5 shrink-0 w-full sm:w-64 xl:w-auto px-3 shadow-xs relative group transition-colors hover:border-slate-300">
        {/* Absolute Explicit Perspective Indicator Label */}
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono hidden lg:flex items-center gap-1.5 select-none shrink-0">
          <Compass className="w-3.5 h-3.5 text-slate-400" />
          Scope View:
        </span>

        {/* Dynamic Context Icon Node */}
        <div className="shrink-0 flex items-center justify-center">
          {filterBasin ? (
            <Filter className="w-3.5 h-3.5 text-blue-500 stroke-[2.5]" />
          ) : (
            <Layers className="w-3.5 h-3.5 text-slate-400 stroke-[2.2]" />
          )}
        </div>

        {/* Micro-Hardened Custom Form Select Dropdown picker */}
        <div className="relative flex-1 flex items-center">
          <select
            value={filterBasin || ""}
            onChange={(e) =>
              setFilterBasin(e.target.value === "" ? null : e.target.value)
            }
            className="w-full pr-8 py-1 bg-transparent text-xs font-bold text-slate-800 tracking-tight cursor-pointer focus:outline-none focus:ring-0 rounded-lg appearance-none font-sans"
          >
            {basins.map((b) => (
              <option
                key={b || "all"}
                value={b || ""}
                className="font-sans font-semibold text-slate-800 py-2"
              >
                {b ? `${b} Catchment Profile` : "All Hydromet Channels"}
              </option>
            ))}
          </select>

          {/* Absolute layout pointer chevron arrow overlay */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-slate-600 transition-colors">
            <ChevronDown className="w-4 h-4 stroke-[2.2]" />
          </div>
        </div>
      </div>
    </div>
  );
});

TopNavigation.displayName = "TopNavigation";
export default TopNavigation;
