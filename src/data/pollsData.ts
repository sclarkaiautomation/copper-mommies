import { VillagePoll } from '../types';

export const initialVillagePolls: VillagePoll[] = [
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
        text: 'Raising Confident Kids, Beating Motherhood Burnout & Daily Rest Protocols',
        description: 'Real talk on setting boundaries, herbal nervous system reset, managing kids of all ages, and organizing village meal trains.',
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
        text: 'Backyard Chickens, Home Gardens & Food Self-Reliance for Busy Families',
        description: 'A realistic modern guide to healthy homegrown food, clean soil, and self-sufficient living without the overwhelm.',
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
    title: 'Village Skill Pot — Next Community-Funded Masterclass',
    question: 'Which village masterclass should our Community Treasury fund and host next month?',
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
