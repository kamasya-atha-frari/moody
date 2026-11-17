import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import COLORS from '../constants/colors';
import { TIPS } from '../constants/tips';
import TipCard from '../components/TipCard';

const ECO_FACTS = [
  'Switching one beef meal to a plant-based meal saves ~6.1 kg of CO₂ equivalent.',
  'Air-drying laundry instead of machine drying saves up to 1.8 kg CO₂ per load.',
  'Taking the train instead of driving cuts personal commuter emissions by up to 80%.',
  'Keeping your air conditioner at 25°C instead of 20°C saves up to 20% energy.',
];

const DIFFICULTY_FILTERS = [
  { id: 'all', label: 'All Levels' },
  { id: 'easy', label: '🟢 Easy' },
  { id: 'medium', label: '🟡 Medium' },
  { id: 'hard', label: '🔴 Hard' },
];

const TipsScreen = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [expandedId, setExpandedId] = useState(TIPS[0]?.id || null);
  const [factIndex, setFactIndex] = useState(0);

  // Rotate fact every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % ECO_FACTS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const filteredTips = TIPS.filter((tip) => {
    if (selectedDifficulty === 'all') return true;
    return tip.difficulty === selectedDifficulty;
  });

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleShare = () => {
    Alert.alert(
      'Spread Eco Awareness 🌱',
      'Share GreenStep tips with your friends and family to make collective environmental impact!',
      [{ text: 'Copy Link', onPress: () => {} }, { text: 'Done', style: 'cancel' }]
    );
  };

  const totalPotentialSaving = filteredTips.reduce(
    (acc, t) => acc + (parseFloat(t.impactKg) || 0),
    0
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Screen Header */}
      <LinearGradient
        colors={[COLORS.primaryDark, COLORS.primary]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Eco Tips & Insights 💡</Text>
        <Text style={styles.headerSub}>Actionable habits to reduce your environmental footprint</Text>

        {/* Fact Card */}
        <TouchableOpacity
          style={styles.factCard}
          onPress={() => setFactIndex((prev) => (prev + 1) % ECO_FACTS.length)}
          activeOpacity={0.8}
        >
          <View style={styles.factHeader}>
            <Text style={styles.factTitle}>🌍 DID YOU KNOW?</Text>
            <Text style={styles.factCounter}>
              {factIndex + 1}/{ECO_FACTS.length} ↻
            </Text>
          </View>
          <Text style={styles.factText}>{ECO_FACTS[factIndex]}</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Filter Tabs */}
      <View style={styles.filterBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {DIFFICULTY_FILTERS.map((f) => {
            const isSelected = selectedDifficulty === f.id;
            return (
              <TouchableOpacity
                key={f.id}
                style={[styles.filterBtn, isSelected && styles.filterBtnActive]}
                onPress={() => setSelectedDifficulty(f.id)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.filterBtnText,
                    isSelected && styles.filterBtnTextActive,
                  ]}
                >
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Potential Savings Banner */}
      <View style={styles.savingsBanner}>
        <Text style={styles.savingsLabel}>
          Potential Monthly Savings ({filteredTips.length} tips):
        </Text>
        <Text style={styles.savingsValue}>
          ~{totalPotentialSaving.toFixed(1)} kg CO₂/mo
        </Text>
      </View>

      {/* Tips List */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredTips.map((tip) => (
          <TipCard
            key={tip.id}
            tip={tip}
            expanded={expandedId === tip.id}
            onPress={() => toggleExpand(tip.id)}
          />
        ))}

        {/* Motivational Share Section */}
        <View style={styles.shareCard}>
          <Text style={styles.shareEmoji}>🌱</Text>
          <Text style={styles.shareTitle}>Small steps lead to massive change.</Text>
          <Text style={styles.shareSubtitle}>
            If 1,000 students adopt just two of these habits, over 30 tonnes of CO₂ emissions are
            prevented every year!
          </Text>
          <TouchableOpacity
            style={styles.shareBtn}
            onPress={handleShare}
            activeOpacity={0.8}
          >
            <Text style={styles.shareBtnText}>Share Tips with Friends 📢</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TipsScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 36 : 14,
    paddingBottom: 18,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  headerSub: {
    fontSize: 12,
    color: '#C8E6C9',
    textAlign: 'center',
    marginTop: 2,
    marginBottom: 12,
  },
  factCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  factHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  factTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFF59D',
    letterSpacing: 0.8,
  },
  factCounter: {
    fontSize: 11,
    color: '#E8F5E9',
    fontWeight: '600',
  },
  factText: {
    fontSize: 13,
    color: '#FFFFFF',
    lineHeight: 18,
    fontWeight: '500',
  },
  filterBar: {
    backgroundColor: COLORS.surface,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterBtn: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  filterBtnTextActive: {
    color: '#FFFFFF',
  },
  savingsBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 8,
    backgroundColor: '#FAFFF5',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  savingsLabel: {
    fontSize: 11,
    color: COLORS.textLight,
  },
  savingsValue: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 36,
  },
  shareCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  shareEmoji: {
    fontSize: 32,
    marginBottom: 6,
  },
  shareTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textDark,
    textAlign: 'center',
    marginBottom: 6,
  },
  shareSubtitle: {
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  shareBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  shareBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
});
