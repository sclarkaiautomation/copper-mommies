import React, { useState, useMemo } from 'react';
import { 
  Users, 
  MapPin, 
  Search, 
  Filter, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  Smartphone, 
  Laptop, 
  Activity, 
  ShieldCheck, 
  RefreshCw, 
  ArrowUpRight,
  TrendingUp,
  Radio,
  Flame,
  Award
} from 'lucide-react';

export interface MemberLoginLog {
  id: string;
  memberId: string;
  memberName: string;
  memberAvatar: string;
  memberEmail: string;
  role: 'admin' | 'spearhead' | 'sovereign_matriarch' | 'homestead_pillar' | 'verified_mother';
  stateCode: string;
  stateName: string;
  city: string;
  loginTime: string;
  loginTimestamp: number;
  deviceType: 'ios' | 'android' | 'desktop';
  platformLabel: string;
  lastAction: string;
  actionCategory: 'stream' | 'exchange' | 'academy' | 'gathering' | 'apothecary' | 'chats';
  isOnlineNow: boolean;
  engagementScore: number;
}

export const INITIAL_MEMBER_LOGINS: MemberLoginLog[] = [
  {
    id: 'log-01',
    memberId: 'mem-01',
    memberName: 'Mama Shantrece',
    memberAvatar: '/coppermommies-selflove1-cmc.jpg',
    memberEmail: 'shantrecetogetherwewin@gmail.com',
    role: 'admin',
    stateCode: 'GA',
    stateName: 'Georgia Circle',
    city: 'Atlanta',
    loginTime: '2 mins ago',
    loginTimestamp: Date.now() - 2 * 60 * 1000,
    deviceType: 'desktop',
    platformLabel: 'Desktop Chrome • MacOS',
    lastAction: 'Reviewed and moderated Sovereign Vetting Queue',
    actionCategory: 'stream',
    isOnlineNow: true,
    engagementScore: 99
  },
  {
    id: 'log-02',
    memberId: 'mem-02',
    memberName: 'Mama Keisha Vance',
    memberAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    memberEmail: 'keisha.vance@example.com',
    role: 'spearhead',
    stateCode: 'SC',
    stateName: 'South Carolina Circle',
    city: 'Charleston',
    loginTime: '8 mins ago',
    loginTimestamp: Date.now() - 8 * 60 * 1000,
    deviceType: 'ios',
    platformLabel: 'Mobile Safari • iOS 19 PWA',
    lastAction: 'Shared elderberry tonic recipe in Village Stream',
    actionCategory: 'stream',
    isOnlineNow: true,
    engagementScore: 96
  },
  {
    id: 'log-03',
    memberId: 'mem-03',
    memberName: 'Mama Danielle Henderson',
    memberAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    memberEmail: 'danielle.h@example.com',
    role: 'homestead_pillar',
    stateCode: 'NC',
    stateName: 'North Carolina Circle',
    city: 'Charlotte',
    loginTime: '17 mins ago',
    loginTimestamp: Date.now() - 17 * 60 * 1000,
    deviceType: 'android',
    platformLabel: 'Mobile Chrome • Android 16',
    lastAction: 'Listed Heirloom Seminole Squash Seeds on The Exchange',
    actionCategory: 'exchange',
    isOnlineNow: true,
    engagementScore: 92
  },
  {
    id: 'log-04',
    memberId: 'mem-04',
    memberName: 'Sister Nia Imani',
    memberAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    memberEmail: 'nia.imani@example.com',
    role: 'sovereign_matriarch',
    stateCode: 'TX',
    stateName: 'Texas Circle',
    city: 'Houston',
    loginTime: '34 mins ago',
    loginTimestamp: Date.now() - 34 * 60 * 1000,
    deviceType: 'ios',
    platformLabel: 'Mobile Web • iPhone 17',
    lastAction: 'RSVP’d to The Casual Corner Talk live circle',
    actionCategory: 'gathering',
    isOnlineNow: true,
    engagementScore: 88
  },
  {
    id: 'log-05',
    memberId: 'mem-05',
    memberName: 'Grandmother Bessie Mae',
    memberAvatar: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&w=200&q=80',
    memberEmail: 'bessie.mae@example.com',
    role: 'spearhead',
    stateCode: 'SC',
    stateName: 'South Carolina Circle',
    city: 'Columbia',
    loginTime: '1 hour ago',
    loginTimestamp: Date.now() - 60 * 60 * 1000,
    deviceType: 'desktop',
    platformLabel: 'Desktop Firefox • Windows 11',
    lastAction: 'Answered mother inquiry regarding postpartum root tea',
    actionCategory: 'stream',
    isOnlineNow: false,
    engagementScore: 95
  },
  {
    id: 'log-06',
    memberId: 'mem-06',
    memberName: 'Sister Althea Vance',
    memberAvatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=200&q=80',
    memberEmail: 'althea.vance@example.com',
    role: 'verified_mother',
    stateCode: 'VA',
    stateName: 'Virginia Circle',
    city: 'Richmond',
    loginTime: '1 hour ago',
    loginTimestamp: Date.now() - 75 * 60 * 1000,
    deviceType: 'ios',
    platformLabel: 'Mobile Safari • iOS 19',
    lastAction: 'Saved Montessori Homeschool Book Bundle to Bookmarks',
    actionCategory: 'academy',
    isOnlineNow: false,
    engagementScore: 84
  },
  {
    id: 'log-07',
    memberId: 'mem-07',
    memberName: 'Mama Jamila Harris',
    memberAvatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=200&q=80',
    memberEmail: 'jamila.harris@example.com',
    role: 'spearhead',
    stateCode: 'GA',
    stateName: 'Georgia Circle',
    city: 'Decatur',
    loginTime: '2 hours ago',
    loginTimestamp: Date.now() - 120 * 60 * 1000,
    deviceType: 'ios',
    platformLabel: 'Mobile Web • iPhone 16 Pro',
    lastAction: 'Confirmed cooperative time bank handshake with Sister Nia',
    actionCategory: 'exchange',
    isOnlineNow: false,
    engagementScore: 97
  },
  {
    id: 'log-08',
    memberId: 'mem-08',
    memberName: 'Sister Clara Jenkins',
    memberAvatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=200&q=80',
    memberEmail: 'clara.jenkins@example.com',
    role: 'homestead_pillar',
    stateCode: 'AL',
    stateName: 'Alabama Circle',
    city: 'Birmingham',
    loginTime: '3 hours ago',
    loginTimestamp: Date.now() - 180 * 60 * 1000,
    deviceType: 'android',
    platformLabel: 'Mobile Chrome • Galaxy S25',
    lastAction: 'Offered poultry incubation pod advice in Co-Op Hub',
    actionCategory: 'stream',
    isOnlineNow: false,
    engagementScore: 91
  },
  {
    id: 'log-09',
    memberId: 'mem-09',
    memberName: 'Mama Keisha Boyce',
    memberAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    memberEmail: 'keisha.b@example.com',
    role: 'sovereign_matriarch',
    stateCode: 'MD',
    stateName: 'Maryland Circle',
    city: 'Bowie',
    loginTime: '4 hours ago',
    loginTimestamp: Date.now() - 240 * 60 * 1000,
    deviceType: 'desktop',
    platformLabel: 'Desktop Chrome • Windows 11',
    lastAction: 'Registered Herbal Tincture Business in Sponsor Ad Portal',
    actionCategory: 'apothecary',
    isOnlineNow: false,
    engagementScore: 89
  },
  {
    id: 'log-10',
    memberId: 'mem-10',
    memberName: 'Sister Brenda Cole',
    memberAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    memberEmail: 'brenda.cole@example.com',
    role: 'verified_mother',
    stateCode: 'CA',
    stateName: 'California Circle',
    city: 'Oakland',
    loginTime: '5 hours ago',
    loginTimestamp: Date.now() - 300 * 60 * 1000,
    deviceType: 'ios',
    platformLabel: 'Mobile Safari • iPadOS 19',
    lastAction: 'Completed Chapter 2 in Mothers Academy & Her-Story',
    actionCategory: 'academy',
    isOnlineNow: false,
    engagementScore: 86
  },
  {
    id: 'log-11',
    memberId: 'mem-11',
    memberName: 'Sister Maya Townsend',
    memberAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80',
    memberEmail: 'maya.townsend@example.com',
    role: 'verified_mother',
    stateCode: 'FL',
    stateName: 'Florida Circle',
    city: 'Jacksonville',
    loginTime: '6 hours ago',
    loginTimestamp: Date.now() - 360 * 60 * 1000,
    deviceType: 'android',
    platformLabel: 'Mobile Chrome • Android 16',
    lastAction: 'Sent direct private message to Sister Danielle regarding barter',
    actionCategory: 'chats',
    isOnlineNow: false,
    engagementScore: 83
  },
  {
    id: 'log-12',
    memberId: 'mem-12',
    memberName: 'Sister Tamara Ross',
    memberAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    memberEmail: 'tamara.ross@example.com',
    role: 'verified_mother',
    stateCode: 'GA',
    stateName: 'Georgia Circle',
    city: 'Savannah',
    loginTime: '8 hours ago',
    loginTimestamp: Date.now() - 480 * 60 * 1000,
    deviceType: 'ios',
    platformLabel: 'Mobile Web • iPhone 16',
    lastAction: 'Claimed free wooden bassinet on The Exchange',
    actionCategory: 'exchange',
    isOnlineNow: false,
    engagementScore: 87
  }
];

interface AdminMemberLoginActivityCardProps {
  onSendMessage?: (memberName: string) => void;
  onFilterStateChange?: (stateCode: string) => void;
}

export default function AdminMemberLoginActivityCard({
  onSendMessage,
  onFilterStateChange
}: AdminMemberLoginActivityCardProps) {
  const [logs, setLogs] = useState<MemberLoginLog[]>(INITIAL_MEMBER_LOGINS);
  const [selectedStateFilter, setSelectedStateFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const handleStateFilterChange = (state: string) => {
    setSelectedStateFilter(state);
    onFilterStateChange?.(state);
  };

  // State Circles Summary
  const stateSummary = useMemo(() => {
    const counts: Record<string, number> = {};
    logs.forEach(l => {
      counts[l.stateCode] = (counts[l.stateCode] || 0) + 1;
    });
    return counts;
  }, [logs]);

  // Filtered Logs
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesState = selectedStateFilter === 'ALL' || log.stateCode === selectedStateFilter;
      const matchesRole = roleFilter === 'ALL' || log.role === roleFilter;
      const matchesSearch = 
        log.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.memberEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.lastAction.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesState && matchesRole && matchesSearch;
    });
  }, [logs, selectedStateFilter, roleFilter, searchQuery]);

  // KPI Calculations
  const onlineCount = useMemo(() => logs.filter(l => l.isOnlineNow).length, [logs]);
  const activeTodayCount = logs.length;
  const topEngagingState = 'GA (Georgia Circle)';

  const availableStates = [
    { code: 'ALL', name: 'All State Circles' },
    { code: 'GA', name: 'Georgia (GA)' },
    { code: 'SC', name: 'South Carolina (SC)' },
    { code: 'NC', name: 'North Carolina (NC)' },
    { code: 'TX', name: 'Texas (TX)' },
    { code: 'MD', name: 'Maryland (MD)' },
    { code: 'VA', name: 'Virginia (VA)' },
    { code: 'AL', name: 'Alabama (AL)' },
    { code: 'CA', name: 'California (CA)' },
    { code: 'FL', name: 'Florida (FL)' }
  ];

  return (
    <div className="bg-[#180E08]/95 border-2 border-[#D4AF37]/50 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6 text-[#FAF5EE]">
      {/* Top Header & Live Counter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center space-x-2.5">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#B87333] to-[#D4AF37] text-[#1F140E] flex items-center justify-center font-bold text-sm shadow-md">
              <Activity className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-serif font-black text-lg sm:text-xl text-[#FAF5EE] tracking-tight">
                Verified Members Recent Login Activity
              </h3>
              <p className="text-xs font-mono text-[#FAF5EE]/70">
                Real-time sovereign sisterhood logins &amp; community engagement monitor
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <div className="px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold flex items-center space-x-2 shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span>{onlineCount} Sisters Online Now</span>
          </div>

          <button
            onClick={handleRefresh}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-[#D4AF37] transition-all cursor-pointer"
            title="Refresh login stream"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Engagement KPI Highlight Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
        <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl space-y-1">
          <span className="text-[10px] uppercase font-bold text-[#FAF5EE]/60 block flex items-center space-x-1">
            <Radio className="w-3 h-3 text-emerald-400" />
            <span>Active Today</span>
          </span>
          <div className="text-2xl font-serif font-black text-[#FAF5EE]">{activeTodayCount} Sisters</div>
          <span className="text-[9px] text-emerald-400 block font-sans">100% PMA Verified Matriarchs</span>
        </div>

        <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl space-y-1">
          <span className="text-[10px] uppercase font-bold text-[#FAF5EE]/60 block flex items-center space-x-1">
            <Flame className="w-3 h-3 text-[#D4AF37]" />
            <span>Top State Circle</span>
          </span>
          <div className="text-xl font-serif font-black text-[#D4AF37] truncate">{topEngagingState}</div>
          <span className="text-[9px] text-[#FAF5EE]/70 block font-sans">92% Weekly Return Rate</span>
        </div>

        <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl space-y-1">
          <span className="text-[10px] uppercase font-bold text-[#FAF5EE]/60 block flex items-center space-x-1">
            <Clock className="w-3 h-3 text-amber-300" />
            <span>Avg Session Time</span>
          </span>
          <div className="text-2xl font-serif font-black text-[#FAF5EE]">38.5 mins</div>
          <span className="text-[9px] text-amber-300 block font-sans">High Authentic Engagement</span>
        </div>

        <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl space-y-1">
          <span className="text-[10px] uppercase font-bold text-[#FAF5EE]/60 block flex items-center space-x-1">
            <TrendingUp className="w-3 h-3 text-emerald-400" />
            <span>Reciprocal Activity</span>
          </span>
          <div className="text-2xl font-serif font-black text-emerald-300">89% Action Rate</div>
          <span className="text-[9px] text-[#FAF5EE]/70 block font-sans">Post, trade or class review</span>
        </div>
      </div>

      {/* State Filter Controls & Search */}
      <div className="space-y-3 pt-1">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Quick Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#D4AF37] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search member name, email, city, or touchpoint..."
              className="w-full pl-9 pr-3 py-2 bg-white/10 border border-white/20 rounded-xl text-xs font-sans text-white focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* State Dropdown Selector */}
          <div className="flex items-center space-x-2 shrink-0">
            <div className="flex items-center space-x-1.5 bg-[#FAF5EE]/10 border border-white/20 px-3 py-2 rounded-xl text-xs font-mono">
              <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="text-[10px] uppercase text-[#FAF5EE]/60 font-bold">State Circle:</span>
              <select
                value={selectedStateFilter}
                onChange={(e) => handleStateFilterChange(e.target.value)}
                className="bg-transparent border-none text-xs font-bold text-[#D4AF37] focus:outline-none cursor-pointer"
              >
                {availableStates.map(st => (
                  <option key={st.code} value={st.code} className="bg-[#1F140E] text-white">
                    {st.name} {st.code !== 'ALL' && `(${stateSummary[st.code] || 0})`}
                  </option>
                ))}
              </select>
            </div>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-white/10 border border-white/20 text-[#FAF5EE] text-xs font-mono font-bold rounded-xl px-2.5 py-2 cursor-pointer focus:outline-none"
            >
              <option value="ALL" className="bg-[#1F140E]">All Roles</option>
              <option value="admin" className="bg-[#1F140E]">Founder / Admin</option>
              <option value="spearhead" className="bg-[#1F140E]">Circle Spearhead</option>
              <option value="sovereign_matriarch" className="bg-[#1F140E]">Sovereign Matriarch</option>
              <option value="homestead_pillar" className="bg-[#1F140E]">Homestead Pillar</option>
              <option value="verified_mother" className="bg-[#1F140E]">Verified Mother</option>
            </select>
          </div>
        </div>

        {/* State Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px] font-mono">
          <span className="text-[10px] text-gray-400 uppercase font-bold shrink-0">Filter by Circle:</span>
          {availableStates.map(st => {
            const count = st.code === 'ALL' ? logs.length : (stateSummary[st.code] || 0);
            const isSelected = selectedStateFilter === st.code;
            return (
              <button
                key={st.code}
                type="button"
                onClick={() => handleStateFilterChange(st.code)}
                className={`px-2.5 py-1 rounded-xl font-bold transition-all shrink-0 cursor-pointer flex items-center space-x-1.5 ${
                  isSelected 
                    ? 'bg-[#D4AF37] text-[#1F140E] shadow-sm font-black' 
                    : 'bg-white/10 hover:bg-white/15 text-white/80 border border-white/10'
                }`}
              >
                <span>{st.code === 'ALL' ? '🌍 All' : st.code}</span>
                <span className={`text-[9px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-black/20 text-[#1F140E]' : 'bg-black/30 text-white/70'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Member Activity Table / Roster */}
      <div className="border border-white/15 rounded-2xl overflow-hidden bg-black/30">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-white/10 border-b border-white/15 text-[10px] uppercase tracking-wider text-[#FAF5EE]/70">
              <tr>
                <th className="py-3 px-4">Verified Sister</th>
                <th className="py-3 px-3">State Circle</th>
                <th className="py-3 px-3">Recent Login</th>
                <th className="py-3 px-3">Device &amp; Platform</th>
                <th className="py-3 px-4">Last Community Action</th>
                <th className="py-3 px-3 text-right">Engagement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-white/60 font-sans">
                    No verified member logins matching the selected state circle or search filter.
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => {
                  return (
                    <tr 
                      key={log.id}
                      className="hover:bg-white/5 transition-colors group"
                    >
                      {/* Member Identity & Status */}
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-[#D4AF37] shadow-xs shrink-0">
                            <img 
                              src={log.memberAvatar} 
                              alt={log.memberName} 
                              className="w-full h-full object-cover" 
                            />
                            {log.isOnlineNow && (
                              <span 
                                className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white ring-1 ring-emerald-600" 
                                title="Active Online Now"
                              />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="font-serif font-bold text-sm text-[#FAF5EE] flex items-center space-x-1.5">
                              <span className="truncate">{log.memberName}</span>
                              {log.role === 'admin' && (
                                <span className="text-[9px] bg-amber-400 text-black px-1.5 py-0.2 rounded font-mono font-bold">
                                  Lead
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-[#FAF5EE]/60 font-mono truncate">
                              {log.memberEmail}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* State Circle */}
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-xl text-[10px] font-bold bg-[#FAF5EE]/10 border border-white/20 text-[#D4AF37]">
                          <MapPin className="w-3 h-3" />
                          <span>{log.stateCode} &bull; {log.city}</span>
                        </span>
                      </td>

                      {/* Login Timestamp */}
                      <td className="py-3 px-3">
                        <div className="flex items-center space-x-1.5">
                          <Clock className="w-3.5 h-3.5 text-soft-sage shrink-0" />
                          <span className={`font-bold ${log.isOnlineNow ? 'text-emerald-400 font-bold' : 'text-[#FAF5EE]/80'}`}>
                            {log.loginTime}
                          </span>
                        </div>
                        {log.isOnlineNow && (
                          <span className="text-[9px] text-emerald-400/90 font-sans block">
                            ● Active in session
                          </span>
                        )}
                      </td>

                      {/* Platform & Device */}
                      <td className="py-3 px-3">
                        <div className="flex items-center space-x-1.5 text-[#FAF5EE]/80">
                          {log.deviceType === 'desktop' ? (
                            <Laptop className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                          ) : (
                            <Smartphone className="w-3.5 h-3.5 text-copper-penny shrink-0" />
                          )}
                          <span className="text-[11px] font-sans truncate max-w-[150px]">
                            {log.platformLabel}
                          </span>
                        </div>
                      </td>

                      {/* Last Action Touchpoint */}
                      <td className="py-3 px-4">
                        <div className="text-xs font-sans text-white/90 line-clamp-1">
                          {log.lastAction}
                        </div>
                        <span className="text-[9px] text-[#D4AF37]/90 font-mono uppercase">
                          Touchpoint: {log.actionCategory}
                        </span>
                      </td>

                      {/* Engagement Score & Quick Action */}
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
                            {log.engagementScore}%
                          </span>
                          <button
                            type="button"
                            onClick={() => onSendMessage?.(log.memberName)}
                            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#D4AF37] cursor-pointer transition-all"
                            title={`Send direct sister care message to ${log.memberName}`}
                          >
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Insight */}
      <div className="flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-[#FAF5EE]/70 pt-2 border-t border-white/10">
        <span className="flex items-center space-x-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Sovereign PMA Privacy: Access records are visible strictly to verified circle administrators.</span>
        </span>
        <span className="text-[10px] text-[#D4AF37] font-bold mt-1 sm:mt-0">
          Showing {filteredLogs.length} of {logs.length} Total Sessions
        </span>
      </div>
    </div>
  );
}
