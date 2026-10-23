import React, { useState, useEffect } from 'react';
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
  Check,
  Shield,
  ShieldCheck,
  Search,
  Plus,
  RefreshCw,
  Sliders,
  Terminal,
  RotateCcw
} from 'lucide-react';
import { BroadcastBulletin } from '../../types';
import { 
  ModerationTriggerRule, 
  DEFAULT_TRIGGER_RULES, 
  getStoredModerationRules, 
  saveCustomModerationRule, 
  deleteCustomModerationRule, 
  resetModerationRulesToDefault,
  scanContentForTriggers, 
  getModerationSensitivity, 
  setModerationSensitivity,
  ModerationScanResult
} from '../../data/moderationFilter';

export interface FlaggedReport {
  id: string;
  postId?: string;
  itemType: 'barter_listing' | 'forum_post' | 'comment' | 'classified_ad';
  itemTitle: string;
  posterName: string;
  posterState: string;
  reportedBy: string;
  reason: string;
  matchedTriggers?: string[];
  triggerCategory?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  dateReported: string;
  itemSnippet: string;
  status: 'pending_review' | 'dismissed' | 'removed';
  autoFlagged?: boolean;
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
    severity: 'medium',
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
    reportedBy: 'Internal Guardian Filter (Auto)',
    reason: 'Auto-detected prohibited crypto/financial scheme keyword.',
    matchedTriggers: ['crypto', 'savings pool'],
    triggerCategory: 'scam_crypto',
    severity: 'critical',
    dateReported: '2026-09-25',
    itemSnippet: 'Join this high-yield automated savings pool for sovereign mothers...',
    status: 'pending_review',
    autoFlagged: true
  }
];

interface AdminModerationQueueProps {
  onAddBulletin?: (bulletin: BroadcastBulletin) => void;
}

export default function AdminModerationQueue({ onAddBulletin }: AdminModerationQueueProps) {
  // Navigation within moderation desk
  const [activeTab, setActiveTab] = useState<'queue' | 'rules' | 'sandbox' | 'push'>('queue');

  // Reports state synced with local storage and backend
  const [reports, setReports] = useState<FlaggedReport[]>(() => {
    try {
      const stored = localStorage.getItem('copper_mommies_reported_posts');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const map = new Map<string, FlaggedReport>();
          INITIAL_REPORTS.forEach(r => map.set(r.id, r));
          parsed.forEach((r: FlaggedReport) => map.set(r.id, r));
          return Array.from(map.values());
        }
      }
    } catch {}
    return INITIAL_REPORTS;
  });

  // Filter Rules state
  const [rules, setRules] = useState<ModerationTriggerRule[]>(() => getStoredModerationRules());
  const [sensitivity, setSensitivityState] = useState<'strict' | 'balanced' | 'relaxed'>(() => getModerationSensitivity());
  const [ruleSearch, setRuleSearch] = useState('');
  const [ruleCategoryFilter, setRuleCategoryFilter] = useState<string>('all');

  // Add Rule Form state
  const [newRulePattern, setNewRulePattern] = useState('');
  const [newRuleCategory, setNewRuleCategory] = useState<any>('scam_crypto');
  const [newRuleSeverity, setNewRuleSeverity] = useState<'critical' | 'high' | 'medium'>('high');
  const [newRuleReason, setNewRuleReason] = useState('');
  const [showAddRuleModal, setShowAddRuleModal] = useState(false);

  // Sandbox state
  const [sandboxText, setSandboxText] = useState('Hey sisters! DM me on telegram t.me/profit or send $50 on cash app flip for guaranteed 100% returns!');
  const [sandboxResult, setSandboxResult] = useState<ModerationScanResult | null>(null);

  // State-Targeted Push Dispatcher State
  const [targetState, setTargetState] = useState<string>('ALL');
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastUrgency, setBroadcastUrgency] = useState<'normal' | 'urgent' | 'celebration'>('normal');
  const [actionText, setActionText] = useState('View Details');
  const [actionLink, setActionLink] = useState('#');

  // Sync listener for reports and rules
  useEffect(() => {
    const handleSync = () => {
      try {
        const stored = localStorage.getItem('copper_mommies_reported_posts');
        if (stored) {
          const parsed = JSON.parse(stored);
          const map = new Map<string, FlaggedReport>();
          INITIAL_REPORTS.forEach(r => map.set(r.id, r));
          parsed.forEach((r: FlaggedReport) => map.set(r.id, r));
          setReports(Array.from(map.values()));
        }
      } catch {}
    };

    const handleRulesSync = () => {
      setRules(getStoredModerationRules());
      setSensitivityState(getModerationSensitivity());
    };

    window.addEventListener('copper_reported_posts_updated', handleSync);
    window.addEventListener('copper_moderation_rules_updated', handleRulesSync);

    // Also fetch server-side queue if available
    fetch('/api/moderation/flagged-queue')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.items)) {
          setReports(prev => {
            const map = new Map<string, FlaggedReport>();
            prev.forEach(r => map.set(r.id, r));
            data.items.forEach((r: FlaggedReport) => {
              if (!map.has(r.id)) map.set(r.id, r);
            });
            return Array.from(map.values());
          });
        }
      })
      .catch(() => {});

    return () => {
      window.removeEventListener('copper_reported_posts_updated', handleSync);
      window.removeEventListener('copper_moderation_rules_updated', handleRulesSync);
    };
  }, []);

  const handleDismissReport = (id: string, postId?: string) => {
    const updated = reports.map(r => r.id === id ? { ...r, status: 'dismissed' as const } : r);
    setReports(updated);
    try {
      localStorage.setItem('copper_mommies_reported_posts', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('copper_reported_posts_updated'));
    } catch {}

    // Unflag post in commons posts
    if (postId) {
      try {
        const postsStr = localStorage.getItem('copper_mommies_commons_posts');
        if (postsStr) {
          const posts = JSON.parse(postsStr);
          const updatedPosts = posts.map((p: any) => {
            if (p.id === postId) {
              return { ...p, isFlagged: false, isAutoFlaggedByFilter: false, isRemovedByAdmin: false, reportCount: 0 };
            }
            return p;
          });
          localStorage.setItem('copper_mommies_commons_posts', JSON.stringify(updatedPosts));
          window.dispatchEvent(new CustomEvent('copper_commons_posts_changed'));
        }
      } catch {}
    }

    // Inform backend
    fetch(`/api/moderation/flagged-queue/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'dismissed' })
    }).catch(() => {});

    alert('✅ Report dismissed. The post has been verified and remains active in the Village Stream.');
  };

  const handleRemovePost = (id: string, title: string, postId?: string) => {
    if (window.confirm(`Are you sure you want to remove "${title}" from the public Village Stream?`)) {
      const updated = reports.map(r => r.id === id ? { ...r, status: 'removed' as const } : r);
      setReports(updated);
      try {
        localStorage.setItem('copper_mommies_reported_posts', JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent('copper_reported_posts_updated'));
      } catch {}

      // Hide post from public feed
      if (postId) {
        try {
          const postsStr = localStorage.getItem('copper_mommies_commons_posts');
          if (postsStr) {
            const posts = JSON.parse(postsStr);
            const updatedPosts = posts.map((p: any) => {
              if (p.id === postId) {
                return { ...p, isRemovedByAdmin: true };
              }
              return p;
            });
            localStorage.setItem('copper_mommies_commons_posts', JSON.stringify(updatedPosts));
            window.dispatchEvent(new CustomEvent('copper_commons_posts_changed'));
          }
        } catch {}
      }

      // Inform backend
      fetch(`/api/moderation/flagged-queue/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'removed' })
      }).catch(() => {});

      alert(`🗑️ "${title}" has been removed from the public Village Stream.`);
    }
  };

  const handleRestorePost = (id: string, title: string, postId?: string) => {
    const updated = reports.map(r => r.id === id ? { ...r, status: 'pending_review' as const } : r);
    setReports(updated);
    try {
      localStorage.setItem('copper_mommies_reported_posts', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('copper_reported_posts_updated'));
    } catch {}

    if (postId) {
      try {
        const postsStr = localStorage.getItem('copper_mommies_commons_posts');
        if (postsStr) {
          const posts = JSON.parse(postsStr);
          const updatedPosts = posts.map((p: any) => {
            if (p.id === postId) {
              return { ...p, isRemovedByAdmin: false };
            }
            return p;
          });
          localStorage.setItem('copper_mommies_commons_posts', JSON.stringify(updatedPosts));
          window.dispatchEvent(new CustomEvent('copper_commons_posts_changed'));
        }
      } catch {}
    }

    alert(`✨ "${title}" has been restored to the Village Stream!`);
  };

  const handleAddCustomRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRulePattern.trim()) {
      alert('Please enter a word or phrase pattern.');
      return;
    }

    const categoryLabels: Record<string, string> = {
      scam_crypto: 'Financial Scam / Crypto',
      harassment_violence: 'Harassment & Violence',
      vulgarity_slurs: 'Vulgarity & Hate Speech',
      substance_hazard: 'Harmful Substances',
      commercial_reseller: 'Commercial Reseller Spam'
    };

    saveCustomModerationRule({
      pattern: newRulePattern.trim(),
      category: newRuleCategory,
      categoryLabel: categoryLabels[newRuleCategory] || 'Custom Filter Rule',
      severity: newRuleSeverity,
      action: newRuleSeverity === 'critical' ? 'block' : 'flag_for_review',
      reason: newRuleReason.trim() || 'Custom sanctuary guideline rule added by Mama Shantrece'
    });

    // Also sync to backend API
    fetch('/api/moderation/rules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pattern: newRulePattern.trim(),
        category: newRuleCategory,
        categoryLabel: categoryLabels[newRuleCategory],
        severity: newRuleSeverity,
        action: newRuleSeverity === 'critical' ? 'block' : 'flag_for_review',
        reason: newRuleReason.trim() || 'Custom sanctuary guideline rule'
      })
    }).catch(() => {});

    setNewRulePattern('');
    setNewRuleReason('');
    setShowAddRuleModal(false);
    alert('🛡️ Custom trigger word registered! The backend safety filter is immediately enforcing this rule across all community posts.');
  };

  const handleDeleteRule = (ruleId: string) => {
    if (window.confirm('Are you sure you want to remove this trigger word rule from the filter?')) {
      deleteCustomModerationRule(ruleId);
      fetch(`/api/moderation/rules/${ruleId}`, { method: 'DELETE' }).catch(() => {});
    }
  };

  const handleResetRules = () => {
    if (window.confirm('Reset all moderation rules to the default maternal sanctuary dictionary?')) {
      resetModerationRulesToDefault();
    }
  };

  const handleTestSandbox = () => {
    const result = scanContentForTriggers(sandboxText, '', rules);
    setSandboxResult(result);
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

  const filteredRules = rules.filter(r => {
    const matchesSearch = r.pattern.toLowerCase().includes(ruleSearch.toLowerCase()) ||
      r.categoryLabel.toLowerCase().includes(ruleSearch.toLowerCase()) ||
      r.reason.toLowerCase().includes(ruleSearch.toLowerCase());
    const matchesCat = ruleCategoryFilter === 'all' || r.category === ruleCategoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#201416] via-[#2F1B20] to-[#170E10] text-[#FAF5EE] p-6 rounded-3xl border-2 border-red-500/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-red-400 font-mono text-xs uppercase font-extrabold mb-1">
            <ShieldAlert className="w-4 h-4 text-red-400" />
            <span>Village Sanctuary Safety &amp; Trust Guardianship</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#FAF5EE]">
            Village Stream Internal Trigger Filter &amp; Moderation Desk
          </h3>
          <p className="text-xs sm:text-sm text-[#FAF5EE]/80 mt-1 max-w-2xl">
            Internal backend filtering engine automatically scanning posts and comments for sensitive triggers, scam keywords, and inappropriate language, paired with Grandmothers Council review.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <span className="px-3.5 py-1.5 rounded-xl bg-red-950/80 border border-red-500/40 text-red-300 font-mono text-xs font-bold flex items-center space-x-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
            <span>{pendingReports.length} Flagged Posts Awaiting Review</span>
          </span>
          <span className="px-3.5 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{rules.length} Trigger Rules Active</span>
          </span>
        </div>
      </div>

      {/* Desk Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white rounded-2xl border border-copper-penny/20 font-mono text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('queue')}
          className={`px-4 py-2 rounded-xl font-bold flex items-center space-x-2 transition-all cursor-pointer ${
            activeTab === 'queue'
              ? 'bg-[#1F140E] text-[#D4AF37] shadow-xs'
              : 'text-[#1F140E]/70 hover:bg-[#FAF5EE]'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
          <span>Reported &amp; Auto-Flagged Posts</span>
          {pendingReports.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[10px]">
              {pendingReports.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('rules')}
          className={`px-4 py-2 rounded-xl font-bold flex items-center space-x-2 transition-all cursor-pointer ${
            activeTab === 'rules'
              ? 'bg-[#1F140E] text-[#D4AF37] shadow-xs'
              : 'text-[#1F140E]/70 hover:bg-[#FAF5EE]'
          }`}
        >
          <Sliders className="w-3.5 h-3.5 text-amber-500" />
          <span>Internal Backend Trigger Rules ({rules.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('sandbox')}
          className={`px-4 py-2 rounded-xl font-bold flex items-center space-x-2 transition-all cursor-pointer ${
            activeTab === 'sandbox'
              ? 'bg-[#1F140E] text-[#D4AF37] shadow-xs'
              : 'text-[#1F140E]/70 hover:bg-[#FAF5EE]'
          }`}
        >
          <Terminal className="w-3.5 h-3.5 text-blue-500" />
          <span>Filter Sandbox &amp; Testing</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('push')}
          className={`px-4 py-2 rounded-xl font-bold flex items-center space-x-2 transition-all cursor-pointer ${
            activeTab === 'push'
              ? 'bg-[#1F140E] text-[#D4AF37] shadow-xs'
              : 'text-[#1F140E]/70 hover:bg-[#FAF5EE]'
          }`}
        >
          <Radio className="w-3.5 h-3.5 text-indigo-500" />
          <span>State-Targeted Push Dispatcher</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: FLAGGED & REPORTED POSTS QUEUE                                    */}
      {/* ========================================================================= */}
      {activeTab === 'queue' && (
        <div className="bg-white rounded-3xl p-6 border border-copper-penny/20 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-copper-penny/10 pb-3 gap-2">
            <div>
              <h4 className="font-serif font-bold text-lg text-[#1F1813] flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span>Flagged Village Stream Posts &amp; Member Reports</span>
              </h4>
              <p className="text-xs text-[#2A221B]/70 mt-0.5">
                Investigate posts automatically flagged by the internal word filter or reported by sisters. Accidental reports never auto-delete posts.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold text-red-800 bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
                {pendingReports.length} Pending Decision
              </span>
            </div>
          </div>

          {/* OPERATING PROTOCOL & SYSTEM EXPLANATION NOTE */}
          <div className="p-5 rounded-2xl bg-[#FAF5EE] border-2 border-[#D4AF37]/40 shadow-xs space-y-3">
            <div className="flex items-center space-x-2 text-[#1F140E]">
              <span className="text-xl">📜</span>
              <div>
                <h5 className="font-serif font-black text-sm text-[#1F140E]">
                  Administrative Guide: How Our Village Report &amp; Moderation System Works
                </h5>
                <p className="text-[11px] font-mono text-soft-sage">
                  Operating protocol for Mama Shantrece and Grandmother Council moderators
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-sans">
              <div className="p-3 bg-white rounded-xl border border-copper-penny/20 space-y-1.5">
                <div className="font-bold font-mono text-[11px] text-[#B87333] flex items-center space-x-1">
                  <span>1️⃣</span>
                  <span>Intentional Reporting Flow</span>
                </div>
                <p className="text-[#2A221B]/85 text-[11px] leading-relaxed">
                  When a sister clicks "Report Post", a <strong>mandatory confirmation pop-out</strong> appears. She must select a reason, optionally add a note, and check the intentional confirmation box.
                </p>
                <p className="text-[10px] font-mono text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  🛡️ Posts are NEVER deleted automatically on first click.
                </p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-copper-penny/20 space-y-1.5">
                <div className="font-bold font-mono text-[11px] text-[#B87333] flex items-center space-x-1">
                  <span>2️⃣</span>
                  <span>Internal Word Filter Sync</span>
                </div>
                <p className="text-[#2A221B]/85 text-[11px] leading-relaxed">
                  In addition to member reports, our backend word filter scans every post and comment. Critical scam/violence patterns are blocked; sensitive triggers are auto-flagged and routed directly into this queue with exact keywords caught.
                </p>
                <p className="text-[10px] font-mono text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  ⚡ Auto-tagged with severity rating.
                </p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-copper-penny/20 space-y-1.5">
                <div className="font-bold font-mono text-[11px] text-[#B87333] flex items-center space-x-1">
                  <span>3️⃣</span>
                  <span>Council Arbitration &amp; Recovery</span>
                </div>
                <p className="text-[#2A221B]/85 text-[11px] leading-relaxed">
                  You have full authority over each item:
                  <br />&bull; <strong>Keep in Stream</strong>: Clears report and verifies post.
                  <br />&bull; <strong>Remove from Stream</strong>: Takes post down from feed.
                  <br />&bull; <strong>Restore to Stream</strong>: Instantly recovers any post removed by mistake.
                </p>
                <p className="text-[10px] font-mono text-indigo-800 font-bold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  ↩️ Zero risk of irreversible mistakes.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {reports.map(rep => (
              <div 
                key={rep.id} 
                className={`p-4 rounded-2xl border transition-all text-xs font-sans space-y-3 ${
                  rep.status === 'pending_review' 
                    ? 'bg-[#FAF5EE] border-red-300 shadow-sm' 
                    : rep.status === 'removed'
                    ? 'bg-rose-50/50 border-rose-200 opacity-75'
                    : 'bg-neutral-50 border-copper-penny/10 opacity-70'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-red-100 text-red-900 border border-red-300">
                        {rep.itemType.replace('_', ' ')}
                      </span>
                      {rep.autoFlagged && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-amber-100 text-amber-900 border border-amber-300 flex items-center space-x-1">
                          <ShieldAlert className="w-3 h-3 text-amber-700" />
                          <span>Internal Filter Auto-Flag</span>
                        </span>
                      )}
                      {rep.severity && (
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                          rep.severity === 'critical' ? 'bg-red-900 text-white' :
                          rep.severity === 'high' ? 'bg-orange-600 text-white' : 'bg-yellow-200 text-yellow-900'
                        }`}>
                          Severity: {rep.severity}
                        </span>
                      )}
                    </div>
                    <h5 className="font-serif font-bold text-sm text-[#1F1813] mt-1.5">{rep.itemTitle}</h5>
                    <p className="text-[11px] text-[#2A221B]/70 font-mono mt-0.5">
                      Poster: <strong>{rep.posterName}</strong> ({rep.posterState}) • Reported by: <strong>{rep.reportedBy}</strong>
                    </p>
                  </div>

                  <span className="text-[10px] font-mono text-[#2A221B]/50 shrink-0">{rep.dateReported}</span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-copper-penny/15 space-y-1">
                  <p className="font-bold text-red-900 text-[11px] flex items-center space-x-1">
                    <span>Reason for Flag:</span>
                  </p>
                  <p className="text-[#2A221B]/90 font-sans">{rep.reason}</p>
                  {rep.matchedTriggers && rep.matchedTriggers.length > 0 && (
                    <div className="pt-1 flex items-center space-x-1 flex-wrap">
                      <span className="text-[10px] font-mono text-soft-sage font-bold">Trigger Words Caught:</span>
                      {rep.matchedTriggers.map((trig, idx) => (
                        <span key={idx} className="px-1.5 py-0.2 rounded bg-red-100 text-red-800 font-mono text-[10px] font-bold">
                          "{trig}"
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-[#FAF5EE] p-2.5 rounded-xl border border-copper-penny/10 text-[11px] italic text-[#2A221B]/80 font-sans">
                  "{rep.itemSnippet}"
                </div>

                <div className="pt-2 border-t border-copper-penny/10 flex items-center justify-between flex-wrap gap-2">
                  <span className={`text-[10px] font-mono font-bold ${
                    rep.status === 'pending_review' ? 'text-amber-700' :
                    rep.status === 'dismissed' ? 'text-emerald-700' : 'text-red-700'
                  }`}>
                    Status: {rep.status.replace('_', ' ').toUpperCase()}
                  </span>

                  <div className="flex items-center space-x-2">
                    {rep.status === 'pending_review' ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleDismissReport(rep.id, rep.postId)}
                          className="px-3 py-1.5 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-mono font-bold cursor-pointer transition-colors shadow-2xs"
                        >
                          Keep in Stream (Dismiss Flag)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemovePost(rep.id, rep.itemTitle, rep.postId)}
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-mono font-bold cursor-pointer transition-colors shadow-2xs"
                        >
                          Remove from Stream
                        </button>
                      </>
                    ) : rep.status === 'removed' ? (
                      <button
                        type="button"
                        onClick={() => handleRestorePost(rep.id, rep.itemTitle, rep.postId)}
                        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-mono font-bold cursor-pointer transition-colors flex items-center space-x-1 shadow-2xs"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Restore to Stream</span>
                      </button>
                    ) : (
                      <span className="text-[10px] font-mono text-emerald-700 font-bold">
                        Verified Clean &amp; Live
                      </span>
                    )}
                  </div>
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
      )}

      {/* ========================================================================= */}
      {/* TAB 2: INTERNAL BACKEND TRIGGER WORDS & RULES DICTIONARY                   */}
      {/* ========================================================================= */}
      {activeTab === 'rules' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-copper-penny/20 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-copper-penny/10 pb-3 gap-3">
              <div>
                <h4 className="font-serif font-bold text-lg text-[#1F1813] flex items-center space-x-2">
                  <Sliders className="w-5 h-5 text-amber-600" />
                  <span>Internal Backend Trigger Words &amp; Dictionary</span>
                </h4>
                <p className="text-xs text-[#2A221B]/70 mt-0.5">
                  These words and patterns are automatically scanned whenever a sister publishes a post or comment in the Village Stream.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddRuleModal(true)}
                  className="px-4 py-2 bg-[#1F140E] hover:bg-neutral-800 text-[#D4AF37] rounded-xl font-mono text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Custom Trigger Word</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetRules}
                  className="p-2 border border-copper-penny/20 rounded-xl hover:bg-[#FAF5EE] text-gray-500 cursor-pointer"
                  title="Reset to default rules"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Filter Sensitivity Selector */}
            <div className="p-4 bg-[#FAF5EE] rounded-2xl border border-copper-penny/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
              <div>
                <span className="font-bold text-[#1F140E] block">Internal Moderation Sensitivity:</span>
                <span className="text-[11px] text-soft-sage">
                  {sensitivity === 'strict' && 'Strict: Blocks all critical and high-severity triggers before publishing.'}
                  {sensitivity === 'balanced' && 'Balanced (Recommended): Blocks critical scams/threats; auto-flags sensitive posts for review while allowing open discussion.'}
                  {sensitivity === 'relaxed' && 'Permissive: Only flags in audit queue without blocking.'}
                </span>
              </div>
              <div className="flex items-center space-x-1 bg-white p-1 rounded-xl border border-copper-penny/20">
                {(['strict', 'balanced', 'relaxed'] as const).map(level => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => {
                      setSensitivityState(level);
                      setModerationSensitivity(level);
                    }}
                    className={`px-3 py-1 rounded-lg font-bold capitalize transition-all cursor-pointer ${
                      sensitivity === level
                        ? 'bg-[#1F140E] text-[#D4AF37] shadow-2xs'
                        : 'text-gray-600 hover:bg-neutral-100'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Rules Search and Category Filters */}
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-copper-penny absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={ruleSearch}
                  onChange={e => setRuleSearch(e.target.value)}
                  placeholder="Search trigger words, categories, or reasons..."
                  className="w-full pl-9 pr-3 py-2 bg-[#FAF5EE] border border-copper-penny/20 rounded-xl text-xs font-sans focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>

              <select
                value={ruleCategoryFilter}
                onChange={e => setRuleCategoryFilter(e.target.value)}
                className="p-2 bg-[#FAF5EE] border border-copper-penny/20 rounded-xl text-xs font-mono font-bold text-[#1F140E]"
              >
                <option value="all">All Categories ({rules.length})</option>
                <option value="scam_crypto">🪙 Scams &amp; Crypto</option>
                <option value="harassment_violence">🛑 Harassment &amp; Threats</option>
                <option value="vulgarity_slurs">🚫 Slurs &amp; Vulgarity</option>
                <option value="substance_hazard">⚠️ Substance Hazards</option>
                <option value="commercial_reseller">📦 Dropshipping / Resellers</option>
              </select>
            </div>

            {/* Rules Table / Cards */}
            <div className="space-y-2">
              {filteredRules.map(rule => (
                <div 
                  key={rule.id}
                  className="p-3.5 rounded-2xl bg-white border border-copper-penny/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center space-x-2 flex-wrap">
                      <code className="px-2 py-0.5 rounded bg-[#FAF5EE] text-[#B87333] border border-copper-penny/20 font-mono font-bold text-xs">
                        {rule.pattern}
                      </code>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-neutral-100 text-neutral-700">
                        {rule.categoryLabel}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        rule.severity === 'critical' ? 'bg-red-100 text-red-800 border border-red-200' :
                        rule.severity === 'high' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                        'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}>
                        {rule.severity}
                      </span>
                      {rule.isCustom && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-purple-100 text-purple-800">
                          Custom
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#2A221B]/70 font-sans">
                      {rule.reason}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <span className={`px-2 py-1 rounded-lg font-mono text-[10px] font-bold ${
                      rule.action === 'block' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      Action: {rule.action === 'block' ? 'Auto-Block' : 'Auto-Flag'}
                    </span>
                    {rule.isCustom && (
                      <button
                        type="button"
                        onClick={() => handleDeleteRule(rule.id)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                        title="Delete custom rule"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: FILTER SANDBOX & TESTING                                           */}
      {/* ========================================================================= */}
      {activeTab === 'sandbox' && (
        <div className="bg-white rounded-3xl p-6 border border-copper-penny/20 shadow-sm space-y-4">
          <div className="border-b border-copper-penny/10 pb-3">
            <h4 className="font-serif font-bold text-lg text-[#1F1813] flex items-center space-x-2">
              <Terminal className="w-5 h-5 text-blue-600" />
              <span>Interactive Backend Safety Scanner Sandbox</span>
            </h4>
            <p className="text-xs text-[#2A221B]/70 mt-0.5">
              Type or paste any draft post or message to test how the internal backend filter detects trigger words and calculates severity.
            </p>
          </div>

          <div className="space-y-3">
            <textarea
              rows={4}
              value={sandboxText}
              onChange={e => setSandboxText(e.target.value)}
              placeholder="Paste any post text here to test the filter..."
              className="w-full p-3 bg-[#FAF5EE] border border-copper-penny/20 rounded-2xl text-xs font-sans focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
            />

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleTestSandbox}
                className="px-5 py-2.5 bg-[#1F140E] hover:bg-neutral-800 text-[#D4AF37] font-mono text-xs font-bold rounded-xl flex items-center space-x-2 cursor-pointer shadow-xs"
              >
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                <span>Run Internal Moderation Scan</span>
              </button>

              <button
                type="button"
                onClick={() => setSandboxText('Good morning sisters! Just harvested fresh wildcrafted mullein and chamomile for respiratory teas.')}
                className="text-[11px] font-mono text-[#B87333] hover:underline"
              >
                Load clean example
              </button>
            </div>

            {sandboxResult && (
              <div className={`p-4 rounded-2xl border space-y-2 animate-fade-in text-xs ${
                sandboxResult.isClean 
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
                  : sandboxResult.recommendedAction === 'block'
                  ? 'bg-red-50 border-red-300 text-red-900'
                  : 'bg-amber-50 border-amber-300 text-amber-900'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold uppercase text-[11px] flex items-center space-x-1.5">
                    {sandboxResult.isClean ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Filter Verdict: Clean &amp; Approved</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <span>Filter Verdict: {sandboxResult.recommendedAction.toUpperCase()} (Highest Severity: {sandboxResult.highestSeverity})</span>
                      </>
                    )}
                  </span>
                  <span className="font-mono text-[10px]">
                    {sandboxResult.matchedTriggers.length} Triggers Detected
                  </span>
                </div>

                <p className="font-sans text-xs">
                  {sandboxResult.summary}
                </p>

                {sandboxResult.warningMessage && (
                  <div className="p-2.5 bg-white/80 rounded-xl border border-current text-[11px] font-mono">
                    {sandboxResult.warningMessage}
                  </div>
                )}

                {sandboxResult.matchedTriggers.length > 0 && (
                  <div className="pt-2 border-t border-current/20 space-y-1">
                    <span className="font-mono font-bold text-[10px] block">Detected Trigger Matches:</span>
                    <div className="space-y-1">
                      {sandboxResult.matchedTriggers.map((t, idx) => (
                        <div key={idx} className="p-2 rounded-lg bg-white/90 border border-current/20 flex items-center justify-between text-[11px]">
                          <div>
                            <strong>"{t.word}"</strong> &bull; <span className="font-mono">{t.categoryLabel}</span>
                          </div>
                          <span className="font-mono text-[10px] font-bold uppercase">
                            {t.action}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: STATE-TARGETED PUSH DISPATCHER                                     */}
      {/* ========================================================================= */}
      {activeTab === 'push' && (
        <div className="bg-white rounded-3xl p-6 border border-copper-penny/20 shadow-sm space-y-4">
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
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD CUSTOM TRIGGER WORD RULE                                       */}
      {/* ========================================================================= */}
      {showAddRuleModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF5EE] border-2 border-[#D4AF37] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scale-up text-xs font-mono">
            <div className="flex items-center justify-between border-b border-copper-penny/20 pb-3">
              <h4 className="font-serif font-black text-base text-[#1F140E]">
                Add Custom Trigger Word or Phrase
              </h4>
              <button
                type="button"
                onClick={() => setShowAddRuleModal(false)}
                className="p-1 rounded-lg hover:bg-neutral-200 text-neutral-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCustomRule} className="space-y-3">
              <div>
                <label className="block text-[10px] uppercase font-bold text-soft-sage mb-1">
                  Trigger Word or Exact Phrase *
                </label>
                <input
                  type="text"
                  required
                  value={newRulePattern}
                  onChange={e => setNewRulePattern(e.target.value)}
                  placeholder="e.g. crypto referral, wire cash, cashapp flip"
                  className="w-full bg-white border border-copper-penny/25 p-2 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-soft-sage mb-1">
                  Violation Category *
                </label>
                <select
                  value={newRuleCategory}
                  onChange={e => setNewRuleCategory(e.target.value)}
                  className="w-full bg-white border border-copper-penny/25 p-2 rounded-xl text-xs"
                >
                  <option value="scam_crypto">🪙 Financial Scam / Crypto / Money Flip</option>
                  <option value="harassment_violence">🛑 Harassment, Threat, Doxxing</option>
                  <option value="vulgarity_slurs">🚫 Racial Slurs &amp; Hostile Profanity</option>
                  <option value="substance_hazard">⚠️ Dangerous Substances &amp; Black Market Meds</option>
                  <option value="commercial_reseller">📦 Dropshipping &amp; Reseller Spam</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-soft-sage mb-1">
                  Enforcement Severity *
                </label>
                <select
                  value={newRuleSeverity}
                  onChange={e => setNewRuleSeverity(e.target.value as any)}
                  className="w-full bg-white border border-copper-penny/25 p-2 rounded-xl text-xs"
                >
                  <option value="critical">Critical (Auto-Block: Prevents post submission)</option>
                  <option value="high">High (Auto-Flag: Submits but notifies Admin Back Office)</option>
                  <option value="medium">Medium (Audit Log &amp; Flag)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-soft-sage mb-1">
                  Sanctuary Rationale / Rule Reason
                </label>
                <input
                  type="text"
                  value={newRuleReason}
                  onChange={e => setNewRuleReason(e.target.value)}
                  placeholder="e.g. Prohibits off-platform money requests"
                  className="w-full bg-white border border-copper-penny/25 p-2 rounded-xl text-xs font-sans"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddRuleModal(false)}
                  className="px-4 py-2 bg-neutral-200 text-neutral-800 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1F140E] text-[#D4AF37] rounded-xl font-bold cursor-pointer shadow-xs"
                >
                  Register Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
