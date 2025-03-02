import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/StackNavigator';
import { StackScreenProps } from '@react-navigation/stack';
import { useState, useEffect } from 'react';
import ReactNativeHapticFeedback from 'react-native-haptics';
import axios from 'axios';
import { geminiApiKey } from '../firebaseConfig'; // Import API Key

type AnalyticsScreenProps = StackScreenProps<RootStackParamList, 'Analytics'>;

const AnalyticsScreen: React.FC<AnalyticsScreenProps> = ({ route }) => {
  const { workout } = route.params;
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [aiFeedback, setAiFeedback] = useState<string>('Loading AI Feedback...');

    const goBackData = () => {
        navigation.navigate('Data');
    };

    const getAiFeedback = async (workoutData: any) => {
        const apiKey = geminiApiKey; // User provided API Key, now from config
        console.log("Gemini API Key:", apiKey); // Log API Key
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`; // Gemini API endpoint, using gemini-2.0-flash model
        console.log("API URL:", apiUrl); // Log API URL

        try {
            const response = await axios.post(apiUrl, {
                contents: [{
                    parts: [{
                        text: `Provide workout feedback based on the following data: Date: ${workoutData.date}, Mode: ${workoutData.workoutMode}, Duration: ${workoutData.workoutDuration} minutes, Recovery: ${workoutData.recoveryMethod}. Be concise and encouraging.`
                    }]
                }]
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.data && response.data.candidates && response.data.candidates[0].content.parts[0].text) {
            if (response.data && response.data.candidates && response.data.candidates[0].content.parts[0].text) {
                const feedbackContent = response.data.candidates[0].content.parts[0].text.trim();
                return feedbackContent || 'No feedback received from AI.';
            } else {
                console.error("Unexpected response structure:", response.data);
                return 'Failed to get AI feedback due to unexpected response. Check console for details.';
            }
            } else {
                console.error("Unexpected response structure:", response.data);
                return 'Failed to get AI feedback due to unexpected response. Check console for details.';
            }
        } catch (error: any) {
            console.error("Error fetching AI feedback:", error, error.response);
            let errorMessage = "Error fetching AI feedback. Request failed. Please check your network connection and Gemini API key. See console for more details.";
            if (error.response) {
                errorMessage = `AI feedback failed. Status ${error.response.status}, Data: ${JSON.stringify(error.response.data)}. Please ensure your Gemini API key is correctly set in firebaseConfig.ts and your network connection is stable.`;
                console.error("API Response Status:", error.response.status);
                console.error("API Response Data:", error.response.data);
            }
            return errorMessage;
        }
    };

    useEffect(() => {
        const fetchFeedback = async () => {
            const feedback = await getAiFeedback(workout);
            setAiFeedback(feedback as string);
        };

        fetchFeedback();
    }, [workout]);


  return (
    <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={goBackData}>
            <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      <Text style={styles.title}>Workout Analytics</Text>
      <View style={styles.workoutDetails}>
        <Text style={styles.detailText}>Date: {workout.date}</Text>
        <Text style={styles.detailText}>Mode: {workout.workoutMode}</Text>
        <Text style={styles.detailText}>Duration: {workout.workoutDuration} minutes</Text>
        <Text style={styles.detailText}>Recovery: {workout.recoveryMethod}</Text>
      </View>
      <View style={styles.aiFeedback}>
        <Text style={styles.feedbackTitle}>AI Feedback</Text>
        <ScrollView style={{ maxHeight: 200 }}>
        <Text style={styles.feedbackText}>
          {aiFeedback.split('\n').map((line, index) => {
            const parts = line.split(/\*\*([^*]+)\*\*/);
            return (
              <Text key={index}>
                {parts.map((part, partIndex) => {
                  if (partIndex % 2 === 1) {
                    return <Text style={{ fontWeight: 'bold' }} key={partIndex}>{part}</Text>;
                  } else {
                    return part;
                  }
                })}
                {index < aiFeedback.split('\n').length - 1 ? '\n' : ''}
              </Text>
            );
          })}
        </Text>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
    marginTop: '40%',
  },
  detailText: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 8,
  },
  workoutDetails: { // Added workoutDetails style
    backgroundColor: '#242424',
    padding: 15,
    borderRadius: 8,
    width: '90%',
    marginTop: '10%',
    alignItems: 'center',
  },
  aiFeedback: {
    backgroundColor: '#242424',
    padding: 15,
    borderRadius: 8,
    width: '90%',
    marginTop: '10%',
    alignItems: 'center',
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  feedbackText: {
    fontSize: 16,
    color: '#bbbbbb',
    textAlign: 'center',
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

export default AnalyticsScreen;
