import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import COLORS from '../constants/colors';

const DIFFICULTY_MAP = {
  easy: { label: 'Easy', icon: '🟢', color: COLORS.success },
  medium: { label: 'Medium', icon: '🟡', color: COLORS.warning },
  hard: { label: 'Hard', icon: '🔴', color: COLORS.error },
};

const TipCard = ({ tip, expanded, onPress }) => {
  const heightAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(heightAnim, {
        toValue: expanded ? 1 : 0,
        duration: 280,
        useNativeDriver: false,
      }),
      Animated.timing(opacityAnim, {
        toValue: expanded ? 1 : 0,
        duration: expanded ? 320 : 160,
        useNativeDriver: false,
      }),
    ]).start();
  }, [expanded]);

  const difficulty = DIFFICULTY_MAP[tip.difficulty] || DIFFICULTY_MAP.easy;

  const descMaxHeight = heightAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200],
  });

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.88}
    >
      {/* Gradient top bar */}
      <LinearGradient
        colors={[COLORS.primaryDark, COLORS.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.topBar}
      >
        <Text style={styles.topEmoji}>{tip.emoji}</Text>
        <View style={styles.topInfo}>
          <Text style={styles.tipTitle} numberOfLines={expanded ? 3 : 1}>
            {tip.title}
          </Text>
          <View style={styles.badgeRow}>
            <View style={[styles.difficultyBadge, { borderColor: difficulty.color }]}>
              <Text style={styles.difficultyIcon}>{difficulty.icon}</Text>
              <Text style={[styles.difficultyLabel, { color: difficulty.color }]}>
                {difficulty.label}
              </Text>
            </View>
            <Text style={styles.impactText}>
              Save ~{tip.impactKg} kg CO₂/month
            </Text>
          </View>
        </View>
        <Text style={styles.chevron}>{expanded ? '▲' : '▼'}</Text>
      </LinearGradient>

      {/* Expandable description */}
      <Animated.View
        style={[styles.descriptionContainer, { maxHeight: descMaxHeight, opacity: opacityAnim }]}
      >
        <View style={styles.descriptionInner}>
          <Text style={styles.categoryTag}>{tip.category}</Text>
          <Text style={styles.description}>{tip.description}</Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: COLORS.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    gap: 10,
  },
  topEmoji: {
    fontSize: 32,
    marginRight: 2,
  },
  topInfo: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.surface,
    marginBottom: 6,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  difficultyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  difficultyIcon: {
    fontSize: 12,
  },
  difficultyLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
  impactText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500',
  },
  chevron: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginLeft: 4,
  },
  descriptionContainer: {
    overflow: 'hidden',
  },
  descriptionInner: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  categoryTag: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: COLORS.textDark,
    lineHeight: 22,
  },
});

export default TipCard;
