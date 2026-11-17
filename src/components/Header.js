import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import COLORS from '../constants/colors';

const Header = ({
  title,
  subtitle,
  rightComponent,
  showBack = false,
  onBack,
  style,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={[COLORS.primaryDark, COLORS.primary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.gradient,
        { paddingTop: insets.top + 12 },
        style,
      ]}
    >
      <View style={styles.row}>
        {/* Back button */}
        {showBack ? (
          <TouchableOpacity
            onPress={onBack}
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.7}
          >
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.sideSlot} />
        )}

        {/* Title block */}
        <View style={styles.titleBlock}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {!!subtitle && (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>

        {/* Right slot */}
        <View style={styles.sideSlot}>
          {rightComponent || null}
        </View>
      </View>

      {/* Bottom shadow layer */}
      <View style={styles.shadowBar} />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    paddingBottom: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 8,
    zIndex: 100,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 14,
    minHeight: 56,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  backArrow: {
    fontSize: 22,
    color: COLORS.surface,
    fontWeight: '700',
  },
  titleBlock: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.surface,
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 2,
    fontWeight: '500',
  },
  sideSlot: {
    width: 40,
    alignItems: 'flex-end',
  },
  shadowBar: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
});

export default Header;
