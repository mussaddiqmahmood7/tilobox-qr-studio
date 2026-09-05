"use client";

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Palette, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ColorThemePreset {
  id: string;
  name: string;
  foreground: string;
  positioning: string;
  background: string;
  gradient?: string;
  border?: string;
}

export const BRAND_COLOR_THEMES: ColorThemePreset[] = [
  {
    id: "tilobox-primary",
    name: "TiloBox Primary",
    foreground: "#0B5FA5",
    positioning: "#0B5FA5",
    background: "#FFFFFF",
    border: "#9FB2C5",
  },
  {
    id: "midnight-obsidian",
    name: "Midnight Obsidian",
    foreground: "#09090B",
    positioning: "#09090B",
    background: "#FFFFFF",
    border: "#E2E8F0",
  },
  {
    id: "royal-sapphire",
    name: "Royal Sapphire",
    foreground: "#1D4ED8",
    positioning: "#1D4ED8",
    background: "#FFFFFF",
    border: "#93C5FD",
  },
  {
    id: "luxury-champagne",
    name: "Luxury Champagne",
    foreground: "#D97706",
    positioning: "#D97706",
    background: "#09090B",
    border: "#78350F",
  },
];

interface BrandThemePickerProps {
  onApplyTheme: (theme: {
    foreground: string;
    positioning: string;
    background?: string;
  }) => void;
  currentFg?: string;
}

export function BrandThemePicker({
  onApplyTheme,
  currentFg = "#000000",
}: BrandThemePickerProps) {
  const [activeThemeId, setActiveThemeId] = useState<string>("custom");
  const [customFg, setCustomFg] = useState(currentFg);

  const handleSelectPreset = (preset: ColorThemePreset) => {
    setActiveThemeId(preset.id);
    setCustomFg(preset.foreground);
    onApplyTheme({
      foreground: preset.foreground,
      positioning: preset.positioning,
      background: preset.background,
    });
  };

  const handleCustomChange = (hex: string) => {
    setActiveThemeId("custom");
    setCustomFg(hex);
    onApplyTheme({
      foreground: hex,
      positioning: hex,
    });
  };

  return (
    <div className="rounded-xl border border-border/70 bg-card/60 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-primary" />
          <Label className="text-sm font-semibold">Brand Color Themes</Label>
        </div>
        <span className="text-[11px] text-muted-foreground uppercase font-semibold tracking-wider">
          1-Click Sync
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {BRAND_COLOR_THEMES.map((theme) => {
          const isSelected = activeThemeId === theme.id;
          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => handleSelectPreset(theme)}
              className={cn(
                "flex items-center gap-2 p-2 rounded-lg border text-left text-xs font-medium transition-all",
                isSelected
                  ? "border-primary bg-primary/10 text-foreground shadow-xs ring-1 ring-primary/30"
                  : "border-border bg-background/80 text-muted-foreground hover:border-primary/40 hover:text-foreground"
              )}
            >
              <div
                className="w-5 h-5 rounded-md border flex items-center justify-center shrink-0 shadow-2xs"
                style={{
                  backgroundColor: theme.background,
                  borderColor: theme.border || "#d0d7de",
                }}
              >
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: theme.foreground }}
                />
              </div>
              <span className="truncate flex-1">{theme.name}</span>
              {isSelected && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* Custom Color Input */}
      <div className="flex items-center justify-between pt-1 border-t border-border/50 text-xs">
        <span className="text-muted-foreground">Custom Color Hex:</span>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={customFg}
            onChange={(e) => handleCustomChange(e.target.value)}
            className="w-7 h-7 rounded border border-border cursor-pointer bg-transparent"
          />
          <input
            type="text"
            value={customFg}
            onChange={(e) => handleCustomChange(e.target.value)}
            className="w-20 px-2 py-1 text-xs font-mono rounded border border-border bg-background"
            placeholder="#000000"
          />
        </div>
      </div>
    </div>
  );
}
