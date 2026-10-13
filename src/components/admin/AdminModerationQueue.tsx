import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Radio, 
  Send, 
  CheckCircle2, 
  Trash2, 
  AlertTriangle, 
  Eye, 
  MapPin, 
  MessageSquare, 
  Sparkles, 
  Filter, 
  X,
  Bell,
  Check
} from 'lucide-react';
import { BroadcastBulletin } from '../../types';

export interface FlaggedReport {
  id: string;
  itemType: 'barter_listing' | 'forum_post' | 'comment' | 'classified_ad';
  itemTitle: string;
  posterName: string;
  posterState: string;
  reportedBy: string;
  reason: string;
  dateReported: string;
  itemSnippet: string;
  status: 'pending_review' | 'dismissed' | 'removed';
}

const INITIAL_REPORTS: FlaggedReport[] = [
  {
    id: 'rep-01',
    itemType: 'barter_listing',
    itemTitle: 'Commercial Pre-packaged Multivitamin Bottles (Bulk)',
    posterName: 'Sister Candace M.',
    posterState: 'TX',
    reportedBy: 'Sister Maya (CA)',
    reason: 'Commercial wholesale reselling rather than sovereign handmade herbal crafting or personal trade.',
    dateReported: '2026-09-24',
    itemSnippet: 'Offering 12 unopened bottles of commercial store-bought prenatal gummies for 15 barter hours.',
    status: 'pending_review'
  },
  {
    id: 'rep-02',
    itemType: 'forum_post',
    itemTitle: 'Third-party Crypto Investment Link in Gathering Chat',
    posterName: 'Guest Sister Applicant #49',
    posterState: 'FL',
    reportedBy: 'Mama Shantrece (GA)',
    reason: 'Unsolicited commercial spam and financial speculation violating sacred space guidelines.',
    dateReported: '2026-09-25',
    itemSnippet: 'Join this high-yield automated savings pool for sovereign mothers...',
    status: 'pending_review'
  }
];

interface AdminModerationQueueProps {
  onAddBulletin?: (bulletin: BroadcastBulletin) => void;
}

export default function AdminModerationQueue({ onAddBulletin }: AdminModerationQueueProps) {
  const [reports, setReports] = useState<FlaggedReport[]>(INITIAL_REPORTS);
  
  // State-Targeted Push Dispatcher State
  const [targetState, setTargetState] = useState<string>('ALL');
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastUrgency, setBroadcastUrgency] = useState<'normal' | 'urgent' | 'celebration'>('normal');
  const [actionText, setActionText] = useState('View Details');
  const [actionLink, setActionLink] = useState('#');

  const handleDismissReport = (id: string) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: 'dismissed' } : r));
    alert('✅ Report dismissed. The listing has been verified and remains active.');
  };

  const handleRemoveListing = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to remove "${title}" from the public village feed?`)) {
      setReports(prev => prev.map(r => r.id === id ? { ...r, status: 'removed' } : r));
      alert(`🗑️ "${title}" has been taken down and archived. A gentle advisory was logged.`);
    }
  };

  const handleDispatchPush = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastMessage) {
      alert('Please fill out the headline and announcement message.');
      return;
    }

    const statePrefix = targetState === 'ALL' ? '🌐 [NATIONAL VILLAGE ALERT]' : `📍 [${targetState} STATE CIRCLE EXCLUSIVE]`;
    const newBulletin: BroadcastBulletin = {
      id: `state-push-${Date.now()}`,
      title: `${statePrefix} ${broadcastTitle}`,
      message: broadcastMessage,
      urgency: broadcastUrgency as any,
      targetHub: 'all',
      colorTheme: broadcastUrgency === 'urgent' ? 'rose' : broadcastUrgency === 'celebration' ? 'gold' : 'emerald',
      actionText: actionText || 'Explore',
      actionLink: actionLink || '#',
      pinnedBy: `Matriarch Desk (${targetState} Dispatch)`,
      createdAt: 'Just now',
      active: true
    };

    if (onAddBulletin) {
      onAddBulletin(newBulletin);
    }
    
    setBroadcastTitle('');
    setBroadcastMessage('');
    alert(`📢 Targeted announcement broadcast successfully to ${targetState === 'ALL' ? 'all nationwide sisters' : `${targetState} State Circle sisters`}!`);
  };

  const pendingReports = reports.filter(r => r.status === 'pending_review');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#201416] via-[#2F1B20] to-[#170E10] text-[#FAF5EE] p-6 rounded-3xl border-2 border-red-500/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-red-400 font-mono text-xs uppercase font-extrabold mb-1">
            <ShieldAlert className="w-4 h-4 text-red-400" />
            <span>Village Quality &amp; Trust Guardianship</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#FAF5EE]">
            Content Moderation &amp; State-Targeted Push Desk
          </h3>
          <p className="text-xs sm:text-sm text-[#FAF5EE]/80 mt-1 max-w-2xl">
            Arbitrate member-flagged marketplace barter listings and send targeted broadcast push banners directly to specific state chapters or nationwide.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <span className="px-3.5 py-1.5 rounded-xl bg-red-950/80 border border-red-500/40 text-red-300 font-mono text-xs font-bold">
            {pendingReports.length} Flagged Reports Awaiting Review
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Flagged Barter & Feed Content Queue */}
        <div className="bg-white rounded-3xl p-6 border border-copper-penny/20 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-copper-penny/10 pb-3">
            <div>
              <h4 className="font-serif font-bold text-lg text-[#1F1813] flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span>Flagged Listings &amp; Community Reports</span>
              </h4>
              <p className="text-xs text-[#2A221B]/70 mt-0.5">
                Investigate items flagged by village sisters for guideline non-compliance.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-red-800 bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
              {pendingReports.length} Pending
            </span>
          </div>

          <div className="space-y-3">
            {reports.map(rep => (
              <div 
                key={rep.id} 
                className={`p-4 rounded-2xl border transition-all text-xs font-sans space-y-3 ${
                  rep.status === 'pending_review' 
                    ? 'bg-[#FAF5EE] border-red-300 shadow-sm' 
                    : 'bg-neutral-50 border-copper-penny/10 opacity-70'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-red-100 text-red-900 border border-red-300">
                      {rep.itemType.replace('_', ' ')}
                    </span>
                    <h5 className="font-serif font-bold text-sm text-[#1F1813] mt-1">{rep.itemTitle}</h5>
                    <p className="text-[11px] text-[#2A221B]/70 font-mono">
                      Poster: <strong>{rep.posterName}</strong> ({rep.posterState}) • Reported by: <strong>{rep.reportedBy}</strong>
                    </p>
                  </div>

                  <span className="text-[10px] font-mono text-[#2A221B]/50 shrink-0">{rep.dateReported}</span>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-copper-penny/15 space-y-1">
                  <p className="font-bold text-red-900 text-[11px]">Reported Reason:</p>
                  <p className="text-[#2A221B]/90">{rep.reason}</p>
                </div>

                <div className="bg-[#FAF5EE] p-2.5 rounded-xl border border-copper-penny/10 text-[11px] italic text-[#2A221B]/80">
                  "{rep.itemSnippet}"
                </div>

                <div className="pt-2 border-t border-copper-penny/10 flex items-center justify-between">
                  <span className={`text-[10px] font-mono font-bold ${
                    rep.status === 'pending_review' ? 'text-amber-700' :
                    rep.status === 'dismissed' ? 'text-emerald-700' : 'text-red-700'
                  }`}>
                    Status: {rep.status.replace('_', ' ')}
                  </span>

                  {rep.status === 'pending_review' && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDismissReport(rep.id)}
                        className="px-3 py-1 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-mono font-bold cursor-pointer"
                      >
                        Dismiss Flag
                      </button>
                      <button
                        onClick={() => handleRemoveListing(rep.id, rep.itemTitle)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-mono font-bold cursor-pointer"
                      >
                        Remove Listing
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {reports.length === 0 && (
              <div className="py-8 text-center text-[#2A221B]/60 font-sans">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-600 mb-1" />
                <p>No flagged listings or community complaints at this time.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: State-Targeted Push Dispatcher */}
        <div className="bg-white rounded-3xl p-6 border border-copper-penny/20 shadow-sm space-y-4 h-fit">
          <div className="border-b border-copper-penny/10 pb-3">
            <h4 className="font-serif font-bold text-lg text-[#1F1813] flex items-center space-x-2">
              <Radio className="w-5 h-5 text-indigo-700" />
              <span>State-Targeted Push Announcement Dispatcher</span>
            </h4>
            <p className="text-xs text-[#2A221B]/70 mt-0.5">
              Broadcast top-of-screen push banners targeted specifically to sisters in one state (e.g., local foraging alerts) or nationwide.
            </p>
          </div>

          <form onSubmit={handleDispatchPush} className="space-y-3.5 text-xs font-sans">
            <div>
              <label className="font-bold text-[#1F1813] block mb-1">Target Geographic Audience *</label>
              <select
                value={targetState}
                onChange={e => setTargetState(e.target.value)}
                className="w-full p-2.5 bg-[#FAF5EE] border border-copper-penny/20 rounded-xl font-mono text-xs"
              >
                <option value="ALL">🌐 Nationwide (All 50 State Chapters)</option>
                <option value="GA">📍 Georgia (Atlanta Circle Only)</option>
                <option value="SC">📍 South Carolina (Charleston Circle Only)</option>
                <option value="NC">📍 North Carolina (Charlotte/Asheville Circle Only)</option>
                <option value="CA">📍 California (Oakland Circle Only)</option>
                <option value="TX">📍 Texas (Houston/Dallas Circle Only)</option>
                <option value="FL">📍 Florida (Miami Circle Only)</option>
                <option value="NY">📍 New York (Brooklyn Circle Only)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-[#1F1813] block mb-1">Broadcast Urgency</label>
                <select
                  value={broadcastUrgency}
                  onChange={e => setBroadcastUrgency(e.target.value as any)}
                  className="w-full p-2.5 bg-[#FAF5EE] border border-copper-penny/20 rounded-xl font-mono text-xs"
                >
                  <option value="normal">Normal Announcement</option>
                  <option value="urgent">Urgent Family Alert</option>
                  <option value="celebration">Village Celebration / Recognition</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-[#1F1813] block mb-1">Action Button Text</label>
                <input
                  type="text"
                  value={actionText}
                  onChange={e => setActionText(e.target.value)}
                  placeholder="e.g. Join Circle, RSVP"
                  className="w-full p-2.5 bg-[#FAF5EE] border border-copper-penny/20 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-[#1F1813] block mb-1">Announcement Headline *</label>
              <input
                type="text"
                required
                value={broadcastTitle}
                onChange={e => setBroadcastTitle(e.target.value)}
                placeholder="e.g. Atlanta Circle: Rain delay for Saturday herbal foraging walk"
                className="w-full p-2.5 bg-[#FAF5EE] border border-copper-penny/20 rounded-xl"
              />
            </div>

            <div>
              <label className="font-bold text-[#1F1813] block mb-1">Full Announcement Message *</label>
              <textarea
                rows={3}
                required
                value={broadcastMessage}
                onChange={e => setBroadcastMessage(e.target.value)}
                placeholder="Enter detailed message to appear in the push notification bar..."
                className="w-full p-2.5 bg-[#FAF5EE] border border-copper-penny/20 rounded-xl"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-900 hover:bg-indigo-800 text-white font-mono text-xs font-bold py-3 rounded-xl flex items-center justify-center space-x-2 shadow-md cursor-pointer transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Broadcast Targeted Push Alert</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
