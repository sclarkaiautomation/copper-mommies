import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Heart,
  HelpCircle,
  FileCheck2,
  Calendar,
  Compass,
  AlertCircle
} from 'lucide-react';
import { BarterOffer, BarterComment, SafeMeetupSpot, ActiveTradeRecord } from '../types';
import { SAFE_MEETUP_SPOTS } from '../data/phase1CommunityData';
import { getStoredTrades } from '../data/unifiedMarketplaceStore';

export interface BarterCardInteractiveProps {
  barter: BarterOffer;
  userName: string;
  selectedState?: string;
  userState?: string;
  comments: BarterComment[];
  onAddComment: (barterId: string, text: string, isQuickInquiry?: boolean, parentCommentId?: string) => void;
  onInitiateTrade: (barter: BarterOffer, meetupSpot?: SafeMeetupSpot) => void;
  onHandshakeAction: (barterId: string, action: 'confirm_giver' | 'confirm_recipient') => void;
  isHandshakingId?: string | null;
  isHandshaking?: boolean;
  onFindMatchesWithAI?: (barter: BarterOffer) => void;
  onFindAIMatches?: (barter: BarterOffer) => void;
  onOpenSisterProfile?: (sisterName: string) => void;
  onOpenProfile?: (sisterName: string) => void;
  activeTrade?: ActiveTradeRecord | null;
}

const QUICK_INQUIRY_PROMPTS = [
  "👋 Hey, is this still available to trade?",
  "🌱 I have fresh garden produce and home goods to swap!",
  "🧴 Is this batch lightly scented or fragrance-free?",
  "🚗 Can we connect this week at a verified safe spot?",
  "💼 Open to trading for branding, business consulting, or styling?"
];

export default function BarterCardInteractive(props: BarterCardInteractiveProps) {
  const {
    barter,
    userName,
    selectedState,
    userState,
    comments,
    onAddComment,
    onInitiateTrade,
    onHandshakeAction,
    isHandshakingId,
    isHandshaking,
    onFindMatchesWithAI,
    onFindAIMatches,
    onOpenSisterProfile,
    onOpenProfile,
    activeTrade
  } = props;
  const currentState = userState || selectedState || 'GA';
  const handleOpenProfile = onOpenProfile || onOpenSisterProfile;
  const handleFindMatches = onFindAIMatches || onFindMatchesWithAI;
  const isCurrentlyHandshaking = isHandshaking !== undefined ? isHandshaking : (isHandshakingId === barter.id);
  const [showComments, setShowComments] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');
  const [showSafeSpotPicker, setShowSafeSpotPicker] = useState(false);
  const [selectedSafeSpot, setSelectedSafeSpot] = useState<SafeMeetupSpot | null>(null);

  const isGiver = barter.offerBy === userName;
  const isHandshakePending = !barter.handshakeComplete;
  const isGift = barter.isGift || barter.requestType === 'Gift/Need';

  const postComments = comments.filter(c => c.barterId === barter.id);
  const stateSafeSpots = SAFE_MEETUP_SPOTS[barter.locationState] || SAFE_MEETUP_SPOTS['GA'] || [];

  const handlePostComment = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newCommentText.trim()) return;
    onAddComment(barter.id, newCommentText, false);
    setNewCommentText('');
  };

  const handleSendQuickInquiry = (promptText: string) => {
    onAddComment(barter.id, promptText, true);
  };

  const storedTrades = getStoredTrades();
  const matchedTrade = activeTrade || (storedTrades as any[]).find(t => 
    (t.listingId === barter.id || t.listingTitle === barter.title) &&
    (t.initiatorName === userName || t.recipientName === userName)
  );
  const hasInitiatedTrade = !!matchedTrade;
  const isTradeComplete = barter.handshakeComplete || matchedTrade?.currentStage === 'completed' || matchedTrade?.status === 'Completed Exchange';

  return (
    <div className="border border-[#1F1813]/10 hover:border-copper-penny/40 bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
      
      {/* Top Visual Image Container (Matched with Village Commons Exchange Aesthetic) */}
      <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-[#FAF5EE] overflow-hidden">
        <img 
          src={barter.imageUrl || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80'} 
          alt={barter.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Gradient Overlay for Top Badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

        {/* Top Badges Row */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5 z-10">
          <div className="flex items-center space-x-1.5 flex-wrap gap-1">
            <span className="px-2.5 py-0.5 rounded-lg text-[9px] font-mono font-black uppercase bg-[#1F140E]/90 text-[#D4AF37] border border-[#D4AF37]/50 shadow-md">
              {barter.category}
            </span>
            {barter.crossPostedFromCommons && (
              <span className="px-2 py-0.5 rounded-lg text-[8.5px] font-mono font-bold bg-emerald-900/90 text-emerald-200 border border-emerald-400/40 shadow-xs flex items-center space-x-1">
                <span>🏡 Commons Synced</span>
              </span>
            )}
          </div>

          <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-mono font-black uppercase shadow-md ${
            isGift 
              ? 'bg-emerald-600 text-white' 
              : barter.intentTag === 'I need'
              ? 'bg-rose-700 text-white'
              : 'bg-[#B87333] text-white'
          }`}>
            {isGift ? 'Village Gift' : barter.intentTag || 'I have'}
          </span>
        </div>

        {/* Bottom Image Overlay Tag / Location */}
        <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-white text-[10px] font-mono z-10">
          <span className="flex items-center space-x-1 drop-shadow-md">
            <MapPin className="w-3 h-3 text-[#D4AF37] shrink-0" />
            <span className="font-bold">
              {barter.city ? `${barter.city}, ${barter.locationState}` : `${barter.locationState} Circle`}
            </span>
          </span>
          <span className="text-[9px] bg-black/70 px-2 py-0.5 rounded-md border border-white/20 drop-shadow-md">
            {barter.requestType || 'Barter'}
          </span>
        </div>
      </div>

      {/* Main Card Body */}
      <div className="p-4 sm:p-5 space-y-3.5 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {/* Sister Author Row */}
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-soft-sage text-[10px]">
              Posted {barter.createdAt ? barter.createdAt.split('T')[0] : 'Recently'}
            </span>
            <button
              onClick={() => handleOpenProfile && handleOpenProfile(barter.offerBy)}
              className="text-[#B87333] hover:text-[#A85138] font-bold underline cursor-pointer"
            >
              By {barter.offerBy}
            </button>
          </div>

          {/* Title */}
          <h4 className="font-serif font-black text-base text-[#1F1813] leading-snug group-hover:text-copper-penny transition-colors">
            {barter.title}
          </h4>

          {/* Description */}
          <p className="text-xs text-[#2A221B]/85 leading-relaxed line-clamp-2">{barter.description}</p>

          {/* Hybrid Split Option Banner (If Available) */}
          {barter.hybridSplitOption && (
            <div className="p-2.5 bg-gradient-to-r from-amber-50 to-[#FAF5EE] border border-[#D4AF37]/40 rounded-xl space-y-1">
              <span className="text-[8.5px] font-mono uppercase tracking-wider font-extrabold text-[#B87333] flex items-center space-x-1">
                <Sparkles className="w-2.5 h-2.5 text-[#D4AF37]" />
                <span>Hybrid Trade / Split Option:</span>
              </span>
              <p className="text-[11px] font-sans font-bold text-[#1F1813] leading-snug">
                "{barter.hybridSplitOption}"
              </p>
            </div>
          )}
        </div>

        {/* Trade Terms & Points Card */}
        <div className="bg-[#FAF5EE] p-3 rounded-2xl border border-copper-penny/15 space-y-1.5 text-xs">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-mono text-[9px] text-soft-sage uppercase tracking-wider font-bold">
              {isGift ? "Gift Delivery:" : "Looking For:"}
            </span>
            <span className="font-bold text-[#A85138] truncate max-w-[170px]">{barter.tradeFor || "Open Trade"}</span>
          </div>
          
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-dashed border-copper-penny/15">
            <span className="font-mono text-[9px] text-soft-sage uppercase tracking-wider font-bold">Equivalent Value:</span>
            {isGift ? (
              <span className="font-mono text-[9px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-extrabold flex items-center space-x-1">
                <Heart className="w-2.5 h-2.5 text-emerald-600 fill-emerald-600" />
                <span>Community Gift (Exempt)</span>
              </span>
            ) : (
              <div className="flex items-center space-x-1.5 font-mono text-[10px] font-bold text-copper-penny">
                <span>{barter.valuePoints || 5} CMC Credits</span>
                {barter.timeCreditHours && (
                  <span className="px-1.5 py-0.2 rounded bg-[#D4AF37]/20 text-[#1F140E] text-[9px]">
                    or {barter.timeCreditHours}h CMC Time Credits
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Handshake Status & Action Controls */}
      <div className="bg-[#FAF5EE]/40 p-3 rounded-2xl border border-[#B87333]/15 space-y-2 text-xs">
        {/* Active Trade Initiated Status Pill */}
        {hasInitiatedTrade && (
          <div className="p-2 rounded-xl bg-amber-50 border border-amber-300 text-[10px] font-mono text-[#1F1813] flex items-center justify-between">
            <span className="flex items-center space-x-1.5 font-bold text-amber-900">
              <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse shrink-0" />
              <span>
                {isTradeComplete 
                  ? 'Trade Completed (+5 CMC Score) ✓' 
                  : matchedTrade?.currentStage === 'agreed' || matchedTrade?.status === 'Awaiting Safe Handshake'
                  ? 'Stage 3: Escrow Locked' 
                  : matchedTrade?.currentStage === 'counter_offer'
                  ? 'Stage 2: Counter-Offer Active'
                  : 'Stage 1: Proposal In Review'}
              </span>
            </span>
            <button 
              type="button"
              onClick={() => onInitiateTrade(barter, selectedSafeSpot || undefined)}
              className="text-[9px] text-amber-800 hover:text-amber-950 font-bold underline cursor-pointer shrink-0"
            >
              View &rarr;
            </button>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="font-mono text-[9px] uppercase tracking-wider text-soft-sage font-bold flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-copper-penny" />
            <span>CMC Trade Status</span>
          </span>
          <span className="font-mono text-[9px] font-bold">
            {isTradeComplete ? (
              <span className="text-emerald-700 font-extrabold flex items-center space-x-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline shrink-0" />
                <span>Dual Handshake Signed</span>
              </span>
            ) : hasInitiatedTrade ? (
              <span className="text-amber-700 font-bold">⏳ Handshake In Progress</span>
            ) : (
              <span className="text-soft-sage font-bold">Available for Trade</span>
            )}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-1.5 text-[9px] font-mono text-soft-sage">
          <div className="flex items-center space-x-1 bg-white p-1 rounded-lg border border-copper-penny/10">
            <span>Giver:</span>
            <span className={barter.giverConfirmed ? "text-emerald-600 font-bold" : "text-amber-600"}>
              {barter.giverConfirmed ? "✓ Signed" : "⏳ Pending"}
            </span>
          </div>
          <div className="flex items-center space-x-1 bg-white p-1 rounded-lg border border-copper-penny/10">
            <span>Recipient:</span>
            <span className={barter.recipientConfirmed || hasInitiatedTrade ? "text-emerald-600 font-bold" : "text-amber-600"}>
              {barter.recipientConfirmed || hasInitiatedTrade ? "✓ Signed" : "⏳ Pending"}
            </span>
          </div>
        </div>

        {/* Handshake & Start Trade Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
          {!isGiver && !isTradeComplete && (
            hasInitiatedTrade ? (
              <button
                type="button"
                onClick={() => onInitiateTrade(barter, selectedSafeSpot || undefined)}
                className="w-full sm:w-1/2 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-[10px] font-mono font-bold uppercase rounded-xl shadow-xs border border-amber-400/50 transition-all active:scale-95 cursor-pointer flex items-center justify-center space-x-1"
                title="You have already initiated a trade for this item. Click to review status, counter-offers, or complete handshake."
              >
                <Clock className="w-3.5 h-3.5 text-amber-200 animate-pulse" />
                <span>⏳ Trade Initiated</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onInitiateTrade(barter, selectedSafeSpot || undefined)}
                className="w-full sm:w-1/2 py-2 bg-[#B87333] hover:bg-[#A85138] text-white text-[10px] font-mono font-bold uppercase rounded-xl shadow-xs hover:shadow transition-all active:scale-95 cursor-pointer flex items-center justify-center space-x-1"
              >
                <span>🤝 Initiate Trade</span>
              </button>
            )
          )}

          {!isGiver && isTradeComplete && (
            <button
              type="button"
              onClick={() => onInitiateTrade(barter, selectedSafeSpot || undefined)}
              className="w-full sm:w-1/2 py-2 bg-emerald-950 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-900 text-[10px] font-mono font-bold uppercase rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center space-x-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>🏆 Handshake Done (+5)</span>
            </button>
          )}

          {isGiver && isHandshakePending && (
            <button
              disabled={barter.giverConfirmed || isHandshakingId === barter.id}
              onClick={() => onHandshakeAction(barter.id, 'confirm_giver')}
              className={`w-full py-1.5 font-mono text-[10px] uppercase font-bold rounded-xl transition-all ${
                barter.giverConfirmed 
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200" 
                  : "bg-[#B87333] hover:bg-[#A85138] text-white cursor-pointer shadow-xs active:scale-95"
              }`}
            >
              {barter.giverConfirmed ? "✓ Giver Logged Transfer" : "✍️ Sign Giver Handshake"}
            </button>
          )}

          <button
            onClick={() => setShowSafeSpotPicker(!showSafeSpotPicker)}
            className="w-full sm:w-auto px-2.5 py-1.5 bg-white hover:bg-gray-50 border border-copper-penny/20 text-[#1F1813] text-[10px] font-mono font-bold rounded-xl transition-all flex items-center justify-center space-x-1 cursor-pointer"
            title="Locate safe exchange spots for this trade"
          >
            <Compass className="w-3 h-3 text-[#B87333]" />
            <span>{selectedSafeSpot ? "Spot Chosen ✓" : "Safe Spot Locator"}</span>
          </button>
        </div>
      </div>

      {/* Safe Meetup Spot Picker Dropdown */}
      {showSafeSpotPicker && (
        <div className="p-3 bg-[#FAF5EE] border border-[#D4AF37]/40 rounded-2xl space-y-2 text-xs">
          <div className="flex items-center justify-between border-b border-copper-penny/10 pb-1">
            <span className="font-mono text-[9px] uppercase font-bold text-[#B87333] flex items-center space-x-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>Vetted Public Exchange Locations ({barter.locationState})</span>
            </span>
            <button onClick={() => setShowSafeSpotPicker(false)} className="text-[10px] text-soft-sage hover:text-black">✕</button>
          </div>
          
          <div className="space-y-1.5 max-h-36 overflow-y-auto">
            {stateSafeSpots.map((spot) => (
              <div 
                key={spot.id}
                onClick={() => {
                  setSelectedSafeSpot(spot);
                  setShowSafeSpotPicker(false);
                }}
                className={`p-2 rounded-xl border transition-all cursor-pointer text-left ${
                  selectedSafeSpot?.id === spot.id 
                    ? 'bg-amber-50 border-amber-600' 
                    : 'bg-white border-copper-penny/10 hover:border-copper-penny/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#1F1813] text-[11px]">{spot.name}</span>
                  <span className="text-[8px] font-mono bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">Vetted</span>
                </div>
                <p className="text-[10px] text-soft-sage">{spot.address}, {spot.cityState}</p>
                <p className="text-[9px] text-[#2A221B]/70 italic mt-0.5">{spot.notes}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Inline Comments & Quick Inquiries Toggle Bar */}
      <div className="border-t border-copper-penny/10 pt-2 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <button
            onClick={() => setShowComments(!showComments)}
            className="text-[11px] font-mono font-bold text-[#B87333] hover:text-[#A85138] flex items-center space-x-1.5 cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Community Q&amp;A &amp; Member Notes ({postComments.length})</span>
          </button>

          <button
            onClick={() => onFindMatchesWithAI(barter)}
            className="text-[10px] font-mono font-bold text-copper-penny hover:text-[#A85138] flex items-center space-x-1 cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-[#D4AF37]" />
            <span>AI Match</span>
          </button>
        </div>

        {/* 1-Tap Quick Inquiries Pill Bar (Always visible for fast interaction) */}
        {!isGiver && (
          <div className="space-y-1">
            <span className="text-[8px] font-mono text-soft-sage uppercase tracking-wider block font-bold">1-Tap Quick Inquiries:</span>
            <div className="flex flex-wrap gap-1">
              {QUICK_INQUIRY_PROMPTS.slice(0, 3).map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => {
                    handleSendQuickInquiry(prompt);
                    setShowComments(true);
                  }}
                  className="text-[9px] font-mono bg-[#FAF5EE] hover:bg-amber-100 text-[#1F1813] border border-copper-penny/20 hover:border-[#B87333] px-2 py-1 rounded-xl transition-all active:scale-95 cursor-pointer text-left"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Expanded Comments Drawer */}
        {showComments && (
          <div className="bg-[#FAF5EE]/60 p-3 rounded-2xl border border-copper-penny/15 space-y-3 mt-2">
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {postComments.length === 0 ? (
                <p className="text-[10px] text-soft-sage italic text-center py-2">
                  No questions asked yet. Be the first to ask or send a 1-tap inquiry above!
                </p>
              ) : (
                postComments.map((c) => (
                  <div key={c.id} className={`p-2 rounded-xl text-xs space-y-1 ${c.parentCommentId ? 'ml-4 bg-white/90 border border-copper-penny/15' : 'bg-white border border-copper-penny/10'}`}>
                    <div className="flex items-center justify-between text-[9px] font-mono">
                      <span className="font-bold text-[#1F1813] flex items-center space-x-1">
                        <span>{c.authorName}</span>
                        {c.authorLocation && <span className="text-soft-sage font-normal">({c.authorLocation})</span>}
                      </span>
                      <span className="text-soft-sage">{c.createdAt}</span>
                    </div>
                    <p className="text-[11px] text-[#2A221B]/90 leading-relaxed">{c.text}</p>
                    {c.isQuickInquiry && (
                      <span className="inline-block text-[8px] font-mono bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded">1-Tap Sister Inquiry</span>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Post Comment Input */}
            <form onSubmit={handlePostComment} className="flex items-center space-x-2 pt-1 border-t border-copper-penny/10">
              <input
                type="text"
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Ask a question about this barter..."
                className="w-full bg-white border border-copper-penny/20 rounded-xl px-3 py-1.5 text-xs text-[#1F1813] placeholder-gray-400 focus:outline-none focus:border-[#B87333]"
              />
              <button
                type="submit"
                disabled={!newCommentText.trim()}
                className="px-3 py-1.5 bg-[#B87333] hover:bg-[#A85138] disabled:bg-gray-300 text-white font-mono text-[10px] font-bold rounded-xl transition-all cursor-pointer active:scale-95"
              >
                Send
              </button>
            </form>
          </div>
        )}
      </div>

    </div>
  );
}
