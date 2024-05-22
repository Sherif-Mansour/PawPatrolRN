// screens/SettingsScreen.js

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';



const SettingsScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      
      <TouchableOpacity onPress={()=> navigation.navigate('ProfileSettings')}>
        <Text style={styles.item}>Profile Settings</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('NotificationSettings')}>
        <Text style={styles.item}>Notification Settings</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('PrivacySettings')}>
        <Text style={styles.item}>Privacy Settings</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('PaymentSettings')}>
        <Text style={styles.item}>Payment Settings</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('BookingSettings')}>
        <Text style={styles.item}>Booking Settings</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('AppPreferences')}>
        <Text style={styles.item}>App Preferences</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Support')}>
        <Text style={styles.item}>Support</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Legal')}>
        <Text style={styles.item}>Legal & About</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  item: {
    fontSize: 18,
    paddingVertical: 10,
  },
});

export default SettingsScreen;
