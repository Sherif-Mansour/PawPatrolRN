import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider, MD3LightTheme as DefaultTheme } from 'react-native-paper';
import messaging from '@react-native-firebase/messaging';
import customScheme from './assets/themes/customScheme.json';
import AppNavigator from './navigation/AppNavigator';

const theme = {
  ...DefaultTheme,
  colors: { ...customScheme.colors }
};

const App = () => {

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }

  const getToken = async () => {
    const token = await messaging().getToken();
    console.log('Token:', token);
  }

  useEffect(() => {
    requestUserPermission();
    getToken();
  }, []);
  
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <AppNavigator />
      </PaperProvider>
    </SafeAreaProvider>
  );
}

export default App;
