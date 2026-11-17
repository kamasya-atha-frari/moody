import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  SafeAreaView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Svg, Rect, Circle, Line, Path, Text as SvgText } from 'react-native-svg';
import COLORS from '../constants/colors';
import CustomCheckbox from '../components/CustomCheckbox';
import RadioButtonGroup from '../components/RadioButtonGroup';
import { useApp } from '../context/AppContext';

/**
 * EcoHubScreen: Integrates W9 Course Modules & Bonus Platform Features
 * - W9/components/ReactNativeMaps.md & ReactNativeLeaflet.md: Interactive Green Spots Map with lat/lng pins
 * - W9/components/Camera.md & W6/components/Image.md: Eco-Photo Proof & Camera Viewfinder Simulator
 * - W9/components/Notifications.md: Smart Eco-Reminders & Instant Notification Banner
 */
const GREEN_SPOTS = [
  {
    id: 'spot-1',
    name: 'IU Beyazıt Campus Zero-Waste Station',
    type: 'Recycling & Compost',
    emoji: '♻️',
    lat: 41.0119,
    lng: 28.9642,
    x: 110,
    y: 85,
    offsetKg: 0.5,
    address: 'Beyazıt Main Campus, Fatih / Istanbul',
    hours: '08:00 – 19:00',
  },
  {
    id: 'spot-2',
    name: 'Vezneciler Metro & E-Mobility Hub',
    type: 'Green Transit',
    emoji: '🚇',
    lat: 41.0128,
    lng: 28.9594,
    x: 65,
    y: 65,
    offsetKg: 1.2,
    address: 'M2 Metro Line Vezneciler Exit, Istanbul',
    hours: '06:00 – 00:00',
  },
  {
    id: 'spot-3',
    name: 'Alfred Heilbronn Botanical Garden',
    type: 'Urban Carbon Sink',
    emoji: '🌳',
    lat: 41.0163,
    lng: 28.9635,
    x: 165,
    y: 50,
    offsetKg: 0.8,
    address: 'Süleymaniye, Fetva Yokuşu, Fatih',
    hours: '09:00 – 17:00',
  },
  {
    id: 'spot-4',
    name: 'Campus Refill & Solar Charging Point',
    type: 'Clean Energy & Water',
    emoji: '☀️',
    lat: 41.0104,
    lng: 28.9658,
    x: 225,
    y: 115,
    offsetKg: 0.4,
    address: 'Student Center Courtyard, Istanbul',
    hours: '24/7 Open Access',
  },
  {
    id: 'spot-5',
    name: 'Eminönü Ferry & Bike Share Dock',
    type: 'Low-Carbon Commute',
    emoji: '🚲',
    lat: 41.0175,
    lng: 28.9709,
    x: 275,
    y: 65,
    offsetKg: 0.9,
    address: 'Eminönü Coastline Bike Terminal',
    hours: '06:00 – 23:00',
  },
];

const PHOTO_PRESETS = [
  {
    id: 'photo-transit',
    label: 'Metro / Bus Commute',
    emoji: '🚇',
    uri: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
    caption: 'Verified Public Transit Commute (-1.4 kg CO₂ saved vs car)',
  },
  {
    id: 'photo-bike',
    label: 'Campus Cycling',
    emoji: '🚲',
    uri: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80',
    caption: 'Zero-Emission Bicycle Ride (-2.1 kg CO₂ saved)',
  },
  {
    id: 'photo-plant',
    label: 'Plant-Based Meal',
    emoji: '🥗',
    uri: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
    caption: 'Vegetarian Campus Lunch (-4.8 kg CO₂ saved vs beef)',
  },
];

const NOTIFICATION_CHANNELS = [
  { value: 'morning', label: '08:30 AM – Green Commute Alert', emoji: '🚌', badge: 'Daily' },
  { value: 'lunch', label: '12:30 PM – Sustainable Meal Reminder', emoji: '🥗', badge: 'Midday' },
  { value: 'evening', label: '09:00 PM – Daily Carbon Summary', emoji: '🌙', badge: 'Night' },
];

const EcoHubScreen = () => {
  const { addLog } = useApp();
  const [selectedSpot, setSelectedSpot] = useState(GREEN_SPOTS[0]);
  const [checkedInSpots, setCheckedInSpots] = useState(['spot-1']);

  // W9 Camera / Photo Proof State
  const [cameraModalVisible, setCameraModalVisible] = useState(false);
  const [capturedPhotos, setCapturedPhotos] = useState([PHOTO_PRESETS[0]]);
  const [selectedPreset, setSelectedPreset] = useState(PHOTO_PRESETS[1]);

  // W9 Notifications State
  const [selectedChannel, setSelectedChannel] = useState('morning');
  const [pushEnabled, setPushEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [liveBanner, setLiveBanner] = useState(null);

  const handleCheckIn = async (spot) => {
    if (!checkedInSpots.includes(spot.id)) {
      setCheckedInSpots((prev) => [...prev, spot.id]);
    }
    await addLog('walking', 2, `Eco Check-in: ${spot.name}`);
    Alert.alert(
      'Green Spot Check-In! 📍',
      `Checked in at ${spot.name} (${spot.lat.toFixed(4)}, ${spot.lng.toFixed(4)}).\nLogged a green walking trip to your timeline!`
    );
  };

  const handleCapturePhoto = () => {
    const newEntry = {
      ...selectedPreset,
      id: `snap-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setCapturedPhotos((prev) => [newEntry, ...prev]);
    setCameraModalVisible(false);
    Alert.alert('Eco-Photo Verified 📸', `Saved "${selectedPreset.label}" proof to your Eco-Gallery.`);
  };

  const handleTriggerNotification = () => {
    const channelObj = NOTIFICATION_CHANNELS.find((c) => c.value === selectedChannel);
    setLiveBanner({
      title: '🔔 GreenStep Smart Notification',
      body: channelObj
        ? `${channelObj.label} — Stay under your daily CO₂ target!`
        : 'Remember to log your daily eco-activities!',
      time: 'Just now',
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={[COLORS.primaryDark, COLORS.primary]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Campus Eco-Hub 🗺️📸🔔</Text>
        <Text style={styles.headerSub}>
          Interactive Green Map, Camera Proof & Smart Notifications
        </Text>
      </LinearGradient>

      {/* Instant Notification Banner (W9 Notifications Demo) */}
      {!!liveBanner && (
        <TouchableOpacity
          style={styles.notificationBanner}
          onPress={() => setLiveBanner(null)}
          activeOpacity={0.9}
        >
          <View style={styles.notifTextCol}>
            <Text style={styles.notifTitle}>{liveBanner.title}</Text>
            <Text style={styles.notifBody}>{liveBanner.body}</Text>
          </View>
          <Text style={styles.notifDismiss}>✕</Text>
        </TouchableOpacity>
      )}

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* SECTION 1: W9 Interactive Campus Green Map */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>🗺️ Campus & City Green Spots Map</Text>
            <Text style={styles.coordTag}>
              {selectedSpot.lat.toFixed(4)}°N, {selectedSpot.lng.toFixed(4)}°E
            </Text>
          </View>
          <Text style={styles.cardSubtitle}>
            Tap any pin on the interactive coordinate map to inspect recycling, solar, and transit hubs:
          </Text>

          {/* Interactive SVG Map Canvas */}
          <View style={styles.mapCanvas}>
            <Svg width="100%" height="165" viewBox="0 0 340 165">
              {/* Map Background & Water (Golden Horn / Bosphorus style) */}
              <Rect x="0" y="0" width="340" height="165" rx="14" fill="#E8F5E9" />
              <Path
                d="M 0 25 Q 140 45 240 15 L 340 0 L 340 45 Q 230 65 0 40 Z"
                fill="#B3E5FC"
              />
              {/* Campus Green Park Zones */}
              <Circle cx="165" cy="55" r="28" fill="#C8E6C9" />
              <Circle cx="110" cy="90" r="32" fill="#DCEDC8" />
              {/* Roads / Metro Grid Lines */}
              <Line x1="20" y1="65" x2="320" y2="65" stroke="#A5D6A7" strokeWidth="3" strokeDasharray="6,4" />
              <Line x1="110" y1="20" x2="110" y2="155" stroke="#FFFFFF" strokeWidth="4" />
              <Line x1="20" y1="115" x2="320" y2="115" stroke="#FFFFFF" strokeWidth="4" />

              <SvgText x="14" y="20" fill="#0277BD" fontSize="10" fontWeight="bold">
                Golden Horn / Haliç Waterway
              </SvgText>
            </Svg>

            {/* Interactive Map Markers */}
            {GREEN_SPOTS.map((spot) => {
              const isSelected = selectedSpot.id === spot.id;
              const isVisited = checkedInSpots.includes(spot.id);
              return (
                <TouchableOpacity
                  key={spot.id}
                  style={[
                    styles.mapPin,
                    { left: spot.x - 18, top: spot.y - 18 },
                    isSelected && styles.mapPinActive,
                  ]}
                  onPress={() => setSelectedSpot(spot)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.mapPinEmoji}>{spot.emoji}</Text>
                  {isVisited && <View style={styles.visitedDot} />}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Selected Map Marker Details */}
          <View style={styles.spotDetailBox}>
            <View style={styles.spotTopRow}>
              <Text style={styles.spotEmoji}>{selectedSpot.emoji}</Text>
              <View style={styles.spotInfoCol}>
                <Text style={styles.spotName}>{selectedSpot.name}</Text>
                <Text style={styles.spotAddress}>📍 {selectedSpot.address}</Text>
                <Text style={styles.spotMeta}>
                  🕒 {selectedSpot.hours} • Category: {selectedSpot.type}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.checkInBtn}
              onPress={() => handleCheckIn(selectedSpot)}
              activeOpacity={0.8}
            >
              <Text style={styles.checkInBtnText}>
                {checkedInSpots.includes(selectedSpot.id)
                  ? `✓ Checked In • Log Visit Again (-${selectedSpot.offsetKg} kg CO₂)`
                  : `Check In at Location (-${selectedSpot.offsetKg} kg CO₂)`}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* SECTION 2: W9 Camera & W6 Image Component */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>📸 Eco-Camera & Photo Proof</Text>
            <TouchableOpacity
              style={styles.openCameraBtn}
              onPress={() => setCameraModalVisible(true)}
            >
              <Text style={styles.openCameraBtnText}>+ Open Camera</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.cardSubtitle}>
            Snap or attach photo evidence of your sustainable habits (W9 Camera & W6 Image):
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.photoRow}
          >
            {capturedPhotos.map((item) => (
              <View key={item.id} style={styles.photoCard}>
                <Image
                  source={{ uri: item.uri }}
                  style={styles.photoImage}
                  resizeMode="cover"
                />
                <View style={styles.photoOverlayBadge}>
                  <Text style={styles.photoBadgeText}>{item.emoji} Verified</Text>
                </View>
                <View style={styles.photoBody}>
                  <Text style={styles.photoLabel}>{item.label}</Text>
                  <Text style={styles.photoCaption} numberOfLines={2}>
                    {item.caption}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* SECTION 3: W9 Notifications & W6 RadioButton / Checkbox */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🔔 Smart Eco-Notifications (W9)</Text>
          <Text style={styles.cardSubtitle}>
            Configure your preferred reminder schedule and test push alerts:
          </Text>

          <CustomCheckbox
            checked={pushEnabled}
            onPress={() => setPushEnabled(!pushEnabled)}
            label="Enable Daily Carbon Budget Alerts"
            subtitle="Receive a reminder when you reach 80% of your daily CO₂ ceiling"
            badgeText="Active"
          />

          <CustomCheckbox
            checked={soundEnabled}
            onPress={() => setSoundEnabled(!soundEnabled)}
            label="Morning Green Transit Notification"
            subtitle="Prompts public transport or cycling before morning commute"
            badgeText="08:30"
          />

          <Text style={styles.subLabel}>Select Notification Schedule (RadioButton):</Text>
          <RadioButtonGroup
            options={NOTIFICATION_CHANNELS}
            selectedValue={selectedChannel}
            onSelect={setSelectedChannel}
          />

          <TouchableOpacity
            style={styles.testNotifBtn}
            onPress={handleTriggerNotification}
            activeOpacity={0.8}
          >
            <Text style={styles.testNotifBtnText}>
              🔔 Trigger Instant Test Notification
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Camera Viewfinder Modal (W9 Camera Demo) */}
      <Modal
        visible={cameraModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCameraModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.cameraModalCard}>
            <Text style={styles.cameraModalTitle}>📸 Eco-Action Camera Viewfinder</Text>
            <Text style={styles.cameraModalSub}>
              Select the green activity you are capturing for verification:
            </Text>

            <View style={styles.viewfinderFrame}>
              <Image
                source={{ uri: selectedPreset.uri }}
                style={styles.viewfinderImage}
                resizeMode="cover"
              />
              <View style={styles.viewfinderCornerTL} />
              <View style={styles.viewfinderCornerTR} />
              <View style={styles.viewfinderCornerBL} />
              <View style={styles.viewfinderCornerBR} />
              <View style={styles.viewfinderTag}>
                <Text style={styles.viewfinderTagText}>
                  {selectedPreset.emoji} {selectedPreset.label} • REC ●
                </Text>
              </View>
            </View>

            <View style={styles.presetSelectorRow}>
              {PHOTO_PRESETS.map((preset) => {
                const active = selectedPreset.id === preset.id;
                return (
                  <TouchableOpacity
                    key={preset.id}
                    style={[styles.presetChip, active && styles.presetChipActive]}
                    onPress={() => setSelectedPreset(preset)}
                  >
                    <Text
                      style={[
                        styles.presetChipText,
                        active && styles.presetChipTextActive,
                      ]}
                    >
                      {preset.emoji} {preset.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.cameraActionsRow}>
              <TouchableOpacity
                style={styles.cancelCameraBtn}
                onPress={() => setCameraModalVisible(false)}
              >
                <Text style={styles.cancelCameraText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.shutterBtn}
                onPress={handleCapturePhoto}
              >
                <Text style={styles.shutterBtnText}>📸 Capture & Verify</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default EcoHubScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 36 : 14,
    paddingBottom: 18,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  headerSub: {
    fontSize: 12,
    color: '#C8E6C9',
    textAlign: 'center',
    marginTop: 3,
  },
  notificationBanner: {
    backgroundColor: '#1B5E20',
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#A5D6A7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  notifTextCol: {
    flex: 1,
  },
  notifTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFF59D',
  },
  notifBody: {
    fontSize: 12,
    color: '#FFFFFF',
    marginTop: 2,
  },
  notifDismiss: {
    color: '#C8E6C9',
    fontSize: 16,
    fontWeight: '800',
    paddingLeft: 10,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 36,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  coordTag: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primary,
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  cardSubtitle: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 12,
    lineHeight: 17,
  },
  mapCanvas: {
    height: 165,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    marginBottom: 12,
    position: 'relative',
  },
  mapPin: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  mapPinActive: {
    backgroundColor: COLORS.primary,
    transform: [{ scale: 1.18 }],
    borderColor: '#FFF59D',
  },
  mapPinEmoji: {
    fontSize: 16,
  },
  visitedDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.success,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  spotDetailBox: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  spotTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  spotEmoji: {
    fontSize: 28,
  },
  spotInfoCol: {
    flex: 1,
  },
  spotName: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  spotAddress: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  spotMeta: {
    fontSize: 10,
    color: COLORS.textLight,
    marginTop: 2,
  },
  checkInBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 9,
    alignItems: 'center',
  },
  checkInBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  openCameraBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  openCameraBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  photoRow: {
    gap: 12,
    paddingRight: 8,
  },
  photoCard: {
    width: 200,
    backgroundColor: COLORS.card,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  photoImage: {
    width: '100%',
    height: 110,
    backgroundColor: '#E0E0E0',
  },
  photoOverlayBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(27, 94, 32, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  photoBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  photoBody: {
    padding: 10,
  },
  photoLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  photoCaption: {
    fontSize: 11,
    color: COLORS.textLight,
    marginTop: 2,
    lineHeight: 15,
  },
  subLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    marginTop: 10,
    marginBottom: 6,
  },
  testNotifBtn: {
    marginTop: 12,
    backgroundColor: '#FF6F00',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  testNotifBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 20,
  },
  cameraModalCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 18,
  },
  cameraModalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textDark,
    textAlign: 'center',
  },
  cameraModalSub: {
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 12,
  },
  viewfinderFrame: {
    height: 190,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 12,
    backgroundColor: '#000',
  },
  viewfinderImage: {
    width: '100%',
    height: '100%',
  },
  viewfinderCornerTL: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 24,
    height: 24,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#69F0AE',
  },
  viewfinderCornerTR: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: '#69F0AE',
  },
  viewfinderCornerBL: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    width: 24,
    height: 24,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#69F0AE',
  },
  viewfinderCornerBR: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 24,
    height: 24,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: '#69F0AE',
  },
  viewfinderTag: {
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  viewfinderTagText: {
    color: '#69F0AE',
    fontSize: 11,
    fontWeight: '800',
  },
  presetSelectorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 14,
  },
  presetChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  presetChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  presetChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  presetChipTextActive: {
    color: '#FFFFFF',
  },
  cameraActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelCameraBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  cancelCameraText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textLight,
  },
  shutterBtn: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  shutterBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
