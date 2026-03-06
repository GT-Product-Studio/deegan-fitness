"use client";

import { useEffect, useState } from "react";
import { X, Share, Plus } from "lucide-react";

type Platform = "android" | "ios" | null;

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt({ position = "bottom" }: { position?: "top" | "bottom" }) {
  const [platform, setPlatform] = useState<Platform>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Don't show if already running as installed PWA
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setInstalled(true);
      return;
    }

    // Don't show if user already dismissed this session
    if (sessionStorage.getItem("pwa-dismissed")) {
      setDismissed(true);
      return;
    }

    const ua = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as Window & { MSStream?: unknown }).MSStream;
    const isAndroid = /Android/.test(ua);

    if (isIOS) setPlatform("ios");
    if (isAndroid) setPlatform("android");

    // Android/Chrome: capture the install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  function dismiss() {
    sessionStorage.setItem("pwa-dismissed", "1");
    setDismissed(true);
  }

  async function install() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setInstalled(true);
    setDeferredPrompt(null);
    dismiss();
  }

  if (installed || dismissed || !platform) return null;

  // Android — native install prompt available
  if (platform === "android" && deferredPrompt) {
    return (
      <div className={`fixed ${position === "top" ? "top-0" : "bottom-20"} left-0 right-0 z-50 md:hidden`}>
        <div className="bg-foreground text-white flex items-center gap-3 px-4 py-3 shadow-xl">
          <img src="/icons/icon-192.png" alt="" className="w-10 h-10 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold uppercase tracking-widest">Add to Home Screen</p>
            <p className="text-xs text-white/60 mt-0.5">Get the full app experience</p>
          </div>
          <button
            onClick={install}
            className="bg-gold text-black px-3 py-1.5 text-xs font-bold uppercase tracking-widest shrink-0 hover:bg-gold/90 transition"
          >
            Install
          </button>
          <button onClick={dismiss} className="text-white/40 hover:text-white transition shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // iOS — manual instructions (no native prompt)
  if (platform === "ios") {
    return (
      <div className={`fixed ${position === "top" ? "top-0" : "bottom-20"} left-0 right-0 z-50 md:hidden`}>
        <div className="bg-foreground text-white shadow-xl">
          <div className="flex items-start gap-3 px-4 pt-4 pb-3">
            <img src="/icons/icon-192.png" alt="" className="w-10 h-10 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-widest">Add to Home Screen</p>
              <p className="text-xs text-white/60 mt-1 leading-relaxed">
                Tap <Share className="inline w-3 h-3 mx-0.5 align-middle" /> then{" "}
                <strong className="text-white">&quot;Add to Home Screen&quot;</strong>{" "}
                <Plus className="inline w-3 h-3 mx-0.5 align-middle" /> for the full app experience.
              </p>
            </div>
            <button onClick={dismiss} className="text-white/40 hover:text-white transition shrink-0 mt-0.5">
              <X className="w-4 h-4" />
            </button>
          </div>
          {/* iOS arrow pointing to share button */}
          <div className="h-px bg-white/10 mx-4" />
          <div className="flex justify-center pb-1.5 pt-1">
            <div className="w-1.5 h-1.5 bg-white/20 rotate-45 translate-y-0.5" />
          </div>
        </div>
      </div>
    );
  }

  return null;
}
