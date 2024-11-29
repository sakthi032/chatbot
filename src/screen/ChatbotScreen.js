import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';

export default function ChatbotScreen({ navigation }) {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]); // Array to store messages
  const [first,setfirst]=useState("what can i help with?")
  const addMessage = () => {
    setfirst('')
    if (text.trim()) { // Only add non-empty messages
      setMessages([...messages, text]); // Add new message to the list
      setText(''); // Clear the input box
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.head}>
      <Text style={styles.title}>{first}</Text>
      </View>
      
      <ScrollView
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.map((message, index) => (
          <View key={index} style={styles.messageContainer}>
            <Text style={styles.message}>{message}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder='Type your message'
          style={styles.input}
          value={text}
          onChangeText={setText}
        />
        <TouchableOpacity style={styles.toggleButton} onPress={addMessage}>
          <Text style={styles.toggleText}>Go</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  messagesContainer: {
    flex: 1,
    width: '100%',
    marginBottom: 20,
  },
  messagesContent: {
    paddingBottom: 10,
    justifyContent: 'flex-end', // Messages should appear from the bottom
  },
  messageContainer: {
    alignSelf: 'flex-end', // Align message to the right
    marginBottom: 10,
  },
  message: {
    fontSize: 18,
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 15,
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 15,
    paddingLeft: 15,
    marginRight: 10,
  },
  toggleButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
  },
  toggleText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
