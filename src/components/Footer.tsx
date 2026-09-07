import { BrandMark } from "@/components/BrandMark";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import React from "react";
import { Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="no-print border-t border-border bg-card/30 backdrop-blur-xs mt-12">
      <div className="w-full flex justify-center px-6 lg:px-12">
        <div className="w-full max-w-5xl flex flex-col items-center justify-between gap-4 py-8 text-sm text-muted-foreground sm:flex-row">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
            <a
              href="https://tilobox.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 font-black tracking-tight text-foreground transition-opacity hover:opacity-80"
            >
              <BrandMark className="h-6 w-6 rounded-md shadow-xs transition-transform group-hover:scale-105" />
              <span>
                Tilo<span className="text-primary">Box</span>
              </span>
            </a>
            <span className="hidden text-border sm:inline">•</span>
            <p className="text-center sm:text-start text-xs sm:text-sm">
              Built with open-source love • Based on QRBTF • Maintained & Enhanced by{" "}
              <a
                href="https://tilobox.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground underline underline-offset-4 transition-colors hover:text-primary"
              >
                TiloBox
              </a>
            </p>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm">
            <LocaleSwitcher side="top" />
            <ThemeSwitcher side="top" />
            <a
              href="https://github.com/mussaddiqmahmood7/tilobox-qr-studio"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-medium text-muted-foreground transition-colors hover:text-primary ml-1"
            >
              <Github className="h-3.5 w-3.5" />
              GitHub Repository
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
