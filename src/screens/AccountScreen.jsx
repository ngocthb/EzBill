import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Image,
    Dimensions,
    TouchableOpacity,
    StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from 'react-redux';
import bg1 from '../../assets/images/bg1.png';
import { useNavigation } from '@react-navigation/native';
import { useAuthLogic } from '../utils/authLogic';
import { useAIChat } from '../contexts/AIChatContext';
const { width, height } = Dimensions.get('window');
const account = require('../../assets/images/account.png');
import axiosClient from '../apis/axiosClient';
import hcmt from '../../assets/images/hcmt.png';
import hhuy from '../../assets/images/hhuy.webp';
import trihcmse from '../../assets/images/trihcmse.webp';
import paavagl from '../../assets/images/paavagl.webp';

const AccountScreen = () => {
    const navigation = useNavigation();
    const { handleLogout: authLogout } = useAuthLogic();
    const { updateLoginStatus } = useAIChat();
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

            // Cập nhật trạng thái AI chat khi đăng xuất
            updateLoginStatus(false);

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
        <>
            <StatusBar barStyle="light-content" backgroundColor="#667eea" />

            <View className="flex-1 bg-bg-default">
                {/* Background */}
                <View className="absolute bottom-0 left-0 right-0" style={{ zIndex: 0 }}>
                    <Image
                        source={bg1}
                        style={{
                            width: width,
                            height: height * 0.8,
                            opacity: 1,
                            transform: [{ translateY: -height * 0.1 }],

                        }}
                        resizeMode="cover"
                    />
                </View>

                {/* Header with Gradient */}
                <LinearGradient
                    colors={['#667eea', '#764ba2']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                        paddingTop: 50,
                        paddingBottom: 20,
                        paddingHorizontal: 20,
                    }}
                >
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center">

                            <Text className="text-white text-2xl font-bold">Tài khoản</Text>
                        </View>


                    </View>
                </LinearGradient>

                <ScrollView
                    className="flex-1 px-6 "
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 80, paddingTop: 16 }}
                >

                    {/* Profile Section */}
                    <View className="mb-8">
                        <View className="bg-white rounded-3xl p-8 mx-2" style={{
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 8 },
                            shadowOpacity: 0.15,
                            shadowRadius: 24,
                            elevation: 8,
                        }}>
                            <View className="items-center">
                                <View className="relative mb-6">
                                    <View className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 items-center justify-center p-1">
                                        <Image
                                            source={
                                                user.email === 'huynhcongminhtri79@gmail.com' ? hcmt :
                                                    user.email === 'hhuy00355@gmail.com' ? hhuy :
                                                        user.email === 'trihcmse183799@fpt.edu.vn' ? trihcmse :
                                                            paavagl
                                            }
                                            className="w-24 h-24 rounded-full"
                                            resizeMode="cover"
                                        />
                                    </View>

                                </View>

                                <Text className="text-2xl font-bold text-gray-900 mb-2">
                                    {user?.email ? user.email.split('@')[0].replace(/\d+/g, '') : 'User'}
                                </Text>
                                <Text className="text-base text-gray-500 mb-6">{user?.email || "example@gmail.com"}</Text>

                                <View className="flex-row items-center space-x-3 mb-6">

                                    <View className="bg-gray-100 px-4 py-2 rounded-full">
                                        <Text className="text-sm text-gray-600 font-medium">Thành viên từ 2024</Text>
                                    </View>
                                </View>

                                <TouchableOpacity
                                    className="bg-gray-100 px-8 py-3 rounded-xl flex-row items-center"
                                    style={{
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.05,
                                        shadowRadius: 8,
                                        elevation: 2,
                                    }}
                                >
                                    <Ionicons name="share" size={18} color="#374151" />
                                    <Text className="text-center text-gray-700 font-semibold ml-2">Chia sẻ hồ sơ</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {/* Premium Card */}
                    <View className="mb-8">
                        <LinearGradient
                            colors={['#667eea', '#764ba2']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={{
                                shadowColor: '#6366F1',
                                shadowOffset: { width: 0, height: 8 },
                                shadowOpacity: 0.25,
                                shadowRadius: 16,
                                elevation: 12,
                                borderRadius: 20,
                                padding: 20,
                                marginHorizontal: 8,
                            }}
                        >
                            <View className="flex-row items-center justify-between mb-4">
                                <View className="flex-1 pr-4">
                                    <View className="flex-row items-center mb-2">
                                        <Ionicons name="diamond" size={20} color="white" />
                                        <Text className="text-white text-lg font-bold ml-2">
                                            Nâng cấp Premium
                                        </Text>
                                    </View>
                                    <Text className="text-white/90 text-sm leading-5">
                                        Trải nghiệm đầy đủ tính năng và không giới hạn với gói Premium
                                    </Text>
                                </View>
                                <Image source={account} className="w-28 h-20" resizeMode="contain" />
                            </View>
                            <TouchableOpacity
                                className="bg-white rounded-xl py-4 flex-row items-center justify-center"
                                style={{
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 4 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 8,
                                    elevation: 4,
                                }}
                            >
                                <Ionicons name="star" size={18} color="#667eea" />
                                <Text className="text-center text-indigo-600 font-bold text-base tracking-wide ml-2">
                                    NÂNG CẤP NGAY
                                </Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>

                    {/* Menu Items */}
                    <View className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6 mx-2" style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.1,
                        shadowRadius: 12,
                        elevation: 6,
                    }}>
                        {[
                            { label: 'Bạn bè', icon: 'people-outline', color: '#10B981', description: 'Quản lý danh sách bạn bè' },
                            { label: 'Thống kê', icon: 'analytics-outline', color: '#3B82F6', description: 'Xem báo cáo chi tiêu' },
                            { label: 'Cài đặt', icon: 'settings-outline', color: '#6B7280', description: 'Tùy chỉnh ứng dụng' },
                            { label: 'Trung tâm trợ giúp', icon: 'help-circle-outline', color: '#F59E0B', description: 'Hỗ trợ và câu hỏi' }
                        ].map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                className={`flex-row items-center px-6 py-5 ${index !== 3 ? 'border-b border-gray-100' : ''}`}
                                activeOpacity={0.7}
                                onPress={() => handleMenuPress(item.label)}
                            >
                                <View
                                    className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
                                    style={{ backgroundColor: `${item.color}15` }}
                                >
                                    <Ionicons name={item.icon} size={22} color={item.color} />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-base font-bold text-gray-900 mb-1">{item.label}</Text>
                                    <Text className="text-sm text-gray-500">{item.description}</Text>
                                </View>
                                <View className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center">
                                    <Ionicons name="chevron-forward" size={16} color="#6B7280" />
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Logout */}
                    <View className="mb-8">
                        <TouchableOpacity
                            className="bg-white rounded-2xl px-6 py-5 shadow-lg border border-red-100 mx-2"
                            activeOpacity={0.7}
                            onPress={handleLogout}
                            style={{
                                shadowColor: '#EF4444',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.15,
                                shadowRadius: 12,
                                elevation: 6,
                            }}
                        >
                            <View className="flex-row items-center">
                                <View className="w-12 h-12 rounded-2xl items-center justify-center mr-4 bg-red-50">
                                    <Ionicons name="log-out-outline" size={22} color="#EF4444" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-base font-bold text-red-500 mb-1">Đăng xuất</Text>
                                    <Text className="text-sm text-red-400">Thoát khỏi tài khoản hiện tại</Text>
                                </View>
                                <View className="w-8 h-8 rounded-full bg-red-100 items-center justify-center">
                                    <Ionicons name="chevron-forward" size={16} color="#EF4444" />
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </>
    );
}

export default AccountScreen