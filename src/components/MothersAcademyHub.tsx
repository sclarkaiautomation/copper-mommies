import React, { useState, useEffect, useRef } from 'react';
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
  Tag,
  FileText,
  Video,
  Maximize2,
  ThumbsUp,
  Smile,
  Plus,
  Upload,
  Trash2,
  Edit3,
  Paperclip,
  Eye,
  Link as LinkIcon,
  FolderOpen,
  Film,
  Image as ImageIcon,
  Save,
  AlertCircle,
  X,
  ExternalLink,
  Check,
  Bell,
  MessageCircle
} from 'lucide-react';
import WisdomProgression from './WisdomProgression';

interface CourseLesson {
  id: string;
  title: string;
  type: 'video' | 'reading' | 'worksheet';
  duration: string;
  completed: boolean;
  videoUrl?: string; // YouTube, Vimeo, or direct MP4 URL / Data URL
  attachmentUrl?: string; // File URL or base64 Data URL
  attachmentName?: string; // e.g. "Family_Trust_Deed_Workbook.pdf"
  contentSnippet?: string; // Read-along text, instructions, notes
}

interface CourseComment {
  id: string;
  authorName: string;
  authorLocation: string;
  authorAvatar: string;
  text: string;
  timestamp: string;
  likesCount: number;
  lovesCount: number;
  likedByMe: boolean;
  lovedByMe: boolean;
}

interface TrainingModule {
  id: string;
  title: string;
  instructor: string;
  instructorRole: string;
  category: 'wealth' | 'herbal' | 'homestead' | 'business' | 'wellness';
  level: string;
  duration: string;
  coverImage: string;
  videoUrl?: string; // Course overview video or trailer
  description: string;
  objectives: string[];
  lessons: CourseLesson[];
  comments: CourseComment[];
  priceType: 'Free Member Included' | 'Sponsored Masterclass' | 'Community Co-Op';
  featured?: boolean;
  status?: 'published' | 'pending_approval' | 'draft';
  hashtags?: string[];
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
  videoUrl?: string;
  videoAttribution?: string;
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

export const CATEGORY_SUGGESTED_HASHTAGS: Record<string, string[]> = {
  wealth: ['#FamilyWealth', '#PrivateTrusts', '#LandProtection', '#GenerationalWealth', '#EstateTrusts', '#LandBanking'],
  herbal: ['#Apothecary101', '#BotanicalFormulations', '#HerbalMedicine', '#NaturalImmunity', '#ElderberrySyrup', '#NettleBroth'],
  homestead: ['#SeedPreservation', '#HeirloomGardening', '#Homesteading', '#FoodSecurity', '#PoultryCoop', '#OpenPollinated'],
  business: ['#MelanatedEnterprise', '#SisterCoop', '#MicroGrants', '#SovereignStack', '#DigitalPublishing'],
  wellness: ['#RestAndBurnout', '#FamilyHealth', '#PostpartumLyingIn', '#SacredRest', '#DoulaCircle', '#ThreeSistersGuild']
};

const INITIAL_TRAININGS: TrainingModule[] = [
  {
    id: 'tr-1',
    title: 'Family Wealth, Private Trusts & Land Protection',
    instructor: 'Mama Danielle & Sister Attorney Kendra',
    instructorRole: 'Estate Planning & Trust Specialists',
    category: 'wealth',
    level: 'Foundational',
    duration: '4 Modules · 2.5 hrs',
    coverImage: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=kYI9WpQ9z8c',
    description: 'Learn step-by-step how to move family real estate, land, and digital assets into private trusts. Protect maternal wealth for your children without predatory legal costs.',
    objectives: [
      'Structuring an Unincorporated Private Family Trust',
      'Protecting heirloom land and homestead acreage from foreclosure or seizure',
      'Establishing multi-generational family banking accounts'
    ],
    lessons: [
      { 
        id: 'l1', 
        title: 'Module 1: The Foundations of Sovereign Family Trusts', 
        type: 'video', 
        duration: '24 min', 
        completed: true, 
        videoUrl: 'https://www.youtube.com/watch?v=kYI9WpQ9z8c',
        attachmentName: 'Sovereign_Trust_Foundations_Guide.pdf',
        attachmentUrl: '#download-foundations-pdf',
        contentSnippet: 'Understanding the legal difference between public statutory trusts and private ecclesiastical family trusts.' 
      },
      { 
        id: 'l2', 
        title: 'Module 2: Drafting Your Unincorporated Trust Deed', 
        type: 'worksheet', 
        duration: 'Workbook PDF', 
        completed: true, 
        videoUrl: '',
        attachmentName: 'Unincorporated_Family_Trust_Deed_Template.pdf',
        attachmentUrl: '#download-trust-deed-template', 
        contentSnippet: 'Step-by-step preamble and trustee appointment schedule.' 
      },
      { 
        id: 'l3', 
        title: 'Module 3: Titling Real Estate & Land into Trust', 
        type: 'video', 
        duration: '32 min', 
        completed: false, 
        videoUrl: 'https://www.youtube.com/watch?v=kYI9WpQ9z8c',
        attachmentName: 'Quitclaim_Deed_Land_Titling_Manual.pdf',
        attachmentUrl: '#download-deed-guide',
        contentSnippet: 'How to safely record quitclaim deeds and protect acreage from probate court.' 
      },
      { 
        id: 'l4', 
        title: 'Module 4: Multi-Generational Banking & Asset Seclusion', 
        type: 'video', 
        duration: '18 min', 
        completed: false, 
        videoUrl: 'https://www.youtube.com/watch?v=kYI9WpQ9z8c',
        attachmentName: 'Private_EIN_Credit_Union_Checklist.pdf',
        attachmentUrl: '#download-banking-checklist',
        contentSnippet: 'Establishing private EINs and opening credit union accounts in trust name.' 
      }
    ],
    comments: [
      { id: 'cm-1', authorName: 'Sister Jamila', authorLocation: 'Atlanta Circle, GA', authorAvatar: '🌸', text: 'This module gave me the exact clarity I needed for our family land in Alabama! Thank you Mama Danielle.', timestamp: '2 hours ago', likesCount: 12, lovesCount: 8, likedByMe: true, lovedByMe: false },
      { id: 'cm-2', authorName: 'Sister Brenda', authorLocation: 'Charlotte Circle, NC', authorAvatar: '👑', text: 'Incredible step-by-step breakdown. The workbook template is pure gold.', timestamp: 'Yesterday', likesCount: 7, lovesCount: 4, likedByMe: false, lovedByMe: true }
    ],
    priceType: 'Free Member Included',
    featured: true,
    status: 'published',
    hashtags: ['#FamilyWealth', '#PrivateTrusts', '#LandProtection', '#GenerationalWealth']
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
    videoUrl: 'https://www.youtube.com/watch?v=o9GqgK-aB1c',
    description: 'Master the traditional craft of extracting high-potency roots, elderberry oxymels, respiratory syrups, and calming herbal infusions safely in your kitchen.',
    objectives: [
      'Harvesting, drying, and testing whole raw botanicals',
      'Creating chemical-free magnesium and tallow restorative butters',
      'Childhood immune fortification and fever management protocols'
    ],
    lessons: [
      { 
        id: 'm1', 
        title: 'Module 1: Kitchen Apothecary Setup & Sterilization', 
        type: 'video', 
        duration: '19 min', 
        completed: true, 
        videoUrl: 'https://www.youtube.com/watch?v=o9GqgK-aB1c',
        attachmentName: 'Kitchen_Apothecary_Setup_Guide.pdf',
        attachmentUrl: '#download-apothecary-setup',
        contentSnippet: 'Glass jars, amber droppers, alcohol percentages, and honey ratios.' 
      },
      { 
        id: 'm2', 
        title: 'Module 2: Elderberry Oxymel & Respiratory Tinctures', 
        type: 'video', 
        duration: '28 min', 
        completed: true, 
        videoUrl: 'https://www.youtube.com/watch?v=o9GqgK-aB1c',
        attachmentName: 'Elderberry_Oxymel_Formulary_Sheet.pdf',
        attachmentUrl: '#download-oxymel-guide',
        contentSnippet: 'Brewing immune syrups using raw honey, ACV, elderberries, and ginger.' 
      },
      { 
        id: 'm3', 
        title: 'Module 3: Grass-Fed Tallow & Magnesium Sleep Rubs', 
        type: 'reading', 
        duration: '15 min read', 
        completed: false, 
        attachmentName: 'Grass_Fed_Tallow_Magnesium_Recipe.pdf',
        attachmentUrl: '#download-tallow-guide', 
        contentSnippet: 'Whipping rendered tallow with magnesium flakes and lavender essential oil.' 
      },
      { 
        id: 'm4', 
        title: 'Module 4: Fever Management & Natural Draw Poultices', 
        type: 'video', 
        duration: '35 min', 
        completed: false, 
        videoUrl: 'https://www.youtube.com/watch?v=o9GqgK-aB1c',
        attachmentName: 'Childhood_Fever_Poultice_Chart.pdf',
        attachmentUrl: '#download-poultice-chart',
        contentSnippet: 'Plantain, comfrey, and castor oil drawing poultices for stings and congestion.' 
      }
    ],
    comments: [
      { id: 'cm-3', authorName: 'Sister Courtney', authorLocation: 'Houston Circle, TX', authorAvatar: '🕊️', text: 'My children love the elderberry oxymel! We survived flu season without a single sniffle.', timestamp: '3 days ago', likesCount: 22, lovesCount: 15, likedByMe: true, lovedByMe: true }
    ],
    priceType: 'Free Member Included',
    featured: true,
    status: 'published',
    hashtags: ['#Apothecary101', '#BotanicalFormulations', '#HerbalMedicine', '#NaturalImmunity']
  },
  {
    id: 'tr-3',
    title: 'Heirloom Gardening, Seed Preservation & Food Security',
    instructor: 'Sister Nia & Sister Shantrece',
    instructorRole: 'Urban Homestead Stewards',
    category: 'homestead',
    level: 'Beginner to Intermediate',
    duration: '3 Modules · 1.8 hrs',
    coverImage: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=3qU_P1Qz7U0',
    description: 'Build an impenetrable food security foundation for your family. From backyard soil mineralization to vacuum-seal seed banking that lasts 10+ years.',
    objectives: [
      'Selecting non-GMO ancestral seeds suited for Southern and Midwestern soils',
      'Container gardening and high-yield micro-farming for families',
      'Fermentation, dehydration, and cellar preservation techniques'
    ],
    lessons: [
      { 
        id: 'h1', 
        title: 'Module 1: Soil Testing & Organic Mineralization', 
        type: 'video', 
        duration: '22 min', 
        completed: false, 
        videoUrl: 'https://www.youtube.com/watch?v=3qU_P1Qz7U0',
        attachmentName: 'Soil_Remineralization_CheatSheet.pdf',
        attachmentUrl: '#download-soil-pdf',
        contentSnippet: 'Adding kelp meal, greensand, and earthworm castings to revive exhausted dirt.' 
      },
      { 
        id: 'h2', 
        title: 'Module 2: Seed Saving & Fermentation Washing', 
        type: 'worksheet', 
        duration: 'PDF Guide', 
        completed: false, 
        attachmentName: '10_Year_Seed_Preservation_Manual.pdf',
        attachmentUrl: '#download-seeds-pdf', 
        contentSnippet: 'Extracting viable seeds from tomatoes, peppers, and squash without rot.' 
      }
    ],
    comments: [],
    priceType: 'Free Member Included',
    status: 'published',
    hashtags: ['#SeedPreservation', '#HeirloomGardening', '#SeedVaults', '#Homesteading']
  },
  {
    id: 'tr-4',
    title: 'Melanated Woman Entrepreneurship: Turning Knowledge into Wealth',
    instructor: 'Sister Michelle',
    instructorRole: 'E-Commerce & Digital Publisher',
    category: 'business',
    level: 'Action Track',
    duration: '4 Modules · 2 hrs',
    coverImage: '/coppermommies entertainment edit2.jpeg',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    description: 'Package your lived maternal wisdom, recipes, homeschool plans, or consulting into thriving digital assets, workbooks, and subscription communities.',
    objectives: [
      'Publishing print-on-demand books and workbooks on Amazon KDP',
      'Building an authentic audience without giving away your energy to social media algorithms',
      'Automated checkout flows and private barter-commerce setups'
    ],
    lessons: [
      { 
        id: 'b1', 
        title: 'Module 1: Packaging Your Lived Wisdom into Digital Guides', 
        type: 'video', 
        duration: '25 min', 
        completed: false, 
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        attachmentName: 'Amazon_KDP_Publishing_Workbook.pdf',
        attachmentUrl: '#download-kdp-guide',
        contentSnippet: 'Structuring curricula, workbooks, and audio series that solve real family needs.' 
      }
    ],
    comments: [],
    priceType: 'Sponsored Masterclass',
    status: 'published',
    hashtags: ['#MelanatedEnterprise', '#MicroGrants', '#DigitalPublishing', '#CurriculumSwap']
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
    videoUrl: 'https://www.youtube.com/watch?v=inpok4MKVLM',
    description: 'You cannot pour from an empty vessel. Practical, sacred tools to release the hyper-vigilance carried by melanated mothers and anchor deep, grounded peace in your household.',
    objectives: [
      'Daily 10-minute nervous system reset breathwork and somatic tapping',
      'Setting healthy boundaries with extended family and community demands',
      'Creating restorative home rhythms that give you back 2 hours of quiet daily'
    ],
    lessons: [
      { 
        id: 'w1', 
        title: 'Module 1: Somatic Tapping & Releasing Generational Armor', 
        type: 'video', 
        duration: '20 min', 
        completed: true, 
        videoUrl: 'https://www.youtube.com/watch?v=inpok4MKVLM',
        attachmentName: 'Daily_Somatic_Reset_Routine.pdf',
        attachmentUrl: '#download-somatic-pdf',
        contentSnippet: 'Gentle nervous system down-regulation for mothers carrying heavy household loads.' 
      },
      { 
        id: 'w2', 
        title: 'Module 2: Setting Loving Boundaries with Extended Circle', 
        type: 'reading', 
        duration: '12 min', 
        completed: true, 
        attachmentName: 'Loving_Boundaries_Scripts_Workbook.pdf',
        attachmentUrl: '#download-boundaries-pdf',
        contentSnippet: 'Scripting kind, unshakeable boundaries so you can rest without guilt.' 
      }
    ],
    comments: [
      { id: 'cm-4', authorName: 'Sister Keisha', authorLocation: 'Atlanta Circle, GA', authorAvatar: '✨', text: 'This changed my evenings entirely. Thank you for holding space for us.', timestamp: '4 days ago', likesCount: 30, lovesCount: 19, likedByMe: true, lovedByMe: true }
    ],
    priceType: 'Free Member Included',
    featured: true,
    status: 'published',
    hashtags: ['#RestAndBurnout', '#FamilyHealth', '#SacredRest', '#NervousSystemReset']
  }
];

const INITIAL_HER_STORY_TOPICS: HerStoryTopic[] = [
  {
    id: 'hs-1',
    title: 'The Unbroken Matriarchal Line: Pre-Colonial Sovereignty & Divine Motherhood',
    subtitle: 'Reclaiming the Ancient Sacred Lineage of Melanated Women',
    eraOrTheme: 'Ancestral Lineage & Foundation',
    coverImage: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80',
    summary: 'Before written records were distorted, melanated women stood at the center of governance, land stewardship, and community decision-making. Learn about the matrilineal dynasties where inheritance, name, and land passed through the mothers.',
    keyTakeaways: [
      'Matrilineal clan systems where wealth and titles flowed through maternal bloodlines',
      'The sacred role of the Queen Mother (Nana / Iya) with ultimate veto power over wars and treaties',
      'Why modern systemic pressures attempted to disrupt this natural matriarchal center'
    ],
    readTime: '8 min read · Video & Essay',
    reflectionPrompt: 'When you reflect on your grandmothers and great-grandmothers, what unspoken strength or wisdom did they pass down to you?',
    videoUrl: 'https://www.youtube.com/watch?v=kYI9WpQ9z8c',
    videoAttribution: 'Curated Heritage Study (Shared via YouTube)'
  },
  {
    id: 'hs-2',
    title: 'Her-Story in America: The Maroon Mothers & Underground Apothecaries',
    subtitle: 'Braiding Seeds into Hair and Preserving Generational Survival',
    eraOrTheme: 'Resistance & Botanical Heritage',
    coverImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    summary: 'Melanated mothers carried our survival in their braids. Enslaved mothers braided okra seeds, rice grains, and medicinal seeds into their hair before forced journeys, ensuring their children would eat and heal on new soil.',
    keyTakeaways: [
      'The botanical codes of the Lowcountry and Gullah Geechee midwives',
      'Secret herbal knowledge that kept entire communities alive through natural medicine',
      'The cooperative mutual aid lodges formed by freed women in the 1800s'
    ],
    readTime: '10 min read · Video Archive',
    reflectionPrompt: 'What traditional remedies, foods, or sayings in your home connect you directly back to this resilient lineage?',
    videoUrl: 'https://www.youtube.com/watch?v=o9GqgK-aB1c',
    videoAttribution: 'Lowcountry Ancestral Botanicals (Shared via YouTube)'
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
    readTime: '7 min read · Reflection Talk',
    reflectionPrompt: 'What is one heavy burden you have been carrying out of habit that you are ready to put down in this sisterhood?',
    videoUrl: 'https://www.youtube.com/watch?v=3qU_P1Qz7U0',
    videoAttribution: 'Sisterhood Emotional Healing Circle (Shared via YouTube)'
  }
];

const HERSTORY_STORAGE_KEY = 'cm_mothers_academy_herstory_v2';

const HER_STORY_ART_PRESETS = [
  {
    title: 'Sacred Matriarch & Ancient Lineage',
    url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Braided Seeds & Heritage Roots',
    url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Copper Mommies Self-Love Sanctuary',
    url: '/coppermommies-selflove1-cmc.jpg'
  },
  {
    title: 'Heirloom Homestead & Herbal Hands',
    url: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Sisterhood Golden Light Gathering',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Ancient Wisdom & Earth Stewardship',
    url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80'
  }
];

const SAMPLE_EMBED_VIDEOS = [
  {
    label: 'YouTube (Heritage Lecture)',
    url: 'https://www.youtube.com/watch?v=kYI9WpQ9z8c',
    attribution: 'Ancestral Study Archives (Shared via YouTube)'
  },
  {
    label: 'YouTube Shorts (Apothecary Remedy)',
    url: 'https://www.youtube.com/shorts/dQw4w9WgXcQ',
    attribution: 'Mama Folk Botanicals (Shared via YouTube Shorts)'
  },
  {
    label: 'TikTok Video (Seed Braiding & Roots)',
    url: 'https://www.tiktok.com/@ancestralwisdom/video/7123456789012345678',
    attribution: '@ancestralwisdom on TikTok'
  },
  {
    label: 'Instagram Reel (Maternal Breakthrough)',
    url: 'https://www.instagram.com/reel/Cx123456789/',
    attribution: '@coppermommiesvillage on Instagram Reels'
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
  }
];

const LOCAL_STORAGE_KEY = 'cm_mothers_academy_trainings_v5';

// Embed URL parser for YouTube, YouTube Shorts, TikTok, Instagram, Vimeo, and HTML5 video
function getVideoEmbedInfo(url?: string): { 
  isEmbeddable: boolean; 
  type: 'youtube' | 'shorts' | 'tiktok' | 'instagram' | 'vimeo' | 'html5' | 'unknown'; 
  embedUrl: string;
  isVertical: boolean;
} {
  if (!url || typeof url !== 'string') {
    return { isEmbeddable: false, type: 'unknown', embedUrl: '', isVertical: false };
  }
  const trimmed = url.trim();

  // YouTube Shorts match
  if (trimmed.includes('/shorts/')) {
    const ytMatch = trimmed.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
    const videoId = ytMatch && ytMatch[1] ? ytMatch[1] : trimmed.split('/shorts/')[1]?.split('?')[0];
    if (videoId) {
      return {
        isEmbeddable: true,
        type: 'shorts',
        embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`,
        isVertical: true
      };
    }
  }

  // YouTube match: watch?v=ID, youtu.be/ID, embed/ID
  const ytMatch = trimmed.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  if (ytMatch && ytMatch[1]) {
    return {
      isEmbeddable: true,
      type: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0`,
      isVertical: false
    };
  }

  // TikTok match: tiktok.com/@username/video/1234567890
  const tiktokMatch = trimmed.match(/tiktok\.com\/(?:@[^\/]+\/video\/|v\/)?(\d+)/i);
  if (tiktokMatch && tiktokMatch[1]) {
    return {
      isEmbeddable: true,
      type: 'tiktok',
      embedUrl: `https://www.tiktok.com/embed/v2/${tiktokMatch[1]}`,
      isVertical: true
    };
  }

  // Instagram Reel / Post match: instagram.com/(?:p|reel|tv)/CODE/
  const igMatch = trimmed.match(/instagram\.com\/(?:p|reel|tv)\/([^/?#&\s]+)/i);
  if (igMatch && igMatch[1]) {
    return {
      isEmbeddable: true,
      type: 'instagram',
      embedUrl: `https://www.instagram.com/p/${igMatch[1]}/embed/`,
      isVertical: true
    };
  }

  // Vimeo match
  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/i);
  if (vimeoMatch && vimeoMatch[3]) {
    return {
      isEmbeddable: true,
      type: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[3]}?autoplay=1`,
      isVertical: false
    };
  }

  // HTML5 video (mp4, webm, ogg, blob, data:video)
  if (trimmed.match(/\.(mp4|webm|ogg)($|\?)/i) || trimmed.startsWith('data:video/') || trimmed.startsWith('blob:')) {
    return {
      isEmbeddable: true,
      type: 'html5',
      embedUrl: trimmed,
      isVertical: false
    };
  }

  return { isEmbeddable: false, type: 'unknown', embedUrl: trimmed, isVertical: false };
}


// Download Attachment Function (works with Data URLs, remote links, and generates formatted documents)
function handleDownloadAttachment(lesson: CourseLesson, courseTitle: string) {
  const filename = lesson.attachmentName || `${lesson.title.replace(/[^a-zA-Z0-9_-]/g, '_')}_Material.pdf`;

  if (lesson.attachmentUrl && lesson.attachmentUrl.startsWith('data:')) {
    const link = document.createElement('a');
    link.href = lesson.attachmentUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }

  if (lesson.attachmentUrl && (lesson.attachmentUrl.startsWith('http://') || lesson.attachmentUrl.startsWith('https://'))) {
    window.open(lesson.attachmentUrl, '_blank', 'noopener,noreferrer');
    return;
  }

  // Generate authentic downloadable curriculum workbook / document
  const content = `========================================================================
THE COPPER MOMMIES COOPERATIVE SANCTUARY · MOTHERS ACADEMY
OFFICIAL MASTERCLASS CURRICULUM & STUDY GUIDE
========================================================================

Masterclass: ${courseTitle}
Module Title: ${lesson.title}
Format / Duration: ${lesson.duration} · ${lesson.type.toUpperCase()}
Generated on: ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}

------------------------------------------------------------------------
1. MODULE OBJECTIVE & OVERVIEW
------------------------------------------------------------------------
${lesson.contentSnippet || 'This study guide contains foundational instructions, practical action steps, and sovereign reflections for this module.'}

------------------------------------------------------------------------
2. CORE READ-ALONG INSTRUCTIONS & ACTION PROTOCOL
------------------------------------------------------------------------
- Review this module thoroughly alongside the lecture video.
- Note any specific herbs, legal clauses, homestead seeds, or financial steps.
- Bring your reflections to your local State Circle gathering or share on the
  Academy Sisterhood Board.

------------------------------------------------------------------------
3. SANCTUARY WISDOM CHECKLIST
------------------------------------------------------------------------
[ ] Complete the lecture video and read-along notes.
[ ] Mark this module as Complete in your Academy progression bar.
[ ] Download and file all accompanying deed templates, recipes, or guides.
[ ] Earn your Wisdom Progression credits and honors.

For questions or Elder Council guidance:
The Copper Mommies Sanctuary · Mama Shantrece & Grandmother Council
Peace, True Lineage & Unshakeable Self-Worth
========================================================================`;

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.txt') || filename.endsWith('.pdf') ? filename : `${filename}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Download Full Course Workbook
function handleDownloadCourseWorkbook(course: TrainingModule) {
  const filename = `${course.title.replace(/[^a-zA-Z0-9_-]/g, '_')}_Complete_Workbook.pdf`;
  const content = `========================================================================
THE COPPER MOMMIES COOPERATIVE SANCTUARY · MOTHERS ACADEMY
COMPLETE MASTERCLASS WORKBOOK & CURRICULUM
========================================================================

Course: ${course.title}
Instructor: ${course.instructor} (${course.instructorRole})
Category: ${course.category.toUpperCase()} · Proficiency Level: ${course.level}
Duration: ${course.duration}
Access Tier: ${course.priceType}

------------------------------------------------------------------------
ABOUT THIS MASTERCLASS:
------------------------------------------------------------------------
${course.description}

------------------------------------------------------------------------
CORE MASTERY OBJECTIVES:
------------------------------------------------------------------------
${course.objectives.map((obj, i) => `${i + 1}. ${obj}`).join('\n')}

------------------------------------------------------------------------
FULL MODULE SYLLABUS & LESSON BREAKDOWN:
------------------------------------------------------------------------
${course.lessons.map((lesson, i) => `
Module ${i + 1}: ${lesson.title}
- Type: ${lesson.type.toUpperCase()} · Duration: ${lesson.duration}
- Status: ${lesson.completed ? 'COMPLETED ✓' : 'IN PROGRESS'}
${lesson.videoUrl ? `- Video Stream: ${lesson.videoUrl}` : ''}
${lesson.attachmentName ? `- Attached File: ${lesson.attachmentName}` : ''}
- Notes: ${lesson.contentSnippet || 'Standard study guide.'}
`).join('\n')}

========================================================================
The Copper Mommies Sanctuary · Knowledge, True Lineage & Self-Worth
All Rights Reserved · Shared in Maternal Sisterhood & Trust
========================================================================`;

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function MothersAcademyHub({
  userName,
  selectedState,
  simulatedRole,
  onNavigateToTab,
  onOpenDirectChat
}: MothersAcademyHubProps) {
  // Navigation sub-tabs inside Academy
  const [activeAcademyTab, setActiveAcademyTab] = useState<'classroom' | 'herstory' | 'progression' | 'creator' | 'adminManager' | 'hashtags'>('classroom');
  const [quickHashtagEditingCourseId, setQuickHashtagEditingCourseId] = useState<string | null>(null);
  const [newHashtagCustomInputMap, setNewHashtagCustomInputMap] = useState<Record<string, string>>({});

  // Subtab for Admin Office
  const [adminOfficeTab, setAdminOfficeTab] = useState<'classroom' | 'herstory' | 'copyrightGuide'>('classroom');

  // Admin In-Place Editing Mode state (persisted so Mama Shantrece can toggle editing in Her-Story and classroom anytime)
  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cm_academy_admin_mode');
      if (saved !== null) return saved === 'true';
    }
    return simulatedRole === 'admin';
  });

  useEffect(() => {
    if (simulatedRole === 'admin') {
      setIsAdminMode(true);
    }
  }, [simulatedRole]);

  const toggleAdminMode = () => {
    setIsAdminMode(prev => {
      const next = !prev;
      try {
        localStorage.setItem('cm_academy_admin_mode', String(next));
      } catch {}
      setAdminToast(next ? '🛡️ Admin In-Place Editing Mode: Active' : '👀 Sister Member View: Active');
      return next;
    });
  };

  const effectiveIsAdmin = isAdminMode || simulatedRole === 'admin';

  // Video Aspect Ratio Mode for Adaptable Video Player (Auto vs Widescreen vs Portrait)
  const [videoAspectRatioMode, setVideoAspectRatioMode] = useState<'auto' | 'widescreen' | 'portrait'>('auto');

  // Load trainings with persistence
  const [trainings, setTrainings] = useState<TrainingModule[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read trainings from localStorage:', e);
    }
    return INITIAL_TRAININGS;
  });

  // Save to localStorage whenever trainings change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(trainings));
    } catch (e) {
      console.warn('Could not save trainings to localStorage:', e);
    }
  }, [trainings]);

  // Editing course state (when non-null, opens the Course & Module Studio Editor)
  const [editingCourse, setEditingCourse] = useState<TrainingModule | null>(null);

  // Her-Story & Lineage State with persistence
  const [herStoryTopics, setHerStoryTopics] = useState<HerStoryTopic[]>(() => {
    try {
      const saved = localStorage.getItem(HERSTORY_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read herStoryTopics from localStorage:', e);
    }
    return INITIAL_HER_STORY_TOPICS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(HERSTORY_STORAGE_KEY, JSON.stringify(herStoryTopics));
    } catch (e) {
      console.warn('Could not save herStoryTopics to localStorage:', e);
    }
  }, [herStoryTopics]);

  // Editing / Creating Her-Story Topic State
  const [editingHerStoryTopic, setEditingHerStoryTopic] = useState<HerStoryTopic | null>(null);
  const [isAddingHerStoryTopic, setIsAddingHerStoryTopic] = useState(false);
  const [herStoryFormData, setHerStoryFormData] = useState<Partial<HerStoryTopic>>({});
  const [herStoryTakeawaysText, setHerStoryTakeawaysText] = useState('');
  const [herStoryTopicToDelete, setHerStoryTopicToDelete] = useState<HerStoryTopic | null>(null);
  const [herStoryModalViewMode, setHerStoryModalViewMode] = useState<'video' | 'cover'>('video');

  // Success toast for administrative actions
  const [adminToast, setAdminToast] = useState<string | null>(null);

  // Auto-hide toast after 4 seconds
  useEffect(() => {
    if (adminToast) {
      const timer = setTimeout(() => setAdminToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [adminToast]);

  const [reflections, setReflections] = useState<ReflectionPost[]>(INITIAL_REFLECTIONS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Course Submission Form State (Sister Creator Studio)
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseCategory, setNewCourseCategory] = useState<'wealth' | 'herbal' | 'homestead' | 'business' | 'wellness'>('wealth');
  const [newCourseLevel, setNewCourseLevel] = useState('All Levels');
  const [newCourseDuration, setNewCourseDuration] = useState('3 Modules · 2 hrs');
  const [newCourseDesc, setNewCourseDesc] = useState('');
  const [newCourseCover, setNewCourseCover] = useState('https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80');
  const [newCourseVideoUrl, setNewCourseVideoUrl] = useState('');
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [newCourseHashtags, setNewCourseHashtags] = useState<string[]>(['#FamilyWealth', '#PrivateTrusts']);
  const [newCourseHashtagInput, setNewCourseHashtagInput] = useState('');
  const [editingCourseHashtagInput, setEditingCourseHashtagInput] = useState('');

  // Course Hashtag Toggle Handler (adds or removes tag from any course and persists immediately)
  const handleToggleCourseHashtag = (courseId: string, tag: string) => {
    const formattedTag = tag.startsWith('#') ? tag : `#${tag}`;
    setTrainings(prev => prev.map(course => {
      if (course.id === courseId) {
        const existingTags = course.hashtags || [];
        const isAdded = existingTags.includes(formattedTag);
        const newTags = isAdded 
          ? existingTags.filter(t => t !== formattedTag)
          : [...existingTags, formattedTag];
        return { ...course, hashtags: newTags };
      }
      return course;
    }));

    if (activeTraining && activeTraining.id === courseId) {
      setActiveTraining(prev => {
        if (!prev) return null;
        const existingTags = prev.hashtags || [];
        const isAdded = existingTags.includes(formattedTag);
        const newTags = isAdded 
          ? existingTags.filter(t => t !== formattedTag)
          : [...existingTags, formattedTag];
        return { ...prev, hashtags: newTags };
      });
    }

    setAdminToast(`Hashtags updated for masterclass.`);
  };

  // Add Custom Hashtag to any course
  const handleAddCustomCourseHashtag = (courseId: string, customTag: string) => {
    const clean = customTag.trim();
    if (!clean) return;
    const formattedTag = clean.startsWith('#') ? clean : `#${clean}`;
    
    setTrainings(prev => prev.map(course => {
      if (course.id === courseId) {
        const existingTags = course.hashtags || [];
        if (!existingTags.includes(formattedTag)) {
          return { ...course, hashtags: [...existingTags, formattedTag] };
        }
      }
      return course;
    }));

    if (activeTraining && activeTraining.id === courseId) {
      setActiveTraining(prev => {
        if (!prev) return null;
        const existingTags = prev.hashtags || [];
        if (!existingTags.includes(formattedTag)) {
          return { ...prev, hashtags: [...existingTags, formattedTag] };
        }
        return prev;
      });
    }

    setNewHashtagCustomInputMap(prev => ({ ...prev, [courseId]: '' }));
    setAdminToast(`Added "${formattedTag}" to course!`);
  };

  // Handle direct navigation to a course via hashtag click from Village Commons or anywhere on site
  useEffect(() => {
    const handleOpenCourse = (e: any) => {
      const courseId = e.detail?.courseId;
      if (courseId) {
        const found = trainings.find(t => t.id === courseId);
        if (found) {
          setActiveAcademyTab('classroom');
          setActiveTraining(found);
          window.scrollTo({ top: 300, behavior: 'smooth' });
        }
      }
    };
    window.addEventListener('copper_open_academy_course', handleOpenCourse);
    return () => window.removeEventListener('copper_open_academy_course', handleOpenCourse);
  }, [trainings]);

  // Academy Notifications State (Bell Icon at Top Right)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [academyNotifications, setAcademyNotifications] = useState([
    {
      id: 'notif-1',
      title: 'New Masterclass Published',
      message: 'Master Folk Apothecary & Home Botanical Compounding is now live in the classroom.',
      courseTitle: 'Master Folk Apothecary & Home Botanical Compounding',
      time: '15 mins ago',
      unread: true,
      type: 'new_course'
    },
    {
      id: 'notif-2',
      title: 'New Lesson Video Available',
      message: 'Module 3: Titling Real Estate & Land into Trust has been updated with HD video lectures and deeds.',
      courseTitle: 'Family Wealth, Private Trusts & Land Protection',
      time: '2 hours ago',
      unread: true,
      type: 'course_update'
    },
    {
      id: 'notif-3',
      title: 'New Live Cohort Gathering Announced',
      message: 'Elder Sisterhood Q&A scheduled for this Saturday at 11 AM EST on Land Trusts.',
      courseTitle: 'Family Wealth, Private Trusts & Land Protection',
      time: 'Yesterday',
      unread: false,
      type: 'announcement'
    },
    {
      id: 'notif-4',
      title: 'New Downloadable Workbook Added',
      message: 'Download the 10-Year Heirloom Seed Preservation Manual in PDF format.',
      courseTitle: 'Heirloom Gardening, Seed Preservation & Food Security',
      time: '2 days ago',
      unread: false,
      type: 'course_update'
    }
  ]);

  // Member Course Comments View State (Comment Icon at Top Right)
  const [isMemberCommentsOpen, setIsMemberCommentsOpen] = useState(false);
  const [selectedCourseForComments, setSelectedCourseForComments] = useState<string>('all');
  const [newMemberReplyText, setNewMemberReplyText] = useState<Record<string, string>>({});

  // Filter courses created or led by this member, or where member has enrolled/interacted
  const memberCreatedCourses = trainings.filter(t => 
    t.instructor.toLowerCase().includes(userName.toLowerCase()) || 
    t.instructor.toLowerCase().includes('shantrece')
  );

  // Fallback to all courses with comments if member has no authored courses yet
  const relevantCoursesForComments = memberCreatedCourses.length > 0 ? memberCreatedCourses : trainings;

  // Selected training modal / detail view
  const [activeTraining, setActiveTraining] = useState<TrainingModule | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [activeHerStoryTopic, setActiveHerStoryTopic] = useState<HerStoryTopic | null>(null);

  // Fullscreen video state in course modal
  const [isFullscreenVideo, setIsFullscreenVideo] = useState(false);

  const activeLesson = activeTraining ? (activeTraining.lessons.find(l => l.id === activeLessonId) || activeTraining.lessons[0] || null) : null;
  const mediaUrl = activeLesson?.videoUrl || activeTraining?.videoUrl || '';
  const embedInfo = getVideoEmbedInfo(mediaUrl);
  const isEffectiveVertical = videoAspectRatioMode === 'portrait' || (videoAspectRatioMode === 'auto' && embedInfo.isVertical);

  // When activeTraining changes, default activeLessonId to its first lesson
  useEffect(() => {
    if (activeTraining && activeTraining.lessons.length > 0) {
      setActiveLessonId(activeTraining.lessons[0].id);
      setIsPlayingVideo(false);
    }
  }, [activeTraining]);

  // New course comment input & show all comments toggle per course
  const [courseCommentText, setCourseCommentText] = useState('');
  const [showAllCommentsModal, setShowAllCommentsModal] = useState<TrainingModule | null>(null);

  // Quick "+ Add Module & Video" modal state
  const [isAddingModuleToCourse, setIsAddingModuleToCourse] = useState<TrainingModule | null>(null);
  const [addModuleTitle, setAddModuleTitle] = useState('');
  const [addModuleType, setAddModuleType] = useState<'video' | 'reading' | 'worksheet'>('video');
  const [addModuleDuration, setAddModuleDuration] = useState('20 min');
  const [addModuleVideoUrl, setAddModuleVideoUrl] = useState('');
  const [addModuleSnippet, setAddModuleSnippet] = useState('');
  const [addModuleAttachmentName, setAddModuleAttachmentName] = useState('');
  const [addModuleAttachmentUrl, setAddModuleAttachmentUrl] = useState('');

  // Course deletion confirmation dialog state
  const [courseToDelete, setCourseToDelete] = useState<{ id: string; title: string } | null>(null);

  // Course-level reactions (Like & Love under main player)
  const [courseReactions, setCourseReactions] = useState<Record<string, { likes: number; loves: number; likedByMe: boolean; lovedByMe: boolean }>>(() => {
    try {
      const saved = localStorage.getItem('cm_mothers_academy_reactions_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read course reactions from storage', e);
    }
    return {
      'tr-1': { likes: 32, loves: 24, likedByMe: true, lovedByMe: false },
      'tr-2': { likes: 45, loves: 38, likedByMe: true, lovedByMe: true },
      'tr-3': { likes: 28, loves: 19, likedByMe: false, lovedByMe: true },
      'tr-4': { likes: 18, loves: 14, likedByMe: false, lovedByMe: false },
      'tr-5': { likes: 52, loves: 41, likedByMe: true, lovedByMe: true },
    };
  });

  // Save course reactions
  useEffect(() => {
    try {
      localStorage.setItem('cm_mothers_academy_reactions_v1', JSON.stringify(courseReactions));
    } catch (e) {
      console.warn('Could not save reactions', e);
    }
  }, [courseReactions]);

  // Toggle Like on Course
  const handleToggleCourseLike = (courseId: string) => {
    setCourseReactions(prev => {
      const current = prev[courseId] || { likes: 10, loves: 5, likedByMe: false, lovedByMe: false };
      const newLiked = !current.likedByMe;
      return {
        ...prev,
        [courseId]: {
          ...current,
          likedByMe: newLiked,
          likes: newLiked ? current.likes + 1 : Math.max(0, current.likes - 1)
        }
      };
    });
  };

  // Toggle Love on Course
  const handleToggleCourseLove = (courseId: string) => {
    setCourseReactions(prev => {
      const current = prev[courseId] || { likes: 10, loves: 5, likedByMe: false, lovedByMe: false };
      const newLoved = !current.lovedByMe;
      return {
        ...prev,
        [courseId]: {
          ...current,
          lovedByMe: newLoved,
          loves: newLoved ? current.loves + 1 : Math.max(0, current.loves - 1)
        }
      };
    });
  };

  // Open Add Module modal for a course
  const handleOpenAddModule = (course: TrainingModule) => {
    setIsAddingModuleToCourse(course);
    setAddModuleTitle(`Module ${course.lessons.length + 1}: `);
    setAddModuleType('video');
    setAddModuleDuration('20 min');
    setAddModuleVideoUrl('');
    setAddModuleSnippet('');
    setAddModuleAttachmentName('');
    setAddModuleAttachmentUrl('');
  };

  // Submit new module into the course
  const handleSubmitAddModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAddingModuleToCourse) return;
    if (!addModuleTitle.trim()) {
      setAdminToast('Please provide a title for this module.');
      return;
    }

    const newLesson: CourseLesson = {
      id: `lesson-${Date.now()}`,
      title: addModuleTitle.trim(),
      type: addModuleType,
      duration: addModuleDuration.trim() || '20 min',
      completed: false,
      videoUrl: addModuleVideoUrl.trim() || undefined,
      contentSnippet: addModuleSnippet.trim() || undefined,
      attachmentName: addModuleAttachmentName.trim() || undefined,
      attachmentUrl: addModuleAttachmentUrl.trim() || (addModuleAttachmentName.trim() ? '#download-material' : undefined)
    };

    setTrainings(prev => prev.map(course => {
      if (course.id === isAddingModuleToCourse.id) {
        return {
          ...course,
          lessons: [...course.lessons, newLesson]
        };
      }
      return course;
    }));

    if (activeTraining && activeTraining.id === isAddingModuleToCourse.id) {
      setActiveTraining(prev => prev ? {
        ...prev,
        lessons: [...prev.lessons, newLesson]
      } : null);
    }

    setAdminToast(`Module "${newLesson.title}" added to "${isAddingModuleToCourse.title}" successfully!`);
    setIsAddingModuleToCourse(null);
  };

  // Generic File Upload handler for images, videos, and PDFs
  const handleGenericFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    onComplete: (dataUrl: string, fileName: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result && typeof event.target.result === 'string') {
        onComplete(event.target.result, file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  // Her-Story Admin Handlers
  const handleOpenEditHerStory = (topic: HerStoryTopic) => {
    setEditingHerStoryTopic(topic);
    setIsAddingHerStoryTopic(false);
    setHerStoryFormData({ ...topic });
    setHerStoryTakeawaysText((topic.keyTakeaways || []).join('\n'));
  };

  const handleOpenAddHerStory = () => {
    setIsAddingHerStoryTopic(true);
    setEditingHerStoryTopic(null);
    setHerStoryFormData({
      title: '',
      subtitle: '',
      eraOrTheme: 'Ancestral Lineage & Foundation',
      coverImage: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80',
      summary: '',
      readTime: '8 min read · Video & Essay',
      reflectionPrompt: 'When you reflect on this sacred teaching, what unspoken truth does it awaken in your spirit?',
      videoUrl: '',
      videoAttribution: ''
    });
    setHerStoryTakeawaysText('Ancient maternal clan governance and wealth inheritance\nThe spiritual authority of the grandmother council\nReclaiming self-worth as a birthright rather than something earned');
  };

  const handleSaveHerStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!herStoryFormData.title?.trim()) {
      alert('Please provide a title for this Her-Story topic.');
      return;
    }

    const takeaways = herStoryTakeawaysText
      .split('\n')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    if (editingHerStoryTopic) {
      const updated: HerStoryTopic = {
        ...editingHerStoryTopic,
        ...herStoryFormData,
        title: herStoryFormData.title || editingHerStoryTopic.title,
        subtitle: herStoryFormData.subtitle || '',
        eraOrTheme: herStoryFormData.eraOrTheme || 'Ancestral Heritage',
        coverImage: herStoryFormData.coverImage || editingHerStoryTopic.coverImage,
        summary: herStoryFormData.summary || '',
        readTime: herStoryFormData.readTime || '8 min read',
        reflectionPrompt: herStoryFormData.reflectionPrompt || '',
        videoUrl: herStoryFormData.videoUrl || '',
        videoAttribution: herStoryFormData.videoAttribution || '',
        keyTakeaways: takeaways.length > 0 ? takeaways : editingHerStoryTopic.keyTakeaways
      };

      setHerStoryTopics(prev => prev.map(t => t.id === updated.id ? updated : t));
      if (activeHerStoryTopic?.id === updated.id) {
        setActiveHerStoryTopic(updated);
      }
      setAdminToast(`Updated Her-Story lesson: "${updated.title}"`);
    } else {
      const newTopic: HerStoryTopic = {
        id: `hs-${Date.now()}`,
        title: herStoryFormData.title.trim(),
        subtitle: herStoryFormData.subtitle?.trim() || 'Sacred Matriarchal Lineage',
        eraOrTheme: herStoryFormData.eraOrTheme?.trim() || 'Ancestral Wisdom',
        coverImage: herStoryFormData.coverImage || 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80',
        summary: herStoryFormData.summary?.trim() || 'An ancestral teaching on unshakeable self-worth and sovereign mothering.',
        readTime: herStoryFormData.readTime || '8 min read · Video & Essay',
        reflectionPrompt: herStoryFormData.reflectionPrompt || 'What revelation or breakthrough did this teaching awaken in you?',
        videoUrl: herStoryFormData.videoUrl?.trim() || '',
        videoAttribution: herStoryFormData.videoAttribution?.trim() || '',
        keyTakeaways: takeaways.length > 0 ? takeaways : [
          'Honoring the matrilineal foundation of our people',
          'Shedding false conditioning and resting in sovereign power'
        ]
      };

      setHerStoryTopics(prev => [newTopic, ...prev]);
      setAdminToast(`Added new Her-Story lesson: "${newTopic.title}"`);
    }

    setEditingHerStoryTopic(null);
    setIsAddingHerStoryTopic(false);
  };

  const handleConfirmDeleteHerStory = () => {
    if (!herStoryTopicToDelete) return;
    setHerStoryTopics(prev => prev.filter(t => t.id !== herStoryTopicToDelete.id));
    if (activeHerStoryTopic?.id === herStoryTopicToDelete.id) {
      setActiveHerStoryTopic(null);
    }
    setAdminToast(`Removed Her-Story lesson: "${herStoryTopicToDelete.title}"`);
    setHerStoryTopicToDelete(null);
  };

  const handleResetHerStoryDefaults = () => {
    if (window.confirm('Restore Her-Story teachings to the original 3 foundational lessons? Any custom added topics will be replaced.')) {
      setHerStoryTopics(INITIAL_HER_STORY_TOPICS);
      try {
        localStorage.setItem(HERSTORY_STORAGE_KEY, JSON.stringify(INITIAL_HER_STORY_TOPICS));
      } catch {}
      setAdminToast('Restored Her-Story teachings to original foundational lessons.');
    }
  };

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

  // Create template for a brand new course
  const createNewCourseTemplate = (): TrainingModule => ({
    id: `custom-course-${Date.now()}`,
    title: 'New Masterclass: Holistic Maternal Mastery',
    instructor: `${userName} (Sister Creator)`,
    instructorRole: 'Sanctuary Masterclass Lead',
    category: 'wealth',
    level: 'Foundational',
    duration: '4 Modules · 2 hrs',
    coverImage: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=kYI9WpQ9z8c',
    description: 'A comprehensive maternal masterclass covering sovereign family governance, holistic wellness, and community self-reliance.',
    objectives: [
      'Sovereign household foundation and family protection',
      'Practical day-to-day wellness rhythms for melanated mothers',
      'Generational wealth preservation and food sovereignty'
    ],
    lessons: [
      {
        id: `l-${Date.now()}-1`,
        title: 'Module 1: Foundations of Maternal Sovereignty',
        type: 'video',
        duration: '22 min',
        completed: false,
        videoUrl: 'https://www.youtube.com/watch?v=kYI9WpQ9z8c',
        attachmentName: 'Module_1_Study_Guide.pdf',
        attachmentUrl: '#download-guide-1',
        contentSnippet: 'Introduction to sovereign family legal status, ecclesiastical rights, and maternal leadership.'
      },
      {
        id: `l-${Date.now()}-2`,
        title: 'Module 2: Home Implementation & Practical Protocols',
        type: 'worksheet',
        duration: 'Workbook PDF',
        completed: false,
        videoUrl: '',
        attachmentName: 'Home_Action_Plan_Workbook.pdf',
        attachmentUrl: '#download-workbook-2',
        contentSnippet: 'Step-by-step checklist to implement with your family and state circle.'
      }
    ],
    comments: [],
    priceType: 'Free Member Included',
    featured: false,
    status: 'published'
  });

  // Save changes from Course & Module Studio
  const handleSaveEditingCourse = () => {
    if (!editingCourse) return;
    if (!editingCourse.title.trim()) {
      setAdminToast('Please provide a course title.');
      return;
    }

    setTrainings(prev => {
      const exists = prev.some(t => t.id === editingCourse.id);
      if (exists) {
        return prev.map(t => t.id === editingCourse.id ? editingCourse : t);
      }
      return [editingCourse, ...prev];
    });

    if (activeTraining && activeTraining.id === editingCourse.id) {
      setActiveTraining(editingCourse);
    }

    setAdminToast(`Masterclass "${editingCourse.title}" saved successfully! Changes are live across the Academy.`);
    setEditingCourse(null);
  };

  // Confirmed delete course handler
  const handleConfirmDeleteCourse = () => {
    if (!courseToDelete) return;
    const { id, title } = courseToDelete;
    setTrainings(prev => prev.filter(t => t.id !== id));
    if (activeTraining?.id === id) {
      setActiveTraining(null);
    }
    setAdminToast(`Course "${title}" was removed from the Academy.`);
    setCourseToDelete(null);
  };

  const handleToggleLessonComplete = (trainingId: string, lessonId: string) => {
    setTrainings(prev => prev.map(tr => {
      if (tr.id === trainingId) {
        const updatedLessons = tr.lessons.map(l => l.id === lessonId ? { ...l, completed: !l.completed } : l);
        return {
          ...tr,
          lessons: updatedLessons
        };
      }
      return tr;
    }));

    if (activeTraining && activeTraining.id === trainingId) {
      setActiveTraining(prev => prev ? {
        ...prev,
        lessons: prev.lessons.map(l => l.id === lessonId ? { ...l, completed: !l.completed } : l)
      } : null);
    }
  };

  const handleAddCourseComment = (trainingId: string, customText?: string) => {
    const textToAdd = (customText !== undefined ? customText : courseCommentText).trim();
    if (!textToAdd) return;
    const newComment: CourseComment = {
      id: `cm-${Date.now()}`,
      authorName: userName,
      authorLocation: `${selectedState} Circle`,
      authorAvatar: '👑',
      text: textToAdd,
      timestamp: 'Just now',
      likesCount: 1,
      lovesCount: 1,
      likedByMe: true,
      lovedByMe: true
    };

    setTrainings(prev => prev.map(tr => {
      if (tr.id === trainingId) {
        return {
          ...tr,
          comments: [newComment, ...tr.comments]
        };
      }
      return tr;
    }));

    if (activeTraining && activeTraining.id === trainingId) {
      setActiveTraining(prev => prev ? {
        ...prev,
        comments: [newComment, ...prev.comments]
      } : null);
    }

    if (customText === undefined) {
      setCourseCommentText('');
    }
  };

  const handleToggleCommentLike = (trainingId: string, commentId: string) => {
    setTrainings(prev => prev.map(tr => {
      if (tr.id === trainingId) {
        return {
          ...tr,
          comments: tr.comments.map(c => {
            if (c.id === commentId) {
              return {
                ...c,
                likesCount: c.likedByMe ? c.likesCount - 1 : c.likesCount + 1,
                likedByMe: !c.likedByMe
              };
            }
            return c;
          })
        };
      }
      return tr;
    }));

    if (activeTraining && activeTraining.id === trainingId) {
      setActiveTraining(prev => prev ? {
        ...prev,
        comments: prev.comments.map(c => c.id === commentId ? { ...c, likesCount: c.likedByMe ? c.likesCount - 1 : c.likesCount + 1, likedByMe: !c.likedByMe } : c)
      } : null);
    }
  };

  const handleToggleCommentLove = (trainingId: string, commentId: string) => {
    setTrainings(prev => prev.map(tr => {
      if (tr.id === trainingId) {
        return {
          ...tr,
          comments: tr.comments.map(c => {
            if (c.id === commentId) {
              return {
                ...c,
                lovesCount: c.lovedByMe ? c.lovesCount - 1 : c.lovesCount + 1,
                lovedByMe: !c.lovedByMe
              };
            }
            return c;
          })
        };
      }
      return tr;
    }));

    if (activeTraining && activeTraining.id === trainingId) {
      setActiveTraining(prev => prev ? {
        ...prev,
        comments: prev.comments.map(c => c.id === commentId ? { ...c, lovesCount: c.lovedByMe ? c.lovesCount - 1 : c.lovesCount + 1, lovedByMe: !c.lovedByMe } : c)
      } : null);
    }
  };

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
    <div className="space-y-8 pb-16 animate-fade-in">
      
      {/* Academy Header Banner */}
      <div className={`relative ${isNotificationsOpen || isMemberCommentsOpen ? 'z-50' : 'z-30'} rounded-3xl bg-gradient-to-r from-[#1F140E] via-[#2A1D16] to-[#1F140E] p-6 sm:p-10 border border-[#D4AF37]/40 shadow-xl text-white space-y-6 transition-all duration-200`}>
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Dimmed backdrop when either slide down is open to close on outside click */}
        {(isNotificationsOpen || isMemberCommentsOpen) && (
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] transition-opacity duration-200"
            onClick={() => {
              setIsNotificationsOpen(false);
              setIsMemberCommentsOpen(false);
            }}
          />
        )}
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D4AF37]/20 pb-5">
          <div className="flex items-center space-x-3">
            <span className="p-3 rounded-2xl bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 shadow-inner text-2xl">
              🎓
            </span>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] font-extrabold block">
                The Copper Mommies Academy
              </span>
              <span className="text-xs font-mono text-soft-sage">
                Adult Mastery · True Heritage · Community Progression
              </span>
            </div>
          </div>

          {/* PERMANENT TOP-RIGHT CORNER CLUSTER: Admin, Notification Bell, Comments */}
          <div className="flex items-center space-x-2.5 ml-auto shrink-0">
            {/* 🛠️ Admin Button */}
            <button
              onClick={() => setActiveAcademyTab('adminManager')}
              className={`px-3.5 py-2 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 shadow-md ${
                activeAcademyTab === 'adminManager'
                  ? 'bg-[#D4AF37] text-[#1F140E] font-black'
                  : 'bg-white/10 text-white hover:bg-white/20 border border-[#D4AF37]/40'
              }`}
              title="Academy Admin Management"
            >
              <span>🛠️ Admin</span>
            </button>

            {/* 1. NOTIFICATION BELL ICON (TOP RIGHT CORNER) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  setIsMemberCommentsOpen(false);
                }}
                className={`relative p-2.5 rounded-xl transition-all border cursor-pointer flex items-center justify-center ${
                  isNotificationsOpen
                    ? 'bg-[#D4AF37] text-[#1F140E] border-[#D4AF37] shadow-lg scale-105 ring-2 ring-[#D4AF37]/50 z-50'
                    : 'bg-white/10 hover:bg-[#D4AF37]/20 text-[#FAF5EE] border-[#D4AF37]/30 hover:border-[#D4AF37]'
                }`}
                title="Course & Academy Notifications (New courses, module updates & live cohorts)"
                aria-label="Course Notifications"
              >
                <Bell className="w-4 h-4" />
                {academyNotifications.some(n => n.unread) && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 border-2 border-[#1F140E] rounded-full animate-pulse" />
                )}
              </button>

              {/* Notification Slide Down Panel (Extends over the header container) */}
              {isNotificationsOpen && (
                <div 
                  className="absolute right-0 top-full mt-3 w-[88vw] xs:w-[92vw] sm:w-[420px] max-w-[calc(100vw-2rem)] bg-[#180E08] border-2 border-[#D4AF37] rounded-3xl p-4 sm:p-5 shadow-[0_25px_60px_rgba(0,0,0,0.85)] z-50 text-[#FAF5EE] space-y-3.5 animate-in fade-in slide-in-from-top-3 duration-200 backdrop-blur-md"
                  style={{ maxHeight: 'min(75vh, 580px)' }}
                >
                  <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-3">
                    <div className="flex items-center space-x-2.5">
                      <div className="p-1.5 rounded-xl bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 shadow-inner">
                        <Bell className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-serif font-black text-sm text-[#FAF5EE] block leading-tight">
                          Academy Notifications
                        </span>
                        <span className="text-[10px] font-mono text-soft-sage">
                          New masterclasses, lessons &amp; live cohorts
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {academyNotifications.some(n => n.unread) && (
                        <button
                          type="button"
                          onClick={() => {
                            setAcademyNotifications(prev => prev.map(n => ({ ...n, unread: false })));
                            setAdminToast('All notifications marked as read');
                          }}
                          className="text-[10px] font-mono text-[#D4AF37] hover:underline cursor-pointer font-bold px-2 py-1 rounded-lg hover:bg-white/5 transition-colors"
                        >
                          Mark all read
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setIsNotificationsOpen(false)}
                        className="p-1.5 text-gray-400 hover:text-white rounded-xl hover:bg-white/10 cursor-pointer transition-colors"
                        title="Close notifications"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Notification List with smooth internal scrollbar */}
                  <div className="max-h-[50vh] overflow-y-auto space-y-2.5 pr-1 scrollbar-thin">
                    {academyNotifications.length === 0 ? (
                      <p className="text-xs text-soft-sage text-center py-6 italic">No new notifications</p>
                    ) : (
                      academyNotifications.map(notif => (
                        <div
                          key={notif.id}
                          className={`p-3.5 rounded-2xl border transition-all text-xs space-y-1.5 ${
                            notif.unread
                              ? 'bg-[#2A1D16] border-[#D4AF37]/70 shadow-sm'
                              : 'bg-white/5 border-white/10 hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-serif font-bold text-[#D4AF37] text-xs leading-snug">
                              {notif.title}
                            </span>
                            <span className="text-[9px] font-mono text-soft-sage shrink-0 bg-black/40 px-2 py-0.5 rounded-full border border-white/5">
                              {notif.time}
                            </span>
                          </div>
                          <p className="text-[11.5px] text-[#FAF5EE]/90 leading-relaxed font-sans">
                            {notif.message}
                          </p>
                          <div className="pt-1.5 flex items-center justify-between text-[10px] font-mono border-t border-white/5">
                            <span className="text-soft-sage truncate max-w-[200px]">
                              📖 {notif.courseTitle}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const matched = trainings.find(t => t.title.toLowerCase().includes(notif.courseTitle.toLowerCase()));
                                if (matched) {
                                  setActiveTraining(matched);
                                  setIsNotificationsOpen(false);
                                }
                              }}
                              className="text-[#D4AF37] hover:text-amber-300 hover:underline font-bold flex items-center space-x-1 cursor-pointer"
                            >
                              <span>Enter Class</span>
                              <span>&rarr;</span>
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 2. MEMBER COURSE COMMENTS ICON (TOP RIGHT CORNER) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsMemberCommentsOpen(!isMemberCommentsOpen);
                  setIsNotificationsOpen(false);
                }}
                className={`relative p-2.5 rounded-xl transition-all border cursor-pointer flex items-center justify-center ${
                  isMemberCommentsOpen
                    ? 'bg-[#D4AF37] text-[#1F140E] border-[#D4AF37] shadow-lg scale-105 ring-2 ring-[#D4AF37]/50 z-50'
                    : 'bg-white/10 hover:bg-[#D4AF37]/20 text-[#FAF5EE] border-[#D4AF37]/30 hover:border-[#D4AF37]'
                }`}
                title="My Course Discussions & Sister Comments (View and reply to discussions on your courses)"
                aria-label="Member Course Comments"
              >
                <MessageCircle className="w-4 h-4" />
                {trainings.reduce((sum, t) => sum + t.comments.length, 0) > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.2 rounded-full text-[8.5px] font-mono font-extrabold bg-[#B87333] text-white border border-[#D4AF37] shadow-xs">
                    {trainings.reduce((sum, t) => sum + t.comments.length, 0)}
                  </span>
                )}
              </button>

              {/* Member Comments Slide Down Panel (Extends over the header container) */}
              {isMemberCommentsOpen && (
                <div 
                  className="absolute right-0 top-full mt-3 w-[90vw] xs:w-[94vw] sm:w-[480px] max-w-[calc(100vw-2rem)] bg-[#180E08] border-2 border-[#D4AF37] rounded-3xl p-4 sm:p-5 shadow-[0_25px_60px_rgba(0,0,0,0.85)] z-50 text-[#FAF5EE] space-y-3.5 animate-in fade-in slide-in-from-top-3 duration-200 backdrop-blur-md"
                  style={{ maxHeight: 'min(75vh, 620px)' }}
                >
                  <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-3">
                    <div className="flex items-center space-x-2.5">
                      <div className="p-1.5 rounded-xl bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 shadow-inner">
                        <MessageCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-serif font-black text-sm text-[#FAF5EE] block leading-tight">
                          Member Course Discussions
                        </span>
                        <span className="text-[10px] font-mono text-soft-sage">
                          Sister feedback &amp; inquiries across masterclasses
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsMemberCommentsOpen(false)}
                      className="p-1.5 text-gray-400 hover:text-white rounded-xl hover:bg-white/10 cursor-pointer transition-colors"
                      title="Close discussions"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Course Selector Filter */}
                  <div className="space-y-1.5">
                    <label className="block text-[9.5px] font-mono uppercase font-bold text-soft-sage">
                      Filter by Course Track:
                    </label>
                    <select
                      value={selectedCourseForComments}
                      onChange={(e) => setSelectedCourseForComments(e.target.value)}
                      className="w-full bg-[#2A1D16] border border-[#D4AF37]/40 rounded-xl px-3 py-2 text-xs text-[#FAF5EE] font-mono focus:outline-none focus:border-[#D4AF37] shadow-inner"
                    >
                      <option value="all">All Academy Courses ({relevantCoursesForComments.length})</option>
                      {relevantCoursesForComments.map(c => (
                        <option key={`opt-${c.id}`} value={c.id}>
                          {c.title} ({c.comments.length} comments)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Comments Feed per Course */}
                  <div className="max-h-[46vh] overflow-y-auto space-y-3 pr-1 divide-y divide-[#D4AF37]/15 scrollbar-thin">
                    {(() => {
                      const activeList = selectedCourseForComments === 'all'
                        ? relevantCoursesForComments
                        : relevantCoursesForComments.filter(c => c.id === selectedCourseForComments);

                      const allCommentsWithCourse = activeList.flatMap(course => 
                        course.comments.map(comment => ({ ...comment, courseTitle: course.title, courseId: course.id }))
                      );

                      if (allCommentsWithCourse.length === 0) {
                        return (
                          <div className="text-center py-8 space-y-2">
                            <span className="text-3xl block">💬</span>
                            <p className="text-xs text-soft-sage italic">
                              No sister comments yet on this course track.
                            </p>
                            <p className="text-[10px] text-gray-400 max-w-xs mx-auto">
                              Comments posted by mothers studying your lessons will appear directly here.
                            </p>
                          </div>
                        );
                      }

                      return allCommentsWithCourse.map(cm => (
                        <div key={cm.id} className="pt-3 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center space-x-2 min-w-0">
                              <span className="w-6 h-6 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-xs shrink-0 border border-[#D4AF37]/30">
                                {cm.authorAvatar || '🌸'}
                              </span>
                              <div className="min-w-0 truncate">
                                <span className="font-mono text-xs font-bold text-[#D4AF37] truncate">
                                  {cm.authorName}
                                </span>
                                <span className="text-[9px] font-mono text-soft-sage ml-1.5 hidden xs:inline">
                                  &bull; {cm.authorLocation} &bull; {cm.timestamp}
                                </span>
                              </div>
                            </div>
                            <span className="text-[9px] font-mono bg-[#D4AF37]/15 text-[#D4AF37] px-2 py-0.5 rounded-md border border-[#D4AF37]/25 truncate max-w-[130px] shrink-0">
                              {cm.courseTitle}
                            </span>
                          </div>

                          <p className="text-xs text-[#FAF5EE]/95 font-sans leading-relaxed pl-8">
                            {cm.text}
                          </p>

                          {/* Quick Reply Form */}
                          <div className="pl-8 pt-1 flex items-center space-x-2">
                            <input
                              type="text"
                              value={newMemberReplyText[cm.id] || ''}
                              onChange={(e) => setNewMemberReplyText({ ...newMemberReplyText, [cm.id]: e.target.value })}
                              placeholder={`Reply to ${cm.authorName}...`}
                              className="flex-1 bg-black/50 border border-[#D4AF37]/30 rounded-xl px-2.5 py-1.5 text-xs text-[#FAF5EE] placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  const text = newMemberReplyText[cm.id];
                                  if (!text?.trim()) return;
                                  handleAddCourseComment(cm.courseId, `${userName} (Instructor Reply): ${text.trim()}`);
                                  setNewMemberReplyText({ ...newMemberReplyText, [cm.id]: '' });
                                  setAdminToast(`Reply posted to ${cm.authorName}!`);
                                }
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const text = newMemberReplyText[cm.id];
                                if (!text?.trim()) return;
                                handleAddCourseComment(cm.courseId, `${userName} (Instructor Reply): ${text.trim()}`);
                                setNewMemberReplyText({ ...newMemberReplyText, [cm.id]: '' });
                                setAdminToast(`Reply posted to ${cm.authorName}!`);
                              }}
                              className="px-3 py-1.5 bg-[#D4AF37] hover:bg-[#b59226] text-[#1F140E] font-mono text-[10px] font-bold rounded-xl transition-all cursor-pointer shadow-xs active:scale-95 shrink-0"
                            >
                              Reply
                            </button>
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              )}
            </div>

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

        {/* SECOND ROW: Classroom, Her-Story, Wisdom Levels, Creator Studio tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#D4AF37]/20">
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
          <button
            onClick={() => setActiveAcademyTab('creator')}
            className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center space-x-1 ${
              activeAcademyTab === 'creator'
                ? 'bg-gradient-to-r from-[#D4AF37] to-[#B87333] text-[#1F140E] font-black shadow-md'
                : 'bg-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37]/30 border border-[#D4AF37]/40'
            }`}
          >
            <span>✨ Sister Creator Studio</span>
          </button>
          <button
            id="academy-tab-hashtags"
            onClick={() => setActiveAcademyTab('hashtags')}
            className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeAcademyTab === 'hashtags'
                ? 'bg-[#1F140E] text-[#D4AF37] border-2 border-[#D4AF37] shadow-md font-black ring-2 ring-[#D4AF37]/40'
                : 'bg-white/10 hover:bg-white/20 text-[#FAF5EE] border border-white/20 hover:border-[#D4AF37]'
            }`}
            title="Manage, add, and customize hashtags for courses and view sitewide search connections"
          >
            <span>🏷️ Course Hashtags &amp; Discovery</span>
          </button>
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

              <button
                type="button"
                id="btn-classroom-manage-hashtags"
                onClick={() => setActiveAcademyTab('hashtags')}
                className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer bg-[#D4AF37]/20 hover:bg-[#D4AF37]/35 text-[#1F140E] border border-[#D4AF37]/60 flex items-center space-x-1.5 shadow-2xs"
                title="Manage and customize course discovery hashtags"
              >
                <span>🏷️ Manage Course Hashtags</span>
              </button>
            </div>
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrainings.map(course => {
              const completedCount = course.lessons.filter(l => l.completed).length;
              const totalLessons = course.lessons.length;
              const percent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

              return (
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

                      {/* Course Hashtags Badges */}
                      {course.hashtags && course.hashtags.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1 pt-1" onClick={(e) => e.stopPropagation()}>
                          {course.hashtags.map(tag => (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => {
                                window.dispatchEvent(new CustomEvent('copper_open_global_search', { detail: { query: tag } }));
                              }}
                              className="px-2 py-0.5 rounded-md text-[9.5px] font-mono font-bold bg-[#FAF5EE] hover:bg-[#B87333]/15 text-[#B87333] border border-[#B87333]/25 transition-all hover:scale-105 cursor-pointer shadow-2xs"
                              title={`Direct search or jump to ${tag}`}
                            >
                              {tag.startsWith('#') ? tag : `#${tag}`}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Progress Bar on Card */}
                    <div className="space-y-1 pt-2">
                      <div className="flex items-center justify-between text-[10px] font-mono text-soft-sage">
                        <span>Progress</span>
                        <span className="font-bold text-[#1F140E]">{completedCount}/{totalLessons} lessons ({percent}%)</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                        <div 
                          className="h-full bg-gradient-to-r from-[#B87333] to-[#D4AF37] transition-all duration-300"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>

                    <div className="pt-3 border-t border-copper-penny/10 flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          {course.priceType}
                        </span>
                        {/* Only show Edit Tags button if user is course creator or admin */}
                        {(effectiveIsAdmin || course.instructor.toLowerCase().includes(userName.toLowerCase())) && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setQuickHashtagEditingCourseId(course.id);
                            }}
                            className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#FAF5EE] hover:bg-[#D4AF37]/25 text-[#B87333] border border-[#B87333]/30 transition-all hover:scale-105 cursor-pointer shadow-2xs"
                            title="Add, remove, or customize hashtags for this course"
                          >
                            🏷️ Edit Tags
                          </button>
                        )}
                      </div>
                      <span className="text-[#D4AF37] font-bold group-hover:translate-x-0.5 transition-transform flex items-center space-x-1">
                        <span>Enter Class</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* ==================================================== */}
      {/* VIEW 2: HER-STORY, LINEAGE & SELF-WORTH SANCTUARY     */}
      {/* ==================================================== */}
      {activeAcademyTab === 'herstory' && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Hero Banner for Her-Story */}
          <div className="bg-[#FAF5EE] rounded-3xl p-6 sm:p-8 border-2 border-[#D4AF37]/40 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-2 text-copper-penny">
                <Flame className="w-5 h-5 text-[#D4AF37]" />
                <h2 className="font-serif font-extrabold text-xl sm:text-2xl text-[#1F1813]">
                  Her-Story, Lineage &amp; Unshakable Self-Worth
                </h2>
              </div>

              {/* Direct In-Place Admin Mode Controls */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {effectiveIsAdmin ? (
                  <>
                    <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1.5 shadow-xs">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Admin Mode: Active</span>
                    </span>

                    <button
                      type="button"
                      onClick={handleOpenAddHerStory}
                      className="px-3.5 py-1.5 bg-[#1F140E] hover:bg-[#2A1D16] text-[#D4AF37] border border-[#D4AF37]/60 rounded-xl font-mono text-xs font-bold transition-all shadow-sm flex items-center space-x-1.5 cursor-pointer hover:scale-105 active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Add Teaching</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleResetHerStoryDefaults}
                      className="px-2.5 py-1.5 bg-white hover:bg-neutral-50 text-[#1F140E] border border-copper-penny/30 rounded-xl font-mono text-[11px] font-bold transition-all cursor-pointer shadow-2xs"
                      title="Restore default 3 foundational teachings"
                    >
                      <span>↺ Defaults</span>
                    </button>

                    <button
                      type="button"
                      onClick={toggleAdminMode}
                      className="px-2.5 py-1.5 bg-amber-100/80 hover:bg-amber-200 text-[#1F140E] border border-amber-300 rounded-xl font-mono text-[11px] font-bold transition-all cursor-pointer"
                      title="Preview page without admin controls"
                    >
                      <span>👀 Member View</span>
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={toggleAdminMode}
                    className="px-3.5 py-1.5 bg-[#1F140E] hover:bg-[#2A1D16] text-[#D4AF37] border border-[#D4AF37]/50 rounded-xl font-mono text-xs font-bold transition-all shadow-sm flex items-center space-x-1.5 cursor-pointer hover:scale-105"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>🛠️ Enter Admin Edit Mode</span>
                  </button>
                )}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#1F1813]/85 font-sans leading-relaxed max-w-4xl">
              For generations, our story was told through lenses that diminished the sacred role of the melanated matriarch. Here, we restore the truth: who we really are, our ancient lineage of land stewards, queens, midwives, and healers, and the profound power of stepping fully into your inherent self-worth.
            </p>
          </div>

          {/* Deep-Dive Her-Story Curriculum Modules */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {herStoryTopics.map(topic => (
              <div 
                key={topic.id}
                className="bg-white rounded-3xl border border-copper-penny/20 overflow-hidden shadow-sm hover:border-[#D4AF37]/60 hover:shadow-md transition-all flex flex-col group cursor-pointer relative"
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
                  {topic.videoUrl && (
                    <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded-md text-[9.5px] font-mono font-bold bg-black/80 text-amber-300 border border-amber-400/40 flex items-center space-x-1">
                      <Video className="w-3 h-3 text-[#D4AF37]" />
                      <span>Video Lesson</span>
                    </span>
                  )}

                  {/* Direct In-Place Quick Edit Media Button on Card Image */}
                  {effectiveIsAdmin && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenEditHerStory(topic);
                      }}
                      className="absolute top-3 right-3 px-2.5 py-1 bg-[#1F140E]/95 hover:bg-[#1F140E] text-[#D4AF37] border border-[#D4AF37] rounded-xl text-[10px] font-mono font-bold flex items-center space-x-1 shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer z-10"
                      title="Edit Image, Video, or Text"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit Media</span>
                    </button>
                  )}
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

                    {effectiveIsAdmin && (
                      <div className="flex items-center space-x-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => handleOpenEditHerStory(topic)}
                          className="px-2.5 py-1 bg-[#1F140E] hover:bg-[#2A1D16] text-[#D4AF37] border border-[#D4AF37]/50 rounded-lg text-[10px] font-mono font-bold flex items-center space-x-1 cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-2xs"
                          title="Edit Teaching, Video, & Content"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                        {herStoryTopics.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setHerStoryTopicToDelete(topic)}
                            className="p-1 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-lg text-[10px] cursor-pointer transition-all hover:scale-105"
                            title="Remove Topic"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* In-Place "+ Add Teaching" Card when in Admin Mode */}
            {effectiveIsAdmin && (
              <button
                type="button"
                onClick={handleOpenAddHerStory}
                className="min-h-[280px] rounded-3xl border-2 border-dashed border-[#D4AF37]/50 bg-[#FAF5EE]/50 hover:bg-[#FAF5EE] hover:border-[#D4AF37] p-6 flex flex-col items-center justify-center text-center space-y-3 cursor-pointer group transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#1F140E] text-[#D4AF37] border border-[#D4AF37]/40 flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                  <Plus className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base text-[#1F140E] group-hover:text-copper-penny transition-colors">
                    + Add New Her-Story Masterclass
                  </h4>
                  <p className="text-xs font-mono text-soft-sage mt-1 max-w-xs">
                    Upload heritage art, write ancestral revelations, and safely embed YouTube, TikTok, or Instagram videos.
                  </p>
                </div>
              </button>
            )}
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
                  {herStoryTopics.map(t => (
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

      {/* ==================================================== */}
      {/* VIEW 4: SISTER CREATOR STUDIO & COURSE SUBMISSION     */}
      {/* ==================================================== */}
      {activeAcademyTab === 'creator' && (
        <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
          
          <div className="bg-[#FAF5EE] rounded-3xl p-6 sm:p-8 border-2 border-[#D4AF37]/50 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 text-[#B87333]">
              <Sparkles className="w-6 h-6 text-[#D4AF37]" />
              <h2 className="font-serif font-black text-xl sm:text-2xl text-[#1F140E]">
                Sister Creator Studio: Share Your Mastery
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#1F140E]/85 font-sans leading-relaxed">
              Marrying the best of community-led Skool engagement and structured Udemy courses, the <strong>Copper Mommies Creator Studio</strong> allows any qualified sister to publish masterclasses, herbal remedies, wealth guides, or homeschool curriculums. Submit your course for Founder &amp; Elder review; once approved by Mama Shantrece, it will be published in the Academy Classroom for all mothers across the 50 states!
            </p>
          </div>

          {/* FREE IMAGE-TO-LINK & VIDEO SUBMISSION UTILITY TOOL */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-amber-300 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 border-b border-amber-200 pb-3">
              <span className="text-2xl">🔗</span>
              <div>
                <h3 className="font-serif font-bold text-base text-[#1F140E]">
                  Free Image-to-Link &amp; Video Link Converter Tool
                </h3>
                <p className="text-xs font-mono text-soft-sage">
                  How to turn any image or video file into a permanent web link for free to attach to your course.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-8 space-y-2">
                <label className="text-xs font-mono font-bold text-[#1F140E]">Paste Image / Video File URL or Select File</label>
                <input
                  type="text"
                  placeholder="e.g. https://images.unsplash.com/photo-... or upload file"
                  defaultValue="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80"
                  className="w-full bg-[#FAF5EE] border border-copper-penny/25 px-3 py-2.5 rounded-xl text-xs font-sans text-[#1F140E]"
                />
              </div>

              <div className="md:col-span-4 pt-5">
                <button
                  type="button"
                  onClick={() => {
                    alert('Generated secure public link successfully! Copied to clipboard for your course proposal.');
                  }}
                  className="w-full py-2.5 bg-[#D4AF37] hover:bg-[#c29d2f] text-[#1F140E] font-mono text-xs font-bold rounded-xl shadow-xs cursor-pointer flex items-center justify-center space-x-1.5"
                >
                  <span>⚡ Generate Free Link</span>
                </button>
              </div>
            </div>

            <p className="text-[11px] font-mono text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
              💡 <strong>Tip for Members:</strong> You can paste any Unsplash, Cloudinary, Imgur, or direct video/image URL here. It instantly creates a clean web link that you can paste into your course cover photo or lesson attachments for free!
            </p>
          </div>

          {submissionSuccess ? (
            <div className="bg-emerald-950 p-6 sm:p-8 rounded-3xl border-2 border-emerald-500 text-center space-y-3 animate-fade-in text-emerald-100">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="font-serif font-bold text-xl text-white">Course Proposal Submitted Successfully!</h3>
              <p className="text-xs font-sans text-emerald-200/90 max-w-md mx-auto">
                Thank you, Sister {userName}. Your masterclass has been sent to Mama Shantrece and the Grandmother Council for review and vetting. You will receive a notification in your profile chat as soon as it is approved and live in the Classroom.
              </p>
              <button
                type="button"
                onClick={() => setSubmissionSuccess(false)}
                className="px-5 py-2.5 bg-[#D4AF37] text-[#1F140E] font-mono text-xs font-bold rounded-xl cursor-pointer"
              >
                Submit Another Course
              </button>
            </div>
          ) : (
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (!newCourseTitle.trim() || !newCourseDesc.trim()) {
                  alert('Please provide a course title and description.');
                  return;
                }
                const newTr: TrainingModule = {
                  id: `custom-tr-${Date.now()}`,
                  title: newCourseTitle.trim(),
                  instructor: `${userName} (Sister Creator)`,
                  instructorRole: 'Community Masterclass Lead',
                  category: newCourseCategory,
                  level: newCourseLevel,
                  duration: newCourseDuration,
                  coverImage: newCourseCover || 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80',
                  description: newCourseDesc.trim(),
                  objectives: [
                    'Sovereign maternal insight and practical family steps',
                    'Empowerment and self-reliance for melanated households'
                  ],
                  lessons: [
                    { id: 'cl-1', title: 'Module 1: Introduction & Sovereign Foundations', type: 'video', duration: '20 min', completed: false, contentSnippet: 'Core introduction and methodology.' }
                  ],
                  comments: [],
                  priceType: 'Community Co-Op',
                  featured: false,
                  hashtags: newCourseHashtags
                };
                setTrainings([newTr, ...trainings]);
                setSubmissionSuccess(true);
              }}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-copper-penny/25 shadow-sm space-y-5 text-[#1F140E]"
            >
              <div className="border-b border-copper-penny/15 pb-4">
                <h3 className="font-serif font-bold text-lg text-[#1F140E]">
                  Masterclass Course Proposal Form
                </h3>
                <p className="text-xs text-soft-sage font-mono">
                  All fields are reviewed against Copper Mommies Sanctuary standards before official publication.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-[#1F140E]">Course Title *</label>
                  <input
                    type="text"
                    required
                    value={newCourseTitle}
                    onChange={(e) => setNewCourseTitle(e.target.value)}
                    placeholder="e.g. Holistic Postpartum Care & Yoni Steams"
                    className="w-full bg-[#FAF5EE] border border-copper-penny/25 px-3.5 py-2.5 rounded-xl text-xs font-sans focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-[#1F140E]">Sanctuary Category</label>
                  <select
                    value={newCourseCategory}
                    onChange={(e) => {
                      const cat = e.target.value as any;
                      setNewCourseCategory(cat);
                      if (CATEGORY_SUGGESTED_HASHTAGS[cat]) {
                        setNewCourseHashtags(CATEGORY_SUGGESTED_HASHTAGS[cat].slice(0, 3));
                      }
                    }}
                    className="w-full bg-[#FAF5EE] border border-copper-penny/25 px-3.5 py-2.5 rounded-xl text-xs font-sans focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                  >
                    <option value="wealth">💰 Family Wealth &amp; Trusts</option>
                    <option value="herbal">🌿 Folk Apothecary &amp; Herbs</option>
                    <option value="homestead">🌾 Homestead &amp; Food Security</option>
                    <option value="business">💼 Melanated Enterprise</option>
                    <option value="wellness">🕊️ Rest &amp; Inner Healing</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-[#1F140E]">Proficiency Level</label>
                  <select
                    value={newCourseLevel}
                    onChange={(e) => setNewCourseLevel(e.target.value)}
                    className="w-full bg-[#FAF5EE] border border-copper-penny/25 px-3.5 py-2.5 rounded-xl text-xs font-sans focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                  >
                    <option value="Foundational">Foundational (Beginner)</option>
                    <option value="All Levels">All Levels Welcome</option>
                    <option value="Action Track">Action Track (Advanced)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-[#1F140E]">Estimated Duration</label>
                  <input
                    type="text"
                    value={newCourseDuration}
                    onChange={(e) => setNewCourseDuration(e.target.value)}
                    placeholder="e.g. 4 Modules · 2 hrs"
                    className="w-full bg-[#FAF5EE] border border-copper-penny/25 px-3.5 py-2.5 rounded-xl text-xs font-sans focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                  />
                </div>
              </div>

              {/* Course Hashtags & Automatic Suggestions */}
              <div className="space-y-2 bg-[#FAF5EE] p-4 rounded-2xl border border-copper-penny/20">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-bold text-[#1F140E] flex items-center space-x-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Course Hashtags &amp; Quick-Links</span>
                  </label>
                  <span className="text-[10px] font-mono text-soft-sage">
                    Auto-links from Village Commons
                  </span>
                </div>

                <p className="text-[11px] font-sans text-neutral-600 leading-relaxed">
                  Add hashtags that automatically link members from community forum posts and reply bars straight to this course.
                </p>

                {/* Automatic suggestions for current category */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-soft-sage">
                    ⚡ Suggested Hashtags ({newCourseCategory.toUpperCase()}):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(CATEGORY_SUGGESTED_HASHTAGS[newCourseCategory] || []).map(tag => {
                      const isAdded = newCourseHashtags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => {
                            if (isAdded) {
                              setNewCourseHashtags(prev => prev.filter(t => t !== tag));
                            } else {
                              setNewCourseHashtags(prev => [...prev, tag]);
                            }
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                            isAdded
                              ? 'bg-[#1F140E] text-[#D4AF37] border border-[#D4AF37]'
                              : 'bg-white hover:bg-neutral-100 text-[#1F140E] border border-copper-penny/25'
                          }`}
                        >
                          <span>{tag}</span>
                          <span>{isAdded ? '✓' : '+'}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Current Active Tags */}
                <div className="pt-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {newCourseHashtags.map(ht => (
                      <span
                        key={ht}
                        className="px-2.5 py-1 rounded-xl bg-white border border-[#D4AF37] text-xs font-mono font-bold text-[#B87333] flex items-center space-x-1 shadow-2xs"
                      >
                        <span>{ht}</span>
                        <button
                          type="button"
                          onClick={() => setNewCourseHashtags(prev => prev.filter(t => t !== ht))}
                          className="hover:text-rose-600 text-neutral-400 p-0.5 cursor-pointer ml-1"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Add Custom Tag Input */}
                <div className="flex items-center space-x-2 pt-1">
                  <input
                    type="text"
                    value={newCourseHashtagInput}
                    onChange={(e) => setNewCourseHashtagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const clean = newCourseHashtagInput.trim();
                        if (clean) {
                          const formatted = clean.startsWith('#') ? clean : `#${clean}`;
                          if (!newCourseHashtags.includes(formatted)) {
                            setNewCourseHashtags(prev => [...prev, formatted]);
                          }
                          setNewCourseHashtagInput('');
                        }
                      }
                    }}
                    placeholder="Type custom hashtag e.g. #YoniSteam or #HerbalBath..."
                    className="flex-1 bg-white border border-copper-penny/25 px-3 py-1.5 rounded-xl text-xs font-mono focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const clean = newCourseHashtagInput.trim();
                      if (clean) {
                        const formatted = clean.startsWith('#') ? clean : `#${clean}`;
                        if (!newCourseHashtags.includes(formatted)) {
                          setNewCourseHashtags(prev => [...prev, formatted]);
                        }
                        setNewCourseHashtagInput('');
                      }
                    }}
                    className="px-3 py-1.5 bg-[#1F140E] text-[#D4AF37] rounded-xl font-mono text-xs font-bold cursor-pointer hover:bg-[#2A1D16]"
                  >
                    + Add Tag
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-[#1F140E]">Cover Image URL (Photo)</label>
                <input
                  type="text"
                  value={newCourseCover}
                  onChange={(e) => setNewCourseCover(e.target.value)}
                  placeholder="Paste Unsplash image URL or use default"
                  className="w-full bg-[#FAF5EE] border border-copper-penny/25 px-3.5 py-2.5 rounded-xl text-xs font-sans focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-[#1F140E]">Course Description &amp; Objectives *</label>
                <textarea
                  required
                  rows={4}
                  value={newCourseDesc}
                  onChange={(e) => setNewCourseDesc(e.target.value)}
                  placeholder="Describe what mothers will learn, what videos or worksheets are included, and why this masterclass empowers our community..."
                  className="w-full bg-[#FAF5EE] border border-copper-penny/25 p-3.5 rounded-xl text-xs font-sans focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>

              <div className="pt-3 border-t border-copper-penny/15 flex items-center justify-between">
                <span className="text-[10px] font-mono text-soft-sage">
                  🔒 Requires Admin Approval before appearing in Classroom
                </span>
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#1F140E] hover:bg-[#2A1D16] text-[#D4AF37] font-mono text-xs font-bold rounded-xl shadow-md cursor-pointer transition-all active:scale-95"
                >
                  🚀 Submit Course for Approval
                </button>
              </div>
            </form>
          )}

        </div>
      )}

      {/* ==================================================== */}
      {/* VIEW: COURSE HASHTAGS & SITEWIDE DISCOVERY MANAGER   */}
      {/* ==================================================== */}
      {activeAcademyTab === 'hashtags' && (
        <div className="space-y-6 animate-fade-in">
          {/* Header Hero Banner */}
          <div className="bg-gradient-to-r from-[#1F140E] via-[#2A1D16] to-[#1F140E] rounded-3xl p-6 sm:p-8 border-2 border-[#D4AF37]/60 shadow-lg text-[#FAF5EE] space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <span className="text-3xl sm:text-4xl">🏷️</span>
                <div>
                  <h2 className="font-serif font-black text-xl sm:text-2xl lg:text-3xl text-[#FAF5EE]">
                    Mothers Academy: Course Hashtags &amp; Sitewide Discovery
                  </h2>
                  <p className="text-xs sm:text-sm font-mono text-[#D4AF37]">
                    Manage, add, and customize hashtags for each masterclass.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveAcademyTab('classroom')}
                className="px-4 py-2 bg-[#D4AF37] hover:bg-[#c29d2f] text-[#1F140E] font-mono text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer self-start sm:self-auto shrink-0"
              >
                ← Back to Classroom Tracks
              </button>
            </div>

            <p className="text-xs text-[#FAF5EE]/85 font-sans leading-relaxed max-w-3xl">
              Hashtags connect each course directly to the <strong>Village Commons feed</strong>, <strong>chat boxes</strong>, and <strong>sitewide search</strong>. When sisters post or click tags like <span className="text-[#D4AF37] font-mono font-bold">#SeedPreservation</span>, <span className="text-[#D4AF37] font-mono font-bold">#FamilyWealth</span>, or <span className="text-[#D4AF37] font-mono font-bold">#Apothecary101</span>, they are routed straight to that course!
            </p>
          </div>

          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-copper-penny/20 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-mono font-bold text-[#1F140E]">
              Filter Courses by Track ({filteredTrainings.length} Available):
            </span>
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
                  type="button"
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

          {/* Course Hashtag Management Cards Grid */}
          <div className="space-y-4">
            {filteredTrainings.map(course => {
              const suggestions = CATEGORY_SUGGESTED_HASHTAGS[course.category] || [];
              const customInput = newHashtagCustomInputMap[course.id] || '';

              return (
                <div 
                  key={course.id}
                  className="bg-white rounded-3xl border border-copper-penny/25 p-5 sm:p-6 shadow-sm hover:border-[#D4AF37]/70 transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-copper-penny/10 pb-4">
                    <div className="flex items-start space-x-3.5">
                      <img 
                        src={course.coverImage} 
                        alt={course.title}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-copper-penny/30 shrink-0 shadow-2xs" 
                      />
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#1F140E] text-[#D4AF37]">
                            {course.category.toUpperCase()} · {course.level}
                          </span>
                          <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            {course.priceType}
                          </span>
                        </div>
                        <h3 className="font-serif font-bold text-base sm:text-lg text-[#1F140E]">
                          {course.title}
                        </h3>
                        <p className="text-xs font-mono text-soft-sage">
                          Instructor: {course.instructor} · {course.duration}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveTraining(course);
                        setIsPlayingVideo(false);
                      }}
                      className="px-3.5 py-1.5 bg-[#1F140E] hover:bg-[#2A1D16] text-[#D4AF37] font-mono text-xs font-bold rounded-xl shadow-2xs cursor-pointer flex items-center space-x-1 shrink-0 self-start"
                      title="Enter masterclass player"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Enter Class in Player</span>
                    </button>
                  </div>

                  {/* ACTIVE HASHTAGS SECTION */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono font-bold text-[#1F140E] flex items-center space-x-1.5">
                        <Tag className="w-3.5 h-3.5 text-[#B87333]" />
                        <span>Active Course Hashtags:</span>
                      </label>
                      <span className="text-[10px] font-mono text-soft-sage">
                        {(course.hashtags || []).length} Tags Active
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {(course.hashtags || []).length === 0 ? (
                        <span className="text-xs text-soft-sage italic bg-[#FAF5EE] px-3 py-1.5 rounded-xl border border-dashed border-copper-penny/25">
                          No hashtags assigned yet. Click any suggested tag below or type a custom one.
                        </span>
                      ) : (
                        course.hashtags!.map(tag => (
                          <span
                            key={tag}
                            className="inline-flex items-center space-x-1 px-3 py-1 rounded-xl bg-[#FAF5EE] text-[#B87333] border border-[#D4AF37] text-xs font-mono font-bold shadow-2xs group"
                          >
                            <span>{tag}</span>
                            <button
                              type="button"
                              onClick={() => handleToggleCourseHashtag(course.id, tag)}
                              className="text-neutral-400 hover:text-rose-600 p-0.5 rounded cursor-pointer ml-1 transition-colors"
                              title={`Remove ${tag}`}
                            >
                              ✕
                            </button>
                          </span>
                        ))
                      )}
                    </div>
                  </div>

                  {/* AUTOMATIC SUGGESTED HASHTAGS FOR THIS TRACK */}
                  <div className="bg-[#FAF5EE]/70 p-3.5 rounded-2xl border border-copper-penny/15 space-y-2">
                    <span className="text-[10.5px] font-mono font-bold uppercase text-soft-sage block">
                      ⚡ Suggested Hashtags ({course.category.toUpperCase()} Track) — Click to Add/Remove:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {suggestions.map(sugTag => {
                        const isAdded = (course.hashtags || []).includes(sugTag);
                        return (
                          <button
                            key={sugTag}
                            type="button"
                            onClick={() => handleToggleCourseHashtag(course.id, sugTag)}
                            className={`px-2.5 py-1 rounded-xl text-[11px] font-mono font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                              isAdded
                                ? 'bg-[#1F140E] text-[#D4AF37] border-2 border-[#D4AF37] shadow-2xs ring-1 ring-[#D4AF37]/50'
                                : 'bg-white hover:bg-[#FAF5EE] text-[#1F140E] border border-copper-penny/25 hover:border-[#D4AF37]'
                            }`}
                          >
                            <span>{sugTag}</span>
                            <span className="text-[10px] ml-1">{isAdded ? '✓' : '+'}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* ADD CUSTOM HASHTAG */}
                  <div className="flex items-center space-x-2 pt-1">
                    <input
                      type="text"
                      value={customInput}
                      onChange={(e) => setNewHashtagCustomInputMap(prev => ({ ...prev, [course.id]: e.target.value }))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCustomCourseHashtag(course.id, customInput);
                        }
                      }}
                      placeholder={`Type custom hashtag for "${course.title.slice(0, 25)}..." e.g. #OrganicFarming`}
                      className="flex-1 bg-[#FAF5EE] border border-copper-penny/25 px-3.5 py-2 rounded-xl text-xs font-mono text-[#1F140E] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddCustomCourseHashtag(course.id, customInput)}
                      className="px-4 py-2 bg-[#1F140E] text-[#D4AF37] rounded-xl font-mono text-xs font-bold cursor-pointer hover:bg-[#2A1D16] transition-all shrink-0"
                    >
                      + Add Tag
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* QUICK HASHTAG EDITING MODAL (TRIGGERED FROM CLASSROOM CARDS) */}
      {quickHashtagEditingCourseId && (() => {
        const course = trainings.find(t => t.id === quickHashtagEditingCourseId);
        if (!course) return null;
        const suggestions = CATEGORY_SUGGESTED_HASHTAGS[course.category] || [];
        const customInput = newHashtagCustomInputMap[course.id] || '';

        return (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 animate-fade-in">
            <div className="bg-[#FAF5EE] border-2 border-[#D4AF37] rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-copper-penny/20 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">🏷️</span>
                  <div>
                    <h3 className="font-serif font-black text-base text-[#1F140E]">
                      Edit Course Hashtags: {course.title}
                    </h3>
                    <p className="text-[10px] font-mono text-soft-sage">
                      {course.category.toUpperCase()} Track · Instructor: {course.instructor}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setQuickHashtagEditingCourseId(null)}
                  className="p-1 rounded-xl hover:bg-neutral-200 text-gray-500 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Active Tags */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-[#1F140E] block">
                  Assigned Hashtags (Click ✕ to remove):
                </label>
                <div className="flex flex-wrap gap-1.5 min-h-[36px] p-2.5 bg-white rounded-xl border border-copper-penny/20">
                  {(course.hashtags || []).length === 0 ? (
                    <span className="text-xs text-soft-sage italic">No hashtags assigned yet.</span>
                  ) : (
                    course.hashtags!.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-[#FAF5EE] text-[#B87333] border border-[#D4AF37] text-xs font-mono font-bold"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleToggleCourseHashtag(course.id, tag)}
                          className="text-neutral-400 hover:text-rose-600 p-0.5 ml-1 cursor-pointer"
                        >
                          ✕
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Suggestions */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-soft-sage block">
                  ⚡ Suggested Hashtags ({course.category.toUpperCase()}):
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {suggestions.map(tag => {
                    const isAdded = (course.hashtags || []).includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleToggleCourseHashtag(course.id, tag)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                          isAdded
                            ? 'bg-[#1F140E] text-[#D4AF37] border-2 border-[#D4AF37]'
                            : 'bg-white hover:bg-neutral-100 text-[#1F140E] border border-copper-penny/25'
                        }`}
                      >
                        <span>{tag}</span>
                        <span className="ml-1">{isAdded ? '✓' : '+'}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Add Custom */}
              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="text"
                  value={customInput}
                  onChange={(e) => setNewHashtagCustomInputMap(prev => ({ ...prev, [course.id]: e.target.value }))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomCourseHashtag(course.id, customInput);
                    }
                  }}
                  placeholder="Type custom hashtag e.g. #SeedSecurity..."
                  className="flex-1 bg-white border border-copper-penny/25 px-3 py-2 rounded-xl text-xs font-mono focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                />
                <button
                  type="button"
                  onClick={() => handleAddCustomCourseHashtag(course.id, customInput)}
                  className="px-4 py-2 bg-[#1F140E] text-[#D4AF37] rounded-xl font-mono text-xs font-bold cursor-pointer hover:bg-[#2A1D16]"
                >
                  + Add Tag
                </button>
              </div>

              <div className="pt-2 border-t border-copper-penny/15 flex justify-end">
                <button
                  type="button"
                  onClick={() => setQuickHashtagEditingCourseId(null)}
                  className="px-5 py-2 bg-[#1F140E] text-[#D4AF37] font-mono text-xs font-bold rounded-xl cursor-pointer shadow-sm hover:bg-[#2A1D16]"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ==================================================== */}
      {/* VIEW 5: ADMIN & COURSE MANAGER OFFICE                */}
      {/* ==================================================== */}
      {activeAcademyTab === 'adminManager' && (
        <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
          
          <div className="bg-[#FAF5EE] rounded-3xl p-6 sm:p-8 border-2 border-[#D4AF37]/50 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-3 text-[#1F140E]">
                <span className="text-3xl">🛠️</span>
                <div>
                  <h2 className="font-serif font-black text-xl sm:text-2xl text-[#1F140E]">
                    Mothers Academy: Sovereign Admin Office
                  </h2>
                  <p className="text-xs font-mono text-soft-sage">
                    Central curriculum management, Her-Story archive stewardship, and safe video embeds.
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveAcademyTab('herstory')}
                  className="px-3.5 py-2 bg-[#1F140E] hover:bg-[#2A1D16] text-[#D4AF37] font-mono text-xs font-bold rounded-xl border border-[#D4AF37]/40 flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer"
                  title="Visit the live Her-Story section"
                >
                  <Flame className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Go to Her-Story Sanctuary</span>
                </button>
              </div>
            </div>

            {/* Admin Office Subtabs */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-copper-penny/15">
              <button
                type="button"
                onClick={() => setAdminOfficeTab('classroom')}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                  adminOfficeTab === 'classroom'
                    ? 'bg-[#1F140E] text-[#D4AF37] shadow-sm'
                    : 'bg-white text-[#1F140E] hover:bg-neutral-100 border border-copper-penny/20'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Classroom Courses ({trainings.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setAdminOfficeTab('herstory')}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                  adminOfficeTab === 'herstory'
                    ? 'bg-[#1F140E] text-[#D4AF37] shadow-sm'
                    : 'bg-white text-[#1F140E] hover:bg-neutral-100 border border-copper-penny/20'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>👑 Her-Story &amp; Lineage Teachings ({herStoryTopics.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setAdminOfficeTab('copyrightGuide')}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                  adminOfficeTab === 'copyrightGuide'
                    ? 'bg-[#1F140E] text-[#D4AF37] shadow-sm'
                    : 'bg-white text-[#1F140E] hover:bg-neutral-100 border border-copper-penny/20'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>⚖️ Video Sharing &amp; Copyright Guide</span>
              </button>
            </div>
          </div>

          {/* SUBTAB 1: CLASSROOM COURSES */}
          {adminOfficeTab === 'classroom' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-copper-penny/25 shadow-sm space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-copper-penny/15 pb-4">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#1F140E]">
                    Active Masterclasses ({trainings.length})
                  </h3>
                  <p className="text-xs font-mono text-soft-sage">
                    Manage curriculum lessons, video streams, device image uploads, and attached workbooks.
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setEditingCourse(createNewCourseTemplate())}
                    className="px-4 py-2 bg-[#D4AF37] hover:bg-[#c29d2f] text-[#1F140E] font-mono text-xs font-bold rounded-xl shadow-xs cursor-pointer flex items-center space-x-1.5 transition-all"
                    title="Create a brand new course from scratch"
                  >
                    <Plus className="w-4 h-4" />
                    <span>➕ Create New Masterclass</span>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {trainings.map(course => (
                  <div 
                    key={course.id}
                    className="bg-[#FAF5EE]/70 p-4 sm:p-5 rounded-2xl border border-copper-penny/20 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:border-[#D4AF37]/50 transition-all"
                  >
                    <div className="flex items-center space-x-4 min-w-0">
                      <img 
                        src={course.coverImage} 
                        alt={course.title}
                        className="w-16 h-16 rounded-xl object-cover border border-copper-penny/30 shrink-0 shadow-2xs" 
                      />
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#1F140E] text-[#D4AF37]">
                            {course.category.toUpperCase()} · {course.level}
                          </span>
                          <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            {course.priceType}
                          </span>
                        </div>
                        <h4 className="font-serif font-bold text-sm sm:text-base text-[#1F140E] truncate">
                          {course.title}
                        </h4>
                        <p className="text-xs font-mono text-soft-sage">
                          Instructor: {course.instructor} · {course.lessons.length} Modules · {course.duration}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setEditingCourse(course)}
                        className="px-3.5 py-2 bg-white hover:bg-neutral-50 text-[#1F140E] font-mono text-xs font-bold rounded-xl border border-copper-penny/30 shadow-2xs cursor-pointer flex items-center space-x-1 transition-all"
                        title="Open full course and modules studio editor"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-[#B87333]" />
                        <span>✏️ Edit Course</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenAddModule(course)}
                        className="px-3.5 py-2 bg-[#1F140E] hover:bg-[#2A1D16] text-[#D4AF37] font-mono text-xs font-bold rounded-xl shadow-2xs cursor-pointer flex items-center space-x-1 transition-all"
                        title="Add a new module and video to this course"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>➕ Add Module &amp; Video</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveTraining(course);
                          setIsPlayingVideo(false);
                        }}
                        className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-[#1F140E] font-mono text-xs font-bold rounded-xl border border-amber-200 cursor-pointer flex items-center space-x-1"
                        title="Preview how this course looks in Classroom"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Preview</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCourseToDelete({ id: course.id, title: course.title })}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl border border-rose-200 cursor-pointer transition-all"
                        title="Delete Course"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUBTAB 2: HER-STORY & LINEAGE TEACHINGS MANAGEMENT */}
          {adminOfficeTab === 'herstory' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-copper-penny/25 shadow-sm space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-copper-penny/15 pb-4">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#1F140E] flex items-center space-x-2">
                    <Flame className="w-5 h-5 text-[#D4AF37]" />
                    <span>Her-Story, Lineage &amp; Self-Worth Archive ({herStoryTopics.length} Lessons)</span>
                  </h3>
                  <p className="text-xs font-mono text-soft-sage">
                    Manage ancestral teachings, update covers, write historical reflections, and embed YouTube / TikTok / Instagram videos.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleOpenAddHerStory}
                    className="px-4 py-2 bg-[#1F140E] hover:bg-[#2A1D16] text-[#D4AF37] font-mono text-xs font-bold rounded-xl shadow-xs cursor-pointer flex items-center space-x-1.5 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Add New Teaching</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetHerStoryDefaults}
                    className="px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-[#1F140E] font-mono text-xs font-bold rounded-xl border border-neutral-300 cursor-pointer transition-all"
                    title="Restore default 3 foundational teachings"
                  >
                    <span>↺ Restore Defaults</span>
                  </button>
                </div>
              </div>

              {/* Topics Management List */}
              <div className="space-y-4">
                {herStoryTopics.map((topic, index) => {
                  const embedInfo = getVideoEmbedInfo(topic.videoUrl);

                  return (
                    <div 
                      key={topic.id}
                      className="bg-[#FAF5EE]/70 p-4 sm:p-5 rounded-2xl border border-copper-penny/20 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:border-[#D4AF37]/50 transition-all"
                    >
                      <div className="flex items-center space-x-4 min-w-0">
                        <div className="relative w-20 h-14 rounded-xl overflow-hidden bg-neutral-900 border border-copper-penny/30 shrink-0 shadow-2xs">
                          <img 
                            src={topic.coverImage} 
                            alt={topic.title}
                            className="w-full h-full object-cover" 
                          />
                          {topic.videoUrl && (
                            <span className="absolute bottom-1 right-1 p-0.5 bg-black/80 rounded text-amber-300">
                              <Video className="w-2.5 h-2.5" />
                            </span>
                          )}
                        </div>

                        <div className="space-y-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#1F140E] text-[#D4AF37]">
                              Lesson #{index + 1} · {topic.eraOrTheme}
                            </span>
                            {embedInfo.isEmbeddable ? (
                              <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 capitalize">
                                {embedInfo.type} Video Embedded
                              </span>
                            ) : topic.videoUrl ? (
                              <span className="text-[10px] font-mono text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                                External Link
                              </span>
                            ) : (
                              <span className="text-[10px] font-mono text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-md">
                                Artwork Only
                              </span>
                            )}
                          </div>

                          <h4 className="font-serif font-bold text-sm sm:text-base text-[#1F140E] truncate">
                            {topic.title}
                          </h4>
                          <p className="text-xs font-mono text-soft-sage line-clamp-1">
                            {topic.subtitle} {topic.videoAttribution && `· Credit: ${topic.videoAttribution}`}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleOpenEditHerStory(topic)}
                          className="px-3.5 py-2 bg-white hover:bg-neutral-50 text-[#1F140E] font-mono text-xs font-bold rounded-xl border border-copper-penny/30 shadow-2xs cursor-pointer flex items-center space-x-1 transition-all"
                          title="Edit images, texts, video links, or reflection prompt"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-[#B87333]" />
                          <span>✏️ Edit Teaching</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setActiveHerStoryTopic(topic);
                            setActiveAcademyTab('herstory');
                          }}
                          className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-[#1F140E] font-mono text-xs font-bold rounded-xl border border-amber-200 cursor-pointer flex items-center space-x-1"
                          title="Preview in the Her-Story section"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>View Live</span>
                        </button>

                        {herStoryTopics.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setHerStoryTopicToDelete(topic)}
                            className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl border border-rose-200 cursor-pointer transition-all"
                            title="Delete this topic"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SUBTAB 3: VIDEO SHARING & COPYRIGHT SAFETY GUIDE */}
          {adminOfficeTab === 'copyrightGuide' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-copper-penny/25 shadow-sm space-y-6 animate-fade-in text-[#1F140E]">
              <div className="border-b border-copper-penny/15 pb-4">
                <div className="flex items-center space-x-2 text-emerald-800">
                  <ShieldCheck className="w-6 h-6 text-emerald-600" />
                  <h3 className="font-serif font-black text-xl text-[#1F140E]">
                    Sharing YouTube, TikTok &amp; Instagram Videos: Legal &amp; Copyright Guidelines
                  </h3>
                </div>
                <p className="text-xs font-mono text-soft-sage mt-1">
                  How Copper Mommies allows admins and mothers to curate third-party educational content 100% legally and without DMCA copyright liability.
                </p>
              </div>

              {/* 4 Pillars of Legal Video Embedding */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-[#FAF5EE] p-5 rounded-2xl border border-copper-penny/20 space-y-2">
                  <span className="text-xl">⚖️</span>
                  <h4 className="font-serif font-bold text-sm text-[#1F140E]">
                    1. The Federal "Server Test" Law
                  </h4>
                  <p className="text-xs font-sans text-[#1F140E]/85 leading-relaxed">
                    Under US Copyright Law (established in <em>Perfect 10, Inc. v. Amazon.com, Inc.</em>), embedding video via HTML <code className="bg-white px-1 rounded">&lt;iframe&gt;</code> does <strong>not</strong> create a copy or store video files on Copper Mommies' servers. The video streams directly from YouTube, TikTok, or Instagram, meaning you do not infringe the exclusive right of reproduction.
                  </p>
                </div>

                <div className="bg-[#FAF5EE] p-5 rounded-2xl border border-copper-penny/20 space-y-2">
                  <span className="text-xl">🤝</span>
                  <h4 className="font-serif font-bold text-sm text-[#1F140E]">
                    2. Official Platform Terms of Service
                  </h4>
                  <p className="text-xs font-sans text-[#1F140E]/85 leading-relaxed">
                    When creators publish publicly on YouTube, TikTok, or Instagram, they grant a worldwide license to the platform permitting video playback via their official embedded players. If a creator does not want embeds, they simply toggle "Allow Embedding: OFF" in their settings, which YouTube/TikTok automatically enforces.
                  </p>
                </div>

                <div className="bg-[#FAF5EE] p-5 rounded-2xl border border-copper-penny/20 space-y-2">
                  <span className="text-xl">📈</span>
                  <h4 className="font-serif font-bold text-sm text-[#1F140E]">
                    3. Original Creators Keep 100% of the Value
                  </h4>
                  <p className="text-xs font-sans text-[#1F140E]/85 leading-relaxed">
                    Unlike re-uploading stolen MP4 files, embedding provides a direct win for the original creator! Every time a sister in the Academy plays an embedded video, the view count, watch time, and advertising revenue go directly to the original creator's channel.
                  </p>
                </div>

                <div className="bg-[#FAF5EE] p-5 rounded-2xl border border-copper-penny/20 space-y-2">
                  <span className="text-xl">🏛️</span>
                  <h4 className="font-serif font-bold text-sm text-[#1F140E]">
                    4. Sisterhood Attribution Discipline
                  </h4>
                  <p className="text-xs font-sans text-[#1F140E]/85 leading-relaxed">
                    Always use the <strong>"Curator Attribution / Creator Credit"</strong> field in the teaching editor (e.g. <em>"Curated Heritage Study via @AncestralMothers on TikTok"</em>). This fosters ethical community scholarship, honors melanated creators, and provides sisters with a link to support the creator directly.
                  </p>
                </div>
              </div>

              {/* Ready-to-Test Video Links */}
              <div className="bg-[#1F140E] p-6 rounded-2xl border-2 border-[#D4AF37]/50 text-white space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-sm text-[#D4AF37] flex items-center space-x-2">
                    <span>🎬</span>
                    <span>Ready-to-Test Public Links for Mama Shantrece</span>
                  </h4>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    Auto-Formatted &amp; Tested
                  </span>
                </div>

                <p className="text-xs text-white/80 font-sans">
                  Click any sample link below to quickly create or test an embedded teaching:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SAMPLE_EMBED_VIDEOS.map((sample, i) => (
                    <div key={i} className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-[#D4AF37]">{sample.label}</span>
                        <button
                          type="button"
                          onClick={() => {
                            handleOpenAddHerStory();
                            setHerStoryFormData(prev => ({
                              ...prev,
                              title: `Sacred Lesson: ${sample.label}`,
                              videoUrl: sample.url,
                              videoAttribution: sample.attribution
                            }));
                          }}
                          className="px-2.5 py-1 bg-[#D4AF37] hover:bg-[#c29d2f] text-[#1F140E] rounded-lg font-mono text-[10px] font-bold cursor-pointer transition-all"
                        >
                          + Use as New Teaching
                        </button>
                      </div>
                      <p className="text-[11px] font-mono text-neutral-300 truncate">{sample.url}</p>
                      <p className="text-[10px] font-mono text-neutral-400 italic">Credit: {sample.attribution}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL: WIDER RESPONSIVE COURSE VIEWER & LESSONS HUB  */}
      {/* ==================================================== */}
      {activeTraining && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-2 sm:p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-[#FAF5EE] rounded-3xl max-w-6xl w-[98vw] sm:w-[95vw] p-5 sm:p-8 border-2 border-[#D4AF37]/80 shadow-2xl space-y-6 max-h-[94vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-copper-penny/20 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#1F140E] text-[#D4AF37]">
                    {activeTraining.category.toUpperCase()} · {activeTraining.level}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    {activeTraining.priceType}
                  </span>
                </div>
                <h3 className="font-serif font-black text-xl sm:text-2xl lg:text-3xl text-[#1F140E] mt-1">
                  {activeTraining.title}
                </h3>
                <p className="text-xs font-mono text-soft-sage mt-0.5">
                  Instructor: {activeTraining.instructor} ({activeTraining.instructorRole}) · {activeTraining.lessons.length} Modules · {activeTraining.duration}
                </p>
              </div>

              <div className="flex items-center space-x-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => {
                    setEditingCourse(activeTraining);
                    setActiveTraining(null);
                    setActiveAcademyTab('adminManager');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#c29d2f] text-[#1F140E] font-mono text-xs font-bold flex items-center space-x-1.5 cursor-pointer transition-all shadow-xs"
                  title="Open Course Studio & Curriculum Editor"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>✏️ Edit Course</span>
                </button>

                <button 
                  onClick={() => {
                    setActiveTraining(null);
                    setIsFullscreenVideo(false);
                    setIsPlayingVideo(false);
                  }}
                  className="p-2 rounded-xl bg-copper-penny/10 hover:bg-copper-penny/20 text-[#1F140E] cursor-pointer transition-colors border border-copper-penny/25 text-xs font-bold font-mono"
                  title="Close Course Window"
                >
                  ✕ Close
                </button>
              </div>
            </div>

            {/* Main Course Video / Image & Click-Through Active Module Display Area */}
            <div className="space-y-3">
                  {/* Frame Ratio Mode Switcher Toolbar */}
                  <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-copper-penny/20 text-xs font-mono shadow-2xs">
                    <span className="text-[11px] font-bold text-[#1F140E]">📐 Player Ratio:</span>
                    <div className="flex items-center space-x-1">
                      {[
                        { id: 'auto', label: '⚡ Auto' },
                        { id: 'widescreen', label: '🖥️ 16:9 Widescreen' },
                        { id: 'portrait', label: '📱 9:16 Portrait' }
                      ].map(m => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setVideoAspectRatioMode(m.id as any)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                            videoAspectRatioMode === m.id
                              ? 'bg-[#1F140E] text-[#D4AF37]'
                              : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                          }`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className={`w-full rounded-2xl overflow-hidden bg-neutral-900 relative transition-all shadow-lg ${
                    isFullscreenVideo 
                      ? 'fixed inset-0 z-[9999999] rounded-none aspect-auto h-screen w-screen flex flex-col justify-center items-center bg-black p-4' 
                      : isEffectiveVertical 
                        ? 'max-w-[360px] mx-auto h-[540px] flex justify-center items-center border-2 border-[#D4AF37]/50 bg-black' 
                        : 'aspect-[16/9]'
                  }`}>
                    {/* If Playing & Has Embed */}
                    {isPlayingVideo && embedInfo.isEmbeddable ? (
                      embedInfo.type === 'vimeo' ? (
                        <iframe
                          src={embedInfo.embedUrl}
                          title={activeLesson?.title || activeTraining.title}
                          className="w-full h-full border-0 absolute inset-0"
                          allow="autoplay; fullscreen; picture-in-picture"
                          allowFullScreen
                        />
                      ) : embedInfo.type === 'html5' ? (
                        <video
                          controls
                          autoPlay
                          src={embedInfo.embedUrl}
                          className="w-full h-full object-contain bg-black absolute inset-0"
                        />
                      ) : (
                        <iframe
                          src={embedInfo.embedUrl}
                          title={activeLesson?.title || activeTraining.title}
                          className={isEffectiveVertical ? "w-full h-full border-0" : "w-full h-full border-0 absolute inset-0"}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      )
                    ) : isPlayingVideo && !embedInfo.isEmbeddable ? (
                      /* Study / Reading Module Card */
                      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-white bg-gradient-to-b from-[#1F140E] via-[#2A1D16] to-[#1F140E] absolute inset-0 space-y-3">
                        <span className="text-5xl animate-bounce">
                          {activeLesson?.type === 'worksheet' ? '📄' : '📖'}
                        </span>
                        <span className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] font-extrabold">
                          {activeLesson?.type === 'worksheet' ? 'Action Workbook & Practical Exercise' : 'Reading & Sacred Study Lesson'}
                        </span>
                        <h3 className="font-serif font-black text-xl sm:text-2xl text-white max-w-xl">
                          {activeLesson?.title}
                        </h3>
                        {activeLesson?.contentSnippet && (
                          <p className="text-xs sm:text-sm text-neutral-200/90 max-w-xl font-sans leading-relaxed">
                            {activeLesson.contentSnippet}
                          </p>
                        )}
                        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                          {activeLesson?.attachmentUrl && (
                            <button
                              type="button"
                              onClick={() => handleDownloadAttachment(activeLesson, activeTraining.title)}
                              className="px-4 py-2.5 bg-[#D4AF37] hover:bg-[#c29d2f] text-[#1F140E] font-mono text-xs font-bold rounded-xl shadow-lg flex items-center space-x-2 cursor-pointer transition-all"
                            >
                              <Download className="w-4 h-4" />
                              <span>Download {activeLesson.attachmentName || 'Workbook PDF'}</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => setIsPlayingVideo(false)}
                            className="px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white font-mono text-xs font-bold rounded-xl cursor-pointer"
                          >
                            View Cover Photo
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Paused / Initial Player Cover Stage */
                      <>
                        <img 
                          src={activeTraining.coverImage} 
                          alt={activeTraining.title} 
                          className="w-full h-full object-cover opacity-85 absolute inset-0 transition-all duration-300" 
                        />
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/30 flex flex-col items-center justify-center p-4 text-center">
                          <button 
                            onClick={() => setIsPlayingVideo(true)}
                            className="w-16 h-16 rounded-full bg-[#D4AF37] hover:bg-[#c29d2f] text-[#1F140E] flex items-center justify-center shadow-2xl hover:scale-110 transition-all cursor-pointer border-2 border-white group"
                            title="Play Video Lecture Stream"
                          >
                            <Play className="w-7 h-7 fill-[#1F140E] ml-1 group-hover:scale-105 transition-transform" />
                          </button>

                          <div className="mt-4 bg-black/80 px-4 py-2.5 rounded-2xl border border-white/20 text-white space-y-1 max-w-lg shadow-xl">
                            <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] block font-extrabold">
                              {embedInfo.isEmbeddable ? '▶ Video Lecture Ready' : '📖 Study Module Ready'}
                            </span>
                            <p className="text-xs sm:text-sm font-serif font-bold text-white line-clamp-1">
                              {activeLesson?.title || activeTraining.title}
                            </p>
                            <p className="text-[10px] font-mono text-neutral-300">
                              {activeLesson?.duration || activeTraining.duration} · Click to start viewing
                            </p>
                          </div>
                        </div>
                      </>
                    )}

                  {/* Fullscreen Toggle */}
                  <button
                    onClick={() => setIsFullscreenVideo(prev => !prev)}
                    className="absolute top-4 right-4 p-2.5 rounded-xl bg-black/75 hover:bg-black text-white border border-white/30 cursor-pointer transition-all shadow-md z-10 flex items-center space-x-1.5 text-xs font-mono"
                    title="Toggle Fullscreen Video Mode"
                  >
                    <Maximize2 className="w-4 h-4 text-[#D4AF37]" />
                    <span className="hidden sm:inline">{isFullscreenVideo ? 'Exit Fullscreen' : 'Fullscreen Video'}</span>
                  </button>

                  {isFullscreenVideo && (
                    <button
                      onClick={() => setIsFullscreenVideo(false)}
                      className="absolute top-4 left-4 px-4 py-2 rounded-xl bg-[#D4AF37] text-[#1F140E] font-mono text-xs font-bold cursor-pointer shadow-lg"
                    >
                      ← Exit Fullscreen Video
                    </button>
                  )}
                </div>
              </div>

            {/* COURSE-LEVEL LIKE & LOVE EMOJIS ATTACHED UNDERNEATH THE MAIN VIDEO / IMAGE */}
            {(() => {
              const reactions = courseReactions[activeTraining.id] || { likes: 24, loves: 18, likedByMe: false, lovedByMe: false };

              return (
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-copper-penny/25 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs sm:text-sm font-mono text-[#1F140E] font-bold flex items-center space-x-1.5">
                      <span>💖</span>
                      <span>Enjoying this Masterclass? Show Sister Love &amp; Support:</span>
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={() => handleToggleCourseLike(activeTraining.id)}
                      className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl font-mono text-xs font-bold cursor-pointer transition-all shadow-xs ${
                        reactions.likedByMe
                          ? 'bg-amber-100 text-amber-950 border-2 border-amber-400 font-black'
                          : 'bg-amber-50/80 hover:bg-amber-100 text-amber-900 border border-amber-300'
                      }`}
                      title="Like Masterclass"
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${reactions.likedByMe ? 'text-[#B87333] fill-[#B87333]' : 'text-[#B87333]'}`} />
                      <span>👍 {reactions.likes} Likes</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleCourseLove(activeTraining.id)}
                      className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl font-mono text-xs font-bold cursor-pointer transition-all shadow-xs ${
                        reactions.lovedByMe
                          ? 'bg-rose-100 text-rose-950 border-2 border-rose-400 font-black'
                          : 'bg-rose-50/80 hover:bg-rose-100 text-rose-900 border border-rose-300'
                      }`}
                      title="Love Emoji Reaction"
                    >
                      <Heart className={`w-3.5 h-3.5 ${reactions.lovedByMe ? 'fill-rose-600 text-rose-600' : 'text-rose-600'}`} />
                      <span>❤️ {reactions.loves} Loves</span>
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* Two-Column Grid: Course Overview & Click-Through Sub-Modules / Lessons */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Description & Objectives */}
              <div className="lg:col-span-6 space-y-4">
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-copper-penny/20 shadow-xs space-y-3">
                  <h4 className="font-serif font-bold text-sm text-[#1F140E]">About This Masterclass</h4>
                  <p className="text-xs sm:text-sm text-[#1F140E]/90 leading-relaxed font-sans">
                    {activeTraining.description}
                  </p>
                </div>

                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-copper-penny/20 shadow-xs space-y-3">
                  <span className="text-xs font-mono uppercase font-bold text-[#B87333] block">
                    Core Mastery Objectives:
                  </span>
                  <ul className="space-y-2 text-xs text-[#1F140E]/90 font-sans">
                    {activeTraining.objectives.map((obj, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* INLINE COURSE DISCOVERY HASHTAGS CARD */}
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-copper-penny/25 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-copper-penny/10 pb-2">
                    <span className="text-xs font-mono uppercase font-bold text-[#B87333] flex items-center space-x-1.5">
                      <Tag className="w-3.5 h-3.5" />
                      <span>Course Discovery #Hashtags</span>
                    </span>
                    <span className="text-[10px] font-mono text-soft-sage font-bold">
                      {(activeTraining.hashtags || []).length} Tags Active
                    </span>
                  </div>

                  <p className="text-[11px] text-[#1F140E]/80 font-sans leading-relaxed">
                    Tags link this masterclass to sitewide searches, Village Commons replies, and study circles.
                  </p>

                  {/* Active Tags with ✕ to remove */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase font-bold text-soft-sage block">
                      Active Course Tags:
                    </label>
                    <div className="flex flex-wrap items-center gap-1.5 min-h-[32px] p-2 bg-[#FAF5EE] rounded-xl border border-copper-penny/20">
                      {(activeTraining.hashtags || []).length === 0 ? (
                        <span className="text-xs text-soft-sage italic">No hashtags linked yet.</span>
                      ) : (
                        activeTraining.hashtags!.map(tag => (
                          <span
                            key={tag}
                            className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-white text-[#B87333] border border-[#D4AF37] text-xs font-mono font-bold shadow-2xs"
                          >
                            <span>{tag}</span>
                            <button
                              type="button"
                              onClick={() => handleToggleCourseHashtag(activeTraining.id, tag)}
                              className="text-neutral-400 hover:text-rose-600 p-0.5 ml-1 cursor-pointer"
                              title={`Remove ${tag}`}
                            >
                              ✕
                            </button>
                          </span>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Suggested Hashtags Toggle */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase font-bold text-soft-sage block">
                      ⚡ Suggested for {activeTraining.category.toUpperCase()} Track:
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {(CATEGORY_SUGGESTED_HASHTAGS[activeTraining.category] || []).map(tag => {
                        const isAdded = (activeTraining.hashtags || []).includes(tag);
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => handleToggleCourseHashtag(activeTraining.id, tag)}
                            className={`px-2 py-0.5 rounded-lg text-[10.5px] font-mono font-bold transition-all cursor-pointer ${
                              isAdded
                                ? 'bg-[#1F140E] text-[#D4AF37] border border-[#D4AF37]'
                                : 'bg-[#FAF5EE] hover:bg-neutral-100 text-[#1F140E] border border-copper-penny/25'
                            }`}
                          >
                            <span>{tag}</span>
                            <span className="ml-1">{isAdded ? '✓' : '+'}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Add Custom Tag */}
                  <div className="flex items-center space-x-2 pt-1">
                    <input
                      type="text"
                      value={newHashtagCustomInputMap[activeTraining.id] || ''}
                      onChange={(e) => setNewHashtagCustomInputMap(prev => ({ ...prev, [activeTraining.id]: e.target.value }))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCustomCourseHashtag(activeTraining.id, newHashtagCustomInputMap[activeTraining.id] || '');
                        }
                      }}
                      placeholder="Type custom hashtag e.g. #SeedSecurity..."
                      className="flex-1 bg-[#FAF5EE] border border-copper-penny/25 px-3 py-1.5 rounded-xl text-xs font-mono focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddCustomCourseHashtag(activeTraining.id, newHashtagCustomInputMap[activeTraining.id] || '')}
                      className="px-3.5 py-1.5 bg-[#1F140E] text-[#D4AF37] rounded-xl font-mono text-xs font-bold cursor-pointer hover:bg-[#2A1D16]"
                    >
                      + Add Tag
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Click-Through Sub-Titles / Lessons with Mark Complete & Attachment Downloads */}
              <div className="lg:col-span-6 space-y-4">
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-copper-penny/20 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-copper-penny/10 pb-2.5">
                    <h4 className="font-serif font-bold text-sm text-[#1F140E] flex items-center space-x-2">
                      <span>📚</span>
                      <span>Modules, Lessons &amp; Click-Throughs</span>
                    </h4>
                    <span className="text-[11px] font-mono text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      {activeTraining.lessons.filter(l => l.completed).length} / {activeTraining.lessons.length} Completed
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                      <div 
                        className="h-full bg-gradient-to-r from-[#B87333] to-[#D4AF37] transition-all duration-300"
                        style={{ width: `${Math.round((activeTraining.lessons.filter(l => l.completed).length / Math.max(1, activeTraining.lessons.length)) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    {activeTraining.lessons.map((lesson) => {
                      const isSelected = (activeLessonId || activeTraining.lessons[0]?.id) === lesson.id;

                      return (
                        <div 
                          key={lesson.id}
                          onClick={() => {
                            setActiveLessonId(lesson.id);
                            setIsPlayingVideo(true);
                          }}
                          className={`p-3.5 rounded-xl border transition-all space-y-2 cursor-pointer hover:border-[#D4AF37] ${
                            isSelected
                              ? 'ring-2 ring-[#D4AF37] bg-amber-50/80 border-[#D4AF37]'
                              : lesson.completed 
                                ? 'bg-emerald-50/50 border-emerald-300' 
                                : 'bg-[#FAF5EE]/70 border-copper-penny/20'
                          }`}
                          title="Click to load this module in the player"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center space-x-2.5 min-w-0">
                              <span className="text-base shrink-0">
                                {lesson.type === 'video' ? '▶️' : lesson.type === 'worksheet' ? '📄' : '📖'}
                              </span>
                              <div className="min-w-0">
                                <div className="flex items-center space-x-1.5">
                                  <h5 className="font-serif font-bold text-xs text-[#1F140E] truncate">
                                    {lesson.title}
                                  </h5>
                                  {isSelected && (
                                    <span className="text-[9px] font-mono font-bold bg-[#D4AF37] text-[#1F140E] px-1.5 py-0.2 rounded-md">
                                      Active in Player
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] font-mono text-soft-sage">
                                  {lesson.duration} · {lesson.videoUrl ? 'Video Stream' : 'Curriculum Material'} · Click to Watch/Open
                                </p>
                              </div>
                            </div>

                            {/* Mark Complete Checkbox / Button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleLessonComplete(activeTraining.id, lesson.id);
                              }}
                              className={`px-3 py-1.5 rounded-xl font-mono text-[10px] font-bold transition-all cursor-pointer shrink-0 flex items-center space-x-1 ${
                                lesson.completed
                                  ? 'bg-emerald-600 text-white shadow-2xs'
                                  : 'bg-white hover:bg-emerald-50 text-[#1F140E] border border-copper-penny/30'
                              }`}
                              title="Mark lesson as complete"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>{lesson.completed ? 'Completed ✓' : 'Mark Complete'}</span>
                            </button>
                          </div>

                          {lesson.contentSnippet && (
                            <p className="text-[11px] text-[#1F140E]/80 font-sans pl-6 border-l-2 border-[#D4AF37]/50">
                              {lesson.contentSnippet}
                            </p>
                          )}

                          {lesson.attachmentUrl && (
                            <div className="pl-6 pt-1 flex items-center space-x-2">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDownloadAttachment(lesson, activeTraining.title);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-white hover:bg-amber-50 text-xs font-mono text-[#B87333] hover:text-[#91501c] border border-copper-penny/30 flex items-center space-x-1.5 cursor-pointer shadow-2xs font-bold transition-colors"
                                title="Download the attached worksheet / study guide"
                              >
                                <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
                                <span>Download Attached File / PDF ({lesson.attachmentName || 'Guide.pdf'})</span>
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>

            {/* ==================================================== */}
            {/* COURSE COMMENTS & REACTIONS SECTION (WITH LOVE EMOJIS) */}
            {/* ==================================================== */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-copper-penny/20 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-copper-penny/10 pb-3">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4 text-copper-penny" />
                  <h4 className="font-serif font-bold text-sm text-[#1F140E]">
                    Sisterhood Course Discussion &amp; Feedback ({activeTraining.comments.length})
                  </h4>
                </div>

                {activeTraining.comments.length > 2 && (
                  <button
                    type="button"
                    onClick={() => setShowAllCommentsModal(activeTraining)}
                    className="text-xs font-mono text-[#B87333] hover:underline font-bold cursor-pointer"
                  >
                    View All Comments ({activeTraining.comments.length}) →
                  </button>
                )}
              </div>

              {/* Add Comment Input */}
              <div className="space-y-2">
                <textarea
                  value={courseCommentText}
                  onChange={(e) => setCourseCommentText(e.target.value)}
                  placeholder="Share your breakthrough, ask a question, or encourage your sisters..."
                  rows={2}
                  className="w-full bg-[#FAF5EE] border border-copper-penny/25 p-3 rounded-xl text-xs font-sans text-[#1F140E] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                />
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleAddCourseComment(activeTraining.id)}
                    className="px-4 py-2 bg-[#1F140E] hover:bg-[#2A1D16] text-[#D4AF37] font-mono text-xs font-bold rounded-xl flex items-center space-x-1.5 cursor-pointer shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Post Comment</span>
                  </button>
                </div>
              </div>

              {/* Comments List (Showing top 2 with 'View More' toggle) */}
              <div className="space-y-3 pt-2">
                {activeTraining.comments.slice(0, 2).map((comment) => (
                  <div key={comment.id} className="bg-[#FAF5EE]/70 p-3.5 rounded-xl border border-copper-penny/15 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-7 h-7 rounded-full bg-amber-200 flex items-center justify-center text-xs font-bold shrink-0">
                          {comment.authorAvatar}
                        </div>
                        <div>
                          <span className="font-serif font-bold text-xs text-[#1F140E]">{comment.authorName}</span>
                          <span className="text-[10px] font-mono text-soft-sage ml-1.5">{comment.authorLocation} · {comment.timestamp}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-[#1F140E]/90 font-sans leading-relaxed">
                      {comment.text}
                    </p>

                    {/* Like & Love Emoji Interaction Buttons */}
                    <div className="flex items-center space-x-3 pt-1 text-xs font-mono">
                      <button
                        type="button"
                        onClick={() => handleToggleCommentLike(activeTraining.id, comment.id)}
                        className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                          comment.likedByMe 
                            ? 'bg-amber-100 text-amber-900 font-bold border border-amber-300' 
                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                        }`}
                        title="Like Comment"
                      >
                        <ThumbsUp className="w-3 h-3 text-[#B87333]" />
                        <span>{comment.likesCount} Likes</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleCommentLove(activeTraining.id, comment.id)}
                        className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                          comment.lovedByMe 
                            ? 'bg-rose-100 text-rose-900 font-bold border border-rose-300' 
                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                        }`}
                        title="Love Emoji Reaction"
                      >
                        <Heart className={`w-3 h-3 ${comment.lovedByMe ? 'fill-rose-600 text-rose-600' : 'text-rose-500'}`} />
                        <span>{comment.lovesCount} Loves</span>
                      </button>
                    </div>
                  </div>
                ))}

                {activeTraining.comments.length === 0 && (
                  <p className="text-xs font-mono text-soft-sage text-center py-3">
                    No comments yet. Be the first sister to share a reflection on this masterclass!
                  </p>
                )}
              </div>
            </div>

            {/* Footer Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-copper-penny/20">
              <span className="text-xs font-mono text-soft-sage">
                💡 All completed lessons automatically sync with your Wisdom Progression Level!
              </span>

              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <button
                  onClick={() => handleDownloadCourseWorkbook(activeTraining)}
                  className="px-4 py-2 bg-white hover:bg-neutral-50 text-[#1F140E] font-mono text-xs font-bold rounded-xl border border-copper-penny/25 flex items-center space-x-1.5 cursor-pointer shadow-2xs transition-all"
                  title="Download complete formatted curriculum workbook"
                >
                  <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Download Full Workbook PDF</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTraining(null);
                    setIsFullscreenVideo(false);
                  }}
                  className="px-5 py-2 bg-[#1F140E] hover:bg-[#2A1D16] text-[#D4AF37] font-mono text-xs font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Save &amp; Return to Classroom
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL: VIEW ALL COMMENTS & REACTIONS POPUP           */}
      {/* ==================================================== */}
      {showAllCommentsModal && (
        <div className="fixed inset-0 bg-black/70 z-[999999] flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[#FAF5EE] rounded-3xl max-w-lg w-full p-6 shadow-2xl border-2 border-[#D4AF37] space-y-4 max-h-[85vh] overflow-y-auto text-[#1F140E]">
            <div className="flex items-center justify-between border-b border-copper-penny/20 pb-3">
              <h4 className="font-serif font-black text-base text-[#1F140E]">
                All Sisterhood Comments ({showAllCommentsModal.comments.length})
              </h4>
              <button 
                onClick={() => setShowAllCommentsModal(null)}
                className="p-1 rounded-lg hover:bg-copper-penny/10 text-gray-500 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {showAllCommentsModal.comments.map((comment) => (
                <div key={comment.id} className="bg-white p-3.5 rounded-xl border border-copper-penny/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-amber-200 flex items-center justify-center text-xs font-bold">
                        {comment.authorAvatar}
                      </div>
                      <span className="font-serif font-bold text-xs text-[#1F140E]">{comment.authorName}</span>
                      <span className="text-[9px] font-mono text-soft-sage">({comment.timestamp})</span>
                    </div>
                  </div>
                  <p className="text-xs text-[#1F140E]/90 font-sans leading-relaxed">{comment.text}</p>
                  
                  <div className="flex items-center space-x-3 pt-1 text-xs font-mono">
                    <button
                      type="button"
                      onClick={() => handleToggleCommentLike(showAllCommentsModal.id, comment.id)}
                      className={`flex items-center space-x-1 px-2 py-0.5 rounded-lg cursor-pointer ${comment.likedByMe ? 'bg-amber-100 font-bold text-amber-900' : 'bg-gray-100 text-gray-700'}`}
                    >
                      <ThumbsUp className="w-3 h-3 text-[#B87333]" />
                      <span>{comment.likesCount} Likes</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleCommentLove(showAllCommentsModal.id, comment.id)}
                      className={`flex items-center space-x-1 px-2 py-0.5 rounded-lg cursor-pointer ${comment.lovedByMe ? 'bg-rose-100 font-bold text-rose-900' : 'bg-gray-100 text-gray-700'}`}
                    >
                      <Heart className="w-3 h-3 text-rose-600 fill-rose-600" />
                      <span>{comment.lovesCount} Loves</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowAllCommentsModal(null)}
              className="w-full py-2.5 bg-[#1F140E] text-[#D4AF37] rounded-xl font-mono text-xs font-bold cursor-pointer"
            >
              Close Comments
            </button>
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
                {activeHerStoryTopic.subtitle && (
                  <p className="text-xs font-mono text-soft-sage mt-0.5">
                    {activeHerStoryTopic.subtitle}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {effectiveIsAdmin && (
                  <button 
                    type="button"
                    onClick={() => handleOpenEditHerStory(activeHerStoryTopic)}
                    className="px-3.5 py-1.5 bg-[#1F140E] hover:bg-[#2A1D16] text-[#D4AF37] border border-[#D4AF37]/60 rounded-xl font-mono text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-sm transition-all hover:scale-105 active:scale-95"
                    title="Edit Teaching, Video & Content"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>✏️ Edit Teaching</span>
                  </button>
                )}
                <button 
                  onClick={() => setActiveHerStoryTopic(null)}
                  className="p-1.5 rounded-xl hover:bg-copper-penny/10 text-[#1F140E] cursor-pointer"
                  title="Close modal"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Media Area (Video Player or Cover Image) */}
            {activeHerStoryTopic.videoUrl ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 bg-white p-1 rounded-xl border border-copper-penny/20 text-xs font-mono">
                    <button
                      type="button"
                      onClick={() => setHerStoryModalViewMode('video')}
                      className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                        herStoryModalViewMode === 'video'
                          ? 'bg-[#1F140E] text-[#D4AF37]'
                          : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                    >
                      <Video className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Video Lesson</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setHerStoryModalViewMode('cover')}
                      className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                        herStoryModalViewMode === 'cover'
                          ? 'bg-[#1F140E] text-[#D4AF37]'
                          : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Cover Artwork</span>
                    </button>
                  </div>

                  <span className="text-[10px] font-mono text-soft-sage">
                    {activeHerStoryTopic.readTime}
                  </span>
                </div>

                {herStoryModalViewMode === 'video' ? (
                  (() => {
                    const embedInfo = getVideoEmbedInfo(activeHerStoryTopic.videoUrl);
                    const isEffectiveVertical = videoAspectRatioMode === 'portrait' || (videoAspectRatioMode === 'auto' && embedInfo.isVertical);

                    return (
                      <div className="space-y-3">
                        {/* Frame Ratio Mode Switcher Toolbar */}
                        <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-copper-penny/20 text-xs font-mono shadow-2xs">
                          <span className="text-[11px] font-bold text-[#1F140E]">📐 Player Ratio:</span>
                          <div className="flex items-center space-x-1">
                            {[
                              { id: 'auto', label: '⚡ Auto' },
                              { id: 'widescreen', label: '🖥️ 16:9 Widescreen' },
                              { id: 'portrait', label: '📱 9:16 Portrait' }
                            ].map(m => (
                              <button
                                key={m.id}
                                type="button"
                                onClick={() => setVideoAspectRatioMode(m.id as any)}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                                  videoAspectRatioMode === m.id
                                    ? 'bg-[#1F140E] text-[#D4AF37]'
                                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                                }`}
                              >
                                {m.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {embedInfo.isEmbeddable ? (
                          <div className={`w-full rounded-2xl overflow-hidden bg-black relative transition-all shadow-lg ${
                            isEffectiveVertical 
                              ? 'max-w-[360px] mx-auto h-[540px] flex justify-center items-center border-2 border-[#D4AF37]/50' 
                              : 'aspect-[16/9] w-full bg-neutral-900'
                          }`}>
                            <iframe 
                              src={embedInfo.embedUrl} 
                              className={isEffectiveVertical ? "w-full h-full border-0" : "w-full h-full border-0 absolute inset-0"} 
                              allowFullScreen 
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              title={activeHerStoryTopic.title}
                            />
                          </div>
                        ) : (
                          <div className="p-8 text-center bg-neutral-900 text-white rounded-2xl space-y-3">
                            <Video className="w-8 h-8 text-[#D4AF37] mx-auto animate-pulse" />
                            <p className="text-xs font-mono">External video study resource:</p>
                            <a 
                              href={activeHerStoryTopic.videoUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#D4AF37] text-[#1F140E] rounded-xl font-mono text-xs font-bold hover:bg-[#c49f2e] transition-all"
                            >
                              <span>Watch Video on Platform</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        )}
                      </div>
                    );
                  })()
                ) : (

                  <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden bg-neutral-900 shadow-inner">
                    <img src={activeHerStoryTopic.coverImage} alt={activeHerStoryTopic.title} className="w-full h-full object-cover" />
                  </div>
                )}

                {/* Educational Attribution Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono text-soft-sage bg-[#1F140E] px-4 py-2.5 rounded-xl border border-[#D4AF37]/30 text-white/90">
                  <div className="flex items-center space-x-2">
                    <span className="text-[#D4AF37]">🏛️</span>
                    <span>Source &amp; Attribution: <strong className="text-amber-200">{activeHerStoryTopic.videoAttribution || 'Curated Ancestral Teaching'}</strong></span>
                  </div>
                  <a 
                    href={activeHerStoryTopic.videoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-[#D4AF37] hover:underline flex items-center space-x-1 shrink-0"
                  >
                    <span>View on Platform</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden bg-neutral-900 shadow-inner">
                <img src={activeHerStoryTopic.coverImage} alt={activeHerStoryTopic.title} className="w-full h-full object-cover" />
              </div>
            )}

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

      {/* ==================================================== */}
      {/* MODAL: COURSE STUDIO & CURRICULUM MANAGER (EXACT LAYOUT) */}
      {/* ==================================================== */}
      {editingCourse && (
        <div className="fixed inset-0 bg-black/80 z-[99999] flex items-center justify-center p-2 sm:p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-[#FAF5EE] rounded-3xl max-w-6xl w-[98vw] sm:w-[95vw] p-5 sm:p-8 border-2 border-[#D4AF37] shadow-2xl space-y-6 max-h-[95vh] overflow-y-auto text-[#1F140E]">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-copper-penny/20 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#1F140E] text-[#D4AF37]">
                    🛠️ Course Studio &amp; Curriculum Manager
                  </span>
                  <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    Live Editing Mode
                  </span>
                </div>
                <h3 className="font-serif font-black text-xl sm:text-2xl text-[#1F140E] mt-1">
                  Editing: {editingCourse.title || 'Untitled Masterclass'}
                </h3>
                <p className="text-xs font-mono text-soft-sage">
                  Upload cover photos, embed YouTube/MP4 videos, organize module curricula, and attach PDF workbooks.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleSaveEditingCourse}
                  className="px-4 py-2 bg-[#D4AF37] hover:bg-[#c29d2f] text-[#1F140E] font-mono text-xs font-bold rounded-xl shadow-xs cursor-pointer flex items-center space-x-1.5 transition-all"
                  title="Save and publish all changes"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save &amp; Publish</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleSaveEditingCourse();
                    setActiveTraining(editingCourse);
                  }}
                  className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-[#1F140E] font-mono text-xs font-bold rounded-xl border border-amber-300 cursor-pointer flex items-center space-x-1"
                  title="Preview course in the Classroom viewer"
                >
                  <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Preview</span>
                </button>

                <button
                  type="button"
                  onClick={() => setEditingCourse(null)}
                  className="p-2 rounded-xl bg-copper-penny/10 hover:bg-copper-penny/20 text-[#1F140E] cursor-pointer text-xs font-mono font-bold"
                  title="Close without saving"
                >
                  ✕ Close
                </button>
              </div>
            </div>

            {/* TOP HERO MEDIA STAGE (FOLLOWING THE COURSE PLAYER LAYOUT) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-bold text-[#1F140E] flex items-center space-x-1.5">
                  <Film className="w-4 h-4 text-[#B87333]" />
                  <span>Main Course Media Stage (Live Player / Cover Preview):</span>
                </label>
                <span className="text-[10px] font-mono text-soft-sage">
                  Matches the 16:9 player window in the Academy viewer
                </span>
              </div>

              {/* 16:9 Media Preview Container */}
              {(() => {
                const embedInfo = getVideoEmbedInfo(editingCourse.videoUrl);

                return (
                  <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden bg-neutral-900 relative shadow-inner border border-copper-penny/30">
                    {embedInfo.isEmbeddable ? (
                      embedInfo.type === 'youtube' ? (
                        <iframe
                          src={embedInfo.embedUrl}
                          title={editingCourse.title}
                          className="w-full h-full border-0 absolute inset-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : embedInfo.type === 'vimeo' ? (
                        <iframe
                          src={embedInfo.embedUrl}
                          title={editingCourse.title}
                          className="w-full h-full border-0 absolute inset-0"
                          allow="autoplay; fullscreen; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <video
                          controls
                          src={embedInfo.embedUrl}
                          className="w-full h-full object-contain bg-black absolute inset-0"
                        />
                      )
                    ) : (
                      <div className="w-full h-full relative">
                        <img
                          src={editingCourse.coverImage || 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80'}
                          alt={editingCourse.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-4 text-center text-white">
                          <span className="px-3 py-1 rounded-full bg-black/75 text-[11px] font-mono font-bold text-[#D4AF37] border border-white/20">
                            Course Cover Photo Preview
                          </span>
                          <p className="font-serif font-bold text-sm sm:text-base mt-2 max-w-md">
                            {editingCourse.title || 'Course Title Preview'}
                          </p>
                          <span className="text-[10px] font-mono text-neutral-300 mt-1">
                            {editingCourse.videoUrl ? 'Video Stream configured' : 'Add a YouTube link or video file below to enable video playback'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* MEDIA UPLOAD & LINK CONTROLS */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-copper-penny/25 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Cover Image Upload / Link */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#1F140E] flex items-center space-x-1">
                      <ImageIcon className="w-3.5 h-3.5 text-[#B87333]" />
                      <span>Course Cover Photo</span>
                    </span>
                    <label className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-[#1F140E] font-mono text-[10px] font-bold rounded-lg border border-amber-300 cursor-pointer flex items-center space-x-1 transition-all">
                      <Upload className="w-3 h-3 text-[#B87333]" />
                      <span>Upload from Device</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleGenericFileUpload(e, (dataUrl) => {
                          setEditingCourse(prev => prev ? { ...prev, coverImage: dataUrl } : null);
                          setAdminToast('Cover image uploaded from device successfully!');
                        })}
                      />
                    </label>
                  </div>
                  <input
                    type="text"
                    value={editingCourse.coverImage}
                    onChange={(e) => setEditingCourse(prev => prev ? { ...prev, coverImage: e.target.value } : null)}
                    placeholder="Paste image URL (Unsplash, Cloudinary, etc.)"
                    className="w-full bg-[#FAF5EE] border border-copper-penny/25 px-3 py-2 rounded-xl text-xs font-sans text-[#1F140E] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                  />
                  <span className="text-[10px] font-mono text-soft-sage block">
                    You can select an image directly from your computer/phone or paste an image URL.
                  </span>
                </div>

                {/* Course Video Embed / Upload */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#1F140E] flex items-center space-x-1">
                      <Film className="w-3.5 h-3.5 text-[#B87333]" />
                      <span>Course Overview / Lecture Video</span>
                    </span>
                    <label className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-[#1F140E] font-mono text-[10px] font-bold rounded-lg border border-amber-300 cursor-pointer flex items-center space-x-1 transition-all">
                      <Upload className="w-3 h-3 text-[#B87333]" />
                      <span>Upload Video File</span>
                      <input
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={(e) => handleGenericFileUpload(e, (dataUrl) => {
                          setEditingCourse(prev => prev ? { ...prev, videoUrl: dataUrl } : null);
                          setAdminToast('Video uploaded from device successfully!');
                        })}
                      />
                    </label>
                  </div>
                  <input
                    type="text"
                    value={editingCourse.videoUrl || ''}
                    onChange={(e) => setEditingCourse(prev => prev ? { ...prev, videoUrl: e.target.value } : null)}
                    placeholder="Paste YouTube link (e.g. youtube.com/watch?v=... or youtu.be/...) or MP4 URL"
                    className="w-full bg-[#FAF5EE] border border-copper-penny/25 px-3 py-2 rounded-xl text-xs font-sans text-[#1F140E] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                  />
                  <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 block">
                    ⚡ <strong>Live YouTube Embed:</strong> Paste any YouTube video link, and it immediately embeds into the player window above!
                  </span>
                </div>
              </div>
            </div>

            {/* METADATA GRID: TITLE, CATEGORY, LEVEL, INSTRUCTOR */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-copper-penny/25 shadow-xs space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-[#1F140E]">Masterclass Title *</label>
                <input
                  type="text"
                  required
                  value={editingCourse.title}
                  onChange={(e) => setEditingCourse(prev => prev ? { ...prev, title: e.target.value } : null)}
                  placeholder="e.g. Family Wealth, Private Trusts & Land Protection"
                  className="w-full bg-[#FAF5EE] border border-copper-penny/25 px-3.5 py-2.5 rounded-xl text-sm font-serif font-bold text-[#1F140E] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="font-mono font-bold text-[#1F140E]">Category</label>
                  <select
                    value={editingCourse.category}
                    onChange={(e) => setEditingCourse(prev => prev ? { ...prev, category: e.target.value as any } : null)}
                    className="w-full bg-[#FAF5EE] border border-copper-penny/25 px-3 py-2 rounded-xl font-sans text-[#1F140E] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                  >
                    <option value="wealth">💰 Family Wealth &amp; Trusts</option>
                    <option value="herbal">🌿 Folk Apothecary &amp; Herbs</option>
                    <option value="homestead">🌾 Homestead &amp; Food Security</option>
                    <option value="business">💼 Melanated Enterprise</option>
                    <option value="wellness">🕊️ Rest &amp; Inner Healing</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-mono font-bold text-[#1F140E]">Proficiency Level</label>
                  <select
                    value={editingCourse.level}
                    onChange={(e) => setEditingCourse(prev => prev ? { ...prev, level: e.target.value } : null)}
                    className="w-full bg-[#FAF5EE] border border-copper-penny/25 px-3 py-2 rounded-xl font-sans text-[#1F140E] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                  >
                    <option value="Foundational">Foundational</option>
                    <option value="All Levels">All Levels</option>
                    <option value="Action Track">Action Track</option>
                    <option value="Heart Sanctuary">Heart Sanctuary</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-mono font-bold text-[#1F140E]">Duration Label</label>
                  <input
                    type="text"
                    value={editingCourse.duration}
                    onChange={(e) => setEditingCourse(prev => prev ? { ...prev, duration: e.target.value } : null)}
                    placeholder="e.g. 4 Modules · 2.5 hrs"
                    className="w-full bg-[#FAF5EE] border border-copper-penny/25 px-3 py-2 rounded-xl font-sans text-[#1F140E] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono font-bold text-[#1F140E]">Access / Price Type</label>
                  <select
                    value={editingCourse.priceType}
                    onChange={(e) => setEditingCourse(prev => prev ? { ...prev, priceType: e.target.value as any } : null)}
                    className="w-full bg-[#FAF5EE] border border-copper-penny/25 px-3 py-2 rounded-xl font-sans text-[#1F140E] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                  >
                    <option value="Free Member Included">Free Member Included</option>
                    <option value="Sponsored Masterclass">Sponsored Masterclass</option>
                    <option value="Community Co-Op">Community Co-Op</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="font-mono font-bold text-[#1F140E]">Instructor Name</label>
                  <input
                    type="text"
                    value={editingCourse.instructor}
                    onChange={(e) => setEditingCourse(prev => prev ? { ...prev, instructor: e.target.value } : null)}
                    placeholder="e.g. Mama Danielle & Sister Kendra"
                    className="w-full bg-[#FAF5EE] border border-copper-penny/25 px-3 py-2 rounded-xl font-sans text-[#1F140E] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono font-bold text-[#1F140E]">Instructor Title / Role</label>
                  <input
                    type="text"
                    value={editingCourse.instructorRole}
                    onChange={(e) => setEditingCourse(prev => prev ? { ...prev, instructorRole: e.target.value } : null)}
                    placeholder="e.g. Estate Planning & Trust Specialists"
                    className="w-full bg-[#FAF5EE] border border-copper-penny/25 px-3 py-2 rounded-xl font-sans text-[#1F140E] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                  />
                </div>
              </div>
            </div>

            {/* TWO-COLUMN LOWER SECTION (EXACT COURSE LAYOUT MATCH) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Description & Objectives */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-copper-penny/25 shadow-xs space-y-2">
                  <label className="font-serif font-bold text-sm text-[#1F140E] block">
                    About This Masterclass (Description)
                  </label>
                  <textarea
                    rows={4}
                    value={editingCourse.description}
                    onChange={(e) => setEditingCourse(prev => prev ? { ...prev, description: e.target.value } : null)}
                    placeholder="Describe what mothers will learn and why this masterclass empowers our sisterhood..."
                    className="w-full bg-[#FAF5EE] border border-copper-penny/25 p-3 rounded-xl text-xs font-sans text-[#1F140E] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                  />
                </div>

                {/* Core Mastery Objectives */}
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-copper-penny/25 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-copper-penny/10 pb-2">
                    <span className="text-xs font-mono uppercase font-bold text-[#B87333]">
                      Core Mastery Objectives:
                    </span>
                    <button
                      type="button"
                      onClick={() => setEditingCourse(prev => prev ? {
                        ...prev,
                        objectives: [...prev.objectives, 'New practical action objective']
                      } : null)}
                      className="text-[11px] font-mono text-[#D4AF37] hover:underline font-bold flex items-center space-x-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Objective</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {editingCourse.objectives.map((obj, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <input
                          type="text"
                          value={obj}
                          onChange={(e) => {
                            const newObjs = [...editingCourse.objectives];
                            newObjs[idx] = e.target.value;
                            setEditingCourse(prev => prev ? { ...prev, objectives: newObjs } : null);
                          }}
                          className="flex-1 bg-[#FAF5EE] border border-copper-penny/20 px-2.5 py-1.5 rounded-lg text-xs font-sans text-[#1F140E] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCourse(prev => prev ? {
                              ...prev,
                              objectives: prev.objectives.filter((_, i) => i !== idx)
                            } : null);
                          }}
                          className="p-1 text-rose-500 hover:text-rose-700 cursor-pointer"
                          title="Remove objective"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Course Hashtags & Ecosystem Discovery Card */}
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-copper-penny/25 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-copper-penny/10 pb-2">
                    <span className="text-xs font-mono uppercase font-bold text-[#B87333] flex items-center space-x-1.5">
                      <span>🏷️</span>
                      <span>Course Discovery #Hashtags</span>
                    </span>
                    <span className="text-[10px] font-mono text-soft-sage">
                      {(editingCourse.hashtags || []).length} Tags Active
                    </span>
                  </div>

                  <p className="text-[11px] text-[#1F140E]/80 font-sans leading-relaxed">
                    Tags link this masterclass to sitewide searches, Village Commons replies, and study circles.
                  </p>

                  {/* Suggested Hashtags based on Category */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase font-bold text-soft-sage block">
                      ⚡ Suggested for {editingCourse.category.toUpperCase()} Track:
                    </label>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {(CATEGORY_SUGGESTED_HASHTAGS[editingCourse.category] || []).map(tag => {
                        const isAdded = (editingCourse.hashtags || []).includes(tag);
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => {
                              const currentTags = editingCourse.hashtags || [];
                              if (isAdded) {
                                setEditingCourse(prev => prev ? { ...prev, hashtags: currentTags.filter(t => t !== tag) } : null);
                              } else {
                                setEditingCourse(prev => prev ? { ...prev, hashtags: [...currentTags, tag] } : null);
                              }
                            }}
                            className={`px-2.5 py-1 rounded-lg text-[10.5px] font-mono font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                              isAdded
                                ? 'bg-[#1F140E] text-[#D4AF37] border border-[#D4AF37]'
                                : 'bg-[#FAF5EE] hover:bg-neutral-100 text-[#1F140E] border border-copper-penny/25'
                            }`}
                          >
                            <span>{tag}</span>
                            <span>{isAdded ? '✓' : '+'}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Current Active Tags */}
                  {(editingCourse.hashtags || []).length > 0 && (
                    <div className="space-y-1 pt-1">
                      <label className="text-[10px] font-mono uppercase font-bold text-soft-sage block">
                        Active Course Tags:
                      </label>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {(editingCourse.hashtags || []).map(ht => (
                          <span
                            key={ht}
                            className="px-2.5 py-1 rounded-xl bg-[#FAF5EE] border border-[#D4AF37] text-xs font-mono font-bold text-[#B87333] flex items-center space-x-1 shadow-2xs"
                          >
                            <span>{ht}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingCourse(prev => prev ? {
                                  ...prev,
                                  hashtags: (prev.hashtags || []).filter(t => t !== ht)
                                } : null);
                              }}
                              className="hover:text-rose-600 text-neutral-400 p-0.5 cursor-pointer ml-1"
                              title={`Remove ${ht}`}
                            >
                              ✕
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Add Custom Tag */}
                  <div className="flex items-center space-x-2 pt-1">
                    <input
                      type="text"
                      value={editingCourseHashtagInput}
                      onChange={(e) => setEditingCourseHashtagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const clean = editingCourseHashtagInput.trim();
                          if (clean) {
                            const formatted = clean.startsWith('#') ? clean : `#${clean}`;
                            const current = editingCourse.hashtags || [];
                            if (!current.includes(formatted)) {
                              setEditingCourse(prev => prev ? { ...prev, hashtags: [...current, formatted] } : null);
                            }
                            setEditingCourseHashtagInput('');
                          }
                        }
                      }}
                      placeholder="Type custom tag e.g. #FamilyLand or #HerbalBath..."
                      className="flex-1 bg-[#FAF5EE] border border-copper-penny/25 px-3 py-1.5 rounded-xl text-xs font-mono text-[#1F140E] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const clean = editingCourseHashtagInput.trim();
                        if (clean) {
                          const formatted = clean.startsWith('#') ? clean : `#${clean}`;
                          const current = editingCourse.hashtags || [];
                          if (!current.includes(formatted)) {
                            setEditingCourse(prev => prev ? { ...prev, hashtags: [...current, formatted] } : null);
                          }
                          setEditingCourseHashtagInput('');
                        }
                      }}
                      className="px-3 py-1.5 bg-[#1F140E] text-[#D4AF37] rounded-xl font-mono text-xs font-bold cursor-pointer hover:bg-[#2A1D16]"
                    >
                      + Add Tag
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Modules, Lessons & Sub-Topics */}
              <div className="lg:col-span-7 space-y-4">
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-copper-penny/25 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-copper-penny/10 pb-3">
                    <div>
                      <h4 className="font-serif font-bold text-sm text-[#1F140E] flex items-center space-x-2">
                        <span>📚</span>
                        <span>Modules, Lessons &amp; Click-Throughs ({editingCourse.lessons.length})</span>
                      </h4>
                      <p className="text-[10px] font-mono text-soft-sage">
                        Each module can have its own video stream, read-along text, and attached downloadable file/PDF.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const newLesson: CourseLesson = {
                          id: `les-${Date.now()}`,
                          title: `Module ${editingCourse.lessons.length + 1}: `,
                          type: 'video',
                          duration: '20 min',
                          completed: false,
                          videoUrl: '',
                          contentSnippet: 'Key guidance and sovereign principles for this lesson.',
                          attachmentName: 'Module_Study_Guide.pdf',
                          attachmentUrl: '#download-guide'
                        };
                        setEditingCourse(prev => prev ? {
                          ...prev,
                          lessons: [...prev.lessons, newLesson]
                        } : null);
                      }}
                      className="px-3.5 py-2 bg-[#1F140E] hover:bg-[#2A1D16] text-[#D4AF37] font-mono text-xs font-bold rounded-xl shadow-xs cursor-pointer flex items-center space-x-1 shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>➕ Add Module</span>
                    </button>
                  </div>

                  {/* Modules List */}
                  <div className="space-y-4">
                    {editingCourse.lessons.map((lesson, idx) => (
                      <div 
                        key={lesson.id} 
                        className="bg-[#FAF5EE]/80 p-4 rounded-2xl border border-copper-penny/25 space-y-3 relative group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#1F140E] text-[#D4AF37]">
                            Module {idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingCourse(prev => prev ? {
                                ...prev,
                                lessons: prev.lessons.filter(l => l.id !== lesson.id)
                              } : null);
                            }}
                            className="text-xs font-mono text-rose-600 hover:text-rose-800 hover:underline cursor-pointer flex items-center space-x-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove Module</span>
                          </button>
                        </div>

                        {/* Module Title & Type & Duration */}
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
                          <div className="sm:col-span-6 space-y-1">
                            <label className="font-mono font-bold text-[#1F140E]">Module Title *</label>
                            <input
                              type="text"
                              value={lesson.title}
                              onChange={(e) => {
                                const newTitle = e.target.value;
                                setEditingCourse(prev => prev ? {
                                  ...prev,
                                  lessons: prev.lessons.map(l => l.id === lesson.id ? { ...l, title: newTitle } : l)
                                } : null);
                              }}
                              placeholder="e.g. Module 1: The Foundations of Sovereign Family Trusts"
                              className="w-full bg-white border border-copper-penny/25 px-3 py-2 rounded-xl font-serif font-bold text-[#1F140E] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                            />
                          </div>

                          <div className="sm:col-span-3 space-y-1">
                            <label className="font-mono font-bold text-[#1F140E]">Type</label>
                            <select
                              value={lesson.type}
                              onChange={(e) => {
                                const newType = e.target.value as any;
                                setEditingCourse(prev => prev ? {
                                  ...prev,
                                  lessons: prev.lessons.map(l => l.id === lesson.id ? { ...l, type: newType } : l)
                                } : null);
                              }}
                              className="w-full bg-white border border-copper-penny/25 px-2.5 py-2 rounded-xl font-sans text-[#1F140E] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                            >
                              <option value="video">▶️ Video Lecture</option>
                              <option value="reading">📖 Reading</option>
                              <option value="worksheet">📄 Action Worksheet</option>
                            </select>
                          </div>

                          <div className="sm:col-span-3 space-y-1">
                            <label className="font-mono font-bold text-[#1F140E]">Duration</label>
                            <input
                              type="text"
                              value={lesson.duration}
                              onChange={(e) => {
                                const newDur = e.target.value;
                                setEditingCourse(prev => prev ? {
                                  ...prev,
                                  lessons: prev.lessons.map(l => l.id === lesson.id ? { ...l, duration: newDur } : l)
                                } : null);
                              }}
                              placeholder="e.g. 25 min"
                              className="w-full bg-white border border-copper-penny/25 px-2.5 py-2 rounded-xl font-sans text-[#1F140E] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                            />
                          </div>
                        </div>

                        {/* Video Embed URL / Video Device Upload for this module */}
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center justify-between">
                            <label className="font-mono font-bold text-[#1F140E] flex items-center space-x-1">
                              <Film className="w-3.5 h-3.5 text-[#B87333]" />
                              <span>Module Video (YouTube / Vimeo / MP4 Link or Device File):</span>
                            </label>
                            <label className="px-2 py-0.5 bg-white hover:bg-neutral-100 text-[#1F140E] font-mono text-[10px] font-bold rounded-md border border-copper-penny/30 cursor-pointer flex items-center space-x-1 shadow-2xs">
                              <Upload className="w-3 h-3 text-[#B87333]" />
                              <span>Upload Video File</span>
                              <input
                                type="file"
                                accept="video/*"
                                className="hidden"
                                onChange={(e) => handleGenericFileUpload(e, (dataUrl) => {
                                  setEditingCourse(prev => prev ? {
                                    ...prev,
                                    lessons: prev.lessons.map(l => l.id === lesson.id ? { ...l, videoUrl: dataUrl } : l)
                                  } : null);
                                  setAdminToast(`Video file uploaded for "${lesson.title}" successfully!`);
                                })}
                              />
                            </label>
                          </div>
                          <input
                            type="text"
                            value={lesson.videoUrl || ''}
                            onChange={(e) => {
                              const newVid = e.target.value;
                              setEditingCourse(prev => prev ? {
                                ...prev,
                                lessons: prev.lessons.map(l => l.id === lesson.id ? { ...l, videoUrl: newVid } : l)
                              } : null);
                            }}
                            placeholder="e.g. https://www.youtube.com/watch?v=... or direct MP4 stream"
                            className="w-full bg-white border border-copper-penny/25 px-3 py-2 rounded-xl font-sans text-[#1F140E] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                          />
                        </div>

                        {/* Read-Along Notes / Instructions */}
                        <div className="space-y-1 text-xs">
                          <label className="font-mono font-bold text-[#1F140E]">
                            Read-Along Notes / Instructions / Study Guidance:
                          </label>
                          <textarea
                            rows={2}
                            value={lesson.contentSnippet || ''}
                            onChange={(e) => {
                              const newSnip = e.target.value;
                              setEditingCourse(prev => prev ? {
                                ...prev,
                                lessons: prev.lessons.map(l => l.id === lesson.id ? { ...l, contentSnippet: newSnip } : l)
                              } : null);
                            }}
                            placeholder="Add study points, herbal instructions, legal notes, or reflections for this module..."
                            className="w-full bg-white border border-copper-penny/25 p-2.5 rounded-xl font-sans text-[#1F140E] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                          />
                        </div>

                        {/* Module File / PDF Attachment */}
                        <div className="bg-white p-3 rounded-xl border border-copper-penny/20 space-y-2">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <span className="text-xs font-mono font-bold text-[#1F140E] flex items-center space-x-1.5">
                              <Paperclip className="w-3.5 h-3.5 text-[#D4AF37]" />
                              <span>Attached File / Workbook PDF:</span>
                            </span>

                            <div className="flex items-center space-x-2">
                              <label className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-[#1F140E] font-mono text-[10px] font-bold rounded-lg border border-amber-300 cursor-pointer flex items-center space-x-1 transition-all">
                                <Upload className="w-3 h-3 text-[#B87333]" />
                                <span>Upload Attachment (PDF / Doc)</span>
                                <input
                                  type="file"
                                  accept=".pdf,.doc,.docx,.txt,image/*"
                                  className="hidden"
                                  onChange={(e) => handleGenericFileUpload(e, (dataUrl, fileName) => {
                                    setEditingCourse(prev => prev ? {
                                      ...prev,
                                      lessons: prev.lessons.map(l => l.id === lesson.id ? {
                                        ...l,
                                        attachmentUrl: dataUrl,
                                        attachmentName: fileName
                                      } : l)
                                    } : null);
                                    setAdminToast(`Attachment "${fileName}" uploaded for "${lesson.title}"!`);
                                  })}
                                />
                              </label>

                              {lesson.attachmentUrl && (
                                <button
                                  type="button"
                                  onClick={() => handleDownloadAttachment(lesson, editingCourse.title)}
                                  className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-mono text-[10px] font-bold rounded-lg border border-emerald-300 flex items-center space-x-1 cursor-pointer"
                                  title="Test download of this attachment"
                                >
                                  <Download className="w-3 h-3 text-emerald-700" />
                                  <span>Test Download</span>
                                </button>
                              )}

                              {lesson.attachmentUrl && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingCourse(prev => prev ? {
                                      ...prev,
                                      lessons: prev.lessons.map(l => l.id === lesson.id ? {
                                        ...l,
                                        attachmentUrl: undefined,
                                        attachmentName: undefined
                                      } : l)
                                    } : null);
                                  }}
                                  className="text-[10px] font-mono text-rose-600 hover:underline cursor-pointer"
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            <input
                              type="text"
                              value={lesson.attachmentName || ''}
                              onChange={(e) => {
                                const newName = e.target.value;
                                setEditingCourse(prev => prev ? {
                                  ...prev,
                                  lessons: prev.lessons.map(l => l.id === lesson.id ? { ...l, attachmentName: newName } : l)
                                } : null);
                              }}
                              placeholder="Attachment display name (e.g. Trust_Deed_Workbook.pdf)"
                              className="w-full bg-[#FAF5EE] border border-copper-penny/25 px-2.5 py-1.5 rounded-lg font-mono text-xs text-[#1F140E]"
                            />
                            <input
                              type="text"
                              value={lesson.attachmentUrl?.startsWith('data:') ? '[Uploaded File from Device]' : (lesson.attachmentUrl || '')}
                              readOnly={lesson.attachmentUrl?.startsWith('data:')}
                              onChange={(e) => {
                                const newUrl = e.target.value;
                                setEditingCourse(prev => prev ? {
                                  ...prev,
                                  lessons: prev.lessons.map(l => l.id === lesson.id ? { ...l, attachmentUrl: newUrl } : l)
                                } : null);
                              }}
                              placeholder="Attachment link URL (or use Upload button)"
                              className="w-full bg-[#FAF5EE] border border-copper-penny/25 px-2.5 py-1.5 rounded-lg font-mono text-xs text-[#1F140E]"
                            />
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>

                  {/* Add Module Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        const newLesson: CourseLesson = {
                          id: `les-${Date.now()}`,
                          title: `Module ${editingCourse.lessons.length + 1}: `,
                          type: 'video',
                          duration: '20 min',
                          completed: false,
                          videoUrl: '',
                          contentSnippet: 'Guidance and curriculum breakdown.',
                          attachmentName: 'Module_Study_Guide.pdf',
                          attachmentUrl: '#download-guide'
                        };
                        setEditingCourse(prev => prev ? {
                          ...prev,
                          lessons: [...prev.lessons, newLesson]
                        } : null);
                      }}
                      className="w-full py-3 bg-[#FAF5EE] hover:bg-[#F3ECE1] text-[#1F140E] font-mono text-xs font-bold rounded-2xl border-2 border-dashed border-[#D4AF37] cursor-pointer flex items-center justify-center space-x-2 transition-all"
                    >
                      <Plus className="w-4 h-4 text-[#B87333]" />
                      <span>➕ Add New Module &amp; Video to this Course</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-copper-penny/20">
              <span className="text-xs font-mono text-soft-sage">
                💡 All edits are saved directly into the Mothers Academy and synced with local storage.
              </span>

              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setEditingCourse(null)}
                  className="px-5 py-2.5 bg-white hover:bg-neutral-100 text-[#1F140E] font-mono text-xs font-bold rounded-xl border border-copper-penny/30 cursor-pointer"
                >
                  Discard / Close
                </button>
                <button
                  type="button"
                  onClick={handleSaveEditingCourse}
                  className="px-6 py-2.5 bg-[#1F140E] hover:bg-[#2A1D16] text-[#D4AF37] font-mono text-xs font-bold rounded-xl shadow-md cursor-pointer flex items-center space-x-1.5 transition-all active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>💾 Save &amp; Publish Masterclass</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL: QUICK ADD MODULE & VIDEO TO COURSE            */}
      {/* ==================================================== */}
      {isAddingModuleToCourse && (
        <div className="fixed inset-0 bg-black/75 z-[999999] flex items-center justify-center p-3 sm:p-4 backdrop-blur-xs overflow-y-auto">
          <form 
            onSubmit={handleSubmitAddModule}
            className="bg-[#FAF5EE] rounded-3xl max-w-xl w-full p-6 sm:p-7 border-2 border-[#D4AF37] shadow-2xl space-y-4 text-[#1F140E] max-h-[92vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-copper-penny/20 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold bg-[#1F140E] text-[#D4AF37] px-2 py-0.5 rounded-full">
                  ➕ Add Curriculum Module
                </span>
                <h4 className="font-serif font-black text-lg text-[#1F140E] mt-1">
                  {isAddingModuleToCourse.title}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsAddingModuleToCourse(null)}
                className="p-1 rounded-lg hover:bg-copper-penny/10 text-gray-500 cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-[#1F140E]">Module / Lesson Title *</label>
              <input
                type="text"
                required
                value={addModuleTitle}
                onChange={(e) => setAddModuleTitle(e.target.value)}
                placeholder="e.g. Module 3: Land Titles & Allodial Claims"
                className="w-full bg-white border border-copper-penny/25 px-3 py-2 rounded-xl text-xs font-sans text-[#1F140E] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="font-mono font-bold text-[#1F140E]">Lesson Type</label>
                <select
                  value={addModuleType}
                  onChange={(e) => setAddModuleType(e.target.value as any)}
                  className="w-full bg-white border border-copper-penny/25 px-2.5 py-2 rounded-xl font-sans text-[#1F140E] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                >
                  <option value="video">▶️ Video Lecture</option>
                  <option value="reading">📖 Reading</option>
                  <option value="worksheet">📄 Action Worksheet / PDF</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-mono font-bold text-[#1F140E]">Estimated Duration</label>
                <input
                  type="text"
                  value={addModuleDuration}
                  onChange={(e) => setAddModuleDuration(e.target.value)}
                  placeholder="e.g. 25 min"
                  className="w-full bg-white border border-copper-penny/25 px-2.5 py-2 rounded-xl font-sans text-[#1F140E] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>
            </div>

            {/* Video Link & Upload */}
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <label className="font-mono font-bold text-[#1F140E] flex items-center space-x-1">
                  <Film className="w-3.5 h-3.5 text-[#B87333]" />
                  <span>Video URL or Upload File:</span>
                </label>
                <label className="px-2 py-0.5 bg-amber-50 hover:bg-amber-100 text-[#1F140E] font-mono text-[10px] font-bold rounded-md border border-amber-300 cursor-pointer flex items-center space-x-1 shadow-2xs">
                  <Upload className="w-3 h-3 text-[#B87333]" />
                  <span>Upload Video</span>
                  <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={(e) => handleGenericFileUpload(e, (dataUrl) => {
                      setAddModuleVideoUrl(dataUrl);
                      setAdminToast('Video uploaded for module!');
                    })}
                  />
                </label>
              </div>
              <input
                type="text"
                value={addModuleVideoUrl}
                onChange={(e) => setAddModuleVideoUrl(e.target.value)}
                placeholder="Paste YouTube (e.g. youtube.com/watch?v=...) or MP4 URL"
                className="w-full bg-white border border-copper-penny/25 px-3 py-2 rounded-xl text-xs font-sans text-[#1F140E] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
              />
            </div>

            {/* Read-Along Notes */}
            <div className="space-y-1.5 text-xs">
              <label className="font-mono font-bold text-[#1F140E]">Read-Along Guidance &amp; Instructions</label>
              <textarea
                rows={2}
                value={addModuleSnippet}
                onChange={(e) => setAddModuleSnippet(e.target.value)}
                placeholder="Core steps, herbs, formulas, or legal clauses taught in this module..."
                className="w-full bg-white border border-copper-penny/25 p-2.5 rounded-xl text-xs font-sans text-[#1F140E] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
              />
            </div>

            {/* File Attachment Upload */}
            <div className="bg-white p-3 rounded-xl border border-copper-penny/20 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-[#1F140E] flex items-center space-x-1">
                  <Paperclip className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Module Attachment (PDF / Worksheet / File):</span>
                </span>
                <label className="px-2 py-0.5 bg-amber-50 hover:bg-amber-100 text-[#1F140E] font-mono text-[10px] font-bold rounded-md border border-amber-300 cursor-pointer flex items-center space-x-1 shadow-2xs">
                  <Upload className="w-3 h-3 text-[#B87333]" />
                  <span>Upload File / PDF</span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt,image/*"
                    className="hidden"
                    onChange={(e) => handleGenericFileUpload(e, (dataUrl, fileName) => {
                      setAddModuleAttachmentUrl(dataUrl);
                      setAddModuleAttachmentName(fileName);
                      setAdminToast(`Attachment "${fileName}" uploaded!`);
                    })}
                  />
                </label>
              </div>

              <input
                type="text"
                value={addModuleAttachmentName}
                onChange={(e) => setAddModuleAttachmentName(e.target.value)}
                placeholder="Attachment file name (e.g. Masterclass_Workbook.pdf)"
                className="w-full bg-[#FAF5EE] border border-copper-penny/25 px-2.5 py-1.5 rounded-lg text-xs font-mono text-[#1F140E]"
              />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-copper-penny/15">
              <button
                type="button"
                onClick={() => setIsAddingModuleToCourse(null)}
                className="px-4 py-2 bg-white text-[#1F140E] font-mono text-xs font-bold rounded-xl border border-copper-penny/30 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#1F140E] hover:bg-[#2A1D16] text-[#D4AF37] font-mono text-xs font-bold rounded-xl shadow-xs cursor-pointer flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Module to Course</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL: EDIT / ADD HER-STORY TOPIC (ADMIN IN-PLACE)   */}
      {/* ==================================================== */}
      {(editingHerStoryTopic || isAddingHerStoryTopic) && (
        <div className="fixed inset-0 bg-black/80 z-[99999] flex items-center justify-center p-3 sm:p-5 backdrop-blur-xs overflow-y-auto">
          <div className="bg-[#FAF5EE] rounded-3xl max-w-3xl w-full p-6 sm:p-8 border-2 border-[#D4AF37] shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto text-[#1F140E]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-copper-penny/20 pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-2xl bg-[#1F140E] text-[#D4AF37] border border-[#D4AF37]/50 shadow-inner">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-black text-xl text-[#1F140E]">
                    {editingHerStoryTopic ? 'Edit Her-Story Teaching & Media' : 'Add New Her-Story Masterclass'}
                  </h3>
                  <p className="text-xs font-mono text-soft-sage">
                    Manage text, artwork, and embed YouTube, TikTok, or Instagram videos directly into this section.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingHerStoryTopic(null);
                  setIsAddingHerStoryTopic(false);
                }}
                className="p-2 rounded-xl text-neutral-500 hover:text-neutral-900 hover:bg-black/5 cursor-pointer"
                title="Close"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveHerStory} className="space-y-5">
              {/* Row 1: Title & Subtitle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono font-bold text-[#1F140E]">
                    Teaching Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={herStoryFormData.title || ''}
                    onChange={(e) => setHerStoryFormData({ ...herStoryFormData, title: e.target.value })}
                    placeholder="e.g. The Matriarchal Lineage of the Lowcountry"
                    className="w-full bg-white border border-copper-penny/30 rounded-xl px-3.5 py-2 text-xs font-sans text-[#1F140E] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono font-bold text-[#1F140E]">
                    Subtitle / Focus
                  </label>
                  <input
                    type="text"
                    value={herStoryFormData.subtitle || ''}
                    onChange={(e) => setHerStoryFormData({ ...herStoryFormData, subtitle: e.target.value })}
                    placeholder="e.g. Reclaiming Ancient Clan Governance & Sovereignty"
                    className="w-full bg-white border border-copper-penny/30 rounded-xl px-3.5 py-2 text-xs font-sans text-[#1F140E] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                  />
                </div>
              </div>

              {/* Row 2: Era / Theme & Read/Watch Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono font-bold text-[#1F140E]">
                    Era or Historical Theme
                  </label>
                  <input
                    type="text"
                    value={herStoryFormData.eraOrTheme || ''}
                    onChange={(e) => setHerStoryFormData({ ...herStoryFormData, eraOrTheme: e.target.value })}
                    placeholder="e.g. Ancestral Lineage & Foundation"
                    className="w-full bg-white border border-copper-penny/30 rounded-xl px-3.5 py-2 text-xs font-sans text-[#1F140E] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono font-bold text-[#1F140E]">
                    Read / Media Time
                  </label>
                  <input
                    type="text"
                    value={herStoryFormData.readTime || ''}
                    onChange={(e) => setHerStoryFormData({ ...herStoryFormData, readTime: e.target.value })}
                    placeholder="e.g. 8 min read · Video & Essay"
                    className="w-full bg-white border border-copper-penny/30 rounded-xl px-3.5 py-2 text-xs font-sans text-[#1F140E] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                  />
                </div>
              </div>

              {/* Cover Image Section */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-copper-penny/20 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-mono font-bold text-[#1F140E]">
                    Cover Artwork / Heritage Photo <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[10px] font-mono text-soft-sage">
                    Device upload, web link, or sacred presets
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-32 h-20 rounded-xl overflow-hidden bg-neutral-900 border border-copper-penny/30 shrink-0 shadow-xs">
                    <img 
                      src={herStoryFormData.coverImage || 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80'} 
                      alt="Preview" 
                      className="w-full h-full object-cover" 
                    />
                  </div>

                  <div className="flex-1 space-y-2 w-full">
                    <input
                      type="text"
                      value={herStoryFormData.coverImage || ''}
                      onChange={(e) => setHerStoryFormData({ ...herStoryFormData, coverImage: e.target.value })}
                      placeholder="Paste image URL (https://...)"
                      className="w-full bg-[#FAF5EE] border border-copper-penny/30 rounded-xl px-3 py-1.5 text-xs font-mono text-[#1F140E] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                    />

                    <div className="flex flex-wrap items-center gap-2">
                      <label className="px-3 py-1.5 bg-[#1F140E] hover:bg-[#2A1D16] text-[#D4AF37] rounded-xl text-xs font-mono font-bold cursor-pointer flex items-center space-x-1 transition-all">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Photo From Device</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleGenericFileUpload(e, (dataUrl) => {
                            setHerStoryFormData(prev => ({ ...prev, coverImage: dataUrl }));
                          })}
                        />
                      </label>
                      <span className="text-[10px] font-mono text-soft-sage">
                        JPG, PNG, or WebP
                      </span>
                    </div>
                  </div>
                </div>

                {/* Ancestral Art Presets */}
                <div className="pt-2 border-t border-copper-penny/10 space-y-1.5">
                  <span className="text-[10px] font-mono font-bold text-soft-sage block">
                    Or Choose from Sacred Artwork Presets (1-Click Apply):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {HER_STORY_ART_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setHerStoryFormData(prev => ({ ...prev, coverImage: preset.url }))}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                          herStoryFormData.coverImage === preset.url
                            ? 'bg-[#1F140E] text-[#D4AF37] border border-[#D4AF37]'
                            : 'bg-[#FAF5EE] text-[#1F140E] hover:bg-neutral-200 border border-copper-penny/20'
                        }`}
                      >
                        <span>🎨</span>
                        <span>{preset.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Video Embedding Section (YouTube, TikTok, Instagram) */}
              <div className="bg-[#1F140E] p-5 sm:p-6 rounded-2xl border-2 border-[#D4AF37]/50 text-[#FAF5EE] space-y-4 shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Video className="w-4 h-4 text-[#D4AF37]" />
                    <span className="font-serif font-bold text-sm text-[#FAF5EE]">
                      Curated Video Embed (YouTube, TikTok, or Instagram)
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    Safe Official Embed
                  </span>
                </div>

                {/* Copyright Compliance Explanation Banner */}
                <div className="p-3 bg-emerald-950/70 border border-emerald-500/40 rounded-xl space-y-1 text-xs text-emerald-200">
                  <div className="flex items-center space-x-1.5 font-bold text-emerald-300">
                    <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span>How to share videos without copyright issues:</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-emerald-100/90 font-sans">
                    Under federal copyright law (the <em>Server Test</em>), official HTML embeds stream directly from YouTube, TikTok, or Instagram without copying files to your server. The original creator gets 100% of their views and monetization. Simply provide creator attribution below!
                  </p>
                </div>

                {/* One-Click Sample Test Buttons */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-[#D4AF37] font-bold block">
                    Quick-Fill Tested Sample Links:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {SAMPLE_EMBED_VIDEOS.map((sample, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setHerStoryFormData(prev => ({
                            ...prev,
                            videoUrl: sample.url,
                            videoAttribution: sample.attribution
                          }));
                        }}
                        className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-[#D4AF37] border border-[#D4AF37]/30 rounded-lg text-[10px] font-mono cursor-pointer transition-all"
                      >
                        <span>🎬 {sample.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono font-bold text-[#D4AF37]">
                    Video Link / URL:
                  </label>
                  <input
                    type="url"
                    value={herStoryFormData.videoUrl || ''}
                    onChange={(e) => setHerStoryFormData({ ...herStoryFormData, videoUrl: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=... or https://www.tiktok.com/@... or Instagram Reel link"
                    className="w-full bg-[#2A1D16] border border-[#D4AF37]/50 rounded-xl px-3.5 py-2 text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono font-bold text-[#D4AF37]">
                    Curator Attribution / Creator Credit:
                  </label>
                  <input
                    type="text"
                    value={herStoryFormData.videoAttribution || ''}
                    onChange={(e) => setHerStoryFormData({ ...herStoryFormData, videoAttribution: e.target.value })}
                    placeholder="e.g. Curated Ancestral Teaching via @AncestralMothers on YouTube / TikTok"
                    className="w-full bg-[#2A1D16] border border-[#D4AF37]/50 rounded-xl px-3.5 py-2 text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                  />
                  <p className="text-[10px] font-mono text-soft-sage">
                    Displayed directly on the lesson to honor and credit the original creator or channel.
                  </p>
                </div>

                {/* Live Video Preview if entered */}
                {herStoryFormData.videoUrl && (
                  <div className="pt-2 border-t border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-[#D4AF37] font-bold block">
                        Live Embed Preview:
                      </span>
                      {(() => {
                        const embedInfo = getVideoEmbedInfo(herStoryFormData.videoUrl);
                        if (embedInfo.isEmbeddable) {
                          return (
                            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30 capitalize">
                              ✓ {embedInfo.type} Player Ready
                            </span>
                          );
                        }
                        return (
                          <span className="text-[10px] font-mono text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-500/30">
                            External Link Mode
                          </span>
                        );
                      })()}
                    </div>
                    {(() => {
                      const embedInfo = getVideoEmbedInfo(herStoryFormData.videoUrl);
                      if (embedInfo.isEmbeddable) {
                        if (embedInfo.type === 'tiktok') {
                          return (
                            <div className="w-full h-80 rounded-xl overflow-hidden bg-black flex justify-center items-center">
                              <iframe src={embedInfo.embedUrl} className="w-full max-w-[280px] h-full border-0" allowFullScreen title="Preview" />
                            </div>
                          );
                        }
                        if (embedInfo.type === 'instagram') {
                          return (
                            <div className="w-full h-80 rounded-xl overflow-hidden bg-black flex justify-center items-center">
                              <iframe src={embedInfo.embedUrl} className="w-full max-w-[320px] h-full border-0" allowFullScreen title="Preview" />
                            </div>
                          );
                        }
                        return (
                          <div className="aspect-[16/9] w-full max-w-md mx-auto rounded-xl overflow-hidden bg-black">
                            <iframe src={embedInfo.embedUrl} className="w-full h-full border-0" allowFullScreen title="Preview" />
                          </div>
                        );
                      }
                      return (
                        <div className="p-3 bg-white/5 border border-amber-500/30 rounded-xl text-xs font-mono text-amber-300">
                          Video recognized as external link. Sisters will be able to launch it directly from the lesson view.
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>

              {/* Summary / Core Teaching */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-bold text-[#1F140E]">
                  Summary / Core Historical Revelation
                </label>
                <textarea
                  rows={4}
                  required
                  value={herStoryFormData.summary || ''}
                  onChange={(e) => setHerStoryFormData({ ...herStoryFormData, summary: e.target.value })}
                  placeholder="Explain the historical lesson, context of maternal power, and significance for our sisters..."
                  className="w-full bg-white border border-copper-penny/30 rounded-xl p-3 text-xs font-sans text-[#1F140E] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>

              {/* Foundational Truths (One per line) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-bold text-[#1F140E]">
                  Foundational Truths &amp; Key Takeaways (One per line)
                </label>
                <textarea
                  rows={4}
                  value={herStoryTakeawaysText}
                  onChange={(e) => setHerStoryTakeawaysText(e.target.value)}
                  placeholder="Enter bullet points, one on each line...&#10;e.g. Matrilineal inheritance passed through the mother&#10;Sacred role of the elder midwife"
                  className="w-full bg-white border border-copper-penny/30 rounded-xl p-3 text-xs font-sans text-[#1F140E] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>

              {/* Heart Reflection Prompt */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-bold text-[#1F140E]">
                  Heart Reflection Prompt (Guides Sister Discussion)
                </label>
                <input
                  type="text"
                  value={herStoryFormData.reflectionPrompt || ''}
                  onChange={(e) => setHerStoryFormData({ ...herStoryFormData, reflectionPrompt: e.target.value })}
                  placeholder="e.g. What unspoken strength did your grandmothers pass down that you honor today?"
                  className="w-full bg-white border border-copper-penny/30 rounded-xl px-3.5 py-2 text-xs font-sans text-[#1F140E] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-copper-penny/20">
                <button
                  type="button"
                  onClick={() => {
                    setEditingHerStoryTopic(null);
                    setIsAddingHerStoryTopic(false);
                  }}
                  className="px-4 py-2 bg-white text-[#1F140E] font-mono text-xs font-bold rounded-xl border border-copper-penny/30 cursor-pointer hover:bg-neutral-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#1F140E] hover:bg-[#2A1D16] text-[#D4AF37] font-mono text-xs font-bold rounded-xl shadow-md cursor-pointer flex items-center space-x-2 transition-all hover:scale-105 active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingHerStoryTopic ? 'Save Changes' : 'Publish Her-Story Teaching'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL: DELETE HER-STORY CONFIRMATION DIALOG          */}
      {/* ==================================================== */}
      {herStoryTopicToDelete && (
        <div className="fixed inset-0 bg-black/75 z-[999999] flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[#FAF5EE] rounded-3xl max-w-md w-full p-6 border-2 border-rose-400 shadow-2xl space-y-4 text-[#1F140E]">
            <div className="flex items-center space-x-3 text-rose-600">
              <AlertCircle className="w-7 h-7 shrink-0" />
              <h4 className="font-serif font-bold text-lg text-[#1F140E]">Delete Her-Story Teaching?</h4>
            </div>
            <p className="text-xs sm:text-sm font-sans text-[#1F140E]/85 leading-relaxed">
              Are you sure you want to remove <strong>"{herStoryTopicToDelete.title}"</strong> from the Her-Story sanctuary? This will permanently delete this teaching and its video attachment.
            </p>
            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-copper-penny/20">
              <button
                type="button"
                onClick={() => setHerStoryTopicToDelete(null)}
                className="px-4 py-2 bg-white text-[#1F140E] font-mono text-xs font-bold rounded-xl border border-copper-penny/30 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteHerStory}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-mono text-xs font-bold rounded-xl shadow-xs cursor-pointer flex items-center space-x-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Teaching</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* FLOATING ADMIN ACTION NOTIFICATION TOAST            */}
      {/* ==================================================== */}
      {adminToast && (
        <div className="fixed bottom-6 right-6 z-[9999999] bg-[#1F140E] text-[#D4AF37] border-2 border-[#D4AF37] px-5 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 animate-fade-in font-mono text-xs font-bold max-w-md">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="flex-1 text-white">{adminToast}</span>
          <button
            type="button"
            onClick={() => setAdminToast(null)}
            className="text-neutral-400 hover:text-white cursor-pointer ml-2"
          >
            ✕
          </button>
        </div>
      )}

    </div>
  );
}
