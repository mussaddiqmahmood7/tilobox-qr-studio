import React from "react";
import { StatusCard } from "@/components/StatusCard";
import { getGitHubStars } from "@/lib/network";

export default async function QrbtfStatus() {
  let stars = "5.2k+";
  try {
    const starCount = await getGitHubStars();
    if (starCount) {
      stars = starCount.toLocaleString();
    }
  } catch {
    stars = "Open Source";
  }

  const stats = [
    { title: "Architecture", value: "100% Client-Side" },
    { title: "Server Latency", value: "0ms (In-Browser)" },
    { title: "Export Quality", value: "Vector SVG & 4K" },
    { title: "GitHub Community", value: stars },
  ];

  return (
    <>
      {stats.map((item) => (
        <StatusCard title={item.title} key={item.title}>
          <div className="text-xl font-bold tracking-tight text-foreground">
            {item.value}
          </div>
        </StatusCard>
      ))}
    </>
  );
}
