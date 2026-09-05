import { trackEvent } from "@/components/TrackComponents";

function createDownloadTask(href: string, filename: string) {
  const a = document.createElement("a");
  a.href = href;
  a.target = "download";
  a.download = filename;
  a.hidden = true;
  a.click();
}

function svgToSvg(name: string, el: SVGSVGElement) {
  const svgHead =
    '<?xml version="1.0" encoding="utf-8"?>\n ' +
    '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 20010904//EN" "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">\n';
  let htmlContent = [svgHead + el.outerHTML];
  let bl = new Blob(htmlContent, { type: "image/svg+xml" });
  createDownloadTask(URL.createObjectURL(bl), `qrcode_${name}.svg`);
}

const MIME = { jpg: "image/jpeg", png: "image/png" };
export interface SvgToImageOptions {
  type: keyof typeof MIME;
  width: number;
  height: number;
}

function svgToImage(
  name: string,
  el: SVGSVGElement,
  options?: Partial<SvgToImageOptions>,
) {
  const { type = "png", width = 2048, height = 2048 } = options || {};

  const $clone = el.cloneNode(true) as HTMLElement;
  $clone.setAttribute("width", width.toString());
  $clone.setAttribute("height", height.toString());
  const svgData = new XMLSerializer().serializeToString($clone);

  const canvas = document.createElement("canvas");
  canvas.setAttribute("width", width.toString());
  canvas.setAttribute("height", height.toString());

  const ctx = canvas.getContext("2d");
  const img = document.createElement("img");
  const base64Data = typeof window !== "undefined" && window.btoa
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
    createDownloadTask(data, `QRcode_${name}.${type}`);
  };
}

async function srcToImage(name: string, src: string) {
  const parsedUrl = new URL(src);
  const pathname = parsedUrl.pathname;
  const suffix = pathname.split(".").pop() || "jpg";

  const image = await http(src, {
    headers: {
      "accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
    }
  });
  const blob = await image.blob();
  createDownloadTask(URL.createObjectURL(blob), `QRcode_${name}.${suffix}`);
}

type Downloader = (options: {
  name: string;
  wrapper: HTMLElement;
  params: any;
  userId?: string;
}) => void;

function withReport(
  downloaders: Record<string, Downloader>,
): Record<string, Downloader> {
  for (const type in downloaders) {
    const origin = downloaders[type];
    downloaders[type] = (options) => {
      try {
        const { name, params, userId } = options;
        const dataToReport = {
          user_id: userId,
          type: name,
          ...params,
        };
        trackEvent("download_qrcode", dataToReport);
      } catch {
        // Silent client-side fallback
      }
      origin(options);
    };
  }
  return downloaders;
}

const SvgQrcodeDownloaders: Record<string, Downloader> = withReport({
  svg: ({ name, wrapper }) =>
    svgToSvg(name, wrapper.querySelector("svg") as SVGSVGElement || wrapper.firstChild as SVGSVGElement),
  jpg: ({ name, wrapper }) =>
    svgToImage(name, wrapper.querySelector("svg") as SVGSVGElement || wrapper.firstChild as SVGSVGElement, { type: "jpg" }),
  png: ({ name, wrapper }) =>
    svgToImage(name, wrapper.querySelector("svg") as SVGSVGElement || wrapper.firstChild as SVGSVGElement, { type: "png" }),
});

const downloaderMaps: Record<
  string,
  Record<string, Downloader>
> = {
  svg_renderer: SvgQrcodeDownloaders,
};

export { downloaderMaps, svgToSvg, svgToImage };
