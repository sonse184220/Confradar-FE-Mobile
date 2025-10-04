import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ForgotPasswordScreen1 from '../screens/ForgotPasswordScreen1';
import ForgotPasswordScreen2 from '../screens/ForgotPasswordScreen2';
import { navigationRef } from '../utils/NavigationUtil';
import NavBar from '../test/BottomBar';

export type AuthStackParamList = {
    Login: undefined;
    Register: undefined;
    ForgotPassword1: undefined;
    ForgotPassword2: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStack = () => {
    return (
        // <NavigationContainer ref={navigationRef}>
        <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name="Login" component={LoginScreen} />
            {/* <Stack.Screen name="Login" component={NavBar} /> */}
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="ForgotPassword1" component={ForgotPasswordScreen1} />
            <Stack.Screen name="ForgotPassword2" component={ForgotPasswordScreen2} />

        </Stack.Navigator>
        // </NavigationContainer>
    );
};

export default AuthStack;
