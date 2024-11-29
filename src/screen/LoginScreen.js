import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import auth from './Auth';
import RegisterScreen from './RegisterScreen';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // For toggling password visibility
  const [errorMessage, setErrorMessage] = useState('');

  const register=()=>{
    navigation.navigate('Register')
  };

  const handleLogin = async () => {
    try {
      setErrorMessage('')
      await signInWithEmailAndPassword(auth, username, password);
      Alert.alert('Success', 'Logged in successfully');
      navigation.navigate('Chatbot')
    } catch (error) {
      switch (error.code) {
        case 'auth/wrong-password':
          setErrorMessage('Incorrect password. Please try again.');
          break;
        case 'auth/user-not-found':
          setErrorMessage('No user found with this email.');
          break;
        case 'auth/invalid-email':
          setErrorMessage('Invalid email format. Please enter a valid email.');
          break;
        case 'auth/too-many-requests':
          setErrorMessage('Too many attempts. Please try again later.');
          break;
        default:
          setErrorMessage('An unexpected error occurred. Please try again.');
      }
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          secureTextEntry={!showPassword} 
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.toggleButton}>
          <Text style={styles.toggleText}>{showPassword ? 'Hide' : 'Show'}</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.text}>Login</Text>
      </TouchableOpacity>
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : ""}
      <TouchableOpacity >
      <Text style={styles.login} onPress={register}>Don't have an account? Register here
       </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 25,
    backgroundColor: '#00ffff',
  },
  title: {
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 2,
    color: '#00ffff',
    backgroundColor: '#ee5f5f',
    borderColor: '#2cfcfc',
    borderRadius: 10,
    padding: 9,
    marginBottom: 15,
    marginLeft: 15,
    marginRight: 15,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    backgroundColor: '#ee5f5f',
    borderColor: '#2cfcfc',
    borderRadius: 10,
    marginBottom: 15,
    marginLeft: 15,
    marginRight: 15,
  },
  passwordInput: {
    flex: 1,
    padding: 9,
    color: '#00ffff',
  },
  toggleButton: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleText: {
    color: '#00ffff',
    fontWeight: 'bold',
  },
  button: {
    borderWidth: 2,
    backgroundColor: '#ee5f5f',
    borderColor: '#2cfcfc',
    borderRadius: 10,
    padding: 15,
    marginLeft: 150,
    marginRight: 150,
    display:'inline',
  },
  text: {
    color: '#00ffff',
    fontWeight: 'bold',
    textAlign: 'center',
    display:'inline',
  },
  login: {
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
    display:'inline',
  },
  errorText: {
    color: 'red',
    fontWeight: 'bold',
    marginBottom:10,
    textAlign: 'center',
    marginTop: 10,
  },

});
