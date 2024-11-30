import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Animated,
  Easing,
} from 'react-native';
import { AppBar, IconButton, Button } from '@react-native-material/core';
import { Ionicons } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import auth from './Auth';

export default function ChatbotScreen({ navigation }) {
  const [drawerOpen, setDrawerOpen] = useState(false); // State to manage drawer visibility
  const drawerTranslateX = useState(new Animated.Value(-250))[0]; // Drawer sliding animation
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [first, setFirst] = useState('What can I help with?');

  const openDrawer = () => {
    Animated.timing(drawerTranslateX, {
      toValue: 0,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    Animated.timing(drawerTranslateX, {
      toValue: -250,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
    setDrawerOpen(false);
  };

  const login = () => {
    Alert.alert(
      "Confirm Exit",
      "Are you sure you want to exit?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            navigation.navigate('Login')
          signOut(auth)
          },
        },
      ],
      { cancelable: false }
    );
  };

  const addMessage = () => {
    setFirst('');
    if (text.trim()) {
      setMessages([...messages, { text, sender: 'user' }]);
      setText('');
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: 'This is the AI response.', sender: 'ai' },
        ]);
      }, 1000);
    }
  };

  return (
    <View style={styles.container}>
      {/* Drawer */}
      <Animated.View
        style={[styles.drawer, { transform: [{ translateX: drawerTranslateX }] }]}
      >
        <Text style={styles.drawerTitle}>Menu</Text>
        <TouchableOpacity style={styles.drawerItem} onPress={() => Alert.alert('Home Pressed')}>
          <Text style={styles.drawerText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.drawerItem} onPress={() => Alert.alert('Settings Pressed')}>
          <Text style={styles.drawerText}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.drawerItem} onPress={closeDrawer}>
          <Text style={styles.drawerText}>Close Drawer</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* AppBar */}
      <AppBar
        title="Chatapp"
        style={styles.appBar}
        titleStyle={{ color: 'white', fontWeight: 'bold' }}
        leading={(props) => (
          <IconButton
            icon={<Ionicons name="menu" size={30} color="white" />}
            onPress={openDrawer}
          />
        )}
        trailing={(props) => (
          <Button title="Logout" onPress={login} style={{ color: 'white' }} />
        )}
      />

      {/* Chat Content */}
      <ScrollView
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
      >
        <View style={styles.head}>
          <Text style={styles.title}>{first}</Text>
        </View>
        {messages.map((message, index) => (
          <View
            key={index}
            style={[
              styles.messageContainer,
              message.sender === 'user' ? styles.userMessage : styles.aiMessage,
            ]}
          >
            <Text style={styles.message}>{message.text}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Type your message"
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
    backgroundColor: '#f0f0f0',
  },
  appBar: {
    backgroundColor: '#4CAF50',
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 250,
    backgroundColor: '#fff',
    padding: 20,
    zIndex: 2,
    elevation: 5,
  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  drawerItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  drawerText: {
    fontSize: 18,
  },
  head: {
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
  },
  messagesContainer: {
    flex: 1,
    width: '100%',
  },
  messagesContent: {
    paddingBottom: 10,
    justifyContent: 'flex-end',
  },
  messageContainer: {
    marginBottom: 10,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#a2f5a2',
    borderRadius: 15,
    padding: 5,
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#e0e0e0',
    borderRadius: 15,
    padding: 5,
  },
  message: {
    fontSize: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 10,
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
