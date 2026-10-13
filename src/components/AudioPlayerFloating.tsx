import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  X, 
  Radio, 
  Sparkles, 
  Bookmark, 
  FileText, 
  Share2, 
  Clock, 
  ChevronUp, 
  ChevronDown, 
  Leaf, 
  BookOpen, 
  Check, 
  Heart,
  Volume1,
  Headphones,
  GripHorizontal
} from 'lucide-react';
import { motion, useDragControls, useMotionValue } from 'motion/react';
import { AudioTrack, AudioTimestamp, ReferencedRemedy } from '../types';

interface AudioPlayerFloatingProps {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onClose: () => void;
  onSeek: (seconds: number) => void;
  currentTime: number;
  duration: number;
  playbackRate: number;
  onChangePlaybackRate?: (rate: number) => void;
  onPlaybackRateChange?: (rate: number) => void;
  volume: number;
  onChangeVolume?: (vol: number) => void;
  onVolumeChange?: (vol: number) => void;
  onSelectTrack?: (track: AudioTrack) => void;
  allTracks?: AudioTrack[];
  onSkip?: (direction: 'forward' | 'backward') => void;
  onOpenLounge?: () => void;
}

export default function AudioPlayerFloating({
  currentTrack,
  isPlaying,
  onPlayPause,
  onClose,
  onSeek,
  currentTime,
  duration,
  playbackRate,
  onChangePlaybackRate,
  onPlaybackRateChange,
  volume,
  onChangeVolume,
  onVolumeChange,
  onSelectTrack,
  allTracks = [],
  onSkip,
  onOpenLounge
}: AudioPlayerFloatingProps) {
  const handleRateChange = onPlaybackRateChange || onChangePlaybackRate || (() => {});
  const handleVolChange = onVolumeChange || onChangeVolume || (() => {});
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showTimestamps, setShowTimestamps] = useState(true);
  const [showRemedyModal, setShowRemedyModal] = useState<ReferencedRemedy | null>(null);
  const [copiedRecipe, setCopiedRecipe] = useState(false);
  const [liked, setLiked] = useState(false);

  const dragControls = useDragControls();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleResetPosition = (e: React.MouseEvent) => {
    e.stopPropagation();
    x.set(0);
    y.set(0);
  };

  if (!currentTrack) return null;

  const effectiveDuration = duration > 0 ? duration : currentTrack.durationSeconds;
  const progressPercent = effectiveDuration > 0 ? (currentTime / effectiveDuration) * 100 : 0;

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const hours = Math.floor(secs / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    const seconds = Math.floor(secs % 60);
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Find active timestamp based on current time
  const activeTimestamp = currentTrack.timestamps?.slice().reverse().find(ts => currentTime >= ts.timeSeconds) || currentTrack.timestamps?.[0];

  const handleCopyRecipe = (remedy: ReferencedRemedy) => {
    const text = `🌿 ${remedy.name}\nPurpose: ${remedy.purpose}\n\nIngredients:\n${remedy.ingredients.map(i => `• ${i}`).join('\n')}\n\nInstructions:\n${remedy.instructions}\n\n— Shared from Copper Mommies Audio Sanctuary`;
    navigator.clipboard.writeText(text);
    setCopiedRecipe(true);
    setTimeout(() => setCopiedRecipe(false), 3000);
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const targetSeconds = ratio * effectiveDuration;
    onSeek(targetSeconds);
  };

  return (
    <>
      {/* Floating Mini Player / Docked Bar (Movable & Standalone on Bottom-Right) */}
      <motion.div 
        id="audio-sanctuary-floating-player"
        drag
        dragControls={dragControls}
        dragListener={false}
        dragMomentum={false}
        style={{ x, y }}
        whileDrag={{ scale: 1.02 }}
        className="fixed bottom-4 right-4 sm:right-6 z-50 w-[calc(100%-2rem)] sm:w-auto sm:max-w-xl"
      >
        {isMinimized ? (
          /* Minimized Floating Audio Pill */
          <div className="bg-gradient-to-r from-[#1F140E] via-[#2D1B0E] to-[#140F0B] border-2 border-[#D4AF37] text-[#FAF5EE] rounded-2xl p-2 sm:p-2.5 shadow-2xl flex items-center space-x-2.5 backdrop-blur-xl ring-1 ring-black/50">
            <div 
              onPointerDown={(e) => dragControls.start(e)}
              className="cursor-grab active:cursor-grabbing touch-none text-[#D4AF37] hover:text-white p-1 select-none"
              title="Drag to reposition anywhere"
            >
              <GripHorizontal className="w-4 h-4" />
            </div>

            {/* Mini Cover & Play/Pause */}
            <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-[#D4AF37]/40 shadow-xs group">
              <img 
                src={currentTrack.coverImage || '/The Casual Corner Talk.jpeg'} 
                alt={currentTrack.title}
                className="w-full h-full object-cover"
              />
              <button 
                onClick={onPlayPause}
                className="absolute inset-0 bg-black/40 flex items-center justify-center text-[#D4AF37] hover:bg-black/60 transition-all cursor-pointer"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
              </button>
            </div>

            {/* Track Snippet & Click to Expand */}
            <div 
              onClick={() => setIsMinimized(false)}
              className="min-w-0 flex-1 cursor-pointer"
              title="Click to expand full player"
            >
              <div className="flex items-center space-x-1.5">
                <span className="text-[9px] font-mono font-bold text-[#D4AF37] uppercase truncate">
                  🎙️ Casual Corner
                </span>
                {isPlaying && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                )}
              </div>
              <p className="text-[11px] font-serif font-bold text-white truncate max-w-[130px] sm:max-w-[180px]">
                {currentTrack.title}
              </p>
            </div>

            {/* Quick Expand Button */}
            <button
              type="button"
              onClick={() => setIsMinimized(false)}
              className="p-1 text-[#D4AF37] hover:text-white hover:bg-white/10 rounded-lg cursor-pointer"
              title="Expand full player"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-white/60 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer"
              title="Close player"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          /* Full Standalone Player with Top Drag Handle Bar */
          <div className="bg-gradient-to-r from-[#1F140E] via-[#2D1B0E] to-[#140F0B] border-2 border-[#D4AF37]/80 text-[#FAF5EE] rounded-3xl p-3.5 sm:p-4 shadow-2xl backdrop-blur-xl ring-1 ring-black/50">
            
            {/* Movable Drag Handle Bar */}
            <div 
              onPointerDown={(e) => dragControls.start(e)}
              className="cursor-grab active:cursor-grabbing touch-none flex items-center justify-between pb-2 mb-2.5 border-b border-white/10 text-white/70 select-none"
              title="Drag this bar to move the player anywhere on your screen"
            >
              <div className="flex items-center space-x-1.5 text-[#D4AF37]">
                <GripHorizontal className="w-4 h-4" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
                  🎙️ Casual Corner Player • Movable
                </span>
              </div>

              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  onClick={handleResetPosition}
                  className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[#D4AF37] cursor-pointer"
                  title="Reset position to bottom-right"
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
                  onClick={onClose}
                  className="p-1 rounded-md text-white/70 hover:text-white hover:bg-white/10 cursor-pointer"
                  title="Close player"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Top Row: Track Meta, Series Badge & Controls */}
            <div className="flex items-center justify-between gap-3">
            
            {/* Left: Thumbnail & Track Title */}
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              <div className="relative w-11 h-11 rounded-2xl overflow-hidden shrink-0 border border-[#D4AF37]/40 shadow-md group">
                <img 
                  src={currentTrack.coverImage || '/The Casual Corner Talk.jpeg'} 
                  alt={currentTrack.title}
                  className="w-full h-full object-cover"
                />
                <button 
                  onClick={onPlayPause}
                  className="absolute inset-0 bg-black/40 flex items-center justify-center text-[#D4AF37] hover:bg-black/60 transition-all cursor-pointer"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                </button>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-2">
                  <span 
                    onClick={onOpenLounge}
                    className="text-[9px] font-mono uppercase font-bold px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 shrink-0 cursor-pointer hover:bg-[#D4AF37]/30 transition-colors"
                    title="Open in Audio Sanctuary Lounge"
                  >
                    {currentTrack.series === 'casual-corner' ? '🎙️ Casual Corner' :
                     currentTrack.series === 'apothecary-snippets' ? '🌿 Apothecary Audio' :
                     currentTrack.series === 'homeschool' ? '📚 Homeschool Guild' :
                     currentTrack.series === 'ancestral' ? '🔥 Ancestral Story' : '📻 24/7 Live Radio'}
                  </span>
                  {isPlaying && (
                    <span className="flex items-center space-x-0.5 shrink-0">
                      <span className="w-1 h-3 bg-[#D4AF37] animate-pulse rounded-full" />
                      <span className="w-1 h-4 bg-[#D4AF37] animate-pulse delay-75 rounded-full" />
                      <span className="w-1 h-2 bg-[#D4AF37] animate-pulse delay-150 rounded-full" />
                    </span>
                  )}
                </div>

                <h4 
                  onClick={onOpenLounge}
                  className="font-serif font-bold text-xs sm:text-sm text-white truncate mt-0.5 hover:text-[#D4AF37] cursor-pointer transition-colors"
                  title="Open Audio Lounge"
                >
                  {currentTrack.title}
                </h4>
                <p className="text-[10px] text-white/70 font-mono truncate">
                  {currentTrack.host} • {currentTrack.hostRole}
                </p>
              </div>
            </div>

            {/* Right: Quick Actions */}
            <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
              
              {/* Optional Previous / Next Track */}
              {onSkip && (
                <div className="hidden sm:flex items-center space-x-1">
                  <button
                    onClick={() => onSkip('backward')}
                    className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-all cursor-pointer"
                    title="Previous Track"
                  >
                    ⏮
                  </button>
                  <button
                    onClick={() => onSkip('forward')}
                    className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-all cursor-pointer"
                    title="Next Track"
                  >
                    ⏭
                  </button>
                </div>
              )}

              {/* Playback speed toggle */}
              <button
                onClick={() => {
                  const rates = [0.75, 1.0, 1.25, 1.5, 2.0];
                  const nextRate = rates[(rates.indexOf(playbackRate) + 1) % rates.length];
                  handleRateChange(nextRate);
                }}
                className="text-[10px] font-mono font-bold bg-white/10 hover:bg-white/20 text-[#D4AF37] px-2 py-1 rounded-xl border border-white/10 cursor-pointer"
                title="Playback Speed"
              >
                {playbackRate}x
              </button>

              {/* Rewind 15s */}
              <button
                onClick={() => onSeek(Math.max(0, currentTime - 15))}
                className="text-white/80 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition-all cursor-pointer"
                title="Rewind 15 seconds"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              {/* Fast Forward 30s */}
              <button
                onClick={() => onSeek(Math.min(effectiveDuration, currentTime + 30))}
                className="text-white/80 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition-all cursor-pointer"
                title="Forward 30 seconds"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>

              {/* Expand / Minimize Toggle */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-white/80 hover:text-[#D4AF37] p-1.5 rounded-xl hover:bg-white/10 transition-all cursor-pointer"
                title={isExpanded ? 'Collapse player' : 'Expand full episode notes & timestamps'}
              >
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </button>

              {/* Close / Stop Player */}
              <button
                onClick={onClose}
                className="text-white/60 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition-all cursor-pointer"
                title="Dismiss player"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Progress Bar & Time */}
          <div className="mt-2.5 space-y-1">
            <div 
              onClick={handleProgressBarClick}
              className="w-full bg-white/20 hover:bg-white/30 h-2 rounded-full cursor-pointer relative overflow-hidden transition-all group"
            >
              <div 
                className="h-full bg-gradient-to-r from-[#B87333] via-[#D4AF37] to-[#E5C158] rounded-full relative transition-all duration-100"
                style={{ width: `${progressPercent}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-white/70">
              <span className="text-[#D4AF37] font-bold">{formatTime(currentTime)}</span>
              {activeTimestamp && (
                <span className="truncate max-w-[220px] text-white/90 text-center font-sans">
                  📍 {activeTimestamp.label}
                </span>
              )}
              <span>{formatTime(effectiveDuration)}</span>
            </div>
          </div>

          {/* Expanded Drawer: Interactive Timestamps & Referenced Remedies */}
          {isExpanded && (
            <div className="mt-4 pt-4 border-t border-white/15 space-y-4 max-h-[380px] overflow-y-auto pr-1">
              
              {/* Episode Description */}
              <div className="text-xs text-white/80 leading-relaxed font-sans bg-black/30 p-3 rounded-2xl border border-white/10">
                {currentTrack.description}
              </div>

              {/* Referenced Remedies & Notes Quick Pills */}
              {currentTrack.referencedRemedies && currentTrack.referencedRemedies.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase font-bold text-[#D4AF37] flex items-center space-x-1">
                      <Leaf className="w-3.5 h-3.5" />
                      <span>Referenced Herbal Formulations &amp; Recipes</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {currentTrack.referencedRemedies.map((remedy, idx) => (
                      <div 
                        key={idx}
                        onClick={() => setShowRemedyModal(remedy)}
                        className="bg-white/5 hover:bg-[#D4AF37]/15 border border-white/10 hover:border-[#D4AF37]/50 rounded-2xl p-2.5 transition-all cursor-pointer flex items-center justify-between"
                      >
                        <div className="min-w-0 pr-2">
                          <h5 className="font-serif font-bold text-xs text-white truncate">{remedy.name}</h5>
                          <p className="text-[10px] text-white/60 truncate">{remedy.purpose}</p>
                        </div>
                        <span className="text-[10px] font-mono text-[#D4AF37] shrink-0 font-bold underline">
                          View Recipe
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Clickable Timestamps Section */}
              {currentTrack.timestamps && currentTrack.timestamps.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase font-bold text-white/70 flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Interactive Episode Chapters &amp; Timestamps (Click to Jump)</span>
                  </span>

                  <div className="space-y-1.5">
                    {currentTrack.timestamps.map((ts, idx) => {
                      const isActive = currentTime >= ts.timeSeconds && 
                        (idx === currentTrack.timestamps.length - 1 || currentTime < currentTrack.timestamps[idx + 1].timeSeconds);

                      return (
                        <div
                          key={idx}
                          onClick={() => onSeek(ts.timeSeconds)}
                          className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-start space-x-2.5 ${
                            isActive 
                              ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-white shadow-sm' 
                              : 'bg-white/5 hover:bg-white/10 border-white/10 text-white/80'
                          }`}
                        >
                          <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-lg shrink-0 ${
                            isActive ? 'bg-[#D4AF37] text-[#1F140E]' : 'bg-black/40 text-[#D4AF37]'
                          }`}>
                            {formatTime(ts.timeSeconds)}
                          </span>

                          <div className="min-w-0 flex-1">
                            <h6 className="font-serif font-bold text-xs text-white">{ts.label}</h6>
                            <p className="text-[11px] text-white/70 font-sans mt-0.5 leading-snug">{ts.summary}</p>
                            {ts.attachmentNote && (
                              <span className="inline-block mt-1 text-[10px] font-mono text-[#D4AF37]/90 bg-black/30 px-2 py-0.5 rounded-md">
                                📌 {ts.attachmentNote}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Volume & Like Controls in Expanded Mode */}
              <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs font-mono">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="text-white/70 hover:text-white cursor-pointer"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-[#D4AF37]" />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => {
                      setIsMuted(false);
                      handleVolChange(parseFloat(e.target.value));
                    }}
                    className="w-24 accent-[#D4AF37] cursor-pointer"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setLiked(!liked)}
                    className={`flex items-center space-x-1 px-3 py-1 rounded-xl transition-all cursor-pointer ${
                      liked ? 'bg-rose-950 text-rose-300 border border-rose-500/50' : 'bg-white/5 text-white/80 hover:bg-white/10'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-rose-400 text-rose-400' : ''}`} />
                    <span>{(currentTrack.likesCount || 0) + (liked ? 1 : 0)} Sister Appreciations</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          </div>
        )}
      </motion.div>

      {/* Modal: Referenced Remedy Recipe Popover */}
      {showRemedyModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[60] flex items-center justify-center p-4">
          <div className="bg-[#FAF5EE] border-2 border-[#D4AF37] rounded-3xl p-6 max-w-lg w-full text-[#1F1813] shadow-2xl space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-copper-penny/20 pb-3">
              <div className="flex items-center space-x-2">
                <Leaf className="w-5 h-5 text-emerald-700" />
                <span className="font-mono text-xs uppercase font-extrabold text-[#B87333]">
                  Referenced Herbal Formulation
                </span>
              </div>
              <button
                onClick={() => setShowRemedyModal(null)}
                className="text-gray-500 hover:text-black p-1 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="font-serif font-extrabold text-xl text-[#1F1813]">{showRemedyModal.name}</h3>
              <p className="text-xs text-soft-sage font-medium">{showRemedyModal.purpose}</p>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-copper-penny/20 space-y-2 text-xs">
              <span className="font-mono text-[10px] uppercase font-bold text-[#B87333]">Ingredients:</span>
              <ul className="list-disc list-inside space-y-1 text-gray-800 font-sans">
                {showRemedyModal.ingredients.map((ing, i) => (
                  <li key={i}>{ing}</li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-copper-penny/20 space-y-2 text-xs">
              <span className="font-mono text-[10px] uppercase font-bold text-[#B87333]">Preparation &amp; Usage:</span>
              <p className="text-gray-800 leading-relaxed font-sans">{showRemedyModal.instructions}</p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => handleCopyRecipe(showRemedyModal)}
                className="px-4 py-2 bg-[#D4AF37] hover:bg-[#E5C158] text-[#1F140E] font-mono text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center space-x-1.5"
              >
                {copiedRecipe ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                <span>{copiedRecipe ? 'Copied Recipe to Clipboard!' : 'Copy Recipe Text'}</span>
              </button>

              <button
                onClick={() => setShowRemedyModal(null)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-mono text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
