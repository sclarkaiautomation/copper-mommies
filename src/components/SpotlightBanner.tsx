import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Sparkles, 
  ExternalLink, 
  Gift, 
  CheckCircle, 
  Copy, 
  Check, 
  Award, 
  BookOpen, 
  HelpCircle, 
  Send, 
  X, 
  Calendar, 
  GraduationCap, 
  Star,
  Users,
  ChevronRight,
  ChevronLeft,
  Sun,
  Flame,
  Info,
  Pause,
  Play,
  Layers,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PageSpotlightBanner, ScholarshipEntry } from '../types';

interface SpotlightBannerProps {
  banner?: PageSpotlightBanner;
  banners?: PageSpotlightBanner[];
  userName?: string;
  userEmail?: string;
  selectedState?: string;
  onAddScholarshipEntry?: (entry: Omit<ScholarshipEntry, 'id' | 'submittedAt' | 'verifiedStatus' | 'ticketCode'>) => void;
  entriesCount?: number;
  onOpenAdminManager?: () => void;
  isAdmin?: boolean;
  autoScrollIntervalMs?: number;
  sectionTitle?: string;
}

export default function SpotlightBanner({
  banner,
  banners,
  userName = 'Mama Shantrece',
  userEmail = 'shantrece@coppermommies.co',
  selectedState = 'GA',
  onAddScholarshipEntry,
  entriesCount = 14,
  onOpenAdminManager,
  isAdmin = false,
  autoScrollIntervalMs = 5000,
  sectionTitle
}: SpotlightBannerProps) {
  // Normalize banner list: accept either a single banner, an array of banners, or both
  const activeBanners: PageSpotlightBanner[] = useMemo(() => {
    if (banners && banners.length > 0) {
      return banners.filter(b => b.active !== false);
    }
    if (banner && banner.active !== false) {
      return [banner];
    }
    return [];
  }, [banners, banner]);

  const totalFeatures = activeBanners.length;

  // Carousel Navigation State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isManuallyPaused, setIsManuallyPaused] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'next' | 'prev'>('next');
  const [progress, setProgress] = useState(0);

  // Modals & Action State
  const [copiedCode, setCopiedCode] = useState(false);
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);

  // Contest Entry Form State
  const [motherName, setMotherName] = useState(userName);
  const [motherEmail, setMotherEmail] = useState(userEmail);
  const [motherPhone, setMotherPhone] = useState('');
  const [childName, setChildName] = useState('');
  const [childGrade, setChildGrade] = useState<'Grade 3' | 'Grade 4' | 'Grade 5'>('Grade 4');
  const [stateCode, setStateCode] = useState(selectedState);
  const [learningGoals, setLearningGoals] = useState('');
  const [confirmedEligibility, setConfirmedEligibility] = useState(false);

  // Contact / Help state
  const [contactMessage, setContactMessage] = useState('');
  const [contactSuccess, setContactSuccess] = useState(false);

  // Keep index within bounds if list shrinks
  useEffect(() => {
    if (currentIndex >= totalFeatures && totalFeatures > 0) {
      setCurrentIndex(0);
    }
  }, [totalFeatures, currentIndex]);

  // Current active banner object
  const currentBanner = activeBanners[currentIndex] || activeBanners[0];

  // Manual navigation handlers
  const startTimeRef = useRef<number>(Date.now());
  const elapsedBeforePauseRef = useRef<number>(0);

  const handlePrev = () => {
    if (totalFeatures <= 1) return;
    setSlideDirection('prev');
    startTimeRef.current = Date.now();
    elapsedBeforePauseRef.current = 0;
    setProgress(0);
    setCurrentIndex(prev => (prev === 0 ? totalFeatures - 1 : prev - 1));
  };

  const handleNext = () => {
    if (totalFeatures <= 1) return;
    setSlideDirection('next');
    startTimeRef.current = Date.now();
    elapsedBeforePauseRef.current = 0;
    setProgress(0);
    setCurrentIndex(prev => (prev === totalFeatures - 1 ? 0 : prev + 1));
  };

  const handleSelectIndex = (idx: number) => {
    if (idx === currentIndex) return;
    setSlideDirection(idx > currentIndex ? 'next' : 'prev');
    startTimeRef.current = Date.now();
    elapsedBeforePauseRef.current = 0;
    setProgress(0);
    setCurrentIndex(idx);
  };

  const toggleManualPlayPause = () => {
    setIsManuallyPaused(prev => !prev);
    startTimeRef.current = Date.now();
    elapsedBeforePauseRef.current = 0;
    setProgress(0);
  };

  // Check if automatic scrolling is currently active
  // Rule: If only one feature, automatic scroll is OFF (banner stays completely still).
  // When 2 or more features are displayed, it auto-scrolls in exact alignment with the moving colored bar!
  // It will NOT sit idle on mouse hover. Only manual pause or open dialogs pause it.
  const isAutoScrollActive = totalFeatures > 1 && !isManuallyPaused && !showEntryModal && !showContactModal;

  // Auto-scroll Timer & Progress bar loop (strict synchronization with colored bar)
  useEffect(() => {
    if (!isAutoScrollActive) {
      setProgress(0);
      return;
    }

    startTimeRef.current = Date.now();
    setProgress(0);

    const stepMs = 30;
    const timer = setInterval(() => {
      const now = Date.now();
      const elapsed = now - startTimeRef.current;
      const currentPct = Math.min(100, (elapsed / autoScrollIntervalMs) * 100);
      setProgress(currentPct);

      if (elapsed >= autoScrollIntervalMs) {
        startTimeRef.current = Date.now();
        setProgress(0);
        setSlideDirection('next');
        setCurrentIndex(current => (current === totalFeatures - 1 ? 0 : current + 1));
      }
    }, stepMs);

    return () => clearInterval(timer);
  }, [isAutoScrollActive, autoScrollIntervalMs, totalFeatures, currentIndex]);

  const handleCopyCode = (code?: string) => {
    if (code) {
      navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    }
  };

  const handleSubmitEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!childName.trim() || !learningGoals.trim() || !confirmedEligibility || !currentBanner) return;

    const ticket = `NB-${Math.floor(100000 + Math.random() * 900000)}`;
    
    if (onAddScholarshipEntry) {
      onAddScholarshipEntry({
        spotlightId: currentBanner.id,
        motherName: motherName.trim() || userName,
        motherEmail: motherEmail.trim() || userEmail,
        motherPhone: motherPhone.trim(),
        childName: childName.trim(),
        childGrade,
        stateCode: stateCode || selectedState,
        learningGoals: learningGoals.trim(),
        notes: `Confirmed eligible for ${childGrade}`
      });
    }

    setSubmittedTicket(ticket);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactMessage.trim()) return;
    setContactSuccess(true);
    setTimeout(() => {
      setContactSuccess(false);
      setShowContactModal(false);
      setContactMessage('');
    }, 2200);
  };

  if (!currentBanner || totalFeatures === 0) {
    return null;
  }

  return (
    <div 
      className="w-full my-3"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="region"
      aria-label="Featured Community Spotlights"
    >
      {/* Optional Section Label if defined */}
      {sectionTitle && (
        <div className="flex items-center justify-between mb-2 px-1">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <h3 className="font-serif font-bold text-sm text-[#1F1813]">{sectionTitle}</h3>
          </div>
          {totalFeatures > 1 && (
            <span className="text-[10px] font-mono text-[#B87333] font-bold">
              {currentIndex + 1} of {totalFeatures} Features
            </span>
          )}
        </div>
      )}

      {/* Horizontal Callout Card with Hover State Listeners */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FFFDF9] via-[#FAF5EE] to-[#F5ECE1] border-2 border-[#B87333]/35 shadow-md hover:shadow-lg transition-all duration-300">
        
        {/* Subtle Background Glow Accents */}
        <div className="absolute -top-16 -right-16 w-60 h-60 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-60 h-60 bg-[#B87333]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Asset Accent Bar */}
        <div className="bg-gradient-to-r from-[#1F1813] via-[#2A221B] to-[#1F1813] px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2 border-b border-[#D4AF37]/30 text-white">
          
          {/* Left: Indicator */}
          <div className="flex items-center space-x-2.5">
            <span className="inline-flex rounded-full h-2 w-2 bg-[#D4AF37] animate-pulse"></span>
            <span className="text-[10px] sm:text-xs font-mono font-extrabold uppercase tracking-widest text-[#D4AF37] flex items-center gap-1.5">
              <span>PAID FEATURED PARTNER • COMMUNITY MARKETPLACE</span>
            </span>
          </div>

          {/* Right: Verified Partner Badge & Controls */}
          <div className="flex items-center space-x-2.5 text-[11px] font-mono text-[#D4AF37]">
            <span className="bg-[#D4AF37]/20 border border-[#D4AF37]/40 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-[#D4AF37] flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-[#D4AF37]" />
              <span>Verified Partner</span>
            </span>

            {/* Carousel Navigation / Pause if multiple */}
            {totalFeatures > 1 && (
              <div className="flex items-center space-x-1 bg-white/10 p-0.5 rounded-xl border border-white/15 backdrop-blur-xs">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="p-1 text-[#FAF5EE] hover:text-[#D4AF37] rounded-lg transition-colors cursor-pointer"
                  aria-label="Previous Feature"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={toggleManualPlayPause}
                  className="p-1 text-[#FAF5EE] hover:text-[#D4AF37] rounded-lg transition-colors cursor-pointer"
                  aria-label={isManuallyPaused ? "Resume" : "Pause"}
                >
                  {isManuallyPaused ? <Play className="w-3 h-3 text-emerald-400" /> : <Pause className="w-3 h-3 text-amber-300" />}
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="p-1 text-[#FAF5EE] hover:text-[#D4AF37] rounded-lg transition-colors cursor-pointer"
                  aria-label="Next Feature"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            {isAdmin && onOpenAdminManager && (
              <button 
                onClick={onOpenAdminManager}
                className="text-[9px] uppercase tracking-wider bg-white/10 hover:bg-white/20 text-[#D4AF37] px-2 py-0.5 rounded border border-[#D4AF37]/30 cursor-pointer font-bold"
              >
                ⚙️ Manage
              </button>
            )}
          </div>
        </div>

        {/* Auto-scroll Progress Bar */}
        {totalFeatures > 1 && (
          <div className="w-full h-1.5 bg-[#2A221B]/30 relative overflow-hidden shrink-0">
            <div 
              className={`h-full bg-gradient-to-r from-[#B87333] via-[#D4AF37] to-[#E5A65E] transition-all duration-30 ease-linear ${
                isAutoScrollActive ? 'opacity-100' : 'opacity-40'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Animated Banner Content Body - Streamlined Asymmetrical 3-Column Layout */}
        <div className="p-3.5 sm:p-4 lg:p-5 min-h-[290px] md:h-[260px] lg:h-[250px] flex flex-col justify-between relative overflow-hidden shrink-0" style={{ contain: 'layout style' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentBanner.id || currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              className="w-full h-full flex flex-col justify-between overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-[27%_1fr_27%] lg:grid-cols-[26%_1fr_26%] gap-3 sm:gap-4 lg:gap-5 h-full items-stretch overflow-hidden">
                
                {/* 1. Left Container (Visual Anchor): 25%-30% width */}
                <div className="relative rounded-xl overflow-hidden border-2 border-[#B87333]/40 shadow-xs bg-[#1F140E] flex flex-col h-full min-h-[140px] group">
                  {currentBanner.bannerImage ? (
                    <a 
                      href={currentBanner.externalLink || '#'} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block w-full h-full relative overflow-hidden"
                      title={`Visit ${currentBanner.title}`}
                    >
                      <img 
                        src={currentBanner.bannerImage} 
                        alt={currentBanner.title} 
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                        <span className="text-[10px] font-mono font-bold text-[#D4AF37] bg-black/80 px-2 py-0.5 rounded flex items-center gap-1">
                          <span>Visit Partner</span>
                          <ExternalLink className="w-3 h-3" />
                        </span>
                      </div>
                    </a>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-[#FAF5EE] text-[#1F1813]/60">
                      <span className="text-xs font-mono font-bold">[Your Image Here]</span>
                    </div>
                  )}
                </div>

                {/* 2. Center Container (Streamlined Information): 45%-50% width with generous padding */}
                <div className="flex flex-col justify-between py-0.5 px-1 sm:px-2 min-w-0 space-y-1.5 overflow-hidden">
                  <div className="space-y-0.5">
                    {/* Row 1: Advertiser Brand Name */}
                    <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#B87333]">
                      {currentBanner.subtitle || currentBanner.categoryBadge || 'Your Brand Name Co.'}
                    </div>
                    {/* Row 2: Primary Feature Headline */}
                    <h3 className="font-serif font-extrabold text-base sm:text-lg text-[#1F1813] leading-snug line-clamp-1">
                      {currentBanner.title}
                    </h3>
                  </div>

                  {/* Row 3: Sub-header / Sub-title text block */}
                  <p className="text-xs sm:text-[13px] text-[#2A221B]/90 leading-relaxed line-clamp-2">
                    {currentBanner.description}
                  </p>

                  {/* Row 4: Streamlined compact bulleted list [Key Features] */}
                  <div className="space-y-1 pt-1 border-t border-[#B87333]/15 shrink-0">
                    <span className="text-[10px] font-mono font-bold text-[#B87333] uppercase block">Key Features:</span>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-0.5 text-[11px] text-[#1F1813]/85 font-mono">
                      <li className="flex items-center space-x-1 truncate">
                        <span className="text-[#B87333] font-bold">•</span>
                        <span className="truncate">{currentBanner.promoHeadline || 'Verified Quality'}</span>
                      </li>
                      <li className="flex items-center space-x-1 truncate">
                        <span className="text-[#B87333] font-bold">•</span>
                        <span className="truncate">Sovereignty &amp; Ethics</span>
                      </li>
                      <li className="flex items-center space-x-1 truncate">
                        <span className="text-[#B87333] font-bold">•</span>
                        <span className="truncate">Exclusive Community Benefit</span>
                      </li>
                      <li className="flex items-center space-x-1 truncate">
                        <span className="text-[#B87333] font-bold">•</span>
                        <span className="truncate">Direct Sisterhood Access</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* 3. Right Container (Offer & Conversion Box): 20%-25% width */}
                <div className="w-full bg-[#1F1813] text-white border-2 border-[#D4AF37]/50 rounded-2xl p-3.5 flex flex-col justify-between shadow-xl space-y-1.5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-[#D4AF37]/10 rounded-full blur-xl pointer-events-none" />

                  {/* Top badge */}
                  <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-1">
                    <span className="text-[8.5px] font-mono font-extrabold uppercase tracking-wider text-[#D4AF37] bg-[#D4AF37]/15 px-2 py-0.5 rounded-full border border-[#D4AF37]/30">
                      EXCLUSIVE COMMUNITY OFFER | Verified
                    </span>
                    {currentBanner.regularPrice && (
                      <span className="text-[10px] line-through text-gray-400 font-mono">
                        {currentBanner.regularPrice}
                      </span>
                    )}
                  </div>

                  {/* Top half: Large discount typography & label */}
                  <div>
                    <div className="text-xl sm:text-2xl font-black text-[#D4AF37] font-mono glow-gold-text">
                      {currentBanner.promoPrice || '15% off'}
                    </div>
                    <div className="text-[10px] text-gray-300 font-mono">
                      Your discount here (Copper Mommies community)
                    </div>
                  </div>

                  {/* Middle half: Compact coupon code field & Copy button */}
                  {currentBanner.promoCode && (
                    <div className="bg-white/10 border border-[#D4AF37]/40 rounded-xl px-2.5 py-1.5 flex items-center justify-between gap-1.5">
                      <div className="min-w-0">
                        <span className="text-[8px] uppercase font-mono text-gray-400 block leading-tight">Coupon Code:</span>
                        <span className="font-mono font-black text-xs text-[#D4AF37] tracking-wider truncate block">
                          {currentBanner.promoCode}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyCode(currentBanner.promoCode)}
                        className="px-2.5 py-1 bg-[#D4AF37] hover:bg-[#b59226] text-[#1F1813] text-[10px] font-bold rounded-lg shadow-xs active:scale-95 transition-all flex items-center space-x-1 cursor-pointer shrink-0"
                      >
                        {copiedCode ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-800" />
                            <span className="text-emerald-900 text-[10px]">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-[#1F1813]" />
                            <span className="text-[10px]">Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Bottom half: Distinct high-contrast Call-to-Action button */}
                  <div className="pt-0.5">
                    <a
                      href={currentBanner.promoLink || currentBanner.externalLink || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 bg-gradient-to-r from-[#D4AF37] to-[#B87333] hover:from-[#e0bc46] hover:to-[#c47f3e] text-[#1F1813] font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5 text-center cursor-pointer"
                    >
                      <span>{currentBanner.buttonText || currentBanner.linkText || 'Claim Community Offer'}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-[#1F1813] shrink-0" />
                    </a>
                  </div>
                </div>

              </div>
            </motion.div>
          </AnimatePresence>

          {/* Bottom Pagination: Clean Minimal Dots & Chevron Arrows without bulky pill tabs */}
          {totalFeatures > 1 && (
            <div className="pt-2 border-t border-[#B87333]/20 flex items-center justify-between gap-2">
              {/* Minimal Pagination Dots */}
              <div className="flex items-center space-x-1.5">
                {activeBanners.map((b, idx) => {
                  const isActive = idx === currentIndex;
                  return (
                    <button
                      key={b.id || idx}
                      type="button"
                      onClick={() => handleSelectIndex(idx)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        isActive 
                          ? 'w-6 bg-[#D4AF37] shadow-xs' 
                          : 'w-2 bg-[#1F1813]/25 hover:bg-[#B87333]/60'
                      }`}
                      title={`Jump to feature ${idx + 1}: ${b.title}`}
                      aria-label={`Jump to feature ${idx + 1}: ${b.title}`}
                    />
                  );
                })}
              </div>

              {/* Minimal Counter & Chevron Controls */}
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono text-[#1F1813]/70 font-bold">
                  {currentIndex + 1} of {totalFeatures}
                </span>

                <div className="flex items-center space-x-1">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="p-1 bg-white hover:bg-[#FAF5EE] text-[#1F1813] border border-[#B87333]/30 rounded-lg shadow-2xs hover:shadow transition-all cursor-pointer"
                    title="Previous Feature"
                    aria-label="Previous Feature"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleNext}
                    className="p-1 bg-white hover:bg-[#FAF5EE] text-[#1F1813] border border-[#B87333]/30 rounded-lg shadow-2xs hover:shadow transition-all cursor-pointer"
                    title="Next Feature"
                    aria-label="Next Feature"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* SCHOLARSHIP ENTRY MODAL */}
      {showEntryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-[#FFFDF9] border-2 border-[#D4AF37] rounded-3xl p-5 sm:p-6 max-w-lg w-full shadow-2xl relative space-y-4 my-8">
            
            <button 
              type="button"
              onClick={() => {
                setShowEntryModal(false);
                setSubmittedTicket(null);
              }}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-[#1F1813] rounded-full hover:bg-gray-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {!submittedTicket ? (
              <>
                <div className="flex items-center space-x-2.5 text-[#B87333] border-b border-copper-penny/15 pb-3">
                  <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/20 text-[#B87333] flex items-center justify-center">
                    <Gift className="w-5 h-5 text-[#B87333]" />
                  </div>
                  <div>
                    <h3 className="font-serif font-extrabold text-lg sm:text-xl text-[#1F1813]">
                      {currentBanner.contestTitle || 'Partner Sponsorship Entry'}
                    </h3>
                    <p className="text-[10px] font-mono text-soft-sage uppercase font-bold">
                      {currentBanner.contestSubtitle || 'Community Access Giveaway'}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-[#2A221B]/80 leading-relaxed">
                  Enter to win free complimentary access for your child. Winners will be announced during our New Moon Sister Circle.
                </p>

                <form onSubmit={handleSubmitEntry} className="space-y-3.5 text-xs">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-mono uppercase font-bold text-[#1F1813]">Mother&apos;s Name</label>
                      <input 
                        type="text" 
                        required
                        value={motherName}
                        onChange={(e) => setMotherName(e.target.value)}
                        className="w-full bg-white border border-copper-penny/30 rounded-xl px-3 py-2 text-[#1F1813] focus:border-[#B87333] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-mono uppercase font-bold text-[#1F1813]">State / Region</label>
                      <input 
                        type="text" 
                        required
                        value={stateCode}
                        onChange={(e) => setStateCode(e.target.value)}
                        className="w-full bg-white border border-copper-penny/30 rounded-xl px-3 py-2 text-[#1F1813] focus:border-[#B87333] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-mono uppercase font-bold text-[#1F1813]">Mother&apos;s Email</label>
                      <input 
                        type="email" 
                        required
                        value={motherEmail}
                        onChange={(e) => setMotherEmail(e.target.value)}
                        className="w-full bg-white border border-copper-penny/30 rounded-xl px-3 py-2 text-[#1F1813] focus:border-[#B87333] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-mono uppercase font-bold text-[#1F1813]">Phone / SMS (Optional)</label>
                      <input 
                        type="tel" 
                        value={motherPhone}
                        onChange={(e) => setMotherPhone(e.target.value)}
                        placeholder="(Optional for win notification)"
                        className="w-full bg-white border border-copper-penny/30 rounded-xl px-3 py-2 text-[#1F1813] focus:border-[#B87333] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-mono uppercase font-bold text-[#1F1813]">Child&apos;s First Name</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Amari"
                        value={childName}
                        onChange={(e) => setChildName(e.target.value)}
                        className="w-full bg-white border border-copper-penny/30 rounded-xl px-3 py-2 text-[#1F1813] focus:border-[#B87333] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-mono uppercase font-bold text-[#1F1813]">Eligible Grade Level</label>
                      <select
                        value={childGrade}
                        onChange={(e) => setChildGrade(e.target.value as any)}
                        className="w-full bg-white border border-copper-penny/30 rounded-xl px-3 py-2 text-[#1F1813] focus:border-[#B87333] focus:outline-none font-medium"
                      >
                        <option value="Grade 3">Grade 3 (Elementary)</option>
                        <option value="Grade 4">Grade 4 (Elementary)</option>
                        <option value="Grade 5">Grade 5 (Elementary)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono uppercase font-bold text-[#1F1813]">
                      Homeschool Flight Path &amp; Learning Goals (1–2 Sentences)
                    </label>
                    <textarea 
                      required
                      rows={3}
                      value={learningGoals}
                      onChange={(e) => setLearningGoals(e.target.value)}
                      placeholder="Share what subject or area your child wants to explore (e.g. math confidence, reading mastery, ancestral history, science)..."
                      className="w-full bg-white border border-copper-penny/30 rounded-xl p-3 text-[#1F1813] focus:border-[#B87333] focus:outline-none text-xs"
                    />
                  </div>

                  <div className="bg-[#FAF5EE] border border-copper-penny/20 rounded-xl p-3 flex items-start space-x-2">
                    <input 
                      type="checkbox"
                      id="confirmGrade"
                      checked={confirmedEligibility}
                      onChange={(e) => setConfirmedEligibility(e.target.checked)}
                      className="mt-0.5 rounded text-[#B87333] focus:ring-[#B87333]"
                      required
                    />
                    <label htmlFor="confirmGrade" className="text-[11px] text-[#2A221B]/90 cursor-pointer">
                      I confirm my child is currently entering or in <strong>Grades 3, 4, or 5</strong> and is eligible for this homeschool scholarship.
                    </label>
                  </div>

                  <div className="pt-2 flex justify-end space-x-2.5">
                    <button
                      type="button"
                      onClick={() => setShowEntryModal(false)}
                      className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!confirmedEligibility || !childName.trim() || !learningGoals.trim()}
                      className="px-5 py-2.5 bg-[#B87333] hover:bg-[#A85138] disabled:bg-gray-300 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer flex items-center space-x-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Entry</span>
                    </button>
                  </div>

                </form>
              </>
            ) : (
              /* Success Submission Card */
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-300">
                  <CheckCircle className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <h3 className="font-serif font-extrabold text-xl text-[#1F1813]">
                    Scholarship Entry Confirmed!
                  </h3>
                  <p className="text-xs text-[#2A221B]/80 max-w-sm mx-auto">
                    Thank you, Sister {motherName}! Your child <strong>{childName} ({childGrade})</strong> is entered into the giveaway.
                  </p>
                </div>

                <div className="bg-[#FAF5EE] border-2 border-[#D4AF37]/50 rounded-2xl p-4 max-w-xs mx-auto">
                  <span className="text-[9px] font-mono text-soft-sage uppercase block font-bold">Your Verification Ticket</span>
                  <span className="text-lg font-mono font-black text-[#B87333] tracking-widest">{submittedTicket}</span>
                </div>

                {currentBanner.promoCode && (
                  <p className="text-[11px] text-soft-sage">
                    In the meantime, you can activate the exclusive Copper Mommies discount anytime with code <strong className="text-[#B87333]">{currentBanner.promoCode}</strong>.
                  </p>
                )}

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEntryModal(false);
                      setSubmittedTicket(null);
                    }}
                    className="px-6 py-2.5 bg-[#B87333] text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
                  >
                    Return to Hub
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* CONTACT / ASSISTANCE MODAL */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-[#FFFDF9] border-2 border-[#B87333]/40 rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl relative space-y-4">
            <button 
              type="button"
              onClick={() => setShowContactModal(false)}
              className="absolute top-4 right-4 p-1 text-gray-400 hover:text-[#1F1813] rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2.5 text-[#B87333] border-b border-copper-penny/15 pb-2.5">
              <HelpCircle className="w-5 h-5 text-[#B87333]" />
              <h3 className="font-serif font-bold text-lg text-[#1F1813]">
                Discount Code &amp; Partner Inquiries
              </h3>
            </div>

            {contactSuccess ? (
              <div className="text-center py-5 space-y-2">
                <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-sm text-[#1F1813]">Inquiry Dispatched!</h4>
                <p className="text-xs text-[#2A221B]/80">
                  Our coordination circle and partner representative have received your note. We will follow up with direct assistance.
                </p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-3 text-xs">
                <p className="text-[#2A221B]/80 leading-relaxed">
                  Have questions regarding the community member rate, need help applying the discount code, or want assistance for your family? Send a quick note:
                </p>

                <div className="space-y-1">
                  <label className="block text-[10px] font-mono uppercase font-bold text-[#1F1813]">Your Message or Question</label>
                  <textarea 
                    rows={4}
                    required
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="e.g., I have two children and would like guidance on setting up our family account..."
                    className="w-full bg-white border border-copper-penny/30 rounded-xl p-3 text-[#1F1813] focus:border-[#B87333] focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowContactModal(false)}
                    className="px-3 py-2 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-100 cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#B87333] text-white font-bold rounded-xl shadow cursor-pointer flex items-center space-x-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Inquiry</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
