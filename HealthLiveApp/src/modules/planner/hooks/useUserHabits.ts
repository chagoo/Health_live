import {useMemo} from 'react';
import {UserHabits} from '../domain/types';

const defaultHabits: UserHabits = {
  patientName: 'María Rivera',
  dietaryPattern: 'DASH con enfoque mediterráneo',
  dietaryRestrictions: ['bajo sodio', 'alto contenido en fibra'],
  breakfastTime: '07:30',
  lunchTime: '13:30',
  dinnerTime: '20:00',
  hydrationGoalLiters: 2.2,
  preferredExercise: 'caminata rápida al aire libre',
  exerciseIntensity: 'moderado',
  exerciseBestTime: 'mañana',
  restRoutine: 'siesta corta de 15 minutos tras el almuerzo',
  relaxationPreference: 'respiración diafragmática con música suave',
  stressLevel: 'moderado',
  sleepGoalHours: 7.5,
  supportNotes: 'sesiones de coaching cardiovascular y recordatorios del equipo médico',
  medicationSchedule: ['08:00', '20:00'],
};

const useUserHabits = (): UserHabits => useMemo(() => defaultHabits, []);

export default useUserHabits;
