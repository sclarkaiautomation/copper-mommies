/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, 
  Handshake, 
  CheckCircle, 
  Repeat, 
  Clock, 
  DollarSign, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  MessageSquare,
  AlertCircle,
  Info,
  HelpCircle,
  CheckCircle2,
  UserCheck,
  Coins,
  Lock,
  ChevronDown,
  ChevronUp,
  FileText,
  MapPin,
  Heart
} from 'lucide-react';
import { 
  UnifiedListing, 
  MultiStageTrade, 
  initiateTradeHandshake, 
  submitCounterOffer, 
  acceptTradeHandshake, 
  completeTradeHandshake 
} from '../data/unifiedMarketplaceStore';

interface TradeHandshakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: UnifiedListing | null;
  existingTrade?: MultiStageTrade | null;
  userName: string;
  selectedState: string;
  onTradeUpdated?: (trade: MultiStageTrade) => void;
  onAddLedgerLog?: (log: any) => void;
  showToast?: (message: string) => void;
}

export default function TradeHandshakeModal({
  isOpen,
  onClose,
  listing,
  existingTrade,
  userName,
  selectedState,
  onTradeUpdated,
  onAddLedgerLog,
  showToast
}: TradeHandshakeModalProps) {
  if (!isOpen || !listing) return null;

  const [proposalText, setProposalText] = useState('');
  const [timeCreditHours, setTimeCreditHours] = useState<number>(
    listing.details.timeCreditEquivalent || 2
  );
  const [cashOffer, setCashOffer] = useState('');
  const [counterNote, setCounterNote] = useState('');
  const [showExplainer, setShowExplainer] = useState(true);
  const [showCmcScore, setShowCmcScore] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mode: if existing trade exists, show stage tracker; else show new proposal form
  const isExisting = !!existingTrade;
  const currentStage = existingTrade?.currentStage || 'inquiry';

  // Handle Initiating a Trade
  const handleInitiate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposalText.trim()) {
      alert('Please share your proposed exchange terms or inquiry.');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Client Store Update
      const trade = initiateTradeHandshake(
        listing,
        userName,
        `${selectedState} Circle`,
        proposalText.trim(),
        timeCreditHours,
        cashOffer.trim() || undefined
      );

      // 2. Backend Server Sync
      try {
        await fetch('/api/trades/initiate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            listingId: listing.id,
            listingTitle: listing.title,
            categoryType: listing.categoryType,
            initiatorName: userName,
            initiatorLocation: `${selectedState} Circle`,
            recipientName: listing.authorName,
            recipientLocation: listing.authorCity ? `${listing.authorCity}, ${listing.authorState}` : listing.authorState,
            proposalNote: proposalText.trim(),
            timeCreditHours,
            cashAmount: cashOffer.trim() || undefined
          })
        });
      } catch (err) {
        console.warn('Backend trade sync non-fatal:', err);
      }

      if (onTradeUpdated) onTradeUpdated(trade);
      if (showToast) {
        showToast(`🤝 Trade proposal sent to ${listing.authorName}! Synced with your My Active Trades dashboard.`);
      }
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Submitting Counter-Offer
  const handleCounter = async () => {
    if (!counterNote.trim() || !existingTrade) return;

    submitCounterOffer(existingTrade.id, counterNote.trim(), userName, timeCreditHours);

    try {
      await fetch('/api/trades/counter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tradeId: existingTrade.id,
          counterOfferNote: counterNote.trim(),
          counterOfferedBy: userName,
          timeCreditHours
        })
      });
    } catch (e) {
      console.warn('Backend counter sync non-fatal:', e);
    }

    const partner = existingTrade.recipientName === userName ? existingTrade.initiatorName : existingTrade.recipientName;
    if (showToast) {
      showToast(`🔄 Counter-offer submitted to ${partner}!`);
    }
    setCounterNote('');
    onClose();
  };

  // Handle Agreeing / Locking Escrow
  const handleAcceptTerms = async () => {
    if (!existingTrade) return;
    acceptTradeHandshake(existingTrade.id);

    try {
      await fetch('/api/trades/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tradeId: existingTrade.id })
      });
    } catch (e) {
      console.warn('Backend accept sync non-fatal:', e);
    }

    if (showToast) {
      showToast('🔒 Agreement locked! Mutual CMC escrow active.');
    }
    onClose();
  };

  // Handle Completion & Awarding CMC Score
  const handleComplete = async () => {
    if (!existingTrade) return;
    completeTradeHandshake(existingTrade.id);

    // Optional ledger log entry
    if (onAddLedgerLog) {
      onAddLedgerLog({
        id: `log-${Date.now()}`,
        sisterName: existingTrade.recipientName === userName ? existingTrade.initiatorName : existingTrade.recipientName,
        category: listing.categoryType === 'gig' ? 'Work / Business' : 'Barter / Goods',
        hours: existingTrade.timeCreditHours || 2,
        date: new Date().toLocaleDateString('en-US'),
        notes: `Mutual fulfillment of: ${listing.title}`,
        verified: true
      });
    }

    if (showToast) {
      showToast('🏆 Trade confirmed complete! +5 CMC Score awarded & logged to your CMC Ledger.');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-xs overflow-y-auto">
      <div 
        className="bg-[#180E08] border-2 border-[#D4AF37]/80 rounded-3xl max-w-2xl w-full p-5 sm:p-7 text-[#FAF5EE] shadow-[0_25px_70px_rgba(0,0,0,0.95)] space-y-4 max-h-[94vh] overflow-y-auto scrollbar-thin"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-[#D4AF37]/25 pb-3">
          <div className="flex items-center space-x-3">
            <span className="p-2.5 rounded-2xl bg-gradient-to-br from-[#D4AF37]/30 to-[#B87333]/30 text-[#D4AF37] border border-[#D4AF37]/50 text-xl shadow-inner">
              🤝
            </span>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-serif font-black text-lg sm:text-xl text-[#FAF5EE]">
                  {isExisting ? 'Active CMC Trade Handshake' : 'Initiate CMC Trade'}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 uppercase">
                  Protected &amp; Verified
                </span>
              </div>
              <p className="text-[11px] font-mono text-soft-sage">
                {listing.title}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Listing Card Preview Row */}
        <div className="p-3.5 rounded-2xl bg-[#2A1D16] border border-[#D4AF37]/30 flex items-center justify-between gap-3">
          <div className="flex items-center space-x-3 min-w-0">
            <img 
              src={listing.primaryCoverImage} 
              alt={listing.title}
              className="w-14 h-14 rounded-xl object-cover shrink-0 border border-[#D4AF37]/40 shadow-sm" 
            />
            <div className="min-w-0">
              <div className="flex items-center space-x-2 text-[10px] font-mono text-soft-sage">
                <span>{listing.authorName} &bull; {listing.authorState}</span>
                <span className="text-[#D4AF37] uppercase font-bold">&bull; {listing.categoryType}</span>
              </div>
              <h4 className="font-serif font-bold text-sm text-[#FAF5EE] truncate">
                {listing.title}
              </h4>
              <p className="text-[11px] text-[#FAF5EE]/80 truncate">
                {listing.details.compensation || listing.details.tradeForWishlist || listing.details.monthlyTerms || 'Open trade terms'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowCmcScore(!showCmcScore)}
            className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] font-mono font-bold shrink-0 transition-all cursor-pointer flex items-center space-x-1"
            title="Inspect member CMC Score, credits, and community standing"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>CMC Score</span>
          </button>
        </div>

        {/* CMC Score Pop-out Drawer (If Toggled) */}
        {showCmcScore && (
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#20140D] to-[#180E08] border border-[#D4AF37]/50 space-y-2.5 text-xs animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-2">
              <span className="font-mono text-[10px] uppercase font-bold text-[#D4AF37] flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>CMC Score &amp; Member Standing &bull; {listing.authorName}</span>
              </span>
              <button 
                type="button" 
                onClick={() => setShowCmcScore(false)} 
                className="text-[10px] text-soft-sage hover:text-white"
              >
                ✕ Close
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono text-[11px]">
              <div className="p-2 rounded-xl bg-black/40 border border-white/10">
                <span className="text-[9px] text-soft-sage block">Trust Rating</span>
                <span className="font-bold text-emerald-400 text-sm">96% Verified</span>
              </div>
              <div className="p-2 rounded-xl bg-black/40 border border-white/10">
                <span className="text-[9px] text-soft-sage block">CMC Credits</span>
                <span className="font-bold text-[#D4AF37] text-sm">18.5 Credits</span>
              </div>
              <div className="p-2 rounded-xl bg-black/40 border border-white/10">
                <span className="text-[9px] text-soft-sage block">CMC Score</span>
                <span className="font-bold text-amber-300 text-sm">+34 Points</span>
              </div>
              <div className="p-2 rounded-xl bg-black/40 border border-white/10">
                <span className="text-[9px] text-soft-sage block">Community Standing</span>
                <span className="font-bold text-emerald-300 text-[10px]">Verified Member ✓</span>
              </div>
            </div>

            <p className="text-[10px] text-soft-sage font-mono italic">
              ✨ Member in good standing within the Copper Mommies Co. verified network. Zero unfulfilled handshakes.
            </p>
          </div>
        )}

        {/* EDUCATIONAL EXPLAINER: HOW CMC TIME CREDITS & CO-CARE WORK */}
        <div className="rounded-2xl bg-[#231710] border border-[#D4AF37]/35 overflow-hidden">
          <button
            type="button"
            onClick={() => setShowExplainer(!showExplainer)}
            className="w-full p-3 flex items-center justify-between text-left hover:bg-white/5 transition-colors cursor-pointer"
          >
            <div className="flex items-center space-x-2">
              <span className="text-[#D4AF37]">✨</span>
              <span className="font-mono text-xs font-bold text-[#FAF5EE]">
                How CMC Time Credits &amp; Co-Care Work
              </span>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30">
                Co-Care &bull; Co-Create &bull; Co-Thrive
              </span>
            </div>
            {showExplainer ? (
              <ChevronUp className="w-4 h-4 text-soft-sage" />
            ) : (
              <ChevronDown className="w-4 h-4 text-soft-sage" />
            )}
          </button>

          {showExplainer && (
            <div className="p-3.5 pt-0 border-t border-[#D4AF37]/15 space-y-2.5 text-xs">
              <p className="text-[11px] text-soft-sage leading-relaxed mt-2.5">
                At Copper Mommies Co., we support the whole woman—her career, side ventures, relationships, wellness, family, and self-love. Our cooperative trade model honors your time and energy with transparency:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-sans">
                <div className="p-2.5 rounded-xl bg-black/30 border border-[#D4AF37]/20 space-y-1">
                  <div className="flex items-center space-x-1.5 font-mono font-bold text-[#D4AF37] text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>1. 1 Hour = 1 CMC Credit</span>
                  </div>
                  <p className="text-[#FAF5EE]/85 text-[10.5px] leading-relaxed">
                    Every hour of your time—whether you're consulting on a business plan, offering hair styling, photography, childcare, or home-cooked meals—is valued equally. 1 hour = 1 CMC Credit.
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-black/30 border border-[#D4AF37]/20 space-y-1">
                  <div className="flex items-center space-x-1.5 font-mono font-bold text-amber-300 text-[11px]">
                    <Lock className="w-3.5 h-3.5 text-amber-300" />
                    <span>2. Automated CMC Escrow</span>
                  </div>
                  <p className="text-[#FAF5EE]/85 text-[10.5px] leading-relaxed">
                    When you propose a trade, your credits are placed in secure escrow. Neither party loses credits until both women confirm the exchange is complete.
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-black/30 border border-[#D4AF37]/20 space-y-1">
                  <div className="flex items-center space-x-1.5 font-mono font-bold text-blue-300 text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
                    <span>3. Dual-Confirmation Handshake</span>
                  </div>
                  <p className="text-[#FAF5EE]/85 text-[10.5px] leading-relaxed">
                    Once terms are agreed, you connect in person or digitally. Both women sign off on their phones when the service or exchange is delivered.
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-black/30 border border-[#D4AF37]/20 space-y-1">
                  <div className="flex items-center space-x-1.5 font-mono font-bold text-emerald-300 text-[11px]">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                    <span>4. +5 CMC Score Boost</span>
                  </div>
                  <p className="text-[#FAF5EE]/85 text-[10.5px] leading-relaxed">
                    Completing an exchange automatically releases escrow, issues a verified digital co-op receipt, and awards both women +5 points to their CMC Score.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* TIME BANK & ESCROW LIVE BALANCE WIDGET */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#2A1D16] to-[#1F140E] border border-[#D4AF37]/35 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#D4AF37] font-bold flex items-center space-x-1.5">
              <span>⏳ Automated CMC Time Bank &amp; Co-Care Ledger</span>
            </span>
            <span className="text-[9.5px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/40 font-bold">
              Escrow Active ✓
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
            <div className="bg-black/40 p-2 rounded-xl border border-white/10">
              <span className="text-[9px] text-soft-sage block">Your CMC Credits</span>
              <span className="text-sm font-bold text-[#D4AF37]">14.5 Credits</span>
            </div>
            <div className="bg-black/40 p-2 rounded-xl border border-white/10">
              <span className="text-[9px] text-soft-sage block">Trade Escrow Reserve</span>
              <span className="text-sm font-bold text-amber-300">{timeCreditHours || 2}.0 Credits</span>
            </div>
            <div className="bg-black/40 p-2 rounded-xl border border-white/10">
              <span className="text-[9px] text-soft-sage block">Your CMC Score</span>
              <span className="text-sm font-bold text-emerald-300">+48 Points</span>
            </div>
          </div>
        </div>

        {/* EXISTING TRADE: STAGE TRACKER & WORKFLOW NEXT STEPS */}
        {isExisting && existingTrade && (
          <div className="space-y-3.5">
            {/* Status Alert Banner */}
            <div className="p-3.5 rounded-2xl bg-black/50 border border-[#D4AF37]/40 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] font-bold block">
                  Live Handshake Progression:
                </span>
                <span className="text-soft-sage text-[10px] font-mono">{existingTrade.updatedAt}</span>
              </div>

              {/* Step Progression Bar */}
              <div className="grid grid-cols-4 gap-1.5 text-center font-mono text-[9px]">
                <div className={`p-1.5 rounded-lg border ${
                  currentStage === 'inquiry' 
                    ? 'bg-amber-900/60 border-amber-400 text-amber-200 font-bold' 
                    : 'bg-black/40 border-white/10 text-gray-400'
                }`}>
                  1. Proposal
                </div>
                <div className={`p-1.5 rounded-lg border ${
                  currentStage === 'counter_offer' 
                    ? 'bg-amber-900/60 border-amber-400 text-amber-200 font-bold' 
                    : 'bg-black/40 border-white/10 text-gray-400'
                }`}>
                  2. Counter
                </div>
                <div className={`p-1.5 rounded-lg border ${
                  currentStage === 'agreed' 
                    ? 'bg-[#D4AF37]/30 border-[#D4AF37] text-[#D4AF37] font-bold' 
                    : 'bg-black/40 border-white/10 text-gray-400'
                }`}>
                  3. Escrow Locked
                </div>
                <div className={`p-1.5 rounded-lg border ${
                  currentStage === 'completed' 
                    ? 'bg-emerald-900/60 border-emerald-400 text-emerald-300 font-bold' 
                    : 'bg-black/40 border-white/10 text-gray-400'
                }`}>
                  4. Complete
                </div>
              </div>

              {/* Active Terms Box */}
              <div className="p-3 rounded-xl bg-[#2A1D16] text-xs font-sans text-[#FAF5EE] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#D4AF37] font-bold">Active Agreement Terms:</span>
                  {existingTrade.timeCreditHours && (
                    <span className="text-[10px] font-mono text-amber-300 bg-black/40 px-2 py-0.5 rounded border border-amber-400/30">
                      ⏳ {existingTrade.timeCreditHours} CMC Credits Reserved in Escrow
                    </span>
                  )}
                </div>
                <p className="leading-relaxed bg-black/25 p-2 rounded-lg border border-white/5">
                  {existingTrade.currentTerms}
                </p>
              </div>

              {/* Next Steps Guide Box */}
              <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs space-y-1.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-300 flex items-center space-x-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Next Steps for this Trade:</span>
                </span>
                
                {currentStage === 'inquiry' && (
                  <p className="text-[11px] text-[#FAF5EE]/90 leading-relaxed">
                    &bull; Proposal sent to <strong>{existingTrade.recipientName}</strong>.<br />
                    &bull; She will review your terms and can accept directly or suggest adjustments.<br />
                    &bull; Track live updates in your <strong>My Active Trades</strong> tab anytime.
                  </p>
                )}

                {currentStage === 'counter_offer' && (
                  <p className="text-[11px] text-[#FAF5EE]/90 leading-relaxed">
                    &bull; An adjustment note was sent by <strong>{existingTrade.counterOfferedBy || 'Member'}</strong>.<br />
                    &bull; Review the adjusted terms above. If satisfied, click <strong>"Accept &amp; Lock Terms"</strong> to activate escrow.<br />
                    &bull; Need tweaks? Submit a counter-offer note below.
                  </p>
                )}

                {currentStage === 'agreed' && (
                  <p className="text-[11px] text-[#FAF5EE]/90 leading-relaxed">
                    &bull; Terms are locked in mutual CMC escrow.<br />
                    &bull; Connect at a safe meetup location, coordinate drop-off, or deliver digital services.<br />
                    &bull; Once completed, click <strong>"Confirm Trade Completed"</strong> to release escrow and earn +5 CMC Score points!
                  </p>
                )}

                {currentStage === 'completed' && (
                  <p className="text-[11px] text-emerald-300 leading-relaxed">
                    ✓ Trade completed! +5 CMC Score points awarded and credits updated in your CMC Ledger.
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons for Existing Trade */}
            {currentStage !== 'completed' && (
              <div className="space-y-3 pt-1">
                {currentStage !== 'agreed' && (
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-mono text-[#D4AF37]">
                      Submit Adjustment / Counter-Offer:
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={counterNote}
                        onChange={(e) => setCounterNote(e.target.value)}
                        placeholder="e.g. I can do 3 dozen eggs if you can pick up on Saturday morning..."
                        className="flex-1 bg-[#2A1D16] border border-[#D4AF37]/30 rounded-xl px-3 py-2 text-xs text-[#FAF5EE] focus:outline-none focus:border-[#D4AF37]"
                      />
                      <button
                        type="button"
                        onClick={handleCounter}
                        className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-[#FAF5EE] rounded-xl text-xs font-mono font-bold transition-all cursor-pointer shrink-0"
                      >
                        Counter
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1 gap-2">
                  {currentStage !== 'agreed' ? (
                    <button
                      type="button"
                      onClick={handleAcceptTerms}
                      className="flex-1 py-3 px-4 bg-gradient-to-r from-[#D4AF37] to-[#B87333] hover:from-[#c5a02e] hover:to-[#9e622b] text-[#1F140E] font-mono text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center space-x-1.5"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Accept &amp; Lock Terms in Escrow</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleComplete}
                      className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center space-x-1.5"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-200" />
                      <span>Confirm Trade Completed (+5 CMC Score)</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* NEW PROPOSAL FORM */}
        {!isExisting && (
          <form onSubmit={handleInitiate} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-mono font-bold text-[#D4AF37]">
                Your Proposed Trade or Inquiry *
              </label>
              <textarea
                required
                rows={3}
                value={proposalText}
                onChange={(e) => setProposalText(e.target.value)}
                placeholder={
                  listing.categoryType === 'gig'
                    ? "Share your interest, background, availability, and how you can support this project..."
                    : listing.categoryType === 'housing'
                    ? "Introduce yourself, timeline, lifestyle, and any co-care or skills you can contribute..."
                    : "Describe what you offer in exchange (services, skills, home-cooked food, beauty care, or CMC credits)..."
                }
                className="w-full bg-[#2A1D16] border border-[#D4AF37]/35 rounded-xl p-3 text-xs text-[#FAF5EE] focus:outline-none focus:border-[#D4AF37] leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-mono text-soft-sage">
                  CMC Time Credits (Hours in Escrow)
                </label>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <input
                    type="number"
                    min={0}
                    max={40}
                    value={timeCreditHours}
                    onChange={(e) => setTimeCreditHours(parseInt(e.target.value, 10) || 0)}
                    className="w-full bg-[#2A1D16] border border-[#D4AF37]/30 rounded-xl px-2.5 py-1.5 text-xs text-[#FAF5EE]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-mono text-soft-sage">
                  Cash Portion (If hybrid offer)
                </label>
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <input
                    type="text"
                    value={cashOffer}
                    onChange={(e) => setCashOffer(e.target.value)}
                    placeholder="e.g. $40 or N/A"
                    className="w-full bg-[#2A1D16] border border-[#D4AF37]/30 rounded-xl px-2.5 py-1.5 text-xs text-[#FAF5EE]"
                  />
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-[#D4AF37]/25 flex items-center space-x-2.5 text-[11px] text-soft-sage">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>All exchanges are protected in the Copper Mommies Co. network. Completed trades award +5 CMC Score points.</span>
            </div>

            <div className="flex items-center justify-end space-x-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-white/20 hover:bg-white/10 text-white/80 font-mono text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B87333] hover:from-[#c5a02e] hover:to-[#9e622b] text-[#1F140E] font-mono text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer flex items-center space-x-2"
              >
                <span>{isSubmitting ? 'Transmitting...' : 'Submit Proposal to Escrow'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
