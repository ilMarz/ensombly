export function EnsoMark({ className = "w-[0.7em] h-[0.7em]" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`inline-block align-baseline ${className}`}
      fill="none"
      aria-hidden
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeDasharray="53 3.5"
        transform="rotate(-170 12 12)"
      />
    </svg>
  );
}
