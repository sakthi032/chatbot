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
      'Are you sure you want to exit?',
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
    backgroundColor: '#f1f1f1',
  },
  appBar: {
    backgroundColor: '#4CAF50',
    height: 70,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 250,
    height: '100%',
    backgroundColor: '#fff',
    paddingTop: 40,
    paddingLeft: 20,
  },
  drawerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  drawerItem: {
    marginBottom: 20,
  },
  drawerText: {
    fontSize: 18,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  logout: {
    marginRight: 10,
  },
  logouttext: {
    color: 'white',
    fontWeight: 'bold',
  },
  messagesContainer: {
    flex: 1,
    padding: 20,
    paddingBottom: 80,
  },
  messagesContent: {
    paddingBottom: 80,
  },
  messageContainer: {
    marginBottom: 15,
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%',
  },
  userMessage: {
    backgroundColor: '#4CAF50',
    alignSelf: 'flex-start',
  },
  aiMessage: {
    backgroundColor: '#e0e0e0',
    alignSelf: 'flex-end',
  },
  message: {
    fontSize: 16,
    color: 'white',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#f1f1f1',
    marginRight: 10,
  },
  toggleButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 20,
  },
  toggleText: {
    color: 'white',
  },
  newConversationButton: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 50,
    alignItems: 'center',
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  historyItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f1f1f1',
    borderRadius: 5,
  },
  closeModalButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  closeModalText: {
    color: 'white',
    textAlign: 'center',
  },
});
