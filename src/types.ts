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
  
  // Copper Mommies Market Matchmaker & Commons Exchange Integration fields
  imageUrl?: string;
  hybridSplitOption?: string; // e.g. "2 dozen heirloom eggs for 1 hr garden help OR baby clothes"
  timeCreditHours?: number; // Equivalent time credit value
  crossPostedFromCommons?: boolean;
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
  
  // Part 1: Basic Demographics & Profile
  birthYear: number; // Enforce 1995 or earlier (1990 = 36 years old in 2026 timeline)
  ageRange?: string; // e.g. "36 years old"
  currentLocation: string; // City & State, e.g. "Atlanta, GA"
  childrenAndAges: string; // Maternal/Motherhood Status details
  socialHandle?: string; // e.g. "@username"
  phoneNumber: string; // e.g. "(404) 555-0192"

  // Part 2: Maternal Lineage & Indigenous Ancestry
  maternalLineageConfirmed: boolean; // Confirmed melanated American-born mother & heritage
  maternal_lineage?: string; // "Yes, I confirm both myself and maternal grandmother are American-born melanated lineage." | "Other (Lineage African, Afro-Caribbean, Asiatic, Caribbean, etc.)"
  lineage_perspective?: string; // "I lean in with curiosity and want to study the data for myself." | "I may not know much yet, but I am ready to unlearn and relearn with my sisters." | "I reject it immediately if it contradicts what I learned."
  maternalGeography?: string; // Town / County / State for birth mother and maternal grandmother
  isMotherConfirmed?: boolean; // Has birthed or raised children
  connectionStatement?: string; // Brief memory, tradition, or ancestral value passed down

  // Part 3: Spiritual & Ancestral Openness (Optional/Extended)
  spiritualAlignment?: 'fully_aligned' | 'open_receptive' | 'traditional_seeker';
  spiritualStatement?: string; // Receptivity to ancestral ways & open-minded spiritual discussions

  // Part 3 / Vocation, Trade, Barter Gifts & Community Contribution
  currentVocation: string; // Current work / profession
  vocation_trade?: string; // Current Work / Profession
  barterContribution: string; // Products or Services provided for internal network
  barter_perks?: string; // Products or Services provided for internal network
  communityContributionTypes?: string[]; // Traditional skills, wellness/herbal, teaching, business, sisterhood support, donations, barter
  communityContributionDetails?: string; // Personal write-in description of what they bring to the community
  businessName?: string; // Business or trade name
  businessOfferings?: string; // Products or services provided
  
  // Chapter Lead / State Coordinator Vetting
  wantsToBeStateLead?: boolean; // Interested in becoming local state lead
  stateLeadWhy?: string; // Why she feels called to lead local chapter/pod
  stateLeadExperience?: string; // Coordination experience (workplace, community, informal, eager to learn)
  stateLeadGroundSupport?: string; // Local ground support & meetup assistance (spots, venue/space, online only)
  stateLeadPeopleManagement?: string; // People management / team leadership experience
  stateLeadConflictApproach?: string; // Approach to keeping peace and calm leadership
  stateLeadStatus?: 'certified_candidate' | 'on_hold' | 'declined' | 'not_applied';

  // Part 4: Private Membership Association (PMA) Covenant
  pma_declaration?: boolean; // Must be checked true
  code_of_conduct?: boolean; // Must be checked true
  agreedToPmaCovenant: boolean; // Agreement to 508/PMA private association
  agreedToCodeOfConduct: boolean; // Agreement to sisterhood code of conduct

  // Compatibility & Legacy fields
  isMotherOrGuardian?: boolean;
  motherhoodStatus?: string;
  lineageLocation?: string;
  grandmotherBirthplace?: string;
  paternalGrandmotherBirthplace?: string;

  // Pipeline Status & Sifting Data
  status: 'pending' | 'approved' | 'denied' | 'disqualified';
  disqualificationReason?: string;
  activationToken?: string;
  activationTokenLink?: string;
  appDownloadLink?: string;
  transactionalEmailSent?: boolean;
  transactionalEmail?: {
    to: string;
    subject: string;
    body: string;
    sentAt: string;
    tokenLink: string;
    appDownloadLink: string;
  };
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
  category: 'Childcare & Doula' | 'Homestead & Farm' | 'Digital & Tech' | 'Creative & Artisan' | 'Admin & Operations' | 'Culinary & Kitchen';
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
  pageId?: 'village' | 'healing' | 'economy' | 'commerce' | 'gathering' | 'kinship' | 'all';
  active: boolean;
  categoryBadge?: string; // e.g. "Featured Homeschool Partner", "Artisan Brand Spotlight", "Cooperative Initiative"
  badge?: string;
  title: string;
  subtitle?: string;
  bannerImage?: string; // Image path or URL
  thumbnailImage?: string;
  externalLink?: string; // Direct link (e.g. nestbrightacademy.com)
  linkText?: string;
  buttonText?: string;
  description: string;
  
  // Promotion / Discount details
  promoCode?: string;
  promoHeadline?: string;
  promoDetails?: string;
  exclusiveOffer?: string;
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

export interface BusinessAdSubmission {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone?: string;
  socialHandle?: string; // Instagram / TikTok
  websiteUrl: string;
  placementType: 'header_banner' | 'commons_sidebar' | 'both_bundle';
  // Top Header Banner specs: 1200 x 300 (landscape hero ratio)
  // Commons Sidebar specs: 300 x 250 / 300 x 360 (medium rectangle / tall sponsor card)
  bannerImageUrl: string;
  headline: string;
  tagline: string;
  description: string;
  callToActionText: string;
  exclusiveDiscountCode: string; // e.g. "COPPER15"
  discountOfferText: string; // e.g. "15% off all botanical remedies for Copper Mommies"
  pricingTier: 'pioneer_free' | 'member_sidebar' | 'member_header' | 'sidebar_monthly' | 'header_monthly' | 'bundle_monthly';
  pricingAmount: string; // "$0 (Pioneer 30-Day Pass)" | "$5/mo (Member Spotlight)" | "$15/mo (Member Header)" | "$25/mo" | "$50/mo" | "$65/mo"
  singleMelanatedWomanOwnedConfirmed: boolean;
  status: 'pending_review' | 'approved_live' | 'rejected';
  rejectionNote?: string;
  targetCategory?: string; // e.g. "Botanicals & Wellness", "Homeschool & Learning", "Artisan Crafts", "Services"
  submittedAt: string;
  approvedAt?: string;
  viewsCount?: number;
  clicksCount?: number;
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
  title?: string;
  headline?: string;
  message?: string;
  detail?: string;
  urgency?: 'normal' | 'high' | 'critical' | 'celebration';
  active: boolean;
  targetHub?: 'all' | 'village' | 'healing' | 'economy' | 'commerce' | 'gathering' | 'kinship';
  targetState?: string;
  category?: string;
  actionLink?: string;
  actionUrl?: string;
  actionText?: string;
  createdAt?: string;
  publishedAt?: string;
  pinnedBy?: string;
  priority?: 'normal' | 'high' | 'critical';
  colorTheme?: 'gold' | 'copper' | 'emerald' | 'rose' | 'slate';
}

export interface BarterDisputeRecord {
  id: string;
  tradeId?: string;
  barterTitle: string;
  claimantName: string;
  respondentName: string;
  disputeType: 'Incomplete Transfer' | 'Point Value Mismatch' | 'Damaged/Expired Remedy' | 'No-Show at Meetup' | 'Honorary Community Grant';
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
export type HearthMoodId = 'reflection' | 'community' | 'study' | 'ancestral' | 'mauve';

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
  question?: string;
  description?: string;
  category: PollCategory;
  options: PollOption[];
  totalVotes?: number;
  votedUserIds?: string[];
  isOpen?: boolean;
  active?: boolean;
  isFeatured?: boolean;
  featuredOnCasualCorner?: boolean;
  expiresAt?: string;
  closesAt?: string;
  createdAt?: string;
  creatorName?: string;
  creatorRole?: string;
  allowCustomSuggestions?: boolean;
  isCrowdfundedClass?: boolean;
  crowdfundGoal?: number;
  crowdfundRaised?: number | string;
  memberSuggestions?: any[];
  announcementText?: string;
  targetLink?: string;
  winningOptionId?: string;
}

// ==========================================
// VILLAGE COMMONS INTERFACES
// ==========================================

export type CommonsForumTopic = 
  | 'herbal-remedies' 
  | 'birth-postpartum' 
  | 'homeschool-nestbright' 
  | 'homestead-seeds' 
  | 'wealth-strategies' 
  | 'daily-uplift'
  | 'open-stream'
  | 'general';

export interface CommonsPostComment {
  id: string;
  authorName: string;
  authorAvatar?: string;
  authorLocation: string;
  content: string;
  createdAt: string;
}

export interface CommonsPost {
  id: string;
  authorName: string;
  authorRole: 'Verified Mother' | 'Circle Host' | 'Circle Lead (Admin)' | 'Council Grandmother';
  authorState: string;
  authorCity: string;
  authorAvatar?: string;
  topic: CommonsForumTopic;
  postType?: 'giveaway' | 'barter' | 'announcement' | 'discussion';
  title?: string;
  content: string;
  imageUrl?: string;
  likesCount: number;
  likedBy: string[];
  comments: CommonsPostComment[];
  createdAt: string;
  isFlagged?: boolean;
  reportCount?: number;
  reportedBy?: string[];
  reportReason?: string;
  reportNotes?: string;
  reportedAt?: string;
  isRemovedByAdmin?: boolean;
  isAutoFlaggedByFilter?: boolean;
  filterTriggerWords?: string[];
  filterTriggerCategory?: string;
  filterSeverity?: 'low' | 'medium' | 'high' | 'critical';
}

export interface CommonsExchangeItem {
  id: string;
  title: string;
  description: string;
  type: 'free' | 'barter' | 'time-credit';
  category: 'Baby & Toddler' | 'Homeschool Books & Supplies' | 'Homestead & Farm' | 'Herbal Remedies' | 'Furniture & Household' | 'Clothing & Apparel';
  imageUrl: string;
  locationCity: string;
  locationState: string;
  distanceMiles?: number;
  terms: string; // e.g. "100% Free Gift" or "Trade for 4oz Elderberry" or "2 Hours Time-Credit"
  authorName: string;
  authorContactType: 'in-app' | 'direct';
  createdAt: string;
  active: boolean;
}

export interface HousingListing {
  id: string;
  title: string;
  spaceType: 'room' | 'maternity' | 'land' | 'rental' | 'work-trade';
  transactionType: 'rent' | 'buy' | 'barter' | 'trade' | 'work-trade' | 'emergency-stay';
  pricingTerms: string; // Clearly specified: e.g. "$650/mo all utilities included" or "Work-Trade: 10 hrs/wk garden help"
  regionOrCity: string;
  stateCode: string;
  showAddressAndPhone: boolean; // Member privacy toggle
  phone?: string;
  address?: string;
  accommodatesChildren: boolean;
  childrenDetails?: string;
  privateBath: boolean;
  privateEntrance: boolean;
  landAcreage?: string;
  rulesAndExpectations: string;
  imageUrl: string;
  authorName: string;
  authorEmail?: string;
  createdAt: string;
  isVerifiedSpace?: boolean;
}

export interface VouchedBusiness {
  id: string;
  name: string;
  ownerName: string;
  industry: 'Holistic Health' | 'Doula & Midwifery' | 'Homestead & Food' | 'Artisan & Textiles' | 'Education & Childcare' | 'Professional Services';
  locationCity: string;
  locationState: string;
  website?: string;
  contactEmail: string;
  offerDescription: string;
  sisterDiscountOrBarter: string;
  imageUrl: string;
  vouchesCount: number;
  vouchedBy: string[];
  sisterTestimonials: Array<{
    id: string;
    author: string;
    text: string;
    date: string;
    vouchedProductOrService?: string;
  }>;
  isMemberOwned: boolean;
  isFeaturedSponsor: boolean;
  createdAt: string;
}

export interface CommonsEvent {
  id: string;
  title: string;
  coverImageUrl: string;
  date: string; // formatted e.g. "Sat, Oct 10, 2026"
  time: string; // e.g. "2:00 PM - 5:00 PM"
  locationType: 'in-person' | 'virtual';
  venueOrCity: string;
  stateCode: string;
  address?: string;
  virtualLink?: string;
  description: string;
  category: 'Circle Gathering' | 'Homestead & Seed Swap' | 'Herbal Workshop' | 'Maternal Celebration' | 'Homeschool Field Day';
  postedByRole: 'admin' | 'spearhead';
  postedByName: string;
  rsvps: Record<string, 'interested' | 'going' | 'declined'>;
  createdAt: string;
}

export interface SavedCommonsItem {
  id: string;
  type: 'exchange' | 'housing' | 'business' | 'event' | 'discussion';
  title: string;
  subtitle: string;
  imageUrl: string;
  categoryBadge?: string;
  location?: string;
  terms?: string;
  linkTab?: string;
}

export interface DirectChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  text: string;
  timestamp: string;
  isMe: boolean;
  isEdited?: boolean;
  isPinned?: boolean;
  reactions?: { emoji: string; count: number; reactedByMe?: boolean }[];
  replyTo?: { id: string; text: string; senderName: string };
  linkPreviewUrl?: string;
  linkPreviewTitle?: string;
  imageUrl?: string;
}

export type ChatCategory = 'all' | 'dm' | 'housing' | 'exchange' | 'jobs' | 'business' | 'academy';

export interface DirectChatThread {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar?: string;
  participantNeighborhood: string;
  participantRole?: string;
  category: 'dm' | 'housing' | 'exchange' | 'jobs' | 'business' | 'academy';
  originSectionLabel?: string; // e.g., 'Housing Haven: Garden Cottage', 'Heirloom Seed Barter', 'Homeschool Pod Gig'
  originListingId?: string;
  originListingImage?: string;
  originListingSummary?: string; // e.g., 'Offering 2 dozen heirloom eggs for seed collection'
  tradeStatus?: 'inquiring' | 'proposed' | 'accepted' | 'completed';
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isMuted?: boolean;
  isArchived?: boolean;
  messages: DirectChatMessage[];
}

export interface ChatMember {
  id: string;
  name: string;
  avatar?: string;
  neighborhood: string;
  role: string;
}

export const POPULAR_STATES = [
  { code: 'GA', name: 'Georgia (Atlanta Circle)' },
  { code: 'CA', name: 'California (Oakland Circle)' },
  { code: 'TX', name: 'Texas (Houston/Dallas Circle)' },
  { code: 'NY', name: 'New York (Brooklyn Circle)' },
  { code: 'MD', name: 'Maryland (Baltimore/Prince George\'s Circle)' },
  { code: 'VA', name: 'Virginia (Richmond Circle)' },
  { code: 'FL', name: 'Florida (Miami Circle)' },
  { code: 'NC', name: 'North Carolina (Charlotte Circle)' },
  { code: 'SC', name: 'South Carolina (Charleston Circle)' },
  { code: 'AL', name: 'Alabama (Birmingham Circle)' },
  { code: 'LA', name: 'Louisiana (New Orleans Circle)' },
  { code: 'IL', name: 'Illinois (Chicago Circle)' },
  { code: 'MI', name: 'Michigan (Detroit Circle)' },
  { code: 'OH', name: 'Ohio (Cleveland Circle)' },
  { code: 'PA', name: 'Pennsylvania (Philadelphia Circle)' }
];
