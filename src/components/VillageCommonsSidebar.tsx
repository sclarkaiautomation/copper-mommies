import React, { useState } from 'react';
import { 
  Bookmark, 
  ChevronLeft, 
  ChevronRight, 
  Radio, 
  Volume2, 
  GraduationCap, 
  Sparkles, 
  Leaf, 
  ArrowRight, 
  ExternalLink, 
  Heart,
  CheckCircle,
  Eye,
  Trash2,
  Calendar,
  Building2,
  Home,
  Tag,
  Copy,
  Check
} from 'lucide-react';
import { BusinessAdSubmission } from '../types';

export interface SavedCommonsItem {
  id: string;
  type: 'exchange' | 'housing' | 'business' | 'forum' | 'event';
  title: string;
  subtitle: string;
  imageUrl: string;
  categoryBadge: string;
  location?: string;
  terms?: string;
}

interface VillageCommonsSidebarProps {
  savedItems: SavedCommonsItem[];
  onSelectSavedItem: (item: SavedCommonsItem) => void;
  onRemoveSavedItem: (id: string) => void;
  onNavigateToTab?: (tab: string) => void;
  businessAds?: BusinessAdSubmission[];
}

export default function VillageCommonsSidebar({
  savedItems,
  onSelectSavedItem,
  onRemoveSavedItem,
  onNavigateToTab,
  businessAds = []
}: VillageCommonsSidebarProps) {
  // ----------------------------------------------------
  // ROW 1: SAVED ITEMS / SUGGESTED DEFAULTS SCROLL
  // ----------------------------------------------------
  const [savedIndex, setSavedIndex] = useState(0);

  // Fallback suggested items if sister has not saved anything yet (one from each core section)
  const defaultSuggestedItems: SavedCommonsItem[] = [
    {
      id: 'sugg-1',
      type: 'exchange',
      title: 'Solid Hardwood Montessori Bookshelf',
      subtitle: 'Free giveaway in West End / Cascade, Atlanta',
      imageUrl: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=600&q=80',
      categoryBadge: 'Free Giveaway',
      location: 'Atlanta, GA',
      terms: '100% Free Gift'
    },
    {
      id: 'sugg-2',
      type: 'housing',
      title: 'Garden Cottage & Sanctuary Room',
      subtitle: 'Private garden entrance, peaceful work nook & bath',
      imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
      categoryBadge: 'Housing Haven',
      location: 'Stone Mountain, GA',
      terms: '$650/mo utilities included'
    },
    {
      id: 'sugg-3',
      type: 'business',
      title: 'Roots & Resilience Master Apothecary',
      subtitle: 'Ancestral botanical oxymels & nettle infusions',
      imageUrl: '/apothecary_sister_herbal.jpg',
      categoryBadge: 'Sister Business',
      location: 'Atlanta, GA',
      terms: '15% Off with code COPPERMOMMIE'
    },
    {
      id: 'sugg-4',
      type: 'event',
      title: 'Autumn Equinox Seed Swap & Sister Circle',
      subtitle: 'Oct 10 at West River Nature Preserve',
      imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80',
      categoryBadge: 'Gathering',
      location: 'Atlanta, GA',
      terms: 'Free for verified sisters'
    },
    {
      id: 'sugg-5',
      type: 'forum',
      title: 'Morning Sun & Daily Affirmation',
      subtitle: 'Gentle sovereign reminder for all mothers today',
      imageUrl: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&w=600&q=80',
      categoryBadge: 'Community Post',
      location: 'Atlanta, GA',
      terms: 'Daily Mother Wisdom'
    }
  ];

  const activeSavedList = savedItems.length > 0 ? savedItems : defaultSuggestedItems;
  const isShowingDefaults = savedItems.length === 0;
  const safeSavedIndex = Math.min(savedIndex, activeSavedList.length - 1);
  const currentSaved = activeSavedList[safeSavedIndex] || activeSavedList[0];

  const handlePrevSaved = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedIndex(prev => (prev === 0 ? activeSavedList.length - 1 : prev - 1));
  };

  const handleNextSaved = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedIndex(prev => (prev === activeSavedList.length - 1 ? 0 : prev + 1));
  };

  // ----------------------------------------------------
  // ROW 2: CIRCLE & SANCTUARY VIDEO OR VOICE RECORDINGS
  // ----------------------------------------------------
  const [recordingIndex, setRecordingIndex] = useState(0);
  const sanctuaryRecordings = [
    {
      id: 'rec-1',
      type: 'voice' as const,
      title: 'The Casual Corner Talk — Motherhood Real Talk',
      subtitle: 'Mama Shantrece & Sisters on Protecting Family Peace',
      badge: 'Voice Broadcast',
      imageUrl: '/The Casual Corner Talk.jpeg',
      duration: '48 mins',
      targetTab: 'audio'
    },
    {
      id: 'rec-2',
      type: 'video' as const,
      title: 'Sacred Womb Herbal Preparations & Nettle Decoction',
      subtitle: 'Master Apothecary Video Workshop with Elder Doulas',
      badge: 'Video Recording',
      imageUrl: '/apothecary_sister_herbal.jpg',
      duration: '32 mins',
      targetTab: 'audio'
    },
    {
      id: 'rec-3',
      type: 'voice' as const,
      title: 'Morning Sanctuary Sisterhood Meditation & Breathwork',
      subtitle: 'Mama Keisha • 15 min Guided Morning Benediction',
      badge: 'Voice Recording',
      imageUrl: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&w=600&q=80',
      duration: '15 mins',
      targetTab: 'audio'
    },
    {
      id: 'rec-4',
      type: 'video' as const,
      title: '508(c)(1)(a) Sovereign Land Trust & Estate Planning Panel',
      subtitle: 'Council Grandmothers & Indigenous Attorneys Archive',
      badge: 'Video Recording',
      imageUrl: '/legal_trust_elder.jpg',
      duration: '60 mins',
      targetTab: 'kinship'
    }
  ];

  const currentRecording = sanctuaryRecordings[recordingIndex];

  // ----------------------------------------------------
  // ROW 3: KINSHIP & TREASURY VAULT CLASSES SCROLL
  // ----------------------------------------------------
  const [classIndex, setClassIndex] = useState(0);
  const vaultClasses = [
    {
      id: 'cls-1',
      title: '508(c)(1)(a) Land Trust & Heir Property Protection',
      instructor: 'Elder Land Trustees & Indigenous Council Attorneys',
      schedule: 'Available On-Demand • 4 Modules',
      badge: 'Legal Sovereign Trust',
      imageUrl: '/legal_trust_elder.jpg'
    },
    {
      id: 'cls-2',
      title: 'Ancestral Seed Banking & Open-Pollinated Breeding',
      instructor: 'Mama Danielle (Heritage Seed Steward)',
      schedule: 'Live Cohort • Saturdays 10 AM EST',
      badge: 'Seed & Garden Life',
      imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d69106093?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'cls-3',
      title: 'Cooperative Family Bookkeeping & Community Ledgering',
      instructor: 'Mama Corinne (Community Ledger Advisor)',
      schedule: 'Self-Paced Certification Course',
      badge: 'Family Wealth',
      imageUrl: '/legal_trust_elder.jpg'
    }
  ];

  const currentClass = vaultClasses[classIndex];

  // ----------------------------------------------------
  // ROW 4: EARTH & HEALING BOTANICAL ITEMS SCROLL
  // ----------------------------------------------------
  const [remedyIndex, setRemedyIndex] = useState(0);
  const healingRemedies = [
    {
      id: 'rem-1',
      title: 'Mineral Revival Nettle & Root Decoction',
      indication: 'Blood replenishment, stamina, and mineral balance for mothers and growing kids',
      type: 'Ancestral Compound',
      form: 'Dried Organic Botanical Herbs',
      imageUrl: 'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'rem-2',
      title: 'Wildcrafted Elderberry & Rosehip Oxymel',
      indication: 'Immune resilience, respiratory tonification & seasonal protection',
      type: 'Raw Honey Elixir',
      form: '8oz Amber Glass Dropper',
      imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'rem-3',
      title: 'Goldenrod, Arnica & St. John\'s Wort Body Salve',
      indication: 'Sore muscles, growing pains & whole-family wellness',
      type: 'Solar Infused Salve',
      form: '4oz Mason Jar Beeswax Balm',
      imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'rem-4',
      title: 'Gullah Sea Island Mullein & Lung Infusion',
      indication: 'Deep respiratory support, seasonal wellness & family vitality',
      type: 'Botanical Elixir',
      form: 'Organic Solar Steeped Compound',
      imageUrl: 'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&w=600&q=80'
    }
  ];

  const currentRemedy = healingRemedies[remedyIndex];

  return (
    <aside className="w-full space-y-5 font-mono text-xs">
      
      {/* ==================================================== */}
      {/* 1. TOP CARD: ADVERTISE YOUR MELANATED WOMAN-OWNED BUSINESS */}
      {/* Accessible to both members ($5-$20) and external partners */}
      {/* ==================================================== */}
      <div 
        onClick={() => onNavigateToTab && onNavigateToTab('advertise')}
        className="bg-gradient-to-br from-[#1F140E] via-[#2A1D16] to-[#140F0B] rounded-3xl border-2 border-[#D4AF37] p-4 text-center space-y-2.5 cursor-pointer hover:border-amber-300 transition-all shadow-md group relative overflow-hidden text-[#FAF5EE]"
        title="Advertise your business across Copper Mommies"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-0.5 rounded-full text-[8px] font-mono font-bold uppercase tracking-widest bg-[#D4AF37] text-[#1F140E]">
            👑 Marketplace Feature
          </span>
          <span className="text-[9px] font-mono text-emerald-400 font-bold">
            Members $5–$20
          </span>
        </div>

        <div>
          <h5 className="font-serif font-black text-xs sm:text-sm text-[#D4AF37] group-hover:text-amber-200 transition-colors leading-snug">
            Advertise Your Melanated Woman-Owned Business
          </h5>
          <p className="text-[10px] text-white/80 font-sans leading-snug mt-1">
            Showcase your craft, botanicals, homeschool tools, or family service directly to thousands of mothers. Copper Mommie members enjoy exclusive discounted pricing ($5–$20)!
          </p>
        </div>

        <div className="pt-1 flex items-center justify-center space-x-1.5 text-[11px] font-mono font-bold text-[#D4AF37] group-hover:underline">
          <span>Apply for Ad Feature (Live Preview)</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>

      {/* ==================================================== */}
      {/* 2. SISTER BUSINESS SPOTLIGHT CARD                    */}
      {/* Exact 300 x 250 / 300 x 360 Right Column Placement   */}
      {/* ==================================================== */}
      <div 
        className="bg-white rounded-3xl border-2 border-[#D4AF37]/50 shadow-sm p-4 space-y-3 group hover:border-[#D4AF37] transition-all relative overflow-hidden"
        title="Melanated Woman-Owned Business Spotlight"
      >
        <div className="flex items-center justify-between border-b border-copper-penny/10 pb-2">
          <div className="flex items-center space-x-1.5">
            <Building2 className="w-4 h-4 text-[#B87333]" />
            <h4 className="font-serif font-black text-xs sm:text-sm text-[#1F140E]">
              Sister Business Spotlight
            </h4>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[8px] font-mono font-bold bg-[#FAF5EE] text-[#B87333] border border-[#D4AF37]/30">
            Verified Partner
          </span>
        </div>

        {/* Sponsor Business Card */}
        <div className="space-y-2.5">
          <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-neutral-100 border border-copper-penny/15">
            <img 
              src={businessAds && businessAds.length > 0 ? businessAds[0].bannerImageUrl : '/apothecary_sister_herbal.jpg'} 
              alt="Sister Business Partner" 
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
              referrerPolicy="no-referrer"
            />
            <span className="absolute top-2 left-2 bg-[#1F140E]/90 text-[#D4AF37] text-[9px] font-mono font-bold px-2 py-0.5 rounded-md border border-[#D4AF37]/30">
              {businessAds && businessAds.length > 0 ? (businessAds[0].targetCategory || 'Sister Business') : 'Master Apothecary'}
            </span>
          </div>

          <div>
            <h5 className="font-serif font-bold text-xs text-[#1F1813] line-clamp-1 group-hover:text-copper-penny transition-colors">
              {businessAds && businessAds.length > 0 ? businessAds[0].businessName : 'Roots & Resilience Master Apothecary'}
            </h5>
            <p className="text-[11px] text-[#1F140E]/80 font-sans line-clamp-2 mt-0.5">
              {businessAds && businessAds.length > 0 ? businessAds[0].description : 'Ancestral botanical oxymels, wildcrafted Lowcountry elderberry, and restorative family wellness elixirs.'}
            </p>

            {/* Exclusive Discount Box */}
            <div className="mt-2.5 p-2 bg-[#FAF5EE] rounded-xl border border-[#D4AF37]/35 flex items-center justify-between">
              <div>
                <span className="text-[8px] uppercase font-mono text-gray-500 block">Community Discount</span>
                <strong className="text-[10px] font-mono font-bold text-[#B87333]">
                  {businessAds && businessAds.length > 0 ? businessAds[0].exclusiveDiscountCode : 'COPPER15'}
                </strong>
                <span className="text-[8px] text-gray-600 block">
                  {businessAds && businessAds.length > 0 ? businessAds[0].discountOfferText : '15% Off with code COPPER15'}
                </span>
              </div>
              <a
                href={businessAds && businessAds.length > 0 ? businessAds[0].websiteUrl : 'https://coppermommies.co/apothecary'}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1.5 bg-[#D4AF37] hover:bg-[#C5A02E] text-[#1F140E] text-[10px] font-bold rounded-lg transition-all flex items-center space-x-1 cursor-pointer shrink-0 shadow-2xs"
              >
                <span>Visit</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* 3. CIRCLE & SANCTUARY VIDEO OR VOICE RECORDING        */}
      {/* ==================================================== */}
      <div 
        className="bg-gradient-to-br from-[#1F140E] via-[#2A1D16] to-[#140F0B] rounded-3xl border-2 border-[#D4AF37]/40 shadow-sm p-4 text-[#FAF5EE] space-y-3 group hover:border-[#D4AF37] transition-all relative overflow-hidden"
        title="Circle & Sanctuary Video or Voice Recording: click to open in its dedicated section"
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <div className="flex items-center space-x-1.5">
            {currentRecording.type === 'voice' ? (
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            ) : (
              <Volume2 className="w-4 h-4 text-[#D4AF37]" />
            )}
            <h4 className="font-serif font-bold text-xs sm:text-sm text-[#D4AF37]">
              Circle &amp; Sanctuary Recordings
            </h4>
          </div>

          <div className="flex items-center space-x-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setRecordingIndex(prev => (prev === 0 ? sanctuaryRecordings.length - 1 : prev - 1));
              }}
              className="p-1 rounded-lg hover:bg-white/15 text-white/80 cursor-pointer"
              title="Previous Sanctuary Recording"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[10px] text-[#D4AF37] font-bold">
              {recordingIndex + 1}/{sanctuaryRecordings.length}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setRecordingIndex(prev => (prev === sanctuaryRecordings.length - 1 ? 0 : prev + 1));
              }}
              className="p-1 rounded-lg hover:bg-white/15 text-white/80 cursor-pointer"
              title="Next Sanctuary Recording"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Thumbnail Preview & Direct Link */}
        <div 
          onClick={() => onNavigateToTab && onNavigateToTab(currentRecording.targetTab)}
          className="space-y-2 cursor-pointer"
          title={`Click to listen or watch: ${currentRecording.title}`}
        >
          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-black/40 border border-white/10">
            <img 
              src={currentRecording.imageUrl} 
              alt={currentRecording.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex items-end p-2.5">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-full bg-[#D4AF37] text-[#1F140E] flex items-center justify-center font-bold text-xs shadow-md">
                  ▶
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#FAF5EE] block leading-tight line-clamp-1">
                    {currentRecording.title}
                  </span>
                  <span className="text-[8px] text-[#FAF5EE]/75 font-mono">
                    {currentRecording.subtitle}
                  </span>
                </div>
              </div>
            </div>
            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[8px] font-mono font-bold uppercase bg-black/75 text-[#D4AF37] border border-[#D4AF37]/30">
              {currentRecording.badge} • {currentRecording.duration}
            </span>
          </div>

          <div className="flex items-center justify-between text-[10px] text-[#D4AF37] pt-0.5">
            <span>Tap to open in {currentRecording.targetTab === 'audio' ? 'Audio Lounge' : 'Sanctuary Vault'}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* 4. KINSHIP & TREASURY VAULT CLASSES                  */}
      {/* ==================================================== */}
      <div 
        className="bg-white rounded-3xl border-2 border-copper-penny/25 shadow-sm p-4 space-y-3 group hover:border-[#D4AF37] transition-all"
        title="Kinship & Treasury Vault Masterclasses"
      >
        <div className="flex items-center justify-between border-b border-copper-penny/10 pb-2">
          <div className="flex items-center space-x-1.5">
            <GraduationCap className="w-4 h-4 text-copper-penny" />
            <h4 className="font-serif font-black text-xs sm:text-sm text-[#1F140E]">
              Vault Masterclasses
            </h4>
          </div>
          <div className="flex items-center space-x-1">
            <button
              type="button"
              onClick={() => setClassIndex(prev => (prev === 0 ? vaultClasses.length - 1 : prev - 1))}
              className="p-1 rounded-lg hover:bg-neutral-100 text-neutral-600 cursor-pointer"
              title="Previous Class"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[10px] text-soft-sage font-bold">
              {classIndex + 1}/{vaultClasses.length}
            </span>
            <button
              type="button"
              onClick={() => setClassIndex(prev => (prev === vaultClasses.length - 1 ? 0 : prev + 1))}
              className="p-1 rounded-lg hover:bg-neutral-100 text-neutral-600 cursor-pointer"
              title="Next Class"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Current Class Display */}
        <div 
          onClick={() => onNavigateToTab && onNavigateToTab('kinship')}
          className="space-y-2 cursor-pointer"
        >
          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-neutral-100 border border-copper-penny/15">
            <img 
              src={currentClass.imageUrl} 
              alt={currentClass.title} 
              className="w-full h-full object-cover group-hover:scale-103 transition-transform"
              referrerPolicy="no-referrer"
            />
            <span className="absolute top-2 left-2 bg-[#1F140E]/90 text-[#D4AF37] text-[9px] font-bold px-2 py-0.5 rounded-md">
              {currentClass.badge}
            </span>
          </div>

          <div>
            <h5 className="font-serif font-bold text-xs text-[#1F140E] line-clamp-1 group-hover:text-copper-penny transition-colors">
              {currentClass.title}
            </h5>
            <p className="text-[10px] text-soft-sage mt-0.5">
              Host: {currentClass.instructor}
            </p>
            <span className="text-[9px] font-bold text-emerald-800 block mt-0.5">
              {currentClass.schedule}
            </span>
          </div>

          <div className="flex items-center justify-between text-[10px] font-bold text-copper-penny pt-1">
            <span>Access in Kinship Vault</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* 5. EARTH & HEALING BOTANICAL DISPENSARY ITEMS        */}
      {/* ==================================================== */}
      <div 
        className="bg-white rounded-3xl border-2 border-copper-penny/25 shadow-sm p-4 space-y-3 group hover:border-[#D4AF37] transition-all"
        title="Earth & Healing Dispensary Formulations"
      >
        <div className="flex items-center justify-between border-b border-copper-penny/10 pb-2">
          <div className="flex items-center space-x-1.5">
            <Leaf className="w-4 h-4 text-emerald-700" />
            <h4 className="font-serif font-black text-xs sm:text-sm text-[#1F140E]">
              Earth &amp; Healing Remedies
            </h4>
          </div>
          <div className="flex items-center space-x-1">
            <button
              type="button"
              onClick={() => setRemedyIndex(prev => (prev === 0 ? healingRemedies.length - 1 : prev - 1))}
              className="p-1 rounded-lg hover:bg-neutral-100 text-neutral-600 cursor-pointer"
              title="Previous Remedy"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[10px] text-soft-sage font-bold">
              {remedyIndex + 1}/{healingRemedies.length}
            </span>
            <button
              type="button"
              onClick={() => setRemedyIndex(prev => (prev === healingRemedies.length - 1 ? 0 : prev + 1))}
              className="p-1 rounded-lg hover:bg-neutral-100 text-neutral-600 cursor-pointer"
              title="Next Remedy"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Current Remedy Display */}
        <div 
          onClick={() => onNavigateToTab && onNavigateToTab('healing')}
          className="space-y-2 cursor-pointer"
        >
          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-neutral-100 border border-copper-penny/15">
            <img 
              src={currentRemedy.imageUrl} 
              alt={currentRemedy.title} 
              className="w-full h-full object-cover group-hover:scale-103 transition-transform"
              referrerPolicy="no-referrer"
            />
            <span className="absolute top-2 left-2 bg-emerald-900/90 text-emerald-100 text-[9px] font-bold px-2 py-0.5 rounded-md">
              {currentRemedy.type}
            </span>
          </div>

          <div>
            <h5 className="font-serif font-bold text-xs text-[#1F140E] line-clamp-1 group-hover:text-copper-penny transition-colors">
              {currentRemedy.title}
            </h5>
            <p className="text-[11px] text-[#1F140E]/80 font-sans line-clamp-2 mt-0.5">
              {currentRemedy.indication}
            </p>
            <span className="text-[9px] font-bold text-soft-sage block mt-0.5">
              {currentRemedy.form}
            </span>
          </div>

          <div className="flex items-center justify-between text-[10px] font-bold text-emerald-800 pt-1">
            <span>View in Herbal Dispensary</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

    </aside>
  );
}
