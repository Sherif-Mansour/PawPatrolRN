import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Avatar, Button, Divider, useTheme } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MyCustomButton from '../../components/MyCustomButton';
import { useUser } from '../../utils/UserContext';

const AccountSettings = ({ navigation }) => {
  const theme = useTheme()
  const { user, signOut, fetchUserProfile, resetPassword } = useUser();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        if (user) {
          const userProfile = await fetchUserProfile();
          setProfile(userProfile);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    loadUserProfile();
  }, [user, fetchUserProfile]);

  const LeftContent = props => {
    if (profile && profile.profilePicture) {
      return (
        <Avatar.Image
          {...props}
          source={{ uri: profile.profilePicture }}
        />
      );
    } else {
      return (
        <Avatar.Icon
          {...props}
          icon="account-circle"
        />
      );
    }
  };

  const handleSignOut = () => {
    signOut(navigation);
  };

  const handlePasswordReset = () => {
    if (user && user.email) {
      resetPassword(user.email);
    } else {
      Alert.alert('Error', 'No email associated with this account.');
    }
  };

  const styles = StyleSheet.create({
    settingsContainer: {
      width: '100%',
      padding: 16,
      alignItems: 'flex-start',
      backgroundColor: theme.colors.surface
    },
    optionContainer: {
      width: '100%',
      alignItems: 'flex-start',
      marginBottom: 16,
    },
    divider: {
      width: '100%',
      marginVertical: 8,
    },
  });

  return (
    <SafeAreaProvider>
      <ScrollView>
        <View style={{ flex: 1, alignItems: 'center', backgroundColor: theme.colors.background }}>
          <View style={styles.settingsContainer}>
            <View style={{ margin: 12 }}>
              <Text variant="labelLarge">Profile Settings</Text>
            </View>
            {profile ? (
              <Card>
                <Card.Title
                  title={profile.firstName + ' ' + profile.lastName}
                  subtitle={user ? user.email : ''}
                  left={LeftContent}
                />
                <Card.Actions>
                  <MyCustomButton
                    onPress={() => navigation.navigate('View Profile', { profile: profile })}
                    label="View Profile"
                  />
                </Card.Actions>
              </Card>
            ) : (
              <MyCustomButton
                onPress={() => navigation.navigate('Profile')}
                label="Create Profile Now!"
              />
            )}
            <Divider style={styles.divider} />
          </View>
          <View style={styles.settingsContainer}>
            <View style={styles.optionContainer}>
              <View style={{ margin: 12 }}>
                <Text variant="labelLarge">Ad Settings</Text>
              </View>
              <MyCustomButton
                onPress={() => navigation.navigate('PaymentSettings')}
                label="Payment Settings"
              />
              <Divider style={styles.divider} />
            </View>
            <View style={styles.optionContainer}>
              <MyCustomButton
                onPress={() => navigation.navigate('BookingSettings')}
                label="Booking Settings"
              />
              <Divider style={styles.divider} />
            </View>
            <View style={styles.optionContainer}>
              <MyCustomButton
                onPress={() => navigation.navigate('UserAds')}
                label="My Ads"
              />
              <Divider style={styles.divider} />
            </View>
          </View>
          <View style={styles.settingsContainer}>
            <View style={styles.optionContainer}>
              <View style={{ margin: 12 }}>
                <Text variant="labelLarge">App Settings</Text>
              </View>
              <MyCustomButton
                onPress={() => navigation.navigate('NotificationSettings')}
                label="Notification Settings"
              />
              <Divider style={styles.divider} />
            </View>
            <View style={styles.optionContainer}>
              <MyCustomButton
                onPress={() => navigation.navigate('PrivacySettings')}
                label="Privacy Settings"
              />
              <Divider style={styles.divider} />
            </View>
            <View style={styles.optionContainer}>
              <MyCustomButton
                onPress={() => navigation.navigate('AppPreferences')}
                label="App Preferences"
              />
              <Divider style={styles.divider} />
            </View>
          </View>
          <View style={styles.settingsContainer}>
            <View style={styles.optionContainer}>
              <View style={{ margin: 12 }}>
                <Text variant="labelLarge">Security Settings</Text>
              </View>
              <MyCustomButton
                onPress={handlePasswordReset}
                label="Reset Password"
              />
              <Divider style={styles.divider} />
            </View>
          </View>
          <View style={{ margin: 10, backgroundColor: theme.colors.surface }}>
            <Button mode="contained" onPress={handleSignOut}>
              Sign Out
            </Button>
          </View>
        </View>
      </ScrollView>
    </SafeAreaProvider>
  );
};


export default AccountSettings;
