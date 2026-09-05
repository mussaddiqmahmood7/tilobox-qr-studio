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
import { Path, PathValue, useForm, useWatch } from "react-hook-form";
import {
  ParamBooleanControl,
  ParamColorControl,
  ParamImageControl,
  ParamNumberControl,
  ParamPromptControl,
  ParamSelectControl,
  ParamTextControl,
} from "@/components/QrcodeControlParams";
import { HTMLAttributes, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, useCurrentQrcodeType } from "@/lib/utils";
import { LucideDownload } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { StyleTitle } from "@/components/Titles";
import { useAtomValue } from "jotai";
import { urlAtom } from "@/lib/states";
import { downloaderMaps } from "@/lib/downloader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { CommonControlProps, QrbtfModule } from "@/lib/qrbtf_lib/qrcodes/param";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

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

  const { params, defaultPreset } = props;
  const presets = props.qrcodeModule.presets;

  const form = useForm<P>({
    defaultValues: presets[defaultPreset],
  });
  const componentProps = useWatch({ control: form.control }) as P;
  const [preset, setPreset_] = useState(defaultPreset);
  const setPreset = (presetKey: string) => {
    setPreset_(presetKey);
    for (const [key, value] of Object.entries(presets[presetKey])) {
      form.setValue(key as Path<P>, value as PathValue<P, Path<P>>);
    }
  };

  // Download
  const qrcodeWrapperRef = useRef<HTMLDivElement | null>(null);
  const currentQrcodeType = useCurrentQrcodeType();

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
            <div className="_sticky _top-24">
              <StyleTitle
                title={props.title}
                label={props.label}
                subtitle={props.subtitle}
                desc={props.desc}
              />

              <div>
                <Form {...form}>
                  <form className="not-prose _divide-y">
                    {Object.keys(presets).length > 1 && (
                      <div className="_py-1 flex flex-col items-stretch justify-center min-h-[52px]">
                        <Select value={preset} onValueChange={setPreset}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a fruit" />
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
                        className="_py-1 flex flex-col items-stretch justify-center min-h-[52px]"
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
                  className="flex items-center justify-between mb-1.5"
                  htmlFor="output_image"
                >
                  {t("qrcode_output")}
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Badge
                        className={cn(
                          "rounded-md hover:bg-accent cursor-pointer",
                        )}
                        variant="outline"
                      >
                        <LucideDownload className="w-4 h-4 mr-1" />
                        {t("download")}
                      </Badge>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {Object.entries(
                        downloaderMaps[props.qrcodeModule.type] || {},
                      ).map(([type, handler]) => (
                        <DropdownMenuItem
                          key={type}
                          onClick={() => {
                            qrcodeWrapperRef.current &&
                              handler({
                                name: currentQrcodeType,
                                wrapper: qrcodeWrapperRef.current,
                                params: componentProps,
                              });
                          }}
                        >
                          <span className="_font-mono">
                            {type.toLocaleUpperCase()}
                          </span>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </Label>
                <div className="relative border rounded-xl bg-accent/30 w-full overflow-hidden">
                  <AspectRatio ratio={1} />
                  <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
                    {/*<QrCodeIcon className="w-12 h-12 opacity-20" />*/}
                  </div>
                  <div
                    ref={qrcodeWrapperRef}
                    className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center _bg-white"
                  >
                    {props.qrcodeModule.renderer({
                      className: "w-full bg-white",
                      url: url || "https://tilobox.com",
                      ...componentProps,
                    })}
                  </div>
                </div>
              </div>
            </div>
          </SplitRight>
        </SplitView>
      </Container>
    </div>
  );
}
