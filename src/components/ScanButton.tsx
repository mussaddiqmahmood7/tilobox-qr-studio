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
   * Robust multi-pass client-side QR decoder:
   * 1. Native resolution scan with jsQR (supports both light and dark inverted patterns)
   * 2. Scaled scan (optimal 800-1200px range for 2K/4K exports)
   * 3. Center/display-card crop (for detecting QR codes on tent cards & table signage)
   * 4. Secondary fallback to Html5Qrcode engine
   */
  const decodeQrFromImage = async (file: File): Promise<string | null> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const dataUrl = event.target?.result as string;
        if (!dataUrl) {
          resolve(null);
          return;
        }

        const img = new Image();
        img.onload = async () => {
          try {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d", { willReadFrequently: true });
            if (!ctx) {
              resolve(null);
              return;
            }

            const origW = img.naturalWidth || img.width;
            const origH = img.naturalHeight || img.height;

            // Strategy 1: Optimal Resized Scan (prevents blowout on 4K images while keeping detail)
            const targetWidths = [origW, 1024, 800, 600];
            for (const w of targetWidths) {
              if (w > origW && w !== origW) continue;
              const scale = w / origW;
              const h = Math.round(origH * scale);

              canvas.width = w;
              canvas.height = h;
              ctx.clearRect(0, 0, w, h);
              ctx.fillStyle = "#ffffff";
              ctx.fillRect(0, 0, w, h);
              ctx.drawImage(img, 0, 0, w, h);

              const imgData = ctx.getImageData(0, 0, w, h);
              const result = jsQR(imgData.data, w, h, {
                inversionAttempts: "attemptBoth",
              });

              if (result && result.data) {
                resolve(result.data);
                return;
              }
            }

            // Strategy 2: Center Region Crop (specifically for Display Cards / Table Tents)
            // Where the QR code is centered inside a decorative border
            const cropW = Math.round(origW * 0.7);
            const cropH = Math.round(origH * 0.7);
            const cropX = Math.round((origW - cropW) / 2);
            const cropY = Math.round(origH * 0.2); // Slightly higher for cards with header

            canvas.width = cropW;
            canvas.height = cropH;
            ctx.clearRect(0, 0, cropW, cropH);
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, cropW, cropH);
            ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);

            const croppedData = ctx.getImageData(0, 0, cropW, cropH);
            const cropResult = jsQR(croppedData.data, cropW, cropH, {
              inversionAttempts: "attemptBoth",
            });

            if (cropResult && cropResult.data) {
              resolve(cropResult.data);
              return;
            }

            // Strategy 3: Fallback to Html5Qrcode engine without DOM injection
            try {
              const { Html5Qrcode } = await import("html5-qrcode");
              const scanner = new Html5Qrcode("qr-scan-hidden-container");
              const fallbackText = await scanner.scanFile(file, false);
              scanner.clear();
              if (fallbackText) {
                resolve(fallbackText);
                return;
              }
            } catch {
              // Html5Qrcode fallback silent catch
            }

            resolve(null);
          } catch (err) {
            console.warn("Scan decode error:", err);
            resolve(null);
          }
        };

        img.onerror = () => resolve(null);
        img.src = dataUrl;
      };

      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
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
        toast.error("No readable QR code found. Please ensure the QR is clear and uncropped.", { id: toastId });
      }
    } catch (err: unknown) {
      console.warn("QR Scan error:", err);
      toast.error(
        "Could not detect a valid QR code. Please ensure the QR is clearly visible and well-lit.",
        { id: toastId }
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
      {/* Offscreen dedicated container for Html5Qrcode engine (NOT display:none to allow layout calculation) */}
      <div
        id="qr-scan-hidden-container"
        className="fixed -left-[9999px] -top-[9999px] w-[10px] h-[10px] opacity-0 pointer-events-none"
        aria-hidden="true"
      />

      <input
        ref={scanRef}
        id="qr-input-file"
        type="file"
        accept="image/*"
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
