import { BroadcastBulletin, BarterDisputeRecord, HearthGatheringSession, PageSpotlightBanner } from '../types';

export const INITIAL_BROADCAST_BULLETINS: BroadcastBulletin[] = [
  {
    id: 'bulletin-01',
    title: '🌾 Spring Land Stewardship & Seed Sovereignty Drive',
    message: 'Regional seed nodes are active in GA, TX, NC, and SC! Sisters can request heirloom okra, collard, and indigo seeds with free co-op delivery.',
    urgency: 'high',
    active: true,
    targetHub: 'all',
    actionLink: '#kinship',
    actionText: 'Explore Seed Vault',
    createdAt: 'Today, 9:00 AM',
    pinnedBy: 'Mother Bessie (Grandmother Council)',
    colorTheme: 'gold'
  },
  {
    id: 'bullet-02',
    title: '🕯️ Casual Corner Live Tonight: "Protecting Your Peace as a Modern Mother"',
    message: 'Join Doula Brenda & Mama Shantrece at 8:00 PM EST for an open-hearted live dialogue on managing stress, navigating life changes with kids, and setting healthy boundaries.',
    urgency: 'normal',
    active: true,
    targetHub: 'gathering',
    actionLink: '#gathering',
    actionText: 'Enter Sanctuary',
    createdAt: 'Today',
    pinnedBy: 'Mama Shantrece (GA Spearhead)',
    colorTheme: 'copper'
  },
  {
    id: 'bulletin-03',
    title: '🍲 Community Care Pod Alert: Meals Needed in Atlanta & Charleston',
    message: 'Sister Nia in Decatur & Mama Keisha in Charleston have open meal train slots for their families! Step in to deliver warm nourishing dinners.',
    urgency: 'critical',
    active: true,
    targetHub: 'village',
    actionLink: '#village',
    actionText: 'Pledge Meal Slot',
    createdAt: 'Just now',
    pinnedBy: 'Elder Council Dispatch',
    colorTheme: 'rose'
  },
  {
    id: 'bulletin-04',
    title: '🗳️ Grandmother Council Ballot Open: Q4 Learning & Workshop Topics',
    message: 'Cast your voice on upcoming live community workshops, family finances, and masterclasses in our village assembly.',
    urgency: 'normal',
    active: true,
    targetHub: 'gathering',
    actionLink: '#hearth-polls-section',
    actionText: 'Vote on Ballot',
    createdAt: 'Today',
    pinnedBy: 'Grandmother Council',
    colorTheme: 'gold'
  },
  {
    id: 'bulletin-05',
    title: '🌿 Village Apothecary Alert: Red Raspberry & Nettle Tonics Freshly Brewed',
    message: 'Organic Georgia-wildcrafted mullein lung elixirs and sacred maternal womb tonics are now compounded in the dispensary.',
    urgency: 'normal',
    active: true,
    targetHub: 'healing',
    actionLink: '#healing',
    actionText: 'View Formulary',
    createdAt: 'Today',
    pinnedBy: 'Mama Shantrece (Dispensary Lead)',
    colorTheme: 'emerald'
  },
  {
    id: 'bulletin-06',
    title: '🎟️ NestBright Academy Contest: Free Year Curriculum Passes Available',
    message: 'Learn about our partnership with NestBrightAcademy.com for Grades 3-5 homeschool families and grab voucher codes!',
    urgency: 'high',
    active: true,
    targetHub: 'kinship',
    actionLink: '#kinship',
    actionText: 'View Vouchers',
    createdAt: 'Today',
    pinnedBy: 'Matriarch Desk',
    colorTheme: 'copper'
  }
];

export const INITIAL_DISPUTES: BarterDisputeRecord[] = [
  {
    id: 'disp-01',
    tradeId: 'trade-8012',
    barterTitle: '3x Organic Elderberry & Mullien Syrup Mason Jars',
    claimantName: 'Sister Keisha (MD)',
    respondentName: 'Sister Maya (GA)',
    disputeType: 'Incomplete Transfer',
    description: 'Exchange was agreed for 4 yards woven cotton fabric, but only 1 jar arrived sealed. Seeking adjustment of remaining 1.5 time credits or replacement jar.',
    status: 'Open Dispute',
    requestedAdjustmentHours: 1.5,
    evidenceNotes: 'Post tracking confirms damaged seal on transit. Dual handshake was paused by buyer.',
    elderDecision: ''
  },
  {
    id: 'disp-02',
    tradeId: 'trade-9411',
    barterTitle: '2-Hour Homeschool Grade 4 Math Tutoring',
    claimantName: 'Mother Clara (AL)',
    respondentName: 'Sister Nia (TX)',
    disputeType: 'Honorary Community Grant',
    description: 'Sister Nia went above and beyond preparing custom geometry manipulatives for Clara’s twins. Seeking honorary Elder Honor grant of +3.0 credits.',
    status: 'Under Elder Review',
    requestedAdjustmentHours: 3.0,
    evidenceNotes: 'Tutoring session logged and verified with high commendation from Alabama pod.',
    elderDecision: 'Approved pending Matriarch Desk final ledger signature.'
  },
  {
    id: 'disp-03',
    tradeId: 'trade-7723',
    barterTitle: 'Heirloom Garden Seedling Starter Tray (24 Count)',
    claimantName: 'Auntie Brenda (CA)',
    respondentName: 'Sister Althea (VA)',
    disputeType: 'No-Show at Meetup',
    description: 'Meetup was scheduled at Richmond Public Library; recipient had emergency childbirth assistance and missed the window. Seeking mutual ledger reset.',
    status: 'Resolved & Recredited',
    requestedAdjustmentHours: 2.0,
    evidenceNotes: 'Both sisters communicated via chat; mutual agreement to reschedule next weekend.',
    elderDecision: 'Ledger refunded with grace and 0 penalty.',
    resolvedAt: 'Yesterday',
    resolvedBy: 'Mother Bessie'
  }
];

export const INITIAL_HEARTH_SESSIONS: HearthGatheringSession[] = [
  {
    id: 'hearth-101',
    title: 'The Casual Corner Talk — Episode 14: Motherhood Real Talk: Beating Burnout & Protecting Family Peace',
    topic: 'Setting Healthy Boundaries, Restoring Energy, and Raising Resilient Kids from Toddlers to Teens',
    hostSister: 'Mama Jamila & Doula Brenda',
    hostRole: 'Grandmother Council & Master Herbalist',
    date: 'Thursday, Sept 18, 2026',
    time: '8:00 PM – 9:30 PM EST',
    meetingLink: 'https://meet.jit.si/CopperMommiesCasualCorner2026',
    meetingType: 'Virtual Casual Corner',
    targetState: 'ALL',
    rsvpsCount: 42,
    description: 'Unfiltered, soul-nourishing sisterhood circle discussing practical ways to prevent burnout, balance parenting at different stages, and build real community support you can rely on.',
    status: 'Scheduled'
  },
  {
    id: 'hearth-102',
    title: 'New Moon Matriarch Circle & Land Trust Briefing',
    topic: 'How 5 Sovereign Families in Georgia Pooled 22 Acres of Farm Ground',
    hostSister: 'Mother Bessie & Attorney Valerie',
    hostRole: 'Elder Land Trustee & Tribal Law Counsel',
    date: 'Sunday, Sept 21, 2026',
    time: '6:00 PM – 7:30 PM EST',
    meetingLink: 'https://meet.jit.si/CopperMommiesLandCircle',
    meetingType: 'New Moon Fire Circle',
    targetState: 'GA',
    rsvpsCount: 28,
    description: 'Learn the exact legal mechanisms of Title 26 § 508(c)(1)(a) Private Association trusts and partition sale immunity.',
    status: 'Scheduled'
  },
  {
    id: 'hearth-103',
    title: 'Homeschool Freedom & Hands-on Science Guild',
    topic: 'Building Solar Ovens & Field Botany Experiments for Grades 3-5',
    hostSister: 'Sister Althea (VA)',
    hostRole: 'Homeschool Guild Curator',
    date: 'Tuesday, Sept 23, 2026',
    time: '4:00 PM – 5:00 PM EST',
    meetingLink: 'https://meet.jit.si/CopperMommiesHomeschoolLive',
    meetingType: 'Homeschool Roundtable',
    targetState: 'ALL',
    rsvpsCount: 35,
    description: 'Live demonstration with printable experiment logs and grading rubrics for homeschooling mothers.',
    status: 'Scheduled'
  }
];
