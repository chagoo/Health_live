import {CompletedMap, DailyPlan, UserHabits, WeeklyPlan} from '../domain/types';

const getCompletedCount = (days: DailyPlan[], completed: CompletedMap): number =>
  days.reduce(
    (acc, day) =>
      acc + day.activities.filter(activity => completed[activity.id]).length,
    0,
  );

const getPendingByDay = (days: DailyPlan[], completed: CompletedMap): string[] =>
  days
    .map(day => {
      const pending = day.activities.filter(activity => !completed[activity.id]);
      if (pending.length === 0) {
        return null;
      }

      const pendingTitles = pending.map(activity => activity.title).join(', ');
      return `${day.day}: ${pendingTitles}`;
    })
    .filter((item): item is string => item !== null);

export const composeShareMessage = (
  plan: WeeklyPlan,
  completed: CompletedMap,
  habits: UserHabits,
): string => {
  const totalActivities = plan.days.reduce(
    (acc, day) => acc + day.activities.length,
    0,
  );
  const completedCount = getCompletedCount(plan.days, completed);
  const pendingByDay = getPendingByDay(plan.days, completed);

  const header = `Resumen semanal de ${habits.patientName}`;
  const progressLine = `Progreso: ${completedCount}/${totalActivities} actividades completadas.`;
  const recommendations = plan.recommendations
    .map(recommendation => `• ${recommendation}`)
    .join('\n');
  const pendingSection =
    pendingByDay.length > 0
      ? `Pendientes a vigilar:\n${pendingByDay.join('\n')}`
      : 'Todas las actividades fueron completadas.';

  return `${header}\n${plan.cardiologistSummary}\n${progressLine}\n\nRecomendaciones clave:\n${recommendations}\n\n${pendingSection}`;
};
