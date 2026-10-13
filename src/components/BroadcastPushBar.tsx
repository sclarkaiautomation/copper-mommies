import React, { useState, useRef } from 'react';
import { 
  Megaphone, 
  X, 
  ExternalLink, 
  AlertCircle, 
  Sparkles, 
  Bell, 
  ArrowRight,
  Pause,
  Play,
  ChevronLeft,
  ChevronRight,
  Radio,
  Vote,
  Heart,
  Droplets,
  BookOpen
} from 'lucide-react';
import { BroadcastBulletin } from '../types';

interface BroadcastPushBarProps {
  bulletins: BroadcastBulletin[];
  onDismiss?: (id: string) => void;
  onOpenAdminManager?: () => void;
  isAdmin?: boolean;
  onActionClick?: (link: string) => void;
}

export default function BroadcastPushBar({
  bulletins,
  onDismiss,
  onOpenAdminManager,
  isAdmin = false,
  onActionClick
}: BroadcastPushBarProps) {
  const activeBulletins = bulletins.filter(b => b.active);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const [isManualPaused, setIsManualPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const visibleBulletins = activeBulletins.filter(b => !dismissedIds.includes(b.id));

  if (visibleBulletins.length === 0) return null;

  const handleDismissAll = () => {
    const allIds = visibleBulletins.map(b => b.id);
    setDismissedIds(prev => [...prev, ...allIds]);
    if (onDismiss) {
      allIds.forEach(id => onDismiss(id));
    }
  };

  const handleItemClick = (bulletin: BroadcastBulletin, e: React.MouseEvent) => {
    e.stopPropagation();
    if (bulletin.actionLink && onActionClick) {
      onActionClick(bulletin.actionLink);
    } else if (bulletin.actionLink?.startsWith('#')) {
      const el = document.querySelector(bulletin.actionLink);
      el?.scrollIntoView({ behavior: 'smooth' });
    } else if (bulletin.actionLink && (bulletin.actionLink.startsWith('http://') || bulletin.actionLink.startsWith('https://'))) {
      window.open(bulletin.actionLink, '_blank', 'noopener,noreferrer');
    }
  };

  const handleNudge = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const amount = direction === 'left' ? -350 : 350;
      scrollContainerRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  const getUrgencyIcon = (urgency: string, title: string) => {
    const t = title.toLowerCase();
    if (t.includes('vote') || t.includes('ballot') || t.includes('poll')) {
      return <Vote className="w-3 h-3 text-[#D4AF37]" />;
    }
    if (t.includes('care pod') || t.includes('meal') || t.includes('postpartum')) {
      return <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />;
    }
    if (t.includes('apothecary') || t.includes('herb') || t.includes('tonic')) {
      return <Droplets className="w-3 h-3 text-emerald-400" />;
    }
    if (t.includes('nestbright') || t.includes('curriculum') || t.includes('seed')) {
      return <BookOpen className="w-3 h-3 text-teal-400" />;
    }
    if (urgency === 'critical' || urgency === 'urgent') {
      return <AlertCircle className="w-3 h-3 text-rose-400 animate-pulse" />;
    }
    if (urgency === 'high') {
      return <Bell className="w-3 h-3 text-amber-300" />;
    }
    return <Sparkles className="w-3 h-3 text-[#D4AF37]" />;
  };

  const getThemePillClass = (urgency: string, theme?: string) => {
    switch (theme) {
      case 'rose':
        return 'bg-rose-950/80 text-rose-200 border-rose-500/40 hover:border-rose-400 hover:bg-rose-900/90';
      case 'emerald':
        return 'bg-emerald-950/80 text-emerald-200 border-emerald-500/40 hover:border-emerald-400 hover:bg-emerald-900/90';
      case 'copper':
        return 'bg-[#2A1D16]/90 text-[#F5D5BA] border-[#B87333]/50 hover:border-[#D4AF37] hover:bg-[#3D2517]';
      case 'gold':
      default:
        return 'bg-[#20150E]/90 text-[#FAF5EE] border-[#D4AF37]/50 hover:border-[#D4AF37] hover:bg-[#2D1B0E]';
    }
  };

  // Duplicate items for continuous smooth infinite scrolling
  const marqueeItems = [...visibleBulletins, ...visibleBulletins];
  const isPaused = isHovered || isManualPaused;

  return (
    <aside 
      aria-label="Village Community Announcements"
      className="w-full bg-gradient-to-r from-[#170E09] via-[#24150D] to-[#140C07] text-[#FAF5EE] border-b-2 border-[#D4AF37]/40 shadow-lg relative z-40 overflow-hidden select-none transition-all"
    >
      <style>{`
        @keyframes village-marquee-scroll {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        .village-ticker-track {
          display: flex;
          width: max-content;
          will-change: transform;
          animation: village-marquee-scroll 55s linear infinite;
        }
        .village-ticker-track.paused {
          animation-play-state: paused !important;
        }
      `}</style>

      <div className="max-w-full mx-auto flex items-center h-11 sm:h-12 px-2 sm:px-4">
        
        {/* Left Fixed Label: Announcements Beacon */}
        <div className="flex items-center space-x-2 shrink-0 pr-3 sm:pr-4 border-r border-[#D4AF37]/30 z-10 bg-gradient-to-r from-[#170E09] via-[#1A100A] to-transparent py-1">
          <div className="relative flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-ping absolute opacity-75" />
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] relative" />
          </div>
          <div className="flex items-center space-x-1.5">
            <Radio className="w-3.5 h-3.5 text-[#D4AF37] hidden xs:block" />
            <span className="font-mono text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-[#D4AF37]">
              Announcements
            </span>
            <span className="hidden md:inline-block px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30">
              {visibleBulletins.length} Active
            </span>
          </div>
        </div>

        {/* Center: Infinite Scrollable Marquee (Pauses on Hover or Manual Toggle) */}
        <div 
          ref={scrollContainerRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="flex-1 overflow-x-hidden relative flex items-center mx-2 cursor-pointer"
          title={isPaused ? "Click announcement to open, or move mouse away to resume scrolling" : "Hover over announcements to pause and read"}
        >
          {/* Subtle fade masks at left and right edges */}
          <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-[#1A100A] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-[#170E09] to-transparent z-10 pointer-events-none" />

          {/* Marquee Track */}
          <div className={`village-ticker-track items-center py-1 ${isPaused ? 'paused' : ''}`}>
            {marqueeItems.map((bulletin, idx) => {
              const isClickable = !!bulletin.actionLink;
              return (
                <div
                  key={`${bulletin.id}-${idx}`}
                  onClick={(e) => handleItemClick(bulletin, e)}
                  className={`flex items-center space-x-2.5 px-3.5 py-1 sm:py-1.5 mx-2 rounded-xl border transition-all duration-200 group shrink-0 ${getThemePillClass(bulletin.urgency, bulletin.colorTheme)} ${
                    isClickable ? 'cursor-pointer active:scale-[0.98]' : 'cursor-default'
                  }`}
                >
                  {/* Category / Urgency Badge */}
                  <div className="flex items-center space-x-1 shrink-0 bg-black/40 px-2 py-0.5 rounded-lg border border-white/10 text-[9px] sm:text-[10px] font-mono uppercase font-bold tracking-wider">
                    {getUrgencyIcon(bulletin.urgency, bulletin.title)}
                    <span className="ml-1 opacity-90">
                      {bulletin.urgency === 'critical' ? 'Urgent Alert' : 
                       bulletin.urgency === 'high' ? 'Council Notice' : 'Village Broadcast'}
                    </span>
                  </div>

                  {/* Headline & Message */}
                  <div className="flex items-center space-x-2 text-xs">
                    <span className={`font-serif font-bold text-white tracking-wide shrink-0 transition-colors ${
                      isClickable ? 'group-hover:text-[#D4AF37] group-hover:underline' : ''
                    }`}>
                      {bulletin.title}
                    </span>
                    <span className="text-[#FAF5EE]/75 text-[11px] sm:text-xs font-sans max-w-sm sm:max-w-md md:max-w-lg truncate">
                      — {bulletin.message}
                    </span>
                  </div>

                  {/* Clickable Action Pill if Linked */}
                  {bulletin.actionLink && (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-[#D4AF37] hover:bg-[#E5C158] text-[#1F140E] font-mono text-[10px] font-extrabold rounded-lg transition-transform shrink-0 shadow-xs group-hover:scale-105">
                      <span>{bulletin.actionText || 'View'}</span>
                      <ArrowRight className="w-3 h-3 text-[#1F140E]" />
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Controls: Pause/Play, Nudge & Dismiss */}
        <div className="flex items-center space-x-1.5 shrink-0 pl-2 sm:pl-3 border-l border-[#D4AF37]/30 z-10 bg-gradient-to-l from-[#140C07] via-[#1A100A] to-transparent py-1">
          
          {/* Pause / Play Toggle Button */}
          <button
            onClick={() => setIsManualPaused(prev => !prev)}
            className={`p-1.5 rounded-lg border text-[10px] font-mono font-bold flex items-center space-x-1 transition-all cursor-pointer ${
              isPaused 
                ? 'bg-[#D4AF37] text-[#1F140E] border-[#D4AF37]' 
                : 'bg-black/40 text-white/80 hover:text-white border-white/10 hover:border-white/20'
            }`}
            title={isPaused ? "Resume scrolling announcements" : "Pause scrolling announcements"}
            aria-label={isPaused ? "Resume scrolling announcements" : "Pause scrolling announcements"}
          >
            {isPaused ? (
              <>
                <Play className="w-3 h-3 fill-current" />
                <span className="hidden lg:inline text-[9px]">Resume</span>
              </>
            ) : (
              <>
                <Pause className="w-3 h-3 fill-current" />
                <span className="hidden lg:inline text-[9px]">Pause</span>
              </>
            )}
          </button>

          {/* Left/Right manual nudge arrows */}
          <div className="hidden sm:flex items-center space-x-0.5 bg-black/40 rounded-lg border border-white/10 p-0.5">
            <button
              onClick={() => handleNudge('left')}
              className="p-1 hover:bg-white/10 rounded text-white/70 hover:text-white cursor-pointer"
              title="Scroll left"
            >
              <ChevronLeft className="w-3 h-3" />
            </button>
            <button
              onClick={() => handleNudge('right')}
              className="p-1 hover:bg-white/10 rounded text-white/70 hover:text-white cursor-pointer"
              title="Scroll right"
            >
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* Admin shortcut */}
          {isAdmin && onOpenAdminManager && (
            <button
              onClick={onOpenAdminManager}
              className="hidden md:inline-block px-2 py-1 text-[10px] font-mono text-[#D4AF37] hover:text-white hover:underline cursor-pointer"
            >
              Manage
            </button>
          )}

          {/* Dismiss bar button */}
          <button
            onClick={handleDismissAll}
            className="text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-all cursor-pointer"
            title="Dismiss announcements bar"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </aside>
  );
}
