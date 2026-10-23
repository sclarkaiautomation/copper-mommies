import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Check, 
  X, 
  ShieldCheck, 
  Mail, 
  MapPin, 
  Users, 
  Info, 
  AlertCircle,
  Filter, 
  Award, 
  Flag, 
  Globe, 
  Search,
  CheckCircle,
  FolderSync,
  Key,
  Copy,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Megaphone,
  Gift,
  Trophy,
  Edit3,
  Eye,
  EyeOff,
  RefreshCw,
  BookOpen,
  Calendar,
  Layers,
  GraduationCap,
  Phone,
  ArrowUp,
  ArrowDown,
  Trash2,
  Plus,
  Scale,
  Clock,
  Radio,
  Video,
  Coins,
  HeartHandshake,
  AlertTriangle,
  FileCheck,
  Send,
  Zap,
  Sliders,
  History,
  Headphones,
  Building2,
  DollarSign,
  Tag,
  CreditCard,
  ArrowRight,
  Heart,
  Droplets,
  FolderLock,
  Lock,
  Cpu
} from 'lucide-react';
import AdminApothecaryManager from './admin/AdminApothecaryManager';
import AdminCarePodsManager from './admin/AdminCarePodsManager';
import AdminCovenantVault from './admin/AdminCovenantVault';
import AdminMemberDirectory from './admin/AdminMemberDirectory';
import AdminModerationQueue from './admin/AdminModerationQueue';
import AdminKinshipNestBright from './admin/AdminKinshipNestBright';
import AdminRecentLoginsCard from './admin/AdminRecentLoginsCard';
import AdminAutomationHub from './admin/AdminAutomationHub';
import { 
  Applicant, 
  BarterOffer,
  PageSpotlightBanner, 
  ScholarshipEntry, 
  BroadcastBulletin, 
  BarterDisputeRecord, 
  HearthGatheringSession,
  AudioTrack,
  AudioSeriesCategory,
  AudioTimestamp,
  ReferencedRemedy,
  VillagePoll,
  PollCategory,
  PollOption,
  BusinessAdSubmission
} from '../types';
import { 
  INITIAL_BROADCAST_BULLETINS, 
  INITIAL_DISPUTES, 
  INITIAL_HEARTH_SESSIONS 
} from '../data/phase2AdminData';
import { INITIAL_AUDIO_TRACKS } from '../data/audioSanctuaryData';
import { initialVillagePolls } from '../data/pollsData';

export interface AdminVettingProps {
  applicants: Applicant[];
  onApprove: (id: string) => void;
  onDeny: (id: string) => void;
  onApproveSpearhead: (id: string) => void;
  onUpdateApplicantRole?: (id: string, newRole: string, stateCode?: string) => void;
  simulatedRole: 'applicant' | 'approved' | 'representative' | 'admin';
  barterOffers?: BarterOffer[];
  spotlightBanners?: PageSpotlightBanner[];
  onUpdateSpotlight?: (banner: PageSpotlightBanner) => void;
  onAddSpotlight?: (banner: PageSpotlightBanner) => void;
  onDeleteSpotlight?: (id: string) => void;
  onReorderSpotlights?: (banners: PageSpotlightBanner[]) => void;
  onToggleSpotlightActive?: (id: string) => void;
  bulletins?: BroadcastBulletin[];
  onAddBulletin?: (bulletin: BroadcastBulletin) => void;
  onUpdateBulletin?: (bulletin: BroadcastBulletin) => void;
  onDeleteBulletin?: (id: string) => void;
  onToggleBulletinActive?: (id: string) => void;
  disputes?: BarterDisputeRecord[];
  onResolveDispute?: (id: string, decision: string, refundHours: number) => void;
  onAddLedgerAdjustment?: (sisterName: string, hours: number, reason: string, type: 'earn' | 'spend') => void;
  hearthSessions?: HearthGatheringSession[];
  onAddHearthSession?: (session: HearthGatheringSession) => void;
  onUpdateHearthSession?: (session: HearthGatheringSession) => void;
  onDeleteHearthSession?: (id: string) => void;
  onToggleHearthLive?: (id: string) => void;
  scholarshipEntries?: ScholarshipEntry[];
  onSelectWinner?: (id: string) => void;
  onDrawRandomWinners?: (count: number) => void;
  audioTracks?: AudioTrack[];
  onAddAudioTrack?: (track: AudioTrack) => void;
  onUpdateAudioTrack?: (track: AudioTrack) => void;
  onDeleteAudioTrack?: (id: string) => void;
  polls?: VillagePoll[];
  onAddPoll?: (poll: Partial<VillagePoll>) => void;
  onTogglePollActive?: (id: string) => void;
  onDeletePoll?: (id: string) => void;
  onFeaturePoll?: (id: string) => void;
  onBroadcastPoll?: (poll: VillagePoll) => void;
}

export default function AdminVetting({ 
  applicants, 
  onApprove, 
  onDeny, 
  onApproveSpearhead,
  onUpdateApplicantRole,
  simulatedRole,
  barterOffers: propBarterOffers,
  spotlightBanners = [],
  onUpdateSpotlight,
  onAddSpotlight,
  onDeleteSpotlight,
  onReorderSpotlights,
  onToggleSpotlightActive,
  bulletins: propBulletins,
  onAddBulletin,
  onUpdateBulletin,
  onDeleteBulletin,
  onToggleBulletinActive,
  disputes: propDisputes,
  onResolveDispute,
  onAddLedgerAdjustment,
  hearthSessions: propHearthSessions,
  onAddHearthSession,
  onUpdateHearthSession,
  onDeleteHearthSession,
  onToggleHearthLive,
  scholarshipEntries = [],
  onSelectWinner,
  onDrawRandomWinners,
  audioTracks: propAudioTracks,
  onAddAudioTrack,
  onUpdateAudioTrack,
  onDeleteAudioTrack,
  polls: propPolls,
  onAddPoll,
  onTogglePollActive,
  onDeletePoll,
  onFeaturePoll,
  onBroadcastPoll
}: AdminVettingProps) {
  // Navigation Tabs for Admin Command Center
  const [adminTab, setAdminTab] = useState<
    'overview' |
    'inquiries' | 
    'business_ads' |
    'spotlights' | 
    'bulletins' | 
    'polls' | 
    'disputes' | 
    'hearths' | 
    'podcasts' | 
    'scholarships' | 
    'treasury' |
    'apothecary' |
    'care_pods' |
    'covenant_vault' |
    'member_directory' |
    'moderation' |
    'kinship_vault' |
    'aistudio_vault' |
    'automation_hub'
  >('overview');

  // Business Advertising Submissions State
  const [businessAds, setBusinessAds] = useState<BusinessAdSubmission[]>(() => {
    try {
      const stored = localStorage.getItem('copper_business_ad_submissions');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return [
      {
        id: 'ad-default-1',
        businessName: 'Roots & Resilience Master Apothecary',
        ownerName: 'Sister Keisha B.',
        email: 'keisha@rootsresilience.org',
        phone: '(301) 555-0143',
        socialHandle: '@roots_resilience',
        websiteUrl: 'https://coppermommies.co/apothecary',
        placementType: 'both_bundle',
        bannerImageUrl: '/apothecary_sister_herbal.jpg',
        headline: 'Roots & Resilience Master Apothecary — Ancestral Lowcountry Formulas',
        tagline: 'Ancestral botanical oxymels & nettle infusions',
        description: 'Traditional herbal oxymels, wildcrafted Lowcountry tinctures, and postpartum replenishments formulated for melanated mothers.',
        callToActionText: 'Shop Herbal Offerings',
        exclusiveDiscountCode: 'COPPER15',
        discountOfferText: '15% Off all botanical orders with code COPPER15',
        pricingTier: 'pioneer_free',
        pricingAmount: '$0 (Pioneer 30-Day Pass)',
        singleMelanatedWomanOwnedConfirmed: true,
        status: 'approved_live',
        targetCategory: 'Botanicals & Wellness',
        submittedAt: 'Today'
      },
      {
        id: 'ad-pending-2',
        businessName: 'Sunstone Heritage Quilts & Fiber Arts',
        ownerName: 'Sister Althea Vance',
        email: 'althea@sunstonequilts.example',
        phone: '(804) 555-0188',
        socialHandle: '@sunstone_fiber',
        websiteUrl: 'https://sunstonequilts.example',
        placementType: 'commons_sidebar',
        bannerImageUrl: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=600&q=80',
        headline: 'Sunstone Heritage Quilts & Organic Cottons',
        tagline: 'Hand-stitched family heirlooms & baby blankets',
        description: 'Gullah and Southern storytelling patterns made from 100% unbleached organic cotton for infant cribs and peaceful nurseries.',
        callToActionText: 'View Blanket Gallery',
        exclusiveDiscountCode: 'SISTERHOOD20',
        discountOfferText: '20% Off all handmade baby blankets',
        pricingTier: 'sidebar_monthly',
        pricingAmount: '$25/mo',
        singleMelanatedWomanOwnedConfirmed: true,
        status: 'pending_review',
        targetCategory: 'Artisan Crafts',
        submittedAt: 'Today'
      }
    ];
  });
  const [adFeedbackNote, setAdFeedbackNote] = useState<Record<string, string>>({});

  // Treasury & Classifieds Back Office States
  const [adminVendors, setAdminVendors] = useState([
    {
      id: 'vend-1',
      businessName: 'Highland Soil & Organic Amendments',
      contactName: 'Sister Maya',
      email: 'maya@highlandsoil.coop',
      plan: 'quarterly',
      rate: '$60/qtr',
      status: 'active',
      targetHub: 'all',
      approvedAt: '2026-08-20',
      stripeStatus: 'Paid (Active • $60/qtr)'
    },
    {
      id: 'vend-2',
      businessName: 'Heritage Solar Water Pump Systems',
      contactName: 'Brother Marcus & Mama Renee',
      email: 'renee@heritagesolar.example',
      plan: 'monthly',
      rate: '$25/mo',
      status: 'active',
      targetHub: 'marketplace',
      approvedAt: '2026-09-01',
      stripeStatus: 'Paid (Active • $25/mo)'
    },
    {
      id: 'vend-3',
      businessName: 'Ancestral Amber Glassware & Storage Jars',
      contactName: 'Sister Tiffany',
      email: 'tiffany@amberglass.example',
      plan: 'quarterly',
      rate: '$60/qtr',
      status: 'pending_review',
      targetHub: 'all',
      approvedAt: 'Pending Review',
      stripeStatus: 'Payment Authorized ($60)'
    }
  ]);

  const [adminClassifieds, setAdminClassifieds] = useState([
    {
      id: 'class-1',
      title: 'Apprentice Herbalist & Compounder Needed',
      type: 'job_listing',
      fee: '$5.00',
      posterName: 'Mama Shantrece',
      city: 'Atlanta',
      state: 'GA',
      status: 'published',
      date: '2026-09-10'
    },
    {
      id: 'class-2',
      title: '5 Acres Off-Grid Homestead Sister Sub-Lease',
      type: 'land_classified',
      fee: '$10.00',
      posterName: 'Mama Danielle',
      city: 'Asheville',
      state: 'NC',
      status: 'published',
      date: '2026-09-12'
    },
    {
      id: 'class-3',
      title: 'Postpartum Bengkung Belly Binding Apprentice',
      type: 'job_listing',
      fee: '$5.00',
      posterName: 'Mama Keisha',
      city: 'Charleston',
      state: 'SC',
      status: 'published',
      date: '2026-09-13'
    }
  ]);

  const [teaGifts] = useState([
    { id: 'tea-1', sister: 'Mama Keisha (SC)', amount: '$9.00', date: '2026-09-12', note: 'Gratitude to Mama Shantrece for holding this sacred space!' },
    { id: 'tea-2', sister: 'Mama Danielle (NC)', amount: '$27.00', date: '2026-09-13', note: 'For our server costs and keeping the sisterhood sovereign.' },
    { id: 'tea-3', sister: 'Sister Joy (GA)', amount: '$3.00', date: '2026-09-14', note: 'A cup of warm tea from Atlanta sisters 🍵' }
  ]);

  // Internal Fallback State if props not provided
  const [localBulletins, setLocalBulletins] = useState<BroadcastBulletin[]>(propBulletins || INITIAL_BROADCAST_BULLETINS);
  const [localDisputes, setLocalDisputes] = useState<BarterDisputeRecord[]>(propDisputes || INITIAL_DISPUTES);
  const [localHearths, setLocalHearths] = useState<HearthGatheringSession[]>(propHearthSessions || INITIAL_HEARTH_SESSIONS);
  const [localAudioTracks, setLocalAudioTracks] = useState<AudioTrack[]>(propAudioTracks || INITIAL_AUDIO_TRACKS);
  const [localPolls, setLocalPolls] = useState<VillagePoll[]>(propPolls || initialVillagePolls);

  const activeBulletins = propBulletins || localBulletins;
  const activeDisputes = propDisputes || localDisputes;
  const activeHearths = propHearthSessions || localHearths;
  const activeAudioTracks = propAudioTracks || localAudioTracks;
  const activePolls = propPolls || localPolls;

  // Hearth Polls Manager States
  const [pollCategoryFilter, setPollCategoryFilter] = useState<'all' | PollCategory>('all');
  const [showAddPollModal, setShowAddPollModal] = useState(false);
  const [copiedPollSnippetId, setCopiedPollSnippetId] = useState<string | null>(null);
  const [broadcastSuccessPollId, setBroadcastSuccessPollId] = useState<string | null>(null);
  const [newPollData, setNewPollData] = useState<Partial<VillagePoll>>({
    title: '',
    description: '',
    category: 'casual-corner',
    closesAt: 'In 5 Days',
    allowCustomSuggestions: true,
    isCrowdfundedClass: false,
    crowdfundGoal: '$350 community pool',
    active: true,
    featuredOnCasualCorner: true
  });
  const [newPollOptions, setNewPollOptions] = useState<string[]>([
    'Herbal Tinctures & Winter Wellness Protocols',
    'Homeschool Unit Studies on Indigenous Agriculture',
    'Family Economic Self-Reliance & Multi-Family Homestead Trusts'
  ]);

  // Podcast Publisher States
  const [showAddPodcastModal, setShowAddPodcastModal] = useState(false);
  const [newPodcastData, setNewPodcastData] = useState<Partial<AudioTrack>>({
    title: '',
    episodeNumber: 15,
    series: 'casual-corner',
    host: 'Mama Jamila',
    hostRole: 'Grandmother Council Lead',
    durationSeconds: 1800,
    audioUrl: 'https://cdn.freesound.org/previews/568/568468_11861866-lq.mp3',
    coverImage: '/The Casual Corner Talk.jpeg',
    releaseDate: 'Sept 14, 2026',
    description: '',
    timestamps: [
      { timeSeconds: 0, label: 'Opening Libations & Hearth Dedication', summary: 'Grounding the sisterhood in ancestral peace.' },
      { timeSeconds: 600, label: 'Main Discussion & Traditional Wisdom', summary: 'Core practical insights and maternal guidance.' },
      { timeSeconds: 1500, label: 'Sister Q&A and Benediction', summary: 'Closing remarks and herbal homework.' }
    ],
    referencedRemedies: [
      {
        name: 'Womb Harmony Infusion',
        purpose: 'Nourishes the blood and calms postpartum tension.',
        ingredients: ['Red Raspberry Leaf', 'Nettle Leaf', 'Oatstraw', 'Chamomile'],
        instructions: 'Steep 4 tablespoons in 1 quart hot water for 4 hours.',
        category: 'Postpartum Botanical Care'
      }
    ]
  });

  // 1. Inquiries & Role Arbitrator States
  const [selectedStateFilter, setSelectedStateFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'approved' | 'pending' | 'denied' | 'disqualified'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedAppId, setCopiedAppId] = useState<string | null>(null);

  // National Barter Snapshot State for Executive Summary
  const [nationalBarters, setNationalBarters] = useState<BarterOffer[]>(propBarterOffers || []);

  useEffect(() => {
    if (propBarterOffers && propBarterOffers.length > 0) {
      setNationalBarters(propBarterOffers);
    }
    fetch('/api/barter?state=ALL')
      .then(res => res.ok ? res.json() : [])
      .then((data: BarterOffer[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setNationalBarters(data);
        }
      })
      .catch((err) => console.error('Error fetching admin barter snapshot:', err));
  }, [propBarterOffers]);

  // Navigation Drawer State
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState(false);

  // 2. Spotlight Manager States
  const [spotlightHubFilter, setSpotlightHubFilter] = useState<string>('all');
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<PageSpotlightBanner>>({});
  const [showAddBannerModal, setShowAddBannerModal] = useState(false);
  const [previewBanner, setPreviewBanner] = useState<PageSpotlightBanner | null>(null);
  const [newBannerData, setNewBannerData] = useState<Partial<PageSpotlightBanner>>({
    pageId: 'village',
    categoryBadge: 'Featured Community Spotlight',
    title: '',
    subtitle: '',
    description: '',
    bannerImage: '/Copper mommies family on the beach.png',
    externalLink: '',
    linkText: 'Learn More',
    buttonText: 'Claim Benefit',
    promoCode: '',
    promoPrice: '',
    active: true
  });

  // 3. Broadcast Bulletin States
  const [showAddBulletinModal, setShowAddBulletinModal] = useState(false);
  const [editingBulletinId, setEditingBulletinId] = useState<string | null>(null);
  const [newBulletinData, setNewBulletinData] = useState<Partial<BroadcastBulletin>>({
    title: '',
    message: '',
    urgency: 'normal',
    targetHub: 'all',
    colorTheme: 'gold',
    actionText: 'Learn More',
    actionLink: '',
    pinnedBy: 'Matriarch Council',
    active: true
  });

  // 4. Sovereign Ledger & Dispute Arbitrator States
  const [manualSisterName, setManualSisterName] = useState('');
  const [manualCreditAmount, setManualCreditAmount] = useState<number>(2.0);
  const [manualCreditType, setManualCreditType] = useState<'earn' | 'spend'>('earn');
  const [manualReason, setManualReason] = useState('');
  const [selectedDisputeId, setSelectedDisputeId] = useState<string | null>(null);
  const [arbitrationDecision, setArbitrationDecision] = useState('');
  const [arbitrationRefundHours, setArbitrationRefundHours] = useState<number>(1.5);
  const [ledgerSuccessMessage, setLedgerSuccessMessage] = useState<string | null>(null);
  const [recentLedgerAudits, setRecentLedgerAudits] = useState<Array<{
    id: string;
    sister: string;
    amount: number;
    type: 'earn' | 'spend';
    reason: string;
    timestamp: string;
    txHash: string;
  }>>([
    {
      id: 'tx-01',
      sister: 'Mama Jamila',
      amount: 4.0,
      type: 'earn',
      reason: 'Honorary Community Grant: Organic Poultry Broth Prep',
      timestamp: 'Today, 2:15 PM',
      txHash: '0xCOPPER_7B9A_GRANT_CONFIRMED'
    },
    {
      id: 'tx-02',
      sister: 'Sister Keisha',
      amount: 1.5,
      type: 'earn',
      reason: 'Dispute Settlement: Broken Elderberry Jar Recredit',
      timestamp: 'Today, 11:30 AM',
      txHash: '0xCOPPER_4D21_DISPUTE_RECREDIT'
    }
  ]);

  // 5. Hearth Gathering Scheduler States
  const [showAddHearthModal, setShowAddHearthModal] = useState(false);
  const [editingHearthId, setEditingHearthId] = useState<string | null>(null);
  const [newHearthData, setNewHearthData] = useState<Partial<HearthGatheringSession>>({
    title: 'The Casual Corner Talk — Episode',
    topic: '',
    hostSister: 'Mama Jamila & Council Elders',
    hostRole: 'Grandmother Council',
    date: 'Thursday, Sept 25, 2026',
    time: '8:00 PM EST',
    meetingLink: 'https://meet.jit.si/CopperMommiesCasualCorner',
    meetingType: 'Virtual Casual Corner',
    targetState: 'ALL',
    rsvpsCount: 25,
    description: 'Unhurried soul-nourishing live dialogue on sovereign mothering and herbal family care.',
    status: 'Scheduled'
  });

  // 6. Scholarship States
  const [gradeFilter, setGradeFilter] = useState<string>('ALL');
  const [scholarshipSearch, setScholarshipSearch] = useState<string>('');
  const [drawSuccessMessage, setDrawSuccessMessage] = useState<string | null>(null);

  // States List for Geographic Vetting
  const popularStates = [
    { code: 'GA', name: 'Georgia', activeSpearhead: 'Mama Jamila', status: 'active' },
    { code: 'TX', name: 'Texas', activeSpearhead: 'Sister Nia', status: 'pending_approval' },
    { code: 'MD', name: 'Maryland', activeSpearhead: 'Mama Keisha', status: 'pending_approval' },
    { code: 'SC', name: 'South Carolina', activeSpearhead: 'Mother Bessie', status: 'active' },
    { code: 'VA', name: 'Virginia', activeSpearhead: 'Sister Althea', status: 'pending_approval' },
    { code: 'AL', name: 'Alabama', activeSpearhead: 'Sister Clara', status: 'pending_approval' },
    { code: 'CA', name: 'California', activeSpearhead: 'Auntie Brenda', status: 'active' },
    { code: 'NC', name: 'North Carolina', activeSpearhead: null, status: 'vacant' },
    { code: 'FL', name: 'Florida', activeSpearhead: null, status: 'vacant' },
    { code: 'LA', name: 'Louisiana', activeSpearhead: null, status: 'vacant' },
    { code: 'IL', name: 'Illinois', activeSpearhead: null, status: 'vacant' },
    { code: 'MI', name: 'Michigan', activeSpearhead: null, status: 'vacant' },
    { code: 'OH', name: 'Ohio', activeSpearhead: null, status: 'vacant' },
    { code: 'PA', name: 'Pennsylvania', activeSpearhead: null, status: 'vacant' },
    { code: 'NY', name: 'New York', activeSpearhead: null, status: 'vacant' },
  ];

  const getApplicantStateCode = (app: Applicant): string => {
    if (app.stateCode) return app.stateCode;
    const loc = (app.maternalGeography || app.lineageLocation || '').toUpperCase();
    if (loc.includes('TEXAS') || loc.includes('TX')) return 'TX';
    if (loc.includes('MARYLAND') || loc.includes('MD')) return 'MD';
    if (loc.includes('GEORGIA') || loc.includes('GA')) return 'GA';
    if (loc.includes('VIRGINIA') || loc.includes('VA')) return 'VA';
    if (loc.includes('ALABAMA') || loc.includes('AL')) return 'AL';
    if (loc.includes('CAROLINA') || loc.includes('SC') || loc.includes('NC')) return loc.includes('NORTH') || loc.includes('NC') ? 'NC' : 'SC';
    if (loc.includes('FLORIDA') || loc.includes('FL')) return 'FL';
    if (loc.includes('CALIFORNIA') || loc.includes('CA')) return 'CA';
    return 'GA';
  };

  // Executive Summary Statistics Calculations
  const approvedMothers = applicants.filter(a => a.status === 'approved');
  const pendingApplications = applicants.filter(a => a.status === 'pending');
  const deniedApplications = applicants.filter(a => a.status === 'denied');
  const disqualifiedApplications = applicants.filter(a => a.status === 'disqualified');
  const spearheads = approvedMothers.filter(a => a.isStateSpearhead);
  const activeStatesRepresented = new Set(approvedMothers.map(a => getApplicantStateCode(a))).size;

  const totalBarterCount = nationalBarters.length;
  const totalBarterPoints = nationalBarters.reduce((sum, b) => sum + (b.valuePoints || 5), 0);
  const completedHandshakesCount = nationalBarters.filter(
    b => b.handshakeComplete || (b.giverConfirmed && b.recipientConfirmed)
  ).length;
  const giftBarterCount = nationalBarters.filter(
    b => b.category === 'Copper Gift' || b.isGift || b.requestType === 'Gift/Need'
  ).length;

  const filteredApplicants = applicants.filter(app => {
    const stateCode = getApplicantStateCode(app);
    const matchesState = selectedStateFilter === 'ALL' || stateCode === selectedStateFilter;
    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (app.maternalGeography && app.maternalGeography.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (app.connectionStatement && app.connectionStatement.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesState && matchesStatus && matchesSearch;
  });

  const filteredScholarships = scholarshipEntries.filter(entry => {
    const matchesGrade = gradeFilter === 'ALL' || entry.childGrade === gradeFilter;
    const matchesSearch = entry.motherName.toLowerCase().includes(scholarshipSearch.toLowerCase()) ||
                          entry.childName.toLowerCase().includes(scholarshipSearch.toLowerCase()) ||
                          entry.motherEmail.toLowerCase().includes(scholarshipSearch.toLowerCase()) ||
                          entry.learningGoals.toLowerCase().includes(scholarshipSearch.toLowerCase()) ||
                          entry.ticketCode.toLowerCase().includes(scholarshipSearch.toLowerCase());
    return matchesGrade && matchesSearch;
  });

  const filteredSpotlights = spotlightBanners.filter(b => {
    if (spotlightHubFilter === 'all') return true;
    return b.pageId === spotlightHubFilter;
  });

  // Spotlight Handlers
  const handleStartEditSpotlight = (b: PageSpotlightBanner) => {
    setEditingBannerId(b.id);
    setEditFormData({ ...b });
  };

  const handleSaveEditSpotlight = (b: PageSpotlightBanner) => {
    if (onUpdateSpotlight && editFormData) {
      onUpdateSpotlight({ ...b, ...editFormData } as PageSpotlightBanner);
    }
    setEditingBannerId(null);
  };

  const handleCreateSpotlight = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBannerData.title || !newBannerData.description) {
      alert('Please provide a banner title and description.');
      return;
    }
    const newBanner: PageSpotlightBanner = {
      id: `spotlight-${Date.now()}`,
      pageId: newBannerData.pageId || 'village',
      categoryBadge: newBannerData.categoryBadge || 'Featured Partner Spotlight',
      title: newBannerData.title || '',
      subtitle: newBannerData.subtitle || '',
      description: newBannerData.description || '',
      bannerImage: newBannerData.bannerImage || '/The Casual Corner Talk.jpeg',
      externalLink: newBannerData.externalLink || '',
      linkText: newBannerData.linkText || 'Learn More',
      buttonText: newBannerData.buttonText || 'Claim Benefit',
      promoCode: newBannerData.promoCode || '',
      promoPrice: newBannerData.promoPrice || '',
      active: true,
      contactEmail: 'shantrecetogetherwewin@gmail.com'
    };
    if (onAddSpotlight) {
      onAddSpotlight(newBanner);
    }
    setShowAddBannerModal(false);
    alert(`✨ Spotlight banner "${newBanner.title}" created successfully!`);
  };

  const handleMoveSpotlight = (index: number, direction: 'up' | 'down') => {
    const list = [...spotlightBanners];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;
    if (onReorderSpotlights) {
      onReorderSpotlights(list);
    }
  };

  // Bulletin Handlers
  const handleToggleBulletin = (id: string) => {
    if (onToggleBulletinActive) {
      onToggleBulletinActive(id);
    } else {
      setLocalBulletins(prev => prev.map(b => b.id === id ? { ...b, active: !b.active } : b));
    }
  };

  const handleCreateBulletin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBulletinData.title || !newBulletinData.message) {
      alert('Please fill out the announcement title and message.');
      return;
    }
    const newB: BroadcastBulletin = {
      id: `bulletin-${Date.now()}`,
      title: newBulletinData.title || '',
      message: newBulletinData.message || '',
      urgency: newBulletinData.urgency || 'normal',
      targetHub: newBulletinData.targetHub || 'all',
      colorTheme: newBulletinData.colorTheme || 'gold',
      actionText: newBulletinData.actionText || 'Explore',
      actionLink: newBulletinData.actionLink || '',
      pinnedBy: newBulletinData.pinnedBy || 'Matriarch Desk Dispatch',
      createdAt: 'Just now',
      active: true
    };
    if (onAddBulletin) {
      onAddBulletin(newB);
    } else {
      setLocalBulletins(prev => [newB, ...prev]);
    }
    setShowAddBulletinModal(false);
    alert(`📢 Global Broadcast Announcement "${newB.title}" published across all sisters' screens!`);
  };

  const handleDeleteBulletin = (id: string) => {
    if (confirm('Delete this broadcast announcement?')) {
      if (onDeleteBulletin) {
        onDeleteBulletin(id);
      } else {
        setLocalBulletins(prev => prev.filter(b => b.id !== id));
      }
    }
  };

  // Sovereign Ledger Handlers
  const handleManualLedgerAdjust = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualSisterName || !manualReason || manualCreditAmount <= 0) {
      alert('Please specify the sister name, valid credit hours, and audit reason.');
      return;
    }
    const txHash = `0xCOPPER_${Date.now().toString(16).toUpperCase()}_GRANT`;
    const newAudit = {
      id: `tx-${Date.now()}`,
      sister: manualSisterName,
      amount: manualCreditAmount,
      type: manualCreditType,
      reason: manualReason,
      timestamp: 'Just now',
      txHash
    };
    setRecentLedgerAudits(prev => [newAudit, ...prev]);
    if (onAddLedgerAdjustment) {
      onAddLedgerAdjustment(manualSisterName, manualCreditAmount, manualReason, manualCreditType);
    }
    setLedgerSuccessMessage(`✅ Ledger successfully adjusted! ${manualCreditType === 'earn' ? '+' : '-'}${manualCreditAmount} hours credited to ${manualSisterName}. TX: ${txHash}`);
    setTimeout(() => setLedgerSuccessMessage(null), 6000);
    setManualReason('');
  };

  const handleResolveDispute = (dispute: BarterDisputeRecord, action: 'resolve_recredit' | 'dismiss') => {
    const decisionText = action === 'resolve_recredit' 
      ? `Resolved with love: +${arbitrationRefundHours} hours refunded to ${dispute.claimantName} from community reserve.`
      : `Dismissed by Matriarch Council review. No ledger modification required.`;
    
    if (onResolveDispute) {
      onResolveDispute(dispute.id, decisionText, action === 'resolve_recredit' ? arbitrationRefundHours : 0);
    } else {
      setLocalDisputes(prev => prev.map(d => {
        if (d.id === dispute.id) {
          return {
            ...d,
            status: action === 'resolve_recredit' ? 'Resolved & Recredited' : 'Dismissed',
            elderDecision: decisionText,
            resolvedAt: 'Just now',
            resolvedBy: 'Grandmother Council Matriarch'
          };
        }
        return d;
      }));
    }

    if (action === 'resolve_recredit') {
      const newAudit = {
        id: `tx-${Date.now()}`,
        sister: dispute.claimantName,
        amount: arbitrationRefundHours,
        type: 'earn' as const,
        reason: `Dispute Arbitrated: ${dispute.barterTitle}`,
        timestamp: 'Just now',
        txHash: `0xCOPPER_DISPUTE_RECREDIT_${Date.now().toString(16).toUpperCase()}`
      };
      setRecentLedgerAudits(prev => [newAudit, ...prev]);
    }
    setSelectedDisputeId(null);
    alert(`⚖️ Trade dispute "${dispute.barterTitle}" has been arbitrated and logged.`);
  };

  // Hearth Gathering Handlers
  const handleCreateHearth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHearthData.title || !newHearthData.topic || !newHearthData.meetingLink) {
      alert('Please fill out the gathering title, topic, and meeting link.');
      return;
    }
    const newH: HearthGatheringSession = {
      id: `hearth-${Date.now()}`,
      title: newHearthData.title || 'The Casual Corner Talk',
      topic: newHearthData.topic || '',
      hostSister: newHearthData.hostSister || 'Mama Jamila',
      hostRole: newHearthData.hostRole || 'Council Lead',
      date: newHearthData.date || 'Thursday, Sept 25, 2026',
      time: newHearthData.time || '8:00 PM EST',
      meetingLink: newHearthData.meetingLink || 'https://meet.jit.si/CopperMommiesLive',
      meetingType: newHearthData.meetingType || 'Virtual Casual Corner',
      targetState: newHearthData.targetState || 'ALL',
      rsvpsCount: 15,
      description: newHearthData.description || '',
      status: 'Scheduled'
    };
    if (onAddHearthSession) {
      onAddHearthSession(newH);
    } else {
      setLocalHearths(prev => [newH, ...prev]);
    }
    setShowAddHearthModal(false);
    alert(`🔥 Circle gathering "${newH.title}" scheduled!`);
  };

  const handleToggleHearthLiveState = (id: string) => {
    if (onToggleHearthLive) {
      onToggleHearthLive(id);
    } else {
      setLocalHearths(prev => prev.map(h => {
        if (h.id === id) {
          const nextStatus = h.status === 'Live Now' ? 'Scheduled' : 'Live Now';
          return { ...h, status: nextStatus };
        }
        return h;
      }));
    }
  };

  const handleCopyLink = (appId: string, linkText: string) => {
    navigator.clipboard.writeText(linkText);
    setCopiedAppId(appId);
    setTimeout(() => setCopiedAppId(null), 3000);
  };

  const handleTriggerDraw = () => {
    if (onDrawRandomWinners) {
      onDrawRandomWinners(5);
      setDrawSuccessMessage('🎉 5 random entries for NestBright Academy have been selected as verified scholarship winners!');
      setTimeout(() => setDrawSuccessMessage(null), 6000);
    }
  };

  // Poll Management Handlers
  const handleCreatePoll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPollData.title || newPollOptions.filter(o => o.trim()).length < 2) {
      alert('Please provide a ballot question and at least 2 voting options.');
      return;
    }

    const createdOptions: PollOption[] = newPollOptions
      .filter(o => o.trim())
      .map((text, idx) => ({
        id: `opt-${Date.now()}-${idx}`,
        text: text.trim(),
        votes: 0,
        voterNames: []
      }));

    const newPoll: VillagePoll = {
      id: `poll-${Date.now()}`,
      title: newPollData.title || '',
      description: newPollData.description || '',
      category: newPollData.category || 'casual-corner',
      creatorName: 'Mama Shantrece (Admin)',
      creatorRole: 'Founder & Matriarch Lead',
      createdAt: 'Just now',
      closesAt: newPollData.closesAt || 'In 7 Days',
      allowCustomSuggestions: newPollData.allowCustomSuggestions ?? true,
      isCrowdfundedClass: newPollData.isCrowdfundedClass ?? false,
      crowdfundGoal: newPollData.crowdfundGoal || '',
      crowdfundRaised: '$0',
      active: true,
      featuredOnCasualCorner: newPollData.featuredOnCasualCorner ?? true,
      options: createdOptions,
      memberSuggestions: []
    };

    if (onAddPoll) {
      onAddPoll(newPoll);
    } else {
      setLocalPolls(prev => [newPoll, ...prev]);
    }

    setShowAddPollModal(false);
    setNewPollData({
      title: '',
      description: '',
      category: 'casual-corner',
      closesAt: 'In 5 Days',
      allowCustomSuggestions: true,
      isCrowdfundedClass: false,
      crowdfundGoal: '$350 community pool',
      active: true,
      featuredOnCasualCorner: true
    });
    setNewPollOptions(['', '', '']);
    alert(`🗳️ New community poll "${newPoll.title}" published!`);
  };

  const handleTogglePollState = (id: string) => {
    if (onTogglePollActive) {
      onTogglePollActive(id);
    } else {
      setLocalPolls(prev => prev.map(p => p.id === id ? { ...p, active: !p.active } : p));
    }
  };

  const handleDeletePollAction = (id: string) => {
    if (window.confirm('Are you sure you want to remove this poll?')) {
      if (onDeletePoll) {
        onDeletePoll(id);
      } else {
        setLocalPolls(prev => prev.filter(p => p.id !== id));
      }
    }
  };

  const handleToggleFeatureAction = (id: string) => {
    if (onFeaturePoll) {
      onFeaturePoll(id);
    } else {
      setLocalPolls(prev => prev.map(p => p.id === id ? { ...p, featuredOnCasualCorner: !p.featuredOnCasualCorner } : p));
    }
  };

  const handleBroadcastPollToPushBar = (poll: VillagePoll) => {
    if (onBroadcastPoll) {
      onBroadcastPoll(poll);
    } else {
      const newB: BroadcastBulletin = {
        id: `bulletin-poll-${Date.now()}`,
        headline: `🗳️ Vote Now: ${poll.title}`,
        category: 'Live Casual Corner Talk',
        detail: `Cast your vote on our next live circle topic or class: "${poll.title}". Open to all verified sisters.`,
        actionText: 'Cast Your Vote',
        actionUrl: '#hearth-polls-section',
        publishedAt: 'Just now',
        active: true,
        priority: 'high',
        targetState: 'ALL'
      };
      if (onAddBulletin) {
        onAddBulletin(newB);
      } else {
        setLocalBulletins(prev => [newB, ...prev]);
      }
    }
    setBroadcastSuccessPollId(poll.id);
    setTimeout(() => setBroadcastSuccessPollId(null), 4000);
  };

  const handleCopyNewsletterSnippet = (poll: VillagePoll) => {
    const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
    const optionsText = poll.options.map((opt, i) => `  ${i + 1}. ${opt.text} (${opt.votes} votes)`).join('\n');
    const snippet = `🌿 [THE COPPER CIRCLE SISTERHOOD POLL] 🗳️\n\nTopic: ${poll.title}\nCategory: ${poll.category === 'casual-corner' ? 'Casual Corner Talk' : poll.category === 'crowdfunded-class' ? 'Crowdfunded Sister Class' : 'Village Governance'}\nCloses: ${poll.closesAt}\n\nCurrent Community Options:\n${optionsText}\n\n👉 Cast your vote directly in the Community Polls Hub!\nTogether We Grow and Learn in Sisterhood.`;
    navigator.clipboard.writeText(snippet);
    setCopiedPollSnippetId(poll.id);
    setTimeout(() => setCopiedPollSnippetId(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto my-3 space-y-6">
      
      {/* Sleek, Modern, Lightweight Admin Header */}
      <div className="bg-gradient-to-r from-[#1F140E] via-[#2A1D16] to-[#140F0B] text-[#FAF5EE] border border-[#D4AF37]/40 rounded-2xl px-6 py-4 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shrink-0">
            <ShieldAlert className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
              <span>Matriarch Command Desk</span>
              <span>•</span>
              <span className="text-emerald-400">Sovereign Active</span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-black text-[#FAF5EE] tracking-tight">
              Admin Office &amp; Sovereign Hub
            </h2>
          </div>
        </div>

        {/* Right side: Quick stats pill buttons & Menu toggle */}
        <div className="flex items-center space-x-2.5 flex-wrap justify-end">
          <button 
            onClick={() => { setAdminTab('inquiries'); setStatusFilter('approved'); }}
            className="bg-[#180E08] hover:bg-[#251710] border border-emerald-500/40 px-3 py-1.5 rounded-xl text-xs font-mono flex items-center space-x-2 cursor-pointer transition-all"
            title="Approved Mothers"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-300 font-bold">{approvedMothers.length} Approved</span>
          </button>

          <button 
            onClick={() => { setAdminTab('inquiries'); setStatusFilter('pending'); }}
            className="bg-[#180E08] hover:bg-[#251710] border border-amber-500/40 px-3 py-1.5 rounded-xl text-xs font-mono flex items-center space-x-2 cursor-pointer transition-all"
            title="Pending Queue"
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-amber-300 font-bold">{pendingApplications.length} Pending</span>
          </button>

          <button 
            onClick={() => setAdminTab('disputes')}
            className="bg-[#180E08] hover:bg-[#251710] border border-[#B87333]/40 px-3 py-1.5 rounded-xl text-xs font-mono flex items-center space-x-2 cursor-pointer transition-all hidden sm:flex"
            title="Barter Volume"
          >
            <Coins className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="text-[#E6C594] font-bold">{totalBarterCount} Barters</span>
          </button>

          {/* Slide-out Navigation Drawer Toggle */}
          <button
            onClick={() => setIsNavDrawerOpen(true)}
            className="bg-[#D4AF37] hover:bg-[#C29B2E] text-[#1F140E] font-mono text-xs font-black px-4 py-2 rounded-xl shadow-lg flex items-center space-x-2 cursor-pointer transition-all transform hover:scale-105"
          >
            <Layers className="w-4 h-4" />
            <span>☰ Admin Hubs Menu</span>
          </button>
        </div>
      </div>

      {/* Slide-out Navigation Side Panel / Drawer */}
      {isNavDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsNavDrawerOpen(false)}
          />

          {/* Slide-out panel */}
          <div className="relative w-80 sm:w-96 bg-[#1F140E] border-r-2 border-[#D4AF37]/50 shadow-2xl h-full flex flex-col z-10 overflow-y-auto p-6 text-[#FAF5EE]">
            <div className="flex items-center justify-between pb-4 border-b border-[#D4AF37]/30 mb-4">
              <div className="flex items-center space-x-2 text-[#D4AF37]">
                <ShieldAlert className="w-5 h-5" />
                <span className="font-serif font-extrabold text-lg tracking-tight">Admin Office Navigation</span>
              </div>
              <button 
                onClick={() => setIsNavDrawerOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white cursor-pointer transition-colors"
                title="Close Menu"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-white/70 mb-5 leading-relaxed font-sans">
              Select any administrative hub or section below to instantly switch views with smooth transitions.
            </p>

            {/* Navigation Sections in Drawer */}
            <div className="space-y-4 font-mono text-xs">
              {/* Overview */}
              <button
                onClick={() => { setAdminTab('overview'); setIsNavDrawerOpen(false); }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl transition-all flex items-center space-x-2.5 cursor-pointer font-bold ${
                  adminTab === 'overview' ? 'bg-[#D4AF37] text-[#1F140E] shadow-md font-black' : 'bg-white/5 text-white/90 hover:bg-white/10'
                }`}
              >
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                <span>🏛️ Command Center Overview</span>
              </button>

              {/* Membership & Lineage */}
              <div className="space-y-1 bg-white/5 p-3 rounded-xl border border-white/10">
                <span className="text-[#D4AF37] font-bold text-[10px] uppercase tracking-wider block mb-1">🏛️ Membership &amp; Lineage</span>
                <div className="space-y-1 pl-1">
                  <button onClick={() => { setAdminTab('inquiries'); setIsNavDrawerOpen(false); }} className={`w-full text-left px-3 py-2 rounded-lg transition-all cursor-pointer font-bold ${adminTab === 'inquiries' ? 'bg-[#D4AF37] text-[#1F140E]' : 'text-white/80 hover:bg-white/10'}`}>
                    👥 Lineage &amp; Roles ({applicants.length})
                  </button>
                  <button onClick={() => { setAdminTab('member_directory'); setIsNavDrawerOpen(false); }} className={`w-full text-left px-3 py-2 rounded-lg transition-all cursor-pointer font-bold ${adminTab === 'member_directory' ? 'bg-[#D4AF37] text-[#1F140E]' : 'text-white/80 hover:bg-white/10'}`}>
                    📁 Member Rolodex
                  </button>
                </div>
              </div>

              {/* Commerce & Ads */}
              <div className="space-y-1 bg-white/5 p-3 rounded-xl border border-white/10">
                <span className="text-[#D4AF37] font-bold text-[10px] uppercase tracking-wider block mb-1">🛍️ Commerce &amp; Sponsors</span>
                <div className="space-y-1 pl-1">
                  <button onClick={() => { setAdminTab('business_ads'); setIsNavDrawerOpen(false); }} className={`w-full text-left px-3 py-2 rounded-lg transition-all cursor-pointer font-bold ${adminTab === 'business_ads' ? 'bg-[#D4AF37] text-[#1F140E]' : 'text-white/80 hover:bg-white/10'}`}>
                    🛍️ Business Ads ({businessAds.length})
                  </button>
                  <button onClick={() => { setAdminTab('spotlights'); setIsNavDrawerOpen(false); }} className={`w-full text-left px-3 py-2 rounded-lg transition-all cursor-pointer font-bold ${adminTab === 'spotlights' ? 'bg-[#D4AF37] text-[#1F140E]' : 'text-white/80 hover:bg-white/10'}`}>
                    📢 Spotlights &amp; Banners
                  </button>
                  <button onClick={() => { setAdminTab('apothecary'); setIsNavDrawerOpen(false); }} className={`w-full text-left px-3 py-2 rounded-lg transition-all cursor-pointer font-bold ${adminTab === 'apothecary' || adminTab === 'care_pods' ? 'bg-[#D4AF37] text-[#1F140E]' : 'text-white/80 hover:bg-white/10'}`}>
                    🌿 Apothecary &amp; Pods
                  </button>
                </div>
              </div>

              {/* Treasury & Trades */}
              <div className="space-y-1 bg-white/5 p-3 rounded-xl border border-white/10">
                <span className="text-[#D4AF37] font-bold text-[10px] uppercase tracking-wider block mb-1">🪙 Treasury &amp; Trades</span>
                <div className="space-y-1 pl-1">
                  <button onClick={() => { setAdminTab('treasury'); setIsNavDrawerOpen(false); }} className={`w-full text-left px-3 py-2 rounded-lg transition-all cursor-pointer font-bold ${adminTab === 'treasury' ? 'bg-[#D4AF37] text-[#1F140E]' : 'text-white/80 hover:bg-white/10'}`}>
                    🪙 Sovereign Treasury
                  </button>
                  <button onClick={() => { setAdminTab('disputes'); setIsNavDrawerOpen(false); }} className={`w-full text-left px-3 py-2 rounded-lg transition-all cursor-pointer font-bold ${adminTab === 'disputes' ? 'bg-[#D4AF37] text-[#1F140E]' : 'text-white/80 hover:bg-white/10'}`}>
                    ⚖️ Trade Disputes
                  </button>
                  <button onClick={() => { setAdminTab('scholarships'); setIsNavDrawerOpen(false); }} className={`w-full text-left px-3 py-2 rounded-lg transition-all cursor-pointer font-bold ${adminTab === 'scholarships' ? 'bg-[#D4AF37] text-[#1F140E]' : 'text-white/80 hover:bg-white/10'}`}>
                    🎁 Giveaways &amp; Draws
                  </button>
                </div>
              </div>

              {/* Sanctuary Programming */}
              <div className="space-y-1 bg-white/5 p-3 rounded-xl border border-white/10">
                <span className="text-[#D4AF37] font-bold text-[10px] uppercase tracking-wider block mb-1">📢 Sanctuary Programming</span>
                <div className="space-y-1 pl-1">
                  <button onClick={() => { setAdminTab('bulletins'); setIsNavDrawerOpen(false); }} className={`w-full text-left px-3 py-2 rounded-lg transition-all cursor-pointer font-bold ${adminTab === 'bulletins' ? 'bg-[#D4AF37] text-[#1F140E]' : 'text-white/80 hover:bg-white/10'}`}>
                    📻 Broadcast Bulletins
                  </button>
                  <button onClick={() => { setAdminTab('polls'); setIsNavDrawerOpen(false); }} className={`w-full text-left px-3 py-2 rounded-lg transition-all cursor-pointer font-bold ${adminTab === 'polls' ? 'bg-[#D4AF37] text-[#1F140E]' : 'text-white/80 hover:bg-white/10'}`}>
                    🗳️ Ballots &amp; Polls
                  </button>
                  <button onClick={() => { setAdminTab('hearths'); setIsNavDrawerOpen(false); }} className={`w-full text-left px-3 py-2 rounded-lg transition-all cursor-pointer font-bold ${adminTab === 'hearths' || adminTab === 'podcasts' || adminTab === 'kinship_vault' ? 'bg-[#D4AF37] text-[#1F140E]' : 'text-white/80 hover:bg-white/10'}`}>
                    🔥 Hearths &amp; Podcasts
                  </button>
                </div>
              </div>

              {/* Operations & Security */}
              <div className="space-y-1 bg-emerald-950/40 p-3 rounded-xl border border-emerald-500/30">
                <span className="text-emerald-400 font-bold text-[10px] uppercase tracking-wider block mb-1">⚙️ Operations &amp; Security</span>
                <div className="space-y-1 pl-1">
                  <button onClick={() => { setAdminTab('moderation'); setIsNavDrawerOpen(false); }} className={`w-full text-left px-3 py-2 rounded-lg transition-all cursor-pointer font-bold ${adminTab === 'moderation' ? 'bg-emerald-400 text-[#1F140E]' : 'text-white/80 hover:bg-white/10'}`}>
                    🛡️ Moderation Queue
                  </button>
                  <button onClick={() => { setAdminTab('automation_hub'); setIsNavDrawerOpen(false); }} className={`w-full text-left px-3 py-2 rounded-lg transition-all cursor-pointer font-bold ${adminTab === 'automation_hub' ? 'bg-emerald-400 text-[#1F140E]' : 'text-emerald-300 hover:bg-emerald-500/20'}`}>
                    🤖 Automation Hub
                  </button>
                  <button onClick={() => { setAdminTab('aistudio_vault'); setIsNavDrawerOpen(false); }} className={`w-full text-left px-3 py-2 rounded-lg transition-all cursor-pointer font-bold ${adminTab === 'aistudio_vault' || adminTab === 'covenant_vault' ? 'bg-[#D4AF37] text-[#1F140E]' : 'text-white/80 hover:bg-white/10'}`}>
                    ⚡ Vault &amp; Covenants
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* OVERVIEW & COMMAND CENTER HOME VIEW                                       */}
      {/* ========================================================================= */}
      {adminTab === 'overview' && (
        <div className="space-y-6 animate-fade-in">
          {/* Welcome Card */}
          <div className="bg-gradient-to-r from-[#180E08] via-[#2A1D16] to-[#120A05] text-[#FAF5EE] p-6 sm:p-8 rounded-3xl border-2 border-[#D4AF37]/50 shadow-2xl relative overflow-hidden space-y-4">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest font-extrabold text-[#D4AF37] bg-[#D4AF37]/15 px-3 py-1 rounded-full border border-[#D4AF37]/30 inline-block">
                Copper Mommies Back-Office Command Center
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#FAF5EE]">
                Welcome back, Sovereign Administrator 🏛️
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 max-w-3xl leading-relaxed">
                Your sovereign community back office is organized into 5 logical domains below. Select any domain card to manage membership vetting, sponsor ads, treasury ledgers, sanctuary programming, and automated security workflows instantly.
              </p>
            </div>
          </div>

          {/* 5 Logical Domain Navigation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            
            {/* Domain 1: Membership & Lineage */}
            <div 
              onClick={() => setAdminTab('inquiries')}
              className="bg-white border-2 border-[#B87333]/30 hover:border-[#D4AF37] rounded-3xl p-6 shadow-md hover:shadow-xl transition-all cursor-pointer space-y-4 group"
            >
              <div className="flex items-center justify-between">
                <span className="p-3 bg-[#B87333]/15 text-[#B87333] rounded-2xl border border-[#B87333]/30 group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6 text-[#B87333]" />
                </span>
                <span className="text-xs font-mono font-bold text-[#B87333] bg-[#FAF5EE] px-2.5 py-1 rounded-lg border border-[#B87333]/20">
                  {applicants.length} Total Inquiries
                </span>
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-extrabold text-xl text-[#1F1813] group-hover:text-[#B87333] transition-colors">
                  1. Membership &amp; Lineage
                </h3>
                <p className="text-xs text-[#1F1813]/75 leading-relaxed">
                  Manage mother vetting applications, review sacred covenant agreements, update leadership roles, and audit member directory profiles.
                </p>
              </div>
              <div className="pt-3 border-t border-copper-penny/10 flex items-center justify-between text-xs font-mono font-bold text-[#B87333]">
                <span>Manage Lineage &amp; Roles</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Domain 2: Commerce & Sponsor Hub */}
            <div 
              onClick={() => setAdminTab('business_ads')}
              className="bg-white border-2 border-[#B87333]/30 hover:border-[#D4AF37] rounded-3xl p-6 shadow-md hover:shadow-xl transition-all cursor-pointer space-y-4 group"
            >
              <div className="flex items-center justify-between">
                <span className="p-3 bg-[#D4AF37]/15 text-[#B87333] rounded-2xl border border-[#D4AF37]/30 group-hover:scale-110 transition-transform">
                  <Building2 className="w-6 h-6 text-[#D4AF37]" />
                </span>
                <span className="text-xs font-mono font-bold text-[#D4AF37] bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                  {businessAds.length} Sponsor Ads
                </span>
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-extrabold text-xl text-[#1F1813] group-hover:text-[#B87333] transition-colors">
                  2. Commerce &amp; Sponsor Hub
                </h3>
                <p className="text-xs text-[#1F1813]/75 leading-relaxed">
                  Approve sister business ad submissions, manage 1-click sponsor spotlight banner rotations, and curate apothecary &amp; care pod ventures.
                </p>
              </div>
              <div className="pt-3 border-t border-copper-penny/10 flex items-center justify-between text-xs font-mono font-bold text-[#B87333]">
                <span>Manage Commerce &amp; Ads</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Domain 3: Treasury & Resource Exchange */}
            <div 
              onClick={() => setAdminTab('treasury')}
              className="bg-white border-2 border-[#B87333]/30 hover:border-[#D4AF37] rounded-3xl p-6 shadow-md hover:shadow-xl transition-all cursor-pointer space-y-4 group"
            >
              <div className="flex items-center justify-between">
                <span className="p-3 bg-emerald-500/15 text-emerald-700 rounded-2xl border border-emerald-500/30 group-hover:scale-110 transition-transform">
                  <Coins className="w-6 h-6 text-emerald-700" />
                </span>
                <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  {totalBarterPoints} Points
                </span>
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-extrabold text-xl text-[#1F1813] group-hover:text-[#B87333] transition-colors">
                  3. Treasury &amp; Exchange
                </h3>
                <p className="text-xs text-[#1F1813]/75 leading-relaxed">
                  Monitor time-credit ledgers, arbitrate cooperative trade disputes, adjust member hours, and draw random scholarship giveaway winners.
                </p>
              </div>
              <div className="pt-3 border-t border-copper-penny/10 flex items-center justify-between text-xs font-mono font-bold text-[#B87333]">
                <span>Manage Treasury &amp; Trades</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Domain 4: Sanctuary Programming */}
            <div 
              onClick={() => setAdminTab('bulletins')}
              className="bg-white border-2 border-[#B87333]/30 hover:border-[#D4AF37] rounded-3xl p-6 shadow-md hover:shadow-xl transition-all cursor-pointer space-y-4 group"
            >
              <div className="flex items-center justify-between">
                <span className="p-3 bg-[#1F1813]/10 text-[#1F1813] rounded-2xl border border-[#1F1813]/20 group-hover:scale-110 transition-transform">
                  <Radio className="w-6 h-6 text-[#1F1813]" />
                </span>
                <span className="text-xs font-mono font-bold text-[#1F1813] bg-stone-100 px-2.5 py-1 rounded-lg border border-stone-200">
                  Broadcasts &amp; Polls
                </span>
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-extrabold text-xl text-[#1F1813] group-hover:text-[#B87333] transition-colors">
                  4. Sanctuary Programming
                </h3>
                <p className="text-xs text-[#1F1813]/75 leading-relaxed">
                  Publish global broadcast push bulletins, create community voting ballots, schedule live hearth gatherings, and upload audio podcasts.
                </p>
              </div>
              <div className="pt-3 border-t border-copper-penny/10 flex items-center justify-between text-xs font-mono font-bold text-[#B87333]">
                <span>Manage Programming</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Domain 5: Moderation & Sovereign Operations */}
            <div 
              onClick={() => setAdminTab('moderation')}
              className="bg-white border-2 border-[#B87333]/30 hover:border-[#D4AF37] rounded-3xl p-6 shadow-md hover:shadow-xl transition-all cursor-pointer space-y-4 group"
            >
              <div className="flex items-center justify-between">
                <span className="p-3 bg-amber-500/15 text-amber-800 rounded-2xl border border-amber-500/30 group-hover:scale-110 transition-transform">
                  <Cpu className="w-6 h-6 text-amber-800" />
                </span>
                <span className="text-xs font-mono font-bold text-amber-900 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                  Automation Hub
                </span>
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-extrabold text-xl text-[#1F1813] group-hover:text-[#B87333] transition-colors">
                  5. Moderation &amp; Operations
                </h3>
                <p className="text-xs text-[#1F1813]/75 leading-relaxed">
                  Review Grandmother Council flagged posts, manage autonomous workflow pipelines, run database backups, and access AI Studio vaults.
                </p>
              </div>
              <div className="pt-3 border-t border-copper-penny/10 flex items-center justify-between text-xs font-mono font-bold text-[#B87333]">
                <span>Manage Security &amp; Workflows</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: LINEAGE INQUIRIES & ROLE ARBITRATOR                                */}
      {/* ========================================================================= */}
      {adminTab === 'inquiries' && (
        <div className="space-y-6 animate-fade-in">
          {/* Real-time Verified Member Login Activity & Engagement Pulse Card */}
          <AdminRecentLoginsCard />

          {/* 50-State Sovereignty Network Card */}
          <div className="bg-gradient-to-br from-[#1F1813] to-[#2D221A] text-[#FAF5EE] border border-copper-penny/25 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-copper-penny/20 pb-3">
              <div>
                <h3 className="font-serif font-extrabold text-lg text-[#FAF5EE] flex items-center space-x-2">
                  <Globe className="w-5 h-5 text-[#B87333]" />
                  <span>50-State Autonomous Sanctuary Rings</span>
                </h3>
                <p className="text-xs text-[#FAF5EE]/70 font-mono mt-0.5">
                  Decentralized state pods anchored by vetted mothers and local spearheads.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full font-bold uppercase">
                  50 States Covered
                </span>
              </div>
            </div>

            {/* Popular / Active States Badge Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 pt-2">
              {popularStates.map((st) => {
                const hasApprovedAppAsSpearhead = applicants.some(
                  a => getApplicantStateCode(a) === st.code && a.isStateSpearhead && a.status === 'approved'
                );
                const isSelected = selectedStateFilter === st.code;
                const statusLabel = hasApprovedAppAsSpearhead ? 'active' : st.status;

                return (
                  <div
                    key={st.code}
                    onClick={() => setSelectedStateFilter(isSelected ? 'ALL' : st.code)}
                    className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected 
                        ? 'border-[#D4AF37] bg-[#D4AF37]/20 shadow-md ring-2 ring-[#D4AF37]' 
                        : 'border-copper-penny/20 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-extrabold text-sm text-[#FAF5EE]">{st.code}</span>
                      <span className="text-[10px] text-[#FAF5EE]/60 font-serif">{st.name}</span>
                    </div>
                    <span className="text-[8px] block truncate font-sans font-medium uppercase tracking-wider mt-1">
                      {statusLabel === 'active' ? '🟢 Active' : statusLabel === 'pending_approval' ? '🟡 In Review' : '⚪ Open'}
                    </span>
                    <span className="text-[9px] block text-soft-sage font-mono truncate max-w-full">
                      {hasApprovedAppAsSpearhead 
                        ? applicants.find(a => getApplicantStateCode(a) === st.code && a.isStateSpearhead && a.status === 'approved')?.name 
                        : st.activeSpearhead || 'Awaiting Chapter Lead'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Filters and Search Bar */}
          <div className="bg-white border border-copper-penny/15 rounded-3xl p-4 sm:p-5 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-[#B87333]" />
                <span className="text-xs font-bold font-mono text-[#1F1813]">Circle:</span>
                <select
                  value={selectedStateFilter}
                  onChange={(e) => setSelectedStateFilter(e.target.value)}
                  className="bg-[#FAF5EE] border border-copper-penny/20 rounded-xl px-3 py-1.5 text-xs text-[#1F1813] font-mono focus:outline-none focus:border-copper-penny cursor-pointer"
                >
                  <option value="ALL">All US States (50 States)</option>
                  <option value="GA">Georgia (GA)</option>
                  <option value="TX">Texas (TX)</option>
                  <option value="MD">Maryland (MD)</option>
                  <option value="VA">Virginia (VA)</option>
                  <option value="AL">Alabama (AL)</option>
                  <option value="SC">South Carolina (SC)</option>
                  <option value="CA">California (CA)</option>
                  <option value="FL">Florida (FL)</option>
                </select>
              </div>

              {/* Status Filter Pills */}
              <div className="flex items-center space-x-1.5 overflow-x-auto py-0.5">
                <button
                  type="button"
                  onClick={() => setStatusFilter('ALL')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                    statusFilter === 'ALL'
                      ? 'bg-[#1F1813] text-[#FAF5EE] shadow-sm'
                      : 'bg-[#FAF5EE] text-[#1F1813]/70 hover:bg-[#FAF5EE]/80 border border-copper-penny/15'
                  }`}
                >
                  All ({applicants.length})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('pending')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                    statusFilter === 'pending'
                      ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-400'
                      : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-300/50'
                  }`}
                >
                  <span>Pending</span>
                  <span className="bg-amber-900/20 text-[10px] px-1.5 py-0.2 rounded-full font-extrabold">
                    {pendingApplications.length}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('approved')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                    statusFilter === 'approved'
                      ? 'bg-emerald-700 text-white shadow-sm ring-2 ring-emerald-400'
                      : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300/50'
                  }`}
                >
                  <span>Approved</span>
                  <span className="bg-emerald-900/20 text-[10px] px-1.5 py-0.2 rounded-full font-extrabold">
                    {approvedMothers.length}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('denied')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                    statusFilter === 'denied'
                      ? 'bg-red-700 text-white shadow-sm ring-2 ring-red-400'
                      : 'bg-red-50 text-red-800 hover:bg-red-100 border border-red-300/50'
                  }`}
                >
                  Denied ({deniedApplications.length})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('disqualified')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                    statusFilter === 'disqualified'
                      ? 'bg-slate-700 text-white shadow-sm ring-2 ring-slate-400'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
                  }`}
                >
                  <span>Disqualified</span>
                  <span className="bg-slate-900/20 text-[10px] px-1.5 py-0.2 rounded-full font-extrabold">
                    {disqualifiedApplications.length}
                  </span>
                </button>
              </div>
            </div>

            <div className="relative w-full lg:w-72">
              <Search className="w-4 h-4 text-soft-sage absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search sister by name, county, words..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#FAF5EE]/50 border border-copper-penny/20 focus:border-copper-penny rounded-xl pl-10 pr-4 py-1.5 text-xs text-[#1F1813] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-copper-penny"
              />
            </div>
          </div>

          {/* Lineage Review Cards */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-xl text-[#1F1813] flex items-center space-x-2">
                <span>Lineage Inquiries &amp; Role Arbitrator</span>
                <span className="text-xs text-[#B87333] font-mono font-bold bg-[#FAF5EE] px-2.5 py-0.5 rounded-full border border-copper-penny/20">
                  ({filteredApplicants.length} Inquiries)
                </span>
              </h3>
            </div>

            {filteredApplicants.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-copper-penny/20 rounded-3xl bg-[#FAF5EE]/30 text-xs text-soft-sage">
                No sister inquiries match your selected state filter or search query.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {filteredApplicants.map((app) => {
                  const stateCode = getApplicantStateCode(app);
                  const inviteUrl = app.invitationLink || `https://coppermommies.co/sanctuary/invite/${stateCode}-${app.id.replace('app-', '')}`;

                  return (
                    <div 
                      key={app.id} 
                      className={`bg-white rounded-3xl border transition-all p-6 shadow-sm space-y-4 ${
                        app.status === 'approved' 
                          ? 'border-emerald-300 ring-1 ring-emerald-100' 
                          : app.status === 'denied' 
                          ? 'border-red-200 bg-red-50/10' 
                          : app.status === 'disqualified'
                          ? 'border-slate-300 bg-slate-50/60'
                          : 'border-copper-penny/20'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-copper-penny/10 pb-4">
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-serif font-extrabold text-lg text-[#1F1813]">{app.name}</h4>
                            <span className="text-[10px] font-mono font-bold uppercase bg-[#FAF5EE] text-[#B87333] px-2.5 py-0.5 rounded-full border border-copper-penny/20">
                              {stateCode} Circle
                            </span>
                            {app.isStateSpearhead && (
                              <span className="text-[10px] font-mono font-extrabold uppercase bg-[#D4AF37]/20 text-[#96551d] px-2.5 py-0.5 rounded-full border border-[#D4AF37]/50 flex items-center space-x-1">
                                <span>👑 State Spearhead</span>
                              </span>
                            )}
                            {app.wantsToBeStateLead && (
                              <span className="text-[10px] font-mono font-extrabold uppercase bg-[#B87333]/15 text-[#B87333] px-2.5 py-0.5 rounded-full border border-copper-penny/30 flex items-center space-x-1">
                                <Award className="w-3 h-3 text-[#D4AF37]" />
                                <span>⭐ State Lead Volunteer</span>
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-soft-sage font-mono mt-0.5">
                            {app.email} • {app.currentLocation || 'American Born'} • {app.childrenAndAges || 'Mother of Children'}
                          </p>
                        </div>

                        {/* Status & 1-Click Role Arbitrator */}
                        <div className="flex items-center flex-wrap gap-2">
                          <span className={`text-[10px] font-mono uppercase font-extrabold px-3 py-1 rounded-full border ${
                            app.status === 'approved' 
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                              : app.status === 'denied' 
                              ? 'bg-red-100 text-red-800 border-red-300' 
                              : app.status === 'disqualified'
                              ? 'bg-slate-200 text-slate-800 border-slate-300'
                              : 'bg-amber-100 text-amber-800 border-amber-300'
                          }`}>
                            {app.status === 'approved' 
                              ? '✓ Verified Sanctuary Member' 
                              : app.status === 'denied' 
                              ? '✕ Denied Entry' 
                              : app.status === 'disqualified'
                              ? '⛔ Disqualified (Knock-Out Triggered)'
                              : '⏳ Pending Vetting'}
                          </span>

                          {app.status === 'pending' && (
                            <>
                              <button
                                onClick={() => onApprove(app.id)}
                                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-[11px] font-bold uppercase rounded-xl transition-all shadow-xs cursor-pointer active:scale-95 flex items-center space-x-1"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Approve Sister</span>
                              </button>
                              <button
                                onClick={() => onDeny(app.id)}
                                className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 font-mono text-[11px] font-bold uppercase rounded-xl transition-all border border-red-300 cursor-pointer active:scale-95 flex items-center space-x-1"
                              >
                                <X className="w-3.5 h-3.5" />
                                <span>Deny</span>
                              </button>
                            </>
                          )}

                          {app.status === 'approved' && !app.isStateSpearhead && (
                            <button
                              onClick={() => onApproveSpearhead(app.id)}
                              className="px-3 py-1.5 bg-[#FAF5EE] hover:bg-[#D4AF37]/20 text-[#B87333] border border-copper-penny/30 font-mono text-[11px] font-bold uppercase rounded-xl transition-all cursor-pointer flex items-center space-x-1"
                              title="Assign sister as local State Chapter Lead"
                            >
                              <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
                              <span>Assign Spearhead</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Lineage & Statement Body */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="p-3.5 bg-[#FAF5EE]/60 rounded-2xl border border-copper-penny/10 space-y-1.5">
                          <span className="font-mono text-[9px] uppercase tracking-wider text-soft-sage font-extrabold">Maternal Lineage &amp; Roots</span>
                          <p className="text-xs text-[#1F1813] font-medium leading-relaxed">
                            {app.maternalGeography || app.lineageLocation || 'Roots documented in historical Southern state registers.'}
                          </p>
                          {app.grandmotherBirthplace && (
                            <p className="text-[10px] text-[#2A221B]/80 font-mono">
                              Grandmother: {app.grandmotherBirthplace}
                            </p>
                          )}
                        </div>

                        <div className="p-3.5 bg-[#FAF5EE]/60 rounded-2xl border border-copper-penny/10 space-y-2">
                          <span className="font-mono text-[9px] uppercase tracking-wider text-soft-sage font-extrabold block">
                            Sisterhood Intent, Gifting &amp; Trade Contribution
                          </span>
                          <p className="text-xs text-[#1F1813] font-medium leading-relaxed">
                            "{app.connectionStatement || app.barterContribution || 'Committed to mutual aid, herbal wisdom, and cooperative schooling.'}"
                          </p>

                          {/* Community Contribution Badges */}
                          {app.communityContributionTypes && app.communityContributionTypes.length > 0 && (
                            <div className="pt-2 border-t border-copper-penny/10 space-y-1">
                              <span className="text-[9px] font-mono uppercase font-bold text-gray-500 block">
                                Planned Contributions to the Village:
                              </span>
                              <div className="flex flex-wrap gap-1">
                                {app.communityContributionTypes.map((c, i) => (
                                  <span key={i} className="px-2 py-0.5 rounded-md bg-white border border-[#D4AF37]/30 text-[9px] font-mono text-[#1F1813]">
                                    &bull; {c}
                                  </span>
                                ))}
                              </div>
                              {app.communityContributionDetails && (
                                <p className="text-[10px] text-gray-700 italic pt-0.5">
                                  "{app.communityContributionDetails}"
                                </p>
                              )}
                            </div>
                          )}

                          {/* Comprehensive Chapter Lead Vetting Section */}
                          {app.wantsToBeStateLead && (
                            <div className="mt-2.5 p-2.5 bg-amber-50/90 rounded-xl border border-[#D4AF37]/40 text-[11px] text-[#1F1813] font-sans space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="font-mono text-[9px] uppercase font-bold text-[#B87333] flex items-center space-x-1">
                                  <Award className="w-3 h-3 text-[#D4AF37]" />
                                  <span>State Lead Vetting Evaluation:</span>
                                </span>
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold ${
                                  app.stateLeadStatus === 'certified_candidate'
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                                }`}>
                                  {app.stateLeadStatus === 'certified_candidate' ? '🌟 Certified Candidate' : '🕊️ Lead On Hold'}
                                </span>
                              </div>

                              {app.stateLeadGroundSupport && (
                                <div className="text-[10px]">
                                  <strong className="text-gray-700">Ground Support &amp; Local Spots:</strong>
                                  <p className="text-gray-900 leading-tight mt-0.5">{app.stateLeadGroundSupport}</p>
                                </div>
                              )}

                              {app.stateLeadExperience && (
                                <div className="text-[10px]">
                                  <strong className="text-gray-700">Coordination Experience:</strong>
                                  <p className="text-gray-900 leading-tight mt-0.5">{app.stateLeadExperience}</p>
                                </div>
                              )}

                              {app.stateLeadPeopleManagement && (
                                <div className="text-[10px]">
                                  <strong className="text-gray-700">People Management / Teams:</strong>
                                  <p className="text-gray-900 leading-tight mt-0.5">{app.stateLeadPeopleManagement}</p>
                                </div>
                              )}

                              {app.stateLeadConflictApproach && (
                                <div className="text-[10px]">
                                  <strong className="text-gray-700">Approach to Peace in Circle:</strong>
                                  <p className="italic text-gray-800 mt-0.5">"{app.stateLeadConflictApproach}"</p>
                                </div>
                              )}

                              {app.stateLeadWhy && (
                                <div className="text-[10px] pt-1 border-t border-amber-200">
                                  <strong className="text-gray-700">Calling to Lead:</strong>
                                  <p className="italic text-gray-800 mt-0.5">"{app.stateLeadWhy}"</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Disqualification / Knock-Out Banner */}
                      {app.disqualificationReason && (
                        <div className="p-3 bg-red-50/80 rounded-2xl border border-red-200 text-xs text-red-900 font-mono flex items-center space-x-2">
                          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                          <span><strong>Automatic Sifting Gate Halt:</strong> {app.disqualificationReason}</span>
                        </div>
                      )}

                      {/* Invite Link copy bar */}
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 p-3 bg-white rounded-2xl border border-copper-penny/15 text-xs font-mono">
                        <div className="flex items-center space-x-2 truncate">
                          <Key className="w-4 h-4 text-[#B87333] shrink-0" />
                          <span className="text-soft-sage text-[10px] uppercase font-bold">Secure Sanctuary Link:</span>
                          <span className="text-[#1F1813] truncate font-bold text-[11px]">{inviteUrl}</span>
                        </div>
                        <button
                          onClick={() => handleCopyLink(app.id, inviteUrl)}
                          className="px-3 py-1 bg-[#B87333] hover:bg-[#A85138] text-white rounded-lg text-[10px] font-bold uppercase transition-all shrink-0 cursor-pointer active:scale-95"
                        >
                          {copiedAppId === app.id ? '✓ Copied to Clipboard' : 'Copy Invite URL'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: SINGLE MELANATED WOMEN-OWNED BUSINESS ADS & SPONSORS MANAGER        */}
      {/* ========================================================================= */}
      {adminTab === 'business_ads' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Header Summary Banner */}
          <div className="bg-gradient-to-r from-[#1F140E] via-[#2A1D16] to-[#140F0B] text-[#FAF5EE] rounded-3xl p-6 border-2 border-[#D4AF37]/50 shadow-xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center space-x-2 text-[#D4AF37] mb-1">
                  <Building2 className="w-5 h-5 text-[#D4AF37]" />
                  <span className="font-mono text-xs uppercase font-bold tracking-wider">
                    Sister Business Commercial Partner Desk
                  </span>
                </div>
                <h3 className="font-serif text-2xl font-black text-white">
                  Melanated Women-Owned Business Ads
                </h3>
                <p className="text-xs text-white/80 max-w-2xl mt-0.5">
                  Review ad submissions, verify single melanated woman-ownership, test discount codes, and 1-click approve banners into the live Top Header and Village Commons Sidebar.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <span className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold px-3 py-1.5 rounded-xl">
                  {businessAds.filter(a => a.status === 'approved_live').length} Active Live
                </span>
                <span className="bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold px-3 py-1.5 rounded-xl">
                  {businessAds.filter(a => a.status === 'pending_review').length} In Review
                </span>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <span className="text-[10px] text-gray-400 block uppercase">Total Submissions</span>
                <strong className="text-lg text-white font-serif">{businessAds.length}</strong>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <span className="text-[10px] text-gray-400 block uppercase">Pioneer $0 Passes</span>
                <strong className="text-lg text-emerald-400 font-serif">
                  {businessAds.filter(a => a.pricingTier === 'pioneer_free').length}
                </strong>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <span className="text-[10px] text-gray-400 block uppercase">Header Placements</span>
                <strong className="text-lg text-[#D4AF37] font-serif">
                  {businessAds.filter(a => a.placementType === 'header_banner' || a.placementType === 'both_bundle').length}
                </strong>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <span className="text-[10px] text-gray-400 block uppercase">Sidebar Placements</span>
                <strong className="text-lg text-[#D4AF37] font-serif">
                  {businessAds.filter(a => a.placementType === 'commons_sidebar' || a.placementType === 'both_bundle').length}
                </strong>
              </div>
            </div>
          </div>

          {/* Business Ads List */}
          <div className="space-y-4">
            {businessAds.map((ad) => {
              const isApproved = ad.status === 'approved_live';
              const isRejected = ad.status === 'rejected';

              return (
                <div 
                  key={ad.id}
                  className={`bg-white rounded-3xl border transition-all p-6 shadow-sm space-y-4 ${
                    isApproved 
                      ? 'border-emerald-300 ring-1 ring-emerald-100' 
                      : isRejected 
                      ? 'border-red-200 bg-red-50/10 opacity-70' 
                      : 'border-[#D4AF37]/50 shadow-md'
                  }`}
                >
                  {/* Top Bar of Card */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-serif font-black text-lg text-[#1F1813]">{ad.businessName}</h4>
                        <span className="text-[10px] font-mono font-bold uppercase bg-[#FAF5EE] text-[#B87333] px-2.5 py-0.5 rounded-full border border-copper-penny/20">
                          {ad.pricingAmount}
                        </span>
                        <span className="text-[10px] font-mono font-bold uppercase bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full">
                          {ad.placementType === 'both_bundle' ? 'Header + Sidebar' : ad.placementType === 'header_banner' ? 'Header Banner' : 'Commons Sidebar'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 font-mono mt-0.5">
                        Owner: <strong className="text-[#1F1813]">{ad.ownerName}</strong> &bull; {ad.email} {ad.phone ? `&bull; ${ad.phone}` : ''} {ad.socialHandle ? `&bull; ${ad.socialHandle}` : ''}
                      </p>
                    </div>

                    {/* Status & Actions */}
                    <div className="flex items-center space-x-2 shrink-0">
                      <span className={`text-[10px] font-mono font-bold uppercase px-3 py-1 rounded-full border ${
                        isApproved 
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                          : isRejected 
                          ? 'bg-red-100 text-red-800 border-red-300' 
                          : 'bg-amber-100 text-amber-800 border-amber-300 animate-pulse'
                      }`}>
                        {isApproved ? '✓ Live in Community' : isRejected ? '✕ Declined' : '⏳ Pending Review'}
                      </span>

                      {!isApproved && (
                        <button
                          type="button"
                          onClick={() => {
                            const targetAd = businessAds.find(a => a.id === ad.id);
                            if (!targetAd) return;
                            const updated = businessAds.map(a => a.id === ad.id ? { ...a, status: 'approved_live' as const, approvedAt: 'Just now' } : a);
                            setBusinessAds(updated);
                            try {
                              localStorage.setItem('copper_business_ad_submissions', JSON.stringify(updated));
                              window.dispatchEvent(new Event('copper_ads_updated'));
                            } catch (e) {}

                            // If header placement, push to spotlights
                            if (targetAd.placementType === 'header_banner' || targetAd.placementType === 'both_bundle') {
                              const newSpotlight: PageSpotlightBanner = {
                                id: `spotlight-ad-${targetAd.id}`,
                                pageId: 'all',
                                categoryBadge: 'Verified Sister Business Partner',
                                title: targetAd.headline,
                                subtitle: targetAd.tagline || targetAd.businessName,
                                description: targetAd.description,
                                bannerImage: targetAd.bannerImageUrl,
                                externalLink: targetAd.websiteUrl,
                                buttonText: targetAd.callToActionText || 'Visit Shop',
                                promoCode: targetAd.exclusiveDiscountCode,
                                promoPrice: targetAd.discountOfferText,
                                active: true
                              };
                              if (onAddSpotlight) {
                                onAddSpotlight(newSpotlight);
                              }
                            }
                            alert(`Business Ad for "${targetAd.businessName}" is now Approved and Live in the community!`);
                          }}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-[11px] font-bold uppercase rounded-xl transition-all shadow-xs cursor-pointer flex items-center space-x-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve &amp; Push Live</span>
                        </button>
                      )}

                      {!isRejected && !isApproved && (
                        <button
                          type="button"
                          onClick={() => {
                            const note = prompt('Enter a brief decline / revision note for the applicant:', 'Please provide higher resolution creative and confirm store availability.');
                            if (note === null) return;
                            const updated = businessAds.map(a => a.id === ad.id ? { ...a, status: 'rejected' as const, rejectionNote: note } : a);
                            setBusinessAds(updated);
                            try {
                              localStorage.setItem('copper_business_ad_submissions', JSON.stringify(updated));
                              window.dispatchEvent(new Event('copper_ads_updated'));
                            } catch (e) {}
                            alert('Application marked as declined.');
                          }}
                          className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-mono text-[11px] font-bold uppercase rounded-xl transition-all cursor-pointer flex items-center space-x-1"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Decline</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Creative Preview Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                    
                    {/* Visual Media Preview (4 Cols) */}
                    <div className="md:col-span-4 space-y-2">
                      <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-inner">
                        <img 
                          src={ad.bannerImageUrl} 
                          alt={ad.businessName} 
                          className="w-full h-full object-cover" 
                        />
                        <span className="absolute top-2 left-2 bg-[#1F140E]/85 text-[#D4AF37] text-[8px] font-mono font-bold px-2 py-0.5 rounded-md">
                          {ad.targetCategory || 'Sister Business'}
                        </span>
                      </div>
                      <a
                        href={ad.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-[#B87333] hover:underline font-mono font-bold flex items-center space-x-1"
                      >
                        <span>Visit Site: {ad.websiteUrl}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    {/* Copy & Offer Details (8 Cols) */}
                    <div className="md:col-span-8 space-y-2.5">
                      <div>
                        <h5 className="font-serif font-bold text-sm text-[#1F1813]">{ad.headline}</h5>
                        {ad.tagline && <p className="text-xs text-[#B87333] font-medium mt-0.5">{ad.tagline}</p>}
                        <p className="text-xs text-gray-700 leading-relaxed font-sans mt-1">
                          {ad.description}
                        </p>
                      </div>

                      {/* Exclusive Discount Box */}
                      <div className="p-3 bg-amber-50 rounded-xl border border-[#D4AF37]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <span className="text-[9px] uppercase font-mono text-gray-500 font-bold block">
                            Exclusive Member Promo Offer:
                          </span>
                          <span className="text-xs text-[#1F1813] font-medium font-sans">
                            {ad.discountOfferText}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="px-2.5 py-1 bg-white border border-[#D4AF37]/50 rounded-lg font-mono font-bold text-xs text-[#B87333] shadow-2xs">
                            Code: {ad.exclusiveDiscountCode}
                          </span>
                        </div>
                      </div>

                      {/* Verification confirmation */}
                      <div className="text-[10px] text-gray-500 font-mono flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Applicant confirmed: Single Melanated Woman-Owned Business &bull; Submitted {ad.submittedAt}</span>
                      </div>

                      {ad.rejectionNote && (
                        <div className="p-2.5 bg-red-50 rounded-xl border border-red-200 text-xs text-red-800 font-mono">
                          <strong>Admin Feedback Note:</strong> {ad.rejectionNote}
                        </div>
                      )}
                    </div>

                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: 1-CLICK VENDOR SPOTLIGHT MANAGER                                   */}
      {/* ========================================================================= */}
      {adminTab === 'spotlights' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Top Spotlight Controls */}
          <div className="bg-white border border-copper-penny/15 rounded-3xl p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center flex-wrap gap-2">
              <span className="text-xs font-mono font-bold uppercase text-[#1F1813] flex items-center space-x-1.5">
                <Sliders className="w-4 h-4 text-[#B87333]" />
                <span>Filter by Hub:</span>
              </span>

              {['all', 'village', 'healing', 'economy', 'commerce', 'gathering', 'kinship'].map((hub) => (
                <button
                  key={hub}
                  onClick={() => setSpotlightHubFilter(hub)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono uppercase font-bold transition-all cursor-pointer ${
                    spotlightHubFilter === hub 
                      ? 'bg-[#B87333] text-white shadow-xs' 
                      : 'bg-[#FAF5EE] text-[#1F1813] hover:bg-amber-100 border border-copper-penny/15'
                  }`}
                >
                  {hub === 'all' ? 'All Hubs' : hub}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowAddBannerModal(true)}
              className="px-4 py-2 bg-[#D4AF37] hover:bg-[#E5C158] text-[#1F140E] font-mono text-xs font-extrabold uppercase tracking-wider rounded-xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center space-x-2 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Spotlight Banner</span>
            </button>
          </div>

          {/* Spotlight Cards List with 1-Click Toggle, In-line Editor, Reorder */}
          <div className="space-y-4">
            {filteredSpotlights.map((b, index) => {
              const isEditing = editingBannerId === b.id;

              return (
                <div 
                  key={b.id} 
                  className={`bg-white rounded-3xl border transition-all p-5 shadow-sm space-y-4 ${
                    b.active ? 'border-copper-penny/30' : 'border-gray-200 opacity-60 bg-gray-50/50'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-copper-penny/10 pb-3">
                    <div className="flex items-center space-x-2.5">
                      <span className="text-[10px] font-mono font-bold uppercase px-3 py-1 rounded-full bg-[#D4AF37]/20 text-[#96551d] border border-[#D4AF37]/40">
                        {b.pageId.toUpperCase()} HUB
                      </span>
                      <span className="text-xs font-mono font-extrabold text-[#B87333]">
                        {b.categoryBadge}
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                        b.active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-700'
                      }`}>
                        {b.active ? '🟢 Live Active' : '⚪ Inactive (Draft)'}
                      </span>
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleMoveSpotlight(index, 'up')}
                        disabled={index === 0}
                        className="p-1.5 bg-[#FAF5EE] hover:bg-amber-100 disabled:opacity-30 rounded-lg text-xs cursor-pointer"
                        title="Move Banner Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleMoveSpotlight(index, 'down')}
                        disabled={index === spotlightBanners.length - 1}
                        className="p-1.5 bg-[#FAF5EE] hover:bg-amber-100 disabled:opacity-30 rounded-lg text-xs cursor-pointer"
                        title="Move Banner Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onToggleSpotlightActive && onToggleSpotlightActive(b.id)}
                        className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                          b.active ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        }`}
                      >
                        {b.active ? 'Toggle Off' : 'Toggle Live'}
                      </button>

                      <button
                        onClick={() => isEditing ? handleSaveEditSpotlight(b) : handleStartEditSpotlight(b)}
                        className="px-3 py-1 bg-[#1F1813] hover:bg-[#3D2517] text-white rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center space-x-1"
                      >
                        <Edit3 className="w-3 h-3 text-[#D4AF37]" />
                        <span>{isEditing ? 'Save Changes' : 'Edit Banner'}</span>
                      </button>

                      {onDeleteSpotlight && (
                        <button
                          onClick={() => {
                            if (confirm(`Delete spotlight banner "${b.title}"?`)) {
                              onDeleteSpotlight(b.id);
                            }
                          }}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                          title="Delete Banner"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Banner Content (View / Edit Mode) */}
                  {isEditing ? (
                    <div className="space-y-3 pt-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-mono uppercase font-bold text-soft-sage block mb-1">Title</label>
                          <input
                            type="text"
                            value={editFormData.title || ''}
                            onChange={(e) => setEditFormData(prev => ({ ...prev, title: e.target.value }))}
                            className="w-full bg-[#FAF5EE] border border-copper-penny/20 rounded-xl p-2 text-xs font-bold text-[#1F1813]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono uppercase font-bold text-soft-sage block mb-1">Subtitle</label>
                          <input
                            type="text"
                            value={editFormData.subtitle || ''}
                            onChange={(e) => setEditFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                            className="w-full bg-[#FAF5EE] border border-copper-penny/20 rounded-xl p-2 text-xs text-[#1F1813]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-mono uppercase font-bold text-soft-sage block mb-1">Description</label>
                        <textarea
                          rows={2}
                          value={editFormData.description || ''}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
                          className="w-full bg-[#FAF5EE] border border-copper-penny/20 rounded-xl p-2 text-xs text-[#1F1813]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="text-[10px] font-mono uppercase font-bold text-soft-sage block mb-1">External Link / URL</label>
                          <input
                            type="text"
                            value={editFormData.externalLink || ''}
                            onChange={(e) => setEditFormData(prev => ({ ...prev, externalLink: e.target.value }))}
                            className="w-full bg-[#FAF5EE] border border-copper-penny/20 rounded-xl p-2 text-xs text-[#1F1813]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono uppercase font-bold text-soft-sage block mb-1">Promo Code</label>
                          <input
                            type="text"
                            value={editFormData.promoCode || ''}
                            onChange={(e) => setEditFormData(prev => ({ ...prev, promoCode: e.target.value }))}
                            className="w-full bg-[#FAF5EE] border border-copper-penny/20 rounded-xl p-2 text-xs text-[#1F1813]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono uppercase font-bold text-soft-sage block mb-1">Promo Price / Benefit</label>
                          <input
                            type="text"
                            value={editFormData.promoPrice || ''}
                            onChange={(e) => setEditFormData(prev => ({ ...prev, promoPrice: e.target.value }))}
                            className="w-full bg-[#FAF5EE] border border-copper-penny/20 rounded-xl p-2 text-xs text-[#1F1813]"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <h4 className="font-serif font-extrabold text-base text-[#1F1813]">{b.title}</h4>
                      {b.subtitle && <p className="text-xs text-[#B87333] font-mono font-bold">{b.subtitle}</p>}
                      <p className="text-xs text-[#2A221B]/80 leading-relaxed">{b.description}</p>
                      
                      <div className="flex items-center flex-wrap gap-3 pt-2 text-xs font-mono">
                        {b.promoCode && (
                          <span className="bg-amber-50 text-[#96551d] px-2 py-0.5 rounded border border-amber-200">
                            Code: <strong>{b.promoCode}</strong>
                          </span>
                        )}
                        {b.promoPrice && (
                          <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                            Benefit: <strong>{b.promoPrice}</strong>
                          </span>
                        )}
                        {b.externalLink && (
                          <a href={b.externalLink} target="_blank" rel="noopener noreferrer" className="text-[#B87333] underline flex items-center space-x-1">
                            <span>{b.externalLink}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Modal to Add New Spotlight */}
          {showAddBannerModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
              <div className="bg-white border-2 border-[#D4AF37] rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between border-b border-copper-penny/20 pb-3">
                  <h3 className="font-serif font-extrabold text-lg text-[#1F1813] flex items-center space-x-2">
                    <Megaphone className="w-5 h-5 text-[#B87333]" />
                    <span>Create Featured Hub Spotlight Banner</span>
                  </h3>
                  <button onClick={() => setShowAddBannerModal(false)} className="text-gray-400 hover:text-gray-600 font-bold">✕</button>
                </div>

                <form onSubmit={handleCreateSpotlight} className="space-y-3.5 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-mono uppercase font-bold text-soft-sage block mb-1">Target Hub Page *</label>
                      <select
                        value={newBannerData.pageId}
                        onChange={(e) => setNewBannerData(prev => ({ ...prev, pageId: e.target.value as any }))}
                        className="w-full bg-[#FAF5EE] border border-copper-penny/20 rounded-xl p-2 font-bold"
                      >
                        <option value="village">Village Co-Care (village)</option>
                        <option value="healing">Earth &amp; Healing (healing)</option>
                        <option value="economy">Cooperative Economy (economy)</option>
                        <option value="commerce">Enterprise &amp; Commerce (commerce)</option>
                        <option value="gathering">The Copper Circle (gathering)</option>
                        <option value="kinship">Kinship Vault (kinship)</option>
                        <option value="all">Universal Banner (all hubs)</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-mono uppercase font-bold text-soft-sage block mb-1">Category Badge Text *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Featured Homeschool Partner"
                        value={newBannerData.categoryBadge}
                        onChange={(e) => setNewBannerData(prev => ({ ...prev, categoryBadge: e.target.value }))}
                        className="w-full bg-[#FAF5EE] border border-copper-penny/20 rounded-xl p-2 font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-mono uppercase font-bold text-soft-sage block mb-1">Headline Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. NestBright Academy Grade 4 Math Masterclass"
                      value={newBannerData.title}
                      onChange={(e) => setNewBannerData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full bg-[#FAF5EE] border border-copper-penny/20 rounded-xl p-2 font-bold text-sm"
                    />
                  </div>

                  <div>
                    <label className="font-mono uppercase font-bold text-soft-sage block mb-1">Subtitle / Highlight</label>
                    <input
                      type="text"
                      placeholder="e.g. 100% Free Scholarship Seats for Sovereign Mothers"
                      value={newBannerData.subtitle}
                      onChange={(e) => setNewBannerData(prev => ({ ...prev, subtitle: e.target.value }))}
                      className="w-full bg-[#FAF5EE] border border-copper-penny/20 rounded-xl p-2"
                    />
                  </div>

                  <div>
                    <label className="font-mono uppercase font-bold text-soft-sage block mb-1">Detailed Description *</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Describe the offering, partner story, or co-op benefit..."
                      value={newBannerData.description}
                      onChange={(e) => setNewBannerData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full bg-[#FAF5EE] border border-copper-penny/20 rounded-xl p-2"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="font-mono uppercase font-bold text-soft-sage block mb-1">Action Link URL</label>
                      <input
                        type="text"
                        placeholder="https://..."
                        value={newBannerData.externalLink}
                        onChange={(e) => setNewBannerData(prev => ({ ...prev, externalLink: e.target.value }))}
                        className="w-full bg-[#FAF5EE] border border-copper-penny/20 rounded-xl p-2"
                      />
                    </div>
                    <div>
                      <label className="font-mono uppercase font-bold text-soft-sage block mb-1">Promo Code</label>
                      <input
                        type="text"
                        placeholder="e.g. COPPER50"
                        value={newBannerData.promoCode}
                        onChange={(e) => setNewBannerData(prev => ({ ...prev, promoCode: e.target.value }))}
                        className="w-full bg-[#FAF5EE] border border-copper-penny/20 rounded-xl p-2"
                      />
                    </div>
                    <div>
                      <label className="font-mono uppercase font-bold text-soft-sage block mb-1">Promo Benefit</label>
                      <input
                        type="text"
                        placeholder="e.g. 50% Off / Free"
                        value={newBannerData.promoPrice}
                        onChange={(e) => setNewBannerData(prev => ({ ...prev, promoPrice: e.target.value }))}
                        className="w-full bg-[#FAF5EE] border border-copper-penny/20 rounded-xl p-2"
                      />
                    </div>
                  </div>

                  <div className="pt-3 flex items-center justify-end space-x-2 border-t border-copper-penny/10">
                    <button
                      type="button"
                      onClick={() => setShowAddBannerModal(false)}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-[#1F1813] font-mono font-bold rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#B87333] hover:bg-[#A85138] text-white font-mono font-bold uppercase rounded-xl shadow-md"
                    >
                      Publish Spotlight
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: BROADCAST BULLETIN ANNOUNCEMENT ENGINE                             */}
      {/* ========================================================================= */}
      {adminTab === 'bulletins' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white border border-copper-penny/15 rounded-3xl p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-serif font-extrabold text-xl text-[#1F1813] flex items-center space-x-2">
                <Radio className="w-5 h-5 text-[#B87333]" />
                <span>Global Push Bulletin &amp; Ticker Engine</span>
              </h3>
              <p className="text-xs text-soft-sage font-mono mt-0.5">
                Pin high-priority announcements and urgent alerts at the very top of all sisters' devices.
              </p>
            </div>

            <button
              onClick={() => setShowAddBulletinModal(true)}
              className="px-4 py-2.5 bg-[#B87333] hover:bg-[#A85138] text-white font-mono text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center space-x-2 shrink-0"
            >
              <Plus className="w-4 h-4 text-[#D4AF37]" />
              <span>Create Push Announcement</span>
            </button>
          </div>

          {/* Bulletin Push Bar Preview & Management List */}
          <div className="space-y-4">
            {activeBulletins.map((b) => (
              <div 
                key={b.id} 
                className={`bg-white rounded-3xl border transition-all p-5 shadow-sm space-y-3 ${
                  b.active ? 'border-[#D4AF37] ring-1 ring-[#D4AF37]/20' : 'border-gray-200 opacity-60'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-copper-penny/10 pb-3">
                  <div className="flex items-center space-x-2.5">
                    <span className={`text-[10px] font-mono font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                      b.urgency === 'critical' ? 'bg-rose-100 text-rose-800 border-rose-300' :
                      b.urgency === 'high' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                      'bg-emerald-100 text-emerald-800 border-emerald-300'
                    }`}>
                      {b.urgency.toUpperCase()} URGENCY
                    </span>

                    <span className="text-xs font-mono font-bold text-[#B87333]">
                      Theme: {b.colorTheme.toUpperCase()}
                    </span>

                    <span className="text-[10px] font-mono text-soft-sage">
                      Target: {b.targetHub.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleBulletin(b.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                        b.active ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {b.active ? 'Disable Broadcast' : 'Push Live'}
                    </button>

                    <button
                      onClick={() => handleDeleteBulletin(b.id)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                      title="Delete Bulletin"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="font-serif font-extrabold text-base text-[#1F1813]">{b.title}</h4>
                  <p className="text-xs text-[#2A221B]/85 leading-relaxed">{b.message}</p>
                </div>

                <div className="flex items-center justify-between pt-2 text-[11px] font-mono text-soft-sage border-t border-copper-penny/5">
                  <span>Pinned By: <strong>{b.pinnedBy}</strong> ({b.createdAt})</span>
                  {b.actionLink && (
                    <a href={b.actionLink} target="_blank" rel="noopener noreferrer" className="text-[#B87333] underline font-bold">
                      {b.actionText || 'Action Link'} →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Modal to Add Push Bulletin */}
          {showAddBulletinModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
              <div className="bg-white border-2 border-[#D4AF37] rounded-3xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between border-b border-copper-penny/20 pb-3">
                  <h3 className="font-serif font-extrabold text-lg text-[#1F1813] flex items-center space-x-2">
                    <Radio className="w-5 h-5 text-[#B87333]" />
                    <span>Create Global Push Announcement</span>
                  </h3>
                  <button onClick={() => setShowAddBulletinModal(false)} className="text-gray-400 hover:text-gray-600 font-bold">✕</button>
                </div>

                <form onSubmit={handleCreateBulletin} className="space-y-3 text-xs">
                  <div>
                    <label className="font-mono uppercase font-bold text-soft-sage block mb-1">Headline Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 🌾 Spring Land Stewardship Drive Open!"
                      value={newBulletinData.title}
                      onChange={(e) => setNewBulletinData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full bg-[#FAF5EE] border border-copper-penny/20 rounded-xl p-2 font-bold"
                    />
                  </div>

                  <div>
                    <label className="font-mono uppercase font-bold text-soft-sage block mb-1">Announcement Message *</label>
                    <textarea
                      required
                      rows={2}
                      placeholder="Enter the broadcast text displayed on the top notification bar..."
                      value={newBulletinData.message}
                      onChange={(e) => setNewBulletinData(prev => ({ ...prev, message: e.target.value }))}
                      className="w-full bg-[#FAF5EE] border border-copper-penny/20 rounded-xl p-2"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-mono uppercase font-bold text-soft-sage block mb-1">Urgency Level</label>
                      <select
                        value={newBulletinData.urgency}
                        onChange={(e) => setNewBulletinData(prev => ({ ...prev, urgency: e.target.value as any }))}
                        className="w-full bg-[#FAF5EE] border border-copper-penny/20 rounded-xl p-2 font-bold"
                      >
                        <option value="normal">Normal Bulletin</option>
                        <option value="high">High Priority</option>
                        <option value="critical">Critical SOS (Alert Bar)</option>
                        <option value="celebration">Celebration</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-mono uppercase font-bold text-soft-sage block mb-1">Color Theme</label>
                      <select
                        value={newBulletinData.colorTheme}
                        onChange={(e) => setNewBulletinData(prev => ({ ...prev, colorTheme: e.target.value as any }))}
                        className="w-full bg-[#FAF5EE] border border-copper-penny/20 rounded-xl p-2 font-bold"
                      >
                        <option value="gold">Sovereign Gold</option>
                        <option value="copper">Warm Copper</option>
                        <option value="emerald">Botanical Emerald</option>
                        <option value="rose">Priority Rose</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-mono uppercase font-bold text-soft-sage block mb-1">Button CTA Text</label>
                      <input
                        type="text"
                        placeholder="e.g. Join Live Room"
                        value={newBulletinData.actionText}
                        onChange={(e) => setNewBulletinData(prev => ({ ...prev, actionText: e.target.value }))}
                        className="w-full bg-[#FAF5EE] border border-copper-penny/20 rounded-xl p-2"
                      />
                    </div>
                    <div>
                      <label className="font-mono uppercase font-bold text-soft-sage block mb-1">Action Link URL</label>
                      <input
                        type="text"
                        placeholder="https://..."
                        value={newBulletinData.actionLink}
                        onChange={(e) => setNewBulletinData(prev => ({ ...prev, actionLink: e.target.value }))}
                        className="w-full bg-[#FAF5EE] border border-copper-penny/20 rounded-xl p-2"
                      />
                    </div>
                  </div>

                  <div className="pt-3 flex items-center justify-end space-x-2 border-t border-copper-penny/10">
                    <button
                      type="button"
                      onClick={() => setShowAddBulletinModal(false)}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-[#1F1813] font-mono font-bold rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#B87333] hover:bg-[#A85138] text-white font-mono font-bold uppercase rounded-xl shadow-md"
                    >
                      Broadcast Live
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: HEARTH POLLS & TOPIC VOTING HUB ADMIN CONSOLE                         */}
      {/* ========================================================================= */}
      {adminTab === 'polls' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Header Banner & Live Metrics */}
          <div className="bg-gradient-to-r from-[#1F140E] via-[#2D1B0E] to-[#1F140E] text-[#FAF5EE] border-2 border-[#D4AF37]/40 rounded-3xl p-6 shadow-xl space-y-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#D4AF37]/20 pb-4">
              <div>
                <div className="flex items-center space-x-2 text-[#D4AF37] mb-1">
                  <Award className="w-5 h-5 text-[#D4AF37]" />
                  <span className="text-[10px] font-mono uppercase tracking-widest font-bold">
                    Grassroots Democracy &amp; Sovereign Deliberation
                  </span>
                </div>
                <h3 className="font-serif font-extrabold text-2xl text-[#FAF5EE]">
                  Sisterhood Polls &amp; Community Topic Ballots
                </h3>
                <p className="text-xs text-[#FAF5EE]/80 mt-1 max-w-2xl leading-relaxed">
                  Empower verified sisters to shape upcoming Casual Corner Talk episodes, prioritize crowdfunded masterclasses, and vote on community initiatives directly on-platform.
                </p>
              </div>

              <div className="flex items-center space-x-3 shrink-0">
                <button
                  onClick={() => setShowAddPollModal(true)}
                  className="px-5 py-2.5 bg-[#D4AF37] hover:bg-[#E5C158] text-[#1F140E] font-mono font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center space-x-2 cursor-pointer active:scale-95"
                >
                  <Plus className="w-4 h-4 text-[#1F140E]" />
                  <span>Create New Ballot</span>
                </button>
              </div>
            </div>

            {/* Metrics Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 space-y-0.5">
                <span className="text-[10px] font-mono text-[#D4AF37] uppercase font-bold">Active Ballots</span>
                <p className="text-2xl font-serif font-black text-white">{activePolls.filter(p => p.active).length}</p>
                <span className="text-[10px] font-mono text-white/60">Open for sister votes</span>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 space-y-0.5">
                <span className="text-[10px] font-mono text-[#D4AF37] uppercase font-bold">Total Votes Cast</span>
                <p className="text-2xl font-serif font-black text-white">
                  {activePolls.reduce((sum, p) => sum + p.options.reduce((s, o) => s + o.votes, 0), 0)}
                </p>
                <span className="text-[10px] font-mono text-white/60">Across all categories</span>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 space-y-0.5">
                <span className="text-[10px] font-mono text-[#D4AF37] uppercase font-bold">Featured on Casual Corner</span>
                <p className="text-2xl font-serif font-black text-white">
                  {activePolls.filter(p => p.featuredOnCasualCorner).length}
                </p>
                <span className="text-[10px] font-mono text-white/60">Live spotlight</span>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 space-y-0.5">
                <span className="text-[10px] font-mono text-[#D4AF37] uppercase font-bold">Crowdfunded Classes</span>
                <p className="text-2xl font-serif font-black text-white">
                  {activePolls.filter(p => p.isCrowdfundedClass).length}
                </p>
                <span className="text-[10px] font-mono text-white/60">Sister-sponsored pools</span>
              </div>
            </div>
          </div>

          {/* Feedback Toasts */}
          {broadcastSuccessPollId && (
            <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl text-xs font-mono text-emerald-900 flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>📢 Ballot successfully pinned to the Global Broadcast Push Bar for all visiting members!</span>
            </div>
          )}

          {copiedPollSnippetId && (
            <div className="p-4 bg-amber-50 border-2 border-[#D4AF37] rounded-2xl text-xs font-mono text-[#1F140E] flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-[#B87333] shrink-0" />
              <span>📋 Formatted newsletter announcement snippet copied to clipboard! Paste directly into your email broadcast.</span>
            </div>
          )}

          {/* Category Filter Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-copper-penny/15 shadow-2xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono uppercase font-bold text-soft-sage mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-[#B87333]" />
                <span>Filter:</span>
              </span>
              {[
                { id: 'all', label: 'All Ballots' },
                { id: 'casual-corner', label: '🎙️ Casual Corner Topics' },
                { id: 'crowdfunded-class', label: '🌱 Crowdfunded Classes' },
                { id: 'village-governance', label: '⚖️ Village Governance' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setPollCategoryFilter(cat.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-serif font-bold transition-all cursor-pointer ${
                    pollCategoryFilter === cat.id
                      ? 'bg-[#B87333] text-white shadow-xs'
                      : 'bg-[#FAF5EE] text-[#1F1813] hover:bg-copper-penny/10'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <span className="text-[11px] font-mono text-soft-sage">
              Showing {activePolls.filter(p => pollCategoryFilter === 'all' || p.category === pollCategoryFilter).length} Ballots
            </span>
          </div>

          {/* Poll Cards Deck */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activePolls
              .filter(p => pollCategoryFilter === 'all' || p.category === pollCategoryFilter)
              .map((poll) => {
                const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);

                return (
                  <div 
                    key={poll.id}
                    className={`bg-white rounded-3xl border-2 p-6 shadow-sm space-y-5 transition-all flex flex-col justify-between ${
                      poll.active ? 'border-copper-penny/25 hover:border-copper-penny/50' : 'border-gray-200 opacity-80'
                    }`}
                  >
                    <div className="space-y-4">
                      {/* Top Badges & Meta */}
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                            poll.category === 'casual-corner'
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : poll.category === 'crowdfunded-class'
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                              : 'bg-blue-100 text-blue-900 border border-blue-300'
                          }`}>
                            {poll.category === 'casual-corner' ? '🎙️ Casual Corner' : poll.category === 'crowdfunded-class' ? '🌱 Crowdfunded Class' : '⚖️ Governance'}
                          </span>

                          {poll.featuredOnCasualCorner && (
                            <span className="px-2 py-0.5 bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#B87333] rounded-full text-[10px] font-mono font-bold">
                              ✨ Featured
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                            poll.active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {poll.active ? '● Open' : '○ Closed'}
                          </span>
                          <span className="text-[10px] font-mono text-soft-sage">Closes: {poll.closesAt}</span>
                        </div>
                      </div>

                      {/* Title & Description */}
                      <div className="space-y-1.5">
                        <h4 className="font-serif font-extrabold text-lg text-[#1F1813] leading-snug">
                          {poll.title}
                        </h4>
                        <p className="text-xs text-[#2A221B]/80 leading-relaxed">
                          {poll.description}
                        </p>
                        {poll.isCrowdfundedClass && poll.crowdfundGoal && (
                          <div className="bg-[#FAF5EE] p-2 rounded-xl border border-copper-penny/15 text-[11px] font-mono text-[#B87333] flex items-center justify-between">
                            <span>Sponsor Target: <strong>{poll.crowdfundGoal}</strong></span>
                            <span>Raised so far: <strong>{poll.crowdfundRaised || '$0'}</strong></span>
                          </div>
                        )}
                      </div>

                      {/* Live Options & Bars */}
                      <div className="space-y-2.5 pt-1">
                        <div className="flex items-center justify-between text-[11px] font-mono text-soft-sage pb-1 border-b border-copper-penny/10">
                          <span>Voting Options</span>
                          <span><strong>{totalVotes}</strong> Total Votes</span>
                        </div>

                        {poll.options.map((opt) => {
                          const percentage = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
                          return (
                            <div key={opt.id} className="space-y-1">
                              <div className="flex items-center justify-between text-xs text-[#1F1813]">
                                <span className="font-medium truncate pr-2">{opt.text}</span>
                                <span className="font-mono text-[11px] font-bold shrink-0">
                                  {opt.votes} ({percentage}%)
                                </span>
                              </div>
                              <div className="h-2 w-full bg-[#FAF5EE] rounded-full overflow-hidden border border-copper-penny/15">
                                <div 
                                  className="h-full bg-gradient-to-r from-[#B87333] to-[#D4AF37] rounded-full transition-all duration-500"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Member Suggestions if any */}
                      {poll.memberSuggestions && poll.memberSuggestions.length > 0 && (
                        <div className="bg-[#FAF5EE] p-3 rounded-2xl border border-copper-penny/15 space-y-1.5">
                          <span className="text-[10px] font-mono font-bold uppercase text-soft-sage">
                            Sister Suggestions ({poll.memberSuggestions.length})
                          </span>
                          <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
                            {poll.memberSuggestions.map((sug) => (
                              <div key={sug.id} className="text-[11px] text-[#1F1813] flex items-center justify-between">
                                <span>"{sug.suggestionText}" <strong className="text-soft-sage">({sug.submittedBy})</strong></span>
                                <span className="text-[9px] font-mono text-soft-sage">{sug.submittedAt}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Admin Action Bar */}
                    <div className="pt-4 border-t border-copper-penny/15 flex flex-wrap items-center justify-between gap-2 mt-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleBroadcastPollToPushBar(poll)}
                          className="px-3 py-1.5 bg-[#FAF5EE] hover:bg-[#B87333] hover:text-white text-[#1F1813] rounded-xl text-[10px] font-mono font-bold uppercase transition-all flex items-center space-x-1.5 border border-copper-penny/25 cursor-pointer shadow-2xs"
                          title="Broadcast across top push bar"
                        >
                          <Radio className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>Push Bar</span>
                        </button>

                        <button
                          onClick={() => handleCopyNewsletterSnippet(poll)}
                          className="px-3 py-1.5 bg-[#FAF5EE] hover:bg-[#D4AF37] hover:text-[#1F140E] text-[#1F1813] rounded-xl text-[10px] font-mono font-bold uppercase transition-all flex items-center space-x-1.5 border border-copper-penny/25 cursor-pointer shadow-2xs"
                          title="Copy rich text for newsletter send"
                        >
                          <Copy className="w-3.5 h-3.5 text-[#B87333]" />
                          <span>Newsletter</span>
                        </button>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleToggleFeatureAction(poll.id)}
                          className={`px-2.5 py-1.5 rounded-xl text-[10px] font-mono font-bold transition-all cursor-pointer border ${
                            poll.featuredOnCasualCorner
                              ? 'bg-[#D4AF37]/20 text-[#B87333] border-[#D4AF37]/50'
                              : 'bg-white text-gray-500 border-gray-200'
                          }`}
                          title="Toggle feature on Casual Corner"
                        >
                          {poll.featuredOnCasualCorner ? '★ Featured' : '☆ Unfeatured'}
                        </button>

                        <button
                          onClick={() => handleTogglePollState(poll.id)}
                          className={`px-2.5 py-1.5 rounded-xl text-[10px] font-mono font-bold transition-all cursor-pointer border ${
                            poll.active
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : 'bg-gray-100 text-gray-600 border-gray-300'
                          }`}
                        >
                          {poll.active ? 'Active' : 'Closed'}
                        </button>

                        <button
                          onClick={() => handleDeletePollAction(poll.id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                          title="Delete poll"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Add Poll Modal */}
          {showAddPollModal && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border-2 border-[#D4AF37]/40 space-y-5 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-copper-penny/15 pb-3">
                  <div className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-[#B87333]" />
                    <h4 className="font-serif font-extrabold text-lg text-[#1F1813]">Create New Sisterhood Ballot</h4>
                  </div>
                  <button
                    onClick={() => setShowAddPollModal(false)}
                    className="p-1 text-gray-400 hover:text-black rounded-lg cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleCreatePoll} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-mono uppercase font-bold text-soft-sage block mb-1">
                      Ballot Question / Topic Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Which masterclass should we host in October?"
                      value={newPollData.title}
                      onChange={(e) => setNewPollData({ ...newPollData, title: e.target.value })}
                      className="w-full bg-[#FAF5EE] border border-copper-penny/20 rounded-xl p-2.5 text-xs text-[#1F1813] font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-mono uppercase font-bold text-soft-sage block mb-1">
                        Category
                      </label>
                      <select
                        value={newPollData.category}
                        onChange={(e) => setNewPollData({ ...newPollData, category: e.target.value as any })}
                        className="w-full bg-[#FAF5EE] border border-copper-penny/20 rounded-xl p-2.5 text-xs text-[#1F1813]"
                      >
                        <option value="casual-corner">🎙️ Casual Corner Talk Topic</option>
                        <option value="crowdfunded-class">🌱 Crowdfunded Masterclass</option>
                        <option value="village-governance">⚖️ Village Governance &amp; Policy</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono uppercase font-bold text-soft-sage block mb-1">
                        Voting Closes
                      </label>
                      <input
                        type="text"
                        value={newPollData.closesAt}
                        onChange={(e) => setNewPollData({ ...newPollData, closesAt: e.target.value })}
                        placeholder="e.g. In 7 Days or Oct 15, 2026"
                        className="w-full bg-[#FAF5EE] border border-copper-penny/20 rounded-xl p-2.5 text-xs text-[#1F1813]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono uppercase font-bold text-soft-sage block mb-1">
                      Ballot Context &amp; Sister Description
                    </label>
                    <textarea
                      rows={2}
                      value={newPollData.description}
                      onChange={(e) => setNewPollData({ ...newPollData, description: e.target.value })}
                      placeholder="Explain why this topic matters and what attendees will take away..."
                      className="w-full bg-[#FAF5EE] border border-copper-penny/20 rounded-xl p-2.5 text-xs text-[#1F1813]"
                    />
                  </div>

                  {/* Dynamic Options List */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-mono uppercase font-bold text-soft-sage">
                        Voting Options (Min 2) *
                      </label>
                      <button
                        type="button"
                        onClick={() => setNewPollOptions([...newPollOptions, ''])}
                        className="text-[10px] font-mono font-bold text-[#B87333] hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Option</span>
                      </button>
                    </div>

                    {newPollOptions.map((opt, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <span className="text-[10px] font-mono text-soft-sage w-5">{idx + 1}.</span>
                        <input
                          type="text"
                          required
                          value={opt}
                          onChange={(e) => {
                            const updated = [...newPollOptions];
                            updated[idx] = e.target.value;
                            setNewPollOptions(updated);
                          }}
                          placeholder={`Option ${idx + 1}`}
                          className="flex-1 bg-[#FAF5EE] border border-copper-penny/20 rounded-xl p-2 text-xs text-[#1F1813]"
                        />
                        {newPollOptions.length > 2 && (
                          <button
                            type="button"
                            onClick={() => setNewPollOptions(newPollOptions.filter((_, i) => i !== idx))}
                            className="p-1 text-gray-400 hover:text-red-500 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Crowdfunding Toggle & Goal */}
                  <div className="p-3 bg-[#FAF5EE] rounded-2xl border border-copper-penny/15 space-y-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newPollData.isCrowdfundedClass}
                        onChange={(e) => setNewPollData({ ...newPollData, isCrowdfundedClass: e.target.checked })}
                        className="rounded text-[#B87333] focus:ring-[#B87333]"
                      />
                      <span className="text-xs font-serif font-bold text-[#1F1813]">This is a Crowdfunded Masterclass</span>
                    </label>

                    {newPollData.isCrowdfundedClass && (
                      <div className="pt-1">
                        <label className="text-[10px] font-mono uppercase text-soft-sage block mb-1">
                          Community Crowdfund Target
                        </label>
                        <input
                          type="text"
                          value={newPollData.crowdfundGoal}
                          onChange={(e) => setNewPollData({ ...newPollData, crowdfundGoal: e.target.value })}
                          placeholder="e.g. $350 community pool"
                          className="w-full bg-white border border-copper-penny/20 rounded-xl p-2 text-xs text-[#1F1813]"
                        />
                      </div>
                    )}
                  </div>

                  {/* Feature & Custom Suggestions Flags */}
                  <div className="flex flex-wrap gap-4 pt-1">
                    <label className="flex items-center space-x-2 cursor-pointer text-xs text-[#1F1813]">
                      <input
                        type="checkbox"
                        checked={newPollData.featuredOnCasualCorner}
                        onChange={(e) => setNewPollData({ ...newPollData, featuredOnCasualCorner: e.target.checked })}
                        className="rounded text-[#B87333] focus:ring-[#B87333]"
                      />
                      <span>Feature on Casual Corner Card</span>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer text-xs text-[#1F1813]">
                      <input
                        type="checkbox"
                        checked={newPollData.allowCustomSuggestions}
                        onChange={(e) => setNewPollData({ ...newPollData, allowCustomSuggestions: e.target.checked })}
                        className="rounded text-[#B87333] focus:ring-[#B87333]"
                      />
                      <span>Allow Sister Topic Submissions</span>
                    </label>
                  </div>

                  <div className="pt-3 flex items-center justify-end space-x-2 border-t border-copper-penny/10">
                    <button
                      type="button"
                      onClick={() => setShowAddPollModal(false)}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-[#1F1813] font-mono font-bold text-xs rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#D4AF37] hover:bg-[#E5C158] text-[#1F140E] font-mono font-extrabold text-xs uppercase rounded-xl shadow-md cursor-pointer"
                    >
                      Publish Ballot
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: SOVEREIGN TIME-CREDIT & BARTER DISPUTE ARBITRATOR                  */}
      {/* ========================================================================= */}
      {adminTab === 'disputes' && (
        <div className="space-y-6 animate-fade-in">
          
          {ledgerSuccessMessage && (
            <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl text-xs font-mono text-emerald-900 flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{ledgerSuccessMessage}</span>
            </div>
          )}

          {/* Grid of Two Columns: Left = Dispute Cases, Right = Manual Ledger Adjuster */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left 7 Columns: Flagged Trades & Arbitration Queue */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white border border-copper-penny/15 rounded-3xl p-5 shadow-xs">
                <h3 className="font-serif font-extrabold text-lg text-[#1F1813] flex items-center space-x-2">
                  <Scale className="w-5 h-5 text-[#B87333]" />
                  <span>Flagged Barter Trades &amp; Sisterhood Arbitration</span>
                </h3>
                <p className="text-xs text-soft-sage font-mono mt-0.5">
                  Resolve trade discrepancies, damaged remedies, or grant honorary community grant credits.
                </p>
              </div>

              <div className="space-y-4">
                {activeDisputes.map((d) => (
                  <div 
                    key={d.id}
                    className={`bg-white rounded-3xl border p-5 shadow-sm space-y-3 transition-all ${
                      d.status.includes('Resolved') ? 'border-emerald-200 bg-emerald-50/20' : 'border-amber-300 ring-1 ring-amber-100'
                    }`}
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2 border-b border-copper-penny/10 pb-2.5">
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full mr-2">
                          {d.disputeType}
                        </span>
                        <span className="text-xs font-serif font-bold text-[#1F1813]">{d.barterTitle}</span>
                      </div>
                      <span className="text-[10px] font-mono font-extrabold text-soft-sage">
                        Case: {d.id}
                      </span>
                    </div>

                    <div className="text-xs space-y-1.5">
                      <div className="flex items-center justify-between text-soft-sage font-mono text-[11px]">
                        <span>Claimant: <strong>{d.claimantName}</strong></span>
                        <span>Respondent: <strong>{d.respondentName}</strong></span>
                      </div>
                      <p className="text-[#2A221B]/85 leading-relaxed bg-[#FAF5EE] p-3 rounded-2xl border border-copper-penny/10">
                        {d.description}
                      </p>
                      {d.evidenceNotes && (
                        <p className="text-[10px] text-soft-sage font-mono">
                          Audit Trail: {d.evidenceNotes}
                        </p>
                      )}
                    </div>

                    {/* Arbitration Actions */}
                    {d.status.includes('Resolved') ? (
                      <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs font-mono text-emerald-800 flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Decision: {d.elderDecision} ({d.resolvedBy})</span>
                      </div>
                    ) : (
                      <div className="pt-2 flex items-center flex-wrap gap-2 border-t border-copper-penny/10">
                        <button
                          onClick={() => handleResolveDispute(d, 'resolve_recredit')}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-bold uppercase rounded-xl transition-all shadow-xs cursor-pointer active:scale-95 flex items-center space-x-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Recredit +{d.requestedAdjustmentHours}h with Grace</span>
                        </button>

                        <button
                          onClick={() => handleResolveDispute(d, 'dismiss')}
                          className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-mono text-xs font-bold uppercase rounded-xl cursor-pointer"
                        >
                          Dismiss Flag
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right 5 Columns: Sovereign Ledger Manual Adjuster & Honorary Grant Tool */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white border border-copper-penny/15 rounded-3xl p-5 shadow-xs space-y-4">
                <div className="flex items-center space-x-2 text-[#B87333]">
                  <Coins className="w-5 h-5" />
                  <h3 className="font-serif font-extrabold text-lg text-[#1F1813]">Sovereign Ledger Adjuster</h3>
                </div>
                <p className="text-xs text-[#2A221B]/80 leading-relaxed font-sans">
                  Manually mint or deduct verified time credits. Used for honorary grandmother honor credits or resolving offline co-op hours.
                </p>

                <form onSubmit={handleManualLedgerAdjust} className="space-y-3.5 text-xs">
                  <div>
                    <label className="font-mono uppercase font-bold text-soft-sage block mb-1">Sister Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mama Jamila (GA)"
                      value={manualSisterName}
                      onChange={(e) => setManualSisterName(e.target.value)}
                      className="w-full bg-[#FAF5EE] border border-copper-penny/20 rounded-xl p-2.5 font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-mono uppercase font-bold text-soft-sage block mb-1">Action Type</label>
                      <select
                        value={manualCreditType}
                        onChange={(e) => setManualCreditType(e.target.value as any)}
                        className="w-full bg-[#FAF5EE] border border-copper-penny/20 rounded-xl p-2 font-bold"
                      >
                        <option value="earn">Grant / Credit (+)</option>
                        <option value="spend">Debit / Adjust (-)</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-mono uppercase font-bold text-soft-sage block mb-1">Credit Hours</label>
                      <input
                        type="number"
                        step="0.5"
                        min="0.5"
                        max="20"
                        value={manualCreditAmount}
                        onChange={(e) => setManualCreditAmount(parseFloat(e.target.value) || 1)}
                        className="w-full bg-[#FAF5EE] border border-copper-penny/20 rounded-xl p-2 font-bold font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-mono uppercase font-bold text-soft-sage block mb-1">Audit Reason / Honor Memo *</label>
                    <textarea
                      required
                      rows={2}
                      placeholder="e.g. Honorary Matriarch Grant for postpartum meal delivery..."
                      value={manualReason}
                      onChange={(e) => setManualReason(e.target.value)}
                      className="w-full bg-[#FAF5EE] border border-copper-penny/20 rounded-xl p-2"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#B87333] hover:bg-[#A85138] text-white font-mono text-xs font-extrabold uppercase tracking-wider rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    ⚡ Execute Sovereign Ledger Transaction
                  </button>
                </form>
              </div>

              {/* Recent Ledger Audits Log */}
              <div className="bg-[#FAF5EE]/60 border border-copper-penny/15 rounded-3xl p-4 space-y-3">
                <div className="flex items-center space-x-2 text-soft-sage">
                  <History className="w-4 h-4 text-[#B87333]" />
                  <span className="text-xs font-mono font-bold uppercase">Recent Sovereign Audit Logs</span>
                </div>

                <div className="space-y-2">
                  {recentLedgerAudits.map((a) => (
                    <div key={a.id} className="p-2.5 bg-white rounded-xl border border-copper-penny/10 text-[11px] font-mono space-y-1">
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-[#1F1813]">{a.sister}</span>
                        <span className={a.type === 'earn' ? 'text-emerald-700' : 'text-amber-700'}>
                          {a.type === 'earn' ? '+' : '-'}{a.amount} Hours
                        </span>
                      </div>
                      <p className="text-[10px] text-soft-sage truncate">{a.reason}</p>
                      <div className="text-[8px] text-gray-400 truncate">{a.txHash} • {a.timestamp}</div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: LIVE STUDIO & HEARTH CIRCLE SCHEDULER                              */}
      {/* ========================================================================= */}
      {adminTab === 'hearths' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white border border-copper-penny/15 rounded-3xl p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-serif font-extrabold text-xl text-[#1F1813] flex items-center space-x-2">
                <Video className="w-5 h-5 text-[#B87333]" />
                <span>The Casual Corner Talk &amp; Live Studio</span>
              </h3>
              <p className="text-xs text-soft-sage font-mono mt-0.5">
                Schedule weekly live talks, new moon fire circles, and embed sovereign meeting rooms (Jitsi / Zoom).
              </p>
            </div>

            <button
              onClick={() => setShowAddHearthModal(true)}
              className="px-4 py-2.5 bg-[#B87333] hover:bg-[#A85138] text-white font-mono text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center space-x-2 shrink-0"
            >
              <Plus className="w-4 h-4 text-[#D4AF37]" />
              <span>Schedule New Circle Gathering</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {activeHearths.map((h) => (
              <div 
                key={h.id}
                className="bg-white rounded-3xl border border-copper-penny/20 p-5 shadow-sm space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono uppercase font-extrabold px-2.5 py-0.5 rounded-full border ${
                      h.status === 'Live Now' 
                        ? 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse' 
                        : 'bg-amber-100 text-amber-800 border-amber-300'
                    }`}>
                      {h.status === 'Live Now' ? '🔴 LIVE NOW' : '📅 SCHEDULED'}
                    </span>

                    <span className="text-[10px] font-mono text-soft-sage font-bold">
                      {h.rsvpsCount} RSVP'd
                    </span>
                  </div>

                  <h4 className="font-serif font-extrabold text-base text-[#1F1813] leading-snug">{h.title}</h4>
                  <p className="text-xs text-[#B87333] font-mono font-bold">{h.topic}</p>
                  <p className="text-xs text-[#2A221B]/80 line-clamp-3 leading-relaxed">{h.description}</p>
                </div>

                <div className="pt-3 border-t border-copper-penny/10 space-y-2.5 text-xs">
                  <div className="font-mono text-[11px] text-soft-sage space-y-0.5">
                    <div>Host: <strong className="text-[#1F1813]">{h.hostSister}</strong> ({h.hostRole})</div>
                    <div>When: <strong>{h.date} • {h.time}</strong></div>
                  </div>

                  <div className="flex items-center space-x-2 pt-1">
                    <button
                      onClick={() => handleToggleHearthLiveState(h.id)}
                      className={`flex-1 py-1.5 font-mono text-[11px] font-bold uppercase rounded-xl transition-all cursor-pointer ${
                        h.status === 'Live Now' 
                          ? 'bg-rose-700 text-white hover:bg-rose-800' 
                          : 'bg-emerald-600 text-white hover:bg-emerald-700'
                      }`}
                    >
                      {h.status === 'Live Now' ? 'End Live Broadcast' : '🔴 Go Live Now'}
                    </button>

                    <a
                      href={h.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-[#FAF5EE] hover:bg-amber-100 text-[#B87333] border border-copper-penny/30 font-mono text-[11px] font-bold uppercase rounded-xl transition-all"
                    >
                      Join
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Modal to Schedule Hearth Gathering */}
          {showAddHearthModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
              <div className="bg-white border-2 border-[#D4AF37] rounded-3xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between border-b border-copper-penny/20 pb-3">
                  <h3 className="font-serif font-extrabold text-lg text-[#1F1813] flex items-center space-x-2">
                    <Video className="w-5 h-5 text-[#B87333]" />
                    <span>Schedule Circle Live Gathering</span>
                  </h3>
                  <button onClick={() => setShowAddHearthModal(false)} className="text-gray-400 hover:text-gray-600 font-bold">✕</button>
                </div>

                <form onSubmit={handleCreateHearth} className="space-y-3 text-xs">
                  <div>
                    <label className="font-mono uppercase font-bold text-soft-sage block mb-1">Gathering Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. The Casual Corner Talk — Episode 15"
                      value={newHearthData.title}
                      onChange={(e) => setNewHearthData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full bg-[#FAF5EE] border border-copper-penny/20 rounded-xl p-2 font-bold"
                    />
                  </div>

                  <div>
                    <label className="font-mono uppercase font-bold text-soft-sage block mb-1">Discussion Topic *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Perineal Herbal Steam Recipes & 40-Day Village Rest"
                      value={newHearthData.topic}
                      onChange={(e) => setNewHearthData(prev => ({ ...prev, topic: e.target.value }))}
                      className="w-full bg-[#FAF5EE] border border-copper-penny/20 rounded-xl p-2 font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-mono uppercase font-bold text-soft-sage block mb-1">Host Sister</label>
                      <input
                        type="text"
                        placeholder="e.g. Mama Jamila & Doula Brenda"
                        value={newHearthData.hostSister}
                        onChange={(e) => setNewHearthData(prev => ({ ...prev, hostSister: e.target.value }))}
                        className="w-full bg-[#FAF5EE] border border-copper-penny/20 rounded-xl p-2"
                      />
                    </div>
                    <div>
                      <label className="font-mono uppercase font-bold text-soft-sage block mb-1">Date &amp; Time</label>
                      <input
                        type="text"
                        placeholder="e.g. Thursday, Sept 25 • 8:00 PM EST"
                        value={newHearthData.date}
                        onChange={(e) => setNewHearthData(prev => ({ ...prev, date: e.target.value }))}
                        className="w-full bg-[#FAF5EE] border border-copper-penny/20 rounded-xl p-2"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-mono uppercase font-bold text-soft-sage block mb-1">Embedded Meeting Link *</label>
                    <input
                      type="text"
                      required
                      placeholder="https://meet.jit.si/CopperMommiesLive"
                      value={newHearthData.meetingLink}
                      onChange={(e) => setNewHearthData(prev => ({ ...prev, meetingLink: e.target.value }))}
                      className="w-full bg-[#FAF5EE] border border-copper-penny/20 rounded-xl p-2 font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-mono uppercase font-bold text-soft-sage block mb-1">Description</label>
                    <textarea
                      rows={2}
                      placeholder="Describe what mothers will learn or experience..."
                      value={newHearthData.description}
                      onChange={(e) => setNewHearthData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full bg-[#FAF5EE] border border-copper-penny/20 rounded-xl p-2"
                    />
                  </div>

                  <div className="pt-3 flex items-center justify-end space-x-2 border-t border-copper-penny/10">
                    <button
                      type="button"
                      onClick={() => setShowAddHearthModal(false)}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-[#1F1813] font-mono font-bold rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#B87333] hover:bg-[#A85138] text-white font-mono font-bold uppercase rounded-xl shadow-md"
                    >
                      Schedule Gathering
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 7: PODCAST & AUDIO SANCTUARY EPISODE PUBLISHER                        */}
      {/* ========================================================================= */}
      {adminTab === 'podcasts' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Top Podcast Action Bar */}
          <div className="bg-gradient-to-r from-[#1F140E] to-[#2D1B0E] text-[#FAF5EE] border border-[#D4AF37]/40 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
                Podcast &amp; Fireside Radio Studio
              </span>
              <h3 className="font-serif font-extrabold text-xl text-[#FAF5EE] flex items-center space-x-2">
                <Headphones className="w-5 h-5 text-[#D4AF37]" />
                <span>Podcast Episode Publisher &amp; Formulation Attacher</span>
              </h3>
              <p className="text-xs text-[#FAF5EE]/80 max-w-xl">
                Upload weekly Casual Corner talk episodes, 5-minute herbal formulations, homeschool guides, and configure clickable timestamps with attached botanical recipes.
              </p>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              <button
                onClick={() => setShowAddPodcastModal(true)}
                className="px-5 py-2.5 bg-[#D4AF37] hover:bg-[#E5C158] text-[#1F140E] font-mono text-xs font-extrabold uppercase tracking-wider rounded-xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center space-x-2"
              >
                <Plus className="w-4 h-4 text-[#1F140E]" />
                <span>Publish New Episode</span>
              </button>
            </div>
          </div>

          {/* Published Audio Tracks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeAudioTracks.map((track) => (
              <div 
                key={track.id}
                className="bg-white rounded-3xl border border-copper-penny/20 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-copper-penny/50 transition-all"
              >
                <div className="space-y-3">
                  <div className="relative rounded-2xl overflow-hidden aspect-video border border-copper-penny/15">
                    <img 
                      src={track.coverImage || '/The Casual Corner Talk.jpeg'} 
                      alt={track.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="text-[9px] font-mono uppercase font-bold px-2.5 py-0.5 rounded-full bg-black/80 text-[#D4AF37] border border-[#D4AF37]/40">
                        {track.series}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-soft-sage">
                    <span>{track.releaseDate}</span>
                    <span>{Math.floor(track.durationSeconds / 60)} mins</span>
                  </div>

                  <h4 className="font-serif font-extrabold text-base text-[#1F1813] leading-snug">
                    {track.title}
                  </h4>

                  <p className="text-xs text-gray-600 font-sans line-clamp-2">
                    {track.description}
                  </p>

                  <div className="bg-[#FAF5EE] p-2.5 rounded-xl text-[11px] font-mono text-soft-sage space-y-1">
                    <div><strong>Host:</strong> {track.host}</div>
                    <div><strong>Timestamps:</strong> {track.timestamps?.length || 0} chapters attached</div>
                    <div><strong>Recipes:</strong> {track.referencedRemedies?.length || 0} formulations</div>
                  </div>
                </div>

                <div className="pt-3 border-t border-copper-penny/10 flex items-center justify-between">
                  <span className="text-xs font-mono text-emerald-800 font-bold">
                    🎧 {track.listenCount} listens
                  </span>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        if (onDeleteAudioTrack) {
                          onDeleteAudioTrack(track.id);
                        } else {
                          setLocalAudioTracks(prev => prev.filter(t => t.id !== track.id));
                        }
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                      title="Delete Episode"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Modal: Publish New Podcast Episode */}
          {showAddPodcastModal && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[60] flex items-center justify-center p-4">
              <div className="bg-[#FAF5EE] border-2 border-[#D4AF37] rounded-3xl p-6 sm:p-8 max-w-2xl w-full text-[#1F1813] shadow-2xl space-y-5 animate-scale-in max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-copper-penny/20 pb-3">
                  <div className="flex items-center space-x-2">
                    <Headphones className="w-5 h-5 text-[#B87333]" />
                    <h3 className="font-serif font-extrabold text-xl text-[#1F1813]">
                      Publish Podcast Episode to Sanctuary Library
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowAddPodcastModal(false)}
                    className="text-gray-500 hover:text-black p-1 rounded-full cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newPodcastData.title || !newPodcastData.description) {
                      alert('Please provide an episode title and description.');
                      return;
                    }
                    const newTrack: AudioTrack = {
                      id: `track-${Date.now()}`,
                      title: newPodcastData.title || 'The Casual Corner Talk',
                      episodeNumber: newPodcastData.episodeNumber || 15,
                      series: (newPodcastData.series as any) || 'casual-corner',
                      host: newPodcastData.host || 'Mama Jamila',
                      hostRole: newPodcastData.hostRole || 'Grandmother Council Lead',
                      durationSeconds: Number(newPodcastData.durationSeconds) || 1800,
                      audioUrl: newPodcastData.audioUrl || 'https://cdn.freesound.org/previews/568/568468_11861866-lq.mp3',
                      coverImage: newPodcastData.coverImage || '/The Casual Corner Talk.jpeg',
                      releaseDate: newPodcastData.releaseDate || 'Sept 14, 2026',
                      description: newPodcastData.description || '',
                      timestamps: newPodcastData.timestamps || [
                        { timeSeconds: 0, label: 'Opening Circle Dedication', summary: 'Grounding in ancestral peace.' },
                        { timeSeconds: 600, label: 'Traditional Herbal Wisdom', summary: 'Practical maternal steps.' }
                      ],
                      referencedRemedies: newPodcastData.referencedRemedies || [],
                      referencedNotes: ['Referenced in Casual Corner Audio Library'],
                      listenCount: 1,
                      likesCount: 1,
                      stateCode: 'GA'
                    };

                    if (onAddAudioTrack) {
                      onAddAudioTrack(newTrack);
                    } else {
                      setLocalAudioTracks(prev => [newTrack, ...prev]);
                    }
                    setShowAddPodcastModal(false);
                    alert(`🎙️ Episode "${newTrack.title}" published to Audio Sanctuary!`);
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-mono uppercase font-bold text-soft-sage block mb-1">
                        Episode Title
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Episode 15: Postpartum Bone Broths & Womb Herbs"
                        value={newPodcastData.title}
                        onChange={(e) => setNewPodcastData({ ...newPodcastData, title: e.target.value })}
                        className="w-full bg-white border border-copper-penny/20 rounded-xl p-2.5 text-xs text-[#1F1813]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono uppercase font-bold text-soft-sage block mb-1">
                        Series Category
                      </label>
                      <select
                        value={newPodcastData.series}
                        onChange={(e) => setNewPodcastData({ ...newPodcastData, series: e.target.value as any })}
                        className="w-full bg-white border border-copper-penny/20 rounded-xl p-2.5 text-xs font-mono text-[#1F1813]"
                      >
                        <option value="casual-corner">🎙️ Casual Corner Talks (Podcast)</option>
                        <option value="apothecary-snippets">🌿 Apothecary Audio Snippets (3-5m)</option>
                        <option value="homeschool">📚 Homeschool Reflections</option>
                        <option value="ancestral">🔥 Ancestral Storytelling</option>
                        <option value="live-radio">📻 24/7 Live Stream</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[10px] font-mono uppercase font-bold text-soft-sage block mb-1">
                        Host Sister Name
                      </label>
                      <input
                        type="text"
                        value={newPodcastData.host}
                        onChange={(e) => setNewPodcastData({ ...newPodcastData, host: e.target.value })}
                        className="w-full bg-white border border-copper-penny/20 rounded-xl p-2.5 text-xs text-[#1F1813]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono uppercase font-bold text-soft-sage block mb-1">
                        Host Role &amp; State
                      </label>
                      <input
                        type="text"
                        value={newPodcastData.hostRole}
                        onChange={(e) => setNewPodcastData({ ...newPodcastData, hostRole: e.target.value })}
                        className="w-full bg-white border border-copper-penny/20 rounded-xl p-2.5 text-xs text-[#1F1813]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono uppercase font-bold text-soft-sage block mb-1">
                        Duration (Seconds)
                      </label>
                      <input
                        type="number"
                        value={newPodcastData.durationSeconds}
                        onChange={(e) => setNewPodcastData({ ...newPodcastData, durationSeconds: parseInt(e.target.value) || 1800 })}
                        className="w-full bg-white border border-copper-penny/20 rounded-xl p-2.5 text-xs text-[#1F1813]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono uppercase font-bold text-soft-sage block mb-1">
                      Audio Stream / MP3 URL
                    </label>
                    <input
                      type="text"
                      value={newPodcastData.audioUrl}
                      onChange={(e) => setNewPodcastData({ ...newPodcastData, audioUrl: e.target.value })}
                      className="w-full bg-white border border-copper-penny/20 rounded-xl p-2.5 text-xs text-[#1F1813] font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono uppercase font-bold text-soft-sage block mb-1">
                      Episode Description &amp; Summary
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={newPodcastData.description}
                      onChange={(e) => setNewPodcastData({ ...newPodcastData, description: e.target.value })}
                      placeholder="Detailed synopsis of the discussion, ancestral citations, and practical instructions..."
                      className="w-full bg-white border border-copper-penny/20 rounded-xl p-2.5 text-xs text-[#1F1813]"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-copper-penny/20">
                    <button
                      type="button"
                      onClick={() => setShowAddPodcastModal(false)}
                      className="px-4 py-2 text-xs font-mono text-gray-600 hover:text-black cursor-pointer"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#D4AF37] hover:bg-[#E5C158] text-[#1F140E] font-mono text-xs font-extrabold uppercase rounded-xl shadow-md transition-all cursor-pointer"
                    >
                      Publish to Audio Sanctuary
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: NESTBRIGHT SCHOLARSHIP DRAWING TOOL                                */}
      {/* ========================================================================= */}
      {adminTab === 'scholarships' && (
        <div className="space-y-6 animate-fade-in">
          {/* Winner Draw Action Bar */}
          <div className="bg-gradient-to-r from-[#1F140E] to-[#2D1B0E] text-[#FAF5EE] border border-[#D4AF37]/40 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
                Automated Fair-Chance Selection
              </span>
              <h3 className="font-serif font-extrabold text-xl text-[#FAF5EE] flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-[#D4AF37]" />
                <span>NestBright Homeschool Scholarship Contest</span>
              </h3>
              <p className="text-xs text-[#FAF5EE]/80 max-w-xl">
                100% Free full-year curriculum access for Grade 4 melanated homeschooling families. Total {scholarshipEntries.length} verified entries.
              </p>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              <button
                onClick={handleTriggerDraw}
                className="px-5 py-2.5 bg-[#D4AF37] hover:bg-[#E5C158] text-[#1F140E] font-mono text-xs font-extrabold uppercase tracking-wider rounded-xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center space-x-2"
              >
                <Sparkles className="w-4 h-4 text-[#1F140E]" />
                <span>🎲 1-Click Draw 5 Random Winners</span>
              </button>
            </div>
          </div>

          {drawSuccessMessage && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs font-mono text-emerald-900 flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{drawSuccessMessage}</span>
            </div>
          )}

          {/* Scholarship List */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredScholarships.map((entry) => (
                <div 
                  key={entry.id}
                  className={`bg-white rounded-3xl border p-5 shadow-sm space-y-3 transition-all ${
                    entry.verifiedStatus === 'Selected Winner' ? 'border-emerald-400 bg-emerald-50/20 ring-2 ring-emerald-200' : 'border-copper-penny/15'
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-copper-penny/10 pb-2.5">
                    <div>
                      <h4 className="font-serif font-bold text-base text-[#1F1813]">{entry.motherName}</h4>
                      <p className="text-[11px] font-mono text-soft-sage">Child: {entry.childName} ({entry.childGrade}) • {entry.stateCode}</p>
                    </div>

                    <button
                      onClick={() => onSelectWinner && onSelectWinner(entry.id)}
                      className={`px-3 py-1 rounded-lg font-mono text-[10px] font-bold uppercase transition-all cursor-pointer ${
                        entry.verifiedStatus === 'Selected Winner'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-emerald-100 hover:text-emerald-800'
                      }`}
                    >
                      {entry.verifiedStatus === 'Selected Winner' ? '🏆 Winner Selected' : 'Mark as Winner'}
                    </button>
                  </div>

                  <p className="text-xs text-[#2A221B]/80 leading-relaxed bg-[#FAF5EE] p-3 rounded-2xl border border-copper-penny/10">
                    "{entry.learningGoals}"
                  </p>

                  <div className="flex items-center justify-between text-[10px] font-mono text-soft-sage">
                    <span>Ticket: <strong>{entry.ticketCode}</strong></span>
                    <span>{entry.motherEmail}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 8: TREASURY & CLASSIFIEDS BACK OFFICE (PRIVATE ADMIN CONSOLE)          */}
      {/* ========================================================================= */}
      {adminTab === 'treasury' && (
        <div className="space-y-6 animate-fade-in">
          {/* Privacy & Sovereignty Header Banner */}
          <div className="bg-gradient-to-br from-[#1F140E] via-[#2A1D16] to-[#120B07] border border-[#D4AF37]/30 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
                    🔒 Internal Admin Only • Title 26 § 508(c)(1)(a)
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 rounded-full text-[10px] font-mono">
                    Stripe Active
                  </span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#FAF5EE] mt-2">
                  Treasury &amp; Classifieds Back Office
                </h3>
                <p className="text-xs text-white/70 mt-1 max-w-2xl leading-relaxed">
                  Confidential founder command center for Mama Shantrece. Manage external vendor spotlights ($25/mo or $60/qtr), $5 &amp; $10 community classifieds, and review private internal financial inflows. This data is shielded from public and general member view.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    const id = `vend-${Date.now()}`;
                    const newVend = {
                      id,
                      businessName: 'Sacred Seeds Heirloom Nursery',
                      contactName: 'Sister Zola',
                      email: 'zola@sacredseeds.example',
                      plan: 'quarterly',
                      rate: '$60/qtr',
                      status: 'active',
                      targetHub: 'all',
                      approvedAt: 'Just now',
                      stripeStatus: 'Paid (Active • $60/qtr)'
                    };
                    setAdminVendors([newVend, ...adminVendors]);
                  }}
                  className="px-4 py-2 bg-[#D4AF37] hover:bg-[#B87333] text-[#1F140E] hover:text-white rounded-xl text-xs font-mono font-bold uppercase transition-all shadow-md cursor-pointer"
                >
                  + Add Vendor Spotlight
                </button>
              </div>
            </div>

            {/* Financial Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-6">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <p className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider">Vendor Spotlights</p>
                <div className="flex items-baseline space-x-2 mt-1">
                  <span className="text-2xl font-mono font-black text-white">$145.00</span>
                  <span className="text-[10px] text-emerald-400 font-mono">Active (1 Mo / 2 Qtr)</span>
                </div>
                <p className="text-[10px] text-white/60 mt-1">Pricing locked at $25/mo or $60/qtr</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <p className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider">Classifieds Inflows</p>
                <div className="flex items-baseline space-x-2 mt-1">
                  <span className="text-2xl font-mono font-black text-white">$20.00</span>
                  <span className="text-[10px] text-emerald-400 font-mono">3 Postings</span>
                </div>
                <p className="text-[10px] text-white/60 mt-1">$5 Job Desk / $10 Land Listings</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <p className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider">Tea Love Gifts</p>
                <div className="flex items-baseline space-x-2 mt-1">
                  <span className="text-2xl font-mono font-black text-white">$39.00</span>
                  <span className="text-[10px] text-emerald-400 font-mono">3 Cups Gifted</span>
                </div>
                <p className="text-[10px] text-white/60 mt-1">Private gifts to sustain community</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <p className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider">Sister Sovereign Hours</p>
                <div className="flex items-baseline space-x-2 mt-1">
                  <span className="text-2xl font-mono font-black text-white">412 hrs</span>
                  <span className="text-[10px] text-[#D4AF37] font-mono">Zero Fiat Barter</span>
                </div>
                <p className="text-[10px] text-white/60 mt-1">Timebank credit circulation</p>
              </div>
            </div>
          </div>

          {/* Section 1: Outside Vendor Spotlights ($25/mo or $60/qtr) */}
          <div className="bg-white rounded-3xl p-6 border border-copper-penny/20 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-copper-penny/10 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <Building2 className="w-5 h-5 text-[#B87333]" />
                  <h4 className="font-serif text-lg font-bold text-[#1F1813]">
                    Outside Vendor Spotlights (Active &amp; Pending Submissions)
                  </h4>
                </div>
                <p className="text-xs text-[#2A221B]/70 mt-0.5">
                  Vetted non-matriarch vendors supporting maternal health, tools, and bulk organic soil. Current rate: <strong>$60/quarter</strong> or <strong>$25/month</strong>.
                </p>
              </div>
              <span className="px-3 py-1 bg-amber-50 border border-amber-200 text-[#B87333] rounded-full text-xs font-mono font-bold self-start">
                {adminVendors.length} Total Vendors
              </span>
            </div>

            <div className="divide-y divide-copper-penny/10">
              {adminVendors.map((vend) => (
                <div key={vend.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sm text-[#1F1813]">{vend.businessName}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                        vend.status === 'active' 
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}>
                        {vend.status === 'active' ? '● Active Spotlight' : '⏳ Pending Review'}
                      </span>
                      <span className="px-2 py-0.5 bg-[#FAF5EE] text-[#B87333] border border-[#B87333]/20 rounded-md text-[10px] font-mono font-bold">
                        {vend.rate}
                      </span>
                    </div>
                    <p className="text-xs text-[#2A221B]/70">
                      Contact: <strong>{vend.contactName}</strong> ({vend.email}) • Placed on: {vend.targetHub === 'all' ? 'All Hubs' : vend.targetHub}
                    </p>
                    <p className="text-[11px] font-mono text-soft-sage">
                      Stripe Status: <strong className="text-[#1F1813]">{vend.stripeStatus}</strong> • Approved: {vend.approvedAt}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 self-start md:self-auto">
                    {vend.status === 'pending_review' ? (
                      <button
                        onClick={() => {
                          setAdminVendors(adminVendors.map(v => v.id === vend.id ? { ...v, status: 'active', approvedAt: 'Approved by Admin' } : v));
                        }}
                        className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-mono font-bold uppercase cursor-pointer"
                      >
                        Approve &amp; Activate
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setAdminVendors(adminVendors.map(v => v.id === vend.id ? { ...v, status: v.status === 'active' ? 'pending_review' : 'active' } : v));
                        }}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-mono font-bold cursor-pointer"
                      >
                        {vend.status === 'active' ? 'Pause Spotlight' : 'Resume'}
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setAdminVendors(adminVendors.filter(v => v.id !== vend.id));
                      }}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                      title="Delete Vendor"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Classified Listings Manager ($5 Jobs & $10 Land/Housing) */}
          <div className="bg-white rounded-3xl p-6 border border-copper-penny/20 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-copper-penny/10 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <Tag className="w-5 h-5 text-[#D4AF37]" />
                  <h4 className="font-serif text-lg font-bold text-[#1F1813]">
                    Sovereign Classifieds Desk ($5 &amp; $10 Postings)
                  </h4>
                </div>
                <p className="text-xs text-[#2A221B]/70 mt-0.5">
                  Review and arbitrate community classified posts. Job listings contribute $5, and Homestead Land/Housing posts contribute $10 to platform upkeep.
                </p>
              </div>
              <span className="px-3 py-1 bg-[#FAF5EE] border border-copper-penny/20 text-[#1F1813] rounded-full text-xs font-mono font-bold self-start">
                {adminClassifieds.length} Postings Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {adminClassifieds.map((cl) => (
                <div key={cl.id} className="p-4 bg-[#FAF5EE] rounded-2xl border border-copper-penny/15 space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-[#D4AF37]/20 text-[#B87333] border border-[#D4AF37]/40 rounded-md text-[10px] font-mono font-bold">
                        {cl.fee} {cl.type === 'job_listing' ? 'Job Listing' : 'Land / Lease'}
                      </span>
                      <span className="text-[10px] font-mono text-soft-sage">{cl.date}</span>
                    </div>
                    <h5 className="font-bold text-xs text-[#1F1813] mt-2 line-clamp-2">{cl.title}</h5>
                    <p className="text-[11px] text-[#2A221B]/70 mt-1">
                      Posted by <strong>{cl.posterName}</strong> • {cl.city}, {cl.state}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-copper-penny/10 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-emerald-700 font-bold">● Published</span>
                    <button
                      onClick={() => setAdminClassifieds(adminClassifieds.filter(c => c.id !== cl.id))}
                      className="text-[10px] font-mono text-red-600 hover:underline cursor-pointer"
                    >
                      Remove Listing
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: "Buy Us a Tea" & Love Gift Registry */}
          <div className="bg-white rounded-3xl p-6 border border-copper-penny/20 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-copper-penny/10 pb-4">
              <div>
                <h4 className="font-serif text-lg font-bold text-[#1F1813]">
                  ☕ "Buy Us a Tea" &amp; Sister Love Gifts Registry
                </h4>
                <p className="text-xs text-[#2A221B]/70 mt-0.5">
                  Heartfelt contributions from sisters ($3, $9, $27, $81) received to honor the founder and maintain server infrastructure.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                $39.00 Received This Month
              </span>
            </div>

            <div className="divide-y divide-copper-penny/10">
              {teaGifts.map((gift) => (
                <div key={gift.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-[#1F1813]">{gift.sister} — <span className="text-emerald-700 font-mono">{gift.amount}</span></p>
                    <p className="text-[11px] text-[#2A221B]/80 italic mt-0.5">"{gift.note}"</p>
                  </div>
                  <span className="text-[10px] font-mono text-soft-sage">{gift.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 10: APOTHECARY & BOTANICAL DISPENSARY MANAGER                         */}
      {/* ========================================================================= */}
      {adminTab === 'apothecary' && (
        <AdminApothecaryManager />
      )}

      {/* ========================================================================= */}
      {/* TAB 11: POSTPARTUM CARE PODS & EMERGENCY MEAL TRAIN DISPATCH               */}
      {/* ========================================================================= */}
      {adminTab === 'care_pods' && (
        <AdminCarePodsManager />
      )}

      {/* ========================================================================= */}
      {/* TAB 12: 508(c)(1)(a) PMA LEGAL & SIGNED COVENANT AUDIT VAULT             */}
      {/* ========================================================================= */}
      {adminTab === 'covenant_vault' && (
        <AdminCovenantVault />
      )}

      {/* ========================================================================= */}
      {/* TAB 13: MASTER MEMBER DIRECTORY & SAFETY MODERATION                       */}
      {/* ========================================================================= */}
      {adminTab === 'member_directory' && (
        <AdminMemberDirectory />
      )}

      {/* ========================================================================= */}
      {/* TAB 14: CONTENT MODERATION & TARGETED PUSH DESK                           */}
      {/* ========================================================================= */}
      {adminTab === 'moderation' && (
        <AdminModerationQueue onAddBulletin={onAddBulletin} />
      )}

      {/* ========================================================================= */}
      {/* TAB 15: NESTBRIGHT PROMO VOUCHERS & KINSHIP VAULT LIBRARY                */}
      {/* ========================================================================= */}
      {adminTab === 'kinship_vault' && (
        <AdminKinshipNestBright />
      )}

      {/* ========================================================================= */}
      {/* TAB 16: EMBEDDED AI STUDIO EXTERNAL ADMIN VAULT PORTAL (ADMIN ONLY)       */}
      {/* ========================================================================= */}
      {adminTab === 'aistudio_vault' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Header & Control Bar */}
          <div className="bg-gradient-to-r from-[#180E08] via-[#2A1D16] to-[#120A05] text-[#FAF5EE] border-2 border-[#D4AF37]/50 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#D4AF37]/25 pb-4">
              <div>
                <div className="flex items-center space-x-2 text-[#D4AF37] mb-1">
                  <Lock className="w-4 h-4 text-[#D4AF37]" />
                  <span className="font-mono text-xs uppercase font-extrabold tracking-widest">
                    🔒 Restricted Admin Access Only • Applet ID: c9b1ec1b-3902-4a00-a551-43176e58c789
                  </span>
                </div>
                <h3 className="font-serif text-2xl font-black text-[#FAF5EE] flex items-center space-x-2">
                  <Sparkles className="w-6 h-6 text-[#D4AF37]" />
                  <span>AI Studio External Admin Vault Console</span>
                </h3>
                <p className="text-xs text-[#FAF5EE]/80 font-mono mt-1 max-w-3xl">
                  Embedded high-security AI Studio Admin Console portal for Matriarch Elders &amp; Admin Staff. Run, test, and manage external admin tools directly within Copper Mommies.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <a 
                  href="https://ai.studio/apps/c9b1ec1b-3902-4a00-a551-43176e58c789?fullscreenApplet=true" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#D4AF37] hover:bg-[#C5A02E] text-[#1F140E] font-mono text-xs font-black rounded-xl border border-white flex items-center space-x-2 shadow-lg transition-all active:scale-95"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open Fullscreen in New Window</span>
                </a>

                <button
                  onClick={() => {
                    const iframe = document.getElementById('aistudio-vault-iframe') as HTMLIFrameElement;
                    if (iframe) {
                      iframe.src = iframe.src;
                    }
                  }}
                  className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-[#FAF5EE] font-mono text-xs font-bold rounded-xl border border-white/20 flex items-center space-x-1.5 cursor-pointer"
                  title="Reload Portal Frame"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Reload Frame</span>
                </button>
              </div>
            </div>

            {/* Editing & Workflow Explanatory Notice */}
            <div className="bg-[#140B06] p-4 rounded-2xl border border-[#D4AF37]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <span className="font-mono font-bold text-[#D4AF37] block">
                  💡 How Chat Editing &amp; Embedding Works:
                </span>
                <p className="text-[#FAF5EE]/85 text-[11px] leading-relaxed">
                  • <strong>This chat workspace</strong> edits and controls Copper Mommies (navigation, admin security locks, backend integrations, and how this embedded portal is displayed).<br />
                  • <strong>The embedded frame below</strong> loads your live external AI Studio applet (<code className="bg-black/50 px-1 py-0.5 rounded text-[#D4AF37]">c9b1ec1b-3902-4a00-a551-43176e58c789</code>). You can test, use, and run its tools live right here! To edit the internal code of that external applet, open its dedicated project chat in AI Studio.
                </p>
              </div>

              <span className="px-3 py-1 bg-emerald-950 text-emerald-300 font-mono text-[10px] font-bold rounded-full border border-emerald-500/40 shrink-0">
                🟢 Live Portal Active
              </span>
            </div>
          </div>

          {/* Embedded Interactive Portal iFrame Container */}
          <div className="relative w-full rounded-3xl overflow-hidden border-2 border-[#D4AF37]/50 shadow-2xl bg-[#180E08] min-h-[850px]">
            <iframe 
              id="aistudio-vault-iframe"
              src="https://ai.studio/apps/c9b1ec1b-3902-4a00-a551-43176e58c789?fullscreenApplet=true" 
              className="w-full h-[880px] border-0"
              allow="clipboard-read; clipboard-write; autoplay; camera; microphone; geolocation"
              title="AI Studio External Admin Vault Portal"
            />
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 17: ADMIN AUTOMATION & WORKFLOW CONTROL CENTER                        */}
      {/* ========================================================================= */}
      {adminTab === 'automation_hub' && (
        <AdminAutomationHub />
      )}

    </div>
  );
}
