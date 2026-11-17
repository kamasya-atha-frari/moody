import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Animated,
  StyleSheet,
} from 'react-native';
import COLORS from '../constants/colors';

const getRelativeTime = (timestamp) => {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays === 1) return 'Yesterday';

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) {
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    return `Today ${hh}:${mm}`;
  }

  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
};

const getCO2Color = (kg) => {
  if (kg < 2) return COLORS.success;
  if (kg < 5) return COLORS.warning;
  return COLORS.error;
};

const ActivityCard = ({ log, onDelete }) => {
  const translateX = useRef(new Animated.Value(-40)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleDelete = () => {
    Alert.alert(
      'Delete Activity',
      `Remove "${log.activityName}" log?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete && onDelete(log.id),
        },
      ]
    );
  };

  const co2Color = getCO2Color(log.kgCO2 || 0);

  return (
    <Animated.View style={[styles.card, { transform: [{ translateX }], opacity }]}>
      {/* Green left border accent */}
      <View style={styles.leftBorder} />

      <View style={styles.content}>
        {/* Top row: emoji + name + delete */}
        <View style={styles.topRow}>
          <Text style={styles.emoji}>{log.emoji || '🌿'}</Text>
          <View style={styles.nameCol}>
            <Text style={styles.activityName} numberOfLines={1}>
              {log.activityName}
            </Text>
            <View style={styles.tagRow}>
              <View style={styles.categoryPill}>
                <Text style={styles.categoryText}>{log.category}</Text>
              </View>
              <Text style={styles.timestamp}>{getRelativeTime(log.timestamp)}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.deleteIcon}>🗑️</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom row: quantity + CO2 */}
        <View style={styles.bottomRow}>
          <Text style={styles.quantityText}>
            {log.quantity} {log.unit || 'unit(s)'}
          </Text>
          <View style={styles.co2Block}>
            <Text style={[styles.co2Value, { color: co2Color }]}>
              {(log.kgCO2 || 0).toFixed(2)}
            </Text>
            <Text style={styles.co2Label}>kg CO₂</Text>
          </View>
        </View>

        {/* Optional note */}
        {!!log.note && (
          <Text style={styles.note} numberOfLines={1}>
            💬 {log.note}
          </Text>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    marginVertical: 6,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    overflow: 'hidden',
  },
  leftBorder: {
    width: 4,
    backgroundColor: COLORS.primary,
  },
  content: {
    flex: 1,
    padding: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  emoji: {
    fontSize: 28,
    marginRight: 10,
    marginTop: 2,
  },
  nameCol: {
    flex: 1,
  },
  activityName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 4,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryPill: {
    backgroundColor: COLORS.background,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  timestamp: {
    fontSize: 11,
    color: COLORS.textLight,
  },
  deleteBtn: {
    padding: 4,
    marginLeft: 6,
  },
  deleteIcon: {
    fontSize: 18,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 13,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  co2Block: {
    alignItems: 'flex-end',
  },
  co2Value: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  co2Label: {
    fontSize: 10,
    color: COLORS.textLight,
    fontWeight: '500',
    marginTop: -2,
  },
  note: {
    marginTop: 6,
    fontSize: 12,
    color: COLORS.textLight,
    fontStyle: 'italic',
  },
});

export default ActivityCard;
