
import React, { useEffect, useRef } from 'react';
import {
    View,
    StatusBar,
    Image,
    Animated,
    Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthLogic } from '../utils/authLogic';

import welcome from '../../assets/images/welcome.png';
import Svg, { Defs, RadialGradient, Stop, Circle } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const SplashScreen = () => {
    const navigation = useNavigation();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const { isAppLoading, isTokenValid, isFirstTimeUse, authData } = useAuthLogic();

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1500,
                useNativeDriver: true
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 1500,
                useNativeDriver: true
            })
        ]).start();
    }, []);

    useEffect(() => {
        if (!isAppLoading) {
            console.log(authData);
            console.log('🚀 Navigation decision:', {
                isTokenValid,
                isFirstTimeUse,
                authData: !!authData
            });

            const timer = setTimeout(() => {
                if (isTokenValid && authData) {
                    console.log('✅ Navigating to HomeTabs');
                    navigation.replace('HomeTabs');
                } else if (isFirstTimeUse) {
                    console.log('👶 Navigating to Welcome (first time)');
                    navigation.replace('Welcome');
                } else {
                    console.log('🔐 Navigating to Login');
                    navigation.replace('Login');
                }
            }, 1000); // Thêm delay nhỏ để user thấy splash

            return () => clearTimeout(timer);
        }
    }, [isAppLoading, isTokenValid, isFirstTimeUse, authData, navigation]);

    return (
        <View style={{ flex: 1 }}>
            <Svg
                height={height}
                width={width}
                style={{ position: 'absolute', top: 0, left: 0 }}
            >
                <Defs>
                    <RadialGradient id="grad" cx="50%" cy="50%" r="70%" fx="50%" fy="50%">
                        <Stop offset="0%" stopColor="#ADE3FA" stopOpacity="1" />
                        <Stop offset="40%" stopColor="#A3D8DA" stopOpacity="0.5" />
                        <Stop offset="80%" stopColor="#FDFAF4" stopOpacity="0.1" />
                    </RadialGradient>
                </Defs>

                <Circle
                    cx={width / 2}
                    cy={height / 2}
                    r={Math.min(width, height) * 0.7} // vòng tròn đều
                    fill="url(#grad)"
                />
            </Svg>

            <StatusBar backgroundColor="transparent" translucent barStyle="dark-content" />

            <View className="flex-1 justify-center items-center px-8 z-10">
                <Animated.View
                    style={{
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }]
                    }}
                    className="items-center"
                >
                    <Image
                        source={welcome}
                        style={{
                            width: 500,
                            height: 300,
                            marginBottom: 16
                        }}
                        resizeMode="contain"
                    />
                </Animated.View>
            </View>
        </View>
    );
};



export default SplashScreen;
