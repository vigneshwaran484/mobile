// Mock data for contributor dashboard
export const MOCK_USER_POINTS = {
    total: 2847,
    rank: 12,
    contributions: 156,
    accuracy: 94.2
};

export const MOCK_ACTIVITY = [
    {
        id: 1,
        type: 'earned',
        points: 15,
        location: 'Meenakshi Amman Temple',
        time: '2 hours ago',
        verified: true
    },
    {
        id: 2,
        type: 'earned',
        points: 20,
        location: 'Marina Beach',
        time: '5 hours ago',
        verified: true
    },
    {
        id: 3,
        type: 'penalty',
        points: -5,
        location: 'Kapaleeshwarar Temple',
        time: '1 day ago',
        reason: 'Inaccurate report'
    },
    {
        id: 4,
        type: 'earned',
        points: 10,
        location: 'Brihadisvara Temple',
        time: '2 days ago',
        verified: true
    },
    {
        id: 5,
        type: 'bonus',
        points: 50,
        reason: 'Weekly top contributor',
        time: '3 days ago'
    }
];

export const MOCK_LEADERBOARD = [
    { rank: 1, name: 'Rajesh Kumar', points: 8945, contributions: 412, avatar: '🏆' },
    { rank: 2, name: 'Priya S', points: 7821, contributions: 389, avatar: '🥈' },
    { rank: 3, name: 'Muthu Vel', points: 6543, contributions: 301, avatar: '🥉' },
    { rank: 4, name: 'Anjali Devi', points: 5234, contributions: 278, avatar: '⭐' },
    { rank: 5, name: 'Karthik R', points: 4892, contributions: 256, avatar: '⭐' },
    { rank: 6, name: 'Lakshmi P', points: 4123, contributions: 234, avatar: '⭐' },
    { rank: 7, name: 'Siva Kumar', points: 3876, contributions: 198, avatar: '⭐' },
    { rank: 8, name: 'Deepa M', points: 3456, contributions: 189, avatar: '⭐' },
    { rank: 9, name: 'Arjun V', points: 3124, contributions: 176, avatar: '⭐' },
    { rank: 10, name: 'Nithya S', points: 2998, contributions: 165, avatar: '⭐' },
    { rank: 11, name: 'Senthil N', points: 2901, contributions: 159, avatar: '⭐' },
    { rank: 12, name: 'You', points: 2847, contributions: 156, avatar: '👤', isCurrentUser: true }
];

export const MOCK_REWARDS = [
    {
        id: 1,
        title: 'Free Guide Session',
        description: '1 hour with a local expert',
        points: 1000,
        icon: '🎓',
        available: true
    },
    {
        id: 2,
        title: 'Premium Subscription (1 Month)',
        description: 'Unlock all premium features',
        points: 2500,
        icon: '💎',
        available: true
    },
    {
        id: 3,
        title: '₹500 Travel Voucher',
        description: 'Use for hotels or transport',
        points: 5000,
        icon: '🎫',
        available: false
    },
    {
        id: 4,
        title: 'PulseTN Merchandise',
        description: 'Limited edition t-shirt',
        points: 3000,
        icon: '👕',
        available: false
    }
];
