"use client";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { QrCodeIcon } from "@heroicons/react/24/outline";
import { QrStyleItemProps, qrStyleList } from "@/lib/qr_style_list";
import { motion } from "framer-motion";
import { transitionDampingMd } from "@/lib/animations";
import { cn, useCurrentQrcodeType } from "@/lib/utils";
import { Link } from "@/navigation";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { Container } from "@/components/Containers";
import React, { useRef } from "react";
import { useDraggable } from "react-use-draggable-scroll";
import { TrackLink } from "@/components/TrackComponents";
import { useAtom } from "jotai";
import { activeStyleAtom } from "@/lib/states";
import { useLocale } from "next-intl";

export function SectionStylesClient() {
  const t = useTranslations("index.style");
  const [activeStyle, setActiveStyle] = useAtom(activeStyleAtom);
  const locale = useLocale();

  const ref =
    useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;
  const { events } = useDraggable(ref, {
    applyRubberBandEffect: true, // activate rubber band effect
  });

  const handleSelectStyle = (itemId: string, e: React.MouseEvent) => {
    e.preventDefault();
    setActiveStyle(itemId);
    const itemPath = itemId === "a1" ? `/${locale}` : `/${locale}/style/${itemId}`;
    try {
      window.history.replaceState(null, "", itemPath);
    } catch {
      // safe fallback
    }
  };

  const render = (item: QrStyleItemProps, index: number) => {
    const isActive = activeStyle === item.id;
    return (
      <div
        key={"qrcode_style_" + index}
        className={cn(
          "snap-start transition-all cursor-pointer select-none shrink-0",
          isActive ? "scale-[1.02]" : "opacity-75 hover:opacity-100 hover:scale-[1.01]"
        )}
        onClick={(e) => handleSelectStyle(item.id, e)}
      >
        <div className="block">
          <motion.div
            className={cn(
              "relative w-[140px] sm:w-[170px] lg:w-[195px] rounded-2xl bg-accent/30 overflow-hidden shadow-xs",
            )}
            whileTap={{
              scale: 0.95,
              opacity: 0.8,
            }}
            transition={transitionDampingMd}
          >
            <AspectRatio ratio={1} />
            <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-white">
              <QrCodeIcon className="w-8 h-8 opacity-20 text-black" />
            </div>
            <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
              <img
                src={`/assets/qrcodes/${item.image}`}
                alt=""
                className="block w-full h-full bg-white"
              />
            </div>
            <div
              className={cn(
                "absolute top-0 left-0 w-full h-full rounded-2xl",
                isActive ? "ring-[5px] ring-background ring-inset" : "",
              )}
            ></div>
            <div
              className={cn(
                "absolute top-0 left-0 w-full h-full rounded-2xl ring ring-inset",
                isActive
                  ? "ring-2 ring-primary"
                  : "ring-1 ring-border/80 dark:hidden",
              )}
            ></div>
          </motion.div>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-8">
      <Container>
        <div className="flex items-center justify-between mb-3">
          <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
            <span>{t("title")}</span>
            <span className="text-xs font-normal text-muted-foreground hidden sm:inline">
              — {t("subtitle")}
            </span>
          </Label>
          <span className="text-[11px] text-muted-foreground sm:hidden">
            Swipe for styles →
          </span>
        </div>

        <div
          className="w-full overflow-x-auto no-scrollbar snap-x snap-mandatory py-1"
          {...events}
          ref={ref}
        >
          <div className="flex gap-3 min-w-max pb-2">
            {qrStyleList.map((item, index) => render(item, index))}
          </div>
        </div>
      </Container>
    </div>
  );
}
