import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import COLORS from '../constants/colors';

/**
 * Reusable Checkbox Component (Aligned with Course W6/components/Checkbox.md)
 */
const CustomCheckbox = ({
  checked = false,
  onPress,
  label,
  subtitle,
  badgeText,
  color = COLORS.primary,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, checked && styles.containerChecked]}
      onPress={onPress}
      activeOpacity={0.75}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={label}
    >
      <View
        style={[
          styles.box,
          { borderColor: checked ? color : '#9E9E9E' },
          checked && { backgroundColor: color },
        ]}
      >
        {checked && <Text style={styles.checkmark}>✓</Text>}
      </View>

      <View style={styles.textColumn}>
        <Text style={[styles.label, checked && styles.labelChecked]}>{label}</Text>
        {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>

      {!!badgeText && (
        <View style={[styles.badge, checked && { backgroundColor: color }]}>
          <Text style={[styles.badgeText, checked && { color: '#FFFFFF' }]}>
            {badgeText}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default CustomCheckbox;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  containerChecked: {
    backgroundColor: '#E8F5E9',
    borderColor: COLORS.primaryLight,
  },
  box: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: '#FFFFFF',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  textColumn: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  labelChecked: {
    textDecorationLine: 'line-through',
    color: COLORS.textSecondary,
  },
  subtitle: {
    fontSize: 11,
    color: COLORS.textLight,
    marginTop: 2,
  },
  badge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
});
