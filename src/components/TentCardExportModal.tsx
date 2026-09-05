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
import { Printer, Sparkles, X } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";

interface TentCardExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  qrSvgHtml: string;
}

export function TentCardExportModal({
  open,
  onOpenChange,
  qrSvgHtml,
}: TentCardExportModalProps) {
  const [headline, setHeadline] = useState("Scan to Order & Connect");
  const [subhead, setSubhead] = useState("Point your smartphone camera to connect instantly");
  const [businessName, setBusinessName] = useState("TiloBox Guest Suite • Table 5");
  const [footerNote, setFooterNote] = useState("Free Guest Access • 100% In-Browser & Private");

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="no-print">
          <DialogTitle className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-primary" />
            Printable 4x6 Display Tent Card
          </DialogTitle>
          <DialogDescription>
            Print-ready table stand card for restaurants, barber counters, taxi stands, and reception desks.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-2">
          {/* Customization controls */}
          <div className="space-y-3.5 no-print">
            <div className="space-y-1.5">
              <Label htmlFor="tent-title" className="text-xs">Main Headline</Label>
              <Input
                id="tent-title"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Scan to Order & Connect"
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="tent-sub" className="text-xs">Subheading</Label>
              <Input
                id="tent-sub"
                value={subhead}
                onChange={(e) => setSubhead(e.target.value)}
                placeholder="Point your smartphone camera"
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="tent-business" className="text-xs">Business / Station</Label>
              <Input
                id="tent-business"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Table 12 • Salon Chair 3"
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="tent-footer" className="text-xs">Footer Note</Label>
              <Input
                id="tent-footer"
                value={footerNote}
                onChange={(e) => setFooterNote(e.target.value)}
                placeholder="Free Access • No App Required"
                className="text-xs"
              />
            </div>

            <div className="pt-2">
              <Button
                type="button"
                onClick={handlePrint}
                className="w-full gap-2 shadow-sm font-semibold"
              >
                <Printer className="w-4 h-4" />
                Print 4x6 Card (Cardstock)
              </Button>
              <p className="text-[11px] text-muted-foreground mt-1.5 text-center">
                Uses standard 4" x 6" photo or cardstock print dimensions.
              </p>
            </div>
          </div>

          {/* 4x6 Tent Card Canvas Preview */}
          <div className="flex flex-col items-center justify-center bg-muted/40 p-4 rounded-xl border">
            <div
              id="tent-card-print-target"
              className="w-[260px] sm:w-[280px] aspect-[4/6] bg-white text-slate-900 rounded-xl shadow-lg border border-slate-200 p-6 flex flex-col justify-between items-center text-center relative overflow-hidden"
            >
              {/* Header Branding */}
              <div className="w-full flex items-center justify-center gap-2 pt-1">
                <BrandMark className="h-6 w-6 rounded-md shadow-2xs" />
                <span className="text-xs font-black tracking-tight text-slate-900 uppercase">
                  Tilo<span className="text-[#0B5FA5]">Box</span> Studio
                </span>
              </div>

              {/* Title & Badge */}
              <div className="my-auto space-y-1">
                <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#0B5FA5] bg-[#0B5FA5]/10 px-2 py-0.5 rounded-full">
                  {businessName}
                </span>
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight leading-snug">
                  {headline}
                </h3>
                <p className="text-[11px] text-slate-500 leading-tight">
                  {subhead}
                </p>
              </div>

              {/* QR Code Container */}
              <div
                className="w-44 h-44 my-2 flex items-center justify-center bg-white p-2 rounded-xl border border-slate-100 shadow-sm"
                dangerouslySetInnerHTML={{ __html: qrSvgHtml }}
              />

              {/* Bottom Footer & Fold line */}
              <div className="w-full pt-2 border-t border-slate-100 text-center space-y-0.5">
                <p className="text-[10px] font-medium text-slate-600">
                  {footerNote}
                </p>
                <div className="flex items-center justify-center gap-1 text-[9px] text-slate-400">
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
