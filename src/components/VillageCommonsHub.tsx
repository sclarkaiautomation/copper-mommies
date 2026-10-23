import React, { useState, useMemo, useEffect } from 'react';
import { 
  MessageSquare, 
  ShoppingBag, 
  Calendar, 
  Building2, 
  Plus, 
  Heart, 
  Bookmark, 
  Share2, 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Sparkles, 
  Send, 
  AlertTriangle, 
  Flag, 
  X, 
  Star, 
  ThumbsUp, 
  Home, 
  ArrowRight,
  Radio,
  Leaf,
  Layers,
  ChevronRight,
  ShieldAlert,
  RotateCcw,
  CheckCircle2,
  Briefcase,
  Handshake,
  Eye,
  Check
} from 'lucide-react';
import { 
  CommonsPost, 
  CommonsExchangeItem, 
  HousingListing, 
  VouchedBusiness, 
  CommonsEvent, 
  CommonsForumTopic,
  PageSpotlightBanner,
  ScholarshipEntry,
  BusinessAdSubmission
} from '../types';
import { 
  INITIAL_COMMONS_POSTS, 
  INITIAL_EXCHANGE_ITEMS, 
  INITIAL_HOUSING_LISTINGS, 
  INITIAL_VOUCHED_BUSINESSES, 
  INITIAL_COMMONS_EVENTS 
} from '../data/villageCommonsData';
import SpotlightBanner from './SpotlightBanner';
import VillageCommonsSidebar, { SavedCommonsItem } from './VillageCommonsSidebar';
import CircleMapInteractive from './CircleMapInteractive';
import CreateUnifiedListingModal from './CreateUnifiedListingModal';
import TradeHandshakeModal from './TradeHandshakeModal';
import { 
  getStoredUnifiedListings, 
  UnifiedListing, 
  MarketplaceCategoryType, 
  MultiStageTrade,
  getStoredTrades
} from '../data/unifiedMarketplaceStore';
import { scanContentForTriggers } from '../data/moderationFilter';
import InteractiveReplyBox, { FormattedContentWithHashtags } from './InteractiveReplyBox';

interface VillageCommonsHubProps {
  selectedState: string;
  userName: string;
  simulatedRole: 'applicant' | 'approved' | 'admin' | 'representative';
  onNavigateToTab?: (tab: string) => void;
  onOpenAdminOffice?: () => void;
  allSpotlightBanners?: PageSpotlightBanner[];
  onAddScholarshipEntry?: (entry: Omit<ScholarshipEntry, 'id' | 'submittedAt' | 'verifiedStatus' | 'ticketCode'>) => void;
  onOpenDirectChat?: (recipientName: string, contextTitle: string, initialNote?: string) => void;
  initialSubTab?: 'feed' | 'gigs' | 'exchange' | 'housing' | 'businesses' | 'events' | 'map';
  initialTopic?: string;
  onSubTabChange?: (tab: 'feed' | 'gigs' | 'exchange' | 'housing' | 'businesses' | 'events' | 'map') => void;
  createPostTriggerType?: 'feed' | 'exchange' | 'housing' | null;
  onClearPostTrigger?: () => void;
  onExecuteGlobalSearch?: (query: string) => void;
}

export default function VillageCommonsHub({
  selectedState = 'GA',
  userName = 'Mama Shantrece',
  simulatedRole = 'approved',
  onNavigateToTab,
  onOpenAdminOffice,
  allSpotlightBanners = [],
  onAddScholarshipEntry,
  onOpenDirectChat,
  initialSubTab = 'feed',
  initialTopic = 'all',
  onSubTabChange,
  createPostTriggerType = null,
  onClearPostTrigger,
  onExecuteGlobalSearch
}: VillageCommonsHubProps) {
  // ----------------------------------------------------
  // SUB-NAV SECTION STATE (LEFT COLUMN)
  // ----------------------------------------------------
  const [activeSubTab, setActiveSubTabState] = useState<'feed' | 'gigs' | 'exchange' | 'housing' | 'businesses' | 'events' | 'map'>(initialSubTab as any);

  const setActiveSubTab = (tab: 'feed' | 'gigs' | 'exchange' | 'housing' | 'businesses' | 'events' | 'map') => {
    setActiveSubTabState(tab);
    onSubTabChange?.(tab);
  };

  // Sync initialSubTab if changed externally
  useEffect(() => {
    if (initialSubTab) {
      setActiveSubTabState(initialSubTab);
    }
  }, [initialSubTab]);

  // Global Notification / Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  // ----------------------------------------------------
  // DATA STATES
  // ----------------------------------------------------
  const [posts, setPosts] = useState<CommonsPost[]>(() => {
    return INITIAL_COMMONS_POSTS.map(p => {
      if (p.id === 'post-4') {
        return {
          ...p,
          imageUrl: '/src/assets/images/sister_corinne_botany_teacher_1792314695063.jpg'
        };
      }
      return p;
    });
  });

  // Keep posts in sync with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('copper_mommies_commons_posts', JSON.stringify(posts));
    } catch {}
  }, [posts]);

  // Listen to external updates from AdminModerationQueue
  useEffect(() => {
    const handleSync = () => {
      try {
        const saved = localStorage.getItem('copper_mommies_commons_posts');
        if (saved) {
          setPosts(JSON.parse(saved));
        }
      } catch {}
    };
    window.addEventListener('copper_commons_posts_changed', handleSync);
    return () => window.removeEventListener('copper_commons_posts_changed', handleSync);
  }, []);
  const [exchangeItems, setExchangeItems] = useState<CommonsExchangeItem[]>(INITIAL_EXCHANGE_ITEMS);
  const [housingListings, setHousingListings] = useState<HousingListing[]>(INITIAL_HOUSING_LISTINGS);
  const [businesses, setBusinesses] = useState<VouchedBusiness[]>(INITIAL_VOUCHED_BUSINESSES);
  const [events, setEvents] = useState<CommonsEvent[]>(INITIAL_COMMONS_EVENTS);
  const [businessAds, setBusinessAds] = useState<BusinessAdSubmission[]>([]);

  // Fetch approved business ads from API
  useEffect(() => {
    fetch('/api/business-ads')
      .then(res => res.json())
      .then(data => {
        if (data && data.ads) {
          const approved = data.ads.filter((a: any) => a.status === 'approved' || a.status === 'approved_live' || a.status === 'active');
          if (approved.length > 0) {
            setBusinessAds(approved);
          }
        }
      })
      .catch(err => {
        console.warn('Could not load business ads for commons sidebar:', err);
      });
  }, []);

  // ----------------------------------------------------
  // UNIFIED MARKETPLACE & CROSS-HUB DUAL-SYNC STATE
  // ----------------------------------------------------
  const [unifiedListings, setUnifiedListings] = useState<UnifiedListing[]>(() => getStoredUnifiedListings());
  const [isUnifiedCreateModalOpen, setIsUnifiedCreateModalOpen] = useState(false);
  const [unifiedModalCategory, setUnifiedModalCategory] = useState<MarketplaceCategoryType>('barter');
  const [activeTradeListing, setActiveTradeListing] = useState<UnifiedListing | null>(null);
  const [activeTradeRecord, setActiveTradeRecord] = useState<MultiStageTrade | null>(null);
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
  const [selectedPhotoIndexMap, setSelectedPhotoIndexMap] = useState<Record<string, number>>({});
  const [photoLightboxUrl, setPhotoLightboxUrl] = useState<string | null>(null);
  const [gigSearch, setGigSearch] = useState('');
  const [gigTypeFilter, setGigTypeFilter] = useState<string>('all');
  const [exchangeStateFilter, setExchangeStateFilter] = useState<string>('all');
  const [exchangeSearch, setExchangeSearch] = useState('');

  useEffect(() => {
    const handleSync = () => {
      setUnifiedListings(getStoredUnifiedListings());
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
  // SAVED ITEMS & BOOKMARKS (COLUMN 3 ROW 1)
  // ----------------------------------------------------
  const [savedItems, setSavedItems] = useState<SavedCommonsItem[]>(() => {
    try {
      const saved = localStorage.getItem('copper_mommies_saved_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('copper_mommies_saved_items', JSON.stringify(savedItems));
    } catch {
      // ignore
    }
  }, [savedItems]);

  const isItemSaved = (id: string) => savedItems.some(i => i.id === id);

  const toggleSaveItem = (item: SavedCommonsItem) => {
    if (isItemSaved(item.id)) {
      setSavedItems(prev => prev.filter(i => i.id !== item.id));
      showToast(`Removed "${item.title}" from saved items.`);
    } else {
      setSavedItems(prev => [item, ...prev]);
      showToast(`⭐ Saved "${item.title}" to Column 3 Saved Items!`);
    }
  };

  const handleRemoveSavedItem = (id: string) => {
    setSavedItems(prev => prev.filter(i => i.id !== id));
    showToast('Removed from saved sanctuary items.');
  };

  // Saved / Suggested Item Detailed Review Modal (Column 3 Row 1 item selection)
  const [selectedReviewItem, setSelectedReviewItem] = useState<SavedCommonsItem | null>(null);

  // ----------------------------------------------------
  // IN-APP PRIVATE MESSAGING MODAL STATE
  // ----------------------------------------------------
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageRecipient, setMessageRecipient] = useState('');
  const [messageSubject, setMessageSubject] = useState('');
  const [messageContent, setMessageContent] = useState('');

  const handleOpenMessageModal = (recipientName: string, defaultSubject: string, defaultContent?: string) => {
    if (onOpenDirectChat) {
      onOpenDirectChat(recipientName, defaultSubject || 'Village Commons Inquiry', defaultContent || '');
      showToast(`💬 Opening floating chat with ${recipientName}...`);
    } else {
      setMessageRecipient(recipientName);
      setMessageSubject(defaultSubject);
      setMessageContent(defaultContent || '');
      setShowMessageModal(true);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageContent.trim()) {
      showToast('Please enter a message for sister ' + messageRecipient);
      return;
    }
    if (onOpenDirectChat) {
      onOpenDirectChat(messageRecipient, messageSubject || 'Housing & Property Listing', messageContent.trim());
    }
    setShowMessageModal(false);
    showToast(`🕊️ Private message safely sent to ${messageRecipient}! Chat thread opened in your Profile.`);
  };

  // ----------------------------------------------------
  // 1. VILLAGE COMMUNITY FEED & FORUMS LOGIC
  // ----------------------------------------------------
  const [selectedTopic, setSelectedTopic] = useState<string>(initialTopic || 'all');
  const [showTopicFilterModal, setShowTopicFilterModal] = useState<boolean>(false);
  const [forumSearch, setForumSearch] = useState('');
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');
  const [selectedAuthorProfile, setSelectedAuthorProfile] = useState<CommonsPost | null>(null);
  const [isSpotlightExpanded, setIsSpotlightExpanded] = useState(true);

  // Sync initialTopic when changed from drawer or props
  useEffect(() => {
    if (initialTopic) {
      setSelectedTopic(initialTopic);
    }
  }, [initialTopic]);

  // Handle external post triggers (e.g. from mobile bottom bar + button)
  useEffect(() => {
    if (createPostTriggerType === 'feed') {
      setIsNewPostModalOpen(true);
      onClearPostTrigger?.();
    } else if (createPostTriggerType === 'exchange') {
      setIsPostExchangeModalOpen(true);
      onClearPostTrigger?.();
    } else if (createPostTriggerType === 'housing') {
      setIsPostHousingModalOpen(true);
      onClearPostTrigger?.();
    }
  }, [createPostTriggerType]);

  // Exchange Extended Filters: category, state, my listings, saved searches
  const [exchangeCategorySelect, setExchangeCategorySelect] = useState<string>('all');
  const [exchangeStateSelect, setExchangeStateSelect] = useState<string>(selectedState || 'all');
  const [showOnlyMyListings, setShowOnlyMyListings] = useState<boolean>(false);
  const [showOnlySavedItems, setShowOnlySavedItems] = useState<boolean>(false);

  // New Post Form State
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTopic, setNewPostTopic] = useState<CommonsForumTopic>('daily-uplift');
  const [newPostImageUrl, setNewPostImageUrl] = useState('');

  // Report Post Pop-out Modal State (Ensures no accidental deletion!)
  const [postToReport, setPostToReport] = useState<CommonsPost | null>(null);
  const [reportReason, setReportReason] = useState<string>('Commercial / Wholesale Spam or Reselling');
  const [reportNotes, setReportNotes] = useState<string>('');
  const [confirmReportChecked, setConfirmReportChecked] = useState<boolean>(false);

  // Village Commons Feed Filter state ('all', 'giveaways', 'barter', 'announcements')
  const [feedFilterType, setFeedFilterType] = useState<'all' | 'giveaways' | 'barter' | 'announcements'>('all');

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      // CRITICAL: A reported post is NEVER deleted or hidden automatically on click!
      // Only hide if Mama Shantrece / Admin explicitly confirmed removal in the Admin Back Office:
      if (post.isRemovedByAdmin) return false;

      const textToSearch = `${post.title || ''} ${post.content} ${post.authorName} ${post.topic || ''}`.toLowerCase();
      const matchesSearch = textToSearch.includes(forumSearch.toLowerCase());
      if (!matchesSearch) return false;

      if (feedFilterType === 'all') return true;

      if (feedFilterType === 'giveaways') {
        return (
          post.postType === 'giveaway' ||
          post.topic === ('exchange' as any) ||
          post.topic === ('free-giveaway' as any) ||
          textToSearch.includes('free') ||
          textToSearch.includes('giveaway') ||
          textToSearch.includes('gift') ||
          textToSearch.includes('blessing') ||
          textToSearch.includes('complimentary')
        );
      }

      if (feedFilterType === 'barter') {
        return (
          post.postType === 'barter' ||
          post.topic === ('barter' as any) ||
          post.topic === ('homestead-seeds' as any) ||
          textToSearch.includes('barter') ||
          textToSearch.includes('trade') ||
          textToSearch.includes('swap') ||
          textToSearch.includes('exchange')
        );
      }

      if (feedFilterType === 'announcements') {
        return (
          post.postType === 'announcement' ||
          post.topic === 'daily-uplift' ||
          post.topic === ('announcement' as any) ||
          post.authorRole === 'Circle Host' ||
          post.authorRole === 'Circle Lead (Admin)' ||
          post.authorRole === 'Council Grandmother' ||
          textToSearch.includes('announcement') ||
          textToSearch.includes('gathering') ||
          textToSearch.includes('update') ||
          textToSearch.includes('reminder') ||
          textToSearch.includes('affirmation')
        );
      }

      return true;
    });
  }, [posts, forumSearch, feedFilterType]);

  const handleLikePost = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const alreadyLiked = p.likedBy.includes(userName);
        return {
          ...p,
          likesCount: alreadyLiked ? p.likesCount - 1 : p.likesCount + 1,
          likedBy: alreadyLiked ? p.likedBy.filter(u => u !== userName) : [...p.likedBy, userName]
        };
      }
      return p;
    }));
  };

  const handleAddComment = (postId: string) => {
    if (!commentInput.trim()) return;

    // Internal safety trigger check on comment
    const scanResult = scanContentForTriggers(commentInput.trim());
    if (scanResult.recommendedAction === 'block') {
      showToast(scanResult.warningMessage || '⚠️ Inappropriate words or scam triggers detected. Please adjust your reply.');
      return;
    }

    const newComment = {
      id: `c-${Date.now()}`,
      authorName: userName,
      authorLocation: `${selectedState} Circle`,
      content: commentInput.trim(),
      createdAt: 'Just now'
    };
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [...p.comments, newComment]
        };
      }
      return p;
    }));
    setCommentInput('');

    if (!scanResult.isClean) {
      showToast('💬 Sister reply posted and logged to guardian queue for review.');
    } else {
      showToast('💬 Sister reply posted to the community feed!');
    }
  };

  // Open the report pop-out with warning and common reasons dropdown (does NOT delete post)
  const handleOpenReportModal = (post: CommonsPost) => {
    setPostToReport(post);
    setReportReason('Commercial / Wholesale Spam or Reselling');
    setReportNotes('');
    setConfirmReportChecked(false);
  };

  // Confirm official report to Grandmother Council after reviewing warning and selecting reason
  const handleConfirmReport = () => {
    if (!postToReport) return;
    const postId = postToReport.id;
    const reportedAtStr = new Date().toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    setPosts(prev => {
      const next = prev.map(p => {
        if (p.id === postId) {
          const newCount = (p.reportCount || 0) + 1;
          const reportedByList = p.reportedBy ? [...p.reportedBy, userName] : [userName];
          return {
            ...p,
            isFlagged: true,
            reportCount: newCount,
            reportedBy: reportedByList,
            reportReason: reportReason,
            reportNotes: reportNotes.trim() || undefined,
            reportedAt: reportedAtStr,
            isRemovedByAdmin: false // POST REMAINS VISIBLE!
          };
        }
        return p;
      });
      try {
        localStorage.setItem('copper_mommies_commons_posts', JSON.stringify(next));
      } catch {}
      return next;
    });

    // Sync into persistent admin queue for Grandmother Council Back Office review
    try {
      const existingReportsStr = localStorage.getItem('copper_mommies_reported_posts');
      const existingReports = existingReportsStr ? JSON.parse(existingReportsStr) : [];
      const newReportEntry = {
        id: `rep-${Date.now()}`,
        postId: postId,
        itemType: 'forum_post',
        itemTitle: postToReport.title || postToReport.content.slice(0, 50) + '...',
        posterName: postToReport.authorName,
        posterState: postToReport.authorState,
        reportedBy: `${userName} (${selectedState})`,
        reason: reportReason + (reportNotes.trim() ? ` — Notes: ${reportNotes.trim()}` : ''),
        dateReported: reportedAtStr,
        itemSnippet: postToReport.content.slice(0, 160) + (postToReport.content.length > 160 ? '...' : ''),
        status: 'pending_review'
      };
      const updatedReports = [newReportEntry, ...existingReports.filter((r: any) => r.postId !== postId)];
      localStorage.setItem('copper_mommies_reported_posts', JSON.stringify(updatedReports));
      window.dispatchEvent(new CustomEvent('copper_reported_posts_updated'));
    } catch {}

    setPostToReport(null);
    showToast('🛡️ Post reported for review against community guidelines. The post remains visible in the feed.');
  };

  // Allows members or elders to undo an accidental report with a single click
  const handleUndoReport = (postId: string) => {
    setPosts(prev => {
      const next = prev.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            isFlagged: false,
            reportCount: 0,
            reportedBy: (p.reportedBy || []).filter(u => u !== userName),
            reportReason: undefined,
            reportNotes: undefined,
            isRemovedByAdmin: false
          };
        }
        return p;
      });
      try {
        localStorage.setItem('copper_mommies_commons_posts', JSON.stringify(next));
      } catch {}
      return next;
    });

    try {
      const existingReportsStr = localStorage.getItem('copper_mommies_reported_posts');
      if (existingReportsStr) {
        const existing = JSON.parse(existingReportsStr);
        const updated = existing.filter((r: any) => r.postId !== postId);
        localStorage.setItem('copper_mommies_reported_posts', JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent('copper_reported_posts_updated'));
      }
    } catch {}

    showToast('↩️ Report withdrawn! Post restored to completely clean status.');
  };

  // Restore all original reflections in case any were hidden
  const handleRestoreAllPosts = () => {
    setPosts(prev => {
      const existingMap = new Map<string, CommonsPost>();
      prev.forEach(p => existingMap.set(p.id, p));
      INITIAL_COMMONS_POSTS.forEach(ip => {
        const current = existingMap.get(ip.id);
        if (!current) {
          existingMap.set(ip.id, { ...ip, isRemovedByAdmin: false, isFlagged: false, reportCount: 0 });
        } else {
          existingMap.set(ip.id, { ...current, isRemovedByAdmin: false, isFlagged: false, reportCount: 0 });
        }
      });
      const restored = Array.from(existingMap.values());
      try {
        localStorage.setItem('copper_mommies_commons_posts', JSON.stringify(restored));
      } catch {}
      return restored;
    });
    showToast('✨ All village reflections restored and active in the feed!');
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) {
      showToast('Please write something to share with the village.');
      return;
    }

    // Run internal backend moderation filter check
    const scanResult = scanContentForTriggers(newPostContent, newPostTitle);
    if (scanResult.recommendedAction === 'block') {
      showToast(scanResult.warningMessage || '⚠️ Prohibited words or severe scam triggers detected. Please adjust your wording.');
      return;
    }

    const isAutoFlagged = !scanResult.isClean;
    const triggerWords = scanResult.matchedTriggers.map(t => t.word);
    const triggerCategory = scanResult.matchedTriggers.map(t => t.categoryLabel).join(', ');

    const createdPost: CommonsPost = {
      id: `post-${Date.now()}`,
      authorName: userName,
      authorRole: simulatedRole === 'admin' ? 'Circle Lead (Admin)' : simulatedRole === 'representative' ? 'Circle Host' : 'Verified Mother',
      authorState: selectedState,
      authorCity: 'Local Circle',
      authorAvatar: simulatedRole === 'admin' ? '👵' : '🕊️',
      topic: newPostTopic || 'open-stream',
      title: newPostTitle.trim() || undefined,
      content: newPostContent.trim(),
      imageUrl: newPostImageUrl.trim() || undefined,
      likesCount: 1,
      likedBy: [userName],
      comments: [],
      createdAt: 'Just now',
      isAutoFlaggedByFilter: isAutoFlagged,
      filterTriggerWords: triggerWords.length > 0 ? triggerWords : undefined,
      filterTriggerCategory: triggerCategory || undefined,
      filterSeverity: scanResult.highestSeverity !== 'none' ? scanResult.highestSeverity : undefined
    };

    setPosts([createdPost, ...posts]);
    setIsNewPostModalOpen(false);
    setNewPostTitle('');
    setNewPostContent('');
    setNewPostImageUrl('');

    // If auto-flagged by internal filter, log into backend & admin moderation queue
    if (isAutoFlagged) {
      try {
        fetch('/api/moderation/flagged-queue', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            postId: createdPost.id,
            itemType: 'forum_post',
            itemTitle: createdPost.title || createdPost.content.slice(0, 45),
            posterName: createdPost.authorName,
            posterState: createdPost.authorState,
            reportedBy: 'Internal Backend Trigger Filter (Auto)',
            reason: `Auto-flagged words: ${triggerWords.join(', ')} (${triggerCategory})`,
            matchedTriggers: triggerWords,
            triggerCategory,
            severity: scanResult.highestSeverity,
            itemSnippet: createdPost.content.slice(0, 160),
            autoFlagged: true
          })
        }).catch(() => {});

        const existingReportsStr = localStorage.getItem('copper_mommies_reported_posts');
        const existingReports = existingReportsStr ? JSON.parse(existingReportsStr) : [];
        const newReportEntry = {
          id: `flag-${Date.now()}`,
          postId: createdPost.id,
          itemType: 'forum_post',
          itemTitle: createdPost.title || createdPost.content.slice(0, 45),
          posterName: createdPost.authorName,
          posterState: createdPost.authorState,
          reportedBy: 'Internal Backend Trigger Filter (Auto)',
          reason: `Auto-flagged words: ${triggerWords.join(', ')} (${triggerCategory})`,
          matchedTriggers: triggerWords,
          dateReported: new Date().toLocaleDateString('en-US'),
          itemSnippet: createdPost.content.slice(0, 160),
          status: 'pending_review',
          autoFlagged: true,
          severity: scanResult.highestSeverity
        };
        localStorage.setItem('copper_mommies_reported_posts', JSON.stringify([newReportEntry, ...existingReports]));
        window.dispatchEvent(new CustomEvent('copper_reported_posts_updated'));
      } catch {}

      showToast('🛡️ Post shared to Village Stream and flagged for Grandmother Council review due to sensitive wording.');
    } else {
      showToast('✨ Your post is now live in the Village Stream!');
    }
  };

  // ----------------------------------------------------
  // UNIFIED MARKETPLACE FILTERED LISTINGS & CARD RENDERER
  // ----------------------------------------------------
  const filteredUnifiedGigs = useMemo(() => {
    return unifiedListings.filter(item => {
      if (item.categoryType !== 'gig') return false;
      const matchesSearch = !gigSearch.trim() ||
        item.title.toLowerCase().includes(gigSearch.toLowerCase()) ||
        item.description.toLowerCase().includes(gigSearch.toLowerCase()) ||
        (item.details.compensation && item.details.compensation.toLowerCase().includes(gigSearch.toLowerCase()));
      const matchesType = gigTypeFilter === 'all' || item.details.employmentType === gigTypeFilter;
      return matchesSearch && matchesType;
    });
  }, [unifiedListings, gigSearch, gigTypeFilter]);

  const filteredUnifiedBarters = useMemo(() => {
    return unifiedListings.filter(item => {
      if (item.categoryType !== 'barter') return false;
      const matchesSearch = !exchangeSearch.trim() || 
        item.title.toLowerCase().includes(exchangeSearch.toLowerCase()) ||
        item.description.toLowerCase().includes(exchangeSearch.toLowerCase()) ||
        (item.details.tradeForWishlist && item.details.tradeForWishlist.toLowerCase().includes(exchangeSearch.toLowerCase()));
      const matchesState = exchangeStateFilter === 'all' || item.authorState === exchangeStateFilter;
      return matchesSearch && matchesState;
    });
  }, [unifiedListings, exchangeSearch, exchangeStateFilter]);

  const filteredUnifiedHousing = useMemo(() => {
    return unifiedListings.filter(item => item.categoryType === 'housing');
  }, [unifiedListings]);

  const filteredUnifiedBusinesses = useMemo(() => {
    return unifiedListings.filter(item => item.categoryType === 'business');
  }, [unifiedListings]);

  const filteredUnifiedEvents = useMemo(() => {
    return unifiedListings.filter(item => item.categoryType === 'event');
  }, [unifiedListings]);

  const renderUnifiedListingCard = (
    listing: UnifiedListing, 
    hubTab: string, 
    hubLabel: string
  ) => {
    const activePhotoIdx = selectedPhotoIndexMap[listing.id] ?? 0;
    const currentPhoto = listing.photos[activePhotoIdx] || listing.primaryCoverImage;
    const isSaved = isItemSaved(listing.id);

    return (
      <div 
        key={listing.id}
        className="bg-white rounded-3xl overflow-hidden border border-copper-penny/25 hover:border-[#D4AF37] hover:shadow-xl transition-all p-5 space-y-4 text-left group"
      >
        {/* Main Cover Photo with Multi-Photo Switcher */}
        <div className="relative aspect-16/10 w-full rounded-2xl overflow-hidden bg-stone-100 group">
          <img 
            src={currentPhoto} 
            alt={listing.title} 
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 cursor-pointer"
            onClick={() => setPhotoLightboxUrl(currentPhoto)}
            referrerPolicy="no-referrer"
          />

          {/* Top Left Category Indicator */}
          <div className="absolute top-3 left-3 flex items-center space-x-1.5">
            <span className="px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold bg-[#1F140E]/90 text-[#D4AF37] border border-[#D4AF37]/50 shadow-md uppercase tracking-wider">
              {listing.categoryType === 'gig' ? '💼 Gig / Work' :
               listing.categoryType === 'housing' ? '🏡 Housing Suite' :
               listing.categoryType === 'barter' ? '🤝 Trade & Barter' :
               listing.categoryType === 'event' ? '📅 Circle Gathering' : '⭐ Sister Business'}
            </span>
            {listing.photos.length > 1 && (
              <span className="px-2 py-1 rounded-xl text-[10px] font-mono font-bold bg-black/75 text-white backdrop-blur-xs flex items-center space-x-1">
                <span>📸</span>
                <span>{listing.photos.length} photos</span>
              </span>
            )}
          </div>

          {/* Bookmark & Enlarge Actions */}
          <div className="absolute top-3 right-3 flex items-center space-x-1.5">
            <button
              type="button"
              onClick={() => setPhotoLightboxUrl(currentPhoto)}
              className="p-2 rounded-xl bg-black/60 hover:bg-black/80 text-white backdrop-blur-xs transition-colors cursor-pointer"
              title="Enlarge photo in full view"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => toggleSaveItem({
                id: listing.id,
                type: listing.categoryType === 'gig' ? 'forum' : (listing.categoryType as any),
                title: listing.title,
                subtitle: listing.description.slice(0, 60) + '...',
                imageUrl: listing.primaryCoverImage,
                categoryBadge: listing.categoryType.toUpperCase(),
                location: `${listing.authorCity || ''}, ${listing.authorState}`,
                terms: listing.details.compensation || listing.details.monthlyTerms || listing.details.estimatedValue
              })}
              className={`p-2 rounded-xl bg-black/60 backdrop-blur-xs transition-colors cursor-pointer ${
                isSaved ? 'text-[#D4AF37]' : 'text-white/80 hover:text-[#D4AF37]'
              }`}
              title={isSaved ? "Saved" : "Save item"}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[#D4AF37]' : ''}`} />
            </button>
          </div>
        </div>

        {/* Thumbnail Gallery Row if Multi-Photo */}
        {listing.photos.length > 1 && (
          <div className="flex items-center space-x-2 overflow-x-auto py-1 scrollbar-none">
            {listing.photos.map((photo, pIdx) => {
              const isActive = pIdx === activePhotoIdx;
              return (
                <button
                  key={pIdx}
                  type="button"
                  onClick={() => setSelectedPhotoIndexMap(prev => ({ ...prev, [listing.id]: pIdx }))}
                  className={`relative shrink-0 w-14 h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    isActive ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/50 scale-105 shadow-sm' : 'border-stone-200 hover:border-stone-400 opacity-70 hover:opacity-100'
                  }`}
                  title={`View photo ${pIdx + 1}`}
                >
                  <img src={photo} alt={`Thumbnail ${pIdx + 1}`} className="w-full h-full object-cover" />
                </button>
              );
            })}
          </div>
        )}

        {/* Metadata & Title */}
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-soft-sage font-mono">
            <span>{listing.authorCity ? `${listing.authorCity}, ${listing.authorState}` : listing.authorState}</span>
            <span>·</span>
            <span>Posted {listing.createdAt}</span>
            <span>·</span>
            <span className="text-[#1F1813] font-bold">{listing.authorName}</span>
          </div>

          <h3 className="font-serif font-black text-lg sm:text-xl text-[#1F1813] leading-snug">
            {listing.title}
          </h3>

          <p className="text-xs text-[#2A221B]/85 leading-relaxed">
            {listing.description}
          </p>
        </div>

        {/* Category Specific Structured Details Box */}
        {listing.categoryType === 'gig' && listing.details && (
          <div className="p-3.5 rounded-2xl bg-[#FAF5EE] border border-copper-penny/20 space-y-2 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-copper-penny/10 pb-2">
              <span className="font-mono text-[11px] font-extrabold text-[#B87333]">
                💰 {listing.details.compensation}
              </span>
              <span className="font-mono text-[11px] text-[#1F1813]/70 font-bold">
                {listing.details.employmentType} · {listing.details.remoteOrInPerson}
              </span>
            </div>

            {listing.details.requirements && listing.details.requirements.length > 0 && (
              <div className="space-y-1 pt-1">
                <span className="text-[10px] font-mono font-bold text-soft-sage uppercase tracking-wider block">
                  Requirements &amp; Equipment Needed:
                </span>
                <ul className="space-y-1">
                  {listing.details.requirements.map((req, rIdx) => (
                    <li key={rIdx} className="flex items-start space-x-1.5 text-xs text-[#1F1813]/85">
                      <span className="text-emerald-700 font-bold">✓</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {listing.details.duties && listing.details.duties.length > 0 && (
              <div className="space-y-1 pt-1">
                <span className="text-[10px] font-mono font-bold text-soft-sage uppercase tracking-wider block">
                  Key Duties &amp; Tasks:
                </span>
                <ul className="space-y-1">
                  {listing.details.duties.map((duty, dIdx) => (
                    <li key={dIdx} className="flex items-start space-x-1.5 text-xs text-[#1F1813]/85">
                      <span className="text-[#B87333] font-bold">•</span>
                      <span>{duty}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {listing.categoryType === 'barter' && listing.details && (
          <div className="p-3.5 rounded-2xl bg-[#FAF5EE] border border-copper-penny/20 space-y-2 text-xs">
            {listing.details.tradeForWishlist && (
              <div className="p-2.5 rounded-xl bg-white border border-[#D4AF37]/40 space-y-0.5">
                <span className="text-[10px] font-mono font-extrabold text-[#B87333] uppercase block">
                  Looking to Trade For (Sister Wishlist):
                </span>
                <p className="font-medium text-[#1F1813] text-xs">
                  {listing.details.tradeForWishlist}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-[#1F1813]/80 pt-1">
              <div>
                <span className="text-soft-sage block text-[9px] uppercase">Condition:</span>
                <span className="font-bold">{listing.details.itemCondition || 'Artisanal / Handmade'}</span>
              </div>
              <div>
                <span className="text-soft-sage block text-[9px] uppercase">Est. Value:</span>
                <span className="font-bold text-[#B87333]">{listing.details.estimatedValue || 'Open Value'}</span>
              </div>
              <div className="col-span-2">
                <span className="text-soft-sage block text-[9px] uppercase">Pickup &amp; Delivery:</span>
                <span className="font-bold">{listing.details.deliveryOrPickup || 'Sister Drop-off / Pick-up'}</span>
              </div>
            </div>
          </div>
        )}

        {listing.categoryType === 'housing' && listing.details && (
          <div className="p-3.5 rounded-2xl bg-[#FAF5EE] border border-copper-penny/20 space-y-2 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-copper-penny/10 pb-2">
              <span className="font-mono text-[11px] font-extrabold text-[#1F140E]">
                {listing.details.bedrooms || 1}BR · {listing.details.bathrooms || 1}BA {listing.details.squareFootage ? `· ${listing.details.squareFootage} sq ft` : ''}
              </span>
              <span className="font-mono text-[11px] font-bold text-[#B87333]">
                {listing.details.monthlyTerms}
              </span>
            </div>

            <div className="text-[11px] font-mono text-soft-sage">
              <span>Pet Policy: <strong className="text-[#1F140E]">{listing.details.petPolicy || 'Pets welcome'}</strong></span>
              {listing.details.availableDate && <span> · Available: <strong className="text-[#1F140E]">{listing.details.availableDate}</strong></span>}
            </div>

            {listing.details.amenities && listing.details.amenities.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {listing.details.amenities.map((am, aIdx) => (
                  <span key={aIdx} className="px-2 py-0.5 rounded-lg bg-white border border-stone-200 text-[10px] font-mono text-[#1F140E]">
                    ✓ {am}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {listing.categoryType === 'business' && listing.details && (
          <div className="p-3.5 rounded-2xl bg-[#FAF5EE] border border-copper-penny/20 space-y-2 text-xs">
            {listing.details.communityOffer && (
              <div className="p-2.5 rounded-xl bg-white border border-[#D4AF37]/50 text-amber-900 font-mono text-xs font-bold">
                {listing.details.communityOffer}
              </div>
            )}
            {listing.details.servicesList && (
              <div className="text-xs space-y-1">
                <span className="text-[10px] font-mono text-soft-sage uppercase block">Services Offered:</span>
                <p className="text-xs text-[#1F1813]/85">{listing.details.servicesList.join(' • ')}</p>
              </div>
            )}
          </div>
        )}

        {listing.categoryType === 'event' && listing.details && (
          <div className="p-3.5 rounded-2xl bg-[#FAF5EE] border border-copper-penny/20 space-y-2 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-copper-penny/10 pb-2">
              <span className="font-mono text-xs font-bold text-copper-penny">
                📅 {listing.details.eventDate} · {listing.details.eventTime}
              </span>
              <span className="font-mono text-[11px] text-soft-sage">
                👥 Cap: {listing.details.participantCap || 20} sisters
              </span>
            </div>
            {listing.details.suppliesNeeded && listing.details.suppliesNeeded.length > 0 && (
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-soft-sage uppercase block">Supplies to Bring:</span>
                <ul className="text-xs space-y-0.5 text-[#1F1813]/80">
                  {listing.details.suppliesNeeded.map((s, sIdx) => (
                    <li key={sIdx} className="flex items-center space-x-1.5">
                      <span className="text-[#B87333]">•</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons Row */}
        <div className="pt-2 border-t border-copper-penny/10 flex flex-wrap items-center justify-between gap-2">
          {/* Deep link button to corresponding dedicated hub */}
          <button
            type="button"
            onClick={() => {
              if (onNavigateToTab) onNavigateToTab(hubTab);
            }}
            className="px-3 py-1.5 rounded-xl bg-[#FAF5EE] hover:bg-stone-200 text-[#1F140E] text-[11px] font-mono font-bold border border-copper-penny/25 transition-colors cursor-pointer flex items-center space-x-1"
          >
            <span>{hubLabel}</span>
            <ArrowRight className="w-3.5 h-3.5 inline ml-1 text-[#B87333]" />
          </button>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => onOpenDirectChat?.(listing.authorName, `Listing: ${listing.title}`, `Hi ${listing.authorName}, I saw your listing for "${listing.title}" in the Village Commons and wanted to connect!`)}
              className="px-3 py-1.5 bg-white hover:bg-neutral-50 rounded-xl text-[11px] font-mono font-bold border border-copper-penny/25 text-[#1F140E] cursor-pointer"
            >
              💌 Message Sister
            </button>

            {(listing.categoryType === 'barter' || listing.categoryType === 'gig') && (
              <button
                type="button"
                onClick={() => handleOpenTradeForListing(listing)}
                className="px-4 py-1.5 bg-[#B87333] hover:bg-[#1F140E] text-white rounded-xl text-[11px] font-mono font-extrabold uppercase tracking-wider transition-all shadow-sm cursor-pointer flex items-center space-x-1.5"
              >
                <Handshake className="w-3.5 h-3.5" />
                <span>{listing.categoryType === 'gig' ? 'Apply / Handshake' : 'Initiate Trade'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ----------------------------------------------------
  // 2. THE EXCHANGE (FREE & BARTER) LOGIC
  // ----------------------------------------------------
  const [exchangeTypeFilter, setExchangeTypeFilter] = useState<'all' | 'free' | 'barter' | 'time-credit'>('all');
  const [exchangeCategoryFilter, setExchangeCategoryFilter] = useState<string>('all');
  const [selectedExchangeItem, setSelectedExchangeItem] = useState<CommonsExchangeItem | null>(null);
  const [isPostExchangeModalOpen, setIsPostExchangeModalOpen] = useState(false);

  // Post Item Form State
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemType, setNewItemType] = useState<'free' | 'barter' | 'time-credit'>('free');
  const [newItemCategory, setNewItemCategory] = useState<CommonsExchangeItem['category']>('Baby & Toddler');
  const [newItemTerms, setNewItemTerms] = useState('');
  const [newItemCity, setNewItemCity] = useState('');
  const [newItemImageUrl, setNewItemImageUrl] = useState('');

  const filteredExchangeItems = useMemo(() => {
    return exchangeItems.filter(item => {
      const matchesType = exchangeTypeFilter === 'all' || item.type === exchangeTypeFilter;
      const matchesCat = exchangeCategorySelect === 'all' || item.category === exchangeCategorySelect;
      const matchesState = exchangeStateSelect === 'all' || item.locationState === exchangeStateSelect;
      const matchesMyListings = !showOnlyMyListings || item.authorName.toLowerCase() === userName.toLowerCase();
      const matchesSaved = !showOnlySavedItems || isItemSaved(item.id);
      const matchesSearch = 
        item.title.toLowerCase().includes(exchangeSearch.toLowerCase()) ||
        item.description.toLowerCase().includes(exchangeSearch.toLowerCase()) ||
        item.terms.toLowerCase().includes(exchangeSearch.toLowerCase()) ||
        item.locationCity.toLowerCase().includes(exchangeSearch.toLowerCase()) ||
        item.locationState.toLowerCase().includes(exchangeSearch.toLowerCase());
      return matchesType && matchesCat && matchesState && matchesMyListings && matchesSaved && matchesSearch;
    });
  }, [exchangeItems, exchangeTypeFilter, exchangeCategorySelect, exchangeStateSelect, showOnlyMyListings, showOnlySavedItems, exchangeSearch, userName, savedItems]);

  const handleCreateExchangeItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemTitle.trim() || !newItemDesc.trim()) {
      showToast('Please provide an item title and description.');
      return;
    }

    const createdItem: CommonsExchangeItem = {
      id: `item-${Date.now()}`,
      title: newItemTitle.trim(),
      description: newItemDesc.trim(),
      type: newItemType,
      category: newItemCategory,
      imageUrl: newItemImageUrl.trim() || '/barter_trade_sister_exchange.jpg',
      locationCity: newItemCity.trim() || 'Atlanta',
      locationState: selectedState || 'GA',
      distanceMiles: 3.5,
      terms: newItemTerms.trim() || (newItemType === 'free' ? '100% Free Gift' : 'Open to Barter'),
      authorName: userName,
      authorContactType: 'in-app',
      createdAt: 'Just now',
      active: true
    };

    setExchangeItems([createdItem, ...exchangeItems]);
    setIsPostExchangeModalOpen(false);
    setNewItemTitle('');
    setNewItemDesc('');
    setNewItemTerms('');
    setNewItemCity('');
    setNewItemImageUrl('');
    showToast(`🎉 "${createdItem.title}" published to The Exchange!`);
  };

  // ----------------------------------------------------
  // 3. SANCTUARY HOUSING & LAND LOGIC
  // ----------------------------------------------------
  const [housingTypeFilter, setHousingTypeFilter] = useState<string>('all');
  const [housingChildrenFilter, setHousingChildrenFilter] = useState(false);
  const [selectedHousingItem, setSelectedHousingItem] = useState<HousingListing | null>(null);
  const [isPostHousingModalOpen, setIsPostHousingModalOpen] = useState(false);

  // New Housing Form State
  const [newHouseTitle, setNewHouseTitle] = useState('');
  const [newHouseSpaceType, setNewHouseSpaceType] = useState<HousingListing['spaceType']>('room');
  const [newHouseTxType, setNewHouseTxType] = useState<HousingListing['transactionType']>('rent');
  const [newHousePricing, setNewHousePricing] = useState('');
  const [newHouseRegion, setNewHouseRegion] = useState('');
  const [newHouseShowPrivacy, setNewHouseShowPrivacy] = useState(false);
  const [newHousePhone, setNewHousePhone] = useState('');
  const [newHouseAddress, setNewHouseAddress] = useState('');
  const [newHouseChildren, setNewHouseChildren] = useState(true);
  const [newHouseChildrenDetails, setNewHouseChildrenDetails] = useState('');
  const [newHousePrivateBath, setNewHousePrivateBath] = useState(true);
  const [newHousePrivateEntrance, setNewHousePrivateEntrance] = useState(false);
  const [newHouseLandAcreage, setNewHouseLandAcreage] = useState('');
  const [newHouseRules, setNewHouseRules] = useState('');
  const [newHouseImageUrl, setNewHouseImageUrl] = useState('');

  const filteredHousing = useMemo(() => {
    return housingListings.filter(h => {
      const matchesType = housingTypeFilter === 'all' || h.spaceType === housingTypeFilter;
      const matchesChildren = !housingChildrenFilter || h.accommodatesChildren;
      return matchesType && matchesChildren;
    });
  }, [housingListings, housingTypeFilter, housingChildrenFilter]);

  const handleCreateHousing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHouseTitle.trim() || !newHousePricing.trim() || !newHouseRegion.trim()) {
      showToast('Please specify the title, clear pricing terms, and general area.');
      return;
    }

    const createdHousing: HousingListing = {
      id: `house-${Date.now()}`,
      title: newHouseTitle.trim(),
      spaceType: newHouseSpaceType,
      transactionType: newHouseTxType,
      pricingTerms: newHousePricing.trim(),
      regionOrCity: newHouseRegion.trim(),
      stateCode: selectedState || 'GA',
      showAddressAndPhone: newHouseShowPrivacy,
      phone: newHouseShowPrivacy ? newHousePhone.trim() : undefined,
      address: newHouseShowPrivacy ? newHouseAddress.trim() : undefined,
      accommodatesChildren: newHouseChildren,
      childrenDetails: newHouseChildrenDetails.trim() || 'Mothers and children embraced warmly.',
      privateBath: newHousePrivateBath,
      privateEntrance: newHousePrivateEntrance,
      landAcreage: newHouseLandAcreage.trim() || undefined,
      rulesAndExpectations: newHouseRules.trim() || 'Peaceful, respectful sovereign household.',
      imageUrl: newHouseImageUrl.trim() || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80',
      authorName: userName,
      createdAt: 'Just now',
      isVerifiedSpace: true
    };

    setHousingListings([createdHousing, ...housingListings]);
    setIsPostHousingModalOpen(false);
    setNewHouseTitle('');
    setNewHousePricing('');
    setNewHouseRegion('');
    setNewHouseChildrenDetails('');
    setNewHouseRules('');
    setNewHouseImageUrl('');
    showToast('🏡 Sanctuary housing opportunity posted for verified sisters!');
  };

  // ----------------------------------------------------
  // 4. SISTER BUSINESSES & VOUCHED FAVES LOGIC
  // ----------------------------------------------------
  const [bizIndustryFilter, setBizIndustryFilter] = useState<string>('all');
  const [bizSearch, setBizSearch] = useState('');
  const [isRegisterBizModalOpen, setIsRegisterBizModalOpen] = useState(false);

  // New Business Form State
  const [newBizName, setNewBizName] = useState('');
  const [newBizIndustry, setNewBizIndustry] = useState<VouchedBusiness['industry']>('Holistic Health');
  const [newBizCity, setNewBizCity] = useState('');
  const [newBizOffer, setNewBizOffer] = useState('');
  const [newBizDiscount, setNewBizDiscount] = useState('');
  const [newBizWebsite, setNewBizWebsite] = useState('');
  const [newBizEmail, setNewBizEmail] = useState('');
  const [newBizImage, setNewBizImage] = useState('');

  const filteredBusinesses = useMemo(() => {
    return businesses.filter(b => {
      const matchesInd = bizIndustryFilter === 'all' || b.industry === bizIndustryFilter;
      const matchesSearch = 
        b.name.toLowerCase().includes(bizSearch.toLowerCase()) ||
        b.ownerName.toLowerCase().includes(bizSearch.toLowerCase()) ||
        b.offerDescription.toLowerCase().includes(bizSearch.toLowerCase());
      return matchesInd && matchesSearch;
    });
  }, [businesses, bizIndustryFilter, bizSearch]);

  const handleVouchForBusiness = (bizId: string) => {
    setBusinesses(prev => prev.map(b => {
      if (b.id === bizId) {
        const alreadyVouched = b.vouchedBy.includes(userName);
        if (alreadyVouched) {
          showToast(`You have already vouched for ${b.name}`);
          return b;
        }
        showToast(`⭐ You vouched for ${b.name}! Your sister recommendation is recorded.`);
        return {
          ...b,
          vouchesCount: b.vouchesCount + 1,
          vouchedBy: [...b.vouchedBy, userName]
        };
      }
      return b;
    }));
  };

  const handleRegisterBusiness = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBizName.trim() || !newBizOffer.trim()) {
      showToast('Please provide a business name and description.');
      return;
    }

    const createdBiz: VouchedBusiness = {
      id: `biz-${Date.now()}`,
      name: newBizName.trim(),
      ownerName: userName,
      industry: newBizIndustry,
      locationCity: newBizCity.trim() || 'Atlanta',
      locationState: selectedState || 'GA',
      website: newBizWebsite.trim() || undefined,
      contactEmail: newBizEmail.trim() || `${userName.toLowerCase().replace(/\s+/g, '')}@coppermommies.internal`,
      offerDescription: newBizOffer.trim(),
      sisterDiscountOrBarter: newBizDiscount.trim() || '✨ Special barter & discount for Copper Mommies',
      imageUrl: newBizImage.trim() || '/apothecary_sister_herbal.jpg',
      vouchesCount: 1,
      vouchedBy: [userName],
      sisterTestimonials: [],
      isMemberOwned: true,
      isFeaturedSponsor: false,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setBusinesses([createdBiz, ...businesses]);
    setIsRegisterBizModalOpen(false);
    setNewBizName('');
    setNewBizOffer('');
    setNewBizDiscount('');
    setNewBizWebsite('');
    setNewBizEmail('');
    setNewBizImage('');
    showToast(`🎉 "${createdBiz.name}" registered to Sister Businesses!`);
  };

  // ----------------------------------------------------
  // 5. VILLAGE GATHERINGS & EVENTS LOGIC
  // ----------------------------------------------------
  const [eventFilter, setEventFilter] = useState<'all' | 'going' | 'interested' | 'state'>('all');
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);

  // New Event Form State (Spearhead & Admin Only)
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventTime, setNewEventTime] = useState('');
  const [newEventLocType, setNewEventLocType] = useState<'in-person' | 'virtual'>('in-person');
  const [newEventVenue, setNewEventVenue] = useState('');
  const [newEventVirtualLink, setNewEventVirtualLink] = useState('');
  const [newEventDesc, setNewEventDesc] = useState('');
  const [newEventCategory, setNewEventCategory] = useState<CommonsEvent['category']>('Circle Gathering');
  const [newEventCover, setNewEventCover] = useState('');

  const isUserSpearheadOrAdmin = simulatedRole === 'admin' || simulatedRole === 'representative';

  const filteredEvents = useMemo(() => {
    return events.filter(ev => {
      const userRsvp = ev.rsvps[userName];
      if (eventFilter === 'going') return userRsvp === 'going';
      if (eventFilter === 'interested') return userRsvp === 'interested';
      if (eventFilter === 'state') return ev.stateCode === selectedState || ev.stateCode === 'National';
      return true;
    });
  }, [events, eventFilter, userName, selectedState]);

  const handleUpdateRsvp = (eventId: string, status: 'interested' | 'going' | 'declined') => {
    setEvents(prev => prev.map(ev => {
      if (ev.id === eventId) {
        return {
          ...ev,
          rsvps: {
            ...ev.rsvps,
            [userName]: status
          }
        };
      }
      return ev;
    }));
    showToast(`📅 RSVP updated: Marked as "${status.toUpperCase()}" for ${events.find(e => e.id === eventId)?.title}`);
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim() || !newEventDate.trim() || !newEventDesc.trim()) {
      showToast('Please provide an event title, date, and description.');
      return;
    }

    const createdEvent: CommonsEvent = {
      id: `ev-${Date.now()}`,
      title: newEventTitle.trim(),
      coverImageUrl: newEventCover.trim() || 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80',
      date: newEventDate.trim(),
      time: newEventTime.trim() || '2:00 PM EST',
      locationType: newEventLocType,
      venueOrCity: newEventVenue.trim() || (newEventLocType === 'virtual' ? 'Virtual Video Sanctuary' : `${selectedState} Regional Pavilion`),
      stateCode: newEventLocType === 'virtual' ? 'National' : selectedState,
      virtualLink: newEventVirtualLink.trim() || undefined,
      description: newEventDesc.trim(),
      category: newEventCategory,
      postedByRole: simulatedRole === 'admin' ? 'admin' : 'spearhead',
      postedByName: `${userName} (${simulatedRole === 'admin' ? 'Circle Lead' : 'State Spearhead'})`,
      rsvps: {
        [userName]: 'going'
      },
      createdAt: 'Just now'
    };

    setEvents([createdEvent, ...events]);
    setIsCreateEventModalOpen(false);
    setNewEventTitle('');
    setNewEventDate('');
    setNewEventTime('');
    setNewEventVenue('');
    setNewEventDesc('');
    setNewEventCover('');
    showToast(`🎉 Gathering "${createdEvent.title}" scheduled and announced to the sisterhood!`);
  };

  // Image Upload Helper (converts file to Base64 preview)
  const handleImageFileSelect = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
        showToast('📷 Photo attached successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-[1520px] mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-6 animate-fade-in text-[#1F140E]">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1F140E] text-[#D4AF37] px-5 py-3 rounded-2xl border-2 border-[#D4AF37]/50 shadow-2xl font-mono text-xs font-bold flex items-center space-x-2 animate-bounce">
          <span>✨</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* CONDENSED STREAMLINED HEADER (SAVES 75% REAL ESTATE) */}
      {/* ---------------------------------------------------- */}
      <div className="rounded-2xl bg-gradient-to-r from-[#1F140E] via-[#2A1D16] to-[#140F0B] px-4 py-3 sm:px-6 sm:py-3.5 border border-[#B87333]/40 shadow-md text-[#FAF5EE] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5 min-w-0">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 uppercase tracking-widest shrink-0">
            🏡 Village Commons
          </span>
          <div className="min-w-0">
            <h1 className="font-serif font-black text-sm sm:text-base text-[#FAF5EE] tracking-tight truncate">
              {selectedState} Regional Circle &bull; Daily Sanctuary &amp; Mutual Exchange
            </h1>
            <p className="text-[11px] text-[#FAF5EE]/75 font-sans hidden md:block truncate">
              Live feed, free giveaways, authentic barter trades, sanctuary housing, and sister-vouched businesses.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsSpotlightExpanded(prev => !prev)}
          className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B87333] text-[#1F140E] font-mono text-[11px] font-black flex items-center space-x-1.5 transition-all cursor-pointer shadow-md shrink-0"
          title="Toggle featured spotlight announcements banner"
        >
          <span>✨</span>
          <span>{isSpotlightExpanded ? 'Hide Featured Sister Enterprises' : 'Show Featured Sister Enterprises'}</span>
          <span className="text-[9px] bg-white text-[#1F140E] px-1.5 py-0.2 rounded-full font-sans font-extrabold ml-1">
            {allSpotlightBanners.length > 0 ? allSpotlightBanners.length : 2}
          </span>
        </button>
      </div>

      {/* CONDENSED COLLAPSIBLE SPOTLIGHT BANNER */}
      {isSpotlightExpanded && (
        <div className="w-full animate-fade-in">
          <SpotlightBanner
            banners={allSpotlightBanners.length > 0 ? allSpotlightBanners : [
              {
                id: 'feat-biz-1',
                title: 'Highland Heritage Botanical Co.',
                subtitle: 'Ancestral Cold-Pressed Oxymels & Nettle Remedies',
                description: 'Hand-harvested elderberry, mullein & lowcountry nettle remedies formulated by traditional southern rootworkers.',
                bannerImage: '/apothecary_sister_herbal.jpg',
                thumbnailImage: '/apothecary_sister_herbal.jpg',
                badge: 'Featured Sister Enterprise',
                externalLink: 'https://highlandheritagebotanicals.com',
                exclusiveOffer: '15% Off with code COPPERMOMMIE',
                promoCode: 'COPPER15',
                active: true
              },
              {
                id: 'feat-biz-2',
                title: 'NestBright Coop & Homeschool Academy',
                subtitle: 'Grades 3–5 Living Books & Math Manipulative Curricula',
                description: 'Empowering melanated homeschooling families with holistic, self-directed learning paths and community co-ops.',
                bannerImage: '/nestbright_banner.jpg',
                thumbnailImage: '/nestbright_banner.jpg',
                badge: 'Featured Sister Enterprise',
                externalLink: 'https://nestbrightcoop.example',
                exclusiveOffer: '$20 off curriculum bundle',
                promoCode: 'NESTBRIGHT20',
                active: true
              }
            ]}
            userName={userName}
            selectedState={selectedState}
            onAddScholarshipEntry={onAddScholarshipEntry}
            isAdmin={simulatedRole === 'admin'}
            onOpenAdminManager={onOpenAdminOffice}
            autoScrollIntervalMs={5000}
            sectionTitle="Featured Sister Enterprises & Community Spotlights"
          />
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 3-COLUMN SEAMLESS VILLAGE COMMONS LAYOUT             */}
      {/* ---------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ================================================== */}
        {/* COLUMN 1: LEFT NAVIGATION (BORDERLESS)             */}
        {/* ================================================== */}
        <nav 
          className="lg:col-span-3 xl:col-span-2.5 space-y-4 font-mono text-xs border-none"
          aria-label="Village Commons Navigation"
        >
          {/* ========================================================== */}
          {/* MOBILE & TABLET (< lg): ZERO CUT-OFF RESPONSIVE 5-TAB BAR  */}
          {/* ========================================================== */}
          <div className="lg:hidden space-y-2">
            {/* 6 Core Tabs in a fluid, 100% visible zero-cutoff container */}
            <div className="w-full grid grid-cols-6 [grid-template-columns:repeat(6,minmax(0,1fr))] gap-1 sm:gap-1.5 p-1 sm:p-1.5 bg-white/95 backdrop-blur-xs rounded-2xl border border-copper-penny/25 shadow-xs overflow-hidden">
              
              {/* 1. The Village Stream */}
              <button
                type="button"
                onClick={() => setActiveSubTab('feed')}
                className={`min-w-0 w-full py-2 px-0.5 sm:px-1.5 rounded-xl transition-all cursor-pointer flex flex-col items-center justify-center text-center relative group active:scale-95 ${
                  activeSubTab === 'feed'
                    ? 'bg-[#1F140E] text-[#D4AF37] shadow-sm ring-1 ring-[#D4AF37]/50 font-bold'
                    : 'text-[#1F140E]/80 hover:bg-[#FAF5EE]'
                }`}
                title="The Village Stream: daily mother reflections, encouragement, remedies & wisdom"
              >
                <span className="text-sm xs:text-base sm:text-lg mb-0.5 shrink-0">🌿</span>
                <span className="font-serif font-bold text-[9px] xs:text-[10px] sm:text-xs leading-tight truncate w-full block">
                  Stream
                </span>
                <span className="hidden sm:inline text-[9px] font-mono text-soft-sage leading-none">Feed</span>
              </button>

              {/* 2. Opportunities & Gigs */}
              <button
                type="button"
                onClick={() => setActiveSubTab('gigs')}
                className={`min-w-0 w-full py-2 px-0.5 sm:px-1.5 rounded-xl transition-all cursor-pointer flex flex-col items-center justify-center text-center relative group active:scale-95 ${
                  activeSubTab === 'gigs'
                    ? 'bg-[#1F140E] text-[#D4AF37] shadow-sm ring-1 ring-[#D4AF37]/50 font-bold'
                    : 'text-[#1F140E]/80 hover:bg-[#FAF5EE]'
                }`}
                title="Opportunities & Gigs: contracts, doula roles, homestead tasks & micro-gigs"
              >
                <span className="text-sm xs:text-base sm:text-lg mb-0.5 shrink-0">💼</span>
                <span className="font-serif font-bold text-[9px] xs:text-[10px] sm:text-xs leading-tight truncate w-full block">
                  Gigs
                </span>
                <span className="hidden sm:inline text-[9px] font-mono text-soft-sage leading-none">Desk</span>
              </button>

              {/* 3. The Exchange */}
              <button
                type="button"
                onClick={() => setActiveSubTab('exchange')}
                className={`min-w-0 w-full py-2 px-0.5 sm:px-1.5 rounded-xl transition-all cursor-pointer flex flex-col items-center justify-center text-center relative group active:scale-95 ${
                  activeSubTab === 'exchange'
                    ? 'bg-[#1F140E] text-[#D4AF37] shadow-sm ring-1 ring-[#D4AF37]/50 font-bold'
                    : 'text-[#1F140E]/80 hover:bg-[#FAF5EE]'
                }`}
                title="The Exchange: free giveaways, barter items & time credits"
              >
                <span className="relative inline-flex items-center justify-center text-sm xs:text-base sm:text-lg mb-0.5 shrink-0">
                  🤝
                  {exchangeItems.filter(i => i.type === 'free').length > 0 && (
                    <span className="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white" />
                  )}
                </span>
                <span className="font-serif font-bold text-[9px] xs:text-[10px] sm:text-xs leading-tight truncate w-full block">
                  Exchange
                </span>
                <span className="hidden sm:inline text-[9px] font-mono text-emerald-700 font-bold leading-none">
                  {exchangeItems.filter(i => i.type === 'free').length} Free
                </span>
              </button>

              {/* 4. Housing & Land */}
              <button
                type="button"
                onClick={() => setActiveSubTab('housing')}
                className={`min-w-0 w-full py-2 px-0.5 sm:px-1.5 rounded-xl transition-all cursor-pointer flex flex-col items-center justify-center text-center relative group active:scale-95 ${
                  activeSubTab === 'housing'
                    ? 'bg-[#1F140E] text-[#D4AF37] shadow-sm ring-1 ring-[#D4AF37]/50 font-bold'
                    : 'text-[#1F140E]/80 hover:bg-[#FAF5EE]'
                }`}
                title="Sanctuary Housing & Land: rooms, maternity suites & homestead acreage"
              >
                <span className="text-sm xs:text-base sm:text-lg mb-0.5 shrink-0">🏡</span>
                <span className="font-serif font-bold text-[9px] xs:text-[10px] sm:text-xs leading-tight truncate w-full block">
                  Housing
                </span>
                <span className="hidden sm:inline text-[9px] font-mono text-soft-sage leading-none">&amp; Land</span>
              </button>

              {/* 5. Sister Businesses */}
              <button
                type="button"
                onClick={() => setActiveSubTab('businesses')}
                className={`min-w-0 w-full py-2 px-0.5 sm:px-1.5 rounded-xl transition-all cursor-pointer flex flex-col items-center justify-center text-center relative group active:scale-95 ${
                  activeSubTab === 'businesses'
                    ? 'bg-[#1F140E] text-[#D4AF37] shadow-sm ring-1 ring-[#D4AF37]/50 font-bold'
                    : 'text-[#1F140E]/80 hover:bg-[#FAF5EE]'
                }`}
                title="Sister Businesses: directory & vouched sister services"
              >
                <span className="text-sm xs:text-base sm:text-lg mb-0.5 shrink-0">⭐</span>
                <span className="font-serif font-bold text-[9px] xs:text-[10px] sm:text-xs leading-tight truncate w-full block">
                  Business
                </span>
                <span className="hidden sm:inline text-[9px] font-mono text-soft-sage leading-none">Directory</span>
              </button>

              {/* 6. Gatherings */}
              <button
                type="button"
                onClick={() => setActiveSubTab('events')}
                className={`min-w-0 w-full py-2 px-0.5 sm:px-1.5 rounded-xl transition-all cursor-pointer flex flex-col items-center justify-center text-center relative group active:scale-95 ${
                  activeSubTab === 'events'
                    ? 'bg-[#1F140E] text-[#D4AF37] shadow-sm ring-1 ring-[#D4AF37]/50 font-bold'
                    : 'text-[#1F140E]/80 hover:bg-[#FAF5EE]'
                }`}
                title="Gatherings & Events: state circle meetups & national live dialogues"
              >
                <span className="text-sm xs:text-base sm:text-lg mb-0.5 shrink-0">📅</span>
                <span className="font-serif font-bold text-[9px] xs:text-[10px] sm:text-xs leading-tight truncate w-full block">
                  <span className="xs:hidden">Circles</span>
                  <span className="hidden xs:inline">Gatherings</span>
                </span>
                <span className="hidden sm:inline text-[9px] font-mono text-soft-sage leading-none">Events</span>
              </button>

            </div>

            {/* Mobile Utility & Map Switch Strip */}
            <div className="flex items-center justify-between gap-2 px-0.5">
              <button
                type="button"
                onClick={() => setActiveSubTab('map')}
                className={`px-2.5 sm:px-3 py-1.5 rounded-xl font-mono text-[10px] sm:text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 border shrink-0 ${
                  activeSubTab === 'map'
                    ? 'bg-[#1F140E] text-[#D4AF37] border-[#D4AF37] shadow-xs'
                    : 'bg-white hover:bg-[#FAF5EE] text-[#1F140E] border-copper-penny/25'
                }`}
                title="Interactive US Circle Map"
              >
                <span>🗺️</span>
                <span className="hidden xs:inline">Interactive</span>
                <span>Circle Map</span>
                <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-[#D4AF37]/20 text-[#1F140E] font-bold">
                  US Pins
                </span>
              </button>

              <div className="flex-1 min-w-0 text-right">
                <span className="inline-block max-w-full truncate px-2.5 py-1 rounded-xl bg-[#FAF5EE] border border-copper-penny/20 text-[10px] sm:text-[11px] font-mono text-soft-sage font-bold">
                  {activeSubTab === 'feed' && '🌿 Village Stream'}
                  {activeSubTab === 'gigs' && '💼 Opportunities & Gigs'}
                  {activeSubTab === 'exchange' && '🤝 The Exchange'}
                  {activeSubTab === 'housing' && '🏡 Housing & Land'}
                  {activeSubTab === 'businesses' && '⭐ Sister Directory'}
                  {activeSubTab === 'events' && '📅 Circle Gatherings'}
                  {activeSubTab === 'map' && '🗺️ Circle Map'}
                </span>
              </div>
            </div>
          </div>

          {/* ========================================================== */}
          {/* DESKTOP (lg:): FULL VERTICAL SIDEBAR (ORIGINAL EXPERIENCE) */}
          {/* ========================================================== */}
          <div className="hidden lg:flex lg:flex-col gap-1.5 p-1 border-none">
            
            <button
              onClick={() => setActiveSubTab('feed')}
              className={`w-full text-left px-3.5 py-3 rounded-2xl font-bold transition-all cursor-pointer flex items-center justify-between group ${
                activeSubTab === 'feed'
                  ? 'bg-[#1F140E] text-[#D4AF37] shadow-md border border-[#D4AF37]/40'
                  : 'text-[#1F140E]/80 hover:bg-[#FAF5EE] hover:text-[#1F140E]'
              }`}
              title="The Village Stream: daily mother reflections, encouragement, remedies, and sisterhood wisdom"
            >
              <div className="flex items-center space-x-2.5">
                <span className="text-base">🌿</span>
                <span className="font-serif font-bold text-xs sm:text-sm">The Village Stream</span>
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform ${activeSubTab === 'feed' ? 'text-[#D4AF37] translate-x-0.5' : 'opacity-30 group-hover:opacity-80'}`} />
            </button>

            <button
              onClick={() => setActiveSubTab('gigs')}
              className={`w-full text-left px-3.5 py-3 rounded-2xl font-bold transition-all cursor-pointer flex items-center justify-between group ${
                activeSubTab === 'gigs'
                  ? 'bg-[#1F140E] text-[#D4AF37] shadow-md border border-[#D4AF37]/40'
                  : 'text-[#1F140E]/80 hover:bg-[#FAF5EE] hover:text-[#1F140E]'
              }`}
              title="Opportunities & Gigs: micro-gigs, doula support, homestead contracts, and work trade"
            >
              <div className="flex items-center space-x-2.5">
                <span className="text-base">💼</span>
                <span className="font-serif font-bold text-xs sm:text-sm">Opportunities &amp; Gigs</span>
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform ${activeSubTab === 'gigs' ? 'text-[#D4AF37] translate-x-0.5' : 'opacity-30 group-hover:opacity-80'}`} />
            </button>

            <button
              onClick={() => setActiveSubTab('exchange')}
              className={`w-full text-left px-3.5 py-3 rounded-2xl font-bold transition-all cursor-pointer flex items-center justify-between group ${
                activeSubTab === 'exchange'
                  ? 'bg-[#1F140E] text-[#D4AF37] shadow-md border border-[#D4AF37]/40'
                  : 'text-[#1F140E]/80 hover:bg-[#FAF5EE] hover:text-[#1F140E]'
              }`}
              title="The Exchange: free giveaways, barter items, and time-credits"
            >
              <div className="flex items-center space-x-2.5">
                <span className="text-base">🤝</span>
                <span className="font-serif font-bold text-xs sm:text-sm">The Exchange</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[9px] bg-emerald-800 text-emerald-100 font-bold">
                {exchangeItems.filter(i => i.type === 'free').length} Free
              </span>
            </button>

            <button
              onClick={() => setActiveSubTab('housing')}
              className={`w-full text-left px-3.5 py-3 rounded-2xl font-bold transition-all cursor-pointer flex items-center justify-between group ${
                activeSubTab === 'housing'
                  ? 'bg-[#1F140E] text-[#D4AF37] shadow-md border border-[#D4AF37]/40'
                  : 'text-[#1F140E]/80 hover:bg-[#FAF5EE] hover:text-[#1F140E]'
              }`}
              title="Sanctuary Housing & Land: rooms, maternity suites, and homestead acreage"
            >
              <div className="flex items-center space-x-2.5">
                <span className="text-base">🏡</span>
                <span className="font-serif font-bold text-xs sm:text-sm">Housing &amp; Land</span>
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform ${activeSubTab === 'housing' ? 'text-[#D4AF37] translate-x-0.5' : 'opacity-30 group-hover:opacity-80'}`} />
            </button>

            <button
              onClick={() => setActiveSubTab('businesses')}
              className={`w-full text-left px-3.5 py-3 rounded-2xl font-bold transition-all cursor-pointer flex items-center justify-between group ${
                activeSubTab === 'businesses'
                  ? 'bg-[#1F140E] text-[#D4AF37] shadow-md border border-[#D4AF37]/40'
                  : 'text-[#1F140E]/80 hover:bg-[#FAF5EE] hover:text-[#1F140E]'
              }`}
              title="Sister Businesses & Vouched Faves: community trust directory and vouch voting"
            >
              <div className="flex items-center space-x-2.5">
                <span className="text-base">⭐</span>
                <span className="font-serif font-bold text-xs sm:text-sm">Sister Businesses</span>
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform ${activeSubTab === 'businesses' ? 'text-[#D4AF37] translate-x-0.5' : 'opacity-30 group-hover:opacity-80'}`} />
            </button>

            <button
              onClick={() => setActiveSubTab('events')}
              className={`w-full text-left px-3.5 py-3 rounded-2xl font-bold transition-all cursor-pointer flex items-center justify-between group ${
                activeSubTab === 'events'
                  ? 'bg-[#1F140E] text-[#D4AF37] shadow-md border border-[#D4AF37]/40'
                  : 'text-[#1F140E]/80 hover:bg-[#FAF5EE] hover:text-[#1F140E]'
              }`}
              title="Gatherings & Events: state circle meetups and national live dialogues"
            >
              <div className="flex items-center space-x-2.5">
                <span className="text-base">📅</span>
                <span className="font-serif font-bold text-xs sm:text-sm">Gatherings</span>
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform ${activeSubTab === 'events' ? 'text-[#D4AF37] translate-x-0.5' : 'opacity-30 group-hover:opacity-80'}`} />
            </button>

            <button
              onClick={() => setActiveSubTab('map')}
              className={`w-full text-left px-3.5 py-3 rounded-2xl font-bold transition-all cursor-pointer flex items-center justify-between group ${
                activeSubTab === 'map'
                  ? 'bg-[#1F140E] text-[#D4AF37] shadow-md border border-[#D4AF37]/40'
                  : 'text-[#1F140E]/80 hover:bg-[#FAF5EE] hover:text-[#1F140E]'
              }`}
              title="Interactive US Circle Map: visualize active Circle locations and state gatherings across America"
            >
              <div className="flex items-center space-x-2.5">
                <span className="text-base">🗺️</span>
                <span className="font-serif font-bold text-xs sm:text-sm">Circle Map</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[9px] bg-[#D4AF37]/20 text-[#1F140E] font-bold border border-[#D4AF37]/40">
                US Pins
              </span>
            </button>

          </div>

          {/* Primary Post Action Button */}
          <div className="pt-2">
            {activeSubTab === 'feed' && (
              <button
                onClick={() => setIsNewPostModalOpen(true)}
                className="w-full py-3 bg-gradient-to-r from-[#B87333] to-[#D4AF37] text-white font-mono text-xs font-bold rounded-2xl shadow-md hover:scale-102 active:scale-98 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                title="Share a reflection, remedy advice, question, or encouragement with the sisterhood"
              >
                <Plus className="w-4 h-4" />
                <span>+ Share Reflection / Post</span>
              </button>
            )}

            {activeSubTab === 'gigs' && (
              <button
                onClick={() => {
                  setUnifiedModalCategory('gig');
                  setIsUnifiedCreateModalOpen(true);
                }}
                className="w-full py-3 bg-[#1F140E] hover:bg-[#2A1D16] text-[#D4AF37] font-mono text-xs font-bold rounded-2xl shadow-md border border-[#D4AF37]/50 flex items-center justify-center space-x-2 cursor-pointer transition-all"
                title="Post a gig, doula contract, or trade opportunity with multi-photos & dual-sync"
              >
                <Plus className="w-4 h-4" />
                <span>+ Post Gig / Opportunity</span>
              </button>
            )}

            {activeSubTab === 'exchange' && (
              <button
                onClick={() => {
                  setUnifiedModalCategory('barter');
                  setIsUnifiedCreateModalOpen(true);
                }}
                className="w-full py-3 bg-gradient-to-r from-emerald-800 to-emerald-700 text-white font-mono text-xs font-bold rounded-2xl shadow-md hover:scale-102 active:scale-98 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                title="Post a barter item or trade offer with multi-photos and dual-hub sync"
              >
                <Plus className="w-4 h-4" />
                <span>+ Post Barter / Trade</span>
              </button>
            )}

            {activeSubTab === 'housing' && (
              <button
                onClick={() => {
                  setUnifiedModalCategory('housing');
                  setIsUnifiedCreateModalOpen(true);
                }}
                className="w-full py-3 bg-[#1F140E] hover:bg-[#2A1D16] text-[#D4AF37] font-mono text-xs font-bold rounded-2xl shadow-md border border-[#D4AF37]/50 flex items-center justify-center space-x-2 cursor-pointer transition-all"
                title="Post a room, cottage, respite suite, or land opportunity with specs & photos"
              >
                <Plus className="w-4 h-4" />
                <span>+ Post Space or Land</span>
              </button>
            )}

            {activeSubTab === 'businesses' && (
              <button
                onClick={() => {
                  setUnifiedModalCategory('business');
                  setIsUnifiedCreateModalOpen(true);
                }}
                className="w-full py-3 bg-gradient-to-r from-[#B87333] to-[#D4AF37] text-white font-mono text-xs font-bold rounded-2xl shadow-md hover:scale-102 active:scale-98 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                title="Register your sister business with photos & community offers"
              >
                <Plus className="w-4 h-4" />
                <span>+ Register Business</span>
              </button>
            )}

            {activeSubTab === 'events' && (
              <button
                onClick={() => {
                  setUnifiedModalCategory('event');
                  setIsUnifiedCreateModalOpen(true);
                }}
                className="w-full py-3 bg-gradient-to-r from-[#B87333] to-[#D4AF37] text-white font-mono text-xs font-bold rounded-2xl shadow-md hover:scale-102 active:scale-98 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                title="Schedule a circle gathering with supplies list & RSVP tracking"
              >
                <Plus className="w-4 h-4" />
                <span>+ Create Gathering</span>
              </button>
            )}
          </div>

          {activeSubTab === 'housing' && (
            <div className="bg-[#FAF5EE] rounded-2xl p-3 border border-copper-penny/15 space-y-2">
              <span className="text-[10px] uppercase font-bold text-soft-sage block">Housing Types:</span>
              <div className="space-y-1">
                <button
                  onClick={() => setHousingTypeFilter('all')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                    housingTypeFilter === 'all' ? 'bg-[#1F140E] text-[#D4AF37]' : 'hover:bg-white text-[#1F140E]/80'
                  }`}
                >
                  All Spaces ({housingListings.length})
                </button>
                <button
                  onClick={() => setHousingTypeFilter('room')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                    housingTypeFilter === 'room' ? 'bg-[#1F140E] text-[#D4AF37]' : 'hover:bg-white text-[#1F140E]/80'
                  }`}
                >
                  🏡 Room / Suite
                </button>
                <button
                  onClick={() => setHousingTypeFilter('maternity')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                    housingTypeFilter === 'maternity' ? 'bg-[#1F140E] text-[#D4AF37]' : 'hover:bg-white text-[#1F140E]/80'
                  }`}
                >
                  🌿 Rest & Recovery Suite
                </button>
                <button
                  onClick={() => setHousingTypeFilter('land')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                    housingTypeFilter === 'land' ? 'bg-[#1F140E] text-[#D4AF37]' : 'hover:bg-white text-[#1F140E]/80'
                  }`}
                >
                  🌾 Homestead Land
                </button>
                <button
                  onClick={() => setHousingTypeFilter('rental')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                    housingTypeFilter === 'rental' ? 'bg-[#1F140E] text-[#D4AF37]' : 'hover:bg-white text-[#1F140E]/80'
                  }`}
                >
                  🔑 Long-Term Rental
                </button>
              </div>
            </div>
          )}


        </nav>

        {/* ================================================== */}
        {/* COLUMN 2: CENTER MEMBER POSTS & CONTENT            */}
        {/* ================================================== */}
        <section 
          className="lg:col-span-6 xl:col-span-6.5 space-y-6"
          aria-label="Village Commons Posts and Listings"
        >
          {/* SEARCH & FILTERS BAR */}
          <div className="bg-white p-3 sm:p-4 rounded-2xl border border-copper-penny/20 shadow-xs space-y-3">
            <div className="flex items-center justify-between gap-2.5">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-copper-penny absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={activeSubTab === 'feed' ? forumSearch : activeSubTab === 'exchange' ? exchangeSearch : bizSearch}
                  onChange={(e) => {
                    if (activeSubTab === 'feed') setForumSearch(e.target.value);
                    else if (activeSubTab === 'exchange') setExchangeSearch(e.target.value);
                    else setBizSearch(e.target.value);
                  }}
                  placeholder={
                    activeSubTab === 'feed'
                      ? 'Search forum posts, natural remedies, mother wisdom & questions...'
                      : activeSubTab === 'exchange'
                      ? 'Search free items, barter trades, baby gear, tools...'
                      : 'Search sister businesses, offerings & vouched services...'
                  }
                  className="w-full pl-9 pr-3 py-2 bg-[#FAF5EE] border border-copper-penny/20 rounded-xl text-xs font-sans focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                  title="Search keyword input"
                />
              </div>

              {/* Village Stream Open Feed Status Indicator with Internal Safety Shield */}
              {activeSubTab === 'feed' && (
                <div 
                  className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 bg-[#FAF5EE] text-[#1F140E] border border-copper-penny/25 shrink-0"
                  title="The Village Stream is open to all community reflections, guarded by the backend Sanctuary Trigger & Safety Filter"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#B87333]" />
                  <span className="hidden sm:inline">Open Village Stream</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono font-bold">
                    Filter Active
                  </span>
                </div>
              )}
            </div>

            {/* STREAMLINED VILLAGE COMMONS FEED FILTER BAR */}
            {activeSubTab === 'feed' && (
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pt-2.5 border-t border-copper-penny/15 min-w-0 w-full overflow-hidden">
                
                {/* Streamlined Dropdown Select */}
                <div className="flex items-center space-x-2 text-xs font-mono min-w-0 w-full md:w-auto">
                  <Filter className="w-3.5 h-3.5 text-[#B87333] shrink-0" />
                  <span className="text-[10px] text-gray-500 uppercase font-bold shrink-0">Filter:</span>
                  <select
                    value={feedFilterType}
                    onChange={(e) => setFeedFilterType(e.target.value as any)}
                    className="flex-1 md:flex-initial bg-[#FAF5EE] border border-copper-penny/30 rounded-xl px-2.5 py-1.5 text-xs font-bold text-[#1F140E] font-mono focus:outline-none focus:ring-1 focus:ring-[#D4AF37] cursor-pointer truncate shadow-2xs max-w-full"
                    title="Filter Village Commons feed posts"
                  >
                    <option value="all">🌐 All Feed Activity ({posts.length})</option>
                    <option value="giveaways">🎁 Free Giveaways</option>
                    <option value="barter">🤝 Barter Requests</option>
                    <option value="announcements">📢 Community Announcements</option>
                  </select>
                </div>

                {/* Streamlined Quick Filter Buttons (Compact & Responsive for Notebooks/Laptops) */}
                <div className="flex items-center gap-1.5 text-xs font-mono overflow-x-auto pb-0.5 md:pb-0 scrollbar-none max-w-full shrink-0">
                  <button
                    type="button"
                    onClick={() => setFeedFilterType('all')}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer shrink-0 ${
                      feedFilterType === 'all'
                        ? 'bg-[#1F140E] text-[#D4AF37] shadow-xs'
                        : 'bg-[#FAF5EE] text-[#1F140E]/80 hover:bg-[#F0E6D8]'
                    }`}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    onClick={() => setFeedFilterType('giveaways')}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer flex items-center space-x-1 shrink-0 ${
                      feedFilterType === 'giveaways'
                        ? 'bg-emerald-800 text-white shadow-xs'
                        : 'bg-emerald-50 text-emerald-900 border border-emerald-300/40 hover:bg-emerald-100'
                    }`}
                  >
                    <span>🎁</span>
                    <span>Free</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFeedFilterType('barter')}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer flex items-center space-x-1 shrink-0 ${
                      feedFilterType === 'barter'
                        ? 'bg-[#1F140E] text-[#D4AF37] shadow-xs'
                        : 'bg-amber-50 text-amber-950 border border-amber-300/40 hover:bg-amber-100'
                    }`}
                  >
                    <span>🤝</span>
                    <span>Barter</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFeedFilterType('announcements')}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer flex items-center space-x-1 shrink-0 ${
                      feedFilterType === 'announcements'
                        ? 'bg-[#B87333] text-white shadow-xs'
                        : 'bg-orange-50 text-orange-950 border border-orange-300/40 hover:bg-orange-100'
                    }`}
                  >
                    <span>📢</span>
                    <span>News</span>
                  </button>
                </div>

              </div>
            )}

            {/* THE EXCHANGE EXTENDED CONTROLS ROW (Matching Reference Layout) */}
            {activeSubTab === 'exchange' && (
              <div className="space-y-2.5 pt-1 border-t border-copper-penny/15">
                {/* Top quick toggle tabs: All Items | My Listings | Saved Searches / Items | Free | Barter */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => {
                      setShowOnlyMyListings(false);
                      setShowOnlySavedItems(false);
                      setExchangeTypeFilter('all');
                    }}
                    className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                      !showOnlyMyListings && !showOnlySavedItems && exchangeTypeFilter === 'all'
                        ? 'bg-[#1F140E] text-[#D4AF37] shadow-xs'
                        : 'bg-[#FAF5EE] text-[#1F140E]/80 hover:bg-[#F0E6D8]'
                    }`}
                  >
                    All Listings
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowOnlyMyListings(true);
                      setShowOnlySavedItems(false);
                    }}
                    className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                      showOnlyMyListings
                        ? 'bg-[#B87333] text-white shadow-xs'
                        : 'bg-[#FAF5EE] text-[#1F140E]/80 hover:bg-[#F0E6D8]'
                    }`}
                  >
                    👤 My Listings
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowOnlySavedItems(true);
                      setShowOnlyMyListings(false);
                    }}
                    className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                      showOnlySavedItems
                        ? 'bg-[#D4AF37] text-[#1F140E] shadow-xs font-black'
                        : 'bg-[#FAF5EE] text-[#1F140E]/80 hover:bg-[#F0E6D8]'
                    }`}
                  >
                    <Bookmark className="w-3 h-3 text-copper-penny" />
                    <span>Saved Search ({savedItems.filter(i => i.type === 'exchange').length})</span>
                  </button>

                  <div className="h-4 w-px bg-copper-penny/20 mx-1 hidden sm:block" />

                  <button
                    type="button"
                    onClick={() => {
                      setShowOnlyMyListings(false);
                      setShowOnlySavedItems(false);
                      setExchangeTypeFilter('free');
                    }}
                    className={`px-2.5 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                      exchangeTypeFilter === 'free' && !showOnlyMyListings && !showOnlySavedItems
                        ? 'bg-emerald-800 text-white'
                        : 'bg-emerald-50 text-emerald-900 border border-emerald-300/40 hover:bg-emerald-100'
                    }`}
                  >
                    🟢 Free Giveaways
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowOnlyMyListings(false);
                      setShowOnlySavedItems(false);
                      setExchangeTypeFilter('barter');
                    }}
                    className={`px-2.5 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                      exchangeTypeFilter === 'barter' && !showOnlyMyListings && !showOnlySavedItems
                        ? 'bg-[#1F140E] text-[#D4AF37]'
                        : 'bg-amber-50 text-amber-950 border border-amber-300/40 hover:bg-amber-100'
                    }`}
                  >
                    🤝 Barter Only
                  </button>
                </div>

                {/* Dropdowns row: Filter by State & Filter by Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <div className="flex items-center space-x-1.5 bg-[#FAF5EE] border border-copper-penny/25 rounded-xl px-2.5 py-1.5 text-xs font-mono">
                    <MapPin className="w-3.5 h-3.5 text-[#B87333] shrink-0" />
                    <span className="text-[10px] text-gray-500 uppercase font-bold shrink-0">State:</span>
                    <select
                      value={exchangeStateSelect}
                      onChange={(e) => setExchangeStateSelect(e.target.value)}
                      className="bg-transparent border-none text-xs font-bold text-[#1F140E] font-mono focus:outline-none cursor-pointer w-full"
                      title="Filter listings by state circle"
                    >
                      <option value="all">All State Circles</option>
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

                  <div className="flex items-center space-x-1.5 bg-[#FAF5EE] border border-copper-penny/25 rounded-xl px-2.5 py-1.5 text-xs font-mono">
                    <Filter className="w-3.5 h-3.5 text-copper-penny shrink-0" />
                    <span className="text-[10px] text-gray-500 uppercase font-bold shrink-0">Category:</span>
                    <select
                      value={exchangeCategorySelect}
                      onChange={(e) => setExchangeCategorySelect(e.target.value)}
                      className="bg-transparent border-none text-xs font-bold text-[#1F140E] font-mono focus:outline-none cursor-pointer w-full"
                      title="Filter listings by category"
                    >
                      <option value="all">All Categories</option>
                      <option value="Baby & Toddler">Baby &amp; Toddler</option>
                      <option value="Homeschool Books & Supplies">Homeschool Books &amp; Supplies</option>
                      <option value="Homestead & Farm">Homestead &amp; Farm</option>
                      <option value="Herbal Remedies">Herbal Remedies</option>
                      <option value="Furniture & Household">Furniture &amp; Household</option>
                      <option value="Clothing & Apparel">Clothing &amp; Apparel</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* VIEW: 1. VILLAGE FORUMS & DAILY POSTS */}
          {activeSubTab === 'feed' && (
            <div className="space-y-5 animate-fade-in">
              
              {/* If no posts yet in this circle/topic, display featured banner at top first */}
              {filteredPosts.length === 0 && (
                <div className="space-y-4">
                  {allSpotlightBanners.length > 0 && (
                    <div className="rounded-3xl overflow-hidden border border-[#D4AF37]/50 shadow-md">
                      <SpotlightBanner
                        banners={allSpotlightBanners}
                        userName={userName}
                        selectedState={selectedState}
                        onAddScholarshipEntry={onAddScholarshipEntry}
                        isAdmin={simulatedRole === 'admin'}
                        onOpenAdminManager={onOpenAdminOffice}
                        autoScrollIntervalMs={5000}
                        sectionTitle="Featured Partner Spotlight"
                      />
                    </div>
                  )}

                  <div className="bg-white rounded-3xl border border-copper-penny/20 p-8 text-center space-y-3">
                    <span className="text-3xl">🕊️</span>
                    <h3 className="font-serif font-bold text-base text-[#1F140E]">
                      Be the First Sister to Speak Life in this Circle
                    </h3>
                    <p className="text-xs text-soft-sage max-w-md mx-auto">
                      No posts found in this topic or search yet. Share an encouragement, ask for remedy advice, or offer support to your sisters.
                    </p>
                    <button
                      onClick={() => setIsNewPostModalOpen(true)}
                      className="px-5 py-2.5 bg-[#1F140E] hover:bg-[#2A1D16] text-[#D4AF37] font-mono text-xs font-bold rounded-2xl shadow-sm transition-all cursor-pointer"
                    >
                      + Create the First Post
                    </button>
                  </div>
                </div>
              )}

              {filteredPosts.map((post, postIndex) => {
                const isLiked = post.likedBy.includes(userName);
                const saved = isItemSaved(post.id);
                const shouldShowInterspersedAd = (postIndex === 1 || postIndex === 4);
                
                return (
                  <React.Fragment key={post.id}>
                    <article 
                      className="bg-white rounded-3xl border border-copper-penny/20 p-5 sm:p-6 shadow-sm space-y-4 hover:border-[#D4AF37]/50 transition-all"
                    >
                      {/* Header - Author Image & Name Clickable */}
                      <div className="flex items-center justify-between">
                        <div 
                          onClick={() => setSelectedAuthorProfile(post)}
                          className="flex items-center space-x-3 cursor-pointer group"
                          title={`Click to view ${post.authorName}'s profile and send direct message`}
                        >
                          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#B87333] to-[#D4AF37] text-white flex items-center justify-center font-serif font-black text-lg shadow-xs group-hover:scale-105 transition-transform">
                            {post.authorAvatar || '🕊️'}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="font-serif font-bold text-sm text-[#1F140E] group-hover:text-copper-penny group-hover:underline transition-colors">
                                {post.authorName}
                              </h4>
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-[#FAF5EE] text-[#B87333] border border-copper-penny/20">
                                {post.authorRole}
                              </span>
                            </div>
                            <p className="text-[10px] font-mono text-soft-sage">
                              {post.authorCity}, {post.authorState} Circle • {post.createdAt}
                            </p>
                          </div>
                        </div>

                        {/* Bookmark & Report */}
                        <div className="flex items-center space-x-1">
                          <button
                            type="button"
                            onClick={() => toggleSaveItem({
                              id: post.id,
                              type: 'forum',
                              title: post.title || 'Community Wisdom',
                              subtitle: post.content.slice(0, 70) + '...',
                              imageUrl: post.imageUrl || 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&w=600&q=80',
                              categoryBadge: 'Community Post',
                              location: `${post.authorCity}, ${post.authorState}`
                            })}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              saved ? 'text-[#D4AF37] bg-amber-50' : 'text-neutral-400 hover:text-[#D4AF37]'
                            }`}
                            title={saved ? 'Saved in Column 3' : 'Save to Column 3 Saved Items'}
                          >
                            <Bookmark className={`w-4 h-4 ${saved ? 'fill-[#D4AF37]' : ''}`} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenReportModal(post)}
                            className="p-1.5 text-neutral-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Report post"
                          >
                            <Flag className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="space-y-2">
                        {post.title && (
                          <h3 className="font-serif font-bold text-base text-[#1F140E]">{post.title}</h3>
                        )}
                        <p className="text-xs sm:text-sm text-[#1F140E]/90 leading-relaxed font-sans whitespace-pre-line">
                          <FormattedContentWithHashtags content={post.content} onHashtagClick={onExecuteGlobalSearch} />
                        </p>
                      </div>

                      {/* Image Attachment (Melanated Representation) */}
                      {post.imageUrl && (
                        <div className="rounded-2xl overflow-hidden max-h-96 border border-copper-penny/15">
                          <img 
                            src={post.imageUrl} 
                            alt="Community post photo" 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      )}

                      {/* Interactions */}
                      <div className="flex items-center justify-between pt-2 border-t border-copper-penny/10 text-xs font-mono">
                        <div className="flex items-center space-x-4">
                          <button
                            type="button"
                            onClick={() => handleLikePost(post.id)}
                            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                              isLiked 
                                ? 'bg-rose-50 text-rose-700 font-bold border border-rose-200' 
                                : 'text-[#1F140E]/70 hover:bg-[#FAF5EE]'
                            }`}
                            title="Give Sisterhood Care"
                          >
                            <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-600 text-rose-600' : ''}`} />
                            <span>{post.likesCount} {post.likesCount === 1 ? 'Affirmation' : 'Affirmations'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-[#1F140E]/70 hover:bg-[#FAF5EE] transition-all cursor-pointer"
                            title="View all replies and reply to Sister"
                          >
                            <MessageSquare className="w-4 h-4 text-copper-penny" />
                            <span>{post.comments.length} Replies</span>
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleOpenMessageModal(post.authorName, `Regarding your post: "${post.title || 'Community Post'}"`)}
                          className="text-copper-penny hover:text-amber-800 text-[11px] font-bold flex items-center space-x-1 cursor-pointer"
                          title="Send private in-app message to Sister"
                        >
                          <span>💌 Message Sister</span>
                        </button>
                      </div>

                      {/* Full Comments List & Reply Box (Expands when clicked) */}
                      {activeCommentPostId === post.id && (
                        <div className="pt-3 border-t border-copper-penny/10 space-y-3 bg-[#FAF5EE]/60 p-4 rounded-2xl animate-fade-in">
                          <div className="flex items-center justify-between text-[11px] font-mono text-soft-sage font-bold border-b border-copper-penny/10 pb-1">
                            <span>All Sister Replies ({post.comments.length}):</span>
                            <span className="text-[10px]">Respectful &bull; Uplifting</span>
                          </div>

                          {post.comments.length === 0 ? (
                            <p className="text-xs text-soft-sage italic">No replies yet. Speak the first blessing into this post.</p>
                          ) : (
                            post.comments.map(c => (
                              <div key={c.id} className="text-xs space-y-1 border-b border-copper-penny/10 pb-2 last:border-none">
                                <div className="flex items-center justify-between font-mono text-[10px]">
                                  <span className="font-bold text-[#1F140E]">{c.authorName} ({c.authorLocation})</span>
                                  <span className="text-soft-sage">{c.createdAt}</span>
                                </div>
                                <p className="text-xs text-[#1F140E]/85 font-sans leading-relaxed whitespace-pre-line">
                                  <FormattedContentWithHashtags content={c.content} onHashtagClick={onExecuteGlobalSearch} />
                                </p>
                                {(c as any).imageUrl && (
                                  <img src={(c as any).imageUrl} alt="Attached reply image" className="max-h-40 rounded-xl border border-copper-penny/20 mt-1 object-cover" />
                                )}
                              </div>
                            ))
                          )}

                          <div className="pt-1">
                            <InteractiveReplyBox
                              placeholder="Speak life into this sister... (use @ for sister tags, # for hashtags)"
                              buttonLabel="Reply"
                              onSubmit={(text, imageUrl) => {
                                let finalContent = text;
                                const scanResult = scanContentForTriggers(finalContent.trim());
                                if (scanResult.recommendedAction === 'block') {
                                  showToast(scanResult.warningMessage || '⚠️ Inappropriate words or scam triggers detected. Please adjust your reply.');
                                  return;
                                }

                                const newComment = {
                                  id: `c-${Date.now()}`,
                                  authorName: userName,
                                  authorLocation: `${selectedState} Circle`,
                                  content: finalContent.trim(),
                                  createdAt: 'Just now',
                                  imageUrl: imageUrl
                                };

                                setPosts(prev => prev.map(p => {
                                  if (p.id === post.id) {
                                    return {
                                      ...p,
                                      comments: [...p.comments, newComment]
                                    };
                                  }
                                  return p;
                                }));

                                showToast('💬 Sister reply posted to community feed!');
                              }}
                              onExecuteHashtagSearch={onExecuteGlobalSearch}
                            />
                          </div>
                        </div>
                      )}
                    </article>

                    {/* INTERSPERSED SPONSORED / FEATURED SISTER BUSINESS AD IN FEED (STANDARDIZED SPOTLIGHT AD) */}
                    {shouldShowInterspersedAd && (
                      <aside className="w-full rounded-3xl bg-gradient-to-br from-[#1C1510] via-[#2A1D16] to-[#120D0A] p-4 sm:p-5 lg:p-6 border-2 border-[#D4AF37]/40 shadow-md text-[#FAF5EE] space-y-3 animate-fade-in">
                        {/* Top Header Bar: Sponsor Name + Verified Partner Tag */}
                        <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-2.5">
                          <div className="flex items-center space-x-2.5 min-w-0">
                            <span className="w-7 h-7 rounded-lg bg-[#D4AF37] text-[#1F140E] flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
                              ⭐
                            </span>
                            <div className="min-w-0">
                              <div className="flex items-center space-x-2">
                                <span className="font-serif font-black text-sm sm:text-base text-[#FAF5EE] truncate">
                                  {postIndex === 1 ? 'Roots & Resilience Master Apothecary' : 'NestBright Academy'}
                                </span>
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 uppercase tracking-widest shrink-0">
                                  Sponsored
                                </span>
                              </div>
                              <span className="text-[10px] font-mono text-soft-sage truncate block">
                                Vouched Melanated Woman-Owned Partner &bull; {selectedState} Circle
                              </span>
                            </div>
                          </div>
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/35 flex items-center space-x-1 shrink-0">
                            <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                            <span className="hidden sm:inline">Verified Partner</span>
                          </span>
                        </div>

                        {/* Short Ad Tagline */}
                        <p className="text-xs text-[#FAF5EE]/90 font-sans leading-snug line-clamp-1">
                          {postIndex === 1 
                            ? 'Hand-crafted ancestral botanical oxymels, pure tallow salves & mineral teas for maternal wellness.'
                            : 'Self-determined elementary homeschool learning curriculum (Grades 3–5) for sovereign families.'
                          }
                        </p>

                        {/* Centered 16:9 Image Container with Integrated Offer Overlay & CTA Button */}
                        <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-neutral-900 border border-[#D4AF37]/35 shadow-inner group">
                          <img 
                            src={postIndex === 1 ? '/apothecary_sister_herbal.jpg' : 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80'}
                            alt="Sponsored spotlight advertisement"
                            className="w-full h-full object-cover object-center opacity-90 group-hover:scale-[1.02] transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-end p-3.5 sm:p-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 w-full">
                              <div className="space-y-0.5">
                                <span className="text-[10px] font-mono uppercase tracking-wider text-[#D4AF37] font-bold block">
                                  Exclusive Community Offer:
                                </span>
                                <span className="text-xs sm:text-sm font-mono font-black text-emerald-300">
                                  {postIndex === 1 ? '15% Off with code COPPERMOMMIE' : '$5.99/mo Member Rate (Reg. $24.99/mo)'}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  if (postIndex === 1) {
                                    setActiveSubTab('businesses');
                                  } else {
                                    window.open('https://nestbrightacademy.com', '_blank');
                                  }
                                }}
                                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B87333] hover:from-[#e0bc46] hover:to-[#c47f3e] text-[#1F140E] font-serif font-black text-xs shadow-md transition-all self-start sm:self-auto cursor-pointer flex items-center space-x-1.5 active:scale-95"
                              >
                                <span>{postIndex === 1 ? 'View Sister Apothecary' : 'Explore NestBright'}</span>
                                <ArrowRight className="w-3.5 h-3.5 text-[#1F140E]" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </aside>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          )}

          {/* VIEW: OPPORTUNITIES & GIGS (COMMONS GIG DESK) */}
          {activeSubTab === 'gigs' && (
            <div className="space-y-5 animate-fade-in">
              {/* Header Banner */}
              <div className="bg-[#FAF5EE] border border-[#B87333]/25 rounded-3xl p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-serif font-black text-xl text-[#1F1813]">
                      💼 Opportunities &amp; Maternal Gigs
                    </h3>
                    <p className="text-xs text-soft-sage font-mono mt-0.5">
                      Vetted homestead preservation, doula support, childcare swaps, and cooperative contracts.
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => onNavigateToTab?.('commerce')}
                      className="px-3 py-1.5 bg-white hover:bg-stone-100 rounded-xl text-xs font-mono font-bold text-[#1F140E] border border-copper-penny/25 shadow-xs transition-colors cursor-pointer flex items-center space-x-1"
                    >
                      <span>Open Commerce Hub Job Desk</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#B87333]" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setUnifiedModalCategory('gig');
                        setIsUnifiedCreateModalOpen(true);
                      }}
                      className="px-4 py-1.5 bg-[#D4AF37] hover:bg-[#B87333] hover:text-white text-[#1F140E] rounded-xl text-xs font-mono font-black uppercase tracking-wider transition-all shadow-xs cursor-pointer flex items-center space-x-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Post A Gig</span>
                    </button>
                  </div>
                </div>

                {/* Filter Controls */}
                <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-copper-penny/10 font-mono text-xs">
                  {['all', 'Contract', 'Micro-Gig', 'Part-time', 'Full-time'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setGigTypeFilter(type)}
                      className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                        gigTypeFilter === type
                          ? 'bg-[#1F140E] text-[#D4AF37] shadow-xs'
                          : 'bg-white text-[#1F140E]/80 hover:bg-[#F0E6D8] border border-copper-penny/15'
                      }`}
                    >
                      {type === 'all' ? 'All Gigs & Opportunities' : type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gigs List */}
              <div className="space-y-5">
                {filteredUnifiedGigs.map(gig => renderUnifiedListingCard(gig, 'commerce', 'View in Opportunities & Job Desk'))}
                {filteredUnifiedGigs.length === 0 && (
                  <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-copper-penny/25 p-6 space-y-2">
                    <p className="font-serif text-[#1F1813] text-sm font-bold">No active gigs match this filter.</p>
                    <p className="text-xs text-soft-sage font-mono">Post the first contract or micro-gig for our sisterhood!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* VIEW: 2. THE EXCHANGE (PHOTO GRID & MULTI-PHOTO BARTER) */}
          {activeSubTab === 'exchange' && (
            <div className="space-y-6 animate-fade-in">
              {/* Featured Multi-Photo Barter Listings */}
              {filteredUnifiedBarters.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-copper-penny/15 pb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">🤝</span>
                      <h4 className="font-serif font-black text-base text-[#1F1813]">
                        Multi-Photo Barters &amp; Trade Requests ({filteredUnifiedBarters.length})
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => onNavigateToTab?.('economy')}
                      className="text-xs font-mono text-[#B87333] hover:underline flex items-center space-x-1 cursor-pointer font-bold"
                    >
                      <span>Cooperative Economy Hub</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="space-y-5">
                    {filteredUnifiedBarters.map(item => renderUnifiedListingCard(item, 'economy', 'View in Cooperative Economy Hub'))}
                  </div>
                </div>
              )}

              {/* Original Exchange Photo Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-copper-penny/10 pb-2">
                  <h4 className="font-serif font-bold text-sm text-[#1F1813]">
                    Community Goods, Gifts &amp; Swaps ({filteredExchangeItems.length})
                  </h4>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredExchangeItems.map(item => {
                    const saved = isItemSaved(item.id);
                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedExchangeItem(item)}
                        className="bg-white rounded-2xl overflow-hidden border border-copper-penny/20 hover:border-[#D4AF37] hover:shadow-lg transition-all flex flex-col justify-between cursor-pointer group"
                        title={item.title}
                      >
                        <div>
                          <div className="relative aspect-square w-full bg-neutral-100 overflow-hidden">
                            <img 
                              src={item.imageUrl} 
                              alt={item.title} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute top-2 left-2">
                              {item.type === 'free' ? (
                                <span className="px-2 py-0.5 rounded-md text-[9px] font-mono font-black bg-emerald-700 text-white shadow-md">
                                  FREE
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-md text-[9px] font-mono font-black bg-[#1F140E] text-[#D4AF37] border border-[#D4AF37]/50 shadow-md">
                                  BARTER
                                </span>
                              )}
                            </div>
                            {/* Bookmark in Corner */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSaveItem({
                                  id: item.id,
                                  type: 'exchange',
                                  title: item.title,
                                  subtitle: item.description.slice(0, 60) + '...',
                                  imageUrl: item.imageUrl,
                                  categoryBadge: item.type === 'free' ? 'Free Giveaway' : 'Barter Item',
                                  location: `${item.locationCity}, ${item.locationState}`,
                                  terms: item.terms
                                });
                              }}
                              className={`absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 backdrop-blur-xs transition-colors cursor-pointer ${
                                saved ? 'text-[#D4AF37]' : 'text-white/80 hover:text-[#D4AF37]'
                              }`}
                              title={saved ? "Saved in Column 3" : "Save to Column 3 Saved Items"}
                            >
                              <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-[#D4AF37]' : ''}`} />
                            </button>
                          </div>

                          <div className="p-3 space-y-1">
                            <span className="text-[9px] font-mono text-soft-sage uppercase font-bold block">{item.category}</span>
                            <h4 className="font-serif font-bold text-xs sm:text-sm text-[#1F140E] line-clamp-2 leading-snug group-hover:text-copper-penny transition-colors">
                              {item.title}
                            </h4>
                          </div>
                        </div>

                        <div className="p-3 pt-0 border-t border-copper-penny/10 flex items-center justify-between text-[10px] font-mono">
                          <span className="text-soft-sage">{item.locationCity}</span>
                          <span className="font-bold text-copper-penny truncate max-w-[110px]">{item.terms}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* VIEW: 3. SANCTUARY HOUSING & LAND */}
          {activeSubTab === 'housing' && (
            <div className="space-y-6 animate-fade-in">
              {/* Unified Multi-Photo Housing Listings */}
              {filteredUnifiedHousing.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-copper-penny/15 pb-2">
                    <h4 className="font-serif font-black text-base text-[#1F1813]">
                      🏡 Featured Maternity Suites, Havens &amp; Acreage ({filteredUnifiedHousing.length})
                    </h4>
                  </div>
                  <div className="space-y-5">
                    {filteredUnifiedHousing.map(house => renderUnifiedListingCard(house, 'commons', 'Sanctuary Housing Board'))}
                  </div>
                </div>
              )}

              {/* Standard Housing Listings */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-copper-penny/10 pb-2">
                  <h4 className="font-serif font-bold text-sm text-[#1F1813]">
                    Community Rooms, Cottages &amp; Co-ops ({filteredHousing.length})
                  </h4>
                </div>
                {filteredHousing.map(house => {
                  const saved = isItemSaved(house.id);
                  return (
                    <div 
                      key={house.id}
                      className="bg-white rounded-3xl overflow-hidden border-2 border-copper-penny/20 shadow-sm hover:border-[#D4AF37] transition-all p-5 space-y-3"
                    >
                      <div className="relative h-48 sm:h-56 w-full rounded-2xl overflow-hidden bg-neutral-100">
                        <img 
                          src={house.imageUrl} 
                          alt={house.title} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute top-2.5 left-2.5 px-3 py-1 rounded-xl text-xs font-mono font-bold bg-[#1F140E]/90 text-[#D4AF37] border border-[#D4AF37]/50 shadow-md">
                          {house.spaceType === 'maternity' ? 'RESPITE HAVEN' : house.spaceType.toUpperCase()}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleSaveItem({
                            id: house.id,
                            type: 'housing',
                            title: house.title,
                            subtitle: house.pricingTerms,
                            imageUrl: house.imageUrl,
                            categoryBadge: 'Housing Haven',
                            location: `${house.regionOrCity}, ${house.stateCode}`,
                            terms: house.pricingTerms
                          })}
                          className={`absolute top-2.5 right-2.5 p-2 rounded-xl bg-black/60 backdrop-blur-xs transition-colors cursor-pointer ${
                            saved ? 'text-[#D4AF37]' : 'text-white/80 hover:text-[#D4AF37]'
                          }`}
                          title={saved ? 'Saved in Column 3' : 'Save to Column 3'}
                        >
                          <Bookmark className={`w-4 h-4 ${saved ? 'fill-[#D4AF37]' : ''}`} />
                        </button>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-mono text-soft-sage">
                          <span>{house.regionOrCity}, {house.stateCode}</span>
                          <span>Posted {house.createdAt}</span>
                        </div>
                        <h3 className="font-serif font-black text-lg text-[#1F140E]">{house.title}</h3>
                        <div className="bg-[#FAF5EE] border border-[#D4AF37]/40 p-2.5 rounded-xl font-mono text-xs font-bold text-[#1F140E]">
                          Terms: {house.pricingTerms}
                        </div>
                        <p className="text-xs font-sans text-[#1F140E]/80">{house.rulesAndExpectations}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleOpenMessageModal(house.authorName, `Inquiry regarding: ${house.title}`)}
                        className="w-full py-2.5 bg-[#1F140E] hover:bg-[#2A1D16] text-[#D4AF37] font-mono text-xs font-bold rounded-xl flex items-center justify-center space-x-2 border border-[#D4AF37]/40 cursor-pointer"
                        title="Send safe private message to host sister"
                      >
                        <span>💌 Message Sister {house.authorName} Privately</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* VIEW: 4. SISTER BUSINESSES */}
          {activeSubTab === 'businesses' && (
            <div className="space-y-6 animate-fade-in">
              {/* Unified Sister Businesses */}
              {filteredUnifiedBusinesses.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-copper-penny/15 pb-2">
                    <h4 className="font-serif font-black text-base text-[#1F1813]">
                      ⭐ Featured Sister Enterprises ({filteredUnifiedBusinesses.length})
                    </h4>
                    <button
                      type="button"
                      onClick={() => onNavigateToTab?.('commerce')}
                      className="text-xs font-mono text-[#B87333] hover:underline flex items-center space-x-1 cursor-pointer font-bold"
                    >
                      <span>Mommie Business Directory</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="space-y-5">
                    {filteredUnifiedBusinesses.map(biz => renderUnifiedListingCard(biz, 'commerce', 'View in Business Directory'))}
                  </div>
                </div>
              )}

              {/* Standard Vouched Businesses */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-copper-penny/10 pb-2">
                  <h4 className="font-serif font-bold text-sm text-[#1F1813]">
                    Community Vouched Sister Faves ({filteredBusinesses.length})
                  </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredBusinesses.map(biz => {
                    const saved = isItemSaved(biz.id);
                    const alreadyVouched = biz.vouchedBy.includes(userName);
                    return (
                      <div 
                        key={biz.id}
                        className="bg-white rounded-3xl overflow-hidden border border-copper-penny/20 shadow-sm p-4 space-y-3 flex flex-col justify-between"
                      >
                        <div>
                          <div className="relative h-40 w-full rounded-2xl overflow-hidden bg-neutral-100">
                            <img 
                              src={biz.imageUrl} 
                              alt={biz.name} 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            <span className="absolute top-2 left-2 bg-black/75 text-[#D4AF37] text-[9px] font-mono px-2 py-0.5 rounded-md font-bold">
                              {biz.industry}
                            </span>
                            <button
                              type="button"
                              onClick={() => toggleSaveItem({
                                id: biz.id,
                                type: 'business',
                                title: biz.name,
                                subtitle: biz.offerDescription.slice(0, 60) + '...',
                                imageUrl: biz.imageUrl,
                                categoryBadge: 'Sister Business',
                                location: `${biz.locationCity}, ${biz.locationState}`,
                                terms: biz.sisterDiscountOrBarter
                              })}
                              className={`absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 backdrop-blur-xs transition-colors cursor-pointer ${
                                saved ? 'text-[#D4AF37]' : 'text-white/80 hover:text-[#D4AF37]'
                              }`}
                              title={saved ? 'Saved in Column 3' : 'Save to Column 3'}
                            >
                              <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-[#D4AF37]' : ''}`} />
                            </button>
                          </div>

                          <div className="pt-2 space-y-1">
                            <h4 className="font-serif font-bold text-sm text-[#1F140E]">{biz.name}</h4>
                            <p className="text-[11px] text-soft-sage font-mono">Owner: {biz.ownerName} • {biz.locationCity}</p>
                            <p className="text-xs text-[#1F140E]/80 line-clamp-2">{biz.offerDescription}</p>
                            <span className="text-[10px] font-mono font-bold text-amber-900 block pt-1">{biz.sisterDiscountOrBarter}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 pt-2 border-t border-copper-penny/10">
                          <button
                            type="button"
                            onClick={() => handleVouchForBusiness(biz.id)}
                            className={`flex-1 py-1.5 rounded-xl text-xs font-mono font-bold border transition-colors cursor-pointer flex items-center justify-center space-x-1 ${
                              alreadyVouched ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-[#1F140E] text-[#D4AF37] border-[#D4AF37]/40'
                            }`}
                            title="Vouch for Sister"
                          >
                            <ThumbsUp className="w-3 h-3" />
                            <span>{alreadyVouched ? 'Vouched' : `Vouch (${biz.vouchesCount})`}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenMessageModal(biz.ownerName, `Inquiry regarding: ${biz.name}`)}
                            className="px-3 py-1.5 bg-[#FAF5EE] rounded-xl text-xs font-mono font-bold border border-copper-penny/20"
                            title="Message Owner"
                          >
                            💌 Message
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* VIEW: 5. GATHERINGS & EVENTS */}
          {activeSubTab === 'events' && (
            <div className="space-y-6 animate-fade-in">
              {/* Unified Circle Gatherings */}
              {filteredUnifiedEvents.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-copper-penny/15 pb-2">
                    <h4 className="font-serif font-black text-base text-[#1F1813]">
                      📅 Sovereign Circles &amp; Hands-On Workshops ({filteredUnifiedEvents.length})
                    </h4>
                    <button
                      type="button"
                      onClick={() => onNavigateToTab?.('gathering')}
                      className="text-xs font-mono text-[#B87333] hover:underline flex items-center space-x-1 cursor-pointer font-bold"
                    >
                      <span>Circle Gatherings Hub</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="space-y-5">
                    {filteredUnifiedEvents.map(ev => renderUnifiedListingCard(ev, 'gathering', 'View in Circle Event Calendar'))}
                  </div>
                </div>
              )}

              {/* Standard Gatherings List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-copper-penny/10 pb-2">
                  <h4 className="font-serif font-bold text-sm text-[#1F1813]">
                    Regional Sister Circles ({filteredEvents.length})
                  </h4>
                </div>
                {filteredEvents.map(ev => {
                  const currentRsvp = ev.rsvps[userName];
                  const saved = isItemSaved(ev.id);
                  return (
                    <div 
                      key={ev.id}
                      className="bg-white rounded-3xl overflow-hidden border border-copper-penny/20 shadow-sm p-5 space-y-3"
                    >
                      <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-neutral-100">
                        <img 
                          src={ev.coverImageUrl} 
                          alt={ev.title} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute top-2 left-2 bg-black/75 text-[#D4AF37] text-[10px] font-mono px-2 py-0.5 rounded-md font-bold">
                          {ev.category}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleSaveItem({
                            id: ev.id,
                            type: 'event',
                            title: ev.title,
                            subtitle: `${ev.date} • ${ev.time}`,
                            imageUrl: ev.coverImageUrl,
                            categoryBadge: 'Gathering',
                            location: ev.venueOrCity,
                            terms: ev.date
                          })}
                          className={`absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 backdrop-blur-xs transition-colors cursor-pointer ${
                            saved ? 'text-[#D4AF37]' : 'text-white/80 hover:text-[#D4AF37]'
                          }`}
                          title={saved ? 'Saved in Column 3' : 'Save to Column 3'}
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-[#D4AF37]' : ''}`} />
                        </button>
                      </div>

                      <div>
                        <span className="text-xs font-mono font-bold text-copper-penny block">{ev.date} • {ev.time}</span>
                        <h3 className="font-serif font-bold text-base text-[#1F1813] mt-0.5">{ev.title}</h3>
                        <p className="text-xs text-[#1F1813]/80 font-sans mt-1">{ev.description}</p>
                        <p className="text-[11px] font-mono text-soft-sage mt-1">📍 Location: {ev.venueOrCity}</p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-copper-penny/10">
                        <span className="text-[10px] font-mono text-soft-sage">Your RSVP:</span>
                        <div className="flex items-center space-x-1.5 font-mono text-xs">
                          <button
                            type="button"
                            onClick={() => handleUpdateRsvp(ev.id, 'going')}
                            className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                              currentRsvp === 'going' ? 'bg-emerald-800 text-white' : 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                            }`}
                          >
                            Going
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdateRsvp(ev.id, 'interested')}
                            className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                              currentRsvp === 'interested' ? 'bg-amber-800 text-white' : 'bg-[#FAF5EE] text-[#1F140E] border border-copper-penny/25'
                            }`}
                          >
                            Interested
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* VIEW: 6. INTERACTIVE CIRCLE MAP */}
          {activeSubTab === 'map' && (
            <div className="space-y-4 animate-fade-in">
              <CircleMapInteractive 
                selectedState={selectedState}
                onOpenDirectChat={onOpenDirectChat}
                showToast={showToast}
              />
            </div>
          )}

        </section>

        {/* ================================================== */}
        {/* COLUMN 3: 4 SQUARE ROWS SIDEBAR                     */}
        {/* ================================================== */}
        <div className="lg:col-span-3 xl:col-span-3 space-y-5">
          <VillageCommonsSidebar
            savedItems={savedItems}
            businessAds={businessAds}
            onSelectSavedItem={(item) => {
              setSelectedReviewItem(item);
              if (item.type === 'exchange') {
                const found = exchangeItems.find(i => i.id === item.id);
                if (found) setSelectedExchangeItem(found);
                setActiveSubTab('exchange');
              } else if (item.type === 'housing') {
                setActiveSubTab('housing');
              } else if (item.type === 'business') {
                setActiveSubTab('businesses');
              } else if (item.type === 'event') {
                setActiveSubTab('events');
              } else {
                setActiveSubTab('feed');
              }
            }}
            onRemoveSavedItem={handleRemoveSavedItem}
            onNavigateToTab={onNavigateToTab}
          />
        </div>

      </div>

      {/* ==================================================== */}
      {/* MODAL 1: SHARE WITH VILLAGE (NEW POST)              */}
      {/* ==================================================== */}
      {isNewPostModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF5EE] border-2 border-[#D4AF37] rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-copper-penny/20 pb-3">
              <h3 className="font-serif font-black text-lg text-[#1F140E]">Share with the Village Community</h3>
              <button 
                type="button"
                onClick={() => setIsNewPostModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-neutral-200 text-neutral-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4 text-xs font-mono">
              <div className="bg-white p-3 rounded-2xl border border-copper-penny/20 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <span className="text-xl">🌿</span>
                  <div>
                    <div className="font-serif font-bold text-xs text-[#1F140E]">The Village Stream (Open Community)</div>
                    <div className="text-[10px] text-soft-sage font-sans">Open to all reflections, mother wisdom, questions &amp; encouragement</div>
                  </div>
                </div>
                <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center space-x-1 shrink-0">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Sanctuary Protected</span>
                </span>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-soft-sage mb-1">Title (Optional):</label>
                <input
                  type="text"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  placeholder="e.g., Morning remedy advice for little ones..."
                  className="w-full bg-white border border-copper-penny/25 p-2.5 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-soft-sage mb-1">Message Content:</label>
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  rows={4}
                  placeholder="Share a recipe, question, reflection, or encouragement..."
                  className="w-full bg-white border border-copper-penny/25 p-2.5 rounded-xl text-xs font-sans"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-soft-sage mb-1">Attach Photo (Optional):</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageFileSelect(e, setNewPostImageUrl)}
                  className="w-full text-xs text-soft-sage file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-mono file:font-bold file:bg-[#1F140E] file:text-[#D4AF37] cursor-pointer"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsNewPostModalOpen(false)}
                  className="px-4 py-2 bg-neutral-200 text-neutral-800 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-[#B87333] to-[#D4AF37] text-white rounded-xl font-bold shadow-md cursor-pointer"
                >
                  Publish to Forum
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL 2: POST TO THE EXCHANGE                        */}
      {/* ==================================================== */}
      {isPostExchangeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF5EE] border-2 border-[#D4AF37] rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-copper-penny/20 pb-3">
              <h3 className="font-serif font-black text-lg text-[#1F140E]">Post to The Exchange</h3>
              <button 
                type="button"
                onClick={() => setIsPostExchangeModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-neutral-200 text-neutral-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateExchangeItem} className="space-y-3.5 text-xs font-mono">
              <div>
                <label className="block text-[10px] uppercase font-bold text-soft-sage mb-1">Listing Type:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewItemType('free')}
                    className={`p-2 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                      newItemType === 'free' ? 'bg-emerald-700 text-white border-emerald-600' : 'bg-white text-[#1F140E]'
                    }`}
                  >
                    🟢 Free Giveaway
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewItemType('barter')}
                    className={`p-2 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                      newItemType === 'barter' ? 'bg-[#1F140E] text-[#D4AF37] border-[#D4AF37]' : 'bg-white text-[#1F140E]'
                    }`}
                  >
                    🤝 Barter Trade
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewItemType('time-credit')}
                    className={`p-2 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                      newItemType === 'time-credit' ? 'bg-[#B87333] text-white border-[#B87333]' : 'bg-white text-[#1F140E]'
                    }`}
                  >
                    ⏳ Time Credit
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-soft-sage mb-1">Item Title:</label>
                <input
                  type="text"
                  value={newItemTitle}
                  onChange={(e) => setNewItemTitle(e.target.value)}
                  placeholder="e.g., Wooden baby bassinet, heirloom okra seeds..."
                  className="w-full bg-white border border-copper-penny/25 p-2.5 rounded-xl text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-soft-sage mb-1">Category:</label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value as any)}
                    className="w-full bg-white border border-copper-penny/25 p-2.5 rounded-xl text-xs font-bold"
                  >
                    <option value="Baby & Toddler">Baby &amp; Toddler</option>
                    <option value="Homeschool Books & Supplies">Homeschool &amp; Books</option>
                    <option value="Homestead & Farm">Homestead &amp; Farm</option>
                    <option value="Herbal Remedies">Herbal Remedies</option>
                    <option value="Furniture & Household">Furniture &amp; Household</option>
                    <option value="Clothing & Apparel">Clothing &amp; Apparel</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-soft-sage mb-1">City / Neighborhood:</label>
                  <input
                    type="text"
                    value={newItemCity}
                    onChange={(e) => setNewItemCity(e.target.value)}
                    placeholder="e.g., Atlanta, Decatur, West End"
                    className="w-full bg-white border border-copper-penny/25 p-2.5 rounded-xl text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-soft-sage mb-1">Exchange Terms / What You Desire in Trade:</label>
                <input
                  type="text"
                  value={newItemTerms}
                  onChange={(e) => setNewItemTerms(e.target.value)}
                  placeholder={newItemType === 'free' ? '100% Free Gift (Pick up in Decatur)' : 'e.g., Trade for fresh sourdough or 4oz elderberry'}
                  className="w-full bg-white border border-copper-penny/25 p-2.5 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-soft-sage mb-1">Item Description &amp; Condition:</label>
                <textarea
                  value={newItemDesc}
                  onChange={(e) => setNewItemDesc(e.target.value)}
                  rows={3}
                  placeholder="Describe dimensions, condition, and any meetup preferences..."
                  className="w-full bg-white border border-copper-penny/25 p-2.5 rounded-xl text-xs font-sans"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-soft-sage mb-1">Upload Photo (Phone / Computer):</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageFileSelect(e, setNewItemImageUrl)}
                  className="w-full text-xs text-soft-sage file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-mono file:font-bold file:bg-[#1F140E] file:text-[#D4AF37] cursor-pointer"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsPostExchangeModalOpen(false)}
                  className="px-4 py-2 bg-neutral-200 text-neutral-800 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-emerald-700 to-emerald-600 text-white rounded-xl font-bold shadow-md cursor-pointer"
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL 3: POST SANCTUARY HOUSING & LAND               */}
      {/* ==================================================== */}
      {isPostHousingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF5EE] border-2 border-[#D4AF37] rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-copper-penny/20 pb-3">
              <h3 className="font-serif font-black text-lg text-[#1F140E]">Post Housing or Land Opportunity</h3>
              <button 
                type="button"
                onClick={() => setIsPostHousingModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-neutral-200 text-neutral-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateHousing} className="space-y-3.5 text-xs font-mono">
              <div>
                <label className="block text-[10px] uppercase font-bold text-soft-sage mb-1">Opportunity Title:</label>
                <input
                  type="text"
                  value={newHouseTitle}
                  onChange={(e) => setNewHouseTitle(e.target.value)}
                  placeholder="e.g., Garden Cottage Room with Private Bath"
                  className="w-full bg-white border border-copper-penny/25 p-2.5 rounded-xl text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-soft-sage mb-1">Space Type:</label>
                  <select
                    value={newHouseSpaceType}
                    onChange={(e) => setNewHouseSpaceType(e.target.value as any)}
                    className="w-full bg-white border border-copper-penny/25 p-2.5 rounded-xl text-xs font-bold"
                  >
                    <option value="room">🏡 Room / In-Law Suite</option>
                    <option value="maternity">🌿 Rest &amp; Recovery Suite</option>
                    <option value="land">🌾 Land / Acreage / RV Hookup</option>
                    <option value="rental">🔑 Whole Home Rental</option>
                    <option value="work-trade">🤝 Work-Trade Sanctuary</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-soft-sage mb-1">General Area / City:</label>
                  <input
                    type="text"
                    value={newHouseRegion}
                    onChange={(e) => setNewHouseRegion(e.target.value)}
                    placeholder="e.g., Stone Mountain / Decatur area"
                    className="w-full bg-white border border-copper-penny/25 p-2.5 rounded-xl text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-soft-sage mb-1">
                  Pricing &amp; Exchange Terms (Specific &amp; Not Misleading):
                </label>
                <input
                  type="text"
                  value={newHousePricing}
                  onChange={(e) => setNewHousePricing(e.target.value)}
                  placeholder="e.g., $650/mo utilities included OR 10 hrs/wk garden help"
                  className="w-full bg-white border border-copper-penny/25 p-2.5 rounded-xl text-xs font-bold"
                  required
                />
              </div>

              <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newHouseShowPrivacy}
                    onChange={(e) => setNewHouseShowPrivacy(e.target.checked)}
                    className="rounded text-amber-800"
                  />
                  <span className="text-[11px] font-bold text-amber-950">
                    Allow verified sisters to see my exact phone &amp; street address
                  </span>
                </label>
                <p className="text-[10px] text-amber-900/80 font-sans">
                  Default is private. If unchecked, your street address and phone remain hidden.
                </p>
                {newHouseShowPrivacy && (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <input
                      type="text"
                      value={newHousePhone}
                      onChange={(e) => setNewHousePhone(e.target.value)}
                      placeholder="Phone number"
                      className="bg-white border border-amber-300 p-2 rounded-xl text-xs"
                    />
                    <input
                      type="text"
                      value={newHouseAddress}
                      onChange={(e) => setNewHouseAddress(e.target.value)}
                      placeholder="Street address"
                      className="bg-white border border-amber-300 p-2 rounded-xl text-xs"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2">
                <label className="flex items-center space-x-1.5 cursor-pointer bg-white p-2 rounded-xl border border-copper-penny/20">
                  <input
                    type="checkbox"
                    checked={newHouseChildren}
                    onChange={(e) => setNewHouseChildren(e.target.checked)}
                  />
                  <span className="text-[10px]">👶 Children Ok</span>
                </label>
                <label className="flex items-center space-x-1.5 cursor-pointer bg-white p-2 rounded-xl border border-copper-penny/20">
                  <input
                    type="checkbox"
                    checked={newHousePrivateBath}
                    onChange={(e) => setNewHousePrivateBath(e.target.checked)}
                  />
                  <span className="text-[10px]">🚿 Bath</span>
                </label>
                <label className="flex items-center space-x-1.5 cursor-pointer bg-white p-2 rounded-xl border border-copper-penny/20">
                  <input
                    type="checkbox"
                    checked={newHousePrivateEntrance}
                    onChange={(e) => setNewHousePrivateEntrance(e.target.checked)}
                  />
                  <span className="text-[10px]">🚪 Door</span>
                </label>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-soft-sage mb-1">Household Rules &amp; Expectations:</label>
                <textarea
                  value={newHouseRules}
                  onChange={(e) => setNewHouseRules(e.target.value)}
                  rows={2}
                  placeholder="e.g., Peaceful smoke-free home, quiet evening hours..."
                  className="w-full bg-white border border-copper-penny/25 p-2.5 rounded-xl text-xs font-sans"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-soft-sage mb-1">Attach Photo (Optional):</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageFileSelect(e, setNewHouseImageUrl)}
                  className="w-full text-xs text-soft-sage file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-mono file:font-bold file:bg-[#1F140E] file:text-[#D4AF37] cursor-pointer"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsPostHousingModalOpen(false)}
                  className="px-4 py-2 bg-neutral-200 text-neutral-800 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1F140E] text-[#D4AF37] rounded-xl font-bold border border-[#D4AF37]/50 shadow-md cursor-pointer"
                >
                  Post Space
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL 4: IN-APP DIRECT MESSAGING MODAL               */}
      {/* ==================================================== */}
      {showMessageModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF5EE] border-2 border-[#D4AF37] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-copper-penny/20 pb-3">
              <div>
                <h3 className="font-serif font-black text-lg text-[#1F140E]">Private Sister Message</h3>
                <p className="text-[10px] font-mono text-soft-sage">Recipient: Sister {messageRecipient}</p>
              </div>
              <button 
                type="button"
                onClick={() => setShowMessageModal(false)}
                className="p-1.5 rounded-lg hover:bg-neutral-200 text-neutral-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendMessage} className="space-y-3.5 text-xs font-mono">
              <div>
                <label className="block text-[10px] uppercase font-bold text-soft-sage mb-1">Subject:</label>
                <input
                  type="text"
                  value={messageSubject}
                  onChange={(e) => setMessageSubject(e.target.value)}
                  className="w-full bg-white border border-copper-penny/25 p-2 rounded-xl text-xs font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-soft-sage mb-1">Your Message:</label>
                <textarea
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  rows={4}
                  placeholder={`Peace sister, I am reaching out to inquire about...`}
                  className="w-full bg-white border border-copper-penny/25 p-2.5 rounded-xl text-xs font-sans"
                  required
                />
              </div>

              <p className="text-[10px] font-mono text-soft-sage italic">
                🔒 Protected by PMA private communication covenant.
              </p>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowMessageModal(false)}
                  className="px-4 py-2 bg-neutral-200 text-neutral-800 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1F140E] text-[#D4AF37] border border-[#D4AF37]/50 rounded-xl font-bold shadow-md cursor-pointer flex items-center space-x-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL 5: REGISTER SISTER BUSINESS                   */}
      {/* ==================================================== */}
      {isRegisterBizModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF5EE] border-2 border-[#D4AF37] rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-copper-penny/20 pb-3">
              <h3 className="font-serif font-black text-lg text-[#1F140E]">Register Sister Business</h3>
              <button 
                type="button"
                onClick={() => setIsRegisterBizModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-neutral-200 text-neutral-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterBusiness} className="space-y-3.5 text-xs font-mono">
              <div>
                <label className="block text-[10px] uppercase font-bold text-soft-sage mb-1">Business Name:</label>
                <input
                  type="text"
                  value={newBizName}
                  onChange={(e) => setNewBizName(e.target.value)}
                  placeholder="e.g., Sweetgrass Heirloom Pantry"
                  className="w-full bg-white border border-copper-penny/25 p-2.5 rounded-xl text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-soft-sage mb-1">Industry:</label>
                  <select
                    value={newBizIndustry}
                    onChange={(e) => setNewBizIndustry(e.target.value as any)}
                    className="w-full bg-white border border-copper-penny/25 p-2.5 rounded-xl text-xs font-bold"
                  >
                    <option value="Holistic Health">Holistic Health &amp; Apothecary</option>
                    <option value="Doula & Midwifery">Doula &amp; Midwifery</option>
                    <option value="Homestead & Food">Homestead &amp; Food</option>
                    <option value="Artisan & Textiles">Artisan &amp; Textiles</option>
                    <option value="Education & Childcare">Education &amp; Childcare</option>
                    <option value="Professional Services">Professional Services</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-soft-sage mb-1">City / Hub:</label>
                  <input
                    type="text"
                    value={newBizCity}
                    onChange={(e) => setNewBizCity(e.target.value)}
                    placeholder="e.g., Atlanta, Savannah"
                    className="w-full bg-white border border-copper-penny/25 p-2.5 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-soft-sage mb-1">Service &amp; Products Description:</label>
                <textarea
                  value={newBizOffer}
                  onChange={(e) => setNewBizOffer(e.target.value)}
                  rows={3}
                  placeholder="Describe your offerings, ancestral craftsmanship, and materials..."
                  className="w-full bg-white border border-copper-penny/25 p-2.5 rounded-xl text-xs font-sans"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-soft-sage mb-1">Exclusive Sister Discount / Barter Offer:</label>
                <input
                  type="text"
                  value={newBizDiscount}
                  onChange={(e) => setNewBizDiscount(e.target.value)}
                  placeholder="e.g., 15% off with code COPPERMOMMIE or Barter accepted"
                  className="w-full bg-white border border-copper-penny/25 p-2.5 rounded-xl text-xs font-bold"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsRegisterBizModalOpen(false)}
                  className="px-4 py-2 bg-neutral-200 text-neutral-800 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-[#B87333] to-[#D4AF37] text-white rounded-xl font-bold shadow-md cursor-pointer"
                >
                  Register Business
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL 6: CREATE GATHERING (SPEARHEAD / ADMIN ONLY)  */}
      {/* ==================================================== */}
      {isCreateEventModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF5EE] border-2 border-[#D4AF37] rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-copper-penny/20 pb-3">
              <h3 className="font-serif font-black text-lg text-[#1F140E]">Schedule Village Gathering</h3>
              <button 
                type="button"
                onClick={() => setIsCreateEventModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-neutral-200 text-neutral-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3.5 text-xs font-mono">
              <div>
                <label className="block text-[10px] uppercase font-bold text-soft-sage mb-1">Gathering Title:</label>
                <input
                  type="text"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  placeholder="e.g., Autumn Equinox Seed Swap & Sister Circle"
                  className="w-full bg-white border border-copper-penny/25 p-2.5 rounded-xl text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-soft-sage mb-1">Date:</label>
                  <input
                    type="text"
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    placeholder="e.g., Saturday, Oct 24, 2026"
                    className="w-full bg-white border border-copper-penny/25 p-2.5 rounded-xl text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-soft-sage mb-1">Time:</label>
                  <input
                    type="text"
                    value={newEventTime}
                    onChange={(e) => setNewEventTime(e.target.value)}
                    placeholder="e.g., 1:00 PM – 4:00 PM EST"
                    className="w-full bg-white border border-copper-penny/25 p-2.5 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-soft-sage mb-1">Venue / Address or Virtual Link:</label>
                <input
                  type="text"
                  value={newEventVenue}
                  onChange={(e) => setNewEventVenue(e.target.value)}
                  placeholder={newEventLocType === 'virtual' ? 'Video link or instructions' : 'Pavilion name and street address'}
                  className="w-full bg-white border border-copper-penny/25 p-2.5 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-soft-sage mb-1">Gathering Description &amp; What to Bring:</label>
                <textarea
                  value={newEventDesc}
                  onChange={(e) => setNewEventDesc(e.target.value)}
                  rows={3}
                  placeholder="Detail activities, child-friendly schedule, and items to bring (seeds, dishes, herbal teas)..."
                  className="w-full bg-white border border-copper-penny/25 p-2.5 rounded-xl text-xs font-sans"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsCreateEventModalOpen(false)}
                  className="px-4 py-2 bg-neutral-200 text-neutral-800 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-[#B87333] to-[#D4AF37] text-white rounded-xl font-bold shadow-md cursor-pointer"
                >
                  Publish Gathering
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL 7: VIEW EXCHANGE ITEM DETAILS                  */}
      {/* ==================================================== */}
      {selectedExchangeItem && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-[#D4AF37] rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-copper-penny/15 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-soft-sage uppercase">
                  {selectedExchangeItem.category} • {selectedExchangeItem.locationCity}, {selectedExchangeItem.locationState}
                </span>
                <h3 className="font-serif font-black text-xl text-[#1F140E]">{selectedExchangeItem.title}</h3>
              </div>
              <button 
                type="button"
                onClick={() => setSelectedExchangeItem(null)}
                className="p-1.5 rounded-lg hover:bg-neutral-200 text-neutral-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden max-h-80 bg-neutral-100 border border-copper-penny/20">
              <img 
                src={selectedExchangeItem.imageUrl} 
                alt={selectedExchangeItem.title} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="bg-[#FAF5EE] border border-[#D4AF37]/50 p-3.5 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-soft-sage font-bold block">Exchange Terms:</span>
                <span className="font-mono text-sm font-bold text-amber-950">{selectedExchangeItem.terms}</span>
              </div>
              <span className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-[#1F140E] text-[#D4AF37]">
                {selectedExchangeItem.type.toUpperCase()}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-soft-sage font-bold">Details:</span>
              <p className="text-xs sm:text-sm text-[#1F140E]/85 font-sans leading-relaxed">
                {selectedExchangeItem.description}
              </p>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl text-[11px] font-mono text-emerald-950 space-y-0.5">
              <span className="font-bold block">🛡️ Verified Safe Sisterhood Meetup:</span>
              <p>Arrange pickups at local cooperative library, daylight farmers market, or peer-verified sister porch.</p>
            </div>

            <div className="pt-2 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => setSelectedExchangeItem(null)}
                className="px-4 py-2 bg-neutral-200 text-neutral-800 rounded-xl font-mono text-xs font-bold cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const sister = selectedExchangeItem.authorName;
                  const item = selectedExchangeItem.title;
                  setSelectedExchangeItem(null);
                  handleOpenMessageModal(sister, `Regarding: ${item}`);
                }}
                className="px-6 py-2.5 bg-gradient-to-r from-[#B87333] to-[#D4AF37] text-white rounded-xl font-mono text-xs font-bold shadow-md cursor-pointer flex items-center space-x-2"
              >
                <span>💌 Message Sister {selectedExchangeItem.authorName}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL 8: SAVED / SUGGESTED ITEM DETAILED REVIEW      */}
      {/* ==================================================== */}
      {selectedReviewItem && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF5EE] border-2 border-[#D4AF37] rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-copper-penny/20 pb-3">
              <div className="flex items-center space-x-2">
                <Bookmark className="w-5 h-5 text-[#D4AF37] fill-[#D4AF37]" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#B87333]">
                  {selectedReviewItem.categoryBadge}
                </span>
              </div>
              <button 
                type="button"
                onClick={() => setSelectedReviewItem(null)}
                className="p-1.5 rounded-lg hover:bg-neutral-200 text-neutral-500 cursor-pointer"
                title="Close review"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-neutral-100 border border-copper-penny/20">
              <img 
                src={selectedReviewItem.imageUrl} 
                alt={selectedReviewItem.title} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              {selectedReviewItem.location && (
                <span className="absolute bottom-2.5 right-2.5 bg-black/80 text-white text-[10px] font-mono px-2.5 py-1 rounded-lg">
                  📍 {selectedReviewItem.location}
                </span>
              )}
            </div>

            <div className="space-y-1.5">
              <h3 className="font-serif font-black text-xl text-[#1F140E]">{selectedReviewItem.title}</h3>
              <p className="text-xs sm:text-sm text-[#1F140E]/80 font-sans leading-relaxed">
                {selectedReviewItem.subtitle}
              </p>
              {selectedReviewItem.terms && (
                <div className="mt-2 bg-white border border-[#D4AF37]/40 p-2.5 rounded-xl font-mono text-xs font-bold text-amber-950">
                  Terms: {selectedReviewItem.terms}
                </div>
              )}
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-copper-penny/15">
              <button
                type="button"
                onClick={() => {
                  toggleSaveItem(selectedReviewItem);
                  setSelectedReviewItem(null);
                }}
                className="w-full sm:w-auto px-4 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 rounded-xl font-mono text-xs font-bold transition-colors cursor-pointer"
                title="Toggle saved bookmark"
              >
                {isItemSaved(selectedReviewItem.id) ? '🗑️ Remove from Saved' : '⭐ Bookmark Item'}
              </button>

              <button
                type="button"
                onClick={() => {
                  const type = selectedReviewItem.type;
                  setSelectedReviewItem(null);
                  if (type === 'exchange') setActiveSubTab('exchange');
                  else if (type === 'housing') setActiveSubTab('housing');
                  else if (type === 'business') setActiveSubTab('businesses');
                  else if (type === 'event') setActiveSubTab('events');
                  else setActiveSubTab('feed');
                  window.scrollTo({ top: 350, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-5 py-2 bg-gradient-to-r from-[#B87333] to-[#D4AF37] text-white rounded-xl font-mono text-xs font-bold shadow-md hover:scale-102 transition-all cursor-pointer"
                title="Open in section"
              >
                Go to Section View →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL: SISTER AUTHOR PROFILE PREVIEW & DIRECT CHAT   */}
      {/* ==================================================== */}
      {selectedAuthorProfile && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#FAF5EE] border-2 border-[#D4AF37] rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-5 animate-scale-up text-[#1F140E]">
            <div className="flex items-center justify-between border-b border-copper-penny/15 pb-3">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold text-copper-penny uppercase">
                  Sister Profile &bull; {selectedAuthorProfile.authorState} Circle
                </span>
              </div>
              <button 
                type="button"
                onClick={() => setSelectedAuthorProfile(null)}
                className="p-1.5 rounded-xl hover:bg-copper-penny/10 text-neutral-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#B87333] to-[#D4AF37] text-white flex items-center justify-center font-serif font-black text-2xl shadow-md border-2 border-white">
                {selectedAuthorProfile.authorAvatar || '🕊️'}
              </div>
              <div>
                <h3 className="font-serif font-black text-lg text-[#1F140E]">
                  {selectedAuthorProfile.authorName}
                </h3>
                <p className="text-xs font-mono text-soft-sage">
                  {selectedAuthorProfile.authorCity}, {selectedAuthorProfile.authorState} Circle
                </p>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-[#1F140E] text-[#D4AF37]">
                  {selectedAuthorProfile.authorRole || 'Verified Mother in Sisterhood'}
                </span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-copper-penny/20 space-y-2 text-xs">
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="text-gray-500">Community Trust Standing:</span>
                <strong className="text-emerald-700 font-bold">✓ 98% Verified Sister</strong>
              </div>
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="text-gray-500">Recent Post:</span>
                <span className="text-[#1F140E] font-medium truncate max-w-[180px]">
                  {selectedAuthorProfile.title || 'Community Post'}
                </span>
              </div>
              <p className="text-gray-600 text-[11px] pt-1 leading-relaxed border-t border-copper-penny/10">
                Active member in {selectedAuthorProfile.authorState} Circle. Committed to reciprocal care, barter trades, and upliftment.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={() => {
                  const author = selectedAuthorProfile.authorName;
                  const context = `Regarding post: "${selectedAuthorProfile.title || 'Village Commons Post'}"`;
                  setSelectedAuthorProfile(null);
                  handleOpenMessageModal(author, context);
                }}
                className="flex-1 py-3 bg-[#1F140E] hover:bg-[#2A1D16] text-[#D4AF37] font-serif font-bold text-xs rounded-xl shadow-md flex items-center justify-center space-x-2 transition-all cursor-pointer active:scale-95"
              >
                <span>💌 Message Sister Directly</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedAuthorProfile(null)}
                className="px-4 py-3 bg-white hover:bg-neutral-100 text-[#1F140E] font-mono text-xs font-bold rounded-xl border border-copper-penny/25 transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DYNAMIC FORUM TOPIC FILTER MODAL */}
      {showTopicFilterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-[#FFFDF9] border-2 border-[#D4AF37] rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b border-copper-penny/15 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#D4AF37]/20 text-[#B87333] flex items-center justify-center font-bold">
                  <Filter className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="font-serif font-black text-base text-[#1F140E]">
                    Forum Topics &amp; Sanctum Filters
                  </h3>
                  <p className="text-[10px] font-mono text-soft-sage">
                    Filter community posts &amp; mother reflections by topic
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowTopicFilterModal(false)}
                className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-[#1F140E] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1.5 font-mono text-xs">
              {[
                { id: 'all', label: 'All Forum Topics & Posts', emoji: '🌿', count: posts.length, desc: 'Complete village sanctuary stream' },
                { id: 'daily-uplift', label: 'Daily Uplift & Affirmations', emoji: '🕊️', count: posts.filter(p => p.topic === 'daily-uplift').length, desc: 'Morning prayers, words of power & sister encouragement' },
                { id: 'herbal-remedies', label: 'Natural Remedies & Healing', emoji: '🌱', count: posts.filter(p => p.topic === 'herbal-remedies').length, desc: 'Apothecary advice, elderberry tinctures, teas & root medicine' },
                { id: 'birth-postpartum', label: 'Motherhood, Birth & Family', emoji: '👶', count: posts.filter(p => p.topic === 'birth-postpartum').length, desc: 'Postpartum care, labor stories, breastfeeding & infant nourishment' },
                { id: 'homeschool-nestbright', label: 'Homeschool & Co-op Learning', emoji: '📚', count: posts.filter(p => p.topic === 'homeschool-nestbright').length, desc: 'Homeschool pods, curriculum reviews, tutoring & teacher tips' },
                { id: 'homestead-seeds', label: 'Homesteading & Seed Savers', emoji: '🌾', count: posts.filter(p => p.topic === 'homestead-seeds').length, desc: 'Kitchen gardening, chicken keeping, heirloom seeds & food preservation' },
                { id: 'wealth-strategies', label: 'Cooperative Wealth & Gigs', emoji: '💰', count: posts.filter(p => p.topic === 'wealth-strategies').length, desc: 'Sister contracts, barter partnerships, business loans & gig swaps' },
              ].map(topic => {
                const isSelected = selectedTopic === topic.id;
                return (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => {
                      setSelectedTopic(topic.id);
                      setShowTopicFilterModal(false);
                      showToast(`Filtered feed to ${topic.label}`);
                    }}
                    className={`w-full p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between group ${
                      isSelected
                        ? 'bg-[#1F140E] text-[#D4AF37] border-[#D4AF37] shadow-sm'
                        : 'bg-white hover:bg-[#FAF5EE] text-[#1F140E] border-copper-penny/20'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <span className="text-lg">{topic.emoji}</span>
                      <div className="min-w-0">
                        <div className="font-serif font-bold text-xs truncate">
                          {topic.label}
                        </div>
                        <div className="text-[10px] text-gray-500 font-sans truncate">
                          {topic.desc}
                        </div>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold shrink-0 ml-2 ${
                      isSelected ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : 'bg-[#FAF5EE] text-gray-600'
                    }`}>
                      {topic.count}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-copper-penny/10">
              <button
                type="button"
                onClick={() => {
                  setSelectedTopic('all');
                  setShowTopicFilterModal(false);
                  showToast('Reset filter to All Topics');
                }}
                className="text-xs font-mono text-[#B87333] hover:underline font-bold"
              >
                Reset Filter
              </button>
              <button
                type="button"
                onClick={() => setShowTopicFilterModal(false)}
                className="px-4 py-2 bg-[#1F140E] text-[#D4AF37] font-mono text-xs font-bold rounded-xl shadow-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL: MANDATORY REPORT POST CONFIRMATION POP-OUT     */}
      {/* ==================================================== */}
      {postToReport && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF5EE] border-2 border-red-500/50 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-scale-up max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-copper-penny/20 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-red-100 border border-red-300 flex items-center justify-center text-red-600">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-black text-base text-[#1F140E]">
                    Report Post
                  </h3>
                  <p className="text-[10px] font-mono text-soft-sage">
                    Community Guidelines Review
                  </p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setPostToReport(null)}
                className="p-1.5 rounded-lg hover:bg-neutral-200 text-neutral-500 cursor-pointer"
                title="Cancel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Policy & Review Banner */}
            <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-2xl space-y-1">
              <div className="flex items-center space-x-2 text-amber-900 font-mono text-xs font-bold">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Community Review Notice</span>
              </div>
              <p className="text-xs text-[#2A221B]/85 font-sans leading-relaxed">
                <strong>Reporting will NOT automatically delete or hide this post.</strong> Your report will be carefully reviewed against our community guidelines by administration.
              </p>
            </div>

            {/* Post Snippet Verification */}
            <div className="p-3 bg-white rounded-2xl border border-copper-penny/20 space-y-1">
              <div className="flex items-center justify-between text-[10px] font-mono text-soft-sage">
                <span className="font-bold text-[#1F140E]">Author: {postToReport.authorName} ({postToReport.authorState} Circle)</span>
                <span>{postToReport.createdAt}</span>
              </div>
              {postToReport.title && (
                <div className="font-serif font-bold text-xs text-[#1F140E]">{postToReport.title}</div>
              )}
              <p className="text-xs text-[#1F140E]/80 font-sans italic line-clamp-3">
                "{postToReport.content}"
              </p>
            </div>

            {/* Form */}
            <div className="space-y-3.5 text-xs font-mono">
              <div>
                <label className="block text-[10px] uppercase font-bold text-soft-sage mb-1">
                  Reason for Reporting *
                </label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full bg-white border border-copper-penny/25 p-2.5 rounded-xl text-xs font-bold text-[#1F140E] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                >
                  <option value="Commercial / Wholesale Spam or Reselling">📦 Commercial Wholesale Spam or Dropshipping</option>
                  <option value="Financial Scam, Crypto, or Money Solicitation">🪙 Financial Scam, Crypto, or Cash App Flip</option>
                  <option value="Harassment, Bullying, or Personal Disrespect">🛑 Harassment, Bullying, or Disrespect to Sisters</option>
                  <option value="Hate Speech or Offensive Slurs">🚫 Hate Speech or Offensive Language</option>
                  <option value="Inappropriate or Harmful Substances">⚠️ Dangerous Substances or Black-Market Meds</option>
                  <option value="Off-Platform Solicitations (Telegram / WhatsApp)">📱 Off-Platform Solicitations (Telegram / WhatsApp / Wire)</option>
                  <option value="Doxxing or Sharing Private Information">🔒 Doxxing or Sharing Private Personal Details</option>
                  <option value="Other Sacred Space Violation">🌿 Other Community Guideline Concern</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-soft-sage mb-1">
                  Add Context / Notes (Optional):
                </label>
                <textarea
                  value={reportNotes}
                  onChange={(e) => setReportNotes(e.target.value)}
                  rows={2.5}
                  placeholder="Share a quick note explaining why you are reporting this post..."
                  className="w-full bg-white border border-copper-penny/25 p-2.5 rounded-xl text-xs font-sans focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>

              {/* Mandatory Intentional Checkbox */}
              <label className="p-3 bg-red-50/60 border border-red-200 rounded-2xl flex items-start space-x-2.5 cursor-pointer hover:bg-red-50 transition-colors">
                <input
                  type="checkbox"
                  checked={confirmReportChecked}
                  onChange={(e) => setConfirmReportChecked(e.target.checked)}
                  className="mt-0.5 rounded text-red-600 focus:ring-red-500 h-4 w-4 cursor-pointer"
                />
                <span className="text-[11px] text-red-950 font-sans leading-tight">
                  <strong>I confirm this is an intentional report</strong>, and I am requesting administrative review for this post against community guidelines.
                </span>
              </label>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between border-t border-copper-penny/10">
                <button
                  type="button"
                  onClick={() => setPostToReport(null)}
                  className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 rounded-xl font-bold cursor-pointer transition-colors"
                >
                  Cancel Report
                </button>
                <button
                  type="button"
                  disabled={!confirmReportChecked}
                  onClick={handleConfirmReport}
                  className={`px-5 py-2 rounded-xl font-bold font-mono text-xs flex items-center space-x-1.5 transition-all shadow-md ${
                    confirmReportChecked 
                      ? 'bg-red-600 hover:bg-red-700 text-white cursor-pointer' 
                      : 'bg-neutral-300 text-neutral-500 cursor-not-allowed opacity-60'
                  }`}
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Submit Official Report</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trade Handshake Modal Overlay */}
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
          setActiveTradeRecord(trade);
          showToast(`🤝 Trade proposal sent to ${trade.recipientName}! Handshake tracker opened.`);
        }}
        showToast={showToast}
      />

      {/* Create Unified Marketplace Listing Overlay Modal */}
      <CreateUnifiedListingModal
        isOpen={isUnifiedCreateModalOpen}
        onClose={() => setIsUnifiedCreateModalOpen(false)}
        userName={userName}
        selectedState={selectedState}
        initialCategory={unifiedModalCategory}
        onListingCreated={(newListing) => {
          setIsUnifiedCreateModalOpen(false);
          setUnifiedListings(getStoredUnifiedListings());
          showToast(`✨ Published new ${newListing.categoryType.toUpperCase()} listing!`);
        }}
        showToast={showToast}
      />

    </div>
  );
}
