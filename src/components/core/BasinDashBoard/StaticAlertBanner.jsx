import { memo } from "react";

const StaticAlertBanner = memo(() => {
  return (
    <div className="w-full max-w-full overflow-hidden flex items-center bg-gradient-to-r from-rose-50/90 via-rose-50/40 to-white/10 border-l-4 border-l-rose-600 border-b border-rose-100 py-3.5 px-6 gap-6 shadow-sm shadow-rose-950/5 relative">
      {/* Hardware-Accelerated High-Performance Moving Marquee Rules */}
      <style>{`
        @keyframes highSpeedMarquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-33.3333%, 0, 0); }
        }
        .animate-dss-marquee {
          display: flex;
          width: max-content;
          animation: highSpeedMarquee 40s linear infinite;
          will-change: transform;
        }
        .animate-dss-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Static Fixed Action Label Header — Maximum Warning Density */}
      <div className="flex items-center gap-2.5 shrink-0 select-none pr-5 border-r border-rose-200 z-10 relative">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600" />
        </span>
        <span className="text-xs font-black uppercase tracking-wider text-rose-700 bg-rose-100/60 border border-rose-200/50 px-2.5 py-1 rounded-lg shadow-sm">
          CRITICAL MONITOR
        </span>
      </div>

      {/* Modern High-End Panoramic Infinite Track Container */}
      <div className="flex-1 relative overflow-hidden select-none w-full max-w-full">
        {/* Anti-Flicker Mirror Loop Track Context */}
        <div className="animate-dss-marquee gap-8 items-center py-0.5 cursor-pointer">
          {[1, 2, 3].map((loopIdx) => (
            <div key={loopIdx} className="flex items-center gap-8 shrink-0">
              {/* Highlighted Warning Indicator Block */}
              <div className="text-xs font-medium text-slate-700 flex items-center shrink-0 bg-white border border-amber-300 rounded-full pl-1.5 pr-3 py-1 shadow-sm shadow-amber-100/40 transition-all hover:border-amber-400 hover:shadow-md">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500 text-white mr-2 text-xs font-bold shadow-sm">
                  ⚠️
                </span>
                <span className="tracking-wide text-slate-900">
                  <strong className="text-amber-950 font-black">
                    Kelani Ganga:
                  </strong>{" "}
                  Minor flood warning extended for Hanwella.
                </span>
              </div>

              {/* Highlighted Meteorological Channel Block */}
              <div className="text-xs font-medium text-slate-700 flex items-center shrink-0 bg-white border border-blue-300 rounded-full pl-1.5 pr-3 py-1 shadow-sm shadow-blue-100/40 transition-all hover:border-blue-400 hover:shadow-md">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white mr-2 text-xs font-bold shadow-sm">
                  🌧️
                </span>
                <span className="tracking-wide text-slate-900">
                  <strong className="text-blue-950 font-black">
                    Meteo Dept:
                  </strong>{" "}
                  Heavy rainfall &gt; 100mm expected in SW catchments.
                </span>
              </div>

              {/* Highlighted Spillway Node Block */}
              <div className="text-xs font-medium text-slate-700 flex items-center shrink-0 bg-white border border-rose-300 rounded-full pl-1.5 pr-3 py-1 shadow-sm shadow-rose-100/40 transition-all hover:border-rose-400 hover:shadow-md">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-rose-500 text-white mr-2 text-xs font-bold shadow-sm">
                  🌊
                </span>
                <span className="tracking-wide text-slate-900">
                  <strong className="text-rose-950 font-black">
                    Reservoir Spill:
                  </strong>{" "}
                  Victoria & Kukuleganga gates opened.
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Ambient Left/Right Edge Gradient Masks to match background alpha blend */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-rose-50/90 via-rose-50/20 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white/30 to-transparent z-10" />
      </div>
    </div>
  );
});

export default StaticAlertBanner;
