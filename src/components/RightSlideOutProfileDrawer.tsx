import React from 'react';
import { createPortal } from 'react-dom';
import { 
  User, 
  Bookmark, 
  MessageSquare, 
  Sparkles, 
  Lock, 
  X, 
  ChevronRight 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RightSlideOutProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  selectedState: string;
  simulatedRole: 'applicant' | 'approved' | 'admin' | 'representative';
  generosityScore: number;
  tradeBalance: number;
  timeBalance: number;
  savedItemsCount: number;
  stayLoggedIn: boolean;
  onToggleStayLoggedIn: (val: boolean) => void;
  onSelectRole: (role: 'applicant' | 'approved' | 'admin' | 'representative') => void;
  onNavigateToTab: (tab: string) => void;
  onOpenAdminOffice: () => void;
  onOpenAdminLogin: () => void;
  onSignOut: () => void;
}

export default function RightSlideOutProfileDrawer({
  isOpen,
  onClose,
  userName,
  selectedState,
  simulatedRole,
  generosityScore,
  tradeBalance,
  timeBalance,
  savedItemsCount,
  stayLoggedIn,
  onToggleStayLoggedIn,
  onSelectRole,
  onNavigateToTab,
  onOpenAdminOffice,
  onOpenAdminLogin,
  onSignOut
}: RightSlideOutProfileDrawerProps) {
  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] pointer-events-auto flex justify-end">
          {/* Full-screen Dark Backdrop covering whole app */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/65 backdrop-blur-xs z-[99999]"
            onClick={onClose}
          />

          {/* Smooth Slide-Out Drawer from the Right - Highest Z-Index above all headers & hero */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative w-84 sm:w-96 max-w-[90vw] h-full bg-[#FAF5EE] border-l-2 border-[#D4AF37]/70 shadow-2xl p-6 overflow-y-auto space-y-5 text-xs font-sans z-[100000] flex flex-col justify-between"
          >
            <div className="space-y-5">
              {/* Drawer Header & Close Button */}
              <div className="flex items-center justify-between border-b border-copper-penny/15 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#D4AF37] shadow-sm shrink-0">
                    <img src="/coppermommies-selflove1-cmc.jpg" alt={userName} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-serif font-bold text-sm text-[#1F1813] truncate">{simulatedRole === 'admin' ? 'Mama Shantrece' : userName}</p>
                    <p className="text-[10px] font-mono text-soft-sage truncate">{selectedState} Circle &bull; Active Matriarch</p>
                    <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-[#D4AF37]/20 text-amber-900 border border-[#D4AF37]/40">
                      {simulatedRole === 'admin' ? 'FOUNDER / ADMIN' : 'TIER 3 MATRIARCH'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl hover:bg-copper-penny/10 text-copper-penny cursor-pointer transition-colors"
                  title="Close Drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Direct Action to My Profile Tab */}
              <button
                onClick={() => {
                  onNavigateToTab('profile');
                  onClose();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full py-3 bg-[#1F1813] hover:bg-[#2A1D16] text-[#FAF5EE] rounded-2xl font-bold font-sans text-xs flex items-center justify-center space-x-2 shadow-md cursor-pointer transition-all active:scale-95"
              >
                <User className="w-4 h-4 text-[#D4AF37]" />
                <span>Go to My Profile Hub</span>
              </button>

              {/* Quick Real-Time Metrics */}
              <div className="grid grid-cols-3 gap-2 p-3 bg-white rounded-2xl border border-copper-penny/15 text-center font-mono text-[10px]">
                <div>
                  <span className="text-gray-400 block text-[9px] uppercase font-bold">Generosity</span>
                  <strong className="text-copper-penny text-xs">{generosityScore} pts</strong>
                </div>
                <div>
                  <span className="text-gray-400 block text-[9px] uppercase font-bold">Trade Balance</span>
                  <strong className="text-[#B87333] text-xs">+{tradeBalance}</strong>
                </div>
                <div>
                  <span className="text-gray-400 block text-[9px] uppercase font-bold">Time Bank</span>
                  <strong className="text-[#1F1813] text-xs">{timeBalance}h</strong>
                </div>
              </div>

              {/* Quick Shortcuts (Matching Nextdoor Slide-Out Navigation) */}
              <div className="space-y-1.5 text-xs">
                <button
                  onClick={() => {
                    onNavigateToTab('profile');
                    onClose();
                  }}
                  className="w-full p-2.5 bg-white hover:bg-neutral-50 rounded-2xl border border-copper-penny/15 flex items-center justify-between font-bold cursor-pointer shadow-2xs"
                >
                  <span className="flex items-center space-x-2.5">
                    <Bookmark className="w-4 h-4 text-copper-penny" />
                    <span>Saved Bookmarks</span>
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-[#FAF5EE] text-[#B87333] px-2 py-0.5 rounded-lg">
                    {savedItemsCount}
                  </span>
                </button>

                <button
                  onClick={() => {
                    onNavigateToTab('academy');
                    onClose();
                  }}
                  className="w-full p-2.5 bg-white hover:bg-neutral-50 rounded-2xl border border-copper-penny/15 flex items-center justify-between font-bold cursor-pointer shadow-2xs"
                >
                  <span className="flex items-center space-x-2.5">
                    <span className="text-base">🎓</span>
                    <span>Mothers Academy &amp; Her-Story</span>
                  </span>
                  <span className="text-[9px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md">
                    Skool Hub
                  </span>
                </button>

                <button
                  onClick={() => {
                    onNavigateToTab('profile');
                    onClose();
                  }}
                  className="w-full p-2.5 bg-white hover:bg-neutral-50 rounded-2xl border border-copper-penny/15 flex items-center justify-between font-bold cursor-pointer shadow-2xs"
                >
                  <span className="flex items-center space-x-2.5">
                    <MessageSquare className="w-4 h-4 text-copper-penny" />
                    <span>Sister Direct Chats</span>
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                    Active
                  </span>
                </button>

                <button
                  onClick={() => {
                    onNavigateToTab('advertise');
                    onClose();
                  }}
                  className="w-full p-2.5 bg-white hover:bg-neutral-50 rounded-2xl border border-copper-penny/15 flex items-center justify-between font-bold cursor-pointer shadow-2xs"
                >
                  <span className="flex items-center space-x-2.5">
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                    <span>Sponsor Ads &amp; Register Biz</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-soft-sage" />
                </button>
              </div>

              {/* Stay Logged In Toggle Option */}
              <div className="p-3 bg-white/70 rounded-2xl border border-copper-penny/15 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-[#1F1813] block">Stay Logged In</span>
                  <span className="text-[9px] font-mono text-gray-500">Persist session across browser restarts</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={stayLoggedIn}
                    onChange={() => onToggleStayLoggedIn(!stayLoggedIn)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#B87333]"></div>
                </label>
              </div>

              {/* ADMIN-ONLY VIEWING MODE SWITCHER - ONLY VISIBLE TO ADMIN */}
              {simulatedRole === 'admin' ? (
                <div className="space-y-2 pt-3 border-t border-copper-penny/15">
                  <span className="text-[10px] font-mono uppercase font-bold text-amber-900 block flex items-center space-x-1">
                    <span>👑</span>
                    <span>Admin Viewing Mode Switcher:</span>
                  </span>
                  <div className="grid grid-cols-2 gap-2 font-mono text-[10px]">
                    <button
                      onClick={() => {
                        onSelectRole('approved');
                        onClose();
                      }}
                      className={`p-2.5 rounded-xl border text-left font-bold transition-all cursor-pointer ${
                        (simulatedRole as string) === 'approved' ? 'bg-[#D4AF37] text-[#1F140E] border-[#D4AF37]' : 'bg-white hover:bg-neutral-50 border-copper-penny/20 text-[#1F140E]'
                      }`}
                    >
                      🕊️ Verified Mother
                    </button>
                    <button
                      onClick={() => {
                        onSelectRole('admin');
                        onNavigateToTab('admin');
                        onClose();
                      }}
                      className={`p-2.5 rounded-xl border text-left font-bold transition-all cursor-pointer ${
                        (simulatedRole as string) === 'admin' ? 'bg-[#D4AF37] text-[#1F140E] border-[#D4AF37]' : 'bg-white hover:bg-neutral-50 border-copper-penny/20 text-[#1F140E]'
                      }`}
                    >
                      👵 Circle Lead
                    </button>
                    <button
                      onClick={() => {
                        onSelectRole('applicant');
                        onNavigateToTab('landing');
                        onClose();
                      }}
                      className={`p-2.5 rounded-xl border text-left font-bold transition-all cursor-pointer ${
                        (simulatedRole as string) === 'applicant' ? 'bg-[#D4AF37] text-[#1F140E] border-[#D4AF37]' : 'bg-white hover:bg-neutral-50 border-copper-penny/20 text-[#1F140E]'
                      }`}
                    >
                      🌱 Seeking Sister
                    </button>
                    <button
                      onClick={() => {
                        onSelectRole('representative');
                        onClose();
                      }}
                      className={`p-2.5 rounded-xl border text-left font-bold transition-all cursor-pointer ${
                        (simulatedRole as string) === 'representative' ? 'bg-[#D4AF37] text-[#1F140E] border-[#D4AF37]' : 'bg-white hover:bg-neutral-50 border-copper-penny/20 text-[#1F140E]'
                      }`}
                    >
                      👑 Circle Host
                    </button>
                  </div>
                  
                  <button
                    onClick={() => {
                      onOpenAdminOffice();
                      onClose();
                    }}
                    className="w-full mt-2 py-2.5 bg-[#1F140E] hover:bg-[#2A1D16] text-[#D4AF37] font-mono text-xs font-bold rounded-xl flex items-center justify-center space-x-2 border border-[#D4AF37]/50 shadow-md cursor-pointer transition-all"
                  >
                    <span>👵 Open Admin Office</span>
                  </button>
                </div>
              ) : (
                <div className="pt-2 border-t border-copper-penny/15">
                  <button
                    onClick={() => {
                      onClose();
                      onOpenAdminLogin();
                    }}
                    className="w-full py-2 bg-transparent hover:bg-[#FAF5EE] text-gray-500 hover:text-[#1F1813] font-mono text-[11px] rounded-xl flex items-center justify-center space-x-1.5 cursor-pointer border border-copper-penny/15"
                  >
                    <Lock className="w-3.5 h-3.5 text-copper-penny" />
                    <span>Admin Office Access</span>
                  </button>
                </div>
              )}
            </div>

            {/* Sign Out Button Footer */}
            <div className="pt-4 border-t border-copper-penny/15 flex items-center justify-between text-xs">
              <button
                onClick={() => {
                  onSignOut();
                  onClose();
                }}
                className="text-rose-700 hover:text-rose-900 font-bold cursor-pointer"
              >
                Sign Out
              </button>
              <button
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('copper_open_pwa_guide'));
                  onClose();
                }}
                className="text-soft-sage hover:underline cursor-pointer font-mono"
              >
                📲 Install App
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
