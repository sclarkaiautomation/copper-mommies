import React, { useState, useMemo, useEffect } from 'react';
import { 
  Building2, 
  Briefcase, 
  Calendar, 
  Download, 
  Search, 
  Filter, 
  PlusCircle, 
  CheckCircle2, 
  MapPin, 
  Globe, 
  Sparkles, 
  Clock, 
  ArrowRight, 
  ExternalLink, 
  FileText, 
  Users, 
  DollarSign, 
  Tag, 
  X,
  Share2,
  Bookmark,
  Store,
  ChevronRight,
  ShieldCheck,
  Check,
  Zap,
  Handshake,
  Image as ImageIcon,
  Eye,
  Plus,
  Repeat
} from 'lucide-react';
import { MommieBusiness, OpportunityJob, CommerceWorkshop, IncubatorResource, PageSpotlightBanner, ScholarshipEntry } from '../types';
import SpotlightBanner from './SpotlightBanner';
import SCAutomatedPortal from './SCAutomatedPortal';
import { US_STATES_DATA, getStateCities } from '../data/usStatesData';
import CreateUnifiedListingModal from './CreateUnifiedListingModal';
import TradeHandshakeModal from './TradeHandshakeModal';
import { 
  getStoredUnifiedListings, 
  UnifiedListing, 
  MarketplaceCategoryType, 
  MultiStageTrade,
  getStoredTrades,
  completeTradeHandshake
} from '../data/unifiedMarketplaceStore';

interface CommerceHubProps {
  selectedState: string;
  userName: string;
  onNavigateToCircle?: () => void;
  onNavigateToTreasury?: () => void;
  onNavigateToCommons?: (subTab?: 'feed' | 'gigs' | 'exchange' | 'housing' | 'businesses' | 'events' | 'map') => void;
  onOpenDirectChat?: (recipientName: string, contextTitle: string, initialNote?: string) => void;
  spotlightBanner?: PageSpotlightBanner;
  banners?: PageSpotlightBanner[];
  onEnterContest?: (entry: ScholarshipEntry) => void;
}

export default function CommerceHub({ 
  selectedState, 
  userName, 
  onNavigateToCircle, 
  onNavigateToTreasury,
  onNavigateToCommons,
  onOpenDirectChat,
  spotlightBanner, 
  banners 
}: CommerceHubProps) {
  // Navigation within Hub
  const [activeSection, setActiveSection] = useState<'directory' | 'opportunities' | 'workshops' | 'incubator' | 'sc-automated'>('directory');

  // Notification / Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // ----------------------------------------------------
  // UNIFIED MARKETPLACE DUAL-SYNC STATE (JOBS, GIGS, WORKSHOPS, BUSINESSES)
  // ----------------------------------------------------
  const [unifiedListings, setUnifiedListings] = useState<UnifiedListing[]>(() => getStoredUnifiedListings());
  const [isUnifiedCreateModalOpen, setIsUnifiedCreateModalOpen] = useState(false);
  const [unifiedModalCategory, setUnifiedModalCategory] = useState<MarketplaceCategoryType>('job');
  const [activeTradeListing, setActiveTradeListing] = useState<UnifiedListing | null>(null);
  const [activeTradeRecord, setActiveTradeRecord] = useState<MultiStageTrade | null>(null);
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
  const [selectedPhotoIndexMap, setSelectedPhotoIndexMap] = useState<Record<string, number>>({});
  const [photoLightboxUrl, setPhotoLightboxUrl] = useState<string | null>(null);
  const [showTradesLedgerModal, setShowTradesLedgerModal] = useState(false);
  const [allTrades, setAllTrades] = useState<MultiStageTrade[]>(() => getStoredTrades());

  useEffect(() => {
    const handleSync = () => {
      setUnifiedListings(getStoredUnifiedListings());
      setAllTrades(getStoredTrades());
    };
    window.addEventListener('copper_marketplace_sync', handleSync);
    return () => window.removeEventListener('copper_marketplace_sync', handleSync);
  }, []);

  const handleOpenTradeForListing = (listing: UnifiedListing) => {
    const currentTrades = getStoredTrades();
    const existing = currentTrades.find(t => t.listingId === listing.id);
    setActiveTradeListing(listing);
    setActiveTradeRecord(existing || null);
    setIsTradeModalOpen(true);
  };

  // ----------------------------------------------------
  // 1. MOMMIE BUSINESS DIRECTORY STATE
  // ----------------------------------------------------
  const [directorySearch, setDirectorySearch] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [selectedLocationState, setSelectedLocationState] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [customCityInput, setCustomCityInput] = useState<string>('');
  const [onlyOnline, setOnlyOnline] = useState<boolean>(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [savedBusinesses, setSavedBusinesses] = useState<string[]>([]);

  const initialBusinesses: MommieBusiness[] = [
    {
      id: 'biz-1',
      name: 'Roots & Resilience Apothecary',
      ownerName: 'Mama Shantrece',
      industry: 'Holistic Health',
      locationState: 'GA',
      city: 'Atlanta',
      isOnline: true,
      description: 'Handcrafted seasonal oxymels, wildcrafted elderberry elixirs, and postpartum mineral nettle infusions formulated with ancestral plant medicine.',
      tags: ['Herbalism', 'Organic', 'Postpartum', 'Wildcrafted'],
      contactEmail: 'shantrece@rootsapothecary.coop',
      website: 'https://rootsandresilience.example',
      communityOffer: '✨ 15% off orders with code COPPERMOMMIE or 100% Copper Credit barter accepted for bulk dried herbs.',
      verifiedMember: true,
      createdAt: '2026-08-12'
    },
    {
      id: 'biz-2',
      name: 'Highland Ridge Heritage Seeds & Produce',
      ownerName: 'Mama Danielle',
      industry: 'Agriculture & Homestead',
      locationState: 'NC',
      city: 'Asheville',
      isOnline: true,
      description: 'Open-pollinated, non-GMO heirloom seeds and pasture-raised heritage poultry. Preserving American Indian and southern heirloom crop varieties.',
      tags: ['Heirloom Seeds', 'Three Sisters', 'Pasture Raised', 'Homestead'],
      contactEmail: 'danielle@highlandheritage.org',
      website: 'https://highlandridge.example',
      communityOffer: '🌱 Free seasonal seed packet with every barter exchange or member seed swap participation.',
      verifiedMember: true,
      createdAt: '2026-08-15'
    },
    {
      id: 'biz-3',
      name: 'Sacred Threshold Doula & Birth Haven',
      ownerName: 'Mama Keisha',
      industry: 'Childcare & Education',
      locationState: 'SC',
      city: 'Charleston',
      isOnline: true,
      description: 'Physiological home birth doula care, traditional Bengkung belly binding, prenatal nutrition counseling, and maternal labor advocacy.',
      tags: ['Birth Doula', 'Lying-In', 'Postpartum Care', 'Lactation'],
      contactEmail: 'keisha@sacredthreshold.org',
      website: 'https://sacredthreshold.example',
      communityOffer: '🕊️ Complimentary 45-minute virtual birth plan consult for all verified Copper Circle mothers.',
      verifiedMember: true,
      createdAt: '2026-08-18'
    },
    {
      id: 'biz-4',
      name: 'Indigo & Copper Loomworks',
      ownerName: 'Mama Maya',
      industry: 'Artisan & Apparel',
      locationState: 'SC',
      city: 'Beaufort',
      isOnline: true,
      description: 'Handwoven natural fiber textiles, organic cotton nursing wraps, and botanical indigo-dyed home linens crafted with traditional American loom techniques.',
      tags: ['Textiles', 'Natural Dye', 'Baby Wearing', 'Handmade'],
      contactEmail: 'maya@indigoloom.coop',
      website: 'https://indigoloom.example',
      communityOffer: '🎁 20% discount on first baby wrap order + priority custom sizing for nursing mothers.',
      verifiedMember: true,
      createdAt: '2026-08-20'
    },
    {
      id: 'biz-5',
      name: 'Matriarchal Ledger & Trust Advisory',
      ownerName: 'Mama Corinne',
      industry: 'Professional Services',
      locationState: 'GA',
      city: 'Savannah',
      isOnline: true,
      description: 'Cooperative entity formation, unincorporated association structuring, family land trust setups, and small business bookkeeping for self-employed mothers.',
      tags: ['Legal Trust', 'Bookkeeping', 'Entity Formation', 'Co-op Law'],
      contactEmail: 'corinne@matriarchtrust.com',
      website: 'https://matriarchtrust.example',
      communityOffer: '📜 Free 30-minute entity diagnostic & state filing roadmap for member ventures.',
      verifiedMember: true,
      createdAt: '2026-08-22'
    },
    {
      id: 'biz-6',
      name: 'Sweetgrass Stone-Ground Pantry',
      ownerName: 'Mama Regina',
      industry: 'Culinary & Pantry',
      locationState: 'AL',
      city: 'Mobile',
      isOnline: true,
      description: 'Water-mill stone-ground cornmeal, heirloom Carolina Gold rice, small-batch sorghum syrup, and lacto-fermented farm vegetables in mason jars.',
      tags: ['Carolina Gold', 'Stone Ground', 'Fermented Foods', 'Pantry'],
      contactEmail: 'regina@sweetgrasspantry.com',
      website: 'https://sweetgrasspantry.example',
      communityOffer: '🌾 $10 credit toward pantry staples bundle when paid via Time-Credit or Barter Ledger.',
      verifiedMember: true,
      createdAt: '2026-08-25'
    }
  ];

  const [businesses, setBusinesses] = useState<MommieBusiness[]>(initialBusinesses);

  // New business form state
  const [newBiz, setNewBiz] = useState({
    name: '',
    ownerName: userName,
    industry: 'Holistic Health' as MommieBusiness['industry'],
    locationState: selectedState || 'GA',
    city: '',
    isOnline: true,
    description: '',
    tags: '',
    contactEmail: '',
    website: '',
    communityOffer: ''
  });

  const handleRegisterBusiness = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBiz.name.trim() || !newBiz.description.trim()) {
      showToast('Please provide a business name and description.');
      return;
    }

    const created: MommieBusiness = {
      id: `biz-${Date.now()}`,
      name: newBiz.name.trim(),
      ownerName: newBiz.ownerName.trim() || userName,
      industry: newBiz.industry,
      locationState: newBiz.locationState,
      city: newBiz.city.trim() || 'Regional',
      isOnline: newBiz.isOnline,
      description: newBiz.description.trim(),
      tags: newBiz.tags.split(',').map(t => t.trim()).filter(Boolean),
      contactEmail: newBiz.contactEmail.trim() || `${userName.toLowerCase().replace(/\s+/g, '')}@coppermommies.internal`,
      website: newBiz.website.trim(),
      communityOffer: newBiz.communityOffer.trim() || '✨ Special barter and discounts available for verified Copper Mommies.',
      verifiedMember: true,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setBusinesses([created, ...businesses]);
    setIsRegisterModalOpen(false);
    setNewBiz({
      name: '',
      ownerName: userName,
      industry: 'Holistic Health',
      locationState: selectedState || 'GA',
      city: '',
      isOnline: true,
      description: '',
      tags: '',
      contactEmail: '',
      website: '',
      communityOffer: ''
    });
    showToast(`🎉 "${created.name}" registered to the Mommie Business Directory!`);
  };

  const filteredBusinesses = useMemo(() => {
    return businesses.filter(b => {
      const matchesSearch = 
        b.name.toLowerCase().includes(directorySearch.toLowerCase()) ||
        b.description.toLowerCase().includes(directorySearch.toLowerCase()) ||
        b.ownerName.toLowerCase().includes(directorySearch.toLowerCase()) ||
        b.tags.some(t => t.toLowerCase().includes(directorySearch.toLowerCase()));

      const matchesIndustry = selectedIndustry === 'all' || b.industry === selectedIndustry;
      const matchesState = selectedLocationState === 'all' || b.locationState === selectedLocationState;
      const effectiveCity = selectedCity === 'custom' ? customCityInput.trim() : (selectedCity === 'all' ? '' : selectedCity);
      const matchesCity = !effectiveCity || b.city.toLowerCase().includes(effectiveCity.toLowerCase());
      const matchesOnline = !onlyOnline || b.isOnline;

      return matchesSearch && matchesIndustry && matchesState && matchesCity && matchesOnline;
    });
  }, [businesses, directorySearch, selectedIndustry, selectedLocationState, selectedCity, customCityInput, onlyOnline]);

  const toggleSaveBusiness = (id: string) => {
    if (savedBusinesses.includes(id)) {
      setSavedBusinesses(savedBusinesses.filter(bId => bId !== id));
      showToast('Removed from saved directory.');
    } else {
      setSavedBusinesses([...savedBusinesses, id]);
      showToast('Saved to your private directory rolodex!');
    }
  };

  // ----------------------------------------------------
  // 2. OPPORTUNITIES & JOB DESK STATE
  // ----------------------------------------------------
  const [jobSearch, setJobSearch] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState<string>('all');
  const [jobCategoryFilter, setJobCategoryFilter] = useState<string>('all');
  const [jobRemoteOnly, setJobRemoteOnly] = useState<boolean>(false);
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);

  const initialJobs: OpportunityJob[] = [
    {
      id: 'job-1',
      title: 'Apprentice Herbalist & Apothecary Compounder',
      postedBy: 'Mama Shantrece',
      businessName: 'Roots & Resilience Apothecary',
      type: 'Part-Time',
      category: 'Homestead & Farm',
      locationState: 'GA',
      isRemote: false,
      compensation: '$26 / hr + Monthly Apothecary Herbal Ration',
      description: 'Assisting in our small-batch drying room, weighing organic botanicals, compounding seasonal oxymels, and hand-labeling glass amber tincture bottles. Flexible hours built for homeschooling mothers.',
      requirements: [
        'Familiarity with foundational botanical safety and sterile preparation',
        'Attention to detail with batch measurement logs',
        'Available 12-16 flexible daytime hours per week'
      ],
      contactEmail: 'shantrece@rootsapothecary.coop',
      createdAt: '2026-08-28',
      status: 'Open'
    },
    {
      id: 'job-2',
      title: 'Homeschool Cooperative Morning Circle Teacher',
      postedBy: 'Mama Maya',
      businessName: 'Atlanta Village Co-Care Pod',
      type: 'Gig Work',
      category: 'Childcare & Doula',
      locationState: 'GA',
      isRemote: false,
      compensation: '$35 / hr or 2x Sovereign Time-Credits',
      description: 'Guiding an intimate outdoor pod of five children (ages 5-9) through morning phonics, nature journaling, and American Indian history companion storytelling two mornings a week (Tues/Thurs 9am-12pm).',
      requirements: [
        'Gentle, child-centered matriarchal educational approach',
        'Passion for hands-on nature discovery and storytelling',
        'Verified Copper Mommie member in good standing'
      ],
      contactEmail: 'villageco-care@coppermommies.internal',
      createdAt: '2026-08-30',
      status: 'Open'
    },
    {
      id: 'job-3',
      title: 'Digital Asset & Template Designer (Canva / Adobe)',
      postedBy: 'Mama Corinne',
      businessName: 'Matriarchal Ledger Advisory',
      type: 'Contract',
      category: 'Creative & Artisan',
      locationState: 'Nationwide',
      isRemote: true,
      compensation: '$650 Project Fee (Approx. 15-18 hrs)',
      description: 'Design a clean, copper-and-gold branded suite of 8 downloadable PDF guides, printable homeschool chore wheels, and business formation workbooks for our digital incubator.',
      requirements: [
        'Strong typography eye aligned with warm neutral, copper, and gold aesthetic',
        'Deliver print-ready PDFs and editable template links',
        'Comfortable working asynchronously with quick review cycles'
      ],
      contactEmail: 'corinne@matriarchtrust.com',
      createdAt: '2026-09-02',
      status: 'Open'
    },
    {
      id: 'job-4',
      title: 'Virtual Doula Intake & Client Onboarding Coordinator',
      postedBy: 'Mama Keisha',
      businessName: 'Sacred Threshold Doula',
      type: 'Contract',
      category: 'Childcare & Doula',
      locationState: 'SC',
      isRemote: true,
      compensation: '$22 - $25 / hr (10 hrs/week)',
      description: 'Review incoming expectant mother inquiries, schedule prenatal virtual consultations, ensure consent forms are securely filed in encrypted storage, and follow up with postpartum care package delivery tracking.',
      requirements: [
        'Empathetic, calm, and grounded communication skills',
        'Strict reverence for maternal privacy and confidential records',
        'Basic familiarity with birth terminology and Doula scope'
      ],
      contactEmail: 'keisha@sacredthreshold.org',
      createdAt: '2026-09-04',
      status: 'Open'
    },
    {
      id: 'job-5',
      title: 'Seasonal Heirloom Seed Harvester & Winnowing Hand',
      postedBy: 'Mama Danielle',
      businessName: 'Highland Ridge Heritage Seeds',
      type: 'Trade Exchange',
      category: 'Homestead & Farm',
      locationState: 'NC',
      isRemote: false,
      compensation: 'Generous Heritage Seed Stock + $20/hr Garden Stipend',
      description: 'Hands-on weekend gathering of heirloom Cherokee Purple tomato seed pulp, threshing and winnowing dried pole beans, and packaging open-pollinated seeds into moisture-tight envelopes.',
      requirements: [
        'Enjoys outdoor physical homestead rhythm in beautiful mountain air',
        'Careful handling of heritage seed strains to prevent cross-contamination',
        'Great for mothers and youth participating together'
      ],
      contactEmail: 'danielle@highlandheritage.org',
      createdAt: '2026-09-05',
      status: 'Open'
    }
  ];

  const [jobs, setJobs] = useState<OpportunityJob[]>(initialJobs);

  const [newJob, setNewJob] = useState({
    title: '',
    postedBy: userName,
    businessName: '',
    type: 'Gig Work' as OpportunityJob['type'],
    category: 'Childcare & Doula' as OpportunityJob['category'],
    locationState: selectedState || 'GA',
    isRemote: false,
    compensation: '',
    description: '',
    requirements: '',
    contactEmail: ''
  });

  const handlePostJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJob.title.trim() || !newJob.description.trim() || !newJob.compensation.trim()) {
      showToast('Please provide a title, compensation, and description.');
      return;
    }

    const created: OpportunityJob = {
      id: `job-${Date.now()}`,
      title: newJob.title.trim(),
      postedBy: newJob.postedBy.trim() || userName,
      businessName: newJob.businessName.trim() || 'Community Member',
      type: newJob.type,
      category: newJob.category,
      locationState: newJob.locationState,
      isRemote: newJob.isRemote,
      compensation: newJob.compensation.trim(),
      description: newJob.description.trim(),
      requirements: newJob.requirements.split('\n').map(r => r.trim()).filter(Boolean),
      contactEmail: newJob.contactEmail.trim() || `${userName.toLowerCase().replace(/\s+/g, '')}@coppermommies.internal`,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'Open'
    };

    setJobs([created, ...jobs]);
    setIsPostJobModalOpen(false);
    setNewJob({
      title: '',
      postedBy: userName,
      businessName: '',
      type: 'Gig Work',
      category: 'Childcare & Doula',
      locationState: selectedState || 'GA',
      isRemote: false,
      compensation: '',
      description: '',
      requirements: '',
      contactEmail: ''
    });
    showToast(`💼 Opportunity "${created.title}" posted to the Job Desk!`);
  };

  const handleApplyJob = (job: OpportunityJob) => {
    if (appliedJobs.includes(job.id)) {
      showToast('You have already submitted your interest for this opportunity.');
      return;
    }
    setAppliedJobs([...appliedJobs, job.id]);
    showToast(`🕊️ Interest sent to ${job.postedBy}! Details dispatched to your Copper Circle inbox.`);
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter(j => {
      const matchesSearch = 
        j.title.toLowerCase().includes(jobSearch.toLowerCase()) ||
        j.description.toLowerCase().includes(jobSearch.toLowerCase()) ||
        j.postedBy.toLowerCase().includes(jobSearch.toLowerCase()) ||
        (j.businessName && j.businessName.toLowerCase().includes(jobSearch.toLowerCase()));

      const matchesType = jobTypeFilter === 'all' || j.type === jobTypeFilter;
      const matchesCategory = jobCategoryFilter === 'all' || j.category === jobCategoryFilter;
      const matchesRemote = !jobRemoteOnly || j.isRemote;

      return matchesSearch && matchesType && matchesCategory && matchesRemote;
    });
  }, [jobs, jobSearch, jobTypeFilter, jobCategoryFilter, jobRemoteOnly]);

  // Dual-Synced Unified Gigs & Opportunities Memo
  const filteredUnifiedGigs = useMemo(() => {
    return unifiedListings
      .filter(l => l.categoryType === 'job' || l.categoryType === 'gig')
      .filter(l => {
        const matchesSearch = 
          !jobSearch.trim() ||
          l.title.toLowerCase().includes(jobSearch.toLowerCase()) ||
          l.description.toLowerCase().includes(jobSearch.toLowerCase()) ||
          l.authorName.toLowerCase().includes(jobSearch.toLowerCase());
        const matchesType = jobTypeFilter === 'all' || 
          (l.details.employmentType && l.details.employmentType.toLowerCase().includes(jobTypeFilter.toLowerCase())) ||
          (jobTypeFilter === 'Gig Work' && l.categoryType === 'gig') ||
          (jobTypeFilter === 'Trade Exchange' && l.details.compensationType === 'time_credit');
        const matchesRemote = !jobRemoteOnly || l.details.remoteOrInPerson === 'Remote';
        return matchesSearch && matchesType && matchesRemote;
      });
  }, [unifiedListings, jobSearch, jobTypeFilter, jobRemoteOnly]);

  const filteredUnifiedWorkshops = useMemo(() => {
    return unifiedListings.filter(l => l.categoryType === 'event');
  }, [unifiedListings]);

  const filteredUnifiedBusinesses = useMemo(() => {
    return unifiedListings.filter(l => l.categoryType === 'business');
  }, [unifiedListings]);

  // Render Card with Multi-Photo Gallery & Handshake Actions
  const renderUnifiedCard = (listing: UnifiedListing, targetContext: 'jobs' | 'workshops' | 'directory') => {
    const photos = listing.photos && listing.photos.length > 0 ? listing.photos : (listing.primaryCoverImage ? [listing.primaryCoverImage] : []);
    const activePhotoIndex = selectedPhotoIndexMap[listing.id] ?? 0;
    const currentPhoto = photos[activePhotoIndex] || photos[0] || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80';
    const isJobOrGig = listing.categoryType === 'gig';
    const isEvent = listing.categoryType === 'event';
    const isBusiness = listing.categoryType === 'business';

    return (
      <div 
        key={listing.id}
        className="bg-white border-2 border-[#B87333]/25 hover:border-[#D4AF37] rounded-3xl p-5 shadow-xs hover:shadow-lg transition-all space-y-4"
      >
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-copper-penny/10 pb-3">
          <div className="flex items-start space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#B87333] to-[#D4AF37] text-white flex items-center justify-center font-serif font-black text-xl shadow-xs shrink-0">
              {listing.authorAvatar || (isJobOrGig ? '💼' : isEvent ? '📅' : '⭐')}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="font-serif font-bold text-base text-[#1F1813] hover:text-[#B87333] transition-colors">
                  {listing.authorName}
                </h4>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-[#FAF5EE] text-[#B87333] border border-copper-penny/25">
                  {listing.authorRole}
                </span>
                <span className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold bg-amber-50 text-amber-900 border border-amber-200 flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                  <span>Dual-Synced with Village Commons</span>
                </span>
              </div>
              <p className="text-[11px] font-mono text-soft-sage flex items-center space-x-1.5 mt-0.5">
                <MapPin className="w-3 h-3 text-[#B87333]" />
                <span>{listing.authorCity ? `${listing.authorCity}, ` : ''}{listing.authorState} Circle</span>
                <span>•</span>
                <span>Posted {listing.createdAt}</span>
              </p>
            </div>
          </div>

          {/* Category Tag */}
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-[#1F140E] text-[#D4AF37] text-[10px] font-mono font-extrabold uppercase rounded-xl tracking-wider">
              {listing.categoryType === 'gig' ? 'Maternal Gig' : listing.categoryType === 'event' ? 'Workshop Circle' : listing.categoryType === 'business' ? 'Sister Business' : 'Community Listing'}
            </span>
          </div>
        </div>

        {/* Title & Core Headline */}
        <div>
          <h3 className="font-serif font-black text-xl text-[#1F1813] leading-snug">
            {listing.title}
          </h3>
          <p className="text-xs text-[#2A221B]/90 mt-1 leading-relaxed">
            {listing.description}
          </p>
        </div>

        {/* Multi-Photo Gallery Preview (Upgraded Marketplace Pattern: Main Photo + Thumbnails) */}
        {photos.length > 0 && (
          <div className="space-y-2 bg-[#FAF5EE]/50 p-3 rounded-2xl border border-copper-penny/15">
            <div className="relative h-60 sm:h-72 w-full rounded-xl overflow-hidden bg-stone-100 group">
              <img 
                src={currentPhoto} 
                alt={listing.title} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102 cursor-pointer"
                onClick={() => setPhotoLightboxUrl(currentPhoto)}
              />
              <button
                type="button"
                onClick={() => setPhotoLightboxUrl(currentPhoto)}
                className="absolute bottom-2.5 right-2.5 px-2.5 py-1 bg-black/75 hover:bg-black text-white text-[10px] font-mono rounded-lg flex items-center space-x-1 backdrop-blur-xs transition-colors cursor-pointer"
              >
                <Eye className="w-3 h-3 text-[#D4AF37]" />
                <span>Zoom Photo ({activePhotoIndex + 1}/{photos.length})</span>
              </button>
            </div>

            {/* Thumbnail Strip */}
            {photos.length > 1 && (
              <div className="flex items-center space-x-2 overflow-x-auto pb-1 pt-1 scrollbar-thin">
                {photos.map((ph, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedPhotoIndexMap(prev => ({ ...prev, [listing.id]: idx }))}
                    className={`relative w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                      activePhotoIndex === idx 
                        ? 'border-[#B87333] shadow-md scale-105 ring-2 ring-[#D4AF37]/50' 
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={ph} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Category-Specific Detailed Spec Badges & Attributes */}
        {isJobOrGig && (
          <div className="space-y-3 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="bg-[#FAF5EE] p-3 rounded-xl border border-copper-penny/15">
                <span className="text-[10px] font-mono uppercase text-[#B87333] font-bold block">Compensation</span>
                <span className="text-sm font-mono font-black text-[#1F1813]">{listing.details.compensation || 'Co-op Barter'}</span>
              </div>
              <div className="bg-[#FAF5EE] p-3 rounded-xl border border-copper-penny/15">
                <span className="text-[10px] font-mono uppercase text-[#B87333] font-bold block">Type &amp; Arrangement</span>
                <span className="text-xs font-mono font-bold text-[#1F1813]">
                  {listing.details.employmentType || 'Contract'} • {listing.details.remoteOrInPerson || 'On-Site'}
                </span>
              </div>
              <div className="bg-[#FAF5EE] p-3 rounded-xl border border-copper-penny/15">
                <span className="text-[10px] font-mono uppercase text-[#B87333] font-bold block">Barter / Time Credits</span>
                <span className="text-xs font-mono font-bold text-[#D4AF37]">
                  {listing.details.compensationType === 'hybrid' ? 'Cash + Time Credit Split' : listing.details.compensationType === 'time_credit' ? '100% Sovereign Time Credits' : 'Direct Co-op Pay'}
                </span>
              </div>
            </div>

            {/* Duties and Requirements */}
            {((listing.details.duties && listing.details.duties.length > 0) || (listing.details.requirements && listing.details.requirements.length > 0)) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-stone-50 p-3.5 rounded-2xl border border-stone-200/70">
                {listing.details.duties && listing.details.duties.length > 0 && (
                  <div>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#B87333] block mb-1">
                      Scope of Work &amp; Duties:
                    </span>
                    <ul className="space-y-1 text-[#2A221B]/85">
                      {listing.details.duties.map((d, i) => (
                        <li key={i} className="flex items-start space-x-1.5">
                          <span className="text-[#B87333] font-bold">•</span>
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {listing.details.requirements && listing.details.requirements.length > 0 && (
                  <div>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#B87333] block mb-1">
                      Requirements &amp; Maternal Fit:
                    </span>
                    <ul className="space-y-1 text-[#2A221B]/85">
                      {listing.details.requirements.map((r, i) => (
                        <li key={i} className="flex items-start space-x-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {isEvent && (
          <div className="space-y-3 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="bg-[#FAF5EE] p-3 rounded-xl border border-copper-penny/15">
                <span className="text-[10px] font-mono uppercase text-[#B87333] font-bold block">Date &amp; Schedule</span>
                <span className="text-xs font-mono font-bold text-[#1F1813]">{listing.details.eventDate || 'Upcoming'} • {listing.details.eventTime || 'TBA'}</span>
              </div>
              <div className="bg-[#FAF5EE] p-3 rounded-xl border border-copper-penny/15">
                <span className="text-[10px] font-mono uppercase text-[#B87333] font-bold block">Format &amp; Venue</span>
                <span className="text-xs font-mono font-bold text-[#1F1813]">{listing.details.locationType === 'virtual' ? '🌐 Live Zoom Sanctuary' : listing.details.venueOrCity || 'In-Person Sanctuary'}</span>
              </div>
              <div className="bg-[#FAF5EE] p-3 rounded-xl border border-copper-penny/15">
                <span className="text-[10px] font-mono uppercase text-[#B87333] font-bold block">Capacity &amp; Seats</span>
                <span className="text-xs font-mono font-bold text-[#1F1813]">{listing.details.participantCap || 25} Mothers Maximum</span>
              </div>
            </div>

            {listing.details.suppliesNeeded && listing.details.suppliesNeeded.length > 0 && (
              <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200/70 text-xs">
                <span className="font-mono text-[10px] font-bold uppercase text-[#B87333] block mb-1">
                  🌿 Supplies &amp; Ingredients to Bring:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {listing.details.suppliesNeeded.map((s, i) => (
                    <span key={i} className="px-2 py-0.5 bg-white border border-amber-300 rounded text-[10px] font-mono text-stone-800">
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {isBusiness && (
          <div className="space-y-3 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="bg-[#FAF5EE] p-3 rounded-xl border border-copper-penny/15">
                <span className="text-[10px] font-mono uppercase text-[#B87333] font-bold block">Industry &amp; Specialty</span>
                <span className="text-xs font-mono font-bold text-[#1F1813]">{listing.details.industry || 'Artisan & Crafting'}</span>
              </div>
              <div className="bg-[#FAF5EE] p-3 rounded-xl border border-copper-penny/15">
                <span className="text-[10px] font-mono uppercase text-[#B87333] font-bold block">Sisterhood Community Offer</span>
                <span className="text-xs font-mono font-bold text-[#D4AF37]">{listing.details.communityOffer || 'Barter accepted for members'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons Bar */}
        <div className="pt-3 border-t border-copper-penny/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs font-mono text-[#1F1813]/60">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
            <span>Vetted Member Protection • Direct Handshake Workflow</span>
          </div>

          <div className="flex items-center space-x-2">
            {onNavigateToCommons && (
              <button
                type="button"
                onClick={() => onNavigateToCommons(isJobOrGig ? 'gigs' : isEvent ? 'events' : 'businesses')}
                className="px-3 py-1.5 border border-copper-penny/25 hover:bg-[#FAF5EE] text-[#1F1813] rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center space-x-1"
                title="View dual-synced listing inside Village Commons"
              >
                <span>View in Commons</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#B87333]" />
              </button>
            )}

            <button
              type="button"
              onClick={() => handleOpenTradeForListing(listing)}
              className="px-4 py-2 bg-[#D4AF37] hover:bg-[#B87333] hover:text-white text-[#1F1813] font-mono text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-xs cursor-pointer flex items-center space-x-1.5"
            >
              <Handshake className="w-3.5 h-3.5" />
              <span>Initiate Handshake / Barter</span>
            </button>

            {onOpenDirectChat && (
              <button
                type="button"
                onClick={() => onOpenDirectChat(listing.authorName, listing.title, `Peace Sister ${listing.authorName}, I am inquiring regarding your listing "${listing.title}".`)}
                className="px-3 py-2 bg-[#1F140E] hover:bg-black text-[#D4AF37] font-mono text-xs font-bold rounded-xl transition-all cursor-pointer"
                title="Send direct private message to Sister"
              >
                💬 Chat
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ----------------------------------------------------
  // 3. WORKSHOP & EVENT CALENDAR STATE
  // ----------------------------------------------------
  const [eventFormatFilter, setEventFormatFilter] = useState<string>('all');
  const [rsvpedEvents, setRsvpedEvents] = useState<string[]>(['event-1']);

  const initialWorkshops: CommerceWorkshop[] = [
    {
      id: 'event-1',
      title: 'Sovereign Family Trust & Cooperative Entity Formation',
      instructor: 'Mama Corinne (Matriarchal Legal & Trust Advisory)',
      format: 'Virtual Masterclass',
      date: 'Thursday, Sept 17, 2026',
      time: '7:00 PM - 8:30 PM EST',
      location: 'Live Zoom Sanctuary Room',
      locationState: 'Online',
      description: 'Step-by-step masterclass on moving family property and business assets into private trusts and unincorporated cooperative associations. Learn how to protect maternal wealth without expensive predatory corporate attorneys.',
      rsvpCount: 42,
      isVirtual: true,
      topics: ['Unincorporated Co-op', 'Private Family Trust', 'Asset Protection', 'Tax Autonomy']
    },
    {
      id: 'event-2',
      title: 'Southeastern Copper Mommies Autumn Harvest Trade Fair',
      instructor: 'Hosted by Atlanta & Savannah Regional Circles',
      format: 'Offline Trade Fair',
      date: 'Saturday, Oct 3, 2026',
      time: '10:00 AM - 4:00 PM EST',
      location: 'Sweetwater Creek Pavilion & Grounds, Lithia Springs, GA',
      locationState: 'GA',
      description: 'Our flagship in-person seasonal trade fair! 30+ member-owned mommie booths featuring heirloom produce, cold-pressed soaps, hand-spun wool, herbal remedies, and children clothing swaps. On-site homeschool activity tent provided.',
      rsvpCount: 88,
      isVirtual: false,
      topics: ['Barter Village', 'Live Seed Swap', 'Children Craft Circle', 'Artisan Pavilion']
    },
    {
      id: 'event-3',
      title: 'Zero-Debt Cashflow & Co-op Ledger Accounting for Mothers',
      instructor: 'Mama Shantrece & Mama Danielle',
      format: 'Financial Workshop',
      date: 'Tuesday, Oct 13, 2026',
      time: '6:30 PM - 8:00 PM EST',
      location: 'Virtual Sanctuary Classroom',
      locationState: 'Online',
      description: 'Learn how to run a thriving household enterprise on cash, barter, and localized time credits. Practical spreadsheet accounting, calculating true unit margins, and price integrity.',
      rsvpCount: 35,
      isVirtual: true,
      topics: ['Unit Costing', 'Barter Accounting', 'Debt-Free Operating', 'Emergency Reserves']
    },
    {
      id: 'event-4',
      title: 'Lowcountry Botanical Apothecary & Indigo Dye Pop-Up Market',
      instructor: 'Mama Maya & Mama Keisha',
      format: 'Pop-up Market',
      date: 'Saturday, Oct 24, 2026',
      time: '11:00 AM - 3:30 PM EST',
      location: 'Historic Gullah-Geechee Community Center, Beaufort, SC',
      locationState: 'SC',
      description: 'An open-air gathering showcasing natural indigo dyeing demonstrations, fresh herbal salves, cold-process lye soaps, and traditional maternal postpartum wraps. Children welcoming playground adjacent.',
      rsvpCount: 51,
      isVirtual: false,
      topics: ['Indigo Vat Dyeing', 'Herbal Salve Bar', 'Postpartum Belly Binding', 'Artisan Showcase']
    },
    {
      id: 'event-5',
      title: 'Digital Asset Creation: Publishing Your Knowledge & Worksheets',
      instructor: 'Sister Nia (Digital Publishing Guild)',
      format: 'Virtual Masterclass',
      date: 'Wednesday, Nov 4, 2026',
      time: '7:30 PM - 9:00 PM EST',
      location: 'Virtual Sanctuary Classroom',
      locationState: 'Online',
      description: 'How to turn your homeschool curriculum, herbal formulations, or homemaking checklists into recurring digital assets. Set up automated distribution with zero monthly software subscriptions.',
      rsvpCount: 29,
      isVirtual: true,
      topics: ['Digital Products', 'No-Code Distribution', 'Content Ownership & Copyright', 'Printable Guides']
    }
  ];

  const [workshops, setWorkshops] = useState<CommerceWorkshop[]>(initialWorkshops);

  const toggleRsvp = (eventId: string) => {
    if (rsvpedEvents.includes(eventId)) {
      setRsvpedEvents(rsvpedEvents.filter(id => id !== eventId));
      setWorkshops(workshops.map(w => w.id === eventId ? { ...w, rsvpCount: Math.max(0, w.rsvpCount - 1) } : w));
      showToast('RSVP cancelled.');
    } else {
      setRsvpedEvents([...rsvpedEvents, eventId]);
      setWorkshops(workshops.map(w => w.id === eventId ? { ...w, rsvpCount: w.rsvpCount + 1 } : w));
      showToast('🎉 You are confirmed for this gathering! Access pass & calendar link saved.');
    }
  };

  const filteredWorkshops = useMemo(() => {
    return workshops.filter(w => {
      if (eventFormatFilter === 'all') return true;
      return w.format === eventFormatFilter;
    });
  }, [workshops, eventFormatFilter]);

  // ----------------------------------------------------
  // 4. DIGITAL INCUBATOR LIBRARY STATE
  // ----------------------------------------------------
  const [incubatorCategory, setIncubatorCategory] = useState<string>('all');
  const [downloadedResources, setDownloadedResources] = useState<string[]>([]);

  const incubatorResources: IncubatorResource[] = [
    {
      id: 'res-1',
      title: 'Traditional LLC to Cooperative Association Conversion Roadmap',
      category: 'Business Formation',
      format: 'PDF Guide',
      downloadSize: '2.4 MB',
      description: 'Comprehensive legal and structural blueprint on shifting single-owner LLCs into cooperative family enterprises. Includes sample Member Agreements and Capital Retain clauses.',
      actionLabel: 'Download Blueprint'
    },
    {
      id: 'res-2',
      title: 'The Copper Mommie Small-Batch Product Cost & Margin Calculator',
      category: 'Financial Sovereignty',
      format: 'Spreadsheet Template',
      downloadSize: '840 KB',
      description: 'Pre-formatted spreadsheet for calculating raw botanical costs, packaging glass, labeling labor, shipping padding, and wholesale/retail price points with zero guesswork.',
      actionLabel: 'Download Spreadsheet'
    },
    {
      id: 'res-3',
      title: 'Matriarchal Digital Asset & Course Launch Blueprint',
      category: 'Digital Asset Creation',
      format: 'Workflow Blueprint',
      downloadSize: '3.1 MB',
      description: 'Step-by-step workflow covering outline development, slide layouts in open formats, audio narration tips, and hosting digital downloads without commercial monthly fees.',
      actionLabel: 'Download Blueprint'
    },
    {
      id: 'res-4',
      title: 'Doula & Holistic Practice Client Intake & Consent Automation Kit',
      category: 'Automated Workflows',
      format: 'Checklist',
      downloadSize: '1.2 MB',
      description: 'Client intake forms, prenatal questionnaires, emergency contact logs, and HIPAA-free sovereign private medical autonomy disclosures tailored for traditional birth workers.',
      actionLabel: 'Download Form Kit'
    },
    {
      id: 'res-5',
      title: 'Sovereign Family Estate & Land Trust Structuring Checklist',
      category: 'Business Formation',
      format: 'Checklist',
      downloadSize: '1.8 MB',
      description: 'Actionable 10-step checklist for establishing private family land trusts, naming trustee successions, and protecting maternal homesteads from probate court.',
      actionLabel: 'Download Checklist'
    },
    {
      id: 'res-6',
      title: 'Direct-to-Sisterhood Community Email & SMS Notification Workflows',
      category: 'Automated Workflows',
      format: 'Workflow Blueprint',
      downloadSize: '1.5 MB',
      description: 'Automated welcome sequences for local customer onboarding, seasonal CSA produce drops, and flash barter notices using privacy-first self-hosted email engines.',
      actionLabel: 'Download Workflow'
    },
    {
      id: 'res-7',
      title: 'Your Brain Is An Asset: The Sovereign Knowledge Architecture',
      category: 'Digital Asset Creation',
      format: 'Workflow Blueprint',
      downloadSize: '4.8 MB',
      description: 'The definitive knowledge monetization guide by SC Automated Solutions & The Copper Circle. Step-by-step frameworks for converting maternal wisdom, homeschooling rhythms, and ancestral recipes into passive, recurring digital revenue streams.',
      actionLabel: 'Download Master Guide'
    }
  ];

  const handleDownloadResource = (res: IncubatorResource) => {
    if (!downloadedResources.includes(res.id)) {
      setDownloadedResources([...downloadedResources, res.id]);
    }
    showToast(`📥 "${res.title}" saved to your offline documents bookshelf!`);
  };

  const filteredResources = useMemo(() => {
    return incubatorResources.filter(r => {
      if (incubatorCategory === 'all') return true;
      return r.category === incubatorCategory;
    });
  }, [incubatorResources, incubatorCategory]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto my-2 text-[#1F1813]">
      
      {/* Toast Feedback Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1F1813] text-[#FAF5EE] border-2 border-[#D4AF37] px-5 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 animate-fade-in text-xs font-mono">
          <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hub Hero Header */}
      <div className="bg-[#FAF5EE] border-2 border-[#B87333]/25 rounded-3xl p-5 sm:p-7 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#D4AF37]/15 via-[#B87333]/10 to-transparent rounded-bl-full pointer-events-none" />
        
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2.5">
              <span className="p-2 bg-[#B87333]/15 text-[#B87333] rounded-xl border border-[#B87333]/30">
                <Building2 className="w-5 h-5 text-[#B87333]" />
              </span>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest font-extrabold text-[#B87333]">
                  Economic Self-Reliance Hub
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1F1813]">
                  Enterprise &amp; Commerce Hub
                </h1>
              </div>
            </div>

            {/* Verified Access Badge */}
            <div className="flex items-center space-x-2 bg-[#D4AF37]/15 border border-[#D4AF37]/40 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold text-[#1F1813]">
              <ShieldCheck className="w-4 h-4 text-[#B87333]" />
              <span>Full Open Access • Verified Sisterhood Network</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#2A221B]/85 max-w-3xl leading-relaxed">
            Welcome to the dedicated commerce citadel of Copper Mommies. Here we build unshakeable economic self-determination through member-owned enterprise, vetted career and trade desks, ancestral masterclasses, and open-source business incubation.
          </p>

          {/* Quick Stats Bar */}
          <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white/80 border border-[#B87333]/15 rounded-xl p-2.5">
              <span className="text-[10px] font-mono uppercase text-[#B87333] font-bold block">Directory Ventures</span>
              <span className="text-lg font-mono font-extrabold text-[#1F1813]">{businesses.length} Member Stores</span>
            </div>
            <div className="bg-white/80 border border-[#B87333]/15 rounded-xl p-2.5">
              <span className="text-[10px] font-mono uppercase text-[#B87333] font-bold block">Active Openings</span>
              <span className="text-lg font-mono font-extrabold text-[#1F1813]">{jobs.length} Vetted Gigs &amp; Roles</span>
            </div>
            <div className="bg-white/80 border border-[#B87333]/15 rounded-xl p-2.5">
              <span className="text-[10px] font-mono uppercase text-[#B87333] font-bold block">Upcoming Events</span>
              <span className="text-lg font-mono font-extrabold text-[#1F1813]">{workshops.length} Gatherings</span>
            </div>
            <div className="bg-white/80 border border-[#B87333]/15 rounded-xl p-2.5">
              <span className="text-[10px] font-mono uppercase text-[#B87333] font-bold block">Incubator Vault</span>
              <span className="text-lg font-mono font-extrabold text-[#1F1813]">{incubatorResources.length} Free Blueprints</span>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Spotlight Banner */}
      <SpotlightBanner banners={banners} banner={spotlightBanner} selectedState={selectedState} userName={userName} />

      {/* Main Four Pillar Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#B87333]/20 pb-3">
        <button
          id="btn-nav-directory"
          onClick={() => setActiveSection('directory')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-2 font-mono uppercase tracking-wider ${
            activeSection === 'directory'
              ? 'bg-[#B87333] text-white shadow-md border border-[#B87333]'
              : 'bg-white text-[#1F1813]/80 border border-copper-penny/20 hover:bg-[#FAF5EE] hover:text-[#B87333]'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Mommie Business Directory ({businesses.length})</span>
        </button>

        <button
          id="btn-nav-opportunities"
          onClick={() => setActiveSection('opportunities')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-2 font-mono uppercase tracking-wider ${
            activeSection === 'opportunities'
              ? 'bg-[#B87333] text-white shadow-md border border-[#B87333]'
              : 'bg-white text-[#1F1813]/80 border border-copper-penny/20 hover:bg-[#FAF5EE] hover:text-[#B87333]'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Opportunities &amp; Job Desk ({jobs.length})</span>
        </button>

        <button
          id="btn-nav-workshops"
          onClick={() => setActiveSection('workshops')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-2 font-mono uppercase tracking-wider ${
            activeSection === 'workshops'
              ? 'bg-[#B87333] text-white shadow-md border border-[#B87333]'
              : 'bg-white text-[#1F1813]/80 border border-copper-penny/20 hover:bg-[#FAF5EE] hover:text-[#B87333]'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Workshop &amp; Event Calendar ({workshops.length})</span>
        </button>

        <button
          id="btn-nav-incubator"
          onClick={() => setActiveSection('incubator')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-2 font-mono uppercase tracking-wider ${
            activeSection === 'incubator'
              ? 'bg-[#B87333] text-white shadow-md border border-[#B87333]'
              : 'bg-white text-[#1F1813]/80 border border-copper-penny/20 hover:bg-[#FAF5EE] hover:text-[#B87333]'
          }`}
        >
          <Download className="w-4 h-4" />
          <span>Digital Incubator Library ({incubatorResources.length})</span>
        </button>

        <button
          id="btn-nav-sc-automated"
          onClick={() => setActiveSection('sc-automated')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-2 font-mono uppercase tracking-wider ${
            activeSection === 'sc-automated'
              ? 'bg-[#1F140E] text-[#D4AF37] shadow-md border-2 border-[#D4AF37]'
              : 'bg-white text-[#1F1813]/80 border border-copper-penny/20 hover:bg-[#FAF5EE] hover:text-[#B87333]'
          }`}
        >
          <Zap className="w-4 h-4 text-[#D4AF37]" />
          <span>⚡ SC Automated &amp; Affiliate Portal</span>
        </button>

        {onNavigateToTreasury && (
          <button
            id="btn-nav-sovereign-treasury-link"
            onClick={onNavigateToTreasury}
            className="px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-2 font-mono uppercase tracking-wider bg-gradient-to-r from-[#1F140E] to-[#2A1D16] text-[#D4AF37] border border-[#D4AF37]/50 hover:border-[#D4AF37] shadow-sm ml-auto"
            title="External Vendor Spotlights & Micropayments"
          >
            <span>⚖️ Sovereign Treasury &amp; Spotlights →</span>
          </button>
        )}
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: MOMMIE BUSINESS DIRECTORY                                      */}
      {/* ========================================================================= */}
      {activeSection === 'directory' && (
        <div className="space-y-5 animate-fade-in">
          {/* Action & Filter Controls */}
          <div className="bg-white border border-[#B87333]/20 rounded-2xl p-4 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1F1813]/40" />
                <input
                  id="input-search-directory"
                  type="text"
                  value={directorySearch}
                  onChange={(e) => setDirectorySearch(e.target.value)}
                  placeholder="Search businesses by keyword, owner, herb, craft..."
                  className="w-full pl-9 pr-4 py-2 bg-[#FAF5EE]/50 border border-copper-penny/25 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#B87333]"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Industry Filter */}
                <select
                  id="select-industry-filter"
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="px-3 py-2 bg-[#FAF5EE]/50 border border-copper-penny/25 rounded-xl text-xs font-medium text-[#1F1813] cursor-pointer"
                >
                  <option value="all">All Industries</option>
                  <option value="Holistic Health">Holistic Health</option>
                  <option value="Agriculture & Homestead">Agriculture &amp; Homestead</option>
                  <option value="Childcare & Education">Childcare &amp; Education</option>
                  <option value="Artisan & Apparel">Artisan &amp; Apparel</option>
                  <option value="Professional Services">Professional Services</option>
                  <option value="Culinary & Pantry">Culinary &amp; Pantry</option>
                </select>

                {/* 50-State Filter */}
                <select
                  id="select-state-filter"
                  value={selectedLocationState}
                  onChange={(e) => {
                    setSelectedLocationState(e.target.value);
                    setSelectedCity('all');
                    setCustomCityInput('');
                  }}
                  className="px-3 py-2 bg-[#FAF5EE]/50 border border-copper-penny/25 rounded-xl text-xs font-medium text-[#1F1813] cursor-pointer"
                >
                  <option value="all">All 50 States</option>
                  {US_STATES_DATA.map(st => (
                    <option key={st.code} value={st.code}>{st.name} ({st.code})</option>
                  ))}
                </select>

                {/* City Filter (Statewide / Willing to Travel by Default) */}
                <select
                  id="select-city-filter"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="px-3 py-2 bg-[#FAF5EE]/50 border border-copper-penny/25 rounded-xl text-xs font-medium text-[#1F1813] cursor-pointer max-w-[200px]"
                >
                  <option value="all">
                    {selectedLocationState === 'all' 
                      ? 'All Cities (Travel OK)' 
                      : `All Cities in ${selectedLocationState} (Statewide)`}
                  </option>
                  {getStateCities(selectedLocationState).map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                  <option value="custom">Type Specific City...</option>
                </select>

                {selectedCity === 'custom' && (
                  <input
                    type="text"
                    value={customCityInput}
                    onChange={(e) => setCustomCityInput(e.target.value)}
                    placeholder="Enter city name..."
                    className="px-3 py-2 bg-[#FAF5EE]/50 border border-copper-penny/25 rounded-xl text-xs text-[#1F1813] w-36 focus:outline-none focus:ring-1 focus:ring-[#B87333]"
                  />
                )}

                {/* Online toggle */}
                <label className="flex items-center space-x-1.5 px-3 py-2 bg-[#FAF5EE]/50 border border-copper-penny/25 rounded-xl text-xs cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={onlyOnline}
                    onChange={(e) => setOnlyOnline(e.target.checked)}
                    className="accent-[#B87333]"
                  />
                  <span>Online / Shipped</span>
                </label>

                {/* Register Business Triggers */}
                <button
                  id="btn-open-register-unified-biz"
                  onClick={() => {
                    setUnifiedModalCategory('business');
                    setIsUnifiedCreateModalOpen(true);
                  }}
                  className="px-4 py-2 bg-[#D4AF37] hover:bg-[#B87333] hover:text-white text-[#1F1813] rounded-xl text-xs font-mono font-extrabold uppercase tracking-wider transition-all flex items-center space-x-1.5 shadow-sm cursor-pointer"
                  title="Register business with multi-photo gallery, perks, and dual-sync with Village Commons"
                >
                  <Plus className="w-4 h-4" />
                  <span>Register Sister Business (with Photos)</span>
                </button>
                <button
                  id="btn-open-register-biz"
                  onClick={() => setIsRegisterModalOpen(true)}
                  className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-[#1F1813] rounded-xl text-xs font-mono font-bold transition-all cursor-pointer"
                  title="Quick text registration"
                >
                  <span>Quick Form</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#1F1813]/60 pt-1 border-t border-copper-penny/10 font-mono">
              <span>Showing {filteredBusinesses.length + filteredUnifiedBusinesses.length} verified member ventures ({filteredUnifiedBusinesses.length} photo showcases)</span>
              <span>{savedBusinesses.length} saved to my rolodex</span>
            </div>
          </div>

          {/* Featured Multi-Photo Sister Business Showcases (Dual-Synced with Commons) */}
          {filteredUnifiedBusinesses.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-copper-penny/15 pb-2">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  <h4 className="font-serif font-black text-base text-[#1F1813]">
                    ⭐ Featured Multi-Photo Sister Enterprises ({filteredUnifiedBusinesses.length})
                  </h4>
                </div>
                {onNavigateToCommons && (
                  <button
                    type="button"
                    onClick={() => onNavigateToCommons('businesses')}
                    className="text-xs font-mono text-[#B87333] hover:underline flex items-center space-x-1 font-bold cursor-pointer"
                  >
                    <span>View in Village Commons</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredUnifiedBusinesses.map(biz => renderUnifiedCard(biz, 'directory'))}
              </div>
            </div>
          )}

          {/* Business Cards Grid */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-[#1F1813] border-b border-copper-penny/10 pb-1">
              Member Directory Rolodex ({filteredBusinesses.length})
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredBusinesses.map((biz) => {
              const isSaved = savedBusinesses.includes(biz.id);
              return (
                <div
                  key={biz.id}
                  className="bg-white border border-[#B87333]/20 hover:border-[#B87333]/50 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    {/* Card Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <span className="inline-block px-2.5 py-0.5 bg-[#FAF5EE] text-[#B87333] border border-[#B87333]/25 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
                          {biz.industry}
                        </span>
                        <h3 className="font-serif font-extrabold text-lg text-[#1F1813] group-hover:text-[#B87333] transition-colors">
                          {biz.name}
                        </h3>
                        <p className="text-xs text-[#1F1813]/70 flex items-center space-x-1">
                          <span>Owner:</span>
                          <strong className="text-[#1F1813] font-semibold">{biz.ownerName}</strong>
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] inline" />
                        </p>
                      </div>

                      <button
                        onClick={() => toggleSaveBusiness(biz.id)}
                        title={isSaved ? "Remove from saved" : "Save to rolodex"}
                        className={`p-2 rounded-xl transition-all cursor-pointer ${
                          isSaved 
                            ? 'bg-[#B87333] text-white' 
                            : 'bg-[#FAF5EE] text-[#1F1813]/50 hover:text-[#B87333] hover:bg-[#FAF5EE]/80'
                        }`}
                      >
                        <Bookmark className="w-4 h-4 fill-current" />
                      </button>
                    </div>

                    {/* Location Badge */}
                    <div className="flex items-center space-x-2 text-[11px] text-[#1F1813]/75 font-mono">
                      <MapPin className="w-3.5 h-3.5 text-[#B87333] shrink-0" />
                      <span>{biz.city}, {biz.locationState}</span>
                      {biz.isOnline && (
                        <span className="text-[#D4AF37] font-bold">• Online Shipping Available</span>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-xs text-[#2A221B]/85 leading-relaxed">
                      {biz.description}
                    </p>

                    {/* Sisterhood Offer Box */}
                    {biz.communityOffer && (
                      <div className="bg-[#FAF5EE] border border-dashed border-[#D4AF37]/60 rounded-xl p-2.5 text-[11px] text-[#1F1813]/90 leading-normal">
                        {biz.communityOffer}
                      </div>
                    )}

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {biz.tags.map((tag, idx) => (
                        <span 
                          key={idx}
                          className="text-[10px] font-mono text-[#1F1813]/70 bg-stone-100 px-2 py-0.5 rounded-md"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="pt-3 border-t border-copper-penny/10 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        showToast(`📬 Connect message dispatched to ${biz.ownerName} via The Copper Circle!`);
                      }}
                      className="flex-1 bg-[#1F1813] hover:bg-[#B87333] text-[#FAF5EE] text-xs font-mono font-bold py-2 rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <span>Connect / Order</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    {biz.website && (
                      <a
                        href={biz.website}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 border border-copper-penny/25 rounded-xl hover:bg-[#FAF5EE] text-[#1F1813] transition-all"
                        title="Visit external storefront"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

          {filteredBusinesses.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-[#B87333]/30 p-8 space-y-3">
              <Store className="w-10 h-10 text-[#B87333]/50 mx-auto" />
              <h4 className="font-serif font-bold text-base text-[#1F1813]">No Businesses Found</h4>
              <p className="text-xs text-[#1F1813]/70 max-w-sm mx-auto">
                No verified ventures match your current search filters. Try broadening your terms or register your own business.
              </p>
              <button
                onClick={() => {
                  setDirectorySearch('');
                  setSelectedIndustry('all');
                  setSelectedLocationState('all');
                  setOnlyOnline(false);
                }}
                className="px-4 py-2 bg-[#FAF5EE] text-[#B87333] border border-[#B87333]/30 rounded-xl text-xs font-mono font-bold cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: OPPORTUNITIES & JOB DESK                                       */}
      {/* ========================================================================= */}
      {activeSection === 'opportunities' && (
        <div className="space-y-5 animate-fade-in">
          {/* Desk Filter Bar */}
          <div className="bg-white border border-[#B87333]/20 rounded-2xl p-4 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1F1813]/40" />
                <input
                  id="input-search-jobs"
                  type="text"
                  value={jobSearch}
                  onChange={(e) => setJobSearch(e.target.value)}
                  placeholder="Search gigs, doula contracts, homeschool teaching..."
                  className="w-full pl-9 pr-4 py-2 bg-[#FAF5EE]/50 border border-copper-penny/25 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#B87333]"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  id="select-job-type"
                  value={jobTypeFilter}
                  onChange={(e) => setJobTypeFilter(e.target.value)}
                  className="px-3 py-2 bg-[#FAF5EE]/50 border border-copper-penny/25 rounded-xl text-xs font-medium text-[#1F1813] cursor-pointer"
                >
                  <option value="all">All Work Types</option>
                  <option value="Gig Work">Gig Work</option>
                  <option value="Contract">Contract</option>
                  <option value="Part-Time">Part-Time</option>
                  <option value="Full-Time">Full-Time</option>
                  <option value="Trade Exchange">Trade Exchange</option>
                </select>

                <select
                  id="select-job-category"
                  value={jobCategoryFilter}
                  onChange={(e) => setJobCategoryFilter(e.target.value)}
                  className="px-3 py-2 bg-[#FAF5EE]/50 border border-copper-penny/25 rounded-xl text-xs font-medium text-[#1F1813] cursor-pointer"
                >
                  <option value="all">All Categories</option>
                  <option value="Childcare & Doula">Childcare &amp; Doula</option>
                  <option value="Homestead & Farm">Homestead &amp; Farm</option>
                  <option value="Digital & Tech">Digital &amp; Tech</option>
                  <option value="Creative & Artisan">Creative &amp; Artisan</option>
                  <option value="Admin & Operations">Admin &amp; Operations</option>
                  <option value="Culinary & Kitchen">Culinary &amp; Kitchen</option>
                </select>

                <label className="flex items-center space-x-1.5 px-3 py-2 bg-[#FAF5EE]/50 border border-copper-penny/25 rounded-xl text-xs cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={jobRemoteOnly}
                    onChange={(e) => setJobRemoteOnly(e.target.checked)}
                    className="accent-[#B87333]"
                  />
                  <span>Remote Only</span>
                </label>

                <button
                  id="btn-open-post-job"
                  onClick={() => setIsPostJobModalOpen(true)}
                  className="px-4 py-2 bg-[#D4AF37] hover:bg-[#B87333] hover:text-white text-[#1F1813] rounded-xl text-xs font-mono font-extrabold uppercase tracking-wider transition-all flex items-center space-x-1.5 shadow-sm cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Post An Opportunity</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#1F1813]/60 pt-1 border-t border-copper-penny/10 font-mono">
              <span>{filteredJobs.length} vetted opportunities posted specifically for Copper Mommies</span>
              <span>{appliedJobs.length} interest inquiries submitted</span>
            </div>
          </div>

          {/* Job Listings List */}
          <div className="space-y-4">
            {filteredJobs.map((job) => {
              const hasApplied = appliedJobs.includes(job.id);
              return (
                <div
                  key={job.id}
                  className="bg-white border border-[#B87333]/20 hover:border-[#B87333]/45 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 bg-[#B87333]/15 text-[#B87333] rounded-full text-[10px] font-mono font-bold uppercase">
                          {job.type}
                        </span>
                        <span className="px-2.5 py-0.5 bg-[#FAF5EE] text-[#1F1813]/80 border border-copper-penny/20 rounded-full text-[10px] font-mono font-bold">
                          {job.category}
                        </span>
                        {job.isRemote ? (
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-[10px] font-mono font-bold">
                            🌐 100% Remote
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-md text-[10px] font-mono font-bold flex items-center space-x-1">
                            <MapPin className="w-3 h-3 inline" />
                            <span>{job.locationState} In-Person</span>
                          </span>
                        )}
                      </div>

                      <h3 className="font-serif font-extrabold text-xl text-[#1F1813]">
                        {job.title}
                      </h3>

                      <p className="text-xs text-[#1F1813]/70 font-mono">
                        Posted by: <span className="font-bold text-[#1F1813]">{job.postedBy}</span>
                        {job.businessName && ` (${job.businessName})`} • Posted: {job.createdAt}
                      </p>
                    </div>

                    {/* Compensation Box */}
                    <div className="sm:text-right bg-[#FAF5EE] border border-[#D4AF37]/50 rounded-xl p-3 sm:shrink-0">
                      <span className="text-[10px] font-mono uppercase text-[#B87333] font-bold block">Compensation</span>
                      <span className="text-sm font-mono font-black text-[#1F1813]">{job.compensation}</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#2A221B]/85 leading-relaxed">
                    {job.description}
                  </p>

                  {/* Requirements List */}
                  {job.requirements.length > 0 && (
                    <div className="bg-stone-50 rounded-xl p-3 space-y-1.5 border border-stone-200/60">
                      <span className="text-[10px] font-mono font-bold text-[#1F1813]/70 uppercase tracking-wider block">
                        Core Requirements &amp; Fit:
                      </span>
                      <ul className="space-y-1 text-xs text-[#2A221B]/80">
                        {job.requirements.map((req, i) => (
                          <li key={i} className="flex items-start space-x-2">
                            <span className="text-[#B87333] font-bold">•</span>
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Actions Bar */}
                  <div className="pt-2 border-t border-copper-penny/10 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center space-x-2 text-xs text-[#1F1813]/60 font-mono">
                      <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                      <span>Vetted sisterhood listing • Safe direct payment &amp; trade</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          showToast(`Copied opportunity link to clipboard!`);
                        }}
                        className="px-3 py-1.5 border border-copper-penny/25 rounded-xl hover:bg-[#FAF5EE] text-xs font-mono text-[#1F1813] cursor-pointer"
                        title="Share listing"
                      >
                        <Share2 className="w-3.5 h-3.5 inline mr-1" />
                        <span>Share</span>
                      </button>

                      <button
                        id={`btn-apply-job-${job.id}`}
                        onClick={() => handleApplyJob(job)}
                        className={`px-5 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center space-x-1.5 cursor-pointer ${
                          hasApplied
                            ? 'bg-emerald-800 text-white shadow-xs'
                            : 'bg-[#B87333] hover:bg-[#1F1813] text-white shadow-sm'
                        }`}
                      >
                        {hasApplied ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Interest Submitted</span>
                          </>
                        ) : (
                          <>
                            <span>Express Interest / Apply</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 3: WORKSHOP & EVENT CALENDAR                                      */}
      {/* ========================================================================= */}
      {activeSection === 'workshops' && (
        <div className="space-y-5 animate-fade-in">
          {/* Format Selector Bar */}
          <div className="bg-white border border-[#B87333]/20 rounded-2xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'all', label: 'All Gatherings' },
                { id: 'Virtual Masterclass', label: 'Virtual Masterclasses' },
                { id: 'Offline Trade Fair', label: 'Offline Trade Fairs' },
                { id: 'Financial Workshop', label: 'Financial Workshops' },
                { id: 'Pop-up Market', label: 'Pop-Up Markets' }
              ].map((fmt) => (
                <button
                  key={fmt.id}
                  onClick={() => setEventFormatFilter(fmt.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                    eventFormatFilter === fmt.id
                      ? 'bg-[#B87333] text-white shadow-xs'
                      : 'bg-[#FAF5EE] text-[#1F1813]/70 hover:text-[#B87333]'
                  }`}
                >
                  {fmt.label}
                </button>
              ))}
            </div>

            <div className="text-xs font-mono text-[#1F1813]/60">
              <span>{rsvpedEvents.length} events marked on your schedule</span>
            </div>
          </div>

          {/* Events Timeline / Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredWorkshops.map((event) => {
              const isRsvped = rsvpedEvents.includes(event.id);
              return (
                <div
                  key={event.id}
                  className="bg-white border-2 border-[#B87333]/20 hover:border-[#B87333]/50 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    {/* Date / Format Pill */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-3 py-1 bg-[#FAF5EE] border border-[#D4AF37]/50 text-[#B87333] rounded-full text-xs font-mono font-extrabold flex items-center space-x-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{event.date}</span>
                      </span>

                      <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase ${
                        event.isVirtual 
                          ? 'bg-blue-50 text-blue-800 border border-blue-200' 
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {event.format}
                      </span>
                    </div>

                    <h3 className="font-serif font-extrabold text-xl text-[#1F1813] leading-snug">
                      {event.title}
                    </h3>

                    <div className="space-y-1 text-xs text-[#1F1813]/75 font-mono">
                      <p className="flex items-center space-x-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#B87333]" />
                        <span>{event.time}</span>
                      </p>
                      <p className="flex items-center space-x-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#B87333]" />
                        <span>{event.location}</span>
                      </p>
                      <p className="text-[11px] text-[#B87333] font-bold">
                        Facilitator: {event.instructor}
                      </p>
                    </div>

                    <p className="text-xs text-[#2A221B]/85 leading-relaxed pt-1">
                      {event.description}
                    </p>

                    {/* Topics */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {event.topics.map((t, idx) => (
                        <span key={idx} className="text-[10px] font-mono bg-stone-100 text-[#1F1813]/80 px-2 py-0.5 rounded">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Footer & RSVP */}
                  <div className="pt-3 border-t border-copper-penny/10 flex items-center justify-between gap-3">
                    <div className="flex items-center space-x-1.5 text-xs text-[#1F1813]/70 font-mono">
                      <Users className="w-4 h-4 text-[#D4AF37]" />
                      <span>{event.rsvpCount} Sisters Attending</span>
                    </div>

                    <button
                      id={`btn-rsvp-${event.id}`}
                      onClick={() => toggleRsvp(event.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center space-x-1.5 cursor-pointer ${
                        isRsvped
                          ? 'bg-[#D4AF37] text-[#1F1813] border border-[#D4AF37] shadow-sm'
                          : 'bg-[#1F1813] hover:bg-[#B87333] text-white shadow-xs'
                      }`}
                    >
                      {isRsvped ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-[#1F1813]" />
                          <span>RSVP Confirmed</span>
                        </>
                      ) : (
                        <>
                          <span>RSVP Free Seat</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 4: DIGITAL INCUBATOR LIBRARY                                      */}
      {/* ========================================================================= */}
      {activeSection === 'incubator' && (
        <div className="space-y-5 animate-fade-in">
          {/* Category Filter Bar */}
          <div className="bg-white border border-[#B87333]/20 rounded-2xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'all', label: 'All Blueprints' },
                { id: 'Business Formation', label: 'Business Formation' },
                { id: 'Financial Sovereignty', label: 'Financial Self-Reliance' },
                { id: 'Digital Asset Creation', label: 'Digital Assets' },
                { id: 'Automated Workflows', label: 'Automated Workflows' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setIncubatorCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                    incubatorCategory === cat.id
                      ? 'bg-[#B87333] text-white shadow-xs'
                      : 'bg-[#FAF5EE] text-[#1F1813]/70 hover:text-[#B87333]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="text-xs font-mono text-[#1F1813]/60">
              <span>{downloadedResources.length} blueprints saved to device</span>
            </div>
          </div>

          {/* Resources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredResources.map((res) => {
              const isDownloaded = downloadedResources.includes(res.id);
              return (
                <div
                  key={res.id}
                  className="bg-white border border-[#B87333]/20 hover:border-[#B87333]/50 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 bg-[#FAF5EE] text-[#B87333] border border-[#B87333]/20 rounded-md text-[10px] font-mono font-bold uppercase">
                        {res.category}
                      </span>
                      <span className="text-[10px] font-mono text-[#1F1813]/60 font-bold">
                        {res.format} • {res.downloadSize}
                      </span>
                    </div>

                    <h3 className="font-serif font-extrabold text-lg text-[#1F1813] group-hover:text-[#B87333] transition-colors leading-snug">
                      {res.title}
                    </h3>

                    <p className="text-xs text-[#2A221B]/85 leading-relaxed">
                      {res.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-copper-penny/10 flex items-center justify-between">
                    <div className="flex items-center space-x-1.5 text-[11px] font-mono text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>100% Free Member Asset</span>
                    </div>

                    <button
                      id={`btn-download-${res.id}`}
                      onClick={() => handleDownloadResource(res)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center space-x-1.5 cursor-pointer ${
                        isDownloaded
                          ? 'bg-emerald-800 text-white'
                          : 'bg-[#1F1813] hover:bg-[#B87333] text-white shadow-xs'
                      }`}
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{isDownloaded ? 'Saved' : res.actionLabel}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 5: SC AUTOMATED SOLUTIONS & MOTHERHOOD AFFILIATE PORTAL           */}
      {/* ========================================================================= */}
      {activeSection === 'sc-automated' && (
        <div className="space-y-6 animate-fade-in">
          <SCAutomatedPortal
            userName={userName}
            selectedState={selectedState}
            onShowToast={showToast}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: REGISTER MOMMIE BUSINESS                                           */}
      {/* ========================================================================= */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FAF5EE] border-2 border-[#B87333] rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-[#B87333]/20 pb-3">
              <div className="flex items-center space-x-2">
                <Store className="w-5 h-5 text-[#B87333]" />
                <h3 className="font-serif font-extrabold text-xl text-[#1F1813]">
                  Register Your Mommie Business
                </h3>
              </div>
              <button
                onClick={() => setIsRegisterModalOpen(false)}
                className="p-1 rounded-lg text-[#1F1813]/60 hover:text-[#1F1813] hover:bg-black/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterBusiness} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-mono font-bold text-[11px] uppercase text-[#1F1813] mb-1">
                  Business / Venture Name *
                </label>
                <input
                  type="text"
                  required
                  value={newBiz.name}
                  onChange={(e) => setNewBiz({ ...newBiz, name: e.target.value })}
                  placeholder="e.g., Honeycomb Kitchen Botanicals"
                  className="w-full px-3 py-2 bg-white border border-[#B87333]/30 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#B87333]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono font-bold text-[11px] uppercase text-[#1F1813] mb-1">
                    Industry *
                  </label>
                  <select
                    value={newBiz.industry}
                    onChange={(e) => setNewBiz({ ...newBiz, industry: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white border border-[#B87333]/30 rounded-xl"
                  >
                    <option value="Holistic Health">Holistic Health</option>
                    <option value="Agriculture & Homestead">Agriculture &amp; Homestead</option>
                    <option value="Childcare & Education">Childcare &amp; Education</option>
                    <option value="Artisan & Apparel">Artisan &amp; Apparel</option>
                    <option value="Professional Services">Professional Services</option>
                    <option value="Culinary & Pantry">Culinary &amp; Pantry</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono font-bold text-[11px] uppercase text-[#1F1813] mb-1">
                    Owner Name
                  </label>
                  <input
                    type="text"
                    value={newBiz.ownerName}
                    onChange={(e) => setNewBiz({ ...newBiz, ownerName: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#B87333]/30 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono font-bold text-[11px] uppercase text-[#1F1813] mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={newBiz.city}
                    onChange={(e) => setNewBiz({ ...newBiz, city: e.target.value })}
                    placeholder="e.g., Savannah"
                    className="w-full px-3 py-2 bg-white border border-[#B87333]/30 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-mono font-bold text-[11px] uppercase text-[#1F1813] mb-1">
                    State
                  </label>
                  <select
                    value={newBiz.locationState}
                    onChange={(e) => setNewBiz({ ...newBiz, locationState: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#B87333]/30 rounded-xl"
                  >
                    {US_STATES_DATA.map(st => (
                      <option key={st.code} value={st.code}>{st.name} ({st.code})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-mono font-bold text-[11px] uppercase text-[#1F1813] mb-1">
                  Description of Offerings &amp; Craft *
                </label>
                <textarea
                  required
                  rows={3}
                  value={newBiz.description}
                  onChange={(e) => setNewBiz({ ...newBiz, description: e.target.value })}
                  placeholder="Describe your products, natural ingredients, or services..."
                  className="w-full px-3 py-2 bg-white border border-[#B87333]/30 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#B87333]"
                />
              </div>

              <div>
                <label className="block font-mono font-bold text-[11px] uppercase text-[#1F1813] mb-1">
                  Special Sisterhood Discount or Barter Offer
                </label>
                <input
                  type="text"
                  value={newBiz.communityOffer}
                  onChange={(e) => setNewBiz({ ...newBiz, communityOffer: e.target.value })}
                  placeholder="e.g., 15% discount for Copper Mommies or open to barter for dried herbs"
                  className="w-full px-3 py-2 bg-white border border-[#B87333]/30 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-mono font-bold text-[11px] uppercase text-[#1F1813] mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={newBiz.tags}
                  onChange={(e) => setNewBiz({ ...newBiz, tags: e.target.value })}
                  placeholder="Herbalism, Tinctures, Handmade, Organic"
                  className="w-full px-3 py-2 bg-white border border-[#B87333]/30 rounded-xl"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="chk-online"
                  checked={newBiz.isOnline}
                  onChange={(e) => setNewBiz({ ...newBiz, isOnline: e.target.checked })}
                  className="accent-[#B87333]"
                />
                <label htmlFor="chk-online" className="text-xs text-[#1F1813]">
                  Ships orders online nationwide
                </label>
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2 border-t border-[#B87333]/20">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="px-4 py-2 border border-[#B87333]/30 rounded-xl text-xs font-mono font-bold text-[#1F1813] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#B87333] hover:bg-[#1F1813] text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider shadow-md cursor-pointer"
                >
                  Publish To Directory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: POST AN OPPORTUNITY                                                */}
      {/* ========================================================================= */}
      {isPostJobModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FAF5EE] border-2 border-[#B87333] rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-[#B87333]/20 pb-3">
              <div className="flex items-center space-x-2">
                <Briefcase className="w-5 h-5 text-[#B87333]" />
                <h3 className="font-serif font-extrabold text-xl text-[#1F1813]">
                  Post An Opportunity to the Job Desk
                </h3>
              </div>
              <button
                onClick={() => setIsPostJobModalOpen(false)}
                className="p-1 rounded-lg text-[#1F1813]/60 hover:text-[#1F1813] hover:bg-black/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePostJob} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-mono font-bold text-[11px] uppercase text-[#1F1813] mb-1">
                  Opportunity Title *
                </label>
                <input
                  type="text"
                  required
                  value={newJob.title}
                  onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                  placeholder="e.g., Weekend Homestead Seed Threshing Assistant"
                  className="w-full px-3 py-2 bg-white border border-[#B87333]/30 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#B87333]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono font-bold text-[11px] uppercase text-[#1F1813] mb-1">
                    Work Type *
                  </label>
                  <select
                    value={newJob.type}
                    onChange={(e) => setNewJob({ ...newJob, type: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white border border-[#B87333]/30 rounded-xl"
                  >
                    <option value="Gig Work">Gig Work</option>
                    <option value="Contract">Contract</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Full-Time">Full-Time</option>
                    <option value="Trade Exchange">Trade Exchange</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono font-bold text-[11px] uppercase text-[#1F1813] mb-1">
                    Category *
                  </label>
                  <select
                    value={newJob.category}
                    onChange={(e) => setNewJob({ ...newJob, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white border border-[#B87333]/30 rounded-xl"
                  >
                    <option value="Childcare & Doula">Childcare &amp; Doula</option>
                    <option value="Homestead & Farm">Homestead &amp; Farm</option>
                    <option value="Digital & Tech">Digital &amp; Tech</option>
                    <option value="Creative & Artisan">Creative &amp; Artisan</option>
                    <option value="Admin & Operations">Admin &amp; Operations</option>
                    <option value="Culinary & Kitchen">Culinary &amp; Kitchen</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono font-bold text-[11px] uppercase text-[#1F1813] mb-1">
                    Compensation (Cash or Barter) *
                  </label>
                  <input
                    type="text"
                    required
                    value={newJob.compensation}
                    onChange={(e) => setNewJob({ ...newJob, compensation: e.target.value })}
                    placeholder="e.g., $25/hr or 2 Time-Credits/hr"
                    className="w-full px-3 py-2 bg-white border border-[#B87333]/30 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-mono font-bold text-[11px] uppercase text-[#1F1813] mb-1">
                    Location / State
                  </label>
                  <select
                    value={newJob.locationState}
                    onChange={(e) => setNewJob({ ...newJob, locationState: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#B87333]/30 rounded-xl"
                  >
                    <option value="GA">Georgia (GA)</option>
                    <option value="NC">North Carolina (NC)</option>
                    <option value="SC">South Carolina (SC)</option>
                    <option value="AL">Alabama (AL)</option>
                    <option value="FL">Florida (FL)</option>
                    <option value="Nationwide">Nationwide</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-mono font-bold text-[11px] uppercase text-[#1F1813] mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={newJob.description}
                  onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                  placeholder="Detail the scope of work, hours, and maternal scheduling flexibility..."
                  className="w-full px-3 py-2 bg-white border border-[#B87333]/30 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#B87333]"
                />
              </div>

              <div>
                <label className="block font-mono font-bold text-[11px] uppercase text-[#1F1813] mb-1">
                  Key Requirements (One per line)
                </label>
                <textarea
                  rows={2}
                  value={newJob.requirements}
                  onChange={(e) => setNewJob({ ...newJob, requirements: e.target.value })}
                  placeholder="Dependable morning availability&#10;Comfortable working around children"
                  className="w-full px-3 py-2 bg-white border border-[#B87333]/30 rounded-xl"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="chk-remote"
                  checked={newJob.isRemote}
                  onChange={(e) => setNewJob({ ...newJob, isRemote: e.target.checked })}
                  className="accent-[#B87333]"
                />
                <label htmlFor="chk-remote" className="text-xs text-[#1F1813]">
                  This role can be performed 100% remotely from home
                </label>
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2 border-t border-[#B87333]/20">
                <button
                  type="button"
                  onClick={() => setIsPostJobModalOpen(false)}
                  className="px-4 py-2 border border-[#B87333]/30 rounded-xl text-xs font-mono font-bold text-[#1F1813] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#B87333] hover:bg-[#1F1813] text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider shadow-md cursor-pointer"
                >
                  Publish Opportunity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CREATE UNIFIED LISTING (GIG, EVENT, BUSINESS)                       */}
      {/* ========================================================================= */}
      <CreateUnifiedListingModal
        isOpen={isUnifiedCreateModalOpen}
        onClose={() => setIsUnifiedCreateModalOpen(false)}
        userName={userName}
        selectedState={selectedState}
        initialCategory={unifiedModalCategory}
        onListingCreated={(newListing) => {
          setUnifiedListings(getStoredUnifiedListings());
          showToast(`✨ Successfully published "${newListing.title}" across Village Commons & Commerce Hub!`);
        }}
        showToast={showToast}
      />

      {/* ========================================================================= */}
      {/* MODAL: TRADE HANDSHAKE & BARTER WORKFLOW                                  */}
      {/* ========================================================================= */}
      {isTradeModalOpen && (
        <TradeHandshakeModal
          isOpen={isTradeModalOpen}
          onClose={() => {
            setIsTradeModalOpen(false);
            setActiveTradeListing(null);
            setActiveTradeRecord(null);
          }}
          listing={activeTradeListing}
          existingTrade={activeTradeRecord}
          userName={userName}
          selectedState={selectedState}
          onTradeUpdated={(trade) => {
            setAllTrades(getStoredTrades());
            showToast(`🤝 Trade handshake successfully updated for "${activeTradeListing?.title}"!`);
          }}
          showToast={showToast}
        />
      )}

      {/* ========================================================================= */}
      {/* PHOTO LIGHTBOX MODAL                                                      */}
      {/* ========================================================================= */}
      {photoLightboxUrl && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setPhotoLightboxUrl(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setPhotoLightboxUrl(null)}
              className="absolute -top-12 right-0 p-2 text-white hover:text-[#D4AF37] bg-black/50 rounded-xl cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <img 
              src={photoLightboxUrl} 
              alt="Enlarged Showcase View" 
              className="w-full max-h-[85vh] object-contain rounded-2xl border-2 border-[#D4AF37]/50 shadow-2xl bg-black"
            />
          </div>
        </div>
      )}

    </div>
  );
}
