import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StatusBar,
    Dimensions,
    Image,
    Keyboard,
    TouchableWithoutFeedback
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAvoidingView, ScrollView } from 'react-native';
import { Platform } from 'react-native';

const resetPass = require('../../assets/images/resetPass.png');
const bg1 = require('../../assets/images/bg1.png');
const { width, height } = Dimensions.get('window');

const ResetPasswordScreen = () => {
    const navigation = useNavigation();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isPasswordShow, setIsPasswordShow] = useState(false);
    const [isConfirmShow, setIsConfirmShow] = useState(false);

    const passwordRef = useRef(null);
    const confirmRef = useRef(null);

    const handleSubmit = () => {
        if (password && confirmPassword && password === confirmPassword) {
            console.log('Mật khẩu mới:', password);
            // TODO: Gửi mật khẩu mới
        } else {
            console.warn('Mật khẩu không khớp hoặc chưa nhập');
        }
    };

    const handleBack = () => navigation.goBack();

    const handleGoToLogin = () => navigation.navigate('LoginScreen');

    return (
        <KeyboardAvoidingView
            className="flex-1"
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View className="flex-1 bg-white px-6 justify-center">
                        <StatusBar barStyle='dark-content' backgroundColor="#FFFFFF" />

                        {/* BG Image */}
                        <View className='absolute bottom-0 left-0 right-0' style={{ zIndex: 0 }}>
                            <Image
                                source={bg1}
                                style={{ width: width, height: height * 0.8 }}
                                resizeMode='cover'
                            />
                        </View>

                        {/* Back Button */}
                        <TouchableOpacity
                            onPress={handleBack}
                            className="absolute top-16 left-4 w-14 h-14 bg-black rounded-full justify-center items-center"
                        >
                            <Ionicons name="chevron-back-outline" size={28} color="#FFFFFF" />
                        </TouchableOpacity>

                        {/* Mascot */}
                        <View className="items-center justify-center mb-6">
                            <Image
                                source={resetPass}
                                style={{ height: 220 }}
                                resizeMode="contain"
                            />
                        </View>

                        {/* Title */}
                        <Text className="text-2xl font-bold text-center text-[#1A1A1A] mb-2">
                            Nhập mật khẩu mới
                        </Text>

                        {/* Subtitle */}
                        <Text className="text-center text-gray-500 mb-8 px-4">
                            Gần xong rồi – hãy tạo mật khẩu mới để bảo vệ tài khoản của bạn.
                        </Text>

                        {/* Password Input */}
                        <View className='mb-4'>
                            <TextInput
                                ref={passwordRef}
                                className='bg-white px-4 py-4 rounded-xl text-gray-700 pr-12 shadow-sm'
                                placeholder='Mật khẩu'
                                placeholderTextColor='#9CA3AF'
                                secureTextEntry={!isPasswordShow}
                                value={password}
                                onChangeText={setPassword}
                                returnKeyType='next'
                                onSubmitEditing={() => confirmRef.current?.focus()}
                                blurOnSubmit={false}
                            />
                            <TouchableOpacity
                                className='absolute right-4 top-4'
                                onPress={() => setIsPasswordShow(!isPasswordShow)}
                            >
                                <Feather name={isPasswordShow ? 'eye-off' : 'eye'} size={18} color='#9CA3AF' />
                            </TouchableOpacity>
                        </View>

                        {/* Confirm Password Input */}
                        <View className='mb-6'>
                            <TextInput
                                ref={confirmRef}
                                className='bg-white px-4 py-4 rounded-xl text-gray-700 pr-12 shadow-sm'
                                placeholder='Nhập lại mật khẩu'
                                placeholderTextColor='#9CA3AF'
                                secureTextEntry={!isConfirmShow}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                            />
                            <TouchableOpacity
                                className='absolute right-4 top-4'
                                onPress={() => setIsConfirmShow(!isConfirmShow)}
                            >
                                <Feather name={isConfirmShow ? 'eye-off' : 'eye'} size={18} color='#9CA3AF' />
                            </TouchableOpacity>
                        </View>

                        {/* Submit Button */}
                        <TouchableOpacity
                            onPress={handleSubmit}
                            className='bg-indigo-600 py-4 rounded-2xl mb-8'
                        >
                            <View className='flex-row items-center justify-center'>
                                <Text className='text-white text-center text-lg font-bold mr-1'>
                                    TIẾP TỤC
                                </Text>
                                <Ionicons name='chevron-forward-outline' size={20} color='#FFFFFF' />
                            </View>
                        </TouchableOpacity>

                        {/* Bottom Text */}
                        <Text className="text-center text-gray-600">
                            Bạn đã là thành viên?{' '}
                            <Text
                                className="text-indigo-600 font-medium"
                                onPress={handleGoToLogin}
                            >
                                Đăng nhập
                            </Text>{' '}
                            ngay
                        </Text>
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

export default ResetPasswordScreen;
