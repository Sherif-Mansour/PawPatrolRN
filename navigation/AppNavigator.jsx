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
import UserAdsScreen from '../src/screens/_16EditDeleteAd';
import AppHeader from '../components/Header';
import AdminHeader from '../components/AdminHeader';
import BottomTabNavigator from './BottomTabNavigator';
import ViewProfileScreen from '../src/screens/_18ViewProfileScreen';
import AdDetailsScreen from '../src/screens/_19AdDetailScreen';
import InquirySubmissionScreen from '../src/screens/_21InquirySubmissionScreen';
import Chat from '../src/screens/_06Chat';
import CreateChat from '../src/screens/_27CreateChat';
import IndividualChat from '../src/screens/_20IndividualChat';
import BookRequestScreen from '../src/screens/_23BookRequest';
import AccountSettings from './../src/screens/_22AccountSettings';
import Ad from '../src/screens/_15Ad';
import PendingApprovals from '../src/screens/_24PendingApprovals';
import CalendarScreen from '../src/screens/_25CalendarScreen'; // Import the CalendarScreen
import BookingDetailsScreen from '../src/screens/_26BookingDetailsScreen'; // Import the BookingDetailsScreen
import ChatSettings from '../src/screens/_28ChatSettings';
import AdminSignInScreen from '../src/screens/_29AdminSignScreen';
import AdminDashboard from '../src/screens/_30AdminDashboard';
import AdminAdDetails from '../src/screens/_31AdminAdDetail';
import UserProfileScreen from '../src/screens/_32AdminUserProfileScreen';
import ReplyInquiryScreen from '../src/screens/_33ReplyInquiryScreen';
import FavoriteAdsScreen from '../src/screens/_34FavoritesAdScreen';


const Stack = createStackNavigator();

const AppNavigator = ({ setIsDarkTheme }) => {
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
          options={{ header: () => <AppHeader showBackButton={true} /> }}
        />
        <Stack.Screen
          name="AppPreferences"
          options={{ header: () => <AppHeader showBackButton={true} /> }}
        >
          {props => <AppPreferencesScreen {...props} setIsDarkTheme={setIsDarkTheme} />}
        </Stack.Screen>
        <Stack.Screen
          name="BookingSettings"
          component={BookingSettingsScreen}
          options={{ header: () => <AppHeader showBackButton={true} /> }}
        />
        <Stack.Screen
          name="UserAds"
          component={UserAdsScreen}
          options={{ header: () => <AppHeader showBackButton={true} /> }}
        />
        <Stack.Screen
          name="View Profile"
          component={ViewProfileScreen}
          options={{ header: () => <AppHeader showBackButton={true} /> }}
        />
        <Stack.Screen
          name="AdDetails"
          component={AdDetailsScreen}
          options={{ header: () => <AppHeader showBackButton={true} /> }}
        />
        <Stack.Screen
          name="InquirySubmission"
          component={InquirySubmissionScreen}
          options={{ header: () => <AppHeader showBackButton={true} /> }}
        />
        <Stack.Screen
          name="Chat"
          component={Chat}
          options={{ header: () => <AppHeader showBackButton={true} /> }}
        />
        <Stack.Screen
          name="CreateChat"
          component={CreateChat}
          options={{ header: () => <AppHeader showBackButton={true} /> }}
        />
        <Stack.Screen
          name="IndividualChat"
          component={IndividualChat}
          options={{ header: () => <AppHeader showBackButton={false} /> }}
        />
        <Stack.Screen
          name="Account"
          component={AccountSettings}
          options={{ header: () => <AppHeader showBackButton={true} /> }}
        />
        <Stack.Screen
          name="Ad"
          component={Ad}
          options={{ header: () => <AppHeader showBackButton={true} /> }}
        />
        <Stack.Screen
          name="BookRequest"
          component={BookRequestScreen}
          options={{ header: () => <AppHeader showBackButton={true} /> }}
        />
        <Stack.Screen
          name="PendingApprovals"
          component={PendingApprovals}
          options={{ header: () => <AppHeader showBackButton={true} /> }}
        />
        <Stack.Screen
          name="CalendarScreen"
          component={CalendarScreen}
          options={{ header: () => <AppHeader showBackButton={true} /> }}
        />
        <Stack.Screen
          name="BookingDetailsScreen"
          component={BookingDetailsScreen}
          options={{ header: () => <AppHeader showBackButton={true} /> }}
        />
        <Stack.Screen
          name="ChatSettings"
          component={ChatSettings}
          options={{ header: () => <AppHeader showBackButton={true} /> }}
        />
        <Stack.Screen
          name="AdminSignIn"
          component={AdminSignInScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AdminDashboard"
          component={AdminDashboard}
          options={{ header: () => <AdminHeader showBackButton={false} /> }}
        />
        <Stack.Screen
          name="AdminAdDetails"
          component={AdminAdDetails}
          options={{ header: () => <AppHeader showBackButton={true} /> }}
        />
        <Stack.Screen
          name="UserProfileScreen"
          component={UserProfileScreen}
          options={{ header: () => <AppHeader showBackButton={true} /> }}
        />
        <Stack.Screen
          name="ReplyInquiryScreen"
          component={ReplyInquiryScreen}
          options={{ header: () => <AppHeader showBackButton={true} /> }}
        />
        <Stack.Screen
          name="FavoriteAdsScreen"
          component={FavoriteAdsScreen}
          options={{ header: () => <AppHeader showBackButton={true} /> }}
        />

      </Stack.Navigator>

    </NavigationContainer>
  );
};

export default AppNavigator;
