import { useState, useMemo, useCallback, memo } from "react";
import { GAUGE_DATA } from "@/modules/basin-dashboard/data";
import { Button } from "@/components/ui/button";
import BaseDialog from "@/components/ui/BaseDialog";

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
        border: "border-rose-100 hover:border-rose-200",
        glow: "shadow-rose-100/30",
        modalAccent: "border-l-4 border-l-rose-500",
      };
    }
    if (key.includes("WARNING") || key.includes("MINOR")) {
      return {
        badge: "bg-orange-500 text-white",
        text: "text-orange-600",
        border: "border-orange-100 hover:border-orange-200",
        glow: "shadow-orange-100/30",
        modalAccent: "border-l-4 border-l-orange-500",
      };
    }
    return {
      badge: "bg-amber-500 text-white",
      text: "text-amber-600",
      border: "border-amber-100 hover:border-amber-200",
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
    <div className="w-full max-w-full overflow-hidden">
      {/* Header Log Summary */}
      <div className="flex items-center gap-3 mb-3 select-none">
        <span className="text-sm font-bold text-slate-900 tracking-tight">
          Active Incident Log
        </span>
        <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-100">
          {alerts.length} Active
        </span>
      </div>

      {/* Horizontal Carousel Track */}
      <div className="flex gap-4 overflow-x-auto pb-3 pt-0.5 px-0.5 snap-x snap-mandatory [-webkit-overflow-scrolling:touch] scrollbar-none w-full max-w-full">
        {filtered.map((a) => {
          const cardStyles = getSeverityStyles(a.severity);

          return (
            <div
              key={a.id}
              onClick={() => setActiveModalAlert(a)}
              className={`flex-[0_0_300px] snap-start bg-white rounded-2xl p-4 border shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer ${cardStyles.border} ${cardStyles.glow} hover:scale-[1.01]`}
            >
              <div className="flex justify-between items-center mb-2.5">
                <span
                  className={`text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${cardStyles.badge}`}
                >
                  {a.type}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  ⏱ {a.time}
                </span>
              </div>

              <div className="flex justify-between items-center mb-1.5 text-xs font-bold">
                <span className={cardStyles.text}>⚠️ {a.severity}</span>
                <span className="text-slate-400 font-mono font-medium">
                  {a.clock}
                </span>
              </div>

              <div className="text-sm font-bold text-slate-900 mb-1 truncate tracking-tight">
                {a.title}
              </div>

              <div className="text-xs text-slate-500 font-medium truncate">
                📍 {a.loc}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Reusable Component Mapping ── */}
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
