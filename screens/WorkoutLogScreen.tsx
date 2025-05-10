import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import Animated, { useAnimatedStyle, withRepeat, withTiming, useSharedValue } from 'react-native-reanimated';
import { db } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigation, NavigationProp, ParamListBase } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';

export default function WorkoutLogScreen() {
  const [workoutMode, setWorkoutMode] = useState('');
  const [workoutDuration, setWorkoutDuration] = useState('30'); // Default duration
  const [recoveryMethod, setRecoveryMethod] = useState('');
    const [user, setUser] = useState<any>(null);
    const AnimatedView = Animated.View;
    const circle1Anim = useSharedValue(0);
    const circle2Anim = useSharedValue(0);
    const circle3Anim = useSharedValue(0);
    const [error, setError] = useState('');
    const navigation = useNavigation<NavigationProp<ParamListBase>>();

    const goBackHome = () => {
        navigation.navigate('HomeScreen');
    };

  useEffect(() => {
    circle1Anim.value = withRepeat(withTiming(1, { duration: 4000 }), -1, false);
    circle2Anim.value = withRepeat(withTiming(1, { duration: 6000 }), -1, false);
    circle3Anim.value = withRepeat(withTiming(1, { duration: 5000 }), -1, false);
  }, []);

  const circle1Style = useAnimatedStyle(() => {
    return {
      opacity: circle1Anim.value,
      transform: [{
        translateY: circle1Anim.value * 20,
      }],
    };
  });

  const circle2Style = useAnimatedStyle(() => {
    return {
      opacity: circle2Anim.value,
      transform: [{
        translateX: circle2Anim.value * -20,
      }],
    };
  });

  const circle3Style = useAnimatedStyle(() => {
    return {
      opacity: circle3Anim.value,
      transform: [{
        translateY: circle3Anim.value * -20,
      }],
    };
  });


  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);


  const handleSubmit = async () => {
    if (!user) {
      setError('Please log in to save your workout log');
      return;
    }

    if (!workoutMode || !workoutDuration || !recoveryMethod ) {
      setError('Please fill in all fields');
      return;
    }

    if (isNaN(Number(workoutDuration))) {
      setError('Workout duration must be a number');
      return;
    }

    console.log('User object:', user); // Log the user object
    console.log('User UID:', user?.uid); // Log the user UID

    try {
      await addDoc(collection(db, 'workoutLogs'), {
        workoutMode,
        workoutDuration,
        recoveryMethod,
        userId: String(user.uid), // Explicitly cast user.uid to String
        timestamp: serverTimestamp(),
        date: new Date(),
      });
      console.log('User ID:', user.uid); // Added console.log for debugging
      alert('Workout Log Saved!');
      setWorkoutMode('');
      setWorkoutDuration('');
      setRecoveryMethod('');
      setError('');
    } catch (submitError: any) {
      console.error('Error saving workout log: ', submitError);
      setError('Error saving workout log: ' + submitError.message);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(getAuth());
      navigation.navigate('Authentication'); // Navigate to Authentication screen after sign out
    } catch (signOutError: any) {
      setError('Error signing out: ' + signOutError.message);
    }
  };


  return (
    <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          goBackHome();
        }}>
            <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Log Your Workout</Text>

      {user ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Workout Mode (e.g. Cardio)"
            value={workoutMode}
            onChangeText={setWorkoutMode}
            placeholderTextColor="#ccc"
          />
          <View style={styles.durationInputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Workout Duration"
              value={workoutDuration}
              onChangeText={setWorkoutDuration}
              placeholderTextColor="#ccc"
            keyboardType="number-pad"
            />
            <Text style={styles.minutesText}>minutes</Text>
          </View>
          <TextInput
              style={styles.input}
              placeholder="Recovery Method (e.g. Stretching)"
              value={recoveryMethod}
              onChangeText={setRecoveryMethod}
              placeholderTextColor="#ccc"
          />


          <TouchableOpacity onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            handleSubmit()
          }} style={[styles.button, styles.submitButton]}>
              <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
      </>
        ) : (
            <Text style={styles.loginMessage}>Please log in to submit a workout log.</Text>
      )}

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#040404',
    padding: 20,
    overflow: 'hidden', // Clip circles within container
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 30,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 179, 255, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    zIndex: 1, // Ensure title is above circles
  },
  input: {
    backgroundColor: '#181818', // Slightly darker input background
    color: '#ffffff',
    marginVertical: 10,
    padding: 18,
    borderRadius: 25, // Rounded input fields
    fontSize: 18,
    borderWidth: 0, // No border
    shadowColor: 'rgba(0, 179, 255, 0.3)', // Subtle shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 0, // For Android shadow
  },
  durationInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  minutesText: {
    color: '#ffffff',
    marginLeft: 10,
    fontSize: 18,
  },
  button: {
    backgroundColor: '#181818',
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 0,
    borderWidth: 0,
  },
  submitButton: {
    backgroundColor: '#007bff', // Keep submit button blue
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  errorText: {
    color: '#ff4d4d',
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
    zIndex: 1, // Ensure error text is above circles
  },
  loginMessage: {
    color: '#ffffff',
    marginBottom: 20,
    fontSize: 18,
    textAlign: 'center',
    zIndex: 1, // Ensure login message is above circles
  },
  circle: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(0, 179, 255, 0.3)', // Semi-transparent blue
  },
  circle1: {
    top: '20%',
    left: '20%',
  },
  circle2: {
    bottom: '10%',
    right: '30%',
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  circle3: {
    top: '40%',
    right: '10%',
    width: 120,
    height: 120,
    borderRadius: 60,
  },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        padding: 10,
    },
    backButtonText: {
        color: '#00b3ff',
        fontSize: 18,
    },
});
