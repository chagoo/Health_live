import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {DEFAULT_THRESHOLDS, GlucoseRecord, buildAlerts} from '../../domain';
import {useMetricRecords} from '../../hooks';
import {formatShortDate} from '../../utils/date';
import GlucoseForm from '../forms/GlucoseForm';
import MetricHistory from '../history/MetricHistory';
import MetricSection from './MetricSection';

const GlucoseSection: React.FC = () => {
  const {records, addRecord} = useMetricRecords('glucose');
  const categories = records.map(item => formatShortDate(item.recordedAt));
  const alerts = buildAlerts('glucose', records);

  return (
    <MetricSection
      title="Glucosa"
      description="Monitorea tus mediciones capilares y contextualízalas según el momento del día."
    >
      <GlucoseForm onSubmit={addRecord} />
      <MetricHistory<GlucoseRecord>
        records={records}
        series={[
          {
            label: 'Glucosa',
            data: records.map(item => item.value),
            color: '#f97316',
            threshold: DEFAULT_THRESHOLDS.glucose.value,
          },
        ]}
        categories={categories}
        alerts={alerts}
        renderRecord={(record: GlucoseRecord) => (
          <View style={styles.historyRow}>
            <Text style={styles.historyDate}>{formatShortDate(record.recordedAt)}</Text>
            <Text style={styles.historyValue}>{record.value} mg/dL</Text>
            <Text style={styles.historyTag}>{record.context}</Text>
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
    color: '#9a3412',
    fontSize: 13,
    textTransform: 'capitalize',
  },
});

export default GlucoseSection;
