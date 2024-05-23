import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { createDrawerNavigator } from '@react-navigation/drawer';
import SignUpScreen from '../src/screens/_02SignUpScreen';
import LoginScreen from '../src/screens/_01LoginScreen';
import BottomTabNavigator from './BottomTabNavigator';
import SettingsScreen from '../src/screens/_07Settings';
import ProfileSettingsScreen from '../src/screens/_071ProfileScreen';
import NotificationSettingsScreen from '../src/screens/_072NotificationScreen';
import PrivacySettingsScreen from '../src/screens/_073PrivacyScreen';
import AppHeader from '../components/Header';


const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false}} />
                <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false}}/>
                <Stack.Screen name="Home" component={BottomTabNavigator} options={{ header: () => <AppHeader /> }} />
                <Stack.Screen name="Settings" component={SettingsScreen} options={{  header: () => <AppHeader /> }} />
                <Stack.Screen name="ProfileSettings" component={ProfileSettingsScreen} />
                <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
                <Stack.Screen name="PrivacySettings" component={PrivacySettingsScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;