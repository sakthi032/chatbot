import React from 'react';
import { enableScreens } from 'react-native-screens';

import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/screen/navigation/AppNavigator'; 
enableScreens();
export default function App() {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}
