import React, { useState, useRef, useEffect } from 'react';
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
  CheckCheck
} from 'lucide-react';
import { DirectChatThread, ChatMember, DirectChatMessage } from '../types';

interface BottomFloatingChatDockProps {
  threads: DirectChatThread[];
  members: ChatMember[];
  currentUserName?: string;
  onSendMessage: (threadId: string, text: string, replyTo?: { id: string; text: string; senderName: string }) => void;
  onCreateNewChat: (participantId: string, initialMessage?: string) => void;
  onNavigateToProfileChats?: () => void;
  onEditMessage?: (threadId: string, messageId: string, newText: string) => void;
  onDeleteMessage?: (threadId: string, messageId: string) => void;
  onPinMessage?: (threadId: string, messageId: string) => void;
  onReactMessage?: (threadId: string, messageId: string, emoji: string) => void;
}

export default function BottomFloatingChatDock({
  threads,
  members,
  currentUserName = 'Shantrece Clark',
  onSendMessage,
  onCreateNewChat,
  onNavigateToProfileChats,
  onEditMessage,
  onDeleteMessage,
  onPinMessage,
  onReactMessage
}: BottomFloatingChatDockProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeThreadId, setActiveThreadId] = useState<string | null>('chat-reginald');
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [memberSearch, setMemberSearch] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [showOptionsDropdown, setShowOptionsDropdown] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Message 3-dots active menu & reply state
  const [activeMessageMenuId, setActiveMessageMenuId] = useState<string | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [replyingToMessage, setReplyingToMessage] = useState<DirectChatMessage | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const chatScrollContainerRef = useRef<HTMLDivElement | null>(null);

  const activeThread = threads.find(t => t.id === activeThreadId) || threads[0];

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

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
    m.neighborhood.toLowerCase().includes(memberSearch.toLowerCase())
  );

  return (
    <div className="fixed bottom-0 right-3 sm:right-6 z-40 flex flex-col items-end">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="mb-2 bg-[#1F140E] text-[#FAF5EE] text-xs font-mono px-3.5 py-1.5 rounded-xl border border-[#D4AF37] shadow-xl animate-fade-in flex items-center space-x-2">
          <span>🕊️</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. COLLAPSED DOCKED PILL (As in Screenshot 5) */}
      {!isOpen && (
        <div className="bg-white border-2 border-copper-penny/35 hover:border-[#D4AF37] shadow-2xl rounded-t-2xl px-3 sm:px-4 py-2 flex items-center space-x-2.5 transition-all cursor-pointer group bg-gradient-to-r from-white to-[#FAF5EE]">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="flex items-center space-x-2 text-xs font-bold text-[#1F1813] cursor-pointer"
          >
            <div className="w-6 h-6 rounded-full bg-[#1F140E] text-[#D4AF37] flex items-center justify-center text-[10px] font-bold shadow-xs">
              <MessageSquare className="w-3.5 h-3.5" />
            </div>
            <span className="font-serif">Chats</span>
          </button>

          <div className="flex items-center space-x-1 border-l border-copper-penny/20 pl-2">
            <button
              type="button"
              onClick={() => {
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
              onClick={() => setIsOpen(true)}
              className="p-1 text-gray-500 hover:text-black hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
              title="Expand chat dock"
            >
              <ChevronUp className="w-4 h-4 text-copper-penny" />
            </button>
          </div>
        </div>
      )}

      {/* 2. EXPANDED FLOATING DOCK WINDOW (As in Screenshot 7) */}
      {isOpen && (
        <div className="w-80 sm:w-96 h-[480px] bg-white border-2 border-[#D4AF37] rounded-t-3xl shadow-2xl flex flex-col overflow-hidden animate-slide-up">
          
          {/* Header Bar */}
          <div className="bg-[#FAF5EE] border-b border-copper-penny/20 p-3 flex items-center justify-between text-[#1F1813] select-none">
            
            {/* Left: Back / Title / Active Recipient */}
            <div className="flex items-center space-x-2 min-w-0">
              {activeThreadId && !isCreatingNew ? (
                <>
                  <button
                    type="button"
                    onClick={() => setActiveThreadId(null)}
                    className="p-1 text-gray-500 hover:text-black hover:bg-white rounded-lg cursor-pointer transition-colors"
                    title="All chats"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="w-8 h-8 rounded-full overflow-hidden border border-[#D4AF37] shrink-0">
                    <img 
                      src={activeThread?.participantAvatar || '/coppermommies-selflove1-cmc.jpg'} 
                      alt={activeThread?.participantName} 
                      className="w-full h-full object-cover" 
                    />
                  </div>

                  <div className="min-w-0">
                    <h4 className="font-bold text-xs text-[#1F1813] truncate leading-tight">
                      {activeThread?.participantName}
                    </h4>
                    <p className="text-[10px] text-soft-sage font-mono truncate leading-tight">
                      {activeThread?.participantNeighborhood || 'Venetian Hills'}
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
                  <h4 className="font-bold text-xs font-serif text-[#1F1813]">New Message</h4>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4 text-copper-penny" />
                  <h4 className="font-bold text-xs font-serif text-[#1F1813]">Direct Chats</h4>
                </div>
              )}
            </div>

            {/* Right: Actions (New, Maximize to Profile, Menu, Collapse) */}
            <div className="flex items-center space-x-1 shrink-0">
              
              {!isCreatingNew && (
                <button
                  type="button"
                  onClick={() => setIsCreatingNew(true)}
                  className="p-1 text-gray-600 hover:text-black hover:bg-white rounded-lg cursor-pointer"
                  title="Create new message"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              )}

              {onNavigateToProfileChats && (
                <button
                  type="button"
                  onClick={() => {
                    onNavigateToProfileChats();
                    setIsOpen(false);
                  }}
                  className="p-1 text-gray-600 hover:text-black hover:bg-white rounded-lg cursor-pointer"
                  title="Open full view in My Profile"
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
                    className="p-1 text-gray-600 hover:text-black hover:bg-white rounded-lg cursor-pointer"
                    title="Chat options"
                  >
                    <MoreVertical className="w-3.5 h-3.5" />
                  </button>

                  {/* 3-Dots Dropdown Menu (Screenshot 6 options) */}
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
                          <span>Report</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Collapse Down Arrow */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 text-gray-500 hover:text-black hover:bg-white rounded-lg cursor-pointer"
                title="Minimize chat"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Body Content */}
          <div className="flex-1 min-h-0 flex flex-col bg-white">
            
            {/* VIEW A: CREATE NEW CHAT MODAL */}
            {isCreatingNew ? (
              <div className="p-3 flex-1 flex flex-col space-y-3 overflow-y-auto">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
                  <input 
                    type="text"
                    value={memberSearch}
                    onChange={(e) => setMemberSearch(e.target.value)}
                    placeholder="Add 1 or more people..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FAF5EE]/60 border border-copper-penny/25 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                  />
                </div>

                <span className="text-[10px] font-mono uppercase font-bold text-gray-400 block px-1">
                  SUGGESTED SISTERS
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
                    Create Chat
                  </button>
                </div>
              </div>
            ) : !activeThreadId ? (
              /* VIEW B: LIST OF ALL THREADS */
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="p-2 border-b border-gray-100">
                  <input 
                    type="text"
                    placeholder="Search conversations..."
                    className="w-full px-3 py-1.5 text-xs bg-[#FAF5EE]/60 border border-copper-penny/20 rounded-xl focus:outline-none"
                  />
                </div>

                <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
                  {threads.map(t => (
                    <div
                      key={t.id}
                      onClick={() => setActiveThreadId(t.id)}
                      className="p-3 flex items-start space-x-3 hover:bg-[#FAF5EE] cursor-pointer transition-colors"
                    >
                      <img 
                        src={t.participantAvatar || '/coppermommies-selflove1-cmc.jpg'} 
                        alt={t.participantName} 
                        className="w-9 h-9 rounded-full object-cover shrink-0 border border-copper-penny/20"
                      />
                      <div className="flex-1 min-w-0 space-y-0.5">
                        <div className="flex items-center justify-between">
                          <h5 className="font-bold text-xs text-[#1F1813] truncate">{t.participantName}</h5>
                          <span className="text-[9px] font-mono text-gray-400">{t.lastMessageTime}</span>
                        </div>
                        <p className="text-[11px] text-gray-600 truncate">{t.lastMessage}</p>
                        {t.originSectionLabel && (
                          <span className="inline-block text-[9px] font-mono font-bold text-[#B87333] bg-[#FAF5EE] px-1.5 py-0.2 rounded border border-copper-penny/15">
                            {t.originSectionLabel}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* VIEW C: ACTIVE CHAT MESSAGES STREAM */
              <div className="flex-1 flex flex-col overflow-hidden relative">
                
                {/* Message Bubbles Container */}
                <div ref={chatScrollContainerRef} className="flex-1 p-3 overflow-y-auto space-y-3">
                  {activeThread?.originSectionLabel && (
                    <div className="text-center py-1">
                      <span className="text-[9px] font-mono text-gray-500 bg-[#FAF5EE] border border-copper-penny/15 px-2.5 py-0.5 rounded-full inline-block">
                        Conversation regarding: {activeThread.originSectionLabel}
                      </span>
                    </div>
                  )}

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
                              className="w-6 h-6 rounded-full object-cover shrink-0 border border-copper-penny/20 mt-1"
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
                                    className="px-2 py-1 text-gray-500 hover:bg-gray-100 rounded"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleSaveEdit(m.id)}
                                    className="px-2.5 py-1 bg-[#1F1813] text-[#FAF5EE] font-bold rounded hover:bg-[#2A221B]"
                                  >
                                    Save
                                  </button>
                                </div>
                              </div>
                            ) : (
                              /* Standard Message Bubble */
                              <div className={`p-2.5 rounded-2xl text-xs relative group/bubble ${
                                m.isMe 
                                  ? 'bg-[#1F1813] text-[#FAF5EE] rounded-br-none' 
                                  : 'bg-[#FAF5EE] text-[#1F1813] border border-copper-penny/20 rounded-bl-none'
                              }`}>
                                {m.isPinned && (
                                  <div className="flex items-center space-x-1 text-[9px] font-mono text-[#D4AF37] font-bold pb-1">
                                    <Pin className="w-2.5 h-2.5 fill-[#D4AF37]" />
                                    <span>Pinned Message</span>
                                  </div>
                                )}

                                <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
                                
                                {m.isEdited && (
                                  <span className="text-[8px] font-mono text-gray-400 block mt-0.5">
                                    (edited)
                                  </span>
                                )}

                                {/* Reactions pill list */}
                                {m.reactions && m.reactions.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-1.5">
                                    {m.reactions.map((r, idx) => (
                                      <button
                                        key={idx}
                                        onClick={() => handleReact(m.id, r.emoji)}
                                        className="text-[10px] bg-black/10 hover:bg-black/20 rounded-full px-1.5 py-0.5 flex items-center space-x-1"
                                      >
                                        <span>{r.emoji}</span>
                                        <span>{r.count}</span>
                                      </button>
                                    ))}
                                  </div>
                                )}

                                {/* Link Preview Card if available */}
                                {m.linkPreviewUrl && (
                                  <a 
                                    href={m.linkPreviewUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="mt-2 block p-2 bg-white rounded-xl border border-copper-penny/25 text-[#1F1813] hover:underline"
                                  >
                                    <div className="flex items-center space-x-1.5 text-[10px] font-bold text-copper-penny">
                                      <ExternalLink className="w-3 h-3" />
                                      <span className="truncate">{m.linkPreviewTitle || 'View Community Link'}</span>
                                    </div>
                                    <span className="text-[9px] text-gray-400 truncate block font-mono">
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
                                  isMenuOpen ? 'opacity-100' : 'opacity-0 group-hover/bubble:opacity-100'
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
                                        className="text-sm hover:scale-125 transition-transform p-0.5"
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

                {/* Reply To Banner Bar */}
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
                      className="text-gray-400 hover:text-black p-0.5"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Bottom Input Composer */}
                <form onSubmit={handleSend} className="p-2 border-t border-copper-penny/15 bg-[#FAF5EE]/50 flex items-center space-x-2">
                  <button 
                    type="button"
                    onClick={() => showToast('Photo attachment opened')}
                    className="p-1.5 text-gray-500 hover:text-black hover:bg-white rounded-xl cursor-pointer transition-colors shrink-0"
                    title="Attach image"
                  >
                    <ImageIcon className="w-4 h-4 text-copper-penny" />
                  </button>

                  <input 
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder={replyingToMessage ? `Reply to ${replyingToMessage.senderName}...` : "Message..."}
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
            )}

          </div>

        </div>
      )}

    </div>
  );
}
