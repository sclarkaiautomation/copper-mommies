import React, { useState } from 'react';
import { 
  Zap, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Calendar, 
  BookOpen, 
  FileText, 
  CheckCircle2, 
  Briefcase, 
  Clock, 
  Sliders, 
  ChevronRight,
  Share2,
  Award,
  Lock,
  Layers
} from 'lucide-react';
import { 
  SC_AUTOMATED_CONSULTING_SERVICES, 
  MOTHERHOOD_AFFILIATE_TIERS, 
  SAMPLE_AFFILIATE_LEADS, 
  MARKETING_SWIPE_COPIES, 
  YOUR_BRAIN_IS_AN_ASSET_DATA,
  SCAutomatedConsultingService,
  MarketingSwipeCopy
} from '../data/ecosystemData';

interface SCAutomatedPortalProps {
  userName?: string;
  userEmail?: string;
  selectedState?: string;
  onShowToast?: (msg: string) => void;
}

export default function SCAutomatedPortal({
  userName = 'Mama Shantrece',
  userEmail = 'shantrece@coppermommies.co',
  selectedState = 'GA',
  onShowToast
}: SCAutomatedPortalProps) {
  // Navigation Tabs within SC Automated Portal
  const [activeTab, setActiveTab] = useState<'consulting' | 'affiliate-portal' | 'your-brain-asset'>('affiliate-portal');
  
  // Notification Toast Helper
  const triggerToast = (msg: string) => {
    if (onShowToast) {
      onShowToast(msg);
    } else {
      alert(msg);
    }
  };

  // ----------------------------------------------------
  // AFFILIATE CALCULATOR STATE
  // ----------------------------------------------------
  const [selectedServiceId, setSelectedServiceId] = useState<string>('sc-serv-1');
  const [referralCount, setReferralCount] = useState<number>(3);
  const [selectedAffiliateTier, setSelectedAffiliateTier] = useState<number>(25); // 20%, 25%, or 30%

  // Referral Link Generation
  const sisterSlug = userName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const referralLink = `https://scautomated.solutions/ref/${sisterSlug || 'sisterhood'}`;
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedSwipeId, setCopiedSwipeId] = useState<string | null>(null);

  // Discovery Audit Booking Modal
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedServiceForAudit, setSelectedServiceForAudit] = useState<SCAutomatedConsultingService | null>(null);
  const [auditForm, setAuditForm] = useState({
    businessName: '',
    industry: 'Holistic Health & Apothecary',
    biggestBottleneck: 'Manual client intake & scheduling',
    preferredDate: 'Next Tuesday at 2:00 PM EST'
  });

  // Calculate earnings in Calculator
  const currentService = SC_AUTOMATED_CONSULTING_SERVICES.find(s => s.id === selectedServiceId) || SC_AUTOMATED_CONSULTING_SERVICES[0];
  const basePriceNumber = parseInt(currentService.price.replace(/[^0-9]/g, ''), 10) || 3500;
  const estimatedTotalPayout = Math.round(basePriceNumber * (selectedAffiliateTier / 100) * referralCount);

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(referralLink);
    setCopiedLink(true);
    triggerToast('📋 Personal affiliate link copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleCopySwipe = (swipe: MarketingSwipeCopy) => {
    const fullText = `${swipe.hook}\n\n${swipe.body.replace('{YOUR_REFERRAL_LINK}', referralLink)}\n\n${swipe.cta}`;
    navigator.clipboard?.writeText(fullText);
    setCopiedSwipeId(swipe.id);
    triggerToast(`📋 "${swipe.title}" swipe copy copied with your link!`);
    setTimeout(() => setCopiedSwipeId(null), 3000);
  };

  const handleBookAuditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBookingModalOpen(false);
    triggerToast(`🎉 30-Minute Discovery Audit scheduled with SC Automated Systems Architects! Confirmation sent to ${userEmail}.`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto my-2 text-[#1F1813]">
      
      {/* Hero Header: SC Automated Solutions & Motherhood Affiliate Hub */}
      <div className="bg-gradient-to-br from-[#1F1813] via-[#2A1D16] to-[#1F140E] border-2 border-[#D4AF37]/40 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-[#B87333]/15 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <span className="p-2.5 bg-[#D4AF37]/15 text-[#D4AF37] rounded-2xl border border-[#D4AF37]/35 shadow-inner">
                <Zap className="w-6 h-6 text-[#D4AF37]" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest font-extrabold text-[#D4AF37] px-2 py-0.5 rounded bg-[#D4AF37]/10 border border-[#D4AF37]/25">
                    Enterprise &amp; Sovereign Systems Hub
                  </span>
                  <span className="text-[10px] font-mono text-[#FAF5EE]/70">Partner Integration</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#FAF5EE] tracking-tight mt-0.5">
                  SC Automated Solutions
                </h2>
              </div>
            </div>

            {/* Direct Beacons Link & Consultation CTA */}
            <div className="flex items-center gap-2.5">
              <a
                href={YOUR_BRAIN_IS_AN_ASSET_DATA.beaconsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-xs font-mono font-bold text-[#FAF5EE] flex items-center space-x-1.5 transition-all shadow-sm"
              >
                <span>Beacons Digital Store</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#D4AF37]" />
              </a>
              <button
                onClick={() => {
                  setSelectedServiceForAudit(SC_AUTOMATED_CONSULTING_SERVICES[0]);
                  setIsBookingModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#B87333] hover:text-white text-[#1F1813] font-bold text-xs font-mono uppercase tracking-wider transition-all shadow-md flex items-center space-x-1.5 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Free Systems Audit</span>
              </button>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#FAF5EE]/85 max-w-3xl leading-relaxed">
            High-ticket business automation consulting built for sovereign maternal enterprises. Streamline client intake, eliminate manual spreadsheet drag, and monetize family intellect. Through our <strong>Motherhood Affiliate Portal</strong>, vetted mothers earn <strong>20% to 30% referral commissions ($190 – $1,050+ per closed client)</strong> working from home in sisterhood.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
              <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider block">Commission Range</span>
              <strong className="text-lg font-serif font-bold text-white">20% – 30%</strong>
              <span className="text-[10px] text-white/60 block mt-0.5">$190 to $1,050 / sale</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
              <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider block">Hours Saved / Week</span>
              <strong className="text-lg font-serif font-bold text-white">15+ Hours</strong>
              <span className="text-[10px] text-white/60 block mt-0.5">Average client automation</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
              <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider block">Vetted Mother Payouts</span>
              <strong className="text-lg font-serif font-bold text-white">Bi-Weekly</strong>
              <span className="text-[10px] text-white/60 block mt-0.5">Direct ACH or Wise transfer</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
              <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider block">Digital Asset Guide</span>
              <strong className="text-lg font-serif font-bold text-white">Your Brain Is An Asset</strong>
              <span className="text-[10px] text-white/60 block mt-0.5">Integrated Beacons manual</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tri-Pillar Section Switcher */}
      <div className="flex flex-wrap gap-2 border-b border-[#B87333]/25 pb-3">
        <button
          onClick={() => setActiveTab('affiliate-portal')}
          className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center space-x-2 ${
            activeTab === 'affiliate-portal'
              ? 'bg-[#B87333] text-white shadow-md border border-[#B87333]'
              : 'bg-white text-[#1F1813]/80 border border-copper-penny/20 hover:bg-[#FAF5EE] hover:text-[#B87333]'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Motherhood Affiliate Portal (20%–30%)</span>
        </button>

        <button
          onClick={() => setActiveTab('consulting')}
          className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center space-x-2 ${
            activeTab === 'consulting'
              ? 'bg-[#B87333] text-white shadow-md border border-[#B87333]'
              : 'bg-white text-[#1F1813]/80 border border-copper-penny/20 hover:bg-[#FAF5EE] hover:text-[#B87333]'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>High-Ticket Automation Consulting</span>
        </button>

        <button
          onClick={() => setActiveTab('your-brain-asset')}
          className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center space-x-2 ${
            activeTab === 'your-brain-asset'
              ? 'bg-[#B87333] text-white shadow-md border border-[#B87333]'
              : 'bg-white text-[#1F1813]/80 border border-copper-penny/20 hover:bg-[#FAF5EE] hover:text-[#B87333]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>"Your Brain Is An Asset" Study Blueprint</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. MOTHERHOOD AFFILIATE PORTAL TAB                                        */}
      {/* ========================================================================= */}
      {activeTab === 'affiliate-portal' && (
        <div className="space-y-6">
          
          {/* Active Partner Tracking Card */}
          <div className="bg-[#FAF5EE] border-2 border-[#B87333]/30 rounded-3xl p-5 sm:p-6 shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#B87333]/15 pb-4">
              <div>
                <span className="text-[10px] font-mono text-[#B87333] uppercase tracking-widest font-bold block">
                  Motherhood Ambassador Link • {userName}
                </span>
                <h3 className="font-serif font-bold text-xl text-[#1F1813]">
                  Your Sovereign Affiliate Desk
                </h3>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#D4AF37]/15 text-[#96551d] border border-[#D4AF37]/35 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Tier 2: Matriarch Partner (25%)</span>
                </span>
              </div>
            </div>

            {/* Custom Link Box */}
            <div className="bg-white border-2 border-dashed border-[#B87333]/35 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-soft-sage uppercase font-bold tracking-wider">
                  Personal Referral URL (Includes $100 Village Discount for Your Clients)
                </span>
                <div className="font-mono text-xs sm:text-sm font-bold text-[#1F1813] break-all select-all bg-[#FAF5EE] px-3 py-1.5 rounded-lg border border-copper-penny/20">
                  {referralLink}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2.5 rounded-xl bg-[#B87333] hover:bg-[#A85138] text-white font-mono font-bold text-xs transition-all flex items-center space-x-1.5 cursor-pointer shadow-sm active:scale-95"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>
            </div>

            {/* Three Commission Tiers */}
            <div className="space-y-3 pt-2">
              <h4 className="font-serif font-bold text-sm text-[#1F1813] flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                <span>Motherhood Referral Commission Tiers</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {MOTHERHOOD_AFFILIATE_TIERS.map((tier) => (
                  <div 
                    key={tier.level}
                    className={`rounded-2xl p-4.5 space-y-3 transition-all border ${
                      tier.level === 2
                        ? 'bg-white border-2 border-[#B87333] shadow-md ring-2 ring-[#B87333]/15'
                        : 'bg-white/80 border-copper-penny/20 hover:border-[#B87333]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${tier.badgeColor}`}>
                        {tier.rateLabel}
                      </span>
                      {tier.level === 2 && (
                        <span className="text-[9px] font-mono font-bold uppercase text-white bg-[#B87333] px-2 py-0.5 rounded-full">
                          Your Active Tier
                        </span>
                      )}
                    </div>

                    <div>
                      <h5 className="font-serif font-bold text-base text-[#1F1813]">{tier.tierName}</h5>
                      <p className="text-[11px] text-[#2A221B]/75 mt-1 leading-relaxed">{tier.requirement}</p>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-copper-penny/10">
                      {tier.perks.map((perk, idx) => (
                        <div key={idx} className="flex items-start space-x-2 text-[11px] text-[#2A221B]/85">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{perk}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Motherhood Earnings Calculator */}
          <div className="bg-white border-2 border-[#D4AF37]/35 rounded-3xl p-5 sm:p-6 shadow-lg space-y-5">
            <div className="flex items-center space-x-2.5 text-[#B87333]">
              <Sliders className="w-5 h-5 text-[#D4AF37]" />
              <div>
                <h3 className="font-serif font-bold text-lg text-[#1F1813]">
                  Interactive Motherhood Referral Calculator
                </h3>
                <p className="text-[11px] font-mono text-soft-sage">
                  Estimate your work-from-home earnings based on client introductions
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Control 1: Select Service */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono uppercase font-bold text-[#1F1813]">
                  Consulting Package
                </label>
                <select
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  className="w-full bg-[#FAF5EE] border border-copper-penny/25 rounded-xl px-3 py-2 text-xs font-mono font-bold text-[#1F1813] focus:outline-none focus:border-[#B87333]"
                >
                  {SC_AUTOMATED_CONSULTING_SERVICES.map((serv) => (
                    <option key={serv.id} value={serv.id}>
                      {serv.title} ({serv.price})
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-[#2A221B]/70 block">
                  Package Value: <strong>{currentService.price}</strong>
                </span>
              </div>

              {/* Control 2: Commission Tier */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono uppercase font-bold text-[#1F1813]">
                  Your Commission Tier
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[20, 25, 30].map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => setSelectedAffiliateTier(rate)}
                      className={`py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                        selectedAffiliateTier === rate
                          ? 'bg-[#B87333] text-white shadow-xs'
                          : 'bg-[#FAF5EE] text-[#1F1813] border border-copper-penny/20 hover:bg-[#FAF5EE]/80'
                      }`}
                    >
                      {rate}%
                    </button>
                  ))}
                </div>
                <span className="text-[10px] text-[#2A221B]/70 block">
                  Earn ${Math.round(basePriceNumber * (selectedAffiliateTier / 100))} per client
                </span>
              </div>

              {/* Control 3: Referrals Slider */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono uppercase font-bold">
                  <span>Referred Clients / Month</span>
                  <span className="text-[#B87333] text-sm">{referralCount} Clients</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={referralCount}
                  onChange={(e) => setReferralCount(parseInt(e.target.value, 10))}
                  className="w-full accent-[#B87333] cursor-pointer"
                />
                <div className="flex justify-between text-[9px] font-mono text-soft-sage">
                  <span>1 client</span>
                  <span>5 clients</span>
                  <span>10 clients</span>
                </div>
              </div>
            </div>

            {/* Result Box */}
            <div className="bg-gradient-to-r from-[#FAF5EE] to-[#F5EDE1] border-2 border-[#D4AF37]/35 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono text-[#B87333] uppercase font-bold tracking-wider block">
                  Projected Sisterhood Commission
                </span>
                <div className="font-serif font-extrabold text-2xl sm:text-3xl text-[#1F1813] mt-0.5">
                  ${estimatedTotalPayout.toLocaleString()}
                  {currentService.tier === 'Fractional COO Automation' && (
                    <span className="text-sm font-sans font-normal text-[#2A221B]/70"> / month recurring</span>
                  )}
                </div>
                <p className="text-[11px] text-[#2A221B]/75 mt-1">
                  Based on {referralCount} closed referral(s) for the {currentService.title} at {selectedAffiliateTier}% commission.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyLink}
                  className="px-5 py-3 rounded-xl bg-[#B87333] hover:bg-[#A85138] text-white font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center space-x-2 shadow-md cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Start Sharing My Link</span>
                </button>
              </div>
            </div>
          </div>

          {/* Marketing Swipe Copy Vault */}
          <div className="bg-[#FAF5EE] border border-copper-penny/20 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-copper-penny/15 pb-3">
              <div>
                <h4 className="font-serif font-bold text-lg text-[#1F1813]">
                  Motherhood Marketing Swipe Copy Vault
                </h4>
                <p className="text-[10px] font-mono text-soft-sage uppercase tracking-wider font-bold">
                  Plug-and-play messages tailored for authentic sisterhood sharing
                </p>
              </div>
              <span className="text-[10px] font-mono text-[#B87333] bg-[#B87333]/10 px-2.5 py-1 rounded-full border border-[#B87333]/20 font-bold self-start sm:self-auto">
                Includes Automated $100 Client Discount
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {MARKETING_SWIPE_COPIES.map((swipe) => (
                <div key={swipe.id} className="bg-white border border-copper-penny/15 rounded-2xl p-4.5 flex flex-col justify-between space-y-3 shadow-xs hover:border-[#B87333]/30 transition-all">
                  <div className="space-y-2">
                    <span className="text-[9px] font-mono uppercase font-bold text-[#B87333] bg-[#B87333]/10 px-2 py-0.5 rounded">
                      {swipe.category}
                    </span>
                    <h5 className="font-serif font-bold text-sm text-[#1F1813]">{swipe.title}</h5>
                    <p className="text-[11px] font-semibold text-[#1F1813]/90 italic">"{swipe.hook}"</p>
                    <div className="text-[11px] text-[#2A221B]/80 max-h-36 overflow-y-auto scrollbar-thin bg-[#FAF5EE]/50 p-2.5 rounded-xl border border-copper-penny/10 whitespace-pre-line font-sans leading-relaxed">
                      {swipe.body.replace('{YOUR_REFERRAL_LINK}', referralLink)}
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopySwipe(swipe)}
                    className="w-full py-2 rounded-xl bg-[#FAF5EE] hover:bg-[#B87333] hover:text-white text-[#1F1813] font-mono font-bold text-xs border border-copper-penny/20 transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    {copiedSwipeId === swipe.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Copied Swipe!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#B87333]" />
                        <span>Copy Script &amp; Link</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Real-Time Simulated Referral Tracker Table */}
          <div className="bg-white border border-copper-penny/20 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-copper-penny/15 pb-3">
              <div>
                <h4 className="font-serif font-bold text-lg text-[#1F1813]">
                  Your Referral Ledger &amp; Payout History
                </h4>
                <p className="text-[10px] font-mono text-soft-sage uppercase tracking-wider font-bold">
                  Transparent tracking of sister introductions and payouts
                </p>
              </div>
              <div className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                Total Earned to Date: $2,390.00
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="border-b border-copper-penny/15 font-mono text-[10px] text-soft-sage uppercase tracking-wider">
                    <th className="pb-2.5">Referred Client / Business</th>
                    <th className="pb-2.5">Package</th>
                    <th className="pb-2.5">Value</th>
                    <th className="pb-2.5">Rate</th>
                    <th className="pb-2.5">Your Payout</th>
                    <th className="pb-2.5">Status</th>
                    <th className="pb-2.5">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-copper-penny/10">
                  {SAMPLE_AFFILIATE_LEADS.map((lead) => (
                    <tr key={lead.id} className="hover:bg-[#FAF5EE]/60 transition-colors">
                      <td className="py-3 font-medium text-[#1F1813]">{lead.clientName}</td>
                      <td className="py-3 text-[11px] text-[#2A221B]/80">{lead.servicePackage}</td>
                      <td className="py-3 font-mono font-bold text-[#1F1813]">${lead.contractValue.toLocaleString()}</td>
                      <td className="py-3 font-mono text-[#B87333] font-bold">{lead.commissionPercent}%</td>
                      <td className="py-3 font-mono font-extrabold text-emerald-700">+${lead.commissionEarned.toLocaleString()}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          lead.status === 'Closed & Paid' ? 'bg-emerald-100 text-emerald-800' :
                          lead.status === 'Proposal Sent' ? 'bg-amber-100 text-amber-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="py-3 text-[10px] font-mono text-soft-sage">{lead.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. HIGH-TICKET AUTOMATION CONSULTING SHOWCASE TAB                         */}
      {/* ========================================================================= */}
      {activeTab === 'consulting' && (
        <div className="space-y-6">
          <div className="bg-[#FAF5EE] border border-copper-penny/20 rounded-3xl p-5 sm:p-6 shadow-sm space-y-3">
            <h3 className="font-serif font-bold text-xl text-[#1F1813]">
              Bespoke Business Automation Architecture
            </h3>
            <p className="text-xs sm:text-sm text-[#2A221B]/80 leading-relaxed max-w-3xl">
              We design and implement custom systems that allow maternal enterprises, wellness hubs, and homeschool co-ops to operate with flawless precision—without requiring 60-hour workweeks or tech complexity.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {SC_AUTOMATED_CONSULTING_SERVICES.map((serv) => (
              <div 
                key={serv.id}
                className="bg-white border-2 border-copper-penny/20 hover:border-[#B87333] rounded-3xl p-6 flex flex-col justify-between space-y-5 shadow-sm hover:shadow-lg transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase font-extrabold text-[#B87333] bg-[#B87333]/10 px-2.5 py-1 rounded-full border border-[#B87333]/20">
                      {serv.tier}
                    </span>
                    <span className="text-[11px] font-mono text-soft-sage font-bold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {serv.duration}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-serif font-bold text-xl text-[#1F1813]">{serv.title}</h4>
                    <div className="font-serif font-extrabold text-2xl text-[#B87333] mt-1">{serv.price}</div>
                    <p className="text-xs text-[#1F1813]/90 italic mt-1">{serv.tagline}</p>
                  </div>

                  <p className="text-xs text-[#2A221B]/80 leading-relaxed border-t border-copper-penny/10 pt-3">
                    {serv.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-2 pt-1">
                    <span className="text-[10px] font-mono uppercase text-soft-sage font-bold tracking-wider block">
                      Core System Implementations:
                    </span>
                    {serv.features.map((feat, i) => (
                      <div key={i} className="flex items-start space-x-2 text-xs text-[#2A221B]/90">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Ideal For */}
                  <div className="p-3 bg-[#FAF5EE] rounded-xl border border-copper-penny/10 text-[11px] text-[#2A221B]/80">
                    <strong className="text-[#1F1813] font-bold block mb-0.5">Ideal For:</strong>
                    {serv.idealFor}
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-copper-penny/15">
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#B87333] font-bold">
                    <span>Motherhood Affiliate Bounty:</span>
                    <span>{serv.affiliateCommissionAmount}</span>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedServiceForAudit(serv);
                      setIsBookingModalOpen(true);
                    }}
                    className="w-full py-3 rounded-xl bg-[#B87333] hover:bg-[#A85138] text-white font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-md"
                  >
                    <span>Request Discovery Audit</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. "YOUR BRAIN IS AN ASSET" BLUEPRINT TAB                                 */}
      {/* ========================================================================= */}
      {activeTab === 'your-brain-asset' && (
        <div className="space-y-6">
          
          {/* Main Manual Hero */}
          <div className="bg-[#FAF5EE] border-2 border-[#D4AF37]/40 rounded-3xl p-6 sm:p-8 shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-copper-penny/15 pb-4">
              <div>
                <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest font-extrabold px-2 py-0.5 rounded bg-[#D4AF37]/15 border border-[#D4AF37]/35 inline-block mb-1">
                  Intellectual Property &amp; Sovereignty Manual
                </span>
                <h3 className="font-serif font-extrabold text-2xl sm:text-3xl text-[#1F1813]">
                  {YOUR_BRAIN_IS_AN_ASSET_DATA.title}
                </h3>
                <p className="text-xs font-mono text-[#B87333] font-bold mt-0.5">
                  Authored by {YOUR_BRAIN_IS_AN_ASSET_DATA.author}
                </p>
              </div>

              <a
                href={YOUR_BRAIN_IS_AN_ASSET_DATA.beaconsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-[#1F1813] hover:bg-[#B87333] text-[#FAF5EE] font-mono font-bold text-xs flex items-center space-x-2 transition-all shadow-md self-start sm:self-auto cursor-pointer"
              >
                <span>Access on Beacons Hub</span>
                <ExternalLink className="w-4 h-4 text-[#D4AF37]" />
              </a>
            </div>

            <div className="bg-white border border-copper-penny/15 rounded-2xl p-5 shadow-xs space-y-3">
              <h4 className="font-serif font-bold text-sm text-[#B87333] uppercase tracking-wider">
                The Core Matriarchal Philosophy
              </h4>
              <p className="text-xs sm:text-sm text-[#2A221B]/90 font-serif leading-relaxed italic border-l-4 border-[#D4AF37] pl-4">
                "{YOUR_BRAIN_IS_AN_ASSET_DATA.philosophyCore}"
              </p>
            </div>

            {/* The 4 Core Tenets Grid */}
            <div className="space-y-3 pt-2">
              <h4 className="font-serif font-bold text-base text-[#1F1813] flex items-center space-x-2">
                <Layers className="w-4 h-4 text-[#B87333]" />
                <span>The Four Tenets of Maternal Digital Asset Creation</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {YOUR_BRAIN_IS_AN_ASSET_DATA.fourTenets.map((tenet) => (
                  <div key={tenet.number} className="bg-white border border-copper-penny/15 rounded-2xl p-4.5 space-y-2.5 shadow-xs hover:border-[#B87333]/30 transition-all">
                    <div className="flex items-center space-x-2.5">
                      <span className="w-7 h-7 rounded-xl bg-[#B87333]/15 text-[#B87333] font-mono font-extrabold text-xs flex items-center justify-center border border-[#B87333]/25">
                        {tenet.number}
                      </span>
                      <h5 className="font-serif font-bold text-base text-[#1F1813]">{tenet.name}</h5>
                    </div>
                    <p className="text-xs font-semibold text-[#B87333] italic">{tenet.tagline}</p>
                    <p className="text-[11px] text-[#2A221B]/80 leading-relaxed bg-[#FAF5EE]/60 p-2.5 rounded-xl border border-copper-penny/10">
                      <strong>Practical Action:</strong> {tenet.practicalAction}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 5-Step Monetization Checklist */}
          <div className="bg-white border-2 border-copper-penny/20 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-copper-penny/15 pb-3">
              <div>
                <h4 className="font-serif font-bold text-lg text-[#1F1813]">
                  The 5-Step Asset Creation Sprint Roadmap
                </h4>
                <p className="text-[10px] font-mono text-soft-sage uppercase tracking-wider font-bold">
                  From lived knowledge to live digital checkout in 30 days
                </p>
              </div>
              <button
                onClick={() => triggerToast('📥 "Your Brain Is An Asset: 30-Day Sprint Workbook" downloaded to your documents shelf!')}
                className="px-3.5 py-1.5 rounded-xl bg-[#FAF5EE] hover:bg-[#B87333] hover:text-white text-[#1F1813] font-mono font-bold text-xs border border-copper-penny/20 transition-all flex items-center space-x-1.5 self-start sm:self-auto cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Download Sprint Workbook</span>
              </button>
            </div>

            <div className="space-y-3">
              {YOUR_BRAIN_IS_AN_ASSET_DATA.monetizationSteps.map((step) => (
                <div key={step.step} className="border border-copper-penny/15 bg-[#FAF5EE]/40 rounded-2xl p-4 space-y-2 hover:border-[#B87333]/30 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-copper-penny/10 pb-2">
                    <div className="flex items-center space-x-2.5">
                      <span className="w-6 h-6 rounded-lg bg-[#B87333] text-white font-mono font-bold text-xs flex items-center justify-center">
                        {step.step}
                      </span>
                      <h5 className="font-serif font-bold text-sm text-[#1F1813]">{step.title}</h5>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-mono">
                      <span className="text-soft-sage font-bold">Timeline: {step.duration}</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                        Milestone: {step.milestone}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                    {step.checklist.map((item, idx) => (
                      <div key={idx} className="flex items-start space-x-2 text-[11px] text-[#2A221B]/85 bg-white p-2.5 rounded-xl border border-copper-penny/10">
                        <Check className="w-3.5 h-3.5 text-[#B87333] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* DISCOVERY AUDIT BOOKING MODAL                                             */}
      {/* ========================================================================= */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF5EE] border-2 border-[#D4AF37] rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-fade-in text-[#1F1813]">
            <div className="flex items-center justify-between border-b border-copper-penny/20 pb-3">
              <div className="flex items-center space-x-2 text-[#B87333]">
                <Calendar className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="font-serif font-bold text-lg text-[#1F1813]">
                  Book Free 30-Minute Systems Audit
                </h3>
              </div>
              <button
                onClick={() => setIsBookingModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white text-gray-500 hover:text-black flex items-center justify-center border border-copper-penny/20 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#2A221B]/80 leading-relaxed">
              Meet with an SC Automated Systems Architect to map your business bottlenecks, evaluate your software costs, and design a custom zero-touch roadmap.
            </p>

            <form onSubmit={handleBookAuditSubmit} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="block font-mono text-[10px] uppercase font-bold text-soft-sage">
                  Business / Practice Name
                </label>
                <input
                  type="text"
                  required
                  value={auditForm.businessName}
                  onChange={(e) => setAuditForm({ ...auditForm, businessName: e.target.value })}
                  placeholder="e.g. Roots & Resilience Apothecary"
                  className="w-full bg-white border border-copper-penny/25 rounded-xl px-3 py-2 text-xs text-[#1F1813] focus:outline-none focus:border-[#B87333]"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-mono text-[10px] uppercase font-bold text-soft-sage">
                  Industry / Trade Category
                </label>
                <select
                  value={auditForm.industry}
                  onChange={(e) => setAuditForm({ ...auditForm, industry: e.target.value })}
                  className="w-full bg-white border border-copper-penny/25 rounded-xl px-3 py-2 text-xs text-[#1F1813] focus:outline-none focus:border-[#B87333]"
                >
                  <option value="Holistic Health & Apothecary">Holistic Health &amp; Apothecary</option>
                  <option value="Doula & Postpartum Midwifery">Doula &amp; Postpartum Midwifery</option>
                  <option value="Homeschool Co-op / Educational Academy">Homeschool Co-op / Educational Academy</option>
                  <option value="Homestead, Agriculture & Seed Sovereignty">Homestead, Agriculture &amp; Seed Sovereignty</option>
                  <option value="Artisan Crafts & Natural Apparel">Artisan Crafts &amp; Natural Apparel</option>
                  <option value="Professional Legal / Trust Services">Professional Legal / Trust Services</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block font-mono text-[10px] uppercase font-bold text-soft-sage">
                  Primary Administrative Drain
                </label>
                <input
                  type="text"
                  required
                  value={auditForm.biggestBottleneck}
                  onChange={(e) => setAuditForm({ ...auditForm, biggestBottleneck: e.target.value })}
                  placeholder="e.g. Chasing late client invoices and manual email scheduling"
                  className="w-full bg-white border border-copper-penny/25 rounded-xl px-3 py-2 text-xs text-[#1F1813] focus:outline-none focus:border-[#B87333]"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-mono text-[10px] uppercase font-bold text-soft-sage">
                  Preferred Date / Time Window
                </label>
                <input
                  type="text"
                  value={auditForm.preferredDate}
                  onChange={(e) => setAuditForm({ ...auditForm, preferredDate: e.target.value })}
                  className="w-full bg-white border border-copper-penny/25 rounded-xl px-3 py-2 text-xs text-[#1F1813] focus:outline-none focus:border-[#B87333]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsBookingModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white border border-copper-penny/25 font-mono text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#B87333] hover:bg-[#A85138] text-white font-mono font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md"
                >
                  Confirm Discovery Audit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
