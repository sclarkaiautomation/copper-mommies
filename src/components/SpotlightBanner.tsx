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

        {/* Top Badges & Manual Controls Header Bar */}
        <div className="bg-gradient-to-r from-[#1F1813] via-[#2A221B] to-[#1F1813] px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2 border-b border-[#D4AF37]/30 text-white">
          
          {/* Left: Category Badge & Feature Pill */}
          <div className="flex items-center space-x-2.5">
            <span className="inline-flex rounded-full h-2 w-2 bg-[#D4AF37] animate-pulse"></span>
            <span className="text-[10px] sm:text-xs font-mono font-extrabold uppercase tracking-widest text-[#D4AF37] glow-gold-text flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{currentBanner.categoryBadge || 'Featured Community Spotlight'}</span>
            </span>

            {/* If multiple features: display carousel indicator badge */}
            {totalFeatures > 1 && (
              <span className="hidden sm:inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-mono font-bold text-[#FAF5EE] border border-white/15">
                <Layers className="w-3 h-3 text-[#D4AF37]" />
                <span>Feature {currentIndex + 1} of {totalFeatures}</span>
              </span>
            )}
          </div>

          {/* Right: Manual Carousel Controls & Hover Indicators & Admin Button */}
          <div className="flex items-center space-x-2 sm:space-x-3 text-[11px] font-mono text-[#D4AF37]/90">
            
            {/* Status indicator when hovered or auto-scroll paused */}
            {totalFeatures > 1 && (
              <div className="flex items-center space-x-1.5">
                {isHovered && !isManuallyPaused && (
                  <span className="bg-[#D4AF37]/20 border border-[#D4AF37]/40 px-2 py-0.5 rounded-md text-[9px] font-bold text-[#D4AF37] flex items-center gap-1 animate-pulse">
                    <span>⏸️ Paused (Hover)</span>
                  </span>
                )}
                {isManuallyPaused && (
                  <span className="bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 rounded-md text-[9px] font-bold text-amber-300 flex items-center gap-1">
                    <span>⏸️ Auto-Scroll Paused</span>
                  </span>
                )}
                {!isHovered && !isManuallyPaused && (
                  <span className="hidden md:inline-flex text-[9px] text-[#FAF5EE]/60 font-mono">
                    Auto-scrolling (Hover to stop)
                  </span>
                )}
              </div>
            )}

            {/* Special Highlights on banner */}
            {currentBanner.hasContest && (
              <span className="hidden md:inline-flex bg-[#D4AF37]/20 border border-[#D4AF37]/40 px-2 py-0.5 rounded-full text-[10px] font-bold text-[#D4AF37] items-center gap-1">
                <Gift className="w-3 h-3 text-[#D4AF37]" />
                <span>{currentBanner.contestPrizeCount ? `${currentBanner.contestPrizeCount} Passes Giveaway` : 'Giveaway Active'}</span>
              </span>
            )}

            {/* Manual Navigation Controls for Multiple Features */}
            {totalFeatures > 1 && (
              <div className="flex items-center space-x-1 bg-white/10 p-0.5 rounded-xl border border-white/15 backdrop-blur-xs">
                {/* Previous Button */}
                <button
                  type="button"
                  onClick={handlePrev}
                  className="p-1 text-[#FAF5EE] hover:text-[#D4AF37] hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                  title="Previous Feature (Manual Scroll)"
                  aria-label="Previous Feature"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Play/Pause Toggle */}
                <button
                  type="button"
                  onClick={toggleManualPlayPause}
                  className="p-1 text-[#FAF5EE] hover:text-[#D4AF37] hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                  title={isManuallyPaused ? "Resume Auto-Scroll" : "Pause Auto-Scroll"}
                  aria-label={isManuallyPaused ? "Resume Auto-Scroll" : "Pause Auto-Scroll"}
                >
                  {isManuallyPaused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5 text-amber-300" />}
                </button>

                {/* Next Button */}
                <button
                  type="button"
                  onClick={handleNext}
                  className="p-1 text-[#FAF5EE] hover:text-[#D4AF37] hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                  title="Next Feature (Manual Scroll)"
                  aria-label="Next Feature"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Admin Trigger */}
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

        {/* Auto-scroll Progress Bar (Only visible when > 1 feature and auto-scroll active) */}
        {totalFeatures > 1 && (
          <div className="w-full h-1.5 bg-[#2A221B]/30 relative overflow-hidden shrink-0" title="Auto-scrolling progress indicator">
            <div 
              className={`h-full bg-gradient-to-r from-[#B87333] via-[#D4AF37] to-[#E5A65E] transition-all duration-30 ease-linear ${
                isAutoScrollActive ? 'opacity-100' : 'opacity-40'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Animated Banner Content Body - Expanded Uniform Frame so All Content Fits Cleanly Without Scrollbars */}
        <div className="p-4 sm:p-6 min-h-[580px] lg:min-h-[540px] flex flex-col justify-between relative overflow-hidden shrink-0" style={{ contain: 'layout style' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentBanner.id || currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="space-y-4 w-full h-full flex flex-col justify-between"
            >
              
              {/* Proportioned Clickable Banner Image */}
              {currentBanner.bannerImage && (
                <div className="relative group rounded-2xl overflow-hidden border border-[#B87333]/30 shadow-sm hover:shadow-md transition-all bg-[#0d99ff]">
                  <a 
                    href={currentBanner.externalLink || 'https://nestbrightacademy.com'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block relative overflow-hidden"
                    title={`Click to visit ${currentBanner.title}`}
                  >
                    <img 
                      src={currentBanner.bannerImage} 
                      alt={currentBanner.title} 
                      className="w-full h-32 sm:h-40 md:h-44 object-cover object-center transform group-hover:scale-[1.015] transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Visual Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1F1813]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <div className="bg-[#1F1813]/90 text-[#D4AF37] px-3.5 py-1.5 rounded-xl border border-[#D4AF37]/50 text-xs font-mono font-bold flex items-center space-x-2 backdrop-blur-xs shadow-lg">
                        <span>{currentBanner.linkText || 'Explore Partner Portal'}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    {/* Direct Link Floating Pill in Corner */}
                    {currentBanner.externalLink && (
                      <div className="absolute top-2.5 right-2.5 bg-[#1F1813]/85 text-[#FAF5EE] text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg border border-[#D4AF37]/40 flex items-center space-x-1.5 backdrop-blur-xs shadow-md">
                        <span>{currentBanner.linkText || 'Visit Portal'}</span>
                        <ExternalLink className="w-3 h-3 text-[#D4AF37]" />
                      </div>
                    )}
                  </a>
                </div>
              )}

              {/* Under-Banner Callout & Text Details */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                
                {/* Left 7 Columns: Initiative Vision & Giveaway Details */}
                <div className="lg:col-span-7 space-y-3.5">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <GraduationCap className="w-5 h-5 text-[#B87333]" />
                      <h3 className="font-serif font-extrabold text-xl sm:text-2xl text-[#1F1813] leading-tight">
                        {currentBanner.title}
                      </h3>
                    </div>
                    {currentBanner.subtitle && (
                      <p className="text-xs font-mono text-[#B87333] font-bold uppercase tracking-wider">
                        {currentBanner.subtitle}
                      </p>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-[#2A221B]/90 leading-relaxed">
                    {currentBanner.description}
                  </p>

                  {/* Free Access Giveaway / Contest Box if active on banner */}
                  {currentBanner.hasContest && (
                    <div className="bg-white border-2 border-[#D4AF37]/40 rounded-2xl p-4 shadow-sm space-y-3 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4AF37]/10 rounded-full blur-xl pointer-events-none" />
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D4AF37]/20 pb-2.5">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 rounded-xl bg-[#D4AF37]/20 text-[#B87333] flex items-center justify-center font-bold">
                            🎁
                          </div>
                          <div>
                            <h4 className="font-serif font-extrabold text-sm sm:text-base text-[#1F1813]">
                              {currentBanner.contestTitle || '5 Full 1-Year Free Access Scholarships'}
                            </h4>
                            <p className="text-[10px] font-mono text-[#B87333] font-bold uppercase">
                              {currentBanner.contestEligibility || 'Eligible: Elementary Children in Grades 3, 4, or 5'}
                            </p>
                          </div>
                        </div>

                        <span className="text-[10px] font-mono font-bold bg-[#FAF5EE] text-[#1F1813] border border-[#B87333]/30 px-2.5 py-1 rounded-lg self-start sm:self-auto">
                          🎟️ {entriesCount} Mothers Entered
                        </span>
                      </div>

                      <div className="text-xs text-[#2A221B]/85 space-y-1.5 leading-relaxed">
                        <p className="font-medium text-[#1F1813]">
                          <strong>How to Enter for Free Access:</strong>
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-xs text-[#2A221B]/85 pl-1">
                          {currentBanner.contestRequirements && currentBanner.contestRequirements.length > 0 ? (
                            currentBanner.contestRequirements.map((req, i) => (
                              <li key={i}>{req}</li>
                            ))
                          ) : (
                            <>
                              <li>Must be an active or applicant Copper Mommies member.</li>
                              <li>Child must be entering or currently in <strong>Grade 3, Grade 4, or Grade 5</strong>.</li>
                              <li>Submit your child&apos;s name, current grade, and a brief 1–2 sentence note on your homeschool &amp; learning flight path.</li>
                            </>
                          )}
                        </ul>
                      </div>

                      <div className="pt-1 flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setShowEntryModal(true)}
                          className="px-4 py-2.5 bg-[#B87333] hover:bg-[#A85138] text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center space-x-2 cursor-pointer border border-[#96551d]/40"
                        >
                          <Gift className="w-4 h-4 text-[#D4AF37]" />
                          <span>Submit Scholarship Entry (Free)</span>
                        </button>

                        {currentBanner.externalLink && (
                          <a 
                            href={currentBanner.externalLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="px-3.5 py-2 bg-white hover:bg-[#FAF5EE] text-[#1F1813] text-xs font-bold rounded-xl border border-[#B87333]/30 hover:border-[#B87333] transition-all flex items-center space-x-1.5"
                          >
                            <span>Preview Curriculum</span>
                            <ExternalLink className="w-3.5 h-3.5 text-[#B87333]" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right 5 Columns: Exclusive Member Offer / Action Box */}
                <div className="lg:col-span-5 space-y-4">
                  
                  {/* Exclusive Member Rate / Community Benefit Card */}
                  <div className="bg-[#1F1813] text-white border-2 border-[#D4AF37]/50 rounded-2xl p-4 sm:p-5 shadow-xl relative overflow-hidden space-y-3.5">
                    <div className="absolute top-0 right-0 w-28 h-28 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-[#D4AF37] bg-[#D4AF37]/15 px-2.5 py-0.5 rounded-full border border-[#D4AF37]/30">
                        {currentBanner.promoHeadline || 'Exclusive Village Benefit'}
                      </span>
                      {currentBanner.regularPrice && (
                        <span className="text-xs line-through text-gray-400 font-mono">
                          Regular: {currentBanner.regularPrice}
                        </span>
                      )}
                    </div>

                    <div>
                      {currentBanner.promoPrice ? (
                        <div className="flex items-baseline space-x-2">
                          <span className="text-2xl sm:text-3xl font-extrabold text-[#D4AF37] font-mono glow-gold-text">
                            {currentBanner.promoPrice}
                          </span>
                          <span className="text-xs text-gray-300 font-mono">/ member rate</span>
                        </div>
                      ) : (
                        <div className="text-lg font-bold text-[#D4AF37] font-serif">
                          Community Partner Initiative
                        </div>
                      )}
                      <p className="text-xs text-gray-200 mt-1 leading-relaxed">
                        {currentBanner.promoDetails || 'Copper Mommies enjoy sovereign community rates and prioritized access to support our families in building generational independence.'}
                      </p>
                    </div>

                    {/* Promo Code Box */}
                    {currentBanner.promoCode && (
                      <div className="bg-white/10 border border-[#D4AF37]/40 rounded-xl p-3 flex items-center justify-between gap-2">
                        <div>
                          <span className="text-[9px] uppercase font-mono text-gray-400 block">Use Discount Code at Checkout:</span>
                          <span className="font-mono font-black text-sm text-[#D4AF37] tracking-wider">
                            {currentBanner.promoCode}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyCode(currentBanner.promoCode)}
                          className="px-3 py-1.5 bg-[#D4AF37] hover:bg-[#b59226] text-[#1F1813] text-xs font-bold rounded-lg shadow-sm active:scale-95 transition-all flex items-center space-x-1 cursor-pointer"
                        >
                          {copiedCode ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-800" />
                              <span className="text-emerald-900">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-[#1F1813]" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    {/* Call to Action Buttons */}
                    <div className="space-y-2 pt-1">
                      {currentBanner.externalLink && (
                        <a
                          href={currentBanner.promoLink || currentBanner.externalLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#B87333] hover:from-[#e0bc46] hover:to-[#c47f3e] text-[#1F1813] font-extrabold text-xs rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2 text-center"
                        >
                          <span>{currentBanner.buttonText || currentBanner.linkText || 'Claim Community Benefit'}</span>
                          <ExternalLink className="w-3.5 h-3.5 text-[#1F1813]" />
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={() => setShowContactModal(true)}
                        className="w-full py-2 bg-white/10 hover:bg-white/20 text-[#FAF5EE] text-xs font-mono rounded-xl border border-white/15 transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                      >
                        <HelpCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>{currentBanner.contactActionLabel || 'Contact for Code Assistance / Questions'}</span>
                      </button>
                    </div>

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
