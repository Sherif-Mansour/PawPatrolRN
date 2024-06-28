import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {PaperProvider, MD3LightTheme as DefaultTheme} from 'react-native-paper';
import customScheme from './assets/themes/customScheme.json';
import AppNavigator from './navigation/AppNavigator';
import {UserProvider} from './utils/UserContext';
import {StripeProvider} from '@stripe/stripe-react-native';
import {STRIPE_PUBLISHABLE_KEY, SENDBIRD_APP_ID} from '@env';
import {
  SendbirdUIKitContainer,
  LocalizationProvider,
} from '@sendbird/uikit-react-native';
import {MMKV} from 'react-native-mmkv';
import {platformServices} from './utils/PlatformServices';
import defaultLocale from './utils/defaultLocale';

const theme = {
  ...DefaultTheme,
  colors: {...customScheme.colors},
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
  console.log('defaultLocale:', defaultLocale);

  return (
    <SafeAreaProvider>
      <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
        <PaperProvider theme={theme}>
          <SendbirdUIKitContainer
            appId={SENDBIRD_APP_ID}
            chatOptions={{localCacheStorage}}
            platformServices={platformServices}
            localization={{stringSet: defaultLocale}}
            userProfile={{onCreateChannel: () => {}}}>
            <UserProvider>
              <AppNavigator />
            </UserProvider>
          </SendbirdUIKitContainer>
        </PaperProvider>
      </StripeProvider>
    </SafeAreaProvider>
  );
};

export default App;
