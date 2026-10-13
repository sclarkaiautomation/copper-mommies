import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Shield, 
  MapPin, 
  Award, 
  AlertTriangle, 
  CheckCircle2, 
  MoreVertical, 
  Phone, 
  Mail, 
  Clock, 
  Coins, 
  UserCheck, 
  UserX, 
  ShieldAlert,
  Edit3,
  Sparkles,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

export interface VillageMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  stateCode: string;
  stateName: string;
  role: 'member' | 'spearhead' | 'grandmother_council' | 'admin';
  status: 'active_good_standing' | 'under_review' | 'suspended_breach';
  joinedDate: string;
  barterHoursBalance: number;
  tradesCompleted: number;
  strikesCount: number;
  lastIncidentNote?: string;
  bioSnippet: string;
}

export interface StateChapterLead {
  stateCode: string;
  stateName: string;
  leadSisterName: string;
  leadEmail: string;
  leadPhone: string;
  memberCount: number;
  status: 'active_thriving' | 'forming_circle' | 'spearhead_needed';
}

const INITIAL_MEMBERS: VillageMember[] = [
  {
    id: 'mem-01',
    name: 'Mama Shantrece',
    email: 'shantrece@coppermommies.org',
    phone: '(404) 555-0101',
    stateCode: 'GA',
    stateName: 'Georgia (Atlanta Circle)',
    role: 'admin',
    status: 'active_good_standing',
    joinedDate: '2026-01-01',
    barterHoursBalance: 42,
    tradesCompleted: 28,
    strikesCount: 0,
    bioSnippet: 'Founder Trustee, Herbal compounder, and spiritual anchor for sovereign families.'
  },
  {
    id: 'mem-02',
    name: 'Mama Keisha Vance',
    email: 'keisha.v@example.com',
    phone: '(843) 555-0142',
    stateCode: 'SC',
    stateName: 'South Carolina (Charleston Circle)',
    role: 'spearhead',
    status: 'active_good_standing',
    joinedDate: '2026-02-14',
    barterHoursBalance: 19,
    tradesCompleted: 14,
    strikesCount: 0,
    bioSnippet: 'Charleston Circle Lead, Postpartum Doula & Traditional Bengkung belly binding practitioner.'
  },
  {
    id: 'mem-03',
    name: 'Mama Danielle Henderson',
    email: 'danielle.h@example.com',
    phone: '(704) 555-0188',
    stateCode: 'NC',
    stateName: 'North Carolina (Charlotte Circle)',
    role: 'spearhead',
    status: 'active_good_standing',
    joinedDate: '2026-03-02',
    barterHoursBalance: 24,
    tradesCompleted: 18,
    strikesCount: 0,
    bioSnippet: 'Asheville & Charlotte Homestead Coordinator, Seed preservation & compost master.'
  },
  {
    id: 'mem-04',
    name: 'Grandmother Evelyn Wright',
    email: 'evelyn.w@example.com',
    phone: '(404) 555-0199',
    stateCode: 'GA',
    stateName: 'Georgia (Atlanta Circle)',
    role: 'grandmother_council',
    status: 'active_good_standing',
    joinedDate: '2026-01-10',
    barterHoursBalance: 35,
    tradesCompleted: 31,
    strikesCount: 0,
    bioSnippet: 'Grandmother Council Elder, Lineage genealogist and dispute peacemaker.'
  },
  {
    id: 'mem-05',
    name: 'Sister Maya Linwood',
    email: 'maya.l@example.com',
    phone: '(510) 555-0122',
    stateCode: 'CA',
    stateName: 'California (Oakland Circle)',
    role: 'spearhead',
    status: 'active_good_standing',
    joinedDate: '2026-04-12',
    barterHoursBalance: 12,
    tradesCompleted: 9,
    strikesCount: 0,
    bioSnippet: 'Oakland Chapter Spearhead, Organic tincture crafter and community pantry manager.'
  },
  {
    id: 'mem-06',
    name: 'Sister Candace Miller',
    email: 'candace.m@example.com',
    phone: '(713) 555-0165',
    stateCode: 'TX',
    stateName: 'Texas (Houston Circle)',
    role: 'member',
    status: 'under_review',
    joinedDate: '2026-07-15',
    barterHoursBalance: 2,
    tradesCompleted: 3,
    strikesCount: 1,
    lastIncidentNote: 'Disputed homeschool workbook barter trade on 2026-09-02; resolving delivery with partner.',
    bioSnippet: 'Homeschooling mother of 3 exploring homesteading and natural birth.'
  }
];

const INITIAL_CHAPTER_LEADS: StateChapterLead[] = [
  { stateCode: 'GA', stateName: 'Georgia', leadSisterName: 'Mama Shantrece', leadEmail: 'shantrece@coppermommies.org', leadPhone: '(404) 555-0101', memberCount: 142, status: 'active_thriving' },
  { stateCode: 'SC', stateName: 'South Carolina', leadSisterName: 'Mama Keisha Vance', leadEmail: 'keisha.v@example.com', leadPhone: '(843) 555-0142', memberCount: 68, status: 'active_thriving' },
  { stateCode: 'NC', stateName: 'North Carolina', leadSisterName: 'Mama Danielle Henderson', leadEmail: 'danielle.h@example.com', leadPhone: '(704) 555-0188', memberCount: 74, status: 'active_thriving' },
  { stateCode: 'CA', stateName: 'California', leadSisterName: 'Sister Maya Linwood', leadEmail: 'maya.l@example.com', leadPhone: '(510) 555-0122', memberCount: 89, status: 'active_thriving' },
  { stateCode: 'TX', stateName: 'Texas', leadSisterName: 'Mama Rene Houston', leadEmail: 'rene.h@example.com', leadPhone: '(713) 555-0176', memberCount: 95, status: 'active_thriving' },
  { stateCode: 'MD', stateName: 'Maryland', leadSisterName: 'Sister Nia Baltimore', leadEmail: 'nia.b@example.com', leadPhone: '(410) 555-0155', memberCount: 52, status: 'active_thriving' },
  { stateCode: 'FL', stateName: 'Florida', leadSisterName: 'Sister Amara Miami', leadEmail: 'amara.m@example.com', leadPhone: '(305) 555-0134', memberCount: 46, status: 'forming_circle' },
  { stateCode: 'NY', stateName: 'New York', leadSisterName: 'Sister Tamara Brooklyn', leadEmail: 'tamara.b@example.com', leadPhone: '(718) 555-0190', memberCount: 63, status: 'active_thriving' },
  { stateCode: 'AL', stateName: 'Alabama', leadSisterName: 'Spearhead Position Open', leadEmail: 'admin@coppermommies.org', leadPhone: '(404) 555-0101', memberCount: 28, status: 'spearhead_needed' }
];

export default function AdminMemberDirectory() {
  const [activeSubTab, setActiveSubTab] = useState<'roster' | 'spearheads' | 'safety'>('roster');
  const [members, setMembers] = useState<VillageMember[]>(() => {
    try {
      const stored = localStorage.getItem('copper_village_members');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const ids = new Set(parsed.map((p: any) => p.id));
          return [...parsed, ...INITIAL_MEMBERS.filter(m => !ids.has(m.id))];
        }
      }
    } catch (e) {
      console.warn('Could not parse stored members', e);
    }
    return INITIAL_MEMBERS;
  });
  const [chapters, setChapters] = useState<StateChapterLead[]>(INITIAL_CHAPTER_LEADS);

  useEffect(() => {
    const handleSync = () => {
      try {
        const stored = localStorage.getItem('copper_village_members');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const ids = new Set(parsed.map((p: any) => p.id));
            setMembers([...parsed, ...INITIAL_MEMBERS.filter(m => !ids.has(m.id))]);
          }
        }
      } catch (e) {
        console.warn('Sync failed', e);
      }
    };
    window.addEventListener('copper-members-updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('copper-members-updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  // Search and filter
  const [searchTerm, setSearchTerm] = useState('');
  const [stateFilter, setStateFilter] = useState('ALL');
  const [roleFilter, setRoleFilter] = useState('ALL');

  // Selected member for detail / editing modal
  const [selectedMember, setSelectedMember] = useState<VillageMember | null>(null);

  const filteredMembers = members.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          m.stateName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesState = stateFilter === 'ALL' || m.stateCode === stateFilter;
    const matchesRole = roleFilter === 'ALL' || m.role === roleFilter;
    return matchesSearch && matchesState && matchesRole;
  });

  const handleUpdateStatus = (id: string, newStatus: VillageMember['status']) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, status: newStatus } : m));
    if (selectedMember && selectedMember.id === id) {
      setSelectedMember(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const handleUpdateRole = (id: string, newRole: VillageMember['role']) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, role: newRole } : m));
    if (selectedMember && selectedMember.id === id) {
      setSelectedMember(prev => prev ? { ...prev, role: newRole } : null);
    }
  };

  const handleAddStrikeNote = (id: string) => {
    const note = prompt('Enter confidential incident or moderation note:');
    if (!note) return;
    setMembers(prev => prev.map(m => {
      if (m.id !== id) return m;
      return {
        ...m,
        strikesCount: m.strikesCount + 1,
        lastIncidentNote: `[${new Date().toISOString().slice(0, 10)}] ${note}`,
        status: m.strikesCount >= 2 ? 'suspended_breach' : 'under_review'
      };
    }));
    alert('⚠️ Disciplinary incident recorded and member status updated.');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#1E1712] via-[#2D2119] to-[#150F0B] text-[#FAF5EE] p-6 rounded-3xl border-2 border-amber-500/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 font-mono text-xs uppercase font-extrabold mb-1">
            <Users className="w-4 h-4" />
            <span>Matriarch Registry &amp; Autonomous Governance</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#FAF5EE]">
            Master Member Directory &amp; Safety Moderation
          </h3>
          <p className="text-xs sm:text-sm text-[#FAF5EE]/80 mt-1 max-w-2xl">
            Oversee all verified mothers in good standing, designate 50-state chapter spearhead coordinators, and enforce village community safety standards.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <span className="px-3.5 py-1.5 rounded-xl bg-amber-950/80 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold">
            {members.length} Active Verified Mothers
          </span>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-copper-penny/20 pb-3">
        <button
          onClick={() => setActiveSubTab('roster')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
            activeSubTab === 'roster'
              ? 'bg-amber-900 text-white shadow-md'
              : 'bg-white/80 text-[#2A221B] hover:bg-white border border-copper-penny/20'
          }`}
        >
          👥 Master Member Roster ({members.length})
        </button>

        <button
          onClick={() => setActiveSubTab('spearheads')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
            activeSubTab === 'spearheads'
              ? 'bg-amber-900 text-white shadow-md'
              : 'bg-white/80 text-[#2A221B] hover:bg-white border border-copper-penny/20'
          }`}
        >
          📍 50-State Spearhead Matrix ({chapters.length} Circles)
        </button>

        <button
          onClick={() => setActiveSubTab('safety')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
            activeSubTab === 'safety'
              ? 'bg-amber-900 text-white shadow-md'
              : 'bg-white/80 text-[#2A221B] hover:bg-white border border-copper-penny/20'
          }`}
        >
          🛡️ Moderation &amp; Safety Desk ({members.filter(m => m.status !== 'active_good_standing').length} Flagged)
        </button>
      </div>

      {/* SUB-TAB 1: MASTER MEMBER ROSTER */}
      {activeSubTab === 'roster' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-3 text-[#2A221B]/40" />
              <input
                type="text"
                placeholder="Search member name, email, or city..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-white rounded-xl border border-copper-penny/20 focus:outline-none focus:ring-2 focus:ring-amber-500 font-sans"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <select
                value={stateFilter}
                onChange={e => setStateFilter(e.target.value)}
                className="text-xs bg-white rounded-xl border border-copper-penny/20 px-3 py-2 font-mono"
              >
                <option value="ALL">All States</option>
                <option value="GA">Georgia (GA)</option>
                <option value="SC">South Carolina (SC)</option>
                <option value="NC">North Carolina (NC)</option>
                <option value="CA">California (CA)</option>
                <option value="TX">Texas (TX)</option>
              </select>

              <select
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value)}
                className="text-xs bg-white rounded-xl border border-copper-penny/20 px-3 py-2 font-mono"
              >
                <option value="ALL">All Roles</option>
                <option value="member">Mothers (Members)</option>
                <option value="spearhead">State Spearheads</option>
                <option value="grandmother_council">Grandmother Council</option>
                <option value="admin">Trustee Admins</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMembers.map(member => (
              <div 
                key={member.id}
                className="bg-white rounded-3xl p-5 border border-copper-penny/20 shadow-sm flex flex-col justify-between space-y-3 hover:border-amber-500/50 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        member.role === 'admin' ? 'bg-purple-100 text-purple-900 border border-purple-300' :
                        member.role === 'grandmother_council' ? 'bg-[#D4AF37]/20 text-[#B87333] border border-[#D4AF37]/40' :
                        member.role === 'spearhead' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                        'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      }`}>
                        {member.role.replace('_', ' ')}
                      </span>
                      <h4 className="font-serif font-bold text-base text-[#1F1813] mt-1">{member.name}</h4>
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold ${
                      member.status === 'active_good_standing' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      member.status === 'under_review' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {member.status === 'active_good_standing' ? '● Good Standing' : member.status === 'under_review' ? '⏳ Under Review' : '⚠️ Suspended'}
                    </span>
                  </div>

                  <p className="text-[11px] font-mono text-[#2A221B]/70 flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-copper-penny" />
                    <span>{member.stateName}</span>
                  </p>

                  <p className="text-xs text-[#2A221B]/80 font-sans line-clamp-2 italic">
                    "{member.bioSnippet}"
                  </p>

                  <div className="bg-[#FAF5EE] p-2.5 rounded-2xl border border-copper-penny/10 grid grid-cols-2 gap-2 text-[11px] font-mono">
                    <div>
                      <span className="text-[#2A221B]/60 block text-[10px]">Time Credits:</span>
                      <span className="font-bold text-[#B87333] flex items-center space-x-1">
                        <Coins className="w-3 h-3" />
                        <span>{member.barterHoursBalance} Hours</span>
                      </span>
                    </div>
                    <div>
                      <span className="text-[#2A221B]/60 block text-[10px]">Trades:</span>
                      <span className="font-bold text-emerald-700">{member.tradesCompleted} Done</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-copper-penny/10 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#2A221B]/50">Joined: {member.joinedDate}</span>
                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => handleAddStrikeNote(member.id)}
                      className="px-2 py-1 text-[10px] font-mono text-amber-800 hover:bg-amber-50 rounded-lg border border-amber-200 cursor-pointer"
                      title="Add note or flag"
                    >
                      Add Note
                    </button>
                    <button
                      onClick={() => {
                        const nextStatus = member.status === 'active_good_standing' ? 'suspended_breach' : 'active_good_standing';
                        handleUpdateStatus(member.id, nextStatus);
                      }}
                      className={`px-2 py-1 text-[10px] font-mono font-bold rounded-lg border cursor-pointer ${
                        member.status === 'active_good_standing' 
                          ? 'bg-white hover:bg-red-50 text-red-700 border-red-200' 
                          : 'bg-emerald-600 text-white border-emerald-700'
                      }`}
                    >
                      {member.status === 'active_good_standing' ? 'Suspend' : 'Reactivate'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: 50-STATE SPEARHEAD MATRIX */}
      {activeSubTab === 'spearheads' && (
        <div className="bg-white rounded-3xl p-6 border border-copper-penny/20 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-copper-penny/10 pb-3">
            <div>
              <h4 className="font-serif font-bold text-lg text-[#1F1813] flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-amber-700" />
                <span>50-State Spearhead Chapter Coordinators</span>
              </h4>
              <p className="text-xs text-[#2A221B]/70 mt-0.5">
                Each state circle is anchored by a designated mother who coordinates local gatherings, emergency care pods, and vetting.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-amber-900 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 self-start">
              15 Active Circles
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {chapters.map(ch => (
              <div key={ch.stateCode} className="p-4 bg-[#FAF5EE] rounded-2xl border border-copper-penny/15 space-y-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-xl bg-amber-900 text-white font-mono font-bold flex items-center justify-center text-xs">
                      {ch.stateCode}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      ch.status === 'active_thriving' ? 'bg-emerald-100 text-emerald-800' :
                      ch.status === 'forming_circle' ? 'bg-blue-100 text-blue-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {ch.status.replace('_', ' ')}
                    </span>
                  </div>

                  <h5 className="font-serif font-bold text-sm text-[#1F1813] mt-2">{ch.stateName} Circle</h5>
                  <p className="text-xs font-sans font-bold text-amber-950 mt-1">Lead: {ch.leadSisterName}</p>
                  <p className="text-[11px] text-[#2A221B]/70 font-mono">{ch.leadEmail}</p>
                </div>

                <div className="pt-2 border-t border-copper-penny/10 flex items-center justify-between text-[11px] font-mono">
                  <span className="font-bold text-emerald-800">{ch.memberCount} Sisters Active</span>
                  <button
                    onClick={() => {
                      const newLead = prompt(`Enter new spearhead lead for ${ch.stateName}:`, ch.leadSisterName);
                      if (newLead) {
                        setChapters(prev => prev.map(c => c.stateCode === ch.stateCode ? { ...c, leadSisterName: newLead } : c));
                        alert(`Designated ${newLead} as the ${ch.stateName} Spearhead Lead.`);
                      }
                    }}
                    className="text-amber-800 hover:underline font-bold cursor-pointer"
                  >
                    Reassign
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: MODERATION & DISCIPLINARY DESK */}
      {activeSubTab === 'safety' && (
        <div className="bg-white rounded-3xl p-6 border border-copper-penny/20 shadow-sm space-y-4">
          <div>
            <h4 className="font-serif font-bold text-lg text-[#1F1813] flex items-center space-x-2">
              <ShieldAlert className="w-5 h-5 text-red-600" />
              <span>Village Guidelines &amp; Disciplinary Desk</span>
            </h4>
            <p className="text-xs text-[#2A221B]/70 mt-0.5">
              Review members with open disputes, strikes, or temporary suspensions under grandmother council review.
            </p>
          </div>

          <div className="divide-y divide-copper-penny/10 text-xs">
            {members.filter(m => m.strikesCount > 0 || m.status !== 'active_good_standing').map(m => (
              <div key={m.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-[#1F1813]">{m.name}</span>
                    <span className="font-mono text-[10px] text-soft-sage">({m.stateName})</span>
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded font-mono font-bold text-[10px]">
                      {m.strikesCount} Strike(s)
                    </span>
                  </div>
                  <p className="text-[#2A221B]/80 font-sans italic">"{m.lastIncidentNote || 'Flagged for peer mediation.'}"</p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => {
                      setMembers(prev => prev.map(mem => mem.id === m.id ? { ...mem, status: 'active_good_standing', strikesCount: 0, lastIncidentNote: 'Cleared by council mediation.' } : mem));
                      alert(`Cleared strikes for ${m.name}. Restored to active good standing.`);
                    }}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-mono text-[10px] font-bold cursor-pointer"
                  >
                    Clear &amp; Restore
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(m.id, 'suspended_breach')}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-xl font-mono text-[10px] font-bold cursor-pointer"
                  >
                    Revoke PMA Access
                  </button>
                </div>
              </div>
            ))}

            {members.filter(m => m.strikesCount > 0 || m.status !== 'active_good_standing').length === 0 && (
              <div className="py-8 text-center text-[#2A221B]/60 font-sans">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-600 mb-1" />
                <p>All members are currently in good standing with zero active disciplinary flags.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
