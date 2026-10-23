import React from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  X, 
  Headphones, 
  ChevronUp, 
  Maximize2 
} from 'lucide-react';
import { AudioTrack } from '../../types';

interface MiniStickyAudioPlayerProps {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onPlayPause: () => void;
  onRewind15: () => void;
  onForward15: () => void;
  onClose: () => void;
  onOpenSidebar: () => void;
}

export default function MiniStickyAudioPlayer({
  currentTrack,
  isPlaying,
  currentTime,
  duration,
  onPlayPause,
  onRewind15,
  onForward15,
  onClose,
  onOpenSidebar
}: MiniStickyAudioPlayerProps) {
  if (!currentTrack) return null;

  const effectiveDuration = duration > 0 ? duration : currentTrack.durationSeconds || 1800;
  const progressPercent = effectiveDuration > 0 ? Math.min(100, Math.max(0, (currentTime / effectiveDuration) * 100)) : 0;

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <aside 
      aria-label="Background Audio Player"
      className="fixed bottom-20 sm:bottom-6 right-3 sm:right-6 z-[99999] max-w-[340px] sm:max-w-[400px] w-full bg-[#1F140E]/95 backdrop-blur-md text-[#FAF5EE] rounded-2xl border-2 border-[#D4AF37]/60 shadow-[0_8px_30px_rgba(0,0,0,0.6)] p-3 space-y-2 animate-slide-in-up transition-all font-sans"
    >
      {/* Top Mini Scrubber Line */}
      <div className="w-full h-1 bg-white/15 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-[#B87333] via-[#D4AF37] to-[#F3DE8A] transition-all duration-150"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="flex items-center justify-between gap-2.5">
        
        {/* Track Thumbnail & Title (Click to open sidebar player) */}
        <div 
          onClick={onOpenSidebar}
          className="flex items-center space-x-2.5 min-w-0 flex-1 cursor-pointer group"
          title="Click to expand audio player in sidebar"
        >
          <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-[#D4AF37]/50 shrink-0 bg-black/40">
            <img 
              src={currentTrack.coverImage || '/The Casual Corner Talk.jpeg'} 
              alt={currentTrack.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/The Casual Corner Talk.jpeg';
              }}
            />
            {isPlaying && (
              <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="font-serif font-bold text-xs text-[#FAF5EE] truncate group-hover:text-[#D4AF37] transition-colors leading-tight">
              {currentTrack.title}
            </p>
            <div className="flex items-center space-x-1 text-[10px] font-mono text-soft-sage truncate mt-0.5">
              <span>{formatTime(currentTime)}</span>
              <span>/</span>
              <span>{formatTime(effectiveDuration)}</span>
              <span className="hidden sm:inline">&bull;</span>
              <span className="truncate hidden sm:inline">{currentTrack.host || 'Mama Jamila'}</span>
            </div>
          </div>
        </div>

        {/* Transport Controls: Rewind 15s, Play/Pause, Forward 15s, Close */}
        <div className="flex items-center space-x-1 shrink-0">
          
          {/* Rewind 15s */}
          <button
            type="button"
            onClick={onRewind15}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 cursor-pointer transition-colors active:scale-90"
            title="Rewind 15 seconds"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#D4AF37]" />
          </button>

          {/* Play / Pause Toggle */}
          <button
            type="button"
            onClick={onPlayPause}
            className="w-8 h-8 rounded-full bg-[#D4AF37] hover:bg-[#C5A02E] text-[#1F140E] flex items-center justify-center shadow-md cursor-pointer transition-all active:scale-95 font-bold"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current translate-x-0.5" />
            )}
          </button>

          {/* Forward 15s */}
          <button
            type="button"
            onClick={onForward15}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 cursor-pointer transition-colors active:scale-90"
            title="Forward 15 seconds"
          >
            <RotateCw className="w-3.5 h-3.5 text-[#D4AF37]" />
          </button>

          {/* Expand to sidebar player */}
          <button
            type="button"
            onClick={onOpenSidebar}
            className="p-1.5 rounded-lg text-white/70 hover:text-[#D4AF37] hover:bg-white/10 cursor-pointer transition-colors hidden xs:block"
            title="Expand to Full Sidebar Player"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>

          {/* Close & Stop Player */}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-white/10 cursor-pointer transition-colors"
            title="Close / Stop Audio Player"
          >
            <X className="w-4 h-4" />
          </button>

        </div>

      </div>
    </aside>
  );
}
