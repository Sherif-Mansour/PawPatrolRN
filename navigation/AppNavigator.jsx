/* eslint-disable prettier/prettier */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import SplashScreen from './../src/screens/_00SplashScreen';
import SignInScreen from '../src/screens/_01SignInScreen';
import SignUpScreen from '../src/screens/_02SignUpScreen';
import Profile from '../src/screens/_08Profile';
import NotificationSettingsScreen from '../src/screens/_09NotificationSettingsScreen';
import PrivacySettingsScreen from '../src/screens/_10PrivacySettingsScreen';
import AppPreferencesScreen from '../src/screens/_11AppSettingsScreen';
import PaymentSettingsScreen from '../src/screens/_12PaymentSettingsScreen';
import BookingSettingsScreen from '../src/screens/_13BookingSettingsScreen';
import Ad from '../src/screens/_15Ad';
import UserAdsScreen from '../src/screens/_16UserAdsScreen';
import AppHeader from '../components/Header';
import BottomTabNavigator from './BottomTabNavigator';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen">
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignIn"
          component={SignInScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={BottomTabNavigator}
          options={{ header: () => <AppHeader showBackButton={false} /> }}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{ header: () => <AppHeader showBackButton={true} /> }}
        />
        <Stack.Screen
          name="NotificationSettings"
          component={NotificationSettingsScreen}
          options={{ header: () => <AppHeader showBackButton={true} /> }}
        />
        <Stack.Screen
          name="PrivacySettings"
          component={PrivacySettingsScreen}
          options={{ header: () => <AppHeader showBackButton={true} /> }}
        />
        <Stack.Screen
          name="PaymentSettings"
          component={PaymentSettingsScreen}
          options={{header: () => <AppHeader showBackButton={true} />}}
        />
        <Stack.Screen
          name="AppPreferences"
          component={AppPreferencesScreen}
          options={{header: () => <AppHeader showBackButton={true} />}}
        />
        <Stack.Screen
          name="BookingSettings"
          component={BookingSettingsScreen}
          options={{header: () => <AppHeader showBackButton={true} />}}
        />
        <Stack.Screen
          name="Ad"
          component={Ad}
          options={{ header: () => <AppHeader showBackButton={true} /> }}
        />
        <Stack.Screen
          name="UserAds"
          component={UserAdsScreen}
          options={{ header: () => <AppHeader showBackButton={true} /> }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
