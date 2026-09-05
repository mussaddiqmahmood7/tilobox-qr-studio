import { useTranslations } from "next-intl";
import {
  Container,
  SplitLeft,
  SplitRight,
  SplitView,
} from "@/components/Containers";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { cn } from "@/lib/utils";
import { GitHubButton } from "@/components/GitHubButton";
import { Badge } from "@/components/ui/badge";
import { LucideScan } from "lucide-react";
import { ScanButton } from "@/components/ScanButton";
import { Label } from "@/components/ui/label";
import { QrbtfLogo } from "@/components/Logos";
import { useState } from "react";
import { urlAtom } from "@/lib/states";
import { useAtom } from "jotai";
import { UrlInput } from "@/components/hero/UrlInput";
import { HeroLogo } from "@/components/Header";
import { TrackLink } from "@/components/TrackComponents";
import { BusinessPresets } from "@/components/BusinessPresets";

export function SectionHero() {
  const t = useTranslations("index.hero");

  return (
    <div className="_mt-28 _lg: mt-36">
      <Container>
        <div>
          <h1 className="text-4xl lg:text-5xl font-bold hidden">
            {t("title")}
          </h1>

          <HeroLogo />

          <p className="text-base lg:text-lg mt-4 max-w-2xl text-muted-foreground leading-relaxed">
            {t("subtitle")}{" "}
            Generate scannable custom QR codes for digital restaurant menus, barber booking, taxi cards, and guest Wi-Fi. 100% in-browser, free, and privacy-first.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <a
              href="https://tilobox.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="sm" variant="default" className="gap-2">
                <span>TiloBox Ecosystem</span>
                <span className="text-xs bg-primary-foreground/20 px-1.5 py-0.5 rounded">Free</span>
              </Button>
            </a>
            <a
              href="https://github.com/mussaddiqmahmood7/tilobox-qr-studio"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="sm" variant="outline" className="gap-2">
                <GitHubButton />
              </Button>
            </a>
          </div>

          <SplitView className="gap-y-0">
            <SplitLeft>
              <BusinessPresets />
              <div className="mt-5 w-full">
                <Label className="flex justify-between text-sm font-medium mb-1.5">
                  {t("url")}
                  <div className="flex items-center gap-3">
                    {/*<div className="text-sm">*/}
                    {/*  10*/}
                    {/*  <span className="opacity-50">/255</span>*/}
                    {/*</div>*/}
                    <ScanButton name={t("scan")} />
                  </div>
                </Label>
                <UrlInput />
              </div>
            </SplitLeft>
            <SplitRight />
          </SplitView>
        </div>
      </Container>
    </div>
  );
}
