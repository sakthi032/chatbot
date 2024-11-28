import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../LoginScreen';
import ChatbotScreen from '../ChatbotScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
      <Stack.Screen name="Chatbot" component={ChatbotScreen} options={{ title: 'Chatbot' }} />
    </Stack.Navigator>
  );
}
