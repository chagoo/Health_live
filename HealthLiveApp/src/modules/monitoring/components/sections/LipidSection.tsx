import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {DEFAULT_THRESHOLDS, LipidRecord, buildAlerts} from '../../domain';
import {useMetricRecords} from '../../hooks';
import {formatShortDate} from '../../utils/date';
import LipidForm from '../forms/LipidForm';
import MetricHistory from '../history/MetricHistory';
import MetricSection from './MetricSection';

const LipidSection: React.FC = () => {
  const {records, addRecord} = useMetricRecords('lipids');
  const categories = records.map(item => formatShortDate(item.recordedAt));
  const alerts = buildAlerts('lipids', records);

  return (
    <MetricSection
      title="Perfil lipídico"
      description="Da seguimiento a tus resultados de laboratorio para medir el impacto del tratamiento."
    >
      <LipidForm onSubmit={addRecord} />
      <MetricHistory<LipidRecord>
        records={records}
        series={[
          {
            label: 'Total',
            data: records.map(item => item.totalCholesterol),
            color: '#a855f7',
            threshold: DEFAULT_THRESHOLDS.lipids.totalCholesterol,
          },
          {
            label: 'LDL',
            data: records.map(item => item.ldl),
            color: '#7c3aed',
            threshold: DEFAULT_THRESHOLDS.lipids.ldl,
          },
          {
            label: 'Triglicéridos',
            data: records.map(item => item.triglycerides),
            color: '#c026d3',
            threshold: DEFAULT_THRESHOLDS.lipids.triglycerides,
          },
        ]}
        categories={categories}
        alerts={alerts}
        renderRecord={(record: LipidRecord) => (
          <View style={styles.historyRow}>
            <Text style={styles.historyDate}>{formatShortDate(record.recordedAt)}</Text>
            <View style={styles.historyValues}>
              <Text style={styles.historyValue}>Total: {record.totalCholesterol}</Text>
              <Text style={styles.historyValue}>LDL: {record.ldl}</Text>
              <Text style={styles.historyValue}>HDL: {record.hdl}</Text>
              <Text style={styles.historyValue}>TG: {record.triglycerides}</Text>
            </View>
          </View>
        )}
      />
    </MetricSection>
  );
};

const styles = StyleSheet.create({
  historyRow: {
    marginBottom: 4,
  },
  historyDate: {
    color: '#475569',
    fontSize: 13,
  },
  historyValues: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  historyValue: {
    color: '#4c1d95',
    fontSize: 13,
    backgroundColor: '#ede9fe',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 4,
  },
});

export default LipidSection;
