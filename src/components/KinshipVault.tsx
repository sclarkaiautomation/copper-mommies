import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Users, Sparkles, ArrowRight, Trash2, CheckCircle, 
  Info, Plus, Gift, ShieldCheck, Heart, Landmark, DollarSign, Sprout, Bell,
  MapPin, Filter, Globe, Hammer, Leaf, RefreshCw
} from 'lucide-react';
import { KinshipPledge, ExpertProfile, NotificationEngineEvent, KinshipResourceNode, PageSpotlightBanner, ScholarshipEntry } from '../types';
import SpotlightBanner from './SpotlightBanner';

interface KinshipVaultProps {
  selectedState: string;
  userName: string;
  // Callback to open global contribution portal modal if needed, or we render it right here!
  onOpenContributionPortal?: () => void;
  spotlightBanner?: PageSpotlightBanner;
  banners?: PageSpotlightBanner[];
  onEnterContest?: (entry: ScholarshipEntry) => void;
}

export default function KinshipVault({ selectedState, userName, onOpenContributionPortal, spotlightBanner, banners }: KinshipVaultProps) {
  // States
  const [pledges, setPledges] = useState<KinshipPledge[]>([]);
  const [experts, setExperts] = useState<ExpertProfile[]>([]);
  const [notifications, setNotifications] = useState<NotificationEngineEvent[]>([]);
  
  // Root Ledger Query states
  const [queryPrompt, setQueryPrompt] = useState('');
  const [queryResponse, setQueryResponse] = useState<string | null>(null);
  const [queryLoading, setQueryLoading] = useState(false);
  const [engineLog, setEngineLog] = useState<{ matchedExperts: string[]; tagMatched: string } | null>(null);

  // Contribution Portal states
  const [pledgeType, setPledgeType] = useState<'monetary' | 'skill' | 'item'>('monetary');
  const [pledgeAmount, setPledgeAmount] = useState<string>('');
  const [pledgeDetails, setPledgeDetails] = useState('');
  const [isSubmittingPledge, setIsSubmittingPledge] = useState(false);

  // Expert Opt-In states
  const [isExpert, setIsExpert] = useState(false);
  const [expertDescription, setExpertDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<('Genealogy' | 'Land Law' | 'Estate Trust')[]>([]);
  const [isSubmittingExpert, setIsSubmittingExpert] = useState(false);

  // Active guide in the curriculum
  const [activeGuide, setActiveGuide] = useState<string | null>(null);

  // Kinship Resource Map states
  const [resources, setResources] = useState<KinshipResourceNode[]>([]);
  const [loadingResources, setLoadingResources] = useState(false);
  const [activeTypeFilter, setActiveTypeFilter] = useState<'all' | 'garden' | 'seed_node' | 'tool_library'>('all');
  const [selectedNode, setSelectedNode] = useState<KinshipResourceNode | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // New resource form states
  const [newResTitle, setNewResTitle] = useState('');
  const [newResType, setNewResType] = useState<'garden' | 'seed_node' | 'tool_library'>('garden');
  const [newResDesc, setNewResDesc] = useState('');
  const [newResZip, setNewResZip] = useState('');
  const [newResContact, setNewResContact] = useState('');
  const [newResState, setNewResState] = useState(selectedState || 'GA');
  const [isSubmittingResource, setIsSubmittingResource] = useState(false);
  const [resourceSuccess, setResourceSuccess] = useState(false);

  // Synchronize state code selection when selectedState changes
  useEffect(() => {
    if (selectedState) {
      setNewResState(selectedState);
    }
  }, [selectedState]);

  // Deterministic coordinate generator so nodes are nicely spaced and stable on the visual radar grid
  const getCoordinatesForNode = (id: string) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Generate values between 15% and 85% to avoid edges
    const x = 15 + (Math.abs(hash) % 70);
    const y = 20 + (Math.abs(hash >> 8) % 60);
    return { x, y };
  };

  // Fetch initial data on load
  const fetchData = async () => {
    setLoadingResources(true);
    try {
      const [pledgesRes, expertsRes, notificationsRes, resourcesRes] = await Promise.all([
        fetch('/api/kinship/pledges'),
        fetch('/api/kinship/experts'),
        fetch('/api/kinship/notifications'),
        fetch('/api/kinship/resources')
      ]);

      if (pledgesRes.ok) setPledges(await pledgesRes.json());
      if (expertsRes.ok) {
        const expertsList: ExpertProfile[] = await expertsRes.json();
        setExperts(expertsList);
        
        // Check if current user is already an expert in the registry
        const currentExpert = expertsList.find(e => e.name.toLowerCase() === userName.toLowerCase() && e.optIn);
        if (currentExpert) {
          setIsExpert(true);
          setExpertDescription(currentExpert.description);
          setSelectedTags(currentExpert.expertTags);
        }
      }
      if (notificationsRes.ok) setNotifications(await notificationsRes.json());
      if (resourcesRes.ok) {
        const resList = await resourcesRes.json();
        setResources(resList);
        // Default select the first resource of the selectedState if any
        const stateFiltered = resList.filter((r: KinshipResourceNode) => r.stateCode === selectedState);
        if (stateFiltered.length > 0) {
          setSelectedNode(stateFiltered[0]);
        } else if (resList.length > 0) {
          setSelectedNode(resList[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching Kinship data:', err);
    } finally {
      setLoadingResources(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userName]);

  // Handle Root Ledger Query submission
  const handleQuerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryPrompt.trim()) return;

    setQueryLoading(true);
    setQueryResponse(null);
    setEngineLog(null);

    try {
      const res = await fetch('/api/kinship/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: queryPrompt,
          stateCode: selectedState,
          authorName: userName
        })
      });

      if (res.ok) {
        const data = await res.json();
        setQueryResponse(data.wisdom);
        setEngineLog({
          matchedExperts: data.matchedExperts,
          tagMatched: data.notification.tagMatched
        });
        
        // Refresh notifications list to show the new automated trigger
        const notificationsRes = await fetch('/api/kinship/notifications');
        if (notificationsRes.ok) {
          setNotifications(await notificationsRes.json());
        }
      } else {
        setQueryResponse("The Ancestral Council's voice is temporarily distant. Please pause, ground your energies, and try again.");
      }
    } catch (err) {
      console.error('Error querying council:', err);
      setQueryResponse("The Ancestral Council's voice is temporarily distant. Please pause, ground your energies, and try again.");
    } finally {
      setQueryLoading(false);
    }
  };

  // Handle support pledge submission
  const handlePledgeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pledgeDetails.trim()) return;
    if (pledgeType === 'monetary' && !pledgeAmount) return;

    setIsSubmittingPledge(true);
    try {
      const res = await fetch('/api/kinship/pledges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donorName: userName,
          pledgeType,
          amount: pledgeType === 'monetary' ? Number(pledgeAmount) : undefined,
          details: pledgeDetails,
          stateCode: selectedState
        })
      });

      if (res.ok) {
        // Reset form
        setPledgeDetails('');
        setPledgeAmount('');
        // Refresh list
        const pledgesRes = await fetch('/api/kinship/pledges');
        if (pledgesRes.ok) setPledges(await pledgesRes.json());
        alert("Thank you, Sister! Your generous support has been logged to the community ledger.");
      }
    } catch (err) {
      console.error('Error submitting pledge:', err);
    } finally {
      setIsSubmittingPledge(false);
    }
  };

  // Handle resource mapping form submission
  const handleResourceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResTitle.trim() || !newResDesc.trim() || !newResZip.trim() || !newResContact.trim()) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsSubmittingResource(true);
    try {
      const res = await fetch('/api/kinship/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newResTitle,
          type: newResType,
          description: newResDesc,
          stateCode: newResState,
          cityZip: newResZip,
          contact: newResContact,
          addedBy: userName
        })
      });

      if (res.ok) {
        const newNode = await res.json();
        setResources(prev => [newNode, ...prev]);
        setSelectedNode(newNode);
        setNewResTitle('');
        setNewResDesc('');
        setNewResZip('');
        setNewResContact('');
        setResourceSuccess(true);
        setTimeout(() => setResourceSuccess(false), 4000);
        setShowAddForm(false);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to publish resource to the Kinship ledger.");
      }
    } catch (err) {
      console.error('Error adding resource:', err);
      alert("Error submitting resource to the server.");
    } finally {
      setIsSubmittingResource(false);
    }
  };

  // Handle expert directory opt-in / update
  const handleExpertSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingExpert(true);

    try {
      const res = await fetch('/api/kinship/experts/opt-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userName,
          stateCode: selectedState,
          expertTags: selectedTags,
          description: expertDescription,
          optIn: isExpert
        })
      });

      if (res.ok) {
        // Refresh experts list
        const expertsRes = await fetch('/api/kinship/experts');
        if (expertsRes.ok) setExperts(await expertsRes.json());
        alert(isExpert ? "Your expert profile is active and synced to the notification triggers!" : "Your expert profile has been deactivated.");
      }
    } catch (err) {
      console.error('Error updating expert status:', err);
    } finally {
      setIsSubmittingExpert(false);
    }
  };

  // Toggle tag helper
  const handleTagToggle = (tag: 'Genealogy' | 'Land Law' | 'Estate Trust') => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Predefined curriculum guides content
  const curriculumGuides = [
    {
      id: 'trusts',
      title: 'The Mechanics of Trusts: Protecting Land from Sale',
      duration: '12 min read',
      difficulty: 'Intermediate',
      sections: [
        {
          heading: 'Why Deeds are Vulnerable',
          text: 'Family land in individual names is subject to partition sales (where a distant relative sells their tiny share to developers), tax sales, and public lawsuits. An individual owner is easily targeted by modern financial speculators.'
        },
        {
          heading: 'The Shield of the Private Land Trust',
          text: 'By conveying individual deeds into an Irrevocable Private Land Trust, the title is removed from any individual. A trusted Board of Trustees manages the land on behalf of all family beneficiaries. This completely blocks partition sales: no individual owns a personal "slice" to sell.'
        },
        {
          heading: 'Practical Steps to Conveyance',
          text: '1. Appoint a legal family representative. 2. Draft a private Trust Agreement specifying that land cannot be divided or sold without a 100% unanimous family council vote. 3. Record a Quitclaim Deed transferring land from individual names to "The Family Trust Trustee".'
        }
      ]
    },
    {
      id: 'probate',
      title: 'Heirship & Inheritance: Avoiding Probate Traps',
      duration: '15 min read',
      difficulty: 'Advanced',
      sections: [
        {
          heading: 'The Sinking Sand of Intestacy',
          text: 'When a mother passes without a clear living trust, her assets enter the public probate court system under state intestacy laws. The state charges huge administrative fees, legal notices are published, and properties are frozen—often for years.'
        },
        {
          heading: 'The Living Trust Advantage',
          text: 'A Revocable Living Trust acts as an immediate sovereign pass-through. Since the trust owns the property, your passing does not trigger probate. Your Successor Trustee instantly takes control of the land and household assets private to the family, completely bypassing public court interference.'
        },
        {
          heading: 'Your Actionable Will & Trust Map',
          text: 'Ensure all bank balances, vehicles, and business LLC assets are placed into the Trust or have "Transfer on Death" (TOD) / "Payable on Death" (POD) designations to prevent court sieges.'
        }
      ]
    },
    {
      id: 'cash',
      title: 'Cash Management: Making Your Land Pay for Your Household',
      duration: '10 min read',
      difficulty: 'Foundational',
      sections: [
        {
          heading: 'Reversing the Land Drain',
          text: 'Land should never be a continuous drain of property taxes and maintenance bills. To build generational sustainability, your land must actively fund its own survival and support your household.'
        },
        {
          heading: 'Sovereign Income Micro-Strategies',
          text: '1. Soil Permaculture & Nursery: Propagate native medicinal plants (lavender, elderberry) to trade or package into finished products (salves). 2. Honey & Heirloom Eggs: Setting up a 10-hive apiary and 15 chickens pays for your annual taxes in a few weeks of cooperative barter sales. 3. Space Rental: Lease a quarter-acre for local community gardening or secure solar micro-generation.'
        },
        {
          heading: 'The Co-op Credit Ledger',
          text: 'Log your community mentorship hours on the Copper Ledger! Spend time credits to acquire labor (homeschool tutoring, weeding, legal research) without expending hard-earned cash.'
        }
      ]
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto my-3 px-1">
      
      {/* 1. Header with Title & Community Charter Privacy Flag */}
      <div className="border-b border-[#D4AF37]/30 pb-4">
        <div className="flex items-center space-x-2.5 text-copper-penny mb-1">
          <Landmark className="w-5 h-5 text-[#B87333]" />
          <span className="font-mono text-xs uppercase tracking-widest font-bold text-[#B87333]">Kinship Vault</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#1F1813]">
              The Generational Kinship &amp; Wealth Vault
            </h2>
            <p className="text-xs sm:text-sm text-[#2A221B]/80 max-w-2xl mt-1 leading-relaxed">
              Securing our ancestral lands, managing trust-backed family legacies, and matching our sisters with legal, financial, and genealogy experts in our private directory.
            </p>
          </div>
          
          {/* Support the Community Button inside the Hub */}
          <button 
            onClick={() => {
              const el = document.getElementById('support-portal');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="self-start md:self-center bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 text-[#1F1813] border border-[#D4AF37]/60 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center space-x-2 transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <Gift className="w-4 h-4 text-[#B87333]" />
            <span>💝 Support the Community</span>
          </button>
        </div>

        {/* Community Charter Privacy Notice */}
        <div className="mt-4 bg-[#FAF5EE] border border-[#D4AF37]/40 rounded-2xl p-4 flex items-start space-x-3.5 shadow-2xs">
          <ShieldCheck className="w-5 h-5 text-[#3A4C3A] flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold font-mono text-[#1F1813] uppercase tracking-wider">🔒 Privacy &amp; Community Guidelines</h4>
            <p className="text-[11px] text-[#2A221B]/85 mt-0.5 leading-relaxed">
              "This space provides shared resources, guides, and community connections. Your personal records and private family matters remain entirely your own. We support each other with knowledge and care."
            </p>
          </div>
        </div>
      </div>

      {/* Featured Spotlight Banner */}
      <SpotlightBanner banners={banners} banner={spotlightBanner} selectedState={selectedState} userName={userName} />

      {/* 2. Kinship Resource Map Section (Full Width) */}
      <div className="bg-[#121812] text-[#FAF5EE] border-2 border-emerald-800/40 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
        
        {/* Resource Map Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-800/30 pb-3">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400">
              <Globe className="w-5 h-5" />
              <h3 className="font-serif font-extrabold text-lg sm:text-xl text-[#FAF5EE]">
                Kinship Resource Map
              </h3>
            </div>
            <p className="text-[11px] text-emerald-200/80 font-mono mt-0.5">
              Community-driven network of organic garden plots, heirloom seed shares, and community tool libraries in <span className="text-amber-300 font-bold">{selectedState}</span>
            </p>
          </div>

          {/* Controls: Type Filter */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveTypeFilter('all')}
              className={`px-3 py-1 text-[10px] font-mono font-bold uppercase rounded-xl transition-all cursor-pointer ${
                activeTypeFilter === 'all'
                  ? 'bg-emerald-600 text-white shadow-sm border border-emerald-500'
                  : 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/30 hover:border-emerald-600/50'
              }`}
            >
              All Circles
            </button>
            <button
              type="button"
              onClick={() => setActiveTypeFilter('garden')}
              className={`px-2.5 py-1 text-[10px] font-mono font-bold uppercase rounded-xl transition-all cursor-pointer flex items-center space-x-1 ${
                activeTypeFilter === 'garden'
                  ? 'bg-emerald-600 text-white shadow-sm border border-emerald-500'
                  : 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/30 hover:border-emerald-600/50'
              }`}
            >
              <Sprout className="w-3 h-3 text-emerald-400" />
              <span>Gardens</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTypeFilter('seed_node')}
              className={`px-2.5 py-1 text-[10px] font-mono font-bold uppercase rounded-xl transition-all cursor-pointer flex items-center space-x-1 ${
                activeTypeFilter === 'seed_node'
                  ? 'bg-[#B87333] text-white shadow-sm border border-[#96551d]'
                  : 'bg-emerald-950/40 text-[#B87333] border border-emerald-800/30 hover:border-[#B87333]/50'
              }`}
            >
              <Leaf className="w-3 h-3 text-[#B87333]" />
              <span>Seeds</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTypeFilter('tool_library')}
              className={`px-2.5 py-1 text-[10px] font-mono font-bold uppercase rounded-xl transition-all cursor-pointer flex items-center space-x-1 ${
                activeTypeFilter === 'tool_library'
                  ? 'bg-rose-700 text-white shadow-sm border border-rose-600'
                  : 'bg-emerald-950/40 text-rose-300 border border-emerald-800/30 hover:border-rose-600/50'
              }`}
            >
              <Hammer className="w-3 h-3 text-rose-400" />
              <span>Tools</span>
            </button>
          </div>
        </div>

        {/* Map Container & Detail Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Interactive Map Visual (7 Cols) */}
          <div className="lg:col-span-7 bg-gradient-to-br from-[#FAF6EE] via-[#F3EDE0] to-[#E5DAC6] border-2 border-emerald-800/35 rounded-2xl relative overflow-hidden h-72 sm:h-96 shadow-inner flex flex-col justify-between p-3">
            
            {/* Paper Texture Soft Grainy Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-5 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-900 via-stone-900 to-black mix-blend-overlay" />
            
            {/* Topographical Contour Lines & Hand-drawn Terrain SVGs */}
            <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none select-none" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Elevation Contour 1 */}
              <path d="M -10,20 Q 20,35 40,15 T 80,30 T 110,20" fill="none" stroke="#047857" strokeWidth="0.5" />
              {/* Elevation Contour 2 (Dashed ridge) */}
              <path d="M -10,45 Q 30,15 60,50 T 110,35" fill="none" stroke="#B87333" strokeWidth="0.5" strokeDasharray="1,2" />
              {/* Elevation Contour 3 */}
              <path d="M -10,70 Q 25,90 55,60 T 110,75" fill="none" stroke="#047857" strokeWidth="0.5" />
              {/* Elevation Contour 4 */}
              <path d="M 15,100 Q 40,70 80,100" fill="none" stroke="#B87333" strokeWidth="0.5" strokeDasharray="2,2" />
              
              {/* Soft River outline flowing through */}
              <path d="M 50,-10 Q 55,40 35,65 T 60,110" fill="none" stroke="#047857" strokeWidth="0.6" strokeDasharray="1,3" />

              {/* Hand-drawn Mountain peak sketches */}
              <path d="M 10,25 L 15,18 L 20,25" fill="none" stroke="#B87333" strokeWidth="0.4" />
              <path d="M 13,25 L 17,20 L 22,25" fill="none" stroke="#B87333" strokeWidth="0.4" />
              <path d="M 85,75 L 90,67 L 95,75" fill="none" stroke="#B87333" strokeWidth="0.4" />
            </svg>

            {/* Styled Compass Rose */}
            <svg className="absolute right-3.5 bottom-3 w-10 h-10 opacity-25 pointer-events-none select-none" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="1">
              <circle cx="12" cy="12" r="9" strokeDasharray="1,1" />
              <path d="M12 2 L12 22 M2 12 L22 12" />
              <path d="M12 2 L13.5 8 L12 10 L10.5 8 Z" fill="#047857" />
              <path d="M12 22 L13.5 16 L12 14 L10.5 16 Z" fill="#047857" />
              <path d="M22 12 L16 13.5 L14 12 L16 10.5 Z" fill="#047857" />
              <path d="M2 12 L8 13.5 L10 12 L8 10.5 Z" fill="#047857" />
              <text x="11.2" y="5.5" fontSize="2.5" fontFamily="serif" fill="#047857" fontWeight="bold">N</text>
            </svg>

            {/* Header overlay for Active Circle scope */}
            <div className="flex items-center justify-between z-10">
              <div className="bg-emerald-950/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-emerald-800/40 flex items-center space-x-1.5 shadow-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                <span className="text-[9px] font-mono font-bold text-emerald-300 uppercase tracking-wider">
                  Community Circle: {selectedState} Circle
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-emerald-700 hover:bg-emerald-600 text-white text-[9px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border border-emerald-600 flex items-center space-x-1 transition-all cursor-pointer shadow-sm"
              >
                <Plus className="w-3 h-3" />
                <span>{showAddForm ? 'Cancel Map' : 'Share Local Resource'}</span>
              </button>
            </div>

            {/* Map Canvas Nodes Plotting Area */}
            <div className="flex-1 relative my-2">
              {loadingResources ? (
                <div className="absolute inset-0 flex items-center justify-center text-xs font-mono text-emerald-800 italic font-bold">
                  Loading community resources...
                </div>
              ) : resources.filter(
                r => r.stateCode === selectedState && (activeTypeFilter === 'all' || r.type === activeTypeFilter)
              ).length === 0 ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-2">
                  <p className="text-xs font-serif text-emerald-800 italic font-extrabold">
                    No community resources found in {selectedState} yet.
                  </p>
                  <p className="text-[10px] text-emerald-900/60 max-w-sm leading-relaxed font-mono">
                    Be the first sister to add a local seed library, garden plot, or tool share!
                  </p>
                </div>
              ) : (
                resources
                  .filter(r => r.stateCode === selectedState && (activeTypeFilter === 'all' || r.type === activeTypeFilter))
                  .map((node) => {
                    const coords = getCoordinatesForNode(node.id);
                    const isSelected = selectedNode?.id === node.id;
                    return (
                      <button
                        type="button"
                        key={node.id}
                        onClick={() => setSelectedNode(node)}
                        style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 group z-20 cursor-pointer focus:outline-none transition-all duration-300 hover:scale-125"
                      >
                        {/* Glow effect */}
                        <span className={`absolute inline-flex h-8 w-8 rounded-full opacity-35 -left-2 -top-2 ${
                          node.type === 'garden' 
                            ? 'bg-emerald-400' 
                            : node.type === 'seed_node' 
                            ? 'bg-amber-400' 
                            : 'bg-rose-400'
                        }`}></span>

                        {/* Topographic organic paper pin with custom leaf/seed/tool shape */}
                        <div className={`p-1.5 rounded-xl border shadow-md transition-all ${
                          isSelected 
                            ? 'ring-2 ring-emerald-600 scale-110 ' + (
                                node.type === 'garden' ? 'bg-emerald-100 border-emerald-600 text-emerald-800' : node.type === 'seed_node' ? 'bg-amber-100 border-[#B87333] text-amber-800' : 'bg-rose-100 border-rose-600 text-rose-800'
                              )
                            : (
                                node.type === 'garden' ? 'bg-[#FAF5EE] text-emerald-700 border-emerald-600/60 hover:bg-emerald-50' : node.type === 'seed_node' ? 'bg-[#FAF5EE] text-[#B87333] border-[#B87333]/60 hover:bg-amber-50' : 'bg-[#FAF5EE] text-rose-700 border-rose-500/60 hover:bg-rose-50'
                              )
                        }`}>
                          {node.type === 'garden' ? (
                            <Sprout className="w-3.5 h-3.5" />
                          ) : node.type === 'seed_node' ? (
                            <Leaf className="w-3.5 h-3.5" />
                          ) : (
                            <Hammer className="w-3.5 h-3.5" />
                          )}
                        </div>

                        {/* Hover Name Badge */}
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-7 hidden group-hover:block bg-[#120E0B] border border-emerald-800/50 text-[#FAF5EE] text-[9px] font-mono px-2 py-1 rounded shadow-lg whitespace-nowrap z-30">
                          {node.title} ({node.cityZip.split(',')[0].trim()})
                        </div>
                      </button>
                    );
                  })
              )}
            </div>

            {/* Latitude / Longitude simulation margins */}
            <div className="flex items-center justify-between text-[8px] font-mono text-emerald-800/70 z-10 pt-1 border-t border-emerald-800/20 select-none">
              <span>LAT COORD: 33.7490° N</span>
              <span>GRID TYPE: SISTER-LEAF INTERACTIVE LAND STAGE</span>
              <span>LON COORD: 84.3880° W</span>
            </div>
          </div>

          {/* Map Side Panel Detail / Add Form (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            
            {showAddForm ? (
              // Add New Resource Form
              <form onSubmit={handleResourceSubmit} className="bg-emerald-950/40 border border-emerald-800/30 rounded-2xl p-4 space-y-3 shadow-md animate-fade-in flex-1">
                <div className="flex items-center justify-between border-b border-emerald-800/20 pb-1.5">
                  <h4 className="font-serif font-bold text-xs text-[#FAF5EE] flex items-center gap-1">
                    <Plus className="w-4 h-4 text-emerald-400" />
                    <span>Share Local Community Resource</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="text-emerald-400 hover:underline text-[9px] font-mono cursor-pointer"
                  >
                    Close Form
                  </button>
                </div>

                {/* Resource Title */}
                <div className="space-y-1">
                  <label className="block text-[8px] font-mono text-emerald-300 uppercase tracking-wider font-bold">Resource Name</label>
                  <input
                    type="text"
                    required
                    value={newResTitle}
                    onChange={(e) => setNewResTitle(e.target.value)}
                    placeholder="e.g. Sisterhood Heirloom Seed Exchange"
                    className="w-full bg-emerald-950/60 border border-emerald-800/40 rounded-xl px-2.5 py-1.5 text-xs text-[#FAF5EE] placeholder-emerald-700/80 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Resource Type & State */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[8px] font-mono text-emerald-300 uppercase tracking-wider font-bold">Resource Type</label>
                    <select
                      value={newResType}
                      onChange={(e) => setNewResType(e.target.value as any)}
                      className="w-full bg-emerald-950/60 border border-emerald-800/40 rounded-xl px-2.5 py-1.5 text-xs text-[#FAF5EE] focus:outline-none focus:border-emerald-500"
                    >
                      <option value="garden" className="bg-emerald-950">Organic Garden</option>
                      <option value="seed_node" className="bg-emerald-950">Seed-Sharing Hub</option>
                      <option value="tool_library" className="bg-emerald-950">Tool Library</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[8px] font-mono text-emerald-300 uppercase tracking-wider font-bold">State Circle</label>
                    <select
                      value={newResState}
                      onChange={(e) => setNewResState(e.target.value)}
                      className="w-full bg-emerald-950/60 border border-emerald-800/40 rounded-xl px-2.5 py-1.5 text-xs text-[#FAF5EE] focus:outline-none focus:border-emerald-500"
                    >
                      {['GA', 'NY', 'CA', 'SC', 'TX', 'FL', 'AL', 'NC', 'TN', 'VA', 'IL', 'MD'].map(st => (
                        <option key={st} value={st} className="bg-emerald-950">{st}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* City/Zip & Contact */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[8px] font-mono text-emerald-300 uppercase tracking-wider font-bold">City/Zip Code</label>
                    <input
                      type="text"
                      required
                      value={newResZip}
                      onChange={(e) => setNewResZip(e.target.value)}
                      placeholder="e.g. Atlanta, 30331"
                      className="w-full bg-emerald-950/60 border border-emerald-800/40 rounded-xl px-2.5 py-1.5 text-xs text-[#FAF5EE] placeholder-emerald-700/80 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[8px] font-mono text-emerald-300 uppercase tracking-wider font-bold">Secure Contact</label>
                    <input
                      type="text"
                      required
                      value={newResContact}
                      onChange={(e) => setNewResContact(e.target.value)}
                      placeholder="e.g. seeds@coop.org"
                      className="w-full bg-emerald-950/60 border border-emerald-800/40 rounded-xl px-2.5 py-1.5 text-xs text-[#FAF5EE] placeholder-emerald-700/80 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Node Details Description */}
                <div className="space-y-1">
                  <label className="block text-[8px] font-mono text-emerald-300 uppercase tracking-wider font-bold">Detailed Description / Guidelines</label>
                  <textarea
                    required
                    rows={2}
                    value={newResDesc}
                    onChange={(e) => setNewResDesc(e.target.value)}
                    placeholder="Describe garden plots, seed varieties, or tool borrowing rules..."
                    className="w-full bg-emerald-950/60 border border-emerald-800/40 rounded-xl px-2.5 py-1.5 text-xs text-[#FAF5EE] placeholder-emerald-700/80 focus:outline-none focus:border-emerald-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingResource}
                  className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-mono font-bold uppercase tracking-wider rounded-xl shadow-xs transition-all flex items-center justify-center space-x-1 cursor-pointer disabled:bg-gray-700"
                >
                  {isSubmittingResource ? 'Publishing Resource...' : 'Publish to Kinship Map'}
                </button>
              </form>
            ) : selectedNode ? (
              // Selected Node Detail View
              <div className="bg-emerald-950/40 border border-emerald-800/30 rounded-2xl p-4.5 space-y-4 shadow-md flex-1 flex flex-col justify-between animate-fade-in">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className={`text-[8px] font-mono font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                      selectedNode.type === 'garden' 
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' 
                        : selectedNode.type === 'seed_node' 
                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20' 
                        : 'bg-rose-500/15 text-rose-400 border border-rose-500/20'
                    }`}>
                      {selectedNode.type === 'garden' ? '🌿 Organic Garden Plot' : selectedNode.type === 'seed_node' ? '🍂 Heirloom Seed share' : '🛠️ Tool library'}
                    </span>
                    <span className="text-[10px] text-emerald-300 font-mono font-bold bg-emerald-900/40 border border-emerald-800/50 px-2 py-0.5 rounded-lg flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-400" />
                      {selectedNode.stateCode} circle
                    </span>
                  </div>

                  <h4 className="font-serif font-extrabold text-[#FAF5EE] text-sm sm:text-base tracking-wide">
                    {selectedNode.title}
                  </h4>

                  <p className="text-xs text-emerald-100/90 leading-relaxed font-sans font-medium line-clamp-4">
                    {selectedNode.description}
                  </p>
                </div>

                <div className="space-y-2.5 pt-3 border-t border-emerald-900/40">
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-emerald-300">
                    <div className="bg-emerald-950/50 p-2 rounded-xl border border-emerald-900/30">
                      <span className="text-[8px] text-emerald-500 font-bold block uppercase">Coordinates:</span>
                      <strong className="text-emerald-100">{selectedNode.cityZip}</strong>
                    </div>
                    <div className="bg-emerald-950/50 p-2 rounded-xl border border-emerald-900/30">
                      <span className="text-[8px] text-emerald-500 font-bold block uppercase">Mapped By:</span>
                      <strong className="text-emerald-100">{selectedNode.addedBy}</strong>
                    </div>
                  </div>

                  <div className="bg-emerald-900/25 p-2 rounded-xl border border-emerald-800/40 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-emerald-400">Sister Contact:</span>
                    <a 
                      href={`mailto:${selectedNode.contact}`} 
                      className="text-amber-300 underline font-bold hover:text-amber-200"
                    >
                      {selectedNode.contact}
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              // Empty State
              <div className="bg-emerald-950/20 border border-emerald-800/20 rounded-2xl p-6 text-center text-xs font-mono text-emerald-300/60 italic flex-1 flex flex-col justify-center">
                Select a resource on the map circle to inspect its organic garden specifications, seeds catalog, or lending instructions.
              </div>
            )}

            {/* Success Prompt */}
            {resourceSuccess && (
              <div className="mt-3 p-3 bg-emerald-500/10 text-emerald-300 text-[11px] font-mono border border-emerald-500/30 rounded-xl flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Resource shared successfully on the Sovereign Kinship Ledger!</span>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Main Grid: Left 8 cols for Core Queries & Curriculum. Right 4 cols for Directory & Pledges */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: QUERY & CURRICULUM */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Root Ledger Query and AI Council with Automated Notification Engine Logs */}
          <div className="bg-white border border-copper-penny/15 rounded-3xl p-5 sm:p-6 shadow-md space-y-5">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-copper-penny/10 text-copper-penny flex items-center justify-center border border-copper-penny/25">
                <BookOpen className="w-5 h-5 text-copper-penny" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-[#1F1813]">Consult the Root Ledger</h3>
                <p className="text-[10px] font-mono text-soft-sage uppercase tracking-wider font-bold">Query Genealogy, Land Law, &amp; Estate Trusts</p>
              </div>
            </div>

            <form onSubmit={handleQuerySubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[9px] uppercase font-mono text-soft-sage font-bold tracking-wider">Your Inquiry / Research Search</label>
                <textarea 
                  required
                  rows={3}
                  value={queryPrompt}
                  onChange={(e) => setQueryPrompt(e.target.value)}
                  placeholder="e.g., How can I set up a land trust in Beaufort County SC for heir property to prevent land sale? Or search pre-1870 surnames..."
                  className="w-full bg-[#FAF5EE]/40 border border-copper-penny/20 focus:border-copper-penny focus:ring-1 focus:ring-copper-penny rounded-2xl px-4 py-3 text-xs text-[#1F1813] placeholder-gray-400 focus:outline-none transition-colors resize-none"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[10px] text-soft-sage italic">Automated routing matches keywords to tag experts instantly.</span>
                <button 
                  type="submit"
                  disabled={queryLoading || !queryPrompt.trim()}
                  className="px-6 py-2.5 bg-[#B87333] hover:bg-[#A85138] disabled:bg-gray-200 disabled:text-gray-400 text-white text-xs font-bold rounded-xl transition-all uppercase tracking-widest cursor-pointer shadow-sm flex items-center space-x-2"
                >
                  {queryLoading ? (
                    <span>Seeking Sister Knowledge...</span>
                  ) : (
                    <>
                      <span>Submit Inquiry</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Automated Notification Engine Trigger Live Output */}
            {engineLog && (
              <div className="bg-[#FAF5EE] border border-dashed border-[#D4AF37] rounded-2xl p-4 space-y-2 animate-fade-in">
                <div className="flex items-center space-x-2 text-[#D4AF37]">
                  <Bell className="w-4 h-4 text-[#B87333]" />
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-copper-penny">Sister Wisdom Alert Shared</span>
                </div>
                <div className="text-xs text-[#2A221B] space-y-1.5 leading-relaxed">
                  <p>
                    🔍 Inquiry Topic: <strong className="text-copper-penny font-mono text-[11px]">{engineLog.tagMatched}</strong>
                  </p>
                  <p className="text-[11px]">
                    📬 A gentle notification has been shared with knowledgeable sisters in our circle:
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {engineLog.matchedExperts.map((exp, idx) => (
                      <span key={idx} className="bg-white border border-[#D4AF37]/50 text-[#B87333] font-mono text-[9px] px-2 py-0.5 rounded-md font-semibold">
                        🌿 Ping Sent: {exp}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* AI response results */}
            {queryResponse && !queryLoading && (
              <div className="p-5 bg-white border-2 border-[#D4AF37]/30 rounded-2xl space-y-3.5 shadow-inner">
                <div className="flex items-center justify-between">
                  <span className="inline-block text-[9px] font-mono font-bold uppercase text-white bg-[#B87333] px-2.5 py-0.5 rounded shadow-2xs">
                    Ancestral Kinship Advice
                  </span>
                  <span className="text-[9px] font-mono text-soft-sage">Verified Wisdom</span>
                </div>
                <div className="text-xs text-[#2A221B]/95 leading-relaxed font-sans space-y-3">
                  {queryResponse.split('\n\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Maintenance Curriculum Knowledge-Base */}
          <div className="bg-white border border-copper-penny/15 rounded-3xl p-5 sm:p-6 shadow-md space-y-4">
            <div className="border-b border-copper-penny/10 pb-2 flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#1F1813]">Curriculum: Maintaining Sovereign Wealth</h3>
                <p className="text-[10px] font-mono text-soft-sage uppercase tracking-wider font-bold">Self-paced modular guides</p>
              </div>
              <span className="text-[10px] font-mono font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full">
                Modular Course
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {curriculumGuides.map((guide) => (
                <div 
                  key={guide.id}
                  onClick={() => setActiveGuide(activeGuide === guide.id ? null : guide.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer text-left space-y-2 ${
                    activeGuide === guide.id 
                      ? 'bg-[#FAF5EE] border-[#D4AF37] shadow-sm ring-1 ring-[#D4AF37]' 
                      : 'bg-white border-copper-penny/15 hover:border-copper-penny/35 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between text-[8px] font-mono font-bold uppercase text-soft-sage">
                    <span>{guide.difficulty}</span>
                    <span>{guide.duration}</span>
                  </div>
                  <h4 className="font-serif font-bold text-xs text-[#1F1813] leading-snug line-clamp-2">
                    {guide.title}
                  </h4>
                  <div className="flex items-center text-[10px] text-copper-penny font-bold font-mono">
                    <span>{activeGuide === guide.id ? 'Close Guide' : 'Read Guide'}</span>
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </div>
                </div>
              ))}
            </div>

            {/* Expanded Guide Content */}
            {activeGuide && (
              <div className="bg-[#FAF5EE] border border-[#D4AF37]/50 rounded-2xl p-5 space-y-4 animate-fade-in">
                {curriculumGuides.filter(g => g.id === activeGuide).map((guide) => (
                  <div key={guide.id} className="space-y-4">
                    <h3 className="font-serif font-extrabold text-[#1F1813] text-sm sm:text-base border-b border-[#D4AF37]/30 pb-2">
                      {guide.title}
                    </h3>
                    <div className="space-y-3">
                      {guide.sections.map((sec, i) => (
                        <div key={i} className="space-y-1">
                          <h4 className="font-serif font-bold text-xs text-[#B87333]">{sec.heading}</h4>
                          <p className="text-xs text-[#2A221B]/90 leading-relaxed font-sans">{sec.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Historical / Simulated Pings Stream */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-[#1F1813] border-b border-copper-penny/10 pb-1 flex items-center space-x-2">
              <Bell className="w-4 h-4 text-[#B87333]" />
              <span>Automated Notification Engine Feed</span>
            </h4>
            <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
              {notifications.length === 0 ? (
                <p className="text-xs text-soft-sage italic text-center py-4 bg-white rounded-2xl border border-copper-penny/10">No active notification events yet.</p>
              ) : (
                notifications.map((notif) => (
                  <div key={notif.id} className="p-3 bg-white border border-copper-penny/10 rounded-2xl flex items-start gap-3 shadow-2xs">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Bell className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-copper-penny">Engine Pinged Matching Mentors</span>
                        <span className="text-[9px] text-soft-sage font-mono">{notif.timestamp.split('T')[1]?.substring(0, 5) || 'Just now'}</span>
                      </div>
                      <p className="text-[#2A221B]/95">
                        New inquiry matching <strong className="text-emerald-700">{notif.tagMatched}</strong>: "{notif.queryTitle}"
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1 text-[9px] font-mono text-soft-sage">
                        <span>Pinged:</span>
                        {notif.matchedExperts.map((exp, i) => (
                          <span key={i} className="bg-emerald-50/70 border border-emerald-100 px-1.5 py-0.2 rounded font-semibold text-emerald-800">
                            {exp}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: DIRECTORIES & CONTRIBUTION PORTAL */}
        <div className="lg:col-span-4 space-y-6">

          {/* Support the Community / Contribution Portal Card */}
          <div id="support-portal" className="bg-[#FAF5EE] border-2 border-[#D4AF37]/50 rounded-3xl p-5 sm:p-6 space-y-4 shadow-lg">
            <div className="flex items-center space-x-2.5 text-[#B87333]">
              <Gift className="w-5 h-5" />
              <h4 className="font-serif font-extrabold text-[#1F1813] text-base sm:text-lg">Contribution Portal</h4>
            </div>
            
            <p className="text-xs text-[#2A221B]/85 leading-relaxed">
              Support server costs or offer physical goods, tax preparation, legal research, or genealogical expertise directly to our sisters.
            </p>

            <form onSubmit={handlePledgeSubmit} className="space-y-4.5 bg-white border border-copper-penny/10 rounded-2xl p-4 shadow-2xs">
              <div className="space-y-1">
                <label className="block text-[9px] uppercase font-mono text-soft-sage font-bold tracking-wider">Select Support Type</label>
                <div className="grid grid-cols-3 gap-2">
                  <button 
                    type="button"
                    onClick={() => setPledgeType('monetary')}
                    className={`py-1.5 px-2 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
                      pledgeType === 'monetary' 
                        ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#1F1813]' 
                        : 'border-copper-penny/15 text-soft-sage hover:bg-[#FAF5EE]'
                    }`}
                  >
                    💰 Money
                  </button>
                  <button 
                    type="button"
                    onClick={() => setPledgeType('skill')}
                    className={`py-1.5 px-2 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
                      pledgeType === 'skill' 
                        ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#1F1813]' 
                        : 'border-copper-penny/15 text-soft-sage hover:bg-[#FAF5EE]'
                    }`}
                  >
                    🛠️ Skill Offer
                  </button>
                  <button 
                    type="button"
                    onClick={() => setPledgeType('item')}
                    className={`py-1.5 px-2 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
                      pledgeType === 'item' 
                        ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#1F1813]' 
                        : 'border-copper-penny/15 text-soft-sage hover:bg-[#FAF5EE]'
                    }`}
                  >
                    📦 Physical Item
                  </button>
                </div>
              </div>

              {pledgeType === 'monetary' && (
                <div className="space-y-1 animate-fade-in">
                  <label className="block text-[9px] uppercase font-mono text-soft-sage font-bold tracking-wider">Donation Amount ($)</label>
                  <div className="relative">
                    <DollarSign className="w-3.5 h-3.5 absolute left-3 top-2.5 text-soft-sage" />
                    <input 
                      type="number"
                      required
                      value={pledgeAmount}
                      onChange={(e) => setPledgeAmount(e.target.value)}
                      placeholder="e.g. 25"
                      className="w-full bg-white border border-copper-penny/20 rounded-xl pl-8 pr-3.5 py-2 text-xs text-[#1F1813] placeholder-gray-400 focus:outline-none focus:border-copper-penny"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-[9px] uppercase font-mono text-soft-sage font-bold tracking-wider">
                  {pledgeType === 'monetary' ? 'Contribution Purpose' : pledgeType === 'skill' ? 'Describe the skill offered' : 'Describe the physical goods'}
                </label>
                <input 
                  type="text"
                  required
                  value={pledgeDetails}
                  onChange={(e) => setPledgeDetails(e.target.value)}
                  placeholder={pledgeType === 'monetary' ? 'Direct support for owner hosting' : pledgeType === 'skill' ? 'e.g. Tax preparation, Legal research, Land deeds' : 'e.g. 5 heirloom seeds, physical winter clothing'}
                  className="w-full bg-white border border-copper-penny/20 rounded-xl px-3.5 py-2 text-xs text-[#1F1813] placeholder-gray-400 focus:outline-none focus:border-copper-penny"
                />
              </div>

              <button 
                type="submit"
                disabled={isSubmittingPledge}
                className="w-full py-2 bg-[#B87333] hover:bg-[#A85138] text-white text-[10px] font-bold uppercase tracking-widest rounded-xl shadow-xs transition-all flex items-center justify-center space-x-1 cursor-pointer"
              >
                <span>Record Pledge</span>
              </button>
            </form>

            {/* Pledges Feed list */}
            <div className="space-y-2 bg-white rounded-2xl border border-copper-penny/10 p-3.5">
              <h5 className="text-[10px] font-mono font-bold uppercase text-soft-sage tracking-wider border-b border-copper-penny/5 pb-1">Community Support Ledger</h5>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {pledges.length === 0 ? (
                  <p className="text-[10px] text-soft-sage italic text-center py-2">Loading contributions...</p>
                ) : (
                  pledges.map((pl) => (
                    <div key={pl.id} className="text-[10px] border-b border-copper-penny/5 pb-1.5 last:border-0 flex items-start justify-between gap-1 leading-snug">
                      <div>
                        <strong className="text-[#1F1813]">{pl.donorName}</strong>
                        <span className="text-[#2A221B]/80 block">
                          {pl.pledgeType === 'monetary' ? `Pledged $${pl.amount}` : pl.details}
                        </span>
                        {pl.pledgeType === 'monetary' && <span className="text-[8px] text-soft-sage italic block">{pl.details}</span>}
                      </div>
                      <span className="text-[8px] font-mono text-soft-sage bg-[#FAF5EE] px-1 rounded uppercase flex-shrink-0">
                        {pl.pledgeType}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Expert/Mentor Directory & Opt-In System */}
          <div className="bg-white border border-copper-penny/15 rounded-3xl p-5 sm:p-6 space-y-4 shadow-md">
            <h3 className="font-serif font-bold text-base text-[#1F1813] flex items-center space-x-2">
              <Users className="w-5 h-5 text-[#B87333]" />
              <span>Expert &amp; Mentor Directory</span>
            </h3>
            
            <p className="text-xs text-[#2A221B]/80 leading-relaxed">
              Vetted sisters holding specialized expertise who have opted in to help guide lineages and estate transfers.
            </p>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {experts.filter(e => e.optIn).map((exp) => (
                <div key={exp.id} className="p-3 bg-[#FAF5EE] border border-[#D4AF37]/35 rounded-2xl space-y-1.5 shadow-2xs">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-serif font-bold text-xs text-[#1F1813] flex items-center gap-1">
                        🌿 {exp.name}
                      </h4>
                      <p className="text-[9px] font-mono uppercase text-soft-sage tracking-wider">{exp.stateCode} circle</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#2A221B]/90 font-sans leading-relaxed">
                    {exp.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {exp.expertTags.map((tag, idx) => (
                      <span key={idx} className="bg-white border border-[#D4AF37]/50 text-[#B87333] font-mono text-[8px] px-1.5 py-0.2 rounded font-semibold uppercase tracking-wider">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Vetted Expert Opt-In Form */}
            <div className="pt-3.5 border-t border-copper-penny/10 space-y-3">
              <h5 className="font-serif font-bold text-xs text-[#1F1813] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#3A4C3A]" />
                <span>Opt-In to Directory</span>
              </h5>
              <p className="text-[10px] text-soft-sage">Become a designated mentor! Select your tags and toggle expert status below.</p>

              <form onSubmit={handleExpertSubmit} className="space-y-3 bg-[#FAF5EE]/50 border border-copper-penny/10 rounded-2xl p-3.5">
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox"
                    id="isExpertCheckbox"
                    checked={isExpert}
                    onChange={(e) => setIsExpert(e.target.checked)}
                    className="w-3.5 h-3.5 text-copper-penny border-copper-penny/25 rounded cursor-pointer"
                  />
                  <label htmlFor="isExpertCheckbox" className="text-xs font-serif font-bold text-[#1F1813] cursor-pointer">
                    Toggle Mentor Status
                  </label>
                </div>

                {isExpert && (
                  <div className="space-y-3 animate-fade-in pt-1">
                    <div className="space-y-1">
                      <label className="block text-[8px] uppercase font-mono text-soft-sage font-bold tracking-wider">Select Expertise Areas</label>
                      <div className="flex flex-wrap gap-1.5">
                        {(['Genealogy', 'Land Law', 'Estate Trust'] as const).map((tag) => (
                          <button 
                            type="button"
                            key={tag}
                            onClick={() => handleTagToggle(tag)}
                            className={`px-2 py-1 rounded text-[9px] font-mono font-bold border transition-all cursor-pointer ${
                              selectedTags.includes(tag)
                                ? 'bg-copper-penny text-white border-transparent'
                                : 'bg-white text-soft-sage border-copper-penny/15 hover:bg-[#FAF5EE]'
                            }`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[8px] uppercase font-mono text-soft-sage font-bold tracking-wider">Bio / Mentor Details</label>
                      <input 
                        type="text"
                        required
                        value={expertDescription}
                        onChange={(e) => setExpertDescription(e.target.value)}
                        placeholder="e.g. Offering pre-1870 Southern courthouse records search support..."
                        className="w-full bg-white border border-copper-penny/20 rounded-xl px-2.5 py-1.5 text-xs text-[#1F1813] placeholder-gray-400 focus:outline-none focus:border-copper-penny"
                      />
                    </div>
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={isSubmittingExpert}
                  className="w-full py-1.5 bg-[#3A4C3A] hover:bg-[#2e3e2e] text-white text-[10px] font-bold uppercase tracking-widest rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  <span>Sync Expert Status</span>
                </button>
              </form>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
