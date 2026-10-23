import React, { useState, useRef, useEffect } from 'react';
import { 
  User, 
  MapPin, 
  Globe, 
  Home, 
  Edit3, 
  Plus, 
  Bookmark, 
  Calendar, 
  Heart, 
  Building, 
  Users, 
  MessageSquare, 
  Share2, 
  ArrowRight, 
  Award, 
  Coins, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  Eye, 
  Sparkles, 
  Trash2, 
  ExternalLink,
  ChevronRight,
  Send,
  Camera,
  Layers,
  GraduationCap,
  Scale,
  DollarSign,
  FileText,
  Lock,
  ThumbsUp,
  Tag,
  Check,
  Search,
  MoreVertical,
  BellOff,
  EyeOff,
  UserX,
  ShieldAlert,
  Image as ImageIcon,
  CheckSquare,
  Square,
  X,
  Copy,
  CornerUpLeft,
  Pin,
  Smile,
  CheckCheck,
  Handshake,
  RefreshCw
} from 'lucide-react';
import { SavedCommonsItem, TimeCreditLog, DirectChatThread, ChatMember, DirectChatMessage, BusinessAdSubmission } from '../types';
import { INITIAL_CHAT_MEMBERS, INITIAL_DIRECT_CHAT_THREADS } from '../data/initialDirectChats';
import { getStoredTrades, MultiStageTrade, completeTradeHandshake } from '../data/unifiedMarketplaceStore';

const HUB_NAME_MAP: Record<string, string> = {
  landing: 'Home / Sanctuary Overview',
  commons: 'Village Commons',
  academy: 'Mothers Academy',
  economy: 'Cooperative Economy & Barter',
  commerce: 'Sister Enterprises & Micro-Grants',
  healing: 'Apothecary & Healing Sanctum',
  village: 'Education & Village Care Hub',
  gathering: 'The Copper Circle & Gatherings',
  audio: 'Audio Sanctuary Lounge',
  kinship: 'Kinship Vault & Lineage Archives',
  treasury: 'Sovereign Treasury Hub',
  advertise: 'Sponsor Advertising Portal',
  profile: 'Member Profile Hub',
  vetting: 'Sisterhood Vetting Portal',
  admin: 'Founder Admin Office'
};

interface MemberProfileHubProps {
  userName: string;
  userEmail?: string;
  selectedState: string;
  generosityScore: number;
  tradeBalance: number;
  timeBalance: number;
  timeLogs?: TimeCreditLog[];
  savedItems: SavedCommonsItem[];
  chatThreads?: DirectChatThread[];
  chatMembers?: ChatMember[];
  onSendMessage?: (threadId: string, text: string) => void;
  onCreateNewChat?: (participantId: string, initialMessage?: string) => void;
  onRemoveSavedItem: (id: string) => void;
  onSelectSavedItem: (item: SavedCommonsItem) => void;
  onNavigateToTab: (tab: string) => void;
  onUpdateProfileName?: (name: string) => void;
  onAddLedgerLog?: (activity: string, hours: number, type: 'earn' | 'spend') => void;
  initialChatThreadId?: string | null;
  initialProfileTab?: 'overview' | 'chats' | 'bookmarks' | 'posts' | 'events' | 'faves' | 'groups' | 'ledger' | 'trades' | 'ads';
  lastVisitedTab?: string | null;
  onReturnToLastVisitedTab?: () => void;
}

export default function MemberProfileHub({
  userName,
  userEmail = 'shantrecetogetherwewin@gmail.com',
  selectedState,
  generosityScore,
  tradeBalance,
  timeBalance,
  timeLogs = [],
  savedItems,
  chatThreads: propChatThreads,
  chatMembers: propChatMembers,
  onSendMessage: propOnSendMessage,
  onCreateNewChat: propOnCreateNewChat,
  onRemoveSavedItem,
  onSelectSavedItem,
  onNavigateToTab,
  onUpdateProfileName,
  onAddLedgerLog,
  initialChatThreadId,
  initialProfileTab,
  lastVisitedTab,
  onReturnToLastVisitedTab
}: MemberProfileHubProps) {
  
  // Active subview within profile
  const [activeProfileTab, setActiveProfileTab] = useState<'overview' | 'chats' | 'bookmarks' | 'posts' | 'events' | 'faves' | 'groups' | 'ledger' | 'trades' | 'ads'>(initialProfileTab || 'overview');

  useEffect(() => {
    if (initialProfileTab) {
      setActiveProfileTab(initialProfileTab);
    }
  }, [initialProfileTab]);
  
  // Profile editable info
  const [displayName, setDisplayName] = useState(userName || 'Shantrece Clark');
  const [bio, setBio] = useState('Long-time SW Atlanta homeowner, home educator, and creator. Focused on family wealth, homeschooling grades 3–5, building independent community resources, and sustainable living. Always happy to connect with good neighbors!');
  const [website, setWebsite] = useState('https://clarkworkscustoms.com');
  const [hometown, setHometown] = useState('Atlanta, GA');
  const [neighborhood, setNeighborhood] = useState('Venetian Hills / Cascade');
  const [memberSince] = useState('Founding Mother • Member since Jan 2026');
  const [lineageRoots, setLineageRoots] = useState('Fulton County, GA & Sea Island, SC Lineage');
  const [homeschoolPod, setHomeschoolPod] = useState('Grades 3 & 4 (Elementary Math, Reading & Botany)');
  
  // Stay logged in preference (synced with localStorage)
  const [stayLoggedIn, setStayLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem('copper_mommies_stay_logged_in') !== 'false';
    } catch {
      return true;
    }
  });

  const handleToggleStayLoggedIn = () => {
    const newVal = !stayLoggedIn;
    setStayLoggedIn(newVal);
    try {
      localStorage.setItem('copper_mommies_stay_logged_in', newVal ? 'true' : 'false');
    } catch (e) {
      console.error(e);
    }
  };

  // Interests tags
  const [interests, setInterests] = useState<string[]>([
    'Homeschooling Grades 3–5',
    'Permaculture & Heirloom Seeds',
    'Family Herbal Wellness',
    'Independent Land Protection',
    'Artisan Sourdough & Kitchen Craft',
    'Time Banking Co-ops'
  ]);
  const [newInterestInput, setNewInterestInput] = useState('');

  // ----------------------------------------------------
  // ACTIVE TRADES & BARTER HANDSHAKES STATE
  // ----------------------------------------------------
  const [activeTrades, setActiveTrades] = useState<MultiStageTrade[]>(() => {
    return getStoredTrades();
  });

  useEffect(() => {
    const handleSyncTrades = () => {
      setActiveTrades(getStoredTrades());
    };
    window.addEventListener('copper_marketplace_sync', handleSyncTrades);
    return () => window.removeEventListener('copper_marketplace_sync', handleSyncTrades);
  }, []);

  const handleCompleteTrade = (tradeId: string) => {
    completeTradeHandshake(tradeId);
    setActiveTrades(getStoredTrades());
    showToast('Handshake completed! Time credit transfer recorded in Sovereign Ledger.');
  };

  // ----------------------------------------------------
  // MEMBER AD SUBMISSIONS STATE
  // ----------------------------------------------------
  const [memberAds, setMemberAds] = useState<BusinessAdSubmission[]>(() => {
    try {
      const stored = localStorage.getItem('copper_business_ad_submissions');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'ad-sub-sample-1',
        businessName: 'ClarkWorks Customs & Artisan Woodcraft',
        ownerName: 'Shantrece Clark',
        email: 'shantrecetogetherwewin@gmail.com',
        websiteUrl: 'https://clarkworkscustoms.com',
        placementType: 'both_bundle',
        bannerImageUrl: '/nestbright_banner.jpg',
        headline: 'Handcrafted Cedar Raised Beds & Sourdough Proofing Boxes',
        tagline: 'Built with non-toxic timber by long-time SW Atlanta homeowner & homeschool mother.',
        description: 'Custom cabinetry, homeschool study desks, and organic soil planters.',
        callToActionText: 'Claim Sister Discount',
        exclusiveDiscountCode: 'COPPER10',
        discountOfferText: '10% off custom orders for verified Copper Mommies',
        pricingTier: 'bundle_monthly',
        pricingAmount: '$65/mo (Header + Sidebar Bundle)',
        singleMelanatedWomanOwnedConfirmed: true,
        status: 'approved_live',
        submittedAt: 'Jan 10, 2026',
        approvedAt: 'Jan 11, 2026',
        viewsCount: 1420,
        clicksCount: 184
      }
    ];
  });

  useEffect(() => {
    const handleSyncAds = () => {
      try {
        const stored = localStorage.getItem('copper_business_ad_submissions');
        if (stored) setMemberAds(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
    };
    window.addEventListener('copper_ads_updated', handleSyncAds);
    return () => window.removeEventListener('copper_ads_updated', handleSyncAds);
  }, []);

  // ----------------------------------------------------
  // DIRECT CHATS & MESSAGES STATE (NEXTDOOR STYLE)
  // ----------------------------------------------------
  const [chatThreads, setChatThreads] = useState<DirectChatThread[]>(propChatThreads || INITIAL_DIRECT_CHAT_THREADS);
  const [chatMembers] = useState<ChatMember[]>(propChatMembers || INITIAL_CHAT_MEMBERS);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(initialChatThreadId || 'chat-reginald');
  const [chatFilter, setChatFilter] = useState<'all' | 'dm' | 'housing'>('all');
  const [chatSearchQuery, setChatSearchQuery] = useState('');
  
  // Create Chat Modal State (Screenshots 2 & 3)
  const [isCreateChatModalOpen, setIsCreateChatModalOpen] = useState(false);
  const [createChatSearch, setCreateChatSearch] = useState('');
  const [selectedRecipientId, setSelectedRecipientId] = useState<string | null>('user-reginald');
  const [createChatInitialText, setCreateChatInitialText] = useState('');

  // Chat conversation UI state
  const [chatMessageText, setChatMessageText] = useState('');
  const [showChatOptionsDropdown, setShowChatOptionsDropdown] = useState(false);
  const [chatToast, setChatToast] = useState<string | null>(null);
  const chatMessagesEndRef = useRef<HTMLDivElement | null>(null);
  const chatScrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Message 3-dots active menu & edit state
  const [activeMsgMenuId, setActiveMsgMenuId] = useState<string | null>(null);
  const [editingMsgId, setEditingMsgId] = useState<string | null>(null);
  const [editingMsgText, setEditingMsgText] = useState('');
  const [replyingToMsg, setReplyingToMsg] = useState<DirectChatMessage | null>(null);

  const activeThread = chatThreads.find(t => t.id === activeThreadId) || (chatThreads.length > 0 ? chatThreads[0] : null);

  useEffect(() => {
    if (activeThread && chatScrollContainerRef.current) {
      chatScrollContainerRef.current.scrollTop = chatScrollContainerRef.current.scrollHeight;
    }
  }, [activeThreadId, activeThread?.messages]);

  const showToast = (msg: string) => {
    setChatToast(msg);
    setTimeout(() => setChatToast(null), 3000);
  };

  const handleCopyMsg = (text: string) => {
    navigator.clipboard?.writeText(text);
    showToast('Message text copied');
    setActiveMsgMenuId(null);
  };

  const handleStartEditMsg = (msg: DirectChatMessage) => {
    setEditingMsgId(msg.id);
    setEditingMsgText(msg.text);
    setActiveMsgMenuId(null);
  };

  const handleSaveEditMsg = (msgId: string) => {
    if (!editingMsgText.trim() || !activeThread) return;
    setChatThreads(prev => prev.map(t => {
      if (t.id === activeThread.id) {
        return {
          ...t,
          messages: t.messages.map(m => m.id === msgId ? { ...m, text: editingMsgText.trim(), isEdited: true } : m)
        };
      }
      return t;
    }));
    setEditingMsgId(null);
    setEditingMsgText('');
    showToast('Message edited');
  };

  const handleDeleteMsg = (msgId: string) => {
    if (!activeThread) return;
    setChatThreads(prev => prev.map(t => {
      if (t.id === activeThread.id) {
        return {
          ...t,
          messages: t.messages.filter(m => m.id !== msgId)
        };
      }
      return t;
    }));
    setActiveMsgMenuId(null);
    showToast('Message deleted');
  };

  const handlePinMsg = (msgId: string) => {
    if (!activeThread) return;
    setChatThreads(prev => prev.map(t => {
      if (t.id === activeThread.id) {
        return {
          ...t,
          messages: t.messages.map(m => m.id === msgId ? { ...m, isPinned: !m.isPinned } : m)
        };
      }
      return t;
    }));
    setActiveMsgMenuId(null);
    showToast('Pinned state toggled');
  };

  const handleReactMsg = (msgId: string, emoji: string) => {
    if (!activeThread) return;
    setChatThreads(prev => prev.map(t => {
      if (t.id === activeThread.id) {
        return {
          ...t,
          messages: t.messages.map(m => {
            if (m.id === msgId) {
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
    }));
    setActiveMsgMenuId(null);
    showToast(`Reacted with ${emoji}`);
  };

  const handleSendDirectMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessageText.trim() || !activeThread) return;

    const newMsg: DirectChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'me',
      senderName: displayName,
      senderAvatar: '/coppermommies-selflove1-cmc.jpg',
      text: chatMessageText.trim(),
      timestamp: 'Just now',
      isMe: true,
      replyTo: replyingToMsg ? {
        id: replyingToMsg.id,
        text: replyingToMsg.text,
        senderName: replyingToMsg.senderName
      } : undefined
    };

    setChatThreads(prev => prev.map(t => {
      if (t.id === activeThread.id) {
        return {
          ...t,
          lastMessage: `You: ${chatMessageText.trim()}`,
          lastMessageTime: 'Just now',
          messages: [...t.messages, newMsg]
        };
      }
      return t;
    }));

    if (propOnSendMessage) {
      propOnSendMessage(activeThread.id, chatMessageText.trim());
    }

    setChatMessageText('');
    setReplyingToMsg(null);
  };

  const handleCreateNewChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecipientId) return;

    const targetMember = chatMembers.find(m => m.id === selectedRecipientId);
    if (!targetMember) return;

    // Check if thread already exists
    const existingThread = chatThreads.find(t => t.participantId === targetMember.id);
    if (existingThread) {
      setActiveThreadId(existingThread.id);
      setIsCreateChatModalOpen(false);
      setActiveProfileTab('chats');
      return;
    }

    const newThread: DirectChatThread = {
      id: `chat-${Date.now()}`,
      participantId: targetMember.id,
      participantName: targetMember.name,
      participantAvatar: targetMember.avatar,
      participantNeighborhood: targetMember.neighborhood,
      category: 'dm',
      originSectionLabel: 'Direct Sister Message',
      lastMessage: createChatInitialText.trim() ? `You: ${createChatInitialText.trim()}` : 'Conversation started',
      lastMessageTime: 'Just now',
      unreadCount: 0,
      messages: createChatInitialText.trim() ? [
        {
          id: `m-${Date.now()}`,
          senderId: 'me',
          senderName: displayName,
          senderAvatar: '/coppermommies-selflove1-cmc.jpg',
          text: createChatInitialText.trim(),
          timestamp: 'Just now',
          isMe: true
        }
      ] : []
    };

    setChatThreads([newThread, ...chatThreads]);
    setActiveThreadId(newThread.id);
    setIsCreateChatModalOpen(false);
    setSelectedRecipientId(null);
    setCreateChatInitialText('');
    setActiveProfileTab('chats');
    showToast(`Chat created with ${targetMember.name}`);
  };

  const filteredThreads = chatThreads.filter(t => {
    const matchesFilter = 
      chatFilter === 'all' || 
      (chatFilter === 'dm' && t.category === 'dm') ||
      (chatFilter === 'housing' && (t.category === 'housing' || t.category === 'exchange'));
    
    const matchesSearch = 
      t.participantName.toLowerCase().includes(chatSearchQuery.toLowerCase()) ||
      t.lastMessage.toLowerCase().includes(chatSearchQuery.toLowerCase()) ||
      t.participantNeighborhood.toLowerCase().includes(chatSearchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const filteredSuggestedMembers = chatMembers.filter(m => 
    m.name.toLowerCase().includes(createChatSearch.toLowerCase()) ||
    m.neighborhood.toLowerCase().includes(createChatSearch.toLowerCase())
  );

  // Modals & form state
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isAddBusinessOpen, setIsAddBusinessOpen] = useState(false);
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
  const [isNewTradeModalOpen, setIsNewTradeModalOpen] = useState(false);
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
  
  // Sisterhood Referral & Growth Analytics State
  const [memberReferrals, setMemberReferrals] = useState<Array<{
    id: string;
    code: string;
    link: string;
    createdAt: string;
    status: 'active' | 'claimed';
    analyticsSource: string;
  }>>(() => {
    try {
      const stored = localStorage.getItem('copper_member_referrals');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'ref-default-1',
        code: 'CMC-REF-90412-VILLAGE',
        link: 'https://coppermommies.co/apply?ref=CMC-REF-90412-VILLAGE',
        createdAt: 'Jan 15, 2026',
        status: 'claimed',
        analyticsSource: 'Member Profile Hub • Shantrece Clark'
      }
    ];
  });
  const [copiedReferralId, setCopiedReferralId] = useState<string | null>(null);

  const handleGenerateReferralLink = () => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const newCode = `CMC-REF-${randomNum}-SISTER`;
    const newLink = `https://coppermommies.co/apply?ref=${newCode}`;
    const newRecord = {
      id: `ref-${Date.now()}`,
      code: newCode,
      link: newLink,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'active' as const,
      analyticsSource: `Member Profile Hub • ${displayName}`
    };

    const updated = [newRecord, ...memberReferrals];
    setMemberReferrals(updated);
    try {
      localStorage.setItem('copper_member_referrals', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    showToast('New one-time Sisterhood referral link generated & tracked!');
  };

  const handleCopyReferralLink = (id: string, link: string) => {
    navigator.clipboard?.writeText(link);
    setCopiedReferralId(id);
    setTimeout(() => setCopiedReferralId(null), 2500);
    showToast('Referral link copied to clipboard!');
  };
  
  // New Business Form State
  const [newBizName, setNewBizName] = useState('');
  const [newBizCategory, setNewBizCategory] = useState('Creative & Artisan');
  const [newBizDesc, setNewBizDesc] = useState('');
  const [newBizPerk, setNewBizPerk] = useState('10% Member Discount or Barter Hours Accepted');

  // New Post Form State
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTags, setNewPostTags] = useState('Homestead Advice, Question');
  const [newPostCategory, setNewPostCategory] = useState('Discussion');

  // New Ledger Log Form State
  const [ledgerActivity, setLedgerActivity] = useState('');
  const [ledgerHours, setLedgerHours] = useState('2');
  const [ledgerType, setLedgerType] = useState<'earn' | 'spend'>('earn');

  // Filter for Saved Items
  const [savedFilter, setSavedFilter] = useState<'all' | 'exchange' | 'housing' | 'business'>('all');

  // User's own posts list
  const [userPosts, setUserPosts] = useState([
    {
      id: 'my-post-1',
      date: '1 day ago',
      category: 'Recommendation',
      content: 'Reggie over at ClarkWorks Customs is fantastic! He is meticulous, dependable, and always takes his time to make sure the work is done right and the area is completely cleaned up afterward. Highly recommend him to any sister needing repair or custom shelving work done!',
      tags: ['Quality Work', 'Professionalism', 'Great Value'],
      favedBiz: 'ClarkWorks Customs',
      location: 'Atlanta, GA',
      views: 592,
      reactions: 34,
      isLiked: true,
      commentsCount: 2,
      comments: [
        { author: 'Sister Nia', text: 'Thank you for this recommendation! Just reached out for our porch repair.', time: '18h ago' },
        { author: 'Mama Keisha', text: 'Good honest help is pure gold for our households.', time: '12h ago' }
      ]
    },
    {
      id: 'my-post-2',
      date: '18 Sep',
      category: 'Question',
      content: 'Hey sisters! Quick question—do you have a go-to local source for chemical-free hardwood lumber or seasoned oak for garden raised beds? Starting our autumn planting this weekend with the children!',
      tags: ['Homestead Advice', 'Garden Raised Beds', 'Homeschool Science'],
      location: 'Venetian Hills • Atlanta',
      views: 412,
      reactions: 26,
      isLiked: false,
      commentsCount: 1,
      comments: [
        { author: 'Mama Danielle', text: 'Check with Brother Marcus over at North Georgia Timber Co-op. 100% untreated.', time: 'Sep 19' }
      ]
    }
  ]);

  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  const handleToggleLikePost = (postId: string) => {
    setUserPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const nextLiked = !p.isLiked;
        return {
          ...p,
          isLiked: nextLiked,
          reactions: nextLiked ? p.reactions + 1 : Math.max(0, p.reactions - 1)
        };
      }
      return p;
    }));
  };

  const handleAddComment = (postId: string) => {
    if (!commentText.trim()) return;
    setUserPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          commentsCount: p.commentsCount + 1,
          comments: [...p.comments, { author: displayName, text: commentText.trim(), time: 'Just now' }]
        };
      }
      return p;
    }));
    setCommentText('');
    setActiveCommentPostId(null);
  };

  const handleCreateNewPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const tagsArray = newPostTags
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const newPostObj = {
      id: `my-post-${Date.now()}`,
      date: 'Just now',
      category: newPostCategory,
      content: newPostContent.trim(),
      tags: tagsArray.length > 0 ? tagsArray : ['Community Update'],
      location: `${hometown}`,
      views: 1,
      reactions: 1,
      isLiked: true,
      commentsCount: 0,
      comments: []
    };

    setUserPosts([newPostObj, ...userPosts]);
    setNewPostContent('');
    setNewPostTags('');
    setIsNewPostModalOpen(false);
    setActiveProfileTab('posts');
  };

  const handleAddInterest = (e: React.FormEvent) => {
    e.preventDefault();
    if (newInterestInput.trim() && !interests.includes(newInterestInput.trim())) {
      setInterests([...interests, newInterestInput.trim()]);
      setNewInterestInput('');
    }
  };

  const handleRemoveInterest = (item: string) => {
    setInterests(interests.filter(i => i !== item));
  };

  // Favorited sister businesses
  const [favedBusinesses, setFavedBusinesses] = useState([
    {
      id: 'fav-1',
      name: 'ClarkWorks Customs',
      category: 'Home & Artisan Woodwork',
      location: 'Atlanta, GA',
      rating: '5.0 (42 reviews)',
      image: '/coppermommies-selflove1-cmc.jpg',
      perk: '10% Member Discount or Barter Hours Accepted'
    },
    {
      id: 'fav-2',
      name: 'Roots & Resilience Master Apothecary',
      category: 'Holistic Health & Herbs',
      location: 'Atlanta, GA',
      rating: '5.0 (56 reviews)',
      image: '/apothecary_sister_herbal.jpg',
      perk: '15% Off with code COPPERMOMMIE'
    },
    {
      id: 'fav-3',
      name: 'Gullah Sea Island Vitality Guild',
      category: 'Ancestral Botanicals & Teas',
      location: 'Charleston, SC',
      rating: '4.9 (38 reviews)',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
      perk: 'Complimentary shipping for Circle Members'
    }
  ]);

  // Joined groups, forums and circles
  const [joinedGroups, setJoinedGroups] = useState([
    { 
      id: 'grp-1', 
      name: 'Metro Atlanta Homeschool Co-op (Grades 3–5)', 
      members: 38, 
      icon: '📚', 
      role: 'Active Co-Op Host', 
      isJoined: true,
      description: 'Weekly math manipulative labs, living books literature circles, and science exploration.'
    },
    { 
      id: 'grp-2', 
      name: 'Georgia Organic Seed & Soil Guild', 
      members: 64, 
      icon: '🌱', 
      role: 'Seed Steward', 
      isJoined: true,
      description: 'Preserving non-GMO heritage collard greens, okra, sweet potato slips, and compost sharing.'
    },
    { 
      id: 'grp-3', 
      name: 'Maternal Lying-In & Doula Care Pod', 
      members: 29, 
      icon: '🕊️', 
      role: 'Circle Contributor', 
      isJoined: true,
      description: '40-day postpartum nourishment meals, herbal sitz baths, and infant holding rotations.'
    },
    { 
      id: 'grp-4', 
      name: 'Private Family Land & Homestead Protection', 
      members: 52, 
      icon: '🏡', 
      role: 'Member', 
      isJoined: true,
      description: 'Private estate planning, heir property defense, well-water security, and off-grid tips.'
    },
    { 
      id: 'grp-5', 
      name: 'Ancestral Sourdough & Kitchen Apothecary', 
      members: 41, 
      icon: '🍞', 
      role: 'Active Member', 
      isJoined: true,
      description: 'Wild yeast sourdough starters, bone broths, fire ciders, and natural fermentation.'
    }
  ]);

  const handleToggleJoinGroup = (groupId: string) => {
    setJoinedGroups(prev => prev.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          isJoined: !g.isJoined,
          members: !g.isJoined ? g.members + 1 : Math.max(1, g.members - 1)
        };
      }
      return g;
    }));
  };

  // Upcoming RSVPs
  const [rsvpEvents, setRsvpEvents] = useState([
    {
      id: 'ev-1',
      title: 'Autumn Equinox Seed Swap & Sister Gathering',
      date: 'Saturday, Oct 10, 2026 • 11:00 AM',
      location: 'West River Nature Preserve, Atlanta, GA',
      status: 'Attending (RSVP Confirmed)',
      badge: 'In-Person Circle'
    },
    {
      id: 'ev-2',
      title: 'The Casual Corner Talk Live: Motherhood Peace & Family Wealth',
      date: 'Thursday, Oct 15, 2026 • 7:00 PM EST',
      location: 'Live Audio Lounge • Audio Only',
      status: 'RSVP Confirmed',
      badge: 'Virtual Audio Lounge'
    },
    {
      id: 'ev-3',
      title: 'Grade 3–5 Math & Reading Co-Op Showcase',
      date: 'Tuesday, Oct 20, 2026 • 2:00 PM EST',
      location: 'NestBright Co-op Academy Portal',
      status: 'Attending',
      badge: 'Homeschool Co-Op'
    }
  ]);

  // Filtered Saved Items
  const filteredSavedItems = savedItems.filter(item => {
    if (savedFilter === 'all') return true;
    return item.type === savedFilter;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-16">
      
      {/* Return to Previous Hub Breadcrumb */}
      {lastVisitedTab && onReturnToLastVisitedTab && (
        <div className="flex items-center justify-between font-mono text-xs animate-fade-in py-1">
          <div className="flex items-center space-x-2 text-soft-sage text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="hidden sm:inline">Navigated from <strong className="text-[#1F1813] font-serif">{HUB_NAME_MAP[lastVisitedTab] || lastVisitedTab}</strong></span>
          </div>
          <button
            type="button"
            id="profile-return-to-last-hub-btn"
            onClick={onReturnToLastVisitedTab}
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-[#1F140E]/95 hover:bg-[#2A1D16] text-[#FAF5EE] hover:text-[#D4AF37] rounded-full font-mono text-xs font-extrabold uppercase tracking-wider border border-[#B2838E]/60 hover:border-[#D4AF37] shadow-xs transition-all cursor-pointer active:scale-95 shrink-0"
          >
            <CornerUpLeft className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>↩ Back to {HUB_NAME_MAP[lastVisitedTab] || lastVisitedTab}</span>
          </button>
        </div>
      )}

      {/* Toast popup */}
      {chatToast && (
        <div className="fixed top-20 right-6 z-50 bg-[#1F140E] text-[#FAF5EE] text-xs font-mono px-4 py-2 rounded-2xl border border-[#D4AF37] shadow-2xl animate-fade-in flex items-center space-x-2">
          <span>🕊️</span>
          <span>{chatToast}</span>
        </div>
      )}

      {/* ==================================================== */}
      {/* 1. TOP PROFILE HEADER CARD (NEXTDOOR STYLE)          */}
      {/* ==================================================== */}
      <div className="bg-white border-2 border-copper-penny/25 rounded-3xl shadow-md overflow-hidden relative">
        
        {/* Cover Photo Banner */}
        <div className="h-40 sm:h-52 bg-gradient-to-r from-[#2A1D16] via-[#B87333] to-[#D4AF37] relative flex items-end p-4">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#FAF5EE_1px,transparent_1px)] [background-size:16px_16px]" />
          
          {/* Cover Photo Action */}
          <button 
            onClick={() => setIsEditProfileOpen(true)}
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/75 text-white px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 backdrop-blur-xs border border-white/20 transition-all cursor-pointer shadow-sm"
            title="Edit profile & preferences"
          >
            <Camera className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Edit Profile &amp; Settings</span>
          </button>
        </div>

        {/* Profile Info Bar */}
        <div className="px-6 sm:px-8 pb-6 pt-0 relative">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 sm:-mt-20 gap-4 mb-4">
            
            {/* Avatar & Verified Badge */}
            <div className="relative">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-white shadow-xl overflow-hidden bg-[#FAF5EE]">
                <img 
                  src="/coppermommies-selflove1-cmc.jpg" 
                  alt={displayName}
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="absolute bottom-1 right-1 bg-[#D4AF37] text-[#1F1813] p-1.5 rounded-full shadow-md border-2 border-white" title="Verified Matriarch">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button 
                onClick={() => setActiveProfileTab('chats')}
                className="px-4 py-2 bg-[#1F1813] hover:bg-[#2A221B] text-[#FAF5EE] rounded-xl text-xs font-bold font-sans shadow-sm flex items-center space-x-1.5 cursor-pointer transition-all active:scale-95"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Direct Chats ({chatThreads.length})</span>
              </button>

              <button 
                onClick={() => setIsEditProfileOpen(true)}
                className="px-4 py-2 bg-[#FAF5EE] hover:bg-[#F3EADF] text-[#1F1813] border border-copper-penny/30 rounded-xl text-xs font-bold font-sans shadow-sm flex items-center space-x-1.5 cursor-pointer transition-all active:scale-95"
              >
                <Edit3 className="w-3.5 h-3.5 text-copper-penny" />
                <span>Edit Profile</span>
              </button>

              <button 
                onClick={() => setIsNewPostModalOpen(true)}
                className="px-4 py-2 bg-[#B87333] hover:bg-[#A85138] text-white rounded-xl text-xs font-bold font-sans shadow-sm flex items-center space-x-1.5 cursor-pointer transition-all active:scale-95"
              >
                <Plus className="w-3.5 h-3.5 text-white" />
                <span>New Post</span>
              </button>

              <button 
                onClick={() => setIsReferralModalOpen(true)}
                className="px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#B87333] hover:from-[#e5bd42] hover:to-[#c27c39] text-[#1F140E] rounded-xl text-xs font-bold font-sans shadow-sm flex items-center space-x-1.5 cursor-pointer transition-all active:scale-95 font-mono"
                title="Generate one-time Sisterhood referral link"
              >
                <Users className="w-3.5 h-3.5 text-[#1F140E]" />
                <span>🕊️ Sisterhood Referral</span>
              </button>
            </div>
          </div>

          {/* Name & Identity */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <h1 className="font-serif font-extrabold text-2xl sm:text-3xl text-[#1F1813]">
                {displayName}
              </h1>
              <span className="text-[10px] font-mono uppercase tracking-wider font-extrabold bg-[#D4AF37]/15 text-[#B87333] border border-[#D4AF37]/35 px-2.5 py-0.5 rounded-full">
                Verified Mother • {selectedState || 'GA'} Circle
              </span>
              <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full flex items-center space-x-1">
                <Check className="w-3 h-3" />
                <span>Staying Logged In Active</span>
              </span>
            </div>

            {/* Bio */}
            <p className="text-xs sm:text-sm text-[#2A221B]/90 max-w-3xl leading-relaxed font-sans font-medium">
              {bio}
            </p>

            {/* Personal Data Metadata Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-2 text-xs text-[#2A221B]/85 font-medium font-sans">
              
              <div className="flex items-center space-x-1.5 bg-[#FAF5EE]/70 p-2 rounded-xl border border-copper-penny/10">
                <Home className="w-3.5 h-3.5 text-soft-sage shrink-0" />
                <span className="truncate">Hometown: <strong>{hometown}</strong> ({neighborhood})</span>
              </div>

              <div className="flex items-center space-x-1.5 bg-[#FAF5EE]/70 p-2 rounded-xl border border-copper-penny/10">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span className="truncate">Homeschool: <strong>{homeschoolPod}</strong></span>
              </div>

              <div className="flex items-center space-x-1.5 bg-[#FAF5EE]/70 p-2 rounded-xl border border-copper-penny/10">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span className="truncate">Heritage: <strong>{lineageRoots}</strong></span>
              </div>

              {website && (
                <div className="flex items-center space-x-1.5 bg-[#FAF5EE]/70 p-2 rounded-xl border border-copper-penny/10">
                  <Globe className="w-3.5 h-3.5 text-copper-penny shrink-0" />
                  <a 
                    href={website} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-copper-penny hover:underline font-bold truncate"
                  >
                    {website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}

              <div className="flex items-center space-x-1.5 bg-[#FAF5EE]/70 p-2 rounded-xl border border-copper-penny/10">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className="truncate">{memberSince}</span>
              </div>

              <div className="flex items-center space-x-1.5 bg-[#FAF5EE]/70 p-2 rounded-xl border border-copper-penny/10">
                <Lock className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span className="truncate">Email: <strong>{userEmail}</strong></span>
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* 2. SUB-NAV TILES (CHATS, BOOKMARKS, POSTS, FORUMS...) */}
      {/* ==================================================== */}
      <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
        
        <button
          onClick={() => setActiveProfileTab('overview')}
          className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
            activeProfileTab === 'overview'
              ? 'bg-[#1F1813] text-[#D4AF37] border-[#D4AF37] shadow-md font-bold'
              : 'bg-white text-gray-700 border-copper-penny/20 hover:bg-[#FAF5EE]'
          }`}
        >
          <Sparkles className="w-4 h-4 mx-auto mb-1" />
          <span className="text-[11px] block font-bold truncate">Overview</span>
        </button>

        {/* CHATS TAB BUTTON */}
        <button
          onClick={() => setActiveProfileTab('chats')}
          className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer relative ${
            activeProfileTab === 'chats'
              ? 'bg-[#1F1813] text-[#D4AF37] border-[#D4AF37] shadow-md font-bold'
              : 'bg-white text-gray-700 border-copper-penny/20 hover:bg-[#FAF5EE]'
          }`}
        >
          <MessageSquare className="w-4 h-4 mx-auto mb-1 text-copper-penny" />
          <span className="text-[11px] block font-bold truncate">Chats ({chatThreads.length})</span>
          {chatThreads.some(t => t.unreadCount > 0) && (
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          )}
        </button>

        <button
          onClick={() => setActiveProfileTab('bookmarks')}
          className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
            activeProfileTab === 'bookmarks'
              ? 'bg-[#1F1813] text-[#D4AF37] border-[#D4AF37] shadow-md font-bold'
              : 'bg-white text-gray-700 border-copper-penny/20 hover:bg-[#FAF5EE]'
          }`}
        >
          <Bookmark className="w-4 h-4 mx-auto mb-1 text-copper-penny" />
          <span className="text-[11px] block font-bold truncate">Saved ({savedItems.length})</span>
        </button>

        <button
          onClick={() => setActiveProfileTab('posts')}
          className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
            activeProfileTab === 'posts'
              ? 'bg-[#1F1813] text-[#D4AF37] border-[#D4AF37] shadow-md font-bold'
              : 'bg-white text-gray-700 border-copper-penny/20 hover:bg-[#FAF5EE]'
          }`}
        >
          <Edit3 className="w-4 h-4 mx-auto mb-1 text-soft-sage" />
          <span className="text-[11px] block font-bold truncate">Posts ({userPosts.length})</span>
        </button>

        {/* TRADES TAB BUTTON */}
        <button
          onClick={() => setActiveProfileTab('trades')}
          className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer relative ${
            activeProfileTab === 'trades'
              ? 'bg-[#1F1813] text-[#D4AF37] border-[#D4AF37] shadow-md font-bold'
              : 'bg-white text-gray-700 border-copper-penny/20 hover:bg-[#FAF5EE]'
          }`}
        >
          <Handshake className="w-4 h-4 mx-auto mb-1 text-[#B87333]" />
          <span className="text-[11px] block font-bold truncate">Trades ({activeTrades.length})</span>
          {activeTrades.some(t => t.currentStage === 'agreed') && (
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          )}
        </button>

        {/* MY ADS TAB BUTTON */}
        <button
          onClick={() => setActiveProfileTab('ads')}
          className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
            activeProfileTab === 'ads'
              ? 'bg-[#1F1813] text-[#D4AF37] border-[#D4AF37] shadow-md font-bold'
              : 'bg-white text-gray-700 border-copper-penny/20 hover:bg-[#FAF5EE]'
          }`}
        >
          <Tag className="w-4 h-4 mx-auto mb-1 text-amber-600" />
          <span className="text-[11px] block font-bold truncate">My Ads ({memberAds.length})</span>
        </button>

        <button
          onClick={() => setActiveProfileTab('groups')}
          className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
            activeProfileTab === 'groups'
              ? 'bg-[#1F1813] text-[#D4AF37] border-[#D4AF37] shadow-md font-bold'
              : 'bg-white text-gray-700 border-copper-penny/20 hover:bg-[#FAF5EE]'
          }`}
        >
          <Users className="w-4 h-4 mx-auto mb-1 text-amber-700" />
          <span className="text-[11px] block font-bold truncate">Forums ({joinedGroups.filter(g => g.isJoined).length})</span>
        </button>

        <button
          onClick={() => setActiveProfileTab('faves')}
          className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
            activeProfileTab === 'faves'
              ? 'bg-[#1F1813] text-[#D4AF37] border-[#D4AF37] shadow-md font-bold'
              : 'bg-white text-gray-700 border-copper-penny/20 hover:bg-[#FAF5EE]'
          }`}
        >
          <Heart className="w-4 h-4 mx-auto mb-1 text-rose-600" />
          <span className="text-[11px] block font-bold truncate">Faves ({favedBusinesses.length})</span>
        </button>

        <button
          onClick={() => setActiveProfileTab('events')}
          className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
            activeProfileTab === 'events'
              ? 'bg-[#1F1813] text-[#D4AF37] border-[#D4AF37] shadow-md font-bold'
              : 'bg-white text-gray-700 border-copper-penny/20 hover:bg-[#FAF5EE]'
          }`}
        >
          <Calendar className="w-4 h-4 mx-auto mb-1 text-indigo-600" />
          <span className="text-[11px] block font-bold truncate">RSVPs ({rsvpEvents.length})</span>
        </button>

        <button
          onClick={() => setActiveProfileTab('ledger')}
          className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
            activeProfileTab === 'ledger'
              ? 'bg-[#1F1813] text-[#D4AF37] border-[#D4AF37] shadow-md font-bold'
              : 'bg-white text-gray-700 border-copper-penny/20 hover:bg-[#FAF5EE]'
          }`}
        >
          <Scale className="w-4 h-4 mx-auto mb-1 text-emerald-700" />
          <span className="text-[11px] block font-bold truncate">Ledger</span>
        </button>

      </div>

      {/* ==================================================== */}
      {/* 3. ACTIVE TAB CONTENT PANELS                         */}
      {/* ==================================================== */}

      {/* ---------------------------------------------------- */}
      {/* CHATS TAB (EXACTLY AS IN SCREENSHOTS 1, 2, 3, 4, 6) */}
      {/* ---------------------------------------------------- */}
      {activeProfileTab === 'chats' && (
        <div className="bg-white border-2 border-copper-penny/20 rounded-3xl shadow-sm overflow-hidden flex flex-col">
          
          {/* Main Chats Container */}
          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
            
            {/* Left Column: Chats Header, Filters & Thread List (5 Cols) */}
            <div className="md:col-span-5 border-r border-copper-penny/15 flex flex-col bg-[#FAF5EE]/40">
              
              {/* Top Controls Header */}
              <div className="p-4 border-b border-copper-penny/15 flex items-center justify-between">
                <h3 className="font-serif font-extrabold text-xl text-[#1F1813]">Chats</h3>
                
                <button
                  type="button"
                  onClick={() => setIsCreateChatModalOpen(true)}
                  className="px-3.5 py-1.5 bg-[#FAF5EE] hover:bg-[#FAF5EE]/80 text-[#1F1813] border border-copper-penny/30 rounded-xl text-xs font-bold font-sans shadow-2xs flex items-center space-x-1.5 cursor-pointer transition-all active:scale-95"
                >
                  <Edit3 className="w-3.5 h-3.5 text-copper-penny" />
                  <span>New message</span>
                </button>
              </div>

              {/* Filter Pills (Screenshot 1: All, DMs, For Sale) */}
              <div className="px-4 py-2.5 border-b border-copper-penny/10 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setChatFilter('all')}
                  className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                    chatFilter === 'all'
                      ? 'bg-[#1F1813] text-[#D4AF37] shadow-xs'
                      : 'bg-white text-gray-700 border border-copper-penny/20 hover:bg-neutral-100'
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setChatFilter('dm')}
                  className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                    chatFilter === 'dm'
                      ? 'bg-[#1F1813] text-[#D4AF37] shadow-xs'
                      : 'bg-white text-gray-700 border border-copper-penny/20 hover:bg-neutral-100'
                  }`}
                >
                  DMs
                </button>
                <button
                  type="button"
                  onClick={() => setChatFilter('housing')}
                  className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                    chatFilter === 'housing'
                      ? 'bg-[#1F1813] text-[#D4AF37] shadow-xs'
                      : 'bg-white text-gray-700 border border-copper-penny/20 hover:bg-neutral-100'
                  }`}
                >
                  Housing &amp; For Sale
                </button>
              </div>

              {/* Search Bar */}
              <div className="p-3 border-b border-copper-penny/10">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
                  <input 
                    type="text"
                    value={chatSearchQuery}
                    onChange={(e) => setChatSearchQuery(e.target.value)}
                    placeholder="Search direct chats..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-copper-penny/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                  />
                </div>
              </div>

              {/* Thread List */}
              <div className="flex-1 overflow-y-auto divide-y divide-copper-penny/10">
                {filteredThreads.length === 0 ? (
                  <div className="p-8 text-center space-y-2 text-gray-500 text-xs">
                    <p>No conversations found.</p>
                    <button
                      type="button"
                      onClick={() => setIsCreateChatModalOpen(true)}
                      className="text-copper-penny font-bold hover:underline"
                    >
                      Start a new message
                    </button>
                  </div>
                ) : (
                  filteredThreads.map(thread => {
                    const isSelected = activeThread?.id === thread.id;
                    return (
                      <div
                        key={thread.id}
                        onClick={() => setActiveThreadId(thread.id)}
                        className={`p-3.5 flex items-start space-x-3 cursor-pointer transition-all ${
                          isSelected ? 'bg-white border-l-4 border-[#B87333] shadow-xs' : 'hover:bg-white/70'
                        }`}
                      >
                        <div className="relative shrink-0">
                          <img 
                            src={thread.participantAvatar || '/coppermommies-selflove1-cmc.jpg'} 
                            alt={thread.participantName} 
                            className="w-11 h-11 rounded-full object-cover border border-copper-penny/20"
                          />
                          {thread.unreadCount > 0 && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0 space-y-0.5">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-xs sm:text-sm text-[#1F1813] truncate">
                              {thread.participantName}
                            </h4>
                            <span className="text-[10px] font-mono text-gray-400 shrink-0">
                              {thread.lastMessageTime}
                            </span>
                          </div>

                          <p className="text-xs text-gray-600 truncate leading-relaxed">
                            {thread.lastMessage}
                          </p>

                          {thread.originSectionLabel && (
                            <span className="inline-block text-[9px] font-mono font-bold text-[#B87333] bg-[#FAF5EE] px-2 py-0.5 rounded-md border border-copper-penny/15 mt-1">
                              {thread.originSectionLabel}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

            </div>

            {/* Right Column: Active Conversation Stream or Empty State (7 Cols) */}
            <div className="md:col-span-7 flex flex-col bg-white">
              
              {!activeThread ? (
                /* Empty Placeholder (Screenshot 1) */
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-[#FAF5EE] border-2 border-copper-penny/25 flex items-center justify-center text-3xl">
                    💬
                  </div>
                  <div className="space-y-1 max-w-sm">
                    <h3 className="font-serif font-bold text-lg text-[#1F1813]">Chat with neighbors &amp; sisters</h3>
                    <p className="text-xs text-gray-600">
                      Send direct private messages regarding housing havens, barter trades, heirloom seeds, or homeschool co-op plans.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsCreateChatModalOpen(true)}
                    className="px-5 py-2.5 bg-[#1F1813] text-[#FAF5EE] rounded-xl text-xs font-bold font-sans shadow-md hover:bg-[#2A221B] cursor-pointer"
                  >
                    Send a message
                  </button>
                </div>
              ) : (
                /* Active Conversation View (Screenshots 4 & 6) */
                <div className="flex-1 flex flex-col h-full">
                  
                  {/* Active Header (Recipient info + 3-dots menu) */}
                  <div className="p-3.5 border-b border-copper-penny/15 flex items-center justify-between bg-[#FAF5EE]/30">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={activeThread.participantAvatar || '/coppermommies-selflove1-cmc.jpg'} 
                        alt={activeThread.participantName} 
                        className="w-10 h-10 rounded-full object-cover border border-[#D4AF37]"
                      />
                      <div>
                        <h4 className="font-serif font-bold text-sm text-[#1F1813] leading-tight">
                          {activeThread.participantName}
                        </h4>
                        <p className="text-[11px] text-gray-500 font-mono leading-tight">
                          {activeThread.participantNeighborhood}
                        </p>
                      </div>
                    </div>

                    {/* 3-Dots Menu (Screenshot 6) */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowChatOptionsDropdown(prev => !prev)}
                        className="p-2 text-gray-500 hover:text-black hover:bg-neutral-100 rounded-xl cursor-pointer transition-colors"
                        title="Chat options"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {/* Dropdown Options */}
                      {showChatOptionsDropdown && (
                        <>
                          <div 
                            className="fixed inset-0 z-30" 
                            onClick={() => setShowChatOptionsDropdown(false)} 
                          />
                          <div className="absolute right-0 mt-1 w-48 bg-white border border-copper-penny/25 rounded-2xl shadow-xl p-1.5 z-40 text-xs font-sans space-y-1 animate-fade-in">
                            <button
                              onClick={() => {
                                showToast('Notifications muted for this chat');
                                setShowChatOptionsDropdown(false);
                              }}
                              className="w-full text-left px-3 py-2 rounded-xl hover:bg-neutral-100 flex items-center space-x-2 text-gray-700 cursor-pointer"
                            >
                              <BellOff className="w-4 h-4 text-gray-500" />
                              <span>Mute chat</span>
                            </button>
                            <button
                              onClick={() => {
                                showToast('Chat hidden from active list');
                                setShowChatOptionsDropdown(false);
                              }}
                              className="w-full text-left px-3 py-2 rounded-xl hover:bg-neutral-100 flex items-center space-x-2 text-gray-700 cursor-pointer"
                            >
                              <EyeOff className="w-4 h-4 text-gray-500" />
                              <span>Hide chat</span>
                            </button>
                            <button
                              onClick={() => {
                                showToast(`Blocked ${activeThread.participantName}`);
                                setShowChatOptionsDropdown(false);
                              }}
                              className="w-full text-left px-3 py-2 rounded-xl hover:bg-neutral-100 flex items-center space-x-2 text-rose-700 cursor-pointer"
                            >
                              <UserX className="w-4 h-4 text-rose-600" />
                              <span>Block {activeThread.participantName}</span>
                            </button>
                            <button
                              onClick={() => {
                                showToast('Report filed with Elder Moderation Council');
                                setShowChatOptionsDropdown(false);
                              }}
                              className="w-full text-left px-3 py-2 rounded-xl hover:bg-neutral-100 flex items-center space-x-2 text-gray-700 cursor-pointer"
                            >
                              <ShieldAlert className="w-4 h-4 text-amber-600" />
                              <span>Report</span>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Message Stream */}
                  <div ref={chatScrollContainerRef} className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-white">
                    
                    {/* Origin context banner */}
                    {activeThread.originSectionLabel && (
                      <div className="text-center py-2">
                        <span className="text-[10px] font-mono text-gray-600 bg-[#FAF5EE] border border-copper-penny/20 px-3 py-1 rounded-full inline-block">
                          Direct inquiry from: <strong>{activeThread.originSectionLabel}</strong>
                        </span>
                      </div>
                    )}

                    <div className="text-center py-1">
                      <span className="text-[10px] font-mono text-gray-400 uppercase">
                        9/25/26
                      </span>
                    </div>

                    {activeThread.messages.map(m => {
                      const isBeingEdited = editingMsgId === m.id;
                      const isMenuOpen = activeMsgMenuId === m.id;

                      return (
                        <div 
                          key={m.id}
                          className={`flex flex-col ${m.isMe ? 'items-end' : 'items-start'} group relative`}
                        >
                          {/* Quoted Reply Preview */}
                          {m.replyTo && (
                            <div className={`text-[10px] font-mono text-gray-500 mb-1 px-2.5 py-0.5 bg-gray-100 rounded-lg border-l-2 border-[#D4AF37] max-w-[80%] truncate ${
                              m.isMe ? 'mr-1' : 'ml-9'
                            }`}>
                              <span className="font-bold text-[#1F1813]">{m.replyTo.senderName}:</span> {m.replyTo.text}
                            </div>
                          )}

                          <div className="flex items-start space-x-2 max-w-[88%] relative">
                            {!m.isMe && (
                              <img 
                                src={m.senderAvatar || activeThread.participantAvatar || '/coppermommies-selflove1-cmc.jpg'} 
                                alt={m.senderName} 
                                className="w-7 h-7 rounded-full object-cover shrink-0 border border-copper-penny/20 mt-1"
                              />
                            )}

                            <div className="relative">
                              {isBeingEdited ? (
                                /* Inline Editing Mode */
                                <div className="p-3 bg-white rounded-2xl border-2 border-[#D4AF37] shadow-lg space-y-2 min-w-[240px]">
                                  <textarea
                                    value={editingMsgText}
                                    onChange={(e) => setEditingMsgText(e.target.value)}
                                    className="w-full text-xs sm:text-sm p-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                                    rows={2}
                                  />
                                  <div className="flex items-center justify-end space-x-2 text-xs">
                                    <button
                                      type="button"
                                      onClick={() => setEditingMsgId(null)}
                                      className="px-2.5 py-1 text-gray-500 hover:bg-gray-100 rounded-lg"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleSaveEditMsg(m.id)}
                                      className="px-3 py-1 bg-[#1F1813] text-[#FAF5EE] font-bold rounded-lg hover:bg-[#2A221B]"
                                    >
                                      Save Edit
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                /* Standard Message Bubble */
                                <div className={`p-3.5 rounded-2xl text-xs sm:text-sm relative group/bubble ${
                                  m.isMe 
                                    ? 'bg-[#1F1813] text-[#FAF5EE] rounded-br-none' 
                                    : 'bg-[#FAF5EE] text-[#1F1813] border border-copper-penny/20 rounded-bl-none'
                                }`}>
                                  {m.isPinned && (
                                    <div className="flex items-center space-x-1 text-[10px] font-mono text-[#D4AF37] font-bold pb-1 mb-1 border-b border-white/10">
                                      <Pin className="w-3 h-3 fill-[#D4AF37]" />
                                      <span>Pinned to Discussion</span>
                                    </div>
                                  )}

                                  <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
                                  
                                  {m.isEdited && (
                                    <span className="text-[9px] font-mono text-gray-400 block mt-0.5">
                                      (edited)
                                    </span>
                                  )}

                                  {/* Reactions pill list */}
                                  {m.reactions && m.reactions.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-2">
                                      {m.reactions.map((r, idx) => (
                                        <button
                                          key={idx}
                                          onClick={() => handleReactMsg(m.id, r.emoji)}
                                          className="text-xs bg-black/10 hover:bg-black/20 rounded-full px-2 py-0.5 flex items-center space-x-1 cursor-pointer"
                                        >
                                          <span>{r.emoji}</span>
                                          <span className="font-mono text-[10px]">{r.count}</span>
                                        </button>
                                      ))}
                                    </div>
                                  )}

                                  {/* Link Preview (Screenshots 4 & 7) */}
                                  {m.linkPreviewUrl && (
                                    <a 
                                      href={m.linkPreviewUrl} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="mt-2.5 block p-2.5 bg-white rounded-xl border border-copper-penny/25 text-[#1F1813] hover:underline shadow-2xs"
                                    >
                                      <div className="flex items-center space-x-1.5 text-xs font-bold text-copper-penny">
                                        <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                                        <span className="truncate">{m.linkPreviewTitle || 'View Community Link'}</span>
                                      </div>
                                      <span className="text-[10px] text-gray-500 truncate block font-mono mt-0.5">
                                        {m.linkPreviewUrl}
                                      </span>
                                    </a>
                                  )}
                                </div>
                              )}

                              {/* 3-DOTS MENU TRIGGER BUTTON ON TOP RIGHT OF MESSAGE */}
                              {!isBeingEdited && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveMsgMenuId(isMenuOpen ? null : m.id);
                                  }}
                                  className={`absolute -top-2 ${
                                    m.isMe ? '-left-7' : '-right-7'
                                  } p-1.5 rounded-full bg-white border border-copper-penny/25 shadow-xs text-gray-500 hover:text-black hover:bg-gray-50 transition-opacity cursor-pointer z-10 ${
                                    isMenuOpen ? 'opacity-100' : 'opacity-0 group-hover/bubble:opacity-100'
                                  }`}
                                  title="Message options (Edit, Delete, Reply, Copy, Pin, React)"
                                >
                                  <MoreVertical className="w-3.5 h-3.5" />
                                </button>
                              )}

                              {/* MESSAGE 3-DOTS OPTIONS DROPDOWN MENU */}
                              {isMenuOpen && (
                                <>
                                  <div 
                                    className="fixed inset-0 z-30" 
                                    onClick={() => setActiveMsgMenuId(null)} 
                                  />
                                  <div className={`absolute top-0 ${
                                    m.isMe ? 'right-full mr-2' : 'left-full ml-2'
                                  } w-48 bg-white border border-copper-penny/30 rounded-2xl shadow-2xl p-1.5 z-40 text-xs font-sans space-y-1 animate-fade-in`}>
                                    
                                    {/* Quick Emoji Reactions */}
                                    <div className="flex items-center justify-around py-1.5 border-b border-gray-100 px-1">
                                      {['❤️', '🙏', '🕊️', '✨', '👏'].map(emoji => (
                                        <button
                                          key={emoji}
                                          type="button"
                                          onClick={() => handleReactMsg(m.id, emoji)}
                                          className="text-base hover:scale-125 transition-transform p-0.5 cursor-pointer"
                                          title={`React ${emoji}`}
                                        >
                                          {emoji}
                                        </button>
                                      ))}
                                    </div>

                                    {/* Edit Message (if sent by user) */}
                                    {m.isMe && (
                                      <button
                                        type="button"
                                        onClick={() => handleStartEditMsg(m)}
                                        className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-neutral-100 flex items-center space-x-2 text-gray-700 cursor-pointer"
                                      >
                                        <Edit3 className="w-3.5 h-3.5 text-copper-penny" />
                                        <span>Edit message</span>
                                      </button>
                                    )}

                                    {/* Reply Directly */}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setReplyingToMsg(m);
                                        setActiveMsgMenuId(null);
                                      }}
                                      className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-neutral-100 flex items-center space-x-2 text-gray-700 cursor-pointer"
                                    >
                                      <CornerUpLeft className="w-3.5 h-3.5 text-gray-500" />
                                      <span>Reply</span>
                                    </button>

                                    {/* Copy Message Text */}
                                    <button
                                      type="button"
                                      onClick={() => handleCopyMsg(m.text)}
                                      className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-neutral-100 flex items-center space-x-2 text-gray-700 cursor-pointer"
                                    >
                                      <Copy className="w-3.5 h-3.5 text-gray-500" />
                                      <span>Copy text</span>
                                    </button>

                                    {/* Pin Message */}
                                    <button
                                      type="button"
                                      onClick={() => handlePinMsg(m.id)}
                                      className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-neutral-100 flex items-center space-x-2 text-gray-700 cursor-pointer"
                                    >
                                      <Pin className="w-3.5 h-3.5 text-[#D4AF37]" />
                                      <span>{m.isPinned ? 'Unpin message' : 'Pin message'}</span>
                                    </button>

                                    {/* Delete Message */}
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteMsg(m.id)}
                                      className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-rose-50 flex items-center space-x-2 text-rose-600 cursor-pointer"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                      <span>Delete message</span>
                                    </button>

                                  </div>
                                </>
                              )}

                            </div>
                          </div>

                          <span className="text-[9px] font-mono text-gray-400 mt-1 px-1">
                            {m.timestamp}
                          </span>
                        </div>
                      );
                    })}
                    <div ref={chatMessagesEndRef} />
                  </div>

                  {/* Reply To Banner Bar */}
                  {replyingToMsg && (
                    <div className="px-4 py-2 bg-[#FAF5EE] border-t border-copper-penny/20 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2 text-gray-700 truncate">
                        <CornerUpLeft className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                        <span className="font-bold">Replying to {replyingToMsg.senderName}:</span>
                        <span className="italic truncate">{replyingToMsg.text}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setReplyingToMsg(null)}
                        className="text-gray-400 hover:text-black p-1 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Bottom Composer Bar (Screenshots 4 & 6) */}
                  <form onSubmit={handleSendDirectMessage} className="p-3 border-t border-copper-penny/15 bg-[#FAF5EE]/40 flex items-center space-x-2.5">
                    <button 
                      type="button"
                      onClick={() => showToast('Photo attachment opened')}
                      className="p-2 text-gray-500 hover:text-black hover:bg-white rounded-xl cursor-pointer transition-colors shrink-0"
                      title="Attach image or document"
                    >
                      <ImageIcon className="w-4 h-4 text-copper-penny" />
                    </button>

                    <input 
                      type="text"
                      value={chatMessageText}
                      onChange={(e) => setChatMessageText(e.target.value)}
                      placeholder={replyingToMsg ? `Reply to ${replyingToMsg.senderName}...` : "Message..."}
                      className="flex-1 px-4 py-2 text-xs sm:text-sm bg-white border border-copper-penny/25 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                    />

                    <button 
                      type="submit"
                      disabled={!chatMessageText.trim()}
                      className="p-2 bg-[#1F1813] text-[#D4AF37] rounded-xl hover:bg-[#2A221B] disabled:bg-gray-200 disabled:text-gray-400 cursor-pointer shrink-0 transition-colors shadow-xs"
                      title="Send message"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>

                </div>
              )}

            </div>

          </div>

        </div>
      )}

      {/* OVERVIEW TAB */}
      {activeProfileTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Interests & Skills Card */}
          <div className="bg-white border-2 border-copper-penny/20 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-copper-penny/15 pb-3">
              <h3 className="font-serif font-extrabold text-base text-[#1F1813] flex items-center space-x-2">
                <Heart className="w-4 h-4 text-copper-penny" />
                <span>My Community Interests &amp; Crafts</span>
              </h3>
              <button 
                onClick={() => setIsEditProfileOpen(true)}
                className="text-xs text-copper-penny font-bold hover:underline cursor-pointer"
              >
                + Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {interests.map((item, idx) => (
                <span 
                  key={idx}
                  className="px-3 py-1.5 bg-[#FAF5EE] border border-copper-penny/25 rounded-xl text-xs font-medium text-[#1F1813] flex items-center space-x-1.5"
                >
                  <span>{item}</span>
                  <button 
                    onClick={() => handleRemoveInterest(item)}
                    className="text-gray-400 hover:text-rose-600 ml-1 cursor-pointer"
                    title="Remove interest"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            {/* Quick Add Inline */}
            <form onSubmit={handleAddInterest} className="flex space-x-2 pt-2">
              <input 
                type="text"
                value={newInterestInput}
                onChange={(e) => setNewInterestInput(e.target.value)}
                placeholder="Add another topic or craft..."
                className="flex-1 px-3 py-1.5 bg-[#FAF5EE]/60 border border-copper-penny/20 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
              />
              <button 
                type="submit"
                className="px-3 py-1.5 bg-[#B87333] text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-[#A85138]"
              >
                Add
              </button>
            </form>
          </div>

          {/* Favorited Businesses Preview */}
          <div className="bg-white border-2 border-copper-penny/20 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-copper-penny/15 pb-3">
              <h3 className="font-serif font-extrabold text-base text-[#1F1813] flex items-center space-x-2">
                <Building className="w-4 h-4 text-[#B87333]" />
                <span>Favorited Sister Businesses</span>
              </h3>
              <button 
                onClick={() => setActiveProfileTab('faves')}
                className="text-xs text-copper-penny font-bold hover:underline cursor-pointer"
              >
                See all ({favedBusinesses.length})
              </button>
            </div>

            <div className="space-y-3">
              {favedBusinesses.slice(0, 2).map(biz => (
                <div key={biz.id} className="flex items-center space-x-3 p-2.5 rounded-2xl hover:bg-[#FAF5EE] border border-copper-penny/10 transition-colors">
                  <img src={biz.image} alt={biz.name} className="w-12 h-12 rounded-xl object-cover border border-copper-penny/20" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-[#1F1813] truncate">{biz.name}</h4>
                    <p className="text-[10px] text-gray-500">{biz.category} &bull; {biz.location}</p>
                    <p className="text-[10px] text-[#B87333] font-bold">{biz.perk}</p>
                  </div>
                  <button 
                    onClick={() => onNavigateToTab('commons')}
                    className="text-[10px] px-2.5 py-1 bg-white border border-copper-penny/20 rounded-lg text-[#1F1813] font-bold hover:bg-neutral-100 cursor-pointer"
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* BOOKMARKS TAB */}
      {activeProfileTab === 'bookmarks' && (
        <div className="bg-white border-2 border-copper-penny/20 rounded-3xl p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-copper-penny/15 pb-3 gap-2">
            <div>
              <h3 className="font-serif font-extrabold text-lg text-[#1F1813] flex items-center space-x-2">
                <Bookmark className="w-5 h-5 text-copper-penny" />
                <span>My Bookmarked &amp; Saved Items Across Platform</span>
              </h3>
              <p className="text-xs text-gray-600">Saved exchanges, housing listings, sister businesses, and co-op resources</p>
            </div>

            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-mono font-bold px-3 py-1 bg-[#FAF5EE] text-[#B87333] rounded-full border border-copper-penny/20">
                {savedItems.length} Total Saved
              </span>
            </div>
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap gap-2 text-xs font-mono">
            <button
              onClick={() => setSavedFilter('all')}
              className={`px-3 py-1 rounded-xl border transition-all cursor-pointer ${
                savedFilter === 'all' 
                  ? 'bg-[#1F1813] text-[#D4AF37] border-[#D4AF37] font-bold' 
                  : 'bg-white text-gray-600 border-copper-penny/20 hover:bg-gray-50'
              }`}
            >
              All Items ({savedItems.length})
            </button>
            <button
              onClick={() => setSavedFilter('exchange')}
              className={`px-3 py-1 rounded-xl border transition-all cursor-pointer ${
                savedFilter === 'exchange' 
                  ? 'bg-[#1F1813] text-[#D4AF37] border-[#D4AF37] font-bold' 
                  : 'bg-white text-gray-600 border-copper-penny/20 hover:bg-gray-50'
              }`}
            >
              Free Gifting &amp; Barters ({savedItems.filter(i => i.type === 'exchange').length})
            </button>
            <button
              onClick={() => setSavedFilter('housing')}
              className={`px-3 py-1 rounded-xl border transition-all cursor-pointer ${
                savedFilter === 'housing' 
                  ? 'bg-[#1F1813] text-[#D4AF37] border-[#D4AF37] font-bold' 
                  : 'bg-white text-gray-600 border-copper-penny/20 hover:bg-gray-50'
              }`}
            >
              Housing &amp; Havens ({savedItems.filter(i => i.type === 'housing').length})
            </button>
            <button
              onClick={() => setSavedFilter('business')}
              className={`px-3 py-1 rounded-xl border transition-all cursor-pointer ${
                savedFilter === 'business' 
                  ? 'bg-[#1F1813] text-[#D4AF37] border-[#D4AF37] font-bold' 
                  : 'bg-white text-gray-600 border-copper-penny/20 hover:bg-gray-50'
              }`}
            >
              Sister Businesses ({savedItems.filter(i => i.type === 'business').length})
            </button>
          </div>

          {filteredSavedItems.length === 0 ? (
            <div className="text-center py-12 space-y-3 bg-[#FAF5EE]/50 rounded-2xl border border-dashed border-copper-penny/30">
              <Bookmark className="w-8 h-8 text-copper-penny/40 mx-auto" />
              <p className="font-serif font-bold text-base text-[#1F1813]">No saved items in this category</p>
              <p className="text-xs text-gray-600 max-w-md mx-auto">
                Explore the Village Commons, Barters, Housing, and Sister Businesses to bookmark items with the 📌 icon.
              </p>
              <button 
                onClick={() => onNavigateToTab('commons')}
                className="px-4 py-2 bg-gradient-to-r from-[#B87333] to-[#D4AF37] text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
              >
                Browse Village Commons
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredSavedItems.map(item => (
                <div 
                  key={item.id}
                  className="bg-[#FAF5EE]/75 border border-copper-penny/20 hover:border-copper-penny/50 rounded-2xl p-4 flex space-x-3.5 shadow-xs transition-all relative group"
                >
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="w-20 h-20 rounded-xl object-cover shrink-0 border border-copper-penny/15"
                  />
                  
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-white border border-copper-penny/20 text-[#B87333]">
                        {item.categoryBadge || item.type}
                      </span>
                      <button 
                        onClick={() => onRemoveSavedItem(item.id)}
                        className="text-gray-400 hover:text-rose-600 p-1 cursor-pointer transition-colors"
                        title="Remove bookmark"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h4 className="font-serif font-bold text-xs sm:text-sm text-[#1F1813] truncate">
                      {item.title}
                    </h4>

                    <p className="text-[11px] text-gray-600 line-clamp-1">
                      {item.subtitle}
                    </p>

                    <div className="pt-1 flex items-center justify-between text-[10px] text-gray-500 font-mono">
                      <span>{item.location || 'Local District'}</span>
                      <button 
                        onClick={() => {
                          onSelectSavedItem(item);
                          onNavigateToTab('commons');
                        }}
                        className="text-copper-penny hover:underline font-bold flex items-center space-x-0.5 cursor-pointer"
                      >
                        <span>View Details</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MY POSTS & RECENT ACTIVITY TAB */}
      {activeProfileTab === 'posts' && (
        <div className="bg-white border-2 border-copper-penny/20 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-copper-penny/15 pb-3 gap-2">
            <div>
              <h3 className="font-serif font-extrabold text-lg text-[#1F1813]">My Community Posts &amp; Recent Activity</h3>
              <p className="text-xs text-gray-600">Discussions, questions, recommendations, and barter inquiries you posted</p>
            </div>

            <button 
              onClick={() => setIsNewPostModalOpen(true)}
              className="px-3.5 py-1.5 bg-[#B87333] hover:bg-[#A85138] text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-xs transition-all active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 text-white" />
              <span>New Community Post</span>
            </button>
          </div>

          <div className="space-y-4">
            {userPosts.map(post => (
              <div key={post.id} className="bg-[#FAF5EE]/60 border border-copper-penny/20 rounded-2xl p-5 space-y-3.5">
                
                {/* Author row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <img src="/coppermommies-selflove1-cmc.jpg" alt={displayName} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-xs" />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-bold text-xs text-[#1F1813]">{displayName}</h4>
                        <span className="text-[9px] font-mono font-bold bg-[#D4AF37]/20 text-amber-900 px-2 py-0.5 rounded-full">
                          {post.category || 'Discussion'}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-500 font-mono">{post.location} &bull; {post.date}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded-full border border-copper-penny/15 text-gray-600">
                    👁️ {post.views} views
                  </span>
                </div>

                {/* Content */}
                <p className="text-xs sm:text-sm text-[#2A221B] leading-relaxed font-sans">
                  {post.content}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {post.tags.map((t, idx) => (
                    <span key={idx} className="text-[10px] bg-white border border-copper-penny/20 text-[#B87333] font-bold px-2 py-0.5 rounded-md">
                      #{t}
                    </span>
                  ))}
                </div>

                {/* Engagement Bar */}
                <div className="pt-2 border-t border-copper-penny/10 flex items-center justify-between text-xs text-gray-600">
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={() => handleToggleLikePost(post.id)}
                      className={`flex items-center space-x-1 font-bold cursor-pointer transition-colors ${
                        post.isLiked ? 'text-rose-600' : 'text-gray-600 hover:text-rose-600'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${post.isLiked ? 'fill-rose-600' : ''}`} />
                      <span>{post.reactions}</span>
                    </button>
                    <button 
                      onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                      className="flex items-center space-x-1 text-[#1F1813] font-bold hover:text-copper-penny cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{post.commentsCount} Comments</span>
                    </button>
                  </div>

                  <button 
                    onClick={() => alert("Post link copied to clipboard for your sister circle!")}
                    className="text-gray-500 hover:text-gray-800 flex items-center space-x-1 text-[11px] cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share</span>
                  </button>
                </div>

                {/* Comments List */}
                {post.comments.length > 0 && (
                  <div className="bg-white rounded-xl p-3 space-y-2 border border-copper-penny/10 text-xs">
                    {post.comments.map((c, i) => (
                      <div key={i} className="border-b border-gray-100 last:border-none pb-1.5 last:pb-0">
                        <span className="font-bold text-[#1F1813] mr-2">{c.author}:</span>
                        <span className="text-gray-700">{c.text}</span>
                        <span className="text-[9px] text-gray-400 block font-mono">{c.time}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Comment Input */}
                {activeCommentPostId === post.id && (
                  <div className="flex items-center space-x-2 pt-1 animate-fade-in">
                    <input 
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Write a sister reply or advice..."
                      className="flex-1 px-3 py-1.5 bg-white border border-copper-penny/25 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                    />
                    <button 
                      onClick={() => handleAddComment(post.id)}
                      className="p-1.5 bg-[#B87333] text-white rounded-xl hover:bg-[#A85138] cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                )}

              </div>
            ))}
          </div>
        </div>
      )}

      {/* GROUPS & JOINED FORUMS TAB */}
      {activeProfileTab === 'groups' && (
        <div className="bg-white border-2 border-copper-penny/20 rounded-3xl p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-copper-penny/15 pb-3 gap-2">
            <div>
              <h3 className="font-serif font-extrabold text-lg text-[#1F1813]">My Joined Forums &amp; Co-op Pods</h3>
              <p className="text-xs text-gray-600">Regional homeschool pods, gardening guilds, and sister circles</p>
            </div>
            <button 
              onClick={() => onNavigateToTab('gathering')}
              className="px-3.5 py-1.5 bg-[#1F1813] text-[#FAF5EE] rounded-xl text-xs font-bold cursor-pointer"
            >
              Explore All Circles
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {joinedGroups.map(grp => (
              <div 
                key={grp.id} 
                className={`border rounded-2xl p-4 space-y-3 transition-all ${
                  grp.isJoined ? 'bg-[#FAF5EE] border-copper-penny/25' : 'bg-gray-50 border-gray-200 opacity-75'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl p-2 bg-white rounded-xl border border-copper-penny/15 shadow-2xs">{grp.icon}</span>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-[#1F1813]">{grp.name}</h4>
                      <p className="text-[10px] text-gray-500 font-mono">{grp.members} active mothers &bull; {grp.role}</p>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed font-sans">
                  {grp.description}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-copper-penny/10 text-xs">
                  <button
                    onClick={() => handleToggleJoinGroup(grp.id)}
                    className={`px-3 py-1 rounded-xl font-mono text-[10px] font-bold cursor-pointer transition-all ${
                      grp.isJoined 
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                        : 'bg-[#B87333] text-white'
                    }`}
                  >
                    {grp.isJoined ? '✓ Joined Member' : '+ Join Circle'}
                  </button>

                  <button
                    onClick={() => onNavigateToTab('gathering')}
                    className="text-copper-penny hover:underline font-bold flex items-center space-x-1 cursor-pointer text-xs"
                  >
                    <span>Open Forum</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAVES TAB */}
      {activeProfileTab === 'faves' && (
        <div className="bg-white border-2 border-copper-penny/20 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-copper-penny/15 pb-3 gap-2">
            <div>
              <h3 className="font-serif font-extrabold text-lg text-[#1F1813]">Favorited &amp; Vouched Sister Businesses</h3>
              <p className="text-xs text-gray-600">Enterprises you support, vouch for, and recommend across the network</p>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setIsAddBusinessOpen(true)}
                className="px-3.5 py-1.5 bg-[#B87333] text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer hover:bg-[#A85138]"
              >
                + Add Business
              </button>
              <button 
                onClick={() => onNavigateToTab('commons')}
                className="px-3.5 py-1.5 bg-gradient-to-r from-[#B87333] to-[#D4AF37] text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                Browse Directory
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {favedBusinesses.map(biz => (
              <div key={biz.id} className="bg-[#FAF5EE] border border-copper-penny/20 rounded-2xl p-4 flex space-x-4 shadow-2xs">
                <img src={biz.image} alt={biz.name} className="w-16 h-16 rounded-xl object-cover shrink-0 border border-copper-penny/15" />
                <div className="space-y-1 min-w-0 flex-1">
                  <h4 className="font-serif font-bold text-sm text-[#1F1813] truncate">{biz.name}</h4>
                  <p className="text-[11px] text-gray-600">{biz.category} &bull; {biz.location}</p>
                  <p className="text-[10px] text-amber-700 font-mono font-bold">⭐ {biz.rating}</p>
                  <p className="text-[10px] text-emerald-800 font-bold">{biz.perk}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EVENTS & RSVPs TAB */}
      {activeProfileTab === 'events' && (
        <div className="bg-white border-2 border-copper-penny/20 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-copper-penny/15 pb-3 gap-2">
            <div>
              <h3 className="font-serif font-extrabold text-lg text-[#1F1813]">My Upcoming Events &amp; RSVPs</h3>
              <p className="text-xs text-gray-600">Live Casual Corner discussions, seed swaps, and local gatherings</p>
            </div>
            <button 
              onClick={() => onNavigateToTab('gathering')}
              className="px-3.5 py-1.5 bg-[#1F1813] text-[#FAF5EE] rounded-xl text-xs font-bold cursor-pointer"
            >
              All Events &amp; Circles
            </button>
          </div>

          <div className="space-y-3">
            {rsvpEvents.map(ev => (
              <div key={ev.id} className="bg-[#FAF5EE] border border-copper-penny/20 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                      {ev.status}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                      {ev.badge}
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-sm text-[#1F1813]">{ev.title}</h4>
                  <p className="text-xs text-gray-600 flex flex-wrap items-center gap-2">
                    <span>📅 {ev.date}</span>
                    <span>&bull;</span>
                    <span>📍 {ev.location}</span>
                  </p>
                </div>
                <button 
                  onClick={() => onNavigateToTab('gathering')}
                  className="px-3.5 py-1.5 bg-white border border-copper-penny/30 rounded-xl text-xs font-bold text-[#1F1813] hover:bg-neutral-100 cursor-pointer"
                >
                  View Gathering Room
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LEDGER & TIME BANK LOGS TAB */}
      {activeProfileTab === 'ledger' && (
        <div className="bg-white border-2 border-copper-penny/20 rounded-3xl p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-copper-penny/15 pb-3 gap-2">
            <div>
              <h3 className="font-serif font-extrabold text-lg text-[#1F1813] flex items-center space-x-2">
                <Scale className="w-5 h-5 text-emerald-700" />
                <span>My Sovereign Ledger &amp; Time Banking History</span>
              </h3>
              <p className="text-xs text-gray-600">Complete record of service hours contributed, received, and mutual aid logs</p>
            </div>

            <button
              onClick={() => setIsNewTradeModalOpen(true)}
              className="px-3.5 py-1.5 bg-[#B87333] hover:bg-[#A85138] text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              + Log New Contribution
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#FAF5EE] p-4 rounded-2xl border border-copper-penny/20 text-center">
              <span className="text-[10px] font-mono uppercase text-gray-500 font-bold block">Total Hours Banked</span>
              <span className="text-3xl font-mono font-black text-[#1F1813]">{timeBalance}h</span>
            </div>
            <div className="bg-[#FAF5EE] p-4 rounded-2xl border border-copper-penny/20 text-center">
              <span className="text-[10px] font-mono uppercase text-gray-500 font-bold block">Trade Credits</span>
              <span className="text-3xl font-mono font-black text-[#B87333]">+{tradeBalance}</span>
            </div>
            <div className="bg-[#FAF5EE] p-4 rounded-2xl border border-copper-penny/20 text-center">
              <span className="text-[10px] font-mono uppercase text-gray-500 font-bold block">Generosity Standing</span>
              <span className="text-3xl font-mono font-black text-copper-penny">{generosityScore}</span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase font-mono text-gray-700">Recent Ledger Activity:</h4>
            {timeLogs.length === 0 ? (
              <p className="text-xs text-gray-500 italic">No ledger activity recorded yet.</p>
            ) : (
              timeLogs.map(log => (
                <div key={log.id} className="p-3 bg-[#FAF5EE]/70 rounded-xl border border-copper-penny/15 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-[#1F1813] block">{log.activity}</span>
                    <span className="text-[10px] font-mono text-gray-500">{log.date}</span>
                  </div>
                  <span className={`font-mono font-black px-2.5 py-1 rounded-lg ${
                    log.type === 'earn' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {log.type === 'earn' ? `+${log.hours}h` : `-${Math.abs(log.hours)}h`}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ACTIVE TRADES & BARTER HANDSHAKES TAB */}
      {activeProfileTab === 'trades' && (
        <div className="bg-white border-2 border-copper-penny/20 rounded-3xl p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-copper-penny/15 pb-3 gap-2">
            <div>
              <h3 className="font-serif font-extrabold text-lg text-[#1F1813] flex items-center space-x-2">
                <Handshake className="w-5 h-5 text-[#B87333]" />
                <span>My Active Trades &amp; Multi-Stage Handshakes</span>
              </h3>
              <p className="text-xs text-gray-600">Track multi-stage barter negotiations, agreements, and time-credit handshakes</p>
            </div>

            <button 
              onClick={() => onNavigateToTab('economy')}
              className="px-3.5 py-1.5 bg-[#B87333] hover:bg-[#A85138] text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-xs"
            >
              + Propose New Barter Trade
            </button>
          </div>

          <div className="space-y-4">
            {activeTrades.length === 0 ? (
              <div className="p-8 text-center bg-[#FAF5EE] rounded-2xl border border-copper-penny/20 space-y-2">
                <Handshake className="w-8 h-8 text-copper-penny mx-auto opacity-50" />
                <p className="text-xs font-bold text-[#1F1813]">No active trades or handshakes currently open.</p>
                <p className="text-[11px] text-gray-500">Browse the Village Commons or Economy Hub to propose a skill swap or product exchange!</p>
                <button
                  onClick={() => onNavigateToTab('commons')}
                  className="mt-2 px-4 py-1.5 bg-[#1F1813] text-[#D4AF37] text-xs font-bold rounded-xl"
                >
                  Browse Commons Exchange
                </button>
              </div>
            ) : (
              activeTrades.map(trade => {
                const stageLabel = 
                  trade.currentStage === 'completed' ? '✓ Handshake Completed' :
                  trade.currentStage === 'agreed' ? '🤝 Agreement Reached (Awaiting Completion)' :
                  trade.currentStage === 'counter_offer' ? '💬 Counter-Offer Submitted' : '📩 Inquiry / Proposed Terms';

                const stageBg = 
                  trade.currentStage === 'completed' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                  trade.currentStage === 'agreed' ? 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse' :
                  trade.currentStage === 'counter_offer' ? 'bg-indigo-100 text-indigo-800 border-indigo-300' :
                  'bg-neutral-100 text-neutral-800 border-neutral-300';

                return (
                  <div key={trade.id} className="bg-[#FAF5EE] border-2 border-copper-penny/20 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-2xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-copper-penny/15 pb-2.5">
                      <div>
                        <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border inline-block mb-1 ${stageBg}`}>
                          {stageLabel}
                        </span>
                        <h4 className="font-serif font-extrabold text-base text-[#1F1813]">{trade.listingTitle}</h4>
                        <p className="text-xs text-gray-600 font-sans">
                          Between <strong className="text-[#1F1813]">{trade.initiatorName}</strong> ({trade.initiatorLocation}) &amp; <strong className="text-[#1F1813]">{trade.recipientName}</strong> ({trade.recipientLocation})
                        </p>
                      </div>

                      <div className="text-left sm:text-right font-mono text-xs shrink-0">
                        <span className="text-gray-500 block text-[10px]">Updated: {trade.updatedAt}</span>
                        {trade.timeCreditHours && (
                          <span className="font-black text-[#B87333] text-sm block">⚡ {trade.timeCreditHours} Time Credits</span>
                        )}
                        {trade.cashAmount && (
                          <span className="font-bold text-emerald-800 text-xs block">💵 {trade.cashAmount}</span>
                        )}
                      </div>
                    </div>

                    {/* Trade Terms Box */}
                    <div className="bg-white p-3 rounded-xl border border-copper-penny/15 text-xs text-[#1F1813] space-y-1">
                      <span className="font-bold font-mono text-[10px] uppercase text-gray-500 block">Agreed Trade Terms:</span>
                      <p className="leading-relaxed">{trade.currentTerms || trade.initialProposal}</p>
                      {trade.counterOfferNote && (
                        <p className="text-indigo-900 bg-indigo-50 p-2 rounded-lg text-[11px] font-mono mt-1">
                          <strong>Note from {trade.counterOfferedBy || 'Sister'}:</strong> {trade.counterOfferNote}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <button
                        onClick={() => setActiveProfileTab('chats')}
                        className="px-3.5 py-1.5 bg-white border border-copper-penny/30 rounded-xl text-xs font-bold text-[#1F1813] hover:bg-neutral-100 flex items-center space-x-1.5 cursor-pointer shadow-2xs"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-copper-penny" />
                        <span>Discuss in Direct Chats</span>
                      </button>

                      {trade.currentStage !== 'completed' && (
                        <button
                          onClick={() => handleCompleteTrade(trade.id)}
                          className="px-4 py-2 bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-800 hover:to-emerald-700 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 cursor-pointer shadow-sm transition-all active:scale-95"
                        >
                          <Check className="w-4 h-4 text-white" />
                          <span>Sign &amp; Complete Handshake</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* MEMBER ADS & SPONSORSHIP PLACEMENTS TAB */}
      {activeProfileTab === 'ads' && (
        <div className="bg-white border-2 border-copper-penny/20 rounded-3xl p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-copper-penny/15 pb-3 gap-2">
            <div>
              <h3 className="font-serif font-extrabold text-lg text-[#1F1813] flex items-center space-x-2">
                <Tag className="w-5 h-5 text-amber-600" />
                <span>My Ad Submissions &amp; Sponsorship Placements</span>
              </h3>
              <p className="text-xs text-gray-600 font-sans">Manage your active header feature banners, sidebar cards, and discount codes</p>
            </div>

            <button 
              onClick={() => onNavigateToTab('sponsors')}
              className="px-3.5 py-1.5 bg-gradient-to-r from-[#D4AF37] to-[#B87333] text-[#1F140E] font-bold rounded-xl text-xs shadow-xs cursor-pointer hover:opacity-90 transition-all"
            >
              + Create Ad / Placement
            </button>
          </div>

          <div className="space-y-4">
            {memberAds.length === 0 ? (
              <div className="p-8 text-center bg-[#FAF5EE] rounded-2xl border border-copper-penny/20 space-y-2">
                <Award className="w-8 h-8 text-amber-600 mx-auto opacity-50" />
                <p className="text-xs font-bold text-[#1F1813]">No active ad placements or sponsorship submissions found.</p>
                <p className="text-[11px] text-gray-500">Promote your melanated sister business with true-size banners, exclusive member codes, and live tracking!</p>
                <button
                  onClick={() => onNavigateToTab('sponsors')}
                  className="mt-2 px-4 py-1.5 bg-[#1F1813] text-[#D4AF37] text-xs font-bold rounded-xl cursor-pointer"
                >
                  Visit Sponsors Ad Hub
                </button>
              </div>
            ) : (
              memberAds.map(ad => {
                const statusBadge = 
                  ad.status === 'approved_live' ? '🟢 Live & Displaying' :
                  ad.status === 'pending_review' ? '🟡 Pending Elder Review' : '🔴 Revision Requested';

                const statusBg = 
                  ad.status === 'approved_live' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                  ad.status === 'pending_review' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                  'bg-rose-100 text-rose-800 border-rose-300';

                return (
                  <div key={ad.id} className="bg-[#FAF5EE] border-2 border-copper-penny/20 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-2xs">
                    
                    {/* Header bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-copper-penny/15 pb-2.5">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border inline-block ${statusBg}`}>
                            {statusBadge}
                          </span>
                          <span className="text-[10px] font-mono font-extrabold text-[#B87333] bg-[#B87333]/10 px-2 py-0.5 rounded-full border border-[#B87333]/20">
                            {ad.pricingAmount}
                          </span>
                        </div>
                        <h4 className="font-serif font-extrabold text-base text-[#1F1813] mt-1">{ad.businessName}</h4>
                        <p className="text-xs text-gray-600">{ad.headline}</p>
                      </div>

                      {/* Performance Counters */}
                      <div className="flex items-center space-x-3 bg-white p-2.5 rounded-xl border border-copper-penny/15 text-center font-mono shrink-0">
                        <div>
                          <span className="text-[9px] uppercase font-bold text-gray-400 block">Views</span>
                          <span className="font-black text-xs text-[#1F1813]">{ad.viewsCount || 0}</span>
                        </div>
                        <div className="h-6 w-px bg-gray-200" />
                        <div>
                          <span className="text-[9px] uppercase font-bold text-gray-400 block">Clicks</span>
                          <span className="font-black text-xs text-emerald-700">{ad.clicksCount || 0}</span>
                        </div>
                      </div>
                    </div>

                    {/* True-size Banner Preview */}
                    <div className="rounded-xl overflow-hidden border border-copper-penny/25 bg-black/5 relative group">
                      <img 
                        src={ad.bannerImageUrl || '/nestbright_banner.jpg'} 
                        alt={ad.headline} 
                        className="w-full h-32 sm:h-40 object-cover object-center"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3 flex flex-col justify-end text-white">
                        <span className="text-[9px] font-mono uppercase bg-[#D4AF37] text-black font-extrabold px-2 py-0.5 rounded-md self-start mb-1">
                          Live Banner Preview
                        </span>
                        <h5 className="font-serif font-bold text-sm leading-tight text-white">{ad.headline}</h5>
                        <p className="text-[11px] text-gray-200 truncate">{ad.tagline}</p>
                      </div>
                    </div>

                    {/* Exclusive Promo Details */}
                    <div className="bg-white p-3 rounded-xl border border-copper-penny/15 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div>
                        <span className="font-bold text-[#1F1813]">Exclusive Sister Offer:</span>
                        <p className="text-gray-600 text-[11px]">{ad.discountOfferText}</p>
                      </div>
                      {ad.exclusiveDiscountCode && (
                        <div className="bg-[#FAF5EE] border border-dashed border-[#D4AF37] px-3 py-1.5 rounded-xl font-mono text-xs font-black text-[#B87333] flex items-center space-x-1 shrink-0">
                          <span>PROMO CODE:</span>
                          <span className="text-[#1F1813] underline">{ad.exclusiveDiscountCode}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center justify-between pt-1 text-xs">
                      <a 
                        href={ad.websiteUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-copper-penny hover:underline font-bold flex items-center space-x-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Visit {ad.websiteUrl.replace(/^https?:\/\//, '')}</span>
                      </a>

                      <button
                        onClick={() => onNavigateToTab('sponsors')}
                        className="px-3 py-1.5 bg-[#1F1813] text-[#FAF5EE] rounded-xl font-bold hover:bg-[#2A221B] cursor-pointer"
                      >
                        Edit in Ad Hub
                      </button>
                    </div>

                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 4. CREATE A CHAT MODAL (SCREENSHOTS 2 & 3)           */}
      {/* ==================================================== */}
      {isCreateChatModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-[#D4AF37] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scale-up">
            
            <div className="flex items-center justify-between border-b border-copper-penny/15 pb-3">
              <h3 className="font-serif font-extrabold text-lg text-[#1F1813]">Create a chat</h3>
              <button 
                type="button"
                onClick={() => setIsCreateChatModalOpen(false)}
                className="text-gray-400 hover:text-black text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNewChatSubmit} className="space-y-4">
              
              {/* Search Bar (Screenshot 2: Add 1 or more people) */}
              <div className="space-y-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
                  <input 
                    type="text"
                    value={createChatSearch}
                    onChange={(e) => setCreateChatSearch(e.target.value)}
                    placeholder="Add 1 or more people..."
                    className="w-full pl-9 pr-4 py-2 bg-white border border-gray-300 focus:border-[#D4AF37] rounded-xl text-xs sm:text-sm focus:outline-none"
                  />
                </div>

                {/* Selected Pill (Screenshot 3) */}
                {selectedRecipientId && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {chatMembers.filter(m => m.id === selectedRecipientId).map(m => (
                      <span 
                        key={m.id} 
                        className="inline-flex items-center space-x-1.5 px-3 py-1 bg-[#FAF5EE] border border-copper-penny/30 text-[#1F1813] rounded-full text-xs font-medium"
                      >
                        <span>{m.name}</span>
                        <button 
                          type="button" 
                          onClick={() => setSelectedRecipientId(null)}
                          className="hover:text-rose-600 font-bold"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Suggested Sisters List */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase font-bold text-gray-400 block">
                  SUGGESTED
                </span>

                <div className="max-h-52 overflow-y-auto space-y-1 divide-y divide-gray-50 border border-gray-100 rounded-2xl p-1">
                  {filteredSuggestedMembers.map(m => {
                    const isSelected = selectedRecipientId === m.id;
                    return (
                      <div 
                        key={m.id}
                        onClick={() => setSelectedRecipientId(isSelected ? null : m.id)}
                        className={`p-2.5 rounded-xl flex items-center justify-between cursor-pointer transition-colors ${
                          isSelected ? 'bg-[#FAF5EE]' : 'hover:bg-neutral-50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <img 
                            src={m.avatar || '/coppermommies-selflove1-cmc.jpg'} 
                            alt={m.name} 
                            className="w-9 h-9 rounded-full object-cover border border-copper-penny/20"
                          />
                          <div>
                            <h4 className="font-bold text-xs text-[#1F1813]">{m.name}</h4>
                            <p className="text-[10px] text-gray-500 font-mono">{m.neighborhood}</p>
                          </div>
                        </div>

                        <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                          isSelected ? 'bg-[#1F1813] border-[#1F1813] text-[#D4AF37]' : 'border-gray-300'
                        }`}>
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Initial Message (Optional) */}
              <div>
                <label className="block text-[11px] font-bold text-[#1F1813] mb-1">
                  Initial Message (Optional)
                </label>
                <textarea 
                  rows={2}
                  value={createChatInitialText}
                  onChange={(e) => setCreateChatInitialText(e.target.value)}
                  placeholder="Hi sister, inquiring about..."
                  className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>

              {/* Footer Actions */}
              <div className="pt-2 flex items-center justify-end space-x-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsCreateChatModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-neutral-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedRecipientId}
                  className="px-6 py-2 bg-[#1F1813] text-[#FAF5EE] rounded-xl text-xs font-bold shadow-md hover:bg-[#2A221B] disabled:bg-gray-200 disabled:text-gray-400 cursor-pointer transition-all"
                >
                  Create
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 5. EDIT PROFILE MODAL                                */}
      {/* ==================================================== */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF5EE] border-2 border-[#D4AF37] rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-copper-penny/20 pb-3">
              <h3 className="font-serif font-black text-lg text-[#1F140E]">Edit Sister Profile</h3>
              <button 
                type="button"
                onClick={() => setIsEditProfileOpen(false)}
                className="text-gray-400 hover:text-black text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={(e) => { 
              e.preventDefault(); 
              if (onUpdateProfileName) onUpdateProfileName(displayName);
              setIsEditProfileOpen(false); 
            }} className="space-y-3.5 text-xs font-sans">
              <div>
                <label className="block text-[11px] font-bold text-[#1F140E] mb-1">Display Name</label>
                <input 
                  type="text" 
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-copper-penny/25 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#1F140E] mb-1">About Me / Bio</label>
                <textarea 
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-copper-penny/25 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#1F140E] mb-1">Hometown</label>
                  <input 
                    type="text" 
                    value={hometown}
                    onChange={(e) => setHometown(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-copper-penny/25 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#1F140E] mb-1">District / Neighborhood</label>
                  <input 
                    type="text" 
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-copper-penny/25 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#1F140E] mb-1">Homeschool Pod Stage</label>
                <input 
                  type="text" 
                  value={homeschoolPod}
                  onChange={(e) => setHomeschoolPod(e.target.value)}
                  placeholder="e.g. Grades 3 & 4 (Elementary Math & Reading)"
                  className="w-full px-3 py-2 bg-white border border-copper-penny/25 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#1F140E] mb-1">Maternal Lineage &amp; Heritage</label>
                <input 
                  type="text" 
                  value={lineageRoots}
                  onChange={(e) => setLineageRoots(e.target.value)}
                  placeholder="e.g. Fulton County, GA & Sea Island, SC Lineage"
                  className="w-full px-3 py-2 bg-white border border-copper-penny/25 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#1F140E] mb-1">Website or Portfolio Link</label>
                <input 
                  type="url" 
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-copper-penny/25 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>

              <div className="pt-2 border-t border-copper-penny/15">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={stayLoggedIn}
                    onChange={handleToggleStayLoggedIn}
                    className="rounded text-[#B87333] focus:ring-[#D4AF37]"
                  />
                  <span className="text-xs font-bold text-[#1F140E]">Stay logged in on this device across sessions</span>
                </label>
              </div>

              <div className="pt-3 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="px-4 py-2 bg-neutral-200 text-neutral-800 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-[#B87333] to-[#D4AF37] text-white rounded-xl font-bold shadow-md cursor-pointer"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 6. ADD SISTER BUSINESS MODAL                         */}
      {/* ==================================================== */}
      {isAddBusinessOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF5EE] border-2 border-[#D4AF37] rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-copper-penny/20 pb-3">
              <h3 className="font-serif font-black text-lg text-[#1F140E]">Register Sister Business</h3>
              <button 
                type="button"
                onClick={() => setIsAddBusinessOpen(false)}
                className="text-gray-400 hover:text-black text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (newBizName.trim()) {
                setFavedBusinesses([
                  ...favedBusinesses,
                  {
                    id: `biz-${Date.now()}`,
                    name: newBizName.trim(),
                    category: newBizCategory,
                    location: `${hometown}`,
                    rating: '5.0 (New)',
                    image: '/coppermommies-selflove1-cmc.jpg',
                    perk: newBizPerk || '✨ Special barter & discount for Copper Mommies'
                  }
                ]);
                setNewBizName('');
                setNewBizDesc('');
                setIsAddBusinessOpen(false);
                setActiveProfileTab('faves');
              }
            }} className="space-y-3 text-xs font-sans">
              <div>
                <label className="block text-[11px] font-bold text-[#1F140E] mb-1">Business Name</label>
                <input 
                  type="text" 
                  required
                  value={newBizName}
                  onChange={(e) => setNewBizName(e.target.value)}
                  placeholder="e.g., ClarkWorks Customs & Woodcraft"
                  className="w-full px-3 py-2 bg-white border border-copper-penny/25 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#1F140E] mb-1">Category</label>
                <select 
                  value={newBizCategory}
                  onChange={(e) => setNewBizCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-copper-penny/25 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                >
                  <option value="Creative & Artisan">Creative &amp; Artisan</option>
                  <option value="Home & Woodwork">Home &amp; Woodwork</option>
                  <option value="Holistic Health & Herbs">Holistic Health &amp; Herbs</option>
                  <option value="Childcare & Doula">Childcare &amp; Doula</option>
                  <option value="Homestead & Farm">Homestead &amp; Farm</option>
                  <option value="Homeschool & Tutoring">Homeschool &amp; Tutoring</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#1F140E] mb-1">Member Perk or Discount</label>
                <input 
                  type="text"
                  value={newBizPerk}
                  onChange={(e) => setNewBizPerk(e.target.value)}
                  placeholder="e.g. 10% Member Discount or Barter Hours Accepted"
                  className="w-full px-3 py-2 bg-white border border-copper-penny/25 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#1F140E] mb-1">Description of Offerings</label>
                <textarea 
                  rows={2}
                  value={newBizDesc}
                  onChange={(e) => setNewBizDesc(e.target.value)}
                  placeholder="Custom cabinetry, homeschool furniture, raised garden boxes..."
                  className="w-full px-3 py-2 bg-white border border-copper-penny/25 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddBusinessOpen(false)}
                  className="px-4 py-2 bg-neutral-200 text-neutral-800 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-[#B87333] to-[#D4AF37] text-white rounded-xl font-bold shadow-md cursor-pointer"
                >
                  Publish Business
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 7. NEW POST COMPOSER MODAL                           */}
      {/* ==================================================== */}
      {isNewPostModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF5EE] border-2 border-[#D4AF37] rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-copper-penny/20 pb-3">
              <h3 className="font-serif font-black text-lg text-[#1F140E] flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-copper-penny" />
                <span>Create Community Post</span>
              </h3>
              <button 
                type="button"
                onClick={() => setIsNewPostModalOpen(false)}
                className="text-gray-400 hover:text-black text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNewPost} className="space-y-3 text-xs font-sans">
              <div>
                <label className="block text-[11px] font-bold text-[#1F140E] mb-1">Post Category</label>
                <select 
                  value={newPostCategory}
                  onChange={(e) => setNewPostCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-copper-penny/25 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                >
                  <option value="Discussion">💬 Sister Discussion &amp; Thoughts</option>
                  <option value="Question">❓ Question / Local Advice Request</option>
                  <option value="Recommendation">⭐ Sister Business Recommendation</option>
                  <option value="Homeschool">📚 Homeschool &amp; Childcare Tip</option>
                  <option value="Homestead">🌱 Homesteading &amp; Garden Harvest</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#1F140E] mb-1">Your Message</label>
                <textarea 
                  rows={4}
                  required
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Share a thought, ask for homeschool advice, or recommend a sister's craftsmanship..."
                  className="w-full px-3 py-2 bg-white border border-copper-penny/25 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#1F140E] mb-1">Tags (comma-separated)</label>
                <input 
                  type="text"
                  value={newPostTags}
                  onChange={(e) => setNewPostTags(e.target.value)}
                  placeholder="e.g. Homestead Advice, Sourdough, Math Tutoring"
                  className="w-full px-3 py-2 bg-white border border-copper-penny/25 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsNewPostModalOpen(false)}
                  className="px-4 py-2 bg-neutral-200 text-neutral-800 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#B87333] hover:bg-[#A85138] text-white rounded-xl font-bold shadow-md cursor-pointer"
                >
                  Publish Post to District
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 8. RECORD TRADE / HOURS MODAL                        */}
      {/* ==================================================== */}
      {isNewTradeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF5EE] border-2 border-[#D4AF37] rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-copper-penny/20 pb-3">
              <h3 className="font-serif font-black text-lg text-[#1F140E] flex items-center space-x-2">
                <Scale className="w-5 h-5 text-emerald-700" />
                <span>Record Cooperative Hours / Trade</span>
              </h3>
              <button 
                type="button"
                onClick={() => setIsNewTradeModalOpen(false)}
                className="text-gray-400 hover:text-black text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (ledgerActivity.trim()) {
                const hoursNum = parseFloat(ledgerHours) || 1;
                if (onAddLedgerLog) {
                  onAddLedgerLog(ledgerActivity.trim(), hoursNum, ledgerType);
                }
                setLedgerActivity('');
                setIsNewTradeModalOpen(false);
                setActiveProfileTab('ledger');
              }
            }} className="space-y-3 text-xs font-sans">
              <div>
                <label className="block text-[11px] font-bold text-[#1F140E] mb-1">Transaction Type</label>
                <select 
                  value={ledgerType}
                  onChange={(e) => setLedgerType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-copper-penny/25 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                >
                  <option value="earn">🌱 Earned Hours (Contributed Service / Mentorship)</option>
                  <option value="spend">📦 Redeemed Hours (Received Meal Support, Doula, Tutoring)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#1F140E] mb-1">Description of Service</label>
                <input 
                  type="text" 
                  required
                  value={ledgerActivity}
                  onChange={(e) => setLedgerActivity(e.target.value)}
                  placeholder="e.g. 2 hours of Math manipulatives tutoring with Sister Nia"
                  className="w-full px-3 py-2 bg-white border border-copper-penny/25 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#1F140E] mb-1">Number of Hours</label>
                <input 
                  type="number" 
                  step="0.5"
                  min="0.5"
                  required
                  value={ledgerHours}
                  onChange={(e) => setLedgerHours(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-copper-penny/25 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsNewTradeModalOpen(false)}
                  className="px-4 py-2 bg-neutral-200 text-neutral-800 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#B87333] hover:bg-[#A85138] text-white rounded-xl font-bold shadow-md cursor-pointer"
                >
                  Record into Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ==================================================== */}
      {/* 9. SISTERHOOD REFERRAL & ANALYTICS MODAL             */}
      {/* ==================================================== */}
      {isReferralModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF5EE] border-2 border-[#D4AF37] rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 animate-scale-up">
            <div className="flex items-center justify-between border-b border-copper-penny/20 pb-3">
              <div className="flex items-center space-x-2">
                <span className="w-8 h-8 rounded-xl bg-[#D4AF37] text-[#1F140E] flex items-center justify-center font-bold">🕊️</span>
                <div>
                  <h3 className="font-serif font-black text-lg text-[#1F140E]">
                    Sisterhood Referral &amp; Growth Analytics
                  </h3>
                  <p className="text-[11px] text-gray-600 font-mono">
                    Generate secure, one-time invitation links to welcome trusted sisters into our village.
                  </p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setIsReferralModalOpen(false)}
                className="text-gray-400 hover:text-black text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Generate Action Banner */}
            <div className="p-4 bg-gradient-to-br from-[#1F1813] via-[#2A221B] to-[#1F1813] text-[#FAF5EE] rounded-2xl border border-[#D4AF37]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-left">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#D4AF37] font-bold block">
                  Exclusive Member Perk
                </span>
                <h4 className="font-serif font-black text-sm text-white">
                  Invite a Trusted Sister to Apply
                </h4>
                <p className="text-[11px] text-gray-300 font-sans max-w-md">
                  Each link tracks the invitation source for community growth analytics while upholding our verified application standards.
                </p>
              </div>
              <button
                type="button"
                onClick={handleGenerateReferralLink}
                className="px-5 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#B87333] hover:from-[#e0bc46] hover:to-[#c47f3e] text-[#1F140E] font-serif font-black text-xs rounded-xl shadow-md transition-all cursor-pointer shrink-0 flex items-center space-x-1.5"
              >
                <Plus className="w-4 h-4 text-[#1F140E]" />
                <span>Generate New Referral Link</span>
              </button>
            </div>

            {/* Referrals Ledger & Analytics */}
            <div className="space-y-3">
              <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-[#1F1813] flex items-center justify-between">
                <span>Active &amp; Claimed Referral Links ({memberReferrals.length})</span>
                <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Analytics Tracked
                </span>
              </h4>

              <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                {memberReferrals.map((ref) => (
                  <div key={ref.id} className="p-3 bg-white rounded-2xl border border-copper-penny/25 shadow-2xs space-y-2 text-xs font-sans">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-[#B87333] bg-[#FAF5EE] px-2 py-0.5 rounded border border-[#D4AF37]/30">
                        {ref.code}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase ${
                        ref.status === 'claimed'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-amber-100 text-amber-900 border border-amber-300'
                      }`}>
                        {ref.status === 'claimed' ? '✓ Claimed & Joined' : '● Active & Unclaimed'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between bg-neutral-50 p-2 rounded-xl border border-gray-200 gap-2 font-mono text-[11px]">
                      <span className="truncate text-gray-600">{ref.link}</span>
                      <button
                        type="button"
                        onClick={() => handleCopyReferralLink(ref.id, ref.link)}
                        className="px-3 py-1 bg-[#1F1813] hover:bg-[#2A221B] text-[#D4AF37] font-bold rounded-lg text-[10px] flex items-center space-x-1 cursor-pointer shrink-0"
                      >
                        {copiedReferralId === ref.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedReferralId === ref.id ? 'Copied!' : 'Copy Link'}</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-gray-500 font-mono pt-1 border-t border-gray-100">
                      <span>Source: {ref.analyticsSource}</span>
                      <span>Created: {ref.createdAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setIsReferralModalOpen(false)}
                className="px-5 py-2.5 bg-[#1F1813] text-[#FAF5EE] rounded-xl font-bold text-xs cursor-pointer"
              >
                Close Referral Hub
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
