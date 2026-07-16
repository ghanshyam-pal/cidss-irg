import { useMap } from "react-leaflet";
import { SL_BOUNDS } from "@/data";

export default function MapControls() {
  const map = useMap();

  const btnClass =
    "w-[28px] h-[28px] flex items-center justify-center bg-white border border-slate-200 rounded-[5px] text-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.08)] cursor-pointer hover:bg-slate-50 transition-colors text-slate-700";

  return (
    <div className="absolute top-[10px] right-[10px] z-[1000] flex gap-1">
      <button className={btnClass} onClick={() => map.zoomIn()}>
        +
      </button>
      <button className={btnClass} onClick={() => map.zoomOut()}>
        −
      </button>
      <button className={btnClass} onClick={() => map.fitBounds(SL_BOUNDS)}>
        ⛶
      </button>
    </div>
  );
}
