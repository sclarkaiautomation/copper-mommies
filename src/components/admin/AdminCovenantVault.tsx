import React, { useState } from 'react';
import { 
  ShieldCheck, 
  FileText, 
  Lock, 
  Search, 
  Download, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  Edit3, 
  Save, 
  Eye, 
  X, 
  Globe, 
  Key, 
  Scale, 
  Copy,
  FolderLock
} from 'lucide-react';

export interface SignedCovenantRecord {
  id: string;
  memberId: string;
  fullName: string;
  stateCircle: string;
  signedDate: string;
  signedTimestamp: string;
  signatureText: string;
  covenantVersion: string;
  ipAddressSnapshot: string;
  deviceFingerprint: string;
  legalStanding: 'Executed & Binding' | 'Pending Trustee Countersign';
}

export interface TrustDocument {
  id: string;
  title: string;
  category: 'Charter' | 'Bylaws' | 'Minutes & Resolutions' | 'Legal Opinions';
  effectiveDate: string;
  version: string;
  fileFormat: string;
  status: 'Active & Irrevocable' | 'Annual Review 2026';
  description: string;
}

export interface StateBotanicalRule {
  stateCode: string;
  stateName: string;
  statuteCitation: string;
  legalSafeHarborStatus: 'High Autonomy (Health Freedom Act)' | 'Exemption for Traditional Folk Healers' | 'PMA Protection Mandatory';
  noticeText: string;
  lastUpdated: string;
}

const INITIAL_COVENANTS: SignedCovenantRecord[] = [
  {
    id: 'cov-001',
    memberId: 'PMA-2026-GA-001',
    fullName: 'Mama Shantrece (Founder Trustee)',
    stateCircle: 'GA (Atlanta Circle)',
    signedDate: '2026-01-01',
    signedTimestamp: '2026-01-01 00:01:00 UTC',
    signatureText: 'Mama Shantrece',
    covenantVersion: 'v2026.4 - Private Sanctuary & Herbal Freedom',
    ipAddressSnapshot: '174.212.89.14 (Atlanta, GA, US)',
    deviceFingerprint: 'macOS / Safari (SHA256: 9b2d8e41a...f82)',
    legalStanding: 'Executed & Binding'
  },
  {
    id: 'cov-002',
    memberId: 'PMA-2026-SC-004',
    fullName: 'Mama Keisha Vance',
    stateCircle: 'SC (Charleston Circle)',
    signedDate: '2026-02-14',
    signedTimestamp: '2026-02-14 16:22:45 UTC',
    signatureText: 'Keisha Vance',
    covenantVersion: 'v2026.4 - Private Sanctuary & Herbal Freedom',
    ipAddressSnapshot: '98.114.201.78 (Charleston, SC, US)',
    deviceFingerprint: 'iOS / Mobile WebKit (SHA256: 3c1a998b...e10)',
    legalStanding: 'Executed & Binding'
  },
  {
    id: 'cov-003',
    memberId: 'PMA-2026-NC-007',
    fullName: 'Mama Danielle Henderson',
    stateCircle: 'NC (Charlotte Circle)',
    signedDate: '2026-03-02',
    signedTimestamp: '2026-03-02 11:08:19 UTC',
    signatureText: 'Danielle Henderson',
    covenantVersion: 'v2026.4 - Private Sanctuary & Herbal Freedom',
    ipAddressSnapshot: '162.247.74.5 (Charlotte, NC, US)',
    deviceFingerprint: 'Windows 11 / Chrome (SHA256: 77a102c9...d44)',
    legalStanding: 'Executed & Binding'
  },
  {
    id: 'cov-004',
    memberId: 'PMA-2026-GA-018',
    fullName: 'Sister Joy Adebayo',
    stateCircle: 'GA (Atlanta Circle)',
    signedDate: '2026-04-10',
    signedTimestamp: '2026-04-10 19:40:12 UTC',
    signatureText: 'Joy Adebayo',
    covenantVersion: 'v2026.4 - Private Sanctuary & Herbal Freedom',
    ipAddressSnapshot: '73.180.45.192 (Decatur, GA, US)',
    deviceFingerprint: 'Android / Mobile Chrome (SHA256: d5e23901...a87)',
    legalStanding: 'Executed & Binding'
  },
  {
    id: 'cov-005',
    memberId: 'PMA-2026-CA-012',
    fullName: 'Sister Maya Linwood',
    stateCircle: 'CA (Oakland Circle)',
    signedDate: '2026-05-20',
    signedTimestamp: '2026-05-20 15:14:03 UTC',
    signatureText: 'Maya Linwood',
    covenantVersion: 'v2026.4 - Private Sanctuary & Herbal Freedom',
    ipAddressSnapshot: '67.180.12.91 (Oakland, CA, US)',
    deviceFingerprint: 'macOS / Firefox (SHA256: 41bba673...201)',
    legalStanding: 'Executed & Binding'
  }
];

const INITIAL_TRUST_DOCS: TrustDocument[] = [
  {
    id: 'doc-1',
    title: 'Declaration of Ecclesiastical & Sovereign Trust',
    category: 'Charter',
    effectiveDate: 'January 1, 2026',
    version: '2026.1 (Perpetual)',
    fileFormat: 'Official Seal PDF (Signed)',
    status: 'Active & Irrevocable',
    description: 'Establishes Copper Mommies as an irrevocable 508(c)(1)(a) faith-based indigenous & maternal wellness trust operating in the private domain.'
  },
  {
    id: 'doc-2',
    title: 'Articles of Association & Private Membership Bylaws',
    category: 'Bylaws',
    effectiveDate: 'January 1, 2026',
    version: '2026.3',
    fileFormat: 'Bylaws Ledger PDF',
    status: 'Active & Irrevocable',
    description: 'Defines the rights of private members, mutual aid barter rules, grandmother council quorum mechanisms, and private dispute resolution.'
  },
  {
    id: 'doc-3',
    title: 'Grandmother Council Annual Resolution & Trustee Minutes 2026',
    category: 'Minutes & Resolutions',
    effectiveDate: 'September 1, 2026',
    version: 'Q3-2026',
    fileFormat: 'Council Minutes PDF',
    status: 'Annual Review 2026',
    description: 'Ratification of state spearhead roles, mutual aid seed fund limits, and approval of NestBright Academy homeschooling awareness voucher program.'
  }
];

const INITIAL_STATE_RULES: StateBotanicalRule[] = [
  {
    stateCode: 'GA',
    stateName: 'Georgia',
    statuteCitation: 'O.C.G.A. § 43-34-22 (Safe Harbor for Non-Medical Folk Herbology)',
    legalSafeHarborStatus: 'Exemption for Traditional Folk Healers',
    noticeText: 'NOTICE: In Georgia, botanical consultations and traditional herbal teas are shared under our private membership covenant. Practitioners do not diagnose, treat, or cure diseases under Georgia medical practice statutes. All discussions occur exclusively within the private domain of Copper Mommies PMA.',
    lastUpdated: '2026-09-01'
  },
  {
    stateCode: 'NC',
    stateName: 'North Carolina',
    statuteCitation: 'N.C. Gen. Stat. § 90-18.4 (Traditional Botanical & Nutritional Wellness)',
    legalSafeHarborStatus: 'Exemption for Traditional Folk Healers',
    noticeText: 'NOTICE: In North Carolina, botanical recommendations are protected under sovereign private contract. Members exercise their fundamental right to access traditional nourishment, lactation teas, and ancestral roots in accordance with PMA bylaws.',
    lastUpdated: '2026-08-15'
  },
  {
    stateCode: 'CA',
    stateName: 'California',
    statuteCitation: 'Cal. Bus. & Prof. Code §§ 2053.5 & 2053.6 (California Health Freedom Act - SB 577)',
    legalSafeHarborStatus: 'High Autonomy (Health Freedom Act)',
    noticeText: 'NOTICE: In California, complementary and alternative health services are legally recognized under SB 577. Copper Mommies practitioners are not licensed physicians; recommendations are holistic, traditional, and shared between consenting private members.',
    lastUpdated: '2026-07-20'
  },
  {
    stateCode: 'SC',
    stateName: 'South Carolina',
    statuteCitation: 'S.C. Code Ann. § 40-47-30 (Private Contractual & Religious Care Protections)',
    legalSafeHarborStatus: 'PMA Protection Mandatory',
    noticeText: 'NOTICE: In South Carolina, all herbal dispensations, postpartum broths, and birth-support mutual aid occur strictly under the autonomous religious and ecclesiastical umbrella of our 508(c)(1)(a) trust.',
    lastUpdated: '2026-09-10'
  }
];

export default function AdminCovenantVault() {
  const [activeTab, setActiveTab] = useState<'covenants' | 'trust_docs' | 'state_rules'>('covenants');
  const [covenants, setCovenants] = useState<SignedCovenantRecord[]>(INITIAL_COVENANTS);
  const [trustDocs, setTrustDocs] = useState<TrustDocument[]>(INITIAL_TRUST_DOCS);
  const [stateRules, setStateRules] = useState<StateBotanicalRule[]>(INITIAL_STATE_RULES);
  
  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [stateFilter, setStateFilter] = useState('ALL');

  // Selected covenant for full legal modal
  const [viewingCovenant, setViewingCovenant] = useState<SignedCovenantRecord | null>(null);

  // Editing state compliance rule
  const [editingStateCode, setEditingStateCode] = useState<string | null>(null);
  const [editedNoticeText, setEditedNoticeText] = useState('');

  const filteredCovenants = covenants.filter(c => {
    const matchesSearch = c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.memberId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.ipAddressSnapshot.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesState = stateFilter === 'ALL' || c.stateCircle.includes(stateFilter);
    return matchesSearch && matchesState;
  });

  const handleExportCSV = () => {
    const headers = ['MemberID', 'FullName', 'State', 'SignedDate', 'Signature', 'Version', 'IPAddress', 'Standing'];
    const rows = covenants.map(c => [
      c.memberId,
      `"${c.fullName}"`,
      c.stateCircle,
      c.signedDate,
      `"${c.signatureText}"`,
      `"${c.covenantVersion}"`,
      `"${c.ipAddressSnapshot}"`,
      c.legalStanding
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PMA_Signed_Covenants_Audit_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveStateRule = (stateCode: string) => {
    setStateRules(prev => prev.map(sr => sr.stateCode === stateCode ? { ...sr, noticeText: editedNoticeText, lastUpdated: '2026-09-26 (Just now)' } : sr));
    setEditingStateCode(null);
    alert(`⚖️ Legal Botanical Compliance Notice for ${stateCode} updated successfully.`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#171A24] via-[#222838] to-[#12141C] text-[#FAF5EE] p-6 rounded-3xl border-2 border-indigo-500/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 font-mono text-xs uppercase font-extrabold mb-1">
            <Lock className="w-4 h-4 text-indigo-400" />
            <span>Ecclesiastical Trust &amp; Private Jurisdiction</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#FAF5EE]">
            508(c)(1)(a) PMA Legal &amp; Signed Covenant Audit Vault
          </h3>
          <p className="text-xs sm:text-sm text-[#FAF5EE]/80 mt-1 max-w-2xl">
            Maintain the immutable digital audit trail of member e-signatures, manage foundational 508(c)(1)(a) trust charters, and update state botanical safe-harbor disclaimers.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={handleExportCSV}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold px-4 py-2.5 rounded-xl flex items-center space-x-2 transition-all shadow-md cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Audit CSV</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-copper-penny/20 pb-3">
        <button
          onClick={() => setActiveTab('covenants')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
            activeTab === 'covenants'
              ? 'bg-indigo-900 text-white shadow-md'
              : 'bg-white/80 text-[#2A221B] hover:bg-white border border-copper-penny/20'
          }`}
        >
          📜 Signed Member Covenants ({covenants.length} Audited)
        </button>

        <button
          onClick={() => setActiveTab('trust_docs')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
            activeTab === 'trust_docs'
              ? 'bg-indigo-900 text-white shadow-md'
              : 'bg-white/80 text-[#2A221B] hover:bg-white border border-copper-penny/20'
          }`}
        >
          🏛️ 508(c)(1)(a) Trust Charters &amp; Bylaws ({trustDocs.length})
        </button>

        <button
          onClick={() => setActiveTab('state_rules')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
            activeTab === 'state_rules'
              ? 'bg-indigo-900 text-white shadow-md'
              : 'bg-white/80 text-[#2A221B] hover:bg-white border border-copper-penny/20'
          }`}
        >
          ⚖️ State Botanical Compliance Editor ({stateRules.length} States)
        </button>
      </div>

      {/* TAB 1: SIGNED COVENANTS LEDGER */}
      {activeTab === 'covenants' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-3 text-[#2A221B]/40" />
              <input
                type="text"
                placeholder="Search member name, ID, or IP snapshot..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-white rounded-xl border border-copper-penny/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
              />
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-[#2A221B]/60" />
              <select
                value={stateFilter}
                onChange={e => setStateFilter(e.target.value)}
                className="text-xs bg-white rounded-xl border border-copper-penny/20 px-3 py-2 font-mono"
              >
                <option value="ALL">All State Chapters</option>
                <option value="GA">Georgia (GA)</option>
                <option value="SC">South Carolina (SC)</option>
                <option value="NC">North Carolina (NC)</option>
                <option value="CA">California (CA)</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-copper-penny/20 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF5EE] text-[#1F1813] font-mono uppercase text-[10px] border-b border-copper-penny/20">
                  <tr>
                    <th className="p-3.5">Member Identity</th>
                    <th className="p-3.5">State Chapter</th>
                    <th className="p-3.5">Execution Timestamp</th>
                    <th className="p-3.5">E-Signature / IP Snapshot</th>
                    <th className="p-3.5">Jurisdiction Standing</th>
                    <th className="p-3.5 text-right">Audit Proof</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-copper-penny/10">
                  {filteredCovenants.map(cov => (
                    <tr key={cov.id} className="hover:bg-indigo-50/30">
                      <td className="p-3.5">
                        <p className="font-bold text-[#1F1813]">{cov.fullName}</p>
                        <p className="font-mono text-[10px] text-indigo-700">{cov.memberId}</p>
                      </td>
                      <td className="p-3.5 font-mono text-[11px] font-bold text-[#1F1813]">
                        {cov.stateCircle}
                      </td>
                      <td className="p-3.5 font-mono text-[11px]">
                        <span className="block text-[#1F1813]">{cov.signedDate}</span>
                        <span className="text-[10px] text-[#2A221B]/60">{cov.signedTimestamp}</span>
                      </td>
                      <td className="p-3.5 space-y-0.5">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-serif italic font-bold text-[#1F1813]">"{cov.signatureText}"</span>
                          <span className="text-[9px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-1 rounded font-mono">Verified</span>
                        </div>
                        <p className="font-mono text-[10px] text-[#2A221B]/60">{cov.ipAddressSnapshot}</p>
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-100 text-indigo-900 border border-indigo-300">
                          {cov.legalStanding}
                        </span>
                        <p className="text-[9px] text-[#2A221B]/60 font-mono mt-0.5">{cov.covenantVersion}</p>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => setViewingCovenant(cov)}
                          className="px-2.5 py-1 text-[10px] font-mono font-bold bg-[#FAF5EE] hover:bg-indigo-50 border border-copper-penny/20 rounded-lg flex items-center space-x-1 ml-auto cursor-pointer"
                        >
                          <Eye className="w-3 h-3 text-indigo-700" />
                          <span>View Proof</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: 508(c)(1)(a) TRUST REPOSITORY */}
      {activeTab === 'trust_docs' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {trustDocs.map(doc => (
            <div key={doc.id} className="bg-white rounded-3xl p-5 border border-copper-penny/20 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-50 text-indigo-900 border border-indigo-200 uppercase">
                    {doc.category}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {doc.status}
                  </span>
                </div>

                <h4 className="font-serif font-bold text-base text-[#1F1813] mt-2">{doc.title}</h4>
                <p className="text-xs text-[#2A221B]/80 font-sans leading-relaxed">{doc.description}</p>

                <div className="bg-[#FAF5EE] p-2.5 rounded-xl border border-copper-penny/10 text-[11px] font-mono space-y-1">
                  <p><strong>Effective:</strong> {doc.effectiveDate}</p>
                  <p><strong>Version:</strong> {doc.version}</p>
                  <p><strong>Format:</strong> {doc.fileFormat}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-copper-penny/10 flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#2A221B]/60">Seal Verified</span>
                <button
                  onClick={() => alert(`📑 Displaying verified document: "${doc.title}". Official 508(c)(1)(a) seal confirmed.`)}
                  className="px-3 py-1.5 bg-indigo-900 hover:bg-indigo-800 text-white rounded-xl text-xs font-mono font-bold flex items-center space-x-1 cursor-pointer"
                >
                  <Eye className="w-3 h-3" />
                  <span>Inspect Document</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: STATE BOTANICAL COMPLIANCE EDITOR */}
      {activeTab === 'state_rules' && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 text-xs font-sans text-amber-950 flex items-start space-x-2">
            <Scale className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">Autonomous State Legal Editor:</strong> These legal disclosures are displayed automatically on member dashboards, custom apothecary checkout steps, and consultation intakes based on the mother’s resident state. Updating these notices updates the legal disclaimers immediately without code deployments.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stateRules.map(rule => (
              <div key={rule.stateCode} className="bg-white rounded-3xl p-5 border border-copper-penny/20 shadow-sm space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="w-8 h-8 rounded-xl bg-indigo-900 text-white font-mono font-bold flex items-center justify-center text-xs">
                        {rule.stateCode}
                      </span>
                      <div>
                        <h4 className="font-serif font-bold text-base text-[#1F1813]">{rule.stateName}</h4>
                        <span className="text-[10px] font-mono text-[#2A221B]/60">{rule.statuteCitation}</span>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      {rule.legalSafeHarborStatus}
                    </span>
                  </div>

                  {editingStateCode === rule.stateCode ? (
                    <div className="space-y-2 pt-2">
                      <textarea
                        rows={5}
                        value={editedNoticeText}
                        onChange={e => setEditedNoticeText(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border border-indigo-400 focus:ring-2 focus:ring-indigo-500 font-sans bg-[#FAF5EE]"
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => setEditingStateCode(null)}
                          className="px-3 py-1.5 rounded-lg border border-copper-penny/20 text-xs font-mono cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveStateRule(rule.stateCode)}
                          className="px-4 py-1.5 bg-indigo-800 hover:bg-indigo-700 text-white rounded-lg text-xs font-mono font-bold flex items-center space-x-1 cursor-pointer"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save Notice</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-[#FAF5EE] p-3 rounded-2xl border border-copper-penny/15 text-xs font-sans text-[#2A221B] leading-relaxed">
                      "{rule.noticeText}"
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-copper-penny/10 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-[#2A221B]/60">Updated: {rule.lastUpdated}</span>
                  {editingStateCode !== rule.stateCode && (
                    <button
                      onClick={() => {
                        setEditingStateCode(rule.stateCode);
                        setEditedNoticeText(rule.noticeText);
                      }}
                      className="px-2.5 py-1 text-[11px] font-mono font-bold text-indigo-700 hover:bg-indigo-50 rounded-lg flex items-center space-x-1 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit Statutory Text</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Full Legal Proof Inspection */}
      {viewingCovenant && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF5EE] border-2 border-indigo-600 rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-copper-penny/20 pb-3">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-indigo-700" />
                <h4 className="font-serif text-lg font-bold text-[#1F1813]">
                  Digital Covenant Audit Certificate
                </h4>
              </div>
              <button onClick={() => setViewingCovenant(null)} className="p-1 rounded-full hover:bg-black/10 cursor-pointer">
                <X className="w-5 h-5 text-[#1F1813]" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-sans">
              <div className="bg-white p-3.5 rounded-2xl border border-copper-penny/20 space-y-1">
                <p><strong>Signatory Sister:</strong> {viewingCovenant.fullName}</p>
                <p><strong>PMA Membership Identifier:</strong> {viewingCovenant.memberId}</p>
                <p><strong>Resident Chapter:</strong> {viewingCovenant.stateCircle}</p>
                <p><strong>Exact Execution Moment:</strong> {viewingCovenant.signedTimestamp}</p>
                <p><strong>Network IP Snapshot:</strong> {viewingCovenant.ipAddressSnapshot}</p>
                <p><strong>Browser Hash Token:</strong> <code className="font-mono text-[10px] text-indigo-800">{viewingCovenant.deviceFingerprint}</code></p>
              </div>

              <div className="bg-indigo-50 border border-indigo-200 p-3.5 rounded-2xl space-y-2">
                <span className="font-bold text-indigo-950 font-mono text-[11px] block uppercase">
                  Declarations Signed In The Private Domain:
                </span>
                <p className="text-[#2A221B] leading-relaxed text-[11px]">
                  "I hereby affirm my voluntary entry into the private, ecclesiastical, and non-commercial fellowship of Copper Mommies PMA under 26 U.S.C. § 508(c)(1)(a). I knowingly reserve all my unalienable rights under natural law, common law, and the First and Fourteenth Amendments. All exchanges of botanical knowledge, maternal remedies, and mutual aid occur strictly outside the public jurisdiction of state medical boards."
                </p>
                <div className="pt-2 border-t border-indigo-200 flex items-center justify-between font-mono text-[10px]">
                  <span>Typed Signature: <strong className="font-serif italic text-xs">{viewingCovenant.signatureText}</strong></span>
                  <span className="text-emerald-700 font-bold">● Legally Enforceable</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-copper-penny/20">
              <button
                onClick={() => setViewingCovenant(null)}
                className="px-5 py-2 bg-indigo-900 hover:bg-indigo-800 text-white rounded-xl text-xs font-mono font-bold cursor-pointer"
              >
                Close Audit Proof
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
