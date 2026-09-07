"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

type PwaContextType = {
  isOnline: boolean;
  isInstallable: boolean;
  isStandalone: boolean;
  hasUpdate: boolean;
  promptInstall: () => Promise<boolean>;
  updateApp: () => void;
};

const PwaContext = createContext<PwaContextType>({
  isOnline: true,
  isInstallable: false,
  isStandalone: false,
  hasUpdate: false,
  promptInstall: async () => false,
  updateApp: () => {},
});

export const PwaProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [hasUpdate, setHasUpdate] = useState<boolean>(false);
  const [swRegistration, setSwRegistration] =
    useState<ServiceWorkerRegistration | null>(null);

  // 1. Check standalone display mode & online state on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    setIsOnline(navigator.onLine);

    const isStandaloneMode =
      window.matchMedia("(display-mode: standalone)").matches ||
      // @ts-expect-error - iOS Safari specific standalone check
      window.navigator.standalone === true;

    setIsStandalone(isStandaloneMode);

    // 2. Network status event listeners
    const handleOnline = () => {
      setIsOnline(true);
      toast.success("Back Online", {
        description:
          "Connection restored. Studio features and assets active.",
      });

      if (swRegistration) {
        swRegistration.update().catch(() => {});
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.warning("Offline Mode Active", {
        description:
          "You can continue generating and styling QR codes locally 100% in-browser.",
      });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // 3. BeforeInstallPrompt event for PWA install button
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsStandalone(true);
      toast.success("Offline Ready!", {
        description:
          "TiloBox QR Studio has been installed on your device for offline use.",
      });
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleAppInstalled);

    // 4. Register Service Worker in production
    if ("serviceWorker" in navigator && process.env.NODE_ENV !== "development") {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          setSwRegistration(registration);

          // Check for updates
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (!newWorker) return;

            newWorker.addEventListener("statechange", () => {
              if (
                newWorker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                // New content available
                setHasUpdate(true);
              }
            });
          });
        })
        .catch((err) => {
          console.warn("[PWA] Service Worker registration failed:", err);
        });

      // Reload when controller changes
      let refreshing = false;
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, [swRegistration]);

  // Install prompt trigger
  const promptInstall = useCallback(async (): Promise<boolean> => {
    if (!deferredPrompt) return false;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setDeferredPrompt(null);
        return true;
      }
    } catch (err) {
      console.error("[PWA] Install prompt failed:", err);
    }
    return false;
  }, [deferredPrompt]);

  // Update app trigger
  const updateApp = useCallback(() => {
    if (swRegistration && swRegistration.waiting) {
      swRegistration.waiting.postMessage({ type: "SKIP_WAITING" });
    } else {
      window.location.reload();
    }
  }, [swRegistration]);

  return (
    <PwaContext.Provider
      value={{
        isOnline,
        isInstallable: !!deferredPrompt && !isStandalone,
        isStandalone,
        hasUpdate,
        promptInstall,
        updateApp,
      }}
    >
      {children}
    </PwaContext.Provider>
  );
};

export const usePwa = () => useContext(PwaContext);
