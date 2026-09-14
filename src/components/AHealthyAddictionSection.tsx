import React, { useState } from 'react';
import { 
  Sparkles, 
  ExternalLink, 
  ShoppingBag, 
  Search, 
  Heart, 
  ShieldCheck, 
  Check, 
  Info, 
  Mail, 
  MapPin, 
  Clock, 
  ArrowRight,
  Filter,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { 
  REMEDY_ALTERNATIVES_DATA, 
  FEATURED_HERBALISTS_DIRECTORY, 
  RemedyAlternative, 
  FeaturedHerbalist 
} from '../data/ecosystemData';

interface AHealthyAddictionSectionProps {
  onShowToast?: (msg: string) => void;
}

export default function AHealthyAddictionSection({ onShowToast }: AHealthyAddictionSectionProps) {
  const [activeSubTab, setActiveSubTab] = useState<'alternatives-archive' | 'herbalist-directory'>('alternatives-archive');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterTag, setFilterTag] = useState<'all' | 'children' | 'postpartum'>('all');

  // Herbalist Consultation Booking Modal
  const [selectedHerbalist, setSelectedHerbalist] = useState<FeaturedHerbalist | null>(null);
  const [consultModalOpen, setConsultModalOpen] = useState<boolean>(false);
  const [consultForm, setConsultForm] = useState({
    name: 'Sister Shantrece',
    email: 'shantrece@coppermommies.co',
    reason: 'Postpartum mineral depletion and gentle infant digestive teas',
    offerBarter: true
  });

  const triggerToast = (msg: string) => {
    if (onShowToast) {
      onShowToast(msg);
    } else {
      alert(msg);
    }
  };

  const handleConsultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConsultModalOpen(false);
    triggerToast(`🌿 Consultation inquiry dispatched to ${selectedHerbalist?.name} (${selectedHerbalist?.honorific})! Check your sanctuary inbox for details.`);
  };

  // Filtered Alternatives
  const filteredAlternatives = REMEDY_ALTERNATIVES_DATA.filter(alt => {
    const matchesSearch = alt.standardOTC.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          alt.herbalAlternative.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          alt.botanicalLatin.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          alt.primaryAction.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    if (filterTag === 'children' && !alt.safeForChildren) return false;
    if (filterTag === 'postpartum' && !alt.safeForPostpartum) return false;
    return true;
  });

  return (
    <div className="space-y-6 text-[#1F1813]">

      {/* Hero Card: A Healthy Addiction Archive */}
      <div className="bg-gradient-to-br from-[#1C271E] via-[#243327] to-[#152016] border-2 border-emerald-500/30 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-[#D4AF37]/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <span className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/35 shadow-inner">
                <Sparkles className="w-6 h-6 text-emerald-300" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest font-extrabold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/25">
                    Earth &amp; Healing Collective Hub
                  </span>
                  <span className="text-[10px] font-mono text-[#FAF5EE]/70">Verified Partner Integration</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#FAF5EE] tracking-tight mt-0.5">
                  A Healthy Addiction
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-xs font-mono font-bold text-emerald-300 flex items-center space-x-1.5">
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Verified Amazon Affiliate Pantry</span>
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#FAF5EE]/90 max-w-3xl leading-relaxed">
            Welcome to the <strong>Herbal Remedy Alternative Archive</strong> curated by <em>A Healthy Addiction</em> in sacred alliance with The Copper Circle. Replace artificial pharmaceuticals and synthetic additives with time-tested, earth-grown whole plant alternatives. Every recipe is paired with <strong>1-click Amazon Affiliate ingredient sourcing links</strong>, directly funding our community apothecary pantry at zero extra cost to you.
          </p>

          {/* Transparent Affiliate Disclosure Banner */}
          <div className="bg-white/10 border border-emerald-400/25 rounded-2xl p-3 text-[11px] text-[#FAF5EE]/85 flex items-start space-x-2.5">
            <Info className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
            <span>
              <strong>Affiliate Disclosure:</strong> When you purchase organic herbs, cold-pressed butters, and glassware using these verified links, Amazon pays a modest affiliate commission directly to the Copper Mommies Community Apothecary Fund, sustaining free herbal care for new mothers.
            </span>
          </div>
        </div>
      </div>

      {/* Sub-navigation switcher */}
      <div className="flex flex-wrap gap-2 border-b border-copper-penny/20 pb-3">
        <button
          onClick={() => setActiveSubTab('alternatives-archive')}
          className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center space-x-2 ${
            activeSubTab === 'alternatives-archive'
              ? 'bg-[#2E4F32] text-white shadow-md border border-[#2E4F32]'
              : 'bg-white text-[#1F1813]/80 border border-copper-penny/20 hover:bg-[#FAF5EE]'
          }`}
        >
          <Sparkles className="w-4 h-4 text-emerald-300" />
          <span>Remedy Alternative Archive &amp; Amazon Affiliate Links</span>
        </button>

        <button
          onClick={() => setActiveSubTab('herbalist-directory')}
          className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center space-x-2 ${
            activeSubTab === 'herbalist-directory'
              ? 'bg-[#2E4F32] text-white shadow-md border border-[#2E4F32]'
              : 'bg-white text-[#1F1813]/80 border border-copper-penny/20 hover:bg-[#FAF5EE]'
          }`}
        >
          <Heart className="w-4 h-4 text-emerald-300" />
          <span>Featured Herbalists Directory</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. REMEDY ALTERNATIVES ARCHIVE                                            */}
      {/* ========================================================================= */}
      {activeSubTab === 'alternatives-archive' && (
        <div className="space-y-5">
          
          {/* Search & Filter Bar */}
          <div className="bg-[#FAF5EE] border border-copper-penny/20 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-soft-sage absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by symptom, OTC drug, or herb name..."
                className="w-full bg-white border border-copper-penny/25 rounded-xl pl-10 pr-4 py-2 text-xs text-[#1F1813] focus:outline-none focus:border-[#2E4F32]"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase text-soft-sage font-bold">Safety Filter:</span>
              <button
                onClick={() => setFilterTag('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  filterTag === 'all'
                    ? 'bg-[#2E4F32] text-white'
                    : 'bg-white border border-copper-penny/20 text-[#1F1813] hover:bg-[#FAF5EE]'
                }`}
              >
                All Remedies
              </button>
              <button
                onClick={() => setFilterTag('children')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  filterTag === 'children'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-white border border-copper-penny/20 text-[#1F1813] hover:bg-[#FAF5EE]'
                }`}
              >
                Child-Safe
              </button>
              <button
                onClick={() => setFilterTag('postpartum')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  filterTag === 'postpartum'
                    ? 'bg-[#B87333] text-white'
                    : 'bg-white border border-copper-penny/20 text-[#1F1813] hover:bg-[#FAF5EE]'
                }`}
              >
                Postpartum
              </button>
            </div>
          </div>

          {/* Remedy Comparison Cards Grid */}
          <div className="space-y-6">
            {filteredAlternatives.map((alt) => (
              <div
                key={alt.id}
                className="bg-white border-2 border-copper-penny/20 rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all space-y-4"
              >
                {/* Header: Chemical vs Ancestral */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-copper-penny/15 pb-4">
                  {/* Left: Standard OTC Problem */}
                  <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-200/70 space-y-1.5">
                    <span className="text-[9px] font-mono uppercase font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded inline-block">
                      Standard Pharmaceutical / Chemical OTC
                    </span>
                    <h4 className="font-serif font-bold text-base text-rose-950">
                      {alt.standardOTC}
                    </h4>
                    <p className="text-[11px] text-rose-900/80 leading-relaxed">
                      {alt.standardOTCPurpose}
                    </p>
                  </div>

                  {/* Right: Earth Botanical Alternative */}
                  <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-300/70 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono uppercase font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded inline-block">
                        Ancestral Earth Solution
                      </span>
                      <div className="flex items-center gap-1.5">
                        {alt.safeForChildren && (
                          <span className="text-[9px] font-mono font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.2 rounded-full border border-emerald-300">
                            Child-Safe
                          </span>
                        )}
                        {alt.safeForPostpartum && (
                          <span className="text-[9px] font-mono font-bold text-[#96551d] bg-[#FAF5EE] px-2 py-0.2 rounded-full border border-copper-penny/25">
                            Postpartum
                          </span>
                        )}
                      </div>
                    </div>

                    <h4 className="font-serif font-bold text-base text-emerald-950">
                      {alt.herbalAlternative}
                    </h4>
                    <p className="text-[11px] font-mono italic text-emerald-800">
                      {alt.botanicalLatin}
                    </p>
                  </div>
                </div>

                {/* Why Switch & Preparation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1 bg-[#FAF5EE]/70 p-3.5 rounded-2xl border border-copper-penny/10">
                    <span className="font-mono text-[10px] uppercase font-bold text-[#2E4F32] block">
                      Why Ancestral Sisters Switch:
                    </span>
                    <p className="text-[#2A221B]/85 leading-relaxed text-[11px]">
                      {alt.whySwitch}
                    </p>
                  </div>

                  <div className="space-y-1 bg-[#FAF5EE]/70 p-3.5 rounded-2xl border border-copper-penny/10">
                    <span className="font-mono text-[10px] uppercase font-bold text-[#2E4F32] block">
                      Preparation &amp; Folk Protocol:
                    </span>
                    <p className="text-[#2A221B]/85 leading-relaxed text-[11px]">
                      {alt.preparationMethod}
                    </p>
                  </div>
                </div>

                {alt.contraindications && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>Maternal Safety Note:</strong> {alt.contraindications}</span>
                  </div>
                )}

                {/* Amazon Affiliate Ingredient Links Block */}
                <div className="pt-2 border-t border-copper-penny/15 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase font-bold text-[#2E4F32] flex items-center space-x-1.5">
                      <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />
                      <span>1-Click Amazon Affiliate Sourcing Links for this Recipe:</span>
                    </span>
                    <span className="text-[9px] font-mono text-soft-sage">Verified Organic Grade</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {alt.amazonAffiliateIngredients.map((item, idx) => (
                      <a
                        key={idx}
                        href={item.amazonSearchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#FAF5EE] hover:bg-emerald-50/80 border border-copper-penny/20 hover:border-emerald-500 rounded-xl p-3 flex flex-col justify-between space-y-2 transition-all group"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[9px] font-mono text-soft-sage font-bold">
                            <span>{item.category}</span>
                            <span className="text-emerald-700 font-bold">{item.priceEstimate}</span>
                          </div>
                          <h5 className="font-serif font-bold text-xs text-[#1F1813] group-hover:text-emerald-900 line-clamp-2">
                            {item.name}
                          </h5>
                          <p className="text-[10px] text-[#2A221B]/70 leading-snug">
                            {item.specification}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-1 text-[10px] font-mono font-bold text-emerald-700 border-t border-copper-penny/10">
                          <span>Order on Amazon</span>
                          <ExternalLink className="w-3 h-3 text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. FEATURED HERBALISTS DIRECTORY                                          */}
      {/* ========================================================================= */}
      {activeSubTab === 'herbalist-directory' && (
        <div className="space-y-6">
          <div className="bg-[#FAF5EE] border border-copper-penny/20 rounded-3xl p-5 sm:p-6 shadow-sm space-y-2">
            <h3 className="font-serif font-bold text-xl text-[#1F1813]">
              The Copper Circle Master Herbalist Directory
            </h3>
            <p className="text-xs sm:text-sm text-[#2A221B]/80 leading-relaxed max-w-3xl">
              Connect directly with verified melanated herbalists, folk medicine compounders, and postpartum birth workers across our sovereign state hubs. Book personalized maternal consultations or request traditional apothecary barters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {FEATURED_HERBALISTS_DIRECTORY.map((herbalist) => (
              <div
                key={herbalist.id}
                className="bg-white border-2 border-copper-penny/20 hover:border-[#2E4F32] rounded-3xl p-5 sm:p-6 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      <span className="w-12 h-12 rounded-2xl bg-[#FAF5EE] border border-copper-penny/20 text-2xl flex items-center justify-center shadow-xs">
                        {herbalist.avatarEmoji}
                      </span>
                      <div>
                        <h4 className="font-serif font-bold text-lg text-[#1F1813]">{herbalist.name}</h4>
                        <p className="text-[11px] font-mono font-bold text-[#2E4F32]">{herbalist.honorific}</p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">
                        {herbalist.stateCode} Hub
                      </span>
                      {herbalist.barterAccepted && (
                        <span className="text-[9px] font-mono text-[#B87333] font-bold">
                          ✓ Time-Credits / Barter
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-[#2A221B]/85 leading-relaxed font-sans">
                    {herbalist.bio}
                  </p>

                  <div className="space-y-1.5 text-xs bg-[#FAF5EE]/70 p-3 rounded-2xl border border-copper-penny/10">
                    <div className="flex items-start space-x-2 text-[11px]">
                      <strong className="text-[#1F1813] font-bold shrink-0">Specialty:</strong>
                      <span className="text-[#2A221B]/80">{herbalist.specialty}</span>
                    </div>
                    <div className="flex items-start space-x-2 text-[11px]">
                      <strong className="text-[#1F1813] font-bold shrink-0">Tradition:</strong>
                      <span className="text-[#2A221B]/80">{herbalist.lineageTradition} ({herbalist.experienceYears} Years Experience)</span>
                    </div>
                    <div className="flex items-start space-x-2 text-[11px]">
                      <strong className="text-[#1F1813] font-bold shrink-0">Consultations:</strong>
                      <span className="text-[#2A221B]/80">{herbalist.consultationFocus}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-copper-penny/15 flex items-center justify-between gap-3">
                  <span className="text-[10px] font-mono text-soft-sage">
                    {herbalist.location}
                  </span>

                  <button
                    onClick={() => {
                      setSelectedHerbalist(herbalist);
                      setConsultModalOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#2E4F32] hover:bg-[#1E3521] text-white font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center space-x-1.5 cursor-pointer shadow-sm"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Request Herbal Consultation</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* HERBAL CONSULTATION MODAL                                                 */}
      {/* ========================================================================= */}
      {consultModalOpen && selectedHerbalist && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF5EE] border-2 border-emerald-600 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-fade-in text-[#1F1813]">
            <div className="flex items-center justify-between border-b border-copper-penny/20 pb-3">
              <div className="flex items-center space-x-2 text-[#2E4F32]">
                <Heart className="w-5 h-5 text-emerald-600" />
                <h3 className="font-serif font-bold text-lg text-[#1F1813]">
                  Consult with {selectedHerbalist.name}
                </h3>
              </div>
              <button
                onClick={() => setConsultModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white text-gray-500 hover:text-black flex items-center justify-center border border-copper-penny/20 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#2A221B]/80 leading-relaxed">
              Send a private consultation inquiry to <strong>{selectedHerbalist.name}</strong> ({selectedHerbalist.specialty}). Responses are delivered directly to your Sanctuary messages.
            </p>

            <form onSubmit={handleConsultSubmit} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="block font-mono text-[10px] uppercase font-bold text-soft-sage">
                  Your Full Name / Sister Handle
                </label>
                <input
                  type="text"
                  required
                  value={consultForm.name}
                  onChange={(e) => setConsultForm({ ...consultForm, name: e.target.value })}
                  className="w-full bg-white border border-copper-penny/25 rounded-xl px-3 py-2 text-xs text-[#1F1813] focus:outline-none focus:border-[#2E4F32]"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-mono text-[10px] uppercase font-bold text-soft-sage">
                  Primary Botanical Healing Goal / Symptom Focus
                </label>
                <textarea
                  required
                  rows={3}
                  value={consultForm.reason}
                  onChange={(e) => setConsultForm({ ...consultForm, reason: e.target.value })}
                  className="w-full bg-white border border-copper-penny/25 rounded-xl px-3 py-2 text-xs text-[#1F1813] focus:outline-none focus:border-[#2E4F32]"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="barterCheck"
                  checked={consultForm.offerBarter}
                  onChange={(e) => setConsultForm({ ...consultForm, offerBarter: e.target.checked })}
                  className="rounded accent-emerald-700"
                />
                <label htmlFor="barterCheck" className="text-xs text-[#2A221B]/80 cursor-pointer">
                  Request Sovereign Time-Credit exchange or heirloom barter instead of fiat currency
                </label>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setConsultModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white border border-copper-penny/25 font-mono text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#2E4F32] hover:bg-[#1E3521] text-white font-mono font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md"
                >
                  Send Consultation Inquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
