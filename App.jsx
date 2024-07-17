import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import lightColors from './assets/themes/lightColors.json';
import darkColors from './assets/themes/darkColors.json';
import AppNavigator from './navigation/AppNavigator';
import { UserProvider } from './utils/UserContext';
import { StripeProvider } from '@stripe/stripe-react-native';
import { STRIPE_PUBLISHABLE_KEY, SENDBIRD_APP_ID } from '@env';
import {
  SendbirdUIKitContainer,
  LocalizationProvider,
} from '@sendbird/uikit-react-native';
import { MMKV } from 'react-native-mmkv';
import { platformServices } from './utils/PlatformServices';
import defaultLocale from './utils/defaultLocale';
import messaging from '@react-native-firebase/messaging';
import { handleBackgroundNotification } from './utils/NotificationHandler';
import firebase from '@react-native-firebase/app'; 
import analytics from '@react-native-firebase/analytics'; 

const lightTheme = {
  ...MD3LightTheme,
  colors: { ...MD3LightTheme.colors, ...lightColors.colors },
};

const darkTheme = {
  ...MD3DarkTheme,
  colors: { ...MD3DarkTheme.colors, ...darkColors.colors },
};

// Initialize MMKV
const mmkvStorage = new MMKV();

const localCacheStorage = {
  async getAllKeys() {
    return mmkvStorage.getAllKeys();
  },
  async setItem(key, value) {
    mmkvStorage.set(key, value);
  },
  async getItem(key) {
    return mmkvStorage.getString(key) ?? null;
  },
  async removeItem(key) {
    mmkvStorage.delete(key);
  },
};

const App = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    handleBackgroundNotification();

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', remoteMessage);
    });

    const initializeFirebase = async () => {
      try {
        await analytics().logEvent('app_opened', {
          test_param: 'test_value'
        });
        console.log('Firebase initialized and event logged');
      } catch (error) {
        console.error('Error initializing Firebase:', error);
      }
    };

    initializeFirebase();

    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaProvider>
      <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
        <PaperProvider theme={isDarkTheme ? darkTheme : lightTheme}>
          <SendbirdUIKitContainer
            appId={SENDBIRD_APP_ID}
            chatOptions={{ localCacheStorage }}
            platformServices={platformServices}
            localization={{ stringSet: defaultLocale }}
            userProfile={{ onCreateChannel: () => {} }}>
            <UserProvider>
              <AppNavigator setIsDarkTheme={setIsDarkTheme} />
            </UserProvider>
          </SendbirdUIKitContainer>
        </PaperProvider>
      </StripeProvider>
    </SafeAreaProvider>
  );
};

export default App;
