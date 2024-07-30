// screens/BookingSettingsScreen.js

import React, { useState } from 'react';
import { View, Switch, StyleSheet, } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { useTheme } from 'react-native-paper';

const BookingSettingsScreen = () => {
  const theme = useTheme();
  const [defaultBookingDuration, setDefaultBookingDuration] = useState('60');
  const [allowRescheduling, setAllowRescheduling] = useState(true);

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Text style={styles.title}>Booking Settings</Text>
      <View style={styles.setting}>
        <Text>Default Booking Duration (minutes)</Text>
        <TextInput
          value={defaultBookingDuration}
          onChangeText={setDefaultBookingDuration}
          keyboardType="numeric"
        />
      </View>
      <View style={styles.setting}>
        <Text>Allow Rescheduling</Text>
        <Switch
          value={allowRescheduling}
          onValueChange={setAllowRescheduling}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
});

export default BookingSettingsScreen;
