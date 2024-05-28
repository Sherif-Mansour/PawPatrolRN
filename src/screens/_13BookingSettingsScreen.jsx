// screens/BookingSettingsScreen.js

import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, TextInput } from 'react-native';

const BookingSettingsScreen = () => {
  const [defaultBookingDuration, setDefaultBookingDuration] = useState('60');
  const [allowRescheduling, setAllowRescheduling] = useState(true);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Booking Settings</Text>
      <View style={styles.setting}>
        <Text>Default Booking Duration (minutes)</Text>
        <TextInput
          style={styles.input}
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    width: 80,
    textAlign: 'center',
  },
});

export default BookingSettingsScreen;
