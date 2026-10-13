import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Plus, 
  Tag, 
  Copy, 
  Check, 
  ExternalLink, 
  Download, 
  Trophy, 
  FileText, 
  CheckCircle2, 
  Trash2, 
  Clock, 
  Gift, 
  Eye, 
  X,
  Share2
} from 'lucide-react';

export interface NestBrightVoucher {
  id: string;
  code: string;
  discountType: 'percentage_off' | 'fixed_discount' | '100_percent_free_contest_winner';
  discountValue: string;
  recipientDescription: string;
  contestWinnerName?: string;
  assignedGradeRange: string;
  maxRedemptions: number;
  timesRedeemed: number;
  expiresAt: string;
  status: 'active' | 'claimed' | 'expired';
  notes: string;
}

export interface VaultDocument {
  id: string;
  title: string;
  category: 'Ancestral Agronomy & Seeds' | 'Postpartum Broths & Healing' | 'Natural Midwifery & Comfort' | 'Family Rhythms & Proverbs';
  fileFormat: string;
  fileSize: string;
  downloadUrl: string;
  contributedBy: string;
  accessTier: 'Public Preview' | 'Verified PMA Members Only';
  dateAdded: string;
}

export interface MemberVaultSubmission {
  id: string;
  title: string;
  sisterName: string;
  stateCircle: string;
  category: string;
  summary: string;
  submittedAt: string;
  status: 'pending_review' | 'approved' | 'declined';
}

const INITIAL_VOUCHERS: NestBrightVoucher[] = [
  {
    id: 'vouch-1',
    code: 'COPPERMOM25',
    discountType: 'percentage_off',
    discountValue: '25% Off All Grades',
    recipientDescription: 'Standard Village Member Discount for all verified Copper Mommies',
    assignedGradeRange: 'Grades 3 - 5 Master Curriculum',
    maxRedemptions: 500,
    timesRedeemed: 48,
    expiresAt: '2026-12-31',
    status: 'active',
    notes: 'Awareness partnership discount code featured across Copper Mommies platform.'
  },
  {
    id: 'vouch-2',
    code: 'NESTBRIGHT-WINNER-FREE-01',
    discountType: '100_percent_free_contest_winner',
    discountValue: '100% Free Full Year Access ($0.00)',
    recipientDescription: 'Fall 2026 Homeschooling Contest Winner Pass',
    contestWinnerName: 'Mama Keisha Vance (Charleston Circle)',
    assignedGradeRange: 'Grade 4 Complete Curriculum Bundle',
    maxRedemptions: 1,
    timesRedeemed: 1,
    expiresAt: '2027-08-31',
    status: 'claimed',
    notes: 'Awarded to Mama Keisha during the Grandmother Council Harvest Contest Draw.'
  },
  {
    id: 'vouch-3',
    code: 'NESTBRIGHT-WINNER-FREE-02',
    discountType: '100_percent_free_contest_winner',
    discountValue: '100% Free Full Year Access ($0.00)',
    recipientDescription: 'Active Contest Scholarship Pass awaiting winner redemption',
    contestWinnerName: 'Sister Joy Adebayo (Atlanta Circle)',
    assignedGradeRange: 'Grade 3 Complete Curriculum Bundle',
    maxRedemptions: 1,
    timesRedeemed: 0,
    expiresAt: '2027-08-31',
    status: 'active',
    notes: 'Contest winner prize for Sister Joy for twins homeschool preparation.'
  }
];

const INITIAL_DOCS: VaultDocument[] = [
  {
    id: 'vault-1',
    title: 'Heirloom Seed Saving & Traditional Crop Rotation Calendar',
    category: 'Ancestral Agronomy & Seeds',
    fileFormat: 'PDF Guide (18 Pages)',
    fileSize: '4.2 MB',
    downloadUrl: '#seed-saving-guide',
    contributedBy: 'Mama Danielle (NC)',
    accessTier: 'Verified PMA Members Only',
    dateAdded: '2026-08-10'
  },
  {
    id: 'vault-2',
    title: '40-Day Sacred Postpartum Broths, Warming Teas & Porridges Compendium',
    category: 'Postpartum Broths & Healing',
    fileFormat: 'PDF Recipe Book (24 Pages)',
    fileSize: '6.8 MB',
    downloadUrl: '#postpartum-broths-book',
    contributedBy: 'Mama Shantrece (GA)',
    accessTier: 'Verified PMA Members Only',
    dateAdded: '2026-07-15'
  },
  {
    id: 'vault-3',
    title: 'Grandmother Hands: Traditional Comfort Measures for Labor & Delivery',
    category: 'Natural Midwifery & Comfort',
    fileFormat: 'PDF Handbook (14 Pages)',
    fileSize: '3.1 MB',
    downloadUrl: '#midwife-comfort-handbook',
    contributedBy: 'Grandmother Evelyn (GA)',
    accessTier: 'Verified PMA Members Only',
    dateAdded: '2026-08-28'
  }
];

const INITIAL_SUBMISSIONS: MemberVaultSubmission[] = [
  {
    id: 'sub-1',
    title: 'Southern Clay Soil Amendments & Fermented Bio-Fertilizer Recipe',
    sisterName: 'Sister Maya Linwood',
    stateCircle: 'CA (Oakland Circle)',
    category: 'Ancestral Agronomy & Seeds',
    summary: 'A step-by-step ancestral fermentation guide using nettle tea and wood ash to balance garden soil PH.',
    submittedAt: '2026-09-22',
    status: 'pending_review'
  }
];

export default function AdminKinshipNestBright() {
  const [activeTab, setActiveTab] = useState<'nestbright' | 'vault_library' | 'submissions'>('nestbright');
  const [vouchers, setVouchers] = useState<NestBrightVoucher[]>(INITIAL_VOUCHERS);
  const [vaultDocs, setVaultDocs] = useState<VaultDocument[]>(INITIAL_DOCS);
  const [submissions, setSubmissions] = useState<MemberVaultSubmission[]>(INITIAL_SUBMISSIONS);
  
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [showAddVoucherModal, setShowAddVoucherModal] = useState(false);
  const [showAddDocModal, setShowAddDocModal] = useState(false);

  // New Voucher Form
  const [newVoucher, setNewVoucher] = useState<Partial<NestBrightVoucher>>({
    code: '',
    discountType: '100_percent_free_contest_winner',
    discountValue: '100% Free Full Year Access ($0.00)',
    recipientDescription: 'Contest Winner Scholarship Voucher',
    contestWinnerName: '',
    assignedGradeRange: 'Grades 3 - 5 Master Bundle',
    maxRedemptions: 1,
    expiresAt: '2027-08-31',
    notes: 'Awarded to contest winner sister.'
  });

  // New Doc Form
  const [newDoc, setNewDoc] = useState<Partial<VaultDocument>>({
    title: '',
    category: 'Ancestral Agronomy & Seeds',
    fileFormat: 'PDF Guide (Illustrated)',
    fileSize: '3.5 MB',
    downloadUrl: '#',
    contributedBy: 'Mama Shantrece',
    accessTier: 'Verified PMA Members Only'
  });

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(`https://NestBrightAcademy.com?promo=${code}`);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 3000);
  };

  const handleCreateVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVoucher.code) {
      alert('Please enter a voucher code string.');
      return;
    }

    const created: NestBrightVoucher = {
      id: `vouch-${Date.now()}`,
      code: newVoucher.code.toUpperCase().trim(),
      discountType: newVoucher.discountType || '100_percent_free_contest_winner',
      discountValue: newVoucher.discountType === '100_percent_free_contest_winner' 
        ? '100% Free Full Year Access ($0.00)' 
        : (newVoucher.discountValue || '25% Off'),
      recipientDescription: newVoucher.recipientDescription || 'Contest Winner Pass',
      contestWinnerName: newVoucher.contestWinnerName || 'Selected Contest Winner',
      assignedGradeRange: newVoucher.assignedGradeRange || 'Grades 3 - 5',
      maxRedemptions: Number(newVoucher.maxRedemptions) || 1,
      timesRedeemed: 0,
      expiresAt: newVoucher.expiresAt || '2027-08-31',
      status: 'active',
      notes: newVoucher.notes || 'Created via Copper Mommies Back Office.'
    };

    setVouchers(prev => [created, ...prev]);
    setShowAddVoucherModal(false);
    alert(`🎉 NestBright voucher code "${created.code}" created successfully for ${created.contestWinnerName}!`);
  };

  const handleCreateDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoc.title) {
      alert('Please enter a document title.');
      return;
    }

    const created: VaultDocument = {
      id: `vault-${Date.now()}`,
      title: newDoc.title || 'Untitled Document',
      category: newDoc.category || 'Ancestral Agronomy & Seeds',
      fileFormat: newDoc.fileFormat || 'PDF Document',
      fileSize: newDoc.fileSize || '2.5 MB',
      downloadUrl: newDoc.downloadUrl || '#',
      contributedBy: newDoc.contributedBy || 'Village Matriarch',
      accessTier: newDoc.accessTier || 'Verified PMA Members Only',
      dateAdded: new Date().toISOString().slice(0, 10)
    };

    setVaultDocs(prev => [created, ...prev]);
    setShowAddDocModal(false);
    alert(`📚 "${created.title}" added to the Kinship Vault printable library.`);
  };

  const handleApproveSubmission = (id: string, title: string) => {
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status: 'approved' } : s));
    alert(`✨ "${title}" approved and published to the public Kinship Vault.`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#17201D] via-[#24332D] to-[#121B17] text-[#FAF5EE] p-6 rounded-3xl border-2 border-teal-500/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-teal-400 font-mono text-xs uppercase font-extrabold mb-1">
            <Trophy className="w-4 h-4 text-teal-400" />
            <span>NestBright Academy Awareness &amp; Kinship Vault</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#FAF5EE]">
            NestBright Promo Desk &amp; Kinship Vault Library
          </h3>
          <p className="text-xs sm:text-sm text-[#FAF5EE]/80 mt-1 max-w-2xl">
            Generate discount promo codes and 100% free contest winner scholarship passes for <strong>NestBrightAcademy.com</strong>, and manage printable ancestral guides in the Kinship Vault.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={() => setShowAddVoucherModal(true)}
            className="bg-teal-600 hover:bg-teal-500 text-white font-mono text-xs font-bold px-4 py-2.5 rounded-xl flex items-center space-x-2 transition-all shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Contest Voucher</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-copper-penny/20 pb-3">
        <button
          onClick={() => setActiveTab('nestbright')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
            activeTab === 'nestbright'
              ? 'bg-teal-900 text-white shadow-md'
              : 'bg-white/80 text-[#2A221B] hover:bg-white border border-copper-penny/20'
          }`}
        >
          🎟️ NestBright Promo &amp; Contest Vouchers ({vouchers.length})
        </button>

        <button
          onClick={() => setActiveTab('vault_library')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
            activeTab === 'vault_library'
              ? 'bg-teal-900 text-white shadow-md'
              : 'bg-white/80 text-[#2A221B] hover:bg-white border border-copper-penny/20'
          }`}
        >
          📚 Vault Printable Library ({vaultDocs.length})
        </button>

        <button
          onClick={() => setActiveTab('submissions')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
            activeTab === 'submissions'
              ? 'bg-teal-900 text-white shadow-md'
              : 'bg-white/80 text-[#2A221B] hover:bg-white border border-copper-penny/20'
          }`}
        >
          🌱 Member Submissions Review ({submissions.filter(s => s.status === 'pending_review').length} Pending)
        </button>
      </div>

      {/* TAB 1: NESTBRIGHT PROMO & CONTEST CODES */}
      {activeTab === 'nestbright' && (
        <div className="space-y-4">
          <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 text-xs font-sans text-teal-950 flex items-start space-x-3">
            <Sparkles className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">NestBright Academy Integration Note:</strong> Complete Grades 3–5 interactive curriculum packages are served directly to mothers via <strong>NestBrightAcademy.com</strong>. Here in your back office, you create awareness codes (e.g. 25% off) and 100% free passes for contest winners from the sisterhood so they can redeem their full curriculum on NestBright!
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vouchers.map(vouch => (
              <div 
                key={vouch.id}
                className="bg-white rounded-3xl p-5 border border-copper-penny/20 shadow-sm flex flex-col justify-between space-y-4 hover:border-teal-500/50 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      vouch.discountType === '100_percent_free_contest_winner'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-teal-100 text-teal-900 border border-teal-300'
                    }`}>
                      {vouch.discountType === '100_percent_free_contest_winner' ? '🏆 Contest Winner Pass' : 'Discount Voucher'}
                    </span>

                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      vouch.status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      vouch.status === 'claimed' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                      'bg-neutral-100 text-neutral-600'
                    }`}>
                      ● {vouch.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="bg-[#FAF5EE] p-3 rounded-2xl border border-copper-penny/15 text-center space-y-1">
                    <span className="text-[10px] font-mono text-[#2A221B]/60 uppercase tracking-widest block">NestBright Redemption Code</span>
                    <span className="font-mono font-black text-xl text-teal-900 tracking-wider block select-all">
                      {vouch.code}
                    </span>
                    <span className="text-xs font-bold text-amber-900 block font-serif">
                      {vouch.discountValue}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs font-sans">
                    {vouch.contestWinnerName && (
                      <p>
                        <strong className="text-[#1F1813]">Assigned Winner:</strong>{' '}
                        <span className="text-teal-900 font-bold">{vouch.contestWinnerName}</span>
                      </p>
                    )}
                    <p className="text-[#2A221B]/80">{vouch.recipientDescription}</p>
                    <p className="text-[11px] font-mono text-[#2A221B]/60">Target: {vouch.assignedGradeRange}</p>
                  </div>

                  <div className="bg-neutral-50 p-2 rounded-xl text-[10px] font-mono flex items-center justify-between text-[#2A221B]/70">
                    <span>Redemptions: {vouch.timesRedeemed}/{vouch.maxRedemptions}</span>
                    <span>Expires: {vouch.expiresAt}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-copper-penny/10 flex items-center justify-between">
                  <button
                    onClick={() => handleCopyCode(vouch.code, vouch.id)}
                    className="w-full py-2 bg-teal-800 hover:bg-teal-700 text-white rounded-xl text-xs font-mono font-bold flex items-center justify-center space-x-1.5 transition-all shadow-sm cursor-pointer"
                  >
                    {copiedCodeId === vouch.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Copied Promo Link!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy NestBright Link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: VAULT PRINTABLE LIBRARY */}
      {activeTab === 'vault_library' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-serif font-bold text-base text-[#1F1813]">
              Downloadable Ancestral Guides &amp; Handbooks
            </h4>
            <button
              onClick={() => setShowAddDocModal(true)}
              className="bg-teal-700 hover:bg-teal-600 text-white font-mono text-xs font-bold px-3 py-1.5 rounded-xl flex items-center space-x-1.5 cursor-pointer shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add PDF Resource</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {vaultDocs.map(doc => (
              <div key={doc.id} className="bg-white rounded-3xl p-5 border border-copper-penny/20 shadow-sm flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-teal-50 text-teal-900 border border-teal-200">
                      {doc.category}
                    </span>
                    <span className="text-[10px] font-mono text-[#2A221B]/60">{doc.fileSize}</span>
                  </div>

                  <h5 className="font-serif font-bold text-base text-[#1F1813] mt-2">{doc.title}</h5>
                  <p className="text-xs text-[#2A221B]/70 font-sans">Contributed by: <strong>{doc.contributedBy}</strong></p>

                  <div className="bg-[#FAF5EE] p-2.5 rounded-xl text-[11px] font-mono text-[#2A221B]/80 space-y-0.5">
                    <p>Format: {doc.fileFormat}</p>
                    <p>Access: <span className="font-bold text-teal-800">{doc.accessTier}</span></p>
                    <p>Added: {doc.dateAdded}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-copper-penny/10 flex items-center justify-between">
                  <button
                    onClick={() => alert(`📥 Generating member download link for "${doc.title}"...`)}
                    className="px-3 py-1.5 bg-[#FAF5EE] hover:bg-[#F0E6D8] border border-copper-penny/20 rounded-xl text-xs font-mono font-bold text-[#1F1813] flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-teal-700" />
                    <span>Download File</span>
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm(`Remove "${doc.title}" from vault library?`)) {
                        setVaultDocs(prev => prev.filter(d => d.id !== doc.id));
                      }
                    }}
                    className="p-1 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: MEMBER SUBMISSIONS REVIEW */}
      {activeTab === 'submissions' && (
        <div className="bg-white rounded-3xl p-6 border border-copper-penny/20 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-copper-penny/10 pb-3">
            <div>
              <h4 className="font-serif font-bold text-lg text-[#1F1813]">
                Sister Community Vault Contributions
              </h4>
              <p className="text-xs text-[#2A221B]/70 mt-0.5">
                Review and approve traditional knowledge, gardening logs, or family recipes submitted by village mothers before public vault inclusion.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
              {submissions.filter(s => s.status === 'pending_review').length} Pending
            </span>
          </div>

          <div className="divide-y divide-copper-penny/10">
            {submissions.map(sub => (
              <div key={sub.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-sans">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-[#1F1813]">{sub.title}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-teal-100 text-teal-900 border border-teal-300">
                      {sub.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#2A221B]/70 font-mono">
                    Submitted by <strong>{sub.sisterName}</strong> ({sub.stateCircle}) on {sub.submittedAt}
                  </p>
                  <p className="text-[#2A221B]/85 italic bg-[#FAF5EE] p-2 rounded-xl border border-copper-penny/10">
                    "{sub.summary}"
                  </p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  {sub.status === 'pending_review' ? (
                    <>
                      <button
                        onClick={() => handleApproveSubmission(sub.id, sub.title)}
                        className="px-3 py-1.5 bg-teal-700 hover:bg-teal-600 text-white rounded-xl font-mono text-[10px] font-bold cursor-pointer shadow-sm"
                      >
                        Approve &amp; Publish
                      </button>
                      <button
                        onClick={() => setSubmissions(prev => prev.map(s => s.id === sub.id ? { ...s, status: 'declined' } : s))}
                        className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-[#2A221B] rounded-xl font-mono text-[10px] font-bold cursor-pointer"
                      >
                        Decline
                      </button>
                    </>
                  ) : (
                    <span className="px-2.5 py-1 text-xs font-mono font-bold bg-emerald-100 text-emerald-800 rounded-lg">
                      ✓ Published in Vault
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Create Voucher */}
      {showAddVoucherModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF5EE] border-2 border-teal-600 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-copper-penny/20 pb-3">
              <h4 className="font-serif text-lg font-bold text-[#1F1813]">
                Create NestBright Academy Voucher / Pass
              </h4>
              <button onClick={() => setShowAddVoucherModal(false)} className="p-1 rounded-full hover:bg-black/10 cursor-pointer">
                <X className="w-5 h-5 text-[#1F1813]" />
              </button>
            </div>

            <form onSubmit={handleCreateVoucher} className="space-y-3 text-xs font-sans">
              <div>
                <label className="font-bold text-[#1F1813] block mb-1">Promo Code String *</label>
                <input
                  type="text"
                  required
                  value={newVoucher.code || ''}
                  onChange={e => setNewVoucher({ ...newVoucher, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. CONTEST-WINNER-FREE or COPPERMOM2026"
                  className="w-full p-2.5 bg-white border border-copper-penny/20 rounded-xl font-mono uppercase font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#1F1813] block mb-1">Voucher Type</label>
                  <select
                    value={newVoucher.discountType}
                    onChange={e => setNewVoucher({ ...newVoucher, discountType: e.target.value as any })}
                    className="w-full p-2.5 bg-white border border-copper-penny/20 rounded-xl font-mono text-xs"
                  >
                    <option value="100_percent_free_contest_winner">100% Free Contest Pass</option>
                    <option value="percentage_off">Percentage Discount</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#1F1813] block mb-1">Max Redemptions</label>
                  <input
                    type="number"
                    value={newVoucher.maxRedemptions || 1}
                    onChange={e => setNewVoucher({ ...newVoucher, maxRedemptions: Number(e.target.value) })}
                    className="w-full p-2.5 bg-white border border-copper-penny/20 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#1F1813] block mb-1">Contest Winner Sister Name (if applicable)</label>
                <input
                  type="text"
                  value={newVoucher.contestWinnerName || ''}
                  onChange={e => setNewVoucher({ ...newVoucher, contestWinnerName: e.target.value })}
                  placeholder="e.g. Mama Danielle Henderson"
                  className="w-full p-2.5 bg-white border border-copper-penny/20 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-[#1F1813] block mb-1">Target Grade Level</label>
                <input
                  type="text"
                  value={newVoucher.assignedGradeRange || ''}
                  onChange={e => setNewVoucher({ ...newVoucher, assignedGradeRange: e.target.value })}
                  placeholder="e.g. Grades 3 - 5 Master Curriculum"
                  className="w-full p-2.5 bg-white border border-copper-penny/20 rounded-xl"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-copper-penny/20">
                <button
                  type="button"
                  onClick={() => setShowAddVoucherModal(false)}
                  className="px-4 py-2 border border-copper-penny/30 rounded-xl text-xs font-mono font-bold hover:bg-black/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-teal-700 hover:bg-teal-600 text-white rounded-xl text-xs font-mono font-bold shadow-md cursor-pointer transition-all"
                >
                  Generate Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Vault Doc */}
      {showAddDocModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF5EE] border-2 border-teal-600 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-copper-penny/20 pb-3">
              <h4 className="font-serif text-lg font-bold text-[#1F1813]">
                Add Guide to Kinship Vault Library
              </h4>
              <button onClick={() => setShowAddDocModal(false)} className="p-1 rounded-full hover:bg-black/10 cursor-pointer">
                <X className="w-5 h-5 text-[#1F1813]" />
              </button>
            </div>

            <form onSubmit={handleCreateDoc} className="space-y-3 text-xs font-sans">
              <div>
                <label className="font-bold text-[#1F1813] block mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  value={newDoc.title || ''}
                  onChange={e => setNewDoc({ ...newDoc, title: e.target.value })}
                  placeholder="e.g. Ancestral Midwifery & Homebirth Packing Checklist"
                  className="w-full p-2.5 bg-white border border-copper-penny/20 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-[#1F1813] block mb-1">Category</label>
                <select
                  value={newDoc.category}
                  onChange={e => setNewDoc({ ...newDoc, category: e.target.value as any })}
                  className="w-full p-2.5 bg-white border border-copper-penny/20 rounded-xl font-mono text-xs"
                >
                  <option value="Ancestral Agronomy & Seeds">Ancestral Agronomy &amp; Seeds</option>
                  <option value="Postpartum Broths & Healing">Postpartum Broths &amp; Healing</option>
                  <option value="Natural Midwifery & Comfort">Natural Midwifery &amp; Comfort</option>
                  <option value="Family Rhythms & Proverbs">Family Rhythms &amp; Proverbs</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#1F1813] block mb-1">Format</label>
                  <input
                    type="text"
                    value={newDoc.fileFormat || ''}
                    onChange={e => setNewDoc({ ...newDoc, fileFormat: e.target.value })}
                    placeholder="e.g. PDF (12 Pages)"
                    className="w-full p-2.5 bg-white border border-copper-penny/20 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#1F1813] block mb-1">File Size</label>
                  <input
                    type="text"
                    value={newDoc.fileSize || ''}
                    onChange={e => setNewDoc({ ...newDoc, fileSize: e.target.value })}
                    placeholder="e.g. 3.4 MB"
                    className="w-full p-2.5 bg-white border border-copper-penny/20 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-copper-penny/20">
                <button
                  type="button"
                  onClick={() => setShowAddDocModal(false)}
                  className="px-4 py-2 border border-copper-penny/30 rounded-xl text-xs font-mono font-bold hover:bg-black/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-teal-700 hover:bg-teal-600 text-white rounded-xl text-xs font-mono font-bold shadow-md cursor-pointer transition-all"
                >
                  Publish to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
