import React, { useState } from 'react';
import { 
  Vote, 
  CheckCircle2, 
  Clock, 
  Radio, 
  Coins, 
  Landmark, 
  Sparkles, 
  Share2, 
  Copy, 
  Check, 
  AlertCircle,
  PlusCircle,
  X,
  Send,
  MessageSquare,
  Lock,
  Flame,
  ArrowRight
} from 'lucide-react';
import { VillagePoll, PollCategory } from '../types';

interface HearthPollsCardProps {
  polls: VillagePoll[];
  onVote: (pollId: string, optionId: string) => Promise<void>;
  currentUserName?: string;
  onSuggestPoll?: (suggestion: { title: string; category: PollCategory; options: string[] }) => void;
  filterCategory?: PollCategory | 'all';
  compactMode?: boolean;
}

export default function HearthPollsCard({
  polls,
  onVote,
  currentUserName = 'Mama Shantrece',
  onSuggestPoll,
  filterCategory = 'all',
  compactMode = false
}: HearthPollsCardProps) {
  const [selectedCategory, setSelectedCategory] = useState<PollCategory | 'all'>(filterCategory);
  const [votingInProgress, setVotingInProgress] = useState<string | null>(null);
  const [justVotedId, setJustVotedId] = useState<string | null>(null);
  const [copiedPollId, setCopiedPollId] = useState<string | null>(null);
  const [shareModalPoll, setShareModalPoll] = useState<VillagePoll | null>(null);
  const [showSuggestModal, setShowSuggestModal] = useState(false);

  // Suggest Modal Form state
  const [suggestTitle, setSuggestTitle] = useState('');
  const [suggestCategory, setSuggestCategory] = useState<PollCategory>('casual-corner');
  const [suggestOptions, setSuggestOptions] = useState(['', '', '']);
  const [suggestSuccess, setSuggestSuccess] = useState(false);

  const filteredPolls = polls.filter(poll => {
    if (selectedCategory === 'all') return true;
    return poll.category === selectedCategory;
  });

  const handleCastVote = async (pollId: string, optionId: string) => {
    setVotingInProgress(`${pollId}-${optionId}`);
    try {
      await onVote(pollId, optionId);
      setJustVotedId(pollId);
      setTimeout(() => setJustVotedId(null), 4000);
    } catch (err: any) {
      alert(err?.message || 'Error recording vote');
    } finally {
      setVotingInProgress(null);
    }
  };

  const handleCopyShareLink = (poll: VillagePoll) => {
    const shareUrl = `${window.location.origin}${window.location.pathname}#poll=${poll.id}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedPollId(poll.id);
    setTimeout(() => setCopiedPollId(null), 3000);
  };

  const handleSuggestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validOpts = suggestOptions.filter(o => o.trim().length > 0);
    if (!suggestTitle.trim() || validOpts.length < 2) {
      alert('Please provide a ballot question and at least 2 answer choices.');
      return;
    }
    if (onSuggestPoll) {
      onSuggestPoll({
        title: suggestTitle,
        category: suggestCategory,
        options: validOpts
      });
    }
    setSuggestSuccess(true);
    setTimeout(() => {
      setSuggestSuccess(false);
      setShowSuggestModal(false);
      setSuggestTitle('');
      setSuggestOptions(['', '', '']);
    }, 2500);
  };

  const getCategoryBadge = (category: PollCategory) => {
    switch (category) {
      case 'casual-corner':
        return {
          label: 'Casual Corner Topic',
          icon: <Radio className="w-3.5 h-3.5 text-[#D4AF37]" />,
          color: 'bg-[#B87333]/15 text-[#B87333] border-[#B87333]/30'
        };
      case 'crowdfunded-class':
        return {
          label: 'Crowdfunded Class Pot',
          icon: <Coins className="w-3.5 h-3.5 text-amber-500" />,
          color: 'bg-amber-950/20 text-amber-800 border-amber-500/30'
        };
      case 'village-governance':
      default:
        return {
          label: 'Village Referendum',
          icon: <Landmark className="w-3.5 h-3.5 text-emerald-600" />,
          color: 'bg-emerald-950/20 text-emerald-800 border-emerald-500/30'
        };
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Sub-Category Filters */}
      {!compactMode && (
        <div className="bg-[#FFFDF9] border-2 border-[#B87333]/30 rounded-3xl p-5 sm:p-7 shadow-lg relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div className="space-y-1.5">
              <div className="inline-flex items-center space-x-2 px-3 py-0.5 rounded-full bg-[#B87333]/15 border border-[#B87333]/30 text-[#B87333] text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider">
                <Vote className="w-3.5 h-3.5" />
                <span>The Sisterhood Democratic Voice</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#1F1813] tracking-tight">
                Hearth Polls &amp; Topic Voting
              </h2>
              <p className="text-xs sm:text-sm text-[#2A221B]/80 max-w-2xl">
                Every sister holds equal voice at the hearth. Vote on upcoming Casual Corner podcast topics, co-fund community masterclasses, and guide collective village initiatives.
              </p>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              <button
                onClick={() => setShowSuggestModal(true)}
                className="px-4 py-2 bg-[#B87333] hover:bg-[#A85138] text-white rounded-xl text-xs font-bold font-mono transition-all flex items-center space-x-2 shadow-md cursor-pointer active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Propose a Poll</span>
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="mt-5 pt-4 border-t border-copper-penny/15 flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#1F140E] text-[#D4AF37] shadow-sm'
                  : 'bg-white text-[#1F1813]/70 hover:bg-[#FAF5EE] border border-copper-penny/20'
              }`}
            >
              All Hearth Ballots ({polls.length})
            </button>
            <button
              onClick={() => setSelectedCategory('casual-corner')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                selectedCategory === 'casual-corner'
                  ? 'bg-[#B87333] text-white shadow-sm'
                  : 'bg-white text-[#1F1813]/70 hover:bg-[#FAF5EE] border border-copper-penny/20'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Casual Corner Topics ({polls.filter(p => p.category === 'casual-corner').length})</span>
            </button>
            <button
              onClick={() => setSelectedCategory('crowdfunded-class')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                selectedCategory === 'crowdfunded-class'
                  ? 'bg-[#B87333] text-white shadow-sm'
                  : 'bg-white text-[#1F1813]/70 hover:bg-[#FAF5EE] border border-copper-penny/20'
              }`}
            >
              <Coins className="w-3.5 h-3.5" />
              <span>Crowdfunded Classes ({polls.filter(p => p.category === 'crowdfunded-class').length})</span>
            </button>
            <button
              onClick={() => setSelectedCategory('village-governance')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                selectedCategory === 'village-governance'
                  ? 'bg-[#B87333] text-white shadow-sm'
                  : 'bg-white text-[#1F1813]/70 hover:bg-[#FAF5EE] border border-copper-penny/20'
              }`}
            >
              <Landmark className="w-3.5 h-3.5" />
              <span>Village Referendums ({polls.filter(p => p.category === 'village-governance').length})</span>
            </button>
          </div>
        </div>
      )}

      {/* Polls Cards Grid */}
      <div className="space-y-6">
        {filteredPolls.length === 0 ? (
          <div className="bg-white border border-copper-penny/20 rounded-3xl p-8 text-center space-y-3">
            <Vote className="w-8 h-8 text-soft-sage mx-auto" />
            <h3 className="font-serif font-bold text-lg text-[#1F1813]">No active ballots in this category</h3>
            <p className="text-xs text-[#2A221B]/70 max-w-sm mx-auto">
              Check back soon or propose a new question for our next Casual Corner talk or crowdfunded masterclass!
            </p>
          </div>
        ) : (
          filteredPolls.map((poll) => {
            const hasVoted = poll.votedUserIds?.includes(currentUserName) || poll.votedUserIds?.includes('member-session');
            const catBadge = getCategoryBadge(poll.category);
            const sortedOptions = [...poll.options].sort((a, b) => b.votes - a.votes);
            const highestVotes = sortedOptions[0]?.votes || 0;

            return (
              <div 
                key={poll.id} 
                id={`poll-${poll.id}`}
                className={`bg-[#FFFDF9] border-2 rounded-3xl p-5 sm:p-7 shadow-md transition-all relative overflow-hidden ${
                  poll.isFeatured 
                    ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/30' 
                    : 'border-[#B87333]/25 hover:border-[#B87333]/40'
                }`}
              >
                {/* Featured Ribbon */}
                {poll.isFeatured && (
                  <div className="absolute top-0 right-0 bg-[#D4AF37] text-[#1F140E] text-[10px] font-mono font-black uppercase px-3 py-1 rounded-bl-xl shadow-xs flex items-center space-x-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Featured Ballot</span>
                  </div>
                )}

                {/* Poll Meta Badges */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${catBadge.color}`}>
                    {catBadge.icon}
                    <span>{catBadge.label}</span>
                  </span>

                  {poll.isOpen ? (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                      <span>Live Voting Open</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-gray-100 text-gray-700 border border-gray-300">
                      <Lock className="w-3 h-3 text-gray-500" />
                      <span>Voting Concluded</span>
                    </span>
                  )}

                  {hasVoted && (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-600/40">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Your Vote is Counted</span>
                    </span>
                  )}

                  <span className="text-[10px] font-mono text-soft-sage ml-auto">
                    {poll.totalVotes} Sisters Voted
                  </span>
                </div>

                {/* Title & Question */}
                <div className="space-y-1.5 mb-5">
                  <h3 className="font-serif font-black text-xl sm:text-2xl text-[#1F1813] leading-snug">
                    {poll.title}
                  </h3>
                  <p className="text-sm font-medium text-[#B87333]">
                    {poll.question}
                  </p>
                  {poll.description && (
                    <p className="text-xs text-[#2A221B]/75 leading-relaxed pt-1">
                      {poll.description}
                    </p>
                  )}
                </div>

                {/* Voting Options */}
                <div className="space-y-3 mb-6">
                  {poll.options.map((option, idx) => {
                    const pct = poll.totalVotes > 0 
                      ? Math.round((option.votes / poll.totalVotes) * 100) 
                      : 0;
                    const isLeader = option.votes > 0 && option.votes === highestVotes;
                    const isVotingThis = votingInProgress === `${poll.id}-${option.id}`;

                    return (
                      <div
                        key={option.id}
                        className={`relative rounded-2xl border transition-all overflow-hidden p-3.5 sm:p-4 ${
                          hasVoted
                            ? isLeader
                              ? 'border-[#D4AF37] bg-[#FAF5EE]'
                              : 'border-copper-penny/20 bg-white/70'
                            : poll.isOpen
                              ? 'border-copper-penny/30 bg-white hover:border-[#B87333] hover:shadow-md cursor-pointer'
                              : 'border-gray-200 bg-gray-50'
                        }`}
                        onClick={() => {
                          if (poll.isOpen && !hasVoted && !votingInProgress) {
                            handleCastVote(poll.id, option.id);
                          }
                        }}
                      >
                        {/* Progress bar background fill (shown when voted or closed) */}
                        {(hasVoted || !poll.isOpen) && (
                          <div 
                            className={`absolute inset-y-0 left-0 transition-all duration-700 pointer-events-none ${
                              isLeader ? 'bg-[#D4AF37]/20' : 'bg-copper-penny/10'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        )}

                        <div className="relative z-10 flex items-start justify-between gap-3">
                          <div className="flex items-start space-x-3 flex-1 min-w-0">
                            {/* Choice Indicator */}
                            <div className="shrink-0 mt-0.5">
                              {hasVoted ? (
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs font-bold ${
                                  isLeader ? 'bg-[#D4AF37] text-[#1F140E]' : 'bg-[#FAF5EE] text-[#1F1813] border border-copper-penny/30'
                                }`}>
                                  {idx + 1}
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  disabled={!poll.isOpen || isVotingThis}
                                  className="w-6 h-6 rounded-full border-2 border-[#B87333] hover:bg-[#B87333] hover:text-white flex items-center justify-center font-mono text-xs font-bold text-[#B87333] transition-all cursor-pointer"
                                  title="Click to vote for this topic"
                                >
                                  {idx + 1}
                                </button>
                              )}
                            </div>

                            {/* Option Text & Description */}
                            <div className="space-y-0.5">
                              <div className="flex items-center space-x-2">
                                <span className="font-serif font-bold text-xs sm:text-sm text-[#1F1813] leading-snug">
                                  {option.text}
                                </span>
                                {isLeader && (
                                  <span className="shrink-0 inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-[#D4AF37]/20 text-[#8F6A1A] font-mono text-[9px] font-black uppercase">
                                    <Flame className="w-2.5 h-2.5 text-amber-600" />
                                    <span>Leading Topic</span>
                                  </span>
                                )}
                              </div>
                              {option.description && (
                                <p className="text-[11px] text-[#2A221B]/70 leading-normal">
                                  {option.description}
                                </p>
                              )}
                              {option.proposer && (
                                <p className="text-[10px] font-mono text-soft-sage">
                                  Suggested by {option.proposer}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Vote Count & Percentage */}
                          <div className="text-right shrink-0">
                            {hasVoted || !poll.isOpen ? (
                              <div>
                                <div className="font-mono font-black text-sm sm:text-base text-[#1F1813]">
                                  {pct}%
                                </div>
                                <span className="text-[10px] font-mono text-soft-sage block">
                                  {option.votes} {option.votes === 1 ? 'vote' : 'votes'}
                                </span>
                              </div>
                            ) : (
                              <button
                                type="button"
                                disabled={isVotingThis}
                                className="px-3 py-1 bg-[#B87333] hover:bg-[#A85138] text-white text-xs font-bold font-mono rounded-lg transition-all shadow-xs cursor-pointer active:scale-95 flex items-center space-x-1"
                              >
                                <span>{isVotingThis ? 'Casting...' : 'Vote'}</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Poll Action Bar: Share to Email / Copy Link */}
                <div className="pt-3 border-t border-copper-penny/15 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center space-x-2 text-soft-sage font-mono text-[11px]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {poll.expiresAt 
                        ? `Ballot closes ${new Date(poll.expiresAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`
                        : 'Open Voting'}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => handleCopyShareLink(poll)}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#FAF5EE] border border-copper-penny/25 text-[#1F1813] font-mono text-[11px] font-semibold transition-all flex items-center space-x-1.5 cursor-pointer"
                    >
                      {copiedPollId === poll.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700 font-bold">Link Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-[#B87333]" />
                          <span>Copy Link</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setShareModalPoll(poll)}
                      className="px-3 py-1.5 rounded-xl bg-[#FAF5EE] hover:bg-[#F3EADF] border border-[#B87333]/30 text-[#B87333] font-mono text-[11px] font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Email Template Snippet</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* MODAL 1: PROPOSE A NEW POLL TOPIC */}
      {showSuggestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-[#FFFDF9] border-2 border-[#B87333] rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl relative space-y-4 my-8">
            <button
              onClick={() => setShowSuggestModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-black cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {!suggestSuccess ? (
              <>
                <div className="flex items-center space-x-3 border-b border-copper-penny/20 pb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#B87333]/15 text-[#B87333] flex items-center justify-center">
                    <Vote className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-black text-xl text-[#1F1813]">
                      Propose a Community Poll
                    </h3>
                    <p className="text-[10px] font-mono text-soft-sage uppercase font-bold">
                      Hearth Democratic Suggestion
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSuggestSubmit} className="space-y-3.5 text-left">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono uppercase font-bold text-soft-sage">
                      Ballot Category
                    </label>
                    <select
                      value={suggestCategory}
                      onChange={(e) => setSuggestCategory(e.target.value as PollCategory)}
                      className="w-full bg-white border border-copper-penny/30 rounded-xl px-3 py-2 text-xs text-[#1F1813] font-medium focus:outline-none focus:border-copper-penny"
                    >
                      <option value="casual-corner">🎙️ Casual Corner Live Topic</option>
                      <option value="crowdfunded-class">🍯 Crowdfunded Masterclass / Skill Pot</option>
                      <option value="village-governance">🏛️ Village Referendum / Gathering</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono uppercase font-bold text-soft-sage">
                      Question or Title <span className="text-[#B87333]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Which wildcrafted herbal remedy should we formulate next?"
                      value={suggestTitle}
                      onChange={(e) => setSuggestTitle(e.target.value)}
                      className="w-full bg-white border border-copper-penny/30 rounded-xl px-3 py-2 text-xs text-[#1F1813] placeholder-gray-400 focus:outline-none focus:border-copper-penny"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-mono uppercase font-bold text-soft-sage">
                      Proposed Answer Choices (Minimum 2)
                    </label>
                    {suggestOptions.map((opt, i) => (
                      <input
                        key={i}
                        type="text"
                        placeholder={`Choice ${i + 1}`}
                        value={opt}
                        onChange={(e) => {
                          const updated = [...suggestOptions];
                          updated[i] = e.target.value;
                          setSuggestOptions(updated);
                        }}
                        className="w-full bg-white border border-copper-penny/25 rounded-xl px-3 py-1.5 text-xs text-[#1F1813] placeholder-gray-400 focus:outline-none focus:border-copper-penny"
                      />
                    ))}
                    <button
                      type="button"
                      onClick={() => setSuggestOptions([...suggestOptions, ''])}
                      className="text-[11px] font-mono text-[#B87333] hover:underline cursor-pointer flex items-center space-x-1 pt-1"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Add another choice</span>
                    </button>
                  </div>

                  <div className="pt-3 flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowSuggestModal(false)}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#B87333] hover:bg-[#A85138] text-white text-xs font-bold rounded-xl shadow-md cursor-pointer font-mono"
                    >
                      Submit for Grandmother Review
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
                  Ballot Proposal Received!
                </h3>
                <p className="text-xs text-[#2A221B]/80 max-w-sm mx-auto">
                  Thank you! The Grandmother Council has received your question. If approved, it will be published to the live Hearth Ballots!
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: EMAIL / NEWSLETTER SNIPPET GENERATOR */}
      {shareModalPoll && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-[#FFFDF9] border-2 border-[#B87333] rounded-3xl p-6 sm:p-7 max-w-xl w-full shadow-2xl relative space-y-4 my-8">
            <button
              onClick={() => setShareModalPoll(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-black cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 border-b border-copper-penny/20 pb-3">
              <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 text-[#B87333] flex items-center justify-center">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-black text-xl text-[#1F1813]">
                  Email Newsletter Snippet
                </h3>
                <p className="text-[10px] font-mono text-soft-sage uppercase font-bold">
                  Copy &amp; Paste to Mailchimp, Substack, or Email Blasts
                </p>
              </div>
            </div>

            <p className="text-xs text-[#2A221B]/80">
              Paste this announcement block into your member email blast or WhatsApp broadcast so sisters can vote with one click:
            </p>

            {/* Email Preview Box */}
            <div className="bg-white border-2 border-dashed border-[#B87333]/40 rounded-2xl p-4 font-sans text-xs space-y-2.5 text-[#1F1813]">
              <p className="font-bold text-sm text-[#B87333]">
                🗳️ Cast Your Vote: {shareModalPoll.title}
              </p>
              <p className="italic text-[#2A221B]/80">
                "{shareModalPoll.question}"
              </p>
              <div className="pl-2 border-l-2 border-[#D4AF37] space-y-1 text-[11px]">
                {shareModalPoll.options.map((opt, idx) => (
                  <p key={opt.id}>
                    • <strong>Option {idx + 1}:</strong> {opt.text}
                  </p>
                ))}
              </div>
              <p className="pt-2">
                👉 <strong>Vote directly on our sanctuary hearth:</strong>{' '}
                <span className="text-[#B87333] underline break-all font-mono text-[10px]">
                  {window.location.origin}/#poll={shareModalPoll.id}
                </span>
              </p>
            </div>

            <div className="pt-2 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => {
                  const text = `🗳️ Cast Your Vote: ${shareModalPoll.title}\n\n"${shareModalPoll.question}"\n\n${shareModalPoll.options.map((o, i) => `Option ${i + 1}: ${o.text}`).join('\n')}\n\n👉 Cast your vote here: ${window.location.origin}/#poll=${shareModalPoll.id}`;
                  navigator.clipboard.writeText(text);
                  alert('Email text snippet copied to your clipboard!');
                }}
                className="px-4 py-2 bg-[#B87333] hover:bg-[#A85138] text-white text-xs font-mono font-bold rounded-xl shadow-md cursor-pointer flex items-center space-x-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Email Text</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
