"use client";

import React, { useState, useTransition } from "react";
import { useLocale } from "next-intl";
import { useRouter, usePathname, locales } from "@/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, Globe, Loader2 } from "lucide-react";

export interface LanguageOption {
  code: (typeof locales)[number];
  name: string;
  nativeName: string;
  badge: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: "en", name: "English", nativeName: "English", badge: "EN" },
  { code: "zh", name: "Chinese", nativeName: "中文", badge: "ZH" },
  { code: "jp", name: "Japanese", nativeName: "日本語", badge: "JP" },
];

export interface LocaleSwitcherProps {
  variant?: "pill" | "block";
  className?: string;
}

export default function LocaleSwitcher({
  variant = "pill",
  className,
}: LocaleSwitcherProps) {
  const currentLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [pendingLocale, setPendingLocale] = useState<string | null>(null);

  const active =
    LANGUAGES.find((l) => l.code === currentLocale) || LANGUAGES[0];

  const handleLanguageChange = (nextLocale: (typeof locales)[number]) => {
    if (nextLocale === currentLocale) {
      setOpen(false);
      return;
    }

    setPendingLocale(nextLocale);
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
      setOpen(false);
      setPendingLocale(null);
    });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={`Current language: ${active.name}. Click to change language`}
          aria-busy={isPending}
          disabled={isPending}
          className={cn(
            "transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
            variant === "pill"
              ? "inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-card px-2.5 text-sm text-muted-foreground hover:border-primary/60 hover:text-foreground"
              : "flex h-10 w-full items-center justify-between rounded-xl border border-border bg-card/60 px-3.5 text-sm text-foreground hover:border-primary/60 hover:bg-card",
            open && "border-primary/60 text-foreground ring-2 ring-primary/20",
            className,
          )}
        >
          <div className="flex items-center gap-1.5">
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            ) : (
              <Globe className="h-4 w-4" />
            )}
            {variant === "pill" ? (
              <span className="text-xs font-semibold uppercase">
                {pendingLocale ? pendingLocale.toUpperCase() : active.badge}
              </span>
            ) : (
              <span className="text-xs font-semibold">
                {active.nativeName}
              </span>
            )}
          </div>
          {variant === "block" && (
            <span className="text-[11px] font-mono font-semibold uppercase text-muted-foreground">
              {active.badge}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align={variant === "block" ? "center" : "end"}
        className="w-56 border-border bg-card p-1.5 shadow-xl"
      >
        <div className="mb-1 flex items-center justify-between border-b border-border/60 px-2 py-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Languages
          </span>
          <span className="text-[10px] text-muted-foreground">Select</span>
        </div>

        <div className="flex flex-col gap-0.5">
          {LANGUAGES.map((lang) => {
            const isSelected = lang.code === currentLocale;
            const isLoading = lang.code === pendingLocale;

            return (
              <button
                key={lang.code}
                type="button"
                disabled={isPending}
                onClick={() => handleLanguageChange(lang.code)}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-sm transition-colors",
                  isSelected
                    ? "bg-primary/10 font-medium text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  isPending && !isLoading && "opacity-60",
                )}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-6 shrink-0 rounded bg-muted/70 px-1 py-0.5 text-center text-[10px] font-bold uppercase text-muted-foreground">
                    {lang.badge}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-foreground">
                      {lang.nativeName}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {lang.name}
                    </span>
                  </div>
                </div>

                {isLoading ? (
                  <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-primary" />
                ) : (
                  isSelected && (
                    <Check className="h-4 w-4 shrink-0 text-primary" />
                  )
                )}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

