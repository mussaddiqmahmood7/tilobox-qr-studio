"use client";

import { Input } from "@/components/ui/input";
import { urlAtom } from "@/lib/states";
import { useAtom } from "jotai";

export function UrlInput() {
  const [url, setUrl] = useAtom(urlAtom);
  return (
    <>
      <Input
        placeholder="https://tilobox.com"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="font-mono text-sm bg-card/60 shadow-2xs border-border/70 focus-visible:ring-primary"
      />
    </>
  );
}
