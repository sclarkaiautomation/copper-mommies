import React, { useState, useRef, useEffect } from 'react';
import { Camera, Hash, AtSign, Image as ImageIcon, X, Send, Sparkles, Search } from 'lucide-react';
import { INITIAL_CHAT_MEMBERS } from '../data/initialDirectChats';
import { INITIAL_VOUCHED_BUSINESSES } from '../data/villageCommonsData';
import { POPULAR_HASHTAGS } from '../data/globalHashtagData';

interface InteractiveReplyBoxProps {
  placeholder?: string;
  buttonLabel?: string;
  onSubmit: (text: string, attachedImageUrl?: string) => void;
  onExecuteHashtagSearch?: (tag: string) => void;
  className?: string;
}

export const InteractiveReplyBox: React.FC<InteractiveReplyBoxProps> = ({
  placeholder = "Speak life into this sister...",
  buttonLabel = "Reply",
  onSubmit,
  onExecuteHashtagSearch,
  className = ""
}) => {
  const [inputText, setInputText] = useState('');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  
  // Popup menus states
  const [showHashtagMenu, setShowHashtagMenu] = useState(false);
  const [hashtagFilter, setHashtagFilter] = useState('');
  const [showMentionMenu, setShowMentionMenu] = useState(false);
  const [mentionFilter, setMentionFilter] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Combine ecosystem members and sister businesses for @ mentions
  const mentionCandidates = [
    ...INITIAL_CHAT_MEMBERS.map(m => ({
      id: m.id,
      name: m.name,
      subtext: m.neighborhood || m.role,
      avatar: m.avatar,
      type: 'member' as const
    })),
    ...INITIAL_VOUCHED_BUSINESSES.map(b => ({
      id: b.id,
      name: b.name,
      subtext: `${b.locationCity}, ${b.locationState} • ${b.industry}`,
      avatar: b.imageUrl || '🌿',
      type: 'business' as const
    }))
  ];

  // Detect typing after @ and # symbols for automatic autocomplete popup
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputText(val);

    // 1. Detect typing after @
    const lastAtIndex = val.lastIndexOf('@');
    if (lastAtIndex !== -1) {
      const queryAfterAt = val.slice(lastAtIndex + 1);
      if (!queryAfterAt.includes(' ')) {
        setMentionFilter(queryAfterAt);
        setShowMentionMenu(true);
        setShowHashtagMenu(false);
      } else {
        setShowMentionMenu(false);
      }
    } else {
      setShowMentionMenu(false);
    }

    // 2. Detect typing after #
    const lastHashIndex = val.lastIndexOf('#');
    if (lastHashIndex !== -1) {
      const queryAfterHash = val.slice(lastHashIndex + 1);
      if (!queryAfterHash.includes(' ')) {
        setHashtagFilter(queryAfterHash);
        setShowHashtagMenu(true);
        setShowMentionMenu(false);
      } else {
        setShowHashtagMenu(false);
      }
    } else if (lastAtIndex === -1) {
      setShowHashtagMenu(false);
    }
  };

  // Image Upload handler
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Insert Hashtag into input (replacing any typed partial #tag)
  const handleSelectHashtag = (tag: string) => {
    const lastHashIndex = inputText.lastIndexOf('#');
    if (lastHashIndex !== -1) {
      const textBeforeHash = inputText.slice(0, lastHashIndex);
      setInputText(`${textBeforeHash}${tag} `);
    } else {
      setInputText(prev => {
        const cleanPrev = prev.trim();
        return cleanPrev ? `${cleanPrev} ${tag} ` : `${tag} `;
      });
    }
    setShowHashtagMenu(false);
    if (inputRef.current) inputRef.current.focus();
  };

  // Trigger immediate sitewide search for a hashtag
  const handleExecuteSearchFromBox = (tag: string) => {
    setShowHashtagMenu(false);
    if (onExecuteHashtagSearch) {
      onExecuteHashtagSearch(tag.startsWith('#') ? tag : `#${tag}`);
    }
  };

  // Insert Mention into input
  const handleSelectMention = (name: string) => {
    const lastAtIndex = inputText.lastIndexOf('@');
    if (lastAtIndex !== -1) {
      const textBeforeAt = inputText.slice(0, lastAtIndex);
      setInputText(`${textBeforeAt}@${name} `);
    } else {
      setInputText(prev => prev ? `${prev} @${name} ` : `@${name} `);
    }
    setShowMentionMenu(false);
    if (inputRef.current) inputRef.current.focus();
  };

  // Handle Form Submission
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() && !attachedImage) return;

    onSubmit(inputText, attachedImage || undefined);
    setInputText('');
    setAttachedImage(null);
    setShowHashtagMenu(false);
    setShowMentionMenu(false);
  };

  // Filter hashtags by typed string
  const filteredHashtags = POPULAR_HASHTAGS.filter(ht =>
    ht.tag.toLowerCase().includes(hashtagFilter.toLowerCase()) ||
    ht.label.toLowerCase().includes(hashtagFilter.toLowerCase()) ||
    ht.description.toLowerCase().includes(hashtagFilter.toLowerCase())
  );

  // Filter mentions by typed string
  const filteredMentions = mentionCandidates.filter(m => 
    m.name.toLowerCase().includes(mentionFilter.toLowerCase()) ||
    m.subtext.toLowerCase().includes(mentionFilter.toLowerCase())
  );

  return (
    <div className={`space-y-2 relative ${className}`}>
      
      {/* ATTACHED IMAGE PREVIEW THUMBNAIL (IF ANY) */}
      {attachedImage && (
        <div className="relative inline-block border border-copper-penny/30 rounded-xl overflow-hidden p-1 bg-white shadow-xs">
          <img src={attachedImage} alt="Attached upload" className="h-20 w-20 object-cover rounded-lg" />
          <button
            type="button"
            onClick={() => setAttachedImage(null)}
            className="absolute top-2 right-2 bg-[#1F140E]/80 hover:bg-[#1F140E] text-white rounded-full p-1 cursor-pointer transition-colors shadow-sm"
            title="Remove image"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* INPUT FIELD & SUBMIT BUTTON */}
      <div className="flex items-center space-x-2">
        <input
          ref={inputRef}
          type="text"
          value={inputText}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
          placeholder={placeholder}
          className="flex-1 bg-white border border-copper-penny/30 px-3.5 py-2 rounded-xl text-xs font-sans text-[#1F140E] focus:outline-none focus:ring-1 focus:ring-[#D4AF37] shadow-2xs"
        />
        <button
          type="button"
          onClick={() => handleSubmit()}
          disabled={!inputText.trim() && !attachedImage}
          className="px-4 py-2 bg-[#1F140E] hover:bg-[#2A1D16] text-[#D4AF37] font-mono text-xs font-bold rounded-xl cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-2xs shrink-0 flex items-center space-x-1"
        >
          <span>{buttonLabel}</span>
        </button>
      </div>

      {/* HIDDEN FILE INPUT */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageFileChange}
      />

      {/* HASHTAG PICKER & AUTOCOMPLETE DROPDOWN (ANCHORED ABOVE REPLY BOX WITH PROMINENT TOP SEARCH BAR) */}
      {showHashtagMenu && (
        <div className="absolute bottom-full mb-3 left-0 right-0 sm:right-auto sm:w-[460px] max-w-[calc(100vw-32px)] z-[99999] bg-white border-2 border-[#D4AF37] rounded-3xl shadow-[0_20px_50px_rgba(31,20,14,0.35)] p-4 space-y-3 animate-fade-in text-left">
          <div className="flex items-center justify-between border-b border-copper-penny/15 pb-2.5">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-xl bg-[#D4AF37]/20 text-[#1F140E] border border-[#D4AF37]/50">
                <Hash className="w-4 h-4 text-[#B87333]" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold uppercase text-[#1F140E] flex items-center space-x-1.5">
                  <span>Hashtag Search &amp; Insert</span>
                  <span className="px-1.5 py-0.2 rounded-md bg-[#FAF5EE] text-[#B87333] border border-copper-penny/20 text-[9px]">
                    Direct Link
                  </span>
                </span>
                <p className="text-[10px] text-soft-sage font-mono">
                  Pick a hashtag to place into reply. When clicked, it routes directly to the item!
                </p>
              </div>
            </div>
            <button 
              type="button" 
              onClick={() => setShowHashtagMenu(false)} 
              className="w-7 h-7 rounded-xl hover:bg-neutral-100 flex items-center justify-center text-gray-400 hover:text-gray-700 cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Instant Hashtag Search Input at the Very Top of Popup */}
          <div className="space-y-1">
            <label className="block text-[10px] font-mono font-bold uppercase text-soft-sage">
              🔎 Type to search ecosystem hashtags:
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-[#B87333] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={hashtagFilter}
                onChange={(e) => setHashtagFilter(e.target.value)}
                placeholder="Type #SeedPreservation, #Oxymel, #HerStory..."
                className="w-full pl-9 pr-8 py-2.5 bg-[#FAF5EE] border-2 border-[#D4AF37]/60 rounded-xl text-xs font-mono text-[#1F140E] placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:bg-white transition-all shadow-inner"
                autoFocus
              />
              {hashtagFilter && (
                <button
                  type="button"
                  onClick={() => setHashtagFilter('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Results List */}
          <div className="max-h-60 overflow-y-auto space-y-1.5 scrollbar-thin overflow-x-hidden pr-1">
            {filteredHashtags.length === 0 ? (
              <div className="text-center py-4 text-xs text-soft-sage space-y-3 bg-[#FAF5EE]/60 rounded-2xl p-3.5 border border-dashed border-copper-penny/30">
                <p className="font-sans">
                  No predefined tag matching <strong className="text-[#1F140E]">"{hashtagFilter}"</strong>
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleSelectHashtag(hashtagFilter.startsWith('#') ? hashtagFilter : `#${hashtagFilter}`)}
                    className="px-3 py-1.5 bg-[#1F140E] text-[#D4AF37] hover:bg-[#2A1D16] text-[11px] font-bold rounded-xl font-mono cursor-pointer transition-colors shadow-2xs"
                  >
                    ➕ Insert as custom #{hashtagFilter.replace(/^#/, '')}
                  </button>
                  {onExecuteHashtagSearch && (
                    <button
                      type="button"
                      onClick={() => handleExecuteSearchFromBox(hashtagFilter)}
                      className="px-3 py-1.5 bg-[#FAF5EE] border border-copper-penny/40 text-[#1F140E] hover:bg-neutral-100 text-[11px] font-bold rounded-xl font-mono cursor-pointer transition-colors"
                    >
                      🔎 Search Sitewide
                    </button>
                  )}
                </div>
              </div>
            ) : (
              filteredHashtags.map(ht => (
                <button
                  key={ht.tag}
                  type="button"
                  onClick={() => handleSelectHashtag(ht.tag)}
                  className="w-full text-left p-2.5 rounded-2xl hover:bg-[#FAF5EE] border border-copper-penny/15 hover:border-[#D4AF37] transition-all cursor-pointer flex flex-col space-y-1 group bg-white shadow-2xs"
                  title={`Insert ${ht.tag} into reply`}
                >
                  <div className="flex items-center justify-between gap-1 w-full">
                    <span className="font-mono font-bold text-xs text-[#1F140E] group-hover:text-[#B87333] transition-colors flex items-center space-x-1">
                      <span>{ht.tag}</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-[#FAF5EE] border border-copper-penny/25 text-[9px] font-mono font-bold text-soft-sage shrink-0">
                      {ht.category}
                    </span>
                  </div>
                  
                  {/* What it is linked to */}
                  <div className="text-[11px] font-medium text-amber-950/90 leading-tight flex items-center space-x-1">
                    <span className="text-[#D4AF37]">🔗</span>
                    <span className="font-semibold">{ht.linkedResource}</span>
                  </div>

                  {/* Description */}
                  <div className="text-[10px] text-soft-sage font-sans leading-relaxed line-clamp-1">
                    {ht.description}
                  </div>
                </button>
              ))
            )}
          </div>

          <div className="pt-2 border-t border-copper-penny/10 flex items-center justify-between text-[10px] font-mono text-soft-sage">
            <span>Click any tag to insert into reply</span>
            <span className="text-[#B87333] font-bold">Direct Navigation Active ✓</span>
          </div>
        </div>
      )}

      {/* MENTION AUTOCOMPLETE DROPDOWN */}
      {showMentionMenu && (
        <div className="absolute bottom-full mb-3 left-0 right-0 sm:right-auto sm:w-88 max-w-[calc(100vw-32px)] z-[99999] bg-white border-2 border-[#D4AF37] rounded-3xl shadow-[0_20px_50px_rgba(31,20,14,0.35)] p-4 space-y-2.5 animate-fade-in text-left">
          <div className="flex items-center justify-between border-b border-copper-penny/15 pb-2">
            <span className="text-xs font-mono font-bold uppercase text-[#1F140E] flex items-center space-x-1.5">
              <AtSign className="w-3.5 h-3.5 text-[#B87333]" />
              <span>Tag Sister or Business</span>
            </span>
            <button onClick={() => setShowMentionMenu(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="max-h-52 overflow-y-auto space-y-1 scrollbar-thin">
            {filteredMentions.length === 0 ? (
              <p className="text-xs text-soft-sage italic p-2">No matching sisters or businesses found.</p>
            ) : (
              filteredMentions.map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectMention(item.name)}
                  className="w-full text-left p-2 rounded-xl hover:bg-[#FAF5EE] transition-colors cursor-pointer flex items-center space-x-2.5"
                >
                  {item.type === 'member' ? (
                    <img src={item.avatar} alt={item.name} className="w-7 h-7 rounded-full object-cover shrink-0 border border-copper-penny/20" />
                  ) : (
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold text-xs shrink-0">
                      🌿
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-[#1F140E] truncate">{item.name}</div>
                    <div className="text-[10px] text-soft-sage font-mono truncate">{item.subtext}</div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* THE 3 FUNCTIONAL ACTION ICONS UNDER THE REPLY BAR */}
      <div className="flex items-center justify-between text-xs pt-1.5 px-1 border-t border-copper-penny/10">
        <div className="flex items-center space-x-2.5">
          
          {/* 1. 📷 IMAGE UPLOAD ICON */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-[#FAF5EE] hover:bg-[#F3EADF] text-[#1F140E] border border-copper-penny/30 transition-all cursor-pointer font-mono text-[11px] font-bold shadow-2xs hover:scale-102 active:scale-95"
            title="Attach image to reply"
          >
            <Camera className="w-3.5 h-3.5 text-[#B87333]" />
            <span className="hidden sm:inline">Add Image</span>
          </button>

          {/* 2. # HASHTAG BUTTON (Prominent button that opens top-search popup) */}
          <button
            type="button"
            id="reply-hashtag-btn"
            onClick={() => {
              setShowHashtagMenu(prev => !prev);
              setShowMentionMenu(false);
              setHashtagFilter('');
            }}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-xl border font-mono text-[11px] font-bold transition-all cursor-pointer shadow-2xs hover:scale-102 active:scale-95 ${
              showHashtagMenu
                ? 'bg-[#1F140E] text-[#D4AF37] border-[#D4AF37] ring-2 ring-[#D4AF37]/40'
                : 'bg-[#FAF5EE] hover:bg-[#F3EADF] text-[#1F140E] border-[#D4AF37]'
            }`}
            title="Search & insert ecosystem hashtag e.g. #SeedPreservation"
          >
            <Hash className="w-3.5 h-3.5 text-[#B87333]" />
            <span># Hashtag</span>
          </button>

          {/* 3. @ MENTION BUTTON */}
          <button
            type="button"
            onClick={() => {
              setShowMentionMenu(prev => !prev);
              setShowHashtagMenu(false);
              setMentionFilter('');
            }}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-xl border font-mono text-[11px] font-bold transition-all cursor-pointer shadow-2xs hover:scale-102 active:scale-95 ${
              showMentionMenu
                ? 'bg-[#1F140E] text-[#D4AF37] border-[#D4AF37]'
                : 'bg-[#FAF5EE] hover:bg-[#F3EADF] text-[#1F140E] border-copper-penny/30'
            }`}
            title="Tag a sister or vouched sister business in ecosystem"
          >
            <AtSign className="w-3.5 h-3.5 text-[#B87333]" />
            <span className="hidden sm:inline">Mention</span>
          </button>

        </div>

        <span className="text-[10px] text-soft-sage font-mono hidden xs:inline">
          Safe &amp; Respectful Sanctuary
        </span>
      </div>

    </div>
  );
};

interface FormattedContentProps {
  content: string;
  onHashtagClick?: (tag: string) => void;
  className?: string;
}

export const FormattedContentWithHashtags: React.FC<FormattedContentProps> = ({
  content,
  onHashtagClick,
  className = ""
}) => {
  if (!content) return null;

  // Regex to match #Hashtags and @Mentions
  const regex = /(#[A-Za-z0-9_]+|@[A-Za-z0-9_\s]{3,25}(?=\s|$))/g;
  const parts = content.split(regex);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (part.startsWith('#')) {
          return (
            <button
              key={index}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onHashtagClick) onHashtagClick(part);
              }}
              className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-[#FAF5EE] border border-[#D4AF37]/50 text-[#B87333] hover:text-[#1F140E] hover:bg-[#D4AF37]/20 font-mono text-[11px] font-bold cursor-pointer transition-colors mx-0.5"
              title={`Execute sitewide search for ${part}`}
            >
              {part}
            </button>
          );
        } else if (part.startsWith('@')) {
          return (
            <span
              key={index}
              className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-300/40 font-mono text-[11px] font-bold mx-0.5"
            >
              {part}
            </span>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
};

export default InteractiveReplyBox;
