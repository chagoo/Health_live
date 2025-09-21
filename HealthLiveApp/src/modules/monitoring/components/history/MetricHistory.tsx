import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import type {MetricAlert, MetricRecordBase} from '../../domain';
import AlertBanner from './AlertBanner';

type ChartSeries = {
  label: string;
  data: number[];
  color: string;
  threshold?: number;
};

type MetricHistoryProps<T extends MetricRecordBase> = {
  records: T[];
  series: ChartSeries[];
  categories: string[];
  alerts: MetricAlert[];
  renderRecord: (record: T) => React.ReactNode;
};

const MetricHistory = <T extends MetricRecordBase>({
  records,
  series,
  categories,
  alerts,
  renderRecord,
}: MetricHistoryProps<T>) => {
  const hasData = records.length > 0;
  const maxValue = Math.max(
    ...series.map(current => Math.max(...current.data, 0)),
    0,
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial reciente</Text>
      {alerts.map(alert => (
        <AlertBanner key={`${alert.recordId}-${alert.message}`} message={alert.message} />
      ))}
      {hasData ? (
        <>
          <View style={styles.chartContainer}>
            {categories.map((category, index) => (
              <View style={styles.chartColumn} key={category}>
                <View style={styles.barGroup}>
                  {series.map(serie => {
                    const value = serie.data[index] ?? 0;
                    const heightRatio = maxValue === 0 ? 0 : value / maxValue;
                    const barHeight = Math.max(8, Math.round(heightRatio * 100));
                    const exceedsThreshold =
                      typeof serie.threshold === 'number' && value >= serie.threshold;
                    return (
                      <View
                        key={`${serie.label}-${category}`}
                        style={[
                          styles.bar,
                          {
                            height: barHeight,
                            backgroundColor: exceedsThreshold ? '#dc2626' : serie.color,
                          },
                        ]}
                      />
                    );
                  })}
                </View>
                <Text style={styles.category}>{category}</Text>
              </View>
            ))}
          </View>
          <View>
            {records.slice(-3).reverse().map(record => (
              <View style={styles.recordRow} key={record.id}>
                {renderRecord(record)}
              </View>
            ))}
          </View>
        </>
      ) : (
        <Text style={styles.empty}>Aún no has registrado datos para esta métrica.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 12,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 12,
    minHeight: 140,
  },
  chartColumn: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  barGroup: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    flex: 1,
  },
  bar: {
    width: 12,
    borderRadius: 6,
    backgroundColor: '#0284c7',
    marginHorizontal: 2,
  },
  category: {
    fontSize: 11,
    color: '#475569',
    marginTop: 6,
  },
  recordRow: {
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingVertical: 8,
  },
  empty: {
    color: '#475569',
    fontSize: 13,
  },
});

export default MetricHistory;
