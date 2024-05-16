import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {ScreenProvider} from './_contexts/ScreenContext';
import SignInScreen from './src/signin';
import SignUpScreen from './src/signup';





export default function App() {
  return (
    <ScreenProvider>
      <NavigationContainer>

        <SignInScreen />
        <SignUpScreen />


      </NavigationContainer>
    </ScreenProvider>
  );
}