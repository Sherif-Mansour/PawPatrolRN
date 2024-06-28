import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  BottomNavigation,
  MD3LightTheme as DefaultTheme,
} from 'react-native-paper';
import HomeScreen from '../src/screens/_03HomeScreen';
import Favorites from '../src/screens/_04FavoritesScreen';
import Ad from '../src/screens/_15Ad';
import BookingScreen from '../src/screens/_05BookingScreen';
import Chat from '../src/screens/_06Chat';
import customScheme from '../assets/themes/customScheme.json';
import {useUser} from '../utils/UserContext';

const theme = {
  ...DefaultTheme,
  colors: {...customScheme.colors},
};

const BottomTabNavigator = () => {
  const navigation = useNavigation();
  const {setCurrentAd} = useUser();
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
    {
      key: 'listing',
      title: 'Post',
      focusedIcon: 'plus-circle',
      unfocusedIcon: 'plus-circle-outline',
    },
    {
      key: 'booking',
      title: 'Bookings',
      focusedIcon: 'calendar-month',
    },
    {
      key: 'chat',
      title: 'Chat',
      focusedIcon: 'chat',
      unfocusedIcon: 'chat-outline',
    },
  ]);

  useEffect(() => {
    if (routes[index].key === 'listing') {
      setCurrentAd(null);
    }
  }, [index, routes, setCurrentAd]);

  const renderScene = ({route}) => {
    switch (route.key) {
      case 'home':
        return <HomeScreen navigation={navigation} />;
      case 'favorites':
        return <Favorites navigation={navigation} />;
      case 'listing':
        return <Ad navigation={navigation} />;
      case 'booking':
        return <BookingScreen navigation={navigation} />;
      case 'chat':
        return <Chat navigation={navigation} />;
      default:
        return null;
    }
  };

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
