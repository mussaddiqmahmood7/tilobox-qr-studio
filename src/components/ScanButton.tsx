"use client";

import { Badge } from "@/components/ui/badge";
import { LucideScan, Loader2 } from "lucide-react";
import React, { useRef, useState } from "react";
import { useAtom } from "jotai";
import { urlAtom } from "@/lib/states";
import { toast } from "sonner";
import { trackEvent } from "@/components/TrackComponents";

export function ScanButton(props: { name: string }) {
  const scanRef = useRef<HTMLInputElement>(null);
  const [, setUrl] = useAtom(urlAtom);
  const [isScanning, setIsScanning] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setIsScanning(true);
    const toastId = toast.loading("Analyzing and scanning QR image...");

    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      const scanner = new Html5Qrcode("qr-scan-hidden-container");

      const decodedText = await scanner.scanFile(file, true);
      scanner.clear();

      if (decodedText) {
        setUrl(decodedText);
        toast.success("QR code decoded successfully!", { id: toastId });
        trackEvent("scan_qrcode_success");
      } else {
        toast.error("No readable QR code found in this image.", { id: toastId });
      }
    } catch (err: unknown) {
      console.warn("QR Scan error:", err);
      toast.error(
        "Could not detect a valid QR code. Please ensure the QR is clearly visible, well-lit, and uncropped.",
        { id: toastId }
      );
    } finally {
      setIsScanning(false);
      // Reset input value so re-scanning the same file or retrying triggers change
      if (scanRef.current) {
        scanRef.current.value = "";
      }
    }
  };

  return (
    <>
      {/* Hidden dedicated div container for Html5Qrcode engine */}
      <div id="qr-scan-hidden-container" className="hidden" aria-hidden="true" />

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
