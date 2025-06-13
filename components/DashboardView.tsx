
import React from 'react';
import { UserProfile, DailyLogEntry, Meal, AppMode, ExerciseSuggestion } from '../types';
import { calculateBMI, getBMICategory, getWeightManagementAdvice, getExerciseAdvice, suggestExercises, calculateTargetWeight } from '../services/healthMetricsService';
import { PlusCircleIcon, ChartBarIcon, CogIcon, UserIcon, TrashIcon } from './IconComponents';
import Spinner from './Spinner';

interface DashboardViewProps {
  userProfile: UserProfile;
  todayLog: DailyLogEntry | null;
  onNavigate: (mode: AppMode) => void;
  onAddMeal: () => void;
  onDeleteMeal: (mealId: string) => void;
}

const MealItem: React.FC<{ meal: Meal; onDelete: (mealId: string) => void }> = ({ meal, onDelete }) => {
  const mealTime = new Date(meal.timestamp).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
  return (
    <li className="p-4 bg-slate-100 rounded-lg shadow-sm hover:bg-slate-200 transition-colors">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-semibold text-primary-dark text-lg">
            {meal.items && meal.items.length > 0 ? meal.items.map(item => item.name).join(', ') : '기록된 음식'}
            <span className="text-xs text-slate-500 ml-2">({mealTime})</span>
          </p>
          {meal.items && meal.items.length > 0 && meal.items.map((item, idx) => (
             <p key={idx} className="text-xs text-slate-600 ml-2">
                - {item.name}: {item.calories}kcal {item.servingSize ? `(${item.servingSize})` : ''}
             </p>
          ))}
          {meal.notes && <p className="text-xs text-amber-700 mt-1">AI 노트: {meal.notes}</p>}
          {meal.error && <p className="text-xs text-red-600 mt-1">오류: {meal.error}</p>}
        </div>
        <div className="text-right flex-shrink-0 ml-2">
          <p className="font-bold text-xl text-primary-DEFAULT">{meal.totalCalories.toLocaleString()} kcal</p>
          <button 
            onClick={() => onDelete(meal.id)} 
            className="text-red-500 hover:text-red-700 mt-1 p-1"
            aria-label="식사 기록 삭제"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </li>
  );
};


const DashboardView: React.FC<DashboardViewProps> = ({ userProfile, todayLog, onNavigate, onAddMeal, onDeleteMeal }) => {
  if (!userProfile) return <Spinner text="사용자 프로필 로딩 중..." />;

  const bmi = calculateBMI(userProfile.weightKg, userProfile.heightCm);
  const bmiCategory = getBMICategory(bmi);
  const targetWeight = calculateTargetWeight(userProfile.heightCm);
  
  const dailyTotalCalories = todayLog?.totalCalories || 0;
  const weightAdvice = getWeightManagementAdvice(userProfile, dailyTotalCalories);
  const exerciseAdvice = getExerciseAdvice(userProfile, dailyTotalCalories);

  const commonButtonClasses = "flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium shadow hover:shadow-md transition-all duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 text-sm";
  const sectionCardClasses = "bg-white p-5 rounded-xl shadow-lg";

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 pb-20">
      <header className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">
            오늘의 기록, <span className="text-primary-DEFAULT">{userProfile.name || '사용자'}님!</span>
          </h2>
          <p className="text-slate-500">{new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}</p>
        </div>
        <div className="flex space-x-2">
           <button
            onClick={() => onNavigate(AppMode.EDIT_PROFILE)}
            className={`${commonButtonClasses} bg-slate-200 text-slate-800 hover:bg-slate-300 focus:ring-slate-400`}
            title="프로필 수정"
          >
            <CogIcon className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Daily Summary */}
      <div className={`${sectionCardClasses} grid grid-cols-1 md:grid-cols-3 gap-4 text-center`}>
        <div>
          <p className="text-sm text-slate-500">현재 체중</p>
          <p className="text-2xl font-bold text-primary-dark">{userProfile.weightKg} kg</p>
        </div>
        <div>
          <p className="text-sm text-slate-500">BMI</p>
          <p className="text-2xl font-bold text-primary-dark">{bmi} <span className="text-base font-normal text-slate-600">({bmiCategory})</span></p>
        </div>
        <div>
          <p className="text-sm text-slate-500">오늘 섭취 칼로리</p>
          <p className="text-2xl font-bold text-primary-DEFAULT">{dailyTotalCalories.toLocaleString()} kcal</p>
        </div>
      </div>
      
      {/* Action Buttons */}
       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
         <button
            onClick={onAddMeal}
            className={`${commonButtonClasses} bg-slate-100 text-slate-800 hover:bg-primary-dark hover:text-white focus:ring-primary-DEFAULT py-3 text-base`}
          >
            <PlusCircleIcon className="w-5 h-5" />
            <span>식사 기록 추가</span>
          </button>
          <button
            onClick={() => onNavigate(AppMode.WEEKLY_PROGRESS)}
            className={`${commonButtonClasses} bg-slate-100 text-slate-800 hover:bg-secondary-dark hover:text-white focus:ring-secondary-DEFAULT py-3 text-base`}
          >
            <ChartBarIcon className="w-5 h-5" />
            <span>주간 진행상황 보기</span>
          </button>
      </div>


      {/* Meals Logged Today */}
      <div className={sectionCardClasses}>
        <h3 className="text-xl font-semibold text-slate-700 mb-3">오늘의 식사 목록</h3>
        {todayLog && todayLog.meals.length > 0 ? (
          <ul className="space-y-3">
            {todayLog.meals.map((meal) => (
              <MealItem key={meal.id} meal={meal} onDelete={onDeleteMeal} />
            ))}
          </ul>
        ) : (
          <p className="text-slate-500 text-center py-4">아직 기록된 식사가 없습니다. '+' 버튼으로 추가해보세요!</p>
        )}
      </div>

      {/* Weight Management Advice */}
      <div className={sectionCardClasses}>
        <h3 className="text-xl font-semibold text-slate-700 mb-3">체중 관리 조언 💪</h3>
        <ul className="space-y-1 text-sm text-slate-600 list-disc list-inside">
          {weightAdvice.map((advice, index) => (
            <li key={index}>{advice}</li>
          ))}
        </ul>
      </div>

      {/* Exercise Recommendations */}
      <div className={sectionCardClasses}>
        <h3 className="text-xl font-semibold text-slate-700 mb-3">오늘의 운동 추천 🏃‍♀️</h3>
         <ul className="space-y-1 text-sm text-slate-600 list-disc list-inside">
          {exerciseAdvice.map((advice, index) => (
            <li key={index}>{advice}</li>
          ))}
        </ul>
      </div>
       <p className="text-xs text-slate-400 text-center mt-4">모든 조언과 추천은 일반적인 정보를 바탕으로 하며, 개인의 건강 상태에 따라 전문가와 상담하는 것이 가장 좋습니다.</p>
    </div>
  );
};

export default DashboardView;