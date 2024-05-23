// screens/SettingsScreen.js

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function SettingsScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate('ProfileSettings')}>
        <Text style={styles.setting}>Profile Settings</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('NotificationSettings')}>
        <Text style={styles.setting}>Notification Settings</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('PrivacySettings')}>
        <Text style={styles.setting}>Privacy Settings</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Payment')}>
        <Text style={styles.setting}>Payment Settings</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Bookings')}>
        <Text style={styles.setting}>Bookings</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('AppPreferences')}>
        <Text style={styles.setting}>App Preferences</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 40,
    marginBottom: 20,
  },
  setting: {
    fontSize: 20,
    paddingVertical: 4,
  },
});



