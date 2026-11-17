import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import COLORS from '../constants/colors';

/**
 * Reusable RadioButton Group Component (Aligned with Course W6/components/RadioButton.md)
 */
const RadioButtonGroup = ({
  options = [],
  selectedValue,
  onSelect,
  horizontal = false,
  activeColor = COLORS.primary,
}) => {
  return (
    <View style={[styles.groupContainer, horizontal && styles.horizontalGroup]}>
      {options.map((opt) => {
        const isSelected = selectedValue === opt.value;
        return (
          <TouchableOpacity
            key={String(opt.value)}
            style={[
              styles.optionCard,
              horizontal && styles.optionCardHorizontal,
              isSelected && [styles.optionCardActive, { borderColor: activeColor }],
            ]}
            onPress={() => onSelect(opt.value)}
            activeOpacity={0.75}
            accessibilityRole="radio"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={opt.label}
          >
            <View
              style={[
                styles.outerCircle,
                { borderColor: isSelected ? activeColor : '#9E9E9E' },
              ]}
            >
              {isSelected && (
                <View style={[styles.innerCircle, { backgroundColor: activeColor }]} />
              )}
            </View>

            <View style={styles.labelContainer}>
              <Text
                style={[
                  styles.optionLabel,
                  isSelected && { color: activeColor, fontWeight: '800' },
                ]}
              >
                {opt.emoji ? `${opt.emoji} ` : ''}
                {opt.label}
              </Text>
              {!!opt.description && (
                <Text style={styles.optionDesc}>{opt.description}</Text>
              )}
            </View>

            {!!opt.badge && (
              <View style={[styles.badge, isSelected && { backgroundColor: activeColor }]}>
                <Text style={[styles.badgeText, isSelected && { color: '#FFFFFF' }]}>
                  {opt.badge}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default RadioButtonGroup;

const styles = StyleSheet.create({
  groupContainer: {
    gap: 8,
  },
  horizontalGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  optionCardHorizontal: {
    flex: 1,
    minWidth: '30%',
  },
  optionCardActive: {
    backgroundColor: '#E8F5E9',
  },
  outerCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    backgroundColor: '#FFFFFF',
  },
  innerCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  labelContainer: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  optionDesc: {
    fontSize: 11,
    color: COLORS.textLight,
    marginTop: 2,
  },
  badge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginLeft: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
});
