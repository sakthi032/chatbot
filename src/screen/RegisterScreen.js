import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import auth from './Auth';

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setconfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // For toggling password visibility

  const handleRegister = () => {
    password === confirmpassword
      ? createUserWithEmailAndPassword(auth, username, password)
          .then((userCredential) => {
            const user = userCredential.user;
            Alert.alert('Success', 'User registered successfully!');
            navigation.navigate('NextScreen'); // Replace 'NextScreen' with your actual next screen name
          })
          .catch((error) => {
            Alert.alert('Error', error.message);
          })
      : Alert.alert('Error', 'Passwords do not match. Please try again.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
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
          secureTextEntry={!showPassword} // Toggle secureTextEntry based on showPassword
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
          secureTextEntry={!showPassword} // Toggle secureTextEntry based on showPassword
          value={confirmpassword}
          onChangeText={setconfirmPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.toggleButton}>
          <Text style={styles.toggleText}>{showPassword ? 'Hide' : 'Show'}</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.text}>Register</Text>
      </TouchableOpacity>
      <Text style={styles.login}>Already have an account? Login here</Text>
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
  },
  text: {
    color: '#00ffff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  login: {
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
});
