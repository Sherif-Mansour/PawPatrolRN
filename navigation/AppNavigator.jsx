/* eslint-disable prettier/prettier */
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import SplashScreen from './../src/screens/_00SplashScreen';
import SignInScreen from '../src/screens/_01SignInScreen';
import SignUpScreen from '../src/screens/_02SignUpScreen';
import Profile from '../src/screens/_08Profile';
import NotificationSettingsScreen from '../src/screens/_09NotificationSettingsScreen';
import PrivacySettingsScreen from '../src/screens/_10PrivacySettingsScreen';
import AppPreferencesScreen from '../src/screens/_11AppSettingsScreen';
import PaymentSettingsScreen from '../src/screens/_12PaymentSettingsScreen';
import BookingSettingsScreen from '../src/screens/_13BookingSettingsScreen';
import UserAdsScreen from '../src/screens/_16EditDeleteAd';
import AppHeader from '../components/Header';
import BottomTabNavigator from './BottomTabNavigator';
import LocationScreen from './../src/screens/_18LocationScreen';
import AdDetailsScreen from '../src/screens/_19AdDetailScreen';
import InquirySubmissionScreen from '../src/screens/_21InquirySubmissionScreen';
import Chat from '../src/screens/_06Chat';
import CreateChat from '../src/screens/_27CreateChat';
import IndividualChat from '../src/screens/_20IndividualChat';
import BookRequestScreen from '../src/screens/_23BookRequest';
import AccountSettings from './../src/screens/_22AccountSettings';
import Ad from '../src/screens/_15Ad';
import PendingAppointmentsScreen from '../src/screens/_24PendingApprovals';

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
          name="Profile"
          component={Profile}
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
          name="UserAds"
          component={UserAdsScreen}
          options={{header: () => <AppHeader showBackButton={true} />}}
        />
        <Stack.Screen
          name="Location"
          component={LocationScreen}
          options={{header: () => <AppHeader showBackButton={true} />}}
        />
        <Stack.Screen
          name="AdDetails"
          component={AdDetailsScreen}
          options={{header: () => <AppHeader showBackButton={true} />}}
        />
        <Stack.Screen
          name="InquirySubmission"
          component={InquirySubmissionScreen}
          options={{header: () => <AppHeader showBackButton={true} />}}
        />
        <Stack.Screen
          name="Chat"
          component={Chat}
          options={{header: () => <AppHeader showBackButton={true} />}}
        />
        <Stack.Screen
          name="CreateChat"
          component={CreateChat}
          options={{header: () => <AppHeader showBackButton={true} />}}
        />
        <Stack.Screen
          name="IndividualChat"
          component={IndividualChat}
          options={{header: () => <AppHeader showBackButton={true} />}}
        />
        <Stack.Screen
          name="Account"
          component={AccountSettings}
          options={{header: () => <AppHeader showBackButton={true} />}}
        />
        <Stack.Screen
          name="Ad"
          component={Ad}
          options={{header: () => <AppHeader showBackButton={true} />}}
        />
        <Stack.Screen
          name="BookRequest"
          component={BookRequestScreen}
          options={{header: () => <AppHeader showBackButton={true} />}}
        />
        <Stack.Screen
          name="PendingAppointments"
          component={PendingAppointmentsScreen}
          options={{header: () => <AppHeader showBackButton={true} />}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
