import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
            // Navigation
            home: 'HOME',
            pulse: 'PULSE',
            guides: 'GUIDES',
            points: 'POINTS',

            // Home Screen
            appTitle: 'PulseTN',
            appSubtitle: 'Tamil Nadu Tourism • Real-time',
            searchPlaceholder: 'Search destinations...',
            chooseVibe: 'Choose your vibe',
            trendingNear: 'Trending Near You',

            // Intents
            peace: 'Peace',
            spiritual: 'Spiritual',
            food: 'Food',
            lowCrowd: 'Low Crowd',

            // Pulse Screen
            livePulse: 'Live Local Pulse',
            autoUpdate: 'LIVE',
            all: 'All',
            smartPick: 'SMART PICK',
            perfectFor: 'Perfect for',
            details: 'Details',

            // Destination Details
            topDestination: 'TOP DESTINATION',
            crowd: 'CROWD',
            comfort: 'COMFORT',
            whyWorks: 'Why this works now:',
            experiencing: 'Currently experiencing',
            crowds: 'crowds. Perfect for a',
            experience: 'experience at this hour.',
            startJourney: 'Start Journey',
            alternativeChoice: 'Alternative Choice',
            back: 'Back',

            // Guides Screen
            localExperts: 'Local Experts',
            availableNow: 'AVAILABLE NOW',
            busy: 'BUSY',
            request: 'Request',

            // Crowd Status
            low: 'Low',
            medium: 'Medium',
            high: 'High',

            // Points Dashboard
            yourPoints: 'Your Points',
            rank: 'Rank',
            totalContributions: 'Total Contributions',
            activityFeed: 'Recent Activity',
            leaderboard: 'Top Contributors',
            redeemRewards: 'Redeem Rewards',
            earnedPoints: 'You earned',
            pointsFor: 'points for reporting crowd at',

            // Settings
            settings: 'Settings',
            language: 'Language',
            notifications: 'Notifications',
            english: 'English',
            tamil: 'தமிழ்',

            // Profile
            profile: 'PROFILE',
            welcomeTitle: 'Welcome to PulseTN',
            welcomeSubtitle: 'Sign in to unlock rewards, save favorites, and track your contributions',
            continueWithGoogle: 'Continue with Google',
            termsNotice: 'By continuing, you agree to our Terms of Service',
            preferences: 'Preferences',
            editProfile: 'Edit Profile',
            signOut: 'Sign Out',
            memberSince: 'Member since',
            contributions: 'Contributions',
            redeem: 'Redeem',
            locked: 'Locked',
            you: 'you',
            general: 'general',

            // Phone Auth
            loginWithPhone: 'Login with Phone',
            enterMobile: 'Enter your mobile number to get OTP',
            phonePlaceholder: 'Phone Number (10 digits)',
            getOTP: 'Get OTP',
            sending: 'Sending...',
            verifyOTP: 'Verify OTP',
            enterCode: 'Enter the 6-digit code sent to',
            otpPlaceholder: 'OTP (123456)',
            verifying: 'Verifying...',
            changePhone: 'Change Phone Number',
            completeProfile: 'Complete Profile',
            enterName: 'Tell us your name to finish setup',
            namePlaceholder: 'Your Name',
            saving: 'Saving...',
            getStarted: 'Get Started',
            invalidPhone: 'Please enter a valid 10-digit phone number',
            invalidOTP: 'Please enter 6-digit OTP',
            enterYourName: 'Please enter your name'
        }
    },
    ta: {
        translation: {
            // Navigation
            home: 'முகப்பு',
            pulse: 'துடிப்பு',
            guides: 'வழிகாட்டிகள்',
            points: 'புள்ளிகள்',

            // Home Screen
            appTitle: 'PulseTN',
            appSubtitle: 'தமிழக சுற்றுலா • நேரடி',
            searchPlaceholder: 'இடங்களைத் தேடுங்கள்...',
            chooseVibe: 'உங்கள் விருப்பத்தைத் தேர்வு செய்யவும்',
            trendingNear: 'உங்களுக்கு அருகில் பிரபலமானவை',

            // Intents
            peace: 'அமைதி',
            spiritual: 'ஆன்மீகம்',
            food: 'உணவு',
            lowCrowd: 'குறைந்த கூட்டம்',

            // Pulse Screen
            livePulse: 'நேரடி உள்ளூர் துடிப்பு',
            autoUpdate: 'நேரடி',
            all: 'அனைத்தும்',
            smartPick: 'சிறந்த தேர்வு',
            perfectFor: 'சரியானது',
            details: 'விவரங்கள்',

            // Destination Details
            topDestination: 'சிறந்த இடம்',
            crowd: 'கூட்டம்',
            comfort: 'வசதி',
            whyWorks: 'இது ஏன் இப்போது சிறந்தது:',
            experiencing: 'தற்போது',
            crowds: 'கூட்டம் உள்ளது.',
            experience: 'அனுபவத்திற்கு இந்த நேரம் சரியானது.',
            startJourney: 'பயணத்தைத் தொடங்கு',
            alternativeChoice: 'மாற்று தேர்வு',
            back: 'பின் செல்',

            // Guides Screen
            localExperts: 'உள்ளூர் நிபுணர்கள்',
            availableNow: 'இப்போது கிடைக்கிறது',
            busy: 'பிஸி',
            request: 'கோரிக்கை',

            // Crowd Status
            low: 'குறைவு',
            medium: 'நடுத்தர',
            high: 'அதிகம்',

            // Points Dashboard
            yourPoints: 'உங்கள் புள்ளிகள்',
            rank: 'தரவரிசை',
            totalContributions: 'மொத்த பங்களிப்புகள்',
            activityFeed: 'சமீபத்திய செயல்பாடு',
            leaderboard: 'முன்னணி பங்களிப்பாளர்கள்',
            redeemRewards: 'பரிசுகளை மீட்டெடு',
            earnedPoints: 'நீங்கள்',
            pointsFor: 'புள்ளிகள் பெற்றுள்ளீர்கள், இதற்காக',

            // Settings
            settings: 'அமைப்புகள்',
            language: 'மொழி',
            notifications: 'அறிவிப்புகள்',
            english: 'English',
            tamil: 'தமிழ்',

            // Profile
            profile: 'சுயவிவரம்',
            welcomeTitle: 'PulseTN-க்கு நல்வரவு',
            welcomeSubtitle: 'வெகுமதிகளைத் திறக்க, பிடித்தவற்றைச் சேமிக்க மற்றும் உங்கள் பங்களிப்புகளைக் கண்காணிக்க உள்நுழையவும்',
            continueWithGoogle: 'Google உடன் தொடரவும்',
            termsNotice: 'தொடர்வதன் மூலம், எங்கள் சேவை விதிமுறைகளை ஒப்புக்கொள்கிறீர்கள்',
            preferences: 'விருப்பத்தேர்வுகள்',
            editProfile: 'சுயவிவரத்தைத் திருத்து',
            signOut: 'வெளியேறு',
            memberSince: 'உறுப்பினர் முதல்',
            contributions: 'பங்களிப்புகள்',
            redeem: 'மீட்டெடு',
            locked: 'பூட்டப்பட்டது',
            you: 'உங்களுக்கு',
            general: 'பொதுவானது',

            // Phone Auth
            loginWithPhone: 'தொலைபேசி மூலம் உள்நுழை',
            enterMobile: 'OTP பெற உங்கள் மொபைல் எண்ணை உள்ளிடவும்',
            phonePlaceholder: 'மொபைல் எண் (10 இலக்கங்கள்)',
            getOTP: 'OTP பெறுக',
            sending: 'அனுப்புகிறது...',
            verifyOTP: 'OTP சரிபார்',
            enterCode: 'அனுப்பப்பட்ட 6-இலக்க குறியீட்டை உள்ளிடவும்',
            otpPlaceholder: 'OTP (123456)',
            verifying: 'சரிபார்க்கிறது...',
            changePhone: 'மொபைல் எண்ணை மாற்றவும்',
            completeProfile: 'சுயவிவரத்தை முடிக்கவும்',
            enterName: 'உங்கள் பெயரைக் கூறவும்',
            namePlaceholder: 'உங்கள் பெயர்',
            saving: 'சேமிக்கிறது...',
            getStarted: 'தொடங்கவும்',
            invalidPhone: 'சரியான 10-இலக்க மொபைல் எண்ணை உள்ளிடவும்',
            invalidOTP: '6-இலக்க OTP ஐ உள்ளிடவும்',
            enterYourName: 'உங்கள் பெயரை உள்ளிடவும்'
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'en',
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
