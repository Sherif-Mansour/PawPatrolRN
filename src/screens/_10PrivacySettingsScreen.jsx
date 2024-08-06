import React, { useState, useEffect } from 'react';
import { View, Switch, StyleSheet, Alert, ScrollView } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { useTheme, Text, Button } from 'react-native-paper';

const PrivacySettingsScreen = () => {
  const theme = useTheme();
  const [isPublicProfile, setIsPublicProfile] = useState(false);
  const [shareDataWithThirdParties, setShareDataWithThirdParties] = useState(false);
  const [isDataTrackingEnabled, setIsDataTrackingEnabled] = useState(false);
  const [isLiveLocationEnabled, setIsLiveLocationEnabled] = useState(false);
  const [isActivityStatusEnabled, setIsActivityStatusEnabled] = useState(false);
  const [isAdPersonalizationEnabled, setIsAdPersonalizationEnabled] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const user = auth().currentUser;
        if (user) {
          const settingsDoc = await firestore().collection('privacySettings').doc(user.uid).get();
          if (settingsDoc.exists) {
            const settings = settingsDoc.data();
            setIsPublicProfile(settings.isPublicProfile);
            setShareDataWithThirdParties(settings.shareDataWithThirdParties);
            setIsDataTrackingEnabled(settings.isDataTrackingEnabled);
            setIsLiveLocationEnabled(settings.isLiveLocationEnabled);
            setIsActivityStatusEnabled(settings.isActivityStatusEnabled);
            setIsAdPersonalizationEnabled(settings.isAdPersonalizationEnabled);
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
        await firestore().collection('privacySettings').doc(user.uid).set(
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

  const handleToggleSwitch = (settingName, value) => {
    switch (settingName) {
      case 'isPublicProfile':
        setIsPublicProfile(value);
        break;
      case 'shareDataWithThirdParties':
        setShareDataWithThirdParties(value);
        break;
      case 'isDataTrackingEnabled':
        setIsDataTrackingEnabled(value);
        break;
      case 'isLiveLocationEnabled':
        setIsLiveLocationEnabled(value);
        break;
      case 'isActivityStatusEnabled':
        setIsActivityStatusEnabled(value);
        break;
      case 'isAdPersonalizationEnabled':
        setIsAdPersonalizationEnabled(value);
        break;
      default:
        break;
    }
    saveSetting(settingName, value);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const user = auth().currentUser;
              if (user) {
                await firestore().collection('users').doc(user.uid).delete();
                await firestore().collection('privacySettings').doc(user.uid).delete();
                await user.delete();
                Alert.alert(
                  'Account deleted',
                  'Your account has been deleted successfully.',
                  [
                    {
                      text: 'OK',
                      onPress: () => navigation.navigate('SplashScreen'),
                    },
                  ]
                );
              }
            } catch (error) {
              console.error('Error deleting account:', error);
              Alert.alert('Error', 'There was an error deleting your account.');
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={styles.title}>Privacy Settings</Text>
      <View style={styles.setting}>
        <Text>Public Profile</Text>
        <Switch
          value={isPublicProfile}
          onValueChange={(value) => handleToggleSwitch('isPublicProfile', value)}
        />
      </View>
      <View style={styles.setting}>
        <Text>Share Data with Third Parties</Text>
        <Switch
          value={shareDataWithThirdParties}
          onValueChange={(value) => handleToggleSwitch('shareDataWithThirdParties', value)}
        />
      </View>
      <View style={styles.setting}>
        <Text>Data Tracking</Text>
        <Switch
          value={isDataTrackingEnabled}
          onValueChange={(value) => handleToggleSwitch('isDataTrackingEnabled', value)}
        />
      </View>
      <View style={styles.setting}>
        <Text>Live Location</Text>
        <Switch
          value={isLiveLocationEnabled}
          onValueChange={(value) => handleToggleSwitch('isLiveLocationEnabled', value)}
        />
      </View>
      <View style={styles.setting}>
        <Text>Activity Status</Text>
        <Switch
          value={isActivityStatusEnabled}
          onValueChange={(value) => handleToggleSwitch('isActivityStatusEnabled', value)}
        />
      </View>
      <View style={styles.setting}>
        <Text>Ad Personalization</Text>
        <Switch
          value={isAdPersonalizationEnabled}
          onValueChange={(value) => handleToggleSwitch('isAdPersonalizationEnabled', value)}
        />
      </View>
      <View style={styles.inquiryContainer}>
        <Button mode="contained" onPress={() => navigation.navigate('InquirySubmission')}>
          Submit Inquiry
        </Button>
      </View>
      <View style={styles.buttonContainer}>
        <Button mode="contained" onPress={handleDeleteAccount}>
          Delete Account
        </Button>
      </View>
    </ScrollView>
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
  inquiryContainer: {
    marginVertical: 20,
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default PrivacySettingsScreen;
