import React from 'react';
import {SafeAreaView, ScrollView, StatusBar, StyleSheet, View, Text} from 'react-native';
import MonitoringDashboard from './src/modules/monitoring/components/MonitoringDashboard';
import ReminderCenter from './src/modules/reminders/components/ReminderCenter';
import ProfileSummary from './src/modules/profile/components/ProfileSummary';

function Section({title, children}: {title: string; children: React.ReactNode}) {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function App(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0c4a6e" />
      <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Health Live</Text>
          <Text style={styles.heroSubtitle}>Tu asistente para el bienestar diario</Text>
        </View>
        <Section title="Monitoreo en tiempo real">
          <MonitoringDashboard />
        </Section>
        <Section title="Recordatorios personalizados">
          <ReminderCenter />
        </Section>
        <Section title="Perfil de usuario">
          <ProfileSummary />
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    paddingHorizontal: 16,
  },
  hero: {
    backgroundColor: '#0284c7',
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginVertical: 16,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#f8fafc',
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#e0f2fe',
    marginTop: 8,
  },
  sectionContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#0f172a',
    shadowOpacity: 0.08,
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 12,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 12,
  },
});

export default App;
