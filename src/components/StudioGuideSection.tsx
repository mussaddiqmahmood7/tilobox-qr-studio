"use client";

import React from "react";
import { Container } from "@/components/Containers";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Utensils,
  Wifi,
  Contact2,
  Printer,
  ShieldCheck,
  Palette,
  Sparkles,
  HelpCircle,
} from "lucide-react";

export function StudioGuideSection() {
  const features = [
    {
      icon: Utensils,
      title: "Digital Restaurant & Cafe Menus",
      desc: "Place branded, high-contrast QR codes directly on dining tables and bar stands. Enables zero-touch contactless menu viewing with zero lag.",
    },
    {
      icon: Wifi,
      title: "One-Touch Guest Wi-Fi Stand Cards",
      desc: "Generate formatted WPA/WPA2 Wi-Fi QR cards. Guests simply point their phone cameras to connect instantly without typing complex passwords.",
    },
    {
      icon: Contact2,
      title: "Professional vCard 3.0 Contacts",
      desc: "Exchange full contact credentials—name, direct phone, company title, and website—straight into your client's address book.",
    },
    {
      icon: Printer,
      title: "Printable 4x6 Display Tent Cards",
      desc: "Instant cardstock printing with folded tent guidelines, tailored for restaurant tables, salon chairs, and hotel reception desks.",
    },
    {
      icon: Palette,
      title: "Curated Brand Themes & Center Logo",
      desc: "Harmonize QR codes with your visual identity using one-click TiloBox palettes, custom hex colors, and scaled center logo badges.",
    },
    {
      icon: ShieldCheck,
      title: "100% Client-Side & Private",
      desc: "All QR generation and rendering happens inside your browser. No data, URLs, or passwords are ever stored on or transmitted to an external server.",
    },
  ];

  const faqs = [
    {
      q: "Will the generated QR codes ever expire or stop working?",
      a: "No. All QR codes created in TiloBox QR Studio are static. The target URL, Wi-Fi credentials, or vCard details are encoded directly into the geometric pattern itself, so they work forever with zero recurring fees or server dependencies.",
    },
    {
      q: "How does the Center Logo feature protect scannability?",
      a: "QR codes contain built-in Reed-Solomon Error Correction. When you upload a center logo, TiloBox QR Studio automatically forces the Error Correction level to High (Q or H), enabling up to 30% of the QR matrix to be obscured by your logo while retaining fast scan speeds.",
    },
    {
      q: "What is the best format to download for print vs digital?",
      a: "For physical printing, table cards, laser cutting, or large banners, download the Lossless Vector SVG (.svg) or 4K Ultra PNG (4096px). For social media, messaging, and digital display, standard 1024px or 2048px PNG is ideal.",
    },
    {
      q: "How do I print a tabletop stand for my restaurant or counter?",
      a: "Click 'Export Suite' > 'Printable 4x6 Tent Card'. Customize the table number, headline, and theme template. Then either click 'Print 4x6 Card' for standard cardstock printing or 'Download Card (PNG)' to export a 300 DPI image.",
    },
  ];

  return (
    <section className="py-16 border-t border-border/60 bg-muted/20">
      <Container>
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-12 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Built for Modern Businesses & Designers</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            Agency-Grade Parametric QR Codes
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Clean, scannable, and custom-styled QR codes running entirely in your browser with zero required environment variables or external databases.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <Card
                key={idx}
                className="rounded-2xl border border-border/70 bg-card/60 backdrop-blur-xs shadow-2xs hover:shadow-sm transition-all"
              >
                <CardContent className="p-5 space-y-2.5">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-foreground tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {feature.desc}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mb-6 justify-center">
            <HelpCircle className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-bold tracking-tight text-foreground">
              Frequently Asked Questions
            </h3>
          </div>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, idx) => (
              <AccordionItem
                key={idx}
                value={`faq-${idx}`}
                className="border border-border/70 rounded-xl px-4 bg-card/60"
              >
                <AccordionTrigger className="text-sm font-semibold hover:no-underline py-3.5">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-xs sm:text-sm text-muted-foreground pb-4 leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Container>
    </section>
  );
}
