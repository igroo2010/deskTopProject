
import { UserProfile, ExerciseSuggestion } from '../types';

export const calculateBMI = (weightKg: number, heightCm: number): number => {
  if (heightCm <= 0) return 0;
  const heightM = heightCm / 100;
  return parseFloat((weightKg / (heightM * heightM)).toFixed(1));
};

export const getBMICategory = (bmi: number): string => {
  // 기준은 대한비만학회 권고안을 단순화하여 적용 (더 정확한 분류는 전문가와 상의)
  if (bmi < 18.5) return '저체중';
  if (bmi < 23) return '정상'; // 한국 기준 정상 범위 상한
  if (bmi < 25) return '과체중';
  if (bmi < 30) return '경도 비만 (1단계 비만)';
  if (bmi < 35) return '중등도 비만 (2단계 비만)';
  return '고도 비만 (3단계 비만)';
};

export const calculateTargetWeight = (heightCm: number, targetBmi: number = 22): number => {
  if (heightCm <= 0) return 0;
  const heightM = heightCm / 100;
  return parseFloat((targetBmi * (heightM * heightM)).toFixed(1));
};

// 매우 단순화된 일일 권장 칼로리. 실제로는 활동량, 나이, 성별에 따라 크게 다름.
// 여기서는 기초적인 가이드라인만 제공.
export const getSimplifiedDailyCalorieGuideline = (profile: UserProfile): { base: number, forWeightLoss?: number, forWeightGain?: number } => {
    // Mifflin-St Jeor Equation (Simplified: assumes age 30, uses weight/height from profile)
    // For men: (10 * weight in kg) + (6.25 * height in cm) - (5 * age) + 5
    // For women: (10 * weight in kg) + (6.25 * height in cm) - (5 * age) - 161
    // As we don't have age/gender, we'll use a very rough estimate.
    // Let's use a very generic formula for BMR (e.g. weight * 20-25 for maintenance)
    // This is NOT a medical recommendation.
    const estimatedBMR = profile.weightKg * 22; // Very rough BMR
    const estimatedTDEE = estimatedBMR * 1.375; // Assuming light activity

    return {
        base: Math.round(estimatedTDEE),
        forWeightLoss: Math.round(estimatedTDEE - 300), // Suggest 300-500 kcal deficit
        forWeightGain: Math.round(estimatedTDEE + 300), // Suggest 300-500 kcal surplus
    };
};


export const getWeightManagementAdvice = (profile: UserProfile, dailyIntake: number): string[] => {
  const advice: string[] = [];
  const currentBmi = calculateBMI(profile.weightKg, profile.heightCm);
  const targetWeightForBmi22 = calculateTargetWeight(profile.heightCm, 22);
  const guideline = getSimplifiedDailyCalorieGuideline(profile);

  advice.push(`현재 BMI: ${currentBmi} (${getBMICategory(currentBmi)})`);
  advice.push(`키 ${profile.heightCm}cm의 건강 체중(BMI 22 기준): 약 ${targetWeightForBmi22}kg 입니다.`);

  const weightDifference = profile.weightKg - targetWeightForBmi22;

  if (currentBmi >= 23) { // 과체중 또는 비만
    advice.push(`목표 체중까지 약 ${weightDifference.toFixed(1)}kg 감량이 제안됩니다.`);
    advice.push(`체중 감량을 위해 하루 약 ${guideline.forWeightLoss}kcal 섭취를 목표로 하거나, 현재 섭취량에서 300-500kcal 줄이는 것을 고려해보세요.`);
     if (dailyIntake > (guideline.forWeightLoss ?? guideline.base)) {
        advice.push(`오늘 섭취량(${dailyIntake}kcal)은 권장 감량 목표치보다 높습니다. 활동량을 늘리거나 다음 식사에서 조절하는 것이 좋습니다.`);
    }
  } else if (currentBmi < 18.5) { // 저체중
    advice.push(`목표 체중까지 약 ${(targetWeightForBmi22 - profile.weightKg).toFixed(1)}kg 증량이 제안됩니다.`);
    advice.push(`체중 증량을 위해 하루 약 ${guideline.forWeightGain}kcal 섭취를 목표로 하거나, 현재 섭취량에서 300-500kcal 늘리는 것을 고려해보세요.`);
    if (dailyIntake < (guideline.forWeightGain ?? guideline.base)) {
        advice.push(`오늘 섭취량(${dailyIntake}kcal)은 권장 증량 목표치보다 낮습니다. 충분한 영양 섭취에 신경 써주세요.`);
    }
  } else { // 정상 체중
    advice.push("현재 건강한 체중 범위에 있습니다! 꾸준히 유지하세요.");
    if (dailyIntake > guideline.base + 200) {
         advice.push(`오늘 섭취량(${dailyIntake}kcal)이 평소 유지 칼로리보다 다소 높을 수 있습니다. 내일은 조금 더 신경 써보는건 어때요?`);
    } else if (dailyIntake < guideline.base - 200) {
        advice.push(`오늘 섭취량(${dailyIntake}kcal)이 평소 유지 칼로리보다 다소 낮을 수 있습니다. 충분히 드시고 계신가요?`);
    }
  }
  return advice;
};


export const availableExercises: ExerciseSuggestion[] = [
  { name: "빠르게 걷기", description: "30분", caloriesBurnedApprox: 150 },
  { name: "조깅", description: "30분", caloriesBurnedApprox: 250 },
  { name: "자전거 타기 (보통)", description: "30분", caloriesBurnedApprox: 220 },
  { name: "수영 (가볍게)", description: "30분", caloriesBurnedApprox: 280 },
  { name: "계단 오르기", description: "15분", caloriesBurnedApprox: 130 },
  { name: "줄넘기", description: "10분", caloriesBurnedApprox: 100 },
];

export const suggestExercises = (caloriesToBurn: number): ExerciseSuggestion[] => {
  if (caloriesToBurn <= 0) return [];

  const suggestions: ExerciseSuggestion[] = [];
  let remainingCalories = caloriesToBurn;

  // Sort exercises by most calories burned per suggestion unit (approx)
  const sortedExercises = [...availableExercises].sort((a, b) => b.caloriesBurnedApprox - a.caloriesBurnedApprox);

  for (const exercise of sortedExercises) {
    if (remainingCalories >= exercise.caloriesBurnedApprox * 0.5) { // Suggest if it covers at least half its value
      const times = Math.max(1, Math.floor(remainingCalories / exercise.caloriesBurnedApprox));
       // For simplicity, just suggest one unit of effective exercises
      if (suggestions.length < 2) { // Suggest up to 2 exercises
        suggestions.push(exercise);
        remainingCalories -= exercise.caloriesBurnedApprox;
        if(remainingCalories <=0) break;
      } else {
        break;
      }
    }
  }
   if (suggestions.length === 0 && remainingCalories > 0) {
    // If no single exercise is large enough, suggest the smallest one if it helps
    const smallestEffective = sortedExercises.filter(ex => ex.caloriesBurnedApprox > 0).pop();
    if (smallestEffective && remainingCalories < smallestEffective.caloriesBurnedApprox * 1.5) {
        suggestions.push(smallestEffective);
    }
  }

  return suggestions;
};

export const getExerciseAdvice = (profile: UserProfile, dailyIntake: number): string[] => {
    const advice: string[] = [];
    const guideline = getSimplifiedDailyCalorieGuideline(profile);
    const currentBmiCategory = getBMICategory(calculateBMI(profile.weightKg, profile.heightCm));

    let calorieTarget = guideline.base;
    if (currentBmiCategory === '과체중' || currentBmiCategory.includes('비만')) {
        calorieTarget = guideline.forWeightLoss ?? guideline.base;
    } else if (currentBmiCategory === '저체중') {
        calorieTarget = guideline.forWeightGain ?? guideline.base;
    }

    const surplusCalories = dailyIntake - calorieTarget;

    if (surplusCalories > 50) { // 50칼로리 이상 초과 시 운동 제안
        advice.push(`오늘 목표보다 약 ${Math.round(surplusCalories)}kcal 더 섭취하셨습니다.`);
        const suggestedExercises = suggestExercises(surplusCalories);
        if (suggestedExercises.length > 0) {
            advice.push("다음 운동으로 소모해 보세요:");
            suggestedExercises.forEach(ex => {
                advice.push(`- ${ex.name} (${ex.description}): 약 ${ex.caloriesBurnedApprox}kcal 소모`);
            });
        } else {
            advice.push("가벼운 산책이나 스트레칭으로 활동량을 늘려보세요.");
        }
    } else if (currentBmiCategory === '과체중' || currentBmiCategory.includes('비만')) {
        advice.push("체중 감량 목표를 위해 꾸준한 운동이 도움됩니다. 하루 30분 이상 중등도 강도의 활동을 권장합니다.");
        const suggestedExercises = suggestExercises(200); // Suggest exercises for 200 kcal as a general recommendation
         if (suggestedExercises.length > 0) {
            advice.push("예시 운동:");
            suggestedExercises.forEach(ex => {
                advice.push(`- ${ex.name} (${ex.description}): 약 ${ex.caloriesBurnedApprox}kcal 소모`);
            });
        }
    } else {
        advice.push("규칙적인 신체 활동은 건강 유지에 중요합니다. 즐기는 운동을 꾸준히 해보세요!");
    }
    return advice;
};