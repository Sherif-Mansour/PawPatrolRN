import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {PaperProvider, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import lightColors from './assets/themes/lightColors.json';
import darkColors from './assets/themes/darkColors.json';
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
import { useState } from 'react';

const lightTheme = {
  ...MD3LightTheme,
  colors: { ...MD3LightTheme.colors, ...lightColors.colors },
};

const darkTheme = {
  ...MD3DarkTheme,
  colors: { ...MD3DarkTheme.colors, ...darkColors.colors }
}

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
