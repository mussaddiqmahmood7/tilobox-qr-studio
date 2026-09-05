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
  Download,
  Palette,
  LayoutTemplate,
  Coffee,
  Sparkle,
  Briefcase,
  Layers,
  Check,
  Loader2,
  Car,
  Scissors,
  Terminal,
  Bot,
  Smile,
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
  | "kids_playful"
  | "tech_software"
  | "ai_neural"
  | "taxi_transport"
  | "barber_salon"
  | "bistro_cafe"
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
    id: "kids_playful",
    name: "Kids & Playful",
    category: "Toys • Family • Fun",
    icon: Smile,
  },
  {
    id: "tech_software",
    name: "Tech & Software",
    category: "SaaS • Developer • Cloud",
    icon: Terminal,
  },
  {
    id: "ai_neural",
    name: "AI & Neural",
    category: "Cyber • Futuristic • AI",
    icon: Bot,
  },
  {
    id: "taxi_transport",
    name: "Taxi & Transport",
    category: "Fleet • Cabs • Dispatch",
    icon: Car,
  },
  {
    id: "barber_salon",
    name: "Barber & Salon",
    category: "Hair • Grooming • Beauty",
    icon: Scissors,
  },
  {
    id: "bistro_cafe",
    name: "Bistro & Cafe",
    category: "Restaurant • Food & Drink",
    icon: Coffee,
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
    category: "Galleries • Studios • Modern",
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
  const [headline, setHeadline] = useState("Scan to Connect & Explore");
  const [subhead, setSubhead] = useState("Point your smartphone camera at this code • No app needed");
  const [businessName, setBusinessName] = useState("Studio & Lounge");
  const [stationTag, setStationTag] = useState("Station 12 • Priority Suite");
  const [footerNote, setFooterNote] = useState("Free Guest Access • 100% In-Browser & Private");
  const [selectedTemplate, setSelectedTemplate] = useState<CardTemplate>("bistro_cafe");
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
      // 1. KIDS & PLAYFUL TEMPLATE
      case "kids_playful":
        return (
          <div
            ref={cardRef}
            className="w-[360px] h-[540px] rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden shadow-xl border-4"
            style={{
              borderColor: "#F59E0B",
              background: "linear-gradient(135deg, #FEF9C3 0%, #FEF08A 50%, #FDE68A 100%)",
              color: "#78350F",
            }}
          >
            {/* Playful Floating Badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BrandMark className="h-8 w-8 rounded-xl shadow-xs" />
                <span className="font-extrabold tracking-tight text-sm text-amber-950">
                  {businessName}
                </span>
              </div>
              <span className="text-[11px] font-black px-3 py-1 rounded-full bg-amber-500 text-white shadow-xs">
                🎈 {stationTag} 🎈
              </span>
            </div>

            {/* QR Center Container with Fun Bubble Styling */}
            <div className="flex flex-col items-center my-auto">
              <div className="bg-white p-4 rounded-3xl shadow-md border-4 border-amber-300 mb-3 flex items-center justify-center">
                <div
                  className="w-[180px] h-[180px] flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
                  dangerouslySetInnerHTML={{ __html: qrSvgHtml }}
                />
              </div>

              <h2 className="text-xl font-black tracking-tight text-center text-amber-950 mt-1">
                ⭐ {headline} ⭐
              </h2>
              <p className="text-xs text-center text-amber-900/80 max-w-[280px] mt-1 font-semibold leading-relaxed">
                {subhead}
              </p>
            </div>

            {/* Playful Footer */}
            <div className="border-t-2 border-dashed border-amber-300/80 pt-3 flex flex-col items-center text-center">
              <div className="text-[10px] font-bold text-amber-800 tracking-wide">
                {footerNote}
              </div>
              <div className="text-[9px] text-amber-700/80 mt-1 font-mono uppercase tracking-wider">
                ▲ Fold here for fun tabletop card stand ▲
              </div>
            </div>
          </div>
        );

      // 2. TECH & SOFTWARE TEMPLATE
      case "tech_software":
        return (
          <div
            ref={cardRef}
            className="w-[360px] h-[540px] rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden text-slate-100 shadow-2xl border-2 bg-[#0F172A]"
            style={{ borderColor: accentColor }}
          >
            {/* Terminal Window Header */}
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                </div>
                <span className="font-mono text-xs font-semibold text-slate-300 ml-1">
                  bash :: {businessName}
                </span>
              </div>
              <div className="font-mono text-[9px] bg-slate-800 text-emerald-400 border border-slate-700 px-2 py-0.5 rounded">
                {"v2.4.0 // ACTIVE"}
              </div>
            </div>

            {/* Middle QR Container with IDE look */}
            <div className="flex flex-col items-center my-auto">
              <div className="font-mono text-[10px] text-sky-400 mb-1.5 self-start">
                {`>_ station: "${stationTag}"`}
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-600 shadow-xl mb-3 flex items-center justify-center">
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

            {/* CLI Command Footer */}
            <div className="border-t border-slate-700/60 pt-3 flex flex-col items-center text-center">
              <div className="text-[10px] font-mono text-slate-400">
                {footerNote}
              </div>
              <div className="text-[9px] font-mono text-emerald-400 mt-1 uppercase tracking-wider">
                {`$ curl -sL connect // READY ON PORT 443`}
              </div>
            </div>
          </div>
        );

      // 3. AI & NEURAL TEMPLATE
      case "ai_neural":
        return (
          <div
            ref={cardRef}
            className="w-[360px] h-[540px] rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden text-white shadow-2xl border-2 bg-gradient-to-b from-[#070614] via-[#0E0B25] to-[#080516]"
            style={{ borderColor: accentColor }}
          >
            {/* Holographic Glowing Orbs */}
            <div
              className="absolute -top-24 -left-24 w-52 h-52 rounded-full blur-3xl opacity-30 pointer-events-none"
              style={{ backgroundColor: "#8B5CF6" }}
            />
            <div
              className="absolute -bottom-24 -right-24 w-52 h-52 rounded-full blur-3xl opacity-30 pointer-events-none"
              style={{ backgroundColor: "#06B6D4" }}
            />

            {/* Header: AI Badge */}
            <div className="flex items-center justify-between border-b border-purple-900/40 pb-3">
              <div className="flex items-center gap-2">
                <BrandMark className="h-7 w-7 rounded-lg" />
                <span className="font-black text-sm tracking-wide text-white uppercase">
                  {businessName}
                </span>
              </div>
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-cyan-300 bg-cyan-950/80 border border-cyan-400/40 px-2 py-0.5 rounded-full">
                ⚡ NEURAL LINK ⚡
              </span>
            </div>

            {/* Middle QR Container with AI Iridescent Glow */}
            <div className="flex flex-col items-center my-auto">
              <div className="text-[10px] font-mono text-purple-300/80 mb-2 tracking-widest uppercase">
                {stationTag}
              </div>

              <div className="bg-white p-3.5 rounded-2xl shadow-[0_0_30px_rgba(139,92,246,0.3)] border-2 border-purple-400/50 mb-3 flex items-center justify-center">
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

            {/* Bottom Cyber Circuit */}
            <div className="border-t border-dashed border-purple-800/40 pt-3 flex flex-col items-center text-center">
              <div className="text-[10px] text-purple-300 font-medium">
                {footerNote}
              </div>
              <div className="text-[8px] font-mono text-cyan-400/80 mt-1 uppercase tracking-widest">
                {"[ AI PROTOCOL :: ZERO-LATENCY DIRECT INTERACTION ]"}
              </div>
            </div>
          </div>
        );

      // 4. TAXI & TRANSPORT TEMPLATE
      case "taxi_transport":
        return (
          <div
            ref={cardRef}
            className="w-[360px] h-[540px] rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden text-neutral-900 shadow-2xl border-4 border-black bg-[#FACC15]"
          >
            {/* Checkerboard Header Strip */}
            <div className="flex flex-col gap-2">
              <div className="h-4 w-full bg-[linear-gradient(45deg,#000_25%,transparent_25%),linear-gradient(-45deg,#000_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#000_75%),linear-gradient(-45deg,transparent_75%,#000_75%)] bg-[size:16px_16px] bg-[position:0_0,0_8px,8px_-8px,-8px_0px] rounded-md opacity-90" />
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <span className="font-black text-base tracking-tighter uppercase text-black">
                    🚕 {businessName}
                  </span>
                </div>
                <span className="bg-black text-[#FACC15] text-[10px] font-black uppercase px-2.5 py-0.5 rounded tracking-wider">
                  {stationTag}
                </span>
              </div>
            </div>

            {/* QR Center Container with High Visibility */}
            <div className="flex flex-col items-center my-auto">
              <div className="bg-white p-3.5 rounded-xl border-4 border-black shadow-2xl mb-3 flex items-center justify-center">
                <div
                  className="w-[180px] h-[180px] flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
                  dangerouslySetInnerHTML={{ __html: qrSvgHtml }}
                />
              </div>

              <h2 className="text-xl font-black tracking-tight text-center text-black uppercase mt-1">
                {headline}
              </h2>
              <p className="text-xs text-center text-neutral-900 max-w-[280px] mt-1 font-bold leading-relaxed">
                {subhead}
              </p>
            </div>

            {/* Checkerboard Footer Strip */}
            <div className="flex flex-col gap-2 pt-2">
              <div className="text-[10px] font-black text-center uppercase tracking-wider text-black">
                {footerNote}
              </div>
              <div className="h-4 w-full bg-[linear-gradient(45deg,#000_25%,transparent_25%),linear-gradient(-45deg,#000_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#000_75%),linear-gradient(-45deg,transparent_75%,#000_75%)] bg-[size:16px_16px] bg-[position:0_0,0_8px,8px_-8px,-8px_0px] rounded-md opacity-90" />
            </div>
          </div>
        );

      // 5. BARBER & SALON TEMPLATE
      case "barber_salon":
        return (
          <div
            ref={cardRef}
            className="w-[360px] h-[540px] rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden text-neutral-100 shadow-2xl border-2 bg-[#18181B]"
            style={{ borderColor: accentColor }}
          >
            {/* Vintage Barber Header */}
            <div className="flex flex-col items-center text-center border-b border-neutral-700/80 pb-3">
              <div className="flex items-center gap-1.5 text-amber-400 text-xs font-serif tracking-widest uppercase mb-1">
                <span>✂️</span>
                <span>ESTABLISHED STYLING</span>
                <span>✂️</span>
              </div>
              <h1 className="font-serif text-lg font-bold tracking-wide text-white uppercase">
                {businessName}
              </h1>
              <div className="text-[10px] font-serif text-neutral-400 tracking-wider mt-0.5">
                {stationTag}
              </div>
            </div>

            {/* Middle QR Container with Gold Trim */}
            <div className="flex flex-col items-center my-auto">
              <div className="bg-white p-3.5 rounded-xl border-2 border-amber-500/80 shadow-2xl mb-3 flex items-center justify-center">
                <div
                  className="w-[175px] h-[175px] flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
                  dangerouslySetInnerHTML={{ __html: qrSvgHtml }}
                />
              </div>

              <h2 className="font-serif text-base font-bold text-center text-amber-200 mt-1">
                {headline}
              </h2>
              <p className="text-xs text-center text-neutral-300 max-w-[270px] mt-1 leading-relaxed font-sans">
                {subhead}
              </p>
            </div>

            {/* Barber Pole Strip Footer */}
            <div className="border-t border-neutral-700/80 pt-3 flex flex-col items-center text-center">
              <div className="text-[10px] font-serif text-neutral-300">
                {footerNote}
              </div>
              <div className="text-[9px] text-amber-400/80 mt-1 font-serif uppercase tracking-widest">
                CLASSIC GROOMING • APPOINTMENTS & WALK-INS
              </div>
            </div>
          </div>
        );

      // 6. BISTRO & CAFE TEMPLATE
      case "bistro_cafe":
        return (
          <div
            ref={cardRef}
            className="w-[360px] h-[540px] rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden text-amber-950 shadow-xl border-2 border-amber-200/80 bg-[#FAF8F5]"
            style={{ borderColor: accentColor }}
          >
            {/* Bistro Header with Culinary Touch */}
            <div className="flex items-center justify-between border-b border-amber-200/80 pb-3">
              <div className="flex items-center gap-2">
                <BrandMark className="h-7 w-7 rounded-md" />
                <span className="font-serif font-bold text-sm text-amber-950">
                  {businessName}
                </span>
              </div>
              <span className="text-[10px] font-semibold text-amber-900 bg-amber-100 border border-amber-200 px-2.5 py-0.5 rounded-full">
                🍽️ {stationTag}
              </span>
            </div>

            {/* QR Container in Linen Frame */}
            <div className="flex flex-col items-center my-auto">
              <div className="bg-white p-4 rounded-2xl shadow-md border border-amber-200 mb-3 flex items-center justify-center">
                <div
                  className="w-[175px] h-[175px] flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
                  dangerouslySetInnerHTML={{ __html: qrSvgHtml }}
                />
              </div>

              <h2 className="font-serif text-base font-bold text-center text-amber-950 mt-1">
                {headline}
              </h2>
              <p className="text-xs text-center text-amber-800/80 max-w-[270px] mt-1 leading-relaxed font-sans">
                {subhead}
              </p>
            </div>

            {/* Table Stand Fold Note */}
            <div className="border-t border-dashed border-amber-300 pt-3 flex flex-col items-center text-center">
              <div className="text-[10px] font-medium text-amber-800">
                {footerNote}
              </div>
              <div className="text-[9px] text-amber-600 mt-1 font-mono uppercase tracking-wider">
                ▲ Fold line for tabletop acrylic tent stand ▲
              </div>
            </div>
          </div>
        );

      // 7. BUSINESS & EXECUTIVE TEMPLATE
      case "business_executive":
        return (
          <div
            ref={cardRef}
            className="w-[360px] h-[540px] rounded-xl p-7 flex flex-col justify-between relative overflow-hidden text-slate-900 shadow-xl border-2 bg-[#FDFBF7]"
            style={{ borderColor: accentColor }}
          >
            {/* Formal Executive Header */}
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

      // 8. MINIMALIST ART TEMPLATE
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
                Select from 8 themed templates (Kids, Tech, AI, Taxi, Barber, Bistro, Executive, Minimal), customize station info, and download a pixel-perfect 300 DPI PNG.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4">
          {/* Left Controls Column (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* 1. Template Picker (8 themes) */}
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-primary" />
                Select Creative Theme
              </Label>
              <div className="grid grid-cols-2 gap-1.5 max-h-[190px] overflow-y-auto pr-1">
                {TEMPLATES.map((tmpl) => {
                  const Icon = tmpl.icon;
                  const isSelected = selectedTemplate === tmpl.id;
                  return (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() => setSelectedTemplate(tmpl.id)}
                      className={cn(
                        "flex items-center gap-2 p-2 rounded-xl border text-start transition-all",
                        isSelected
                          ? "border-primary bg-primary/10 shadow-xs ring-1 ring-primary/40 text-foreground"
                          : "border-border/70 hover:border-border hover:bg-muted/40 text-muted-foreground"
                      )}
                    >
                      <div
                        className={cn(
                          "p-1.5 rounded-lg border shrink-0",
                          isSelected
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-muted border-border"
                        )}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-semibold text-foreground truncate">
                          {tmpl.name}
                        </div>
                        <div className="text-[9px] text-muted-foreground truncate">
                          {tmpl.category}
                        </div>
                      </div>
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
                  Business / Venue / Title Name
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
                  Station / Table / Badge Tag
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
                  Footer Note / Wi-Fi Details
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
              Live Card Preview (300 DPI Print Aspect)
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
