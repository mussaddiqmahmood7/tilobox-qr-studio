"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Printer,
  Sparkles,
  Download,
  Palette,
  LayoutTemplate,
  Coffee,
  Moon,
  Sparkle,
} from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface TentCardExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  qrSvgHtml: string;
}

type CardTemplate = "modern_slate" | "bistro_warm" | "midnight_obsidian" | "minimal_clean";

interface TemplateConfig {
  id: CardTemplate;
  name: string;
  icon: React.ElementType;
  bgClass: string;
  textClass: string;
  subtextClass: string;
  borderClass: string;
  cardBgHex: string;
  textColorHex: string;
  subtextColorHex: string;
  qrBgHex: string;
}

const TEMPLATES: TemplateConfig[] = [
  {
    id: "modern_slate",
    name: "Modern Slate",
    icon: Sparkles,
    bgClass: "bg-white",
    textClass: "text-slate-900",
    subtextClass: "text-slate-500",
    borderClass: "border-slate-200",
    cardBgHex: "#ffffff",
    textColorHex: "#0f172a",
    subtextColorHex: "#64748b",
    qrBgHex: "#ffffff",
  },
  {
    id: "bistro_warm",
    name: "Bistro & Cafe",
    icon: Coffee,
    bgClass: "bg-[#FAF8F5]",
    textClass: "text-amber-950",
    subtextClass: "text-amber-800/80",
    borderClass: "border-amber-200/80",
    cardBgHex: "#FAF8F5",
    textColorHex: "#451a03",
    subtextColorHex: "#78350f",
    qrBgHex: "#ffffff",
  },
  {
    id: "midnight_obsidian",
    name: "Midnight Lounge",
    icon: Moon,
    bgClass: "bg-[#0B0F19]",
    textClass: "text-white",
    subtextClass: "text-slate-400",
    borderClass: "border-slate-800",
    cardBgHex: "#0B0F19",
    textColorHex: "#ffffff",
    subtextColorHex: "#94a3b8",
    qrBgHex: "#ffffff",
  },
  {
    id: "minimal_clean",
    name: "Minimalist",
    icon: Sparkle,
    bgClass: "bg-white",
    textClass: "text-black",
    subtextClass: "text-neutral-500",
    borderClass: "border-black",
    cardBgHex: "#ffffff",
    textColorHex: "#000000",
    subtextColorHex: "#737373",
    qrBgHex: "#ffffff",
  },
];

const ACCENT_COLORS = [
  { name: "TiloBox Blue", hex: "#0B5FA5" },
  { name: "Obsidian Black", hex: "#000000" },
  { name: "Emerald Green", hex: "#059669" },
  { name: "Warm Amber", hex: "#D97706" },
  { name: "Royal Violet", hex: "#7C3AED" },
  { name: "Crimson Rose", hex: "#E11D48" },
];

export function TentCardExportModal({
  open,
  onOpenChange,
  qrSvgHtml,
}: TentCardExportModalProps) {
  const [headline, setHeadline] = useState("Scan to Order & Connect");
  const [subhead, setSubhead] = useState("Point your camera to view contactless menu");
  const [businessName, setBusinessName] = useState("Table 5 • TiloBox Guest Suite");
  const [footerNote, setFooterNote] = useState("Free Guest Access • 100% In-Browser & Private");
  const [selectedTemplate, setSelectedTemplate] = useState<CardTemplate>("modern_slate");
  const [accentColor, setAccentColor] = useState<string>("#0B5FA5");
  const [isExportingPng, setIsExportingPng] = useState(false);

  const currentTemplate = TEMPLATES.find((t) => t.id === selectedTemplate) || TEMPLATES[0];

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCardPng = async () => {
    setIsExportingPng(true);
    try {
      // 1200 x 1800 px (exact 4:6 aspect ratio, 300 DPI for crisp physical print)
      const width = 1200;
      const height = 1800;
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not acquire 2D canvas context");

      // 1. Draw Card Background
      ctx.fillStyle = currentTemplate.cardBgHex;
      ctx.fillRect(0, 0, width, height);

      // 2. Draw Decorative Card Border
      ctx.save();
      ctx.strokeStyle =
        selectedTemplate === "minimal_clean"
          ? "#000000"
          : selectedTemplate === "midnight_obsidian"
          ? "#1e293b"
          : selectedTemplate === "bistro_warm"
          ? "#e7e0d8"
          : "#e2e8f0";
      ctx.lineWidth = selectedTemplate === "minimal_clean" ? 6 : 4;
      ctx.strokeRect(40, 40, width - 80, height - 80);
      ctx.restore();

      // 3. Header Branding: TiloBox Studio Mark
      ctx.save();
      ctx.font = "bold 32px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      ctx.textAlign = "center";
      ctx.fillStyle = currentTemplate.textColorHex;
      ctx.fillText("TILOBOX QR STUDIO", width / 2, 130);

      // Subtle hairline under header
      ctx.strokeStyle =
        selectedTemplate === "midnight_obsidian"
          ? "rgba(255,255,255,0.1)"
          : "rgba(0,0,0,0.08)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(100, 165);
      ctx.lineTo(width - 100, 165);
      ctx.stroke();
      ctx.restore();

      // 4. Business Station Pill Badge
      if (businessName.trim()) {
        ctx.save();
        ctx.font = "bold 28px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        const badgeText = businessName.toUpperCase();
        const textWidth = ctx.measureText(badgeText).width;
        const badgeW = textWidth + 60;
        const badgeH = 56;
        const badgeX = (width - badgeW) / 2;
        const badgeY = 220;

        ctx.fillStyle = accentColor;
        ctx.globalAlpha = 0.12;
        if (typeof ctx.roundRect === "function") {
          ctx.beginPath();
          ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 28);
          ctx.fill();
        } else {
          ctx.fillRect(badgeX, badgeY, badgeW, badgeH);
        }

        ctx.globalAlpha = 1.0;
        ctx.fillStyle = accentColor;
        ctx.textAlign = "center";
        ctx.fillText(badgeText, width / 2, badgeY + 39);
        ctx.restore();
      }

      // 5. Headline Text
      ctx.save();
      ctx.font = "bold 56px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      ctx.fillStyle = currentTemplate.textColorHex;
      ctx.textAlign = "center";
      ctx.fillText(headline, width / 2, 360, width - 180);

      // 6. Subheading Text
      ctx.font = "normal 32px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      ctx.fillStyle = currentTemplate.subtextColorHex;
      ctx.fillText(subhead, width / 2, 425, width - 200);
      ctx.restore();

      // 7. Render QR Code (Centered Square)
      const qrSize = 720;
      const qrX = (width - qrSize) / 2;
      const qrY = 510;

      // Draw QR card container box
      ctx.save();
      ctx.fillStyle = currentTemplate.qrBgHex;
      ctx.shadowColor = "rgba(0,0,0,0.08)";
      ctx.shadowBlur = 30;
      ctx.shadowOffsetY = 10;
      if (typeof ctx.roundRect === "function") {
        ctx.beginPath();
        ctx.roundRect(qrX - 20, qrY - 20, qrSize + 40, qrSize + 40, 36);
        ctx.fill();
      } else {
        ctx.fillRect(qrX - 20, qrY - 20, qrSize + 40, qrSize + 40);
      }
      ctx.restore();

      // Draw SVG into Canvas
      const parser = new DOMParser();
      const doc = parser.parseFromString(qrSvgHtml, "image/svg+xml");
      const svgEl = doc.querySelector("svg");
      if (svgEl) {
        svgEl.setAttribute("width", qrSize.toString());
        svgEl.setAttribute("height", qrSize.toString());
        const serializedSvg = new XMLSerializer().serializeToString(svgEl);
        const qrImage = new Image();
        const base64Data = btoa(unescape(encodeURIComponent(serializedSvg)));

        await new Promise<void>((resolve, reject) => {
          qrImage.onload = () => {
            ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);
            resolve();
          };
          qrImage.onerror = reject;
          qrImage.src = "data:image/svg+xml;base64," + base64Data;
        });
      }

      // 8. Footer divider, note & stand fold guideline
      ctx.save();
      ctx.strokeStyle =
        selectedTemplate === "midnight_obsidian"
          ? "rgba(255,255,255,0.12)"
          : "rgba(0,0,0,0.1)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(100, 1550);
      ctx.lineTo(width - 100, 1550);
      ctx.stroke();

      // Footer note
      ctx.font = "bold 28px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      ctx.textAlign = "center";
      ctx.fillStyle = currentTemplate.textColorHex;
      ctx.fillText(footerNote, width / 2, 1620);

      // Fold guideline
      ctx.font = "normal 24px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      ctx.fillStyle = currentTemplate.subtextColorHex;
      ctx.fillText("✂️ Table Stand Fold Guideline • Place On Flat Tabletop", width / 2, 1680);
      ctx.restore();

      // 9. Download PNG
      const pngUrl = canvas.toDataURL("image/png", 0.98);
      const a = document.createElement("a");
      a.href = pngUrl;
      a.download = `TiloBox_Display_Card_${selectedTemplate}_300DPI.png`;
      a.click();
      toast.success("300 DPI high-resolution tent card image downloaded");
    } catch (err) {
      console.error("Card PNG export error:", err);
      toast.error("Failed to render card image. Please use Print button instead.");
    } finally {
      setIsExportingPng(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto">
        <DialogHeader className="no-print">
          <DialogTitle className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-primary" />
            Printable 4x6 Display Tent Card & Export
          </DialogTitle>
          <DialogDescription>
            Print-ready table stand card for restaurants, barber counters, taxi stands, and guest desks.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-2">
          {/* Left Column: Customization Controls */}
          <div className="space-y-4 no-print">
            {/* Template Selector */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold flex items-center gap-1.5">
                <LayoutTemplate className="w-3.5 h-3.5 text-primary" />
                <span>Card Template</span>
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {TEMPLATES.map((tmpl) => {
                  const Icon = tmpl.icon;
                  const isSelected = selectedTemplate === tmpl.id;
                  return (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() => setSelectedTemplate(tmpl.id)}
                      className={cn(
                        "flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all text-left",
                        isSelected
                          ? "border-primary bg-primary/10 text-primary font-bold shadow-2xs"
                          : "border-border/70 hover:border-border hover:bg-muted/40 text-muted-foreground",
                      )}
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{tmpl.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Accent Color Picker */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-primary" />
                <span>Accent Color</span>
              </Label>
              <div className="flex flex-wrap items-center gap-2">
                {ACCENT_COLORS.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    title={c.name}
                    onClick={() => setAccentColor(c.hex)}
                    className={cn(
                      "w-6 h-6 rounded-full border-2 transition-transform hover:scale-110",
                      accentColor === c.hex
                        ? "border-foreground scale-110 shadow-xs ring-2 ring-primary/40 ring-offset-1"
                        : "border-transparent",
                    )}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>

            {/* Text Inputs */}
            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="tent-title" className="text-xs">Main Headline</Label>
                <Input
                  id="tent-title"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="Scan to Order & Connect"
                  className="text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="tent-sub" className="text-xs">Subheading</Label>
                <Input
                  id="tent-sub"
                  value={subhead}
                  onChange={(e) => setSubhead(e.target.value)}
                  placeholder="Point your smartphone camera"
                  className="text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="tent-business" className="text-xs">Business / Station Badge</Label>
                <Input
                  id="tent-business"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Table 12 • Salon Chair 3"
                  className="text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="tent-footer" className="text-xs">Footer Note</Label>
                <Input
                  id="tent-footer"
                  value={footerNote}
                  onChange={(e) => setFooterNote(e.target.value)}
                  placeholder="Free Access • No App Required"
                  className="text-xs"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-2">
              <Button
                type="button"
                onClick={handlePrint}
                className="w-full gap-2 shadow-sm font-semibold"
              >
                <Printer className="w-4 h-4" />
                Print 4x6 Card (Cardstock)
              </Button>

              <Button
                type="button"
                variant="outline"
                disabled={isExportingPng}
                onClick={handleDownloadCardPng}
                className="w-full gap-2 border-border/80 shadow-2xs font-semibold"
              >
                <Download className="w-4 h-4 text-primary" />
                {isExportingPng ? "Rendering Image..." : "Download Card Image (300 DPI PNG)"}
              </Button>

              <p className="text-[11px] text-muted-foreground text-center">
                Formatted for standard 4&quot; x 6&quot; (100mm x 150mm) photo or cardstock prints.
              </p>
            </div>
          </div>

          {/* Right Column: 4x6 Tent Card Live Preview */}
          <div className="flex flex-col items-center justify-center bg-muted/40 p-4 rounded-xl border border-border/60">
            <div
              id="tent-card-print-target"
              className={cn(
                "w-[260px] sm:w-[280px] aspect-[4/6] rounded-xl shadow-lg border p-5 flex flex-col justify-between items-center text-center relative overflow-hidden transition-all",
                currentTemplate.bgClass,
                currentTemplate.textClass,
                currentTemplate.borderClass,
              )}
            >
              {/* Header Branding */}
              <div className="w-full flex items-center justify-center gap-2 pt-1 border-b pb-2 border-current/10">
                <BrandMark className="h-5 w-5 rounded-md shadow-2xs" />
                <span className="text-[11px] font-black tracking-tight uppercase">
                  TiloBox QR Studio
                </span>
              </div>

              {/* Title & Badge */}
              <div className="my-auto space-y-1">
                {businessName && (
                  <span
                    className="inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
                    style={{
                      backgroundColor: `${accentColor}18`,
                      color: accentColor,
                    }}
                  >
                    {businessName}
                  </span>
                )}
                <h3 className="text-sm sm:text-base font-extrabold tracking-tight leading-snug">
                  {headline}
                </h3>
                <p className={cn("text-[10px] sm:text-[11px] leading-tight", currentTemplate.subtextClass)}>
                  {subhead}
                </p>
              </div>

              {/* QR Code Container */}
              <div
                className="w-40 h-40 sm:w-44 sm:h-44 my-2 flex items-center justify-center bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-sm"
                dangerouslySetInnerHTML={{ __html: qrSvgHtml }}
              />

              {/* Bottom Footer & Fold line */}
              <div className="w-full pt-2 border-t border-current/10 text-center space-y-0.5">
                <p className="text-[10px] font-medium">
                  {footerNote}
                </p>
                <div className={cn("flex items-center justify-center gap-1 text-[9px]", currentTemplate.subtextClass)}>
                  <span>✂️ Stand Fold Guideline</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
