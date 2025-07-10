import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    Dimensions,
    StatusBar,
    ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosClient from '../apis/axiosClient';
import { addAuth } from '../reduxs/reducers/authReducer';
import { useAuthLogic } from '../utils/authLogic';
import bg1 from '../../assets/images/bg1.png';
import googleIcon from '../../assets/images/gg.png';
import facebookIcon from '../../assets/images/fb.png';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    ScrollView,
    Keyboard

} from 'react-native';
import Toast from 'react-native-toast-message';
import { useRef } from 'react';
import { Platform } from 'react-native';
import { useEffect } from 'react';
import login from '../../assets/images/login.png'; // Assuming you have a login image
const { width, height } = Dimensions.get('window');

const LoginScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { isFirstTimeUse, setFirstTimeUsed } = useAuthLogic();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordShow, setIsPasswordShow] = useState(false);
    const passwordRef = useRef();
    const scrollViewRef = useRef();
    const passwordContainerRef = useRef();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setTimeout(() => {
                scrollViewRef.current?.scrollTo({
                    y: 180,
                    animated: true
                });
            }, 100);
        });

        return () => {
            keyboardDidShowListener?.remove();
        };
    }, []);

    const handleSignIn = async () => {
        if (!email || !password) {
            Toast.show({
                type: 'error',
                text1: 'Opps! Thiếu thông tin',
                text2: 'Bạn vui lòng nhập đầy đủ thông tin nhé!',
                position: 'top'
            });
            return;
        }

        setIsLoading(true);

        try {
            const response = await axiosClient.post('login', {
                email: email.trim(),
                password: password
            });

            if (response.data.token) {
                // Token sẽ hết hạn sau 1 tiếng (1 * 60 * 60 * 1000 ms)
                const expiryTime = new Date().getTime() + (10 * 60 * 60 * 1000);

                const username = email.split('@')[0];

                const authData = {
                    token: response.data.token,
                    expiryTime: expiryTime,
                    // _id: response.data.data.account.id || '',
                    // username: response.data.data.account.username,
                    // email: response.data.data.account.email,
                    // emailVerified: response.data.data.account.emailVerified,
                    // accountType: response.data.data.account.accountType,
                    // role: response.data.data.account.role,
                    isFirstTimeUse: false
                };

                await AsyncStorage.setItem('Auth_Data', JSON.stringify(authData));
                dispatch(addAuth(authData));
                if (isFirstTimeUse) {
                    await setFirstTimeUsed();
                }

                Toast.show({
                    type: 'success',
                    text1: 'Yay! Bạn đã đăng nhập',
                    text2: `Chào mừng ${username} quay lại!`,
                    position: 'top'
                });
                navigation.navigate('HomeTabs')
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Oops! Có gì đó sai sai',
                    text2: "Sai mất rồi, thử lại giúp mình nha !",
                    position: 'top'
                });
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Opps! Có gì đó sai sai',
                text2: "Sai mất rồi, thử lại giúp mình nha !",
                position: 'top'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmailSubmit = () => {
        passwordRef.current.focus();
        // Cuộn đơn giản
        setTimeout(() => {
            scrollViewRef.current?.scrollTo({
                y: 150,
                animated: true
            });
        }, 200);
    };

    const handlePasswordFocus = () => {
        // Cuộn khi focus vào password
        setTimeout(() => {
            scrollViewRef.current?.scrollTo({
                y: 200,
                animated: true
            });
        }, 300);
    };

    const handleGoBack = () => {
        navigation.goBack();
    };

    const handleRegister = () => {
        navigation.navigate('Register');
    };

    const handleForgotPass = () => {
        navigation.navigate('ForgotPass');
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
                    contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
                    enableOnAndroid={true}
                >
                    <View className='relative' style={{ minHeight: height }}>
                        <StatusBar backgroundColor='#F3F4F6' barStyle='dark-content' />

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
                            {isFirstTimeUse && (
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
                            )}
                        </View>

                        <View className='flex-1 justify-center px-8' style={{ zIndex: 1 }}>
                            <View className="justify-center items-center">
                                <Image
                                    source={login}
                                    style={{ height: 220 }}
                                    resizeMode="contain"
                                />
                            </View>
                            <View className='items-center mb-12'>
                                <Text className='text-3xl font-bold text-text-title text-center'>
                                    Chào mừng bạn
                                </Text>
                                <Text className="text-base text-text-title font-light text-left leading-6">
                                    Đăng nhập thôi, mọi thứ đã sẵn sàng!
                                </Text>
                            </View>

                            <View className='mb-4'>
                                <TextInput
                                    className="bg-bg-welcome px-4 py-4 rounded-xl text-gray-700 shadow-sm mb-4"
                                    placeholder="Nhập địa chỉ email"
                                    placeholderTextColor="#9CA3AF"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    returnKeyType="next"
                                    onSubmitEditing={handleEmailSubmit}
                                    blurOnSubmit={false}
                                    editable={!isLoading}
                                />
                                <Ionicons
                                    name='mail-outline'
                                    size={20}
                                    color='#9CA3AF'
                                    className='absolute right-4 top-4'
                                />

                            </View>

                            <View className='mb-2 relative' ref={passwordContainerRef}>
                                <TextInput
                                    ref={passwordRef}
                                    className="bg-bg-welcome px-4 py-4 rounded-xl text-gray-700 pr-12 shadow-sm mb-2"
                                    placeholder="Mật khẩu của bạn"
                                    placeholderTextColor="#9CA3AF"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!isPasswordShow}
                                    returnKeyType="done"
                                    onSubmitEditing={handleSignIn}
                                    onFocus={handlePasswordFocus}
                                    editable={!isLoading}
                                />
                                <TouchableOpacity
                                    className='absolute right-4 top-4'
                                    onPress={() => setIsPasswordShow(!isPasswordShow)}
                                >
                                    <Feather
                                        name={isPasswordShow ? 'eye-off' : 'eye'}
                                        size={18}
                                        color='#9CA3AF'
                                    />
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity onPress={handleForgotPass} disabled={isLoading} className='self-end mb-8'>
                                <Text className='text-gray-500 text-sm'>
                                    Quên mật khẩu?
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={handleSignIn}
                                className='bg-primary py-4 rounded-2xl mb-8'
                                disabled={isLoading}
                            >
                                {isLoading ? (<ActivityIndicator color="white" />) : (<View className='flex-row items-center justify-center'>
                                    <Text className='text-text-button text-center text-lg font-bold mr-1'>
                                        TIẾP TỤC
                                    </Text>
                                    <Ionicons name='chevron-forward-outline' size={20} color='#FFFFFF' />
                                </View>)}

                            </TouchableOpacity>

                            <View className='flex-row items-center mb-6'>
                                <View className='flex-1 h-px bg-gray-300' />
                                <Text className='mx-4 text-gray-500 text-sm'>
                                    Hoặc tiếp tục với
                                </Text>
                                <View className='flex-1 h-px bg-gray-300' />
                            </View>

                            <View
                                className='flex-row justify-center mb-6'
                                style={{ gap: 24 }}
                            >
                                <TouchableOpacity
                                    className='bg-white w-28 h-16 rounded-2xl items-center justify-center'
                                    style={{
                                        shadowColor: '#000',
                                        shadowOffset: {
                                            width: 0,
                                            height: 2
                                        },
                                        shadowOpacity: 0.1,
                                        shadowRadius: 8,
                                        elevation: 3
                                    }}
                                    disabled={isLoading}
                                >
                                    <Image
                                        source={googleIcon}
                                        style={{ width: 22, height: 20 }}
                                        resizeMode='contain'
                                    />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    className='bg-white w-28 h-16 rounded-2xl items-center justify-center'
                                    style={{
                                        shadowColor: '#000',
                                        shadowOffset: {
                                            width: 0,
                                            height: 2
                                        },
                                        shadowOpacity: 0.1,
                                        shadowRadius: 8,
                                        elevation: 3
                                    }}
                                    disabled={isLoading}
                                >
                                    <Image
                                        source={facebookIcon}
                                        style={{ height: 22, width: 22 }}
                                        resizeMode='contain'
                                    />
                                </TouchableOpacity>
                            </View>

                            <View className='items-center pb-12 px-8' style={{ zIndex: 1 }}>
                                <Text className='text-gray-600 text-sm text-center'>
                                    Bạn mới?{" "}
                                    <Text
                                        onPress={!isLoading ? handleRegister : null}
                                        className='text-primary font-bold'

                                    >
                                        Tạo tài khoản ngay!
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

export default LoginScreen;
