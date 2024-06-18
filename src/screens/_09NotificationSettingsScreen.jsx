import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet, Alert, TextInput, Modal, Button } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const NotificationSettingsScreen = () => {
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
            setUserEmail(profile.email || '');
            setUserPhoneNumber(profile.phoneNumber || '');
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
      setEmailModalVisible(true);
      return;
    }

    if (settingName === 'smsNotifications' && value && !userPhoneNumber) {
      setPhoneModalVisible(true);
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

  const handleSaveEmail = async () => {
    if (!userEmail) {
      Alert.alert('Error', 'Email address cannot be empty.');
      return;
    }
    try {
      const user = auth().currentUser;
      if (user) {
        await firestore().collection('profiles').doc(user.uid).set(
          {
            email: userEmail,
          },
          { merge: true }
        );
        setEmailModalVisible(false);
        setEmailNotifications(true);
        saveSetting('emailNotifications', true);
      }
    } catch (error) {
      console.error('Error saving email:', error);
      Alert.alert('Error', 'There was an error saving your email.');
    }
  };

  const handleSavePhoneNumber = async () => {
    if (!userPhoneNumber) {
      Alert.alert('Error', 'Phone number cannot be empty.');
      return;
    }
    try {
      const user = auth().currentUser;
      if (user) {
        await firestore().collection('profiles').doc(user.uid).set(
          {
            phoneNumber: userPhoneNumber,
          },
          { merge: true }
        );
        setPhoneModalVisible(false);
        setSmsNotifications(true);
        saveSetting('smsNotifications', true);
      }
    } catch (error) {
      console.error('Error saving phone number:', error);
      Alert.alert('Error', 'There was an error saving your phone number.');
    }
  };

  return (
    <View style={styles.container}>
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

      <Modal
        visible={emailModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setEmailModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Email Address</Text>
            <TextInput
              style={styles.input}
              value={userEmail}
              onChangeText={setUserEmail}
              placeholder="Email Address"
              keyboardType="email-address"
            />
            <Button title="Save" onPress={handleSaveEmail} />
            <Button title="Cancel" onPress={() => setEmailModalVisible(false)} />
          </View>
        </View>
      </Modal>

      <Modal
        visible={phoneModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setPhoneModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Phone Number</Text>
            <TextInput
              style={styles.input}
              value={userPhoneNumber}
              onChangeText={setUserPhoneNumber}
              placeholder="Phone Number"
              keyboardType="phone-pad"
            />
            <Button title="Save" onPress={handleSavePhoneNumber} />
            <Button title="Cancel" onPress={() => setPhoneModalVisible(false)} />
          </View>
        </View>
      </Modal>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
});

export default NotificationSettingsScreen;
