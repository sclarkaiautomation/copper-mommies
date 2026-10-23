import React from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  MapPin, 
  Heart, 
  ShieldCheck, 
  ChevronRight, 
  Key, 
  ExternalLink,
  Sparkles,
  Compass,
  Search
} from 'lucide-react';
import { POPULAR_STATES } from '../types';

interface LeftNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  setActiveTab: (tab: any) => void;
  commonsSubTab?: string;
  setCommonsSubTab?: (subTab: any) => void;
  simulatedRole: string;
  userName: string;
  selectedState: string;
  setSelectedState: (state: string) => void;
  onOpenAdminLogin: () => void;
  onOpenMemberLogin: () => void;
  onOpenSupportModal: () => void;
  onOpenSisterProfile: () => void;
}

export const LeftNavDrawer: React.FC<LeftNavDrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  commonsSubTab,
  setCommonsSubTab,
  simulatedRole,
  userName,
  selectedState,
  setSelectedState,
  onOpenAdminLogin,
  onOpenMemberLogin,
  onOpenSupportModal,
  onOpenSisterProfile,
}) => {
  if (!isOpen || typeof document === 'undefined') return null;

  const handleNavigate = (tab: string, commonsSub?: string) => {
    setActiveTab(tab);
    if (commonsSub && setCommonsSubTab) {
      setCommonsSubTab(commonsSub);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onClose();
  };

  const navItems = [
    {
      id: 'landing',
      label: 'Home & Announcements',
      shortLabel: 'Home',
      icon: '🌍',
      desc: 'Founding maternal vision, live updates & core sanctuary pillars',
      badge: 'Main',
      badgeColor: 'bg-[#D4AF37]/20 text-[#1F140E] border-[#D4AF37]/40'
    },
    ...(simulatedRole === 'applicant' ? [
      {
        id: 'vetting',
        label: 'Join Our Community',
        shortLabel: 'Vetting',
        icon: '🔒',
        desc: 'Begin matriarch verification & sanctuary kinship application',
        badge: 'Required',
        badgeColor: 'bg-red-800 text-white border-red-600'
      }
    ] : [
      {
        id: 'commons',
        label: 'The Village Commons',
        shortLabel: 'Commons',
        icon: '🏡',
        desc: 'Feed, free giving, barter items, housing acreage & businesses',
        badge: 'Primary Hub',
        badgeColor: 'bg-emerald-800 text-emerald-100 border-emerald-600',
        sublinks: [
          { label: '🌿 Village Stream', sub: 'feed' },
          { label: '🤝 The Exchange', sub: 'exchange' },
          { label: '🏡 Housing & Land', sub: 'housing' },
          { label: '⭐ Sister Businesses', sub: 'businesses' },
          { label: '📅 Circle Gatherings', sub: 'events' },
          { label: '🗺️ Circle Map', sub: 'map' },
        ]
      },
      {
        id: 'academy',
        label: 'Mothers Academy',
        shortLabel: 'Academy',
        icon: '🎓',
        desc: 'Masterclasses, true matriarchal lineage & Her-Story Sanctuary',
        badge: 'Courses',
        badgeColor: 'bg-purple-900/80 text-purple-200 border-purple-500/50'
      },
      {
        id: 'economy',
        label: 'Cooperative Economy',
        shortLabel: 'Economy',
        icon: '🤝',
        desc: 'Time banking, sovereign barters & member enterprise classifieds',
        badge: 'Trade',
        badgeColor: 'bg-amber-900/80 text-amber-200 border-amber-600/50'
      },
      {
        id: 'healing',
        label: 'Earth & Apothecary',
        shortLabel: 'Apothecary',
        icon: '🌿',
        desc: 'Herbal remedies, postpartum botanical dispensary & teas',
        badge: 'Remedies',
        badgeColor: 'bg-emerald-950 text-emerald-200 border-emerald-700/50'
      },
      {
        id: 'gathering',
        label: 'The Copper Circle',
        shortLabel: 'Circle',
        icon: '✨',
        desc: 'State circle meetups, fireside dialogues & sisterhood polls',
        badge: 'Audio & Live',
        badgeColor: 'bg-[#D4AF37]/30 text-amber-950 border-[#D4AF37]/50'
      },
      {
        id: 'kinship',
        label: 'Kinship & Homeschool',
        shortLabel: 'Kinship',
        icon: '🗝️',
        desc: 'Family vault, homeschooling co-op curriculum & private treasury',
        badge: 'Vault',
        badgeColor: 'bg-stone-800 text-stone-200 border-stone-600'
      }
    ]),
    {
      id: 'advertise',
      label: 'Sponsor & Business Ads',
      shortLabel: 'Sponsors',
      icon: '✨',
      desc: 'Melanated woman-owned business advertising portal',
      badge: 'Portal',
      badgeColor: 'bg-gradient-to-r from-[#D4AF37]/30 to-[#B87333]/30 text-[#1F140E] border-[#D4AF37]/50'
    }
  ];

  return createPortal(
    <div className="fixed inset-0 z-[9999999] pointer-events-auto">
      {/* Dark warm backdrop */}
      <div 
        className="fixed inset-0 bg-black/65 backdrop-blur-xs transition-opacity animate-fade-in-backdrop cursor-pointer"
        onClick={onClose}
        aria-label="Close Navigation Drawer"
      />

      {/* Left Slide-Out Navigation Drawer Panel */}
      <aside 
        aria-label="Sanctuary Navigation Menu"
        className="fixed top-0 left-0 bottom-0 w-[335px] sm:w-[410px] max-w-[92vw] bg-[#FAF5EE] border-r-2 border-[#D4AF37]/80 shadow-[0_0_60px_rgba(0,0,0,0.6)] z-[10000000] p-5 sm:p-6 overflow-y-auto space-y-5 animate-slide-in-left text-xs font-sans flex flex-col justify-between"
      >
        <div className="space-y-5">
          {/* Top Header & Close Button */}
          <div className="flex items-center justify-between border-b border-copper-penny/20 pb-4">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden bg-white border border-[#D4AF37] p-1 shadow-xs shrink-0 flex items-center justify-center">
                <img 
                  src="/Copper_Mommies_w_NoBG4.png" 
                  alt="Copper Mommies Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center space-x-1.5">
                  <h2 className="font-serif font-bold text-base sm:text-lg text-[#1F140E] truncate">
                    Copper Mommies <span className="text-[#D4AF37]">Co.</span>
                  </h2>
                </div>
                <p className="font-mono text-[9px] uppercase tracking-wider font-extrabold text-[#B87333] truncate">
                  Sanctuary Navigation Hubs
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl bg-copper-penny/10 hover:bg-copper-penny/20 text-[#1F1813] cursor-pointer transition-colors border border-copper-penny/20 shrink-0"
              title="Close Menu (Esc)"
              aria-label="Close Menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sitewide Ecosystem & Hashtag Search Card */}
          <button
            type="button"
            onClick={() => {
              onClose();
              window.dispatchEvent(new CustomEvent('copper_open_global_search', { detail: { query: '' } }));
            }}
            className="w-full flex items-center justify-between p-3.5 bg-gradient-to-r from-[#1F140E] to-[#362128] text-white rounded-2xl border border-[#D4AF37]/50 shadow-sm hover:border-[#D4AF37] transition-all cursor-pointer group hover:scale-[1.01] active:scale-[0.99]"
          >
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-[#D4AF37]/20 text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-[#1F140E] transition-colors shrink-0">
                <Search className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="font-serif font-bold text-xs sm:text-sm text-[#FAF5EE] block leading-tight">
                  🔎 Sitewide Ecosystem Search
                </span>
                <span className="font-mono text-[9px] text-[#D4AF37]/90 block">
                  Courses, #hashtags, barter trades &amp; circles
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#D4AF37] group-hover:translate-x-1 transition-transform shrink-0" />
          </button>

          {/* Regional Circle & Perspective Control Card */}
          <div className="p-3.5 bg-white rounded-2xl border border-copper-penny/20 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-[#B87333]" />
                <span className="font-mono text-[10px] font-extrabold uppercase tracking-wider text-[#1F140E]">
                  Regional Circle
                </span>
              </div>
              <span className="text-[10px] font-mono text-soft-sage font-bold">50 States Active</span>
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full bg-[#FAF5EE] border border-copper-penny/25 rounded-xl px-3 py-2 text-xs font-bold text-[#1F1813] font-mono focus:outline-none focus:ring-1 focus:ring-[#D4AF37] cursor-pointer"
                title="Select regional state circle"
              >
                {POPULAR_STATES.map((st) => (
                  <option key={st.code} value={st.code} className="text-[#1F1813]">
                    {st.name} ({st.code} Circle)
                  </option>
                ))}
              </select>
            </div>

            {/* Member Identity / Role quick indicator */}
            <div className="pt-2 border-t border-copper-penny/15 flex items-center justify-between text-[10px] font-mono">
              <span className="text-soft-sage">Logged as:</span>
              <span className="font-bold text-[#1F140E] truncate max-w-[170px]">
                {simulatedRole === 'admin' ? 'Mama Shantrece (Admin)' : userName}
              </span>
            </div>
          </div>

          {/* Core Sanctuary Navigation Pillars */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between px-1 pb-1">
              <span className="font-mono text-[10px] font-extrabold uppercase tracking-widest text-[#B87333]">
                Sanctuary Pillars
              </span>
              <span className="text-[9px] font-mono text-soft-sage">Mobile, Tablet & Desktop</span>
            </div>

            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <div key={item.id} className="space-y-1">
                  <button
                    onClick={() => handleNavigate(item.id)}
                    className={`w-full text-left p-3 rounded-2xl transition-all cursor-pointer flex items-center justify-between group active:scale-[0.99] border ${
                      isActive
                        ? 'bg-[#1F140E] text-[#D4AF37] shadow-md border-[#D4AF37]/50 ring-1 ring-[#D4AF37]/30'
                        : 'bg-white hover:bg-[#F3EADF] text-[#1F1813] border-copper-penny/15'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <span className="text-xl shrink-0">{item.icon}</span>
                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className={`font-serif font-bold text-sm truncate ${isActive ? 'text-[#D4AF37]' : 'text-[#1F140E]'}`}>
                            {item.label}
                          </span>
                          {item.badge && (
                            <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold border shrink-0 ${item.badgeColor}`}>
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className={`text-[10px] truncate ${isActive ? 'text-[#FAF5EE]/70' : 'text-soft-sage'}`}>
                          {item.desc}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isActive ? 'text-[#D4AF37] translate-x-0.5' : 'text-copper-penny/40 group-hover:text-copper-penny'}`} />
                  </button>

                  {/* If active and has sublinks (e.g. Village Commons 5 tabs) */}
                  {isActive && item.sublinks && (
                    <div className="ml-5 pl-3 border-l-2 border-[#D4AF37]/50 py-1 space-y-1">
                      <p className="text-[9px] font-mono font-extrabold uppercase tracking-wider text-soft-sage px-2">
                        Commons Sections:
                      </p>
                      <div className="grid grid-cols-2 gap-1.5">
                        {item.sublinks.map((sub) => {
                          const isSubActive = commonsSubTab === sub.sub;
                          return (
                            <button
                              key={sub.sub}
                              onClick={() => handleNavigate('commons', sub.sub)}
                              className={`text-left px-2.5 py-1.5 rounded-xl text-[11px] font-mono font-bold transition-all cursor-pointer truncate ${
                                isSubActive
                                  ? 'bg-[#D4AF37] text-[#1F140E] shadow-2xs'
                                  : 'bg-white hover:bg-[#F3EADF] text-[#1F140E] border border-copper-penny/20'
                              }`}
                            >
                              {sub.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Admin Office / Founder Access Strip */}
          <div className="pt-2">
            {simulatedRole === 'admin' ? (
              <button
                onClick={() => handleNavigate('admin')}
                className={`w-full p-3 rounded-2xl transition-all cursor-pointer flex items-center justify-between border ${
                  activeTab === 'admin'
                    ? 'bg-[#D4AF37] text-[#1F140E] shadow-md border-[#D4AF37] font-bold'
                    : 'bg-emerald-950 text-emerald-100 hover:bg-emerald-900 border-emerald-600/40'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <span className="text-lg">👵</span>
                  <div className="text-left">
                    <span className="font-serif font-bold text-xs block leading-tight">
                      Founder & Elder Admin Office
                    </span>
                    <span className="text-[9px] font-mono text-emerald-300 block">
                      Moderation, member vetting & co-op settings
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-emerald-300" />
              </button>
            ) : (
              <button
                onClick={() => {
                  onClose();
                  onOpenAdminLogin();
                }}
                className="w-full p-3 rounded-2xl bg-black/40 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] transition-all cursor-pointer flex items-center justify-between text-left"
              >
                <div className="flex items-center space-x-2.5">
                  <Key className="w-4 h-4 text-[#D4AF37]" />
                  <div>
                    <span className="font-mono text-xs font-bold block">
                      Founder & Circle Lead Login
                    </span>
                    <span className="text-[9px] font-mono text-[#D4AF37]/70 block">
                      Admin back office & sanctuary tools
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#D4AF37]" />
              </button>
            )}
          </div>
        </div>

        {/* Drawer Bottom Actions & Utilities */}
        <div className="pt-4 border-t border-copper-penny/20 space-y-2.5 mt-4">
          <div className="grid grid-cols-2 gap-2">
            {/* Support Co-op */}
            <button
              onClick={() => {
                onClose();
                onOpenSupportModal();
              }}
              className="px-3 py-2 rounded-xl bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 text-[#1F140E] border border-[#D4AF37]/60 text-xs font-bold font-mono flex items-center justify-center space-x-1 transition-all cursor-pointer active:scale-95 shadow-2xs"
            >
              <span>💝</span>
              <span>Support Co-op</span>
            </button>

            {/* Sister Profile / Account */}
            {simulatedRole === 'applicant' ? (
              <button
                onClick={() => {
                  onClose();
                  onOpenMemberLogin();
                }}
                className="px-3 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#C5A02E] text-[#1F140E] text-xs font-bold font-mono uppercase tracking-wider flex items-center justify-center space-x-1 transition-all cursor-pointer active:scale-95 shadow-2xs"
              >
                <Key className="w-3.5 h-3.5" />
                <span>Member Login</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  onClose();
                  onOpenSisterProfile();
                }}
                className="px-3 py-2 rounded-xl bg-white hover:bg-[#F3EADF] text-[#1F140E] border border-copper-penny/30 text-xs font-bold font-mono flex items-center justify-center space-x-1 transition-all cursor-pointer active:scale-95 shadow-2xs"
              >
                <span>👤</span>
                <span>My Profile</span>
              </button>
            )}
          </div>

          <div className="text-center pt-2">
            <p className="text-[9px] font-mono text-soft-sage">
              Copper Mommies Co. &bull; Sovereign Maternal Cooperative
            </p>
          </div>
        </div>
      </aside>
    </div>,
    document.body
  );
};
