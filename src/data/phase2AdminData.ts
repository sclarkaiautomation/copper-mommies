import { BroadcastBulletin, BarterDisputeRecord, HearthGatheringSession, PageSpotlightBanner } from '../types';

export const INITIAL_BROADCAST_BULLETINS: BroadcastBulletin[] = [
  {
    id: 'bulletin-01',
    title: '🌾 Spring Land Stewardship & Seed Sovereignty Drive',
    message: 'Regional seed nodes are now active in GA, TX, and SC! Sisters are invited to request heirloom okra, collard, and indigo seeds with free co-op delivery.',
    urgency: 'high',
    active: true,
    targetHub: 'all',
    actionLink: 'https://coppermommies.co/seeds',
    actionText: 'Request Seed Kit',
    createdAt: 'Today, 9:00 AM',
    pinnedBy: 'Mother Bessie (Grandmother Council)',
    colorTheme: 'gold'
  },
  {
    id: 'bulletin-02',
    title: '🕯️ Casual Corner Live Tonight: "Nourishing the Postpartum Mother"',
    message: 'Join Doula Brenda & Sister Jamila at 8:00 PM EST for an open-hearted live hearth dialogue and herbal broth tutorial.',
    urgency: 'normal',
    active: true,
    targetHub: 'gathering',
    actionLink: 'https://meet.jit.si/CopperMommiesCasualCorner2026',
    actionText: 'Join Live Room',
    createdAt: 'Yesterday',
    pinnedBy: 'Mama Jamila (GA Spearhead)',
    colorTheme: 'copper'
  },
  {
    id: 'bulletin-03',
    title: '🚨 Urgent Care Pod Notice: Respite Volunteer Needed in Atlanta',
    message: 'Sister Nia in Decatur welcomed twins and requests postpartum meal train support for this Thursday and Friday.',
    urgency: 'critical',
    active: false,
    targetHub: 'village',
    actionLink: '#',
    actionText: 'Pledge Care',
    createdAt: '2 days ago',
    pinnedBy: 'Elder Council Dispatch',
    colorTheme: 'rose'
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
    disputeType: 'Honorary Community Blessing',
    description: 'Sister Nia went above and beyond preparing custom geometry manipulatives for Clara’s twins. Seeking honorary Elder Blessing grant of +3.0 credits.',
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
    title: 'The Casual Corner Talk — Episode 14: Restoring the Sacred Postpartum',
    topic: 'Herbal Sitz Baths, Bone Broths, and 40-Day Village Rest Traditions',
    hostSister: 'Mama Jamila & Doula Brenda',
    hostRole: 'Grandmother Council & Master Herbalist',
    date: 'Thursday, Sept 18, 2026',
    time: '8:00 PM – 9:30 PM EST',
    meetingLink: 'https://meet.jit.si/CopperMommiesCasualCorner2026',
    meetingType: 'Virtual Casual Corner',
    targetState: 'ALL',
    rsvpsCount: 42,
    description: 'Unfiltered, soul-nourishing sisterhood circle unpacking ancestral postpartum seclusion, perineal recovery, and establishing a protective village barrier against outside burnout.',
    status: 'Scheduled'
  },
  {
    id: 'hearth-102',
    title: 'New Moon Matriarch Hearth & Land Trust Briefing',
    topic: 'How 5 Sovereign Families in Georgia Pooled 22 Acres of Farm Ground',
    hostSister: 'Mother Bessie & Attorney Valerie',
    hostRole: 'Elder Land Trustee & Tribal Law Counsel',
    date: 'Sunday, Sept 21, 2026',
    time: '6:00 PM – 7:30 PM EST',
    meetingLink: 'https://meet.jit.si/CopperMommiesLandHearth',
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
