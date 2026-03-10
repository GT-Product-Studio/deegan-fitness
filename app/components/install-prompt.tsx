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
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setInstalled(true);
      return;
    }

    if (sessionStorage.getItem("pwa-dismissed")) {
      setDismissed(true);
      return;
    }

    const ua = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as Window & { MSStream?: unknown }).MSStream;
    const isAndroid = /Android/.test(ua);

    if (isIOS) setPlatform("ios");
    if (isAndroid) setPlatform("android");

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

  // Android — native install prompt
  if (platform === "android" && deferredPrompt) {
    return (
      <div className={`fixed ${position === "top" ? "top-0" : "bottom-20"} left-0 right-0 z-50 md:hidden`}>
        <div className="bg-[#0A0A0A] border-t border-primary/20 text-white flex items-center gap-3 px-4 py-3 shadow-xl">
          <div className="w-10 h-10 bg-primary/10 border border-primary/30 rounded-lg flex items-center justify-center shrink-0">
            <span className="font-bold text-primary text-lg">D</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold uppercase tracking-widest text-white">Danger Fitness</p>
            <p className="text-xs text-white/50 mt-0.5">Add to home screen</p>
          </div>
          <button
            onClick={install}
            className="bg-primary text-black px-3 py-1.5 text-xs font-bold uppercase tracking-widest shrink-0 hover:bg-primary/90 transition rounded"
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

  // iOS — manual instructions
  if (platform === "ios") {
    return (
      <div className={`fixed ${position === "top" ? "top-0" : "bottom-20"} left-0 right-0 z-50 md:hidden`}>
        <div className="bg-[#0A0A0A] border-t border-primary/20 text-white shadow-xl">
          <div className="flex items-start gap-3 px-4 pt-4 pb-3">
            <div className="w-10 h-10 bg-primary/10 border border-primary/30 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
              <span className="font-bold text-primary text-lg">D</span>
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-widest text-white">Add to Home Screen</p>
              <p className="text-xs text-white/50 mt-1 leading-relaxed">
                Tap <Share className="inline w-3 h-3 mx-0.5 align-middle" /> then{" "}
                <strong className="text-white">&quot;Add to Home Screen&quot;</strong>{" "}
                <Plus className="inline w-3 h-3 mx-0.5 align-middle" /> for the full experience.
              </p>
            </div>
            <button onClick={dismiss} className="text-white/40 hover:text-white transition shrink-0 mt-0.5">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
