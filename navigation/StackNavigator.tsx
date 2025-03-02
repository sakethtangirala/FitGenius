import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import WorkoutLogScreen from '../screens/WorkoutLogScreen';
import DataScreen from '../screens/Data';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import AuthenticationScreen from '../screens/AuthenticationScreen';
import TitleScreen from '../screens/TitleScreen';

export type RootStackParamList = {
  Title: undefined;
  Authentication: undefined;
  WorkoutLog: undefined;
  HomeScreen: undefined;
  Data: undefined;
  Analytics: { workout: {
        id: string;
        date: string;
        workoutType: string;
        workoutMode: string;
        workoutDuration: string;
        recoveryMethod: string;
      } };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Title">
          <Stack.Screen
            name="Title"
            component={TitleScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Authentication"
            component={AuthenticationScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="WorkoutLog"
            component={WorkoutLogScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Data"
            component={DataScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Analytics"
            component={AnalyticsScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
