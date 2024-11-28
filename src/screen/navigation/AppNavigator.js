import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import RegisterScreen from '../RegisterScreen';
import ChatbotScreen from '../ChatbotScreen';
import LoginScreen from '../LoginScreen'

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'new account' }} />
      <Stack.Screen name="Chatbot" component={ChatbotScreen} options={{ title: 'Chatbot' }} />
    </Stack.Navigator>
  );
}
