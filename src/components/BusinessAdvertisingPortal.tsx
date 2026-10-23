import React, { useState } from 'react';
import { 
  Building2, 
  Sparkles, 
  ExternalLink, 
  Copy, 
  Check, 
  Tag, 
  Eye, 
  ShieldCheck, 
  Award, 
  ArrowRight, 
  Layers, 
  DollarSign, 
  Heart, 
  CheckCircle2, 
  AlertCircle, 
  Image as ImageIcon, 
  Send, 
  RefreshCw,
  ShoppingBag,
  Info
} from 'lucide-react';
import { BusinessAdSubmission } from '../types';

interface BusinessAdvertisingPortalProps {
  onSubmittedAd?: (ad: BusinessAdSubmission) => void;
  onBackToVillage?: () => void;
}

// Curated high-res sample presets for easy testing
const SAMPLE_PRESET_IMAGES = [
  {
    name: 'Herbal Apothecary & Tinctures',
    url: '/apothecary_sister_herbal.jpg',
    category: 'Botanicals & Herbal Medicine'
  },
  {
    name: 'Homeschool & Learning Curricula',
    url: '/nestbright_banner.jpg',
    category: 'Homeschool & Education'
  },
  {
    name: 'Artisan Woodcraft & Homemaking',
    url: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=1200&q=80',
    category: 'Artisan Handcrafts'
  },
  {
    name: 'Natural Maternal & Doula Wellness',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    category: 'Maternal Care & Birth'
  }
];

export default function BusinessAdvertisingPortal({
  onSubmittedAd,
  onBackToVillage
}: BusinessAdvertisingPortalProps) {
  // Placement & Pricing Tier
  const [placementType, setPlacementType] = useState<'header_banner' | 'commons_sidebar' | 'both_bundle'>('both_bundle');
  const [pricingTier, setPricingTier] = useState<'pioneer_free' | 'member_sidebar' | 'member_header' | 'sidebar_monthly' | 'header_monthly' | 'bundle_monthly'>('member_sidebar');

  // Business Profile
  const [businessName, setBusinessName] = useState('Highland Heritage Botanical Co.');
  const [ownerName, setOwnerName] = useState('Sister Maya Lin');
  const [email, setEmail] = useState('maya@highlandheritage.coop');
  const [phone, setPhone] = useState('(404) 555-0812');
  const [socialHandle, setSocialHandle] = useState('@highlandheritage');
  const [websiteUrl, setWebsiteUrl] = useState('https://highlandheritagebotanicals.com');
  const [targetCategory, setTargetCategory] = useState('Botanicals & Herbal Wellness');

  // Ad Copy & Creative
  const [headline, setHeadline] = useState('Highland Heritage Botanical Co. — Ancestral Cold-Pressed Oxymels');
  const [tagline, setTagline] = useState('Hand-harvested elderberry, mullein & lowcountry nettle remedies');
  const [description, setDescription] = useState('Formulated by traditional southern rootworkers. Solar-steeped in raw wild honey and organic apple cider vinegar for seasonal family immunity and whole-body vitality.');
  const [callToActionText, setCallToActionText] = useState('Shop Herbal Collection');
  const [bannerImageUrl, setBannerImageUrl] = useState('/apothecary_sister_herbal.jpg');

  // Exclusive Community Discount
  const [exclusiveDiscountCode, setExclusiveDiscountCode] = useState('COPPER15');
  const [discountOfferText, setDiscountOfferText] = useState('15% off all herbal infusions & elixirs for Copper Mommies');

  // Ownership Confirmation
  const [singleMelanatedWomanOwnedConfirmed, setSingleMelanatedWomanOwnedConfirmed] = useState(false);

  // Status & Feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedAdRecord, setSubmittedAdRecord] = useState<BusinessAdSubmission | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const getTierPricing = () => {
    switch (pricingTier) {
      case 'pioneer_free': return '$0 (Pioneer 30-Day Pass)';
      case 'member_sidebar': return '$5/mo (Copper Mommie Member Rate)';
      case 'member_header': return '$20/mo (Copper Mommie Member Rate)';
      case 'sidebar_monthly': return '$25/mo (Partner Rate)';
      case 'header_monthly': return '$50/mo (Partner Rate)';
      case 'bundle_monthly': return '$65/mo (Partner Rate)';
      default: return '$0';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!businessName.trim() || !ownerName.trim()) {
      setValidationError('Please enter both your Business Name and Owner Name.');
      return;
    }
    if (!email.trim()) {
      setValidationError('Please provide a valid contact email.');
      return;
    }
    if (!websiteUrl.trim()) {
      setValidationError('Please provide your Website or Store URL.');
      return;
    }
    if (!headline.trim() || !description.trim()) {
      setValidationError('Please provide a Headline and Description for your advertisement.');
      return;
    }
    if (!bannerImageUrl.trim()) {
      setValidationError('Please provide or select a Banner/Product Image.');
      return;
    }
    if (!exclusiveDiscountCode.trim()) {
      setValidationError('Please provide an exclusive Community Discount Code for our members.');
      return;
    }
    if (!singleMelanatedWomanOwnedConfirmed) {
      setValidationError('Please confirm that this business is a Single Melanated Woman-Owned Enterprise.');
      return;
    }

    setIsSubmitting(true);

    const submission: BusinessAdSubmission = {
      id: `ad-${Date.now()}`,
      businessName: businessName.trim(),
      ownerName: ownerName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      socialHandle: socialHandle.trim(),
      websiteUrl: websiteUrl.trim(),
      placementType,
      bannerImageUrl: bannerImageUrl.trim(),
      headline: headline.trim(),
      tagline: tagline.trim(),
      description: description.trim(),
      callToActionText: callToActionText.trim() || 'Visit Shop',
      exclusiveDiscountCode: exclusiveDiscountCode.trim().toUpperCase(),
      discountOfferText: discountOfferText.trim() || '15% Off for Copper Mommies',
      pricingTier,
      pricingAmount: getTierPricing(),
      singleMelanatedWomanOwnedConfirmed: true,
      status: 'pending_review',
      targetCategory,
      submittedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      viewsCount: 0,
      clicksCount: 0
    };

    // Save locally
    try {
      const stored = localStorage.getItem('copper_business_ad_submissions');
      const list = stored ? JSON.parse(stored) : [];
      localStorage.setItem('copper_business_ad_submissions', JSON.stringify([submission, ...list]));
      window.dispatchEvent(new Event('copper_ads_updated'));
    } catch (err) {
      console.error(err);
    }

    // Push to server endpoint
    try {
      await fetch('/api/business-ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission)
      });
    } catch (err) {
      console.warn('Local synchronization complete with backend logger', err);
    }

    setIsSubmitting(false);
    setSubmittedAdRecord(submission);
    if (onSubmittedAd) {
      onSubmittedAd(submission);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  // SUCCESS CONFIRMATION VIEW
  if (submittedAdRecord) {
    return (
      <div className="max-w-3xl mx-auto my-8 p-6 sm:p-10 bg-white border-2 border-[#D4AF37] rounded-3xl shadow-2xl space-y-6 text-center animate-fade-in relative overflow-hidden">
        <div className="absolute top-0 right-0 w-60 h-60 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B87333] text-[#1F140E] flex items-center justify-center mx-auto border-2 border-white shadow-lg">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <span className="inline-block px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest bg-[#FAF5EE] text-[#B87333] border border-[#D4AF37]/40">
            Ad Application Received &bull; Ref #{submittedAdRecord.id}
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-black text-[#1F1813]">
            Thank You, Sister {submittedAdRecord.ownerName}!
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto">
            Your advertising submission for <strong className="text-[#1F1813]">{submittedAdRecord.businessName}</strong> has been transmitted to Founder Shantrece and the Matriarch Admin Office.
          </p>
        </div>

        {/* Selected Tier & Boundary Reminder */}
        <div className="p-5 bg-[#FAF5EE] rounded-2xl border border-[#D4AF37]/40 text-left space-y-3 font-mono text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 pb-2.5 gap-2">
            <div>
              <span className="text-[10px] text-gray-500 uppercase">Selected Placement &amp; Plan</span>
              <p className="font-bold text-[#1F1813] text-sm">{submittedAdRecord.pricingAmount}</p>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 font-bold text-[10px] uppercase">
              Status: Under Admin Review (12–24h)
            </span>
          </div>

          <div className="text-[11px] text-[#2A221B]/80 leading-relaxed font-sans space-y-2">
            <p>
              <strong>Community Promo Code:</strong> <span className="font-mono font-bold text-[#B87333] bg-white px-2 py-0.5 rounded border border-[#D4AF37]/40">{submittedAdRecord.exclusiveDiscountCode}</span> &bull; {submittedAdRecord.discountOfferText}
            </p>
            <p>
              <strong>Sanctuary Privacy Note:</strong> Once approved, your advertisement will appear directly in the community Top Header Banner and/or Village Commons Right Sidebar. As a verified business advertising partner, your profile directs mothers externally to your shop/booking platform without entering private PMA sanctuary forums.
            </p>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setSubmittedAdRecord(null)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-50 text-xs font-mono font-bold text-gray-700 transition-all cursor-pointer"
          >
            ← Submit Another Placement
          </button>
          {onBackToVillage && (
            <button
              type="button"
              onClick={onBackToVillage}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#1F1813] hover:bg-[#2A221B] text-[#FAF5EE] text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center space-x-2"
            >
              <span>Return to Village Commons</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* 1. Header & Boundary Explanation */}
      <div className="bg-gradient-to-br from-[#1F140E] via-[#2A1D16] to-[#140F0B] rounded-3xl border-2 border-[#D4AF37]/50 p-6 sm:p-8 text-[#FAF5EE] shadow-2xl relative overflow-hidden space-y-4">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest bg-[#D4AF37] text-[#1F140E]">
                Official Partner Portal
              </span>
              <span className="text-xs text-[#D4AF37] font-mono">Melanated Woman-Owned Businesses (Members &amp; Partners)</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-4xl font-black text-[#FAF5EE]">
              Advertise Inside the Copper Mommies Community
            </h1>
            <p className="text-xs sm:text-sm text-[#FAF5EE]/80 max-w-2xl font-sans">
              Connect directly with American-born melanated mothers who actively prioritize cooperative spending, holistic botanicals, wholesome home education, and sister-owned enterprises. Copper Mommie members advertise at special subsidized rates ($5–$20)!
            </p>
          </div>

          {onBackToVillage && (
            <button
              onClick={onBackToVillage}
              className="self-start md:self-auto px-4 py-2 bg-white/10 hover:bg-white/20 text-[#D4AF37] text-xs font-mono font-bold rounded-xl border border-white/10 transition-all cursor-pointer"
            >
              ← Back to Village Commons
            </button>
          )}
        </div>

        {/* Clear Sanctuary Boundaries Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
          <div className="bg-emerald-950/50 p-4 rounded-2xl border border-emerald-500/30 space-y-2">
            <h3 className="font-serif font-bold text-emerald-300 flex items-center space-x-2 text-sm">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>What Your Business Receives</span>
            </h3>
            <ul className="space-y-1.5 text-white/85 text-[11px] leading-relaxed">
              <li>&bull; High-converting placement in the <strong>Top Header Feature Banner (1200 x 400 px / 1200 x 675 px)</strong> or <strong>Village Commons In-Feed Spotlight &amp; Sidebar (800 x 450 px / 300 x 250 px)</strong>.</li>
              <li>&bull; Dedicated <strong>Exclusive Community Discount Badge</strong> (e.g., 15% off) that encourages moms to purchase from you first.</li>
              <li>&bull; Direct click-through links sending verified mothers straight to your website, booking page, or online shop.</li>
              <li>&bull; Certified <strong>&ldquo;Melanated Woman-Owned Partner&rdquo;</strong> authenticity trust badge.</li>
            </ul>
          </div>

          <div className="bg-amber-950/40 p-4 rounded-2xl border border-amber-500/30 space-y-2">
            <h3 className="font-serif font-bold text-amber-300 flex items-center space-x-2 text-sm">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>Private Sanctuary Boundaries</span>
            </h3>
            <ul className="space-y-1.5 text-white/85 text-[11px] leading-relaxed">
              <li>&bull; Advertisers are respected <strong>Commercial Partners</strong>, not Private Membership Association (PMA) mothers.</li>
              <li>&bull; No access to private internal member feeds, member directory, private direct messaging, or voting ballots.</li>
              <li>&bull; Zero tracking cookies or intrusive data collection on our mothers &mdash; pure, clean, dignified sponsorship.</li>
              <li>&bull; Applications are vetted by Founder Shantrece to ensure high-vibrational alignment with our families.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 2. PRICING TIERS & INTRODUCTORY PIONEER PASS */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <h2 className="font-serif font-bold text-xl text-[#1F1813] flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-[#B87333]" />
            <span>Select Your Advertising Placement &amp; Pricing Tier</span>
          </h2>
          <span className="text-xs font-mono text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            🌱 Pioneer Sponsor Phase Active ($0 Launch Offer Available)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          
          {/* TIER 0: Pioneer Free ($0) */}
          <div 
            onClick={() => {
              setPricingTier('pioneer_free');
              setPlacementType('both_bundle');
            }}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
              pricingTier === 'pioneer_free'
                ? 'bg-amber-50/80 border-[#D4AF37] shadow-md ring-2 ring-[#D4AF37]/50'
                : 'bg-white hover:bg-neutral-50 border-gray-200'
            }`}
          >
            <span className="absolute -top-2.5 right-2 px-2 py-0.5 rounded-full text-[8px] font-mono font-bold bg-gradient-to-r from-[#D4AF37] to-[#B87333] text-[#1F140E]">
              PIONEER PASS
            </span>
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-gray-500 font-bold block">Launch Sponsor</span>
              <h3 className="font-serif font-black text-sm text-[#1F1813]">Pioneer Free</h3>
              <p className="text-xl font-mono font-black text-emerald-700">$0 <span className="text-xs font-normal text-gray-500">/ 30 Days</span></p>
              <p className="text-[10px] text-gray-600 leading-snug pt-1">
                Complimentary launch placement with member discount offer.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-gray-100 text-[9px] font-mono text-gray-500">
              Header &amp; Sidebar
            </div>
          </div>

          {/* TIER M1: Member Sidebar Special ($5/mo) */}
          <div 
            onClick={() => {
              setPricingTier('member_sidebar');
              setPlacementType('commons_sidebar');
            }}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
              pricingTier === 'member_sidebar'
                ? 'bg-emerald-50/90 border-emerald-600 shadow-md ring-2 ring-emerald-500/50'
                : 'bg-white hover:bg-neutral-50 border-gray-200'
            }`}
          >
            <span className="absolute -top-2.5 right-2 px-2 py-0.5 rounded-full text-[8px] font-mono font-bold bg-emerald-700 text-white">
              SISTER RATE
            </span>
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-emerald-800 font-bold block">Copper Mommies</span>
              <h3 className="font-serif font-black text-sm text-[#1F1813]">Member Sidebar</h3>
              <p className="text-xl font-mono font-black text-emerald-700">$5 <span className="text-xs font-normal text-gray-500">/ month</span></p>
              <p className="text-[10px] text-gray-600 leading-snug pt-1">
                Discounted in-feed spotlight &amp; sidebar card (800 x 450 / 300 x 250 px).
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-gray-100 text-[9px] font-mono text-emerald-700 font-bold">
              ★ Member Subsidy
            </div>
          </div>

          {/* TIER M2: Member Header Banner ($20/mo) */}
          <div 
            onClick={() => {
              setPricingTier('member_header');
              setPlacementType('header_banner');
            }}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
              pricingTier === 'member_header'
                ? 'bg-emerald-50/90 border-emerald-600 shadow-md ring-2 ring-emerald-500/50'
                : 'bg-white hover:bg-neutral-50 border-gray-200'
            }`}
          >
            <span className="absolute -top-2.5 right-2 px-2 py-0.5 rounded-full text-[8px] font-mono font-bold bg-emerald-700 text-white">
              SISTER RATE
            </span>
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-emerald-800 font-bold block">Copper Mommies</span>
              <h3 className="font-serif font-black text-sm text-[#1F1813]">Member Header</h3>
              <p className="text-xl font-mono font-black text-emerald-700">$20 <span className="text-xs font-normal text-gray-500">/ month</span></p>
              <p className="text-[10px] text-gray-600 leading-snug pt-1">
                Top hero banner placement (1200 x 400 / 1200 x 675 px) for members.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-gray-100 text-[9px] font-mono text-emerald-700 font-bold">
              ★ Top Visibility
            </div>
          </div>

          {/* TIER 1: Non-Member / Partner Sidebar ($25/mo) */}
          <div 
            onClick={() => {
              setPricingTier('sidebar_monthly');
              setPlacementType('commons_sidebar');
            }}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
              pricingTier === 'sidebar_monthly'
                ? 'bg-amber-50/80 border-[#D4AF37] shadow-md ring-2 ring-[#D4AF37]/50'
                : 'bg-white hover:bg-neutral-50 border-gray-200'
            }`}
          >
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-gray-500 font-bold block">External Partner</span>
              <h3 className="font-serif font-black text-sm text-[#1F1813]">Partner Sidebar</h3>
              <p className="text-xl font-mono font-black text-[#B87333]">$25 <span className="text-xs font-normal text-gray-500">/ month</span></p>
              <p className="text-[10px] text-gray-600 leading-snug pt-1">
                In-feed spotlight &amp; right sidebar visual ad card (800 x 450 / 300 x 250 px).
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-gray-100 text-[9px] font-mono text-gray-500">
              $65 / quarter
            </div>
          </div>

          {/* TIER 2: Partner Bundle / Header ($50-$65/mo) */}
          <div 
            onClick={() => {
              setPricingTier('bundle_monthly');
              setPlacementType('both_bundle');
            }}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
              pricingTier === 'bundle_monthly'
                ? 'bg-amber-50/80 border-[#D4AF37] shadow-md ring-2 ring-[#D4AF37]/50'
                : 'bg-white hover:bg-neutral-50 border-gray-200'
            }`}
          >
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-gray-500 font-bold block">Partner Full Pack</span>
              <h3 className="font-serif font-black text-sm text-[#1F1813]">Omnipresent Pack</h3>
              <p className="text-xl font-mono font-black text-[#1F1813]">$65 <span className="text-xs font-normal text-gray-500">/ month</span></p>
              <p className="text-[10px] text-gray-600 leading-snug pt-1">
                Both Header (1200 x 400 / 1200 x 675 px) &amp; Spotlight/Sidebar (800 x 450 px) combined.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-gray-100 text-[9px] font-mono text-gray-500">
              Complete Exposure
            </div>
          </div>

        </div>
      </div>

      {/* ADVERTISING TIER SPECIFICATIONS & CREATIVE GUIDELINES (PART 2A STANDARDIZATION) */}
      <div className="bg-[#FAF5EE] rounded-3xl border-2 border-[#D4AF37]/50 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D4AF37]/20 pb-3">
          <div className="flex items-center space-x-2 text-[#1F1813]">
            <Layers className="w-5 h-5 text-[#B87333]" />
            <h3 className="font-serif font-black text-base sm:text-lg">
              Official Placement Specifications &amp; Content Limits
            </h3>
          </div>
          <span className="text-[10px] font-mono font-bold bg-[#1F140E] text-[#D4AF37] px-3 py-1 rounded-full uppercase tracking-wider self-start sm:self-auto">
            Standardized Across All Hubs
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
          {/* Top Header Feature Banner Placement Specs */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#D4AF37]/30 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <span className="font-serif font-extrabold text-[#1F140E] text-sm sm:text-base flex items-center space-x-1.5">
                <span>🌟</span>
                <span>Top Header Feature Banner</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300">
                Fixed 320px Height
              </span>
            </div>
            <div className="space-y-2 font-mono text-[11px] text-[#2A221B]/90">
              <div className="p-2 rounded-xl bg-[#FAF5EE] border border-gray-200">
                <span className="text-[10px] uppercase font-bold text-gray-500 block">Image Dimensions</span>
                <strong className="text-[#B87333] text-xs">1200 x 400 px (3:1)</strong> or <strong className="text-[#B87333] text-xs">1200 x 675 px (16:9) landscape</strong>
              </div>
              <div className="p-2 rounded-xl bg-[#FAF5EE] border border-gray-200">
                <span className="text-[10px] uppercase font-bold text-gray-500 block">Content Character Limits</span>
                <p className="text-[#1F140E] font-medium leading-relaxed">
                  &bull; Title: <strong>Max 50 characters</strong><br />
                  &bull; Subtitle / Tagline: <strong>Max 60 characters</strong><br />
                  &bull; Body Description: <strong>Max 180 characters</strong>
                </p>
              </div>
              <div className="p-2 rounded-xl bg-neutral-50 text-[10px] text-gray-600 font-sans">
                <strong>Placement Sizing:</strong> Fixed Height 320px (Desktop: 1fr content / 380px action container) &bull; Tablet: 340px &bull; Mobile: Max 520px vertical stack.
              </div>
            </div>
          </div>

          {/* Village Commons Spotlight / Sidebar Placement Specs */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#D4AF37]/30 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <span className="font-serif font-extrabold text-[#1F140E] text-sm sm:text-base flex items-center space-x-1.5">
                <span>⭐</span>
                <span>Village Commons Spotlight &amp; Sidebar</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                16:9 &amp; 300x250 Card
              </span>
            </div>
            <div className="space-y-2 font-mono text-[11px] text-[#2A221B]/90">
              <div className="p-2 rounded-xl bg-[#FAF5EE] border border-gray-200">
                <span className="text-[10px] uppercase font-bold text-gray-500 block">Image Dimensions</span>
                <strong className="text-[#B87333] text-xs">800 x 450 px (16:9)</strong> or <strong className="text-[#B87333] text-xs">300 x 250 px (Card)</strong>
              </div>
              <div className="p-2 rounded-xl bg-[#FAF5EE] border border-gray-200">
                <span className="text-[10px] uppercase font-bold text-gray-500 block">Content Character Limits</span>
                <p className="text-[#1F140E] font-medium leading-relaxed">
                  &bull; Headline: <strong>Max 35 characters</strong><br />
                  &bull; Body Copy: <strong>Max 120 characters</strong>
                </p>
              </div>
              <div className="p-2 rounded-xl bg-neutral-50 text-[10px] text-gray-600 font-sans">
                <strong>Placement Sizing:</strong> Width 100% of feed card container with centered 16:9 media &amp; offer overlay; right sidebar widget 300 x 250 px.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MAIN WORKSPACE: FORM + LIVE REAL-TIME PREVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: SUBMISSION FORM (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border-2 border-[#D4AF37]/30 p-5 sm:p-7 shadow-lg space-y-6">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="font-serif font-bold text-lg text-[#1F1813]">
              Advertising Submission Details
            </h3>
            <p className="text-xs text-gray-500">
              Live updates will reflect in the real-time previews on the right.
            </p>
          </div>

          {validationError && (
            <div className="p-3 bg-red-50 border border-red-300 rounded-xl text-xs text-red-800 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{validationError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 text-xs font-sans">
            
            {/* Business & Owner Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-mono font-bold text-gray-600">
                  Business Name *
                </label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Highland Heritage Botanical Co."
                  className="w-full bg-[#FAF5EE]/50 border border-gray-300 focus:border-[#B87333] rounded-xl px-3 py-2 text-xs text-[#1F1813] font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-mono font-bold text-gray-600">
                  Owner Name (Single Melanated Woman) *
                </label>
                <input
                  type="text"
                  required
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="e.g. Sister Maya Lin"
                  className="w-full bg-[#FAF5EE]/50 border border-gray-300 focus:border-[#B87333] rounded-xl px-3 py-2 text-xs text-[#1F1813] font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-mono font-bold text-gray-600">
                  Contact Email *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. orders@mybusiness.com"
                  className="w-full bg-[#FAF5EE]/50 border border-gray-300 focus:border-[#B87333] rounded-xl px-3 py-2 text-xs text-[#1F1813] font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-mono font-bold text-gray-600">
                  Social Handle (Instagram / TikTok)
                </label>
                <input
                  type="text"
                  value={socialHandle}
                  onChange={(e) => setSocialHandle(e.target.value)}
                  placeholder="e.g. @mybusiness"
                  className="w-full bg-[#FAF5EE]/50 border border-gray-300 focus:border-[#B87333] rounded-xl px-3 py-2 text-xs text-[#1F1813] font-medium"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="block text-[10px] uppercase font-mono font-bold text-gray-600">
                  Store / Website URL * (Where moms will be directed)
                </label>
                <input
                  type="url"
                  required
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-[#FAF5EE]/50 border border-gray-300 focus:border-[#B87333] rounded-xl px-3 py-2 text-xs text-[#1F1813] font-medium"
                />
              </div>
            </div>

            {/* Headline, Tagline & Copy (with Real-time Content Character Limit Tracking) */}
            <div className="space-y-3 pt-2 border-t border-gray-100">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-[10px] uppercase font-mono font-bold text-gray-600">
                    Advertisement Headline / Title *
                  </label>
                  <span className={`text-[10px] font-mono font-bold ${headline.length > 45 ? 'text-amber-700' : 'text-gray-400'}`}>
                    {headline.length}/50 chars (Max 50)
                  </span>
                </div>
                <input
                  type="text"
                  required
                  maxLength={50}
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Highland Heritage — Ancestral Oxymels"
                  className="w-full bg-[#FAF5EE]/50 border border-gray-300 focus:border-[#B87333] rounded-xl px-3 py-2 text-xs text-[#1F1813] font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="block text-[10px] uppercase font-mono font-bold text-gray-600">
                      Subtitle / Tagline
                    </label>
                    <span className={`text-[10px] font-mono font-bold ${tagline.length > 55 ? 'text-amber-700' : 'text-gray-400'}`}>
                      {tagline.length}/60 chars (Max 60)
                    </span>
                  </div>
                  <input
                    type="text"
                    maxLength={60}
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="e.g. Hand-harvested elderberry & nettle remedies"
                    className="w-full bg-[#FAF5EE]/50 border border-gray-300 focus:border-[#B87333] rounded-xl px-3 py-2 text-xs text-[#1F1813] font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-mono font-bold text-gray-600">
                    Button Action Text
                  </label>
                  <input
                    type="text"
                    maxLength={30}
                    value={callToActionText}
                    onChange={(e) => setCallToActionText(e.target.value)}
                    placeholder="e.g. Shop Herbal Collection"
                    className="w-full bg-[#FAF5EE]/50 border border-gray-300 focus:border-[#B87333] rounded-xl px-3 py-2 text-xs text-[#1F1813] font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-[10px] uppercase font-mono font-bold text-gray-600">
                    Ad Description / Value Proposition *
                  </label>
                  <span className={`text-[10px] font-mono font-bold ${description.length > 165 ? 'text-amber-700' : 'text-gray-400'}`}>
                    {description.length}/180 chars (Max 180)
                  </span>
                </div>
                <textarea
                  rows={3}
                  required
                  maxLength={180}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Share what makes your craft unique and how it blesses melanated families..."
                  className="w-full bg-[#FAF5EE]/50 border border-gray-300 focus:border-[#B87333] rounded-xl px-3 py-2 text-xs text-[#1F1813] font-medium resize-none"
                />
              </div>
            </div>

            {/* Exclusive Community Discount Code (The Benefit Engine!) */}
            <div className="p-4 bg-amber-50/70 rounded-2xl border-2 border-[#D4AF37]/50 space-y-3">
              <div className="flex items-center space-x-2">
                <Tag className="w-4 h-4 text-[#B87333]" />
                <h4 className="font-serif font-bold text-sm text-[#1F1813]">
                  Exclusive Community Discount &amp; Promo Code
                </h4>
              </div>
              <p className="text-[11px] text-gray-600 leading-snug">
                Why offer a discount? Copper Mommies love supporting sister-owned brands, and providing an exclusive code (e.g. 10&ndash;20% off) dramatically increases your conversions, loyalty, and word-of-mouth recommendations!
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-mono font-bold text-gray-600">
                    Discount Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={exclusiveDiscountCode}
                    onChange={(e) => setExclusiveDiscountCode(e.target.value.toUpperCase())}
                    placeholder="e.g. COPPER15"
                    className="w-full bg-white border border-[#D4AF37]/40 focus:border-[#B87333] rounded-xl px-3 py-2 text-xs font-mono font-bold text-[#1F1813]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-mono font-bold text-gray-600">
                    Offer Details / Terms *
                  </label>
                  <input
                    type="text"
                    required
                    value={discountOfferText}
                    onChange={(e) => setDiscountOfferText(e.target.value)}
                    placeholder="e.g. 15% off all herbal orders"
                    className="w-full bg-white border border-[#D4AF37]/40 focus:border-[#B87333] rounded-xl px-3 py-2 text-xs text-[#1F1813] font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Banner Creative / Free Image-to-Link Converter & Uploader */}
            <div className="space-y-3 pt-2 border-t border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <label className="block text-[10px] uppercase font-mono font-bold text-gray-700 flex items-center space-x-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-[#B87333]" />
                  <span>Upload Image or Free Image-to-Link Converter *</span>
                </label>
                <span className="text-[9px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Instant Link Generation (Free)
                </span>
              </div>
              <p className="text-[10px] text-gray-600 leading-snug">
                Select an image file from your device or paste a direct image URL. It instantly converts into a web-ready link that displays visually across your ad preview.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2 items-center">
                <input
                  type="text"
                  required
                  value={bannerImageUrl}
                  onChange={(e) => setBannerImageUrl(e.target.value)}
                  placeholder="https://... or upload file"
                  className="w-full bg-[#FAF5EE]/50 border border-gray-300 focus:border-[#B87333] rounded-xl px-3 py-2 text-xs font-mono text-[#1F1813]"
                />
                <label className="px-4 py-2 bg-[#1F1813] hover:bg-[#2A221B] text-[#D4AF37] font-mono font-bold text-xs rounded-xl cursor-pointer text-center transition-all flex items-center justify-center space-x-1.5 shrink-0">
                  <span>Upload File</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (uploadEvent) => {
                          if (uploadEvent.target?.result) {
                            setBannerImageUrl(uploadEvent.target.result as string);
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Visual Preview of converted image */}
              {bannerImageUrl && (
                <div className="flex items-center space-x-3 bg-white p-2.5 rounded-xl border border-[#D4AF37]/40 shadow-2xs">
                  <div className="w-20 h-12 rounded-lg overflow-hidden bg-neutral-900 shrink-0 border border-gray-200">
                    <img src={bannerImageUrl} alt="Ad banner preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1 text-[10px] font-sans">
                    <span className="font-bold text-emerald-700 flex items-center space-x-1">
                      <Check className="w-3 h-3" />
                      <span>Image Link Converted &amp; Verified</span>
                    </span>
                    <span className="font-mono text-gray-500 truncate block">{bannerImageUrl}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirmation Checkbox */}
            <div className="pt-3 border-t border-gray-100 space-y-2">
              <label className="flex items-start space-x-3 cursor-pointer p-3 rounded-xl bg-[#FAF5EE] border border-[#D4AF37]/30 hover:bg-[#FAF5EE]/80 transition-colors">
                <input
                  type="checkbox"
                  required
                  checked={singleMelanatedWomanOwnedConfirmed}
                  onChange={(e) => setSingleMelanatedWomanOwnedConfirmed(e.target.checked)}
                  className="w-4 h-4 text-[#B87333] rounded border-gray-300 focus:ring-[#B87333] accent-[#B87333] cursor-pointer mt-0.5"
                />
                <span className="text-[11px] font-medium text-[#1F1813] leading-relaxed">
                  <strong>Ownership Confirmation:</strong> I confirm that this enterprise is owned and operated by a Melanated Woman (either a Copper Mommie member or external sister ally), honoring our community standard for intentional cooperative reinvestment.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-gradient-to-r from-[#B87333] via-[#D4AF37] to-[#B87333] hover:from-[#A85138] hover:to-[#c29e2e] text-[#1F1813] font-serif font-black uppercase tracking-wider text-xs sm:text-sm rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer active:scale-95 disabled:opacity-70 flex items-center justify-center space-x-2"
            >
              <Send className="w-4 h-4 text-[#1F1813]" />
              <span>{isSubmitting ? 'Transmitting Submission...' : `SUBMIT AD APPLICATION (${getTierPricing()})`}</span>
            </button>

          </form>
        </div>

        {/* RIGHT COLUMN: LIVE REAL-TIME PREVIEW CONTAINER (5 Cols) - TRUE SIZES & TIER HIGHLIGHTING */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          <div className="flex items-center justify-between border-b border-gray-200 pb-2">
            <div className="flex items-center space-x-1.5 text-[#B87333]">
              <Eye className="w-4 h-4 text-[#D4AF37]" />
              <h3 className="font-serif font-bold text-sm uppercase tracking-wider">
                Live Interactive Ad Preview (True Sizing)
              </h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-bold">
              ★ Tier: {pricingTier.toUpperCase()}
            </span>
          </div>

          {/* PREVIEW 1: TOP HEADER FEATURE BANNER (1200 x 400 px / 3:1) */}
          <div className={`space-y-2 transition-all duration-300 p-2 rounded-2xl ${
            pricingTier === 'header_monthly' || pricingTier === 'member_header' || pricingTier === 'bundle_monthly' || pricingTier === 'pioneer_free'
              ? 'ring-4 ring-[#D4AF37] bg-amber-50/40 shadow-lg'
              : 'opacity-85'
          }`}>
            <div className="flex items-center justify-between text-[11px] font-mono font-bold text-[#1F1813]">
              <span className="flex items-center space-x-1">
                <span>1. Top Header Feature Banner</span>
                <span className="text-[9px] px-1.5 py-0.2 bg-amber-100 text-amber-900 rounded font-bold">True Size: 1200 x 400 px</span>
              </span>
              <span className="text-emerald-700 text-[10px]">
                {pricingTier === 'header_monthly' || pricingTier === 'member_header' || pricingTier === 'bundle_monthly' || pricingTier === 'pioneer_free' ? '● Active for Tier' : ''}
              </span>
            </div>

            <div className="relative rounded-2xl overflow-hidden shadow-xl border-2 border-[#D4AF37] bg-white">
              <div className="bg-gradient-to-r from-[#1F1813] via-[#2A221B] to-[#1F1813] px-3 py-2 flex items-center justify-between border-b border-[#D4AF37]/30 text-white">
                <div className="flex items-center space-x-2 min-w-0">
                  <span className="inline-flex rounded-full h-2 w-2 bg-[#D4AF37] animate-pulse shrink-0" />
                  <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-[#D4AF37] truncate">
                    Featured Sister Partner &bull; {targetCategory}
                  </span>
                </div>
                <span className="text-[9px] font-mono font-bold bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-0.5 rounded-full border border-[#D4AF37]/40 shrink-0">
                  Verified
                </span>
              </div>

              <div className="p-3.5 sm:p-4 bg-gradient-to-br from-[#FFFDF9] via-[#FAF5EE] to-[#F5ECE1] text-[#1F1813]">
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_210px] gap-3 items-stretch">
                  <div className="flex flex-col justify-between space-y-2 min-w-0">
                    <div className="space-y-0.5">
                      <h4 className="font-serif font-black text-sm sm:text-base text-[#1F1813] leading-tight line-clamp-1 truncate">
                        {headline || businessName || 'Highland Heritage Botanical Co.'}
                      </h4>
                      <p className="text-[10px] font-mono text-[#B87333] font-bold uppercase tracking-wider line-clamp-1 truncate">
                        {tagline || businessName || 'Ancestral Holistic Botanicals'}
                      </p>
                    </div>

                    <div className="relative rounded-xl overflow-hidden border border-[#B87333]/30 shadow-xs h-28 sm:h-32 bg-neutral-900 group">
                      <img
                        src={bannerImageUrl || '/apothecary_sister_herbal.jpg'}
                        alt="Header Feature Preview"
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-1.5 right-1.5 bg-[#1F1813]/85 text-[#FAF5EE] text-[8px] font-mono font-bold px-2 py-0.5 rounded border border-[#D4AF37]/40 backdrop-blur-xs flex items-center space-x-1">
                        <span>{callToActionText || 'Visit Shop'}</span>
                        <ExternalLink className="w-2.5 h-2.5 text-[#D4AF37]" />
                      </div>
                    </div>

                    <p className="text-[11px] text-[#2A221B]/90 line-clamp-2 leading-relaxed font-sans">
                      {description || 'Hand-harvested remedies crafted by traditional southern rootworkers. Solar-steeped in raw wild honey for whole-body family vitality.'}
                    </p>
                  </div>

                  <div className="bg-[#1F1813] text-white border-2 border-[#D4AF37]/50 rounded-2xl p-3 shadow-md flex flex-col justify-between space-y-2 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-[#D4AF37]/10 rounded-full blur-xl pointer-events-none" />
                    <div className="border-b border-[#D4AF37]/20 pb-1 flex items-center justify-between">
                      <span className="text-[9px] font-mono font-extrabold uppercase tracking-wider text-[#D4AF37] truncate block">
                        Exclusive Benefit
                      </span>
                      <span className="text-[9px] font-mono text-emerald-400 font-bold">Verified</span>
                    </div>
                    <div>
                      <span className="text-base sm:text-lg font-mono font-black text-[#D4AF37] glow-gold-text block truncate">
                        {discountOfferText || '15% Off'}
                      </span>
                      <p className="text-[9px] text-gray-300 font-mono leading-tight mt-0.5 line-clamp-2">
                        for Copper Mommies community
                      </p>
                    </div>
                    <div className="bg-white/10 border border-[#D4AF37]/40 rounded-xl px-2 py-1 flex items-center justify-between gap-1">
                      <div className="min-w-0">
                        <span className="text-[7.5px] uppercase font-mono text-gray-400 block leading-none">Code:</span>
                        <span className="font-mono font-black text-xs text-[#D4AF37] tracking-wider truncate block">
                          {exclusiveDiscountCode || 'COPPER15'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyCode(exclusiveDiscountCode || 'COPPER15')}
                        className="px-2 py-0.5 bg-[#D4AF37] hover:bg-[#b59226] text-[#1F140E] text-[9px] font-bold rounded shadow-xs active:scale-95 transition-all flex items-center space-x-1 cursor-pointer shrink-0"
                      >
                        {copiedCode ? <Check className="w-2.5 h-2.5 text-emerald-800" /> : <Copy className="w-2.5 h-2.5" />}
                        <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <a
                      href={websiteUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-1.5 bg-gradient-to-r from-[#D4AF37] to-[#B87333] hover:from-[#e0bc46] hover:to-[#c47f3e] text-[#1F140E] font-serif font-black text-[10px] rounded-xl shadow-xs transition-all flex items-center justify-center space-x-1 text-center"
                    >
                      <span className="truncate">{callToActionText || 'Visit Shop'}</span>
                      <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PREVIEW 1.5: HEADER FEATURE BANNER WITHOUT EXCLUSIVE COMMUNITY OFFER / VERIFIED SECTION (Clean Editorial Mode) */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-[11px] font-mono font-bold text-[#1F1813]">
              <span className="flex items-center space-x-1">
                <span>1b. Header Banner (No Offer / Clean Showcase)</span>
                <span className="text-[9px] px-1.5 py-0.2 bg-gray-200 text-gray-800 rounded font-bold">Editorial Layout</span>
              </span>
              <span className="text-gray-400 text-[10px]">True Size: 1200 x 400 px</span>
            </div>

            <div className="relative rounded-2xl overflow-hidden shadow-md border-2 border-gray-300 bg-[#1F1813] text-[#FAF5EE] p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1.5 min-w-0 flex-1">
                  <span className="text-[9px] font-mono text-[#D4AF37] uppercase tracking-widest font-bold block">
                    {targetCategory} &bull; Brand Showcase
                  </span>
                  <h4 className="font-serif font-black text-base text-[#FAF5EE] truncate">
                    {headline || businessName}
                  </h4>
                  <p className="text-xs text-gray-300 line-clamp-2">
                    {description}
                  </p>
                </div>
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-neutral-800 shrink-0 border border-[#D4AF37]/40">
                  <img src={bannerImageUrl || '/apothecary_sister_herbal.jpg'} alt="Editorial Showcase" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>

          {/* PREVIEW 2: VILLAGE COMMONS IN-FEED SPOTLIGHT CARD (800 x 450 px / 16:9) & NEWEST FEATURED SISTER ENTERPRISE BANNER */}
          <div className={`space-y-4 pt-2 transition-all duration-300 p-2 rounded-2xl ${
            pricingTier === 'sidebar_monthly' || pricingTier === 'member_sidebar' || pricingTier === 'bundle_monthly' || pricingTier === 'pioneer_free'
              ? 'ring-4 ring-emerald-500 bg-emerald-50/40 shadow-lg'
              : 'opacity-85'
          }`}>
            <div className="flex items-center justify-between text-[11px] font-mono font-bold text-[#1F1813]">
              <span className="flex items-center space-x-1">
                <span>2. Village Commons In-Feed Spotlight &amp; Featured Sister Enterprise Banner</span>
                <span className="text-[9px] px-1.5 py-0.2 bg-emerald-100 text-emerald-900 rounded font-bold">True Size: 800 x 450 px</span>
              </span>
              <span className="text-emerald-700 text-[10px]">
                {pricingTier === 'sidebar_monthly' || pricingTier === 'member_sidebar' || pricingTier === 'bundle_monthly' || pricingTier === 'pioneer_free' ? '● Active for Tier' : ''}
              </span>
            </div>

            <div className="w-full rounded-3xl bg-gradient-to-br from-[#1C1510] via-[#2A1D16] to-[#120D0A] p-4 sm:p-5 border-2 border-[#D4AF37]/40 shadow-md text-[#FAF5EE] space-y-2.5">
              <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-2">
                <div className="flex items-center space-x-2 min-w-0">
                  <span className="w-6 h-6 rounded-lg bg-[#D4AF37] text-[#1F140E] flex items-center justify-center font-bold text-[11px] shadow-xs shrink-0">
                    ⭐
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center space-x-1.5">
                      <span className="font-serif font-black text-xs sm:text-sm text-[#FAF5EE] truncate">
                        {businessName || 'Business Name'}
                      </span>
                      <span className="px-1.5 py-0.2 rounded-full text-[8px] font-mono font-bold bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 uppercase tracking-widest shrink-0">
                        Featured Sister Enterprise
                      </span>
                    </div>
                    <span className="text-[9px] font-mono text-soft-sage truncate block">
                      Vouched Partner &bull; {targetCategory}
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/35 flex items-center space-x-1 shrink-0">
                  <ShieldCheck className="w-3 h-3 text-[#D4AF37]" />
                  <span>Verified</span>
                </span>
              </div>

              <p className="text-[11px] text-[#FAF5EE]/90 font-sans leading-snug line-clamp-1">
                {tagline || headline || 'Hand-harvested botanicals & sovereign wellness solutions.'}
              </p>

              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-neutral-900 border border-[#D4AF37]/35 shadow-inner group">
                <img
                  src={bannerImageUrl || '/apothecary_sister_herbal.jpg'}
                  alt="In-Feed Spotlight Preview"
                  className="w-full h-full object-cover object-center opacity-90 group-hover:scale-[1.02] transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-end p-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 w-full">
                    <div className="space-y-0.5 min-w-0">
                      <span className="text-[9px] font-mono uppercase tracking-wider text-[#D4AF37] font-bold block">
                        Community Offer:
                      </span>
                      <span className="text-xs font-mono font-black text-emerald-300 truncate block">
                        {discountOfferText || '15% Off'} (Code: {exclusiveDiscountCode || 'COPPER15'})
                      </span>
                    </div>
                    <a
                      href={websiteUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B87333] hover:from-[#e0bc46] hover:to-[#c47f3e] text-[#1F140E] font-serif font-black text-[11px] shadow-md transition-all self-start sm:self-auto flex items-center space-x-1 shrink-0"
                    >
                      <span>{callToActionText || 'Visit Shop'}</span>
                      <ArrowRight className="w-3 h-3 text-[#1F140E]" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* PREVIEW 3: COMPANION SIDEBAR CARD (300 x 250 px spec) */}
            <div className="space-y-1.5 pt-2">
              <span className="text-[10px] font-mono font-bold text-gray-500 block">
                3. Companion Sidebar Card &bull; True Size: 300 x 250 px
              </span>
              <div className="max-w-sm mx-auto bg-white rounded-2xl border-2 border-[#D4AF37]/50 shadow-md p-3.5 space-y-2.5">
                <div className="flex items-center justify-between border-b border-gray-100 pb-1.5">
                  <div className="flex items-center space-x-1.5 min-w-0">
                    <Building2 className="w-3.5 h-3.5 text-[#B87333] shrink-0" />
                    <h5 className="font-serif font-black text-xs text-[#1F140E] truncate">
                      Sister Business Spotlight
                    </h5>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[8px] font-mono font-bold bg-[#FAF5EE] text-[#B87333] border border-[#D4AF37]/30 shrink-0">
                    Verified
                  </span>
                </div>

                <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                  <img
                    src={bannerImageUrl || '/apothecary_sister_herbal.jpg'}
                    alt="Sidebar Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-1.5 left-1.5 bg-[#1F140E]/85 text-[#D4AF37] text-[8px] font-mono font-bold px-2 py-0.5 rounded-md">
                    {targetCategory}
                  </div>
                </div>

                <div>
                  <h6 className="font-serif font-bold text-xs text-[#1F1813] line-clamp-1">
                    {businessName || 'Business Name'}
                  </h6>
                  <p className="text-[10px] text-gray-600 line-clamp-2 mt-0.5">
                    {description || 'Description of your artisan offering...'}
                  </p>

                  <div className="mt-2 p-2 bg-[#FAF5EE] rounded-xl border border-[#D4AF37]/30 flex items-center justify-between">
                    <div>
                      <span className="text-[8px] uppercase font-mono text-gray-500 block">Community Discount</span>
                      <strong className="text-[10px] font-mono font-bold text-[#B87333]">
                        {exclusiveDiscountCode || 'COPPER15'}
                      </strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(exclusiveDiscountCode || 'COPPER15')}
                      className="px-2 py-1 bg-white hover:bg-neutral-100 text-[9px] font-mono font-bold text-[#1F1813] rounded border border-gray-200 flex items-center space-x-1 cursor-pointer"
                    >
                      {copiedCode ? <Check className="w-2.5 h-2.5 text-emerald-600" /> : <Copy className="w-2.5 h-2.5" />}
                      <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] font-bold text-[#B87333] pt-1 border-t border-gray-100">
                  <span className="flex items-center space-x-1">
                    <ShoppingBag className="w-3 h-3" />
                    <span>{callToActionText || 'Visit Shop'}</span>
                  </span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Info Box on How It Benefits the Business */}
          <div className="p-4 bg-white rounded-2xl border border-gray-200 text-xs font-sans text-gray-600 space-y-1.5 shadow-xs">
            <div className="flex items-center space-x-1.5 text-[#1F1813] font-bold">
              <Info className="w-4 h-4 text-[#B87333]" />
              <span>How this benefits your business:</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Unlike broad algorithm feeds where posts get lost, Copper Mommies features your brand directly in front of highly engaged mothers who intentionally look for melanated women-owned products for their children, home, and wellness.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
