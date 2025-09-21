import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

type AlertBannerProps = {
  message: string;
};

const AlertBanner: React.FC<AlertBannerProps> = ({message}) => (
  <View style={styles.container}>
    <Text style={styles.text}>⚠️ {message}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fef3c7',
    borderColor: '#f59e0b',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  text: {
    color: '#92400e',
    fontSize: 13,
  },
});

export default AlertBanner;
