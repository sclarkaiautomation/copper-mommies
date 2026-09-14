import { 
  BarterComment, 
  SafeMeetupSpot, 
  ActiveTradeRecord, 
  SisterMicroStore, 
  WisdomBadge, 
  UrgentCareAlert, 
  ConsultationBooking 
} from '../types';

export const INITIAL_BARTER_COMMENTS: BarterComment[] = [
  {
    id: 'bc-1',
    barterId: '1',
    authorName: 'Sister Jamila',
    authorLocation: 'Atlanta, GA',
    text: 'Peace sister! Is this shea butter whipped with lavender or raw unrefined fragrance-free?',
    createdAt: '2 hours ago',
    isQuickInquiry: false
  },
  {
    id: 'bc-2',
    barterId: '1',
    authorName: 'Mama Shantrece',
    authorLocation: 'Decatur, GA',
    text: 'Raw organic shea infused gently with homegrown lavender buds and cold-pressed jojoba oil. Very gentle for little ones!',
    createdAt: '1 hour ago',
    parentCommentId: 'bc-1',
    isQuickInquiry: false
  },
  {
    id: 'bc-3',
    barterId: '2',
    authorName: 'Sister Nia',
    authorLocation: 'Stone Mountain, GA',
    text: '🕊️ Sister, is this still available for swap this week?',
    createdAt: '3 hours ago',
    isQuickInquiry: true
  },
  {
    id: 'bc-4',
    barterId: '3',
    authorName: 'Auntie Brenda',
    authorLocation: 'Southwest Atlanta, GA',
    text: '🌱 I have heirloom Georgia collard seeds and dried elderberry to trade for this!',
    createdAt: 'Yesterday',
    isQuickInquiry: true
  }
];

export const SAFE_MEETUP_SPOTS: Record<string, SafeMeetupSpot[]> = {
  GA: [
    {
      id: 'spot-ga-1',
      name: 'Truly Living Well Center for Natural Urban Ag',
      type: 'Community Garden',
      address: '324 Lawton St SW',
      cityState: 'Atlanta, GA 30310',
      verifiedByElders: true,
      notes: 'Safe open daylight pavilion, free parking, surrounded by heirloom garden beds.'
    },
    {
      id: 'spot-ga-2',
      name: 'Southwest Regional Library (Cascade Road)',
      type: 'Public Library',
      address: '3665 Cascade Rd SW',
      cityState: 'Atlanta, GA 30331',
      verifiedByElders: true,
      notes: 'Well-lit foyer with security, comfortable children seating area, and porch benches.'
    },
    {
      id: 'spot-ga-3',
      name: 'Wade Walker Park Homeschool Pavilion',
      type: 'Homeschool Co-op Center',
      address: '5584 Rockbridge Rd SW',
      cityState: 'Stone Mountain, GA 30088',
      verifiedByElders: true,
      notes: 'Designated outdoor meeting spot for Georgia homeschool cohort swaps and seed circles.'
    }
  ],
  TX: [
    {
      id: 'spot-tx-1',
      name: 'Black Heritage Garden & Co-op Exchange',
      type: 'Community Garden',
      address: '4910 Southmore Blvd',
      cityState: 'Houston, TX 77004',
      verifiedByElders: true,
      notes: 'Community shaded arbor with water access and friendly neighborhood stewards.'
    },
    {
      id: 'spot-tx-2',
      name: 'Oak Forest Neighborhood Library Foyer',
      type: 'Public Library',
      address: '1349 W 43rd St',
      cityState: 'Houston, TX 77018',
      verifiedByElders: true,
      notes: 'Monitored front lobby area with plenty of table space for inspecting trades.'
    }
  ]
};

export const INITIAL_ACTIVE_TRADES: ActiveTradeRecord[] = [
  {
    id: 'trade-101',
    barterId: 'b-1',
    listingTitle: 'Whipped Shea Butter with Cold-Pressed Jojoba',
    listingCategory: 'Clean Beauty',
    role: 'giver',
    partnerName: 'Sister Jamila',
    partnerContact: 'jamila@coop.net',
    status: 'Pending Negotiation',
    offeredItemOrService: '2x 8oz Whipped Lavender Shea Butter',
    requestedItemOrService: '1x Quart Raw Wildflower Honey',
    pointsValue: 5,
    initiatedAt: 'Today at 10:15 AM',
    meetupLocation: 'Truly Living Well Center for Natural Urban Ag, Atlanta',
    scheduledDate: 'Tomorrow, 3:00 PM',
    giverHandshakeSigned: false,
    recipientHandshakeSigned: false
  },
  {
    id: 'trade-102',
    barterId: 'b-2',
    listingTitle: 'Heirloom Purple Hull Pea Seeds & Starter Pots',
    listingCategory: 'Garden Bounty',
    role: 'recipient',
    partnerName: 'Auntie Brenda',
    partnerContact: 'brenda@coop.net',
    status: 'Awaiting Safe Handshake',
    offeredItemOrService: '2 Hours Homeschool Math Tutoring Worksheet Set',
    requestedItemOrService: '50 Heirloom Seed Pods + 4 Coconut Coir Starter Pots',
    pointsValue: 4,
    initiatedAt: 'Yesterday',
    meetupLocation: 'Southwest Regional Library Foyer, Atlanta',
    scheduledDate: 'Saturday, 11:30 AM',
    giverHandshakeSigned: true,
    recipientHandshakeSigned: false
  },
  {
    id: 'trade-103',
    barterId: 'b-3',
    listingTitle: 'Organic Sourdough Starter & Fresh Hearth Loaf',
    listingCategory: 'Daily Life/Pantry',
    role: 'trader',
    partnerName: 'Sister Nicole',
    partnerContact: 'nicole@coop.net',
    status: 'Completed Exchange',
    offeredItemOrService: '1 Quart Fresh Dried Chamomile & Hibiscus Blend',
    requestedItemOrService: '1 Mature Sourdough Jar + 1 Warm Artisan Loaf',
    pointsValue: 6,
    initiatedAt: 'July 10, 2026',
    completedAt: 'July 12, 2026',
    meetupLocation: 'Wade Walker Park Pavilion #2, Stone Mountain',
    giverHandshakeSigned: true,
    recipientHandshakeSigned: true,
    digitalReceiptHash: '0xCOPPER_98F3_HANDSHAKE_VERIFIED'
  }
];

export const INITIAL_SISTER_PROFILES: SisterMicroStore[] = [
  {
    id: 'sis-1',
    sisterName: 'Mama Shantrece',
    sisterHandle: '@shantrece_hearth',
    birthYear: 1988,
    location: 'Decatur, GA',
    stateCode: 'GA',
    bio: 'Homeschooling mother of 3, traditional apothecary crafter, and sovereign hearth keeper. Deeply rooted in Georgia soil and ancestral nourishment.',
    wisdomTier: 'Homestead Pillar',
    trustScore: 98,
    barterCount: 24,
    avatarEmoji: '👑',
    bannerTone: 'from-[#B87333]/20 via-[#FAF5EE] to-[#D4AF37]/15',
    activeListingsCount: 4,
    herbalCatalog: [
      { id: 'hc-1', name: 'Lavender Whipped Tallow & Shea', category: 'Clean Beauty', pointsOrBarter: '5 pts or Raw Honey', description: 'Small-batch whipped sovereign balm for glowing skin.' },
      { id: 'hc-2', name: 'Elderberry-Hibiscus Vitality Tonic', category: 'Holistic Wellness', pointsOrBarter: '4 pts or Heirloom Seeds', description: 'Sun-steeped immune syrup with raw ginger and cloves.' }
    ],
    digitalPrintables: [
      { id: 'dp-1', title: 'Grade 3-5 Ancestral Math & Quilt Geometry Guide', fileType: 'PDF', description: 'Hands-on homeschool unit study with 20 printable worksheets.' },
      { id: 'dp-2', title: 'Sovereign Homestead Pantry Storage Checklist', fileType: 'PDF', description: 'Year-long dry storage and fermentation rotation system.' }
    ],
    businessContactLinks: [
      { label: 'Hearth Herbal Orders', url: 'https://coppermommies.co', type: 'Website' },
      { label: 'Schedule 30-min Homeschool Consult', url: '#consult', type: 'Consultation' },
      { label: 'Direct Village Inquiries', url: 'mailto:shantrece@coop.net', type: 'Email' }
    ]
  },
  {
    id: 'sis-2',
    sisterName: 'Auntie Brenda',
    sisterHandle: '@auntie_brenda_roots',
    birthYear: 1972,
    location: 'Atlanta, GA',
    stateCode: 'GA',
    bio: 'Elder matriarch, herbalist, and master seed saver for 30+ years. Mother of 4 and grandmother to 6. Guardian of traditional poultices and sourdough fermentation.',
    wisdomTier: 'Elder Wisdom Keeper',
    trustScore: 100,
    barterCount: 68,
    avatarEmoji: '🌿',
    bannerTone: 'from-emerald-900/15 via-[#FAF5EE] to-amber-800/10',
    activeListingsCount: 6,
    herbalCatalog: [
      { id: 'hc-3', name: 'Ancestral Georgia Root Poultice', category: 'Holistic Wellness', pointsOrBarter: '6 pts or Wool Skeins', description: 'Comfrey, mullein, and castor oil pack for deep joint ease.' },
      { id: 'hc-4', name: 'Heirloom Georgia Collard Seeds (1985 Strain)', category: 'Garden Bounty', pointsOrBarter: '3 pts or Garden Swap', description: 'Frost-resistant, sweet broadleaf heirloom seeds.' }
    ],
    digitalPrintables: [
      { id: 'dp-3', title: 'Oral Herbal Lore: 12 Herbs Every Mother Should Grow', fileType: 'Audio', description: '45-minute audio storytelling and brewing masterclass.' }
    ],
    businessContactLinks: [
      { label: 'Porch Tea Consultations', url: '#consult', type: 'Consultation' },
      { label: 'Brenda Roots Archive', url: 'mailto:brenda@coop.net', type: 'Email' }
    ]
  },
  {
    id: 'sis-3',
    sisterName: 'Sister Jamila',
    sisterHandle: '@jamila_care',
    birthYear: 1991,
    location: 'Stone Mountain, GA',
    stateCode: 'GA',
    bio: 'Postpartum doula, certified lactation counselor, and homeschooling mother of 2. Dedicated to gentle birth care, warm womb teas, and reciprocal village support.',
    wisdomTier: 'Sprouting Sister',
    trustScore: 94,
    barterCount: 15,
    avatarEmoji: '🌸',
    bannerTone: 'from-pink-900/10 via-[#FAF5EE] to-rose-700/10',
    activeListingsCount: 3,
    herbalCatalog: [
      { id: 'hc-5', name: 'Postpartum Womb Warmth Herbal Sitz Soak', category: 'Holistic Wellness', pointsOrBarter: '4 pts or Sourdough Loaf', description: 'Calendula, raspberry leaf, shepherd’s purse & Epsom crystals.' }
    ],
    digitalPrintables: [
      { id: 'dp-4', title: 'The Golden 40-Day Postpartum Sanctuary Guide', fileType: 'PDF', description: 'Meal plans, resting schedules, and family visitor protocols.' }
    ],
    businessContactLinks: [
      { label: 'Book 30-min Doula Check-In', url: '#consult', type: 'Consultation' },
      { label: 'Direct Sister Message', url: 'mailto:jamila@coop.net', type: 'Email' }
    ]
  }
];

export const INITIAL_WISDOM_BADGES: WisdomBadge[] = [
  {
    id: 'wb-1',
    title: 'Village Seed Planter',
    icon: '🌱',
    tier: 'Sprouting Sister',
    description: 'Complete Vetting Covenant and publish first trade or gift offer on the Board.',
    unlocked: true,
    unlockedAt: 'August 2026',
    progressPercent: 100
  },
  {
    id: 'wb-2',
    title: 'Reciprocal Giver',
    icon: '🤝',
    tier: 'Sprouting Sister',
    description: 'Complete 3 dual-confirmed co-op handshakes with sister mommies.',
    unlocked: true,
    unlockedAt: 'September 2026',
    progressPercent: 100
  },
  {
    id: 'wb-3',
    title: 'Homestead Pillar',
    icon: '🏡',
    tier: 'Homestead Pillar',
    description: 'Accumulate 10+ confirmed mutual aid exchanges and volunteer 5+ hours of co-care.',
    unlocked: true,
    unlockedAt: 'September 2026',
    progressPercent: 100
  },
  {
    id: 'wb-4',
    title: 'Care Train Guardian',
    icon: '🍲',
    tier: 'Homestead Pillar',
    description: 'Pledge and deliver 3 postpartum meals or emergency respite drops to local mothers.',
    unlocked: false,
    progressPercent: 66
  },
  {
    id: 'wb-5',
    title: 'Elder Wisdom Keeper',
    icon: '🕊️',
    tier: 'Elder Wisdom Keeper',
    description: 'Mentor a rising mother, host 3 offline porch circles, and maintain 98%+ community trust.',
    unlocked: false,
    progressPercent: 40
  }
];

export const INITIAL_URGENT_CARE_ALERTS: UrgentCareAlert[] = [
  {
    id: 'sos-1',
    title: 'Postpartum Meals Needed: Fresh Broth & Stew for Sister Anaya',
    postedBy: 'Sister Jamila (Care Spearhead)',
    category: 'Postpartum Meals',
    urgencyLevel: 'Immediate (Today)',
    locationArea: 'Decatur / Candler Park Area, GA',
    stateCode: 'GA',
    description: 'Sister Anaya birthed baby Kairo this weekend! Big sister (age 3) is home. In need of 2 warm dairy-free postpartum meals (bone broth, greens, brown rice). Porch drop-off available.',
    dietaryOrSafetyNotes: 'Dairy-free, no peanuts. Gluten-free preferred.',
    responders: [
      { sisterName: 'Mama Shantrece', respondedAt: '10 mins ago', note: 'Dropping slow-simmered herbal chicken broth and cornbread at 4 PM!' }
    ],
    status: 'Sister Responded',
    createdAt: 'Today at 9:00 AM'
  },
  {
    id: 'sos-2',
    title: 'Urgent Morning Homeschool Ride: Stone Mountain to Nature Center',
    postedBy: 'Mama Keisha',
    category: 'Ride Sharing / Logistics',
    urgencyLevel: 'Within 24 Hours',
    locationArea: 'Stone Mountain -> Arabia Mountain, GA',
    stateCode: 'GA',
    description: 'Car in shop for brake check. Need a ride for myself and 2 children (ages 6 & 8) to join tomorrow’s homeschool nature study.',
    dietaryOrSafetyNotes: 'Booster seats provided by mom.',
    responders: [],
    status: 'Open SOS',
    createdAt: '1 hour ago'
  },
  {
    id: 'sos-3',
    title: 'Emergency Childcare Respite: 2 Hours for Doctor Appointment',
    postedBy: 'Sister Courtney',
    category: 'Emergency Childcare',
    urgencyLevel: 'Within 24 Hours',
    locationArea: 'Southwest Houston / Missouri City, TX',
    stateCode: 'TX',
    description: 'Need a trusted sister to watch sweet 18-month old for 2 hours while I attend postpartum check-in.',
    dietaryOrSafetyNotes: 'Very calm toddler, loves wooden blocks and picture books.',
    responders: [
      { sisterName: 'Mama Nia', respondedAt: '30 mins ago', note: 'I have playgroup on my porch, bring baby over anytime after 1 PM!' }
    ],
    status: 'Sister Responded',
    createdAt: '3 hours ago'
  }
];

export const INITIAL_CONSULTATION_BOOKINGS: ConsultationBooking[] = [
  {
    id: 'cb-1',
    expertName: 'Mama Shantrece',
    expertRole: 'Homeschool Elder',
    clientName: 'Sister Nia',
    durationMinutes: 30,
    date: 'Wednesday, July 15, 2026',
    time: '2:00 PM EST',
    timeCreditsCost: 1.0,
    topic: 'Hands-on Geometry & Living History Curriculum Planning for Grade 4',
    status: 'Confirmed',
    meetingLinkOrLocation: 'Cooperative Jitsi Video Sanctuary (End-to-End Encrypted)',
    createdAt: 'July 12, 2026'
  },
  {
    id: 'cb-2',
    expertName: 'Auntie Brenda',
    expertRole: 'Master Herbalist',
    clientName: 'Sister Courtney',
    durationMinutes: 30,
    date: 'Friday, July 17, 2026',
    time: '11:00 AM CST',
    timeCreditsCost: 1.0,
    topic: 'Backyard Soil Mineralization & Medicinal Herb Companion Planting',
    status: 'Confirmed',
    meetingLinkOrLocation: 'Brenda’s Porch & Direct Encrypted Video',
    createdAt: 'July 13, 2026'
  }
];
