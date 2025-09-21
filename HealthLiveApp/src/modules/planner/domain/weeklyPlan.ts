import {DailyPlan, PlanActivity, UserHabits, WeeklyPlan} from './types';

const daysOfWeek = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo',
];

interface ActivityBlueprint {
  focus: string;
  meal: {title: string; description: string};
  exercise: {title: string; description: string};
  rest: {title: string; description: string};
  relaxation: {title: string; description: string};
}

const weeklyBlueprints: ActivityBlueprint[] = [
  {
    focus: 'Arranque equilibrado',
    meal: {
      title: 'Desayuno rico en potasio',
      description:
        'Avena con frutos rojos, semillas y nueces para mantener energía estable.',
    },
    exercise: {
      title: 'Caminata consciente',
      description: '20 minutos controlando respiración y postura.',
    },
    rest: {
      title: 'Pausa de respiraciones',
      description: 'Micro pausa de 10 minutos para relajar hombros y cuello.',
    },
    relaxation: {
      title: 'Escaneo corporal guiado',
      description: 'Revisión progresiva de tensiones antes de dormir.',
    },
  },
  {
    focus: 'Fortalecimiento progresivo',
    meal: {
      title: 'Almuerzo hiposódico',
      description:
        'Ensalada con garbanzos, espinacas y aliño de limón para apoyar presión arterial.',
    },
    exercise: {
      title: 'Intervalos suaves',
      description: 'Alterna 3 minutos de caminata rápida con 2 minutos suaves.',
    },
    rest: {
      title: 'Siesta breve supervisada',
      description: '15 minutos en posición semi-reclinada con piernas elevadas.',
    },
    relaxation: {
      title: 'Respiración 4-7-8',
      description: 'Secuencia de respiraciones profundas para reducir estrés.',
    },
  },
  {
    focus: 'Movilidad y flexibilidad',
    meal: {
      title: 'Media mañana antioxidante',
      description: 'Yogur con arándanos y semillas de chía para cuidar vasos sanguíneos.',
    },
    exercise: {
      title: 'Rutina de movilidad articular',
      description: 'Serie de movimientos suaves para hombros, cadera y columna.',
    },
    rest: {
      title: 'Desconexión digital',
      description: 'Bloquea 30 minutos sin pantallas antes de acostarte.',
    },
    relaxation: {
      title: 'Baño de pies tibio',
      description: 'Agrega sales de magnesio para favorecer retorno venoso.',
    },
  },
  {
    focus: 'Resistencia moderada',
    meal: {
      title: 'Cena ligera cardioprotectora',
      description: 'Pescado al horno con verduras de hoja verde y aceite de oliva.',
    },
    exercise: {
      title: 'Sesión de elíptica o bici estática',
      description: '25 minutos manteniendo frecuencia cardiaca en zona segura.',
    },
    rest: {
      title: 'Rutina de estiramientos nocturnos',
      description: 'Enfoque en cadena posterior para evitar rigidez.',
    },
    relaxation: {
      title: 'Diario de gratitud',
      description: 'Anota tres logros o gratitudes antes de dormir.',
    },
  },
  {
    focus: 'Gestión del estrés',
    meal: {
      title: 'Snack rico en magnesio',
      description: 'Puñado de almendras y kiwi para apoyar relajación muscular.',
    },
    exercise: {
      title: 'Sesión de fuerza funcional',
      description: 'Circuito con bandas elásticas enfocando tren superior e inferior.',
    },
    rest: {
      title: 'Respiración diafragmática guiada',
      description: '5 minutos recostada con piernas elevadas.',
    },
    relaxation: {
      title: 'Meditación guiada',
      description: 'Usa tu app favorita durante 12 minutos.',
    },
  },
  {
    focus: 'Conexión social activa',
    meal: {
      title: 'Brunch equilibrado',
      description: 'Tostadas integrales con aguacate, tomate y proteínas magras.',
    },
    exercise: {
      title: 'Salida recreativa',
      description: 'Paseo en naturaleza o parque acompañada.',
    },
    rest: {
      title: 'Siesta opcional',
      description: '20 minutos de descanso tras la comida principal.',
    },
    relaxation: {
      title: 'Actividad placentera',
      description: 'Lectura ligera o música relajante al final del día.',
    },
  },
  {
    focus: 'Preparación para la semana',
    meal: {
      title: 'Planificación de batch cooking',
      description: 'Organiza menús bajos en sodio para la semana siguiente.',
    },
    exercise: {
      title: 'Estiramiento global activo',
      description: 'Secuencia de 20 minutos centrada en respiración y postura.',
    },
    rest: {
      title: 'Higiene del sueño',
      description: 'Rutina relajante con luces cálidas y lectura breve.',
    },
    relaxation: {
      title: 'Visualización guiada',
      description: 'Proyecta metas de la semana mientras respiras profundo.',
    },
  },
];

const categoryLabels = {
  meal: 'Nutrición',
  exercise: 'Ejercicio',
  rest: 'Descanso',
  relaxation: 'Relajación',
} as const;

const mapToActivities = (
  blueprint: ActivityBlueprint,
  day: string,
  index: number,
  habits: UserHabits,
): PlanActivity[] => {
  const exerciseTime = habits.exerciseBestTime === 'mañana' ? '07:00' : '18:30';
  const restTime = habits.exerciseBestTime === 'mañana' ? '13:30' : '15:30';
  const relaxationTime = '21:30';

  return [
    {
      id: `${day.toLowerCase()}-meal`,
      category: 'meal',
      title: `${blueprint.meal.title}`,
      time: index % 2 === 0 ? habits.breakfastTime : habits.lunchTime,
      description: `${blueprint.meal.description} Adaptado al patrón ${habits.dietaryPattern} y tus restricciones: ${habits.dietaryRestrictions.join(', ')}.`,
      context: 'Alimentación cardio-protectora',
    },
    {
      id: `${day.toLowerCase()}-exercise`,
      category: 'exercise',
      title: `${blueprint.exercise.title} (${habits.preferredExercise})`,
      time: exerciseTime,
      description: `${blueprint.exercise.description} Ajusta intensidad a un nivel ${habits.exerciseIntensity} y monitorea la respiración.`,
      context: 'Condicionamiento físico seguro',
    },
    {
      id: `${day.toLowerCase()}-rest`,
      category: 'rest',
      title: blueprint.rest.title,
      time: restTime,
      description: `${blueprint.rest.description} Incorpora tu rutina habitual: ${habits.restRoutine}.`,
      context: 'Recuperación y ritmo circadiano',
    },
    {
      id: `${day.toLowerCase()}-relax`,
      category: 'relaxation',
      title: blueprint.relaxation.title,
      time: relaxationTime,
      description: `${blueprint.relaxation.description} Integra tu preferencia: ${habits.relaxationPreference}.`,
      context: 'Regulación emocional',
    },
  ];
};

const buildDailyRecommendation = (
  blueprint: ActivityBlueprint,
  habits: UserHabits,
): string => {
  const stressMessage =
    habits.stressLevel === 'alto'
      ? 'Prioriza técnicas de respiración lenta y valida nivel de estrés antes de dormir.'
      : habits.stressLevel === 'moderado'
      ? 'Incluye recordatorios para revisar respiración y postura durante la jornada.'
      : 'Mantén un registro breve para asegurar que el estrés siga bajo control.';

  return `${blueprint.focus}: ${stressMessage} Aprovecha las ${habits.supportNotes.toLowerCase()} para reforzar adherencia.`;
};

const buildHabitRecommendations = (habits: UserHabits): string[] => [
  `Hidratación diaria objetivo: ${habits.hydrationGoalLiters.toFixed(1)} L distribuidos en bloques de mañana y tarde.`,
  `Programa la actividad física en la ${habits.exerciseBestTime} aprovechando tu preferencia por ${habits.preferredExercise}.`,
  `Sostén un promedio de ${habits.sleepGoalHours} h de sueño con higiene nocturna consistente.`,
  `Menú basado en el patrón ${habits.dietaryPattern} atendiendo a ${habits.dietaryRestrictions.join(', ')}.`,
  `Medicación en horarios: ${habits.medicationSchedule.join(' y ')} para estabilidad hemodinámica.`,
];

const buildCardiologistSummary = (habits: UserHabits, days: DailyPlan[]): string => {
  const totalActivities = days.reduce((acc, day) => acc + day.activities.length, 0);
  const exerciseSessions = days.length;
  return `Plan semanal centrado en ${habits.preferredExercise} con ${exerciseSessions} sesiones de ejercicio moderado y ${totalActivities} intervenciones totales. Se prioriza pauta ${habits.dietaryPattern} y control de estrés ${habits.stressLevel}.`;
};

export const buildWeeklyPlan = (habits: UserHabits): WeeklyPlan => {
  const days = daysOfWeek.map((day, index) => {
    const blueprint = weeklyBlueprints[index];
    const activities = mapToActivities(blueprint, day, index, habits);
    const recommendation = buildDailyRecommendation(blueprint, habits);

    return {
      day,
      focus: blueprint.focus,
      recommendation,
      activities,
    };
  });

  return {
    days,
    recommendations: buildHabitRecommendations(habits),
    cardiologistSummary: buildCardiologistSummary(habits, days),
  };
};

export {categoryLabels};
