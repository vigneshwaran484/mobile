import React, { useState, useEffect, useMemo } from 'react';
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
  Search
} from 'lucide-react-native';
import { DESTINATIONS, GUIDES, getLivePulse } from './mockData';

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
  const [activeTab, setActiveTab] = useState('home');
  const [selectedIntent, setSelectedIntent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [liveData, setLiveData] = useState(getLivePulse(DESTINATIONS));
  const [showRecommendation, setShowRecommendation] = useState(false);

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
    if (!selectedIntent) return null;
    const sorted = [...filteredData].sort((a, b) => {
      if (a.currentCrowd !== b.currentCrowd) return a.currentCrowd - b.currentCrowd;
      return b.comfortScore - a.comfortScore;
    });
    return { best: sorted[0], backup: sorted[1] };
  }, [selectedIntent, filteredData]);

  const renderContent = () => {
    if (activeTab === 'home') {
      return (
        <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>Pulse<Text style={{ color: '#fbbf24' }}>TN</Text></Text>
            <Text style={styles.subTitle}>Tamil Nadu Tourism • Real-time</Text>
          </View>

          <View style={styles.searchBar}>
            <Search size={18} color="#94a3b8" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search destinations..."
              placeholderTextColor="#64748b"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

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
            <Text style={styles.sectionTitle}>Trending Near You</Text>
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
            <Text style={styles.pageTitle}>Live Local Pulse</Text>
            <View style={styles.updateBadge}><Text style={styles.updateBadgeText}>LIVE</Text></View>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
            <TouchableOpacity
              onPress={() => setSelectedIntent(null)}
              style={[styles.chip, !selectedIntent && styles.chipActive]}
            >
              <Text style={[styles.chipText, !selectedIntent && styles.chipTextActive]}>All</Text>
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
                <View style={styles.heroTag}><Text style={styles.heroTagText}>SMART PICK</Text></View>
                <Text style={styles.heroTitle}>{recommendation.best.name}</Text>
                <View style={styles.heroMeta}>
                  <View style={styles.metricItem}>
                    <CheckCircle2 size={16} color="#34d399" />
                    <Text style={styles.heroMetaText}>Perfect for {selectedIntent?.label || 'you'}</Text>
                  </View>
                  <ChevronRight size={18} color="#fbbf24" />
                </View>
              </TouchableOpacity>
            )}

            <View style={{ gap: 15 }}>
              {filteredData.map(dest => <DestinationCard key={dest.id} dest={dest} onPress={() => { }} />)}
            </View>
          </ScrollView>
        </View>
      );
    }

    if (activeTab === 'guides') {
      return (
        <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
          <Text style={styles.pageTitle}>Local Experts</Text>
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
          <Text style={[styles.navText, activeTab === 'home' && styles.navTextActive]}>HOME</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('pulse')}>
          <Map size={24} color={activeTab === 'pulse' ? '#fbbf24' : '#64748b'} />
          <Text style={[styles.navText, activeTab === 'pulse' && styles.navTextActive]}>PULSE</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('guides')}>
          <Compass size={24} color={activeTab === 'guides' ? '#fbbf24' : '#64748b'} />
          <Text style={[styles.navText, activeTab === 'guides' && styles.navTextActive]}>GUIDES</Text>
        </TouchableOpacity>
      </View>

      {/* Recommendation Modal */}
      <Modal visible={showRecommendation} animationType="slide" transparent={false}>
        <View style={styles.modalContainer}>
          <SafeAreaView style={{ flex: 1 }}>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setShowRecommendation(false)}>
              <ArrowLeft size={24} color="#fff" />
              <Text style={styles.closeBtnText}>Back</Text>
            </TouchableOpacity>

            <ScrollView contentContainerStyle={styles.modalContent}>
              <View style={[styles.glassCard, styles.modalHero]}>
                <Text style={styles.modalHeroTag}>TOP DESTINATION</Text>
                <Text style={styles.modalHeroTitle}>{recommendation?.best.name}</Text>
                <Text style={styles.modalHeroDesc}>{recommendation?.best.description}</Text>

                <View style={styles.modalStats}>
                  <View style={styles.modalStatItem}>
                    <Text style={styles.statLabel}>CROWD</Text>
                    <Text style={styles.statValue}>{recommendation?.best.currentCrowd}%</Text>
                  </View>
                  <View style={styles.modalStatItem}>
                    <Text style={styles.statLabel}>COMFORT</Text>
                    <Text style={styles.statValue}>{recommendation?.best.comfortScore}/5</Text>
                  </View>
                </View>

                <View style={styles.whyBox}>
                  <Text style={styles.whyTitle}>Why this works now:</Text>
                  <Text style={styles.whyText}>
                    Currently experiencing {recommendation?.best.crowdStatus} crowds. Perfect for a {selectedIntent?.label.toLowerCase()} experience at this hour.
                  </Text>
                </View>
              </View>

              <TouchableOpacity style={styles.mainBtn}>
                <Navigation size={20} color="#000" />
                <Text style={styles.mainBtnText}>Start Journey</Text>
              </TouchableOpacity>

              <Text style={styles.sectionTitle}>Alternative Choice</Text>
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
    marginBottom: 30
  },
  searchText: { color: '#94a3b8', fontSize: 15 },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
    padding: 0 // Remove default vertical padding on Android
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
  mainBtnText: { color: '#000', fontSize: 18, fontWeight: '900' }
});
