import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

import { RootStackParamList } from '../navigation/StackNavigator';

const TitleScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const animation = React.useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(animation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    }, [animation]);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
navigation.navigate('HomeScreen'); // Navigate to Home if user is logged in
            }
        });
        return unsubscribe;
    }, [navigation]);

    const handleLoginPress = () => {
        navigation.navigate('Authentication');
    };

    return (
        <View style={styles.container}>
            <Animated.View style={{ opacity: animation, transform: [{ translateY: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0]
            }) }] }}>
                <Text style={styles.title}>FitGenius</Text>
            </Animated.View>
            <TouchableOpacity style={styles.loginButton} onPress={handleLoginPress}>
                <Text style={styles.loginButtonText}>Start</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212', // Dark background like dashboards
  },
    title: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 30,
    },
    loginButton: {
        backgroundColor: '#007bff',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
    },
    loginButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default TitleScreen;
