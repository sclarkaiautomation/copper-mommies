import React, { useState } from 'react';
import { ShieldCheck, Heart, MapPin, ArrowRight, ShieldAlert, Sparkles, Globe, Check, Copy, CheckCircle2, Lock, Key, User, Users, AtSign, Calendar, Phone, Briefcase, Feather, BookOpen, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { Applicant } from '../types';

interface VettingGatewayProps {
  onSubmitApplication: (app: Omit<Applicant, 'id' | 'status' | 'submittedAt'>) => void;
  currentApplication: Applicant | null;
  onNavigateToPortal?: () => void;
}

// Allowed birth years: 1995 down to 1950
const BIRTH_YEARS = Array.from({ length: 46 }, (_, i) => 1995 - i);

export default function VettingGateway({ onSubmitApplication, currentApplication, onNavigateToPortal }: VettingGatewayProps) {
  // PART 1: BASIC DEMOGRAPHICS & PROFILE
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [birthYear, setBirthYear] = useState<number | ''>(1990);
  const [currentLocation, setCurrentLocation] = useState('');
  const [childrenAndAges, setChildrenAndAges] = useState('');
  const [socialHandle, setSocialHandle] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // PART 2: SACRED LINEAGE & MOTHERHOOD
  const [maternalLineageConfirmed, setMaternalLineageConfirmed] = useState<boolean>(true);
  const [isMotherConfirmed, setIsMotherConfirmed] = useState<boolean>(true);
  const [maternalGeography, setMaternalGeography] = useState('');
  const [connectionStatement, setConnectionStatement] = useState('');

  // PART 3: SPIRITUAL & ANCESTRAL ALIGNMENT
  const [spiritualAlignment, setSpiritualAlignment] = useState<'fully_aligned' | 'open_receptive' | 'traditional_seeker'>('fully_aligned');
  const [spiritualStatement, setSpiritualStatement] = useState('');

  // PART 4: VOCATION, TRADE & BARTER CONTRIBUTION
  const [currentVocation, setCurrentVocation] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessOfferings, setBusinessOfferings] = useState('');
  const [barterContribution, setBarterContribution] = useState('');

  // PART 5: PMA & 508 COVENANT
  const [agreedToPmaCovenant, setAgreedToPmaCovenant] = useState(false);
  const [agreedToCodeOfConduct, setAgreedToCodeOfConduct] = useState(false);

  // Copy invitation link state
  const [copiedLink, setCopiedLink] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Strict Birth Year Validation (1995 or earlier)
    if (!birthYear || Number(birthYear) > 1995) {
      setValidationError('Sanctuary Gate: Copper Mommies membership is reserved for mothers born in 1995 or earlier.');
      return;
    }

    if (!maternalLineageConfirmed) {
      setValidationError('Sanctuary Gate: Membership requires confirmed multi-generational American-born melanated maternal lineage.');
      return;
    }

    if (!isMotherConfirmed) {
      setValidationError('Sanctuary Gate: Membership requires being a mother (raising, birthed, or cared for children).');
      return;
    }

    if (!name.trim() || !email.trim() || !currentLocation.trim() || !childrenAndAges.trim() || !maternalGeography.trim() || !connectionStatement.trim() || !currentVocation.trim() || !barterContribution.trim()) {
      setValidationError('Please complete all required fields across Parts 1 through 5.');
      return;
    }

    if (!agreedToPmaCovenant || !agreedToCodeOfConduct) {
      setValidationError('Please sign the Private Membership Association (PMA) Covenant and Code of Conduct to proceed.');
      return;
    }

    onSubmitApplication({
      name: name.trim(),
      email: email.trim(),
      birthYear: Number(birthYear),
      ageRange: `${new Date().getFullYear() - Number(birthYear)} years old`,
      currentLocation: currentLocation.trim(),
      childrenAndAges: childrenAndAges.trim(),
      socialHandle: socialHandle.trim(),
      phoneNumber: phoneNumber.trim(),
      maternalLineageConfirmed: true,
      isMotherConfirmed: true,
      maternalGeography: maternalGeography.trim(),
      connectionStatement: connectionStatement.trim(),
      spiritualAlignment,
      spiritualStatement: spiritualStatement.trim(),
      currentVocation: currentVocation.trim(),
      businessName: businessName.trim(),
      businessOfferings: businessOfferings.trim(),
      barterContribution: barterContribution.trim(),
      agreedToPmaCovenant: true,
      agreedToCodeOfConduct: true,
      isMotherOrGuardian: true,
      motherhoodStatus: childrenAndAges.trim(),
      lineageLocation: maternalGeography.trim(),
      grandmotherBirthplace: maternalGeography.trim(),
      paternalGrandmotherBirthplace: maternalGeography.trim()
    });
  };

  const handleCopyInviteLink = (linkText: string) => {
    navigator.clipboard.writeText(linkText);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  // If applicant has already submitted
  if (currentApplication) {
    const inviteUrl = currentApplication.invitationLink || `https://coppermommies.co/sanctuary/invite/${currentApplication.stateCode || 'GA'}-${currentApplication.id.replace('app-', '')}`;

    return (
      <div className="max-w-3xl mx-auto my-4 p-5 sm:p-7 bg-white border-2 border-[#D4AF37]/40 rounded-3xl shadow-xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#B87333]/5 rounded-full blur-2xl pointer-events-none" />

        {/* Status Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-[#FAF5EE] text-[#B87333] flex items-center justify-center mx-auto border-2 border-[#D4AF37]/40 shadow-sm">
            {currentApplication.status === 'pending' ? (
              <Sparkles className="w-7 h-7 text-[#B87333]" />
            ) : currentApplication.status === 'approved' ? (
              <ShieldCheck className="w-7 h-7 text-[#3A4C3A]" />
            ) : (
              <ShieldAlert className="w-7 h-7 text-[#A85138]" />
            )}
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#1F1813]">
            {currentApplication.status === 'pending' && "Application Being Reviewed by our Matriarchs"}
            {currentApplication.status === 'approved' && "Welcome Home to Copper Mommies Co.!"}
            {currentApplication.status === 'denied' && "Application Update Requested"}
          </h2>

          <span className="inline-block text-[11px] text-[#B87333] font-mono uppercase tracking-widest font-bold bg-[#FAF5EE] px-3 py-1 rounded-full border border-copper-penny/20">
            PMA Reference: CM-{currentApplication.id.replace('app-', '').toUpperCase()}
          </span>
        </div>

        {/* Status Banner */}
        <div className={`p-5 rounded-2xl border space-y-4 ${
          currentApplication.status === 'pending' ? 'bg-[#FAF5EE] border-[#D4AF37]/30' :
          currentApplication.status === 'approved' ? 'bg-emerald-50/70 border-emerald-300' :
          'bg-amber-50/70 border-amber-300'
        }`}>
          <div className="text-xs sm:text-sm text-[#2A221B] leading-relaxed space-y-2">
            {currentApplication.status === 'pending' && (
              <p>
                Hello Sister <strong>{currentApplication.name}</strong>. Thank you for completing your Private Membership Association (PMA) covenant. Your lineage, motherhood, and trade contributions have been safely received and are currently under private review by Circle Leadership.
              </p>
            )}

            {currentApplication.status === 'approved' && (
              <div className="space-y-3">
                <p className="font-medium text-emerald-950">
                  Welcome to the sisterhood, <strong>{currentApplication.name}</strong>! You now hold verified matriarch status with full access to our private barter exchange, apothecary archives, homeschool resources, and live Casual Corner Circles.
                </p>

                {/* Localized Invitation Link Box */}
                <div className="bg-white p-4 rounded-xl border border-emerald-300 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-emerald-900">
                    <span className="flex items-center space-x-1.5">
                      <Key className="w-4 h-4 text-[#B87333]" />
                      <span>Your Community Access Pass:</span>
                    </span>
                    <span className="text-[10px] text-emerald-700 uppercase bg-emerald-100 px-2 py-0.5 rounded">Active Member</span>
                  </div>

                  <div className="flex items-center space-x-2 bg-[#FAF5EE] p-2.5 rounded-lg border border-copper-penny/20 font-mono text-xs text-[#1F1813] overflow-x-auto">
                    <span className="flex-1 truncate font-semibold">{inviteUrl}</span>
                    <button
                      type="button"
                      onClick={() => handleCopyInviteLink(inviteUrl)}
                      className="px-3 py-1.5 bg-[#B87333] hover:bg-[#A85138] text-white text-[10px] font-bold uppercase rounded-md transition-all flex items-center space-x-1 cursor-pointer flex-shrink-0"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {currentApplication.status === 'denied' && (
              <p>
                Hello Sister. Our team requested a brief clarification on your lineage or responses. Please update your information so we can welcome you into the circle.
              </p>
            )}
          </div>

          {/* Form Summary Table */}
          <div className="pt-4 border-t border-copper-penny/15 space-y-3 text-xs">
            <h4 className="font-serif font-bold text-[#1F1813] text-sm flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-[#B87333]" />
              <span>Submitted Verification Summary</span>
            </h4>

            {/* Part 1 Summary */}
            <div className="bg-white p-3.5 rounded-xl border border-copper-penny/10 font-sans space-y-2">
              <span className="text-[10px] font-mono uppercase text-[#B87333] font-bold block">
                [ Profile, Lineage &amp; Vocation ]
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-[11px]">
                <div>
                  <span className="text-gray-500 block text-[10px]">Birth Year</span>
                  <span className="font-semibold text-[#1F1813]">{currentApplication.birthYear || '1990'}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px]">Location</span>
                  <span className="font-semibold text-[#1F1813]">{currentApplication.currentLocation || currentApplication.stateCode || 'GA'}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px]">Work / Trade</span>
                  <span className="font-semibold text-[#1F1813]">{currentApplication.currentVocation || 'Entrepreneur & Mother'}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px]">Children</span>
                  <span className="font-semibold text-[#1F1813] truncate">{currentApplication.childrenAndAges || currentApplication.motherhoodStatus}</span>
                </div>
              </div>
            </div>

            {/* Part 2 Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3.5 rounded-xl border border-copper-penny/10 font-sans">
              <div>
                <span className="text-[10px] font-mono uppercase text-soft-sage font-bold block">Maternal Root &amp; Geography</span>
                <span className="font-bold text-[#B87333] block mt-0.5">{currentApplication.maternalGeography}</span>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-soft-sage font-bold block">Village Barter Offer</span>
                <span className="font-semibold text-[#1F1813] block mt-0.5">{currentApplication.barterContribution || 'Herbal Remedies & Tutoring'}</span>
              </div>

              <div className="sm:col-span-2">
                <span className="text-[10px] font-mono uppercase text-soft-sage font-bold block">Lineage &amp; Identity Statement</span>
                <p className="text-gray-700 italic text-[11px] bg-[#FAF5EE] p-2.5 rounded-lg border border-copper-penny/10 mt-1">
                  "{currentApplication.connectionStatement}"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Action */}
        {currentApplication.status === 'approved' && onNavigateToPortal && (
          <button
            onClick={onNavigateToPortal}
            className="w-full py-3.5 bg-[#3A4C3A] hover:bg-[#2A3C2A] text-white border-2 border-emerald-800/40 text-xs uppercase tracking-widest font-extrabold rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>Step Into the Private Sanctuary Hubs</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}

        <div className="flex items-center justify-center space-x-2 text-[10px] text-soft-sage font-mono">
          <Globe className="w-3.5 h-3.5 text-copper-penny" />
          <span>Held in Private Trust (Title 26 USC § 508(c)(1)(a)) • Private Membership Association</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF5EE]/50 border border-copper-penny/20 rounded-3xl p-4 sm:p-6 shadow-md grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto my-3">
      
      {/* Visual / Philosophy Column */}
      <div className="lg:col-span-5 space-y-5 flex flex-col justify-between">
        <div className="space-y-3">
          <span className="inline-flex items-center px-3.5 py-1 rounded-full text-[10px] font-bold bg-[#B87333]/15 text-[#B87333] border border-copper-penny/30 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
            Private Membership Association (PMA) Gate
          </span>

          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1F1813] leading-tight">
            The Sovereign Sanctuary for <br />
            <span className="text-[#B87333]">Melanated American Mothers</span>
          </h2>

          <p className="text-[#2A221B]/85 text-xs sm:text-sm leading-relaxed font-sans">
            Copper Mommies Co. is a private, self-governing cooperative sanctuary dedicated exclusively to American-born melanated matriarchs (born 1995 or earlier). Here, we share sacred herbal healing, sovereign barter, family protection, and ancestral wisdom without religious dogma or external interference.
          </p>
        </div>

        {/* 5-Part Overview Card */}
        <div className="bg-white border border-copper-penny/15 rounded-2xl p-4 space-y-3 shadow-xs">
          <h4 className="font-serif font-bold text-sm text-[#1F1813] flex items-center space-x-2">
            <Lock className="w-4 h-4 text-[#B87333]" />
            <span>Sanctuary Admission Pillars</span>
          </h4>

          <div className="space-y-2 text-xs text-[#2A221B]/80 font-sans">
            <div className="p-2 rounded-xl bg-[#FAF5EE]/70 border border-copper-penny/15 space-y-0.5">
              <span className="font-bold font-mono text-[#B87333] text-[10px] uppercase tracking-wider block">
                1. Age &amp; Matriarch Maturity
              </span>
              <p className="text-[11px] text-gray-700 leading-snug">
                Reserved for mothers born in <strong>1995 or earlier</strong> with lived motherhood wisdom.
              </p>
            </div>

            <div className="p-2 rounded-xl bg-[#FAF5EE]/70 border border-copper-penny/15 space-y-0.5">
              <span className="font-bold font-mono text-[#B87333] text-[10px] uppercase tracking-wider block">
                2. Original American Lineage
              </span>
              <p className="text-[11px] text-gray-700 leading-snug">
                Honoring the original melanated matriarchs born of American-born mothers.
              </p>
            </div>

            <div className="p-2 rounded-xl bg-[#FAF5EE]/70 border border-copper-penny/15 space-y-0.5">
              <span className="font-bold font-mono text-[#B87333] text-[10px] uppercase tracking-wider block">
                3. Ancestral Spiritual Freedom
              </span>
              <p className="text-[11px] text-gray-700 leading-snug">
                An open-minded space grounded in traditional ways, herbalism, and zero dogmatic judgment.
              </p>
            </div>

            <div className="p-2 rounded-xl bg-[#FAF5EE]/70 border border-copper-penny/15 space-y-0.5">
              <span className="font-bold font-mono text-[#B87333] text-[10px] uppercase tracking-wider block">
                4. Vocation &amp; Village Barter
              </span>
              <p className="text-[11px] text-gray-700 leading-snug">
                Share what you do for work and how you wish to trade skills or produce in our co-op.
              </p>
            </div>
          </div>
        </div>

        <div className="border-l-4 border-[#B87333] pl-3 py-1 text-xs text-soft-sage italic leading-relaxed">
          "Private Contract &amp; Faith-Based Trust under Title 26 USC § 508(c)(1)(a). Your information is strictly confidential."
        </div>
      </div>

      {/* Form Column */}
      <div className="lg:col-span-7">
        <div className="bg-white border-2 border-[#D4AF37]/35 rounded-3xl p-5 sm:p-7 shadow-lg space-y-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-[#B87333]/5 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-1 border-b border-copper-penny/15 pb-3">
            <h3 className="font-serif font-bold text-2xl text-[#1F1813]">PMA Sanctuary Application</h3>
            <p className="text-xs text-soft-sage font-mono">Private Membership Association • Confidential Matriarch Review</p>
          </div>

          {/* Validation Error Banner */}
          {validationError && (
            <div className="p-3.5 bg-red-50 border-2 border-red-300 rounded-2xl flex items-start space-x-2.5 text-xs text-red-900 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="font-medium">{validationError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* ========================================================================= */}
            {/* PART 1: BASIC DEMOGRAPHICS & BIRTH YEAR GATING */}
            {/* ========================================================================= */}
            <div className="space-y-3.5">
              <div className="flex items-center space-x-2 border-b border-copper-penny/15 pb-1.5">
                <span className="w-5 h-5 rounded-full bg-[#FAF5EE] text-[#B87333] border border-copper-penny/30 flex items-center justify-center font-mono font-bold text-[10px]">
                  1
                </span>
                <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-[#B87333]">
                  Part 1: Profile &amp; Age Gate (1995 or Earlier)
                </h4>
              </div>

              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-mono font-bold tracking-wider text-soft-sage">
                    Full Name <span className="text-[#B87333]">*</span>
                  </label>
                  <input 
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sister Shantrece"
                    className="w-full bg-[#FAF5EE]/60 border border-copper-penny/25 focus:border-copper-penny focus:ring-1 focus:ring-copper-penny rounded-xl px-3.5 py-2 text-xs text-[#1F1813] placeholder-gray-400 focus:outline-none transition-colors font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-mono font-bold tracking-wider text-soft-sage">
                    Email Address <span className="text-[#B87333]">*</span>
                  </label>
                  <input 
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. shantrece@coop.org"
                    className="w-full bg-[#FAF5EE]/60 border border-copper-penny/25 focus:border-copper-penny focus:ring-1 focus:ring-copper-penny rounded-xl px-3.5 py-2 text-xs text-[#1F1813] placeholder-gray-400 focus:outline-none transition-colors font-medium"
                  />
                </div>
              </div>

              {/* Birth Year Dropdown (Gated) & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#FAF5EE]/50 p-3 rounded-2xl border border-copper-penny/20">
                
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-mono font-bold tracking-wider text-soft-sage flex items-center justify-between">
                    <span>Birth Year (1995 or earlier) <span className="text-[#B87333]">*</span></span>
                    <span className="text-[9px] text-[#B87333] font-bold">Gated</span>
                  </label>
                  <select
                    required
                    value={birthYear}
                    onChange={(e) => setBirthYear(e.target.value ? Number(e.target.value) : '')}
                    className="w-full bg-white border border-copper-penny/25 focus:border-copper-penny focus:ring-1 focus:ring-copper-penny rounded-xl px-3 py-2 text-xs text-[#1F1813] focus:outline-none transition-colors font-medium cursor-pointer"
                  >
                    <option value="">Select your birth year...</option>
                    {BIRTH_YEARS.map((yr) => (
                      <option key={yr} value={yr}>
                        {yr} ({new Date().getFullYear() - yr} years old)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-mono font-bold tracking-wider text-soft-sage">
                    Current Location (City &amp; State) <span className="text-[#B87333]">*</span>
                  </label>
                  <input 
                    type="text"
                    required
                    value={currentLocation}
                    onChange={(e) => setCurrentLocation(e.target.value)}
                    placeholder="e.g. Atlanta, GA"
                    className="w-full bg-white border border-copper-penny/25 focus:border-copper-penny focus:ring-1 focus:ring-copper-penny rounded-xl px-3 py-2 text-xs text-[#1F1813] placeholder-gray-400 focus:outline-none transition-colors font-medium"
                  />
                </div>

                {/* Children & Ages */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="block text-[10px] uppercase font-mono font-bold tracking-wider text-soft-sage">
                    Children &amp; Ages (Motherhood Status) <span className="text-[#B87333]">*</span>
                  </label>
                  <input 
                    type="text"
                    required
                    value={childrenAndAges}
                    onChange={(e) => setChildrenAndAges(e.target.value)}
                    placeholder="e.g. 2 children: Son (Age 8), Daughter (Age 4) — Homeschooling"
                    className="w-full bg-white border border-copper-penny/25 focus:border-copper-penny focus:ring-1 focus:ring-copper-penny rounded-xl px-3 py-2 text-xs text-[#1F1813] placeholder-gray-400 focus:outline-none transition-colors font-medium"
                  />
                </div>

                {/* Social Handle & Phone Number */}
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-mono font-bold tracking-wider text-soft-sage">
                    Social Handle (IG/TikTok)
                  </label>
                  <input 
                    type="text"
                    value={socialHandle}
                    onChange={(e) => setSocialHandle(e.target.value)}
                    placeholder="@username"
                    className="w-full bg-white border border-copper-penny/25 focus:border-copper-penny focus:ring-1 focus:ring-copper-penny rounded-xl px-3 py-2 text-xs text-[#1F1813] placeholder-gray-400 focus:outline-none transition-colors font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-mono font-bold tracking-wider text-soft-sage">
                    Phone Number (Meetup Text Alerts)
                  </label>
                  <input 
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="e.g. (404) 555-0192"
                    className="w-full bg-white border border-copper-penny/25 focus:border-copper-penny focus:ring-1 focus:ring-copper-penny rounded-xl px-3 py-2 text-xs text-[#1F1813] placeholder-gray-400 focus:outline-none transition-colors font-medium"
                  />
                </div>

              </div>
            </div>

            {/* ========================================================================= */}
            {/* PART 2: SACRED LINEAGE & MOTHERHOOD */}
            {/* ========================================================================= */}
            <div className="space-y-3.5 pt-2 border-t border-copper-penny/15">
              <div className="flex items-center space-x-2 border-b border-copper-penny/15 pb-1.5">
                <span className="w-5 h-5 rounded-full bg-[#B87333] text-white flex items-center justify-center font-mono font-bold text-[10px]">
                  2
                </span>
                <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-[#B87333]">
                  Part 2: Original American Lineage &amp; Heritage
                </h4>
              </div>

              {/* Maternal Lineage Qualification Choice */}
              <div className="p-3.5 rounded-2xl bg-[#FAF5EE] border border-copper-penny/20 space-y-2">
                <label className="text-xs font-serif font-bold text-[#1F1813] block">
                  Maternal Heritage &amp; Lineage Confirmation <span className="text-[#B87333]">*</span>
                </label>
                <p className="text-[11px] text-[#2A221B] leading-relaxed">
                  "Were you and your biological mother born in the United States as melanated (Black / American) matriarchs?"
                </p>

                <div className="space-y-2 pt-1">
                  <label className="flex items-center space-x-2.5 p-2 bg-white rounded-xl border border-copper-penny/20 cursor-pointer">
                    <input
                      type="radio"
                      name="maternalLineage"
                      checked={maternalLineageConfirmed === true}
                      onChange={() => setMaternalLineageConfirmed(true)}
                      className="text-[#B87333] focus:ring-copper-penny accent-[#B87333] cursor-pointer"
                    />
                    <span className="text-xs font-medium text-[#1F1813]">
                      Yes, confirmed multi-generational American-born melanated lineage.
                    </span>
                  </label>

                  <label className="flex items-center space-x-2.5 p-2 bg-white rounded-xl border border-copper-penny/20 cursor-pointer">
                    <input
                      type="radio"
                      name="maternalLineage"
                      checked={maternalLineageConfirmed === false}
                      onChange={() => setMaternalLineageConfirmed(false)}
                      className="text-[#B87333] focus:ring-copper-penny accent-[#B87333] cursor-pointer"
                    />
                    <span className="text-xs font-medium text-gray-600">
                      No / Other Lineage (African, European, Asian, Caribbean, etc.)
                    </span>
                  </label>
                </div>
              </div>

              {/* Maternal Geography */}
              <div className="p-3.5 rounded-2xl bg-[#FAF5EE] border border-copper-penny/20 space-y-1.5">
                <label className="text-xs font-serif font-bold text-[#1F1813] block">
                  Mother &amp; Maternal Grandmother Geography <span className="text-[#B87333]">*</span>
                </label>
                <p className="text-[11px] text-[#2A221B]">
                  "What American city/county and state were your mother and maternal grandmother born or raised in?"
                </p>
                <input 
                  type="text"
                  required
                  value={maternalGeography}
                  onChange={(e) => setMaternalGeography(e.target.value)}
                  placeholder="Format: City/County and State (e.g. Macon County, AL & Fulton County, GA)"
                  className="w-full bg-white border border-copper-penny/20 focus:border-copper-penny focus:ring-1 focus:ring-copper-penny rounded-xl px-3 py-2 text-xs text-[#1F1813] placeholder-gray-400 focus:outline-none transition-colors font-medium"
                />
              </div>

              {/* Lineage & Identity Perspective Statement */}
              <div className="p-3.5 rounded-2xl bg-[#FAF5EE] border border-copper-penny/20 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-serif font-bold text-[#1F1813]">
                    Lineage &amp; Sovereign Village Perspective <span className="text-[#B87333]">*</span>
                  </label>
                  <span className="text-[10px] font-mono text-[#B87333] bg-white px-2 py-0.5 rounded border border-copper-penny/20 font-semibold">
                    2–3 sentences
                  </span>
                </div>
                <p className="text-[11px] text-[#2A221B] leading-relaxed">
                  "In your own words, what does reclaiming your true American identity and stepping into a self-governed, peaceful village mean to you and your children?"
                </p>
                <textarea 
                  required
                  rows={3}
                  value={connectionStatement}
                  onChange={(e) => setConnectionStatement(e.target.value)}
                  placeholder="Share what stepping into a sovereign, supportive motherhood village means to you..."
                  className="w-full bg-white border border-copper-penny/20 focus:border-copper-penny focus:ring-1 focus:ring-copper-penny rounded-xl px-3 py-2 text-xs text-[#1F1813] placeholder-gray-400 focus:outline-none transition-colors resize-none font-medium leading-relaxed"
                />
              </div>

            </div>

            {/* ========================================================================= */}
            {/* PART 3: SPIRITUAL & ANCESTRAL ALIGNMENT */}
            {/* ========================================================================= */}
            <div className="space-y-3.5 pt-2 border-t border-copper-penny/15">
              <div className="flex items-center space-x-2 border-b border-copper-penny/15 pb-1.5">
                <span className="w-5 h-5 rounded-full bg-[#3A4C3A] text-white flex items-center justify-center font-mono font-bold text-[10px]">
                  3
                </span>
                <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-[#3A4C3A]">
                  Part 3: Spiritual &amp; Ancestral Alignment
                </h4>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF5EE] border border-copper-penny/20 space-y-2">
                <label className="text-xs font-serif font-bold text-[#1F1813] block">
                  Ancestral &amp; Spiritual Receptivity <span className="text-[#B87333]">*</span>
                </label>
                <p className="text-[11px] text-[#2A221B] leading-relaxed">
                  "Our sanctuary honors ancestral ways, traditional healing, herbalism, and open-minded spiritual wisdom rather than dogmatic religious judgment or 'holier-than-thou' frameworks. How aligned are you with this environment?"
                </p>

                <div className="space-y-2 pt-1">
                  <label className="flex items-start space-x-2.5 p-2.5 bg-white rounded-xl border border-copper-penny/20 cursor-pointer">
                    <input
                      type="radio"
                      name="spiritualAlignment"
                      checked={spiritualAlignment === 'fully_aligned'}
                      onChange={() => setSpiritualAlignment('fully_aligned')}
                      className="text-[#B87333] focus:ring-copper-penny accent-[#B87333] cursor-pointer mt-0.5"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-[#1F1813] block">Fully Aligned &amp; Receptive</span>
                      <span className="text-[11px] text-gray-600">I embrace ancestral memory, herbalism, and open-minded spiritual exploration free of dogmatic judgment.</span>
                    </div>
                  </label>

                  <label className="flex items-start space-x-2.5 p-2.5 bg-white rounded-xl border border-copper-penny/20 cursor-pointer">
                    <input
                      type="radio"
                      name="spiritualAlignment"
                      checked={spiritualAlignment === 'open_receptive'}
                      onChange={() => setSpiritualAlignment('open_receptive')}
                      className="text-[#B87333] focus:ring-copper-penny accent-[#B87333] cursor-pointer mt-0.5"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-[#1F1813] block">Open &amp; Curious</span>
                      <span className="text-[11px] text-gray-600">I am open-minded and eager to learn about ancestral roots, traditional wellness, and sisterhood.</span>
                    </div>
                  </label>
                </div>
              </div>

            </div>

            {/* ========================================================================= */}
            {/* PART 4: VOCATION, TRADE & BARTER CONTRIBUTION */}
            {/* ========================================================================= */}
            <div className="space-y-3.5 pt-2 border-t border-copper-penny/15">
              <div className="flex items-center space-x-2 border-b border-copper-penny/15 pb-1.5">
                <span className="w-5 h-5 rounded-full bg-[#1F1813] text-[#D4AF37] flex items-center justify-center font-mono font-bold text-[10px]">
                  4
                </span>
                <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-[#1F1813]">
                  Part 4: Vocation, Trade &amp; Barter Gifts
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#FAF5EE]/60 p-3.5 rounded-2xl border border-copper-penny/20">
                
                {/* Current Vocation */}
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-mono font-bold tracking-wider text-soft-sage">
                    Current Work / Profession <span className="text-[#B87333]">*</span>
                  </label>
                  <input 
                    type="text"
                    required
                    value={currentVocation}
                    onChange={(e) => setCurrentVocation(e.target.value)}
                    placeholder="e.g. Doula, Homeschool Educator, Software, Seamstress"
                    className="w-full bg-white border border-copper-penny/25 focus:border-copper-penny focus:ring-1 focus:ring-copper-penny rounded-xl px-3 py-2 text-xs text-[#1F1813] placeholder-gray-400 focus:outline-none transition-colors font-medium"
                  />
                </div>

                {/* Business Name (Optional) */}
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-mono font-bold tracking-wider text-soft-sage">
                    Business / Enterprise Name (If Any)
                  </label>
                  <input 
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Mama Earth Apothecary LLC"
                    className="w-full bg-white border border-copper-penny/25 focus:border-copper-penny focus:ring-1 focus:ring-copper-penny rounded-xl px-3 py-2 text-xs text-[#1F1813] placeholder-gray-400 focus:outline-none transition-colors font-medium"
                  />
                </div>

                {/* Business Offerings (Optional) */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="block text-[10px] uppercase font-mono font-bold tracking-wider text-soft-sage">
                    Products or Services Provided (If Any)
                  </label>
                  <input 
                    type="text"
                    value={businessOfferings}
                    onChange={(e) => setBusinessOfferings(e.target.value)}
                    placeholder="e.g. Organic elderberry syrups, postnatal massage, math tutoring"
                    className="w-full bg-white border border-copper-penny/25 focus:border-copper-penny focus:ring-1 focus:ring-copper-penny rounded-xl px-3 py-2 text-xs text-[#1F1813] placeholder-gray-400 focus:outline-none transition-colors font-medium"
                  />
                </div>

                {/* Barter & Village Contribution */}
                <div className="space-y-1 sm:col-span-2 pt-1">
                  <label className="block text-[10px] uppercase font-mono font-bold tracking-wider text-[#B87333]">
                    What skill, produce, goods, or care can you contribute to our barter network? <span className="text-[#B87333]">*</span>
                  </label>
                  <textarea 
                    required
                    rows={2}
                    value={barterContribution}
                    onChange={(e) => setBarterContribution(e.target.value)}
                    placeholder="e.g. Sourdough bread, garden collards, child-minding swap, genealogy search help, bookkeeping assistance..."
                    className="w-full bg-white border border-copper-penny/25 focus:border-copper-penny focus:ring-1 focus:ring-copper-penny rounded-xl px-3 py-2 text-xs text-[#1F1813] placeholder-gray-400 focus:outline-none transition-colors resize-none font-medium leading-relaxed"
                  />
                </div>

              </div>
            </div>

            {/* ========================================================================= */}
            {/* PART 5: PMA & 508(c)(1)(a) COVENANT */}
            {/* ========================================================================= */}
            <div className="space-y-3 pt-2 border-t border-copper-penny/15">
              <div className="flex items-center space-x-2 border-b border-copper-penny/15 pb-1.5">
                <span className="w-5 h-5 rounded-full bg-[#D4AF37] text-[#1F1813] flex items-center justify-center font-mono font-bold text-[10px]">
                  5
                </span>
                <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-[#1F1813]">
                  Part 5: Private Membership Association (PMA) Covenant
                </h4>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF5EE] border border-copper-penny/25 space-y-2.5 text-xs text-[#2A221B]">
                <label className="flex items-start space-x-2.5 cursor-pointer bg-white p-2.5 rounded-xl border border-copper-penny/20">
                  <input
                    type="checkbox"
                    required
                    checked={agreedToPmaCovenant}
                    onChange={(e) => setAgreedToPmaCovenant(e.target.checked)}
                    className="w-4 h-4 text-[#B87333] rounded border-copper-penny/30 focus:ring-copper-penny accent-[#B87333] cursor-pointer mt-0.5"
                  />
                  <span className="font-medium text-[11px] leading-relaxed">
                    <strong>PMA Declaration:</strong> I acknowledge that Copper Mommies Co. operates as a Private Membership Association and faith-based sanctuary under Title 26 USC § 508(c)(1)(a) and private contract law. All communications, trades, and remedies shared within are private among members.
                  </span>
                </label>

                <label className="flex items-start space-x-2.5 cursor-pointer bg-white p-2.5 rounded-xl border border-copper-penny/20">
                  <input
                    type="checkbox"
                    required
                    checked={agreedToCodeOfConduct}
                    onChange={(e) => setAgreedToCodeOfConduct(e.target.checked)}
                    className="w-4 h-4 text-[#B87333] rounded border-copper-penny/30 focus:ring-copper-penny accent-[#B87333] cursor-pointer mt-0.5"
                  />
                  <span className="font-medium text-[11px] leading-relaxed">
                    <strong>Sisterhood Code of Conduct:</strong> I pledge to treat all sister mothers with sacred respect, honor confidentiality, avoid gossip or dogmatic condemnation, and actively contribute to the well-being of the village.
                  </span>
                </label>
              </div>

            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-[#B87333] to-[#D4AF37] hover:from-[#A85138] hover:to-[#c29e2e] text-[#1F1813] font-serif uppercase tracking-widest font-extrabold text-xs rounded-2xl shadow-[0_4px_18px_rgba(184,115,51,0.35)] hover:shadow-[0_6px_24px_rgba(184,115,51,0.5)] transition-all duration-300 active:scale-95 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-[#1F1813]" />
              <span>Sign Covenant &amp; Submit Verification</span>
              <ArrowRight className="w-4 h-4 text-[#1F1813]" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
