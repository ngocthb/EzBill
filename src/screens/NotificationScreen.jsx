import React, { useState, useRef, useEffect } from 'react';
import {
    Text,
    View,
    ScrollView,
    Image,
    Dimensions,
    TouchableOpacity,
    StatusBar,
    Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import axiosClient from '~/apis/axiosClient';
import Toast from 'react-native-toast-message';

const bg1 = require('../../assets/images/bg1.png');
const noti1 = require('../../assets/images/noti1.png');
const noti2 = require('../../assets/images/noti2.png');

const { width, height } = Dimensions.get('window');

const AnimatedNotification = ({ children, delay = 0 }) => {
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

const NotificationScreen = () => {
    const navigation = useNavigation();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [notifications, setNotifications] = useState([]);

    // Function to transform settlement data to notification format
    const transformSettlementToNotification = (settlement, index) => {
        const amount = new Intl.NumberFormat('vi-VN').format(settlement.amount);

        return {
            id: settlement.settlementId, // Ensure this is a string
            title: settlement.status === 'UNPAID' ? "Nhắc nhở thanh toán" : "Thanh toán thành công",
            message: settlement.status === 'UNPAID'
                ? `Bạn còn nợ ${amount}đ cần thanh toán`
                : `Bạn đã thanh toán ${amount}đ thành công`,
            time: "Vừa cập nhật",
            type: settlement.status === 'UNPAID' ? "reminder" : "payment",
            isRead: settlement.status === 'PAID', // PAID settlements are marked as read
            icon: settlement.status === 'UNPAID' ? "time" : "checkmark-circle",
            color: settlement.status === 'UNPAID' ? "#F59E0B" : "#10B981",
            settlementData: settlement // Keep original data for future use
        };
    };


    const fetchUserData = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get("profile");

            if (response.status === 200) {
                setUser(response.data);

                // Fetch settlement data for notifications
                const notiRes = await axiosClient.get(`Settlement/debtor/${response.data.accountId}`);
                if (notiRes.status === 200) {
                    // Transform settlement data to notification format
                    const transformedNotifications = notiRes.data.map((settlement, index) =>
                        transformSettlementToNotification(settlement, index)
                    );
                    setNotifications(transformedNotifications);
                } else {
                    // If no settlement data, show empty state
                    setNotifications([]);
                }
            }

        } catch (error) {
            console.log('Error fetching data:', error);
            // Set empty notifications on error
            setNotifications([]);

            Toast.show({
                type: 'error',
                text1: 'Lỗi tải dữ liệu',
                text2: 'Không thể tải thông tin thông báo. Vui lòng thử lại sau.'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            fetchUserData();
        }, [])
    );

    const handleMarkAsRead = (id) => {
        setNotifications(prev => {
            const updated = prev.map(notif =>
                notif.id === id ? { ...notif, isRead: true } : notif
            );

            return updated;
        });
    };

    const handleMarkAllAsRead = () => {
        setNotifications(prev =>
            prev.map(notif => ({ ...notif, isRead: true }))
        );
    };

    const handleNotificationPress = (notification) => {
        if (!notification.isRead) {
            handleMarkAsRead(notification.id);
        }


        if (notification.type === 'reminder' || notification.type === 'payment') {

        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

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

                            <View>
                                <Text className="text-white text-2xl font-bold">Thông báo</Text>
                                {unreadCount > 0 && (
                                    <Text className="text-white/80 text-sm font-medium">
                                        {unreadCount} thông báo mới
                                    </Text>
                                )}
                            </View>
                        </View>

                        {unreadCount > 0 && (
                            <TouchableOpacity
                                onPress={handleMarkAllAsRead}
                                className="px-4 py-2 bg-white/20 rounded-xl backdrop-blur-sm"
                            >
                                <Text className="text-white font-medium text-sm">Đánh dấu tất cả</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </LinearGradient>

                <ScrollView
                    className="flex-1 px-6"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100, paddingTop: 16 }}
                >
                    {notifications.length > 0 ? (
                        notifications.map((notification, index) => (
                            <AnimatedNotification key={notification.id} delay={index * 100}>
                                <TouchableOpacity
                                    onPress={() => handleNotificationPress(notification)}
                                    className={`bg-white rounded-2xl p-5 mb-4 ${!notification.isRead ? 'border-l-4' : ''
                                        }`}
                                    style={{
                                        borderLeftColor: !notification.isRead ? notification.color : 'transparent',
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 4 },
                                        shadowOpacity: 0.1,
                                        shadowRadius: 12,
                                        elevation: 6
                                    }}
                                >
                                    <View className="flex-row items-start">
                                        <View
                                            className="w-14 h-14 rounded-2xl items-center justify-center mr-4"
                                            style={{ backgroundColor: `${notification.color}15` }}
                                        >
                                            <Image
                                                source={noti2}
                                                style={{ width: 40, height: 40 }}
                                                resizeMode="contain"
                                            />
                                        </View>

                                        <View className="flex-1">
                                            <View className="flex-row items-center justify-between mb-2">
                                                <Text className={`text-lg font-bold ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'
                                                    }`}>
                                                    {notification.title}
                                                </Text>
                                                {!notification.isRead && (
                                                    <View
                                                        className="w-3 h-3 rounded-full"
                                                        style={{ backgroundColor: notification.color }}
                                                    />
                                                )}
                                            </View>

                                            <Text className="text-gray-600 text-base mb-3 leading-6">
                                                {notification.message}
                                            </Text>

                                            {/* <View className="flex-row items-center justify-between">
                                                <View className="flex-row items-center">
                                                    <View
                                                        className="w-5 h-5 rounded-full items-center justify-center mr-2"
                                                        style={{ backgroundColor: '#F3F4F6' }}
                                                    >
                                                        <Ionicons name="time" size={12} color="#9CA3AF" />
                                                    </View>
                                                    <Text className="text-gray-500 text-sm font-medium">
                                                        {notification.time}
                                                    </Text>
                                                </View>


                                            </View> */}
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </AnimatedNotification>
                        ))
                    ) : (
                        <View className="flex-1 items-center justify-center py-20">
                            <LinearGradient
                                colors={['#667eea20', '#764ba220']}
                                className="w-32 h-32 rounded-3xl items-center justify-center mb-6"
                            >
                                <Ionicons name="notifications-outline" size={60} color="#667eea" />
                            </LinearGradient>
                            <Text className="text-gray-800 text-xl font-bold mb-3">
                                Chưa có thông báo
                            </Text>
                            <Text className="text-gray-500 text-base text-center px-8 leading-6">
                                Các thông báo về thanh toán, nhắc nhở và hoạt động nhóm sẽ hiển thị tại đây
                            </Text>
                        </View>
                    )}
                </ScrollView>
            </View>
        </>
    );
};

export default NotificationScreen;

