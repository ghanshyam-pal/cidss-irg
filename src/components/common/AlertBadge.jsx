import { ALERT_STATUS } from "@/modules/basin-dashboard/data";

export default function AlertBadge({ status, small }) {
  const d = ALERT_STATUS[status] || ALERT_STATUS.NORMAL;

  return (
    <span
      className={`inline-flex items-center gap-1 font-bold rounded-[5px] ${
        small
          ? "px-[7px] py-[2px] text-[10px]"
          : "px-[9px] py-[3px] text-[11px]"
      }`}
      style={{
        backgroundColor: d.bg,
        color: d.color,
      }}
    >
      <span
        className="w-[5px] h-[5px] rounded-full"
        style={{ backgroundColor: d.dot }}
      />
      {d.label}
    </span>
  );
}
