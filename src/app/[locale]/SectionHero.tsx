"use client";

import { Container } from "@/components/Containers";
import { QrContentPanel } from "@/components/QrContentPanel";

export function SectionHero() {
  return (
    <section className="pt-3 pb-1">
      <Container>
        {/* Full-width QR Content Creator spanning the entire studio container */}
        <QrContentPanel />
      </Container>
    </section>
  );
}
