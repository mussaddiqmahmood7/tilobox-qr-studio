"use client";

import React, { useState, useRef } from "react";
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
  Sparkles,
  Download,
  Palette,
  LayoutTemplate,
  Coffee,
  Moon,
  Sparkle,
  Cpu,
  Briefcase,
  Layers,
  Check,
  Loader2,
  PartyPopper,
} from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface TentCardExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  qrSvgHtml: string;
}

export type CardTemplate =
  | "joy_vibrant"
  | "tech_cyber"
  | "entertainment_vip"
  | "business_executive"
  | "minimal_art";

interface TemplateConfig {
  id: CardTemplate;
  name: string;
  category: string;
  icon: React.ElementType;
}

const TEMPLATES: TemplateConfig[] = [
  {
    id: "joy_vibrant",
    name: "Joy & Vibrant",
    category: "Events • Cafes • Social",
    icon: PartyPopper,
  },
  {
    id: "tech_cyber",
    name: "Tech & Cyber",
    category: "Startups • Co-working • Dev",
    icon: Cpu,
  },
  {
    id: "entertainment_vip",
    name: "Entertainment & VIP",
    category: "Lounges • Clubs • Nightlife",
    icon: Moon,
  },
  {
    id: "business_executive",
    name: "Business & Executive",
    category: "Corporate • Hotels • Law",
    icon: Briefcase,
  },
  {
    id: "minimal_art",
    name: "Minimalist Art",
    category: "Galleries • Boutiques • Studios",
    icon: Sparkle,
  },
];

const ACCENT_COLORS = [
  { name: "TiloBox Blue", hex: "#0B5FA5" },
  { name: "Obsidian Black", hex: "#111827" },
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
  const [subhead, setSubhead] = useState("Point your camera to view contactless menu • No app needed");
  const [businessName, setBusinessName] = useState("The Brass Bistro");
  const [stationTag, setStationTag] = useState("Table 12 • Patio Suite");
  const [footerNote, setFooterNote] = useState("Free Guest Wi-Fi & Ordering • Powered by TiloBox");
  const [selectedTemplate, setSelectedTemplate] = useState<CardTemplate>("joy_vibrant");
  const [accentColor, setAccentColor] = useState<string>("#0B5FA5");
  const [isExportingPng, setIsExportingPng] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownloadCardPng = async () => {
    if (!cardRef.current) return;
    setIsExportingPng(true);
    const toastId = toast.loading("Rendering pixel-perfect 300 DPI card image...");

    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 3, // 3x resolution creates ultra-sharp print quality
        cacheBust: true,
        quality: 1.0,
      });

      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `tilobox-${selectedTemplate}-card-${Date.now()}.png`;
      a.click();
      toast.success("300 DPI Card Image downloaded successfully!", { id: toastId });
    } catch (err) {
      console.error("Card export error:", err);
      toast.error("Could not export card image. Please try again.", { id: toastId });
    } finally {
      setIsExportingPng(false);
    }
  };

  // Render the card according to the selected creative template
  const renderCardContent = () => {
    switch (selectedTemplate) {
      // 1. JOY & VIBRANT TEMPLATE
      case "joy_vibrant":
        return (
          <div
            ref={cardRef}
            className="w-[360px] h-[540px] rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden text-slate-800 shadow-xl border-4"
            style={{
              borderColor: accentColor,
              background: "linear-gradient(145deg, #FFFDF7 0%, #FFF7ED 50%, #FEF2F2 100%)",
            }}
          >
            {/* Top decorative badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BrandMark className="h-7 w-7 rounded-lg shadow-xs" />
                <span className="font-extrabold tracking-tight text-sm text-slate-900">
                  {businessName}
                </span>
              </div>
              <span
                className="text-[10px] font-bold px-2.5 py-1 rounded-full text-white shadow-xs"
                style={{ backgroundColor: accentColor }}
              >
                ✨ {stationTag} ✨
              </span>
            </div>

            {/* Middle QR Container */}
            <div className="flex flex-col items-center my-auto">
              <div className="bg-white p-4 rounded-2xl shadow-lg border border-orange-100/80 mb-3 flex items-center justify-center">
                <div
                  className="w-[180px] h-[180px] flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
                  dangerouslySetInnerHTML={{ __html: qrSvgHtml }}
                />
              </div>

              <h2 className="text-lg font-black tracking-tight text-center text-slate-900 mt-1">
                {headline}
              </h2>
              <p className="text-xs text-center text-slate-600 max-w-[280px] mt-1 leading-relaxed font-medium">
                {subhead}
              </p>
            </div>

            {/* Bottom info & fold guide */}
            <div className="border-t border-dashed border-orange-200 pt-3 flex flex-col items-center text-center">
              <div className="text-[10px] font-semibold text-slate-500 tracking-wide">
                {footerNote}
              </div>
              <div className="text-[9px] text-slate-400 mt-1 font-mono uppercase tracking-wider">
                ▲ Fold line for tabletop acrylic stand or tent card ▲
              </div>
            </div>
          </div>
        );

      // 2. TECH & CYBER TEMPLATE
      case "tech_cyber":
        return (
          <div
            ref={cardRef}
            className="w-[360px] h-[540px] rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden text-slate-100 shadow-2xl border-2 bg-[#080C14]"
            style={{ borderColor: accentColor }}
          >
            {/* Cyber corner reticles */}
            <div className="absolute top-2 left-2 text-[10px] font-mono text-cyan-500/70">[ + ]</div>
            <div className="absolute top-2 right-2 text-[10px] font-mono text-cyan-500/70">[ + ]</div>
            <div className="absolute bottom-2 left-2 text-[10px] font-mono text-cyan-500/70">[ + ]</div>
            <div className="absolute bottom-2 right-2 text-[10px] font-mono text-cyan-500/70">[ + ]</div>

            {/* Header with Monospace protocol */}
            <div className="flex items-center justify-between border-b border-cyan-900/50 pb-3">
              <div className="flex items-center gap-2">
                <BrandMark className="h-7 w-7 rounded-md" />
                <div>
                  <div className="font-mono text-xs font-bold text-white tracking-wider uppercase">
                    {businessName}
                  </div>
                  <div className="text-[9px] font-mono text-cyan-400">
                    {"// PROTOCOL :: "} {stationTag}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-cyan-950/80 border border-cyan-800/80 px-2 py-0.5 rounded text-[10px] font-mono text-cyan-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ONLINE
              </div>
            </div>

            {/* Middle QR Container with cyber frame */}
            <div className="flex flex-col items-center my-auto">
              <div
                className="bg-white p-3.5 rounded-xl border-2 shadow-[0_0_20px_rgba(6,182,212,0.15)] mb-3 flex items-center justify-center"
                style={{ borderColor: accentColor }}
              >
                <div
                  className="w-[180px] h-[180px] flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
                  dangerouslySetInnerHTML={{ __html: qrSvgHtml }}
                />
              </div>

              <h2 className="font-mono text-base font-bold text-center tracking-tight text-white mt-1">
                {headline}
              </h2>
              <p className="font-mono text-[11px] text-center text-slate-400 max-w-[280px] mt-1 leading-relaxed">
                {subhead}
              </p>
            </div>

            {/* Bottom terminal footer */}
            <div className="border-t border-cyan-900/50 pt-3 flex flex-col items-center text-center">
              <div className="text-[10px] font-mono text-slate-400">
                {footerNote}
              </div>
              <div className="text-[9px] font-mono text-cyan-600 mt-1 uppercase tracking-widest">
                --- DUAL-BAND 5GHZ // NO CLIENT REGISTRATION REQUIRED ---
              </div>
            </div>
          </div>
        );

      // 3. ENTERTAINMENT & VIP NIGHTLIFE TEMPLATE
      case "entertainment_vip":
        return (
          <div
            ref={cardRef}
            className="w-[360px] h-[540px] rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden text-white shadow-2xl border-2 bg-gradient-to-b from-[#110B1E] via-[#0A0713] to-[#07050E]"
            style={{ borderColor: accentColor }}
          >
            {/* Glamour top glow */}
            <div
              className="absolute -top-20 -right-20 w-48 h-48 rounded-full blur-3xl opacity-30 pointer-events-none"
              style={{ backgroundColor: accentColor }}
            />

            {/* Header: VIP Ticket / Pass look */}
            <div className="flex items-center justify-between border-b border-purple-900/40 pb-3">
              <div className="flex items-center gap-2.5">
                <BrandMark className="h-7 w-7 rounded-xl" />
                <span className="font-black text-sm tracking-wide text-white uppercase">
                  {businessName}
                </span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-300 bg-amber-500/15 border border-amber-400/30 px-2.5 py-0.5 rounded-full">
                ✦ VIP PASS ✦
              </span>
            </div>

            {/* QR Card with luminous border */}
            <div className="flex flex-col items-center my-auto">
              <div className="text-[10px] font-bold uppercase tracking-widest text-purple-300/80 mb-2">
                {stationTag}
              </div>

              <div className="bg-white p-3.5 rounded-2xl shadow-2xl border-2 border-purple-400/40 mb-3 flex items-center justify-center">
                <div
                  className="w-[180px] h-[180px] flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
                  dangerouslySetInnerHTML={{ __html: qrSvgHtml }}
                />
              </div>

              <h2 className="text-lg font-black tracking-tight text-center text-white mt-1">
                {headline}
              </h2>
              <p className="text-xs text-center text-purple-200/70 max-w-[280px] mt-1 leading-relaxed">
                {subhead}
              </p>
            </div>

            {/* VIP Bottom bar */}
            <div className="border-t border-dashed border-purple-800/40 pt-3 flex flex-col items-center text-center">
              <div className="text-[10px] text-purple-300 font-medium">
                {footerNote}
              </div>
              <div className="text-[9px] text-purple-400/60 mt-1 uppercase tracking-widest font-mono">
                ✦ EXCLUSIVE GUEST ACCESS • INSTANT RECOGNITION ✦
              </div>
            </div>
          </div>
        );

      // 4. BUSINESS & EXECUTIVE TEMPLATE
      case "business_executive":
        return (
          <div
            ref={cardRef}
            className="w-[360px] h-[540px] rounded-xl p-7 flex flex-col justify-between relative overflow-hidden text-slate-900 shadow-xl border-2 bg-[#FDFBF7]"
            style={{ borderColor: accentColor }}
          >
            {/* Header: Formal Executive Layout */}
            <div className="flex flex-col items-center text-center border-b border-slate-300 pb-3">
              <BrandMark className="h-8 w-8 rounded-lg mb-1.5" />
              <h1 className="font-serif text-base font-bold tracking-tight text-slate-900">
                {businessName}
              </h1>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mt-0.5">
                {stationTag}
              </span>
            </div>

            {/* Middle QR Container */}
            <div className="flex flex-col items-center my-auto">
              <div className="bg-white p-3 rounded-lg border border-slate-300 shadow-sm mb-3 flex items-center justify-center">
                <div
                  className="w-[170px] h-[170px] flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
                  dangerouslySetInnerHTML={{ __html: qrSvgHtml }}
                />
              </div>

              <h2 className="font-serif text-base font-bold text-center text-slate-900 mt-1">
                {headline}
              </h2>
              <p className="text-xs text-center text-slate-600 max-w-[270px] mt-1 leading-relaxed">
                {subhead}
              </p>
            </div>

            {/* Bottom Executive Note */}
            <div className="border-t border-slate-300 pt-3 flex flex-col items-center text-center">
              <div className="text-[10px] font-medium text-slate-600">
                {footerNote}
              </div>
              <div className="text-[9px] text-slate-400 mt-1 font-serif uppercase tracking-widest">
                OFFICIAL DESK & SUITE COMPLIMENTARY ACCESS
              </div>
            </div>
          </div>
        );

      // 5. MINIMALIST ART TEMPLATE
      case "minimal_art":
        return (
          <div
            ref={cardRef}
            className="w-[360px] h-[540px] rounded-none p-7 flex flex-col justify-between relative overflow-hidden text-black shadow-xl border-[3px] border-black bg-white"
          >
            {/* Top Minimalist Header */}
            <div className="flex items-start justify-between border-b-2 border-black pb-3">
              <div>
                <div className="text-[9px] font-mono uppercase tracking-widest text-neutral-500">
                  {"EXHIBIT // STATION"}
                </div>
                <div className="font-black text-sm uppercase tracking-tighter">
                  {businessName}
                </div>
              </div>
              <div className="font-mono text-xs font-black uppercase border border-black px-2 py-0.5">
                {stationTag}
              </div>
            </div>

            {/* QR Center */}
            <div className="flex flex-col items-center my-auto">
              <div className="p-2 border border-black mb-3 flex items-center justify-center">
                <div
                  className="w-[175px] h-[175px] flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
                  dangerouslySetInnerHTML={{ __html: qrSvgHtml }}
                />
              </div>

              <h2 className="text-base font-black uppercase tracking-tight text-center mt-1">
                {headline}
              </h2>
              <p className="text-xs text-center text-neutral-600 max-w-[270px] mt-1 leading-relaxed font-sans">
                {subhead}
              </p>
            </div>

            {/* Bottom stark footer */}
            <div className="border-t-2 border-black pt-3 flex flex-col items-start">
              <div className="text-[10px] font-mono text-neutral-700">
                {footerNote}
              </div>
              <div className="text-[8px] font-mono text-neutral-400 mt-1 uppercase">
                INDEX :: TILOBOX ARCHIVE EDITION • 100% CLIENT-SIDE
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="pb-3 border-b border-border/60">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                <LayoutTemplate className="w-5 h-5 text-primary" />
                Creative Display Card Studio
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Choose a creative template, personalize station details, and download a pixel-perfect 300 DPI high-resolution PNG card.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4">
          {/* Left Controls Column (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* 1. Template Picker */}
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-primary" />
                Select Creative Template
              </Label>
              <div className="grid grid-cols-1 gap-1.5">
                {TEMPLATES.map((tmpl) => {
                  const Icon = tmpl.icon;
                  const isSelected = selectedTemplate === tmpl.id;
                  return (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() => setSelectedTemplate(tmpl.id)}
                      className={cn(
                        "flex items-center justify-between p-2.5 rounded-xl border text-start transition-all",
                        isSelected
                          ? "border-primary bg-primary/10 shadow-xs ring-1 ring-primary/40 text-foreground"
                          : "border-border/70 hover:border-border hover:bg-muted/40 text-muted-foreground"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={cn(
                            "p-1.5 rounded-lg border",
                            isSelected
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-muted border-border"
                          )}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-foreground">
                            {tmpl.name}
                          </div>
                          <div className="text-[10px] text-muted-foreground">
                            {tmpl.category}
                          </div>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-primary shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Accent Color Picker */}
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-primary" />
                Accent Color Swatch
              </Label>
              <div className="flex flex-wrap gap-2">
                {ACCENT_COLORS.map((col) => (
                  <button
                    key={col.hex}
                    type="button"
                    title={col.name}
                    onClick={() => setAccentColor(col.hex)}
                    className={cn(
                      "w-7 h-7 rounded-full border-2 transition-transform hover:scale-110",
                      accentColor === col.hex
                        ? "border-primary ring-2 ring-primary/40 scale-110"
                        : "border-white/50 dark:border-black/50"
                    )}
                    style={{ backgroundColor: col.hex }}
                  />
                ))}
              </div>
            </div>

            {/* 3. Text & Card Details */}
            <div className="space-y-2.5 pt-1">
              <div className="space-y-1">
                <Label htmlFor="card-venue" className="text-xs font-medium">
                  Business / Venue Name
                </Label>
                <Input
                  id="card-venue"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="h-8 text-xs font-medium"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="card-station" className="text-xs font-medium">
                  Station / Table / Room Tag
                </Label>
                <Input
                  id="card-station"
                  value={stationTag}
                  onChange={(e) => setStationTag(e.target.value)}
                  className="h-8 text-xs font-medium"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="card-headline" className="text-xs font-medium">
                  Main Headline
                </Label>
                <Input
                  id="card-headline"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="h-8 text-xs font-medium"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="card-subhead" className="text-xs font-medium">
                  Subtitle / Instructions
                </Label>
                <Input
                  id="card-subhead"
                  value={subhead}
                  onChange={(e) => setSubhead(e.target.value)}
                  className="h-8 text-xs font-medium"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="card-footer" className="text-xs font-medium">
                  Footer Note / Wi-Fi Note
                </Label>
                <Input
                  id="card-footer"
                  value={footerNote}
                  onChange={(e) => setFooterNote(e.target.value)}
                  className="h-8 text-xs font-medium"
                />
              </div>
            </div>

            {/* Download Action */}
            <div className="pt-2">
              <Button
                onClick={handleDownloadCardPng}
                disabled={isExportingPng}
                className="w-full gap-2 py-5 font-semibold text-sm shadow-md"
              >
                {isExportingPng ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                Download Card Image (300 DPI PNG)
              </Button>
              <p className="text-[11px] text-center text-muted-foreground mt-1.5">
                Exact pixel-perfect render • Ready for cardstock printing or digital display
              </p>
            </div>
          </div>

          {/* Right Live Preview Column (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center p-4 sm:p-6 bg-muted/40 rounded-2xl border border-border/60">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
              Live Card Preview
            </div>

            {/* Live rendered Card Container */}
            <div className="overflow-hidden p-2 flex items-center justify-center">
              {renderCardContent()}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
