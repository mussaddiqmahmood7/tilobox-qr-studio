"use client";

import React, { useState } from "react";
import { useAtom } from "jotai";
import { urlAtom } from "@/lib/states";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Utensils,
  Scissors,
  Car,
  Wifi,
  Contact2,
  Sparkles,
  Info,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function BusinessPresets() {
  const [url, setUrl] = useAtom(urlAtom);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [guidanceTip, setGuidanceTip] = useState<string | null>(null);

  // Modal States
  const [wifiModalOpen, setWifiModalOpen] = useState(false);
  const [taxiModalOpen, setTaxiModalOpen] = useState(false);
  const [vcardModalOpen, setVcardModalOpen] = useState(false);

  // Wi-Fi form state
  const [wifiSsid, setWifiSsid] = useState("TiloBox-Guest");
  const [wifiPassword, setWifiPassword] = useState("StudioGuest2026");
  const [wifiEncryption, setWifiEncryption] = useState("WPA");

  // Taxi form state
  const [taxiPhone, setTaxiPhone] = useState("+15550192834");
  const [taxiChannel, setTaxiChannel] = useState<"whatsapp" | "phone">("whatsapp");
  const [taxiMessage, setTaxiMessage] = useState("Hello, I need a taxi ride from your pickup location.");

  // vCard form state
  const [vcardName, setVcardName] = useState("Alex Morgan");
  const [vcardOrg, setVcardOrg] = useState("TiloBox Studio");
  const [vcardTitle, setVcardTitle] = useState("Director of Design");
  const [vcardPhone, setVcardPhone] = useState("+1 (555) 234-5678");
  const [vcardEmail, setVcardEmail] = useState("alex@tilobox.com");
  const [vcardWebsite, setVcardWebsite] = useState("https://tilobox.com");

  // Handlers
  const applyRestaurantPreset = () => {
    const target = "https://menu.tilobox.com/table-12";
    setUrl(target);
    setActivePreset("restaurant");
    setGuidanceTip(
      "🍽️ Restaurant Menu Active: For dim table environments, choose high contrast (dark foreground, pure white background) with Error Correction Q or H so guests can scan effortlessly from any phone angle."
    );
    toast.success("Restaurant digital menu preset applied");
  };

  const applyBarberPreset = () => {
    const target = "https://booking.tilobox.com/studio-stylist";
    setUrl(target);
    setActivePreset("barber");
    setGuidanceTip(
      "💇 Barber & Salon Active: Pre-filled direct appointment booking link. Perfect for reception desk acrylic blocks, workstation mirror stickers, and business counter cards."
    );
    toast.success("Barber & salon booking preset applied");
  };

  const handleApplyWifi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wifiSsid) {
      toast.error("Network SSID is required");
      return;
    }
    // Format: WIFI:T:WPA;S:Network;P:Password;;
    const enc = wifiEncryption === "nopass" ? "nopass" : wifiEncryption;
    const formatted = `WIFI:T:${enc};S:${wifiSsid};P:${wifiPassword};;`;
    setUrl(formatted);
    setActivePreset("wifi");
    setGuidanceTip(
      `📶 Wi-Fi Card Active: Pointing phone camera at this QR code prompts instant connection to "${wifiSsid}". Use our Printable Tent Card below to place on your guest tables!`
    );
    setWifiModalOpen(false);
    toast.success("Guest Wi-Fi connection QR configured");
  };

  const handleApplyTaxi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taxiPhone) {
      toast.error("Phone number is required");
      return;
    }
    const cleanNumber = taxiPhone.replace(/[^0-9]/g, "");
    let formatted = "";
    if (taxiChannel === "whatsapp") {
      formatted = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(taxiMessage)}`;
    } else {
      formatted = `tel:${taxiPhone}`;
    }
    setUrl(formatted);
    setActivePreset("taxi");
    setGuidanceTip(
      "🚖 Fleet / Taxi Dispatch Active: One-tap dispatch link formatted for hotel lobbies, taxi counters, and driver cards."
    );
    setTaxiModalOpen(false);
    toast.success("Taxi dispatch action link configured");
  };

  const handleApplyVCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vcardName) {
      toast.error("Name is required");
      return;
    }
    const nameParts = vcardName.trim().split(" ");
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";
    const firstName = nameParts[0] || "";

    const vcard = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `N:${lastName};${firstName};;;`,
      `FN:${vcardName}`,
      vcardOrg ? `ORG:${vcardOrg}` : "",
      vcardTitle ? `TITLE:${vcardTitle}` : "",
      vcardPhone ? `TEL;TYPE=CELL:${vcardPhone}` : "",
      vcardEmail ? `EMAIL:${vcardEmail}` : "",
      vcardWebsite ? `URL:${vcardWebsite}` : "",
      "END:VCARD",
    ]
      .filter(Boolean)
      .join("\n");

    setUrl(vcard);
    setActivePreset("vcard");
    setGuidanceTip(
      "💼 vCard Business Card Active: Scanning this QR prompts users to instantly save contact details into their phone address book with zero manual typing."
    );
    setVcardModalOpen(false);
    toast.success("vCard digital contact code generated");
  };

  return (
    <div className="w-full mt-4">
      {/* Preset tabs bar */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            Quick Business Presets
          </span>
          {activePreset && (
            <button
              onClick={() => {
                setActivePreset(null);
                setGuidanceTip(null);
                setUrl("");
              }}
              className="text-[11px] text-muted-foreground hover:text-foreground underline underline-offset-2"
            >
              Clear Preset
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {/* 1. Restaurant */}
          <button
            type="button"
            onClick={applyRestaurantPreset}
            className={cn(
              "flex items-center justify-center sm:justify-start gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all",
              activePreset === "restaurant"
                ? "border-primary bg-primary/10 text-primary shadow-xs ring-1 ring-primary/30"
                : "border-border bg-card/60 text-muted-foreground hover:border-primary/40 hover:bg-card hover:text-foreground"
            )}
          >
            <Utensils className="w-4 h-4 shrink-0 text-amber-500" />
            <span className="truncate">Digital Menu</span>
          </button>

          {/* 2. Barber */}
          <button
            type="button"
            onClick={applyBarberPreset}
            className={cn(
              "flex items-center justify-center sm:justify-start gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all",
              activePreset === "barber"
                ? "border-primary bg-primary/10 text-primary shadow-xs ring-1 ring-primary/30"
                : "border-border bg-card/60 text-muted-foreground hover:border-primary/40 hover:bg-card hover:text-foreground"
            )}
          >
            <Scissors className="w-4 h-4 shrink-0 text-indigo-500" />
            <span className="truncate">Barber Booking</span>
          </button>

          {/* 3. Taxi */}
          <button
            type="button"
            onClick={() => setTaxiModalOpen(true)}
            className={cn(
              "flex items-center justify-center sm:justify-start gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all",
              activePreset === "taxi"
                ? "border-primary bg-primary/10 text-primary shadow-xs ring-1 ring-primary/30"
                : "border-border bg-card/60 text-muted-foreground hover:border-primary/40 hover:bg-card hover:text-foreground"
            )}
          >
            <Car className="w-4 h-4 shrink-0 text-emerald-500" />
            <span className="truncate">Taxi / Dispatch</span>
          </button>

          {/* 4. Guest Wi-Fi */}
          <button
            type="button"
            onClick={() => setWifiModalOpen(true)}
            className={cn(
              "flex items-center justify-center sm:justify-start gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all",
              activePreset === "wifi"
                ? "border-primary bg-primary/10 text-primary shadow-xs ring-1 ring-primary/30"
                : "border-border bg-card/60 text-muted-foreground hover:border-primary/40 hover:bg-card hover:text-foreground"
            )}
          >
            <Wifi className="w-4 h-4 shrink-0 text-sky-500" />
            <span className="truncate">Guest Wi-Fi</span>
          </button>

          {/* 5. vCard */}
          <button
            type="button"
            onClick={() => setVcardModalOpen(true)}
            className={cn(
              "col-span-2 sm:col-span-1 flex items-center justify-center sm:justify-start gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all",
              activePreset === "vcard"
                ? "border-primary bg-primary/10 text-primary shadow-xs ring-1 ring-primary/30"
                : "border-border bg-card/60 text-muted-foreground hover:border-primary/40 hover:bg-card hover:text-foreground"
            )}
          >
            <Contact2 className="w-4 h-4 shrink-0 text-purple-500" />
            <span className="truncate">vCard Card</span>
          </button>
        </div>

        {/* Guidance tip box */}
        {guidanceTip && (
          <div className="mt-2 flex items-start gap-2 rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs text-foreground/90 animate-in fade-in-50 duration-200">
            <Info className="w-4 h-4 shrink-0 text-primary mt-0.5" />
            <div className="flex-1 leading-relaxed">{guidanceTip}</div>
          </div>
        )}
      </div>

      {/* Guest Wi-Fi Modal */}
      <Dialog open={wifiModalOpen} onOpenChange={setWifiModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wifi className="w-5 h-5 text-sky-500" />
              Configure Guest Wi-Fi QR Card
            </DialogTitle>
            <DialogDescription>
              Guests can scan this code with their smartphone camera to connect to your Wi-Fi automatically without typing passwords.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleApplyWifi} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="wifi-ssid">Network Name (SSID)</Label>
              <Input
                id="wifi-ssid"
                value={wifiSsid}
                onChange={(e) => setWifiSsid(e.target.value)}
                placeholder="e.g. MyCafe-Guest-WiFi"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="wifi-pass">Password</Label>
              <Input
                id="wifi-pass"
                type="text"
                value={wifiPassword}
                onChange={(e) => setWifiPassword(e.target.value)}
                placeholder="Leave blank if open network"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="wifi-enc">Security Protocol</Label>
              <Select value={wifiEncryption} onValueChange={setWifiEncryption}>
                <SelectTrigger id="wifi-enc">
                  <SelectValue placeholder="Encryption" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WPA">WPA / WPA2 / WPA3 (Standard)</SelectItem>
                  <SelectItem value="WEP">WEP (Legacy)</SelectItem>
                  <SelectItem value="nopass">None (Open Network)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setWifiModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="gap-1.5">
                <Check className="w-4 h-4" /> Apply Wi-Fi Code
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Taxi / Dispatch Modal */}
      <Dialog open={taxiModalOpen} onOpenChange={setTaxiModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Car className="w-5 h-5 text-emerald-500" />
              Taxi & Fleet Dispatch Quick-Link
            </DialogTitle>
            <DialogDescription>
              Format a direct WhatsApp chat or phone call action for tourists, guests, and hotel lobby pickup stands.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleApplyTaxi} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="taxi-channel">Dispatch Channel</Label>
              <Select
                value={taxiChannel}
                onValueChange={(val: "whatsapp" | "phone") => setTaxiChannel(val)}
              >
                <SelectTrigger id="taxi-channel">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="whatsapp">WhatsApp Direct Chat</SelectItem>
                  <SelectItem value="phone">Direct Phone Call (tel:)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="taxi-phone">Driver / Dispatch Phone Number</Label>
              <Input
                id="taxi-phone"
                value={taxiPhone}
                onChange={(e) => setTaxiPhone(e.target.value)}
                placeholder="+1 555 019 2834 (include country code)"
                required
              />
            </div>

            {taxiChannel === "whatsapp" && (
              <div className="space-y-1.5">
                <Label htmlFor="taxi-msg">Default Chat Message</Label>
                <Input
                  id="taxi-msg"
                  value={taxiMessage}
                  onChange={(e) => setTaxiMessage(e.target.value)}
                  placeholder="e.g. Hello, I need a taxi from reception."
                />
              </div>
            )}

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setTaxiModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="gap-1.5">
                <Check className="w-4 h-4" /> Apply Dispatch Link
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* vCard Digital Business Card Modal */}
      <Dialog open={vcardModalOpen} onOpenChange={setVcardModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Contact2 className="w-5 h-5 text-purple-500" />
              vCard Digital Contact Card
            </DialogTitle>
            <DialogDescription>
              Generates standard vCard 3.0. Scanning prompts smartphone users to save your profile into contacts instantly.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleApplyVCard} className="space-y-3 py-1">
            <div className="space-y-1">
              <Label htmlFor="vcard-name">Full Name</Label>
              <Input
                id="vcard-name"
                value={vcardName}
                onChange={(e) => setVcardName(e.target.value)}
                placeholder="Alex Morgan"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="vcard-org">Company / Studio</Label>
                <Input
                  id="vcard-org"
                  value={vcardOrg}
                  onChange={(e) => setVcardOrg(e.target.value)}
                  placeholder="TiloBox Studio"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="vcard-title">Job Title</Label>
                <Input
                  id="vcard-title"
                  value={vcardTitle}
                  onChange={(e) => setVcardTitle(e.target.value)}
                  placeholder="Creative Lead"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="vcard-phone">Mobile Phone</Label>
                <Input
                  id="vcard-phone"
                  value={vcardPhone}
                  onChange={(e) => setVcardPhone(e.target.value)}
                  placeholder="+1 (555) 234-5678"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="vcard-email">Email Address</Label>
                <Input
                  id="vcard-email"
                  type="email"
                  value={vcardEmail}
                  onChange={(e) => setVcardEmail(e.target.value)}
                  placeholder="alex@tilobox.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="vcard-web">Website / Portfolio</Label>
              <Input
                id="vcard-web"
                value={vcardWebsite}
                onChange={(e) => setVcardWebsite(e.target.value)}
                placeholder="https://tilobox.com"
              />
            </div>

            <DialogFooter className="pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setVcardModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="gap-1.5">
                <Check className="w-4 h-4" /> Apply Contact Card
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
