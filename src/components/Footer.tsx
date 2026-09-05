import { Container } from "@/components/Containers";
import { BrandMark } from "@/components/BrandMark";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import React from "react";
import { Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="no-print border-t border-border bg-card/30 backdrop-blur-xs mt-16 py-10">
      <Container>
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
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
            <p className="text-center sm:text-start text-xs sm:text-sm text-muted-foreground">
              Powered by open-source QRBTF parametric algorithms • Enhanced, Maintained & Customized by{" "}
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

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm text-muted-foreground">
            <LocaleSwitcher />
            <ThemeSwitcher />
            <a
              href="https://github.com/mussaddiqmahmood7/tilobox-qr-studio"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-medium transition-colors hover:text-primary"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
            <a
              href="https://tilobox.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium transition-colors hover:text-primary"
            >
              TiloBox Directory
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
