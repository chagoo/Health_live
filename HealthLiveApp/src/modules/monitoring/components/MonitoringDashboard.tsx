import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

type MetricCardProps = {
  label: string;
  value: string;
  trend?: 'up' | 'down' | 'stable';
};

const trends: Record<NonNullable<MetricCardProps['trend']>, string> = {
  up: 'Mejora',
  down: 'Atención',
  stable: 'Estable',
};

const MetricCard: React.FC<MetricCardProps> = ({label, value, trend = 'stable'}) => (
  <View style={styles.metricCard}>
    <Text style={styles.metricLabel}>{label}</Text>
    <Text style={styles.metricValue}>{value}</Text>
    <Text style={styles.metricTrend}>{trends[trend]}</Text>
  </View>
);

const MonitoringDashboard: React.FC = () => (
  <View style={styles.container}>
    <MetricCard label="Frecuencia cardiaca" value="72 lpm" trend="up" />
    <MetricCard label="Calidad del sueño" value="85%" trend="stable" />
    <MetricCard label="Pasos diarios" value="9.410" trend="down" />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
    marginVertical: -6,
  },
  metricCard: {
    flexBasis: '48%',
    marginHorizontal: 6,
    marginVertical: 6,
    backgroundColor: '#e0f2fe',
    borderRadius: 12,
    padding: 12,
  },
  metricLabel: {
    fontSize: 14,
    color: '#0f172a',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '700',
    marginVertical: 8,
    color: '#0369a1',
  },
  metricTrend: {
    fontSize: 12,
    color: '#0e7490',
  },
});

export default MonitoringDashboard;
