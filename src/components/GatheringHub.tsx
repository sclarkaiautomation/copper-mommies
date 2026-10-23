import React, { useState } from 'react';
import { 
  MessageSquare, 
  Lock, 
  Key, 
  Globe, 
  ShieldCheck, 
  Send, 
  Calendar, 
  Clock, 
  MapPin, 
  Sparkles,
  Radio,
  Heart,
  CheckCircle2,
  Share2,
  HelpCircle,
  X,
  Volume2,
  Bell,
  Users,
  Utensils,
  Leaf,
  Plus,
  Compass,
  Smile,
  Coffee,
  Sun,
  Shield,
  Award,
  Flower2,
  Check,
  PhoneCall,
  UserCheck
} from 'lucide-react';
import { 
  Message, 
  CoopEvent, 
  StateComplianceConfig, 
  PageSpotlightBanner, 
  ScholarshipEntry,
  MealTrainRequest,
  IntergenerationalSisterPair,
  OfflinePodMeetup,
  VillagePoll
} from '../types';
import SpotlightBanner from './SpotlightBanner';
import HearthPollsCard from './HearthPollsCard';
import CircleMapInteractive from './CircleMapInteractive';

interface GatheringHubProps {
  chatMessages: Message[];
  newMessageText: string;
  onNewMessageChange: (text: string) => void;
  onSendMessage: () => void;
  isSendingMessage: boolean;
  selectedState: string;
  userPrivKey: string;
  serverPubKey: string;
  sharedSovereignSecret: string;
  eventsList: CoopEvent[];
  complianceNotice: StateComplianceConfig | null;
  onShowCompliance: () => void;
  spotlightBanner?: PageSpotlightBanner;
  banners?: PageSpotlightBanner[];
  onEnterContest?: (entry: ScholarshipEntry) => void;
  onOpenAudioLounge?: () => void;
  polls?: VillagePoll[];
  onVotePoll?: (pollId: string, optionId: string) => any;
  userName?: string;
  onSuggestPoll?: (pollId: any, suggestionText?: any) => void;
}

export default function GatheringHub({
  chatMessages,
  newMessageText,
  onNewMessageChange,
  onSendMessage,
  isSendingMessage,
  selectedState,
  userPrivKey,
  serverPubKey,
  sharedSovereignSecret,
  eventsList,
  complianceNotice,
  onShowCompliance,
  spotlightBanner,
  banners,
  onOpenAudioLounge,
  polls = [],
  onVotePoll,
  userName = 'Mama Shantrece',
  onSuggestPoll
}: GatheringHubProps) {
  // Navigation within the Copper Circle
  const [activeCircleTab, setActiveCircleTab] = useState<'casual-corner' | 'hearth-polls' | 'offline-village' | 'intergenerational' | 'covenant' | 'chat' | 'sister-circles'>('casual-corner');

  // Casual Corner Talk State
  const [hasRsvp, setHasRsvp] = useState(false);
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [topicSubject, setTopicSubject] = useState('');
  const [topicDetails, setTopicDetails] = useState('');
  const [topicCategory, setTopicCategory] = useState('Postpartum & Natural Healing');
  const [topicSubmitted, setTopicSubmitted] = useState(false);
  const [textAlertsEnabled, setTextAlertsEnabled] = useState(true);

  // 1. OFFLINE VILLAGE: Postpartum & Emergency Meal Trains State
  const [mealTrains, setMealTrains] = useState<MealTrainRequest[]>([
    {
      id: 'mt-1',
      motherName: 'Sister Anaya',
      cityState: 'Decatur, GA',
      occasion: 'Postpartum Newborn Care',
      story: 'Welcomed sweet baby boy Kairo on Sunday! Resting at home with big sister (age 3). Looking for warm postpartum healing soups, root vegetables, and herbal tea drops.',
      dietaryNotes: 'Dairy-free, loves bone broth, plantains, collards, and oat lactation muffins.',
      deliveryAddressArea: 'Decatur / Candler Park Area (Exact porch address given to confirmed sister)',
      neededDates: ['Tuesday, July 14', 'Thursday, July 16', 'Saturday, July 18', 'Monday, July 20'],
      pledgedVolunteers: [
        { id: 'pv-1', sisterName: 'Mama Shantrece', date: 'Tuesday, July 14', dishOrCare: 'Slow-simmered herbal bone broth & warm spelt cornbread', status: 'confirmed' },
        { id: 'pv-2', sisterName: 'Auntie Brenda', date: 'Thursday, July 16', dishOrCare: 'Roasted root veggies, stewed black lentils & sea moss smoothie', status: 'confirmed' }
      ],
      active: true,
      coordinatorName: 'Sister Jamila (Atlanta Care Spearhead)',
      stateCode: 'GA'
    },
    {
      id: 'mt-2',
      motherName: 'Sister Courtney',
      cityState: 'Houston, TX',
      occasion: 'Homestead / Garden Day',
      story: 'Building three raised herbal garden beds and nursery trellis for the summer homeschooling cohort. Sisters and older children invited for fresh harvest and homemade hibiscus tea!',
      dietaryNotes: 'Nut-free for little ones. Refreshments and garden lunch will be served.',
      deliveryAddressArea: 'Southwest Houston / Missouri City Homestead',
      neededDates: ['Saturday, July 18 @ 9:00 AM'],
      pledgedVolunteers: [
        { id: 'pv-3', sisterName: 'Mama Nia', date: 'Saturday, July 18 @ 9:00 AM', dishOrCare: 'Bringing 4 garden shovels + elderberry iced tea', status: 'confirmed' }
      ],
      active: true,
      coordinatorName: 'Sister Nia (Houston Pod)',
      stateCode: 'TX'
    }
  ]);

  const [showMealModal, setShowMealModal] = useState(false);
  const [selectedMealTrain, setSelectedMealTrain] = useState<MealTrainRequest | null>(null);
  const [pledgeDish, setPledgeDish] = useState('');
  const [pledgeDate, setPledgeDate] = useState('');
  const [pledgeSuccess, setPledgeSuccess] = useState(false);

  // New Meal Train Request Modal State
  const [showNewMealTrainModal, setShowNewMealTrainModal] = useState(false);
  const [newMtMother, setNewMtMother] = useState('');
  const [newMtLocation, setNewMtLocation] = useState(selectedState || 'GA');
  const [newMtOccasion, setNewMtOccasion] = useState<'Postpartum Newborn Care' | 'Family Recovery & Health' | 'Emergency Respite' | 'Homestead / Garden Day'>('Postpartum Newborn Care');
  const [newMtStory, setNewMtStory] = useState('');
  const [newMtDietary, setNewMtDietary] = useState('');
  const [newMtDates, setNewMtDates] = useState('');

  // 2. OFFLINE POD MEETUPS State
  const [podMeetups, setPodMeetups] = useState<OfflinePodMeetup[]>([
    {
      id: 'pod-1',
      title: 'Summer Porch Tea & Herbal Medicine Making',
      category: 'In-Person Tea Circle',
      stateCode: 'GA',
      locationCity: 'Atlanta, GA',
      exactMeetingSpot: 'Sister Brenda’s Shaded Garden Porch, Southwest Atlanta',
      date: 'Saturday, July 18, 2026',
      time: '11:00 AM – 1:30 PM EST',
      hostSister: 'Auntie Brenda (Wisdom Keeper, Age 54)',
      description: 'Bring your favorite dried herbs or home garden clippings! We will blend seasonal immune teas, make chamomile infusions for our children, and fellowship on the porch with fresh cold water & elderberry spritzers.',
      attendingCount: 8,
      bringItems: ['1-2 clean glass mason jars', 'Favorite dried herbs or mint from your yard', 'A blanket or folding lawn chair'],
      rsvpdMembers: ['Mama Shantrece', 'Sister Nia', 'Mama Jamila', 'Sister Keisha']
    },
    {
      id: 'pod-2',
      title: 'Heirloom Seed, Cuttings & Children’s Book Swap',
      category: 'Heirloom Seed & Clothing Swap',
      stateCode: 'GA',
      locationCity: 'Stone Mountain, GA',
      exactMeetingSpot: 'Wade Walker Park Pavilion #2',
      date: 'Sunday, July 26, 2026',
      time: '2:00 PM – 4:30 PM EST',
      hostSister: 'Sister Jamila (Anchor Matriarch, Age 43)',
      description: 'Exchange heirloom seeds (okra, collards, sweet potatoes), swap gently loved homeschool readers and children’s summer clothes, and let the children play together freely in nature.',
      attendingCount: 12,
      bringItems: ['Heirloom seeds or houseplant cuttings in labeled bags', 'Gently read children’s books (Grades K-6)', 'Picnic snacks for your family'],
      rsvpdMembers: ['Mama Shantrece', 'Sister Courtney', 'Auntie Brenda']
    }
  ]);

  const [showPodModal, setShowPodModal] = useState(false);
  const [newPodTitle, setNewPodTitle] = useState('');
  const [newPodCategory, setNewPodCategory] = useState<'In-Person Tea Circle' | 'Homeschool Field Trip' | 'Heirloom Seed & Clothing Swap' | 'Homestead & Garden Day' | 'Care Squad Drop-Off'>('In-Person Tea Circle');
  const [newPodCity, setNewPodCity] = useState('');
  const [newPodSpot, setNewPodSpot] = useState('');
  const [newPodDate, setNewPodDate] = useState('');
  const [newPodTime, setNewPodTime] = useState('');
  const [newPodDesc, setNewPodDesc] = useState('');
  const [newPodItems, setNewPodItems] = useState('');

  // 3. INTERGENERATIONAL SISTERHOOD State
  const [sisterPairs, setSisterPairs] = useState<IntergenerationalSisterPair[]>([
    {
      id: 'isp-1',
      mentorName: 'Auntie Brenda (Age 54)',
      mentorBracket: '50–60 (Wisdom Keeper)',
      menteeName: 'Sister Jamila (Age 34)',
      menteeBracket: '30–39 (Builder & Nurturer)',
      giftOffer: 'Traditional Georgia roots herbal poultices, postpartum womb wrapping & calm marriage navigation',
      twoWayExchange: 'Setting up automated homeschool calendar loops, digital recipe preservation & bulk cooperative grocery ordering',
      meetingRhythm: 'Sunday evening porch calls + monthly garden tea',
      status: 'Active Circle',
      stateCode: 'GA'
    },
    {
      id: 'isp-2',
      mentorName: 'Mama Carolyn (Age 58)',
      mentorBracket: '50–60 (Wisdom Keeper)',
      menteeName: 'Sister Nia (Age 32)',
      menteeBracket: '30–39 (Builder & Nurturer)',
      giftOffer: 'Generational homesteading, preserving wild blackberries, and raising resilient boys into honorable young men',
      twoWayExchange: 'Mobile bookkeeping tools, farm co-op marketing & digital seed cataloging',
      meetingRhythm: 'Bi-weekly Thursday Circle check-in',
      status: 'Active Circle',
      stateCode: 'TX'
    },
    {
      id: 'isp-3',
      mentorName: 'Mama Yvonne (Age 47)',
      mentorBracket: '40–49 (Anchor Matriarch)',
      menteeName: 'Sister Shantrece (Age 36)',
      menteeBracket: '30–39 (Builder & Nurturer)',
      giftOffer: 'Navigating homeschool high school credits, balancing entrepreneurship with family peace, and estate land trusts',
      twoWayExchange: 'Clean beauty apothecary formulations & digital curriculum design',
      meetingRhythm: 'First & Third Tuesday Sister Calls',
      status: 'Active Circle',
      stateCode: 'GA'
    }
  ]);

  const [showPairingModal, setShowPairingModal] = useState(false);
  const [pairMyBracket, setPairMyBracket] = useState<'30–39 (Builder & Nurturer)' | '40–49 (Anchor Matriarch)' | '50–60 (Wisdom Keeper)'>('30–39 (Builder & Nurturer)');
  const [pairMyOffer, setPairMyOffer] = useState('');
  const [pairMyDesire, setPairMyDesire] = useState('');
  const [pairSubmitted, setPairSubmitted] = useState(false);

  // Handlers
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim()) return;
    onSendMessage();
  };

  const handleTopicSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicSubject.trim()) return;
    setTopicSubmitted(true);
    setTimeout(() => {
      setTopicSubmitted(false);
      setShowTopicModal(false);
      setTopicSubject('');
      setTopicDetails('');
    }, 2000);
  };

  const handlePledgeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMealTrain || !pledgeDish.trim() || !pledgeDate) return;

    setMealTrains(prev => prev.map(mt => {
      if (mt.id === selectedMealTrain.id) {
        return {
          ...mt,
          pledgedVolunteers: [
            ...mt.pledgedVolunteers,
            {
              id: `pv-${Date.now()}`,
              sisterName: 'Mama Shantrece',
              date: pledgeDate,
              dishOrCare: pledgeDish.trim(),
              status: 'confirmed'
            }
          ]
        };
      }
      return mt;
    }));

    setPledgeSuccess(true);
    setTimeout(() => {
      setPledgeSuccess(false);
      setShowMealModal(false);
      setSelectedMealTrain(null);
      setPledgeDish('');
      setPledgeDate('');
    }, 2000);
  };

  const handleCreateMealTrain = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMtMother.trim() || !newMtStory.trim()) return;

    const newEntry: MealTrainRequest = {
      id: `mt-${Date.now()}`,
      motherName: newMtMother.trim(),
      cityState: newMtLocation.trim(),
      occasion: newMtOccasion,
      story: newMtStory.trim(),
      dietaryNotes: newMtDietary.trim() || 'No specific restrictions noted; warm nourishing foods preferred.',
      deliveryAddressArea: `${newMtLocation} area (Porch details confirmed with volunteer sisters)`,
      neededDates: newMtDates.split(',').map(d => d.trim()).filter(Boolean),
      pledgedVolunteers: [],
      active: true,
      coordinatorName: 'Mama Shantrece (Community Sister)',
      stateCode: selectedState || 'GA'
    };

    setMealTrains(prev => [newEntry, ...prev]);
    setShowNewMealTrainModal(false);
    setNewMtMother('');
    setNewMtStory('');
    setNewMtDietary('');
    setNewMtDates('');
    alert('Meal Train & Care Squad Request posted with love! Sisters in your area have been notified.');
  };

  const handleCreatePod = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPodTitle.trim() || !newPodCity.trim() || !newPodDate.trim()) return;

    const newPod: OfflinePodMeetup = {
      id: `pod-${Date.now()}`,
      title: newPodTitle.trim(),
      category: newPodCategory,
      stateCode: selectedState || 'GA',
      locationCity: newPodCity.trim(),
      exactMeetingSpot: newPodSpot.trim() || `${newPodCity} Community Location`,
      date: newPodDate.trim(),
      time: newPodTime.trim() || 'TBD',
      hostSister: 'Mama Shantrece',
      description: newPodDesc.trim(),
      attendingCount: 1,
      bringItems: newPodItems ? newPodItems.split(',').map(i => i.trim()) : ['Your radiant smile and sisterly spirit'],
      rsvpdMembers: ['Mama Shantrece']
    };

    setPodMeetups(prev => [newPod, ...prev]);
    setShowPodModal(false);
    setNewPodTitle('');
    setNewPodCity('');
    setNewPodSpot('');
    setNewPodDate('');
    setNewPodTime('');
    setNewPodDesc('');
    setNewPodItems('');
    alert('Sisterhood Meetup created successfully! It is now live for all sisters in your region.');
  };

  const handleRsvpPod = (podId: string) => {
    setPodMeetups(prev => prev.map(pod => {
      if (pod.id === podId) {
        const isRsvpd = pod.rsvpdMembers.includes('Mama Shantrece');
        return {
          ...pod,
          attendingCount: isRsvpd ? pod.attendingCount - 1 : pod.attendingCount + 1,
          rsvpdMembers: isRsvpd 
            ? pod.rsvpdMembers.filter(m => m !== 'Mama Shantrece')
            : [...pod.rsvpdMembers, 'Mama Shantrece']
        };
      }
      return pod;
    }));
  };

  const handlePairingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pairMyOffer.trim() || !pairMyDesire.trim()) return;

    setPairSubmitted(true);
    setTimeout(() => {
      setPairSubmitted(false);
      setShowPairingModal(false);
      setPairMyOffer('');
      setPairMyDesire('');
      alert('Your Intergenerational Sisterhood profile is active! Our Matriarchs will introduce your partner sister during the upcoming Casual Corner circle.');
    }, 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto my-2">
      
      {/* Header */}
      <div className="border-b border-[#D4AF37]/30 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2.5 text-copper-penny mb-1">
            <Heart className="w-5 h-5 text-[#B87333] fill-[#B87333]/20" />
            <span className="font-mono text-xs uppercase tracking-widest font-semibold text-[#B87333]">District 4 • Sisterhood Sanctuary</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#1F1813] flex items-center gap-2">
            <span>The Copper Circle</span>
            <span className="text-xs font-mono font-bold uppercase bg-[#D4AF37]/15 text-[#B87333] border border-[#D4AF37]/35 px-2.5 py-0.5 rounded-full">
              Sisters Helping Sisters
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-[#2A221B]/80 max-w-2xl mt-0.5 leading-relaxed">
            A spiritual, modern home where melanated mothers (ages 30–60) bridge screen connections into real-world village care, postpartum meal trains, intergenerational wisdom, and lasting sisterhood.
          </p>
        </div>

        {/* State Tag */}
        <div className="flex items-center space-x-2 bg-white px-3.5 py-1.5 rounded-xl border border-copper-penny/20 shadow-xs self-start sm:self-auto">
          <MapPin className="w-4 h-4 text-[#B87333]" />
          <span className="text-xs font-mono font-bold text-[#1F1813]">{selectedState} Sisterhood Pod</span>
        </div>
      </div>

      {/* Featured Spotlight Banner */}
      <SpotlightBanner banners={banners} banner={spotlightBanner} selectedState={selectedState} />

      {/* PILL SUB-NAVIGATION FOR SISTERHOOD HUBS */}
      <div className="bg-[#FAF5EE] border border-copper-penny/20 rounded-2xl p-1.5 flex flex-wrap gap-1.5 shadow-sm">
        
        <button
          onClick={() => setActiveCircleTab('casual-corner')}
          className={`flex-1 min-w-[140px] px-3.5 py-2.5 rounded-xl text-xs font-serif font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
            activeCircleTab === 'casual-corner'
              ? 'bg-[#B87333] text-white shadow-md'
              : 'text-[#1F1813] hover:bg-white/80'
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>The Casual Corner Talk</span>
        </button>

        <button
          id="tab-hearth-polls-btn"
          onClick={() => setActiveCircleTab('hearth-polls')}
          className={`flex-1 min-w-[140px] px-3.5 py-2.5 rounded-xl text-xs font-serif font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
            activeCircleTab === 'hearth-polls'
              ? 'bg-[#B87333] text-white shadow-md'
              : 'text-[#1F1813] hover:bg-white/80'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Community Polls &amp; Ballots</span>
          {polls.filter(p => p.active !== false && p.isOpen !== false).length > 0 && (
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full font-bold ${
              activeCircleTab === 'hearth-polls' ? 'bg-[#D4AF37] text-[#1F140E]' : 'bg-[#B87333] text-white'
            }`}>
              {polls.filter(p => p.active !== false && p.isOpen !== false).length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveCircleTab('sister-circles')}
          className={`flex-1 min-w-[140px] px-3.5 py-2.5 rounded-xl text-xs font-serif font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
            activeCircleTab === 'sister-circles'
              ? 'bg-[#B87333] text-white shadow-md'
              : 'text-[#1F1813] hover:bg-white/80'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Sister Circles</span>
        </button>

        <button
          onClick={() => setActiveCircleTab('offline-village')}
          className={`flex-1 min-w-[140px] px-3.5 py-2.5 rounded-xl text-xs font-serif font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
            activeCircleTab === 'offline-village'
              ? 'bg-[#B87333] text-white shadow-md'
              : 'text-[#1F1813] hover:bg-white/80'
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span>Offline Village &amp; Meal Trains</span>
        </button>

        <button
          onClick={() => setActiveCircleTab('intergenerational')}
          className={`flex-1 min-w-[140px] px-3.5 py-2.5 rounded-xl text-xs font-serif font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
            activeCircleTab === 'intergenerational'
              ? 'bg-[#B87333] text-white shadow-md'
              : 'text-[#1F1813] hover:bg-white/80'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Intergenerational Bridge (30–60)</span>
        </button>

        <button
          onClick={() => setActiveCircleTab('covenant')}
          className={`flex-1 min-w-[140px] px-3.5 py-2.5 rounded-xl text-xs font-serif font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
            activeCircleTab === 'covenant'
              ? 'bg-[#B87333] text-white shadow-md'
              : 'text-[#1F1813] hover:bg-white/80'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Sisterhood Covenant &amp; Peace</span>
        </button>

        <button
          onClick={() => setActiveCircleTab('chat')}
          className={`flex-1 min-w-[140px] px-3.5 py-2.5 rounded-xl text-xs font-serif font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
            activeCircleTab === 'chat'
              ? 'bg-[#B87333] text-white shadow-md'
              : 'text-[#1F1813] hover:bg-white/80'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Private Circle Chat</span>
        </button>

      </div>

      {/* ========================================================================= */}
      {/* TAB 1: THE CASUAL CORNER TALK (HERO FEATURE) */}
      {/* ========================================================================= */}
      {activeCircleTab === 'casual-corner' && (
        <div className="space-y-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EE] to-[#F5ECE1] border-2 border-[#B87333]/35 shadow-xl p-6 sm:p-8 space-y-6 text-center">
            
            {/* Background warmth */}
            <div className="absolute -top-20 -left-20 w-72 h-72 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-[#B87333]/10 rounded-full blur-3xl pointer-events-none" />

            {/* 1. Centered Pre-Heading & Title */}
            <div className="space-y-2 max-w-3xl mx-auto">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#B87333]/15 border border-[#B87333]/35 text-[#B87333] text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest">
                <Radio className="w-3.5 h-3.5 text-[#B87333]" />
                <span>The Copper Circle Signature Series</span>
              </div>

              <h3 className="font-serif font-extrabold text-2xl sm:text-4xl text-[#1F1813] tracking-tight leading-tight">
                The Casual Corner Talk
              </h3>

              <p className="text-xs sm:text-sm font-mono text-[#B87333] font-bold uppercase tracking-wider">
                Real Talk on Motherhood, Sisterhood &amp; Family Wisdom
              </p>
            </div>

            {/* 2. Centered Framed Feature Image */}
            <div className="max-w-2xl mx-auto relative group">
              <div className="relative rounded-3xl overflow-hidden border-2 border-[#B87333]/40 shadow-2xl bg-[#1F1813] transition-all duration-300 group-hover:shadow-[0_12px_36px_rgba(184,115,51,0.25)]">
                <img 
                  src="/The Casual Corner Talk.jpeg" 
                  alt="The Casual Corner Talk — The Copper Circle" 
                  className="w-full h-auto max-h-[420px] object-cover object-center transform group-hover:scale-[1.015] transition-transform duration-500"
                />

                {/* Ambient image vignette overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1F1813]/70 via-transparent to-transparent pointer-events-none" />

                {/* Floating Live Badge Top Left */}
                <div className="absolute top-3 left-3 bg-[#1F1813]/85 text-[#D4AF37] border border-[#D4AF37]/50 backdrop-blur-xs px-3 py-1 rounded-full text-[10px] font-mono font-bold flex items-center space-x-1.5 shadow-md">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Live Sister Circle</span>
                </div>

                {/* Floating Micro Tag Bottom Right */}
                <div className="absolute bottom-3 right-3 bg-[#1F1813]/85 text-[#FAF5EE] border border-[#B87333]/40 backdrop-blur-xs px-3 py-1 rounded-xl text-[10px] font-mono flex items-center space-x-1.5 shadow-md">
                  <Volume2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>The Copper Circle Talks</span>
                </div>
              </div>
            </div>

            {/* 3. Centered Narrative */}
            <div className="max-w-3xl mx-auto space-y-4">
              <p className="text-xs sm:text-sm sm:leading-relaxed text-[#2A221B]/90 font-medium">
                Welcome to <strong>The Casual Corner Talk</strong> — our cozy fireside living room conversation space where we pull up a seat, kick off our shoes, and talk about the real things on our hearts. No masks, no judgment, just authentic sisters sharing the sacred work of raising children, healing our bodies, and flourishing together.
              </p>
              <p className="text-[11px] sm:text-xs text-[#2A221B]/75 leading-relaxed">
                From natural postpartum recovery and homeschooling navigation to kitchen garden remedies, entrepreneurship, and keeping our cultural traditions alive, we share practical wisdom, laugh together, and support one another through every stage of womanhood.
              </p>

              {/* Jumpstart Topic Pillars */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
                <span className="bg-white/80 border border-copper-penny/25 text-[#1F1813] text-[10px] font-mono px-2.5 py-1 rounded-full font-semibold shadow-2xs">
                  🌿 Natural Postpartum &amp; Womb Care
                </span>
                <span className="bg-white/80 border border-copper-penny/25 text-[#1F1813] text-[10px] font-mono px-2.5 py-1 rounded-full font-semibold shadow-2xs">
                  📚 Homeschooling &amp; Real Learning
                </span>
                <span className="bg-white/80 border border-copper-penny/25 text-[#1F1813] text-[10px] font-mono px-2.5 py-1 rounded-full font-semibold shadow-2xs">
                  🏡 Kitchen Gardens &amp; Fresh Food
                </span>
                <span className="bg-white/80 border border-copper-penny/25 text-[#1F1813] text-[10px] font-mono px-2.5 py-1 rounded-full font-semibold shadow-2xs">
                  🍲 Heirlooms, Recipes &amp; Lineage
                </span>
                <span className="bg-white/80 border border-copper-penny/25 text-[#1F1813] text-[10px] font-mono px-2.5 py-1 rounded-full font-semibold shadow-2xs">
                  🤝 Intergenerational Sisterhood Mentorship
                </span>
                <span className="bg-white/80 border border-copper-penny/25 text-[#1F1813] text-[10px] font-mono px-2.5 py-1 rounded-full font-semibold shadow-2xs">
                  🕊️ Sacred Porch Rule &amp; Family Peace
                </span>
              </div>

              {/* Centered Interactive Action Buttons */}
              <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
                
                {onOpenAudioLounge && (
                  <button
                    onClick={onOpenAudioLounge}
                    className="px-5 py-2.5 bg-[#1F140E] hover:bg-[#2A1D16] text-[#D4AF37] font-bold text-xs rounded-xl shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center space-x-2 cursor-pointer border border-[#D4AF37]/50"
                  >
                    <span>🎙️ Listen in Audio Sanctuary &amp; Radio</span>
                  </button>
                )}

                <button
                  onClick={() => setShowTopicModal(true)}
                  className="px-5 py-2.5 bg-[#B87333] hover:bg-[#A85138] text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center space-x-2 cursor-pointer border border-[#96551d]/40"
                >
                  <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
                  <span>Suggest a Topic or Question</span>
                </button>

                <button
                  onClick={() => setActiveCircleTab('hearth-polls')}
                  className="px-5 py-2.5 bg-[#FAF5EE] hover:bg-white text-[#1F1813] font-bold text-xs rounded-xl shadow-sm border border-[#D4AF37]/50 hover:border-[#D4AF37] active:scale-95 transition-all flex items-center space-x-2 cursor-pointer"
                >
                  <Award className="w-4 h-4 text-[#B87333]" />
                  <span>Vote on Topics &amp; Classes ({polls.filter(p => p.active !== false && p.isOpen !== false).length} Open)</span>
                </button>

                <button
                  onClick={() => setHasRsvp(!hasRsvp)}
                  className={`px-5 py-2.5 font-bold text-xs rounded-xl border transition-all flex items-center space-x-2 cursor-pointer ${
                    hasRsvp
                      ? 'bg-emerald-800 text-white border-emerald-900 shadow-md'
                      : 'bg-white hover:bg-[#FAF5EE] text-[#1F1813] border-copper-penny/35 hover:border-copper-penny shadow-sm'
                  }`}
                >
                  {hasRsvp ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                      <span>RSVP Confirmed for Next Talk!</span>
                    </>
                  ) : (
                    <>
                      <Calendar className="w-4 h-4 text-[#B87333]" />
                      <span>RSVP for Next Live Session</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setTextAlertsEnabled(!textAlertsEnabled)}
                  className={`px-3.5 py-2 text-[11px] font-mono rounded-xl border transition-all flex items-center space-x-1.5 cursor-pointer ${
                    textAlertsEnabled
                      ? 'bg-[#FAF5EE] text-[#3A4C3A] border-[#3A4C3A]/30 font-semibold'
                      : 'bg-white text-gray-500 border-gray-300'
                  }`}
                  title="SMS alerts for upcoming live talks & meetups"
                >
                  <Bell className="w-3.5 h-3.5 text-[#B87333]" />
                  <span>{textAlertsEnabled ? 'SMS Alerts Active' : 'Enable SMS Alerts'}</span>
                </button>

              </div>

              {/* Schedule Caption */}
              <div className="pt-1 text-[10px] font-mono text-soft-sage">
                <span>Next Live Session: <strong>Thursday @ 7:30 PM EST</strong> • Open to All Verified Members</span>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: HEARTH POLLS & TOPIC VOTING HUB */}
      {/* ========================================================================= */}
      {activeCircleTab === 'hearth-polls' && (
        <div id="hearth-polls-section" className="space-y-6">
          <HearthPollsCard 
            polls={polls}
            onVote={onVotePoll || (async () => {})}
            currentUserName={userName}
            onSuggestPoll={onSuggestPoll ? (sug: any) => {
              const text = typeof sug === 'string' ? sug : sug.title || sug.topic || 'New suggestion';
              onSuggestPoll('poll-1', text);
            } : undefined}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: OFFLINE VILLAGE & POSTPARTUM MEAL TRAINS */}
      {/* ========================================================================= */}
      {activeCircleTab === 'offline-village' && (
        <div className="space-y-6">
          
          {/* Top Banner explaining O2O flow */}
          <div className="bg-gradient-to-r from-[#FAF5EE] via-white to-[#FAF5EE] border-2 border-[#B87333]/30 rounded-3xl p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-2 max-w-2xl">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-[#B87333]/15 text-[#B87333] px-2.5 py-0.5 rounded-full border border-copper-penny/25 inline-flex items-center gap-1.5">
                <Utensils className="w-3 h-3 text-[#B87333]" />
                <span>The Real-Life Village • Online to Offline</span>
              </span>
              <h3 className="font-serif font-extrabold text-xl sm:text-2xl text-[#1F1813]">
                Sisterhood Care Squads &amp; Postpartum Meal Trains
              </h3>
              <p className="text-xs sm:text-sm text-[#2A221B]/80 leading-relaxed">
                When a sister brings a new baby into this world or navigates a heavy season, our community steps onto her porch. No mother in our circle heals alone. Volunteer to drop off warm meals, fresh herbal broths, or organize in-person garden and homeschool playdates.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowNewMealTrainModal(true)}
                className="px-4 py-2.5 bg-[#B87333] hover:bg-[#A85138] text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center space-x-2 cursor-pointer transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Request Meal Train / Care Squad</span>
              </button>

              <button
                onClick={() => setShowPodModal(true)}
                className="px-4 py-2.5 bg-white hover:bg-[#FAF5EE] border border-copper-penny/35 text-[#1F1813] text-xs font-bold rounded-xl shadow-sm flex items-center justify-center space-x-2 cursor-pointer transition-all"
              >
                <Users className="w-4 h-4 text-[#B87333]" />
                <span>Plan Local Meetup or Pod</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left 7 Columns: Active Meal Trains */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between border-b border-copper-penny/15 pb-2">
                <div className="flex items-center space-x-2 text-[#B87333]">
                  <Utensils className="w-5 h-5 text-[#B87333]" />
                  <h4 className="font-serif font-bold text-lg text-[#1F1813]">Active Meal Trains &amp; Porch Drops</h4>
                </div>
                <span className="text-[10px] font-mono text-soft-sage font-bold uppercase">{selectedState} Circle</span>
              </div>

              <div className="space-y-4">
                {mealTrains.map((mt) => (
                  <div key={mt.id} className="bg-white border-2 border-copper-penny/20 hover:border-copper-penny/40 rounded-2xl p-5 shadow-sm space-y-4 transition-all">
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-copper-penny/10 pb-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h5 className="font-serif font-extrabold text-base text-[#1F1813]">{mt.motherName}</h5>
                          <span className="text-[9px] font-mono uppercase bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold border border-amber-300">
                            {mt.occasion}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono text-soft-sage flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-[#B87333]" />
                          <span>{mt.cityState} • Coordinated by {mt.coordinatorName}</span>
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedMealTrain(mt);
                          setShowMealModal(true);
                        }}
                        className="px-3.5 py-1.5 bg-[#B87333] hover:bg-[#A85138] text-white text-xs font-bold rounded-lg shadow-sm flex items-center space-x-1.5 cursor-pointer transition-all self-start sm:self-auto"
                      >
                        <Heart className="w-3.5 h-3.5 text-rose-200 fill-rose-200" />
                        <span>Pledge a Meal / Broth</span>
                      </button>
                    </div>

                    <p className="text-xs text-[#2A221B]/85 leading-relaxed font-sans">
                      "{mt.story}"
                    </p>

                    <div className="bg-[#FAF5EE] p-3 rounded-xl border border-copper-penny/15 text-xs space-y-1">
                      <span className="text-[10px] font-mono uppercase font-bold text-copper-penny block">Dietary &amp; Food Preferences:</span>
                      <p className="text-[#2A221B]/80 text-[11px]">{mt.dietaryNotes}</p>
                    </div>

                    {/* Pledged Volunteer Slots */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-mono uppercase font-bold text-soft-sage block">Confirmed Sister Deliveries:</span>
                      {mt.pledgedVolunteers.length === 0 ? (
                        <span className="text-xs text-soft-sage italic block">No sister deliveries pledged yet. Be the first to gift her porch!</span>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {mt.pledgedVolunteers.map((pv) => (
                            <div key={pv.id} className="p-2 bg-emerald-50/70 border border-emerald-200 rounded-lg text-[11px] space-y-0.5">
                              <div className="flex items-center justify-between font-bold text-emerald-950">
                                <span>{pv.sisterName}</span>
                                <span className="text-[9px] font-mono text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">✓ Confirmed</span>
                              </div>
                              <span className="text-gray-600 block text-[10px]">{pv.date}</span>
                              <span className="text-emerald-900 text-[10px] italic line-clamp-1">🍲 {pv.dishOrCare}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>
                ))}
              </div>
            </div>

            {/* Right 5 Columns: Local Pods & In-Person Meetups */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between border-b border-copper-penny/15 pb-2">
                <div className="flex items-center space-x-2 text-[#B87333]">
                  <Coffee className="w-5 h-5 text-[#B87333]" />
                  <h4 className="font-serif font-bold text-lg text-[#1F1813]">Local Sisterhood Pods</h4>
                </div>
                <span className="text-[10px] font-mono text-soft-sage font-bold uppercase">In-Person</span>
              </div>

              <div className="space-y-4">
                {podMeetups.map((pod) => {
                  const isRsvpd = pod.rsvpdMembers.includes('Mama Shantrece');
                  return (
                    <div key={pod.id} className="bg-white border-2 border-copper-penny/20 hover:border-copper-penny/40 rounded-2xl p-4.5 shadow-sm space-y-3 transition-all">
                      
                      <div className="space-y-1">
                        <span className="inline-block text-[9px] font-mono uppercase bg-[#B87333]/15 text-[#B87333] px-2 py-0.5 rounded-md font-bold border border-copper-penny/25">
                          {pod.category}
                        </span>
                        <h5 className="font-serif font-extrabold text-base text-[#1F1813]">{pod.title}</h5>
                        <p className="text-[11px] font-mono text-soft-sage">Hosted by {pod.hostSister}</p>
                      </div>

                      <p className="text-xs text-[#2A221B]/85 leading-relaxed">
                        {pod.description}
                      </p>

                      <div className="bg-[#FAF5EE] p-2.5 rounded-xl border border-copper-penny/10 space-y-1 text-xs font-mono text-[#1F1813]">
                        <div className="flex items-center space-x-1.5 text-copper-penny text-[11px]">
                          <Calendar className="w-3.5 h-3.5 text-[#B87333]" />
                          <span>{pod.date} • {pod.time}</span>
                        </div>
                        <div className="flex items-center space-x-1.5 text-gray-700 text-[11px]">
                          <MapPin className="w-3.5 h-3.5 text-[#B87333]" />
                          <span className="truncate">{pod.exactMeetingSpot}</span>
                        </div>
                      </div>

                      {pod.bringItems.length > 0 && (
                        <div className="text-[10px] text-gray-600 space-y-0.5">
                          <span className="font-bold text-[#1F1813]">What to bring:</span>
                          <ul className="list-disc list-inside space-y-0.5 text-gray-600">
                            {pod.bringItems.map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="pt-2 border-t border-copper-penny/10 flex items-center justify-between">
                        <span className="text-[11px] font-mono text-soft-sage">
                          <strong>{pod.attendingCount}</strong> Sisters Attending
                        </span>

                        <button
                          onClick={() => handleRsvpPod(pod.id)}
                          className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                            isRsvpd
                              ? 'bg-emerald-800 text-white border-emerald-900 shadow-sm'
                              : 'bg-white hover:bg-[#FAF5EE] text-[#1F1813] border-copper-penny/35 shadow-xs'
                          }`}
                        >
                          {isRsvpd ? '✓ RSVP Confirmed' : 'RSVP to Attend'}
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: INTERGENERATIONAL SISTERHOOD BRIDGE (AGES 30–60) */}
      {/* ========================================================================= */}
      {activeCircleTab === 'intergenerational' && (
        <div className="space-y-6">
          
          {/* Hero Banner Celebrating the 3 Life Stages */}
          <div className="bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EE] to-[#F5ECE1] border-2 border-[#D4AF37]/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-md text-center">
            
            <div className="space-y-2 max-w-3xl mx-auto">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest bg-[#D4AF37]/20 text-[#B87333] px-3 py-1 rounded-full border border-[#D4AF37]/35 inline-block">
                Honor • Lineage • Continuity
              </span>
              <h3 className="font-serif font-extrabold text-2xl sm:text-4xl text-[#1F1813] tracking-tight">
                The Intergenerational Sisterhood Bridge
              </h3>
              <p className="text-xs sm:text-sm text-[#2A221B]/80 max-w-2xl mx-auto leading-relaxed">
                In our tradition, womanhood is not a solo journey. We weave a living tapestry where mothers in their 30s, 40s, and 50s–60s pour into one another with honor, humility, and two-way exchange.
              </p>
            </div>

            {/* The 3 Generation Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left pt-2">
              
              {/* Pillar 1: 30–39 */}
              <div className="bg-white border-2 border-copper-penny/20 rounded-2xl p-5 space-y-2.5 shadow-xs hover:border-[#B87333]/40 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">🌱</span>
                  <span className="text-[10px] font-mono font-bold uppercase bg-amber-100 text-amber-900 px-2 py-0.5 rounded">Ages 30–39</span>
                </div>
                <h4 className="font-serif font-extrabold text-lg text-[#1F1813]">The Builders &amp; Nurturers</h4>
                <p className="text-xs text-[#2A221B]/80 leading-relaxed">
                  Active in raising children of all stages, establishing balanced home rhythms, family wellness, career growth, and building creative enterprises.
                </p>
                <div className="pt-2 border-t border-copper-penny/10 text-[10px] font-mono text-copper-penny">
                  <strong>Pours In:</strong> Practical workflows, energy, homeschool innovation &amp; fresh momentum.
                </div>
              </div>

              {/* Pillar 2: 40–49 */}
              <div className="bg-white border-2 border-copper-penny/20 rounded-2xl p-5 space-y-2.5 shadow-xs hover:border-[#B87333]/40 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">🌿</span>
                  <span className="text-[10px] font-mono font-bold uppercase bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded">Ages 40–49</span>
                </div>
                <h4 className="font-serif font-extrabold text-lg text-[#1F1813]">The Anchor Matriarchs</h4>
                <p className="text-xs text-[#2A221B]/80 leading-relaxed">
                  Guiding older children and teens, deepening family economic freedom and self-reliance, building health resilience, and steadying our community foundation.
                </p>
                <div className="pt-2 border-t border-copper-penny/10 text-[10px] font-mono text-copper-penny">
                  <strong>Pours In:</strong> Family balance, adolescent navigation, estate planning &amp; emotional grounding.
                </div>
              </div>

              {/* Pillar 3: 50–60 */}
              <div className="bg-white border-2 border-copper-penny/20 rounded-2xl p-5 space-y-2.5 shadow-xs hover:border-[#B87333]/40 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">🌳</span>
                  <span className="text-[10px] font-mono font-bold uppercase bg-[#D4AF37]/20 text-[#B87333] px-2 py-0.5 rounded">Ages 50–60</span>
                </div>
                <h4 className="font-serif font-extrabold text-lg text-[#1F1813]">The Wisdom Keepers</h4>
                <p className="text-xs text-[#2A221B]/80 leading-relaxed">
                  Stepping into grandmotherhood and elder counsel. Custodians of heirloom remedies, ancestral genealogy, and sacred peace.
                </p>
                <div className="pt-2 border-t border-copper-penny/10 text-[10px] font-mono text-copper-penny">
                  <strong>Pours In:</strong> Life perspective, herbal mastery, ancestral peace &amp; restorative counsel.
                </div>
              </div>

            </div>

            {/* Action to Request a Sister Partner */}
            <div className="pt-3">
              <button
                onClick={() => setShowPairingModal(true)}
                className="px-6 py-3 bg-[#B87333] hover:bg-[#A85138] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg hover:shadow-xl active:scale-95 transition-all cursor-pointer inline-flex items-center space-x-2 border border-[#96551d]/40"
              >
                <Users className="w-4 h-4 text-[#D4AF37]" />
                <span>Join the Two-Way Mentorship Exchange</span>
              </button>
            </div>

          </div>

          {/* Active Sisterhood Pairings & Circles */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-copper-penny/15 pb-2">
              <div className="flex items-center space-x-2 text-[#B87333]">
                <Heart className="w-5 h-5 text-[#B87333]" />
                <h4 className="font-serif font-bold text-lg text-[#1F1813]">Active Two-Way Mentorship Circles</h4>
              </div>
              <span className="text-[10px] font-mono text-soft-sage font-bold uppercase">Mutual Care in Action</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {sisterPairs.map((pair) => (
                <div key={pair.id} className="bg-white border-2 border-copper-penny/20 rounded-2xl p-5 space-y-3.5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                  
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono font-bold uppercase bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded">
                        ✓ {pair.status}
                      </span>
                      <span className="text-[10px] font-mono text-soft-sage font-bold">{pair.stateCode} Circle</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-base">👑</span>
                        <div>
                          <strong className="font-serif text-sm text-[#1F1813] block">{pair.mentorName}</strong>
                          <span className="text-[10px] font-mono text-[#B87333]">{pair.mentorBracket}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 pt-1 border-t border-copper-penny/10">
                        <span className="text-base">🌸</span>
                        <div>
                          <strong className="font-serif text-sm text-[#1F1813] block">{pair.menteeName}</strong>
                          <span className="text-[10px] font-mono text-[#B87333]">{pair.menteeBracket}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#FAF5EE] p-2.5 rounded-xl border border-copper-penny/10 space-y-1.5 text-xs">
                      <div>
                        <span className="text-[9px] font-mono font-bold text-copper-penny uppercase block">Elder Gift:</span>
                        <p className="text-[11px] text-[#2A221B]/80">{pair.giftOffer}</p>
                      </div>
                      <div className="pt-1 border-t border-copper-penny/10">
                        <span className="text-[9px] font-mono font-bold text-[#B87333] uppercase block">Younger Sister Gift:</span>
                        <p className="text-[11px] text-[#2A221B]/80">{pair.twoWayExchange}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-copper-penny/10 flex items-center justify-between text-[10px] font-mono text-soft-sage">
                    <span className="flex items-center gap-1"><PhoneCall className="w-3 h-3 text-[#B87333]" /> {pair.meetingRhythm}</span>
                  </div>

                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: SISTERHOOD COVENANT & MATRIARCHAL PEACE */}
      {/* ========================================================================= */}
      {activeCircleTab === 'covenant' && (
        <div className="space-y-6">
          <div className="bg-white border-2 border-[#D4AF37]/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-md">
            
            <div className="text-center space-y-2 max-w-2xl mx-auto border-b border-copper-penny/15 pb-4">
              <div className="w-12 h-12 rounded-full bg-[#FAF5EE] text-[#B87333] flex items-center justify-center mx-auto border border-[#D4AF37]/35 shadow-xs">
                <ShieldCheck className="w-6 h-6 text-[#B87333]" />
              </div>
              <h3 className="font-serif font-extrabold text-2xl sm:text-3xl text-[#1F1813]">
                The Sisterhood Covenant &amp; Peace Code
              </h3>
              <p className="text-xs sm:text-sm text-soft-sage font-mono uppercase tracking-wider font-bold">
                Protecting the Sanctity, Honor &amp; Privacy of Our Homes
              </p>
            </div>

            {/* The 4 Sacred Pillars of the Covenant */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Pillar 1: Sacred Porch Rule (Confidentiality) */}
              <div className="bg-[#FAF5EE]/60 border border-copper-penny/20 rounded-2xl p-5 space-y-2 shadow-xs">
                <div className="flex items-center space-x-2.5 text-[#B87333]">
                  <Lock className="w-5 h-5 text-[#B87333]" />
                  <h4 className="font-serif font-bold text-base text-[#1F1813]">1. The Sacred Porch Rule (Confidentiality)</h4>
                </div>
                <p className="text-xs text-[#2A221B]/85 leading-relaxed font-sans">
                  What is shared in tears, vulnerability, or private conversation stays within this circle. We do not screenshot, gossip, or share a sister's private family matters outside the sanctuary.
                </p>
              </div>

              {/* Pillar 2: Ancestral Grace */}
              <div className="bg-[#FAF5EE]/60 border border-copper-penny/20 rounded-2xl p-5 space-y-2 shadow-xs">
                <div className="flex items-center space-x-2.5 text-soft-sage">
                  <Flower2 className="w-5 h-5 text-soft-sage" />
                  <h4 className="font-serif font-bold text-base text-[#1F1813]">2. Ancestral Grace &amp; Zero Drama</h4>
                </div>
                <p className="text-xs text-[#2A221B]/85 leading-relaxed font-sans">
                  We acknowledge that every mother is at a different point in her healing and homemaking journey. We correct in private with deep love and encouragement rather than public critique.
                </p>
              </div>

              {/* Pillar 3: Action-Oriented Mutual Aid */}
              <div className="bg-[#FAF5EE]/60 border border-copper-penny/20 rounded-2xl p-5 space-y-2 shadow-xs">
                <div className="flex items-center space-x-2.5 text-copper-penny">
                  <Heart className="w-5 h-5 text-[#B87333]" />
                  <h4 className="font-serif font-bold text-base text-[#1F1813]">3. Action-Oriented Sisterly Aid</h4>
                </div>
                <p className="text-xs text-[#2A221B]/85 leading-relaxed font-sans">
                  We don’t just say "let me know if you need anything." We step up with hot soup, child-watching hours, homemade salves, and practical help on the land.
                </p>
              </div>

              {/* Pillar 4: Matriarchal Elder Council Mediation */}
              <div className="bg-[#FAF5EE]/60 border border-copper-penny/20 rounded-2xl p-5 space-y-2 shadow-xs">
                <div className="flex items-center space-x-2.5 text-[#3A4C3A]">
                  <Award className="w-5 h-5 text-[#3A4C3A]" />
                  <h4 className="font-serif font-bold text-base text-[#1F1813]">4. Restorative Elder Council Mediation</h4>
                </div>
                <p className="text-xs text-[#2A221B]/85 leading-relaxed font-sans">
                  If misunderstandings arise, we do not engage in internet arguments. Our circle’s respected Elder Matriarchs facilitate quiet, private, and restorative reconciliation to mend hearts and maintain harmony.
                </p>
              </div>

            </div>

            <div className="p-4 bg-[#FAF5EE] rounded-2xl border border-dashed border-[#D4AF37]/35 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#1F1813]">
              <div className="flex items-center space-x-2">
                <span className="text-lg">🕊️</span>
                <span>All approved members affirm this covenant upon entry to keep our community safe and spiritually clear.</span>
              </div>
              <span className="font-mono text-[10px] font-bold uppercase text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 flex-shrink-0">
                ✓ Covenant Upheld
              </span>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: SISTER CIRCLES (INTERACTIVE MAP) */}
      {/* ========================================================================= */}
      {activeCircleTab === 'sister-circles' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-[#FAF5EE] border-2 border-[#D4AF37]/50 rounded-3xl p-6 sm:p-8 shadow-md space-y-4">
            <div className="flex items-center space-x-3">
              <span className="p-3 rounded-2xl bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 text-2xl">
                🧭
              </span>
              <div>
                <h3 className="font-serif font-black text-xl sm:text-2xl text-[#1F1813]">
                  Sister Circles Map &amp; Network
                </h3>
                <p className="text-xs font-mono text-[#B87333]">
                  Explore active regional circles, mutual aid spots, seed banks, and local homestead networks across America.
                </p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-[#2A221B]/85 font-sans leading-relaxed max-w-3xl">
              Connect with mother circles in your state, discover organic garden plots, tool libraries, and local sister meetups. Click any pin on the interactive map to view coordinates, circle leads, and direct contact details.
            </p>
          </div>

          <CircleMapInteractive selectedState={selectedState} />
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: PRIVATE REGIONAL CHAT & EVENTS */}
      {/* ========================================================================= */}
      {activeCircleTab === 'chat' && (
        <div className="bg-[#FAF5EE]/30 border border-copper-penny/15 rounded-3xl p-4 sm:p-5 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Community Chat Area (Left 8 columns) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Safe Space & Privacy Card */}
            <div className="bg-white border border-copper-penny/15 rounded-3xl p-6 shadow-md space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-copper-penny/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-copper-penny/5 pb-3">
                <div className="flex items-center space-x-2.5">
                  <ShieldCheck className="w-5 h-5 text-copper-penny" />
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#1F1813]">Our Safe &amp; Private Sisterhood Space</h3>
                    <p className="text-[9px] font-mono text-soft-sage uppercase tracking-wider font-bold">Verified Member Community</p>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 font-mono text-[9px] font-bold">
                  <span className="text-soft-sage">COMMUNITY TRUST:</span>
                  <span className="bg-[#3A4C3A]/10 border border-[#3A4C3A]/30 text-[#3A4C3A] px-2.5 py-0.5 rounded-full uppercase">
                    ACTIVE &amp; VERIFIED
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#2A221B]/80 leading-relaxed">
                This is a safe space to relax, speak from the heart, and connect with fellow mothers in your regional circle. There are no corporate algorithms, tracking cookies, or outside distractions here.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 bg-[#FAF5EE]/60 border border-copper-penny/10 rounded-xl text-center space-y-1">
                  <span className="block text-[9px] font-mono text-soft-sage uppercase tracking-wider font-bold">Regional Circle</span>
                  <span className="font-serif font-bold text-xs text-[#1F1813] block">{selectedState} Sisterhood</span>
                </div>

                <div className="p-3 bg-[#FAF5EE]/60 border border-copper-penny/10 rounded-xl text-center space-y-1">
                  <span className="block text-[9px] font-mono text-soft-sage uppercase tracking-wider font-bold">Member Privacy</span>
                  <span className="font-serif font-bold text-xs text-[#3A4C3A] block">100% Private &amp; Direct</span>
                </div>

                <div className="p-3 bg-[#FAF5EE]/60 border border-copper-penny/10 rounded-xl text-center space-y-1">
                  <span className="block text-[9px] font-mono text-soft-sage uppercase tracking-wider font-bold">Sisterhood Values</span>
                  <span className="font-serif font-bold text-xs text-[#B87333] block">Respect • Care • Unity</span>
                </div>
              </div>
            </div>

            {/* Messaging Chat Box */}
            <div className="bg-white border border-copper-penny/15 rounded-3xl shadow-xl flex flex-col h-[520px] overflow-hidden">
              
              {/* Chat Header */}
              <div className="bg-[#FAF5EE] px-5 py-4 flex items-center justify-between border-b border-copper-penny/15">
                <div>
                  <h4 className="font-serif font-bold text-base text-[#1F1813]">{selectedState} Regional Circle</h4>
                  <p className="text-[9px] text-soft-sage font-mono uppercase tracking-wider font-bold">Community Sisterhood Chat</p>
                </div>
                <div className="text-[10px] font-mono text-copper-penny flex items-center space-x-1.5 border border-copper-penny/20 px-3 py-1 rounded-full bg-white font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#B87333]" />
                  <span>Verified Moms Only</span>
                </div>
              </div>

              {/* Message Feed */}
              <div className="flex-grow p-5 overflow-y-auto space-y-5 bg-[#FAF5EE]/10 scrollbar-thin">
                {chatMessages.length === 0 ? (
                  <div className="text-center py-24 text-xs text-soft-sage italic">
                    The circle is quiet. Be the first to say hello to the sisters in your area!
                  </div>
                ) : (
                  chatMessages.map((msg) => {
                    const isMe = msg.sender === 'user';
                    return (
                      <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}>
                        
                        <div className="flex items-center space-x-1.5 text-[10px] font-mono text-soft-sage font-bold">
                          <span className="text-copper-penny font-bold">{msg.senderName}</span>
                          <span>•</span>
                          <span>{msg.timestamp}</span>
                        </div>

                        <div className="flex flex-col max-w-[85%] space-y-1">
                          <div className={`px-4 py-2.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                            isMe 
                              ? 'bg-gradient-to-r from-copper-penny to-[#96551d] text-white rounded-tr-none' 
                              : 'bg-[#FAF5EE] text-[#1F1813] border border-copper-penny/10 rounded-tl-none'
                          }`}>
                            {msg.text}
                          </div>
                        </div>

                      </div>
                    );
                  })
                )}
              </div>

              {/* Chat Input form */}
              <form onSubmit={handleFormSubmit} className="p-4 border-t border-copper-penny/15 flex items-center space-x-3 bg-[#FAF5EE]/30">
                <input 
                  type="text"
                  required
                  value={newMessageText}
                  onChange={(e) => onNewMessageChange(e.target.value)}
                  placeholder={`Share what's on your mind with the ${selectedState} Circle...`}
                  className="flex-grow bg-white border border-copper-penny/20 focus:border-copper-penny focus:ring-1 focus:ring-copper-penny rounded-xl px-4 py-2.5 text-xs text-[#1F1813] placeholder-gray-400 focus:outline-none transition-colors"
                />
                <button 
                  type="submit"
                  disabled={isSendingMessage || !newMessageText.trim()}
                  className="px-5 py-2.5 bg-[#B87333] hover:bg-[#A85138] border border-[#96551d]/30 disabled:bg-gray-300 disabled:border-transparent text-white rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-[0_4px_12px_rgba(184,115,51,0.2)] hover:shadow-[0_6px_18px_rgba(184,115,51,0.3)] active:scale-95"
                  title="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

            </div>

          </div>

          {/* Gathering circles and privacy compliance (Right 4 columns) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Active Gathering Circles (Events) */}
            <div className="bg-white border border-copper-penny/15 rounded-3xl p-6 shadow-md space-y-4">
              <div className="flex items-center space-x-2 text-copper-penny border-b border-copper-penny/5 pb-2">
                <Calendar className="w-5 h-5 text-[#B87333]" />
                <h3 className="font-serif font-bold text-base text-[#1F1813]">Local &amp; Virtual Meetups</h3>
              </div>

              <p className="text-xs text-[#2A221B]/85 leading-relaxed">
                Find upcoming discussions, park playdates, work co-ops, and workshops in the <strong>{selectedState} region</strong>.
              </p>

              <div className="space-y-3 max-h-80 overflow-y-auto scrollbar-thin">
                {eventsList.filter(e => e.hubId === 'gathering').length === 0 ? (
                  <p className="text-xs text-soft-sage italic text-center py-6 border border-dashed border-copper-penny/10 rounded-xl">
                    No upcoming meetups posted in this state yet.
                  </p>
                ) : (
                  eventsList.filter(e => e.hubId === 'gathering').map(evt => (
                    <div key={evt.id} className="border border-copper-penny/10 bg-[#FAF5EE]/30 rounded-xl p-3.5 space-y-2 hover:border-copper-penny/25 transition-colors text-xs">
                      <span className="inline-block text-[8px] font-mono font-bold uppercase bg-copper-penny/10 text-copper-penny px-2 py-0.5 rounded border border-copper-penny/15">
                        {evt.type} meetup
                      </span>
                      <h4 className="font-serif font-bold text-sm text-[#1F1813]">{evt.title}</h4>
                      <p className="text-[11px] text-[#2A221B]/80 leading-relaxed">{evt.description}</p>
                      
                      <div className="pt-1 flex flex-col gap-0.5 text-[9px] font-mono text-soft-sage">
                        <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1 text-copper-penny" /> {evt.date} • {evt.time}</span>
                        <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1 text-copper-penny" /> {evt.location}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Compliance Status box */}
            <div className="bg-white border border-[#93A28B]/35 rounded-3xl p-6 shadow-md space-y-4">
              <div className="flex items-center space-x-2 text-soft-sage border-b border-copper-penny/5 pb-2">
                <ShieldCheck className="w-5 h-5 text-[#93A28B]" />
                <h4 className="font-serif font-bold text-base text-[#1F1813]">Privacy &amp; Safety Standard</h4>
              </div>

              <div className="space-y-2 text-xs">
                <p className="font-mono text-[9px] font-bold uppercase text-copper-penny tracking-widest">
                  {complianceNotice?.regulationName || 'Community Privacy Upheld'}
                </p>
                <p className="text-[#2A221B]/80 leading-relaxed text-[11px]">
                  {complianceNotice?.privacyDisclosure || 'Conversations and member details stay private to verified moms in your circle.'}
                </p>
                
                <button
                  onClick={onShowCompliance}
                  className="text-copper-penny underline text-[9px] font-extrabold font-mono uppercase hover:text-[#A85138] transition-colors mt-1 block"
                >
                  View Community Privacy Details &rarr;
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* MODALS */}
      {/* ========================================================================= */}

      {/* 1. TOPIC PROPOSAL MODAL */}
      {showTopicModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-[#FFFDF9] border-2 border-[#D4AF37] rounded-3xl p-5 sm:p-6 max-w-lg w-full shadow-2xl relative space-y-4 my-8">
            <button 
              onClick={() => setShowTopicModal(false)}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-[#1F1813] rounded-full hover:bg-gray-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {!topicSubmitted ? (
              <>
                <div className="flex items-center space-x-2.5 text-[#B87333] border-b border-copper-penny/15 pb-3">
                  <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/20 text-[#B87333] flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-[#B87333]" />
                  </div>
                  <div>
                    <h3 className="font-serif font-extrabold text-lg sm:text-xl text-[#1F1813]">
                      Suggest a Casual Corner Talk Topic
                    </h3>
                    <p className="text-[10px] font-mono text-soft-sage uppercase font-bold">The Copper Circle Dialogues</p>
                  </div>
                </div>

                <p className="text-xs text-[#2A221B]/80 leading-relaxed">
                  What questions, everyday challenges, or practical skills would you like to hear sisters discuss on the next Casual Corner Talk?
                </p>

                <form onSubmit={handleTopicSubmit} className="space-y-3.5 text-left">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono uppercase font-bold text-soft-sage">
                      Topic Category
                    </label>
                    <select
                      value={topicCategory}
                      onChange={(e) => setTopicCategory(e.target.value)}
                      className="w-full bg-white border border-copper-penny/25 rounded-xl px-3 py-2 text-xs text-[#1F1813] font-medium focus:outline-none focus:border-copper-penny"
                    >
                      <option value="Postpartum & Natural Healing">Postpartum &amp; Natural Healing</option>
                      <option value="Sovereign Homeschooling">Homeschooling &amp; Child Education</option>
                      <option value="Homesteading & Garden Life">Gardening &amp; Growing Food</option>
                      <option value="Sisterhood & Marriage Realities">Sisterhood, Relationships &amp; Motherhood</option>
                      <option value="Ancestral Heritage & Handcrafts">Family Traditions &amp; Creative Crafts</option>
                      <option value="Community Land & Economics">Cooperative Economics &amp; Business</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono uppercase font-bold text-soft-sage">
                      Topic Title or Question <span className="text-[#B87333]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={topicSubject}
                      onChange={(e) => setTopicSubject(e.target.value)}
                      placeholder="e.g. Natural ways to handle toddler sleep and family routines"
                      className="w-full bg-white border border-copper-penny/25 rounded-xl px-3 py-2 text-xs text-[#1F1813] placeholder-gray-400 focus:outline-none focus:border-copper-penny"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono uppercase font-bold text-soft-sage">
                      Additional Details (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={topicDetails}
                      onChange={(e) => setTopicDetails(e.target.value)}
                      placeholder="Share what's on your mind or any questions you'd like answered..."
                      className="w-full bg-white border border-copper-penny/25 rounded-xl px-3 py-2 text-xs text-[#1F1813] placeholder-gray-400 focus:outline-none focus:border-copper-penny resize-none"
                    />
                  </div>

                  <div className="pt-2 flex justify-end space-x-2.5">
                    <button
                      type="button"
                      onClick={() => setShowTopicModal(false)}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!topicSubject.trim()}
                      className="px-5 py-2 bg-[#B87333] hover:bg-[#A85138] text-white text-xs font-bold rounded-xl shadow-md cursor-pointer disabled:bg-gray-300"
                    >
                      Submit Topic
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="font-serif font-extrabold text-xl text-[#1F1813]">
                  Topic Received!
                </h3>
                <p className="text-xs text-[#2A221B]/80 max-w-sm mx-auto">
                  Thank you! We have added your topic to the list for our upcoming <strong>Casual Corner Talk</strong>.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. PLEDGE MEAL TRAIN MODAL */}
      {showMealModal && selectedMealTrain && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-[#FFFDF9] border-2 border-[#B87333] rounded-3xl p-5 sm:p-6 max-w-lg w-full shadow-2xl relative space-y-4 my-8">
            <button 
              onClick={() => {
                setShowMealModal(false);
                setSelectedMealTrain(null);
              }}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-[#1F1813] rounded-full hover:bg-gray-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {!pledgeSuccess ? (
              <>
                <div className="flex items-center space-x-2.5 text-[#B87333] border-b border-copper-penny/15 pb-3">
                  <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/20 text-[#B87333] flex items-center justify-center">
                    <Utensils className="w-5 h-5 text-[#B87333]" />
                  </div>
                  <div>
                    <h3 className="font-serif font-extrabold text-lg sm:text-xl text-[#1F1813]">
                      Pledge a Meal for {selectedMealTrain.motherName}
                    </h3>
                    <p className="text-[10px] font-mono text-soft-sage uppercase font-bold">{selectedMealTrain.occasion}</p>
                  </div>
                </div>

                <div className="bg-[#FAF5EE] p-3 rounded-xl border border-copper-penny/15 text-xs space-y-1">
                  <span className="font-bold text-[#1F1813] block">Dietary &amp; Preference Notes:</span>
                  <p className="text-[#2A221B]/80 text-[11px]">{selectedMealTrain.dietaryNotes}</p>
                  <p className="text-[10px] font-mono text-copper-penny pt-1">📍 Porch Area: {selectedMealTrain.deliveryAddressArea}</p>
                </div>

                <form onSubmit={handlePledgeSubmit} className="space-y-3.5 text-left">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono uppercase font-bold text-soft-sage">
                      Select Delivery Date <span className="text-[#B87333]">*</span>
                    </label>
                    <select
                      value={pledgeDate}
                      onChange={(e) => setPledgeDate(e.target.value)}
                      required
                      className="w-full bg-white border border-copper-penny/25 rounded-xl px-3 py-2 text-xs text-[#1F1813] font-medium focus:outline-none focus:border-copper-penny"
                    >
                      <option value="">Select a needed date...</option>
                      {selectedMealTrain.neededDates.map((d, i) => (
                        <option key={i} value={d}>{d}</option>
                      ))}
                      <option value="Flexible / Weekend Drop-off">Flexible / Weekend Drop-off</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono uppercase font-bold text-soft-sage">
                      What Dish / Broth / Care are you bringing? <span className="text-[#B87333]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={pledgeDish}
                      onChange={(e) => setPledgeDish(e.target.value)}
                      placeholder="e.g. Homemade Chicken & Herb bone broth + baked sweet potatoes"
                      className="w-full bg-white border border-copper-penny/25 rounded-xl px-3 py-2 text-xs text-[#1F1813] placeholder-gray-400 focus:outline-none focus:border-copper-penny"
                    />
                  </div>

                  <div className="pt-2 flex justify-end space-x-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        setShowMealModal(false);
                        setSelectedMealTrain(null);
                      }}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!pledgeDish.trim() || !pledgeDate}
                      className="px-5 py-2 bg-[#B87333] hover:bg-[#A85138] text-white text-xs font-bold rounded-xl shadow-md cursor-pointer disabled:bg-gray-300"
                    >
                      Confirm Meal Pledge
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <Heart className="w-7 h-7 text-emerald-600 fill-emerald-600" />
                </div>
                <h3 className="font-serif font-extrabold text-xl text-[#1F1813]">
                  Pledge Confirmed!
                </h3>
                <p className="text-xs text-[#2A221B]/80 max-w-sm mx-auto">
                  Thank you Sister! Your care delivery has been added to {selectedMealTrain.motherName}'s Meal Train.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. CREATE MEAL TRAIN REQUEST MODAL */}
      {showNewMealTrainModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-[#FFFDF9] border-2 border-[#B87333] rounded-3xl p-5 sm:p-6 max-w-lg w-full shadow-2xl relative space-y-4 my-8">
            <button 
              onClick={() => setShowNewMealTrainModal(false)}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-[#1F1813] rounded-full hover:bg-gray-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2.5 text-[#B87333] border-b border-copper-penny/15 pb-3">
              <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/20 text-[#B87333] flex items-center justify-center">
                <Utensils className="w-5 h-5 text-[#B87333]" />
              </div>
              <div>
                <h3 className="font-serif font-extrabold text-lg sm:text-xl text-[#1F1813]">
                  Request Postpartum / Care Squad Support
                </h3>
                <p className="text-[10px] font-mono text-soft-sage uppercase font-bold">The Sisterhood Meal Train</p>
              </div>
            </div>

            <p className="text-xs text-[#2A221B]/80 leading-relaxed">
              Whether you are welcoming a newborn or recovering from an illness, let your sisters hold you up. Complete these details and your regional pod will be notified.
            </p>

            <form onSubmit={handleCreateMealTrain} className="space-y-3.5 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] font-mono uppercase font-bold text-soft-sage">
                    Mother / Family Name <span className="text-[#B87333]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newMtMother}
                    onChange={(e) => setNewMtMother(e.target.value)}
                    placeholder="e.g. Sister Ebony"
                    className="w-full bg-white border border-copper-penny/25 rounded-xl px-3 py-2 text-xs text-[#1F1813] focus:outline-none focus:border-copper-penny"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-mono uppercase font-bold text-soft-sage">
                    Location (City &amp; Area) <span className="text-[#B87333]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newMtLocation}
                    onChange={(e) => setNewMtLocation(e.target.value)}
                    placeholder="e.g. Atlanta, GA (East Lake)"
                    className="w-full bg-white border border-copper-penny/25 rounded-xl px-3 py-2 text-xs text-[#1F1813] focus:outline-none focus:border-copper-penny"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-mono uppercase font-bold text-soft-sage">
                  Occasion / Season of Care
                </label>
                <select
                  value={newMtOccasion}
                  onChange={(e) => setNewMtOccasion(e.target.value as any)}
                  className="w-full bg-white border border-copper-penny/25 rounded-xl px-3 py-2 text-xs text-[#1F1813] focus:outline-none focus:border-copper-penny"
                >
                  <option value="Postpartum Newborn Care">Postpartum Newborn Care</option>
                  <option value="Family Recovery & Health">Family Recovery &amp; Health</option>
                  <option value="Emergency Respite">Emergency Respite &amp; Childcare</option>
                  <option value="Homestead / Garden Day">Homestead / Garden Workday</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-mono uppercase font-bold text-soft-sage">
                  Brief Story or Needs <span className="text-[#B87333]">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={newMtStory}
                  onChange={(e) => setNewMtStory(e.target.value)}
                  placeholder="e.g. Welcoming baby girl on Friday, would love warm postpartum soups and easy dinners for the family..."
                  className="w-full bg-white border border-copper-penny/25 rounded-xl px-3 py-2 text-xs text-[#1F1813] focus:outline-none focus:border-copper-penny resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-mono uppercase font-bold text-soft-sage">
                  Dietary Notes &amp; Preferred Foods
                </label>
                <input
                  type="text"
                  value={newMtDietary}
                  onChange={(e) => setNewMtDietary(e.target.value)}
                  placeholder="e.g. Gluten-free, loves hearty vegetable stews and fresh fruit"
                  className="w-full bg-white border border-copper-penny/25 rounded-xl px-3 py-2 text-xs text-[#1F1813] focus:outline-none focus:border-copper-penny"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-mono uppercase font-bold text-soft-sage">
                  Dates When Deliveries Are Needed (comma separated)
                </label>
                <input
                  type="text"
                  value={newMtDates}
                  onChange={(e) => setNewMtDates(e.target.value)}
                  placeholder="e.g. Monday July 20, Wednesday July 22, Friday July 24"
                  className="w-full bg-white border border-copper-penny/25 rounded-xl px-3 py-2 text-xs text-[#1F1813] focus:outline-none focus:border-copper-penny"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2.5">
                <button
                  type="button"
                  onClick={() => setShowNewMealTrainModal(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newMtMother.trim() || !newMtStory.trim()}
                  className="px-5 py-2 bg-[#B87333] hover:bg-[#A85138] text-white text-xs font-bold rounded-xl shadow-md cursor-pointer disabled:bg-gray-300"
                >
                  Post Care Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. PLAN POD / LOCAL MEETUP MODAL */}
      {showPodModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-[#FFFDF9] border-2 border-[#B87333] rounded-3xl p-5 sm:p-6 max-w-lg w-full shadow-2xl relative space-y-4 my-8">
            <button 
              onClick={() => setShowPodModal(false)}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-[#1F1813] rounded-full hover:bg-gray-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2.5 text-[#B87333] border-b border-copper-penny/15 pb-3">
              <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/20 text-[#B87333] flex items-center justify-center">
                <Coffee className="w-5 h-5 text-[#B87333]" />
              </div>
              <div>
                <h3 className="font-serif font-extrabold text-lg sm:text-xl text-[#1F1813]">
                  Plan an Offline Meetup or Porch Circle
                </h3>
                <p className="text-[10px] font-mono text-soft-sage uppercase font-bold">Local Sisterhood Pod</p>
              </div>
            </div>

            <form onSubmit={handleCreatePod} className="space-y-3.5 text-left">
              <div className="space-y-1">
                <label className="block text-[10px] font-mono uppercase font-bold text-soft-sage">
                  Meetup Title <span className="text-[#B87333]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newPodTitle}
                  onChange={(e) => setNewPodTitle(e.target.value)}
                  placeholder="e.g. Homeschool Nature Walk &amp; Herbal Seed Swap"
                  className="w-full bg-white border border-copper-penny/25 rounded-xl px-3 py-2 text-xs text-[#1F1813] focus:outline-none focus:border-copper-penny"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] font-mono uppercase font-bold text-soft-sage">
                    Category
                  </label>
                  <select
                    value={newPodCategory}
                    onChange={(e) => setNewPodCategory(e.target.value as any)}
                    className="w-full bg-white border border-copper-penny/25 rounded-xl px-3 py-2 text-xs text-[#1F1813] focus:outline-none focus:border-copper-penny"
                  >
                    <option value="In-Person Tea Circle">In-Person Tea Circle</option>
                    <option value="Homeschool Field Trip">Homeschool Field Trip</option>
                    <option value="Heirloom Seed & Clothing Swap">Heirloom Seed &amp; Clothing Swap</option>
                    <option value="Homestead & Garden Day">Homestead &amp; Garden Day</option>
                    <option value="Care Squad Drop-Off">Care Squad Drop-Off</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-mono uppercase font-bold text-soft-sage">
                    City / Neighborhood <span className="text-[#B87333]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newPodCity}
                    onChange={(e) => setNewPodCity(e.target.value)}
                    placeholder="e.g. Atlanta, GA"
                    className="w-full bg-white border border-copper-penny/25 rounded-xl px-3 py-2 text-xs text-[#1F1813] focus:outline-none focus:border-copper-penny"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-mono uppercase font-bold text-soft-sage">
                  Exact Meeting Spot or Park
                </label>
                <input
                  type="text"
                  value={newPodSpot}
                  onChange={(e) => setNewPodSpot(e.target.value)}
                  placeholder="e.g. Grant Park Shade Pavilion, Atlanta"
                  className="w-full bg-white border border-copper-penny/25 rounded-xl px-3 py-2 text-xs text-[#1F1813] focus:outline-none focus:border-copper-penny"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] font-mono uppercase font-bold text-soft-sage">
                    Date <span className="text-[#B87333]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newPodDate}
                    onChange={(e) => setNewPodDate(e.target.value)}
                    placeholder="e.g. Saturday, August 1, 2026"
                    className="w-full bg-white border border-copper-penny/25 rounded-xl px-3 py-2 text-xs text-[#1F1813] focus:outline-none focus:border-copper-penny"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-mono uppercase font-bold text-soft-sage">
                    Time
                  </label>
                  <input
                    type="text"
                    value={newPodTime}
                    onChange={(e) => setNewPodTime(e.target.value)}
                    placeholder="e.g. 10:00 AM – 12:30 PM EST"
                    className="w-full bg-white border border-copper-penny/25 rounded-xl px-3 py-2 text-xs text-[#1F1813] focus:outline-none focus:border-copper-penny"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-mono uppercase font-bold text-soft-sage">
                  Description &amp; What to Expect
                </label>
                <textarea
                  rows={2}
                  value={newPodDesc}
                  onChange={(e) => setNewPodDesc(e.target.value)}
                  placeholder="Share the flow of the meetup..."
                  className="w-full bg-white border border-copper-penny/25 rounded-xl px-3 py-2 text-xs text-[#1F1813] focus:outline-none focus:border-copper-penny resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-mono uppercase font-bold text-soft-sage">
                  What sisters should bring (comma separated)
                </label>
                <input
                  type="text"
                  value={newPodItems}
                  onChange={(e) => setNewPodItems(e.target.value)}
                  placeholder="e.g. Blanket, heirloom seeds, snack for children"
                  className="w-full bg-white border border-copper-penny/25 rounded-xl px-3 py-2 text-xs text-[#1F1813] focus:outline-none focus:border-copper-penny"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2.5">
                <button
                  type="button"
                  onClick={() => setShowPodModal(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newPodTitle.trim() || !newPodCity.trim() || !newPodDate.trim()}
                  className="px-5 py-2 bg-[#B87333] hover:bg-[#A85138] text-white text-xs font-bold rounded-xl shadow-md cursor-pointer disabled:bg-gray-300"
                >
                  Create Meetup
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. INTERGENERATIONAL TWO-WAY MENTORSHIP MODAL */}
      {showPairingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-[#FFFDF9] border-2 border-[#D4AF37] rounded-3xl p-5 sm:p-6 max-w-lg w-full shadow-2xl relative space-y-4 my-8">
            <button 
              onClick={() => setShowPairingModal(false)}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-[#1F1813] rounded-full hover:bg-gray-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {!pairSubmitted ? (
              <>
                <div className="flex items-center space-x-2.5 text-[#B87333] border-b border-copper-penny/15 pb-3">
                  <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/20 text-[#B87333] flex items-center justify-center">
                    <Users className="w-5 h-5 text-[#B87333]" />
                  </div>
                  <div>
                    <h3 className="font-serif font-extrabold text-lg sm:text-xl text-[#1F1813]">
                      Join Two-Way Mentorship Exchange
                    </h3>
                    <p className="text-[10px] font-mono text-soft-sage uppercase font-bold">Intergenerational Sisterhood Bridge</p>
                  </div>
                </div>

                <p className="text-xs text-[#2A221B]/80 leading-relaxed">
                  In our circle, mentorship is two-way. Experienced matriarchs pour in life and home wisdom, while younger mothers pour back fresh skills and active co-op support.
                </p>

                <form onSubmit={handlePairingSubmit} className="space-y-3.5 text-left">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono uppercase font-bold text-soft-sage">
                      My Age Bracket &amp; Season <span className="text-[#B87333]">*</span>
                    </label>
                    <select
                      value={pairMyBracket}
                      onChange={(e) => setPairMyBracket(e.target.value as any)}
                      className="w-full bg-white border border-copper-penny/25 rounded-xl px-3 py-2 text-xs text-[#1F1813] focus:outline-none focus:border-copper-penny"
                    >
                      <option value="30–39 (Builder & Nurturer)">Ages 30–39 (The Builders &amp; Nurturers)</option>
                      <option value="40–49 (Anchor Matriarch)">Ages 40–49 (The Anchor Matriarchs)</option>
                      <option value="50–60 (Wisdom Keeper)">Ages 50–60 (The Wisdom Keepers &amp; Elders)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono uppercase font-bold text-soft-sage">
                      What I Can Pour Into a Sister (My Gifts / Wisdom) <span className="text-[#B87333]">*</span>
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={pairMyOffer}
                      onChange={(e) => setPairMyOffer(e.target.value)}
                      placeholder="e.g. Natural postpartum herbal remedies, sourdough baking, or digital homeschooling tools..."
                      className="w-full bg-white border border-copper-penny/25 rounded-xl px-3 py-2 text-xs text-[#1F1813] focus:outline-none focus:border-copper-penny resize-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono uppercase font-bold text-soft-sage">
                      What Guidance or Support I Am Seeking <span className="text-[#B87333]">*</span>
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={pairMyDesire}
                      onChange={(e) => setPairMyDesire(e.target.value)}
                      placeholder="e.g. Elder guidance on balancing motherhood with homesteading, or practical garden planning..."
                      className="w-full bg-white border border-copper-penny/25 rounded-xl px-3 py-2 text-xs text-[#1F1813] focus:outline-none focus:border-copper-penny resize-none"
                    />
                  </div>

                  <div className="pt-2 flex justify-end space-x-2.5">
                    <button
                      type="button"
                      onClick={() => setShowPairingModal(false)}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!pairMyOffer.trim() || !pairMyDesire.trim()}
                      className="px-5 py-2 bg-[#B87333] hover:bg-[#A85138] text-white text-xs font-bold rounded-xl shadow-md cursor-pointer disabled:bg-gray-300"
                    >
                      Register My Profile
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <Users className="w-7 h-7 text-emerald-600" />
                </div>
                <h3 className="font-serif font-extrabold text-xl text-[#1F1813]">
                  Sisterhood Profile Registered!
                </h3>
                <p className="text-xs text-[#2A221B]/80 max-w-sm mx-auto">
                  Our Matriarch Council will review your strengths and pair you with a loving sister partner.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
