import { ACTIVITIES } from '../constants/activities';

/**
 * Find activity object by ID
 */
export const getActivityById = (activityId) => {
  return ACTIVITIES.find((a) => a.id === activityId) || null;
};

/**
 * Calculate CO2 emission for an activity and quantity
 */
export const calculateCarbon = (activityId, quantity) => {
  const activity = getActivityById(activityId);
  if (!activity) return 0;
  const num = parseFloat(quantity);
  if (isNaN(num) || num <= 0) return 0;
  return parseFloat((num * activity.kgCO2PerUnit).toFixed(2));
};

/**
 * Check if a date string is today
 */
export const isToday = (dateString) => {
  const d = new Date(dateString);
  const now = new Date();
  return (
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  );
};

/**
 * Filter logs recorded today
 */
export const getTodayLogs = (logs = []) => {
  return logs.filter((log) => isToday(log.timestamp));
};

/**
 * Filter logs recorded in the past 7 days
 */
export const getWeekLogs = (logs = []) => {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  return logs.filter((log) => new Date(log.timestamp) >= sevenDaysAgo);
};

/**
 * Sum total CO2 from array of logs
 */
export const sumCO2 = (logs = []) => {
  const total = logs.reduce((sum, log) => sum + (parseFloat(log.kgCO2) || 0), 0);
  return parseFloat(total.toFixed(2));
};

/**
 * Get today's total emission
 */
export const getDailyTotal = (logs = []) => {
  return sumCO2(getTodayLogs(logs));
};

/**
 * Get weekly total emission
 */
export const getWeeklyTotal = (logs = []) => {
  return sumCO2(getWeekLogs(logs));
};

/**
 * Format CO2 emission for display
 */
export const formatCO2 = (kg) => {
  const val = parseFloat(kg) || 0;
  if (val < 1 && val > 0) {
    return `${Math.round(val * 1000)} g`;
  }
  return `${val.toFixed(2)} kg`;
};

/**
 * Generate 7-day data array for chart
 * [{ day: 'Mon', value: 2.4 }, ...]
 */
export const getWeeklyData = (logs = []) => {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const result = [];
  const now = new Date();

  for (let i = 6; i >= 0; i--) {
    const targetDate = new Date();
    targetDate.setDate(now.getDate() - i);
    targetDate.setHours(0, 0, 0, 0);

    const nextDate = new Date(targetDate);
    nextDate.setDate(targetDate.getDate() + 1);

    const dayName = daysOfWeek[targetDate.getDay()];

    const dayLogs = logs.filter((l) => {
      const d = new Date(l.timestamp);
      return d >= targetDate && d < nextDate;
    });

    const dayTotal = sumCO2(dayLogs);

    result.push({
      day: dayName,
      value: dayTotal,
      date: targetDate.toISOString(),
    });
  }

  return result;
};

/**
 * Breakdown emissions by the 4 main categories
 */
export const getCategoryBreakdown = (logs = []) => {
  const categories = {
    transport: 0,
    food: 0,
    energy: 0,
    shopping: 0,
  };

  logs.forEach((log) => {
    const cat = (log.category || '').toLowerCase();
    const val = parseFloat(log.kgCO2) || 0;
    if (categories[cat] !== undefined) {
      categories[cat] += val;
    }
  });

  const grandTotal = Object.values(categories).reduce((a, b) => a + b, 0);

  return Object.keys(categories).map((catId) => {
    const total = parseFloat(categories[catId].toFixed(2));
    const percentage = grandTotal > 0 ? (total / grandTotal) * 100 : 0;
    return {
      id: catId,
      category: catId,
      total,
      percentage,
    };
  });
};

/**
 * Compute active streak (consecutive days within daily goal)
 */
export const getStreakDays = (logs = [], goal = 10) => {
  if (logs.length === 0) return 1;

  let streak = 0;
  const now = new Date();

  for (let i = 0; i < 30; i++) {
    const targetDate = new Date();
    targetDate.setDate(now.getDate() - i);
    targetDate.setHours(0, 0, 0, 0);

    const nextDate = new Date(targetDate);
    nextDate.setDate(targetDate.getDate() + 1);

    const dayLogs = logs.filter((l) => {
      const d = new Date(l.timestamp);
      return d >= targetDate && d < nextDate;
    });

    const total = sumCO2(dayLogs);

    // If day was within goal, increment streak
    if (total <= goal) {
      streak++;
    } else {
      break;
    }
  }

  return Math.max(streak, 1);
};

/**
 * Calculate real-world environmental equivalents
 */
export const getLifetimeEquivalents = (totalKg = 0) => {
  const kg = Math.max(parseFloat(totalKg) || 0, 0);
  return {
    kmDriven: (kg / 0.21).toFixed(0), // Average car is 0.21 kg/km
    treesNeeded: (kg / 21.0).toFixed(1), // 1 mature tree absorbs ~21 kg CO2/year
    beefMeals: (kg / 6.61).toFixed(1), // 1 beef meal is ~6.61 kg CO2
    ledBulbHours: (kg / 0.01).toFixed(0), // 10W LED bulb is ~0.01 kg CO2/hour
  };
};
