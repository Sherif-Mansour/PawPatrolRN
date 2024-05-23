// screens/ProfileSettingsScreen.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppHeader from '../../components/Header';

const ProfileSettingsScreen = () => {
  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <Text style={styles.title}>Profile Settings</Text>
        {/* Add form elements or options to manage profile settings here */}
      </View>
    </SafeAreaProvider>

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
});

export default ProfileSettingsScreen;
