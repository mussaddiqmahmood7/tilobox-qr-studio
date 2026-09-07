"use client";

import React from "react";
import { usePwa } from "@/contexts/PwaContext";
import { Download, RefreshCw, WifiOff } from "lucide-react";

interface PwaStatusBadgeProps {
  variant?: "default" | "drawer";
}

export default function PwaStatusBadge({ variant = "default" }: PwaStatusBadgeProps) {
  const { isOnline, isInstallable, hasUpdate, promptInstall, updateApp } =
    usePwa();

  if (variant === "drawer") {
    return (
      <div className="flex flex-col gap-2">
        {/* Offline notification in drawer */}
        {!isOnline && (
          <div
            role="status"
            className="flex items-center gap-2 rounded-xl bg-amber-500/10 px-3.5 py-2.5 text-xs font-semibold text-amber-600 ring-1 ring-inset ring-amber-500/20 dark:bg-amber-400/10 dark:text-amber-400"
          >
            <WifiOff className="h-4 w-4 animate-pulse text-amber-500 shrink-0" />
            <div>
              <p className="font-bold">Offline Mode Active</p>
              <p className="text-[11px] font-normal opacity-90">
                QR generation runs 100% locally in your browser.
              </p>
            </div>
          </div>
        )}

        {/* Update notification in drawer */}
        {hasUpdate && (
          <button
            type="button"
            onClick={updateApp}
            className="flex items-center justify-between rounded-xl bg-emerald-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 transition-colors"
          >
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Update Ready</span>
            </div>
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
              Reload
            </span>
          </button>
        )}

        {/* Install button in drawer */}
        {isInstallable && (
          <button
            type="button"
            onClick={() => promptInstall()}
            className="flex items-center justify-between rounded-xl border border-primary/30 bg-primary/10 px-3.5 py-2.5 text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground shadow-2xs"
          >
            <div className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              <span>Install TiloBox App</span>
            </div>
            <span className="text-xs font-medium opacity-80">Offline Ready</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {/* 1. Offline Mode Indicator */}
      {!isOnline && (
        <div
          role="status"
          className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-600 ring-1 ring-inset ring-amber-500/20 dark:bg-amber-400/10 dark:text-amber-400"
          title="You are currently working offline. All QR generation runs 100% in your browser."
        >
          <WifiOff className="h-3.5 w-3.5 animate-pulse text-amber-500" />
          <span className="hidden sm:inline">Offline Mode</span>
        </div>
      )}

      {/* 2. New Version Update Prompt */}
      {hasUpdate && (
        <button
          type="button"
          onClick={updateApp}
          className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm hover:bg-emerald-500 transition-colors"
          title="A new version of TiloBox QR Studio is available. Click to refresh."
        >
          <RefreshCw className="h-3 w-3 animate-spin" />
          <span>Update Ready</span>
        </button>
      )}

      {/* 3. PWA Make It Offline / Install Button */}
      {isInstallable && (
        <button
          type="button"
          onClick={() => promptInstall()}
          className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground shadow-2xs"
          title="Install TiloBox QR Studio for full offline access on desktop or mobile"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Install App</span>
        </button>
      )}
    </div>
  );
}
