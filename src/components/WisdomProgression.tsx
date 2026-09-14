import React from 'react';
import { 
  Award, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  Flame, 
  Sprout, 
  Users, 
  Heart,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { WisdomBadge } from '../types';
import { INITIAL_WISDOM_BADGES } from '../data/phase1CommunityData';

interface WisdomProgressionProps {
  userName: string;
  userTrustScore: number;
  completedTradesCount: number;
  verifiedCareHours: number;
  onOpenBadgeDetails?: (badge: WisdomBadge) => void;
}

export default function WisdomProgression({
  userName,
  userTrustScore,
  completedTradesCount,
  verifiedCareHours,
  onOpenBadgeDetails
}: WisdomProgressionProps) {
  const currentTier = completedTradesCount >= 10 && verifiedCareHours >= 5 
    ? 'Homestead Pillar' 
    : 'Sprouting Sister';

  return (
    <div className="bg-[#FAF5EE] border-2 border-[#D4AF37]/30 rounded-3xl p-5 shadow-lg space-y-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-copper-penny/10 pb-3">
        <div className="flex items-center space-x-2 text-[#B87333]">
          <Award className="w-5 h-5 text-[#D4AF37]" />
          <div>
            <h3 className="font-serif font-extrabold text-lg text-[#1F1813]">
              Sisterhood Wisdom Progression (Skool Tier Model)
            </h3>
            <p className="text-xs text-soft-sage font-mono">
              Earn community honors, level up your village standing, and unlock elder circles through reciprocal service.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-amber-100/70 border border-amber-300 px-3 py-1.5 rounded-2xl shrink-0">
          <Sparkles className="w-4 h-4 text-amber-700" />
          <span className="font-serif font-extrabold text-xs text-amber-900">
            Current Rank: {currentTier}
          </span>
        </div>
      </div>

      {/* Tier Steps Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        
        {/* Tier 1 */}
        <div className="bg-white p-3.5 rounded-2xl border-2 border-emerald-300 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-mono bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full font-bold">Tier 1 • Active</span>
            <span className="text-lg">🌱</span>
          </div>
          <h4 className="font-serif font-bold text-sm text-[#1F1813]">Sprouting Sister</h4>
          <p className="text-[11px] text-soft-sage leading-relaxed">
            Pass 1995 Vetting Covenant, post first trade, and complete 2 initial co-op handshakes.
          </p>
          <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-emerald-700 font-bold border-t border-copper-penny/5">
            <span>Status: Completed ✓</span>
            <span>100%</span>
          </div>
        </div>

        {/* Tier 2 */}
        <div className="bg-white p-3.5 rounded-2xl border-2 border-amber-400 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-mono bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold">Tier 2 • Current</span>
            <span className="text-lg">🏡</span>
          </div>
          <h4 className="font-serif font-bold text-sm text-[#1F1813]">Homestead Pillar</h4>
          <p className="text-[11px] text-soft-sage leading-relaxed">
            10+ confirmed mutual aid trades, 5+ hours volunteer daycare/meal care, and 95%+ community trust.
          </p>
          <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-amber-800 font-bold border-t border-copper-penny/5">
            <span>Progress: {completedTradesCount}/10 Trades</span>
            <span>{Math.min(100, Math.round((completedTradesCount / 10) * 100))}%</span>
          </div>
        </div>

        {/* Tier 3 */}
        <div className="bg-white p-3.5 rounded-2xl border border-copper-penny/20 shadow-xs space-y-2 opacity-90">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-mono bg-[#1F1813] text-[#D4AF37] px-2 py-0.5 rounded-full font-bold">Tier 3 • Elder Council</span>
            <span className="text-lg">🕊️</span>
          </div>
          <h4 className="font-serif font-bold text-sm text-[#1F1813]">Elder Wisdom Keeper</h4>
          <p className="text-[11px] text-soft-sage leading-relaxed">
            Mentor a rising mother, host 3 offline porch tea circles, and steward state co-op circles.
          </p>
          <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-soft-sage border-t border-copper-penny/5">
            <span>Requirements: 25+ Exchanges</span>
            <span>Council Review</span>
          </div>
        </div>

      </div>

      {/* Badges Inventory */}
      <div className="space-y-2 pt-1">
        <span className="text-[10px] font-mono uppercase font-bold text-soft-sage block">
          🏆 Earned Badges &amp; Village Honors:
        </span>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {INITIAL_WISDOM_BADGES.map((badge) => (
            <div
              key={badge.id}
              onClick={() => onOpenBadgeDetails && onOpenBadgeDetails(badge)}
              className={`p-3 rounded-2xl border text-center space-y-1.5 transition-all cursor-pointer ${
                badge.unlocked
                  ? 'bg-white border-[#D4AF37]/40 shadow-xs hover:border-[#D4AF37]'
                  : 'bg-white/40 border-gray-200 opacity-60'
              }`}
            >
              <div className="text-2xl">{badge.icon}</div>
              <h5 className="font-serif font-bold text-[11px] text-[#1F1813] leading-tight">{badge.title}</h5>
              <span className="block text-[8px] font-mono text-soft-sage">{badge.tier}</span>
              
              {badge.unlocked ? (
                <span className="inline-block text-[8px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                  Unlocked ✓
                </span>
              ) : (
                <span className="inline-block text-[8px] font-mono text-soft-sage bg-gray-100 px-1.5 py-0.2 rounded">
                  {badge.progressPercent}% In Progress
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
