"use client";

import { Badge } from "@/components/ui/badge";
import { LucideScan, Loader2 } from "lucide-react";
import React, { useRef, useState } from "react";
import { useAtom } from "jotai";
import { urlAtom } from "@/lib/states";
import { toast } from "sonner";
import { trackEvent } from "@/components/TrackComponents";
import jsQR from "jsqr";

export function ScanButton(props: { name: string }) {
  const scanRef = useRef<HTMLInputElement>(null);
  const [, setUrl] = useAtom(urlAtom);
  const [isScanning, setIsScanning] = useState(false);

  /**
   * Multi-threshold adaptive binarizer and contrast enhancer for jsQR.
   * Enables decoding of artistic colored QR codes (Gold, Violet, Emerald, Linen)
   * and dark inverted themes (Midnight Cyber).
   */
  const tryDecodeImageData = (
    data: Uint8ClampedArray,
    width: number,
    height: number,
  ): string | null => {
    // Pass 1: Raw native scan
    let result = jsQR(data, width, height, {
      inversionAttempts: "attemptBoth",
    });
    if (result && result.data) return result.data;

    // Pass 2: Multi-threshold adaptive binarization for colored/low-contrast modules
    const thresholds = [130, 160, 190, 220];
    for (const th of thresholds) {
      const bin = new Uint8ClampedArray(data.length);
      for (let i = 0; i < width * height; i++) {
        const idx = i * 4;
        const lum =
          (data[idx] * 299 + data[idx + 1] * 587 + data[idx + 2] * 114) / 1000;
        const v = lum < th ? 0 : 255;
        bin[idx] = v;
        bin[idx + 1] = v;
        bin[idx + 2] = v;
        bin[idx + 3] = 255;
      }
      result = jsQR(bin, width, height, { inversionAttempts: "attemptBoth" });
      if (result && result.data) return result.data;
    }

    // Pass 3: Inverted binarization for dark theme cards & negative QR patterns
    for (const th of thresholds) {
      const bin = new Uint8ClampedArray(data.length);
      for (let i = 0; i < width * height; i++) {
        const idx = i * 4;
        const lum =
          (data[idx] * 299 + data[idx + 1] * 587 + data[idx + 2] * 114) / 1000;
        const v = lum > th ? 0 : 255;
        bin[idx] = v;
        bin[idx + 1] = v;
        bin[idx + 2] = v;
        bin[idx + 3] = 255;
      }
      result = jsQR(bin, width, height, { inversionAttempts: "attemptBoth" });
      if (result && result.data) return result.data;
    }

    return null;
  };

  /**
   * Robust multi-pass client-side QR decoder:
   * 1. SVG text normalization (injects explicit 1200x1200 dimensions if missing)
   * 2. Full image multi-scale scan with adaptive thresholding
   * 3. Table Tent / Display Card center box crop (isolates QR from venue borders & headers)
   * 4. Secondary fallback to Html5Qrcode engine in an 800x800 container
   */
  const decodeQrFromImage = async (file: File): Promise<string | null> => {
    try {
      // 1. Prepare image Data URL with SVG normalization
      let dataUrl: string;
      const isSvg =
        file.type === "image/svg+xml" || file.name.toLowerCase().endsWith(".svg");

      if (isSvg) {
        let svgText = await file.text();
        // Inject explicit width & height if missing so browser Image renders full resolution
        if (!svgText.includes('width="') && !svgText.includes("width='")) {
          svgText = svgText.replace("<svg", '<svg width="1200" height="1200"');
        }
        dataUrl = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgText);
      } else {
        dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }

      if (!dataUrl) return null;

      // 2. Load into HTML Image
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = dataUrl;
      });

      const origW = img.naturalWidth || img.width || 1200;
      const origH = img.naturalHeight || img.height || 1200;

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return null;

      // 3. Define inspection regions: Full Image, Display Card Center, and Tight Center
      const regions = [
        { name: "Full Image", x: 0, y: 0, w: origW, h: origH },
        {
          name: "Card Center Box",
          x: Math.round(origW * 0.15),
          y: Math.round(origH * 0.2),
          w: Math.round(origW * 0.7),
          h: Math.round(origH * 0.55),
        },
        {
          name: "Tight Center Box",
          x: Math.round(origW * 0.2),
          y: Math.round(origH * 0.25),
          w: Math.round(origW * 0.6),
          h: Math.round(origH * 0.5),
        },
      ];

      for (const region of regions) {
        const targetWidths = [region.w, 1024, 800, 600];
        for (const targetW of targetWidths) {
          if (targetW > region.w && targetW !== region.w) continue;
          const scale = targetW / region.w;
          const targetH = Math.round(region.h * scale);

          canvas.width = targetW;
          canvas.height = targetH;
          ctx.clearRect(0, 0, targetW, targetH);
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, targetW, targetH);
          ctx.drawImage(
            img,
            region.x,
            region.y,
            region.w,
            region.h,
            0,
            0,
            targetW,
            targetH,
          );

          const imgData = ctx.getImageData(0, 0, targetW, targetH);
          const decoded = tryDecodeImageData(imgData.data, targetW, targetH);
          if (decoded) return decoded;
        }
      }

      // 4. Fallback to Html5Qrcode engine in properly-sized container
      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        const scanner = new Html5Qrcode("qr-scan-hidden-container");
        const fallbackText = await scanner.scanFile(file, false);
        scanner.clear();
        if (fallbackText) return fallbackText;
      } catch {
        // Silent catch for secondary engine
      }

      return null;
    } catch (err) {
      console.warn("QR Scan decode error:", err);
      return null;
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setIsScanning(true);
    const toastId = toast.loading("Analyzing and scanning QR image...");

    try {
      const decodedText = await decodeQrFromImage(file);

      if (decodedText) {
        setUrl(decodedText);
        toast.success("QR code decoded successfully!", { id: toastId });
        trackEvent("scan_qrcode_success");
      } else {
        toast.error(
          "No readable QR code found. Please ensure the QR is clear and uncropped.",
          { id: toastId },
        );
      }
    } catch (err: unknown) {
      console.warn("QR Scan error:", err);
      toast.error(
        "Could not detect a valid QR code. Please ensure the QR is clearly visible and well-lit.",
        { id: toastId },
      );
    } finally {
      setIsScanning(false);
      if (scanRef.current) {
        scanRef.current.value = "";
      }
    }
  };

  return (
    <>
      {/* Offscreen dedicated container for Html5Qrcode engine (800x800 ensures proper internal canvas sizing) */}
      <div
        id="qr-scan-hidden-container"
        className="fixed -left-[9999px] -top-[9999px] w-[800px] h-[800px] opacity-0 pointer-events-none"
        aria-hidden="true"
      />

      <input
        ref={scanRef}
        id="qr-input-file"
        type="file"
        accept="image/*,.svg"
        className="hidden"
        onChange={handleFileChange}
      />

      <Badge
        onClick={(evt) => {
          evt.preventDefault();
          if (isScanning) return;
          scanRef.current?.click();
          trackEvent("upload_qrcode_button");
        }}
        className="rounded-md hover:bg-accent cursor-pointer transition-colors"
        variant="outline"
      >
        {isScanning ? (
          <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
        ) : (
          <LucideScan className="w-3.5 h-3.5 mr-1" />
        )}
        {isScanning ? "Scanning..." : props.name}
      </Badge>
    </>
  );
}
