import { useState, useMemo, useCallback, memo } from "react";
import { GAUGE_DATA } from "@/modules/basin-dashboard/data";
import { Button } from "@/components/ui/button";
import BaseDialog from "@/components/ui/BaseDialog";
import { AlertCircle, Clock, MapPin, ChevronRight } from "lucide-react";

const AlertsRow = memo(({ alerts = [], filterBasin }) => {
  const [activeModalAlert, setActiveModalAlert] = useState(null);

  const filtered = useMemo(() => {
    return filterBasin ? alerts.filter((a) => a.basin === filterBasin) : alerts;
  }, [alerts, filterBasin]);

  const getSeverityStyles = useCallback((severity) => {
    const key = String(severity).toUpperCase();
    if (
      key.includes("DANGER") ||
      key.includes("CRITICAL") ||
      key.includes("MAJOR")
    ) {
      return {
        badge: "bg-rose-500 text-white",
        text: "text-rose-600",
        border: "border-rose-100 hover:border-rose-200 hover:bg-rose-50/20",
        indicator: "bg-rose-500",
        glow: "shadow-rose-100/30",
        modalAccent: "border-l-4 border-l-rose-500",
      };
    }
    if (key.includes("WARNING") || key.includes("MINOR")) {
      return {
        badge: "bg-orange-500 text-white",
        text: "text-orange-600",
        border:
          "border-orange-100 hover:border-orange-200 hover:bg-orange-50/20",
        indicator: "bg-orange-500",
        glow: "shadow-orange-100/30",
        modalAccent: "border-l-4 border-l-orange-500",
      };
    }
    return {
      badge: "bg-amber-500 text-white",
      text: "text-amber-600",
      border: "border-amber-100 hover:border-amber-200 hover:bg-amber-50/20",
      indicator: "bg-amber-500",
      glow: "shadow-amber-100/30",
      modalAccent: "border-l-4 border-l-amber-500",
    };
  }, []);

  const styles = useMemo(() => {
    if (!activeModalAlert) return null;
    return getSeverityStyles(activeModalAlert.severity);
  }, [activeModalAlert, getSeverityStyles]);

  const handleClose = useCallback(() => setActiveModalAlert(null), []);

  if (!alerts.length) return null;

  return (
    <div className="w-full max-w-full overflow-hidden flex flex-col">
      {/* Header Log Summary */}
      <div className="flex items-center justify-between gap-3 mb-2.5 select-none shrink-0">
        <span className="text-xs font-black uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-slate-400 stroke-[2.2]" />
          Active Incident Log
        </span>
        <span className="text-[11px] font-black px-2 py-0.5 rounded-md bg-rose-50 text-rose-600 border border-rose-100 shadow-xs">
          {filtered.length} Active
        </span>
      </div>

      {/* Clean Vertical Operational Stack Track Feed */}
      <div className="w-full max-h-[210px] overflow-y-auto pr-1 space-y-2 scrollbar-thin divide-y divide-transparent">
        {filtered.map((a) => {
          const cardStyles = getSeverityStyles(a.severity);

          return (
            <div
              key={a.id}
              onClick={() => setActiveModalAlert(a)}
              className={`w-full bg-slate-50/50 hover:bg-white rounded-xl p-3 border shadow-xs transition-all duration-150 cursor-pointer flex items-center justify-between gap-4 ${cardStyles.border}`}
            >
              {/* Left-aligned content node */}
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Small Live Indicator Dot instead of huge colorful badge badges */}
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${cardStyles.indicator}`}
                  />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                    {a.type}
                  </span>
                  <span
                    className={`text-[10px] font-black px-1.5 py-0.2 rounded uppercase ${cardStyles.badge} text-[9px]`}
                  >
                    {a.severity}
                  </span>
                </div>

                {/* Primary Alert Subject */}
                <div className="text-xs font-bold text-slate-900 truncate tracking-tight pr-2">
                  {a.title}
                </div>

                {/* Micro Meta Summary Info */}
                <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium">
                  <span className="flex items-center gap-0.5 truncate max-w-[140px]">
                    <MapPin className="w-3 h-3 shrink-0 text-slate-300" />
                    {a.loc}
                  </span>
                  <span className="flex items-center gap-0.5 shrink-0 font-mono font-semibold">
                    <Clock className="w-3 h-3 shrink-0 text-slate-300" />
                    {a.clock}
                  </span>
                </div>
              </div>

              {/* Minimal right-aligned action arrow */}
              <div className="shrink-0 text-slate-300 group-hover:text-slate-500 transition-colors">
                <ChevronRight className="w-4 h-4 stroke-[2.5]" />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Reusable Modal Base Layer Mapping ── */}
      <BaseDialog
        isOpen={activeModalAlert !== null}
        onClose={handleClose}
        headerContent={
          activeModalAlert &&
          styles && (
            <div className={`pb-2 mb-2 ${styles.modalAccent} pl-4`}>
              <div className="flex items-center gap-2.5 mb-1.5">
                <span
                  className={`text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded ${styles.badge}`}
                >
                  {activeModalAlert.type}
                </span>
                <span className="text-xs text-slate-400 font-medium font-mono">
                  {activeModalAlert.date} · {activeModalAlert.clock}
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-950 tracking-tight leading-snug">
                {activeModalAlert.title}
              </h2>
              <p className="text-xs text-slate-500 font-medium pt-1">
                📍 Location Scope: {activeModalAlert.loc}
              </p>
            </div>
          )
        }
        footerContent={
          activeModalAlert &&
          styles && (
            <>
              <Button
                variant="outline"
                onClick={handleClose}
                className="flex-1 rounded-xl font-bold text-xs h-9 bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                Dismiss Window
              </Button>
              <Button
                type="button"
                onClick={handleClose}
                className={`flex-1 rounded-xl font-bold text-xs h-9 text-white transition-opacity hover:opacity-90 ${styles.badge}`}
              >
                Acknowledge Alert
              </Button>
            </>
          )
        }
      >
        {activeModalAlert && (
          <div className="space-y-3">
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Impacted Sensor Networks
              </span>
              <div className="flex gap-1.5 flex-wrap">
                {activeModalAlert.stations?.map((sid) => {
                  const g = GAUGE_DATA.find((x) => x.id === sid);
                  return g ? (
                    <span
                      key={sid}
                      className="text-xs px-2.5 py-1 rounded-lg bg-white text-slate-700 border border-slate-200/60 font-semibold shadow-sm"
                    >
                      {g.name.split(" – ")[0]}
                    </span>
                  ) : null;
                })}
              </div>
            </div>

            <div className="text-xs text-slate-500 leading-relaxed px-1">
              This dynamic alert status demands hydrologist review. Downstream
              channel conditions require active monitoring metrics updates.
            </div>
          </div>
        )}
      </BaseDialog>
    </div>
  );
});

AlertsRow.displayName = "AlertsRow";
export default AlertsRow;
