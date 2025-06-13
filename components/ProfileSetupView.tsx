
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { UserIcon } from './IconComponents';

interface ProfileSetupViewProps {
  onProfileSave: (profile: UserProfile) => void;
  existingProfile?: UserProfile | null;
}

const ProfileSetupView: React.FC<ProfileSetupViewProps> = ({ onProfileSave, existingProfile }) => {
  const [weight, setWeight] = useState<string>(existingProfile?.weightKg.toString() || '');
  const [height, setHeight] = useState<string>(existingProfile?.heightCm.toString() || '');
  const [name, setName] = useState<string>(existingProfile?.name || '');
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);

    if (isNaN(weightNum) || weightNum <= 0) {
      setError('올바른 몸무게를 입력해주세요 (kg).');
      return;
    }
    if (isNaN(heightNum) || heightNum <= 0) {
      setError('올바른 키를 입력해주세요 (cm).');
      return;
    }
    if (heightNum < 50 || heightNum > 300) {
        setError('키는 50cm에서 300cm 사이로 입력해주세요.');
        return;
    }
    if (weightNum < 10 || weightNum > 500) {
        setError('몸무게는 10kg에서 500kg 사이로 입력해주세요.');
        return;
    }


    onProfileSave({ name: name.trim() || undefined, weightKg: weightNum, heightCm: heightNum });
  };

  const commonInputClasses = "mt-1 block w-full px-4 py-3 border border-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-DEFAULT focus:border-primary-DEFAULT sm:text-sm bg-black text-white placeholder-slate-400";
  const commonButtonClasses = "w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-transform duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2";


  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <UserIcon className="w-16 h-16 text-primary-DEFAULT mx-auto mb-2" />
        <h2 className="text-3xl font-bold text-slate-800">{existingProfile ? "프로필 수정" : "프로필 설정"}</h2>
        <p className="text-slate-600 mt-1">
          {existingProfile ? "키와 몸무게를 업데이트하세요." : "정확한 분석을 위해 키와 몸무게를 알려주세요."}
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700">
            이름 (선택)
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={commonInputClasses}
            placeholder="예: 홍길동"
          />
        </div>
        <div>
          <label htmlFor="weight" className="block text-sm font-medium text-slate-700">
            몸무게 (kg) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className={commonInputClasses}
            placeholder="예: 65"
            required
            step="0.1"
          />
        </div>
        <div>
          <label htmlFor="height" className="block text-sm font-medium text-slate-700">
            키 (cm) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="height"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className={commonInputClasses}
            placeholder="예: 170"
            required
            step="0.1"
          />
        </div>
        {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</p>}
        <button
          type="submit"
          className={`${commonButtonClasses} bg-slate-100 text-slate-800 hover:bg-primary-dark hover:text-white focus:ring-primary-DEFAULT`}
        >
          <span>{existingProfile ? "프로필 저장" : "저장하고 시작하기"}</span>
        </button>
      </form>
    </div>
  );
};

export default ProfileSetupView;