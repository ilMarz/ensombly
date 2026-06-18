"use client";

import { useState, useTransition } from "react";
import { updateProjectTheme } from "./actions";
import {
  HERO_PATTERNS,
  ROLES_STYLES,
  COLOR_PRESETS,
  type HeroPattern,
  type RolesStyle,
} from "./theme-config";

type Theme = {
  accentColor: string;
  accentColor2: string;
  heroPattern: HeroPattern;
  rolesStyle: RolesStyle;
};

export function ThemePickerInline({
  projectId,
  currentAccentColor,
  currentAccentColor2,
  currentHeroPattern,
  currentRolesStyle,
}: {
  projectId: string;
  currentAccentColor: string;
  currentAccentColor2: string;
  currentHeroPattern: HeroPattern;
  currentRolesStyle: RolesStyle;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [theme, setTheme] = useState<Theme>({
    accentColor:  currentAccentColor,
    accentColor2: currentAccentColor2,
    heroPattern:  currentHeroPattern,
    rolesStyle:   currentRolesStyle,
  });

  const save = (patch: Partial<Theme>) => {
    const next = { ...theme, ...patch };
    setTheme(next);
    startTransition(async () => {
      await updateProjectTheme(projectId, {
        accent_color:   next.accentColor,
        accent_color_2: next.accentColor2,
        hero_pattern:   next.heroPattern,
        roles_style:    next.rolesStyle,
      });
    });
  };

  return (
    <div className="space-y-3 animate-fade-up">
      {/* Collapsed toggle bar */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-5 py-3 rounded-xl border border-border/50 bg-card/60 hover:border-border hover:bg-card transition-all text-left group"
      >
        <span className="text-base" aria-hidden>🎨</span>
        <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
          Customize appearance
        </span>
        {/* Summary chips */}
        <div className="flex items-center gap-2 ml-2">
          <span
            className="w-4 h-4 rounded-full ring-1 ring-border/50 shrink-0"
            style={{ background: theme.accentColor }}
          />
          <span
            className="w-4 h-4 rounded-full ring-1 ring-border/50 shrink-0"
            style={{ background: theme.accentColor2 }}
          />
          <span className="text-[10px] text-muted-foreground/60 font-mono">{HERO_PATTERNS[theme.heroPattern]?.label}</span>
          <span className="text-[10px] text-muted-foreground/60 font-mono">{ROLES_STYLES[theme.rolesStyle]?.label}</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {isPending && (
            <span className="w-3 h-3 border-2 border-muted-foreground/40 border-t-transparent rounded-full animate-spin" />
          )}
          <svg
            viewBox="0 0 24 24"
            className={`w-4 h-4 fill-none stroke-current stroke-2 text-muted-foreground/50 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          >
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </button>

      {/* Expanded panel */}
      {open && (
        <div className="bg-card border border-border rounded-2xl p-6 space-y-7 shadow-sm shadow-black/20 animate-fade-up">

          {/* ── COLORS ──────────────────────────────────────────── */}
          <section className="space-y-3">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
              Colors
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ColorPicker
                label="Primary accent"
                value={theme.accentColor}
                onChange={(c) => save({ accentColor: c })}
              />
              <ColorPicker
                label="Secondary accent"
                hint="Used in gradients & effects"
                value={theme.accentColor2}
                onChange={(c) => save({ accentColor2: c })}
              />
            </div>

            {/* Preset pairs */}
            <div className="flex flex-wrap gap-2 pt-1">
              {COLOR_PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => save({ accentColor: p.color, accentColor2: p.color2 })}
                  title={p.label}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border hover:border-border/80 bg-secondary/30 hover:bg-secondary/60 transition-all"
                >
                  <span className="w-3 h-3 rounded-full" style={{ background: p.color }} />
                  <span className="w-3 h-3 rounded-full" style={{ background: p.color2 }} />
                  <span className="text-[10px] text-muted-foreground">{p.label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* ── HERO PATTERN ────────────────────────────────────── */}
          <section className="space-y-3">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
              Hero background pattern
            </h3>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {(Object.keys(HERO_PATTERNS) as HeroPattern[]).map((key) => {
                const p = HERO_PATTERNS[key];
                const active = theme.heroPattern === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => save({ heroPattern: key })}
                    className={`flex flex-col items-center gap-1.5 rounded-lg transition-all ${active ? "opacity-100" : "opacity-60 hover:opacity-90"}`}
                  >
                    <div
                      className={`w-full aspect-square rounded-lg border transition-all ${active ? "border-[var(--p-accent)] ring-1 ring-[var(--p-accent)]/40" : "border-border"}`}
                      style={{
                        backgroundImage: p.previewBg,
                        backgroundSize: p.size,
                        background: p.previewBg === "none" ? "var(--secondary)" : undefined,
                        backgroundColor: p.previewBg !== "none" ? "var(--secondary)" : undefined,
                        backgroundRepeat: "repeat",
                      }}
                    />
                    <span className="text-[9px] text-muted-foreground leading-none">{p.label}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* ── ROLE CARD STYLE ─────────────────────────────────── */}
          <section className="space-y-3">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
              Role card style
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(Object.keys(ROLES_STYLES) as RolesStyle[]).map((key) => {
                const active = theme.rolesStyle === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => save({ rolesStyle: key })}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${active ? "border-[var(--p-accent)]/60 bg-[var(--p-accent)]/5" : "border-border/50 hover:border-border"}`}
                  >
                    <RoleStyleMini styleKey={key} accent={theme.accentColor} />
                    <span className="text-[10px] text-muted-foreground">{ROLES_STYLES[key].label}</span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function ColorPicker({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (c: string) => void;
}) {
  return (
    <div className="space-y-2">
      <div>
        <p className="text-xs font-medium">{label}</p>
        {hint && <p className="text-[10px] text-muted-foreground/60">{hint}</p>}
      </div>
      <div className="flex items-center gap-3">
        <label className="relative cursor-pointer">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="sr-only"
          />
          <span
            className="block w-10 h-10 rounded-xl ring-1 ring-border/60 hover:ring-border transition-all"
            style={{ background: value }}
          />
        </label>
        <span className="text-xs font-mono text-muted-foreground">{value}</span>
      </div>
    </div>
  );
}

function RoleStyleMini({ styleKey, accent }: { styleKey: string; accent: string }) {
  const base = "w-full h-10 rounded-lg flex flex-col justify-center gap-1 px-2 overflow-hidden";

  switch (styleKey) {
    case "filled":
      return (
        <div
          className={base}
          style={{
            background: `color-mix(in srgb, ${accent} 15%, oklch(0.16 0.020 262))`,
            border: `1px solid color-mix(in srgb, ${accent} 25%, oklch(0.36 0.028 262))`,
          }}
        >
          <div className="h-1.5 w-3/4 rounded-full bg-white/20" />
          <div className="h-1 w-1/2 rounded-full bg-white/10" />
        </div>
      );
    case "gradient":
      return (
        <div
          className={base}
          style={{
            background: `linear-gradient(to right, color-mix(in srgb, ${accent} 20%, transparent), transparent)`,
            borderTop: "1px solid oklch(0.36 0.028 262)",
            borderBottom: "1px solid oklch(0.36 0.028 262)",
            borderRight: "1px solid oklch(0.36 0.028 262)",
            borderLeft: `3px solid ${accent}`,
          }}
        >
          <div className="h-1.5 w-3/4 rounded-full bg-white/20" />
          <div className="h-1 w-1/2 rounded-full bg-white/10" />
        </div>
      );
    case "glow":
      return (
        <div
          className={base}
          style={{
            border: "1px solid oklch(0.36 0.028 262)",
            boxShadow: `0 0 12px color-mix(in srgb, ${accent} 25%, transparent)`,
          }}
        >
          <div className="h-1.5 w-3/4 rounded-full bg-white/20" />
          <div className="h-1 w-1/2 rounded-full bg-white/10" />
        </div>
      );
    case "outline":
      return (
        <div
          className={base}
          style={{ border: `1.5px solid color-mix(in srgb, ${accent} 60%, transparent)` }}
        >
          <div className="h-1.5 w-3/4 rounded-full bg-white/20" />
          <div className="h-1 w-1/2 rounded-full bg-white/10" />
        </div>
      );
    case "minimal":
      return (
        <div
          className={`${base} rounded-b-lg rounded-t-none`}
          style={{
            borderTop: `2px solid ${accent}`,
            borderLeft: "none",
            borderRight: "none",
            borderBottom: "none",
            background: "oklch(0.205 0.020 262)",
          }}
        >
          <div className="h-1.5 w-3/4 rounded-full bg-white/20" />
          <div className="h-1 w-1/2 rounded-full bg-white/10" />
        </div>
      );
    case "border_left":
    default:
      return (
        <div
          className={base}
          style={{
            borderTop: "1px solid oklch(0.36 0.028 262)",
            borderBottom: "1px solid oklch(0.36 0.028 262)",
            borderRight: "1px solid oklch(0.36 0.028 262)",
            borderLeft: `3px solid ${accent}`,
          }}
        >
          <div className="h-1.5 w-3/4 rounded-full bg-white/20" />
          <div className="h-1 w-1/2 rounded-full bg-white/10" />
        </div>
      );
  }
}
