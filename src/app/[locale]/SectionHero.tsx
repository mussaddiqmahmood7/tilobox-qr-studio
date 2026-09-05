"use client";

import { useTranslations } from "next-intl";
import {
  Container,
  SplitLeft,
  SplitRight,
  SplitView,
} from "@/components/Containers";
import { QrContentPanel } from "@/components/QrContentPanel";
import { Sparkles, ShieldCheck } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";

export function SectionHero() {
  const t = useTranslations("index.hero");

  return (
    <div className="pt-6 pb-2">
      <Container>
        {/* Sleek Workspace Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <BrandMark className="h-10 w-10 rounded-xl shadow-xs" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                  Tilo<span className="text-primary">Box</span> QR Studio
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full">
                  Agency Studio
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                100% In-Browser Parametric & Artistic QR Generator • Zero Tracking
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1 bg-muted/60 px-2.5 py-1 rounded-lg border border-border/60">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Zero-Env Private</span>
            </div>
            <div className="flex items-center gap-1 bg-muted/60 px-2.5 py-1 rounded-lg border border-border/60">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Vector & 4K Print</span>
            </div>
          </div>
        </div>

        {/* Unified QR Content Creator (URL, WhatsApp, Phone, Wi-Fi, vCard, Text) */}
        <div className="mt-4">
          <SplitView className="gap-y-0">
            <SplitLeft>
              <QrContentPanel />
            </SplitLeft>
            <SplitRight />
          </SplitView>
        </div>
      </Container>
    </div>
  );
}
