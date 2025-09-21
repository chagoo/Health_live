export type ActivityCategory = 'meal' | 'exercise' | 'rest' | 'relaxation';

export interface PlanActivity {
  id: string;
  category: ActivityCategory;
  title: string;
  description: string;
  time: string;
  context: string;
}

export interface DailyPlan {
  day: string;
  focus: string;
  recommendation: string;
  activities: PlanActivity[];
}

export interface WeeklyPlan {
  days: DailyPlan[];
  recommendations: string[];
  cardiologistSummary: string;
}

export type StressLevel = 'bajo' | 'moderado' | 'alto';
export type ExerciseIntensity = 'suave' | 'moderado' | 'alto';
export type ExerciseBestTime = 'mañana' | 'tarde';

export interface UserHabits {
  patientName: string;
  dietaryPattern: string;
  dietaryRestrictions: string[];
  breakfastTime: string;
  lunchTime: string;
  dinnerTime: string;
  hydrationGoalLiters: number;
  preferredExercise: string;
  exerciseIntensity: ExerciseIntensity;
  exerciseBestTime: ExerciseBestTime;
  restRoutine: string;
  relaxationPreference: string;
  stressLevel: StressLevel;
  sleepGoalHours: number;
  supportNotes: string;
  medicationSchedule: string[];
}

export interface CompletedMap {
  [activityId: string]: boolean;
}
