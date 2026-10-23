import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  X, 
  Sparkles, 
  ChevronRight,
  Tag
} from 'lucide-react';
import { 
  POPULAR_HASHTAGS, 
  SAMPLE_ACADEMY_COURSES, 
  SearchResultItem 
} from '../data/globalHashtagData';
import { INITIAL_COMMONS_POSTS, INITIAL_VOUCHED_BUSINESSES, INITIAL_HOUSING_LISTINGS } from '../data/villageCommonsData';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
  onNavigateTab: (tab: any, subTab?: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  initialQuery = '',
  onNavigateTab
}) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [filterType, setFilterType] = useState<'all' | 'course' | 'forum_post' | 'barter_trade' | 'housing' | 'sister_business'>('all');

  useEffect(() => {
    if (initialQuery) {
      setSearchQuery(initialQuery);
    }
  }, [initialQuery]);

  // Clean raw term (strips leading # or @ if present)
  const cleanTerm = useMemo(() => {
    return searchQuery.trim().replace(/^[#@]/, '');
  }, [searchQuery]);

  // Execute Search across all 5 ecosystem domains
  const searchResults = useMemo(() => {
    if (!cleanTerm) {
      // If empty query, show all sample courses + top posts + businesses
      const defaultItems: SearchResultItem[] = [
        ...SAMPLE_ACADEMY_COURSES,
        ...INITIAL_COMMONS_POSTS.slice(0, 3).map(p => ({
          id: p.id,
          title: p.title || 'Village Forum Reflection',
          snippet: p.content,
          typeLabel: '💬 Village Forum Post',
          typeCategory: 'forum_post' as const,
          locationOrCategory: `${p.authorCity}, ${p.authorState}`,
          authorOrOwner: p.authorName,
          imageUrl: p.imageUrl,
          linkTab: 'commons' as const
        })),
        ...INITIAL_VOUCHED_BUSINESSES.slice(0, 2).map(b => ({
          id: b.id,
          title: b.name,
          snippet: b.offerDescription,
          typeLabel: '🌿 Vouched Sister Business',
          typeCategory: 'sister_business' as const,
          locationOrCategory: `${b.locationCity}, ${b.locationState}`,
          authorOrOwner: b.ownerName,
          imageUrl: b.imageUrl,
          linkTab: 'commons' as const,
          subTab: 'businesses'
        }))
      ];
      return defaultItems;
    }

    const termLower = cleanTerm.toLowerCase();
    const results: SearchResultItem[] = [];

    // 1. Academy Courses
    SAMPLE_ACADEMY_COURSES.forEach(c => {
      if (
        c.title.toLowerCase().includes(termLower) ||
        c.snippet.toLowerCase().includes(termLower) ||
        c.locationOrCategory.toLowerCase().includes(termLower)
      ) {
        results.push(c);
      }
    });

    // 2. Village Commons Posts & Comments
    INITIAL_COMMONS_POSTS.forEach(p => {
      const matchPost = (p.title && p.title.toLowerCase().includes(termLower)) ||
        p.content.toLowerCase().includes(termLower) ||
        p.topic.toLowerCase().includes(termLower) ||
        p.authorName.toLowerCase().includes(termLower);
      
      const matchComment = p.comments.some(c => c.content.toLowerCase().includes(termLower) || c.authorName.toLowerCase().includes(termLower));

      if (matchPost || matchComment) {
        results.push({
          id: p.id,
          title: p.title || 'Village Forum Reflection',
          snippet: p.content,
          typeLabel: '💬 Forum Post & Discussion',
          typeCategory: 'forum_post',
          locationOrCategory: `${p.authorCity}, ${p.authorState} • ${p.topic}`,
          authorOrOwner: p.authorName,
          imageUrl: p.imageUrl,
          linkTab: 'commons'
        });
      }
    });

    // 3. Barter Trades & Exchange Items
    const sampleBarterItems = [
      {
        id: 'trade-1',
        title: 'Heirloom Seed Swap & Clemson Spineless Okra',
        snippet: 'Offering 50 packets of heirloom seed stock for homemade goat milk soap or elderberry syrup.',
        typeLabel: '🤝 Barter & Exchange',
        typeCategory: 'barter_trade' as const,
        locationOrCategory: 'Decatur, GA • Seed Exchange',
        authorOrOwner: 'Mama Danielle',
        imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d69106093?auto=format&fit=crop&w=800&q=80',
        linkTab: 'economy' as const
      },
      {
        id: 'trade-2',
        title: 'Homeschool Curriculum Swap & Montessori Bookcase',
        snippet: 'Offering custom low-shelf bookcase for farm fresh eggs or co-op garden help.',
        typeLabel: '🤝 Barter & Exchange',
        typeCategory: 'barter_trade' as const,
        locationOrCategory: 'Atlanta, GA • Curriculum & Woodwork',
        authorOrOwner: 'Reginald Clark',
        imageUrl: '/coppermommies-selflove1-cmc.jpg',
        linkTab: 'economy' as const
      },
      {
        id: 'trade-3',
        title: 'Co-op Childcare Swap & Rotational Playdates',
        snippet: 'Tuesday & Thursday morning rotational mother care for ages 3-8 in Atlanta Metro.',
        typeLabel: '🤝 Barter & Exchange',
        typeCategory: 'barter_trade' as const,
        locationOrCategory: 'Atlanta, GA • Childcare Circle',
        authorOrOwner: 'Sister Nia',
        imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80',
        linkTab: 'economy' as const
      }
    ];

    sampleBarterItems.forEach(b => {
      if (
        b.title.toLowerCase().includes(termLower) ||
        b.snippet.toLowerCase().includes(termLower) ||
        b.locationOrCategory.toLowerCase().includes(termLower)
      ) {
        results.push(b);
      }
    });

    // 4. Housing & Respite Listings
    INITIAL_HOUSING_LISTINGS.forEach(h => {
      const summaryText = `${h.pricingTerms} • ${h.rulesAndExpectations}`;
      if (
        h.title.toLowerCase().includes(termLower) ||
        summaryText.toLowerCase().includes(termLower) ||
        h.regionOrCity.toLowerCase().includes(termLower) ||
        h.spaceType.toLowerCase().includes(termLower)
      ) {
        results.push({
          id: h.id,
          title: h.title,
          snippet: summaryText,
          typeLabel: '🏡 Housing & Respite Space',
          typeCategory: 'housing',
          locationOrCategory: `${h.regionOrCity}, ${h.stateCode} • ${h.pricingTerms}`,
          authorOrOwner: h.authorName,
          imageUrl: h.imageUrl,
          linkTab: 'commons',
          subTab: 'housing'
        });
      }
    });

    // 5. Sister Businesses
    INITIAL_VOUCHED_BUSINESSES.forEach(b => {
      if (
        b.name.toLowerCase().includes(termLower) ||
        b.offerDescription.toLowerCase().includes(termLower) ||
        b.industry.toLowerCase().includes(termLower) ||
        b.ownerName.toLowerCase().includes(termLower)
      ) {
        results.push({
          id: b.id,
          title: b.name,
          snippet: b.offerDescription,
          typeLabel: '🌿 Vouched Sister Business',
          typeCategory: 'sister_business',
          locationOrCategory: `${b.locationCity}, ${b.locationState} • ${b.industry}`,
          authorOrOwner: b.ownerName,
          imageUrl: b.imageUrl,
          linkTab: 'commons',
          subTab: 'businesses'
        });
      }
    });

    return results;
  }, [cleanTerm]);

  // Filtered list based on active category chip
  const filteredResults = useMemo(() => {
    if (filterType === 'all') return searchResults;
    return searchResults.filter(r => r.typeCategory === filterType);
  }, [searchResults, filterType]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F140E]/70 backdrop-blur-sm p-3 sm:p-4 animate-fade-in">
      <div className="bg-[#FAF5EE] border-2 border-[#D4AF37] w-full max-w-3xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* HEADER BAR */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#1F140E] via-[#2A1D16] to-[#1F140E] text-[#FAF5EE] flex items-center justify-between border-b border-[#D4AF37]/30">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D4AF37] text-[#1F140E] flex items-center justify-center font-bold shadow-sm">
              <Sparkles className="w-5 h-5 text-[#1F140E]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-serif font-bold text-[#D4AF37]">
                Global Sitewide Hashtag & Ecosystem Search
              </h2>
              <p className="text-xs text-[#FAF5EE]/80 font-sans">
                Surfacing courses, marketplace trades, forum discussions, housing & sister businesses
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SEARCH INPUT BAR */}
        <div className="p-4 bg-white border-b border-copper-penny/15 space-y-3">
          <div className="relative">
            <Search className="w-5 h-5 text-[#B87333] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Type any tag or topic e.g. #SeedPreservation, #FamilyWealth, #Apothecary101, #CurriculumSwap..."
              className="w-full pl-11 pr-10 py-3 bg-[#FAF5EE] border-2 border-copper-penny/30 rounded-2xl text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-[#1F140E] font-medium"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* QUICK POPULAR HASHTAG PILLS */}
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-mono font-bold text-soft-sage flex items-center space-x-1">
              <Tag className="w-3 h-3 text-[#D4AF37]" />
              <span>Popular Ecosystem Hashtags:</span>
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {POPULAR_HASHTAGS.map(ht => (
                <button
                  key={ht.tag}
                  onClick={() => setSearchQuery(ht.tag)}
                  className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold transition-all whitespace-nowrap cursor-pointer ${
                    cleanTerm.toLowerCase() === ht.tag.replace('#','').toLowerCase()
                      ? 'bg-[#1F140E] text-[#D4AF37] shadow-sm border border-[#D4AF37]'
                      : 'bg-[#FAF5EE] hover:bg-[#F0E6D8] text-[#1F140E] border border-copper-penny/20'
                  }`}
                >
                  {ht.tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* DOMAIN FILTER CHIPS */}
        <div className="px-4 py-2.5 bg-[#FAF5EE] border-b border-copper-penny/10 flex items-center gap-2 overflow-x-auto scrollbar-none text-xs font-mono font-bold">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              filterType === 'all'
                ? 'bg-[#1F140E] text-[#D4AF37]'
                : 'bg-white text-[#1F140E]/80 hover:bg-gray-100 border border-copper-penny/20'
            }`}
          >
            All Results ({searchResults.length})
          </button>
          <button
            onClick={() => setFilterType('course')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center space-x-1 ${
              filterType === 'course'
                ? 'bg-[#1F140E] text-[#D4AF37]'
                : 'bg-white text-[#1F140E]/80 hover:bg-gray-100 border border-copper-penny/20'
            }`}
          >
            <span>🎓</span>
            <span>Academy Courses</span>
          </button>
          <button
            onClick={() => setFilterType('forum_post')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center space-x-1 ${
              filterType === 'forum_post'
                ? 'bg-[#1F140E] text-[#D4AF37]'
                : 'bg-white text-[#1F140E]/80 hover:bg-gray-100 border border-copper-penny/20'
            }`}
          >
            <span>💬</span>
            <span>Forum Discussions</span>
          </button>
          <button
            onClick={() => setFilterType('barter_trade')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center space-x-1 ${
              filterType === 'barter_trade'
                ? 'bg-[#1F140E] text-[#D4AF37]'
                : 'bg-white text-[#1F140E]/80 hover:bg-gray-100 border border-copper-penny/20'
            }`}
          >
            <span>🤝</span>
            <span>Barter & Trades</span>
          </button>
          <button
            onClick={() => setFilterType('housing')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center space-x-1 ${
              filterType === 'housing'
                ? 'bg-[#1F140E] text-[#D4AF37]'
                : 'bg-white text-[#1F140E]/80 hover:bg-gray-100 border border-copper-penny/20'
            }`}
          >
            <span>🏡</span>
            <span>Housing</span>
          </button>
          <button
            onClick={() => setFilterType('sister_business')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center space-x-1 ${
              filterType === 'sister_business'
                ? 'bg-[#1F140E] text-[#D4AF37]'
                : 'bg-white text-[#1F140E]/80 hover:bg-gray-100 border border-copper-penny/20'
            }`}
          >
            <span>🌿</span>
            <span>Sister Businesses</span>
          </button>
        </div>

        {/* RESULTS LIST */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cleanTerm && (
            <div className="text-xs font-mono text-soft-sage font-bold pb-1 flex items-center justify-between border-b border-copper-penny/10">
              <span>Results matching "{searchQuery}":</span>
              <span>{filteredResults.length} item(s) found</span>
            </div>
          )}

          {filteredResults.length === 0 ? (
            <div className="py-12 text-center space-y-3 bg-white rounded-3xl p-6 border border-dashed border-copper-penny/30">
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-800 mx-auto flex items-center justify-center font-bold text-xl">
                🔍
              </div>
              <h3 className="text-sm font-serif font-bold text-[#1F140E]">
                No matching results found for "{searchQuery}"
              </h3>
              <p className="text-xs text-soft-sage max-w-md mx-auto">
                Try searching for broader terms like <code className="bg-[#FAF5EE] px-1 py-0.5 rounded text-amber-900">#SeedPreservation</code>, <code className="bg-[#FAF5EE] px-1 py-0.5 rounded text-amber-900">#FamilyWealth</code>, or <code className="bg-[#FAF5EE] px-1 py-0.5 rounded text-amber-900">#CurriculumSwap</code>.
              </p>
            </div>
          ) : (
            filteredResults.map(item => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-2xl border border-copper-penny/20 hover:border-[#D4AF37] hover:shadow-md transition-all space-y-2 group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded-md bg-[#FAF5EE] border border-copper-penny/20 text-[10px] font-mono font-bold text-[#1F140E]">
                        {item.typeLabel}
                      </span>
                      <span className="text-[11px] font-mono font-bold text-soft-sage truncate">
                        {item.locationOrCategory}
                      </span>
                    </div>

                    <h4 className="text-sm font-serif font-bold text-[#1F140E] group-hover:text-[#B87333] transition-colors">
                      {item.title}
                    </h4>

                    <p className="text-xs text-[#1F140E]/80 font-sans line-clamp-2 leading-relaxed">
                      {item.snippet}
                    </p>

                    <div className="pt-1 flex items-center justify-between text-[11px] text-soft-sage font-mono">
                      <span>By: <strong className="text-[#1F140E]">{item.authorOrOwner}</strong></span>
                      
                      <button
                        onClick={() => {
                          onNavigateTab(item.linkTab, item.subTab);
                          onClose();
                        }}
                        className="px-3 py-1 bg-[#1F140E] text-[#D4AF37] hover:bg-[#2A1D16] rounded-xl font-mono text-[11px] font-bold flex items-center space-x-1 cursor-pointer transition-all shadow-xs"
                      >
                        <span>View Item</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-copper-penny/20 shrink-0"
                    />
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* FOOTER */}
        <div className="p-3 bg-[#FAF5EE] border-t border-copper-penny/15 text-center text-[11px] font-mono text-soft-sage">
          ✨ Sisterhood Tip: Click any hashtag in posts or chats to trigger a sitewide search anytime.
        </div>

      </div>
    </div>
  );
};
export default GlobalSearchModal;
