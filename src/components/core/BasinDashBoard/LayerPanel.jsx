import { memo, useCallback } from "react";

const LayerPanel = memo(
  ({ mapMode, hydroLayers, setHydroLayers, meteoLayers, setMeteoLayers }) => {
    const layers = mapMode === "hydro" ? hydroLayers : meteoLayers;
    const setLayers = mapMode === "hydro" ? setHydroLayers : setMeteoLayers;

    const toggle = useCallback(
      (id) => {
        setLayers((prev) =>
          prev.map((l) => (l.id === id ? { ...l, active: !l.active } : l)),
        );
      },
      [setLayers],
    );

    return (
      <div className="absolute bottom-12 left-3 z-[1000] bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-xl shadow-slate-900/10 border border-slate-100/80 min-w-[200px] max-h-[260px] overflow-y-auto w-auto max-w-full">
        {/* Structural Heading Text */}
        <div className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2.5 pb-1 border-b border-slate-100">
          {mapMode === "hydro"
            ? "Hydrological Layers"
            : "Meteorological Layers"}
        </div>

        {/* Dynamic Render Loop Context */}
        <div className="space-y-1">
          {layers.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => toggle(l.id)}
              className="flex items-center gap-3 w-full text-left py-1.5 px-2 rounded-lg hover:bg-slate-50 transition-colors group focus:outline-none focus:ring-2 focus:ring-blue-500/10"
            >
              {/* Custom Interactive Checkbox Node */}
              <div
                className={`w-4 h-4 rounded-md shrink-0 border-2 transition-all duration-200 ${
                  l.active ? "scale-100 shadow-sm" : "bg-transparent scale-95"
                }`}
                style={{
                  backgroundColor: l.active ? l.color : "transparent",
                  borderColor: l.color,
                }}
              />
              <span
                className={`text-xs font-bold transition-colors duration-150 tracking-wide ${
                  l.active
                    ? "text-slate-850 font-extrabold"
                    : "text-slate-400 group-hover:text-slate-600"
                }`}
              >
                {l.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  },
);

export default LayerPanel;
