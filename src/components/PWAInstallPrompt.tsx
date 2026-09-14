import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Smartphone, 
  X, 
  Sparkles, 
  Share, 
  PlusSquare, 
  ShieldCheck, 
  CheckCircle2,
  GripHorizontal,
  RotateCcw,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { motion, useDragControls, useMotionValue } from 'motion/react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);

  const dragControls = useDragControls();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleResetPosition = (e: React.MouseEvent) => {
    e.stopPropagation();
    x.set(0);
    y.set(0);
  };

  useEffect(() => {
    // Check if already running in standalone mode (installed)
    const isStandaloneMode = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    
    setIsStandalone(isStandaloneMode);

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Check if user dismissed prompt recently
    const dismissed = localStorage.getItem('copper_mommies_pwa_dismissed');
    const dismissedTime = dismissed ? parseInt(dismissed, 10) : 0;
    const now = Date.now();
    const isDismissedRecently = now - dismissedTime < 24 * 60 * 60 * 1000; // 24h cooldown

    if (!isStandaloneMode && !isDismissedRecently) {
      // Delay showing prompt slightly for polite onboarding
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 2500);
      return () => clearTimeout(timer);
    }

    // Capture standard PWA install event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      if (!isDismissedRecently) {
        setShowPrompt(true);
      }
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsStandalone(true);
      setShowPrompt(false);
      setInstalledSuccess(true);
      setTimeout(() => setInstalledSuccess(false), 5000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setShowPrompt(false);
        setInstalledSuccess(true);
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      setShowIOSGuide(true);
    } else {
      // Generic instructions
      alert("To install Copper Mommies on your home screen: Tap your browser's menu (⋮ or Share) and select 'Add to Home Screen' or 'Install App'.");
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('copper_mommies_pwa_dismissed', Date.now().toString());
  };

  if (isStandalone) {
    return null; // Already running as installed app
  }

  return (
    <>
      {/* Installed Toast Notification */}
      {installedSuccess && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#1F1813] text-[#FAF5EE] border-2 border-[#D4AF37] px-4 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 text-xs font-mono animate-in slide-in-from-bottom-5 duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <div>
            <p className="font-bold text-[#D4AF37]">Copper Mommies Installed!</p>
            <p className="text-gray-300 text-[11px]">App icon is now on your home screen.</p>
          </div>
        </div>
      )}

      {/* Persistent Mobile/Desktop Floating Install Prompt (Movable & Standalone on Bottom-Left) */}
      {showPrompt && (
        <motion.div 
          id="pwa-install-floating-prompt"
          drag
          dragControls={dragControls}
          dragListener={false}
          dragMomentum={false}
          style={{ x, y }}
          whileDrag={{ scale: 1.02 }}
          className="fixed bottom-4 left-4 sm:left-6 z-40 w-[calc(100%-2rem)] sm:w-auto sm:max-w-sm"
        >
          {isMinimized ? (
            /* Minimized Pill Mode */
            <div className="bg-[#1F1813] text-[#FAF5EE] border-2 border-[#D4AF37] rounded-2xl p-2 sm:p-2.5 shadow-2xl flex items-center space-x-2 backdrop-blur-xl">
              <div 
                onPointerDown={(e) => dragControls.start(e)}
                className="cursor-grab active:cursor-grabbing touch-none text-[#D4AF37] hover:text-white p-1 select-none"
                title="Drag to reposition anywhere"
              >
                <GripHorizontal className="w-4 h-4" />
              </div>

              <button 
                onClick={() => setIsMinimized(false)}
                className="flex items-center space-x-2 text-xs font-serif font-bold text-[#D4AF37] hover:text-white transition-colors cursor-pointer"
                title="Expand Install Banner"
              >
                <div className="w-6 h-6 rounded-lg bg-white p-0.5 border border-[#D4AF37]/50 shadow-xs flex-shrink-0">
                  <img
                    src="/Copper_Mommies_w_NoBG4.png"
                    alt="Copper Mommies Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <span>Install App</span>
                <Maximize2 className="w-3.5 h-3.5 text-[#D4AF37]" />
              </button>

              <button
                onClick={handleInstallClick}
                className="bg-[#D4AF37] hover:bg-[#c29e2e] text-[#1F1813] text-[10px] font-mono font-bold px-2 py-1 rounded-lg cursor-pointer"
                title="Direct Install"
              >
                1-Tap
              </button>

              <button
                onClick={handleDismiss}
                className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                title="Dismiss"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            /* Full Standalone Movable Card */
            <div className="bg-[#1F1813] text-[#FAF5EE] border-2 border-[#D4AF37]/90 rounded-3xl p-4 shadow-2xl backdrop-blur-xl relative overflow-hidden ring-1 ring-black/40">
              {/* Ambient Copper Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#B87333]/20 rounded-full blur-2xl pointer-events-none" />

              {/* Movable Drag Handle Bar */}
              <div 
                onPointerDown={(e) => dragControls.start(e)}
                className="cursor-grab active:cursor-grabbing touch-none flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/10 text-white/70 select-none"
                title="Drag this bar to move this overlay anywhere on your screen"
              >
                <div className="flex items-center space-x-1.5 text-[#D4AF37]">
                  <GripHorizontal className="w-4 h-4" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
                    📲 App Installer • Movable
                  </span>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    type="button"
                    onClick={handleResetPosition}
                    className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[#D4AF37] cursor-pointer"
                    title="Reset position to bottom-left"
                  >
                    ↺ Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsMinimized(true)}
                    className="p-1 rounded-md text-white/70 hover:text-white hover:bg-white/10 cursor-pointer"
                    title="Minimize to floating pill"
                  >
                    <Minimize2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleDismiss}
                    className="p-1 rounded-md text-white/70 hover:text-white hover:bg-white/10 cursor-pointer"
                    title="Dismiss install banner"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Main Card Content */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-11 h-11 rounded-2xl bg-white p-1 border border-[#D4AF37]/50 shadow-md flex-shrink-0">
                    <img
                      src="/Copper_Mommies_w_NoBG4.png"
                      alt="Copper Mommies Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="font-serif font-extrabold text-sm text-[#FAF5EE]">Copper Mommies App</span>
                      <span className="bg-[#D4AF37]/20 text-[#D4AF37] text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border border-[#D4AF37]/40 uppercase">Free</span>
                    </div>
                    <p className="text-[11px] text-gray-300 font-sans">
                      Install to your phone home screen for 1-tap private sanctuary access.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-3.5 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono text-soft-sage flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>No App Store needed</span>
                </span>

                <button
                  type="button"
                  id="install-pwa-button"
                  onClick={handleInstallClick}
                  className="bg-gradient-to-r from-[#D4AF37] to-[#B87333] hover:from-[#c29e2e] hover:to-[#a46328] text-[#1F1813] font-serif font-extrabold text-xs px-4 py-2 rounded-xl shadow-md flex items-center space-x-1.5 cursor-pointer active:scale-95 transition-all"
                >
                  <Download className="w-3.5 h-3.5 text-[#1F1813]" />
                  <span>{isIOS ? 'Add to Home Screen' : 'Install App'}</span>
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* iOS Safari Step-by-Step Installation Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] text-[#1F1813] border-2 border-[#D4AF37] rounded-3xl max-w-sm w-full p-6 shadow-2xl relative animate-in zoom-in-95 duration-200 space-y-4">
            <div className="flex items-center justify-between border-b border-copper-penny/20 pb-3">
              <div className="flex items-center space-x-2">
                <Smartphone className="w-5 h-5 text-[#B87333]" />
                <h3 className="font-serif font-bold text-base text-[#1F1813]">Install on iPhone / iPad</h3>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="p-1 text-gray-500 hover:text-black rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#2A221B]/80 font-sans leading-relaxed">
              Apple does not allow web apps to install automatically with one click. Follow these 3 easy steps in <strong>Safari</strong>:
            </p>

            <div className="space-y-3 font-sans text-xs">
              <div className="flex items-start space-x-3 p-3 bg-white rounded-2xl border border-copper-penny/20">
                <div className="w-7 h-7 rounded-xl bg-[#FAF5EE] text-[#B87333] flex items-center justify-center font-mono font-bold text-xs flex-shrink-0">
                  1
                </div>
                <div>
                  <p className="font-bold text-[#1F1813] flex items-center space-x-1">
                    <span>Tap the</span>
                    <Share className="w-3.5 h-3.5 text-[#B87333] inline" />
                    <span>Share button</span>
                  </p>
                  <p className="text-[11px] text-gray-600">Located at the bottom of your Safari screen.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-white rounded-2xl border border-copper-penny/20">
                <div className="w-7 h-7 rounded-xl bg-[#FAF5EE] text-[#B87333] flex items-center justify-center font-mono font-bold text-xs flex-shrink-0">
                  2
                </div>
                <div>
                  <p className="font-bold text-[#1F1813] flex items-center space-x-1">
                    <span>Scroll & tap</span>
                    <PlusSquare className="w-3.5 h-3.5 text-[#B87333] inline" />
                    <span>"Add to Home Screen"</span>
                  </p>
                  <p className="text-[11px] text-gray-600">You may need to swipe down in the share sheet.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-white rounded-2xl border border-copper-penny/20">
                <div className="w-7 h-7 rounded-xl bg-[#FAF5EE] text-[#B87333] flex items-center justify-center font-mono font-bold text-xs flex-shrink-0">
                  3
                </div>
                <div>
                  <p className="font-bold text-[#1F1813]">Tap "Add" in top-right</p>
                  <p className="text-[11px] text-gray-600">Copper Mommies will now appear right on your home screen!</p>
                </div>
              </div>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full bg-[#1F1813] text-[#FAF5EE] font-serif font-bold text-xs py-2.5 rounded-xl hover:bg-black cursor-pointer shadow-md"
              >
                Got It, Sister!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
