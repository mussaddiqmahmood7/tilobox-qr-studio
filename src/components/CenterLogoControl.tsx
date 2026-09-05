"use client";

import React, { useRef } from "react";
import { useAtom } from "jotai";
import { centerLogoAtom, CenterLogoConfig } from "@/lib/states";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { UploadCloud, Image as ImageIcon, Trash2, ShieldCheck, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function CenterLogoControl() {
  const [logoConfig, setLogoConfig] = useAtom(centerLogoAtom);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG, SVG, or JPG)");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size should be under 2MB for optimal performance");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setLogoConfig((prev) => ({
          ...prev,
          url: dataUrl,
        }));
        toast.success("Center logo loaded with auto error-correction boost");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleUseTiloBoxEmblem = () => {
    setLogoConfig((prev) => ({
      ...prev,
      url: "/icon.svg",
      mask: "rounded",
      size: 18,
    }));
    toast.success("TiloBox official emblem set as center logo");
  };

  const handleClear = () => {
    setLogoConfig((prev) => ({
      ...prev,
      url: null,
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    toast.info("Center logo removed");
  };

  return (
    <div className="rounded-xl border border-border/70 bg-card/60 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-primary" />
          <Label className="text-sm font-semibold">Center Logo & Watermark</Label>
        </div>
        {logoConfig.url && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="h-7 text-xs text-destructive hover:bg-destructive/10 px-2 gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Remove
          </Button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/svg+xml, image/webp"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
      />

      {!logoConfig.url ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/60 hover:bg-accent/20 transition-all text-center group"
        >
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform mb-2">
            <UploadCloud className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-foreground">
            Click to upload logo or drag & drop
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            PNG, SVG, or JPG (max 2MB)
          </p>
          <div className="mt-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleUseTiloBoxEmblem();
              }}
              className="h-7 text-[11px] gap-1 rounded-full border-primary/30 text-primary hover:bg-primary/10"
            >
              <Sparkles className="w-3 h-3" />
              Use TiloBox Emblem
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Logo preview thumbnail */}
          <div className="flex items-center gap-3 p-2.5 rounded-lg border border-border bg-background">
            <div
              className={cn(
                "relative h-12 w-12 flex items-center justify-center overflow-hidden border shadow-xs shrink-0",
                logoConfig.mask === "circle" ? "rounded-full" : "rounded-lg"
              )}
              style={{ backgroundColor: logoConfig.maskBg }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoConfig.url}
                alt="Center Logo Preview"
                className="max-h-full max-w-full object-contain p-1"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">
                Active Logo Attached
              </p>
              <p className="text-[11px] text-muted-foreground">
                Embedded directly into vector & PNG export
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="h-7 text-xs"
            >
              Change
            </Button>
          </div>

          {/* Size slider: 10% to 25% */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-foreground">Logo Size Ratio</span>
              <span className="text-muted-foreground font-mono">{logoConfig.size}%</span>
            </div>
            <Slider
              min={10}
              max={25}
              step={1}
              value={[logoConfig.size]}
              onValueChange={(val) =>
                setLogoConfig((prev) => ({ ...prev, size: val[0] || 18 }))
              }
            />
            <p className="text-[10px] text-muted-foreground">
              Capped at 25% to ensure QR code data dots remain 100% scannable.
            </p>
          </div>

          {/* Mask type buttons */}
          <div className="space-y-1.5">
            <span className="text-xs font-medium text-foreground block">
              Protective Mask Shape
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {(
                [
                  { id: "rounded", label: "Rounded" },
                  { id: "circle", label: "Circular" },
                  { id: "none", label: "Transparent" },
                ] as const
              ).map((maskOption) => (
                <button
                  key={maskOption.id}
                  type="button"
                  onClick={() =>
                    setLogoConfig((prev) => ({ ...prev, mask: maskOption.id }))
                  }
                  className={cn(
                    "px-2 py-1.5 text-xs rounded-lg border font-medium transition-all text-center",
                    logoConfig.mask === maskOption.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:bg-accent/40"
                  )}
                >
                  {maskOption.label}
                </button>
              ))}
            </div>
          </div>

          {/* High Error Correction Notice */}
          <div className="flex items-start gap-2 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[11px]">
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
            <span>
              High Error Correction (Q/H) active: Redundant data points protect 30% of code area so center logo never breaks scanning.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
