import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../src/screens/HomeScreen';
import SignInScreen from '../src/screens/SignInScreen';
import WelcomeScreen from '../src/screens/WelcomeScreen';
import SignUpScreen from '../src/screens/SignUpScreen';

const Stack = createNativeStackNavigator();

function AppNavigation() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Welcome">
                <Stack.Screen options={{ headerShown: false }} name="Welcome" component={WelcomeScreen} />
                <Stack.Screen options={{ headerShown: false, presentation: 'modal' }} name="SignIn" component={SignInScreen} />
                <Stack.Screen options={{ headerShown: false, presentation: 'modal' }} name="SignUp" component={SignUpScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default AppNavigation;
