import React, { useState, useEffect } from 'react';
import { 
  Palette, 
  Play, 
  Pause, 
  RotateCcw, 
  Printer, 
  Download, 
  ExternalLink, 
  Sparkles, 
  BookOpen, 
  Youtube, 
  ShoppingBag, 
  Check, 
  Clock, 
  Award,
  Zap,
  ChevronRight,
  Smile
} from 'lucide-react';
import { 
  COLORING_SHEETS_DATA, 
  CREATIVE_EPISODES_DATA, 
  AMAZON_KDP_MERCH_DATA,
  ColoringSheetItem,
  CreativeEpisodeItem,
  AmazonKDPMerchItem
} from '../data/ecosystemData';

interface DeviMommieCreativeStudioProps {
  onShowToast?: (msg: string) => void;
}

export default function DeviMommieCreativeStudio({ onShowToast }: DeviMommieCreativeStudioProps) {
  const [activeTab, setActiveTab] = useState<'coloring-sheets' | 'brain-break' | 'youtube-episodes' | 'kdp-books'>('coloring-sheets');
  const [selectedColoringSheet, setSelectedColoringSheet] = useState<ColoringSheetItem>(COLORING_SHEETS_DATA[0]);

  // Brain Break Timer State (5-Minute Countdown)
  const [brainBreakSeconds, setBrainBreakSeconds] = useState<number>(300); // 5 minutes
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [currentBrainBreakIndex, setCurrentBrainBreakIndex] = useState<number>(0);

  const brainBreakPrompts = [
    { title: 'The Three Sisters Stretch', prompt: 'Stand tall like a golden corn stalk! Reach high toward the sun, then sway side to side like beans climbing a trellis. Breathe in for 4 seconds, exhale for 4 seconds.' },
    { title: 'Turbo Pit Stop Jumping Jacks', prompt: 'Rev your engine! Do 10 rapid jumping jacks while counting by 5s to 50: 5, 10, 15, 20... 50! Finish with a turbo spin.' },
    { title: 'Nature Observation Pause', prompt: 'Close your eyes. Listen carefully to 3 distinct sounds around your home. Name them out loud in full descriptive sentences.' },
    { title: 'The Deep Hearth Belly Breath', prompt: 'Place one hand on your heart and one hand on your belly. Inhale deeply through your nose like smelling sweet sweetgrass, hold for 3, and blow out like cooling warm soup.' }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && brainBreakSeconds > 0) {
      interval = setInterval(() => {
        setBrainBreakSeconds(prev => prev - 1);
      }, 1000);
    } else if (brainBreakSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      triggerToast('🎉 Brain Break complete! You are refreshed and ready for your next study sprint!');
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, brainBreakSeconds]);

  const triggerToast = (msg: string) => {
    if (onShowToast) {
      onShowToast(msg);
    } else {
      alert(msg);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handlePrintSheet = (sheet: ColoringSheetItem) => {
    triggerToast(`🖨️ Printing "${sheet.title}"! High-resolution vector sent to printable canvas.`);
    window.print();
  };

  const handleDownloadSheet = (sheet: ColoringSheetItem) => {
    triggerToast(`📥 Downloading "${sheet.title}" PDF printable package!`);
  };

  return (
    <div className="space-y-6 text-[#1F1813]">

      {/* Hero Card: Devi & Mommie Studios & Devin's Speedway */}
      <div className="bg-gradient-to-br from-[#1F140E] via-[#2D1B12] to-[#1A0F0A] border-2 border-[#D4AF37]/40 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-[#B87333]/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <span className="p-3 bg-[#D4AF37]/15 text-[#D4AF37] rounded-2xl border border-[#D4AF37]/35 shadow-inner">
                <Palette className="w-6 h-6 text-[#D4AF37]" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest font-extrabold text-[#D4AF37] px-2 py-0.5 rounded bg-[#D4AF37]/10 border border-[#D4AF37]/25">
                    Creative Arts &amp; Homeschool Brain Breaks
                  </span>
                  <span className="text-[10px] font-mono text-[#FAF5EE]/70">Ecosystem Hub</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#FAF5EE] tracking-tight mt-0.5">
                  Devi &amp; Mommie Studios &bull; Devin's Speedway
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-xs font-mono font-bold text-[#D4AF37] flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Free Homeschool Printables</span>
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#FAF5EE]/90 max-w-3xl leading-relaxed">
            Welcome to the creative imagination sanctuary! Spark joy and kinetic learning in your homeschool rhythm with <strong>free printable coloring sheets</strong>, <strong>5-minute guided brain breaks</strong>, <strong>Devin's Speedway animated educational episodes on YouTube</strong>, and our published <strong>Amazon KDP storybooks and activity workbooks</strong>.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
              <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider block">Printable Sheets</span>
              <strong className="text-lg font-serif font-bold text-white">4 Free Packs</strong>
              <span className="text-[10px] text-white/60 block mt-0.5">100% Vector Linework</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
              <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider block">Brain Break Timer</span>
              <strong className="text-lg font-serif font-bold text-white">5-Min Rhythms</strong>
              <span className="text-[10px] text-white/60 block mt-0.5">Guided Kinetic Movement</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
              <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider block">YouTube Animation</span>
              <strong className="text-lg font-serif font-bold text-white">Devin's Speedway</strong>
              <span className="text-[10px] text-white/60 block mt-0.5">STEM &amp; Garden Science</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
              <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider block">Amazon KDP Books</span>
              <strong className="text-lg font-serif font-bold text-white">Published Series</strong>
              <span className="text-[10px] text-white/60 block mt-0.5">Paperback &amp; Hardcover</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-copper-penny/20 pb-3">
        <button
          onClick={() => setActiveTab('coloring-sheets')}
          className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center space-x-2 ${
            activeTab === 'coloring-sheets'
              ? 'bg-[#B87333] text-white shadow-md border border-[#B87333]'
              : 'bg-white text-[#1F1813]/80 border border-copper-penny/20 hover:bg-[#FAF5EE]'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Free Printable Coloring Sheets</span>
        </button>

        <button
          onClick={() => setActiveTab('brain-break')}
          className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center space-x-2 ${
            activeTab === 'brain-break'
              ? 'bg-[#B87333] text-white shadow-md border border-[#B87333]'
              : 'bg-white text-[#1F1813]/80 border border-copper-penny/20 hover:bg-[#FAF5EE]'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>5-Min Kinetic Brain Break Timer</span>
        </button>

        <button
          onClick={() => setActiveTab('youtube-episodes')}
          className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center space-x-2 ${
            activeTab === 'youtube-episodes'
              ? 'bg-[#B87333] text-white shadow-md border border-[#B87333]'
              : 'bg-white text-[#1F1813]/80 border border-copper-penny/20 hover:bg-[#FAF5EE]'
          }`}
        >
          <Youtube className="w-4 h-4 text-rose-600" />
          <span>Devin's Speedway YouTube Episodes</span>
        </button>

        <button
          onClick={() => setActiveTab('kdp-books')}
          className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center space-x-2 ${
            activeTab === 'kdp-books'
              ? 'bg-[#B87333] text-white shadow-md border border-[#B87333]'
              : 'bg-white text-[#1F1813]/80 border border-copper-penny/20 hover:bg-[#FAF5EE]'
          }`}
        >
          <BookOpen className="w-4 h-4 text-[#D4AF37]" />
          <span>Amazon KDP Storybooks &amp; Journals</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. FREE PRINTABLE COLORING SHEETS TAB                                     */}
      {/* ========================================================================= */}
      {activeTab === 'coloring-sheets' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Sheet Selector Column */}
            <div className="space-y-3 lg:col-span-1">
              <span className="text-[10px] font-mono uppercase font-bold text-soft-sage block">
                Select Coloring Sheet Pack:
              </span>
              <div className="space-y-2.5">
                {COLORING_SHEETS_DATA.map((sheet) => (
                  <button
                    key={sheet.id}
                    onClick={() => setSelectedColoringSheet(sheet)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start space-x-3 ${
                      selectedColoringSheet.id === sheet.id
                        ? 'bg-white border-2 border-[#B87333] shadow-md ring-2 ring-[#B87333]/15'
                        : 'bg-[#FAF5EE]/70 border-copper-penny/20 hover:bg-white'
                    }`}
                  >
                    <span className="text-2xl p-2 rounded-xl bg-[#FAF5EE] border border-copper-penny/20">
                      {sheet.previewThumbnail}
                    </span>
                    <div className="space-y-1 flex-1">
                      <span className="text-[9px] font-mono uppercase font-bold text-[#B87333] block">
                        {sheet.series}
                      </span>
                      <h4 className="font-serif font-bold text-xs text-[#1F1813] leading-snug">
                        {sheet.title}
                      </h4>
                      <span className="text-[9px] font-mono text-soft-sage block">
                        {sheet.difficulty}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Vector Canvas Preview Column */}
            <div className="lg:col-span-2 bg-white border-2 border-copper-penny/25 rounded-3xl p-6 space-y-5 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-copper-penny/15 pb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase font-bold text-[#B87333]">
                    {selectedColoringSheet.series} &bull; {selectedColoringSheet.theme}
                  </span>
                  <h3 className="font-serif font-bold text-lg text-[#1F1813]">
                    {selectedColoringSheet.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePrintSheet(selectedColoringSheet)}
                    className="px-3.5 py-2 rounded-xl bg-[#FAF5EE] hover:bg-[#B87333] hover:text-white text-[#1F1813] border border-copper-penny/20 font-mono font-bold text-xs transition-all flex items-center space-x-1.5 cursor-pointer shadow-xs"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Sheet</span>
                  </button>
                  <button
                    onClick={() => handleDownloadSheet(selectedColoringSheet)}
                    className="px-3.5 py-2 rounded-xl bg-[#B87333] hover:bg-[#A85138] text-white font-mono font-bold text-xs transition-all flex items-center space-x-1.5 cursor-pointer shadow-md"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>

              <p className="text-xs text-[#2A221B]/85 leading-relaxed">
                {selectedColoringSheet.description}
              </p>

              {/* Vector Coloring Canvas Frame */}
              <div className="w-full bg-[#FAF5EE] border-2 border-dashed border-copper-penny/35 rounded-2xl p-6 flex flex-col items-center justify-center space-y-4 shadow-inner min-h-[280px]">
                
                {/* SVG Line Art Representation for Selected Sheet */}
                {selectedColoringSheet.id === 'color-01' && (
                  <svg viewBox="0 0 400 180" className="w-full max-w-md">
                    {/* Race track road */}
                    <path d="M 10 140 Q 200 120 390 140" fill="none" stroke="#1F1813" strokeWidth="2.5" strokeDasharray="8 6" />
                    {/* Solar race car chassis */}
                    <g transform="translate(100, 50)">
                      <path d="M 0 50 Q 20 20 80 15 L 140 15 Q 180 20 200 50 L 200 65 L 0 65 Z" fill="#FFFFFF" stroke="#1F1813" strokeWidth="2" />
                      {/* Solar roof cells */}
                      <rect x="70" y="20" width="60" height="20" fill="none" stroke="#0047AB" strokeWidth="1.5" strokeDasharray="6 4" />
                      <line x1="90" y1="20" x2="90" y2="40" stroke="#0047AB" strokeWidth="1" />
                      <line x1="110" y1="20" x2="110" y2="40" stroke="#0047AB" strokeWidth="1" />
                      {/* Windshield */}
                      <polygon points="50,45 70,25 90,25 75,45" fill="none" stroke="#1F1813" strokeWidth="1.5" />
                      {/* Devin helmet */}
                      <circle cx="80" cy="35" r="8" fill="none" stroke="#1F1813" strokeWidth="1.5" />
                      {/* Wheels */}
                      <circle cx="35" cy="65" r="16" fill="none" stroke="#1F1813" strokeWidth="2" />
                      <circle cx="35" cy="65" r="8" fill="none" stroke="#1F1813" strokeWidth="1.5" />
                      <circle cx="165" cy="65" r="16" fill="none" stroke="#1F1813" strokeWidth="2" />
                      <circle cx="165" cy="65" r="8" fill="none" stroke="#1F1813" strokeWidth="1.5" />
                      {/* Racing stripes & Devin name */}
                      <text x="120" y="55" fill="#1F1813" fontSize="10" fontFamily="monospace" fontWeight="bold">DEVIN #1</text>
                    </g>
                    {/* Sun in sky */}
                    <circle cx="340" cy="35" r="15" fill="none" stroke="#D4AF37" strokeWidth="2" />
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                      <line
                        key={i}
                        x1={340 + 20 * Math.cos(angle * Math.PI / 180)}
                        y1={35 + 20 * Math.sin(angle * Math.PI / 180)}
                        x2={340 + 28 * Math.cos(angle * Math.PI / 180)}
                        y2={35 + 28 * Math.sin(angle * Math.PI / 180)}
                        stroke="#D4AF37"
                        strokeWidth="1.5"
                      />
                    ))}
                  </svg>
                )}

                {selectedColoringSheet.id === 'color-02' && (
                  <svg viewBox="0 0 400 180" className="w-full max-w-md">
                    {/* Garden bed soil line */}
                    <path d="M 20 150 Q 200 145 380 150" fill="none" stroke="#8C6D1A" strokeWidth="2" />
                    {/* Coneflower stem & leaf */}
                    <path d="M 120 150 Q 125 100 130 60" fill="none" stroke="#1F1813" strokeWidth="2" />
                    <path d="M 125 110 Q 150 100 160 115 Q 140 125 125 110" fill="none" stroke="#1F1813" strokeWidth="1.5" />
                    {/* Flower Cone */}
                    <ellipse cx="130" cy="55" rx="14" ry="12" fill="none" stroke="#1F1813" strokeWidth="2" />
                    {/* Drooping Petals */}
                    {[20, 45, 70, 95, 120, 145, 160].map((deg, i) => (
                      <path
                        key={i}
                        d={`M 130 58 Q ${130 + 25 * Math.cos(deg * Math.PI / 180)} ${65 + 35 * Math.sin(deg * Math.PI / 180)} ${130 + 15 * Math.cos(deg * Math.PI / 180)} ${65 + 40 * Math.sin(deg * Math.PI / 180)}`}
                        fill="none"
                        stroke="#1F1813"
                        strokeWidth="1.5"
                      />
                    ))}
                    {/* Honeybee flying */}
                    <g transform="translate(240, 40)">
                      <ellipse cx="0" cy="0" rx="10" ry="7" fill="none" stroke="#1F1813" strokeWidth="1.5" />
                      <line x1="-3" y1="-7" x2="-3" y2="7" stroke="#1F1813" strokeWidth="1" />
                      <line x1="3" y1="-7" x2="3" y2="7" stroke="#1F1813" strokeWidth="1" />
                      {/* Wings */}
                      <ellipse cx="-2" cy="-9" rx="6" ry="4" fill="none" stroke="#00EEEE" strokeWidth="1" />
                      <ellipse cx="4" cy="-9" rx="6" ry="4" fill="none" stroke="#00EEEE" strokeWidth="1" />
                    </g>
                    <text x="200" y="165" textAnchor="middle" fill="#1F1813" fontSize="10" fontFamily="serif" fontStyle="italic">
                      "Echinacea purpurea • Hand-pollinated with sister care"
                    </text>
                  </svg>
                )}

                {selectedColoringSheet.id === 'color-03' && (
                  <svg viewBox="0 0 400 180" className="w-full max-w-md">
                    {/* Huge ornamental C */}
                    <text x="80" y="140" fill="none" stroke="#B87333" strokeWidth="4" fontSize="140" fontFamily="serif" fontWeight="bold">
                      C
                    </text>
                    {/* Copper basket & corn */}
                    <g transform="translate(230, 60)">
                      <ellipse cx="40" cy="60" rx="40" ry="18" fill="none" stroke="#1F1813" strokeWidth="2" />
                      <path d="M 0 60 Q 40 100 80 60" fill="none" stroke="#1F1813" strokeWidth="2" />
                      {/* Corn ear */}
                      <path d="M 30 50 Q 50 10 65 30 Q 50 65 30 50" fill="none" stroke="#1F1813" strokeWidth="1.5" />
                      <text x="40" y="115" textAnchor="middle" fill="#1F1813" fontSize="11" fontFamily="monospace" fontWeight="bold">
                        C is for Community
                      </text>
                    </g>
                  </svg>
                )}

                {selectedColoringSheet.id === 'color-04' && (
                  <svg viewBox="0 0 400 180" className="w-full max-w-md">
                    {/* Pit stop gauges */}
                    <g transform="translate(30, 40)">
                      <rect x="0" y="0" width="70" height="90" rx="8" fill="none" stroke="#1F1813" strokeWidth="2" />
                      <rect x="5" y="65" width="60" height="20" fill="none" stroke="#0047AB" strokeWidth="1.5" strokeDasharray="3 3" />
                      <text x="35" y="45" textAnchor="middle" fill="#1F1813" fontSize="14" fontFamily="monospace" fontWeight="bold">1/4</text>
                      <text x="35" y="105" textAnchor="middle" fill="#1F1813" fontSize="9" fontFamily="monospace">Charge</text>
                    </g>
                    <g transform="translate(120, 40)">
                      <rect x="0" y="0" width="70" height="90" rx="8" fill="none" stroke="#1F1813" strokeWidth="2" />
                      <rect x="5" y="45" width="60" height="40" fill="none" stroke="#0047AB" strokeWidth="1.5" strokeDasharray="3 3" />
                      <text x="35" y="35" textAnchor="middle" fill="#1F1813" fontSize="14" fontFamily="monospace" fontWeight="bold">2/4</text>
                      <text x="35" y="105" textAnchor="middle" fill="#1F1813" fontSize="9" fontFamily="monospace">Half Full</text>
                    </g>
                    <g transform="translate(210, 40)">
                      <rect x="0" y="0" width="70" height="90" rx="8" fill="none" stroke="#1F1813" strokeWidth="2" />
                      <rect x="5" y="25" width="60" height="60" fill="none" stroke="#0047AB" strokeWidth="1.5" strokeDasharray="3 3" />
                      <text x="35" y="20" textAnchor="middle" fill="#1F1813" fontSize="14" fontFamily="monospace" fontWeight="bold">3/4</text>
                      <text x="35" y="105" textAnchor="middle" fill="#1F1813" fontSize="9" fontFamily="monospace">Turbo Ready</text>
                    </g>
                    <g transform="translate(300, 40)">
                      <rect x="0" y="0" width="70" height="90" rx="8" fill="none" stroke="#10B981" strokeWidth="2.5" />
                      <rect x="5" y="5" width="60" height="80" fill="none" stroke="#10B981" strokeWidth="2" strokeDasharray="4 2" />
                      <text x="35" y="45" textAnchor="middle" fill="#10B981" fontSize="14" fontFamily="monospace" fontWeight="bold">4/4</text>
                      <text x="35" y="105" textAnchor="middle" fill="#10B981" fontSize="9" fontFamily="monospace" fontWeight="bold">FULL POWER</text>
                    </g>
                  </svg>
                )}

                <div className="text-center font-mono text-[10px] text-soft-sage">
                  Ready to print &bull; Compatible with Crayola, colored pencils, and watercolor markers
                </div>
              </div>

              {/* Prompt Box */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/70 text-xs text-amber-950 flex items-start space-x-2.5">
                <Smile className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Kinetic Brain Break Prompt for this Page:</strong>
                  <p className="mt-0.5 leading-relaxed">{selectedColoringSheet.learningBreakPrompt}</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. 5-MINUTE KINETIC BRAIN BREAK TIMER                                     */}
      {/* ========================================================================= */}
      {activeTab === 'brain-break' && (
        <div className="bg-white border-2 border-[#D4AF37]/35 rounded-3xl p-6 sm:p-8 space-y-6 shadow-md max-w-3xl mx-auto">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest font-extrabold text-[#D4AF37] px-2.5 py-0.5 rounded bg-[#D4AF37]/10 border border-[#D4AF37]/25">
              Kinetic Homeschool Brain Break
            </span>
            <h3 className="font-serif font-bold text-2xl text-[#1F1813]">
              5-Minute Movement &amp; Breath Recharge
            </h3>
            <p className="text-xs text-[#2A221B]/80 max-w-md mx-auto">
              Give your young scholar a quick mental reset between math problem sets or reading comprehension sprints.
            </p>
          </div>

          {/* Big Circular / Rounded Timer Display */}
          <div className="bg-[#FAF5EE] border-2 border-[#B87333]/30 rounded-3xl p-8 text-center space-y-4 shadow-inner max-w-md mx-auto">
            <div className="font-serif font-black text-5xl sm:text-6xl text-[#1F1813] tracking-widest">
              {formatTimer(brainBreakSeconds)}
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="px-6 py-2.5 rounded-xl bg-[#B87333] hover:bg-[#A85138] text-white font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center space-x-2 cursor-pointer shadow-md"
              >
                {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isTimerRunning ? 'Pause Timer' : 'Start 5-Min Timer'}</span>
              </button>

              <button
                onClick={() => {
                  setIsTimerRunning(false);
                  setBrainBreakSeconds(300);
                  triggerToast('Timer reset to 5 minutes.');
                }}
                className="p-2.5 rounded-xl bg-white border border-copper-penny/25 text-gray-700 hover:bg-gray-50 transition-all cursor-pointer"
                title="Reset Timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active Kinetic Movement Prompt */}
          <div className="bg-[#FAF5EE] border border-copper-penny/20 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase font-bold text-[#B87333]">
                Movement Mission #{currentBrainBreakIndex + 1}
              </span>
              <button
                onClick={() => setCurrentBrainBreakIndex((currentBrainBreakIndex + 1) % brainBreakPrompts.length)}
                className="text-xs font-mono text-[#0047AB] hover:underline font-bold cursor-pointer"
              >
                Next Movement Activity &rarr;
              </button>
            </div>

            <h4 className="font-serif font-bold text-base text-[#1F1813]">
              {brainBreakPrompts[currentBrainBreakIndex].title}
            </h4>

            <p className="text-xs sm:text-sm text-[#2A221B]/90 leading-relaxed italic bg-white p-4 rounded-xl border border-copper-penny/10">
              "{brainBreakPrompts[currentBrainBreakIndex].prompt}"
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. DEVIN'S SPEEDWAY YOUTUBE EPISODES                                       */}
      {/* ========================================================================= */}
      {activeTab === 'youtube-episodes' && (
        <div className="space-y-6">
          <div className="bg-[#FAF5EE] border border-copper-penny/20 rounded-3xl p-5 sm:p-6 shadow-sm space-y-2">
            <h3 className="font-serif font-bold text-xl text-[#1F1813]">
              Devin's Speedway Animated STEM Episodes
            </h3>
            <p className="text-xs sm:text-sm text-[#2A221B]/80 leading-relaxed max-w-3xl">
              Watch Devin and friends explore solar engineering, companion planting, and fraction telemetry in short, engaging animated stories designed for elementary learners.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {CREATIVE_EPISODES_DATA.map((ep) => (
              <div
                key={ep.id}
                className="bg-white border-2 border-copper-penny/20 hover:border-rose-500 rounded-3xl p-5 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="space-y-3">
                  <div className="w-full h-36 bg-[#1F140E] rounded-2xl flex flex-col items-center justify-center relative overflow-hidden text-white border border-copper-penny/30">
                    <div className="text-3xl mb-1">🏎️⚡</div>
                    <span className="text-[10px] font-mono text-[#00EEEE] font-bold">Episode {ep.episodeNumber}</span>
                    <span className="absolute bottom-2 right-2 text-[9px] font-mono bg-black/70 px-1.5 py-0.5 rounded text-white/80">
                      {ep.runtime}
                    </span>
                  </div>

                  <div>
                    <span className="text-[9px] font-mono uppercase font-bold text-rose-600 block">
                      {ep.seriesName}
                    </span>
                    <h4 className="font-serif font-bold text-base text-[#1F1813] group-hover:text-rose-700 transition-colors">
                      {ep.title}
                    </h4>
                  </div>

                  <p className="text-xs text-[#2A221B]/80 leading-relaxed font-sans line-clamp-3">
                    {ep.synopsis}
                  </p>

                  <div className="p-2.5 bg-[#FAF5EE] rounded-xl border border-copper-penny/10 text-[11px] text-[#2A221B]/80">
                    <strong className="text-[#1F1813] font-bold block mb-0.5">Educational Core:</strong>
                    {ep.educationalCore}
                  </div>
                </div>

                <a
                  href={ep.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-md"
                >
                  <Youtube className="w-4 h-4" />
                  <span>Watch on YouTube</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. AMAZON KDP STORYBOOKS & JOURNALS                                       */}
      {/* ========================================================================= */}
      {activeTab === 'kdp-books' && (
        <div className="space-y-6">
          <div className="bg-[#FAF5EE] border border-copper-penny/20 rounded-3xl p-5 sm:p-6 shadow-sm space-y-2">
            <h3 className="font-serif font-bold text-xl text-[#1F1813]">
              Devi &amp; Mommie Studios &bull; Amazon KDP Library
            </h3>
            <p className="text-xs sm:text-sm text-[#2A221B]/80 leading-relaxed max-w-3xl">
              Physical, durable paperbacks and hardcover storybooks published via Amazon KDP. Support our sovereign creative studio by ordering activity workbooks, nature journals, and early reader heritage alphabets for your homeschool shelf.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {AMAZON_KDP_MERCH_DATA.map((book) => (
              <div
                key={book.id}
                className="bg-white border-2 border-copper-penny/20 hover:border-[#D4AF37] rounded-3xl p-5 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <span className="text-3xl p-3 bg-[#FAF5EE] rounded-2xl border border-copper-penny/15">
                      {book.coverImageEmoji}
                    </span>
                    <span className="font-serif font-extrabold text-xl text-[#B87333]">
                      {book.price}
                    </span>
                  </div>

                  <div>
                    <span className="text-[9px] font-mono uppercase font-bold text-[#D4AF37] block">
                      {book.format} &bull; {book.pageCount} Pages
                    </span>
                    <h4 className="font-serif font-bold text-base text-[#1F1813] leading-snug">
                      {book.title}
                    </h4>
                    <span className="text-[10px] font-mono text-soft-sage block mt-0.5">
                      By {book.author}
                    </span>
                  </div>

                  <p className="text-xs text-[#2A221B]/80 leading-relaxed">
                    {book.description}
                  </p>

                  {book.bestsellerRank && (
                    <span className="inline-block text-[10px] font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                      ★ {book.bestsellerRank}
                    </span>
                  )}
                </div>

                <a
                  href={book.amazonKdpUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl bg-[#1F1813] hover:bg-[#B87333] text-white font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-md"
                >
                  <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                  <span>Order on Amazon KDP</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
