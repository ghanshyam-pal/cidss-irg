import { memo } from "react";

const ContourTexture = memo(() => (
  <svg
    className="absolute inset-0 w-full h-full pointer-events-none text-slate-800/20"
    viewBox="0 0 264 800"
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    <path
      d="M-20,70 Q66,20 140,70 T300,70"
      stroke="currentColor"
      strokeWidth="1"
      fill="none"
    />
    <path
      d="M-20,130 Q76,80 150,130 T310,130"
      stroke="currentColor"
      strokeWidth="1"
      fill="none"
    />
    <path
      d="M-20,560 Q66,610 140,560 T300,560"
      stroke="currentColor"
      strokeWidth="1"
      fill="none"
    />
    <path
      d="M-20,620 Q76,670 150,620 T310,620"
      stroke="currentColor"
      strokeWidth="1"
      fill="none"
    />
  </svg>
));

export default ContourTexture;
