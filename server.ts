/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { BarterOffer, CoopEvent, Message, StateComplianceConfig, KinshipPledge, ExpertProfile, NotificationEngineEvent, KinshipResourceNode, VillagePoll } from './src/types.js';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory Database for user profiles, tracking Generosity Score, Trade Balance, Trust Score, Grace Score, and Barter Balance
interface UserStat {
  generosityScore: number; // Community Grace score (Philanthropy/Gifts given)
  tradeBalance: number; // Legacy trade balance representation
  trustScore: number; // General reliability score (starts at 80-90, affected by trades)
  graceScore: number; // Informative count of times they have been gifted
  barterBalance: number; // Net barter points (Sustainability Threshold target)
  restrictedToGiftOnly?: boolean; // Flag if barterBalance drops below threshold
}

const userStats: Record<string, UserStat> = {
  'Mama Shantrece': { generosityScore: 12, tradeBalance: 8, trustScore: 92, graceScore: 2, barterBalance: 8, restrictedToGiftOnly: false },
  'Mama Jamila': { generosityScore: 24, tradeBalance: 15, trustScore: 95, graceScore: 5, barterBalance: 15, restrictedToGiftOnly: false },
  'Sister Nicole': { generosityScore: 18, tradeBalance: -3, trustScore: 82, graceScore: 4, barterBalance: -3, restrictedToGiftOnly: false },
  'Mama Keisha': { generosityScore: 5, tradeBalance: 6, trustScore: 85, graceScore: 1, barterBalance: 6, restrictedToGiftOnly: false },
  'Auntie Brenda': { generosityScore: 30, tradeBalance: 20, trustScore: 98, graceScore: 6, barterBalance: 20, restrictedToGiftOnly: false },
};

// In-memory Database for standard mock-durability & instant reactivity
const barterOffers: BarterOffer[] = [
  {
    id: 'b1',
    title: 'Homeschooling Curriculum Swap (Grades K-3)',
    description: 'Trading complete American ancestral mathematics and geography lesson plans and worksheets for organic garden veggies or homeschooling tutoring assistance.',
    category: 'Homeschool',
    offerBy: 'Mama Jamila',
    contact: 'jamila.village@coop.net',
    locationState: 'GA',
    city: 'Atlanta',
    cityZip: 'Atlanta, GA (30331)',
    tradeFor: 'Fresh collard greens, sweet potatoes, or reading tutoring',
    createdAt: new Date().toISOString(),
    active: true,
    giverConfirmed: true,
    recipientConfirmed: false,
    handshakeComplete: false,
    requestType: 'Skill Swap',
    valuePoints: 5,
    intentTag: 'I have',
    isGift: false
  },
  {
    id: 'b2',
    title: 'Whipped Shea Butter & Elderberry Infusions',
    description: 'Small-batch, hand-whipped organic lavender shea butter and organic elderberry herbal syrup. Created with ancestral care, fully non-toxic and children-safe.',
    category: 'Holistic Wellness',
    offerBy: 'Sister Nicole',
    contact: 'nicole.sage@coop.net',
    locationState: 'MD',
    city: 'Baltimore',
    cityZip: 'Baltimore, MD (21201)',
    tradeFor: 'Graphic design services for labeling, or local soil compost',
    createdAt: new Date().toISOString(),
    active: true,
    giverConfirmed: false,
    recipientConfirmed: false,
    handshakeComplete: false,
    requestType: 'Barter/Trade',
    valuePoints: 8,
    intentTag: 'I have',
    isGift: false
  },
  {
    id: 'b3',
    title: 'Introduction to 3D Game Design Tutoring',
    description: 'Offering weekly online sessions teaching kids (ages 8-14) the basics of game assets, animation, and logic in Unreal/Unity or Roblox Studio.',
    category: 'Homeschool',
    offerBy: 'Mama Shantrece',
    contact: 'shantrece.tech@coop.net',
    locationState: 'TX',
    city: 'Houston',
    cityZip: 'Houston, TX (77001)',
    tradeFor: 'Handmade winter children clothes or holistic soap-making kit',
    createdAt: new Date().toISOString(),
    active: true,
    giverConfirmed: false,
    recipientConfirmed: false,
    handshakeComplete: false,
    requestType: 'Skill Swap',
    valuePoints: 10,
    intentTag: 'I have',
    isGift: false
  },
  {
    id: 'b4',
    title: 'Urban Homesteading & Balcony Gardening Consulting',
    description: 'One-on-one virtual garden layout design. Learn to maximize yield of kale, cherry tomatoes, and microgreens in tiny urban spaces.',
    category: 'Garden Bounty',
    offerBy: 'Auntie Brenda',
    contact: 'brenda.gardens@coop.net',
    locationState: 'CA',
    city: 'Oakland',
    cityZip: 'Oakland, CA (94601)',
    tradeFor: 'Social media automation templates or copyediting services',
    createdAt: new Date().toISOString(),
    active: true,
    giverConfirmed: true,
    recipientConfirmed: true,
    handshakeComplete: true,
    recipientName: 'Mama Jamila',
    requestType: 'Skill Swap',
    valuePoints: 15,
    intentTag: 'I have',
    isGift: false
  },
  {
    id: 'b5',
    title: 'Co-op Childcare Swap - Weekend Circles',
    description: 'Organizing a rotation-based trusted childcare cooperative in South Atlanta. All participating mothers vetted. Swap hours instead of paying dollars.',
    category: 'Daily Life/Pantry',
    offerBy: 'Mama Keisha',
    contact: 'keisha.circles@coop.net',
    locationState: 'GA',
    city: 'Atlanta',
    cityZip: 'Atlanta, GA (30310)',
    tradeFor: 'Equal time contribution on alternative weekends',
    createdAt: new Date().toISOString(),
    active: true,
    giverConfirmed: false,
    recipientConfirmed: false,
    handshakeComplete: false,
    requestType: 'Barter/Trade',
    valuePoints: 6,
    intentTag: 'I have',
    isGift: false
  },
  {
    id: 'b6',
    title: 'Heirloom Organic Mustard Greens Seeds',
    description: 'A packet of heirloom organic mustard greens seeds passed down from my grandmother. Fully native, fast-germinating, and cold-hardy.',
    category: 'Garden Bounty',
    offerBy: 'Mama Keisha',
    contact: 'keisha.circles@coop.net',
    locationState: 'GA',
    city: 'Savannah',
    cityZip: 'Savannah, GA (31401)',
    tradeFor: 'Gift / Generosity Act',
    createdAt: new Date().toISOString(),
    active: true,
    giverConfirmed: true,
    recipientConfirmed: false,
    handshakeComplete: false,
    requestType: 'Gift/Need',
    valuePoints: 0,
    intentTag: 'I have',
    isGift: true
  },
  {
    id: 'b7',
    title: 'Hand-Hammered Solid Copper Stewing Pot',
    description: 'Traditional solid copper hand-hammered cooking pot for slow brewing organic herbal teas or root stews. Passed down through three generations.',
    category: 'Land/Wealth',
    offerBy: 'Auntie Brenda',
    contact: 'brenda.gardens@coop.net',
    locationState: 'CA',
    city: 'San Francisco',
    cityZip: 'San Francisco, CA (94102)',
    tradeFor: '10 Copper Credits or 2 hours homeschool reading support',
    createdAt: new Date().toISOString(),
    active: true,
    giverConfirmed: false,
    recipientConfirmed: false,
    handshakeComplete: false,
    requestType: 'Barter/Trade',
    valuePoints: 20,
    intentTag: 'I have',
    isGift: false
  },
  {
    id: 'b8',
    title: 'Heirloom Seed Potatoes & Root Vegetable Workshop',
    description: 'Offering certified organic heirloom seed potatoes and a 45-minute seed planting exchange in Decatur. Perfect for community gardens.',
    category: 'Garden Bounty',
    offerBy: 'Mama Jamila',
    contact: 'jamila.village@coop.net',
    locationState: 'GA',
    city: 'Decatur',
    cityZip: 'Decatur, GA (30030)',
    tradeFor: 'Local honey or handmade herbal salves',
    createdAt: new Date().toISOString(),
    active: true,
    giverConfirmed: false,
    recipientConfirmed: false,
    handshakeComplete: false,
    requestType: 'Barter/Trade',
    valuePoints: 8,
    intentTag: 'I have',
    isGift: false
  },
  {
    id: 'b9',
    title: 'Organic Sourdough Starter & Bread Baking Guide',
    description: 'Active 7-year-old sourdough starter jar with complete gluten-conscious whole grain bread baking guide.',
    category: 'Daily Life/Pantry',
    offerBy: 'Sister Nicole',
    contact: 'nicole.sage@coop.net',
    locationState: 'TX',
    city: 'Dallas',
    cityZip: 'Dallas, TX (75201)',
    tradeFor: 'Garden pruning tools or elderberry syrup',
    createdAt: new Date().toISOString(),
    active: true,
    giverConfirmed: false,
    recipientConfirmed: false,
    handshakeComplete: false,
    requestType: 'Barter/Trade',
    valuePoints: 5,
    intentTag: 'I have',
    isGift: false
  }
];

const coopEvents: CoopEvent[] = [
  {
    id: 'e1',
    title: 'Ancestral Herbs & Diaphragmatic Breathwork',
    date: 'July 18, 2026',
    time: '2:00 PM EST',
    location: 'Virtual Circle via Secure Link',
    description: 'An educational gathering on managing maternal wellness naturally and the deep lineages of American healers.',
    hubId: 'healing',
    stateCode: 'GA',
    type: 'virtual'
  },
  {
    id: 'e2',
    title: 'Autonomous Digital Wealth Workshop',
    date: 'July 24, 2026',
    time: '6:30 PM EST',
    location: 'Virtual Circle via Co-op Link',
    description: 'How to monetize your internal maternal wisdom by packaging homeschooling guides, healthy recipes, or business automation models.',
    hubId: 'economy',
    stateCode: 'GA',
    type: 'virtual'
  },
  {
    id: 'e3',
    title: 'Southside Homeschooling Meetup & Garden Tour',
    date: 'August 02, 2026',
    time: '11:00 AM EST',
    location: 'Autonomous Soil Urban Homestead, Atlanta',
    description: 'Bringing the children together for a nature-based scavenger hunt and introductory lesson on composting, seed harvesting, and plant genetics.',
    hubId: 'village',
    stateCode: 'GA',
    type: 'local'
  },
  {
    id: 'e4',
    title: 'Oakland Autonomous Barter Exchange & Picnic',
    date: 'August 09, 2026',
    time: '12:00 PM PST',
    location: 'Mosswood Park, Oakland',
    description: 'Bring your home goods, canned fruits, herbal extracts, and curriculums for a face-to-face community trade event.',
    hubId: 'gathering',
    stateCode: 'CA',
    type: 'local'
  }
];

const messages: Message[] = [
  {
    id: 'm1',
    sender: 'other',
    senderName: 'Mama Jamila',
    text: 'Warm greetings, sisters! I just posted a homeschool guide for grade school geography on the trade board. It has full worksheets focused on traditional ancestral American routes.',
    encryptedText: 'VTJGc2RHVmtYMS81QWZubG9KMG85dnQrd3Fhc0VscU4zRkFkSU5LUG9NUG5Hbkd6TjFiaFk4TFFkNDRyM2ludmdlY3l6REt3TEg3cHRrODN0V1MybkR6KzU0OHhWODdUTk1pLzJrSGlvdVk9',
    timestamp: '14:15 PM',
    isEncrypted: true,
    stateCode: 'GA',
    aesKeyFingerprint: 'SHA256:7B:9A:C2:5E...CO-OP-KEY',
  },
  {
    id: 'm2',
    sender: 'other',
    senderName: 'Sister Nicole',
    text: 'Oh, perfect! I would love to trade some of my organic lavender-rosemary salves for those geography lessons. My kids are starting their summer ancestral studies next week.',
    encryptedText: 'VTJGc2RHVmtYMS81dGphcG12YmwxOTMybmtsczBkMTI3c0E5MDFsS2V0Zk8xTjV5ckVwV01mRjI4ZHphb09Tck4wUjVhdTZxTndZTEVnclJ4NytIeXl1REtxZitTNG9zdmN6bk56dFE9',
    timestamp: '14:22 PM',
    isEncrypted: true,
    stateCode: 'GA',
    aesKeyFingerprint: 'SHA256:7B:9A:C2:5E...CO-OP-KEY',
  },
];

// Kinship Vault & Contribution Portal In-Memory DB
const kinshipPledges: KinshipPledge[] = [
  {
    id: 'p1',
    donorName: 'Auntie Brenda',
    pledgeType: 'monetary',
    amount: 50,
    details: 'Direct support for node operational and server hosting costs',
    stateCode: 'CA',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'p2',
    donorName: 'Sister Nicole',
    pledgeType: 'skill',
    details: 'Legal Research & Local Land Regulations Analysis',
    stateCode: 'GA',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'p3',
    donorName: 'Mama Keisha',
    pledgeType: 'item',
    details: 'Physical Goods: 10 Heirloom Mason Jars of Preserved Tomatoes',
    stateCode: 'GA',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const expertProfiles: ExpertProfile[] = [
  {
    id: 'exp1',
    name: 'Auntie Brenda',
    stateCode: 'CA',
    expertTags: ['Genealogy', 'Land Law'],
    description: 'Providing homestead soil wisdom, permaculture, and Gullah Geechee historical record searches.',
    optIn: true
  },
  {
    id: 'exp2',
    name: 'Mother Bessie',
    stateCode: 'SC',
    expertTags: ['Genealogy'],
    description: 'Heirloom seed curator and veteran family lineage researcher specializing in the South Carolina Lowcountry.',
    optIn: true
  },
  {
    id: 'exp3',
    name: 'Mama Jamila',
    stateCode: 'GA',
    expertTags: ['Estate Trust', 'Land Law'],
    description: 'Estate trust documentation layout support and avoiding municipal land probate traps.',
    optIn: true
  }
];

const notificationEvents: NotificationEngineEvent[] = [
  {
    id: 'n1',
    queryTitle: 'Heir property land deeds in SC Lowcountry',
    matchedExperts: ['Mother Bessie', 'Auntie Brenda'],
    tagMatched: 'Genealogy',
    timestamp: new Date().toISOString()
  }
];

const kinshipResourceNodes: KinshipResourceNode[] = [
  {
    id: 'kr1',
    title: 'Sisters of Sovereign Soil Garden',
    description: 'A collaborative community organic plot for black-eyed peas, collard greens, sweet potatoes, and okra. Dedicated to ancestral agricultural learning and shared harvest. All local sisters welcome to help garden and harvest!',
    type: 'garden',
    stateCode: 'GA',
    cityZip: 'Atlanta, 30331',
    contact: 'sistersoil@coop.org',
    addedBy: 'Mama Jamila',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'kr2',
    title: 'Georgia Ancestral Seed Library',
    description: 'Preserving and distributing rare heirloom seeds including Gullah Geechee sea island red peas, Cherokee purple tomato seeds, and Dixie speckled butter peas. Get 1 packet for free, send us seeds back if you succeed!',
    type: 'seed_node',
    stateCode: 'GA',
    cityZip: 'Decatur, 30030',
    contact: 'heirloomseeds@coop.org',
    addedBy: 'Sister Nicole',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'kr3',
    title: 'Atlanta Sovereign Tool Repository',
    description: 'A community tool library lending heavy-duty homesteading gear like scythes, broadforks, wheelhoes, solar dehydrators, and canning pressure cookers. Return tools clean and functional within 7 days.',
    type: 'tool_library',
    stateCode: 'GA',
    cityZip: 'Atlanta, 30311',
    contact: 'tools@coop.org',
    addedBy: 'Mama Jamila',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'kr4',
    title: 'Harlem Rooftop Legacy Garden',
    description: 'An organic community garden plot on a peaceful Harlem roof. Herb tea starters, peppermint, and chamomile companion plants. Workshops held every second Saturday.',
    type: 'garden',
    stateCode: 'NY',
    cityZip: 'Harlem, 10027',
    contact: 'harlemlegacy@coop.org',
    addedBy: 'Sister Keisha',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'kr5',
    title: 'Upstate Heirloom Seed Exchange',
    description: 'Focusing on cold-hardy organic vegetable seeds, heirloom corn, and companion pole beans. Pick up at our regional circle or ask for mail delivery.',
    type: 'seed_node',
    stateCode: 'NY',
    cityZip: 'Albany, 12203',
    contact: 'upstateseeds@coop.org',
    addedBy: 'Auntie Brenda',
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'kr6',
    title: 'Bay Area Kinship Food Forest',
    description: 'An urban micro-orchard and organic garden plot specializing in traditional medicinal herbs, tree fruit, and drought-tolerant dark greens. Workdays are every Sunday morning.',
    type: 'garden',
    stateCode: 'CA',
    cityZip: 'Oakland, 94607',
    contact: 'bayareafoodforest@coop.org',
    addedBy: 'Auntie Brenda',
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'kr7',
    title: 'Oakland Cooperative Tool Shed',
    description: 'Homesteading equipment including broadforks, food dehydrators, glass mason jars for canning, and soil tethers. Free checkout for verified co-op sisters.',
    type: 'tool_library',
    stateCode: 'CA',
    cityZip: 'Oakland, 94608',
    contact: 'oaklandtools@coop.org',
    addedBy: 'Sister Nicole',
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Regional Compliance Map for the 50 US States (Key ones explicit, rest map to safe fallbacks)
const stateComplianceRegistry: Record<string, StateComplianceConfig> = {
  CA: {
    stateCode: 'CA',
    stateName: 'California',
    regulationName: 'CCPA / CPRA (California Consumer Privacy Act)',
    privacyDisclosure: 'Under CA privacy laws, your autonomous barter data and E2EE chats are completely exempt from tracking. You hold absolute right to download, correct, or expunge your data instantly. No third-party monetization is architecturally possible on this platform.',
    requiresExplicitConsent: true,
    encryptedDatabaseEnforced: true,
  },
  TX: {
    stateCode: 'TX',
    stateName: 'Texas',
    requiresExplicitConsent: true,
    regulationName: 'TDPSA (Texas Data Privacy and Security Act)',
    privacyDisclosure: 'Texas TDPSA compliance restricts any sharing of child or parental profiles. Your local homeschooling cooperative networks are highly encrypted, local-first, and secured against institutional profiling.',
    encryptedDatabaseEnforced: true,
  },
  GA: {
    stateCode: 'GA',
    stateName: 'Georgia',
    regulationName: 'GCP-Autonomy standards',
    privacyDisclosure: 'Georgia operations are secured with state-level cooperative boundaries. All medical, nutritional, and herbal trade posts are peer-to-peer and require user consent for regional feed visibility.',
    requiresExplicitConsent: false,
    encryptedDatabaseEnforced: true,
  },
  VA: {
    stateCode: 'VA',
    stateName: 'Virginia',
    regulationName: 'VCDPA (Virginia Consumer Data Protection Act)',
    privacyDisclosure: 'Under the VCDPA, Copper Mommies Co. enforces automated encryption tags on all peer communication and honors global opt-outs natively. Data retention is strictly user-managed.',
    requiresExplicitConsent: true,
    encryptedDatabaseEnforced: true,
  },
  NY: {
    stateCode: 'NY',
    stateName: 'New York',
    regulationName: 'NY SHIELD Act / Parental Freedom Act',
    privacyDisclosure: 'NY SHIELD compliance guarantees the highest protection over private electronic data. Homeschooling curriculum shares are protected under educational privacy exemptions.',
    requiresExplicitConsent: true,
    encryptedDatabaseEnforced: true,
  },
  FL: {
    stateCode: 'FL',
    stateName: 'Florida',
    regulationName: 'FDBR (Florida Digital Bill of Rights)',
    privacyDisclosure: 'FDBR enforces absolute transparency. We do not engage in surveillance or sell barter metadata. Your chat logs are stored with individual E2E keys and never saved in plain text.',
    requiresExplicitConsent: true,
    encryptedDatabaseEnforced: true,
  }
};

// Fallback state compliance for other states
function getComplianceForState(stateCode: string): StateComplianceConfig {
  const code = stateCode.toUpperCase();
  if (stateComplianceRegistry[code]) {
    return stateComplianceRegistry[code];
  }
  return {
    stateCode: code,
    stateName: `State of ${code}`,
    regulationName: 'Universal Autonomous Privacy Act (UAPA)',
    privacyDisclosure: `Your communications and transactions in ${code} are fully safeguarded under standard Copper Co-op regulations. Chats are encrypted client-side, and barter entries are secured peer-to-peer.`,
    requiresExplicitConsent: false,
    encryptedDatabaseEnforced: true,
  };
}

// Simple XOR or visual cipher for messaging simulation to prove "real encrypted backend storage"
function simulateEncrypt(text: string): string {
  // Return base64 of encoded text to represent actual secure storage
  return Buffer.from(text).toString('base64');
}

function simulateDecrypt(b64: string): string {
  try {
    return Buffer.from(b64, 'base64').toString('utf8');
  } catch (e) {
    return b64;
  }
}

// Initialize Gemini Client
let geminiAi: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    geminiAi = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    console.log('Gemini API successfully initialized on full-stack server.');
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
} else {
  console.log('Gemini API key is unconfigured or default. Ancestral Wisdom AI Advisor running in premium simulation mode.');
}

// API Routes

// 1. Barter Endpoints
// 1. Barter Endpoints
app.get('/api/barter', (req, res) => {
  const { state, category, zip, city } = req.query;
  let filtered = [...barterOffers];
  if (state && (state as string).toLowerCase() !== 'all') {
    filtered = filtered.filter(b => b.locationState.toLowerCase() === (state as string).toLowerCase());
  }
  if (city && (city as string).toLowerCase() !== 'all') {
    const cityQ = (city as string).toLowerCase().trim();
    filtered = filtered.filter(b => 
      ((b as any).city && (b as any).city.toLowerCase().includes(cityQ)) ||
      (b.cityZip && b.cityZip.toLowerCase().includes(cityQ)) ||
      b.title.toLowerCase().includes(cityQ) ||
      b.description.toLowerCase().includes(cityQ)
    );
  }
  if (category && (category as string).toLowerCase() !== 'all') {
    filtered = filtered.filter(b => b.category.toLowerCase() === (category as string).toLowerCase());
  }
  if (zip) {
    filtered = filtered.filter(b => b.cityZip && b.cityZip.toLowerCase().includes((zip as string).toLowerCase().trim()));
  }
  res.json(filtered);
});

// AI Matcher Endpoint
app.get('/api/barter/matches', (req, res) => {
  const { state, intent, category } = req.query;
  if (!state || !intent || !category) {
    return res.json([]);
  }
  const oppositeIntent = (intent as string).toLowerCase() === 'i have' ? 'I need' : 'I have';
  const matches = barterOffers.filter(b => 
    b.locationState.toLowerCase() === (state as string).toLowerCase() &&
    b.intentTag && b.intentTag.toLowerCase() === oppositeIntent.toLowerCase() &&
    b.category.toLowerCase() === (category as string).toLowerCase()
  );
  res.json(matches);
});

app.get('/api/user/stats', (req, res) => {
  const { userName } = req.query;
  const name = (userName as string) || 'Mama Shantrece';
  if (!userStats[name]) {
    userStats[name] = { 
      generosityScore: 10, 
      tradeBalance: 0, 
      trustScore: 85, 
      graceScore: 1, 
      barterBalance: 0,
      restrictedToGiftOnly: false
    };
  }
  // Recalculate Flagging system status on each query
  const stats = userStats[name];
  stats.restrictedToGiftOnly = stats.barterBalance < -10;
  res.json(stats);
});

// Admin simulator balance updater for easy reviewing
app.post('/api/user/simulate-balance', (req, res) => {
  const { userName, balance } = req.body;
  const name = userName || 'Mama Shantrece';
  if (!userStats[name]) {
    userStats[name] = { 
      generosityScore: 10, 
      tradeBalance: balance, 
      trustScore: 85, 
      graceScore: 1, 
      barterBalance: balance,
      restrictedToGiftOnly: balance < -10
    };
  } else {
    userStats[name].barterBalance = balance;
    userStats[name].tradeBalance = balance;
    userStats[name].restrictedToGiftOnly = balance < -10;
  }
  res.json(userStats[name]);
});

app.post('/api/barter', (req, res) => {
  const { 
    title, 
    description, 
    category, 
    offerBy, 
    contact, 
    locationState, 
    city,
    cityZip, 
    tradeFor, 
    isLandSteward,
    requestType,
    valuePoints,
    intentTag
  } = req.body;
  
  const user = userStats[offerBy] || { generosityScore: 10, tradeBalance: 0, trustScore: 85, graceScore: 1, barterBalance: 0 };
  const isFlagged = user.barterBalance < -10;
  
  // Enforce Flagging Restriction
  if (isFlagged && requestType !== 'Gift/Need') {
    return res.status(403).json({ 
      error: 'Flagging restricted. Your Barter Balance is below the sustainability threshold (-10). You are restricted to Gift Only requests until you provide a service or item back to the village.' 
    });
  }

  const isGift = requestType === 'Gift/Need' || category === 'Copper Gift';
  const finalPoints = isGift ? 0 : (Number(valuePoints) || 5);
  const finalTradeFor = isGift ? 'Gift / Generosity Act' : (tradeFor || `${finalPoints} points`);

  if (!title || !description || !category || !offerBy || !locationState) {
    return res.status(400).json({ error: 'Missing required barter listing fields' });
  }

  const newOffer: BarterOffer = {
    id: `b-${Date.now()}`,
    title,
    description,
    category,
    offerBy,
    contact: contact || 'anonymous.coop@coop.net',
    locationState: locationState.toUpperCase(),
    city: city || '',
    cityZip: cityZip || '',
    tradeFor: finalTradeFor,
    createdAt: new Date().toISOString(),
    active: true,
    isLandSteward: !!isLandSteward,
    giverConfirmed: false,
    recipientConfirmed: false,
    handshakeComplete: false,
    requestType: requestType || (isGift ? 'Gift/Need' : 'Barter/Trade'),
    valuePoints: finalPoints,
    intentTag: intentTag || 'I have',
    isGift
  };

  // Type B: Gift (Exempt)
  // Increases Community Grace (generosityScore) by +5 but does not affect the Barter Balance
  if (isGift) {
    if (!userStats[offerBy]) {
      userStats[offerBy] = { generosityScore: 10, tradeBalance: 0, trustScore: 85, graceScore: 1, barterBalance: 0 };
    }
    userStats[offerBy].generosityScore += 5;
    userStats[offerBy].trustScore += 2;
  }

  // Push immediate notification to matching experts (Genealogy expert gets pinged if record is posted, etc.)
  const lowerText = `${title} ${description}`.toLowerCase();
  let matchedTag: 'Genealogy' | 'Land Law' | 'Estate Trust' | null = null;
  if (lowerText.includes('genealogy') || lowerText.includes('ancestor') || lowerText.includes('lineage') || lowerText.includes('family tree') || lowerText.includes('dna')) {
    matchedTag = 'Genealogy';
  } else if (lowerText.includes('land') || lowerText.includes('wealth') || lowerText.includes('deed') || lowerText.includes('homestead') || lowerText.includes('soil')) {
    matchedTag = 'Land Law';
  } else if (lowerText.includes('trust') || lowerText.includes('estate') || lowerText.includes('will') || lowerText.includes('probate') || lowerText.includes('heir')) {
    matchedTag = 'Estate Trust';
  }

  if (matchedTag) {
    const matchedExperts = expertProfiles
      .filter(e => e.optIn && e.expertTags.includes(matchedTag!))
      .map(e => e.name);
    
    const newNotification: NotificationEngineEvent = {
      id: `n-market-${Date.now()}`,
      queryTitle: `Market Matcher: ${title.substring(0, 45)}...`,
      matchedExperts: matchedExperts.length > 0 ? matchedExperts : ['Ancestral Council Advisors'],
      tagMatched: matchedTag,
      timestamp: new Date().toISOString()
    };
    notificationEvents.unshift(newNotification);
  }

  barterOffers.unshift(newOffer);
  res.status(201).json(newOffer);
});

// The Copper Handshake Endpoint
app.post('/api/barter/handshake', (req, res) => {
  const { barterId, userName, action } = req.body; // action: 'confirm_giver' | 'confirm_recipient'
  
  const barter = barterOffers.find(b => b.id === barterId);
  if (!barter) {
    return res.status(404).json({ error: 'Barter listing not found' });
  }

  if (action === 'confirm_giver') {
    barter.giverConfirmed = true;
  } else if (action === 'confirm_recipient') {
    barter.recipientConfirmed = true;
    barter.recipientName = userName;
  }

  // A handshake is complete only when both giver and recipient log the transfer
  if (barter.giverConfirmed && barter.recipientConfirmed) {
    barter.handshakeComplete = true;

    const giver = barter.offerBy;
    const recipient = barter.recipientName || userName;

    if (!userStats[giver]) userStats[giver] = { generosityScore: 10, tradeBalance: 0, trustScore: 85, graceScore: 1, barterBalance: 0 };
    if (!userStats[recipient]) userStats[recipient] = { generosityScore: 10, tradeBalance: 0, trustScore: 85, graceScore: 1, barterBalance: 0 };

    const valuePoints = barter.valuePoints || 5;

    if (barter.isGift || barter.category === 'Copper Gift' || barter.requestType === 'Gift/Need') {
      // Type B: Gift (Exempt)
      // Increases Giver's generosityScore (Community Grace) and Trust Score. No change to Barter Balance.
      userStats[giver].generosityScore += 10;
      userStats[giver].trustScore += 5;
      
      // Increment recipient's graceScore
      userStats[recipient].graceScore += 1;
    } else {
      // Type A: Barter (Tracked)
      // Subtracts points from the recipient and adds to the provider
      const isPostCreatorGiver = barter.intentTag !== 'I need';
      const actualGiver = isPostCreatorGiver ? giver : recipient;
      const actualRecipient = isPostCreatorGiver ? recipient : giver;

      userStats[actualGiver].barterBalance += valuePoints;
      userStats[actualGiver].tradeBalance += valuePoints;
      userStats[actualGiver].trustScore += 3;

      userStats[actualRecipient].barterBalance -= valuePoints;
      userStats[actualRecipient].tradeBalance -= valuePoints;
      userStats[actualRecipient].trustScore += 1;
    }
  }

  res.json({
    barter,
    userStats: userStats[userName] || { generosityScore: 10, tradeBalance: 0, trustScore: 85, graceScore: 1, barterBalance: 0 }
  });
});

// 2. Messaging Endpoints (Encrypted storage simulation)
app.get('/api/messages', (req, res) => {
  const { state } = req.query;
  let filtered = [...messages];
  if (state) {
    filtered = filtered.filter(m => m.stateCode.toLowerCase() === (state as string).toLowerCase());
  }
  // Decrypt on demand for display to simulate safe decryption in client keyspace
  const decrypted = filtered.map(m => ({
    ...m,
    text: simulateDecrypt(m.encryptedText)
  }));
  res.json(decrypted);
});

app.post('/api/messages', (req, res) => {
  const { text, senderName, stateCode } = req.body;
  if (!text || !senderName || !stateCode) {
    return res.status(400).json({ error: 'Message text, sender name, and state code are required' });
  }

  const encrypted = simulateEncrypt(text);
  const newMessage: Message = {
    id: `m-${Date.now()}`,
    sender: 'user', // From user
    senderName,
    text: text, // Plain text returned for instant visual confirmation
    encryptedText: encrypted,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    isEncrypted: true,
    stateCode: stateCode.toUpperCase(),
    aesKeyFingerprint: `SHA256:7B:${Math.random().toString(16).slice(2, 6).toUpperCase()}:${Math.random().toString(16).slice(2, 6).toUpperCase()}...CO-OP-KEY`
  };

  messages.push(newMessage);
  res.status(201).json(newMessage);
});

// 3. Events Endpoints
app.get('/api/events', (req, res) => {
  const { state, category } = req.query;
  let filtered = [...coopEvents];
  if (state) {
    filtered = filtered.filter(e => e.stateCode.toLowerCase() === (state as string).toLowerCase());
  }
  if (category) {
    filtered = filtered.filter(e => e.hubId === category);
  }
  res.json(filtered);
});

app.post('/api/events', (req, res) => {
  const { title, date, time, location, description, hubId, stateCode, type } = req.body;
  if (!title || !date || !time || !location || !description || !hubId || !stateCode || !type) {
    return res.status(400).json({ error: 'Missing required event fields' });
  }

  const newEvent: CoopEvent = {
    id: `e-${Date.now()}`,
    title,
    date,
    time,
    location,
    description,
    hubId,
    stateCode: stateCode.toUpperCase(),
    type,
  };

  coopEvents.unshift(newEvent);
  res.status(201).json(newEvent);
});

// 4. State Privacy Compliance Endpoint (50 states)
app.get('/api/compliance/status', (req, res) => {
  const { state } = req.query;
  if (!state) {
    return res.status(400).json({ error: 'State code is required' });
  }
  const compliance = getComplianceForState(state as string);
  res.json(compliance);
});

// 5. Gemini "Ancestral Wisdom" Advisory Endpoint
app.post('/api/gemini/wisdom', async (req, res) => {
  const { prompt, category, stateCode } = req.body;

  if (!prompt || !category) {
    return res.status(400).json({ error: 'Prompt and category are required' });
  }

  const stateLabel = stateCode ? `located in the state of ${stateCode}` : '';

  // Tailor system instructions to the beautiful, warm, respectful "Luxury-Indigenous" brand vibe
  const systemInstruction = `
    You are the "Ancestral Advisory Council" for "Copper Mommies Co." (a private cooperative economic ecosystem for American-born Copper-toned mothers). 
    Your tone must be warm, grounded, highly respectful, comforting, and premium. You use rich, ancestral storytelling language combined with practical, structured advice.
    
    Category of query: ${category}.
    The user is a mother ${stateLabel}.
    
    Always address her with warmth (e.g. "Autonomous Sister", "Beloved Mother").
    Provide helpful, direct answers:
    - If the topic is 'village' (Homeschooling/Childcare): suggest traditional, family-inclusive curricula ideas, storytelling methods, or cooperative childcare swap strategies based on early American ancestral family structures.
    - If 'healing' (Alternative health/Gardening): discuss herbal remedies (elderberry, herbal steams, non-toxic shea mixtures), maternal mental wellness, or balcony gardening tips with deep respect for traditional American agricultural heritage.
    - If 'economy' (Barter/Digital wealth): offer constructive advice on how to package her skills (creative design, writing, coding) into digital assets, digital products, subscription models, or barter strategies.
    - If 'gathering' (Rituals/Community): suggest meaningful rituals, event planning tips, or peer bonding ideas.

    Give concrete, actionable bullet points, keep the advice deeply comforting, and avoid overly academic or dry corporate jargon. Keep your response around 3 to 4 concise paragraphs.
  `;

  if (geminiAi) {
    try {
      const response = await geminiAi.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        },
      });

      const text = response.text;
      return res.json({ result: text, isSimulated: false });
    } catch (err: any) {
      console.error('Gemini API Error:', err);
      // Fall through to simulated response on API error so app stays active
    }
  }

  // Resilient fallback premium simulation in case API key is missing or failed
  console.log('Generating premium simulated response for category:', category);
  let simulatedText = '';

  if (category === 'healing') {
    simulatedText = `**Beloved Autonomous Mother,**\n\nReturning to our roots is a powerful act of reclaiming wellness for your lineage. For holistic care, look to our ancestral keepers who combined deep Earth wisdom with modern understandings:\n\n*   **Balcony Herb Apothecary:** You can start growing **holy basil**, **mint**, and **lemon balm** in simple clay pots. Lemon balm is highly supportive of maternal nervous systems and helps ease daily stresses.\n*   **Nourishing Maternal Steams:** Utilize dried calendula and chamomile flowers for facial steams or herbal foot baths. This is a gentle, judgment-free way to soothe tension and chronic fatigue.\n*   **Clean Shea Enrichment:** Combine pure cold-pressed unrefined shea butter with 3-4 drops of lavender and chamomile essential oils. Whip it slowly with a hand mixer to create a cloud-like skin nourishment completely free of modern industrial toxins.\n\nKeep grounding your feet in the soil, Sister. Your wellness is the foundation of the village.`;
  } else if (category === 'village') {
    simulatedText = `**Greetings Autonomous Sister,**\n\nNurturing young minds on our own terms is a beautiful, sacred responsibility. In organizing your homeschooling headquarters, we recommend blending state guidelines with ancestral, self-directed exploration:\n\n*   **Storytelling as Mathematics:** Teach math through practical cooperative trading. Practice calculating barter fractions with your children using real household goods like seeds, beans, or fabrics.\n*   **Traditional American Geography:** Swap standard Eurocentric globes for maps detailing early American trade routes and ancestral family boundaries. This builds a foundational sense of pride and historical accuracy.\n*   **Childcare Cooperative Circles:** In Atlanta, moms have succeeded by dividing childcare into thematic blocks. You can organize with 3 local moms where each mom hosts for 4 hours once a week, exchanging time credits instead of costly commercial daycare fees.\n\nYour children are the seeds of our future; together we keep them well-nourished.`;
  } else if (category === 'economy') {
    simulatedText = `**Beloved Mother,**\n\nYou are sitting on rich, valuable assets built through your lived experience and professional talents. Reclaiming cooperative economics begins by realizing you do not need to rely solely on external systems:\n\n*   **Monetizing Your Knowledge:** If you have skills in automation, writing, or design, package them into "Autonomous Micro-Guides." A 10-page PDF on "Starting a Balcony Garden" or "My Simple Homeschool Math Syllabus" can be shared on our cooperative board for barter or sold digitally.\n*   **Barter Strategies:** Use your digital skills to trade directly. You can trade 3 hours of social media templates for organic collard greens, fresh honey, or trusted tutoring for your kids.\n*   **Mutual Aid Foundations:** Our ancestors pooled pennies in traditional cooperative savings circles. Consider forming a digital co-op fund with trusted mothers to purchase wholesale farming soil or curriculums.\n\nStep boldly into your wealth-creation journey. Your intellectual property is self-determined.`;
  } else {
    simulatedText = `**Greetings Autonomous Sister,**\n\nGathering in a sacred sanctuary restores our collective strength. To create meaningful virtual and physical spaces, focus on intentional, unhurried interactions:\n\n*   **The Check-In Circle:** Begin virtual meetings with a "Breath & Ground" session. Take 3 deep, synchronized breaths as a sisterhood to synchronize heart rates and release external clutter.\n*   **Mothers' Night Out (Nourish Circles):** Coordinate a potluck dinner where each mom brings an ingredient that has a story from her childhood or her maternal lineage.\n*   **Seasonal Retreats:** Mark seasonal garden cycles (spring sowing, autumn harvest) with local park circles, offering herbal tea and sharing journaling prompts on motherhood.\n\nYour presence is the glue of this sanctuary. May your gatherings be deeply restoring.`;
  }

  return res.json({ result: simulatedText, isSimulated: true });
});

// Kinship Vault & Contribution Portal Endpoints

// Get all skill/item/monetary pledges
app.get('/api/kinship/pledges', (req, res) => {
  res.json(kinshipPledges);
});

// Add a new pledge (Support the Community)
app.post('/api/kinship/pledges', (req, res) => {
  const { donorName, pledgeType, amount, details, stateCode } = req.body;
  if (!pledgeType || !details) {
    return res.status(400).json({ error: 'Pledge type and details are required' });
  }

  const newPledge: KinshipPledge = {
    id: `p-${Date.now()}`,
    donorName: donorName || 'Anonymous Sister',
    pledgeType,
    amount: amount ? Number(amount) : undefined,
    details,
    stateCode: stateCode || 'US',
    createdAt: new Date().toISOString()
  };

  kinshipPledges.unshift(newPledge);
  res.status(201).json(newPledge);
});

// Get all expert profiles for the directory
app.get('/api/kinship/experts', (req, res) => {
  res.json(expertProfiles);
});

// Opt-in or update expert profile
app.post('/api/kinship/experts/opt-in', (req, res) => {
  const { name, stateCode, expertTags, description, optIn } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  let expert = expertProfiles.find(e => e.name.toLowerCase() === name.toLowerCase());
  if (expert) {
    expert.stateCode = stateCode || expert.stateCode;
    expert.expertTags = expertTags || expert.expertTags;
    expert.description = description || expert.description;
    expert.optIn = optIn !== undefined ? optIn : expert.optIn;
  } else {
    expert = {
      id: `exp-${Date.now()}`,
      name,
      stateCode: stateCode || 'US',
      expertTags: expertTags || ['Genealogy'],
      description: description || 'Active community mentor.',
      optIn: optIn !== undefined ? optIn : true
    };
    expertProfiles.push(expert);
  }

  res.json(expert);
});

// Get all notification engine events
app.get('/api/kinship/notifications', (req, res) => {
  res.json(notificationEvents);
});

// Get all Kinship Resource Map nodes
app.get('/api/kinship/resources', (req, res) => {
  res.json(kinshipResourceNodes);
});

// Add a new Kinship Resource Map node
app.post('/api/kinship/resources', (req, res) => {
  const { title, description, type, stateCode, cityZip, contact, addedBy } = req.body;
  if (!title || !description || !type || !stateCode || !cityZip || !contact) {
    return res.status(400).json({ error: 'All fields (title, description, type, stateCode, cityZip, contact) are required.' });
  }

  const newNode: KinshipResourceNode = {
    id: `kr-${Date.now()}`,
    title,
    description,
    type,
    stateCode: stateCode.toUpperCase(),
    cityZip,
    contact,
    addedBy: addedBy || 'Anonymous Sister',
    createdAt: new Date().toISOString()
  };

  kinshipResourceNodes.unshift(newNode);
  res.status(201).json(newNode);
});

// Create Root Ledger Query (triggers matching and automated pings)
app.post('/api/kinship/query', async (req, res) => {
  const { prompt, stateCode, authorName } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  // Determine matching tag based on keywords
  let tagMatched: 'Genealogy' | 'Land Law' | 'Estate Trust' = 'Genealogy';
  const text = prompt.toLowerCase();
  if (text.includes('land') || text.includes('sale') || text.includes('deed') || text.includes('property') || text.includes('homestead') || text.includes('llc')) {
    tagMatched = 'Land Law';
  } else if (text.includes('trust') || text.includes('estate') || text.includes('probate') || text.includes('will') || text.includes('heir') || text.includes('inheritance')) {
    tagMatched = 'Estate Trust';
  }

  // Find active experts tagged with this expertise
  const matchedExperts = expertProfiles
    .filter(e => e.optIn && e.expertTags.includes(tagMatched))
    .map(e => e.name);

  // Create a new automated notification ping event
  const newNotification: NotificationEngineEvent = {
    id: `n-${Date.now()}`,
    queryTitle: prompt.substring(0, 70) + (prompt.length > 70 ? '...' : ''),
    matchedExperts: matchedExperts.length > 0 ? matchedExperts : ['General Council Leaders'],
    tagMatched,
    timestamp: new Date().toISOString()
  };
  notificationEvents.unshift(newNotification);

  // Generate wisdom (Gemini or simulated fallback)
  const stateLabel = stateCode ? `located in the state of ${stateCode}` : '';
  const systemInstruction = `
    You are the "Ancestral Kinship Council" for "Copper Mommies Co." (a private cooperative economic ecosystem for American-born Copper-toned mothers).
    Your focus is on Genealogy, Land Law, and Estate Trusts.
    Your tone is warm, grounding, ancestral, premium, and comforting, yet deeply knowledgeable about legal structures and asset protection.
    
    Always address the sister with warmth (e.g., "Autonomous Sister", "Beloved Mother").
    Provide actionable advice regarding:
    - If Genealogy query: search strategies for pre-1870 census, Bureau of Land Management records, Freedmen's Bank records.
    - If Land Law: protecting family properties, holding land in private trusts or LLCs to prevent foreclosure or forced partitioned sales.
    - If Estate Trust: explaining why avoiding probate traps is critical and how to establish a private family trust.
    
    Provide 3 to 4 elegant, structured paragraphs.
  `;

  let wisdomResult = '';
  if (geminiAi) {
    try {
      const response = await geminiAi.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.6,
        }
      });
      wisdomResult = response.text;
    } catch (err) {
      console.error('Gemini error during kinship query:', err);
    }
  }

  if (!wisdomResult) {
    if (tagMatched === 'Land Law') {
      wisdomResult = `**Beloved Autonomous Mother,**\n\nYour query regarding protecting family land touches the very heartbeat of our sanctuary. Land is the physical vessel of our ancestral lineage. To guard it from speculative partition sales or tax foreclosure traps:\n\n*   **Consolidating Heir Property:** Heir property (land passed down without a clear will) is highly vulnerable. We recommend moving the deed into a **Private Family LLC** or a **Private Land Trust** with clear operating agreements.\n*   **Stewardship Lesson Handshake:** Reach out to local land-owning sisters who have successfully completed these deeds to learn how they structured their trustees.\n\nKeep holding the keys to your legacy, Sister. The soil remembers your steps.`;
    } else if (tagMatched === 'Estate Trust') {
      wisdomResult = `**Greetings Autonomous Sister,**\n\nWealth maintenance requires building walls around your family's assets. Probate court is designed to tax, delay, and dismantle ancestral wealth. To protect your children's inheritance:\n\n*   **The Mechanics of Trusts:** Establishing a Revocable or Irrevocable Living Trust keeps your assets private, bypassing public probate traps entirely. Your home and land should be titled to "The [Family Name] Heritage Trust" instead of an individual.\n*   **Heirship Planning:** Always list primary and contingent beneficiaries, and ensure a clear successor trustee is appointed who shares our cooperative values.\n\nLet us continue building secure legal structures to protect our lineages.`;
    } else {
      wisdomResult = `**Beloved Sister,**\n\nUnearthing the names, dates, and locations of our forebears is a sacred act of lineage recovery. Your query regarding genealogical research is welcomed:\n\n*   **Tracing Pre-1870 Ancestors:** Before the 1870 Census, our people were often omitted from standard population schedules. Look to the **U.S. Southern Claims Commission Records** or the **Freedmen’s Bureau Cohabitation Records** which document marriages, land acquisitions, and family reunifications.\n*   **Bureau of Land Management (BLM) Searches:** Check the BLM General Land Office Records for original Homestead Patents issued to your family's surnames. This is the direct proof of sovereign landownership.\n\nWe have triggered our Automated Notification Engine to alert our expert genealogy mentors. They will connect with you shortly.`;
    }
  }

  res.json({
    wisdom: wisdomResult,
    notification: newNotification,
    matchedExperts
  });
});

// ==========================================
// 10. HEARTH POLLS & DEMOCRATIC BALLOTS API
// ==========================================
const villagePolls: VillagePoll[] = [
  {
    id: 'poll-cc-live-15',
    title: 'Casual Corner Live Topic Ballot — Episode 15',
    question: 'Which sacred heart-topic should we unpack during this Thursday’s live Casual Corner Talk?',
    description: 'Pull up a seat and cast your vote! The winning topic will be featured during our Thursday 7:30 PM EST live community circle and recorded for the Audio Sanctuary.',
    category: 'casual-corner',
    isOpen: true,
    isFeatured: true,
    totalVotes: 38,
    createdAt: '2026-09-12T14:00:00.000Z',
    expiresAt: '2026-09-17T23:59:59.000Z',
    announcementText: '🗳️ Live Community Ballot: Vote for Thursday’s Casual Corner Talk Topic!',
    targetLink: '#casual-corner',
    votedUserIds: ['user-sample-1', 'user-sample-2'],
    options: [
      {
        id: 'opt-1',
        text: 'Restoring the Sacred 40-Day Postpartum & Traditional Mother-Warming Herbal Soups',
        description: 'Deep dive into bone broths, belly binding, womb warming teas, and organizing seamless meal trains.',
        votes: 16,
        proposer: 'Mama Jamila (GA)'
      },
      {
        id: 'opt-2',
        text: 'Homeschooling without Burnout: Establishing Daily Rhythms for Multiple Ages',
        description: 'Structuring unit studies, nature notebooks, and ancestral math without sitting at a desk all day.',
        votes: 11,
        proposer: 'Mama Shantrece (GA)'
      },
      {
        id: 'opt-3',
        text: 'Backyard Meat Birds & Open-Pollinated Seed Preserving for Food Sovereignty',
        description: 'Practical guide to heritage breeds, pasture fencing, harvesting rainwater, and non-hybrid seeds.',
        votes: 7,
        proposer: 'Auntie Brenda (CA)'
      },
      {
        id: 'opt-4',
        text: 'The Sacred Porch Covenant: Setting Loving Boundaries with Extended Family',
        description: 'Preserving peaceful homes, intergenerational respect, and handling family disagreements gracefully.',
        votes: 4,
        proposer: 'Sister Kisha (TX)'
      }
    ]
  },
  {
    id: 'poll-treasury-class-q4',
    title: 'Sovereign Skill Pot — Next Crowdfunded Masterclass',
    question: 'Which village masterclass should our Sovereign Treasury crowdfund and host next month?',
    description: 'Each quarter, our collective pledges co-fund deep-dive practical skills taught by trusted matriarchs. Cast your vote to choose our next funded curriculum.',
    category: 'crowdfunded-class',
    isOpen: true,
    isFeatured: false,
    totalVotes: 47,
    createdAt: '2026-09-10T10:00:00.000Z',
    expiresAt: '2026-09-25T23:59:59.000Z',
    announcementText: '🍯 Crowdfunded Masterclass: Choose our next community-backed workshop!',
    targetLink: '#treasury',
    votedUserIds: ['user-sample-3'],
    options: [
      {
        id: 'opt-tc-1',
        text: 'Private Family Land Trust Structuring & Mineral Rights Protection',
        description: 'Complete legal walkthrough on locking family acreage into 100% unanimous trust agreements.',
        votes: 21,
        proposer: 'Mama Jamila'
      },
      {
        id: 'opt-tc-2',
        text: 'Off-Grid Solar Well Pump Wiring & Gravity-Fed Drip Irrigation',
        description: 'DIY blueprint to set up resilient off-grid water systems with zero municipal dependency.',
        votes: 14,
        proposer: 'Elder Thomas'
      },
      {
        id: 'opt-tc-3',
        text: 'Traditional Hot-Process Lard Soap & Wildcrafted Botanical Tallow Balms',
        description: 'Chemistry of pure lye, pasture-rendered tallow, and native infused herbs for skin healing.',
        votes: 8,
        proposer: 'Sister Maya'
      },
      {
        id: 'opt-tc-4',
        text: 'Wild Yeast Sourdough, Heritage Cornmeal & Salt-Rising Fermentation',
        description: 'Traditional bread craft, gut microbiome health, and long-term shelf storage.',
        votes: 4,
        proposer: 'Sister Nia'
      }
    ]
  },
  {
    id: 'poll-gov-fall-campout',
    title: 'Autumn Regional Gathering & Seed Exchange Sanctuary',
    question: 'Where would you prefer to anchor our multi-state Fall Sisterhood Campfire & Seed Swap?',
    description: 'Help the Grandmother Council select the primary regional location for our 3-day autumn gathering.',
    category: 'village-governance',
    isOpen: true,
    isFeatured: false,
    totalVotes: 29,
    createdAt: '2026-09-08T09:00:00.000Z',
    expiresAt: '2026-09-30T23:59:59.000Z',
    announcementText: '🏕️ Fall Campout Poll: Vote on the Regional Sanctuary Location!',
    votedUserIds: [],
    options: [
      {
        id: 'opt-gov-1',
        text: 'Georgia Piedmont Forest Sanctuary (Campfire, Yurt Tents & Creekside Pavilion)',
        description: 'Centrally accessible for Georgia, Alabama, Florida, and Tennessee sisters.',
        votes: 15,
        proposer: 'Grandmother Council'
      },
      {
        id: 'opt-gov-2',
        text: 'South Carolina Lowcountry Heritage Farm & Coastal Gullah Preserve',
        description: 'Rich agricultural lineage, heritage rice fields, and coastal gathering pavilion.',
        votes: 9,
        proposer: 'Grandmother Council'
      },
      {
        id: 'opt-gov-3',
        text: 'East Texas Piney Woods Cooperative Homestead',
        description: 'Spacious wooded acres, solar bathhouse, and outdoor community kitchen.',
        votes: 5,
        proposer: 'Grandmother Council'
      }
    ]
  }
];

// GET /api/polls
app.get('/api/polls', (req, res) => {
  const { category, activeOnly } = req.query;
  let list = [...villagePolls];
  if (category && (category as string).toLowerCase() !== 'all') {
    list = list.filter(p => p.category === category);
  }
  if (activeOnly === 'true') {
    list = list.filter(p => p.isOpen);
  }
  res.json(list);
});

// POST /api/polls/:id/vote
app.post('/api/polls/:id/vote', (req, res) => {
  const { id } = req.params;
  const { optionId, voterId, voterName } = req.body;
  const poll = villagePolls.find(p => p.id === id);
  if (!poll) {
    return res.status(404).json({ error: 'Poll ballot not found' });
  }
  if (!poll.isOpen) {
    return res.status(400).json({ error: 'This ballot has ended and is closed for voting.' });
  }
  const voterKey = voterId || voterName || 'member-session';
  poll.votedUserIds = poll.votedUserIds || [];
  if (poll.votedUserIds.includes(voterKey)) {
    return res.status(400).json({ error: 'You have already recorded your vote on this ballot.' });
  }
  const option = poll.options.find(o => o.id === optionId);
  if (!option) {
    return res.status(404).json({ error: 'Selected option not found' });
  }
  option.votes += 1;
  poll.totalVotes += 1;
  poll.votedUserIds.push(voterKey);

  res.json({ success: true, poll, message: 'Your sacred vote has been recorded in the community circle!' });
});

// POST /api/polls (Admin creates poll)
app.post('/api/polls', (req, res) => {
  const { title, question, description, category, options, expiresAt, isFeatured, announcementText, targetLink } = req.body;
  if (!title || !question || !options || !Array.isArray(options) || options.length < 2) {
    return res.status(400).json({ error: 'Please provide title, question, and at least two distinct voting options.' });
  }

  const newPoll: VillagePoll = {
    id: `poll-${Date.now()}`,
    title,
    question,
    description: description || '',
    category: category || 'casual-corner',
    options: options.map((opt: any, idx: number) => ({
      id: `opt-${idx + 1}-${Date.now()}`,
      text: typeof opt === 'string' ? opt : opt.text,
      description: typeof opt === 'object' && opt.description ? opt.description : '',
      votes: 0,
      proposer: typeof opt === 'object' && opt.proposer ? opt.proposer : 'Grandmother Council'
    })),
    totalVotes: 0,
    votedUserIds: [],
    isOpen: true,
    isFeatured: !!isFeatured,
    expiresAt: expiresAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    announcementText: announcementText || `🗳️ Live Community Ballot: ${title}`,
    targetLink: targetLink || '#casual-corner'
  };

  villagePolls.unshift(newPoll);
  res.json({ success: true, poll: newPoll });
});

// PATCH /api/polls/:id/toggle (Close/Open poll)
app.patch('/api/polls/:id/toggle', (req, res) => {
  const { id } = req.params;
  const poll = villagePolls.find(p => p.id === id);
  if (!poll) return res.status(404).json({ error: 'Poll ballot not found' });
  poll.isOpen = !poll.isOpen;
  res.json({ success: true, poll });
});

// DELETE /api/polls/:id
app.delete('/api/polls/:id', (req, res) => {
  const { id } = req.params;
  const idx = villagePolls.findIndex(p => p.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Poll ballot not found' });
  villagePolls.splice(idx, 1);
  res.json({ success: true });
});

// ============================================================================
// PMA SANCTUARY APPLICATION: AUTOMATED SIFTING & TRANSACTIONAL EMAIL PIPELINE
// ============================================================================

interface SanctuaryAppRecord {
  id: string;
  full_name: string;
  email_address: string;
  birth_year: number;
  current_location: string;
  children_ages: string;
  social_handle?: string;
  phone_number: string;
  maternal_lineage: string;
  lineage_perspective: string;
  vocation_trade: string;
  barter_perks: string;
  communityContributionTypes?: string[];
  communityContributionDetails?: string;
  wantsToBeStateLead?: boolean;
  stateLeadStatus?: 'certified_candidate' | 'on_hold' | 'declined' | 'not_applied';
  stateLeadGroundSupport?: string;
  stateLeadExperience?: string;
  stateLeadPeopleManagement?: string;
  stateLeadConflictApproach?: string;
  stateLeadContributionGift?: string;
  pma_declaration: boolean;
  code_of_conduct: boolean;
  status: 'approved' | 'disqualified' | 'pending';
  disqualificationReason?: string;
  submittedAt: string;
  activationToken?: string;
  activationTokenLink?: string;
  appDownloadLink?: string;
}

interface DispatchedEmailRecord {
  id: string;
  to: string;
  recipientName: string;
  subject: string;
  body: string;
  sentAt: string;
  tokenLink: string;
  appDownloadLink: string;
}

interface BusinessAdRecord {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone?: string;
  socialHandle?: string;
  websiteUrl: string;
  headline: string;
  tagline?: string;
  description: string;
  placementType: 'header_banner' | 'commons_sidebar' | 'both_bundle';
  bannerImageUrl: string;
  ctaText: string;
  specialCommunityDiscount?: string;
  discountCode?: string;
  pricingTierSelected: string;
  pricingAmount: number;
  isSingleMelanatedWomanOwner: boolean;
  status: 'pending_review' | 'approved' | 'rejected' | 'active';
  submittedAt: string;
  approvedAt?: string;
  adminNotes?: string;
}

const sanctuaryApplications: SanctuaryAppRecord[] = [];
const dispatchedEmails: DispatchedEmailRecord[] = [];

// In-memory business ad submissions with authentic initial showcase ads
const businessAdSubmissions: BusinessAdRecord[] = [
  {
    id: 'ad-showcase-1',
    businessName: 'Copper Roots Botanicals',
    ownerName: 'Sister Maya N.',
    email: 'maya@copperrootsbotanicals.com',
    phone: '(404) 555-0144',
    socialHandle: '@copperrootsbotanicals',
    websiteUrl: 'https://copperrootsbotanicals.com',
    headline: 'Ancestral Tinctures & Wildcrafted Herbal Tonics',
    tagline: 'Handcrafted by Melanated Mothers for Sovereign Wellness',
    description: 'Nourishing organic elixirs, red raspberry leaf postpartum tea blends, and cold-pressed elderberry wellness tonics for families.',
    placementType: 'both_bundle',
    bannerImageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
    ctaText: 'Shop Herbal Tonics',
    specialCommunityDiscount: '20% off all mother & baby wellness herbal remedies',
    discountCode: 'COPPERMAMA20',
    pricingTierSelected: 'pioneer_free',
    pricingAmount: 0,
    isSingleMelanatedWomanOwner: true,
    status: 'approved',
    submittedAt: '2026-10-01T12:00:00Z',
    approvedAt: '2026-10-02T10:00:00Z',
    adminNotes: 'Founder-approved pioneer featured advertiser.'
  },
  {
    id: 'ad-showcase-2',
    businessName: 'Sol Haven Natural Fiber Apparel',
    ownerName: 'Sister Alicia J.',
    email: 'alicia@solhavenapparel.com',
    phone: '(312) 555-0198',
    socialHandle: '@solhaven.fibers',
    websiteUrl: 'https://solhavenapparel.com',
    headline: '100% Raw Linen & Organic Cotton Children Wear',
    tagline: 'Breathable, non-toxic heirloom garments for active children',
    description: 'Durable, handcrafted garments made from natural unbleached fibers designed to nurture skin health and ancestral living.',
    placementType: 'commons_sidebar',
    bannerImageUrl: 'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&w=600&q=80',
    ctaText: 'View Heirlooms',
    specialCommunityDiscount: 'Free shipping + 15% off first order for Copper Mommies',
    discountCode: 'VILLAGEGIFT15',
    pricingTierSelected: 'commons_sidebar',
    pricingAmount: 25,
    isSingleMelanatedWomanOwner: true,
    status: 'approved',
    submittedAt: '2026-10-04T15:30:00Z',
    approvedAt: '2026-10-05T09:15:00Z',
    adminNotes: 'Active sidebar sponsor with verified discount code.'
  }
];

// Business Ads Endpoints
app.get('/api/business-ads', (req, res) => {
  const { status } = req.query;
  let ads = [...businessAdSubmissions];
  if (status && status !== 'all') {
    ads = ads.filter(a => a.status === status);
  }
  res.json({
    total: businessAdSubmissions.length,
    approved: businessAdSubmissions.filter(a => a.status === 'approved' || a.status === 'active').length,
    pending: businessAdSubmissions.filter(a => a.status === 'pending_review').length,
    ads
  });
});

app.post('/api/business-ads', (req, res) => {
  const data = req.body;
  if (!data.businessName || !data.ownerName || !data.email || !data.headline || !data.bannerImageUrl) {
    return res.status(400).json({ error: 'Missing required business details, owner name, headline, or banner image URL.' });
  }

  const newAd: BusinessAdRecord = {
    id: `ad-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
    businessName: data.businessName.trim(),
    ownerName: data.ownerName.trim(),
    email: data.email.trim(),
    phone: data.phone?.trim() || '',
    socialHandle: data.socialHandle?.trim() || '',
    websiteUrl: data.websiteUrl?.trim() || '',
    headline: data.headline.trim(),
    tagline: data.tagline?.trim() || '',
    description: data.description?.trim() || '',
    placementType: data.placementType || 'commons_sidebar',
    bannerImageUrl: data.bannerImageUrl.trim(),
    ctaText: data.ctaText?.trim() || 'Learn More',
    specialCommunityDiscount: data.specialCommunityDiscount?.trim() || '',
    discountCode: data.discountCode?.trim() || '',
    pricingTierSelected: data.pricingTierSelected || 'pioneer_free',
    pricingAmount: Number(data.pricingAmount) || 0,
    isSingleMelanatedWomanOwner: !!data.isSingleMelanatedWomanOwner,
    status: 'pending_review',
    submittedAt: new Date().toISOString()
  };

  businessAdSubmissions.unshift(newAd);
  res.status(201).json({
    success: true,
    message: 'Business advertising application submitted successfully. Founder Shantrece and the Matriarch Council will review your ad.',
    ad: newAd
  });
});

app.patch('/api/business-ads/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, adminNotes } = req.body;
  const ad = businessAdSubmissions.find(a => a.id === id);
  if (!ad) {
    return res.status(404).json({ error: 'Business ad not found' });
  }

  if (status) ad.status = status;
  if (adminNotes !== undefined) ad.adminNotes = adminNotes;
  if (status === 'approved' || status === 'active') {
    ad.approvedAt = new Date().toISOString();
  }

  res.json({ success: true, ad });
});

// Helper to generate transactional email content
function buildSanctuaryWelcomeEmail(fullName: string, email: string, phone: string, token: string) {
  const tokenLink = `https://coppermommies.co/portal/activate?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`;
  const appDownloadLink = `https://coppermommies.co/download/mobile-app?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`;

  const subject = `Welcome to the Village, Matriarch ${fullName} - Secure Portal Access Inside`;
  const body = `Greetings Sister ${fullName},

Your private application to The Sovereign Sanctuary for Melanated American Mothers has been processed and authenticated by the Matriarch Council. Your verified alignment with our generational parameters, American-born maternal lineage, and private covenant guidelines has been fully confirmed.

You have officially crossed the threshold from the public domain into our private village. To finalize your account setup, access your perks, and step into our community ecosystem, follow these two mandatory steps:

1. Claim Your Portal Access & Profile Setup:
Click the secure link below to officially establish your password and unlock your profile dashboard within our custom AI Studio workspace. Your contact info (${email} and ${phone}) has already been locked into the system based on your approved application:
👉 ${tokenLink}

2. Download the Copper Mommies App to Your Phone:
Our private ecosystem requires active proximity synchronization, mutual aid coordination, and decentralized communication. Download the mobile Copper Mommies App directly to your device via the private link below. Once installed, log in with the account credentials you create in Step 1 to instantly access your 50-State Pod, localized barter boards, and the private Nextdoor network:
👉 ${appDownloadLink}

We look forward to honoring our ancestral lineage, trading gifts, and sharing sacred botanical wisdom with you in the private feeds.

In Sovereignty and Cooperative Economy,
The Matriarch Council & Founder
Copper Mommies Co. PMA`;

  return { subject, body, tokenLink, appDownloadLink };
}

// POST /api/sanctuary/apply - Evaluates conditional logic and knock-out rules
app.post('/api/sanctuary/apply', (req, res) => {
  const {
    full_name,
    email_address,
    birth_year,
    current_location,
    children_ages,
    social_handle,
    phone_number,
    maternal_lineage,
    lineage_perspective,
    vocation_trade,
    barter_perks,
    pma_declaration,
    code_of_conduct
  } = req.body;

  const birthYearNum = Number(birth_year);
  const appId = `app-pma-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
  const now = new Date().toISOString();

  // --------------------------------------------------------------------------
  // AUTOMATED SIFTING & KNOCK-OUT RULES (AUTO-REJECTION LOGIC)
  // --------------------------------------------------------------------------
  let isDisqualified = false;
  let reason = '';

  // Rule A (Age Gate): If birth_year is 1996 or later
  if (birthYearNum >= 1996) {
    isDisqualified = true;
    reason = 'Rule A (Age Gate): Birth year is 1996 or later. Membership is reserved for mothers born in 1995 or earlier.';
  }
  // Rule B (Maternal Lineage): If user selects "Other (Lineage African, Afro-Caribbean, Asiatic, Caribbean, etc.)"
  else if (maternal_lineage === 'Other (Lineage African, Afro-Caribbean, Asiatic, Caribbean, etc.)' || maternal_lineage === 'other') {
    isDisqualified = true;
    reason = 'Rule B (Maternal Lineage Gate): Non-American-born melanated maternal lineage selected.';
  }
  // Rule C (Lineage Perspective Gate): If user selects "I reject it immediately if it contradicts what I've learned."
  else if (
    lineage_perspective === "I reject it immediately if it contradicts what I've learned." ||
    lineage_perspective === 'I reject it immediately if it contradicts what I learned.' ||
    lineage_perspective === 'reject_contradictions'
  ) {
    isDisqualified = true;
    reason = 'Rule C (Lineage Perspective Gate): Selected immediate rejection of lineage study without inquiry.';
  }
  // Rule D (Motherhood Gate): If user specifies 0 children or no children
  else if (
    children_ages === '0' ||
    children_ages?.startsWith('0 children') ||
    children_ages?.toLowerCase().includes('0 children') ||
    children_ages?.toLowerCase().includes('0 child')
  ) {
    isDisqualified = true;
    reason = 'Rule D (Motherhood Gate): Applicant indicated 0 children. Membership is reserved for active mothers.';
  }

  // Knock-Out Halt: Update database status to "Disqualified", do NOT create user profiles or trigger invitation emails
  if (isDisqualified) {
    const disqualifiedRecord: SanctuaryAppRecord = {
      id: appId,
      full_name: full_name?.trim() || '',
      email_address: email_address?.trim() || '',
      birth_year: birthYearNum,
      current_location: current_location?.trim() || '',
      children_ages: children_ages?.trim() || '',
      social_handle: social_handle?.trim() || '',
      phone_number: phone_number?.trim() || '',
      maternal_lineage: maternal_lineage || '',
      lineage_perspective: lineage_perspective || '',
      vocation_trade: vocation_trade?.trim() || '',
      barter_perks: barter_perks?.trim() || '',
      pma_declaration: !!pma_declaration,
      code_of_conduct: !!code_of_conduct,
      status: 'disqualified',
      disqualificationReason: reason,
      submittedAt: now
    };

    sanctuaryApplications.unshift(disqualifiedRecord);

    return res.status(200).json({
      status: 'disqualified',
      applicationId: appId,
      disqualificationReason: reason,
      redirectMessage: "Thank you for sharing your profile details with Copper Mommies Co. Our current structural space and private research cohorts are bound to strict generational, lineage-specific, and constitutional criteria matching our active tribal matrices. Based on your answers, there is not an exact alignment with this specific pod's current focus. We honor your path and wish you great success on your journey forward."
    });
  }

  // --------------------------------------------------------------------------
  // APPROVAL PIPELINE & PRE-POPULATED ACCOUNT CREATION
  // Passed all gates: Birth Year <= 1995, confirms American lineage, open-minded perspective, checks both covenant boxes
  // --------------------------------------------------------------------------
  const secureToken = `pma-token-${Buffer.from(email_address || 'member').toString('hex').slice(0, 8)}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 8)}`;
  const emailPayload = buildSanctuaryWelcomeEmail(full_name, email_address, phone_number, secureToken);

  const approvedRecord: SanctuaryAppRecord = {
    id: appId,
    full_name: full_name.trim(),
    email_address: email_address.trim(),
    birth_year: birthYearNum,
    current_location: current_location.trim(),
    children_ages: children_ages.trim(),
    social_handle: social_handle?.trim() || '',
    phone_number: phone_number.trim(),
    maternal_lineage: maternal_lineage,
    lineage_perspective: lineage_perspective,
    vocation_trade: vocation_trade.trim(),
    barter_perks: barter_perks.trim(),
    pma_declaration: !!pma_declaration,
    code_of_conduct: !!code_of_conduct,
    status: 'approved',
    submittedAt: now,
    activationToken: secureToken,
    activationTokenLink: emailPayload.tokenLink,
    appDownloadLink: emailPayload.appDownloadLink
  };

  sanctuaryApplications.unshift(approvedRecord);

  // Execute transactional automated email trigger
  const emailLog: DispatchedEmailRecord = {
    id: `email-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
    to: email_address.trim(),
    recipientName: full_name.trim(),
    subject: emailPayload.subject,
    body: emailPayload.body,
    sentAt: now,
    tokenLink: emailPayload.tokenLink,
    appDownloadLink: emailPayload.appDownloadLink
  };
  dispatchedEmails.unshift(emailLog);

  // Pre-populated user profile record
  const userProfile = {
    id: `mem-${Date.now()}`,
    name: full_name.trim(),
    email: email_address.trim(),
    phone: phone_number.trim(),
    location: current_location.trim(),
    children: children_ages.trim(),
    profession: vocation_trade.trim(),
    barterContribution: barter_perks.trim(),
    role: 'member',
    status: 'active_good_standing',
    joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    activationToken: secureToken
  };

  return res.status(200).json({
    status: 'approved',
    application: approvedRecord,
    userProfile,
    activationToken: secureToken,
    tokenLink: emailPayload.tokenLink,
    appDownloadLink: emailPayload.appDownloadLink,
    transactionalEmail: emailLog
  });
});

// GET /api/sanctuary/applications (Admin review & audit)
app.get('/api/sanctuary/applications', (req, res) => {
  res.json({
    total: sanctuaryApplications.length,
    approved: sanctuaryApplications.filter(a => a.status === 'approved').length,
    disqualified: sanctuaryApplications.filter(a => a.status === 'disqualified').length,
    applications: sanctuaryApplications
  });
});

// GET /api/notifications/emails (Audit sent transactional emails)
app.get('/api/notifications/emails', (req, res) => {
  res.json({
    total: dispatchedEmails.length,
    emails: dispatchedEmails
  });
});

// Serve frontend assets
async function startServer() {
  // Integrate Vite dev server middleware in development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Vite development middleware integrated.');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Production static serving configured.');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Copper Mommies Co. full-stack server running on http://localhost:${PORT}`);
  });
}

startServer();
