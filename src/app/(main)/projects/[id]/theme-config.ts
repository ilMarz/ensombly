function svgUrl(svg: string): string {
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

export const HERO_PATTERNS = {
  none: {
    label: "None",
    bg: "none",
    previewBg: "none",
    size: undefined as string | undefined,
  },
  dots: {
    label: "Dots",
    bg: "radial-gradient(circle, rgba(255,255,255,0.15) 1.5px, transparent 1.5px)",
    previewBg: "radial-gradient(circle, rgba(128,128,128,0.55) 1.5px, transparent 1.5px)",
    size: "18px 18px",
  },
  grid: {
    label: "Grid",
    bg: "linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)",
    previewBg: "linear-gradient(rgba(128,128,128,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(128,128,128,0.4) 1px, transparent 1px)",
    size: "24px 24px",
  },
  diagonal: {
    label: "Lines",
    bg: "repeating-linear-gradient(45deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 16px)",
    previewBg: "repeating-linear-gradient(45deg, rgba(128,128,128,0.45) 0px, rgba(128,128,128,0.45) 1px, transparent 1px, transparent 10px)",
    size: undefined,
  },
  cross: {
    label: "Cross",
    bg: "repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 16px), repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 16px)",
    previewBg: "repeating-linear-gradient(0deg, rgba(128,128,128,0.4) 0px, rgba(128,128,128,0.4) 1px, transparent 1px, transparent 10px), repeating-linear-gradient(90deg, rgba(128,128,128,0.4) 0px, rgba(128,128,128,0.4) 1px, transparent 1px, transparent 10px)",
    size: undefined,
  },
  hexagons: {
    label: "Hexagons",
    bg: svgUrl(`<svg xmlns='http://www.w3.org/2000/svg' width='56' height='100'><path d='M28 66L0 50V18L28 2l28 16v32L28 66zm0 64L0 114V82l28-16 28 16v32L28 130z' fill='none' stroke='rgba(255,255,255,0.09)' stroke-width='1'/></svg>`),
    previewBg: svgUrl(`<svg xmlns='http://www.w3.org/2000/svg' width='28' height='50'><path d='M14 33L0 25V9L14 1l14 8v16L14 33zm0 32L0 57V41l14-8 14 8v16L14 65z' fill='none' stroke='rgba(128,128,128,0.5)' stroke-width='1'/></svg>`),
    size: "56px 100px",
  },
  circles: {
    label: "Circles",
    bg: "radial-gradient(circle 20px at center, transparent 18px, rgba(255,255,255,0.07) 18px, rgba(255,255,255,0.07) 20px, transparent 20px)",
    previewBg: "radial-gradient(circle 8px at center, transparent 6px, rgba(128,128,128,0.45) 6px, rgba(128,128,128,0.45) 8px, transparent 8px)",
    size: "40px 40px",
  },
  zigzag: {
    label: "Zigzag",
    bg: "linear-gradient(135deg, rgba(255,255,255,0.05) 25%, transparent 25%) -10px 0, linear-gradient(225deg, rgba(255,255,255,0.05) 25%, transparent 25%) -10px 0, linear-gradient(315deg, rgba(255,255,255,0.05) 25%, transparent 25%), linear-gradient(45deg, rgba(255,255,255,0.05) 25%, transparent 25%)",
    previewBg: "linear-gradient(135deg, rgba(128,128,128,0.35) 25%, transparent 25%) -5px 0, linear-gradient(225deg, rgba(128,128,128,0.35) 25%, transparent 25%) -5px 0, linear-gradient(315deg, rgba(128,128,128,0.35) 25%, transparent 25%), linear-gradient(45deg, rgba(128,128,128,0.35) 25%, transparent 25%)",
    size: "20px 20px",
  },
} as const;

export type HeroPattern = keyof typeof HERO_PATTERNS;

export const ROLES_STYLES = {
  border_left: { label: "Accent border" },
  filled:      { label: "Filled" },
  gradient:    { label: "Gradient" },
  glow:        { label: "Glow" },
  outline:     { label: "Outline" },
  minimal:     { label: "Minimal" },
} as const;

export type RolesStyle = keyof typeof ROLES_STYLES;

export const COLOR_PRESETS = [
  { label: "Cosmic", color: "#7c3aed", color2: "#4f46e5" },
  { label: "Ember",  color: "#d97706", color2: "#dc2626" },
  { label: "Tide",   color: "#0891b2", color2: "#0d9488" },
  { label: "Grove",  color: "#059669", color2: "#0891b2" },
  { label: "Rose",   color: "#db2777", color2: "#7c3aed" },
  { label: "Steel",  color: "#475569", color2: "#334155" },
  { label: "Solar",  color: "#dc2626", color2: "#d97706" },
] as const;

export function getRoleCardStyle(
  style: string,
  accent: string
): React.CSSProperties {
  switch (style) {
    case "filled":
      return {
        background: `color-mix(in srgb, ${accent} 9%, oklch(0.205 0.020 262))`,
        border: `1px solid color-mix(in srgb, ${accent} 18%, oklch(0.36 0.028 262))`,
        borderRadius: "0.75rem",
      };
    case "gradient":
      return {
        background: `linear-gradient(to right, color-mix(in srgb, ${accent} 14%, transparent), transparent 65%)`,
        borderTop: "1px solid oklch(0.36 0.028 262)",
        borderBottom: "1px solid oklch(0.36 0.028 262)",
        borderRight: "1px solid oklch(0.36 0.028 262)",
        borderLeft: `3px solid ${accent}`,
        borderRadius: "0.75rem",
      };
    case "glow":
      return {
        border: "1px solid oklch(0.36 0.028 262)",
        borderRadius: "0.75rem",
        boxShadow: `0 0 0 1px color-mix(in srgb, ${accent} 20%, transparent) inset, 0 0 24px color-mix(in srgb, ${accent} 12%, transparent)`,
      };
    case "outline":
      return {
        border: `1px solid color-mix(in srgb, ${accent} 45%, transparent)`,
        borderRadius: "0.75rem",
      };
    case "minimal":
      return {
        borderTop: `2px solid ${accent}`,
        borderBottom: "none",
        borderLeft: "none",
        borderRight: "none",
        borderRadius: "0 0 0.75rem 0.75rem",
        paddingTop: "14px",
      };
    case "border_left":
    default:
      return {
        borderTop: "1px solid oklch(0.36 0.028 262)",
        borderBottom: "1px solid oklch(0.36 0.028 262)",
        borderRight: "1px solid oklch(0.36 0.028 262)",
        borderLeft: `3px solid ${accent}`,
        borderRadius: "0.75rem",
      };
  }
}
