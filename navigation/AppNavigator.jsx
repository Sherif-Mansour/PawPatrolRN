import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { createDrawerNavigator } from '@react-navigation/drawer';
import SignUpScreen from '../src/screens/_02SignUpScreen';
import LoginScreen from '../src/screens/_01LoginScreen';
import BottomTabNavigator from './BottomTabNavigator';
import SettingsScreen from '../src/screens/_07Settings';
import ProfileSettingsScreen from '../src/screens/_071ProfileScreen';


const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false}} />
                <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false}}/>
                <Stack.Screen name="Home" component={BottomTabNavigator} options={{ headerShown: false}} />
                <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false}} />
                <Stack.Screen name="ProfileSettings" component={ProfileSettingsScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;