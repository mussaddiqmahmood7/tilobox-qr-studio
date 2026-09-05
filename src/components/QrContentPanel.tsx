"use client";

import React, { useState, useEffect, useId } from "react";
import { useAtom } from "jotai";
import { urlAtom } from "@/lib/states";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScanButton } from "@/components/ScanButton";
import {
  Link2,
  MessageCircle,
  Phone,
  Wifi,
  Contact,
  FileText,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ContentCategory = "url" | "whatsapp" | "phone" | "wifi" | "vcard" | "text";

interface CategoryTab {
  id: ContentCategory;
  label: string;
  icon: React.ElementType;
  description: string;
}

const CATEGORIES: CategoryTab[] = [
  {
    id: "url",
    label: "Website Link",
    icon: Link2,
    description: "Open any website, digital menu, portfolio, or PDF link",
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    icon: MessageCircle,
    description: "Start a direct WhatsApp chat with an optional prefilled message",
  },
  {
    id: "phone",
    label: "Phone Call",
    icon: Phone,
    description: "Prompt instant 1-tap phone dialing on smartphones",
  },
  {
    id: "wifi",
    label: "Wi-Fi Network",
    icon: Wifi,
    description: "Auto-connect phones to Wi-Fi without typing passwords",
  },
  {
    id: "vcard",
    label: "vCard Contact",
    icon: Contact,
    description: "Save complete digital business card into phonebook contacts",
  },
  {
    id: "text",
    label: "Plain Text",
    icon: FileText,
    description: "Display table numbers, secret promo codes, or raw notes",
  },
];

export function QrContentPanel() {
  const [activeCategory, setActiveCategory] = useState<ContentCategory>("url");
  const [globalUrl, setGlobalUrl] = useAtom(urlAtom);

  // Form states
  const [rawUrl, setRawUrl] = useState("https://tilobox.com");

  // WhatsApp state
  const [waPhone, setWaPhone] = useState("+1 555 234 5678");
  const [waMessage, setWaMessage] = useState("Hello! I would like to get more information.");

  // Phone state
  const [phoneNumber, setPhoneNumber] = useState("+1 555 234 5678");

  // Wi-Fi state
  const [wifiSsid, setWifiSsid] = useState("TiloBox-Guest");
  const [wifiPassword, setWifiPassword] = useState("Connect2026!");
  const [wifiEncryption, setWifiEncryption] = useState<"WPA" | "WEP" | "nopass">("WPA");
  const [wifiHidden, setWifiHidden] = useState(false);
  const [showWifiPassword, setShowWifiPassword] = useState(false);

  // vCard state
  const [vcardName, setVcardName] = useState("Alex Morgan");
  const [vcardOrg, setVcardOrg] = useState("TiloBox Studio");
  const [vcardTitle, setVcardTitle] = useState("Creative Director");
  const [vcardPhone, setVcardPhone] = useState("+1 555 019 2834");
  const [vcardEmail, setVcardEmail] = useState("alex@tilobox.com");
  const [vcardWebsite, setVcardWebsite] = useState("https://tilobox.com");

  // Plain text state
  const [plainText, setPlainText] = useState("Table 14 • VIP Service\nScan for guest privileges");

  // Validation feedback state
  const [validationStatus, setValidationStatus] = useState<{
    isValid: boolean;
    message: string;
  }>({ isValid: true, message: "Valid URL format" });

  // Real-time synchronization and format generation
  useEffect(() => {
    let generatedPayload = "";
    let valid = true;
    let feedback = "";

    switch (activeCategory) {
      case "url": {
        const trimmed = rawUrl.trim();
        if (!trimmed) {
          valid = false;
          feedback = "Please enter a website URL";
        } else {
          // Check if valid URL or valid domain
          try {
            const hasProtocol = /^https?:\/\//i.test(trimmed);
            const testUrl = hasProtocol ? trimmed : `https://${trimmed}`;
            const parsed = new URL(testUrl);
            if (parsed.hostname.includes(".")) {
              generatedPayload = testUrl;
              valid = true;
              feedback = "Valid website URL format";
            } else {
              valid = false;
              feedback = "Please enter a valid domain (e.g. example.com)";
            }
          } catch {
            valid = false;
            feedback = "Invalid URL syntax";
          }
        }
        break;
      }

      case "whatsapp": {
        const cleanedPhone = waPhone.replace(/[^\d+]/g, "");
        if (cleanedPhone.length < 7) {
          valid = false;
          feedback = "Enter phone number with country code (e.g. +1 555...)";
        } else {
          const numberOnly = cleanedPhone.replace("+", "");
          const encodedMsg = waMessage.trim() ? encodeURIComponent(waMessage.trim()) : "";
          generatedPayload = `https://wa.me/${numberOnly}${encodedMsg ? `?text=${encodedMsg}` : ""}`;
          valid = true;
          feedback = "Valid WhatsApp action link ready";
        }
        break;
      }

      case "phone": {
        const cleanedPhone = phoneNumber.replace(/[^\d+]/g, "");
        if (cleanedPhone.length < 6) {
          valid = false;
          feedback = "Enter phone number with country code";
        } else {
          generatedPayload = `tel:${cleanedPhone}`;
          valid = true;
          feedback = "Valid direct telephone link ready";
        }
        break;
      }

      case "wifi": {
        const trimmedSsid = wifiSsid.trim();
        if (!trimmedSsid) {
          valid = false;
          feedback = "Network Name (SSID) is required";
        } else if (wifiEncryption !== "nopass" && wifiPassword.length < 8) {
          valid = false;
          feedback = "WPA password must be at least 8 characters";
        } else {
          const escapeWifi = (str: string) => str.replace(/([\\;,:"])/g, "\\$1");
          const s = escapeWifi(trimmedSsid);
          const p = escapeWifi(wifiPassword);
          const t = wifiEncryption;
          const h = wifiHidden ? "H:true;" : "";
          generatedPayload = `WIFI:S:${s};T:${t};P:${p};${h};`;
          valid = true;
          feedback = "Valid Wi-Fi auto-connect format";
        }
        break;
      }

      case "vcard": {
        const trimmedName = vcardName.trim();
        if (!trimmedName) {
          valid = false;
          feedback = "Full Name is required for vCard";
        } else {
          const vcard = [
            "BEGIN:VCARD",
            "VERSION:3.0",
            `FN:${trimmedName}`,
            vcardOrg.trim() ? `ORG:${vcardOrg.trim()}` : "",
            vcardTitle.trim() ? `TITLE:${vcardTitle.trim()}` : "",
            vcardPhone.trim() ? `TEL;TYPE=CELL,VOICE:${vcardPhone.trim()}` : "",
            vcardEmail.trim() ? `EMAIL;TYPE=PREF,INTERNET:${vcardEmail.trim()}` : "",
            vcardWebsite.trim() ? `URL:${vcardWebsite.trim()}` : "",
            "END:VCARD",
          ]
            .filter(Boolean)
            .join("\n");

          generatedPayload = vcard;
          valid = true;
          feedback = "Valid vCard 3.0 profile ready";
        }
        break;
      }

      case "text": {
        const trimmed = plainText.trim();
        if (!trimmed) {
          valid = false;
          feedback = "Please enter text or notes";
        } else {
          generatedPayload = plainText;
          valid = true;
          feedback = `${trimmed.length} characters encoded`;
        }
        break;
      }
    }

    setValidationStatus({ isValid: valid, message: feedback });

    if (valid && generatedPayload) {
      setGlobalUrl(generatedPayload);
    }
  }, [
    activeCategory,
    rawUrl,
    waPhone,
    waMessage,
    phoneNumber,
    wifiSsid,
    wifiPassword,
    wifiEncryption,
    wifiHidden,
    vcardName,
    vcardOrg,
    vcardTitle,
    vcardPhone,
    vcardEmail,
    vcardWebsite,
    plainText,
    setGlobalUrl,
  ]);

  return (
    <div className="w-full bg-card/60 border border-border/80 rounded-xl p-3 sm:p-4 shadow-2xs backdrop-blur-xs">
      {/* Top Header: Content Category Tabs & Scan Button */}
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-border/60">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-primary" />
            Content
          </span>
          {/* Live Real-Time Validation Pill */}
          <div
            className={cn(
              "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium transition-colors",
              validationStatus.isValid
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
            )}
          >
            {validationStatus.isValid ? (
              <CheckCircle2 className="w-2.5 h-2.5" />
            ) : (
              <AlertCircle className="w-2.5 h-2.5" />
            )}
            <span>{validationStatus.message}</span>
          </div>
        </div>

        {/* Scan Existing QR Code Button */}
        <div className="flex items-center gap-1.5 shrink-0">
          <ScanButton name="Scan QR" />
        </div>
      </div>

      {/* Category Pills Switcher: Sleek, Horizontal, Space-Efficient */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5 py-2">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg border text-center transition-all group select-none",
                isActive
                  ? "bg-primary text-primary-foreground border-primary shadow-2xs font-semibold ring-1 ring-primary/30"
                  : "bg-card/70 text-muted-foreground border-border/70 hover:bg-accent/40 hover:text-foreground"
              )}
            >
              <Icon
                className={cn(
                  "w-3.5 h-3.5 shrink-0 transition-transform group-hover:scale-105",
                  isActive ? "text-primary-foreground" : "text-primary"
                )}
              />
              <span className="text-xs truncate font-medium">
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Stable Form Container with Smooth Transitions (Zero layout jumping) */}
      <div className="pt-1.5 min-h-[105px] flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {/* 1. WEBSITE URL */}
          {activeCategory === "url" && (
            <motion.div
              key="cat-url"
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -3 }}
              transition={{ duration: 0.12 }}
              className="space-y-1.5"
            >
              <div className="relative">
                <Input
                  id="input-url"
                  value={rawUrl}
                  onChange={(e) => setRawUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="h-8 font-mono text-xs bg-background border-border/80 focus-visible:ring-primary pl-2.5 pr-20"
                />
                <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setRawUrl("https://tilobox.com")}
                    className="text-[10px] bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground px-1.5 py-0.5 rounded transition-colors"
                  >
                    Default
                  </button>
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Paste any destination URL, digital menu, portfolio, social media, or cloud PDF file.
              </p>
            </motion.div>
          )}

          {/* 2. WHATSAPP */}
          {activeCategory === "whatsapp" && (
            <motion.div
              key="cat-whatsapp"
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -3 }}
              transition={{ duration: 0.12 }}
              className="space-y-1.5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="input-wa-phone" className="text-[11px] font-medium text-foreground">
                    WhatsApp Number (with Country Code)
                  </Label>
                  <Input
                    id="input-wa-phone"
                    value={waPhone}
                    onChange={(e) => setWaPhone(e.target.value)}
                    placeholder="+1 555 234 5678"
                    className="h-8 font-mono text-xs bg-background border-border/80 focus-visible:ring-primary"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="input-wa-msg" className="text-[11px] font-medium text-foreground">
                    Prefilled Chat Message (Optional)
                  </Label>
                  <Input
                    id="input-wa-msg"
                    value={waMessage}
                    onChange={(e) => setWaMessage(e.target.value)}
                    placeholder="e.g. Hello, I'd like to book / inquire..."
                    className="h-8 text-xs bg-background border-border/80 focus-visible:ring-primary"
                  />
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground">
                When scanned, opens WhatsApp chat directly with your phone number and message prefilled.
              </p>
            </motion.div>
          )}

          {/* 3. PHONE CALL */}
          {activeCategory === "phone" && (
            <motion.div
              key="cat-phone"
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -3 }}
              transition={{ duration: 0.12 }}
              className="space-y-1.5"
            >
              <div className="space-y-1">
                <Label htmlFor="input-phone" className="text-[11px] font-medium text-foreground">
                  Phone / Hotline Number
                </Label>
                <div className="relative">
                  <Input
                    id="input-phone"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+1 555 234 5678"
                    className="h-8 font-mono text-xs bg-background border-border/80 focus-visible:ring-primary"
                  />
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Smartphone camera scan will immediately prompt to dial:{" "}
                <span className="font-mono font-medium text-foreground">
                  {phoneNumber || "+1 555 234 5678"}
                </span>
              </p>
            </motion.div>
          )}

          {/* 4. WI-FI NETWORK */}
          {activeCategory === "wifi" && (
            <motion.div
              key="cat-wifi"
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -3 }}
              transition={{ duration: 0.12 }}
              className="space-y-1.5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="input-wifi-ssid" className="text-[11px] font-medium text-foreground">
                    Network Name (SSID)
                  </Label>
                  <Input
                    id="input-wifi-ssid"
                    value={wifiSsid}
                    onChange={(e) => setWifiSsid(e.target.value)}
                    placeholder="Guest-WiFi"
                    className="h-8 text-xs bg-background border-border/80 focus-visible:ring-primary"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="input-wifi-pass" className="text-[11px] font-medium text-foreground">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="input-wifi-pass"
                      type={showWifiPassword ? "text" : "password"}
                      value={wifiPassword}
                      onChange={(e) => setWifiPassword(e.target.value)}
                      placeholder="Security key"
                      className="h-8 font-mono text-xs bg-background border-border/80 focus-visible:ring-primary pr-8"
                    />
                    <button
                      type="button"
                      onClick={() => setShowWifiPassword(!showWifiPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showWifiPassword ? (
                        <EyeOff className="w-3.5 h-3.5" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="input-wifi-sec" className="text-[11px] font-medium text-foreground">
                    Security Type
                  </Label>
                  <Select
                    value={wifiEncryption}
                    onValueChange={(val: "WPA" | "WEP" | "nopass") =>
                      setWifiEncryption(val)
                    }
                  >
                    <SelectTrigger id="input-wifi-sec" className="h-8 bg-background text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="WPA">WPA / WPA2 / WPA3</SelectItem>
                      <SelectItem value="WEP">WEP (Legacy)</SelectItem>
                      <SelectItem value="nopass">None (Open Network)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <input
                  type="checkbox"
                  id="wifi-hidden"
                  checked={wifiHidden}
                  onChange={(e) => setWifiHidden(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary h-3 w-3 cursor-pointer"
                />
                <label
                  htmlFor="wifi-hidden"
                  className="text-[10px] text-muted-foreground cursor-pointer select-none"
                >
                  Hidden Network (SSID broadcast is disabled)
                </label>
              </div>
            </motion.div>
          )}

          {/* 5. VCARD CONTACT */}
          {activeCategory === "vcard" && (
            <motion.div
              key="cat-vcard"
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -3 }}
              transition={{ duration: 0.12 }}
              className="space-y-1.5"
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="vcard-fn" className="text-[11px] font-medium text-foreground">
                    Full Name *
                  </Label>
                  <Input
                    id="vcard-fn"
                    value={vcardName}
                    onChange={(e) => setVcardName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    className="h-8 text-xs bg-background border-border/80 focus-visible:ring-primary"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="vcard-org" className="text-[11px] font-medium text-foreground">
                    Organization
                  </Label>
                  <Input
                    id="vcard-org"
                    value={vcardOrg}
                    onChange={(e) => setVcardOrg(e.target.value)}
                    placeholder="e.g. Acme Studio"
                    className="h-8 text-xs bg-background border-border/80 focus-visible:ring-primary"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="vcard-title" className="text-[11px] font-medium text-foreground">
                    Job Title
                  </Label>
                  <Input
                    id="vcard-title"
                    value={vcardTitle}
                    onChange={(e) => setVcardTitle(e.target.value)}
                    placeholder="e.g. Lead Designer"
                    className="h-8 text-xs bg-background border-border/80 focus-visible:ring-primary"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="vcard-tel" className="text-[11px] font-medium text-foreground">
                    Phone Number
                  </Label>
                  <Input
                    id="vcard-tel"
                    value={vcardPhone}
                    onChange={(e) => setVcardPhone(e.target.value)}
                    placeholder="+1 555 019 2834"
                    className="h-8 font-mono text-xs bg-background border-border/80 focus-visible:ring-primary"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="vcard-email" className="text-[11px] font-medium text-foreground">
                    Email Address
                  </Label>
                  <Input
                    id="vcard-email"
                    type="email"
                    value={vcardEmail}
                    onChange={(e) => setVcardEmail(e.target.value)}
                    placeholder="alex@example.com"
                    className="h-8 text-xs bg-background border-border/80 focus-visible:ring-primary"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="vcard-web" className="text-[11px] font-medium text-foreground">
                    Website URL
                  </Label>
                  <Input
                    id="vcard-web"
                    value={vcardWebsite}
                    onChange={(e) => setVcardWebsite(e.target.value)}
                    placeholder="https://example.com"
                    className="h-8 text-xs bg-background border-border/80 focus-visible:ring-primary"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* 6. PLAIN TEXT */}
          {activeCategory === "text" && (
            <motion.div
              key="cat-text"
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -3 }}
              transition={{ duration: 0.12 }}
              className="space-y-1.5"
            >
              <div className="space-y-1">
                <Label htmlFor="input-raw-text" className="text-[11px] font-medium text-foreground">
                  Text / Table Code / Note
                </Label>
                <Textarea
                  id="input-raw-text"
                  rows={2}
                  value={plainText}
                  onChange={(e) => setPlainText(e.target.value)}
                  placeholder="Enter raw text, table number, or instructions..."
                  className="text-xs bg-background border-border/80 focus-visible:ring-primary resize-none"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
