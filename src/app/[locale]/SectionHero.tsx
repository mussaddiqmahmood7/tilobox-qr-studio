"use client";

import {
  Container,
  SplitLeft,
  SplitRight,
  SplitView,
} from "@/components/Containers";
import { QrContentPanel } from "@/components/QrContentPanel";

export function SectionHero() {
  return (
    <section className="pt-3 pb-1">
      <Container>
        {/* Starts immediately at the QR Content Creator with zero wasted vertical space */}
        <SplitView className="gap-y-0">
          <SplitLeft>
            <QrContentPanel />
          </SplitLeft>
          <SplitRight />
        </SplitView>
      </Container>
    </section>
  );
}
