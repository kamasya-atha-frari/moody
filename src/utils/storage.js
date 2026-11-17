import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  LOGS: '@greenstep_logs_v1',
  PROFILE: '@greenstep_profile_v1',
  GOAL: '@greenstep_goal_v1',
};

// Default seed data for a fresh or initial testing experience
export const DEFAULT_PROFILE = {
  name: 'Eco Warrior',
  avatarEmoji: '🌱',
  dailyGoal: 10.0, // kg CO2
  joinedDate: new Date().toISOString(),
  onboarded: false,
};

export const DEFAULT_INITIAL_LOGS = [
  {
    id: 'seed-1',
    activityId: 'bus',
    activityName: 'City Bus Ride',
    category: 'transport',
    emoji: '🚌',
    quantity: 12,
    unit: 'km',
    kgCO2: 1.07,
    note: 'Commute to campus',
    timestamp: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
  },
  {
    id: 'seed-2',
    activityId: 'chicken_meal',
    activityName: 'Chicken Meal',
    category: 'food',
    emoji: '🍗',
    quantity: 1,
    unit: 'meal',
    kgCO2: 1.57,
    note: 'Lunch at cafeteria',
    timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  },
  {
    id: 'seed-3',
    activityId: 'air_conditioner',
    activityName: 'Air Conditioner',
    category: 'energy',
    emoji: '❄️',
    quantity: 2,
    unit: 'hours',
    kgCO2: 1.36,
    note: 'Study session',
    timestamp: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
  },
];

/**
 * Get all logs
 */
export const getLogs = async () => {
  try {
    const json = await AsyncStorage.getItem(KEYS.LOGS);
    if (!json) {
      // First run: save seed logs
      await AsyncStorage.setItem(KEYS.LOGS, JSON.stringify(DEFAULT_INITIAL_LOGS));
      return DEFAULT_INITIAL_LOGS;
    }
    return JSON.parse(json);
  } catch (error) {
    console.error('Error fetching logs from AsyncStorage:', error);
    return DEFAULT_INITIAL_LOGS;
  }
};

/**
 * Save new log entry
 */
export const saveLog = async (logEntry) => {
  try {
    const existing = await getLogs();
    const updated = [logEntry, ...existing];
    await AsyncStorage.setItem(KEYS.LOGS, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Error saving log to AsyncStorage:', error);
    throw error;
  }
};

/**
 * Delete log entry by ID
 */
export const deleteLog = async (logId) => {
  try {
    const existing = await getLogs();
    const updated = existing.filter((item) => item.id !== logId);
    await AsyncStorage.setItem(KEYS.LOGS, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Error deleting log from AsyncStorage:', error);
    throw error;
  }
};

/**
 * Clear all logs
 */
export const clearLogs = async () => {
  try {
    await AsyncStorage.setItem(KEYS.LOGS, JSON.stringify([]));
    return [];
  } catch (error) {
    console.error('Error clearing logs in AsyncStorage:', error);
    throw error;
  }
};

/**
 * Get user profile
 */
export const getProfile = async () => {
  try {
    const json = await AsyncStorage.getItem(KEYS.PROFILE);
    if (!json) {
      return DEFAULT_PROFILE;
    }
    return { ...DEFAULT_PROFILE, ...JSON.parse(json) };
  } catch (error) {
    console.error('Error fetching profile from AsyncStorage:', error);
    return DEFAULT_PROFILE;
  }
};

/**
 * Save user profile
 */
export const saveProfile = async (profile) => {
  try {
    const updated = { ...DEFAULT_PROFILE, ...profile };
    await AsyncStorage.setItem(KEYS.PROFILE, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Error saving profile to AsyncStorage:', error);
    throw error;
  }
};

/**
 * Get daily goal
 */
export const getGoal = async () => {
  try {
    const val = await AsyncStorage.getItem(KEYS.GOAL);
    return val ? parseFloat(val) : 10.0;
  } catch (error) {
    return 10.0;
  }
};

/**
 * Save daily goal
 */
export const saveGoal = async (goalKg) => {
  try {
    await AsyncStorage.setItem(KEYS.GOAL, String(goalKg));
    return goalKg;
  } catch (error) {
    console.error('Error saving goal to AsyncStorage:', error);
    throw error;
  }
};
