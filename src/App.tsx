/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  Heart, 
  MapPin, 
  ShieldCheck, 
  MessageSquare, 
  ArrowRight, 
  Plus, 
  Calendar, 
  Clock, 
  BookOpen, 
  Sprout, 
  Coins, 
  Users, 
  ArrowLeftRight, 
  ShieldAlert, 
  Sparkles, 
  Send, 
  Lock, 
  Key, 
  FileText,
  Search,
  CheckCircle,
  Globe,
  Info,
  ChevronRight,
  ChevronDown,
  Shield,
  Trash2,
  LockKeyhole,
  User,
  Bookmark,
  Settings,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarterOffer, 
  CoopEvent, 
  Message, 
  StateComplianceConfig, 
  Applicant, 
  TimeCreditLog, 
  PageSpotlightBanner, 
  ScholarshipEntry, 
  HearthMoodId,
  BroadcastBulletin,
  BarterDisputeRecord,
  HearthGatheringSession,
  AudioTrack,
  VoiceNoteReflection,
  FiresideVoiceRoom,
  VillagePoll
} from './types';

// Import our custom subcomponents
import VettingGateway from './components/VettingGateway';
import AdminVetting from './components/AdminVetting';
import ApothecaryHub from './components/ApothecaryHub';
import VillageHub from './components/VillageHub';
import MarketplaceHub from './components/MarketplaceHub';
import CommerceHub from './components/CommerceHub';
import GatheringHub from './components/GatheringHub';
import KinshipVault from './components/KinshipVault';
import VillageCommonsHub from './components/VillageCommonsHub';
import MemberProfileHub from './components/MemberProfileHub';
import BusinessAdvertisingPortal from './components/BusinessAdvertisingPortal';
import SpotlightBanner from './components/SpotlightBanner';
import BroadcastPushBar from './components/BroadcastPushBar';
import HearthMoodToggle, { HEARTH_MOODS } from './components/HearthMoodToggle';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import AudioPlayerFloating from './components/AudioPlayerFloating';
import AudioSanctuaryLounge from './components/AudioSanctuaryLounge';
import SovereignTreasuryHub from './components/SovereignTreasuryHub';
import MothersAcademyHub from './components/MothersAcademyHub';
import ScrollToTopButton from './components/ScrollToTopButton';
import BottomFloatingChatDock from './components/BottomFloatingChatDock';
import { SavedCommonsItem, DirectChatThread, ChatMember, DirectChatMessage } from './types';
import { INITIAL_DIRECT_CHAT_THREADS, INITIAL_CHAT_MEMBERS } from './data/initialDirectChats';
import { 
  INITIAL_BROADCAST_BULLETINS, 
  INITIAL_DISPUTES, 
  INITIAL_HEARTH_SESSIONS 
} from './data/phase2AdminData';
import {
  INITIAL_AUDIO_TRACKS,
  INITIAL_VOICE_NOTES,
  INITIAL_FIRESIDE_ROOM
} from './data/audioSanctuaryData';
import { initialVillagePolls } from './data/pollsData';

// Constants for US States with American-born populations and active circles
const POPULAR_STATES = [
  { code: 'GA', name: 'Georgia (Atlanta Circle)' },
  { code: 'CA', name: 'California (Oakland Circle)' },
  { code: 'TX', name: 'Texas (Houston/Dallas Circle)' },
  { code: 'NY', name: 'New York (Brooklyn Circle)' },
  { code: 'MD', name: 'Maryland (Baltimore/Prince George\'s Circle)' },
  { code: 'VA', name: 'Virginia (Richmond Circle)' },
  { code: 'FL', name: 'Florida (Miami Circle)' },
  { code: 'NC', name: 'North Carolina (Charlotte Circle)' },
  { code: 'SC', name: 'South Carolina (Charleston Circle)' },
  { code: 'AL', name: 'Alabama (Birmingham Circle)' },
  { code: 'LA', name: 'Louisiana (New Orleans Circle)' },
  { code: 'IL', name: 'Illinois (Chicago Circle)' },
  { code: 'MI', name: 'Michigan (Detroit Circle)' },
  { code: 'OH', name: 'Ohio (Cleveland Circle)' },
  { code: 'PA', name: 'Pennsylvania (Philadelphia Circle)' }
];

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'landing' | 'vetting' | 'commons' | 'profile' | 'village' | 'healing' | 'economy' | 'commerce' | 'gathering' | 'kinship' | 'audio' | 'treasury' | 'admin' | 'advertise' | 'academy'>('landing');
  const [commonsSubTab, setCommonsSubTab] = useState<'feed' | 'exchange' | 'housing' | 'businesses' | 'events' | 'map'>('feed');
  const [commonsSelectedTopic, setCommonsSelectedTopic] = useState<string>('all');
  const [showMobilePostSheet, setShowMobilePostSheet] = useState<boolean>(false);
  const [createPostTriggerType, setCreatePostTriggerType] = useState<'feed' | 'exchange' | 'housing' | null>(null);
  const [showGlobalSupportModal, setShowGlobalSupportModal] = useState(false);
  
  // App Config & Personalization State
  const [selectedState, setSelectedState] = useState<string>('GA');
  const [userName, setUserName] = useState<string>('Mama Shantrece');
  const [complianceNotice, setComplianceNotice] = useState<StateComplianceConfig | null>(null);
  const [showComplianceDetail, setShowComplianceDetail] = useState(false);
  const [consentAccepted, setConsentAccepted] = useState(true);

  // Global Saved & Bookmarked Items across Copper Mommies
  const [savedItems, setSavedItems] = useState<SavedCommonsItem[]>(() => {
    try {
      const local = localStorage.getItem('copper_commons_saved_items');
      if (local) return JSON.parse(local);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'sugg-1',
        type: 'exchange',
        title: 'Solid Hardwood Montessori Bookshelf',
        subtitle: 'Free giveaway in West End / Cascade, Atlanta',
        imageUrl: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=600&q=80',
        categoryBadge: 'Free Giveaway',
        location: 'Atlanta, GA',
        terms: '100% Free Gift'
      },
      {
        id: 'sugg-2',
        type: 'housing',
        title: 'Garden Cottage & Private Guest Suite',
        subtitle: 'Private garden entrance, peaceful work nook & bath',
        imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
        categoryBadge: 'Housing Haven',
        location: 'Stone Mountain, GA',
        terms: '$650/mo utilities included'
      },
      {
        id: 'sugg-3',
        type: 'business',
        title: 'Roots & Resilience Master Apothecary',
        subtitle: 'Ancestral botanical oxymels & nettle infusions',
        imageUrl: '/apothecary_sister_herbal.jpg',
        categoryBadge: 'Sister Business',
        location: 'Atlanta, GA',
        terms: '15% Off with code COPPERMOMMIE'
      }
    ];
  });

  const handleRemoveSavedItem = (id: string) => {
    setSavedItems(prev => {
      const updated = prev.filter(item => item.id !== id);
      try {
        localStorage.setItem('copper_commons_saved_items', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // Phase 3: Audio Sanctuary Lounge & Persistent Audio State
  const [audioTracks, setAudioTracks] = useState<AudioTrack[]>(INITIAL_AUDIO_TRACKS);
  const [voiceNotes, setVoiceNotes] = useState<VoiceNoteReflection[]>(INITIAL_VOICE_NOTES);
  const [firesideRoom, setFiresideRoom] = useState<FiresideVoiceRoom>(INITIAL_FIRESIDE_ROOM);

  const [currentAudioTrack, setCurrentAudioTrack] = useState<AudioTrack | null>(INITIAL_AUDIO_TRACKS[0]);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState<number>(0);
  const [audioDuration, setAudioDuration] = useState<number>(INITIAL_AUDIO_TRACKS[0]?.durationSeconds || 1800);
  const [audioPlaybackRate, setAudioPlaybackRate] = useState<number>(1.0);
  const [audioVolume, setAudioVolume] = useState<number>(0.85);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Hearth Mood State (Aesthetic Atmosphere & Personal Rhythm)
  const [hearthMood, setHearthMood] = useState<HearthMoodId>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('copper_mommies_hearth_mood');
      if (saved && ['reflection', 'community', 'study', 'ancestral'].includes(saved)) {
        return saved as HearthMoodId;
      }
    }
    return 'reflection';
  });

  const handleSelectHearthMood = (moodId: HearthMoodId) => {
    setHearthMood(moodId);
    if (typeof window !== 'undefined') {
      localStorage.setItem('copper_mommies_hearth_mood', moodId);
    }
  };

  const activeHearth = HEARTH_MOODS[hearthMood] || HEARTH_MOODS.reflection;

  // Role Simulation state to make reviewing incredibly fast & comprehensive
  const [simulatedRole, setSimulatedRoleState] = useState<'applicant' | 'approved' | 'representative' | 'admin'>(() => {
    if (typeof window !== 'undefined') {
      const savedRole = localStorage.getItem('copper_mommies_role');
      if (savedRole === 'applicant' || savedRole === 'approved' || savedRole === 'representative' || savedRole === 'admin') {
        return savedRole;
      }
    }
    return 'approved';
  });

  const setSimulatedRole = (role: 'applicant' | 'approved' | 'representative' | 'admin') => {
    setSimulatedRoleState(role);
    if (typeof window !== 'undefined') {
      localStorage.setItem('copper_mommies_role', role);
    }
  };

  // Founder Admin Login Modal state
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);
  const [showMemberLoginModal, setShowMemberLoginModal] = useState(false);
  const [showSisterProfileMenu, setShowSisterProfileMenu] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [adminLoginError, setAdminLoginError] = useState('');
  const [memberEmailInput, setMemberEmailInput] = useState('shantrecetogetherwewin@gmail.com');
  const [stayLoggedIn, setStayLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem('copper_mommies_stay_logged_in') !== 'false';
    } catch {
      return true;
    }
  });

  // Navigation History State for Return Breadcrumbs
  const [lastVisitedTab, setLastVisitedTab] = useState<string | null>(null);
  const [profileInitialTab, setProfileInitialTab] = useState<'overview' | 'chats' | 'bookmarks' | 'posts' | 'events' | 'faves' | 'groups' | 'ledger'>('overview');
  const [barterList, setBarterList] = useState<BarterOffer[]>([]);
  const [eventsList, setEventsList] = useState<CoopEvent[]>([]);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  
  // Real-Time Member Direct Chat Threads
  const [chatThreads, setChatThreads] = useState<DirectChatThread[]>(() => {
    try {
      const local = localStorage.getItem('copper_mommies_chat_threads');
      if (local) return JSON.parse(local);
    } catch (e) {}
    return INITIAL_DIRECT_CHAT_THREADS;
  });
  const [chatMembers] = useState<ChatMember[]>(INITIAL_CHAT_MEMBERS);

  const handleSendDirectMessage = (threadId: string, text: string, replyTo?: { id: string; text: string; senderName: string }) => {
    const newMsg: DirectChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'me',
      senderName: userName || 'Shantrece Clark',
      senderAvatar: '/coppermommies-selflove1-cmc.jpg',
      text: text.trim(),
      timestamp: 'Just now',
      isMe: true,
      replyTo: replyTo
    };

    setChatThreads(prev => {
      const updated = prev.map(t => {
        if (t.id === threadId) {
          return {
            ...t,
            lastMessage: `You: ${text.trim()}`,
            lastMessageTime: 'Just now',
            messages: [...t.messages, newMsg]
          };
        }
        return t;
      });
      try {
        localStorage.setItem('copper_mommies_chat_threads', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const handleEditDirectMessage = (threadId: string, messageId: string, newText: string) => {
    setChatThreads(prev => {
      const updated = prev.map(t => {
        if (t.id === threadId) {
          return {
            ...t,
            messages: t.messages.map(m => m.id === messageId ? { ...m, text: newText, isEdited: true } : m)
          };
        }
        return t;
      });
      try {
        localStorage.setItem('copper_mommies_chat_threads', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const handleDeleteDirectMessage = (threadId: string, messageId: string) => {
    setChatThreads(prev => {
      const updated = prev.map(t => {
        if (t.id === threadId) {
          return {
            ...t,
            messages: t.messages.filter(m => m.id !== messageId)
          };
        }
        return t;
      });
      try {
        localStorage.setItem('copper_mommies_chat_threads', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const handlePinDirectMessage = (threadId: string, messageId: string) => {
    setChatThreads(prev => {
      const updated = prev.map(t => {
        if (t.id === threadId) {
          return {
            ...t,
            messages: t.messages.map(m => m.id === messageId ? { ...m, isPinned: !m.isPinned } : m)
          };
        }
        return t;
      });
      try {
        localStorage.setItem('copper_mommies_chat_threads', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const handleReactDirectMessage = (threadId: string, messageId: string, emoji: string) => {
    setChatThreads(prev => {
      const updated = prev.map(t => {
        if (t.id === threadId) {
          return {
            ...t,
            messages: t.messages.map(m => {
              if (m.id === messageId) {
                const prevReactions = m.reactions || [];
                const exists = prevReactions.find(r => r.emoji === emoji);
                const updatedReactions = exists
                  ? prevReactions.map(r => r.emoji === emoji ? { ...r, count: r.count + 1 } : r)
                  : [...prevReactions, { emoji, count: 1 }];
                return { ...m, reactions: updatedReactions };
              }
              return m;
            })
          };
        }
        return t;
      });
      try {
        localStorage.setItem('copper_mommies_chat_threads', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const handleCreateNewChat = (participantId: string, initialMessage?: string) => {
    const targetMember = chatMembers.find(m => m.id === participantId);
    if (!targetMember) return;

    const existing = chatThreads.find(t => t.participantId === participantId);
    if (existing) {
      if (initialMessage?.trim()) {
        handleSendDirectMessage(existing.id, initialMessage.trim());
      }
      return;
    }

    const newThread: DirectChatThread = {
      id: `chat-${Date.now()}`,
      participantId: targetMember.id,
      participantName: targetMember.name,
      participantAvatar: targetMember.avatar,
      participantNeighborhood: targetMember.neighborhood,
      category: 'dm',
      originSectionLabel: 'Direct Sister Inquiry',
      lastMessage: initialMessage?.trim() ? `You: ${initialMessage.trim()}` : 'Conversation started',
      lastMessageTime: 'Just now',
      unreadCount: 0,
      messages: initialMessage?.trim() ? [
        {
          id: `m-${Date.now()}`,
          senderId: 'me',
          senderName: userName || 'Shantrece Clark',
          senderAvatar: '/coppermommies-selflove1-cmc.jpg',
          text: initialMessage.trim(),
          timestamp: 'Just now',
          isMe: true
        }
      ] : []
    };

    setChatThreads(prev => {
      const updated = [newThread, ...prev];
      try {
        localStorage.setItem('copper_mommies_chat_threads', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const handleOpenDirectChatWithContext = (recipientName: string, contextTitle: string, initialNote?: string) => {
    let targetMember = chatMembers.find(m => m.name.toLowerCase() === recipientName.toLowerCase());
    if (!targetMember) {
      targetMember = {
        id: `member-${Date.now()}`,
        name: recipientName,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        neighborhood: `${selectedState} Circle`,
        role: 'Circle Sister'
      };
    }

    const newThread: DirectChatThread = {
      id: `chat-${Date.now()}`,
      participantId: targetMember.id,
      participantName: targetMember.name,
      participantAvatar: targetMember.avatar,
      participantNeighborhood: targetMember.neighborhood,
      category: 'housing',
      originSectionLabel: contextTitle,
      lastMessage: initialNote?.trim() ? `You: ${initialNote.trim()}` : `Inquiry regarding ${contextTitle}`,
      lastMessageTime: 'Just now',
      unreadCount: 0,
      messages: initialNote?.trim() ? [
        {
          id: `m-${Date.now()}`,
          senderId: 'me',
          senderName: userName || 'Shantrece Clark',
          senderAvatar: '/coppermommies-selflove1-cmc.jpg',
          text: initialNote.trim(),
          timestamp: 'Just now',
          isMe: true
        }
      ] : []
    };

    setChatThreads(prev => {
      const updated = [newThread, ...prev.filter(t => t.participantName !== recipientName)];
      try {
        localStorage.setItem('copper_mommies_chat_threads', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };
  
  // Form States inside App
  const [newMessageText, setNewMessageText] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  // Gemini AI Advisor State
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  // Sovereign Time-Credits State
  const [timeBalance, setTimeBalance] = useState<number>(14.5); // Hours of co-op contributions
  const [generosityScore, setGenerosityScore] = useState<number>(12);
  const [tradeBalance, setTradeBalance] = useState<number>(8);
  const [timeLogs, setTimeLogs] = useState<TimeCreditLog[]>([
    { id: '1', activity: 'Homeschool Algebra tutoring support', hours: 2, date: 'July 11, 2026', type: 'earn' },
    { id: '2', activity: 'Received 1 gallon raw honey & microgreens', hours: -1.5, date: 'July 10, 2026', type: 'spend' },
    { id: '3', activity: 'Weekend Childcare rotation swap contribution', hours: 4, date: 'July 05, 2026', type: 'earn' },
    { id: '4', activity: 'Cooperative soil turning & seeding', hours: 3, date: 'July 02, 2026', type: 'earn' }
  ]);

  // Vetting Flow state
  const [currentApplication, setCurrentApplication] = useState<Applicant | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([
    {
      id: 'app-9812',
      name: 'Sister Nia',
      email: 'nia.clarke@yahoo.com',
      ageRange: '30–39',
      currentLocation: 'Houston, TX',
      childrenAndAges: '2 boys: Ages 3 and 7',
      socialHandle: '@nia_clarke_homestead',
      phoneNumber: '(713) 555-0192',
      isMotherOrGuardian: true,
      motherhoodStatus: '2 boys: Ages 3 and 7',
      maternalGeography: 'Houston, Harris County, TX & Nacogdoches County, TX',
      lineageLocation: 'Houston, Harris County, Texas',
      connectionStatement: 'Reclaiming our true American lineage means anchoring my sons in the truth that their roots belong to this sacred soil. Stepping into a self-governed spiritual village allows us to raise self-reliant, grounded children wrapped in genuine sisterhood and mutual care.',
      agreedToCodeOfConduct: true,
      grandmotherBirthplace: 'Nacogdoches County, TX',
      paternalGrandmotherBirthplace: 'San Augustine, TX',
      status: 'pending',
      submittedAt: 'Today',
      stateCode: 'TX',
      invitationLink: 'https://coppermommies.co/sanctuary/invite/TX-9812-INVITE'
    },
    {
      id: 'app-1053',
      name: 'Mama Keisha',
      email: 'keisha.b@gmail.com',
      ageRange: '30–39',
      currentLocation: 'Bowie, MD',
      childrenAndAges: '1 daughter: Age 9',
      socialHandle: '@keishabotanicals',
      phoneNumber: '(301) 555-0143',
      isMotherOrGuardian: true,
      motherhoodStatus: '1 daughter: Age 9',
      maternalGeography: 'Prince George\'s County, MD & Macon, Bibb County, GA',
      lineageLocation: 'Prince George\'s County, Maryland',
      connectionStatement: 'To me, claiming our identity means teaching my daughter that her heritage on this land is rich, complete, and unborrowed. A self-governed village gives us peace of mind and cooperative resources to thrive spiritually and economically.',
      agreedToCodeOfConduct: true,
      grandmotherBirthplace: 'Macon, Bibb County, GA',
      paternalGrandmotherBirthplace: 'Fulton County, GA',
      status: 'pending',
      submittedAt: 'Today',
      stateCode: 'MD',
      invitationLink: 'https://coppermommies.co/sanctuary/invite/MD-1053-INVITE'
    },
    {
      id: 'app-2034',
      name: 'Sister Althea',
      email: 'althea.v@yahoo.com',
      ageRange: '40–49',
      currentLocation: 'Richmond, VA',
      childrenAndAges: '3 children: Ages 4, 8, and 12',
      socialHandle: '@althea_fiberarts',
      phoneNumber: '(804) 555-0188',
      isMotherOrGuardian: true,
      motherhoodStatus: '3 children: Ages 4, 8, and 12',
      maternalGeography: 'Richmond, Henrico County, VA & Petersburg, VA',
      lineageLocation: 'Richmond, Henrico County, Virginia',
      connectionStatement: 'Reclaiming our identity releases us from outside dogma and returns our family to our ancestral ways of crafting, herbal care, and homeschooling. In a self-governed village, our children grow up protected, confident, and deeply loved.',
      agreedToCodeOfConduct: true,
      grandmotherBirthplace: 'Richmond, VA',
      paternalGrandmotherBirthplace: 'Petersburg, VA',
      status: 'pending',
      submittedAt: 'Today',
      stateCode: 'VA',
      invitationLink: 'https://coppermommies.co/sanctuary/invite/VA-2034-INVITE'
    },
    {
      id: 'app-3041',
      name: 'Sister Clara',
      email: 'clara.ala@coop.org',
      ageRange: '30–39',
      currentLocation: 'Birmingham, AL',
      childrenAndAges: '4 children: Ages 2, 5, 8, and 11',
      socialHandle: '@clara_homestead_al',
      phoneNumber: '(205) 555-0177',
      isMotherOrGuardian: true,
      motherhoodStatus: '4 children: Ages 2, 5, 8, and 11',
      maternalGeography: 'Birmingham, Jefferson County, AL & Selma, Dallas County, AL',
      lineageLocation: 'Birmingham, Jefferson County, Alabama',
      connectionStatement: 'We seek to join the land pooling network to offer organic poultry incubation mentorship.',
      agreedToCodeOfConduct: true,
      grandmotherBirthplace: 'Selma, Dallas County, AL',
      paternalGrandmotherBirthplace: 'Lowndes County, AL',
      status: 'pending',
      submittedAt: 'Today',
      stateCode: 'AL',
      invitationLink: 'https://coppermommies.co/sanctuary/invite/AL-3041-INVITE'
    },
    {
      id: 'app-0012',
      name: 'Mama Jamila',
      email: 'jamila.village@coop.net',
      ageRange: '30–39',
      currentLocation: 'Atlanta, GA',
      childrenAndAges: '3 children: Ages 4, 7, and 10',
      socialHandle: '@jamila_sovereign',
      phoneNumber: '(404) 555-0199',
      isMotherOrGuardian: true,
      motherhoodStatus: '3 children: Ages 4, 7, and 10',
      maternalGeography: 'Southside Atlanta, Fulton County, GA & Beaufort, SC',
      lineageLocation: 'Southside Atlanta, Fulton County, Georgia',
      connectionStatement: 'Pioneering mathematical curriculums and agricultural barter systems.',
      agreedToCodeOfConduct: true,
      grandmotherBirthplace: 'Beaufort, SC',
      paternalGrandmotherBirthplace: 'Macon, GA',
      status: 'approved',
      isStateSpearhead: true,
      submittedAt: '3 days ago',
      stateCode: 'GA',
      invitationLink: 'https://coppermommies.co/sanctuary/invite/GA-0012-INVITE'
    },
    {
      id: 'app-0014',
      name: 'Auntie Brenda',
      email: 'brenda.gardens@coop.net',
      ageRange: '50+',
      currentLocation: 'Oakland, CA',
      childrenAndAges: '2 adult children & 3 grandchildren',
      socialHandle: '@brenda_urbanacres',
      phoneNumber: '(510) 555-0134',
      isMotherOrGuardian: true,
      motherhoodStatus: '2 adult children & 3 grandchildren',
      maternalGeography: 'Oakland, Alameda County, CA & Los Angeles, CA',
      lineageLocation: 'Oakland, Alameda County, California',
      connectionStatement: 'Sovereign food security and organic composting setups.',
      agreedToCodeOfConduct: true,
      grandmotherBirthplace: 'Oakland, CA',
      paternalGrandmotherBirthplace: 'Los Angeles, CA',
      status: 'approved',
      isStateSpearhead: true,
      submittedAt: '5 days ago',
      stateCode: 'CA',
      invitationLink: 'https://coppermommies.co/sanctuary/invite/CA-0014-INVITE'
    }
  ]);

  // Page Spotlight Banners State across all Hubs
  const [spotlightBanners, setSpotlightBanners] = useState<PageSpotlightBanner[]>([
    {
      id: 'spotlight-village',
      pageId: 'village',
      title: 'NestBright Academy — Elementary Homeschool Sponsorship & Access',
      subtitle: 'Grades 3–5 Curriculum • Sovereign American Heritage • Math & Reading Labs',
      description: 'We are gifting 5 verified Copper Mommies with 1 year of 100% free full access to NestBright Academy for their elementary child (Grades 3–5). In addition, all community members receive a deep sovereign rate of only $5.99/month (regularly $19.99/mo).',
      bannerImage: '/nestbright_banner.jpg',
      externalLink: 'https://nestbrightacademy.com',
      buttonText: 'Visit NestBright Academy',
      promoPrice: '$5.99 / mo',
      promoCode: 'COPPERMOMMIES',
      contactEmail: 'shantrecetogetherwewin@gmail.com',
      contestDetails: {
        active: true,
        title: '5 Free Annual NestBright Passes Giveaway',
        eligibility: 'Open to verified Copper Mommies with children entering or currently in Grades 3, 4, or 5.',
        submissionRequirements: [
          'Child\'s current grade level (must be Grade 3, 4, or 5).',
          'Brief 2–3 sentence reflection on your family\'s sovereign homeschool goals for this academic season.',
          'Active mother or guardian membership verification in good standing.'
        ],
        drawDate: 'Drawn monthly at the New Moon Community Gathering Circle.'
      },
      active: true
    },
    {
      id: 'spotlight-healing-1',
      pageId: 'healing',
      categoryBadge: 'Featured Botanical Remedy Spotlight',
      title: 'Gullah Sea Island Botanical Lung & Vitality Elixirs',
      subtitle: 'Wildcrafted Georgia & Lowcountry Mullein, Elderberry & Sweetgum Infusions',
      description: 'Hand-harvested by our coastal grandmother guild. Certified chemical-free, solar-steeped, and packed with ancestral mineral rich plants for children and mothers across every stage of life.',
      externalLink: 'https://coppermommies.co/apothecary',
      buttonText: 'Order Botanical Remedies',
      promoPrice: '15% Off Guild Orders',
      promoCode: 'SEAISLAND15',
      contactEmail: 'shantrecetogetherwewin@gmail.com',
      active: true
    },
    {
      id: 'spotlight-healing-2',
      pageId: 'healing',
      categoryBadge: 'New Guild Herbal Release',
      title: 'Ancestral Mineral-Rich Bone Broth & Nettle Vitality Pouches',
      subtitle: 'Organically Foraged Stinging Nettle, Yellow Dock & Iron-Rich Root Tinctures',
      description: 'Formulated for deep energy replenishment, whole-family stamina, and restorative herbal nourishment for busy mothers and growing children.',
      externalLink: 'https://coppermommies.co/vitality',
      buttonText: 'Explore Vitality Kit',
      promoPrice: 'Free Shipping for Circles',
      promoCode: 'VITALITY40',
      contactEmail: 'shantrecetogetherwewin@gmail.com',
      active: true
    },
    {
      id: 'spotlight-economy-1',
      pageId: 'economy',
      categoryBadge: 'Seasonal Harvest Drive',
      title: 'Annual Heirloom Seed & Cast-Iron Homestead Tool Drive',
      subtitle: 'Ancestral Non-GMO Okra, Sea Island Red Pea & Seminole Squash Seeds',
      description: 'Contribute organic heirloom seed stocks or deposit hand-forged tools into the collective repository. Receive 1.5x Time Credits during this harvest season.',
      externalLink: 'https://coppermommies.co/seed-bank',
      buttonText: 'View Seed Exchange Catalog',
      promoPrice: 'Earn 1.5x Time Credits',
      contactEmail: 'shantrecetogetherwewin@gmail.com',
      active: true
    },
    {
      id: 'spotlight-economy-2',
      pageId: 'economy',
      categoryBadge: 'Mutual Skill Sharing Registry',
      title: 'Mother-to-Mother Labor Trade & Childcare Exchange Guild',
      subtitle: 'Deposit Service Hours • Claim Natural Birth Support, Cooking & Homemaking Assistance',
      description: 'Exchange services peer-to-peer with zero debt or dollar transactions. Built on our trusted Ledger of Generosity.',
      externalLink: 'https://coppermommies.co/time-banking',
      buttonText: 'Log Service Exchange',
      promoPrice: '100% Interest Free',
      contactEmail: 'shantrecetogetherwewin@gmail.com',
      active: true
    },
    {
      id: 'spotlight-commerce-1',
      pageId: 'commerce',
      categoryBadge: 'Micro-Enterprise Incubator',
      title: 'Kitchen Craft to Thriving LLC: 4-Week Incubator Intensive',
      subtitle: 'Legal Formations • Trademarking • Trade Bureau Licensing • Zero Debt Scaling',
      description: 'Transform home remedies, natural birth services, or botanical goods into legally protected community enterprises. Free downloadable templates included.',
      externalLink: 'https://coppermommies.co/incubator',
      buttonText: 'Register for Masterclass',
      promoPrice: 'Free for Circle Members',
      contactEmail: 'shantrecetogetherwewin@gmail.com',
      active: true
    },
    {
      id: 'spotlight-commerce-2',
      pageId: 'commerce',
      categoryBadge: 'Maternal Business Micro-Grants',
      title: 'Copper Matriarch Business Grant & Equipment Guild',
      subtitle: 'Equipment Funding for Homeschool Co-Ops, Artisan Kitchens & Herbal Guilds',
      description: 'Direct community-funded grants ranging from $500 to $2,500 for mothers launching sustainable enterprises.',
      externalLink: 'https://coppermommies.co/grants',
      buttonText: 'Apply for Micro-Grant',
      promoPrice: 'Non-Repayable Seed Funds',
      contactEmail: 'shantrecetogetherwewin@gmail.com',
      active: true
    },
    {
      id: 'spotlight-gathering-1',
      pageId: 'gathering',
      categoryBadge: 'Live Dialogue Series',
      title: 'The Casual Corner Talk — The Copper Circle Live Dialogues',
      subtitle: 'An Intimate Circle for Raw Sisterhood, Motherhood Realities & Keeping It Real',
      description: 'Welcome to The Casual Corner Talk — the signature live dialogue series of The Copper Circle. Pull up a chair as we jumpstart unhurried, soul-nourishing conversations on real motherhood, raising children of all ages, everyday homesteading realities, holistic family wellness, and growing together in authentic sisterhood.',
      bannerImage: '/The Casual Corner Talk.jpeg',
      externalLink: 'https://coppermommies.co/casual-corner-talk',
      buttonText: 'RSVP to Next Casual Corner Talk',
      promoPrice: 'Sacred Sanctuary Live',
      promoCode: 'COPPERCIRCLE',
      contactEmail: 'shantrecetogetherwewin@gmail.com',
      active: true
    },
    {
      id: 'spotlight-gathering-2',
      pageId: 'gathering',
      categoryBadge: 'Regional Circle Gathering',
      title: 'New Moon Sister Gathering & Ancestral Story Circle',
      subtitle: 'Monthly Live Virtual & In-Person Circles across Georgia, Texas, and South Carolina',
      description: 'Gather with local sisters to share real-life mothering experiences, family wellness recipes, homeschool tips, and collaborative childcare support.',
      externalLink: 'https://coppermommies.co/gatherings',
      buttonText: 'Find Local Circle Meetup',
      promoPrice: 'Open to Verified Mothers',
      contactEmail: 'shantrecetogetherwewin@gmail.com',
      active: true
    },
    {
      id: 'spotlight-kinship-1',
      pageId: 'kinship',
      categoryBadge: 'Land Protection Masterclass',
      title: 'Family Land Trust & Heir Property Protection Legal Workshop',
      subtitle: 'Guard Your Ancestral Land • Establish Sovereign Private Trusts • Prevent Partition Sales',
      description: 'Step-by-step estate planning and land preservation masterclass led by indigenous land attorneys and elder council trustees.',
      externalLink: 'https://coppermommies.co/land-trusts',
      buttonText: 'Access Trust Documents',
      promoPrice: 'Complimentary Access',
      contactEmail: 'shantrecetogetherwewin@gmail.com',
      active: true
    },
    {
      id: 'spotlight-kinship-2',
      pageId: 'kinship',
      categoryBadge: 'Ancestral Archives & Genealogy',
      title: 'Kinship Vault Heritage Preservation & Sovereign Records',
      subtitle: 'Secure Decentralized Archive for Family Genealogies & Ancestral Land Deeds',
      description: 'Store and encrypt your family history, birth records, and property deeds in our private community vault.',
      externalLink: 'https://coppermommies.co/kinship-records',
      buttonText: 'Open Vault Portal',
      promoPrice: 'Encrypted & Sovereign',
      contactEmail: 'shantrecetogetherwewin@gmail.com',
      active: true
    }
  ]);

  // Scholarship Submissions for NestBright Contest
  const [scholarshipEntries, setScholarshipEntries] = useState<ScholarshipEntry[]>([
    {
      id: 'sch-1',
      motherName: 'Sister Nia',
      motherEmail: 'nia.austin@coop.net',
      childName: 'Malik',
      childGrade: 'Grade 4',
      learningGoals: 'Strengthening independent reading stamina, indigenous geography, and practical geometry through sacred pattern study.',
      submittedAt: 'Yesterday at 3:15 PM',
      stateCode: 'TX',
      verifiedStatus: 'Pending Verification',
      ticketCode: 'NIST-TX-4482'
    },
    {
      id: 'sch-2',
      motherName: 'Mama Keisha',
      motherEmail: 'keisha.midwife@sanctuary.org',
      childName: 'Sanaa',
      childGrade: 'Grade 3',
      learningGoals: 'Desires self-paced reading and elementary mathematics grounding that honors our maternal heritage and botanical science.',
      submittedAt: '2 days ago',
      stateCode: 'MD',
      verifiedStatus: 'Pending Verification',
      ticketCode: 'NIST-MD-3109'
    },
    {
      id: 'sch-3',
      motherName: 'Sister Althea',
      motherEmail: 'althea.herbal@earth.org',
      childName: 'Tariq',
      childGrade: 'Grade 5',
      learningGoals: 'Preparing for middle school logic and writing while maintaining sovereign homeschooling flexibility on our family homestead.',
      submittedAt: '3 days ago',
      stateCode: 'VA',
      verifiedStatus: 'Pending Verification',
      ticketCode: 'NIST-VA-5521'
    },
    {
      id: 'sch-4',
      motherName: 'Auntie Brenda',
      motherEmail: 'brenda.gardens@coop.net',
      childName: 'Zuri',
      childGrade: 'Grade 4',
      learningGoals: 'Building strong computational literacy and natural sciences that tie into our backyard garden laboratory and ancestral homesteading.',
      submittedAt: '4 days ago',
      stateCode: 'CA',
      verifiedStatus: 'Pending Verification',
      ticketCode: 'NIST-CA-4091'
    }
  ]);

  // Spotlight handlers
  const handleUpdateSpotlight = (updatedBanner: PageSpotlightBanner) => {
    setSpotlightBanners(prev => prev.map(b => b.id === updatedBanner.id ? updatedBanner : b));
  };

  const handleToggleSpotlightActive = (id: string) => {
    setSpotlightBanners(prev => prev.map(b => b.id === id ? { ...b, active: !b.active } : b));
  };

  const handleDeleteSpotlight = (id: string) => {
    setSpotlightBanners(prev => prev.filter(b => b.id !== id));
  };

  const handleReorderSpotlights = (reorderedBanners: PageSpotlightBanner[]) => {
    setSpotlightBanners(reorderedBanners);
  };

  // Phase 2: Bulletins, Disputes & Hearth Sessions States
  const [bulletins, setBulletins] = useState<BroadcastBulletin[]>(INITIAL_BROADCAST_BULLETINS);
  const [disputes, setDisputes] = useState<BarterDisputeRecord[]>(INITIAL_DISPUTES);
  const [hearthSessions, setHearthSessions] = useState<HearthGatheringSession[]>(INITIAL_HEARTH_SESSIONS);

  // Phase 4: Hearth Polls & Topic Voting Hub States
  const [polls, setPolls] = useState<VillagePoll[]>(initialVillagePolls);

  const handleVotePoll = (pollId: string, optionId: string) => {
    setPolls(prev => prev.map(p => {
      if (p.id === pollId) {
        const updatedOptions = p.options.map(opt => {
          const isSelected = opt.id === optionId;
          const alreadyVotedThisOption = opt.voterNames.includes(userName);
          if (isSelected) {
            return {
              ...opt,
              votes: alreadyVotedThisOption ? opt.votes : opt.votes + 1,
              voterNames: alreadyVotedThisOption ? opt.voterNames : [...opt.voterNames, userName]
            };
          } else {
            return {
              ...opt,
              votes: opt.voterNames.includes(userName) ? Math.max(0, opt.votes - 1) : opt.votes,
              voterNames: opt.voterNames.filter(n => n !== userName)
            };
          }
        });
        return { ...p, options: updatedOptions };
      }
      return p;
    }));

    fetch(`/api/polls/${pollId}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ optionId, userName })
    }).catch(err => console.log('Poll vote stored locally:', err));
  };

  const handleSuggestPoll = (pollId: string, suggestionText: string) => {
    const newSug = {
      id: `sug-${Date.now()}`,
      suggestionText,
      submittedBy: userName,
      submittedAt: 'Just now'
    };
    setPolls(prev => prev.map(p => {
      if (p.id === pollId) {
        return {
          ...p,
          memberSuggestions: [...(p.memberSuggestions || []), newSug]
        };
      }
      return p;
    }));

    fetch(`/api/polls/${pollId}/suggest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ suggestionText, userName })
    }).catch(err => console.log('Suggestion stored locally:', err));
  };

  const handleAddPoll = (newPoll: Partial<VillagePoll>) => {
    const pollObj: VillagePoll = {
      id: `poll-${Date.now()}`,
      title: newPoll.title || 'Untitled Ballot',
      description: newPoll.description || '',
      category: newPoll.category || 'casual-corner',
      creatorName: userName,
      creatorRole: simulatedRole === 'admin' ? 'Founder & Admin' : 'Sister Circle Member',
      createdAt: 'Just now',
      closesAt: newPoll.closesAt || 'In 7 Days',
      allowCustomSuggestions: newPoll.allowCustomSuggestions ?? true,
      isCrowdfundedClass: newPoll.isCrowdfundedClass ?? false,
      crowdfundGoal: newPoll.crowdfundGoal,
      crowdfundRaised: '$0',
      active: true,
      featuredOnCasualCorner: newPoll.featuredOnCasualCorner ?? true,
      options: newPoll.options || [],
      memberSuggestions: []
    };
    setPolls(prev => [pollObj, ...prev]);

    fetch('/api/polls', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pollObj)
    }).catch(err => console.log('Poll stored locally:', err));
  };

  const handleTogglePollActive = (id: string) => {
    setPolls(prev => prev.map(p => p.id === id ? { ...p, active: !p.active } : p));
    fetch(`/api/polls/${id}/toggle`, { method: 'PATCH' }).catch(err => console.log('Poll toggle local:', err));
  };

  const handleDeletePoll = (id: string) => {
    setPolls(prev => prev.filter(p => p.id !== id));
    fetch(`/api/polls/${id}`, { method: 'DELETE' }).catch(err => console.log('Poll delete local:', err));
  };

  const handleFeaturePoll = (id: string) => {
    setPolls(prev => prev.map(p => p.id === id ? { ...p, featuredOnCasualCorner: !p.featuredOnCasualCorner } : p));
  };

  const handleBroadcastPoll = (poll: VillagePoll) => {
    const newBulletin: BroadcastBulletin = {
      id: `bulletin-poll-${Date.now()}`,
      headline: `🗳️ Community Vote: ${poll.title}`,
      category: 'Live Casual Corner Talk',
      detail: `All sisters are invited to cast their ballot on our upcoming live talk topic or class: "${poll.title}".`,
      actionText: 'Cast Your Ballot',
      actionUrl: '#hearth-polls-section',
      publishedAt: 'Just now',
      active: true,
      priority: 'high',
      targetState: 'ALL'
    };
    setBulletins(prev => [newBulletin, ...prev]);
  };

  const handleAddBulletin = (newB: BroadcastBulletin) => {
    setBulletins(prev => [newB, ...prev]);
  };

  const handleUpdateBulletin = (updatedB: BroadcastBulletin) => {
    setBulletins(prev => prev.map(b => b.id === updatedB.id ? updatedB : b));
  };

  const handleDeleteBulletin = (id: string) => {
    setBulletins(prev => prev.filter(b => b.id !== id));
  };

  const handleToggleBulletinActive = (id: string) => {
    setBulletins(prev => prev.map(b => b.id === id ? { ...b, active: !b.active } : b));
  };

  const handleResolveDispute = (id: string, decision: string, refundHours: number) => {
    setDisputes(prev => prev.map(d => {
      if (d.id === id) {
        return {
          ...d,
          status: refundHours > 0 ? 'Resolved & Recredited' : 'Dismissed',
          elderDecision: decision,
          resolvedAt: 'Just now',
          resolvedBy: 'Grandmother Council Matriarch'
        };
      }
      return d;
    }));
  };

  const handleAddLedgerAdjustment = (sisterName: string, hours: number, reason: string, type: 'earn' | 'spend') => {
    handleAddLedgerLog(`Sovereign Ledger Adjustment for ${sisterName}: ${reason}`, hours, type);
    if (sisterName.toLowerCase().includes(userName.toLowerCase())) {
      setTradeBalance(prev => Math.max(0, (prev || 12.0) + (type === 'earn' ? hours : -hours)));
    }
  };

  const handleAddHearthSession = (session: HearthGatheringSession) => {
    setHearthSessions(prev => [session, ...prev]);
  };

  const handleUpdateHearthSession = (session: HearthGatheringSession) => {
    setHearthSessions(prev => prev.map(h => h.id === session.id ? session : h));
  };

  const handleDeleteHearthSession = (id: string) => {
    setHearthSessions(prev => prev.filter(h => h.id !== id));
  };

  const handleToggleHearthLive = (id: string) => {
    setHearthSessions(prev => prev.map(h => {
      if (h.id === id) {
        const nextStatus = h.status === 'Live Now' ? 'Scheduled' : 'Live Now';
        return { ...h, status: nextStatus };
      }
      return h;
    }));
  };

  const handleAddScholarshipEntry = (entry: ScholarshipEntry) => {
    setScholarshipEntries(prev => [entry, ...prev]);
  };

  const handleSelectWinner = (id: string) => {
    setScholarshipEntries(prev => prev.map(e => e.id === id ? {
      ...e,
      verifiedStatus: e.verifiedStatus === 'Selected Winner' ? 'Pending Verification' : 'Selected Winner'
    } : e));
  };

  const handleDrawRandomWinners = (count: number = 5) => {
    setScholarshipEntries(prev => {
      const shuffled = [...prev].sort(() => 0.5 - Math.random());
      const selectedIds = new Set(shuffled.slice(0, count).map(e => e.id));
      return prev.map(e => ({
        ...e,
        verifiedStatus: selectedIds.has(e.id) ? 'Selected Winner' : 'Pending Verification'
      }));
    });
  };

  const handleAddSpotlight = (newBanner: PageSpotlightBanner) => {
    setSpotlightBanners(prev => [newBanner, ...prev]);
  };

  // ==========================================
  // PHASE 3: AUDIO SANCTUARY HANDLERS
  // ==========================================
  const handlePlayTrack = (track: AudioTrack) => {
    setCurrentAudioTrack(track);
    setIsAudioPlaying(true);
    if (audioRef.current) {
      if (audioRef.current.src !== track.audioUrl) {
        audioRef.current.src = track.audioUrl;
        audioRef.current.load();
      }
      audioRef.current.play().catch(err => {
        console.log('Audio playback notice:', err);
      });
    }
  };

  const handlePauseTrack = () => {
    setIsAudioPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const handleTogglePlayPause = () => {
    if (isAudioPlaying) {
      handlePauseTrack();
    } else if (currentAudioTrack) {
      handlePlayTrack(currentAudioTrack);
    }
  };

  const handleSeekAudio = (seconds: number) => {
    setAudioCurrentTime(seconds);
    if (audioRef.current) {
      audioRef.current.currentTime = seconds;
    }
  };

  const handleSkipTrack = (direction: 'forward' | 'backward') => {
    if (!currentAudioTrack || audioTracks.length === 0) return;
    const currentIndex = audioTracks.findIndex(t => t.id === currentAudioTrack.id);
    if (currentIndex === -1) return;
    const nextIndex = direction === 'forward' 
      ? (currentIndex + 1) % audioTracks.length 
      : (currentIndex - 1 + audioTracks.length) % audioTracks.length;
    handlePlayTrack(audioTracks[nextIndex]);
  };

  const handleChangePlaybackRate = (rate: number) => {
    setAudioPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  const handleChangeVolume = (vol: number) => {
    setAudioVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };

  const handleCloseAudioPlayer = () => {
    handlePauseTrack();
    setCurrentAudioTrack(null);
  };

  // Voice Notes
  const handleAddVoiceNote = (note: VoiceNoteReflection) => {
    setVoiceNotes(prev => [note, ...prev]);
  };

  const handleLikeVoiceNote = (id: string) => {
    setVoiceNotes(prev => prev.map(vn => vn.id === id ? { ...vn, likes: vn.likes + 1 } : vn));
  };

  // Live Fireside Stage Handlers
  const handleJoinFireside = (role: 'speaker' | 'listener') => {
    const newParticipant = {
      id: `user-${Date.now()}`,
      name: userName,
      role: simulatedRole === 'admin' ? 'host' as const : role,
      avatar: '/Copper_Mommies_w_NoBG4.png',
      isMuted: role === 'listener',
      isHandRaised: false,
      stateCode: selectedState
    };

    setFiresideRoom(prev => {
      const speakers = role === 'speaker' || simulatedRole === 'admin' 
        ? [...prev.speakers, newParticipant] 
        : prev.speakers;
      const listeners = role === 'listener' && simulatedRole !== 'admin'
        ? [...prev.listeners, newParticipant] 
        : prev.listeners;
      return {
        ...prev,
        speakers,
        listeners,
        totalListeners: prev.totalListeners + 1
      };
    });
  };

  const handleLeaveFireside = () => {
    setFiresideRoom(prev => ({
      ...prev,
      speakers: prev.speakers.filter(s => s.name !== userName),
      listeners: prev.listeners.filter(l => l.name !== userName),
      totalListeners: Math.max(1, prev.totalListeners - 1)
    }));
  };

  const handleRaiseHand = () => {
    setFiresideRoom(prev => ({
      ...prev,
      listeners: prev.listeners.map(l => l.name === userName ? { ...l, isHandRaised: !l.isHandRaised } : l)
    }));
  };

  const handleToggleFiresideMute = () => {
    setFiresideRoom(prev => ({
      ...prev,
      speakers: prev.speakers.map(s => s.name === userName ? { ...s, isMuted: !s.isMuted } : s)
    }));
  };

  // Admin podcast track management
  const handleAddAudioTrack = (track: AudioTrack) => {
    setAudioTracks(prev => [track, ...prev]);
  };

  const handleUpdateAudioTrack = (track: AudioTrack) => {
    setAudioTracks(prev => prev.map(t => t.id === track.id ? track : t));
    if (currentAudioTrack?.id === track.id) {
      setCurrentAudioTrack(track);
    }
  };

  const handleDeleteAudioTrack = (id: string) => {
    setAudioTracks(prev => prev.filter(t => t.id !== id));
    if (currentAudioTrack?.id === id) {
      handleCloseAudioPlayer();
    }
  };

  // Helper to fetch banner for page
  const getBannerForPage = (pageId: string): PageSpotlightBanner | undefined => {
    return spotlightBanners.find(b => b.pageId === pageId && b.active);
  };

  // Helper to fetch all active banners for a page (or universal 'all' page banners)
  const getBannersForPage = (pageId: string): PageSpotlightBanner[] => {
    return spotlightBanners.filter(b => (b.pageId === pageId || b.pageId === 'all') && b.active);
  };

  // E2E Keys Simulation display
  const userPrivKey = '7b92f4c1e0284dfa66bc';
  const serverPubKey = '5d40ee73a11942fc0ba4';
  const sharedSovereignSecret = 'SHA256:7B:9A:C2:5E...COPPER-SECURE-KEY';

  const fetchUserStats = async () => {
    try {
      const res = await fetch(`/api/user/stats?userName=${encodeURIComponent(userName)}`);
      if (res.ok) {
        const data = await res.json();
        setGenerosityScore(data.generosityScore);
        setTradeBalance(data.tradeBalance);
      }
    } catch (e) {
      console.error('Error fetching user stats:', e);
    }
  };

  // Load compliance details and lists when selectedState changes
  useEffect(() => {
    fetchCompliance();
    fetchBarters();
    fetchEvents();
    fetchMessages();
    fetchUserStats();
  }, [selectedState, userName]);

  // Loading indicator words for Ancestral Wisdom AI Advisor
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (aiLoading) {
      timer = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % 4);
      }, 3500);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(timer);
  }, [aiLoading]);

  // Handle Right Slide-Out Profile Drawer keyboard escape and scroll lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showSisterProfileMenu) {
        setShowSisterProfileMenu(false);
      }
    };
    if (showSisterProfileMenu) {
      document.addEventListener('keydown', handleKeyDown);
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [showSisterProfileMenu]);

  const fetchCompliance = async () => {
    try {
      const res = await fetch(`/api/compliance/status?state=${selectedState}`);
      if (res.ok) {
        const data = await res.json();
        setComplianceNotice(data);
      }
    } catch (e) {
      console.error('Error fetching compliance:', e);
    }
  };

  const fetchBarters = async () => {
    try {
      const res = await fetch(`/api/barter?state=${selectedState}`);
      if (res.ok) {
        const data = await res.json();
        setBarterList(data);
      }
    } catch (e) {
      console.error('Error fetching barters:', e);
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await fetch(`/api/events?state=${selectedState}`);
      if (res.ok) {
        const data = await res.json();
        setEventsList(data);
      }
    } catch (e) {
      console.error('Error fetching events:', e);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/messages?state=${selectedState}`);
      if (res.ok) {
        const data = await res.json();
        setChatMessages(data);
      }
    } catch (e) {
      console.error('Error fetching messages:', e);
    }
  };

  // Submit new application / sifting handler
  const handleRegisterApplication = (appData: Applicant | null) => {
    if (!appData) {
      setCurrentApplication(null);
      return;
    }

    setApplicants(prev => [appData, ...prev.filter(a => a.id !== appData.id)]);
    setCurrentApplication(appData);

    if (appData.status === 'approved') {
      setSimulatedRole('approved');
      setUserName(appData.name);
      if (appData.currentLocation) {
        const stateParts = appData.currentLocation.split(',');
        const stateCodeCandidate = stateParts[stateParts.length - 1]?.trim().toUpperCase();
        if (stateCodeCandidate && stateCodeCandidate.length === 2) {
          setSelectedState(stateCodeCandidate);
        }
      }
    }
  };

  // Elder approves applicant
  const handleApproveApplicant = (id: string) => {
    setApplicants(prev => prev.map(a => a.id === id ? { ...a, status: 'approved' } : a));
    if (currentApplication && currentApplication.id === id) {
      setCurrentApplication(prev => prev ? { ...prev, status: 'approved' } : null);
      setSimulatedRole('approved');
    }
    alert("Sister approved and trusteeship granted. The regional state boards are now open!");
  };

  // Elder approves and elevates applicant to State Spearhead
  const handleApproveSpearhead = (id: string) => {
    setApplicants(prev => prev.map(a => a.id === id ? { ...a, status: 'approved', isStateSpearhead: true } : a));
    if (currentApplication && currentApplication.id === id) {
      setCurrentApplication(prev => prev ? { ...prev, status: 'approved', isStateSpearhead: true } : null);
      setSimulatedRole('approved');
    }
    alert("Sister welcomed and entrusted as Circle Steward! She is authorized to guide regional Gathering Space circles and local land-banking.");
  };

  // Elder denies applicant
  const handleDenyApplicant = (id: string) => {
    setApplicants(prev => prev.map(a => a.id === id ? { ...a, status: 'denied' } : a));
    if (currentApplication && currentApplication.id === id) {
      setCurrentApplication(prev => prev ? { ...prev, status: 'denied' } : null);
    }
    alert("Application marked for traditional county verification review.");
  };

  // Post Barter via Marketplace Hub
  const handleCreateBarter = async (title: string, desc: string, category: 'Service Exchange' | 'Item Swap' | 'Copper Trade' | 'Copper Gift', tradeFor: string, isLandSteward?: boolean) => {
    try {
      const res = await fetch('/api/barter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description: desc,
          category,
          offerBy: userName,
          contact: `${userName.toLowerCase().replace(' ', '.')}@coop.net`,
          locationState: selectedState,
          tradeFor,
          isLandSteward: !!isLandSteward
        })
      });

      if (res.ok) {
        const newOffer = await res.json();
        setBarterList((prev) => [newOffer, ...prev]);
        fetchUserStats();
        alert(category === 'Copper Gift' ? "Generous Gift published on regional board! +5 Generosity Score added." : "Trade published on regional board!");
      }
    } catch (e) {
      console.error('Error posting barter:', e);
    }
  };

  // Encrypted Chat Message sending
  const handleSendMessage = async () => {
    if (!newMessageText.trim()) return;

    setIsSendingMessage(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: newMessageText,
          senderName: userName,
          stateCode: selectedState
        })
      });

      if (res.ok) {
        const msg = await res.json();
        setChatMessages((prev) => [...prev, msg]);
        setNewMessageText('');
      }
    } catch (e) {
      console.error('Error sending message:', e);
    } finally {
      setIsSendingMessage(false);
    }
  };

  // Gemini Syllabus / Botanical Advisory Council Consult
  const handleConsultAdvisor = async (prompt: string, category: 'village' | 'healing' | 'economy' | 'gathering') => {
    setAiLoading(true);
    setAiResponse(null);
    try {
      const res = await fetch('/api/gemini/wisdom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt,
          category: category,
          stateCode: selectedState
        })
      });

      if (res.ok) {
        const data = await res.json();
        setAiResponse(data.result);
      } else {
        setAiResponse("The Council's signal is temporarily clouded. Let us reflect and seek advice again in a short moment, Sister.");
      }
    } catch (e) {
      setAiResponse("The Council's signal is temporarily clouded. Let us reflect and seek advice again in a short moment, Sister.");
    } finally {
      setAiLoading(false);
    }
  };

  // Dynamic ledger transaction logs
  const handleAddLedgerLog = (activity: string, hours: number, type: 'earn' | 'spend') => {
    const multiplier = type === 'earn' ? 1 : -1;
    const finalHours = hours * multiplier;

    const newLog: TimeCreditLog = {
      id: `log-${Date.now()}`,
      activity,
      hours: hours,
      date: 'Today',
      type
    };

    setTimeLogs((prev) => [newLog, ...prev]);
    setTimeBalance((prev) => parseFloat((prev + finalHours).toFixed(2)));
  };

  const handleAddEarnHours = (activity: string, hours: number) => {
    handleAddLedgerLog(activity, Math.abs(hours), hours >= 0 ? 'earn' : 'spend');
  };

  const handleDeleteLedgerLog = (id: string) => {
    const target = timeLogs.find(l => l.id === id);
    if (target) {
      const multiplier = target.type === 'earn' ? -1 : 1;
      const reverseHours = target.hours * multiplier;
      setTimeBalance(prev => parseFloat((prev + reverseHours).toFixed(2)));
    }
    setTimeLogs(timeLogs.filter(l => l.id !== id));
  };

  const getLoadingNote = () => {
    const notes = [
      "Brewing organic herbal tea while our sisters gather...",
      "Looking up community guides and resources...",
      "Connecting with community wisdom and care tips...",
      "Gathering the shared wisdom of sister mothers across all states..."
    ];
    return notes[loadingStep];
  };

  return (
    <div 
      id="app-root" 
      className={`min-h-screen ${activeHearth.bgClass} font-sans text-charcoal-ancestral flex flex-col antialiased relative overflow-hidden transition-colors duration-500`}
      style={{ background: activeHearth.meshStyle }}
    >
      
      {/* Cinematic Ambient Accent Orbs with Sanctuary Lighting */}
      <div className={`absolute top-0 left-1/4 w-[450px] h-[450px] ${activeHearth.orb1Class} rounded-full blur-[120px] pointer-events-none transition-all duration-700`} />
      <div className={`absolute bottom-1/4 right-1/4 w-[550px] h-[550px] ${activeHearth.orb2Class} rounded-full blur-[150px] pointer-events-none transition-all duration-700`} />

      {/* Global Community Broadcast Bulletin Push Bar — VISIBLE TO LOGGED-IN MEMBERS ONLY */}
      {simulatedRole !== 'applicant' && (
        <BroadcastPushBar
          bulletins={bulletins}
          isAdmin={simulatedRole === 'admin' || simulatedRole === 'representative'}
          onOpenAdminManager={() => {
            setSimulatedRole('admin');
            setActiveTab('admin');
          }}
          onActionClick={(url) => {
            if (!url) return;
            const lower = url.toLowerCase();
            
            if (lower.includes('hearth-polls') || lower.includes('poll')) {
              setActiveTab('gathering');
              setTimeout(() => {
                const el = document.getElementById('hearth-polls-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 150);
            } else if (lower === '#commons' || lower.includes('commons') || lower.includes('exchange') || lower.includes('housing') || lower.includes('free')) {
              setActiveTab('commons');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else if (lower === '#village' || lower.includes('village') || lower.includes('care-pod') || lower.includes('meal')) {
              setActiveTab('village');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else if (lower === '#healing' || lower.includes('healing') || lower.includes('apothecary')) {
              setActiveTab('healing');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else if (lower === '#economy' || lower.includes('economy') || lower.includes('barter')) {
              setActiveTab('economy');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else if (lower === '#commerce' || lower.includes('commerce') || lower.includes('marketplace')) {
              setActiveTab('commerce');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else if (lower === '#gathering' || lower.includes('gathering') || lower.includes('casual-corner')) {
              setActiveTab('gathering');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else if (lower === '#kinship' || lower.includes('kinship') || lower.includes('vault') || lower.includes('nestbright') || lower.includes('seed')) {
              setActiveTab('kinship');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else if (lower === '#audio' || lower.includes('audio') || lower.includes('radio') || lower.includes('podcast')) {
              setActiveTab('audio');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else if (lower === '#treasury' || lower.includes('treasury')) {
              setActiveTab('treasury');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else if (lower === '#vetting' || lower.includes('vetting') || lower.includes('join') || lower.includes('community')) {
              setActiveTab('vetting');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else if (lower === '#admin' || lower.includes('admin')) {
              setActiveTab('admin');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else if (url.startsWith('#')) {
              const el = document.querySelector(url);
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            } else if (url.startsWith('http://') || url.startsWith('https://')) {
              window.open(url, '_blank', 'noopener,noreferrer');
            }
          }}
        />
      )}

      {/* 1. Streamlined Master Header (Consolidated Branding, State Hub & Sister Profile/Admin) */}
      <header id="app-header" className="sticky top-0 z-40 bg-white/95 backdrop-blur-md text-charcoal-ancestral border-b border-copper-penny/15 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 sm:h-20">
            
            {/* Logo and Brand Name */}
            <div 
              id="logo-container"
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => setActiveTab('landing')}
            >
              <div className="relative w-11 h-11 sm:w-12 sm:h-12 bg-transparent flex items-center justify-center text-copper-penny group-hover:scale-105 duration-300 transition-all shrink-0">
                <img 
                  src="/Copper_Mommies_w_NoBG4.png" 
                  alt="Copper Mommies Co. Logo" 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h1 className="font-serif font-bold text-lg sm:text-2xl tracking-tight text-[#1F1813] group-hover:text-copper-penny transition-colors leading-tight">
                  Copper Mommies <span className="text-[#D4AF37]">Co.</span>
                </h1>
                <p className="text-[8px] sm:text-[9px] font-mono text-soft-sage uppercase tracking-widest font-extrabold leading-tight">American Motherhood Cooperative</p>
              </div>
            </div>

            {/* Streamlined Utility Controls */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              
              {/* Sanctuary Atmosphere Toggle */}
              <HearthMoodToggle currentMood={hearthMood} onSelectMood={handleSelectHearthMood} />

              {/* State Circle Selector */}
              <div className="relative hidden xs:flex items-center space-x-1.5 bg-[#FAF5EE] border border-copper-penny/25 px-2.5 sm:px-3 py-1.5 rounded-xl">
                <MapPin className="w-3.5 h-3.5 text-[#B87333]" />
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="bg-transparent border-none text-xs font-bold text-[#1F1813] font-mono focus:outline-none cursor-pointer"
                  title="Select regional state circle"
                >
                  {POPULAR_STATES.map((st) => (
                    <option key={st.code} value={st.code} className="text-[#1F1813]">
                      {st.code} circle
                    </option>
                  ))}
                </select>
              </div>

              {/* Audio Sanctuary Mini Live Player (Logged-in members) */}
              {simulatedRole !== 'applicant' && (
                <button
                  onClick={() => setActiveTab('audio')}
                  className={`text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded-xl flex items-center space-x-1.5 transition-all cursor-pointer shadow-2xs active:scale-95 border ${
                    activeTab === 'audio'
                      ? 'bg-[#D4AF37] text-[#1F140E] border-[#D4AF37]'
                      : isAudioPlaying
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
                      : 'bg-[#FAF5EE] text-[#1F1813] border-copper-penny/25 hover:border-copper-penny/50'
                  }`}
                  title="Open Audio Sanctuary & Podcast Radio"
                >
                  <span>{isAudioPlaying ? '📻' : '🎙️'}</span>
                  <span className="hidden lg:inline font-mono">
                    {isAudioPlaying ? 'Radio Live' : 'Audio Lounge'}
                  </span>
                  {isAudioPlaying && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  )}
                </button>
              )}

              {/* Support Co-op Button */}
              <button
                onClick={() => setShowGlobalSupportModal(true)}
                className="hidden sm:flex bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 text-[#1F1813] border border-[#D4AF37]/60 text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded-xl items-center space-x-1 transition-all cursor-pointer shadow-2xs active:scale-95"
              >
                <span>💝 Support</span>
              </button>

              {/* CONSOLIDATED SISTER PROFILE / MEMBER LOGIN & PERSPECTIVE MENU */}
              {simulatedRole === 'applicant' ? (
                /* When not logged in: Member Login button */
                <div className="flex items-center space-x-1.5">
                  <button
                    id="header-member-login-btn"
                    onClick={() => setShowMemberLoginModal(true)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-2xl bg-[#D4AF37] hover:bg-[#C5A02E] text-[#1F140E] font-bold text-xs font-mono uppercase tracking-wider shadow-xs transition-all cursor-pointer active:scale-95 border border-[#D4AF37]"
                    title="Member Login & Profile Access"
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span>Member Login</span>
                  </button>
                </div>
              ) : (
                /* When logged in: Profile Picture in small circle + My Profile */
                <div className="relative">
                  <button
                    id="sister-perspective-toggle-btn"
                    onClick={() => setShowSisterProfileMenu(prev => !prev)}
                    className={`flex items-center space-x-2 px-2.5 sm:px-3 py-1.5 rounded-2xl border transition-all cursor-pointer shadow-xs active:scale-95 ${
                      activeTab === 'profile'
                        ? 'bg-[#D4AF37] text-[#1F140E] border-[#D4AF37] ring-1 ring-[#D4AF37]/50'
                        : 'bg-[#FAF5EE] hover:bg-[#F3EADF] text-[#1F1813] border-copper-penny/30'
                    }`}
                    title="My Sister Profile & Account Menu"
                  >
                    {/* Small circle profile picture */}
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden border-2 border-[#D4AF37] ring-1 ring-[#D4AF37]/30 shrink-0 shadow-xs relative bg-[#FAF5EE]">
                      <img 
                        src="/coppermommies-selflove1-cmc.jpg" 
                        alt={userName} 
                        className="w-full h-full object-cover" 
                      />
                      <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-white" />
                    </div>

                    <div className="text-left hidden md:block">
                      <span className="text-xs font-bold text-[#1F1813] block leading-tight">
                        {simulatedRole === 'admin' ? 'Mama Shantrece' : userName}
                      </span>
                      <span className="text-[9px] font-mono uppercase tracking-wider font-extrabold text-soft-sage block leading-tight">
                        👤 My Profile • {selectedState}
                      </span>
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 text-copper-penny transition-transform ${showSisterProfileMenu ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              )}

            </div>

          </div>
        </div>

        {/* 2. Streamlined Primary Navigation Pillars */}
        <div className="border-t border-copper-penny/10 bg-[#140F0B]/95 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center space-x-1 py-2.5 overflow-x-auto scrollbar-none">
              
              {/* Pillar 1: Home */}
              <button 
                onClick={() => setActiveTab('landing')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 font-mono uppercase tracking-wider shrink-0 ${
                  activeTab === 'landing' 
                    ? 'bg-[#D4AF37]/25 text-[#D4AF37] border border-[#D4AF37]/40 shadow-sm' 
                    : 'text-[#D4AF37]/80 hover:bg-white/10 hover:text-[#D4AF37]'
                }`}
                title="Home & Community Announcements"
              >
                <span>🌍 Home</span>
              </button>

              {/* For Seeking Sisters (Applicants): Join Our Community */}
              {simulatedRole === 'applicant' && (
                <button 
                  onClick={() => setActiveTab('vetting')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 font-mono uppercase tracking-wider shrink-0 ${
                    activeTab === 'vetting' 
                      ? 'bg-red-700/30 text-[#D4AF37] border border-red-500/50 shadow-sm' 
                      : 'text-[#D4AF37]/80 bg-red-950/40 hover:bg-red-900/40 hover:text-[#D4AF37]'
                  }`}
                  title="Begin Sisterhood Vetting Process"
                >
                  <span>🔒 Join Our Community</span>
                </button>
              )}

              {/* Pillars for Verified Members */}
              {simulatedRole !== 'applicant' && (
                <>
                  {/* Pillar 1: Village Commons (1st Community Hub) */}
                  <button 
                    id="nav-tab-commons"
                    onClick={() => setActiveTab('commons')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 font-mono uppercase tracking-wider shrink-0 ${
                      activeTab === 'commons' 
                        ? 'bg-[#D4AF37]/25 text-[#D4AF37] border border-[#D4AF37]/40 shadow-sm font-black' 
                        : 'text-[#D4AF37]/80 hover:bg-white/10 hover:text-[#D4AF37]'
                    }`}
                    title="The Village Commons — Free Gifting, Barter Trades, Housing & Sister Businesses"
                  >
                    <span>🏡 Commons</span>
                  </button>

                  {/* Pillar 2: Mothers Academy & Her-Story Sanctuary (Skool Adult Learning Hub) */}
                  <button 
                    id="nav-tab-academy"
                    onClick={() => setActiveTab('academy')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 font-mono uppercase tracking-wider shrink-0 ${
                      activeTab === 'academy' 
                        ? 'bg-[#D4AF37]/25 text-[#D4AF37] border border-[#D4AF37]/40 shadow-sm font-black' 
                        : 'text-[#D4AF37]/80 hover:bg-white/10 hover:text-[#D4AF37]'
                    }`}
                    title="Mothers Academy — Skool Adult Masterclasses, True Lineage & Her-Story Sanctuary"
                  >
                    <span>🎓 Mothers Academy</span>
                  </button>

                  {/* Pillar 3: Cooperative Economy */}
                  <button 
                    id="nav-tab-economy-pillar"
                    onClick={() => {
                      if (activeTab !== 'economy' && activeTab !== 'commerce') {
                        setActiveTab('economy');
                      }
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 font-mono uppercase tracking-wider shrink-0 ${
                      activeTab === 'economy' || activeTab === 'commerce'
                        ? 'bg-[#D4AF37]/25 text-[#D4AF37] border border-[#D4AF37]/40 shadow-sm' 
                        : 'text-[#D4AF37]/80 hover:bg-white/10 hover:text-[#D4AF37]'
                    }`}
                    title="Cooperative Economy — Time Banking, Barter Trades & Enterprise Classifieds"
                  >
                    <span>🤝 Economy</span>
                  </button>

                  {/* Pillar 4: Earth & Healing */}
                  <button 
                    onClick={() => setActiveTab('healing')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 font-mono uppercase tracking-wider shrink-0 ${
                      activeTab === 'healing' 
                        ? 'bg-[#D4AF37]/25 text-[#D4AF37] border border-[#D4AF37]/40 shadow-sm' 
                        : 'text-[#D4AF37]/80 hover:bg-white/10 hover:text-[#D4AF37]'
                    }`}
                    title="Earth & Healing Herbal Apothecary & Botanical Dispensary"
                  >
                    <span>🌿 Apothecary</span>
                  </button>

                  {/* Pillar 5: Circle & Audio Sanctuary */}
                  <button 
                    id="nav-tab-circle-pillar"
                    onClick={() => {
                      if (activeTab !== 'gathering' && activeTab !== 'audio') {
                        setActiveTab('gathering');
                      }
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 font-mono uppercase tracking-wider shrink-0 ${
                      activeTab === 'gathering' || activeTab === 'audio'
                        ? 'bg-[#D4AF37]/25 text-[#D4AF37] border border-[#D4AF37]/40 shadow-sm' 
                        : 'text-[#D4AF37]/80 hover:bg-white/10 hover:text-[#D4AF37]'
                    }`}
                    title="The Copper Circle & Audio Community Lounge"
                  >
                    <span>🎙️ Sanctuary Audio</span>
                    {isAudioPlaying && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping ml-1" />
                    )}
                  </button>

                  {/* Pillar 6: Kinship, Homeschool & Treasury */}
                  <button 
                    id="nav-tab-kinship-pillar"
                    onClick={() => {
                      if (activeTab !== 'kinship' && activeTab !== 'treasury') {
                        setActiveTab('kinship');
                      }
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 font-mono uppercase tracking-wider shrink-0 ${
                      activeTab === 'kinship' || activeTab === 'treasury'
                        ? 'bg-[#D4AF37]/25 text-[#D4AF37] border border-[#D4AF37]/40 shadow-sm' 
                        : 'text-[#D4AF37]/80 hover:bg-white/10 hover:text-[#D4AF37]'
                    }`}
                    title="Kinship Vault, Homeschooling Co-Op & Private Treasury"
                  >
                    <span>🗝️ Kinship &amp; Homeschool</span>
                  </button>
                </>
              )}

              {/* Sponsor / Business Ads Portal */}
              <button
                id="nav-tab-advertise"
                onClick={() => {
                  setActiveTab('advertise');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 font-mono uppercase tracking-wider shrink-0 ${
                  activeTab === 'advertise'
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#B87333] text-[#1F140E] shadow-md ring-2 ring-[#D4AF37]/50 font-black'
                    : 'text-[#D4AF37] hover:bg-white/10 hover:text-white border border-[#D4AF37]/30 bg-black/20'
                }`}
                title="Melanated Woman-Owned Business Advertising & Sponsorship Portal"
              >
                <span>✨ Sponsor Ads</span>
              </button>

              {/* Admin Back Office Direct Tab */}
              {simulatedRole === 'admin' ? (
                <button 
                  id="nav-tab-admin-active"
                  onClick={() => setActiveTab('admin')}
                  className={`ml-auto px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 font-mono uppercase tracking-wider shrink-0 ${
                    activeTab === 'admin' 
                      ? 'bg-[#D4AF37] text-[#1F140E] shadow-md ring-2 ring-[#D4AF37]/50 font-black' 
                      : 'text-[#D4AF37] bg-emerald-950/70 hover:bg-emerald-900/80 border border-emerald-500/40'
                  }`}
                  title="Circle Lead & Founder Admin Office"
                >
                  <span>👵 Admin Office</span>
                </button>
              ) : (
                <button 
                  id="nav-tab-admin-login"
                  onClick={() => setShowAdminLoginModal(true)}
                  className="ml-auto px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 font-mono uppercase tracking-wider text-[#D4AF37] bg-black/40 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/40 hover:border-[#D4AF37] shrink-0"
                  title="Founder & Circle Lead Administration Login"
                >
                  <span>🔒 Admin Login</span>
                </button>
              )}

            </nav>
          </div>

          {/* 3. Contextual Sub-Navigation Strip */}
          {(activeTab === 'economy' || activeTab === 'commerce') && (
            <div className="bg-[#1C140E] border-t border-[#B87333]/30 px-4 py-2 flex items-center justify-center space-x-2 text-xs font-mono animate-fade-in">
              <span className="text-[#D4AF37]/70 text-[10px] uppercase font-bold mr-2 hidden sm:inline">Economy Hubs:</span>
              <button 
                onClick={() => setActiveTab('economy')} 
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer font-bold ${
                  activeTab === 'economy' 
                    ? 'bg-[#D4AF37] text-[#1F140E] shadow-sm' 
                    : 'text-[#FAF5EE]/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                🤝 Time Banking &amp; Barter Trades ({timeBalance}h Balance)
              </button>
              <button 
                onClick={() => setActiveTab('commerce')} 
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer font-bold ${
                  activeTab === 'commerce' 
                    ? 'bg-[#D4AF37] text-[#1F140E] shadow-sm' 
                    : 'text-[#FAF5EE]/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                🏛️ Enterprise Classifieds &amp; Vendor Hub
              </button>
            </div>
          )}

          {(activeTab === 'gathering' || activeTab === 'audio') && (
            <div className="bg-[#1C140E] border-t border-[#B87333]/30 px-4 py-2 flex items-center justify-center space-x-2 text-xs font-mono animate-fade-in">
              <span className="text-[#D4AF37]/70 text-[10px] uppercase font-bold mr-2 hidden sm:inline">Circle Hubs:</span>
              <button 
                onClick={() => setActiveTab('gathering')} 
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer font-bold ${
                  activeTab === 'gathering' 
                    ? 'bg-[#D4AF37] text-[#1F140E] shadow-sm' 
                    : 'text-[#FAF5EE]/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                ✨ The Copper Circle (Casual Corner &amp; Council Polls)
              </button>
              <button 
                onClick={() => setActiveTab('audio')} 
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer font-bold flex items-center space-x-1 ${
                  activeTab === 'audio' 
                    ? 'bg-[#D4AF37] text-[#1F140E] shadow-sm' 
                    : 'text-[#FAF5EE]/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span>🎙️ Audio Lounge &amp; Community Radio</span>
                {isAudioPlaying && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" />}
              </button>
            </div>
          )}

          {(activeTab === 'kinship' || activeTab === 'treasury') && (
            <div className="bg-[#1C140E] border-t border-[#B87333]/30 px-4 py-2 flex items-center justify-center space-x-2 text-xs font-mono animate-fade-in">
              <span className="text-[#D4AF37]/70 text-[10px] uppercase font-bold mr-2 hidden sm:inline">Wisdom &amp; Trust:</span>
              <button 
                onClick={() => setActiveTab('kinship')} 
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer font-bold ${
                  activeTab === 'kinship' 
                    ? 'bg-[#D4AF37] text-[#1F140E] shadow-sm' 
                    : 'text-[#FAF5EE]/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                🗝️ Kinship Vault &amp; NestBright Academy
              </button>
              <button 
                onClick={() => setActiveTab('treasury')} 
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer font-bold ${
                  activeTab === 'treasury' 
                    ? 'bg-[#D4AF37] text-[#1F140E] shadow-sm' 
                    : 'text-[#FAF5EE]/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                ⚖️ Private 508(c)(1)(a) Treasury &amp; Co-op Funds
              </button>
            </div>
          )}

        </div>
      </header>

      {/* Full-width Hero Banner (Landing Tab Only) - placed immediately below the navigation menu */}
      <AnimatePresence mode="wait">
        {activeTab === 'landing' && (
          <motion.div
            key="hero-banner"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="w-full relative bg-[#1F140E] overflow-hidden border-b-2 border-[#D4AF37]/30 shadow-lg min-h-[680px] sm:min-h-[780px] md:min-h-[840px] flex flex-col justify-end"
          >
            {/* The full-width background image */}
            <div className="absolute inset-0">
              <img 
                src="/Copper mommies family on the beach.png" 
                alt="Copper Mommies Family on the Beach" 
                className="w-full h-full object-cover object-center scale-100 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Subtle, dark-bronze gradient overlay (starting from bottom, fading to transparent toward the top) */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1F140E] via-[#2A1D16]/85 to-transparent z-0" />
            
            {/* Soft dark-bronze vignette overlay to keep focal point of mothers clear while maintaining text readability */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_45%,_rgba(31,20,14,0.8)_100%)] z-0" />

            {/* Soft paper texture overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-900 via-stone-900 to-black mix-blend-overlay z-0" />

            {/* Absolute-positioned Brand Logo to the top-left to keep it anchored on the left */}
            <div className="absolute top-6 left-4 sm:left-6 lg:left-8 z-20 animate-float pointer-events-none">
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center bg-transparent">
                <img 
                  src="/Copper_Mommies_w_NoBG4.png" 
                  alt="Copper Mommies Co. Logo" 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Banner Content (centered container with generous top padding to push content down, keeping the top half clear for the faces) */}
            <div className="relative max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-[320px] sm:pt-[380px] md:pt-[440px] pb-12 sm:pb-16 md:pb-20 flex flex-col items-center justify-center text-center space-y-5 sm:space-y-6 z-10">
              
              {/* Title */}
              <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#FAF5EE] leading-none drop-shadow-lg max-w-3xl mx-auto">
                An Illustrious Cooperative <span className="text-[#D4AF37]">Ecosystem</span>
              </h2>

              {/* Mission Statement (in clean white/gold font) with ultra see-through premium bronze-tinted frosted glass backing */}
              <div className="max-w-2xl mx-auto bg-[#1F140E]/30 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-[#D4AF37]/35 shadow-[0_8px_32px_rgba(31,20,14,0.25)]">
                <p className="text-[#FAF5EE] text-sm sm:text-base md:text-lg leading-relaxed font-sans font-medium">
                  <span className="text-[#D4AF37] font-serif font-bold">Copper Mommies Co.</span> is a cooperative community hub for American melanated mothers born of the original copper-colored Matriarchs of America. We unite to <span className="text-amber-300 font-semibold">Co-care</span>, <span className="text-amber-300 font-semibold">Co-create</span>, and <span className="text-amber-300 font-semibold">Co-thrive</span>, facilitating the exchange of traditional knowledge and resources, nurturing our families to build a sustainable legacy.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 w-full sm:w-auto">
                {simulatedRole === 'applicant' ? (
                  <button 
                    onClick={() => setActiveTab('vetting')}
                    className="w-full sm:w-auto px-8 py-3.5 bg-[#D4AF37] hover:bg-[#C5A02E] text-[#1F1813] text-xs uppercase tracking-widest font-black rounded-xl border-2 border-[#B87333]/50 shadow-[0_4px_16px_rgba(212,175,55,0.35)] hover:shadow-[0_6px_22px_rgba(212,175,55,0.5)] active:scale-95 transition-all duration-300 flex items-center justify-center space-x-2.5 cursor-pointer"
                  >
                    <span>Request Community Invitation</span>
                    <ArrowRight className="w-4 h-4 stroke-[3]" />
                  </button>
                ) : (
                  <button 
                    onClick={() => setActiveTab('village')}
                    className="w-full sm:w-auto px-8 py-3.5 bg-[#D4AF37] hover:bg-[#C5A02E] text-[#1F1813] text-xs uppercase tracking-widest font-black rounded-xl border-2 border-[#B87333]/50 shadow-[0_4px_16px_rgba(212,175,55,0.35)] hover:shadow-[0_6px_22px_rgba(212,175,55,0.5)] active:scale-95 transition-all duration-300 flex items-center justify-center space-x-2.5 cursor-pointer"
                  >
                    <span>Enter Regional Board ({selectedState})</span>
                    <ArrowRight className="w-4 h-4 stroke-[3]" />
                  </button>
                )}
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Main Work Area Container */}
      <main id="app-main" className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4">
        <AnimatePresence mode="wait">
          
          {/* A. LANDING VIEW */}
          {activeTab === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >

              {/* Featured Community Spotlights & Partner Initiatives Carousel - Visible to Logged-in Members Only */}
              {simulatedRole !== 'applicant' && (
                <SpotlightBanner 
                  banners={spotlightBanners.filter(b => b.active)}
                  userName={userName}
                  selectedState={selectedState}
                  onAddScholarshipEntry={handleAddScholarshipEntry}
                  entriesCount={scholarshipEntries.length}
                  isAdmin={simulatedRole === 'admin'}
                  onOpenAdminManager={() => setActiveTab('admin')}
                  autoScrollIntervalMs={5000}
                  sectionTitle="Village Grand Spotlight & Announcements"
                />
              )}

              {/* Cooperative Philosophy Core Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-[#FBF7F1] border-2 border-[#1F1813]/5 hover:border-[#B87333]/25 rounded-2xl p-5 space-y-2 shadow-sm hover:shadow-md transition-all">
                  <span className="text-2xl">🤱</span>
                  <h4 className="font-serif font-extrabold text-lg text-[#1F1813]">Lineage Connection</h4>
                  <p className="text-xs text-[#2A221B]/80 leading-relaxed">
                    We keep our circle close and authentic. If your family roots are in this land, you will know the American counties where your grandmothers lived and raised their families.
                  </p>
                </div>

                <div className="bg-[#FBF7F1] border-2 border-[#1F1813]/5 hover:border-[#B87333]/25 rounded-2xl p-5 space-y-2 shadow-sm hover:shadow-md transition-all">
                  <span className="text-2xl">📜</span>
                  <h4 className="font-serif font-extrabold text-lg text-[#1F1813]">Heritage &amp; Traditions</h4>
                  <p className="text-xs text-[#2A221B]/80 leading-relaxed">
                    We focus on the living traditions passed down by our mothers and grandmothers. From quilting patterns to kitchen garden remedies, we keep our home culture thriving.
                  </p>
                </div>

                <div className="bg-[#FBF7F1] border-2 border-[#1F1813]/5 hover:border-[#B87333]/25 rounded-2xl p-5 space-y-2 shadow-sm hover:shadow-md transition-all">
                  <span className="text-2xl">🪙</span>
                  <h4 className="font-serif font-extrabold text-lg text-[#1F1813]">Community Time Exchange</h4>
                  <p className="text-xs text-[#2A221B]/80 leading-relaxed">
                    Support each other directly. Every mother can share her skills (tutoring, childcare swaps, garden seeds) and easily log her hours in our time exchange.
                  </p>
                </div>
              </div>

              {/* Explore Our Community Hubs Grid */}
              <div id="districts-grid" className="bg-[#FAF5EE]/80 border border-copper-penny/20 rounded-3xl p-5 sm:p-7 shadow-md space-y-6 scroll-mt-24">
                <div className="text-center space-y-1.5 max-w-2xl mx-auto">
                  <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#1F1813]">
                    Explore Our Community Hubs
                  </h2>
                  <p className="text-xs font-mono text-[#B87333] uppercase tracking-wider font-extrabold">
                    Hubs of Connection, Support &amp; Sisterhood
                  </p>
                  <p className="text-xs text-[#2A221B]/75">
                    {simulatedRole === 'applicant'
                      ? 'Browse our community hubs below. Select any hub card to begin your membership application.'
                      : 'Select any hub below to enter its live marketplace, discussion boards, or village tools.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  {/* Card 1: Village Commons Hub (1ST CARD MANDATE) */}
                  <div 
                    onClick={() => {
                      if (simulatedRole === 'applicant') {
                        setActiveTab('vetting');
                      } else {
                        setActiveTab('commons');
                      }
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="group bg-gradient-to-br from-white to-[#FAF5EE] border-2 border-[#D4AF37]/50 hover:border-[#D4AF37] rounded-2xl p-5 sm:p-6 cursor-pointer hover:shadow-xl transition-all duration-300 relative overflow-hidden space-y-2.5 sm:col-span-2 lg:col-span-3"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500" />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2.5 text-[#1F1813]">
                        <Globe className="w-5.5 h-5.5 text-[#D4AF37] group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-mono uppercase tracking-widest font-extrabold text-[#B87333]">District 1 • Premier Village Hub</span>
                      </div>
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#1F1813] border border-[#D4AF37]/35">
                        Active Sisterhood Commons
                      </span>
                    </div>
                    <h3 className="font-serif font-extrabold text-xl text-[#1F1813] group-hover:text-copper-penny transition-colors">
                      The Village Commons
                    </h3>
                    <p className="text-xs text-[#2A221B]/85 leading-relaxed">
                      Our main community bulletin and exchange center. Browse direct sisterhood housing listings, free item giveaways, local trade requests, vetted micro-gigs, and open village discussions.
                    </p>
                    <div className="flex items-center space-x-2 text-xs font-mono font-bold text-[#B87333] pt-1">
                      <span>{simulatedRole === 'applicant' ? 'Apply for Membership to Enter' : 'Enter Village Commons'}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Card 2: The Education & Village Hub */}
                  <div 
                    onClick={() => {
                      if (simulatedRole === 'applicant') {
                        setActiveTab('vetting');
                      } else {
                        setActiveTab('village');
                      }
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="group bg-white border border-copper-penny/20 hover:border-copper-penny/50 rounded-2xl p-5 sm:p-6 cursor-pointer hover:shadow-lg transition-all duration-300 relative overflow-hidden space-y-2.5"
                  >
                    <div className="absolute top-0 right-0 w-20 h-20 bg-[#B87333]/5 rounded-full blur-xl group-hover:scale-110 transition-transform duration-300" />
                    <div className="flex items-center space-x-2.5 text-[#A85138]">
                      <BookOpen className="w-5.5 h-5.5 text-[#A85138] group-hover:scale-105 transition-transform" />
                      <span className="text-[10px] font-mono uppercase tracking-widest font-bold">District 2</span>
                    </div>
                    <h3 className="font-serif font-extrabold text-lg text-[#1F1813] group-hover:text-copper-penny transition-colors">
                      The Education &amp; Village Hub
                    </h3>
                    <p className="text-xs text-[#2A221B]/85 leading-relaxed">
                      Coordinate homeschooling schedules, swap childcare roles, download family learning guides, access NestBright Academy, and share parenting advice.
                    </p>
                    <div className="flex items-center space-x-1.5 text-[11px] font-mono font-bold text-[#A85138] pt-1">
                      <span>{simulatedRole === 'applicant' ? 'Join to Access' : 'Explore Education Hub'}</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Card 3: The Earth & Healing Hub */}
                  <div 
                    onClick={() => {
                      if (simulatedRole === 'applicant') {
                        setActiveTab('vetting');
                      } else {
                        setActiveTab('healing');
                      }
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="group bg-white border border-copper-penny/20 hover:border-copper-penny/50 rounded-2xl p-5 sm:p-6 cursor-pointer hover:shadow-lg transition-all duration-300 relative overflow-hidden space-y-2.5"
                  >
                    <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl group-hover:scale-110 transition-transform duration-300" />
                    <div className="flex items-center space-x-2.5 text-emerald-800">
                      <Sprout className="w-5.5 h-5.5 text-emerald-700 group-hover:scale-105 transition-transform" />
                      <span className="text-[10px] font-mono uppercase tracking-widest font-bold">District 3</span>
                    </div>
                    <h3 className="font-serif font-extrabold text-lg text-[#1F1813] group-hover:text-copper-penny transition-colors">
                      The Earth &amp; Healing Hub
                    </h3>
                    <p className="text-xs text-[#2A221B]/85 leading-relaxed">
                      Exchange organic seeds, share herbal tea recipes, order custom apothecary remedies, and consult with maternal wellness advisors.
                    </p>
                    <div className="flex items-center space-x-1.5 text-[11px] font-mono font-bold text-emerald-800 pt-1">
                      <span>{simulatedRole === 'applicant' ? 'Join to Access' : 'Explore Healing Hub'}</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Card 4: Cooperative Economy & Barter Board */}
                  <div 
                    onClick={() => {
                      if (simulatedRole === 'applicant') {
                        setActiveTab('vetting');
                      } else {
                        setActiveTab('economy');
                      }
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="group bg-white border border-copper-penny/20 hover:border-copper-penny/50 rounded-2xl p-5 sm:p-6 cursor-pointer hover:shadow-lg transition-all duration-300 relative overflow-hidden space-y-2.5"
                  >
                    <div className="absolute top-0 right-0 w-20 h-20 bg-[#B87333]/5 rounded-full blur-xl group-hover:scale-110 transition-transform duration-300" />
                    <div className="flex items-center space-x-2.5 text-copper-penny">
                      <ArrowLeftRight className="w-5.5 h-5.5 text-copper-penny group-hover:scale-105 transition-transform" />
                      <span className="text-[10px] font-mono uppercase tracking-widest font-bold">District 4</span>
                    </div>
                    <h3 className="font-serif font-extrabold text-lg text-[#1F1813] group-hover:text-copper-penny transition-colors">
                      Cooperative Economy &amp; Barter Board
                    </h3>
                    <p className="text-xs text-[#2A221B]/85 leading-relaxed">
                      Post garden produce, trade handmade goods, offer service swaps, and log cooperative hours directly on our community time exchange board.
                    </p>
                    <div className="flex items-center space-x-1.5 text-[11px] font-mono font-bold text-[#B87333] pt-1">
                      <span>{simulatedRole === 'applicant' ? 'Join to Access' : 'Explore Barter Board'}</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Card 5: Enterprise & Commerce Hub */}
                  <div 
                    onClick={() => {
                      if (simulatedRole === 'applicant') {
                        setActiveTab('vetting');
                      } else {
                        setActiveTab('commerce');
                      }
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="group bg-white border border-[#B87333]/30 hover:border-[#B87333]/60 rounded-2xl p-5 sm:p-6 cursor-pointer hover:shadow-lg transition-all duration-300 relative overflow-hidden space-y-2.5"
                  >
                    <div className="absolute top-0 right-0 w-20 h-20 bg-[#D4AF37]/10 rounded-full blur-xl group-hover:scale-110 transition-transform duration-300" />
                    <div className="flex items-center space-x-2.5 text-[#B87333]">
                      <Coins className="w-5.5 h-5.5 text-[#B87333] group-hover:scale-105 transition-transform" />
                      <span className="text-[10px] font-mono uppercase tracking-widest font-bold">District 5</span>
                    </div>
                    <h3 className="font-serif font-extrabold text-lg text-[#1F1813] group-hover:text-copper-penny transition-colors">
                      Enterprise &amp; Commerce Hub
                    </h3>
                    <p className="text-xs text-[#2A221B]/85 leading-relaxed">
                      Browse sister-owned businesses, post and apply for vetted gigs, attend business workshops, and access step-by-step startup templates.
                    </p>
                    <div className="flex items-center space-x-1.5 text-[11px] font-mono font-bold text-[#B87333] pt-1">
                      <span>{simulatedRole === 'applicant' ? 'Join to Access' : 'Explore Commerce Hub'}</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Card 6: Sisterhood Circles & Gatherings */}
                  <div 
                    onClick={() => {
                      if (simulatedRole === 'applicant') {
                        setActiveTab('vetting');
                      } else {
                        setActiveTab('gathering');
                      }
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="group bg-white border border-copper-penny/20 hover:border-copper-penny/50 rounded-2xl p-5 sm:p-6 cursor-pointer hover:shadow-lg transition-all duration-300 relative overflow-hidden space-y-2.5"
                  >
                    <div className="absolute top-0 right-0 w-20 h-20 bg-[#B87333]/5 rounded-full blur-xl group-hover:scale-110 transition-transform duration-300" />
                    <div className="flex items-center space-x-2.5 text-[#D4AF37]">
                      <MessageSquare className="w-5.5 h-5.5 text-[#D4AF37] group-hover:scale-105 transition-transform" />
                      <span className="text-[10px] font-mono uppercase tracking-widest font-bold">District 6</span>
                    </div>
                    <h3 className="font-serif font-extrabold text-lg text-[#1F1813] group-hover:text-copper-penny transition-colors">
                      Sisterhood Circles &amp; Gatherings
                    </h3>
                    <p className="text-xs text-[#2A221B]/85 leading-relaxed">
                      Talk with verified mothers in relaxed group discussions, organize local meetups, attend live circle sessions, and view regional state guides.
                    </p>
                    <div className="flex items-center space-x-1.5 text-[11px] font-mono font-bold text-[#D4AF37] pt-1">
                      <span>{simulatedRole === 'applicant' ? 'Join to Access' : 'Explore Gatherings'}</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Card 7: Kinship Vault & Archives */}
                  <div 
                    onClick={() => {
                      if (simulatedRole === 'applicant') {
                        setActiveTab('vetting');
                      } else {
                        setActiveTab('kinship');
                      }
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="group bg-white border border-copper-penny/20 hover:border-copper-penny/50 rounded-2xl p-5 sm:p-6 cursor-pointer hover:shadow-lg transition-all duration-300 relative overflow-hidden space-y-2.5"
                  >
                    <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/10 rounded-full blur-xl group-hover:scale-110 transition-transform duration-300" />
                    <div className="flex items-center space-x-2.5 text-amber-800">
                      <Bookmark className="w-5.5 h-5.5 text-amber-700 group-hover:scale-105 transition-transform" />
                      <span className="text-[10px] font-mono uppercase tracking-widest font-bold">District 7</span>
                    </div>
                    <h3 className="font-serif font-extrabold text-lg text-[#1F1813] group-hover:text-copper-penny transition-colors">
                      Kinship Vault &amp; Heritage
                    </h3>
                    <p className="text-xs text-[#2A221B]/85 leading-relaxed">
                      Preserve grandmother recipes, lineage family stories, heirloom seed vaults, and ancestral American heritage records.
                    </p>
                    <div className="flex items-center space-x-1.5 text-[11px] font-mono font-bold text-amber-800 pt-1">
                      <span>{simulatedRole === 'applicant' ? 'Join to Access' : 'Explore Kinship Vault'}</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>

            </motion.div>
          )}

          {/* B. VETTING GATEWAY VIEW */}
          {activeTab === 'vetting' && (
            <motion.div
              key="vetting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <VettingGateway 
                onSubmitApplication={handleRegisterApplication}
                currentApplication={currentApplication}
                existingApplicants={applicants}
                onNavigateToPortal={() => {
                  setActiveTab('village');
                  setSimulatedRole('approved');
                }}
              />
            </motion.div>
          )}

          {/* PRIVATE SANCTUARY GATE: Shown when applicant tries to access protected hubs */}
          {simulatedRole === 'applicant' && activeTab !== 'landing' && activeTab !== 'vetting' && activeTab !== 'treasury' && activeTab !== 'advertise' && (
            <motion.div
              key="sanctuary-gate"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="max-w-2xl mx-auto my-12 p-8 bg-[#FAF5EE] border-2 border-[#D4AF37]/40 rounded-3xl text-center space-y-6 shadow-xl"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-[#1F140E] flex items-center justify-center text-[#D4AF37] shadow-lg">
                <LockKeyhole className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#B87333] font-bold">
                  Private Community Sanctuary (Title 26 USC § 508(c)(1)(a))
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F1813]">
                  Protected Village Ground
                </h3>
                <p className="text-sm text-[#1F1813]/80 max-w-lg mx-auto leading-relaxed">
                  This district, barter exchange, and sister-to-sister messaging are exclusively reserved for verified American-born melanated matriarchs (born 1995 or earlier).
                </p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-copper-penny/20 text-xs text-[#1F1813]/85 space-y-2 text-left">
                <div className="flex items-center space-x-2 font-bold text-[#1F1813]">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Steps to enter this sacred circle:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-soft-sage text-[11px] pl-2">
                  <li>Complete the 5-step Vetting Covenant &amp; Mutual Aid agreement.</li>
                  <li>Confirm maternal lineage roots and 1995 or earlier birth year.</li>
                  <li>Receive approval from Circle Elders &amp; state Circle Stewards.</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setActiveTab('vetting')}
                  className="w-full sm:w-auto px-6 py-3 bg-[#B87333] hover:bg-[#A85138] text-white font-mono text-xs font-bold uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer flex items-center justify-center space-x-2"
                >
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  <span>Begin Vetting Covenant</span>
                </button>
                <button
                  onClick={() => setActiveTab('landing')}
                  className="w-full sm:w-auto px-5 py-3 bg-white hover:bg-gray-50 text-[#1F1813] font-mono text-xs font-bold uppercase tracking-wider rounded-xl border border-copper-penny/30 transition-all cursor-pointer"
                >
                  Return to Home
                </button>
              </div>
            </motion.div>
          )}

          {/* VILLAGE COMMONS HUB: FREE GIFTING, BARTERS, HOUSING, BUSINESSES & EVENTS */}
          {simulatedRole !== 'applicant' && activeTab === 'commons' && (
            <motion.div
              key="commons"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <VillageCommonsHub 
                selectedState={selectedState}
                userName={userName}
                simulatedRole={simulatedRole}
                initialSubTab={commonsSubTab}
                initialTopic={commonsSelectedTopic}
                onSubTabChange={(sub) => setCommonsSubTab(sub)}
                createPostTriggerType={createPostTriggerType}
                onClearPostTrigger={() => setCreatePostTriggerType(null)}
                onNavigateToTab={(tab) => {
                  setActiveTab(tab as any);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenAdminOffice={() => {
                  setSimulatedRole('admin');
                  setActiveTab('admin');
                }}
                allSpotlightBanners={spotlightBanners.filter(b => b.active)}
                onOpenDirectChat={(recipientName, contextTitle, initialNote) => {
                  setLastVisitedTab('village');
                  setProfileInitialTab('chats');
                  handleOpenDirectChatWithContext(recipientName, contextTitle, initialNote);
                  setActiveTab('profile');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </motion.div>
          )}

          {/* MEMBER PROFILE HUB: PERSONAL DATA, COPPER CIRCLE METRICS, BOOKMARKS, CHATS & FORUMS */}
          {simulatedRole !== 'applicant' && activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <MemberProfileHub 
                userName={userName}
                userEmail="shantrecetogetherwewin@gmail.com"
                selectedState={selectedState}
                generosityScore={generosityScore}
                tradeBalance={tradeBalance}
                timeBalance={timeBalance}
                timeLogs={timeLogs}
                savedItems={savedItems}
                chatThreads={chatThreads}
                chatMembers={chatMembers}
                initialProfileTab={profileInitialTab}
                lastVisitedTab={lastVisitedTab}
                onReturnToLastVisitedTab={() => {
                  if (lastVisitedTab) {
                    setActiveTab(lastVisitedTab as any);
                  } else {
                    setActiveTab('village');
                  }
                  setLastVisitedTab(null);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onSendMessage={handleSendDirectMessage}
                onCreateNewChat={handleCreateNewChat}
                onRemoveSavedItem={handleRemoveSavedItem}
                onSelectSavedItem={(item) => {
                  if (item.type === 'exchange' || item.type === 'housing' || item.type === 'business') {
                    setActiveTab('commons');
                  } else {
                    setActiveTab('village');
                  }
                }}
                onNavigateToTab={(tab) => {
                  setActiveTab(tab as any);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onUpdateProfileName={(name) => setUserName(name)}
                onAddLedgerLog={handleAddLedgerLog}
              />
            </motion.div>
          )}

          {/* C. DISTRICT 1: VILLAGE HUB */}
          {simulatedRole !== 'applicant' && activeTab === 'village' && (
            <motion.div
              key="village"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <VillageHub 
                onConsult={handleConsultAdvisor}
                aiLoading={aiLoading}
                aiResponse={aiResponse}
                getLoadingNote={getLoadingNote}
                eventsList={eventsList}
                selectedState={selectedState}
                onAddEarnHours={handleAddEarnHours}
                spotlightBanner={getBannerForPage('village')}
                banners={getBannersForPage('village')}
                onEnterContest={handleAddScholarshipEntry}
              />
            </motion.div>
          )}

          {/* D. DISTRICT 2: EARTH & HEALING (APOTHECARY) */}
          {simulatedRole !== 'applicant' && activeTab === 'healing' && (
            <motion.div
              key="healing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ApothecaryHub 
                onConsult={handleConsultAdvisor}
                aiLoading={aiLoading}
                aiResponse={aiResponse}
                getLoadingNote={getLoadingNote}
                selectedState={selectedState}
                spotlightBanner={getBannerForPage('healing')}
                banners={getBannersForPage('healing')}
                onEnterContest={handleAddScholarshipEntry}
              />
            </motion.div>
          )}

          {/* E. DISTRICT 3: COOPERATIVE ECONOMY */}
          {simulatedRole !== 'applicant' && activeTab === 'economy' && (
            <motion.div
              key="economy"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <MarketplaceHub 
                barterList={barterList}
                onSubmitBarter={handleCreateBarter}
                isPostingBarter={false}
                barterSuccess={false}
                selectedState={selectedState}
                userName={userName}
                timeBalance={timeBalance}
                timeLogs={timeLogs}
                onAddLog={handleAddLedgerLog}
                onDeleteLog={handleDeleteLedgerLog}
                generosityScore={generosityScore}
                tradeBalance={tradeBalance}
                onRefreshStats={fetchUserStats}
                onRefreshBarters={fetchBarters}
                spotlightBanner={getBannerForPage('economy')}
                banners={getBannersForPage('economy')}
                onEnterContest={handleAddScholarshipEntry}
              />
            </motion.div>
          )}

          {/* E. ENTERPRISE & COMMERCE HUB */}
          {simulatedRole !== 'applicant' && activeTab === 'commerce' && (
            <motion.div
              key="commerce"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <CommerceHub 
                selectedState={selectedState}
                userName={userName}
                onNavigateToCircle={() => setActiveTab('gathering')}
                onNavigateToTreasury={() => setActiveTab('treasury')}
                spotlightBanner={getBannerForPage('commerce')}
                banners={getBannersForPage('commerce')}
                onEnterContest={handleAddScholarshipEntry}
              />
            </motion.div>
          )}

          {/* F. DISTRICT 4: THE COPPER CIRCLE */}
          {simulatedRole !== 'applicant' && activeTab === 'gathering' && (
            <motion.div
              key="gathering"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <GatheringHub 
                chatMessages={chatMessages}
                newMessageText={newMessageText}
                onNewMessageChange={setNewMessageText}
                onSendMessage={handleSendMessage}
                isSendingMessage={isSendingMessage}
                selectedState={selectedState}
                userPrivKey={userPrivKey}
                serverPubKey={serverPubKey}
                sharedSovereignSecret={sharedSovereignSecret}
                eventsList={eventsList}
                complianceNotice={complianceNotice}
                onShowCompliance={() => setShowComplianceDetail(true)}
                spotlightBanner={getBannerForPage('gathering')}
                banners={getBannersForPage('gathering')}
                onEnterContest={handleAddScholarshipEntry}
                onOpenAudioLounge={() => setActiveTab('audio')}
                polls={polls}
                onVotePoll={handleVotePoll}
                onSuggestPoll={handleSuggestPoll}
                userName={userName}
              />
            </motion.div>
          )}

          {/* MOTHERS ACADEMY (SKOOL ADULT LEARNING & HER-STORY SANCTUARY) */}
          {simulatedRole !== 'applicant' && activeTab === 'academy' && (
            <motion.div
              key="academy"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <MothersAcademyHub
                userName={userName}
                selectedState={selectedState}
                simulatedRole={simulatedRole}
                onNavigateToTab={(tab: any) => setActiveTab(tab)}
                onOpenDirectChat={(recipientName, contextTitle, initialNote) => {
                  setLastVisitedTab('academy');
                  setProfileInitialTab('chats');
                  handleOpenDirectChatWithContext(recipientName, contextTitle, initialNote);
                  setActiveTab('profile');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </motion.div>
          )}

          {/* G. KINSHIP VAULT */}
          {simulatedRole !== 'applicant' && activeTab === 'kinship' && (
            <motion.div
              key="kinship"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <KinshipVault 
                selectedState={selectedState}
                userName={userName}
                spotlightBanner={getBannerForPage('kinship')}
                banners={getBannersForPage('kinship')}
                onEnterContest={handleAddScholarshipEntry}
              />
            </motion.div>
          )}

          {/* H. AUDIO SANCTUARY LOUNGE (PODCAST & FIRESIDE RADIO) */}
          {simulatedRole !== 'applicant' && activeTab === 'audio' && (
            <motion.div
              key="audio"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <AudioSanctuaryLounge 
                userName={userName}
                userRole={simulatedRole}
                selectedState={selectedState}
                tracks={audioTracks}
                currentTrack={currentAudioTrack}
                isPlaying={isAudioPlaying}
                onPlayTrack={handlePlayTrack}
                onPauseTrack={handlePauseTrack}
                voiceNotes={voiceNotes}
                onAddVoiceNote={handleAddVoiceNote}
                onLikeVoiceNote={handleLikeVoiceNote}
                firesideRoom={firesideRoom}
                onJoinFireside={handleJoinFireside}
                onLeaveFireside={handleLeaveFireside}
                onRaiseHand={handleRaiseHand}
                onToggleFiresideMute={handleToggleFiresideMute}
                onOpenAdminPublisher={() => {
                  setSimulatedRole('admin');
                  setActiveTab('admin');
                }}
              />
            </motion.div>
          )}

          {/* I. ELDER ADMIN VETTING VIEW */}
          {(simulatedRole === 'admin' || simulatedRole === 'representative') && activeTab === 'admin' && (
            <motion.div
              key="admin"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <AdminVetting 
                applicants={applicants}
                onApprove={handleApproveApplicant}
                onDeny={handleDenyApplicant}
                onApproveSpearhead={handleApproveSpearhead}
                simulatedRole={simulatedRole}
                barterOffers={barterList}
                spotlightBanners={spotlightBanners}
                onUpdateSpotlight={handleUpdateSpotlight}
                onAddSpotlight={handleAddSpotlight}
                onDeleteSpotlight={handleDeleteSpotlight}
                onReorderSpotlights={handleReorderSpotlights}
                onToggleSpotlightActive={handleToggleSpotlightActive}
                bulletins={bulletins}
                onAddBulletin={handleAddBulletin}
                onUpdateBulletin={handleUpdateBulletin}
                onDeleteBulletin={handleDeleteBulletin}
                onToggleBulletinActive={handleToggleBulletinActive}
                disputes={disputes}
                onResolveDispute={handleResolveDispute}
                onAddLedgerAdjustment={handleAddLedgerAdjustment}
                hearthSessions={hearthSessions}
                onAddHearthSession={handleAddHearthSession}
                onUpdateHearthSession={handleUpdateHearthSession}
                onDeleteHearthSession={handleDeleteHearthSession}
                onToggleHearthLive={handleToggleHearthLive}
                scholarshipEntries={scholarshipEntries}
                onSelectWinner={handleSelectWinner}
                onDrawRandomWinners={handleDrawRandomWinners}
                audioTracks={audioTracks}
                onAddAudioTrack={handleAddAudioTrack}
                onUpdateAudioTrack={handleUpdateAudioTrack}
                onDeleteAudioTrack={handleDeleteAudioTrack}
                polls={polls}
                onAddPoll={handleAddPoll}
                onTogglePollActive={handleTogglePollActive}
                onDeletePoll={handleDeletePoll}
                onFeaturePoll={handleFeaturePoll}
                onBroadcastPoll={handleBroadcastPoll}
              />
            </motion.div>
          )}

          {/* J. SOVEREIGN TREASURY, PAID SPOTLIGHTS & SKILL POTS */}
          {activeTab === 'treasury' && (
            <motion.div
              key="treasury"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SovereignTreasuryHub 
                userName={userName}
                userEmail="sisterhood@coppermommies.co"
                selectedState={selectedState}
                onShowToast={(msg) => alert(msg)}
                onNavigateToHub={(hub) => setActiveTab(hub as any)}
              />
            </motion.div>
          )}

          {/* K. DEDICATED BUSINESS ADVERTISING PORTAL FOR SINGLE MELANATED WOMEN-OWNED BUSINESSES */}
          {activeTab === 'advertise' && (
            <motion.div
              key="advertise"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <BusinessAdvertisingPortal
                onBackToVillage={() => {
                  setActiveTab(simulatedRole === 'applicant' ? 'landing' : 'commons');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onSubmittedAd={(newAd) => {
                  // If approved or submitted, sync
                  if (newAd.placementType === 'header_banner' || newAd.placementType === 'both_bundle') {
                    // Pre-stage in spotlight banners
                  }
                }}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* 3. Footer */}
      <footer className="bg-[#FAF5EE] text-[#1F1813] border-t border-copper-penny/15 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-12 h-12 flex items-center justify-center">
              <img 
                src="/Copper_Mommies_w_NoBG4.png" 
                alt="Copper Mommies Co. Logo" 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="font-serif font-bold text-xl text-[#1F1813] tracking-tight">Copper Mommies Co.</span>
          </div>
          
          <p className="text-xs text-[#2A221B]/70 max-w-xl mx-auto leading-relaxed">
            Building a decentralized, cooperative economic sanctuary for melanated mothers. Operating peer-to-peer, prioritizing ancestral wellness, and child-rearing on our own terms across 50 states.
          </p>

          <div className="text-[9px] font-mono text-soft-sage font-extrabold tracking-widest uppercase">
            © 2026 Copper Mommies Cooperative • Sisterhood Trust &amp; Community Care • Regional Circles
          </div>
        </div>
      </footer>

      {/* 4. State Privacy Compliance Detail Modal Drawer */}
      <AnimatePresence>
        {showComplianceDetail && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#1F1813]/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl border-2 border-copper-penny/35 max-w-lg w-full overflow-hidden shadow-2xl flex flex-col relative"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-copper-penny/5 rounded-full blur-2xl pointer-events-none" />
              {/* Drawer Header */}
              <div className="bg-[#FAF5EE] text-[#1F1813] p-6 border-b border-copper-penny/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <Shield className="w-5 h-5 text-copper-penny" />
                    <div>
                      <h4 className="font-serif font-bold text-base text-[#1F1813]">Community Guidelines &amp; Privacy Info</h4>
                      <p className="text-[9px] font-mono text-soft-sage uppercase tracking-wider font-extrabold">State-Level Privacy &amp; Care Standards</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowComplianceDetail(false)}
                    className="text-[#1F1813]/70 hover:text-[#1F1813] font-bold text-sm bg-white/50 border border-copper-penny/20 w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Drawer Body */}
              <div className="p-6 space-y-5 text-xs text-[#2A221B] overflow-y-auto max-h-[400px] scrollbar-thin">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono uppercase text-soft-sage block font-extrabold tracking-wider">Active State Circle</span>
                  <p className="font-bold font-serif text-sm text-copper-penny">{complianceNotice?.stateName} Cooperative Circle ({selectedState})</p>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] font-mono uppercase text-soft-sage block font-extrabold tracking-wider">Community Guideline &amp; Standards</span>
                  <p className="font-bold text-copper-penny uppercase font-mono tracking-widest">{complianceNotice?.regulationName}</p>
                </div>

                <div className="space-y-2">
                  <span className="text-[9px] font-mono uppercase text-soft-sage block font-extrabold tracking-wider">Privacy &amp; Security Note</span>
                  <div className="p-3.5 bg-[#FAF5EE] rounded-xl border border-copper-penny/10 leading-relaxed text-[#2A221B]/90">
                    {complianceNotice?.privacyDisclosure}
                  </div>
                </div>

                <div className="space-y-2 bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-emerald-800 leading-relaxed">
                  <div className="flex items-center space-x-1.5 mb-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <strong className="text-sm font-bold text-emerald-800">Community Privacy: Protected &amp; Private</strong>
                  </div>
                  <ul className="list-disc pl-4 space-y-1 text-[11px] text-emerald-800/90">
                    <li>All conversations and sisterhood dialogues are safeguarded directly on your device.</li>
                    <li>Mutual aid exchanges and family requests remain strictly within regional state circles.</li>
                    <li>Homeschooling, family care, and botanical guides are kept private and accessible for families.</li>
                  </ul>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-[#FAF5EE]/60 border border-copper-penny/10 rounded-xl hover:border-copper-penny/25 transition-all">
                  <div>
                    <strong className="block text-[#1F1813] font-bold">Explicit Parental Consent</strong>
                    <span className="text-[10px] text-soft-sage font-medium">Agree to co-op state-level caching parameters.</span>
                  </div>
                  <input 
                    type="checkbox"
                    checked={consentAccepted}
                    onChange={(e) => setConsentAccepted(e.target.checked)}
                    className="w-4 h-4 text-copper-penny rounded border-copper-penny/20 bg-white focus:ring-copper-penny accent-copper-penny cursor-pointer"
                  />
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-4 bg-[#FAF5EE] border-t border-copper-penny/10 flex items-center justify-end">
                <button 
                  onClick={() => setShowComplianceDetail(false)}
                  className="px-5 py-2.5 bg-[#B87333] hover:bg-[#A85138] text-white text-xs font-extrabold uppercase tracking-wider rounded-xl border border-[#96551d]/40 shadow-[0_4px_12px_rgba(184,115,51,0.25)] hover:shadow-[0_6px_18px_rgba(184,115,51,0.35)] cursor-pointer transition-all active:scale-95"
                >
                  Close &amp; Return to Community
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}

        {/* GLOBAL CONTRIBUTION PORTAL MODAL */}
        {showGlobalSupportModal && (
          <motion.div
            key="global-support-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white border-2 border-[#D4AF37] rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col"
            >
              {/* Modal Header */}
              <div className="bg-[#FAF5EE] border-b border-copper-penny/10 p-5 flex items-center justify-between">
                <div className="flex items-center space-x-2.5 text-[#B87333]">
                  <span className="text-xl">💝</span>
                  <div>
                    <h3 className="font-serif font-extrabold text-lg text-[#1F1813]">Support the Community</h3>
                    <p className="text-[10px] font-mono text-soft-sage uppercase tracking-wider font-semibold">Community Support Portal</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowGlobalSupportModal(false)}
                  className="w-8 h-8 rounded-full bg-white border border-copper-penny/15 hover:bg-copper-penny/10 text-soft-sage hover:text-[#1F1813] flex items-center justify-center text-xs font-bold transition-all cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                {/* Direct link to Sovereign Treasury & Tea Portal */}
                <div className="p-3.5 bg-gradient-to-r from-[#1F140E] to-[#2A1D16] text-[#FAF5EE] rounded-2xl border border-[#D4AF37]/50 flex items-center justify-between gap-3 shadow-md">
                  <div className="flex items-center space-x-2.5">
                    <span className="text-2xl">🍵</span>
                    <div>
                      <h4 className="font-serif font-bold text-xs text-[#D4AF37]">"Buy Us a Tea" &amp; Sovereign Treasury</h4>
                      <p className="text-[10px] text-white/80">Stripe, Cash App ($CopperMommiesCo), Zelle &amp; Skill Pots</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowGlobalSupportModal(false);
                      setActiveTab('treasury');
                    }}
                    className="px-3 py-1.5 bg-[#D4AF37] hover:bg-[#C5A02E] text-[#1F140E] rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider cursor-pointer shrink-0"
                  >
                    Open Treasury →
                  </button>
                </div>

                <p className="text-xs text-[#2A221B]/85 leading-relaxed">
                  Welcome to the Copper Mommies Co. Contribution Portal. Our platforms, hosting, and physical gathering circles run entirely on direct support from our sisters. Offer monetary support, or pledge essential household items or professional skills below.
                </p>

                <form 
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.currentTarget;
                    const formData = new FormData(form);
                    const pType = formData.get('pledgeType') as string;
                    const pAmount = formData.get('amount') ? Number(formData.get('amount')) : undefined;
                    const pDetails = formData.get('details') as string;

                    try {
                      const res = await fetch('/api/kinship/pledges', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          donorName: userName,
                          pledgeType: pType,
                          amount: pAmount,
                          details: pDetails,
                          stateCode: selectedState
                        })
                      });

                      if (res.ok) {
                        alert("Thank you, Sister! Your contribution has been recorded.");
                        setShowGlobalSupportModal(false);
                      }
                    } catch (err) {
                      console.error(err);
                    }
                  }} 
                  className="space-y-4"
                >
                  {/* Select Pledge Type */}
                  <div className="space-y-1">
                    <label className="block text-[9px] uppercase font-mono text-soft-sage font-bold tracking-wider">Select Contribution Type</label>
                    <select 
                      name="pledgeType"
                      id="modalPledgeType"
                      required
                      defaultValue="monetary"
                      onChange={(e) => {
                        const amtField = document.getElementById('modalAmountContainer');
                        if (amtField) {
                          amtField.style.display = e.target.value === 'monetary' ? 'block' : 'none';
                        }
                      }}
                      className="w-full bg-[#FAF5EE]/50 border border-copper-penny/20 focus:border-copper-penny rounded-xl px-3.5 py-2 text-xs text-[#1F1813] focus:outline-none"
                    >
                      <option value="monetary">💰 Monetary Support (Operations / Server Costs)</option>
                      <option value="skill">🛠️ Skill Pledge (Legal, Tax Prep, Genealogy, etc.)</option>
                      <option value="item">📦 Physical Item Pledge (Heirloom Seeds, Tools, Goods)</option>
                    </select>
                  </div>

                  {/* Monetary Amount (visible by default) */}
                  <div id="modalAmountContainer" className="space-y-1">
                    <label className="block text-[9px] uppercase font-mono text-soft-sage font-bold tracking-wider">Contribution Amount ($)</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2 text-xs text-soft-sage font-bold">$</span>
                      <input 
                        type="number"
                        name="amount"
                        placeholder="e.g. 50"
                        className="w-full bg-white border border-copper-penny/20 focus:border-copper-penny focus:outline-none rounded-xl pl-8 pr-4 py-2 text-xs text-[#1F1813]"
                      />
                    </div>
                  </div>

                  {/* Pledge Details */}
                  <div className="space-y-1">
                    <label className="block text-[9px] uppercase font-mono text-soft-sage font-bold tracking-wider">Details &amp; Purpose</label>
                    <textarea 
                      name="details"
                      required
                      rows={3}
                      placeholder="e.g., General support donation, OR 'Offering 2 hours of legal assistance on land trust formulation', OR 'Pledging 10 heirloom collard green starter plants'."
                      className="w-full bg-white border border-copper-penny/20 focus:border-copper-penny focus:outline-none rounded-xl px-3.5 py-2 text-xs text-[#1F1813] resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2 flex items-center justify-end space-x-3">
                    <button 
                      type="button"
                      onClick={() => setShowGlobalSupportModal(false)}
                      className="px-4 py-2 text-xs text-soft-sage font-bold border border-copper-penny/15 rounded-xl hover:bg-gray-50 transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="px-6 py-2.5 bg-[#B87333] hover:bg-[#A85138] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md cursor-pointer transition-all active:scale-95"
                    >
                      Record Contribution
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* MEMBER LOGIN MODAL WITH STAY LOGGED IN OPTION */}
        {showMemberLoginModal && (
          <motion.div
            key="member-login-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-gradient-to-b from-[#FAF5EE] to-[#F5ECE0] border-2 border-[#D4AF37] rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col text-[#1F1813] relative"
            >
              {/* Modal Header */}
              <div className="bg-[#1F140E] border-b border-[#D4AF37]/30 p-5 flex items-center justify-between text-white">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-xl text-[#D4AF37]">
                    🔑
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#FAF5EE]">
                      Sister Member Login
                    </h3>
                    <p className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider font-semibold">
                      Copper Mommies Co. Cooperative Access
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowMemberLoginModal(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center text-xs font-bold transition-all cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4">
                {/* 1-Click Fast Sister Sign In */}
                <div className="p-4 bg-white border border-copper-penny/25 rounded-2xl space-y-3 shadow-2xs">
                  <div className="flex items-center space-x-3">
                    <img 
                      src="/coppermommies-selflove1-cmc.jpg" 
                      alt="Mama Shantrece" 
                      className="w-12 h-12 rounded-full object-cover border-2 border-[#D4AF37]" 
                    />
                    <div>
                      <h4 className="font-serif font-bold text-sm text-[#1F1813]">Mama Shantrece</h4>
                      <p className="text-[10px] font-mono text-soft-sage">Verified Mother • Georgia Circle</p>
                      <p className="text-[10px] text-gray-500 font-mono">shantrecetogetherwewin@gmail.com</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSimulatedRole('approved');
                      setActiveTab('profile');
                      setShowMemberLoginModal(false);
                    }}
                    className="w-full py-3 bg-gradient-to-r from-[#B87333] via-[#D4AF37] to-[#B87333] hover:opacity-95 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center space-x-2 font-mono"
                  >
                    <span>🕊️</span>
                    <span>Sign In as Mama Shantrece</span>
                  </button>
                </div>

                <div className="relative flex items-center justify-center">
                  <div className="border-t border-copper-penny/20 w-full" />
                  <span className="bg-[#F5ECE0] px-3 text-[10px] font-mono text-gray-500 uppercase tracking-widest absolute">
                    Or Enter Member Email
                  </span>
                </div>

                {/* Email Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (memberEmailInput.trim()) {
                      setUserName(memberEmailInput.split('@')[0] || 'Sister Member');
                    }
                    setSimulatedRole('approved');
                    setActiveTab('profile');
                    setShowMemberLoginModal(false);
                  }}
                  className="space-y-3"
                >
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono text-[#1F1813] font-bold tracking-wider">
                      Account Email
                    </label>
                    <input
                      type="email"
                      value={memberEmailInput}
                      onChange={(e) => setMemberEmailInput(e.target.value)}
                      placeholder="e.g. sisterhood@coppermommies.co"
                      className="w-full bg-white border border-copper-penny/30 focus:border-[#D4AF37] focus:outline-none rounded-xl px-3.5 py-2.5 text-xs text-[#1F1813] font-mono"
                    />
                  </div>

                  {/* Stay Logged In Checkbox */}
                  <div className="flex items-center space-x-2 pt-1">
                    <input
                      type="checkbox"
                      id="stay-logged-in-checkbox"
                      checked={stayLoggedIn}
                      onChange={() => {
                        const next = !stayLoggedIn;
                        setStayLoggedIn(next);
                        try {
                          localStorage.setItem('copper_mommies_stay_logged_in', next ? 'true' : 'false');
                        } catch (e) {}
                      }}
                      className="rounded text-[#B87333] focus:ring-[#D4AF37] cursor-pointer"
                    />
                    <label htmlFor="stay-logged-in-checkbox" className="text-xs text-[#1F1813] font-medium cursor-pointer">
                      Stay logged in on this device across visits
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#1F1813] hover:bg-[#2A221B] text-[#FAF5EE] font-mono text-xs font-bold uppercase rounded-xl transition-all cursor-pointer shadow-sm"
                  >
                    Enter Sister Circle
                  </button>
                </form>

                {/* Admin login option */}
                <div className="pt-2 border-t border-copper-penny/15 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setShowMemberLoginModal(false);
                      setShowAdminLoginModal(true);
                    }}
                    className="text-[11px] font-mono text-copper-penny hover:underline cursor-pointer"
                  >
                    🔒 Are you the Founder / Circle Lead? Admin Login →
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* FOUNDER & CIRCLE LEAD ADMIN LOGIN MODAL */}
        {showAdminLoginModal && (
          <motion.div
            key="admin-login-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-gradient-to-b from-[#1F140E] via-[#2A1D16] to-[#140D09] border-2 border-[#D4AF37] rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col text-white relative"
            >
              {/* Modal Header */}
              <div className="bg-black/30 border-b border-[#D4AF37]/30 p-5 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-xl text-[#D4AF37]">
                    🛡️
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#FAF5EE]">
                      Founder &amp; Circle Lead Login
                    </h3>
                    <p className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider font-semibold">
                      Mama Shantrece's Admin Command Center
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowAdminLoginModal(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center text-xs font-bold transition-all cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-5">
                {/* Recognized Founder Card */}
                <div className="p-4 bg-white/5 border border-[#D4AF37]/40 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-[#D4AF37] font-bold uppercase tracking-wider">
                      Authorized Matriarch
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 rounded-full text-[10px] font-mono">
                      Founder Access Active
                    </span>
                  </div>
                  <p className="text-sm font-serif font-bold text-white">
                    Mama Shantrece
                  </p>
                  <p className="text-xs font-mono text-white/70">
                    shantrecetogetherwewin@gmail.com
                  </p>
                </div>

                {/* Instant 1-Click Access Button */}
                <div className="space-y-2 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setSimulatedRole('admin');
                      setActiveTab('admin');
                      setShowAdminLoginModal(false);
                    }}
                    className="w-full py-3.5 bg-gradient-to-r from-[#D4AF37] via-[#E5C158] to-[#D4AF37] hover:from-[#C5A02E] hover:to-[#B87333] text-[#1F140E] font-extrabold text-sm uppercase tracking-wider rounded-2xl shadow-lg transition-all active:scale-98 cursor-pointer flex items-center justify-center space-x-2 font-mono"
                  >
                    <span>👑</span>
                    <span>Enter Admin Portal (1-Click Instant Access)</span>
                  </button>
                  <p className="text-[11px] text-white/60">
                    Click above to instantly unlock and open your Back Office. No password required!
                  </p>
                </div>

                <div className="relative flex items-center justify-center">
                  <div className="border-t border-white/15 w-full" />
                  <span className="bg-[#2A1D16] px-3 text-[10px] font-mono text-white/40 uppercase tracking-widest absolute">
                    Or Enter Passcode
                  </span>
                </div>

                {/* Optional Passcode Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSimulatedRole('admin');
                    setActiveTab('admin');
                    setShowAdminLoginModal(false);
                  }}
                  className="space-y-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] uppercase font-mono text-white/70 font-bold tracking-wider">
                        Founder Passphrase
                      </label>
                      <span className="text-[10px] font-mono text-[#D4AF37]">
                        Default: <code>coppermommies</code>
                      </span>
                    </div>
                    <input
                      type="password"
                      value={adminPasswordInput}
                      onChange={(e) => setAdminPasswordInput(e.target.value)}
                      placeholder="Enter 'coppermommies' or leave blank"
                      className="w-full bg-black/40 border border-[#D4AF37]/40 focus:border-[#D4AF37] focus:outline-none rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/40 font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-mono text-xs font-bold uppercase rounded-xl transition-all cursor-pointer"
                  >
                    Unlock with Passcode
                  </button>
                </form>

                {/* Back Office Capabilities Footer */}
                <div className="p-3 bg-black/30 rounded-xl border border-white/10 text-[10px] text-white/60 space-y-1">
                  <strong className="text-[#D4AF37] block font-mono uppercase">What you can do in your Admin Office:</strong>
                  <p>• Manage private Treasury, $60/qtr vendor spotlights &amp; $5/$10 classifieds</p>
                  <p>• Approve mother vetting applications &amp; maternal lineage</p>
                  <p>• Host Casual Corner live podcasts &amp; publish broadcast bulletins</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent Background Audio Element */}
      <audio
        ref={audioRef}
        src={currentAudioTrack?.audioUrl}
        preload="metadata"
        onTimeUpdate={() => {
          if (audioRef.current) {
            setAudioCurrentTime(audioRef.current.currentTime);
          }
        }}
        onDurationChange={() => {
          if (audioRef.current && !isNaN(audioRef.current.duration)) {
            setAudioDuration(audioRef.current.duration);
          }
        }}
        onEnded={() => {
          setIsAudioPlaying(false);
        }}
      />

      {/* Persistent Floating Audio Sanctuary Player (Verified Members Only) */}
      {simulatedRole !== 'applicant' && (
        <AudioPlayerFloating
          currentTrack={currentAudioTrack}
          isPlaying={isAudioPlaying}
          currentTime={audioCurrentTime}
          duration={audioDuration}
          playbackRate={audioPlaybackRate}
          volume={audioVolume}
          onPlayPause={handleTogglePlayPause}
          onSeek={handleSeekAudio}
          onSkip={handleSkipTrack}
          onPlaybackRateChange={handleChangePlaybackRate}
          onVolumeChange={handleChangeVolume}
          onClose={handleCloseAudioPlayer}
          onOpenLounge={() => setActiveTab('audio')}
        />
      )}

      {/* PWA Direct Installation Prompt & Mobile iOS/Android Guide (Verified Members Only) */}
      {simulatedRole !== 'applicant' && (
        <PWAInstallPrompt />
      )}

      {/* Floating Collapsible Direct Chat Window (Dock) */}
      {simulatedRole !== 'applicant' && (
        <BottomFloatingChatDock 
          threads={chatThreads}
          members={chatMembers}
          currentUserName={userName}
          onSendMessage={handleSendDirectMessage}
          onCreateNewChat={handleCreateNewChat}
          onNavigateToProfileChats={() => {
            setActiveTab('profile');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onEditMessage={handleEditDirectMessage}
          onDeleteMessage={handleDeleteDirectMessage}
          onPinMessage={handlePinDirectMessage}
          onReactMessage={handleReactDirectMessage}
        />
      )}

      {/* MOBILE BOTTOM NAVIGATION DOCK (STREAMLINED 5-ACTION BAR) */}
      {simulatedRole !== 'applicant' && (
        <div className="md:hidden fixed bottom-3 left-3 right-3 z-40 bg-[#140F0B]/95 backdrop-blur-md border border-[#D4AF37]/40 rounded-3xl px-2 py-1.5 shadow-2xl flex items-center justify-around text-[10px] font-mono text-[#FAF5EE]">
          {/* 1. Home */}
          <button
            onClick={() => {
              setActiveTab('landing');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center space-y-0.5 py-1 px-2 rounded-2xl transition-all cursor-pointer ${
              activeTab === 'landing' ? 'text-[#D4AF37] font-bold' : 'text-[#FAF5EE]/70 hover:text-white'
            }`}
          >
            <span className="text-base">🌍</span>
            <span>Home</span>
          </button>

          {/* 2. The Hearth */}
          <button
            onClick={() => {
              setActiveTab('commons');
              setCommonsSubTab('feed');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center space-y-0.5 py-1 px-2 rounded-2xl transition-all cursor-pointer ${
              activeTab === 'commons' && commonsSubTab === 'feed' ? 'text-[#D4AF37] font-bold' : 'text-[#FAF5EE]/70 hover:text-white'
            }`}
          >
            <span className="text-base">🏡</span>
            <span>The Hearth</span>
          </button>

          {/* 3. The Exchange */}
          <button
            onClick={() => {
              setActiveTab('commons');
              setCommonsSubTab('exchange');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center space-y-0.5 py-1 px-2 rounded-2xl transition-all cursor-pointer ${
              activeTab === 'commons' && commonsSubTab === 'exchange' ? 'text-[#D4AF37] font-bold' : 'text-[#FAF5EE]/70 hover:text-white'
            }`}
          >
            <span className="text-base">🤝</span>
            <span>The Exchange</span>
          </button>

          {/* 4. Post Action (Central Gold Button) */}
          <button
            onClick={() => {
              setShowMobilePostSheet(true);
            }}
            className="w-10 h-10 -my-1 rounded-full bg-gradient-to-tr from-[#B87333] via-[#D4AF37] to-[#F3DE8A] text-[#1F140E] flex items-center justify-center font-bold text-lg shadow-[0_4px_16px_rgba(212,175,55,0.45)] cursor-pointer hover:scale-105 active:scale-95 transition-all shrink-0 border-2 border-white/50"
            title="Create Post or Listing"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* 5. Sanctuary Drawer (Hubs, Forums, Settings & Metrics) */}
          <button
            onClick={() => {
              setShowSisterProfileMenu(true);
            }}
            className="flex flex-col items-center space-y-0.5 py-1 px-2 rounded-2xl text-[#FAF5EE]/70 hover:text-white transition-all cursor-pointer"
            title="Open Sister Sanctuary Drawer (Hubs, Forums, Settings & Metrics)"
          >
            <div className="w-5 h-5 rounded-full overflow-hidden border border-[#D4AF37] shrink-0">
              <img src="/coppermommies-selflove1-cmc.jpg" alt="Profile" className="w-full h-full object-cover" />
            </div>
            <span>Sanctuary</span>
          </button>
        </div>
      )}

      {/* MOBILE CREATE POST ACTION SHEET */}
      {showMobilePostSheet && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999999] pointer-events-auto">
          <div 
            className="fixed inset-0 bg-black/65 backdrop-blur-xs transition-opacity animate-fade-in-backdrop cursor-pointer"
            onClick={() => setShowMobilePostSheet(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-[#FAF5EE] rounded-t-3xl border-t-2 border-[#D4AF37] p-6 shadow-2xl space-y-4 animate-slide-in-up text-[#1F140E]">
            <div className="flex items-center justify-between border-b border-copper-penny/20 pb-3">
              <div className="flex items-center space-x-2">
                <span className="text-lg">✍️</span>
                <h3 className="font-serif font-black text-base text-[#1F140E]">
                  Create Sanctuary Post or Listing
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowMobilePostSheet(false)}
                className="p-1.5 rounded-xl hover:bg-copper-penny/10 text-neutral-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs font-sans text-gray-600">
              Choose where you would like to share your offering with your verified sisters:
            </p>

            <div className="space-y-2 font-mono text-xs">
              <button
                type="button"
                onClick={() => {
                  setShowMobilePostSheet(false);
                  setActiveTab('commons');
                  setCommonsSubTab('feed');
                  setCreatePostTriggerType('feed');
                }}
                className="w-full p-3 bg-white hover:bg-[#FAF5EE] rounded-2xl border border-copper-penny/25 text-left flex items-center justify-between group cursor-pointer transition-all shadow-xs"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl">🌿</span>
                  <div>
                    <div className="font-serif font-bold text-xs text-[#1F140E]">Share to The Hearth Stream</div>
                    <div className="text-[10px] text-gray-500 font-sans">Encouragement, questions, recipes &amp; remedy wisdom</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-copper-penny group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowMobilePostSheet(false);
                  setActiveTab('commons');
                  setCommonsSubTab('exchange');
                  setCreatePostTriggerType('exchange');
                }}
                className="w-full p-3 bg-white hover:bg-[#FAF5EE] rounded-2xl border border-copper-penny/25 text-left flex items-center justify-between group cursor-pointer transition-all shadow-xs"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl">🤝</span>
                  <div>
                    <div className="font-serif font-bold text-xs text-[#1F140E]">List on The Exchange</div>
                    <div className="text-[10px] text-gray-500 font-sans">Free giveaway, barter trade, or time credit item</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-copper-penny group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowMobilePostSheet(false);
                  setActiveTab('commons');
                  setCommonsSubTab('housing');
                  setCreatePostTriggerType('housing');
                }}
                className="w-full p-3 bg-white hover:bg-[#FAF5EE] rounded-2xl border border-copper-penny/25 text-left flex items-center justify-between group cursor-pointer transition-all shadow-xs"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl">🏡</span>
                  <div>
                    <div className="font-serif font-bold text-xs text-[#1F140E]">Post Housing or Land Space</div>
                    <div className="text-[10px] text-gray-500 font-sans">Maternity rest suite, room rental, or homestead acreage</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-copper-penny group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowMobilePostSheet(false);
                  setActiveTab('advertise');
                }}
                className="w-full p-3 bg-white hover:bg-[#FAF5EE] rounded-2xl border border-copper-penny/25 text-left flex items-center justify-between group cursor-pointer transition-all shadow-xs"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl">✨</span>
                  <div>
                    <div className="font-serif font-bold text-xs text-[#1F140E]">Register Sister Business / Ad</div>
                    <div className="text-[10px] text-gray-500 font-sans">Feature your maternal enterprise in the Grand Spotlight</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-copper-penny group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ROOT PORTAL: RIGHT SLIDE-OUT SISTER PROFILE & ACCOUNT DRAWER */}
      {showSisterProfileMenu && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[999999] pointer-events-auto">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/65 backdrop-blur-xs transition-opacity animate-fade-in-backdrop cursor-pointer" 
            onClick={() => setShowSisterProfileMenu(false)} 
            aria-label="Close Profile Menu"
          />

          {/* Right Slide-Out Panel */}
          <aside 
            aria-label="My Sister Profile & Account Menu"
            className="fixed top-0 right-0 bottom-0 w-[335px] sm:w-[410px] max-w-[92vw] bg-[#FAF5EE] border-l-2 border-[#D4AF37]/80 shadow-[0_0_60px_rgba(0,0,0,0.6)] z-[1000000] p-5 sm:p-6 overflow-y-auto space-y-5 animate-slide-in-right text-xs font-sans flex flex-col justify-between"
          >
            <div className="space-y-5">
              {/* Drawer Top Header & Close Button */}
              <div className="flex items-center justify-between border-b border-copper-penny/20 pb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm">👑</span>
                  <span className="font-mono text-[10px] uppercase tracking-wider font-extrabold text-[#B87333]">
                    Sister Sanctuary Drawer
                  </span>
                </div>
                <button
                  onClick={() => setShowSisterProfileMenu(false)}
                  className="p-1.5 sm:p-2 rounded-xl bg-copper-penny/10 hover:bg-copper-penny/20 text-[#1F1813] cursor-pointer transition-colors border border-copper-penny/20"
                  title="Close Profile Menu (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Member Profile Identity Card */}
              <div className="flex items-center space-x-3.5 p-3.5 bg-white rounded-2xl border border-copper-penny/20 shadow-xs">
                <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[#D4AF37] ring-2 ring-[#D4AF37]/30 shadow-md shrink-0 bg-[#FAF5EE]">
                  <img 
                    src="/coppermommies-selflove1-cmc.jpg" 
                    alt={userName} 
                    className="w-full h-full object-cover" 
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white ring-1 ring-emerald-600" title="Active Sister" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-1.5">
                    <p className="font-serif font-bold text-base text-[#1F1813] truncate">
                      {simulatedRole === 'admin' ? 'Mama Shantrece' : userName}
                    </p>
                    <span className="text-xs" title="Verified Sovereign Matriarch">✨</span>
                  </div>
                  <p className="text-[10px] font-mono text-soft-sage truncate">
                    @{simulatedRole === 'admin' ? 'mamashantrece' : 'coppermommie'} &bull; {selectedState} Circle
                  </p>
                  <div className="mt-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-[#D4AF37]/20 text-amber-950 border border-[#D4AF37]/40">
                      {simulatedRole === 'admin' 
                        ? '👑 FOUNDER / ELDER COUNCIL' 
                        : simulatedRole === 'approved' 
                        ? '🕊️ TIER 3 SOVEREIGN MATRIARCH'
                        : simulatedRole === 'representative'
                        ? '👑 CIRCLE HOST & LIAISON'
                        : '🌱 SEEKING SISTER'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Wisdom Progression Level */}
              <div className="px-3 py-1.5 bg-amber-500/10 border border-[#D4AF37]/35 rounded-xl flex items-center justify-between font-mono text-[10px]">
                <span className="text-amber-950 font-bold flex items-center space-x-1.5">
                  <span>🌱</span>
                  <span>Wisdom Progression:</span>
                </span>
                <span className="font-bold text-[#B87333]">
                  {simulatedRole === 'admin' ? 'Elder Council (Tier 3)' : 'Homestead Pillar (Tier 2)'}
                </span>
              </div>

              {/* Direct Primary Action: Go to My Profile Hub */}
              <button
                onClick={() => {
                  setActiveTab('profile');
                  setShowSisterProfileMenu(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full py-3 bg-[#1F1813] hover:bg-[#2A221B] text-[#FAF5EE] rounded-2xl font-bold font-sans text-xs flex items-center justify-center space-x-2 shadow-md cursor-pointer transition-all active:scale-95 border border-[#D4AF37]/30"
              >
                <User className="w-4 h-4 text-[#D4AF37]" />
                <span>Go to My Profile Hub</span>
              </button>

              {/* Real-Time Cooperative Metrics: Generosity, Trade Balance, Time Bank */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono px-1">
                  <span className="uppercase font-bold text-gray-500">Cooperative Standing</span>
                  <span className="text-emerald-700 font-bold">100% Sovereign Trust</span>
                </div>
                <div className="grid grid-cols-3 gap-2 p-3 bg-white rounded-2xl border border-copper-penny/20 text-center font-mono text-[10px] shadow-2xs">
                  <div>
                    <span className="text-gray-400 block text-[9px] uppercase font-bold flex items-center justify-center space-x-0.5">
                      <span>💖</span>
                      <span>Generosity</span>
                    </span>
                    <strong className="text-copper-penny text-xs block mt-0.5">{generosityScore} pts</strong>
                    <span className="text-[8px] text-gray-400 block">Acts of Care</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[9px] uppercase font-bold flex items-center justify-center space-x-0.5">
                      <span>🪙</span>
                      <span>Trade Bal</span>
                    </span>
                    <strong className="text-[#B87333] text-xs block mt-0.5">+{tradeBalance}</strong>
                    <span className="text-[8px] text-gray-400 block">Barter Ledger</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[9px] uppercase font-bold flex items-center justify-center space-x-0.5">
                      <span>⏳</span>
                      <span>Time Bank</span>
                    </span>
                    <strong className="text-[#1F1813] text-xs block mt-0.5">{timeBalance}h</strong>
                    <span className="text-[8px] text-gray-400 block">Shared Hours</span>
                  </div>
                </div>
              </div>

              {/* 1. ALL SANCTUARY HUBS & COMMUNITY SPACES */}
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between px-1 pt-1">
                  <span className="text-[10px] font-mono uppercase font-bold text-gray-500">
                    Sanctuary Hubs &amp; Spaces
                  </span>
                  <span className="text-[9px] font-mono text-soft-sage">All Portals</span>
                </div>

                {/* Village Commons & The Hearth */}
                <button
                  onClick={() => {
                    setActiveTab('commons');
                    setCommonsSubTab('feed');
                    setShowSisterProfileMenu(false);
                  }}
                  className="w-full p-2.5 bg-white hover:bg-neutral-50 rounded-2xl border border-copper-penny/20 flex items-center justify-between font-bold cursor-pointer shadow-2xs transition-all active:scale-[0.99]"
                >
                  <span className="flex items-center space-x-2.5">
                    <span className="text-base">🏡</span>
                    <span>Village Commons &amp; The Hearth</span>
                  </span>
                  <span className="text-[9px] font-mono font-bold bg-[#FAF5EE] text-[#B87333] px-2 py-0.5 rounded-md border border-copper-penny/20">
                    Commons
                  </span>
                </button>

                {/* The Exchange: Barter & Trade Marketplace */}
                <button
                  onClick={() => {
                    setActiveTab('commons');
                    setCommonsSubTab('exchange');
                    setShowSisterProfileMenu(false);
                  }}
                  className="w-full p-2.5 bg-white hover:bg-neutral-50 rounded-2xl border border-copper-penny/20 flex items-center justify-between font-bold cursor-pointer shadow-2xs transition-all active:scale-[0.99]"
                >
                  <span className="flex items-center space-x-2.5">
                    <span className="text-base">🤝</span>
                    <span>The Exchange (Barter &amp; Free Swaps)</span>
                  </span>
                  <span className="text-[9px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-300/60">
                    Marketplace
                  </span>
                </button>

                {/* Mothers Academy & Her-Story Skool Hub */}
                <button
                  onClick={() => {
                    setActiveTab('academy');
                    setShowSisterProfileMenu(false);
                  }}
                  className="w-full p-2.5 bg-white hover:bg-neutral-50 rounded-2xl border border-copper-penny/20 flex items-center justify-between font-bold cursor-pointer shadow-2xs transition-all active:scale-[0.99]"
                >
                  <span className="flex items-center space-x-2.5">
                    <span className="text-base">🎓</span>
                    <span>Mothers Academy &amp; Her-Story</span>
                  </span>
                  <span className="text-[9px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md border border-amber-300/60">
                    Skool Hub
                  </span>
                </button>

                {/* NestBright Homeschool & Co-op Coordination Hub */}
                <button
                  onClick={() => {
                    setActiveTab('kinship');
                    setShowSisterProfileMenu(false);
                  }}
                  className="w-full p-2.5 bg-white hover:bg-neutral-50 rounded-2xl border border-copper-penny/20 flex items-center justify-between font-bold cursor-pointer shadow-2xs transition-all active:scale-[0.99]"
                >
                  <span className="flex items-center space-x-2.5">
                    <BookOpen className="w-4 h-4 text-copper-penny" />
                    <span>NestBright Homeschool &amp; Co-Op</span>
                  </span>
                  <span className="text-[9px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md border border-amber-300/60">
                    Co-op Hub
                  </span>
                </button>

                {/* Business Ad Portal & Register Biz */}
                <button
                  onClick={() => {
                    setActiveTab('advertise');
                    setShowSisterProfileMenu(false);
                  }}
                  className="w-full p-2.5 bg-white hover:bg-neutral-50 rounded-2xl border border-copper-penny/20 flex items-center justify-between font-bold cursor-pointer shadow-2xs transition-all active:scale-[0.99]"
                >
                  <span className="flex items-center space-x-2.5">
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                    <span>Business Ad Portal &amp; Register Biz</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-soft-sage" />
                </button>

                {/* Earth & Herbal Apothecary */}
                <button
                  onClick={() => {
                    setActiveTab('healing');
                    setShowSisterProfileMenu(false);
                  }}
                  className="w-full p-2.5 bg-white hover:bg-neutral-50 rounded-2xl border border-copper-penny/20 flex items-center justify-between font-bold cursor-pointer shadow-2xs transition-all active:scale-[0.99]"
                >
                  <span className="flex items-center space-x-2.5">
                    <span className="text-base">🌿</span>
                    <span>Earth &amp; Herbal Apothecary</span>
                  </span>
                  <span className="text-[9px] font-mono font-bold bg-[#FAF5EE] text-[#B87333] px-2 py-0.5 rounded-md border border-copper-penny/20">
                    Remedies
                  </span>
                </button>

                {/* Sister Direct Chats */}
                <button
                  onClick={() => {
                    setProfileInitialTab('chats');
                    setActiveTab('profile');
                    setShowSisterProfileMenu(false);
                  }}
                  className="w-full p-2.5 bg-white hover:bg-neutral-50 rounded-2xl border border-copper-penny/20 flex items-center justify-between font-bold cursor-pointer shadow-2xs transition-all active:scale-[0.99]"
                >
                  <span className="flex items-center space-x-2.5">
                    <MessageSquare className="w-4 h-4 text-copper-penny" />
                    <span>Sister Direct Chats</span>
                  </span>
                  <span className="text-[9px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-300/60">
                    Active (3)
                  </span>
                </button>

                {/* Saved Bookmarks */}
                <button
                  onClick={() => {
                    setActiveTab('profile');
                    setShowSisterProfileMenu(false);
                  }}
                  className="w-full p-2.5 bg-white hover:bg-neutral-50 rounded-2xl border border-copper-penny/20 flex items-center justify-between font-bold cursor-pointer shadow-2xs transition-all active:scale-[0.99]"
                >
                  <span className="flex items-center space-x-2.5">
                    <Bookmark className="w-4 h-4 text-copper-penny" />
                    <span>Saved Bookmarks</span>
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-[#FAF5EE] text-[#B87333] px-2 py-0.5 rounded-lg border border-copper-penny/20">
                    {savedItems.length}
                  </span>
                </button>
              </div>

              {/* 2. FORUMS & TOPIC SANCTUMS DYNAMIC ACCESS */}
              <div className="space-y-2 pt-2 border-t border-copper-penny/20">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[10px] font-mono uppercase font-bold text-gray-500">
                    🌿 Forums &amp; Sacred Sanctums
                  </span>
                  <span className="text-[9px] font-mono text-soft-sage">Direct Filters</span>
                </div>
                
                <div className="grid grid-cols-2 gap-1.5 font-mono text-[10px]">
                  <button
                    onClick={() => {
                      setActiveTab('commons');
                      setCommonsSubTab('feed');
                      setCommonsSelectedTopic('daily-uplift');
                      setShowSisterProfileMenu(false);
                      window.scrollTo({ top: 350, behavior: 'smooth' });
                    }}
                    className="p-2 rounded-xl bg-white hover:bg-neutral-50 border border-copper-penny/20 text-left cursor-pointer transition-all flex items-center space-x-1.5"
                  >
                    <span>🕊️</span>
                    <span className="truncate">Daily Uplift</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('commons');
                      setCommonsSubTab('feed');
                      setCommonsSelectedTopic('herbal-remedies');
                      setShowSisterProfileMenu(false);
                      window.scrollTo({ top: 350, behavior: 'smooth' });
                    }}
                    className="p-2 rounded-xl bg-white hover:bg-neutral-50 border border-copper-penny/20 text-left cursor-pointer transition-all flex items-center space-x-1.5"
                  >
                    <span>🌱</span>
                    <span className="truncate">Herbal Remedies</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('commons');
                      setCommonsSubTab('feed');
                      setCommonsSelectedTopic('birth-postpartum');
                      setShowSisterProfileMenu(false);
                      window.scrollTo({ top: 350, behavior: 'smooth' });
                    }}
                    className="p-2 rounded-xl bg-white hover:bg-neutral-50 border border-copper-penny/20 text-left cursor-pointer transition-all flex items-center space-x-1.5"
                  >
                    <span>👶</span>
                    <span className="truncate">Birth &amp; Family</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('commons');
                      setCommonsSubTab('feed');
                      setCommonsSelectedTopic('homeschool-nestbright');
                      setShowSisterProfileMenu(false);
                      window.scrollTo({ top: 350, behavior: 'smooth' });
                    }}
                    className="p-2 rounded-xl bg-white hover:bg-neutral-50 border border-copper-penny/20 text-left cursor-pointer transition-all flex items-center space-x-1.5"
                  >
                    <span>📚</span>
                    <span className="truncate">Homeschool Pod</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('commons');
                      setCommonsSubTab('feed');
                      setCommonsSelectedTopic('homestead-seeds');
                      setShowSisterProfileMenu(false);
                      window.scrollTo({ top: 350, behavior: 'smooth' });
                    }}
                    className="p-2 rounded-xl bg-white hover:bg-neutral-50 border border-copper-penny/20 text-left cursor-pointer transition-all flex items-center space-x-1.5"
                  >
                    <span>🌾</span>
                    <span className="truncate">Homestead Seeds</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('commons');
                      setCommonsSubTab('feed');
                      setCommonsSelectedTopic('wealth-strategies');
                      setShowSisterProfileMenu(false);
                      window.scrollTo({ top: 350, behavior: 'smooth' });
                    }}
                    className="p-2 rounded-xl bg-white hover:bg-neutral-50 border border-copper-penny/20 text-left cursor-pointer transition-all flex items-center space-x-1.5"
                  >
                    <span>💰</span>
                    <span className="truncate">Co-op Wealth</span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    setActiveTab('commons');
                    setCommonsSubTab('feed');
                    setCommonsSelectedTopic('all');
                    setShowSisterProfileMenu(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full py-1 text-center text-[10px] font-mono text-[#B87333] hover:underline font-bold block"
                >
                  🌿 View All Topics in The Hearth Stream →
                </button>
              </div>

              {/* 3. SANCTUARY SETTINGS & COMMUNITY ENERGY SECTION */}
              <div className="p-3.5 bg-white rounded-2xl border border-copper-penny/20 shadow-2xs space-y-3">
                <div className="flex items-center space-x-2 border-b border-copper-penny/10 pb-2">
                  <Settings className="w-4 h-4 text-copper-penny" />
                  <span className="font-serif font-black text-xs text-[#1F1813]">
                    Sanctuary Settings &amp; Atmosphere
                  </span>
                </div>

                {/* Community Energy Selector (Hearth Moods) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span className="font-bold text-gray-500 uppercase flex items-center space-x-1">
                      <span>☀️</span>
                      <span>Community Energy:</span>
                    </span>
                    <span className="text-[#B87333] font-bold">{activeHearth.name}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 font-mono text-[10px]">
                    {Object.values(HEARTH_MOODS).map((mood) => {
                      const isCurrent = hearthMood === mood.id;
                      return (
                        <button
                          key={mood.id}
                          type="button"
                          onClick={() => handleSelectHearthMood(mood.id as HearthMoodId)}
                          className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex items-center space-x-1.5 ${
                            isCurrent
                              ? 'bg-[#1F1813] text-[#D4AF37] border-[#D4AF37] shadow-xs font-bold'
                              : 'bg-[#FAF5EE] hover:bg-[#F3EADF] text-[#1F1813] border-copper-penny/20'
                          }`}
                        >
                          <span>{mood.emoji}</span>
                          <div className="min-w-0 flex-1">
                            <div className="truncate font-sans font-bold text-[10px]">{mood.name}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[9px] font-sans text-gray-500 italic leading-snug">
                    {activeHearth.tagline}
                  </p>
                </div>

                {/* Regional State Circle */}
                <div className="flex items-center justify-between pt-2 border-t border-copper-penny/10 font-mono text-[10px]">
                  <span className="text-gray-500 uppercase font-bold">State Circle:</span>
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="bg-[#FAF5EE] border border-copper-penny/20 rounded-lg px-2 py-1 text-[10px] font-bold text-[#1F1813] cursor-pointer"
                  >
                    <option value="GA">Georgia (GA)</option>
                    <option value="NC">North Carolina (NC)</option>
                    <option value="SC">South Carolina (SC)</option>
                    <option value="TX">Texas (TX)</option>
                    <option value="FL">Florida (FL)</option>
                    <option value="VA">Virginia (VA)</option>
                    <option value="AL">Alabama (AL)</option>
                    <option value="MD">Maryland (MD)</option>
                    <option value="CA">California (CA)</option>
                  </select>
                </div>

                {/* Stay Logged In Toggle Option */}
                <div className="flex items-center justify-between pt-2 border-t border-copper-penny/10">
                  <div>
                    <span className="text-[11px] font-bold text-[#1F1813] block">Stay Logged In</span>
                    <span className="text-[9px] font-mono text-gray-500">Persist session across restarts</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={stayLoggedIn}
                      onChange={() => {
                        const next = !stayLoggedIn;
                        setStayLoggedIn(next);
                        try {
                          localStorage.setItem('copper_mommies_stay_logged_in', next ? 'true' : 'false');
                        } catch (e) {}
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#B87333]"></div>
                  </label>
                </div>
              </div>

              {/* ADMIN-ONLY VIEWING MODE SWITCHER - ONLY VISIBLE TO ADMIN */}
              {simulatedRole === 'admin' ? (
                <div className="space-y-2 pt-3 border-t border-copper-penny/20">
                  <span className="text-[10px] font-mono uppercase font-bold text-amber-900 block flex items-center space-x-1">
                    <span>👑</span>
                    <span>Admin Viewing Mode Switcher:</span>
                  </span>
                  <div className="grid grid-cols-2 gap-2 font-mono text-[10px]">
                    <button
                      onClick={() => {
                        setSimulatedRole('approved');
                        setShowSisterProfileMenu(false);
                      }}
                      className={`p-2.5 rounded-xl border text-left font-bold transition-all cursor-pointer ${
                        simulatedRole === 'approved' ? 'bg-[#D4AF37] text-[#1F1813] border-[#D4AF37]' : 'bg-white hover:bg-neutral-50 border-copper-penny/20 text-[#1F1813]'
                      }`}
                    >
                      🕊️ Verified Mother
                    </button>
                    <button
                      onClick={() => {
                        setSimulatedRole('admin');
                        setActiveTab('admin');
                        setShowSisterProfileMenu(false);
                      }}
                      className={`p-2.5 rounded-xl border text-left font-bold transition-all cursor-pointer ${
                        simulatedRole === 'admin' ? 'bg-[#D4AF37] text-[#1F1813] border-[#D4AF37]' : 'bg-white hover:bg-neutral-50 border-copper-penny/20 text-[#1F1813]'
                      }`}
                    >
                      👵 Circle Lead
                    </button>
                    <button
                      onClick={() => {
                        setSimulatedRole('applicant');
                        setActiveTab('landing');
                        setShowSisterProfileMenu(false);
                      }}
                      className={`p-2.5 rounded-xl border text-left font-bold transition-all cursor-pointer ${
                        simulatedRole === 'applicant' ? 'bg-[#D4AF37] text-[#1F1813] border-[#D4AF37]' : 'bg-white hover:bg-neutral-50 border-copper-penny/20 text-[#1F1813]'
                      }`}
                    >
                      🌱 Seeking Sister
                    </button>
                    <button
                      onClick={() => {
                        setSimulatedRole('representative');
                        setShowSisterProfileMenu(false);
                      }}
                      className={`p-2.5 rounded-xl border text-left font-bold transition-all cursor-pointer ${
                        simulatedRole === 'representative' ? 'bg-[#D4AF37] text-[#1F1813] border-[#D4AF37]' : 'bg-white hover:bg-neutral-50 border-copper-penny/20 text-[#1F1813]'
                      }`}
                    >
                      👑 Circle Host
                    </button>
                  </div>
                  
                  <button
                    onClick={() => {
                      setActiveTab('admin');
                      setShowSisterProfileMenu(false);
                    }}
                    className="w-full mt-2 py-2.5 bg-[#1F140E] hover:bg-[#2A1D16] text-[#D4AF37] font-mono text-xs font-bold rounded-xl flex items-center justify-center space-x-2 border border-[#D4AF37]/50 shadow-md cursor-pointer transition-all"
                  >
                    <span>👵 Open Admin Office</span>
                  </button>
                </div>
              ) : (
                <div className="pt-2 border-t border-copper-penny/20">
                  <button
                    onClick={() => {
                      setShowSisterProfileMenu(false);
                      setShowAdminLoginModal(true);
                    }}
                    className="w-full py-2.5 bg-white hover:bg-neutral-50 text-gray-700 hover:text-[#1F1813] font-mono text-[11px] rounded-xl flex items-center justify-center space-x-1.5 cursor-pointer border border-copper-penny/20"
                  >
                    <Lock className="w-3.5 h-3.5 text-copper-penny" />
                    <span>Admin Office Access</span>
                  </button>
                </div>
              )}
            </div>

            {/* Footer / Session Actions */}
            <div className="pt-4 mt-6 border-t border-copper-penny/20 flex items-center justify-between text-xs font-sans">
              <button
                onClick={() => {
                  setSimulatedRole('applicant');
                  setActiveTab('landing');
                  setShowSisterProfileMenu(false);
                }}
                className="text-rose-700 hover:text-rose-900 font-bold cursor-pointer flex items-center space-x-1 px-2 py-1 rounded-lg hover:bg-rose-50 transition-colors"
              >
                <span>🚪</span>
                <span>Sign Out</span>
              </button>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent('copper_open_pwa_guide'));
                    setShowSisterProfileMenu(false);
                  }}
                  className="text-soft-sage hover:text-copper-penny cursor-pointer font-mono text-[11px] hover:underline"
                >
                  📲 Install App
                </button>
                <button
                  onClick={() => {
                    setShowGlobalSupportModal(true);
                    setShowSisterProfileMenu(false);
                  }}
                  className="text-amber-900 hover:text-amber-950 font-bold font-mono text-[11px] bg-amber-100/80 px-2 py-1 rounded-lg border border-amber-300/60"
                >
                  💝 Support
                </button>
              </div>
            </div>

          </aside>
        </div>,
        document.body
      )}

      {/* Floating Dark Bronze Back to Top Button */}
      <ScrollToTopButton />

    </div>
  );
}
