import React, { useState } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Sparkles, 
  Heart, 
  Award, 
  Users, 
  MessageSquare, 
  Compass, 
  CheckCircle2, 
  Play, 
  Download, 
  Share2, 
  Star, 
  Flame, 
  Search,
  ChevronRight,
  ShieldCheck,
  Send,
  HelpCircle,
  Clock,
  Tag
} from 'lucide-react';
import WisdomProgression from './WisdomProgression';

interface TrainingModule {
  id: string;
  title: string;
  instructor: string;
  instructorRole: string;
  category: 'wealth' | 'herbal' | 'homestead' | 'business' | 'wellness';
  level: string;
  duration: string;
  coverImage: string;
  description: string;
  objectives: string[];
  lessonsCount: number;
  completedLessons: number;
  priceType: 'Free Member Included' | 'Sponsored Masterclass' | 'Community Co-Op';
  commentsCount: number;
  featured?: boolean;
}

interface HerStoryTopic {
  id: string;
  title: string;
  subtitle: string;
  eraOrTheme: string;
  coverImage: string;
  summary: string;
  keyTakeaways: string[];
  readTime: string;
  reflectionPrompt: string;
}

interface ReflectionPost {
  id: string;
  authorName: string;
  authorLocation: string;
  authorAvatar: string;
  topicTitle: string;
  content: string;
  likesCount: number;
  likedByMe: boolean;
  replies: {
    id: string;
    authorName: string;
    content: string;
    time: string;
  }[];
  timestamp: string;
}

interface MothersAcademyHubProps {
  userName: string;
  selectedState: string;
  simulatedRole: 'applicant' | 'approved' | 'admin' | 'representative';
  onNavigateToTab?: (tab: string) => void;
  onOpenDirectChat?: (recipientName: string, contextTitle: string, initialNote?: string) => void;
}

const INITIAL_TRAININGS: TrainingModule[] = [
  {
    id: 'tr-1',
    title: 'Family Wealth, Private Trusts & Land Protection',
    instructor: 'Mama Danielle & Sister Attorney Kendra',
    instructorRole: 'Estate Planning & Trust Specialists',
    category: 'wealth',
    level: 'Foundational',
    duration: '4 Modules · 2.5 hrs',
    coverImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
    description: 'Learn step-by-step how to move family real estate, land, and digital assets into private trusts. Protect maternal wealth for your children without predatory legal costs.',
    objectives: [
      'Structuring an Unincorporated Private Family Trust',
      'Protecting heirloom land and homestead acreage from foreclosure or seizure',
      'Establishing multi-generational family banking accounts'
    ],
    lessonsCount: 6,
    completedLessons: 4,
    priceType: 'Free Member Included',
    commentsCount: 18,
    featured: true
  },
  {
    id: 'tr-2',
    title: 'Master Folk Apothecary & Home Botanical Compounding',
    instructor: 'Mama Corinne',
    instructorRole: '5th Generation Herbalist & Midwife',
    category: 'herbal',
    level: 'All Levels',
    duration: '5 Modules · 3 hrs',
    coverImage: '/apothecary_sister_herbal.jpg',
    description: 'Master the traditional craft of extracting high-potency roots, elderberry oxymels, respiratory syrups, and calming herbal infusions safely in your kitchen.',
    objectives: [
      'Harvesting, drying, and testing whole raw botanicals',
      'Creating chemical-free magnesium and tallow restorative butters',
      'Childhood immune fortification and fever management protocols'
    ],
    lessonsCount: 8,
    completedLessons: 2,
    priceType: 'Free Member Included',
    commentsCount: 24,
    featured: true
  },
  {
    id: 'tr-3',
    title: 'Heirloom Gardening, Seed Preservation & Food Security',
    instructor: 'Sister Nia & Sister Shantrece',
    instructorRole: 'Urban Homestead Stewards',
    category: 'homestead',
    level: 'Beginner to Intermediate',
    duration: '3 Modules · 1.8 hrs',
    coverImage: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&w=800&q=80',
    description: 'Build an impenetrable food security foundation for your family. From backyard soil mineralization to vacuum-seal seed banking that lasts 10+ years.',
    objectives: [
      'Selecting non-GMO ancestral seeds suited for Southern and Midwestern soils',
      'Container gardening and high-yield micro-farming for families',
      'Fermentation, dehydration, and cellar preservation techniques'
    ],
    lessonsCount: 5,
    completedLessons: 1,
    priceType: 'Free Member Included',
    commentsCount: 14
  },
  {
    id: 'tr-4',
    title: 'Melanated Woman Entrepreneurship: Turning Knowledge into Wealth',
    instructor: 'Sister Michelle',
    instructorRole: 'E-Commerce & Digital Publisher',
    category: 'business',
    level: 'Action Track',
    duration: '4 Modules · 2 hrs',
    coverImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    description: 'Package your lived maternal wisdom, recipes, homeschool plans, or consulting into thriving digital assets, workbooks, and subscription communities.',
    objectives: [
      'Publishing print-on-demand books and workbooks on Amazon KDP',
      'Building an authentic audience without giving away your energy to social media algorithms',
      'Automated checkout flows and private barter-commerce setups'
    ],
    lessonsCount: 6,
    completedLessons: 0,
    priceType: 'Sponsored Masterclass',
    commentsCount: 9
  },
  {
    id: 'tr-5',
    title: 'Restorative Mothering: Regulating Your Nervous System & Beating Burnout',
    instructor: 'Mama Shantrece',
    instructorRole: 'Founder & Holistic Doula',
    category: 'wellness',
    level: 'Heart Sanctuary',
    duration: '3 Modules · 1.5 hrs',
    coverImage: '/coppermommies-selflove1-cmc.jpg',
    description: 'You cannot pour from an empty vessel. Practical, sacred tools to release the hyper-vigilance carried by melanated mothers and anchor deep, grounded peace in your household.',
    objectives: [
      'Daily 10-minute nervous system reset breathwork and somatic tapping',
      'Setting healthy boundaries with extended family and community demands',
      'Creating restorative home rhythms that give you back 2 hours of quiet daily'
    ],
    lessonsCount: 4,
    completedLessons: 3,
    priceType: 'Free Member Included',
    commentsCount: 31,
    featured: true
  }
];

const INITIAL_HER_STORY_TOPICS: HerStoryTopic[] = [
  {
    id: 'hs-1',
    title: 'The Unbroken Matriarchal Line: Pre-Colonial Sovereignty & Divine Motherhood',
    subtitle: 'Reclaiming the Ancient Sacred Lineage of Melanated Women',
    eraOrTheme: 'Ancestral Lineage & Foundation',
    coverImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    summary: 'Before written records were distorted, melanated women stood at the center of governance, land stewardship, and community decision-making. Learn about the matrilineal dynasties where inheritance, name, and land passed through the mothers.',
    keyTakeaways: [
      'Matrilineal clan systems where wealth and titles flowed through maternal bloodlines',
      'The sacred role of the Queen Mother (Nana / Iya) with ultimate veto power over wars and treaties',
      'Why modern systemic pressures attempted to disrupt this natural matriarchal center'
    ],
    readTime: '8 min read · Audio Companion',
    reflectionPrompt: 'When you reflect on your grandmothers and great-grandmothers, what unspoken strength or wisdom did they pass down to you?'
  },
  {
    id: 'hs-2',
    title: 'Her-Story in America: The Maroon Mothers & Underground Apothecaries',
    subtitle: 'Braiding Seeds into Hair and Preserving Generational Survival',
    eraOrTheme: 'Resistance & Botanical Heritage',
    coverImage: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&w=800&q=80',
    summary: 'Melanated mothers carried our survival in their braids. Enslaved mothers braided okra seeds, rice grains, and medicinal seeds into their hair before forced journeys, ensuring their children would eat and heal on new soil.',
    keyTakeaways: [
      'The botanical codes of the Lowcountry and Gullah Geechee midwives',
      'Secret herbal knowledge that kept entire communities alive through natural medicine',
      'The cooperative mutual aid lodges formed by freed women in the 1800s'
    ],
    readTime: '10 min read · Archive Artifacts',
    reflectionPrompt: 'What traditional remedies, foods, or sayings in your home connect you directly back to this resilient lineage?'
  },
  {
    id: 'hs-3',
    title: 'The Seat of Self-Worth: Shedding the Strong Black Woman Trope',
    subtitle: 'Trading Survival Exhaustion for Softness, Protection & Sovereign Care',
    eraOrTheme: 'Emotional Sovereignty & Healing',
    coverImage: '/coppermommies-selflove1-cmc.jpg',
    summary: 'We were never designed to be invincible pack mules carrying the world on our backs. True self-worth means knowing that your softness, rest, and boundaries are sacred and non-negotiable.',
    keyTakeaways: [
      'Unpacking how the "invulnerable strong woman" myth is used to withhold care from us',
      'Learning to receive support, accept help, and say "no" without guilt',
      'Reclaiming your birthright to be cherished, safe, and at peace in your own home'
    ],
    readTime: '7 min read · Healing Circle',
    reflectionPrompt: 'What is one heavy burden you have been carrying out of habit that you are ready to put down in this sisterhood?'
  }
];

const INITIAL_REFLECTIONS: ReflectionPost[] = [
  {
    id: 'ref-1',
    authorName: 'Sister Courtney',
    authorLocation: 'Atlanta Circle, GA',
    authorAvatar: '🕊️',
    topicTitle: 'The Unbroken Matriarchal Line',
    content: 'Studying this module literally brought tears to my eyes. Growing up, I was taught our history began in chains. Seeing the evidence of our mothers holding the land, the councils, and the wealth shifted something deep in my spirit. I am passing this knowledge down to my daughters tonight.',
    likesCount: 19,
    likedByMe: true,
    replies: [
      {
        id: 'rep-1',
        authorName: 'Mama Shantrece',
        content: 'Amen Sister Courtney! When we know who we are, no one can tell us who we are not. You are walking in your rightful seat.',
        time: '2 hours ago'
      }
    ],
    timestamp: 'Yesterday at 4:15 PM'
  },
  {
    id: 'ref-2',
    authorName: 'Sister Brenda',
    authorLocation: 'Charlotte Circle, NC',
    authorAvatar: '👑',
    topicTitle: 'The Seat of Self-Worth',
    content: 'I needed this prompt today. I spent 15 years being the "fixer" for everyone around me while neglecting my own spirit and health. Learning that softness and rest are my birthright is the greatest lesson of my 40s. Thank you sisters for creating this safe haven.',
    likesCount: 26,
    likedByMe: false,
    replies: [
      {
        id: 'rep-2',
        authorName: 'Sister Nia',
        content: 'Pour into you first sister! We have your back in this circle.',
        time: '5 hours ago'
      }
    ],
    timestamp: 'Today at 9:30 AM'
  }
];

export default function MothersAcademyHub({
  userName,
  selectedState,
  simulatedRole,
  onNavigateToTab,
  onOpenDirectChat
}: MothersAcademyHubProps) {
  // Navigation sub-tabs inside Academy
  const [activeAcademyTab, setActiveAcademyTab] = useState<'classroom' | 'herstory' | 'progression'>('classroom');
  const [trainings, setTrainings] = useState<TrainingModule[]>(INITIAL_TRAININGS);
  const [reflections, setReflections] = useState<ReflectionPost[]>(INITIAL_REFLECTIONS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected training modal / detail view
  const [activeTraining, setActiveTraining] = useState<TrainingModule | null>(null);
  const [activeHerStoryTopic, setActiveHerStoryTopic] = useState<HerStoryTopic | null>(null);

  // New reflection input
  const [newReflectionText, setNewReflectionText] = useState<string>('');
  const [selectedReflectionTopic, setSelectedReflectionTopic] = useState<string>(INITIAL_HER_STORY_TOPICS[0].title);
  const [replyInput, setReplyInput] = useState<Record<string, string>>({});
  const [activeReplyPostId, setActiveReplyPostId] = useState<string | null>(null);

  const filteredTrainings = trainings.filter(t => {
    const matchesCat = selectedCategory === 'all' || t.category === selectedCategory;
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleLikeReflection = (id: string) => {
    setReflections(prev => prev.map(r => {
      if (r.id === id) {
        return {
          ...r,
          likesCount: r.likedByMe ? r.likesCount - 1 : r.likesCount + 1,
          likedByMe: !r.likedByMe
        };
      }
      return r;
    }));
  };

  const handleAddReflection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReflectionText.trim()) return;

    const newPost: ReflectionPost = {
      id: `ref-${Date.now()}`,
      authorName: userName,
      authorLocation: `${selectedState} Circle`,
      authorAvatar: '🕊️',
      topicTitle: selectedReflectionTopic,
      content: newReflectionText.trim(),
      likesCount: 1,
      likedByMe: true,
      replies: [],
      timestamp: 'Just now'
    };

    setReflections([newPost, ...reflections]);
    setNewReflectionText('');
  };

  const handleAddReply = (postId: string) => {
    const text = replyInput[postId];
    if (!text || !text.trim()) return;

    setReflections(prev => prev.map(r => {
      if (r.id === postId) {
        return {
          ...r,
          replies: [
            ...r.replies,
            {
              id: `rep-${Date.now()}`,
              authorName: userName,
              content: text.trim(),
              time: 'Just now'
            }
          ]
        };
      }
      return r;
    }));

    setReplyInput(prev => ({ ...prev, [postId]: '' }));
    setActiveReplyPostId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 text-[#1F140E] animate-fade-in">
      
      {/* Academy Header Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-[#1F140E] via-[#2A1D16] to-[#140F0B] p-6 sm:p-8 border-2 border-[#D4AF37]/40 shadow-xl text-[#FAF5EE] space-y-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 uppercase tracking-widest flex items-center space-x-1.5">
              <span>🎓</span>
              <span>The Copper Mommies Academy</span>
            </span>
            <span className="text-xs font-mono text-soft-sage">
              Adult Mastery · True Heritage · Community Progression
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveAcademyTab('classroom')}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                activeAcademyTab === 'classroom'
                  ? 'bg-[#D4AF37] text-[#1F140E] shadow-sm'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              📚 Classroom Tracks
            </button>
            <button
              onClick={() => setActiveAcademyTab('herstory')}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                activeAcademyTab === 'herstory'
                  ? 'bg-[#D4AF37] text-[#1F140E] shadow-sm'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              📜 Her-Story &amp; Lineage
            </button>
            <button
              onClick={() => setActiveAcademyTab('progression')}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                activeAcademyTab === 'progression'
                  ? 'bg-[#D4AF37] text-[#1F140E] shadow-sm'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              🏆 Wisdom Levels
            </button>
          </div>
        </div>

        <div className="max-w-3xl space-y-1.5">
          <h1 className="font-serif font-black text-2xl sm:text-3xl lg:text-4xl text-[#FAF5EE] tracking-tight">
            Knowledge, True Lineage &amp; Self-Worth for Melanated Mothers
          </h1>
          <p className="text-xs sm:text-sm text-[#FAF5EE]/85 font-sans leading-relaxed">
            Our exclusive Skool-modeled sanctuary for mothers. Learn uncompromised family wealth, folk herbal mastery, homestead independence, and uncover our true ancient matrilineal lineage and unshakeable power as women.
          </p>
        </div>
      </div>

      {/* ==================================================== */}
      {/* VIEW 1: CLASSROOM & ADULT SKILL TRAININGS             */}
      {/* ==================================================== */}
      {activeAcademyTab === 'classroom' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Filter & Search Bar */}
          <div className="bg-white p-4 rounded-2xl border border-copper-penny/20 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-copper-penny absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search masterclasses, instructors, or skills..."
                className="w-full pl-9 pr-3 py-2 bg-[#FAF5EE] border border-copper-penny/20 rounded-xl text-xs font-sans focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'all', label: 'All Courses' },
                { id: 'wealth', label: '💰 Family Wealth' },
                { id: 'herbal', label: '🌿 Apothecary' },
                { id: 'homestead', label: '🌾 Homestead' },
                { id: 'business', label: '💼 Enterprise' },
                { id: 'wellness', label: '🕊️ Rest & Burnout' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-[#1F140E] text-[#D4AF37]'
                      : 'bg-[#FAF5EE] text-[#1F140E]/80 hover:bg-[#FAF5EE]/80'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrainings.map(course => (
              <div 
                key={course.id}
                className="bg-white rounded-3xl border border-copper-penny/20 overflow-hidden shadow-sm hover:border-[#D4AF37]/60 hover:shadow-md transition-all flex flex-col group cursor-pointer"
                onClick={() => setActiveTraining(course)}
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100">
                  <img 
                    src={course.coverImage} 
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300" 
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#1F140E]/90 text-[#D4AF37] border border-[#D4AF37]/30">
                      {course.level}
                    </span>
                    {course.featured && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#D4AF37] text-[#1F140E]">
                        ⭐ Core Pillar
                      </span>
                    )}
                  </div>
                  <span className="absolute bottom-3 right-3 bg-black/75 text-white text-[10px] font-mono px-2 py-0.5 rounded-md flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-[#D4AF37]" />
                    <span>{course.duration}</span>
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="text-[11px] font-mono text-soft-sage flex items-center space-x-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-copper-penny" />
                      <span>{course.instructor}</span>
                    </div>

                    <h3 className="font-serif font-bold text-base text-[#1F140E] group-hover:text-copper-penny transition-colors line-clamp-2">
                      {course.title}
                    </h3>

                    <p className="text-xs text-[#1F140E]/80 font-sans line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-copper-penny/10 flex items-center justify-between text-xs font-mono">
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      {course.priceType}
                    </span>
                    <span className="text-[#D4AF37] font-bold group-hover:translate-x-0.5 transition-transform flex items-center space-x-1">
                      <span>Enter Class</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ==================================================== */}
      {/* VIEW 2: HER-STORY, LINEAGE & SELF-WORTH SANCTUARY     */}
      {/* ==================================================== */}
      {activeAcademyTab === 'herstory' && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Hero Banner for Her-Story */}
          <div className="bg-[#FAF5EE] rounded-3xl p-6 sm:p-8 border-2 border-[#D4AF37]/30 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 text-copper-penny">
              <Flame className="w-5 h-5 text-[#D4AF37]" />
              <h2 className="font-serif font-extrabold text-xl sm:text-2xl text-[#1F1813]">
                Her-Story, Lineage &amp; Unshakable Self-Worth
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#1F1813]/85 font-sans leading-relaxed max-w-4xl">
              For generations, our story was told through lenses that diminished the sacred role of the melanated matriarch. Here, we restore the truth: who we really are, our ancient lineage of land stewards, queens, midwives, and healers, and the profound power of stepping fully into your inherent self-worth.
            </p>
          </div>

          {/* Deep-Dive Her-Story Curriculum Modules */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {INITIAL_HER_STORY_TOPICS.map(topic => (
              <div 
                key={topic.id}
                className="bg-white rounded-3xl border border-copper-penny/20 overflow-hidden shadow-sm hover:border-[#D4AF37]/60 hover:shadow-md transition-all flex flex-col group cursor-pointer"
                onClick={() => setActiveHerStoryTopic(topic)}
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100">
                  <img 
                    src={topic.coverImage} 
                    alt={topic.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300" 
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#1F140E]/90 text-[#D4AF37] border border-[#D4AF37]/30">
                    {topic.eraOrTheme}
                  </span>
                  <span className="absolute bottom-3 right-3 bg-black/75 text-white text-[10px] font-mono px-2 py-0.5 rounded-md">
                    {topic.readTime}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-serif font-bold text-base text-[#1F140E] group-hover:text-copper-penny transition-colors">
                      {topic.title}
                    </h3>
                    <p className="text-xs font-mono text-soft-sage">
                      {topic.subtitle}
                    </p>
                    <p className="text-xs text-[#1F140E]/80 font-sans line-clamp-3 leading-relaxed">
                      {topic.summary}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-copper-penny/10 flex items-center justify-between text-xs font-mono">
                    <span className="text-[#D4AF37] font-bold group-hover:translate-x-0.5 transition-transform flex items-center space-x-1">
                      <span>Read Deep Dive</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* SISTERHOOD REFLECTIONS & TESTIMONIAL STREAM */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-copper-penny/20 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-copper-penny/10 pb-4">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#1F1813] flex items-center space-x-2">
                  <span>🕊️</span>
                  <span>Sisterhood Growth &amp; Reflection Board</span>
                </h3>
                <p className="text-xs text-soft-sage font-mono">
                  Share what you have learned from these teachings, voice breakthroughs in self-worth, and speak life into other sisters.
                </p>
              </div>
            </div>

            {/* Post a Reflection Form */}
            <form onSubmit={handleAddReflection} className="bg-[#FAF5EE] p-4 rounded-2xl border border-copper-penny/20 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-mono font-bold text-[#1F140E]">
                  Select Topic / Focus Area:
                </span>
                <select
                  value={selectedReflectionTopic}
                  onChange={(e) => setSelectedReflectionTopic(e.target.value)}
                  className="bg-white border border-copper-penny/25 px-3 py-1.5 rounded-xl text-xs font-sans text-[#1F140E] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                >
                  {INITIAL_HER_STORY_TOPICS.map(t => (
                    <option key={t.id} value={t.title}>{t.title}</option>
                  ))}
                  <option value="General Self-Worth & Inner Healing">General Self-Worth &amp; Inner Healing</option>
                  <option value="Generational Maternal Strength">Generational Maternal Strength</option>
                </select>
              </div>

              <textarea
                value={newReflectionText}
                onChange={(e) => setNewReflectionText(e.target.value)}
                placeholder="What revelation or breakthrough did this teaching awaken in you? Share your voice with the village..."
                rows={3}
                className="w-full bg-white border border-copper-penny/25 p-3 rounded-xl text-xs font-sans text-[#1F140E] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1F140E] hover:bg-[#2A1D16] text-[#D4AF37] font-mono text-xs font-bold rounded-xl flex items-center space-x-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Share with Sisterhood</span>
                </button>
              </div>
            </form>

            {/* Reflection Posts Stream */}
            <div className="space-y-5">
              {reflections.map(post => (
                <div key={post.id} className="bg-[#FAF5EE]/60 rounded-2xl p-4 sm:p-5 border border-copper-penny/15 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#B87333] to-[#D4AF37] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                        {post.authorAvatar}
                      </div>
                      <div>
                        <h4 className="font-serif font-bold text-sm text-[#1F140E]">{post.authorName}</h4>
                        <p className="text-[10px] font-mono text-soft-sage">{post.authorLocation} · {post.timestamp}</p>
                      </div>
                    </div>

                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-[#FAF5EE] text-[#B87333] border border-copper-penny/20">
                      {post.topicTitle}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#1F140E]/90 font-sans leading-relaxed whitespace-pre-line">
                    {post.content}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-copper-penny/10 text-xs font-mono">
                    <button
                      onClick={() => handleLikeReflection(post.id)}
                      className={`flex items-center space-x-1.5 px-3 py-1 rounded-xl transition-all cursor-pointer ${
                        post.likedByMe 
                          ? 'bg-rose-50 text-rose-700 font-bold border border-rose-200' 
                          : 'text-[#1F140E]/70 hover:bg-white'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${post.likedByMe ? 'fill-rose-600 text-rose-600' : ''}`} />
                      <span>{post.likesCount} Affirmations</span>
                    </button>

                    <button
                      onClick={() => setActiveReplyPostId(activeReplyPostId === post.id ? null : post.id)}
                      className="text-copper-penny hover:underline flex items-center space-x-1 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{post.replies.length} Replies</span>
                    </button>
                  </div>

                  {/* Replies thread */}
                  {activeReplyPostId === post.id && (
                    <div className="pt-3 border-t border-copper-penny/10 space-y-2.5 bg-white/70 p-3 rounded-xl">
                      {post.replies.map(r => (
                        <div key={r.id} className="text-xs space-y-0.5 border-b border-copper-penny/10 pb-1.5 last:border-none">
                          <div className="flex items-center justify-between font-mono text-[10px]">
                            <span className="font-bold text-[#1F140E]">{r.authorName}</span>
                            <span className="text-soft-sage">{r.time}</span>
                          </div>
                          <p className="text-xs text-[#1F140E]/85 font-sans">{r.content}</p>
                        </div>
                      ))}

                      <div className="flex items-center space-x-2 pt-1">
                        <input
                          type="text"
                          value={replyInput[post.id] || ''}
                          onChange={(e) => setReplyInput({ ...replyInput, [post.id]: e.target.value })}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddReply(post.id)}
                          placeholder="Speak encouraging words to sister..."
                          className="flex-1 bg-white border border-copper-penny/25 px-3 py-1.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddReply(post.id)}
                          className="px-3 py-1.5 bg-[#1F140E] text-[#D4AF37] font-mono text-xs font-bold rounded-xl cursor-pointer"
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ==================================================== */}
      {/* VIEW 3: WISDOM LEVELS & SKOOL PROGRESSION             */}
      {/* ==================================================== */}
      {activeAcademyTab === 'progression' && (
        <div className="space-y-6 animate-fade-in">
          <WisdomProgression
            userName={userName}
            userTrustScore={98}
            completedTradesCount={12}
            verifiedCareHours={6}
          />
        </div>
      )}

      {/* MODAL: TRAINING DETAIL OVERVIEW */}
      {activeTraining && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[#FAF5EE] rounded-3xl max-w-2xl w-full p-6 sm:p-8 border-2 border-[#D4AF37]/50 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-copper-penny/15 pb-3">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#1F140E] text-[#D4AF37]">
                  {activeTraining.category.toUpperCase()} · {activeTraining.level}
                </span>
                <h3 className="font-serif font-black text-xl text-[#1F140E] mt-1">
                  {activeTraining.title}
                </h3>
              </div>
              <button 
                onClick={() => setActiveTraining(null)}
                className="p-1.5 rounded-xl hover:bg-copper-penny/10 text-[#1F140E] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden bg-neutral-900 relative">
              <img src={activeTraining.coverImage} alt={activeTraining.title} className="w-full h-full object-cover opacity-80" />
              <div className="absolute inset-0 flex items-center justify-center">
                <button 
                  onClick={() => alert(`Starting video lecture for: ${activeTraining.title}`)}
                  className="w-14 h-14 rounded-full bg-[#D4AF37] text-[#1F140E] flex items-center justify-center shadow-2xl hover:scale-108 transition-all cursor-pointer"
                >
                  <Play className="w-6 h-6 fill-[#1F140E] ml-1" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs sm:text-sm text-[#1F140E]/90 leading-relaxed font-sans">
                {activeTraining.description}
              </p>

              <div className="bg-white p-4 rounded-2xl border border-copper-penny/15 space-y-2">
                <span className="text-[11px] font-mono uppercase font-bold text-soft-sage block">
                  Core Mastery Objectives:
                </span>
                <ul className="space-y-1.5 text-xs text-[#1F140E]/90 font-sans">
                  {activeTraining.objectives.map((obj, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-copper-penny/15">
              <span className="text-xs font-mono text-soft-sage">
                {activeTraining.completedLessons} of {activeTraining.lessonsCount} lessons completed
              </span>

              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <button
                  onClick={() => {
                    alert(`Action workbook PDF downloaded for: ${activeTraining.title}`);
                  }}
                  className="px-4 py-2 bg-white hover:bg-neutral-50 text-[#1F140E] font-mono text-xs font-bold rounded-xl border border-copper-penny/25 flex items-center space-x-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Workbook</span>
                </button>
                <button
                  onClick={() => {
                    alert(`Enrolled and launched: ${activeTraining.title}`);
                    setActiveTraining(null);
                  }}
                  className="px-5 py-2 bg-[#1F140E] hover:bg-[#2A1D16] text-[#D4AF37] font-mono text-xs font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Resume Lesson
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: HER-STORY TOPIC DETAIL */}
      {activeHerStoryTopic && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[#FAF5EE] rounded-3xl max-w-2xl w-full p-6 sm:p-8 border-2 border-[#D4AF37]/50 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-copper-penny/15 pb-3">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#1F140E] text-[#D4AF37]">
                  {activeHerStoryTopic.eraOrTheme}
                </span>
                <h3 className="font-serif font-black text-xl text-[#1F140E] mt-1">
                  {activeHerStoryTopic.title}
                </h3>
              </div>
              <button 
                onClick={() => setActiveHerStoryTopic(null)}
                className="p-1.5 rounded-xl hover:bg-copper-penny/10 text-[#1F140E] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden bg-neutral-900">
              <img src={activeHerStoryTopic.coverImage} alt={activeHerStoryTopic.title} className="w-full h-full object-cover" />
            </div>

            <div className="space-y-3">
              <p className="text-xs sm:text-sm text-[#1F140E]/90 leading-relaxed font-sans">
                {activeHerStoryTopic.summary}
              </p>

              <div className="bg-white p-4 rounded-2xl border border-copper-penny/15 space-y-2">
                <span className="text-[11px] font-mono uppercase font-bold text-soft-sage block">
                  Foundational Truths:
                </span>
                <ul className="space-y-1.5 text-xs text-[#1F140E]/90 font-sans">
                  {activeHerStoryTopic.keyTakeaways.map((point, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <Star className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37] shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1">
                <strong className="font-serif block">Heart Reflection Prompt:</strong>
                <p className="italic">{activeHerStoryTopic.reflectionPrompt}</p>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-copper-penny/15">
              <button
                onClick={() => {
                  setSelectedReflectionTopic(activeHerStoryTopic.title);
                  setActiveHerStoryTopic(null);
                  setActiveAcademyTab('herstory');
                }}
                className="px-5 py-2.5 bg-[#1F140E] hover:bg-[#2A1D16] text-[#D4AF37] font-mono text-xs font-bold rounded-xl shadow-md cursor-pointer"
              >
                Share My Reflection on this Teaching ✍️
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
