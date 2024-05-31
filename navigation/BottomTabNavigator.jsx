/* eslint-disable prettier/prettier */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  BottomNavigation,
  MD3LightTheme as DefaultTheme,
} from 'react-native-paper';
import HomeScreen from '../src/screens/_03HomeScreen';
import Favorites from '../src/screens/_04FavoritesScreen';
import BookingScreen from '../src/screens/_05BookingScreen';
import Messages from '../src/screens/_06Messages';
import Settings from '../src/screens/_07Settings';
import customScheme from '../assets/themes/customScheme.json';

// https://callstack.github.io/react-native-paper/docs/guides/theming

const theme = {
  ...DefaultTheme,
  colors: {...customScheme.colors},
};

// https://youtu.be/Cr5eXyr6CJ4?list=LL "Introduction to React Native and React Native Paper" 36:03
// https://callstack.github.io/react-native-paper/docs/components/BottomNavigation/ "React Native Paper - Bottom Navigation"

const BottomTabNavigator = () => {
  const navigation = useNavigation();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {
      key: 'home',
      title: 'Home',
      focusedIcon: 'home-circle',
      unfocusedIcon: 'home-circle-outline',
    },
    {
      key: 'favorites',
      title: 'Favorites',
      focusedIcon: 'heart',
      unfocusedIcon: 'heart-outline',
    },
    {key: 'booking', title: 'Booking', focusedIcon: 'calendar-month'},
    {
      key: 'messages',
      title: 'Messages',
      focusedIcon: 'chat',
      unfocusedIcon: 'chat-outline',
    },
    {
      key: 'settings',
      title: 'Settings',
      focusedIcon: 'account-circle',
      unfocusedIcon: 'account-circle-outline',
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: () => <HomeScreen navigation={navigation} />,
    favorites: () => <Favorites navigation={navigation} />,
    booking: () => <BookingScreen navigation={navigation} />,
    messages: () => <Messages navigation={navigation} />,
    settings: () => <Settings navigation={navigation} />,
  });

  return (
    <BottomNavigation
      navigationState={{index, routes}}
      onIndexChange={setIndex}
      renderScene={renderScene}
      barStyle={{backgroundColor: theme.colors.primary}}
      activeColor={theme.colors.onPrimary}
      inactiveColor={theme.colors.onPrimary}
    />
  );
};

export default BottomTabNavigator;
