import React, { useState } from 'react';
import { 
  ArrowLeftRight, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  UserCheck, 
  FileText, 
  AlertCircle,
  Copy,
  Check,
  Calendar,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { ActiveTradeRecord } from '../types';

interface ActiveTradesTrackerProps {
  trades: ActiveTradeRecord[];
  userName: string;
  onConfirmTradeHandshake: (tradeId: string, role: 'giver' | 'recipient') => void;
  onCancelTrade: (tradeId: string) => void;
  onScheduleMeetup: (tradeId: string, spotName: string, dateStr: string) => void;
  onOpenTradeHandshake?: (trade: ActiveTradeRecord) => void;
}

export default function ActiveTradesTracker({
  trades,
  userName,
  onConfirmTradeHandshake,
  onCancelTrade,
  onScheduleMeetup,
  onOpenTradeHandshake
}: ActiveTradesTrackerProps) {
  const [filterStatus, setFilterStatus] = useState<'All' | 'Pending' | 'Awaiting Handshake' | 'Completed'>('All');
  const [copiedHashId, setCopiedHashId] = useState<string | null>(null);

  const filteredTrades = trades.filter(t => {
    if (filterStatus === 'Pending') return t.status === 'Pending Negotiation';
    if (filterStatus === 'Awaiting Handshake') return t.status === 'Awaiting Safe Handshake';
    if (filterStatus === 'Completed') return t.status === 'Completed Exchange';
    return true;
  });

  const handleCopyReceipt = (hash: string, id: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHashId(id);
    setTimeout(() => setCopiedHashId(null), 3000);
  };

  return (
    <div className="bg-[#FAF5EE] border-2 border-copper-penny/25 rounded-3xl p-5 shadow-lg space-y-4">
      
      {/* Tracker Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-copper-penny/10 pb-3">
        <div>
          <div className="flex items-center space-x-2 text-[#B87333]">
            <ArrowLeftRight className="w-5 h-5 text-[#B87333]" />
            <h3 className="font-serif font-extrabold text-lg text-[#1F1813]">
              My Active Trades &amp; Exchange Tracker
            </h3>
          </div>
          <p className="text-xs text-soft-sage font-mono mt-0.5">
            Monitor incoming &amp; outgoing barter handshakes, safe spot meetups, and cryptographic exchange receipts.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center bg-white p-1 rounded-2xl border border-copper-penny/15 text-[10px] font-mono font-bold">
          {(['All', 'Pending', 'Awaiting Handshake', 'Completed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterStatus(tab)}
              className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                filterStatus === tab 
                  ? 'bg-[#B87333] text-white shadow-xs' 
                  : 'text-[#1F1813] hover:text-[#B87333]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Trades Grid */}
      {filteredTrades.length === 0 ? (
        <div className="text-center py-10 border border-dashed border-copper-penny/20 rounded-2xl bg-white space-y-2 text-xs text-soft-sage">
          <p className="font-serif">No active trade records in this filter status.</p>
          <p className="text-[10px] font-mono">Initiate a trade from the marketplace board to track dual confirmations here!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTrades.map((trade) => {
            const isCompleted = trade.status === 'Completed Exchange';
            const isGiver = trade.role === 'giver';
            const userHasSigned = isGiver ? trade.giverHandshakeSigned : trade.recipientHandshakeSigned;
            const partnerHasSigned = isGiver ? trade.recipientHandshakeSigned : trade.giverHandshakeSigned;

            return (
              <div 
                key={trade.id}
                className="bg-white border border-copper-penny/15 hover:border-copper-penny/35 rounded-2xl p-4 shadow-sm transition-all space-y-3"
              >
                {/* Trade Top Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-copper-penny/10 pb-2">
                  <div>
                    <span className="text-[9px] font-mono uppercase font-bold text-soft-sage">
                      Exchange Listing • {trade.listingCategory}
                    </span>
                    <h4 className="font-serif font-bold text-base text-[#1F1813]">
                      {trade.listingTitle}
                    </h4>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center space-x-2">
                    <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border flex items-center space-x-1 ${
                      isCompleted 
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                        : trade.status === 'Awaiting Safe Handshake'
                          ? 'bg-amber-50 text-amber-800 border-amber-300'
                          : 'bg-blue-50 text-blue-800 border-blue-300'
                    }`}>
                      {isCompleted ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Clock className="w-3 h-3" />}
                      <span>{trade.status}</span>
                    </span>
                  </div>
                </div>

                {/* Exchange Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {/* You Offer */}
                  <div className="bg-[#FAF5EE] p-3 rounded-xl border border-copper-penny/10 space-y-1">
                    <span className="text-[9px] font-mono text-soft-sage uppercase font-bold block">
                      {trade.role === 'giver' ? '🌱 You Are Providing:' : '🎁 You Are Receiving:'}
                    </span>
                    <p className="font-bold text-[#1F1813] text-[12px]">{trade.offeredItemOrService}</p>
                    <span className="text-[9px] font-mono text-[#B87333] block">Valued at {trade.pointsValue} CMC Credits</span>
                  </div>

                  {/* Partner Counterpart */}
                  <div className="bg-[#FAF5EE] p-3 rounded-xl border border-copper-penny/10 space-y-1">
                    <span className="text-[9px] font-mono text-soft-sage uppercase font-bold block">
                      Exchange Partner: <strong>{trade.partnerName}</strong> ({trade.partnerContact})
                    </span>
                    <p className="font-bold text-[#A85138] text-[12px]">{trade.requestedItemOrService}</p>
                    <span className="text-[9px] font-mono text-soft-sage block">Initiated: {trade.initiatedAt}</span>
                  </div>
                </div>

                {/* Meetup & Safe Spot Row */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-2.5 bg-amber-50/50 rounded-xl border border-amber-200/60 text-xs">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-[#B87333] shrink-0" />
                    <div>
                      <span className="font-bold text-[#1F1813] block">
                        Meetup: {trade.meetupLocation || 'Safe Exchange Spot Scheduled'}
                      </span>
                      {trade.scheduledDate && (
                        <span className="text-[10px] text-soft-sage font-mono">
                          📅 {trade.scheduledDate}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-[9px] font-mono bg-amber-100/80 px-2 py-0.5 rounded border border-amber-300 text-amber-900 font-bold flex items-center space-x-1">
                      <span>⏳ Time Bank Escrow Reserved</span>
                    </span>
                    <span className="text-[9px] font-mono bg-white px-2 py-0.5 rounded border border-amber-300 text-amber-800 font-bold flex items-center space-x-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>Daylight Safe Zone</span>
                    </span>
                  </div>
                </div>

                {/* 4-Stage Visual Progress Bar */}
                <div className="p-2 rounded-xl bg-[#FAF5EE] border border-copper-penny/10 space-y-1.5">
                  <div className="flex items-center justify-between text-[9px] font-mono text-soft-sage font-bold">
                    <span>Handshake Progression</span>
                    <span className="text-[#B87333]">
                      {isCompleted ? 'Stage 4: Fulfilled' : trade.status === 'Awaiting Safe Handshake' ? 'Stage 3: Escrow Locked' : 'Stage 1: Proposal Active'}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1 text-center font-mono text-[8.5px]">
                    <div className={`py-1 px-1 rounded ${
                      trade.status === 'Pending Negotiation' || trade.status === 'Awaiting Safe Handshake' || isCompleted
                        ? 'bg-amber-600 text-white font-bold'
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      1. Proposal
                    </div>
                    <div className={`py-1 px-1 rounded ${
                      trade.status === 'Awaiting Safe Handshake' || isCompleted
                        ? 'bg-amber-600 text-white font-bold'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      2. Counter/Review
                    </div>
                    <div className={`py-1 px-1 rounded ${
                      trade.status === 'Awaiting Safe Handshake' || isCompleted
                        ? 'bg-[#B87333] text-white font-bold'
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      3. Terms Locked
                    </div>
                    <div className={`py-1 px-1 rounded ${
                      isCompleted
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      4. Fulfilled
                    </div>
                  </div>
                </div>

                {/* Next Steps Prompt */}
                <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-[10.5px] font-mono text-[#1F1813] flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-1.5 min-w-0">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="truncate">
                      {isCompleted 
                        ? '✓ Exchange confirmed! Digital co-op receipt generated and +5 Generosity Points awarded.'
                        : trade.status === 'Awaiting Safe Handshake'
                        ? 'Next: Meet at daylight spot or deliver goods, then sign your safe handshake below.'
                        : `Next: Awaiting ${trade.partnerName}'s acceptance or counter-proposal.`}
                    </span>
                  </div>

                  {onOpenTradeHandshake && (
                    <button
                      type="button"
                      onClick={() => onOpenTradeHandshake(trade)}
                      className="px-2.5 py-1 bg-[#1F140E] hover:bg-black text-[#D4AF37] border border-[#D4AF37]/50 rounded-lg text-[9px] font-bold font-mono transition-all shrink-0 cursor-pointer flex items-center space-x-1 shadow-xs"
                    >
                      <ArrowLeftRight className="w-3 h-3" />
                      <span>Manage Handshake</span>
                    </button>
                  )}
                </div>

                {/* Handshake Signatures & Receipt */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1 text-xs">
                  {/* Signature Badges */}
                  <div className="flex items-center space-x-2 font-mono text-[10px]">
                    <span className={`px-2 py-0.5 rounded border flex items-center space-x-1 ${
                      userHasSigned ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold' : 'bg-gray-100 text-gray-700 border-gray-300'
                    }`}>
                      <span>Your Signature: {userHasSigned ? '✓ Signed' : '⏳ Pending'}</span>
                    </span>

                    <span className={`px-2 py-0.5 rounded border flex items-center space-x-1 ${
                      partnerHasSigned ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold' : 'bg-gray-100 text-gray-700 border-gray-300'
                    }`}>
                      <span>{trade.partnerName}: {partnerHasSigned ? '✓ Signed' : '⏳ Pending'}</span>
                    </span>
                  </div>

                  {/* Actions & Receipt */}
                  <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                    {!isCompleted && !userHasSigned && (
                      <button
                        onClick={() => onConfirmTradeHandshake(trade.id, trade.role === 'giver' ? 'giver' : 'recipient')}
                        className="px-4 py-1.5 bg-[#B87333] hover:bg-[#A85138] text-white font-mono text-[10px] font-bold uppercase rounded-xl transition-all shadow-xs active:scale-95 cursor-pointer"
                      >
                        ✍️ Sign Safe Handshake
                      </button>
                    )}

                    {isCompleted && trade.digitalReceiptHash && (
                      <button
                        onClick={() => handleCopyReceipt(trade.digitalReceiptHash!, trade.id)}
                        className="px-3 py-1.5 bg-[#1F140E] hover:bg-black text-[#D4AF37] font-mono text-[10px] font-bold rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer shadow-xs"
                      >
                        {copiedHashId === trade.id ? <Check className="w-3 h-3 text-emerald-400" /> : <FileText className="w-3 h-3" />}
                        <span>{copiedHashId === trade.id ? 'Receipt Copied!' : 'Digital Co-op Receipt'}</span>
                      </button>
                    )}

                    {!isCompleted && (
                      <button
                        onClick={() => onCancelTrade(trade.id)}
                        className="text-[10px] font-mono text-soft-sage hover:text-rose-600 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
