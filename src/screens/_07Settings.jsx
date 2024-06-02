// screens/SettingsScreen.js

import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useUser} from '../../utils/UserContext';

export default function SettingsScreen({navigation}) {
  const {signOut} = useUser();

  const handleSignOut = () => {
    signOut(navigation);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate('NotificationSettings')}>
        <Text style={styles.setting}>Notification Settings</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('PrivacySettings')}>
        <Text style={styles.setting}>Privacy Settings</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('PaymentSettings')}>
        <Text style={styles.setting}>Payment Settings</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('AppPreferences')}>
        <Text style={styles.setting}>App Preferences</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('BookingSettings')}>
        <Text style={styles.setting}>Booking Settings</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('UserAds')}>
        <Text style={styles.setting}>Ads</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSignOut}>
        <Text style={styles.setting}>Sign Out</Text>
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
