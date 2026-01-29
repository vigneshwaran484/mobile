import React, { useState, useEffect, useMemo } from 'react';
import './i18n'; // Initialize i18n
import { useTranslation } from 'react-i18next';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  StatusBar as RNStatusBar,
  Modal,
  TextInput
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Heart,
  Sparkles,
  Utensils,
  Users,
  ChevronRight,
  Clock,
  ArrowLeft,
  Navigation,
  CheckCircle2,
  User,
  Zap,
  Home as HomeIcon,
  Map,
  Compass,
  Search,
  Award,
  TrendingUp,
  Gift,
  AlertCircle,
  Settings as SettingsIcon,
  Globe
} from 'lucide-react-native';
import { DESTINATIONS, GUIDES, getLivePulse } from './mockData';
import { MOCK_USER_POINTS, MOCK_ACTIVITY, MOCK_LEADERBOARD, MOCK_REWARDS } from './mockGamification';
import { MOCK_USER } from './mockUser';
import { sendOTP, verifyOTP, saveUserProfile } from './authService';

const { width, height } = Dimensions.get('window');

// --- Components ---

const IntentCard = ({ intent, isSelected, onClick }) => (
  <TouchableOpacity
    activeOpacity={0.8}
    onPress={onClick}
    style={[
      styles.glassCard,
      styles.intentCard,
      isSelected && { borderColor: intent.color, borderWidth: 2 }
    ]}
  >
    <View style={[styles.iconContainer, { backgroundColor: `${intent.color}20` }]}>
      <intent.iconComponent size={28} color={intent.color} />
    </View>
    <Text style={styles.intentLabel}>{intent.label}</Text>
  </TouchableOpacity>
);

const DestinationCard = ({ dest, onPress }) => (
  <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={styles.glassCard}>
    <View style={styles.cardHeader}>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>{dest.name}</Text>
        <Text style={styles.cardSubTitle}>{dest.location}</Text>
      </View>
      <View style={[styles.badge, styles[`badge${dest.crowdStatus}`]]}>
        <Text style={[styles.badgeText, styles[`badgeText${dest.crowdStatus}`]]}>{dest.crowdStatus}</Text>
      </View>
    </View>
    <View style={styles.cardFooter}>
      <View style={styles.metrics}>
        <View style={styles.metricItem}>
          <Zap size={14} color="#fbbf24" />
          <Text style={styles.metricText}>{dest.comfortScore}/5</Text>
        </View>
        <View style={styles.metricItem}>
          <Clock size={14} color="#94a3b8" />
          <Text style={styles.metricText}>{dest.lastUpdated}</Text>
        </View>
      </View>
      <ChevronRight size={18} color="#475569" />
    </View>
  </TouchableOpacity>
);

const GuideCard = ({ guide }) => (
  <View style={styles.glassCard}>
    <View style={styles.guideInfo}>
      <View style={styles.guideAvatar}>
        <User size={32} color="#60a5fa" />
      </View>
      <View style={{ flex: 1 }}>
        <View style={styles.guideHeader}>
          <Text style={styles.guideName}>{guide.name}</Text>
          <Text style={styles.guideRating}>★ {guide.rating}</Text>
        </View>
        <Text style={styles.guideSpeciality}>{guide.speciality}</Text>
        <View style={styles.langTags}>
          {guide.languages.map(l => (
            <View key={l} style={styles.langTag}><Text style={styles.langTagText}>{l}</Text></View>
          ))}
        </View>
      </View>
    </View>
    <View style={styles.guideFooter}>
      <Text style={[styles.availability, { color: guide.available ? '#34d399' : '#94a3b8' }]}>
        {guide.available ? '● AVAILABLE NOW' : '○ BUSY'}
      </Text>
      <TouchableOpacity style={styles.guideBtn}>
        <Text style={styles.guideBtnText}>Request</Text>
      </TouchableOpacity>
    </View>
  </View>
);

// --- Main App ---

export default function App() {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('home');
  const [selectedIntent, setSelectedIntent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [liveData, setLiveData] = useState(getLivePulse(DESTINATIONS));
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [currentSelectedDest, setCurrentSelectedDest] = useState(null);
  const [user, setUser] = useState(MOCK_USER);
  const [authStep, setAuthStep] = useState('phone'); // 'phone' | 'otp' | 'profile'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ta' : 'en';
    i18n.changeLanguage(newLang);
  };

  const handleSendOTP = async () => {
    if (phoneNumber.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit phone number');
      return;
    }
    setIsLoading(true);
    setErrorMessage('');
    const result = await sendOTP(phoneNumber);
    setIsLoading(false);
    if (result.success) {
      setAuthStep('otp');
    } else {
      setErrorMessage(result.message);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setErrorMessage('Please enter 6-digit OTP');
      return;
    }
    setIsLoading(true);
    setErrorMessage('');
    const result = await verifyOTP(phoneNumber, otp);
    setIsLoading(false);
    if (result.success) {
      setAuthStep('profile');
    } else {
      setErrorMessage(result.message || 'Invalid OTP');
    }
  };

  const handleCompleteProfile = async () => {
    if (!userName.trim()) {
      setErrorMessage('Please enter your name');
      return;
    }
    setIsLoading(true);
    const userData = {
      name: userName,
      phone: phoneNumber,
      id: `user_${phoneNumber.slice(-4)}`,
      email: `${phoneNumber}@pulsetn.app`,
      joined: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      isAuthenticated: true
    };
    await saveUserProfile(userData.id, userData);
    setUser(userData);
    setIsLoading(false);
    // Reset form
    setAuthStep('phone');
    setPhoneNumber('');
    setOtp('');
    setUserName('');
  };

  const handleSignOut = () => {
    setUser({ ...MOCK_USER, isAuthenticated: false });
    setAuthStep('phone');
    setPhoneNumber('');
    setOtp('');
    setUserName('');
    setErrorMessage('');
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData(getLivePulse(DESTINATIONS));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const intents = [
    { id: 'Peace', iconComponent: Heart, label: 'Peace', color: '#60a5fa' },
    { id: 'Spiritual', iconComponent: Sparkles, label: 'Spiritual', color: '#fbbf24' },
    { id: 'Food', iconComponent: Utensils, label: 'Food', color: '#34d399' },
    { id: 'Low Crowd', iconComponent: Users, label: 'Low Crowd', color: '#a78bfa' },
  ];

  const filteredData = useMemo(() => {
    let data = liveData;
    if (selectedIntent) {
      data = data.filter(d => d.category === selectedIntent.id);
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      data = data.filter(d =>
        d.name.toLowerCase().includes(query) ||
        d.location.toLowerCase().includes(query) ||
        d.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    return data;
  }, [selectedIntent, searchQuery, liveData]);

  const recommendation = useMemo(() => {
    const dataToUse = currentSelectedDest ? [currentSelectedDest] : filteredData;
    const sorted = [...dataToUse].sort((a, b) => {
      if (a.currentCrowd !== b.currentCrowd) return a.currentCrowd - b.currentCrowd;
      return b.comfortScore - a.comfortScore;
    });
    return { best: sorted[0], backup: sorted[1] || sorted[0] };
  }, [currentSelectedDest, filteredData]);

  const suggestions = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) return [];
    const query = searchQuery.toLowerCase();
    return liveData
      .filter(d =>
        d.name.toLowerCase().includes(query) ||
        d.location.toLowerCase().includes(query)
      )
      .slice(0, 5);
  }, [searchQuery, liveData]);

  const handleSelectSuggestion = (dest) => {
    setSearchQuery(dest.name);
    setCurrentSelectedDest(dest);
    setIsSearchFocused(false);
    setShowRecommendation(true);
  };

  const renderContent = () => {
    if (activeTab === 'home') {
      return (
        <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>Pulse<Text style={{ color: '#fbbf24' }}>TN</Text></Text>
            <Text style={styles.subTitle}>{t('appSubtitle')}</Text>
          </View>

          <View style={[styles.searchBar, isSearchFocused && styles.searchBarActive]}>
            <Search size={18} color={isSearchFocused ? "#fbbf24" : "#94a3b8"} />
            <TextInput
              style={styles.searchInput}
              placeholder={t('searchPlaceholder')}
              placeholderTextColor="#64748b"
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text);
                if (currentSelectedDest) setCurrentSelectedDest(null);
              }}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            />
          </View>

          {isSearchFocused && suggestions.length > 0 && (
            <View style={styles.suggestionsContainer}>
              {suggestions.map(dest => (
                <TouchableOpacity
                  key={dest.id}
                  style={styles.suggestionItem}
                  onPress={() => handleSelectSuggestion(dest)}
                >
                  <Map size={16} color="#fbbf24" style={{ marginRight: 10 }} />
                  <View>
                    <Text style={styles.suggestionName}>{dest.name}</Text>
                    <Text style={styles.suggestionLoc}>{dest.location}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <Text style={styles.sectionTitle}>Choose your vibe</Text>
          <View style={styles.intentGrid}>
            {intents.map(intent => (
              <IntentCard
                key={intent.id}
                intent={intent}
                isSelected={selectedIntent?.id === intent.id}
                onClick={() => {
                  setSelectedIntent(intent);
                  setActiveTab('pulse');
                }}
              />
            ))}
          </View>

          <View style={{ marginTop: 40 }}>
            <Text style={styles.sectionTitle}>{t('trendingNear')}</Text>
            <View style={styles.glassCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
                <View style={styles.trendingIcon}><Map size={24} color="#60a5fa" /></View>
                <View>
                  <Text style={styles.cardTitle}>Shore Temple</Text>
                  <Text style={styles.cardSubTitle}>Mahabalipuram • 2km away</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      );
    }

    if (activeTab === 'pulse') {
      return (
        <View style={styles.container}>
          <View style={styles.pulseHeader}>
            <Text style={styles.pageTitle}>{t('livePulse')}</Text>
            <View style={styles.updateBadge}><Text style={styles.updateBadgeText}>LIVE</Text></View>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
            <TouchableOpacity
              onPress={() => setSelectedIntent(null)}
              style={[styles.chip, !selectedIntent && styles.chipActive]}
            >
              <Text style={[styles.chipText, !selectedIntent && styles.chipTextActive]}>{t('all')}</Text>
            </TouchableOpacity>
            {intents.map(intent => (
              <TouchableOpacity
                key={intent.id}
                onPress={() => setSelectedIntent(intent)}
                style={[styles.chip, selectedIntent?.id === intent.id && styles.chipActive]}
              >
                <Text style={[styles.chipText, selectedIntent?.id === intent.id && styles.chipTextActive]}>{intent.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
            {recommendation?.best && (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => setShowRecommendation(true)}
                style={[styles.glassCard, styles.heroCard]}
              >
                <LinearGradient
                  colors={['rgba(251, 191, 36, 0.15)', 'transparent']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
                <View style={styles.heroTag}><Text style={styles.heroTagText}>{t('smartPick')}</Text></View>
                <Text style={styles.heroTitle}>{recommendation.best.name}</Text>
                <View style={styles.heroMeta}>
                  <View style={styles.metricItem}>
                    <CheckCircle2 size={16} color="#34d399" />
                    <Text style={styles.heroMetaText}>{t('perfectFor')} {selectedIntent?.label || t('you')}</Text>
                  </View>
                  <ChevronRight size={18} color="#fbbf24" />
                </View>
              </TouchableOpacity>
            )}

            <View style={{ gap: 15 }}>
              {filteredData.map(dest => (
                <DestinationCard
                  key={dest.id}
                  dest={dest}
                  onPress={() => {
                    setCurrentSelectedDest(dest);
                    setShowRecommendation(true);
                  }}
                />
              ))}
            </View>
          </ScrollView>
        </View>
      );
    }

    if (activeTab === 'points') {
      return (
        <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
          {/* Header with Points and Rank */}
          <View style={styles.pointsHeader}>
            <View style={styles.pointsMainCard}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View>
                  <Text style={styles.pointsLabel}>{t('yourPoints')}</Text>
                  <Text style={styles.pointsValue}>{MOCK_USER_POINTS.total.toLocaleString()}</Text>
                  <View style={{ flexDirection: 'row', gap: 15, marginTop: 10 }}>
                    <View>
                      <Text style={styles.statsLabel}>{t('rank')}</Text>
                      <Text style={styles.statsValue}>#{MOCK_USER_POINTS.rank}</Text>
                    </View>
                    <View>
                      <Text style={styles.statsLabel}>{t('contributions')}</Text>
                      <Text style={styles.statsValue}>{MOCK_USER_POINTS.contributions}</Text>
                    </View>
                  </View>
                </View>
                <Award size={48} color="#fbbf24" />
              </View>
            </View>
          </View>

          {/* Activity Feed */}
          <View style={styles.section}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
              <Text style={styles.sectionTitle}>{t('activityFeed')}</Text>
              <TrendingUp size={20} color="#34d399" />
            </View>
            {MOCK_ACTIVITY.map(activity => (
              <View key={activity.id} style={styles.activityCard}>
                <View style={[styles.activityIcon,
                activity.type === 'earned' && { backgroundColor: 'rgba(52, 211, 153, 0.2)' },
                activity.type === 'penalty' && { backgroundColor: 'rgba(239, 68, 68, 0.2)' },
                activity.type === 'bonus' && { backgroundColor: 'rgba(251, 191, 36, 0.2)' }
                ]}>
                  {activity.type === 'earned' && <Zap size={20} color="#34d399" />}
                  {activity.type === 'penalty' && <AlertCircle size={20} color="#ef4444" />}
                  {activity.type === 'bonus' && <Gift size={20} color="#fbbf24" />}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.activityTitle}>
                    {activity.type === 'earned' && `+${activity.points} ${t('points')}`}
                    {activity.type === 'penalty' && `${activity.points} ${t('points')}`}
                    {activity.type === 'bonus' && `+${activity.points} ${t('points')}`}
                  </Text>
                  <Text style={styles.activityDesc}>
                    {activity.location || activity.reason}
                  </Text>
                  <Text style={styles.activityTime}>{activity.time}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Leaderboard */}
          <View style={styles.section}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
              <Text style={styles.sectionTitle}>{t('leaderboard')}</Text>
              <Award size={20} color="#fbbf24" />
            </View>
            {MOCK_LEADERBOARD.map(user => (
              <View
                key={user.rank}
                style={[
                  styles.leaderboardCard,
                  user.isCurrentUser && { backgroundColor: 'rgba(251, 191, 36, 0.1)', borderColor: '#fbbf24' }
                ]}
              >
                <Text style={styles.leaderboardRank}>{user.rank}</Text>
                <Text style={styles.leaderboardAvatar}>{user.avatar}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.leaderboardName, user.isCurrentUser && { color: '#fbbf24' }]}>
                    {user.name}
                  </Text>
                  <Text style={styles.leaderboardStats}>{user.contributions} {t('contributions')}</Text>
                </View>
                <Text style={[styles.leaderboardPoints, user.isCurrentUser && { color: '#fbbf24' }]}>
                  {user.points.toLocaleString()}
                </Text>
              </View>
            ))}
          </View>

          {/* Rewards */}
          <View style={styles.section}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
              <Text style={styles.sectionTitle}>{t('redeemRewards')}</Text>
              <Gift size={20} color="#fbbf24" />
            </View>
            <View style={{ gap: 15 }}>
              {MOCK_REWARDS.map(reward => (
                <View key={reward.id} style={styles.rewardCard}>
                  <Text style={styles.rewardIcon}>{reward.icon}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.rewardTitle}>{reward.title}</Text>
                    <Text style={styles.rewardDesc}>{reward.description}</Text>
                    <Text style={styles.rewardPoints}>{reward.points} {t('points')}</Text>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.redeemBtn,
                      !reward.available && styles.redeemBtnDisabled
                    ]}
                    disabled={!reward.available}
                  >
                    <Text style={[
                      styles.redeemBtnText,
                      !reward.available && styles.redeemBtnTextDisabled
                    ]}>
                      {reward.available ? t('redeem') : t('locked')}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>

        </ScrollView>
      );
    }

    if (activeTab === 'profile') {
      return (
        <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
          {!user.isAuthenticated ? (
            // Not Logged In - Show Sign In UI
            <View style={styles.authContainer}>
              <View style={styles.authCard}>
                {authStep === 'phone' && (
                  <>
                    <User size={64} color="#fbbf24" style={{ alignSelf: 'center', marginBottom: 20 }} />
                    <Text style={styles.authTitle}>{t('loginWithPhone')}</Text>
                    <Text style={styles.authSubtitle}>{t('enterMobile')}</Text>

                    <TextInput
                      style={styles.authInput}
                      placeholder={t('phonePlaceholder')}
                      placeholderTextColor="#64748b"
                      keyboardType="phone-pad"
                      maxLength={10}
                      value={phoneNumber}
                      onChangeText={setPhoneNumber}
                    />

                    {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

                    <TouchableOpacity style={styles.mainBtn} onPress={handleSendOTP} disabled={isLoading}>
                      <Text style={styles.mainBtnText}>{isLoading ? t('sending') : t('getOTP')}</Text>
                    </TouchableOpacity>
                  </>
                )}

                {authStep === 'otp' && (
                  <>
                    <User size={64} color="#fbbf24" style={{ alignSelf: 'center', marginBottom: 20 }} />
                    <Text style={styles.authTitle}>{t('verifyOTP')}</Text>
                    <Text style={styles.authSubtitle}>{t('enterCode')} {phoneNumber}</Text>

                    <TextInput
                      style={styles.authInput}
                      placeholder={t('otpPlaceholder')}
                      placeholderTextColor="#64748b"
                      keyboardType="number-pad"
                      maxLength={6}
                      value={otp}
                      onChangeText={setOtp}
                    />

                    {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

                    <TouchableOpacity style={styles.mainBtn} onPress={handleVerifyOTP} disabled={isLoading}>
                      <Text style={styles.mainBtnText}>{isLoading ? t('verifying') : t('verifyOTP')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setAuthStep('phone')}>
                      <Text style={styles.authLink}>{t('changePhone')}</Text>
                    </TouchableOpacity>
                  </>
                )}

                {authStep === 'profile' && (
                  <>
                    <View style={styles.profileAvatar}>
                      <User size={48} color="#fbbf24" />
                    </View>
                    <Text style={styles.authTitle}>{t('completeProfile')}</Text>
                    <Text style={styles.authSubtitle}>{t('enterName')}</Text>

                    <TextInput
                      style={styles.authInput}
                      placeholder={t('namePlaceholder')}
                      placeholderTextColor="#64748b"
                      value={userName}
                      onChangeText={setUserName}
                    />

                    {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

                    <TouchableOpacity style={styles.mainBtn} onPress={handleCompleteProfile} disabled={isLoading}>
                      <Text style={styles.mainBtnText}>{isLoading ? t('saving') : t('getStarted')}</Text>
                    </TouchableOpacity>
                  </>
                )}

                <Text style={styles.authNote}>{t('termsNotice')}</Text>
              </View>

              {/* Language Settings */}
              <View style={styles.section}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                  <Text style={styles.sectionTitle}>{t('preferences')}</Text>
                  <SettingsIcon size={20} color="#94a3b8" />
                </View>
                <View style={styles.settingsCard}>
                  <Globe size={20} color="#94a3b8" />
                  <Text style={styles.settingsLabel}>{t('language')}</Text>
                  <View style={{ flex: 1 }} />
                  <TouchableOpacity style={styles.langBtn} onPress={toggleLanguage}>
                    <Text style={styles.langBtnText}>
                      {i18n.language === 'en' ? 'தமிழ்' : 'English'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : (
            // Logged In - Show Profile
            <View>
              {/* Profile Header */}
              <View style={styles.profileHeader}>
                <View style={styles.profileAvatar}>
                  <User size={48} color="#fbbf24" />
                </View>
                <Text style={styles.profileName}>{user.name}</Text>
                <Text style={styles.profileEmail}>{user.email}</Text>
                <Text style={styles.profileJoined}>{t('memberSince')} {user.joined}</Text>
              </View>

              {/* Stats */}
              <View style={styles.profileStats}>
                <View style={styles.profileStatItem}>
                  <Text style={styles.profileStatValue}>{MOCK_USER_POINTS.total.toLocaleString()}</Text>
                  <Text style={styles.profileStatLabel}>{t('yourPoints')}</Text>
                </View>
                <View style={styles.profileStatDivider} />
                <View style={styles.profileStatItem}>
                  <Text style={styles.profileStatValue}>#{MOCK_USER_POINTS.rank}</Text>
                  <Text style={styles.profileStatLabel}>{t('rank')}</Text>
                </View>
                <View style={styles.profileStatDivider} />
                <View style={styles.profileStatItem}>
                  <Text style={styles.profileStatValue}>{MOCK_USER_POINTS.contributions}</Text>
                  <Text style={styles.profileStatLabel}>{t('totalContributions')}</Text>
                </View>
              </View>

              {/* Settings */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t('settings')}</Text>

                <TouchableOpacity style={styles.profileMenuItem}>
                  <User size={20} color="#94a3b8" />
                  <Text style={styles.profileMenuText}>{t('editProfile')}</Text>
                  <ChevronRight size={20} color="#64748b" />
                </TouchableOpacity>

                <View style={styles.profileMenuItem}>
                  <Globe size={20} color="#94a3b8" />
                  <Text style={styles.profileMenuText}>{t('language')}</Text>
                  <View style={{ flex: 1 }} />
                  <TouchableOpacity style={styles.langBtn} onPress={toggleLanguage}>
                    <Text style={styles.langBtnText}>
                      {i18n.language === 'en' ? 'தமிழ்' : 'English'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.profileMenuItem}>
                  <AlertCircle size={20} color="#94a3b8" />
                  <Text style={styles.profileMenuText}>{t('notifications')}</Text>
                  <ChevronRight size={20} color="#64748b" />
                </TouchableOpacity>
              </View>

              {/* Danger Zone */}
              <View style={styles.section}>
                <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
                  <Text style={styles.signOutText}>{t('signOut')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      );
    }

    if (activeTab === 'guides') {
      return (
        <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
          <Text style={styles.pageTitle}>{t('localExperts')}</Text>
          <View style={{ gap: 20, marginTop: 10 }}>
            {GUIDES.map(guide => <GuideCard key={guide.id} guide={guide} />)}
          </View>
        </ScrollView>
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <RNStatusBar barStyle="light-content" />
      <LinearGradient colors={['#1e1b4b', '#020617']} style={styles.background} />

      {renderContent()}

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('home')}>
          <HomeIcon size={24} color={activeTab === 'home' ? '#fbbf24' : '#64748b'} />
          <Text style={[styles.navText, activeTab === 'home' && styles.navTextActive]}>{t('home')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('pulse')}>
          <Map size={24} color={activeTab === 'pulse' ? '#fbbf24' : '#64748b'} />
          <Text style={[styles.navText, activeTab === 'pulse' && styles.navTextActive]}>{t('pulse')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('points')}>
          <Award size={24} color={activeTab === 'points' ? '#fbbf24' : '#64748b'} />
          <Text style={[styles.navText, activeTab === 'points' && styles.navTextActive]}>{t('points')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('guides')}>
          <Compass size={24} color={activeTab === 'guides' ? '#fbbf24' : '#64748b'} />
          <Text style={[styles.navText, activeTab === 'guides' && styles.navTextActive]}>{t('guides')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('profile')}>
          <User size={24} color={activeTab === 'profile' ? '#fbbf24' : '#64748b'} />
          <Text style={[styles.navText, activeTab === 'profile' && styles.navTextActive]}>{t('profile')}</Text>
        </TouchableOpacity>
      </View>

      {/* Recommendation Modal */}
      <Modal visible={showRecommendation} animationType="slide" transparent={false}>
        <View style={styles.modalContainer}>
          <SafeAreaView style={{ flex: 1 }}>
            <TouchableOpacity style={styles.closeBtn} onPress={() => {
              setShowRecommendation(false);
              setCurrentSelectedDest(null);
            }}>
              <ArrowLeft size={24} color="#fff" />
              <Text style={styles.closeBtnText}>{t('back')}</Text>
            </TouchableOpacity>

            <ScrollView contentContainerStyle={styles.modalContent}>
              <View style={[styles.glassCard, styles.modalHero]}>
                <Text style={styles.modalHeroTag}>{t('topDestination')}</Text>
                <Text style={styles.modalHeroTitle}>{recommendation?.best.name}</Text>
                <Text style={styles.modalHeroDesc}>{recommendation?.best.description}</Text>

                <View style={styles.modalStats}>
                  <View style={styles.modalStatItem}>
                    <Text style={styles.statLabel}>{t('crowd')}</Text>
                    <Text style={styles.statValue}>{recommendation?.best.currentCrowd}%</Text>
                  </View>
                  <View style={styles.modalStatItem}>
                    <Text style={styles.statLabel}>{t('comfort')}</Text>
                    <Text style={styles.statValue}>{recommendation?.best.comfortScore}/5</Text>
                  </View>
                </View>

                <View style={styles.whyBox}>
                  <Text style={styles.whyTitle}>{t('whyWorks')}</Text>
                  <Text style={styles.whyText}>
                    {t('experiencing')} {recommendation?.best.crowdStatus} {t('crowds')} {t('experience')}
                  </Text>
                </View>
              </View>

              <TouchableOpacity style={styles.mainBtn}>
                <Navigation size={20} color="#000" />
                <Text style={styles.mainBtnText}>{t('startJourney')}</Text>
              </TouchableOpacity>

              <Text style={styles.sectionTitle}>{t('alternativeChoice')}</Text>
              <View style={styles.glassCard}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={styles.cardTitle}>{recommendation?.backup.name}</Text>
                  <ChevronRight size={18} color="#475569" />
                </View>
              </View>
            </ScrollView>
          </SafeAreaView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#020617' },
  background: { ...StyleSheet.absoluteFillObject },
  container: { flex: 1 },
  scrollArea: { flex: 1, padding: 20 },
  header: { marginTop: 20, marginBottom: 30 },
  title: { fontSize: 32, fontWeight: '900', color: '#fff' },
  subTitle: { fontSize: 14, color: '#94a3b8', marginTop: 4 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    padding: 15,
    borderRadius: 16,
    gap: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'transparent'
  },
  searchBarActive: {
    borderColor: '#fbbf24',
    backgroundColor: '#1e293b'
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
    padding: 0
  },
  suggestionsContainer: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    marginTop: -5,
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.3)',
    elevation: 5,
    zIndex: 1000
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)'
  },
  suggestionName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700'
  },
  suggestionLoc: {
    color: '#94a3b8',
    fontSize: 12
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#fff', marginBottom: 15 },
  intentGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 15 },
  intentCard: { width: (width - 55) / 2, padding: 20, alignItems: 'center' },
  iconContainer: { padding: 12, borderRadius: 16, marginBottom: 10 },
  intentLabel: { color: '#fff', fontWeight: '700', fontSize: 16 },
  glassCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    padding: 16,
    overflow: 'hidden'
  },
  trendingIcon: { width: 48, height: 48, borderRadius: 12, backgroundColor: 'rgba(96, 165, 250, 0.1)', alignItems: 'center', justifyContent: 'center' },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 15,
    paddingBottom: 25,
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)'
  },
  navItem: { alignItems: 'center', gap: 4 },
  navText: { fontSize: 10, color: '#64748b', fontWeight: 'bold' },
  navTextActive: { color: '#fbbf24' },
  pulseHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 10 },
  pageTitle: { fontSize: 24, fontWeight: '900', color: '#fff' },
  updateBadge: { backgroundColor: 'rgba(52, 211, 153, 0.15)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  updateBadgeText: { color: '#34d399', fontSize: 11, fontWeight: '900' },
  chipScroll: { paddingHorizontal: 20, marginBottom: 15, flexGrow: 0 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, backgroundColor: '#1e293b', marginRight: 8 },
  chipActive: { backgroundColor: '#fbbf24' },
  chipText: { color: '#94a3b8', fontSize: 14, fontWeight: '600' },
  chipTextActive: { color: '#000' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#fff' },
  cardSubTitle: { fontSize: 12, color: '#94a3b8' },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgeLow: { backgroundColor: 'rgba(52, 211, 153, 0.15)' },
  badgeMedium: { backgroundColor: 'rgba(251, 191, 36, 0.15)' },
  badgeHigh: { backgroundColor: 'rgba(248, 113, 113, 0.15)' },
  badgeText: { fontSize: 10, fontWeight: '900' },
  badgeTextLow: { color: '#34d399' },
  badgeTextMedium: { color: '#fbbf24' },
  badgeTextHigh: { color: '#f87171' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  metrics: { flexDirection: 'row', gap: 15 },
  metricItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metricText: { color: '#e2e8f0', fontSize: 12, fontWeight: '600' },
  heroCard: { marginBottom: 25, borderWidth: 1, borderColor: '#fbbf24' },
  heroTag: { alignSelf: 'flex-start', backgroundColor: '#fbbf24', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginBottom: 8 },
  heroTagText: { color: '#000', fontSize: 10, fontWeight: '900' },
  heroTitle: { fontSize: 20, fontWeight: '800', color: '#fff', marginBottom: 12 },
  heroMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  heroMetaText: { color: '#34d399', fontSize: 14, fontWeight: '600' },
  guideInfo: { flexDirection: 'row', gap: 15 },
  guideAvatar: { width: 64, height: 64, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' },
  guideHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  guideName: { fontSize: 18, fontWeight: '700', color: '#fff' },
  guideRating: { color: '#fbbf24', fontWeight: 'bold' },
  guideSpeciality: { color: '#94a3b8', fontSize: 14, marginVertical: 4 },
  langTags: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', marginTop: 5 },
  langTag: { backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  langTagText: { color: '#cbd5e1', fontSize: 11 },
  guideFooter: { marginTop: 15, paddingTop: 15, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  availability: { fontSize: 12, fontWeight: 'bold' },
  guideBtn: { backgroundColor: '#60a5fa', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 },
  guideBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  modalContainer: { flex: 1, backgroundColor: '#020617' },
  closeBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 20 },
  closeBtnText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  modalContent: { padding: 20 },
  modalHero: { padding: 30, marginBottom: 30, borderWidth: 2, borderColor: '#fbbf24' },
  modalHeroTag: { fontSize: 12, color: '#fbbf24', fontWeight: '900', letterSpacing: 1 },
  modalHeroTitle: { fontSize: 28, fontWeight: '900', color: '#fff', marginVertical: 10 },
  modalHeroDesc: { color: '#94a3b8', fontSize: 16, lineHeight: 24, marginBottom: 25 },
  modalStats: { flexDirection: 'row', gap: 20, marginBottom: 25 },
  modalStatItem: { flex: 1, backgroundColor: 'rgba(255,255,255,0.03)', padding: 15, borderRadius: 20, alignItems: 'center' },
  statLabel: { fontSize: 10, color: '#64748b', marginBottom: 5 },
  statValue: { fontSize: 24, fontWeight: '900', color: '#fff' },
  whyBox: { backgroundColor: 'rgba(251, 191, 36, 0.05)', padding: 15, borderRadius: 16, borderLeftWidth: 4, borderLeftColor: '#fbbf24' },
  whyTitle: { color: '#fbbf24', fontWeight: 'bold', marginBottom: 5 },
  whyText: { color: '#e2e8f0', fontSize: 14 },
  mainBtn: { backgroundColor: '#fbbf24', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 18, borderRadius: 20, marginBottom: 30 },
  mainBtnText: { color: '#000', fontSize: 18, fontWeight: '900' },

  // Points Dashboard Styles
  pointsHeader: { padding: 20, paddingTop: 10 },
  pointsMainCard: { backgroundColor: 'rgba(251, 191, 36, 0.1)', padding: 25, borderRadius: 24, borderWidth: 2, borderColor: '#fbbf24' },
  pointsLabel: { color: '#fbbf24', fontSize: 14, fontWeight: '600', marginBottom: 5 },
  pointsValue: { color: '#fff', fontSize: 52, fontWeight: '900', letterSpacing: -2 },
  statsLabel: { color: '#94a3b8', fontSize: 12, marginBottom: 3 },
  statsValue: { color: '#fff', fontSize: 20, fontWeight: '700' },
  section: { padding: 20, paddingTop: 10 },
  activityCard: { backgroundColor: 'rgba(255,255,255,0.03)', padding: 15, borderRadius: 16, marginBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 12 },
  activityIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  activityTitle: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 3 },
  activityDesc: { color: '#94a3b8', fontSize: 13 },
  activityTime: { color: '#64748b', fontSize: 11, marginTop: 2 },
  leaderboardCard: { backgroundColor: 'rgba(255,255,255,0.03)', padding: 15, borderRadius: 16, marginBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  leaderboardRank: { color: '#64748b', fontSize: 16, fontWeight: '900', width: 30 },
  leaderboardAvatar: { fontSize: 24 },
  leaderboardName: { color: '#fff', fontSize: 15, fontWeight: '600' },
  leaderboardStats: { color: '#64748b', fontSize: 12, marginTop: 2 },
  leaderboardPoints: { color: '#fff', fontSize: 18, fontWeight: '900' },
  rewardCard: { backgroundColor: 'rgba(255,255,255,0.03)', padding: 18, borderRadius: 16, flexDirection: 'row', alignItems: 'center', gap: 15 },
  rewardIcon: { fontSize: 36 },
  rewardTitle: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 3 },
  rewardDesc: { color: '#94a3b8', fontSize: 13, marginBottom: 5 },
  rewardPoints: { color: '#fbbf24', fontSize: 13, fontWeight: '700' },
  redeemBtn: { backgroundColor: '#fbbf24', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  redeemBtnText: { color: '#000', fontWeight: '700', fontSize: 13 },
  redeemBtnDisabled: { backgroundColor: 'rgba(255,255,255,0.1)' },
  redeemBtnTextDisabled: { color: '#64748b' },
  settingsCard: { backgroundColor: 'rgba(255,255,255,0.03)', padding: 18, borderRadius: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
  settingsLabel: { color: '#fff', fontSize: 15, fontWeight: '600' },
  langBtn: { backgroundColor: '#fbbf24', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  langBtnText: { color: '#000', fontWeight: '700', fontSize: 13 },

  // Profile & Auth Styles
  authContainer: { padding: 20, paddingTop: 40 },
  authCard: { backgroundColor: 'rgba(255,255,255,0.03)', padding: 30, borderRadius: 24, borderWidth: 1, borderColor: 'rgba(251, 191, 36, 0.2)' },
  authTitle: { color: '#fff', fontSize: 24, fontWeight: '900', textAlign: 'center', marginBottom: 10 },
  authSubtitle: { color: '#94a3b8', fontSize: 15, textAlign: 'center', lineHeight: 22, marginBottom: 30 },
  googleBtn: { backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 16, gap: 12, marginBottom: 20 },
  googleIcon: { width: 24, height: 24, borderRadius: 4, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center' },
  googleBtnText: { color: '#000', fontSize: 16, fontWeight: '700' },
  authInput: { backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: 16, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', marginBottom: 20 },
  errorText: { color: '#ef4444', fontSize: 14, textAlign: 'center', marginBottom: 15 },
  authLink: { color: '#fbbf24', fontSize: 14, fontWeight: '600', textAlign: 'center', marginTop: 15 },
  authNote: { color: '#64748b', fontSize: 12, textAlign: 'center' },
  profileHeader: { padding: 30, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  profileAvatar: { width: 96, height: 96, borderRadius: 48, backgroundColor: 'rgba(251, 191, 36, 0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 15, borderWidth: 3, borderColor: '#fbbf24' },
  profileName: { color: '#fff', fontSize: 24, fontWeight: '900', marginBottom: 5 },
  profileEmail: { color: '#94a3b8', fontSize: 15, marginBottom: 8 },
  profileJoined: { color: '#64748b', fontSize: 13 },
  profileStats: { flexDirection: 'row', padding: 20, backgroundColor: 'rgba(255,255,255,0.02)' },
  profileStatItem: { flex: 1, alignItems: 'center' },
  profileStatValue: { color: '#fbbf24', fontSize: 28, fontWeight: '900', marginBottom: 5 },
  profileStatLabel: { color: '#94a3b8', fontSize: 12 },
  profileStatDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.1)' },
  profileMenuItem: { backgroundColor: 'rgba(255,255,255,0.03)', padding: 18, borderRadius: 16, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  profileMenuText: { color: '#fff', fontSize: 15, fontWeight: '600', flex: 1 },
  signOutBtn: { backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: 16, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.3)' },
  signOutText: { color: '#ef4444', fontSize: 16, fontWeight: '700' }

});
