import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import COLORS from '../constants/colors';

const StatsCard = ({
  title,
  value,
  unit = '',
  emoji = '🌱',
  color = COLORS.primary,
  subtitle,
  style,
}) => {
  return (
    <View style={[styles.card, style]}>
      {/* Top colored accent indicator */}
      <View style={[styles.accentStrip, { backgroundColor: color }]} />

      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <View style={[styles.emojiBadge, { backgroundColor: color + '15' }]}>
            <Text style={styles.emoji}>{emoji}</Text>
          </View>
        </View>

        <View style={styles.valueRow}>
          <Text style={[styles.value, { color }]}>{value}</Text>
          {!!unit && <Text style={styles.unit}>{unit}</Text>}
        </View>

        {!!subtitle && (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>
    </View>
  );
};

export default StatsCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  accentStrip: {
    height: 4,
    width: '100%',
  },
  content: {
    padding: 14,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    flex: 1,
  },
  emojiBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  emoji: {
    fontSize: 14,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  value: {
    fontSize: 22,
    fontWeight: '800',
  },
  unit: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  subtitle: {
    fontSize: 11,
    color: COLORS.textLight,
    marginTop: 4,
  },
});
