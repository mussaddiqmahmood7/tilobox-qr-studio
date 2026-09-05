"use client";

import { toast } from "sonner";
import { useTranslations } from "next-intl";
import {
  Container,
  SplitLeft,
  SplitRight,
  SplitView,
} from "@/components/Containers";
import { Form, FormField } from "@/components/ui/form";
import { DefaultValues, Path, PathValue, useForm, useWatch } from "react-hook-form";
import {
  ParamBooleanControl,
  ParamColorControl,
  ParamImageControl,
  ParamNumberControl,
  ParamPromptControl,
  ParamSelectControl,
  ParamTextControl,
} from "@/components/QrcodeControlParams";
import React, { HTMLAttributes, useEffect, useMemo, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, useCurrentQrcodeType } from "@/lib/utils";
import {
  Download,
  FileCode2,
  Image as ImageIcon,
  LayoutTemplate,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { StyleTitle } from "@/components/Titles";
import { useAtom, useAtomValue } from "jotai";
import { centerLogoAtom, sharedCustomizerAtom, urlAtom } from "@/lib/states";
import {
  downloaderMaps,
  svgToSvg,
  svgToImage,
  embedLogoInSvg,
} from "@/lib/downloader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { CommonControlProps, QrbtfModule } from "@/lib/qrbtf_lib/qrcodes/param";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CenterLogoControl } from "@/components/CenterLogoControl";
import { BrandThemePicker } from "@/components/BrandThemePicker";
import { TentCardExportModal } from "@/components/TentCardExportModal";

export interface QrcodeGeneratorProps<P extends {}>
  extends HTMLAttributes<HTMLDivElement> {
  title: string;
  label?: string;
  subtitle: string;
  qrcodeModule: QrbtfModule<P>;
  params: CommonControlProps<P>[];
  defaultPreset: string;
  desc?: string;
}

export function QrcodeGenerator<P extends {}>(props: QrcodeGeneratorProps<P>) {
  const t = useTranslations("index.params");
  const url = useAtomValue(urlAtom);
  const [logoConfig, setLogoConfig] = useAtom(centerLogoAtom);
  const [tentModalOpen, setTentModalOpen] = useState(false);
  const [exportSvgHtml, setExportSvgHtml] = useState<string>("");

  const { params, defaultPreset } = props;
  const presets = props.qrcodeModule.presets;
  const [sharedCustomizer, setSharedCustomizer] = useAtom(sharedCustomizerAtom);

  const initialValues = useMemo(() => {
    const base = { ...presets[defaultPreset] } as Record<string, unknown>;
    if (sharedCustomizer.correctLevel && "correct_level" in base) {
      base.correct_level = sharedCustomizer.correctLevel;
    }
    if (sharedCustomizer.foregroundColor) {
      if ("content_point_color" in base) base.content_point_color = sharedCustomizer.foregroundColor;
      if ("color" in base) base.color = sharedCustomizer.foregroundColor;
    }
    if (sharedCustomizer.positioningColor && "positioning_point_color" in base) {
      base.positioning_point_color = sharedCustomizer.positioningColor;
    }
    return base as unknown as DefaultValues<P>;
  }, [presets, defaultPreset, sharedCustomizer]);

  const form = useForm<P>({
    defaultValues: initialValues,
  });
  const componentProps = useWatch({ control: form.control }) as P;
  const [preset, setPreset_] = useState(defaultPreset);
  const setPreset = (presetKey: string) => {
    setPreset_(presetKey);
    for (const [key, value] of Object.entries(presets[presetKey])) {
      form.setValue(key as Path<P>, value as PathValue<P, Path<P>>);
    }
  };

  // Sync form changes to sharedCustomizerAtom so they carry over when switching styles
  useEffect(() => {
    const subscription = form.watch((value) => {
      const v = value as Record<string, unknown>;
      if (typeof v.correct_level === "string") {
        setSharedCustomizer((prev) => ({ ...prev, correctLevel: v.correct_level as string }));
      }
      const fg = typeof v.content_point_color === "string" ? v.content_point_color : typeof v.color === "string" ? v.color : undefined;
      if (fg) {
        setSharedCustomizer((prev) => ({ ...prev, foregroundColor: fg }));
      }
      if (typeof v.positioning_point_color === "string") {
        setSharedCustomizer((prev) => ({ ...prev, positioningColor: v.positioning_point_color as string }));
      }
    });
    return () => subscription.unsubscribe();
  }, [form, setSharedCustomizer]);

  // High Error Correction Fail-safe: elevate to high when logo is active
  useEffect(() => {
    if (logoConfig.url) {
      const currentEcc = form.getValues(
        "correct_level" as Path<P>,
      ) as string | undefined;
      if (currentEcc === "low" || currentEcc === "medium") {
        form.setValue(
          "correct_level" as Path<P>,
          "high" as PathValue<P, Path<P>>,
        );
      }
    }
  }, [logoConfig.url, form]);

  // Color Theme Application Handler
  const handleApplyTheme = (theme: {
    foreground: string;
    positioning: string;
    background?: string;
  }) => {
    const currentValues = form.getValues() as Record<string, unknown>;
    if ("content_point_color" in currentValues) {
      form.setValue(
        "content_point_color" as Path<P>,
        theme.foreground as PathValue<P, Path<P>>,
      );
    }
    if ("positioning_point_color" in currentValues) {
      form.setValue(
        "positioning_point_color" as Path<P>,
        theme.positioning as PathValue<P, Path<P>>,
      );
    }
    if ("color" in currentValues) {
      form.setValue(
        "color" as Path<P>,
        theme.foreground as PathValue<P, Path<P>>,
      );
    }
    setSharedCustomizer((prev) => ({
      ...prev,
      foregroundColor: theme.foreground,
      positioningColor: theme.positioning,
      backgroundColor: theme.background,
    }));
    toast.success("Brand color theme applied to QR code");
  };

  // Download & Export
  const qrcodeWrapperRef = useRef<HTMLDivElement | null>(null);
  const currentQrcodeType = useCurrentQrcodeType();

  const getSvgElement = (): SVGSVGElement | null => {
    if (!qrcodeWrapperRef.current) return null;
    return (
      (qrcodeWrapperRef.current.querySelector("svg") as SVGSVGElement) ||
      (qrcodeWrapperRef.current.firstChild as SVGSVGElement) ||
      null
    );
  };

  const handleExportSvg = () => {
    const svgEl = getSvgElement();
    if (!svgEl) return;
    svgToSvg(currentQrcodeType, svgEl, logoConfig);
    toast.success("Lossless vector SVG exported");
  };

  const handleExportPng = (width: number) => {
    const svgEl = getSvgElement();
    if (!svgEl) return;
    svgToImage(
      currentQrcodeType,
      svgEl,
      { type: "png", width, height: width },
      logoConfig,
    );
    toast.success(`High-res PNG (${width}px) exported`);
  };

  const handleOpenTentModal = () => {
    const svgEl = getSvgElement();
    if (!svgEl) return;
    const finalSvg = logoConfig.url
      ? embedLogoInSvg(svgEl, logoConfig)
      : (svgEl.cloneNode(true) as SVGSVGElement);
    finalSvg.setAttribute("class", "w-full h-full");
    setExportSvgHtml(finalSvg.outerHTML);
    setTentModalOpen(true);
  };

  const renderControls = (item: CommonControlProps<P>) => {
    return (
      <FormField
        control={form.control}
        name={item.name}
        render={({ field }) => {
          switch (item.type) {
            case "number":
              return <ParamNumberControl<P> field={field} {...item} />;
            case "text":
              return <ParamTextControl<P> field={field} {...item} />;
            case "prompt":
              return <ParamPromptControl<P> field={field} {...item} />;
            case "color":
              return <ParamColorControl<P> field={field} {...item} />;
            case "boolean":
              return <ParamBooleanControl<P> field={field} {...item} />;
            case "select":
              return <ParamSelectControl<P> field={field} {...item} />;
            case "image":
              return <ParamImageControl<P> field={field} {...item} />;
          }
        }}
      />
    );
  };

  return (
    <div>
      <Container>
        <SplitView className="mt-9">
          <SplitLeft>
            <div className="_sticky _top-24 space-y-6">
              <StyleTitle
                title={props.title}
                label={props.label}
                subtitle={props.subtitle}
                desc={props.desc}
              />

              {/* Brand Theme Picker */}
              <BrandThemePicker onApplyTheme={handleApplyTheme} />

              {/* Center Logo Upload Control */}
              <CenterLogoControl />

              {/* Generator Core Parameters */}
              <div className="rounded-xl border border-border/70 bg-card/60 p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-border/50 pb-2">
                  <span className="text-sm font-semibold text-foreground">
                    Style Parameters
                  </span>
                  <span className="text-[11px] text-muted-foreground uppercase font-semibold">
                    Parametric Controls
                  </span>
                </div>

                <Form {...form}>
                  <form className="not-prose space-y-1">
                    {Object.keys(presets).length > 1 && (
                      <div className="py-1 flex flex-col items-stretch justify-center min-h-[52px]">
                        <Select value={preset} onValueChange={setPreset}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select preset" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.keys(presets).map((presetKey) => (
                              <SelectItem key={presetKey} value={presetKey}>
                                {presetKey.toUpperCase()}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    {params.map((param) => (
                      <div
                        key={param.name}
                        className="py-1 flex flex-col items-stretch justify-center min-h-[52px]"
                      >
                        {renderControls(param)}
                      </div>
                    ))}
                  </form>
                </Form>
              </div>
            </div>
          </SplitLeft>

          <SplitRight>
            <div className="sticky top-24">
              <div className="">
                <Label
                  className="flex items-center justify-between mb-2"
                  htmlFor="output_image"
                >
                  <span className="font-semibold text-sm">
                    {t("qrcode_output")}
                  </span>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleOpenTentModal}
                      className="gap-1.5 text-xs font-semibold border-primary/40 hover:border-primary hover:bg-primary/10 text-primary shadow-2xs"
                    >
                      <LayoutTemplate className="w-3.5 h-3.5" />
                      Display Cards
                    </Button>

                    {/* Pro Export Suite Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="sm"
                          className="gap-1.5 font-semibold shadow-xs"
                        >
                          <Download className="w-4 h-4" />
                          Export QR
                          <ChevronDown className="w-3.5 h-3.5 opacity-80" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-60">
                        <DropdownMenuLabel className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                          Lossless Vector
                        </DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={handleExportSvg}
                          className="gap-2 cursor-pointer"
                        >
                          <FileCode2 className="w-4 h-4 text-primary" />
                          <div className="flex flex-col">
                            <span className="font-medium text-xs">Vector SVG (.svg)</span>
                            <span className="text-[10px] text-muted-foreground">
                              Lossless print & laser cutting
                            </span>
                          </div>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuLabel className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                          High-Resolution PNG
                        </DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => handleExportPng(1024)}
                          className="gap-2 cursor-pointer"
                        >
                          <ImageIcon className="w-4 h-4 text-sky-500" />
                          <div className="flex flex-col">
                            <span className="font-medium text-xs">Standard PNG (1024px)</span>
                            <span className="text-[10px] text-muted-foreground">
                              Web & screen sharing
                            </span>
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleExportPng(2048)}
                          className="gap-2 cursor-pointer"
                        >
                          <ImageIcon className="w-4 h-4 text-indigo-500" />
                          <div className="flex flex-col">
                            <span className="font-medium text-xs">2K Ultra PNG (2048px)</span>
                            <span className="text-[10px] text-muted-foreground">
                              Digital menus & flyers
                            </span>
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleExportPng(4096)}
                          className="gap-2 cursor-pointer"
                        >
                          <ImageIcon className="w-4 h-4 text-purple-500" />
                          <div className="flex flex-col">
                            <span className="font-medium text-xs">4K Master PNG (4096px)</span>
                            <span className="text-[10px] text-muted-foreground">
                              Billboards & signage
                            </span>
                          </div>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuLabel className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                          Business Display Cards
                        </DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={handleOpenTentModal}
                          className="gap-2 cursor-pointer bg-primary/5 text-primary focus:bg-primary/10"
                        >
                          <LayoutTemplate className="w-4 h-4 text-primary" />
                          <div className="flex flex-col">
                            <span className="font-semibold text-xs">
                              Creative Display Card Suite
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              Joy, Tech, VIP, Executive & Minimal cards
                            </span>
                          </div>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </Label>

                {/* QR Code Container with Center Logo Live Overlay */}
                <div className="relative border rounded-2xl bg-white shadow-sm w-full overflow-hidden p-4 sm:p-6 flex items-center justify-center">
                  <div className="relative w-full max-w-[400px] aspect-square flex items-center justify-center">
                    <div
                      ref={qrcodeWrapperRef}
                      className="w-full h-full flex items-center justify-center bg-white"
                    >
                      {props.qrcodeModule.renderer({
                        className: "w-full h-full bg-white",
                        url: url || "https://tilobox.com",
                        ...componentProps,
                      })}
                    </div>

                    {/* Live Center Logo Overlay */}
                    {logoConfig.url && (
                      <div
                        className={cn(
                          "absolute pointer-events-none flex items-center justify-center overflow-hidden border shadow-sm transition-all",
                          logoConfig.mask === "circle"
                            ? "rounded-full"
                            : logoConfig.mask === "none"
                            ? "rounded-none border-none shadow-none"
                            : "rounded-xl",
                        )}
                        style={{
                          width: `${logoConfig.size}%`,
                          height: `${logoConfig.size}%`,
                          backgroundColor:
                            logoConfig.mask === "none"
                              ? "transparent"
                              : logoConfig.maskBg || "#ffffff",
                          borderColor:
                            logoConfig.mask === "none"
                              ? "transparent"
                              : "rgba(0,0,0,0.12)",
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={logoConfig.url}
                          alt="Center Logo"
                          className="max-h-full max-w-full object-contain p-1"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Hint */}
                <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground px-1">
                  <span>100% In-Browser Vector Rendering</span>
                  <span className="font-mono text-primary font-semibold">
                    {currentQrcodeType.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </SplitRight>
        </SplitView>
      </Container>

      {/* Printable 4x6 Display Tent Card Modal */}
      <TentCardExportModal
        open={tentModalOpen}
        onOpenChange={setTentModalOpen}
        qrSvgHtml={exportSvgHtml}
      />
    </div>
  );
}
