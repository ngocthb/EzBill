import { Text, View } from 'react-native'
import React from 'react'
import { ScrollView, TouchableOpacity, Image, Dimensions, Animated, RefreshControl, Platform, StatusBar, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import bg1 from '../../assets/images/bg1.png';
import homepage1 from '../../assets/images/homepage1.png';
import homepage2 from '../../assets/images/homepage2.png';
import homepage3 from '../../assets/images/homepage3.png';
import { SafeAreaView } from 'react-native-safe-area-context';
import axiosClient from '../apis/axiosClient';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
const { width, height } = Dimensions.get('window');
import sharingBill from '../../assets/images/sharingBill.gif';
import { formatCurrency } from '../utils/formatUtils';
import Notfound from '../components/Notfound';
import { useAIChat } from '../contexts/AIChatContext';
import test from '../../assets/images/test.jpg';
const AnimatedCard = ({ children, delay = 0 }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;



    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                delay,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                delay,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);




    return (
        <Animated.View
            style={{
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
            }}
        >
            {children}
        </Animated.View>
    );
};

const HomeScreen = () => {
    const navigation = useNavigation();
    const { toggleAIChat } = useAIChat();
    const [pressedCard, setPressedCard] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [haveNoti, setHaveNoti] = useState(false);
    const [showNotificationModal, setShowNotificationModal] = useState(false);
    const [hasShownNotificationModal, setHasShownNotificationModal] = useState(false);
    const [stats, setStats] = useState({
        owed: 0,
        owes: 0,
        totalGroups: 0,
        recentActivity: 0
    });
    const [groups, setGroups] = useState([]);

    const handlePressIn = (cardType) => {
        setPressedCard(cardType);
    };

    const handlePressOut = () => {
        setPressedCard(null);
    };

    const fetchUserData = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get("profile");

            if (response.status === 200) {
                setUser(response.data);

                const notiRes = await axiosClient.get(`Settlement/debtor/${response.data.accountId}`);
                if (notiRes.status === 200 && notiRes.data?.length > 0) {
                    setShowNotificationModal(true);

                    // Kiểm tra xem đã hiện modal hôm nay chưa
                    const today = new Date().toDateString();
                    const lastShownDate = await AsyncStorage.getItem('lastNotificationModalShown');

                    if (lastShownDate !== today && !hasShownNotificationModal) {
                        setShowNotificationModal(true);
                        setHasShownNotificationModal(true);
                        await AsyncStorage.setItem('lastNotificationModalShown', today);
                    }
                }
                setStats({
                    owed: 1250000,
                    owes: 850000,
                    totalGroups: 8,
                    recentActivity: 3
                });
                const groupRes = await axiosClient.get(`trip/account/${response.data.accountId}`);
                if (groupRes.status === 200) {
                    const sortedTrips = groupRes.data.sort((a, b) => {
                        return new Date(a.startDate) - new Date(b.startDate);
                    });
                    setGroups(sortedTrips);
                }
            }

        } catch (error) {

            Toast.show({
                type: 'error',
                text1: 'Lỗi tải dữ liệu',
                text2: 'Không thể tải thông tin người dùng. Vui lòng thử lại sau.'
            });
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

    const handlePressGroup = (group) => () => {
        navigation.navigate('Summary', { tripId: group?.tripId });
    };

    const handleCloseNotificationModal = async () => {
        setShowNotificationModal(false);
        setHasShownNotificationModal(true);
        const today = new Date().toDateString();
        await AsyncStorage.setItem('lastNotificationModalShown', today);
    };

    const handleGoToNotifications = async () => {
        setShowNotificationModal(false);
        setHasShownNotificationModal(true);

        const today = new Date().toDateString();
        await AsyncStorage.setItem('lastNotificationModalShown', today);
        navigation.navigate('Notification');
    };



    return (
        <>
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

                <ScrollView
                    className="flex-1"
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingBottom: 70,

                    }}
                >
                    {/* Header Section */}
                    <LinearGradient
                        colors={['#667eea', '#764ba2']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{
                            paddingBottom: 40,
                            paddingTop: 20,
                            paddingHorizontal: 20,
                            borderBottomLeftRadius: 20,
                            borderBottomRightRadius: 20,
                            paddingHorizontal: 16,
                        }}
                    >
                        <View className="flex-row items-center justify-between mt-10 mb-6">
                            <View className="flex-1">
                                <Text className="text-white text-3xl font-bold">
                                    Xin chào! 👋
                                </Text>
                                <Text className="text-white/80 text-lg mt-1">
                                    {user?.email ? user.email.split('@')[0].replace(/\d+/g, '') : 'User'}
                                </Text>
                            </View>
                            <TouchableOpacity
                                className="w-12 h-12 bg-white/20 rounded-full items-center justify-center"
                                onPress={() => navigation.navigate('Notification')}
                            >
                                <Ionicons name="notifications-outline" size={24} color="white" />
                            </TouchableOpacity>
                        </View>

                        {/* Quick Stats */}
                        <View className="bg-white/10 rounded-2xl p-4 backdrop-blur">
                            <Text className="text-white/80 text-sm mb-3">Tổng quan tài chính</Text>
                            <View className="flex-row justify-between">
                                <View className="flex-1">
                                    <Text className="text-white text-2xl font-bold">
                                        {formatCurrency(stats.owed - stats.owes)}
                                    </Text>
                                    <Text className="text-white/70 text-sm">Số dư hiện tại</Text>
                                </View>
                                <View className="items-end">
                                    <Text className="text-white text-lg font-semibold">
                                        {groups.length || 0} nhóm
                                    </Text>
                                    <Text className="text-white/70 text-sm">Đang tham gia</Text>
                                </View>
                            </View>
                        </View>
                    </LinearGradient>

                    {/* Balance Cards */}
                    <View className="px-6 -mt-6 mb-6">
                        <View className="flex-row justify-between space-x-4">
                            {/* Được Trả Card */}
                            <AnimatedCard delay={100}>
                                <TouchableOpacity
                                    activeOpacity={0.9}
                                    onPressIn={() => handlePressIn('income')}
                                    onPressOut={handlePressOut}
                                    className="flex-1"
                                >
                                    <View
                                        className="bg-white rounded-2xl p-5"
                                        style={{
                                            shadowColor: '#10B981',
                                            shadowOffset: { width: 0, height: 4 },
                                            shadowOpacity: 0.15,
                                            shadowRadius: 12,
                                            elevation: 6,
                                            transform: [{ scale: pressedCard === 'income' ? 0.98 : 1 }]
                                        }}
                                    >
                                        <View className="flex-row items-center mb-3">
                                            <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center mr-3">
                                                <Ionicons name="trending-up" size={20} color="#10B981" />
                                            </View>
                                            <Text className="text-gray-600 font-medium">Được trả</Text>
                                        </View>
                                        <Text className="text-green-600 text-2xl font-bold mb-1">
                                            {formatCurrency(stats.owed)}
                                        </Text>
                                        <Text className="text-gray-400 text-sm">+12% so với tháng trước</Text>
                                    </View>
                                </TouchableOpacity>
                            </AnimatedCard>

                            {/* Phải Trả Card */}
                            <AnimatedCard delay={200}>
                                <TouchableOpacity
                                    activeOpacity={0.9}
                                    onPressIn={() => handlePressIn('expense')}
                                    onPressOut={handlePressOut}
                                    className="flex-1"
                                >
                                    <View
                                        className="bg-white rounded-2xl p-5"
                                        style={{
                                            shadowColor: '#EF4444',
                                            shadowOffset: { width: 0, height: 4 },
                                            shadowOpacity: 0.15,
                                            shadowRadius: 12,
                                            elevation: 6,
                                            transform: [{ scale: pressedCard === 'expense' ? 0.98 : 1 }]
                                        }}
                                    >
                                        <View className="flex-row items-center mb-3">
                                            <View className="w-10 h-10 bg-red-100 rounded-full items-center justify-center mr-3">
                                                <Ionicons name="trending-down" size={20} color="#EF4444" />
                                            </View>
                                            <Text className="text-gray-600 font-medium">Phải trả</Text>
                                        </View>
                                        <Text className="text-red-600 text-2xl font-bold mb-1">
                                            {formatCurrency(stats.owes)}
                                        </Text>
                                        <Text className="text-gray-400 text-sm">-8% so với tháng trước</Text>
                                    </View>
                                </TouchableOpacity>
                            </AnimatedCard>
                        </View>
                    </View>

                    {/* Quick Actions */}
                    {/* <View className="px-6 mb-6">
                        <Text className="text-gray-800 text-xl font-bold mb-4">Thao tác nhanh</Text>
                        <View className="flex-row justify-between">
                            {[
                                { icon: 'add-circle', title: 'Tạo nhóm', color: '#667eea', action: () => navigation.navigate('CreateGroup') },
                                { icon: 'receipt', title: 'Thêm bill', color: '#f093fb', action: () => console.log("tạo nhóm") },
                                { icon: 'scan', title: 'Quét bill', color: '#8B5CF6', action: () => console.log("quét bill") },
                                { icon: 'analytics', title: 'Thống kê', color: '#43e97b', action: () => navigation.navigate('Analytics') }
                            ].map((action, index) => (
                                <AnimatedCard key={index} delay={300 + index * 100}>
                                    <TouchableOpacity
                                        className="items-center"
                                        onPress={action.action}
                                    >
                                        <View
                                            className="w-16 h-16 rounded-2xl items-center justify-center mb-2"
                                            style={{ backgroundColor: `${action.color}20` }}
                                        >
                                            <Ionicons name={action.icon} size={28} color={action.color} />
                                        </View>
                                        <Text className="text-gray-600 text-sm font-medium text-center">
                                            {action.title}
                                        </Text>
                                    </TouchableOpacity>
                                </AnimatedCard>
                            ))}
                        </View>
                    </View> */}

                    {/* Feature Cards */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        className="mb-6 px-6"
                        contentContainerStyle={{ paddingRight: 16 }}
                    >
                        <View className="bg-[#CEECFE] rounded-xl w-72 p-4 mr-4 flex-row items-center justify-between">
                            <View className="flex-1 pr-2">
                                <Text className="text-base font-bold text-black mb-2">
                                    Bạn muốn bắt đầu chia bill cho chuyến đi nào hôm nay?
                                </Text>
                                <TouchableOpacity className="bg-indigo-500 px-3 py-2 rounded-full self-start">
                                    <Text className="text-white text-sm font-semibold">Bắt đầu ngay!</Text>
                                </TouchableOpacity>
                            </View>
                            <Image source={homepage1} className="w-28 h-28" resizeMode="cover" />
                        </View>

                        <View className="bg-[#CEECFE] rounded-xl w-72 p-4 mr-4 flex-row items-center justify-between">
                            <View className="flex-1 pr-2">
                                <Text className="text-base font-bold text-black mb-2">
                                    Hãy để EzBill gợi ý cho bạn những chuyến đi thú vị!
                                </Text>
                                <TouchableOpacity className="bg-indigo-500 px-3 py-2 rounded-full self-start">
                                    <Text className="text-white text-sm font-semibold">Khám phá thôi!</Text>
                                </TouchableOpacity>
                            </View>
                            <Image source={homepage2} className="w-28 h-28" resizeMode="cover" />
                        </View>
                    </ScrollView>

                    {/* Recent Groups */}
                    <View className="px-4 mb-6">
                        <View className="flex-row items-center justify-between mb-4">
                            <Text className="text-lg font-bold text-gray-800">Nhóm gần đây</Text>
                            <TouchableOpacity
                                className="flex-row items-center"
                                onPress={() => navigation.navigate('AllGroups')}
                            >
                                <Text className="text-blue-600 font-medium mr-1">Xem tất cả</Text>
                                <Ionicons name="chevron-forward" size={16} color="#2563EB" />
                            </TouchableOpacity>
                        </View>

                        <View className="space-y-3">
                            {groups.length > 0 ? (
                                loading ? (
                                    <ActivityIndicator size="large" color="#667eea" />
                                ) : (
                                    groups.slice(0, 3).map((group, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            className="bg-white rounded-lg p-4 mb-3"
                                            style={{
                                                shadowColor: '#000',
                                                shadowOffset: { width: 0, height: 1 },
                                                shadowOpacity: 0.1,
                                                shadowRadius: 3,
                                                elevation: 2
                                            }}
                                            onPress={handlePressGroup(group)}
                                        >
                                            <View className="flex-row items-center justify-between">
                                                <View className="flex-row items-center flex-1">
                                                    <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3">
                                                        <Ionicons name="people" size={20} color="#3B82F6" />
                                                    </View>
                                                    <View className="flex-1">
                                                        <Text className="text-gray-800 font-medium text-base">
                                                            {group.tripName}
                                                        </Text>
                                                        <Text className="text-gray-500 text-sm">
                                                            {group.members.length} thành viên
                                                        </Text>
                                                    </View>
                                                </View>
                                                {group.budget !== 0 && group.budget !== null && (
                                                    <Text className="text-gray-700 text-base font-semibold">
                                                        {formatCurrency(group?.budget)}
                                                    </Text>
                                                )}
                                            </View>
                                        </TouchableOpacity>
                                    ))
                                )
                            ) : (
                                <Notfound text="Bạn chưa có nhóm nào gần đây" />
                            )}

                        </View>
                    </View>

                    {/* Feedback Section */}
                    <View className="px-6 mb-8">
                        <View className="bg-purple-100 rounded-2xl p-4 flex-row items-center">
                            <View className="flex-1 pr-1">
                                <Text className="text-lg font-bold text-purple-800 mb-1">Lắng nghe</Text>
                                <Text className="text-sm text-purple-700">
                                    Team EzBill luôn trân trọng mọi ý kiến của bạn. Hãy cho chúng tôi biết về trải nghiệm của bạn với EzBill!
                                </Text>
                            </View>
                            <Image
                                source={homepage3}
                                className="w-28 h-28"
                                resizeMode="contain"
                            />
                        </View>
                    </View>
                </ScrollView>
            </View>

            {/* Notification Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={showNotificationModal}
                onRequestClose={handleCloseNotificationModal}
            >
                <View className="flex-1 justify-center items-center bg-black/50">
                    <View className="bg-white rounded-3xl p-6 mx-6 items-center relative" style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 10 },
                        shadowOpacity: 0.25,
                        shadowRadius: 20,
                        elevation: 10,
                        maxWidth: width * 1,
                    }}>
                        {/* Close Button */}
                        <TouchableOpacity
                            onPress={handleCloseNotificationModal}
                            className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full items-center justify-center"
                            style={{ zIndex: 10 }}
                        >
                            <Ionicons name="close" size={20} color="#6B7280" />
                        </TouchableOpacity>

                        <Text className="text-2xl text-black mt-6 font-semibold text-center ">
                            Thư ơi cho em xin 419k hôm bữa đi mò, chuyển tiền ăn lẩu hôm trước ý👉🏻👈🏻✨
                        </Text>
                        <View className="items-center mb-6">
                            <Image
                                source={test}
                                style={{ width: 160, height: 160 }}
                                resizeMode="contain"
                            />

                        </View>

                        {/* Content */}


                        {/* Action Buttons */}
                        <View className="w-full flex justify-center items-center">
                            <TouchableOpacity
                                onPress={handleGoToNotifications}
                                className="w-full mb-3 flex-col items-center justify-center"
                            >
                                <LinearGradient
                                    colors={['#667eea', '#764ba2']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}

                                    style={{
                                        shadowColor: '#667eea',
                                        shadowOffset: { width: 0, height: 4 },
                                        shadowOpacity: 0.3,
                                        shadowRadius: 8,
                                        elevation: 6,
                                        padding: 12,
                                        borderRadius: 24,
                                    }}
                                >
                                    <View className="flex-row items-center justify-center">
                                        <Ionicons name="notifications" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                                        <Text className="text-white text-lg font-bold">
                                            Xem thông báo
                                        </Text>
                                    </View>
                                </LinearGradient>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={handleCloseNotificationModal}
                                className="self-center py-3 px-6 bg-gray-100 rounded-2xl"
                            >
                                <Text className="text-gray-600 text-center font-semibold">
                                    Để sau
                                </Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </View>
            </Modal>
        </>
    )
}

export default HomeScreen