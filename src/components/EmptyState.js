import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import COLORS from '../constants/colors';

const EmptyState = ({ emoji = '🌿', title, subtitle, actionText, onAction }) => {
  return (
    <View style={styles.container}>
      <View style={styles.dashedBox}>
        <Text style={styles.emoji}>{emoji}</Text>
        {title && <Text style={styles.title}>{title}</Text>}
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        {actionText && onAction && (
          <TouchableOpacity style={styles.actionButton} onPress={onAction} activeOpacity={0.75}>
            <Text style={styles.actionText}>{actionText}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  dashedBox: {
    borderWidth: 2,
    borderColor: '#BDBDBD',
    borderStyle: 'dashed',
    borderRadius: 16,
    paddingVertical: 36,
    paddingHorizontal: 28,
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    width: '100%',
  },
  emoji: {
    fontSize: 60,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textDark,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  actionButton: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 24,
    marginTop: 4,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
});

export default EmptyState;
