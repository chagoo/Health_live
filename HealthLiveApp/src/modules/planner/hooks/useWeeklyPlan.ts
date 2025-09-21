import {useMemo} from 'react';
import {buildWeeklyPlan} from '../domain/weeklyPlan';
import {UserHabits, WeeklyPlan} from '../domain/types';

const useWeeklyPlan = (habits: UserHabits): WeeklyPlan =>
  useMemo(() => buildWeeklyPlan(habits), [habits]);

export default useWeeklyPlan;
