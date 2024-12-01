import { StatusBar } from 'expo-status-bar';
import React, { useState,useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity , BackHandler,} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import auth from './Auth';
import { Video } from 'expo-av';
import { CommonActions } from '@react-navigation/native';
//import Video from 'react-native-video';

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const login = () => {
    navigation.navigate('Login');
  };

  useEffect(() => {
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

  const handleRegister = () => {
    if (!username || !password || !confirmpassword) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }

    if (password !== confirmpassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long.');
      return;
    }

    createUserWithEmailAndPassword(auth, username, password)
      .then((userCredential) => {
        Alert.alert('Success', 'User registered successfully!');
        navigation.navigate('Chatbot');
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Chatbot' }],
          })
        );
      })
      .catch((error) => {
        Alert.alert('Error', error.message);
      });
  };

  return (
    <View style={styles.container}>
       <StatusBar style='auto'/>
      {/* Background Video */}
      <Video
        source={require('../../assets/background.mp4')}
        style={StyleSheet.absoluteFillObject}
        shouldPlay
        isLooping
        resizeMode="cover"
      />

      {/* Overlay Content */}
      <View style={styles.overlay}>
        <Text style={styles.title}>Register</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#fff"
          value={username}
          onChangeText={setUsername}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            placeholderTextColor="#fff"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.toggleButton}>
            <Text style={styles.toggleText}>{showPassword ? 'Hide' : 'Show'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Confirm Password"
            placeholderTextColor="#fff"
            secureTextEntry={!showPassword}
            value={confirmpassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.toggleButton}>
            <Text style={styles.toggleText}>{showPassword ? 'Hide' : 'Show'}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.text}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={login}>
          <Text style={styles.login}>Already have an account? Login here</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    padding: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay for readability
  },
  title: {
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    color: '#fff',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    padding: 10,
    color: '#fff',
  },
  toggleButton: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#28a745',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
  },
  login: {
    color: 'white',
    fontWeight: 'bold',
    marginTop: 15,
    textAlign: 'center',
  },
});
