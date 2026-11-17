import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Svg, Circle } from 'react-native-svg';
import COLORS from '../constants/colors';

const ProgressRing = ({
  percentage = 0,
  color = COLORS.primary,
  size = 60,
  strokeWidth = 8,
  label,
  value,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const filled = Math.min(percentage, 100);
  const strokeDashoffset = circumference - (circumference * filled) / 100;
  const cx = size / 2;
  const cy = size / 2;

  return (
    <View style={styles.wrapper}>
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size}>
          {/* Background circle */}
          <Circle
            cx={cx}
            cy={cy}
            r={radius}
            stroke={COLORS.border}
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress circle */}
          <Circle
            cx={cx}
            cy={cy}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            rotation="-90"
            origin={`${cx}, ${cy}`}
          />
        </Svg>
        {/* Center text */}
        <View style={[StyleSheet.absoluteFill, styles.centerContent]}>
          <Text style={[styles.percentText, { fontSize: size * 0.2, color }]}>
            {Math.round(filled)}%
          </Text>
        </View>
      </View>
      {label && <Text style={styles.label}>{label}</Text>}
      {value !== undefined && (
        <Text style={styles.value}>{typeof value === 'number' ? value.toFixed(1) : value} kg</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentText: {
    fontWeight: '700',
  },
  label: {
    marginTop: 6,
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
    textAlign: 'center',
  },
  value: {
    fontSize: 11,
    color: COLORS.textLight,
    marginTop: 2,
    textAlign: 'center',
  },
});

export default ProgressRing;
