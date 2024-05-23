import * as React from 'react';
import {Appbar, useTheme} from 'react-native-paper';
import {MD3LightTheme as DefaultTheme} from 'react-native-paper';
import customScheme from '../assets/themes/customScheme.json';

const theme = {
  ...DefaultTheme,
  colors: {...customScheme.colors},
};

const AppHeader = () => (
  <Appbar.Header>
    <Appbar.BackAction onPress={() => {}} />
    <Appbar.Content title="" />
    <Appbar.Action icon="plus" onPress={() => {}} />
    <Appbar.Action icon="account-circle-outline" onPress={() => {}} />
    <Appbar.Action icon="cart-outline" onPress={() => {}} />
  </Appbar.Header>
);

export default AppHeader;
