import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Radio, 
  Sparkles, 
  Headphones, 
  Mic, 
  MicOff, 
  Hand, 
  Clock, 
  Leaf, 
  BookOpen, 
  Heart, 
  Share2, 
  Search, 
  Filter, 
  Volume2, 
  Plus, 
  Award, 
  Flame, 
  Check, 
  RotateCcw, 
  Layers, 
  ShieldCheck, 
  ExternalLink,
  Users,
  Compass,
  Smile,
  Send,
  Trash2
} from 'lucide-react';
import { 
  AudioTrack, 
  AudioSeriesCategory, 
  VoiceNoteReflection, 
  FiresideVoiceRoom, 
  FiresideParticipant,
  ReferencedRemedy 
} from '../types';
import { 
  INITIAL_AUDIO_TRACKS, 
  INITIAL_VOICE_NOTES, 
  INITIAL_FIRESIDE_ROOM 
} from '../data/audioSanctuaryData';

interface AudioSanctuaryLoungeProps {
  tracks?: AudioTrack[];
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  onPlayTrack: (track: AudioTrack) => void;
  onPauseTrack: () => void;
  onSeek?: (seconds: number) => void;
  currentTime?: number;
  userName?: string;
  userRole?: string;
  userStateCode?: string;
  selectedState?: string;
  onOpenAdminPublisher?: () => void;
  isAdmin?: boolean;
  voiceNotes?: VoiceNoteReflection[];
  onAddVoiceNote?: (note: VoiceNoteReflection) => void;
  onLikeVoiceNote?: (id: string) => void;
  firesideRoom?: FiresideVoiceRoom;
  onJoinFireside?: (role: 'speaker' | 'listener') => void;
  onLeaveFireside?: () => void;
  onRaiseHand?: () => void;
  onToggleFiresideMute?: () => void;
}

export default function AudioSanctuaryLounge({
  tracks = INITIAL_AUDIO_TRACKS,
  currentTrack,
  isPlaying,
  onPlayTrack,
  onPauseTrack,
  onSeek = () => {},
  currentTime = 0,
  userName = 'Sister Jamila',
  userRole = 'approved',
  userStateCode,
  selectedState = 'GA',
  onOpenAdminPublisher,
  isAdmin = false,
  voiceNotes: propVoiceNotes,
  onAddVoiceNote,
  onLikeVoiceNote,
  firesideRoom: propFiresideRoom,
  onJoinFireside,
  onLeaveFireside,
  onRaiseHand,
  onToggleFiresideMute
}: AudioSanctuaryLoungeProps) {
  // Navigation Tabs within Audio Sanctuary
  const [loungeTab, setLoungeTab] = useState<'shelves' | 'fireside-stage' | 'voice-notes'>('shelves');

  // Series Category Filter for Shelves
  const [selectedCategory, setSelectedCategory] = useState<AudioSeriesCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrackForDetails, setSelectedTrackForDetails] = useState<AudioTrack | null>(null);

  // Live Fireside Stage State
  const [localFiresideRoom, setLocalFiresideRoom] = useState<FiresideVoiceRoom>(INITIAL_FIRESIDE_ROOM);
  const firesideRoom = propFiresideRoom || localFiresideRoom;
  const [isMyMicMuted, setIsMyMicMuted] = useState(true);
  const [isMyHandRaised, setIsMyHandRaised] = useState(false);
  const [isJoinedAsSpeaker, setIsJoinedAsSpeaker] = useState(false);
  const [handRaiseNotice, setHandRaiseNotice] = useState<string | null>(null);

  // Sister Voice-Note Reflections State
  const [localVoiceNotes, setLocalVoiceNotes] = useState<VoiceNoteReflection[]>(INITIAL_VOICE_NOTES);
  const voiceNotes = propVoiceNotes || localVoiceNotes;
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteCategory, setNewNoteCategory] = useState<'Testimony' | 'Remedy Tip' | 'Homeschool Insight' | 'Village Inquiry'>('Remedy Tip');
  const [newNoteTranscription, setNewNoteTranscription] = useState('');
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [playingVoiceNoteId, setPlayingVoiceNoteId] = useState<string | null>(null);
  const recordingTimerRef = useRef<any>(null);

  // Filtered Audio Tracks
  const filteredTracks = tracks.filter(t => {
    const matchesCategory = selectedCategory === 'all' || t.series === selectedCategory;
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.host.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredTrack = tracks.find(t => t.isFeatured) || tracks[0];

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    if (m >= 60) {
      const h = Math.floor(m / 60);
      const remM = m % 60;
      return `${h}h ${remM}m`;
    }
    return `${m}m ${s > 0 ? `${s}s` : ''}`;
  };

  // Voice Note Recording Simulator
  useEffect(() => {
    if (isRecording) {
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds(prev => {
          if (prev >= 60) {
            handleStopRecording();
            return 60;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    }
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    };
  }, [isRecording]);

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingSeconds(0);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    if (!newNoteTranscription) {
      setNewNoteTranscription('Recorded voice message: sharing heartfelt reflections from the maternal sanctuary circle.');
    }
  };

  const handleSaveVoiceNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle) {
      alert('Please add a short title for your voice note reflection.');
      return;
    }

    const newVN: VoiceNoteReflection = {
      id: `vn-${Date.now()}`,
      sisterName: userName,
      sisterRole: 'Sanctuary Sister',
      stateCode: userStateCode,
      title: newNoteTitle,
      durationSeconds: Math.max(12, recordingSeconds),
      category: newNoteCategory,
      audioFrequency: 432 + Math.floor(Math.random() * 200),
      recordedAt: 'Just now',
      likes: 1,
      transcription: newNoteTranscription || 'Spoken sister reflection on herbal remedy preparation and homeschool rhythm.'
    };

    if (onAddVoiceNote) {
      onAddVoiceNote(newVN);
    } else {
      setLocalVoiceNotes(prev => [newVN, ...prev]);
    }
    setShowRecordModal(false);
    setNewNoteTitle('');
    setNewNoteTranscription('');
    setRecordingSeconds(0);
    alert('🎙️ Your voice-note reflection was published to the Sister Lounge wall!');
  };

  // Live Fireside Actions
  const handleToggleHandRaise = () => {
    if (!isMyHandRaised) {
      setIsMyHandRaised(true);
      setHandRaiseNotice('✋ Hand raised! The host (Mama Jamila) has been notified to bring you onto the stage.');
      setTimeout(() => {
        setIsJoinedAsSpeaker(true);
        setIsMyHandRaised(false);
        setHandRaiseNotice('🎉 You are now on stage! Click Unmute to speak to the sisterhood circle.');
      }, 3500);
    } else {
      setIsMyHandRaised(false);
      setHandRaiseNotice(null);
    }
  };

  const handlePlayVoiceNote = (vn: VoiceNoteReflection) => {
    if (playingVoiceNoteId === vn.id) {
      setPlayingVoiceNoteId(null);
    } else {
      setPlayingVoiceNoteId(vn.id);
      // Play brief ambient tone using Web Audio API
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(vn.audioFrequency || 432, ctx.currentTime);
          gain.gain.setValueAtTime(0.15, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.5);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 2.5);
        }
      } catch (err) {
        // Fallback
      }
      setTimeout(() => {
        setPlayingVoiceNoteId(null);
      }, vn.durationSeconds * 200); // simulation playback
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto my-4 animate-fade-in">
      
      {/* 1. Lounge Hero / Radio Header */}
      <div className="bg-gradient-to-r from-[#1F140E] via-[#2E1C10] to-[#140F0B] text-[#FAF5EE] border-2 border-[#D4AF37]/50 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-[#B87333]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10 border-b border-[#D4AF37]/20 pb-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-2 text-[#D4AF37]">
              <Radio className="w-5 h-5 animate-pulse text-[#D4AF37]" />
              <span className="font-mono text-xs uppercase tracking-widest font-extrabold">
                Sovereign Audio Sanctuary &amp; Fireside Radio
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              The Casual Corner Audio Lounge
            </h2>
            <p className="text-sm text-white/80 leading-relaxed font-sans">
              Stream weekly unhurried sisterhood podcasts, 3-minute apothecary audio formulations, homeschool masterclasses, and live audio-only fireside stages while you browse.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            
            {/* Quick Live Radio Stream Trigger */}
            <button
              onClick={() => {
                const radioTrack = tracks.find(t => t.series === 'live-radio') || featuredTrack;
                onPlayTrack(radioTrack);
              }}
              className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-[#B87333] via-[#D4AF37] to-[#E5C158] text-[#1F140E] font-mono text-xs font-black uppercase tracking-wider rounded-2xl shadow-xl hover:shadow-2xl transition-all active:scale-95 cursor-pointer flex items-center justify-center space-x-2"
            >
              <Flame className="w-4 h-4 text-[#1F140E] fill-current" />
              <span>Tune to 24/7 Live Radio</span>
            </button>

            {isAdmin && onOpenAdminPublisher && (
              <button
                onClick={onOpenAdminPublisher}
                className="w-full sm:w-auto px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-mono text-xs font-bold uppercase rounded-2xl transition-all cursor-pointer flex items-center justify-center space-x-2"
              >
                <Plus className="w-4 h-4 text-[#D4AF37]" />
                <span>Publish Episode</span>
              </button>
            )}
          </div>
        </div>

        {/* 3 Main Lounge Nav Tabs */}
        <div className="flex flex-wrap gap-2 relative z-10">
          <button
            onClick={() => setLoungeTab('shelves')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-mono font-bold uppercase transition-all flex items-center space-x-2 cursor-pointer ${
              loungeTab === 'shelves' 
                ? 'bg-[#D4AF37] text-[#1F140E] shadow-lg font-black' 
                : 'bg-white/10 text-white/90 hover:bg-white/20 border border-white/10'
            }`}
          >
            <Headphones className="w-4 h-4" />
            <span>Curated Audio Shelves ({tracks.length})</span>
          </button>

          <button
            onClick={() => setLoungeTab('fireside-stage')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-mono font-bold uppercase transition-all flex items-center space-x-2 cursor-pointer ${
              loungeTab === 'fireside-stage' 
                ? 'bg-[#D4AF37] text-[#1F140E] shadow-lg font-black' 
                : 'bg-white/10 text-white/90 hover:bg-white/20 border border-white/10'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>Live Audio-Only Fireside Stage</span>
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          </button>

          <button
            onClick={() => setLoungeTab('voice-notes')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-mono font-bold uppercase transition-all flex items-center space-x-2 cursor-pointer ${
              loungeTab === 'voice-notes' 
                ? 'bg-[#D4AF37] text-[#1F140E] shadow-lg font-black' 
                : 'bg-white/10 text-white/90 hover:bg-white/20 border border-white/10'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Sister Voice-Note Inbox ({voiceNotes.length})</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: CURATED AUDIO SHELVES & PODCAST REPOSITORY                         */}
      {/* ========================================================================= */}
      {loungeTab === 'shelves' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Featured Episode Hero Showcase */}
          {featuredTrack && (
            <div className="bg-white border-2 border-copper-penny/25 rounded-3xl p-6 sm:p-8 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-4 relative rounded-3xl overflow-hidden shadow-lg border border-copper-penny/20 aspect-square group">
                <img 
                  src={featuredTrack.coverImage || '/The Casual Corner Talk.jpeg'} 
                  alt={featuredTrack.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
                  <span className="text-[10px] font-mono uppercase font-bold text-[#D4AF37] bg-black/60 px-3 py-1 rounded-full border border-[#D4AF37]/40">
                    👑 Matriarch Featured Episode
                  </span>
                </div>
              </div>

              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center space-x-2 text-xs font-mono font-bold text-[#B87333]">
                  <span>{featuredTrack.releaseDate}</span>
                  <span>•</span>
                  <span>{formatDuration(featuredTrack.durationSeconds)}</span>
                  <span>•</span>
                  <span>{featuredTrack.listenCount} Sisters Listened</span>
                </div>

                <h3 className="font-serif font-extrabold text-2xl sm:text-3xl text-[#1F1813] leading-tight">
                  {featuredTrack.title}
                </h3>

                <p className="text-xs sm:text-sm text-gray-700 font-sans leading-relaxed">
                  {featuredTrack.description}
                </p>

                {/* Host Info */}
                <div className="flex items-center space-x-3 text-xs bg-[#FAF5EE] p-3 rounded-2xl border border-copper-penny/15">
                  <div className="w-8 h-8 rounded-full bg-[#B87333] text-white flex items-center justify-center font-serif font-bold text-sm">
                    {featuredTrack.host.charAt(0)}
                  </div>
                  <div>
                    <span className="font-serif font-bold text-[#1F1813] block">{featuredTrack.host}</span>
                    <span className="text-[10px] text-soft-sage font-mono">{featuredTrack.hostRole}</span>
                  </div>
                </div>

                {/* Play and Details Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      if (currentTrack?.id === featuredTrack.id && isPlaying) {
                        onPauseTrack();
                      } else {
                        onPlayTrack(featuredTrack);
                      }
                    }}
                    className="px-6 py-3 bg-[#1F140E] hover:bg-[#3D2517] text-white font-mono text-xs font-extrabold uppercase tracking-wider rounded-2xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center space-x-2"
                  >
                    {currentTrack?.id === featuredTrack.id && isPlaying ? (
                      <>
                        <Pause className="w-4 h-4 fill-current text-[#D4AF37]" />
                        <span>Pause Listening</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-current text-[#D4AF37]" />
                        <span>Play Episode ({formatDuration(featuredTrack.durationSeconds)})</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setSelectedTrackForDetails(selectedTrackForDetails?.id === featuredTrack.id ? null : featuredTrack)}
                    className="px-4 py-3 bg-[#FAF5EE] hover:bg-[#FAF5EE]/80 border border-copper-penny/25 text-[#1F1813] font-mono text-xs font-bold uppercase rounded-2xl transition-all cursor-pointer flex items-center space-x-2"
                  >
                    <BookOpen className="w-4 h-4 text-[#B87333]" />
                    <span>{selectedTrackForDetails?.id === featuredTrack.id ? 'Hide Chapters' : 'View Chapters & Recipes'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Category Shelf Filter Pills & Search */}
          <div className="bg-white border border-copper-penny/15 rounded-3xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center flex-wrap gap-2 w-full md:w-auto">
              <span className="text-xs font-mono font-bold uppercase text-[#1F1813] flex items-center space-x-1 mr-1">
                <Filter className="w-3.5 h-3.5 text-[#B87333]" />
                <span>Shelf:</span>
              </span>

              {[
                { id: 'all', label: 'All Shelves' },
                { id: 'casual-corner', label: '🎙️ Casual Corner Talks' },
                { id: 'apothecary-snippets', label: '🌿 Apothecary Snippets (3-5m)' },
                { id: 'homeschool', label: '📚 Homeschool Reflections' },
                { id: 'ancestral', label: '🔥 Ancestral Storytelling' },
                { id: 'live-radio', label: '📻 24/7 Live Stream' }
              ].map((shelf) => (
                <button
                  key={shelf.id}
                  onClick={() => setSelectedCategory(shelf.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                    selectedCategory === shelf.id
                      ? 'bg-[#B87333] text-white shadow-xs'
                      : 'bg-[#FAF5EE] text-[#1F1813] hover:bg-amber-100 border border-copper-penny/15'
                  }`}
                >
                  {shelf.label}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-soft-sage absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search episodes, herbal recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#FAF5EE]/50 border border-copper-penny/20 focus:border-copper-penny rounded-xl pl-10 pr-4 py-1.5 text-xs text-[#1F1813] placeholder-gray-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Selected Track Deep-Dive (Chapters & Recipes Drawer) */}
          {selectedTrackForDetails && (
            <div className="bg-[#FAF5EE] border-2 border-[#D4AF37] rounded-3xl p-6 shadow-xl space-y-5 animate-scale-in">
              <div className="flex items-center justify-between border-b border-copper-penny/20 pb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase font-bold text-[#B87333] block">
                    Interactive Chapter Guide &amp; Formulations
                  </span>
                  <h4 className="font-serif font-extrabold text-xl text-[#1F1813]">
                    {selectedTrackForDetails.title}
                  </h4>
                </div>
                <button
                  onClick={() => setSelectedTrackForDetails(null)}
                  className="px-3 py-1 bg-white hover:bg-gray-100 border border-copper-penny/20 rounded-xl text-xs font-mono font-bold cursor-pointer"
                >
                  Close Guide
                </button>
              </div>

              {/* Clickable Timestamps */}
              <div className="space-y-3">
                <span className="text-xs font-mono font-bold text-[#1F1813] flex items-center space-x-1.5">
                  <Clock className="w-4 h-4 text-[#B87333]" />
                  <span>Click Any Timestamp to Jump &amp; Listen:</span>
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedTrackForDetails.timestamps.map((ts, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        onPlayTrack(selectedTrackForDetails);
                        setTimeout(() => onSeek(ts.timeSeconds), 300);
                      }}
                      className="bg-white hover:bg-[#FAF5EE] border border-copper-penny/20 hover:border-[#D4AF37] rounded-2xl p-3.5 transition-all cursor-pointer space-y-1 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-lg bg-[#1F140E] text-[#D4AF37] group-hover:scale-105 transition-transform">
                          {Math.floor(ts.timeSeconds / 60)}:{(ts.timeSeconds % 60).toString().padStart(2, '0')}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-700 font-bold flex items-center space-x-0.5">
                          <Play className="w-3 h-3 fill-current" />
                          <span>Jump Here</span>
                        </span>
                      </div>
                      <h5 className="font-serif font-bold text-xs text-[#1F1813]">{ts.label}</h5>
                      <p className="text-[11px] text-gray-600 font-sans">{ts.summary}</p>
                      {ts.attachmentNote && (
                        <p className="text-[10px] font-mono text-[#B87333] pt-1">
                          📌 {ts.attachmentNote}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Referenced Remedies Grid if present */}
              {selectedTrackForDetails.referencedRemedies && selectedTrackForDetails.referencedRemedies.length > 0 && (
                <div className="space-y-3 pt-3 border-t border-copper-penny/20">
                  <span className="text-xs font-mono font-bold text-emerald-800 flex items-center space-x-1.5">
                    <Leaf className="w-4 h-4 text-emerald-600" />
                    <span>Referenced Herbal Recipes &amp; Apothecary Instructions:</span>
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedTrackForDetails.referencedRemedies.map((remedy, i) => (
                      <div key={i} className="bg-white rounded-2xl p-4 border border-emerald-300/60 space-y-2">
                        <div className="flex items-center justify-between">
                          <h6 className="font-serif font-extrabold text-sm text-[#1F1813]">{remedy.name}</h6>
                          <span className="text-[9px] font-mono uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                            {remedy.category}
                          </span>
                        </div>
                        <p className="text-xs text-gray-700 font-medium">{remedy.purpose}</p>
                        <div className="text-[11px] text-gray-600 space-y-1 bg-[#FAF5EE] p-2.5 rounded-xl">
                          <span className="font-mono font-bold text-[10px] text-[#B87333] block">Ingredients:</span>
                          <p>{remedy.ingredients.join(' • ')}</p>
                        </div>
                        <p className="text-[11px] text-gray-700 leading-snug">
                          <strong className="text-xs font-serif">Prep: </strong>{remedy.instructions}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Grid of Audio Track Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTracks.map((track) => {
              const isCurrentlyPlayingThis = currentTrack?.id === track.id && isPlaying;

              return (
                <div 
                  key={track.id} 
                  className={`bg-white rounded-3xl border transition-all p-5 shadow-xs flex flex-col justify-between space-y-4 ${
                    currentTrack?.id === track.id ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/30 shadow-md' : 'border-copper-penny/20 hover:border-copper-penny/50'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Thumbnail & Series Pill */}
                    <div className="relative rounded-2xl overflow-hidden aspect-video border border-copper-penny/15 group">
                      <img 
                        src={track.coverImage || '/The Casual Corner Talk.jpeg'} 
                        alt={track.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 left-2">
                        <span className="text-[9px] font-mono uppercase font-extrabold px-2.5 py-1 rounded-full bg-black/70 text-[#D4AF37] border border-[#D4AF37]/40 shadow-sm">
                          {track.series === 'casual-corner' ? '🎙️ Casual Corner' :
                           track.series === 'apothecary-snippets' ? '🌿 5-Min Snippet' :
                           track.series === 'homeschool' ? '📚 Homeschool' :
                           track.series === 'ancestral' ? '🔥 Ancestral' : '📻 Radio'}
                        </span>
                      </div>
                      <div className="absolute bottom-2 right-2">
                        <span className="text-[10px] font-mono font-bold bg-black/80 text-white px-2 py-0.5 rounded-md">
                          {formatDuration(track.durationSeconds)}
                        </span>
                      </div>
                    </div>

                    {/* Meta */}
                    <div className="flex items-center justify-between text-[10px] font-mono text-soft-sage">
                      <span>{track.releaseDate}</span>
                      <span>{track.timestamps.length} Chapters</span>
                    </div>

                    <h4 className="font-serif font-extrabold text-base text-[#1F1813] leading-snug line-clamp-2">
                      {track.title}
                    </h4>

                    <p className="text-xs text-gray-600 font-sans line-clamp-2 leading-relaxed">
                      {track.description}
                    </p>
                  </div>

                  {/* Footer: Host & Play Action */}
                  <div className="pt-3 border-t border-copper-penny/10 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-[10px] text-soft-sage truncate max-w-[170px]">
                        🎙️ {track.host}
                      </span>
                      <button
                        onClick={() => setSelectedTrackForDetails(selectedTrackForDetails?.id === track.id ? null : track)}
                        className="text-[10px] font-mono text-[#B87333] hover:underline font-bold cursor-pointer"
                      >
                        {selectedTrackForDetails?.id === track.id ? 'Hide Notes' : 'Notes & Recipes'}
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        if (isCurrentlyPlayingThis) {
                          onPauseTrack();
                        } else {
                          onPlayTrack(track);
                        }
                      }}
                      className={`w-full py-2.5 rounded-xl font-mono text-xs font-bold uppercase transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-95 ${
                        isCurrentlyPlayingThis 
                          ? 'bg-[#D4AF37] text-[#1F140E] shadow-sm' 
                          : 'bg-[#1F1813] hover:bg-[#3D2517] text-white shadow-xs'
                      }`}
                    >
                      {isCurrentlyPlayingThis ? (
                        <>
                          <Pause className="w-3.5 h-3.5 fill-current" />
                          <span>Pause Audio</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current text-[#D4AF37]" />
                          <span>Listen Now</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: LIVE AUDIO-ONLY FIRESIDE STAGE (CLUBHOUSE / NO VIDEO REQUIRED)    */}
      {/* ========================================================================= */}
      {loungeTab === 'fireside-stage' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Active Live Room Card */}
          <div className="bg-gradient-to-br from-[#1F140E] via-[#2A1D16] to-[#120D0A] text-[#FAF5EE] border-2 border-[#D4AF37]/60 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            
            {/* Top Bar: Room Title & Live Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D4AF37]/20 pb-5">
              <div>
                <div className="flex items-center space-x-2 text-[#D4AF37] mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                  <span className="font-mono text-xs uppercase tracking-widest font-extrabold text-rose-400">
                    Live Audio-Only Sanctuary Stage • No Cameras Required
                  </span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-white">
                  {firesideRoom.title}
                </h3>
                <p className="text-xs sm:text-sm text-white/80 font-sans mt-1">
                  Topic: {firesideRoom.topic}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <span className="bg-black/50 border border-white/20 text-[#FAF5EE] text-xs font-mono px-3.5 py-1.5 rounded-xl flex items-center space-x-1.5">
                  <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{firesideRoom.speakers.length + firesideRoom.listeners.length + (isJoinedAsSpeaker ? 1 : 0)} In Stage Room</span>
                </span>
              </div>
            </div>

            {/* Hand Raised / Notification Toast */}
            {handRaiseNotice && (
              <div className="p-3.5 bg-amber-950/80 border border-amber-500/50 rounded-2xl text-xs font-mono text-amber-200 flex items-center justify-between animate-fade-in">
                <span>{handRaiseNotice}</span>
                <button onClick={() => setHandRaiseNotice(null)} className="text-amber-400 hover:text-white font-bold ml-2">✕</button>
              </div>
            )}

            {/* Stage Speakers Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase font-extrabold tracking-wider text-[#D4AF37] flex items-center space-x-2">
                  <Flame className="w-4 h-4 text-[#D4AF37]" />
                  <span>On The Fireside Stage (Speakers)</span>
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {firesideRoom.speakers.map((spk) => (
                  <div 
                    key={spk.id}
                    className={`p-4 rounded-3xl border transition-all text-center space-y-2 relative ${
                      spk.isSpeaking 
                        ? 'bg-[#D4AF37]/20 border-[#D4AF37] ring-2 ring-[#D4AF37]/50 shadow-lg' 
                        : 'bg-white/5 border-white/15'
                    }`}
                  >
                    {/* Glowing Avatar */}
                    <div className="relative w-14 h-14 mx-auto rounded-full bg-gradient-to-tr from-[#B87333] to-[#D4AF37] flex items-center justify-center font-serif font-bold text-xl text-white shadow-md">
                      {spk.name.charAt(0)}
                      
                      {/* Speaking Waveform Indicator */}
                      {spk.isSpeaking && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-black flex items-center justify-center">
                          <span className="w-2 h-2 bg-white rounded-full animate-ping" />
                        </span>
                      )}

                      {/* Mute badge */}
                      <span className={`absolute -bottom-1 -right-1 p-1 rounded-full text-[9px] border border-black ${
                        spk.isMuted ? 'bg-red-900 text-red-200' : 'bg-emerald-900 text-emerald-200'
                      }`}>
                        {spk.isMuted ? <MicOff className="w-2.5 h-2.5" /> : <Mic className="w-2.5 h-2.5" />}
                      </span>
                    </div>

                    <div>
                      <h5 className="font-serif font-bold text-sm text-white truncate">{spk.name}</h5>
                      <span className="text-[10px] font-mono text-[#D4AF37] block truncate">{spk.role}</span>
                    </div>
                  </div>
                ))}

                {/* Current User on Stage if joined */}
                {isJoinedAsSpeaker && (
                  <div className="p-4 rounded-3xl border border-[#D4AF37] bg-[#D4AF37]/25 ring-2 ring-[#D4AF37] text-center space-y-2 animate-scale-in">
                    <div className="relative w-14 h-14 mx-auto rounded-full bg-[#D4AF37] flex items-center justify-center font-serif font-bold text-xl text-[#1F140E] shadow-md">
                      {userName.charAt(0)}
                      <span className={`absolute -bottom-1 -right-1 p-1 rounded-full text-[9px] border border-black ${
                        isMyMicMuted ? 'bg-red-900 text-red-200' : 'bg-emerald-900 text-emerald-200'
                      }`}>
                        {isMyMicMuted ? <MicOff className="w-2.5 h-2.5" /> : <Mic className="w-2.5 h-2.5" />}
                      </span>
                    </div>
                    <div>
                      <h5 className="font-serif font-bold text-sm text-white truncate">{userName} (You)</h5>
                      <span className="text-[10px] font-mono text-[#D4AF37] block truncate">{userStateCode} Sanctuary Sister</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Listener Audience Grid */}
            <div className="space-y-3 pt-3 border-t border-white/10">
              <span className="font-mono text-xs uppercase font-bold text-white/70 flex items-center space-x-2">
                <Users className="w-4 h-4 text-white/60" />
                <span>Listening from the Audio Sanctuary</span>
              </span>

              <div className="flex flex-wrap gap-3">
                {firesideRoom.listeners.map((lis) => (
                  <div 
                    key={lis.id}
                    className="flex items-center space-x-2 px-3 py-1.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-white/80"
                  >
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center font-serif text-[11px] font-bold">
                      {lis.name.charAt(0)}
                    </div>
                    <span className="font-sans font-medium">{lis.name}</span>
                    {lis.isHandRaised && (
                      <span className="text-amber-400 font-bold" title="Hand Raised">✋</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Stage Controls: Raise Hand, Mic Toggle, Leave Stage */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#D4AF37]/20">
              <div className="flex items-center space-x-3">
                
                {/* Raise Hand Button */}
                <button
                  onClick={handleToggleHandRaise}
                  disabled={isJoinedAsSpeaker}
                  className={`px-4 py-2.5 rounded-2xl font-mono text-xs font-bold uppercase transition-all flex items-center space-x-2 cursor-pointer active:scale-95 ${
                    isMyHandRaised 
                      ? 'bg-amber-500 text-black font-extrabold shadow-lg animate-pulse' 
                      : isJoinedAsSpeaker 
                      ? 'bg-white/10 text-white/40 cursor-not-allowed'
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                  }`}
                >
                  <Hand className="w-4 h-4" />
                  <span>{isMyHandRaised ? '✋ Hand Raised (Awaiting Host)' : 'Raise Hand to Speak ✋'}</span>
                </button>

                {/* Mic Toggle if Speaker */}
                {isJoinedAsSpeaker && (
                  <button
                    onClick={() => setIsMyMicMuted(!isMyMicMuted)}
                    className={`px-4 py-2.5 rounded-2xl font-mono text-xs font-bold uppercase transition-all flex items-center space-x-2 cursor-pointer active:scale-95 ${
                      isMyMicMuted 
                        ? 'bg-red-600 hover:bg-red-700 text-white shadow-md' 
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
                    }`}
                  >
                    {isMyMicMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    <span>{isMyMicMuted ? 'Muted (Click to Talk)' : 'Microphone Live (Broadcasting)'}</span>
                  </button>
                )}
              </div>

              <div className="flex items-center space-x-2 text-xs font-mono text-white/60">
                <span>Audio Stream: Clean 48kHz HD Voice</span>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: SISTER VOICE-NOTE REFLECTIONS (60-SECOND DROPS)                    */}
      {/* ========================================================================= */}
      {loungeTab === 'voice-notes' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Top Voice-Note Action Bar */}
          <div className="bg-white border border-copper-penny/15 rounded-3xl p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-serif font-extrabold text-xl text-[#1F1813] flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-[#B87333]" />
                <span>Sister Voice-Note Reflections</span>
              </h3>
              <p className="text-xs text-soft-sage font-mono mt-0.5">
                Drop 60-second voice testimonies, remedy tips, and questions for the matriarch council.
              </p>
            </div>

            <button
              onClick={() => setShowRecordModal(true)}
              className="px-5 py-2.5 bg-[#D4AF37] hover:bg-[#E5C158] text-[#1F140E] font-mono text-xs font-black uppercase rounded-2xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center space-x-2 shrink-0"
            >
              <Mic className="w-4 h-4" />
              <span>Record 60s Voice Note</span>
            </button>
          </div>

          {/* Voice Notes Wall */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {voiceNotes.map((vn) => {
              const isPlayingThisNote = playingVoiceNoteId === vn.id;

              return (
                <div 
                  key={vn.id}
                  className="bg-white rounded-3xl border border-copper-penny/20 p-5 shadow-xs space-y-3.5 hover:border-copper-penny/50 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#B87333] to-[#D4AF37] text-white flex items-center justify-center font-serif font-bold text-sm">
                        {vn.sisterName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-serif font-bold text-sm text-[#1F1813]">{vn.sisterName}</h4>
                        <span className="text-[10px] font-mono text-soft-sage">
                          {vn.stateCode} Circle • {vn.recordedAt}
                        </span>
                      </div>
                    </div>

                    <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                      vn.category === 'Remedy Tip' 
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                        : vn.category === 'Homeschool Insight' 
                        ? 'bg-blue-50 text-blue-800 border-blue-300' 
                        : vn.category === 'Testimony' 
                        ? 'bg-amber-50 text-amber-800 border-amber-300' 
                        : 'bg-purple-50 text-purple-800 border-purple-300'
                    }`}>
                      {vn.category}
                    </span>
                  </div>

                  <h5 className="font-serif font-bold text-sm text-[#1F1813] leading-snug">
                    {vn.title}
                  </h5>

                  {/* Audio Frequency Waveform Player */}
                  <div className="bg-[#FAF5EE] rounded-2xl p-3 border border-copper-penny/15 flex items-center space-x-3">
                    <button
                      onClick={() => handlePlayVoiceNote(vn)}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-white transition-all cursor-pointer shrink-0 ${
                        isPlayingThisNote ? 'bg-[#D4AF37] text-[#1F140E]' : 'bg-[#1F1813] hover:bg-[#3D2517]'
                      }`}
                    >
                      {isPlayingThisNote ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                    </button>

                    {/* Animated Soundwave bars */}
                    <div className="flex-1 flex items-center space-x-1 h-6">
                      {[16, 24, 12, 28, 20, 10, 22, 18, 26, 14, 20, 12, 18].map((height, i) => (
                        <div 
                          key={i}
                          className={`flex-1 rounded-full transition-all duration-200 ${
                            isPlayingThisNote ? 'bg-[#D4AF37] animate-pulse' : 'bg-copper-penny/30'
                          }`}
                          style={{ height: `${isPlayingThisNote ? Math.max(8, (height * 1.2) % 28) : height}px` }}
                        />
                      ))}
                    </div>

                    <span className="text-[10px] font-mono text-soft-sage font-bold shrink-0">
                      0:{vn.durationSeconds.toString().padStart(2, '0')}
                    </span>
                  </div>

                  {/* Transcription snippet */}
                  <p className="text-xs text-gray-700 font-sans italic bg-white/80 p-2.5 rounded-xl border border-gray-100">
                    "{vn.transcription}"
                  </p>

                  <div className="flex items-center justify-between text-[11px] font-mono text-soft-sage pt-1">
                    <span className="text-[10px]">🌿 {vn.audioFrequency || 432}Hz Sanctuary Resonance</span>
                    <button 
                      onClick={() => {
                        if (onLikeVoiceNote) {
                          onLikeVoiceNote(vn.id);
                        } else {
                          setLocalVoiceNotes(prev => prev.map(v => v.id === vn.id ? { ...v, likes: v.likes + 1 } : v));
                        }
                      }}
                      className="text-[#B87333] hover:text-rose-600 flex items-center space-x-1 cursor-pointer"
                    >
                      <Heart className="w-3.5 h-3.5 fill-current" />
                      <span>{vn.likes} Sister Appreciations</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* Modal: 60-Second Voice-Note Recording Studio */}
      {showRecordModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[60] flex items-center justify-center p-4">
          <div className="bg-[#FAF5EE] border-2 border-[#D4AF37] rounded-3xl p-6 sm:p-8 max-w-lg w-full text-[#1F1813] shadow-2xl space-y-5 animate-scale-in">
            <div className="flex items-center justify-between border-b border-copper-penny/20 pb-3">
              <div className="flex items-center space-x-2">
                <Mic className="w-5 h-5 text-[#B87333]" />
                <h3 className="font-serif font-extrabold text-xl text-[#1F1813]">
                  Sister Voice-Note Recorder
                </h3>
              </div>
              <button
                onClick={() => setShowRecordModal(false)}
                className="text-gray-500 hover:text-black p-1 rounded-full cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveVoiceNote} className="space-y-4">
              
              {/* Recording Visualizer & Timer */}
              <div className="bg-gradient-to-r from-[#1F140E] to-[#2D1B0E] rounded-3xl p-6 text-center text-white space-y-4 shadow-inner">
                <div className="flex items-center justify-center space-x-2 text-[#D4AF37] font-mono text-xs">
                  {isRecording && <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />}
                  <span>{isRecording ? 'RECORDING SISTER REFLECTION...' : 'MIC READY'}</span>
                </div>

                <div className="font-mono text-4xl font-extrabold text-white">
                  0:{recordingSeconds.toString().padStart(2, '0')} <span className="text-xs text-white/50">/ 1:00</span>
                </div>

                {/* Animated visualizer bar */}
                <div className="flex items-center justify-center space-x-1.5 h-8">
                  {[20, 32, 15, 40, 25, 12, 35, 28, 45, 18, 30].map((h, i) => (
                    <div 
                      key={i} 
                      className={`w-1.5 rounded-full transition-all ${
                        isRecording ? 'bg-[#D4AF37] animate-pulse' : 'bg-white/20'
                      }`}
                      style={{ height: `${isRecording ? Math.max(10, (h * 1.5) % 40) : 8}px` }}
                    />
                  ))}
                </div>

                {/* Record Button */}
                <div>
                  {!isRecording ? (
                    <button
                      type="button"
                      onClick={handleStartRecording}
                      className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-mono text-xs font-extrabold uppercase rounded-2xl shadow-lg transition-all active:scale-95 cursor-pointer flex items-center space-x-2 mx-auto"
                    >
                      <Mic className="w-4 h-4" />
                      <span>Start 60s Voice Recording</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleStopRecording}
                      className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-extrabold uppercase rounded-2xl shadow-lg transition-all active:scale-95 cursor-pointer flex items-center space-x-2 mx-auto"
                    >
                      <Check className="w-4 h-4" />
                      <span>Done Recording</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Title & Category */}
              <div>
                <label className="text-[10px] font-mono uppercase font-bold text-soft-sage block mb-1">
                  Voice Note Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tips on solar macerating calendula oil..."
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  className="w-full bg-white border border-copper-penny/20 rounded-xl p-2.5 text-xs text-[#1F1813] font-medium"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase font-bold text-soft-sage block mb-1">
                  Category
                </label>
                <select
                  value={newNoteCategory}
                  onChange={(e) => setNewNoteCategory(e.target.value as any)}
                  className="w-full bg-white border border-copper-penny/20 rounded-xl p-2.5 text-xs font-mono text-[#1F1813]"
                >
                  <option value="Remedy Tip">🌿 Remedy &amp; Apothecary Tip</option>
                  <option value="Homeschool Insight">📚 Homeschool &amp; Child Mastery</option>
                  <option value="Testimony">💖 Village Testimony &amp; Gratitude</option>
                  <option value="Village Inquiry">❓ Question for Grandmothers</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase font-bold text-soft-sage block mb-1">
                  Written Summary / Transcription Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief summary of what you spoke about..."
                  value={newNoteTranscription}
                  onChange={(e) => setNewNoteTranscription(e.target.value)}
                  className="w-full bg-white border border-copper-penny/20 rounded-xl p-2.5 text-xs text-[#1F1813]"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setShowRecordModal(false)}
                  className="px-4 py-2 text-xs font-mono text-gray-600 hover:text-black cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#D4AF37] hover:bg-[#E5C158] text-[#1F140E] font-mono text-xs font-extrabold uppercase rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Publish Voice Note Drop
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
