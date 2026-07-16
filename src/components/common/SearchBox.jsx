import { GAUGE_DATA } from "@/modules/basin-dashboard/data";
import { BASINS } from "@/modules/HistoricalData/Historicaldata";
import { useState, useMemo } from "react";

const ALL_SEARCHABLE = [
  ...GAUGE_DATA.map((g) => ({
    id: g.id,
    label: g.name,
    sub: `${g.basin} Basin · ${g.type}`,
    type: "gauge",
  })),
  ...BASINS.map((b) => ({
    id: b.id,
    label: b.name,
    sub: `${b.gauges} gauges · ${b.area} km²`,
    type: "basin",
  })),
];

export default function SearchBox({ onSelect }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return ALL_SEARCHABLE.filter(
      (s) =>
        s.label.toLowerCase().includes(q) || s.sub.toLowerCase().includes(q),
    ).slice(0, 8);
  }, [query]);

  const select = (item) => {
    setQuery(item.label);
    setOpen(false);
    onSelect(item);
  };

  return (
    <div className="relative w-[260px]">
      {/* Search Input Container */}
      <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg py-1.5 px-[10px] shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
        <span className="text-[14px] text-slate-400">🔍</span>
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 180)}
          placeholder="Search basin or station…"
          className="border-none outline-none focus:ring-0 text-[12px] text-slate-800 bg-transparent flex-1 p-0 placeholder:text-slate-400"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setOpen(false);
            }}
            className="border-none bg-transparent cursor-pointer text-slate-400 text-[14px] p-0 hover:text-slate-600"
          >
            ×
          </button>
        )}
      </div>

      {/* Dropdown Results */}
      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-[9999] bg-white border border-slate-200 rounded-lg mt-1 shadow-[0_8px_24px_rgba(0,0,0,0.12)] max-h-[280px] overflow-y-auto">
          {results.map((r) => (
            <div
              key={r.id}
              onMouseDown={() => select(r)}
              className="px-3 py-[9px] cursor-pointer border-b border-slate-50 flex items-center gap-2.5 bg-white hover:bg-slate-50 transition-colors last:border-b-0"
            >
              <span className="text-[16px]">
                {r.type === "gauge" ? "📡" : "🗺️"}
              </span>
              <div>
                <div className="text-[12px] font-semibold text-slate-800">
                  {r.label}
                </div>
                <div className="text-[10px] text-slate-400 mt-[1px]">
                  {r.sub}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
