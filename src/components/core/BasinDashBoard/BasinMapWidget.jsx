import { memo, Fragment, useMemo, useState } from "react";
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
import MapControls from "@/components/common/MapControls";
import LayerPanel from "@/components/core/BasinDashBoard/LayerPanel";
import {
  Layers,
  Map,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Waves,
  CloudRain,
  Info,
  ChevronRight,
} from "lucide-react";
import slmap from "@/data/geojsons/srilanka.geo.json";

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
      <div className="bg-white rounded-2xl shadow-sm shadow-slate-200/40 border border-slate-100/90 overflow-hidden flex flex-col h-full w-full max-w-full">
        {/* Top Header Control Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 py-4 border-b border-slate-100 bg-slate-50/30">
          <div className="space-y-1.5 min-w-0">
            <span className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-2 select-none">
              <Map className="w-4 h-4 text-blue-500 stroke-[2.2]" />
              Catchment Operations Hub
            </span>

            {/* Programmatic Status Badges Matrix */}
            <div className="flex flex-wrap gap-1.5 pt-0.5 max-w-full overflow-hidden">
              {impactMetrics.floodCount > 0 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-bold bg-rose-50 text-rose-700 border border-rose-100/70 shadow-xs animate-pulse shrink-0">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-500 stroke-[2.2]" />
                  {impactMetrics.floodCount} Incidents Logged
                </span>
              )}
              {impactMetrics.criticalReservoirs > 0 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-bold bg-purple-50 text-purple-700 border border-purple-100/70 shadow-xs shrink-0">
                  <Waves className="w-3.5 h-3.5 text-purple-500" />
                  {impactMetrics.criticalReservoirs} High Storage
                </span>
              )}
              {impactMetrics.floodCount === 0 &&
                impactMetrics.criticalReservoirs === 0 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100/70 shadow-xs shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    Hydromet System Nominal
                  </span>
                )}
            </div>
          </div>

          {/* View Toggle Primitives */}
          <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto w-full sm:w-auto justify-end">
            <div className="flex bg-slate-100 border border-slate-200/40 rounded-xl p-1 gap-0.5 w-full sm:w-auto">
              {[
                ["hydro", "Hydrological Mode", Waves],
                ["meteo", "Meteorological Mode", CloudRain],
              ].map(([k, l, Icon]) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => {
                    setMapMode(k);
                    setLayerPanel(false);
                  }}
                  className={`flex-1 sm:flex-none px-3.5 py-1.5 text-xs font-bold rounded-lg cursor-pointer flex items-center justify-center gap-1.5 transition-all duration-200 ${
                    mapMode === k
                      ? "bg-slate-900 text-white shadow-sm font-extrabold"
                      : "bg-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-200/40"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 stroke-[2.2]" />
                  <span className="hidden md:inline">{l}</span>
                  <span className="md:hidden">{String(l).split(" ")[0]}</span>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setLayerPanel((v) => !v)}
              className={`px-3 py-1.5 h-8 text-xs font-bold rounded-xl border flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                showLayerPanel
                  ? "bg-blue-50 border-blue-200 text-blue-700 shadow-xs font-extrabold"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Layers className="w-3.5 h-3.5 stroke-[2.2]" />
              Layers
            </button>
          </div>
        </div>

        {/* Selected Layer Pills Tracker */}
        <div className="flex flex-wrap gap-1.5 px-5 py-2 bg-slate-50/30 border-b border-slate-100 max-w-full overflow-hidden select-none min-h-[33px]">
          {(mapMode === "hydro" ? hydroLayers : meteoLayers)
            .filter((l) => l.active)
            .map((l) => (
              <span
                key={l.id}
                className="text-[11px] px-2.5 py-0.5 rounded-lg font-bold border border-slate-200/60 bg-white shadow-xs text-slate-500 flex items-center gap-1 leading-none"
              >
                <Activity className="w-3 h-3 text-slate-400" />
                {l.label}
              </span>
            ))}
        </div>

        {/* Map Rendering Container */}
        <div className="relative h-[440px] w-full max-w-full bg-slate-100 flex-1">
          <MapContainer
            center={SL_CENTER}
            zoom={7}
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
            {/* Linked Localized Feature Polygon Matrix */}
            <GeoJSON
              data={slmap}
              style={() => ({
                color: impactMetrics.floodCount > 0 ? "#f43f5e" : "#10b981",
                weight: 2,
                fillColor: impactMetrics.floodCount > 0 ? "#fecdd3" : "#d1fae5",
                fillOpacity: 0.45,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
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
                    radius={isSelected ? 15 : 11}
                    pathOptions={{
                      stroke: false,
                      fillColor: d.dot,
                      fillOpacity: 0.2,
                    }}
                    eventHandlers={{
                      click: () => !isRain && !isRes && setSelGauge(g.id),
                    }}
                  />
                  {/* Solid Target Core with High Contrast Vector Stroke */}
                  <CircleMarker
                    center={coords}
                    radius={isRes ? 7.5 : isRain ? 5.5 : isSelected ? 6.5 : 4.5}
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
                      <span className="text-xs font-bold text-slate-900 tracking-tight block">
                        {g.name?.split(" – ")[0]}
                        {isRain && ` · ${g.rain24h} mm/24h`}
                        {!isRain && !isRes && ` · ${g.level?.toFixed(2)} m`}
                        {isRes && ` · ${g.level}% full`}
                      </span>
                    </LeafletTooltip>

                    <Popup>
                      <div className="text-xs w-[200px] p-1 font-sans max-w-full overflow-hidden select-none">
                        <div className="font-black text-sm text-slate-950 mb-2 leading-tight tracking-tight border-b border-slate-100 pb-1.5 flex items-center justify-between">
                          {g.name?.split(" – ")[0]}
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        </div>

                        {!isRain && !isRes && (
                          <div className="space-y-1 text-slate-500 font-medium">
                            <div className="flex justify-between">
                              <span>Current Level:</span>
                              <strong className="text-slate-950 font-black font-mono">
                                {g.level?.toFixed(2)} m
                              </strong>
                            </div>
                            <div className="flex justify-between">
                              <span>Alert Limit:</span>
                              <span className="text-slate-700 font-mono font-bold">
                                {g.threshold?.toFixed(1)} m
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Vector Trend:</span>
                              <span className="text-slate-700 font-bold">
                                {g.trend}
                              </span>
                            </div>
                          </div>
                        )}

                        {isRain && (
                          <div className="text-slate-500 font-medium flex justify-between">
                            <span>Rainfall 24h:</span>
                            <strong className="text-slate-950 font-black font-mono">
                              {g.rain24h} mm
                            </strong>
                          </div>
                        )}

                        {isRes && (
                          <div className="text-slate-500 font-medium flex justify-between">
                            <span>Total Storage:</span>
                            <strong className="text-slate-950 font-black font-mono">
                              {g.level}% Full
                            </strong>
                          </div>
                        )}

                        <div className="mt-3 pt-1">
                          <span
                            className={`text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-md border shadow-xs inline-block ${getStatusClasses(g.status)}`}
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

          {/* Floating Adaptive Legend Panel */}
          <div className="absolute bottom-4 right-4 z-[1000] bg-white/95 backdrop-blur-md rounded-xl p-3.5 text-[11px] font-bold shadow-xl shadow-slate-950/10 border border-slate-100 select-none pointer-events-auto min-w-[140px] space-y-2">
            <div className="text-slate-400 text-[10px] font-black uppercase tracking-wider font-mono flex items-center gap-1">
              <Info className="w-3 h-3 text-slate-400" />
              Legend Matrix
            </div>

            {mapMode === "hydro" ? (
              <div className="space-y-1.5">
                {[
                  ["bg-rose-500", "Major Flood Spill"],
                  ["bg-orange-500", "Minor Flood Stage"],
                  ["bg-amber-500", "Alert Infiltration"],
                  ["bg-emerald-500", "Nominal Range"],
                ].map(([colorClass, text]) => (
                  <div key={text} className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full shadow-xs shrink-0 ${colorClass}`}
                    />
                    <span className="text-slate-600 font-semibold">{text}</span>
                  </div>
                ))}
                <div className="w-full h-px bg-slate-100 my-1" />
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500 shadow-xs shrink-0" />
                  <span className="text-purple-900 font-extrabold">
                    Reservoir Node
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                {[
                  ["bg-rose-500", "Severe > 100mm"],
                  ["bg-orange-500", "Heavy 65–100mm"],
                  ["bg-amber-500", "Moderate 30–65mm"],
                  ["bg-emerald-500", "Light < 30mm"],
                ].map(([colorClass, text]) => (
                  <div key={text} className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full shadow-xs shrink-0 ${colorClass}`}
                    />
                    <span className="text-slate-600 font-semibold">{text}</span>
                  </div>
                ))}
                <div className="w-full h-px bg-slate-100 my-1" />
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-500 shadow-xs shrink-0" />
                  <span className="text-cyan-900 font-extrabold">
                    Rain Station
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
);

BasinMapWidget.displayName = "BasinMapWidget";
export default BasinMapWidget;
