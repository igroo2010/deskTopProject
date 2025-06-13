
// Removed import: import { CalorieEstimation } from './services/geminiService';

export interface FoodItemDetail {
  name: string;
  calories: number;
  servingSize?: string;
  confidence?: string; // e.g., "High", "Medium", "Low"
}

// Define CalorieEstimation here, using the local FoodItemDetail
export interface CalorieEstimation {
  totalCalories: number;
  items: FoodItemDetail[];
  notes?: string;
  error?: string;
}

export interface Meal extends CalorieEstimation { // Now uses CalorieEstimation defined in this file
  id: string; // Unique ID for the meal
  timestamp: string; // ISO string date when the meal was logged
  imageSrc?: string; // Optional: store a thumbnail or reference to the image
}

export interface DailyLogEntry {
  date: string; // YYYY-MM-DD format
  meals: Meal[];
  totalCalories: number;
  notes?: string; // Daily notes if any
}

export interface UserProfile {
  name?: string;
  weightKg: number; // in kilograms
  heightCm: number; // in centimeters
  // Optional: age and gender for more accurate BMR if we add it later
  // age?: number;
  // gender?: 'male' | 'female' | 'other';
}

// Represents the state of the image analysis flow
export enum ImageAnalysisFlowState {
  INITIAL = 'initial',
  CAMERA = 'camera',
  PREVIEW = 'preview',
  ANALYZING = 'analyzing',
  RESULT = 'result',
  ERROR = 'error'
}

// Represents the main navigation state of the application
export enum AppMode {
  LOADING = 'loading', // Initial loading state
  PROFILE_SETUP = 'profile_setup',
  DASHBOARD = 'dashboard',
  ADD_MEAL = 'add_meal', // This will internally use ImageAnalysisFlowState
  WEEKLY_PROGRESS = 'weekly_progress',
  EDIT_PROFILE = 'edit_profile'
}

export interface ExerciseSuggestion {
  name: string;
  description: string; // e.g., "30분 동안"
  caloriesBurnedApprox: number;
}