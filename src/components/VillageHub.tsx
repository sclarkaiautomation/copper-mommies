import React, { useState } from 'react';
import { BookOpen, Users, Calendar, Clock, MapPin, Sparkles, ArrowRight, CheckCircle, Info, Plus, Sprout, AlertTriangle, ShieldCheck, GraduationCap, Palette } from 'lucide-react';
import { CoopEvent, PageSpotlightBanner, ScholarshipEntry } from '../types';
import SpotlightBanner from './SpotlightBanner';
import UrgentCarePod from './UrgentCarePod';
import NestBrightCoopPortal from './NestBrightCoopPortal';
import DeviMommieCreativeStudio from './DeviMommieCreativeStudio';
import { INITIAL_URGENT_CARE_ALERTS } from '../data/phase1CommunityData';

interface VillageHubProps {
  onConsult: (prompt: string, category: 'village') => void;
  aiLoading: boolean;
  aiResponse: string | null;
  getLoadingNote: () => string;
  eventsList: CoopEvent[];
  selectedState: string;
  onAddEarnHours: (activity: string, hours: number) => void;
  spotlightBanner?: PageSpotlightBanner;
  banners?: PageSpotlightBanner[];
  onAddScholarshipEntry?: (entry: Omit<ScholarshipEntry, 'id' | 'submittedAt' | 'verifiedStatus' | 'ticketCode'>) => void;
  onEnterContest?: (entry: ScholarshipEntry) => void;
  scholarshipEntriesCount?: number;
  userName?: string;
  userEmail?: string;
  isAdmin?: boolean;
  onOpenAdminManager?: () => void;
}

const defaultNestBrightBanner: PageSpotlightBanner = {
  id: 'spotlight-nestbright',
  pageId: 'village',
  active: true,
  categoryBadge: 'Featured Homeschool Partner Spotlight',
  title: 'NestBright Academy — Your Child’s Flight Path to Excellence',
  subtitle: 'Self-Determined Elementary Learning for Grades 3–5',
  bannerImage: '/nestbright_banner.jpg',
  externalLink: 'https://nestbrightacademy.com',
  linkText: 'Visit NestBrightAcademy.com',
  description: 'NestBright Academy empowers young scholars with engaging, high-standard elementary curricula designed to inspire mastery and curiosity. We are gifting 5 Copper Mommies with free 1-year access for elementary students (grades 3–5), while all sisters receive an exclusive village rate of just $5.99/month!',
  promoCode: 'COPPERMOMMIES',
  promoHeadline: 'Exclusive Village Member Rate',
  promoPrice: '$5.99/mo',
  regularPrice: '$24.99/mo',
  promoLink: 'https://nestbrightacademy.com/#choose-plan',
  hasContest: true,
  contestTitle: '5 Full 1-Year Free Access Scholarships',
  contestSubtitle: 'Sponsored by NestBright Academy for Copper Mommies',
  contestPrizeCount: 5,
  contestEligibility: 'Eligible: Elementary Children in Grades 3, 4, or 5',
  contestRequirements: [
    'Must be an active or applicant Copper Mommies member',
    'Child entering or currently in Grade 3, Grade 4, or Grade 5',
    'Submit child name, grade level, and a short 1-2 sentence homeschool goal'
  ],
  contestDeadline: 'Awarded live at the upcoming New Moon Gathering',
  contactEmail: 'support@nestbrightacademy.com',
  contactActionLabel: 'Contact for Code Support'
};

export default function VillageHub({ 
  onConsult, 
  aiLoading, 
  aiResponse, 
  getLoadingNote, 
  eventsList, 
  selectedState, 
  onAddEarnHours,
  spotlightBanner = defaultNestBrightBanner,
  banners,
  onAddScholarshipEntry,
  scholarshipEntriesCount = 14,
  userName = 'Mama Shantrece',
  userEmail = 'shantrece@coppermommies.co',
  isAdmin = false,
  onOpenAdminManager
}: VillageHubProps) {
  const [aiPrompt, setAiPrompt] = useState('');
  
  // Daycare rotating weekly schedule state
  const [scheduleSlots, setScheduleSlots] = useState([
    { id: 'mon', day: 'Monday Morning', title: 'Lineage Story Circle & Writing', host: 'Mama Shantrece', slots: ['Amari (Age 4)', 'Isaiah (Age 5)'], maxSlots: 4, isLandSteward: false },
    { id: 'wed', day: 'Wednesday Afternoon', title: 'Soil Exploration & Garden Math', host: 'Auntie Brenda', slots: ['Zuri (Age 6)'], maxSlots: 4, isLandSteward: true },
    { id: 'fri', day: 'Friday Co-op Block', title: 'Cooperative Play & Traditional Crafts', host: 'Open Slot', slots: [], maxSlots: 5, isLandSteward: false },
  ]);

  const [volunteeringDay, setVolunteeringDay] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'coop' | 'urgent-care' | 'nestbright-beta' | 'devi-mommie'>('coop');
  const [urgentCareAlerts, setUrgentCareAlerts] = useState(INITIAL_URGENT_CARE_ALERTS);

  const handleRespondAlert = (alertId: string, note: string) => {
    setUrgentCareAlerts(prev => prev.map(a => {
      if (a.id === alertId) {
        return {
          ...a,
          responders: [...a.responders, { sisterName: userName || 'Sister Mama', note, respondedAt: 'Just now' }]
        };
      }
      return a;
    }));
    alert("Heartfelt gratitude! Your mutual aid offer has been sent to the sister.");
  };

  const handleCreateAlert = (newAlert: any) => {
    const alertObj = {
      ...newAlert,
      id: `sos-${Date.now()}`,
      status: 'Open SOS',
      createdAt: 'Just now',
      responders: []
    };
    setUrgentCareAlerts(prev => [alertObj, ...prev]);
    alert("Village SOS alert published to local sisters!");
  };

  const handleVolunteerHost = (dayId: string, motherName: string) => {
    setScheduleSlots(prev => prev.map(slot => {
      if (slot.id === dayId) {
        return { ...slot, host: motherName };
      }
      return slot;
    }));
    // Log earn credit
    onAddEarnHours(`Volunteered to host ${dayId.toUpperCase()} daycare block`, 4.0);
    alert(`Thank you, sister! You have volunteered to host. This has earned you +4.0 co-op credit hours on your balance!`);
  };

  const handleAddChild = (dayId: string, childName: string) => {
    if (!childName.trim()) return;
    setScheduleSlots(prev => prev.map(slot => {
      if (slot.id === dayId) {
        if (slot.slots.length >= slot.maxSlots) {
          alert("This slot is fully packed, Sister. Try another block or request an extra loop.");
          return slot;
        }
        return { ...slot, slots: [...slot.slots, childName] };
      }
      return slot;
    }));
  };

  const handleAdvisorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    onConsult(aiPrompt, 'village');
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto my-2">
      {/* Header */}
      <div className="border-b border-[#A85138]/30 pb-3">
        <div className="flex items-center space-x-2.5 text-[#A85138] mb-1">
          <BookOpen className="w-5 h-5 text-[#A85138]" />
          <span className="font-mono text-xs uppercase tracking-widest font-semibold text-[#B87333]">District 1</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#1F1813]">
          The Education &amp; Village Hub
        </h2>
        <p className="text-xs sm:text-sm text-[#2A221B]/80 max-w-2xl mt-0.5 leading-relaxed">
          Raising the generation on our own terms. Access self-determined American ancestral homeschooling materials, register children for rotating study groups, and swap child care hours without commercial cash.
        </p>
      </div>

      {/* Featured Partner & Member Spotlight: NestBright Academy */}
      <SpotlightBanner
        banners={banners}
        banner={spotlightBanner}
        userName={userName}
        userEmail={userEmail}
        selectedState={selectedState}
        onAddScholarshipEntry={onAddScholarshipEntry}
        entriesCount={scholarshipEntriesCount}
        isAdmin={isAdmin}
        onOpenAdminManager={onOpenAdminManager}
      />

      {/* Village Hub Sub-Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono font-bold">
        <button
          onClick={() => setActiveTab('coop')}
          className={`px-4 py-2 rounded-2xl transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
            activeTab === 'coop'
              ? 'bg-[#B87333] text-white shadow-md'
              : 'bg-white text-[#1F1813] hover:bg-amber-50 border border-copper-penny/20'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Rotating Study Co-op &amp; Curriculum</span>
        </button>

        <button
          onClick={() => setActiveTab('nestbright-beta')}
          className={`px-4 py-2 rounded-2xl transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
            activeTab === 'nestbright-beta'
              ? 'bg-[#0047AB] text-white shadow-md'
              : 'bg-white text-[#1F1813] hover:bg-blue-50 border border-[#0047AB]/30'
          }`}
        >
          <GraduationCap className="w-4 h-4 text-[#00EEEE]" />
          <span>NestBright Academy (Beta Access &amp; Interactive Math)</span>
        </button>

        <button
          onClick={() => setActiveTab('devi-mommie')}
          className={`px-4 py-2 rounded-2xl transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
            activeTab === 'devi-mommie'
              ? 'bg-[#2D1B12] text-[#D4AF37] shadow-md border border-[#D4AF37]'
              : 'bg-white text-[#1F1813] hover:bg-amber-50 border border-copper-penny/20'
          }`}
        >
          <Palette className="w-4 h-4 text-[#D4AF37]" />
          <span>Devi &amp; Mommie Studios (Speedway Printables)</span>
        </button>

        <button
          onClick={() => setActiveTab('urgent-care')}
          className={`px-4 py-2 rounded-2xl transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
            activeTab === 'urgent-care'
              ? 'bg-rose-700 text-white shadow-md'
              : 'bg-white text-[#1F1813] hover:bg-rose-50 border border-rose-300'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-rose-500" />
          <span>Local Pod Urgent Care (Village SOS)</span>
        </button>
      </div>

      {activeTab === 'urgent-care' && (
        <UrgentCarePod
          selectedState={selectedState}
          userName={userName || 'Sister Mama'}
          alerts={urgentCareAlerts}
          onRespondAlert={handleRespondAlert}
          onCreateAlert={handleCreateAlert}
        />
      )}

      {activeTab === 'nestbright-beta' && (
        <div className="space-y-6 animate-fade-in">
          <NestBrightCoopPortal
            userName={userName || 'Sister Mama'}
            userEmail={userEmail || 'sister@coppermommies.co'}
            onShowToast={(msg) => alert(msg)}
          />
        </div>
      )}

      {activeTab === 'devi-mommie' && (
        <div className="space-y-6 animate-fade-in">
          <DeviMommieCreativeStudio
            onShowToast={(msg) => alert(msg)}
          />
        </div>
      )}

      <div className={`bg-[#FAF5EE]/30 border border-copper-penny/15 rounded-3xl p-4 sm:p-5 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-5 ${
        activeTab !== 'coop' ? 'hidden' : ''
      }`}>
        
        {/* Main Content Area: Left 8 columns */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Daycare Weekly Scheduling Loop */}
          <div className="bg-[#FAF5EE] border-2 border-[#1F1813]/5 rounded-3xl p-5 shadow-lg space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-earth-sienna/10 text-earth-sienna flex items-center justify-center border border-earth-sienna/20">
                <Users className="w-4.5 h-4.5 text-[#A85138]" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-[#1F1813]">Rotating Daycare &amp; Study Co-op Scheduler</h3>
                <p className="text-[10px] font-mono text-soft-sage uppercase tracking-wider font-bold">Free Shared Co-Care</p>
              </div>
            </div>

            <p className="text-xs text-[#2A221B]/80 leading-relaxed">
              Mothers pool their homes on rotation. Vetted sisters host small, structured study circles for local children. Volunteering to host a 4-hour slot earns you <strong>+4.0 hours of time-credits</strong> in the ledger, while enrolling a child spends equal care credits.
            </p>

            <div className="space-y-4">
              {scheduleSlots.map((slot) => (
                <div key={slot.id} className="border border-[#1F1813]/10 bg-white rounded-2xl p-4 hover:border-copper-penny/25 shadow-sm transition-all space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-copper-penny/5 pb-2">
                    <div>
                      <span className="text-[10px] font-mono text-soft-sage font-bold uppercase block">{slot.day}</span>
                      <h4 className="font-serif font-bold text-sm text-[#1F1813]">{slot.title}</h4>
                    </div>
                    <div className="text-xs flex items-center gap-2">
                      <span className="text-[#2A221B]/70">Eldest Host:</span>
                      <strong className="text-copper-penny font-bold">{slot.host}</strong>
                      {slot.isLandSteward && (
                          <span className="text-[8px] font-mono font-bold uppercase bg-[#D4AF37]/10 text-[#D4AF37] px-1.5 py-0.5 rounded-full border border-[#D4AF37]/35 flex items-center gap-0.5 shadow-2xs">
                            <Sprout className="w-2 h-2 text-[#D4AF37]" />
                            <span>Land Steward</span>
                          </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-0.5">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-soft-sage uppercase font-bold block">Enrolled Children ({slot.slots.length}/{slot.maxSlots}):</span>
                      {slot.slots.length === 0 ? (
                        <span className="text-xs text-soft-sage italic block">No children enrolled yet</span>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {slot.slots.map((child, idx) => (
                            <span key={idx} className="text-[10px] font-medium bg-[#FAF5EE]/50 text-[#1F1813] border border-copper-penny/15 px-2 py-0.5 rounded-lg shadow-2xs">
                              👶 {child}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {/* Volunteer to Host Button */}
                      {slot.host === 'Open Slot' ? (
                        <button 
                          onClick={() => handleVolunteerHost(slot.id, 'Mama Shantrece')}
                          className="px-3.5 py-1.5 bg-[#B87333] hover:bg-[#A85138] border border-[#96551d]/30 text-white text-xs font-mono font-bold rounded-lg shadow-sm hover:shadow-md active:scale-95 transition-all cursor-pointer"
                        >
                          👋 Volunteer as Host (+4 hrs)
                        </button>
                      ) : null}

                      {/* Add Child Input */}
                      <button 
                        onClick={() => {
                          const child = prompt("Enter your child's name & age:");
                          if (child) {
                            handleAddChild(slot.id, child);
                            onAddEarnHours(`Enrolled child in ${slot.day} study block`, -1.5);
                          }
                        }}
                        className="px-3 py-1.5 bg-white border-2 border-copper-penny/35 hover:border-copper-penny text-copper-penny text-xs font-bold rounded-lg shadow-xs hover:shadow active:scale-95 transition-all flex items-center space-x-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Enroll Child (-1.5 hrs)</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Homeschooling Curriculum Library */}
          <div className="bg-[#FAF5EE] border-2 border-[#1F1813]/5 rounded-3xl p-5 shadow-lg space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-copper-penny/15 text-copper-penny flex items-center justify-center border border-copper-penny/35">
                <BookOpen className="w-4.5 h-4.5 text-copper-penny" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-[#1F1813]">Homeschooling Learning Library</h3>
                <p className="text-[10px] font-mono text-soft-sage uppercase tracking-wider font-bold">Community Education Resources</p>
              </div>
            </div>

            <p className="text-xs text-[#2A221B]/80 leading-relaxed">
              These shared educational guides are recommended by mothers in our community to support standard grade milestones while celebrating our heritage, storytelling, and creativity.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-copper-penny/10 bg-white rounded-xl p-3.5 space-y-1.5 hover:border-copper-penny/25 transition-colors shadow-sm">
                <div className="flex items-start justify-between">
                  <h4 className="font-serif font-bold text-sm text-[#1F1813]">Practical Math &amp; Geometry (K-5)</h4>
                  <span className="text-[9px] font-mono font-bold uppercase bg-copper-penny/10 text-copper-penny border border-copper-penny/20 px-1.5 py-0.5 rounded">PDF</span>
                </div>
                <p className="text-xs text-[#2A221B]/75 leading-relaxed">
                  Teach shapes, sizing, fractions, and proportions through hands-on quilt patterns and building projects.
                </p>
                <div className="pt-1 flex justify-between items-center text-[10px] font-mono text-soft-sage">
                  <span>Shared by: Mama Jamila</span>
                  <span className="font-bold text-[#B87333] hover:underline cursor-pointer" onClick={() => alert("Curriculum saved to local device successfully.")}>Download Guide</span>
                </div>
              </div>

              <div className="border border-copper-penny/10 bg-white rounded-xl p-3.5 space-y-1.5 hover:border-copper-penny/25 transition-colors shadow-sm">
                <div className="flex items-start justify-between">
                  <h4 className="font-serif font-bold text-sm text-[#1F1813]">Storytelling &amp; History (Grades 1-3)</h4>
                  <span className="text-[9px] font-mono font-bold uppercase bg-copper-penny/10 text-copper-penny border border-copper-penny/20 px-1.5 py-0.5 rounded">Audio Pack</span>
                </div>
                <p className="text-xs text-[#2A221B]/75 leading-relaxed">
                  A multi-part audio series sharing stories, cultural traditions, and family histories of melanated women across America.
                </p>
                <div className="pt-1 flex justify-between items-center text-[10px] font-mono text-soft-sage">
                  <span>Shared by: Sister Nicole</span>
                  <span className="font-bold text-[#B87333] hover:underline cursor-pointer" onClick={() => alert("Audio mp3 curriculum downloaded.")}>Download Audio</span>
                </div>
              </div>
            </div>
          </div>

          {/* Real-Life Homeschool Field Trips & Nature Days */}
          <div className="bg-[#FAF5EE] border-2 border-[#1F1813]/5 rounded-3xl p-5 shadow-lg space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-[#B87333]/15 text-[#B87333] flex items-center justify-center border border-[#B87333]/30">
                <Users className="w-4.5 h-4.5 text-[#B87333]" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-[#1F1813]">Offline Homeschool Co-op Field Trips</h3>
                <p className="text-[10px] font-mono text-soft-sage uppercase tracking-wider font-bold">In-Person Nature &amp; Village Days</p>
              </div>
            </div>

            <p className="text-xs text-[#2A221B]/80 leading-relaxed">
              Screen connection is just the starting point. Vetted mothers coordinate local park days, farm trips, hands-on sewing, carpentry, and botany walks across the <strong>{selectedState} region</strong>.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-2xl border border-copper-penny/15 space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono font-bold uppercase bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded">
                    Park Nature Walk
                  </span>
                  <span className="text-[10px] font-mono text-soft-sage font-bold">Every 2nd Wednesday</span>
                </div>
                <h4 className="font-serif font-bold text-sm text-[#1F1813]">Wild Flora &amp; Soil Study</h4>
                <p className="text-[11px] text-[#2A221B]/80 leading-relaxed">
                  Children explore native plants, journal leaf structures, and practice outdoor navigation together.
                </p>
                <div className="pt-2 border-t border-copper-penny/10 flex items-center justify-between text-[10px] font-mono text-copper-penny">
                  <span>Host: Mama Jamila</span>
                  <span className="font-bold underline cursor-pointer" onClick={() => alert("RSVP recorded! Mama Jamila will message you with the trail pin.")}>Join Field Trip</span>
                </div>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-copper-penny/15 space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono font-bold uppercase bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                    Homestead Craft Day
                  </span>
                  <span className="text-[10px] font-mono text-soft-sage font-bold">Monthly Weekend</span>
                </div>
                <h4 className="font-serif font-bold text-sm text-[#1F1813]">Sourdough &amp; Hand-Stitch Co-Op</h4>
                <p className="text-[11px] text-[#2A221B]/80 leading-relaxed">
                  Mothers and children learn ancestral sourdough fermentation, hand-quilting stitches, and natural soap making.
                </p>
                <div className="pt-2 border-t border-copper-penny/10 flex items-center justify-between text-[10px] font-mono text-copper-penny">
                  <span>Host: Auntie Brenda</span>
                  <span className="font-bold underline cursor-pointer" onClick={() => alert("RSVP recorded! Auntie Brenda will share porch details.")}>Join Co-Op</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Sidebar: Right 4 columns */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* AI Syllabus Advisor Widget */}
          <div className="bg-[#1F1813] border-2 border-[#D4AF37]/35 rounded-3xl p-5 space-y-4 shadow-xl relative overflow-hidden group text-white">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4AF37]/5 rounded-full blur-xl pointer-events-none" />
            
            <div className="flex items-center space-x-2 text-[#D4AF37]">
              <Sparkles className="w-4.5 h-4.5 text-[#D4AF37]" />
              <h4 className="font-serif font-bold text-lg text-[#D4AF37] glow-gold-text">Homeschool &amp; Learning Helper</h4>
            </div>

            <p className="text-xs text-[#FAF5EE]/90 leading-relaxed">
              Looking for lesson ideas, creative hands-on projects, or fun ways to teach reading, science, or math at home? Ask for thoughtful recommendations below.
            </p>

            <form onSubmit={handleAdvisorSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="block text-[9px] uppercase font-mono text-[#D4AF37]/75 font-bold tracking-wider">Lesson / Subject Question</label>
                <input 
                  type="text"
                  required
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g. Fun 3rd grade hands-on science ideas"
                  className="w-full bg-white border border-[#D4AF37]/25 rounded-xl px-3.5 py-2 text-xs text-[#1F1813] placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] transition-colors"
                />
              </div>

              <button 
                type="submit"
                disabled={aiLoading || !aiPrompt.trim()}
                className="w-full py-2.5 bg-[#D4AF37] hover:bg-[#B87333] hover:text-white text-[#1F1813] disabled:bg-gray-700 disabled:text-gray-500 border border-[#B87333]/40 font-black text-xs rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-[0_4px_14px_rgba(212,175,55,0.25)] hover:shadow-[0_6px_18px_rgba(212,175,55,0.35)] active:scale-95"
              >
                {aiLoading ? (
                  <span>Gathering Ideas...</span>
                ) : (
                  <>
                    <span>Get Learning Ideas</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </form>

            {/* Advisory loading notice */}
            {aiLoading && (
              <div className="p-3 bg-[#FAF5EE]/10 rounded-xl border border-[#D4AF37]/20 text-center space-y-1.5 shadow-sm">
                <Sprout className="w-4 h-4 text-[#D4AF37] mx-auto opacity-80" />
                <p className="text-[10px] font-mono text-[#D4AF37] italic">{getLoadingNote()}</p>
              </div>
            )}

            {/* Response Area */}
            {aiResponse && !aiLoading && (
              <div className="p-3.5 bg-white border border-[#D4AF37]/30 rounded-xl space-y-2 shadow-inner max-h-64 overflow-y-auto scrollbar-thin text-[#1F1813]">
                <span className="inline-block text-[9px] font-mono font-bold uppercase text-white bg-[#B87333] px-2 py-0.5 rounded">
                  Council Syllabus Advice
                </span>
                <div className="text-xs text-[#2A221B]/95 leading-relaxed font-sans space-y-1.5">
                  {aiResponse.split('\n\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* District Event highlights */}
          <div className="bg-[#FBF7F1] border border-copper-penny/15 rounded-2xl p-4 space-y-3 shadow-md">
            <h4 className="font-serif font-bold text-base text-[#1F1813] flex items-center space-x-1.5">
              <Calendar className="w-4 h-4 text-copper-penny" />
              <span>Village Events ({selectedState})</span>
            </h4>
            <div className="space-y-3">
              {eventsList.filter(e => e.hubId === 'village').map(evt => (
                <div key={evt.id} className="border-l-4 border-copper-penny bg-white p-3 rounded-r-xl space-y-1 text-xs">
                  <h5 className="font-bold text-[#1F1813]">{evt.title}</h5>
                  <p className="text-[11px] text-[#2A221B]/80 leading-relaxed">{evt.description}</p>
                  <div className="flex flex-col gap-0.5 text-[9px] font-mono text-soft-sage">
                    <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {evt.date} at {evt.time}</span>
                    <span className="flex items-center"><MapPin className="w-3 h-3 mr-1" /> {evt.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
