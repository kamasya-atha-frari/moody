import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import COLORS from '../constants/colors';
import { useApp } from '../context/AppContext';
import CarbonMeter from '../components/CarbonMeter';
import StatsCard from '../components/StatsCard';
import WeeklyChart from '../components/WeeklyChart';
import CategoryBreakdown from '../components/CategoryBreakdown';
import ActivityCard from '../components/ActivityCard';
import EmptyState from '../components/EmptyState';
import LiveAirQualityCard from '../components/LiveAirQualityCard';
import CustomCheckbox from '../components/CustomCheckbox';

const DAILY_HABIT_CHECKLIST = [
  {
    id: 'habit-bottle',
    label: 'Used a reusable water bottle / mug',
    subtitle: 'Avoids single-use plastic production',
    savingKg: 0.25,
  },
  {
    id: 'habit-lights',
    label: 'Unplugged idle chargers & turned off lights',
    subtitle: 'Reduces phantom standby electricity load',
    savingKg: 0.35,
  },
  {
    id: 'habit-recycle',
    label: 'Sorted paper, plastic, and glass waste',
    subtitle: 'Campus / home zero-waste separation',
    savingKg: 0.4,
  },
];

const getGreeting = (lang = 'EN') => {
  const hour = new Date().getHours();
  if (lang === 'TR') {
    if (hour < 12) return 'Günaydın';
    if (hour < 18) return 'Tünaydın';
    return 'İyi akşamlar';
  }
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

const getStatusMessage = (todayTotal, goal) => {
  const ratio = todayTotal / goal;
  if (todayTotal === 0) {
    return { text: 'No emissions logged yet today! Keep it light 🍃', color: COLORS.success };
  }
  if (ratio < 0.5) {
    return { text: '✨ Outstanding! Well below your carbon target', color: COLORS.success };
  }
  if (ratio < 0.85) {
    return { text: '👍 Doing well! Approaching moderate emission', color: COLORS.primary };
  }
  if (ratio <= 1.0) {
    return { text: '⚠️ Nearing your daily limit. Choose green actions!', color: COLORS.warning };
  }
  return { text: '🚨 Daily carbon limit exceeded. Offset with eco choices!', color: COLORS.error };
};

const HomeScreen = ({ navigation }) => {
  const {
    profile,
    goal,
    todayTotal,
    todayLogs,
    weeklyTotal,
    weeklyData,
    categoryBreakdown,
    streak,
    deleteLog,
    refreshData,
  } = useApp();

  const [refreshing, setRefreshing] = useState(false);
  const [checkedHabits, setCheckedHabits] = useState(['habit-bottle']);

  const lang = profile?.language || 'EN';

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };

  const toggleHabit = (id) => {
    setCheckedHabits((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const habitOffsetKg = DAILY_HABIT_CHECKLIST.reduce(
    (sum, h) => (checkedHabits.includes(h.id) ? sum + h.savingKg : sum),
    0
  );

  const netTodayTotal = Math.max(todayTotal - habitOffsetKg, 0);
  const status = getStatusMessage(netTodayTotal, goal);

  const formattedDate = new Date().toLocaleDateString(lang === 'TR' ? 'tr-TR' : 'en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      >
        {/* Custom Header Gradient Banner */}
        <LinearGradient
          colors={[COLORS.primaryDark, COLORS.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerBanner}
        >
          <View style={styles.headerTop}>
            <View style={styles.userGreeting}>
              <Text style={styles.greetingText}>
                {getGreeting(lang)},{' '}
                <Text style={styles.userNameText}>{profile?.name || 'Explorer'}</Text>
              </Text>
              <Text style={styles.dateText}>{formattedDate}</Text>
            </View>

            {/* Streak & Avatar Badge */}
            <View style={styles.badgeRow}>
              <View style={styles.streakBadge}>
                <Text style={styles.streakEmoji}>🔥</Text>
                <Text style={styles.streakText}>{streak}d</Text>
              </View>
              <TouchableOpacity
                style={styles.avatarCircle}
                onPress={() => navigation.navigate('Profile')}
                activeOpacity={0.8}
              >
                <Text style={styles.avatarEmoji}>{profile?.avatarEmoji || '🌱'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick Motivational Stat */}
          <View style={styles.quickBannerSub}>
            <Text style={styles.quickBannerText}>
              {lang === 'TR' ? 'Hedef' : 'Goal'}: <Text style={styles.boldText}>{goal} kg/day</Text> •{' '}
              {lang === 'TR' ? 'Net Salım' : 'Net Logged'}:{' '}
              <Text style={styles.boldText}>{netTodayTotal.toFixed(2)} kg</Text> (Offset: -{habitOffsetKg.toFixed(2)} kg)
            </Text>
          </View>
        </LinearGradient>

        <View style={styles.bodyWrapper}>
          {/* Main Carbon Meter Card */}
          <View style={styles.meterCard}>
            <Text style={styles.cardHeaderTitle}>
              {lang === 'TR' ? 'Bugünkü Karbon Bütçesi' : "Today's Carbon Budget"}
            </Text>
            <View style={styles.meterInner}>
              <CarbonMeter value={netTodayTotal} goal={goal} size={170} />
            </View>

            <View style={[styles.statusBox, { backgroundColor: status.color + '14' }]}>
              <Text style={[styles.statusText, { color: status.color }]}>{status.text}</Text>
            </View>
          </View>

          {/* Key Metric Stats Row */}
          <View style={styles.statsRow}>
            <StatsCard
              title={lang === 'TR' ? 'Bu Hafta' : 'This Week'}
              value={weeklyTotal.toFixed(1)}
              unit="kg CO₂"
              emoji="📅"
              color="#1565C0"
              subtitle="7-day cumulative"
              style={styles.statCardHalf}
            />
            <StatsCard
              title={lang === 'TR' ? 'Yeşil Seri' : 'Green Streak'}
              value={streak}
              unit="days"
              emoji="🌱"
              color={COLORS.primary}
              subtitle="Within daily goal"
              style={styles.statCardHalf}
            />
          </View>

          {/* Quick Log Action Bar */}
          <View style={styles.quickLogSection}>
            <Text style={styles.sectionTitle}>⚡ Quick Log Activity</Text>
            <View style={styles.quickGrid}>
              <TouchableOpacity
                style={[styles.quickBtn, { borderColor: '#1565C0' }]}
                onPress={() => navigation.navigate('Log', { category: 'transport' })}
                activeOpacity={0.7}
              >
                <Text style={styles.quickEmoji}>🚗</Text>
                <Text style={styles.quickLabel}>Transport</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.quickBtn, { borderColor: '#E65100' }]}
                onPress={() => navigation.navigate('Log', { category: 'food' })}
                activeOpacity={0.7}
              >
                <Text style={styles.quickEmoji}>🍽️</Text>
                <Text style={styles.quickLabel}>Food</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.quickBtn, { borderColor: '#F9A825' }]}
                onPress={() => navigation.navigate('Log', { category: 'energy' })}
                activeOpacity={0.7}
              >
                <Text style={styles.quickEmoji}>⚡</Text>
                <Text style={styles.quickLabel}>Energy</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.quickBtn, { borderColor: '#6A1B9A' }]}
                onPress={() => navigation.navigate('Log', { category: 'shopping' })}
                activeOpacity={0.7}
              >
                <Text style={styles.quickEmoji}>🛍️</Text>
                <Text style={styles.quickLabel}>Shopping</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* W6 Checkbox Component: Daily Green Habits Checklist */}
          <View style={styles.checklistCard}>
            <View style={styles.checklistHeader}>
              <Text style={styles.sectionTitle}>☑️ Daily Eco-Habits Checklist</Text>
              <Text style={styles.offsetBadge}>-{habitOffsetKg.toFixed(2)} kg CO₂</Text>
            </View>
            {DAILY_HABIT_CHECKLIST.map((item) => (
              <CustomCheckbox
                key={item.id}
                checked={checkedHabits.includes(item.id)}
                onPress={() => toggleHabit(item.id)}
                label={item.label}
                subtitle={item.subtitle}
                badgeText={`-${item.savingKg} kg`}
              />
            ))}
          </View>

          {/* W8 FetchAPI + AsyncAwait + LoadingStates + ErrorHandling Widget */}
          <LiveAirQualityCard />

          {/* 7-Day Trend Chart */}
          <WeeklyChart data={weeklyData} />

          {/* Emission by Sector Breakdown */}
          <CategoryBreakdown data={categoryBreakdown} />

          {/* Today's Logged Activities */}
          <View style={styles.recentSection}>
            <View style={styles.recentHeader}>
              <Text style={styles.sectionTitle}>Today's Footprint</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('History')}
                activeOpacity={0.7}
              >
                <Text style={styles.seeAllText}>View All ({todayLogs.length}) →</Text>
              </TouchableOpacity>
            </View>

            {todayLogs.length === 0 ? (
              <EmptyState
                emoji="🍃"
                title="No emissions logged today"
                subtitle="Tap the '+' button or quick shortcuts above to add your first entry."
                actionText="Log Now"
                onAction={() => navigation.navigate('Log')}
              />
            ) : (
              todayLogs.slice(0, 3).map((log) => (
                <ActivityCard
                  key={log.id}
                  log={log}
                  onDelete={() => deleteLog(log.id)}
                />
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  headerBanner: {
    paddingTop: Platform.OS === 'android' ? 36 : 16,
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userGreeting: {
    flex: 1,
  },
  greetingText: {
    fontSize: 18,
    color: '#E8F5E9',
    fontWeight: '500',
  },
  userNameText: {
    fontWeight: '800',
    color: '#FFFFFF',
  },
  dateText: {
    fontSize: 12,
    color: '#C8E6C9',
    marginTop: 3,
    fontWeight: '600',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    gap: 4,
  },
  streakEmoji: {
    fontSize: 14,
  },
  streakText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  avatarCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarEmoji: {
    fontSize: 22,
  },
  quickBannerSub: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
  },
  quickBannerText: {
    color: '#E8F5E9',
    fontSize: 12,
  },
  boldText: {
    fontWeight: '700',
    color: '#FFFFFF',
  },
  bodyWrapper: {
    paddingHorizontal: 16,
    marginTop: -10,
  },
  meterCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
  },
  cardHeaderTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 6,
  },
  meterInner: {
    marginVertical: 4,
  },
  statusBox: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statCardHalf: {
    flex: 1,
  },
  quickLogSection: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  checklistCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  checklistHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  offsetBadge: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primaryDark,
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 10,
  },
  quickGrid: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
  },
  quickBtn: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1.2,
  },
  quickEmoji: {
    fontSize: 22,
    marginBottom: 4,
  },
  quickLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  recentSection: {
    marginTop: 6,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
});
