import React, { useState, useEffect } from 'react';
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
  SafeAreaView,
  StatusBar,
  Pressable,
  BackHandler,
  Modal,
  FlatList,
} from 'react-native';
import { AppBar, IconButton } from '@react-native-material/core';
import { Ionicons } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { CommonActions } from '@react-navigation/native';
import auth from './Auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ChatbotScreen({ navigation }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerTranslateX = useState(new Animated.Value(-250))[0];
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [first, setFirst] = useState('What can I help with?');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  useEffect(() => {
    const loadConversationHistory = async () => {
      try {
        const history = await AsyncStorage.getItem('conversationHistory');
        if (history) {
          setConversationHistory(JSON.parse(history));
        }
      } catch (error) {
        console.error('Error loading conversation history:', error);
      }
    };

    loadConversationHistory();

    const handleBackPress = () => {
      Alert.alert(
        'Exit App',
        'Are you sure you want to exit?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'OK', onPress: () => BackHandler.exitApp() },
        ],
        { cancelable: false }
      );
      return true;
    };

    BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, []);

  const toggleDrawer = () => {
    if (drawerOpen) {
      Animated.timing(drawerTranslateX, {
        toValue: -250,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start(() => setDrawerOpen(false));
    } else {
      Animated.timing(drawerTranslateX, {
        toValue: 0,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start(() => setDrawerOpen(true));
    }
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
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    Alert.alert(
      'Confirm Exit',
      'Are you sure you want to Logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => setIsLoggingOut(false),
        },
        {
          text: 'OK',
          onPress: () => {
            signOut(auth)
              .then(() => {
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                  })
                );
              })
              .catch((error) => {
                console.error('Sign out error:', error);
              })
              .finally(() => setIsLoggingOut(false));
          },
        },
      ],
      { cancelable: false }
    );
  };

  const addMessage = async () => {
    setFirst('');
    if (text.trim()) {
      const userMessage = { text, sender: 'user' };
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setText('');

      try {
        await AsyncStorage.setItem('conversationHistory', JSON.stringify(newMessages));
      } catch (error) {
        console.error('Error saving conversation history:', error);
      }

      setTimeout(() => {
        const aiResponse = { text: 'This is the AI response.', sender: 'ai' };
        const updatedMessages = [...newMessages, aiResponse];
        setMessages(updatedMessages);
        try {
          AsyncStorage.setItem('conversationHistory', JSON.stringify(updatedMessages));
        } catch (error) {
          console.error('Error saving conversation history:', error);
        }
      }, 1000);
    }
  };

  const openHistoryModal = async () => {
    try {
      const history = await AsyncStorage.getItem('conversationHistory');
      if (history) {
        setConversationHistory(JSON.parse(history));
        setShowHistoryModal(true);
      }
    } catch (error) {
      console.error('Error loading conversation history:', error);
    }
  };

  const closeHistoryModal = () => {
    setShowHistoryModal(false);
  };

  const startNewConversation = async () => {
    setMessages([]);
    setFirst('What can I help with?');
    try {
      await AsyncStorage.removeItem('conversationHistory');
    } catch (error) {
      console.error('Error clearing conversation history:', error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor="#4CAF50" translucent={false} />

      <View style={styles.container}>
        {drawerOpen && <Pressable style={styles.overlay} onPress={closeDrawer} />}
        <Animated.View
          style={[styles.drawer, { transform: [{ translateX: drawerTranslateX }] }]}
        >
          <Text style={styles.drawerTitle}>Menu</Text>
          <TouchableOpacity style={styles.drawerItem} onPress={startNewConversation}>
            <Text style={styles.drawerText}>Start New Conversation</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.drawerItem} onPress={openHistoryModal}>
            <Text style={styles.drawerText}>Conversation History</Text>
          </TouchableOpacity>
        </Animated.View>

        <AppBar
          title="LearnBot"
          style={styles.appBar}
          titleStyle={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}
          leading={(props) => (
            <IconButton
              icon={<Ionicons name="menu" size={30} color="white" />}
              onPress={toggleDrawer}
            />
          )}
          trailing={(props) => (
            <TouchableOpacity onPress={login} style={styles.logout}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          )}
        />

        <ScrollView style={styles.messagesContainer} contentContainerStyle={styles.messagesContent}>
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
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
    backgroundColor: '#ffffff',
    zIndex: 2, // Ensure it's above main content
    elevation: 5, // Shadow for Android
  },
  drawerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  drawerItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  drawerText: {
    fontSize: 16,
    color: '#333',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark transparent overlay
    zIndex: 1, // Ensure it's below the drawer but above the main content
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
    marginBottom: 60, // Leave space for input container
  },
  messagesContent: {
    paddingTop: 16,
    paddingBottom: 60,
  },
  messageContainer: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#E8E8E8',
  },
  message: {
    fontSize: 16,
  },
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    padding: 8,
    zIndex: 3, // Ensures it's always above the main content
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  toggleButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    marginLeft: 8,
    borderRadius: 8,
  },
  toggleText: {
    color: 'white',
    fontWeight: 'bold',
  },
  head: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  logout: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  logoutText: {
    fontSize: 16,
    color: 'white',
  },
});