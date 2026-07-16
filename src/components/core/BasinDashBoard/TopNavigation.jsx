import { memo } from "react";
import SearchBox from "@/components/common/SearchBox";

const TopNavigation = memo(({ filterBasin, setFilterBasin, onSearch }) => {
  const basins = [null, "Kalu", "Kelani", "Mahaweli", "Nilwala", "Walawe"];

  return (
    <div className="w-full max-w-full overflow-hidden flex flex-col xl:flex-row items-center justify-between gap-2 px-6 py-4.5 bg-white border-b border-slate-100/90 shadow-sm shadow-slate-200/20 z-10 relative">
      {/* Telemetry Snapshot Segment — Clean Minimal Typography */}
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 shrink-0 w-full xl:w-auto text-left select-none">
        {/* Main Temperature Module */}
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-light text-slate-900 tracking-tighter leading-none">
            31°C
          </span>
          <span className="text-xs font-bold text-slate-400 tracking-wide uppercase leading-none">
            LKT
          </span>
        </div>

        <div className="hidden sm:block w-px h-5 bg-slate-200/60" />

        {/* Dynamic Context Descriptor Strings */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs font-medium text-slate-500">
          <span className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50" />
            Partly Cloudy
          </span>
          <span className="hidden sm:inline text-slate-300 font-light">•</span>
          <span className="whitespace-nowrap font-mono text-slate-400">
            H:33° L:26°
          </span>
          <span className="hidden sm:inline text-slate-300 font-light">•</span>
          <span className="whitespace-nowrap tracking-wide">
            🗓 Tue, 17 Jun 2026
          </span>
        </div>
      </div>

      {/* Modern Operational Search Engine Integration */}
      <div className="shrink-0 max-w-sm w-full px-1 sm:px-0 z-20">
        <SearchBox onSelect={onSearch} />
      </div>

      {/* Basin Category Matrix Selector — Modern Segmented Control Look */}
      <div className="flex flex-wrap justify-center xl:justify-end gap-1.5 shrink-0 w-full xl:w-auto px-1 sm:px-0 max-w-full overflow-hidden">
        {basins.map((b) => (
          <button
            key={b || "all"}
            type="button"
            onClick={() => setFilterBasin(b)}
            className={`px-4 py-2 text-xs font-bold rounded-xl cursor-pointer whitespace-nowrap transition-all duration-200 ${
              filterBasin === b
                ? "bg-slate-900 text-white shadow-md shadow-slate-950/20 font-extrabold"
                : "bg-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            {b ? `${b} Basin` : "All Channels"}
          </button>
        ))}
      </div>
    </div>
  );
});

export default TopNavigation;
