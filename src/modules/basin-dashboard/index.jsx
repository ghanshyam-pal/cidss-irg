// import { useState, useMemo, useCallback } from "react";
// import { GAUGE_DATA, HYDRO_LAYERS, METEO_LAYERS, ACTIVE_ALERTS } from "./data";
// import TopNavigation from "@/components/core/BasinDashBoard/TopNavigation";
// import StaticAlertBanner from "@/components/core/BasinDashBoard/StaticAlertBanner";
// import BasinMapWidget from "@/components/core/BasinDashBoard/BasinMapWidget";
// import RiverWatchTable from "@/components/core/BasinDashBoard/RiverWatchTable";
// import GaugeChart from "@/components/core/BasinDashBoard/GaugeChart";
// import ObservedRainfall from "@/components/core/BasinDashBoard/ObservedRainfall";
// import ReservoirStorage from "@/components/core/BasinDashBoard/ReservoirStorage";
// import RecentAlerts from "@/components/core/BasinDashBoard/RecentAlerts";
// import RainfallForecastPanel from "@/components/core/BasinDashBoard/RainfallForecastPanel";
// import AlertsRow from "@/components/common/AlertsRow";

// export default function Dashboard() {
//   const [selGauge, setSelGauge] = useState("G01");
//   const [mapMode, setMapMode] = useState("hydro");
//   const [showLayerPanel, setLayerPanel] = useState(false);
//   const [filterBasin, setFilterBasin] = useState(null);

//   const [hydroLayers, setHydroLayers] = useState(
//     HYDRO_LAYERS.map((l) => ({ ...l, active: l.default })),
//   );
//   const [meteoLayers, setMeteoLayers] = useState(
//     METEO_LAYERS.map((l) => ({ ...l, active: l.default })),
//   );

//   const handleSearch = useCallback((item) => {
//     if (item.type === "gauge") {
//       const g = GAUGE_DATA.find((x) => x.id === item.id);
//       if (g) {
//         setSelGauge(g.id);
//         setFilterBasin(g.basin);
//       }
//     } else {
//       setFilterBasin(item.id.charAt(0).toUpperCase() + item.id.slice(1));
//     }
//   }, []);

//   const visibleMarkers = useMemo(() => {
//     const activeHydro = hydroLayers.filter((l) => l.active).map((l) => l.id);
//     const showGauges = activeHydro.includes("gauges");
//     const showReservoirs = activeHydro.includes("reservoirs");
//     const showRainGauges = meteoLayers.find(
//       (l) => l.id === "rainGauge",
//     )?.active;

//     return GAUGE_DATA.filter((g) => {
//       if (g.type === "river") return showGauges;
//       if (g.type === "reservoir") return showReservoirs;
//       if (g.type === "rain") return mapMode === "meteo" && showRainGauges;
//       return true;
//     });
//   }, [hydroLayers, meteoLayers, mapMode]);

//   return (
//     <div className="w-full max-w-full overflow-x-hidden min-h-full bg-slate-50/50 font-sans text-slate-800 antialiased selection:bg-blue-500/10">
//       <style>{`
//         @keyframes fadeInUp {
//           from {
//             opacity: 0;
//             transform: translateY(6px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         .animate-fade-in-up {
//           animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
//         }
//       `}</style>

//       <TopNavigation
//         filterBasin={filterBasin}
//         setFilterBasin={setFilterBasin}
//         onSearch={handleSearch}
//       />

//       <StaticAlertBanner />

//       {/* Main Container Layout */}
//       <div className="w-full max-w-[1600px] mx-auto p-4 md:p-6 space-y-6 overflow-x-hidden animate-fade-in-up">
//         <div className="w-full max-w-full transition-all duration-300">
//           <AlertsRow alerts={ACTIVE_ALERTS} filterBasin={filterBasin} />
//         </div>

//         {/* Map View & River Status Row */}
//         <div className="grid grid-cols-1 lg:grid-cols-[clamp(350px,56%,850px)_1fr] gap-6 items-start w-full max-w-full">
//           <div className="h-full rounded-2xl bg-white p-0.5 border border-slate-100/80 shadow-sm shadow-slate-200/40 overflow-hidden">
//             <BasinMapWidget
//               mapMode={mapMode}
//               setMapMode={setMapMode}
//               showLayerPanel={showLayerPanel}
//               setLayerPanel={setLayerPanel}
//               hydroLayers={hydroLayers}
//               setHydroLayers={setHydroLayers}
//               meteoLayers={meteoLayers}
//               setMeteoLayers={setMeteoLayers}
//               selGauge={selGauge}
//               setSelGauge={setSelGauge}
//               visibleMarkers={visibleMarkers}
//             />
//           </div>

//           <div className="flex flex-col gap-6 w-full max-w-full overflow-hidden">
//             <RainfallForecastPanel />
//             <RiverWatchTable
//               filterBasin={filterBasin}
//               selGauge={selGauge}
//               setSelGauge={setSelGauge}
//             />
//           </div>
//         </div>

//         {/* Analytical Timelines */}
//         <div className="w-full max-w-full rounded-2xl bg-white p-0.5 border border-slate-100/80 shadow-sm shadow-slate-200/40 transition-shadow hover:shadow-md hover:shadow-slate-200/30 overflow-hidden">
//           <GaugeChart selGauge={selGauge} setSelGauge={setSelGauge} />
//         </div>

//         {/* Aggregated Analytical Metrics Panels */}
//         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full max-w-full">
//           <ObservedRainfall />
//           <SidebarReservoirWrapper>
//             <ReservoirStorage />
//           </SidebarReservoirWrapper>
//           <RecentAlerts filterBasin={filterBasin} />
//         </div>
//       </div>
//     </div>
//   );
// }

// // Internal layout protector component for absolute scale bounding
// function SidebarReservoirWrapper({ children }) {
//   return <div className="w-full max-w-full overflow-hidden">{children}</div>;
// }

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
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
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
      <div className="w-full max-w-[1600px] mx-auto p-4 md:p-6 space-y-6 overflow-x-hidden animate-fade-in-up">
        {/* Core Layout Grid Block — Instantly displays map above the page fold */}
        <div className="grid grid-cols-1 lg:grid-cols-[clamp(450px,58%,920px)_1fr] gap-6 items-start w-full max-w-full">
          {/* Left Hand Hydrological Anchor Map */}
          <div className="h-[52rem] rounded-2xl bg-white p-0.5 border border-slate-100/90 shadow-sm shadow-slate-200/40 overflow-hidden">
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

          {/* Right Hand Control Center Column */}
          <div className="flex flex-col gap-6 w-full max-w-full overflow-hidden">
            {/* Integrated Alerts Row — Placed cleanly inside the sidebar grid stack */}
            {ACTIVE_ALERTS.length > 0 && (
              <div className="w-full border border-slate-100 bg-white rounded-2xl p-4 shadow-xs">
                <AlertsRow alerts={ACTIVE_ALERTS} filterBasin={filterBasin} />
              </div>
            )}

            <RainfallForecastPanel />

            <RiverWatchTable
              filterBasin={filterBasin}
              selGauge={selGauge}
              setSelGauge={setSelGauge}
            />
          </div>
        </div>

        {/* Technical Deep Dive Hydro-Timeline Panel */}
        <div className="w-full max-w-full rounded-2xl bg-white p-0.5 border border-slate-100/80 shadow-sm shadow-slate-200/40 overflow-hidden">
          <GaugeChart selGauge={selGauge} setSelGauge={setSelGauge} />
        </div>

        {/* Matrix Aggregate Widgets Footer Group */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full max-w-full">
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
