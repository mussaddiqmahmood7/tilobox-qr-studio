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
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function BusinessPresets() {
  const [url, setUrl] = useAtom(urlAtom);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [guidanceTip, setGuidanceTip] = useState<string | null>(null);

  // Modal States
  const [restaurantModalOpen, setRestaurantModalOpen] = useState(false);
  const [barberModalOpen, setBarberModalOpen] = useState(false);
  const [wifiModalOpen, setWifiModalOpen] = useState(false);
  const [taxiModalOpen, setTaxiModalOpen] = useState(false);
  const [vcardModalOpen, setVcardModalOpen] = useState(false);

  // Restaurant form state
  const [restaurantName, setRestaurantName] = useState("The Brass Bistro");
  const [restaurantTable, setRestaurantTable] = useState("Table 12");
  const [restaurantMenuUrl, setRestaurantMenuUrl] = useState("https://menu.tilobox.com/bistro");

  // Barber form state
  const [barberShop, setBarberShop] = useState("Crown Barber Studio");
  const [barberStylist, setBarberStylist] = useState("Marcus & Stylists");
  const [barberUrl, setBarberUrl] = useState("https://booking.tilobox.com/crown-barber");

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
  const handleApplyRestaurant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!restaurantMenuUrl) {
      toast.error("Menu URL is required");
      return;
    }
    const cleanUrl = restaurantMenuUrl.trim();
    const finalUrl = restaurantTable
      ? `${cleanUrl}${cleanUrl.includes("?") ? "&" : "?"}table=${encodeURIComponent(restaurantTable)}`
      : cleanUrl;
    setUrl(finalUrl);
    setActivePreset("restaurant");
    setGuidanceTip(
      `🍽️ Restaurant Menu Active for "${restaurantName}" (${restaurantTable || "Main Menu"}): Pointing a phone camera opens your live digital menu instantly without physical paper menus. Use our Display Card Suite below to generate a tabletop display!`
    );
    setRestaurantModalOpen(false);
    toast.success("Digital Menu preset configured");
  };

  const handleApplyBarber = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barberUrl) {
      toast.error("Booking URL is required");
      return;
    }
    setUrl(barberUrl.trim());
    setActivePreset("barber");
    setGuidanceTip(
      `💇 Barber & Salon Active for "${barberShop}": Pointing a phone camera opens direct appointment scheduling for ${barberStylist}. Place on mirror stickers, workstation blocks, or checkout cards.`
    );
    setBarberModalOpen(false);
    toast.success("Barber booking preset configured");
  };

  const handleApplyWifi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wifiSsid) {
      toast.error("Network SSID is required");
      return;
    }
    const enc = wifiEncryption === "nopass" ? "nopass" : wifiEncryption;
    const formatted = `WIFI:T:${enc};S:${wifiSsid};P:${wifiPassword};;`;
    setUrl(formatted);
    setActivePreset("wifi");
    setGuidanceTip(
      `📶 Wi-Fi Card Active: Pointing phone camera at this QR code prompts instant connection to "${wifiSsid}" without typing passwords. Place on table tent cards!`
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
      "💼 vCard Contact Card Active: Scanning this QR prompts users to instantly save contact details into their phone address book with zero manual typing."
    );
    setVcardModalOpen(false);
    toast.success("vCard digital contact code generated");
  };

  return (
    <div className="w-full mt-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              Quick Business Presets
            </span>
            <span className="hidden sm:inline text-[11px] text-muted-foreground/70">
              • Ready-to-use business templates with auto-formatting
            </span>
          </div>
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
            onClick={() => setRestaurantModalOpen(true)}
            className={cn(
              "flex flex-col items-start p-2.5 rounded-xl border text-start transition-all",
              activePreset === "restaurant"
                ? "border-primary bg-primary/10 text-primary shadow-xs ring-1 ring-primary/30"
                : "border-border bg-card/60 text-muted-foreground hover:border-primary/40 hover:bg-card hover:text-foreground"
            )}
          >
            <div className="flex items-center gap-1.5 w-full">
              <Utensils className="w-4 h-4 shrink-0 text-amber-500" />
              <span className="font-semibold text-xs text-foreground truncate">Digital Menu</span>
            </div>
            <span className="text-[10px] text-muted-foreground mt-0.5 truncate w-full">
              Table & PDF link
            </span>
          </button>

          {/* 2. Barber */}
          <button
            type="button"
            onClick={() => setBarberModalOpen(true)}
            className={cn(
              "flex flex-col items-start p-2.5 rounded-xl border text-start transition-all",
              activePreset === "barber"
                ? "border-primary bg-primary/10 text-primary shadow-xs ring-1 ring-primary/30"
                : "border-border bg-card/60 text-muted-foreground hover:border-primary/40 hover:bg-card hover:text-foreground"
            )}
          >
            <div className="flex items-center gap-1.5 w-full">
              <Scissors className="w-4 h-4 shrink-0 text-indigo-500" />
              <span className="font-semibold text-xs text-foreground truncate">Barber Booking</span>
            </div>
            <span className="text-[10px] text-muted-foreground mt-0.5 truncate w-full">
              Appointments
            </span>
          </button>

          {/* 3. Taxi */}
          <button
            type="button"
            onClick={() => setTaxiModalOpen(true)}
            className={cn(
              "flex flex-col items-start p-2.5 rounded-xl border text-start transition-all",
              activePreset === "taxi"
                ? "border-primary bg-primary/10 text-primary shadow-xs ring-1 ring-primary/30"
                : "border-border bg-card/60 text-muted-foreground hover:border-primary/40 hover:bg-card hover:text-foreground"
            )}
          >
            <div className="flex items-center gap-1.5 w-full">
              <Car className="w-4 h-4 shrink-0 text-emerald-500" />
              <span className="font-semibold text-xs text-foreground truncate">Taxi Dispatch</span>
            </div>
            <span className="text-[10px] text-muted-foreground mt-0.5 truncate w-full">
              WhatsApp & Call
            </span>
          </button>

          {/* 4. Guest Wi-Fi */}
          <button
            type="button"
            onClick={() => setWifiModalOpen(true)}
            className={cn(
              "flex flex-col items-start p-2.5 rounded-xl border text-start transition-all",
              activePreset === "wifi"
                ? "border-primary bg-primary/10 text-primary shadow-xs ring-1 ring-primary/30"
                : "border-border bg-card/60 text-muted-foreground hover:border-primary/40 hover:bg-card hover:text-foreground"
            )}
          >
            <div className="flex items-center gap-1.5 w-full">
              <Wifi className="w-4 h-4 shrink-0 text-sky-500" />
              <span className="font-semibold text-xs text-foreground truncate">Guest Wi-Fi</span>
            </div>
            <span className="text-[10px] text-muted-foreground mt-0.5 truncate w-full">
              1-Tap Auto Connect
            </span>
          </button>

          {/* 5. vCard */}
          <button
            type="button"
            onClick={() => setVcardModalOpen(true)}
            className={cn(
              "col-span-2 sm:col-span-1 flex flex-col items-start p-2.5 rounded-xl border text-start transition-all",
              activePreset === "vcard"
                ? "border-primary bg-primary/10 text-primary shadow-xs ring-1 ring-primary/30"
                : "border-border bg-card/60 text-muted-foreground hover:border-primary/40 hover:bg-card hover:text-foreground"
            )}
          >
            <div className="flex items-center gap-1.5 w-full">
              <Contact2 className="w-4 h-4 shrink-0 text-purple-500" />
              <span className="font-semibold text-xs text-foreground truncate">vCard Profile</span>
            </div>
            <span className="text-[10px] text-muted-foreground mt-0.5 truncate w-full">
              Save to Contacts
            </span>
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

      {/* Digital Menu Modal */}
      <Dialog open={restaurantModalOpen} onOpenChange={setRestaurantModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Utensils className="w-5 h-5 text-amber-500" />
              Configure Restaurant Digital Menu QR
            </DialogTitle>
            <DialogDescription>
              Guests scan this QR code on their table to browse your contactless food and drink menu on their phone.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleApplyRestaurant} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="rest-name">Restaurant / Cafe Name</Label>
              <Input
                id="rest-name"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                placeholder="e.g. The Brass Bistro"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="rest-url">Digital Menu or Website URL</Label>
              <Input
                id="rest-url"
                value={restaurantMenuUrl}
                onChange={(e) => setRestaurantMenuUrl(e.target.value)}
                placeholder="https://menu.yourrestaurant.com"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="rest-table">Table / Station Identification (Optional)</Label>
              <Input
                id="rest-table"
                value={restaurantTable}
                onChange={(e) => setRestaurantTable(e.target.value)}
                placeholder="e.g. Table 12, Booth 4, Patio 2"
              />
              <p className="text-[11px] text-muted-foreground">
                Appends ?table=12 to URL so orders and table requests are instantly identified.
              </p>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setRestaurantModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="gap-1.5">
                <Check className="w-4 h-4" /> Apply Menu Preset
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Barber & Salon Booking Modal */}
      <Dialog open={barberModalOpen} onOpenChange={setBarberModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Scissors className="w-5 h-5 text-indigo-500" />
              Configure Barber & Salon Booking QR
            </DialogTitle>
            <DialogDescription>
              Display this on mirror stickers and counter cards so clients can schedule their next appointment in 3 seconds.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleApplyBarber} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="barber-shop">Shop / Salon Name</Label>
              <Input
                id="barber-shop"
                value={barberShop}
                onChange={(e) => setBarberShop(e.target.value)}
                placeholder="e.g. Crown Barber Studio"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="barber-stylist">Stylist / Team Name</Label>
              <Input
                id="barber-stylist"
                value={barberStylist}
                onChange={(e) => setBarberStylist(e.target.value)}
                placeholder="e.g. Marcus & Team"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="barber-url">Booking URL (Calendly, Fresha, Square, Instagram)</Label>
              <Input
                id="barber-url"
                value={barberUrl}
                onChange={(e) => setBarberUrl(e.target.value)}
                placeholder="https://booking.yoursalon.com"
                required
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setBarberModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="gap-1.5">
                <Check className="w-4 h-4" /> Apply Booking Preset
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Guest Wi-Fi Modal */}
      <Dialog open={wifiModalOpen} onOpenChange={setWifiModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wifi className="w-5 h-5 text-sky-500" />
              Configure Guest Wi-Fi QR Card
            </DialogTitle>
            <DialogDescription>
              Guests scan this code with their smartphone camera to connect to your Wi-Fi automatically without typing passwords.
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
