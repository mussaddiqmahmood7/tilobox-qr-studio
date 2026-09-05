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
import { Textarea } from "@/components/ui/textarea";
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
  Link2,
  Wifi,
  PhoneCall,
  Contact2,
  FileText,
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
  const [urlModalOpen, setUrlModalOpen] = useState(false);
  const [wifiModalOpen, setWifiModalOpen] = useState(false);
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [vcardModalOpen, setVcardModalOpen] = useState(false);
  const [textModalOpen, setTextModalOpen] = useState(false);

  // URL Form state (user's actual link)
  const [customLinkUrl, setCustomLinkUrl] = useState("");
  const [linkCategory, setLinkCategory] = useState("menu");

  // Wi-Fi form state
  const [wifiSsid, setWifiSsid] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const [wifiEncryption, setWifiEncryption] = useState("WPA");

  // WhatsApp / Call form state
  const [phoneNumber, setPhoneNumber] = useState("");
  const [callChannel, setCallChannel] = useState<"whatsapp" | "phone">("whatsapp");
  const [whatsappMessage, setWhatsappMessage] = useState("Hello, I would like to inquire about your services.");

  // vCard form state
  const [vcardName, setVcardName] = useState("");
  const [vcardOrg, setVcardOrg] = useState("");
  const [vcardTitle, setVcardTitle] = useState("");
  const [vcardPhone, setVcardPhone] = useState("");
  const [vcardEmail, setVcardEmail] = useState("");
  const [vcardWebsite, setVcardWebsite] = useState("");

  // Plain Text form state
  const [plainTextContent, setPlainTextContent] = useState("");

  // Handlers
  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customLinkUrl.trim()) {
      toast.error("Please enter a valid URL");
      return;
    }
    let formatted = customLinkUrl.trim();
    if (!formatted.startsWith("http://") && !formatted.startsWith("https://")) {
      formatted = `https://${formatted}`;
    }
    setUrl(formatted);
    setActivePreset("url");
    setGuidanceTip(
      `🔗 Web Link Active: Scanning this QR code opens "${formatted}" directly in the smartphone browser. Ideal for digital restaurant menus, booking calendars, portfolios, and social profiles.`
    );
    setUrlModalOpen(false);
    toast.success("Target URL applied to QR code");
  };

  const handleApplyWifi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wifiSsid.trim()) {
      toast.error("Network Name (SSID) is required");
      return;
    }
    const enc = wifiEncryption === "nopass" ? "nopass" : wifiEncryption;
    const formatted = `WIFI:T:${enc};S:${wifiSsid.trim()};P:${wifiPassword};;`;
    setUrl(formatted);
    setActivePreset("wifi");
    setGuidanceTip(
      `📶 Wi-Fi Auto-Connect Active: Pointing any smartphone camera at this QR code prompts instant connection to "${wifiSsid}" without typing passwords. Place on table tent cards or reception desks!`
    );
    setWifiModalOpen(false);
    toast.success("Wi-Fi connection code generated");
  };

  const handleApplyCall = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) {
      toast.error("Phone number is required");
      return;
    }
    const cleanNumber = phoneNumber.replace(/[^0-9]/g, "");
    let formatted = "";
    if (callChannel === "whatsapp") {
      formatted = `https://wa.me/${cleanNumber}${whatsappMessage ? `?text=${encodeURIComponent(whatsappMessage)}` : ""}`;
    } else {
      formatted = `tel:${phoneNumber.trim()}`;
    }
    setUrl(formatted);
    setActivePreset("call");
    setGuidanceTip(
      `💬 ${callChannel === "whatsapp" ? "WhatsApp Chat" : "Direct Phone Call"} Active: Scanning prompts a 1-tap message or call to ${phoneNumber}. Great for customer support, taxi booking, and appointments.`
    );
    setCallModalOpen(false);
    toast.success("Direct contact action link applied");
  };

  const handleApplyVCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vcardName.trim()) {
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
      `FN:${vcardName.trim()}`,
      vcardOrg.trim() ? `ORG:${vcardOrg.trim()}` : "",
      vcardTitle.trim() ? `TITLE:${vcardTitle.trim()}` : "",
      vcardPhone.trim() ? `TEL;TYPE=CELL:${vcardPhone.trim()}` : "",
      vcardEmail.trim() ? `EMAIL:${vcardEmail.trim()}` : "",
      vcardWebsite.trim() ? `URL:${vcardWebsite.trim()}` : "",
      "END:VCARD",
    ]
      .filter(Boolean)
      .join("\n");

    setUrl(vcard);
    setActivePreset("vcard");
    setGuidanceTip(
      `📇 vCard Contact Active: Scanning prompts phones to save ${vcardName.trim()}'s profile directly into their address book with zero manual typing.`
    );
    setVcardModalOpen(false);
    toast.success("vCard contact code generated");
  };

  const handleApplyText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plainTextContent.trim()) {
      toast.error("Please enter some text");
      return;
    }
    setUrl(plainTextContent.trim());
    setActivePreset("text");
    setGuidanceTip(
      `📝 Plain Text Active: Scanning displays your raw text, table number, or note on the user's phone screen.`
    );
    setTextModalOpen(false);
    toast.success("Plain text applied to QR code");
  };

  return (
    <div className="w-full mt-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              Quick QR Data Formatters
            </span>
            <span className="hidden sm:inline text-[11px] text-muted-foreground/70">
              • Formats standard QR protocols for real-world scanning
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
              Clear Formatter
            </button>
          )}
        </div>

        {/* 5 Real QR Formatters */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {/* 1. Website / URL */}
          <button
            type="button"
            onClick={() => setUrlModalOpen(true)}
            className={cn(
              "flex flex-col items-start p-2.5 rounded-xl border text-start transition-all",
              activePreset === "url"
                ? "border-primary bg-primary/10 text-primary shadow-xs ring-1 ring-primary/30"
                : "border-border bg-card/60 text-muted-foreground hover:border-primary/40 hover:bg-card hover:text-foreground"
            )}
          >
            <div className="flex items-center gap-1.5 w-full">
              <Link2 className="w-4 h-4 shrink-0 text-sky-500" />
              <span className="font-semibold text-xs text-foreground truncate">Website Link</span>
            </div>
            <span className="text-[10px] text-muted-foreground mt-0.5 truncate w-full">
              Menu, Booking, Web
            </span>
          </button>

          {/* 2. Wi-Fi Auto-Connect */}
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
              <Wifi className="w-4 h-4 shrink-0 text-emerald-500" />
              <span className="font-semibold text-xs text-foreground truncate">Guest Wi-Fi</span>
            </div>
            <span className="text-[10px] text-muted-foreground mt-0.5 truncate w-full">
              Auto-Join Network
            </span>
          </button>

          {/* 3. WhatsApp / Call */}
          <button
            type="button"
            onClick={() => setCallModalOpen(true)}
            className={cn(
              "flex flex-col items-start p-2.5 rounded-xl border text-start transition-all",
              activePreset === "call"
                ? "border-primary bg-primary/10 text-primary shadow-xs ring-1 ring-primary/30"
                : "border-border bg-card/60 text-muted-foreground hover:border-primary/40 hover:bg-card hover:text-foreground"
            )}
          >
            <div className="flex items-center gap-1.5 w-full">
              <PhoneCall className="w-4 h-4 shrink-0 text-amber-500" />
              <span className="font-semibold text-xs text-foreground truncate">WhatsApp & Call</span>
            </div>
            <span className="text-[10px] text-muted-foreground mt-0.5 truncate w-full">
              1-Tap Contact Action
            </span>
          </button>

          {/* 4. vCard Contact */}
          <button
            type="button"
            onClick={() => setVcardModalOpen(true)}
            className={cn(
              "flex flex-col items-start p-2.5 rounded-xl border text-start transition-all",
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
              Save to Address Book
            </span>
          </button>

          {/* 5. Plain Text / Notes */}
          <button
            type="button"
            onClick={() => setTextModalOpen(true)}
            className={cn(
              "col-span-2 sm:col-span-1 flex flex-col items-start p-2.5 rounded-xl border text-start transition-all",
              activePreset === "text"
                ? "border-primary bg-primary/10 text-primary shadow-xs ring-1 ring-primary/30"
                : "border-border bg-card/60 text-muted-foreground hover:border-primary/40 hover:bg-card hover:text-foreground"
            )}
          >
            <div className="flex items-center gap-1.5 w-full">
              <FileText className="w-4 h-4 shrink-0 text-indigo-500" />
              <span className="font-semibold text-xs text-foreground truncate">Plain Text</span>
            </div>
            <span className="text-[10px] text-muted-foreground mt-0.5 truncate w-full">
              Notes, Codes, Tables
            </span>
          </button>
        </div>

        {/* Real-time Guidance Tip */}
        {guidanceTip && (
          <div className="mt-2 flex items-start gap-2 rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs text-foreground/90 animate-in fade-in-50 duration-200">
            <Info className="w-4 h-4 shrink-0 text-primary mt-0.5" />
            <div className="flex-1 leading-relaxed">{guidanceTip}</div>
          </div>
        )}
      </div>

      {/* 1. Website Link Modal */}
      <Dialog open={urlModalOpen} onOpenChange={setUrlModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Link2 className="w-5 h-5 text-sky-500" />
              Encode Website or Online Link
            </DialogTitle>
            <DialogDescription>
              Enter the actual link you want people to visit when they scan this QR code with their phone camera.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleApplyUrl} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="link-type">Link Type / Purpose</Label>
              <Select value={linkCategory} onValueChange={setLinkCategory}>
                <SelectTrigger id="link-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="menu">Restaurant or Cafe Digital Menu</SelectItem>
                  <SelectItem value="booking">Barber, Salon, or Appointment Link</SelectItem>
                  <SelectItem value="social">Social Profile (Instagram, TikTok, LinkedIn)</SelectItem>
                  <SelectItem value="business">Company Website or Portfolio</SelectItem>
                  <SelectItem value="file">PDF Document or Cloud File</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="target-link">Target URL Address</Label>
              <Input
                id="target-link"
                value={customLinkUrl}
                onChange={(e) => setCustomLinkUrl(e.target.value)}
                placeholder={
                  linkCategory === "menu"
                    ? "https://yourrestaurant.com/menu"
                    : linkCategory === "booking"
                    ? "https://calendly.com/your-name"
                    : "https://yourdomain.com"
                }
                required
              />
              <p className="text-[11px] text-muted-foreground">
                Paste any live web link. Smartphones will open this link directly in Safari or Chrome.
              </p>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setUrlModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="gap-1.5">
                <Check className="w-4 h-4" /> Apply URL
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 2. Guest Wi-Fi Modal */}
      <Dialog open={wifiModalOpen} onOpenChange={setWifiModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wifi className="w-5 h-5 text-emerald-500" />
              Configure Guest Wi-Fi Auto-Connect
            </DialogTitle>
            <DialogDescription>
              When guests scan this QR code, their phone displays a popup: &ldquo;Join network [Name]?&rdquo; and connects with zero typing.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleApplyWifi} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="wifi-ssid">Network Name (SSID)</Label>
              <Input
                id="wifi-ssid"
                value={wifiSsid}
                onChange={(e) => setWifiSsid(e.target.value)}
                placeholder="e.g. MyCafe_Guest"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="wifi-pass">Wi-Fi Password</Label>
              <Input
                id="wifi-pass"
                type="text"
                value={wifiPassword}
                onChange={(e) => setWifiPassword(e.target.value)}
                placeholder="Leave blank if open network without password"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="wifi-enc">Security Protocol</Label>
              <Select value={wifiEncryption} onValueChange={setWifiEncryption}>
                <SelectTrigger id="wifi-enc">
                  <SelectValue placeholder="Encryption" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WPA">WPA / WPA2 / WPA3 (Standard for most routers)</SelectItem>
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

      {/* 3. WhatsApp / Call Modal */}
      <Dialog open={callModalOpen} onOpenChange={setCallModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-amber-500" />
              WhatsApp & Phone Contact Action
            </DialogTitle>
            <DialogDescription>
              Let customers, passengers, or clients initiate a direct WhatsApp chat or phone call with 1 tap.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleApplyCall} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="call-channel">Action Channel</Label>
              <Select
                value={callChannel}
                onValueChange={(val: "whatsapp" | "phone") => setCallChannel(val)}
              >
                <SelectTrigger id="call-channel">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="whatsapp">WhatsApp Direct Chat (wa.me)</SelectItem>
                  <SelectItem value="phone">Direct Phone Call (tel:)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="call-phone">Phone Number (include Country Code)</Label>
              <Input
                id="call-phone"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1 555 234 5678"
                required
              />
            </div>

            {callChannel === "whatsapp" && (
              <div className="space-y-1.5">
                <Label htmlFor="call-msg">Default Pre-filled Message</Label>
                <Input
                  id="call-msg"
                  value={whatsappMessage}
                  onChange={(e) => setWhatsappMessage(e.target.value)}
                  placeholder="e.g. Hello, I would like to book a ride / make a reservation."
                />
              </div>
            )}

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCallModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="gap-1.5">
                <Check className="w-4 h-4" /> Apply Contact Action
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 4. vCard Digital Contact Card Modal */}
      <Dialog open={vcardModalOpen} onOpenChange={setVcardModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Contact2 className="w-5 h-5 text-purple-500" />
              vCard Digital Contact Card
            </DialogTitle>
            <DialogDescription>
              Encodes standard vCard 3.0. When scanned, smartphones prompt users to add your contact directly to their phonebook.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleApplyVCard} className="space-y-3 py-1">
            <div className="space-y-1">
              <Label htmlFor="vcard-name">Full Name</Label>
              <Input
                id="vcard-name"
                value={vcardName}
                onChange={(e) => setVcardName(e.target.value)}
                placeholder="e.g. Jane Doe"
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
                  placeholder="e.g. Studio Acme"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="vcard-title">Job Title</Label>
                <Input
                  id="vcard-title"
                  value={vcardTitle}
                  onChange={(e) => setVcardTitle(e.target.value)}
                  placeholder="e.g. Creative Lead"
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
                  placeholder="jane@example.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="vcard-web">Website URL</Label>
              <Input
                id="vcard-web"
                value={vcardWebsite}
                onChange={(e) => setVcardWebsite(e.target.value)}
                placeholder="https://example.com"
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

      {/* 5. Plain Text Modal */}
      <Dialog open={textModalOpen} onOpenChange={setTextModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-500" />
              Encode Plain Text or Table Identifier
            </DialogTitle>
            <DialogDescription>
              Encode any raw text, table number, discount coupon code, or instructions directly into the QR code.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleApplyText} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="plain-text">Content / Text</Label>
              <Textarea
                id="plain-text"
                rows={4}
                value={plainTextContent}
                onChange={(e) => setPlainTextContent(e.target.value)}
                placeholder="e.g. Table 12 • Special Promo Code: TILOBOX20"
                required
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setTextModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="gap-1.5">
                <Check className="w-4 h-4" /> Apply Text
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
