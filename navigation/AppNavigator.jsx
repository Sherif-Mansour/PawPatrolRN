/* eslint-disable prettier/prettier */
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import SignUpScreen from '../src/screens/_02SignUpScreen';
import SignInScreen from '../src/screens/_01SignInScreen';
import BottomTabNavigator from './BottomTabNavigator';
import SettingsScreen from '../src/screens/_07Settings';
import ProfileSettingsScreen from '../src/screens/_08ProfileScreen';
import NotificationSettingsScreen from '../src/screens/_09NotificationScreen';
import PrivacySettingsScreen from '../src/screens/_10PrivacyScreen';
import SplashScreen from './../src/screens/_00SplashScreen';
import AppHeader from '../components/Header';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen">
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SignIn"
          component={SignInScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Home"
          component={BottomTabNavigator}
          options={{header: () => <AppHeader showBackButton={false} />}}
        />
        <Stack.Screen
          name="ProfileSettings"
          component={ProfileSettingsScreen}
          options={{header: () => <AppHeader showBackButton={true} />}}
        />
        <Stack.Screen
          name="NotificationSettings"
          component={NotificationSettingsScreen}
          options={{header: () => <AppHeader showBackButton={true} />}}
        />
        <Stack.Screen
          name="PrivacySettings"
          component={PrivacySettingsScreen}
          options={{header: () => <AppHeader showBackButton={true} />}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
