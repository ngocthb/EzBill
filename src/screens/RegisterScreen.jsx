import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    Dimensions,
    StatusBar
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import bg1 from '../../assets/images/bg1.png';

import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    ScrollView,
    Keyboard

} from 'react-native';
import { Platform } from 'react-native';
import { useRef } from 'react';
import { useEffect } from 'react';
const { width, height } = Dimensions.get('window');
const register = require('../../assets/images/register.png'); // Assuming you have a register image
const RegisterScreen = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');

    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isPasswordShow, setIsPasswordShow] = useState(false);
    const [isConfirmPasswordShow, setIsConfirmPasswordShow] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);



    const emailRef = useRef();
    const phoneRef = useRef();
    const passwordRef = useRef();
    const confirmRef = useRef();
    const scrollViewRef = useRef();

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            // Khi keyboard hiển thị, cuộn để đảm bảo input fields visible
            setTimeout(() => {
                scrollViewRef.current?.scrollTo({
                    y: 250,
                    animated: true
                });
            }, 100);
        });

        return () => {
            keyboardDidShowListener?.remove();
        };
    }, []);
    const handleRegister = () => {
        console.log('Register pressed');
    };

    const handleGoBack = () => {
        navigation.goBack();
    };


    const handleEmailSubmit = () => {
        phoneRef.current?.focus();
        setTimeout(() => {
            scrollViewRef.current?.scrollTo({
                y: 100,
                animated: true
            });
        }, 100);
    };

    const handlePhoneSubmit = () => {
        passwordRef.current?.focus();
        setTimeout(() => {
            scrollViewRef.current?.scrollTo({
                y: 200,
                animated: true
            });
        }, 100);
    };

    const handlePasswordSubmit = () => {
        confirmRef.current?.focus();
        setTimeout(() => {
            scrollViewRef.current?.scrollTo({
                y: 280,
                animated: true
            });
        }, 100);
    };

    const handleConfirmPasswordFocus = () => {
        // Cuộn khi focus vào confirm password
        setTimeout(() => {
            scrollViewRef.current?.scrollTo({
                y: 300,
                animated: true
            });
        }, 300);
    };



    const handleSignIn = () => {
        navigation.navigate('Login');
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            className="flex-1 bg-gray-100"
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <ScrollView
                    ref={scrollViewRef}
                    className='flex-1 bg-gray-100'
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{ flexGrow: 1, paddingBottom: 200 }}
                    enableOnAndroid={true}
                >
                    <View className='relative' style={{ minHeight: height }}>
                        <View
                            className='absolute bottom-0 left-0 right-0'
                            style={{ zIndex: 0 }}
                        >
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
                        <View
                            className='flex-row items-center mt-6 px-4 pt-12'
                            style={{ zIndex: 1 }}
                        >

                            <TouchableOpacity
                                onPress={handleGoBack}
                                className='flex-row items-center'
                            >
                                <Ionicons
                                    name='chevron-back-outline'
                                    size={28}
                                    color='#3B82F6'
                                    style={{ marginRight: 4 }}
                                />
                            </TouchableOpacity>

                        </View>

                        <View className='flex-1 justify-center px-8' style={{ zIndex: 1 }}>
                            <View className="justify-center items-center">
                                <Image
                                    source={register}
                                    style={{ height: 220 }}
                                    resizeMode="contain"
                                />
                            </View>
                            <View className='items-center mb-12'>
                                <Text className='text-3xl font-bold text-gray-900 text-center'>
                                    Bắt đầu thôi!
                                </Text>
                                <Text className="text-base text-text-title font-light text-left leading-6">
                                    Đăng ký miễn phí và sử dụng ngay.
                                </Text>
                            </View>

                            <View >
                                <TextInput
                                    ref={emailRef}
                                    className='bg-white px-4 py-4 rounded-xl text-gray-700 mb-4 shadow-sm'
                                    placeholder='Email'
                                    placeholderTextColor='#9CA3AF'
                                    keyboardType='email-address'
                                    autoCapitalize='none'
                                    value={email}
                                    onChangeText={setEmail}
                                    returnKeyType='next'
                                    onSubmitEditing={handleEmailSubmit}
                                    blurOnSubmit={false}
                                />
                                <Ionicons
                                    name='mail-outline'
                                    size={20}
                                    color='#9CA3AF'
                                    className='absolute right-4 top-4'
                                />
                            </View>

                            {/* Phone */}
                            <View >
                                <TextInput
                                    ref={phoneRef}
                                    className='bg-white px-4 py-4 rounded-xl text-gray-700 mb-4 shadow-sm'
                                    placeholder='Số điện thoại'
                                    placeholderTextColor='#9CA3AF'
                                    keyboardType='phone-pad'
                                    value={phone}
                                    onChangeText={setPhone}
                                    returnKeyType='next'
                                    onSubmitEditing={handlePhoneSubmit}
                                    blurOnSubmit={false}
                                />
                                <Ionicons
                                    name='call-outline'
                                    size={20}
                                    color='#9CA3AF'
                                    className='absolute right-4 top-4' />

                            </View>
                            {/* Password */}
                            <View className='mb-4 '>
                                <TextInput
                                    ref={passwordRef}
                                    className='bg-white px-4 py-4 rounded-xl text-gray-700 pr-12 shadow-sm'
                                    placeholder='Mật khẩu'
                                    placeholderTextColor='#9CA3AF'
                                    secureTextEntry={!isPasswordShow}
                                    value={password}
                                    onChangeText={setPassword}
                                    returnKeyType='next'
                                    onSubmitEditing={handlePasswordSubmit}
                                    blurOnSubmit={false}
                                />
                                <TouchableOpacity
                                    className='absolute right-4 top-4'
                                    onPress={() => setIsPasswordShow(!isPasswordShow)}
                                >
                                    <Feather name={isPasswordShow ? 'eye-off' : 'eye'} size={18} color='#9CA3AF' />
                                </TouchableOpacity>
                            </View>

                            {/* Confirm Password */}
                            <View className='mb-4 relative'>
                                <TextInput
                                    ref={confirmRef}
                                    className='bg-white px-4 py-4 rounded-xl text-gray-700 pr-12 shadow-sm'
                                    placeholder='Xác nhận mật khẩu'
                                    placeholderTextColor='#9CA3AF'
                                    secureTextEntry={!isConfirmPasswordShow}
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    onFocus={handleConfirmPasswordFocus}
                                    returnKeyType='done'
                                />
                                <TouchableOpacity
                                    className='absolute right-4 top-4'
                                    onPress={() => setIsConfirmPasswordShow(!isConfirmPasswordShow)}
                                >
                                    <Feather name={isConfirmPasswordShow ? 'eye-off' : 'eye'} size={18} color='#9CA3AF' />
                                </TouchableOpacity>
                            </View>

                            {/* Checkbox điều khoản */}
                            <TouchableOpacity
                                onPress={() => setAgreeTerms(!agreeTerms)}
                                className='flex-row justify-center items-center mt-4 mb-6'
                                activeOpacity={0.8}
                            >
                                <View
                                    className={`w-5 h-5 mr-2 items-center justify-center rounded  ${agreeTerms ? 'bg-primary border-primary' : 'border-gray-400 border'
                                        }`}
                                >
                                    {agreeTerms && <Feather name="check" size={14} color="white" />}
                                </View>
                                <Text className='text-sm text-gray-700 flex-shrink'>
                                    Tôi đồng ý với{' '}
                                    <Text className='text-primary underline'>
                                        Điều khoản sử dụng
                                    </Text>
                                </Text>
                            </TouchableOpacity>

                            {/* Register Button */}

                            <TouchableOpacity
                                onPress={handleRegister}
                                className='bg-primary py-4 rounded-2xl mb-8'
                            >
                                <View className='flex-row items-center justify-center'>
                                    <Text className='text-text-button text-center text-lg font-bold mr-1'>
                                        TIẾP TỤC
                                    </Text>
                                    <Ionicons name='chevron-forward-outline' size={20} color='#FFFFFF' />
                                </View>

                            </TouchableOpacity>


                            <View className='items-center '>
                                <Text className='text-gray-600 text-sm text-center'>
                                    Bạn đã là thành viên?{" "}
                                    <Text
                                        onPress={handleSignIn}
                                        className='text-primary font-bold'
                                    >
                                        Đăng nhập ngay!
                                    </Text>
                                </Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

export default RegisterScreen;