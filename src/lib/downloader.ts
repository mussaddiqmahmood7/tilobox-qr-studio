import { trackEvent } from "@/components/TrackComponents";
import { CenterLogoConfig } from "./states";

function createDownloadTask(href: string, filename: string) {
  const a = document.createElement("a");
  a.href = href;
  a.target = "download";
  a.download = filename;
  a.hidden = true;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/**
 * Converts any URL (local or remote) to a base64 data URL
 */
async function toDataUrl(url: string): Promise<string> {
  if (url.startsWith("data:")) return url;
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(url);
      reader.readAsDataURL(blob);
    });
  } catch {
    return url;
  }
}

export function embedLogoInSvg(
  el: SVGSVGElement,
  logoConfig?: CenterLogoConfig,
): SVGSVGElement {
  const $clone = el.cloneNode(true) as SVGSVGElement;
  if (!logoConfig || !logoConfig.url) return $clone;

  $clone.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");

  const viewBox = $clone.getAttribute("viewBox");
  let vx = 0,
    vy = 0,
    vw = 100,
    vh = 100;
  if (viewBox) {
    const parts = viewBox.trim().split(/\s+/).map(Number);
    if (parts.length === 4 && !parts.some(isNaN)) {
      [vx, vy, vw, vh] = parts;
    }
  }

  const cx = vx + vw / 2;
  const cy = vy + vh / 2;
  const logoW = (vw * logoConfig.size) / 100;
  const logoH = (vh * logoConfig.size) / 100;
  const logoX = cx - logoW / 2;
  const logoY = cy - logoH / 2;

  const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
  group.setAttribute("id", "tilobox-center-logo");

  // Clean protective cushion background (guarantees QR data modules behind logo do not bleed through)
  const bg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  bg.setAttribute("x", (logoX - logoW * 0.08).toString());
  bg.setAttribute("y", (logoY - logoH * 0.08).toString());
  bg.setAttribute("width", (logoW * 1.16).toString());
  bg.setAttribute("height", (logoH * 1.16).toString());
  bg.setAttribute("fill", logoConfig.maskBg || "#ffffff");
  if (logoConfig.mask === "circle") {
    bg.setAttribute("rx", (logoW * 0.58).toString());
    bg.setAttribute("ry", (logoH * 0.58).toString());
  } else {
    bg.setAttribute("rx", (logoW * 0.22).toString());
    bg.setAttribute("ry", (logoH * 0.22).toString());
  }
  group.appendChild(bg);

  const img = document.createElementNS("http://www.w3.org/2000/svg", "image");
  img.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", logoConfig.url);
  img.setAttribute("href", logoConfig.url);
  img.setAttribute("x", logoX.toString());
  img.setAttribute("y", logoY.toString());
  img.setAttribute("width", logoW.toString());
  img.setAttribute("height", logoH.toString());
  img.setAttribute("preserveAspectRatio", "xMidYMid meet");
  group.appendChild(img);

  $clone.appendChild(group);
  return $clone;
}

export async function svgToSvg(
  name: string,
  el: SVGSVGElement,
  logoConfig?: CenterLogoConfig,
) {
  let resolvedConfig = logoConfig;
  if (logoConfig?.url && !logoConfig.url.startsWith("data:")) {
    const inlinedUrl = await toDataUrl(logoConfig.url);
    resolvedConfig = { ...logoConfig, url: inlinedUrl };
  }

  const finalSvg = resolvedConfig?.url ? embedLogoInSvg(el, resolvedConfig) : el;
  const svgHead =
    '<?xml version="1.0" encoding="utf-8"?>\n ' +
    '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 20010904//EN" "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">\n';
  const htmlContent = [svgHead + finalSvg.outerHTML];
  const bl = new Blob(htmlContent, { type: "image/svg+xml" });
  createDownloadTask(URL.createObjectURL(bl), `qrcode_${name}.svg`);
}

const MIME = { jpg: "image/jpeg", png: "image/png" };
export interface SvgToImageOptions {
  type: keyof typeof MIME;
  width: number;
  height: number;
}

/**
 * High-resolution canvas rendering with direct logo compositing.
 * Bypasses browser SVG sandboxing issues by drawing the center logo directly
 * onto the 2D Canvas context.
 */
export function svgToImage(
  name: string,
  el: SVGSVGElement,
  options?: Partial<SvgToImageOptions>,
  logoConfig?: CenterLogoConfig,
) {
  const { type = "png", width = 2048, height = 2048 } = options || {};

  // Clone SVG for rendering base QR pattern
  const $clone = el.cloneNode(true) as SVGSVGElement;
  $clone.setAttribute("width", width.toString());
  $clone.setAttribute("height", height.toString());
  const svgData = new XMLSerializer().serializeToString($clone);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const qrImg = new Image();
  const base64Data =
    typeof window !== "undefined"
      ? btoa(unescape(encodeURIComponent(svgData)))
      : "";
  qrImg.src = "data:image/svg+xml;base64," + base64Data;

  qrImg.onload = () => {
    // Fill background
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, width, height);

    // Draw base QR code
    ctx.drawImage(qrImg, 0, 0, width, height);

    // If center logo is configured, composite it directly on canvas
    if (logoConfig && logoConfig.url) {
      const logoImg = new Image();
      logoImg.crossOrigin = "anonymous";
      logoImg.onload = () => {
        compositeLogoOnCanvas(ctx, logoImg, width, height, logoConfig);
        finalizeDownload(canvas, name, width, type);
      };
      logoImg.onerror = () => {
        // Fallback: download base QR if logo fails to load
        finalizeDownload(canvas, name, width, type);
      };
      logoImg.src = logoConfig.url;
    } else {
      finalizeDownload(canvas, name, width, type);
    }
  };
}

function compositeLogoOnCanvas(
  ctx: CanvasRenderingContext2D,
  logoImg: HTMLImageElement,
  width: number,
  height: number,
  logoConfig: CenterLogoConfig,
) {
  const cx = width / 2;
  const cy = height / 2;
  const logoW = (width * logoConfig.size) / 100;
  const logoH = (height * logoConfig.size) / 100;
  const logoX = cx - logoW / 2;
  const logoY = cy - logoH / 2;

  // 1. Draw Protective Mask / Cushion Background
  ctx.save();
  ctx.fillStyle = logoConfig.maskBg || "#ffffff";
  const maskW = logoW * 1.16;
  const maskH = logoH * 1.16;
  const maskX = cx - maskW / 2;
  const maskY = cy - maskH / 2;

  if (logoConfig.mask === "circle") {
    ctx.beginPath();
    ctx.arc(cx, cy, maskW / 2, 0, Math.PI * 2);
    ctx.fill();
  } else {
    const radius = maskW * 0.22;
    ctx.beginPath();
    if (typeof ctx.roundRect === "function") {
      ctx.roundRect(maskX, maskY, maskW, maskH, radius);
    } else {
      ctx.rect(maskX, maskY, maskW, maskH);
    }
    ctx.fill();
  }
  ctx.restore();

  // 2. Draw Logo with proper mask clipping & aspect ratio
  ctx.save();
  if (logoConfig.mask === "circle") {
    ctx.beginPath();
    ctx.arc(cx, cy, logoW / 2, 0, Math.PI * 2);
    ctx.clip();
  } else if (logoConfig.mask === "rounded") {
    const radius = logoW * 0.18;
    ctx.beginPath();
    if (typeof ctx.roundRect === "function") {
      ctx.roundRect(logoX, logoY, logoW, logoH, radius);
    } else {
      ctx.rect(logoX, logoY, logoW, logoH);
    }
    ctx.clip();
  }

  // Maintain image aspect ratio
  const naturalW = logoImg.naturalWidth || 1;
  const naturalH = logoImg.naturalHeight || 1;
  const aspect = naturalW / naturalH;
  let drawW = logoW;
  let drawH = logoH;
  if (aspect > 1) {
    drawH = logoW / aspect;
  } else {
    drawW = logoH * aspect;
  }
  const drawX = cx - drawW / 2;
  const drawY = cy - drawH / 2;

  ctx.drawImage(logoImg, drawX, drawY, drawW, drawH);
  ctx.restore();
}

function finalizeDownload(
  canvas: HTMLCanvasElement,
  name: string,
  width: number,
  type: keyof typeof MIME,
) {
  const data = canvas.toDataURL(MIME[type], 0.95);
  createDownloadTask(data, `QRcode_${name}_${width}px.${type}`);
}

export type Downloader = (options: {
  name: string;
  wrapper: HTMLElement;
  params: any;
  logoConfig?: CenterLogoConfig;
}) => void;

function withReport(
  downloaders: Record<string, Downloader>,
): Record<string, Downloader> {
  for (const type in downloaders) {
    const origin = downloaders[type];
    downloaders[type] = (options) => {
      try {
        const { name, params } = options;
        const dataToReport = {
          type: name,
          ...params,
        };
        trackEvent("download_qrcode", dataToReport);
      } catch {
        // silent client-side fallback
      }
      origin(options);
    };
  }
  return downloaders;
}

const SvgQrcodeDownloaders: Record<string, Downloader> = withReport({
  svg: ({ name, wrapper, logoConfig }) => {
    const svgEl =
      (wrapper.querySelector("svg") as SVGSVGElement) ||
      (wrapper.firstChild as SVGSVGElement);
    if (svgEl) svgToSvg(name, svgEl, logoConfig);
  },
  png_1024: ({ name, wrapper, logoConfig }) => {
    const svgEl =
      (wrapper.querySelector("svg") as SVGSVGElement) ||
      (wrapper.firstChild as SVGSVGElement);
    if (svgEl)
      svgToImage(name, svgEl, { type: "png", width: 1024, height: 1024 }, logoConfig);
  },
  png_2048: ({ name, wrapper, logoConfig }) => {
    const svgEl =
      (wrapper.querySelector("svg") as SVGSVGElement) ||
      (wrapper.firstChild as SVGSVGElement);
    if (svgEl)
      svgToImage(name, svgEl, { type: "png", width: 2048, height: 2048 }, logoConfig);
  },
  png_4096: ({ name, wrapper, logoConfig }) => {
    const svgEl =
      (wrapper.querySelector("svg") as SVGSVGElement) ||
      (wrapper.firstChild as SVGSVGElement);
    if (svgEl)
      svgToImage(name, svgEl, { type: "png", width: 4096, height: 4096 }, logoConfig);
  },
  jpg: ({ name, wrapper, logoConfig }) => {
    const svgEl =
      (wrapper.querySelector("svg") as SVGSVGElement) ||
      (wrapper.firstChild as SVGSVGElement);
    if (svgEl)
      svgToImage(name, svgEl, { type: "jpg", width: 2048, height: 2048 }, logoConfig);
  },
});

export const downloaderMaps: Record<string, Record<string, Downloader>> = {
  svg_renderer: SvgQrcodeDownloaders,
};
