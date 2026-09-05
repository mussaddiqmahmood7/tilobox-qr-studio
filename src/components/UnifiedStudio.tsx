"use client";

import React, { useEffect } from "react";
import { useAtom } from "jotai";
import { activeStyleAtom } from "@/lib/states";
import { useTranslations } from "next-intl";
import { QrcodeGenerator } from "@/components/QrcodeGenerator";

// Style modules & config hooks
import { qrbtfModuleA1, QrbtfRendererA1Props } from "@/lib/qrbtf_lib/qrcodes/a1";
import { useA1Params } from "@/lib/qrbtf_lib/qrcodes/a1_config";

import { qrbtfModuleA2, QrbtfRendererA2Props } from "@/lib/qrbtf_lib/qrcodes/a2";
import { useA2Params } from "@/lib/qrbtf_lib/qrcodes/a2_config";

import { qrbtfModuleSp1, QrbtfRendererSp1Props } from "@/lib/qrbtf_lib/qrcodes/sp1";
import { useSp1Params } from "@/lib/qrbtf_lib/qrcodes/sp1_config";

import { qrbtfModuleC2, QrbtfRendererC2Props } from "@/lib/qrbtf_lib/qrcodes/c2";
import { useC2Params } from "@/lib/qrbtf_lib/qrcodes/c2_config";

interface UnifiedStudioProps {
  initialStyle?: string;
}

export function UnifiedStudio({ initialStyle }: UnifiedStudioProps) {
  const [activeStyle, setActiveStyle] = useAtom(activeStyleAtom);

  const mountedRef = React.useRef(false);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      if (initialStyle) {
        setActiveStyle(initialStyle);
      }
    }
  }, [initialStyle, setActiveStyle]);

  const tA1 = useTranslations("qrcodes.a1");
  const a1Config = useA1Params();

  const tA2 = useTranslations("qrcodes.a2");
  const a2Config = useA2Params();

  const tSp1 = useTranslations("qrcodes.sp1");
  const sp1Config = useSp1Params();

  const tC2 = useTranslations("qrcodes.c2");
  const c2Config = useC2Params();

  if (activeStyle === "a2" || activeStyle === "a2c") {
    return (
      <QrcodeGenerator<QrbtfRendererA2Props>
        key={activeStyle}
        title={tA2("title")}
        subtitle={tA2("subtitle")}
        qrcodeModule={qrbtfModuleA2}
        params={a2Config.params}
        defaultPreset={activeStyle}
      />
    );
  }

  if (activeStyle === "sp1") {
    return (
      <QrcodeGenerator<QrbtfRendererSp1Props>
        key={activeStyle}
        title={tSp1("title")}
        subtitle={tSp1("subtitle")}
        qrcodeModule={qrbtfModuleSp1}
        params={sp1Config.params}
        defaultPreset="sp1"
      />
    );
  }

  if (activeStyle === "c2") {
    return (
      <QrcodeGenerator<QrbtfRendererC2Props>
        key={activeStyle}
        title={tC2("title")}
        subtitle={tC2("subtitle")}
        qrcodeModule={qrbtfModuleC2}
        params={c2Config.params}
        defaultPreset="c2"
      />
    );
  }

  // Default a1, a1c, a1p
  const preset =
    activeStyle === "a1c" || activeStyle === "a1p" ? activeStyle : "a1";

  return (
    <QrcodeGenerator<QrbtfRendererA1Props>
      key={activeStyle}
      title={tA1("title")}
      subtitle={tA1("subtitle")}
      qrcodeModule={qrbtfModuleA1}
      params={a1Config.params}
      defaultPreset={preset}
    />
  );
}

export default UnifiedStudio;
