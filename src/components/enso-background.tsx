export function EnsoBackground() {
  return (
    <div className="enso-bg" aria-hidden>
      <div className="enso-bg-glow" />
      <svg viewBox="0 0 600 600" className="enso-bg-svg">
        <defs>
          <linearGradient id="enso-bg-grad" x1="0" y1="0" x2="600" y2="600" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="oklch(0.68 0.22 282)" />
            <stop offset="50%" stopColor="oklch(0.60 0.24 298)" />
            <stop offset="100%" stopColor="oklch(0.74 0.18 198)" />
          </linearGradient>
        </defs>

        <circle
          cx="300"
          cy="300"
          r="240"
          fill="none"
          stroke="oklch(0.55 0.04 262 / 0.18)"
          strokeWidth="0.6"
          strokeDasharray="6 14"
        />

        <circle
          cx="300"
          cy="300"
          r="270"
          fill="none"
          stroke="url(#enso-bg-grad)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="1696"
          strokeDashoffset="240"
          transform="rotate(-90 300 300)"
          className="enso-bg-ring"
        />
      </svg>
    </div>
  );
}
