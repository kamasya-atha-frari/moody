import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import COLORS from '../constants/colors';

const MAX_BAR_HEIGHT = 110;

const WeeklyBar = ({ day, value, maxValue, index }) => {
  const animatedHeight = useRef(new Animated.Value(0)).current;

  const targetHeight = maxValue > 0 ? Math.max((value / maxValue) * MAX_BAR_HEIGHT, 6) : 6;

  useEffect(() => {
    animatedHeight.setValue(0);
    Animated.timing(animatedHeight, {
      toValue: targetHeight,
      duration: 600 + index * 100,
      useNativeDriver: false,
    }).start();
  }, [value, maxValue]);

  const isHigh = value > 10;
  const isZero = value === 0;

  const barColor = isZero
    ? '#E0E0E0'
    : isHigh
    ? COLORS.error
    : value > 6
    ? COLORS.warning
    : COLORS.primaryLight;

  return (
    <View style={styles.barColumn}>
      {/* Value label on top */}
      <Text style={styles.valueText} numberOfLines={1}>
        {isZero ? '0' : value.toFixed(1)}
      </Text>

      {/* Bar container */}
      <View style={styles.barTrack}>
        <Animated.View
          style={[
            styles.bar,
            {
              height: animatedHeight,
              backgroundColor: barColor,
            },
          ]}
        />
      </View>

      {/* Day label */}
      <Text style={[styles.dayText, isZero && styles.dayTextMuted]}>{day}</Text>
    </View>
  );
};

const WeeklyChart = ({ data = [] }) => {
  // Ensure we have 7 days
  const chartData = data.length > 0 ? data : [
    { day: 'Mon', value: 0 },
    { day: 'Tue', value: 0 },
    { day: 'Wed', value: 0 },
    { day: 'Thu', value: 0 },
    { day: 'Fri', value: 0 },
    { day: 'Sat', value: 0 },
    { day: 'Sun', value: 0 },
  ];

  const values = chartData.map((d) => d.value);
  const maxValue = Math.max(...values, 8); // At least scale of 8 for nice visuals

  const totalWeek = values.reduce((acc, v) => acc + v, 0);
  const avgDay = (totalWeek / chartData.length).toFixed(1);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.chartTitle}>7-Day Carbon Emission Trend</Text>
        <View style={styles.avgBadge}>
          <Text style={styles.avgBadgeText}>Avg: {avgDay} kg/d</Text>
        </View>
      </View>

      <View style={styles.barsContainer}>
        {chartData.map((item, index) => (
          <WeeklyBar
            key={item.day || index}
            day={item.day}
            value={item.value}
            maxValue={maxValue}
            index={index}
          />
        ))}
      </View>

      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.primaryLight }]} />
          <Text style={styles.legendText}>&lt; 6 kg (Low)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.warning }]} />
          <Text style={styles.legendText}>6 - 10 kg (Medium)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.error }]} />
          <Text style={styles.legendText}>&gt; 10 kg (High)</Text>
        </View>
      </View>
    </View>
  );
};

export default WeeklyChart;

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
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  avgBadge: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  avgBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.primary,
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: MAX_BAR_HEIGHT + 35,
    paddingBottom: 8,
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  valueText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textLight,
    marginBottom: 4,
  },
  barTrack: {
    height: MAX_BAR_HEIGHT,
    width: 20,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  bar: {
    width: '100%',
    borderRadius: 10,
  },
  dayText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textDark,
    marginTop: 6,
  },
  dayTextMuted: {
    color: COLORS.textLight,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 10,
    color: COLORS.textLight,
  },
});
