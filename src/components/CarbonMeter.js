import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { Svg, Circle } from 'react-native-svg';
import COLORS from '../constants/colors';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const CarbonMeter = ({ value = 0, goal = 10, size = 160 }) => {
  const percentage = Math.min((value / goal) * 100, 100);
  const animatedValue = useRef(new Animated.Value(0)).current;

  const radius = (size - 24) / 2;
  const circumference = 2 * Math.PI * radius;
  const cx = size / 2;
  const cy = size / 2;

  const getMeterColor = () => {
    if (percentage < 50) return COLORS.success;
    if (percentage < 80) return COLORS.warning;
    return COLORS.error;
  };

  const color = getMeterColor();

  useEffect(() => {
    animatedValue.setValue(0);
    Animated.timing(animatedValue, {
      toValue: percentage,
      duration: 1200,
      useNativeDriver: false,
    }).start();
  }, [percentage]);

  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, circumference - (circumference * percentage) / 100],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.wrapper}>
      <View style={[styles.container, { width: size, height: size }]}>
        <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
          {/* Background ring */}
          <Circle
            cx={cx}
            cy={cy}
            r={radius}
            stroke={COLORS.border}
            strokeWidth={10}
            fill="none"
            strokeLinecap="round"
          />
          {/* Foreground ring */}
          <AnimatedCircle
            cx={cx}
            cy={cy}
            r={radius}
            stroke={color}
            strokeWidth={10}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            rotation="-90"
            origin={`${cx}, ${cy}`}
          />
        </Svg>

        {/* Center content */}
        <View style={styles.centerContent}>
          <Text style={[styles.valueText, { color }]}>
            {value.toFixed(1)}
          </Text>
          <Text style={styles.unitText}>kg CO₂</Text>
          <Text style={[styles.percentText, { color }]}>
            {Math.round(percentage)}%
          </Text>
        </View>
      </View>

      <Text style={styles.goalLabel}>Daily Goal: {goal} kg</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueText: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  unitText: {
    fontSize: 11,
    color: COLORS.textLight,
    fontWeight: '500',
    marginTop: 2,
  },
  percentText: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
    opacity: 0.8,
  },
  goalLabel: {
    marginTop: 10,
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
});

export default CarbonMeter;
