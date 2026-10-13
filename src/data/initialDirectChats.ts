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
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    neighborhood: 'Mechanicsville • Atlanta',
    role: 'Garden & Homestead Neighbor'
  },
  {
    id: 'user-patrick',
    name: 'Patrick Cortez',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
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
    id: 'chat-joel',
    participantId: 'user-joel',
    participantName: 'Joel Carrick',
    participantAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    participantNeighborhood: 'Mechanicsville',
    category: 'housing',
    originSectionLabel: 'Housing & Property: Garden Suite',
    lastMessage: 'You: Are you still offering the free property viewing today? Where and what time?',
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
        text: 'Are you still offering the free property viewing today? Where and what time?',
        timestamp: 'Sep 25, 2026 • 11:30 AM',
        isMe: true
      }
    ]
  },
  {
    id: 'chat-reginald',
    participantId: 'user-reginald',
    participantName: 'Reginald Clark',
    participantAvatar: '/coppermommies-selflove1-cmc.jpg',
    participantNeighborhood: 'Venetian Hills',
    category: 'exchange',
    originSectionLabel: 'For Sale & Free Gifting',
    lastMessage: 'Shared custom carpentry & electrical guide',
    lastMessageTime: '1d ago',
    unreadCount: 0,
    messages: [
      {
        id: 'm-r1',
        senderId: 'user-reginald',
        senderName: 'Reginald Clark',
        senderAvatar: '/coppermommies-selflove1-cmc.jpg',
        text: 'Hey Shantrece! Here is the link to the custom cabinetry post we just shared for the village homeschool room.',
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
        text: 'hello! Wonderful, checking the specs now.',
        timestamp: '12:25 pm',
        isMe: true
      }
    ]
  },
  {
    id: 'chat-patrick',
    participantId: 'user-patrick',
    participantName: 'Patrick Cortez',
    participantAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    participantNeighborhood: 'Egan Park',
    category: 'dm',
    originSectionLabel: 'Homeschool Grade 3–5 Pod',
    lastMessage: 'You: Hi Patrick, Thanks for sharing the geometry math manipulatives guide!',
    lastMessageTime: 'Jan 29',
    unreadCount: 0,
    messages: [
      {
        id: 'm-p1',
        senderId: 'me',
        senderName: 'Shantrece Clark',
        senderAvatar: '/coppermommies-selflove1-cmc.jpg',
        text: 'Hi Patrick, Thanks for the math manipulatives guide! The children enjoyed the fraction tiles.',
        timestamp: 'Jan 29, 2026',
        isMe: true
      }
    ]
  },
  {
    id: 'chat-lacy',
    participantId: 'user-lacy',
    participantName: 'Lacy Simmons',
    participantAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    participantNeighborhood: 'West End',
    category: 'exchange',
    originSectionLabel: 'Free Gifting: Heirloom Seeds',
    lastMessage: 'You: Is the organic Georgia collard seed pack still available?',
    lastMessageTime: '2026',
    unreadCount: 0,
    messages: [
      {
        id: 'm-l1',
        senderId: 'me',
        senderName: 'Shantrece Clark',
        senderAvatar: '/coppermommies-selflove1-cmc.jpg',
        text: 'Is this still available? Is the pickup in West End?',
        timestamp: '2026',
        isMe: true
      }
    ]
  },
  {
    id: 'chat-parris',
    participantId: 'user-parris',
    participantName: 'Parris Sims',
    participantAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    participantNeighborhood: 'Cascade',
    category: 'dm',
    originSectionLabel: 'Doula Care & Postpartum Lying-In Pod',
    lastMessage: 'Yes no problem! Delivery scheduled for Tuesday morning.',
    lastMessageTime: '2026',
    unreadCount: 0,
    messages: [
      {
        id: 'm-s1',
        senderId: 'user-parris',
        senderName: 'Parris Sims',
        senderAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
        text: 'Yes no problem! I will bring over the nettle oxymel and fresh bone broth broth.',
        timestamp: '2026',
        isMe: false
      }
    ]
  }
];
