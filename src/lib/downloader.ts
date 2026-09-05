import { trackEvent } from "@/components/TrackComponents";
import { CenterLogoConfig } from "./states";

function createDownloadTask(href: string, filename: string) {
  const a = document.createElement("a");
  a.href = href;
  a.target = "download";
  a.download = filename;
  a.hidden = true;
  a.click();
}

export function embedLogoInSvg(
  el: SVGSVGElement,
  logoConfig?: CenterLogoConfig,
): SVGSVGElement {
  const $clone = el.cloneNode(true) as SVGSVGElement;
  if (!logoConfig || !logoConfig.url) return $clone;

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

  if (logoConfig.mask !== "none") {
    const bg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    bg.setAttribute("x", (logoX - logoW * 0.06).toString());
    bg.setAttribute("y", (logoY - logoH * 0.06).toString());
    bg.setAttribute("width", (logoW * 1.12).toString());
    bg.setAttribute("height", (logoH * 1.12).toString());
    bg.setAttribute("fill", logoConfig.maskBg || "#ffffff");
    if (logoConfig.mask === "circle") {
      bg.setAttribute("rx", (logoW * 0.56).toString());
      bg.setAttribute("ry", (logoH * 0.56).toString());
    } else {
      bg.setAttribute("rx", (logoW * 0.22).toString());
      bg.setAttribute("ry", (logoH * 0.22).toString());
    }
    group.appendChild(bg);
  }

  const img = document.createElementNS("http://www.w3.org/2000/svg", "image");
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

export function svgToSvg(
  name: string,
  el: SVGSVGElement,
  logoConfig?: CenterLogoConfig,
) {
  const finalSvg = logoConfig?.url ? embedLogoInSvg(el, logoConfig) : el;
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

export function svgToImage(
  name: string,
  el: SVGSVGElement,
  options?: Partial<SvgToImageOptions>,
  logoConfig?: CenterLogoConfig,
) {
  const { type = "png", width = 2048, height = 2048 } = options || {};
  const finalSvg = logoConfig?.url ? embedLogoInSvg(el, logoConfig) : el;

  const $clone = finalSvg.cloneNode(true) as HTMLElement;
  $clone.setAttribute("width", width.toString());
  $clone.setAttribute("height", height.toString());
  const svgData = new XMLSerializer().serializeToString($clone);

  const canvas = document.createElement("canvas");
  canvas.setAttribute("width", width.toString());
  canvas.setAttribute("height", height.toString());

  const ctx = canvas.getContext("2d");
  const img = document.createElement("img");
  const base64Data =
    typeof window !== "undefined"
      ? btoa(unescape(encodeURIComponent(svgData)))
      : "";
  img.setAttribute("src", "data:image/svg+xml;base64," + base64Data);

  img.onload = () => {
    if (!ctx) {
      return;
    }

    ctx.fillStyle = "white";
    if (type === "jpg") ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);

    const data = canvas.toDataURL(MIME[type], 0.95);
    createDownloadTask(data, `QRcode_${name}_${width}px.${type}`);
  };
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
