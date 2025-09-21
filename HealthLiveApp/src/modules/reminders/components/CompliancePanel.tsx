import React from 'react';
import {StyleSheet, Text, View, Pressable} from 'react-native';
import {
  DAILY_COMPLIANCE_TASKS,
  WEEKLY_COMPLIANCE_TASKS,
} from '../domain';
import useComplianceChecklist from '../hooks/useComplianceChecklist';

const CompliancePanel: React.FC = () => {
  const {
    daily,
    weekly,
    loading,
    dailyCompletion,
    weeklyCompletion,
    toggleDaily,
    toggleWeekly,
  } = useComplianceChecklist();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Panel de cumplimiento</Text>
      <Text style={styles.subtitle}>
        Lleva un control diario y semanal de tus hábitos clave y celebra cada logro.
      </Text>
      <View style={styles.progressRow}>
        <View style={styles.progressCard}>
          <Text style={styles.progressLabel}>Cumplimiento diario</Text>
          <Text style={styles.progressValue}>{dailyCompletion}%</Text>
        </View>
        <View style={styles.progressCard}>
          <Text style={styles.progressLabel}>Cumplimiento semanal</Text>
          <Text style={styles.progressValue}>{weeklyCompletion}%</Text>
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Checklist diario</Text>
        {DAILY_COMPLIANCE_TASKS.map(task => (
          <ChecklistItem
            key={task.id}
            label={task.label}
            description={task.description}
            checked={!!daily[task.id]}
            disabled={loading}
            onPress={() => toggleDaily(task.id)}
          />
        ))}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Checklist semanal</Text>
        {WEEKLY_COMPLIANCE_TASKS.map(task => (
          <ChecklistItem
            key={task.id}
            label={task.label}
            description={task.description}
            checked={!!weekly[task.id]}
            disabled={loading}
            onPress={() => toggleWeekly(task.id)}
          />
        ))}
      </View>
    </View>
  );
};

type ChecklistItemProps = {
  label: string;
  description: string;
  checked: boolean;
  onPress: () => void;
  disabled?: boolean;
};

const ChecklistItem: React.FC<ChecklistItemProps> = ({
  label,
  description,
  checked,
  onPress,
  disabled,
}) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.item, checked && styles.itemChecked, disabled && styles.itemDisabled]}
    >
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked && <Text style={styles.checkboxMark}>✓</Text>}
      </View>
      <View style={styles.itemContent}>
        <Text style={styles.itemLabel}>{label}</Text>
        <Text style={styles.itemDescription}>{description}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#ecfeff',
    borderRadius: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
  },
  subtitle: {
    marginTop: 4,
    color: '#334155',
    fontSize: 13,
    lineHeight: 18,
  },
  progressRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  progressCard: {
    flex: 1,
    backgroundColor: '#cffafe',
    borderRadius: 12,
    padding: 12,
  },
  progressLabel: {
    color: '#0e7490',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  progressValue: {
    color: '#0f172a',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 4,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bae6fd',
    marginBottom: 10,
    backgroundColor: '#f8fafc',
  },
  itemChecked: {
    backgroundColor: '#ccfbf1',
    borderColor: '#14b8a6',
  },
  itemDisabled: {
    opacity: 0.6,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#0891b2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: '#ecfeff',
  },
  checkboxChecked: {
    backgroundColor: '#14b8a6',
    borderColor: '#0f766e',
  },
  checkboxMark: {
    color: '#f8fafc',
    fontWeight: '700',
  },
  itemContent: {
    flex: 1,
  },
  itemLabel: {
    color: '#0f172a',
    fontWeight: '600',
    fontSize: 15,
  },
  itemDescription: {
    color: '#475569',
    marginTop: 4,
    fontSize: 12,
    lineHeight: 18,
  },
});

export default CompliancePanel;
