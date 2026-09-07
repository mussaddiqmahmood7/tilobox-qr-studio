"use client";

import React, { useRef, useState } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { QrCodeIcon } from "@heroicons/react/24/outline";
import { QrStyleItemProps, qrStyleList } from "@/lib/qr_style_list";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { useTranslations, useLocale } from "next-intl";
import { Container } from "@/components/Containers";
import { useAtom } from "jotai";
import { activeStyleAtom } from "@/lib/states";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";

export function SectionStylesClient() {
  const t = useTranslations("index.style");
  const [activeStyle, setActiveStyle] = useAtom(activeStyleAtom);
  const locale = useLocale();
  const [api, setApi] = useState<CarouselApi>();

  // Pointer position tracker to distinguish deliberate clicks from drags/swipes
  const pointerStartRef = useRef<{ x: number; y: number; time: number } | null>(
    null,
  );

  const handlePointerDown = (e: React.PointerEvent) => {
    pointerStartRef.current = { x: e.clientX, y: e.clientY, time: Date.now() };
  };

  const handleSelectStyle = (itemId: string) => {
    setActiveStyle(itemId);
    const itemPath =
      itemId === "a1" ? `/${locale}` : `/${locale}/style/${itemId}`;
    try {
      window.history.replaceState(null, "", itemPath);
    } catch {
      // safe fallback
    }
  };

  const handleItemClick = (itemId: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (pointerStartRef.current) {
      const dx = Math.abs(e.clientX - pointerStartRef.current.x);
      const dy = Math.abs(e.clientY - pointerStartRef.current.y);
      // If pointer moved more than 6px, treat as a drag/swipe gesture — do not switch styles
      if (dx > 6 || dy > 6) {
        return;
      }
    }
    handleSelectStyle(itemId);
  };

  // Convert vertical mouse-wheel into horizontal carousel step
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!api) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && Math.abs(e.deltaY) > 20) {
      if (e.deltaY > 0) {
        api.scrollNext();
      } else {
        api.scrollPrev();
      }
    }
  };

  const render = (item: QrStyleItemProps, index: number) => {
    const isActive = activeStyle === item.id;
    return (
      <CarouselItem
        key={"qrcode_style_" + index}
        className="pl-2.5 basis-auto"
      >
        <div
          className={cn(
            "transition-all cursor-pointer select-none shrink-0 group",
            isActive
              ? "scale-[1.02]"
              : "opacity-80 hover:opacity-100 hover:scale-[1.01]",
          )}
          onPointerDown={handlePointerDown}
          onClick={(e) => handleItemClick(item.id, e)}
          role="button"
          tabIndex={0}
          aria-label={`Select QR style: ${item.id.toUpperCase()}`}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleSelectStyle(item.id);
            }
          }}
        >
          <div className="relative w-[125px] sm:w-[150px] lg:w-[170px] rounded-xl bg-accent/30 overflow-hidden shadow-2xs select-none">
            <AspectRatio ratio={1} />
            <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-white pointer-events-none select-none">
              <QrCodeIcon className="w-8 h-8 opacity-20 text-black pointer-events-none" />
            </div>
            <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center pointer-events-none select-none">
              <img
                src={`/assets/qrcodes/${item.image}`}
                alt={`QR Style ${item.id.toUpperCase()}`}
                draggable={false}
                className="block w-full h-full bg-white select-none pointer-events-none"
              />
            </div>
            <div
              className={cn(
                "absolute top-0 left-0 w-full h-full rounded-xl pointer-events-none transition-all",
                isActive ? "ring-[4px] ring-background ring-inset" : "",
              )}
            />
            <div
              className={cn(
                "absolute top-0 left-0 w-full h-full rounded-xl ring ring-inset pointer-events-none transition-all",
                isActive
                  ? "ring-2 ring-primary"
                  : "ring-1 ring-border/80 dark:hidden",
              )}
            />
          </div>
        </div>
      </CarouselItem>
    );
  };

  return (
    <div className="mt-3">
      <Container>
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            dragFree: true,
            containScroll: "trimSnaps",
          }}
          className="w-full relative"
          onWheel={handleWheel}
        >
          {/* Header Row with Title and Navigation Controls */}
          <div className="flex items-center justify-between mb-2">
            <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5 select-none">
              <span>{t("title")}</span>
              <span className="text-[11px] font-normal text-muted-foreground hidden sm:inline">
                — {t("subtitle")}
              </span>
            </Label>

            <div className="flex items-center gap-2 select-none">
              <span className="text-[10px] text-muted-foreground sm:hidden">
                Swipe for styles →
              </span>
              <div className="hidden sm:flex items-center gap-1.5">
                <CarouselPrevious className="static translate-y-0 h-7 w-7 rounded-full border border-border bg-card/80 text-muted-foreground hover:border-primary/40 hover:text-foreground shadow-2xs disabled:opacity-30 cursor-pointer" />
                <CarouselNext className="static translate-y-0 h-7 w-7 rounded-full border border-border bg-card/80 text-muted-foreground hover:border-primary/40 hover:text-foreground shadow-2xs disabled:opacity-30 cursor-pointer" />
              </div>
            </div>
          </div>

          {/* Embla Carousel Viewport */}
          <CarouselContent className="-ml-2.5 py-1 select-none">
            {qrStyleList.map((item, index) => render(item, index))}
          </CarouselContent>
        </Carousel>
      </Container>
    </div>
  );
}
