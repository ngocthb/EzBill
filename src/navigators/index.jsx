import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
    SplashScreen,
    WelcomeScreen,
    LoginScreen,
    RegisterScreen,
    PremiumScreen,
    CreateGroupScreen,
    SummaryScreen,
    VerifyOtpScreen, ForgotPassScreen, ResetPasswordScreen,
    CreateBill,
    ShareBill,
    HelpCenterScreen,
    SettingsScreen,
    ChangePasswordScreen,
    AnalyticsScreen,
    FriendsScreen,
    ScanBillScreen
} from '../screens';
import HomeTabs from './BottomTabs';

import HistoryScreen from '../screens/HistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import DashboardScreen from '../screens/DashboardScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName='Splash'
                screenOptions={{
                    headerShown: false
                }}
            >
                <Stack.Screen
                    name='Splash'
                    component={SplashScreen}
                    options={{
                        gestureEnabled: false
                    }}
                />

                <Stack.Screen
                    name='Welcome'
                    component={WelcomeScreen}
                    options={{
                        gestureEnabled: false
                    }}
                />

                <Stack.Screen
                    name='Login'
                    component={LoginScreen}
                    options={{
                        gestureEnabled: true
                    }}
                />

                <Stack.Screen
                    name='Register'
                    component={RegisterScreen}
                    options={{
                        gestureEnabled: true
                    }}
                />
                <Stack.Screen
                    name='ForgotPass'
                    component={ForgotPassScreen}
                    options={{
                        gestureEnabled: true
                    }}
                />
                <Stack.Screen
                    name='VerifyOtp'
                    component={VerifyOtpScreen}
                    options={{
                        gestureEnabled: true
                    }}
                />
                <Stack.Screen
                    name='ResetPassword'
                    component={ResetPasswordScreen}
                    options={{
                        gestureEnabled: true
                    }}
                />


                <Stack.Screen name='HomeTabs' component={HomeTabs} />
                <Stack.Screen
                    name='Premium'
                    component={PremiumScreen}
                    options={{
                        gestureEnabled: true
                    }}
                />
                <Stack.Screen
                    name='CreateGroup'
                    component={CreateGroupScreen}
                    options={{
                        gestureEnabled: true
                    }}
                />
                <Stack.Screen
                    name='Summary'
                    component={SummaryScreen}
                    options={{
                        gestureEnabled: true
                    }}
                />
                <Stack.Screen
                    name='CreateBill'
                    component={CreateBill}
                    options={{
                        gestureEnabled: true
                    }}
                />
                <Stack.Screen
                    name='ShareBill'
                    component={ShareBill}
                    options={{
                        gestureEnabled: true
                    }} />
                <Stack.Screen
                    name='Profile'
                    component={ProfileScreen}
                    options={{
                        gestureEnabled: true
                    }}
                />
                <Stack.Screen
                    name='History'
                    component={HistoryScreen}
                    options={{
                        gestureEnabled: true
                    }}
                />
                <Stack.Screen
                    name='Dashboard'
                    component={DashboardScreen}
                    options={{
                        gestureEnabled: true
                    }}
                />
                <Stack.Screen
                    name='HelpCenter'
                    component={HelpCenterScreen}
                    options={{
                        gestureEnabled: true
                    }}
                />
                <Stack.Screen
                    name='Settings'
                    component={SettingsScreen}
                    options={{
                        gestureEnabled: true
                    }}
                />
                <Stack.Screen
                    name='ChangePassword'
                    component={ChangePasswordScreen}
                    options={{
                        gestureEnabled: true
                    }}
                />
                <Stack.Screen
                    name='Analytics'
                    component={AnalyticsScreen}
                    options={{
                        gestureEnabled: true
                    }}
                />
                <Stack.Screen
                    name='Friends'
                    component={FriendsScreen}
                    options={{
                        gestureEnabled: true
                    }}
                />
                <Stack.Screen
                    name='ScanBill'
                    component={ScanBillScreen}
                    options={{
                        gestureEnabled: true
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
