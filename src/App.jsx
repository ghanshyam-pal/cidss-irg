// src/App.jsx
// Route definitions — all module pages are lazy-loaded (code splitting)

import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppShell from "@/layouts/AppShell";
import PageLoader from "@/components/ui/PageLoader";
import LoginPage from "@/pages/LoginPage";
import NotFoundPage from "@/pages/NotFoundPage";

// Lazy-loaded module pages
const ForecastChartPage = lazy(() => import("./modules/forecast-chart"));
const BasinDashboardPage = lazy(() => import("./modules/basin-dashboard"));
const StateBasinMap = lazy(
  () => import("./modules/basin-dashboard/StateBasinMap/StateBasinMap"),
);
const RiverGaugePage = lazy(
  () => import("./modules/basin-dashboard/riverGauge/RiverGaugePage"),
);
const FleetOperation = lazy(
  () => import("./modules/GaugeManagement/FleetOperations/GaugeManagementPage"),
);
const ReservoirMgmt = lazy(() => import("./modules/reservoir/reservoirMgmt"));
const HistoricalData = lazy(() => import("./modules/HistoricalData/index"));
const ImpactForecast = lazy(() => import("./modules/ImpactForecast/index"));
const DataEntry         = lazy(() => import('./modules/HistoricalData/DataEntry')) 


export default function App() {
  return (
    <BrowserRouter basename="/irg">
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected — all inside AppShell */}
          <Route path="/" element={<AppShell />}>
            <Route
              index
              element={<Navigate to="/basin-dashboard/overview" replace />}
            />
            <Route
              path="forecast-discharge/forecast-vs-observed"
              element={<ForecastChartPage />}
            />
            <Route
              path="basin-dashboard/overview"
              element={<BasinDashboardPage />}
            />
            <Route path="basin-dashboard/map" element={<StateBasinMap />} />
            <Route
              path="basin-dashboard/river-gauges"
              element={<RiverGaugePage />}
            />
            <Route
              path="gauge-management/fleet-operation"
              element={<FleetOperation />}
            />
            <Route
              path="historical-data/history"
              element={<HistoricalData />}
            />
            <Route
              path="historical-data/data-entry"
              element={<DataEntry />}
            />
            
            <Route path="impact-forecast/impact" element={<ImpactForecast />} />
            <Route
              path="reservoir-anomaly-map/mgmt"
              element={<ReservoirMgmt />}
            />
            {/* <Route path="alert-engine"      element={<AlertEnginePage />} />
            <Route path="forecast-map"      element={<ForecastMapPage />} />
            <Route path="hydromet"          element={<HydroMetPage />} />
            <Route path="ai-assistant"      element={<AiAssistantPage />} /> */}
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
