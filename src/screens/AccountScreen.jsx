import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useState, useEffect } from 'react';
import { ScrollView, Image, Dimensions, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import bg1 from '../../assets/images/bg1.png';
import { useNavigation } from '@react-navigation/native';
import { useAuthLogic } from '../utils/authLogic';
const { width, height } = Dimensions.get('window');
const account = require('../../assets/images/account.png');
import axiosClient from '../apis/axiosClient';


const AccountScreen = () => {
    const navigation = useNavigation();
    const { handleLogout: authLogout } = useAuthLogic();
    const authData = useSelector(state => state.auth);

    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false);
    // Extract user data từ backend response


    const handleMenuPress = (label) => {
        switch (label) {
            case 'Bạn bè':
                navigation.navigate('Friends');
                break;
            case 'Thống kê':
                navigation.navigate('Analytics');
                break;
            case 'Trung tâm trợ giúp':
                navigation.navigate('HelpCenter');
                break;
            case 'Cài đặt':
                navigation.navigate('Settings');
                break;
            default:
                break;
        }
    };

    const handleLogout = async () => {
        try {
            await authLogout();
            console.log('Logout successful, navigating to Welcome');
            navigation.reset({
                index: 0,
                routes: [{ name: 'Welcome' }],
            });
        } catch (error) {
            console.log('Logout error:', error);
        }
    };

    const fetchUserData = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get("profile");
            console.log('User data fetched:', response.data);
            if (response.status === 200) {
                setUser(response.data);

            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchUserData();
        setRefreshing(false);
    };


    useEffect(() => {
        fetchUserData();
    }, []);


    return (
        <SafeAreaView className="flex-1 bg-bg-default">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
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
                {/* Header */}
                <View className="px-6 pt-4 pb-6">
                    <Text className="text-2xl font-bold text-gray-900">Tài khoản</Text>
                </View>

                {/* Profile Section */}
                <View className="mx-6 mb-8">
                    <View className="bg-white rounded-3xl p-8" style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 8 },
                        shadowOpacity: 0.1,
                        shadowRadius: 24,
                        elevation: 6,
                    }}>
                        <View className="items-center">
                            <View className="relative mb-6">
                                <Image
                                    source={{
                                        uri: 'https://img-s-msn-com.akamaized.net/tenant/amp/entityid/BB1msOP5?w=0&h=0&q=60&m=6&f=jpg&u=t',
                                    }}
                                    className="w-24 h-24 rounded-full"
                                    resizeMode="cover"
                                    style={{
                                        borderWidth: 4,
                                        borderColor: '#F8FAFC',
                                    }}
                                />
                            </View>

                            <Text className="text-2xl font-bold text-gray-900 mb-2">{user?.email ? user.email.split('@')[0].replace(/\d+/g, '') : 'User'}</Text>
                            <Text className="text-base text-gray-500 mb-4">{user?.email || "example@gmail.com"}</Text>

                            <View className="flex-row items-center space-x-4 mb-6">
                                <View className="bg-blue-50 px-4 py-2 rounded-full">
                                    <Text className="text-sm text-blue-600 font-semibold">Free Plan</Text>
                                </View>
                                <View className="bg-gray-50 px-4 py-2 rounded-full">
                                    <Text className="text-sm text-gray-600 font-medium">Thành viên từ 2024</Text>
                                </View>
                            </View>

                            <TouchableOpacity className="bg-gray-100 px-8 py-3 rounded-xl">
                                <Text className="text-center text-gray-700 font-semibold">Chia sẻ</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Premium Card */}
                <View className="mx-6 mb-8">
                    <LinearGradient
                        colors={['#667eea', '#764ba2']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}

                        style={{
                            shadowColor: '#6366F1',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.15,
                            shadowRadius: 12,
                            elevation: 8,
                            borderRadius: 16,
                            padding: 16,
                        }}
                    >
                        <View className="flex-row items-center justify-between mb-4">
                            <View className="flex-1 pr-4">
                                <Text className="text-white text-lg font-bold mb-2">
                                    Nâng cấp Premium
                                </Text>
                                <Text className="text-white/90 text-sm leading-5">
                                    Trải nghiệm đầy đủ tính năng và không giới hạn
                                </Text>
                            </View>
                            <Image source={account} className="w-28 h-20" resizeMode="contain" />
                        </View>
                        <TouchableOpacity className="bg-white rounded-xl py-3">
                            <Text className="text-center text-indigo-600 font-bold text-base tracking-wide">
                                NÂNG CẤP NGAY
                            </Text>
                        </TouchableOpacity>
                    </LinearGradient>
                </View>

                {/* Menu Items */}
                <View className="mx-6 bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
                    {[
                        { label: 'Bạn bè', icon: 'people-outline', color: '#10B981' },
                        { label: 'Thống kê', icon: 'analytics-outline', color: '#3B82F6' },
                        { label: 'Cài đặt', icon: 'settings-outline', color: '#6B7280' },
                        { label: 'Trung tâm trợ giúp', icon: 'help-circle-outline', color: '#F59E0B' }
                    ].map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            className={`flex-row items-center px-6 py-4 ${index !== 3 ? 'border-b border-gray-100' : ''}`}
                            activeOpacity={0.7}
                            onPress={() => handleMenuPress(item.label)}
                        >
                            <View
                                className="w-10 h-10 rounded-full items-center justify-center mr-4"
                                style={{ backgroundColor: `${item.color}15` }}
                            >
                                <Ionicons name={item.icon} size={20} color={item.color} />
                            </View>
                            <Text className="flex-1 text-base font-medium text-gray-900">{item.label}</Text>
                            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Logout */}
                <View className="mx-6 mb-8">
                    <TouchableOpacity
                        className="bg-white rounded-2xl px-6 py-4 shadow-sm border border-red-100"
                        activeOpacity={0.7}
                        onPress={handleLogout}
                        style={{
                            shadowColor: '#EF4444',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 8,
                            elevation: 3,
                        }}
                    >
                        <View className="flex-row items-center">
                            <View className="w-10 h-10 rounded-full items-center justify-center mr-4 bg-red-50">
                                <Ionicons name="log-out-outline" size={20} color="#EF4444" />
                            </View>
                            <Text className="flex-1 text-base font-medium text-red-500">Đăng xuất</Text>
                            <Ionicons name="chevron-forward" size={18} color="#EF4444" />
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default AccountScreen