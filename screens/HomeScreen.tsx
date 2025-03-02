import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/StackNavigator';
import { NavigationProp } from '@react-navigation/native';
import { auth } from '../firebaseConfig';
import Animated, { useAnimatedStyle, withRepeat, withTiming, useSharedValue } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

type HomeScreenNavigationProp = NavigationProp<RootStackParamList, 'HomeScreen'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [displayName, setDisplayName] = useState<string | null>(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (user && user.email) {
      const firstName = user.email.split('@')[0];
      setDisplayName(firstName);
    }
  }, []);

  const AnimatedView = Animated.View;

  const circle1Anim = useSharedValue(0);
  const circle2Anim = useSharedValue(0);
  const circle3Anim = useSharedValue(0);

  useEffect(() => {
    circle1Anim.value = withRepeat(withTiming(1, { duration: 4000 }), -1, false);
    circle2Anim.value = withRepeat(withTiming(1, { duration: 6000 }), -1, false);
    circle3Anim.value = withRepeat(withTiming(1, { duration: 5000 }), -1, false);
  }, []);

  const circle1Style = useAnimatedStyle(() => {
    return {
      transform: [{
        translateX: circle1Anim.value * 20 - 10,
      }, {
        translateY: circle1Anim.value * 10 - 5 }]
    };
  });

  const circle2Style = useAnimatedStyle(() => {
    return {
      transform: [{
        translateX: circle2Anim.value * -15 + 7.5,
      }, {
        translateY: circle2Anim.value * 5 - 2.5 }],
      opacity: 0.6 + circle2Anim.value * 0.4,
    };
  });

  const circle3Style = useAnimatedStyle(() => {
    return {
      transform: [{
        translateX: circle3Anim.value * 10 - 5,
      }, {
        translateY: circle3Anim.value * -20 + 10 }]
    };
  });


  return (
    <View style={styles.container}>
       <AnimatedView style={[styles.circle, styles.circle1, circle1Style]} />
        <AnimatedView style={[styles.circle, styles.circle2, circle2Style]} />
        <AnimatedView style={[styles.circle, styles.circle3, circle3Style]} />

      <Text style={styles.title}>Dashboard</Text>
      {displayName && <Text style={styles.welcomeMessage}>Hello, {displayName}</Text>}

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          navigation.navigate('WorkoutLog')
        }}>
          <Text style={styles.buttonText}>Log Workout</Text>
          <Text style={styles.buttonDescription}>Log your exercises</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          navigation.navigate('Data')
        }}>
          <Text style={styles.buttonText}>View Workout Data</Text>
          <Text style={styles.buttonDescription}>Track workout history</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          navigation.navigate('Authentication')
        }}>
          <Text style={styles.buttonText}>Sign Out</Text>
          <Text style={styles.buttonDescription}>Exit the app</Text>
        </TouchableOpacity>
      </View>
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
  welcomeMessage: {
    fontSize: 20,
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
    opacity: 0.6,
    zIndex: 1, // Ensure welcome message is above circles
  },
  buttonsContainer: {
    width: '90%',
    maxWidth: 400,
    zIndex: 1, // Ensure buttons are above circles
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
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  buttonDescription: {
    fontSize: 13,
    color: '#b0b0b0',
    textAlign: 'center',
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
});
