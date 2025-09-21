import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {
  BloodPressureRecord,
  DEFAULT_THRESHOLDS,
  buildAlerts,
} from '../../domain';
import {useMetricRecords} from '../../hooks';
import {formatShortDate} from '../../utils/date';
import BloodPressureForm from '../forms/BloodPressureForm';
import MetricHistory from '../history/MetricHistory';
import MetricSection from './MetricSection';

const BloodPressureSection: React.FC = () => {
  const {records, addRecord} = useMetricRecords('bloodPressure');
  const categories = records.map(item => formatShortDate(item.recordedAt));
  const alerts = buildAlerts('bloodPressure', records);

  return (
    <MetricSection
      title="Presión arterial"
      description="Registra tus mediciones manuales para identificar tendencias y compartirlas con tu equipo médico."
    >
      <BloodPressureForm onSubmit={addRecord} />
      <MetricHistory<BloodPressureRecord>
        records={records}
        series={[
          {
            label: 'Sistólica',
            data: records.map(item => item.systolic),
            color: '#ef4444',
            threshold: DEFAULT_THRESHOLDS.bloodPressure.systolic,
          },
          {
            label: 'Diastólica',
            data: records.map(item => item.diastolic),
            color: '#fb923c',
            threshold: DEFAULT_THRESHOLDS.bloodPressure.diastolic,
          },
        ]}
        categories={categories}
        alerts={alerts}
        renderRecord={(record: BloodPressureRecord) => (
          <View style={styles.historyRow}>
            <Text style={styles.historyDate}>{formatShortDate(record.recordedAt)}</Text>
            <Text style={styles.historyValue}>
              {record.systolic}/{record.diastolic} mmHg
            </Text>
            {record.pulse ? (
              <Text style={styles.historyTag}>{record.pulse} lpm</Text>
            ) : null}
          </View>
        )}
      />
    </MetricSection>
  );
};

const styles = StyleSheet.create({
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  historyDate: {
    color: '#475569',
    fontSize: 13,
    flexBasis: 72,
    marginRight: 8,
  },
  historyValue: {
    color: '#0f172a',
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  historyTag: {
    color: '#0ea5e9',
    fontSize: 13,
  },
});

export default BloodPressureSection;
