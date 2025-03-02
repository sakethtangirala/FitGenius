import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { auth } from '../firebaseConfig';
import * as Haptics from 'expo-haptics';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigation, NavigationProp } from '@react-navigation/native';

type RootStackParamList = {
  Authentication: undefined;
  WorkoutLog: undefined;
  HomeScreen: undefined;
};

const AuthenticationScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleAuthentication = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Email and password are required.');
      return;
    }

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      navigation.navigate('HomeScreen');
    } catch (authError: any) {
      if (authError.code === 'auth/user-not-found') {
        Alert.alert('Authentication Failed', 'If this is your first time using this account, then register instead!');
      } else {
        Alert.alert('Authentication Failed', authError.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isLogin ? 'Login' : 'Register'}</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#e0e0e0"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#e0e0e0"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        handleAuthentication();
      }}>
        <Text style={styles.buttonText}>{isLogin ? 'Login' : 'Register'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.switchButton} onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setIsLogin(!isLogin)
      }}>
        <Text style={styles.switchButtonText}>
          {isLogin ? 'Register' : 'Login'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    color: '#ffffff',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#242424',
    color: '#ffffff',
    marginVertical: 10,
    padding: 15,
    borderRadius: 8,
    fontSize: 18,
  },
  button: {
    backgroundColor: '#00b3ff',
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 20,
    marginTop: 30,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 20,
    textAlign: 'center',
  },
  switchButton: {
    marginBottom: 20,
    alignItems: 'center',
  },
  switchButtonText: {
    color: '#bbbbbb',
    fontSize: 16,
  },
});

export default AuthenticationScreen;
