import React from 'react';
import {View} from 'react-native';
import ReminderList from './ReminderList';
import ReminderSettingsPanel from './ReminderSettingsPanel';
import CompliancePanel from './CompliancePanel';
import useReminderPreferences from '../hooks/useReminderPreferences';
import useReminderNotifications from '../hooks/useReminderNotifications';

const ReminderCenter: React.FC = () => {
  const {preferences, loading, updatePreference} = useReminderPreferences();
  useReminderNotifications(preferences, !loading);

  return (
    <View>
      <ReminderList preferences={preferences} loading={loading} />
      <ReminderSettingsPanel preferences={preferences} onUpdate={updatePreference} />
      <CompliancePanel />
    </View>
  );
};

export default ReminderCenter;
