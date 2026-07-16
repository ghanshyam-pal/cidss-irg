import { FALLBACK_COORDS } from "@/data";

export function resolveCoords(g) {
  if (typeof g.lat === "number" && typeof g.lng === "number")
    return [g.lat, g.lng];
  const key = Object.keys(FALLBACK_COORDS).find((k) => g.name?.includes(k));
  return key ? FALLBACK_COORDS[key] : null;
}

export const getStatusClasses = (status) => {
  switch (status) {
    case "MAJOR_FLOOD":
      return "bg-rose-100 text-rose-700 border-rose-200";
    case "MINOR_FLOOD":
      return "bg-orange-100 text-orange-700 border-orange-200";
    case "ALERT":
      return "bg-amber-100 text-amber-700 border-amber-200";
    default:
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
  }
};

export const getStatusDot = (status) => {
  switch (status) {
    case "MAJOR_FLOOD":
      return "bg-rose-500";
    case "MINOR_FLOOD":
      return "bg-orange-500";
    case "ALERT":
      return "bg-amber-500";
    default:
      return "bg-emerald-500";
  }
};

export const getReservoirColorClass = (pct) => {
  if (pct > 90) return "bg-rose-500";
  if (pct > 75) return "bg-amber-500";
  return "bg-blue-500";
};

export const getReservoirTextClass = (pct) => {
  if (pct > 90) return "text-rose-600";
  if (pct > 75) return "text-amber-600";
  return "text-blue-600";
};
