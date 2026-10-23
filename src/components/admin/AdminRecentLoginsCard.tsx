import React, { useState, useMemo } from 'react';
import { 
  Users, 
  MapPin, 
  Search, 
  Filter, 
  Clock, 
  Smartphone, 
  Laptop, 
  ShieldCheck, 
  Sparkles, 
  Radio, 
  RefreshCw, 
  Download, 
  Heart, 
  ExternalLink, 
  Activity,
  CheckCircle2,
  ChevronDown,
  Wifi
} from 'lucide-react';

export interface MemberLoginActivity {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
  avatarEmoji?: string;
  stateCode: string;
  circleName: string;
  role: 'Elder Council' | 'State Spearhead' | 'Sovereign Matriarch' | 'Circle Host' | 'Verified Sister';
  loginTimestamp: string;
  loginMinutesAgo: number;
  isOnlineNow: boolean;
  device: 'iOS App' | 'Android PWA' | 'Mobile Safari' | 'Desktop Chrome' | 'Mac Safari';
  currentArena: string;
  sessionDurationMins: number;
  coopStanding: '100% Trust' | 'Vouched' | 'Pioneer';
}

const INITIAL_LOGIN_ACTIVITIES: MemberLoginActivity[] = [
  {
    id: 'log-1',
    name: 'Mama Shantrece',
    handle: '@mamashantrece',
    avatarUrl: '/coppermommies-selflove1-cmc.jpg',
    stateCode: 'GA',
    circleName: 'Atlanta Circle',
    role: 'Elder Council',
    loginTimestamp: '2 mins ago',
    loginMinutesAgo: 2,
    isOnlineNow: true,
    device: 'iOS App',
    currentArena: '🌿 Moderating Village Stream & Approving Grants',
    sessionDurationMins: 45,
    coopStanding: '100% Trust'
  },
  {
    id: 'log-2',
    name: 'Sister Keisha Vance',
    handle: '@keishavance_sc',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    avatarEmoji: '👑',
    stateCode: 'SC',
    circleName: 'Charleston Circle',
    role: 'State Spearhead',
    loginTimestamp: '8 mins ago',
    loginMinutesAgo: 8,
    isOnlineNow: true,
    device: 'Mobile Safari',
    currentArena: '🤝 Listed Organic Bengkung Wraps on The Exchange',
    sessionDurationMins: 22,
    coopStanding: '100% Trust'
  },
  {
    id: 'log-3',
    name: 'Danielle Henderson',
    handle: '@danielle_nc',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    avatarEmoji: '🌾',
    stateCode: 'NC',
    circleName: 'Charlotte Circle',
    role: 'State Spearhead',
    loginTimestamp: '14 mins ago',
    loginMinutesAgo: 14,
    isOnlineNow: true,
    device: 'Android PWA',
    currentArena: '🎙️ Listening to Live Fireside in Sanctuary Audio',
    sessionDurationMins: 38,
    coopStanding: '100% Trust'
  },
  {
    id: 'log-4',
    name: 'Grandmother Evelyn Wright',
    handle: '@elder_evelyn',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    avatarEmoji: '🕊️',
    stateCode: 'GA',
    circleName: 'Atlanta Circle',
    role: 'Elder Council',
    loginTimestamp: '29 mins ago',
    loginMinutesAgo: 29,
    isOnlineNow: true,
    device: 'Mac Safari',
    currentArena: '✨ Voted on Community Poll: Postpartum Herbal Kits',
    sessionDurationMins: 60,
    coopStanding: '100% Trust'
  },
  {
    id: 'log-5',
    name: 'Maya Linwood',
    handle: '@mayaoakland',
    avatarUrl: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&w=400&q=80',
    avatarEmoji: '🌱',
    stateCode: 'CA',
    circleName: 'Oakland Circle',
    role: 'Circle Host',
    loginTimestamp: '42 mins ago',
    loginMinutesAgo: 42,
    isOnlineNow: true,
    device: 'iOS App',
    currentArena: '🌿 Replied in Village Stream: Lowcountry Herbal Oxymels',
    sessionDurationMins: 19,
    coopStanding: '100% Trust'
  },
  {
    id: 'log-6',
    name: 'Dr. Nia Robinson',
    handle: '@drnia_tx',
    avatarUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=400&q=80',
    avatarEmoji: '⚖️',
    stateCode: 'TX',
    circleName: 'Houston Circle',
    role: 'Sovereign Matriarch',
    loginTimestamp: '1 hour ago',
    loginMinutesAgo: 65,
    isOnlineNow: false,
    device: 'Desktop Chrome',
    currentArena: '🎓 Completed Class: Sovereign Land Trust Formations',
    sessionDurationMins: 52,
    coopStanding: '100% Trust'
  },
  {
    id: 'log-7',
    name: 'Zora Caldwell',
    handle: '@zora_fl',
    avatarUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80',
    avatarEmoji: '🌺',
    stateCode: 'FL',
    circleName: 'Jacksonville Circle',
    role: 'Verified Sister',
    loginTimestamp: '2 hours ago',
    loginMinutesAgo: 120,
    isOnlineNow: false,
    device: 'iOS App',
    currentArena: '🤝 Coordinated Baby Carrier Swap on The Exchange',
    sessionDurationMins: 15,
    coopStanding: 'Vouched'
  },
  {
    id: 'log-8',
    name: 'Aaliyah Washington',
    handle: '@aaliyah_va',
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
    avatarEmoji: '✨',
    stateCode: 'VA',
    circleName: 'Richmond Circle',
    role: 'Circle Host',
    loginTimestamp: '3 hours ago',
    loginMinutesAgo: 180,
    isOnlineNow: false,
    device: 'Mobile Safari',
    currentArena: '📅 RSVP\'d to Mid-Atlantic Sisterhood Meetup',
    sessionDurationMins: 28,
    coopStanding: '100% Trust'
  },
  {
    id: 'log-9',
    name: 'Kendra Jackson',
    handle: '@kendra_al',
    avatarUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80',
    avatarEmoji: '☀️',
    stateCode: 'AL',
    circleName: 'Birmingham Circle',
    role: 'Verified Sister',
    loginTimestamp: '4 hours ago',
    loginMinutesAgo: 240,
    isOnlineNow: false,
    device: 'Android PWA',
    currentArena: '🌿 Shared Post: Soursop Leaf Tea for Evening Rest',
    sessionDurationMins: 17,
    coopStanding: 'Vouched'
  },
  {
    id: 'log-10',
    name: 'Solange Mercer',
    handle: '@solange_ny',
    avatarUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=400&q=80',
    avatarEmoji: '👑',
    stateCode: 'NY',
    circleName: 'Brooklyn Circle',
    role: 'Sovereign Matriarch',
    loginTimestamp: '5 hours ago',
    loginMinutesAgo: 300,
    isOnlineNow: false,
    device: 'Mac Safari',
    currentArena: '🗝️ Accessed Private Trust Vault Documents',
    sessionDurationMins: 41,
    coopStanding: '100% Trust'
  }
];

const CIRCLE_STATES = [
  { code: 'ALL', name: 'All 50 States' },
  { code: 'GA', name: 'Georgia (GA)' },
  { code: 'NC', name: 'North Carolina (NC)' },
  { code: 'SC', name: 'South Carolina (SC)' },
  { code: 'CA', name: 'California (CA)' },
  { code: 'TX', name: 'Texas (TX)' },
  { code: 'FL', name: 'Florida (FL)' },
  { code: 'VA', name: 'Virginia (VA)' },
  { code: 'AL', name: 'Alabama (AL)' },
  { code: 'NY', name: 'New York (NY)' },
  { code: 'MD', name: 'Maryland (MD)' }
];

export default function AdminRecentLoginsCard() {
  const [activities, setActivities] = useState<MemberLoginActivity[]>(INITIAL_LOGIN_ACTIVITIES);
  const [selectedState, setSelectedState] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'today'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filter activities
  const filteredActivities = useMemo(() => {
    return activities.filter((act) => {
      // Circle State filter
      if (selectedState !== 'ALL' && act.stateCode !== selectedState) {
        return false;
      }
      // Status filter
      if (statusFilter === 'online' && !act.isOnlineNow) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = act.name.toLowerCase().includes(query);
        const matchesHandle = act.handle.toLowerCase().includes(query);
        const matchesState = act.circleName.toLowerCase().includes(query) || act.stateCode.toLowerCase().includes(query);
        const matchesArena = act.currentArena.toLowerCase().includes(query);
        if (!matchesName && !matchesHandle && !matchesState && !matchesArena) {
          return false;
        }
      }
      return true;
    });
  }, [activities, selectedState, statusFilter, searchQuery]);

  // Aggregate Metrics
  const onlineCount = useMemo(() => activities.filter(a => a.isOnlineNow).length, [activities]);
  const stateOnlineCount = useMemo(() => {
    if (selectedState === 'ALL') return onlineCount;
    return activities.filter(a => a.isOnlineNow && a.stateCode === selectedState).length;
  }, [activities, selectedState, onlineCount]);

  // Simulate a live member ping / new login
  const handleSimulateNewLogin = () => {
    const states = ['GA', 'NC', 'CA', 'TX', 'FL', 'SC', 'VA'];
    const randomState = states[Math.floor(Math.random() * states.length)];
    const names = [
      { name: 'Sister Amara Cole', handle: '@amaracole', role: 'Verified Sister' as const, emoji: '✨' },
      { name: 'Mama Nia Chenzira', handle: '@chenzira_gaia', role: 'State Spearhead' as const, emoji: '🌿' },
      { name: 'Dr. Imani Adebayo', handle: '@drimani', role: 'Sovereign Matriarch' as const, emoji: '👑' },
      { name: 'Sister Faith Williams', handle: '@faithw_atl', role: 'Circle Host' as const, emoji: '☀️' }
    ];
    const picked = names[Math.floor(Math.random() * names.length)];
    const arenas = [
      '🌿 Posted encouragement in The Village Stream',
      '🎙️ Joined Live Circle Casual Corner Audio',
      '🤝 Browsing The Exchange for homeschool books',
      '✨ Cast ballot in Community Poll #105',
      '🛒 Checked into Herbal Apothecary'
    ];
    const pickedArena = arenas[Math.floor(Math.random() * arenas.length)];

    const newActivity: MemberLoginActivity = {
      id: `log-${Date.now()}`,
      name: picked.name,
      handle: picked.handle,
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
      avatarEmoji: picked.emoji,
      stateCode: randomState,
      circleName: `${randomState} Regional Circle`,
      role: picked.role,
      loginTimestamp: 'Just now',
      loginMinutesAgo: 0,
      isOnlineNow: true,
      device: 'iOS App',
      currentArena: pickedArena,
      sessionDurationMins: 1,
      coopStanding: '100% Trust'
    };

    setActivities(prev => [newActivity, ...prev]);
    triggerToast(`🔔 Live Ping: ${picked.name} (${randomState} Circle) just logged into Copper Mommies!`);
  };

  const handleExportCSV = () => {
    const headers = 'ID,Name,Handle,State,Circle,Role,Timestamp,Device,CurrentArena,Standing\n';
    const rows = filteredActivities.map(a => 
      `"${a.id}","${a.name}","${a.handle}","${a.stateCode}","${a.circleName}","${a.role}","${a.loginTimestamp}","${a.device}","${a.currentArena}","${a.coopStanding}"`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `coppermommies_verified_logins_${selectedState}_${Date.now()}.csv`;
    link.click();
    triggerToast('📥 Login activity audit log downloaded successfully!');
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-copper-penny/25 shadow-lg overflow-hidden space-y-0 text-[#1F1813]">
      
      {/* Toast */}
      {toastMessage && (
        <div className="bg-[#1F1813] text-[#D4AF37] px-4 py-2.5 text-xs font-mono font-bold flex items-center justify-between border-b border-[#D4AF37]/40 animate-fade-in">
          <div className="flex items-center space-x-2">
            <span>✨</span>
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-white/60 hover:text-white">✕</button>
        </div>
      )}

      {/* Card Header */}
      <div className="bg-gradient-to-r from-[#1F1813] via-[#2A1E17] to-[#1F1813] text-[#FAF5EE] p-5 sm:p-6 border-b border-[#B87333]/30">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                <Activity className="w-4 h-4" />
              </div>
              <h3 className="font-serif font-black text-lg sm:text-xl text-[#FAF5EE] tracking-tight">
                Verified Member Login Activity &amp; Community Pulse
              </h3>
              <span className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-500/40">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>LIVE FEED</span>
              </span>
            </div>
            <p className="text-xs text-[#FAF5EE]/75 font-sans mt-1 max-w-2xl">
              Real-time monitoring of authenticated matriarchs, state chapter leads, and seeking sisters across regional circles to track engagement and active participation.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleSimulateNewLogin}
              className="px-3.5 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#C5A02E] text-[#1F140E] font-mono text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 shadow-md active:scale-95"
              title="Simulate a real-time verified sister logging in"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simulate Live Login</span>
            </button>
            <button
              type="button"
              onClick={handleExportCSV}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#FAF5EE] border border-white/20 font-mono text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 active:scale-95"
              title="Export current member activity list to CSV"
            >
              <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="hidden sm:inline">Export Audit CSV</span>
            </button>
          </div>
        </div>

        {/* 4 Real-time Engagement Metric Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 font-mono">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
            <div className="flex items-center justify-between text-gray-400 text-[10px] uppercase font-bold">
              <span>Online Now</span>
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-xl font-serif font-black text-emerald-300 mt-1">
              {stateOnlineCount} <span className="text-xs font-mono font-normal text-emerald-400/80">Sisters</span>
            </div>
            <span className="text-[9px] text-gray-400 block mt-0.5">
              {selectedState === 'ALL' ? 'Across all 50 states' : `In ${selectedState} circle`}
            </span>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
            <div className="flex items-center justify-between text-gray-400 text-[10px] uppercase font-bold">
              <span>Today Logins</span>
              <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
            </div>
            <div className="text-xl font-serif font-black text-[#D4AF37] mt-1">
              {filteredActivities.length * 14} <span className="text-xs font-mono font-normal text-[#D4AF37]/80">Sessions</span>
            </div>
            <span className="text-[9px] text-gray-400 block mt-0.5">
              98.4% Verified Identity
            </span>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
            <div className="flex items-center justify-between text-gray-400 text-[10px] uppercase font-bold">
              <span>Active Circle</span>
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-xl font-serif font-black text-amber-200 mt-1">
              {selectedState === 'ALL' ? 'GA & NC' : `${selectedState} Circle`}
            </div>
            <span className="text-[9px] text-gray-400 block mt-0.5">
              Top Engagement Hub
            </span>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
            <div className="flex items-center justify-between text-gray-400 text-[10px] uppercase font-bold">
              <span>Avg Session</span>
              <Clock className="w-3.5 h-3.5 text-copper-penny" />
            </div>
            <div className="text-xl font-serif font-black text-[#FAF5EE] mt-1">
              34m <span className="text-xs font-mono font-normal text-gray-400">/ Sister</span>
            </div>
            <span className="text-[9px] text-gray-400 block mt-0.5">
              High Community Dwell Time
            </span>
          </div>
        </div>
      </div>

      {/* FILTER BAR: STATE CIRCLE SELECTOR & SEARCH */}
      <div className="p-4 sm:p-5 bg-[#FAF5EE] border-b border-copper-penny/20 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* State Circle Dropdown */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center space-x-1.5 bg-white border border-copper-penny/30 rounded-xl px-3 py-1.5 shadow-2xs">
              <MapPin className="w-3.5 h-3.5 text-[#B87333]" />
              <span className="text-xs font-mono font-bold text-[#1F1813]">Filter Circle State:</span>
              <select
                id="admin-login-state-filter"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="bg-transparent text-xs font-mono font-bold text-[#1F1813] focus:outline-none cursor-pointer pl-1"
              >
                {CIRCLE_STATES.map((st) => (
                  <option key={st.code} value={st.code}>
                    {st.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status pills */}
            <div className="flex items-center bg-white border border-copper-penny/30 rounded-xl p-0.5 shadow-2xs font-mono text-xs">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  statusFilter === 'all'
                    ? 'bg-[#1F1813] text-[#D4AF37]'
                    : 'text-[#1F1813]/70 hover:text-[#1F1813]'
                }`}
              >
                All Logins ({activities.length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('online')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                  statusFilter === 'online'
                    ? 'bg-emerald-800 text-white'
                    : 'text-emerald-900 hover:text-emerald-950'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Online Now ({onlineCount})</span>
              </button>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-copper-penny absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search member, handle, arena..."
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-copper-penny/30 rounded-xl text-xs font-sans focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Quick state chips for high activity circles */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] font-mono">
          <span className="text-gray-500 font-bold uppercase text-[9px] mr-1">Quick Circles:</span>
          {['ALL', 'GA', 'NC', 'SC', 'TX', 'CA', 'FL', 'VA', 'NY'].map((stCode) => {
            const isSelected = selectedState === stCode;
            const count = stCode === 'ALL' 
              ? activities.length 
              : activities.filter(a => a.stateCode === stCode).length;

            return (
              <button
                key={stCode}
                type="button"
                onClick={() => setSelectedState(stCode)}
                className={`px-2.5 py-0.5 rounded-lg font-bold transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-[#B87333] text-white border-[#B87333] shadow-xs'
                    : 'bg-white text-[#1F1813]/80 border-copper-penny/25 hover:bg-neutral-100'
                }`}
              >
                {stCode === 'ALL' ? '🌍 All' : stCode} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* MEMBER LOGIN LIST */}
      <div className="divide-y divide-copper-penny/15 overflow-x-auto">
        {filteredActivities.length === 0 ? (
          <div className="p-10 text-center space-y-2">
            <span className="text-3xl">🕊️</span>
            <h4 className="font-serif font-bold text-base text-[#1F1813]">No Login Activity Found in this Circle</h4>
            <p className="text-xs text-soft-sage max-w-md mx-auto font-sans">
              No recent member logins match your current state or search filter. Try resetting the filter to "All 50 States".
            </p>
            <button
              onClick={() => { setSelectedState('ALL'); setSearchQuery(''); setStatusFilter('all'); }}
              className="mt-2 px-4 py-2 bg-[#1F1813] text-[#D4AF37] rounded-xl font-mono text-xs font-bold"
            >
              Reset to All States
            </button>
          </div>
        ) : (
          filteredActivities.map((act) => (
            <div 
              key={act.id} 
              className="p-4 sm:p-5 hover:bg-[#FAF7F2] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3.5"
            >
              {/* Member Profile & Circle Tag */}
              <div className="flex items-center space-x-3.5 min-w-0">
                <div className="relative shrink-0">
                  <div className="w-11 h-11 rounded-2xl overflow-hidden border-2 border-[#D4AF37] ring-1 ring-[#D4AF37]/30 shadow-xs bg-[#FAF5EE]">
                    <img 
                      src={act.avatarUrl} 
                      alt={act.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  {act.isOnlineNow && (
                    <span 
                      className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white ring-1 ring-emerald-600 animate-pulse" 
                      title="Online Now in Sanctuary"
                    />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <h5 className="font-serif font-extrabold text-sm text-[#1F1813] hover:text-copper-penny cursor-pointer">
                      {act.name}
                    </h5>
                    <span className="text-xs text-soft-sage font-mono">
                      {act.handle}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.2 rounded-full text-[9px] font-mono font-bold bg-[#D4AF37]/20 text-amber-950 border border-[#D4AF37]/40">
                      <ShieldCheck className="w-2.5 h-2.5 mr-0.5 text-copper-penny" />
                      {act.role}
                    </span>
                  </div>

                  {/* Active Arena & Device */}
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-xs text-[#1F1813]/90 font-medium font-sans">
                      {act.currentArena}
                    </span>
                  </div>

                  <div className="mt-0.5 flex items-center space-x-2 text-[10px] font-mono text-soft-sage">
                    <span className="flex items-center space-x-1 text-[#B87333] font-bold">
                      <MapPin className="w-3 h-3" />
                      <span>{act.circleName}</span>
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center space-x-1">
                      {act.device.includes('iOS') || act.device.includes('Android') || act.device.includes('Mobile') ? (
                        <Smartphone className="w-3 h-3 text-gray-400" />
                      ) : (
                        <Laptop className="w-3 h-3 text-gray-400" />
                      )}
                      <span>{act.device}</span>
                    </span>
                    <span>&bull;</span>
                    <span className="text-emerald-700 font-bold">{act.coopStanding}</span>
                  </div>
                </div>
              </div>

              {/* Timestamp & Quick Admin Action */}
              <div className="flex items-center justify-between md:justify-end space-x-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-copper-penny/10">
                <div className="text-left md:text-right font-mono">
                  <div className="flex items-center space-x-1 md:justify-end text-xs font-bold text-[#1F1813]">
                    <Clock className="w-3 h-3 text-copper-penny" />
                    <span>{act.loginTimestamp}</span>
                  </div>
                  <span className="text-[10px] text-gray-500 block">
                    Session: {act.sessionDurationMins} min active
                  </span>
                </div>

                <div className="flex items-center space-x-1.5">
                  <button
                    type="button"
                    onClick={() => triggerToast(`💌 Sent Sisterhood Encouragement to ${act.name} in ${act.circleName}!`)}
                    className="p-2 rounded-xl bg-white hover:bg-neutral-100 text-copper-penny border border-copper-penny/25 shadow-2xs transition-all cursor-pointer"
                    title={`Send Sister Encouragement Ping to ${act.name}`}
                  >
                    <Heart className="w-3.5 h-3.5 text-[#B87333]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => triggerToast(`🔎 Opening session audit ledger for ${act.handle}...`)}
                    className="px-2.5 py-1.5 rounded-xl bg-[#1F1813] hover:bg-[#2A221B] text-[#D4AF37] font-mono text-[10px] font-bold transition-all cursor-pointer shadow-2xs flex items-center space-x-1"
                    title={`Inspect session audit for ${act.name}`}
                  >
                    <span>Inspect</span>
                  </button>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

      {/* Card Footer */}
      <div className="bg-[#FAF5EE] px-5 py-3 border-t border-copper-penny/20 flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono text-soft-sage gap-2">
        <div className="flex items-center space-x-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Showing {filteredActivities.length} verified member sessions • Automatic heartbeat sync active</span>
        </div>
        <div className="text-[10px] text-gray-500">
          Last refreshed: Just now &bull; Encrypted TLS 1.3
        </div>
      </div>

    </div>
  );
}
