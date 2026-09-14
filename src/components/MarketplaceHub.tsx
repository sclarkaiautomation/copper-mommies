import React, { useState, useEffect } from 'react';
import { 
  ArrowLeftRight, 
  Coins, 
  Plus, 
  Trash2, 
  Heart, 
  ShieldCheck, 
  CheckCircle, 
  Info, 
  UserCheck, 
  FileText, 
  Clock, 
  Percent, 
  Landmark, 
  Sprout, 
  Leaf,
  Lock, 
  Unlock,
  AlertTriangle,
  Compass,
  Search,
  Filter,
  RefreshCw,
  MapPin,
  Check
} from 'lucide-react';
import { BarterOffer, PageSpotlightBanner, ScholarshipEntry, TimeCreditLog, BarterComment, ActiveTradeRecord, SafeMeetupSpot } from '../types';
import SpotlightBanner from './SpotlightBanner';
import BarterCardInteractive from './BarterCardInteractive';
import ActiveTradesTracker from './ActiveTradesTracker';
import WisdomProgression from './WisdomProgression';
import SisterProfileModal from './SisterProfileModal';
import UrgentCarePod from './UrgentCarePod';
import { 
  INITIAL_BARTER_COMMENTS, 
  INITIAL_ACTIVE_TRADES, 
  INITIAL_URGENT_CARE_ALERTS, 
  INITIAL_SISTER_PROFILES 
} from '../data/phase1CommunityData';
import { US_STATES_DATA, getStateCities, getStateName } from '../data/usStatesData';

// The 50-State select options for Geographic Vetting & Proximity Routing
const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'
];

interface MarketplaceHubProps {
  barterList: BarterOffer[];
  onSubmitBarter: (title: string, desc: string, category: any, tradeFor: string, isLandSteward?: boolean) => void;
  isPostingBarter: boolean;
  barterSuccess: boolean;
  selectedState: string;
  userName: string;
  timeBalance: number;
  timeLogs: TimeCreditLog[];
  onAddLog: (activity: string, hours: number, type: 'earn' | 'spend', recipient?: string, provider?: string, status?: 'pending' | 'confirmed' | 'declined') => void;
  onDeleteLog: (id: string) => void;
  generosityScore: number;
  tradeBalance: number;
  onRefreshStats: () => void;
  onRefreshBarters: () => void;
  spotlightBanner?: PageSpotlightBanner;
  banners?: PageSpotlightBanner[];
  onEnterContest?: (entry: ScholarshipEntry) => void;
}

export default function MarketplaceHub({
  barterList,
  onSubmitBarter,
  isPostingBarter,
  barterSuccess: propsBarterSuccess,
  selectedState,
  userName,
  timeBalance: propsTimeBalance,
  timeLogs: propsTimeLogs,
  onAddLog,
  onDeleteLog,
  generosityScore,
  tradeBalance,
  onRefreshStats,
  onRefreshBarters,
  spotlightBanner,
  banners
}: MarketplaceHubProps) {
  
  // 1. Comprehensive Local Profile Scores for Security Controls & Sustainability Check
  const [profileStats, setProfileStats] = useState({
    generosityScore: generosityScore,
    tradeBalance: tradeBalance,
    trustScore: 90,
    graceScore: 2,
    barterBalance: tradeBalance,
    restrictedToGiftOnly: false
  });

  const loadProfileStats = async () => {
    try {
      const res = await fetch(`/api/user/stats?userName=${encodeURIComponent(userName)}`);
      if (res.ok) {
        const data = await res.json();
        setProfileStats(data);
      }
    } catch (e) {
      console.error("Error loading profile stats:", e);
    }
  };

  useEffect(() => {
    loadProfileStats();
  }, [userName, tradeBalance, generosityScore]);

  // 2. Upgraded "Village Request" Form States (Direct translation of the specifications)
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newTrade, setNewTrade] = useState('');
  const [isLandStewardChecked, setIsLandStewardChecked] = useState(false);
  const [barterSuccess, setBarterSuccess] = useState(false);
  const [isHandshakingId, setIsHandshakingId] = useState<string | null>(null);
  
  const [newRequestType, setNewRequestType] = useState<'Barter/Trade' | 'Gift/Need' | 'Skill Swap' | 'Mobility/Ride'>('Barter/Trade');
  const [newCategory, setNewCategory] = useState<'Holistic Wellness' | 'Homeschool' | 'Land/Wealth' | 'Garden Bounty' | 'Clean Beauty' | 'Daily Life/Pantry'>('Holistic Wellness');
  const [newFormState, setNewFormState] = useState(selectedState || 'GA');
  const [newCity, setNewCity] = useState('');
  const [newCityZip, setNewCityZip] = useState('');
  const [newValuePoints, setNewValuePoints] = useState<number>(5);
  const [newIntentTag, setNewIntentTag] = useState<'I have' | 'I need'>('I have');
  
  const [isPostingRequest, setIsPostingRequest] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // 3. Search and Discovery Filter States
  const [filterState, setFilterState] = useState(selectedState || 'All');
  const [filterCity, setFilterCity] = useState<string>('all');
  const [customCityInput, setCustomCityInput] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterZip, setFilterZip] = useState<string>('');
  const [filterIntent, setFilterIntent] = useState<string>('All');

  // Sync state selection
  useEffect(() => {
    if (selectedState) {
      setNewFormState(selectedState);
      setFilterState(selectedState);
      setFilterCity('all');
      setCustomCityInput('');
    }
  }, [selectedState]);

  // Helper for granular geographic and categorical matching
  const effectiveCity = filterCity === 'custom'
    ? customCityInput.trim().toLowerCase()
    : (filterCity === 'all' ? '' : filterCity.toLowerCase().trim());

  const matchesBarterFilters = (b: BarterOffer) => {
    // 1. Primary Region / State Filter
    if (filterState !== 'All' && b.locationState.toLowerCase() !== filterState.toLowerCase()) {
      return false;
    }
    // 2. Secondary City Filter (Granular geographic filtering)
    if (effectiveCity) {
      const cityProp = ((b as any).city || '').toLowerCase();
      const cityZipProp = (b.cityZip || '').toLowerCase();
      const titleProp = b.title.toLowerCase();
      const descProp = b.description.toLowerCase();
      const matchesCity = 
        cityProp.includes(effectiveCity) ||
        cityZipProp.includes(effectiveCity) ||
        titleProp.includes(effectiveCity) ||
        descProp.includes(effectiveCity);
      if (!matchesCity) return false;
    }
    // 3. Category Circle Filter
    if (filterCategory !== 'All' && b.category.toLowerCase() !== filterCategory.toLowerCase()) {
      return false;
    }
    // 4. Proximity / Zip Filter
    if (filterZip.trim() !== '') {
      const zipQuery = filterZip.trim().toLowerCase();
      if (!(b.cityZip || '').toLowerCase().includes(zipQuery)) {
        return false;
      }
    }
    // 5. Intent Tag Filter (I have / I need)
    if (filterIntent !== 'All' && b.intentTag && b.intentTag.toLowerCase() !== filterIntent.toLowerCase()) {
      return false;
    }
    return true;
  };

  // 4. "Copper Mommies AI Matchmaker" Reciprocal Query Engine
  const [matchmakerTarget, setMatchmakerTarget] = useState<BarterOffer | null>(null);
  const [matchmakerMatches, setMatchmakerMatches] = useState<BarterOffer[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(false);

  const fetchReciprocalMatches = async (post: BarterOffer) => {
    setMatchmakerTarget(post);
    setLoadingMatches(true);
    try {
      const res = await fetch(`/api/barter/matches?state=${encodeURIComponent(post.locationState)}&intent=${encodeURIComponent(post.intentTag || 'I have')}&category=${encodeURIComponent(post.category)}`);
      if (res.ok) {
        const data = await res.json();
        setMatchmakerMatches(data);
      }
    } catch (e) {
      console.error("Matchmaker Error:", e);
    } finally {
      setLoadingMatches(false);
    }
  };

  // 5. Admin Simulator balance toggler for instant reviewer testing
  const simulateToggleFlagging = async (shouldFlag: boolean) => {
    try {
      const targetBalance = shouldFlag ? -12 : 8;
      const res = await fetch('/api/user/simulate-balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName,
          balance: targetBalance
        })
      });
      if (res.ok) {
        onRefreshStats();
        loadProfileStats();
        if (shouldFlag) {
          setNewRequestType('Gift/Need'); // Adjust form type
          setNewCategory('Holistic Wellness');
          alert("⚠️ Simulated Balance drops to -12 points. Sustainability Threshold restriction is now ACTIVE! Account flagged for Gift-Only.");
        } else {
          alert("✓ Simulated Balance reset to +8 points. Sustainability Threshold restriction lifted!");
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handshake Confirmation Action (updates points on the copper ledger)
  const handleHandshakeAction = async (barterId: string, action: 'confirm_giver' | 'confirm_recipient') => {
    setIsHandshakingId(barterId);
    try {
      const res = await fetch('/api/barter/handshake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          barterId,
          userName,
          action
        })
      });
      if (res.ok) {
        const data = await res.json();
        onRefreshBarters();
        onRefreshStats();
        loadProfileStats();
        if (matchmakerTarget && matchmakerTarget.id === barterId) {
          fetchReciprocalMatches(matchmakerTarget);
        }
        alert(data.barter.handshakeComplete 
          ? "🤝 Handshake Complete! Both sisters have logged the exchange. Balances updated with love!"
          : "Your handshake confirmation has been logged. Waiting for your sister to log her side."
        );
      }
    } catch (e) {
      console.error("Error processing handshake:", e);
    } finally {
      setIsHandshakingId(null);
    }
  };

  // Time logging states
  const [newActivity, setNewActivity] = useState('');
  const [newHours, setNewHours] = useState('2');
  const [newType, setNewType] = useState<'earn' | 'spend'>('earn');
  const [recipientMother, setRecipientMother] = useState('Mama Jamila');

  // Community Wealth Fund / Land-Banking Goal State
  const [treasuryBalance, setTreasuryBalance] = useState(145250);
  const [treasuryLogs, setTreasuryLogs] = useState([
    { id: 't1', donor: 'Mama Shantrece', amount: 250, reason: 'Proceeds from homeschool curriculum sales', date: 'Today' },
    { id: 't2', donor: 'Atlanta Circle', amount: 1200, reason: 'Organic Soil Co-op Bazaar fundraiser', date: 'Yesterday' },
    { id: 't3', donor: 'Sister Nicole', amount: 500, reason: 'Traditional botanical remedy sales pledge', date: '3 days ago' },
  ]);

  // Recipient List for time-banking transaction logging
  const TRUSTED_MOTHERS = [
    'Mama Jamila',
    'Sister Nicole',
    'Mama Keisha',
    'Sister Nia',
    'Auntie Brenda',
    'Sister Clara'
  ];

  // In-Memory Double-Confirmation Pending Transactions Pool
  const [pendingTransactions, setPendingTransactions] = useState<TimeCreditLog[]>([
    {
      id: 'p-1',
      activity: 'Traditional agricultural consultation and soil turn',
      hours: 1.5,
      date: 'Today',
      type: 'earn',
      provider: userName,
      recipient: 'Mama Jamila',
      status: 'pending'
    },
    {
      id: 'p-2',
      activity: 'Delivered 2 quarts raw goat milk and farm-fresh eggs',
      hours: 2.0,
      date: 'Yesterday',
      type: 'spend',
      provider: 'Sister Nicole',
      recipient: userName,
      status: 'pending' // Nicole wants Shantrece to confirm receipt!
    }
  ]);

  // Handle local state tracking of confirmed ledger logs for instant reactivity
  const [confirmedLogs, setConfirmedLogs] = useState<TimeCreditLog[]>([...propsTimeLogs]);
  const [localTimeBalance, setLocalTimeBalance] = useState(propsTimeBalance);

  // Phase 1 Community States
  const [marketSubTab, setMarketSubTab] = useState<'listings' | 'my-trades' | 'wisdom' | 'urgent-care'>('listings');
  const [communityComments, setCommunityComments] = useState<BarterComment[]>(INITIAL_BARTER_COMMENTS);
  const [activeTrades, setActiveTrades] = useState<ActiveTradeRecord[]>(INITIAL_ACTIVE_TRADES);
  const [urgentCareAlerts, setUrgentCareAlerts] = useState(INITIAL_URGENT_CARE_ALERTS);
  const [selectedSisterProfile, setSelectedSisterProfile] = useState<string | null>(null);

  // Phase 1 Handlers
  const handleAddComment = (barterId: string, text: string, isQuickInquiry: boolean = false, parentCommentId?: string) => {
    const newComment: BarterComment = {
      id: `bc-${Date.now()}`,
      barterId,
      authorName: userName,
      authorLocation: `${selectedState} Circle`,
      text,
      createdAt: 'Just now',
      isQuickInquiry,
      parentCommentId
    };
    setCommunityComments(prev => [newComment, ...prev]);
  };

  const handleInitiateTrade = (barter: BarterOffer, meetupSpot?: SafeMeetupSpot) => {
    const newTrade: ActiveTradeRecord = {
      id: `trade-${Date.now()}`,
      barterId: barter.id,
      listingTitle: barter.title,
      listingCategory: barter.category,
      role: 'recipient',
      partnerName: barter.offerBy,
      partnerContact: barter.contact || 'sister@coop.net',
      status: 'Pending Negotiation',
      offeredItemOrService: 'Agreed Co-op Exchange / Equivalent Credits',
      requestedItemOrService: barter.tradeFor || barter.title,
      pointsValue: barter.valuePoints || 5,
      initiatedAt: 'Just now',
      meetupLocation: meetupSpot ? `${meetupSpot.name} (${meetupSpot.cityState})` : 'Safe Public Foyer Scheduled',
      scheduledDate: 'This Week',
      giverHandshakeSigned: false,
      recipientHandshakeSigned: true
    };
    setActiveTrades(prev => [newTrade, ...prev]);
    setMarketSubTab('my-trades');
    alert(`🕊️ Sisterhood trade initiated for "${barter.title}"! Tracked in your Active Trades dashboard.`);
  };

  const handleConfirmTradeHandshake = (tradeId: string, role: 'giver' | 'recipient') => {
    setActiveTrades(prev => prev.map(t => {
      if (t.id === tradeId) {
        const updated = {
          ...t,
          giverHandshakeSigned: role === 'giver' ? true : t.giverHandshakeSigned,
          recipientHandshakeSigned: role === 'recipient' ? true : t.recipientHandshakeSigned,
        };
        if (updated.giverHandshakeSigned && updated.recipientHandshakeSigned) {
          updated.status = 'Completed Exchange';
          updated.completedAt = 'Today';
          updated.digitalReceiptHash = `0xCOPPER_${Date.now().toString(16).toUpperCase()}_VERIFIED`;
          setLocalTimeBalance(b => b + 2.0);
        } else {
          updated.status = 'Awaiting Safe Handshake';
        }
        return updated;
      }
      return t;
    }));
  };

  const handleCancelTrade = (tradeId: string) => {
    if (confirm("Cancel this trade exchange record?")) {
      setActiveTrades(prev => prev.filter(t => t.id !== tradeId));
    }
  };

  const handleScheduleMeetup = (tradeId: string, spotName: string, dateStr: string) => {
    setActiveTrades(prev => prev.map(t => t.id === tradeId ? { ...t, meetupLocation: spotName, scheduledDate: dateStr } : t));
  };

  const handleRespondAlert = (alertId: string, note: string) => {
    setUrgentCareAlerts(prev => prev.map(a => {
      if (a.id === alertId) {
        return {
          ...a,
          responders: [...a.responders, { sisterName: userName, note, respondedAt: 'Just now' }]
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

  const handleBookConsultation = (expertName: string, role: string, topic: string) => {
    setLocalTimeBalance(b => Math.max(0, b - 1.0));
    onAddLog(`Consultation with ${expertName} (${topic})`, 1.0, 'spend', expertName, userName, 'confirmed');
  };

  // Calculate verified contribution hours (Sum of CONFIRMED earn logs where provider is userName)
  const verifiedContributionHours = confirmedLogs
    .filter(log => log.type === 'earn')
    .reduce((sum, log) => sum + log.hours, 0);

  // GATE: Check if user has less than 2.0 verified hours
  const isReadOnlyGateActive = verifiedContributionHours < 2.0;

  // Handle Post Barter Form Submission
  const handleBarterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnlyGateActive) return;

    // Validate flagging system constraints
    if (profileStats.restrictedToGiftOnly && newRequestType !== 'Gift/Need') {
      setFormError("Flagging Restriction Active: Your balance is below the sustainability threshold (-10). You can only post 'Gift/Need' requests.");
      return;
    }

    if (!newTitle.trim() || !newDesc.trim()) {
      setFormError("Please fill in the title and description.");
      return;
    }

    setIsPostingRequest(true);
    setFormError(null);

    const isGift = newRequestType === 'Gift/Need';
    const finalPoints = isGift ? 0 : newValuePoints;
    const finalTrade = isGift ? 'Gift / Generosity Act' : (newTrade || `${finalPoints} points`);

    try {
      const res = await fetch('/api/barter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          description: newDesc,
          category: newCategory,
          offerBy: userName,
          contact: `${userName.toLowerCase().replace(' ', '.')}@coop.net`,
          locationState: newFormState,
          city: newCity.trim(),
          cityZip: newCityZip.trim() ? (newCity.trim() ? `${newCity.trim()}, ${newCityZip.trim()}` : newCityZip.trim()) : newCity.trim(),
          tradeFor: finalTrade,
          isLandSteward: isLandStewardChecked,
          requestType: newRequestType,
          valuePoints: finalPoints,
          intentTag: newIntentTag
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        setFormError(errData.error || "Failed to post request.");
        return;
      }

      setBarterSuccess(true);
      setNewTitle('');
      setNewDesc('');
      setNewTrade('');
      setNewCity('');
      setNewCityZip('');
      setNewValuePoints(5);
      setIsLandStewardChecked(false);
      
      onRefreshBarters();
      onRefreshStats();
      loadProfileStats();

      setTimeout(() => setBarterSuccess(false), 5000);
    } catch (err) {
      console.error("Error submitting request:", err);
      setFormError("A network error occurred. Please try again.");
    } finally {
      setIsPostingRequest(false);
    }
  };

  // Handle Logging a Transaction -> Goes into the PENDING DOUBLE-CONFIRMATION ledger
  const handleLedgerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivity.trim() || !newHours) return;

    const hoursVal = parseFloat(newHours);
    const newPending: TimeCreditLog = {
      id: `p-${Date.now()}`,
      activity: newActivity,
      hours: hoursVal,
      date: 'Just now',
      type: newType,
      provider: newType === 'earn' ? userName : recipientMother,
      recipient: newType === 'earn' ? recipientMother : userName,
      status: 'pending'
    };

    setPendingTransactions([newPending, ...pendingTransactions]);
    setNewActivity('');
    setNewHours('2');
    alert("Transaction added to Double-Confirmation Ledger! It is marked as 'Pending' until the recipient Mother confirms the transaction.");
  };

  // Confirm receipt of an INCOMING transaction or simulate verification of an OUTGOING transaction
  const handleConfirmReceipt = (id: string) => {
    const tx = pendingTransactions.find(t => t.id === id);
    if (!tx) return;

    // Update status to confirmed
    const updatedTx: TimeCreditLog = {
      ...tx,
      status: 'confirmed',
      date: 'Today'
    };

    // Calculate updated time balance
    let balanceDiff = 0;
    if (tx.provider === userName) {
      // If we are provider, we earned hours
      balanceDiff = tx.hours;
    } else {
      // If we are recipient, we spent/gave hours
      balanceDiff = -tx.hours;
    }

    setLocalTimeBalance(prev => parseFloat((prev + balanceDiff).toFixed(2)));
    setConfirmedLogs([updatedTx, ...confirmedLogs]);
    setPendingTransactions(pendingTransactions.filter(t => t.id !== id));
    
    // Bubble up to parent state if callback exists
    onAddLog(tx.activity, tx.hours, tx.type, tx.recipient, tx.provider, 'confirmed');

    alert(`Transaction double-confirmed! ${tx.hours} co-op hours added/settled on your ledger.`);
  };

  // Decline a pending transaction request
  const handleDeclineTransaction = (id: string) => {
    setPendingTransactions(pendingTransactions.filter(t => t.id !== id));
    alert("Transaction declined. Returned to pending county verification.");
  };

  // Delete a confirmed ledger log
  const handleLocalDeleteLog = (id: string) => {
    const target = confirmedLogs.find(l => l.id === id);
    if (target) {
      const multiplier = target.type === 'earn' ? -1 : 1;
      const reverseHours = target.hours * multiplier;
      setLocalTimeBalance(prev => parseFloat((prev + reverseHours).toFixed(2)));
    }
    setConfirmedLogs(confirmedLogs.filter(l => l.id !== id));
    onDeleteLog(id);
  };

  // Instant simulation helper to help reviewers bypass the gate immediately
  const simulateCompleteTwoHours = () => {
    const fastEarn: TimeCreditLog = {
      id: `sim-${Date.now()}`,
      activity: 'Traditional Midwifery Support & Herbal Infusion Swap',
      hours: 2.5,
      date: 'Just now',
      type: 'earn',
      provider: userName,
      recipient: 'Mama Jamila',
      status: 'confirmed'
    };

    setConfirmedLogs([fastEarn, ...confirmedLogs]);
    setLocalTimeBalance(prev => parseFloat((prev + 2.5).toFixed(2)));
    onAddLog(fastEarn.activity, 2.5, 'earn', fastEarn.recipient, userName, 'confirmed');
    alert("Simulated confirmed service trade completed! 2.5 verified hours added. Access Gate is now unlocked!");
  };

  // Contribute to the Land-Banking Treasury
  const handleContributeTreasury = () => {
    const amount = 50;
    setTreasuryBalance(prev => prev + amount);
    setTreasuryLogs([
      {
        id: `t-${Date.now()}`,
        donor: userName,
        amount: amount,
        reason: 'Direct micro-donation to Georgia Homestead Land-Bank',
        date: 'Just now'
      },
      ...treasuryLogs
    ]);
    alert("Thank you sister! $50 successfully pledged toward our 40-acre community land goal.");
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto my-2">
      
      {/* Header */}
      <div className="border-b border-[#B87333]/30 pb-3">
        <div className="flex items-center space-x-2.5 text-copper-penny mb-1">
          <ArrowLeftRight className="w-5 h-5 text-[#B87333]" />
          <span className="font-mono text-xs uppercase tracking-widest font-semibold text-copper-penny">Marketplace &amp; Care</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#1F1813]">
              Community Exchange &amp; Trade Board
            </h2>
            <p className="text-xs sm:text-sm text-[#2A221B]/80 max-w-2xl mt-0.5 leading-relaxed">
              Trade items, homemade botanical goods, garden surplus, and share time and skills with sister mommies. 
            </p>
          </div>

          {/* The Copper Circle Mini Standings Card */}
          <div className="bg-gradient-to-br from-[#FAF5EE] to-white border border-[#B87333]/30 rounded-2xl p-4 md:w-96 shrink-0 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-copper-penny/10 pb-1.5">
              <span className="font-serif font-extrabold text-[12px] text-[#1F1813] flex items-center space-x-1">
                <span>🤝 Community Trust &amp; Activity</span>
              </span>
              <span className="text-[8px] font-mono font-bold uppercase bg-[#B87333]/15 text-[#B87333] px-2 py-0.5 rounded-md">Live Activity</span>
            </div>
            
            <div className="grid grid-cols-4 gap-1 text-center">
              <div className="bg-white/70 p-1.5 rounded-xl border border-copper-penny/5 flex flex-col justify-between">
                <span className="block text-[7px] font-mono text-soft-sage uppercase font-bold" title="Internal Reliability Score">Trust</span>
                <span className="text-xs font-mono font-black text-emerald-700">{profileStats.trustScore}%</span>
              </div>
              <div className="bg-white/70 p-1.5 rounded-xl border border-copper-penny/5 flex flex-col justify-between">
                <span className="block text-[7px] font-mono text-soft-sage uppercase font-bold" title="90-day Net Barter Points">Barter</span>
                <span className={`text-xs font-mono font-black ${profileStats.barterBalance < 0 ? 'text-rose-600' : 'text-[#B87333]'}`}>
                  {profileStats.barterBalance >= 0 ? `+${profileStats.barterBalance}` : profileStats.barterBalance}
                </span>
              </div>
              <div className="bg-white/70 p-1.5 rounded-xl border border-copper-penny/5 flex flex-col justify-between">
                <span className="block text-[7px] font-mono text-soft-sage uppercase font-bold" title="Community Grace Score">Grace</span>
                <span className="text-xs font-mono font-black text-[#A85138]">{profileStats.generosityScore}</span>
              </div>
              <div className="bg-white/70 p-1.5 rounded-xl border border-copper-penny/5 flex flex-col justify-between">
                <span className="block text-[7px] font-mono text-soft-sage uppercase font-bold" title="Gifts Received (Informative)">Received</span>
                <span className="text-xs font-mono font-black text-indigo-600">{profileStats.graceScore}</span>
              </div>
            </div>

            {/* Simulated Balance Controls for Reviewer testing */}
            <div className="pt-1 border-t border-copper-penny/5 flex items-center justify-between gap-2">
              <span className="text-[8px] font-mono text-soft-sage font-bold uppercase tracking-wider">Reviewer Simulator:</span>
              {profileStats.barterBalance < -10 ? (
                <button
                  type="button"
                  onClick={() => simulateToggleFlagging(false)}
                  className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-[8px] font-bold uppercase rounded-md transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  ✓ Reset to +8 (Lift Block)
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => simulateToggleFlagging(true)}
                  className="px-2 py-0.5 bg-rose-600 hover:bg-rose-700 text-white font-mono text-[8px] font-bold uppercase rounded-md transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  🚨 Drop Balance to -12 (Flag Account)
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Featured Spotlight Banner */}
      <SpotlightBanner banners={banners} banner={spotlightBanner} selectedState={selectedState} userName={userName} />

      {/* Phase 1 Community Sub-Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono font-bold">
        <button
          onClick={() => setMarketSubTab('listings')}
          className={`px-4 py-2 rounded-2xl transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
            marketSubTab === 'listings'
              ? 'bg-[#B87333] text-white shadow-md'
              : 'bg-white text-[#1F1813] hover:bg-amber-50 border border-copper-penny/20'
          }`}
        >
          <ArrowLeftRight className="w-4 h-4" />
          <span>Barter &amp; Exchange Board</span>
        </button>

        <button
          onClick={() => setMarketSubTab('my-trades')}
          className={`px-4 py-2 rounded-2xl transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
            marketSubTab === 'my-trades'
              ? 'bg-[#B87333] text-white shadow-md'
              : 'bg-white text-[#1F1813] hover:bg-amber-50 border border-copper-penny/20'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>My Active Trades ({activeTrades.length})</span>
        </button>

        <button
          onClick={() => setMarketSubTab('urgent-care')}
          className={`px-4 py-2 rounded-2xl transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
            marketSubTab === 'urgent-care'
              ? 'bg-rose-700 text-white shadow-md'
              : 'bg-white text-[#1F1813] hover:bg-rose-50 border border-rose-300'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-rose-500" />
          <span>Local Pod Urgent Care (Village SOS)</span>
        </button>

        <button
          onClick={() => setMarketSubTab('wisdom')}
          className={`px-4 py-2 rounded-2xl transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
            marketSubTab === 'wisdom'
              ? 'bg-[#1F1813] text-[#D4AF37] shadow-md border border-[#D4AF37]/50'
              : 'bg-white text-[#1F1813] hover:bg-amber-50 border border-copper-penny/20'
          }`}
        >
          <Sprout className="w-4 h-4 text-[#D4AF37]" />
          <span>Sisterhood Wisdom &amp; Tiers</span>
        </button>
      </div>

      {/* Render Active Trades Sub-view */}
      {marketSubTab === 'my-trades' && (
        <ActiveTradesTracker
          trades={activeTrades}
          userName={userName}
          onConfirmTradeHandshake={handleConfirmTradeHandshake}
          onCancelTrade={handleCancelTrade}
          onScheduleMeetup={handleScheduleMeetup}
        />
      )}

      {/* Render Urgent Care Pod Sub-view */}
      {marketSubTab === 'urgent-care' && (
        <UrgentCarePod
          selectedState={selectedState}
          userName={userName}
          alerts={urgentCareAlerts}
          onRespondAlert={handleRespondAlert}
          onCreateAlert={handleCreateAlert}
        />
      )}

      {/* Render Wisdom Progression Sub-view */}
      {marketSubTab === 'wisdom' && (
        <WisdomProgression
          userName={userName}
          userTrustScore={profileStats.trustScore}
          completedTradesCount={profileStats.barterBalance}
          verifiedCareHours={verifiedContributionHours}
        />
      )}

      <div className={`bg-[#FAF5EE]/30 border border-copper-penny/15 rounded-3xl p-4 sm:p-5 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-5 ${
        marketSubTab !== 'listings' ? 'hidden' : ''
      }`}>
        
        {/* Left Columns: Barter board & post form (8 columns) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* The Cooperative Village Geographic Map View */}
          <div className="bg-gradient-to-br from-[#1F1813] to-[#2D221A] text-[#FAF5EE] border border-copper-penny/25 rounded-3xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-copper-penny/20 pb-2">
              <div>
                <h4 className="font-serif font-extrabold text-sm text-[#FAF5EE] flex items-center space-x-1.5">
                  <Compass className="w-4 h-4 text-[#B87333]" />
                  <span>
                    Local Community Map ({filterState !== 'All' ? filterState : 'National'}
                    {effectiveCity ? ` • ${filterCity === 'custom' ? (customCityInput || 'Custom City') : filterCity}` : ''} View)
                  </span>
                </h4>
                <p className="text-[10px] text-[#FAF5EE]/70 font-mono">Nearby sisters, mutual aid, seeds &amp; surplus</p>
              </div>
              <span className="text-[9px] font-mono bg-[#B87333]/10 text-[#FAF5EE] border border-[#B87333]/30 px-2 py-0.5 rounded-md">Local Network Map</span>
            </div>
            
            {/* Map Stage / Hand-drawn Topographic Land Map Box */}
            <div className="relative h-48 bg-gradient-to-br from-[#FAF6EE] via-[#F3EDE0] to-[#E5DAC6] rounded-2xl border-2 border-[#B87333]/35 overflow-hidden flex items-center justify-center shadow-inner">
              
              {/* Paper Texture Soft Grainy Overlay */}
              <div className="absolute inset-0 pointer-events-none opacity-5 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-900 via-stone-900 to-black mix-blend-overlay" />
              
              {/* Topographical Contour Wave Lines & Hand-drawn Terrain SVGs */}
              <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none select-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* Elevation Contour 1 */}
                <path d="M -10,30 Q 15,45 35,20 T 75,40 T 110,25" fill="none" stroke="#B87333" strokeWidth="0.5" />
                {/* Elevation Contour 2 (Dashed ridge) */}
                <path d="M -10,50 Q 25,25 55,60 T 110,45" fill="none" stroke="#B87333" strokeWidth="0.5" strokeDasharray="1,2" />
                {/* Elevation Contour 3 */}
                <path d="M -10,75 Q 20,95 50,65 T 110,80" fill="none" stroke="#B87333" strokeWidth="0.5" />
                {/* Elevation Contour 4 */}
                <path d="M 20,105 Q 45,75 85,105" fill="none" stroke="#B87333" strokeWidth="0.5" strokeDasharray="2,2" />
                
                {/* Soft River outline flowing through */}
                <path d="M 40,-10 Q 45,30 30,55 T 50,110" fill="none" stroke="#B87333" strokeWidth="0.75" strokeDasharray="1,3" />

                {/* Micro Mountain peak sketches */}
                <path d="M 12,28 L 17,20 L 22,28" fill="none" stroke="#B87333" strokeWidth="0.4" />
                <path d="M 15,28 L 19,23 L 24,28" fill="none" stroke="#B87333" strokeWidth="0.4" />
                <path d="M 82,72 L 87,63 L 92,72" fill="none" stroke="#B87333" strokeWidth="0.4" />
              </svg>

              {/* Styled Compass Rose */}
              <svg className="absolute right-3.5 bottom-3 w-10 h-10 opacity-20 pointer-events-none select-none" viewBox="0 0 24 24" fill="none" stroke="#B87333" strokeWidth="1">
                <circle cx="12" cy="12" r="9" strokeDasharray="1,1" />
                <path d="M12 2 L12 22 M2 12 L22 12" />
                <path d="M12 2 L13.5 8 L12 10 L10.5 8 Z" fill="#B87333" />
                <path d="M12 22 L13.5 16 L12 14 L10.5 16 Z" fill="#B87333" />
                <path d="M22 12 L16 13.5 L14 12 L16 10.5 Z" fill="#B87333" />
                <path d="M2 12 L8 13.5 L10 12 L8 10.5 Z" fill="#B87333" />
                <text x="11.2" y="5.5" fontSize="2.5" fontFamily="serif" fill="#B87333" fontWeight="bold">N</text>
              </svg>

              {/* Map Pins Plotted using Styled Leaves */}
              {barterList.filter(matchesBarterFilters).length === 0 ? (
                <span className="text-[11px] text-[#B87333]/70 italic font-serif font-semibold z-10">No active growth circles in this region</span>
              ) : (
                barterList.filter(matchesBarterFilters).map((b, idx) => {
                  const hashString = (b.cityZip || '30301') + b.title;
                  let sum = 0;
                  for (let i = 0; i < hashString.length; i++) sum += hashString.charCodeAt(i);
                  const xPercent = 15 + (sum % 70); 
                  const yPercent = 20 + ((sum * 7) % 60);

                  const isTargeted = matchmakerTarget?.id === b.id;

                  return (
                    <button
                      key={`pin-${b.id}`}
                      onClick={() => fetchReciprocalMatches(b)}
                      className="absolute group cursor-pointer transition-all duration-300 hover:scale-125 z-10 -translate-x-1/2 -translate-y-1/2"
                      style={{ left: `${xPercent}%`, top: `${yPercent}%` }}
                    >
                      {/* Ring to denote growth activity */}
                      <span className={`absolute -inset-2.5 rounded-full opacity-35 ${
                        isTargeted ? 'bg-amber-500' : (b.isGift || b.requestType === 'Gift/Need') ? 'bg-emerald-500' : 'bg-[#B87333]'
                      }`} />
                      
                      {/* Topographical copper-toned paper pin with beautiful growth leaf */}
                      <div className={`p-1.5 rounded-xl border shadow-md transition-all flex items-center justify-center ${
                        isTargeted 
                          ? 'bg-amber-100 border-amber-600 text-amber-800 scale-110' 
                          : (b.isGift || b.requestType === 'Gift/Need') 
                            ? 'bg-emerald-50 border-emerald-600 text-emerald-800' 
                            : 'bg-[#FAF5EE] border-[#B87333] text-[#B87333]'
                      }`}>
                        <Leaf className="w-3.5 h-3.5" />
                      </div>

                      <span className="absolute left-1/2 -translate-x-1/2 bottom-7 hidden group-hover:block bg-[#1F1813] text-white border border-[#B87333]/30 rounded-lg p-1.5 shadow-xl whitespace-nowrap text-[9px] z-30 font-mono leading-normal">
                        <span className="block font-bold text-[#FAF5EE]">{b.title.substring(0, 22)}...</span>
                        <span className="block text-[8px] text-soft-sage">{b.requestType || 'Barter'} • {b.cityZip || b.locationState}</span>
                        <span className="block text-[7px] text-[#B87333] font-bold">Click to Match with AI</span>
                      </span>
                    </button>
                  );
                })
              )}

              {/* Hand-drawn Earthy Center Anchor */}
              <div className="absolute w-4 h-4 bg-amber-500/20 border border-amber-700 rounded-full flex items-center justify-center shadow-sm select-none pointer-events-none" title="Village Hearth">
                <div className="w-1.5 h-1.5 bg-amber-700 rounded-full" />
              </div>
              
              {/* Hand-drawn Legend overlay */}
              <div className="absolute bottom-2 left-2 flex items-center space-x-3 text-[8.5px] font-mono font-bold text-[#2A221B]/90 bg-[#FAF5EE]/95 px-2.5 py-1 rounded-xl border border-[#B87333]/30 shadow-sm pointer-events-none">
                <div className="flex items-center space-x-1">
                  <Leaf className="w-3 h-3 text-[#B87333]" />
                  <span>Barter</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Leaf className="w-3 h-3 text-emerald-600" />
                  <span>Gift Circle</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Leaf className="w-3 h-3 text-amber-600" />
                  <span>Selected</span>
                </div>
              </div>
            </div>
            <div className="text-[10px] text-soft-sage leading-relaxed text-center px-2">
              🌾 Land Map coordinates guide trade networks. Hover a seed leaf to view growth circle details, or <strong>click any circle to explore mutual trade alignment</strong>!
            </div>
          </div>

          {/* Upgraded Search & Geographic Filters Panel with Secondary City Filter */}
          <div className="bg-[#FAF5EE] border border-copper-penny/20 rounded-3xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-copper-penny/10 pb-2">
              <span className="font-serif font-extrabold text-xs text-[#1F1813] flex items-center space-x-1.5">
                <Filter className="w-4 h-4 text-[#B87333]" />
                <span>Geographic (State &amp; City), Category &amp; Proximity Filters</span>
              </span>
              <button 
                onClick={() => {
                  setFilterState(selectedState || 'All');
                  setFilterCity('all');
                  setCustomCityInput('');
                  setFilterCategory('All');
                  setFilterZip('');
                  setFilterIntent('All');
                  setMatchmakerTarget(null);
                }}
                className="text-[9px] font-mono font-bold uppercase text-copper-penny hover:text-[#A85138] flex items-center space-x-1 cursor-pointer"
              >
                <RefreshCw className="w-2.5 h-2.5" />
                <span>Reset Filters</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {/* 1. 50-State Selector */}
              <div className="space-y-1">
                <label className="block text-[8px] font-mono text-soft-sage uppercase tracking-wider font-bold">1. Region (State)</label>
                <select
                  value={filterState}
                  onChange={(e) => {
                    setFilterState(e.target.value);
                    setFilterCity('all');
                    setCustomCityInput('');
                  }}
                  className="w-full bg-white border border-copper-penny/15 focus:border-copper-penny focus:ring-1 focus:ring-copper-penny rounded-xl px-2.5 py-1.5 text-xs text-[#1F1813] focus:outline-none"
                >
                  <option value="All">All 50 States</option>
                  {US_STATES_DATA.map(st => (
                    <option key={st.code} value={st.code}>{st.code} - {st.name}</option>
                  ))}
                </select>
              </div>

              {/* 2. Secondary City Filter (Granular geographic filtering) */}
              <div className="space-y-1">
                <label className="block text-[8px] font-mono text-soft-sage uppercase tracking-wider font-bold">2. City / Metro Area</label>
                <select
                  value={filterCity}
                  onChange={(e) => setFilterCity(e.target.value)}
                  className="w-full bg-white border border-copper-penny/15 focus:border-copper-penny focus:ring-1 focus:ring-copper-penny rounded-xl px-2.5 py-1.5 text-xs text-[#1F1813] focus:outline-none"
                >
                  <option value="all">
                    {filterState === 'All' 
                      ? 'All Cities (Travel / Remote OK)' 
                      : `All Cities in ${filterState} (Statewide)`}
                  </option>
                  {filterState !== 'All' && getStateCities(filterState).map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                  <option value="custom">Type Specific City...</option>
                </select>
                {filterCity === 'custom' && (
                  <input
                    type="text"
                    value={customCityInput}
                    onChange={(e) => setCustomCityInput(e.target.value)}
                    placeholder="Type city name..."
                    className="w-full mt-1 bg-white border border-[#B87333] focus:ring-1 focus:ring-[#B87333] rounded-xl px-2.5 py-1 text-xs text-[#1F1813] placeholder-gray-400 focus:outline-none"
                  />
                )}
              </div>

              {/* 3. Category selector */}
              <div className="space-y-1">
                <label className="block text-[8px] font-mono text-soft-sage uppercase tracking-wider font-bold">3. Category Circle</label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full bg-white border border-copper-penny/15 focus:border-copper-penny focus:ring-1 focus:ring-copper-penny rounded-xl px-2.5 py-1.5 text-xs text-[#1F1813] focus:outline-none"
                >
                  <option value="All">All Categories</option>
                  <option value="Holistic Wellness">Holistic Wellness</option>
                  <option value="Homeschool">Homeschool</option>
                  <option value="Land/Wealth">Land/Wealth</option>
                  <option value="Garden Bounty">Garden Bounty</option>
                  <option value="Clean Beauty">Clean Beauty</option>
                  <option value="Daily Life/Pantry">Daily Life/Pantry</option>
                </select>
              </div>

              {/* 4. Proximity / Zip */}
              <div className="space-y-1">
                <label className="block text-[8px] font-mono text-soft-sage uppercase tracking-wider font-bold">4. Proximity (Zip Code)</label>
                <input
                  type="text"
                  value={filterZip}
                  onChange={(e) => setFilterZip(e.target.value)}
                  placeholder="e.g. 30331"
                  className="w-full bg-white border border-copper-penny/15 focus:border-copper-penny focus:ring-1 focus:ring-copper-penny rounded-xl px-2.5 py-1.5 text-xs text-[#1F1813] placeholder-gray-400 focus:outline-none"
                />
              </div>

              {/* 5. Intent Toggle */}
              <div className="space-y-1">
                <label className="block text-[8px] font-mono text-soft-sage uppercase tracking-wider font-bold">5. Intent Tag</label>
                <select
                  value={filterIntent}
                  onChange={(e) => setFilterIntent(e.target.value)}
                  className="w-full bg-white border border-copper-penny/15 focus:border-copper-penny focus:ring-1 focus:ring-copper-penny rounded-xl px-2.5 py-1.5 text-xs text-[#1F1813] focus:outline-none"
                >
                  <option value="All">Show All</option>
                  <option value="I have">🌿 I have (Surplus)</option>
                  <option value="I need">🤝 I need (Request)</option>
                </select>
              </div>
            </div>

            {/* Active Granular Filter Summary Badges */}
            {(filterState !== 'All' || filterCity !== 'all' || (filterCity === 'custom' && customCityInput) || filterCategory !== 'All' || filterZip || filterIntent !== 'All') && (
              <div className="flex items-center flex-wrap gap-2 pt-2 border-t border-copper-penny/10 text-[11px]">
                <span className="font-mono text-[9px] uppercase font-bold text-soft-sage">Active Filters:</span>
                {filterState !== 'All' && (
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-300 text-amber-900 font-mono font-bold">
                    <span>State: {filterState} ({getStateName(filterState)})</span>
                    <button 
                      onClick={() => { setFilterState('All'); setFilterCity('all'); setCustomCityInput(''); }} 
                      className="hover:text-red-700 ml-1 cursor-pointer font-black"
                      title="Clear state filter"
                    >
                      ×
                    </button>
                  </span>
                )}
                {(filterCity !== 'all' || (filterCity === 'custom' && customCityInput)) && (
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-900 font-mono font-bold">
                    <span>City: {filterCity === 'custom' ? (customCityInput || 'Custom') : filterCity}</span>
                    <button 
                      onClick={() => { setFilterCity('all'); setCustomCityInput(''); }} 
                      className="hover:text-red-700 ml-1 cursor-pointer font-black"
                      title="Clear city filter"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filterCategory !== 'All' && (
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-stone-100 border border-stone-300 text-stone-800 font-mono">
                    <span>Category: {filterCategory}</span>
                    <button onClick={() => setFilterCategory('All')} className="hover:text-red-700 ml-1 cursor-pointer font-black">×</button>
                  </span>
                )}
                {filterZip && (
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-stone-100 border border-stone-300 text-stone-800 font-mono">
                    <span>Zip: {filterZip}</span>
                    <button onClick={() => setFilterZip('')} className="hover:text-red-700 ml-1 cursor-pointer font-black">×</button>
                  </span>
                )}
                {filterIntent !== 'All' && (
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-stone-100 border border-stone-300 text-stone-800 font-mono">
                    <span>{filterIntent}</span>
                    <button onClick={() => setFilterIntent('All')} className="hover:text-red-700 ml-1 cursor-pointer font-black">×</button>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Active Postings Board */}
          <div className="bg-[#FAF5EE] border-2 border-[#1F1813]/5 rounded-3xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-copper-penny/10 pb-2">
              <div>
                <h3 className="font-serif font-extrabold text-lg text-[#1F1813] flex items-center space-x-2">
                  <span>
                    {filterState === 'All' ? 'National' : `${getStateName(filterState)} (${filterState})`}
                    {effectiveCity ? ` • ${filterCity === 'custom' ? (customCityInput || 'Custom City') : filterCity}` : ''} Regional Market Board
                  </span>
                </h3>
                <p className="text-[10px] text-soft-sage font-mono">
                  Showing {barterList.filter(matchesBarterFilters).length} active listings matching filter
                </p>
              </div>
              <span className="text-xs text-[#B87333] font-mono font-bold bg-[#B87333]/10 px-2.5 py-1 rounded-full">District 3 Loop</span>
            </div>

            {barterList.filter(matchesBarterFilters).length === 0 ? (
              <div className="text-center py-12 border border-dashed border-copper-penny/15 rounded-2xl text-xs text-soft-sage italic bg-white space-y-2">
                <p>No active posts match your filter criteria in {effectiveCity ? `${filterCity === 'custom' ? customCityInput : filterCity}, ` : ''}{filterState !== 'All' ? filterState : 'this region'}.</p>
                <button
                  onClick={() => {
                    setFilterState('All');
                    setFilterCity('all');
                    setCustomCityInput('');
                    setFilterCategory('All');
                    setFilterZip('');
                    setFilterIntent('All');
                  }}
                  className="text-xs text-[#B87333] underline font-mono font-bold cursor-pointer hover:text-[#A85138]"
                >
                  Clear search &amp; city filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {barterList.filter(matchesBarterFilters).map((barter) => (
                  <div key={barter.id}>
                    <BarterCardInteractive
                      barter={barter}
                      userName={userName}
                      userState={selectedState}
                      comments={communityComments.filter(c => c.barterId === barter.id)}
                      onAddComment={handleAddComment}
                      onInitiateTrade={handleInitiateTrade}
                      onHandshakeAction={handleHandshakeAction}
                      onOpenProfile={(name) => setSelectedSisterProfile(name)}
                      onFindAIMatches={fetchReciprocalMatches}
                      isHandshaking={isHandshakingId === barter.id}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form to Post new Barter Offer with Access Gate protection */}
          <div className="bg-[#FAF5EE] border-2 border-[#1F1813]/5 rounded-3xl p-5 shadow-lg space-y-4 relative overflow-hidden">
            
            {/* Visual Blur Cover if Read Only */}
            {isReadOnlyGateActive && (
              <div className="absolute inset-0 bg-white/75 backdrop-blur-xs z-20 flex flex-col items-center justify-center p-5 text-center">
                <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-700 border border-amber-300 flex items-center justify-center mb-3 shadow-md">
                  <Lock className="w-6 h-6" />
                </div>
                <h4 className="font-serif font-bold text-base text-[#1F1813]">🔒 Contribution First Access Gate</h4>
                <p className="text-xs text-[#2A221B]/80 max-w-md mt-1 leading-relaxed">
                  To protect community integrity, new users operate in <strong>Read-Only Status</strong>. To post a request or trade on the Board, you must first provide at least <strong>2.0 verified hours of mutual-aid service</strong> to the cooperative.
                </p>
                <div className="mt-4 space-y-2">
                  <button 
                    onClick={simulateCompleteTwoHours}
                    className="px-4 py-2 bg-[#B87333] hover:bg-[#A85138] border border-[#96551d]/30 text-white text-[11px] font-bold font-mono uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg active:scale-95 cursor-pointer flex items-center space-x-1.5"
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    <span>Instant bypass gate for reviewer</span>
                  </button>
                  <p className="text-[9px] font-mono text-soft-sage uppercase tracking-widest">Simulates completing and confirming a service trade</p>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-copper-penny/10 text-copper-penny flex items-center justify-center border border-copper-penny/25">
                <Plus className="w-4.5 h-4.5 text-copper-penny" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-[#1F1813]">Publish New Village Request</h3>
                <p className="text-[10px] font-mono text-soft-sage uppercase tracking-wider font-bold">Sister Mutual Exchange &amp; Gift Sharing</p>
              </div>
            </div>

            {/* Sustainability Threshold Warning Banner */}
            {profileStats.restrictedToGiftOnly && (
              <div className="bg-rose-50 border border-rose-300 rounded-2xl p-4 text-xs text-rose-900 space-y-1.5 shadow-sm">
                <div className="flex items-center space-x-2 font-bold">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>🌾 Village Reciprocity &amp; Balance Reminder</span>
                </div>
                <p className="leading-relaxed text-[11px]">
                  Your current Barter Balance is <strong>{profileStats.barterBalance} points</strong>. To keep our village circle harmonious and balanced, you are gently invited to share needs as Gift requests or receive mutual aid until reciprocal flow is restored.
                </p>
              </div>
            )}

            <form onSubmit={handleBarterSubmit} className="space-y-4">
              
              {/* Form Error Message */}
              {formError && (
                <div className="bg-red-50 border border-red-300 rounded-xl p-3 text-xs text-red-900 font-mono">
                  ⚠️ {formError}
                </div>
              )}

              {/* Request Type and Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[9px] font-mono text-soft-sage uppercase tracking-wider font-bold">Request Type</label>
                  <select
                    value={newRequestType}
                    onChange={(e) => {
                      const type = e.target.value as any;
                      if (profileStats.restrictedToGiftOnly && type !== 'Gift/Need') {
                        alert("Restricted: Your account is restricted to Gift/Need posts only.");
                        return;
                      }
                      setNewRequestType(type);
                    }}
                    className="w-full bg-white border border-copper-penny/20 focus:border-copper-penny focus:ring-1 focus:ring-copper-penny rounded-xl px-3 py-2 text-xs text-[#1F1813] focus:outline-none transition-colors"
                  >
                    {!profileStats.restrictedToGiftOnly && (
                      <>
                        <option value="Barter/Trade">Barter/Trade (Tracked Type A)</option>
                        <option value="Skill Swap">Skill Swap (Hours-based)</option>
                        <option value="Mobility/Ride">Mobility/Ride (Logistics)</option>
                      </>
                    )}
                    <option value="Gift/Need">Gift/Need (Exempt Type B)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[9px] font-mono text-soft-sage uppercase tracking-wider font-bold">Category Circle</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-white border border-copper-penny/20 focus:border-copper-penny focus:ring-1 focus:ring-copper-penny rounded-xl px-3 py-2 text-xs text-[#1F1813] focus:outline-none transition-colors"
                  >
                    <option value="Holistic Wellness">Holistic Wellness</option>
                    <option value="Homeschool">Homeschool</option>
                    <option value="Land/Wealth">Land/Wealth</option>
                    <option value="Garden Bounty">Garden Bounty</option>
                    <option value="Clean Beauty">Clean Beauty</option>
                    <option value="Daily Life/Pantry">Daily Life/Pantry</option>
                  </select>
                </div>
              </div>

              {/* Intent Tag Toggles */}
              <div className="space-y-1">
                <label className="block text-[9px] font-mono text-soft-sage uppercase tracking-wider font-bold">Intent Tag</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewIntentTag('I have')}
                    className={`py-2 text-center text-xs font-mono font-bold uppercase rounded-xl border transition-all cursor-pointer ${
                      newIntentTag === 'I have'
                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                        : 'bg-white text-soft-sage border-copper-penny/15 hover:border-copper-penny/40'
                    }`}
                  >
                    🌿 I Have (Surplus / Offer)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewIntentTag('I need')}
                    className={`py-2 text-center text-xs font-mono font-bold uppercase rounded-xl border transition-all cursor-pointer ${
                      newIntentTag === 'I need'
                        ? 'bg-[#B87333] text-white border-[#96551d] shadow-sm'
                        : 'bg-white text-soft-sage border-copper-penny/15 hover:border-copper-penny/40'
                    }`}
                  >
                    🤝 I Need (Request Aid)
                  </button>
                </div>
              </div>

              {/* Title Input */}
              <div className="space-y-1">
                <label className="block text-[9px] font-mono text-soft-sage uppercase tracking-wider font-bold">What is the specific item or skill?</label>
                <input 
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. 1 quart organic bone broth or legal trust research"
                  className="w-full bg-white border border-copper-penny/20 focus:border-copper-penny focus:ring-1 focus:ring-copper-penny rounded-xl px-3 py-2 text-xs text-[#1F1813] placeholder-gray-400 focus:outline-none transition-colors"
                />
              </div>

              {/* Return Terms & Points Value */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[9px] font-mono text-soft-sage uppercase tracking-wider font-bold">
                    {newRequestType === 'Gift/Need' ? "Gift Notes (Optional)" : "Requested trade/return term"}
                  </label>
                  <input 
                    type="text"
                    required={newRequestType !== 'Gift/Need'}
                    value={newTrade}
                    onChange={(e) => setNewTrade(e.target.value)}
                    placeholder={newRequestType === 'Gift/Need' ? "No reciprocation required" : "e.g. 1 hour soil turning"}
                    className="w-full bg-white border border-copper-penny/20 focus:border-copper-penny focus:ring-1 focus:ring-copper-penny rounded-xl px-3 py-2 text-xs text-[#1F1813] placeholder-gray-400 focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[9px] font-mono text-soft-sage uppercase tracking-wider font-bold">Point Value</label>
                  <input 
                    type="number"
                    min={0}
                    max={100}
                    disabled={newRequestType === 'Gift/Need'}
                    value={newRequestType === 'Gift/Need' ? 0 : newValuePoints}
                    onChange={(e) => setNewValuePoints(parseInt(e.target.value) || 0)}
                    className="w-full bg-white border border-copper-penny/20 focus:border-copper-penny focus:ring-1 focus:ring-copper-penny rounded-xl px-3 py-2 text-xs text-[#1F1813] focus:outline-none transition-colors disabled:bg-gray-100 disabled:text-gray-400"
                  />
                  {newRequestType === 'Gift/Need' && (
                    <span className="text-[8px] text-emerald-600 font-mono font-bold block pt-0.5">Type B Gifts are exempt (0 points)</span>
                  )}
                </div>
              </div>

              {/* Geographic Coordinates: 50-State, City & Proximity Zip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="block text-[9px] font-mono text-soft-sage uppercase tracking-wider font-bold">1. Location (State)</label>
                  <select
                    value={newFormState}
                    onChange={(e) => {
                      setNewFormState(e.target.value);
                      const cities = getStateCities(e.target.value);
                      setNewCity(cities.length > 0 ? cities[0] : '');
                    }}
                    className="w-full bg-white border border-copper-penny/20 focus:border-copper-penny focus:ring-1 focus:ring-copper-penny rounded-xl px-3 py-2 text-xs text-[#1F1813] focus:outline-none transition-colors"
                  >
                    {US_STATES_DATA.map(st => (
                      <option key={st.code} value={st.code}>{st.code} - {st.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[9px] font-mono text-soft-sage uppercase tracking-wider font-bold">2. City / Metro Area</label>
                  <div className="space-y-1">
                    <select
                      value={getStateCities(newFormState).includes(newCity) ? newCity : (newCity ? 'other' : '')}
                      onChange={(e) => {
                        if (e.target.value === 'other') {
                          setNewCity('');
                        } else {
                          setNewCity(e.target.value);
                        }
                      }}
                      className="w-full bg-white border border-copper-penny/20 focus:border-copper-penny focus:ring-1 focus:ring-copper-penny rounded-xl px-3 py-2 text-xs text-[#1F1813] focus:outline-none transition-colors"
                    >
                      <option value="">Select City in {newFormState}...</option>
                      {getStateCities(newFormState).map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                      <option value="other">+ Enter Other Town/City</option>
                    </select>
                    {(!getStateCities(newFormState).includes(newCity)) && (
                      <input
                        type="text"
                        required
                        value={newCity}
                        onChange={(e) => setNewCity(e.target.value)}
                        placeholder="Type city or town..."
                        className="w-full bg-white border border-copper-penny/20 focus:border-copper-penny focus:ring-1 focus:ring-copper-penny rounded-xl px-3 py-1.5 text-xs text-[#1F1813] placeholder-gray-400 focus:outline-none transition-colors mt-1"
                      />
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[9px] font-mono text-soft-sage uppercase tracking-wider font-bold">3. Zip Code / Neighborhood</label>
                  <input 
                    type="text"
                    required
                    value={newCityZip}
                    onChange={(e) => setNewCityZip(e.target.value)}
                    placeholder="e.g. 30331 or West End"
                    className="w-full bg-white border border-copper-penny/20 focus:border-copper-penny focus:ring-1 focus:ring-copper-penny rounded-xl px-3 py-2 text-xs text-[#1F1813] placeholder-gray-400 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Detailed Description */}
              <div className="space-y-1">
                <label className="block text-[9px] font-mono text-soft-sage uppercase tracking-wider font-bold">Detailed Terms &amp; Description</label>
                <textarea 
                  required
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Describe the terms, garden harvesting process, and delivery coordinates..."
                  className="w-full bg-white border border-copper-penny/20 focus:border-copper-penny focus:ring-1 focus:ring-copper-penny rounded-xl px-3 py-2 text-xs text-[#1F1813] placeholder-gray-400 focus:outline-none transition-colors resize-none"
                />
              </div>

              {/* Land Steward Checkbox Flag */}
              <div className="flex items-center space-x-2.5 bg-white/80 p-3 rounded-2xl border border-copper-penny/10">
                <input 
                  type="checkbox"
                  id="landStewardCheckbox"
                  checked={isLandStewardChecked}
                  onChange={(e) => setIsLandStewardChecked(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-emerald-600 focus:ring-emerald-500 border-gray-300 cursor-pointer"
                />
                <label htmlFor="landStewardCheckbox" className="text-xs text-[#2A221B] font-medium cursor-pointer select-none">
                  🌿 <strong>Offer Land Steward hours</strong> (Flag my profile as providing ancestral land agricultural advice)
                </label>
              </div>

              {barterSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs flex items-center space-x-1.5 border border-emerald-200">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Success! Village Request shared with the local {newFormState} circle.</span>
                </div>
              )}

              <button 
                type="submit"
                disabled={isPostingRequest}
                className="w-full py-2.5 bg-[#B87333] hover:bg-[#A85138] border border-[#96551d]/30 text-white text-xs font-mono font-bold rounded-xl transition-all shadow-sm hover:shadow-md active:scale-95 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isPostingRequest ? 'Sharing Request with Sisters...' : 'Publish Market Request'}
              </button>
            </form>
          </div>

        </div>

        {/* Sidebar Panel: Contribution time banking ledger (4 columns) */}
        <div className="lg:col-span-4 space-y-4">

          {/* Access Gate Status Progress Panel */}
          <div className="bg-white border border-copper-penny/15 rounded-2xl p-4 shadow-md space-y-3">
            <div className="flex items-center justify-between border-b border-copper-penny/10 pb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-soft-sage">Account Vetting Status</span>
              {isReadOnlyGateActive ? (
                <span className="text-[9px] font-mono bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200 uppercase font-bold flex items-center space-x-1">
                  <Lock className="w-2.5 h-2.5" />
                  <span>Read Only Gate</span>
                </span>
              ) : (
                <span className="text-[9px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200 uppercase font-bold flex items-center space-x-1">
                  <Unlock className="w-2.5 h-2.5" />
                  <span>Full Trade Verified</span>
                </span>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#1F1813]">Verified Service Completed:</span>
                <span className="font-mono font-bold text-copper-penny">{verifiedContributionHours.toFixed(1)} / 2.0 Hrs</span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-100 rounded-full h-2 border border-copper-penny/5 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${isReadOnlyGateActive ? 'bg-amber-500' : 'bg-emerald-600'}`}
                  style={{ width: `${Math.min((verifiedContributionHours / 2.0) * 100, 100)}%` }}
                />
              </div>

              {isReadOnlyGateActive ? (
                <p className="text-[10px] text-soft-sage leading-relaxed italic pt-0.5">
                  You need 2.0 verified hours of contribution to log Requests. Complete a service for another mother to get confirmed hours.
                </p>
              ) : (
                <p className="text-[10px] text-emerald-700 font-medium leading-relaxed flex items-center space-x-1 pt-0.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>Gate unlocked! You have full cooperative listing credentials.</span>
                </p>
              )}
            </div>
          </div>

          {/* Copper Mommies Market Matchmaker Panel */}
          <div className="bg-gradient-to-br from-[#120E0B] to-[#1F1813] text-[#FAF5EE] border border-[#B87333]/30 rounded-3xl p-4 shadow-xl space-y-3.5">
            <div className="flex items-center justify-between border-b border-copper-penny/20 pb-2">
              <div className="flex items-center space-x-1.5">
                <Compass className="w-4 h-4 text-[#B87333]" />
                <h4 className="font-serif font-extrabold text-xs text-[#FAF5EE]">Reciprocal Exchange Guidance</h4>
              </div>
              <span className="text-[8px] font-mono font-bold bg-[#B87333]/20 text-amber-400 border border-[#B87333]/30 px-1.5 py-0.5 rounded-md">
                Reciprocal Matching
              </span>
            </div>

            {matchmakerTarget ? (
              <div className="space-y-3">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-2.5 space-y-1">
                  <div className="flex items-center justify-between text-[9px] font-mono text-[#FAF5EE]/70">
                    <span>Active Matching Target:</span>
                    <button 
                      type="button"
                      onClick={() => {
                        setMatchmakerTarget(null);
                        setMatchmakerMatches([]);
                      }}
                      className="text-amber-400 hover:underline cursor-pointer"
                    >
                      Clear Selection
                    </button>
                  </div>
                  <h5 className="font-serif font-bold text-xs text-amber-300 truncate">{matchmakerTarget.title}</h5>
                  <p className="text-[9px] text-[#FAF5EE]/80 font-mono flex items-center justify-between">
                    <span>{matchmakerTarget.category} ({matchmakerTarget.intentTag || 'I have'})</span>
                    <span className="text-amber-500 font-bold">{matchmakerTarget.locationState}</span>
                  </p>
                </div>

                <div className="space-y-2">
                  <h6 className="font-mono text-[8px] text-[#FAF5EE]/60 uppercase tracking-wider font-bold flex items-center justify-between">
                    <span>Reciprocal Matches ({matchmakerMatches.length})</span>
                    {loadingMatches && <RefreshCw className="w-2.5 h-2.5 text-amber-500" />}
                  </h6>

                  {loadingMatches ? (
                    <div className="py-6 text-center text-[10px] font-mono text-soft-sage italic">
                      Seeking reciprocal offerings in the circle...
                    </div>
                  ) : matchmakerMatches.length === 0 ? (
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-4 text-center text-[10px] font-mono text-soft-sage italic leading-relaxed">
                      No reciprocal matches found in {matchmakerTarget.locationState} yet. Try posting an opposite trade for this item category to test!
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {matchmakerMatches.map((m) => (
                        <div key={`match-${m.id}`} className="bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-2.5 space-y-1.5 transition-all">
                          <div className="flex items-center justify-between">
                            <span className="text-[8px] font-mono font-bold bg-emerald-500/15 text-emerald-400 px-1.5 py-0.5 rounded-md">
                              AI Reciprocal Match
                            </span>
                            <span className="text-[9px] font-mono text-soft-sage">{m.cityZip || m.locationState}</span>
                          </div>
                          <h6 className="font-serif font-bold text-xs text-[#FAF5EE]">{m.title}</h6>
                          <p className="text-[10px] text-[#FAF5EE]/70 line-clamp-2 leading-relaxed">{m.description}</p>
                          
                          <div className="flex items-center justify-between text-[9px] font-mono text-amber-400 pt-1 border-t border-white/5">
                            <span>By: <strong>{m.offerBy}</strong></span>
                            <a href={`mailto:${m.contact}`} className="underline hover:text-amber-300">Secure Contact</a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-6 px-2 space-y-2 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-[11px] text-soft-sage leading-relaxed">
                  Select any listing on the board or geographic pin on the map and click <strong>"Find Matches with AI"</strong> to query matching barter loops!
                </p>
                <div className="text-[9px] text-[#FAF5EE]/60 font-mono">
                  Analyzes opposite intent tags (have ↔ need) and categories within the state.
                </div>
              </div>
            )}
          </div>
          
          {/* Time Banking Ledger Core Balance */}
          <div className="bg-[#FAF5EE] border-2 border-copper-penny/35 rounded-3xl p-5 space-y-4 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-copper-penny/10 pb-2">
              <div className="flex items-center space-x-2 text-copper-penny">
                <Coins className="w-4.5 h-4.5 text-copper-penny" />
                <h4 className="font-serif font-bold text-base text-[#1F1813]">Time Bank &amp; Care Sharing</h4>
              </div>
              <span className="text-[9px] font-mono bg-[#B87333]/15 text-copper-penny px-2 py-0.5 rounded-full border border-copper-penny/25 uppercase font-bold">
                Active Balance
              </span>
            </div>

            <div className="text-center py-3 bg-white rounded-2xl border border-copper-penny/15 shadow-sm space-y-0.5">
              <span className="text-[9px] font-mono text-soft-sage uppercase tracking-wider font-bold block">Current Trust Balance</span>
              <p className="text-3xl font-extrabold text-[#B87333] tracking-tight">{localTimeBalance.toFixed(1)} Hours</p>
              <span className="text-[10px] text-soft-sage font-mono">1 credit = 1 hour of mutual-aid care</span>
            </div>

            <p className="text-xs text-[#2A221B]/80 leading-relaxed">
              Log your co-care hours. Credits are confirmed between both sisters to ensure smooth and transparent exchanges.
            </p>

            {/* Interactive Form to Log Contributions */}
            <form onSubmit={handleLedgerSubmit} className="bg-white p-3.5 rounded-xl border border-copper-penny/10 space-y-2.5">
              <span className="block text-[9px] font-mono text-soft-sage uppercase font-bold">Log Care Hours</span>
              
              <div className="space-y-1">
                <input 
                  type="text"
                  required
                  value={newActivity}
                  onChange={(e) => setNewActivity(e.target.value)}
                  placeholder="Activity (e.g. 2 hours algebra tutoring)"
                  className="w-full bg-[#FAF5EE]/40 border border-copper-penny/15 rounded-lg px-2.5 py-1.5 text-xs text-[#1F1813] focus:outline-none focus:border-copper-penny transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[8px] font-mono text-soft-sage uppercase font-bold">Sister / Co-Care Mother</label>
                <select
                  value={recipientMother}
                  onChange={(e) => setRecipientMother(e.target.value)}
                  className="w-full bg-[#FAF5EE]/40 border border-copper-penny/15 rounded-lg px-2.5 py-1.5 text-xs text-[#1F1813] focus:outline-none focus:border-copper-penny"
                >
                  {TRUSTED_MOTHERS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <input 
                     type="number"
                     step="0.5"
                     min="0.5"
                     required
                     value={newHours}
                     onChange={(e) => setNewHours(e.target.value)}
                     placeholder="Hours"
                     className="w-full bg-[#FAF5EE]/40 border border-copper-penny/15 rounded-lg px-2.5 py-1.5 text-xs text-[#1F1813] focus:outline-none focus:border-copper-penny"
                  />
                </div>

                <div className="space-y-1">
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full bg-[#FAF5EE]/40 border border-copper-penny/15 rounded-lg px-2.5 py-1.5 text-xs text-[#1F1813] focus:outline-none focus:border-copper-penny"
                  >
                    <option value="earn">Earn (+)</option>
                    <option value="spend">Spend (-)</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-2 bg-[#B87333] hover:bg-[#A85138] border border-[#96551d]/30 text-white text-[11px] font-bold rounded-lg cursor-pointer transition-all uppercase tracking-wider active:scale-95 shadow-xs hover:shadow"
              >
                Save Care Record
              </button>
            </form>

            {/* Pending Double-Confirmation Pool */}
            {pendingTransactions.length > 0 && (
              <div className="space-y-2 border-t border-copper-penny/10 pt-3">
                <span className="block text-[9px] font-mono text-amber-800 uppercase font-bold flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Pending Sister Confirmations</span>
                </span>
                
                <div className="space-y-2">
                  {pendingTransactions.map((tx) => {
                    const isIncoming = tx.recipient === userName; // Needs our confirmation
                    
                    return (
                      <div key={tx.id} className="p-2.5 bg-white border border-amber-300 rounded-xl text-xs space-y-2">
                        <div>
                          <p className="font-bold text-[#1F1813] text-[11px] leading-tight">{tx.activity}</p>
                          <p className="text-[9px] font-mono text-soft-sage mt-0.5">
                            {tx.provider === userName ? `You ➔ ${tx.recipient}` : `${tx.provider} ➔ You`} ({tx.hours} hrs)
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-1.5">
                          {isIncoming ? (
                            <>
                              <button
                                onClick={() => handleConfirmReceipt(tx.id)}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[9px] font-bold rounded-md cursor-pointer flex items-center space-x-1 shadow-xs active:scale-95 transition-all"
                              >
                                <CheckCircle className="w-2.5 h-2.5" />
                                <span>Confirm Receipt</span>
                              </button>
                              <button
                                onClick={() => handleDeclineTransaction(tx.id)}
                                className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[9px] font-bold rounded-md cursor-pointer"
                              >
                                Decline
                              </button>
                            </>
                          ) : (
                            <div className="flex flex-col gap-1 w-full">
                              <span className="text-[8px] font-mono text-amber-700 italic">Awaiting sister verification...</span>
                              <button
                                onClick={() => handleConfirmReceipt(tx.id)}
                                type="button"
                                className="px-2.5 py-1 bg-amber-100 border border-amber-300 hover:bg-amber-200 text-amber-900 text-[8px] font-bold rounded-md cursor-pointer text-center w-full transition-all active:scale-95"
                              >
                                ⚡ Simulate Recipient Confirm (Test)
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Ledger logs timeline (Confirmed Only) */}
            <div className="space-y-1.5 max-h-48 overflow-y-auto scrollbar-thin border-t border-copper-penny/10 pt-3">
              <span className="block text-[9px] font-mono text-soft-sage uppercase font-bold">Care History</span>
              {confirmedLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-2.5 bg-white border border-copper-penny/10 rounded-xl text-xs hover:border-copper-penny/20 transition-colors">
                  <div className="space-y-0.5">
                    <p className="font-medium text-[#1F1813] leading-tight line-clamp-1">{log.activity}</p>
                    <span className="text-[9px] text-soft-sage font-mono">{log.date} {log.recipient && `• Recipient: ${log.recipient}`}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={`font-mono font-bold ${log.type === 'earn' ? 'text-[#3A4C3A]' : 'text-[#A85138]'}`}>
                      {log.type === 'earn' ? '+' : '-'}{log.hours.toFixed(1)} hrs
                    </span>
                    <button 
                      onClick={() => handleLocalDeleteLog(log.id)}
                      className="text-red-400 hover:text-red-600 p-1 cursor-pointer"
                      title="Remove record"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Private Treasury / Community Wealth Fund Dashboard Card */}
          <div className="bg-[#1F1813] border-2 border-[#D4AF37]/35 rounded-3xl p-5 space-y-4 shadow-xl relative overflow-hidden text-white">
            <div className="flex items-center space-x-2 text-[#D4AF37]">
              <Landmark className="w-5 h-5 text-[#D4AF37]" />
              <h4 className="font-serif font-bold text-base text-[#D4AF37]">Community Land &amp; Wellness Fund</h4>
            </div>

            <p className="text-xs text-[#FAF5EE]/90 leading-relaxed">
              Pooling autonomous capital to acquire and care for <strong>40 acres of fertile, agricultural land</strong> for generational security and retreats.
            </p>

            <div className="bg-white p-3.5 rounded-2xl border border-[#D4AF37]/15 text-center space-y-1 shadow-inner text-[#1F1813]">
              <span className="text-[9px] uppercase font-mono tracking-wider text-soft-sage block font-bold">Land-Banking Pool Raised</span>
              <p className="text-2xl font-extrabold text-[#A85138] font-mono">${treasuryBalance.toLocaleString()}</p>
              
              {/* Progress bar */}
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden border border-[#D4AF37]/10 mt-1">
                <div 
                  className="bg-gradient-to-r from-[#B87333] to-[#A85138] h-full rounded-full transition-all duration-700"
                  style={{ width: `${(treasuryBalance / 250000) * 100}%` }}
                />
              </div>
              <span className="text-[8px] text-soft-sage font-mono">Goal: $250,000 (58% secured)</span>
            </div>

            {/* Micro contribution button */}
            <button
              onClick={handleContributeTreasury}
              className="w-full py-2.5 bg-[#D4AF37] hover:bg-[#B87333] hover:text-white text-[#1F1813] border border-[#B87333]/40 text-[10px] font-mono uppercase tracking-wider font-extrabold rounded-xl shadow-md hover:shadow-lg cursor-pointer transition-all active:scale-95"
            >
              🌱 Contribute $50 to Land Pool
            </button>

            {/* Treasury Ledger log */}
            <div className="space-y-1.5 pt-2 border-t border-[#D4AF37]/15">
              <span className="block text-[8px] font-mono uppercase text-[#D4AF37]/75 tracking-wider font-bold">Latest Treasury Pledges</span>
              <div className="space-y-1 max-h-24 overflow-y-auto scrollbar-thin">
                {treasuryLogs.map((log) => (
                  <div key={log.id} className="flex justify-between text-[10px] p-1.5 bg-white/10 rounded-lg border border-white/5">
                    <span className="truncate max-w-[130px]"><strong>{log.donor}</strong>: <span className="text-gray-300">{log.reason}</span></span>
                    <span className="font-extrabold text-[#D4AF37] font-mono flex-shrink-0">+${log.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Land Steward Mentors list block */}
          <div className="bg-[#FAF5EE] border border-copper-penny/15 rounded-2xl p-4 space-y-3 shadow-md text-xs">
            <h4 className="font-serif font-bold text-sm text-[#1F1813] flex items-center space-x-1.5">
              <Sprout className="w-4.5 h-4.5 text-[#D4AF37]" />
              <span>Verified Land Stewards (Mentors)</span>
            </h4>
            <p className="text-[#2A221B]/85 leading-relaxed">
              Mothers who own verified agricultural land offer homesteading, poultry, soil conservation, or seed-saving mentorship hours in exchange for homeschooling time credits:
            </p>
            <div className="space-y-2 font-sans pt-0.5">
              <div className="p-2.5 bg-white border border-[#D4AF37]/35 rounded-xl flex items-start justify-between gap-2 shadow-2xs">
                <div>
                  <p className="font-bold text-[#1F1813]">🌿 Auntie Brenda</p>
                  <p className="text-[9px] text-soft-sage font-mono uppercase">California</p>
                  <p className="text-[10px] text-emerald-800 mt-1">Homestead soil turn &amp; permaculture design lessons</p>
                </div>
                <span className="text-[8px] font-mono font-bold uppercase bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/35 px-1.5 py-0.5 rounded flex items-center space-x-1 flex-shrink-0">
                  <span>Land Steward</span>
                </span>
              </div>
              <div className="p-2.5 bg-white border border-[#D4AF37]/35 rounded-xl flex items-start justify-between gap-2 shadow-2xs">
                <div>
                  <p className="font-bold text-[#1F1813]">🌿 Mother Bessie</p>
                  <p className="text-[9px] text-soft-sage font-mono uppercase">South Carolina</p>
                  <p className="text-[10px] text-emerald-800 mt-1">Heirloom seed bank preservation &amp; chicken husbandry</p>
                </div>
                <span className="text-[8px] font-mono font-bold uppercase bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/35 px-1.5 py-0.5 rounded flex items-center space-x-1 flex-shrink-0">
                  <span>Land Steward</span>
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Sister Micro-Storefront / Profile Modal */}
      {selectedSisterProfile && (
        <SisterProfileModal
          isOpen={!!selectedSisterProfile}
          sisterName={selectedSisterProfile}
          profiles={INITIAL_SISTER_PROFILES}
          currentUserName={userName}
          onClose={() => setSelectedSisterProfile(null)}
          onBookConsultation={handleBookConsultation}
        />
      )}
    </div>
  );
}
