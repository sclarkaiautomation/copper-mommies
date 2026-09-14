import React, { useState } from 'react';
import { 
  GraduationCap, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  BookOpen, 
  Star, 
  Download, 
  Lightbulb, 
  RotateCcw, 
  ExternalLink,
  Award,
  Check,
  ShieldCheck,
  Zap,
  HelpCircle
} from 'lucide-react';
import { 
  NESTBRIGHT_TIERS, 
  NESTBRIGHT_4TH_GRADE_SLIDES,
  NestBrightSlideLesson,
  NestBrightTierInfo
} from '../data/ecosystemData';

interface NestBrightCoopPortalProps {
  userName?: string;
  userEmail?: string;
  onShowToast?: (msg: string) => void;
}

export default function NestBrightCoopPortal({
  userName = 'Mama Shantrece',
  userEmail = 'shantrece@coppermommies.co',
  onShowToast
}: NestBrightCoopPortalProps) {
  // Current active tier mode: 'free-beta' | 'scholar-tier'
  const [activeTier, setActiveTier] = useState<'free-beta' | 'scholar-tier'>('free-beta');

  // Slide deck state (Slides 1 to 10)
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const currentSlide: NestBrightSlideLesson = NESTBRIGHT_4TH_GRADE_SLIDES[currentSlideIndex] || NESTBRIGHT_4TH_GRADE_SLIDES[0];

  // Word match interactive state on Slide 1
  const [wordMatchAnswers, setWordMatchAnswers] = useState<Record<string, string>>({});
  const [wordMatchSubmitted, setWordMatchSubmitted] = useState<boolean>(false);

  // Practice problem answer state
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);

  // Interactive manipulative states for Slide 2 (Base-Ten Multi-Digit builder)
  const [builderThousands, setBuilderThousands] = useState<number>(4);
  const [builderHundreds, setBuilderHundreds] = useState<number>(3);
  const [builderTens, setBuilderTens] = useState<number>(2);
  const [builderOnes, setBuilderOnes] = useState<number>(6);

  // Beta registration modal state
  const [isBetaModalOpen, setIsBetaModalOpen] = useState<boolean>(false);
  const [registeredChildName, setRegisteredChildName] = useState<string>('Amari');
  const [registeredGrade, setRegisteredGrade] = useState<'Grade 3' | 'Grade 4' | 'Grade 5'>('Grade 4');
  const [isBetaActivated, setIsBetaActivated] = useState<boolean>(true);

  const triggerToast = (msg: string) => {
    if (onShowToast) {
      onShowToast(msg);
    } else {
      alert(msg);
    }
  };

  const handleNextSlide = () => {
    if (currentSlideIndex < NESTBRIGHT_4TH_GRADE_SLIDES.length - 1) {
      setCurrentSlideIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
      setShowHint(false);
    }
  };

  const handlePrevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
      setSelectedOption(null);
      setShowExplanation(false);
      setShowHint(false);
    }
  };

  const handleSelectOption = (idx: number) => {
    setSelectedOption(idx);
    setShowExplanation(true);
  };

  const handleActivateBetaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBetaActivated(true);
    setIsBetaModalOpen(false);
    triggerToast(`🎉 Beta Access Granted for ${registeredChildName} (${registeredGrade})! NestBright Scholar ID issued.`);
  };

  // Calculated standard number for manipulative
  const totalCalculatedValue = (builderThousands * 1000) + (builderHundreds * 100) + (builderTens * 10) + builderOnes;

  return (
    <div className="space-y-6 max-w-7xl mx-auto my-2 text-[#1F1813]">

      {/* ========================================================================= */}
      {/* 1. NESTBRIGHT ACADEMY BETA TESTER BANNER                                  */}
      {/* ========================================================================= */}
      <div className="bg-[#001428] border-2 border-[#00EEEE]/40 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-visible">
        {/* Glow orb */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#00EEEE]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 right-0 w-64 h-64 bg-[#D4AF37]/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <span className="p-3 bg-[#00EEEE]/15 text-[#00EEEE] rounded-2xl border border-[#00EEEE]/40 shadow-[0_0_15px_rgba(0,238,238,0.25)]">
                <GraduationCap className="w-6 h-6 text-[#00EEEE]" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest font-extrabold text-[#00EEEE] px-2 py-0.5 rounded bg-[#00EEEE]/10 border border-[#00EEEE]/30">
                    4th Grade Curriculum Automation Engine
                  </span>
                  <span className="text-[10px] font-mono text-[#D4AF37] font-bold">
                    ★ Sister Co-Op Beta Portal
                  </span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5">
                  NestBright Academy
                </h2>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setIsBetaModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#00EEEE] hover:bg-[#00EEEE]/80 text-[#001428] font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(0,238,238,0.3)] flex items-center space-x-1.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#001428]" />
                <span>Beta Tester Pass</span>
              </button>
              <a
                href="https://nestbrightacademy.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-xs font-mono font-bold text-white flex items-center space-x-1.5 transition-all"
              >
                <span>NestBrightAcademy.com</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#D4AF37]" />
              </a>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#FAF5EE]/90 max-w-3xl leading-relaxed">
            Welcome to the <strong>NestBright Academy Co-Op Beta Integration</strong>. Designed specifically for 4th Grade Elementary Students (~9–10 years old), our curriculum engine delivers rigorous, state standards-aligned Math and Science modules through <strong>frameless, transparent vector manipulatives</strong>.
          </p>

          {/* Tier Selection Pills */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <span className="text-[10px] font-mono text-[#00EEEE] uppercase font-bold tracking-wider">
              Select Co-Op Access Level:
            </span>
            <div className="inline-flex p-1 rounded-2xl bg-black/40 border border-white/15">
              <button
                onClick={() => {
                  setActiveTier('free-beta');
                  triggerToast('Switched to Free Sister Co-Op Beta Access mode.');
                }}
                className={`px-4 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  activeTier === 'free-beta'
                    ? 'bg-[#00EEEE] text-[#001428] shadow-md font-black'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                Sister Co-Op Beta (100% Free)
              </button>
              <button
                onClick={() => {
                  setActiveTier('scholar-tier');
                  triggerToast('Switched to Comprehensive Scholar Tier ($14.99/mo).');
                }}
                className={`px-4 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                  activeTier === 'scholar-tier'
                    ? 'bg-[#D4AF37] text-[#001428] shadow-md font-black'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <span>Full Scholar Access ($14.99/mo)</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-black/30 text-white font-mono">40% OFF</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tier Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {NESTBRIGHT_TIERS.map((tier) => (
          <div
            key={tier.id}
            className={`rounded-3xl p-5 space-y-3 transition-all border ${
              activeTier === tier.id
                ? 'bg-white border-2 border-[#0047AB] shadow-lg ring-2 ring-[#00EEEE]/30'
                : 'bg-[#FAF5EE]/70 border-copper-penny/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded border ${
                tier.id === 'free-beta'
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : 'bg-amber-100 text-amber-900 border-amber-300'
              }`}>
                {tier.badge}
              </span>
              <span className="font-serif font-extrabold text-xl text-[#1F1813]">
                {tier.price} <span className="text-xs font-sans font-normal text-[#2A221B]/70">{tier.billingPeriod}</span>
              </span>
            </div>

            <div>
              <h4 className="font-serif font-bold text-base text-[#1F1813]">{tier.name}</h4>
              <p className="text-xs text-[#2A221B]/80 mt-0.5 leading-relaxed">{tier.description}</p>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-copper-penny/10">
              {tier.features.map((feat, idx) => (
                <div key={idx} className="flex items-start space-x-2 text-xs text-[#2A221B]/85">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0047AB] shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setActiveTier(tier.id);
                setIsBetaModalOpen(true);
              }}
              className={`w-full py-2.5 rounded-xl font-mono font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm ${
                activeTier === tier.id
                  ? 'bg-[#0047AB] hover:bg-[#003380] text-white'
                  : 'bg-white hover:bg-[#FAF5EE] text-[#1F1813] border border-copper-penny/20'
              }`}
            >
              {tier.ctaLabel}
            </button>
          </div>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* 2. 4TH GRADE INTERACTIVE 10-SLIDE CURRICULUM ENGINE                       */}
      {/* ========================================================================= */}
      <div className="bg-white border-2 border-[#0047AB]/20 rounded-3xl p-5 sm:p-7 shadow-md space-y-6">
        
        {/* Slide Deck Header & Navigation Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-copper-penny/15 pb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono uppercase tracking-widest font-extrabold px-2.5 py-0.5 rounded bg-[#0047AB]/10 text-[#0047AB] border border-[#0047AB]/20">
                {currentSlide.gradeLevel} Standard: {currentSlide.subject}
              </span>
              <span className="text-[10px] font-mono text-soft-sage font-bold">
                Slide {currentSlide.slideNumber} of 10
              </span>
            </div>
            <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#1F1813]">
              {currentSlide.title}
            </h3>
          </div>

          {/* Previous / Next Controls */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handlePrevSlide}
              disabled={currentSlideIndex === 0}
              className="p-2.5 rounded-xl border border-copper-penny/25 text-[#1F1813] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#FAF5EE] transition-all cursor-pointer"
              title="Previous Slide"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            {/* Slide Index Dots */}
            <div className="flex items-center gap-1 px-2">
              {NESTBRIGHT_4TH_GRADE_SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setCurrentSlideIndex(i);
                    setSelectedOption(null);
                    setShowExplanation(false);
                    setShowHint(false);
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                    currentSlideIndex === i 
                      ? 'w-6 bg-[#0047AB]' 
                      : 'bg-copper-penny/25 hover:bg-copper-penny/50'
                  }`}
                  title={`Jump to Slide ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNextSlide}
              disabled={currentSlideIndex === NESTBRIGHT_4TH_GRADE_SLIDES.length - 1}
              className="p-2.5 rounded-xl bg-[#0047AB] hover:bg-[#003380] text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm"
              title="Next Slide"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Objective Box */}
        <div className="bg-[#FAF5EE] border-l-4 border-[#00EEEE] rounded-r-2xl p-4 text-xs space-y-1">
          <span className="font-mono text-[10px] uppercase font-bold text-[#0047AB] block">
            Verified State Standard Learning Objective:
          </span>
          <p className="text-[#2A221B]/90 leading-relaxed font-medium">
            {currentSlide.learningObjective}
          </p>
        </div>

        {/* Explanation Text */}
        <p className="text-xs sm:text-sm text-[#2A221B]/90 leading-relaxed">
          {currentSlide.explanation}
        </p>

        {/* ========================================================================= */}
        {/* FRAMELESS VECTOR SECTION (Strict Compliance with Global Engine Rule)       */}
        {/* Transparent Canvas - NO Inner Box Frames - overflow: visible !important   */}
        {/* Palette: Cyan (#00EEEE), Cobalt Blue (#0047AB), Gold (#D4AF37), White     */}
        {/* ========================================================================= */}
        <div 
          className="w-full py-6 flex flex-col items-center justify-center relative"
          style={{ background: 'transparent', overflow: 'visible' }}
        >

          {/* MODEL A: PLACE VALUE OPEN-COLUMN CHART (Slide 1, 3, 4, 5, 7, 9) */}
          {currentSlide.visualModelType === 'place-value-chart' && (
            <div className="w-full max-w-2xl px-2" style={{ overflow: 'visible' }}>
              
              {/* Period Headers with Thin Accent Lines */}
              <div className="grid grid-cols-6 gap-2 text-center font-mono text-[10px] uppercase font-extrabold pb-2">
                <div className="col-span-3 pb-1 border-b-2 border-[#D4AF37] text-[#96551d]">
                  Thousands Period (Gold Accent)
                </div>
                <div className="col-span-3 pb-1 border-b-2 border-[#00EEEE] text-[#0047AB]">
                  Ones Period (Cyan Accent)
                </div>
              </div>

              {/* Open-Column Place Value Grid (No Card Wrapper) */}
              <div className="grid grid-cols-6 gap-2 text-center pt-2">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-[#2A221B]/60 uppercase font-bold block">Hundred Thousands</span>
                  <div className="text-xl sm:text-2xl font-serif font-black text-[#D4AF37]">8</div>
                  <span className="text-[8px] font-mono text-[#2A221B]/50 block">800,000</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-[#2A221B]/60 uppercase font-bold block">Ten Thousands</span>
                  <div className="text-xl sm:text-2xl font-serif font-black text-[#D4AF37]">0</div>
                  <span className="text-[8px] font-mono text-[#2A221B]/50 block">0</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-[#2A221B]/60 uppercase font-bold block">Thousands</span>
                  <div className="text-xl sm:text-2xl font-serif font-black text-[#D4AF37]">4</div>
                  <span className="text-[8px] font-mono text-[#2A221B]/50 block">4,000</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-[#2A221B]/60 uppercase font-bold block">Hundreds</span>
                  <div className="text-xl sm:text-2xl font-serif font-black text-[#0047AB]">2</div>
                  <span className="text-[8px] font-mono text-[#2A221B]/50 block">200</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-[#2A221B]/60 uppercase font-bold block">Tens</span>
                  <div className="text-xl sm:text-2xl font-serif font-black text-[#0047AB]">1</div>
                  <span className="text-[8px] font-mono text-[#2A221B]/50 block">10</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-[#2A221B]/60 uppercase font-bold block">Ones</span>
                  <div className="text-xl sm:text-2xl font-serif font-black text-[#0047AB]">5</div>
                  <span className="text-[8px] font-mono text-[#2A221B]/50 block">5</span>
                </div>
              </div>

              {/* Clean Inline Math Relationship Vector */}
              <div className="flex items-center justify-center space-x-3 pt-4 text-xs font-mono text-[#2A221B]/80">
                <span className="font-bold text-[#D4AF37]">800,000</span>
                <span>+</span>
                <span className="font-bold text-[#D4AF37]">4,000</span>
                <span>+</span>
                <span className="font-bold text-[#0047AB]">200</span>
                <span>+</span>
                <span className="font-bold text-[#0047AB]">10</span>
                <span>+</span>
                <span className="font-bold text-[#0047AB]">5</span>
                <span>=</span>
                <span className="font-bold text-lg text-[#1F1813] border-b-2 border-[#10B981]">804,215</span>
              </div>
            </div>
          )}

          {/* MODEL B: 3D ISOMETRIC BASE-TEN BLOCKS (Slide 2 & 8) */}
          {currentSlide.visualModelType === 'base-ten-blocks' && (
            <div className="w-full max-w-3xl space-y-4" style={{ overflow: 'visible' }}>
              
              {/* Interactive Manipulative Controls for Slide 2 */}
              {currentSlide.slideNumber === 2 && (
                <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono pb-2">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[#D4AF37] font-bold">Thousands (1000):</span>
                    <button 
                      onClick={() => setBuilderThousands(Math.max(1, builderThousands - 1))}
                      className="w-6 h-6 rounded bg-[#FAF5EE] border border-copper-penny/25 hover:bg-copper-penny/10 font-bold"
                    >-</button>
                    <span className="font-bold text-sm w-4 text-center">{builderThousands}</span>
                    <button 
                      onClick={() => setBuilderThousands(Math.min(6, builderThousands + 1))}
                      className="w-6 h-6 rounded bg-[#FAF5EE] border border-copper-penny/25 hover:bg-copper-penny/10 font-bold"
                    >+</button>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <span className="text-[#0047AB] font-bold">Hundreds (100):</span>
                    <button 
                      onClick={() => setBuilderHundreds(Math.max(0, builderHundreds - 1))}
                      className="w-6 h-6 rounded bg-[#FAF5EE] border border-copper-penny/25 hover:bg-copper-penny/10 font-bold"
                    >-</button>
                    <span className="font-bold text-sm w-4 text-center">{builderHundreds}</span>
                    <button 
                      onClick={() => setBuilderHundreds(Math.min(9, builderHundreds + 1))}
                      className="w-6 h-6 rounded bg-[#FAF5EE] border border-copper-penny/25 hover:bg-copper-penny/10 font-bold"
                    >+</button>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <span className="text-[#00EEEE] font-bold text-[#006677]">Tens (10):</span>
                    <button 
                      onClick={() => setBuilderTens(Math.max(0, builderTens - 1))}
                      className="w-6 h-6 rounded bg-[#FAF5EE] border border-copper-penny/25 hover:bg-copper-penny/10 font-bold"
                    >-</button>
                    <span className="font-bold text-sm w-4 text-center">{builderTens}</span>
                    <button 
                      onClick={() => setBuilderTens(Math.min(9, builderTens + 1))}
                      className="w-6 h-6 rounded bg-[#FAF5EE] border border-copper-penny/25 hover:bg-copper-penny/10 font-bold"
                    >+</button>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <span className="text-[#10B981] font-bold">Ones (1):</span>
                    <button 
                      onClick={() => setBuilderOnes(Math.max(0, builderOnes - 1))}
                      className="w-6 h-6 rounded bg-[#FAF5EE] border border-copper-penny/25 hover:bg-copper-penny/10 font-bold"
                    >-</button>
                    <span className="font-bold text-sm w-4 text-center">{builderOnes}</span>
                    <button 
                      onClick={() => setBuilderOnes(Math.min(9, builderOnes + 1))}
                      className="w-6 h-6 rounded bg-[#FAF5EE] border border-copper-penny/25 hover:bg-copper-penny/10 font-bold"
                    >+</button>
                  </div>
                </div>
              )}

              {/* RAW INLINE SVG: 3D Isometric Base-Ten Blocks floating on transparent background */}
              <svg 
                viewBox="0 0 650 160" 
                className="w-full max-w-2xl mx-auto" 
                style={{ overflow: 'visible', background: 'transparent' }}
              >
                {/* 1. THOUSANDS CUBE: NestBright Gold (#D4AF37) */}
                <g transform="translate(40, 25)">
                  {/* Top face */}
                  <polygon points="40,0 80,18 40,36 0,18" fill="#D4AF37" stroke="#1F1813" strokeWidth="1.5" />
                  {/* Left face */}
                  <polygon points="0,18 40,36 40,96 0,78" fill="#B89228" stroke="#1F1813" strokeWidth="1.5" />
                  {/* Right face */}
                  <polygon points="40,36 80,18 80,78 40,96" fill="#8C6D1A" stroke="#1F1813" strokeWidth="1.5" />
                  <text x="40" y="118" textAnchor="middle" fill="#96551d" fontSize="11" fontFamily="monospace" fontWeight="bold">
                    {builderThousands}× Thousand Cube ({builderThousands * 1000})
                  </text>
                </g>

                {/* 2. HUNDREDS FLAT: NestBright Cobalt Blue (#0047AB) */}
                <g transform="translate(220, 45)">
                  {/* Top face */}
                  <polygon points="35,0 70,15 35,30 0,15" fill="#0047AB" stroke="#1F1813" strokeWidth="1.5" />
                  {/* Left thin rim */}
                  <polygon points="0,15 35,30 35,38 0,23" fill="#003380" stroke="#1F1813" strokeWidth="1.5" />
                  {/* Right thin rim */}
                  <polygon points="35,30 70,15 70,23 35,38" fill="#002255" stroke="#1F1813" strokeWidth="1.5" />
                  <text x="35" y="98" textAnchor="middle" fill="#0047AB" fontSize="11" fontFamily="monospace" fontWeight="bold">
                    {builderHundreds}× Hundred Flat ({builderHundreds * 100})
                  </text>
                </g>

                {/* 3. TENS ROD: NestBright Cyan (#00EEEE) */}
                <g transform="translate(380, 40)">
                  {/* Top small face */}
                  <polygon points="8,0 16,4 8,8 0,4" fill="#00EEEE" stroke="#1F1813" strokeWidth="1.5" />
                  {/* Left vertical rod */}
                  <polygon points="0,4 8,8 8,64 0,60" fill="#00CCCC" stroke="#1F1813" strokeWidth="1.5" />
                  {/* Right vertical rod */}
                  <polygon points="8,8 16,4 16,60 8,64" fill="#009999" stroke="#1F1813" strokeWidth="1.5" />
                  <text x="8" y="103" textAnchor="middle" fill="#007788" fontSize="11" fontFamily="monospace" fontWeight="bold">
                    {builderTens}× Ten Rod ({builderTens * 10})
                  </text>
                </g>

                {/* 4. ONES UNITS: Accent Emerald (#10B981) */}
                <g transform="translate(500, 75)">
                  {/* Unit cube */}
                  <polygon points="7,0 14,3.5 7,7 0,3.5" fill="#10B981" stroke="#1F1813" strokeWidth="1.5" />
                  <polygon points="0,3.5 7,7 7,14 0,10.5" fill="#0D9668" stroke="#1F1813" strokeWidth="1.5" />
                  <polygon points="7,7 14,3.5 14,10.5 7,14" fill="#09734F" stroke="#1F1813" strokeWidth="1.5" />
                  <text x="7" y="68" textAnchor="middle" fill="#0D9668" fontSize="11" fontFamily="monospace" fontWeight="bold">
                    {builderOnes}× Units ({builderOnes})
                  </text>
                </g>
              </svg>

              {/* Live Standard Assembly Display */}
              <div className="text-center font-mono text-xs">
                <span className="text-soft-sage font-bold">Standard Value: </span>
                <strong className="text-lg font-serif font-black text-[#1F1813] ml-1">
                  {totalCalculatedValue.toLocaleString()}
                </strong>
                <span className="text-[10px] text-soft-sage ml-2">
                  ({builderThousands}k + {builderHundreds}h + {builderTens}t + {builderOnes}u)
                </span>
              </div>
            </div>
          )}

          {/* MODEL C: FRAMELESS FRACTION BARS (Slide 6) */}
          {currentSlide.visualModelType === 'fraction-bars' && (
            <div className="w-full max-w-xl space-y-3" style={{ overflow: 'visible' }}>
              <span className="text-[10px] font-mono text-center uppercase font-bold text-soft-sage block">
                Visual Equivalence: Comparing 3/4 and 6/8
              </span>

              {/* Raw Inline SVG Fraction Bars */}
              <svg viewBox="0 0 500 110" className="w-full" style={{ overflow: 'visible', background: 'transparent' }}>
                {/* 1 Whole Unit Bar */}
                <g transform="translate(10, 5)">
                  <rect x="0" y="0" width="480" height="24" fill="#FAF5EE" stroke="#1F1813" strokeWidth="1.5" rx="3" />
                  <text x="240" y="16" textAnchor="middle" fill="#1F1813" fontSize="10" fontFamily="monospace" fontWeight="bold">1 Whole</text>
                </g>

                {/* 3/4 Bar (Cobalt Blue #0047AB) */}
                <g transform="translate(10, 38)">
                  <rect x="0" y="0" width="120" height="24" fill="#0047AB" stroke="#1F1813" strokeWidth="1.5" />
                  <rect x="120" y="0" width="120" height="24" fill="#0047AB" stroke="#1F1813" strokeWidth="1.5" />
                  <rect x="240" y="0" width="120" height="24" fill="#0047AB" stroke="#1F1813" strokeWidth="1.5" />
                  <rect x="360" y="0" width="120" height="24" fill="#FFFFFF" stroke="#1F1813" strokeWidth="1.5" />
                  <text x="60" y="16" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontFamily="monospace" fontWeight="bold">1/4</text>
                  <text x="180" y="16" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontFamily="monospace" fontWeight="bold">1/4</text>
                  <text x="300" y="16" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontFamily="monospace" fontWeight="bold">1/4</text>
                  <text x="420" y="16" textAnchor="middle" fill="#1F1813" fontSize="10" fontFamily="monospace" fontWeight="bold">1/4</text>
                </g>

                {/* 6/8 Bar (Cyan #00EEEE) */}
                <g transform="translate(10, 71)">
                  {[0, 60, 120, 180, 240, 300].map((xPos, i) => (
                    <rect key={i} x={xPos} y="0" width="60" height="24" fill="#00EEEE" stroke="#1F1813" strokeWidth="1.5" />
                  ))}
                  {[360, 420].map((xPos, i) => (
                    <rect key={i} x={xPos} y="0" width="60" height="24" fill="#FFFFFF" stroke="#1F1813" strokeWidth="1.5" />
                  ))}
                  {[0, 60, 120, 180, 240, 300, 360, 420].map((xPos, i) => (
                    <text key={i} x={xPos + 30} y="16" textAnchor="middle" fill={i < 6 ? '#001428' : '#1F1813'} fontSize="9" fontFamily="monospace" fontWeight="bold">1/8</text>
                  ))}
                </g>
              </svg>

              <div className="text-center text-xs font-mono font-bold text-[#0047AB]">
                3/4 (3 shaded fourths) = 6/8 (6 shaded eighths)
              </div>
            </div>
          )}

          {/* MODEL D: CELEBRATION TROPHY (Slide 10) */}
          {currentSlide.visualModelType === 'celebration-trophy' && (
            <div className="text-center space-y-3" style={{ overflow: 'visible' }}>
              <svg viewBox="0 0 200 160" className="w-48 h-40 mx-auto" style={{ overflow: 'visible', background: 'transparent' }}>
                {/* Confetti particles */}
                <circle cx="30" cy="30" r="4" fill="#00EEEE" />
                <circle cx="170" cy="25" r="3.5" fill="#D4AF37" />
                <rect x="40" y="70" width="6" height="6" fill="#10B981" transform="rotate(25 40 70)" />
                <rect x="160" y="80" width="7" height="7" fill="#0047AB" transform="rotate(-30 160 80)" />
                <circle cx="90" cy="15" r="3" fill="#D4AF37" />

                {/* Trophy Cup */}
                <g transform="translate(60, 30)">
                  {/* Left handle */}
                  <path d="M 0 20 C -20 20 -20 50 0 50" fill="none" stroke="#D4AF37" strokeWidth="4" />
                  {/* Right handle */}
                  <path d="M 80 20 C 100 20 100 50 80 50" fill="none" stroke="#D4AF37" strokeWidth="4" />
                  {/* Cup bowl */}
                  <path d="M 0 0 L 80 0 L 68 60 C 60 75 20 75 12 60 Z" fill="#D4AF37" stroke="#1F1813" strokeWidth="2" />
                  {/* Inner gold highlight */}
                  <path d="M 10 5 L 70 5 L 60 55 C 55 65 25 65 20 55 Z" fill="#F3E5AB" />
                  <text x="40" y="38" textAnchor="middle" fill="#1F1813" fontSize="16" fontFamily="serif" fontWeight="bold">★</text>
                  {/* Stem */}
                  <rect x="34" y="72" width="12" height="18" fill="#B89228" stroke="#1F1813" strokeWidth="1.5" />
                  {/* Base */}
                  <rect x="15" y="90" width="50" height="15" fill="#1F1813" rx="3" />
                  <text x="40" y="101" textAnchor="middle" fill="#00EEEE" fontSize="8" fontFamily="monospace" fontWeight="bold">GRADE 4</text>
                </g>
              </svg>

              <div className="space-y-1">
                <h4 className="font-serif font-extrabold text-2xl text-[#D4AF37]">
                  Mastery Unlocked, Young Scholar!
                </h4>
                <p className="text-xs text-[#2A221B]/80 max-w-md mx-auto">
                  You successfully mastered 4th Grade Place Value, Multi-Digit Operations, and Fraction Equivalence on the NestBright Sovereign Flight Path.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => triggerToast('🎓 Official NestBright 4th Grade Mastery Certificate downloaded!')}
                    className="px-5 py-2.5 rounded-xl bg-[#0047AB] hover:bg-[#003380] text-white font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center space-x-2 mx-auto cursor-pointer shadow-md"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Mastery Certificate</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* ========================================================================= */}
        {/* SLIDE 1 INTEGRATED WORD MATCH GAME                                        */}
        {/* ========================================================================= */}
        {currentSlide.slideNumber === 1 && currentSlide.wordMatchGame && (
          <div className="bg-[#FAF5EE] border-2 border-[#0047AB]/20 rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-copper-penny/15 pb-2">
              <div className="flex items-center space-x-2 text-[#0047AB]">
                <HelpCircle className="w-4 h-4 text-[#0047AB]" />
                <h4 className="font-serif font-bold text-sm text-[#1F1813]">
                  Slide 1 Vocabulary Match Challenge
                </h4>
              </div>
              <span className="text-[9px] font-mono uppercase bg-[#00EEEE]/20 text-[#0047AB] px-2 py-0.5 rounded font-bold">
                Daily Word Game
              </span>
            </div>

            <p className="text-xs text-[#2A221B]/80">
              Match each essential math term to its correct standard definition:
            </p>

            <div className="space-y-3">
              {currentSlide.wordMatchGame.map((item, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-white rounded-xl border border-copper-penny/10 text-xs">
                  <span className="font-serif font-bold text-sm text-[#0047AB] sm:w-1/4">
                    {item.term}
                  </span>
                  <div className="sm:w-3/4 flex items-center gap-2">
                    <span className="text-[#2A221B]/80 leading-relaxed text-[11px] flex-1">
                      {item.definition}
                    </span>
                    <button
                      onClick={() => {
                        setWordMatchAnswers({ ...wordMatchAnswers, [item.term]: 'matched' });
                        triggerToast(`✨ Correct match for "${item.term}"!`);
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                        wordMatchAnswers[item.term] === 'matched'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#FAF5EE] hover:bg-[#0047AB] hover:text-white text-[#1F1813] border border-copper-penny/20'
                      }`}
                    >
                      {wordMatchAnswers[item.term] === 'matched' ? '✓ Mastered' : 'Match'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PRACTICE PROBLEM INTERACTIVE CONTAINER (Slides 4 through 9)                */}
        {/* ========================================================================= */}
        {currentSlide.practiceProblem && (
          <div className="bg-[#FAF5EE] border-2 border-[#0047AB]/20 rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-copper-penny/15 pb-2">
              <span className="font-serif font-bold text-sm text-[#1F1813] flex items-center space-x-2">
                <Lightbulb className="w-4 h-4 text-[#D4AF37]" />
                <span>{currentSlide.slideType === 'Golden Rule Check' ? 'Golden Rule Check for Understanding' : `Practice Problem ${currentSlide.slideNumber - 4}`}</span>
              </span>

              <button
                onClick={() => setShowHint(!showHint)}
                className="text-xs font-mono text-[#0047AB] hover:underline flex items-center space-x-1 cursor-pointer"
              >
                <span>{showHint ? 'Hide Hint' : 'Need a Hint?'}</span>
              </button>
            </div>

            <p className="text-xs sm:text-sm font-semibold text-[#1F1813] leading-relaxed">
              {currentSlide.practiceProblem.question}
            </p>

            {/* Hint Callout */}
            {showHint && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start space-x-2">
                <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span><strong>Hint:</strong> {currentSlide.practiceProblem.hint}</span>
              </div>
            )}

            {/* Multiple Choice Options */}
            <div className="space-y-2">
              {currentSlide.practiceProblem.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentSlide.practiceProblem?.correctAnswer;
                
                let buttonStyle = 'bg-white text-[#1F1813] border-copper-penny/20 hover:border-[#0047AB]/40 hover:bg-[#FAF5EE]';
                if (showExplanation) {
                  if (isCorrect) {
                    buttonStyle = 'bg-emerald-50 text-emerald-950 border-2 border-emerald-600 font-bold';
                  } else if (isSelected && !isCorrect) {
                    buttonStyle = 'bg-rose-50 text-rose-950 border-2 border-rose-500 font-medium';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-start space-x-2.5 cursor-pointer ${buttonStyle}`}
                  >
                    <span className="w-5 h-5 rounded-full border border-current font-mono text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1 leading-relaxed">{opt}</span>
                    {showExplanation && isCorrect && (
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Distractor & Instant Feedback */}
            {showExplanation && (
              <div className={`p-4 rounded-xl text-xs space-y-1 ${
                selectedOption === currentSlide.practiceProblem.correctAnswer
                  ? 'bg-emerald-100/70 border border-emerald-300 text-emerald-950'
                  : 'bg-rose-100/70 border border-rose-300 text-rose-950'
              }`}>
                <strong className="block font-bold">
                  {selectedOption === currentSlide.practiceProblem.correctAnswer ? '🎉 Brilliant Insight!' : '🌱 Not Quite Yet — Review the Math Rule:'}
                </strong>
                <p className="leading-relaxed">
                  {currentSlide.practiceProblem.explanation}
                </p>
              </div>
            )}
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* BETA REGISTRATION MODAL                                                   */}
      {/* ========================================================================= */}
      {isBetaModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF5EE] border-2 border-[#00EEEE] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-fade-in text-[#1F1813]">
            <div className="flex items-center justify-between border-b border-copper-penny/20 pb-3">
              <div className="flex items-center space-x-2 text-[#0047AB]">
                <GraduationCap className="w-5 h-5 text-[#00EEEE]" />
                <h3 className="font-serif font-bold text-lg text-[#1F1813]">
                  NestBright Beta Registration
                </h3>
              </div>
              <button
                onClick={() => setIsBetaModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white text-gray-500 hover:text-black flex items-center justify-center border border-copper-penny/20 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#2A221B]/80 leading-relaxed">
              Enroll your elementary child into the <strong>NestBright Academy Sovereign Flight Path</strong>. Verified Copper Mommies receive instant access to full weekly curriculum decks and standard-aligned practice engines.
            </p>

            <form onSubmit={handleActivateBetaSubmit} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="block font-mono text-[10px] uppercase font-bold text-soft-sage">
                  Child Scholar's Name
                </label>
                <input
                  type="text"
                  required
                  value={registeredChildName}
                  onChange={(e) => setRegisteredChildName(e.target.value)}
                  placeholder="e.g. Amari"
                  className="w-full bg-white border border-copper-penny/25 rounded-xl px-3 py-2 text-xs text-[#1F1813] focus:outline-none focus:border-[#0047AB]"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-mono text-[10px] uppercase font-bold text-soft-sage">
                  Grade Level
                </label>
                <select
                  value={registeredGrade}
                  onChange={(e) => setRegisteredGrade(e.target.value as any)}
                  className="w-full bg-white border border-copper-penny/25 rounded-xl px-3 py-2 text-xs text-[#1F1813] focus:outline-none focus:border-[#0047AB]"
                >
                  <option value="Grade 3">Grade 3 (Ages 8-9)</option>
                  <option value="Grade 4">Grade 4 (Ages 9-10) — Flagship</option>
                  <option value="Grade 5">Grade 5 (Ages 10-11)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block font-mono text-[10px] uppercase font-bold text-soft-sage">
                  Selected Tier
                </label>
                <div className="p-3 bg-white rounded-xl border border-copper-penny/20 text-xs flex justify-between items-center">
                  <span className="font-bold">{activeTier === 'free-beta' ? 'Sister Co-Op Beta' : 'Full Scholar Pass'}</span>
                  <span className="font-mono text-[#0047AB] font-extrabold">{activeTier === 'free-beta' ? '100% Free' : '$14.99/mo'}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsBetaModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white border border-copper-penny/25 font-mono text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0047AB] hover:bg-[#003380] text-white font-mono font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md"
                >
                  Confirm Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
