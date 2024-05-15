/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { Text } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider, BottomNavigation } from 'react-native-paper';

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
    main: () => <Text>Home</Text>,
    saved: () => <Text>Favorites</Text>,
    calendar: () => <Text>Calendar</Text>,
    messages: () => <Text>Chat</Text>,
    settings: () => <Text>Account</Text>,
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
