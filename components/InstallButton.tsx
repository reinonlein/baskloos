import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    // Detect iOS
    const iOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    setIsIOS(iOS);

    // Detect Android
    const android = /Android/.test(navigator.userAgent);
    setIsAndroid(android);

    // Check if app is already installed
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true
    ) {
      setIsInstalled(true);
      return;
    }

    // For iOS and Android mobile, show button even without beforeinstallprompt
    if ((iOS || android) && window.innerWidth < 1024) {
      setShowButton(true);
    }

    const handler = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Save the event so it can be triggered later
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowButton(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Check if app was just installed
    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setShowButton(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = async () => {
    // For iOS, show instructions
    if (isIOS) {
      setShowInstructions(true);
      return;
    }

    // For Android with prompt available, use it
    if (deferredPrompt) {
      try {
        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === "accepted") {
          setIsInstalled(true);
        }

        // Clear the deferredPrompt
        setDeferredPrompt(null);
        setShowButton(false);
      } catch (error) {
        console.error("Error showing install prompt:", error);
        // Fallback to instructions if prompt fails
        setShowInstructions(true);
      }
    } else if (isAndroid) {
      // Android without prompt - show instructions
      setShowInstructions(true);
    }
  };

  // Don't show button if already installed
  if (isInstalled) {
    return null;
  }

  if (showInstructions) {
    return (
      <div className="mt-4 rounded-lg bg-white/10 p-4 text-center text-white backdrop-blur-sm">
        <p className="mb-2 text-sm font-semibold">📱 App toevoegen aan startscherm</p>
        {isIOS ? (
          <div className="text-xs text-white/80">
            <p className="mb-2">1. Tik op het deelmenu (📤) onderaan</p>
            <p>2. Selecteer "Voeg toe aan beginscherm"</p>
          </div>
        ) : (
          <div className="text-xs text-white/80">
            <p className="mb-2">1. Tik op het menu (⋮) rechtsboven</p>
            <p>2. Selecteer "Toevoegen aan startscherm" of "Installeren"</p>
          </div>
        )}
        <button
          onClick={() => setShowInstructions(false)}
          className="mt-2 text-xs text-white/60 underline"
        >
          Sluiten
        </button>
      </div>
    );
  }

  // Don't show button if no prompt available and not mobile
  if (!showButton && !deferredPrompt) {
    return null;
  }

  return (
    <button
      onClick={handleInstallClick}
      className="mt-4 rounded-lg bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
      aria-label="App toevoegen aan startscherm"
    >
      📱 {isIOS || isAndroid ? "Toevoegen aan startscherm" : "Installeer app"}
    </button>
  );
}

