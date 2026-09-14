/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Message {
  id: string;
  sender: 'user' | 'other' | 'system';
  senderName: string;
  text: string; // Decrypted content shown in UI after verification
  encryptedText: string; // Base64 simulated cyphertext
  timestamp: string;
  isEncrypted: boolean;
  stateCode: string; // Regional segregation for privacy
  aesKeyFingerprint: string; // Visual representation of E2E safety
}

export interface BarterOffer {
  id: string;
  title: string;
  description: string;
  category: 
    | 'Service Exchange' | 'Item Swap' | 'Copper Trade' | 'Copper Gift'
    | 'Holistic Wellness' | 'Homeschool' | 'Land/Wealth' | 'Garden Bounty' | 'Clean Beauty' | 'Daily Life/Pantry';
  offerBy: string;
  contact: string;
  locationState: string;
  city?: string; // Granular city / metro area
  cityZip?: string; // For proximity matching
  tradeFor?: string; // What they are bartering for
  createdAt: string;
  active: boolean;
  isLandSteward?: boolean; // Land steward flag!
  giverConfirmed?: boolean;
  recipientConfirmed?: boolean;
  handshakeComplete?: boolean;
  recipientName?: string;
  
  // Copper Mommies Market Matchmaker fields
  requestType?: 'Barter/Trade' | 'Gift/Need' | 'Skill Swap' | 'Mobility/Ride';
  valuePoints?: number; // Proposed point value
  intentTag?: 'I have' | 'I need';
  isGift?: boolean; // Flagged as IS_GIFT = TRUE for Gift/Need or Copper Gift
}

export interface HubTopic {
  id: string;
  name: string;
  description: string;
  items: Array<{
    id: string;
    title: string;
    description: string;
    author?: string;
    details?: string;
    linkText?: string;
  }>;
}

export interface HubDistrict {
  id: 'village' | 'healing' | 'economy' | 'gathering';
  name: string;
  icon: string; // lucide icon name
  description: string;
  tagline: string;
  topics: HubTopic[];
}

export interface CoopEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  hubId: 'village' | 'healing' | 'economy' | 'gathering';
  stateCode: string;
  type: 'virtual' | 'local';
}

export interface StateComplianceConfig {
  stateCode: string;
  stateName: string;
  regulationName: string; // e.g. CCPA, VCDPA, TDPSA
  privacyDisclosure: string;
  requiresExplicitConsent: boolean;
  encryptedDatabaseEnforced: boolean;
}

export interface Applicant {
  id: string;
  name: string;
  email: string;
  
  // Part 1: Basic Demographics & Birth Year Gating
  birthYear: number; // Must be 1995 or earlier
  ageRange?: string; // e.g. "30-39"
  currentLocation: string; // City & State, e.g. "Atlanta, GA"
  childrenAndAges: string; // e.g. "3 children: Ages 2, 5, and 9"
  socialHandle?: string; // e.g. "@username"
  phoneNumber: string; // e.g. "(404) 555-0192"

  // Part 2: Sacred Lineage & Motherhood Qualification
  maternalLineageConfirmed: boolean; // Confirmed melanated American-born mother & heritage
  maternalGeography: string; // Town / County / State for birth mother and maternal grandmother
  isMotherConfirmed: boolean; // Has birthed or raised children
  connectionStatement: string; // Brief memory, tradition, or ancestral value passed down

  // Part 3: Spiritual & Ancestral Openness
  spiritualAlignment: 'fully_aligned' | 'open_receptive' | 'traditional_seeker';
  spiritualStatement?: string; // Receptivity to ancestral ways & open-minded spiritual discussions

  // Part 4: Vocation, Trade & Barter Contribution
  currentVocation: string; // Current work / profession
  businessName?: string; // Business or trade name
  businessOfferings?: string; // Products or services provided
  barterContribution: string; // Skills, homemade goods, garden produce, or care she offers to the village

  // Part 5: Private Membership Association (PMA) Covenant
  agreedToPmaCovenant: boolean; // Agreement to 508/PMA private association & code of conduct
  agreedToCodeOfConduct: boolean; // Compatibility

  // Compatibility & Legacy fields
  isMotherOrGuardian?: boolean;
  motherhoodStatus?: string;
  lineageLocation?: string;
  grandmotherBirthplace?: string;
  paternalGrandmotherBirthplace?: string;

  status: 'pending' | 'approved' | 'denied';
  submittedAt: string;
  isStateSpearhead?: boolean;
  stateCode?: string;
  isStateRepresentative?: boolean;
  invitationLink?: string; // Localized invitation link issued upon approval
}

export interface GenealogyPost {
  id: string;
  title: string;
  author: string;
  content: string;
  stateCode: string;
  createdAt: string;
  category: 'records' | 'migration' | 'homesteads' | 'oral';
}

export interface BotanicalLog {
  id: string;
  activityName: string;
  category: 'intake' | 'homestead' | 'skincare';
  details: string;
  date: string;
}

export interface TimeCreditLog {
  id: string;
  activity: string;
  hours: number;
  date: string;
  type: 'earn' | 'spend';
  recipient?: string;
  provider?: string;
  status?: 'pending' | 'confirmed' | 'declined';
}

// Kinship Vault & Contribution Portal Interfaces
export interface KinshipPledge {
  id: string;
  donorName: string;
  pledgeType: 'monetary' | 'skill' | 'item';
  amount?: number; // for monetary
  details: string; // e.g. "Legal Research", "Tax Prep", etc.
  stateCode: string;
  createdAt: string;
}

export interface ExpertProfile {
  id: string;
  name: string;
  stateCode: string;
  expertTags: ('Genealogy' | 'Land Law' | 'Estate Trust')[];
  description: string;
  optIn: boolean;
}

export interface NotificationEngineEvent {
  id: string;
  queryTitle: string;
  matchedExperts: string[];
  tagMatched: 'Genealogy' | 'Land Law' | 'Estate Trust';
  timestamp: string;
}

export interface KinshipResourceNode {
  id: string;
  title: string;
  description: string;
  type: 'garden' | 'seed_node' | 'tool_library';
  stateCode: string;
  cityZip: string;
  contact: string;
  addedBy: string;
  createdAt: string;
}

// Enterprise & Commerce Hub Interfaces
export interface MommieBusiness {
  id: string;
  name: string;
  ownerName: string;
  industry: 'Holistic Health' | 'Agriculture & Homestead' | 'Artisan & Apparel' | 'Childcare & Education' | 'Professional Services' | 'Culinary & Pantry' | 'Media & Publishing';
  locationState: string;
  city: string;
  isOnline: boolean;
  description: string;
  tags: string[];
  contactEmail?: string;
  website?: string;
  communityOffer?: string; // Community perk or barter offer
  verifiedMember: boolean;
  createdAt: string;
}

export interface OpportunityJob {
  id: string;
  title: string;
  postedBy: string;
  businessName?: string;
  type: 'Gig Work' | 'Contract' | 'Part-Time' | 'Full-Time' | 'Trade Exchange' | 'Apprenticeship';
  category: 'Childcare & Doula' | 'Homestead & Farm' | 'Digital & Tech' | 'Creative & Artisan' | 'Admin & Operations' | 'Culinary & Hearth';
  locationState: string;
  isRemote: boolean;
  compensation: string;
  description: string;
  requirements: string[];
  contactEmail: string;
  createdAt: string;
  status: 'Open' | 'Filled';
}

export interface CommerceWorkshop {
  id: string;
  title: string;
  instructor: string;
  format: 'Virtual Masterclass' | 'Offline Trade Fair' | 'Pop-up Market' | 'Financial Workshop';
  date: string;
  time: string;
  location: string;
  locationState: string;
  description: string;
  rsvpCount: number;
  isVirtual: boolean;
  topics: string[];
}

export interface IncubatorResource {
  id: string;
  title: string;
  category: 'Business Formation' | 'Digital Asset Creation' | 'Automated Workflows' | 'Financial Sovereignty';
  format: 'PDF Guide' | 'Spreadsheet Template' | 'Checklist' | 'Workflow Blueprint';
  downloadSize: string;
  description: string;
  actionLabel: string;
}

// Spotlight & Featured Announcements for Member Brands, Classes, Events
export interface PageSpotlightBanner {
  id: string;
  pageId: 'village' | 'healing' | 'economy' | 'commerce' | 'gathering' | 'kinship' | 'all';
  active: boolean;
  categoryBadge: string; // e.g. "Featured Homeschool Partner", "Artisan Brand Spotlight", "Cooperative Initiative"
  title: string;
  subtitle?: string;
  bannerImage?: string; // Image path or URL
  externalLink?: string; // Direct link (e.g. nestbrightacademy.com)
  linkText?: string;
  buttonText?: string;
  description: string;
  
  // Promotion / Discount details
  promoCode?: string;
  promoHeadline?: string;
  promoDetails?: string;
  promoLink?: string;
  promoPrice?: string;
  regularPrice?: string;

  // Giveaway / Scholarship Contest details
  hasContest?: boolean;
  contestTitle?: string;
  contestSubtitle?: string;
  contestPrizeCount?: number;
  contestEligibility?: string;
  contestRequirements?: string[];
  contestDeadline?: string;
  contestInstructions?: string;

  // Contact / Inquiries
  contactEmail?: string;
  contactActionLabel?: string;
}

export interface ScholarshipEntry {
  id: string;
  spotlightId: string;
  motherName: string;
  motherEmail: string;
  motherPhone?: string;
  childName: string;
  childGrade: 'Grade 3' | 'Grade 4' | 'Grade 5';
  stateCode: string;
  learningGoals: string;
  submittedAt: string;
  verifiedStatus: 'Verified Entry' | 'Selected Winner' | 'Pending Review';
  ticketCode: string;
  notes?: string;
}

// Intergenerational Bridge & Two-Way Mentorship Interfaces
export interface IntergenerationalSisterPair {
  id: string;
  mentorName: string;
  mentorBracket: '50–60 (Wisdom Keeper)' | '40–49 (Anchor Matriarch)';
  menteeName: string;
  menteeBracket: '30–39 (Builder & Nurturer)' | '25–29 (Rising Mother)';
  giftOffer: string; // What the mentor pours in: herbal wisdom, elder guidance, calm counsel
  twoWayExchange: string; // What the mentee shares back: digital homeschool workflows, tech setups, active co-op energy
  meetingRhythm: string;
  status: 'Active Circle' | 'Accepting Sister' | 'Pending Match';
  stateCode: string;
}

// Phase 1 Enhanced Usability Types
export interface BarterComment {
  id: string;
  barterId: string;
  authorName: string;
  authorLocation?: string;
  text: string;
  createdAt: string;
  parentCommentId?: string; // For nested Q&A
  isQuickInquiry?: boolean;
}

export interface SafeMeetupSpot {
  id: string;
  name: string;
  type: 'Community Garden' | 'Public Library' | 'Homeschool Co-op Center' | 'Faith Center' | 'Park Pavilion';
  address: string;
  cityState: string;
  verifiedByElders: boolean;
  notes: string;
}

export interface ActiveTradeRecord {
  id: string;
  barterId: string;
  listingTitle: string;
  listingCategory: string;
  role: 'giver' | 'recipient' | 'trader';
  partnerName: string;
  partnerContact: string;
  status: 'Pending Negotiation' | 'Awaiting Safe Handshake' | 'Completed Exchange' | 'Cancelled';
  offeredItemOrService: string;
  requestedItemOrService: string;
  pointsValue: number;
  initiatedAt: string;
  completedAt?: string;
  meetupLocation?: string;
  scheduledDate?: string;
  giverHandshakeSigned: boolean;
  recipientHandshakeSigned: boolean;
  digitalReceiptHash?: string;
}

// Sister Profile & Micro-Storefronts (Stan/Beacons model)
export interface SisterMicroStore {
  id: string;
  sisterName: string;
  sisterHandle: string;
  birthYear: number;
  location: string;
  stateCode: string;
  bio: string;
  wisdomTier: 'Sprouting Sister' | 'Homestead Pillar' | 'Elder Wisdom Keeper';
  trustScore: number;
  barterCount: number;
  avatarEmoji: string;
  bannerTone: string;
  
  // Showcase tabs
  activeListingsCount: number;
  herbalCatalog: Array<{
    id: string;
    name: string;
    category: string;
    pointsOrBarter: string;
    description: string;
  }>;
  digitalPrintables: Array<{
    id: string;
    title: string;
    fileType: 'PDF' | 'Audio' | 'Sheet';
    description: string;
  }>;
  businessContactLinks: Array<{
    label: string;
    url: string;
    type: 'Website' | 'Email' | 'Instagram' | 'Consultation';
  }>;
}

// Sisterhood Wisdom Progression (Skool Model)
export interface WisdomBadge {
  id: string;
  title: string;
  icon: string;
  tier: 'Sprouting Sister' | 'Homestead Pillar' | 'Elder Wisdom Keeper';
  description: string;
  unlocked: boolean;
  unlockedAt?: string;
  progressPercent: number;
}

// Local Pod Urgent Care Alerts (Nextdoor/Neighbors Model)
export interface UrgentCareAlert {
  id: string;
  title: string;
  postedBy: string;
  category: 'Postpartum Meals' | 'Emergency Childcare' | 'Ride Sharing / Logistics' | 'Homestead Repair / Help' | 'Herbal / Remedy Need';
  urgencyLevel: 'Immediate (Today)' | 'Within 24 Hours' | 'This Week';
  locationArea: string;
  stateCode: string;
  description: string;
  dietaryOrSafetyNotes?: string;
  responders: Array<{
    sisterName: string;
    respondedAt: string;
    note: string;
  }>;
  status: 'Open SOS' | 'Sister Responded' | 'Fulfilled with Love';
  createdAt: string;
}

// Consultation Booking & Cal Sync (Calendly/Meetup Model)
export interface ConsultationBooking {
  id: string;
  expertName: string;
  expertRole: 'Doula & Midwife' | 'Homeschool Elder' | 'Land Trust Advisor' | 'Master Herbalist';
  clientName: string;
  durationMinutes: number;
  date: string;
  time: string;
  timeCreditsCost: number;
  topic: string;
  status: 'Confirmed' | 'Completed' | 'Cancelled';
  meetingLinkOrLocation: string;
  createdAt: string;
}

// Real-world Online-to-Offline Village: Postpartum & Emergency Meal Trains
export interface MealTrainRequest {
  id: string;
  motherName: string;
  cityState: string;
  occasion: 'Postpartum Newborn Care' | 'Family Recovery & Health' | 'Emergency Respite' | 'Homestead / Garden Day';
  story: string;
  dietaryNotes: string;
  deliveryAddressArea: string;
  neededDates: string[];
  pledgedVolunteers: Array<{
    id: string;
    sisterName: string;
    date: string;
    dishOrCare: string;
    status: 'confirmed' | 'delivered';
  }>;
  active: boolean;
  coordinatorName: string;
  stateCode: string;
}

// Real-world Local Pod Meetups & Offline Sister Circles
export interface OfflinePodMeetup {
  id: string;
  title: string;
  category: 'In-Person Tea Circle' | 'Homeschool Field Trip' | 'Heirloom Seed & Clothing Swap' | 'Homestead & Garden Day' | 'Care Squad Drop-Off';
  stateCode: string;
  locationCity: string;
  exactMeetingSpot: string;
  date: string;
  time: string;
  hostSister: string;
  description: string;
  attendingCount: number;
  bringItems: string[];
  rsvpdMembers: string[];
}

// Phase 2: Admin Command Center & Matriarch Desk Types
export interface BroadcastBulletin {
  id: string;
  title: string;
  message: string;
  urgency: 'normal' | 'high' | 'critical' | 'celebration';
  active: boolean;
  targetHub: 'all' | 'village' | 'healing' | 'economy' | 'commerce' | 'gathering' | 'kinship';
  actionLink?: string;
  actionText?: string;
  createdAt: string;
  pinnedBy: string;
  colorTheme: 'gold' | 'copper' | 'emerald' | 'rose' | 'slate';
}

export interface BarterDisputeRecord {
  id: string;
  tradeId?: string;
  barterTitle: string;
  claimantName: string;
  respondentName: string;
  disputeType: 'Incomplete Transfer' | 'Point Value Mismatch' | 'Damaged/Expired Remedy' | 'No-Show at Meetup' | 'Honorary Community Blessing';
  description: string;
  status: 'Open Dispute' | 'Under Elder Review' | 'Resolved & Recredited' | 'Dismissed';
  requestedAdjustmentHours: number;
  elderDecision?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  evidenceNotes?: string;
}

export interface HearthGatheringSession {
  id: string;
  title: string;
  topic: string;
  hostSister: string;
  hostRole: string;
  date: string;
  time: string;
  meetingLink: string;
  meetingType: 'Virtual Casual Corner' | 'New Moon Fire Circle' | 'Herbal Masterclass' | 'Homeschool Roundtable';
  targetState: string;
  rsvpsCount: number;
  description: string;
  status: 'Scheduled' | 'Live Now' | 'Completed';
}

// Hearth Moods: Sanctuary Atmosphere & Aesthetic Customization
export type HearthMoodId = 'reflection' | 'community' | 'study' | 'ancestral';

export interface HearthMoodConfig {
  id: HearthMoodId;
  name: string;
  subtitle: string;
  emoji: string;
  vibe: string;
  bgClass: string;
  meshStyle: string;
  accentColor: string;
  headerBg: string;
  tagline: string;
  orb1Class: string;
  orb2Class: string;
}

// Phase 3: Audio Sanctuary & Podcast Radio Types
export type AudioSeriesCategory = 
  | 'casual-corner' 
  | 'apothecary-snippets' 
  | 'homeschool' 
  | 'ancestral' 
  | 'live-radio';

export interface AudioTimestamp {
  timeSeconds: number;
  label: string;
  summary: string;
  attachmentNote?: string;
  remedyAnchor?: string;
}

export interface ReferencedRemedy {
  name: string;
  purpose: string;
  ingredients: string[];
  instructions: string;
  category: string;
  associatedHub?: string;
}

export interface AudioTrack {
  id: string;
  title: string;
  episodeNumber?: number;
  series: AudioSeriesCategory;
  host: string;
  hostRole: string;
  durationSeconds: number; // e.g. 1845 = ~30m45s
  audioUrl: string; // real audio or ambient web audio stream generator
  coverImage: string;
  releaseDate: string;
  description: string;
  timestamps: AudioTimestamp[];
  referencedRemedies?: ReferencedRemedy[];
  referencedNotes?: string[];
  listenCount: number;
  isFeatured?: boolean;
  likesCount: number;
  stateCode?: string;
}

export interface VoiceNoteReflection {
  id: string;
  sisterName: string;
  sisterRole: string;
  stateCode: string;
  avatar?: string;
  title: string;
  durationSeconds: number; // <= 60s
  category: 'Testimony' | 'Remedy Tip' | 'Homeschool Insight' | 'Village Inquiry';
  audioBlobUrl?: string;
  audioFrequency?: number; // for procedural synth playback
  recordedAt: string;
  likes: number;
  transcription: string;
}

export interface FiresideParticipant {
  id: string;
  name: string;
  role: string;
  stateCode: string;
  isMuted: boolean;
  isSpeaking: boolean;
  isHandRaised?: boolean;
}

export interface FiresideVoiceRoom {
  id: string;
  title: string;
  topic: string;
  category: string;
  isLive: boolean;
  hostSister: string;
  hostRole: string;
  speakers: FiresideParticipant[];
  listeners: FiresideParticipant[];
  handRaisedSisters: string[];
  activeSpeakerId?: string;
  roomType: 'Casual Corner Audio Stage' | 'Elder Council Fireside' | 'Postpartum Village Circle';
  startedAt: string;
}

// Phase 5: Sovereign Treasury & Dual-Chamber Sovereign Financial Rails
export interface VillageSkillPot {
  id: string;
  title: string;
  instructor: string;
  instructorRole: string;
  category: 'Homestead & Land' | 'Herbalism & Doula' | 'Homeschool Mastery' | 'Wealth & Estate Trusts' | 'Sovereign Tech & AI';
  goalAmount: number;
  currentRaised: number;
  backersCount: number;
  description: string;
  curriculumHighlights: string[];
  scheduledDate: string;
  status: 'active' | 'funded' | 'completed';
  recordingReady?: boolean;
  minimumPledge: number;
}

export interface ExternalVendorSpotlight {
  id: string;
  businessName: string;
  plan: 'monthly' | 'quarterly';
  price: number; // 25 or 50
  targetHub: 'village' | 'healing' | 'economy' | 'commerce' | 'gathering' | 'kinship' | 'all';
  headline: string;
  tagline: string;
  description: string;
  promoCode?: string;
  ctaUrl: string;
  ctaText: string;
  contactEmail: string;
  logoEmoji: string;
  category: string;
  status: 'active' | 'pending_review';
  createdAt: string;
  verifiedExternal: boolean;
  stripeReceiptId?: string;
}

export interface ClassifiedMicropayment {
  id: string;
  type: 'job_listing' | 'land_classified';
  fee: number; // 5 for jobs, 10 for land
  title: string;
  posterName: string;
  locationState: string;
  city: string;
  category: string;
  compensationOrPrice: string;
  description: string;
  contactEmail: string;
  phone?: string;
  stripePaymentId: string;
  createdAt: string;
  status: 'Published & Verified';
  acreageOrHours?: string;
}

export interface TeaLoveGift {
  id: string;
  donorName: string;
  tier: '$3 Cup of Herbal Mint' | '$10 Pot of Wildcrafted Goldenrod' | '$25 Matriarch Honeycomb & Clay Pot' | 'Custom Sovereign Gift';
  amount: number;
  paymentMethod: 'Stripe' | 'Cash App' | 'Zelle';
  transactionRef: string;
  note: string;
  date: string;
  isTaxExempt508: boolean;
  pmaCovenantAcknowledged: boolean;
}

export type PollCategory = 'casual-corner' | 'crowdfunded-class' | 'special-referendum' | 'village-governance';

export interface PollOption {
  id: string;
  text: string;
  votes: number;
  description?: string;
  proposer?: string;
}

export interface VillagePoll {
  id: string;
  title: string;
  question: string;
  description?: string;
  category: PollCategory;
  options: PollOption[];
  totalVotes: number;
  votedUserIds?: string[];
  isOpen: boolean;
  isFeatured: boolean;
  expiresAt?: string;
  createdAt: string;
  announcementText?: string;
  targetLink?: string;
  winningOptionId?: string;
}




