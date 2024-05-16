/* eslint-disable prettier/prettier */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider, BottomNavigation } from 'react-native-paper';
import HomeScreen from './src/screens/Homescreen';
import Favorites from './src/screens/Favorites';
import Calendar from './src/screens/Calendar';
import Messages from './src/screens/Messages';
import Settings from './src/screens/Settings';

function App() {

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'main', title: 'Home', focusedIcon: 'home-circle', unfocusedIcon: 'home-circle-outline' },
    { key: 'saved', title: 'Favorites', focusedIcon: 'heart', unfocusedIcon: 'heart-outline' },
    { key: 'calendar', title: 'Calendar', focusedIcon: 'calendar-month', },
    { key: 'messages', title: 'Chat', focusedIcon: 'chat', unfocusedIcon: 'chat-outline', },
    { key: 'settings', title: 'Account', focusedIcon: 'account-circle', unfocusedIcon: 'account-circle-outline', },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    main: () => <HomeScreen />,
    saved: () => <Favorites />,
    calendar: () => <Calendar />,
    messages: () => <Messages />,
    settings: () => <Settings />,
  });

  return (
    <SafeAreaProvider>
      <PaperProvider>
        <BottomNavigation
          navigationState={{ index, routes }}
          onIndexChange={setIndex}
          renderScene={renderScene}
        />
      </PaperProvider>
    </SafeAreaProvider>
  );
}

export default App;
