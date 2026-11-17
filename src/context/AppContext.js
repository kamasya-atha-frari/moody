import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  getLogs,
  saveLog,
  deleteLog as deleteLogFromStorage,
  clearLogs as clearLogsFromStorage,
  getProfile,
  saveProfile as saveProfileToStorage,
  getGoal,
  saveGoal as saveGoalToStorage,
} from '../utils/storage';
import {
  getActivityById,
  calculateCarbon,
  getTodayLogs,
  getDailyTotal,
  getWeeklyTotal,
  getWeeklyData,
  getCategoryBreakdown,
  getStreakDays,
  sumCO2,
} from '../utils/carbonCalculator';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [logs, setLogs] = useState([]);
  const [profile, setProfile] = useState({
    name: 'Eco Explorer',
    avatarEmoji: '🌱',
    dailyGoal: 10.0,
    onboarded: false,
  });
  const [goal, setGoal] = useState(10.0);
  const [isLoading, setIsLoading] = useState(true);

  // Load data on startup
  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      const [storedLogs, storedProfile, storedGoal] = await Promise.all([
        getLogs(),
        getProfile(),
        getGoal(),
      ]);

      setLogs(storedLogs || []);
      setProfile(storedProfile || {});
      setGoal(storedGoal || 10.0);
    } catch (error) {
      console.error('Failed to load initial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  /**
   * Add a new carbon log entry
   */
  const addLog = async (activityId, quantity, note = '') => {
    const activity = getActivityById(activityId);
    if (!activity) {
      throw new Error(`Activity with ID ${activityId} not found`);
    }

    const kgCO2 = calculateCarbon(activityId, quantity);
    const newEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      activityId,
      activityName: activity.name,
      category: activity.category,
      emoji: activity.emoji,
      quantity: parseFloat(quantity),
      unit: activity.unit,
      kgCO2,
      note: note.trim(),
      timestamp: new Date().toISOString(),
    };

    const updatedLogs = await saveLog(newEntry);
    setLogs(updatedLogs);
    return newEntry;
  };

  /**
   * Delete an existing log
   */
  const deleteLog = async (logId) => {
    const updated = await deleteLogFromStorage(logId);
    setLogs(updated);
  };

  /**
   * Reset all activity logs
   */
  const clearLogs = async () => {
    const updated = await clearLogsFromStorage();
    setLogs(updated);
  };

  /**
   * Update user profile
   */
  const updateProfile = async (profileData) => {
    const updated = await saveProfileToStorage({
      ...profile,
      ...profileData,
    });
    setProfile(updated);
    if (profileData.dailyGoal !== undefined) {
      setGoal(profileData.dailyGoal);
    }
    return updated;
  };

  /**
   * Update daily carbon goal
   */
  const updateGoal = async (newGoal) => {
    const val = parseFloat(newGoal);
    await saveGoalToStorage(val);
    setGoal(val);
    await updateProfile({ dailyGoal: val });
  };

  // Memoized computations for performance
  const todayLogs = useMemo(() => getTodayLogs(logs), [logs]);
  const todayTotal = useMemo(() => getDailyTotal(logs), [logs]);
  const weeklyTotal = useMemo(() => getWeeklyTotal(logs), [logs]);
  const weeklyData = useMemo(() => getWeeklyData(logs), [logs]);
  const categoryBreakdown = useMemo(() => getCategoryBreakdown(logs), [logs]);
  const streak = useMemo(() => getStreakDays(logs, goal), [logs, goal]);
  const lifetimeTotal = useMemo(() => sumCO2(logs), [logs]);

  const value = {
    logs,
    profile,
    goal,
    isLoading,
    todayLogs,
    todayTotal,
    weeklyTotal,
    weeklyData,
    categoryBreakdown,
    streak,
    lifetimeTotal,
    addLog,
    deleteLog,
    clearLogs,
    updateProfile,
    updateGoal,
    refreshData: loadInitialData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
