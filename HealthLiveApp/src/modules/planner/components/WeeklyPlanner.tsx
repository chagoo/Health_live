import React from 'react';
import {
  Alert,
  Pressable,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import useUserHabits from '../hooks/useUserHabits';
import useWeeklyPlan from '../hooks/useWeeklyPlan';
import {
  ActivityCategory,
  CompletedMap,
  PlanActivity,
} from '../domain/types';
import {categoryLabels} from '../domain/weeklyPlan';
import {composeShareMessage} from '../utils/shareSummary';

const categoryColors: Record<ActivityCategory, string> = {
  meal: '#f97316',
  exercise: '#22c55e',
  rest: '#38bdf8',
  relaxation: '#a855f7',
};

const WeeklyPlanner: React.FC = () => {
  const habits = useUserHabits();
  const plan = useWeeklyPlan(habits);
  const [completed, setCompleted] = React.useState<CompletedMap>({});

  const totalActivities = React.useMemo(
    () => plan.days.reduce((acc, day) => acc + day.activities.length, 0),
    [plan.days],
  );

  const completedCount = React.useMemo(
    () =>
      plan.days.reduce(
        (acc, day) =>
          acc + day.activities.filter(activity => completed[activity.id]).length,
        0,
      ),
    [plan.days, completed],
  );

  const toggleActivity = React.useCallback((activityId: string) => {
    setCompleted(prev => ({
      ...prev,
      [activityId]: !prev[activityId],
    }));
  }, []);

  const handleShare = React.useCallback(async () => {
    try {
      const message = composeShareMessage(plan, completed, habits);
      await Share.share({
        title: 'Plan semanal cardiovascular',
        message,
      });
    } catch (error) {
      Alert.alert('No fue posible compartir', 'Inténtalo nuevamente más tarde.');
    }
  }, [plan, completed, habits]);

  const renderActivity = (activity: PlanActivity) => {
    const isCompleted = Boolean(completed[activity.id]);
    return (
      <Pressable
        key={activity.id}
        onPress={() => toggleActivity(activity.id)}
        style={({pressed}) => [
          styles.activityCard,
          {borderColor: categoryColors[activity.category]},
          isCompleted && styles.activityCardCompleted,
          pressed && styles.activityCardPressed,
        ]}>
        <View style={styles.activityHeader}>
          <View
            style={[styles.categoryBadge, {backgroundColor: categoryColors[activity.category]}]}>
            <Text style={styles.categoryBadgeText}>
              {categoryLabels[activity.category]}
            </Text>
          </View>
          <Text style={styles.activityTime}>{activity.time}</Text>
        </View>
        <Text style={styles.activityTitle}>{activity.title}</Text>
        <Text style={styles.activityDescription}>{activity.description}</Text>
        <Text style={styles.activityContext}>{activity.context}</Text>
        {isCompleted ? (
          <Text style={styles.completedLabel}>Marcada como completada ✓</Text>
        ) : null}
      </Pressable>
    );
  };

  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.title}>Plan semanal cardioprotector</Text>
        <Text style={styles.subtitle}>
          Personalizado según tus hábitos {habits.exerciseBestTime === 'mañana'
            ? 'matutinos'
            : 'vespertinos'} y el patrón {habits.dietaryPattern.toLowerCase()}.
        </Text>
      </View>

      <View style={styles.progressContainer}>
        <Text style={styles.progressLabel}>Progreso semanal</Text>
        <Text style={styles.progressValue}>
          {completedCount} / {totalActivities} actividades completadas
        </Text>
      </View>

      <View style={styles.recommendationsContainer}>
        <Text style={styles.sectionLabel}>Recomendaciones contextualizadas</Text>
        {plan.recommendations.map(recommendation => (
          <Text key={recommendation} style={styles.recommendationItem}>
            • {recommendation}
          </Text>
        ))}
      </View>

      {plan.days.map(day => (
        <View key={day.day} style={styles.dayCard}>
          <View style={styles.dayHeader}>
            <Text style={styles.dayTitle}>{day.day}</Text>
            <Text style={styles.dayFocus}>{day.focus}</Text>
          </View>
          <Text style={styles.dayRecommendation}>{day.recommendation}</Text>
          {day.activities.map(renderActivity)}
        </View>
      ))}

      <Pressable
        onPress={handleShare}
        style={({pressed}) => [styles.shareButton, pressed && styles.shareButtonPressed]}>
        <Text style={styles.shareButtonText}>Compartir resumen con mi cardiólogo</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#334155',
  },
  progressContainer: {
    backgroundColor: '#e0f2fe',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  progressLabel: {
    fontSize: 12,
    color: '#0369a1',
    fontWeight: '600',
    marginBottom: 4,
  },
  progressValue: {
    fontSize: 16,
    color: '#0f172a',
    fontWeight: '600',
  },
  recommendationsContainer: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5f5',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 8,
  },
  recommendationItem: {
    fontSize: 13,
    color: '#1e293b',
    marginBottom: 4,
  },
  dayCard: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  dayFocus: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0284c7',
  },
  dayRecommendation: {
    fontSize: 13,
    color: '#334155',
    marginBottom: 12,
  },
  activityCard: {
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#f8fafc',
  },
  activityCardCompleted: {
    backgroundColor: '#dcfce7',
    borderColor: '#22c55e',
  },
  activityCardPressed: {
    opacity: 0.85,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    alignItems: 'center',
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  categoryBadgeText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '700',
  },
  activityTime: {
    fontSize: 12,
    color: '#0369a1',
    fontWeight: '600',
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 13,
    color: '#1e293b',
    marginBottom: 4,
  },
  activityContext: {
    fontSize: 12,
    color: '#475569',
  },
  completedLabel: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '600',
    color: '#15803d',
  },
  shareButton: {
    marginTop: 12,
    backgroundColor: '#0284c7',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  shareButtonPressed: {
    backgroundColor: '#0369a1',
  },
  shareButtonText: {
    color: '#f8fafc',
    fontSize: 15,
    fontWeight: '700',
  },
});

export default WeeklyPlanner;
