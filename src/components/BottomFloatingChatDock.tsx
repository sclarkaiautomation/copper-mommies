import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  MessageSquare, 
  ChevronUp, 
  ChevronDown, 
  ChevronLeft, 
  Edit3, 
  Send, 
  Image as ImageIcon, 
  MoreVertical, 
  X, 
  Search, 
  Check, 
  ExternalLink,
  ShieldAlert,
  BellOff,
  EyeOff,
  UserX,
  Maximize2,
  Copy,
  Trash2,
  CornerUpLeft,
  Pin,
  Smile,
  CheckCheck,
  Building2,
  Briefcase,
  Home,
  RefreshCw,
  GraduationCap,
  Sparkles,
  Heart,
  Handshake,
  CheckCircle2,
  MapPin,
  Hash
} from 'lucide-react';
import { DirectChatThread, ChatMember, DirectChatMessage, ChatCategory } from '../types';
import { POPULAR_HASHTAGS } from '../data/globalHashtagData';
import { FormattedContentWithHashtags } from './InteractiveReplyBox';

interface BottomFloatingChatDockProps {
  threads: DirectChatThread[];
  members: ChatMember[];
  currentUserName?: string;
  isOpen?: boolean;
  onToggleOpen?: (open: boolean) => void;
  activeThreadId?: string | null;
  onSelectThreadId?: (id: string | null) => void;
  onSendMessage: (threadId: string, text: string, replyTo?: { id: string; text: string; senderName: string }) => void;
  onCreateNewChat: (participantId: string, initialMessage?: string) => void;
  onNavigateToProfileChats?: () => void;
  onNavigateToTab?: (tab: string, subTab?: string) => void;
  onConfirmTradeHandshake?: (threadId: string) => void;
  onEditMessage?: (threadId: string, messageId: string, newText: string) => void;
  onDeleteMessage?: (threadId: string, messageId: string) => void;
  onPinMessage?: (threadId: string, messageId: string) => void;
  onReactMessage?: (threadId: string, messageId: string, emoji: string) => void;
  onExecuteHashtagSearch?: (tag: string) => void;
}

export default function BottomFloatingChatDock({
  threads,
  members,
  currentUserName = 'Shantrece Clark',
  isOpen: externalIsOpen,
  onToggleOpen,
  activeThreadId: externalActiveThreadId,
  onSelectThreadId,
  onSendMessage,
  onCreateNewChat,
  onNavigateToProfileChats,
  onNavigateToTab,
  onConfirmTradeHandshake,
  onEditMessage,
  onDeleteMessage,
  onPinMessage,
  onReactMessage,
  onExecuteHashtagSearch
}: BottomFloatingChatDockProps) {
  // Support both internal and controlled state for dock open/closed
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = (open: boolean) => {
    if (onToggleOpen) onToggleOpen(open);
    setInternalIsOpen(open);
  };

  // Support both internal and controlled state for active thread
  const [internalActiveThreadId, setInternalActiveThreadId] = useState<string | null>(null);
  const activeThreadId = externalActiveThreadId !== undefined ? externalActiveThreadId : internalActiveThreadId;
  const setActiveThreadId = (id: string | null) => {
    if (onSelectThreadId) onSelectThreadId(id);
    setInternalActiveThreadId(id);
  };

  // Category filter state for threads list
  const [selectedCategory, setSelectedCategory] = useState<ChatCategory>('all');
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [threadSearch, setThreadSearch] = useState('');
  const [memberSearch, setMemberSearch] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [showOptionsDropdown, setShowOptionsDropdown] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Hashtag search & autocomplete state inside floating chat
  const [showChatHashtagMenu, setShowChatHashtagMenu] = useState(false);
  const [chatHashtagFilter, setChatHashtagFilter] = useState('');

  // Quick action chips dismissal state
  const [dismissedChips, setDismissedChips] = useState<Set<string>>(new Set());
  const [showQuickRepliesBar, setShowQuickRepliesBar] = useState(true);

  // Message 3-dots active menu & reply state
  const [activeMessageMenuId, setActiveMessageMenuId] = useState<string | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [replyingToMessage, setReplyingToMessage] = useState<DirectChatMessage | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const chatScrollContainerRef = useRef<HTMLDivElement | null>(null);
  const messageInputRef = useRef<HTMLInputElement | null>(null);

  const handleChatInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setMessageInput(val);

    const lastHashIndex = val.lastIndexOf('#');
    if (lastHashIndex !== -1) {
      const queryAfterHash = val.slice(lastHashIndex + 1);
      if (!queryAfterHash.includes(' ')) {
        setChatHashtagFilter(queryAfterHash);
        setShowChatHashtagMenu(true);
      } else {
        setShowChatHashtagMenu(false);
      }
    } else {
      setShowChatHashtagMenu(false);
    }
  };

  const handleSelectChatHashtag = (tag: string) => {
    const lastHashIndex = messageInput.lastIndexOf('#');
    if (lastHashIndex !== -1) {
      const textBeforeHash = messageInput.slice(0, lastHashIndex);
      setMessageInput(`${textBeforeHash}${tag} `);
    } else {
      setMessageInput(prev => {
        const cleanPrev = prev.trim();
        return cleanPrev ? `${cleanPrev} ${tag} ` : `${tag} `;
      });
    }
    setShowChatHashtagMenu(false);
    if (messageInputRef.current) messageInputRef.current.focus();
  };

  const filteredChatHashtags = POPULAR_HASHTAGS.filter(ht =>
    ht.tag.toLowerCase().includes(chatHashtagFilter.toLowerCase()) ||
    ht.label.toLowerCase().includes(chatHashtagFilter.toLowerCase()) ||
    ht.description.toLowerCase().includes(chatHashtagFilter.toLowerCase())
  );

  const activeThread = useMemo(() => {
    return threads.find(t => t.id === activeThreadId) || (threads.length > 0 ? threads[0] : null);
  }, [threads, activeThreadId]);

  // Total unread count across all threads
  const totalUnreadCount = useMemo(() => {
    return threads.reduce((acc, t) => acc + (t.unreadCount || 0), 0);
  }, [threads]);

  // Counts by category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, { total: number; unread: number }> = {
      all: { total: threads.length, unread: totalUnreadCount },
      exchange: { total: 0, unread: 0 },
      housing: { total: 0, unread: 0 },
      jobs: { total: 0, unread: 0 },
      dm: { total: 0, unread: 0 },
      academy: { total: 0, unread: 0 },
      business: { total: 0, unread: 0 }
    };

    threads.forEach(t => {
      const cat = t.category || 'dm';
      if (!counts[cat]) counts[cat] = { total: 0, unread: 0 };
      counts[cat].total += 1;
      counts[cat].unread += (t.unreadCount || 0);
    });

    return counts;
  }, [threads, totalUnreadCount]);

  // Auto-scroll on new message or thread select
  useEffect(() => {
    if (isOpen && activeThreadId && chatScrollContainerRef.current) {
      chatScrollContainerRef.current.scrollTop = chatScrollContainerRef.current.scrollHeight;
    }
  }, [isOpen, activeThreadId, activeThread?.messages]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeThread) return;
    
    const replyMeta = replyingToMessage ? {
      id: replyingToMessage.id,
      text: replyingToMessage.text,
      senderName: replyingToMessage.senderName
    } : undefined;

    onSendMessage(activeThread.id, messageInput.trim(), replyMeta);
    setMessageInput('');
    setReplyingToMessage(null);
  };

  const handleCreateChatSubmit = () => {
    if (!selectedMemberId) return;
    onCreateNewChat(selectedMemberId);
    setIsCreatingNew(false);
    setSelectedMemberId(null);
  };

  const handleCopyMessage = (text: string) => {
    navigator.clipboard?.writeText(text);
    showToast('Message copied to clipboard');
    setActiveMessageMenuId(null);
  };

  const handleStartEdit = (msg: DirectChatMessage) => {
    setEditingMessageId(msg.id);
    setEditingText(msg.text);
    setActiveMessageMenuId(null);
  };

  const handleSaveEdit = (msgId: string) => {
    if (!editingText.trim() || !activeThread) return;
    if (onEditMessage) {
      onEditMessage(activeThread.id, msgId, editingText.trim());
    }
    setEditingMessageId(null);
    setEditingText('');
    showToast('Message updated');
  };

  const handleDelete = (msgId: string) => {
    if (!activeThread) return;
    if (onDeleteMessage) {
      onDeleteMessage(activeThread.id, msgId);
    }
    setActiveMessageMenuId(null);
    showToast('Message deleted');
  };

  const handlePin = (msgId: string) => {
    if (!activeThread) return;
    if (onPinMessage) {
      onPinMessage(activeThread.id, msgId);
    }
    setActiveMessageMenuId(null);
    showToast('Message pinned to conversation');
  };

  const handleReact = (msgId: string, emoji: string) => {
    if (!activeThread) return;
    if (onReactMessage) {
      onReactMessage(activeThread.id, msgId, emoji);
    }
    setActiveMessageMenuId(null);
    showToast(`Reacted with ${emoji}`);
  };

  // Quick Action Chips Insert
  const handleQuickInsert = (starter: string) => {
    setMessageInput(prev => prev ? `${prev} ${starter}` : starter);
    if (messageInputRef.current) {
      messageInputRef.current.focus();
    }
  };

  // Helper for Category Metadata (Badge Label, Icon, Color Scheme)
  const getCategoryMeta = (cat: ChatCategory | string) => {
    switch (cat) {
      case 'exchange':
        return {
          label: 'Barter Trade',
          shortLabel: 'Trades',
          icon: '🤝',
          bgClass: 'bg-amber-500/15 text-amber-900 border-amber-300',
          dotColor: 'bg-amber-600',
          hubTab: 'economy'
        };
      case 'housing':
        return {
          label: 'Housing Haven',
          shortLabel: 'Housing',
          icon: '🏡',
          bgClass: 'bg-emerald-500/15 text-emerald-900 border-emerald-300',
          dotColor: 'bg-emerald-600',
          hubTab: 'commons'
        };
      case 'jobs':
        return {
          label: 'Vetted Gig',
          shortLabel: 'Gigs',
          icon: '💼',
          bgClass: 'bg-sky-500/15 text-sky-900 border-sky-300',
          dotColor: 'bg-sky-600',
          hubTab: 'commons'
        };
      case 'academy':
        return {
          label: 'Mothers Academy',
          shortLabel: 'Academy',
          icon: '🎓',
          bgClass: 'bg-[#D4AF37]/20 text-[#1F140E] border-[#D4AF37]/40',
          dotColor: 'bg-[#D4AF37]',
          hubTab: 'academy'
        };
      case 'business':
        return {
          label: 'Business Inquiry',
          shortLabel: 'Business',
          icon: '✨',
          bgClass: 'bg-purple-500/15 text-purple-900 border-purple-300',
          dotColor: 'bg-purple-600',
          hubTab: 'commons'
        };
      case 'dm':
      default:
        return {
          label: 'Sister Circle',
          shortLabel: 'Circle',
          icon: '🌸',
          bgClass: 'bg-rose-500/15 text-rose-900 border-rose-300',
          dotColor: 'bg-rose-600',
          hubTab: 'gathering'
        };
    }
  };

  // Filtered threads list
  const filteredThreads = useMemo(() => {
    return threads.filter(t => {
      const matchesCategory = selectedCategory === 'all' || (t.category || 'dm') === selectedCategory;
      const matchesSearch = !threadSearch.trim() || 
        t.participantName.toLowerCase().includes(threadSearch.toLowerCase()) ||
        (t.originSectionLabel && t.originSectionLabel.toLowerCase().includes(threadSearch.toLowerCase())) ||
        (t.originListingSummary && t.originListingSummary.toLowerCase().includes(threadSearch.toLowerCase())) ||
        t.lastMessage.toLowerCase().includes(threadSearch.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [threads, selectedCategory, threadSearch]);

  const filteredMembers = useMemo(() => {
    return members.filter(m => 
      m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
      m.neighborhood.toLowerCase().includes(memberSearch.toLowerCase())
    );
  }, [members, memberSearch]);

  return (
    <div className="fixed bottom-0 right-3 sm:right-6 z-40 flex flex-col items-end">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="mb-2 bg-[#1F140E] text-[#FAF5EE] text-xs font-mono px-3.5 py-1.5 rounded-xl border border-[#D4AF37] shadow-xl animate-fade-in flex items-center space-x-2">
          <span>🕊️</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. COLLAPSED DOCKED PILL (Unified Sanctuary Messenger Trigger) */}
      {!isOpen && (
        <div 
          onClick={() => setIsOpen(true)}
          className="bg-white border-2 border-copper-penny/35 hover:border-[#D4AF37] shadow-2xl rounded-t-2xl px-3 sm:px-4 py-2 flex items-center space-x-2.5 transition-all cursor-pointer group bg-gradient-to-r from-white via-[#FAF5EE] to-white hover:-translate-y-0.5"
          title="Open Unified Village Sanctuary Messenger (Trades, Housing, Gigs, Sister Circle & Academy)"
        >
          <div className="flex items-center space-x-2 text-xs font-bold text-[#1F1813]">
            <div className="relative w-6 h-6 rounded-full bg-[#1F140E] text-[#D4AF37] flex items-center justify-center text-[10px] font-bold shadow-xs">
              <MessageSquare className="w-3.5 h-3.5" />
              {totalUnreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border border-white animate-pulse" />
              )}
            </div>
            <div className="flex flex-col text-left">
              <span className="font-serif font-black text-xs text-[#1F1813] group-hover:text-copper-penny transition-colors leading-tight">
                Sanctuary Chat
              </span>
              <span className="text-[9px] font-mono text-soft-sage hidden xs:inline leading-tight">
                {totalUnreadCount > 0 ? `${totalUnreadCount} unread message${totalUnreadCount > 1 ? 's' : ''}` : 'Trades · Housing · Gigs · DMs'}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-1 border-l border-copper-penny/20 pl-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(true);
                setIsCreatingNew(true);
              }}
              className="p-1 text-gray-500 hover:text-black hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
              title="New message"
            >
              <Edit3 className="w-3.5 h-3.5 text-copper-penny" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(true);
              }}
              className="p-1 text-gray-500 hover:text-black hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
              title="Expand messenger"
            >
              <ChevronUp className="w-4 h-4 text-copper-penny" />
            </button>
          </div>
        </div>
      )}

      {/* 2. EXPANDED FLOATING DOCK WINDOW */}
      {isOpen && (
        <div className="w-[94vw] xs:w-88 sm:w-[420px] h-[520px] max-h-[88vh] bg-white border-2 border-[#D4AF37] rounded-t-3xl shadow-[0_-10px_40px_rgba(31,24,19,0.25)] flex flex-col overflow-hidden animate-slide-up">
          
          {/* Header Bar */}
          <div className="bg-[#FAF5EE] border-b border-copper-penny/20 px-3.5 py-2.5 flex items-center justify-between text-[#1F1813] select-none shrink-0">
            
            {/* Left: Back / Title / Active Recipient */}
            <div className="flex items-center space-x-2 min-w-0">
              {activeThreadId && !isCreatingNew ? (
                <>
                  <button
                    type="button"
                    onClick={() => setActiveThreadId(null)}
                    className="p-1 text-gray-500 hover:text-black hover:bg-white rounded-lg cursor-pointer transition-colors shrink-0"
                    title="All channels & conversations"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="w-8 h-8 rounded-full overflow-hidden border border-[#D4AF37] shrink-0 bg-neutral-100 shadow-xs">
                    <img 
                      src={activeThread?.participantAvatar || '/coppermommies-selflove1-cmc.jpg'} 
                      alt={activeThread?.participantName} 
                      className="w-full h-full object-cover" 
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center space-x-1.5">
                      <h4 className="font-bold text-xs text-[#1F1813] truncate leading-tight">
                        {activeThread?.participantName}
                      </h4>
                      {activeThread?.category && (
                        <span className={`text-[8.5px] font-mono px-1.5 py-0.2 rounded-full border leading-tight ${getCategoryMeta(activeThread.category).bgClass}`}>
                          {getCategoryMeta(activeThread.category).shortLabel}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-soft-sage font-mono truncate leading-tight">
                      {activeThread?.participantNeighborhood || 'Sanctuary Member'}
                    </p>
                  </div>
                </>
              ) : isCreatingNew ? (
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsCreatingNew(false)}
                    className="p-1 text-gray-500 hover:text-black hover:bg-white rounded-lg cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <h4 className="font-bold text-xs font-serif text-[#1F1813]">New Village Message</h4>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-lg bg-[#1F140E] text-[#D4AF37] flex items-center justify-center text-xs">
                    <MessageSquare className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs font-serif text-[#1F1813] leading-tight">Village Messenger</h4>
                    <span className="text-[9px] font-mono text-soft-sage block leading-tight">
                      All Lines of Sister Communication
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Actions (New Message, Maximize, Collapse) */}
            <div className="flex items-center space-x-1 shrink-0">
              
              {!isCreatingNew && !activeThreadId && (
                <button
                  type="button"
                  onClick={() => setIsCreatingNew(true)}
                  className="p-1.5 text-gray-600 hover:text-black hover:bg-white rounded-lg cursor-pointer"
                  title="Create new message"
                >
                  <Edit3 className="w-3.5 h-3.5 text-copper-penny" />
                </button>
              )}

              {onNavigateToProfileChats && (
                <button
                  type="button"
                  onClick={() => {
                    onNavigateToProfileChats();
                    setIsOpen(false);
                  }}
                  className="p-1.5 text-gray-600 hover:text-black hover:bg-white rounded-lg cursor-pointer transition-colors"
                  title="Expand to Fullscreen in My Profile"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-copper-penny" />
                </button>
              )}

              {/* Thread 3-Dots Menu Trigger */}
              {activeThreadId && !isCreatingNew && (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowOptionsDropdown(prev => !prev)}
                    className="p-1.5 text-gray-600 hover:text-black hover:bg-white rounded-lg cursor-pointer"
                    title="Chat options"
                  >
                    <MoreVertical className="w-3.5 h-3.5" />
                  </button>

                  {/* 3-Dots Dropdown Menu */}
                  {showOptionsDropdown && (
                    <>
                      <div 
                        className="fixed inset-0 z-30" 
                        onClick={() => setShowOptionsDropdown(false)} 
                      />
                      <div className="absolute right-0 mt-1 w-44 bg-white border border-copper-penny/25 rounded-2xl shadow-xl p-1.5 z-40 text-xs font-sans space-y-1 animate-fade-in">
                        <button
                          onClick={() => {
                            showToast('Chat notifications muted for 24h');
                            setShowOptionsDropdown(false);
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-neutral-100 flex items-center space-x-2 text-gray-700 cursor-pointer"
                        >
                          <BellOff className="w-3.5 h-3.5 text-gray-500" />
                          <span>Mute chat</span>
                        </button>
                        <button
                          onClick={() => {
                            showToast('Chat hidden from active list');
                            setShowOptionsDropdown(false);
                            setActiveThreadId(null);
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-neutral-100 flex items-center space-x-2 text-gray-700 cursor-pointer"
                        >
                          <EyeOff className="w-3.5 h-3.5 text-gray-500" />
                          <span>Hide chat</span>
                        </button>
                        <button
                          onClick={() => {
                            showToast(`Blocked ${activeThread?.participantName}`);
                            setShowOptionsDropdown(false);
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-neutral-100 flex items-center space-x-2 text-rose-700 cursor-pointer"
                        >
                          <UserX className="w-3.5 h-3.5 text-rose-600" />
                          <span>Block member</span>
                        </button>
                        <button
                          onClick={() => {
                            showToast('Report submitted to Council for review');
                            setShowOptionsDropdown(false);
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-neutral-100 flex items-center space-x-2 text-gray-700 cursor-pointer"
                        >
                          <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                          <span>Report to Council</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Minimize Down Arrow */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-gray-500 hover:text-black hover:bg-white rounded-lg cursor-pointer transition-colors"
                title="Minimize chat window"
              >
                <ChevronDown className="w-4 h-4" />
              </button>

              {/* Close X Button */}
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setActiveThreadId(null);
                }}
                className="p-1.5 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                title="Close floating chat window"
                aria-label="Close Chat Window"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Body Content */}
          <div className="flex-1 min-h-0 flex flex-col bg-white overflow-hidden">
            
            {/* VIEW A: CREATE NEW CHAT MODAL */}
            {isCreatingNew ? (
              <div className="p-3 flex-1 flex flex-col space-y-3 overflow-y-auto">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
                  <input 
                    type="text"
                    value={memberSearch}
                    onChange={(e) => setMemberSearch(e.target.value)}
                    placeholder="Search sister or neighbor..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FAF5EE]/60 border border-copper-penny/25 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                  />
                </div>

                <span className="text-[10px] font-mono uppercase font-bold text-gray-400 block px-1">
                  COMMUNITY SISTERS
                </span>

                <div className="flex-1 overflow-y-auto space-y-1 pr-1">
                  {filteredMembers.map(m => {
                    const isSelected = selectedMemberId === m.id;
                    return (
                      <div 
                        key={m.id}
                        onClick={() => setSelectedMemberId(isSelected ? null : m.id)}
                        className={`p-2 rounded-xl flex items-center justify-between cursor-pointer transition-colors ${
                          isSelected ? 'bg-[#FAF5EE] border border-[#D4AF37]/50' : 'hover:bg-neutral-50'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5 min-w-0">
                          <img src={m.avatar || '/coppermommies-selflove1-cmc.jpg'} alt={m.name} className="w-8 h-8 rounded-full object-cover shrink-0 border border-copper-penny/20" />
                          <div className="min-w-0">
                            <h5 className="font-bold text-xs text-[#1F1813] truncate">{m.name}</h5>
                            <p className="text-[10px] text-gray-500 font-mono truncate">{m.neighborhood}</p>
                          </div>
                        </div>

                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                          isSelected ? 'bg-[#1F1813] border-[#1F1813] text-[#D4AF37]' : 'border-gray-300'
                        }`}>
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-end space-x-2">
                  <button 
                    type="button"
                    onClick={() => setIsCreatingNew(false)}
                    className="px-3 py-1.5 text-xs font-bold text-gray-600 hover:bg-neutral-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button 
                    type="button"
                    disabled={!selectedMemberId}
                    onClick={handleCreateChatSubmit}
                    className="px-4 py-1.5 text-xs font-bold bg-[#1F1813] text-[#FAF5EE] rounded-xl hover:bg-[#2A221B] disabled:bg-gray-200 disabled:text-gray-400 cursor-pointer shadow-xs"
                  >
                    Start Chat
                  </button>
                </div>
              </div>
            ) : !activeThreadId ? (
              /* VIEW B: LIST OF ALL THREADS WITH ECOSYSTEM CATEGORY TABS */
              <div className="flex-1 flex flex-col overflow-hidden">
                
                {/* 1. Category Filter Navigation Pills (Responsive & Touch-Scrollable) */}
                <div className="bg-[#FAF5EE]/95 border-b border-copper-penny/20 px-2.5 py-2 overflow-x-auto scrollbar-none flex items-center space-x-1.5 shrink-0 w-full min-w-0 font-mono text-xs">
                  {[
                    { id: 'all', label: 'All', icon: '💬' },
                    { id: 'exchange', label: 'Trades', icon: '🤝' },
                    { id: 'housing', label: 'Housing', icon: '🏡' },
                    { id: 'jobs', label: 'Gigs', icon: '💼' },
                    { id: 'dm', label: 'Sister Circle', icon: '🌸' },
                    { id: 'academy', label: 'Academy', icon: '🎓' },
                    { id: 'business', label: 'Business', icon: '✨' }
                  ].map(tab => {
                    const count = categoryCounts[tab.id]?.total || 0;
                    const unread = categoryCounts[tab.id]?.unread || 0;
                    const isSelected = selectedCategory === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setSelectedCategory(tab.id as ChatCategory)}
                        className={`px-2.5 py-1 rounded-xl text-[10.5px] font-mono font-bold transition-all shrink-0 cursor-pointer flex items-center space-x-1 ${
                          isSelected
                            ? 'bg-[#1F140E] text-[#D4AF37] shadow-2xs font-extrabold ring-1 ring-[#D4AF37]/50'
                            : 'bg-white hover:bg-neutral-50 text-[#1F1813]/85 border border-copper-penny/20 shadow-2xs'
                        }`}
                      >
                        <span>{tab.icon}</span>
                        <span>{tab.label}</span>
                        {count > 0 && (
                          <span className={`text-[8.5px] px-1.5 py-0.2 rounded-full font-sans font-extrabold ${
                            isSelected ? 'bg-[#D4AF37] text-[#1F140E]' : 'bg-stone-200 text-stone-700'
                          }`}>
                            {count}
                          </span>
                        )}
                        {unread > 0 && (
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* 2. Search Conversations Filter */}
                <div className="p-2 border-b border-gray-100 bg-white">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-gray-400" />
                    <input 
                      type="text"
                      value={threadSearch}
                      onChange={(e) => setThreadSearch(e.target.value)}
                      placeholder="Search trades, housing, sisters, or messages..."
                      className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FAF5EE]/60 border border-copper-penny/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                    />
                  </div>
                </div>

                {/* 3. Filtered Thread Feed */}
                <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
                  {filteredThreads.length === 0 ? (
                    <div className="text-center py-12 px-4 space-y-2">
                      <span className="text-3xl block">🕊️</span>
                      <p className="text-xs font-serif font-bold text-[#1F1813]">
                        No {selectedCategory !== 'all' ? getCategoryMeta(selectedCategory).label : ''} conversations yet
                      </p>
                      <p className="text-[11px] text-soft-sage leading-relaxed">
                        Inquiries from Marketplace barter trades, Housing Haven listings, Job Desk gigs, and Academy tracks will appear directly here.
                      </p>
                    </div>
                  ) : (
                    filteredThreads.map(t => {
                      const catMeta = getCategoryMeta(t.category || 'dm');
                      return (
                        <div
                          key={t.id}
                          onClick={() => setActiveThreadId(t.id)}
                          className={`p-3 flex items-start space-x-3 hover:bg-[#FAF5EE] cursor-pointer transition-colors ${
                            t.unreadCount > 0 ? 'bg-[#FAF5EE]/70 font-semibold' : ''
                          }`}
                        >
                          <div className="relative shrink-0">
                            <img 
                              src={t.participantAvatar || '/coppermommies-selflove1-cmc.jpg'} 
                              alt={t.participantName} 
                              className="w-10 h-10 rounded-full object-cover border border-copper-penny/20"
                            />
                            <span className="absolute -bottom-1 -right-1 text-xs" title={catMeta.label}>
                              {catMeta.icon}
                            </span>
                          </div>

                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center justify-between">
                              <h5 className="font-bold text-xs text-[#1F1813] truncate">{t.participantName}</h5>
                              <span className="text-[9.5px] font-mono text-gray-400 shrink-0">{t.lastMessageTime}</span>
                            </div>

                            <p className="text-[11px] text-gray-600 truncate leading-relaxed">
                              {t.lastMessage}
                            </p>

                            {/* Context & Category Chips */}
                            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                              <span className={`text-[8.5px] font-mono px-1.5 py-0.2 rounded border ${catMeta.bgClass}`}>
                                {catMeta.icon} {catMeta.shortLabel}
                              </span>

                              {t.originSectionLabel && (
                                <span className="text-[8.5px] font-mono text-[#B87333] bg-[#FAF5EE] px-1.5 py-0.2 rounded border border-copper-penny/15 truncate max-w-[170px]">
                                  {t.originSectionLabel}
                                </span>
                              )}

                              {t.tradeStatus === 'proposed' && (
                                <span className="text-[8px] font-mono font-bold bg-amber-100 text-amber-800 px-1 py-0.2 rounded">
                                  🟡 Pending
                                </span>
                              )}
                              {t.tradeStatus === 'accepted' && (
                                <span className="text-[8px] font-mono font-bold bg-emerald-100 text-emerald-800 px-1 py-0.2 rounded">
                                  🟢 Handshake Agreed
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            ) : (
              /* VIEW C: ACTIVE CHAT MESSAGES STREAM WITH PINNED CONTEXT CARD */
              <div className="flex-1 flex flex-col overflow-hidden relative">
                
                {/* 1. PINNED CONTEXT CARD AT TOP OF THREAD (WITH CLICKABLE ITEM LINK) */}
                {activeThread?.originSectionLabel && (
                  <div className="bg-gradient-to-r from-[#FAF5EE] via-[#F5ECE5] to-[#FAF5EE] border-b border-[#D4AF37]/40 p-2.5 px-3 space-y-1.5 shrink-0 shadow-2xs">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center space-x-2 min-w-0">
                        {activeThread.originListingImage && (
                          <img 
                            src={activeThread.originListingImage} 
                            alt={activeThread.originSectionLabel} 
                            className="w-10 h-10 rounded-xl object-cover border border-[#D4AF37]/60 shrink-0 shadow-2xs"
                          />
                        )}
                        <div className="min-w-0">
                          <div className="flex items-center space-x-1">
                            <span className="text-xs">
                              {getCategoryMeta(activeThread.category || 'dm').icon}
                            </span>
                            <span className="text-[9px] font-mono font-extrabold uppercase tracking-wider text-[#B87333]">
                              Replying to {getCategoryMeta(activeThread.category || 'dm').label}
                            </span>
                          </div>

                          {/* Clickable link directly back to the item being responded to */}
                          <button
                            type="button"
                            onClick={() => {
                              const targetTab = getCategoryMeta(activeThread.category || 'dm').hubTab;
                              if (onNavigateToTab) {
                                onNavigateToTab(targetTab);
                              }
                            }}
                            className="font-serif font-bold text-xs text-[#1F1813] hover:text-[#B87333] hover:underline truncate leading-tight text-left flex items-center space-x-1 cursor-pointer group"
                            title="Click to view original item in hub"
                          >
                            <span className="truncate">{activeThread.originSectionLabel}</span>
                            <ExternalLink className="w-3 h-3 text-[#B87333] shrink-0 group-hover:scale-110 transition-transform ml-0.5" />
                          </button>

                          {activeThread.originListingSummary && (
                            <p className="text-[10px] text-gray-600 line-clamp-1 leading-tight font-sans">
                              {activeThread.originListingSummary}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Direct CTA Action Buttons */}
                      <div className="flex flex-col items-end space-y-1 shrink-0">
                        {onNavigateToTab && (
                          <button
                            type="button"
                            onClick={() => {
                              const targetTab = getCategoryMeta(activeThread.category || 'dm').hubTab;
                              onNavigateToTab(targetTab);
                            }}
                            className="text-[9.5px] font-mono text-[#1F140E] bg-white hover:bg-stone-50 font-bold px-2 py-0.5 rounded-lg border border-copper-penny/25 shadow-2xs cursor-pointer flex items-center space-x-1"
                            title="View item in hub (keeps chat window open)"
                          >
                            <span>🔗 View Item</span>
                          </button>
                        )}

                        {activeThread.category === 'exchange' && (
                          <button
                            type="button"
                            onClick={() => {
                              if (onConfirmTradeHandshake) {
                                onConfirmTradeHandshake(activeThread.id);
                              }
                              showToast('🤝 Sisterhood barter handshake confirmed!');
                            }}
                            className="text-[9.5px] font-mono bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-2 py-0.5 rounded-lg shadow-2xs cursor-pointer transition-colors"
                            title="Confirm barter agreement"
                          >
                            {activeThread.tradeStatus === 'accepted' ? '✓ Agreed' : '🤝 Handshake'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Message Bubbles Container */}
                <div ref={chatScrollContainerRef} className="flex-1 p-3 overflow-y-auto space-y-3">
                  {activeThread?.messages.map((m) => {
                    const isBeingEdited = editingMessageId === m.id;
                    const isMenuOpen = activeMessageMenuId === m.id;

                    return (
                      <div 
                        key={m.id}
                        className={`flex flex-col ${m.isMe ? 'items-end' : 'items-start'} group relative`}
                      >
                        {/* Quoted Reply Preview */}
                        {m.replyTo && (
                          <div className={`text-[10px] font-mono text-gray-500 mb-1 px-2 py-0.5 bg-gray-100 rounded-lg border-l-2 border-[#D4AF37] max-w-[80%] truncate ${
                            m.isMe ? 'mr-1' : 'ml-8'
                          }`}>
                            <span className="font-bold text-[#1F1813]">{m.replyTo.senderName}:</span> {m.replyTo.text}
                          </div>
                        )}

                        <div className="flex items-start space-x-1.5 max-w-[90%] relative">
                          {!m.isMe && (
                            <img 
                              src={m.senderAvatar || activeThread.participantAvatar || '/coppermommies-selflove1-cmc.jpg'} 
                              alt={m.senderName} 
                              className="w-6 h-6 rounded-full object-cover shrink-0 border border-copper-penny/20 mt-1 shadow-xs"
                            />
                          )}

                          <div className="relative">
                            {isBeingEdited ? (
                              /* Inline Editing Mode */
                              <div className="p-2 bg-white rounded-2xl border-2 border-[#D4AF37] shadow-md space-y-2 min-w-[200px]">
                                <textarea
                                  value={editingText}
                                  onChange={(e) => setEditingText(e.target.value)}
                                  className="w-full text-xs p-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                                  rows={2}
                                />
                                <div className="flex items-center justify-end space-x-1.5 text-[10px]">
                                  <button
                                    type="button"
                                    onClick={() => setEditingMessageId(null)}
                                    className="px-2 py-1 text-gray-500 hover:bg-gray-100 rounded cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleSaveEdit(m.id)}
                                    className="px-2.5 py-1 bg-[#1F1813] text-[#FAF5EE] font-bold rounded hover:bg-[#2A221B] cursor-pointer"
                                  >
                                    Save
                                  </button>
                                </div>
                              </div>
                            ) : (
                              /* Standard Message Bubble */
                              <div 
                                className={`p-2.5 rounded-2xl text-xs font-sans leading-relaxed break-words shadow-xs ${
                                  m.isMe 
                                    ? 'bg-[#1F1813] text-[#FAF5EE] rounded-tr-xs' 
                                    : 'bg-[#FAF5EE] text-[#1F1813] border border-copper-penny/20 rounded-tl-xs'
                                }`}
                              >
                                {m.text}

                                {/* Link Previews */}
                                {m.linkPreviewUrl && (
                                  <a
                                    href={m.linkPreviewUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-2 block p-2 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 text-[10.5px] transition-colors"
                                  >
                                    <span className="font-bold block truncate">{m.linkPreviewTitle || 'Listing Resource'}</span>
                                    <span className="text-[9px] font-mono opacity-70 truncate block">
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
                                  setActiveMessageMenuId(isMenuOpen ? null : m.id);
                                }}
                                className={`absolute -top-2 ${
                                  m.isMe ? '-left-6' : '-right-6'
                                } p-1 rounded-full bg-white border border-copper-penny/25 shadow-xs text-gray-500 hover:text-black hover:bg-gray-50 transition-opacity cursor-pointer z-10 ${
                                  isMenuOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                }`}
                                title="Message options (Edit, Delete, Copy, Reply, React)"
                              >
                                <MoreVertical className="w-3 h-3" />
                              </button>
                            )}

                            {/* MESSAGE 3-DOTS OPTIONS DROPDOWN MENU */}
                            {isMenuOpen && (
                              <>
                                <div 
                                  className="fixed inset-0 z-30" 
                                  onClick={() => setActiveMessageMenuId(null)} 
                                />
                                <div className={`absolute top-0 ${
                                  m.isMe ? 'right-full mr-2' : 'left-full ml-2'
                                } w-44 bg-white border border-copper-penny/30 rounded-2xl shadow-2xl p-1.5 z-40 text-xs font-sans space-y-1 animate-fade-in`}>
                                  
                                  {/* Quick Emoji Reactions */}
                                  <div className="flex items-center justify-around py-1 border-b border-gray-100 px-1">
                                    {['❤️', '🙏', '🕊️', '✨', '👏'].map(emoji => (
                                      <button
                                        key={emoji}
                                        type="button"
                                        onClick={() => handleReact(m.id, emoji)}
                                        className="text-sm hover:scale-125 transition-transform p-0.5 cursor-pointer"
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
                                      onClick={() => handleStartEdit(m)}
                                      className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-neutral-100 flex items-center space-x-2 text-gray-700 cursor-pointer"
                                    >
                                      <Edit3 className="w-3.5 h-3.5 text-copper-penny" />
                                      <span>Edit message</span>
                                    </button>
                                  )}

                                  {/* Reply Directly */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setReplyingToMessage(m);
                                      setActiveMessageMenuId(null);
                                    }}
                                    className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-neutral-100 flex items-center space-x-2 text-gray-700 cursor-pointer"
                                  >
                                    <CornerUpLeft className="w-3.5 h-3.5 text-gray-500" />
                                    <span>Reply</span>
                                  </button>

                                  {/* Copy Message Text */}
                                  <button
                                    type="button"
                                    onClick={() => handleCopyMessage(m.text)}
                                    className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-neutral-100 flex items-center space-x-2 text-gray-700 cursor-pointer"
                                  >
                                    <Copy className="w-3.5 h-3.5 text-gray-500" />
                                    <span>Copy text</span>
                                  </button>

                                  {/* Pin Message */}
                                  <button
                                    type="button"
                                    onClick={() => handlePin(m.id)}
                                    className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-neutral-100 flex items-center space-x-2 text-gray-700 cursor-pointer"
                                  >
                                    <Pin className="w-3.5 h-3.5 text-[#D4AF37]" />
                                    <span>{m.isPinned ? 'Unpin message' : 'Pin message'}</span>
                                  </button>

                                  {/* Delete Message */}
                                  <button
                                    type="button"
                                    onClick={() => handleDelete(m.id)}
                                    className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-rose-50 flex items-center space-x-2 text-rose-600 cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Delete message</span>
                                  </button>

                                </div>
                              </>
                            )}

                          </div>
                        </div>

                        <span className="text-[9px] font-mono text-gray-400 mt-0.5 px-1">
                          {m.timestamp}
                        </span>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* 3. CONTEXTUAL QUICK ACTION STARTER CHIPS WITH INDIVIDUAL & BAR DISMISS X */}
                {showQuickRepliesBar && (
                  <div className="px-2.5 py-1 bg-white border-t border-gray-100 flex items-center justify-between space-x-1.5 overflow-x-auto scrollbar-none shrink-0">
                    <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none flex-nowrap py-0.5 min-w-0 flex-1">
                      {(() => {
                        const cat = activeThread?.category || 'dm';
                        const chips = cat === 'exchange' ? [
                          '🤝 Barter split proposal',
                          '📍 Safe foyer meetup',
                          '⏳ Pay in Time Credits'
                        ] : cat === 'housing' ? [
                          '📅 Schedule room viewing',
                          '📜 Mutual aid covenant OK',
                          '🏡 Move-in availability?'
                        ] : cat === 'jobs' ? [
                          '📎 Sharing pod credentials',
                          '💵 Confirm rate & schedule',
                          '✨ Ready to start this week'
                        ] : cat === 'academy' ? [
                          '🌿 Oxymel ratio question',
                          '📜 Trust deed template review',
                          '✨ Study partner inquiry'
                        ] : [
                          '🕊️ Peace Sister!',
                          '🍵 Tea circle check-in',
                          '🌸 Praying for your family'
                        ];

                        const visibleChips = chips.filter(c => !dismissedChips.has(c));

                        if (visibleChips.length === 0) return null;

                        return visibleChips.map((starter, i) => (
                          <div 
                            key={`chip-${i}`} 
                            className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[9.5px] font-mono bg-[#FAF5EE] text-[#1F1813] hover:bg-neutral-200 border border-copper-penny/20 shrink-0 shadow-2xs transition-colors"
                          >
                            <button
                              type="button"
                              onClick={() => handleQuickInsert(starter)}
                              className="cursor-pointer font-medium text-[#1F1813] hover:text-[#B87333]"
                              title="Click to insert quick text"
                            >
                              {starter}
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDismissedChips(prev => new Set(prev).add(starter));
                              }}
                              className="p-0.5 hover:bg-stone-300/60 rounded-full text-stone-400 hover:text-stone-700 cursor-pointer ml-0.5 transition-colors"
                              title="Remove this quick reply chip"
                              aria-label="Remove quick reply"
                            >
                              <X className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        ));
                      })()}
                    </div>

                    {/* Dismiss Entire Quick Replies Bar */}
                    <button
                      type="button"
                      onClick={() => setShowQuickRepliesBar(false)}
                      className="p-1 hover:bg-stone-200/60 rounded-md text-stone-400 hover:text-stone-700 cursor-pointer shrink-0 ml-1 transition-colors"
                      title="Hide quick reply suggestions"
                      aria-label="Hide quick reply suggestions"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {/* 4. Reply To Banner Bar */}
                {replyingToMessage && (
                  <div className="px-3 py-1.5 bg-[#FAF5EE] border-t border-copper-penny/20 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-1.5 text-gray-600 truncate">
                      <CornerUpLeft className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span className="text-[10px] font-bold">Replying to {replyingToMessage.senderName}:</span>
                      <span className="text-[10px] italic truncate">{replyingToMessage.text}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setReplyingToMessage(null)}
                      className="text-gray-400 hover:text-black p-0.5 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* 5. Bottom Input Composer with # Hashtag Popup */}
                <div className="relative">
                  {/* HASHTAG AUTOCOMPLETE POPUP IN CHAT DOCK */}
                  {showChatHashtagMenu && (
                    <div className="absolute bottom-full mb-3 left-0 right-0 z-[99999] bg-white border-2 border-[#D4AF37] rounded-3xl shadow-2xl p-3.5 space-y-2.5 animate-fade-in text-left">
                      <div className="flex items-center justify-between border-b border-copper-penny/15 pb-2">
                        <span className="text-xs font-mono font-bold uppercase text-[#1F140E] flex items-center space-x-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>Search Ecosystem Hashtags:</span>
                        </span>
                        <button 
                          type="button" 
                          onClick={() => setShowChatHashtagMenu(false)} 
                          className="w-6 h-6 rounded-full hover:bg-neutral-100 flex items-center justify-center text-gray-400 hover:text-gray-700 cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-[#B87333] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          value={chatHashtagFilter}
                          onChange={(e) => setChatHashtagFilter(e.target.value)}
                          placeholder="Search hashtags e.g. #SeedPreservation..."
                          className="w-full pl-8.5 pr-7 py-2 bg-[#FAF5EE] border border-copper-penny/30 rounded-xl text-xs font-mono text-[#1F140E] placeholder:text-neutral-400 focus:outline-none focus:ring-1.5 focus:ring-[#D4AF37]"
                          autoFocus
                        />
                        {chatHashtagFilter && (
                          <button
                            type="button"
                            onClick={() => setChatHashtagFilter('')}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="max-h-48 overflow-y-auto space-y-1.5 scrollbar-thin pr-0.5">
                        {filteredChatHashtags.length === 0 ? (
                          <div className="text-center py-3 text-xs text-soft-sage space-y-2 bg-[#FAF5EE]/50 rounded-xl p-3 border border-dashed border-copper-penny/20">
                            <p className="font-sans">No tag matching <strong className="text-[#1F140E]">"{chatHashtagFilter}"</strong></p>
                            <button
                              type="button"
                              onClick={() => handleSelectChatHashtag(chatHashtagFilter.startsWith('#') ? chatHashtagFilter : `#${chatHashtagFilter}`)}
                              className="px-3 py-1 bg-[#1F140E] text-[#D4AF37] hover:bg-[#2A1D16] text-[11px] font-bold rounded-xl font-mono cursor-pointer transition-colors shadow-2xs inline-block"
                            >
                              ➕ Insert #{chatHashtagFilter.replace(/^#/, '')}
                            </button>
                          </div>
                        ) : (
                          filteredChatHashtags.map(ht => (
                            <button
                              key={ht.tag}
                              type="button"
                              onClick={() => handleSelectChatHashtag(ht.tag)}
                              className="w-full text-left p-2 rounded-xl hover:bg-[#FAF5EE] border border-transparent hover:border-[#D4AF37]/50 transition-all cursor-pointer flex flex-col space-y-0.5 group"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-mono font-bold text-xs text-[#1F140E] group-hover:text-[#B87333]">
                                  {ht.tag}
                                </span>
                                <span className="px-1.5 py-0.2 rounded bg-[#FAF5EE] text-[8.5px] font-mono text-soft-sage">
                                  {ht.category}
                                </span>
                              </div>
                              <span className="text-[10px] text-amber-900 truncate block">
                                {ht.linkedResource}
                              </span>
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSend} className="p-2 border-t border-copper-penny/15 bg-[#FAF5EE]/50 flex items-center space-x-2">
                    <button 
                      type="button"
                      onClick={() => showToast('Photo attachment opened')}
                      className="p-1.5 text-gray-500 hover:text-black hover:bg-white rounded-xl cursor-pointer transition-colors shrink-0"
                      title="Attach image"
                    >
                      <ImageIcon className="w-4 h-4 text-copper-penny" />
                    </button>

                    {/* # Hashtag button inside chat composer */}
                    <button
                      type="button"
                      onClick={() => {
                        setShowChatHashtagMenu(prev => !prev);
                        setChatHashtagFilter('');
                      }}
                      className="p-1.5 rounded-xl bg-white hover:bg-[#FAF5EE] text-[#D4AF37] border border-copper-penny/30 font-mono text-xs font-bold transition-colors cursor-pointer shrink-0 shadow-2xs flex items-center space-x-1"
                      title="Search & insert ecosystem hashtag"
                    >
                      <Hash className="w-3.5 h-3.5 text-[#B87333]" />
                      <span className="text-[10px] text-[#1F140E] font-bold">#</span>
                    </button>

                    <input 
                      ref={messageInputRef}
                      type="text"
                      value={messageInput}
                      onChange={handleChatInputChange}
                      placeholder={replyingToMessage ? `Reply to ${replyingToMessage.senderName}...` : "Message or type #..."}
                      className="flex-1 px-3 py-1.5 text-xs bg-white border border-copper-penny/25 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                    />

                    <button 
                      type="submit"
                      disabled={!messageInput.trim()}
                      className="p-1.5 bg-[#1F1813] text-[#D4AF37] rounded-xl hover:bg-[#2A221B] disabled:bg-gray-200 disabled:text-gray-400 cursor-pointer shrink-0 transition-colors"
                      title="Send message"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>

              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}
