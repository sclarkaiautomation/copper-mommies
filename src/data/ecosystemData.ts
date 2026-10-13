export interface SCAutomatedConsultingService {
  id: string;
  title: string;
  tagline: string;
  tier: 'Fast-Track Sprint' | 'Sovereign Stack' | 'Fractional COO Automation';
  price: string;
  duration: string;
  description: string;
  features: string[];
  idealFor: string;
  affiliateCommissionAmount: string;
  deliverables: string[];
}

export interface MotherhoodAffiliateTier {
  tierName: string;
  level: number;
  commissionRate: number; // e.g. 20, 25, 30
  rateLabel: string;
  requirement: string;
  perks: string[];
  badgeColor: string;
}

export interface SimulatedAffiliateLead {
  id: string;
  clientName: string;
  servicePackage: string;
  contractValue: number;
  commissionPercent: number;
  commissionEarned: number;
  status: 'Closed & Paid' | 'Proposal Sent' | 'Discovery Call Booked';
  date: string;
}

export interface MarketingSwipeCopy {
  id: string;
  category: 'Instagram / Social Post' | 'Direct Email / Letter' | 'WhatsApp / SMS Message' | 'Voice Note Pitch';
  title: string;
  hook: string;
  body: string;
  cta: string;
}

export interface NestBrightTierInfo {
  id: 'free-beta' | 'scholar-tier';
  name: string;
  price: string;
  billingPeriod: string;
  badge: string;
  description: string;
  features: string[];
  ctaLabel: string;
  popular?: boolean;
}

export interface NestBrightSlideLesson {
  slideNumber: number;
  title: string;
  slideType: 'Core Concept' | 'Interactive Manipulative' | 'Concept Expansion' | 'Golden Rule Check' | 'Progressive Practice' | 'Celebration';
  gradeLevel: 'Grade 4';
  subject: 'Math: Place Value & Multi-Digit Operations' | 'Science: Living Systems & Energy Flow';
  learningObjective: string;
  explanation: string;
  visualModelType: 'place-value-chart' | 'base-ten-blocks' | 'fraction-bars' | 'food-web-diagram' | 'celebration-trophy';
  interactiveData?: any;
  practiceProblem?: {
    question: string;
    options: string[];
    correctAnswer: number;
    hint: string;
    explanation: string;
  };
  wordMatchGame?: {
    term: string;
    definition: string;
  }[];
}

export interface RemedyAlternative {
  id: string;
  standardOTC: string;
  standardOTCPurpose: string;
  herbalAlternative: string;
  botanicalLatin: string;
  primaryAction: string;
  whySwitch: string;
  preparationMethod: string;
  safeForChildren: boolean;
  safeForPostpartum: boolean;
  contraindications?: string;
  amazonAffiliateIngredients: Array<{
    name: string;
    specification: string;
    category: 'Bulk Organic Herbs' | 'Apothecary Hardware' | 'Cold-Pressed Oils & Waxes';
    amazonSearchUrl: string;
    priceEstimate: string;
    isPrimary?: boolean;
  }>;
}

export interface FeaturedHerbalist {
  id: string;
  name: string;
  honorific: string;
  location: string;
  stateCode: string;
  specialty: string;
  lineageTradition: string;
  experienceYears: number;
  consultationFocus: string;
  barterAccepted: boolean;
  bio: string;
  avatarEmoji: string;
  contactEmail: string;
}

export interface ColoringSheetItem {
  id: string;
  title: string;
  series: "Devin's Speedway" | 'Mommie & Me Botanical' | 'Ancestral Heritage';
  theme: string;
  description: string;
  difficulty: 'Elementary Early Reader (Ages 4-7)' | 'Grade 3-5 Explorer (Ages 8-11)';
  learningBreakPrompt: string;
  printPdfUrl: string;
  previewThumbnail: string;
  paletteTheme: string[];
}

export interface CreativeEpisodeItem {
  id: string;
  episodeNumber: number;
  title: string;
  seriesName: string;
  runtime: string;
  synopsis: string;
  educationalCore: string;
  youtubeUrl: string;
  youtubeId: string;
  linkedColoringSheetId: string;
}

export interface AmazonKDPMerchItem {
  id: string;
  title: string;
  format: 'Paperback Coloring Book' | 'Homeschool Study Journal' | 'Activity Storybook' | 'Curriculum Guide';
  author: string;
  description: string;
  pageCount: number;
  price: string;
  amazonKdpUrl: string;
  coverImageEmoji: string;
  bestsellerRank?: string;
}

export interface YourBrainIsAnAssetBlueprint {
  title: string;
  author: string;
  beaconsUrl: string;
  tagline: string;
  philosophyCore: string;
  fourTenets: Array<{
    number: string;
    name: string;
    tagline: string;
    practicalAction: string;
  }>;
  monetizationSteps: Array<{
    step: number;
    title: string;
    duration: string;
    milestone: string;
    checklist: string[];
  }>;
}

// --------------------------------------------------------------------------
// 1. SC AUTOMATED SOLUTIONS DATA
// --------------------------------------------------------------------------
export const SC_AUTOMATED_CONSULTING_SERVICES: SCAutomatedConsultingService[] = [
  {
    id: 'sc-serv-1',
    title: 'Sovereign Business Operations Stack',
    tagline: 'Replace 6 fragmented software subscriptions with 1 unified zero-touch system.',
    tier: 'Sovereign Stack',
    price: '$3,500',
    duration: '2-Week Implementation',
    description: 'Complete architecture of client onboarding, automated agreements, Stripe/ACH invoicing, CRM lead nurturing, and calendar booking customized for maternal enterprises.',
    features: [
      'Custom CRM & Pipeline Setup (Zero Monthly Overhead)',
      'Automated Client Intake & Digital Agreement E-Signature',
      'Unified Payment Invoicing & Co-op Ledger Integration',
      'Automated SMS & Email Client Reminder Sequences',
      'Full Video Training Library & Hand-Off Documentation'
    ],
    idealFor: 'Doulas, Master Herbalists, Homeschool Co-op Founders, and Artisan Producers ready to scale past 6-figures.',
    affiliateCommissionAmount: '$700 – $1,050 per closed referral (20%–30%)',
    deliverables: [
      'Self-Hosted or Low-Overhead CRM Stack',
      'Automated Client Intake Workflow Blueprint',
      'Custom Branded Client Portal',
      '60-Day Technical Maintenance Guarantee'
    ]
  },
  {
    id: 'sc-serv-2',
    title: 'High-Ticket Automation Discovery Sprint',
    tagline: 'Pinpoint and eliminate 15+ weekly hours of manual administrative drag.',
    tier: 'Fast-Track Sprint',
    price: '$950',
    duration: '5-Day Intensive Sprint',
    description: 'A surgical audit of your household or trade workflow. We map every manual task, build 3 mission-critical automated pipelines, and eliminate bottlenecks so you can focus on nurturing your children.',
    features: [
      'Comprehensive Operations & Systems Audit (90-Min Deep Dive)',
      '3 Custom High-Impact Automated Workflows (Zapier/Make/Webhooks)',
      'Digital Lead Capture & Automated Email Follow-Up Funnel',
      'Standard Operating Procedure (SOP) Loom & PDF Manual'
    ],
    idealFor: 'Solopreneur mothers and growing home enterprises seeking rapid breathing room.',
    affiliateCommissionAmount: '$190 – $285 per closed referral (20%–30%)',
    deliverables: [
      'Systems Audit Scorecard & Bottleneck Report',
      '3 Functional Automated Workflows Deployed',
      'SOP Handover Document'
    ]
  },
  {
    id: 'sc-serv-3',
    title: 'Fractional Chief Automation Officer (CAO)',
    tagline: 'Ongoing systems architecture, funnel optimization, and technical sovereignty.',
    tier: 'Fractional COO Automation',
    price: '$1,800 / month',
    duration: '3-Month Retainer',
    description: 'Dedicated weekly systems engineering, private database architecture, custom AI-agent integrations, and recurring tech support for established community hubs.',
    features: [
      'Unlimited Workflow Automation Builds & Maintenance',
      'Bi-Weekly Strategic Systems Optimization Calls',
      'Private AI Workflow & Document Processing Setup',
      'Emergency System Uptime & API Monitoring'
    ],
    idealFor: 'Matriarchal Cooperatives, Academy Platforms, and Multi-Location Homestead Businesses.',
    affiliateCommissionAmount: '$360 – $540 monthly recurring per referral (20%–30%)',
    deliverables: [
      'Dedicated Slack / Sanctuary Channel Support',
      'Monthly Automation ROI Analytics Report',
      'Priority Turnaround on All Technical Builds'
    ]
  }
];

export const MOTHERHOOD_AFFILIATE_TIERS: MotherhoodAffiliateTier[] = [
  {
    tierName: 'Tier 1: Sprouting Mother Advocate',
    level: 1,
    commissionRate: 20,
    rateLabel: '20% Flat Commission',
    requirement: 'Open to all verified Copper Mommies members in good standing',
    perks: [
      'Personalized tracking link & custom promo discount code ($100 off for your clients)',
      'Access to Motherhood Affiliate Resource Vault & copy-paste social scripts',
      'Bi-weekly direct bank transfer / Wise payout on all closed engagements'
    ],
    badgeColor: 'border-copper-penny/40 text-copper-penny bg-copper-penny/10'
  },
  {
    tierName: 'Tier 2: Matriarch Partner',
    level: 2,
    commissionRate: 25,
    rateLabel: '25% Elevated Commission',
    requirement: 'Unlocked after 3 successful client introductions ($1,500+ total earned)',
    perks: [
      'Elevated 25% payout rate on all one-time and retainer packages',
      'Custom co-branded landing page with your photo and mother bio',
      'Free 1-on-1 Business Automation Audit for your own household enterprise ($950 value)'
    ],
    badgeColor: 'border-[#B87333] text-[#B87333] bg-[#B87333]/15'
  },
  {
    tierName: 'Tier 3: Elder Village Ambassador',
    level: 3,
    commissionRate: 30,
    rateLabel: '30% Maximum Sovereign Commission',
    requirement: 'Unlocked after 8+ successful referrals or regional district leadership',
    perks: [
      'Premier 30% commission rate across all high-ticket automation programs',
      'Recurring 30% monthly clip on all Fractional CAO monthly retainers',
      'Direct revenue-share pool on custom enterprise white-label software solutions',
      'VIP quarterly strategic retreat invitation with SC Automated leadership'
    ],
    badgeColor: 'border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/15'
  }
];

export const SAMPLE_AFFILIATE_LEADS: SimulatedAffiliateLead[] = [
  {
    id: 'lead-1',
    clientName: 'Sister Maya — Lowcountry Indigo Textiles',
    servicePackage: 'Sovereign Business Operations Stack ($3,500)',
    contractValue: 3500,
    commissionPercent: 25,
    commissionEarned: 875,
    status: 'Closed & Paid',
    date: 'Sept 04, 2026'
  },
  {
    id: 'lead-2',
    clientName: 'Dr. Kimberly — Holistic Pediatric Care',
    servicePackage: 'Fractional Chief Automation Officer ($1,800/mo)',
    contractValue: 1800,
    commissionPercent: 25,
    commissionEarned: 450,
    status: 'Closed & Paid',
    date: 'Aug 28, 2026'
  },
  {
    id: 'lead-3',
    clientName: 'Mama Danielle — Highland Heritage Seeds',
    servicePackage: 'High-Ticket Automation Discovery Sprint ($950)',
    contractValue: 950,
    commissionPercent: 20,
    commissionEarned: 190,
    status: 'Proposal Sent',
    date: 'Sept 10, 2026'
  },
  {
    id: 'lead-4',
    clientName: 'Sister Brenda — Midwifery & Lying-In Haven',
    servicePackage: 'Sovereign Business Operations Stack ($3,500)',
    contractValue: 3500,
    commissionPercent: 25,
    commissionEarned: 875,
    status: 'Discovery Call Booked',
    date: 'Sept 12, 2026'
  }
];

export const MARKETING_SWIPE_COPIES: MarketingSwipeCopy[] = [
  {
    id: 'swipe-1',
    category: 'Instagram / Social Post',
    title: 'The Exhausted Mother Business Owner Paradox',
    hook: 'You did not leave the 9-to-5 just to spend 25 hours a week trapped in your email inbox.',
    body: 'As homeschooling mothers building family trades, our most precious currency is unhurried presence with our children.\n\nWhen I finally automated my client onboarding, contract signatures, and payment receipts with SC Automated Solutions, I got back 14 hours every single week. No more chasing invoices. No more manual scheduling headaches.\n\nIf you run a doula practice, wellness clinic, or homeschool cooperative, you need systems that serve you—not the other way around.\n\nUse my partner link to claim a complimentary 30-minute Workflow Audit and get $100 off your custom stack implementation.',
    cta: 'Tap the link in my bio or message me "AUTOMATE" to review the blueprint.'
  },
  {
    id: 'swipe-2',
    category: 'WhatsApp / SMS Message',
    title: 'Sister-to-Sister Private Message',
    hook: 'Peace sister! Thinking of you and your business...',
    body: 'Hey love! I know how slammed you’ve been juggling the kids\' lessons and keeping up with all your custom client orders. I worked with the sisters at SC Automated Solutions to streamline my whole inquiry and booking flow, and it was a complete game changer. They specialize in helping mothers build zero-touch systems so the business runs even when you are tending your home and family.\n\nHere is my VIP link to check out their sovereign consulting stack (it includes a $100 village discount): {YOUR_REFERRAL_LINK}. Let me know if you book an audit—I’d love to celebrate with you!',
    cta: 'Click your sister referral link above.'
  },
  {
    id: 'swipe-3',
    category: 'Direct Email / Letter',
    title: 'Formal Co-op / Partner Recommendation Email',
    hook: 'Subject: A sustainable systems recommendation for your growing practice',
    body: 'Dear [Name],\n\nRunning a community-centered trade while raising children requires ruthless protection of your energy. Over the last year, many sisters in our circle have struggled with administrative burnout—managing spreadsheets, sending manual reminder emails, and losing track of client records.\n\nSC Automated Solutions builds high-ticket, bespoke automation architectures specifically tailored for sovereign, maternal-led organizations. They eliminate software bloat, unify client records in secure encrypted environments, and automate recurring billing seamlessly.\n\nI highly recommend booking their 30-minute Discovery Audit here: {YOUR_REFERRAL_LINK}.\n\nWarmly in Sisterhood,\n[Your Name]',
    cta: 'Book your complimentary systems audit using the referral link.'
  }
];

// --------------------------------------------------------------------------
// 2. NESTBRIGHT ACADEMY DATA & 4TH GRADE CURRICULUM
// --------------------------------------------------------------------------
export const NESTBRIGHT_TIERS: NestBrightTierInfo[] = [
  {
    id: 'free-beta',
    name: 'Sister Co-Op Beta Access',
    price: '100% Free',
    billingPeriod: 'Complimentary for Verified Copper Mommies',
    badge: 'Beta Co-Op Tier',
    description: 'Immediate community access to weekly standards-aligned core lesson slides, daily integrated word match games, and printable offline worksheets.',
    features: [
      'Access to 4th Grade Math & Science Weekly Slide Decks',
      'Daily Integrated Word Match Vocabulary Game',
      '1 Interactive Manipulative Activity per Day',
      'Downloadable Offline Worksheets & Practice Packs',
      'Community Sisterhood Homeschool Co-op Discussion Board'
    ],
    ctaLabel: 'Activate Free Beta Access',
    popular: false
  },
  {
    id: 'scholar-tier',
    name: 'Full NestBright Scholar Access',
    price: '$14.99',
    billingPeriod: 'per month (Regular $24.99/mo — 40% Village Subsidy)',
    badge: 'Comprehensive Mastery',
    description: 'Complete elementary mastery platform for Grades 3–5 featuring automated mastery tracking, deep interactive manipulatives, and full standard alignment.',
    features: [
      'Everything in Free Beta Access, PLUS:',
      'All 10 Interactive Slides per Subtopic with Real-Time Feedback',
      'Automated Quiz Engine with Instant Distractor Analysis',
      'Interactive Frameless Vector Math Models (Base-Ten, Fractions, Coordinate Grids)',
      'Parent Progress Dashboard & State Standard Mastery Reporting (IXL & CK-12 aligned)',
      'Priority Entry for the 5 Full Annual Scholarship Draws'
    ],
    ctaLabel: 'Enroll Scholar ($14.99/mo)',
    popular: true
  }
];

export const NESTBRIGHT_4TH_GRADE_SLIDES: NestBrightSlideLesson[] = [
  {
    slideNumber: 1,
    title: 'Multi-Digit Place Value Mastery: The Power of Ten',
    slideType: 'Core Concept',
    gradeLevel: 'Grade 4',
    subject: 'Math: Place Value & Multi-Digit Operations',
    learningObjective: 'Recognize that in a multi-digit whole number, a digit in one place represents ten times what it represents in the place to its right (CCSS.MATH.CONTENT.4.NBT.A.1).',
    explanation: 'Every time we shift one place to the left on our place value chart, the value of that digit multiplies by exactly 10! 10 units make 1 ten-rod. 10 ten-rods make 1 hundred-flat. 10 hundred-flats build 1 thousand-cube.',
    visualModelType: 'place-value-chart',
    wordMatchGame: [
      { term: 'Digit', definition: 'Any single symbol from 0 to 9 used to write numbers.' },
      { term: 'Place Value', definition: 'The value of where a digit is in a number.' },
      { term: 'Base-Ten System', definition: 'A number system where each place value increases by a factor of 10.' },
      { term: 'Period', definition: 'A group of three digits separated by commas (Ones, Thousands, Millions).' }
    ]
  },
  {
    slideNumber: 2,
    title: 'Building Thousands: Frameless 3D Isometric Base-Ten Models',
    slideType: 'Interactive Manipulative',
    gradeLevel: 'Grade 4',
    subject: 'Math: Place Value & Multi-Digit Operations',
    learningObjective: 'Visualize concrete quantities using 3D isometric base-ten blocks floating on transparent canvas.',
    explanation: 'Notice how the 1,000 cube is built from 10 stacked 100 flats. Explore the relationship between 4 thousands, 3 hundreds, 2 tens, and 6 ones to assemble the standard number 4,326.',
    visualModelType: 'base-ten-blocks',
    interactiveData: {
      thousands: 4,
      hundreds: 3,
      tens: 2,
      ones: 6,
      standardNumber: 4326,
      expandedForm: '4,000 + 300 + 20 + 6'
    }
  },
  {
    slideNumber: 3,
    title: 'Decomposing & Comparing Numbers Up to 1,000,000',
    slideType: 'Concept Expansion',
    gradeLevel: 'Grade 4',
    subject: 'Math: Place Value & Multi-Digit Operations',
    learningObjective: 'Read and write multi-digit whole numbers using base-ten numerals, number names, and expanded form (CCSS.MATH.CONTENT.4.NBT.A.2).',
    explanation: 'When comparing two large numbers like 47,820 and 42,990, always start by comparing the highest place value column (Ten Thousands). Because both have 4 ten-thousands (40,000), we compare the Thousands column: 7 thousands is greater than 2 thousands!',
    visualModelType: 'place-value-chart'
  },
  {
    slideNumber: 4,
    title: 'Golden Rule Check: The 10x Value Rule',
    slideType: 'Golden Rule Check',
    gradeLevel: 'Grade 4',
    subject: 'Math: Place Value & Multi-Digit Operations',
    learningObjective: 'Demonstrate conceptual mastery of place-value relationships with instant feedback.',
    explanation: 'Golden Rule: Moving one step LEFT = Multiply by 10. Moving one step RIGHT = Divide by 10.',
    visualModelType: 'place-value-chart',
    practiceProblem: {
      question: 'How does the value of the 5 in 52,400 compare to the value of the 5 in 5,240?',
      options: [
        'It is 10 times greater because it is one place to the left.',
        'It is 100 times greater because it has more zeroes.',
        'It is equal because both digits are 5.',
        'It is 10 times smaller because 52 is larger.'
      ],
      correctAnswer: 0,
      hint: 'Find which place value column each 5 sits in. The first is in the Ten Thousands (50,000), and the second is in the Thousands (5,000).',
      explanation: 'Correct! 50,000 is 10 times greater than 5,000. Moving one column left on the place value chart multiplies value by 10.'
    }
  },
  {
    slideNumber: 5,
    title: 'Practice Problem 1: Expanded Form Precision',
    slideType: 'Progressive Practice',
    gradeLevel: 'Grade 4',
    subject: 'Math: Place Value & Multi-Digit Operations',
    learningObjective: 'Convert standard numbers into expanded form without dropping place-holding zeroes.',
    explanation: 'Write 804,215 in expanded notation. Remember that places with a zero do not need an added term, but keep the other places in their correct value.',
    visualModelType: 'place-value-chart',
    practiceProblem: {
      question: 'Which is the correct expanded form of 804,215?',
      options: [
        '800,000 + 4,000 + 200 + 10 + 5',
        '80,000 + 40,000 + 200 + 10 + 5',
        '800,000 + 40,000 + 200 + 15',
        '8 + 0 + 4 + 2 + 1 + 5'
      ],
      correctAnswer: 0,
      hint: 'Look at the 8 in the Hundred Thousands place (800,000) and the 4 in the Thousands place (4,000). Notice there are 0 Ten Thousands.',
      explanation: 'Excellent! 800,000 + 4,000 + 200 + 10 + 5 accurately captures every non-zero place value.'
    }
  },
  {
    slideNumber: 6,
    title: 'Practice Problem 2: Fraction Bars & Visual Equivalence',
    slideType: 'Progressive Practice',
    gradeLevel: 'Grade 4',
    subject: 'Math: Place Value & Multi-Digit Operations',
    learningObjective: 'Explain why a fraction a/b is equivalent to a fraction (n × a)/(n × b) using visual fraction models (CCSS.MATH.CONTENT.4.NF.A.1).',
    explanation: 'Look at the frameless fraction bar below. 2/4 of the strip takes up the exact same length as 1/2 of the whole unit strip.',
    visualModelType: 'fraction-bars',
    practiceProblem: {
      question: 'Which fraction is equivalent to 3/4 based on the visual model?',
      options: [
        '6/8',
        '3/8',
        '4/3',
        '2/6'
      ],
      correctAnswer: 0,
      hint: 'Multiply both the numerator and denominator by 2: (3 × 2) / (4 × 2).',
      explanation: 'Spot on! 3/4 is equivalent to 6/8 because cutting each fourth into 2 equal parts yields 6 eighths.'
    }
  },
  {
    slideNumber: 7,
    title: 'Practice Problem 3: Rounding Multi-Digit Numbers',
    slideType: 'Progressive Practice',
    gradeLevel: 'Grade 4',
    subject: 'Math: Place Value & Multi-Digit Operations',
    learningObjective: 'Use place value understanding to round multi-digit whole numbers to any place (CCSS.MATH.CONTENT.4.NBT.A.3).',
    explanation: 'To round 348,720 to the nearest ten-thousand: underline the ten-thousands digit (4), and look at the digit to its right (8). Since 8 is 5 or greater, round up!',
    visualModelType: 'place-value-chart',
    practiceProblem: {
      question: 'What is 348,720 rounded to the nearest ten-thousand?',
      options: [
        '350,000',
        '340,000',
        '349,000',
        '400,000'
      ],
      correctAnswer: 0,
      hint: 'The digit in the ten-thousands place is 4. The digit to its right is 8. Does 8 tell 4 to stay or round up to 5?',
      explanation: 'Correct! 8 is 5 or more, so the 4 ten-thousands rounds up to 5 ten-thousands (350,000).'
    }
  },
  {
    slideNumber: 8,
    title: 'Practice Problem 4: Multi-Digit Addition with Regrouping',
    slideType: 'Progressive Practice',
    gradeLevel: 'Grade 4',
    subject: 'Math: Place Value & Multi-Digit Operations',
    learningObjective: 'Fluently add multi-digit whole numbers using the standard algorithm (CCSS.MATH.CONTENT.4.NBT.B.4).',
    explanation: 'When column sums equal 10 or greater, regroup the ten into the next column to the left. 3,584 + 2,647.',
    visualModelType: 'base-ten-blocks',
    practiceProblem: {
      question: 'What is the sum of 3,584 and 2,647?',
      options: [
        '6,231',
        '6,121',
        '5,231',
        '6,221'
      ],
      correctAnswer: 0,
      hint: '4 + 7 = 11 (write 1, regroup 1). 1 + 8 + 4 = 13 (write 3, regroup 1). 1 + 5 + 6 = 12 (write 2, regroup 1). 1 + 3 + 2 = 6.',
      explanation: 'Precision work! 3,584 + 2,647 = 6,231 with three successive regroupings.'
    }
  },
  {
    slideNumber: 9,
    title: 'Practice Problem 5: Word Problem Application',
    slideType: 'Progressive Practice',
    gradeLevel: 'Grade 4',
    subject: 'Math: Place Value & Multi-Digit Operations',
    learningObjective: 'Solve multistep word problems posed with whole numbers and having whole-number answers (CCSS.MATH.CONTENT.4.OA.A.3).',
    explanation: 'The Copper Mommies seed library packed 2,450 packets of heirloom collards in the morning and 1,875 packets in the afternoon. If they distributed 3,200 packets to local homesteads, how many packets remain?',
    visualModelType: 'place-value-chart',
    practiceProblem: {
      question: 'How many seed packets remain in the cooperative seed library?',
      options: [
        '1,125 packets',
        '1,225 packets',
        '925 packets',
        '1,025 packets'
      ],
      correctAnswer: 0,
      hint: 'First add total packed: 2,450 + 1,875 = 4,325. Then subtract distributed: 4,325 - 3,200 = ?',
      explanation: 'Bravo! 4,325 packed minus 3,200 distributed leaves 1,125 seed packets safely stored in the repository.'
    }
  },
  {
    slideNumber: 10,
    title: 'Celebration of Mastery: 4th Grade Flight Path Complete!',
    slideType: 'Celebration',
    gradeLevel: 'Grade 4',
    subject: 'Math: Place Value & Multi-Digit Operations',
    learningObjective: 'Celebrate mathematical persistence and sovereign learning excellence.',
    explanation: 'You have soared through multi-digit place value, base-ten models, expanded notation, and fraction equivalence! Your sovereign academic foundation is solid.',
    visualModelType: 'celebration-trophy'
  }
];

// --------------------------------------------------------------------------
// 3. A HEALTHY ADDICTION DATA (EARTH & HEALING HUB)
// --------------------------------------------------------------------------
export const REMEDY_ALTERNATIVES_DATA: RemedyAlternative[] = [
  {
    id: 'alt-1',
    standardOTC: 'Chemical Cough Syrups & Dextromethorphan',
    standardOTCPurpose: 'Temporary cough suppression and synthetic throat numbing.',
    herbalAlternative: 'Wildcrafted Mullein, Marshmallow Root & Elderberry Elixir',
    botanicalLatin: 'Verbascum thapsus, Althaea officinalis, Sambucus canadensis',
    primaryAction: 'Demulcent, expectorant, and immune-nourishing botanical barrier.',
    whySwitch: 'Standard OTC syrups contain artificial red dyes, high-fructose corn syrup, and synthetic suppressants that shut down natural airway clearance. Ancestral herbs coat irritated mucous membranes and gently assist natural expectoration.',
    preparationMethod: 'Simmer 2 tbsp dried mullein and 1 tbsp marshmallow root in 2 cups spring water for 15 minutes. Strain through unbleached cotton and stir in 3 tbsp raw local honey and elderberry reduction.',
    safeForChildren: true,
    safeForPostpartum: true,
    amazonAffiliateIngredients: [
      {
        name: 'Organic Cut & Sifted Mullein Leaf (1 lb Bulk Bag)',
        specification: '100% Certified Organic, Non-Irradiated, Wildcrafted Herb',
        category: 'Bulk Organic Herbs',
        amazonSearchUrl: 'https://amazon.com/s?k=organic+mullein+leaf+bulk+cut+sifted&tag=coppermommies-20',
        priceEstimate: '$18.50',
        isPrimary: true
      },
      {
        name: 'Organic Marshmallow Root (1 lb Organic Root)',
        specification: 'High mucilage grade, unbleached, lab-tested purity',
        category: 'Bulk Organic Herbs',
        amazonSearchUrl: 'https://amazon.com/s?k=organic+marshmallow+root+cut+sifted&tag=coppermommies-20',
        priceEstimate: '$19.99'
      },
      {
        name: 'Amber Glass Boston Round Dropper Bottles (4 oz, Pack of 6)',
        specification: 'UV protection, calibrated glass pipettes, leak-proof seals',
        category: 'Apothecary Hardware',
        amazonSearchUrl: 'https://amazon.com/s?k=amber+glass+dropper+bottles+4oz+6pack&tag=coppermommies-20',
        priceEstimate: '$14.95'
      }
    ]
  },
  {
    id: 'alt-2',
    standardOTC: 'Synthetic NSAIDs (Ibuprofen / Naproxen Sodium)',
    standardOTCPurpose: 'Pain relief and systemic inflammation reduction.',
    herbalAlternative: 'White Willow Bark & Meadowsweet Whole-Decoction',
    botanicalLatin: 'Salix alba, Filipendula ulmaria',
    primaryAction: 'Natural plant salicins with gut-protective flavonoids and tannins.',
    whySwitch: 'Synthetic NSAIDs frequently erode the mucosal stomach lining and strain the liver. Meadowsweet and white willow bark naturally contain salicin buffered by protective botanical tannins that soothe without burning the stomach.',
    preparationMethod: 'Decoct 1 tbsp crushed white willow bark in 10 oz boiling water for 20 minutes on low heat. Add 1 tsp meadowsweet in the final 5 minutes off heat. Drink warm with raw honey.',
    safeForChildren: false,
    safeForPostpartum: true,
    contraindications: 'Avoid during active pregnancy or if allergic to aspirin.',
    amazonAffiliateIngredients: [
      {
        name: 'Organic White Willow Bark (Cut & Sifted 1 lb)',
        specification: 'Wildcrafted harvest, certified organic botanical',
        category: 'Bulk Organic Herbs',
        amazonSearchUrl: 'https://amazon.com/s?k=organic+white+willow+bark+bulk&tag=coppermommies-20',
        priceEstimate: '$16.75',
        isPrimary: true
      },
      {
        name: 'Organic Meadowsweet Herb (8 oz Bag)',
        specification: 'Whole dried leaves and floral heads',
        category: 'Bulk Organic Herbs',
        amazonSearchUrl: 'https://amazon.com/s?k=organic+meadowsweet+herb+bulk&tag=coppermommies-20',
        priceEstimate: '$14.20'
      },
      {
        name: 'Stainless Steel Double-Mesh Herb Strainer',
        specification: 'Fine mesh for clean herbal decoction filtering',
        category: 'Apothecary Hardware',
        amazonSearchUrl: 'https://amazon.com/s?k=stainless+steel+fine+mesh+tea+strainer&tag=coppermommies-20',
        priceEstimate: '$9.99'
      }
    ]
  },
  {
    id: 'alt-3',
    standardOTC: 'Petroleum Ointments & Hydrocortisone Creams',
    standardOTCPurpose: 'Eczema, diaper rash, and cracked skin barrier moisture.',
    herbalAlternative: 'Solar-Infused Calendula & Whipped Raw Mango/Tallow Balm',
    botanicalLatin: 'Calendula officinalis, Mangifera indica',
    primaryAction: 'Vulnerary, anti-microbial, deep lipid cellular restoration.',
    whySwitch: 'Petroleum jellies create a plastic-like suffocating film on delicate skin that blocks perspiration. Whole-plant calendula solar oils paired with unrefined mango butter and grass-fed tallow nourish living cells with skin-identical lipids.',
    preparationMethod: 'Slow solar-macerate dried calendula flowers in organic cold-pressed jojoba oil for 4 weeks. Gently melt with raw mango butter and organic yellow beeswax; whip until velvety cloud consistency.',
    safeForChildren: true,
    safeForPostpartum: true,
    amazonAffiliateIngredients: [
      {
        name: 'Whole Dried Organic Calendula Flowers (1 lb)',
        specification: 'Vibrant golden orange blossoms, high resin content',
        category: 'Bulk Organic Herbs',
        amazonSearchUrl: 'https://amazon.com/s?k=organic+calendula+flowers+whole+1lb&tag=coppermommies-20',
        priceEstimate: '$21.50',
        isPrimary: true
      },
      {
        name: 'Raw Unrefined Mango Butter (1 lb Block)',
        specification: '100% Pure Grade A, Expeller Pressed, Zero Fragrance',
        category: 'Cold-Pressed Oils & Waxes',
        amazonSearchUrl: 'https://amazon.com/s?k=raw+unrefined+mango+butter+1lb&tag=coppermommies-20',
        priceEstimate: '$15.99'
      },
      {
        name: 'Organic Yellow Beeswax Pellets (1 lb Triple Filtered)',
        specification: 'Clean natural honey aroma, food-grade botanical seal',
        category: 'Cold-Pressed Oils & Waxes',
        amazonSearchUrl: 'https://amazon.com/s?k=organic+yellow+beeswax+pellets+1lb&tag=coppermommies-20',
        priceEstimate: '$13.49'
      }
    ]
  },
  {
    id: 'alt-4',
    standardOTC: 'Antacid Tablets & Synthetic Proton Pump Inhibitors',
    standardOTCPurpose: 'Heartburn, digestive acidity, and pregnancy reflux.',
    herbalAlternative: 'Slippery Elm Bark & Chamomile Marshmallow Slurry',
    botanicalLatin: 'Ulmus rubra, Matricaria chamomilla',
    primaryAction: 'Mucilaginous esophageal lining protection and gastric balance.',
    whySwitch: 'Chemical antacids drastically suppress essential stomach acid required for digesting protein and absorbing iron/calcium. Slippery elm forms a protective herbal coat over the esophagus without altering healthy digestive stomach pH.',
    preparationMethod: 'Mix 1 tsp slippery elm inner bark powder with 4 oz warm pure water and a splash of chamomile tea. Sip slowly 10 minutes before meals or at bedtime.',
    safeForChildren: true,
    safeForPostpartum: true,
    amazonAffiliateIngredients: [
      {
        name: 'Pure Organic Slippery Elm Inner Bark Powder (8 oz)',
        specification: 'Harvested from certified sustainable American stands',
        category: 'Bulk Organic Herbs',
        amazonSearchUrl: 'https://amazon.com/s?k=organic+slippery+elm+bark+powder&tag=coppermommies-20',
        priceEstimate: '$22.90',
        isPrimary: true
      },
      {
        name: 'Organic Whole German Chamomile Flowers (1 lb)',
        specification: 'High essential chamazulene oil content, calming aroma',
        category: 'Bulk Organic Herbs',
        amazonSearchUrl: 'https://amazon.com/s?k=organic+german+chamomile+flowers+1lb&tag=coppermommies-20',
        priceEstimate: '$17.80'
      }
    ]
  },
  {
    id: 'alt-5',
    standardOTC: 'Synthetic Antihistamines (Diphenhydramine for Sleep / Stress)',
    standardOTCPurpose: 'Sleep induction and nervous tension relaxation.',
    herbalAlternative: 'Magnesium Chloride Flakes & Passionflower Nervous Tonic',
    botanicalLatin: 'Passiflora incarnata, Magnesium chloride hexahydrate',
    primaryAction: 'GABAergic relaxation, neuromuscular calming, deep circadian restoration.',
    whySwitch: 'Synthetic OTC sleep medications leave mothers groggy, cause morning dry mouth, and disrupt natural REM sleep. Transdermal ancient seabed magnesium paired with passionflower gently quiet mental chatter naturally.',
    preparationMethod: 'Dissolve 1 cup pure magnesium flakes into a warm foot bath with 5 drops lavender. Drink a warm 8 oz steep of passionflower and lemon balm 30 minutes before rest.',
    safeForChildren: true,
    safeForPostpartum: true,
    amazonAffiliateIngredients: [
      {
        name: 'Pure Zechstein Seabed Magnesium Chloride Flakes (2.5 lb)',
        specification: 'Ultra-pure transdermal bath grade, rapid muscle absorption',
        category: 'Apothecary Hardware',
        amazonSearchUrl: 'https://amazon.com/s?k=pure+zechstein+magnesium+flakes&tag=coppermommies-20',
        priceEstimate: '$16.99',
        isPrimary: true
      },
      {
        name: 'Organic Cut Passionflower Herb (1 lb Bulk)',
        specification: 'Wildcrafted native American vine, whole dried herb',
        category: 'Bulk Organic Herbs',
        amazonSearchUrl: 'https://amazon.com/s?k=organic+passionflower+herb+bulk&tag=coppermommies-20',
        priceEstimate: '$18.25'
      }
    ]
  }
];

export const FEATURED_HERBALISTS_DIRECTORY: FeaturedHerbalist[] = [
  {
    id: 'herb-01',
    name: 'Mother Brenda',
    honorific: 'Elder Medicine Matriarch & Master Folk Compounder',
    location: 'Decatur, GA',
    stateCode: 'GA',
    specialty: 'Postpartum Mineral Restoration & Gullah Sea Island Tonics',
    lineageTradition: 'Traditional Melanated Southern Lowcountry Folk Herbalism',
    experienceYears: 34,
    consultationFocus: 'Lying-in herb teas, postpartum perineal soaks, and mineral nettle tonics.',
    barterAccepted: true,
    bio: 'Preserving over three decades of oral folk botany passed down through coastal Georgia grandmothers. Hand-compounds every seasonal elixir in alignment with solar and lunar rhythms.',
    avatarEmoji: '🌿',
    contactEmail: 'brenda@ahealthyaddiction.coop'
  },
  {
    id: 'herb-02',
    name: 'Sister Jamila',
    honorific: 'Certified Clinical Herbalist & Maternal Doula',
    location: 'Atlanta, GA',
    stateCode: 'GA',
    specialty: 'Pediatric Respiratory Herbs & Botanical Salves',
    lineageTradition: 'American Indigenous & Traditional Appalachian Folk Medicine',
    experienceYears: 16,
    consultationFocus: 'Gentle cough elixirs, seasonal allergy teas, and skin-barrier barrier salves.',
    barterAccepted: true,
    bio: 'Passionate about returning family wellness to the kitchen stoop. Conducts community herb walks and mentors rising mothers in sterile small-batch compounding.',
    avatarEmoji: '🌸',
    contactEmail: 'jamila@ahealthyaddiction.coop'
  },
  {
    id: 'herb-03',
    name: 'Mama Danielle',
    honorific: 'Heirloom Seed Steward & Botanical Farmer',
    location: 'Asheville, NC',
    stateCode: 'NC',
    specialty: 'Whole-Plant Adaptogens & Soil Mineralization',
    lineageTradition: 'Blue Ridge Mountain Traditional Homesteading',
    experienceYears: 20,
    consultationFocus: 'Designing household medicine beds, drying rooms, and heirloom seed saving.',
    barterAccepted: true,
    bio: 'Cultivates living soil and open-pollinated medicinal botanicals across 12 mountain acres. Believes that living soil is the first and greatest medicine.',
    avatarEmoji: '🌱',
    contactEmail: 'danielle@ahealthyaddiction.coop'
  },
  {
    id: 'herb-04',
    name: 'Sister Nia',
    honorific: 'Postpartum Doula & Apothecary Compounder',
    location: 'Charleston, SC',
    stateCode: 'SC',
    specialty: 'Uterine Toning & Lactation Botanical Teas',
    lineageTradition: 'Gullah-Geechee Maternal Herb Wisdom',
    experienceYears: 12,
    consultationFocus: 'Galactagogue teas, warming bone broths, and belly binding herb wraps.',
    barterAccepted: true,
    bio: 'Specializing in the Sacred First 40 Days of maternal lying-in. Her restorative teas replenish depleted iron and support peaceful nervous systems for mothers and babies.',
    avatarEmoji: '🕊️',
    contactEmail: 'nia@ahealthyaddiction.coop'
  }
];

// --------------------------------------------------------------------------
// 4. DEVI & MOMMIE STUDIOS / DEVIN'S SPEEDWAY DATA
// --------------------------------------------------------------------------
export const COLORING_SHEETS_DATA: ColoringSheetItem[] = [
  {
    id: 'color-01',
    title: "Devin's Speedway: Turbo Charging the Solar Racer",
    series: "Devin's Speedway",
    theme: 'Clean Energy & Automotive Engineering',
    description: 'Join Devin as he inspects the solar panels on his high-speed electric racer before the Grand Speedway trials! Features large, clean line art perfect for crayons or colored pencils.',
    difficulty: 'Elementary Early Reader (Ages 4-7)',
    learningBreakPrompt: 'Brain Break Challenge: Can you do 10 speedy jumping jacks and count by 5s to 50 before you color the wheels?',
    printPdfUrl: '/printables/devins-speedway-solar-racer.pdf',
    previewThumbnail: '🏎️⚡',
    paletteTheme: ['#00EEEE', '#D4AF37', '#0047AB', '#FF4500']
  },
  {
    id: 'color-02',
    title: 'Mommie & Me: Harvesting Echinacea in the Herb Garden',
    series: 'Mommie & Me Botanical',
    theme: 'Homeschool Botany & Plant Anatomy',
    description: 'Devi and Mommie pick purple coneflowers under the morning sun with a curious honeybee flying nearby. Labeled petal, stem, root, and cone for coloring fun.',
    difficulty: 'Grade 3-5 Explorer (Ages 8-11)',
    learningBreakPrompt: 'Nature Pause: Step outdoors or look out your window. Can you find 3 different green leaf shapes in 60 seconds?',
    printPdfUrl: '/printables/mommie-and-me-echinacea.pdf',
    previewThumbnail: '🌻🐝',
    paletteTheme: ['#10B981', '#B87333', '#93A28B', '#D4AF37']
  },
  {
    id: 'color-03',
    title: 'The Sovereign Alphabet: C is for Copper & Community',
    series: 'Ancestral Heritage',
    theme: 'Early Literacy & Matriarchal Values',
    description: 'Bold ornamental letter "C" surrounded by handcrafted copper bowls, heirloom corn ears, and smiling sisterhood hands holding a shared basket.',
    difficulty: 'Elementary Early Reader (Ages 4-7)',
    learningBreakPrompt: 'Alphabet Stretch: Stand tall and curve your arms and body into the shape of a big capital letter C. Hold for 5 deep breaths!',
    printPdfUrl: '/printables/ancestral-alphabet-letter-c.pdf',
    previewThumbnail: '✨📜',
    paletteTheme: ['#B87333', '#D4AF37', '#FAF5EE', '#1F1813']
  },
  {
    id: 'color-04',
    title: "Devin's Speedway: Fuel Gauge Fraction Pit Stop",
    series: "Devin's Speedway",
    theme: 'Math & Visual Fractions Integration',
    description: 'Devin makes a pit stop to check his battery charge gauges: 1/4, 2/4 (1/2), 3/4, and 4/4 Full Tank! Color the battery cells to match the fraction gauges.',
    difficulty: 'Grade 3-5 Explorer (Ages 8-11)',
    learningBreakPrompt: 'Math Dash: If the pit crew changes 4 tires in 12 seconds, how many seconds per tire? (12 ÷ 4 = ?). Shout the answer and do 3 victory spins!',
    printPdfUrl: '/printables/devins-speedway-fractions.pdf',
    previewThumbnail: '🏁🔋',
    paletteTheme: ['#00EEEE', '#10B981', '#0047AB', '#FFFFFF']
  }
];

export const CREATIVE_EPISODES_DATA: CreativeEpisodeItem[] = [
  {
    id: 'ep-01',
    episodeNumber: 1,
    title: 'The Great Three Sisters Garden Race',
    seriesName: "Devin's Speedway Adventures",
    runtime: '8 mins 45 secs',
    synopsis: 'Devin and his trusty speedster need high-octane bio-fuel to win the rally! He visits Mommie\'s Three Sisters garden patch to discover how Corn, Beans, and Squash work as a team to create clean fuel and nutrient-rich soil.',
    educationalCore: 'Companion planting science, biological cooperation, and clean solar technology.',
    youtubeUrl: 'https://youtube.com/watch?v=DevinSpeedwayGardenRace',
    youtubeId: 'DevinSpeedwayGardenRace',
    linkedColoringSheetId: 'color-01'
  },
  {
    id: 'ep-02',
    episodeNumber: 2,
    title: 'The Mystery of the Missing Honeybee Route',
    seriesName: 'Devi & Mommie Discoveries',
    runtime: '7 mins 20 secs',
    synopsis: 'When the garden flowers stop buzzing, Devi grabs her magnifying glass and follows the flower scent trails with Mommie. Together they build a safe clay bee bath and plant sweet nectar herbs.',
    educationalCore: 'Pollination biology, environmental stewardship, and observation skills.',
    youtubeUrl: 'https://youtube.com/watch?v=DeviMommieBeeMystery',
    youtubeId: 'DeviMommieBeeMystery',
    linkedColoringSheetId: 'color-02'
  },
  {
    id: 'ep-03',
    episodeNumber: 3,
    title: 'Electric Turbos & Battery Cell Fraction Power',
    seriesName: "Devin's Speedway Adventures",
    runtime: '9 mins 10 secs',
    synopsis: 'The big championship circuit is tomorrow, but the racer\'s battery bank needs rebalancing! Devin solves fraction puzzles on the telemetry screen to unlock turbo boosts.',
    educationalCore: 'Visual fraction equivalence, electrical circuits, and persistent problem solving.',
    youtubeUrl: 'https://youtube.com/watch?v=DevinSpeedwayBatteryPower',
    youtubeId: 'DevinSpeedwayBatteryPower',
    linkedColoringSheetId: 'color-04'
  }
];

export const AMAZON_KDP_MERCH_DATA: AmazonKDPMerchItem[] = [
  {
    id: 'kdp-01',
    title: "Devin's Speedway: The Ultimate Homeschool STEM Activity & Coloring Book",
    format: 'Paperback Coloring Book',
    author: 'Devi & Mommie Studios',
    description: 'Over 65 pages of race track mazes, fraction speedometers, electric circuit diagrams, and bold coloring art designed for homeschool brain breaks and creative afternoons.',
    pageCount: 68,
    price: '$8.99',
    amazonKdpUrl: 'https://amazon.com/dp/B0DEVINSPEEDWAY?tag=coppermommies-20',
    coverImageEmoji: '🏎️📘',
    bestsellerRank: '#1 New Release in Children\'s Automotive Coloring'
  },
  {
    id: 'kdp-02',
    title: 'The Young Herbalist’s Nature Discovery Journal & Coloring Guide',
    format: 'Homeschool Study Journal',
    author: 'Devi & Mommie Studios with A Healthy Addiction',
    description: 'A guided 12-week nature journal for elementary children featuring botanical leaf-rubbing spots, 20 native American plant profiles, and drying room observation logs.',
    pageCount: 84,
    price: '$11.50',
    amazonKdpUrl: 'https://amazon.com/dp/B0NATUREHERBALIST?tag=coppermommies-20',
    coverImageEmoji: '🌿📓',
    bestsellerRank: 'Top 10 Homeschool Science Workbook'
  },
  {
    id: 'kdp-03',
    title: 'Sovereign Sisters Alphabet: American Heritage Early Reader',
    format: 'Activity Storybook',
    author: 'Devi & Mommie Studios',
    description: 'Celebrate our cultural heritage from A to Z! Each letter teaches an ancestral value, traditional foodway, or cooperative skill with charming full-page illustrations.',
    pageCount: 56,
    price: '$9.99',
    amazonKdpUrl: 'https://amazon.com/dp/B0SOVEREIGNALPHABET?tag=coppermommies-20',
    coverImageEmoji: '👑📚'
  }
];

// --------------------------------------------------------------------------
// 5. "YOUR BRAIN IS AN ASSET" BLUEPRINT DATA
// --------------------------------------------------------------------------
export const YOUR_BRAIN_IS_AN_ASSET_DATA: YourBrainIsAnAssetBlueprint = {
  title: 'Your Brain Is An Asset: Knowledge into Digital Wealth',
  author: 'SC Automated Solutions & The Copper Circle Matriarchs',
  beaconsUrl: 'https://beacons.ai/scautomatedsolutions',
  tagline: 'Transforming Motherhood Lived Experience into Sustainable, Automated Digital Wealth.',
  philosophyCore: 'For generations, women have given away their finest recipes, organizational blueprints, homeschool strategies, and healing protocols for free or traded their time dollar-for-dollar in corporate gears. "Your Brain Is An Asset" is an operational mandate: package your maternal and professional intellect into digital property that serves families worldwide while you rest, recharge, and tend your home.',
  fourTenets: [
    {
      number: '01',
      name: 'Ownership of Your Knowledge',
      tagline: 'Your lived experience has quantifiable market value.',
      practicalAction: 'Audit your natural strengths: the routines other mothers ask you about, your family meal plans, your homeschool scheduling tricks, or your organizational systems.'
    },
    {
      number: '02',
      name: 'Decouple Labor from Currency',
      tagline: 'Never sell time when you can license a system.',
      practicalAction: 'Instead of tutoring 1 child for 1 hour at $30, package your 6-week reading curriculum into a $47 digital printable workbook sold to 100 homeschool families.'
    },
    {
      number: '03',
      name: 'Zero-Overhead Automation',
      tagline: 'Let digital pipelines handle client delivery.',
      practicalAction: 'Configure automated file delivery, email onboarding, and payment receipts so customers receive their materials instantaneously without interrupting your family dinner.'
    },
    {
      number: '04',
      name: 'Intergenerational Asset Retention',
      tagline: 'Build intellectual properties your children will inherit.',
      practicalAction: 'Register trademarks, copyright manuals under private family trusts, and build recurring independent cashflow streams that safeguard family freedom.'
    }
  ],
  monetizationSteps: [
    {
      step: 1,
      title: 'Knowledge Extraction & Niche Validation',
      duration: 'Week 1',
      milestone: '1 Core Signature Problem Identified',
      checklist: [
        'List 5 problems you have personally solved in motherhood or business',
        'Verify that at least 10 other mothers in your circle have this exact pain point',
        'Define the transformation: "I help [who] achieve [result] without [frustration]"'
      ]
    },
    {
      step: 2,
      title: 'The Minimum Viable Digital Asset (MVDA)',
      duration: 'Week 2',
      milestone: '10–25 Page Actionable Guide or Template Suite',
      checklist: [
        'Format content in clean, typography-led PDF or Notion workspace template',
        'Include printable worksheets, checklists, and step-by-step instructions',
        'Price between $27 and $97 for high conversion and accessible community entry'
      ]
    },
    {
      step: 3,
      title: 'No-Code Automated Distribution Pipeline',
      duration: 'Week 3',
      milestone: 'Live Beacons / Checkout Hub with Instant Delivery',
      checklist: [
        'Connect Stripe / Merchant account to Beacons digital store',
        'Set up automated welcome email delivering the PDF link upon payment',
        'Embed Google Analytics / Meta Pixel for tracking interest'
      ]
    },
    {
      step: 4,
      title: 'Organic Inbound Traffic & Circle Advocacy',
      duration: 'Week 4',
      milestone: 'First 10 Sales Achieved Organically',
      checklist: [
        'Share transparent behind-the-scenes creation clips on social channels',
        'Provide 3 free sample pages to your local homeschool pod or sister circle',
        'Invite verified members into your affiliate circle to share in the harvest'
      ]
    },
    {
      step: 5,
      title: 'Asset Compounding & Trust Integration',
      duration: 'Ongoing',
      milestone: 'Recurring Passive Royalties & Legal Shield',
      checklist: [
        'Bundle multiple assets into higher-tier $297 masterclasses',
        'Assign copyrights to your private family trust or cooperative association',
        'Reinvest digital royalties into physical land, heirloom seeds, and gold bullion'
      ]
    }
  ]
};
