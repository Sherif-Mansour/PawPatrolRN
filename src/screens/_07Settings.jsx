// screens/SettingsScreen.js

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function SettingsScreen() {
  const navigation = useNavigation();

  return (
    <View>
      <Text>Settings</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate('ProfileSettings')}>
        <Text>Profile Settings</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('NotificationSettings')}>
        <Text>Notification Settings</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('PrivacySettings')}>
        <Text>Privacy Settings</Text>
      </TouchableOpacity>
    </View>
  );
}



