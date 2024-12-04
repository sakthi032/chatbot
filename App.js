import React from 'react';
import { enableScreens } from 'react-native-screens';
import { useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/screen/navigation/AppNavigator'; 
import ChatbotScreen from './src/screen/ChatbotScreen';
export default function App() {
 
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
    
  );
}
