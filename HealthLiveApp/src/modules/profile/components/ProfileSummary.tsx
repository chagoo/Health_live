import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

const ProfileSummary: React.FC = () => (
  <View style={styles.container}>
    <View style={styles.avatarContainer}>
      <Image
        source={{uri: 'https://avatars.githubusercontent.com/u/0?v=4'}}
        style={styles.avatar}
      />
    </View>
    <View style={styles.infoContainer}>
      <Text style={styles.name}>María Rivera</Text>
      <Text style={styles.role}>Paciente Premium</Text>
      <Text style={styles.meta}>Objetivo: mejorar resistencia cardiovascular</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#38bdf8',
    marginRight: 16,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
  },
  role: {
    fontSize: 14,
    color: '#0369a1',
    marginBottom: 2,
  },
  meta: {
    fontSize: 12,
    color: '#1e293b',
  },
});

export default ProfileSummary;
