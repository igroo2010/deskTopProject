
import React from 'react';
import { CalorieEstimation, FoodItemDetail } from '../types';
import { SparklesIcon } from './IconComponents';

interface CalorieResultCardProps {
  estimation: CalorieEstimation | null;
}

const CalorieResultCard: React.FC<CalorieResultCardProps> = ({ estimation }) => {
  if (!estimation) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg text-center">
        <p className="text-slate-600">분석 데이터가 없습니다.</p>
      </div>
    );
  }

  if (estimation.error && (!estimation.items || estimation.items.length === 0)) {
     return (
      <div className="bg-red-50 p-6 rounded-xl shadow-lg text-center">
        <h3 className="text-xl font-semibold text-red-700 mb-2">분석 오류</h3>
        <p className="text-red-600">{estimation.notes || estimation.error}</p>
      </div>
    );
  }


  return (
    <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg transform transition-all duration-300 hover:shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-primary-dark">칼로리 분석 결과</h2>
        <SparklesIcon className="w-8 h-8 text-primary-DEFAULT" />
      </div>

      {estimation.error && (estimation.items && estimation.items.length > 0) && (
         <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md">
           <p className="font-medium">부분적 분석 오류:</p>
           <p className="text-sm">{estimation.notes || estimation.error}</p>
         </div>
      )}


      {estimation.totalCalories > 0 && (
        <div className="mb-6 p-4 bg-primary-light/30 rounded-lg text-center">
          <p className="text-lg text-primary-dark">총 예상 칼로리</p>
          <p className="text-5xl font-extrabold text-primary-DEFAULT">
            {estimation.totalCalories.toLocaleString()}
          </p>
          <p className="text-sm text-primary-dark/80">kcal</p>
        </div>
      )}

      {estimation.items && estimation.items.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-slate-700 mb-3">감지된 항목:</h3>
          <ul className="space-y-3">
            {estimation.items.map((item, index) => (
              <li key={index} className="p-4 bg-slate-100 rounded-lg shadow-sm flex justify-between items-center hover:bg-slate-200 transition-colors">
                <div>
                  <p className="font-medium text-slate-800 text-lg">{item.name}</p>
                  {item.servingSize && <p className="text-xs text-slate-500">제공량: {item.servingSize}</p>}
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary-DEFAULT text-lg">{item.calories.toLocaleString()} kcal</p>
                  {item.confidence && <p className="text-xs text-slate-500">신뢰도: {item.confidence}</p>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {estimation.notes && (!estimation.error || (estimation.items && estimation.items.length > 0)) && ( // Show notes if not a primary error message or if items exist
        <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-300">
          <h4 className="font-semibold text-amber-700 mb-1">AI 분석 노트:</h4>
          <p className="text-sm text-amber-600 whitespace-pre-wrap">{estimation.notes}</p>
        </div>
      )}
       {(estimation.totalCalories === 0 && (!estimation.items || estimation.items.length === 0) && !estimation.error && !estimation.notes) && (
         <div className="text-center text-slate-500 py-4">
            <p>음식 항목을 감지하거나 칼로리를 추정할 수 없었습니다.</p>
            <p>더 선명한 이미지나 다른 각도로 시도해 보세요.</p>
         </div>
       )}
    </div>
  );
};

export default CalorieResultCard;