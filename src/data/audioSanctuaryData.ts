import { AudioTrack, VoiceNoteReflection, FiresideVoiceRoom } from '../types';

export const INITIAL_AUDIO_TRACKS: AudioTrack[] = [
  {
    id: 'track-cc-14',
    title: 'The Casual Corner Talk — Episode 14: Motherhood Real Talk: Beating Burnout, Setting Boundaries & Raising Confident Kids',
    episodeNumber: 14,
    series: 'casual-corner',
    host: 'Mama Jamila & Doula Brenda',
    hostRole: 'Grandmother Council & Master Herbalist',
    durationSeconds: 2420, // 40m 20s
    audioUrl: 'https://cdn.freesound.org/previews/568/568468_11861866-lq.mp3', // Relaxing ambient river & crackling fire sound stream
    coverImage: '/The Casual Corner Talk.jpeg',
    releaseDate: 'Sept 12, 2026',
    description: 'An unhurried, real sisterhood dialogue exploring practical ways to beat motherhood burnout in our 30s and 40s, raising children across every age stage, preparing mineral-rich nourishing family broths, and protecting our peace with healthy boundaries.',
    isFeatured: true,
    listenCount: 412,
    likesCount: 189,
    stateCode: 'GA',
    timestamps: [
      {
        timeSeconds: 0,
        label: 'Opening Community Dedication & Grounding',
        summary: 'Pouring ancestral libations and setting the room frequency in love and peace.',
        attachmentNote: 'Lighting pure beeswax candle infused with sweetgrass.'
      },
      {
        timeSeconds: 380,
        label: 'The Lost Art of 40-Day Village Seclusion',
        summary: 'Why the mother’s sole duty in the first six weeks is horizontal rest, nursing, and receiving nourishment from other women.',
        attachmentNote: 'Excerpt from Traditional Southern Midwifery Notes (1922).'
      },
      {
        timeSeconds: 940,
        label: 'Ancestral Perineal & Womb Herbal Sitz Bath Recipe',
        summary: 'Exact ratio of comfrey root, shepherd’s purse, calendula flowers, and pink mineral salts for tissue repair.',
        remedyAnchor: 'Womb Repair Herbal Sitz Bath'
      },
      {
        timeSeconds: 1560,
        label: 'Deep Nutrition: The Red Nettle & Roasted Bone Broth Formula',
        summary: 'Simmering grass-fed knuckles with dried stinging nettle, burdock, and black peppercorns for 36 hours.',
        remedyAnchor: 'Iron-Rich Nettle & Marrow Broth'
      },
      {
        timeSeconds: 2100,
        label: 'Audience Sister Q&A & Closing Community Reflection',
        summary: 'Sister Nia from Texas asks how to coordinate an offline meal train when family lives out of state.',
        attachmentNote: 'Download the Copper Mommies 1-Click Meal Train PDF template.'
      }
    ],
    referencedRemedies: [
      {
        name: 'Womb Repair Herbal Sitz Bath',
        purpose: 'Soothes perineal swelling, accelerates tissue knitting, and prevents infection postpartum.',
        ingredients: ['1/2 cup Organic Comfrey Leaf', '1/2 cup Calendula Petals', '1/4 cup Shepherd’s Purse', '1/4 cup Yarrow Flowers', '1 cup Ancient Sea Salt'],
        instructions: 'Steep herbs in 2 quarts boiling spring water for 30 minutes. Strain deeply, mix with sea salt, and pour into warm shallow bath.',
        category: 'Postpartum Botanical Care',
        associatedHub: 'healing'
      },
      {
        name: 'Iron-Rich Nettle & Marrow Broth',
        purpose: 'Replenishes lost maternal blood volume, minerals, and deep collagen.',
        ingredients: ['2 lbs Pastured Beef Marrow Bones', '1 cup Dried Stinging Nettle Leaf', '2 tbsp Raw Apple Cider Vinegar', '1 whole Bulb Garlic', '1 inch Fresh Ginger Root'],
        instructions: 'Slow simmer bones in filtered water with vinegar for 24-36 hours. Add dried nettle in the final 2 hours. Strain and drink 2 warm mugs daily.',
        category: 'Maternal Nutrition',
        associatedHub: 'healing'
      }
    ],
    referencedNotes: [
      'Book: "Listen to the Grandmother: Traditional Black Midwifery in the Rural South"',
      'Rule of Womb Rest: 5 days in the bed, 5 days around the bed, 5 days near the bed.'
    ]
  },
  {
    id: 'track-cc-13',
    title: 'The Casual Corner Talk — Episode 13: Private Land Trusts & Cooperative Sister Homesteads',
    episodeNumber: 13,
    series: 'casual-corner',
    host: 'Mother Bessie & Attorney Valerie',
    hostRole: 'Elder Land Trustee & Tribal Jurisprudence',
    durationSeconds: 3120, // 52m
    audioUrl: 'https://cdn.freesound.org/previews/623/623405_11861866-lq.mp3',
    coverImage: '/Copper mommies family on the beach.png',
    releaseDate: 'Sept 5, 2026',
    description: 'How five sovereign sisters in Georgia pooled resources to purchase 22 acres of agricultural timberland under a 508(c)(1)(a) PMA private trust, shielding the soil from partition sales.',
    listenCount: 620,
    likesCount: 274,
    stateCode: 'SC',
    timestamps: [
      {
        timeSeconds: 0,
        label: 'Introduction to Allodial Land Heritage',
        summary: 'Understanding why heirs property law stripped 14 million acres of Black farmland and how to bulletproof title.'
      },
      {
        timeSeconds: 840,
        label: 'Structure of the 5-Sister Multi-Family Trust',
        summary: 'Assigning equitable beneficiary shares without granting single-party sale authority.'
      },
      {
        timeSeconds: 1820,
        label: 'Well Water, Solar Arrays & Sovereign Food Forests',
        summary: 'Setting up gravity-fed rainwater harvesting and heritage muscadine vines.'
      }
    ]
  },
  {
    id: 'track-ap-01',
    title: 'Apothecary Snippet: Elderberry, Mullein & Wild Cherry Cough Elixir',
    series: 'apothecary-snippets',
    host: 'Master Herbalist Althea',
    hostRole: 'Apothecary Curator (Virginia)',
    durationSeconds: 295, // ~4m 55s
    audioUrl: 'https://cdn.freesound.org/previews/464/464879_9961300-lq.mp3',
    coverImage: '/The Casual Corner Talk.jpeg',
    releaseDate: 'Sept 10, 2026',
    description: 'A swift 5-minute practical formulation guide for crafting respiratory relief syrup with raw sourwood honey and organic mullein leaf for children’s winter colds.',
    listenCount: 890,
    likesCount: 341,
    timestamps: [
      {
        timeSeconds: 0,
        label: 'Herb Sourcing & Wild Harvest Safety',
        summary: 'Distinguishing wild black cherry bark from chokecherry and preparing dried mullein.'
      },
      {
        timeSeconds: 140,
        label: 'Decoction vs Infusion Ratios',
        summary: 'Simmering roots and berries gently without boiling off delicate volatile oils.'
      },
      {
        timeSeconds: 230,
        label: 'Honey Preservation Temperature Rule',
        summary: 'Never add raw honey above 110°F to preserve antimicrobial enzymes.'
      }
    ],
    referencedRemedies: [
      {
        name: 'Mullein & Wild Cherry Respiratory Syrup',
        purpose: 'Eases bronchial spasms, clears sticky mucus, and soothes raw throat irritation in children and adults.',
        ingredients: ['1 cup Dried Black Elderberries', '1/2 cup Dried Mullein Leaf', '1/4 cup Wild Black Cherry Bark', '3 cups Spring Water', '1.5 cups Raw Wildflower Honey'],
        instructions: 'Simmer herbs in water until reduced by half (~45 min). Strain completely through unbleached cheesecloth. Cool to warm, stir in raw honey, bottle in amber glass.',
        category: 'Respiratory Botanical',
        associatedHub: 'healing'
      }
    ]
  },
  {
    id: 'track-ap-02',
    title: 'Apothecary Snippet: Castor Oil Packs for Lymphatic Flow & Liver Balance',
    series: 'apothecary-snippets',
    host: 'Sister Maya',
    hostRole: 'Doula & Holistic Bodyworker',
    durationSeconds: 240, // 4m
    audioUrl: 'https://cdn.freesound.org/previews/568/568468_11861866-lq.mp3',
    coverImage: '/Copper mommies family on the beach.png',
    releaseDate: 'Sept 8, 2026',
    description: 'Step-by-step masterclass on applying organic hexane-free cold-pressed castor oil over the right upper abdomen with unbleached organic wool flannel.',
    listenCount: 520,
    likesCount: 215,
    timestamps: [
      {
        timeSeconds: 0,
        label: 'The Science of Ricinoleic Acid',
        summary: 'How transdermal castor oil stimulates Peyer’s patches and deep lymphatic clearance.'
      },
      {
        timeSeconds: 120,
        label: 'Flannel Prep & Heating Technique',
        summary: 'Applying warm glass bottle or hot water bag for 45 minutes of quiet rest.'
      }
    ]
  },
  {
    id: 'track-hs-01',
    title: 'Homeschool Reflections: Raising Free & Critical Thinkers (Grades K-6)',
    series: 'homeschool',
    host: 'Mama Clara & Sister Jamila',
    hostRole: 'Homeschool Guild Spearheads',
    durationSeconds: 1680, // 28m
    audioUrl: 'https://cdn.freesound.org/previews/623/623405_11861866-lq.mp3',
    coverImage: '/The Casual Corner Talk.jpeg',
    releaseDate: 'Sept 1, 2026',
    description: 'Breaking free from rigid desk-bound curricula. How to turn morning garden chores, family carpentry, and reading primary historical journals into an accredited standard-exceeding education.',
    listenCount: 740,
    likesCount: 380,
    timestamps: [
      {
        timeSeconds: 0,
        label: 'Deschooling the Mother’s Mindset',
        summary: 'Unlearning the anxiety of standard testing and rediscovering natural curiosity.'
      },
      {
        timeSeconds: 620,
        label: 'Math in the Soil & Micro-Economy',
        summary: 'Teaching fractions, seed spacing ratios, and profit-and-loss ledgers through the children’s garden stand.'
      },
      {
        timeSeconds: 1240,
        label: 'NestBright Integrated Curriculum Walkthrough',
        summary: 'Using 4th Grade frameless visual manipulatives and daily 10-slide mastery blocks.'
      }
    ],
    referencedNotes: [
      'Resource: NestBright Academy Grade 4 Math & Science Curriculum',
      'Curriculum: Core Knowledge Sequence for Elementary Natural History'
    ]
  },
  {
    id: 'track-anc-01',
    title: 'Ancestral Storytelling: The Indigo Makers of Sea Islands & Gullah Roots',
    series: 'ancestral',
    host: 'Mother Bessie',
    hostRole: 'Grandmother Council Elder',
    durationSeconds: 1980, // 33m
    audioUrl: 'https://cdn.freesound.org/previews/568/568468_11861866-lq.mp3',
    coverImage: '/Copper mommies family on the beach.png',
    releaseDate: 'August 28, 2026',
    description: 'Oral storytelling on the secret botanical knowledge of indigo fermentation, basket weaving with sweetgrass, and the resilient maternal wisdom that kept our families sovereign for centuries.',
    listenCount: 910,
    likesCount: 512,
    timestamps: [
      {
        timeSeconds: 0,
        label: 'The Smell of Fermenting Indigo Vats',
        summary: 'Remembering grandmother’s hands stained deep blue with natural alkaline leaf washes.'
      },
      {
        timeSeconds: 710,
        label: 'The Coil Basket as a Measurement Tool',
        summary: 'How fanner baskets measured rice grains, separated chaff, and held newborn infants.'
      },
      {
        timeSeconds: 1420,
        label: 'Honoring the Young Mothers of Tomorrow',
        summary: 'Grandmother Bessie’s spoken ancestral benediction for every mother listening.'
      }
    ]
  },
  {
    id: 'track-radio-live',
    title: 'Copper Sanctuary 24/7 Live Stream: Casual Corner Community Radio & Ambient Healing Loops',
    series: 'live-radio',
    host: 'Sovereign Copper Radio Broadcast',
    hostRole: 'Continuous 432Hz Ambient Soundscape Stream',
    durationSeconds: 86400, // 24 hours
    audioUrl: 'https://cdn.freesound.org/previews/568/568468_11861866-lq.mp3',
    coverImage: '/The Casual Corner Talk.jpeg',
    releaseDate: 'Live Continuous',
    description: 'Immersive soundscape blending 432Hz singing bowls, gentle pine fire crackles, and curated archive speeches from our elder matriarchs.',
    listenCount: 1420,
    likesCount: 689,
    timestamps: [
      {
        timeSeconds: 0,
        label: 'Live Broadcast Stream Active',
        summary: 'Streaming ancestral ambient resonance and weekly live recordings.'
      }
    ]
  }
];

export const INITIAL_VOICE_NOTES: VoiceNoteReflection[] = [
  {
    id: 'vn-01',
    sisterName: 'Sister Maya',
    sisterRole: 'GA Sanctuary Spearhead',
    stateCode: 'GA',
    title: '🌿 Quick tip on drying fresh mullein leaves without mold',
    durationSeconds: 42,
    category: 'Remedy Tip',
    audioFrequency: 432,
    recordedAt: '2 hours ago',
    likes: 24,
    transcription: 'Peace sisters! When hanging your freshly foraged mullein, remember to strip the lower stem and hang them upside down in brown paper bags with holes poked in. This keeps dust off and stops moisture lock!'
  },
  {
    id: 'vn-02',
    sisterName: 'Mother Clara',
    sisterRole: 'Homeschool Guild Curator',
    stateCode: 'AL',
    title: '✨ 4th Grade fraction breakthrough with garden squash!',
    durationSeconds: 56,
    category: 'Homeschool Insight',
    audioFrequency: 528,
    recordedAt: '5 hours ago',
    likes: 38,
    transcription: 'My 9-year-old was struggling with equivalent fractions until we brought out two yellow crookneck squashes from the garden. We sliced one into halves and the other into fourths — she understood instantly in 10 minutes!'
  },
  {
    id: 'vn-03',
    sisterName: 'Sister Keisha',
    sisterRole: 'Maryland Sister Circle',
    stateCode: 'MD',
    title: '💖 Postpartum gratitude to the Baltimore meal train',
    durationSeconds: 48,
    category: 'Testimony',
    audioFrequency: 639,
    recordedAt: 'Yesterday',
    likes: 45,
    transcription: 'I just wanted to leave a voice note thanking Sister Anaya and Sister Brenda for bringing over hot ox-tail broth and fresh sourdough bread while I rested with baby girl. This village is real and living.'
  },
  {
    id: 'vn-04',
    sisterName: 'Sister Nia',
    sisterRole: 'Texas Sanctuary Circle',
    stateCode: 'TX',
    title: '🌾 Question for the herbalists on comfrey root tincture',
    durationSeconds: 35,
    category: 'Village Inquiry',
    audioFrequency: 396,
    recordedAt: 'Yesterday',
    likes: 19,
    transcription: 'Quick question for Mother Bessie or Doula Brenda: when infusing comfrey root into olive oil for salve, is it safe to use slow heat or strictly cold 6-week solar maceration? Sending love!'
  }
];

export const INITIAL_FIRESIDE_ROOM: FiresideVoiceRoom = {
  id: 'fireside-room-live',
  title: '🔥 Live Fireside Audio Lounge: Casual Corner Community Talk',
  topic: 'Real Motherhood Across Every Stage: Setting Boundaries, Healing Burnout & Protecting Family Peace',
  category: 'Motherhood Realities & Village Wellness',
  isLive: true,
  hostSister: 'Mama Jamila (GA Spearhead)',
  hostRole: 'Grandmother Council Lead',
  roomType: 'Casual Corner Audio Stage',
  startedAt: '35 minutes ago',
  speakers: [
    {
      id: 'spk-1',
      name: 'Mama Jamila',
      role: 'Grandmother Council Lead (GA)',
      stateCode: 'GA',
      isMuted: false,
      isSpeaking: true
    },
    {
      id: 'spk-2',
      name: 'Doula Brenda',
      role: 'Master Herbalist & Midwife (CA)',
      stateCode: 'CA',
      isMuted: true,
      isSpeaking: false
    },
    {
      id: 'spk-3',
      name: 'Mother Bessie',
      role: 'Elder Trustee (SC)',
      stateCode: 'SC',
      isMuted: true,
      isSpeaking: false
    }
  ],
  listeners: [
    {
      id: 'lis-1',
      name: 'Sister Keisha',
      role: 'Sanctuary Sister (MD)',
      stateCode: 'MD',
      isMuted: true,
      isSpeaking: false
    },
    {
      id: 'lis-2',
      name: 'Sister Nia',
      role: 'Sanctuary Sister (TX)',
      stateCode: 'TX',
      isMuted: true,
      isSpeaking: false,
      isHandRaised: true
    },
    {
      id: 'lis-3',
      name: 'Mother Clara',
      role: 'Homeschool Mother (AL)',
      stateCode: 'AL',
      isMuted: true,
      isSpeaking: false
    },
    {
      id: 'lis-4',
      name: 'Sister Althea',
      role: 'Apothecary Keeper (VA)',
      stateCode: 'VA',
      isMuted: true,
      isSpeaking: false
    }
  ],
  handRaisedSisters: ['lis-2'],
  activeSpeakerId: 'spk-1'
};
