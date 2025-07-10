import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    Dimensions,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import bg1 from '../../assets/images/bg1.png';
const { width, height } = Dimensions.get('window');
const forgotImage = require('../../assets/images/forgotPass.png'); // Cập nhật đường dẫn đúng nếu khác

const ForgotPassScreen = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');

    const handleContinue = () => {
        navigation.navigate('VerifyOtp', { email });
    };

    const handleLogin = () => {
        navigation.navigate('Login');
    };

    return (
        <KeyboardAvoidingView
            className='flex-1 bg-white'
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View className='flex-1 px-8 justify-center'>
                    <StatusBar barStyle='dark-content' backgroundColor="#FFFFFF" />
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
                    <View className='items-center mb-8'>
                        <Image
                            source={forgotImage}
                            style={{ width: 180, height: 180 }}
                            resizeMode='contain'
                        />
                    </View>

                    <View className='items-center mb-6'>
                        <Text className='text-2xl font-bold text-center text-text-title mb-2'>
                            Quên mật khẩu ?
                        </Text>
                        <Text className='text-base text-gray-600 text-center leading-5'>
                            Đừng lo, chúng tôi sẽ giúp bạn lấy lại nó ngay!
                        </Text>
                    </View>

                    <View className='mb-6'>
                        <View className='relative'>
                            <TextInput
                                className="bg-bg-welcome px-4 py-4 rounded-xl text-gray-700 shadow-sm mb-4"
                                placeholder='Nhập địa chỉ email'
                                placeholderTextColor='#9CA3AF'
                                value={email}
                                onChangeText={setEmail}
                                keyboardType='email-address'
                                autoCapitalize='none'
                            />
                            <Ionicons
                                name='mail-outline'
                                size={20}
                                color='#9CA3AF'
                                className='absolute right-4 top-4'
                            />
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={handleContinue}
                        className='bg-primary py-4 rounded-2xl mb-8'
                    >
                        <View className='flex-row items-center justify-center'>
                            <Text className='text-text-button text-center text-lg font-bold mr-1'>
                                TIẾP TỤC
                            </Text>
                            <Ionicons name='chevron-forward-outline' size={20} color='#FFFFFF' />
                        </View>

                    </TouchableOpacity>
                    <View className='items-center'>
                        <Text className='text-gray-600 text-sm'>
                            Bạn đã là thành viên?{' '}
                            <Text
                                onPress={handleLogin}
                                className='text-primary font-bold'
                            >
                                Đăng nhập
                            </Text>{' '}
                            ngay
                        </Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

export default ForgotPassScreen;
