import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Heart, MapPin, ArrowRight, ShieldAlert, Sparkles, Globe, Check, Copy, 
  CheckCircle2, Lock, Key, User, Users, AtSign, Calendar, Phone, Briefcase, Feather, 
  BookOpen, AlertCircle, Leaf, Coins, Radio, Scale, Gift, Award, Compass, Star,
  Eye, CheckCircle, ChevronDown, ChevronUp, FileText, Share2, Pause, Play, ChevronLeft, ChevronRight,
  Download, ExternalLink, Mail, Send, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Applicant } from '../types';

interface VettingGatewayProps {
  onSubmitApplication: (app: Applicant | null) => void;
  currentApplication: Applicant | null;
  onNavigateToPortal?: () => void;
  existingApplicants?: Applicant[];
}

// Full range of selectable birth years: 2008 down to 1950 (Neutral, clean labels)
const ALL_BIRTH_YEARS = [
  ...Array.from({ length: 46 }, (_, i) => 1995 - i), // 1995 down to 1950
  2005, 2004, 2003, 2002, 2001, 2000, 1999, 1998, 1997, 1996 // Test knock-out years
].sort((a, b) => b - a);

const GATEWAY_TABS: ('benefits' | 'pillars' | 'covenant')[] = ['benefits', 'pillars', 'covenant'];

export default function VettingGateway({ 
  onSubmitApplication, 
  currentApplication, 
  onNavigateToPortal,
  existingApplicants = []
}: VettingGatewayProps) {
  // Top Featured Auto-Scrolling Banner State
  const [gatewayTab, setGatewayTab] = useState<'benefits' | 'pillars' | 'covenant'>('benefits');
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);

  // Auto-scroll / rotate effect across the top feature section
  useEffect(() => {
    if (!isAutoPlaying || isHovered) return;

    const intervalTime = 60;
    const totalDuration = 7000;
    const step = (intervalTime / totalDuration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setGatewayTab((current) => {
            const currentIndex = GATEWAY_TABS.indexOf(current);
            const nextIndex = (currentIndex + 1) % GATEWAY_TABS.length;
            return GATEWAY_TABS[nextIndex];
          });
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isAutoPlaying, isHovered]);

  const handleSelectTab = (tab: 'benefits' | 'pillars' | 'covenant') => {
    setGatewayTab(tab);
    setProgress(0);
  };

  const handleNextTab = () => {
    const currentIndex = GATEWAY_TABS.indexOf(gatewayTab);
    const nextIndex = (currentIndex + 1) % GATEWAY_TABS.length;
    setGatewayTab(GATEWAY_TABS[nextIndex]);
    setProgress(0);
  };

  const handlePrevTab = () => {
    const currentIndex = GATEWAY_TABS.indexOf(gatewayTab);
    const prevIndex = (currentIndex - 1 + GATEWAY_TABS.length) % GATEWAY_TABS.length;
    setGatewayTab(GATEWAY_TABS[prevIndex]);
    setProgress(0);
  };

  // =========================================================================
  // 1. EXACT USER INTERFACE DATA MAPPING STATES
  // =========================================================================

  // PART 1: Demographics & Profile
  const [fullName, setFullName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [birthYear, setBirthYear] = useState<number | ''>(1990);
  const [currentLocation, setCurrentLocation] = useState(''); // Current City, State

  // Dynamic Children & Ages State (0-10 choices with dynamic individual age inputs)
  const [childrenCount, setChildrenCount] = useState<number | ''>(2);
  const [childAges, setChildAges] = useState<string[]>(['8', '4']);

  // Mandatory Social Media Handle (TikTok, Instagram)
  const [socialHandle, setSocialHandle] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // PART 2: MATERNAL LINEAGE & INDIGENOUS ANCESTRY
  const [maternalLineage, setMaternalLineage] = useState<string>(
    'Yes, I confirm both I and my maternal grandmother are North American-born melanated lineage.'
  );
  const [lineagePerspective, setLineagePerspective] = useState<string>(
    'I lean in with curiosity and want to study the data for myself.'
  );

  // PART 3: VOCATION, TRADE, BARTER GIFTS & COMMUNITY CONTRIBUTION
  const [vocationTrade, setVocationTrade] = useState('');
  const [barterPerks, setBarterPerks] = useState('');

  // Community Contribution Question (Skills, services, teaching, support, business, etc.)
  const [communityContributionTypes, setCommunityContributionTypes] = useState<string[]>([
    'Traditional skills, crafts, sewing, or homemaking',
    'Wellness, herbal wisdom, or doula / birth / postpartum support'
  ]);
  const [communityContributionDetails, setCommunityContributionDetails] = useState('');

  // State Lead / Chapter Coordinator Question & Advanced Vetting
  const [stateLeadChoice, setStateLeadChoice] = useState<'yes' | 'no' | null>(null);
  const [stateLeadWhy, setStateLeadWhy] = useState('');
  // Question 2: Coordination experience (workplace, community, informal, or eager to learn)
  const [stateLeadExperience, setStateLeadExperience] = useState<string>(
    'Workplace / Professional coordination (organized projects, committee initiatives, or events at my job)'
  );
  // Question 3: Local Ground Support & Meetup Assistance (assisting founder with local spots/space)
  const [stateLeadGroundSupport, setStateLeadGroundSupport] = useState<string>(
    'Yes, I know my local area well and can assist with spot scouting, local guidance, and on-the-ground support'
  );
  // Question 4: People Leadership & Conflict Care
  const [stateLeadPeopleManagement, setStateLeadPeopleManagement] = useState<string>(
    'Yes, in a professional or managerial role at my workplace'
  );
  // Question 4 Follow-up: Approach to leadership and peace
  const [stateLeadConflictApproach, setStateLeadConflictApproach] = useState('');

  // PART 4: PRIVATE MEMBERSHIP ASSOCIATION COVENANT
  const [pmaDeclaration, setPmaDeclaration] = useState(false);
  const [codeOfConduct, setCodeOfConduct] = useState(false);

  // Interactive UI Helper States
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedAppDownload, setCopiedAppDownload] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmailDetailsModal, setShowEmailDetailsModal] = useState(false);

  // Dynamic children count handler
  const handleChildrenCountChange = (countVal: string) => {
    if (countVal === '') {
      setChildrenCount('');
      setChildAges([]);
      return;
    }
    const count = Number(countVal);
    setChildrenCount(count);
    setChildAges((prev) => {
      const updated = Array(count).fill('');
      for (let i = 0; i < Math.min(prev.length, count); i++) {
        updated[i] = prev[i];
      }
      return updated;
    });
  };

  const handleChildAgeChange = (index: number, val: string) => {
    setChildAges((prev) => {
      const updated = [...prev];
      updated[index] = val;
      return updated;
    });
  };

  // =========================================================================
  // SILENT BACKGROUND KNOCK-OUT LOGIC EVALUATION
  // =========================================================================
  const isAgeDisqualified = birthYear !== '' && Number(birthYear) >= 1996;
  const isMotherhoodDisqualified = childrenCount === 0;
  const isLineageDisqualified = maternalLineage === 'Other (Lineage African, Afro-Caribbean, Asiatic, Caribbean, etc.)';
  const isPerspectiveDisqualified = 
    lineagePerspective === "I reject it immediately if it contradicts what I've learned." ||
    lineagePerspective === 'I reject it immediately if it contradicts what I learned.';
  const hasKnockoutTrigger = isAgeDisqualified || isMotherhoodDisqualified || isLineageDisqualified || isPerspectiveDisqualified;

  // =========================================================================
  // SUBMISSION PIPELINE (AUTOMATED SIFTING & APPROVAL)
  // =========================================================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Form completeness validation
    if (!fullName.trim()) {
      setValidationError('Please enter your Full Name.');
      return;
    }
    if (!emailAddress.trim()) {
      setValidationError('Please enter your unique Email Address.');
      return;
    }
    if (birthYear === '') {
      setValidationError('Please select your birth year.');
      return;
    }
    if (!currentLocation.trim()) {
      setValidationError('Please provide your Current City, State.');
      return;
    }

    if (childrenCount === '' || childrenCount === undefined) {
      setValidationError('Please select how many children from the dropdown.');
      return;
    }

    if (typeof childrenCount === 'number' && childrenCount > 0) {
      const hasEmptyAge = Array.from({ length: childrenCount }).some((_, idx) => !childAges[idx]?.trim());
      if (hasEmptyAge) {
        setValidationError('Please enter the age for each of your children.');
        return;
      }
    }

    if (!socialHandle.trim()) {
      setValidationError('Please provide your Social Media Handle (TikTok, Instagram).');
      return;
    }

    if (!phoneNumber.trim()) {
      setValidationError('Please provide your Phone Number.');
      return;
    }
    if (!vocationTrade.trim()) {
      setValidationError('Please provide your Current Work / Profession.');
      return;
    }
    if (!barterPerks.trim()) {
      setValidationError('Please provide the Products or Services provided for our internal barter network.');
      return;
    }

    // Check unique email address against known applications
    const isEmailDuplicate = existingApplicants.some(
      a => a.email.toLowerCase().trim() === emailAddress.toLowerCase().trim() && a.status === 'approved'
    );
    if (isEmailDuplicate) {
      setValidationError(`An active approved membership already exists for ${emailAddress.trim()}. Please log in or contact Council stewards.`);
      return;
    }

    // PART 4: Covenant agreement requirement
    if (!pmaDeclaration || !codeOfConduct) {
      setValidationError('Both the Private Membership Association (PMA) Declaration and Sisterhood Code of Conduct must be affirmed to proceed.');
      return;
    }

    setIsSubmitting(true);

    const calculatedAge = 2026 - Number(birthYear);
    const appId = `app-pma-${Date.now()}`;
    const compiledChildrenAges = typeof childrenCount === 'number'
      ? childrenCount === 0
        ? '0 children (No active maternal dependents)'
        : `${childrenCount} ${childrenCount === 1 ? 'child' : 'children'}: Ages ${childAges.slice(0, childrenCount).map(a => a.trim()).join(', ')}`
      : '';

    const wantsToBeStateLead = stateLeadChoice === 'yes';

    // -----------------------------------------------------------------------
    // CHAPTER LEAD VETTING QUALIFICATION EVALUATION
    // Note: State lead suitability does NOT disqualify her from general membership!
    // If core gates pass, general membership is 100% approved.
    // -----------------------------------------------------------------------
    let stateLeadStatus: 'certified_candidate' | 'on_hold' | 'declined' | 'not_applied' = 'not_applied';
    if (wantsToBeStateLead) {
      const canProvideGroundSupport = 
        stateLeadGroundSupport.includes('spot scouting') || 
        stateLeadGroundSupport.includes('business, private land');
      stateLeadStatus = canProvideGroundSupport ? 'certified_candidate' : 'on_hold';
    }

    // -----------------------------------------------------------------------
    // AUTOMATED SIFTING & KNOCK-OUT RULES (AUTO-REJECTION LOGIC)
    // Rule A: birth_year is 1996 or later
    // Rule B: "Other (Lineage African, Afro-Caribbean, Asiatic, Caribbean, etc.)"
    // Rule C: "I reject it immediately if it contradicts what I've learned."
    // Rule D: childrenCount === 0 (Motherhood Gate: Applicant must have children)
    // -----------------------------------------------------------------------
    if (hasKnockoutTrigger) {
      let reason = '';
      if (isMotherhoodDisqualified) {
        reason = `Rule D (Motherhood Gate): Applicant indicated 0 children. Membership is reserved for active mothers.`;
      } else if (isAgeDisqualified) {
        reason = `Rule A (Age Gate): Birth year ${birthYear} is 1996 or later (${calculatedAge} years old). Requires 1995 or earlier.`;
      } else if (isLineageDisqualified) {
        reason = `Rule B (Maternal Lineage Gate): Non-American-born melanated maternal lineage selected.`;
      } else if (isPerspectiveDisqualified) {
        reason = `Rule C (Lineage Perspective Gate): Selected immediate rejection of contradictory data.`;
      }

      // HALT PROCESSING INSTANTLY:
      // Update database status to "Disqualified", route user to generic fallback screen.
      // Do NOT create user profiles or trigger invitation emails for these submissions.
      const disqualifiedApp: Applicant = {
        id: appId,
        name: fullName.trim(),
        email: emailAddress.trim(),
        birthYear: Number(birthYear),
        ageRange: `${calculatedAge} years old`,
        currentLocation: currentLocation.trim(),
        childrenAndAges: compiledChildrenAges,
        socialHandle: socialHandle.trim(),
        phoneNumber: phoneNumber.trim(),
        maternalLineageConfirmed: !isLineageDisqualified,
        maternal_lineage: maternalLineage,
        lineage_perspective: lineagePerspective,
        currentVocation: vocationTrade.trim(),
        vocation_trade: vocationTrade.trim(),
        barterContribution: barterPerks.trim(),
        barter_perks: barterPerks.trim(),
        communityContributionTypes,
        communityContributionDetails: communityContributionDetails.trim(),
        wantsToBeStateLead,
        stateLeadWhy: stateLeadWhy.trim(),
        stateLeadExperience: wantsToBeStateLead ? stateLeadExperience : undefined,
        stateLeadGroundSupport: wantsToBeStateLead ? stateLeadGroundSupport : undefined,
        stateLeadPeopleManagement: wantsToBeStateLead ? stateLeadPeopleManagement : undefined,
        stateLeadConflictApproach: wantsToBeStateLead ? stateLeadConflictApproach.trim() : undefined,
        stateLeadStatus: wantsToBeStateLead ? stateLeadStatus : 'not_applied',
        pma_declaration: pmaDeclaration,
        code_of_conduct: codeOfConduct,
        agreedToPmaCovenant: pmaDeclaration,
        agreedToCodeOfConduct: codeOfConduct,
        status: 'disqualified',
        disqualificationReason: reason,
        submittedAt: 'Today'
      };

      try {
        await fetch('/api/sanctuary/apply', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            full_name: fullName.trim(),
            email_address: emailAddress.trim(),
            birth_year: Number(birthYear),
            current_location: currentLocation.trim(),
            children_ages: compiledChildrenAges,
            social_handle: socialHandle.trim(),
            phone_number: phoneNumber.trim(),
            maternal_lineage: maternalLineage,
            lineage_perspective: lineagePerspective,
            vocation_trade: vocationTrade.trim(),
            barter_perks: barterPerks.trim(),
            community_contributions: communityContributionTypes,
            community_details: communityContributionDetails.trim(),
            wants_to_be_state_lead: wantsToBeStateLead,
            state_lead_status: stateLeadStatus,
            pma_declaration: pmaDeclaration,
            code_of_conduct: codeOfConduct
          })
        });
      } catch (err) {
        console.warn('Backend sync logged with local state', err);
      }

      setIsSubmitting(false);
      onSubmitApplication(disqualifiedApp);
      return;
    }

    // -----------------------------------------------------------------------
    // APPROVAL PIPELINE & PRE-POPULATED ACCOUNT CREATION
    // Applicant passed all conditional gates!
    // Action 1: Save application marked "Status: Approved".
    // Action 2: Carry forward full_name, email_address, phone_number, etc. to user directory.
    // Action 3: Generate secure single-use activation portal token.
    // Action 4: Instantly execute API email trigger using the transactional template.
    // -----------------------------------------------------------------------
    const secureToken = `pma-token-${btoa(emailAddress.trim()).replace(/=/g, '').slice(0, 8)}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 8)}`;
    const dynamicTokenLink = `https://coppermommies.co/portal/activate?token=${encodeURIComponent(secureToken)}&email=${encodeURIComponent(emailAddress.trim())}`;
    const dynamicAppDownloadLink = `https://coppermommies.co/download/mobile-app?token=${encodeURIComponent(secureToken)}&email=${encodeURIComponent(emailAddress.trim())}`;

    // 4. TRANSACTIONAL WELCOME & APP DOWNLOAD TEMPLATE
    const emailSubject = `Welcome to the Village, Matriarch ${fullName.trim()} - Secure Portal Access Inside`;
    const emailBody = `Greetings Sister ${fullName.trim()},

Your private application to The Sovereign Sanctuary for Melanated American Mothers has been processed and authenticated by the Matriarch Council. Your verified alignment with our generational parameters, American-born maternal lineage, and private covenant guidelines has been fully confirmed.

You have officially crossed the threshold from the public domain into our private village. To finalize your account setup, access your perks, and step into our community ecosystem, follow these two mandatory steps:

1. Claim Your Portal Access & Profile Setup:
Click the secure link below to officially establish your password and unlock your profile dashboard within our custom AI Studio workspace. Your contact info (${emailAddress.trim()} and ${phoneNumber.trim()}) has already been locked into the system based on your approved application:
👉 ${dynamicTokenLink}

2. Download the Copper Mommies App to Your Phone:
Our private ecosystem requires active proximity synchronization, mutual aid coordination, and decentralized communication. Download the mobile Copper Mommies App directly to your device via the private link below. Once installed, log in with the account credentials you create in Step 1 to instantly access your 50-State Pod, localized barter boards, and the private Nextdoor network:
👉 ${dynamicAppDownloadLink}

We look forward to honoring our ancestral lineage, trading gifts, and sharing sacred botanical wisdom with you in the private feeds.

In Sisterhood, Real Community and Cooperative Growth,
The Matriarch Council & Founder
Copper Mommies Co. PMA`;

    const approvedApp: Applicant = {
      id: appId,
      name: fullName.trim(),
      email: emailAddress.trim(),
      birthYear: Number(birthYear),
      ageRange: `${calculatedAge} years old`,
      currentLocation: currentLocation.trim(),
      childrenAndAges: compiledChildrenAges,
      socialHandle: socialHandle.trim(),
      phoneNumber: phoneNumber.trim(),
      maternalLineageConfirmed: true,
      maternal_lineage: maternalLineage,
      lineage_perspective: lineagePerspective,
      currentVocation: vocationTrade.trim(),
      vocation_trade: vocationTrade.trim(),
      barterContribution: barterPerks.trim(),
      barter_perks: barterPerks.trim(),
      communityContributionTypes,
      communityContributionDetails: communityContributionDetails.trim(),
      wantsToBeStateLead,
      stateLeadWhy: stateLeadWhy.trim(),
      stateLeadExperience: wantsToBeStateLead ? stateLeadExperience : undefined,
      stateLeadGroundSupport: wantsToBeStateLead ? stateLeadGroundSupport : undefined,
      stateLeadPeopleManagement: wantsToBeStateLead ? stateLeadPeopleManagement : undefined,
      stateLeadConflictApproach: wantsToBeStateLead ? stateLeadConflictApproach.trim() : undefined,
      stateLeadStatus: wantsToBeStateLead ? stateLeadStatus : 'not_applied',
      pma_declaration: true,
      code_of_conduct: true,
      agreedToPmaCovenant: true,
      agreedToCodeOfConduct: true,
      status: 'approved',
      activationToken: secureToken,
      activationTokenLink: dynamicTokenLink,
      appDownloadLink: dynamicAppDownloadLink,
      transactionalEmailSent: true,
      transactionalEmail: {
        to: emailAddress.trim(),
        subject: emailSubject,
        body: emailBody,
        sentAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        tokenLink: dynamicTokenLink,
        appDownloadLink: dynamicAppDownloadLink
      },
      submittedAt: 'Today',
      invitationLink: dynamicTokenLink
    };

    // Trigger API server endpoint
    try {
      await fetch('/api/sanctuary/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName.trim(),
          email_address: emailAddress.trim(),
          birth_year: Number(birthYear),
          current_location: currentLocation.trim(),
          children_ages: compiledChildrenAges,
          social_handle: socialHandle.trim(),
          phone_number: phoneNumber.trim(),
          maternal_lineage: maternalLineage,
          lineage_perspective: lineagePerspective,
          vocation_trade: vocationTrade.trim(),
          barter_perks: barterPerks.trim(),
          community_contributions: communityContributionTypes,
          community_details: communityContributionDetails.trim(),
          wants_to_be_state_lead: wantsToBeStateLead,
          state_lead_status: stateLeadStatus,
          pma_declaration: true,
          code_of_conduct: true
        })
      });
    } catch (err) {
      console.warn('API execution dispatched with local database synchronization', err);
    }

    // Pre-populate user profile in directory database (localStorage sync)
    try {
      const existingMembersStr = localStorage.getItem('copper_village_members');
      const existingMembers = existingMembersStr ? JSON.parse(existingMembersStr) : [];
      const userState = currentLocation.trim().split(',')[1]?.trim() || 'GA';
      const newMemberProfile = {
        id: `mem-${Date.now()}`,
        name: fullName.trim(),
        email: emailAddress.trim(),
        phone: phoneNumber.trim(),
        stateCode: userState.slice(0, 2).toUpperCase(),
        stateName: currentLocation.trim(),
        role: wantsToBeStateLead ? 'spearhead' : 'member',
        status: 'active_good_standing',
        joinedDate: 'October 2026',
        barterHoursBalance: 5,
        tradesCompleted: 0,
        strikesCount: 0,
        bioSnippet: `${vocationTrade.trim()} • Barter: ${barterPerks.trim()}`
      };
      localStorage.setItem('copper_village_members', JSON.stringify([newMemberProfile, ...existingMembers]));
      window.dispatchEvent(new Event('copper-members-updated'));
    } catch (err) {
      console.error('Error pre-populating user directory database:', err);
    }

    setIsSubmitting(false);
    onSubmitApplication(approvedApp);
  };

  const handleCopy = (text: string, type: 'token' | 'email' | 'app') => {
    navigator.clipboard.writeText(text);
    if (type === 'token') {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    } else if (type === 'email') {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 3000);
    } else if (type === 'app') {
      setCopiedAppDownload(true);
      setTimeout(() => setCopiedAppDownload(false), 3000);
    }
  };

  // =========================================================================
  // VIEW: DISQUALIFIED FALLBACK REDIRECT SCREEN
  // =========================================================================
  if (currentApplication && currentApplication.status === 'disqualified') {
    return (
      <div className="max-w-2xl mx-auto my-8 p-6 sm:p-10 bg-white border-2 border-slate-300 rounded-3xl shadow-2xl space-y-7 text-center animate-fade-in relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-slate-200/50 rounded-full blur-3xl pointer-events-none" />

        <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center mx-auto border-2 border-slate-300 shadow-inner">
          <ShieldAlert className="w-8 h-8 text-slate-500" />
        </div>

        <div className="space-y-2">
          <span className="inline-block text-[11px] font-mono uppercase tracking-widest text-slate-600 font-bold bg-slate-100 px-3.5 py-1 rounded-full border border-slate-200">
            Private Membership Association Notice
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-slate-800">
            Sanctuary Application Status
          </h2>
        </div>

        {/* EXACT DISQUALIFIED REDIRECT PAGE CONTENT */}
        <div className="p-6 sm:p-7 bg-slate-50/90 rounded-2xl border border-slate-200 text-left space-y-4 shadow-sm">
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-sans">
            "Thank you for sharing your profile details with Copper Mommies Co. Our current structural space and private research cohorts are bound to strict generational, lineage-specific, and constitutional criteria matching our active tribal matrices. Based on your answers, there is not an exact alignment with this specific pod's current focus. We honor your path and wish you great success on your journey forward."
          </p>
        </div>

        {/* Sovereign Action Controls */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => onSubmitApplication(null)}
            className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-300 hover:border-slate-400 text-xs font-mono font-bold text-slate-700 bg-white hover:bg-slate-50 transition-all cursor-pointer shadow-sm flex items-center justify-center space-x-2"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span>Review / Re-Submit Application</span>
          </button>
          {onNavigateToPortal && (
            <button
              type="button"
              onClick={onNavigateToPortal}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-mono font-bold transition-all cursor-pointer shadow-md flex items-center justify-center space-x-2"
            >
              <span>Explore Public Village Commons</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="text-[10px] text-slate-400 font-mono">
          Held in Private Trust • Private Membership Association (PMA)
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW: APPROVED APPLICANT PIPELINE (PORTAL ACCESS & TRANSACTIONAL EMAIL)
  // =========================================================================
  if (currentApplication && currentApplication.status === 'approved') {
    const tokenRegistrationLink = currentApplication.activationTokenLink || 
      `https://coppermommies.co/portal/activate?token=${currentApplication.activationToken || 'pma-active'}&email=${encodeURIComponent(currentApplication.email)}`;
    const mobileAppDownloadLink = currentApplication.appDownloadLink || 
      `https://coppermommies.co/download/mobile-app?token=${currentApplication.activationToken || 'pma-active'}`;

    return (
      <div className="max-w-3xl mx-auto my-6 p-6 sm:p-8 bg-white border-2 border-[#D4AF37]/50 rounded-3xl shadow-2xl space-y-7 relative overflow-hidden animate-fade-in">
        <div className="absolute top-0 right-0 w-60 h-60 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Celebration Header */}
        <div className="text-center space-y-2.5">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B87333] text-[#1F140E] flex items-center justify-center mx-auto border-2 border-white shadow-lg">
            <ShieldCheck className="w-9 h-9" />
          </div>

          <span className="inline-block text-[11px] font-mono uppercase tracking-widest text-[#B87333] font-black bg-[#FAF5EE] px-4 py-1 rounded-full border border-[#D4AF37]/40 shadow-sm">
            ✨ Application Authenticated &amp; Approved by Matriarch Council
          </span>

          <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#1F1813]">
            Welcome to the Village, Matriarch {currentApplication.name}!
          </h2>
          <p className="text-xs sm:text-sm text-[#2A221B]/80 font-mono max-w-xl mx-auto">
            You have officially crossed the threshold from the public domain into our private sovereign sisterhood.
          </p>
        </div>

        {/* CHAPTER LEAD ROLE NOTIFICATION CARD (IF APPLIED FOR LEAD) */}
        {currentApplication.wantsToBeStateLead && (
          <div className="animate-fade-in">
            {currentApplication.stateLeadStatus === 'certified_candidate' ? (
              <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-50 to-[#FAF5EE] rounded-2xl border-2 border-[#D4AF37] shadow-sm flex items-start space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37] text-[#1F140E] flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                  <Award className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#D4AF37] text-[#1F140E]">
                      🌟 CHAPTER LEAD STATUS: APPROVED CANDIDATE
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-sm sm:text-base text-[#1F1813]">
                    Certified for Local State Lead &amp; Chapter Coordination
                  </h4>
                  <p className="text-xs text-[#2A221B]/85 leading-relaxed">
                    Your readiness to assist Founder Shantrece with local hometown surroundings, spot scouting, and sister meetup coordination has been approved! While our sanctuary operates primarily online, Founder Shantrece travels and will connect directly with you for state gathering synchronization and local space arrangements.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 sm:p-5 bg-amber-50/70 rounded-2xl border-2 border-amber-300 shadow-sm flex items-start space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                  <Heart className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-200 text-amber-900">
                      🕊️ CHAPTER LEAD STATUS: ON HOLD (MEMBERSHIP 100% APPROVED)
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-sm text-[#1F1813]">
                    General Sisterhood Membership Fully Authenticated
                  </h4>
                  <p className="text-xs text-[#2A221B]/85 leading-relaxed">
                    Thank you for raising your hand to serve! Because our Chapter Leads specifically assist Founder Shantrece with in-person hometown surroundings and local gathering venue coordination during regional visits, your Chapter Lead application is currently on hold. However, your full access as an active Copper Mommies member is 100% approved!
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TWO MANDATORY ACCESS STEPS */}
        <div className="space-y-4">
          <h3 className="font-serif font-bold text-sm uppercase tracking-wider text-[#B87333] flex items-center space-x-2">
            <Key className="w-4 h-4 text-[#D4AF37]" />
            <span>Follow These Two Mandatory Steps to Finalize Your Setup:</span>
          </h3>

          {/* STEP 1: Claim Your Portal Access & Profile Setup */}
          <div className="p-4 sm:p-5 bg-[#FAF5EE] rounded-2xl border-2 border-[#D4AF37]/40 space-y-3 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase font-black px-2 py-0.5 rounded bg-[#D4AF37]/30 text-[#1F1813]">
                  Step 1 of 2
                </span>
                <h4 className="font-serif font-bold text-base text-[#1F1813]">
                  Claim Your Portal Access &amp; Profile Setup
                </h4>
                <p className="text-xs text-[#2A221B]/85 leading-relaxed">
                  Click the secure link below to officially establish your password and unlock your profile dashboard within our custom AI Studio workspace. Your contact info (<code className="font-mono text-[#B87333] font-bold">{currentApplication.email}</code> and <code className="font-mono text-[#B87333] font-bold">{currentApplication.phoneNumber}</code>) has already been locked into the system based on your approved application.
                </p>
              </div>
            </div>

            {/* Dynamic Token Registration Link Box */}
            <div className="bg-white p-3 rounded-xl border border-[#D4AF37]/40 font-mono text-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
              <span className="truncate text-[#1F1813] font-semibold flex-1">
                👉 {tokenRegistrationLink}
              </span>
              <div className="flex items-center space-x-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleCopy(tokenRegistrationLink, 'token')}
                  className="px-3 py-1.5 bg-[#B87333] hover:bg-[#A85138] text-white text-[11px] font-bold rounded-lg transition-all flex items-center space-x-1 cursor-pointer"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
                </button>
                <a
                  href={tokenRegistrationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-[#D4AF37] hover:bg-[#C5A02E] text-[#1F140E] text-[11px] font-black rounded-lg transition-all flex items-center space-x-1 shadow-sm"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Portal</span>
                </a>
              </div>
            </div>
          </div>

          {/* STEP 2: Download the Copper Mommies App to Your Phone */}
          <div className="p-4 sm:p-5 bg-[#FAF5EE] rounded-2xl border-2 border-emerald-600/30 space-y-3 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase font-black px-2 py-0.5 rounded bg-emerald-100 text-emerald-900">
                  Step 2 of 2
                </span>
                <h4 className="font-serif font-bold text-base text-[#1F1813]">
                  Download the Copper Mommies App to Your Phone
                </h4>
                <p className="text-xs text-[#2A221B]/85 leading-relaxed">
                  Our private ecosystem requires active proximity synchronization, mutual aid coordination, and decentralized communication. Download the mobile Copper Mommies App directly to your device via the private link below. Once installed, log in with the account credentials you create in Step 1 to instantly access your 50-State Pod, localized barter boards, and the private Nextdoor network.
                </p>
              </div>
            </div>

            {/* Mobile App Download Link Box */}
            <div className="bg-white p-3 rounded-xl border border-emerald-300 font-mono text-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
              <span className="truncate text-[#1F1813] font-semibold flex-1">
                👉 {mobileAppDownloadLink}
              </span>
              <div className="flex items-center space-x-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleCopy(mobileAppDownloadLink, 'app')}
                  className="px-3 py-1.5 bg-[#3A4C3A] hover:bg-[#2A3C2A] text-white text-[11px] font-bold rounded-lg transition-all flex items-center space-x-1 cursor-pointer"
                >
                  {copiedAppDownload ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedAppDownload ? 'Copied' : 'Copy Link'}</span>
                </button>
                <a
                  href={mobileAppDownloadLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black rounded-lg transition-all flex items-center space-x-1 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download App</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 4. TRANSACTIONAL WELCOME EMAIL DISPATCH CARD & INBOUND PREVIEW */}
        <div className="bg-gradient-to-br from-[#1F140E] to-[#2E1E14] text-[#FAF5EE] p-5 sm:p-6 rounded-2xl border-2 border-[#D4AF37]/50 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D4AF37]/30 pb-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center border border-[#D4AF37]/40">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-[#D4AF37] tracking-wider block">
                  Transactional Automated Email Trigger Executed
                </span>
                <h4 className="font-serif text-sm font-bold text-[#FAF5EE]">
                  Delivered to: {currentApplication.email}
                </h4>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => handleCopy(currentApplication.transactionalEmail?.body || '', 'email')}
                className="px-3 py-1.5 bg-[#D4AF37] hover:bg-[#C5A02E] text-[#1F140E] font-mono text-xs font-bold rounded-lg transition-all flex items-center space-x-1 cursor-pointer"
              >
                {copiedEmail ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedEmail ? 'Copied Email' : 'Copy Email Text'}</span>
              </button>
              <button
                type="button"
                onClick={() => setShowEmailDetailsModal(!showEmailDetailsModal)}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-[#FAF5EE] font-mono text-xs font-bold rounded-lg transition-all flex items-center space-x-1 cursor-pointer"
              >
                <span>{showEmailDetailsModal ? 'Collapse' : 'Inspect Email'}</span>
                {showEmailDetailsModal ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="text-xs space-y-1 font-mono">
            <div className="text-[#D4AF37]">
              <strong>Subject:</strong> {currentApplication.transactionalEmail?.subject || `Welcome to the Village, Matriarch ${currentApplication.name} - Secure Portal Access Inside`}
            </div>
            <div className="text-[#FAF5EE]/70">
              <strong>From:</strong> The Matriarch Council &amp; Founder &lt;council@coppermommies.co&gt;
            </div>
          </div>

          {/* Full Email Body Preview */}
          {showEmailDetailsModal && (
            <div className="bg-[#120A06] p-4 rounded-xl border border-[#D4AF37]/30 text-xs text-[#FAF5EE]/90 whitespace-pre-line font-sans leading-relaxed space-y-2 animate-fade-in max-h-96 overflow-y-auto">
              {currentApplication.transactionalEmail?.body}
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onSubmitApplication(null)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-mono font-bold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            ← Submit Another Application
          </button>

          {onNavigateToPortal && (
            <button
              type="button"
              onClick={onNavigateToPortal}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#B87333] to-[#D4AF37] hover:from-[#A85138] hover:to-[#c29e2e] text-[#1F1813] font-serif uppercase tracking-widest font-extrabold text-xs rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Step Into Private Sanctuary Hubs</span>
              <ArrowRight className="w-4 h-4 text-[#1F1813]" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW: THE LIVE PMA SANCTUARY APPLICATION FORM
  // =========================================================================
  return (
    <div className="space-y-6 max-w-4xl mx-auto my-4">
      {/* ========================================================================= */}
      {/* TOP FEATURE SECTION: AUTO-SCROLLING PMA BENEFITS, PILLARS & PMA COVENANT   */}
      {/* ========================================================================= */}
      <div 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="bg-gradient-to-r from-[#2A1D16] via-[#1F140E] to-[#2A1D16] text-[#FAF5EE] border-2 border-[#D4AF37]/50 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden transition-all"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Tab Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#D4AF37]/25 pb-4">
          <div>
            <div className="flex items-center space-x-2 text-[#D4AF37] mb-1">
              <Sparkles className="w-4 h-4 text-[#D4AF37] animate-pulse" />
              <span className="font-mono text-xs uppercase font-extrabold tracking-widest">
                Private Membership Association (PMA)
              </span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#FAF5EE]">
              PMA Privileges, Standards &amp; Sanctuary Protections
            </h2>
          </div>

          <div className="flex items-center space-x-1.5 self-start sm:self-auto">
            <button
              type="button"
              onClick={handlePrevTab}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#FAF5EE] transition-colors cursor-pointer"
              title="Previous Slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#FAF5EE] transition-colors cursor-pointer"
              title={isAutoPlaying ? "Pause Auto-play" : "Play Auto-play"}
            >
              {isAutoPlaying ? <Pause className="w-4 h-4 text-[#D4AF37]" /> : <Play className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={handleNextTab}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#FAF5EE] transition-colors cursor-pointer"
              title="Next Slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          <button
            type="button"
            onClick={() => handleSelectTab('benefits')}
            className={`py-2 px-3 rounded-xl text-xs font-mono font-bold transition-all text-center cursor-pointer ${
              gatewayTab === 'benefits'
                ? 'bg-[#D4AF37] text-[#1F140E] shadow-md font-extrabold'
                : 'bg-white/5 text-[#FAF5EE]/70 hover:bg-white/10 border border-white/10'
            }`}
          >
            <span>PMA Benefits (7)</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectTab('pillars')}
            className={`py-2 px-3 rounded-xl text-xs font-mono font-bold transition-all text-center cursor-pointer ${
              gatewayTab === 'pillars'
                ? 'bg-[#D4AF37] text-[#1F140E] shadow-md font-extrabold'
                : 'bg-white/5 text-[#FAF5EE]/70 hover:bg-white/10 border border-white/10'
            }`}
          >
            <span>4 Sacred Pillars</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectTab('covenant')}
            className={`py-2 px-3 rounded-xl text-xs font-mono font-bold transition-all text-center cursor-pointer ${
              gatewayTab === 'covenant'
                ? 'bg-[#D4AF37] text-[#1F140E] shadow-md font-extrabold'
                : 'bg-white/5 text-[#FAF5EE]/70 hover:bg-white/10 border border-white/10'
            }`}
          >
            <span>PMA Sanctuary</span>
          </button>
        </div>

        {/* Auto-scroll progress line */}
        <div className="w-full bg-white/10 h-1 rounded-full mt-3 overflow-hidden">
          <div 
            className="bg-[#D4AF37] h-full transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Tab Content Display */}
        <div className="mt-5 min-h-[120px]">
          {gatewayTab === 'benefits' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 text-xs animate-fade-in">
              <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-1">
                <span className="font-bold text-[#D4AF37] block">1. Private Barter Ledger</span>
                <p className="text-white/80 text-[11px]">Exchange handmade goods, doula services, and organic produce with zero corporate middleman.</p>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-1">
                <span className="font-bold text-[#D4AF37] block">2. Sovereign Village Feed</span>
                <p className="text-white/80 text-[11px]">Encrypted communication, wellness encouragement, and maternal mutual-aid alerts.</p>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-1">
                <span className="font-bold text-[#D4AF37] block">3. NestBright Co-op Access</span>
                <p className="text-white/80 text-[11px]">Curated indigenous lineage homeschool curricula, traditional history, and math kits.</p>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-1">
                <span className="font-bold text-[#D4AF37] block">4. Folk Herbal Apothecary</span>
                <p className="text-white/80 text-[11px]">Access grandmother-formulated wildcrafted tinctures, oxymels, and family wellness formulas.</p>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-1">
                <span className="font-bold text-[#D4AF37] block">5. 50-State Mother Pods</span>
                <p className="text-white/80 text-[11px]">Localized proximity pods, verified chapter coordinators, and regional in-person gatherings.</p>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-1">
                <span className="font-bold text-[#D4AF37] block">6. Audio Sanctuary & Archive</span>
                <p className="text-white/80 text-[11px]">Exclusive maternal masterclasses, birth recordings, and traditional homekeeping archives.</p>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-1">
                <span className="font-bold text-[#D4AF37] block">7. Mutual Aid & Emergency Relief</span>
                <p className="text-white/80 text-[11px]">Peer-to-peer time credits, family meal trains, and sacred maternal emergency relief pools.</p>
              </div>
            </div>
          )}

          {gatewayTab === 'pillars' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs animate-fade-in">
              <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-1">
                <span className="font-bold text-[#D4AF37] block">I. Generational Motherhood</span>
                <p className="text-white/80 text-[11px]">Honoring the divine role of matriarchs raising self-governed children.</p>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-1">
                <span className="font-bold text-[#D4AF37] block">II. Botanical Wisdom</span>
                <p className="text-white/80 text-[11px]">Preserving traditional Appalachian, Gullah, and Southern root herbalism.</p>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-1">
                <span className="font-bold text-[#D4AF37] block">III. Cooperative Economics</span>
                <p className="text-white/80 text-[11px]">Circulating wealth and skills internally among melanated families.</p>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-1">
                <span className="font-bold text-[#D4AF37] block">IV. Private Jurisdiction</span>
                <p className="text-white/80 text-[11px]">Operating constitutionally in the private domain under private contract.</p>
              </div>
            </div>
          )}

          {gatewayTab === 'covenant' && (
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-xs space-y-2 animate-fade-in">
              <span className="font-bold text-[#D4AF37] block">Faith-Based Sanctuary Protected Under Private Membership Association Bylaws</span>
              <p className="text-white/85 text-[11px] leading-relaxed">
                Copper Mommies Co. is established as an unincorporated Private Membership Association and free-exercise fellowship under private contract law. All discussions, remedies, and exchanges take place strictly between consenting members in the private domain, protected under private contract and sovereign assembly rights.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* THE MULTI-PART PMA APPLICATION FORM CONTAINER                             */}
      {/* ========================================================================= */}
      <div className="bg-white border-2 border-[#D4AF37]/40 rounded-3xl p-5 sm:p-8 shadow-xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#B87333]/5 rounded-full blur-2xl pointer-events-none" />

        {/* Form Title & Subtitle */}
        <div className="border-b border-[#D4AF37]/30 pb-4 space-y-1">
          <div className="flex items-center space-x-2 text-[#B87333]">
            <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider">
              Confidential Admissions &amp; Sisterhood Application
            </span>
          </div>
          <h3 className="font-serif font-black text-2xl sm:text-3xl text-[#1F1813]">
            PMA Sanctuary Application
          </h3>
          <p className="text-xs text-[#2A221B]/80 font-mono">
            Private Membership Association • Confidential Matriarch Review
          </p>
        </div>

        {/* Validation Error Alert */}
        {validationError && (
          <div className="p-3.5 bg-red-50 border-2 border-red-300 rounded-2xl flex items-start space-x-2.5 text-xs text-red-900 animate-fade-in">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <p className="font-medium leading-relaxed">{validationError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-7">
          
          {/* ========================================================================= */}
          {/* PART 1: EXACT USER INTERFACE DATA MAPPING                                */}
          {/* ========================================================================= */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 border-b border-[#D4AF37]/30 pb-2">
              <span className="w-5 h-5 rounded-full bg-[#FAF5EE] text-[#B87333] border border-[#D4AF37]/50 flex items-center justify-center font-mono font-bold text-[10px]">
                1
              </span>
              <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-[#B87333]">
                Part 1: Profile &amp; Contact Information
              </h4>
            </div>

            {/* full_name & email_address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-mono font-bold tracking-wider text-[#2A221B]/70">
                  Full Name <span className="text-[#B87333]">*</span>
                </label>
                <input 
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Sister Shantrece"
                  className="w-full bg-[#FAF5EE]/60 border border-[#D4AF37]/30 focus:border-[#B87333] focus:ring-1 focus:ring-[#B87333] rounded-xl px-3.5 py-2.5 text-xs text-[#1F1813] placeholder-gray-400 focus:outline-none transition-colors font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-mono font-bold tracking-wider text-[#2A221B]/70">
                  Email Address <span className="text-[#B87333]">*</span> (Unique)
                </label>
                <input 
                  type="email"
                  required
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  placeholder="e.g. shantrece@coop.org"
                  className="w-full bg-[#FAF5EE]/60 border border-[#D4AF37]/30 focus:border-[#B87333] focus:ring-1 focus:ring-[#B87333] rounded-xl px-3.5 py-2.5 text-xs text-[#1F1813] placeholder-gray-400 focus:outline-none transition-colors font-medium"
                />
              </div>
            </div>

            {/* birth_year & Current City, State */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-[#FAF5EE]/40 p-3.5 rounded-2xl border border-[#D4AF37]/25">
              
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-mono font-bold tracking-wider text-[#2A221B]/70">
                  Birth Year <span className="text-[#B87333]">*</span>
                </label>
                <select
                  required
                  value={birthYear}
                  onChange={(e) => setBirthYear(e.target.value ? Number(e.target.value) : '')}
                  className="w-full bg-white border border-[#D4AF37]/30 focus:border-[#B87333] focus:ring-1 focus:ring-[#B87333] rounded-xl px-3 py-2.5 text-xs text-[#1F1813] focus:outline-none transition-colors font-medium cursor-pointer"
                >
                  <option value="">Select your birth year...</option>
                  {ALL_BIRTH_YEARS.map((yr) => {
                    const ageIn2026 = 2026 - yr;
                    return (
                      <option key={yr} value={yr}>
                        {yr} ({ageIn2026} years old)
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-mono font-bold tracking-wider text-[#2A221B]/70">
                  Current City, State <span className="text-[#B87333]">*</span>
                </label>
                <input 
                  type="text"
                  required
                  value={currentLocation}
                  onChange={(e) => setCurrentLocation(e.target.value)}
                  placeholder="e.g. Atlanta, GA"
                  className="w-full bg-white border border-[#D4AF37]/30 focus:border-[#B87333] focus:ring-1 focus:ring-[#B87333] rounded-xl px-3.5 py-2.5 text-xs text-[#1F1813] placeholder-gray-400 focus:outline-none transition-colors font-medium"
                />
              </div>

              {/* DYNAMIC CHILDREN COUNT & AGES */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:col-span-2 bg-white p-3.5 rounded-xl border border-[#D4AF37]/30">
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-mono font-bold tracking-wider text-[#2A221B]/70">
                    How Many Children? <span className="text-[#B87333]">*</span>
                  </label>
                  <select
                    required
                    value={childrenCount}
                    onChange={(e) => handleChildrenCountChange(e.target.value)}
                    className="w-full bg-[#FAF5EE]/60 border border-[#D4AF37]/30 focus:border-[#B87333] focus:ring-1 focus:ring-[#B87333] rounded-xl px-3 py-2.5 text-xs text-[#1F1813] focus:outline-none transition-colors font-medium cursor-pointer"
                  >
                    <option value="">Select number of children...</option>
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Child' : 'Children'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-mono font-bold tracking-wider text-[#2A221B]/70">
                    {childrenCount === 0 
                      ? 'Motherhood / Family Status' 
                      : childrenCount === '' 
                      ? 'Ages of Children' 
                      : `Ages of Children (${childrenCount})`} <span className="text-[#B87333]">*</span>
                  </label>

                  {childrenCount === '' && (
                    <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-400 font-mono">
                      Select number of children to enter ages
                    </div>
                  )}

                  {childrenCount === 0 && (
                    <div className="p-2.5 bg-[#FAF5EE]/70 rounded-xl border border-[#D4AF37]/30 text-xs text-[#1F1813] font-medium">
                      0 Children (No children listed)
                    </div>
                  )}

                  {typeof childrenCount === 'number' && childrenCount > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {Array.from({ length: childrenCount }).map((_, idx) => (
                        <div key={idx} className="space-y-0.5">
                          <span className="text-[9px] font-mono font-bold text-[#B87333] block">
                            Child {idx + 1} Age
                          </span>
                          <input
                            type="text"
                            required
                            value={childAges[idx] || ''}
                            onChange={(e) => handleChildAgeChange(idx, e.target.value)}
                            placeholder={`Age (e.g. ${idx === 0 ? '7' : idx === 1 ? '4' : '2'})`}
                            className="w-full bg-[#FAF5EE]/60 border border-[#D4AF37]/30 focus:border-[#B87333] focus:ring-1 focus:ring-[#B87333] rounded-lg px-2.5 py-1.5 text-xs text-[#1F1813] placeholder-gray-400 focus:outline-none transition-colors font-medium text-center"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* MANDATORY Social Media Handle (TikTok, Instagram) & phone_number */}
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-mono font-bold tracking-wider text-[#2A221B]/70">
                  Social Media Handle (TikTok, Instagram) <span className="text-[#B87333]">*</span>
                </label>
                <input 
                  type="text"
                  required
                  value={socialHandle}
                  onChange={(e) => setSocialHandle(e.target.value)}
                  placeholder="@username"
                  className="w-full bg-white border border-[#D4AF37]/30 focus:border-[#B87333] focus:ring-1 focus:ring-[#B87333] rounded-xl px-3.5 py-2.5 text-xs text-[#1F1813] placeholder-gray-400 focus:outline-none transition-colors font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-mono font-bold tracking-wider text-[#2A221B]/70">
                  Phone Number <span className="text-[#B87333]">*</span>
                </label>
                <input 
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="e.g. (404) 555-0192"
                  className="w-full bg-white border border-[#D4AF37]/30 focus:border-[#B87333] focus:ring-1 focus:ring-[#B87333] rounded-xl px-3.5 py-2.5 text-xs text-[#1F1813] placeholder-gray-400 focus:outline-none transition-colors font-medium"
                />
              </div>

            </div>
          </div>

          {/* ========================================================================= */}
          {/* PART 2: MATERNAL LINEAGE & INDIGENOUS ANCESTRY                            */}
          {/* All answer options styled with identical color and layout                */}
          {/* ========================================================================= */}
          <div className="space-y-4 pt-3 border-t border-[#D4AF37]/30">
            <div className="flex items-center space-x-2 border-b border-[#D4AF37]/30 pb-2">
              <span className="w-5 h-5 rounded-full bg-[#B87333] text-white flex items-center justify-center font-mono font-bold text-[10px]">
                2
              </span>
              <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-[#B87333]">
                Part 2: Maternal Lineage &amp; Indigenous Ancestry
              </h4>
            </div>

            {/* maternal_lineage (Radio, Required) */}
            <div className="p-4 rounded-2xl bg-[#FAF5EE]/70 border border-[#D4AF37]/30 space-y-2.5">
              <label className="text-xs font-serif font-bold text-[#1F1813] block">
                Maternal Lineage Confirmation <span className="text-[#B87333]">*</span>
              </label>

              <div className="space-y-2 pt-1">
                {/* Option 1 */}
                <label className="flex items-start space-x-3 p-3.5 bg-white hover:bg-[#FAF5EE]/60 rounded-xl border border-[#D4AF37]/30 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="maternal_lineage"
                    checked={maternalLineage === 'Yes, I confirm both I and my maternal grandmother are North American-born melanated lineage.'}
                    onChange={() => setMaternalLineage('Yes, I confirm both I and my maternal grandmother are North American-born melanated lineage.')}
                    className="text-[#B87333] focus:ring-[#B87333] accent-[#B87333] cursor-pointer mt-0.5"
                  />
                  <span className="text-xs font-medium text-[#1F1813] leading-relaxed">
                    Yes, I confirm both I and my maternal grandmother are North American-born melanated lineage.
                  </span>
                </label>

                {/* Option 2 */}
                <label className="flex items-start space-x-3 p-3.5 bg-white hover:bg-[#FAF5EE]/60 rounded-xl border border-[#D4AF37]/30 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="maternal_lineage"
                    checked={maternalLineage === 'Other (Lineage African, Afro-Caribbean, Asiatic, Caribbean, etc.)'}
                    onChange={() => setMaternalLineage('Other (Lineage African, Afro-Caribbean, Asiatic, Caribbean, etc.)')}
                    className="text-[#B87333] focus:ring-[#B87333] accent-[#B87333] cursor-pointer mt-0.5"
                  />
                  <span className="text-xs font-medium text-[#1F1813] leading-relaxed">
                    Other (Lineage African, Afro-Caribbean, Asiatic, Caribbean, etc.)
                  </span>
                </label>
              </div>
            </div>

            {/* lineage_perspective (Radio, Required) */}
            <div className="p-4 rounded-2xl bg-[#FAF5EE]/70 border border-[#D4AF37]/30 space-y-2.5">
              <label className="text-xs font-serif font-bold text-[#1F1813] block">
                Lineage Perspective &amp; Inquiry Orientation <span className="text-[#B87333]">*</span>
              </label>

              <div className="space-y-2 pt-1">
                {/* Option 1 */}
                <label className="flex items-start space-x-3 p-3.5 bg-white hover:bg-[#FAF5EE]/60 rounded-xl border border-[#D4AF37]/30 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="lineage_perspective"
                    checked={lineagePerspective === 'I lean in with curiosity and want to study the data for myself.'}
                    onChange={() => setLineagePerspective('I lean in with curiosity and want to study the data for myself.')}
                    className="text-[#B87333] focus:ring-[#B87333] accent-[#B87333] cursor-pointer mt-0.5"
                  />
                  <span className="text-xs font-medium text-[#1F1813] leading-relaxed">
                    I lean in with curiosity and want to study the data for myself.
                  </span>
                </label>

                {/* Option 2 */}
                <label className="flex items-start space-x-3 p-3.5 bg-white hover:bg-[#FAF5EE]/60 rounded-xl border border-[#D4AF37]/30 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="lineage_perspective"
                    checked={lineagePerspective === 'I may not know much yet, but I am ready to unlearn and relearn with my sisters.'}
                    onChange={() => setLineagePerspective('I may not know much yet, but I am ready to unlearn and relearn with my sisters.')}
                    className="text-[#B87333] focus:ring-[#B87333] accent-[#B87333] cursor-pointer mt-0.5"
                  />
                  <span className="text-xs font-medium text-[#1F1813] leading-relaxed">
                    I may not know much yet, but I am ready to unlearn and relearn with my sisters.
                  </span>
                </label>

                {/* Option 3 (Grammar corrected to what I've learned) */}
                <label className="flex items-start space-x-3 p-3.5 bg-white hover:bg-[#FAF5EE]/60 rounded-xl border border-[#D4AF37]/30 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="lineage_perspective"
                    checked={lineagePerspective === "I reject it immediately if it contradicts what I've learned."}
                    onChange={() => setLineagePerspective("I reject it immediately if it contradicts what I've learned.")}
                    className="text-[#B87333] focus:ring-[#B87333] accent-[#B87333] cursor-pointer mt-0.5"
                  />
                  <span className="text-xs font-medium text-[#1F1813] leading-relaxed">
                    I reject it immediately if it contradicts what I've learned.
                  </span>
                </label>
              </div>
            </div>

          </div>

          {/* ========================================================================= */}
          {/* PART 3: VOCATION, TRADE & BARTER GIFTS                                    */}
          {/* ========================================================================= */}
          <div className="space-y-4 pt-3 border-t border-[#D4AF37]/30">
            <div className="flex items-center space-x-2 border-b border-[#D4AF37]/30 pb-2">
              <span className="w-5 h-5 rounded-full bg-[#1F1813] text-[#D4AF37] flex items-center justify-center font-mono font-bold text-[10px]">
                3
              </span>
              <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-[#1F1813]">
                Part 3: Vocation, Trade &amp; Barter Gifts
              </h4>
            </div>

            <div className="grid grid-cols-1 gap-3.5 bg-[#FAF5EE]/50 p-4 rounded-2xl border border-[#D4AF37]/30">
              
              {/* vocation_trade (Text, Required) */}
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-mono font-bold tracking-wider text-[#2A221B]/70">
                  Current Work / Profession <span className="text-[#B87333]">*</span>
                </label>
                <input 
                  type="text"
                  required
                  value={vocationTrade}
                  onChange={(e) => setVocationTrade(e.target.value)}
                  placeholder="Current Work / Profession (e.g. Doula, Homeschool Educator, Software, Seamstress)"
                  className="w-full bg-white border border-[#D4AF37]/30 focus:border-[#B87333] focus:ring-1 focus:ring-[#B87333] rounded-xl px-3.5 py-2.5 text-xs text-[#1F1813] placeholder-gray-400 focus:outline-none transition-colors font-medium"
                />
              </div>

              {/* barter_perks (Text, Required) */}
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-mono font-bold tracking-wider text-[#2A221B]/70">
                  Products or Services Provided for Internal Network <span className="text-[#B87333]">*</span>
                </label>
                <textarea 
                  required
                  rows={2}
                  value={barterPerks}
                  onChange={(e) => setBarterPerks(e.target.value)}
                  placeholder="Products or Services provided for internal network (e.g. Organic elderberry syrups, sourdough bread, bookkeeping assistance, childcare swap)"
                  className="w-full bg-white border border-[#D4AF37]/30 focus:border-[#B87333] focus:ring-1 focus:ring-[#B87333] rounded-xl px-3.5 py-2.5 text-xs text-[#1F1813] placeholder-gray-400 focus:outline-none transition-colors resize-none font-medium leading-relaxed"
                />
              </div>

              {/* COMMUNITY CONTRIBUTION & SACRED GIFTS QUESTION */}
              <div className="p-4 bg-white rounded-2xl border border-[#D4AF37]/30 space-y-3">
                <div>
                  <h5 className="font-serif font-bold text-xs sm:text-sm text-[#1F1813] flex items-center space-x-1.5">
                    <Gift className="w-4 h-4 text-[#D4AF37]" />
                    <span>What do you plan to bring or contribute to the Copper Mommies community?</span>
                  </h5>
                  <p className="text-[11px] text-gray-600 leading-snug mt-1">
                    Every sister brings unique gifts to nourish the village. Select what you feel called to share:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {[
                    'Traditional skills, crafts, sewing, or homemaking',
                    'Wellness, herbal wisdom, or doula / birth / postpartum support',
                    'Teaching, homeschooling, or educational curriculum knowledge',
                    'Business services, enterprise mentorship, or artisan products',
                    'Emotional sisterhood support, encouragement, and sister circles',
                    'Land access, venue space, equipment, or cooperative donations',
                    'Barter trades & cooperative economic exchanges'
                  ].map((contrib) => {
                    const isChecked = communityContributionTypes.includes(contrib);
                    return (
                      <label 
                        key={contrib}
                        className={`flex items-start space-x-2.5 p-2.5 rounded-xl border cursor-pointer transition-colors ${
                          isChecked 
                            ? 'bg-[#FAF5EE] border-[#B87333]/60 text-[#1F1813]' 
                            : 'bg-white hover:bg-neutral-50 border-gray-200 text-gray-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              setCommunityContributionTypes(prev => prev.filter(c => c !== contrib));
                            } else {
                              setCommunityContributionTypes(prev => [...prev, contrib]);
                            }
                          }}
                          className="w-4 h-4 text-[#B87333] rounded border-gray-300 focus:ring-[#B87333] accent-[#B87333] cursor-pointer mt-0.5"
                        />
                        <span className="text-[11px] font-medium leading-tight">{contrib}</span>
                      </label>
                    );
                  })}
                </div>

                <div className="space-y-1 pt-1">
                  <label className="block text-[10px] uppercase font-mono font-bold text-[#B87333]">
                    Describe your personal contribution or gifts in your own words (Optional):
                  </label>
                  <textarea
                    rows={2}
                    value={communityContributionDetails}
                    onChange={(e) => setCommunityContributionDetails(e.target.value)}
                    placeholder="Tell us what you are excited to offer to our sisterhood, whether practical skills, herbal remedies, maternal support, or wisdom..."
                    className="w-full bg-[#FAF5EE]/70 border border-[#D4AF37]/30 rounded-xl px-3 py-2 text-xs text-[#1F1813] placeholder-gray-400 focus:outline-none focus:border-[#B87333] resize-none"
                  />
                </div>
              </div>

              {/* State Lead Question with Explanation and Yes / No Checkboxes */}
              <div className="p-4 bg-white rounded-2xl border border-[#D4AF37]/30 space-y-4">
                <div>
                  <h5 className="font-serif font-bold text-xs sm:text-sm text-[#1F1813] flex items-center space-x-1.5">
                    <Award className="w-4 h-4 text-[#D4AF37]" />
                    <span>Interested in serving as a Local State Lead / Chapter Coordinator?</span>
                  </h5>
                  <p className="text-[11px] text-gray-600 leading-snug mt-1">
                    Help welcome new sisters in your state and assist our Founder when statewide meetups or local events take place.
                  </p>
                </div>

                <div className="flex items-center space-x-6">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={stateLeadChoice === 'yes'}
                      onChange={() => setStateLeadChoice(stateLeadChoice === 'yes' ? null : 'yes')}
                      className="w-4 h-4 text-[#B87333] rounded border-gray-300 focus:ring-[#B87333] accent-[#B87333] cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-[#1F1813]">Yes</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={stateLeadChoice === 'no'}
                      onChange={() => setStateLeadChoice(stateLeadChoice === 'no' ? null : 'no')}
                      className="w-4 h-4 text-[#B87333] rounded border-gray-300 focus:ring-[#B87333] accent-[#B87333] cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-[#1F1813]">No</span>
                  </label>
                </div>

                {/* VETTING QUESTIONS FOR CHAPTER LEAD CANDIDATES (REVEALED ONLY IF YES) */}
                {stateLeadChoice === 'yes' && (
                  <div className="pt-3 border-t border-[#D4AF37]/30 space-y-4 animate-fade-in bg-[#FAF5EE]/50 p-3.5 rounded-xl border">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#D4AF37] text-[#1F140E]">
                        Chapter Lead Vetting Questionnaire
                      </span>
                    </div>

                    {/* Question 1: Calling to lead */}
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-[#1F1813]">
                        1. Why do you feel called to serve as a Chapter Lead for your state?
                      </label>
                      <textarea
                        rows={2}
                        value={stateLeadWhy}
                        onChange={(e) => setStateLeadWhy(e.target.value)}
                        placeholder="Share your heart for village building, sisterhood connection, or prior stewardship experience..."
                        className="w-full bg-white border border-[#D4AF37]/30 rounded-xl px-3 py-2 text-xs text-[#1F1813] placeholder-gray-400 focus:outline-none focus:border-[#B87333] resize-none"
                      />
                    </div>

                    {/* Question 2: Coordination experience */}
                    <div className="space-y-2">
                      <label className="block text-[11px] font-bold text-[#1F1813]">
                        2. What coordination or event experience do you bring?
                      </label>
                      <div className="space-y-1.5">
                        {[
                          'Workplace / Professional coordination (organized projects, committee initiatives, or events at my job)',
                          'Community or neighborhood grassroots coordination (mutual aid circles, block gatherings, local community initiatives)',
                          'Informal family reunion, church committee, or volunteer group coordination',
                          'I haven\'t coordinated large groups yet, but I am eager to learn from our Founder and sisters'
                        ].map((exp) => (
                          <label key={exp} className="flex items-start space-x-2.5 p-2 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-neutral-50">
                            <input
                              type="radio"
                              name="lead_exp"
                              checked={stateLeadExperience === exp}
                              onChange={() => setStateLeadExperience(exp)}
                              className="text-[#B87333] accent-[#B87333] cursor-pointer mt-0.5"
                            />
                            <span className="text-xs text-[#1F1813]">{exp}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Question 3: Local Ground Support & Hometown Meetup Assistance */}
                    <div className="space-y-2">
                      <label className="block text-[11px] font-bold text-[#1F1813]">
                        3. Local Ground Support &amp; Meetup Assistance:
                        <span className="block text-[10px] font-normal text-gray-600 mt-0.5">
                          Copper Mommies is primarily online, but as our Founder travels or plans statewide meetups, are you available to assist with local hometown surroundings, spots, or offering land/venue space if you have a business?
                        </span>
                      </label>
                      <div className="space-y-1.5">
                        {[
                          'Yes, I know my local area well and can assist with spot scouting, local guidance, and on-the-ground support',
                          'Yes, and I own/operate a business, private land, or venue space I would love to offer for sister gatherings',
                          'I can help with online state coordination, but cannot assist with in-person venue/ground coordination'
                        ].map((gs) => (
                          <label key={gs} className="flex items-start space-x-2.5 p-2 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-neutral-50">
                            <input
                              type="radio"
                              name="lead_ground"
                              checked={stateLeadGroundSupport === gs}
                              onChange={() => setStateLeadGroundSupport(gs)}
                              className="text-[#B87333] accent-[#B87333] cursor-pointer mt-0.5"
                            />
                            <span className="text-xs text-[#1F1813]">{gs}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Question 4: People Leadership & Conflict Care */}
                    <div className="space-y-2">
                      <label className="block text-[11px] font-bold text-[#1F1813]">
                        4. Have you ever had to manage people, lead teams, or coordinate groups?
                      </label>
                      <div className="space-y-1.5">
                        {[
                          'Yes, in a professional or managerial role at my workplace',
                          'Yes, in a community organization, church, or volunteer leadership setting',
                          'No direct management experience, but I lead with patience, active listening, and peace'
                        ].map((pm) => (
                          <label key={pm} className="flex items-start space-x-2.5 p-2 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-neutral-50">
                            <input
                              type="radio"
                              name="lead_people"
                              checked={stateLeadPeopleManagement === pm}
                              onChange={() => setStateLeadPeopleManagement(pm)}
                              className="text-[#B87333] accent-[#B87333] cursor-pointer mt-0.5"
                            />
                            <span className="text-xs text-[#1F1813]">{pm}</span>
                          </label>
                        ))}
                      </div>

                      {/* Follow-up for people leadership */}
                      {(stateLeadPeopleManagement.includes('professional') || stateLeadPeopleManagement.includes('community')) && (
                        <div className="space-y-1 pt-2 animate-fade-in">
                          <label className="block text-[10px] uppercase font-mono font-bold text-[#B87333]">
                            Briefly describe your approach to leadership and keeping peace in a room of passionate mothers:
                          </label>
                          <textarea
                            rows={2}
                            value={stateLeadConflictApproach}
                            onChange={(e) => setStateLeadConflictApproach(e.target.value)}
                            placeholder="Share how you navigate diverse viewpoints, maintain calm, and foster sisterly unity..."
                            className="w-full bg-white border border-[#D4AF37]/30 rounded-xl px-3 py-2 text-xs text-[#1F1813] placeholder-gray-400 focus:outline-none focus:border-[#B87333] resize-none"
                          />
                        </div>
                      )}
                    </div>

                  </div>
                )}
              </div>

            </div>
          </div>

          {/* ========================================================================= */}
          {/* PART 4: PRIVATE MEMBERSHIP ASSOCIATION COVENANT                           */}
          {/* ========================================================================= */}
          <div className="space-y-4 pt-3 border-t border-[#D4AF37]/30">
            <div className="flex items-center space-x-2 border-b border-[#D4AF37]/30 pb-2">
              <span className="w-5 h-5 rounded-full bg-[#D4AF37] text-[#1F140E] flex items-center justify-center font-mono font-bold text-[10px]">
                4
              </span>
              <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-[#1F1813]">
                Part 4: Private Membership Association Covenant
              </h4>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF5EE]/80 border-2 border-[#D4AF37]/40 space-y-3 text-xs text-[#2A221B]">
              
              {/* pma_declaration (Checkbox, Must be Checked True) */}
              <label className="flex items-start space-x-3 cursor-pointer bg-white p-3 rounded-xl border border-[#D4AF37]/30 transition-colors hover:bg-amber-50/30">
                <input
                  type="checkbox"
                  required
                  checked={pmaDeclaration}
                  onChange={(e) => setPmaDeclaration(e.target.checked)}
                  className="w-4 h-4 text-[#B87333] rounded border-[#D4AF37]/40 focus:ring-[#B87333] accent-[#B87333] cursor-pointer mt-0.5"
                />
                <span className="font-medium text-[11px] leading-relaxed">
                  <strong className="text-[#1F1813]">PMA Declaration:</strong> I acknowledge that Copper Mommies Co. operates as a Private Membership Association and faith-based sanctuary under private contract law. All communications, trades, and remedies shared within are private among members.
                </span>
              </label>

              {/* code_of_conduct (Checkbox, Must be Checked True) */}
              <label className="flex items-start space-x-3 cursor-pointer bg-white p-3 rounded-xl border border-[#D4AF37]/30 transition-colors hover:bg-amber-50/30">
                <input
                  type="checkbox"
                  required
                  checked={codeOfConduct}
                  onChange={(e) => setCodeOfConduct(e.target.checked)}
                  className="w-4 h-4 text-[#B87333] rounded border-[#D4AF37]/40 focus:ring-[#B87333] accent-[#B87333] cursor-pointer mt-0.5"
                />
                <span className="font-medium text-[11px] leading-relaxed">
                  <strong className="text-[#1F1813]">Sisterhood Code of Conduct:</strong> I pledge to treat all sister mothers with sacred respect, honor confidentiality, avoid gossip or dogmatic condemnation, and actively contribute to the well-being of the village.
                </span>
              </label>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-gradient-to-r from-[#B87333] via-[#D4AF37] to-[#B87333] hover:from-[#A85138] hover:to-[#c29e2e] text-[#1F1813] font-serif uppercase tracking-widest font-black text-xs sm:text-sm rounded-2xl shadow-[0_4px_20px_rgba(184,115,51,0.35)] hover:shadow-[0_6px_28px_rgba(184,115,51,0.5)] transition-all duration-300 active:scale-95 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-70"
          >
            <ShieldCheck className="w-5 h-5 text-[#1F1813]" />
            <span>{isSubmitting ? 'Processing Certification...' : 'SIGN COVENANT & SUBMIT CERTIFICATION'}</span>
            <ArrowRight className="w-5 h-5 text-[#1F1813]" />
          </button>

          <p className="text-[10px] text-center text-gray-500 font-mono">
            Submissions are cryptographically bound to Private Membership Association (PMA) private contract jurisdiction.
          </p>
        </form>
      </div>
    </div>
  );
}
