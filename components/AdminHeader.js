/* eslint-disable prettier/prettier */
import * as React from 'react';
import { Appbar } from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import { Alert } from 'react-native';

const AdminHeader = () => {
  const theme = useTheme();
  const navigation = useNavigation();

  const handleSignOut = async () => {
    try {
      await auth().signOut();
      navigation.navigate('SignIn');
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'There was an error signing out.');
    }
  };

  return (
    <Appbar.Header style={{ backgroundColor: theme.colors.primary }}>
      <Appbar.Content
        title="PetPal Admin Dashboard"
        titleStyle={{ textAlign: 'left', marginLeft: 10, color: theme.colors.onPrimary }}
      />
      <Appbar.Action
        icon="logout"
        size={24}
        color={theme.colors.onPrimary}
        onPress={handleSignOut}
      />
    </Appbar.Header>
  );
};

export default AdminHeader;
