import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignUpScreen from '../src/screens/_01SignUpScreen';
import LoginScreen from '../src/screens/_02LoginScreen';
import BottomTabNavigator from './BottomTabNavigator';

const Stack = createStackNavigator();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="SignUp">
                <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false}}/>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Home" component={BottomTabNavigator} options={{ headerShown: false}} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;