
// import { UserProfile, DailyLogEntry } from '../types';

// const USER_PROFILE_KEY = 'calorieCamAiUserProfile';
// const DAILY_LOGS_KEY = 'calorieCamAiDailyLogs';

// 사용자 프로필 및 일일 기록은 이제 Google Sheets를 통해 관리됩니다.
// 이 파일의 함수들은 직접적으로 사용되지 않지만,
// 향후 오프라인 캐싱 또는 로컬 헬퍼 함수가 필요할 경우 참고용으로 남겨둘 수 있습니다.

/*
export const saveUserProfile = (profile: UserProfile): void => {
  try {
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
  } catch (error) {
    console.error("Error saving user profile to localStorage:", error);
  }
};

export const loadUserProfile = (): UserProfile | null => {
  try {
    const profileJson = localStorage.getItem(USER_PROFILE_KEY);
    return profileJson ? JSON.parse(profileJson) : null;
  } catch (error) {
    console.error("Error loading user profile from localStorage:", error);
    return null;
  }
};

export const clearUserProfile = (): void => {
  try {
    localStorage.removeItem(USER_PROFILE_KEY);
  } catch (error) {
    console.error("Error clearing user profile from localStorage:", error);
  }
};

export const saveDailyLogs = (logs: DailyLogEntry[]): void => {
  try {
    // Keep only the last 30 days of logs to prevent localStorage from growing too large
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentLogs = logs.filter(log => new Date(log.date) >= thirtyDaysAgo);
    localStorage.setItem(DAILY_LOGS_KEY, JSON.stringify(recentLogs));
  } catch (error) {
    console.error("Error saving daily logs to localStorage:", error);
  }
};

export const loadDailyLogs = (): DailyLogEntry[] => {
  try {
    const logsJson = localStorage.getItem(DAILY_LOGS_KEY);
    return logsJson ? JSON.parse(logsJson) : [];
  } catch (error) {
    console.error("Error loading daily logs from localStorage:", error);
    return [];
  }
};

// Helper to get today's log or create a new one
// This logic is now likely in App.tsx or a similar higher-level component
export const getTodaysLog = (logs: DailyLogEntry[]): DailyLogEntry => {
  const todayStr = new Date().toISOString().split('T')[0];
  let todayLog = logs.find(log => log.date === todayStr);
  if (!todayLog) {
    todayLog = { date: todayStr, meals: [], totalCalories: 0 };
  }
  return todayLog;
};

// Helper to update or add a log
// This logic is now likely in App.tsx or a similar higher-level component
export const upsertDailyLog = (logs: DailyLogEntry[], logToSave: DailyLogEntry): DailyLogEntry[] => {
  const index = logs.findIndex(log => log.date === logToSave.date);
  if (index > -1) {
    logs[index] = logToSave;
  } else {
    logs.push(logToSave);
  }
  // Sort logs by date, most recent first (optional, but good for consistency)
  logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return logs;
};
*/

// 로컬 스토리지 관련 유틸리티가 더 이상 필요하지 않으면 이 파일을 삭제하거나,
// 특정 로컬 설정 (예: UI 테마, 언어 설정 등 앱 고유 데이터가 아닌 것) 저장용으로 남겨둘 수 있습니다.
// 현재 프로젝트에서는 주 데이터 저장소가 변경되었으므로, 이 파일의 내용은 주석 처리합니다.

export {}; // 모듈로 인식시키기 위한 빈 export