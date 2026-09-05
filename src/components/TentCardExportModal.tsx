"use client";

import React, { useState, useRef, useEffect } from "react";
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
  Briefcase,
  Layers,
  Loader2,
  Car,
  Scissors,
  Terminal,
  Bot,
  Smile,
  Upload,
  Image as ImageIcon,
  Trash2,
  Check,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAtomValue } from "jotai";
import { centerLogoAtom } from "@/lib/states";

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
    category: "SaaS • Dev • Cloud",
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
    category: "Fleet • Cabs • Rides",
    icon: Car,
  },
  {
    id: "barber_salon",
    name: "Barber & Salon",
    category: "Hair • Grooming • Style",
    icon: Scissors,
  },
  {
    id: "bistro_cafe",
    name: "Bistro & Cafe",
    category: "Dining • Table Menu",
    icon: Coffee,
  },
  {
    id: "business_executive",
    name: "Executive Suite",
    category: "Corporate • Desk • VIP",
    icon: Briefcase,
  },
  {
    id: "minimal_art",
    name: "Swiss Minimal",
    category: "Gallery • Clean • Mono",
    icon: LayoutTemplate,
  },
];

export interface CardColorTheme {
  id: string;
  name: string;
  swatch: string;
  bg: string;
  cardBorder: string;
  surfaceBg: string;
  surfaceBorder: string;
  titleColor: string;
  textColor: string;
  accent: string;
  badgeBg: string;
  badgeText: string;
  footerText: string;
  isDark: boolean;
}

const COLOR_THEMES: CardColorTheme[] = [
  {
    id: "gold_luxury",
    name: "Warm Gold",
    swatch: "#D97706",
    bg: "#FFFBEB",
    cardBorder: "#FDE68A",
    surfaceBg: "#FFFFFF",
    surfaceBorder: "#FCD34D",
    titleColor: "#451A03",
    textColor: "#78350F",
    accent: "#D97706",
    badgeBg: "#FEF3C7",
    badgeText: "#92400E",
    footerText: "#B45309",
    isDark: false,
  },
  {
    id: "midnight_cyber",
    name: "Midnight Cyber",
    swatch: "#0284C7",
    bg: "#0B0F19",
    cardBorder: "#1E293B",
    surfaceBg: "#FFFFFF",
    surfaceBorder: "#38BDF8",
    titleColor: "#F8FAFC",
    textColor: "#94A3B8",
    accent: "#38BDF8",
    badgeBg: "rgba(56, 189, 248, 0.15)",
    badgeText: "#38BDF8",
    footerText: "#64748B",
    isDark: true,
  },
  {
    id: "emerald_botanical",
    name: "Emerald Green",
    swatch: "#059669",
    bg: "#ECFDF5",
    cardBorder: "#A7F3D0",
    surfaceBg: "#FFFFFF",
    surfaceBorder: "#34D399",
    titleColor: "#064E3B",
    textColor: "#047857",
    accent: "#059669",
    badgeBg: "#D1FAE5",
    badgeText: "#065F46",
    footerText: "#059669",
    isDark: false,
  },
  {
    id: "electric_ai",
    name: "Electric Violet",
    swatch: "#9333EA",
    bg: "#070614",
    cardBorder: "#2E1065",
    surfaceBg: "#FFFFFF",
    surfaceBorder: "#A855F7",
    titleColor: "#FAF5FF",
    textColor: "#C084FC",
    accent: "#A855F7",
    badgeBg: "rgba(168, 85, 247, 0.2)",
    badgeText: "#E9D5FF",
    footerText: "#9333EA",
    isDark: true,
  },
  {
    id: "crimson_ruby",
    name: "Ruby Crimson",
    swatch: "#E11D48",
    bg: "#FFF1F2",
    cardBorder: "#FECDD3",
    surfaceBg: "#FFFFFF",
    surfaceBorder: "#FB7185",
    titleColor: "#881337",
    textColor: "#9F1239",
    accent: "#E11D48",
    badgeBg: "#FFE4E6",
    badgeText: "#9F1239",
    footerText: "#BE123C",
    isDark: false,
  },
  {
    id: "taxi_yellow",
    name: "Taxi Yellow",
    swatch: "#EAB308",
    bg: "#FEF08A",
    cardBorder: "#CA8A04",
    surfaceBg: "#FFFFFF",
    surfaceBorder: "#EAB308",
    titleColor: "#000000",
    textColor: "#422006",
    accent: "#CA8A04",
    badgeBg: "#000000",
    badgeText: "#FEF08A",
    footerText: "#713F12",
    isDark: false,
  },
  {
    id: "artisan_linen",
    name: "Artisan Linen",
    swatch: "#78350F",
    bg: "#FAF8F5",
    cardBorder: "#E7E5E4",
    surfaceBg: "#FFFFFF",
    surfaceBorder: "#D6D3D1",
    titleColor: "#292524",
    textColor: "#57534E",
    accent: "#78350F",
    badgeBg: "#F5F5F4",
    badgeText: "#44403C",
    footerText: "#78716C",
    isDark: false,
  },
  {
    id: "swiss_mono",
    name: "Swiss Mono",
    swatch: "#000000",
    bg: "#FFFFFF",
    cardBorder: "#000000",
    surfaceBg: "#FFFFFF",
    surfaceBorder: "#000000",
    titleColor: "#000000",
    textColor: "#525252",
    accent: "#000000",
    badgeBg: "#000000",
    badgeText: "#FFFFFF",
    footerText: "#737373",
    isDark: false,
  },
];

export function TentCardExportModal({
  open,
  onOpenChange,
  qrSvgHtml,
}: TentCardExportModalProps) {
  const centerLogo = useAtomValue(centerLogoAtom);

  const [selectedTemplate, setSelectedTemplate] = useState<CardTemplate>("bistro_cafe");
  const [selectedThemeId, setSelectedThemeId] = useState<string>("artisan_linen");

  // Custom Logo State: Auto-inherit from QR studio if uploaded
  const [includeLogo, setIncludeLogo] = useState<boolean>(Boolean(centerLogo.url));
  const [customLogoUrl, setCustomLogoUrl] = useState<string | null>(centerLogo.url || null);

  // Sync if studio logo changes
  useEffect(() => {
    if (centerLogo.url && !customLogoUrl) {
      setCustomLogoUrl(centerLogo.url);
      setIncludeLogo(true);
    }
  }, [centerLogo.url, customLogoUrl]);

  // Card Content Customization (100% white-label: zero TiloBox branding)
  const [businessName, setBusinessName] = useState("The Grand Pavilion");
  const [stationTag, setStationTag] = useState("Table 14");
  const [headline, setHeadline] = useState("Scan For Digital Menu");
  const [subhead, setSubhead] = useState("Instant mobile access • Zero app download required");
  const [footerNote, setFooterNote] = useState("Complimentary Guest Wi-Fi: Pavilion-Guest (No Password)");

  const [isExportingPng, setIsExportingPng] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const currentTheme =
    COLOR_THEMES.find((t) => t.id === selectedThemeId) || COLOR_THEMES[0];

  // Auto-adjust default headlines when template changes
  const handleTemplateChange = (templateId: CardTemplate) => {
    setSelectedTemplate(templateId);
    switch (templateId) {
      case "kids_playful":
        setHeadline("Scan For Fun Games & Prizes!");
        setSubhead("Camera scan to unlock family activities & coloring books");
        setStationTag("Play Zone #03");
        setSelectedThemeId("gold_luxury");
        break;
      case "tech_software":
        setHeadline("Developer Station Terminal");
        setSubhead("Scan to view API documentation & cloud workspace repository");
        setStationTag("POD-B // DEV-04");
        setSelectedThemeId("midnight_cyber");
        break;
      case "ai_neural":
        setHeadline("AI Assistant & Concierge");
        setSubhead("Scan to launch interactive agent & smart service tools");
        setStationTag("NEURAL NODE #09");
        setSelectedThemeId("electric_ai");
        break;
      case "taxi_transport":
        setHeadline("Direct Cab & Chauffeur Dispatch");
        setSubhead("Scan to request pickup or connect with driver hotline");
        setStationTag("HOTEL LOBBY PICKUP");
        setSelectedThemeId("taxi_yellow");
        break;
      case "barber_salon":
        setHeadline("Styling Portfolio & Bookings");
        setSubhead("Browse VIP cuts, master stylist schedules & appointments");
        setStationTag("CHAIR #02");
        setSelectedThemeId("artisan_linen");
        break;
      case "bistro_cafe":
        setHeadline("Scan For Digital Menu & Specials");
        setSubhead("Point phone camera to browse today's fresh culinary craft");
        setStationTag("Table 14");
        setSelectedThemeId("artisan_linen");
        break;
      case "business_executive":
        setHeadline("Executive Desk & VIP Concierge");
        setSubhead("Scan to access conference agenda & private business suite");
        setStationTag("SUITE 402");
        setSelectedThemeId("swiss_mono");
        break;
      case "minimal_art":
        setHeadline("Gallery Guide & Exhibition Index");
        setSubhead("Audio tour, artist biography & contemporary catalog");
        setStationTag("STATION // 01");
        setSelectedThemeId("swiss_mono");
        break;
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image (PNG, JPG, or SVG)");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setCustomLogoUrl(result);
        setIncludeLogo(true);
        toast.success("Venue logo loaded successfully");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDownloadCardPng = async () => {
    if (!cardRef.current) return;
    setIsExportingPng(true);
    const toastId = toast.loading("Generating 300 DPI high-resolution card PNG...");

    try {
      const { toPng } = await import("html-to-image");

      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 3, // 300 DPI print quality
        quality: 1.0,
        cacheBust: true,
      });

      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `display_card_${selectedTemplate}_${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      toast.success("Card downloaded at print-ready 300 DPI!", { id: toastId });
    } catch (err) {
      console.error("Card PNG export error:", err);
      toast.error("Failed to export card image. Please try again.", { id: toastId });
    } finally {
      setIsExportingPng(false);
    }
  };

  // Render Venue Logo in template header if enabled
  const renderTemplateLogo = (className: string = "h-9 w-9 rounded-lg") => {
    if (!includeLogo || !customLogoUrl) return null;
    return (
      <div className={cn("overflow-hidden flex items-center justify-center shrink-0 shadow-2xs", className)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={customLogoUrl}
          alt="Venue Logo"
          className="max-h-full max-w-full object-contain"
        />
      </div>
    );
  };

  // Render Card Content with Deep Full-Theme Styling
  const renderCardContent = () => {
    const t = currentTheme;

    switch (selectedTemplate) {
      // 1. KIDS & PLAYFUL
      case "kids_playful":
        return (
          <div
            ref={cardRef}
            className="w-[360px] h-[540px] rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden shadow-2xl border-[3px] transition-colors"
            style={{
              backgroundColor: t.bg,
              borderColor: t.cardBorder,
              color: t.titleColor,
            }}
          >
            {/* Header */}
            <div className="flex flex-col items-center text-center">
              {renderTemplateLogo("h-11 w-11 rounded-2xl mb-1.5 border-2 border-white shadow-sm")}
              <h1 className="text-xl font-black tracking-tight" style={{ color: t.titleColor }}>
                {businessName}
              </h1>
              <div
                className="mt-1 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-xs"
                style={{ backgroundColor: t.badgeBg, color: t.badgeText }}
              >
                🎈 {stationTag} 🎈
              </div>
            </div>

            {/* QR Center */}
            <div className="flex flex-col items-center my-auto">
              <div
                className="p-4 rounded-3xl shadow-lg border-[3px] mb-3 flex items-center justify-center"
                style={{ backgroundColor: t.surfaceBg, borderColor: t.surfaceBorder }}
              >
                <div
                  className="w-[170px] h-[170px] flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
                  dangerouslySetInnerHTML={{ __html: qrSvgHtml }}
                />
              </div>

              <h2 className="text-base font-black text-center mt-1" style={{ color: t.titleColor }}>
                {headline}
              </h2>
              <p
                className="text-xs text-center max-w-[270px] mt-1 font-semibold leading-relaxed"
                style={{ color: t.textColor }}
              >
                {subhead}
              </p>
            </div>

            {/* Footer */}
            <div
              className="border-t-[2px] border-dashed pt-3 flex flex-col items-center text-center"
              style={{ borderColor: t.cardBorder }}
            >
              <div className="text-[11px] font-bold" style={{ color: t.footerText }}>
                {footerNote}
              </div>
              <div className="text-[9px] mt-1 font-mono uppercase tracking-widest opacity-80">
                ▲ Fold line for tabletop tent stand ▲
              </div>
            </div>
          </div>
        );

      // 2. TECH & SOFTWARE
      case "tech_software":
        return (
          <div
            ref={cardRef}
            className="w-[360px] h-[540px] rounded-xl p-6 flex flex-col justify-between relative overflow-hidden font-mono shadow-2xl border-2 transition-colors"
            style={{
              backgroundColor: t.bg,
              borderColor: t.cardBorder,
              color: t.titleColor,
            }}
          >
            {/* Header */}
            <div className="border-b pb-3 flex items-center justify-between" style={{ borderColor: t.cardBorder }}>
              <div className="flex items-center gap-2">
                {renderTemplateLogo("h-8 w-8 rounded-md border border-white/20")}
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-widest">
                    &gt;_ DEV_STATION
                  </div>
                  <h1 className="text-sm font-bold truncate max-w-[170px]" style={{ color: t.titleColor }}>
                    {businessName}
                  </h1>
                </div>
              </div>
              <span
                className="text-[10px] px-2 py-0.5 rounded-md font-bold uppercase border"
                style={{ backgroundColor: t.badgeBg, color: t.badgeText, borderColor: t.surfaceBorder }}
              >
                {stationTag}
              </span>
            </div>

            {/* Middle QR */}
            <div className="flex flex-col items-center my-auto">
              <div
                className="p-3 rounded-xl border shadow-lg mb-3 flex items-center justify-center"
                style={{ backgroundColor: t.surfaceBg, borderColor: t.surfaceBorder }}
              >
                <div
                  className="w-[170px] h-[170px] flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
                  dangerouslySetInnerHTML={{ __html: qrSvgHtml }}
                />
              </div>

              <div className="text-center mt-1">
                <span className="text-xs font-bold block" style={{ color: t.titleColor }}>
                  {headline}
                </span>
                <span
                  className="text-[11px] block mt-1 max-w-[270px] leading-relaxed font-sans"
                  style={{ color: t.textColor }}
                >
                  {subhead}
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t pt-3 flex flex-col items-center text-center" style={{ borderColor: t.cardBorder }}>
              <div className="text-[10px] font-mono" style={{ color: t.footerText }}>
                {footerNote}
              </div>
              <div className="text-[8px] text-muted-foreground mt-1 tracking-widest uppercase">
                SECURE AUTHENTICATED ACCESS POINT
              </div>
            </div>
          </div>
        );

      // 3. AI & NEURAL
      case "ai_neural":
        return (
          <div
            ref={cardRef}
            className="w-[360px] h-[540px] rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden shadow-2xl border-2 transition-colors"
            style={{
              backgroundColor: t.bg,
              borderColor: t.cardBorder,
              color: t.titleColor,
            }}
          >
            {/* Header */}
            <div className="flex flex-col items-center text-center">
              {renderTemplateLogo("h-10 w-10 rounded-xl mb-1.5 border border-purple-500/40 shadow-lg")}
              <div
                className="px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-widest uppercase mb-1 border"
                style={{ backgroundColor: t.badgeBg, color: t.badgeText, borderColor: t.accent }}
              >
                ⚡ AI POWERED • SCAN TO ACCESS ⚡
              </div>
              <h1 className="text-lg font-black tracking-tight" style={{ color: t.titleColor }}>
                {businessName}
              </h1>
              <span className="text-xs font-mono" style={{ color: t.textColor }}>
                {stationTag}
              </span>
            </div>

            {/* QR Center */}
            <div className="flex flex-col items-center my-auto">
              <div
                className="p-3.5 rounded-2xl shadow-xl border-2 mb-3 flex items-center justify-center"
                style={{ backgroundColor: t.surfaceBg, borderColor: t.surfaceBorder }}
              >
                <div
                  className="w-[170px] h-[170px] flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
                  dangerouslySetInnerHTML={{ __html: qrSvgHtml }}
                />
              </div>

              <h2 className="text-sm font-bold text-center mt-1" style={{ color: t.titleColor }}>
                {headline}
              </h2>
              <p
                className="text-xs text-center max-w-[270px] mt-1 leading-relaxed font-sans"
                style={{ color: t.textColor }}
              >
                {subhead}
              </p>
            </div>

            {/* Footer */}
            <div className="border-t pt-3 flex flex-col items-center text-center" style={{ borderColor: t.cardBorder }}>
              <div className="text-[10px] font-mono" style={{ color: t.footerText }}>
                {footerNote}
              </div>
              <div className="text-[8px] tracking-widest uppercase opacity-70 mt-1">
                INTELLIGENT AUTONOMOUS ASSISTANT
              </div>
            </div>
          </div>
        );

      // 4. TAXI & TRANSPORT
      case "taxi_transport":
        return (
          <div
            ref={cardRef}
            className="w-[360px] h-[540px] rounded-xl p-6 flex flex-col justify-between relative overflow-hidden shadow-2xl border-[3px] transition-colors"
            style={{
              backgroundColor: t.bg,
              borderColor: t.cardBorder,
              color: t.titleColor,
            }}
          >
            {/* Top Checkerboard pattern */}
            <div className="flex h-3 w-full border-b border-black">
              {Array.from({ length: 18 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1"
                  style={{ backgroundColor: i % 2 === 0 ? "#000000" : "#ffffff" }}
                />
              ))}
            </div>

            {/* Header */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                {renderTemplateLogo("h-9 w-9 rounded-lg border border-black")}
                <div>
                  <h1 className="text-base font-black tracking-tight uppercase" style={{ color: t.titleColor }}>
                    {businessName}
                  </h1>
                  <span className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: t.textColor }}>
                    {stationTag}
                  </span>
                </div>
              </div>
              <div
                className="px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border border-black"
                style={{ backgroundColor: t.badgeBg, color: t.badgeText }}
              >
                🚕 FAST RIDE
              </div>
            </div>

            {/* Middle QR */}
            <div className="flex flex-col items-center my-auto">
              <div
                className="p-3 rounded-xl border-[2px] shadow-lg mb-3 flex items-center justify-center"
                style={{ backgroundColor: t.surfaceBg, borderColor: t.surfaceBorder }}
              >
                <div
                  className="w-[170px] h-[170px] flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
                  dangerouslySetInnerHTML={{ __html: qrSvgHtml }}
                />
              </div>

              <h2 className="text-base font-black text-center uppercase tracking-tight" style={{ color: t.titleColor }}>
                {headline}
              </h2>
              <p
                className="text-xs text-center max-w-[270px] mt-1 font-semibold leading-relaxed"
                style={{ color: t.textColor }}
              >
                {subhead}
              </p>
            </div>

            {/* Bottom Footer with Checkerboard */}
            <div>
              <div className="text-[10px] font-black text-center uppercase mb-2" style={{ color: t.titleColor }}>
                {footerNote}
              </div>
              <div className="flex h-3 w-full border-t border-black">
                {Array.from({ length: 18 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-1"
                    style={{ backgroundColor: i % 2 === 0 ? "#000000" : "#ffffff" }}
                  />
                ))}
              </div>
            </div>
          </div>
        );

      // 5. BARBER & SALON
      case "barber_salon":
        return (
          <div
            ref={cardRef}
            className="w-[360px] h-[540px] rounded-xl p-6 flex flex-col justify-between relative overflow-hidden shadow-2xl border-2 transition-colors"
            style={{
              backgroundColor: t.bg,
              borderColor: t.cardBorder,
              color: t.titleColor,
            }}
          >
            {/* Header */}
            <div className="flex flex-col items-center text-center border-b pb-3" style={{ borderColor: t.cardBorder }}>
              {renderTemplateLogo("h-10 w-10 rounded-full mb-1 border-2 border-amber-600/40 shadow-sm")}
              <span
                className="text-[9px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full mb-1"
                style={{ backgroundColor: t.badgeBg, color: t.badgeText }}
              >
                ✂️ APPOINTMENTS & STYLING ✂️
              </span>
              <h1 className="font-serif text-lg font-bold tracking-wide" style={{ color: t.titleColor }}>
                {businessName}
              </h1>
              <span className="text-[10px] uppercase tracking-widest mt-0.5" style={{ color: t.textColor }}>
                {stationTag}
              </span>
            </div>

            {/* Middle QR */}
            <div className="flex flex-col items-center my-auto">
              <div
                className="p-3.5 rounded-xl border shadow-lg mb-3 flex items-center justify-center"
                style={{ backgroundColor: t.surfaceBg, borderColor: t.surfaceBorder }}
              >
                <div
                  className="w-[170px] h-[170px] flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
                  dangerouslySetInnerHTML={{ __html: qrSvgHtml }}
                />
              </div>

              <h2 className="font-serif text-base font-bold text-center mt-1" style={{ color: t.titleColor }}>
                {headline}
              </h2>
              <p
                className="text-xs text-center max-w-[270px] mt-1 leading-relaxed font-sans"
                style={{ color: t.textColor }}
              >
                {subhead}
              </p>
            </div>

            {/* Footer */}
            <div className="border-t pt-3 flex flex-col items-center text-center" style={{ borderColor: t.cardBorder }}>
              <div className="text-[10px] font-medium" style={{ color: t.footerText }}>
                {footerNote}
              </div>
              <div className="text-[8px] uppercase tracking-widest mt-1 opacity-70">
                MASTER GROOMING & BESPOKE CUTS
              </div>
            </div>
          </div>
        );

      // 6. BISTRO & CAFE
      case "bistro_cafe":
        return (
          <div
            ref={cardRef}
            className="w-[360px] h-[540px] rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden shadow-2xl border-2 transition-colors"
            style={{
              backgroundColor: t.bg,
              borderColor: t.cardBorder,
              color: t.titleColor,
            }}
          >
            {/* Header */}
            <div className="flex flex-col items-center text-center border-b pb-3" style={{ borderColor: t.cardBorder }}>
              {renderTemplateLogo("h-10 w-10 rounded-full mb-1 border shadow-xs")}
              <h1 className="font-serif text-xl font-bold tracking-tight" style={{ color: t.titleColor }}>
                {businessName}
              </h1>
              <span
                className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full mt-1 border"
                style={{ backgroundColor: t.badgeBg, color: t.badgeText, borderColor: t.surfaceBorder }}
              >
                🍽️ {stationTag}
              </span>
            </div>

            {/* QR Container */}
            <div className="flex flex-col items-center my-auto">
              <div
                className="p-4 rounded-2xl shadow-md border mb-3 flex items-center justify-center"
                style={{ backgroundColor: t.surfaceBg, borderColor: t.surfaceBorder }}
              >
                <div
                  className="w-[170px] h-[170px] flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
                  dangerouslySetInnerHTML={{ __html: qrSvgHtml }}
                />
              </div>

              <h2 className="font-serif text-base font-bold text-center mt-1" style={{ color: t.titleColor }}>
                {headline}
              </h2>
              <p
                className="text-xs text-center max-w-[270px] mt-1 leading-relaxed font-sans"
                style={{ color: t.textColor }}
              >
                {subhead}
              </p>
            </div>

            {/* Table Stand Fold Note */}
            <div
              className="border-t border-dashed pt-3 flex flex-col items-center text-center"
              style={{ borderColor: t.cardBorder }}
            >
              <div className="text-[10px] font-medium" style={{ color: t.footerText }}>
                {footerNote}
              </div>
              <div className="text-[9px] mt-1 font-mono uppercase tracking-wider opacity-80">
                ▲ Fold line for tabletop acrylic tent stand ▲
              </div>
            </div>
          </div>
        );

      // 7. BUSINESS & EXECUTIVE
      case "business_executive":
        return (
          <div
            ref={cardRef}
            className="w-[360px] h-[540px] rounded-xl p-7 flex flex-col justify-between relative overflow-hidden shadow-2xl border-2 transition-colors"
            style={{
              backgroundColor: t.bg,
              borderColor: t.cardBorder,
              color: t.titleColor,
            }}
          >
            {/* Header */}
            <div className="flex flex-col items-center text-center border-b pb-3" style={{ borderColor: t.cardBorder }}>
              {renderTemplateLogo("h-9 w-9 rounded-lg mb-1 border shadow-xs")}
              <h1 className="font-serif text-base font-bold tracking-tight" style={{ color: t.titleColor }}>
                {businessName}
              </h1>
              <span className="text-[10px] font-semibold uppercase tracking-widest mt-0.5" style={{ color: t.textColor }}>
                {stationTag}
              </span>
            </div>

            {/* QR Center */}
            <div className="flex flex-col items-center my-auto">
              <div
                className="p-3.5 rounded-lg border shadow-sm mb-3 flex items-center justify-center"
                style={{ backgroundColor: t.surfaceBg, borderColor: t.surfaceBorder }}
              >
                <div
                  className="w-[170px] h-[170px] flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
                  dangerouslySetInnerHTML={{ __html: qrSvgHtml }}
                />
              </div>

              <h2 className="font-serif text-base font-bold text-center mt-1" style={{ color: t.titleColor }}>
                {headline}
              </h2>
              <p
                className="text-xs text-center max-w-[270px] mt-1 leading-relaxed"
                style={{ color: t.textColor }}
              >
                {subhead}
              </p>
            </div>

            {/* Footer */}
            <div className="border-t pt-3 flex flex-col items-center text-center" style={{ borderColor: t.cardBorder }}>
              <div className="text-[10px] font-medium" style={{ color: t.footerText }}>
                {footerNote}
              </div>
              <div className="text-[9px] mt-1 font-serif uppercase tracking-widest opacity-80">
                OFFICIAL DESK & SUITE COMPLIMENTARY ACCESS
              </div>
            </div>
          </div>
        );

      // 8. MINIMALIST ART
      case "minimal_art":
        return (
          <div
            ref={cardRef}
            className="w-[360px] h-[540px] rounded-none p-7 flex flex-col justify-between relative overflow-hidden shadow-2xl border-[3px] transition-colors"
            style={{
              backgroundColor: t.bg,
              borderColor: t.cardBorder,
              color: t.titleColor,
            }}
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b-2 pb-3" style={{ borderColor: t.cardBorder }}>
              <div className="flex items-center gap-2">
                {renderTemplateLogo("h-8 w-8 rounded-none border border-black")}
                <div>
                  <div className="text-[9px] font-mono uppercase tracking-widest opacity-70">
                    EXHIBIT // STATION
                  </div>
                  <div className="font-black text-sm uppercase tracking-tighter" style={{ color: t.titleColor }}>
                    {businessName}
                  </div>
                </div>
              </div>
              <div
                className="font-mono text-xs font-black uppercase border px-2 py-0.5"
                style={{ borderColor: t.cardBorder, backgroundColor: t.badgeBg, color: t.badgeText }}
              >
                {stationTag}
              </div>
            </div>

            {/* QR Center */}
            <div className="flex flex-col items-center my-auto">
              <div
                className="p-2.5 border mb-3 flex items-center justify-center"
                style={{ backgroundColor: t.surfaceBg, borderColor: t.surfaceBorder }}
              >
                <div
                  className="w-[175px] h-[175px] flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
                  dangerouslySetInnerHTML={{ __html: qrSvgHtml }}
                />
              </div>

              <h2 className="text-base font-black uppercase tracking-tight text-center mt-1" style={{ color: t.titleColor }}>
                {headline}
              </h2>
              <p
                className="text-xs text-center max-w-[270px] mt-1 leading-relaxed font-sans opacity-80"
                style={{ color: t.textColor }}
              >
                {subhead}
              </p>
            </div>

            {/* Footer */}
            <div className="border-t-2 pt-3 flex flex-col items-start" style={{ borderColor: t.cardBorder }}>
              <div className="text-[10px] font-mono" style={{ color: t.footerText }}>
                {footerNote}
              </div>
              <div className="text-[8px] font-mono mt-1 uppercase opacity-60">
                INDEX :: GALLERY EDITION • FULLY CUSTOMIZED
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
      <DialogContent className="max-w-5xl max-h-[92vh] flex flex-col p-4 sm:p-6 overflow-hidden">
        {/* Fixed Header */}
        <DialogHeader className="shrink-0 pb-3 border-b border-border/60">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                <LayoutTemplate className="w-5 h-5 text-primary" />
                Creative Display Card Studio
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Choose from 8 industry templates, pick full-card color themes, customize details & logo, and export at 300 DPI.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Modal Body: Left column scrolls, Right preview is stationary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-3 flex-1 min-h-0 overflow-hidden">
          {/* Left Controls Column (Scrolls smoothly) */}
          <div className="lg:col-span-6 overflow-y-auto max-h-[calc(90vh-130px)] pr-2 space-y-4">
            {/* 1. Template Picker */}
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-primary" />
                1. Select Creative Template
              </Label>
              <div className="grid grid-cols-2 gap-1.5 max-h-[175px] overflow-y-auto pr-1">
                {TEMPLATES.map((tmpl) => {
                  const Icon = tmpl.icon;
                  const isSelected = selectedTemplate === tmpl.id;
                  return (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() => handleTemplateChange(tmpl.id)}
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

            {/* 2. Full-Card Color Themes */}
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-primary" />
                2. Full Card Color Theme
              </Label>
              <div className="grid grid-cols-4 gap-2">
                {COLOR_THEMES.map((theme) => {
                  const isSelected = selectedThemeId === theme.id;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setSelectedThemeId(theme.id)}
                      className={cn(
                        "flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all",
                        isSelected
                          ? "border-primary ring-2 ring-primary/30 bg-primary/5 shadow-2xs font-semibold"
                          : "border-border/70 hover:bg-muted/30 text-muted-foreground"
                      )}
                    >
                      <span
                        className="w-5 h-5 rounded-full border shadow-xs mb-1"
                        style={{ backgroundColor: theme.swatch }}
                      />
                      <span className="text-[10px] leading-tight truncate w-full">
                        {theme.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Optional Venue Logo Control */}
            <div className="space-y-2 p-3 rounded-xl border border-border/70 bg-card/40">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-3.5 h-3.5 text-primary" />
                  <Label className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Venue / Brand Logo (Optional)
                  </Label>
                </div>
                <label className="flex items-center gap-1.5 text-xs cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={includeLogo}
                    onChange={(e) => setIncludeLogo(e.target.checked)}
                    className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5"
                  />
                  <span className="text-muted-foreground">Show Logo</span>
                </label>
              </div>

              {includeLogo && (
                <div className="pt-1 space-y-2">
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoUpload}
                  />

                  <div className="flex items-center gap-2">
                    {customLogoUrl ? (
                      <div className="flex items-center gap-2.5 p-2 rounded-lg border border-border bg-background w-full">
                        <div className="h-8 w-8 rounded-md border border-border overflow-hidden flex items-center justify-center shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={customLogoUrl}
                            alt="Logo preview"
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <span className="text-xs font-medium truncate flex-1">
                          Custom Logo Attached
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => logoInputRef.current?.click()}
                          className="h-7 text-xs px-2"
                        >
                          Change
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setCustomLogoUrl(null);
                            setIncludeLogo(false);
                          }}
                          className="h-7 text-xs px-2 text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 w-full">
                        {centerLogo.url && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setCustomLogoUrl(centerLogo.url);
                              setIncludeLogo(true);
                            }}
                            className="text-xs gap-1 h-8 flex-1"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-primary" />
                            Use QR Code Logo
                          </Button>
                        )}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => logoInputRef.current?.click()}
                          className="text-xs gap-1 h-8 flex-1"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          Upload Custom Logo
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 4. Text & Card Details */}
            <div className="space-y-2.5 pt-1">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                3. Card Typography & Station Info
              </Label>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="card-venue" className="text-xs font-medium">
                    Venue / Business Name
                  </Label>
                  <Input
                    id="card-venue"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="card-station" className="text-xs font-medium">
                    Station / Table Tag
                  </Label>
                  <Input
                    id="card-station"
                    value={stationTag}
                    onChange={(e) => setStationTag(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="card-headline" className="text-xs font-medium">
                  Main Headline
                </Label>
                <Input
                  id="card-headline"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="h-8 text-xs"
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
                  className="h-8 text-xs"
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
                  className="h-8 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Right Live Preview Column: Stationary & Non-scrolling on desktop */}
          <div className="lg:col-span-6 flex flex-col items-center justify-between p-4 bg-muted/30 rounded-2xl border border-border/60 shrink-0 select-none overflow-hidden lg:sticky lg:top-0 h-full">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Live Card Preview (300 DPI Aspect)
            </div>

            {/* Live rendered Card Container */}
            <div className="flex-1 flex items-center justify-center p-2 max-w-full overflow-hidden scale-[0.82] sm:scale-[0.88] xl:scale-95 origin-center">
              {renderCardContent()}
            </div>

            {/* Download Action right under preview */}
            <div className="w-full pt-3 border-t border-border/50">
              <Button
                onClick={handleDownloadCardPng}
                disabled={isExportingPng}
                className="w-full gap-2 py-4 font-semibold text-sm shadow-md"
              >
                {isExportingPng ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                Download Card Image (300 DPI PNG)
              </Button>
              <p className="text-[10px] text-center text-muted-foreground mt-1">
                Pixel-perfect 300 DPI print quality • Formatted for acrylic table tents & cardstock
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
