export interface HashtagCategory {
  tag: string;
  label: string;
  description: string;
  category: 'Academy' | 'Care Pillar' | 'Regional Market' | 'Heritage Circle';
  linkTab: 'academy' | 'commons' | 'economy' | 'gathering' | 'healing' | 'kinship' | 'village';
  linkedResource: string;
  targetItemId?: string;
  targetSubTab?: string;
}

export const POPULAR_HASHTAGS: HashtagCategory[] = [
  {
    tag: '#SeedPreservation',
    label: 'Seed Preservation & Grain Vaults',
    description: 'Heirloom seed saving, crop isolation, and community seed vault swaps',
    category: 'Academy',
    linkTab: 'academy',
    linkedResource: '🎓 Academy Course: Heirloom Gardening & Seed Preservation',
    targetItemId: 'tr-3'
  },
  {
    tag: '#FamilyWealth',
    label: 'Family Wealth & Land Trusts',
    description: 'Private family land trusts, heir property protection, and generational wealth',
    category: 'Academy',
    linkTab: 'academy',
    linkedResource: '🎓 Academy Course: Family Wealth, Private Trusts & Land Protection',
    targetItemId: 'tr-1'
  },
  {
    tag: '#Apothecary101',
    label: 'Master Folk Apothecary',
    description: 'Botanical teas, herbal oxymels, tinctures, and traditional mineral broths',
    category: 'Academy',
    linkTab: 'healing',
    linkedResource: '🌿 Apothecary Sanctum: Master Folk Botanicals',
    targetItemId: 'tr-2'
  },
  {
    tag: '#HeirloomGardening',
    label: 'Heirloom Gardening',
    description: 'Organic soil restoration, raised beds, and seed multiplication',
    category: 'Academy',
    linkTab: 'academy',
    linkedResource: '🎓 Academy Course: Heirloom Gardening & Food Security',
    targetItemId: 'tr-3'
  },
  {
    tag: '#CurriculumSwap',
    label: 'Homeschool Curriculum Swap',
    description: 'NestBright curriculum, books, manipulatives, and study material trades',
    category: 'Regional Market',
    linkTab: 'economy',
    linkedResource: '🤝 Marketplace: Homeschool Books & Curriculum Swap',
    targetSubTab: 'exchange'
  },
  {
    tag: '#ChildcareSwap',
    label: 'Co-op Childcare Swap',
    description: 'Rotational sister childcare, playdates, and mother respite swaps',
    category: 'Regional Market',
    linkTab: 'economy',
    linkedResource: '🤝 Marketplace: Co-Op Childcare Swap & Mother Respite',
    targetSubTab: 'exchange'
  },
  {
    tag: '#FamilyHealth',
    label: 'Family Health & Vitality',
    description: 'Whole-food nutrition, postpartum care, and natural family wellness',
    category: 'Care Pillar',
    linkTab: 'commons',
    linkedResource: '💬 Village Commons: Family Health Care Pillar',
    targetSubTab: 'feed'
  },
  {
    tag: '#Homesteading',
    label: 'Sovereign Homesteading',
    description: 'Off-grid water capture, chicken coops, and food preservation',
    category: 'Care Pillar',
    linkTab: 'commons',
    linkedResource: '💬 Village Commons: Homestead & Seeds Pillar',
    targetSubTab: 'feed'
  },
  {
    tag: '#RestAndBurnout',
    label: 'Rest & Burnout Recovery',
    description: 'Postpartum lying-in, emotional sanctuary, and sacred sister rest',
    category: 'Care Pillar',
    linkTab: 'healing',
    linkedResource: '🌿 Healing Sanctum: Postpartum Lying-In & Sacred Rest'
  },
  {
    tag: '#GADistrict5',
    label: 'Georgia District 5',
    description: 'Local Atlanta, Decatur & East Point regional village updates',
    category: 'Regional Market',
    linkTab: 'commons',
    linkedResource: '🏛️ Regional Hub: Georgia District 5 Village Board',
    targetSubTab: 'feed'
  },
  {
    tag: '#AtlantaMoms',
    label: 'Atlanta Sisters Circle',
    description: 'Local gatherings, seed swaps, and emergency sister network',
    category: 'Regional Market',
    linkTab: 'commons',
    linkedResource: '🏛️ Regional Hub: Atlanta Metro Sisters Network',
    targetSubTab: 'feed'
  },
  {
    tag: '#ThreeSistersGuild',
    label: 'Three Sisters Guild',
    description: 'American Indian ancestral agriculture, corn, beans & squash heritage',
    category: 'Heritage Circle',
    linkTab: 'gathering',
    linkedResource: '🕊️ Copper Circle: The Three Sisters Guild (Ancestral Agriculture)'
  },
  {
    tag: '#AncestralKnowledge',
    label: 'Ancestral Knowledge',
    description: 'Traditional midwifery, herbal medicine, and folk heritage crafts',
    category: 'Heritage Circle',
    linkTab: 'kinship',
    linkedResource: '📜 Kinship Vault: Ancestral Knowledge & Lineage Archives'
  },
  {
    tag: '#MaturationalSelfReliance',
    label: 'Maturational Self-Reliance',
    description: 'Self-sufficient home economies, food security, and trade mastery',
    category: 'Heritage Circle',
    linkTab: 'academy',
    linkedResource: '🎓 Academy Track: Maturational Self-Reliance & Sovereign Homesteads'
  }
];

export function getHashtagDestination(tag: string): HashtagCategory | undefined {
  const normalized = tag.toLowerCase().replace(/^#/, '');
  return POPULAR_HASHTAGS.find(h => h.tag.toLowerCase().replace(/^#/, '') === normalized);
}

export interface SearchResultItem {
  id: string;
  title: string;
  snippet: string;
  typeLabel: string;
  typeCategory: 'course' | 'forum_post' | 'barter_trade' | 'housing' | 'sister_business';
  locationOrCategory: string;
  authorOrOwner: string;
  imageUrl?: string;
  linkTab: 'academy' | 'commons' | 'economy' | 'gathering' | 'commerce' | 'healing' | 'village';
  subTab?: string;
  itemId?: string;
}

export const SAMPLE_ACADEMY_COURSES: SearchResultItem[] = [
  {
    id: 'tr-1',
    title: 'Family Wealth, Private Trusts & Land Protection',
    snippet: 'Learn how to form private land trusts, protect family property from tax sales, and secure ancestral land across generations.',
    typeLabel: '🎓 Academy Masterclass',
    typeCategory: 'course',
    locationOrCategory: 'Family Sovereignty Track',
    authorOrOwner: 'Mama Danielle & Sister Attorney Kendra',
    imageUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80',
    linkTab: 'academy',
    itemId: 'tr-1'
  },
  {
    id: 'tr-2',
    title: 'Master Folk Apothecary & Home Botanical Compounding',
    snippet: 'Comprehensive guide to wildcrafting herbs, oxymels, mineral infusions, nettle teas, and herbal medicine making.',
    typeLabel: '🎓 Academy Track',
    typeCategory: 'course',
    locationOrCategory: 'Botanical Healing Track',
    authorOrOwner: 'Mama Corinne',
    imageUrl: '/apothecary_sister_herbal.jpg',
    linkTab: 'healing',
    itemId: 'tr-2'
  },
  {
    id: 'tr-3',
    title: 'Heirloom Gardening, Seed Preservation & Grain Vaults',
    snippet: 'Master seed isolation, threshing heirloom corn and beans, and saving non-GMO heirloom seeds for community seed banks.',
    typeLabel: '🎓 Academy Track',
    typeCategory: 'course',
    locationOrCategory: 'Homesteading & Food Security',
    authorOrOwner: 'Mama Danielle',
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d69106093?auto=format&fit=crop&w=800&q=80',
    linkTab: 'academy',
    itemId: 'tr-3'
  },
  {
    id: 'tr-4',
    title: 'NestBright Co-Op Homeschooling & Multi-Age Learning',
    snippet: 'How to structure a cooperative homeschooling circle with shared curriculum swaps, nature labs, and group playdates.',
    typeLabel: '🎓 Academy Guide',
    typeCategory: 'course',
    locationOrCategory: 'Homeschool & Education',
    authorOrOwner: 'Sister Corinne',
    imageUrl: '/src/assets/images/sister_corinne_botany_teacher_1792314695063.jpg',
    linkTab: 'academy',
    itemId: 'tr-4'
  },
  {
    id: 'tr-5',
    title: 'Ancestral Midwifery, Postpartum Lying-In & Maternal Sanctuary',
    snippet: 'Traditional physiological birth wisdom, 40-day lying-in protocols, belly binding, and mother-centered healing.',
    typeLabel: '🎓 Academy Guild',
    typeCategory: 'course',
    locationOrCategory: 'Heritage Circles',
    authorOrOwner: 'Mama Keisha & Doula Circle',
    imageUrl: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=800&q=80',
    linkTab: 'academy',
    itemId: 'tr-5'
  }
];
