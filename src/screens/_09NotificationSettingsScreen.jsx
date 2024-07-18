import React, { useState, useEffect } from 'react';
import { View, Switch, StyleSheet, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { Text, useTheme } from 'react-native-paper';

const NotificationSettingsScreen = () => {
  const theme = useTheme();
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [newsNotifications, setNewsNotifications] = useState(false);
  const [promoNotifications, setPromoNotifications] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userPhoneNumber, setUserPhoneNumber] = useState('');
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [phoneModalVisible, setPhoneModalVisible] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const user = auth().currentUser;
        if (user) {
          const settingsDoc = await firestore().collection('notificationSettings').doc(user.uid).get();
          if (settingsDoc.exists) {
            const settings = settingsDoc.data();
            setPushNotifications(settings.pushNotifications);
            setEmailNotifications(settings.emailNotifications);
            setSmsNotifications(settings.smsNotifications);
            setNewsNotifications(settings.newsNotifications);
            setPromoNotifications(settings.promoNotifications);
          }

          const profileDoc = await firestore().collection('profiles').doc(user.uid).get();
          if (profileDoc.exists) {
            const profile = profileDoc.data();
            setUserEmail(profile.authEmail || profile.email || '');
            setUserPhoneNumber(profile.phoneNo || '');
          }
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
        Alert.alert('Error', 'There was an error fetching your settings.');
      }
    };

    fetchSettings();
  }, []);

  const saveSetting = async (settingName, value) => {
    try {
      const user = auth().currentUser;
      if (user) {
        await firestore().collection('notificationSettings').doc(user.uid).set(
          {
            [settingName]: value,
          },
          { merge: true }
        );
      }
    } catch (error) {
      console.error(`Error saving ${settingName}:`, error);
      Alert.alert('Error', `There was an error saving your ${settingName} setting.`);
    }
  };

  const handleToggleSwitch = async (settingName, value) => {
    if (settingName === 'emailNotifications' && value && !userEmail) {
      Alert.alert('Error', 'No email address found in your profile. Please update your profile.');
      return;
    }

    if (settingName === 'smsNotifications' && value && !userPhoneNumber) {
      Alert.alert('Error', 'No phone number found in your profile. Please update your profile.');
      return;
    }

    switch (settingName) {
      case 'pushNotifications':
        setPushNotifications(value);
        break;
      case 'emailNotifications':
        setEmailNotifications(value);
        break;
      case 'smsNotifications':
        setSmsNotifications(value);
        break;
      case 'newsNotifications':
        setNewsNotifications(value);
        break;
      case 'promoNotifications':
        setPromoNotifications(value);
        break;
      default:
        break;
    }
    saveSetting(settingName, value);
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Text style={styles.title}>Notification Settings</Text>
      <View style={styles.setting}>
        <Text>Push Notifications</Text>
        <Switch
          value={pushNotifications}
          onValueChange={(value) => handleToggleSwitch('pushNotifications', value)}
        />
      </View>
      <View style={styles.setting}>
        <Text>Email Notifications</Text>
        <Switch
          value={emailNotifications}
          onValueChange={(value) => handleToggleSwitch('emailNotifications', value)}
        />
      </View>
      <View style={styles.setting}>
        <Text>SMS Notifications</Text>
        <Switch
          value={smsNotifications}
          onValueChange={(value) => handleToggleSwitch('smsNotifications', value)}
        />
      </View>
      <View style={styles.setting}>
        <Text>News Notifications</Text>
        <Switch
          value={newsNotifications}
          onValueChange={(value) => handleToggleSwitch('newsNotifications', value)}
        />
      </View>
      <View style={styles.setting}>
        <Text>Promotional Notifications</Text>
        <Switch
          value={promoNotifications}
          onValueChange={(value) => handleToggleSwitch('promoNotifications', value)}
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

export default NotificationSettingsScreen;
