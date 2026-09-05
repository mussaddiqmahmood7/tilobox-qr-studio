import { atom } from "jotai";
import { qrStyleList } from "@/lib/qr_style_list";

export interface CenterLogoConfig {
  url: string | null;
  size: number; // 10 to 25
  mask: "circle" | "rounded" | "none";
  padding: number;
  maskBg: string;
}

export const defaultCenterLogoConfig: CenterLogoConfig = {
  url: null,
  size: 18,
  mask: "rounded",
  padding: 4,
  maskBg: "#ffffff",
};

export const urlAtom = atom<string>("");
export const centerLogoAtom = atom<CenterLogoConfig>(defaultCenterLogoConfig);
