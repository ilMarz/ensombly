"use client";

import { useState, useTransition } from "react";
import { updateProjectTheme } from "./actions";

const PRESETS = [
  { label: "Cosmic",  color: "#7c3aed" },
  { label: "Ember",   color: "#d97706" },
  { label: "Tide",    color: "#0891b2" },
  { label: "Grove",   color: "#059669" },
  { label: "Rose",    color: "#db2777" },
  { label: "Steel",   color: "#475569" },
  { label: "Solar",   color: "#dc2626" },
];

export function ThemePickerInline({
  projectId,
  currentColor,
}: {
  projectId: string;
  currentColor: string;
}) {
  const [active, setActive] = useState(currentColor);
  const [isPending, startTransition] = useTransition();

  const pick = (color: string) => {
    setActive(color);
    startTransition(async () => {
      await updateProjectTheme(projectId, color);
    });
  };

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 select-none">
        Theme
      </span>
      <div className="flex items-center gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.color}
            type="button"
            onClick={() => pick(p.color)}
            title={p.label}
            disabled={isPending}
            className="relative flex-shrink-0 transition-all duration-150 disabled:opacity-50"
            style={{ width: 22, height: 22 }}
          >
            <span
              className="block rounded-full w-full h-full"
              style={{ background: p.color }}
            />
            {active === p.color && (
              <span
                className="absolute inset-0 rounded-full"
                style={{
                  boxShadow: `0 0 0 2px var(--background), 0 0 0 3.5px ${p.color}`,
                }}
              />
            )}
          </button>
        ))}

        <label
          title="Custom colour"
          className="relative flex-shrink-0 cursor-pointer"
          style={{ width: 22, height: 22 }}
        >
          <input
            type="color"
            value={active}
            disabled={isPending}
            onChange={(e) => pick(e.target.value)}
            className="sr-only"
          />
          <span
            className="flex items-center justify-center w-full h-full rounded-full border border-border/60 bg-secondary/50 text-muted-foreground text-[10px]"
            title="Custom"
          >
            ＋
          </span>
        </label>
      </div>

      {isPending && (
        <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin text-muted-foreground/50" />
      )}
    </div>
  );
}
