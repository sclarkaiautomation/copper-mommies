import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Smartphone, 
  CheckCircle2, 
  Share, 
  PlusSquare, 
  Sparkles, 
  ShieldCheck, 
  X,
  Bell,
  WifiOff
} from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function SidePanelAppInstallCard() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [showDesktopModal, setShowDesktopModal] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);

  useEffect(() => {
    // Check if running in standalone mode
    const standaloneMode = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsStandalone(standaloneMode);

    // Detect iOS
    const ua = window.navigator.userAgent.toLowerCase();
    const isIos = /iphone|ipad|ipod/.test(ua);
    setIsIOS(isIos);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsStandalone(true);
      setInstalledSuccess(true);
      setTimeout(() => setInstalledSuccess(false), 5000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setInstalledSuccess(true);
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      setShowDesktopModal(true);
    }
  };

  return (
    <>
      <div className="p-3.5 bg-gradient-to-br from-[#1F140E] via-[#2A1D16] to-[#1F140E] rounded-2xl border-2 border-[#D4AF37]/50 shadow-md text-[#FAF5EE] space-y-3">
        
        {/* Header with App Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl overflow-hidden border-2 border-[#D4AF37] ring-1 ring-[#D4AF37]/40 shadow-sm shrink-0 bg-[#FAF5EE]">
            <img 
              src="/coppermommies-selflove1-cmc.jpg" 
              alt="Copper Mommies App" 
              className="w-full h-full object-cover" 
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-1.5">
              <h5 className="font-serif font-black text-xs sm:text-sm text-[#FAF5EE]">
                Copper Mommies App
              </h5>
              <span className="px-1.5 py-0.2 rounded-md bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 text-[8px] font-mono font-bold">
                PWA
              </span>
            </div>
            <p className="text-[10px] text-gray-300 font-sans mt-0.5 leading-snug">
              Download to your phone for 1-tap private sanctuary access.
            </p>
          </div>
        </div>

        {/* Feature Highlights Pills */}
        <div className="grid grid-cols-2 gap-1.5 text-[9px] font-mono">
          <div className="flex items-center space-x-1 bg-white/5 border border-white/10 rounded-xl px-2 py-1 text-gray-200">
            <Bell className="w-3 h-3 text-[#D4AF37] shrink-0" />
            <span className="truncate">Instant Alerts</span>
          </div>
          <div className="flex items-center space-x-1 bg-white/5 border border-white/10 rounded-xl px-2 py-1 text-gray-200">
            <WifiOff className="w-3 h-3 text-emerald-400 shrink-0" />
            <span className="truncate">Offline Access</span>
          </div>
        </div>

        {/* Action Button */}
        {installedSuccess ? (
          <div className="p-2.5 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-center space-y-1">
            <div className="flex items-center justify-center space-x-1.5 text-emerald-300 font-bold text-xs font-mono">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Installed Successfully!</span>
            </div>
            <p className="text-[9px] text-emerald-200/80 font-sans">
              Launch directly from your device home screen anytime.
            </p>
          </div>
        ) : isStandalone ? (
          <div className="w-full py-2 px-3 bg-white/10 rounded-xl text-center text-xs font-mono font-bold text-emerald-400 border border-emerald-500/30 flex items-center justify-center space-x-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>App Installed on Device</span>
          </div>
        ) : (
          <button
            type="button"
            id="side-panel-install-app-btn"
            onClick={handleInstallClick}
            className="w-full py-2.5 px-3 bg-gradient-to-r from-[#D4AF37] to-[#B87333] hover:from-[#E5BF42] hover:to-[#C98444] text-[#1F140E] font-bold font-mono text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center space-x-2 cursor-pointer border border-[#D4AF37]/50"
            title="Download & Install Copper Mommies on your phone"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>{isIOS ? '📲 Add to iPhone Home Screen' : '📲 Install Mobile App'}</span>
          </button>
        )}

      </div>

      {/* iOS Step-by-Step Installation Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-[9999999] bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#FAF5EE] rounded-3xl max-w-sm w-full p-5 shadow-2xl border-2 border-[#D4AF37] space-y-4 text-[#1F140E]">
            
            <div className="flex items-center justify-between border-b border-copper-penny/20 pb-3">
              <div className="flex items-center space-x-2">
                <Smartphone className="w-5 h-5 text-[#B87333]" />
                <h4 className="font-serif font-black text-sm text-[#1F140E]">
                  Install on iPhone / iPad
                </h4>
              </div>
              <button 
                onClick={() => setShowIOSModal(false)}
                className="p-1 rounded-lg hover:bg-copper-penny/10 text-gray-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-700 font-sans leading-relaxed">
              In Safari, follow these 3 quick steps to add Copper Mommies directly to your home screen:
            </p>

            <div className="space-y-2.5 text-xs font-sans">
              <div className="flex items-start space-x-2.5 p-2.5 bg-white rounded-xl border border-copper-penny/20">
                <span className="w-5 h-5 rounded-full bg-[#D4AF37] text-[#1F140E] font-bold text-xs flex items-center justify-center shrink-0">1</span>
                <div>
                  <p className="font-bold">Tap the Share Button</p>
                  <p className="text-[11px] text-gray-600">Tap the <Share className="w-3 h-3 inline text-blue-600 mx-0.5" /> icon at the bottom of Safari.</p>
                </div>
              </div>

              <div className="flex items-start space-x-2.5 p-2.5 bg-white rounded-xl border border-copper-penny/20">
                <span className="w-5 h-5 rounded-full bg-[#D4AF37] text-[#1F140E] font-bold text-xs flex items-center justify-center shrink-0">2</span>
                <div>
                  <p className="font-bold">Scroll &amp; Select 'Add to Home Screen'</p>
                  <p className="text-[11px] text-gray-600">Look for the <PlusSquare className="w-3 h-3 inline text-gray-700 mx-0.5" /> square icon in the menu.</p>
                </div>
              </div>

              <div className="flex items-start space-x-2.5 p-2.5 bg-white rounded-xl border border-copper-penny/20">
                <span className="w-5 h-5 rounded-full bg-[#D4AF37] text-[#1F140E] font-bold text-xs flex items-center justify-center shrink-0">3</span>
                <div>
                  <p className="font-bold">Tap 'Add' in Top Right</p>
                  <p className="text-[11px] text-gray-600">The Copper Mommies icon will appear on your phone home screen.</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2.5 bg-[#1F140E] text-[#D4AF37] rounded-xl font-mono text-xs font-bold cursor-pointer transition-all"
            >
              Got It, Thank You!
            </button>

          </div>
        </div>
      )}

      {/* Desktop / Laptop Browser Installation Guide Modal */}
      {showDesktopModal && (
        <div className="fixed inset-0 z-[9999999] bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#FAF5EE] rounded-3xl max-w-sm w-full p-5 shadow-2xl border-2 border-[#D4AF37] space-y-4 text-[#1F140E]">
            
            <div className="flex items-center justify-between border-b border-copper-penny/20 pb-3">
              <div className="flex items-center space-x-2">
                <Download className="w-5 h-5 text-[#B87333]" />
                <h4 className="font-serif font-black text-sm text-[#1F140E]">
                  Install on Laptop / Desktop
                </h4>
              </div>
              <button 
                onClick={() => setShowDesktopModal(false)}
                className="p-1 rounded-lg hover:bg-copper-penny/10 text-gray-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-700 font-sans leading-relaxed">
              To install Copper Mommies as a desktop app on your laptop (Chrome, Edge, or Brave):
            </p>

            <div className="space-y-2.5 text-xs font-sans">
              <div className="flex items-start space-x-2.5 p-2.5 bg-white rounded-xl border border-copper-penny/20">
                <span className="w-5 h-5 rounded-full bg-[#D4AF37] text-[#1F140E] font-bold text-xs flex items-center justify-center shrink-0">1</span>
                <div>
                  <p className="font-bold">Look at your Browser Address Bar</p>
                  <p className="text-[11px] text-gray-600">Look to the far right of the web address bar for an <span className="font-bold text-[#B87333]">Install (🖥️ or ➕)</span> icon.</p>
                </div>
              </div>

              <div className="flex items-start space-x-2.5 p-2.5 bg-white rounded-xl border border-copper-penny/20">
                <span className="w-5 h-5 rounded-full bg-[#D4AF37] text-[#1F140E] font-bold text-xs flex items-center justify-center shrink-0">2</span>
                <div>
                  <p className="font-bold">Or Open Browser Menu (⋮)</p>
                  <p className="text-[11px] text-gray-600">Click the three dots in top-right of Chrome/Edge and select <span className="font-bold">"Save and share" ➔ "Install Copper Mommies..."</span></p>
                </div>
              </div>

              <div className="flex items-start space-x-2.5 p-2.5 bg-white rounded-xl border border-copper-penny/20">
                <span className="w-5 h-5 rounded-full bg-[#D4AF37] text-[#1F140E] font-bold text-xs flex items-center justify-center shrink-0">3</span>
                <div>
                  <p className="font-bold">Launch as Dedicated App</p>
                  <p className="text-[11px] text-gray-600">The Copper Mommies app will open in its own clean window with the logo icon on your taskbar/dock!</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowDesktopModal(false)}
              className="w-full py-2.5 bg-[#1F140E] text-[#D4AF37] rounded-xl font-mono text-xs font-bold cursor-pointer transition-all"
            >
              Got It, Thank You!
            </button>

          </div>
        </div>
      )}
    </>
  );
}
