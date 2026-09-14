import React, { useState } from 'react';
import { Megaphone, X, ExternalLink, AlertCircle, Sparkles, Bell, ArrowRight } from 'lucide-react';
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
  const [currentIndex, setCurrentIndex] = useState(0);

  const visibleBulletins = activeBulletins.filter(b => !dismissedIds.includes(b.id));

  if (visibleBulletins.length === 0) return null;

  const current = visibleBulletins[currentIndex % visibleBulletins.length];

  const handleDismiss = (id: string) => {
    setDismissedIds(prev => [...prev, id]);
    if (onDismiss) onDismiss(id);
  };

  const getUrgencyStyles = (urgency: string, theme: string) => {
    switch (theme) {
      case 'rose':
        return 'bg-gradient-to-r from-rose-950 via-rose-900 to-amber-950 text-rose-100 border-rose-600/40';
      case 'emerald':
        return 'bg-gradient-to-r from-emerald-950 via-emerald-900 to-stone-950 text-emerald-100 border-emerald-600/40';
      case 'copper':
        return 'bg-gradient-to-r from-[#2A1D16] via-[#3D2517] to-[#1F140E] text-[#FAF5EE] border-[#B87333]/50';
      case 'gold':
      default:
        return 'bg-gradient-to-r from-[#1F140E] via-[#2D1B0E] to-[#140F0B] text-[#D4AF37] border-[#D4AF37]/50';
    }
  };

  return (
    <div className={`w-full py-2.5 px-4 sm:px-6 border-b text-xs transition-all shadow-md relative z-40 ${getUrgencyStyles(current.urgency, current.colorTheme)}`}>
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
        
        {/* Left: Tag & Message */}
        <div className="flex items-center space-x-2.5 min-w-0 flex-1">
          <div className="flex items-center space-x-1 shrink-0 bg-black/40 px-2 py-0.5 rounded-full border border-white/15 text-[10px] font-mono uppercase tracking-wider font-bold">
            {current.urgency === 'critical' ? (
              <span className="flex items-center text-rose-400">
                <AlertCircle className="w-3 h-3 mr-1 animate-pulse" />
                Priority SOS
              </span>
            ) : current.urgency === 'high' ? (
              <span className="flex items-center text-amber-300">
                <Bell className="w-3 h-3 mr-1 animate-bounce" />
                Grandmother Dispatch
              </span>
            ) : (
              <span className="flex items-center text-[#D4AF37]">
                <Sparkles className="w-3 h-3 mr-1" />
                Village Bulletin
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2 truncate">
            <span className="font-serif font-bold text-sm tracking-wide text-white shrink-0 hidden md:inline">
              {current.title} —
            </span>
            <span className="text-xs text-white/90 truncate font-sans">
              {current.message}
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-3 shrink-0">
          {visibleBulletins.length > 1 && (
            <div className="flex items-center space-x-1 text-[10px] font-mono text-white/70">
              <span>{(currentIndex % visibleBulletins.length) + 1}/{visibleBulletins.length}</span>
              <button 
                onClick={() => setCurrentIndex(i => (i + 1) % visibleBulletins.length)}
                className="px-1.5 py-0.5 bg-black/30 hover:bg-black/50 rounded cursor-pointer text-white"
                title="Next bulletin"
              >
                ▶
              </button>
            </div>
          )}

          {current.actionLink && (
            current.actionLink.startsWith('#') || onActionClick ? (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  if (onActionClick) {
                    onActionClick(current.actionLink!);
                  } else if (current.actionLink?.startsWith('#')) {
                    const el = document.querySelector(current.actionLink);
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="inline-flex items-center space-x-1 px-3 py-1 bg-[#D4AF37] hover:bg-[#E5C158] text-[#1F140E] font-mono text-[11px] font-extrabold rounded-lg transition-all shadow-xs cursor-pointer active:scale-95"
              >
                <span>{current.actionText || 'Explore'}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            ) : (
              <a
                href={current.actionLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 px-3 py-1 bg-[#D4AF37] hover:bg-[#E5C158] text-[#1F140E] font-mono text-[11px] font-extrabold rounded-lg transition-all shadow-xs cursor-pointer active:scale-95"
              >
                <span>{current.actionText || 'Explore'}</span>
                <ArrowRight className="w-3 h-3" />
              </a>
            )
          )}

          {isAdmin && onOpenAdminManager && (
            <button
              onClick={onOpenAdminManager}
              className="text-[10px] font-mono text-white/70 hover:text-white underline cursor-pointer"
            >
              Edit Push
            </button>
          )}

          <button
            onClick={() => handleDismiss(current.id)}
            className="text-white/60 hover:text-white p-1 rounded-full hover:bg-white/10 transition-all cursor-pointer"
            title="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
