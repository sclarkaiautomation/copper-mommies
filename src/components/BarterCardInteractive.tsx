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
}

const QUICK_INQUIRY_PROMPTS = [
  "🕊️ Sister, is this still available for trade?",
  "🌱 I have heirloom seeds and dried herbs to trade!",
  "🧴 Is this batch whipped with essential oils or unscented?",
  "🚗 Can we swap this Tuesday afternoon at the cascade library?",
  "👶 Would you be open to exchanging for homeschool printables?"
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
    onOpenProfile
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

  return (
    <div className="border border-[#1F1813]/10 hover:border-copper-penny/35 bg-white rounded-3xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300 space-y-4 flex flex-col justify-between">
      
      {/* Top Header & Metadata */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between flex-wrap gap-1.5">
          <span className="text-[9px] font-mono font-bold uppercase bg-[#B87333]/10 text-[#B87333] px-2.5 py-0.5 rounded-full border border-[#B87333]/20">
            {barter.category}
          </span>
          
          <span className={`text-[9px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border ${
            barter.intentTag === 'I need' 
              ? 'bg-rose-50 text-rose-700 border-rose-200' 
              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
          }`}>
            {barter.intentTag || 'I have'}
          </span>

          <span className="text-[9px] font-mono font-bold uppercase bg-[#FAF5EE] text-copper-penny px-2 py-0.5 rounded-full border border-copper-penny/10">
            {barter.requestType || 'Barter'}
          </span>

          <span className="text-[10px] text-soft-sage font-mono ml-auto">
            {barter.createdAt ? barter.createdAt.split('T')[0] : 'Today'}
          </span>
        </div>

        {/* Title, Proximity and Profile Link */}
        <div>
          <h4 className="font-serif font-extrabold text-base text-[#1F1813] leading-snug">
            {barter.title}
          </h4>
          <div className="flex items-center justify-between mt-1 text-[10px] font-mono text-soft-sage">
            <span className="flex items-center space-x-1">
              <MapPin className="w-3 h-3 text-[#B87333] shrink-0" />
              <span>
                {(() => {
                  if (barter.city && barter.cityZip) {
                    if (barter.cityZip.toLowerCase().includes(barter.city.toLowerCase())) {
                      return barter.cityZip.includes(barter.locationState) ? barter.cityZip : `${barter.cityZip}, ${barter.locationState}`;
                    }
                    return `${barter.city} (${barter.cityZip}), ${barter.locationState}`;
                  }
                  if (barter.city) {
                    return `${barter.city}, ${barter.locationState}`;
                  }
                  if (barter.cityZip) {
                    return barter.cityZip.includes(barter.locationState) ? barter.cityZip : `${barter.cityZip}, ${barter.locationState}`;
                  }
                  return `${barter.locationState} Circle`;
                })()}
              </span>
            </span>
            <button
              onClick={() => handleOpenProfile && handleOpenProfile(barter.offerBy)}
              className="text-[#B87333] hover:text-[#A85138] font-bold underline cursor-pointer"
            >
              By {barter.offerBy}
            </button>
          </div>
        </div>

        <p className="text-xs text-[#2A221B]/85 leading-relaxed">{barter.description}</p>
      </div>

      {/* Trade Terms & Points Card */}
      <div className="bg-[#FAF5EE]/70 p-3 rounded-2xl border border-copper-penny/10 space-y-1.5 text-xs">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-mono text-[9px] text-soft-sage uppercase tracking-wider font-bold">
            {isGift ? "Gift Delivery:" : "Sister Desires:"}
          </span>
          <span className="font-bold text-[#A85138] truncate max-w-[170px]">{barter.tradeFor || "Open Mutual Aid"}</span>
        </div>
        
        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-dashed border-copper-penny/15">
          <span className="font-mono text-[9px] text-soft-sage uppercase tracking-wider font-bold">Ledger Valuation:</span>
          {isGift ? (
            <span className="font-mono text-[9px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-extrabold flex items-center space-x-1">
              <Heart className="w-2.5 h-2.5 text-emerald-600 fill-emerald-600" />
              <span>Village Gift (Exempt)</span>
            </span>
          ) : (
            <span className="font-mono text-[10px] font-bold text-copper-penny">{barter.valuePoints || 5} points / hours</span>
          )}
        </div>
      </div>

      {/* Handshake Status & Action Controls */}
      <div className="bg-[#FAF5EE]/40 p-3 rounded-2xl border border-[#B87333]/15 space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[9px] uppercase tracking-wider text-soft-sage font-bold flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-copper-penny" />
            <span>Co-op Handshake State</span>
          </span>
          <span className="font-mono text-[9px] font-bold">
            {barter.handshakeComplete ? (
              <span className="text-emerald-700 font-extrabold flex items-center space-x-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline shrink-0" />
                <span>Dual Handshake Signed</span>
              </span>
            ) : (
              <span className="text-[#A85138] font-bold">⏳ In Negotiation</span>
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
            <span className={barter.recipientConfirmed ? "text-emerald-600 font-bold" : "text-amber-600"}>
              {barter.recipientConfirmed ? "✓ Signed" : "⏳ Pending"}
            </span>
          </div>
        </div>

        {/* Handshake & Start Trade Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
          {!isGiver && !barter.handshakeComplete && (
            <button
              onClick={() => onInitiateTrade(barter, selectedSafeSpot || undefined)}
              className="w-full sm:w-1/2 py-1.5 bg-[#B87333] hover:bg-[#A85138] text-white text-[10px] font-mono font-bold uppercase rounded-xl shadow-xs hover:shadow transition-all active:scale-95 cursor-pointer flex items-center justify-center space-x-1"
            >
              <span>🤝 Initiate Trade</span>
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
            <span>Community Q&amp;A &amp; Sister Notes ({postComments.length})</span>
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
            <span className="text-[8px] font-mono text-soft-sage uppercase tracking-wider block font-bold">1-Tap Safe Sister Inquiries:</span>
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
                  No questions asked yet. Be the first sister to ask or send a 1-tap inquiry above!
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
