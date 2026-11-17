import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from 'react-native';
import COLORS from '../constants/colors';

/**
 * Reusable Dropdown Picker Component (Aligned with Course W6/components/Picker.md)
 */
const CustomPicker = ({
  label,
  options = [],
  selectedValue,
  onValueChange,
  placeholder = 'Select an option',
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const selectedOption = options.find((item) => item.value === selectedValue);

  const handleSelect = (val) => {
    onValueChange(val);
    setModalVisible(false);
  };

  return (
    <View style={styles.wrapper}>
      {!!label && <Text style={styles.label}>{label}</Text>}

      <TouchableOpacity
        style={styles.pickerTrigger}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.75}
      >
        <Text style={styles.selectedText}>
          {selectedOption
            ? `${selectedOption.emoji ? selectedOption.emoji + ' ' : ''}${selectedOption.label}`
            : placeholder}
        </Text>
        <Text style={styles.chevron}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label || placeholder}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={options}
              keyExtractor={(item) => String(item.value)}
              renderItem={({ item }) => {
                const isSelected = item.value === selectedValue;
                return (
                  <TouchableOpacity
                    style={[styles.optionItem, isSelected && styles.optionItemSelected]}
                    onPress={() => handleSelect(item.value)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.optionTextSelected,
                      ]}
                    >
                      {item.emoji ? `${item.emoji}  ` : ''}
                      {item.label}
                    </Text>
                    {isSelected && <Text style={styles.checkIcon}>✓</Text>}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default CustomPicker;

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  pickerTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  selectedText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  chevron: {
    fontSize: 10,
    color: COLORS.primary,
    marginLeft: 8,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 16,
    maxHeight: 360,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  closeBtn: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textLight,
    paddingHorizontal: 4,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 4,
  },
  optionItemSelected: {
    backgroundColor: '#E8F5E9',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  optionTextSelected: {
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  checkIcon: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.primary,
  },
});
