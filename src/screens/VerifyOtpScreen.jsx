import React, { useRef, useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StatusBar,
    Dimensions,
    Image
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';

const bg1 = require('../../assets/images/bg1.png');
const { width, height } = Dimensions.get('window');

const VerifyOtpScreen = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const inputs = useRef([]);
    const navigation = useNavigation();

    const [timer, setTimer] = useState(30);

    useEffect(() => {
        if (inputs.current[0]) {
            inputs.current[0].focus();
        }
    }, []);


    useEffect(() => {
        if (timer === 0) return;
        const interval = setInterval(() => {
            setTimer(prev => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);

    const handleChange = (text, index) => {
        if (/^\d$/.test(text)) {
            const newOtp = [...otp];
            newOtp[index] = text;
            setOtp(newOtp);

            if (index < 5) {
                inputs.current[index + 1].focus();
            }
        } else if (text === '') {
            const newOtp = [...otp];
            newOtp[index] = '';
            setOtp(newOtp);
        }
    };

    const handleVerify = () => {
        const code = otp.join('');
        console.log('OTP Code:', code);
        navigation.navigate('ResetPassword');
    };

    const handleBack = () => {
        navigation.goBack();
    };

    const handleResend = () => {
        if (timer === 0) {
            console.log('Resending code...');
            setTimer(30); // Reset timer
            // TODO: Add resend logic here
        }
    };

    useEffect(() => {
        if (otp.every(char => char !== '')) {
            handleVerify();
        }
    }, [otp]);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className="flex-1 bg-white px-6 justify-center">
                <StatusBar barStyle='dark-content' backgroundColor="#FFFFFF" />

                <View className='absolute bottom-0 left-0 right-0' style={{ zIndex: 0 }}>
                    <Image
                        source={bg1}
                        style={{
                            width: width,
                            height: height * 0.8,
                            transform: [{ translateY: -height * 0 }]
                        }}
                        resizeMode='cover'
                    />
                </View>

                {/* Back Button */}
                <TouchableOpacity
                    onPress={handleBack}
                    style={{ backgroundColor: 'black' }}
                    className="absolute top-16 left-4 w-14 h-14 rounded-full justify-center items-center"
                >
                    <Ionicons name="chevron-back-outline" size={28} color="#FFFFFF" />
                </TouchableOpacity>

                <Text className="text-4xl font-bold text-center mb-4 mt-6">Sắp tới đích!</Text>
                <Text className="text-center text-gray-600 mb-8">
                    Vui lòng nhập mã 6 chữ số đã gửi đến{" "}
                    <Text className="font-semibold">hemmyhtec@gmail.com</Text> để xác thực.
                </Text>

                {/* OTP Inputs */}
                <View className="flex-row justify-between mb-8 px-2">
                    {otp.map((digit, index) => (
                        <TextInput
                            key={index}
                            ref={ref => inputs.current[index] = ref}
                            value={digit}
                            onChangeText={text => handleChange(text, index)}
                            onKeyPress={({ nativeEvent }) => {
                                if (nativeEvent.key === 'Backspace') {
                                    if (otp[index] === '' && index > 0) {
                                        inputs.current[index - 1].focus();
                                        const newOtp = [...otp];
                                        newOtp[index - 1] = '';
                                        setOtp(newOtp);
                                    }
                                }
                            }}
                            maxLength={1}
                            keyboardType="number-pad"
                            className="border border-gray-300 w-12 h-12 rounded-lg text-center text-xl"
                        />

                    ))}
                </View>

                {/* Confirm Button */}
                <TouchableOpacity
                    onPress={handleVerify}
                    className='bg-primary py-4 rounded-2xl mb-8'
                >
                    <View className='flex-row items-center justify-center'>
                        <Text className='text-text-button text-center text-lg font-bold mr-1'>
                            XÁC MINH
                        </Text>
                        <Ionicons name='chevron-forward-outline' size={20} color='#FFFFFF' />
                    </View>

                </TouchableOpacity>

                {/* Resend Timer */}
                <Text className="text-center text-text-title font-semibold mb-2">
                    Chưa nhận được mã?
                </Text>

                {timer > 0 ? (
                    <Text className="font-light text-text-title text-center">
                        Yêu cầu mã mới sau 00:{timer < 10 ? `0${timer}` : timer} giây
                    </Text>
                ) : (
                    <TouchableOpacity onPress={handleResend}>
                        <Text className="text-indigo-600 text-center font-medium">
                            Gửi lại mã
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </TouchableWithoutFeedback >
    );
};

export default VerifyOtpScreen;
