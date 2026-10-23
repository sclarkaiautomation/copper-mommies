import { DirectChatThread, ChatMember } from '../types';

export const INITIAL_CHAT_MEMBERS: ChatMember[] = [
  {
    id: 'user-reginald',
    name: 'Reginald Clark',
    avatar: '/coppermommies-selflove1-cmc.jpg',
    neighborhood: 'Venetian Hills • Atlanta',
    role: 'Artisan Woodworker & Member'
  },
  {
    id: 'user-joel',
    name: 'Joel Carrick',
    avatar: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=200&q=80',
    neighborhood: 'Mechanicsville • Atlanta',
    role: 'Garden & Homestead Neighbor'
  },
  {
    id: 'user-patrick',
    name: 'Patrick Cortez',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
    neighborhood: 'Egan Park • Atlanta',
    role: 'Homeschool Parent'
  },
  {
    id: 'user-lacy',
    name: 'Lacy Simmons',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    neighborhood: 'West End • Atlanta',
    role: 'Herbal Guild Member'
  },
  {
    id: 'user-parris',
    name: 'Parris Sims',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    neighborhood: 'Cascade • Atlanta',
    role: 'Doula & Lying-In Circle'
  },
  {
    id: 'user-nia',
    name: 'Sister Nia',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=200&q=80',
    neighborhood: 'Houston, TX Circle',
    role: 'Homestead Mother (2 Boys)'
  },
  {
    id: 'user-keisha',
    name: 'Mama Keisha',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    neighborhood: 'Prince George\'s, MD Circle',
    role: 'Midwife & Herbalist'
  }
];

export const INITIAL_DIRECT_CHAT_THREADS: DirectChatThread[] = [
  {
    id: 'chat-reginald',
    participantId: 'user-reginald',
    participantName: 'Reginald Clark',
    participantAvatar: '/coppermommies-selflove1-cmc.jpg',
    participantNeighborhood: 'Venetian Hills • Atlanta',
    category: 'exchange',
    originSectionLabel: 'Cooperative Economy: Custom Carpentry & Seed Swap',
    originListingId: 'barter-carpentry-1',
    originListingImage: '/coppermommies-selflove1-cmc.jpg',
    originListingSummary: 'Offering custom Montessori low-shelf bookcase for 4 dozen farm eggs or 2 hrs garden help.',
    tradeStatus: 'proposed',
    lastMessage: 'Shared custom carpentry & electrical guide',
    lastMessageTime: '12:25 pm',
    unreadCount: 1,
    messages: [
      {
        id: 'm-r1',
        senderId: 'user-reginald',
        senderName: 'Reginald Clark',
        senderAvatar: '/coppermommies-selflove1-cmc.jpg',
        text: 'Hey Shantrece! Here is the link to the custom cabinetry barter we just posted for the village homeschool room.',
        timestamp: '11:20 am',
        isMe: false,
        linkPreviewUrl: 'https://coppermommies.co/p/Z9rsJpJJ8rh2',
        linkPreviewTitle: 'ClarkWorks Customs — Montessori Low-Shelf Bookshelf'
      },
      {
        id: 'm-r2',
        senderId: 'user-reginald',
        senderName: 'Reginald Clark',
        senderAvatar: '/coppermommies-selflove1-cmc.jpg',
        text: 'Also added the electrical load specs for the garden hoop house heater here:',
        timestamp: '12:02 pm',
        isMe: false,
        linkPreviewUrl: 'https://coppermommies.co/pages/intelligent-electrical-solutions-atlanta-ga',
        linkPreviewTitle: 'Intelligent Electrical & Off-Grid Solar Wiring Co-Op'
      },
      {
        id: 'm-r3',
        senderId: 'me',
        senderName: 'Shantrece Clark',
        senderAvatar: '/coppermommies-selflove1-cmc.jpg',
        text: 'Peace brother! Checking the specs now. Let’s do the barter split for the garden help.',
        timestamp: '12:25 pm',
        isMe: true
      }
    ]
  },
  {
    id: 'chat-joel',
    participantId: 'user-joel',
    participantName: 'Joel Carrick',
    participantAvatar: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=200&q=80',
    participantNeighborhood: 'Mechanicsville • Atlanta',
    category: 'housing',
    originSectionLabel: 'Housing Haven: Permaculture Garden Suite',
    originListingId: 'housing-garden-suite',
    originListingImage: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=400&q=80',
    originListingSummary: 'Private 1BR maternal cottage on 1.2 protected acres. $650/mo mutual aid or partial childcare credit.',
    tradeStatus: 'inquiring',
    lastMessage: 'You: Are you still offering the property viewing today? Where and what time?',
    lastMessageTime: '1d ago',
    unreadCount: 0,
    messages: [
      {
        id: 'm-j1',
        senderId: 'user-joel',
        senderName: 'Joel Carrick',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        text: 'Peace and greetings Shantrece! Thanks for reaching out regarding the garden suite housing post.',
        timestamp: 'Sep 24, 2026 • 2:15 PM',
        isMe: false
      },
      {
        id: 'm-j2',
        senderId: 'me',
        senderName: 'Shantrece Clark',
        senderAvatar: '/coppermommies-selflove1-cmc.jpg',
        text: 'Are you still offering the property viewing today? Where and what time?',
        timestamp: 'Sep 25, 2026 • 11:30 AM',
        isMe: true
      }
    ]
  },
  {
    id: 'chat-danielle',
    participantId: 'user-danielle',
    participantName: 'Mama Danielle & Kendra',
    participantAvatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=200&q=80',
    participantNeighborhood: 'Cascade Circle • Atlanta',
    category: 'jobs',
    originSectionLabel: 'Vetted Gig: Trust Assistant & Homeschool Coordinator',
    originListingId: 'job-trust-assist',
    originListingImage: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80',
    originListingSummary: '3 days/week pod assistant for estate planning documentation. $28/hr + organic farm pantry box.',
    tradeStatus: 'inquiring',
    lastMessage: 'Thank you for submitting your pod credentials! Can we connect on Thursday?',
    lastMessageTime: '2d ago',
    unreadCount: 1,
    messages: [
      {
        id: 'm-d1',
        senderId: 'me',
        senderName: 'Shantrece Clark',
        senderAvatar: '/coppermommies-selflove1-cmc.jpg',
        text: 'Peace Mama Danielle! I am writing regarding the Trust Assistant and Homeschool Coordinator gig.',
        timestamp: '2d ago',
        isMe: true
      },
      {
        id: 'm-d2',
        senderId: 'user-danielle',
        senderName: 'Mama Danielle & Kendra',
        senderAvatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=200&q=80',
        text: 'Thank you for submitting your pod credentials! Can we connect on Thursday after afternoon lessons?',
        timestamp: '2d ago',
        isMe: false
      }
    ]
  },
  {
    id: 'chat-corinne',
    participantId: 'user-corinne',
    participantName: 'Mama Corinne',
    participantAvatar: '/apothecary_sister_herbal.jpg',
    participantNeighborhood: 'Blue Ridge Sanctuary • GA',
    category: 'academy',
    originSectionLabel: 'Academy Track: Master Folk Apothecary & Compounding',
    originListingId: 'tr-2',
    originListingImage: '/apothecary_sister_herbal.jpg',
    originListingSummary: 'Inquiry on Module 2: Elderberry Oxymel, ACV Ratios & Respiratory Syrup Brewing.',
    lastMessage: 'Mama Corinne: Remember to let the raw honey cool below 110°F to keep the enzymes alive!',
    lastMessageTime: '3d ago',
    unreadCount: 0,
    messages: [
      {
        id: 'm-c1',
        senderId: 'me',
        senderName: 'Shantrece Clark',
        senderAvatar: '/coppermommies-selflove1-cmc.jpg',
        text: 'Mama Corinne, on Module 2, should the apple cider vinegar be added while the elderberry tea is still simmering?',
        timestamp: '3d ago',
        isMe: true
      },
      {
        id: 'm-c2',
        senderId: 'user-corinne',
        senderName: 'Mama Corinne',
        senderAvatar: '/apothecary_sister_herbal.jpg',
        text: 'Peace Sister Shantrece! No, remove from the heat first. Remember to let the brew cool below 110°F before folding in raw honey so the live probiotic enzymes stay intact!',
        timestamp: '3d ago',
        isMe: false
      }
    ]
  },
  {
    id: 'chat-parris',
    participantId: 'user-parris',
    participantName: 'Parris Sims',
    participantAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    participantNeighborhood: 'Cascade • Atlanta',
    category: 'dm',
    originSectionLabel: 'Sister Circle: Doula Care & Lying-In Hearth',
    lastMessage: 'Yes no problem! Delivery scheduled for Tuesday morning.',
    lastMessageTime: '4d ago',
    unreadCount: 0,
    messages: [
      {
        id: 'm-s1',
        senderId: 'user-parris',
        senderName: 'Parris Sims',
        senderAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
        text: 'Yes no problem! I will bring over the nettle oxymel and fresh bone broth for your postpartum lying-in week.',
        timestamp: '4d ago',
        isMe: false
      }
    ]
  }
];
