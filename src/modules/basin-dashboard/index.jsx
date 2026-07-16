import { useState, useMemo, useCallback } from "react";
import { GAUGE_DATA, HYDRO_LAYERS, METEO_LAYERS, ACTIVE_ALERTS } from "./data";
import TopNavigation from "@/components/core/BasinDashBoard/TopNavigation";
import StaticAlertBanner from "@/components/core/BasinDashBoard/StaticAlertBanner";
import BasinMapWidget from "@/components/core/BasinDashBoard/BasinMapWidget";
import RiverWatchTable from "@/components/core/BasinDashBoard/RiverWatchTable";
import GaugeChart from "@/components/core/BasinDashBoard/GaugeChart";
import ObservedRainfall from "@/components/core/BasinDashBoard/ObservedRainfall";
import ReservoirStorage from "@/components/core/BasinDashBoard/ReservoirStorage";
import RecentAlerts from "@/components/core/BasinDashBoard/RecentAlerts";
import RainfallForecastPanel from "@/components/core/BasinDashBoard/RainfallForecastPanel";
import AlertsRow from "@/components/common/AlertsRow";

export default function Dashboard() {
  const [selGauge, setSelGauge] = useState("G01");
  const [mapMode, setMapMode] = useState("hydro");
  const [showLayerPanel, setLayerPanel] = useState(false);
  const [filterBasin, setFilterBasin] = useState(null);

  const [hydroLayers, setHydroLayers] = useState(
    HYDRO_LAYERS.map((l) => ({ ...l, active: l.default })),
  );
  const [meteoLayers, setMeteoLayers] = useState(
    METEO_LAYERS.map((l) => ({ ...l, active: l.default })),
  );

  const handleSearch = useCallback((item) => {
    if (item.type === "gauge") {
      const g = GAUGE_DATA.find((x) => x.id === item.id);
      if (g) {
        setSelGauge(g.id);
        setFilterBasin(g.basin);
      }
    } else {
      setFilterBasin(item.id.charAt(0).toUpperCase() + item.id.slice(1));
    }
  }, []);

  const visibleMarkers = useMemo(() => {
    const activeHydro = hydroLayers.filter((l) => l.active).map((l) => l.id);
    const showGauges = activeHydro.includes("gauges");
    const showReservoirs = activeHydro.includes("reservoirs");
    const showRainGauges = meteoLayers.find(
      (l) => l.id === "rainGauge",
    )?.active;

    return GAUGE_DATA.filter((g) => {
      if (g.type === "river") return showGauges;
      if (g.type === "reservoir") return showReservoirs;
      if (g.type === "rain") return mapMode === "meteo" && showRainGauges;
      return true;
    });
  }, [hydroLayers, meteoLayers, mapMode]);

  return (
    <div className="w-full max-w-full overflow-x-hidden min-h-full bg-slate-50/50 font-sans text-slate-800 antialiased selection:bg-blue-500/10">
      {/* Smooth Staggered CSS Physics Definitions */}
      <style>{`
        @keyframes revealUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-reveal {
          animation: revealUp 0.6s cubic-bezier(0.215, 0.610, 0.355, 1) both;
        }
        .delay-1 { animation-delay: 60ms; }
        .delay-2 { animation-delay: 140ms; }
        .delay-3 { animation-delay: 240ms; }
        .delay-4 { animation-delay: 340ms; }
      `}</style>

      {/* Global Application Nav Bar */}
      <TopNavigation
        filterBasin={filterBasin}
        setFilterBasin={setFilterBasin}
        onSearch={handleSearch}
      />

      {/* System Marquee Streamer */}
      <StaticAlertBanner />

      {/* Workspace Wrapper */}
      <div className="w-full max-w-[1600px] mx-auto p-4 md:p-6 space-y-6 overflow-x-hidden">
        {/* Tier 1: Main Geographics Map & Real-Time Alert Desk Split */}
        <div className="grid grid-cols-1 lg:grid-cols-[clamp(450px,58%,940px)_1fr] gap-6 items-start w-full max-w-full">
          {/* Left Hand Hydrological Map (Primary Focus Anchor) */}
          <div className="h-[52rem] rounded-2xl bg-white p-0.5 border border-slate-100 shadow-sm shadow-slate-200/30 overflow-hidden animate-reveal delay-1">
            <BasinMapWidget
              mapMode={mapMode}
              setMapMode={setMapMode}
              showLayerPanel={showLayerPanel}
              setLayerPanel={setLayerPanel}
              hydroLayers={hydroLayers}
              setHydroLayers={setHydroLayers}
              meteoLayers={meteoLayers}
              setMeteoLayers={setMeteoLayers}
              selGauge={selGauge}
              setSelGauge={setSelGauge}
              visibleMarkers={visibleMarkers}
            />
          </div>

          {/* Right Hand Control Center Desk Stack */}
          <div className="flex flex-col gap-6 w-full max-w-full overflow-hidden h-[52rem]">
            {/* Live Vertical Logging Feed Component Slot */}
            {ACTIVE_ALERTS.length > 0 && (
              <div className="w-full border border-slate-100 bg-white rounded-2xl p-4 shadow-sm shadow-slate-200/20 animate-reveal delay-2 shrink-0">
                <AlertsRow alerts={ACTIVE_ALERTS} filterBasin={filterBasin} />
              </div>
            )}

            {/* Weather Center Card Panel — Custom flex-1 keeps proportions perfect without overflow risks */}
            <div className="flex-1 w-full overflow-hidden animate-reveal delay-3 min-h-0">
              <RainfallForecastPanel />
            </div>
          </div>
        </div>

        {/* Tier 2: Real-time Station Monitoring Matrix Grid */}
        <div className="w-full max-w-full animate-reveal delay-4">
          <RiverWatchTable
            filterBasin={filterBasin}
            selGauge={selGauge}
            setSelGauge={setSelGauge}
          />
        </div>

        {/* Tier 3: Technical Timeline Deep Dive Graph Panel */}
        <div className="w-full max-w-full rounded-2xl bg-white p-0.5 border border-slate-100 shadow-sm shadow-slate-200/30 overflow-hidden animate-reveal delay-4">
          <GaugeChart selGauge={selGauge} setSelGauge={setSelGauge} />
        </div>

        {/* Tier 4: Historic Volumetrics and Storage Feeds */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full max-w-full animate-reveal delay-4">
          <ObservedRainfall />
          <SidebarReservoirWrapper>
            <ReservoirStorage />
          </SidebarReservoirWrapper>
          <RecentAlerts filterBasin={filterBasin} />
        </div>
      </div>
    </div>
  );
}

function SidebarReservoirWrapper({ children }) {
  return <div className="w-full max-w-full overflow-hidden">{children}</div>;
}
