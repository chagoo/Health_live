import React from 'react';
import {StyleSheet, View} from 'react-native';
import BodyCompositionSection from './sections/BodyCompositionSection';
import BloodPressureSection from './sections/BloodPressureSection';
import GlucoseSection from './sections/GlucoseSection';
import LipidSection from './sections/LipidSection';

const MonitoringDashboard: React.FC = () => (
  <View style={styles.container}>
    <BloodPressureSection />
    <GlucoseSection />
    <LipidSection />
    <BodyCompositionSection />
  </View>
);

const styles = StyleSheet.create({
  container: {},
});

export default MonitoringDashboard;
