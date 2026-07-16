import { memo, Fragment, useMemo } from "react";
import {
  MapContainer,
  GeoJSON,
  CircleMarker,
  Popup,
  Tooltip as LeafletTooltip,
} from "react-leaflet";
import { SL_CENTER, SL_BOUNDS } from "@/data";
import { ALERT_STATUS } from "@/data/basinDashboard";
import { resolveCoords, getStatusClasses } from "@/utils/dashboardHelpers";
import slmap from "@/data/geojsons/srilanka.geo.json";
import MapControls from "@/components/common/MapControls";
import LayerPanel from "@/components/core/BasinDashBoard/LAyerPanel";

const BasinMapWidget = memo(
  ({
    mapMode,
    setMapMode,
    showLayerPanel,
    setLayerPanel,
    hydroLayers,
    setHydroLayers,
    meteoLayers,
    setMeteoLayers,
    selGauge,
    setSelGauge,
    visibleMarkers,
  }) => {
    // Impact DSS Metric: Computes the system-wide threat landscape for swift assessment
    const impactMetrics = useMemo(() => {
      let floodCount = 0;
      let alertCount = 0;
      let criticalReservoirs = 0;

      visibleMarkers.forEach((m) => {
        if (m.status === "MAJOR_FLOOD" || m.status === "MINOR_FLOOD")
          floodCount++;
        if (m.status === "ALERT") alertCount++;
        if (m.type === "reservoir" && m.level > 85) criticalReservoirs++;
      });

      return { floodCount, alertCount, criticalReservoirs };
    }, [visibleMarkers]);

    return (
      <div className="bg-white rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-100/80 overflow-hidden flex flex-col h-full w-full max-w-full">
        {/* Widget Top Header Control Strip */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 px-5 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="space-y-1">
            <span className="text-sm font-bold text-slate-900 tracking-tight block">
              Basin Map Overview —{" "}
              {mapMode === "hydro" ? "Hydrological" : "Meteorological"}
            </span>

            {/* Real-time Impact System Summaries */}
            <div className="flex flex-wrap gap-2 pt-0.5">
              {impactMetrics.floodCount > 0 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold bg-rose-50 text-rose-700 border border-rose-100 animate-pulse">
                  ⚠️ {impactMetrics.floodCount} Basins Flooding
                </span>
              )}
              {impactMetrics.criticalReservoirs > 0 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold bg-violet-50 text-violet-700 border border-violet-100">
                  🌊 {impactMetrics.criticalReservoirs} High Storage Reservoirs
                </span>
              )}
              {impactMetrics.floodCount === 0 &&
                impactMetrics.criticalReservoirs === 0 && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                    ✓ Hydromet Channels Stable
                  </span>
                )}
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-end xl:self-auto">
            <div className="flex bg-slate-200/60 rounded-xl p-1 gap-1">
              {[
                ["hydro", "🌊 Hydro"],
                ["meteo", "🌧 Meteo"],
              ].map(([k, l]) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => {
                    setMapMode(k);
                    setLayerPanel(false);
                  }}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-all duration-200 ${
                    mapMode === k
                      ? "bg-white text-blue-700 shadow-sm ring-1 ring-black/5"
                      : "bg-transparent text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setLayerPanel((v) => !v)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg border cursor-pointer transition-all ${
                showLayerPanel
                  ? "bg-blue-50 border-blue-200 text-blue-700 shadow-sm"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              ☰ Layers
            </button>
          </div>
        </div>

        {/* Selected Layer Pills Tracker */}
        <div className="flex flex-wrap gap-2 px-5 py-2 bg-slate-50/30 border-b border-slate-100 max-w-full overflow-hidden">
          {(mapMode === "hydro" ? hydroLayers : meteoLayers)
            .filter((l) => l.active)
            .map((l) => (
              <span
                key={l.id}
                className="text-xs px-2.5 py-0.5 rounded-md font-semibold border border-slate-100 bg-white shadow-sm text-slate-600"
              >
                {l.label}
              </span>
            ))}
        </div>

        {/* Map Rendering Container */}
        <div className="relative h-[440px] w-full max-w-full bg-slate-100">
          <MapContainer
            center={SL_CENTER}
            zoom={6.4}
            minZoom={6}
            maxZoom={11}
            maxBounds={SL_BOUNDS}
            maxBoundsViscosity={0.8}
            zoomSnap={0.1}
            scrollWheelZoom={false}
            zoomControl={false}
            attributionControl={false}
            className="w-full h-full bg-gradient-to-br from-sky-50 via-sky-100 to-sky-50 z-0 overflow-hidden"
          >
            {/* GeoJSON Base with Safe Adaptive Stylings */}
            <GeoJSON
              data={slmap}
              style={() => ({
                color: impactMetrics.floodCount > 0 ? "#e11d48" : "#059669",
                weight: impactMetrics.floodCount > 0 ? 1.8 : 1.5,
                fillColor: impactMetrics.floodCount > 0 ? "#ffe4e6" : "#a7f3d0",
                fillOpacity: 0.6,
                transition: "all 0.4s ease",
              })}
            />

            {visibleMarkers.map((g) => {
              const coords = resolveCoords(g);
              if (!coords) return null;
              const d = ALERT_STATUS[g.status] || ALERT_STATUS.NORMAL;
              const isSelected = g.id === selGauge;
              const isRain = g.type === "rain";
              const isRes = g.type === "reservoir";

              return (
                <Fragment key={g.id}>
                  {/* Outer Pulsing Aura Base */}
                  <CircleMarker
                    center={coords}
                    radius={isSelected ? 16 : 12}
                    pathOptions={{
                      stroke: false,
                      fillColor: d.dot,
                      fillOpacity: 0.22,
                    }}
                    eventHandlers={{
                      click: () => !isRain && !isRes && setSelGauge(g.id),
                    }}
                  />
                  {/* Solid Vector Target Core with High Contrast Stroke */}
                  <CircleMarker
                    center={coords}
                    radius={isRes ? 8 : isRain ? 6 : isSelected ? 7 : 5}
                    pathOptions={{
                      color: "#ffffff",
                      weight: 2,
                      fillColor: isRes ? "#8b5cf6" : isRain ? "#06b6d4" : d.dot,
                      fillOpacity: 1,
                    }}
                    eventHandlers={{
                      click: () => !isRain && !isRes && setSelGauge(g.id),
                    }}
                  >
                    <LeafletTooltip direction="top" offset={[0, -6]}>
                      <span className="text-xs font-semibold text-slate-800 tracking-wide">
                        {g.name}
                        {isRain && ` · ${g.rain24h} mm/24h`}
                        {!isRain && !isRes && ` · ${g.level?.toFixed(2)} m`}
                        {isRes && ` · ${g.level}% full`}
                      </span>
                    </LeafletTooltip>

                    <Popup>
                      <div className="text-xs w-[190px] p-1 font-sans max-w-full overflow-hidden">
                        <div className="font-bold text-sm text-slate-950 mb-2 leading-tight">
                          {g.name}
                        </div>

                        {!isRain && !isRes && (
                          <div className="space-y-1 text-slate-600 font-medium">
                            <div>
                              Level:{" "}
                              <strong className="text-slate-950 font-bold">
                                {g.level?.toFixed(2)} m
                              </strong>
                            </div>
                            <div>Threshold: {g.threshold?.toFixed(1)} m</div>
                            <div>Trend: {g.trend}</div>
                          </div>
                        )}

                        {isRain && (
                          <div className="text-slate-600 font-medium">
                            Rainfall 24h:{" "}
                            <strong className="text-slate-950 font-bold">
                              {g.rain24h} mm
                            </strong>
                          </div>
                        )}

                        {isRes && (
                          <div className="text-slate-600 font-medium">
                            Storage capacity:{" "}
                            <strong className="text-slate-950 font-bold">
                              {g.level}% Full
                            </strong>
                          </div>
                        )}

                        <div className="mt-3">
                          <span
                            className={`text-xs font-bold px-2.5 py-0.5 rounded border shadow-sm ${getStatusClasses(g.status)}`}
                          >
                            {d.label}
                          </span>
                        </div>
                      </div>
                    </Popup>
                  </CircleMarker>
                </Fragment>
              );
            })}

            <MapControls />

            {showLayerPanel && (
              <LayerPanel
                mapMode={mapMode}
                hydroLayers={hydroLayers}
                setHydroLayers={setHydroLayers}
                meteoLayers={meteoLayers}
                setMeteoLayers={setMeteoLayers}
              />
            )}
          </MapContainer>

          {/* Map Overlay Floating Adaptive Legend panel */}
          <div className="absolute bottom-4 right-4 z-[1000] bg-white/95 backdrop-blur-md rounded-2xl p-3.5 text-xs font-semibold shadow-xl shadow-slate-900/10 border border-slate-100 select-none pointer-events-auto min-w-[130px]">
            {mapMode === "hydro" ? (
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm" />
                  <span className="text-slate-600 font-medium">
                    Major Flood
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-sm" />
                  <span className="text-slate-600 font-medium">
                    Minor Flood
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm" />
                  <span className="text-slate-600 font-medium">
                    Alert Window
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm" />
                  <span className="text-slate-600 font-medium">
                    Normal Range
                  </span>
                </div>
                <div className="w-full h-px bg-slate-100 my-1.5" />
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-violet-500 shadow-sm" />
                  <span className="text-slate-700 font-bold">
                    Reservoir Node
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="font-bold text-slate-950 mb-1 tracking-tight">
                  Rainfall (24h)
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm" />
                  <span className="text-slate-600 font-medium">
                    &gt; 100 mm
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-sm" />
                  <span className="text-slate-600 font-medium">65–100 mm</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm" />
                  <span className="text-slate-600 font-medium">30–65 mm</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm" />
                  <span className="text-slate-600 font-medium">&lt; 30 mm</span>
                </div>
                <div className="w-full h-px bg-slate-100 my-1.5" />
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 shadow-sm" />
                  <span className="text-slate-700 font-bold">Rain Station</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
);

export default BasinMapWidget;
