import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider, MD3LightTheme as DefaultTheme } from 'react-native-paper';
import customScheme from './assets/themes/customScheme.json';
import AppNavigator from './navigation/AppNavigator';
import { UserProvider } from './utils/UserContext';
import { StripeProvider } from '@stripe/stripe-react-native';

// https://callstack.github.io/react-native-paper/docs/guides/theming

const theme = {
  ...DefaultTheme,
  colors: { ...customScheme.colors }
};

const App = () => {
  return (
    <SafeAreaProvider>
      <StripeProvider publishableKey="pk_test_51PTe3CFj066HqjnDgJz05WTDNEpUTHQoQUJMHLrErGJyHg89uy71MyuHZaco5NqXCwE8LF865yl7BCR7AStnepce00Ob23M6yw">
        <PaperProvider theme={theme}>
          <UserProvider>
            <AppNavigator />
          </UserProvider>
        </PaperProvider>
      </StripeProvider>
    </SafeAreaProvider>
  );
}

export default App;
