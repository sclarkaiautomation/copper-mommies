import React, { useState } from 'react';
import { 
  Heart, 
  Sparkles, 
  MapPin, 
  ShieldCheck, 
  Award, 
  FileText, 
  ExternalLink, 
  Calendar, 
  Mail, 
  BookOpen, 
  Leaf, 
  ArrowLeft,
  Lock,
  Compass,
  CheckCircle2
} from 'lucide-react';
import { SisterMicroStore, WisdomBadge, ConsultationBooking } from '../types';
import { INITIAL_SISTER_PROFILES, INITIAL_WISDOM_BADGES, INITIAL_CONSULTATION_BOOKINGS } from '../data/phase1CommunityData';

interface SisterProfileModalProps {
  sisterName: string | null;
  onClose: () => void;
  onBookConsultation: (expertName: string, role: string, topic: string) => void;
  userTimeBalance?: number;
  profiles?: SisterMicroStore[];
  currentUserName?: string;
  isOpen?: boolean;
}

export default function SisterProfileModal({
  sisterName,
  onClose,
  onBookConsultation,
  userTimeBalance = 5.0,
  profiles = INITIAL_SISTER_PROFILES,
  currentUserName = 'Sister Mama',
  isOpen = true
}: SisterProfileModalProps) {
  if (!sisterName || !isOpen) return null;

  const profile = profiles.find(p => p.sisterName.toLowerCase().includes(sisterName.toLowerCase())) || profiles[0] || INITIAL_SISTER_PROFILES[0];
  
  const [activeTab, setActiveTab] = useState<'offerings' | 'printables' | 'wisdom' | 'consultation'>('offerings');
  const [consultTopic, setConsultTopic] = useState('');
  const [consultDate, setConsultDate] = useState('2026-07-20');
  const [consultTime, setConsultTime] = useState('2:00 PM EST');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultTopic.trim()) return;
    onBookConsultation(profile.sisterName, profile.wisdomTier === 'Elder Wisdom Keeper' ? 'Homeschool Elder' : 'Master Herbalist', consultTopic);
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#FAF5EE] border-2 border-[#D4AF37]/50 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 relative text-[#1F1813] my-8 animate-in fade-in duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#1F1813] flex items-center justify-center shadow-xs cursor-pointer transition-all border border-copper-penny/20"
        >
          ✕
        </button>

        {/* Profile Top Banner (Stan/Beacons Model) */}
        <div className={`p-6 rounded-2xl bg-gradient-to-br ${profile.bannerTone} border border-copper-penny/20 space-y-4 text-center sm:text-left relative overflow-hidden`}>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            
            {/* Avatar */}
            <div className="w-20 h-20 rounded-2xl bg-[#1F1813] text-4xl flex items-center justify-center shadow-lg shrink-0 border-2 border-[#D4AF37]">
              {profile.avatarEmoji}
            </div>

            <div className="space-y-1 flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h3 className="font-serif font-extrabold text-2xl text-[#1F1813]">
                  {profile.sisterName}
                </h3>
                <span className="text-[10px] font-mono bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded-full font-bold flex items-center space-x-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Vetted Matriarch (b. {profile.birthYear})</span>
                </span>
              </div>

              <p className="text-xs font-mono text-soft-sage">
                {profile.sisterHandle} • <MapPin className="w-3 h-3 inline text-[#B87333]" /> {profile.location}
              </p>

              <p className="text-xs text-[#2A221B]/85 leading-relaxed pt-1 max-w-lg">
                "{profile.bio}"
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-copper-penny/10 text-center">
            <div className="bg-white/80 p-2 rounded-xl border border-copper-penny/10">
              <span className="text-[8px] font-mono uppercase font-bold text-soft-sage block">Wisdom Tier</span>
              <span className="text-xs font-serif font-bold text-[#B87333]">{profile.wisdomTier}</span>
            </div>
            <div className="bg-white/80 p-2 rounded-xl border border-copper-penny/10">
              <span className="text-[8px] font-mono uppercase font-bold text-soft-sage block">Community Trust</span>
              <span className="text-xs font-mono font-bold text-emerald-700">{profile.trustScore}%</span>
            </div>
            <div className="bg-white/80 p-2 rounded-xl border border-copper-penny/10">
              <span className="text-[8px] font-mono uppercase font-bold text-soft-sage block">Trades Completed</span>
              <span className="text-xs font-mono font-bold text-[#1F1813]">{profile.barterCount} Exchanges</span>
            </div>
          </div>
        </div>

        {/* Micro-Storefront Navigation Tabs */}
        <div className="flex items-center justify-center sm:justify-start gap-2 border-b border-copper-penny/10 pb-2 text-xs font-mono font-bold">
          <button
            onClick={() => setActiveTab('offerings')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'offerings' ? 'bg-[#B87333] text-white shadow-xs' : 'bg-white text-[#1F1813] hover:bg-amber-50'
            }`}
          >
            <Leaf className="w-3.5 h-3.5" />
            <span>Herbal &amp; Goods ({profile.herbalCatalog.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('printables')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'printables' ? 'bg-[#B87333] text-white shadow-xs' : 'bg-white text-[#1F1813] hover:bg-amber-50'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Digital Printables ({profile.digitalPrintables.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('consultation')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'consultation' ? 'bg-[#B87333] text-white shadow-xs' : 'bg-white text-[#1F1813] hover:bg-amber-50'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book 30-Min Consult</span>
          </button>
        </div>

        {/* Tab 1: Herbal Catalog & Goods */}
        {activeTab === 'offerings' && (
          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {profile.herbalCatalog.map((item) => (
              <div key={item.id} className="p-3.5 bg-white rounded-2xl border border-copper-penny/15 space-y-1.5 hover:border-copper-penny/35 transition-all shadow-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-sm text-[#1F1813]">{item.name}</h4>
                  <span className="text-[9px] font-mono bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                    {item.pointsOrBarter}
                  </span>
                </div>
                <p className="text-xs text-[#2A221B]/80 leading-relaxed">{item.description}</p>
                <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-[#B87333]">
                  <span>Category: {item.category}</span>
                  <button 
                    onClick={() => alert(`Inquiry initiated for ${item.name}! Check your secure messages.`)}
                    className="underline hover:text-[#A85138] font-bold cursor-pointer"
                  >
                    Request Barter Swap →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Digital Printables */}
        {activeTab === 'printables' && (
          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {profile.digitalPrintables.map((dp) => (
              <div key={dp.id} className="p-3.5 bg-white rounded-2xl border border-copper-penny/15 space-y-1.5 shadow-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-sm text-[#1F1813]">{dp.title}</h4>
                  <span className="text-[9px] font-mono bg-[#B87333]/15 text-[#B87333] px-2 py-0.5 rounded font-bold">
                    {dp.fileType} Format
                  </span>
                </div>
                <p className="text-xs text-[#2A221B]/80 leading-relaxed">{dp.description}</p>
                <div className="pt-1 text-right">
                  <button
                    onClick={() => alert("Digital lesson guide downloaded to your device!")}
                    className="px-3 py-1 bg-[#1F1813] hover:bg-black text-[#D4AF37] text-[10px] font-mono font-bold rounded-lg cursor-pointer"
                  >
                    📥 Download Member Guide
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Consultation Booking */}
        {activeTab === 'consultation' && (
          <div className="space-y-4">
            {bookingSuccess ? (
              <div className="p-6 bg-emerald-50 border border-emerald-300 rounded-2xl text-center space-y-2 text-emerald-900">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-serif font-bold text-lg">Consultation Confirmed with {profile.sisterName}!</h4>
                <p className="text-xs leading-relaxed">
                  1.0 Time Credit held in co-op escrow. Calendar sync link generated and sent to your secure inbox.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBooking} className="bg-white p-4 rounded-2xl border border-copper-penny/20 space-y-3 text-xs">
                <div className="space-y-1">
                  <span className="font-serif font-bold text-sm text-[#1F1813] block">
                    Book a 30-Minute 1-on-1 Sanctuary Consultation
                  </span>
                  <p className="text-[11px] text-soft-sage">
                    Use 1.0 earned co-op Time Credit (Balance: {userTimeBalance.toFixed(1)} hrs). No cash required.
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="block text-[9px] font-mono text-soft-sage uppercase font-bold">
                    Topic of Discussion / Support Needed
                  </label>
                  <input
                    type="text"
                    required
                    value={consultTopic}
                    onChange={(e) => setConsultTopic(e.target.value)}
                    placeholder="e.g. 4th grade geometry curriculum review or postpartum herbs"
                    className="w-full bg-[#FAF5EE] border border-copper-penny/20 rounded-xl px-3 py-2 text-xs text-[#1F1813] focus:outline-none focus:border-[#B87333]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="block text-[9px] font-mono text-soft-sage uppercase font-bold">Preferred Date</label>
                    <input
                      type="date"
                      value={consultDate}
                      onChange={(e) => setConsultDate(e.target.value)}
                      className="w-full bg-[#FAF5EE] border border-copper-penny/20 rounded-xl px-2.5 py-1.5 text-xs text-[#1F1813]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[9px] font-mono text-soft-sage uppercase font-bold">Time Slot</label>
                    <select
                      value={consultTime}
                      onChange={(e) => setConsultTime(e.target.value)}
                      className="w-full bg-[#FAF5EE] border border-copper-penny/20 rounded-xl px-2.5 py-1.5 text-xs text-[#1F1813]"
                    >
                      <option value="11:00 AM EST">11:00 AM EST</option>
                      <option value="2:00 PM EST">2:00 PM EST</option>
                      <option value="4:30 PM EST">4:30 PM EST</option>
                      <option value="7:00 PM EST">7:00 PM EST</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={userTimeBalance < 1.0}
                  className="w-full py-2.5 bg-[#B87333] hover:bg-[#A85138] disabled:bg-gray-300 text-white font-mono text-xs font-bold uppercase rounded-xl transition-all active:scale-95 shadow-md cursor-pointer"
                >
                  {userTimeBalance < 1.0 ? "Need 1.0 Time Credit to Book" : "Confirm Booking & Sync Calendar (1.0 Hr Credit)"}
                </button>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
