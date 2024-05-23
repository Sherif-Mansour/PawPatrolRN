import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigator from './BottomTabNavigator';
import SignUpScreen from '../src/screens/_02SignUpScreen';
import SignInScreen from '../src/screens/_01SignInScreen';
import Profile from '../src/screens/_08Profile';

const Stack = createStackNavigator();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="SignIn">
                <Stack.Screen name="SignIn" component={SignInScreen} options={{ headerShown: false}} />
                <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false}}/>
                <Stack.Screen name="Home" component={BottomTabNavigator} options={{ headerShown: false}} />
                <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false}} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;