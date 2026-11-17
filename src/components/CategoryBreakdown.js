import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import COLORS from '../constants/colors';
import ProgressRing from './ProgressRing';

const CATEGORY_META = {
  transport: { name: 'Transport', emoji: '🚗', color: '#1565C0' },
  food: { name: 'Food', emoji: '🍽️', color: '#E65100' },
  energy: { name: 'Energy', emoji: '⚡', color: '#F9A825' },
  shopping: { name: 'Shopping', emoji: '🛍️', color: '#6A1B9A' },
};

const CategoryBreakdown = ({ data = [] }) => {
  // Normalize data with default categories
  const categories = ['transport', 'food', 'energy', 'shopping'].map((catId) => {
    const existing = data.find((item) => (item.id || item.category || '').toLowerCase() === catId);
    const meta = CATEGORY_META[catId];
    return {
      id: catId,
      name: meta.name,
      emoji: meta.emoji,
      color: meta.color,
      total: existing ? existing.total : 0,
      percentage: existing ? existing.percentage : 0,
    };
  });

  const totalCO2 = categories.reduce((sum, c) => sum + c.total, 0);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Emission by Sector</Text>
        <Text style={styles.totalText}>Total: {totalCO2.toFixed(1)} kg</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((cat) => (
          <View key={cat.id} style={styles.categoryCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.catEmoji}>{cat.emoji}</Text>
              <Text style={styles.catName} numberOfLines={1}>
                {cat.name}
              </Text>
            </View>

            <View style={styles.ringWrapper}>
              <ProgressRing
                percentage={cat.percentage}
                color={cat.color}
                size={70}
                strokeWidth={7}
              />
            </View>

            <View style={styles.metaRow}>
              <Text style={[styles.kgText, { color: cat.color }]}>
                {cat.total.toFixed(1)} <Text style={styles.kgUnit}>kg</Text>
              </Text>
              <Text style={styles.percentageText}>{Math.round(cat.percentage)}%</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default CategoryBreakdown;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  totalText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  scrollContent: {
    paddingRight: 8,
    gap: 12,
  },
  categoryCard: {
    width: 110,
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 8,
  },
  catEmoji: {
    fontSize: 20,
    marginBottom: 2,
  },
  catName: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  ringWrapper: {
    marginVertical: 4,
  },
  metaRow: {
    alignItems: 'center',
    marginTop: 6,
  },
  kgText: {
    fontSize: 13,
    fontWeight: '800',
  },
  kgUnit: {
    fontSize: 10,
    fontWeight: '500',
    color: COLORS.textLight,
  },
  percentageText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textLight,
    marginTop: 2,
  },
});
