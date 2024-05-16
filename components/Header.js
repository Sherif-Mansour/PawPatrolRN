import * as React from 'react';
import { Appbar, useTheme } from 'react-native-paper';
import { MD3LightTheme as DefaultTheme } from 'react-native-paper';
import customScheme from '../assets/themes/customScheme.json';

const theme = {
    ...DefaultTheme,
    colors: { ...customScheme.colors }
  }

const AppHeader = () => (
  <Appbar.Header>
    <Appbar.BackAction onPress={() => {}} />
    <Appbar.Content title="Title" />
    <Appbar.Action icon="calendar" onPress={() => {}} />
    <Appbar.Action icon="magnify" onPress={() => {}} />
  </Appbar.Header>
);

export default AppHeader;