import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider, MD3LightTheme as DefaultTheme } from 'react-native-paper';
import customScheme from './assets/themes/customScheme.json';
import AppNavigator from './navigation/AppNavigator';
import { UserProvider } from './utils/UserContext';

const theme = {
  ...DefaultTheme,
  colors: { ...customScheme.colors }
};

const App = () => {

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <UserProvider>
          <AppNavigator />
        </UserProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

export default App;
