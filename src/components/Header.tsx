"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Github, Menu, ExternalLink, ShieldCheck, Sparkles } from "lucide-react";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="no-print sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="w-full flex justify-center px-6 lg:px-12">
        <nav className="w-full max-w-5xl flex h-16 items-center justify-between gap-4">
          {/* Brand Logo & Studio Identity */}
          <Link
            href="/"
            className="group flex shrink-0 items-center gap-2.5 transition-opacity hover:opacity-90"
            aria-label="TiloBox QR Studio"
          >
            <BrandMark className="h-9 w-9 rounded-xl shadow-xs transition-transform group-hover:scale-105" />
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-foreground">
                Tilo<span className="text-primary">Box</span>
              </span>
              <span className="hidden border-l border-border pl-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:inline">
                QR Studio
              </span>
            </div>
          </Link>

          {/* Desktop Controls (matches my-invoice-app) */}
          <div className="hidden items-center gap-3 sm:flex">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <LocaleSwitcher />
            </div>

            <div className="h-4 w-[1px] bg-border/60" />

            <ThemeSwitcher />

            <a
              href="https://github.com/mussaddiqmahmood7/tilobox-qr-studio"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card/60 text-muted-foreground transition-colors hover:border-primary/40 hover:bg-card hover:text-foreground shadow-2xs"
              aria-label="Star on GitHub"
              title="Star on GitHub"
            >
              <Github className="h-4 w-4" />
            </a>

            <a
              href="https://tilobox.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground border border-primary/20 transition-all px-3 py-2 shadow-2xs"
            >
              <span>tilobox.com</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mobile Controls (Smooth Sheet drawer overlay) */}
          <div className="flex items-center gap-2 sm:hidden">
            <ThemeSwitcher />
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-lg h-9 w-9 text-foreground hover:bg-muted"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[85vw] max-w-sm flex flex-col justify-between p-6"
              >
                <div>
                  <SheetHeader className="mb-6 text-start">
                    <div className="flex items-center gap-2.5">
                      <BrandMark className="h-8 w-8 rounded-lg shadow-xs" />
                      <div>
                        <SheetTitle className="text-base font-black tracking-tight text-foreground">
                          Tilo<span className="text-primary">Box</span> QR Studio
                        </SheetTitle>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          100% In-Browser & Private Studio
                        </p>
                      </div>
                    </div>
                  </SheetHeader>

                  <div className="flex flex-col gap-5 pt-2">
                    {/* Language Setting */}
                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Language
                      </span>
                      <div className="border border-border/80 rounded-xl p-2 bg-card/50">
                        <LocaleSwitcher />
                      </div>
                    </div>

                    {/* Ecosystem Links */}
                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Open Source & Ecosystem
                      </span>
                      <a
                        href="https://github.com/mussaddiqmahmood7/tilobox-qr-studio"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center justify-between rounded-xl border border-border bg-card/60 px-3.5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-card"
                      >
                        <div className="flex items-center gap-2.5">
                          <Github className="h-4 w-4 text-primary" />
                          <span>GitHub Repository</span>
                        </div>
                        <span className="text-xs font-semibold text-primary">⭐ Star</span>
                      </a>

                      <a
                        href="https://tilobox.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center justify-between rounded-xl border border-border bg-card/60 px-3.5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-card"
                      >
                        <div className="flex items-center gap-2.5">
                          <ExternalLink className="h-4 w-4 text-primary" />
                          <span>TiloBox Platform</span>
                        </div>
                        <span className="text-xs text-muted-foreground">Directory</span>
                      </a>
                    </div>

                    {/* Features list */}
                    <div className="pt-2 border-t border-border/60 space-y-2">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>Zero server storage, 100% private</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                        <span>High-res vector SVG & PNG export</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer of Drawer */}
                <div className="pt-6 border-t border-border/60 text-center">
                  <p className="text-[11px] text-muted-foreground">
                    TiloBox Ecosystem • Built with Open-Source Love
                  </p>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </header>
  );
}

export function HeaderPadding() {
  return null;
}
