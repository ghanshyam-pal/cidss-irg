export default function Card({ children, style = {}, className = "" }) {
  return (
    <div
      className={`bg-white rounded-[10px] border border-slate-200 shadow-[0_1px_4px_rgba(0,0,0,0.04)] overflow-hidden ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
