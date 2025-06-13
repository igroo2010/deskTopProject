
import React from 'react';
import { DailyLogEntry, AppMode } from '../types';
import { ChevronLeftIcon, ChartBarIcon } from './IconComponents';

interface WeeklyProgressViewProps {
  dailyLogs: DailyLogEntry[];
  onNavigate: (mode: AppMode) => void;
}

const WeeklyProgressView: React.FC<WeeklyProgressViewProps> = ({ dailyLogs, onNavigate }) => {
  // Get logs for the last 7 days including today
  const today = new Date();
  const last7DaysLogs: DailyLogEntry[] = [];
  const datesToShow = 7;

  for (let i = 0; i < datesToShow; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const log = dailyLogs.find(l => l.date === dateStr);
    last7DaysLogs.push(log || { date: dateStr, meals: [], totalCalories: 0 });
  }
  last7DaysLogs.reverse(); // Show oldest first for the chart

  const maxCalories = Math.max(...last7DaysLogs.map(log => log.totalCalories), 1500); // Ensure a minimum height for the chart

  const commonButtonClasses = "flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition-transform duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2";

  return (
    <div className="w-full max-w-3xl mx-auto">
      <header className="flex items-center mb-6">
        <button
            onClick={() => onNavigate(AppMode.DASHBOARD)}
            className={`${commonButtonClasses} bg-slate-100 text-slate-800 hover:bg-slate-200 focus:ring-slate-300 mr-4`}
            aria-label="대시보드로 돌아가기"
        >
            <ChevronLeftIcon className="w-5 h-5" />
        </button>
        <div className="flex items-center">
            <ChartBarIcon className="w-8 h-8 text-primary-DEFAULT mr-2" />
            <h2 className="text-3xl font-bold text-slate-800">주간 칼로리 기록</h2>
        </div>
      </header>
      
      <div className="bg-white p-6 rounded-xl shadow-xl">
        {last7DaysLogs.length === 0 ? (
          <p className="text-slate-500 text-center py-8">표시할 주간 데이터가 없습니다.</p>
        ) : (
          <div>
            <p className="text-sm text-slate-600 mb-4 text-center">지난 ${datesToShow}일간의 일일 총 섭취 칼로리입니다.</p>
            <div className="flex justify-between items-end space-x-2 h-64 border-b-2 border-slate-200 pb-2">
              {last7DaysLogs.map(log => {
                const barHeight = maxCalories > 0 ? (log.totalCalories / maxCalories) * 100 : 0;
                const dayDate = new Date(log.date);
                const dayLabel = `${dayDate.getMonth() + 1}/${dayDate.getDate()}`;
                
                return (
                  <div key={log.date} className="flex-1 flex flex-col items-center justify-end h-full relative group">
                    <div 
                      className="w-3/4 sm:w-1/2 bg-primary-DEFAULT hover:bg-primary-dark transition-all duration-200 rounded-t-md"
                      style={{ height: `${Math.max(barHeight, 2)}%` }} // min height for visibility
                      title={`${dayLabel}: ${log.totalCalories.toLocaleString()} kcal`}
                    >
                       <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs text-primary-dark font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {log.totalCalories.toLocaleString()} kcal
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-2 whitespace-nowrap">{dayLabel}</p>
                  </div>
                );
              })}
            </div>
            <ul className="mt-6 space-y-2">
              {last7DaysLogs.slice().reverse().map(log => ( // Show most recent first in list
                 <li key={`list-${log.date}`} className="flex justify-between items-center p-3 bg-slate-50 rounded-md hover:bg-slate-100">
                   <span className="text-sm text-slate-700">
                     {new Date(log.date).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' })}
                   </span>
                   <span className="font-semibold text-primary-dark">
                     {log.totalCalories.toLocaleString()} kcal
                   </span>
                 </li>
              ))}
            </ul>
          </div>
        )}
      </div>
       <p className="text-xs text-slate-400 text-center mt-6">이 기록은 사용자가 직접 입력한 식사 정보를 바탕으로 합니다.</p>
    </div>
  );
};

export default WeeklyProgressView;