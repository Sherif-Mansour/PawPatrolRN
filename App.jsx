import React, {useEffect} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {PaperProvider, MD3LightTheme as DefaultTheme} from 'react-native-paper';
import customScheme from './assets/themes/customScheme.json';
import AppNavigator from './navigation/AppNavigator';
import {UserProvider} from './utils/UserContext';
import {StripeProvider} from '@stripe/stripe-react-native';
import {STRIPE_PUBLISHABLE_KEY} from '@env';

// https://callstack.github.io/react-native-paper/docs/guides/theming

const theme = {
  ...DefaultTheme,
  colors: {...customScheme.colors},
};

const App = () => {
  return (
    <SafeAreaProvider>
      <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
        <PaperProvider theme={theme}>
          <UserProvider>
            <AppNavigator />
          </UserProvider>
        </PaperProvider>
      </StripeProvider>
    </SafeAreaProvider>
  );
};

export default App;
