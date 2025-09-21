import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

type MetricSectionProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

const MetricSection: React.FC<MetricSectionProps> = ({title, description, children}) => (
  <View style={styles.container}>
    <Text style={styles.title}>{title}</Text>
    {description ? <Text style={styles.description}>{description}</Text> : null}
    {children}
  </View>
);

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: '#475569',
    marginBottom: 12,
  },
});

export default MetricSection;
