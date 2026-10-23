import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Radio, 
  Headphones, 
  ExternalLink,
  ChevronDown,
  ListMusic,
  Sparkles,
  Info
} from 'lucide-react';
import { AudioTrack } from '../../types';

interface SidebarAudioPlayerProps {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
  volume: number;
  allTracks?: AudioTrack[];
  onPlayPause: () => void;
  onSeek: (seconds: number) => void;
  onRewind15: () => void;
  onForward15: () => void;
  onSkip: (direction: 'forward' | 'backward') => void;
  onSelectTrack?: (track: AudioTrack) => void;
  onPlaybackRateChange?: (rate: number) => void;
  onVolumeChange?: (vol: number) => void;
  onOpenLounge?: () => void;
}

export default function SidebarAudioPlayer({
  currentTrack,
  isPlaying,
  currentTime,
  duration,
  playbackRate,
  volume,
  allTracks = [],
  onPlayPause,
  onSeek,
  onRewind15,
  onForward15,
  onSkip,
  onSelectTrack,
  onPlaybackRateChange,
  onVolumeChange,
  onOpenLounge
}: SidebarAudioPlayerProps) {
  const [showTrackList, setShowTrackList] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  if (!currentTrack) {
    return (
      <div className="p-4 bg-gradient-to-br from-[#1F140E] to-[#2D1F17] rounded-2xl border border-[#D4AF37]/30 text-[#FAF5EE] space-y-2 text-center">
        <Headphones className="w-6 h-6 text-[#D4AF37] mx-auto opacity-70" />
        <p className="text-xs font-serif font-bold">Sanctuary Audio &amp; Radio</p>
        <p className="text-[10px] text-gray-400 font-sans">No track selected.</p>
        {allTracks.length > 0 && onSelectTrack && (
          <button
            onClick={() => onSelectTrack(allTracks[0])}
            className="px-3 py-1.5 bg-[#D4AF37] text-[#1F140E] rounded-xl font-mono text-[10px] font-bold"
          >
            Load Casual Corner Talk
          </button>
        )}
      </div>
    );
  }

  const effectiveDuration = duration > 0 ? duration : currentTrack.durationSeconds || 1800;
  const progressPercent = effectiveDuration > 0 ? Math.min(100, Math.max(0, (currentTime / effectiveDuration) * 100)) : 0;

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickPos = (e.clientX - rect.left) / rect.width;
    const newSeconds = Math.max(0, Math.min(effectiveDuration, clickPos * effectiveDuration));
    onSeek(newSeconds);
  };

  const speedOptions = [1.0, 1.25, 1.5, 2.0];

  return (
    <div className="p-4 bg-gradient-to-br from-[#1F140E] via-[#2A1D16] to-[#140F0B] rounded-2xl border-2 border-[#D4AF37]/50 shadow-md text-[#FAF5EE] space-y-3">
      
      {/* Header: Title & Live Indicator */}
      <div className="flex items-center justify-between border-b border-copper-penny/20 pb-2">
        <div className="flex items-center space-x-2">
          <span className="text-sm">🎙️</span>
          <div>
            <h5 className="font-serif font-bold text-xs text-[#FAF5EE]">
              Sanctuary Audio &amp; Radio
            </h5>
            <span className="text-[9px] font-mono text-[#D4AF37] block leading-tight">
              {currentTrack.series === 'casual-corner' ? 'Casual Corner Sisterhood Talk' : 'Sacred Maternal Audio'}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          {isPlaying ? (
            <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-[9px] font-mono font-bold border border-emerald-500/50">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>PLAYING</span>
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-gray-300 text-[9px] font-mono border border-white/10">
              PAUSED
            </span>
          )}
        </div>
      </div>

      {/* Track Info & Artwork */}
      <div className="flex items-center space-x-3 pt-0.5">
        <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-[#D4AF37]/40 shadow-xs shrink-0 bg-black/40">
          <img 
            src={currentTrack.coverImage || '/The Casual Corner Talk.jpeg'} 
            alt={currentTrack.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/The Casual Corner Talk.jpeg';
            }}
          />
          {isPlaying && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="flex items-end space-x-0.5 h-3">
                <span className="w-0.5 bg-[#D4AF37] h-full animate-bounce" />
                <span className="w-0.5 bg-[#D4AF37] h-2/3 animate-bounce delay-75" />
                <span className="w-0.5 bg-[#D4AF37] h-4/5 animate-bounce delay-150" />
              </div>
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h6 className="font-serif font-bold text-xs text-[#FAF5EE] line-clamp-1 leading-snug">
            {currentTrack.title}
          </h6>
          <p className="text-[10px] text-soft-sage font-mono line-clamp-1 mt-0.5">
            {currentTrack.host || 'Mama Jamila'} &bull; {currentTrack.hostRole || 'Grandmother Council'}
          </p>
        </div>
      </div>

      {/* Progress Scrubber */}
      <div className="space-y-1">
        <div 
          onClick={handleProgressBarClick}
          className="relative w-full h-2 bg-white/15 hover:bg-white/20 rounded-full overflow-hidden cursor-pointer transition-colors group"
          title="Click to jump / scrub audio"
        >
          <div 
            className="h-full bg-gradient-to-r from-[#B87333] via-[#D4AF37] to-[#F3DE8A] rounded-full transition-all duration-100"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-gray-400">
          <span>{formatTime(currentTime)}</span>
          <span className="text-[#D4AF37] font-bold">
            -{formatTime(Math.max(0, effectiveDuration - currentTime))}
          </span>
          <span>{formatTime(effectiveDuration)}</span>
        </div>
      </div>

      {/* Core Transport Controls: Prev, Rewind 15s, Play/Pause, Forward 15s, Next */}
      <div className="flex items-center justify-between pt-1">
        
        {/* Previous Track */}
        <button
          type="button"
          onClick={() => onSkip('backward')}
          className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 cursor-pointer transition-all active:scale-95"
          title="Previous Track"
        >
          <SkipBack className="w-4 h-4" />
        </button>

        {/* Rewind 15s */}
        <button
          type="button"
          onClick={onRewind15}
          className="px-2 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#FAF5EE] font-mono text-[10px] font-bold flex items-center space-x-1 cursor-pointer transition-all active:scale-95 border border-white/10"
          title="Rewind 15 seconds"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>15s</span>
        </button>

        {/* Big Central Play / Pause Button */}
        <button
          type="button"
          onClick={onPlayPause}
          className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#B87333] via-[#D4AF37] to-[#F3DE8A] text-[#1F140E] flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer font-black"
          title={isPlaying ? 'Pause Audio' : 'Play Audio'}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 fill-current" />
          ) : (
            <Play className="w-5 h-5 fill-current translate-x-0.5" />
          )}
        </button>

        {/* Forward 15s */}
        <button
          type="button"
          onClick={onForward15}
          className="px-2 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#FAF5EE] font-mono text-[10px] font-bold flex items-center space-x-1 cursor-pointer transition-all active:scale-95 border border-white/10"
          title="Forward 15 seconds"
        >
          <span>15s</span>
          <RotateCw className="w-3.5 h-3.5 text-[#D4AF37]" />
        </button>

        {/* Next Track */}
        <button
          type="button"
          onClick={() => onSkip('forward')}
          className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 cursor-pointer transition-all active:scale-95"
          title="Next Track"
        >
          <SkipForward className="w-4 h-4" />
        </button>

      </div>

      {/* Secondary Bar: Speed, Volume Toggle, Episode Switcher, Open Lounge */}
      <div className="flex items-center justify-between pt-1 border-t border-copper-penny/20 text-[10px] font-mono text-gray-300">
        
        {/* Speed cycle button */}
        {onPlaybackRateChange && (
          <button
            type="button"
            onClick={() => {
              const nextIdx = (speedOptions.indexOf(playbackRate) + 1) % speedOptions.length;
              onPlaybackRateChange(speedOptions[nextIdx]);
            }}
            className="px-2 py-0.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold cursor-pointer"
            title="Playback speed"
          >
            {playbackRate}x
          </button>
        )}

        {/* Volume popup toggle */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowVolumeSlider(!showVolumeSlider)}
            className="p-1 hover:text-white rounded-lg hover:bg-white/10 cursor-pointer"
            title="Volume Control"
          >
            {volume === 0 ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-[#D4AF37]" />}
          </button>

          {showVolumeSlider && onVolumeChange && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-[#1F140E] border border-[#D4AF37]/50 rounded-xl p-2 shadow-xl z-20 flex items-center space-x-2">
              <input 
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                className="w-20 accent-[#D4AF37] cursor-pointer"
              />
              <span className="text-[9px] text-[#D4AF37]">{Math.round(volume * 100)}%</span>
            </div>
          )}
        </div>

        {/* Track switcher toggle */}
        {allTracks.length > 1 && onSelectTrack && (
          <button
            type="button"
            onClick={() => setShowTrackList(!showTrackList)}
            className={`px-2 py-0.5 rounded-lg border text-[10px] flex items-center space-x-1 cursor-pointer transition-colors ${
              showTrackList ? 'bg-[#D4AF37] text-[#1F140E] border-[#D4AF37] font-bold' : 'bg-white/10 text-white border-white/15 hover:bg-white/20'
            }`}
            title="Browse & Switch Episodes"
          >
            <ListMusic className="w-3 h-3" />
            <span>Episodes ({allTracks.length})</span>
          </button>
        )}

        {/* Open Full Lounge Tab */}
        {onOpenLounge && (
          <button
            type="button"
            onClick={onOpenLounge}
            className="text-[#D4AF37] hover:underline flex items-center space-x-0.5 font-bold cursor-pointer"
            title="Open Audio Sanctuary Lounge"
          >
            <span>Full Hub</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </button>
        )}

      </div>

      {/* Episode Selection Drawer (When expanded) */}
      {showTrackList && allTracks.length > 0 && onSelectTrack && (
        <div className="pt-2 border-t border-copper-penny/20 space-y-1.5 max-h-48 overflow-y-auto pr-1">
          <span className="text-[9px] uppercase font-bold text-gray-400 block">Select Talk / Audio:</span>
          {allTracks.map((t) => {
            const isSelected = t.id === currentTrack.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  onSelectTrack(t);
                  setShowTrackList(false);
                }}
                className={`w-full p-2 rounded-xl text-left text-[10px] flex items-center justify-between transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-[#D4AF37] text-[#1F140E] font-bold shadow-xs' 
                    : 'bg-white/5 hover:bg-white/10 text-gray-200'
                }`}
              >
                <div className="truncate min-w-0 pr-2">
                  <span className="block truncate">{t.title}</span>
                  <span className={`text-[8px] font-mono block ${isSelected ? 'text-[#1F140E]/80' : 'text-gray-400'}`}>
                    {t.host || 'Mama Jamila'} &bull; {formatTime(t.durationSeconds)}
                  </span>
                </div>
                {isSelected && (
                  <span className="text-xs shrink-0">▶</span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Helpful Ambient Background Notice */}
      <div className="bg-white/5 rounded-xl p-2 flex items-start space-x-1.5 text-[9px] text-gray-300 font-sans border border-white/10">
        <Info className="w-3 h-3 text-[#D4AF37] shrink-0 mt-0.5" />
        <p className="leading-tight">
          Audio continues playing smoothly when you close this panel so you can scroll, post reflections, and browse the village uninterrupted.
        </p>
      </div>

    </div>
  );
}
