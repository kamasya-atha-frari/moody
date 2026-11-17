import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  SafeAreaView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import COLORS from '../constants/colors';
import { useApp } from '../context/AppContext';
import ActivityCard from '../components/ActivityCard';
import EmptyState from '../components/EmptyState';
import CustomPicker from '../components/CustomPicker';

const FILTER_TABS = [
  { id: 'all', label: 'All', emoji: '✨' },
  { id: 'transport', label: 'Transport', emoji: '🚗' },
  { id: 'food', label: 'Food', emoji: '🍽️' },
  { id: 'energy', label: 'Energy', emoji: '⚡' },
  { id: 'shopping', label: 'Shopping', emoji: '🛍️' },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First', emoji: '🕒' },
  { value: 'oldest', label: 'Oldest First', emoji: '📅' },
  { value: 'highest', label: 'Highest CO₂ Impact', emoji: '🔥' },
  { value: 'lowest', label: 'Lowest CO₂ Impact', emoji: '🌱' },
];

const formatDateGroup = (isoString) => {
  const d = new Date(isoString);
  const now = new Date();

  const isToday =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    d.getDate() === yesterday.getDate() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getFullYear() === yesterday.getFullYear();

  if (isToday) return 'Today';
  if (isYesterday) return 'Yesterday';

  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

const HistoryScreen = ({ navigation }) => {
  const { logs, deleteLog, refreshData } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };

  // Filter, search, and sort
  const filteredLogs = useMemo(() => {
    const matched = logs.filter((log) => {
      const matchCat =
        selectedFilter === 'all' ||
        (log.category || '').toLowerCase() === selectedFilter.toLowerCase();

      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        (log.activityName && log.activityName.toLowerCase().includes(q)) ||
        (log.note && log.note.toLowerCase().includes(q)) ||
        (log.category && log.category.toLowerCase().includes(q));

      return matchCat && matchQuery;
    });

    return [...matched].sort((a, b) => {
      if (sortOrder === 'oldest') {
        return new Date(a.timestamp) - new Date(b.timestamp);
      }
      if (sortOrder === 'highest') {
        return (parseFloat(b.kgCO2) || 0) - (parseFloat(a.kgCO2) || 0);
      }
      if (sortOrder === 'lowest') {
        return (parseFloat(a.kgCO2) || 0) - (parseFloat(b.kgCO2) || 0);
      }
      return new Date(b.timestamp) - new Date(a.timestamp);
    });
  }, [logs, selectedFilter, searchQuery, sortOrder]);

  // Group by date
  const groupedLogs = useMemo(() => {
    const groups = {};
    filteredLogs.forEach((log) => {
      const groupKey = formatDateGroup(log.timestamp);
      if (!groups[groupKey]) {
        groups[groupKey] = {
          dateLabel: groupKey,
          items: [],
          totalCO2: 0,
        };
      }
      groups[groupKey].items.push(log);
      groups[groupKey].totalCO2 += parseFloat(log.kgCO2) || 0;
    });

    return Object.values(groups);
  }, [filteredLogs]);

  const totalFilteredCO2 = useMemo(() => {
    return filteredLogs.reduce((acc, l) => acc + (parseFloat(l.kgCO2) || 0), 0);
  }, [filteredLogs]);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header */}
      <LinearGradient
        colors={[COLORS.primaryDark, COLORS.primary]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Activity History 📋</Text>
        <Text style={styles.headerSub}>Inspect, filter, and audit your emissions timeline</Text>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search activity or note..."
            placeholderTextColor="#A5D6A7"
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
          {!!searchQuery && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.clearSearch}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      {/* Sector Filter Chips */}
      <View style={styles.filterSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {FILTER_TABS.map((tab) => {
            const isSelected = selectedFilter === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[styles.filterChip, isSelected && styles.filterChipActive]}
                onPress={() => setSelectedFilter(tab.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.filterEmoji}>{tab.emoji}</Text>
                <Text
                  style={[styles.filterLabel, isSelected && styles.filterLabelActive]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Summary & W6 Picker Strip */}
      <View style={styles.summaryStrip}>
        <View style={styles.summaryLeft}>
          <Text style={styles.summaryText}>
            Showing <Text style={styles.bold}>{filteredLogs.length}</Text> records
          </Text>
          <Text style={styles.summaryTotal}>
            Sum: <Text style={styles.boldTotal}>{totalFilteredCO2.toFixed(2)} kg CO₂</Text>
          </Text>
        </View>
        <View style={styles.pickerWrap}>
          <CustomPicker
            options={SORT_OPTIONS}
            selectedValue={sortOrder}
            onValueChange={setSortOrder}
          />
        </View>
      </View>

      {/* W6 FlatList Component for performant list rendering */}
      <FlatList
        data={groupedLogs}
        keyExtractor={(item) => item.dateLabel}
        style={styles.listContainer}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
          />
        }
        ListEmptyComponent={
          <EmptyState
            emoji="🔍"
            title="No records found"
            subtitle={
              searchQuery || selectedFilter !== 'all'
                ? 'Try adjusting your search query or category filter.'
                : 'Start logging your daily carbon activities to view your history.'
            }
            actionText="Log Activity"
            onAction={() => navigation.navigate('Log')}
          />
        }
        renderItem={({ item: group }) => (
          <View style={styles.dateGroup}>
            <View style={styles.groupHeaderRow}>
              <Text style={styles.groupDateLabel}>{group.dateLabel}</Text>
              <View style={styles.groupTotalBadge}>
                <Text style={styles.groupTotalText}>
                  {group.totalCO2.toFixed(2)} kg CO₂
                </Text>
              </View>
            </View>

            {group.items.map((log) => (
              <ActivityCard
                key={log.id}
                log={log}
                onDelete={() => deleteLog(log.id)}
              />
            ))}
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 36 : 14,
    paddingBottom: 16,
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 10 : 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
  },
  clearSearch: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    paddingHorizontal: 4,
  },
  filterSection: {
    backgroundColor: COLORS.surface,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 6,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterEmoji: {
    fontSize: 13,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  filterLabelActive: {
    color: '#FFFFFF',
  },
  summaryStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FAFFF5',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  summaryLeft: {
    flex: 1,
  },
  pickerWrap: {
    width: 175,
  },
  summaryText: {
    fontSize: 11,
    color: COLORS.textLight,
  },
  bold: {
    fontWeight: '700',
    color: COLORS.textDark,
  },
  summaryTotal: {
    fontSize: 11,
    color: COLORS.textLight,
    marginTop: 2,
  },
  boldTotal: {
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  dateGroup: {
    marginBottom: 16,
  },
  groupHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  groupDateLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  groupTotalBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  groupTotalText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
});
