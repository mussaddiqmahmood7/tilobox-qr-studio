import { SectionHero } from "@/app/[locale]/SectionHero";
import { SectionStyles } from "@/app/[locale]/SectionStyles";
import { StudioGuideSection } from "@/components/StudioGuideSection";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  return (
    <div className="flex-1 flex flex-col">
      <SectionHero />
      <SectionStyles />
      <div className="flex-1">{children}</div>
      <StudioGuideSection />
    </div>
  );
}
