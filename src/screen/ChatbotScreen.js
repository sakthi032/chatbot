import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ChatbotScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Chatbot!</Text>
      {/* Chatbot UI goes here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
