import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {BodyCompositionRecord, DEFAULT_THRESHOLDS, buildAlerts} from '../../domain';
import {useMetricRecords} from '../../hooks';
import {formatShortDate} from '../../utils/date';
import BodyCompositionForm from '../forms/BodyCompositionForm';
import MetricHistory from '../history/MetricHistory';
import MetricSection from './MetricSection';

const BodyCompositionSection: React.FC = () => {
  const {records, addRecord} = useMetricRecords('bodyComposition');
  const categories = records.map(item => formatShortDate(item.recordedAt));
  const alerts = buildAlerts('bodyComposition', records);

  return (
    <MetricSection
      title="Peso e IMC"
      description="Controla tu evolución antropométrica y evalúa el impacto de los cambios de estilo de vida."
    >
      <BodyCompositionForm onSubmit={addRecord} />
      <MetricHistory<BodyCompositionRecord>
        records={records}
        series={[
          {
            label: 'Peso',
            data: records.map(item => item.weightKg),
            color: '#10b981',
          },
          {
            label: 'IMC',
            data: records.map(item => item.bmi),
            color: '#059669',
            threshold: DEFAULT_THRESHOLDS.bodyComposition.bmiHigh,
          },
        ]}
        categories={categories}
        alerts={alerts}
        renderRecord={(record: BodyCompositionRecord) => (
          <View style={styles.historyRow}>
            <Text style={styles.historyDate}>{formatShortDate(record.recordedAt)}</Text>
            <Text style={styles.historyValue}>{record.weightKg} kg</Text>
            <Text style={styles.historyTag}>IMC {record.bmi}</Text>
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
    color: '#047857',
    fontSize: 13,
  },
});

export default BodyCompositionSection;
