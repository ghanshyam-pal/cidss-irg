import { useState, useMemo, memo } from "react";
import { GAUGE_DATA } from "@/modules/basin-dashboard/data";
import { BASINS } from "@/modules/HistoricalData/Historicaldata";
import { Search, X, Radio, Compass } from "lucide-react";

// Defensive array transformation with fallback defaults to prevent initialization crashes
const ALL_SEARCHABLE = [
  ...(GAUGE_DATA || []).map((g) => {
    const name = g?.name || "Unnamed Station";
    const basin = g?.basin ? `${g.basin} Basin` : "Unknown Basin";
    const type = g?.type || "Sensor";
    return {
      id: g?.id || Math.random().toString(),
      label: name,
      sub: `${basin} · ${type}`,
      type: "gauge",
    };
  }),
  ...(BASINS || []).map((b) => {
    const name = b?.name || "Unnamed Catchment";
    const gauges = b?.gauges || "0";
    const area = b?.area || "0";
    return {
      id: b?.id || Math.random().toString(),
      label: name,
      sub: `${gauges} reporting gauges · ${area} km²`,
      type: "basin",
    };
  }),
];

const SearchBox = memo(({ onSelect }) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const results = useMemo(() => {
    const cleanQuery = (query || "").trim().toLowerCase();
    if (!cleanQuery) return [];

    return ALL_SEARCHABLE.filter((s) => {
      // Hardened fallback variables double check safety string conversion indices
      const currentLabel = (s?.label || "").toLowerCase();
      const currentSub = (s?.sub || "").toLowerCase();

      return (
        currentLabel.includes(cleanQuery) || currentSub.includes(cleanQuery)
      );
    }).slice(0, 8);
  }, [query]);

  const select = (item) => {
    setQuery(item.label);
    setOpen(false);
    if (onSelect) onSelect(item);
  };

  return (
    // Expanded block width limits to safely stretch across responsive shcdn input layouts
    <div className="relative w-full max-w-full">
      {/* Modern High-Fidelity Input Box Container */}
      <div className="flex items-center gap-2.5 bg-white border border-slate-200 focus-within:border-slate-300 focus-within:ring-2 focus-within:ring-slate-900/5 rounded-xl py-1.5 pl-3.5 pr-2.5 shadow-xs transition-all duration-150">
        <Search className="w-3.5 h-3.5 text-slate-400 stroke-[2.5] shrink-0" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 200)}
          placeholder="Search catchment channels or telemetry..."
          className="border-none outline-none focus:outline-none focus:ring-0 text-xs font-semibold text-slate-800 bg-transparent flex-1 p-0 placeholder:text-slate-400 tracking-tight"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setOpen(false);
            }}
            className="border-none bg-transparent cursor-pointer text-slate-400 p-0.5 rounded-md hover:bg-slate-100 hover:text-slate-700 transition-colors focus:outline-none flex items-center justify-center shrink-0"
          >
            <X className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        )}
      </div>

      {/* Floating Dropdown Results Menu Container */}
      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-[9999] bg-white border border-slate-200/80 rounded-xl mt-1.5 shadow-xl shadow-slate-950/5 max-h-[280px] overflow-y-auto p-1 space-y-0.5 animate-in fade-in slide-in-from-top-1 duration-150">
          {results.map((r) => (
            <div
              key={r.id}
              onMouseDown={() => select(r)}
              className="px-3 py-2 cursor-pointer rounded-lg flex items-center gap-3 bg-white hover:bg-slate-50 transition-colors duration-150 group"
            >
              {/* Dynamic Vector Core Indicators */}
              <div className="shrink-0 flex items-center justify-center p-1.5 rounded-lg bg-slate-50 border border-slate-100 group-hover:bg-white group-hover:border-slate-200 transition-colors">
                {r.type === "gauge" ? (
                  <Radio className="w-3.5 h-3.5 text-blue-500 stroke-[2.2]" />
                ) : (
                  <Compass className="w-3.5 h-3.5 text-emerald-500 stroke-[2.2]" />
                )}
              </div>

              <div className="min-w-0 flex-1 select-none">
                <div className="text-xs font-bold text-slate-900 truncate tracking-tight">
                  {r.label}
                </div>
                <div className="text-[10px] text-slate-400 font-medium font-sans truncate mt-0.5">
                  {r.sub}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

SearchBox.displayName = "SearchBox";
export default SearchBox;
