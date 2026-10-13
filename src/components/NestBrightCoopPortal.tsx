import React, { useState } from 'react';
import { 
  GraduationCap, 
  ExternalLink, 
  Sparkles, 
  Users, 
  BookOpen, 
  Plus, 
  Search, 
  MapPin, 
  CheckCircle2, 
  Share2, 
  MessageSquare, 
  HelpCircle,
  Award,
  Filter,
  Send
} from 'lucide-react';

interface HomeschoolListing {
  id: string;
  type: 'teacher' | 'coop' | 'advice' | 'resource';
  title: string;
  authorName: string;
  authorRole: string;
  stateCode: string;
  description: string;
  grades: string;
  contactHint: string;
  tags: string[];
}

const INITIAL_HOMESCHOOL_LISTINGS: HomeschoolListing[] = [
  {
    id: 'hs-1',
    type: 'teacher',
    title: 'Certified Elementary STEM Teacher & Reading Specialist',
    authorName: 'Sister Maya',
    authorRole: 'Former 4th Grade Public Educator (12 yrs)',
    stateCode: 'GA',
    description: 'Offering Friday hands-on math manipulative sessions and phonics assessments for homeschool mommies in South Fulton & Atlanta. Free advice or barter for farm eggs.',
    grades: 'Grades 2–5',
    contactHint: 'Direct Message in GA Circle',
    tags: ['Elementary Math', 'Reading Mastery', 'Friday Co-op']
  },
  {
    id: 'hs-2',
    type: 'coop',
    title: 'Oakland & Bay Area Nature & Science Learning Pod',
    authorName: 'Mama Shantiece',
    authorRole: 'Homeschooling Mother of 3',
    stateCode: 'CA',
    description: 'Bi-weekly outdoor botanical exploration, nature journaling, and group science experiments. We pool supplies and share teaching duties between 4 families.',
    grades: 'Grades 3–6',
    contactHint: 'Contact Mama Shantiece',
    tags: ['Outdoor Co-Op', 'Nature Science', 'Bay Area']
  },
  {
    id: 'hs-3',
    type: 'advice',
    title: 'Navigating State Homeschool Laws, Portfolios & Umbrella Schools',
    authorName: 'Sister Brenda',
    authorRole: 'State Homeschool Liaison',
    stateCode: 'NC',
    description: 'Don\'t let state paperwork intimidate you. Happy to guide newly homeschooling mothers on letter of intent filing, attendance logs, and high-school transcript building.',
    grades: 'All Ages',
    contactHint: 'Post a question below or message directly',
    tags: ['State Compliance', 'Portfolio Review', 'Legal Support']
  },
  {
    id: 'hs-4',
    type: 'resource',
    title: 'Curriculum Swap: Complete Saxon Math & African Heritage Readers',
    authorName: 'Sister Danielle',
    authorRole: 'Homestead Mother',
    stateCode: 'TX',
    description: 'Gently used Saxon Math 4 set, Singapore Math manipulatives, and 15 heritage history books available for free gift or swap with another homeschooling sister.',
    grades: 'Grades 4–5',
    contactHint: 'Free Gift or Barter in TX Pod',
    tags: ['Math Curriculum', 'Heritage Readers', 'Free Swap']
  }
];

interface NestBrightCoopPortalProps {
  userName?: string;
  userEmail?: string;
  selectedState?: string;
  onShowToast?: (msg: string) => void;
  onOpenDirectChat?: (recipientName: string, contextTitle: string, initialNote?: string) => void;
}

export default function NestBrightCoopPortal({
  userName = 'Mama Shantrece',
  userEmail,
  selectedState = 'GA',
  onShowToast,
  onOpenDirectChat
}: NestBrightCoopPortalProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'teacher' | 'coop' | 'advice' | 'resource'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [listings, setListings] = useState<HomeschoolListing[]>(INITIAL_HOMESCHOOL_LISTINGS);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Listing Form State
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<'teacher' | 'coop' | 'advice' | 'resource'>('coop');
  const [newGrades, setNewGrades] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newTags, setNewTags] = useState('');

  const filteredListings = listings.filter(item => {
    const matchesType = activeFilter === 'all' || item.type === activeFilter;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.authorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleAddListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) return;

    const created: HomeschoolListing = {
      id: `hs-${Date.now()}`,
      type: newType,
      title: newTitle.trim(),
      authorName: userName,
      authorRole: 'Homeschooling Mother',
      stateCode: selectedState,
      description: newDescription.trim(),
      grades: newGrades.trim() || 'All Ages',
      contactHint: `Message ${userName} in ${selectedState} Circle`,
      tags: newTags.split(',').map(t => t.trim()).filter(Boolean)
    };

    setListings([created, ...listings]);
    setShowAddModal(false);
    setNewTitle('');
    setNewDescription('');
    setNewGrades('');
    setNewTags('');
  };

  return (
    <div className="space-y-8 animate-fade-in text-[#1F140E]">
      
      {/* ==================================================== */}
      {/* 1. NESTBRIGHT ACADEMY EXTERNAL PARTNER FEATURE BANNER */}
      {/* ==================================================== */}
      <div className="rounded-3xl bg-gradient-to-br from-[#1C1510] via-[#2A1D16] to-[#120D0A] p-6 sm:p-8 border-2 border-[#D4AF37]/50 shadow-xl text-[#FAF5EE] space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 uppercase tracking-widest flex items-center space-x-1.5">
              <span>🦅</span>
              <span>Featured Homeschool Partner</span>
            </span>
            <span className="text-xs font-mono text-soft-sage">
              Grades 3–5 Elementary Excellence
            </span>
          </div>

          <div className="bg-[#FAF5EE] text-[#1F140E] px-3.5 py-1.5 rounded-2xl font-mono text-xs font-bold border border-[#D4AF37] shadow-sm flex items-center space-x-2">
            <span>Special Village Rate:</span>
            <span className="text-emerald-800 font-extrabold text-sm">$5.99/mo</span>
            <span className="text-gray-400 line-through text-[10px]">$24.99/mo</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-2">
            <h2 className="font-serif font-black text-2xl sm:text-3xl text-[#FAF5EE] tracking-tight">
              NestBright Academy — Your Child’s Flight Path to Excellence
            </h2>
            <p className="text-xs sm:text-sm text-[#FAF5EE]/90 leading-relaxed font-sans max-w-2xl">
              NestBright Academy is our dedicated external curriculum platform designed to inspire mastery, independent thinking, and academic confidence in elementary scholars (Grades 3–5). Rigorous math, science, and literacy learning—built for sovereign homeschooling families.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-xs">
              <span className="bg-white/10 px-2.5 py-1 rounded-lg text-emerald-300">✓ Promo Code: <strong>COPPERMOMMIES</strong></span>
              <span className="bg-white/10 px-2.5 py-1 rounded-lg text-amber-200">✓ 5 Full 1-Year Scholarships Awarded Yearly</span>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-2.5 justify-end">
            <a
              href="https://nestbrightacademy.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-6 bg-gradient-to-r from-[#D4AF37] to-[#B87333] hover:from-[#c29f2f] hover:to-[#a76426] text-[#1F140E] font-serif font-black text-sm rounded-2xl shadow-lg flex items-center justify-center space-x-2 transition-all hover:scale-102 active:scale-98 text-center"
            >
              <span>Visit NestBrightAcademy.com</span>
              <ExternalLink className="w-4 h-4" />
            </a>
            <span className="text-[10px] font-mono text-center text-soft-sage">
              Opens external NestBright learning portal
            </span>
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* 2. HOMESCHOOL MOTHERS CO-OP & COORDINATION SPACE      */}
      {/* ==================================================== */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-copper-penny/20 shadow-sm space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-copper-penny/10 pb-4">
          <div>
            <h3 className="font-serif font-black text-xl text-[#1F1813] flex items-center space-x-2">
              <GraduationCap className="w-6 h-6 text-copper-penny" />
              <span>Homeschooling Mothers Co-Op &amp; Advice Sanctuary</span>
            </h3>
            <p className="text-xs text-soft-sage font-mono mt-0.5">
              Connect with fellow homeschooling mothers, certified sister-teachers, private schooling advice, regional learning pods, and curriculum sharing.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-[#1F140E] hover:bg-[#2A1D16] text-[#D4AF37] font-mono text-xs font-bold rounded-2xl flex items-center space-x-1.5 shadow-sm transition-all cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>+ Share Co-Op / Advice / Service</span>
          </button>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#FAF5EE] p-3 rounded-2xl border border-copper-penny/15">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-copper-penny absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search teachers, subjects, state laws, or pod swaps..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-copper-penny/20 rounded-xl text-xs font-sans focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
            {[
              { id: 'all', label: 'All Listings' },
              { id: 'teacher', label: '👩‍🏫 Certified Teachers' },
              { id: 'coop', label: '🤝 Pod Co-Ops' },
              { id: 'advice', label: '⚖️ Schooling Advice' },
              { id: 'resource', label: '📚 Curriculum Swaps' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id as any)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  activeFilter === f.id
                    ? 'bg-[#1F140E] text-[#D4AF37]'
                    : 'bg-white text-[#1F140E]/80 hover:bg-neutral-100'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredListings.map(item => (
            <div 
              key={item.id}
              className="bg-[#FAF5EE]/70 rounded-2xl p-5 border border-copper-penny/20 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#D4AF37]/50 transition-all"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    item.type === 'teacher' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                    item.type === 'coop' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                    item.type === 'advice' ? 'bg-blue-100 text-blue-900 border border-blue-300' :
                    'bg-purple-100 text-purple-900 border border-purple-300'
                  }`}>
                    {item.type.toUpperCase()} · {item.grades}
                  </span>

                  <span className="text-[11px] font-mono font-bold text-copper-penny">
                    📍 {item.stateCode} Circle
                  </span>
                </div>

                <h4 className="font-serif font-bold text-base text-[#1F1813]">
                  {item.title}
                </h4>

                <p className="text-xs text-[#1F140E]/85 font-sans leading-relaxed">
                  {item.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.tags.map((tag, i) => (
                    <span key={i} className="text-[10px] font-mono bg-white px-2 py-0.5 rounded-md border border-copper-penny/15 text-[#1F140E]/70">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-copper-penny/10 flex items-center justify-between text-xs">
                <div>
                  <strong className="block text-[#1F1813] font-serif">{item.authorName}</strong>
                  <span className="text-[10px] font-mono text-soft-sage">{item.authorRole}</span>
                </div>

                <button
                  onClick={() => {
                    if (onOpenDirectChat) {
                      onOpenDirectChat(item.authorName, item.title, `Hi sister ${item.authorName}, I saw your listing for "${item.title}" in the Homeschool Sanctuary...`);
                    } else {
                      alert(`Message sent to ${item.authorName}!`);
                    }
                  }}
                  className="px-3.5 py-1.5 bg-[#1F140E] hover:bg-[#2A1D16] text-[#D4AF37] font-mono text-xs font-bold rounded-xl flex items-center space-x-1 cursor-pointer transition-all"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Message Sister</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* MODAL: ADD HOMESCHOOL LISTING */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[#FAF5EE] rounded-3xl max-w-lg w-full p-6 sm:p-8 border-2 border-[#D4AF37]/50 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-copper-penny/15 pb-2">
              <h3 className="font-serif font-bold text-lg text-[#1F140E]">
                Post to Homeschool Sanctuary
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#1F140E] p-1 cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleAddListing} className="space-y-3 text-xs font-sans">
              <div>
                <label className="block font-mono text-[11px] font-bold text-gray-700 mb-1">Listing Type</label>
                <select 
                  value={newType} 
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full bg-white border border-copper-penny/25 p-2 rounded-xl"
                >
                  <option value="teacher">Certified Teacher / Specialist</option>
                  <option value="coop">Local Pod / Co-Op Group</option>
                  <option value="advice">Schooling Advice / Compliance Support</option>
                  <option value="resource">Curriculum &amp; Book Swap</option>
                </select>
              </div>

              <div>
                <label className="block font-mono text-[11px] font-bold text-gray-700 mb-1">Title</label>
                <input 
                  type="text" 
                  required
                  value={newTitle} 
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. 4th Grade Math Tutor & Geometry Manipulative Pod"
                  className="w-full bg-white border border-copper-penny/25 p-2 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] font-bold text-gray-700 mb-1">Target Grades</label>
                <input 
                  type="text" 
                  value={newGrades} 
                  onChange={(e) => setNewGrades(e.target.value)}
                  placeholder="e.g. Grades 3–5 or All Ages"
                  className="w-full bg-white border border-copper-penny/25 p-2 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] font-bold text-gray-700 mb-1">Description &amp; Details</label>
                <textarea 
                  required
                  rows={3}
                  value={newDescription} 
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Explain what you are offering or looking for..."
                  className="w-full bg-white border border-copper-penny/25 p-2 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] font-bold text-gray-700 mb-1">Tags (comma separated)</label>
                <input 
                  type="text" 
                  value={newTags} 
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="e.g. STEM, Math, Friday Pod, Atlanta"
                  className="w-full bg-white border border-copper-penny/25 p-2 rounded-xl"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-white border border-copper-penny/20 rounded-xl font-mono text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-[#1F140E] text-[#D4AF37] font-mono text-xs font-bold rounded-xl cursor-pointer"
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
