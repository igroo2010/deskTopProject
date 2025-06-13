import { UserProfile, DailyLogEntry } from '../types';

// =====================================================================================
// !! 중요 !! : 아래에 Google Apps Script 웹 앱 URL을 입력하세요. !! 중요 !!
// =====================================================================================
// 1. Google Apps Script를 만들고 웹 앱으로 배포합니다.
// 2. 배포 후 얻은 URL (예: https://script.google.com/macros/s/ยาวเหยียด/exec)을 아래 "" 안에 붙여넣습니다.
// 3. process.env.APPS_SCRIPT_WEB_APP_URL 줄은 주석 처리하거나 삭제해도 됩니다.

// const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_WEB_APP_URL;
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxid2X4Qbcu0Cvq-dYo31iGERmgI34vQoQyxflIEuJDiSqhg1a5fMAK64gyv8lpIstN/exec"; // <--- 이 따옴표 안에 URL을 넣어주세요!

// 예시: const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby.../exec";
// =====================================================================================


interface AppsScriptResponse {
  success: boolean;
  data?: any;
  error?: string;
}

const fetchDataFromAppsScript = async (action: string, payload?: any, method: 'GET' | 'POST' = 'GET'): Promise<AppsScriptResponse> => {
  if (!APPS_SCRIPT_URL) {
    console.error("Google Apps Script 웹 앱 URL이 설정되지 않았습니다. services/googleSheetsService.ts 파일을 확인하세요.");
    return { success: false, error: "Google Apps Script URL이 설정되지 않았습니다. 앱 설정을 확인해주세요." };
  }

  let url = `${APPS_SCRIPT_URL}?action=${action}`;
  const options: RequestInit = {
    method: method,
    redirect: 'follow', // Important for Apps Script web apps
  };

  if (method === 'POST') {
    options.body = JSON.stringify(payload);
    options.headers = {
      'Content-Type': 'application/json',
    };
  } else if (payload) { // For GET requests with simple payloads
    Object.keys(payload).forEach(key => {
        url += `&${encodeURIComponent(key)}=${encodeURIComponent(payload[key])}`;
    });
  }
  
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Apps Script Error (${response.status}): ${errorText}`);
      return { success: false, error: `Google Sheets 서버 오류 (${response.status}): ${errorText}` };
    }
    const result: AppsScriptResponse = await response.json();
    return result;
  } catch (error) {
    console.error("Google Sheets 서비스 통신 오류:", error);
    return { success: false, error: `Google Sheets 서비스 통신 중 오류 발생: ${(error as Error).message}` };
  }
};

export const loadUserProfileFromSheets = async (): Promise<UserProfile | null> => {
  const response = await fetchDataFromAppsScript('getUserProfile');
  if (response.success && response.data) {
    return response.data as UserProfile;
  }
  if (response.error && !response.data) { // If there's an error message and no data, it means profile likely doesn't exist or error fetching
    console.warn("프로필을 불러오지 못했습니다 (Google Sheets):", response.error);
  }
  return null;
};

export const saveUserProfileToSheets = async (profile: UserProfile): Promise<boolean> => {
  const response = await fetchDataFromAppsScript('saveUserProfile', { profile }, 'POST');
  if (!response.success) {
    console.error("프로필 저장 실패 (Google Sheets):", response.error);
  }
  return response.success;
};

export const clearUserProfileInSheets = async (): Promise<boolean> => {
  const response = await fetchDataFromAppsScript('clearUserProfile', {}, 'POST');
   if (!response.success) {
    console.error("프로필 삭제 실패 (Google Sheets):", response.error);
  }
  return response.success;
};

export const loadDailyLogsFromSheets = async (): Promise<DailyLogEntry[]> => {
  const response = await fetchDataFromAppsScript('getDailyLogs');
  if (response.success && Array.isArray(response.data)) {
    return response.data as DailyLogEntry[];
  }
  if (response.error) {
     console.error("일일 기록 불러오기 실패 (Google Sheets):", response.error);
  }
  return [];
};

export const saveDailyLogsToSheets = async (logs: DailyLogEntry[]): Promise<boolean> => {
  // Keep only the last 30 days of logs before sending to Sheets
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentLogs = logs.filter(log => new Date(log.date) >= thirtyDaysAgo);

  const response = await fetchDataFromAppsScript('saveDailyLogs', { logs: recentLogs }, 'POST');
  if (!response.success) {
    console.error("일일 기록 저장 실패 (Google Sheets):", response.error);
  }
  return response.success;
};