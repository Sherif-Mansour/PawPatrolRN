// screens/AppPreferencesScreen.js

import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

const AppSettingsScreen = ({ setIsDarkTheme }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('English');

  const toggleDarkMode = (value) => {
    setDarkMode(value);
    setIsDarkTheme(value);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>App Preferences</Text>
      <View style={styles.setting}>
        <Text>Dark Mode</Text>
        <Switch
          value={darkMode}
          onValueChange={toggleDarkMode}
        />
      </View>
      <View style={styles.setting}>
        <Text>Language: {language}</Text>
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

export default AppSettingsScreen;
