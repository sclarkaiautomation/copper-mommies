import { 
  CommonsPost, 
  CommonsExchangeItem, 
  HousingListing, 
  VouchedBusiness, 
  CommonsEvent 
} from '../types';

export const INITIAL_COMMONS_POSTS: CommonsPost[] = [
  {
    id: 'post-1',
    authorName: 'Mama Keisha',
    authorRole: 'Circle Host',
    authorState: 'GA',
    authorCity: 'Atlanta',
    authorAvatar: '🕊️',
    topic: 'daily-uplift',
    postType: 'announcement',
    title: 'Morning Sun & Daily Affirmation',
    content: "Good morning mamas! Just a real reminder: the peace you create in your home, the meals you cook, and the love you pour into your kids every single day is building a lasting generational foundation. Whatever heavy load you are carrying this week, know you don't have to carry it alone. You've got an entire village of sisters right here in your corner.",
    imageUrl: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&w=900&q=80',
    likesCount: 24,
    likedBy: ['Mama Shantrece', 'Sister Nia', 'Mama Danielle'],
    comments: [
      {
        id: 'c-1',
        authorName: 'Sister Nia',
        authorLocation: 'Houston, TX',
        content: 'Amen Mama Keisha! Needed this exact word this morning while getting the children started on their lessons.',
        createdAt: '2 hours ago'
      },
      {
        id: 'c-2',
        authorName: 'Auntie Brenda',
        authorLocation: 'Savannah, GA',
        content: 'Sending love from the coast! The elderberry tea is brewing.',
        createdAt: '1 hour ago'
      }
    ],
    createdAt: '3 hours ago'
  },
  {
    id: 'post-2',
    authorName: 'Sister Althea',
    authorRole: 'Verified Mother',
    authorState: 'NC',
    authorCity: 'Asheville',
    authorAvatar: '🌿',
    topic: 'herbal-remedies',
    postType: 'giveaway',
    title: '🎁 Free Giveaway: Rich Mineral Broth for Family Wellness & Vitality',
    content: 'To any mama feeling run-down or needing deep nourishment this season: simmer stinging nettle leaf, oatstraw, roasted dandelion root, ginger knob, and sea kelp with marrow bones for a full 24 hours. The natural iron and magnesium restore depleted energy like nothing else. Free gift: I have two quart jars ready if any local Asheville sister wants one!',
    imageUrl: 'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&w=900&q=80',
    likesCount: 38,
    likedBy: ['Mama Shantrece', 'Mama Keisha', 'Sister Corinne', 'Sister Nia'],
    comments: [
      {
        id: 'c-3',
        authorName: 'Sister Maya',
        authorLocation: 'Charlotte, NC',
        content: 'May I trade you some dried lemon balm and fresh beeswax for a jar? Keeping our family immunity up this month.',
        createdAt: '45 mins ago'
      }
    ],
    createdAt: '5 hours ago'
  },
  {
    id: 'post-3',
    authorName: 'Mama Danielle',
    authorRole: 'Council Grandmother',
    authorState: 'GA',
    authorCity: 'Decatur',
    authorAvatar: '🌾',
    topic: 'homestead-seeds',
    postType: 'barter',
    title: '🤝 Barter Request: Heirloom Seeds for Fresh Goat Milk Soap',
    content: 'Sisters, harvest your brownest pods this week! I am bagging up 50 packets of heirloom Clemson Spineless and Cherokee Long Pod to trade. Looking for homemade goat milk soap, elderberry syrup, or sourdough starters. Open for direct sister barter!',
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d69106093?auto=format&fit=crop&w=900&q=80',
    likesCount: 19,
    likedBy: ['Mama Shantrece', 'Sister Althea'],
    comments: [],
    createdAt: 'Yesterday',
    isFlagged: false,
    reportCount: 0,
    isRemovedByAdmin: false
  },
  {
    id: 'post-4',
    authorName: 'Sister Corinne',
    authorRole: 'Verified Mother',
    authorState: 'SC',
    authorCity: 'Charleston',
    authorAvatar: '🦋',
    topic: 'homeschool-nestbright',
    postType: 'announcement',
    title: '📢 Community Announcement: Autumn Nature Walk & Co-Op Playdate',
    content: 'Our homeschool morning was pure medicine! The children sketched sweetgrass, southern live oak moss, and gathered wild persimmons. When we slow down to the pace of our children and our soil, learning happens without stress. If any Charleston mamas want to do a cooperative park playdate this Thursday morning, let me know!',
    imageUrl: '/src/assets/images/sister_corinne_botany_teacher_1792314695063.jpg',
    likesCount: 22,
    likedBy: ['Mama Shantrece', 'Mama Keisha', 'Sister Althea'],
    comments: [
      {
        id: 'c-4',
        authorName: 'Sister Nia',
        authorLocation: 'Houston, TX',
        content: 'This inspires our morning rhythm so much! We are doing tree bark rubbings today.',
        createdAt: '3 hours ago'
      }
    ],
    createdAt: '1 day ago',
    isFlagged: false,
    reportCount: 0,
    isRemovedByAdmin: false
  },
  {
    id: 'post-5',
    authorName: 'Sister Nia',
    authorRole: 'Verified Mother',
    authorState: 'TX',
    authorCity: 'Houston',
    authorAvatar: '🕊️',
    topic: 'herbal-remedies',
    postType: 'giveaway',
    title: '🎁 Free Gift: Gentle Whipped Tallow & Calendula Baby Butter',
    content: 'Just finished rendering a fresh batch of 100% grass-fed suet tallow infused with homegrown organic calendula flowers and chamomile. It has completely cleared up my baby’s dry teething rash in 48 hours. I have 3 small gift tins available for free giveaway to any postpartum sister in need!',
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=80',
    likesCount: 31,
    likedBy: ['Mama Shantrece', 'Sister Althea', 'Mama Danielle', 'Sister Corinne'],
    comments: [],
    createdAt: '2 days ago',
    isFlagged: false,
    reportCount: 0,
    isRemovedByAdmin: false
  }
];

export const INITIAL_EXCHANGE_ITEMS: CommonsExchangeItem[] = [
  {
    id: 'item-1',
    title: 'Solid Hardwood Montessori Bookshelf & Cubby',
    description: 'Beautiful handmade maple wood low-shelf, perfect for toddler height. Smooth sanded edges, coated in non-toxic beeswax polish. Free to a good home or co-op homeschool room!',
    type: 'free',
    category: 'Homeschool Books & Supplies',
    imageUrl: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80',
    locationCity: 'Atlanta',
    locationState: 'GA',
    distanceMiles: 4.2,
    terms: '100% Free Gift (Pick up in West End / Cascade)',
    authorName: 'Mama Keisha',
    authorContactType: 'in-app',
    createdAt: '15 mins ago',
    active: true
  },
  {
    id: 'item-2',
    title: '1 Dozen Pastured Heritage Eggs for 4oz Herbal Salve',
    description: 'Fresh daily from our pasture-raised Plymouth Rock hens fed certified organic seed & vegetable trimmings. Looking to trade for calendula healing salve or elderberry syrup.',
    type: 'barter',
    category: 'Homestead & Farm',
    imageUrl: '/barter_trade_sister_exchange.jpg',
    locationCity: 'Conyers',
    locationState: 'GA',
    distanceMiles: 8.5,
    terms: 'Barter: Fresh Eggs ➔ Herbal Salve or Honey',
    authorName: 'Sister Brenda',
    authorContactType: 'in-app',
    createdAt: '1 hour ago',
    active: true
  },
  {
    id: 'item-3',
    title: '2 Hours Math & Phonics Tutoring (Grades 3–5)',
    description: 'Offering 2 hours of individualized homeschool math or reading comprehension support using multi-sensory techniques. Seeking 2 hours of garden weeding or sourdough bread.',
    type: 'time-credit',
    category: 'Homeschool Books & Supplies',
    imageUrl: '/barter_tutoring_sister.jpg',
    locationCity: 'Decatur',
    locationState: 'GA',
    distanceMiles: 6.1,
    terms: '2 Hours Time-Credit or Direct Skill Swap',
    authorName: 'Sister Nia',
    authorContactType: 'in-app',
    createdAt: '3 hours ago',
    active: true
  },
  {
    id: 'item-4',
    title: 'Natural Linen Herbal Heating Pads & Rest Packs (Pair)',
    description: 'Gentle therapeutic warmth packs filled with organic flaxseed, dried lavender, and chamomile. Great for growing pains, muscle tension, teen menstrual comfort, or restorative rest.',
    type: 'free',
    category: 'Herbal Remedies',
    imageUrl: '/coppermommies-selflove1-cmc.jpg',
    locationCity: 'Savannah',
    locationState: 'GA',
    distanceMiles: 14.0,
    terms: '100% Free Gift for Community Sister',
    authorName: 'Sister Corinne',
    authorContactType: 'in-app',
    createdAt: '5 hours ago',
    active: true
  },
  {
    id: 'item-5',
    title: '4oz Mason Jar Goldenrod & Arnica Relief Body Oil',
    description: 'Solar infused for 6 weeks in cold-pressed extra virgin olive oil. Wonderful for tired muscles, active kids, joint relief, and daily family circulation.',
    type: 'barter',
    category: 'Herbal Remedies',
    imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
    locationCity: 'Asheville',
    locationState: 'NC',
    distanceMiles: 12.3,
    terms: 'Barter for Heirloom Garlic Cloves or Handmade Soap',
    authorName: 'Sister Althea',
    authorContactType: 'in-app',
    createdAt: '1 day ago',
    active: true
  },
  {
    id: 'item-6',
    title: 'Solid Wood Rocking Cradle with Organic Wool Mattress',
    description: 'Handcrafted pine heirloom bassinet. Sturdy, smooth rocking motion, fits infants from 0 to 6 months. Clean, smoke-free home.',
    type: 'free',
    category: 'Furniture & Household',
    imageUrl: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80',
    locationCity: 'Atlanta',
    locationState: 'GA',
    distanceMiles: 5.0,
    terms: '100% Free Gift to Any Sister in Need',
    authorName: 'Mama Shantrece',
    authorContactType: 'in-app',
    createdAt: '1 day ago',
    active: true
  }
];

export const INITIAL_HOUSING_LISTINGS: HousingListing[] = [
  {
    id: 'house-1',
    title: 'Private Garden Cottage & Family Sanctuary Room',
    spaceType: 'room',
    transactionType: 'rent',
    pricingTerms: '$650/month (All utilities, high-speed fiber internet, and solar power included)',
    regionOrCity: 'Stone Mountain / Decatur area',
    stateCode: 'GA',
    showAddressAndPhone: false, // Protected by default
    accommodatesChildren: true,
    childrenDetails: 'Thoughtfully suited for a mother and children. Fenced yard, quiet playspace, and private family area.',
    privateBath: true,
    privateEntrance: true,
    landAcreage: '1.25 acres with shared organic permaculture raised beds',
    rulesAndExpectations: 'Peaceful, smoke-free, clean family home. Respect for homeschool focus hours, quiet evening family time, and co-op garden care.',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80',
    authorName: 'Mama Danielle',
    createdAt: '2 days ago',
    isVerifiedSpace: true
  },
  {
    id: 'house-2',
    title: 'Mother & Family Restorative Respite Haven (Zero-Cost Safe Stay)',
    spaceType: 'maternity',
    transactionType: 'emergency-stay',
    pricingTerms: '100% Free Community Gifting (Sponsored by Copper Circle Care & Respite Fund)',
    regionOrCity: 'Atlanta (Cascade Heights)',
    stateCode: 'GA',
    showAddressAndPhone: false,
    accommodatesChildren: true,
    childrenDetails: 'Prepared for mothers needing a calm, peaceful space to rest, recover, reset, or navigate life transitions with their children.',
    privateBath: true,
    privateEntrance: false,
    rulesAndExpectations: 'Dedicated sanctuary bedroom with organic linens, adjacent washroom, quiet restful atmosphere, and warm nourishing home-cooked meals provided during times of recovery or family need.',
    imageUrl: '/CopperBabySpaday.jpg',
    authorName: 'Mama Keisha',
    createdAt: '3 days ago',
    isVerifiedSpace: true
  },
  {
    id: 'house-3',
    title: '1.5-Acre Homestead Parcel for Tiny Home or Camper RV',
    spaceType: 'land',
    transactionType: 'work-trade',
    pricingTerms: 'Work-Trade Option: 8 hours/month orchard stewardship OR $280/month lot stipend',
    regionOrCity: 'Highland Ridge / Western Carolina foothills',
    stateCode: 'NC',
    showAddressAndPhone: false,
    accommodatesChildren: true,
    childrenDetails: 'Vast outdoor learning environment with creek, chickens, and fruit trees.',
    privateBath: false,
    privateEntrance: true,
    landAcreage: '1.5 acres dedicated hookup space (deep well water & 30A solar hookup)',
    rulesAndExpectations: 'Natural stewardship mindset. Composting toilet required if off-grid. Willingness to participate in cooperative seed saving.',
    imageUrl: 'https://images.unsplash.com/photo-1500076656116-558758c991c1?auto=format&fit=crop&w=900&q=80',
    authorName: 'Sister Althea',
    createdAt: '4 days ago',
    isVerifiedSpace: true
  },
  {
    id: 'house-4',
    title: 'Upper-Level 2-Bedroom Mother & Child Suite',
    spaceType: 'rental',
    transactionType: 'rent',
    pricingTerms: '$800/month (Includes water, gas, power & shared laundry)',
    regionOrCity: 'East Point / Airport Proximity',
    stateCode: 'GA',
    showAddressAndPhone: false,
    accommodatesChildren: true,
    childrenDetails: 'Two separate bright bedrooms ideal for a mother with school-aged children.',
    privateBath: true,
    privateEntrance: true,
    rulesAndExpectations: 'Quiet, harmonious community. No toxic chemicals used on property. Organic pest-control only.',
    imageUrl: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=900&q=80',
    authorName: 'Sister Brenda',
    createdAt: '1 week ago',
    isVerifiedSpace: true
  }
];

export const INITIAL_VOUCHED_BUSINESSES: VouchedBusiness[] = [
  {
    id: 'biz-1',
    name: 'Roots & Resilience Master Apothecary',
    ownerName: 'Mama Shantrece',
    industry: 'Holistic Health',
    locationCity: 'Atlanta',
    locationState: 'GA',
    website: 'https://rootsandresilience.example',
    contactEmail: 'shantrece@rootsapothecary.coop',
    offerDescription: 'Ancestral botanical formulations, seasonal oxymels, wildcrafted elderberry elixirs, and postpartum mineral nettle infusions.',
    sisterDiscountOrBarter: '✨ 15% off with code COPPERMOMMIE or 100% Copper Credit / Barter accepted for bulk herbs',
    imageUrl: '/apothecary_sister_herbal.jpg',
    vouchesCount: 42,
    vouchedBy: ['Mama Keisha', 'Sister Nia', 'Sister Althea', 'Mama Danielle', 'Sister Corinne'],
    sisterTestimonials: [
      {
        id: 't-1',
        author: 'Mama Keisha',
        text: 'Mama Shantrece\'s postpartum revival tea brought my color and vitality right back after 48 hours of labor. 10/10 recommend!',
        date: '2 weeks ago',
        vouchedProductOrService: 'Postpartum Mineral Nettle Infusion'
      },
      {
        id: 't-2',
        author: 'Sister Nia',
        text: 'The elderberry tincture kept our whole homeschool co-op healthy through all of winter. True medicine woman craftsmanship.',
        date: '1 month ago',
        vouchedProductOrService: 'Wildcrafted Elderberry Elixir'
      }
    ],
    isMemberOwned: true,
    isFeaturedSponsor: true,
    createdAt: '2026-08-01'
  },
  {
    id: 'biz-2',
    name: 'Sacred Threshold Doula Circle & Lying-In',
    ownerName: 'Mama Keisha',
    industry: 'Doula & Midwifery',
    locationCity: 'Atlanta & Savannah',
    locationState: 'GA',
    website: 'https://sacredthreshold.example',
    contactEmail: 'keisha@sacredthreshold.org',
    offerDescription: 'Physiological home birth doula advocacy, traditional Bengkung belly binding, prenatal herbal nutrition, and 40-day lying-in support.',
    sisterDiscountOrBarter: '🕊️ Complimentary 45-min virtual birth plan consult for all verified Copper Circle mothers',
    imageUrl: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=800&q=80',
    vouchesCount: 36,
    vouchedBy: ['Mama Shantrece', 'Sister Maya', 'Sister Corinne', 'Auntie Brenda'],
    sisterTestimonials: [
      {
        id: 't-3',
        author: 'Sister Maya',
        text: 'Mama Keisha held the space during my 24-hour home birth with pure spiritual serenity and ancestral strength. She is a treasure.',
        date: '3 weeks ago',
        vouchedProductOrService: 'Full Spectrum Birth Doula Care'
      }
    ],
    isMemberOwned: true,
    isFeaturedSponsor: false,
    createdAt: '2026-08-10'
  },
  {
    id: 'biz-3',
    name: 'Highland Ridge Heritage Seeds & Poultry',
    ownerName: 'Mama Danielle',
    industry: 'Homestead & Food',
    locationCity: 'Asheville',
    locationState: 'NC',
    website: 'https://highlandheritage.example',
    contactEmail: 'danielle@highlandheritage.org',
    offerDescription: 'Open-pollinated, non-GMO heirloom seeds preserving American Indian and southern heirloom crops, plus pasture-raised heritage hens.',
    sisterDiscountOrBarter: '🌱 Free seasonal seed packet with every seed swap or member barter exchange',
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d69106093?auto=format&fit=crop&w=800&q=80',
    vouchesCount: 29,
    vouchedBy: ['Sister Althea', 'Mama Shantrece', 'Sister Nia'],
    sisterTestimonials: [
      {
        id: 't-4',
        author: 'Sister Althea',
        text: '100% germination rate on her Seminole pumpkin seeds. Our homestead produced over 40 pumpkins from one packet!',
        date: '1 month ago',
        vouchedProductOrService: 'Seminole Pumpkin & Okra Seeds'
      }
    ],
    isMemberOwned: true,
    isFeaturedSponsor: false,
    createdAt: '2026-08-15'
  }
];

export const INITIAL_COMMONS_EVENTS: CommonsEvent[] = [
  {
    id: 'ev-1',
    title: 'Autumn Equinox Seed Swap & Sister Village Gathering',
    coverImageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80',
    date: 'Saturday, Oct 10, 2026',
    time: '11:00 AM – 3:30 PM EST',
    locationType: 'in-person',
    venueOrCity: 'West River Nature Preserve Pavilion, Atlanta',
    stateCode: 'GA',
    address: '1320 Piedmont Avenue NE / West River Pavilion, Atlanta, GA',
    description: 'Join Georgia State Leads and visiting sisters for an in-person autumn seed exchange, natural family craft tables, hot elderberry cider, and a real-talk mothering panel spanning early childhood through teenage transitions.',
    category: 'Homestead & Seed Swap',
    postedByRole: 'admin',
    postedByName: 'Mama Shantrece (Circle Lead)',
    rsvps: {
      'Mama Shantrece': 'going',
      'Mama Keisha': 'going',
      'Sister Nia': 'interested',
      'Sister Brenda': 'going'
    },
    createdAt: '3 days ago'
  },
  {
    id: 'ev-2',
    title: 'National Virtual Casual Corner: Family Legacy & Generational Land Planning',
    coverImageUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=900&q=80',
    date: 'Tuesday, Oct 13, 2026',
    time: '7:00 PM – 8:30 PM EST',
    locationType: 'virtual',
    venueOrCity: 'Copper Circle Virtual Sanctuary Room',
    stateCode: 'National',
    virtualLink: 'https://coppermommies.co/casual-corner-live',
    description: 'A cozy evening dialogue led by Mama Shantrece and guest family property specialists covering family land trusts, holistic family healthcare choices, and keeping resources thriving within our communities.',
    category: 'Circle Gathering',
    postedByRole: 'admin',
    postedByName: 'Mama Shantrece (Circle Lead)',
    rsvps: {
      'Mama Shantrece': 'going',
      'Sister Althea': 'going',
      'Sister Maya': 'interested'
    },
    createdAt: '2 days ago'
  },
  {
    id: 'ev-3',
    title: 'Carolinas Regional Homeschool Nature Walk & Botanical Lab',
    coverImageUrl: 'https://images.unsplash.com/photo-1489710437720-ebb67ec84dd2?auto=format&fit=crop&w=900&q=80',
    date: 'Saturday, Oct 17, 2026',
    time: '10:00 AM – 1:00 PM EST',
    locationType: 'in-person',
    venueOrCity: 'Botanical Gardens & Forest Trail, Asheville',
    stateCode: 'NC',
    address: '151 W.T. Weaver Blvd, Asheville, NC',
    description: 'Hosted by NC State Lead Sister Althea. Bring your learners (Grades 1–8 and teens welcome to assist) for native tree identification, bark rubbings, and a wild medicinal plant exploration.',
    category: 'Homeschool Field Day',
    postedByRole: 'spearhead',
    postedByName: 'Sister Althea (NC Lead)',
    rsvps: {
      'Sister Althea': 'going',
      'Mama Danielle': 'interested'
    },
    createdAt: '1 day ago'
  }
];
