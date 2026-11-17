import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  SafeAreaView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import COLORS from '../constants/colors';
import { useApp } from '../context/AppContext';
import { getLifetimeEquivalents } from '../utils/carbonCalculator';
import StatsCard from '../components/StatsCard';
import RadioButtonGroup from '../components/RadioButtonGroup';

const AVATAR_LIST = ['🌱', '🌿', '🌍', '🍃', '🚲', '🦊', '🌺', '🐢', '🐼', '☀️'];
const GOAL_PRESETS = [5, 7.5, 10, 15, 20];

const LANGUAGE_OPTIONS = [
  { value: 'EN', label: 'English (EN)', emoji: '🇬🇧', badge: 'Default' },
  { value: 'TR', label: 'Türkçe (TR)', emoji: '🇹🇷', badge: 'i18n' },
];

const ProfileScreen = ({ navigation }) => {
  const {
    profile,
    goal,
    logs,
    streak,
    lifetimeTotal,
    updateProfile,
    updateGoal,
    clearLogs,
  } = useApp();

  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(profile?.name || 'Eco Warrior');
  const [selectedGoal, setSelectedGoal] = useState(goal);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

  const currentLang = profile?.language || 'EN';
  const equivalents = getLifetimeEquivalents(lifetimeTotal);

  const handleSaveName = async () => {
    const trimmed = nameInput.trim() || 'Eco Warrior';
    await updateProfile({ name: trimmed });
    setIsEditingName(false);
  };

  const handleSelectAvatar = async (emoji) => {
    await updateProfile({ avatarEmoji: emoji });
    setShowAvatarModal(false);
  };

  const handleSelectLanguage = async (lang) => {
    await updateProfile({ language: lang });
  };

  const handleUpdateGoal = async (newGoal) => {
    setSelectedGoal(newGoal);
    await updateGoal(newGoal);
    Alert.alert('Goal Updated 🎯', `Your daily budget is now ${newGoal} kg CO₂.`);
  };

  const handleClearData = () => {
    Alert.alert(
      'Reset All Activity Logs',
      'Are you sure you want to delete all recorded logs? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            await clearLogs();
            Alert.alert('Cleared', 'All activity logs have been reset.');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Hero Card */}
        <LinearGradient
          colors={[COLORS.primaryDark, COLORS.primary]}
          style={styles.heroGradient}
        >
          <TouchableOpacity
            style={styles.avatarButton}
            onPress={() => setShowAvatarModal(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.avatarEmoji}>{profile?.avatarEmoji || '🌱'}</Text>
            <View style={styles.editBadge}>
              <Text style={styles.editBadgeText}>✎</Text>
            </View>
          </TouchableOpacity>

          {/* Name & Edit Button */}
          {isEditingName ? (
            <View style={styles.editNameRow}>
              <TextInput
                style={styles.nameInput}
                value={nameInput}
                onChangeText={setNameInput}
                maxLength={20}
                autoFocus
              />
              <TouchableOpacity style={styles.saveNameBtn} onPress={handleSaveName}>
                <Text style={styles.saveNameText}>Save</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.nameRow}
              onPress={() => {
                setNameInput(profile?.name || '');
                setIsEditingName(true);
              }}
            >
              <Text style={styles.userName}>{profile?.name || 'Eco Warrior'}</Text>
              <Text style={styles.pencilIcon}>✎</Text>
            </TouchableOpacity>
          )}

          <Text style={styles.userJoined}>
            {currentLang === 'TR'
              ? `GreenStep Topluluğu Üyesi • Aktif Seri ${streak} gün 🔥`
              : `Member of GreenStep Community • Active Streak ${streak} days 🔥`}
          </Text>
        </LinearGradient>

        <View style={styles.contentWrapper}>
          {/* Lifetime Milestones Grid */}
          <Text style={styles.sectionHeader}>
            {currentLang === 'TR' ? '📈 Yaşam Boyu İstatistikler' : '📈 Lifetime Milestones'}
          </Text>
          <View style={styles.statsGrid}>
            <StatsCard
              title="Total Logged"
              value={lifetimeTotal.toFixed(1)}
              unit="kg CO₂"
              emoji="🌍"
              color={COLORS.primary}
              subtitle="All-time recorded"
              style={styles.gridCard}
            />
            <StatsCard
              title="Activities"
              value={logs.length}
              unit="entries"
              emoji="📝"
              color="#1565C0"
              subtitle="Logged in app"
              style={styles.gridCard}
            />
            <StatsCard
              title="Current Streak"
              value={streak}
              unit="days"
              emoji="🔥"
              color={COLORS.warning}
              subtitle="Under daily goal"
              style={styles.gridCard}
            />
            <StatsCard
              title="Daily Goal"
              value={goal}
              unit="kg/day"
              emoji="🎯"
              color="#6A1B9A"
              subtitle="Current limit"
              style={styles.gridCard}
            />
          </View>

          {/* Daily Goal Configurator */}
          <View style={styles.sectionCard}>
            <Text style={styles.cardTitle}>🎯 Daily Target Adjustment</Text>
            <Text style={styles.cardSubtitle}>
              Select your daily carbon ceiling based on your personal lifestyle commitment:
            </Text>

            <View style={styles.presetsRow}>
              {GOAL_PRESETS.map((preset) => {
                const isSelected = selectedGoal === preset;
                return (
                  <TouchableOpacity
                    key={preset}
                    style={[styles.presetBtn, isSelected && styles.presetBtnActive]}
                    onPress={() => handleUpdateGoal(preset)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.presetBtnText,
                        isSelected && styles.presetBtnTextActive,
                      ]}
                    >
                      {preset} kg
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Bonus Feature: Internationalization (i18n) Language Selector */}
          <View style={styles.sectionCard}>
            <Text style={styles.cardTitle}>🌐 Language / Dil Seçimi (i18n)</Text>
            <Text style={styles.cardSubtitle}>
              Switch interface localization between English and Turkish:
            </Text>
            <RadioButtonGroup
              options={LANGUAGE_OPTIONS}
              selectedValue={currentLang}
              onSelect={handleSelectLanguage}
              horizontal
            />
          </View>

          {/* Real-World Equivalents Card */}
          <View style={styles.sectionCard}>
            <Text style={styles.cardTitle}>🌳 Real-World Impact Equivalents</Text>
            <Text style={styles.cardSubtitle}>
              Your lifetime {lifetimeTotal.toFixed(1)} kg CO₂ output represents approximately:
            </Text>

            <View style={styles.equivList}>
              <View style={styles.equivItem}>
                <Text style={styles.equivEmoji}>🚗</Text>
                <View style={styles.equivTextCol}>
                  <Text style={styles.equivValue}>{equivalents.kmDriven} km</Text>
                  <Text style={styles.equivDesc}>equivalent to driving a gasoline car</Text>
                </View>
              </View>

              <View style={styles.equivItem}>
                <Text style={styles.equivEmoji}>🌲</Text>
                <View style={styles.equivTextCol}>
                  <Text style={styles.equivValue}>{equivalents.treesNeeded} mature trees</Text>
                  <Text style={styles.equivDesc}>needed to absorb this footprint for 1 year</Text>
                </View>
              </View>

              <View style={styles.equivItem}>
                <Text style={styles.equivEmoji}>🍔</Text>
                <View style={styles.equivTextCol}>
                  <Text style={styles.equivValue}>{equivalents.beefMeals} beef steaks</Text>
                  <Text style={styles.equivDesc}>equivalent carbon footprint</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Settings & App Actions */}
          <View style={styles.sectionCard}>
            <Text style={styles.cardTitle}>⚙️ Settings & System</Text>

            <TouchableOpacity
              style={styles.actionRow}
              onPress={() => setShowAboutModal(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.actionRowEmoji}>ℹ️</Text>
              <View style={styles.actionRowTextCol}>
                <Text style={styles.actionRowTitle}>About GreenStep</Text>
                <Text style={styles.actionRowDesc}>
                  Architecture, developer info & university project specs
                </Text>
              </View>
              <Text style={styles.arrowIcon}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionRow}
              onPress={handleClearData}
              activeOpacity={0.7}
            >
              <Text style={styles.actionRowEmoji}>🗑️</Text>
              <View style={styles.actionRowTextCol}>
                <Text style={[styles.actionRowTitle, { color: COLORS.error }]}>
                  Reset All Logs
                </Text>
                <Text style={styles.actionRowDesc}>
                  Clear all local activity entries from storage
                </Text>
              </View>
              <Text style={styles.arrowIcon}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Avatar Picker Modal */}
        <Modal
          visible={showAvatarModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowAvatarModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Choose Avatar Icon</Text>
              <View style={styles.avatarModalGrid}>
                {AVATAR_LIST.map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={styles.avatarPickBtn}
                    onPress={() => handleSelectAvatar(item)}
                  >
                    <Text style={styles.avatarPickText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setShowAvatarModal(false)}
              >
                <Text style={styles.modalCloseText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* About App Modal */}
        <Modal
          visible={showAboutModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowAboutModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalCard, styles.aboutCard]}>
              <Text style={styles.modalTitle}>🌿 GreenStep v1.1.0</Text>
              <Text style={styles.aboutTagline}>
                Personal Carbon Footprint Tracker & Eco Lifestyle Companion
              </Text>

              <ScrollView style={styles.aboutScroll} showsVerticalScrollIndicator={false}>
                <Text style={styles.aboutSectionHeader}>Academic Final Project</Text>
                <Text style={styles.aboutText}>
                  Course: Mobile Application Development (Assoc. Prof. Dr. Zeki Özen){'\n'}
                  Deliverable: Interactive React Native / Expo Application{'\n'}
                  Architecture: Component-Driven with React Context State Management, AsyncStorage
                  Persistence & Live REST API Telemetry
                </Text>

                <Text style={styles.aboutSectionHeader}>Course Modules Applied (W2–W9)</Text>
                <Text style={styles.aboutText}>
                  • W3 & W4: Functional Components, JSX, Props, State, Hooks (useState, useEffect,
                  useMemo, useContext){'\n'}
                  • W6 Core UI: View, Text, SafeAreaView, ScrollView, FlatList, TextInput,
                  TouchableOpacity, Image, CustomCheckbox, RadioButtonGroup, CustomPicker{'\n'}
                  • W7 Storage: AsyncStorage Persistent CRUD Database Layer{'\n'}
                  • W8 Networking: Fetch API, Async/Await, LoadingStates (ActivityIndicator),
                  ErrorHandling (try/catch offline resilience){'\n'}
                  • W9 Native & Platform: Interactive Campus Green Map, Camera Photo Verification &
                  Smart Eco-Notifications
                </Text>

                <Text style={styles.aboutSectionHeader}>Academic Integrity & Originality</Text>
                <Text style={styles.aboutText}>
                  This application code is developed exclusively for this final project in
                  compliance with academic integrity protocols.
                </Text>
              </ScrollView>

              <TouchableOpacity
                style={styles.modalDoneBtn}
                onPress={() => setShowAboutModal(false)}
              >
                <Text style={styles.modalDoneText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 36,
  },
  heroGradient: {
    paddingTop: Platform.OS === 'android' ? 36 : 20,
    paddingBottom: 28,
    alignItems: 'center',
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  avatarButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  avatarEmoji: {
    fontSize: 42,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primaryDark,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  editBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  pencilIcon: {
    color: '#C8E6C9',
    fontSize: 16,
  },
  editNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  nameInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    minWidth: 150,
  },
  saveNameBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  saveNameText: {
    color: COLORS.primaryDark,
    fontWeight: '800',
    fontSize: 13,
  },
  userJoined: {
    fontSize: 12,
    color: '#E8F5E9',
    marginTop: 6,
  },
  contentWrapper: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textDark,
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  gridCard: {
    width: '48%',
  },
  sectionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textDark,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: COLORS.textLight,
    lineHeight: 17,
    marginBottom: 12,
  },
  presetsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  presetBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: COLORS.card,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  presetBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  presetBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  presetBtnTextActive: {
    color: '#FFFFFF',
  },
  equivList: {
    gap: 12,
  },
  equivItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.card,
    padding: 10,
    borderRadius: 12,
  },
  equivEmoji: {
    fontSize: 24,
  },
  equivTextCol: {
    flex: 1,
  },
  equivValue: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  equivDesc: {
    fontSize: 11,
    color: COLORS.textLight,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    gap: 12,
  },
  actionRowEmoji: {
    fontSize: 20,
  },
  actionRowTextCol: {
    flex: 1,
  },
  actionRowTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  actionRowDesc: {
    fontSize: 11,
    color: COLORS.textLight,
  },
  arrowIcon: {
    fontSize: 20,
    color: COLORS.textLight,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textDark,
    marginBottom: 14,
  },
  avatarModalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 20,
  },
  avatarPickBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  avatarPickText: {
    fontSize: 28,
  },
  modalCloseBtn: {
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  modalCloseText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textLight,
  },
  aboutCard: {
    maxHeight: '80%',
    alignItems: 'stretch',
  },
  aboutTagline: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  aboutScroll: {
    marginBottom: 16,
  },
  aboutSectionHeader: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textDark,
    marginTop: 10,
    marginBottom: 4,
  },
  aboutText: {
    fontSize: 12,
    color: COLORS.textDark,
    lineHeight: 18,
  },
  modalDoneBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalDoneText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
});
