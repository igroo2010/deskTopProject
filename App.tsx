
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { AppMode, UserProfile, DailyLogEntry, Meal, ImageAnalysisFlowState, CalorieEstimation as GeminiCalorieEstimation } from './types';
import { estimateCaloriesFromImage } from './services/geminiService';
// Import Google Sheets service instead of localStorageService for main data
import { 
  loadUserProfileFromSheets, 
  saveUserProfileToSheets, 
  loadDailyLogsFromSheets, 
  saveDailyLogsToSheets,
  clearUserProfileInSheets
} from './services/googleSheetsService';

import ProfileSetupView from './components/ProfileSetupView';
import DashboardView from './components/DashboardView';
import WeeklyProgressView from './components/WeeklyProgressView';
import CalorieResultCard from './components/CalorieResultCard';
import Spinner from './components/Spinner';
import { CameraIcon, UploadIcon, SparklesIcon, ArrowPathIcon, XCircleIcon, ChevronLeftIcon, LogoutIcon, PlusCircleIcon } from './components/IconComponents';

// Helper function (can be moved or kept here)
const getTodaysLogEntry = (logs: DailyLogEntry[]): DailyLogEntry => {
  const todayStr = new Date().toISOString().split('T')[0];
  let todayLog = logs.find(log => log.date === todayStr);
  if (!todayLog) {
    todayLog = { date: todayStr, meals: [], totalCalories: 0 };
  }
  return todayLog;
};

const upsertDailyLogEntry = (logs: DailyLogEntry[], logToSave: DailyLogEntry): DailyLogEntry[] => {
  const index = logs.findIndex(log => log.date === logToSave.date);
  let newLogs = [...logs];
  if (index > -1) {
    newLogs[index] = logToSave;
  } else {
    newLogs.push(logToSave);
  }
  newLogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return newLogs;
};


// Main App Component
const App: React.FC = () => {
  const [appMode, setAppMode] = useState<AppMode>(AppMode.LOADING);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [dailyLogs, setDailyLogs] = useState<DailyLogEntry[]>([]);
  const [globalError, setGlobalError] = useState<string | null>(null); // For Sheets API errors
  
  // States for Image Analysis Flow (used within AppMode.ADD_MEAL)
  const [imageAnalysisState, setImageAnalysisState] = useState<ImageAnalysisFlowState>(ImageAnalysisFlowState.INITIAL);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string | null>(null);
  const [calorieData, setCalorieData] = useState<GeminiCalorieEstimation | null>(null); // From Gemini
  const [error, setError] = useState<string | null>(null); // Error for image analysis flow

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Initialization ---
  useEffect(() => {
    const initializeApp = async () => {
      setAppMode(AppMode.LOADING);
      setGlobalError(null);
      try {
        const profile = await loadUserProfileFromSheets();
        const logs = await loadDailyLogsFromSheets();
        
        setUserProfile(profile);
        setDailyLogs(logs);

        if (profile) {
          setAppMode(AppMode.DASHBOARD);
        } else {
          setAppMode(AppMode.PROFILE_SETUP);
        }
      } catch (err) {
        console.error("앱 초기화 오류 (Google Sheets):", err);
        setGlobalError("앱 데이터를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요. (Google Sheets 연동 확인 필요)");
        // Fallback or error display logic can be enhanced here
        setAppMode(AppMode.PROFILE_SETUP); // Or a dedicated error screen
      }
    };
    initializeApp();
  }, []);

  // --- Profile Management ---
  const handleProfileSave = async (profile: UserProfile) => {
    setAppMode(AppMode.LOADING); // Show loading while saving
    setGlobalError(null);
    const success = await saveUserProfileToSheets(profile);
    if (success) {
      setUserProfile(profile);
      setAppMode(AppMode.DASHBOARD);
    } else {
      setGlobalError("프로필 저장에 실패했습니다. 네트워크 연결을 확인하고 다시 시도해주세요.");
      // Stay in current view (ProfileSetup or EditProfile) or revert based on UX decision
      setAppMode(userProfile ? AppMode.EDIT_PROFILE : AppMode.PROFILE_SETUP);
    }
  };
  
  const handleLogout = async () => {
    setAppMode(AppMode.LOADING);
    setGlobalError(null);
    const success = await clearUserProfileInSheets(); // Assuming this also clears logs or handled by Apps Script logic
    if (success) {
        setUserProfile(null);
        setDailyLogs([]); // Clear local logs as well
        setAppMode(AppMode.PROFILE_SETUP);
    } else {
        setGlobalError("로그아웃 중 오류가 발생했습니다. 다시 시도해주세요.");
        setAppMode(AppMode.DASHBOARD); // Revert to dashboard if logout failed
    }
  };

  // --- Meal Management ---
  const addMealToLog = async (mealEstimation: GeminiCalorieEstimation) => {
    if (!userProfile) return;

    const newMeal: Meal = {
      ...mealEstimation,
      id: new Date().toISOString() + Math.random().toString(16),
      timestamp: new Date().toISOString(),
      imageSrc: imageAnalysisState === ImageAnalysisFlowState.PREVIEW ? imageSrc || undefined : undefined,
    };

    let todayLog = getTodaysLogEntry(dailyLogs);
    todayLog.meals.push(newMeal);
    todayLog.totalCalories = todayLog.meals.reduce((sum, m) => sum + m.totalCalories, 0);

    const updatedLogs = upsertDailyLogEntry(dailyLogs, todayLog);
    
    setAppMode(AppMode.LOADING); // Show loading while saving logs
    setGlobalError(null);
    const success = await saveDailyLogsToSheets(updatedLogs);
    if (success) {
      setDailyLogs(updatedLogs);
    } else {
      setGlobalError("식사 기록 저장에 실패했습니다. 변경사항이 저장되지 않았을 수 있습니다.");
      // Optionally revert dailyLogs state or just show error
    }
    // Navigate to dashboard regardless of save success for now, error will be shown.
    resetImageAnalysisState(true); 
    setAppMode(AppMode.DASHBOARD); // Ensure dashboard is shown after attempting to add meal
  };
  
  const handleDeleteMeal = async (mealId: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    let logsAfterDeletion = [...dailyLogs];
    
    const logIndex = logsAfterDeletion.findIndex(log => log.date === todayStr);
    if (logIndex > -1) {
      const currentLog = { ...logsAfterDeletion[logIndex] };
      const filteredMeals = currentLog.meals.filter(meal => meal.id !== mealId);
      currentLog.meals = filteredMeals;
      currentLog.totalCalories = filteredMeals.reduce((sum, m) => sum + m.totalCalories, 0);
      logsAfterDeletion[logIndex] = currentLog;

      setAppMode(AppMode.LOADING);
      setGlobalError(null);
      const success = await saveDailyLogsToSheets(logsAfterDeletion);
      if (success) {
        setDailyLogs(logsAfterDeletion);
      } else {
        setGlobalError("식사 기록 삭제에 실패했습니다. 다시 시도해주세요.");
        // Revert to previous dailyLogs state if save fails, or just show error
      }
      setAppMode(AppMode.DASHBOARD);
    }
  };


  // --- Image Analysis Flow Logic (adapted from original App.tsx) ---
  const clearImageAnalysisError = () => setError(null);

  const resetImageAnalysisState = (navigateToDashboard: boolean = false) => {
    setImageSrc(null);
    setImageMimeType(null);
    setCalorieData(null);
    clearImageAnalysisError();
    setImageAnalysisState(ImageAnalysisFlowState.INITIAL);
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    if (navigateToDashboard) {
        setAppMode(AppMode.DASHBOARD);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    clearImageAnalysisError();
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('이미지 파일을 선택해주세요 (예: JPG, PNG).');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImageSrc(result);
        setImageMimeType(file.type);
        setImageAnalysisState(ImageAnalysisFlowState.PREVIEW);
      };
      reader.onerror = () => {
        setError('선택한 파일을 읽는데 실패했습니다.');
        setImageAnalysisState(ImageAnalysisFlowState.INITIAL);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = useCallback(async () => {
    clearImageAnalysisError();
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setImageAnalysisState(ImageAnalysisFlowState.CAMERA);
        }
      } catch (err) {
        console.error("카메라 접근 오류:", err);
        setError("카메라에 접근할 수 없습니다. 권한이 부여되었는지, 다른 앱에서 사용 중이지 않은지 확인해주세요.");
        setImageAnalysisState(ImageAnalysisFlowState.INITIAL);
      }
    } else {
      setError("이 기기/브라우저에서는 카메라를 지원하지 않습니다.");
      setImageAnalysisState(ImageAnalysisFlowState.INITIAL);
    }
  }, []);

  const captureImage = useCallback(() => {
    clearImageAnalysisError();
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setImageSrc(dataUrl);
        setImageMimeType('image/jpeg');
        setImageAnalysisState(ImageAnalysisFlowState.PREVIEW);
        const stream = video.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        video.srcObject = null;
      } else {
        setError("카메라에서 이미지를 캡처하는데 실패했습니다.");
        setImageAnalysisState(ImageAnalysisFlowState.CAMERA);
      }
    }
  }, []);

  const handleSubmitImageForAnalysis = useCallback(async () => {
    if (!imageSrc || !imageMimeType) {
      setError("분석할 이미지가 선택되지 않았습니다.");
      setImageAnalysisState(ImageAnalysisFlowState.PREVIEW);
      return;
    }
    clearImageAnalysisError();
    setImageAnalysisState(ImageAnalysisFlowState.ANALYZING);
    setCalorieData(null);

    try {
      const base64Data = imageSrc.substring(imageSrc.indexOf(',') + 1);
      const result = await estimateCaloriesFromImage(base64Data, imageMimeType);
      setCalorieData(result);
      if (result.error && (!result.items || result.items.length === 0)) {
         setError(result.notes || result.error || "분석 중 알 수 없는 오류가 발생했습니다.");
      }
      setImageAnalysisState(ImageAnalysisFlowState.RESULT);

    } catch (err) {
      console.error("칼로리 계산 오류:", err);
      const message = err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";
      setError(`칼로리 계산 실패: ${message}`);
      setImageAnalysisState(ImageAnalysisFlowState.ERROR); 
    }
  }, [imageSrc, imageMimeType]);

  const confirmAndAddMeal = async () => { // Make async for await addMealToLog
    if (calorieData) {
        await addMealToLog(calorieData); // This will handle navigation and loading state
    } else {
      resetImageAnalysisState(true); // Navigate to dashboard if no calorie data
    }
  };

  useEffect(() => { 
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // --- UI Rendering ---
  const commonButtonClasses = "w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-transform duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2";
  const globalErrorButtonClasses = "w-auto inline-flex items-center justify-center px-6 py-2.5 rounded-lg font-medium bg-slate-100 text-slate-800 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors duration-150 ease-in-out";
  
  const renderContent = () => {
    if (globalError && appMode !== AppMode.LOADING) { // Show global error prominently if not already loading
      return (
        <div className="w-full max-w-md mx-auto text-center bg-white p-8 rounded-xl shadow-xl">
          <XCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4"/>
          <h3 className="text-2xl font-semibold text-red-700 mb-2">오류 발생</h3>
          <p className="text-slate-600 mb-6">{globalError}</p>
          <button
            onClick={() => { // Attempt to re-initialize or go to a safe state
              setGlobalError(null);
              if (userProfile) setAppMode(AppMode.DASHBOARD);
              else setAppMode(AppMode.PROFILE_SETUP);
            }}
            className={globalErrorButtonClasses}
          >
            확인
          </button>
        </div>
      );
    }

    switch (appMode) {
      case AppMode.LOADING:
        return <div className="flex flex-col items-center justify-center h-screen"><Spinner size="lg" text="데이터 처리 중..." /></div>;
      
      case AppMode.PROFILE_SETUP:
        return <ProfileSetupView onProfileSave={handleProfileSave} />;
      
      case AppMode.EDIT_PROFILE:
        return <ProfileSetupView onProfileSave={handleProfileSave} existingProfile={userProfile} />;

      case AppMode.DASHBOARD:
        if (!userProfile) {
            setAppMode(AppMode.PROFILE_SETUP); 
            return <Spinner text="프로필 로딩 중..." />;
        }
        return (
            <DashboardView 
                userProfile={userProfile} 
                todayLog={getTodaysLogEntry(dailyLogs)}
                onNavigate={setAppMode}
                onAddMeal={() => {
                    resetImageAnalysisState(false); 
                    setAppMode(AppMode.ADD_MEAL);
                    setImageAnalysisState(ImageAnalysisFlowState.INITIAL);
                }}
                onDeleteMeal={handleDeleteMeal}
            />
        );

      case AppMode.WEEKLY_PROGRESS:
        return <WeeklyProgressView dailyLogs={dailyLogs} onNavigate={setAppMode} />;
      
      case AppMode.ADD_MEAL:
        return renderImageAnalysisFlow();

      default:
        return <p>알 수 없는 앱 상태입니다.</p>;
    }
  };

  const renderImageAnalysisFlow = () => {
    return (
      <div className="w-full max-w-2xl bg-white p-6 sm:p-8 rounded-xl shadow-2xl">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-slate-700">식사 기록 추가</h2>
            {imageAnalysisState !== ImageAnalysisFlowState.INITIAL && imageAnalysisState !== ImageAnalysisFlowState.ANALYZING && (
                 <button 
                    onClick={() => resetImageAnalysisState(true)} 
                    className="text-slate-500 hover:text-slate-700 p-1"
                    aria-label="식사 기록 취소하고 대시보드로 돌아가기"
                >
                    <XCircleIcon className="w-6 h-6" />
                </button>
            )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-md flex justify-between items-center">
            <p>{error}</p>
            <button onClick={clearImageAnalysisError} className="text-red-500 hover:text-red-700" aria-label="오류 메시지 닫기">
              <XCircleIcon className="w-5 h-5"/>
            </button>
          </div>
        )}

        {imageAnalysisState === ImageAnalysisFlowState.INITIAL && (
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
            <button onClick={startCamera} className={`${commonButtonClasses} bg-slate-100 text-slate-800 hover:bg-primary-dark hover:text-white focus:ring-primary-DEFAULT`}>
              <CameraIcon className="w-5 h-5" /> <span>사진 찍기</span>
            </button>
            <button onClick={() => fileInputRef.current?.click()} className={`${commonButtonClasses} bg-slate-100 text-slate-800 hover:bg-secondary-dark hover:text-white focus:ring-secondary-DEFAULT`}>
              <UploadIcon className="w-5 h-5" /> <span>이미지 업로드</span>
            </button>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" aria-hidden="true" />
          </div>
        )}

        {imageAnalysisState === ImageAnalysisFlowState.CAMERA && (
          <div className="flex flex-col items-center space-y-4">
            <div className="w-full max-w-md bg-slate-800 rounded-lg overflow-hidden shadow-lg aspect-video">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" aria-label="카메라 미리보기" />
            </div>
            <canvas ref={canvasRef} className="hidden" aria-hidden="true"></canvas>
            <div className="flex space-x-4">
              <button onClick={captureImage} className={`${commonButtonClasses} bg-slate-100 text-slate-800 hover:bg-primary-dark hover:text-white focus:ring-primary-DEFAULT`}>
                <CameraIcon className="w-5 h-5" /> <span>촬영</span>
              </button>
              <button onClick={() => resetImageAnalysisState(true)} className={`${commonButtonClasses} bg-slate-100 text-slate-800 hover:bg-slate-600 hover:text-white focus:ring-slate-500`}>
                <span>취소</span>
              </button>
            </div>
          </div>
        )}

        {imageAnalysisState === ImageAnalysisFlowState.PREVIEW && imageSrc && (
          <div className="flex flex-col items-center space-y-6">
            <h3 className="text-xl font-semibold text-slate-700">이미지 미리보기</h3>
            <img src={imageSrc} alt="캡처된 또는 업로드된 이미지 미리보기" className="max-w-full max-h-96 rounded-lg shadow-lg border-4 border-slate-200" />
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button onClick={handleSubmitImageForAnalysis} className={`${commonButtonClasses} bg-slate-100 text-slate-800 hover:bg-primary-dark hover:text-white focus:ring-primary-DEFAULT`}>
                <SparklesIcon className="w-5 h-5" /> <span>칼로리 분석</span>
              </button>
              <button onClick={() => setImageAnalysisState(ImageAnalysisFlowState.INITIAL)} className={`${commonButtonClasses} bg-slate-100 text-slate-800 hover:bg-slate-300 focus:ring-slate-400`}>
                <ArrowPathIcon className="w-5 h-5" /> <span>다른 이미지 선택</span>
              </button>
            </div>
          </div>
        )}

        {imageAnalysisState === ImageAnalysisFlowState.ANALYZING && (
          <div className="flex flex-col items-center justify-center space-y-4 py-12">
            <Spinner size="lg" />
            <p className="text-xl font-medium text-primary-dark animate-pulse">AI가 이미지를 분석중입니다...</p>
          </div>
        )}
        
        {imageAnalysisState === ImageAnalysisFlowState.RESULT && calorieData && (
          <div className="flex flex-col items-center space-y-6">
            <CalorieResultCard estimation={calorieData} />
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <button
                    onClick={confirmAndAddMeal}
                    className={`${commonButtonClasses} bg-slate-100 text-slate-800 hover:bg-primary-dark hover:text-white focus:ring-primary-DEFAULT`}
                >
                    <PlusCircleIcon className="w-5 h-5" />
                    <span>오늘 식단에 추가</span>
                </button>
                 <button
                    onClick={() => setImageAnalysisState(ImageAnalysisFlowState.PREVIEW)} 
                    className={`${commonButtonClasses} bg-slate-100 text-slate-800 hover:bg-slate-300 focus:ring-slate-400`}
                >
                    <ArrowPathIcon className="w-5 h-5" />
                    <span>재분석/다른 사진</span>
                </button>
            </div>
          </div>
        )}
        
        {imageAnalysisState === ImageAnalysisFlowState.ERROR && ( 
           <div className="flex flex-col items-center space-y-6 text-center">
             <XCircleIcon className="w-16 h-16 text-red-500"/>
             <h3 className="text-2xl font-semibold text-red-700">분석 실패</h3>
             <p className="text-slate-600 max-w-md">{error || "알 수 없는 오류가 발생했습니다. 다시 시도해주세요."}</p>
             <button
                onClick={() => resetImageAnalysisState(false)} 
                className={`${commonButtonClasses} bg-slate-100 text-slate-800 hover:bg-primary-dark hover:text-white focus:ring-primary-DEFAULT`}
              >
                <ArrowPathIcon className="w-5 h-5" />
                <span>다시 시도</span>
              </button>
           </div>
        )}
      </div>
    );
  };
  
  const showHeaderFooter = appMode !== AppMode.PROFILE_SETUP && appMode !== AppMode.EDIT_PROFILE && appMode !== AppMode.LOADING && !globalError;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-emerald-50 flex flex-col items-center justify-center p-4 selection:bg-primary-light selection:text-primary-dark">
      {showHeaderFooter && (
        <header className="w-full max-w-3xl mx-auto text-center mb-6 pt-4 flex justify-between items-center">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-DEFAULT to-emerald-600">
            칼로리캠 AI
          </h1>
          {userProfile && appMode === AppMode.DASHBOARD && (
             <button 
                onClick={handleLogout} 
                className={`${commonButtonClasses} bg-slate-100 text-slate-800 hover:bg-red-700 hover:text-white focus:ring-red-500 !px-3 !py-1.5 text-sm`}
                title="로그아웃"
            >
                <LogoutIcon className="w-4 h-4 mr-1" /> 로그아웃
            </button>
          )}
           {appMode !== AppMode.DASHBOARD && appMode !== AppMode.ADD_MEAL && (
             <button 
                onClick={() => setAppMode(AppMode.DASHBOARD)} 
                className={`${commonButtonClasses} bg-slate-100 text-slate-800 hover:bg-slate-200 focus:ring-slate-300 !px-3 !py-1.5 text-sm`}
                title="대시보드로 돌아가기"
            >
                <ChevronLeftIcon className="w-4 h-4 mr-1" /> 대시보드
            </button>
          )}
        </header>
      )}

      <main className="w-full">
        {renderContent()}
      </main>

      {showHeaderFooter && (
        <footer className="mt-12 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} 칼로리캠 AI. Gemini 제공.</p>
          <p className="mt-1">Google Sheets 연동: 이 앱은 Google Sheets에 데이터를 저장하고 불러옵니다. Google Apps Script 설정을 확인해주세요.</p>
          <p className="mt-1">칼로리 추정치는 대략적인 값이며 정보 제공 목적으로만 사용됩니다. 식이요법 관련 조언은 영양사와 상담하세요.</p>
        </footer>
      )}
    </div>
  );
};

export default App;