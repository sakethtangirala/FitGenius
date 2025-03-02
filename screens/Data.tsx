import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptics';
import { db, auth } from '../firebaseConfig';
import { collection, query, where, getDocs, DocumentData } from 'firebase/firestore';

interface Workout {
  id: string;
  date: string;
  workoutType: string;
  workoutMode: string;
  workoutDuration: string;
  recoveryMethod: string;
}

import { useNavigation, NavigationProp } from '@react-navigation/native';

import { RootStackParamList } from '../navigation/StackNavigator';

export default function DataScreen() {
  const [workoutData, setWorkoutData] = useState<Workout[] | null>(null); // Initialize as null to indicate loading state
  const user = auth.currentUser;
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const goBackHome = () => {
        navigation.navigate('HomeScreen');
    };

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        const workoutCollection = collection(db, 'workoutLogs'); // Corrected collection name to 'workoutLogs'
        const userWorkoutsQuery = query(workoutCollection, where('userId', '==', user.uid));

        try {
          const querySnapshot = await getDocs(userWorkoutsQuery);
          const workouts: Workout[] = querySnapshot.docs.map(doc => {
            const data = doc.data() as DocumentData;
            let dateString = 'No Date';
            if (data.date) {
              if (data.date instanceof Date) {
                dateString = data.date.toLocaleDateString();
              } else if (typeof data.date.toDate === 'function') {
                try {
                  dateString = data.date.toDate().toLocaleDateString();
                } catch (e) {
                  console.error("Error formatting date:", e);
                  dateString = String(data.date);
                }
              } else {
                try {
                  dateString = new Date(data.date).toLocaleDateString();
                } catch (e) {
                  console.error("Error parsing date:", e);
                  dateString = 'No Date';
                }
              }
            } else {
              dateString = 'No Date';
            }
            return {
              id: doc.id,
              date: dateString,
              workoutType: data.workoutType || 'No Type',
              workoutMode: data.workoutMode || '',
              workoutDuration: data.workoutDuration || '',
              recoveryMethod: data.recoveryMethod || '',
            } as Workout;
          });
          setWorkoutData(workouts);
        } catch (error) {
          console.error("Error fetching workout data:", error);
          setWorkoutData([]);
        }
      };

      fetchData();
    } else {
      setWorkoutData([]); // Set to empty array if no user is logged in
    }
  }, [user]);

  if (workoutData === null) {
    return <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#007bff" /></View>; // Loading indicator
  }


  return (
    <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={goBackHome}>
            <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      <Text style={styles.title}>Workout Data</Text>
      <ScrollView contentContainerStyle={[styles.scrollContentContainer, { justifyContent: 'center', flexGrow: 1 }]}>
      {user ? (
        workoutData.length > 0 ? (
          workoutData.map(workout => (
            <TouchableOpacity key={workout.id} style={styles.workoutItem} onPress={() => navigation.navigate('Analytics', { workout: workout })}>
              <Text style={styles.workoutText}>Date: {workout.date ? (typeof workout.date === 'object' && 'toDate' in workout.date ? (workout.date as any).toDate().toLocaleDateString() : String(workout.date)) : 'No Date'}</Text>
              <Text style={styles.workoutText}>Mode: {workout.workoutMode}</Text>
              <Text style={styles.workoutText}>Duration: {workout.workoutDuration} minutes</Text>
              <Text style={styles.workoutText}>Recovery: {workout.recoveryMethod}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noDataText}>No workout data available. Log workouts to see data here.</Text>
        )
      ) : (
        <Text style={styles.loginMessage}>Please sign in to view your workout data.</Text>
      )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212', // Dark background for loading
  },
  container: {
    flex: 1,
    backgroundColor: '#000000', // Black background
    alignItems: 'center',
    justifyContent: 'flex-start', // Align items at the top
  },
  title: {
    fontSize: 38,
    fontWeight: 'bold',
    marginTop: '40%',
    marginBottom: 0,
    color: '#ffffff', // White title text
    textAlign: 'center', // Center title
  },
  workoutItem: {
    backgroundColor: '#242424', // Darker item background
    padding: 15,
    borderRadius: 8,
    marginBottom: 50,
    width: '130%',
    alignSelf: 'center', // Center workout items
  },
  workoutText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#ffffff', // White workout text
    alignSelf: 'center',
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
    noDataText: {
        color: '#bbbbbb',
        fontSize: 16,
        marginTop: 20,
        textAlign: 'center',
    },
    loginMessage: {
        color: '#bbbbbb',
        fontSize: 16,
        textAlign: 'center',
    },
    scrollContentContainer: {
        paddingVertical: 20,
        marginTop: '10%',
        alignItems: 'center', // Center content horizontally within ScrollView
        justifyContent: 'flex-start', // Align items to the top
    },
});
