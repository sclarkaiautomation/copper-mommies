import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Moon, Sun, BookOpen, Flame, Check, X, Palette, Compass, RefreshCw } from 'lucide-react';
import { HearthMoodId, HearthMoodConfig } from '../types';

export const HEARTH_MOODS: Record<HearthMoodId, HearthMoodConfig> = {
  reflection: {
    id: 'reflection',
    name: 'Quiet Reflection',
    subtitle: 'Evening Wind-Down & Mother Journaling',
    emoji: '🕯️',
    vibe: 'Serene & Grounding',
    tagline: 'Gentle candlelight warmth for evening prayers, journaling, and deep unwinding.',
    bgClass: 'bg-[#FAF7F2]',
    meshStyle: 'radial-gradient(circle at 10% 10%, rgba(212, 175, 55, 0.07) 0%, transparent 45%), radial-gradient(circle at 90% 90%, rgba(184, 115, 51, 0.06) 0%, transparent 50%), #FAF7F2',
    accentColor: '#D4AF37',
    headerBg: 'bg-[#FFFDF9]/95',
    orb1Class: 'bg-[#D4AF37]/10',
    orb2Class: 'bg-[#B87333]/8'
  },
  community: {
    id: 'community',
    name: 'Community Energy',
    subtitle: 'Daylight Village & Active Sisterhood',
    emoji: '☀️',
    vibe: 'Vibrant & Radiant',
    tagline: 'Warm sunlit energy for daytime chats, marketplace swaps, and meal train coordination.',
    bgClass: 'bg-[#FFFDF7]',
    meshStyle: 'radial-gradient(circle at 0% 0%, rgba(224, 142, 69, 0.10) 0%, transparent 45%), radial-gradient(circle at 100% 100%, rgba(212, 175, 55, 0.12) 0%, transparent 50%), #FFFDF7',
    accentColor: '#B87333',
    headerBg: 'bg-[#FFFDF7]/95',
    orb1Class: 'bg-[#E08E45]/14',
    orb2Class: 'bg-[#D4AF37]/16'
  },
  study: {
    id: 'study',
    name: 'Study & Growth',
    subtitle: 'Homeschooling & Botanical Calm',
    emoji: '🌿',
    vibe: 'Herbal Clarity & Focus',
    tagline: 'Gentle sage tones and crisp readability for lesson planning, reading records, and recipes.',
    bgClass: 'bg-[#F7FAF6]',
    meshStyle: 'radial-gradient(circle at 10% 0%, rgba(58, 76, 58, 0.08) 0%, transparent 45%), radial-gradient(circle at 90% 90%, rgba(147, 162, 139, 0.10) 0%, transparent 45%), #F7FAF6',
    accentColor: '#3A4C3A',
    headerBg: 'bg-[#F7FAF6]/95',
    orb1Class: 'bg-[#3A4C3A]/10',
    orb2Class: 'bg-[#93A28B]/14'
  },
  ancestral: {
    id: 'ancestral',
    name: 'Ancestral Roots',
    subtitle: 'Heritage Wisdom & Deep Clay',
    emoji: '🪵',
    vibe: 'Earthy & Timeless',
    tagline: 'Rich clay sienna and fireside tones for lineage storytelling, oral histories, and grandmother memory.',
    bgClass: 'bg-[#FDF8F4]',
    meshStyle: 'radial-gradient(circle at 5% 5%, rgba(168, 81, 56, 0.08) 0%, transparent 45%), radial-gradient(circle at 95% 95%, rgba(184, 115, 51, 0.10) 0%, transparent 50%), #FDF8F4',
    accentColor: '#A85138',
    headerBg: 'bg-[#FDF8F4]/95',
    orb1Class: 'bg-[#A85138]/12',
    orb2Class: 'bg-[#B87333]/13'
  }
};

interface HearthMoodToggleProps {
  currentMood: HearthMoodId;
  onSelectMood: (moodId: HearthMoodId) => void;
  compact?: boolean;
}

export default function HearthMoodToggle({
  currentMood,
  onSelectMood,
  compact = false
}: HearthMoodToggleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  const activeConfig = HEARTH_MOODS[currentMood] || HEARTH_MOODS.reflection;

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChoose = (moodId: HearthMoodId) => {
    onSelectMood(moodId);
    setIsOpen(false);
    const selected = HEARTH_MOODS[moodId];
    setToastMessage(`✨ Atmosphere set to "${selected.name}" — ${selected.vibe.toLowerCase()}`);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2800);
  };

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      
      {/* Trigger Button */}
      <button
        type="button"
        id="hearth-mood-toggle-button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-serif font-bold transition-all cursor-pointer shadow-2xs active:scale-95 ${
          isOpen
            ? 'bg-[#1F1813] text-[#D4AF37] border-[#D4AF37]'
            : 'bg-[#FAF5EE] hover:bg-white text-[#1F1813] border-copper-penny/25 hover:border-copper-penny'
        }`}
        title="Toggle Sanctuary Atmosphere & Vibe"
      >
        <span className="text-sm">{activeConfig.emoji}</span>
        <span className="font-mono text-[11px] font-semibold text-[#1F1813]">
          {compact ? activeConfig.name.split(' ')[0] : activeConfig.name}
        </span>
        <span className="w-1.5 h-1.5 rounded-full inline-block animate-pulse" style={{ backgroundColor: activeConfig.accentColor }} />
      </button>

      {/* Popover Dropdown Menu */}
      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-80 sm:w-96 rounded-3xl bg-white border-2 border-[#D4AF37]/50 shadow-2xl z-50 p-4 space-y-3 animate-in fade-in zoom-in-95 duration-150"
          style={{ backdropFilter: 'blur(12px)' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-copper-penny/15 pb-2.5">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-[#FAF5EE] text-[#B87333] border border-copper-penny/25 flex items-center justify-center">
                <Palette className="w-4 h-4 text-[#B87333]" />
              </div>
              <div>
                <h4 className="font-serif font-extrabold text-sm text-[#1F1813]">Sanctuary Vibes</h4>
                <p className="text-[10px] font-mono text-soft-sage uppercase font-bold">Personal Lighting & Atmosphere</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[11px] text-[#2A221B]/80 leading-relaxed font-sans">
            Gently shift the sanctuary's lighting, background gradient, and ambient warmth to align with your personal daily rhythm and focus.
          </p>

          {/* Mood Options Grid */}
          <div className="space-y-2 pt-1">
            {(Object.keys(HEARTH_MOODS) as HearthMoodId[]).map((moodId) => {
              const mood = HEARTH_MOODS[moodId];
              const isSelected = currentMood === moodId;

              return (
                <button
                  key={moodId}
                  type="button"
                  onClick={() => handleChoose(moodId)}
                  className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer flex items-start justify-between group ${
                    isSelected
                      ? 'bg-[#1F1813] text-[#FAF5EE] border-[#D4AF37] shadow-md'
                      : 'bg-[#FAF5EE]/60 hover:bg-[#FAF5EE] text-[#1F1813] border-copper-penny/15 hover:border-copper-penny/40'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-xl p-1.5 rounded-xl bg-white/10 shrink-0">
                      {mood.emoji}
                    </span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className={`font-serif font-bold text-xs ${isSelected ? 'text-[#D4AF37]' : 'text-[#1F1813]'}`}>
                          {mood.name}
                        </span>
                        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                          isSelected ? 'bg-white/15 text-white' : 'bg-copper-penny/15 text-[#B87333]'
                        }`}>
                          {mood.vibe}
                        </span>
                      </div>
                      <p className={`text-[11px] mt-0.5 leading-snug line-clamp-2 ${isSelected ? 'text-[#FAF5EE]/80' : 'text-[#2A221B]/70'}`}>
                        {mood.tagline}
                      </p>
                    </div>
                  </div>

                  <div className="ml-2 shrink-0 pt-1">
                    {isSelected ? (
                      <div className="w-5 h-5 rounded-full bg-[#D4AF37] text-[#1F140E] flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-3 h-3 rounded-full border border-copper-penny/30 group-hover:border-copper-penny" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Action: Reset */}
          <div className="pt-2 border-t border-copper-penny/10 flex items-center justify-between text-[11px] text-soft-sage">
            <span className="flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-[#D4AF37]" />
              <span>Saved locally to your device</span>
            </span>

            <button
              onClick={() => handleChoose('reflection')}
              className="text-[#B87333] hover:text-[#A85138] font-mono text-[10px] font-bold flex items-center space-x-1 cursor-pointer"
            >
              <RefreshCw className="w-2.5 h-2.5" />
              <span>Reset Default</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Mini Toast Confirmation */}
      {showToast && (
        <div className="fixed bottom-20 right-6 z-50 bg-[#1F1813] text-[#FAF5EE] border border-[#D4AF37] px-4 py-2.5 rounded-2xl shadow-xl text-xs font-serif font-bold animate-in fade-in slide-in-from-bottom-2 duration-200">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
