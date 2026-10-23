/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// ============================================================================
// UNIFIED MARKETPLACE & CROSS-HUB DATA STORE
// Bridges Village Commons, Economy Hub, Commerce Hub, and Gathering Circles
// Supports Multi-Photo Galleries, Category-Specific Attributes & Multi-Stage Handshakes
// ============================================================================

export type MarketplaceCategoryType = 'gig' | 'barter' | 'housing' | 'business' | 'event';

export type HandshakeStage = 'inquiry' | 'counter_offer' | 'agreed' | 'completed' | 'cancelled';

export interface MultiStageTrade {
  id: string;
  listingId: string;
  listingTitle: string;
  categoryType: MarketplaceCategoryType;
  initiatorName: string;
  initiatorLocation: string;
  recipientName: string;
  recipientLocation: string;
  currentStage: HandshakeStage;
  initialProposal: string;
  currentTerms: string; // The active agreement terms
  timeCreditHours?: number; // Time credits committed in agreement
  cashAmount?: string; // Cash portion if hybrid
  counterOfferNote?: string;
  counterOfferedBy?: string;
  agreedAt?: string;
  completedAt?: string;
  updatedAt: string;
}

export interface UnifiedListing {
  id: string;
  categoryType: MarketplaceCategoryType;
  title: string;
  description: string;
  authorName: string;
  authorRole: string;
  authorState: string;
  authorCity?: string;
  authorAvatar?: string;
  createdAt: string;
  status: 'open' | 'in_negotiation' | 'handshake_agreed' | 'completed' | 'archived';
  
  // Media Assets (Multi-Photo support with thumbnails)
  photos: string[];
  primaryCoverImage: string;
  
  // Cross-Hub Routing & Dual-Sync
  crossPostedToHub: boolean;
  originHub: 'commons' | 'commerce' | 'economy' | 'gathering';
  
  // Category-Specific Structured Details
  details: {
    // 1. Opportunities & Gigs:
    employmentType?: 'Contract' | 'Part-time' | 'Full-time' | 'Micro-Gig' | 'Volunteer';
    compensation?: string; // e.g. "$25/hr" or "2 Barter Hours / Day" or "Hybrid"
    compensationType?: 'cash' | 'time_credit' | 'hybrid' | 'gift';
    remoteOrInPerson?: 'Remote' | 'On-Site' | 'Hybrid';
    requirements?: string[];
    duties?: string[];
    applicationMethod?: string;
    
    // 2. Goods, Produce & Barter:
    barterType?: 'Service Exchange' | 'Item Swap' | 'Copper Trade' | 'Copper Gift';
    tradeForWishlist?: string; // e.g. "E-bike, gardening help, or baby carrier"
    itemCondition?: 'New / Unopened' | 'Artisanal / Handmade' | 'Gently Used' | 'Heirloom';
    estimatedValue?: string;
    deliveryOrPickup?: 'Pick-up only' | 'Sister Drop-off' | 'Shipping Available' | 'Flexible' | string;
    timeCreditEquivalent?: number;
    
    // 3. Sanctuary Housing & Land:
    housingType?: 'Private Room' | 'Maternity Suite' | 'Homestead Acreage' | 'Shared Home' | 'Short-Term Haven' | string;
    bedrooms?: number;
    bathrooms?: number;
    squareFootage?: number;
    monthlyTerms?: string; // e.g. "$650/mo + 4 hrs coop childcare"
    availableDate?: string;
    amenities?: string[];
    petPolicy?: 'Pets welcome' | 'Cats only' | 'No pets' | 'Case-by-case' | string;
    laundry?: 'In-unit washer/dryer' | 'On-site shared' | 'Hookups only' | 'None';
    parking?: 'Off-street driveway' | 'Dedicated garage' | 'Street parking';
    
    // 4. Gatherings, Workshops & Circles:
    eventDate?: string;
    eventTime?: string;
    locationType?: 'in-person' | 'virtual' | 'hybrid';
    venueOrCity?: string;
    virtualLink?: string;
    participantCap?: number;
    suppliesNeeded?: string[];
    curriculumTopics?: string[];
    rsvps?: Record<string, 'going' | 'interested' | 'declined'>;
    
    // 5. Sister Businesses:
    industry?: string;
    websiteUrl?: string;
    contactEmail?: string;
    communityOffer?: string; // Special perks, barter acceptance or time-credit discounts
    servicesList?: string[];
    operatingHours?: string;
  };
}

// ============================================================================
// INITIAL SEED DATA (Rich multi-photo listings across all categories)
// ============================================================================

export const INITIAL_UNIFIED_LISTINGS: UnifiedListing[] = [
  // 1. OPPORTUNITY / GIG: Property Preservation & Homestead Care
  {
    id: 'gig-101',
    categoryType: 'gig',
    title: 'Property Preservation & Homestead Maintenance Contractors',
    description: 'We are expanding our cooperative vendor circle to care for homestead acreage and regional properties in the Atlanta metro and neighboring areas. Tasks include seasonal landscaping, secure door & window boarding, debris haul, and winterization.',
    authorName: 'Silver Wolf Property Solutions (Sister Candace)',
    authorRole: 'Homestead Lead Contractor',
    authorState: 'GA',
    authorCity: 'Stone Mountain / Atlanta',
    authorAvatar: '🐺',
    createdAt: '2 days ago',
    status: 'open',
    photos: [
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'
    ],
    primaryCoverImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
    crossPostedToHub: true,
    originHub: 'commerce',
    details: {
      employmentType: 'Contract',
      compensation: '$35 - $50/hr or Net 14 Barter Credit Split',
      compensationType: 'hybrid',
      remoteOrInPerson: 'On-Site',
      requirements: [
        'General tools and basic cleanup gear',
        'Pickup truck or trailer suitable for light yard hauling',
        'Valid state driver license and cooperative PMA standing',
        'Commitment to prompt photographic job completion records'
      ],
      duties: [
        'Seasonal perimeter lawn mowing, branch clipping & debris removal',
        'Handy sister maintenance (locks, latch repairs, weatherproofing)',
        'Taking clear before-and-after photographs for the work order record'
      ],
      applicationMethod: 'Direct inquiry via in-app handshake or contact candace.preservation@coop.net'
    }
  },

  // 2. HOUSING LISTING: Ashland Pines & Haven Suite
  {
    id: 'house-201',
    categoryType: 'housing',
    title: 'Spacious 2BR / 1BA Peaceful Sanctuary Apartment (Cats & Dogs Welcome)',
    description: 'Welcome home to our sister-owned garden apartment nestled in a quiet Stone Mountain grove. Newly remodeled kitchen with white shaker cabinetry, stainless appliances, rich oak-style flooring, and serene woodland views. Cooperative mother friendly with flexible co-care credits.',
    authorName: 'Mama Danielle & Sister Cheryl',
    authorRole: 'Circle Housing Steward',
    authorState: 'GA',
    authorCity: 'Stone Mountain',
    authorAvatar: '🏡',
    createdAt: '3 days ago',
    status: 'open',
    photos: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'
    ],
    primaryCoverImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    crossPostedToHub: true,
    originHub: 'commons',
    details: {
      housingType: 'Private Room',
      bedrooms: 2,
      bathrooms: 1,
      squareFootage: 1019,
      monthlyTerms: '$1,023/mo (or $850 + 8 hrs community garden/childcare barter)',
      availableDate: 'Immediate Move-in Available',
      amenities: [
        'Air Conditioning & Ceiling Fans',
        'In-Unit Washer/Dryer Hookups',
        'Off-Street Reserved Parking',
        'Cooperative Vegetable Garden Access',
        'High-Speed Wi-Fi Included in Utility Split'
      ],
      petPolicy: 'Pets welcome',
      laundry: 'In-unit washer/dryer',
      parking: 'Off-street driveway'
    }
  },

  // 3. BARTER ITEM: Siena Split King Adjustable Bed Frame
  {
    id: 'barter-301',
    categoryType: 'barter',
    title: 'Brand New Siena Split King Adjustable Bed Frame (Unopened)',
    description: 'Offering a brand-new in-box Siena Classic Split King adjustable bed frame with wireless remote control, dual incline, and zero-gravity massage settings. It was delivered duplicated in original unopened factory packaging. Valued at $1,198 retail.',
    authorName: 'Sister Brenda',
    authorRole: 'Verified Mother',
    authorState: 'GA',
    authorCity: 'Atlanta (Reynoldstown)',
    authorAvatar: '👑',
    createdAt: '5 days ago',
    status: 'open',
    photos: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1540518614846-7ede433c4ef7?auto=format&fit=crop&w=800&q=80'
    ],
    primaryCoverImage: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
    crossPostedToHub: true,
    originHub: 'economy',
    details: {
      barterType: 'Item Swap',
      tradeForWishlist: 'Looking to trade for a reliable commuter e-bike in great condition, or cargo trailer + heirloom pantry staples',
      itemCondition: 'New / Unopened',
      estimatedValue: '$1,198 Value',
      deliveryOrPickup: 'Pick-up only (Reynoldstown grove - fits in SUV/pickup)',
      timeCreditEquivalent: 12
    }
  },

  // 4. WORKSHOP / GATHERING: Ancestral Herbal Compounding & Seed Preservation
  {
    id: 'event-401',
    categoryType: 'event',
    title: 'Hands-on Elderberry Oxymel & Cold-Frame Seed Starting Workshop',
    description: 'Gather with Mama Corinne in our outdoor kitchen and nursery for an immersive afternoon of herbal medicine making. We will press fresh elderberry oxymel with raw sourwood honey and sow cold-hardy greens in cold frames.',
    authorName: 'Mama Corinne',
    authorRole: 'Elder Herbalist & Circle Steward',
    authorState: 'GA',
    authorCity: 'Savannah / Coastal Circle',
    authorAvatar: '🌿',
    createdAt: '1 day ago',
    status: 'open',
    photos: [
      'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=800&q=80'
    ],
    primaryCoverImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    crossPostedToHub: true,
    originHub: 'gathering',
    details: {
      eventDate: 'Saturday, Nov 14, 2026',
      eventTime: '11:00 AM - 2:30 PM EST',
      locationType: 'in-person',
      venueOrCity: 'Savannah Sanctuary Pavilion & Herb Garden',
      participantCap: 18,
      suppliesNeeded: [
        'Clean 16 oz amber glass mason jar with ring & lid',
        'Pair of clean garden shears or pruning clippers',
        'Optional: Small bag of organic ginger or cloves to share'
      ],
      curriculumTopics: [
        'Sterilization of honey and vinegar preservation mediums',
        'Extracting medicinal bioflavonoids without destroying enzymes',
        'Seed stratifying for early winter garden beds'
      ],
      rsvps: {
        'Mama Shantrece': 'going',
        'Sister Danielle': 'going',
        'Auntie Regina': 'interested'
      }
    }
  },

  // 5. SISTER BUSINESS: Indigo & Copper Loomworks
  {
    id: 'biz-501',
    categoryType: 'business',
    title: 'Indigo & Copper Loomworks: Natural Fiber Baby Wraps & Textiles',
    description: 'Handcrafted maternal wraps, nursing shawls, and organic linen goods using traditional American floor looms and indigenous botanical indigo dyes. Specially woven for comfort, sacred bonding, and durability.',
    authorName: 'Sister Maya',
    authorRole: 'Artisan Loom Steward',
    authorState: 'SC',
    authorCity: 'Beaufort',
    authorAvatar: '🧵',
    createdAt: '4 days ago',
    status: 'open',
    photos: [
      '/CopperBabySpaday.jpg',
      '/apothecary_sister_herbal.jpg'
    ],
    primaryCoverImage: '/CopperBabySpaday.jpg',
    crossPostedToHub: true,
    originHub: 'commerce',
    details: {
      industry: 'Artisan & Textiles',
      websiteUrl: 'https://indigoloom.coop',
      contactEmail: 'maya@indigoloom.coop',
      communityOffer: '🎁 20% discount on first wrap order + accepts 50% payment in Sovereign Time Credits!',
      servicesList: [
        'Custom woven baby carrier slings and wrap sizing',
        'Organic cotton botanical dye workshops',
        'Heirloom quilt restoration & patch repair'
      ],
      operatingHours: 'Mon - Fri 9:00 AM - 4:00 PM EST'
    }
  }
];

const LOCAL_STORAGE_KEY_LISTINGS = 'copper_unified_marketplace_listings_v1';
const LOCAL_STORAGE_KEY_TRADES = 'copper_unified_marketplace_trades_v1';

// ============================================================================
// STORE FUNCTIONS & SYNC DISPATCHER
// ============================================================================

export function getStoredUnifiedListings(): UnifiedListing[] {
  let list = INITIAL_UNIFIED_LISTINGS;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_LISTINGS);
    if (raw) {
      const parsed: UnifiedListing[] = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        list = parsed;
      }
    }
  } catch (e) {
    console.warn('Could not read stored unified listings:', e);
  }

  return list.map(item => {
    if (item.id === 'biz-501') {
      return {
        ...item,
        primaryCoverImage: '/CopperBabySpaday.jpg',
        photos: ['/CopperBabySpaday.jpg', '/apothecary_sister_herbal.jpg']
      };
    }
    return item;
  });
}

export function saveUnifiedListings(listings: UnifiedListing[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_LISTINGS, JSON.stringify(listings));
    window.dispatchEvent(new CustomEvent('copper_marketplace_sync', { detail: { type: 'listings_updated', listings } }));
  } catch (e) {
    console.warn('Could not save unified listings:', e);
  }
}

export function addUnifiedListing(listing: UnifiedListing): void {
  const current = getStoredUnifiedListings();
  const updated = [listing, ...current.filter(l => l.id !== listing.id)];
  saveUnifiedListings(updated);
}

export function updateUnifiedListing(id: string, updates: Partial<UnifiedListing>): void {
  const current = getStoredUnifiedListings();
  const updated = current.map(item => item.id === id ? { ...item, ...updates } : item);
  saveUnifiedListings(updated);
}

export function deleteUnifiedListing(id: string): void {
  const current = getStoredUnifiedListings();
  const updated = current.filter(item => item.id !== id);
  saveUnifiedListings(updated);
}

// ----------------------------------------------------------------------------
// Multi-Stage Trade Handshake Store
// ----------------------------------------------------------------------------

export function getStoredTrades(): MultiStageTrade[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_TRADES);
    if (raw) {
      const parsed: MultiStageTrade[] = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('Could not read stored trades:', e);
  }
  return [];
}

export function saveTrades(trades: MultiStageTrade[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_TRADES, JSON.stringify(trades));
    window.dispatchEvent(new CustomEvent('copper_marketplace_sync', { detail: { type: 'trades_updated', trades } }));
  } catch (e) {
    console.warn('Could not save trades:', e);
  }
}

export function initiateTradeHandshake(
  listing: UnifiedListing,
  initiatorName: string,
  initiatorLocation: string,
  proposalNote: string,
  timeCreditHours?: number,
  cashAmount?: string
): MultiStageTrade {
  const currentTrades = getStoredTrades();
  const newTrade: MultiStageTrade = {
    id: `trade-${Date.now()}`,
    listingId: listing.id,
    listingTitle: listing.title,
    categoryType: listing.categoryType,
    initiatorName,
    initiatorLocation,
    recipientName: listing.authorName,
    recipientLocation: listing.authorCity ? `${listing.authorCity}, ${listing.authorState}` : listing.authorState,
    currentStage: 'inquiry',
    initialProposal: proposalNote,
    currentTerms: proposalNote,
    timeCreditHours,
    cashAmount,
    updatedAt: 'Just now'
  };

  const updated = [newTrade, ...currentTrades];
  saveTrades(updated);

  // Mark listing as in negotiation
  updateUnifiedListing(listing.id, { status: 'in_negotiation' });
  return newTrade;
}

export function submitCounterOffer(
  tradeId: string,
  counterOfferNote: string,
  counterOfferedBy: string,
  newTimeCredits?: number
): void {
  const currentTrades = getStoredTrades();
  const updated = currentTrades.map(trade => {
    if (trade.id === tradeId) {
      return {
        ...trade,
        currentStage: 'counter_offer' as HandshakeStage,
        counterOfferNote,
        counterOfferedBy,
        currentTerms: counterOfferNote,
        timeCreditHours: newTimeCredits ?? trade.timeCreditHours,
        updatedAt: 'Just now'
      };
    }
    return trade;
  });
  saveTrades(updated);
}

export function acceptTradeHandshake(tradeId: string): void {
  const currentTrades = getStoredTrades();
  const updated = currentTrades.map(trade => {
    if (trade.id === tradeId) {
      return {
        ...trade,
        currentStage: 'agreed' as HandshakeStage,
        agreedAt: new Date().toLocaleDateString(),
        updatedAt: 'Just now'
      };
    }
    return trade;
  });
  saveTrades(updated);
}

export function completeTradeHandshake(tradeId: string): void {
  const currentTrades = getStoredTrades();
  const targetTrade = currentTrades.find(t => t.id === tradeId);
  const updated = currentTrades.map(trade => {
    if (trade.id === tradeId) {
      return {
        ...trade,
        currentStage: 'completed' as HandshakeStage,
        completedAt: new Date().toLocaleDateString(),
        updatedAt: 'Just now'
      };
    }
    return trade;
  });
  saveTrades(updated);

  if (targetTrade) {
    updateUnifiedListing(targetTrade.listingId, { status: 'completed' });
  }
}
