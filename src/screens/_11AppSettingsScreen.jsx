// screens/AppPreferencesScreen.js

import React, { useState } from 'react';
import { View, Switch, StyleSheet } from 'react-native';
import { useTheme, Text } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const AppSettingsScreen = ({ setIsDarkTheme }) => {
  const theme = useTheme()
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('English');

  const toggleDarkMode = (value) => {
    setDarkMode(value);
    setIsDarkTheme(value);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: theme.colors.background
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

  return (
    <SafeAreaProvider>
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
    </SafeAreaProvider>
  );
};



export default AppSettingsScreen;
