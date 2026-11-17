import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import COLORS from '../constants/colors';
import { ACTIVITY_CATEGORIES, ACTIVITIES } from '../constants/activities';
import { calculateCarbon, getActivityById } from '../utils/carbonCalculator';
import { useApp } from '../context/AppContext';
import RadioButtonGroup from '../components/RadioButtonGroup';

const CATEGORY_COLORS = {
  transport: '#1565C0',
  food: '#E65100',
  energy: '#F9A825',
  shopping: '#6A1B9A',
};

const QUICK_AMOUNTS = {
  km: [5, 10, 25, 50],
  meal: [1, 2, 3],
  hours: [1, 2, 4, 8],
  item: [1, 2, 3, 5],
  bag: [1, 2, 5],
  cycle: [1, 2],
  shower: [1, 2],
};

// W6 RadioButton Options for Efficiency / Intensity Multiplier
const INTENSITY_MODES = [
  {
    value: 0.8,
    label: 'Eco / Shared Mode (0.8x)',
    emoji: '🌱',
    description: 'Carpooling, off-peak energy, or eco-certified product',
    badge: '-20% CO₂',
  },
  {
    value: 1.0,
    label: 'Standard Mode (1.0x)',
    emoji: '⚖️',
    description: 'Average baseline emission factor (DEFRA standard)',
    badge: '1.0x',
  },
  {
    value: 1.2,
    label: 'Heavy / Peak Traffic (1.2x)',
    emoji: '🔥',
    description: 'Stop-and-go traffic congestion or high-load appliance',
    badge: '+20% CO₂',
  },
];

const LogActivityScreen = ({ navigation, route }) => {
  const { addLog } = useApp();

  const initialCat = route?.params?.category || 'transport';
  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [selectedActivityId, setSelectedActivityId] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [intensityMultiplier, setIntensityMultiplier] = useState(1.0);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update category when route param changes
  useEffect(() => {
    if (route?.params?.category) {
      setSelectedCategory(route.params.category);
    }
  }, [route?.params?.category]);

  // Filter activities by active category
  const filteredActivities = ACTIVITIES.filter(
    (act) => act.category.toLowerCase() === selectedCategory.toLowerCase()
  );

  const activeActivity = getActivityById(selectedActivityId);

  // Select first activity by default when category changes if none selected
  useEffect(() => {
    if (filteredActivities.length > 0 && (!selectedActivityId || activeActivity?.category !== selectedCategory)) {
      setSelectedActivityId(filteredActivities[0].id);
      setQuantity(String(filteredActivities[0].defaultQuantity || 1));
    }
  }, [selectedCategory]);

  const baseCO2 = selectedActivityId && quantity
    ? calculateCarbon(selectedActivityId, quantity)
    : 0;
  const estimatedCO2 = parseFloat((baseCO2 * intensityMultiplier).toFixed(2));

  const handleSelectActivity = (act) => {
    setSelectedActivityId(act.id);
    if (!quantity || quantity === '0') {
      setQuantity(String(act.defaultQuantity || 1));
    }
  };

  const handleQuickAmount = (val) => {
    setQuantity(String(val));
  };

  const handleSubmit = async () => {
    if (!selectedActivityId) {
      Alert.alert('Required', 'Please select an activity.');
      return;
    }

    const numQty = parseFloat(quantity);
    if (isNaN(numQty) || numQty <= 0) {
      Alert.alert('Invalid Quantity', 'Please enter a valid amount greater than zero.');
      return;
    }

    try {
      setIsSubmitting(true);
      const effectiveQty = parseFloat((numQty * intensityMultiplier).toFixed(2));
      const modeTag =
        intensityMultiplier === 0.8
          ? ' [Eco Mode 0.8x]'
          : intensityMultiplier === 1.2
          ? ' [Peak Mode 1.2x]'
          : '';
      await addLog(selectedActivityId, effectiveQty, `${note}${modeTag}`.trim());

      Alert.alert(
        'Activity Logged! 🌿',
        `Recorded ${estimatedCO2.toFixed(2)} kg CO₂ for ${activeActivity.name}.`,
        [
          {
            text: 'View Dashboard',
            onPress: () => {
              setNote('');
              navigation.navigate('Home');
            },
          },
          {
            text: 'Log Another',
            onPress: () => {
              setNote('');
            },
            style: 'cancel',
          },
        ]
      );
    } catch (err) {
      Alert.alert('Error', 'Failed to save log. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const unit = activeActivity?.unit || '';
  const quickOptions = QUICK_AMOUNTS[unit] || [1, 2, 5, 10];

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flexOne}
      >
        {/* Screen Header */}
        <LinearGradient
          colors={[COLORS.primaryDark, COLORS.primary]}
          style={styles.header}
        >
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>Log Carbon Activity ➕</Text>
            <Text style={styles.headerSub}>Track daily activities and compute emissions</Text>
          </View>
        </LinearGradient>

        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Category Selector Tabs */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>1. SELECT SECTOR</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.catPillsRow}
            >
              {ACTIVITY_CATEGORIES.map((cat) => {
                const isActive = selectedCategory.toLowerCase() === cat.id.toLowerCase();
                const catColor = CATEGORY_COLORS[cat.id] || COLORS.primary;

                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.catPill,
                      isActive && { backgroundColor: catColor, borderColor: catColor },
                    ]}
                    onPress={() => setSelectedCategory(cat.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.catPillEmoji}>{cat.emoji}</Text>
                    <Text
                      style={[
                        styles.catPillText,
                        isActive && styles.catPillTextActive,
                      ]}
                    >
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Activities Horizontal or Grid */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>2. CHOOSE ACTIVITY</Text>
            <View style={styles.activityGrid}>
              {filteredActivities.map((act) => {
                const isSelected = selectedActivityId === act.id;
                const catColor = CATEGORY_COLORS[act.category] || COLORS.primary;

                return (
                  <TouchableOpacity
                    key={act.id}
                    style={[
                      styles.activityCard,
                      isSelected && [styles.activityCardActive, { borderColor: catColor }],
                    ]}
                    onPress={() => handleSelectActivity(act)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.actCardTop}>
                      <Text style={styles.actEmoji}>{act.emoji}</Text>
                      {isSelected && (
                        <View style={[styles.activeCheck, { backgroundColor: catColor }]}>
                          <Text style={styles.checkIcon}>✓</Text>
                        </View>
                      )}
                    </View>

                    <Text style={styles.actName} numberOfLines={1}>
                      {act.name}
                    </Text>
                    <Text style={styles.actFactor}>
                      {act.kgCO2PerUnit} kg / {act.unit}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Quantity & Calculation Card */}
          {activeActivity && (
            <View style={styles.formCard}>
              <View style={styles.formCardHeader}>
                <Text style={styles.sectionLabel}>3. AMOUNT, MODE & NOTE</Text>
                <Text style={styles.activityUnitBadge}>
                  Unit: {activeActivity.unitLabel || activeActivity.unit}
                </Text>
              </View>

              {/* Quantity Input with Quick Chips */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputTitle}>How much did you use/consume?</Text>
                <View style={styles.qtyRow}>
                  <TextInput
                    style={styles.qtyInput}
                    keyboardType="numeric"
                    value={quantity}
                    onChangeText={setQuantity}
                    placeholder="0"
                    placeholderTextColor={COLORS.textLight}
                    maxLength={6}
                  />
                  <View style={styles.unitSuffix}>
                    <Text style={styles.unitSuffixText}>{activeActivity.unit}</Text>
                  </View>
                </View>

                {/* Quick amount chips */}
                <View style={styles.quickChipsRow}>
                  {quickOptions.map((opt) => (
                    <TouchableOpacity
                      key={opt}
                      style={[
                        styles.chipBtn,
                        quantity === String(opt) && styles.chipBtnActive,
                      ]}
                      onPress={() => handleQuickAmount(opt)}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          quantity === String(opt) && styles.chipTextActive,
                        ]}
                      >
                        +{opt} {activeActivity.unit}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* W6 RadioButton Component: Efficiency / Intensity Selector */}
              <View style={styles.radioSection}>
                <Text style={styles.inputTitle}>
                  Efficiency / Condition Mode (RadioButton):
                </Text>
                <RadioButtonGroup
                  options={INTENSITY_MODES}
                  selectedValue={intensityMultiplier}
                  onSelect={setIntensityMultiplier}
                />
              </View>

              {/* Real-time Carbon Calculation Preview Banner */}
              <View style={styles.calcPreviewBox}>
                <View style={styles.calcPreviewLeft}>
                  <Text style={styles.calcPreviewLabel}>Impact Estimate:</Text>
                  <Text style={styles.calcFormula}>
                    {quantity || '0'} {activeActivity.unit} × {activeActivity.kgCO2PerUnit} kg ×{' '}
                    {intensityMultiplier}x
                  </Text>
                </View>
                <View style={styles.calcPreviewRight}>
                  <Text style={styles.calcResultValue}>{estimatedCO2.toFixed(2)}</Text>
                  <Text style={styles.calcResultUnit}>kg CO₂</Text>
                </View>
              </View>

              {/* Optional Note */}
              <View style={styles.noteContainer}>
                <Text style={styles.inputTitle}>Note (Optional)</Text>
                <TextInput
                  style={styles.noteInput}
                  placeholder="e.g. Routine trip to campus or dinner"
                  placeholderTextColor={COLORS.textLight}
                  value={note}
                  onChangeText={setNote}
                  maxLength={60}
                />
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={isSubmitting}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[COLORS.primary, COLORS.primaryDark]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.submitGradient}
                >
                  <Text style={styles.submitButtonText}>
                    {isSubmitting ? 'Recording...' : `Log Activity (${estimatedCO2.toFixed(2)} kg) 🌿`}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

          {/* Eco Fact Info Card */}
          <View style={styles.infoBox}>
            <Text style={styles.infoEmoji}>💡</Text>
            <Text style={styles.infoText}>
              Did you know? The global target for personal carbon emissions is under 5.0 kg CO₂ per
              day to curb global warming!
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LogActivityScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  flexOne: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 36 : 14,
    paddingBottom: 18,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerRow: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  headerSub: {
    fontSize: 12,
    color: '#C8E6C9',
    marginTop: 3,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 36,
  },
  section: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textLight,
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  catPillsRow: {
    gap: 8,
    paddingRight: 8,
  },
  catPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    gap: 6,
  },
  catPillEmoji: {
    fontSize: 16,
  },
  catPillText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  catPillTextActive: {
    color: '#FFFFFF',
  },
  activityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  activityCard: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  activityCardActive: {
    backgroundColor: COLORS.card,
  },
  actCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  actEmoji: {
    fontSize: 26,
  },
  activeCheck: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIcon: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  actName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  actFactor: {
    fontSize: 11,
    color: COLORS.textLight,
    marginTop: 2,
  },
  formCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 16,
  },
  formCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  activityUnitBadge: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.primary,
    backgroundColor: COLORS.background,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  inputContainer: {
    marginBottom: 14,
  },
  radioSection: {
    marginBottom: 8,
  },
  inputTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 6,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    backgroundColor: COLORS.card,
    overflow: 'hidden',
  },
  qtyInput: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  unitSuffix: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#E8F5E9',
  },
  unitSuffixText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  quickChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  chipBtn: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  chipBtnActive: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  calcPreviewBox: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  calcPreviewLeft: {
    flex: 1,
  },
  calcPreviewLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  calcFormula: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  calcPreviewRight: {
    alignItems: 'flex-end',
  },
  calcResultValue: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.primaryDark,
  },
  calcResultUnit: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  noteContainer: {
    marginBottom: 16,
  },
  noteInput: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: COLORS.textDark,
  },
  submitButton: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitGradient: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#FFFDE7',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FFF59D',
    gap: 10,
    alignItems: 'center',
  },
  infoEmoji: {
    fontSize: 20,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#F57F17',
    lineHeight: 17,
  },
});
