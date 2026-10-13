import { 
  VillageSkillPot, 
  ExternalVendorSpotlight, 
  ClassifiedMicropayment, 
  TeaLoveGift 
} from '../types';

export const INITIAL_SKILL_POTS: VillageSkillPot[] = [
  {
    id: 'pot-1',
    title: 'Family Land Trusts & Protecting Generational Property',
    instructor: 'Sister Attorney Kamilah Adeyemi',
    instructorRole: 'Constitutional Land Trust Counsel & Georgia Matriarch',
    category: 'Wealth & Estate Trusts',
    goalAmount: 500,
    currentRaised: 340,
    backersCount: 23,
    description: 'Crowdfunded masterclass teaching melanated families how to structure private irrevocable land trusts, shield family homesteads from property tax forfeitures, and pass multi-generational acreage unencumbered by probate.',
    curriculumHighlights: [
      'Drafting Private Family Land Trust Declarations',
      'Protecting family property from predatory sales and probate',
      'Setting up trustee succession structures for 5 generations',
      'Homestead property tax protections and filing guides'
    ],
    scheduledDate: 'Saturday, October 24, 2026 • 2:00 PM EST',
    status: 'active',
    minimumPledge: 5
  },
  {
    id: 'pot-2',
    title: 'Off-Grid Solar Well & Rainwater Harvesting Lab',
    instructor: 'Sister Nia & Brother Marcus Vance',
    instructorRole: 'Permaculture Off-Grid Engineers • Alabama Circle',
    category: 'Homestead & Land',
    goalAmount: 1000,
    currentRaised: 780,
    backersCount: 42,
    description: 'Practical, step-by-step blueprints for engineering a 100% off-grid 48V DC solar submersible well pump and a 2,500-gallon food-grade rainwater gravity catchment system for maternal homesteads.',
    curriculumHighlights: [
      'Sizing solar photovoltaic panels for deep well pumps',
      'First-flush diverter design and UV sediment filtration',
      'Plumbing freeze-proof manifold stations for farm livestock',
      'Procuring military-grade surplus IBC totes safely'
    ],
    scheduledDate: 'Sunday, November 1, 2026 • 3:30 PM EST',
    status: 'active',
    minimumPledge: 10
  },
  {
    id: 'pot-3',
    title: 'Ancestral Herbal Tincturing & Oxymel Formulation Guild',
    instructor: 'Master Herbalist Grandma Corinne Jackson',
    instructorRole: 'Gullah Sea Island Wisdom Keeper (Age 64)',
    category: 'Herbalism & Doula',
    goalAmount: 450,
    currentRaised: 420,
    backersCount: 31,
    description: 'Live interactive guild training on extracting fat-soluble and water-soluble herbal constituents, dual-extracting wild medicinal mushrooms, and formulating child-safe elderberry-oxymel cold elixirs.',
    curriculumHighlights: [
      'Menstruum math: Calculating 1:2 and 1:5 alcohol ratios',
      'Wildcrafted elderberry, sweetgum, and mullein alchemy',
      'Child-safe vegetable glycerin extractions without heat damage',
      'Herbalist field notes and batch-labeling regulatory compliance'
    ],
    scheduledDate: 'Thursday, October 15, 2026 • 7:00 PM EST',
    status: 'active',
    minimumPledge: 5
  },
  {
    id: 'pot-4',
    title: 'Heirloom Seed Preservation & True-to-Type Breeding Lab',
    instructor: 'Sister Ayanna Robinson',
    instructorRole: '3rd Generation North Carolina Seed Steward',
    category: 'Homestead & Land',
    goalAmount: 300,
    currentRaised: 300,
    backersCount: 26,
    description: 'Successfully funded! Complete masterclass on wet and dry seed threshing, isolating open-pollinated landrace okra and collards, and cryo-storing heritage seeds for 20+ years.',
    curriculumHighlights: [
      'Fermentation extraction for heirloom heirloom beefsteak tomatoes',
      'Bagging blossoms to prevent cross-pollination among cucurbits',
      'Desiccant packaging and airtight Mason jar silica storage',
      'Establishing a regional seed-swap repository'
    ],
    scheduledDate: 'Archive Ready • Instant Access for Backers',
    status: 'funded',
    recordingReady: true,
    minimumPledge: 5
  },
  {
    id: 'pot-5',
    title: 'Independent Homeschool Transcript & State Portfolio Defense',
    instructor: 'Matriarch Denise Washington',
    instructorRole: 'Homeschool Mother of 5 • Certified Educational Consultant',
    category: 'Homeschool Mastery',
    goalAmount: 400,
    currentRaised: 185,
    backersCount: 15,
    description: 'Equipping mothers to build accredited high school portfolios, calculate unweighted GPAs, and successfully defend independent homeschool transcripts before state boards and university admissions.',
    curriculumHighlights: [
      'Creating NCAA-compliant homeschool course descriptions',
      'Awarding Carnegie units for practical vocational apprenticeships',
      'Dual enrollment navigation at local community colleges',
      'Portfolio binder audits that satisfy any state annual review'
    ],
    scheduledDate: 'Saturday, November 14, 2026 • 1:00 PM EST',
    status: 'active',
    minimumPledge: 5
  }
];

export const INITIAL_EXTERNAL_VENDORS: ExternalVendorSpotlight[] = [
  {
    id: 'vendor-1',
    businessName: 'Highland Heritage Farm Supply & Grain',
    plan: 'quarterly',
    price: 50,
    targetHub: 'healing',
    headline: 'Certified Organic Non-GMO Animal Feeds & Heirloom Cover Crop Seeds',
    tagline: 'Supporting American family homesteads with chemical-free livestock nutrition.',
    description: 'Highland Heritage is proud to partner with the Copper Mommies Sisterhood. We supply 50lb bags of organic non-GMO layer mash, sprouted barley fodder kits, and winter rye cover seed with nationwide freight discounts.',
    promoCode: 'COPPERHOMESTEAD15',
    ctaUrl: 'https://highlandheritagefarmsupply.com',
    ctaText: 'Visit Farm Supply Catalog',
    contactEmail: 'orders@highlandheritagefarmsupply.com',
    logoEmoji: '🌾',
    category: 'Homestead & Agriculture',
    status: 'active',
    createdAt: '2 weeks ago',
    verifiedExternal: true,
    stripeReceiptId: 'rcpt_stripe_live_894192301'
  },
  {
    id: 'vendor-2',
    businessName: 'SolApex Micro-Solar & Emergency Off-Grid Power',
    plan: 'monthly',
    price: 25,
    targetHub: 'village',
    headline: 'Plug-and-Play LiFePO4 Home Power Stations & Foldable Solar Blankets',
    tagline: 'Clean, silent, fume-free emergency backup energy designed for families.',
    description: 'SolApex builds 2400W lithium iron phosphate portable solar generators engineered for homestead freezers, medical respirators, and well pump backup during grid interruptions. Outside commercial partner of Copper Mommies Co.',
    promoCode: 'MOMMIEPOWER',
    ctaUrl: 'https://solapexenergy.com/coppermommies',
    ctaText: 'Explore Solar Bundles',
    contactEmail: 'partnerships@solapexenergy.com',
    logoEmoji: '⚡',
    category: 'Clean Energy & Resilience',
    status: 'active',
    createdAt: '1 week ago',
    verifiedExternal: true,
    stripeReceiptId: 'rcpt_stripe_live_948217332'
  },
  {
    id: 'vendor-3',
    businessName: 'Mountain Rose Apothecary Jars & Glassware',
    plan: 'quarterly',
    price: 50,
    targetHub: 'healing',
    headline: 'Lead-Free Amber Glass Boston Rounds, Salve Tins & Stoneware Crocks',
    tagline: 'Wholesale botanical packaging supplies for village herbalists.',
    description: 'Supplying verified American herbal artisans with heavy-walled UV-blocking amber glass dropper bottles, metal caps, and water-seal fermentation crocks. 20% discount code exclusive for sisterhood circles.',
    promoCode: 'AMBERVILLAGE20',
    ctaUrl: 'https://mountainroseglassware.com/coop',
    ctaText: 'Shop Apothecary Glassware',
    contactEmail: 'supply@mountainroseglassware.com',
    logoEmoji: '🏺',
    category: 'Herbal Crafts & Packaging',
    status: 'active',
    createdAt: '3 days ago',
    verifiedExternal: true,
    stripeReceiptId: 'rcpt_stripe_live_739102844'
  }
];

export const INITIAL_MICROPAYMENTS: ClassifiedMicropayment[] = [
  {
    id: 'micro-1',
    type: 'land_classified',
    fee: 10,
    title: '3.5 Fenced Acres Available for Homestead Co-Stewardship',
    posterName: 'Sister Carolyn M.',
    locationState: 'GA',
    city: 'Jackson / Butts County',
    category: 'Acreage & Farm Share',
    compensationOrPrice: '$450/mo or Partial Harvest Barter',
    acreageOrHours: '3.5 Acres • Deep Artesian Well',
    description: 'Pasture-fenced 3.5 acres with fresh spring branch and deep water well access. Looking for an experienced homeschooling family or mother-led organic grower to pasture heritage goats and establish raised market beds.',
    contactEmail: 'carolyn.m@sanctuarylands.org',
    phone: '(470) 555-0142',
    stripePaymentId: 'ch_stripe_live_5839201948',
    createdAt: 'Yesterday',
    status: 'Published & Verified'
  },
  {
    id: 'micro-2',
    type: 'job_listing',
    fee: 5,
    title: 'Full-Time Homeschool Learning Pod Nanny & Helper',
    posterName: 'Mama Zora Jenkins',
    locationState: 'NC',
    city: 'Raleigh-Durham Circle',
    category: 'Childcare & Learning Pod',
    compensationOrPrice: '$24–$28 / hour + Organic Lunch Provided',
    acreageOrHours: '30 hrs/week (Mon–Thu 9am–4:30pm)',
    description: 'Seeking a warm, patient, melanated sister with experience in Charlotte Mason and natural nature-study education for our 3 homeschool children (ages 4, 7, and 10). Light meal prep and garden time.',
    contactEmail: 'zora.jenkins@durhamfamily.org',
    phone: '(919) 555-0813',
    stripePaymentId: 'ch_stripe_live_8392019482',
    createdAt: '2 days ago',
    status: 'Published & Verified'
  },
  {
    id: 'micro-3',
    type: 'land_classified',
    fee: 10,
    title: 'Dry Timber Cabin & 1 Acre Permaculture Plot for Lease',
    posterName: 'Eldress Beatrice Hall',
    locationState: 'AL',
    city: 'Tuskegee / Macon County',
    category: 'Homestead Cabin & Land',
    compensationOrPrice: '$600/month (Includes Solar & Well Water)',
    acreageOrHours: '1 Acre • 600 sq ft Hand-Hewn Cabin',
    description: 'Quiet, off-road retreat cabin with wood-burning stove, rainwater system, and 1 acre of rich cleared bottomland soil ready for spring planting. Sacred sanctuary environment.',
    contactEmail: 'eldress.beatrice@maconheritage.net',
    phone: '(334) 555-0921',
    stripePaymentId: 'ch_stripe_live_1948203912',
    createdAt: '4 days ago',
    status: 'Published & Verified'
  },
  {
    id: 'micro-4',
    type: 'job_listing',
    fee: 5,
    title: 'Apprentice Organic Market Gardener & High-Tunnel Assistant',
    posterName: 'Sister Maya Vance',
    locationState: 'TX',
    city: 'Prairie View / Waller County',
    category: 'Homestead Agriculture',
    compensationOrPrice: '$20/hr + Weekly Farm Harvest Basket',
    acreageOrHours: '15 hrs/week (Early mornings)',
    description: 'Learn bio-intensive market gardening on our family farm. Assist with seed starting, composting, drip line installation, and weekend harvest bundle packing for sisterhood circles.',
    contactEmail: 'maya@pvheritageroots.com',
    stripePaymentId: 'ch_stripe_live_9482019483',
    createdAt: '5 days ago',
    status: 'Published & Verified'
  }
];

export const INITIAL_TEA_GIFTS: TeaLoveGift[] = [
  {
    id: 'tea-1',
    donorName: 'Sister Sharon W.',
    tier: '$25 Matriarch Honeycomb & Clay Pot',
    amount: 25,
    paymentMethod: 'Cash App',
    transactionRef: 'CASHTAG-$SHARONW-84910',
    note: 'In honor of Grandma Lottie who taught me how to can okra and pray over my babies. Thank you for this beautiful sanctuary.',
    date: 'Today at 3:15 PM',
    isTaxExempt508: true,
    pmaCovenantAcknowledged: true
  },
  {
    id: 'tea-2',
    donorName: 'Mama Nia Clarke',
    tier: '$10 Pot of Wildcrafted Goldenrod',
    amount: 10,
    paymentMethod: 'Stripe',
    transactionRef: 'STRIPE-CH-9382104',
    note: 'Supporting the servers and technical team that keeps our conversations private and encrypted. Love to all my sisters.',
    date: 'Yesterday at 8:40 PM',
    isTaxExempt508: true,
    pmaCovenantAcknowledged: true
  },
  {
    id: 'tea-3',
    donorName: 'Elder Sister Evelyn',
    tier: '$3 Cup of Herbal Mint',
    amount: 3,
    paymentMethod: 'Zelle',
    transactionRef: 'ZELLE-REF-592019',
    note: 'A little cup of hot peppermint tea for our dear community organizers.',
    date: '2 days ago',
    isTaxExempt508: true,
    pmaCovenantAcknowledged: true
  },
  {
    id: 'tea-4',
    donorName: 'Sister Keisha B.',
    tier: '$25 Matriarch Honeycomb & Clay Pot',
    amount: 25,
    paymentMethod: 'Stripe',
    transactionRef: 'STRIPE-CH-8291048',
    note: 'Sending love from the Atlanta Circle! May our children grow up knowing real community.',
    date: '3 days ago',
    isTaxExempt508: true,
    pmaCovenantAcknowledged: true
  }
];

export const DUAL_CHAMBER_SPECS = {
  tier1: {
    title: 'Tier 1: Sanctuary & Founder Ministry',
    legalForm: 'Private Membership Association (PMA) & Title 26 U.S.C. § 508(c)(1)(a)',
    jurisdiction: 'Private Domain • First & Fourteenth Amendment Religious & Assembly Protections',
    purpose: 'Free-will love gifts ("Buy Us a Tea"), spiritual fellowship, ancestral lineage archives, private herbal remedy preservation under A Healthy Addiction, sacred maternal circles, peer-to-peer time credits, and direct stewardship under Mama Shantrece. 100% statutory tax-exempt status.',
    taxStatus: 'Mandatory statutory tax-exempt status under IRC § 508(c)(1)(a) without state application or 501(c)(3) bureaucratic surveillance.',
    rules: [
      'Strictly non-public, closed-circuit association reserved for vetted matriarchs born 1995 or earlier.',
      'Love gifts ("Buy Us a Tea") flow directly to Mama Shantrece (Founder & Steward) to sustain the sanctuary infrastructure, hosting, audio rooms, and maternal care provisions.',
      'All activities, remedies, and communications take place under Private Member Covenant outside commercial regulatory jurisdiction.',
      'Community Crowdfunding (Village Skill Pots): Used exclusively when the community pools funds for a specific educational class, master teacher honorarium, or group project administered by the founder.'
    ],
    accentColor: '#D4AF37',
    badge: 'Sacred Sanctuary Ground'
  },
  tier2: {
    title: 'Tier 2: Commercial Operating Arm & Mother Affiliate Rails',
    legalForm: 'Single-Member Limited Liability Company (SC Automated Solutions / Copper Mommies Operating Arm)',
    jurisdiction: 'Public Commercial Domain • State Corporate & Banking Rails',
    purpose: 'Commercial interface, Stripe merchant processing, external vendor spotlight sponsorships ($25/mo or $60/qtr), $5/$10 Copper Mommies Classified micropayments, and maternal affiliate commission payouts.',
    taxStatus: 'Standard commercial entity with EIN, transparent bookkeeping, and pass-through taxation.',
    rules: [
      'All advertising revenue ($25/mo or $60/qtr vendor spotlights) and classified publishing fees ($5/$10) flow 100% to the founder / operating LLC to cover platform verification, server bandwidth, and administrative labor.',
      'Mother Affiliation Payouts: When a vetted Copper Mommy refers business to SC Automated Solutions or helps sell products from Devi & Mommie Creative Studios, NestBright Academy, A Healthy Addiction, or Your Brain is an Asset, commissions (20%–30%) are paid directly to her as a 1099 independent promoter under the LLC.',
      'No Public Commingling: The community does not audit private commercial revenue, and public commercial liabilities cannot penetrate Tier 1 (The Sanctuary).',
      'The platform does not intermediate or process peer-to-peer cash transactions between members; members exchange skills, barter, or use their own private arrangements.'
    ],
    accentColor: '#0047AB',
    badge: 'Commercial & Affiliate Firewall'
  }
};

export const PMA_COVENANT_TEXT = `
COPPER MOMMIES COOPERATIVE PRIVATE MEMBERSHIP COVENANT
Established under the Law of Nature, the First & Fourteenth Amendments of the Constitution for the United States of America, and Title 26 U.S. Code § 508(c)(1)(a).

ARTICLE I: NATURE AND PURPOSE
We, the mothers, grandmothers, and daughters of melanated American lineage, hereby associate ourselves in the private capacity as a Private Membership Association (PMA) and Free-Exercise Spiritual Sanctuary known as The Copper Mommies Sanctuary. Our purpose is the preservation of family wellness, maternal mutual aid, generational land stewarding, heirloom education, and the sharing of traditional plant medicine outside the public commercial regulatory sphere.

ARTICLE II: PRIVATE DOMAIN JURISDICTION
1. Private Jurisdiction: All members enter into this Covenant freely and voluntarily in the private capacity. All exchanges, herbal advice, childbirth counsel, childcare rotations, and spiritual communications are private matters among members and do not constitute public medical, legal, or commercial offerings.
2. Immunity from Commercial Interference: As an association operating under 26 U.S.C. § 508(c)(1)(a), the Sanctuary possesses statutory tax-exempt status by operation of law and maintains complete ecclesiastical autonomy.
3. Love Gifts & Offerings: All financial contributions to the Sanctuary are free-will love gifts, freely given from sister to sister for the upkeep of the mutual aid network.

ARTICLE III: CODE OF HONESTY AND PEACE
Every sister agrees to walk with integrity, to protect the privacy of her sisters, to never disclose private conversations or family records to external third parties, and to resolve any grievance through our Elder Council rather than civil litigation.

AFFIRMATION & EMBLEM
By signing or checking this covenant, you declare on your maternal honor that your actions are in peace, honor, and alignment with the private sanctuary of Copper Mommies Co.
`;

export const SOVEREIGN_PAYMENT_CONFIG = {
  stripePublishableKey: 'pk_live_copper_mommies_sovereign_rails',
  cashAppHandle: '$CopperMommiesCo',
  cashAppUrl: 'https://cash.app/$CopperMommiesCo',
  zelleEmail: 'treasury@coppermommies.co',
  bankName: 'Sovereign Copper Treasury / First National Cooperative Reserve',
  pmaTaxId: 'Title 26 U.S.C. § 508(c)(1)(a) Self-Executing Sanctuary',
  supportEmail: 'treasury@coppermommies.co'
};
