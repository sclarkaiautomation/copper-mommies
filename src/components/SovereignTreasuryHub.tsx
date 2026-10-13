import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Coins, 
  Sparkles, 
  CreditCard, 
  Coffee, 
  Lock, 
  Building2, 
  CheckCircle2, 
  ArrowRight, 
  ExternalLink, 
  HelpCircle, 
  Share2, 
  Heart, 
  DollarSign, 
  Briefcase, 
  MapPin, 
  Calendar, 
  UserCheck, 
  FileText, 
  Layers, 
  TrendingUp, 
  Flame, 
  PlusCircle, 
  Copy, 
  Check, 
  Download, 
  AlertCircle,
  Tag,
  Zap,
  Globe
} from 'lucide-react';
import { 
  VillageSkillPot, 
  ExternalVendorSpotlight, 
  ClassifiedMicropayment, 
  TeaLoveGift 
} from '../types';
import { 
  INITIAL_SKILL_POTS, 
  INITIAL_EXTERNAL_VENDORS, 
  INITIAL_MICROPAYMENTS, 
  INITIAL_TEA_GIFTS, 
  DUAL_CHAMBER_SPECS, 
  PMA_COVENANT_TEXT, 
  SOVEREIGN_PAYMENT_CONFIG 
} from '../data/sovereignTreasuryData';

interface SovereignTreasuryHubProps {
  userName: string;
  userEmail?: string;
  selectedState: string;
  onShowToast?: (msg: string) => void;
  onNavigateToHub?: (hub: string) => void;
}

export default function SovereignTreasuryHub({
  userName,
  userEmail = 'sisterhood@coppermommies.co',
  selectedState,
  onShowToast = (msg: string) => alert(msg),
  onNavigateToHub
}: SovereignTreasuryHubProps) {
  // Main Hub Sub-Navigation
  const [activeSection, setActiveSection] = useState<
    'dual-chamber' | 'skill-pots' | 'vendor-spotlights' | 'micropayments' | 'buy-tea'
  >('dual-chamber');

  // Dual-Chamber State
  const [activeChamber, setActiveChamber] = useState<'tier1' | 'tier2'>('tier1');
  const [hasSignedPmaCovenant, setHasSignedPmaCovenant] = useState(false);
  const [covenantSignerName, setCovenantSignerName] = useState(userName);
  const [isCovenantModalOpen, setIsCovenantModalOpen] = useState(false);

  // Skill Pots State
  const [skillPots, setSkillPots] = useState<VillageSkillPot[]>(INITIAL_SKILL_POTS);
  const [selectedSkillPotCategory, setSelectedSkillPotCategory] = useState<string>('all');
  const [pledgingPot, setPledgingPot] = useState<VillageSkillPot | null>(null);
  const [pledgeAmount, setPledgeAmount] = useState<number>(25);
  const [isProposePotOpen, setIsProposePotOpen] = useState(false);
  const [newPotForm, setNewPotForm] = useState({
    title: '',
    instructor: '',
    instructorRole: '',
    category: 'Homestead & Land' as VillageSkillPot['category'],
    goalAmount: 500,
    description: '',
    highlights: '',
    scheduledDate: 'To be scheduled once 100% funded'
  });

  // External Vendor Spotlight State
  const [vendors, setVendors] = useState<ExternalVendorSpotlight[]>(INITIAL_EXTERNAL_VENDORS);
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
  const [vendorForm, setVendorForm] = useState({
    businessName: '',
    plan: 'quarterly' as 'monthly' | 'quarterly',
    targetHub: 'all' as ExternalVendorSpotlight['targetHub'],
    headline: '',
    tagline: '',
    description: '',
    promoCode: '',
    ctaUrl: 'https://',
    ctaText: 'Visit Business Website',
    contactEmail: '',
    logoEmoji: '🌿',
    category: 'Homestead & Agriculture'
  });

  // Micropayments State ($5 jobs / $10 land)
  const [micropayments, setMicropayments] = useState<ClassifiedMicropayment[]>(INITIAL_MICROPAYMENTS);
  const [microFilter, setMicroFilter] = useState<'all' | 'jobs' | 'land'>('all');
  const [isMicroModalOpen, setIsMicroModalOpen] = useState(false);
  const [microType, setMicroType] = useState<'job_listing' | 'land_classified'>('job_listing');
  const [microForm, setMicroForm] = useState({
    title: '',
    posterName: userName,
    locationState: selectedState,
    city: '',
    category: 'Childcare & Learning Pod',
    compensationOrPrice: '',
    acreageOrHours: '',
    description: '',
    contactEmail: userEmail,
    phone: ''
  });

  // "Buy Us a Tea" State
  const [teaGifts, setTeaGifts] = useState<TeaLoveGift[]>(INITIAL_TEA_GIFTS);
  const [teaSelectedTier, setTeaSelectedTier] = useState<number>(10);
  const [teaCustomAmount, setTeaCustomAmount] = useState<string>('15');
  const [teaPaymentMethod, setTeaPaymentMethod] = useState<'Stripe' | 'Cash App' | 'Zelle'>('Stripe');
  const [teaNote, setTeaNote] = useState('');
  const [teaDonorName, setTeaDonorName] = useState(userName);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [teaSuccessReceipt, setTeaSuccessReceipt] = useState<TeaLoveGift | null>(null);

  // Copy helper
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    onShowToast(`Copied ${label} to clipboard!`);
    setTimeout(() => setCopiedField(null), 2500);
  };

  // PLEDGE TO SKILL POT
  const handlePledgeToPot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pledgingPot) return;

    const addedAmount = pledgeAmount;
    setSkillPots(prev => prev.map(pot => {
      if (pot.id === pledgingPot.id) {
        const newTotal = pot.currentRaised + addedAmount;
        const isFunded = newTotal >= pot.goalAmount;
        return {
          ...pot,
          currentRaised: newTotal,
          backersCount: pot.backersCount + 1,
          status: isFunded ? 'funded' : pot.status,
          recordingReady: isFunded ? true : pot.recordingReady
        };
      }
      return pot;
    }));

    onShowToast(`Grateful! You chipped in $${addedAmount} toward "${pledgingPot.title}". Progress bar updated!`);
    setPledgingPot(null);
  };

  // PROPOSE NEW SKILL POT
  const handleProposePot = (e: React.FormEvent) => {
    e.preventDefault();
    const newPot: VillageSkillPot = {
      id: `pot-${Date.now()}`,
      title: newPotForm.title,
      instructor: newPotForm.instructor,
      instructorRole: newPotForm.instructorRole,
      category: newPotForm.category,
      goalAmount: Number(newPotForm.goalAmount),
      currentRaised: 15, // Seed pledge
      backersCount: 1,
      description: newPotForm.description,
      curriculumHighlights: newPotForm.highlights.split('\n').filter(h => h.trim().length > 0),
      scheduledDate: newPotForm.scheduledDate,
      status: 'active',
      minimumPledge: 5
    };

    setSkillPots(prev => [newPot, ...prev]);
    setIsProposePotOpen(false);
    onShowToast(`🎉 Village Skill Pot "${newPot.title}" proposed and live for sisterhood backing!`);
  };

  // SUBMIT EXTERNAL VENDOR SPOTLIGHT
  const handleCreateVendorSpotlight = (e: React.FormEvent) => {
    e.preventDefault();
    const price = vendorForm.plan === 'monthly' ? 25 : 50;
    const newVendor: ExternalVendorSpotlight = {
      id: `vendor-${Date.now()}`,
      businessName: vendorForm.businessName,
      plan: vendorForm.plan,
      price,
      targetHub: vendorForm.targetHub,
      headline: vendorForm.headline,
      tagline: vendorForm.tagline,
      description: vendorForm.description,
      promoCode: vendorForm.promoCode ? vendorForm.promoCode.toUpperCase() : undefined,
      ctaUrl: vendorForm.ctaUrl,
      ctaText: vendorForm.ctaText,
      contactEmail: vendorForm.contactEmail,
      logoEmoji: vendorForm.logoEmoji || '🌿',
      category: vendorForm.category,
      status: 'active',
      createdAt: 'Just now',
      verifiedExternal: true,
      stripeReceiptId: `rcpt_stripe_${Date.now()}`
    };

    setVendors(prev => [newVendor, ...prev]);
    setIsVendorModalOpen(false);
    onShowToast(`💳 External Vendor Spotlight verified and activated via Stripe ($${price} ${vendorForm.plan})!`);
  };

  // SUBMIT MICROPAYMENT LISTING ($5 / $10)
  const handleCreateMicropayment = (e: React.FormEvent) => {
    e.preventDefault();
    const fee = microType === 'job_listing' ? 5 : 10;
    const newListing: ClassifiedMicropayment = {
      id: `micro-${Date.now()}`,
      type: microType,
      fee,
      title: microForm.title,
      posterName: microForm.posterName,
      locationState: microForm.locationState,
      city: microForm.city,
      category: microForm.category,
      compensationOrPrice: microForm.compensationOrPrice,
      acreageOrHours: microForm.acreageOrHours,
      description: microForm.description,
      contactEmail: microForm.contactEmail,
      phone: microForm.phone,
      stripePaymentId: `ch_stripe_micro_${Date.now()}`,
      createdAt: 'Just now',
      status: 'Published & Verified'
    };

    setMicropayments(prev => [newListing, ...prev]);
    setIsMicroModalOpen(false);
    onShowToast(`✅ $${fee} micropayment processed via Stripe! Classified "${newListing.title}" is now published.`);
  };

  // SUBMIT "BUY US A TEA" GIFT
  const handleSendTeaGift = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = teaSelectedTier > 0 ? teaSelectedTier : Math.max(1, Number(teaCustomAmount) || 15);
    let tierTitle: TeaLoveGift['tier'] = '$10 Pot of Wildcrafted Goldenrod';
    if (amount === 3) tierTitle = '$3 Cup of Herbal Mint';
    else if (amount === 10) tierTitle = '$10 Pot of Wildcrafted Goldenrod';
    else if (amount === 25) tierTitle = '$25 Matriarch Honeycomb & Clay Pot';
    else tierTitle = 'Custom Sovereign Gift';

    const gift: TeaLoveGift = {
      id: `tea-${Date.now()}`,
      donorName: teaDonorName.trim() || 'Anonymous Sister',
      tier: tierTitle,
      amount,
      paymentMethod: teaPaymentMethod,
      transactionRef: `${teaPaymentMethod.toUpperCase()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      note: teaNote.trim() || 'Pouring love and care into the Copper Mommies Sanctuary.',
      date: 'Just now',
      isTaxExempt508: true,
      pmaCovenantAcknowledged: true
    };

    setTeaGifts(prev => [gift, ...prev]);
    setTeaSuccessReceipt(gift);
    setTeaNote('');
    onShowToast(`🍵 Thank you for your ${tierTitle} ($${amount}) love gift! 508(c)(1)(a) receipt generated.`);
  };

  const filteredPots = selectedSkillPotCategory === 'all' 
    ? skillPots 
    : skillPots.filter(p => p.category === selectedSkillPotCategory);

  const filteredMicros = microFilter === 'all'
    ? micropayments
    : microFilter === 'jobs'
    ? micropayments.filter(m => m.type === 'job_listing')
    : micropayments.filter(m => m.type === 'land_classified');

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* ========================================================================= */}
      {/* HEADER BANNER: SOVEREIGN FINANCIAL & LEGAL RAILS                          */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-br from-[#1F140E] via-[#2A1D16] to-[#140F0B] rounded-3xl p-6 sm:p-8 text-[#FAF5EE] border-2 border-[#D4AF37]/50 shadow-2xl relative overflow-hidden">
        {/* Background Sovereign Motifs */}
        <div className="absolute -right-12 -bottom-12 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-0 p-8 opacity-10 font-serif text-8xl font-black select-none pointer-events-none text-[#D4AF37]">
          §508
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-mono font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>5. Sovereign Financial &amp; Legal Rails • Dual-Chamber Sovereign Model</span>
            </div>
            
            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Sovereign Treasury, Paid Spotlights &amp; Skill Pots
            </h1>
            
            <p className="text-sm sm:text-base text-[#FAF5EE]/80 leading-relaxed">
              Operating with dual legal chambers: <strong className="text-[#D4AF37]">Tier 1 (The Sanctuary)</strong> protects private member covenants, herbal wisdom, and tax-exempt love gifts under Title 26 U.S.C. § 508(c)(1)(a). <strong className="text-[#00EEEE]">Tier 2 (The Operating Arm)</strong> interfaces with public Stripe commerce, outside vendor spotlights, and $5/$10 classified micropayments under <strong className="text-[#D4AF37]">SC Automated Solutions</strong>.
            </p>
          </div>

          {/* Quick Treasury Privacy / Rails Badge */}
          <div className="bg-white/10 backdrop-blur-md border border-[#D4AF37]/40 rounded-2xl p-4 sm:p-5 flex flex-col items-start sm:items-end space-y-1.5 shrink-0">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
              Sovereignty Status ({selectedState})
            </span>
            <div className="flex items-baseline space-x-2">
              <span className="text-xl sm:text-2xl font-serif font-black text-white">
                Title 26 § 508(c)(1)(a)
              </span>
            </div>
            <div className="flex items-center space-x-2 text-[11px] text-[#FAF5EE]/90">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Private Sanctuary • Protected Operating Rails</span>
            </div>
          </div>
        </div>

        {/* Operational Flow Notice */}
        <div className="mt-5 p-4 rounded-2xl bg-black/40 border border-[#D4AF37]/30 text-xs text-[#FAF5EE]/90 leading-relaxed flex items-start space-x-3">
          <Building2 className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-[#D4AF37] uppercase tracking-wide font-mono block mb-1">
              Founder Stewardship, Sovereign Privacy &amp; Separation of Funds
            </span>
            <span>
              All vendor spotlights ($25/mo or $60/qtr), classified publishing fees ($5/$10), and "Buy Us a Tea" love gifts flow directly to <strong>Mama Shantrece (Founder/Admin)</strong> and her operating entities (<strong>SC Automated Solutions</strong> / Sanctuary Rails) to sustain hosting, bandwidth, and platform care. In accordance with Title 26 U.S.C. § 508(c)(1)(a) and private association principles, internal banking books and platform revenue remain strictly private to Founder Administration and are not subject to public audit or display. Mother payouts occur via <strong>Motherhood Affiliation</strong> (20%–30% commissions) for referrals to SC Automated Solutions, Devi &amp; Mommie Creative Studios, NestBright Academy, A Healthy Addiction, and Your Brain is an Asset.
            </span>
          </div>
        </div>

        {/* Quick Navigation Tabs */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center gap-2">
          <button
            id="btn-treasury-dual-chamber"
            onClick={() => setActiveSection('dual-chamber')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold font-mono uppercase tracking-wider transition-all cursor-pointer flex items-center space-x-2 ${
              activeSection === 'dual-chamber'
                ? 'bg-[#D4AF37] text-[#1F140E] shadow-lg font-black'
                : 'bg-white/10 text-white hover:bg-white/20 border border-white/15'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>1. Dual-Chamber Sovereign Model</span>
          </button>

          <button
            id="btn-treasury-skill-pots"
            onClick={() => setActiveSection('skill-pots')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold font-mono uppercase tracking-wider transition-all cursor-pointer flex items-center space-x-2 ${
              activeSection === 'skill-pots'
                ? 'bg-[#D4AF37] text-[#1F140E] shadow-lg font-black'
                : 'bg-white/10 text-white hover:bg-white/20 border border-white/15'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>2. Village Skill Pots ({skillPots.length})</span>
          </button>

          <button
            id="btn-treasury-vendor-spotlights"
            onClick={() => setActiveSection('vendor-spotlights')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold font-mono uppercase tracking-wider transition-all cursor-pointer flex items-center space-x-2 ${
              activeSection === 'vendor-spotlights'
                ? 'bg-[#D4AF37] text-[#1F140E] shadow-lg font-black'
                : 'bg-white/10 text-white hover:bg-white/20 border border-white/15'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>3. External Vendor Spotlights ($25/mo or $60/qtr)</span>
          </button>

          <button
            id="btn-treasury-micropayments"
            onClick={() => setActiveSection('micropayments')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold font-mono uppercase tracking-wider transition-all cursor-pointer flex items-center space-x-2 ${
              activeSection === 'micropayments'
                ? 'bg-[#D4AF37] text-[#1F140E] shadow-lg font-black'
                : 'bg-white/10 text-white hover:bg-white/20 border border-white/15'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>4. $5 / $10 Copper Mommies Classifieds</span>
          </button>

          <button
            id="btn-treasury-buy-tea"
            onClick={() => setActiveSection('buy-tea')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold font-mono uppercase tracking-wider transition-all cursor-pointer flex items-center space-x-2 ${
              activeSection === 'buy-tea'
                ? 'bg-[#D4AF37] text-[#1F140E] shadow-lg font-black'
                : 'bg-white/10 text-white hover:bg-white/20 border border-white/15'
            }`}
          >
            <Coffee className="w-4 h-4" />
            <span>5. "Buy Us a Tea" Love Gift Portal</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: THE DUAL-CHAMBER SOVEREIGN MODEL                               */}
      {/* ========================================================================= */}
      {activeSection === 'dual-chamber' && (
        <div className="space-y-6 animate-fade-in">
          {/* Chamber Switcher Tabs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* TIER 1 CARD */}
            <div 
              onClick={() => setActiveChamber('tier1')}
              className={`p-6 rounded-3xl cursor-pointer transition-all duration-300 border-2 relative overflow-hidden ${
                activeChamber === 'tier1'
                  ? 'bg-[#1F140E] text-[#FAF5EE] border-[#D4AF37] shadow-2xl scale-[1.01]'
                  : 'bg-white text-[#1F1813] border-copper-penny/25 hover:border-[#D4AF37]/50 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40">
                  {DUAL_CHAMBER_SPECS.tier1.badge}
                </span>
                <span className="text-xl">🕊️</span>
              </div>
              <h3 className="font-serif text-2xl font-bold mb-1">
                {DUAL_CHAMBER_SPECS.tier1.title}
              </h3>
              <p className="text-xs font-mono text-[#D4AF37] font-semibold mb-3">
                {DUAL_CHAMBER_SPECS.tier1.legalForm}
              </p>
              <p className="text-xs leading-relaxed opacity-90 mb-4">
                {DUAL_CHAMBER_SPECS.tier1.purpose}
              </p>

              <div className="flex items-center space-x-2 text-xs font-bold text-[#D4AF37]">
                <span>Explore Sanctuary Structure &amp; Member Covenant</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* TIER 2 CARD */}
            <div 
              onClick={() => setActiveChamber('tier2')}
              className={`p-6 rounded-3xl cursor-pointer transition-all duration-300 border-2 relative overflow-hidden ${
                activeChamber === 'tier2'
                  ? 'bg-[#0B1A2F] text-[#FAF5EE] border-[#00EEEE] shadow-2xl scale-[1.01]'
                  : 'bg-white text-[#1F1813] border-copper-penny/25 hover:border-[#0047AB]/50 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[#00EEEE]/20 text-[#00EEEE] border border-[#00EEEE]/40">
                  {DUAL_CHAMBER_SPECS.tier2.badge}
                </span>
                <span className="text-xl">🛡️</span>
              </div>
              <h3 className="font-serif text-2xl font-bold mb-1">
                {DUAL_CHAMBER_SPECS.tier2.title}
              </h3>
              <p className="text-xs font-mono text-[#00EEEE] font-semibold mb-3">
                {DUAL_CHAMBER_SPECS.tier2.legalForm}
              </p>
              <p className="text-xs leading-relaxed opacity-90 mb-4">
                {DUAL_CHAMBER_SPECS.tier2.purpose}
              </p>

              <div className="flex items-center space-x-2 text-xs font-bold text-[#00EEEE]">
                <span>Explore Operating Arm &amp; Commercial Rails</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* ACTIVE CHAMBER DEEP-DIVE SPECIFICATION */}
          <div className="bg-white rounded-3xl border-2 border-copper-penny/25 p-6 sm:p-8 shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-copper-penny/15">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#B87333] font-extrabold">
                  Detailed Operational Architecture
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F1813]">
                  {activeChamber === 'tier1' ? DUAL_CHAMBER_SPECS.tier1.title : DUAL_CHAMBER_SPECS.tier2.title}
                </h2>
                <p className="text-xs font-mono text-soft-sage">
                  Jurisdiction: {activeChamber === 'tier1' ? DUAL_CHAMBER_SPECS.tier1.jurisdiction : DUAL_CHAMBER_SPECS.tier2.jurisdiction}
                </p>
              </div>

              {activeChamber === 'tier1' ? (
                <button
                  onClick={() => setIsCovenantModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-[#1F140E] text-[#D4AF37] border-2 border-[#D4AF37] hover:bg-[#2A1D16] text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md flex items-center space-x-2"
                >
                  <FileText className="w-4 h-4 text-[#D4AF37]" />
                  <span>{hasSignedPmaCovenant ? '✓ View Signed Covenant' : 'Sign PMA Member Covenant'}</span>
                </button>
              ) : (
                <div className="flex items-center space-x-2 bg-blue-50 border border-blue-200 px-4 py-2 rounded-xl text-xs font-mono text-[#0047AB]">
                  <CreditCard className="w-4 h-4" />
                  <span>Stripe Merchant Active • Public Shield</span>
                </div>
              )}
            </div>

            {/* Architecture Comparison Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-serif font-bold text-lg text-[#1F1813] flex items-center space-x-2">
                  <Layers className="w-5 h-5 text-[#B87333]" />
                  <span>Core Operational Mandates</span>
                </h4>
                <div className="space-y-2.5">
                  {(activeChamber === 'tier1' ? DUAL_CHAMBER_SPECS.tier1.rules : DUAL_CHAMBER_SPECS.tier2.rules).map((rule, idx) => (
                    <div key={idx} className="flex items-start space-x-3 p-3.5 rounded-2xl bg-[#FAF5EE]/70 border border-copper-penny/15 text-xs text-[#1F1813]/90 leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{rule}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-serif font-bold text-lg text-[#1F1813] flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-[#B87333]" />
                  <span>Tax &amp; Regulatory Insulation</span>
                </h4>
                
                <div className="p-5 rounded-2xl bg-[#FBF7F1] border border-copper-penny/20 space-y-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider font-extrabold text-[#B87333] block">
                    Statutory Authority &amp; Tax Status
                  </span>
                  <p className="text-xs text-[#1F1813]/85 leading-relaxed">
                    {activeChamber === 'tier1' ? DUAL_CHAMBER_SPECS.tier1.taxStatus : DUAL_CHAMBER_SPECS.tier2.taxStatus}
                  </p>
                  
                  {activeChamber === 'tier1' && (
                    <div className="pt-2 border-t border-copper-penny/15 text-[11px] text-[#2E4F32] font-semibold space-y-1">
                      <p>• Mandatory Exception: Title 26 U.S.C. § 508(c)(1)(a) requires no IRS 1023 filing.</p>
                      <p>• Unconditional First Amendment ecclesiastical and private assembly immunity.</p>
                      <p>• Protects all private herbal formulas, birth stories, and spiritual exchanges.</p>
                    </div>
                  )}

                  {activeChamber === 'tier2' && (
                    <div className="pt-2 border-t border-copper-penny/15 text-[11px] text-[#0047AB] font-semibold space-y-1">
                      <p>• Isolates commercial disputes and vendor payments completely from the Sanctuary.</p>
                      <p>• Connects to standard Stripe, ACH, and debit card payment processors.</p>
                      <p>• Directs surplus revenue to fund Sanctuary grants and collective skill pots.</p>
                    </div>
                  )}
                </div>

                {/* Visual Firewall Graphic */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-[#1F140E] to-[#0B1A2F] text-white flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Lock className="w-6 h-6 text-[#D4AF37]" />
                    <div>
                      <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider font-bold block">
                        Dual-Chamber Firewall
                      </span>
                      <span className="text-xs font-bold">Public World ↔ Single-Member LLC ↔ Private Sanctuary (508)</span>
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-lg bg-white/10 font-mono text-emerald-300 font-bold border border-emerald-400/40">
                    Active Shield
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: THE COLLECTIVE VILLAGE SKILL POT                               */}
      {/* ========================================================================= */}
      {activeSection === 'skill-pots' && (
        <div className="space-y-6 animate-fade-in">
          {/* Section Subheader & Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🍯</span>
                <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#1F1813]">
                  The Collective Village Skill Pot
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-[#1F1813]/80 mt-1 max-w-2xl leading-relaxed">
                Crowdfunded masterclasses and vocational workshops. When a community funding goal is met, the class unlocks for all verified sisters in the collective with lifetime archive access.
              </p>
            </div>

            <button
              onClick={() => setIsProposePotOpen(true)}
              className="px-4 py-2.5 bg-[#B87333] hover:bg-[#A85138] text-white text-xs font-mono font-bold uppercase tracking-wider rounded-xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center space-x-2 shrink-0"
            >
              <PlusCircle className="w-4 h-4 text-[#D4AF37]" />
              <span>Propose a Village Skill Pot</span>
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            {[
              { id: 'all', label: 'All Skill Pots' },
              { id: 'Homestead & Land', label: '🌾 Homestead & Land' },
              { id: 'Wealth & Estate Trusts', label: '📜 Wealth & Estate Trusts' },
              { id: 'Herbalism & Doula', label: '🌿 Herbalism & Doula' },
              { id: 'Homeschool Mastery', label: '📚 Homeschool Mastery' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedSkillPotCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${
                  selectedSkillPotCategory === cat.id
                    ? 'bg-[#1F140E] text-[#D4AF37] border-2 border-[#D4AF37] shadow-sm'
                    : 'bg-white text-[#1F1813]/70 hover:bg-[#FAF5EE] border border-copper-penny/20'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Skill Pots Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPots.map(pot => {
              const percent = Math.min(100, Math.round((pot.currentRaised / pot.goalAmount) * 100));
              const isFunded = pot.status === 'funded' || pot.currentRaised >= pot.goalAmount;

              return (
                <div
                  key={pot.id}
                  className={`rounded-3xl p-6 border-2 transition-all flex flex-col justify-between relative overflow-hidden ${
                    isFunded
                      ? 'bg-gradient-to-b from-[#FAF5EE] to-[#EAE0D3] border-emerald-500/50 shadow-md'
                      : 'bg-white border-copper-penny/25 hover:border-[#D4AF37] shadow-sm hover:shadow-lg'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Header Badges */}
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[#1F140E] text-[#D4AF37] border border-[#D4AF37]/30">
                        {pot.category}
                      </span>
                      {isFunded ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>100% FUNDED &amp; UNLOCKED</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          <Flame className="w-3 h-3 text-amber-600" />
                          <span>{percent}% BACKED</span>
                        </span>
                      )}
                    </div>

                    {/* Pot Title & Instructor */}
                    <div>
                      <h3 className="font-serif text-lg font-bold text-[#1F1813] leading-snug">
                        {pot.title}
                      </h3>
                      <p className="text-xs text-[#B87333] font-semibold mt-1">
                        Guided by {pot.instructor} • <span className="text-[#1F1813]/60">{pot.instructorRole}</span>
                      </p>
                    </div>

                    <p className="text-xs text-[#1F1813]/80 leading-relaxed line-clamp-3">
                      {pot.description}
                    </p>

                    {/* Curriculum Bullet Highlights */}
                    <div className="p-3 bg-[#FAF5EE]/80 rounded-2xl border border-copper-penny/15 space-y-1.5 text-[11px] text-[#1F1813]/85">
                      <span className="font-mono font-bold text-[9px] uppercase tracking-wider text-[#B87333] block">
                        Curriculum Highlights:
                      </span>
                      {pot.curriculumHighlights.slice(0, 2).map((item, idx) => (
                        <div key={idx} className="flex items-start space-x-1.5">
                          <span className="text-[#D4AF37] font-bold">•</span>
                          <span className="line-clamp-1">{item}</span>
                        </div>
                      ))}
                    </div>

                    {/* LIVE FUNDING GOAL PROGRESS BAR */}
                    <div className="space-y-2 pt-2">
                      <div className="flex items-baseline justify-between text-xs font-mono font-bold">
                        <div>
                          <span className="text-lg font-black text-[#1F1813]">${pot.currentRaised}</span>
                          <span className="text-[#1F1813]/60"> of ${pot.goalAmount} raised</span>
                        </div>
                        <span className="text-[#B87333]">{pot.backersCount} Sisters Backed</span>
                      </div>

                      {/* Visual Progress Bar Container */}
                      <div className="w-full h-3.5 bg-gray-100 rounded-full overflow-hidden border border-copper-penny/20 relative shadow-inner">
                        <div 
                          className={`h-full transition-all duration-700 rounded-full ${
                            isFunded
                              ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                              : 'bg-gradient-to-r from-[#B87333] via-[#D4AF37] to-amber-500'
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions / Buttons */}
                  <div className="pt-6 border-t border-copper-penny/15 mt-4 flex items-center justify-between gap-3">
                    <span className="text-[11px] font-mono text-soft-sage font-bold">
                      {isFunded ? '🎉 Archive Unlocked' : pot.scheduledDate}
                    </span>

                    {isFunded ? (
                      <button
                        onClick={() => onShowToast(`🎓 Opening replay archive for "${pot.title}". Access granted!`)}
                        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer flex items-center space-x-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Watch Masterclass</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setPledgingPot(pot);
                          setPledgeAmount(pot.minimumPledge);
                        }}
                        className="px-4 py-2 bg-[#1F140E] hover:bg-[#2A1D16] text-[#D4AF37] border border-[#D4AF37] rounded-xl text-xs font-mono font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer flex items-center space-x-1.5 active:scale-95"
                      >
                        <Coins className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Chip In ($5+)</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 3: EXTERNAL VENDOR SPOTLIGHTS ($25/MO OR $60/QTR)                 */}
      {/* ========================================================================= */}
      {activeSection === 'vendor-spotlights' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-gradient-to-r from-[#FAF5EE] via-[#F6EFE6] to-[#EAE0D3] p-6 sm:p-8 rounded-3xl border-2 border-copper-penny/25 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[#1F140E] text-[#D4AF37]">
                Zero-Monthly-Fee Outside Revenue Engine
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F1813]">
                External Vendor Spotlights
              </h2>
              <p className="text-xs sm:text-sm text-[#1F1813]/85 leading-relaxed">
                Outside non-vetted businesses (farm supplies, solar engineers, lead-free glassware makers) sponsor targeted spotlight banners across our regional hubs. Priced at <strong className="text-[#B87333]">$25/month</strong> or <strong className="text-[#0047AB]">$60/quarter</strong>, powered by self-serve Stripe payments.
              </p>
            </div>

            <button
              onClick={() => setIsVendorModalOpen(true)}
              className="px-5 py-3 bg-[#0047AB] hover:bg-blue-800 text-white rounded-2xl text-xs font-mono font-bold uppercase tracking-wider shadow-lg transition-all active:scale-95 cursor-pointer flex items-center space-x-2 shrink-0 border border-blue-400/40"
            >
              <CreditCard className="w-4 h-4 text-[#00EEEE]" />
              <span>Purchase External Vendor Spotlight</span>
            </button>
          </div>

          {/* Pricing Tier Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-copper-penny/25 shadow-xs flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider font-extrabold text-[#B87333]">Standard Monthly Banner</span>
                <h4 className="font-serif text-xl font-bold text-[#1F1813]">$25 / Month</h4>
                <p className="text-xs text-[#1F1813]/70">Includes 1 target Hub banner placement + promo code integration.</p>
              </div>
              <button 
                onClick={() => {
                  setVendorForm(prev => ({ ...prev, plan: 'monthly' }));
                  setIsVendorModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-[#FAF5EE] hover:bg-[#B87333] hover:text-white text-xs font-mono font-bold border border-copper-penny/20 transition-all cursor-pointer"
              >
                Choose Monthly
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-[#0B1A2F] text-white border-2 border-[#00EEEE]/40 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider font-extrabold text-[#00EEEE]">Quarterly Partner Tier</span>
                  <span className="text-[9px] bg-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-full font-mono font-bold">SAVE $15</span>
                </div>
                <h4 className="font-serif text-xl font-bold text-white">$60 / Quarter (3 Months)</h4>
                <p className="text-xs text-[#FAF5EE]/80">Universal All-Hub placement + priority spotlight in sisterhood bulletins.</p>
              </div>
              <button 
                onClick={() => {
                  setVendorForm(prev => ({ ...prev, plan: 'quarterly' }));
                  setIsVendorModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-[#00EEEE] hover:bg-cyan-300 text-[#0B1A2F] text-xs font-mono font-extrabold transition-all cursor-pointer"
              >
                Choose Quarterly
              </button>
            </div>
          </div>

          {/* Active Vendor Spotlights Directory */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#1F1813] flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-[#B87333]" />
              <span>Active Verified Outside Vendors ({vendors.length})</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {vendors.map(vendor => (
                <div 
                  key={vendor.id}
                  className="bg-white rounded-3xl border-2 border-copper-penny/20 p-6 flex flex-col justify-between hover:border-[#0047AB] shadow-sm hover:shadow-md transition-all space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{vendor.logoEmoji}</span>
                        <div>
                          <h4 className="font-serif font-bold text-[#1F1813] text-base leading-tight">
                            {vendor.businessName}
                          </h4>
                          <span className="text-[10px] font-mono text-soft-sage uppercase tracking-wider">
                            {vendor.category}
                          </span>
                        </div>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-blue-50 text-[#0047AB] border border-blue-200">
                        ${vendor.price}/{vendor.plan === 'monthly' ? 'mo' : 'qtr'}
                      </span>
                    </div>

                    <div className="p-3 bg-[#FAF5EE]/70 rounded-2xl border border-copper-penny/15 space-y-1">
                      <h5 className="font-serif text-xs font-bold text-[#1F1813]">
                        {vendor.headline}
                      </h5>
                      <p className="text-[11px] text-[#1F1813]/80 leading-relaxed">
                        {vendor.description}
                      </p>
                    </div>

                    {vendor.promoCode && (
                      <div className="flex items-center justify-between p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-xs font-mono">
                        <span className="text-amber-900 font-semibold text-[11px]">Special Promo Code:</span>
                        <span className="font-bold text-amber-950 bg-white px-2 py-0.5 rounded border border-amber-300">
                          {vendor.promoCode}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-copper-penny/10 flex items-center justify-between gap-3">
                    <span className="text-[10px] font-mono text-gray-400">
                      Receipt: {vendor.stripeReceiptId?.slice(0, 14)}...
                    </span>
                    <a
                      href={vendor.ctaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 bg-[#1F1813] hover:bg-[#0047AB] text-white text-xs font-mono font-bold rounded-xl transition-all flex items-center space-x-1.5"
                    >
                      <span>{vendor.ctaText}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 4: COPPER MOMMIES CLASSIFIEDS ($5 JOBS / $10 LAND)                */}
      {/* ========================================================================= */}
      {activeSection === 'micropayments' && (
        <div className="space-y-6 animate-fade-in">
          {/* Header Description & Action Buttons */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🏷️</span>
                <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#1F1813]">
                  Copper Mommies Classifieds
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-[#1F1813]/80 mt-1 max-w-2xl leading-relaxed">
                Simple, non-recurring micropayments to list on our regional community boards: <strong className="text-emerald-700">$5 for job &amp; gig listings</strong> and <strong className="text-[#B87333]">$10 for homestead, land &amp; acreage classifieds</strong>. All publishing fees go directly to platform infrastructure and verification.
              </p>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => {
                  setMicroType('job_listing');
                  setMicroForm(prev => ({ ...prev, category: 'Childcare & Learning Pod' }));
                  setIsMicroModalOpen(true);
                }}
                className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-mono font-bold uppercase tracking-wider rounded-xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center space-x-1.5"
              >
                <Briefcase className="w-4 h-4 text-emerald-300" />
                <span>+ Post $5 Job Listing</span>
              </button>

              <button
                onClick={() => {
                  setMicroType('land_classified');
                  setMicroForm(prev => ({ ...prev, category: 'Acreage & Farm Share' }));
                  setIsMicroModalOpen(true);
                }}
                className="px-4 py-2.5 bg-[#B87333] hover:bg-[#A85138] text-white text-xs font-mono font-bold uppercase tracking-wider rounded-xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center space-x-1.5"
              >
                <MapPin className="w-4 h-4 text-[#D4AF37]" />
                <span>+ Post $10 Land Classified</span>
              </button>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-2 pt-2">
            {[
              { id: 'all', label: `All Classifieds (${micropayments.length})` },
              { id: 'jobs', label: `💼 Jobs & Gigs ($5)` },
              { id: 'land', label: `🌾 Homestead & Land ($10)` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setMicroFilter(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${
                  microFilter === tab.id
                    ? 'bg-[#1F140E] text-[#D4AF37] border-2 border-[#D4AF37]'
                    : 'bg-white text-[#1F1813]/70 hover:bg-[#FAF5EE] border border-copper-penny/20'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Classifieds Feed */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredMicros.map(item => (
              <div 
                key={item.id}
                className="bg-white rounded-3xl border-2 border-copper-penny/20 p-6 flex flex-col justify-between hover:border-[#B87333] shadow-sm hover:shadow-md transition-all space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                      item.type === 'job_listing'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-50 text-amber-900 border border-amber-300'
                    }`}>
                      {item.type === 'job_listing' ? '💼 $5 Job Listing' : '🌾 $10 Land Classified'}
                    </span>
                    <span className="text-xs font-mono text-[#B87333] font-bold">
                      {item.locationState} Circle • {item.city}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#1F1813] leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-soft-sage font-semibold mt-0.5">
                      Posted by {item.posterName} • {item.createdAt}
                    </p>
                  </div>

                  {/* Compensation / Rate Banner */}
                  <div className="p-3 bg-[#FAF5EE] rounded-2xl border border-copper-penny/15 flex items-center justify-between text-xs font-mono">
                    <span className="text-[#1F1813]/70">Rate / Terms:</span>
                    <strong className="text-[#1F1813] font-black">{item.compensationOrPrice}</strong>
                  </div>

                  {item.acreageOrHours && (
                    <p className="text-[11px] font-mono text-soft-sage">
                      <strong>Scope:</strong> {item.acreageOrHours}
                    </p>
                  )}

                  <p className="text-xs text-[#1F1813]/85 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-copper-penny/10 flex items-center justify-between gap-3 text-xs">
                  <span className="text-[10px] font-mono text-emerald-700 font-semibold flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verified Stripe {item.stripePaymentId.slice(0, 12)}...</span>
                  </span>

                  <a
                    href={`mailto:${item.contactEmail}?subject=${encodeURIComponent(`Inquiry regarding: ${item.title}`)}`}
                    className="px-4 py-2 bg-[#1F140E] hover:bg-[#B87333] text-white font-mono text-xs font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Contact Poster
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 5: "BUY US A TEA" LOVE GIFT PORTAL                                */}
      {/* ========================================================================= */}
      {activeSection === 'buy-tea' && (
        <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
          {/* Header Intro */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#FAF5EE] border border-copper-penny/25 text-[#B87333] text-xs font-mono font-bold uppercase tracking-wider">
              <Coffee className="w-3.5 h-3.5 text-[#B87333]" />
              <span>508(c)(1)(a) Sanctuary Free-Will Love Gift Rails</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#1F1813]">
              "Buy Us a Tea" • Sanctuary Love Gifts
            </h2>
            <p className="text-sm text-[#1F1813]/80 max-w-2xl mx-auto leading-relaxed">
              Every dollar given through this portal is an un-encumbered, voluntary free-will love gift under Title 26 U.S.C. § 508(c)(1)(a), flowing directly to Mama Shantrece (Founder &amp; Steward) to sustain the Copper Mommies Sanctuary infrastructure, encrypted audio streaming, server costs, and maternal care provisions.
            </p>
            <div className="inline-block p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-mono max-w-xl mx-auto text-left">
              <strong>💡 Clarity Note:</strong> This portal is direct support for platform operations and the founder—not a peer-to-peer cash pool. Copper Mommies does not handle cash transfers between individual members; members trade skills, barter, or arrange their own private terms.
            </div>
          </div>

          {/* TEA TIER CARDS SELECTION */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* TIER 1: $3 */}
            <div
              onClick={() => {
                setTeaSelectedTier(3);
                setTeaCustomAmount('3');
              }}
              className={`p-6 rounded-3xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                teaSelectedTier === 3
                  ? 'bg-[#1F140E] text-[#FAF5EE] border-[#D4AF37] shadow-xl scale-[1.02]'
                  : 'bg-white text-[#1F1813] border-copper-penny/25 hover:border-[#D4AF37] shadow-sm'
              }`}
            >
              <div className="space-y-3">
                <span className="text-3xl">🍵</span>
                <div>
                  <h4 className="font-serif text-xl font-bold">Cup of Herbal Mint</h4>
                  <span className="text-2xl font-mono font-black text-[#D4AF37] block mt-1">$3</span>
                </div>
                <p className="text-xs opacity-85 leading-relaxed">
                  A warm cup of wild peppermint &amp; elderberry to fuel daily maternal reflection circles and database encryption.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 text-xs font-mono font-bold text-[#D4AF37]">
                {teaSelectedTier === 3 ? '✓ Selected Gift' : 'Select $3 Tier'}
              </div>
            </div>

            {/* TIER 2: $10 (POPULAR) */}
            <div
              onClick={() => {
                setTeaSelectedTier(10);
                setTeaCustomAmount('10');
              }}
              className={`p-6 rounded-3xl border-2 cursor-pointer transition-all flex flex-col justify-between relative ${
                teaSelectedTier === 10
                  ? 'bg-[#1F140E] text-[#FAF5EE] border-[#D4AF37] shadow-xl scale-[1.02]'
                  : 'bg-white text-[#1F1813] border-copper-penny/25 hover:border-[#D4AF37] shadow-sm'
              }`}
            >
              <span className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-[#D4AF37] text-[#1F140E]">
                POPULAR
              </span>
              <div className="space-y-3">
                <span className="text-3xl">🫖</span>
                <div>
                  <h4 className="font-serif text-xl font-bold">Pot of Wildcrafted Goldenrod</h4>
                  <span className="text-2xl font-mono font-black text-[#D4AF37] block mt-1">$10</span>
                </div>
                <p className="text-xs opacity-85 leading-relaxed">
                  Supplies 1 week of cloud bandwidth, encrypted audio stages, and private homeschool repository hosting.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 text-xs font-mono font-bold text-[#D4AF37]">
                {teaSelectedTier === 10 ? '✓ Selected Gift' : 'Select $10 Tier'}
              </div>
            </div>

            {/* TIER 3: $25 */}
            <div
              onClick={() => {
                setTeaSelectedTier(25);
                setTeaCustomAmount('25');
              }}
              className={`p-6 rounded-3xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                teaSelectedTier === 25
                  ? 'bg-[#1F140E] text-[#FAF5EE] border-[#D4AF37] shadow-xl scale-[1.02]'
                  : 'bg-white text-[#1F1813] border-copper-penny/25 hover:border-[#D4AF37] shadow-sm'
              }`}
            >
              <div className="space-y-3">
                <span className="text-3xl">🍯</span>
                <div>
                  <h4 className="font-serif text-xl font-bold">Matriarch Honeycomb &amp; Clay Pot</h4>
                  <span className="text-2xl font-mono font-black text-[#D4AF37] block mt-1">$25</span>
                </div>
                <p className="text-xs opacity-85 leading-relaxed">
                  Funds an urgent postpartum meal delivery or emergency botanical relief care package for a mother in need.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 text-xs font-mono font-bold text-[#D4AF37]">
                {teaSelectedTier === 25 ? '✓ Selected Gift' : 'Select $25 Tier'}
              </div>
            </div>
          </div>

          {/* CUSTOM AMOUNT OPTION */}
          <div className="bg-[#FAF5EE] p-4 rounded-2xl border border-copper-penny/20 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-2 text-xs font-mono font-bold text-[#1F1813]">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>Or enter a custom sovereign love gift amount:</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-mono font-bold text-[#1F1813]">$</span>
              <input
                type="number"
                min="1"
                value={teaCustomAmount}
                onChange={(e) => {
                  setTeaCustomAmount(e.target.value);
                  setTeaSelectedTier(0); // custom
                }}
                className="w-24 bg-white border border-copper-penny/30 rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-[#1F1813] focus:outline-none focus:border-[#D4AF37]"
                placeholder="50"
              />
              <span className="text-xs font-mono text-soft-sage">USD</span>
            </div>
          </div>

          {/* MULTI-RAIL PAYMENT FORM: STRIPE, CASH APP, ZELLE */}
          <form onSubmit={handleSendTeaGift} className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-copper-penny/25 shadow-md space-y-6">
            <div className="space-y-2">
              <h3 className="font-serif text-xl font-bold text-[#1F1813]">
                Select Financial Rail
              </h3>
              <p className="text-xs text-[#1F1813]/70">
                Choose how you would like to transmit your love gift to the Copper Mommies Treasury.
              </p>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'Stripe', label: '💳 Stripe Card', sub: 'Instant Online Receipt' },
                { id: 'Cash App', label: '🟢 Cash App', sub: '$CopperMommiesCo' },
                { id: 'Zelle', label: '🏦 Zelle', sub: 'Bank to Bank Direct' }
              ].map(method => (
                <button
                  type="button"
                  key={method.id}
                  onClick={() => setTeaPaymentMethod(method.id as any)}
                  className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                    teaPaymentMethod === method.id
                      ? 'bg-[#1F140E] text-[#FAF5EE] border-[#D4AF37] shadow-sm'
                      : 'bg-white text-[#1F1813] border-copper-penny/20 hover:bg-[#FAF5EE]'
                  }`}
                >
                  <div className="font-mono text-xs font-bold">{method.label}</div>
                  <div className="text-[10px] opacity-70 mt-0.5">{method.sub}</div>
                </button>
              ))}
            </div>

            {/* Cash App Instructions Box */}
            {teaPaymentMethod === 'Cash App' && (
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-sm text-emerald-700">Cashtag:</span>
                    <strong className="font-mono text-base text-emerald-950">{SOVEREIGN_PAYMENT_CONFIG.cashAppHandle}</strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(SOVEREIGN_PAYMENT_CONFIG.cashAppHandle, 'Cash App Cashtag')}
                    className="px-3 py-1 bg-white hover:bg-emerald-100 rounded-lg border border-emerald-300 text-emerald-900 font-mono text-[11px] font-bold flex items-center space-x-1 cursor-pointer"
                  >
                    {copiedField === 'Cash App Cashtag' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedField === 'Cash App Cashtag' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  Send your gift directly via Cash App. Include "Love Gift 508" in the memo note, then click the button below to record your public contribution.
                </p>
              </div>
            )}

            {/* Zelle Instructions Box */}
            {teaPaymentMethod === 'Zelle' && (
              <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 text-xs text-purple-950 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-sm text-purple-700">Zelle Recipient:</span>
                    <strong className="font-mono text-sm text-purple-950">{SOVEREIGN_PAYMENT_CONFIG.zelleEmail}</strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(SOVEREIGN_PAYMENT_CONFIG.zelleEmail, 'Zelle Recipient Email')}
                    className="px-3 py-1 bg-white hover:bg-purple-100 rounded-lg border border-purple-300 text-purple-900 font-mono text-[11px] font-bold flex items-center space-x-1 cursor-pointer"
                  >
                    {copiedField === 'Zelle Recipient Email' ? <Check className="w-3 h-3 text-purple-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedField === 'Zelle Recipient Email' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-purple-800 leading-relaxed">
                  Send via your bank's mobile app using Zelle to <code className="font-mono font-bold">{SOVEREIGN_PAYMENT_CONFIG.zelleEmail}</code>. Name: Copper Mommies Sanctuary Treasury.
                </p>
              </div>
            )}

            {/* Donor Name & Care Note */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-wider font-extrabold text-[#B87333] block">
                  Your Sister Name or Attribution
                </label>
                <input
                  type="text"
                  required
                  value={teaDonorName}
                  onChange={(e) => setTeaDonorName(e.target.value)}
                  placeholder="e.g. Sister Keisha / Mama Nia"
                  className="w-full bg-[#FAF5EE] border border-copper-penny/25 rounded-xl px-3.5 py-2 text-xs text-[#1F1813] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-wider font-extrabold text-[#B87333] block">
                  Encouragement / Support Note
                </label>
                <input
                  type="text"
                  value={teaNote}
                  onChange={(e) => setTeaNote(e.target.value)}
                  placeholder="e.g. In honor of our grandmothers' wisdom and gardens..."
                  className="w-full bg-[#FAF5EE] border border-copper-penny/25 rounded-xl px-3.5 py-2 text-xs text-[#1F1813] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            {/* 508(c)(1)(a) Statutory Affirmation Check */}
            <div className="p-3.5 rounded-2xl bg-[#FAF5EE] border border-copper-penny/15 text-[11px] text-[#1F1813]/80 space-y-1">
              <div className="flex items-center space-x-2 font-bold text-[#1F1813]">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Title 26 U.S.C. § 508(c)(1)(a) Member Declaration</span>
              </div>
              <p>
                I confirm that this contribution is a voluntary, non-commercial free-will love gift given in peace within the private sovereign domain of Copper Mommies Co.
              </p>
            </div>

            {/* Transmit Button */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-mono font-bold text-[#1F1813]">
                Total Gift: <span className="text-xl font-black text-[#B87333]">${teaSelectedTier > 0 ? teaSelectedTier : teaCustomAmount}</span>
              </span>

              <button
                type="submit"
                className="px-6 py-3 bg-[#1F140E] hover:bg-[#2A1D16] text-[#D4AF37] border-2 border-[#D4AF37] rounded-2xl text-xs font-mono font-bold uppercase tracking-wider shadow-lg transition-all cursor-pointer active:scale-95 flex items-center space-x-2"
              >
                <Coffee className="w-4 h-4 text-[#D4AF37]" />
                <span>Send Love Gift via {teaPaymentMethod}</span>
              </button>
            </div>
          </form>

          {/* RECENT SISTER LOVE GIFTS FEED */}
          <div className="space-y-4 pt-4">
            <h3 className="font-serif text-xl font-bold text-[#1F1813] flex items-center space-x-2">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500/20" />
              <span>Sanctuary Tea Love Gifts Feed</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teaGifts.map(gift => (
                <div key={gift.id} className="p-4 rounded-2xl bg-white border border-copper-penny/20 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">🍵</span>
                      <div>
                        <h4 className="font-serif font-bold text-xs text-[#1F1813]">{gift.donorName}</h4>
                        <span className="text-[10px] font-mono text-soft-sage">{gift.tier} • {gift.date}</span>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      ${gift.amount} via {gift.paymentMethod}
                    </span>
                  </div>
                  {gift.note && (
                    <p className="text-xs text-[#1F1813]/85 italic bg-[#FAF5EE]/60 p-2.5 rounded-xl border border-copper-penny/10">
                      "{gift.note}"
                    </p>
                  )}
                  <div className="text-[9px] font-mono text-gray-400">
                    508 Receipt Ref: {gift.transactionRef}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: SIGN 508(C)(1)(A) / PMA MEMBER COVENANT                           */}
      {/* ========================================================================= */}
      {isCovenantModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border-2 border-[#D4AF37] max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-scale-in">
            <div className="bg-[#1F140E] text-[#FAF5EE] p-5 border-b border-[#D4AF37]/40 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <ShieldCheck className="w-6 h-6 text-[#D4AF37]" />
                <div>
                  <h3 className="font-serif text-lg font-bold">508(c)(1)(a) / PMA Member Covenant</h3>
                  <p className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider">Private Sovereign Sanctuary Ground</p>
                </div>
              </div>
              <button
                onClick={() => setIsCovenantModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer text-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs text-[#1F1813]/85 leading-relaxed font-sans">
              <div className="p-4 bg-[#FAF5EE] rounded-2xl border border-copper-penny/20 font-mono text-[11px] whitespace-pre-line leading-relaxed">
                {PMA_COVENANT_TEXT}
              </div>

              {/* Digital Signature Field */}
              <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200 space-y-3">
                <label className="text-[10px] font-mono uppercase tracking-wider font-extrabold text-amber-900 block">
                  Sister Digital Signature Affirmation
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={covenantSignerName}
                    onChange={(e) => setCovenantSignerName(e.target.value)}
                    placeholder="Type your full name as maternal signature"
                    className="flex-1 bg-white border border-copper-penny/30 rounded-xl px-3 py-2 text-xs font-serif italic text-[#1F1813] focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      if (!covenantSignerName.trim()) return alert('Please enter your name as digital signature.');
                      setHasSignedPmaCovenant(true);
                      setIsCovenantModalOpen(false);
                      onShowToast(`📜 Covenant signed by ${covenantSignerName}! Sovereign Member Certificate is verified.`);
                    }}
                    className="px-4 py-2 bg-[#1F140E] hover:bg-[#2A1D16] text-[#D4AF37] border border-[#D4AF37] rounded-xl text-xs font-mono font-bold uppercase tracking-wider cursor-pointer"
                  >
                    Affirm &amp; Sign Covenant
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CHIP IN TO VILLAGE SKILL POT                                       */}
      {/* ========================================================================= */}
      {pledgingPot && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border-2 border-[#D4AF37] max-w-md w-full p-6 shadow-2xl space-y-5 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-copper-penny/15">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#B87333] font-bold">
                  Crowdfund Masterclass
                </span>
                <h3 className="font-serif text-lg font-bold text-[#1F1813]">
                  Chip into Skill Pot
                </h3>
              </div>
              <button
                onClick={() => setPledgingPot(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center cursor-pointer text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 bg-[#FAF5EE] rounded-2xl border border-copper-penny/15 space-y-1">
              <h4 className="font-serif text-sm font-bold text-[#1F1813]">{pledgingPot.title}</h4>
              <p className="text-[11px] text-[#1F1813]/70 font-mono">
                Current: ${pledgingPot.currentRaised} / Goal: ${pledgingPot.goalAmount}
              </p>
            </div>

            <form onSubmit={handlePledgeToPot} className="space-y-4">
              <label className="text-[10px] font-mono uppercase tracking-wider font-extrabold text-[#B87333] block">
                Select Pledge Amount
              </label>

              <div className="grid grid-cols-4 gap-2">
                {[5, 10, 25, 50].map(amt => (
                  <button
                    type="button"
                    key={amt}
                    onClick={() => setPledgeAmount(amt)}
                    className={`py-2 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                      pledgeAmount === amt
                        ? 'bg-[#1F140E] text-[#D4AF37] border-[#D4AF37]'
                        : 'bg-white text-[#1F1813] border-copper-penny/25 hover:bg-[#FAF5EE]'
                    }`}
                  >
                    ${amt}
                  </button>
                ))}
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-mono text-[#1F1813]/80">Or enter custom amount ($):</span>
                <input
                  type="number"
                  min={pledgingPot.minimumPledge}
                  value={pledgeAmount}
                  onChange={(e) => setPledgeAmount(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-[#FAF5EE] border border-copper-penny/25 rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-[#1F1813] focus:outline-none"
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-900">
                💳 Simulated Stripe Checkout: Upon funding 100%, you receive lifetime access and recordings.
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#1F140E] hover:bg-[#2A1D16] text-[#D4AF37] border-2 border-[#D4AF37] rounded-xl text-xs font-mono font-bold uppercase tracking-wider shadow-lg cursor-pointer"
              >
                Confirm ${pledgeAmount} Pledge via Stripe
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: PROPOSE A NEW SKILL POT                                            */}
      {/* ========================================================================= */}
      {isProposePotOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border-2 border-[#D4AF37] max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-copper-penny/15">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#B87333] font-bold">
                  Village Crowdfunding
                </span>
                <h3 className="font-serif text-lg font-bold text-[#1F1813]">
                  Propose a Community Skill Pot
                </h3>
              </div>
              <button
                onClick={() => setIsProposePotOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center cursor-pointer text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleProposePot} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-mono uppercase font-bold text-[#B87333] text-[10px]">Masterclass Title</label>
                <input
                  type="text"
                  required
                  value={newPotForm.title}
                  onChange={(e) => setNewPotForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Solar Food Dehydration & Jerky Preserving Lab"
                  className="w-full bg-[#FAF5EE] border border-copper-penny/25 rounded-xl px-3 py-2 text-xs text-[#1F1813] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-mono uppercase font-bold text-[#B87333] text-[10px]">Instructor Name</label>
                  <input
                    type="text"
                    required
                    value={newPotForm.instructor}
                    onChange={(e) => setNewPotForm(prev => ({ ...prev, instructor: e.target.value }))}
                    placeholder="e.g. Sister Nia Jackson"
                    className="w-full bg-[#FAF5EE] border border-copper-penny/25 rounded-xl px-3 py-2 text-xs text-[#1F1813] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono uppercase font-bold text-[#B87333] text-[10px]">Funding Goal ($)</label>
                  <input
                    type="number"
                    required
                    value={newPotForm.goalAmount}
                    onChange={(e) => setNewPotForm(prev => ({ ...prev, goalAmount: Number(e.target.value) }))}
                    placeholder="500"
                    className="w-full bg-[#FAF5EE] border border-copper-penny/25 rounded-xl px-3 py-2 text-xs text-[#1F1813] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-mono uppercase font-bold text-[#B87333] text-[10px]">Instructor Role / Background</label>
                <input
                  type="text"
                  required
                  value={newPotForm.instructorRole}
                  onChange={(e) => setNewPotForm(prev => ({ ...prev, instructorRole: e.target.value }))}
                  placeholder="e.g. Master Food Preserver • Georgia Circle"
                  className="w-full bg-[#FAF5EE] border border-copper-penny/25 rounded-xl px-3 py-2 text-xs text-[#1F1813] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono uppercase font-bold text-[#B87333] text-[10px]">Category</label>
                <select
                  value={newPotForm.category}
                  onChange={(e) => setNewPotForm(prev => ({ ...prev, category: e.target.value as any }))}
                  className="w-full bg-[#FAF5EE] border border-copper-penny/25 rounded-xl px-3 py-2 text-xs text-[#1F1813] focus:outline-none"
                >
                  <option value="Homestead & Land">Homestead &amp; Land</option>
                  <option value="Wealth & Estate Trusts">Wealth &amp; Estate Trusts</option>
                  <option value="Herbalism & Doula">Herbalism &amp; Doula</option>
                  <option value="Homeschool Mastery">Homeschool Mastery</option>
                  <option value="Sovereign Tech & AI">Sovereign Tech &amp; AI</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-mono uppercase font-bold text-[#B87333] text-[10px]">Description</label>
                <textarea
                  rows={2}
                  required
                  value={newPotForm.description}
                  onChange={(e) => setNewPotForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Explain what sisters will learn and why this masterclass is vital..."
                  className="w-full bg-[#FAF5EE] border border-copper-penny/25 rounded-xl px-3 py-2 text-xs text-[#1F1813] focus:outline-none resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono uppercase font-bold text-[#B87333] text-[10px]">Curriculum Highlights (1 per line)</label>
                <textarea
                  rows={2}
                  value={newPotForm.highlights}
                  onChange={(e) => setNewPotForm(prev => ({ ...prev, highlights: e.target.value }))}
                  placeholder="Drafting solar plans&#10;Food safety temperatures&#10;Long-term vacuum storage"
                  className="w-full bg-[#FAF5EE] border border-copper-penny/25 rounded-xl px-3 py-2 text-xs text-[#1F1813] focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#B87333] hover:bg-[#A85138] text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider cursor-pointer shadow-md transition-all"
              >
                Publish Village Skill Pot for Backing
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: PURCHASE EXTERNAL VENDOR SPOTLIGHT                                 */}
      {/* ========================================================================= */}
      {isVendorModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border-2 border-[#0047AB] max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-copper-penny/15">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#0047AB] font-bold">
                  Stripe Commercial Rails
                </span>
                <h3 className="font-serif text-lg font-bold text-[#1F1813]">
                  External Vendor Spotlight Onboarding
                </h3>
              </div>
              <button
                onClick={() => setIsVendorModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center cursor-pointer text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateVendorSpotlight} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-mono uppercase font-bold text-[#0047AB] text-[10px]">Business Name</label>
                  <input
                    type="text"
                    required
                    value={vendorForm.businessName}
                    onChange={(e) => setVendorForm(prev => ({ ...prev, businessName: e.target.value }))}
                    placeholder="e.g. Appalachian Heritage Seeds Co."
                    className="w-full bg-[#FAF5EE] border border-copper-penny/25 rounded-xl px-3 py-2 text-xs text-[#1F1813] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono uppercase font-bold text-[#0047AB] text-[10px]">Select Plan &amp; Rate</label>
                  <select
                    value={vendorForm.plan}
                    onChange={(e) => setVendorForm(prev => ({ ...prev, plan: e.target.value as any }))}
                    className="w-full bg-[#FAF5EE] border border-copper-penny/25 rounded-xl px-3 py-2 text-xs text-[#1F1813] focus:outline-none"
                  >
                    <option value="quarterly">$60 / Quarter (Recommended • Save $15)</option>
                    <option value="monthly">$25 / Month</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-mono uppercase font-bold text-[#0047AB] text-[10px]">Target Spotlight Hub</label>
                  <select
                    value={vendorForm.targetHub}
                    onChange={(e) => setVendorForm(prev => ({ ...prev, targetHub: e.target.value as any }))}
                    className="w-full bg-[#FAF5EE] border border-copper-penny/25 rounded-xl px-3 py-2 text-xs text-[#1F1813] focus:outline-none"
                  >
                    <option value="all">Universal All Hubs</option>
                    <option value="village">Village Co-Care Hub</option>
                    <option value="healing">Earth &amp; Healing (Apothecary) Hub</option>
                    <option value="commerce">Enterprise &amp; Commerce Hub</option>
                    <option value="economy">Barter &amp; Exchange Hub</option>
                    <option value="gathering">The Copper Circle Hub</option>
                    <option value="kinship">Kinship Vault</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-mono uppercase font-bold text-[#0047AB] text-[10px]">Promo Code (Optional)</label>
                  <input
                    type="text"
                    value={vendorForm.promoCode}
                    onChange={(e) => setVendorForm(prev => ({ ...prev, promoCode: e.target.value }))}
                    placeholder="e.g. COPPER15"
                    className="w-full bg-[#FAF5EE] border border-copper-penny/25 rounded-xl px-3 py-2 text-xs text-[#1F1813] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-mono uppercase font-bold text-[#0047AB] text-[10px]">Banner Headline</label>
                <input
                  type="text"
                  required
                  value={vendorForm.headline}
                  onChange={(e) => setVendorForm(prev => ({ ...prev, headline: e.target.value }))}
                  placeholder="e.g. Certified Organic Non-GMO Heirloom Seed Potatoes &amp; Onions"
                  className="w-full bg-[#FAF5EE] border border-copper-penny/25 rounded-xl px-3 py-2 text-xs text-[#1F1813] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono uppercase font-bold text-[#0047AB] text-[10px]">Description</label>
                <textarea
                  rows={2}
                  required
                  value={vendorForm.description}
                  onChange={(e) => setVendorForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your offerings and special discounts for verified sisters..."
                  className="w-full bg-[#FAF5EE] border border-copper-penny/25 rounded-xl px-3 py-2 text-xs text-[#1F1813] focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-mono uppercase font-bold text-[#0047AB] text-[10px]">Website URL</label>
                  <input
                    type="url"
                    required
                    value={vendorForm.ctaUrl}
                    onChange={(e) => setVendorForm(prev => ({ ...prev, ctaUrl: e.target.value }))}
                    placeholder="https://..."
                    className="w-full bg-[#FAF5EE] border border-copper-penny/25 rounded-xl px-3 py-2 text-xs text-[#1F1813] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono uppercase font-bold text-[#0047AB] text-[10px]">Contact Email</label>
                  <input
                    type="email"
                    required
                    value={vendorForm.contactEmail}
                    onChange={(e) => setVendorForm(prev => ({ ...prev, contactEmail: e.target.value }))}
                    placeholder="partner@yourbrand.com"
                    className="w-full bg-[#FAF5EE] border border-copper-penny/25 rounded-xl px-3 py-2 text-xs text-[#1F1813] focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-[11px] text-blue-900 flex items-center justify-between">
                <span>Total Amount: <strong>${vendorForm.plan === 'monthly' ? 25 : 50}</strong></span>
                <span className="font-mono text-[10px]">Stripe Processing Secure</span>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#0047AB] hover:bg-blue-800 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider cursor-pointer shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <CreditCard className="w-4 h-4 text-[#00EEEE]" />
                <span>Process Stripe Payment (${vendorForm.plan === 'monthly' ? 25 : 50}) &amp; Publish</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: POST $5 JOB / $10 LAND MICROPAYMENT LISTING                        */}
      {/* ========================================================================= */}
      {isMicroModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border-2 border-copper-penny/35 max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-copper-penny/15">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 font-bold">
                  Copper Mommies Classifieds Engine
                </span>
                <h3 className="font-serif text-lg font-bold text-[#1F1813]">
                  {microType === 'job_listing' ? 'Post $5 Job / Gig Listing' : 'Post $10 Land / Acreage Classified'}
                </h3>
              </div>
              <button
                onClick={() => setIsMicroModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center cursor-pointer text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateMicropayment} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-mono uppercase font-bold text-[#B87333] text-[10px]">Listing Title</label>
                <input
                  type="text"
                  required
                  value={microForm.title}
                  onChange={(e) => setMicroForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder={microType === 'job_listing' ? "e.g. Part-Time Homeschool Nanny & Nature Guide" : "e.g. 5 Clear Acres & Barn for Co-op Homesteading"}
                  className="w-full bg-[#FAF5EE] border border-copper-penny/25 rounded-xl px-3 py-2 text-xs text-[#1F1813] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-mono uppercase font-bold text-[#B87333] text-[10px]">City / County</label>
                  <input
                    type="text"
                    required
                    value={microForm.city}
                    onChange={(e) => setMicroForm(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="e.g. McDonough / Henry County"
                    className="w-full bg-[#FAF5EE] border border-copper-penny/25 rounded-xl px-3 py-2 text-xs text-[#1F1813] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono uppercase font-bold text-[#B87333] text-[10px]">State Circle</label>
                  <input
                    type="text"
                    required
                    value={microForm.locationState}
                    onChange={(e) => setMicroForm(prev => ({ ...prev, locationState: e.target.value }))}
                    placeholder="GA"
                    className="w-full bg-[#FAF5EE] border border-copper-penny/25 rounded-xl px-3 py-2 text-xs text-[#1F1813] focus:outline-none font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-mono uppercase font-bold text-[#B87333] text-[10px]">
                    {microType === 'job_listing' ? 'Pay Rate / Terms' : 'Monthly Rate / Lease Terms'}
                  </label>
                  <input
                    type="text"
                    required
                    value={microForm.compensationOrPrice}
                    onChange={(e) => setMicroForm(prev => ({ ...prev, compensationOrPrice: e.target.value }))}
                    placeholder={microType === 'job_listing' ? "$25/hr or Barter" : "$500/mo or Farm Share"}
                    className="w-full bg-[#FAF5EE] border border-copper-penny/25 rounded-xl px-3 py-2 text-xs text-[#1F1813] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono uppercase font-bold text-[#B87333] text-[10px]">
                    {microType === 'job_listing' ? 'Hours / Rhythm' : 'Acreage / Infrastructure'}
                  </label>
                  <input
                    type="text"
                    value={microForm.acreageOrHours}
                    onChange={(e) => setMicroForm(prev => ({ ...prev, acreageOrHours: e.target.value }))}
                    placeholder={microType === 'job_listing' ? "20 hrs/wk" : "4.5 Acres • Deep Well"}
                    className="w-full bg-[#FAF5EE] border border-copper-penny/25 rounded-xl px-3 py-2 text-xs text-[#1F1813] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-mono uppercase font-bold text-[#B87333] text-[10px]">Description &amp; Specifics</label>
                <textarea
                  rows={3}
                  required
                  value={microForm.description}
                  onChange={(e) => setMicroForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Provide all essential details for interested sisters..."
                  className="w-full bg-[#FAF5EE] border border-copper-penny/25 rounded-xl px-3 py-2 text-xs text-[#1F1813] focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-mono uppercase font-bold text-[#B87333] text-[10px]">Contact Email</label>
                  <input
                    type="email"
                    required
                    value={microForm.contactEmail}
                    onChange={(e) => setMicroForm(prev => ({ ...prev, contactEmail: e.target.value }))}
                    className="w-full bg-[#FAF5EE] border border-copper-penny/25 rounded-xl px-3 py-2 text-xs text-[#1F1813] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono uppercase font-bold text-[#B87333] text-[10px]">Phone (Optional)</label>
                  <input
                    type="text"
                    value={microForm.phone}
                    onChange={(e) => setMicroForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="(404) 555-..."
                    className="w-full bg-[#FAF5EE] border border-copper-penny/25 rounded-xl px-3 py-2 text-xs text-[#1F1813] focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 flex items-center justify-between">
                <span>One-Time Fee: <strong>${microType === 'job_listing' ? 5 : 10}</strong></span>
                <span className="font-mono text-[10px]">Stripe Processing Active</span>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#1F140E] hover:bg-[#2A1D16] text-[#D4AF37] border-2 border-[#D4AF37] rounded-xl text-xs font-mono font-bold uppercase tracking-wider cursor-pointer shadow-md transition-all"
              >
                Pay ${microType === 'job_listing' ? 5 : 10} via Stripe &amp; Publish Classified
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: TEA RECEIPT 508(c)(1)(a) CONFIRMATION                              */}
      {/* ========================================================================= */}
      {teaSuccessReceipt && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border-2 border-[#D4AF37] max-w-md w-full p-6 shadow-2xl space-y-4 text-center animate-scale-in">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 border-2 border-emerald-400 flex items-center justify-center text-3xl">
              🍵
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#B87333] font-bold">
                Title 26 U.S.C. § 508(c)(1)(a) Love Gift Receipt
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#1F1813]">
                Thank You, Sister!
              </h3>
              <p className="text-xs text-[#1F1813]/80">
                Your love gift of <strong>${teaSuccessReceipt.amount}</strong> ({teaSuccessReceipt.tier}) has been received into the Sovereign Treasury.
              </p>
            </div>

            <div className="p-4 bg-[#FAF5EE] rounded-2xl border border-copper-penny/20 text-left font-mono text-xs space-y-1.5 text-[#1F1813]/85">
              <div><strong>Donor:</strong> {teaSuccessReceipt.donorName}</div>
              <div><strong>Rail:</strong> {teaSuccessReceipt.paymentMethod}</div>
              <div><strong>Reference:</strong> {teaSuccessReceipt.transactionRef}</div>
              <div><strong>Exempt Status:</strong> IRC § 508(c)(1)(a) Mandatory Tax-Exempt Sanctuary</div>
              <div><strong>Date:</strong> {teaSuccessReceipt.date}</div>
            </div>

            <button
              onClick={() => setTeaSuccessReceipt(null)}
              className="w-full py-2.5 bg-[#1F140E] text-[#D4AF37] border border-[#D4AF37] rounded-xl text-xs font-mono font-bold uppercase tracking-wider cursor-pointer"
            >
              Close &amp; Return to Sanctuary
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
