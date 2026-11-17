import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import COLORS from '../constants/colors';
import { useApp } from '../context/AppContext';

const { width, height } = Dimensions.get('window');

const AVATAR_OPTIONS = ['🌱', '🌿', '🌍', '🍃', '🚲', '🦊', '🌺', '🐢'];
const GOAL_OPTIONS = [
  { label: '5 kg', value: 5.0, desc: 'Eco Master (Strict)' },
  { label: '10 kg', value: 10.0, desc: 'Balanced (Recommended)' },
  { label: '15 kg', value: 15.0, desc: 'Moderate' },
  { label: '20 kg', value: 20.0, desc: 'Beginner' },
];

const OnboardingScreen = ({ navigation }) => {
  const { updateProfile } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef(null);

  // Form states on Step 3
  const [userName, setUserName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🌱');
  const [selectedGoal, setSelectedGoal] = useState(10.0);
  const [errorMsg, setErrorMsg] = useState('');

  const handleNext = () => {
    if (currentIndex < 2) {
      scrollRef.current?.scrollTo({
        x: width * (currentIndex + 1),
        animated: true,
      });
      setCurrentIndex(currentIndex + 1);
    } else {
      finishOnboarding();
    }
  };

  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / width);
    if (index !== currentIndex && index >= 0 && index <= 2) {
      setCurrentIndex(index);
    }
  };

  const finishOnboarding = async () => {
    const finalName = userName.trim() || 'Eco Warrior';
    await updateProfile({
      name: finalName,
      avatarEmoji: selectedAvatar,
      dailyGoal: selectedGoal,
      onboarded: true,
      joinedDate: new Date().toISOString(),
    });

    navigation.replace('MainTabs');
  };

  return (
    <LinearGradient
      colors={[COLORS.primaryDark, COLORS.primary, '#388E3C']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.flexOne}
        >
          {/* Header indicator */}
          <View style={styles.topBar}>
            <View style={styles.logoRow}>
              <Text style={styles.logoEmoji}>🌿</Text>
              <Text style={styles.logoText}>GreenStep</Text>
            </View>
            <TouchableOpacity
              onPress={finishOnboarding}
              style={styles.skipBtn}
              activeOpacity={0.7}
            >
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          </View>

          {/* Carousel Pages */}
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleScroll}
            scrollEventThrottle={16}
            style={styles.carousel}
          >
            {/* Page 1 */}
            <View style={[styles.page, { width }]}>
              <View style={styles.heroGraphic}>
                <View style={styles.outerGlow}>
                  <View style={styles.innerGlow}>
                    <Text style={styles.heroEmoji}>🌍</Text>
                  </View>
                </View>
              </View>

              <Text style={styles.heroTitle}>Track Your Carbon Footprint</Text>
              <Text style={styles.heroSubtitle}>
                Every meal, commute, and purchase impacts our planet. Monitor your daily CO₂ emissions
                and make sustainable living simple.
              </Text>

              <View style={styles.benefitBox}>
                <Text style={styles.benefitItem}>✨ Real-time science-backed CO₂ calculation</Text>
                <Text style={styles.benefitItem}>📊 Actionable category breakdowns</Text>
                <Text style={styles.benefitItem}>🎯 Daily emission targets & eco streaks</Text>
              </View>
            </View>

            {/* Page 2 */}
            <View style={[styles.page, { width }]}>
              <View style={styles.categoryGrid}>
                <View style={[styles.catCard, { backgroundColor: '#E3F2FD' }]}>
                  <Text style={styles.catGridEmoji}>🚗</Text>
                  <Text style={styles.catGridTitle}>Transport</Text>
                  <Text style={styles.catGridSub}>Cars, buses, flights</Text>
                </View>
                <View style={[styles.catCard, { backgroundColor: '#FBE9E7' }]}>
                  <Text style={styles.catGridEmoji}>🍽️</Text>
                  <Text style={styles.catGridTitle}>Diet & Food</Text>
                  <Text style={styles.catGridSub}>Meat, dairy, veg</Text>
                </View>
                <View style={[styles.catCard, { backgroundColor: '#FFF9C4' }]}>
                  <Text style={styles.catGridEmoji}>⚡</Text>
                  <Text style={styles.catGridTitle}>Home Energy</Text>
                  <Text style={styles.catGridSub}>AC, heating, laundry</Text>
                </View>
                <View style={[styles.catCard, { backgroundColor: '#F3E5F5' }]}>
                  <Text style={styles.catGridEmoji}>🛍️</Text>
                  <Text style={styles.catGridTitle}>Shopping</Text>
                  <Text style={styles.catGridSub}>Goods & fashion</Text>
                </View>
              </View>

              <Text style={styles.heroTitle}>Log Habits in Seconds</Text>
              <Text style={styles.heroSubtitle}>
                Select an activity, enter distance or units, and see your immediate carbon impact with
                live visual feedback.
              </Text>
            </View>

            {/* Page 3: Setup Profile */}
            <View style={[styles.page, { width }]}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.formContainer}
              >
                <Text style={styles.heroTitle}>Personalize Your Profile</Text>
                <Text style={styles.formSubtitle}>
                  Set your name and choose a daily CO₂ emission budget.
                </Text>

                {/* Avatar selection */}
                <Text style={styles.inputLabel}>Choose Your Avatar</Text>
                <View style={styles.avatarRow}>
                  {AVATAR_OPTIONS.map((emoji) => (
                    <TouchableOpacity
                      key={emoji}
                      style={[
                        styles.avatarBtn,
                        selectedAvatar === emoji && styles.avatarBtnActive,
                      ]}
                      onPress={() => setSelectedAvatar(emoji)}
                    >
                      <Text style={styles.avatarText}>{emoji}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Name input */}
                <Text style={styles.inputLabel}>Your Name or Nickname</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. Alex Green"
                  placeholderTextColor="#A5D6A7"
                  value={userName}
                  onChangeText={setUserName}
                  maxLength={25}
                />

                {/* Daily Goal selection */}
                <Text style={styles.inputLabel}>Daily CO₂ Target</Text>
                <View style={styles.goalGrid}>
                  {GOAL_OPTIONS.map((opt) => (
                    <TouchableOpacity
                      key={opt.value}
                      style={[
                        styles.goalBtn,
                        selectedGoal === opt.value && styles.goalBtnActive,
                      ]}
                      onPress={() => setSelectedGoal(opt.value)}
                    >
                      <Text
                        style={[
                          styles.goalBtnLabel,
                          selectedGoal === opt.value && styles.goalBtnLabelActive,
                        ]}
                      >
                        {opt.label}
                      </Text>
                      <Text
                        style={[
                          styles.goalBtnDesc,
                          selectedGoal === opt.value && styles.goalBtnDescActive,
                        ]}
                      >
                        {opt.desc}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          </ScrollView>

          {/* Bottom Bar: Dots & Action Button */}
          <View style={styles.footer}>
            <View style={styles.dotsRow}>
              {[0, 1, 2].map((idx) => (
                <View
                  key={idx}
                  style={[styles.dot, currentIndex === idx && styles.dotActive]}
                />
              ))}
            </View>

            <TouchableOpacity
              style={styles.actionBtn}
              onPress={handleNext}
              activeOpacity={0.8}
            >
              <Text style={styles.actionBtnText}>
                {currentIndex === 2 ? 'Get Started 🚀' : 'Continue →'}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  flexOne: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 12,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoEmoji: {
    fontSize: 24,
    marginRight: 6,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  skipBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  skipText: {
    color: '#E8F5E9',
    fontSize: 13,
    fontWeight: '600',
  },
  carousel: {
    flex: 1,
  },
  page: {
    paddingHorizontal: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroGraphic: {
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerGlow: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerGlow: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroEmoji: {
    fontSize: 60,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#E8F5E9',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  benefitBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 16,
    padding: 18,
    width: '100%',
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  benefitItem: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
    marginBottom: 24,
  },
  catCard: {
    width: (width - 76) / 2,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  catGridEmoji: {
    fontSize: 32,
    marginBottom: 6,
  },
  catGridTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  catGridSub: {
    fontSize: 11,
    color: COLORS.textLight,
    marginTop: 2,
  },
  formContainer: {
    width: '100%',
    paddingBottom: 20,
  },
  formSubtitle: {
    fontSize: 13,
    color: '#E8F5E9',
    textAlign: 'center',
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#E8F5E9',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 10,
  },
  avatarRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  avatarBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  avatarBtnActive: {
    borderColor: '#FFFFFF',
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    transform: [{ scale: 1.1 }],
  },
  avatarText: {
    fontSize: 22,
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    marginBottom: 10,
  },
  goalGrid: {
    gap: 8,
    marginBottom: 12,
  },
  goalBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  goalBtnActive: {
    borderColor: '#FFFFFF',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  goalBtnLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  goalBtnLabelActive: {
    color: '#FFFFFF',
  },
  goalBtnDesc: {
    fontSize: 11,
    color: '#C8E6C9',
  },
  goalBtnDescActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  dotActive: {
    width: 22,
    backgroundColor: '#FFFFFF',
  },
  actionBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  actionBtnText: {
    color: COLORS.primaryDark,
    fontSize: 15,
    fontWeight: '800',
  },
});
